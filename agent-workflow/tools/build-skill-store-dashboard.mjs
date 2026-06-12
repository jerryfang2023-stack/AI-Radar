#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { defaultPaths, readSkillStoreVersion } from "./lib/guanlan-skill-ops.mjs";

const root = process.cwd();
const skillOpsPaths = defaultPaths(root);
const storeDir = process.env.GUANLAN_SKILL_STORE || path.join(os.homedir(), ".skill-store");
const projectSkillDir = path.join(root, "agent-workflow", "skills");
const registryPath = path.join(projectSkillDir, "skill-registry.md");
const outFile = path.join(root, "01-SiteV2", "site", "data", "local-skill-store-data.js");
const actionLogsDir = path.join(root, "agent-workflow", "logs", "action-runs");

const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", ".cache", "dist", "build"]);
const RULE_FILES = new Set(["SKILL.md", "MEMORY.md"]);
const RULE_DIRS = new Set(["agents", "evals", "examples", "references"]);

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function exists(file) {
  return fs.existsSync(file);
}

function dirNames(parent) {
  if (!exists(parent)) return [];
  return fs.readdirSync(parent, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .map((item) => item.name)
    .filter((name) => !name.startsWith("."))
    .sort((a, b) => a.localeCompare(b, "en"));
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const raw = match[1];
  const meta = {};
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const item = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!item) continue;
    const key = item[1];
    const value = item[2].trim().replace(/^['"]|['"]$/g, "");
    if (key === "name" || key === "description" || key === "license") meta[key] = value;
  }
  const version = raw.match(/\bversion:\s*["']?([0-9]+(?:\.[0-9]+){1,2})["']?/);
  if (version) meta.version = version[1];
  return meta;
}

function parseRegistry(file) {
  const content = readText(file);
  const entries = new Map();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("| `")) continue;
    const cells = trimmed.slice(1, -1).split("|").map((cell) => cell.trim());
    if (cells.length < 9) continue;
    const name = cells[0].replaceAll("`", "");
    const hasEvalColumn = cells.length >= 10;
    entries.set(name, {
      name,
      responsibility: cells[1],
      lane: cells[2],
      status: cells[3],
      upstream: cells[4],
      downstream: cells[5],
      gates: cells[6],
      evalCoverage: hasEvalColumn ? cells[7] : "",
      learning: hasEvalColumn ? cells[8] : cells[7],
      mirroredInStore: hasEvalColumn ? cells[9] : cells[8],
    });
  }
  return entries;
}

function scanDirStats(base) {
  const stats = {
    exists: exists(base),
    sizeKB: 0,
    fileCount: 0,
    modifiedAt: "",
    modifiedTime: 0,
    hasScripts: false,
    hasConfig: false,
    hasDeps: false,
    hasTemplates: false,
  };
  if (!stats.exists) return stats;

  function walk(dir) {
    const rel = path.relative(base, dir);
    const parts = rel ? rel.split(path.sep) : [];
    if (parts.some((part) => SKIP_DIRS.has(part))) return;
    const baseName = path.basename(dir).toLowerCase();
    if (baseName === "scripts") stats.hasScripts = true;
    if (baseName === "config" || baseName === "configs") stats.hasConfig = true;
    if (baseName === "deps" || baseName === "vendor") stats.hasDeps = true;
    if (baseName === "templates" || baseName === "template") stats.hasTemplates = true;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!SKIP_DIRS.has(entry.name)) walk(full);
        continue;
      }
      if (!entry.isFile()) continue;
      const fileStat = fs.statSync(full);
      stats.fileCount += 1;
      stats.sizeKB += fileStat.size / 1024;
      if (fileStat.mtimeMs > stats.modifiedTime) {
        stats.modifiedTime = fileStat.mtimeMs;
        stats.modifiedAt = formatDateTime(new Date(fileStat.mtimeMs));
      }
      if (/config|settings|sources/i.test(entry.name)) stats.hasConfig = true;
      if (/template/i.test(entry.name)) stats.hasTemplates = true;
    }
  }

  walk(base);
  stats.sizeKB = Math.round(stats.sizeKB);
  return stats;
}

function hasFileOrDir(base, names) {
  return names.some((name) => exists(path.join(base, name)));
}

function collectRuleFiles(base) {
  if (!exists(base)) return [];
  const files = [];
  for (const name of fs.readdirSync(base, { withFileTypes: true })) {
    if (name.isFile() && RULE_FILES.has(name.name)) files.push(name.name);
    if (name.isDirectory() && RULE_DIRS.has(name.name)) {
      const dir = path.join(base, name.name);
      const stack = [dir];
      while (stack.length) {
        const current = stack.pop();
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
          const full = path.join(current, entry.name);
          if (entry.isDirectory()) stack.push(full);
          if (entry.isFile()) files.push(path.relative(base, full).replaceAll(path.sep, "/"));
        }
      }
    }
  }
  return files.sort();
}

function ruleDigest(base) {
  const files = collectRuleFiles(base);
  const hash = crypto.createHash("sha256");
  for (const rel of files) {
    hash.update(rel);
    hash.update("\0");
    hash.update(readText(path.join(base, rel)));
    hash.update("\0");
  }
  return { files, digest: files.length ? hash.digest("hex") : "" };
}

function tokenFootprint(base) {
  const files = collectRuleFiles(base);
  let chars = 0;
  let cjk = 0;
  for (const rel of files) {
    const text = readText(path.join(base, rel));
    chars += text.length;
    cjk += (text.match(/[\u3400-\u9fff]/gu) || []).length;
  }
  const nonCjk = Math.max(0, chars - cjk);
  return {
    files: files.length,
    chars,
    estimate: Math.max(0, Math.ceil(cjk * 1.15 + nonCjk / 4)),
  };
}

function readActionRecords() {
  if (!exists(actionLogsDir)) return [];
  const records = [];
  for (const entry of fs.readdirSync(actionLogsDir, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".jsonl")) continue;
    if (entry.name === "latest.json") continue;
    const file = path.join(actionLogsDir, entry.name);
    for (const line of readText(file).split(/\r?\n/u)) {
      if (!line.trim()) continue;
      try {
        records.push(JSON.parse(line));
      } catch {
        // Ignore partial historical records; action logs remain advisory for usage estimates.
      }
    }
  }
  return records;
}

function usageMapFor(names) {
  const usage = new Map([...names].map((name) => [name, { usage_count: 0, last_used: "" }]));
  const records = readActionRecords();
  for (const record of records) {
    const haystack = JSON.stringify(record).toLowerCase();
    const usedAt = String(record.date || record.generated_at || "").slice(0, 10);
    for (const name of names) {
      if (!haystack.includes(name.toLowerCase())) continue;
      const item = usage.get(name) || { usage_count: 0, last_used: "" };
      item.usage_count += 1;
      if (usedAt && usedAt > item.last_used) item.last_used = usedAt;
      usage.set(name, item);
    }
  }
  return usage;
}

function lifecycleFor({ registry, role, usage, retired }) {
  const normalized = String(role || "").toLowerCase();
  if (retired) return "retired";
  if (/lane owner|current sub-skill/.test(normalized)) return "current";
  if (/supporting/.test(normalized)) return "supporting";
  if (/governance/.test(normalized)) return "governance";
  if (registry) return "candidate";
  if (usage.usage_count > 0) return "candidate";
  return "dormant";
}

function cleanupProfile(skill) {
  const reasons = [];
  let score = 0;
  if (["current", "supporting", "governance"].includes(skill.lifecycle)) {
    return { score: 0, candidate: false, reasons };
  }
  if (skill.lifecycle === "retired") {
    score += 70;
    reasons.push("retired");
  }
  if (skill.lifecycle === "dormant") {
    score += 35;
    reasons.push("dormant");
  }
  if (!skill.usage_count) {
    score += 25;
    reasons.push("no observed usage");
  }
  if (!skill.hasEvals) {
    score += 8;
    reasons.push("no evals");
  }
  if (!skill.hasExamples) {
    score += 8;
    reasons.push("no examples");
  }
  if (skill.token_footprint_estimate >= 8000) {
    score += 18;
    reasons.push("large token footprint");
  } else if (skill.token_footprint_estimate >= 4000) {
    score += 10;
    reasons.push("medium token footprint");
  }
  if (skill.hasScripts && !skill.usage_count) {
    score += 10;
    reasons.push("unused scripts");
  }
  return {
    score,
    candidate: score >= 45,
    reasons,
  };
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateTime(date) {
  return `${formatDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function categoryFor(name, registry) {
  if (registry?.lane) return registry.lane;
  if (name.startsWith("guanlan-")) return "Guanlan Installed";
  if (name.startsWith("baoyu-")) return "Baoyu";
  if (name.startsWith("openai-")) return "OpenAI";
  if (name.startsWith("github")) return "GitHub";
  if (name.includes("wechat")) return "WeChat";
  if (name.includes("youtube") || name.startsWith("yt-")) return "YouTube";
  if (name.includes("pdf")) return "PDF";
  if (name.includes("ppt") || name.includes("slide")) return "Slides";
  if (name.includes("frontend") || name.includes("design")) return "Design / Frontend";
  if (name.includes("research") || name.includes("arxiv")) return "Research";
  if (name.includes("content") || name.includes("article") || name.includes("copy")) return "Content";
  return "Other";
}

function retiredRisk(name, registry) {
  if (registry) return false;
  return /^guanlan-(daily-observation|business-brief|trend-report|copy-style|copy-style-qc)/.test(name);
}

function buildSkill(name, registryMap, usageMap) {
  const registry = registryMap.get(name);
  const storePath = path.join(storeDir, name);
  const projectPath = path.join(projectSkillDir, name);
  const storeExists = exists(storePath);
  const projectExists = exists(projectPath);
  const primary = storeExists ? storePath : projectPath;
  const stats = scanDirStats(primary);
  const skillMd = path.join(primary, "SKILL.md");
  const frontmatter = parseFrontmatter(readText(skillMd));
  const projectDigest = ruleDigest(projectPath);
  const storeDigest = ruleDigest(storePath);
  const mirroredActual = storeExists && projectExists;
  const syncState = !storeExists && projectExists
    ? "project-only"
    : storeExists && !projectExists
      ? "store-only"
      : mirroredActual && projectDigest.digest && projectDigest.digest === storeDigest.digest
        ? "synced"
        : mirroredActual
          ? "drift"
          : "missing";
  const current = Boolean(registry && /current|governance|supporting/i.test(registry.status));
  const role = registry?.status || (name.startsWith("guanlan-") ? "installed Guanlan skill" : "");
  const hasEvals = hasFileOrDir(projectPath, ["evals"]) || hasFileOrDir(storePath, ["evals"]);
  const hasExamples = hasFileOrDir(projectPath, ["examples"]) || hasFileOrDir(storePath, ["examples"]);
  const hasMemory = hasFileOrDir(projectPath, ["MEMORY.md"]) || hasFileOrDir(storePath, ["MEMORY.md"]);
  const hasReferences = hasFileOrDir(projectPath, ["references"]) || hasFileOrDir(storePath, ["references"]);
  const usage = usageMap.get(name) || { usage_count: 0, last_used: "" };
  const footprint = tokenFootprint(projectExists ? projectPath : storePath);
  const issues = [];

  if (registry && !storeExists) issues.push({ key: "not-installed", label: "未安装", severity: "high" });
  if (registry && !projectExists) issues.push({ key: "not-mirrored", label: "未镜像", severity: "high" });
  if (registry && syncState === "drift") issues.push({ key: "sync-drift", label: "同步分叉", severity: "high" });
  if (current && !hasEvals) issues.push({ key: "missing-evals", label: "缺 eval", severity: "medium" });
  if (current && !hasExamples) issues.push({ key: "missing-examples", label: "缺 examples", severity: "medium" });
  if (current && !frontmatter.version) issues.push({ key: "missing-version", label: "版本未知", severity: "low" });
  if (retiredRisk(name, registry)) issues.push({ key: "retired-risk", label: "历史能力", severity: "medium" });

  const baseSkill = {
    name,
    category: categoryFor(name, registry),
    isGuanlan: Boolean(registry || name.startsWith("guanlan-") || name === "follow-builders"),
    current,
    role,
    lane: registry?.lane || "",
    status: registry?.status || "",
    responsibility: registry?.responsibility || "",
    upstream: registry?.upstream || "",
    downstream: registry?.downstream || "",
    gates: registry?.gates || "",
    evalCoverage: registry?.evalCoverage || "",
    learning: registry?.learning || "",
    mirroredExpected: registry?.mirroredInStore || "",
    storeExists,
    projectExists,
    syncState,
    version: frontmatter.version || "",
    description: registry?.responsibility || frontmatter.description || "",
    originalDescription: frontmatter.description || "",
    localPath: storeExists ? storePath : "",
    projectPath: projectExists ? projectPath : "",
    hasSkillMd: exists(skillMd),
    hasEvals,
    hasExamples,
    hasMemory,
    hasReferences,
    hasScripts: stats.hasScripts,
    hasConfig: stats.hasConfig,
    hasDeps: stats.hasDeps,
    hasTemplates: stats.hasTemplates,
    lifecycle: lifecycleFor({ registry, role, usage, retired: retiredRisk(name, registry) }),
    last_used: usage.last_used,
    usage_count: usage.usage_count,
    token_footprint_estimate: footprint.estimate,
    token_footprint_files: footprint.files,
    sizeKB: stats.sizeKB,
    fileCount: stats.fileCount,
    modifiedAt: stats.modifiedAt,
    modifiedTime: stats.modifiedTime,
    issueCount: issues.length,
    issueSeverity: issues.some((issue) => issue.severity === "high") ? "high" : issues.some((issue) => issue.severity === "medium") ? "medium" : issues.length ? "low" : "",
    issues,
  };
  const cleanup = cleanupProfile(baseSkill);
  return {
    ...baseSkill,
    cleanup_score: cleanup.score,
    cleanup_candidate: cleanup.candidate,
    cleanup_reasons: cleanup.reasons,
  };
}

function summarize(skills) {
  const current = skills.filter((skill) => skill.current);
  const laneOwners = skills.filter((skill) => /lane owner/i.test(skill.status));
  const needsAction = skills.filter((skill) => skill.issues.length);
  const syncIssues = skills.filter((skill) => skill.issues.some((issue) => ["not-installed", "not-mirrored", "sync-drift"].includes(issue.key)));
  const cleanupQueue = skills.filter((skill) => skill.cleanup_candidate);
  const tokenTotal = skills.reduce((sum, skill) => sum + (Number(skill.token_footprint_estimate) || 0), 0);
  return {
    total: skills.length,
    guanlan: skills.filter((skill) => skill.isGuanlan).length,
    current: current.length,
    laneOwners: laneOwners.length,
    needsAction: needsAction.length,
    syncIssues: syncIssues.length,
    dormant: skills.filter((skill) => skill.lifecycle === "dormant").length,
    retired: skills.filter((skill) => skill.lifecycle === "retired").length,
    cleanupQueue: cleanupQueue.length,
    tokenFootprintEstimate: tokenTotal,
    evalCoverage: current.length ? Math.round(current.filter((skill) => skill.hasEvals).length / current.length * 100) : 0,
    exampleCoverage: current.length ? Math.round(current.filter((skill) => skill.hasExamples).length / current.length * 100) : 0,
  };
}

const registry = parseRegistry(registryPath);
const names = new Set([...dirNames(storeDir), ...dirNames(projectSkillDir), ...registry.keys()]);
const usageMap = usageMapFor(names);
const skills = [...names].map((name) => buildSkill(name, registry, usageMap)).sort((a, b) => {
  if (a.current !== b.current) return a.current ? -1 : 1;
  if (a.isGuanlan !== b.isGuanlan) return a.isGuanlan ? -1 : 1;
  return a.name.localeCompare(b.name, "en");
});
const cleanupQueue = [...skills]
  .filter((skill) => skill.cleanup_candidate)
  .sort((a, b) => b.cleanup_score - a.cleanup_score || b.token_footprint_estimate - a.token_footprint_estimate || a.name.localeCompare(b.name, "en"))
  .slice(0, 30)
  .map((skill) => ({
    name: skill.name,
    lifecycle: skill.lifecycle,
    cleanup_score: skill.cleanup_score,
    cleanup_reasons: skill.cleanup_reasons,
    usage_count: skill.usage_count,
    last_used: skill.last_used,
    token_footprint_estimate: skill.token_footprint_estimate,
  }));

const payload = {
  meta: {
    generatedAt: formatDateTime(new Date()),
    generatedDate: formatDate(new Date()),
    storeDir,
    projectSkillDir,
    registryPath,
    version: readSkillStoreVersion(skillOpsPaths),
    summary: summarize(skills),
  },
  cleanupQueue,
  skills,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
const json = JSON.stringify(payload, null, 2).replaceAll("<", "\\u003c");
fs.writeFileSync(outFile, `window.WaveSightLocalSkillStore = ${json};\n`, "utf8");
console.log(`Wrote ${path.relative(root, outFile)} (${skills.length} skills)`);
