#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { OBSIDIAN_PATHS, OBSIDIAN_VAULT_ROOT } from "./obsidian-vault-paths.mjs";

const root = process.cwd();
const problems = [];
const required = [
  "vault/.obsidian/app.json",
  "vault/README.md",
  OBSIDIAN_PATHS.home,
  "vault/10-Data-Center/README.md",
  OBSIDIAN_PATHS.dataCenterIndex,
  `${OBSIDIAN_PATHS.fdeRoot}/Enterprise AI FDE Index.md`,
  `${OBSIDIAN_PATHS.hardwareRoot}/AI Hardware Index.md`,
  `${OBSIDIAN_PATHS.viewpointsRoot}/README.md`,
  `${OBSIDIAN_PATHS.communityRoot}/Community Intelligence Index.md`,
  "vault/20-Application-Center/README.md",
  `${OBSIDIAN_PATHS.reportsRoot}/README.md`,
  `${OBSIDIAN_PATHS.fundingInsightsRoot}/Funding Insights Index.md`,
  `${OBSIDIAN_PATHS.opportunityMapRoot}/README.md`,
  `${OBSIDIAN_PATHS.trendRadarRoot}/README.md`,
  `${OBSIDIAN_PATHS.operationsRoot}/README.md`,
  `${OBSIDIAN_PATHS.referenceRoot}/README.md`,
  `${OBSIDIAN_PATHS.archiveRoot}/README.md`,
];
const retiredRoots = [
  "01-SiteV2/knowledge",
  "01-SiteV2/content/07-community-intelligence",
  "01-SiteV2/content/08-report",
  "01-SiteV2/content/09-fde",
  "01-SiteV2/content/10-ai-hardware",
  "agent-workflow/inbox/hermes-to-codex",
];
const retiredLiterals = [
  "01-SiteV2/knowledge/02-Opinion-Timelines",
  "01-SiteV2/knowledge/04-Funding-Insights",
  "01-SiteV2/content/07-community-intelligence",
  "01-SiteV2/content/08-report",
  "01-SiteV2/content/09-fde",
  "01-SiteV2/content/10-ai-hardware",
  "agent-workflow/inbox/hermes-to-codex",
  "agent-workflow/tools/read-hermes-inbox.mjs",
  "agent-workflow/tools/resolve-hermes-inbox.mjs",
  "\"inbox:hermes\"",
  "\"resolve:hermes\"",
];
const retiredFragmentPatterns = [
  /["']01-SiteV2["']\s*,\s*["']content["']\s*,\s*["'](?:07-community-intelligence|08-report|09-fde|10-ai-hardware)["']/u,
  /["']01-SiteV2["']\s*,\s*["']knowledge["']\s*,\s*["'](?:02-Opinion-Timelines|04-Funding-Insights)["']/u,
];
const activeRoots = [
  "AGENTS.md",
  "package.json",
  ".github/workflows",
  "context",
  "agent-workflow/tools",
  "agent-workflow/skills",
  "01-SiteV2/README.md",
  "01-SiteV2/site",
];
const excluded = new Set([
  "context/version-ledger.md",
  "01-SiteV2/site/data/local-skill-store-data.js",
  "agent-workflow/tools/assert-obsidian-vault.mjs",
]);
const textExtensions = new Set([".html", ".js", ".json", ".md", ".mjs", ".ps1", ".yaml", ".yml"]);

function relative(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function filesUnder(relativePath) {
  const start = path.join(root, relativePath);
  if (!fs.existsSync(start)) return [];
  if (fs.statSync(start).isFile()) return [start];
  const files = [];
  const stack = [start];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (entry.isFile() && textExtensions.has(path.extname(entry.name).toLowerCase())) files.push(file);
    }
  }
  return files;
}

function normalizeNotePath(value) {
  return value.replace(/\\/gu, "/").replace(/^\.?\//u, "").replace(/\.md$/iu, "").toLowerCase();
}

for (const file of required) {
  if (!fs.existsSync(path.join(root, file))) problems.push(`missing required Vault asset: ${file}`);
}

for (const retiredRoot of retiredRoots) {
  if (filesUnder(retiredRoot).length) problems.push(`retired Obsidian root still contains files: ${retiredRoot}`);
}

for (const activeRoot of activeRoots) {
  for (const file of filesUnder(activeRoot)) {
    const rel = relative(file);
    if (excluded.has(rel)) continue;
    const text = fs.readFileSync(file, "utf8");
    for (const retired of retiredLiterals) {
      if (text.includes(retired)) problems.push(`${rel} references retired Vault path: ${retired}`);
    }
    for (const pattern of retiredFragmentPatterns) {
      if (pattern.test(text)) problems.push(`${rel} constructs a retired Vault path: ${pattern.source}`);
    }
  }
}

const vaultMarkdown = filesUnder(OBSIDIAN_VAULT_ROOT).filter((file) => path.extname(file).toLowerCase() === ".md");
const notePaths = new Set(
  vaultMarkdown.map((file) => normalizeNotePath(path.relative(path.join(root, OBSIDIAN_VAULT_ROOT), file))),
);
const noteNames = new Set(vaultMarkdown.map((file) => path.basename(file, ".md").toLowerCase()));

for (const file of vaultMarkdown) {
  const text = fs.readFileSync(file, "utf8");
  const sourceDir = path.dirname(path.relative(path.join(root, OBSIDIAN_VAULT_ROOT), file)).replace(/\\/gu, "/");
  for (const match of text.matchAll(/\[\[([^\]]+)\]\]/gu)) {
    const rawTarget = match[1].split("|", 1)[0].split("#", 1)[0].trim();
    if (!rawTarget || rawTarget.includes("://")) continue;
    const vaultRelativeTarget = normalizeNotePath(rawTarget);
    const sourceRelativeTarget = normalizeNotePath(path.posix.join(sourceDir, rawTarget));
    const baseName = path.posix.basename(vaultRelativeTarget).toLowerCase();
    if (
      notePaths.has(vaultRelativeTarget)
      || notePaths.has(sourceRelativeTarget)
      || (!rawTarget.includes("/") && noteNames.has(baseName))
    ) continue;
    problems.push(`${relative(file)} has unresolved Wiki link: [[${match[1]}]]`);
  }
}

try {
  const config = JSON.parse(fs.readFileSync(path.join(root, OBSIDIAN_VAULT_ROOT, ".obsidian", "app.json"), "utf8"));
  if (config.newFileFolderPath !== "00-Home") problems.push("Vault new-file folder is not 00-Home");
  if (config.showUnsupportedFiles !== false) problems.push("Vault must hide unsupported repository files");
} catch (error) {
  problems.push(`Vault app.json is invalid: ${error.message}`);
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  vault: OBSIDIAN_VAULT_ROOT,
  required_assets: required.length,
  markdown_notes: vaultMarkdown.length,
  retired_roots: retiredRoots,
  problems,
}, null, 2));

if (problems.length) process.exit(1);
