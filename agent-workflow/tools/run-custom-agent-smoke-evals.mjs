#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const execute = process.argv.includes("--execute");
const agentDir = path.join(root, ".codex", "agents");
const casesPath = path.join(root, "agent-workflow", "model-evals", "custom-agent-smoke-cases.json");
const selectedAgent = process.argv.find((arg) => arg.startsWith("--agent="))?.slice("--agent=".length) || "";
const allCases = JSON.parse(fs.readFileSync(casesPath, "utf8"));
const cases = selectedAgent ? allCases.filter((item) => item.agent === selectedAgent) : allCases;
const errors = [];

if (!cases.length) errors.push(`Unknown custom Agent: ${selectedAgent}`);

function quotedValue(source, key) {
  return source.match(new RegExp(`^${key}\\s*=\\s*"([^"]+)"`, "mu"))?.[1] || "";
}

for (const smokeCase of cases) {
  const configPath = path.join(agentDir, `${smokeCase.agent}.toml`);
  if (!fs.existsSync(configPath)) {
    errors.push(`${smokeCase.agent}: custom Agent config missing`);
    continue;
  }
  const config = fs.readFileSync(configPath, "utf8");
  for (const key of ["name", "description", "model", "model_reasoning_effort", "sandbox_mode", "developer_instructions"]) {
    if (!new RegExp(`^${key}\\s*=`, "mu").test(config)) errors.push(`${smokeCase.agent}: ${key} missing`);
  }
  if (quotedValue(config, "name") !== smokeCase.agent) errors.push(`${smokeCase.agent}: name does not match filename`);
  if (quotedValue(config, "sandbox_mode") !== "read-only") errors.push(`${smokeCase.agent}: sandbox_mode must be read-only`);
  if (!fs.existsSync(path.join(root, smokeCase.target))) errors.push(`${smokeCase.agent}: target missing: ${smokeCase.target}`);
}

if (errors.length || !execute) {
  if (errors.length) {
    for (const error of errors) console.error(`ERROR ${error}`);
    process.exit(1);
  }
  console.log(`Custom Agent smoke preflight passed: ${cases.length} read-only Agent configs.`);
  process.exit(0);
}

function resolveCodexCli() {
  if (process.env.CODEX_CLI_PATH && fs.existsSync(process.env.CODEX_CLI_PATH)) return process.env.CODEX_CLI_PATH;
  const configPath = path.join(process.env.USERPROFILE || "", ".codex", "config.toml");
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, "utf8");
    const configured = config.match(/^CODEX_CLI_PATH\s*=\s*'([^']+)'/mu)?.[1];
    if (configured && fs.existsSync(configured)) return configured;
  }
  return "codex";
}

function finalAgentMessage(stdout) {
  let message = "";
  for (const line of stdout.split(/\r?\n/u)) {
    if (!line.trim().startsWith("{")) continue;
    try {
      const event = JSON.parse(line);
      if (event.type === "item.completed" && event.item?.type === "agent_message") {
        message = event.item.text || "";
      }
    } catch {
      // Ignore non-event lines from the CLI.
    }
  }
  return message;
}

const cli = resolveCodexCli();
const results = [];
for (const smokeCase of cases) {
  console.error(`Running custom Agent smoke: ${smokeCase.agent}`);
  const prompt = [
    "This is a WaveSight custom Agent smoke evaluation.",
    `Explicitly delegate exactly one bounded task to the custom Agent named ${smokeCase.agent}.`,
    'Use fork_turns="none" so the custom Agent type is preserved. Wait for it to finish.',
    `The delegated task is read-only: inspect ${smokeCase.target}. ${smokeCase.question}`,
    "Do not modify files or contact external systems.",
    `Return one JSON line only: {"agent":"${smokeCase.agent}","delegated":true,"answer":"brief answer"}.`,
  ].join("\n");
  const run = spawnSync(cli, [
    "exec",
    "--ephemeral",
    "--json",
    "--sandbox",
    "read-only",
    "--model",
    "gpt-5.6-sol",
    "--config",
    'model_reasoning_effort="medium"',
    "--cd",
    root,
    "-",
  ], {
    cwd: root,
    encoding: "utf8",
    input: prompt,
    timeout: 120_000,
    windowsHide: true,
  });
  const message = finalAgentMessage(run.stdout || "");
  const timedOut = run.error?.code === "ETIMEDOUT";
  const combinedOutput = `${run.stdout || ""}\n${run.stderr || ""}`;
  const loaderErrors = combinedOutput.split(/\r?\n/u).filter((line) => /failed to load skill/iu.test(line));
  const skillBudgetWarnings = combinedOutput.split(/\r?\n/u).filter((line) => /Skill descriptions were shortened/iu.test(line));
  let payload;
  try {
    payload = JSON.parse(message);
  } catch {
    payload = null;
  }
  const passed = (run.status === 0 || timedOut)
    && payload?.agent === smokeCase.agent
    && payload?.delegated === true
    && String(payload?.answer || "").toLowerCase().includes(smokeCase.expected.toLowerCase())
    && !loaderErrors.length
    && !skillBudgetWarnings.length;
  results.push({
    agent: smokeCase.agent,
    passed,
    exitCode: run.status,
    timedOut,
    answer: payload?.answer || "",
    loaderErrors,
    skillBudgetWarnings,
  });
}

console.log(JSON.stringify({ status: results.every((item) => item.passed) ? "passed" : "failed", results }, null, 2));
if (results.some((item) => !item.passed)) process.exit(1);
