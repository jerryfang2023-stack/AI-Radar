#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataRoot = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4");
const output = path.join(dataRoot, "Data Center V4 Index.md");
const readJson = (file) => JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
const dates = () => fs.readdirSync(dataRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
  .map((entry) => entry.name)
  .sort();
const uniqueCount = (rows, key) => new Set(rows.map((item) => item?.[key]).filter(Boolean)).size;

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
      qa: readJson(path.join(dir, "qa-queue.json")),
    };
  });
  if (!days.length) throw new Error("No Data Center V4 daily bundles found.");
  const current = days.at(-1);
  const all = (key) => days.flatMap((day) => day[key]);
  const lines = [
    "---",
    "type: data_center_v4_index",
    "status: current",
    `updated_at: ${current.manifest.generated_at}`,
    `current_date: ${current.date}`,
    "product_version: SITE-V4.3.0-compatibility-retired",
    "raw_version: RAW-V3.0",
    "event_version: EVENT-V1.1",
    "---",
    "",
    "# Data Center V4 Index",
    "",
    "> 当前事实数据与本地 Obsidian 入口。RawDocument 保存来源文本，CanonicalEvent 保存通过 V4 合同的事实。",
    "",
    "## Current snapshot",
    "",
    `- current bundle: [[${current.date}/manifest.json]]`,
    `- SourceArtifact: ${uniqueCount(all("sources"), "source_artifact_id")}`,
    `- RawDocument: ${uniqueCount(all("raws"), "raw_id")}`,
    `- Claim: ${uniqueCount(all("claims"), "claim_id")}`,
    `- CanonicalEvent: ${uniqueCount(all("events"), "event_id")}`,
    `- QA items: ${uniqueCount(all("qa"), "qa_id")}`,
    "",
    "## Navigation",
    "",
    "- [[../../09-fde/Enterprise AI FDE Index|Enterprise AI / FDE Index]]",
    "- [[../../10-ai-hardware/AI Hardware Index|AI Hardware Index]]",
    "",
    "## Daily bundles",
    "",
    "| date | Raw | Claims | Events | QA | files |",
    "|---|---:|---:|---:|---:|---|",
    ...days.slice().reverse().map((day) => {
      const counts = day.manifest.counts;
      return `| ${day.date} | ${counts.raw_documents} | ${counts.claims} | ${counts.canonical_events} | ${counts.qa_queue} | [[${day.date}/raw-documents.json|Raw]] · [[${day.date}/canonical-events.json|Events]] · [[${day.date}/qa-queue.json|QA]] |`;
    }),
    "",
    "## Object boundaries",
    "",
    "- RawDocument：原始材料的结构化保存，不代表已经形成商业事件。",
    "- CanonicalEvent：通过 Claim 与 SourceArtifact 引用形成的 V4 事实事件。",
    "- V3 compatibility Cards、desk 与旧 graph 已彻底退役，不再生成、同步或建立索引。",
    "",
  ];
  fs.writeFileSync(output, lines.join("\n"), "utf8");
  console.log(JSON.stringify({ output: path.relative(root, output).replace(/\\/gu, "/"), dates: days.length, current_date: current.date }, null, 2));
}

main();
