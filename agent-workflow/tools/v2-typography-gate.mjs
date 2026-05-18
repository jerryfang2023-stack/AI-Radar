import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const root = process.cwd();

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const walk = (dir, matcher, files = []) => {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, matcher, files);
    } else if (matcher(full)) {
      files.push(full);
    }
  }
  return files;
};

const collectTitleIssues = (value, location, issues) => {
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectTitleIssues(item, `${location}[${index}]`, issues));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, item] of Object.entries(value)) {
    const next = `${location}.${key}`;
    if (/title|headline|mainLine|main_line/i.test(key) && typeof item === "string" && /(\.\.\.|…)$/.test(item.trim())) {
      issues.push(`${next}: title ends with ellipsis -> ${item}`);
    }
    collectTitleIssues(item, next, issues);
  }
};

export function runV2TypographyGate() {
  const issues = [];
  const siteDir = path.join(root, "01-SiteV2", "site");
  const htmlFiles = walk(siteDir, (file) => {
    if (!file.endsWith(".html")) return false;
    if (file.includes(`${path.sep}admin`)) return false;
    if (file.includes(`${path.sep}assets${path.sep}`)) return false;
    return true;
  });

  for (const file of htmlFiles) {
    const text = fs.readFileSync(file, "utf8");
    const bodyMatch = text.match(/<body\b([^>]*)>/i);
    if (!bodyMatch) {
      issues.push(`${rel(file)}: missing <body> tag`);
      continue;
    }
    if (!/\bclass\s*=/.test(bodyMatch[1])) {
      issues.push(`${rel(file)}: public page body must carry a stable page-* class`);
    }
  }

  const dataFile = path.join(siteDir, "data", "site-content.json");
  if (fs.existsSync(dataFile)) {
    try {
      const json = JSON.parse(fs.readFileSync(dataFile, "utf8"));
      collectTitleIssues(json, rel(dataFile), issues);
    } catch (error) {
      issues.push(`${rel(dataFile)}: cannot parse JSON (${error.message})`);
    }
  }

  const appFile = path.join(siteDir, "assets", "app.js");
  if (fs.existsSync(appFile)) {
    const app = fs.readFileSync(appFile, "utf8");
    const forbidden = [
      "账单开始按用量走",
      "围栏成了采购前提",
      "专业流程开始接 AI",
      "会动手就要先管住",
      "用量账单开始抬头",
    ];
    for (const phrase of forbidden) {
      if (app.includes(phrase)) {
        issues.push(`${rel(appFile)}: forbidden mechanical copy remains -> ${phrase}`);
      }
    }
  }

  const styleFile = path.join(siteDir, "assets", "styles.css");
  if (fs.existsSync(styleFile)) {
    const css = fs.readFileSync(styleFile, "utf8");
    const detailTitleBlocks = css.match(/\.signal-detail-hero\s+h1\s*\{[^}]*\}/gi) || [];
    for (const block of detailTitleBlocks) {
      const fontSize = block.match(/font-size\s*:\s*([^;]+)/i)?.[1] || "";
      const lineHeight = block.match(/line-height\s*:\s*([^;]+)/i)?.[1] || "";
      if (/(6vw|108px|100px|88px|76px|62px)/i.test(fontSize) || /^0\./.test(lineHeight.trim())) {
        issues.push(`${rel(styleFile)}: signal detail title appears to use poster-scale typography`);
        break;
      }
    }
  }

  const report = [
    "# V2 Typography Gate",
    "",
    `Status: ${issues.length ? "failed" : "passed"}`,
    "",
    issues.length ? "## Issues" : "No typography or title blocking issues found.",
    ...issues.map((item) => `- ${item}`),
    "",
  ].join("\n");

  return {
    status: issues.length ? "failed" : "passed",
    report,
    issues,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] || "").href) {
  const result = runV2TypographyGate();
  console.log(result.report);
  if (result.status !== "passed") process.exitCode = 1;
}
