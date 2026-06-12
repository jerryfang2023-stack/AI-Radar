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
const reportsDir = path.join(root, "agent-workflow", "reports");
const usageOverridesPath = path.join(projectSkillDir, "skill-usage-overrides.json");
const cleanupObservationPath = path.join(projectSkillDir, "skill-cleanup-observation.json");

const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", ".cache", "dist", "build"]);
const RULE_FILES = new Set(["SKILL.md", "MEMORY.md"]);
const RULE_DIRS = new Set(["agents", "evals", "examples", "references"]);
const CLEANUP_UNUSED_DAYS = 30;
const CLEANUP_POLICY = [
  {
    action: "keep",
    label: "Protect",
    rule: "Current, supporting, governance, and lane-owner skills are protected from cleanup suggestions.",
  },
  {
    action: "cleanup",
    label: "Cleanup",
    rule: "Only manually selected cleanup recommendations enter immediately; the rest start a 30-day observation window from 2026-06-13.",
  },
];

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
    installedAt: "",
    installedTime: 0,
    modifiedAt: "",
    modifiedTime: 0,
    hasScripts: false,
    hasConfig: false,
    hasDeps: false,
    hasTemplates: false,
  };
  if (!stats.exists) return stats;
  const rootStat = fs.statSync(base);
  const installedTime = rootStat.birthtimeMs || rootStat.ctimeMs || rootStat.mtimeMs;
  stats.installedTime = installedTime;
  stats.installedAt = formatDateTime(new Date(installedTime));

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

function productionUsageFiles() {
  if (!exists(reportsDir)) return [];
  return fs.readdirSync(reportsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => /^\d{4}-\d{2}-\d{2}-guanlan-(daily-monitor-log|monitor-quality-gate)\.md$/u.test(name))
    .map((name) => path.join(reportsDir, name));
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function productionUsagePattern(name) {
  const exact = escapeRegExp(name);
  const loose = escapeRegExp(name).replaceAll("\\-", "[-_ ]");
  return new RegExp([
    `(?:^|\\n)-\\s*${loose}(?:_|\\b)`,
    `\\b(?:source_distribution|raw_count_by_channel):[^\\n]*\\b${exact}\\b`,
    `\\bacquisition_channel:\\s*${exact}\\b`,
  ].join("|"), "iu");
}

function readUsageOverrides() {
  if (!exists(usageOverridesPath)) return {};
  try {
    return JSON.parse(readText(usageOverridesPath));
  } catch {
    return {};
  }
}

function readCleanupObservation() {
  if (!exists(cleanupObservationPath)) return {};
  try {
    return JSON.parse(readText(cleanupObservationPath));
  } catch {
    return {};
  }
}

function addUsage(usage, name, usedAt) {
  const item = usage.get(name) || { usage_count: 0, last_used: "" };
  item.usage_count += 1;
  if (usedAt && usedAt > item.last_used) item.last_used = usedAt;
  usage.set(name, item);
}

function addUsageOverride(usage, name, override) {
  const count = Number(override?.usage_count || 1);
  const usedAt = String(override?.last_used || "").slice(0, 10);
  const item = usage.get(name) || { usage_count: 0, last_used: "" };
  item.usage_count += Math.max(1, count);
  if (usedAt && usedAt > item.last_used) item.last_used = usedAt;
  usage.set(name, item);
}

function usageMapFor(names) {
  const usage = new Map([...names].map((name) => [name, { usage_count: 0, last_used: "" }]));
  const records = readActionRecords();
  for (const record of records) {
    const haystack = JSON.stringify(record).toLowerCase();
    const usedAt = String(record.date || record.generated_at || "").slice(0, 10);
    for (const name of names) {
      if (!haystack.includes(name.toLowerCase())) continue;
      addUsage(usage, name, usedAt);
    }
  }

  for (const file of productionUsageFiles()) {
    const text = readText(file);
    const usedAt = path.basename(file).slice(0, 10);
    for (const name of names) {
      if (!productionUsagePattern(name).test(text)) continue;
      addUsage(usage, name, usedAt);
    }
  }
  const overrides = readUsageOverrides();
  for (const [name, override] of Object.entries(overrides)) {
    if (!names.has(name)) continue;
    addUsageOverride(usage, name, override);
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

function daysSince(time, generatedDate) {
  if (!time) return 0;
  return Math.floor((generatedDate.getTime() - time) / 86400000);
}

function dateTimeFromDateText(value) {
  if (!value) return 0;
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function observationStartTime(skill, observation) {
  const baseline = dateTimeFromDateText(observation.baseline_observation_started_at);
  if (!baseline) return skill.installedTime || 0;
  return Math.max(baseline, skill.installedTime || baseline);
}

function cleanupProfile(skill, generatedDate, observation) {
  const reasons = [];
  if (["current", "supporting", "governance"].includes(skill.lifecycle)) {
    return { score: 0, candidate: false, reasons, observationStart: "" };
  }
  const noUsage = !skill.usage_count;
  const recommendedNow = new Set(observation.recommended_cleanup_now || []).has(skill.name);
  const startTime = observationStartTime(skill, observation);
  const observedDays = daysSince(startTime, generatedDate);
  const observeDays = Number(observation.observe_days || CLEANUP_UNUSED_DAYS);
  if (noUsage) reasons.push("no observed usage");
  if (recommendedNow) reasons.push("recommended cleanup");
  if (!recommendedNow && noUsage && observedDays < observeDays) reasons.push("in 30 day observation");
  if (!recommendedNow && noUsage && observedDays >= observeDays) reasons.push("30 day observation expired");
  const candidate = recommendedNow || (noUsage && observedDays >= observeDays);
  return {
    score: candidate ? (recommendedNow ? 100 : 80) : 0,
    candidate,
    reasons,
    observationStart: startTime ? formatDateTime(new Date(startTime)) : "",
    recommendationReason: observation.reason?.[skill.name] || "",
  };
}

function cleanupGovernance(skill) {
  const protectedSkill = skill.current
    || /lane owner/i.test(skill.status || "")
    || ["current", "supporting", "governance"].includes(skill.lifecycle);

  if (protectedSkill) {
    return {
      cleanup_action: "keep",
      cleanup_owner: "Skill Ops",
      cleanup_reason: "protected current/supporting/governance skill",
      replacement_skill: "",
    };
  }

  if (skill.cleanup_candidate) {
    return {
      cleanup_action: "cleanup",
      cleanup_owner: "Skill Ops",
      cleanup_reason: skill.cleanup_recommendation_reason || "recommended cleanup or no usage after the 30-day observation window",
      replacement_skill: "",
    };
  }

  return {
    cleanup_action: "keep",
    cleanup_owner: "Skill Ops",
    cleanup_reason: "no cleanup action recommended",
    replacement_skill: "",
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

function buildSkill(name, registryMap, usageMap, generatedDate, observation) {
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
    installedAt: stats.installedAt,
    installedTime: stats.installedTime,
    last_used: usage.last_used,
    usage_count: usage.usage_count,
    sizeKB: stats.sizeKB,
    fileCount: stats.fileCount,
    modifiedAt: stats.modifiedAt,
    modifiedTime: stats.modifiedTime,
    issueCount: issues.length,
    issueSeverity: issues.some((issue) => issue.severity === "high") ? "high" : issues.some((issue) => issue.severity === "medium") ? "medium" : issues.length ? "low" : "",
    issues,
  };
  const cleanup = cleanupProfile(baseSkill, generatedDate, observation);
  const withCleanup = {
    ...baseSkill,
    cleanup_score: cleanup.score,
    cleanup_candidate: cleanup.candidate,
    cleanup_reasons: cleanup.reasons,
    cleanup_observation_start: cleanup.observationStart,
    cleanup_recommendation_reason: cleanup.recommendationReason,
  };
  const governance = cleanupGovernance(withCleanup);
  return {
    ...withCleanup,
    ...governance,
  };
}

function summarize(skills) {
  const current = skills.filter((skill) => skill.current);
  const laneOwners = skills.filter((skill) => /lane owner/i.test(skill.status));
  const needsAction = skills.filter((skill) => skill.issues.length);
  const syncIssues = skills.filter((skill) => skill.issues.some((issue) => ["not-installed", "not-mirrored", "sync-drift"].includes(issue.key)));
  const cleanupQueue = skills.filter((skill) => skill.cleanup_candidate);
  const cleanupActions = {};
  for (const skill of skills) {
    const key = skill.cleanup_action || "unknown";
    cleanupActions[key] = (cleanupActions[key] || 0) + 1;
  }
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
    cleanupActions,
    evalCoverage: current.length ? Math.round(current.filter((skill) => skill.hasEvals).length / current.length * 100) : 0,
    exampleCoverage: current.length ? Math.round(current.filter((skill) => skill.hasExamples).length / current.length * 100) : 0,
  };
}

const registry = parseRegistry(registryPath);
const cleanupObservation = readCleanupObservation();
const names = new Set([...dirNames(storeDir), ...dirNames(projectSkillDir), ...registry.keys()]);
const usageMap = usageMapFor(names);
const generatedAt = new Date();
const skills = [...names].map((name) => buildSkill(name, registry, usageMap, generatedAt, cleanupObservation)).sort((a, b) => {
  if (a.current !== b.current) return a.current ? -1 : 1;
  if (a.isGuanlan !== b.isGuanlan) return a.isGuanlan ? -1 : 1;
  return a.name.localeCompare(b.name, "en");
});
const cleanupQueue = [...skills]
  .filter((skill) => skill.cleanup_candidate)
  .sort((a, b) => b.cleanup_score - a.cleanup_score || (a.usage_count || 0) - (b.usage_count || 0) || a.name.localeCompare(b.name, "en"))
  .map((skill) => ({
    name: skill.name,
    lifecycle: skill.lifecycle,
    cleanup_score: skill.cleanup_score,
    cleanup_reasons: skill.cleanup_reasons,
    cleanup_action: skill.cleanup_action,
    cleanup_owner: skill.cleanup_owner,
    cleanup_reason: skill.cleanup_reason,
    replacement_skill: skill.replacement_skill,
    installedAt: skill.installedAt,
    cleanup_observation_start: skill.cleanup_observation_start,
    usage_count: skill.usage_count,
    last_used: skill.last_used,
  }));

const payload = {
  meta: {
    generatedAt: formatDateTime(generatedAt),
    generatedDate: formatDate(generatedAt),
    storeDir,
    projectSkillDir,
    registryPath,
    cleanupObservationPath,
    version: readSkillStoreVersion(skillOpsPaths),
    cleanupPolicy: CLEANUP_POLICY,
    summary: summarize(skills),
  },
  cleanupQueue,
  skills,
};

fs.mkdirSync(path.dirname(outFile), { recursive: true });
const json = JSON.stringify(payload, null, 2).replaceAll("<", "\\u003c");
fs.writeFileSync(outFile, `window.WaveSightLocalSkillStore = ${json};\n`, "utf8");
console.log(`Wrote ${path.relative(root, outFile)} (${skills.length} skills)`);
