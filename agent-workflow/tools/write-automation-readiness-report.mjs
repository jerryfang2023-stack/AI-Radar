#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");
const file = path.join(reportsDir, `${date}-github-automation-readiness-report.md`);

const smallPrFiles = [
  ".github/workflows/daily-monitor-dry-run.yml",
  "agent-workflow/reports/2026-05-25-github-automation-readiness-report.md",
  "agent-workflow/tools/assert-daily-production-chain.mjs",
  "agent-workflow/tools/assert-pool-to-card-dedupe.mjs",
  "agent-workflow/tools/generate-asset-cards-from-pool.mjs",
  "agent-workflow/tools/run-daily-observation-chain.mjs",
  "agent-workflow/tools/run-quality-gates.mjs",
  "agent-workflow/tools/run-trend-candidate-decision.mjs",
  "agent-workflow/tools/write-automation-readiness-report.mjs",
];

function exists(target) {
  return fs.existsSync(path.join(root, target));
}

const steps = [
  ["Run Daily Monitor with QC", "ready", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"],
  ["Raw / Pool post-dedupe active count gate", "ready", "agent-workflow/tools/assert-daily-production-chain.mjs"],
  ["Historical duplicate blocker", "ready", "agent-workflow/tools/assert-daily-production-chain.mjs"],
  ["Raw / Pool changed stale marker", "ready", "agent-workflow/tools/assert-daily-production-chain.mjs"],
  ["Regenerate Card / Opinion", "ready", "agent-workflow/tools/generate-asset-cards-from-pool.mjs"],
  ["Pool-to-Card duplicate gate", "ready", "agent-workflow/tools/assert-pool-to-card-dedupe.mjs"],
  ["Cardcopy gate", "ready", "agent-workflow/tools/run-quality-gates.mjs"],
  ["Trend candidate / no-decision CLI", "ready", "agent-workflow/tools/run-trend-candidate-decision.mjs"],
  ["Daily Observation Write / QC CLI", process.env.OPENAI_API_KEY ? "ready_with_openai_key" : "blocked_without_openai_key", "agent-workflow/tools/run-daily-observation-chain.mjs"],
  ["Sync site data after gates", "ready", "01-SiteV2/site/scripts/sync-v2-site-data.mjs"],
];

const missing = steps.filter(([, , script]) => !exists(script));
const localDailyObservationSkills = [
  "C:/Users/86186/.skill-store/guanlan-daily-observation-pitch/SKILL.md",
  "C:/Users/86186/.skill-store/guanlan-daily-observation/SKILL.md",
  "C:/Users/86186/.skill-store/guanlan-daily-observation-qc/SKILL.md",
];
const dailyObservationCloudBlocked = true;
const status = missing.length
  ? "blocked_missing_scripts"
  : dailyObservationCloudBlocked
    ? "partial_ready_daily_observation_blocked"
    : "ready_for_dry_run_workflow";
const openaiStatus = process.env.OPENAI_API_KEY ? "configured" : "required_for_daily_observation";

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(file, [
  `# ${date} GitHub Automation Readiness Report`,
  "",
  `- generated_at: ${new Date().toISOString()}`,
  `- status: ${status}`,
  "- recommendation: keep GitHub Actions on manual `workflow_dispatch` first; confirm stability before enabling `schedule`",
  "- full_scheduled_workflow: not_created",
  "- daily_monitor_dry_run_schedule: removed",
  "- daily_monitor_dry_run_trigger: workflow_dispatch_only",
  "- push_status: not_pushed_by_this_report",
  "- commit_push_pr_deploy_behavior: forbidden_for_current_workflow",
  "",
  "## Current Small PR Files",
  "",
  ...smallPrFiles.map((item) => `- \`${item}\``),
  "",
  "## Existing Workflow Status",
  "",
  "- `.github/workflows/daily-monitor-dry-run.yml` is dry-run only.",
  "- It uploads artifacts only.",
  "- It must not commit, push, open PRs, or deploy.",
  "- `schedule` has been removed for now; only `workflow_dispatch` remains.",
  "- Reason for removing `schedule`: the full daily production chain is not yet proven stable in GitHub Actions, and Daily Observation remains blocked for cloud execution until `OPENAI_API_KEY` and cloud-available skills are settled.",
  "",
  "## Step Readiness",
  "",
  "| Step | Status | Script |",
  "|---|---|---|",
  ...steps.map(([name, stepStatus, script]) => `| ${name} | ${stepStatus} | \`${script}\` |`),
  "",
  "## Gates Added",
  "",
  "- Raw / Pool active count gate: `agent-workflow/tools/assert-daily-production-chain.mjs` reports `final_active_raw_count` and `final_active_pool_count` from final files, not pre-dedupe counters.",
  "- Historical duplicate blocker: `agent-workflow/tools/assert-daily-production-chain.mjs` fails if historical duplicates remain active in Raw / Pool.",
  "- Stale marker: `agent-workflow/tools/assert-daily-production-chain.mjs` writes `downstream_assets_stale=true` report and blocks later stages when Raw / Pool are newer than downstream assets.",
  "- Pool-to-Card duplicate gate: `agent-workflow/tools/assert-pool-to-card-dedupe.mjs` blocks duplicate signal cards by raw ref, pool ref, source URL, full-text hash, and fact fingerprint.",
  "- Trend candidate CLI: `agent-workflow/tools/run-trend-candidate-decision.mjs` validates repo-local `skills/guanlan-trend-candidate-writer/SKILL.md` usage and allows only trend candidates or `no_trend_candidate_decision`.",
  "- Daily Observation Write / QC CLI: `agent-workflow/tools/run-daily-observation-chain.mjs` exists, requires `OPENAI_API_KEY`, and writes a blocked report rather than pretending completion when the key or skills are unavailable.",
  "",
  "## Cloud Skill Availability",
  "",
  "- Trend candidate skill is repo-local: `skills/guanlan-trend-candidate-writer/SKILL.md`.",
  "- Daily Observation pitch / writer / QC skills are local user skills today, not guaranteed on GitHub runners.",
  "- Before Daily Observation can run fully in GitHub Actions, either vendor those skills into repo `skills/` or provide an approved cloud skill-loading mechanism.",
  "",
  "Current local Daily Observation skill paths:",
  "",
  ...localDailyObservationSkills.map((item) => `- \`${item}\``),
  "",
  "## Still Missing / Blocked",
  "",
  ...(missing.length
    ? missing.map(([, , script]) => `- Missing script: \`${script}\``)
    : ["- Daily Observation cloud run remains blocked until `OPENAI_API_KEY` is configured and Daily Observation skills are available to the runner."]),
  "- A full scheduled GitHub Actions production workflow has not been created yet.",
  "- Direct commit / push / PR / deploy from the current dry-run workflow remains forbidden.",
  "",
  "## Required GitHub Secrets",
  "",
  "- `ANYSEARCH_API_KEY`: required for search discovery",
  "- `TAVILY_API_KEY`: required for search fallback",
  "- `EXA_API_KEY`: required for search fallback",
  `- \`OPENAI_API_KEY\`: ${openaiStatus}`,
  "",
  "## Can Enter Next GitHub Actions Stage?",
  "",
  "- Yes, but only as a manual `workflow_dispatch` dry-run workflow.",
  "- No, do not enable scheduled full automation yet.",
  "- No, do not enable direct commit-to-main workflow.",
  "",
  "## Recommended Workflow Mode",
  "",
  "- First: full-chain dry-run workflow with `workflow_dispatch` only and artifacts only.",
  "- After several stable manual runs: enable `schedule`.",
  "- Later: PR workflow after dry-run proves all gates.",
  "- Not recommended yet: direct commit to `main`.",
  "",
].join("\n"), "utf8");

console.log(JSON.stringify({ ok: status === "ready_for_dry_run_workflow", date, report: path.relative(root, file).replace(/\\/g, "/"), status }, null, 2));
