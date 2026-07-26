#!/usr/bin/env node
import { auditSkillDiscovery } from "./lib/skill-discovery-audit.mjs";

const result = auditSkillDiscovery();
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
