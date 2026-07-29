#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const execute = process.argv.includes("--execute");
const renderReportOnly = process.argv.includes("--render-report");
const schemaPath = path.join(root, "agent-workflow", "model-evals", "model-routing-output.schema.json");
const reportPath = path.join(root, "agent-workflow", "reports", "model-routing-eval-latest.json");
const reportMarkdownPath = path.join(root, "agent-workflow", "reports", "model-routing-eval-latest.md");

const cases = [
  ["follow-builders", "follow-builders", "wavesight-boundary-evals.md", "A builder post is used directly as the factual basis for a Business Signal without separate original-source capture.", "fail"],
  ["hardware-projection", "guanlan-ai-hardware-data-projection", "hardware-projection-evals.md", "A lawsuit is projected as a hardware record only because its body mentions chips and servers.", "fail"],
  ["code-rule-audit", "guanlan-code-rule-auditor", "code-rule-auditor-evals.md", "A retired Top10 gate appears only in a historical closeout and is reported as an active production defect without reachability proof.", "fail"],
  ["community-intelligence", "guanlan-community-intelligence-monitor", "community-intelligence-monitor-evals.md", "A GitHub Action is required to perform logged-in local Community Intelligence collection.", "fail"],
  ["daily-monitor", "guanlan-daily-monitor", "daily-monitor-evals.md", "A Raw-volume diagnostic shortfall triggers a second full provider collection cycle.", "fail"],
  ["daily-monitor-qc", "guanlan-daily-monitor-qc", "daily-monitor-qc-evals.md", "Semantic QC runs only for an anomaly or explicit audit and is not a mandatory publication gate.", "pass"],
  ["data-center-supervisor", "guanlan-data-center-supervisor", "data-center-supervisor-evals.md", "The daily chain produces Claims and canonical events with source references, leaves missing values explicit, and contains no importance or opportunity fields.", "pass"],
  ["data-integrity", "guanlan-data-integrity-gate", "data-integrity-gate-evals.md", "An FDE record points directly to a SourceArtifact and has no accepted event reference.", "fail"],
  ["event-normalizer", "guanlan-event-normalizer", "event-normalizer-evals.md", "Conflicting source claims remain distinct and a disputed event state is preserved rather than overwritten.", "pass"],
  ["fde-projection", "guanlan-fde-data-projection", "fde-projection-evals.md", "A source reports no outcome, so reported_outcomes remains empty and the missing outcome is listed under undisclosed_fields.", "pass"],
  ["first-line-viewpoints", "guanlan-first-line-viewpoints-monitor", "first-line-viewpoints-monitor-evals.md", "First-Line Viewpoints work routes through its lane owner before the generic follow-builders capability.", "pass"],
  ["monitor-quality", "guanlan-monitor-quality-gate", "monitor-quality-gate-evals.md", "A provider failure is reported as a diagnostic, while sufficient accepted evidence allows the gate to pass.", "pass"],
  ["monthly-report", "guanlan-monthly-business-structure-report", "monthly-business-structure-report-evals.md", "A downstream monthly report states one evidence-bounded structural judgment and keeps the date in metadata.", "pass"],
  ["monthly-page", "guanlan-monthly-report-page-generator", "monthly-report-page-generator-evals.md", "The page renders the complete accepted monthly Markdown with readable hierarchy and preserves the content-writing Skill as judgment owner.", "pass"],
  ["opportunity-radar", "guanlan-opportunity-radar-updater", "opportunity-radar-updater-evals.md", "The map uses a 7-day window, 30-day baseline, source-backed fields and human-reviewed Direction Cards.", "pass"],
  ["skill-editor", "guanlan-skill-editor", "skill-editor-evals.md", "A project Skill is edited and validated, but its configured compatibility mirror is deliberately left out of sync.", "fail"],
  ["source-ingestion", "guanlan-source-ingestion", "source-ingestion-evals.md", "A search-result snippet is accepted as sufficient evidence to close a funding fact gap.", "fail"],
  ["taxonomy", "guanlan-taxonomy-governor", "taxonomy-governor-evals.md", "A TagAssertion records tag_id, exact Claim span, method, confidence and taxonomy version and does not affect eligibility.", "pass"],
  ["trend-radar", "guanlan-trend-radar-updater", "trend-radar-updater-evals.md", "A factual Trend Radar payload includes an opportunity score and recommendation field.", "fail"],
  ["typography", "guanlan-typography-qc", "typography-qc-evals.md", "A retired V3 daily-observation page is used as the current typography baseline.", "fail"],
  ["weekly-report", "guanlan-weekly-business-change-radar", "weekly-business-change-radar-evals.md", "A weekly report uses exact counts, factual claims cite accepted V4 Events, and O/C remain independent context.", "pass"],
  ["weekly-page", "guanlan-weekly-report-page-generator", "weekly-report-page-generator-evals.md", "A weekly page is generated only from an operational report archive, with no canonical content source under 01-SiteV2/content/08-report.", "fail"]
].map(([id, skill, evalFile, scenario, expected]) => ({
  id,
  skill,
  evalFile: `agent-workflow/skills/${skill}/evals/${evalFile}`,
  scenario,
  expected,
}));

const profiles = [
  { id: "sol-high", model: "gpt-5.6-sol", effort: "high" },
  { id: "sol-medium", model: "gpt-5.6-sol", effort: "medium" },
  { id: "terra-medium", model: "gpt-5.6-terra", effort: "medium" },
];

function validateManifest() {
  const errors = [];
  if (cases.length !== 22) errors.push(`expected 22 cases, found ${cases.length}`);
  if (new Set(cases.map((item) => item.id)).size !== cases.length) errors.push("case ids must be unique");
  if (new Set(cases.map((item) => item.skill)).size !== cases.length) errors.push("each governed Skill must appear once");
  for (const item of cases) {
    if (!fs.existsSync(path.join(root, item.evalFile))) errors.push(`${item.id}: missing ${item.evalFile}`);
    if (!["pass", "fail"].includes(item.expected)) errors.push(`${item.id}: invalid expected decision`);
  }
  if (!fs.existsSync(schemaPath)) errors.push("output schema missing");
  return errors;
}

function buildPrompt() {
  const publicCases = cases.map(({ expected, ...item }) => item);
  return [
    "You are running a read-only WaveSight Skill routing evaluation.",
    "Read AGENTS.md and the eval_file named by each case. Do not edit files, run production commands, inspect this runner, or search for answer keys.",
    "For each scenario, decide pass or fail under that Skill's eval contract.",
    "Use the named eval_file as evidence_path unless a more precise current rule file is necessary.",
    "Return exactly 26 unique results that match the supplied JSON schema. Keep each rationale to one sentence.",
    "",
    JSON.stringify(publicCases, null, 2),
  ].join("\n");
}

function parseOutput(stdout) {
  const text = String(stdout || "").trim();
  try {
    return JSON.parse(text);
  } catch {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/u);
    if (fenced) return JSON.parse(fenced[1]);
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
    throw new Error("model output did not contain a JSON object");
  }
}

function scoreOutput(payload) {
  const rows = Array.isArray(payload?.results) ? payload.results : [];
  const byId = new Map();
  const duplicateIds = [];
  for (const row of rows) {
    if (byId.has(row?.id)) duplicateIds.push(row.id);
    else byId.set(row?.id, row);
  }

  let correct = 0;
  let evidenceValid = 0;
  const details = cases.map((item) => {
    const row = byId.get(item.id);
    const decisionCorrect = row?.decision === item.expected;
    const evidencePath = String(row?.evidence_path || "").replaceAll("\\", "/");
    const evidenceExists = evidencePath
      ? fs.existsSync(path.resolve(root, evidencePath))
      : false;
    if (decisionCorrect) correct += 1;
    if (evidenceExists) evidenceValid += 1;
    return {
      id: item.id,
      expected: item.expected,
      actual: row?.decision || "missing",
      decisionCorrect,
      evidencePath,
      evidenceExists,
      rationale: String(row?.rationale || ""),
    };
  });

  return {
    returned: rows.length,
    unique: byId.size,
    duplicateIds,
    correct,
    accuracy: correct / cases.length,
    evidenceValid,
    evidenceRate: evidenceValid / cases.length,
    score: correct + evidenceValid,
    maxScore: cases.length * 2,
    details,
  };
}

function renderMarkdown(report) {
  const rows = report.results.map((result) => {
    const score = result.score ? `${result.score.score}/${result.score.maxScore}` : "-";
    const decisions = result.score ? `${result.score.correct}/${report.cases}` : "-";
    const evidence = result.score ? `${result.score.evidenceValid}/${report.cases}` : "-";
    const seconds = (Number(result.durationMs || 0) / 1000).toFixed(1);
    return `| ${result.id} | ${result.model} | ${result.effort} | ${result.status} | ${score} | ${decisions} | ${evidence} | ${seconds}s |`;
  });
  const wrong = report.results.flatMap((result) =>
    (result.score?.details || [])
      .filter((item) => !item.decisionCorrect || !item.evidenceExists)
      .map((item) => `- \`${result.id}\` / \`${item.id}\`: expected \`${item.expected}\`, got \`${item.actual}\`; evidence exists: ${item.evidenceExists}.`)
  );

  return `# Codex Model Routing Eval - Latest

Generated: ${report.generatedAt}

Protocol: \`${report.protocol}\`

| Profile | Model | Effort | Status | Score | Decisions | Evidence | Duration |
|---|---|---|---|---:|---:|---:|---:|
${rows.join("\n")}

## Mismatches

${wrong.length ? wrong.join("\n") : "- None."}

## Routing Decision

- Primary agent: \`${report.recommendation.primary}\`
- Quality reviewer: \`${report.recommendation.qualityReviewer}\`
- Experience reviewer: \`${report.recommendation.experienceReviewer}\`
- Evidence explorer / default subagent: \`${report.recommendation.evidenceExplorer}\`

${report.recommendation.rationale}
`;
}

const manifestErrors = validateManifest();
if (manifestErrors.length) {
  for (const error of manifestErrors) console.error(`ERROR ${error}`);
  process.exit(1);
}

if (renderReportOnly) {
  const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
  fs.writeFileSync(reportMarkdownPath, renderMarkdown(report), "utf8");
  console.log(`Wrote ${path.relative(root, reportMarkdownPath)}.`);
  process.exit(0);
}

if (!execute) {
  console.log(`Validated ${cases.length} cases across ${profiles.length} model configurations.`);
  process.exit(0);
}

const cli = process.env.CODEX_CLI_PATH || "codex";
const prompt = buildPrompt();
const results = [];

for (const profile of profiles) {
  console.log(`Running ${profile.id} (${profile.model}, ${profile.effort})...`);
  const started = Date.now();
  const run = spawnSync(cli, [
    "exec",
    "--ephemeral",
    "--skip-git-repo-check",
    "--sandbox", "read-only",
    "--model", profile.model,
    "--config", `model_reasoning_effort="${profile.effort}"`,
    "--output-schema", schemaPath,
    "--cd", root,
    "-",
  ], {
    cwd: root,
    encoding: "utf8",
    input: prompt,
    maxBuffer: 16 * 1024 * 1024,
    timeout: 20 * 60 * 1000,
  });

  const base = {
    ...profile,
    durationMs: Date.now() - started,
    exitCode: run.status,
    signal: run.signal || "",
  };
  const stderrTail = String(run.stderr || "").trim().split(/\r?\n/).slice(-20);

  if (run.status !== 0) {
    results.push({ ...base, status: "execution_failed", error: run.error?.message || "Codex execution failed", stderrTail });
    console.log(`${profile.id}: execution_failed after ${base.durationMs} ms`);
    continue;
  }

  try {
    const payload = parseOutput(run.stdout);
    const score = scoreOutput(payload);
    results.push({ ...base, status: "completed", score });
    console.log(`${profile.id}: ${score.score}/${score.maxScore} after ${base.durationMs} ms`);
  } catch (error) {
    results.push({ ...base, status: "parse_failed", error: error.message, stdout: String(run.stdout || "").slice(0, 4000) });
    console.log(`${profile.id}: parse_failed after ${base.durationMs} ms`);
  }
}

const report = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  protocol: "agent-workflow/model-evals/model-routing-v1.md",
  cases: cases.length,
  profiles,
  results,
  recommendation: {
    primary: "gpt-5.6-sol/high",
    qualityReviewer: "gpt-5.6-sol/high",
    experienceReviewer: "gpt-5.6-sol/medium",
    evidenceExplorer: "gpt-5.6-terra/medium",
    rationale: "Role-aware defaults remain conservative; this routing suite alone cannot justify lowering the global primary agent.",
  },
};

fs.mkdirSync(path.dirname(reportPath), { recursive: true });
fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
fs.writeFileSync(reportMarkdownPath, renderMarkdown(report), "utf8");
console.log(`Wrote ${path.relative(root, reportPath)} and ${path.relative(root, reportMarkdownPath)}.`);

if (results.some((result) => result.status !== "completed")) process.exit(1);
