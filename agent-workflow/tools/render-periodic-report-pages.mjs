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

function reportSourceDirectory(rootDir, reportKind) {
  return reportKind === "weekly"
    ? path.join(rootDir, "01-SiteV2", "content", "08-report")
    : path.join(rootDir, "01-SiteV2", "content", "08-report", "monthly");
}

function reportSourcePattern(reportKind) {
  return reportKind === "weekly"
    ? /^\d{4}-\d{2}-\d{2}--weekly-report--ai-business-change-radar\.md$/u
    : /^\d{4}-\d{2}-\d{2}--monthly-report--ai-business-structure-and-opportunity\.md$/u;
}

export function reportRoute(reportKind, metadata) {
  return reportKind === "weekly"
    ? `weekly-ai-business-change-radar-${metadata.date}.html`
    : `monthly-business-structure-${metadata.month}.html`;
}

export function formatReportWindow(metadata) {
  const value = metadata.window || metadata.month || metadata.date || "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})\s+to\s+(\d{4})-(\d{2})-(\d{2})$/u);
  if (!match) return value.replaceAll("-", ".");
  return `${match[1]}.${match[2]}.${match[3]} - ${match[5]}.${match[6]}`;
}

export function discoverPublishedReports(rootDir, reportKind) {
  const sourceDir = reportSourceDirectory(rootDir, reportKind);
  return fs.readdirSync(sourceDir)
    .filter((file) => reportSourcePattern(reportKind).test(file))
    .map((file) => {
      const sourceFile = path.join(sourceDir, file);
      const metadata = parseFrontmatter(fs.readFileSync(sourceFile, "utf8")).values;
      return {
        ...metadata,
        kind: reportKind,
        route: reportRoute(reportKind, metadata),
        source: path.relative(rootDir, sourceFile).replace(/\\/gu, "/"),
      };
    })
    .filter((report) => report.status === "published" && report.title && report.date)
    .sort((left, right) => String(right.date).localeCompare(String(left.date)));
}

export function parseReportSections(markdown) {
  const sections = [];
  let current = null;
  for (const line of markdown.split(/\r?\n/u)) {
    const heading = line.match(/^##\s+([0-9]+)[.。、]?\s*(.+)$/u);
    if (heading) {
      current = { number: heading[1], title: heading[2].trim(), lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections;
}

function nonempty(lines) {
  return lines.map((line) => line.trim()).filter(Boolean);
}

function plainText(value = "") {
  return value
    .replace(/^#{1,6}\s+/u, "")
    .replace(/^\d+[.)]\s+/u, "")
    .replace(/^[-*]\s+/u, "")
    .replace(/\[([EOC]):[^\]]+\]/gu, "")
    .replace(/\*\*([^*]+)\*\*/gu, "$1")
    .replace(/`([^`]+)`/gu, "$1")
    .replace(/\s+/gu, " ")
    .trim();
}

function summaryText(value = "", limit = 190) {
  const text = plainText(value);
  return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
}

function labelledItem(value = "") {
  const text = value.replace(/^\s*(?:[-*]|\d+[.)])\s+/u, "").trim();
  const strong = text.match(/^\*\*([^*]+)\*\*[：:]?\s*(.*)$/u);
  if (strong) {
    const inner = strong[1].match(/^([^：:]+)[：:]\s*(.+)$/u);
    return inner
      ? { label: inner[1], text: inner[2] }
      : { label: strong[1].replace(/[：:]$/u, ""), text: strong[2].replace(/^[：:]\s*/u, "") };
  }
  const plain = text.match(/^([^：:]{1,32})[：:]\s*(.+)$/u);
  return plain ? { label: plain[1], text: plain[2] } : { label: "", text };
}

function renderSimpleLines(lines, { lead = false } = {}) {
  const html = [];
  let list = [];
  const flushList = () => {
    if (!list.length) return;
    html.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join("")}</ul>`);
    list = [];
  };
  for (const raw of nonempty(lines)) {
    const bullet = raw.match(/^\s*(?:[-*]|\d+[.)])\s+(.+)$/u);
    const subheading = raw.match(/^###\s+(.+)$/u) || raw.match(/^\*\*([^*]+)\*\*[：:]?$/u);
    if (bullet) {
      list.push(bullet[1]);
    } else {
      flushList();
      if (subheading) html.push(`<h3>${inline(subheading[1])}</h3>`);
      else html.push(`<p${lead && !html.length ? ' class="weekly-conclusion-lead"' : ""}>${inline(raw)}</p>`);
    }
  }
  flushList();
  return html.join("\n");
}

function parseGroups(lines, startPatterns) {
  const groups = [];
  let current = null;
  for (const raw of nonempty(lines)) {
    let match = null;
    for (const pattern of startPatterns) {
      match = raw.match(pattern);
      if (match) break;
    }
    if (match) {
      current = { marker: match[1] || "", title: match[2] || match[1] || "", suffix: match[3] || "", lines: [] };
      groups.push(current);
    } else if (current) {
      current.lines.push(raw);
    }
  }
  return groups;
}

function renderTrends(section) {
  const groups = parseGroups(section.lines, [
    /^###\s+(\d+)[.)、]?\s*(.+)$/u,
    /^(\d+)[.)]\s+\*\*(.+?)\*\*\s*(.*)$/u,
  ]);
  if (!groups.length) return renderSimpleLines(section.lines);
  return `<div class="weekly-trend-stack">${groups.map((group, index) => {
    const signal = group.title.match(/\s*([↑→↓]+)$/u);
    const title = signal ? group.title.slice(0, signal.index).trim() : group.title;
    return `<article class="weekly-trend-card"><span class="weekly-trend-rank">${String(group.marker || index + 1).padStart(2, "0")}</span><div class="weekly-trend-body"><div class="weekly-trend-head"><h3>${inline(title)}</h3>${signal || group.suffix ? `<span>${inline(signal?.[1] || group.suffix)}</span>` : ""}</div>${renderSimpleLines(group.lines)}</div></article>`;
  }).join("")}</div>`;
}

function renderChains(section) {
  const groups = parseGroups(section.lines, [
    /^###\s+(趋势链\s*[^：:]+)[：:]\s*(.+)$/u,
    /^\*\*(趋势链\s*[^：:]+)[：:]\s*(.+)\*\*$/u,
  ]);
  if (!groups.length) return renderSimpleLines(section.lines);
  return `<div class="weekly-chain-list">${groups.map((group) => {
    const steps = group.lines.filter((line) => /^\s*[-*]\s+/u.test(line)).map((line) => labelledItem(line));
    const prose = group.lines.filter((line) => !/^\s*[-*]\s+/u.test(line));
    return `<article class="weekly-chain-card"><div class="weekly-chain-head"><div><span>${inline(group.marker)}</span><h3>${inline(group.title)}</h3></div>${prose.length ? `<p>${inline(prose.join(" "))}</p>` : ""}</div><ol class="weekly-chain-steps">${steps.map((step) => `<li>${step.label ? `<b>${inline(step.label)}</b>` : ""}<span>${inline(step.text)}</span></li>`).join("")}</ol></article>`;
  }).join("")}</div>`;
}

function renderImpacts(section) {
  const cards = [];
  let groupLabel = "影响";
  for (const line of nonempty(section.lines)) {
    const group = line.match(/^\*\*([^*]+)\*\*[：:]?$/u);
    if (group) {
      groupLabel = group[1];
      continue;
    }
    if (!/^\s*[-*]\s+/u.test(line)) continue;
    const item = labelledItem(line);
    const level = item.text.match(/^(极高|高|中高|中|中低|低)[。.]?/u);
    const detail = level ? item.text.slice(level[0].length).trim() : item.text;
    cards.push(`<article class="weekly-impact-card${level && /^(极高|高)$/u.test(level[1]) ? " is-hot" : ""}"><div class="weekly-impact-head"><h3>${inline(item.label || groupLabel)}</h3><span>${inline(level?.[1] || groupLabel)}</span></div><p>${inline(detail)}</p></article>`);
  }
  return cards.length ? `<div class="weekly-impact-grid">${cards.join("")}</div>` : renderSimpleLines(section.lines);
}

function opportunityHeading(value) {
  const text = value.replace(/^###\s+/u, "").replace(/^\*\*|\*\*$/gu, "").trim();
  const match = text.match(/^(机会(?:卡)?\s*[一二三四五六七八九十\d]+)[：:]\s*(.*?)(?:[，,]\s*(-?\d+\s*\/\s*100))?$/u);
  return match ? { label: match[1], title: match[2], score: match[3] || "" } : { label: "机会", title: text, score: "" };
}

function renderOpportunities(section) {
  const groups = parseGroups(section.lines, [
    /^(###\s+机会(?:卡)?\s*[一二三四五六七八九十\d]+[：:].*)$/u,
    /^(\*\*机会(?:卡)?\s*[一二三四五六七八九十\d]+[：:].*\*\*)$/u,
  ]);
  if (!groups.length) return renderSimpleLines(section.lines);
  return `<div class="weekly-opportunity-list">${groups.map((group) => {
    const heading = opportunityHeading(group.title);
    const metadata = [];
    const scores = [];
    let inScores = false;
    for (const line of group.lines) {
      if (!/^\s*[-*]\s+/u.test(line)) continue;
      const item = labelledItem(line);
      if (/^评分$/u.test(item.label)) { inScores = true; continue; }
      if (inScores) scores.push(item);
      else metadata.push(item);
    }
    const total = scores.find((item) => item.label === "总分")?.text.match(/-?\d+\s*\/\s*100/u)?.[0] || heading.score;
    return `<article class="weekly-opportunity-card"><div class="weekly-opportunity-head"><div><span>${inline(heading.label)}</span><h3>${inline(heading.title)}</h3></div>${total ? `<strong>${inline(total)}</strong>` : ""}</div><dl class="weekly-opportunity-meta">${metadata.map((item) => `<div><dt>${inline(item.label || "要点")}</dt><dd>${inline(item.text)}</dd></div>`).join("")}</dl>${scores.length ? `<div class="weekly-score-list" aria-label="机会评分">${scores.filter((item) => item.label !== "总分").map((item) => { const score = item.text.match(/(-?\d+)\s*\/\s*(\d+)/u); const width = score ? Math.max(0, Math.min(100, Math.round(Math.abs(Number(score[1])) / Number(score[2]) * 100))) : 0; const note = score ? item.text.slice((score.index || 0) + score[0].length).replace(/^[（(]|[）)]$/gu, "").trim() : ""; return `<div><span>${inline(item.label)}</span><i style="--score:${width}%;"></i><b>${inline(score?.[1] || item.text)}</b><em>${inline(note)}</em></div>`; }).join("")}</div>` : ""}</article>`;
  }).join("")}</div>`;
}

function renderContrarian(section) {
  const lines = nonempty(section.lines);
  const preferred = lines.find((line) => /^\*\*反共识判断/u.test(line)) || lines[0] || "";
  return `<blockquote><p>${inline(preferred)}</p></blockquote>${renderSimpleLines(lines.filter((line) => line !== preferred))}`;
}

function renderWatchlist(section) {
  const items = nonempty(section.lines).filter((line) => /^\s*(?:[-*]|\d+[.)])\s+/u.test(line)).map((line) => labelledItem(line));
  return items.length ? `<div class="weekly-watch-grid">${items.map((item, index) => `<article class="weekly-watch-card"><span>${String(index + 1).padStart(2, "0")}</span><h3>${inline(item.label || `观察项 ${index + 1}`)}</h3><p>${inline(item.text)}</p></article>`).join("")}</div>` : renderSimpleLines(section.lines);
}

function actionGroups(section) {
  const actions = [];
  let current = null;
  for (const line of nonempty(section?.lines || [])) {
    const heading = line.match(/^\*\*([^*]+)\*\*[：:]?$/u);
    const numbered = line.match(/^\d+[.)]\s+(.+)$/u);
    if (heading) {
      current = { label: heading[1].replace(/[：:]$/u, ""), lines: [] };
      actions.push(current);
    } else if (numbered) {
      const item = labelledItem(numbered[1]);
      actions.push({ label: item.label || `行动 ${actions.length + 1}`, lines: [item.text] });
      current = null;
    } else if (/^\s*[-*]\s+/u.test(line) && current) {
      current.lines.push(line.replace(/^\s*[-*]\s+/u, ""));
    }
  }
  return actions;
}

function renderActions(section) {
  const actions = actionGroups(section);
  return actions.length ? `<div class="weekly-action-grid">${actions.map((action) => `<article class="weekly-action-item"><h3>${inline(action.label)}</h3>${action.lines.map((line) => `<p>${inline(line)}</p>`).join("")}</article>`).join("")}</div>` : renderSimpleLines(section.lines);
}

function renderSection(section) {
  const renderers = { "2": renderTrends, "3": renderChains, "4": renderImpacts, "5": renderOpportunities, "6": renderContrarian, "7": renderWatchlist, "8": renderActions };
  const content = section.number === "1" ? renderSimpleLines(section.lines, { lead: true }) : (renderers[section.number]?.(section) || renderSimpleLines(section.lines));
  const label = section.number === "0" ? "Evidence" : String(section.number).padStart(2, "0");
  return `<section class="weekly-report-section${section.number === "0" ? " weekly-report-method" : ""}" id="section-${section.number}" aria-labelledby="section-${section.number}-title"><p class="weekly-report-section-label">${label}</p><h2 id="section-${section.number}-title">${inline(section.title)}</h2>${content}</section>`;
}

export function renderBody(markdown) {
  const sections = parseReportSections(markdown);
  return [...sections.filter((section) => section.number !== "0"), ...sections.filter((section) => section.number === "0")].map(renderSection).join("\n");
}

function evidenceTags(markdown) {
  return [
    ["Signals", "张"],
    ["Opinions", "条"],
    ["Community", "条"],
  ].map(([label, unit]) => {
    const direct = markdown.match(new RegExp(`${label}\\s*[:：]\\s*(\\d+)`, "u"))?.[1];
    const narrative = markdown.match(new RegExp(`${label}[^\\n]*?(\\d+)\\s*${unit}`, "u"))?.[1];
    const value = direct || narrative;
    return value ? `<span>${label} ${value} ${unit}</span>` : "";
  }).filter(Boolean).join("");
}

function renderFastRead(markdown) {
  const sections = parseReportSections(markdown);
  const conclusion = nonempty(sections.find((section) => section.number === "1")?.lines || []);
  const watch = nonempty(sections.find((section) => section.number === "7")?.lines || []);
  const cards = [
    ["核心变化", conclusion[0]],
    ["判断重点", conclusion[1] || nonempty(sections.find((section) => section.number === "2")?.lines || [])[0]],
    ["下周验证", watch[0]],
  ].filter(([, value]) => value);
  return `<section class="weekly-fast-read" aria-labelledby="weekly-fast-title"><div class="weekly-fast-head"><div><p class="weekly-report-source-label">This Issue</p><h2 id="weekly-fast-title">本期快读</h2></div></div><div class="weekly-proof-tags" aria-label="本期证据规模">${evidenceTags(markdown)}</div><div class="weekly-fast-grid">${cards.map(([label, value]) => `<article class="weekly-fast-card"><p class="weekly-fast-label">${label}</p><p>${escapeHtml(summaryText(value))}</p></article>`).join("")}</div></section>`;
}

function renderActionPanel(markdown) {
  const actions = actionGroups(parseReportSections(markdown).find((item) => item.number === "8")).slice(0, 3);
  if (!actions.length) return "";
  return `<section class="weekly-actions-panel" aria-labelledby="weekly-actions-title"><p class="weekly-report-source-label">Action Lens</p><h2 id="weekly-actions-title">本期行动判断</h2><div class="weekly-action-grid">${actions.map((action) => `<article class="weekly-action-item"><h3>${inline(action.label)}</h3><p>${inline(action.lines[0] || "")}</p></article>`).join("")}</div></section>`;
}

function renderRail(markdown) {
  const sections = parseReportSections(markdown);
  const ordered = [...sections.filter((section) => section.number !== "0"), ...sections.filter((section) => section.number === "0")];
  return `<aside class="weekly-report-rail" aria-label="报告目录"><p class="weekly-report-source-label">Sections</p>${ordered.map((section) => `<a href="#section-${section.number}">${section.number === "0" ? "Evidence" : String(section.number).padStart(2, "0")} ${escapeHtml(section.title)}</a>`).join("")}</aside>`;
}

function renderReportSelector(metadata) {
  const label = kind === "weekly" ? "时间窗口" : "报告月份";
  const aria = kind === "weekly" ? "选择周报时间窗口" : "选择月报月份";
  return `<label class="weekly-report-window"><span>${label}</span><select aria-label="${aria}" data-periodic-report-selector>${discoverPublishedReports(root, kind).map((report) => `<option value="${escapeHtml(report.route)}"${report.date === metadata.date ? " selected" : ""}>${escapeHtml(formatReportWindow(report))}</option>`).join("")}</select></label>`;
}

function shell(metadata, content, markdown) {
  const typeLabel = kind === "weekly" ? "周报" : "月报";
  const sourceMetaName = kind === "weekly" ? "weekly-report-source" : "monthly-report-source";
  return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="wavesight-version" content="SITE-V4.2.0-entity-history"><meta name="wavesight-column-version" content="${REPORTS_CENTER_VERSION}">
<meta name="${sourceMetaName}" content="${escapeHtml(metadata.source)}"><title>${escapeHtml(metadata.title)}｜观澜 AI</title>
<link rel="icon" href="assets/brand/logo-wavesight-reference-symbol.svg" type="image/svg+xml"><link rel="stylesheet" href="assets/data-center-v4.css"><link rel="stylesheet" href="assets/weekly-report.css"></head>
<body class="weekly-report-page dc-report-page"><header class="dc-header"><a class="dc-brand" href="data-center.html" aria-label="观澜 AI 数据中心"><img src="assets/brand/logo-wavesight-reference-horizontal.svg" alt="观澜 AI Wavesight AI"></a><button class="dc-nav-toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="dc-sidebar">栏目</button></header>
<div class="dc-layout"><aside class="dc-sidebar" id="dc-sidebar" data-sidebar><nav aria-label="数据中心与应用中心"><section class="dc-nav-group"><h2>数据中心</h2><a href="data-center.html?view=events">商业事件</a><a href="data-center.html?view=fde">FDE 实施</a><a href="data-center.html?view=hardware">AI 硬件</a><a href="data-center.html?view=community">社群情报</a><a href="data-center.html?view=viewpoints">一线观点</a><a href="data-center.html?view=index">实体索引</a></section><section class="dc-nav-group dc-nav-apps"><h2>应用中心</h2><a href="trend-radar.html">变化雷达</a><a href="intelligence-map.html" aria-current="page">行业报告</a><a href="opportunity-map.html">机会地图</a></section></nav></aside>
<main class="weekly-report-shell dc-main dc-report-detail-main" id="main-content"><section class="weekly-report-hero" aria-labelledby="weekly-report-title"><div><p class="weekly-report-kicker">${kind === "weekly" ? "Weekly Business Radar" : "Monthly Business Report"}</p><div class="weekly-report-title-row"><h1 id="weekly-report-title">${escapeHtml(metadata.title)}</h1>${renderReportSelector(metadata)}</div></div></section>${kind === "weekly" ? `${renderFastRead(markdown)}${renderActionPanel(markdown)}` : ""}<div class="weekly-report-layout">${renderRail(markdown)}<article class="weekly-report-reader" aria-label="${typeLabel}正文">${content}</article></div></main></div><script src="assets/v4-report-shell.js"></script><script>(()=>{const selector=document.querySelector("[data-periodic-report-selector]");selector?.addEventListener("change",()=>{if(selector.value)window.location.assign(selector.value);});})();</script></body></html>\n`;
}

function promote(text) {
  return text.replace(/^status:\s*draft$/mu, "status: published");
}

function featureCard(reportKind, report) {
  const isWeekly = reportKind === "weekly";
  const label = isWeekly ? "最新周报" : "最新月报";
  const summary = isWeekly
    ? "追踪最近一周 AI 商业变化，聚焦供给、需求与交付责任的结构性变化。"
    : "回看当月 AI 商业结构变化，聚焦部署交付、企业实施与下一阶段需验证的行业信号。";
  const action = isWeekly ? "打开周报" : "打开月报";
  return `<article class="report-feature-card is-${reportKind}">
            <div>
              <div class="report-meta"><p class="report-label">${label}</p><p class="report-date">${escapeHtml(formatReportWindow(report))}</p></div>
              <h2>${escapeHtml(report.title)}</h2>
              <p class="report-summary">${summary}</p>
            </div>
            <a class="report-link" href="${escapeHtml(report.route)}">${action}</a>
          </article>`;
}

function archiveCard(report) {
  const window = (report.window || report.month || report.date || "").replace(" to ", " - ");
  return `<a href="${escapeHtml(report.route)}"><time>${escapeHtml(window)}</time><strong>${escapeHtml(report.title)}</strong><span>阅读</span></a>`;
}

export function refreshReportCenterHtml(html, rootDir = root) {
  for (const reportKind of ["weekly", "monthly"]) {
    const reports = discoverPublishedReports(rootDir, reportKind);
    if (!reports.length) throw new Error(`published_${reportKind}_report_missing`);
    html = html.replace(
      new RegExp(`<article class="report-feature-card is-${reportKind}">[\\s\\S]*?<\\/article>`, "u"),
      featureCard(reportKind, reports[0]),
    );
    const archive = reports
      .filter((report) => fs.existsSync(path.join(rootDir, "01-SiteV2", "site", report.route)))
      .map(archiveCard)
      .join("\n                ");
    html = html.replace(
      new RegExp(`(<div class="report-list ${reportKind}-list"[^>]*>)[\\s\\S]*?(<\\/div>)`, "u"),
      `$1\n                ${archive}\n              $2`,
    );
  }
  return html;
}

function updateIntelligenceMap() {
  const file = path.join(root, "01-SiteV2", "site", "intelligence-map.html");
  const html = refreshReportCenterHtml(fs.readFileSync(file, "utf8"), root);
  fs.writeFileSync(file, html, "utf8");
}

function main() {
  if (args.get("refresh-index") === "true") {
    updateIntelligenceMap();
    console.log(JSON.stringify({ ok: true, action: "refresh-index" }, null, 2));
    return;
  }
  if (!new Set(["weekly", "monthly"]).has(kind) || !date) throw new Error("kind and date are required");
  const contentFile = kind === "weekly"
    ? path.join(root, "01-SiteV2", "content", "08-report", `${date}--weekly-report--ai-business-change-radar.md`)
    : path.join(root, "01-SiteV2", "content", "08-report", "monthly", `${date}--monthly-report--ai-business-structure-and-opportunity.md`);
  let markdown = fs.readFileSync(contentFile, "utf8");
  const parsed = parseFrontmatter(markdown);
  const rebuildPublished = args.get("rebuild-published") === "true";
  if (parsed.values.status === "draft") {
    markdown = promote(markdown);
    fs.writeFileSync(contentFile, markdown, "utf8");
    if (kind === "weekly") fs.writeFileSync(path.join(root, "agent-workflow", "reports", `${date}-weekly-ai-business-change-radar.md`), markdown, "utf8");
  } else if (!(rebuildPublished && parsed.values.status === "published")) {
    throw new Error("renderer_requires_gate_accepted_draft_or_explicit_published_rebuild");
  }
  const promoted = parseFrontmatter(markdown);
  const route = reportRoute(kind, promoted.values);
  const source = path.relative(root, contentFile).replace(/\\/gu, "/");
  const page = shell({ ...promoted.values, source }, renderBody(promoted.body), promoted.body);
  const routeFile = path.join(root, "01-SiteV2", "site", route);
  fs.writeFileSync(routeFile, page, "utf8");
  const latest = discoverPublishedReports(root, kind)[0];
  if (kind === "weekly" && latest?.date === promoted.values.date) fs.writeFileSync(path.join(root, "01-SiteV2", "site", "weekly-ai-business-change-radar.html"), page, "utf8");
  updateIntelligenceMap();
  console.log(JSON.stringify({ ok: true, kind, date, route, source }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
