#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

export async function successfulPagesDeployment(runs, sourceSha, isAncestor) {
  for (const run of runs) {
    if (run.status !== "completed" || run.conclusion !== "success" || run.headBranch !== "main") continue;
    // workflow_dispatch can check out source_sha instead of its triggering HEAD.
    const deployedSha = run.displayTitle?.match(/^Deploy Frontstage to GitHub Pages ([a-f0-9]{40})$/u)?.[1]
      || (run.event === "push" ? run.headSha : "");
    if (!deployedSha) continue;
    if (deployedSha === sourceSha || await isAncestor(sourceSha, deployedSha)) return { ...run, deployedSha };
  }
  return null;
}

async function main() {
  const sourceSha = process.argv.find((arg) => arg.startsWith("--source-sha="))?.slice(13);
  if (!/^[a-f0-9]{40}$/u.test(sourceSha || "")) throw new Error("A full source SHA is required.");
  const gh = (args) => JSON.parse(execFileSync("gh", args, { encoding: "utf8", timeout: 30000 }));
  const ancestry = new Map();
  const deadline = Date.now() + 10 * 60 * 1000;
  while (Date.now() < deadline) {
    const runs = gh(["run", "list", "--workflow", "github-pages.yml", "--branch", "main", "--limit", "30",
      "--json", "databaseId,status,conclusion,headSha,displayTitle,headBranch,event,url"]);
    const deployed = await successfulPagesDeployment(runs, sourceSha, async (base, head) => {
      if (!ancestry.has(head)) {
        const comparison = gh(["api", `repos/{owner}/{repo}/compare/${base}...${head}`]);
        ancestry.set(head, ["ahead", "identical"].includes(comparison.status));
      }
      return ancestry.get(head);
    });
    if (deployed) {
      if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT,
        `run_id=${deployed.databaseId}\nstatus=deployed\nportal_status=awaiting_portal\n`);
      console.log(JSON.stringify({ ok: true, required_sha: sourceSha, deployed_sha: deployed.deployedSha,
        run_id: deployed.databaseId, url: deployed.url, portal_status: "awaiting_portal" }));
      return;
    }
    console.log("Waiting for a successful Pages deployment containing the required commit.");
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
  throw new Error(`No successful Pages deployment contains ${sourceSha}; portal publication remains unverified.`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
