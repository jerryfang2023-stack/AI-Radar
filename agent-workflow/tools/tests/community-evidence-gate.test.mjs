import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

test("publication checks locators without private access; local gate still requires originals", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "community-evidence-gate-"));
  const script = path.resolve("agent-workflow/tools/assert-community-intelligence-data.mjs");
  const dataFile = path.join(root, "01-SiteV2/site/data/community-intelligence.json");
  const href = "https://my.feishu.cn/wiki/TestResource";
  const payload = {
    meta: { generatedAt: "2026-09-12T01:00:00Z", selectedKeywords: ["飞书"], scysAcquisition: "mcp", errors: [] },
    items: [{ id: "scys-test", acquisition: "scys-mcp", title: "飞书资料测试", bodyRef: `evidence://${"a".repeat(64)}`, links: [{ href }], relatedResources: [] }],
    links: [{ href }],
  };
  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  const run = (args) => spawnSync(process.execPath, [script, "--date=2026-09-12", "--min-items=1", "--min-links=1", ...args], {
    cwd: root, encoding: "utf8", windowsHide: true,
    env: { ...process.env, GUANLAN_EVIDENCE_BACKUP_ROOT: path.join(root, "missing-store") },
  });
  try {
    fs.writeFileSync(dataFile, JSON.stringify(payload));
    assert.equal(run(["--private-evidence=references"]).status, 0);
    assert.equal(run([]).status, 1, "default local mode must not silently skip missing original bodies");
    payload.items[0].bodyRef = "invalid";
    fs.writeFileSync(dataFile, JSON.stringify(payload));
    assert.equal(run(["--private-evidence=references"]).status, 1);
    assert.equal(run(["--private-evidence=skip"]).status, 1);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
