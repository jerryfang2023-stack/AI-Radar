#!/usr/bin/env node
import { evaluateSkillOps } from "./lib/guanlan-skill-ops.mjs";
import { dashboardContractPaths, evaluateSkillStoreDashboard } from "./assert-skill-store-dashboard.mjs";
import { auditSkillDiscovery } from "./lib/skill-discovery-audit.mjs";

const args = new Set(process.argv.slice(2));
const jsonMode = args.has("--json");
const verboseMode = args.has("--verbose");
const requireCompatibilityStore = args.has("--require-skill-store")
  || process.env.GUANLAN_REQUIRE_SKILL_STORE === "1";
const skillResult = evaluateSkillOps(undefined, { requireCompatibilityStore });
const dashboardResult = evaluateSkillStoreDashboard(
  dashboardContractPaths(process.argv.slice(2)),
  { requireCompatibilityMirror: requireCompatibilityStore },
);
const discoveryResult = auditSkillDiscovery();
const discoveryErrors = [];
if (!discoveryResult.ok) {
  for (const item of discoveryResult.invalid) discoveryErrors.push(`invalid Skill manifest: ${item.name}`);
  for (const item of discoveryResult.duplicates) discoveryErrors.push(`enabled duplicate Skill name: ${item.name}`);
}
const discoveryDashboardCurrent = !discoveryResult.available
  || JSON.stringify(dashboardResult.summary.discovery) === JSON.stringify(discoveryResult.summary);
if (!discoveryDashboardCurrent) {
  discoveryErrors.push("Skill discovery summary is stale; run npm run build:skill-store-dashboard");
}
const discoveryState = !discoveryResult.ok ? "failed" : discoveryDashboardCurrent ? "passed" : "stale";
const result = {
  ...skillResult,
  ok: skillResult.ok && dashboardResult.ok && discoveryErrors.length === 0,
  status: skillResult.ok && dashboardResult.ok && discoveryErrors.length === 0 ? "passed" : "failed",
  errors: [...skillResult.errors, ...dashboardResult.errors, ...discoveryErrors],
  summary: {
    ...skillResult.summary,
    dashboardState: dashboardResult.status,
    dashboardSkills: dashboardResult.summary.skills,
    discoveryState,
    discoveryAvailable: discoveryResult.available,
    discoveredSkills: discoveryResult.summary.discovered,
    enabledSkills: discoveryResult.summary.enabled,
    disabledSkills: discoveryResult.summary.configuredDisabled,
    invalidSkillManifests: discoveryResult.summary.invalidManifests,
    enabledDuplicateSkillNames: discoveryResult.summary.enabledDuplicateNames,
  },
  dashboard: dashboardResult,
  discovery: {
    ...discoveryResult,
    dashboardCurrent: discoveryDashboardCurrent,
    errors: discoveryErrors,
  },
};

if (jsonMode) {
  console.log(JSON.stringify({
    ...result,
    generated_at: new Date().toISOString(),
  }, null, 2));
} else {
  if (verboseMode) {
    console.log("Repo Skill runtime states:");
    for (const row of result.sync) console.log(`- ${row.skill}: ${row.state}`);
    console.log("Compatibility .skill-store mirror states:");
    for (const row of result.compatibilitySync) console.log(`- ${row.skill}: ${row.state}`);
  }
  console.log(`Skill Ops status: ${result.status}`);
  console.log(`Skill Store version: ${result.summary.skillStoreVersion ? `v${result.summary.skillStoreVersion}` : "unversioned"}`);
  console.log(`Governed skills: ${result.summary.governed}`);
  console.log(`Current skills: ${result.summary.current}`);
  console.log(`Lane owners: ${result.summary.laneOwners}`);
  console.log(`Registry: ${result.summary.registryState}`);
  console.log(`Repo runtime drift: ${result.summary.syncDrift}`);
  console.log(`Compatibility mirror drift: ${result.summary.compatibilitySyncDrift} (${requireCompatibilityStore ? "required" : "informational"})`);
  console.log(`Eval coverage: ${result.summary.evalCoverage}%`);
  console.log(`Example coverage: ${result.summary.exampleCoverage}%`);
  console.log(`Prompt contract: ${result.summary.promptContract}`);
  console.log(`Prompt contract coverage: ${result.summary.promptContractCoverage}%`);
  console.log(`OpenAI metadata coverage: ${result.summary.openAiMetadataCoverage}%`);
  console.log(`Implicit discovery coverage: ${result.summary.implicitDiscoveryCoverage}%`);
  console.log(`Trigger eval inventory coverage: ${result.summary.promptEvalInventoryCoverage}%`);
  console.log(`Dashboard contract: ${result.summary.dashboardState}`);
  console.log(`Dashboard skills: ${result.summary.dashboardSkills}`);
  console.log(`Local Skill discovery: ${result.summary.discoveryState} (${result.summary.discoveredSkills} discovered, ${result.summary.enabledSkills} enabled, ${result.summary.disabledSkills} disabled)`);
  if (result.errors.length) {
    console.error("Errors:");
    for (const error of result.errors) console.error(`- ${error}`);
  }
}

if (!result.ok) process.exit(1);
