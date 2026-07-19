import assert from "node:assert/strict";
import test from "node:test";
import { isHermesInboxRecordFilename } from "../hermes-inbox-utils.mjs";

test("Hermes inbox discovery excludes documentation and templates", () => {
  assert.equal(isHermesInboxRecordFilename("README.md"), false);
  assert.equal(isHermesInboxRecordFilename("TEMPLATE.md"), false);
  assert.equal(isHermesInboxRecordFilename("2026-07-19-follow_builders_skill-first-line-viewpoints.md"), true);
});
