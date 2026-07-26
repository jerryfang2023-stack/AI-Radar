#!/usr/bin/env node
import path from "node:path";
import {
  compareSkill,
  defaultPaths,
  readGovernedSkills,
  syncRuleAssets,
} from "./lib/guanlan-skill-ops.mjs";

const args = new Set(process.argv.slice(2));
const checkOnly = args.has("--check");
const skillArg = [...args].find((arg) => arg.startsWith("--skill="));
const selectedSkill = skillArg ? skillArg.slice("--skill=".length) : "";

const basePaths = defaultPaths();
const runtimeDir = path.join(basePaths.root, ".agents", "skills");
const runtimePaths = { ...basePaths, storeDir: runtimeDir };
let skills = readGovernedSkills(basePaths.projectSkillDir);

if (selectedSkill) skills = skills.filter((skill) => skill.name === selectedSkill);
if (!skills.length) {
  console.error(selectedSkill ? `No governed skill matched ${selectedSkill}` : "No governed skills found.");
  process.exit(1);
}

if (!checkOnly) {
  for (const skill of skills) {
    const actions = syncRuleAssets(skill.name, {
      projectSkillDir: basePaths.projectSkillDir,
      storeDir: runtimeDir,
    });
    console.log(`synced ${skill.name}: ${actions.length} rule actions`);
  }
}

const rows = skills.map((skill) => compareSkill(skill.name, runtimePaths));
const drift = rows.filter((row) => row.state !== "synced");

if (checkOnly) {
  for (const row of rows) console.log(`${row.state.padEnd(12)} ${row.skillName}`);
}

if (drift.length) {
  console.error(`Repo Skill runtime drift found: ${drift.map((row) => row.skillName).join(", ")}`);
  process.exit(1);
}

console.log(`All ${rows.length} governed skills are synced with .agents/skills rule assets.`);
