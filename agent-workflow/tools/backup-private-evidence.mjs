#!/usr/bin/env node

import { buildPrivateEvidenceBackup } from "./lib/private-evidence-backup.mjs";
import { resolvePrivateEvidenceBackupRoot } from "./private-evidence-backup-paths.mjs";

const root = process.cwd();
const backupRoot = resolvePrivateEvidenceBackupRoot(root);
const result = buildPrivateEvidenceBackup({ root, backupRoot });

console.log(JSON.stringify({
  ok: true,
  backupRoot,
  ...result,
}, null, 2));
