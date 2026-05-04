import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const dateParts = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get("year")}-${get("month")}-${get("day")}`;
};

const date = args.get("date") || dateParts();
const now = new Date();
const stamp = now
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "")
  .replace("T", "-");

const paths = {
  signal: path.join(root, "01-Signals", `${date}-AI商业雷达.md`),
  scoring: path.join(root, "02-Scoring", `${date}-AI机会评分.md`),
  point: path.join(root, "05-Point", `${date}-The-Point.md`),
  dataJson: path.join(root, "04-Site", "data", "radar-data.json"),
  dataJs: path.join(root, "04-Site", "data", "radar-data.js"),
  lock: path.join(root, "agent-workflow", ".unified-site-sync.lock.json"),
  reportsDir: path.join(root, "agent-workflow", "reports"),
  backupDir: path.join(root, "agent-workflow", "backups", "unified-site-sync", stamp),
};

const requiredBreakdownQuestions = [
  "解决什么具体问题？",
  "目标客户是谁？",
  "替代或优化什么流程？",
  "商业模式（怎么赚钱）？",
  "为什么现在值得关注？",
  "是否可迁移中国市场？",
];

const read = (file) => fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const existsNonEmpty = (file) => fs.existsSync(file) && fs.statSync(file).size > 200;
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");
const add = (items, scope, message) => items.push({ scope, message });

const extractFrontmatterValue = (text, key) => {
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return "";
  return fm[1].match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim() || "";
};

const splitSignalBlocks = (text) => {
  const lines = text.split("\n");
  const starts = lines
    .map((line, index) => (/^### Signal\s+\d+/i.test(line) ? index : -1))
    .filter((index) => index >= 0);
  return starts.map((start, index) => {
    const end = starts[index + 1] ?? lines.length;
    return lines.slice(start, end).join("\n");
  });
};

const validateSignal = (issues, notes) => {
  if (!existsNonEmpty(paths.signal)) {
    add(issues, "AI商业雷达", `缺少当天 Signals 文件或文件为空：${rel(paths.signal)}`);
    return { count: 0 };
  }
  const text = read(paths.signal);
  const status = extractFrontmatterValue(text, "status");
  if (/failed|error|empty|draft|needs_review/i.test(status)) {
    add(issues, "AI商业雷达", `Signals frontmatter status 不可同步：${status}`);
  }
  if (/离线空跑|空跑记录|fetch\s*failed|生成失败|TODO|待补充/.test(text)) {
    add(issues, "AI商业雷达", "Signals 文件包含失败、空跑或待补充痕迹。");
  }

  const blocks = splitSignalBlocks(text);
  if (blocks.length < 3) add(issues, "AI商业雷达", `当天 Signal 数量过少：${blocks.length}`);

  for (const [index, block] of blocks.entries()) {
    const markerIndex = block.indexOf("机会拆解");
    const breakdown =
      markerIndex >= 0
        ? block
            .slice(markerIndex)
            .replace(/^.*机会拆解[^\n]*\n?/, "")
            .split(/\n---\n/)[0]
        : "";
    if (!breakdown) {
      add(issues, "机会拆解", `Signal ${index + 1} 缺少“机会拆解（6点）”。`);
      continue;
    }
    const numbered = [...breakdown.matchAll(/^\s*\d+\.\s*([^\n]+)/gm)].map((match) => match[1].trim());
    if (numbered.length !== 6) {
      add(issues, "机会拆解", `Signal ${index + 1} 机会拆解数量不是 6：当前 ${numbered.length}`);
    }
    for (const question of requiredBreakdownQuestions) {
      if (!breakdown.includes(question)) {
        add(issues, "机会拆解", `Signal ${index + 1} 缺少模块：${question}`);
      }
    }
  }
  add(notes, "AI商业雷达", `Signals 文件就绪：${rel(paths.signal)}，Signal 数量 ${blocks.length}`);
  return { count: blocks.length };
};

const validateScoring = (issues, notes, signalCount) => {
  if (!existsNonEmpty(paths.scoring)) {
    add(issues, "AI机会评分", `缺少当天 Scoring 文件或文件为空：${rel(paths.scoring)}`);
    return { count: 0 };
  }
  const text = read(paths.scoring);
  const status = extractFrontmatterValue(text, "status");
  if (/failed|error|empty|draft|needs_review/i.test(status)) {
    add(issues, "AI机会评分", `Scoring frontmatter status 不可同步：${status}`);
  }
  if (!text.includes(`${date}-AI商业雷达`) && !text.includes(`date: ${date}`)) {
    add(issues, "AI机会评分", "Scoring 文件未明确关联当天商业雷达。");
  }
  const rows = [...text.matchAll(/^\|\s*\d+\s*\|/gm)];
  if (rows.length < Math.max(3, Math.min(signalCount, 5))) {
    add(issues, "AI机会评分", `评分表行数过少：${rows.length}`);
  }
  add(notes, "AI机会评分", `Scoring 文件就绪：${rel(paths.scoring)}，评分行 ${rows.length}`);
  return { count: rows.length };
};

const validatePoint = (issues, notes) => {
  if (!existsNonEmpty(paths.point)) {
    add(issues, "The Point", `缺少当天 The Point 文件或文件为空：${rel(paths.point)}`);
    return { count: 0 };
  }
  const text = read(paths.point);
  const status = extractFrontmatterValue(text, "status");
  if (!/pending_unified_sync|updated|published/i.test(status)) {
    add(issues, "The Point", `The Point frontmatter status 不可同步：${status || "missing"}`);
  }
  if (/failed|error|empty|draft|needs_review|离线空跑|TODO|待补充/i.test(`${status}\n${text}`)) {
    add(issues, "The Point", "The Point 文件包含失败、待复核或待补充痕迹。");
  }
  const points = [...text.matchAll(/^### Point\s+\d+/gm)];
  if (points.length < 10) {
    add(issues, "The Point", `Point 数量不足 Top10：当前 ${points.length}`);
  }
  if (/https:\/\/t\.co\//i.test(text)) add(issues, "The Point", "The Point 仍包含 X t.co 短链。");
  if (/Speaker\s+\d+\s*\|/i.test(text)) add(issues, "The Point", "The Point 仍包含 YouTube speaker/timecode 痕迹。");
  add(notes, "The Point", `The Point 文件就绪：${rel(paths.point)}，Point 数量 ${points.length}`);
  return { count: points.length };
};

const commandLines = [];
const run = (cmd, cmdArgs) => {
  const rendered = [cmd, ...cmdArgs].join(" ");
  commandLines.push(`$ ${rendered}`);
  const result = spawnSync(cmd, cmdArgs, {
    cwd: root,
    encoding: "utf8",
    shell: false,
  });
  return {
    command: rendered,
    status: result.status ?? 1,
    stdout: result.stdout || "",
    stderr: result.stderr || "",
  };
};

const copyIfExists = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};

const restoreBackup = () => {
  copyIfExists(path.join(paths.backupDir, "radar-data.json"), paths.dataJson);
  copyIfExists(path.join(paths.backupDir, "radar-data.js"), paths.dataJs);
};

const writeReport = (status, issues, notes, runs = []) => {
  fs.mkdirSync(paths.reportsDir, { recursive: true });
  const issueLines = issues.length
    ? issues.map((item, index) => `${index + 1}. **${item.scope}**：${item.message}`).join("\n")
    : "无";
  const noteLines = notes.length
    ? notes.map((item, index) => `${index + 1}. **${item.scope}**：${item.message}`).join("\n")
    : "无";
  const runLines = runs.length
    ? runs
        .map(
          (item, index) =>
            `${index + 1}. \`${item.command}\` -> exit ${item.status}\n\n` +
            `   stdout: ${item.stdout.trim().split("\n").slice(-3).join(" / ") || "-"}\n\n` +
            `   stderr: ${item.stderr.trim().split("\n").slice(-3).join(" / ") || "-"}`
        )
        .join("\n\n")
    : "未执行同步命令。";

  const report = `# 统一网站同步闸门

生成时间：${now.toLocaleString("zh-CN", { hour12: false })}

## 结论

- 日期：${date}
- 状态：${status}
- 阻塞项：${issues.length}
- 备份目录：${fs.existsSync(paths.backupDir) ? rel(paths.backupDir) : "未创建"}

## 内容就绪检查

${noteLines}

## 阻塞项

${issueLines}

## 执行命令

${runLines}

## 处理规则

- 只有 AI商业雷达、AI机会评分、The Point 三类当天 Markdown 同时就绪，才允许同步网站。
- 任一内容缺失、空跑、失败、待补充或字段不完整，均阻止入站。
- 同步前先备份网站数据文件；同步后关系检查或 The Point 质量检查出现硬错误，则恢复备份。
- 内容生产任务不得直接运行网站同步，统一由本闸门执行。
`;

  const dated = path.join(paths.reportsDir, `unified-site-sync-${date}.md`);
  const latest = path.join(paths.reportsDir, "unified-site-sync-latest.md");
  fs.writeFileSync(dated, report, "utf8");
  fs.writeFileSync(latest, report, "utf8");
  return { dated, latest, report };
};

const appendRunLog = (status, issues) => {
  const logPath = path.join(root, "agent-workflow", "daily-run-log.md");
  const lines = [
    "",
    `### ${now.toLocaleString("zh-CN", { hour12: false })} 统一网站同步闸门`,
    "",
    `- 日期：${date}`,
    `- 状态：${status}`,
    `- 阻塞项：${issues.length}`,
    `- 报告：agent-workflow/reports/unified-site-sync-${date}.md`,
  ];
  if (issues.length) {
    lines.push("- 阻塞原因：");
    for (const issue of issues) lines.push(`  - ${issue.scope}：${issue.message}`);
  }
  fs.appendFileSync(logPath, `${lines.join("\n")}\n`, "utf8");
};

const acquireLock = () => {
  if (fs.existsSync(paths.lock)) {
    const ageMs = Date.now() - fs.statSync(paths.lock).mtimeMs;
    if (ageMs < 2 * 60 * 60 * 1000) {
      throw new Error(`已有同步锁未释放：${rel(paths.lock)}`);
    }
  }
  fs.writeFileSync(paths.lock, JSON.stringify({ date, startedAt: now.toISOString() }, null, 2), "utf8");
};

const releaseLock = () => {
  if (fs.existsSync(paths.lock)) fs.unlinkSync(paths.lock);
};

const main = () => {
  const issues = [];
  const notes = [];
  acquireLock();
  try {
    const signal = validateSignal(issues, notes);
    validateScoring(issues, notes, signal.count);
    validatePoint(issues, notes);

    if (issues.length) {
      const { report } = writeReport("blocked", issues, notes);
      appendRunLog("blocked", issues);
      console.log(report);
      process.exitCode = 1;
      return;
    }

    fs.mkdirSync(paths.backupDir, { recursive: true });
    copyIfExists(paths.dataJson, path.join(paths.backupDir, "radar-data.json"));
    copyIfExists(paths.dataJs, path.join(paths.backupDir, "radar-data.js"));

    const runs = [
      run(process.execPath, ["--check", "04-Site/scripts/sync-data.mjs"]),
      run(process.execPath, ["--check", "04-Site/scripts/check-relations.mjs"]),
      run(process.execPath, ["--check", "04-Site/scripts/check-point-quality.mjs"]),
      run(process.execPath, ["--check", "04-Site/scripts/check-tags.mjs"]),
      run(process.execPath, ["04-Site/scripts/sync-data.mjs"]),
      run(process.execPath, ["04-Site/scripts/check-relations.mjs"]),
      run(process.execPath, ["04-Site/scripts/check-point-quality.mjs"]),
      run(process.execPath, ["04-Site/scripts/check-tags.mjs"]),
    ];

    const failed = runs.filter((item) => item.status !== 0);
    if (failed.length) {
      restoreBackup();
      add(issues, "统一同步", `同步或质量检查失败，已恢复同步前备份。失败命令数：${failed.length}`);
      const { report } = writeReport("failed_restored", issues, notes, runs);
      appendRunLog("failed_restored", issues);
      console.log(report);
      process.exitCode = 1;
      return;
    }

    add(notes, "统一同步", "网站数据同步、关系检查、The Point 质量检查和 Tag Quality Check 均通过。");
    const { report } = writeReport("synced", issues, notes, runs);
    appendRunLog("synced", issues);
    console.log(report);
  } finally {
    releaseLock();
  }
};

try {
  main();
} catch (error) {
  const issues = [{ scope: "统一同步", message: error.message }];
  const { report } = writeReport("failed", issues, []);
  appendRunLog("failed", issues);
  console.error(report);
  process.exitCode = 1;
  releaseLock();
}
