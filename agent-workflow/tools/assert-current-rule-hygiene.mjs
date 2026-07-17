import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || new Date().toISOString().slice(0, 10);

const retiredTerms = [
  "daily_observation",
  "business_brief",
  "trend_report",
  "publiccopy",
  "cardcopy",
  "frontend_copy_gate",
  "cardcopy_gate",
  "paused-opinion-source",
  "今日观察",
  "每日观察",
  "商业内参",
  "趋势报告",
];

const retiredDataTerms = [
  ...retiredTerms,
  "site-content.json",
  "site-content.js",
];

const mojibakeMarkers = [
  "\u947e\u5cf0\u7df1",
  "\u93c9\u30e6\u7c2e",
  "\u93c4\u5267\u305a",
  "\u6d7c\u4f77\u7b1f",
  "\u935f\u55d5\u7b1f",
  "\u93af\u546e",
  "\u5bf0\u546f",
  "\u9359\u621d\u7af7",
  "\u94fb\u5d88\u796b",
  "\u7039\u5c7e\u579a",
  "\u934f\ue100\u7d11",
  "\u6769\u501f\u91dc",
  "\u9358\u71b8\u6783",
  "\u9422\u3129\u20ac",
  "\u6d93\u6c2c\u59df",
  "\u6d5c\u0443\u6427",
  "\u59af\u2033\u7037",
  "\u93ba\u3125\u56ad",
  "\u5bee\u20ac\u9359",
  "\u93c5\u9e3f\u5158",
  "\ufffd",
];

const retiredAllowlist = new Set([
  "agent-workflow/tools/assert-current-rule-hygiene.mjs",
  "agent-workflow/tools/frontstage-regression-gate.mjs",
]);

const rawToCardRuleFiles = [
  "context/00-current-state.md",
  "context/05-daily-monitoring.md",
  "context/06-execution-harness.md",
  "context/07-v3-intelligence-generation-rules.md",
  "context/08-v3-3-automation.md",
  "context/11-hermes-daily-supervision-instructions.md",
  "context/frontstage-page-contracts.md",
  ".github/workflows/daily-persistent-assets-pr.yml",
  ".github/workflows/daily-production-chain-dry-run.yml",
  "agent-workflow/automation-prompts/guanlan-daily-monitor.md",
  "agent-workflow/tools/generate-asset-cards-from-pool.mjs",
  "agent-workflow/skills/skill-registry.md",
  "agent-workflow/skills/guanlan-raw-pool-card",
  "agent-workflow/skills/guanlan-business-signals-monitor",
  "agent-workflow/skills/guanlan-monitor-quality-gate/evals/monitor-quality-gate-evals.md",
];

const rawToCardForbiddenPatterns = [
  { pattern: /frontstage-top10-target/u, term: "frontstage-top10-target" },
  { pattern: /pool_core_supply_release/u, term: "pool_core_supply_release" },
  { pattern: /all_qualified_core_pool/u, term: "all_qualified_core_pool" },
  { pattern: /core_pool_not_promoted/u, term: "core_pool_not_promoted" },
  { pattern: /all qualified Core Pool/iu, term: "all qualified Core Pool" },
  { pattern: /qualified Core Pool items/iu, term: "qualified Core Pool items" },
  { pattern: /usable `core_pool`/iu, term: "usable `core_pool`" },
  { pattern: /`core_pool` must/iu, term: "`core_pool` must" },
  { pattern: /Core Pool count/iu, term: "Core Pool count" },
  { pattern: /non-large Core/iu, term: "non-large Core" },
  { pattern: /Pool\/Core\/Top10/iu, term: "Pool/Core/Top10" },
  { pattern: /Pool\/Core\/Card/iu, term: "Pool/Core/Card" },
];

const v4PublicRuleFiles = [
  "context/01-product-map.md",
  "context/version-ledger.md",
];

const v4PublicForbiddenPatterns = [
  { pattern: /Frozen compatibility frontstage/iu, term: "Frozen compatibility frontstage" },
  { pattern: /Its public page presents/iu, term: "Its public page presents" },
  { pattern: /A Card can enter the frontstage/iu, term: "A Card can enter the frontstage" },
  { pattern: /TAG-V3 owners/iu, term: "TAG-V3 owners" },
];

const activeRoots = [
  "AGENTS.md",
  "context",
  "01-SiteV2/README.md",
  "01-SiteV2/content/README.md",
  "01-SiteV2/knowledge/README.md",
  "01-SiteV2/knowledge/10-Templates",
  ".github/workflows",
  "agent-workflow/tools",
  "01-SiteV2/site/scripts",
  "01-SiteV2/content/11-databases/source-title-translations.json",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/intelligence-graph-index.json",
];

const currentCardRoots = [
  "01-SiteV2/knowledge/01-Signal-Cards/funding",
  "01-SiteV2/knowledge/01-Signal-Cards/case",
  "01-SiteV2/knowledge/01-Signal-Cards/product-service",
];

const exts = new Set([".md", ".mjs", ".js", ".json", ".yml", ".yaml", ".toml", ".ps1"]);

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function filesUnder(target) {
  const full = path.join(root, target);
  if (!fs.existsSync(full)) return [];
  const stat = fs.statSync(full);
  if (stat.isFile()) return [full];
  const out = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const child = path.join(full, entry.name);
    if (entry.isDirectory()) out.push(...filesUnder(rel(child)));
    else if (exts.has(path.extname(entry.name))) out.push(child);
  }
  return out;
}

function currentCardFiles() {
  return currentCardRoots.flatMap((dir) => filesUnder(dir))
    .filter((file) => path.basename(file).startsWith(`${date}--signal--`));
}

function currentRawPoolFiles() {
  return [
    `01-SiteV2/content/01-raw/${date}-raw-candidates.md`,
    `01-SiteV2/content/02-pool/${date}-pool-candidates.md`,
    `01-SiteV2/content/01-raw/originals/${date}`,
  ].flatMap(filesUnder);
}

function scanFile(file, terms, kind) {
  const text = fs.readFileSync(file, "utf8");
  const hits = [];
  const lines = text.split(/\r?\n/u);
  for (const term of terms) {
    lines.forEach((line, index) => {
      if (kind === "retired_term" && isProtectiveRetiredLine(line)) return;
      if (line.includes(term)) hits.push({ kind, file: rel(file), line: index + 1, term });
    });
  }
  return hits;
}

function scanFilePatterns(file, patterns, kind) {
  const text = fs.readFileSync(file, "utf8");
  const hits = [];
  const lines = text.split(/\r?\n/u);
  for (const item of patterns) {
    lines.forEach((line, index) => {
      if (item.pattern.test(line)) {
        hits.push({ kind, file: rel(file), line: index + 1, term: item.term });
      }
    });
  }
  return hits;
}

function workflowRawToCardHits(file) {
  const text = fs.readFileSync(file, "utf8");
  if (!text.includes("generate-asset-cards-from-pool.mjs")) return [];
  const lines = text.split(/\r?\n/u);
  const hits = [];
  lines.forEach((line, index) => {
    if (!line.includes("generate-asset-cards-from-pool.mjs")) return;
    if (/node\s+--check/u.test(line)) return;
    const windowText = lines.slice(index, index + 8).join("\n");
    if (!/--from-raw=true/u.test(windowText)) {
      hits.push({
        kind: "raw_to_card_rule_conflict",
        file: rel(file),
        line: index + 1,
        term: "generate-asset-cards-from-pool without --from-raw=true",
      });
    }
  });
  return hits;
}

function isProtectiveRetiredLine(line) {
  const normalized = line.toLowerCase();
  return [
    "retired",
    "not active",
    "not current",
    "do not",
    "must not",
    "mustn't",
    "cannot",
    "forbid",
    "forbidden",
    "only as audit",
    "archive",
    "not from",
    "not use",
    "retire",
    "old",
  ].some((marker) => normalized.includes(marker));
}

function main() {
  const activeFiles = [...new Set([...activeRoots.flatMap(filesUnder), ...currentCardFiles()])];
  const rawToCardRuleScanFiles = [...new Set(rawToCardRuleFiles.flatMap(filesUnder))];
  const dataFiles = [...new Set(currentRawPoolFiles())];
  const retiredHits = activeFiles
    .filter((file) => !retiredAllowlist.has(rel(file)))
    .flatMap((file) => scanFile(file, retiredTerms, "retired_term"));
  const retiredDataHits = dataFiles.flatMap((file) => scanFile(file, retiredDataTerms, "retired_data_term"));
  const mojibakeHits = [...activeFiles, ...dataFiles].flatMap((file) => scanFile(file, mojibakeMarkers, "text_contamination"));
  const rawToCardRuleHits = rawToCardRuleScanFiles
    .filter((file) => !retiredAllowlist.has(rel(file)))
    .flatMap((file) => scanFilePatterns(file, rawToCardForbiddenPatterns, "raw_to_card_rule_conflict"));
  const workflowHits = rawToCardRuleScanFiles
    .filter((file) => [".yml", ".yaml"].includes(path.extname(file)))
    .flatMap(workflowRawToCardHits);
  const v4PublicRuleHits = v4PublicRuleFiles.flatMap(filesUnder)
    .flatMap((file) => scanFilePatterns(file, v4PublicForbiddenPatterns, "v4_public_rule_conflict"));
  const issues = [...retiredHits, ...retiredDataHits, ...mojibakeHits, ...rawToCardRuleHits, ...workflowHits, ...v4PublicRuleHits];
  const result = {
    ok: issues.length === 0,
    date,
    scanned_file_count: activeFiles.length + dataFiles.length,
    issue_count: issues.length,
    issues,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main();
