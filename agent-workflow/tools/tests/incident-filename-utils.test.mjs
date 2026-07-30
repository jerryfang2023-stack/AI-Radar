import assert from "node:assert/strict";
import test from "node:test";
import { isProductionIncidentFilename } from "../incident-filename-utils.mjs";

test("production incident discovery excludes documentation and templates", () => {
  assert.equal(isProductionIncidentFilename("README.md"), false);
  assert.equal(isProductionIncidentFilename("TEMPLATE.md"), false);
  assert.equal(isProductionIncidentFilename("2026-07-19-follow_builders_skill-first-line-viewpoints.md"), true);
});
