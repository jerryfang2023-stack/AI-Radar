#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { resolveGuanlanVaultRoot } from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const vaultRoot = resolveGuanlanVaultRoot(root);
const appData = String(process.env.APPDATA || "").trim();
const explicitlyRetiredVaultRoots = process.argv
  .slice(2)
  .filter((argument) => argument.startsWith("--retire-vault="))
  .map((argument) => argument.slice("--retire-vault=".length).trim())
  .filter(Boolean)
  .map((value) => path.resolve(value));

if (!appData) {
  throw new Error("APPDATA is unavailable; cannot locate the Obsidian desktop registry.");
}

const registryPath = path.join(appData, "obsidian", "obsidian.json");
const registry = fs.existsSync(registryPath)
  ? JSON.parse(fs.readFileSync(registryPath, "utf8"))
  : { vaults: {} };

registry.vaults ||= {};
const retiredVaultRoots = new Set([
  path.resolve(root),
  path.resolve(root, "vault"),
  path.resolve(path.dirname(vaultRoot), "AI热点"),
  ...explicitlyRetiredVaultRoots,
].map((value) => value.toLowerCase()));
let retired = 0;
let vaultId = "";

for (const [id, entry] of Object.entries(registry.vaults)) {
  const candidate = path.resolve(String(entry?.path || ""));
  if (retiredVaultRoots.has(candidate.toLowerCase())) {
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
  retiredVaultEntries: retired,
}, null, 2));
