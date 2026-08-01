import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  evaluateSkillOps,
  evaluateSkillPromptContract,
  evaluateSkillPromptEvalInventory,
  evaluateSkillSemantics,
  readGovernedSkills,
  renderRegistryMarkdown,
} from "../lib/guanlan-skill-ops.mjs";
import { auditSkillDiscovery } from "../lib/skill-discovery-audit.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..", "..", "..");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const dashboardGate = path.join(root, "agent-workflow", "tools", "assert-skill-store-dashboard.mjs");
const dashboardBuilder = path.join(root, "agent-workflow", "tools", "build-skill-store-dashboard.mjs");
const skillStoreDiff = path.join(root, "agent-workflow", "tools", "diff-skill-store.mjs");
const skillOpsCheck = path.join(root, "agent-workflow", "tools", "check-skill-ops.mjs");
const skillOpsServer = path.join(root, "agent-workflow", "tools", "skill-store-ops-server.mjs");
const dailySelfCheck = path.join(root, "agent-workflow", "tools", "run-daily-self-check.mjs");
const dailySupervision = path.join(root, "agent-workflow", "tools", "write-daily-supervision-report.mjs");
const selfCheckPolicy = path.join(root, "agent-workflow", "tools", "lib", "daily-self-check-policy.mjs");
const skillStorePaths = path.join(root, "agent-workflow", "tools", "lib", "skill-store-paths.mjs");
const communityWorkflow = path.join(root, ".github", "workflows", "daily-community-intelligence-pr.yml");
const pagesWorkflow = path.join(root, ".github", "workflows", "github-pages.yml");

test("semantic gate rejects stale contracts and generic scheduler onboarding", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-semantics-"));
  const skillPath = path.join(fixture, "SKILL.md");
  fs.writeFileSync(skillPath, "# Follow Builders\nUse RAW-V3 with OpenClaw cron and Telegram.\n", "utf8");
  const errors = evaluateSkillSemantics({ name: "follow-builders", dir: fixture, skillPath });
  assert.ok(errors.length >= 2);
  assert.match(errors.join("\n"), /RAW-V3/u);
  assert.match(errors.join("\n"), /generic agent onboarding/u);
});

test("governed Skill text contracts declare current lane ownership and routing boundaries", () => {
  const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
  const followBuilders = read("agent-workflow/skills/follow-builders/SKILL.md");
  const funding = read("agent-workflow/skills/guanlan-funding-insight-generator/SKILL.md");
  const supervisor = read("agent-workflow/skills/guanlan-data-center-supervisor/SKILL.md");
  const firstLine = read("agent-workflow/skills/guanlan-first-line-viewpoints-monitor/SKILL.md");
  const auditor = read("agent-workflow/skills/guanlan-code-rule-auditor/SKILL.md");
  const editor = read("agent-workflow/skills/guanlan-skill-editor/SKILL.md");

  assert.match(followBuilders, /07-points\/<YYYY-MM-DD>-builders-viewpoints\.md/u);
  assert.match(followBuilders, /morning RSS route exclusively owns `01-SiteV2\/site\/data\/follow-builders-daily\.json`/u);
  assert.match(funding, /investor_disclosure_status=not_disclosed[\s\S]*investors_missing/u);
  assert.doesNotMatch(supervisor, /legacy page output isolated as compatibility data/iu);
  assert.match(supervisor, /do not restore, retain, or emit legacy page JSON/u);
  assert.match(firstLine, /agent-workflow\/tools\/build-guanlan-vault\.mjs/u);
  assert.doesNotMatch(firstLine, /sync-follow-builders-to-opinion-timelines\.mjs/u);
  assert.equal(fs.existsSync(path.join(root, "agent-workflow/tools/build-guanlan-vault.mjs")), true);
  assert.match(auditor, /read-only defect audit/u);
  assert.match(editor, /Do not use for an audit-only request/u);
});

test("afternoon First-Line gate passes independently of missing morning data", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-afternoon-gate-"));
  const dataDir = path.join(fixture, "01-SiteV2", "site", "data");
  fs.mkdirSync(dataDir, { recursive: true });
  fs.writeFileSync(path.join(dataDir, "first-line-viewpoints-v4.json"), `${JSON.stringify({
    meta: {
      lanes: {
        afternoon: { id: "afternoon-skill", dataFile: "07-points/fixture.md", declaredCount: 1 },
      },
    },
    stats: { afternoonIntake: 1, dualCovered: 0, intakeOnly: 1 },
    remarks: [],
    morningIntake: [],
    builders: [],
    intake: [{ url: "https://example.com/builder", laneCoverage: ["afternoon-skill"], coveredByMorning: false }],
  }, null, 2)}\n`, "utf8");

  const gate = path.join(root, "agent-workflow/tools/assert-first-line-viewpoints-v4-data.mjs");
  const afternoonOnly = spawnSync(process.execPath, [gate, "--require-morning=false", "--require-afternoon=true"], {
    cwd: fixture,
    encoding: "utf8",
  });
  const combined = spawnSync(process.execPath, [gate, "--require-afternoon=true"], {
    cwd: fixture,
    encoding: "utf8",
  });

  assert.equal(afternoonOnly.status, 0, afternoonOnly.stdout || afternoonOnly.stderr);
  assert.equal(combined.status, 1);
  assert.match(combined.stdout, /morning-rss lane metadata is missing|morning intake is empty/u);
  assert.match(
    fs.readFileSync(path.join(root, "agent-workflow/tools/publish-follow-builders-skill-local.mjs"), "utf8"),
    /assert-first-line-viewpoints-v4-data\.mjs", "--require-morning=false", "--require-afternoon=true"/u,
  );
});

test("GPT-5.6 prompt contract requires trigger, boundary, workflow, output, and completion", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-prompt-contract-"));
  const skillPath = path.join(fixture, "SKILL.md");
  fs.writeFileSync(skillPath, `---
name: alpha
description: Run alpha work.
---

# Alpha

## Workflow

Run it.
`, "utf8");
  const errors = evaluateSkillPromptContract({ name: "alpha", dir: fixture, skillPath });
  assert.match(errors.join("\n"), /front-load the trigger/u);
  assert.match(errors.join("\n"), /Do not use/u);
  assert.match(errors.join("\n"), /missing inputs/u);
  assert.match(errors.join("\n"), /missing boundaries/u);
  assert.match(errors.join("\n"), /missing output/u);
  assert.match(errors.join("\n"), /missing completion/u);
});

test("GPT-5.6 trigger eval inventory covers direct, indirect, incomplete, negative, and edge cases", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-trigger-evals-"));
  const file = path.join(fixture, "skill-trigger-evals.json");
  fs.writeFileSync(file, JSON.stringify({
    schema_version: 1,
    prompt_contract: "GPT-5.6-SKILL-V1.0",
    case_expectations: {
      direct: "trigger",
      indirect: "trigger",
      incomplete: "trigger_and_resolve_or_ask",
      negative: "do_not_trigger",
      edge: "trigger_and_enforce_boundary",
    },
    skills: [{ skill: "alpha", direct: "d", indirect: "i", incomplete: "q", negative: "n" }],
  }), "utf8");
  const result = evaluateSkillPromptEvalInventory([{ name: "alpha", guanlan: { status: "governance" } }], file);
  assert.equal(result.covered, 0);
  assert.match(result.errors.join("\n"), /alpha missing edge/u);
});

test("GitHub Pages materializes repo runtime Skills before validating governance", () => {
  const workflow = fs.readFileSync(pagesWorkflow, "utf8");
  const syncIndex = workflow.indexOf("node agent-workflow/tools/sync-repo-skills.mjs");
  const validateIndex = workflow.indexOf("node agent-workflow/tools/validate-guanlan-skills.mjs");
  assert.ok(syncIndex >= 0, "GitHub Pages must materialize ignored repo runtime Skills");
  assert.ok(validateIndex > syncIndex, "Skill validation must run after repo runtime materialization");
});

test("Skill discovery audit honors disabled paths and rejects enabled duplicates or invalid manifests", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-discovery-"));
  const store = path.join(fixture, ".skill-store");
  const userSkills = path.join(fixture, ".agents", "skills");
  const repoSkills = path.join(fixture, "repo", ".agents", "skills");
  const configPath = path.join(fixture, ".codex", "config.toml");
  const skill = (name) => `---\nname: ${name}\ndescription: Fixture Skill.\n---\n`;
  fs.mkdirSync(path.join(store, "alpha"), { recursive: true });
  fs.mkdirSync(path.join(userSkills, "alpha"), { recursive: true });
  fs.mkdirSync(path.dirname(configPath), { recursive: true });
  fs.writeFileSync(path.join(store, "alpha", "SKILL.md"), skill("alpha"), "utf8");
  fs.writeFileSync(path.join(userSkills, "alpha", "SKILL.md"), skill("alpha"), "utf8");
  fs.writeFileSync(configPath, `[[skills.config]]\npath = '${path.join(store, "alpha", "SKILL.md")}'\nenabled = false\n`, "utf8");
  const paths = {
    root: path.join(fixture, "repo"),
    configPath,
    skillStoreDir: store,
    discoveryRoots: [store, userSkills, repoSkills],
  };

  const deduplicated = auditSkillDiscovery(paths);
  assert.equal(deduplicated.ok, true);
  assert.deepEqual(deduplicated.summary, {
    discovered: 2,
    configuredDisabled: 1,
    enabled: 1,
    invalidManifests: 0,
    enabledDuplicateNames: 0,
  });

  fs.writeFileSync(configPath, "", "utf8");
  const duplicated = auditSkillDiscovery(paths);
  assert.equal(duplicated.ok, false);
  assert.equal(duplicated.summary.enabledDuplicateNames, 1);

  fs.mkdirSync(path.join(store, "broken"), { recursive: true });
  fs.writeFileSync(path.join(store, "broken", "SKILL.md"), "# no frontmatter\n", "utf8");
  const invalid = auditSkillDiscovery(paths);
  assert.equal(invalid.ok, false);
  assert.equal(invalid.summary.invalidManifests, 1);
});

test("default Skill Ops gate requires repo runtime but not the private compatibility store", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-repo-skill-runtime-"));
  const projectSkillDir = path.join(fixture, "agent-workflow", "skills");
  const repoRuntimeSkillDir = path.join(fixture, ".agents", "skills");
  const storeDir = path.join(fixture, "empty-private-store");
  const registryPath = path.join(projectSkillDir, "skill-registry.md");
  const versionPath = path.join(projectSkillDir, "skill-store-version.json");
  const promptEvalPath = path.join(projectSkillDir, "skill-trigger-evals.json");
  const skillDir = path.join(projectSkillDir, "alpha");
  const skill = `---
name: alpha
description: Use when testing repository runtime authority. Do not use for production work.
metadata:
  guanlan:
    version: "1.0.0"
    lane: "Test"
    status: "governance"
    order: 1
    responsibility: "Validate repo runtime authority."
    upstream: "fixture"
    downstream: "fixture"
    gates: "fixture"
    mirrored_in_skill_store: true
    memory_required: false
---

# Alpha

## Inputs

Use the fixture.

## Workflow

Validate the fixture.

## Boundaries

Stop if the fixture is absent. Do not touch or publish production without authorization.

## Output

Return the fixture result.

## Done When

Finish when the fixture passes.
`;
  fs.mkdirSync(path.join(skillDir, "evals"), { recursive: true });
  fs.mkdirSync(path.join(skillDir, "examples"), { recursive: true });
  fs.mkdirSync(path.join(skillDir, "agents"), { recursive: true });
  fs.mkdirSync(storeDir, { recursive: true });
  fs.writeFileSync(path.join(skillDir, "SKILL.md"), skill, "utf8");
  fs.writeFileSync(path.join(skillDir, "evals", "one.md"), "pass", "utf8");
  fs.writeFileSync(path.join(skillDir, "examples", "one.md"), "pass", "utf8");
  fs.writeFileSync(path.join(skillDir, "agents", "openai.yaml"), `interface:
  display_name: "Alpha"
  short_description: "Test repository runtime authority"
  default_prompt: "Use $alpha to validate the repository runtime fixture."
policy:
  allow_implicit_invocation: true
`, "utf8");
  fs.writeFileSync(versionPath, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(promptEvalPath, JSON.stringify({
    schema_version: 1,
    prompt_contract: "GPT-5.6-SKILL-V1.0",
    case_expectations: {
      direct: "trigger",
      indirect: "trigger",
      incomplete: "trigger_and_resolve_or_ask",
      negative: "do_not_trigger",
      edge: "trigger_and_enforce_boundary",
    },
    skills: [{ skill: "alpha", direct: "d", indirect: "i", incomplete: "q", negative: "n", edge: "e" }],
  }), "utf8");
  fs.cpSync(skillDir, path.join(repoRuntimeSkillDir, "alpha"), { recursive: true });
  fs.writeFileSync(registryPath, renderRegistryMarkdown(readGovernedSkills(projectSkillDir)), "utf8");

  const paths = {
    root: fixture,
    projectSkillDir,
    repoRuntimeSkillDir,
    storeDir,
    registryPath,
    versionPath,
    promptEvalPath,
  };
  const defaultResult = evaluateSkillOps(paths);
  const strictCompatibilityResult = evaluateSkillOps(paths, { requireCompatibilityStore: true });

  assert.equal(defaultResult.ok, true);
  assert.equal(defaultResult.summary.syncDrift, 0);
  assert.equal(defaultResult.summary.compatibilitySyncDrift, 1);
  assert.equal(strictCompatibilityResult.ok, false);
  assert.match(strictCompatibilityResult.errors.join("\n"), /compatibility \.skill-store sync state is project-only/u);

  for (const root of [skillDir, path.join(repoRuntimeSkillDir, "alpha")]) {
    const openAiYaml = path.join(root, "agents", "openai.yaml");
    fs.writeFileSync(openAiYaml, fs.readFileSync(openAiYaml, "utf8")
      .replace('short_description: "Test repository runtime authority"', 'short_description: "Test $alpha repository runtime authority"')
      .replace('default_prompt: "Use $alpha to validate the repository runtime fixture."', 'default_prompt: "Validate the repository runtime fixture."'), "utf8");
  }
  const defaultPromptResult = evaluateSkillOps(paths);
  assert.equal(defaultPromptResult.ok, false);
  assert.match(defaultPromptResult.errors.join("\n"), /interface\.default_prompt must mention \$alpha/u);
  for (const root of [skillDir, path.join(repoRuntimeSkillDir, "alpha")]) {
    const openAiYaml = path.join(root, "agents", "openai.yaml");
    fs.writeFileSync(openAiYaml, fs.readFileSync(openAiYaml, "utf8")
      .replace('short_description: "Test $alpha repository runtime authority"', 'short_description: "Test repository runtime authority"')
      .replace('default_prompt: "Validate the repository runtime fixture."', 'default_prompt: "Use $alpha to validate the repository runtime fixture."'), "utf8");
  }

  for (const root of [skillDir, path.join(repoRuntimeSkillDir, "alpha")]) {
    const openAiYaml = path.join(root, "agents", "openai.yaml");
    fs.writeFileSync(openAiYaml, fs.readFileSync(openAiYaml, "utf8").replace(
      "allow_implicit_invocation: true",
      "allow_implicit_invocation: false",
    ), "utf8");
  }
  const implicitDiscoveryResult = evaluateSkillOps(paths);
  assert.equal(implicitDiscoveryResult.ok, false);
  assert.match(implicitDiscoveryResult.errors.join("\n"), /must allow implicit discovery/u);

  fs.rmSync(path.join(repoRuntimeSkillDir, "alpha"), { recursive: true, force: true });
  const missingRuntimeResult = evaluateSkillOps(paths);
  assert.equal(missingRuntimeResult.ok, false);
  assert.match(missingRuntimeResult.errors.join("\n"), /repo Skill runtime sync state is project-only/u);
});

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
    `import { shouldRebuildSkillStore, shouldSyncSkillStore } from ${JSON.stringify(pathToFileURL(selfCheckPolicy).href)}; const drift = { lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "failed", syncDrift: 1, dashboardErrors: ["alpha syncState expected drift, got synced"] }, problems: [{ message: "skill sync drift" }] }] }; const mixed = { lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "failed", syncDrift: 1, dashboardErrors: ["alpha syncState expected drift, got synced", "summary.total expected 3, got 2"] }, problems: [] }] }; const results = [shouldRebuildSkillStore({ lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "failed", syncDrift: 0 }, problems: [{ message: "summary.total expected 3, got 2" }] }] }), shouldRebuildSkillStore(drift), shouldRebuildSkillStore({ lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "passed", syncDrift: 0 }, problems: [{ message: "missing evals" }] }] }), shouldSyncSkillStore(drift, true), shouldSyncSkillStore(drift, false), shouldRebuildSkillStore(mixed), shouldRebuildSkillStore({ lanes: [{ id: "skill_ops", evidence: { registryState: "current", dashboardState: "passed", discoveryState: "stale", syncDrift: 0 }, problems: [{ message: "Skill discovery summary is stale" }] }] })]; console.log(JSON.stringify(results));`,
  ], { encoding: "utf8" });
  const source = fs.readFileSync(dailySelfCheck, "utf8");
  const safeRepair = source.slice(source.indexOf("function runSafeRepairs"), source.indexOf("function unresolvedRepairTasks"));

  assert.equal(policy.status, 0);
  assert.equal(policy.stdout.trim(), "[true,false,false,true,false,true,true]");
  assert.match(safeRepair, /shouldRebuildSkillStore\(report\)/u);
  assert.match(safeRepair, /shouldSyncSkillStore\(report, allowSkillStoreSync\)/u);
});

test("daily supervision exposes effective Skill discovery evidence through the existing Skill Ops lane", () => {
  const source = fs.readFileSync(dailySupervision, "utf8");
  const lane = source.slice(source.indexOf("function buildSkillOpsLane"), source.indexOf("function aggregateStatus"));

  assert.match(lane, /check-skill-ops\.mjs/u);
  assert.match(lane, /discoveredSkills/u);
  assert.match(lane, /enabledSkills/u);
  assert.match(lane, /disabledSkills/u);
  assert.match(lane, /invalidSkillManifests/u);
  assert.match(lane, /enabledDuplicateSkillNames/u);
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

test("dashboard contract rejects an inconsistent effective discovery summary", () => {
  const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-skill-dashboard-discovery-"));
  const dashboard = path.join(fixture, "dashboard.js");
  const projectSkills = path.join(fixture, "project-skills");
  const store = path.join(fixture, "store");
  const versionFile = path.join(fixture, "version.json");
  fs.mkdirSync(projectSkills, { recursive: true });
  fs.mkdirSync(store, { recursive: true });
  fs.writeFileSync(versionFile, JSON.stringify({ version: "1.0.0" }), "utf8");
  fs.writeFileSync(dashboard, `window.WaveSightLocalSkillStore = ${JSON.stringify({
    meta: {
      version: { version: "1.0.0" },
      summary: {
        total: 0,
        guanlan: 0,
        current: 0,
        laneOwners: 0,
        needsAction: 0,
        syncIssues: 0,
        dormant: 0,
        retired: 0,
        cleanupQueue: 0,
        cleanupActions: {},
        evalCoverage: 0,
        exampleCoverage: 0,
        discovery: {
          discovered: 10,
          configuredDisabled: 4,
          enabled: 5,
          invalidManifests: 0,
          enabledDuplicateNames: 0,
        },
      },
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
  assert.match(result.stderr, /discovered count must equal enabled plus configuredDisabled/u);
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
