#!/usr/bin/env node

import { execFileSync } from "node:child_process";

execFileSync(process.execPath, ["agent-workflow/tools/build-guanlan-vault.mjs", ...process.argv.slice(2)], {
  cwd: process.cwd(),
  stdio: "inherit",
});
execFileSync(process.execPath, ["agent-workflow/tools/assert-guanlan-vault.mjs"], {
  cwd: process.cwd(),
  stdio: "inherit",
});
