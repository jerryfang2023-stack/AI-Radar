#!/usr/bin/env node

import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

function argument(name, fallback = "") {
  const prefix = `--${name}=`;
  const match = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function git(cwd, args, { allowFailure = false } = {}) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  if (!allowFailure && result.status !== 0) {
    throw new Error(result.stderr.trim() || result.stdout.trim() || `git ${args.join(" ")} failed`);
  }
  return result;
}

function normalized(value) {
  return path.resolve(value).toLocaleLowerCase();
}

function isInside(root, candidate) {
  const relative = path.relative(path.resolve(root), path.resolve(candidate));
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function parseWorktrees(output) {
  return output.trim().split(/\r?\n\r?\n/u).filter(Boolean).map((block) => {
    const record = {};
    for (const line of block.split(/\r?\n/u)) {
      const separator = line.indexOf(" ");
      const key = separator === -1 ? line : line.slice(0, separator);
      const value = separator === -1 ? true : line.slice(separator + 1);
      record[key] = value;
    }
    return record;
  });
}

function resolveComparisonRef(repository) {
  for (const candidate of ["origin/main", "main"]) {
    if (git(repository, ["rev-parse", "--verify", candidate], { allowFailure: true }).status === 0) return candidate;
  }
  throw new Error("Neither origin/main nor main exists");
}

export function auditWorkspace({
  repository,
  managedRoot,
  currentDirectory = process.cwd(),
} = {}) {
  const repo = path.resolve(repository || process.cwd());
  const entries = parseWorktrees(git(repo, ["worktree", "list", "--porcelain"]).stdout);
  if (!entries.length) throw new Error("No Git worktrees found");
  const primaryRoot = path.resolve(entries[0].worktree);
  const managed = path.resolve(managedRoot || path.join(path.dirname(primaryRoot), "_worktrees", path.basename(primaryRoot)));
  const comparisonRef = resolveComparisonRef(repo);
  const worktrees = entries.map((entry) => {
    const worktreePath = path.resolve(entry.worktree);
    const branch = String(entry.branch || "").replace(/^refs\/heads\//u, "");
    const changes = git(worktreePath, ["status", "--porcelain"]).stdout.split(/\r?\n/u).filter(Boolean);
    const ignoredFiles = git(
      worktreePath,
      ["status", "--porcelain", "--ignored", "--untracked-files=normal"],
    ).stdout.split(/\r?\n/u).filter((line) => line.startsWith("!! "));
    const counts = branch
      ? git(primaryRoot, ["rev-list", "--left-right", "--count", `${comparisonRef}...${branch}`]).stdout.trim().split(/\s+/u).map(Number)
      : [0, 0];
    const fullyMerged = Boolean(branch)
      && git(primaryRoot, ["merge-base", "--is-ancestor", branch, comparisonRef], { allowFailure: true }).status === 0;
    const primary = normalized(worktreePath) === normalized(primaryRoot);
    const current = normalized(currentDirectory) === normalized(worktreePath)
      || isInside(worktreePath, currentDirectory);
    const managedPath = isInside(managed, worktreePath);
    const removable = managedPath
      && !primary
      && !current
      && changes.length === 0
      && ignoredFiles.length === 0
      && fullyMerged
      && counts[1] === 0;
    return {
      path: worktreePath,
      branch,
      head: entry.HEAD || "",
      primary,
      current,
      managed: managedPath,
      dirty_files: changes.length,
      ignored_files: ignoredFiles.length,
      behind: counts[0],
      ahead: counts[1],
      fully_merged: fullyMerged,
      removable,
      blockers: [
        !managedPath && "outside_managed_root",
        primary && "primary_worktree",
        current && "current_worktree",
        changes.length > 0 && "dirty",
        ignoredFiles.length > 0 && "ignored_files",
        !fullyMerged && "not_merged",
        counts[1] > 0 && "unique_commits",
      ].filter(Boolean),
    };
  });
  return {
    ok: true,
    apply: false,
    repository: primaryRoot,
    managed_root: managed,
    comparison_ref: comparisonRef,
    worktrees,
  };
}

function main() {
  const apply = process.argv.includes("--apply");
  const target = argument("target");
  if (apply && !target) {
    throw new Error("--target is required with --apply");
  }
  const report = auditWorkspace({
    repository: argument("repo", process.cwd()),
    managedRoot: argument("managed-root"),
  });
  const removed = [];
  if (apply) {
    const resolvedTarget = path.resolve(target);
    const selected = report.worktrees.filter(
      (item) => normalized(item.path) === normalized(resolvedTarget),
    );
    if (selected.length !== 1) throw new Error(`--target is not a registered worktree: ${resolvedTarget}`);
    for (const worktree of selected.filter((item) => item.removable)) {
      git(report.repository, ["worktree", "remove", "--", worktree.path]);
      removed.push(worktree.path);
    }
    git(report.repository, ["worktree", "prune"]);
  }
  report.apply = apply;
  report.target = target ? path.resolve(target) : "";
  report.removed = removed;
  console.log(JSON.stringify(report, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
