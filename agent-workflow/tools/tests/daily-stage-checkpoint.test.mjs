import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";
import { createStageCheckpoint } from "../lib/daily-stage-checkpoint.mjs";

test("retry reuses successful stages but retries failure; new source invalidates receipts", () => {
  const folder = fs.mkdtempSync(path.join(os.tmpdir(), "daily-stages-"));
  const file = path.join(folder, "receipt.json");
  try {
    const identity = { date: "2026-10-01", sourceCommit: "accepted-a", codeCommit: "v2" };
    const first = createStageCheckpoint({ file, identity });
    first.run("vault", () => ({ ok: true }));
    first.run("portal", () => ({ ok: false }));
    const retry = createStageCheckpoint({ file, identity });
    assert.equal(retry.run("vault", () => { throw new Error("must reuse"); }).reused, true);
    assert.equal(retry.run("portal", () => ({ ok: true })).ok, true);
    const changed = createStageCheckpoint({ file, identity: { ...identity, sourceCommit: "accepted-b" } });
    assert.equal(changed.run("vault", () => ({ ok: true })).reused, false);
  } finally { fs.rmSync(folder, { recursive: true, force: true }); }
});

test("dry run performs no actions and writes no success receipts", () => {
  const file = path.join(os.tmpdir(), `not-created-${process.pid}.json`);
  const checkpoint = createStageCheckpoint({ file, identity: {}, dryRun: true });
  assert.equal(checkpoint.run("publish", () => { throw new Error("must not run"); }).status, "planned");
  assert.equal(fs.existsSync(file), false);
});
