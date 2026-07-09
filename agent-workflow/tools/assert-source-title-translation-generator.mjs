import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  loadSourceTitleTranslations,
  resolveSourceTitleTranslation,
  titleTranslationKey,
} from "./source-title-translation-generator.mjs";

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-title-translation-"));
const translationFile = path.join(tempDir, "source-title-translations.json");
fs.writeFileSync(translationFile, JSON.stringify({
  version: "source-title-translations-v1",
  translations: [],
}, null, 2), "utf8");

const sourceTitle = "ExampleAI raises $12M Series A to expand enterprise agent platform";
const expectedZh = "ExampleAI 完成 1200 万美元 A 轮融资，用于扩展企业智能体平台";

const result = await resolveSourceTitleTranslation(sourceTitle, {
  translationFile,
  sourceUrl: "https://example.com/exampleai-series-a",
  allowNetwork: true,
  generator: async () => ({
    titleZh: expectedZh,
    status: "translated",
    method: "test_title_translation_generator",
  }),
});

const translations = loadSourceTitleTranslations(translationFile);
const cached = translations.get(titleTranslationKey(sourceTitle));

const ok =
  result.status === "translated" &&
  result.titleZh === expectedZh &&
  result.method === "test_title_translation_generator" &&
  cached === expectedZh;

fs.rmSync(tempDir, { recursive: true, force: true });

if (!ok) {
  console.error(JSON.stringify({
    ok: false,
    result,
    cached,
    reason: "English source title was not generated and persisted when the exact translation DB entry was missing.",
  }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  status: "passed",
  checked: "raw_source_title_translation_generator",
  method: result.method,
}, null, 2));
