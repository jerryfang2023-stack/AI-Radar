#!/usr/bin/env node
import { evaluateSkillOps } from "./lib/guanlan-skill-ops.mjs";
import { dashboardContractPaths, evaluateSkillStoreDashboard } from "./assert-skill-store-dashboard.mjs";

const args = new Set(process.argv.slice(2));
const jsonMode = args.has("--json");
const verboseMode = args.has("--verbose");
const skillResult = evaluateSkillOps();
const dashboardResult = evaluateSkillStoreDashboard(dashboardContractPaths(process.argv.slice(2)));
const result = {
  ...skillResult,
  ok: skillResult.ok && dashboardResult.ok,
  status: skillResult.ok && dashboardResult.ok ? "passed" : "failed",
  errors: [...skillResult.errors, ...dashboardResult.errors],
  summary: {
    ...skillResult.summary,
    dashboardState: dashboardResult.status,
    dashboardSkills: dashboardResult.summary.skills,
  },
  dashboard: dashboardResult,
};

if (jsonMode) {
  console.log(JSON.stringify({
    ...result,
    generated_at: new Date().toISOString(),
  }, null, 2));
} else {
  if (verboseMode) {
    console.log("Skill Store mirror states:");
    for (const row of result.sync) console.log(`- ${row.skill}: ${row.state}`);
  }
  console.log(`Skill Ops status: ${result.status}`);
  console.log(`Skill Store version: ${result.summary.skillStoreVersion ? `v${result.summary.skillStoreVersion}` : "unversioned"}`);
  console.log(`Governed skills: ${result.summary.governed}`);
  console.log(`Current skills: ${result.summary.current}`);
  console.log(`Lane owners: ${result.summary.laneOwners}`);
  console.log(`Registry: ${result.summary.registryState}`);
  console.log(`Skill-store drift: ${result.summary.syncDrift}`);
  console.log(`Eval coverage: ${result.summary.evalCoverage}%`);
  console.log(`Example coverage: ${result.summary.exampleCoverage}%`);
  console.log(`Dashboard contract: ${result.summary.dashboardState}`);
  console.log(`Dashboard skills: ${result.summary.dashboardSkills}`);
  if (result.errors.length) {
    console.error("Errors:");
    for (const error of result.errors) console.error(`- ${error}`);
  }
}

if (!result.ok) process.exit(1);
