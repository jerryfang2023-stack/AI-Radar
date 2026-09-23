import fs from "node:fs";
import { fileURLToPath } from "node:url";

// Node resolves imported modules through junctions/symlinks, but argv retains
// the caller's path. Compare physical files, never the two path spellings.
export function isMainModule(moduleUrl, entryPath = process.argv[1]) {
  if (!entryPath) return false;
  try {
    const normalize = (value) => process.platform === "win32" ? value.toLowerCase() : value;
    return normalize(fs.realpathSync.native(entryPath)) === normalize(fs.realpathSync.native(fileURLToPath(moduleUrl)));
  } catch (error) {
    if (error.code === "ENOENT" || error.code === "ENOTDIR") return false;
    throw error;
  }
}
