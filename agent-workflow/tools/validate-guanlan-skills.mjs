#!/usr/bin/env node
import { evaluateSkillOps } from "./lib/guanlan-skill-ops.mjs";

const result = evaluateSkillOps();

if (!result.ok) {
  for (const error of result.errors) console.error(`ERROR ${error}`);
  process.exit(1);
}

console.log(`Validated ${result.summary.governed} governed Guanlan skills.`);
