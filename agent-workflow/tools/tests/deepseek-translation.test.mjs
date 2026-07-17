import assert from "node:assert/strict";
import test from "node:test";
import {
  opinionTranslationProblems,
  selectDeepSeekModel,
  sourceTextHash,
  translateOpinionWithDeepSeek,
} from "../deepseek-translation-client.mjs";
import { translateOpinionText } from "../opinion-translation-utils.mjs";
import { sourceTitleFactsPreserved } from "../source-title-translation-generator.mjs";

test("routes short text to Flash and long multi-paragraph text to Pro", () => {
  const env = { DEEPSEEK_FLASH_MODEL: "flash", DEEPSEEK_PRO_MODEL: "pro" };
  assert.equal(selectDeepSeekModel("Short source title", { env }), "flash");
  assert.equal(selectDeepSeekModel("one\n\ntwo\n\nthree", { env }), "pro");
  assert.equal(selectDeepSeekModel("short", { env, preferPro: true }), "pro");
});

test("translation quality preserves URL, handle, version, and amount", () => {
  const source = "@OpenAI shipped GPT-5.6 for $5.5M https://example.com/x";
  const good = "@OpenAI 发布 GPT-5.6，金额为 $5.5M https://example.com/x";
  assert.deepEqual(opinionTranslationProblems(source, good), []);
  assert.match(opinionTranslationProblems(source, "OpenAI 发布了新版本").join(" "), /missing_/u);
});

test("accepts faithful URL-heavy translations with four Chinese characters", () => {
  const source = "Watch: https://example.com/a @OpenAI";
  const translation = "观看链接：https://example.com/a @OpenAI";
  assert.deepEqual(opinionTranslationProblems(source, translation), []);
});

test("retries a failed Flash translation with Pro", async () => {
  const previous = {
    key: process.env.DEEPSEEK_API_KEY,
    flash: process.env.DEEPSEEK_FLASH_MODEL,
    pro: process.env.DEEPSEEK_PRO_MODEL,
  };
  process.env.DEEPSEEK_API_KEY = "test-key";
  process.env.DEEPSEEK_FLASH_MODEL = "flash";
  process.env.DEEPSEEK_PRO_MODEL = "pro";
  const models = [];
  const fetchImpl = async (_url, options) => {
    const body = JSON.parse(options.body);
    models.push(body.model);
    const content = body.model === "flash"
      ? "这是缺少链接的译文"
      : "这是完整译文 https://example.com/a";
    return { ok: true, json: async () => ({ choices: [{ message: { content } }] }) };
  };
  try {
    const result = await translateOpinionWithDeepSeek("Translate this https://example.com/a", { fetchImpl });
    assert.equal(result.status, "translated");
    assert.equal(result.model, "pro");
    assert.equal(result.qualityStatus, "passed_after_pro_retry");
    assert.deepEqual(models, ["flash", "pro"]);
  } finally {
    if (previous.key === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = previous.key;
    if (previous.flash === undefined) delete process.env.DEEPSEEK_FLASH_MODEL; else process.env.DEEPSEEK_FLASH_MODEL = previous.flash;
    if (previous.pro === undefined) delete process.env.DEEPSEEK_PRO_MODEL; else process.env.DEEPSEEK_PRO_MODEL = previous.pro;
  }
});

test("does not reuse legacy MyMemory cache entries", async () => {
  const source = "A source that needs translation";
  const cache = {
    item: {
      translation: "一个旧译文",
      status: "translated",
      method: "mymemory",
      sourceHash: sourceTextHash(source),
    },
  };
  const result = await translateOpinionText(source, { cache, cacheKey: "item", allowNetwork: false });
  assert.equal(result.status, "pending_translation");
  assert.equal(result.method, "translation_network_disabled");
});

test("treats Indian lakh and Chinese wan counts as equivalent", () => {
  assert.equal(sourceTitleFactsPreserved(
    "VANI powers over 1 Lakh conversations daily",
    "VANI 每天支持超过 10 万次对话",
  ), true);
});

test("preserves multiplier words and scaled non-money counts", () => {
  assert.equal(sourceTitleFactsPreserved("improves reliability 20x", "将可靠性提升 20 倍"), true);
  assert.equal(sourceTitleFactsPreserved("serves 1.6 million residents", "服务 160 万居民"), true);
  assert.equal(sourceTitleFactsPreserved("matches models five times its size", "媲美其规模五倍的模型"), true);
});

test("repairs protected facts omitted by both model passes", async () => {
  const previous = { key: process.env.DEEPSEEK_API_KEY, flash: process.env.DEEPSEEK_FLASH_MODEL, pro: process.env.DEEPSEEK_PRO_MODEL };
  process.env.DEEPSEEK_API_KEY = "test-key";
  process.env.DEEPSEEK_FLASH_MODEL = "flash";
  process.env.DEEPSEEK_PRO_MODEL = "pro";
  const fetchImpl = async () => ({ ok: true, json: async () => ({ choices: [{ message: { content: "企业将扩大投入。" } }] }) });
  try {
    const result = await translateOpinionWithDeepSeek("Companies will expand 100s of programs with @box", { fetchImpl, preferPro: true });
    assert.equal(result.status, "translated");
    assert.match(result.translation, /100/u);
    assert.match(result.translation, /@box/u);
  } finally {
    if (previous.key === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = previous.key;
    if (previous.flash === undefined) delete process.env.DEEPSEEK_FLASH_MODEL; else process.env.DEEPSEEK_FLASH_MODEL = previous.flash;
    if (previous.pro === undefined) delete process.env.DEEPSEEK_PRO_MODEL; else process.env.DEEPSEEK_PRO_MODEL = previous.pro;
  }
});
