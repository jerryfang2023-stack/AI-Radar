#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const vaultRoot = resolveGuanlanVaultRoot(root);
const appData = String(process.env.APPDATA || "").trim();

if (!appData) {
  throw new Error("APPDATA is unavailable; cannot locate the Obsidian desktop registry.");
}

const registryPath = path.join(appData, "obsidian", "obsidian.json");
const registry = fs.existsSync(registryPath)
  ? JSON.parse(fs.readFileSync(registryPath, "utf8"))
  : { vaults: {} };

registry.vaults ||= {};
const oldVaultRoot = path.resolve(root, "vault");
const oldAiHotspotRoot = path.dirname(path.resolve(root));
let retired = 0;
let vaultId = "";

for (const [id, entry] of Object.entries(registry.vaults)) {
  const candidate = path.resolve(String(entry?.path || ""));
  if (
    candidate.toLowerCase() === oldVaultRoot.toLowerCase()
    || candidate.toLowerCase() === oldAiHotspotRoot.toLowerCase()
  ) {
    delete registry.vaults[id];
    retired += 1;
  }
  if (candidate.toLowerCase() === vaultRoot.toLowerCase()) {
    vaultId = id;
  }
}

if (!vaultId) {
  vaultId = crypto.createHash("sha256").update(vaultRoot).digest("hex").slice(0, 16);
}

registry.vaults[vaultId] = {
  path: vaultRoot,
  ts: Date.now(),
  open: true,
};

fs.mkdirSync(path.dirname(registryPath), { recursive: true });
fs.writeFileSync(registryPath, `${JSON.stringify(registry, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  ok: true,
  vaultId,
  vaultName: path.basename(vaultRoot),
  retiredOldKnowledgeVaultEntries: retired,
}, null, 2));
