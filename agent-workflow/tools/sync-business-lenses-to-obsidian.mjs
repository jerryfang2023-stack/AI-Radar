#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const node = process.execPath;

function datesFor(name) {
  return fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .filter((date) => {
      const file = path.join(dataRoot, date, `${name}.json`);
      return fs.existsSync(file) && JSON.parse(fs.readFileSync(file, "utf8")).length > 0;
    })
    .sort().reverse();
}

function run(script, date, extraArgs = []) {
  const output = execFileSync(node, [script, `--date=${date}`, ...extraArgs], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  return JSON.parse(output);
}

const fdeDates = datesFor("fde-records");
const hardwareDates = datesFor("hardware-records");
const fde = fdeDates.map((date) => run("agent-workflow/tools/sync-enterprise-ai-fde-to-obsidian.mjs", date, ["--skip-index=true"]));
const aiHardware = hardwareDates.map((date) => run("agent-workflow/tools/sync-ai-hardware-to-obsidian.mjs", date, ["--skip-index=true"]));
if (fdeDates.length) run("agent-workflow/tools/sync-enterprise-ai-fde-to-obsidian.mjs", fdeDates[0]);
if (hardwareDates.length) run("agent-workflow/tools/sync-ai-hardware-to-obsidian.mjs", hardwareDates[0]);

console.log(JSON.stringify({
  ok: true,
  source: "Data Center V4 daily bundles",
  fde: { dates: fde.length, items: fde.reduce((sum, result) => sum + result.items, 0) },
  aiHardware: { dates: aiHardware.length, items: aiHardware.reduce((sum, result) => sum + result.items, 0), missingRaw: 0 }
}, null, 2));
