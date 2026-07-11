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

  const stages = [
    ["evidence_supply", [["monitor", "Daily Monitor"], ["evidenceGate", "evidence-supply gate"]]],
    ["card_generation", [["cards", "Card generation"]]],
    ["card_quality", [["dedupe", "Card dedupe/freshness gate"], ["cardEditorial", "Card editorial quality gate"]]],
    ["frontstage_contract", [["frontstageData", "frontstage build"], ["frontstageGate", "unified frontstage gate"], ["operations", "operations sync"], ["freshness", "final freshness gate"]]],
  ];

  for (const [stage, checks] of stages) {
    const failed = checks.find(([key]) => value(input, key) !== "success");
    if (failed) return { ok: false, status: "failed", stage, reason: `${failed[1]} outcome is ${value(input, failed[0])}` };
  }

  if (value(input, "commit") !== "success") {
    return { ok: false, status: "failed", stage: "publication", reason: `automation-branch commit outcome is ${value(input, "commit")}` };
  }

  if (String(input.changed) !== "true") {
    return { ok: true, status: "passed", stage: "publication", reason: "production passed with no new diff" };
  }

  if (input.prStatus === "manual_required" || input.mergeStatus === "publication_waiting") {
    return { ok: true, status: "publication_waiting", stage: "publication", reason: input.prStatus === "manual_required" ? "automation branch is ready and PR creation needs repository permission" : "PR exists and needs conflict repair/merge" };
  }
  if (value(input, "pr") !== "success") {
    return { ok: false, status: "failed", stage: "publication", reason: `PR outcome is ${value(input, "pr")}` };
  }
  if (value(input, "merge") !== "success") {
    return { ok: false, status: "failed", stage: "publication", reason: `merge outcome is ${value(input, "merge")}` };
  }
  return { ok: true, status: "passed", stage: "publication", reason: "production gates passed and publication completed or auto-merge was enabled" };
}

function runFixtures() {
  const passedStages = { monitor: "success", evidenceGate: "success", cards: "success", dedupe: "success", cardEditorial: "success", frontstageData: "success", frontstageGate: "success", operations: "success", freshness: "success", commit: "success" };
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, cards: "failure" }).stage, "card_generation");
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, dedupe: "failure" }).stage, "card_quality");
  assert.equal(classifyBusinessSignalsProduction({ ...passedStages, frontstageGate: "failure" }).stage, "frontstage_contract");
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
