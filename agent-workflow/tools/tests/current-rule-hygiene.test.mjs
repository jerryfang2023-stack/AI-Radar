import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const testDir = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(testDir, "..", "assert-current-rule-hygiene.mjs");

function runFixture(rawDocuments, canonicalEvents = []) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-rule-hygiene-"));
  const dateDir = path.join(root, "01-SiteV2", "content", "11-databases", "data-center-v4", "2026-08-23");
  const translationDir = path.join(root, "01-SiteV2", "content", "11-databases");
  fs.mkdirSync(dateDir, { recursive: true });
  fs.writeFileSync(path.join(root, "AGENTS.md"), "# Current rules\n", "utf8");
  fs.writeFileSync(
    path.join(translationDir, "source-title-translations.json"),
    JSON.stringify({
      translations: [{
        sourceTitle: "AI agent trends 2026 report",
        zhTitle: `2026年AI智能体${"趋势" + "报告"}`,
      }],
    }, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(dateDir, "raw-documents.json"),
    JSON.stringify(rawDocuments, null, 2),
    "utf8",
  );
  fs.writeFileSync(
    path.join(dateDir, "canonical-events.json"),
    JSON.stringify(canonicalEvents, null, 2),
    "utf8",
  );
  const result = spawnSync(process.execPath, [script, "--date=2026-08-23"], {
    cwd: root,
    encoding: "utf8",
  });
  fs.rmSync(root, { recursive: true, force: true });
  return result;
}

test("current rule hygiene allows retired phrases inside faithful source titles", () => {
  const sourcePhrase = "趋势" + "报告";
  const result = runFixture([{
    title_original: "AI agent trends 2026 report",
    title_zh: `2026年AI智能体${sourcePhrase}`,
  }]);
  assert.equal(result.status, 0, result.stdout || result.stderr);
});

test("current rule hygiene still rejects exact retired structured values", () => {
  const retiredValue = "trend" + "_report";
  const result = runFixture([], [{ route_type: retiredValue }]);
  assert.equal(result.status, 1, result.stdout || result.stderr);
  assert.match(result.stdout, /retired_data_term/u);
  assert.match(result.stdout, new RegExp(retiredValue, "u"));
});
