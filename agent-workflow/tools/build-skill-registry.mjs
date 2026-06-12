#!/usr/bin/env node
import { defaultPaths, readGovernedSkills, renderRegistryMarkdown, writeText } from "./lib/guanlan-skill-ops.mjs";

const paths = defaultPaths();
const skills = readGovernedSkills(paths.projectSkillDir);
if (!skills.length) {
  console.error("No governed Guanlan skills found. Add metadata.guanlan to SKILL.md first.");
  process.exit(1);
}

const markdown = renderRegistryMarkdown(skills);
writeText(paths.registryPath, markdown);
console.log(`Wrote ${paths.registryPath} (${skills.length} governed skills)`);
