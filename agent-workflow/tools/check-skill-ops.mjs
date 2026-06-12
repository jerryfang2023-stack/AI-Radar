#!/usr/bin/env node
import { evaluateSkillOps } from "./lib/guanlan-skill-ops.mjs";

const args = new Set(process.argv.slice(2));
const jsonMode = args.has("--json");
const result = evaluateSkillOps();

if (jsonMode) {
  console.log(JSON.stringify({
    ...result,
    generated_at: new Date().toISOString(),
  }, null, 2));
} else {
  console.log(`Skill Ops status: ${result.status}`);
  console.log(`Skill Store version: ${result.summary.skillStoreVersion ? `v${result.summary.skillStoreVersion}` : "unversioned"}`);
  console.log(`Governed skills: ${result.summary.governed}`);
  console.log(`Current skills: ${result.summary.current}`);
  console.log(`Lane owners: ${result.summary.laneOwners}`);
  console.log(`Registry: ${result.summary.registryState}`);
  console.log(`Skill-store drift: ${result.summary.syncDrift}`);
  console.log(`Eval coverage: ${result.summary.evalCoverage}%`);
  console.log(`Example coverage: ${result.summary.exampleCoverage}%`);
  if (result.errors.length) {
    console.error("Errors:");
    for (const error of result.errors) console.error(`- ${error}`);
  }
}

if (!result.ok) process.exit(1);
