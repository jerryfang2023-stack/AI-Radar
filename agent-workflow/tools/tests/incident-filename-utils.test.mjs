import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isProductionIncidentFilename } from "../incident-filename-utils.mjs";

test("production incident discovery excludes documentation and templates", () => {
  assert.equal(isProductionIncidentFilename("README.md"), false);
  assert.equal(isProductionIncidentFilename("TEMPLATE.md"), false);
  assert.equal(isProductionIncidentFilename("2026-07-19-follow_builders_skill-first-line-viewpoints.md"), true);
});

test("external runtime incidents can be read and resolved without writing the source workspace", () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-incident-runtime-"));
  const registry = path.join(temp, "runtime", "production-incidents");
  const repo = path.join(temp, "repo");
  fs.mkdirSync(registry, { recursive: true });
  fs.mkdirSync(repo);
  const name = "2026-09-05-business-signals-recurring-test.md";
  const source = "status: open\npriority: normal\nlane: business-signals\n\n# Runtime incident\n";
  fs.writeFileSync(path.join(registry, name), source);
  const toolsRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const run = (script, args) => JSON.parse(execFileSync(process.execPath,
    [path.join(toolsRoot, script), `--inbox-dir=${registry}`, ...args], { cwd: repo, encoding: "utf8" }));
  try {
    const listed = run("read-production-incidents.mjs", []);
    assert.equal(listed.count, 1);
    assert.ok(listed.repair_prompt.includes(`--inbox-dir="${registry}"`));
    run("resolve-production-incident.mjs", [`--file=${name}`, "--fix-commit=tested-commit", "--validation=regression-pass", "--prevention=gate"]);
    assert.match(fs.readFileSync(path.join(registry, name), "utf8"), /^status: resolved/u);
    assert.equal(run("read-production-incidents.mjs", []).count, 0);
    assert.deepEqual(fs.readdirSync(repo), []);
    const outside = path.join(temp, name);
    fs.writeFileSync(outside, source);
    assert.throws(() => run("resolve-production-incident.mjs", [`--file=${outside}`]));
    assert.equal(fs.readFileSync(outside, "utf8"), source);
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
