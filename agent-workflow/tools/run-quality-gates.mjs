import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const rawArgs = process.argv.slice(2);
const mode = rawArgs.find((arg) => !arg.startsWith("--")) || "syntax";
const flags = new Map(
  rawArgs
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const reportsDir = path.join(root, "agent-workflow", "reports");
const now = new Date();
const date = flags.get("date") || now.toISOString().slice(0, 10);
const stamp = now
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "")
  .replace("T", "-");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
// On some Windows environments, spawning `process.execPath` (e.g. under `C:\Program Files\...`)
// can fail with EPERM even though invoking `node` via PATH works. Prefer the PATH command on Windows.
const node = process.platform === "win32" ? "node" : process.execPath;

const knownModes = new Set(["syntax", "content", "point", "site", "automation", "all"]);

if (!knownModes.has(mode)) {
  console.error(`Unknown quality gate mode: ${mode}`);
  console.error(`Use one of: ${[...knownModes].join(", ")}`);
  process.exit(1);
}

const commandSets = {
  syntax: [
    [node, ["--check", "04-Site/scripts/sync-data.mjs"], "sync-data syntax"],
    [node, ["--check", "04-Site/scripts/check-relations.mjs"], "check-relations syntax"],
    [node, ["--check", "04-Site/scripts/check-point-quality.mjs"], "check-point-quality syntax"],
    [node, ["--check", "04-Site/js/app.js"], "frontend app syntax"],
    [node, ["--check", "agent-workflow/tools/unified-site-sync.mjs"], "unified-site-sync syntax"],
    [node, ["--check", "agent-workflow/tools/run-quality-gates.mjs"], "run-quality-gates syntax"],
  ],
  content: [
    [node, ["--check", "04-Site/scripts/sync-data.mjs"], "sync-data syntax"],
    [node, ["--check", "04-Site/scripts/check-relations.mjs"], "check-relations syntax"],
    [node, ["04-Site/scripts/sync-data.mjs"], "sync data"],
    [node, ["04-Site/scripts/check-relations.mjs"], "check relations"],
  ],
  point: [
    [node, ["--check", "04-Site/scripts/check-point-quality.mjs"], "check-point-quality syntax"],
    [node, ["04-Site/scripts/check-point-quality.mjs"], "check The Point quality"],
  ],
  site: [
    [node, ["--check", "04-Site/js/app.js"], "frontend app syntax"],
  ],
};

const buildCommands = () => {
  if (mode === "all") {
    return [
      ...commandSets.syntax,
      [node, ["04-Site/scripts/sync-data.mjs"], "sync data"],
      [node, ["04-Site/scripts/check-relations.mjs"], "check relations"],
      [node, ["04-Site/scripts/check-point-quality.mjs"], "check The Point quality"],
    ];
  }

  if (mode === "automation") {
    const commands = [[node, ["--check", "agent-workflow/tools/unified-site-sync.mjs"], "unified-site-sync syntax"]];
    if (flags.get("run-sync-gate") === "true") {
      commands.push([
        node,
        ["agent-workflow/tools/unified-site-sync.mjs", `--date=${date}`],
        "run unified site sync gate",
      ]);
    }
    return commands;
  }

  return commandSets[mode] || [];
};

const runCommand = ([cmd, args, label]) => {
  const startedAt = new Date();
  const result = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    shell: false,
  });
  return {
    label,
    command: [cmd, ...args].join(" "),
    status: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
    startedAt,
    endedAt: new Date(),
  };
};

const tail = (text) => {
  const lines = String(text || "")
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  return lines.slice(-6).join(" / ") || "-";
};

const writeReport = (runs) => {
  fs.mkdirSync(reportsDir, { recursive: true });
  const failed = runs.filter((run) => run.status !== 0);
  const status = failed.length ? "failed" : "passed";
  const automationNote =
    mode === "automation" && flags.get("run-sync-gate") !== "true"
      ? "\n- 自动化模式默认只检查统一同步闸门脚本语法；如需真实运行，使用 `--run-sync-gate`。"
      : "";

  const commandLines = runs
    .map(
      (run, index) => `### ${index + 1}. ${run.label}

- 命令：\`${run.command}\`
- 状态：${run.status === 0 ? "passed" : "failed"} (${run.status})
- stdout：${tail(run.stdout)}
- stderr：${tail(run.stderr)}
`
    )
    .join("\n");

  const report = `# Quality Gates Report

生成时间：${now.toLocaleString("zh-CN", { hour12: false })}

## 结论

- 模式：${mode}
- 日期参数：${date}
- 状态：${status}
- 检查项：${runs.length}
- 失败项：${failed.length}${automationNote}

## 检查明细

${commandLines || "无"}

## 说明

- 本脚本是 \`quality-gates.md\` 的统一入口。
- \`content\` 和 \`all\` 会运行 \`sync-data.mjs\`，可能更新 \`04-Site/data/radar-data.json\` 与 \`radar-data.js\`。
- \`automation\` 默认不真实运行统一同步闸门；需要显式传 \`--run-sync-gate\`。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 QA Agent 单独验收。
`;

  const datedPath = path.join(reportsDir, `quality-gates-${mode}-${date}-${stamp}.md`);
  const latestPath = path.join(reportsDir, `quality-gates-${mode}-latest.md`);
  fs.writeFileSync(datedPath, report, "utf8");
  fs.writeFileSync(latestPath, report, "utf8");
  return { status, failed, report, datedPath, latestPath };
};

const runs = buildCommands().map(runCommand);
const { status, failed, report, datedPath } = writeReport(runs);

console.log(report);
console.log(`Report: ${rel(datedPath)}`);

if (status !== "passed") {
  process.exitCode = failed[0]?.status || 1;
}
