import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  generateSourceTitleTranslation,
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

const taskade = await generateSourceTitleTranslation(
  "Introducing Taskade TSK-1: The Taskade System Kernel (2026) | Taskade Blog",
  { provider: "business-rule", allowNetwork: true }
);
const stigg = await generateSourceTitleTranslation(
  "Announcing Stigg 2.0 - The Usage Runtime for AI Products",
  { provider: "business-rule", allowNetwork: true }
);

const legacyMachineTranslationFile = path.join(tempDir, "legacy-machine-translations.json");
fs.writeFileSync(legacyMachineTranslationFile, JSON.stringify({
  version: "source-title-translations-v1",
  translations: [{
    sourceTitle: "Hippocratic AI: A Safety-First LLM for Healthcare",
    zhTitle: "Hippocratic AI：医疗保健安全第一法学硕士",
    generatedBy: "mymemory_title_translation",
  }],
}, null, 2), "utf8");
const legacyMachineTranslations = loadSourceTitleTranslations(legacyMachineTranslationFile);

const ok =
  result.status === "translated" &&
  result.titleZh === expectedZh &&
  result.method === "test_title_translation_generator" &&
  cached === expectedZh &&
  taskade.titleZh === "Taskade 发布 TSK-1 系统内核，为工作区应用提供统一智能运行层" &&
  stigg.titleZh === "Stigg 发布 2.0：面向 AI 产品的用量运行时" &&
  legacyMachineTranslations.size === 0;

fs.rmSync(tempDir, { recursive: true, force: true });

if (!ok) {
  console.error(JSON.stringify({
    ok: false,
    result,
    cached,
    taskade,
    stigg,
    legacyMachineTranslationCount: legacyMachineTranslations.size,
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
