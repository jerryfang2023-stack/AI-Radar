#!/usr/bin/env node
import assert from "node:assert/strict";

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

function value(input, key, fallback = "skipped") {
  return String(input[key] ?? fallback).trim() || fallback;
}

export function classifyBusinessSignalsProduction(input = {}) {
  if (String(input.skip) === "true") {
    return { ok: true, status: "passed", stage: "no_op", reason: input.skipReason || "healthy same-date assets already exist" };
  }

  // Opportunity Map, Trend Radar, and Funding Insights are independently
  // versioned application projections. Their failures must remain visible,
  // including when a core or publication stage also fails, but they cannot
  // discard an accepted V4 factual bundle.
  const warnings = [
    ["opportunity", "Opportunity Map projection"],
    ["trend", "Trend Radar projection"],
    ["funding", "Funding Insights projection"],
  ].filter(([key]) => value(input, key) !== "success")
    .map(([key, label]) => `${label} outcome is ${value(input, key)}`);
  const warningSuffix = warnings.length ? `; downstream warnings: ${warnings.join("; ")}` : "";

  const v4Stages = [
    ["evidence_supply", [["monitor", "Daily Monitor"], ["evidenceGate", "evidence-supply gate"]]],
    ["data_center_v4", [["dataCenterBuild", "Data Center V4 build"], ["dataCenterGate", "Data Center V4 integrity gate"], ["dataCenterMaterialize", "Data Center V4 materialization"]]],
    ["operations", [["operations", "operations data sync"], ["freshness", "V4 pre-commit gate"]]],
  ];

  for (const [stage, checks] of v4Stages) {
    const failed = checks.find(([key]) => value(input, key) !== "success");
    if (failed) return { ok: false, status: "failed", stage, reason: `${failed[1]} outcome is ${value(input, failed[0])}${warningSuffix}`, warnings };
  }

  if (String(input.compatibilityRetired) !== "true") {
    return { ok: false, status: "failed", stage: "policy", reason: `V3 compatibility retirement is not explicitly declared${warningSuffix}`, warnings };
  }

  if (value(input, "commit") !== "success") {
    return { ok: false, status: "failed", stage: "publication", reason: `automation-branch commit outcome is ${value(input, "commit")}${warningSuffix}`, warnings };
  }

  if (String(input.changed) !== "true") {
    return { ok: true, status: "passed", stage: "publication", reason: `core V4 production passed with no new diff${warningSuffix}`, warnings };
  }

  if (input.prStatus === "manual_required" || input.mergeStatus === "publication_waiting") {
    return { ok: true, status: "publication_waiting", stage: "publication", reason: `${input.prStatus === "manual_required" ? "automation branch is ready and PR creation needs repository permission" : "PR exists and needs conflict repair/merge"}${warningSuffix}`, warnings };
  }
  if (value(input, "pr") !== "success") {
    return { ok: false, status: "failed", stage: "publication", reason: `PR outcome is ${value(input, "pr")}${warningSuffix}`, warnings };
  }
  if (value(input, "merge") !== "success") {
    return { ok: false, status: "failed", stage: "publication", reason: `merge outcome is ${value(input, "merge")}${warningSuffix}`, warnings };
  }
  return { ok: true, status: "passed", stage: "publication", reason: `core V4 production gates passed and publication completed or auto-merge was enabled${warningSuffix}`, warnings };
}

function runFixtures() {
  const passedStages = { monitor: "success", evidenceGate: "success", dataCenterBuild: "success", dataCenterGate: "success", dataCenterMaterialize: "success", opportunity: "success", trend: "success", funding: "success", operations: "success", freshness: "success", compatibilityRetired: "true", commit: "success" };
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, dataCenterGate: "failure" }).stage, "data_center_v4");
  const optionalFailure = classifyBusinessSignalsProduction({ ...passedStages, opportunity: "failure", changed: "false" });
  assert.equal(optionalFailure.ok, true);
  assert.equal(optionalFailure.status, "passed");
  assert.deepEqual(optionalFailure.warnings, ["Opportunity Map projection outcome is failure"]);
  const multipleOptionalFailures = classifyBusinessSignalsProduction({ ...passedStages, funding: "failure", trend: "skipped", changed: "false" });
  assert.equal(multipleOptionalFailures.ok, true);
  assert.equal(multipleOptionalFailures.warnings.length, 2);
  const combinedFailure = classifyBusinessSignalsProduction({ ...passedStages, dataCenterGate: "failure", funding: "failure" });
  assert.equal(combinedFailure.ok, false);
  assert.equal(combinedFailure.stage, "data_center_v4");
  assert.deepEqual(combinedFailure.warnings, ["Funding Insights projection outcome is failure"]);
  assert.match(combinedFailure.reason, /downstream warnings: Funding Insights projection outcome is failure/u);
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, compatibilityRetired: "false" }).stage, "policy");
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, changed: "true", pr: "success", merge: "success", mergeStatus: "publication_waiting" }).status, "publication_waiting");
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, changed: "false" }).status, "passed");
  console.log(JSON.stringify({ ok: true, fixture: "business-signals-production-state" }, null, 2));
}

function main() {
  const input = Object.fromEntries(args);
  const result = classifyBusinessSignalsProduction(input);
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}

if (args.get("fixtures") === "true") runFixtures();
else main();
