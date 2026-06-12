#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

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
  ["node", ["01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs"]],
  ["node", ["01-SiteV2/site/scripts/build-follow-builders-page-data.mjs"]],
  ["node", ["01-SiteV2/site/scripts/sync-pipeline-dashboard-data.mjs"]],
  ["node", ["agent-workflow/tools/export-topic-center-to-aip-md.mjs"]],
];

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function writeLog(lines) {
  fs.mkdirSync(path.dirname(logFile), { recursive: true });
  fs.writeFileSync(logFile, `${lines.join("\n")}\n`, "utf8");
}

function main() {
  const lines = [
    `# Local Obsidian Sync`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    `- date: ${date}`,
    `- workspace: ${root}`,
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
    "- `01-SiteV2/site/data/v3-data-observation-desk.json`",
    "- `01-SiteV2/site/data/intelligence-graph-index.json`",
    "- `01-SiteV2/site/data/follow-builders-daily.json`",
    "- `01-SiteV2/site/data/site-content.json`",
    "- `01-SiteV2/site/data/topic-center.json`",
    "- `01-SiteV2/site/data/topic-center.js`",
    "- `../04-AIP/01-选题库/<date>-每日选题.md`",
    "",
  );

  writeLog(lines);
  console.log(JSON.stringify({
    ok: true,
    date,
    report: rel(logFile),
    synced_assets: [
      "01-SiteV2/site/data/v3-data-observation-desk.json",
      "01-SiteV2/site/data/intelligence-graph-index.json",
      "01-SiteV2/site/data/follow-builders-daily.json",
      "01-SiteV2/site/data/site-content.json",
      "01-SiteV2/site/data/topic-center.json",
      "01-SiteV2/site/data/topic-center.js",
      "../04-AIP/01-选题库/<date>-每日选题.md",
    ],
  }, null, 2));
}

main();
