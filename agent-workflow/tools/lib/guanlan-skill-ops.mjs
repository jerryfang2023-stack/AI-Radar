import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { skillSummary } from "./skill-catalog.mjs";

export const RULE_FILES = ["SKILL.md", "MEMORY.md"];
export const RULE_DIRS = ["agents", "evals", "examples", "references"];
export const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", ".cache", "dist", "build"]);
export const GUANLAN_PROMPT_CONTRACT = "GPT-5.6-SKILL-V1.0";

const MOJIBAKE_PATTERN = /(?:\uFFFD|\u9225|\u942d\u30e8\u7611|\u74a7\u52ea\u9a87|\u6d93\u20ac|\u6de7roduct|\u6e1epresentative|\u6ec4\u6e70|\u935b\?|\u935f\u55d5\u7b1f|\u9359\u6a3a\u5bf2|\u9352\u3086\u67c7|\u6ae4\u93b1|\u6fb6\u0444\u0101|\u9368\u5b27)/u;
const SECTION_PATTERNS = {
  inputs: /^##\s+(?:Required Reads|Required Sources|Inputs|Input|Scope)\s*$/imu,
  workflow: /^##\s+(?:Workflow|Execution|Method|Current flow)\s*$/imu,
  boundaries: /^##\s+(?:Boundary|Boundaries|Rules|Policy|Hard Rules|Prohibited|Stop Rules|Constraints|Evidence Boundary|Evidence Rules|Lane Boundaries)\s*$/imu,
  output: /^##\s+(?:Output|Outputs|Output Format|Reporting|Findings)\s*$/imu,
  completion: /^##\s+(?:Done When|Completion Contract|Validation|Verification|Pass Criteria)\s*$/imu,
};
const ASK_OR_STOP_PATTERN = /\b(?:ask|stop|quarantine|reject|pause|fail(?:ed|ure)?)\b|leave[^\n]{0,80}\bempty\b|route[^\n]{0,80}\bQA\b/iu;
const AUTHORIZATION_PATTERN = /authoriz|approval|owning[^\n]{0,50}workflow|do not[^\n]{0,60}(?:publish|commit|push|deploy|write outside)|(?:publication|deployment|external (?:model )?call)[^\n]{0,60}(?:require|only|allowed)/iu;
const NON_INFERENCE_PATTERN = /\b(?:do not|never|must not|cannot)\b|leave[^\n]{0,80}\bempty\b|only from|only when/iu;

export function defaultPaths(root = process.cwd()) {
  return {
    root,
    storeDir: process.env.GUANLAN_SKILL_STORE || path.join(os.homedir(), ".skill-store"),
    projectSkillDir: path.join(root, "agent-workflow", "skills"),
    repoRuntimeSkillDir: path.join(root, ".agents", "skills"),
    registryPath: path.join(root, "agent-workflow", "skills", "skill-registry.md"),
    versionPath: path.join(root, "agent-workflow", "skills", "skill-store-version.json"),
    promptEvalPath: path.join(root, "agent-workflow", "skills", "skill-trigger-evals.json"),
  };
}

export function exists(file) {
  return fs.existsSync(file);
}

export function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(readText(file));
  } catch {
    return fallback;
  }
}

export function writeText(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content, "utf8");
}

export function readSkillStoreVersion(paths = defaultPaths()) {
  return readJson(paths.versionPath, {
    schema_version: 1,
    name: "Guanlan Skill Store",
    version: "",
    release_date: "",
    stage: "",
  }) || {};
}

function cleanScalar(value) {
  const raw = String(value || "").trim();
  if (raw === "true") return true;
  if (raw === "false") return false;
  if (/^-?\d+$/.test(raw)) return Number(raw);
  return raw.replace(/^["']|["']$/g, "");
}

export function parseFrontmatter(content) {
  const match = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { raw: "", name: "", description: "", metadata: {} };
  const raw = match[1];
  const result = { raw, name: "", description: "", license: "", metadata: { guanlan: {} } };
  let inMetadata = false;
  let inGuanlan = false;

  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const indent = line.match(/^\s*/)?.[0].length || 0;
    const pair = line.trim().match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!pair) continue;
    const [, key, value] = pair;

    if (indent === 0) {
      inMetadata = key === "metadata";
      inGuanlan = false;
      if (["name", "description", "license"].includes(key)) result[key] = cleanScalar(value);
      continue;
    }
    if (indent === 2 && inMetadata) {
      inGuanlan = key === "guanlan";
      continue;
    }
    if (indent === 4 && inMetadata && inGuanlan) {
      result.metadata.guanlan[key] = cleanScalar(value);
    }
  }

  return { ...result, ...skillSummary(content) };
}

export function readSkill(projectSkillDir, name) {
  const dir = path.join(projectSkillDir, name);
  const skillPath = path.join(dir, "SKILL.md");
  const frontmatter = parseFrontmatter(readText(skillPath));
  return {
    name,
    dir,
    skillPath,
    frontmatter,
    guanlan: frontmatter.metadata?.guanlan || {},
    hasSkillMd: exists(skillPath),
    hasMemory: exists(path.join(dir, "MEMORY.md")),
    evalFiles: fileNames(path.join(dir, "evals")),
    exampleFiles: fileNames(path.join(dir, "examples")),
    referenceFiles: fileNames(path.join(dir, "references")),
  };
}

export function listProjectSkills(projectSkillDir) {
  if (!exists(projectSkillDir)) return [];
  return fs.readdirSync(projectSkillDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => exists(path.join(projectSkillDir, name, "SKILL.md")))
    .sort((a, b) => a.localeCompare(b, "en"));
}

export function readGovernedSkills(projectSkillDir) {
  return listProjectSkills(projectSkillDir)
    .map((name) => readSkill(projectSkillDir, name))
    .filter((skill) => Boolean(skill.guanlan?.status))
    .sort((a, b) => {
      const orderA = Number(a.guanlan.order ?? 999);
      const orderB = Number(b.guanlan.order ?? 999);
      return orderA - orderB || a.name.localeCompare(b.name, "en");
    });
}

export function fileNames(dir) {
  if (!exists(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile()) out.push(path.relative(dir, full).replaceAll(path.sep, "/"));
    }
  }
  return out.sort();
}

export function collectRuleFiles(base) {
  if (!exists(base)) return [];
  const files = [];
  for (const file of RULE_FILES) {
    if (exists(path.join(base, file))) files.push(file);
  }
  for (const dirName of RULE_DIRS) {
    const dir = path.join(base, dirName);
    if (!exists(dir)) continue;
    for (const rel of fileNames(dir)) files.push(`${dirName}/${rel}`);
  }
  return files.sort();
}

export function ruleDigest(base) {
  const files = collectRuleFiles(base);
  const hash = crypto.createHash("sha256");
  for (const rel of files) {
    hash.update(rel);
    hash.update("\0");
    hash.update(readText(path.join(base, rel)).replace(/\r\n/g, "\n"));
    hash.update("\0");
  }
  return { files, digest: files.length ? hash.digest("hex") : "" };
}

export function syncRuleAssets(skillName, { projectSkillDir, storeDir, dryRun = false }) {
  const src = path.join(projectSkillDir, skillName);
  const dst = path.join(storeDir, skillName);
  if (!exists(src)) throw new Error(`Project skill not found: ${src}`);
  assertChildPath(projectSkillDir, src, "project skill path");
  assertChildPath(storeDir, dst, "skill-store path");
  const actions = [];
  if (!dryRun) fs.mkdirSync(dst, { recursive: true });

  for (const file of RULE_FILES) {
    const from = path.join(src, file);
    const to = path.join(dst, file);
    if (exists(from)) {
      actions.push(`copy ${skillName}/${file}`);
      assertChildPath(src, from, "project rule file");
      assertChildPath(dst, to, "skill-store rule file");
      if (!dryRun) fs.copyFileSync(from, to);
    } else if (exists(to)) {
      actions.push(`remove ${skillName}/${file}`);
      assertChildPath(dst, to, "skill-store rule file");
      if (!dryRun) fs.rmSync(to, { force: true });
    }
  }

  for (const dirName of RULE_DIRS) {
    const from = path.join(src, dirName);
    const to = path.join(dst, dirName);
    if (exists(from)) {
      actions.push(`copy ${skillName}/${dirName}/`);
      assertChildPath(src, from, "project rule directory");
      assertChildPath(dst, to, "skill-store rule directory");
      if (!dryRun) {
        if (exists(to)) fs.rmSync(to, { recursive: true, force: true });
        fs.cpSync(from, to, { recursive: true });
      }
    } else if (exists(to)) {
      actions.push(`remove ${skillName}/${dirName}/`);
      assertChildPath(dst, to, "skill-store rule directory");
      if (!dryRun) fs.rmSync(to, { recursive: true, force: true });
    }
  }
  return actions;
}

function assertChildPath(base, target, label) {
  const resolvedBase = path.resolve(base);
  const resolvedTarget = path.resolve(target);
  if (resolvedTarget === resolvedBase || !resolvedTarget.startsWith(`${resolvedBase}${path.sep}`)) {
    throw new Error(`Unsafe ${label}: ${resolvedTarget}`);
  }
}

export function compareSkill(skillName, { projectSkillDir, storeDir }) {
  const projectPath = path.join(projectSkillDir, skillName);
  const storePath = path.join(storeDir, skillName);
  const projectExists = exists(projectPath);
  const storeExists = exists(storePath);
  if (!projectExists && !storeExists) return { skillName, state: "missing", projectExists, storeExists };
  if (projectExists && !storeExists) return { skillName, state: "project-only", projectExists, storeExists };
  if (!projectExists && storeExists) return { skillName, state: "store-only", projectExists, storeExists };
  const project = ruleDigest(projectPath);
  const store = ruleDigest(storePath);
  return {
    skillName,
    state: project.digest === store.digest ? "synced" : "drift",
    projectExists,
    storeExists,
    projectFiles: project.files,
    storeFiles: store.files,
    projectDigest: project.digest,
    storeDigest: store.digest,
  };
}

export function isCurrentLike(status = "") {
  return /current|supporting|governance/i.test(status);
}

export function isActiveGovernedSkill(status = "") {
  return Boolean(String(status || "").trim()) && !/retired|dormant|candidate|deprecated|archived/i.test(status);
}

function skillBody(content = "") {
  return String(content).replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n?/u, "");
}

export function evaluateSkillPromptContract(skill) {
  const errors = [];
  const skillText = readText(skill.skillPath).replace(/\r\n/gu, "\n");
  const body = skillBody(skillText);
  const description = String(skill.frontmatter?.description || parseFrontmatter(skillText).description || "").trim();

  if (!/^Use when\b/iu.test(description)) {
    errors.push("description must front-load the trigger with 'Use when'");
  }
  if (!/\bDo not use\b/iu.test(description)) {
    errors.push("description must name an adjacent or unsupported 'Do not use' case");
  }
  if (MOJIBAKE_PATTERN.test(skillText)) errors.push("SKILL.md contains likely mojibake or replacement text");

  for (const [section, pattern] of Object.entries(SECTION_PATTERNS)) {
    if (!pattern.test(body)) errors.push(`prompt contract missing ${section} section`);
  }
  if (!NON_INFERENCE_PATTERN.test(body)) errors.push("prompt contract needs an explicit non-inference boundary");
  if (!ASK_OR_STOP_PATTERN.test(body)) errors.push("prompt contract needs explicit ask-or-stop behavior");
  if (!AUTHORIZATION_PATTERN.test(body)) errors.push("prompt contract needs an explicit action or authorization boundary");

  return errors;
}

function openAiInterfaceField(openAiYaml, field) {
  const lines = String(openAiYaml || "").replace(/\r\n/gu, "\n").split("\n");
  let inInterface = false;
  for (const line of lines) {
    if (/^interface:\s*$/u.test(line)) {
      inInterface = true;
      continue;
    }
    if (inInterface && /^\S/u.test(line)) break;
    if (!inInterface) continue;
    const match = line.match(new RegExp(`^ {2}${field}:\\s*(.+?)\\s*$`, "u"));
    if (!match) continue;
    return match[1].replace(/^(["'])(.*)\1$/u, "$2");
  }
  return "";
}

export function evaluateSkillPromptEvalInventory(skills, promptEvalPath) {
  const errors = [];
  const inventory = readJson(promptEvalPath, null);
  const activeNames = skills
    .filter((skill) => isActiveGovernedSkill(skill.guanlan?.status))
    .map((skill) => skill.name);
  const requiredCases = ["direct", "indirect", "incomplete", "negative", "edge"];
  if (!activeNames.length) return { errors, covered: 0, total: 0 };
  if (!inventory || !Array.isArray(inventory.skills)) {
    return { errors: ["skill-trigger-evals.json missing or invalid"], covered: 0, total: activeNames.length };
  }
  if (inventory.schema_version !== 1) {
    errors.push("skill-trigger-evals.json schema_version must be 1");
  }
  if (inventory.prompt_contract !== GUANLAN_PROMPT_CONTRACT) {
    errors.push(`skill-trigger-evals.json prompt_contract must be ${GUANLAN_PROMPT_CONTRACT}`);
  }
  const expectedCases = {
    direct: "trigger",
    indirect: "trigger",
    incomplete: "trigger_and_resolve_or_ask",
    negative: "do_not_trigger",
    edge: "trigger_and_enforce_boundary",
  };
  for (const [key, expected] of Object.entries(expectedCases)) {
    if (inventory.case_expectations?.[key] !== expected) {
      errors.push(`skill-trigger-evals.json case_expectations.${key} must be ${expected}`);
    }
  }
  const seen = new Set();
  const rows = new Map();
  for (const row of inventory.skills) {
    const name = String(row?.skill || "").trim();
    if (!name) {
      errors.push("skill-trigger-evals.json contains a row without skill");
      continue;
    }
    if (seen.has(name)) errors.push(`skill-trigger-evals.json duplicates ${name}`);
    seen.add(name);
    rows.set(name, row);
  }
  let covered = 0;
  for (const name of activeNames) {
    const row = rows.get(name);
    if (!row) {
      errors.push(`skill-trigger-evals.json missing ${name}`);
      continue;
    }
    const missing = requiredCases.filter((key) => !String(row[key] || "").trim());
    if (missing.length) errors.push(`skill-trigger-evals.json ${name} missing ${missing.join(", ")}`);
    else covered += 1;
  }
  for (const name of rows.keys()) {
    if (!activeNames.includes(name)) errors.push(`skill-trigger-evals.json has unmanaged skill ${name}`);
  }
  return { errors, covered, total: activeNames.length };
}

export function evaluateSkillSemantics(skill) {
  const errors = [];
  const skillText = readText(skill.skillPath).replace(/\r\n/gu, "\n");
  const ruleText = collectRuleFiles(skill.dir)
    .map((file) => readText(path.join(skill.dir, file)))
    .join("\n");
  if (/RAW[-‑ ]?V3(?:\.0)?/iu.test(ruleText)) {
    errors.push("active rule assets still claim a RAW-V3 contract; use the current RawDocument/V4 contract");
  }
  if (/\uFFFD/u.test(ruleText)) errors.push("rule assets contain Unicode replacement characters");
  if (MOJIBAKE_PATTERN.test(ruleText)) errors.push("rule assets contain likely mojibake or replacement text");
  if (skill.name === "follow-builders" && /OpenClaw|Telegram|Resend|crontab|CLAUDE_SKILL_DIR|~\/\.follow-builders/iu.test(skillText)) {
    errors.push("WaveSight follow-builders contains generic agent onboarding, delivery, or scheduler rules");
  }
  errors.push(...evaluateSkillPromptContract(skill));
  return errors;
}

export function evaluateSkillOps(paths = defaultPaths(), options = {}) {
  const skills = readGovernedSkills(paths.projectSkillDir);
  const version = readSkillStoreVersion(paths);
  const errors = [];
  const runtimeRows = [];
  const compatibilityRows = [];
  const repoRuntimeSkillDir = paths.repoRuntimeSkillDir || path.join(paths.root || process.cwd(), ".agents", "skills");
  const requireCompatibilityStore = options.requireCompatibilityStore
    ?? process.env.GUANLAN_REQUIRE_SKILL_STORE === "1";
  const currentSkills = skills.filter((skill) => isActiveGovernedSkill(skill.guanlan.status));
  const laneOwners = skills.filter((skill) => /lane owner/i.test(String(skill.guanlan.status || "")));
  const promptEvalPath = paths.promptEvalPath || path.join(paths.projectSkillDir, "skill-trigger-evals.json");
  const promptEvalResult = evaluateSkillPromptEvalInventory(skills, promptEvalPath);

  if (!skills.length) errors.push("No governed Guanlan skills found.");
  errors.push(...promptEvalResult.errors);
  if (!/^\d+\.\d+\.\d+$/.test(String(version.version || ""))) {
    errors.push("skill-store-version.json version must be semver");
  }

  for (const skill of skills) {
    const meta = skill.guanlan;
    const prefix = skill.name;
    const openAiYamlPath = path.join(skill.dir, "agents", "openai.yaml");
    if (!skill.hasSkillMd) errors.push(`${prefix}: SKILL.md missing`);
    if (skill.frontmatter.name !== skill.name) errors.push(`${prefix}: frontmatter name must match folder name`);
    if (!skill.frontmatter.description) errors.push(`${prefix}: description missing`);
    if (!/^\d+\.\d+\.\d+$/.test(String(meta.version || ""))) errors.push(`${prefix}: metadata.guanlan.version must be semver`);
    for (const field of ["lane", "status", "responsibility", "upstream", "downstream", "gates"]) {
      if (!meta[field]) errors.push(`${prefix}: metadata.guanlan.${field} missing`);
    }
    if (isActiveGovernedSkill(meta.status)) {
      if (!skill.evalFiles.length) errors.push(`${prefix}: current skill needs evals/`);
      if (!skill.exampleFiles.length) errors.push(`${prefix}: current skill needs examples/`);
      if (meta.memory_required === true && !skill.hasMemory) errors.push(`${prefix}: memory_required=true but MEMORY.md missing`);
      if (!exists(openAiYamlPath)) errors.push(`${prefix}: active governed skill needs agents/openai.yaml`);
      for (const error of evaluateSkillSemantics(skill)) errors.push(`${prefix}: ${error}`);
    }
    if (exists(openAiYamlPath)) {
      const openAiYaml = readText(openAiYamlPath).replace(/\r\n/g, "\n");
      if (!openAiYaml) errors.push(`${prefix}: agents/openai.yaml is unreadable or empty`);
      if (!/^interface:\s*$/mu.test(openAiYaml)) errors.push(`${prefix}: agents/openai.yaml needs an interface mapping`);
      for (const field of ["display_name", "short_description", "default_prompt"]) {
        if (!new RegExp(`^ {2}${field}:\\s*\\S`, "mu").test(openAiYaml)) {
          errors.push(`${prefix}: agents/openai.yaml interface.${field} missing`);
        }
      }
      const defaultPrompt = openAiInterfaceField(openAiYaml, "default_prompt");
      if (!new RegExp(`\\$${skill.name}(?:\\b|$)`, "u").test(defaultPrompt)) {
        errors.push(`${prefix}: agents/openai.yaml interface.default_prompt must mention $${skill.name}`);
      }
      if (/\uFFFD/u.test(openAiYaml)) errors.push(`${prefix}: agents/openai.yaml contains invalid replacement characters`);
      if (!/^policy:\s*$(?:\n|.)*^ {2}allow_implicit_invocation:\s*(?:true|false)\s*$/mu.test(openAiYaml)) {
        errors.push(`${prefix}: agents/openai.yaml must declare policy.allow_implicit_invocation as true or false`);
      }
      if (isActiveGovernedSkill(meta.status) && !/^ {2}allow_implicit_invocation:\s*true\s*$/mu.test(openAiYaml)) {
        errors.push(`${prefix}: active governed Skill must allow implicit discovery for indirect trigger cases`);
      }
    }
    const runtime = compareSkill(skill.name, {
      projectSkillDir: paths.projectSkillDir,
      storeDir: repoRuntimeSkillDir,
    });
    runtimeRows.push({ skill: skill.name, state: runtime.state });
    if (runtime.state !== "synced") errors.push(`${prefix}: repo Skill runtime sync state is ${runtime.state}`);

    if (meta.mirrored_in_skill_store !== false) {
      const compatibility = compareSkill(skill.name, paths);
      compatibilityRows.push({ skill: skill.name, state: compatibility.state });
      if (requireCompatibilityStore && compatibility.state !== "synced") {
        errors.push(`${prefix}: compatibility .skill-store sync state is ${compatibility.state}`);
      }
    }
  }

  let registryState = "missing";
  if (exists(paths.registryPath)) {
    const current = normalizeRegistry(readText(paths.registryPath));
    const expected = normalizeRegistry(renderRegistryMarkdown(skills));
    registryState = current === expected ? "current" : "stale";
    if (registryState !== "current") errors.push("skill-registry.md is stale; run npm run build:skill-registry");
  } else {
    errors.push("skill-registry.md missing; run npm run build:skill-registry");
  }

  const evalReady = currentSkills.filter((skill) => skill.evalFiles.length).length;
  const exampleReady = currentSkills.filter((skill) => skill.exampleFiles.length).length;
  const promptReady = currentSkills.filter((skill) => evaluateSkillPromptContract(skill).length === 0).length;
  const openAiMetadataReady = currentSkills.filter((skill) => exists(path.join(skill.dir, "agents", "openai.yaml"))).length;
  const implicitDiscoveryReady = currentSkills.filter((skill) => /^ {2}allow_implicit_invocation:\s*true\s*$/mu.test(
    readText(path.join(skill.dir, "agents", "openai.yaml")),
  )).length;
  const memoryMissing = currentSkills.filter((skill) => skill.guanlan.memory_required === true && !skill.hasMemory);
  const syncDrift = runtimeRows.filter((row) => row.state !== "synced");
  const compatibilitySyncDrift = compatibilityRows.filter((row) => row.state !== "synced");

  return {
    ok: errors.length === 0,
    status: errors.length ? "failed" : "passed",
    errors,
    version,
    summary: {
      skillStoreVersion: version.version || "",
      governed: skills.length,
      current: currentSkills.length,
      laneOwners: laneOwners.length,
      registryState,
      mirrored: runtimeRows.length,
      syncDrift: syncDrift.length,
      compatibilityMirrored: compatibilityRows.length,
      compatibilitySyncDrift: compatibilitySyncDrift.length,
      compatibilityRequired: requireCompatibilityStore,
      evalCoverage: currentSkills.length ? Math.round(evalReady / currentSkills.length * 100) : 0,
      exampleCoverage: currentSkills.length ? Math.round(exampleReady / currentSkills.length * 100) : 0,
      promptContract: GUANLAN_PROMPT_CONTRACT,
      promptContractCoverage: currentSkills.length ? Math.round(promptReady / currentSkills.length * 100) : 0,
      openAiMetadataCoverage: currentSkills.length ? Math.round(openAiMetadataReady / currentSkills.length * 100) : 0,
      implicitDiscoveryCoverage: currentSkills.length ? Math.round(implicitDiscoveryReady / currentSkills.length * 100) : 0,
      promptEvalInventoryCoverage: promptEvalResult.total ? Math.round(promptEvalResult.covered / promptEvalResult.total * 100) : 0,
      memoryRequiredMissing: memoryMissing.length,
    },
    sync: runtimeRows,
    compatibilitySync: compatibilityRows,
  };
}

function normalizeRegistry(content = "") {
  return String(content)
    .replace(/\r\n/g, "\n")
    .replace(/^Last updated:\s*.*$/mu, "Last updated: <date>");
}

export function evalCoverage(skill) {
  return [
    `evals ${skill.evalFiles.length}`,
    `examples ${skill.exampleFiles.length}`,
    `memory ${skill.hasMemory ? "yes" : "no"}`,
    `references ${skill.referenceFiles.length ? "yes" : "no"}`,
  ].join("; ");
}

function safeCell(value) {
  return String(value ?? "").replace(/\r?\n/g, " ").replace(/\|/g, "/").trim() || "-";
}

function latestMemoryLine(skill) {
  const memory = readText(path.join(skill.dir, "MEMORY.md"));
  const line = memory.split(/\r?\n/).find((item) => /^-\s+/.test(item.trim()));
  return line ? line.trim().replace(/^-\s+/, "") : "";
}

export function renderRegistryMarkdown(skills, date = new Date(), version = readSkillStoreVersion()) {
  const dateText = formatDate(date);
  const versionText = version.version ? `v${version.version}` : "unversioned";
  const releaseText = version.release_date ? ` (${version.release_date})` : "";
  const rows = skills.map((skill) => {
    const meta = skill.guanlan;
    return [
      `\`${skill.name}\``,
      meta.responsibility || skill.frontmatter.description || "",
      meta.lane || "",
      meta.status || "",
      meta.upstream || "",
      meta.downstream || "",
      meta.gates || "",
      evalCoverage(skill),
      meta.recent_learning || latestMemoryLine(skill),
      meta.mirrored_in_skill_store === false ? "no" : "yes",
    ].map(safeCell);
  });

  return `# Guanlan Skill Registry

Last updated: ${dateText}

Skill Store version: ${versionText}${releaseText}

Generated from \`SKILL.md\` metadata by \`npm run build:skill-registry\`. Do not edit the table by hand; edit the target skill metadata, evals, examples, or MEMORY instead, then regenerate.

## Current Skills

| Skill | Current responsibility | Lane | Status | Upstream | Downstream | Main gates | Eval coverage | Recent failure learning | Mirrored in \`.skill-store\` |
|---|---|---|---|---|---|---|---|---|---|
${rows.map((row) => `| ${row.join(" | ")} |`).join("\n")}

## Routing Rules

- Start with a lane owner when supervising or repairing a lane.
- Use sub-skills only after the lane owner identifies the failing stage.
- Do not let First-Line Viewpoints or Community Intelligence enter CanonicalEvents, Claims, or RELATION-V2.1. A factual promotion requires separate original-source capture and the full V4 integrity chain.
- Prefer examples and evals for recurring mistakes; add long rule text only when examples and evals are insufficient.
- Keep workflow thin: scripts handle deterministic work, skills handle judgment and boundaries, gates block unsafe outputs, context stores project-level truth.
`;
}

export function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
