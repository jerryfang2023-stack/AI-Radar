import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { inScope, normalizedScope } from "../window-submit.mjs";

const runner = path.resolve("agent-workflow/tools/window-submit.mjs");

function command(executable, args, cwd, success = true) {
  const result = spawnSync(executable, args, { cwd, encoding: "utf8", windowsHide: true });
  if (success) assert.equal(result.status, 0, result.stderr || result.stdout);
  return result;
}

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-window-submit-"));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const origin = path.join(root, "origin.git");
  const repo = path.join(root, "WaveSight");
  fs.mkdirSync(repo);
  command("git", ["init", "--bare", origin], root);
  command("git", ["init", "-b", "main"], repo);
  command("git", ["config", "user.name", "Window Test"], repo);
  command("git", ["config", "user.email", "window@example.test"], repo);
  fs.mkdirSync(path.join(repo, "module"));
  fs.writeFileSync(path.join(repo, "module", "input.txt"), "initial\n");
  fs.writeFileSync(path.join(repo, "README.md"), "shared\n");
  command("git", ["add", "-A"], repo);
  command("git", ["commit", "-m", "initial"], repo);
  command("git", ["remote", "add", "origin", origin], repo);
  command("git", ["push", "-u", "origin", "main"], repo);
  return { root, repo, origin };
}

test("scope validation rejects traversal and accepts a module subtree", () => {
  for (const value of ["", "../module", "module/../other", "C:/other", ".git/config", "/module"]) {
    assert.throws(() => normalizedScope(value));
  }
  assert.equal(normalizedScope("module\\nested/"), "module/nested");
  assert.equal(inScope("module/file.txt", ["module"]), true);
  assert.equal(inScope("module-other/file.txt", ["module"]), false);
});

test("each window commits and pushes only its declared module without syncing main", (t) => {
  const { root, repo, origin } = fixture(t);
  const worktrees = path.join(root, "windows");
  const opened = command(process.execPath, [runner, "start", "--name=module-a", "--scope=module", `--worktrees=${worktrees}`], repo);
  const window = JSON.parse(opened.stdout);
  assert.equal(window.scopes[0], "module");
  assert.equal(fs.existsSync(window.worktree), true);
  command("git", ["config", "user.name", "Window Test"], window.worktree);
  command("git", ["config", "user.email", "window@example.test"], window.worktree);

  fs.writeFileSync(path.join(window.worktree, "module", "input.txt"), "window update\n");
  fs.writeFileSync(path.join(window.worktree, "README.md"), "another module's change\n");
  const blocked = command(process.execPath, [runner, "submit", "--message=Module update", "--pr=false"], window.worktree, false);
  assert.notEqual(blocked.status, 0);
  assert.match(blocked.stderr, /outside declared scope/u);
  assert.equal(command("git", ["status", "--porcelain"], window.worktree).stdout.includes("README.md"), true);

  fs.writeFileSync(path.join(window.worktree, "README.md"), "shared\n");
  const submitted = command(process.execPath, [runner, "submit", "--message=Module update", "--pr=false"], window.worktree);
  const report = JSON.parse(submitted.stdout);
  assert.equal(report.pushed, true);
  assert.deepEqual(report.changed, ["module/input.txt"]);
  assert.equal(command("git", ["show", "--format=", "--name-only", report.commit], window.worktree).stdout.trim(), "module/input.txt");
  assert.equal(command("git", ["rev-parse", "refs/heads/codex/window/module-a"], origin).stdout.trim(), report.commit);
  assert.equal(command("git", ["rev-parse", "main"], repo).stdout.trim(), window.base);
});

test("a rename from another module remains outside scope after it is committed", (t) => {
  const { root, repo } = fixture(t);
  const opened = command(process.execPath, [runner, "start", "--name=rename-guard", "--scope=module", `--worktrees=${path.join(root, "windows")}`], repo);
  const window = JSON.parse(opened.stdout);
  command("git", ["config", "user.name", "Window Test"], window.worktree);
  command("git", ["config", "user.email", "window@example.test"], window.worktree);
  command("git", ["mv", "README.md", "module/README.md"], window.worktree);
  command("git", ["commit", "-m", "Move shared file"], window.worktree);

  const checked = JSON.parse(command(process.execPath, [runner, "check"], window.worktree).stdout);
  assert.equal(checked.ok, false);
  assert.deepEqual(checked.outside, ["README.md"]);
  const blocked = command(process.execPath, [runner, "submit", "--message=Move shared file", "--pr=false"], window.worktree, false);
  assert.match(blocked.stderr, /README\.md/u);
});
