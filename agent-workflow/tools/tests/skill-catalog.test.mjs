import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { skillSummary, catalogSources } from "../lib/skill-catalog.mjs";
import { parseFrontmatter } from "../lib/guanlan-skill-ops.mjs";
import { evaluateSkillStoreDashboard } from "../assert-skill-store-dashboard.mjs";

const builder = fileURLToPath(new URL("../build-skill-store-dashboard.mjs", import.meta.url));
const write = (file, text) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text, "utf8"); };
const skill = (name, description) => `---\nname: ${name}\ndescription: ${description}\n---\n# ${name}\n`;

test("literal/folded descriptions preserve Chinese text, not YAML scalar markers", () => {
  for (const marker of ["|", "|-", "|+", ">", ">-"]) {
    const source = `\uFEFF---\r\nname: writing\r\ndescription: ${marker}\r\n  朋友圈文案。\r\n  第二行：来源核对。\r\nlicense: MIT\r\nmetadata:\r\n  guanlan:\r\n    version: "1.0.0"\r\n---\r\n`;
    const result = skillSummary(source);
    assert.equal(result.description, marker.startsWith(">") ? "朋友圈文案。 第二行：来源核对。" : "朋友圈文案。\n第二行：来源核对。");
    assert.equal(result.version, "1.0.0");
    assert.equal(parseFrontmatter(source).description, result.description);
    assert.equal(parseFrontmatter(source).metadata.guanlan.version, "1.0.0");
  }
  assert.equal(skillSummary(skill("empty", "|\n")).description, "");
  assert.equal(skillSummary(skill("quoted", '"Literal | inside"')).description, "Literal | inside");
});

test("plugin inventory selects latest cached version and never claims enablement", () => {
  const cache = fs.mkdtempSync(path.join(os.tmpdir(), "skill-cache-test-"));
  for (const version of ["1.2.0", "1.10.0"]) write(path.join(cache, "market", "creative", version, "skills", "produce", "SKILL.md"), skill("produce", version));
  write(path.join(cache, "market", "other", "2.0.0", "skills", "produce", "SKILL.md"), skill("produce", "Other"));
  const { entries } = catalogSources({ includePluginCache: true }, { pluginCacheDir: cache });
  assert.equal(entries.length, 2);
  assert.equal(entries[0].sourceVersion, "1.10.0");
  assert.equal(new Set(entries.map((item) => item.name)).size, 2);
  assert.ok(entries.every((item) => item.sourceKind === "plugin-cache" && !Object.hasOwn(item, "enabled")));
});

test("builder registers content and AIP, excludes wrappers, and blocks stale descriptions", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "skill-catalog-test-"));
  const store = path.join(fixture, "store");
  const aip = path.join(fixture, "aip");
  const project = path.join(fixture, "agent-workflow", "skills");
  const config = { registrations: [{ name: "writing", owner: "Content" }], projectSources: [{ id: "AIP", label: "AIP", environment: "TEST_AIP_SKILLS", homeRelativePath: "unused", category: "Content" }] };
  write(path.join(project, "skill-catalog-sources.json"), JSON.stringify(config));
  write(path.join(project, "skill-store-version.json"), JSON.stringify({ version: "2.1.0" }));
  write(path.join(store, "writing", "SKILL.md"), skill("writing", "|\n  写作与来源核验"));
  write(path.join(aip, "title-writer", "SKILL.md"), skill("title-writer", "标题确认"));
  fs.mkdirSync(path.join(store, "wrapper"), { recursive: true });
  const env = { ...process.env, GUANLAN_SKILL_STORE: store, GUANLAN_CODEX_CONFIG: path.join(fixture, "no-config"), GUANLAN_USER_SKILLS: path.join(fixture, "no-user-skills"), TEST_AIP_SKILLS: aip };
  const result = spawnSync(process.execPath, [builder], { cwd: fixture, env, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr);
  const dashboardPath = path.join(fixture, "01-SiteV2", "site", "data", "local-skill-store-data.js");
  const payload = JSON.parse(fs.readFileSync(dashboardPath, "utf8").replace(/^window.WaveSightLocalSkillStore = /u, "").replace(/;\s*$/u, ""));
  assert.equal(payload.skills.length, 2);
  for (const row of payload.skills) {
    assert.equal(row.cleanupProtected, true);
    assert.equal(row.cleanup_candidate, false);
    assert.equal(row.current, false);
    assert.equal(row.usage_count, 0);
  }
  assert.equal(payload.skills.find((row) => row.name === "title-writer").storeExists, false);
  assert.ok(payload.skills.every((row) => /^[a-f0-9]{64}$/u.test(row.sourceDigest)));
  assert.ok(!JSON.stringify(payload).includes(fixture.replaceAll("\\", "\\\\")));
  write(path.join(store, "writing", "SKILL.md"), skill("writing", "最新月报规则"));
  const contract = evaluateSkillStoreDashboard({ dashboardPath, projectSkillDir: project, storeDir: store, versionPath: path.join(project, "skill-store-version.json") });
  assert.ok(contract.errors.some((error) => error.includes("source description is stale")));
  assert.ok(contract.errors.some((error) => error.includes("source rules are stale")));
  const prior = fs.readFileSync(dashboardPath, "utf8");
  const unavailable = spawnSync(process.execPath, [builder], { cwd: fixture, env: { ...env, TEST_AIP_SKILLS: path.join(fixture, "missing") }, encoding: "utf8" });
  assert.equal(unavailable.status, 1);
  assert.equal(fs.readFileSync(dashboardPath, "utf8"), prior);
});
