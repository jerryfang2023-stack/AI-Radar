#!/usr/bin/env node

import { syncGuanlanEvidence } from "./lib/guanlan-evidence-projection.mjs";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const maxArg = process.argv.find((arg) => arg.startsWith("--max-citation-cards="));
const maxCitationCards = maxArg ? Number(maxArg.split("=", 2)[1]) : 120;
const vaultRoot = resolveGuanlanVaultRoot(root);
const result = syncGuanlanEvidence({ root, vaultRoot, maxCitationCards });

console.log(JSON.stringify({
  ok: true,
  vaultRoot,
  ...result,
}, null, 2));
