import fs from "node:fs";
import os from "node:os";
import path from "node:path";

// Inventory metadata only: never execute Skill instructions or infer invocation state.
export function skillSummary(content = "") {
  const raw = content.match(/^\uFEFF?---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || "";
  const lines = raw.split(/\r?\n/u);
  const result = {};
  for (let i = 0; i < lines.length; i += 1) {
    const pair = lines[i].match(/^(name|description|license):\s*(.*)$/u);
    if (!pair) continue;
    let value = pair[2].trim();
    if (/^[|>][+-]?(?:\s+#.*)?$/u.test(value)) {
      const folded = value.startsWith(">");
      const block = [];
      while (i + 1 < lines.length && (!lines[i + 1].trim() || /^\s/u.test(lines[i + 1]))) {
        block.push(lines[++i]);
      }
      const indent = Math.min(...block.filter((line) => line.trim()).map((line) => line.match(/^\s*/u)[0].length));
      value = block.map((line) => line.slice(indent)).join("\n").trim();
      if (folded) value = value.replace(/([^\n])\n(?=[^\n])/gu, "$1 ");
    } else {
      value = value.replace(/^(["'])([\s\S]*)\1$/u, "$2");
    }
    result[pair[1]] = value;
  }
  const version = raw.match(/\bversion:\s*["']?([0-9]+(?:\.[0-9]+){1,2})["']?/u);
  if (version) result.version = version[1];
  return result;
}

export function skillDirectories(base) {
  if (!fs.existsSync(base)) return [];
  return fs.readdirSync(base, { withFileTypes: true })
    .filter((item) => item.isDirectory() && !item.name.startsWith(".") && fs.existsSync(path.join(base, item.name, "SKILL.md")))
    .map((item) => item.name).sort();
}

export function catalogConfig(projectSkillDir) {
  const file = path.join(projectSkillDir, "skill-catalog-sources.json");
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : { registrations: [], projectSources: [] };
}

export function catalogSources(config, { rootDir = process.cwd(), homeDir = os.homedir(), pluginCacheDir = process.env.GUANLAN_PLUGIN_CACHE || path.join(homeDir, ".codex", "plugins", "cache"), env = process.env } = {}) {
  const entries = [];
  const sources = [];
  for (const source of config.projectSources || []) {
    const base = env[source.environment] || (source.rootRelativePath ? path.join(rootDir, source.rootRelativePath) : path.join(homeDir, source.homeRelativePath));
    const names = skillDirectories(base);
    sources.push({ id: source.id, label: source.label, available: fs.existsSync(base), count: names.length, platformId: source.platformId || "shared", required: source.required !== false });
    for (const name of names) entries.push({ name, dir: path.join(base, name), sourceKind: "external-project", sourceLabel: source.label, sourcePath: `${source.id}/${name}`, category: source.category, sourceVersion: "", platformId: source.platformId || "shared" });
  }
  if (config.includePluginCache) {
    // Cached != installed or enabled. One latest cached version per marketplace/plugin.
    const marketplaces = fs.existsSync(pluginCacheDir) ? fs.readdirSync(pluginCacheDir, { withFileTypes: true }).filter((item) => item.isDirectory()) : [];
    for (const marketplace of marketplaces) {
      const marketDir = path.join(pluginCacheDir, marketplace.name);
      for (const plugin of fs.readdirSync(marketDir, { withFileTypes: true }).filter((item) => item.isDirectory())) {
        const pluginDir = path.join(marketDir, plugin.name);
        const versions = fs.readdirSync(pluginDir, { withFileTypes: true })
          .filter((item) => item.isDirectory() && /^\d+(?:\.\d+)+$/u.test(item.name))
          .map((item) => item.name).sort((a, b) => b.localeCompare(a, "en", { numeric: true }));
        const version = versions[0];
        if (!version) continue;
        const base = path.join(pluginDir, version, "skills");
        for (const folder of skillDirectories(base)) {
          const dir = path.join(base, folder);
          const meta = skillSummary(fs.readFileSync(path.join(dir, "SKILL.md"), "utf8"));
          entries.push({ name: `${plugin.name}@${marketplace.name}:${meta.name || folder}`, dir, sourceKind: "plugin-cache", sourceLabel: `${plugin.name} / ${marketplace.name}`, sourcePath: `plugin-cache/${marketplace.name}/${plugin.name}/${version}/skills/${folder}`, category: "Plugin Skills", sourceVersion: version });
        }
      }
    }
    sources.push({ id: "plugin-cache", label: "插件缓存（不代表当前启用）", available: fs.existsSync(pluginCacheDir), count: entries.filter((entry) => entry.sourceKind === "plugin-cache").length });
  }
  return { entries, sources };
}

export function skillPlatformIds(config, name, external) {
  if (external?.platformId) return [external.platformId];
  const ids = (config.platforms || []).filter((platform) => platform.skillNames?.includes(name)).map((platform) => platform.id);
  return ids.length ? ids : ["shared"];
}

export function platformCoverage(config, skills, sources) {
  return (config.platforms || []).map((platform) => ({
    id: platform.id, label: platform.label,
    count: skills.filter((skill) => skill.platformIds?.includes(platform.id)).length,
    sharedCount: skills.filter((skill) => skill.platformIds?.includes(platform.id) && skill.sourceKind !== "external-project").length,
    projectCount: skills.filter((skill) => skill.platformIds?.includes(platform.id) && skill.sourceKind === "external-project").length,
    sources: sources.filter((source) => source.platformId === platform.id),
  }));
}
