#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const output = path.join(dataRoot, "Data Center V4 Index.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function dates() {
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name).sort();
}

function uniqueCount(rows, key) {
  return new Set(rows.map((item) => item?.[key]).filter(Boolean)).size;
}

function main() {
  const days = dates().map((date) => {
    const dir = path.join(dataRoot, date);
    return {
      date,
      manifest: readJson(path.join(dir, "manifest.json")),
      sources: readJson(path.join(dir, "source-artifacts.json")),
      raws: readJson(path.join(dir, "raw-documents.json")),
      claims: readJson(path.join(dir, "claims.json")),
      events: readJson(path.join(dir, "canonical-events.json")),
      cards: readJson(path.join(dir, "compatibility-cards.json")),
      qa: readJson(path.join(dir, "qa-queue.json"))
    };
  });
  if (!days.length) throw new Error("No Data Center V4 daily bundles found.");

  const allSources = days.flatMap((day) => day.sources);
  const allRaws = days.flatMap((day) => day.raws);
  const allClaims = days.flatMap((day) => day.claims);
  const allEvents = days.flatMap((day) => day.events);
  const allCards = days.flatMap((day) => day.cards);
  const allQa = days.flatMap((day) => day.qa);
  const current = days.at(-1);
  const lines = [
    "---",
    "type: data_center_v4_index",
    "status: current",
    `updated_at: ${current.manifest.generated_at}`,
    `current_date: ${current.date}`,
    "product_version: SITE-V4.2.0-entity-history",
    "raw_version: RAW-V3.0",
    "event_version: EVENT-V1.1",
    "---",
    "",
    "# Data Center V4 Index",
    "",
    "> 当前事实数据库与本地 Obsidian 入口。RawDocument 保存来源文本，CanonicalEvent 保存通过 V4 合同的商业事实；旧 Signal Card 只作为兼容资产。",
    "",
    "## Current snapshot",
    "",
    `- current bundle: [[${current.date}/manifest.json]]`,
    `- SourceArtifact: ${uniqueCount(allSources, "source_artifact_id")}`,
    `- RawDocument: ${uniqueCount(allRaws, "raw_id")}`,
    `- Claim: ${uniqueCount(allClaims, "claim_id")}`,
    `- CanonicalEvent: ${uniqueCount(allEvents, "event_id")}`,
    `- public compatibility projection: ${uniqueCount(allCards, "event_id")}`,
    `- QA items: ${uniqueCount(allQa, "qa_id")}`,
    "",
    "## Navigation",
    "",
    "- [[legacy-card-event-mappings|旧 Signal Card → V4 商业事件映射]]",
    "- [[../../../knowledge/01-Signal-Cards/README|旧 Signal Card 兼容档案说明]]",
    "- [[../../09-fde/Enterprise AI FDE Index|Enterprise AI / FDE Index]]",
    "- [[../../10-ai-hardware/AI Hardware Index|AI Hardware Index]]",
    "",
    "## Daily bundles",
    "",
    "| date | Raw | Claims | Events | Public | QA | files |",
    "|---|---:|---:|---:|---:|---:|---|",
    ...days.slice().reverse().map((day) => {
      const counts = day.manifest.counts;
      return `| ${day.date} | ${counts.raw_documents} | ${counts.claims} | ${counts.canonical_events} | ${counts.compatibility_cards} | ${counts.qa_queue} | [[${day.date}/raw-documents.json|Raw]] · [[${day.date}/canonical-events.json|Events]] · [[${day.date}/qa-queue.json|QA]] |`;
    }),
    "",
    "## Object boundaries",
    "",
    "- RawDocument：原始材料的结构化保存，不代表已形成商业事件。",
    "- CanonicalEvent：通过 Claim 与 SourceArtifact 引用形成的 V4 事实事件。",
    "- Compatibility Card：由 CanonicalEvent 一对一生成的旧页面兼容投影，不是旧 Markdown Signal Card。",
    "- Legacy Signal Card：V3 内部候选与解释资产，只能通过映射表判断是否对应 V4 事件。",
    ""
  ];
  fs.writeFileSync(output, lines.join("\n"), "utf8");
  console.log(JSON.stringify({ output: path.relative(root, output).replace(/\\/gu, "/"), dates: days.length, current_date: current.date }, null, 2));
}

main();
