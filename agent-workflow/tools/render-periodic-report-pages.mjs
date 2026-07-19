#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const kind = args.get("kind") || "weekly";
const date = args.get("date") || "";
export const REPORTS_CENTER_VERSION = "REPORTS-V1.0.0-periodic-report-center";

export function escapeHtml(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function inline(value = "") {
  return escapeHtml(value)
    .replace(/\[([EOC]):([^\]]+)\]/gu, '<code class="report-evidence-ref">[$1:$2]</code>')
    .replace(/\*\*([^*]+)\*\*/gu, "<strong>$1</strong>")
    .replace(/`([^`]+)`/gu, "<code>$1</code>");
}

export function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/u);
  if (!match) throw new Error("report_frontmatter_missing");
  const values = Object.fromEntries(match[1].split(/\r?\n/u).map((line) => {
    const hit = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/u);
    return hit ? [hit[1], hit[2].replace(/^['"]|['"]$/gu, "")] : null;
  }).filter(Boolean));
  return { values, body: text.slice(match[0].length) };
}

export function renderBody(markdown) {
  const lines = markdown.split(/\r?\n/u);
  const html = [];
  let inList = false;
  const closeList = () => { if (inList) { html.push("</ul>"); inList = false; } };
  for (const line of lines) {
    const heading = line.match(/^##\s+([0-9]+)[.、]\s*(.+)$/u);
    const bullet = line.match(/^[-*]\s+(.+)$/u);
    if (heading) {
      closeList();
      html.push(`</section><section class="weekly-report-section" id="section-${heading[1]}"><p class="weekly-report-section-label">${String(heading[1]).padStart(2, "0")}</p><h2>${inline(heading[2])}</h2>`);
    } else if (bullet) {
      if (!inList) { html.push("<ul>"); inList = true; }
      html.push(`<li>${inline(bullet[1])}</li>`);
    } else if (line.trim()) {
      closeList();
      html.push(`<p>${inline(line.trim())}</p>`);
    }
  }
  closeList();
  return `${html.join("\n")}</section>`.replace(/^<\/section>/u, "");
}

function shell(metadata, content) {
  const typeLabel = kind === "weekly" ? "周报" : "月报";
  const sourceMetaName = kind === "weekly" ? "weekly-report-source" : "monthly-report-source";
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="wavesight-version" content="SITE-V4.2.0-entity-history"><meta name="wavesight-column-version" content="${REPORTS_CENTER_VERSION}">
<meta name="${sourceMetaName}" content="${escapeHtml(metadata.source)}"><title>${escapeHtml(metadata.title)}｜观澜 AI</title>
<link rel="icon" href="assets/brand/logo-wavesight-reference-symbol.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/data-center-v4.css"><link rel="stylesheet" href="assets/weekly-report.css"></head>
<body class="weekly-report-page dc-report-page"><header class="dc-header"><a class="dc-brand" href="data-center.html" aria-label="观澜 AI 数据中心"><img src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜 AI Wavesight AI"></a><button class="dc-nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="dc-sidebar">栏目</button></header>
<div class="dc-layout"><aside class="dc-sidebar" id="dc-sidebar" data-sidebar><nav aria-label="数据中心与应用中心"><section class="dc-nav-group"><h2>数据中心</h2><a href="data-center.html?view=events">商业事件</a><a href="data-center.html?view=fde">FDE 实施</a><a href="data-center.html?view=hardware">AI 硬件</a><a href="data-center.html?view=community">社群情报</a><a href="data-center.html?view=viewpoints">一线观点</a><a href="data-center.html?view=index">实体索引</a></section><section class="dc-nav-group dc-nav-apps"><h2>应用中心</h2><a href="trend-radar.html">变化雷达</a><a href="intelligence-map.html" aria-current="page">行业报告</a><a href="opportunity-map.html">机会地图</a></section></nav></aside>
<main class="weekly-report-shell dc-main dc-report-detail-main" id="main-content"><section class="weekly-report-hero"><div><p class="weekly-report-kicker">${typeLabel} · ${escapeHtml(metadata.window || metadata.month || "")}</p><h1>${escapeHtml(metadata.title)}</h1></div></section><article class="weekly-report-reader" aria-label="${typeLabel}正文">${content}</article></main></div><script src="assets/v4-report-shell.js"></script></body></html>\n`;
}

function promote(text) {
  return text.replace(/^status:\s*draft$/mu, "status: published");
}

function updateIntelligenceMap(metadata, route) {
  const file = path.join(root, "01-SiteV2", "site", "intelligence-map.html");
  let html = fs.readFileSync(file, "utf8");
  if (kind === "weekly") {
    const card = `<a href="${route}"><time>${escapeHtml(metadata.window.replace(" to ", " - "))}</time><strong>${escapeHtml(metadata.title)}</strong><span>阅读</span></a>`;
    if (!html.includes(`href="${route}"`)) html = html.replace(/(<div class="report-list weekly-list"[^>]*>)/u, `$1\n                ${card}`);
  } else {
    html = html.replace(/href="monthly-business-structure-\d{4}-\d{2}\.html"/u, `href="${route}"`);
  }
  fs.writeFileSync(file, html, "utf8");
}

function main() {
  if (!new Set(["weekly", "monthly"]).has(kind) || !date) throw new Error("kind and date are required");
  const contentFile = kind === "weekly"
    ? path.join(root, "01-SiteV2", "content", "08-report", `${date}--weekly-report--ai-business-change-radar.md`)
    : path.join(root, "01-SiteV2", "content", "08-report", "monthly", `${date}--monthly-report--ai-business-structure-and-opportunity.md`);
  let markdown = fs.readFileSync(contentFile, "utf8");
  const parsed = parseFrontmatter(markdown);
  if (parsed.values.status !== "draft") throw new Error("renderer_requires_gate_accepted_draft");
  markdown = promote(markdown);
  fs.writeFileSync(contentFile, markdown, "utf8");
  if (kind === "weekly") fs.writeFileSync(path.join(root, "agent-workflow", "reports", `${date}-weekly-ai-business-change-radar.md`), markdown, "utf8");
  const promoted = parseFrontmatter(markdown);
  const route = kind === "weekly" ? `weekly-ai-business-change-radar-${date}.html` : `monthly-business-structure-${promoted.values.month}.html`;
  const source = path.relative(root, contentFile).replace(/\\/gu, "/");
  const page = shell({ ...promoted.values, source }, renderBody(promoted.body));
  const routeFile = path.join(root, "01-SiteV2", "site", route);
  fs.writeFileSync(routeFile, page, "utf8");
  if (kind === "weekly") fs.writeFileSync(path.join(root, "01-SiteV2", "site", "weekly-ai-business-change-radar.html"), page, "utf8");
  updateIntelligenceMap(promoted.values, route);
  console.log(JSON.stringify({ ok: true, kind, date, route, source }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
