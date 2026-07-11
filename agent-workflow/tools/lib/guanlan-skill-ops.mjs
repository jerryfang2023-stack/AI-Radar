import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const RULE_FILES = ["SKILL.md", "MEMORY.md"];
export const RULE_DIRS = ["agents", "evals", "examples", "references"];
export const SKIP_DIRS = new Set([".git", "node_modules", ".venv", "venv", "__pycache__", ".cache", "dist", "build"]);

export function defaultPaths(root = process.cwd()) {
  return {
    root,
    storeDir: process.env.GUANLAN_SKILL_STORE || path.join(os.homedir(), ".skill-store"),
    projectSkillDir: path.join(root, "agent-workflow", "skills"),
    registryPath: path.join(root, "agent-workflow", "skills", "skill-registry.md"),
    versionPath: path.join(root, "agent-workflow", "skills", "skill-store-version.json"),
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

  return result;
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

export function evaluateSkillOps(paths = defaultPaths()) {
  const skills = readGovernedSkills(paths.projectSkillDir);
  const version = readSkillStoreVersion(paths);
  const errors = [];
  const syncRows = [];
  const currentSkills = skills.filter((skill) => isCurrentLike(skill.guanlan.status));
  const laneOwners = skills.filter((skill) => /lane owner/i.test(String(skill.guanlan.status || "")));

  if (!skills.length) errors.push("No governed Guanlan skills found.");
  if (!/^\d+\.\d+\.\d+$/.test(String(version.version || ""))) {
    errors.push("skill-store-version.json version must be semver");
  }

  for (const skill of skills) {
    const meta = skill.guanlan;
    const prefix = skill.name;
    if (!skill.hasSkillMd) errors.push(`${prefix}: SKILL.md missing`);
    if (skill.frontmatter.name !== skill.name) errors.push(`${prefix}: frontmatter name must match folder name`);
    if (!skill.frontmatter.description) errors.push(`${prefix}: description missing`);
    if (!/^\d+\.\d+\.\d+$/.test(String(meta.version || ""))) errors.push(`${prefix}: metadata.guanlan.version must be semver`);
    for (const field of ["lane", "status", "responsibility", "upstream", "downstream", "gates"]) {
      if (!meta[field]) errors.push(`${prefix}: metadata.guanlan.${field} missing`);
    }
    if (isCurrentLike(meta.status)) {
      if (!skill.evalFiles.length) errors.push(`${prefix}: current skill needs evals/`);
      if (!skill.exampleFiles.length) errors.push(`${prefix}: current skill needs examples/`);
      if (meta.memory_required === true && !skill.hasMemory) errors.push(`${prefix}: memory_required=true but MEMORY.md missing`);
    }
    if (meta.mirrored_in_skill_store !== false) {
      const compare = compareSkill(skill.name, paths);
      syncRows.push({ skill: skill.name, state: compare.state });
      if (compare.state !== "synced") errors.push(`${prefix}: .skill-store sync state is ${compare.state}`);
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
  const memoryMissing = currentSkills.filter((skill) => skill.guanlan.memory_required === true && !skill.hasMemory);
  const syncDrift = syncRows.filter((row) => row.state !== "synced");

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
      mirrored: syncRows.length,
      syncDrift: syncDrift.length,
      evalCoverage: currentSkills.length ? Math.round(evalReady / currentSkills.length * 100) : 0,
      exampleCoverage: currentSkills.length ? Math.round(exampleReady / currentSkills.length * 100) : 0,
      memoryRequiredMissing: memoryMissing.length,
    },
    sync: syncRows,
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
- Do not let First-Line Viewpoints or Community Intelligence evidence enter Business Signal Cards, relationship graph evidence, or trend candidates without separate Raw / Pool verification.
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
