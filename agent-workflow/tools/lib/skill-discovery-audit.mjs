import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SKIP_DIRECTORIES = new Set([".git", ".venv", "venv", "node_modules", "__pycache__", ".cache", "dist", "build"]);

export function defaultSkillDiscoveryPaths(root = process.cwd(), homeDir = os.homedir()) {
  const skillStoreDir = process.env.GUANLAN_SKILL_STORE || path.join(homeDir, ".skill-store");
  return {
    root,
    configPath: process.env.GUANLAN_CODEX_CONFIG || path.join(homeDir, ".codex", "config.toml"),
    skillStoreDir,
    discoveryRoots: [
      skillStoreDir,
      process.env.GUANLAN_USER_SKILLS || path.join(homeDir, ".agents", "skills"),
      path.join(root, ".agents", "skills"),
    ],
  };
}

function skillFiles(base) {
  if (!fs.existsSync(base)) return [];
  const files = [];
  const stack = [base];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      if (entry.isDirectory() && SKIP_DIRECTORIES.has(entry.name)) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      if (entry.isFile() && entry.name === "SKILL.md") files.push(full);
    }
  }
  return files;
}

function normalized(file) {
  const resolved = path.resolve(file);
  return process.platform === "win32" ? resolved.toLowerCase() : resolved;
}

function disabledSkillPaths(configPath) {
  if (!fs.existsSync(configPath)) return new Set();
  const config = fs.readFileSync(configPath, "utf8");
  const disabled = new Set();
  for (const block of config.split(/\[\[skills\.config\]\]/u).slice(1)) {
    if (!/^enabled\s*=\s*false\s*$/mu.test(block)) continue;
    const configured = block.match(/^path\s*=\s*['"]([^'"]+)['"]\s*$/mu)?.[1];
    if (configured) disabled.add(normalized(configured));
  }
  return disabled;
}

export function auditSkillDiscovery(paths = defaultSkillDiscoveryPaths()) {
  const disabled = disabledSkillPaths(paths.configPath);
  const entries = paths.discoveryRoots.flatMap((discoveryRoot) => skillFiles(discoveryRoot).map((file) => {
    const content = fs.readFileSync(file, "utf8");
    const frontmatter = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
    const name = frontmatter.match(/^name:\s*['"]?([^\r\n'"]+)/mu)?.[1]?.trim()
      || path.basename(path.dirname(file));
    const description = frontmatter.match(/^description:\s*(?:['"]?)([^\r\n]+)/mu)?.[1]?.trim() || "";
    return {
      name,
      file,
      enabled: !disabled.has(normalized(file)),
      validManifest: Boolean(frontmatter && name && description),
    };
  }));
  const enabledEntries = entries.filter((entry) => entry.enabled);
  const invalid = entries.filter((entry) => !entry.validManifest);
  const byName = new Map();
  for (const entry of enabledEntries) {
    if (!byName.has(entry.name)) byName.set(entry.name, []);
    byName.get(entry.name).push(entry);
  }
  const duplicates = [...byName.entries()]
    .filter(([, rows]) => rows.length > 1)
    .map(([name, rows]) => ({ name, paths: rows.map((row) => row.file) }));
  const summary = {
    discovered: entries.length,
    configuredDisabled: entries.filter((entry) => !entry.enabled).length,
    enabled: enabledEntries.length,
    invalidManifests: invalid.length,
    enabledDuplicateNames: duplicates.length,
  };
  return {
    ok: invalid.length === 0 && duplicates.length === 0,
    status: invalid.length || duplicates.length ? "failed" : "passed",
    available: fs.existsSync(paths.configPath) && fs.existsSync(paths.skillStoreDir),
    summary,
    invalid,
    duplicates,
  };
}
