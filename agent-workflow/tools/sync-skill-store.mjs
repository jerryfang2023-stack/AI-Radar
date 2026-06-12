#!/usr/bin/env node
import { defaultPaths, readGovernedSkills, syncRuleAssets } from "./lib/guanlan-skill-ops.mjs";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const skillArg = [...args].find((arg) => arg.startsWith("--skill="));
const selectedSkill = skillArg ? skillArg.slice("--skill=".length) : "";

const paths = defaultPaths();
let skills = readGovernedSkills(paths.projectSkillDir).filter((skill) => skill.guanlan.mirrored_in_skill_store !== false);
if (selectedSkill) skills = skills.filter((skill) => skill.name === selectedSkill);
if (!skills.length) {
  console.error(selectedSkill ? `No governed skill matched ${selectedSkill}` : "No governed skills found.");
  process.exit(1);
}

for (const skill of skills) {
  const actions = syncRuleAssets(skill.name, { ...paths, dryRun });
  console.log(`${dryRun ? "would sync" : "synced"} ${skill.name}: ${actions.length} rule actions`);
}
