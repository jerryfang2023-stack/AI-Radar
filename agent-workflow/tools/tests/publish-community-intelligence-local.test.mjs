import test from "node:test";
import assert from "node:assert/strict";
import { syncLocalMainAfterPublish } from "../publish-community-intelligence-local.mjs";

function runner(results) {
  const queue = [...results];
  return () => queue.shift() || { ok: true, stdout: "", stderr: "" };
}

test("remote publication stays successful when local main is dirty", () => {
  const result = syncLocalMainAfterPublish("main", runner([
    { ok: true, stdout: "", stderr: "" },
    { ok: true, stdout: " M unrelated-file.md\n", stderr: "" },
  ]));

  assert.equal(result.attempted, true);
  assert.equal(result.ok, false);
  assert.equal(result.pulled, false);
  assert.equal(result.dirtyFiles, 1);
  assert.match(result.warning, /Publication completed.*pull was skipped/iu);
});

test("clean local main fast-forwards after publication", () => {
  const result = syncLocalMainAfterPublish("main", runner([
    { ok: true, stdout: "", stderr: "" },
    { ok: true, stdout: "", stderr: "" },
    { ok: true, stdout: "Already up to date.", stderr: "" },
  ]));

  assert.equal(result.ok, true);
  assert.equal(result.pulled, true);
  assert.equal(result.warning, "");
});

test("a run started outside main does not change the caller branch", () => {
  const result = syncLocalMainAfterPublish("codex/work", () => {
    throw new Error("runner must not be called");
  });

  assert.equal(result.attempted, false);
  assert.equal(result.ok, true);
  assert.match(result.warning, /started on codex\/work/iu);
});
