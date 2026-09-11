import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { defaultRepairArgs } from "../lib/codex-repair-model.mjs";

test("repair invocation preserves paths and TOML quotes while carrying Astra into an old worktree", () => {
  const cwd = 'C:\\Workspace With Spaces\\repair';
  const output = 'C:\\Workspace With Spaces\\last message.md';
  const args = defaultRepairArgs(cwd, output);
  assert.equal(args[args.indexOf("--cd") + 1], cwd);
  assert.equal(args[args.indexOf("--output-last-message") + 1], output);
  assert.equal(args[args.indexOf("--model") + 1], "gpt-6-astra");
  assert.equal(args[args.indexOf("--config") + 1], 'model_reasoning_effort="high"');
  assert.equal(args.at(-1), "-");
  assert.equal(args.filter((arg) => arg === "--model").length, 1);
});

test("the production launcher uses the tested argument builder before worktree enforcement", () => {
  const source = fs.readFileSync(new URL("../run-codex-self-repair.mjs", import.meta.url), "utf8");
  assert.match(source, /defaultRepairArgs\(repairWorktree.path, codexLastMessagePath\)/);
  assert.match(source, /enforceRepairWorktree\(args.has\("codex-args"\).*defaultCodexArgs, repairWorktree.path\)/);
});
