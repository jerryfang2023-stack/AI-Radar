import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  generateSourceTitleTranslation,
  isApprovedSourceTitleTranslation,
  loadSourceTitleTranslations,
  sourceTitleFactsPreserved,
  upsertSourceTitleTranslation,
} from "./source-title-translation-generator.mjs";

const previousKey = process.env.DEEPSEEK_API_KEY;
const previousModel = process.env.DEEPSEEK_FLASH_MODEL;
const previousFetch = globalThis.fetch;
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-deepseek-title-"));
const translationFile = path.join(tempDir, "source-title-translations.json");

try {
  process.env.DEEPSEEK_API_KEY = "test-key";
  process.env.DEEPSEEK_FLASH_MODEL = "deepseek-v4-flash";
  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({ choices: [{ message: { content: "Aina 从 Info Edge 等投资方获得 550 万美元融资，用于打造 AI 硬件界面" } }] }),
  });
  const sourceTitle = "Aina Raises $5.5 Mn From Info Edge, Others To Build AI Hardware Interface";
  const result = await generateSourceTitleTranslation(sourceTitle, { provider: "deepseek" });
  assert.equal(result.status, "translated");
  assert.equal(result.method, "deepseek_title_translation");
  assert.equal(sourceTitleFactsPreserved(sourceTitle, result.titleZh), true);
  assert.equal(isApprovedSourceTitleTranslation({ generatedBy: result.method }), true);
  assert.equal(isApprovedSourceTitleTranslation({ generatedBy: "business-rule_title_translation" }), false);
  assert.equal(isApprovedSourceTitleTranslation({ generatedBy: "mymemory_title_translation" }), false);
  upsertSourceTitleTranslation(translationFile, { sourceTitle, zhTitle: result.titleZh, method: result.method, model: result.model });
  assert.equal(loadSourceTitleTranslations(translationFile).get(sourceTitle.toLowerCase()), result.titleZh);
  console.log(JSON.stringify({ ok: true, provider: "deepseek", protected_facts: "passed" }, null, 2));
} finally {
  globalThis.fetch = previousFetch;
  if (previousKey === undefined) delete process.env.DEEPSEEK_API_KEY; else process.env.DEEPSEEK_API_KEY = previousKey;
  if (previousModel === undefined) delete process.env.DEEPSEEK_FLASH_MODEL; else process.env.DEEPSEEK_FLASH_MODEL = previousModel;
  fs.rmSync(tempDir, { recursive: true, force: true });
}
