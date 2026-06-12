#!/usr/bin/env node
import fs from "node:fs";
import {
  compareSkill,
  defaultPaths,
  exists,
  isCurrentLike,
  readGovernedSkills,
  renderRegistryMarkdown,
} from "./lib/guanlan-skill-ops.mjs";

const paths = defaultPaths();
const skills = readGovernedSkills(paths.projectSkillDir);
const errors = [];

if (!skills.length) errors.push("No governed Guanlan skills found.");

for (const skill of skills) {
  const meta = skill.guanlan;
  const prefix = skill.name;
  if (!skill.hasSkillMd) errors.push(`${prefix}: SKILL.md missing`);
  if (skill.frontmatter.name !== skill.name) errors.push(`${prefix}: frontmatter name must match folder name`);
  if (!skill.frontmatter.description) errors.push(`${prefix}: description missing`);
  if (!/^\d+\.\d+\.\d+$/.test(String(meta.version || ""))) errors.push(`${prefix}: metadata.guanlan.version must be semver`);
  for (const field of ["lane", "status", "responsibility", "upstream", "downstream", "gates"]) {
    if (!meta[field]) errors.push(`${prefix}: metadata.guanlan.${field} missing`);
  }
  if (isCurrentLike(meta.status)) {
    if (!skill.evalFiles.length) errors.push(`${prefix}: current skill needs evals/`);
    if (!skill.exampleFiles.length) errors.push(`${prefix}: current skill needs examples/`);
    if (meta.memory_required === true && !skill.hasMemory) errors.push(`${prefix}: memory_required=true but MEMORY.md missing`);
  }
  if (meta.mirrored_in_skill_store !== false) {
    const compare = compareSkill(skill.name, paths);
    if (compare.state !== "synced") errors.push(`${prefix}: .skill-store sync state is ${compare.state}`);
  }
}

if (exists(paths.registryPath)) {
  const current = fs.readFileSync(paths.registryPath, "utf8").replace(/\r\n/g, "\n");
  const expected = renderRegistryMarkdown(skills).replace(/\r\n/g, "\n");
  if (current !== expected) errors.push("skill-registry.md is stale; run npm run build:skill-registry");
} else {
  errors.push("skill-registry.md missing; run npm run build:skill-registry");
}

if (errors.length) {
  for (const error of errors) console.error(`ERROR ${error}`);
  process.exit(1);
}

console.log(`Validated ${skills.length} governed Guanlan skills.`);
