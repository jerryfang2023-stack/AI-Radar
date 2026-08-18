import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const source = (file) => fs.readFileSync(path.join(root, "miniprogram", file), "utf8");

test("paid details are not embedded in the Mini Program package", () => {
  const funding = require(path.join(root, "miniprogram", "data", "funding-details.js"));
  const reports = require(path.join(root, "miniprogram", "data", "report-details.js"));
  assert.deepEqual(funding, {});
  assert.deepEqual(reports, {});
});

test("detail and comparison pages use the unified protected-content API", () => {
  for (const file of [
    "pages/detail/index.js",
    "pages/report-detail/index.js",
    "pages/entity-detail/index.js",
    "pages/sector-detail/index.js",
    "pages/compare/index.js",
  ]) {
    assert.match(source(file), /fetchProtectedContent/);
  }
  assert.doesNotMatch(source("pages/detail/index.js"), /getFundingDetail/);
  assert.doesNotMatch(source("pages/report-detail/index.js"), /getReportDetail/);
  assert.match(source("pages/report-detail/index.js"), /getCommunityDetail/);
  assert.doesNotMatch(source("utils/live-data.js"), /function getReportDetail|\bgetReportDetail,/);
  assert.doesNotMatch(source("pages/compare/index.js"), /getFundingDetails/);
});
