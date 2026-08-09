#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const runtimeDir = path.resolve(root, args.get("runtime-dir") || path.join(os.tmpdir(), "WaveSight", "runtime"));
const date = args.get("date") || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const dryRun = args.get("dry-run") === "true";
const worktreesRoot = path.join(runtimeDir, "worktrees");
const worktree = path.join(worktreesRoot, `guanlan-vault-sync-${process.pid}`);
const reportFile = path.join(runtimeDir, `${date}-guanlan-vault-sync.json`);
let worktreeCreated = false;

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    cwd: options.cwd || root,
    encoding: "utf8",
    windowsHide: true,
    timeout: options.timeout || 120_000,
    env: options.env || process.env,
  });
  if (result.error || result.status !== 0) {
    const detail = String(result.stderr || result.stdout || result.error?.message || "unknown error").trim();
    throw new Error(`${command} ${commandArgs.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }
  return String(result.stdout || "").trim();
}

function copyLocalConfig(name) {
  const source = path.join(root, name);
  if (fs.existsSync(source)) fs.copyFileSync(source, path.join(worktree, name));
}

function runVaultProjection(vaultRoot) {
  const environment = { ...process.env, GUANLAN_VAULT_ROOT: vaultRoot };
  delete environment.GUANLAN_EVIDENCE_BACKUP_ROOT;
  for (const script of [
    "agent-workflow/tools/build-guanlan-vault.mjs",
    "agent-workflow/tools/sync-guanlan-evidence.mjs",
    "agent-workflow/tools/assert-guanlan-vault.mjs",
  ]) {
    run(process.execPath, [script], {
      cwd: worktree,
      timeout: 600_000,
      env: environment,
    });
  }
}

function writeReport(payload) {
  fs.mkdirSync(runtimeDir, { recursive: true });
  fs.writeFileSync(reportFile, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

const payload = {
  ok: false,
  status: "failed",
  date,
  generated_at: new Date().toISOString(),
  source_ref: "origin/main",
  source_commit: "",
  isolated_worktree: true,
  dry_run: dryRun,
  error: "",
};

try {
  const vaultRoot = resolveGuanlanVaultRoot(root);
  run("git", ["fetch", "origin", "main"]);
  payload.source_commit = run("git", ["rev-parse", "origin/main"]);

  if (dryRun) {
    payload.ok = true;
    payload.status = "skipped_dry_run";
  } else {
    fs.mkdirSync(worktreesRoot, { recursive: true });
    run("git", ["worktree", "add", "--detach", worktree, "origin/main"]);
    worktreeCreated = true;
    copyLocalConfig(".guanlan-vault.json");
    runVaultProjection(vaultRoot);
    payload.ok = true;
    payload.status = "passed";
  }
} catch (error) {
  payload.error = error instanceof Error ? error.message : String(error);
} finally {
  if (worktreeCreated) {
    try {
      run("git", ["worktree", "remove", "--force", "--", worktree]);
    } catch (error) {
      payload.ok = false;
      payload.status = "failed";
      payload.error = [payload.error, error instanceof Error ? error.message : String(error)].filter(Boolean).join("; ");
    }
  }
  writeReport(payload);
}

console.log(JSON.stringify({
  ok: payload.ok,
  status: payload.status,
  date,
  source_commit: payload.source_commit,
  report: path.relative(root, reportFile).replace(/\\/gu, "/"),
}, null, 2));

if (!payload.ok) process.exit(1);
