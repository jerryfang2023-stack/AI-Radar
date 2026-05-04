import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const root = process.cwd();
const baseUrl = process.env.WAVESIGHT_SITE_URL || "http://127.0.0.1:4173";
const data = JSON.parse(fs.readFileSync(path.join(root, "04-Site", "data", "radar-data.json"), "utf8"));
const reportsDir = path.join(root, "agent-workflow", "reports");
const screenshotDir = path.join(reportsDir, "screenshots", `the-point-qa-${new Date().toISOString().slice(0, 10)}`);
const reportPath = path.join(reportsDir, `the-point-browser-qa-${new Date().toISOString().slice(0, 10)}.md`);

fs.mkdirSync(screenshotDir, { recursive: true });

const latestDate = [...new Set((data.points || []).map((point) => point.date).filter(Boolean))].sort().at(-1) || "2026-05-03";
const topPoint = (data.points || []).find((point) => point.date === latestDate) || data.points?.[0] || {};
const source = (data.pointSources || []).find((item) => item.slug) || data.pointSources?.[0] || {};

const pages = [
  { key: "home", label: "首页", url: "/index.html", expect: ["The Point", "一线观点"] },
  { key: "the-point", label: "The Point 栏目页", url: "/the-point.html", expect: ["THE POINT", "用一线人物原话"] },
  { key: "point-daily", label: "The Point 每日集合页", url: `/point-daily.html?date=${encodeURIComponent(latestDate)}`, expect: [latestDate, "条观点"] },
  { key: "point-detail", label: "The Point 人物详情页", url: `/point.html?slug=${encodeURIComponent(topPoint.slug || "")}`, expect: [topPoint.person, "原文"] },
  { key: "point-source", label: "The Point 素材页", url: `/point-source.html?slug=${encodeURIComponent(source.slug || "")}`, expect: ["来源与版权", "站内阅读摘要"] },
  { key: "daily", label: "Daily Brief 列表页", url: "/daily.html", expect: ["Daily Brief", "一线观点"] },
  { key: "daily-detail", label: "Daily Brief 详情页", url: `/daily-detail.html?date=${encodeURIComponent(latestDate)}`, expect: ["观澜简报", "一线观点"] },
  { key: "signals", label: "Signals 页面", url: "/signals.html", expect: ["Signals", "商业信号"] },
];

const viewports = [
  { key: "desktop", label: "桌面端", width: 1440, height: 1000, fullPage: true },
  { key: "mobile", label: "移动端", width: 390, height: 844, fullPage: true, isMobile: true, hasTouch: true },
];

const sanitize = (value = "") => value.replace(/[^a-z0-9-]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase();
const relative = (file) => path.relative(root, file).replaceAll("\\", "/");

const failures = [];
const checks = [];
const screenshots = [];

const browserCandidates = [
  process.env.PLAYWRIGHT_CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
  path.join(process.env.LOCALAPPDATA || "", "Google", "Chrome", "Application", "chrome.exe"),
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
].filter(Boolean);
const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
const browser = await chromium.launch({
  headless: true,
  executablePath,
});

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    isMobile: Boolean(viewport.isMobile),
    hasTouch: Boolean(viewport.hasTouch),
  });
  await context.addInitScript(() => {
    localStorage.setItem("ai-business-radar-access", "approved");
  });

  for (const item of pages) {
    const page = await context.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") pageErrors.push(message.text());
    });

    const url = new URL(item.url, baseUrl).toString();
    const result = {
      viewport: viewport.label,
      page: item.label,
      url,
      status: "通过",
      issues: [],
      screenshot: "",
    };

    try {
      const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
      if (!response || !response.ok()) result.issues.push(`HTTP 状态异常：${response?.status() || "无响应"}`);

      await page.waitForTimeout(300);
      const bodyText = await page.locator("body").innerText({ timeout: 10000 }).catch(() => "");
      for (const expected of item.expect.filter(Boolean)) {
        if (!bodyText.includes(expected)) result.issues.push(`缺少关键文本：${expected}`);
      }
      if (/https?:\/\/t\.co\/\S+/i.test(bodyText)) result.issues.push("页面可见文本仍包含 X t.co 短链。");
      if (/(?:Speaker\s+\d+|Host|Guest|Interviewer|主持人|嘉宾)\s*\|\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/i.test(bodyText)) {
        result.issues.push("页面可见文本仍包含 speaker/timecode 标记。");
      }
      if (/Markdown|JSON|同步脚本|恢复原始|页面编辑/.test(bodyText) && !["point-source"].includes(item.key)) {
        result.issues.push("普通前台出现内部流程或后台痕迹。");
      }
      if (pageErrors.length) result.issues.push(`浏览器错误：${[...new Set(pageErrors)].slice(0, 3).join(" / ")}`);

      const layout = await page.evaluate(() => {
        const doc = document.documentElement;
        const body = document.body;
        const horizontalOverflow = Math.max(doc.scrollWidth, body.scrollWidth) - window.innerWidth;
        const viewportOverflows = [...document.querySelectorAll("body *")]
          .filter((node) => {
            const style = window.getComputedStyle(node);
            const rect = node.getBoundingClientRect();
            return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
          })
          .filter((node) => {
            const rect = node.getBoundingClientRect();
            return rect.right > window.innerWidth + 4 || rect.left < -4;
          })
          .slice(0, 8)
          .map((node) => ({
            tag: node.tagName.toLowerCase(),
            className: String(node.className || ""),
            text: String(node.textContent || "").trim().slice(0, 80),
            right: Math.round(node.getBoundingClientRect().right),
          }));
        return { horizontalOverflow, overflowingNodes: viewportOverflows };
      });
      if (layout.horizontalOverflow > 4) result.issues.push(`页面存在横向溢出：${layout.horizontalOverflow}px`);
      const meaningfulOverflow = layout.overflowingNodes.filter((node) => !/nav|topbar|brand/.test(node.className));
      if (meaningfulOverflow.length) {
        result.issues.push(`部分元素越出视口：${meaningfulOverflow.map((node) => `${node.tag}.${node.className || "-"} right=${node.right}px`).join("; ")}`);
      }

      const screenshotPath = path.join(screenshotDir, `${viewport.key}-${sanitize(item.key)}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: viewport.fullPage });
      result.screenshot = relative(screenshotPath);
      screenshots.push(result.screenshot);
    } catch (error) {
      result.issues.push(error.message);
    }

    if (result.issues.length) {
      result.status = "需复核";
      failures.push(result);
    }
    checks.push(result);
    await page.close();
  }

  await context.close();
}

await browser.close();

const table = (rows) => rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
const checkRows = checks.map((item) => [
  item.viewport,
  item.page,
  item.status,
  item.issues.length ? item.issues.join("<br>") : "无",
  item.screenshot ? `[截图](${item.screenshot})` : "未生成",
]);

const report = `# The Point 浏览器 QA 报告

生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}

## 检查结论

- 检查页面：${pages.length}
- 视口：${viewports.map((item) => item.label).join(" / ")}
- 截图数量：${screenshots.length}
- 需复核项：${failures.length}

## 页面结果

${table([
  ["视口", "页面", "状态", "问题", "截图"],
  ...checkRows,
])}

## 重点规则

- The Point 相关页面不得显示 X \`t.co\` 短链。
- The Point 相关页面不得显示 YouTube speaker/timecode 标记。
- 普通前台不得出现 Markdown、JSON、同步脚本、恢复原始、页面编辑等后台或内部流程痕迹。
- 桌面和移动端不应出现横向滚动或明显文本溢出。

## 后续建议

${failures.length ? "- 先处理上表中的需复核项，再重新运行本 QA。" : "- 本轮未发现阻塞项；下一步可进入 The Point 每日自动化任务落地。"}
`;

fs.writeFileSync(reportPath, report, "utf8");
console.log(report);

if (failures.length) process.exitCode = 1;
