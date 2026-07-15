#!/usr/bin/env node
import { compareSkill, defaultPaths, readGovernedSkills } from "./lib/guanlan-skill-ops.mjs";

const args = new Set(process.argv.slice(2));
const skillArg = [...args].find((arg) => arg.startsWith("--skill="));
const selectedSkill = skillArg ? skillArg.slice("--skill=".length) : "";
const paths = defaultPaths();
let skills = readGovernedSkills(paths.projectSkillDir).filter((skill) => skill.guanlan.mirrored_in_skill_store !== false);
if (selectedSkill) skills = skills.filter((skill) => skill.name === selectedSkill);
if (!skills.length) {
  console.error(selectedSkill ? `No governed skill matched ${selectedSkill}` : "No governed skills found.");
  process.exit(1);
}
const rows = skills.map((skill) => compareSkill(skill.name, paths));
const drift = rows.filter((row) => row.state !== "synced");

for (const row of rows) {
  console.log(`${row.state.padEnd(12)} ${row.skillName}`);
}

if (drift.length) {
  console.error(`Skill store drift found: ${drift.map((row) => row.skillName).join(", ")}`);
  process.exit(1);
}

console.log(`All ${rows.length} governed skills are synced with .skill-store rule assets.`);
