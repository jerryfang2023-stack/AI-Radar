#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { isMainModule } from "./lib/module-entry.mjs";

function run(command, args, cwd, { allowFailure = false } = {}) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8", windowsHide: true });
  if (result.error || (!allowFailure && result.status !== 0)) {
    throw new Error(result.error?.message || result.stderr.trim() || result.stdout.trim() || `${command} failed`);
  }
  return result;
}

function git(cwd, args, options) {
  return run("git", args, cwd, options).stdout.trim();
}

function values(args, key) {
  return args.filter((item) => item.startsWith(`--${key}=`)).map((item) => item.slice(key.length + 3));
}

function one(args, key, fallback = "") {
  const found = values(args, key);
  if (found.length > 1) throw new Error(`--${key} may be supplied only once`);
  return found[0] ?? fallback;
}

export function normalizedScope(value) {
  const scope = String(value || "").replace(/\\/gu, "/").replace(/\/+$/u, "");
  if (!scope || scope.startsWith("/") || /^[A-Za-z]:/u.test(scope)
    || scope.split("/").some((part) => !part || part === "." || part === "..")
    || scope === ".git" || scope.startsWith(".git/")) {
    throw new Error(`Invalid repository-relative scope: ${value}`);
  }
  return scope;
}

export function inScope(file, scopes) {
  const normalized = file.replace(/\\/gu, "/");
  return scopes.some((scope) => normalized === scope || normalized.startsWith(`${scope}/`));
}

function paths(output) {
  return output.split("\0").filter(Boolean).map((item) => item.replace(/\\/gu, "/"));
}

function changedPaths(cwd, base) {
  // Both sides of a rename must be checked; a move from another module is not in scope.
  const committed = paths(run("git", ["diff", "--no-renames", "--name-only", "-z", base, "HEAD"], cwd).stdout);
  const unstaged = paths(run("git", ["diff", "--no-renames", "--name-only", "-z"], cwd).stdout);
  const staged = paths(run("git", ["diff", "--cached", "--no-renames", "--name-only", "-z"], cwd).stdout);
  const untracked = paths(run("git", ["ls-files", "--others", "--exclude-standard", "-z"], cwd).stdout);
  return [...new Set([...committed, ...unstaged, ...staged, ...untracked])].sort();
}

function metadataPath(cwd) {
  return git(cwd, ["rev-parse", "--path-format=absolute", "--git-path", "window-submit.json"]);
}

function readWindow(cwd) {
  const file = metadataPath(cwd);
  if (!fs.existsSync(file)) throw new Error("This checkout was not opened with window-submit start");
  const window = JSON.parse(fs.readFileSync(file, "utf8"));
  const branch = git(cwd, ["branch", "--show-current"]);
  if (!branch || branch !== window.branch || branch === "main") throw new Error("Window branch no longer matches its checkout");
  if (run("git", ["merge-base", "--is-ancestor", window.base, "HEAD"], cwd, { allowFailure: true }).status !== 0) {
    throw new Error("Window base is no longer an ancestor; inspect the branch before submitting");
  }
  window.scopes = window.scopes.map(normalizedScope);
  return window;
}

function inspect(cwd) {
  const window = readWindow(cwd);
  const changed = changedPaths(cwd, window.base);
  const outside = changed.filter((file) => !inScope(file, window.scopes));
  return { ...window, worktree: cwd, changed, outside, ok: outside.length === 0 };
}

function start(args, cwd) {
  const name = one(args, "name");
  if (!/^[a-z][a-z0-9-]{2,63}$/u.test(name)) throw new Error("--name must be 3-64 lowercase letters, digits or hyphens");
  const scopes = [...new Set(values(args, "scope").map(normalizedScope))];
  if (!scopes.length) throw new Error("At least one --scope is required");
  const listed = git(cwd, ["worktree", "list", "--porcelain"]).split(/\r?\n/u);
  const primary = listed.find((line) => line.startsWith("worktree "))?.slice(9);
  if (!primary) throw new Error("No primary Git worktree found");
  const root = path.resolve(one(args, "worktrees", path.join(path.dirname(primary), "_worktrees", path.basename(primary))));
  const target = path.join(root, name);
  const branch = `codex/window/${name}`;
  if (fs.existsSync(target)) throw new Error(`Worktree already exists: ${target}`);
  git(cwd, ["fetch", "origin", "main"]);
  const base = git(cwd, ["rev-parse", "origin/main"]);
  fs.mkdirSync(root, { recursive: true });
  git(cwd, ["worktree", "add", "-b", branch, target, base]);
  const window = { name, branch, base, scopes };
  fs.writeFileSync(metadataPath(target), `${JSON.stringify(window, null, 2)}\n`);
  return { ...window, worktree: target };
}

function submit(args, cwd) {
  const report = inspect(cwd);
  if (!report.ok) throw new Error(`Changes outside declared scope: ${report.outside.join(", ")}`);
  const message = one(args, "message");
  if (!message.trim()) throw new Error("--message is required");
  if (!report.changed.length) throw new Error("No window changes to submit");
  const activeScopes = report.scopes.filter((scope) => fs.existsSync(path.join(cwd, scope)) || git(cwd, ["ls-files", "--", scope]));
  if (activeScopes.length) git(cwd, ["add", "-A", "--", ...activeScopes]);
  const staged = git(cwd, ["diff", "--cached", "--name-only", "-z"]);
  if (staged) git(cwd, ["commit", "-m", message]);
  const afterCommit = inspect(cwd);
  if (!afterCommit.ok) throw new Error(`Commit introduced changes outside declared scope: ${afterCommit.outside.join(", ")}`);
  git(cwd, ["push", "-u", "origin", `HEAD:refs/heads/${report.branch}`]);
  const prEnabled = one(args, "pr", "true") !== "false";
  let pr = "";
  if (prEnabled) {
    const existing = run("gh", ["pr", "view", report.branch, "--json", "url", "--jq", ".url"], cwd, { allowFailure: true });
    if (existing.status === 0) {
      pr = existing.stdout.trim();
    } else {
      const bodyFile = path.join(path.dirname(metadataPath(cwd)), "window-pr-body.md");
      const body = `## Scope\n\n${report.scopes.map((scope) => `- \`${scope}\``).join("\n")}\n\nIndependent window submission from ${report.base}. Review and CI apply to this PR. Shared publication follows the module release gate.\n`;
      fs.writeFileSync(bodyFile, body);
      pr = run("gh", ["pr", "create", "--base", "main", "--head", report.branch, "--title", message, "--body-file", bodyFile], cwd).stdout.trim();
    }
  }
  return { ...inspect(cwd), commit: git(cwd, ["rev-parse", "HEAD"]), pr, pushed: true };
}

export function main(args = process.argv.slice(2), cwd = process.cwd()) {
  const [action, ...options] = args;
  if (action === "start") return start(options, cwd);
  if (action === "check") return inspect(cwd);
  if (action === "submit") return submit(options, cwd);
  throw new Error("Usage: window-submit.mjs start|check|submit [options]");
}

if (isMainModule(import.meta.url)) {
  try {
    console.log(JSON.stringify(main(), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
