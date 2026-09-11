import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildRoutingSchema, scoreRoutingOutput } from "../lib/model-routing-score.mjs";
import { evaluateSkillPromptContract } from "../lib/guanlan-skill-ops.mjs";

const cases = [{ id: "alpha", skill: "alpha", evalFile: "alpha.md", expected: "pass" }];
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-routing-score-"));
  fs.writeFileSync(path.join(root, "alpha.md"), "Only accepted Claims may support an event.\r\nPreserve missing values.");
  t.after(() => {
    fs.unlinkSync(path.join(root, "alpha.md"));
    fs.rmdirSync(root);
  });
  return root;
}
const row = () => ({ id: "alpha", decision: "pass", evidence_path: "alpha.md", evidence_quote: "Only accepted Claims may support an event.", rationale: "The event uses accepted evidence." });

test("routing preflight covers the live registry and rejects an unknown profile without invoking a model", () => {
  const runner = fileURLToPath(new URL("../run-model-routing-evals.mjs", import.meta.url));
  const root = path.resolve(path.dirname(runner), "..", "..");
  const env = { ...process.env, CODEX_CLI_PATH: path.join(root, "must-not-run-codex") };
  const valid = spawnSync(process.execPath, [runner, "--profile=astra-high"], { cwd: root, env, encoding: "utf8" });
  assert.equal(valid.status, 0, valid.stderr);
  assert.match(valid.stdout, /Validated \d+ cases across 1 model configurations/u);
  const invalid = spawnSync(process.execPath, [runner, "--profile=unknown"], { cwd: root, env, encoding: "utf8" });
  assert.equal(invalid.status, 1);
  assert.match(invalid.stderr, /Unknown profile/u);
});

test("routing schema derives cardinality and allowed ids from the current cases", () => {
  const template = { properties: { results: { items: { properties: { id: { type: "string" } } } } } };
  const schema = buildRoutingSchema(template, cases);
  assert.equal(schema.properties.results.minItems, 1);
  assert.equal(schema.properties.results.maxItems, 1);
  assert.deepEqual(schema.properties.results.items.properties.id.enum, ["alpha"]);
  assert.equal(template.properties.results.minItems, undefined);
});

test("a complete correct decision with an exact allowed citation passes", (t) => {
  const score = scoreRoutingOutput({ results: [row()] }, cases, fixture(t));
  assert.equal(score.passed, true);
  assert.equal(score.score, 2);
});

test("duplicates do not earn credit and missing or unknown ids fail", (t) => {
  const root = fixture(t);
  const duplicate = scoreRoutingOutput({ results: [row(), row()] }, cases, root);
  assert.equal(duplicate.passed, false);
  assert.equal(duplicate.score, 0);
  for (const rows of [[], [{ ...row(), id: "unknown" }], [row(), { ...row(), id: "extra" }]]) {
    assert.equal(scoreRoutingOutput({ results: rows }, cases, root).passed, false);
  }
});

test("existing unrelated, absolute and traversing paths cannot validate evidence", (t) => {
  const root = fixture(t);
  for (const evidence_path of [root, path.join(root, "alpha.md"), "../alpha.md", "./alpha.md", "AGENTS.md"]) {
    const score = scoreRoutingOutput({ results: [{ ...row(), evidence_path }] }, cases, root);
    assert.equal(score.evidenceValid, 0, evidence_path);
    assert.equal(score.passed, false);
  }
});

test("invented quotes, wrong decisions and malformed fields cannot pass", (t) => {
  const root = fixture(t);
  for (const invalid of [
    { ...row(), evidence_quote: "Invented evidence" },
    { ...row(), evidence_quote: " " },
    { ...row(), decision: "fail" },
    { ...row(), rationale: "" },
    { ...row(), evidence_path: 42 },
    { ...row(), extra: true },
    null,
  ]) assert.equal(scoreRoutingOutput({ results: [invalid] }, cases, root).passed, false);
  assert.equal(scoreRoutingOutput({ results: [row()], extra: true }, cases, root).passed, false);
});

test("empty Skill headings cannot satisfy the execution contract", (t) => {
  const root = fixture(t);
  const skillPath = path.join(root, "alpha.md");
  fs.writeFileSync(skillPath, "---\nname: alpha\ndescription: Use when editing alpha. Do not use for beta.\n---\n## Inputs\n<!-- pending -->\n## Workflow\nRun alpha.\n## Boundaries\nDo not invent; stop for missing authorization.\n## Output\n\n## Done When\nValidated.");
  const errors = evaluateSkillPromptContract({ name: "alpha", skillPath });
  assert.ok(errors.includes("prompt contract empty inputs section"));
  assert.ok(errors.includes("prompt contract empty output section"));
});
