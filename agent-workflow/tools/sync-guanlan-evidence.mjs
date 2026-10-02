#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {buildVaultDomains} from "./build-guanlan-vault-domains.mjs";
import { syncGuanlanEvidence } from "./lib/guanlan-evidence-projection.mjs";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const maxArg = process.argv.find((arg) => arg.startsWith("--max-citation-cards="));
const maxCitationCards = maxArg ? Number(maxArg.split("=", 2)[1]) : 120;
const vaultRoot = resolveGuanlanVaultRoot(root);
if (fs.existsSync(path.join(vaultRoot, '.guanlan-layout-migration.lock'))) throw new Error('vault_layout_migration_busy');
const result = syncGuanlanEvidence({ root, vaultRoot, maxCitationCards });
buildVaultDomains(vaultRoot);

console.log(JSON.stringify({
  ok: true,
  vaultRoot,
  ...result,
}, null, 2));
