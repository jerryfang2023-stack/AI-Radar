import fs from "node:fs";
import path from "node:path";

export const PRIVATE_EVIDENCE_BACKUP_CONFIG = ".evidence-backup.json";

function isInside(parent, candidate) {
  const relative = path.relative(path.resolve(parent), path.resolve(candidate));
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

export function resolvePrivateEvidenceBackupRoot(root, options = {}) {
  const configFile = path.join(root, PRIVATE_EVIDENCE_BACKUP_CONFIG);
  const config = fs.existsSync(configFile)
    ? JSON.parse(fs.readFileSync(configFile, "utf8"))
    : {};
  const configured = String(
    options.backupRoot
      || process.env.GUANLAN_EVIDENCE_BACKUP_ROOT
      || config.backupRoot
      || "",
  ).trim();
  if (!configured) {
    if (options.required === false) return "";
    throw new Error(
      `Private evidence backup is not configured. Set GUANLAN_EVIDENCE_BACKUP_ROOT or create ${PRIVATE_EVIDENCE_BACKUP_CONFIG}.`,
    );
  }
  const resolved = path.resolve(configured);
  if (isInside(root, resolved) || isInside(resolved, root)) {
    throw new Error(`Private evidence backup must be outside the WaveSight repository: ${resolved}`);
  }
  return resolved;
}
