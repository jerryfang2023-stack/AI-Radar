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
  "\u7039\u3221\u57db",
  "\u5997\u581c\u7de5",
  "\u95b2\u56ea\u5598",
  "\u93c0\u60f0\u5598",
  "\u7ec2\u4f77\u62a4",
  "\u9225\u6a9a",
  "\u951d\u6e31",
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

const currentGovernanceRuleFiles = [
  "agent-workflow/README.md",
  "agent-workflow/tools/write-daily-supervision-report.mjs",
  "agent-workflow/tools/assert-daily-production-chain.mjs",
  "agent-workflow/tools/write-weekly-health-report.mjs",
  "agent-workflow/skills/guanlan-first-line-viewpoints-monitor",
  "agent-workflow/skills/guanlan-community-intelligence-monitor",
  "agent-workflow/skills/guanlan-fde-data-projection",
  "agent-workflow/skills/guanlan-skill-editor",
];

const currentGovernanceForbiddenPatterns = [
  { pattern: /08:57 primary production/iu, term: "retired 08:57 Business production schedule" },
  { pattern: /09:27 conditional health dispatch/iu, term: "retired 09:27 Business recovery schedule" },
  { pattern: /09:17 (?:GitHub|conditional) fallback/iu, term: "retired 09:17 First-Line fallback schedule" },
  { pattern: /08:45\s*\/\s*09:35 GitHub publish windows/iu, term: "retired Community GitHub publish windows" },
  { pattern: /09:40 no-Hermes/iu, term: "retired standalone 09:40 self-check" },
  { pattern: /09:58 publication closure/iu, term: "retired 09:58 publication closure" },
  { pattern: /formal Business Signals Top10/iu, term: "retired formal Business Signals Top10" },
  { pattern: /conflict with V3\.3/iu, term: "V3.3 used as current conflict authority" },
  { pattern: /V3\.3 business-signal rules are current/iu, term: "V3.3 used as current factual rule source" },
  { pattern: /current V3\.3 rules/iu, term: "V3.3 used as current rule source" },
  { pattern: /same-date Community Intelligence automation PR already merged/iu, term: "merged Community PR treated as a warning" },
  { pattern: /Regenerate same-date Card\s*\/\s*Trend Candidate\s*\/\s*site data/iu, term: "retired daily Trend Candidate regeneration instruction" },
  { pattern: /missing intelligence map data/iu, term: "retired Intelligence Map supervision label" },
  { pattern: /Business Signals\s*\/\s*Intelligence Map\s*\/\s*Dashboard/iu, term: "retired combined Business Signals / Intelligence Map / Dashboard ownership" },
];

const frontstageIntegrationTestFiles = [
  "agent-workflow/tools/tests/data-center-frontstage.test.mjs",
];

const frontstageIntegrationForbiddenPatterns = [
  { pattern: /source-title-translations\.json/iu, term: "frontstage integration test reads mutable production title registry" },
  { pattern: /Aina raises \$5\.5M with new hardware interface/iu, term: "frontstage integration test pins named historical Aina article" },
  { pattern: /OMAP-V1\.0\.0-independent-column/iu, term: "frontstage integration test pins superseded Opportunity Map version" },
];

const activeRoots = [
  "AGENTS.md",
  "context",
  "01-SiteV2/README.md",
  "01-SiteV2/content/README.md",
  "docs/obsidian-vault.md",
  ".github/workflows",
  "agent-workflow/tools",
  "01-SiteV2/site/scripts",
  "01-SiteV2/content/11-databases/source-title-translations.json",
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
  const activeFiles = [...new Set(activeRoots.flatMap(filesUnder))];
  const dataFiles = filesUnder(`01-SiteV2/content/11-databases/data-center-v4/${date}`);
  const retiredHits = activeFiles
    .filter((file) => !retiredAllowlist.has(rel(file)))
    .flatMap((file) => scanFile(file, retiredTerms, "retired_term"));
  const retiredDataHits = dataFiles.flatMap((file) => scanFile(file, retiredDataTerms, "retired_data_term"));
  const mojibakeHits = [...activeFiles, ...dataFiles].flatMap((file) => scanFile(file, mojibakeMarkers, "text_contamination"));
  const v4PublicRuleHits = v4PublicRuleFiles.flatMap(filesUnder)
    .flatMap((file) => scanFilePatterns(file, v4PublicForbiddenPatterns, "v4_public_rule_conflict"));
  const governanceRuleScanFiles = [...new Set(currentGovernanceRuleFiles.flatMap(filesUnder))];
  const governanceRuleHits = governanceRuleScanFiles
    .flatMap((file) => scanFilePatterns(file, currentGovernanceForbiddenPatterns, "current_governance_rule_conflict"));
  const frontstageIntegrationScanFiles = [...new Set(frontstageIntegrationTestFiles.flatMap(filesUnder))];
  const frontstageIntegrationHits = frontstageIntegrationScanFiles
    .flatMap((file) => scanFilePatterns(file, frontstageIntegrationForbiddenPatterns, "mutable_production_fixture_conflict"));
  const issues = [
    ...retiredHits,
    ...retiredDataHits,
    ...mojibakeHits,
    ...v4PublicRuleHits,
    ...governanceRuleHits,
    ...frontstageIntegrationHits,
  ];
  const scannedFiles = new Set([
    ...activeFiles,
    ...dataFiles,
    ...v4PublicRuleFiles.flatMap(filesUnder),
    ...governanceRuleScanFiles,
    ...frontstageIntegrationScanFiles,
  ]);
  const result = {
    ok: issues.length === 0,
    date,
    scanned_file_count: scannedFiles.size,
    issue_count: issues.length,
    issues,
  };
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

main();
