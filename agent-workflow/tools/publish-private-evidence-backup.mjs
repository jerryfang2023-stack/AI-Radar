#!/usr/bin/env node

import { execFileSync, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

const root = process.cwd();
const backupRoot = resolvePrivateEvidenceBackupRoot(root);
const gitDirectory = path.join(backupRoot, ".git");
if (!fs.existsSync(gitDirectory)) {
  throw new Error(`Private evidence backup is not a Git repository: ${backupRoot}`);
}

function git(args, options = {}) {
  const output = execFileSync("git", ["-C", backupRoot, ...args], {
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : ["ignore", "pipe", "pipe"],
  });
  return options.inherit ? "" : output.trim();
}

const remoteUrl = git(["remote", "get-url", "origin"]);
const visibility = JSON.parse(execFileSync(
  "gh",
  ["repo", "view", remoteUrl, "--json", "isPrivate,nameWithOwner,url"],
  { encoding: "utf8" },
));
if (!visibility.isPrivate) {
  throw new Error(`Refusing to publish evidence backup to a non-private repository: ${visibility.url}`);
}

git(["add", "--all"], { inherit: true });
const staged = spawnSync(
  "git",
  ["-C", backupRoot, "diff", "--cached", "--quiet"],
  { stdio: "ignore" },
);
if (staged.status === 0) {
  console.log(JSON.stringify({
    ok: true,
    changed: false,
    repository: visibility.nameWithOwner,
    visibility: "PRIVATE",
  }, null, 2));
  process.exit(0);
}
if (staged.status !== 1) {
  throw new Error(`Unable to inspect staged private evidence backup changes: exit ${staged.status}`);
}

const date = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
git(["commit", "-m", `Refresh private evidence backup ${date}`], { inherit: true });
git(["push", "origin", "HEAD:main"], { inherit: true });

console.log(JSON.stringify({
  ok: true,
  changed: true,
  repository: visibility.nameWithOwner,
  visibility: "PRIVATE",
  commit: git(["rev-parse", "HEAD"]),
}, null, 2));
