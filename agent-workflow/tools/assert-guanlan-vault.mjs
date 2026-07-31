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
let markdownFileCount = 0;
const oldRepositoryVault = path.join(root, "vault");
const reportSource = path.join(root, REPOSITORY_CONTENT_PATHS.industryReportsRoot);

if (fs.existsSync(oldRepositoryVault)) problems.push("repository-local vault/ still exists");
if (!fs.existsSync(reportSource)) problems.push(`industry report source is missing: ${REPOSITORY_CONTENT_PATHS.industryReportsRoot}`);

const vaultRoot = resolveGuanlanVaultRoot(root, { required: !contractOnly });
if (vaultRoot) {
  const retiredVaultRoot = path.resolve(path.dirname(vaultRoot), "AI热点");
  if (!contractOnly && fs.existsSync(retiredVaultRoot)) {
    problems.push(`retired AI hotspot Vault root still exists: ${retiredVaultRoot}`);
  }
  if (!contractOnly && process.platform === "win32" && process.env.APPDATA) {
    const registryPath = path.join(process.env.APPDATA, "obsidian", "obsidian.json");
    if (fs.existsSync(registryPath)) {
      try {
        const registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
        const retired = Object.values(registry?.vaults || {}).filter((entry) => (
          path.resolve(String(entry?.path || "")).toLowerCase() === retiredVaultRoot.toLowerCase()
        ));
        if (retired.length) problems.push("retired AI hotspot Vault is still registered in Obsidian");
      } catch (error) {
        problems.push(`invalid Obsidian Vault registry: ${error.message}`);
      }
    }
  }
  if (fs.existsSync(path.join(vaultRoot, "60-知识资产/AI热点迁移审计.md"))) {
    problems.push("retired AI hotspot migration audit still exists in Guanlan Vault");
  }
  const required = [
    ".obsidian/app.json",
    "README.md",
    ...Object.values(GUANLAN_VAULT_PATHS),
    ".guanlan-generated.json",
    ".guanlan-evidence.json",
    "60-知识资产/证据关系索引.md",
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
  markdownFileCount = markdown.length;
  const noteNames = new Set(markdown.map((file) => path.basename(file, ".md").toLowerCase()));
  let generatedManifestFiles = new Set();

  for (const file of markdown) {
    const content = fs.readFileSync(file, "utf8");
    const relativePath = path.relative(vaultRoot, file).replaceAll("\\", "/");
    const isPublishedKnowledgeAsset = (
      relativePath.startsWith("30-应用中心/行业报告档案/")
      || (
        relativePath.startsWith("60-知识资产/")
        && relativePath.split("/").length >= 3
        && !relativePath.startsWith("60-知识资产/来源引用/")
      )
    );
    if (isPublishedKnowledgeAsset) {
      for (const field of [
        "evidence_status",
        "evidence_source_refs",
        "evidence_claim_refs",
        "evidence_event_refs",
        "evidence_entity_refs",
        "evidence_report_refs",
        "evidence_source_urls",
        "original_body_storage",
      ]) {
        if (!new RegExp(`^${field}:`, "mu").test(content)) {
          problems.push(`${relativePath} is missing evidence field: ${field}`);
        }
      }
      if (!content.includes("<!-- guanlan-evidence:start -->")) {
        problems.push(`${relativePath} is missing the managed evidence section`);
      }
    }
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

  try {
    const evidence = JSON.parse(fs.readFileSync(path.join(vaultRoot, ".guanlan-evidence.json"), "utf8"));
    if (evidence.originalBodyStorage !== "private_evidence_store_only") {
      problems.push("Guanlan evidence projection must disclose the private evidence store as the only original-body location");
    }
    if (!Number.isInteger(evidence.assets?.total) || evidence.assets.total < 1) {
      problems.push("Guanlan evidence projection has no knowledge assets");
    }
    if (!Number.isInteger(evidence.citationCards) || evidence.citationCards < 1) {
      problems.push("Guanlan evidence projection has no source citation cards");
    }
  } catch (error) {
    problems.push(`invalid .guanlan-evidence.json: ${error.message}`);
  }

  for (const file of markdown) {
    const relativePath = path.relative(vaultRoot, file).replaceAll("\\", "/");
    if (!relativePath.startsWith("90-工作区/") && !generatedManifestFiles.has(relativePath)) {
      problems.push(`unmanaged Markdown outside 90-工作区: ${relativePath}`);
    }
  }

}

const publicSiteRoot = path.join(root, "01-SiteV2", "site");
if (fs.existsSync(publicSiteRoot)) {
  const stack = [publicSiteRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && path.extname(entry.name).toLowerCase() === ".json") {
        const content = fs.readFileSync(file, "utf8");
        if (/"(?:body_original|clean_text|full_text)"\s*:/u.test(content)) {
          problems.push(`${path.relative(root, file)} exposes an original body field`);
        }
      }
    }
  }
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  contractOnly,
  externalVaultConfigured: Boolean(vaultRoot),
  vault: vaultRoot ? path.basename(vaultRoot) : "",
  markdownFiles: markdownFileCount,
  problems,
}, null, 2));

if (problems.length) process.exit(1);
