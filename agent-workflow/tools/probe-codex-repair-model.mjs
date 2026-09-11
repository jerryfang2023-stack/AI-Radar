#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { repairModel, repairModelArgs } from "./lib/codex-repair-model.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "guanlan-repair-model-"));
const configDir = path.join(temp, ".codex");
fs.mkdirSync(configDir);
const configFile = path.join(configDir, "config.toml");
const outputFile = path.join(temp, "result.txt");
fs.writeFileSync(configFile, 'model = "gpt-5.5"\nmodel_reasoning_effort = "low"\n');
const started = Date.now();
let report;
try {
  const run = spawnSync(process.env.CODEX_CLI_PATH || "codex", [
    "exec", "--ephemeral", "--skip-git-repo-check", ...repairModelArgs(),
    "--sandbox", "read-only", "--output-last-message", outputFile, "--cd", temp, "-",
  ], { input: "This is a model startup probe. Do not use tools or read files. Reply exactly ASTRA_PROBE_OK.",
    encoding: "utf8", windowsHide: true, timeout: 180000, maxBuffer: 4 * 1024 * 1024 });
  const header = `${run.stderr || ""}\n${run.stdout || ""}`;
  const actualModel = header.match(/^model:\s*(\S+)/m)?.[1] || "";
  const actualEffort = header.match(/^reasoning effort:\s*(\S+)/m)?.[1] || "";
  const reply = fs.existsSync(outputFile) ? fs.readFileSync(outputFile, "utf8").trim() : "";
  const passed = run.status === 0 && actualModel === repairModel.model && actualEffort === repairModel.effort && reply === "ASTRA_PROBE_OK";
  report = { passed, actualModel, actualEffort, reply, exitCode: run.status, error: run.error?.message || "" };
} finally {
  for (const file of [configFile, outputFile]) if (fs.existsSync(file)) fs.unlinkSync(file);
  fs.rmdirSync(configDir);
  try { fs.rmdirSync(temp); } catch { /* Preserve unexpected files. */ }
}
report = { generatedAt: new Date().toISOString(), expected: repairModel, conflictingProjectModel: "gpt-5.5", durationMs: Date.now() - started, ...report };
fs.writeFileSync(path.join(root, "agent-workflow/reports/codex-repair-model-probe-latest.json"), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report));
if (!report.passed) process.exitCode = 1;
