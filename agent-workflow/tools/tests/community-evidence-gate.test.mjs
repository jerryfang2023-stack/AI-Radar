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

test("recovery validates the committed snapshot without replacing stale local data or bypassing gates", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "community-published-gate-"));
  const script = path.resolve("agent-workflow/tools/assert-community-intelligence-data.mjs");
  const relative = "01-SiteV2/site/data/community-intelligence.json";
  const dataFile = path.join(root, relative);
  const payload = {
    meta: { generatedAt: "2026-09-13T01:00:00Z", selectedKeywords: ["飞书"], errors: [] },
    items: [{ id: "accepted", title: "已验收社群内容" }], links: [{ href: "https://example.com/resource" }],
  };
  const git = (...args) => {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8", windowsHide: true });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
  };
  const gate = (...args) => spawnSync(process.execPath, [script, "--date=2026-09-13", "--min-items=1", "--min-links=1", ...args], {
    cwd: root, encoding: "utf8", windowsHide: true,
    env: { ...process.env, GUANLAN_EVIDENCE_BACKUP_ROOT: path.join(root, "missing-store") },
  });
  try {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, JSON.stringify(payload));
    git("init");
    git("add", relative);
    git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.com", "commit", "-m", "accepted snapshot");
    const accepted = git("rev-parse", "HEAD");
    git("update-ref", "refs/remotes/origin/main", accepted);
    const stale = JSON.stringify({ ...payload, meta: { ...payload.meta, generatedAt: "2026-09-12T01:00:00Z" } });
    fs.writeFileSync(dataFile, stale);
    assert.equal(gate().status, 1, "collector still checks its local candidate");
    assert.equal(gate("--source-ref=origin/main").status, 0);
    assert.equal(fs.readFileSync(dataFile, "utf8"), stale, "recovery cannot overwrite local edits");
    const report = fs.readFileSync(path.join(root, "agent-workflow/reports/2026-09-13-community-intelligence-gate.md"), "utf8");
    assert.ok(report.includes(`source_commit: ${accepted}`));
    assert.equal(gate("--source-ref=origin/missing").status, 1, "missing ref cannot fall back to local data");
    payload.meta.scysAcquisition = "mcp";
    payload.items[0] = { ...payload.items[0], acquisition: "scys-mcp", bodyRef: `evidence://${"b".repeat(64)}`, relatedResources: [] };
    fs.writeFileSync(dataFile, JSON.stringify(payload));
    git("add", relative);
    git("-c", "user.name=Fixture", "-c", "user.email=fixture@example.com", "commit", "-m", "private evidence required");
    assert.equal(gate("--source-ref=HEAD").status, 1, "published ref must still verify private originals");
    assert.equal(gate("--source-ref=HEAD", "--private-evidence=references").status, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
