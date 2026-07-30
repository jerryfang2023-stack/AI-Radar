#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

execFileSync(process.execPath, ["agent-workflow/tools/build-guanlan-vault.mjs", ...process.argv.slice(2)], {
  cwd: process.cwd(),
  stdio: "inherit",
});
execFileSync(process.execPath, ["agent-workflow/tools/sync-guanlan-evidence.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
if (
  process.env.GUANLAN_EVIDENCE_BACKUP_ROOT
  || fs.existsSync(path.join(process.cwd(), ".evidence-backup.json"))
) {
  const evidenceBackupRoot = resolvePrivateEvidenceBackupRoot(process.cwd());
  execFileSync(process.execPath, ["agent-workflow/tools/backup-private-evidence.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  execFileSync(process.execPath, ["agent-workflow/tools/assert-private-evidence-backup.mjs"], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  if (fs.existsSync(path.join(evidenceBackupRoot, ".git"))) {
    execFileSync(process.execPath, ["agent-workflow/tools/publish-private-evidence-backup.mjs"], {
      cwd: process.cwd(),
      stdio: "inherit",
    });
  }
}
execFileSync(process.execPath, ["agent-workflow/tools/assert-guanlan-vault.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
