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
const primeIntellect = await generateSourceTitleTranslation(
  "Prime Intellect raises $130M at $1B valuation for its AI training platform - SiliconANGLE",
  { provider: "business-rule", allowNetwork: true }
);
const neuralTrust = await generateSourceTitleTranslation(
  "NeuralTrust raises $20M to secure the growing swarm of AI agents in the enterprise | NeuralTrust",
  { provider: "business-rule", allowNetwork: true }
);
const talp = await generateSourceTitleTranslation(
  "Meet Talp: AI startup with Turkish roots raising $20M pre-seed valuation to simulate customers with AI personas — TFN",
  { provider: "business-rule", allowNetwork: true }
);
const lyzr = await generateSourceTitleTranslation(
  "Lyzr AI Raises $100 Million Series B After Its Own AI Agent SivaClaw Fielded 130-Plus Investors And Generated $400 Million In Interest",
  { provider: "business-rule", allowNetwork: true }
);
const alta = await generateSourceTitleTranslation(
  "Alta Raises $25M to Redefine the Go-to-Market Architecture for Revenue Teams",
  { provider: "business-rule", allowNetwork: true }
);
const githubSecretScanning = await generateSourceTitleTranslation(
  "How GitHub used secret scanning to reach inbox zero",
  { provider: "business-rule", allowNetwork: true }
);
const lyzrFundraiseProcess = await generateSourceTitleTranslation(
  "Lyzr's AI agent ran its own $100M Series B fundraise — AI Chat Daily",
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
  primeIntellect.titleZh === "Prime Intellect 完成 1.3 亿美元融资，估值 10 亿美元，用于 AI 训练平台" &&
  neuralTrust.titleZh === "NeuralTrust 完成 2000 万美元融资，用于保护企业不断增长的 AI 智能体集群" &&
  talp.titleZh === "Talp 以 2000 万美元估值完成种子前轮融资，用于通过 AI 虚拟用户模拟客户反应" &&
  lyzr.titleZh === "Lyzr AI 完成 1 亿美元 B 轮融资，其 AI 智能体参与融资流程" &&
  alta.titleZh === "Alta 完成 2500 万美元融资，用于重塑收入团队的市场进入架构" &&
  githubSecretScanning.titleZh === "GitHub 使用秘密扫描，在九个月内清零安全告警积压" &&
  lyzrFundraiseProcess.titleZh === "Lyzr 的 AI 智能体参与其 1 亿美元 B 轮融资流程" &&
  legacyMachineTranslations.size === 0;

fs.rmSync(tempDir, { recursive: true, force: true });

if (!ok) {
  console.error(JSON.stringify({
    ok: false,
    result,
    cached,
    taskade,
    stigg,
    primeIntellect,
    neuralTrust,
    talp,
    lyzr,
    alta,
    githubSecretScanning,
    lyzrFundraiseProcess,
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
