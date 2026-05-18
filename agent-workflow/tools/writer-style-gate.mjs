import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const rawArgs = process.argv.slice(2);
const flags = new Map(
  rawArgs
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, ...rest] = arg.slice(2).split("=");
      return [key, rest.join("=") || "true"];
    })
);

const date = flags.get("date") || new Date().toISOString().slice(0, 10);
const strict = flags.get("strict") !== "false";
const reportsDir = path.join(root, "agent-workflow", "reports");
const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const defaultTargets = [
  "01-SiteV2/content/03-daily-observation",
  "01-SiteV2/content/06-trend-reports",
  "01-SiteV2/content/07-business-briefs",
];

const targets = flags.has("path")
  ? flags
      .get("path")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  : defaultTargets;

const bannedPhrases = [
  "首先",
  "其次",
  "最后",
  "值得注意的是",
  "显而易见",
  "不可否认",
  "总而言之",
  "综上所述",
  "由此可见",
];

const commonAbstractWords = [
  "科技感",
  "未来感",
  "故事感",
  "颗粒感",
  "确定性",
  "复杂性",
  "重要性",
  "可能性",
  "稀缺性",
  "智能化",
  "数字化",
  "商业化",
  "场景化",
  "规模化",
];

const abstractSuffixPattern = /[\u4e00-\u9fa5A-Za-z0-9]{2,}(感|性|化)/g;
const abstractAllowList = new Set(["变化", "转化", "消化", "分化", "淡化", "强化", "公开化"]);

const repeatedPatterns = [
  /不是[^。！？\n]{0,60}而是/g,
  /表面[^。！？\n]{0,60}真正/g,
  /对[^。！？\n]{0,20}来说/g,
  /这意味着/g,
  /核心在于/g,
];

const listFiles = (target) => {
  const abs = path.resolve(root, target);
  if (!fs.existsSync(abs)) return [];
  const stat = fs.statSync(abs);
  if (stat.isFile()) return /\.(md|txt)$/i.test(abs) ? [abs] : [];
  const files = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      if (entry.name === "_archive" || entry.name === "99-Archive") continue;
      if (entry.name === "no-report-decisions") continue;
      const next = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(next);
      } else if (/\.(md|txt)$/i.test(entry.name)) {
        files.push(next);
      }
    }
  };
  walk(abs);
  return files;
};

const findLine = (lines, needle) => {
  const index = lines.findIndex((line) => line.includes(needle));
  return index === -1 ? 1 : index + 1;
};

const stripNonAuthorText = (text) => {
  const lines = text.split(/\r?\n/);
  const kept = [];
  let inFrontmatter = false;
  let inFence = false;
  let frontmatterDone = false;
  let skipSourceSection = false;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (index === 0 && trimmed === "---") {
      inFrontmatter = true;
      frontmatterDone = true;
      continue;
    }
    if (inFrontmatter) {
      if (trimmed === "---") inFrontmatter = false;
      continue;
    }

    if (/^```/.test(trimmed)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    if (/^#{1,6}\s*(原文摘录|来源|Source|Sources|References|参考|附录|数据来源)/i.test(trimmed)) {
      skipSourceSection = true;
      continue;
    }
    if (skipSourceSection && /^#{1,6}\s+/.test(trimmed)) {
      skipSourceSection = false;
    }
    if (skipSourceSection) continue;

    if (trimmed.startsWith(">")) continue;
    if (/^(原文摘录|来源|Source|Sources|References|参考|附录|数据来源)[:：]/i.test(trimmed)) continue;
    if (!frontmatterDone && trimmed === "---") continue;

    kept.push(line);
  }

  return kept.join("\n");
};

const scanFile = (file) => {
  const rawText = fs.readFileSync(file, "utf8");
  const text = stripNonAuthorText(rawText);
  const lines = text.split(/\r?\n/);
  const issues = [];

  for (const phrase of bannedPhrases) {
    if (text.includes(phrase)) {
      issues.push({
        type: "banned_phrase",
        value: phrase,
        line: findLine(lines, phrase),
        message: `禁用过渡词：${phrase}`,
      });
    }
  }

  for (const word of commonAbstractWords) {
    if (text.includes(word)) {
      issues.push({
        type: "abstract_word",
        value: word,
        line: findLine(lines, word),
        message: `抽象名词：${word}`,
      });
    }
  }

  const seenAbstract = new Set();
  for (const match of text.matchAll(abstractSuffixPattern)) {
    const value = match[0];
    if (abstractAllowList.has(value) || seenAbstract.has(value)) continue;
    seenAbstract.add(value);
    issues.push({
      type: "abstract_suffix",
      value,
      line: findLine(lines, value),
      message: `疑似“XX${match[1]}”抽象名词：${value}`,
    });
  }

  for (const pattern of repeatedPatterns) {
    const matches = text.match(pattern) || [];
    if (matches.length > 3) {
      issues.push({
        type: "repeated_sentence_pattern",
        value: matches[0],
        line: findLine(lines, matches[0]),
        message: `同类句式出现 ${matches.length} 次，超过 3 次`,
      });
    }
  }

  return { file, issues };
};

const files = [...new Set(targets.flatMap(listFiles))].sort();
const results = files.map(scanFile);
const failedFiles = results.filter((result) => result.issues.length > 0);
const issueCount = failedFiles.reduce((sum, result) => sum + result.issues.length, 0);
const status = strict && issueCount > 0 ? "failed" : "passed";

const detail = results.length
  ? results
      .map((result) => {
        if (!result.issues.length) {
          return `### ${rel(result.file)}\n\n- 状态：passed\n`;
        }
        const rows = result.issues
          .map((issue) => `- L${issue.line}：${issue.message}`)
          .join("\n");
        return `### ${rel(result.file)}\n\n- 状态：failed\n${rows}\n`;
      })
      .join("\n")
  : "未发现可检查的文章文件。";

const report = `# Writer Style Gate Report

生成日期：${date}

## 结论

- 状态：${status}
- 检查文件：${results.length}
- 问题数量：${issueCount}
- 严格模式：${strict ? "on" : "off"}

## 检查范围

${targets.map((target) => `- \`${target}\``).join("\n")}

## 检查规则

- 禁用 AI 腔过渡词。
- 检查常见“XX感 / XX性 / XX化”抽象名词。
- 检查疑似抽象名词后缀。
- 检查高频重复句式。

## 明细

${detail}
`;

fs.mkdirSync(reportsDir, { recursive: true });
const stamp = new Date()
  .toISOString()
  .replace(/[-:]/g, "")
  .replace(/\..+/, "")
  .replace("T", "-");
const datedPath = path.join(reportsDir, `writer-style-gate-${date}-${stamp}.md`);
const latestPath = path.join(reportsDir, "writer-style-gate-latest.md");
fs.writeFileSync(datedPath, report, "utf8");
fs.writeFileSync(latestPath, report, "utf8");

console.log(report);
console.log(`Report: ${rel(datedPath)}`);

if (status !== "passed") {
  process.exitCode = 1;
}
