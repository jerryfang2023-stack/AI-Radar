#!/usr/bin/env node
import { isMainModule } from "./lib/module-entry.mjs";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

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
  const failed = selected.find((check) => check?.status === "completed" && !["success", "action_required"].includes(check.conclusion));
  if (failed) return { status: "failed", reason: `${failed.name}: ${failed.conclusion}` };
  const approval = selected.find((check) => check?.status === "completed" && check.conclusion === "action_required");
  if (approval) return { status: "awaiting_approval", reason: `${approval.name}: maintainer approval required` };
  if (selected.every((check) => check?.status === "completed" && check.conclusion === "success")) return { status: "passed" };
  return { status: "waiting", reason: requiredChecks.filter((_, i) => selected[i]?.status !== "completed").join(", ") };
}

export function productionCIState(checks, runs, head) {
  const approval = approvalBlockedProductionRun(runs, head);
  if (approval) return { status: "awaiting_approval", run_id: approval.id, run_url: approval.html_url, reason: "maintainer_approval_required" };
  const latest = runs.filter(run => run.head_sha === head && run.path === ".github/workflows/production-code-checks.yml").sort((a,b) => b.id-a.id)[0];
  if (latest && latest.status !== "completed") return { status: "waiting", run_id: latest.id, run_url: latest.html_url, reason: "production_checks_running" };
  if(latest && latest.conclusion !== "success") return {status:latest.conclusion ? "failed" : "waiting",run_id:latest.id,run_url:latest.html_url,reason:`production_workflow_${latest.conclusion || 'result_pending'}`};
  return { ...inspectProductionChecks(checks, head), ...(latest ? {run_id:latest.id,run_url:latest.html_url} : {}) };
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
  const receiptFile = process.argv.find(arg => arg.startsWith("--pending-receipt="))?.slice(18);
  const record = state => {
    if (!receiptFile) return;
    fs.mkdirSync(path.dirname(path.resolve(receiptFile)),{recursive:true});
    fs.writeFileSync(receiptFile,JSON.stringify({version:"PRODUCTION-CI-RECOVERY-1",date:process.env.RUN_DATE,pr_url:pr,head_sha:head,
      checkpoint_run_id:process.env.GITHUB_RUN_ID,status:state.status === "waiting" ? "checks_pending" : state.status === "failed" ? "ci_failed" : state.status,
      run_id:state.run_id,run_url:state.run_url,reason:state.reason,reuse_accepted_inputs:true,observed_at:new Date().toISOString()},null,2)+"\n");
  };
  const deadline = Date.now() + 15 * 60_000;
  let lastState;
  while (Date.now() < deadline) {
    const current = pull();
    if (current.headRefOid !== head || current.state !== "OPEN") throw new Error("PR changed while waiting; re-evaluate its new head without merging");
    const pages = gh(["api", `repos/{owner}/{repo}/commits/${head}/check-runs?per_page=100`, "--paginate", "--slurp"]);
    const runs = gh(["api", `repos/{owner}/{repo}/actions/runs?head_sha=${head}&per_page=100`]);
    const state = productionCIState(pages.flatMap(page => page.check_runs || []),runs.workflow_runs || [],head);
    lastState=state;
    if (state.status === "passed") { record(state); process.stdout.write(`${head}\n`); return; }
    if (state.status === "failed") { record(state); throw new Error(`Production CI failed for ${head}: ${state.reason}; retain the PR and accepted intake for targeted repair`); }
    if (state.status === "awaiting_approval") {
      record(state);
      const message=`Production CI requires maintainer approval for ${head}: ${state.run_url || state.run_id || state.reason}. Retain accepted intake, review and approve this exact run, then resume publication only; do not recollect or bypass approval.`;
      if (!receiptFile) throw new Error(message);
      console.error(`awaiting_approval: ${message}`); return;
    }
    console.error(`Waiting for exact-head production CI: ${state.reason}`);
    await new Promise((resolve) => setTimeout(resolve, 15_000));
  }
  const message="Production CI missing or unfinished after 15 minutes; an empty check list is not success. Inspect the PR token/workflow trigger; do not recollect sources.";
  if(receiptFile){record({...lastState,status:"waiting",reason:message});console.error(`checks_pending: ${message}`);return;}
  throw new Error(message);
}

if (isMainModule(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
