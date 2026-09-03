import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildPortfolio, publicVersionSources, sanitizeVersionResponse } from "../lib/ops-platforms.mjs";
import { catalogSources, skillPlatformIds, platformCoverage } from "../lib/skill-catalog.mjs";
import { OPS_VERSION } from "../lib/collection-telemetry-v1.mjs";

test("public version ingestion keeps only allowlisted metadata and rejects invalid payloads", () => {
  const source = publicVersionSources.find((item) => item.id === "community");
  assert.deepEqual(sanitizeVersionResponse(source, { ok: true, version: "1.6.13", h5_version: "4.6.1", phone: "private", token: "secret" }), { version: "1.6.13", h5_version: "4.6.1" });
  assert.throws(() => sanitizeVersionResponse(source, { ok: false, version: "1", h5_version: "4" }));
  assert.throws(() => sanitizeVersionResponse(source, { ok: true, version: "<script>", h5_version: "4" }));
  assert.throws(() => sanitizeVersionResponse(source, {}));
});

test("portfolio distinguishes source, deployed, unavailable and missing evidence", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ops-platform-test-"));
  fs.mkdirSync(path.join(root, "02-Miniprogram"));
  fs.writeFileSync(path.join(root, "02-Miniprogram/package.json"), JSON.stringify({ version: "0.9.0" }));
  const result = buildPortfolio(root, [{ key: "OPS", label: "OPS", value: "OPS-V3" }], { sources: [{ id: "community", status: "unavailable", verifiedAt: "2026-08-29T00:00:00Z", values: { version: "1.6.13", h5_version: "4.6.1" } }] });
  assert.equal(result.platforms.length, 5);
  const mini = result.versions.find((item) => item.key === "MINIPROGRAM");
  assert.equal(mini.value, "0.9.0");
  assert.equal(mini.kind, "source");
  assert.match(mini.status, /线上待核验/u);
  assert.equal(result.versions.find((item) => item.key === "H5").value, "未登记");
  const members = result.versions.find((item) => item.key === "MEMBERS");
  assert.equal(members.value, "1.6.13");
  assert.equal(members.verified, false);
  assert.equal(result.skills.total, null);
  assert.ok(!JSON.stringify(result).includes(root.replaceAll("\\", "\\\\")));
});

test("optional platform directories are scanned without claiming absent sources are synced", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ops-skills-test-"));
  const config = { platforms: [{ id: "mini", label: "小程序", skillNames: ["shared-writing"] }], projectSources: [{ id: "mini", platformId: "mini", label: "Mini", rootRelativePath: "skills", required: false }] };
  const missing = catalogSources(config, { rootDir: root });
  assert.equal(missing.sources[0].available, false);
  assert.equal(missing.sources[0].required, false);
  assert.equal(missing.entries.length, 0);
  fs.mkdirSync(path.join(root, "skills/new-rule"), { recursive: true });
  fs.writeFileSync(path.join(root, "skills/new-rule/SKILL.md"), "---\nname: new-rule\ndescription: 平台规则\n---\n");
  const found = catalogSources(config, { rootDir: root });
  assert.equal(found.sources[0].count, 1);
  assert.deepEqual(skillPlatformIds(config, "new-rule", found.entries[0]), ["mini"]);
  assert.deepEqual(skillPlatformIds(config, "shared-writing"), ["mini"]);
  assert.deepEqual(skillPlatformIds(config, "unknown"), ["shared"]);
  const counts = platformCoverage(config, [{ platformIds: ["mini"], sourceKind: "skill-store" }, { platformIds: ["mini"], sourceKind: "external-project" }], found.sources)[0];
  assert.equal(counts.count, 2);
  assert.equal(counts.sharedCount, 1);
  assert.equal(counts.projectCount, 1);
});

test("console has seven panels and local settings without removed modules", () => {
  const html = fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8");
  const client = fs.readFileSync("01-SiteV2/site/assets/operations-console.js", "utf8");
  const data = JSON.parse(fs.readFileSync("01-SiteV2/site/data/ops-console.json", "utf8"));
  assert.equal(data.meta.version, OPS_VERSION);
  assert.equal(data.quality.telemetry.meta.ops_version, OPS_VERSION);
  assert.ok(html.includes(OPS_VERSION));
  assert.deepEqual([...html.matchAll(/data-panel="([^"]+)"/gu)].map((match) => match[1]).sort(), ["analytics", "governance", "membership", "overview", "quality", "settings", "skills"]);
  assert.doesNotMatch(html, /data-tab="(?:issues|tasks)"|问题中心|任务链路/u);
  assert.doesNotMatch(client, /renderIssues|renderTasks|data-work-queue/u);
  for (const marker of ["data-platform-cards", "data-version-category", "data-version-search", "data-preferences-form", "data-setting-stale", "data-source-quality"]) assert.ok(html.includes(marker));
  assert.match(client, /localStorage.setItem/u);
  assert.match(client, /event.origin === location.origin/u);
  assert.match(html, /data-ops-console[^>]+hidden/u);
  assert.match(html, /data-ops-logout/u);
});
