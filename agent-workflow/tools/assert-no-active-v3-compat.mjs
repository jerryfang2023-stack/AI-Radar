#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const problems = [];

const retiredCommands = [
  "generate-asset-cards-from-pool.mjs",
  "assert-pool-to-card-generation.mjs",
  "assert-business-signals-editorial.mjs",
  "build-v3-data-observation-desk.mjs",
  "assert-business-signals-frontstage.mjs",
  "assert-business-signals-compatibility-contract.mjs",
  "build-legacy-card-event-mappings.mjs",
  "repair-legacy-signal-card-links.mjs",
  "assert-v3-source-first-frontstage.mjs",
  "assert-tag-taxonomy-v3.mjs",
  "check-tags.mjs",
  "evidence-gate-eval.mjs",
  "run-trend-candidate-decision.mjs",
  "backfill-opportunity-signals.mjs",
  "audit-tags.mjs",
  "cleanup-tags.mjs",
  "manual-backfill-raw-from-json.mjs",
];

const retiredActivePaths = [
  "01-SiteV2/knowledge/01-Signal-Cards",
  "01-SiteV2/site/data/v3-data-observation-desk.json",
  "01-SiteV2/site/data/intelligence-graph-index.json",
  "01-SiteV2/content/11-databases/data-center-v4/legacy-card-event-mappings.json",
  "01-SiteV2/content/11-databases/data-center-v4/legacy-card-event-mappings.md",
  "01-SiteV2/site/data/site-content.json",
  "01-SiteV2/site/data/site-content.js",
  "01-SiteV2/site/data/enterprise-ai-fde.json",
  "01-SiteV2/site/daily-brief.html",
  "01-SiteV2/site/daily-brief-2026-06-05.html",
  "01-SiteV2/site/account.html",
  "01-SiteV2/site/admin.html",
  "01-SiteV2/site/checkout.html",
  "01-SiteV2/site/invite-request.html",
  "01-SiteV2/site/login.html",
  "01-SiteV2/site/pricing.html",
  "01-SiteV2/site/register.html",
  "01-SiteV2/site/assets/app.js",
  "01-SiteV2/site/assets/styles.css",
  "01-SiteV2/site/assets/pipeline-dashboard.js",
  "01-SiteV2/site/assets/relationship-graph-demo.css",
  "01-SiteV2/site/assets/relationship-graph-demo.js",
  "01-SiteV2/content/11-databases/business-signals-gate-v3.json",
  "agent-workflow/product/tag-taxonomy.md",
  ".github/workflows/business-signals-source-raw.yml",
  ".agents/skills/guanlan-business-signals-monitor",
  ".agents/skills/guanlan-raw-pool-card",
  ".agents/skills/guanlan-trend-candidate-writer",
  ".agents/skills/guanlan-enterprise-ai-fde-monitor",
  "01-SiteV2/content/02-pool",
  "01-SiteV2/content/03-daily-observation",
  "01-SiteV2/content/04-business-signals",
  "01-SiteV2/content/05-frontier-opinions",
  "01-SiteV2/content/06-asset-candidates",
  "01-SiteV2/content/11-databases/urgent-trend-candidates",
  "01-SiteV2/knowledge/03-Asset-Candidates",
  "01-SiteV2/knowledge/10-Templates/change-candidate-template.md",
  "01-SiteV2/knowledge/10-Templates/opinion-card-template.md",
  "01-SiteV2/knowledge/10-Templates/trend-candidate-cluster-template.md",
  "01-SiteV2/knowledge/10-Templates/trend-candidate-template.md",
  "agent-workflow/reports/2026-06-05-v3-1-mobile-copy-release.md",
  "agent-workflow/reports/2026-06-05-raw-pool-card-source-first-governance.md",
];
const retiredBasenames = [
  "01-Signal-Cards",
  "compatibility-cards.json",
  "v3-data-observation-desk.json",
  "intelligence-graph-index.json",
  "legacy-card-event-mappings.json",
  "legacy-card-event-mappings.md",
  "site-content.json",
  "site-content.js",
  "business-signals-gate-v3.json",
];

const retiredArchivePayloads = [
  "archive/v3-compat/signal-cards",
  "archive/v3-compat/frontstage/v3-data-observation-desk.json",
  "archive/v3-compat/frontstage/intelligence-graph-index.json",
  "archive/v3-compat/legacy-mappings/legacy-card-event-mappings.json",
  "archive/v3-compat/legacy-mappings/legacy-card-event-mappings.md",
  "archive/v3-compat/frontstage/site-content.json",
  "archive/v3-compat/frontstage/site-content.js",
];
const retiredReportSuffixes = [
  "-pool-to-card-handoff.md",
  "-pool-to-card-dedupe-gate.md",
  "-business-signals-frontstage-gate.md",
  "-business-signals-frontstage-gate.json",
  "-no-trend-candidate-decision.md",
];
const retiredCurrentContextPaths = [
  "context/08-v3-3-automation.md",
  "context/09-v3-3-current-action-index.md",
  "context/10-v3-3-experience-automation.md",
];

function read(relative) {
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) {
    problems.push(`missing required file: ${relative}`);
    return "";
  }
  return fs.readFileSync(file, "utf8");
}

function filesUnder(relative, extensions) {
  const target = path.join(root, relative);
  if (!fs.existsSync(target)) return [];
  const stat = fs.statSync(target);
  if (stat.isFile()) return extensions.has(path.extname(target)) ? [target] : [];
  return fs.readdirSync(target, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "archive") return [];
    const child = path.join(target, entry.name);
    return entry.isDirectory()
      ? filesUnder(path.relative(root, child), extensions)
      : extensions.has(path.extname(entry.name)) ? [child] : [];
  });
}

for (const relative of retiredActivePaths) {
  if (fs.existsSync(path.join(root, relative))) problems.push(`retired asset remains active: ${relative}`);
}
for (const relative of retiredArchivePayloads) {
  if (fs.existsSync(path.join(root, relative))) problems.push(`retired V3 payload remains in the working tree: ${relative}`);
}
for (const file of filesUnder("01-SiteV2/content/01-raw", new Set([".md"]))) {
  if (path.basename(file).endsWith("-raw-candidates.md")) {
    problems.push(`retired V1/V2 Raw candidate Markdown remains: ${path.relative(root, file).replace(/\\/gu, "/")}`);
  }
}
for (const file of filesUnder("01-SiteV2/content/11-databases/data-center-v4", new Set([".json", ".md"]))) {
  if (retiredBasenames.includes(path.basename(file))) {
    problems.push(`retired V3 database payload remains: ${path.relative(root, file).replace(/\\/gu, "/")}`);
  }
}
for (const file of filesUnder("agent-workflow/reports", new Set([".json", ".md"]))) {
  const name = path.basename(file);
  if (retiredReportSuffixes.some((suffix) => name.endsWith(suffix))) {
    problems.push(`retired V3 operational report remains: ${path.relative(root, file).replace(/\\/gu, "/")}`);
  }
}
for (const command of retiredCommands) {
  const matches = filesUnder("agent-workflow/tools", new Set([".mjs", ".js"]))
    .concat(filesUnder("01-SiteV2/site/scripts", new Set([".mjs", ".js"])))
    .filter((file) => path.basename(file) === command);
  if (matches.length) problems.push(`retired producer implementation remains: ${command}`);
}
const workflowFiles = filesUnder(".github/workflows", new Set([".yml", ".yaml"]));
const retiredWorkflowCopy = [
  "V3 evidence-supply",
  "Evidence-supply, Card/editorial",
  "Evidence, Card and frontstage",
  "business_source_raw",
  "-raw-source-candidates.json",
];
for (const file of workflowFiles) {
  const relative = path.relative(root, file).replace(/\\/gu, "/");
  const text = fs.readFileSync(file, "utf8");
  for (const command of retiredCommands) {
    if (text.includes(command)) problems.push(`${relative} invokes retired producer: ${command}`);
  }
  if (relative !== ".github/workflows/github-pages.yml") {
    for (const retiredName of retiredBasenames) {
      if (text.includes(retiredName)) problems.push(`${relative} references retired active asset: ${retiredName}`);
    }
  }
  for (const copy of retiredWorkflowCopy) {
    if (text.includes(copy)) problems.push(`${relative} retains retired workflow routing copy: ${copy}`);
  }
}
if (!fs.existsSync(path.join(root, ".github/workflows/data-center-source-intake.yml"))) {
  problems.push("missing V4 Data Center source-intake workflow");
}

const packageText = read("package.json");
for (const command of retiredCommands) {
  if (packageText.includes(command)) problems.push(`package.json exposes retired producer: ${command}`);
}

const productionTools = [
  "agent-workflow/tools/run-guanlan-daily-monitor.mjs",
  "agent-workflow/tools/guanlan-monitor-quality-gate.mjs",
  "agent-workflow/tools/build-data-center-v4.mjs",
  "agent-workflow/tools/assert-daily-production-chain.mjs",
  "agent-workflow/tools/write-daily-supervision-report.mjs",
  "agent-workflow/tools/run-business-signals-health-dispatch.mjs",
  "agent-workflow/tools/write-automation-readiness-report.mjs",
  "agent-workflow/tools/record-action-run.mjs",
  "agent-workflow/tools/write-weekly-health-report.mjs",
  "agent-workflow/tools/sync-local-obsidian-assets.mjs",
  "agent-workflow/tools/build-data-center-v4-obsidian-index.mjs",
  "agent-workflow/tools/backfill-source-title-translations.mjs",
];
for (const relative of productionTools) {
  const text = read(relative);
  for (const retiredName of retiredBasenames) {
    if (text.includes(retiredName)) problems.push(`${relative} references retired active asset: ${retiredName}`);
  }
  for (const retiredPath of retiredCurrentContextPaths) {
    if (text.includes(retiredPath)) problems.push(`${relative} references renamed current context: ${retiredPath}`);
  }
}

const publicPages = filesUnder("01-SiteV2/site", new Set([".html"]))
  .filter((file) => !/(?:weekly-ai-business-change-radar-\d{4}-\d{2}-\d{2}|monthly-business-structure-\d{4}-\d{2})\.html$/u.test(file));
const publicFetch = /(?:fetch|loadJson)\(\s*["']data\/(?:v3-data-observation-desk|intelligence-graph-index)\.json["']/u;
const publicV3Copy = /01-Signal-Cards|Raw\s*(?:→|->)\s*Pool|Signal Cards?/iu;
for (const file of publicPages) {
  const text = fs.readFileSync(file, "utf8");
  if (publicFetch.test(text)) {
    problems.push(`${path.relative(root, file).replace(/\\/gu, "/")} loads a retired V3 dataset`);
  }
  if (publicV3Copy.test(text)) {
    problems.push(`${path.relative(root, file).replace(/\\/gu, "/")} exposes retired V3 production copy`);
  }
}

const monitor = read("agent-workflow/tools/run-guanlan-daily-monitor.mjs");
for (const candidate of ["-raw-candidates.md", "-pool-candidates.md"]) {
  if (monitor.includes(candidate)) problems.push(`daily monitor still writes compatibility candidate Markdown: ${candidate}`);
}
if (!monitor.includes("source-intake-v1.mjs")) {
  problems.push("daily monitor does not write SOURCE-INTAKE-V1");
}
for (const retiredSourceArtifactName of ["business_source_raw", "-raw-source-candidates.json"]) {
  if (monitor.includes(retiredSourceArtifactName)) {
    problems.push(`daily monitor retains retired source-artifact naming: ${retiredSourceArtifactName}`);
  }
}
if (!monitor.includes("data_center_source_intake") || !monitor.includes("-source-intake-candidates.json")) {
  problems.push("daily monitor does not expose the V4 source-intake artifact contract");
}

const pages = read(".github/workflows/github-pages.yml");
if (!pages.includes("01-SiteV2/site")) problems.push("Pages source is not restricted to the site directory");
if (pages.includes("archive/v3-compat")) problems.push("Pages workflow discovers the V3 archive");

const schema = JSON.parse(read("agent-workflow/product/data-center-v4.schema.json") || "{}");
if ((schema.required || []).includes("compatibility_cards")) {
  problems.push("compatibility_cards remains required by the V4 schema");
}
if ("compatibility_cards" in (schema.properties || {}) || "compatibilityCard" in (schema.$defs || {})) {
  problems.push("compatibility_cards remains in the V4 schema");
}

const sourceIntakePolicy = JSON.parse(read("01-SiteV2/content/11-databases/source-intake-gate-v1.json") || "{}");
if (sourceIntakePolicy.schema_version !== "SOURCE-INTAKE-GATE-V1.0") {
  problems.push("V4 source-intake gate policy is missing or has the wrong schema version");
}
const sourceIntakeGate = read("agent-workflow/tools/guanlan-monitor-quality-gate.mjs");
for (const forbidden of [
  "01-SiteV2/content/02-pool",
  "-pool-candidates.md",
  "raw_to_card",
  "legacy_raw_file",
  "legacy_pool_file",
  "Card generation",
]) {
  if (sourceIntakeGate.includes(forbidden)) {
    problems.push(`source-intake quality gate retains retired V3 fallback or routing copy: ${forbidden}`);
  }
}

const governanceRetirementChecks = [
  {
    file: "agent-workflow/product/data-center-v4-contract.md",
    forbidden: ["archive/v3-compat/", "During dual-write", "legacy-asset-mappings.json", "legacy-card-event-mappings.json"],
  },
  {
    file: "agent-workflow/skills/guanlan-weekly-business-change-radar/SKILL.md",
    forbidden: ["data/v3-data-observation-desk.json", "01-Signal-Cards", "Business Signal Cards,"],
  },
  {
    file: "agent-workflow/skills/guanlan-monthly-business-structure-report/SKILL.md",
    forbidden: ["data/v3-data-observation-desk.json", "intelligence-graph-index.json", "compatibility Cards"],
  },
  {
    file: "agent-workflow/skills/guanlan-opportunity-radar-updater/SKILL.md",
    forbidden: ["The current Card files", "data/v3-data-observation-desk.json", "promoted through Raw / Pool / Card"],
  },
  {
    file: "agent-workflow/skills/guanlan-code-rule-auditor/SKILL.md",
    forbidden: ["V3 internal Card", "qualified Signal Cards", "Card-backed relationship graph"],
  },
  {
    file: "agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md",
    forbidden: ["business-signals-gate-v3.json", "legacy Raw/Pool supply"],
  },
  {
    file: "agent-workflow/skills/guanlan-monitor-quality-gate/references/scorecard.md",
    forbidden: ["Card generation", "Card generation, dedupe", "Raw/Pool/Core targets"],
  },
  {
    file: "agent-workflow/skills/guanlan-monitor-quality-gate/evals/monitor-quality-gate-evals.md",
    forbidden: ["Card/editorial/frontstage gates", "Raw/Pool/Core targets"],
  },
  {
    file: "agent-workflow/agents/README.md",
    forbidden: ["兼容或下游应用支线"],
  },
  {
    file: "docs/agent-handoff.md",
    forbidden: ["downstream compatibility outputs", "SITE-V4.2.0-entity-history"],
  },
  {
    file: "agent-workflow/agents/data-agent.md",
    forbidden: ["维护 V3 Raw / Pool / Card 兼容输出"],
  },
];
for (const check of governanceRetirementChecks) {
  const text = read(check.file);
  for (const forbidden of check.forbidden) {
    if (text.includes(forbidden)) problems.push(`${check.file} still directs current work to retired V3 behavior: ${forbidden}`);
  }
}

const result = {
  ok: problems.length === 0,
  schema_version: "NO-ACTIVE-V1-V3-COMPAT-V1.0",
  active_v3_consumers: problems.filter((problem) => problem.includes("references retired") || problem.includes("invokes retired")).length,
  retired_payloads_checked: retiredArchivePayloads.length,
  problems,
};

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
