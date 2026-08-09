#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import path from "node:path";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

const root = process.cwd();
const backupRoot = resolvePrivateEvidenceBackupRoot(root);
const repository = process.env.GUANLAN_PRIVATE_EVIDENCE_REPOSITORY
  || "jerryfang2023-stack/WaveSight-private-evidence";
const expectedUrls = new Set([
  `git@github.com:${repository}.git`,
  `https://github.com/${repository}.git`,
]);
const problems = [];

function git(args) {
  return execFileSync("git", ["-C", backupRoot, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

let remoteUrl = "";
try {
  remoteUrl = git(["remote", "get-url", "origin"]);
  if (!expectedUrls.has(remoteUrl)) {
    problems.push(`private evidence origin is not the approved repository: ${remoteUrl || "missing"}`);
  }
} catch (error) {
  problems.push(`private evidence origin is unavailable: ${error.message}`);
}

let anonymousStatus = 0;
try {
  const response = await fetch(`https://api.github.com/repos/${repository}`, {
    headers: {
      accept: "application/vnd.github+json",
      "user-agent": "WaveSight-private-evidence-boundary",
    },
    redirect: "error",
    signal: AbortSignal.timeout(15000),
  });
  anonymousStatus = response.status;
  if (anonymousStatus !== 404) {
    problems.push(`private evidence repository is anonymously visible or unverifiable: HTTP ${anonymousStatus}`);
  }
} catch (error) {
  problems.push(`anonymous GitHub visibility check failed closed: ${error.message}`);
}

let remoteHead = "";
let localHead = "";
try {
  localHead = git(["rev-parse", "HEAD"]);
  if (!/^[a-f0-9]{40}$/u.test(localHead)) {
    problems.push("local private evidence repository did not return a valid HEAD");
  }
} catch (error) {
  problems.push(`local private evidence repository HEAD is unavailable: ${error.message}`);
}
if (remoteUrl) {
  try {
    remoteHead = git(["ls-remote", "origin", "HEAD"]).split(/\s+/u)[0] || "";
    if (!/^[a-f0-9]{40}$/u.test(remoteHead)) {
      problems.push("authenticated private evidence remote did not return a valid HEAD");
    }
  } catch (error) {
    problems.push(`authenticated private evidence remote is inaccessible: ${error.message}`);
  }
}
if (localHead && remoteHead && localHead !== remoteHead) {
  problems.push(
    `local private evidence HEAD ${localHead} does not match remote HEAD ${remoteHead}; synchronize the private repository before asserting evidence coverage`,
  );
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  backupRoot: path.resolve(backupRoot),
  repository,
  remoteUrl,
  anonymousStatus,
  localHead,
  remoteHead,
  problems,
}, null, 2));

if (problems.length) process.exit(1);
