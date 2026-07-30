#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  GUANLAN_VAULT_PATHS,
  REPOSITORY_CONTENT_PATHS,
  resolveGuanlanVaultRoot,
} from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const contractOnly = process.argv.includes("--contract-only");
const problems = [];
const oldRepositoryVault = path.join(root, "vault");
const reportSource = path.join(root, REPOSITORY_CONTENT_PATHS.industryReportsRoot);

if (fs.existsSync(oldRepositoryVault)) problems.push("repository-local vault/ still exists");
if (!fs.existsSync(reportSource)) problems.push(`industry report source is missing: ${REPOSITORY_CONTENT_PATHS.industryReportsRoot}`);

const vaultRoot = resolveGuanlanVaultRoot(root, { required: !contractOnly });
if (vaultRoot) {
  const required = [
    ".obsidian/app.json",
    "README.md",
    ...Object.values(GUANLAN_VAULT_PATHS),
    ".guanlan-generated.json",
  ];
  for (const relativePath of required) {
    if (!fs.existsSync(path.join(vaultRoot, relativePath))) problems.push(`missing Guanlan Vault asset: ${relativePath}`);
  }

  const markdown = [];
  const stack = [vaultRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".md") markdown.push(file);
    }
  }
  const notePaths = new Set(markdown.map((file) => path.relative(vaultRoot, file).replaceAll("\\", "/").replace(/\.md$/u, "").toLowerCase()));
  const noteNames = new Set(markdown.map((file) => path.basename(file, ".md").toLowerCase()));
  let generatedManifestFiles = new Set();

  for (const file of markdown) {
    const content = fs.readFileSync(file, "utf8");
    if (/AI热点[\\/]|01-WaveSight[\\/]vault|vault\/(?:10-Data-Center|20-Application-Center)/u.test(content)) {
      problems.push(`${path.relative(vaultRoot, file)} references the retired Vault tree`);
    }
    const sourceDir = path.dirname(path.relative(vaultRoot, file)).replaceAll("\\", "/");
    for (const match of content.matchAll(/\[\[([^\]]+)\]\]/gu)) {
      const raw = match[1].split("|", 1)[0].split("#", 1)[0].trim();
      if (!raw || raw.includes("://")) continue;
      const normalized = raw.replaceAll("\\", "/").replace(/\.md$/u, "").toLowerCase();
      const fromSource = path.posix.join(sourceDir, raw).replace(/\.md$/u, "").toLowerCase();
      if (notePaths.has(normalized) || notePaths.has(fromSource) || (!raw.includes("/") && noteNames.has(path.posix.basename(normalized)))) continue;
      problems.push(`${path.relative(vaultRoot, file)} has unresolved Wiki link: [[${match[1]}]]`);
    }
  }

  try {
    const config = JSON.parse(fs.readFileSync(path.join(vaultRoot, ".obsidian", "app.json"), "utf8"));
    if (config.newFileFolderPath !== "90-工作区") problems.push("new-file folder must be 90-工作区");
  } catch (error) {
    problems.push(`invalid .obsidian/app.json: ${error.message}`);
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(path.join(vaultRoot, ".guanlan-generated.json"), "utf8"));
    const generatedFiles = Array.isArray(manifest.generatedFiles) ? manifest.generatedFiles : [];
    generatedManifestFiles = new Set(generatedFiles.map((relativePath) => relativePath.replaceAll("\\", "/")));
    if (!generatedFiles.length) problems.push("generated manifest has no file inventory");
    if (new Set(generatedFiles).size !== generatedFiles.length) problems.push("generated manifest contains duplicate file paths");
    for (const relativePath of generatedFiles) {
      if (!fs.existsSync(path.join(vaultRoot, relativePath))) problems.push(`generated manifest points to a missing file: ${relativePath}`);
    }
  } catch (error) {
    problems.push(`invalid .guanlan-generated.json: ${error.message}`);
  }

  for (const file of markdown) {
    const relativePath = path.relative(vaultRoot, file).replaceAll("\\", "/");
    if (!relativePath.startsWith("90-工作区/") && !generatedManifestFiles.has(relativePath)) {
      problems.push(`unmanaged Markdown outside 90-工作区: ${relativePath}`);
    }
  }

  if (markdown.length > 650) problems.push(`Guanlan curated Vault is unexpectedly large: ${markdown.length} Markdown files`);
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  contractOnly,
  externalVaultConfigured: Boolean(vaultRoot),
  vault: vaultRoot ? path.basename(vaultRoot) : "",
  problems,
}, null, 2));

if (problems.length) process.exit(1);
