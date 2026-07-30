#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { OBSIDIAN_PATHS } from "./obsidian-vault-paths.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

const reportsDir = path.join(root, "agent-workflow", "reports");
const logFile = path.join(reportsDir, `${date}-local-obsidian-sync.md`);
const commands = [
  ["node", ["agent-workflow/tools/build-data-center-v4-obsidian-index.mjs"]],
  ["node", ["agent-workflow/tools/sync-funding-insights-to-obsidian.mjs"]],
  ["node", ["agent-workflow/tools/sync-business-lenses-to-obsidian.mjs"]],
  ["node", ["agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs"]],
  ["node", ["01-SiteV2/site/scripts/archive-community-intelligence.mjs"]],
];

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function writeLog(lines) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.writeFileSync(logFile, `${lines.join("\n").trimEnd()}\n`, "utf8");
}

function main() {
  const lines = [
    `# WaveSight Obsidian Vault Sync`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- date: ${date}`,
    `- vault: ${OBSIDIAN_PATHS.home.split("/", 1)[0]}`,
    "",
  ];

  for (const [command, commandArgs] of commands) {
    const label = `${command} ${commandArgs.join(" ")}`;
    lines.push(`## ${label}`, "");
    try {
      const output = execFileSync(command, commandArgs, {
        cwd: root,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
        maxBuffer: 200 * 1024 * 1024,
      });
      if (output.trim()) lines.push("```text", output.trimEnd(), "```", "");
    } catch (error) {
      const stdout = String(error.stdout || "").trimEnd();
      const stderr = String(error.stderr || "").trimEnd();
      if (stdout) lines.push("```text", stdout, "```", "");
      if (stderr) lines.push("```text", stderr, "```", "");
      lines.push(`- failed: ${error.message}`, "");
      writeLog(lines);
      console.log(JSON.stringify({
        ok: false,
        date,
        report: rel(logFile),
        failed_command: label,
      }, null, 2));
      process.exit(1);
    }
  }

  lines.push(
    "## Synced Assets",
    "",
    `- \`${OBSIDIAN_PATHS.dataCenterIndex}\``,
    `- \`${OBSIDIAN_PATHS.fundingInsightsRoot}/\``,
    `- \`${OBSIDIAN_PATHS.fdeRoot}/\``,
    `- \`${OBSIDIAN_PATHS.hardwareRoot}/\``,
    `- \`${OBSIDIAN_PATHS.viewpointsRoot}/\``,
    `- \`${OBSIDIAN_PATHS.communityRoot}/\``,
    "",
  );

  writeLog(lines);
  console.log(JSON.stringify({
    ok: true,
    date,
    report: rel(logFile),
    synced_assets: [
      OBSIDIAN_PATHS.dataCenterIndex,
      `${OBSIDIAN_PATHS.fundingInsightsRoot}/`,
      `${OBSIDIAN_PATHS.fdeRoot}/`,
      `${OBSIDIAN_PATHS.hardwareRoot}/`,
      `${OBSIDIAN_PATHS.viewpointsRoot}/`,
      `${OBSIDIAN_PATHS.communityRoot}/`,
    ],
  }, null, 2));
}

main();
