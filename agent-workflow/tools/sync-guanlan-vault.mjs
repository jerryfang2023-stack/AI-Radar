#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";
if (
  process.env.GUANLAN_EVIDENCE_BACKUP_ROOT
  || fs.existsSync(path.join(process.cwd(), ".evidence-backup.json"))
) {
  execFileSync(process.execPath, ["agent-workflow/tools/assert-private-evidence-remote.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  execFileSync(process.execPath, ["agent-workflow/tools/backup-private-evidence.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  const backupRoot = resolvePrivateEvidenceBackupRoot(process.cwd());
  const manifest = JSON.parse(fs.readFileSync(path.join(backupRoot, "manifest.json"), "utf8"));
  const productionDate = String(manifest.productionReferenceDate || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(productionDate)) {
    throw new Error("Private evidence manifest is missing a valid productionReferenceDate");
  }
  execFileSync(process.execPath, [
    "agent-workflow/tools/assert-private-evidence-backup.mjs",
    `--date=${productionDate}`,
  ], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  execFileSync(process.execPath, [
    "agent-workflow/tools/migrate-private-evidence-source.mjs",
    "--delete-public-originals=true",
  ], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  execFileSync(process.execPath, ["agent-workflow/tools/assert-private-evidence-backup.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  execFileSync(process.execPath, ["agent-workflow/tools/assert-public-evidence-boundary.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
}
execFileSync(process.execPath, ["agent-workflow/tools/build-guanlan-vault.mjs", ...process.argv.slice(2)], {
  cwd: process.cwd(),
  stdio: "inherit",
});
execFileSync(process.execPath, ["agent-workflow/tools/sync-guanlan-evidence.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
execFileSync(process.execPath, ["agent-workflow/tools/assert-guanlan-vault.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
