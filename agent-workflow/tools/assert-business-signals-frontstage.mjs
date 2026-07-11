#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || process.env.RUN_DATE || new Date().toISOString().slice(0, 10);
const skipEditorial = args.get("skip-editorial") === "true";
const reportsDir = path.join(root, "agent-workflow", "reports");

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function runGate(id, label, script, extraArgs = []) {
  const result = spawnSync(process.execPath, [script, ...extraArgs], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });
  const stdout = String(result.stdout || "");
  const stderr = String(result.stderr || "");
  const output = [stdout.trim(), stderr.trim()].filter(Boolean).join("\n");
  let parsed = null;
  try {
    parsed = JSON.parse(stdout);
  } catch {
    parsed = null;
  }
  return {
    id,
    label,
    script,
    status: result.status === 0 ? "passed" : "failed",
    exitCode: result.status,
    output,
    parsed,
  };
}

function classify(text = "") {
  const categories = new Set();
  if (/v3_active_date_has_no_cards|no public Cards|public Card count is 0|frontstage .* has no public Cards/iu.test(text)) {
    categories.add("frontstage_contract");
  }
  if (/untranslated|translation|needs translation|has untranslated/iu.test(text)) {
    categories.add("raw_card_ingestion_fields");
  }
  if (/model-generated title|generic generated title|missing public title|missing source\/display title|public title/iu.test(text)) {
    categories.add("raw_card_ingestion_fields");
  }
  if (/stale source|missing source publication date|news fact repeats title|duplicate .+\/.+|missing public detail field|formal Card lacks readable source body/iu.test(text)) {
    categories.add("card_editorial_quality");
  }
  if (/weak news fact|source-derived|source-first|source backed|backend candidate|missing selection reasons|missing source URL references/iu.test(text)) {
    categories.add("source_first");
  }
  if (/retired_|navigation|version_mismatch|active_date_stale|regression/iu.test(text)) {
    categories.add("frontstage_regression");
  }
  return [...categories];
}

function markdownCode(text = "") {
  const body = text.trim() || "(no output)";
  return ["```text", body.slice(0, 12000), "```"].join("\n");
}

const gateArgs = [`--date=${date}`];
const gates = [
  ...(!skipEditorial ? [runGate("editorial_quality", "Signal Card editorial quality gate", "agent-workflow/tools/assert-signal-card-editorial-quality.mjs", gateArgs)] : []),
  runGate("source_first", "V3 source-first frontstage gate", "agent-workflow/tools/assert-v3-source-first-frontstage.mjs", gateArgs),
  runGate("frontstage_regression", "Frontstage regression gate", "agent-workflow/tools/frontstage-regression-gate.mjs", gateArgs),
];

const failed = gates.filter((gate) => gate.status !== "passed");
const categoryText = failed.map((gate) => gate.output).join("\n");
const failureCategories = failed.length ? classify(categoryText) : [];
const status = failed.length ? "failed" : "passed";
const reportBase = path.join(reportsDir, `${date}-business-signals-frontstage-gate`);
const reportMd = `${reportBase}.md`;
const reportJson = `${reportBase}.json`;

fs.mkdirSync(reportsDir, { recursive: true });

const md = [
  `# ${date} Business Signals Frontstage Gate`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- status: ${status}`,
  `- failure_categories: ${failureCategories.length ? failureCategories.join(", ") : "none"}`,
  "",
  "## Gate Results",
  "",
  ...gates.flatMap((gate) => [
    `### ${gate.label}`,
    "",
    `- status: ${gate.status}`,
    `- script: ${gate.script}`,
    `- exit_code: ${gate.exitCode ?? "null"}`,
    "",
    markdownCode(gate.output),
    "",
  ]),
].join("\n");

fs.writeFileSync(reportMd, md, "utf8");
fs.writeFileSync(reportJson, JSON.stringify({
  ok: status === "passed",
  date,
  status,
  failure_categories: failureCategories,
  gates: gates.map((gate) => ({
    id: gate.id,
    label: gate.label,
    script: gate.script,
    status: gate.status,
    exit_code: gate.exitCode,
    parsed: gate.parsed,
  })),
  report: rel(reportMd),
}, null, 2), "utf8");

console.log(JSON.stringify({
  ok: status === "passed",
  date,
  status,
  failure_categories: failureCategories,
  report: rel(reportMd),
  report_json: rel(reportJson),
  gates: gates.map((gate) => ({ id: gate.id, status: gate.status })),
}, null, 2));

if (status !== "passed") process.exit(1);
