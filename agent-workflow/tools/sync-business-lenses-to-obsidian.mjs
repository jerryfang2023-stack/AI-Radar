#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataFile = path.join(root, "01-SiteV2", "site", "data", "v3-data-observation-desk.json");
const payload = JSON.parse(fs.readFileSync(dataFile, "utf8"));
const node = process.execPath;

function datesFor(field) {
  return [...new Set((payload[field] || []).map((item) => item.date).filter(Boolean))].sort().reverse();
}

function run(script, date) {
  const output = execFileSync(node, [script, `--date=${date}`], {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  return JSON.parse(output);
}

const fde = datesFor("enterpriseAiTransformation").map((date) => run("agent-workflow/tools/sync-enterprise-ai-fde-to-obsidian.mjs", date));
const aiHardware = datesFor("aiHardwareSignals").map((date) => run("agent-workflow/tools/sync-ai-hardware-to-obsidian.mjs", date));

console.log(JSON.stringify({
  ok: true,
  fde: { dates: fde.length, items: fde.reduce((sum, result) => sum + result.items, 0) },
  aiHardware: { dates: aiHardware.length, items: aiHardware.reduce((sum, result) => sum + result.items, 0), missingRaw: aiHardware.reduce((sum, result) => sum + result.missingRaw, 0) },
}, null, 2));
