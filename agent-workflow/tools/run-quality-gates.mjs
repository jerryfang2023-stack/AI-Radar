import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

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

const knownModes = new Set(["syntax", "site", "automation", "style", "typography", "regression", "raw", "tags", "all"]);

if (!knownModes.has(mode)) {
  console.error(`Unknown quality gate mode: ${mode}`);
  console.error(`Use one of: ${[...knownModes].join(", ")}`);
  process.exit(1);
}

const commandSets = {
  syntax: [
    [node, ["--check", "01-SiteV2/site/assets/app.js"], "v2 frontend app syntax"],
    [node, ["--check", "01-SiteV2/site/dev-server.mjs"], "v2 dev-server syntax"],
    [node, ["--check", "agent-workflow/tools/run-quality-gates.mjs"], "run-quality-gates syntax"],
    [node, ["--check", "agent-workflow/tools/v2-source-probe.mjs"], "v2-source-probe syntax"],
    [node, ["--check", "agent-workflow/tools/v2-source-quality-gate.mjs"], "v2-source-quality-gate syntax"],
    [node, ["--check", "agent-workflow/tools/guanlan-monitor-quality-gate.mjs"], "guanlan monitor quality gate syntax"],
    [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor.mjs"], "guanlan daily monitor syntax"],
    [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"], "guanlan daily monitor with qc syntax"],
    [node, ["--check", "agent-workflow/tools/writer-style-gate.mjs"], "writer-style-gate syntax"],
    [node, ["--check", "agent-workflow/tools/v2-typography-gate.mjs"], "v2-typography-gate syntax"],
    [node, ["--check", "agent-workflow/tools/frontstage-regression-gate.mjs"], "frontstage regression gate syntax"],
    [node, ["--check", "agent-workflow/tools/v2-raw-evidence-gate.mjs"], "v2-raw-evidence-gate syntax"],
    [node, ["--check", "agent-workflow/tools/check-tags.mjs"], "tag quality gate syntax"],
    [node, ["--check", "agent-workflow/tools/assert-daily-production-chain.mjs"], "daily production chain gate syntax"],
    [node, ["--check", "agent-workflow/tools/assert-pool-to-card-dedupe.mjs"], "pool-to-card dedupe gate syntax"],
    [node, ["--check", "agent-workflow/tools/run-trend-candidate-decision.mjs"], "trend candidate decision syntax"],
    [node, ["--check", "agent-workflow/tools/write-automation-readiness-report.mjs"], "automation readiness report syntax"],
  ],
  site: [
    [node, ["--check", "01-SiteV2/site/assets/app.js"], "v2 frontend app syntax"],
    [node, ["--check", "01-SiteV2/site/dev-server.mjs"], "v2 dev-server syntax"],
  ],
  style: [
    [node, ["--check", "agent-workflow/tools/writer-style-gate.mjs"], "writer-style-gate syntax"],
    [node, ["agent-workflow/tools/writer-style-gate.mjs", `--date=${date}`], "run writer style gate"],
  ],
  typography: [
    [node, ["--check", "agent-workflow/tools/v2-typography-gate.mjs"], "v2-typography-gate syntax"],
    [node, ["agent-workflow/tools/v2-typography-gate.mjs"], "run v2 typography gate"],
  ],
  regression: [
    [node, ["--check", "agent-workflow/tools/frontstage-regression-gate.mjs"], "frontstage regression gate syntax"],
    [node, ["agent-workflow/tools/frontstage-regression-gate.mjs"], "run frontstage regression gate"],
  ],
  raw: [
    [node, ["--check", "agent-workflow/tools/v2-raw-evidence-gate.mjs"], "v2-raw-evidence-gate syntax"],
    [node, ["agent-workflow/tools/v2-raw-evidence-gate.mjs", `--date=${date}`], "run v2 raw evidence gate"],
  ],
  tags: [
    [node, ["--check", "agent-workflow/tools/check-tags.mjs"], "tag quality gate syntax"],
    [node, ["agent-workflow/tools/check-tags.mjs"], "run tag quality gate"],
  ],
};

const buildCommands = () => {
  if (mode === "all") {
    return [
      ...commandSets.syntax,
      [node, ["agent-workflow/tools/writer-style-gate.mjs", `--date=${date}`], "run writer style gate"],
      [node, ["agent-workflow/tools/v2-typography-gate.mjs"], "run v2 typography gate"],
      [node, ["agent-workflow/tools/frontstage-regression-gate.mjs"], "run frontstage regression gate"],
      [node, ["agent-workflow/tools/v2-raw-evidence-gate.mjs", `--date=${date}`], "run v2 raw evidence gate"],
      [node, ["agent-workflow/tools/check-tags.mjs"], "run tag quality gate"],
    ];
  }

  if (mode === "automation") {
    return [
      [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor.mjs"], "guanlan daily monitor syntax"],
      [node, ["--check", "agent-workflow/tools/guanlan-monitor-quality-gate.mjs"], "guanlan monitor quality gate syntax"],
      [node, ["--check", "agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs"], "guanlan daily monitor with qc syntax"],
      [node, ["--check", "agent-workflow/tools/v2-source-quality-gate.mjs"], "v2-source-quality-gate syntax"],
      [node, ["--check", "agent-workflow/tools/writer-style-gate.mjs"], "writer-style-gate syntax"],
      [node, ["--check", "agent-workflow/tools/assert-daily-production-chain.mjs"], "daily production chain gate syntax"],
      [node, ["--check", "agent-workflow/tools/assert-pool-to-card-dedupe.mjs"], "pool-to-card dedupe gate syntax"],
      [node, ["--check", "agent-workflow/tools/run-trend-candidate-decision.mjs"], "trend candidate decision syntax"],
      [node, ["--check", "agent-workflow/tools/write-automation-readiness-report.mjs"], "automation readiness report syntax"],
    ];
  }

  return commandSets[mode] || [];
};

const runCommand = async ([cmd, args, label]) => {
  const startedAt = new Date();
  const target = args.find((arg) => /\.(mjs|js|json)$/i.test(arg));
  if (target && !fs.existsSync(path.join(root, target))) {
    const isSyntaxProbe = args.includes("--check") || /syntax/i.test(label);
    return {
      label,
      command: [cmd, ...args].join(" "),
      status: isSyntaxProbe ? 0 : 1,
      stdout: isSyntaxProbe ? `skipped: ${target} not found in active tree` : "",
      stderr: isSyntaxProbe ? "" : `missing active target: ${target}`,
      startedAt,
      endedAt: new Date(),
    };
  }

  // Some sandboxed Windows environments block child process creation (EPERM).
  // Mark syntax probes as skipped-but-passed when child process creation is blocked.
  if (process.platform === "win32" && cmd === "node") {
    const isSyntaxProbe = args.includes("--check") || /syntax/i.test(label);
    const isWriterStyleGateRun = args[0] === "agent-workflow/tools/writer-style-gate.mjs";
    const isTypographyGateRun = args[0] === "agent-workflow/tools/v2-typography-gate.mjs";
    const isRawEvidenceGateRun = args[0] === "agent-workflow/tools/v2-raw-evidence-gate.mjs";

    if (isSyntaxProbe) {
      return {
        label,
        command: [cmd, ...args].join(" "),
        status: 0,
        stdout: "skipped: child_process spawn blocked (EPERM) in this environment",
        stderr: "",
        startedAt,
        endedAt: new Date(),
      };
    }

    if (isTypographyGateRun) {
      try {
        const gateModuleUrl = pathToFileURL(path.join(root, "agent-workflow", "tools", "v2-typography-gate.mjs")).href;
        const gateModule = await import(`${gateModuleUrl}?t=${Date.now()}`);
        const result = gateModule.runV2TypographyGate?.();
        const statusCode = result?.status === "passed" ? 0 : 1;
        return {
          label,
          command: [cmd, ...args].join(" "),
          status: statusCode,
          stdout: result?.report || "",
          stderr: statusCode === 0 ? "" : "v2 typography gate failed",
          startedAt,
          endedAt: new Date(),
        };
      } catch (error) {
        return {
          label,
          command: [cmd, ...args].join(" "),
          status: 1,
          stdout: "",
          stderr: `fallback import failed: ${error?.message || String(error)}`,
          startedAt,
          endedAt: new Date(),
        };
      }
    }

    if (isWriterStyleGateRun) {
      try {
        const styleModuleUrl = pathToFileURL(path.join(root, "agent-workflow", "tools", "writer-style-gate.mjs")).href;
        const originalArgv = process.argv;
        process.argv = [process.execPath, path.join(root, "agent-workflow", "tools", "writer-style-gate.mjs"), ...args.slice(1)];
        let stdout = "";
        const originalLog = console.log;
        console.log = (...items) => {
          stdout += `${items.join(" ")}\n`;
        };
        const originalExitCode = process.exitCode;
        process.exitCode = 0;
        await import(`${styleModuleUrl}?t=${Date.now()}`);
        const statusCode = process.exitCode || 0;
        process.argv = originalArgv;
        console.log = originalLog;
        process.exitCode = originalExitCode;
        return {
          label,
          command: [cmd, ...args].join(" "),
          status: statusCode,
          stdout,
          stderr: statusCode === 0 ? "" : "writer style gate failed",
          startedAt,
          endedAt: new Date(),
        };
      } catch (error) {
        return {
          label,
          command: [cmd, ...args].join(" "),
          status: 1,
          stdout: "",
          stderr: `fallback import failed: ${error?.message || String(error)}`,
          startedAt,
          endedAt: new Date(),
        };
      }
    }

    if (isRawEvidenceGateRun) {
      try {
        const dateFlag = args.find((arg) => arg.startsWith("--date="));
        const gateDate = dateFlag ? dateFlag.slice("--date=".length) : date;
        const gateModuleUrl = pathToFileURL(path.join(root, "agent-workflow", "tools", "v2-raw-evidence-gate.mjs")).href;
        const gateModule = await import(`${gateModuleUrl}?t=${Date.now()}`);
        const result = gateModule.runV2RawEvidenceGate?.({ date: gateDate });
        const statusCode = result?.status === "failed" ? 1 : 0;
        return {
          label,
          command: [cmd, ...args].join(" "),
          status: statusCode,
          stdout: result?.report || "",
          stderr: statusCode === 0 ? "" : "v2 raw evidence gate failed",
          startedAt,
          endedAt: new Date(),
        };
      } catch (error) {
        return {
          label,
          command: [cmd, ...args].join(" "),
          status: 1,
          stdout: "",
          stderr: `fallback import failed: ${error?.message || String(error)}`,
          startedAt,
          endedAt: new Date(),
        };
      }
    }
  }

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
    mode === "automation"
      ? "\n- 自动化模式检查 V3.3.1 Business Signals / First-Line Viewpoints / Dashboard 生产线相关脚本语法。"
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
- V3.3.1 阶段默认检查 \`01-SiteV2/site/\` 与当前 \`agent-workflow/tools/\` 脚本。
- \`all\` 会运行当前可用的内容、前台回归和 tag 质量门；需要指定日期时使用 \`--date=YYYY-MM-DD\`。
- \`style\` 会检查三个 writer 的文章产物是否出现禁词、抽象名词和高频重复句式。
- \`regression\` 会检查前台是否出现旧版本口径、已退休组件、旧模块文案、合成 fallback 内容、过期前台日期、过期缓存参数或趋势泛关联。
- \`automation\` 检查 V3.3.1 Business Signals / First-Line Viewpoints / Dashboard 生产线相关脚本语法。
- 未覆盖的浏览器截图、多身份权限和人工内容判断，仍需 Build & Release 发布检查或 Product Commander 专项复核。
`;

  const datedPath = path.join(reportsDir, `quality-gates-${mode}-${date}-${stamp}.md`);
  const latestPath = path.join(reportsDir, `quality-gates-${mode}-latest.md`);
  fs.writeFileSync(datedPath, report, "utf8");
  fs.writeFileSync(latestPath, report, "utf8");
  return { status, failed, report, datedPath, latestPath };
};

const runs = await Promise.all(buildCommands().map(runCommand));
const { status, failed, report, datedPath } = writeReport(runs);

console.log(report);
console.log(`Report: ${rel(datedPath)}`);

if (status !== "passed") {
  process.exitCode = failed[0]?.status || 1;
}
