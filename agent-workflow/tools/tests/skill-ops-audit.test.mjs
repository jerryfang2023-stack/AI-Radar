import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const dashboardGate = path.join(root, "agent-workflow", "tools", "assert-skill-store-dashboard.mjs");
const dashboardBuilder = path.join(root, "agent-workflow", "tools", "build-skill-store-dashboard.mjs");
const skillStoreDiff = path.join(root, "agent-workflow", "tools", "diff-skill-store.mjs");
const skillOpsCheck = path.join(root, "agent-workflow", "tools", "check-skill-ops.mjs");
const skillOpsServer = path.join(root, "agent-workflow", "tools", "skill-store-ops-server.mjs");
const dailySelfCheck = path.join(root, "agent-workflow", "tools", "run-daily-self-check.mjs");
const selfCheckPolicy = path.join(root, "agent-workflow", "tools", "lib", "daily-self-check-policy.mjs");
const skillStorePaths = path.join(root, "agent-workflow", "tools", "lib", "skill-store-paths.mjs");
const communityWorkflow = path.join(root, ".github", "workflows", "daily-community-intelligence-pr.yml");

test("Skill Ops separates read-only audit from explicit repair", () => {
  const audit = packageJson.scripts["audit:skills"] || "";
  const repair = packageJson.scripts["repair:skills"] || "";
  const check = packageJson.scripts["check:skill-ops"] || "";
  const build = packageJson.scripts["build:skill-store-dashboard"] || "";

  assert.doesNotMatch(audit, /sync:skill-store|build:skill-store-dashboard/u);
  assert.match(audit, /check-skill-ops\.mjs --verbose/u);
  assert.doesNotMatch(audit, /&&/u);

  assert.match(check, /check-skill-ops\.mjs/u);
  assert.match(build, /build-skill-store-dashboard\.mjs/u);

  assert.match(repair, /sync:skill-store/u);
  assert.match(repair, /build:skill-store-dashboard/u);
  assert.match(repair, /audit:skills/u);
});

test("the direct dashboard producer propagates semantic contract failures", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-builder-contract-"));
  const skillsDir = path.join(fixture, "agent-workflow", "skills");
  const store = path.join(fixture, "store");
  const dashboard = path.join(fixture, "01-SiteV2", "site", "data", "local-skill-store-data.js");
  fs.mkdirSync(skillsDir, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.mkdirSync(path.dirname(dashboard), { recursive: true });
  fs.writeFileSync(path.join(skillsDir, "skill-store-version.json"), "not-json", "utf8");
  fs.writeFileSync(dashboard, "previous-good", "utf8");

  const result = spawnSync(process.execPath, [dashboardBuilder], {
    encoding: "utf8",
    cwd: fixture,
    env: { ...process.env, GUANLAN_SKILL_STORE: store },
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /version source is unreadable/u);
  assert.equal(fs.readFileSync(dashboard, "utf8"), "previous-good");

  fs.writeFileSync(path.join(skillsDir, "skill-store-version.json"), JSON.stringify({ version: "1.0.0" }), "utf8");
  const valid = spawnSync(process.execPath, [dashboardBuilder], {
    encoding: "utf8",
    cwd: fixture,
    env: { ...process.env, GUANLAN_SKILL_STORE: store },
  });
  assert.equal(valid.status, 0);
  assert.match(fs.readFileSync(dashboard, "utf8"), /^window\.WaveSightLocalSkillStore = /u);
});

test("daily safe repair rebuilds for every Skill Ops contract problem", () => {
  const policy = spawnSync(process.execPath, [
    "--input-type=module",
    "--eval",
    `import { shouldRebuildSkillStore, shouldSyncSkillStore } from ${JSON.stringify(pathToFileURL(selfCheckPolicy).href)}; const drift = { lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "failed", syncDrift: 1, dashboardErrors: ["alpha syncState expected drift, got synced"] }, problems: [{ message: "skill sync drift" }] }] }; const mixed = { lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "failed", syncDrift: 1, dashboardErrors: ["alpha syncState expected drift, got synced", "summary.total expected 3, got 2"] }, problems: [] }] }; const results = [shouldRebuildSkillStore({ lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "failed", syncDrift: 0 }, problems: [{ message: "summary.total expected 3, got 2" }] }] }), shouldRebuildSkillStore(drift), shouldRebuildSkillStore({ lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "passed", syncDrift: 0 }, problems: [{ message: "missing evals" }] }] }), shouldSyncSkillStore(drift, true), shouldSyncSkillStore(drift, false), shouldRebuildSkillStore(mixed)]; console.log(JSON.stringify(results));`,
  ], { encoding: "utf8" });
  const source = fs.readFileSync(dailySelfCheck, "utf8");
  const safeRepair = source.slice(source.indexOf("function runSafeRepairs"), source.indexOf("function unresolvedRepairTasks"));

  assert.equal(policy.status, 0);
  assert.equal(policy.stdout.trim(), "[true,false,false,true,false,true]");
  assert.match(safeRepair, /shouldRebuildSkillStore\(report\)/u);
  assert.match(safeRepair, /shouldSyncSkillStore\(report, allowSkillStoreSync\)/u);
});

test("Community Intelligence publication serializes runs that can write the same daily branch", () => {
  const workflow = fs.readFileSync(communityWorkflow, "utf8");
  const concurrency = workflow.slice(workflow.indexOf("concurrency:"), workflow.indexOf("jobs:"));

  assert.match(concurrency, /group: wavesight-community-intelligence-publication/u);
  assert.doesNotMatch(concurrency, /github\.(?:run_id|ref_name|event\.inputs\.date)/u);
});

test("Skill Store deletion resolves a safe name against the private store root", () => {
  const store = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-delete-root-"));
  const homeAlias = path.join(store, "home-alias");
  let aliasCreated = false;
  try {
    fs.symlinkSync(os.homedir(), homeAlias, process.platform === "win32" ? "junction" : "dir");
    aliasCreated = true;
  } catch {
    aliasCreated = false;
  }
  fs.mkdirSync(path.join(store, "empty"));
  fs.mkdirSync(path.join(store, "alpha"));
  fs.writeFileSync(path.join(store, "alpha", "SKILL.md"), "---\nname: alpha\n---\n", "utf8");
  const rejectedCandidates = [os.homedir(), path.parse(store).root];
  if (process.platform === "win32") rejectedCandidates.push(os.homedir().toUpperCase());
  if (aliasCreated) rejectedCandidates.push(homeAlias);
  const result = spawnSync(process.execPath, [
    "--input-type=module",
    "--eval",
    `import { isSkillStoreEntry, resolveSkillStoreEntry, resolveSkillStoreRoot, resolveSkillStoreTrashRoot } from ${JSON.stringify(pathToFileURL(skillStorePaths).href)}; const home = ${JSON.stringify(os.homedir())}; const root = resolveSkillStoreRoot(${JSON.stringify(store)}, home); const rejected = []; for (const candidate of ${JSON.stringify(rejectedCandidates)}) { try { resolveSkillStoreRoot(candidate, home); } catch { rejected.push(candidate); } } console.log(JSON.stringify({ root, entry: resolveSkillStoreEntry(root, "alpha"), trash: resolveSkillStoreTrashRoot(root), emptyValid: isSkillStoreEntry(resolveSkillStoreEntry(root, "empty")), skillValid: isSkillStoreEntry(resolveSkillStoreEntry(root, "alpha")), rejected }));`,
  ], { encoding: "utf8" });
  const serverSource = fs.readFileSync(skillOpsServer, "utf8");
  const resolved = JSON.parse(result.stdout || "{}");

  assert.equal(result.status, 0);
  assert.equal(resolved.root, path.resolve(store));
  assert.equal(resolved.entry, path.join(store, "alpha"));
  assert.equal(resolved.trash, path.join(store, ".trash"));
  assert.equal(resolved.emptyValid, false);
  assert.equal(resolved.skillValid, true);
  assert.deepEqual(resolved.rejected.sort(), rejectedCandidates.sort());
  assert.match(serverSource, /resolveSkillStoreRoot\(process\.env\.GUANLAN_SKILL_STORE/u);
  assert.match(serverSource, /resolveSkillStoreTrashRoot\(skillStoreDir\)/u);
  assert.match(serverSource, /resolveSkillStoreEntry\(skillStoreDir, name\)/u);
  assert.match(serverSource, /isSkillStoreEntry\(target\)/u);
  assert.doesNotMatch(serverSource, /path\.resolve\(skill\.localPath/u);
});

test("dashboard contract rejects a summary that does not match its skills", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { version: { version: "1.0.0" }, summary: { total: 0 } },
    cleanupQueue: [],
    skills: [{ name: "alpha" }],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /summary\.total/u);
});

test("dashboard contract rejects a version that differs from the governed source", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-version-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { version: { version: "0.9.0" }, summary: { total: 0 } },
    cleanupQueue: [],
    skills: [],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /version/u);
});

test("dashboard contract requires every governed project skill", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-governed-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  const skill = `---
name: alpha
description: Test governed skill.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Test"
    status: "governance"
    order: 1
    responsibility: "Test the dashboard contract."
    upstream: "fixture"
    downstream: "fixture"
    gates: "fixture"
    mirrored_in_skill_store: true
    memory_required: false
---
`;
  fs.mkdirSync(path.join(projectSkills, "alpha", "evals"), { recursive: true });
  fs.mkdirSync(path.join(projectSkills, "alpha", "examples"), { recursive: true });
  fs.writeFileSync(path.join(projectSkills, "alpha", "SKILL.md"), skill, "utf8");
  fs.writeFileSync(path.join(projectSkills, "alpha", "evals", "one.md"), "pass", "utf8");
  fs.writeFileSync(path.join(projectSkills, "alpha", "examples", "one.md"), "pass", "utf8");
  fs.cpSync(path.join(projectSkills, "alpha"), path.join(store, "alpha"), { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { version: { version: "1.0.0" }, summary: { total: 0 } },
    cleanupQueue: [],
    skills: [],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /governed skill alpha/u);
});

test("dashboard contract rejects duplicate skill names", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-duplicate-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { version: { version: "1.0.0" }, summary: { total: 2 } },
    cleanupQueue: [],
    skills: [{ name: "alpha" }, { name: "alpha" }],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /duplicate skill alpha/u);
});

test("dashboard contract rejects public absolute local paths", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-path-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { storeDir: "C:\\Users\\alice\\.skill-store", version: { version: "1.0.0" }, summary: { total: 1 } },
    cleanupQueue: [],
    skills: [{ name: "alpha", localPath: "C:\\Users\\alice\\.skill-store\\alpha" }],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /absolute local path/u);
});

test("dashboard contract recursively rejects absolute personal paths in public fields", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-nested-path-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: {
      storeDir: ".skill-store",
      projectSkillDir: "agent-workflow/skills",
      diagnostics: { rootHome: "/root", posixHome: "/home/alice", wslHome: "/mnt/c/Users/alice" },
      version: { version: "1.0.0" },
      summary: { total: 0, guanlan: 0, current: 0, laneOwners: 0, needsAction: 0, syncIssues: 0, dormant: 0, retired: 0, cleanupQueue: 0, cleanupActions: {}, evalCoverage: 0, exampleCoverage: 0 },
    },
    cleanupQueue: [],
    skills: [],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /meta\.diagnostics\.rootHome.*absolute local path/u);
  assert.match(result.stderr, /meta\.diagnostics\.posixHome.*absolute local path/u);
  assert.match(result.stderr, /meta\.diagnostics\.wslHome.*absolute local path/u);
});

test("dashboard contract requires governed metadata and mirror state to match source", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-source-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  const skill = `---
name: alpha
description: Test governed skill.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Test"
    status: "governance"
    order: 1
    responsibility: "Test the dashboard contract."
    upstream: "fixture"
    downstream: "fixture"
    gates: "fixture"
    mirrored_in_skill_store: true
    memory_required: false
---
`;
  fs.mkdirSync(path.join(projectSkills, "alpha", "evals"), { recursive: true });
  fs.mkdirSync(path.join(projectSkills, "alpha", "examples"), { recursive: true });
  fs.writeFileSync(path.join(projectSkills, "alpha", "SKILL.md"), skill, "utf8");
  fs.writeFileSync(path.join(projectSkills, "alpha", "evals", "one.md"), "pass", "utf8");
  fs.writeFileSync(path.join(projectSkills, "alpha", "examples", "one.md"), "pass", "utf8");
  fs.cpSync(path.join(projectSkills, "alpha"), path.join(store, "alpha"), { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { storeDir: ".skill-store", version: { version: "1.0.0" }, summary: { total: 1 } },
    cleanupQueue: [],
    skills: [{
      name: "alpha",
      version: "0.9.0",
      responsibility: "Wrong responsibility",
      lane: "Wrong lane",
      status: "candidate",
      current: false,
      storeExists: true,
      projectExists: true,
      syncState: "drift",
      localPath: ".skill-store/alpha",
    }],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /alpha version/u);
  assert.match(result.stderr, /alpha responsibility/u);
  assert.match(result.stderr, /alpha syncState/u);
});

test("dashboard contract recomputes semantic summary counts", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-summary-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: {
      storeDir: ".skill-store",
      version: { version: "1.0.0" },
      summary: {
        total: 1,
        guanlan: 1,
        current: 0,
        laneOwners: 1,
        needsAction: 0,
        syncIssues: 0,
        dormant: 0,
        retired: 0,
        cleanupQueue: 0,
        cleanupActions: { keep: 1 },
        evalCoverage: 100,
        exampleCoverage: 100,
      },
    },
    cleanupQueue: [],
    skills: [{
      name: "alpha",
      isGuanlan: true,
      current: true,
      status: "lane owner",
      issues: [],
      syncState: "synced",
      lifecycle: "current",
      cleanup_candidate: false,
      cleanup_action: "keep",
      hasEvals: true,
      hasExamples: true,
      localPath: ".skill-store/alpha",
    }],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [
    dashboardGate,
    `--dashboard=${dashboard}`,
    `--project-skill-dir=${projectSkills}`,
    `--store-dir=${store}`,
    `--version-file=${versionFile}`,
  ], { encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /summary\.current/u);
});

test("Skill Store diff honors the selected skill argument", () => {
  const store = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-diff-"));
  const result = spawnSync(process.execPath, [skillStoreDiff, "--skill=missing-skill"], {
    encoding: "utf8",
    env: { ...process.env, GUANLAN_SKILL_STORE: store },
    cwd: root,
  });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /No governed skill matched missing-skill/u);
});

test("the daily Skill Ops check includes the dashboard contract", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-check-dashboard-"));
  const dashboard = path.join(fixture, "dashboard.js");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: { storeDir: ".skill-store", version: { version: "1.4.0" }, summary: { total: 0 } },
    cleanupQueue: [],
    skills: [{ name: "alpha" }],
  })};\n`, "utf8");

  const result = spawnSync(process.execPath, [skillOpsCheck, "--json", `--dashboard=${dashboard}`], {
    encoding: "utf8",
    cwd: root,
  });

  assert.equal(result.status, 1);
  assert.match(result.stdout, /summary\.total/u);
});
