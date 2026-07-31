import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const projectRoot = process.cwd();
const runner = path.join(projectRoot, "agent-workflow", "tools", "audit-local-workspace.mjs");

function git(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8", windowsHide: true });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  return result.stdout.trim();
}

function createRepository() {
  const sandbox = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-workspace-audit-"));
  const repository = path.join(sandbox, "WaveSight");
  const managedRoot = path.join(sandbox, "_worktrees", "WaveSight");
  fs.mkdirSync(repository, { recursive: true });
  fs.mkdirSync(managedRoot, { recursive: true });
  git(repository, ["init", "-b", "main"]);
  git(repository, ["config", "user.email", "workspace-audit@example.test"]);
  git(repository, ["config", "user.name", "Workspace Audit"]);
  fs.writeFileSync(path.join(repository, "README.md"), "workspace audit fixture\n", "utf8");
  git(repository, ["add", "README.md"]);
  git(repository, ["commit", "-m", "initial"]);
  return { sandbox, repository, managedRoot };
}

test("audit reports a clean merged managed worktree as removable without deleting it", (t) => {
  const { sandbox, repository, managedRoot } = createRepository();
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  const worktree = path.join(managedRoot, "completed-task");
  git(repository, ["worktree", "add", "-b", "completed-task", worktree, "main"]);

  const result = spawnSync(process.execPath, [
    runner,
    `--repo=${repository}`,
    `--managed-root=${managedRoot}`,
    "--json",
  ], { cwd: projectRoot, encoding: "utf8", windowsHide: true });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  const candidate = report.worktrees.find((item) => item.path === worktree);
  assert.equal(report.apply, false);
  assert.equal(candidate.removable, true);
  assert.equal(fs.existsSync(worktree), true);
});

test("apply removes only a clean merged worktree inside the managed root", (t) => {
  const { sandbox, repository, managedRoot } = createRepository();
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  const worktree = path.join(managedRoot, "completed-task");
  git(repository, ["worktree", "add", "-b", "completed-task", worktree, "main"]);

  const result = spawnSync(process.execPath, [
    runner,
    `--repo=${repository}`,
    `--managed-root=${managedRoot}`,
    "--apply",
    "--json",
  ], { cwd: projectRoot, encoding: "utf8", windowsHide: true });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  assert.deepEqual(report.removed, [worktree]);
  assert.equal(fs.existsSync(worktree), false);
});

test("apply refuses to remove a dirty managed worktree", (t) => {
  const { sandbox, repository, managedRoot } = createRepository();
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  const worktree = path.join(managedRoot, "dirty-task");
  git(repository, ["worktree", "add", "-b", "dirty-task", worktree, "main"]);
  fs.writeFileSync(path.join(worktree, "notes.md"), "uncommitted work\n", "utf8");

  const result = spawnSync(process.execPath, [
    runner,
    `--repo=${repository}`,
    `--managed-root=${managedRoot}`,
    "--apply",
    "--json",
  ], { cwd: projectRoot, encoding: "utf8", windowsHide: true });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  const candidate = report.worktrees.find((item) => item.path === worktree);
  assert.equal(candidate.removable, false);
  assert.ok(candidate.blockers.includes("dirty"));
  assert.deepEqual(report.removed, []);
  assert.equal(fs.existsSync(path.join(worktree, "notes.md")), true);
});

test("audit invoked inside a linked worktree still identifies the primary repository and protects itself", (t) => {
  const { sandbox, repository, managedRoot } = createRepository();
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  const worktree = path.join(managedRoot, "active-task");
  git(repository, ["worktree", "add", "-b", "active-task", worktree, "main"]);

  const result = spawnSync(process.execPath, [
    runner,
    `--repo=${worktree}`,
    `--managed-root=${managedRoot}`,
    "--apply",
    "--json",
  ], { cwd: worktree, encoding: "utf8", windowsHide: true });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  const candidate = report.worktrees.find((item) => item.path === worktree);
  assert.equal(report.repository, repository);
  assert.equal(candidate.primary, false);
  assert.equal(candidate.current, true);
  assert.equal(candidate.removable, false);
  assert.ok(candidate.blockers.includes("current_worktree"));
  assert.equal(fs.existsSync(worktree), true);
});

test("apply preserves a clean managed worktree with unique commits", (t) => {
  const { sandbox, repository, managedRoot } = createRepository();
  t.after(() => fs.rmSync(sandbox, { recursive: true, force: true }));
  const worktree = path.join(managedRoot, "unmerged-task");
  git(repository, ["worktree", "add", "-b", "unmerged-task", worktree, "main"]);
  fs.writeFileSync(path.join(worktree, "result.md"), "unique result\n", "utf8");
  git(worktree, ["add", "result.md"]);
  git(worktree, ["commit", "-m", "unique task result"]);

  const result = spawnSync(process.execPath, [
    runner,
    `--repo=${repository}`,
    `--managed-root=${managedRoot}`,
    "--apply",
    "--json",
  ], { cwd: projectRoot, encoding: "utf8", windowsHide: true });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const report = JSON.parse(result.stdout);
  const candidate = report.worktrees.find((item) => item.path === worktree);
  assert.equal(candidate.removable, false);
  assert.ok(candidate.blockers.includes("not_merged"));
  assert.ok(candidate.blockers.includes("unique_commits"));
  assert.deepEqual(report.removed, []);
  assert.equal(fs.existsSync(path.join(worktree, "result.md")), true);
});
