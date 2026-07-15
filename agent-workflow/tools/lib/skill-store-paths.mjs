import fs from "node:fs";
import path from "node:path";

function canonicalPath(target) {
  const resolved = path.resolve(target);
  try {
    return fs.realpathSync.native(resolved);
  } catch {
    return resolved;
  }
}

function samePath(left, right) {
  const normalize = (value) => process.platform === "win32" ? value.toLowerCase() : value;
  return normalize(canonicalPath(left)) === normalize(canonicalPath(right));
}

export function resolveSkillStoreRoot(configuredStore, homeDir) {
  const resolved = path.resolve(configuredStore || path.join(homeDir, ".skill-store"));
  if (samePath(resolved, path.parse(resolved).root) || samePath(resolved, homeDir)) {
    throw new Error("unsafe skill store root");
  }
  return resolved;
}

export function resolveSkillStoreTrashRoot(storeDir) {
  return path.resolve(storeDir, ".trash");
}

export function resolveSkillStoreEntry(storeDir, name) {
  if (!/^[A-Za-z0-9._-]+$/u.test(String(name || ""))) throw new Error("invalid skill name");
  const base = path.resolve(storeDir);
  const target = path.resolve(base, name);
  if (target === base || !target.startsWith(`${base}${path.sep}`)) throw new Error("target outside .skill-store");
  return target;
}

export function isSkillStoreEntry(target) {
  try {
    return fs.statSync(target).isDirectory() && fs.statSync(path.join(target, "SKILL.md")).isFile();
  } catch {
    return false;
  }
}
