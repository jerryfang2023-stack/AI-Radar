#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
if (
  process.env.GUANLAN_EVIDENCE_BACKUP_ROOT
  || fs.existsSync(path.join(process.cwd(), ".evidence-backup.json"))
) {
  execFileSync(process.execPath, ["agent-workflow/tools/backup-private-evidence.mjs"], {
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
