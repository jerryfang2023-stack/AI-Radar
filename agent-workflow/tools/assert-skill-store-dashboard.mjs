#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  compareSkill,
  defaultPaths,
  isCurrentLike,
  readGovernedSkills,
} from "./lib/guanlan-skill-ops.mjs";

const PREFIX = "window.WaveSightLocalSkillStore = ";

function argValue(args, name, fallback) {
  const prefix = `--${name}=`;
  const value = args.find((arg) => arg.startsWith(prefix));
  return value ? path.resolve(value.slice(prefix.length)) : fallback;
}

export function dashboardContractPaths(args = process.argv.slice(2), root = process.cwd()) {
  const defaults = defaultPaths(root);
  return {
    dashboardPath: argValue(args, "dashboard", path.join(root, "01-SiteV2", "site", "data", "local-skill-store-data.js")),
    projectSkillDir: argValue(args, "project-skill-dir", defaults.projectSkillDir),
    storeDir: argValue(args, "store-dir", defaults.storeDir),
    versionPath: argValue(args, "version-file", defaults.versionPath),
  };
}

function readDashboard(file) {
  const content = fs.readFileSync(file, "utf8").trim();
  if (!content.startsWith(PREFIX)) throw new Error("dashboard payload prefix is invalid");
  return JSON.parse(content.slice(PREFIX.length).replace(/;\s*$/u, ""));
}

function isAbsoluteLocalPath(value) {
  const text = String(value || "");
  return /^[A-Za-z]:[\\/]/u.test(text)
    || /^\\\\/u.test(text)
    || /^\/(?:home|Users)\/[^/]+(?:\/|$)/u.test(text)
    || /^\/root(?:\/|$)/u.test(text)
    || /^\/mnt\/[A-Za-z]\/Users\/[^/]+(?:\/|$)/u.test(text);
}

function findAbsoluteLocalPaths(value, location = "payload", findings = []) {
  if (typeof value === "string") {
    if (isAbsoluteLocalPath(value)) findings.push(location);
    return findings;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => findAbsoluteLocalPaths(item, `${location}[${index}]`, findings));
    return findings;
  }
  if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) findAbsoluteLocalPaths(item, `${location}.${key}`, findings);
  }
  return findings;
}

function semanticSummary(skills) {
  const current = skills.filter((skill) => skill.current);
  const cleanupActions = {};
  for (const skill of skills) {
    const action = skill.cleanup_action || "unknown";
    cleanupActions[action] = (cleanupActions[action] || 0) + 1;
  }
  return {
    total: skills.length,
    guanlan: skills.filter((skill) => skill.isGuanlan).length,
    current: current.length,
    laneOwners: skills.filter((skill) => /lane owner/iu.test(String(skill.status || ""))).length,
    needsAction: skills.filter((skill) => Array.isArray(skill.issues) && skill.issues.length).length,
    syncIssues: skills.filter((skill) => Array.isArray(skill.issues)
      && skill.issues.some((issue) => ["not-installed", "not-mirrored", "sync-drift"].includes(issue.key))).length,
    dormant: skills.filter((skill) => skill.lifecycle === "dormant").length,
    retired: skills.filter((skill) => skill.lifecycle === "retired").length,
    cleanupQueue: skills.filter((skill) => skill.cleanup_candidate).length,
    cleanupActions,
    evalCoverage: current.length ? Math.round(current.filter((skill) => skill.hasEvals).length / current.length * 100) : 0,
    exampleCoverage: current.length ? Math.round(current.filter((skill) => skill.hasExamples).length / current.length * 100) : 0,
  };
}

export function evaluateSkillStoreDashboard(paths = dashboardContractPaths()) {
  const errors = [];
  let payload;
  try {
    payload = readDashboard(paths.dashboardPath);
  } catch (error) {
    errors.push(error.message);
  }

  if (!payload) return { ok: false, status: "failed", errors, summary: { skills: 0 } };

  const skills = Array.isArray(payload.skills) ? payload.skills : [];
  const summary = semanticSummary(skills);
  for (const [field, expected] of Object.entries(summary)) {
    const actual = payload.meta?.summary?.[field];
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      errors.push(`summary.${field} expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  let expectedVersion = {};
  try {
    expectedVersion = JSON.parse(fs.readFileSync(paths.versionPath, "utf8"));
  } catch {
    errors.push(`dashboard version source is unreadable: ${paths.versionPath}`);
  }
  if (JSON.stringify(payload.meta?.version) !== JSON.stringify(expectedVersion)) {
    errors.push(`dashboard version does not match ${path.basename(paths.versionPath)}`);
  }

  const dashboardSkills = new Map(skills.map((skill) => [skill.name, skill]));
  const seenNames = new Set();
  for (const skill of skills) {
    if (seenNames.has(skill.name)) errors.push(`dashboard duplicate skill ${skill.name}`);
    seenNames.add(skill.name);
  }
  for (const location of findAbsoluteLocalPaths(payload)) errors.push(`${location} exposes an absolute local path`);

  for (const skill of readGovernedSkills(paths.projectSkillDir)) {
    const dashboardSkill = dashboardSkills.get(skill.name);
    if (!dashboardSkill) {
      errors.push(`dashboard missing governed skill ${skill.name}`);
      continue;
    }
    const expected = skill.guanlan;
    for (const field of ["version", "lane", "status", "responsibility", "upstream", "downstream", "gates"]) {
      if (dashboardSkill[field] !== expected[field]) {
        errors.push(`${skill.name} ${field} expected ${expected[field]}, got ${dashboardSkill[field] ?? "missing"}`);
      }
    }
    const expectedCurrent = isCurrentLike(expected.status);
    if (dashboardSkill.current !== expectedCurrent) {
      errors.push(`${skill.name} current expected ${expectedCurrent}, got ${dashboardSkill.current ?? "missing"}`);
    }
    if (expected.mirrored_in_skill_store !== false) {
      const mirror = compareSkill(skill.name, paths);
      if (dashboardSkill.syncState !== mirror.state) {
        errors.push(`${skill.name} syncState expected ${mirror.state}, got ${dashboardSkill.syncState ?? "missing"}`);
      }
      if (dashboardSkill.projectExists !== mirror.projectExists || dashboardSkill.storeExists !== mirror.storeExists) {
        errors.push(`${skill.name} mirror existence flags do not match source`);
      }
    }
  }

  const expectedCleanupNames = skills.filter((skill) => skill.cleanup_candidate).map((skill) => skill.name).sort();
  const actualCleanupNames = Array.isArray(payload.cleanupQueue) ? payload.cleanupQueue.map((skill) => skill.name).sort() : [];
  if (JSON.stringify(actualCleanupNames) !== JSON.stringify(expectedCleanupNames)) {
    errors.push(`cleanupQueue names expected ${expectedCleanupNames.join(", ")}, got ${actualCleanupNames.join(", ")}`);
  }

  return {
    ok: errors.length === 0,
    status: errors.length ? "failed" : "passed",
    errors,
    summary: { skills: skills.length, governed: readGovernedSkills(paths.projectSkillDir).length },
  };
}

function runCli() {
  const result = evaluateSkillStoreDashboard(dashboardContractPaths());
  if (!result.ok) {
    for (const error of result.errors) console.error(`ERROR ${error}`);
    process.exit(1);
  }
  console.log(`Skill Store dashboard contract passed: ${result.summary.skills} skills.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) runCli();
