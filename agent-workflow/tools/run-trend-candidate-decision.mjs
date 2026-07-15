#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const writeNoDecision = args.get("write-no-decision") !== "false";
const reportsDir = path.join(root, "agent-workflow", "reports");
const trendSkill = path.join(root, "agent-workflow", "skills", "guanlan-trend-candidate-writer", "SKILL.md");

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function listFiles(dir, predicate = () => true) {
  if (!exists(dir)) return [];
  const rows = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) rows.push(...listFiles(file, predicate));
    else if (predicate(file)) rows.push(file);
  }
  return rows;
}

function frontmatter(text = "") {
  return text.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
}

function field(text = "", name) {
  const raw = frontmatter(text);
  return raw.match(new RegExp(`^${name}:\\s*(.+)$`, "mu"))?.[1]?.trim().replace(/^["']|["']$/g, "") || "";
}

function listField(text = "", name) {
  const value = field(text, name).replace(/^\[|\]$/gu, "");
  return value.split(",").map((item) => item.trim().replace(/^["']|["']$/gu, "")).filter(Boolean);
}

function nestedField(text = "", name) {
  return frontmatter(text).match(new RegExp(`^\\s+${name}:\\s*["']?([^"'\\r\\n]+)`, "mu"))?.[1]?.trim() || "";
}

function block(message, details = {}) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const file = path.join(reportsDir, `${date}-trend-candidate-decision-blocked.md`);
  const lines = Object.entries(details).map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`);
  fs.writeFileSync(file, [
    `# ${date} Trend Candidate Decision Blocked`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    "- status: blocked",
    `- reason: ${message}`,
    "",
    "## Details",
    "",
    ...(lines.length ? lines : ["- none"]),
    "",
  ].join("\n"), "utf8");
  console.log(JSON.stringify({ ok: false, date, report: rel(file), reason: message, details }, null, 2));
  process.exit(2);
}

const chain = spawnSync(process.execPath, [
  "agent-workflow/tools/assert-daily-production-chain.mjs",
  `--date=${date}`,
  "--stage=pre-trend",
  "--block-stale=true",
], { cwd: root, encoding: "utf8" });

if (chain.status !== 0) {
  process.stdout.write(chain.stdout || "");
  process.stderr.write(chain.stderr || "");
  process.exit(chain.status || 2);
}

if (!exists(trendSkill)) {
  block("trend candidate skill is missing", { required_skill: rel(trendSkill) });
}

const allCardFiles = listFiles(
  path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"),
  (file) => file.endsWith(".md"),
);
const allCardIds = new Set(allCardFiles.map((file) => field(fs.readFileSync(file, "utf8"), "id")).filter(Boolean));
const activeCardFiles = allCardFiles.filter((file) => path.basename(file).startsWith(`${date}--signal--`));
const activeCards = activeCardFiles.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const sourceUrl = nestedField(text, "source_url");
  let sourceFamily = "unknown";
  try {
    sourceFamily = new URL(sourceUrl).hostname.replace(/^www\./u, "") || "unknown";
  } catch {
    sourceFamily = "unknown";
  }
  return { id: field(text, "id"), signalType: field(text, "signal_type"), sourceFamily };
});
if (!activeCards.length) block("no accepted same-date Signal Cards are available for trend judgment");
const signalTypeCounts = Object.fromEntries(
  [...new Set(activeCards.map((card) => card.signalType).filter(Boolean))]
    .sort()
    .map((type) => [type, activeCards.filter((card) => card.signalType === type).length]),
);
const sourceFamilyCount = new Set(activeCards.map((card) => card.sourceFamily).filter((item) => item !== "unknown")).size;
const strongestType = Object.entries(signalTypeCounts).sort((a, b) => b[1] - a[1])[0] || ["none", 0];

const candidateDirs = [
  path.join(root, "01-SiteV2", "content", "06-asset-candidates", "trend"),
  path.join(root, "01-SiteV2", "knowledge", "03-Asset-Candidates", "trend"),
];
const candidateFiles = candidateDirs.flatMap((dir) =>
  listFiles(dir, (file) => path.basename(file).startsWith(`${date}--trend-candidate--`) && file.endsWith(".md"))
);

const noDecisionFile = path.join(reportsDir, `${date}-no-trend-candidate-decision.md`);

if (!candidateFiles.length) {
  if (!writeNoDecision && !exists(noDecisionFile)) {
    block("no trend candidate exists and write-no-decision=false", { expected_report: rel(noDecisionFile) });
  }
  if (writeNoDecision || !exists(noDecisionFile)) {
    fs.mkdirSync(reportsDir, { recursive: true });
    fs.writeFileSync(noDecisionFile, [
      "---",
      `date: ${date}`,
      "decision: no_trend_candidate",
      "checked_scope: accepted business-signal Cards / recent source-backed Card history / same-date stale state",
      `skill_used: ${rel(trendSkill)}`,
      `accepted_card_count: ${activeCards.length}`,
      `source_family_count: ${sourceFamilyCount}`,
      `signal_type_counts: ${JSON.stringify(signalTypeCounts)}`,
      "reason: No reviewed multi-signal trend candidate file crossed the current evidence threshold; automated checks do not promote tag or category overlap into a trend.",
      `strongest_signal: ${strongestType[0]} has ${strongestType[1]} accepted Cards, but category density alone is insufficient`,
      "missing_evidence: At least 2-3 related signals across at least 2 source types are required before creating a trend candidate.",
      "next_action: Keep watching; rerun guanlan-trend-candidate-writer after accepted Business Signal Cards are regenerated.",
      "---",
      "",
      "No trend candidate was created for this run. This is an explicit no-decision record, not a silent skip.",
      "",
    ].join("\n"), "utf8");
  }
  console.log(JSON.stringify({ ok: true, date, decision: "no_trend_candidate", report: rel(noDecisionFile) }, null, 2));
  process.exit(0);
}

if (exists(noDecisionFile)) fs.rmSync(noDecisionFile);

const problems = [];
for (const file of candidateFiles) {
  const text = fs.readFileSync(file, "utf8");
  const type = field(text, "type");
  const gate = field(text, "trend_evidence_gate");
  const boundary = field(text, "boundary_notes") || field(text, "risk_boundary");
  const nextObservation = field(text, "next_observation") || field(text, "follow_up_variables");
  const relatedSignals = listField(text, "related_signal_cards");
  const sourceTypes = listField(text, "source_types");
  if (type !== "trend_candidate") problems.push(`${rel(file)}: type is ${type || "missing"}`);
  if (!gate) problems.push(`${rel(file)}: missing trend_evidence_gate`);
  if (/threshold_passed|released|published/iu.test(gate)) problems.push(`${rel(file)}: trend candidate gate is too strong for lightweight candidate mode (${gate})`);
  if (!boundary) problems.push(`${rel(file)}: missing boundary_notes / risk_boundary`);
  if (!nextObservation) problems.push(`${rel(file)}: missing next_observation / follow_up_variables`);
  if (relatedSignals.length < 2) problems.push(`${rel(file)}: fewer than 2 related_signal_cards`);
  if (sourceTypes.length < 2) problems.push(`${rel(file)}: fewer than 2 source_types`);
  for (const cardId of relatedSignals) {
    if (!allCardIds.has(cardId)) problems.push(`${rel(file)}: unknown related Signal Card ${cardId}`);
  }
  if (/^related_opinions:\s*\[[^\]]+\]/mu.test(frontmatter(text))) problems.push(`${rel(file)}: opinion evidence is not allowed`);
}

if (problems.length) block("trend candidate validation failed", { problems });

const reportFile = path.join(reportsDir, `${date}-trend-candidate-decision.md`);
fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(reportFile, [
  `# ${date} Trend Candidate Decision`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  "- status: passed",
  "- decision: trend_candidate_present",
  `- skill_used: ${rel(trendSkill)}`,
  `- candidate_count: ${candidateFiles.length}`,
  "",
  "## Candidates",
  "",
  ...candidateFiles.map((file) => `- ${rel(file)}`),
  "",
].join("\n"), "utf8");

console.log(JSON.stringify({
  ok: true,
  date,
  decision: "trend_candidate_present",
  report: rel(reportFile),
  candidates: candidateFiles.map(rel),
}, null, 2));
