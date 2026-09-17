#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

export const requiredChecks = ["Production code (ubuntu-latest)", "Production code (windows-latest)"];

export function approvalBlockedProductionRun(runs, head) {
  const latest = runs.filter((run) => run.head_sha === head
    && run.path === ".github/workflows/production-code-checks.yml")
    .sort((a, b) => b.id - a.id)[0];
  return latest?.conclusion === "action_required" ? latest : null;
}

export function inspectProductionChecks(checks, head) {
  const selected = requiredChecks.map((name) => checks
    .filter((check) => check.name === name && check.head_sha === head && check.app?.slug === "github-actions")
    .sort((a, b) => b.id - a.id)[0]);
  const failed = selected.find((check) => check?.status === "completed" && check.conclusion !== "success");
  if (failed) return { status: "failed", reason: `${failed.name}: ${failed.conclusion}` };
  if (selected.every((check) => check?.status === "completed" && check.conclusion === "success")) return { status: "passed" };
  return { status: "waiting", reason: requiredChecks.filter((_, i) => selected[i]?.status !== "completed").join(", ") };
}

function gh(args) {
  const result = spawnSync("gh", args, { encoding: "utf8", windowsHide: true, timeout: 30_000, maxBuffer: 8 * 1024 * 1024 });
  if (result.error || result.status !== 0) throw new Error(`Cannot inspect production CI: ${result.stderr || result.error?.message || result.status}`);
  return JSON.parse(result.stdout);
}

async function main() {
  const pr = process.argv.find((arg) => arg.startsWith("--pr="))?.slice(5);
  if (!pr) throw new Error("--pr=<number-or-url> is required");
  const pull = () => gh(["pr", "view", pr, "--json", "headRefOid,state"]);
  const initial = pull();
  const head = initial.headRefOid;
  if (initial.state !== "OPEN" || !/^[a-f0-9]{40}$/u.test(head || "")) throw new Error("Expected an open PR with an exact head commit");
  const deadline = Date.now() + 15 * 60_000;
  while (Date.now() < deadline) {
    const current = pull();
    if (current.headRefOid !== head || current.state !== "OPEN") throw new Error("PR changed while waiting; re-evaluate its new head without merging");
    const pages = gh(["api", `repos/{owner}/{repo}/commits/${head}/check-runs?per_page=100`, "--paginate", "--slurp"]);
    const state = inspectProductionChecks(pages.flatMap((page) => page.check_runs || []), head);
    if (state.status === "passed") { process.stdout.write(`${head}\n`); return; }
    if (state.status === "failed") throw new Error(`Production CI failed for ${head}: ${state.reason}; retain the PR and accepted intake for targeted repair`);
    const runs = gh(["api", `repos/{owner}/{repo}/actions/runs?head_sha=${head}&per_page=100`]);
    const approval = approvalBlockedProductionRun(runs.workflow_runs || [], head);
    if (approval) throw new Error(`Production CI requires maintainer approval for ${head}: ${approval.html_url || approval.id}. Retain accepted intake, review and approve this exact run, then resume publication only; do not recollect or bypass approval.`);
    console.error(`Waiting for exact-head production CI: ${state.reason}`);
    await new Promise((resolve) => setTimeout(resolve, 15_000));
  }
  throw new Error("Production CI missing or unfinished after 15 minutes; an empty check list is not success. Inspect the PR token/workflow trigger; do not recollect sources.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
