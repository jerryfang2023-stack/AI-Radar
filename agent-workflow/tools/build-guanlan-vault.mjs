#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import {
  GUANLAN_VAULT_NAME,
  GUANLAN_VAULT_PATHS,
  REPOSITORY_CONTENT_PATHS,
  resolveGuanlanVaultRoot,
} from "./guanlan-vault-paths.mjs";

const root = process.cwd();
const args = new Set(process.argv.slice(2));
const fresh = args.has("--fresh");
const vaultRoot = resolveGuanlanVaultRoot(root);
const generatedFiles = [];
const siteBase = "https://jerryfang2023-stack.github.io/AI-Radar";
const generatedDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Shanghai",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function readJson(relativePath, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), "utf8"));
  } catch {
    return fallback;
  }
}

function text(value, fallback = "—") {
  const normalized = String(value ?? "").replace(/\s+/gu, " ").trim();
  return normalized || fallback;
}

function number(value) {
  return Number.isFinite(Number(value)) ? Number(value).toLocaleString("en-US") : "0";
}

function yaml(title, source = "WaveSight V4") {
  return [
    "---",
    `title: ${title}`,
    `status: current`,
    `updated: ${generatedDate}`,
    `source: ${source}`,
    "---",
    "",
  ].join("\n");
}

function write(relativePath, content) {
  const output = path.resolve(vaultRoot, relativePath);
  if (output !== vaultRoot && !output.startsWith(`${vaultRoot}${path.sep}`)) {
    throw new Error(`Refusing to write outside Guanlan Vault: ${relativePath}`);
  }
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, `${content.trimEnd()}\n`, "utf8");
  generatedFiles.push(relativePath.replaceAll("\\", "/"));
}

function listRows(items, render, empty = "暂无当前记录。") {
  return items.length ? items.map(render).join("\n") : empty;
}

function currentItems(items, dateFields, limit = 20) {
  return [...items]
    .sort((left, right) => {
      const leftDate = dateFields.map((field) => left?.[field]).find(Boolean) || "";
      const rightDate = dateFields.map((field) => right?.[field]).find(Boolean) || "";
      return String(rightDate).localeCompare(String(leftDate));
    })
    .slice(0, limit);
}

function filename(value, fallback = "untitled") {
  const normalized = text(value, fallback)
    .replace(/[<>:"/\\|?*\u0000-\u001F]/gu, "-")
    .replace(/\s+/gu, " ")
    .replace(/[. ]+$/gu, "")
    .slice(0, 96);
  return normalized || fallback;
}

function bullets(items, render = (item) => text(item), empty = "未披露") {
  return Array.isArray(items) && items.length
    ? items.map((item) => `- ${render(item)}`).join("\n")
    : `- ${empty}`;
}

function metricText(metric) {
  if (typeof metric === "string") return metric;
  return [metric?.label, metric?.value, metric?.unit].filter(Boolean).join("：");
}

function copyIndustryReports() {
  const sourceRoot = path.join(root, REPOSITORY_CONTENT_PATHS.industryReportsRoot);
  if (!fs.existsSync(sourceRoot)) return [];
  const copied = [];
  const stack = [sourceRoot];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const source = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(source);
        continue;
      }
      if (!entry.isFile() || path.extname(entry.name).toLowerCase() !== ".md" || entry.name === "README.md") continue;
      const sourceRelative = path.relative(sourceRoot, source);
      const targetRelative = path.join(GUANLAN_VAULT_PATHS.industryReportArchive, sourceRelative).replaceAll("\\", "/");
      write(targetRelative, fs.readFileSync(source, "utf8"));
      copied.push(targetRelative);
    }
  }
  return copied.sort();
}

if (fresh && fs.existsSync(vaultRoot)) {
  throw new Error(`Fresh build refused because target already exists: ${vaultRoot}`);
}
const previousManifestPath = path.join(vaultRoot, ".guanlan-generated.json");
const previousGeneratedFiles = fs.existsSync(previousManifestPath)
  ? (() => {
      try {
        const manifest = JSON.parse(fs.readFileSync(previousManifestPath, "utf8"));
        return Array.isArray(manifest.generatedFiles) ? manifest.generatedFiles : [];
      } catch {
        return [];
      }
    })()
  : [];
fs.mkdirSync(vaultRoot, { recursive: true });

const manifest = readJson("01-SiteV2/site/data/data-center-v4/manifest.json");
const eventIndex = readJson("01-SiteV2/site/data/data-center-v4/indexes/events.json", { events: [] });
const fdeIndex = readJson("01-SiteV2/site/data/data-center-v4/indexes/fde.json", { fde: [] });
const fdeDetails = readJson("01-SiteV2/site/data/data-center-v4/details/fde.json", { fde: [] });
const hardwareIndex = readJson("01-SiteV2/site/data/data-center-v4/indexes/hardware.json", { hardware: [] });
const hardwareDetails = readJson("01-SiteV2/site/data/data-center-v4/details/hardware.json", { hardware: [] });
const funding = readJson("01-SiteV2/site/data/funding-insights-v1.json", { cards: [] });
const trend = readJson("01-SiteV2/site/data/trend-radar-v1.json");
const opportunity = readJson("01-SiteV2/site/data/opportunity-evidence-v2.json", { evidence: [], directionCards: [] });
const viewpoints = readJson("01-SiteV2/site/data/first-line-viewpoints-v4.json", { builders: [], remarks: [] });
const community = readJson("01-SiteV2/site/data/community-intelligence.json", { items: [], links: [] });
const ops = readJson("01-SiteV2/site/data/ops-console.json");
const counts = manifest.counts || {};
const latestEvents = currentItems(eventIndex.events || [], ["dataDate", "date"], 24);
const latestFde = currentItems(fdeIndex.fde || [], ["dataDate", "date"], 16);
const latestHardware = currentItems(hardwareIndex.hardware || [], ["dataDate", "date"], 16);
const latestFunding = currentItems(funding.cards || [], ["date", "published_at"], 16);
const latestRemarks = currentItems(viewpoints.remarks || [], ["date", "publishedAt"], 16);
const latestCommunity = currentItems(community.items || [], ["date", "publishedAt"], 16);
const reportFiles = copyIndustryReports();

write(".obsidian/app.json", JSON.stringify({
  newFileLocation: "folder",
  newFileFolderPath: "90-工作区",
  attachmentFolderPath: "90-工作区/附件",
  useMarkdownLinks: false,
  showUnsupportedFiles: false,
}, null, 2));

write("README.md", `${yaml("观澜 AI Vault", "WaveSight V4 current-state projection")}# 观澜 AI Vault

这是一个从 WaveSight V4 当前事实、产品与运行状态重新生成的独立知识库。

- 它只包含当前 V4 运营所需的知识入口与可读投影。
- WaveSight 仓库是事实与运行源；本 Vault 是只读现状投影。
- 个人记录统一写入 [[90-工作区/README|工作区]]，不会反向覆盖生产数据。

从 [[00-总览/观澜 AI|观澜 AI 总览]] 开始。`);

write(GUANLAN_VAULT_PATHS.home, `${yaml("观澜 AI")}# 观澜 AI

> 面向观澜 AI 当前状态的独立工作台。数据日期：${text(manifest.currentDate)}。

## 当前入口

- [[10-系统现状/当前版本|当前版本]]
- [[10-系统现状/产品地图|产品地图]]
- [[20-数据中心/数据中心总览|数据中心]]
- [[30-应用中心/应用中心总览|应用中心]]
- [[40-运营中心/网站运营总台|网站运营总台]]
- [[40-运营中心/运行状态|运行状态]]
- [[60-知识资产/知识资产总览|知识资产]]
- [[50-规则与契约/事实数据边界|事实数据边界]]

## 当前规模

| 资产 | 数量 |
|---|---:|
| 商业事件 | ${number(counts.events)} |
| 公司 | ${number(counts.companies)} |
| 产品 | ${number(counts.products)} |
| 人物 | ${number(counts.people)} |
| 事实关系 | ${number(counts.relationships)} |
| FDE 记录 | ${number(counts.fde)} |
| AI 硬件记录 | ${number(counts.hardware)} |

## 使用边界

这里展示“现在是什么”，不保存 V1/V2/V3 迁移过程、临时 QC 报告、浏览器缓存或代码文件。`);

write(GUANLAN_VAULT_PATHS.currentVersion, `${yaml("当前版本")}# 当前版本

| 层 | 当前版本 |
|---|---|
| 站点 | SITE-V4.3.0 compatibility retired |
| 数据中心 | ${text(manifest.dataVersion)} |
| 实体 | ${text(manifest.entityVersion)} |
| 关系 | ${text(manifest.relationshipVersion)} |
| Raw | RAW-V4.0 |
| Event | EVENT-V1.1 |
| Tags | TAG-V4.0 |
| Opportunity Map | ${text(opportunity.meta?.applicationVersion)} |
| Trend Radar | ${text(trend.meta?.columnVersion)} |
| Funding Insights | ${text(funding.meta?.column_version)} |
| OPS | ${text(ops.meta?.version)} |

- 当前数据日：${text(manifest.currentDate)}
- 数据生成时间：${text(manifest.generatedAt)}
- V3 活跃接口：0`);

write(GUANLAN_VAULT_PATHS.productMap, `${yaml("产品地图")}# 产品地图

## 数据中心

- [商业事件](${siteBase}/data-center.html?view=events)
- [实体索引](${siteBase}/data-center.html?view=index)
- [一线观点](${siteBase}/data-center.html?view=viewpoints)
- [社群情报](${siteBase}/data-center.html?view=community)

## 应用中心

- [行业报告](${siteBase}/intelligence-map.html)
- [融资洞察](${siteBase}/funding-insights.html)
- [机会地图](${siteBase}/opportunity-map.html)
- [变化雷达](${siteBase}/trend-radar.html)

## 运营

- [OPS 仪表盘](${siteBase}/operations-console.html)`);

write(GUANLAN_VAULT_PATHS.dataCenterOverview, `${yaml("数据中心总览")}# 数据中心总览

数据中心只保存可追溯事实，不输出推荐、机会判断或行动建议。

| 数据 | 数量 |
|---|---:|
| Events | ${number(counts.events)} |
| Companies | ${number(counts.companies)} |
| Products | ${number(counts.products)} |
| People | ${number(counts.people)} |
| Relationships | ${number(counts.relationships)} |
| FDE | ${number(counts.fde)} |
| Hardware | ${number(counts.hardware)} |

- [[最新商业事件]]
- [[企业 AI 与 FDE]]
- [[AI 硬件]]
- [[一线观点]]
- [[社群情报]]`);

write(GUANLAN_VAULT_PATHS.commercialEvents, `${yaml("最新商业事件")}# 最新商业事件

共 ${number(eventIndex.events?.length)} 条，以下为最近 ${latestEvents.length} 条。

${listRows(latestEvents, (item) => `- **${text(item.dataDate || item.date)} · ${text(item.eventTypeLabel || item.eventType)}** ${text(item.title)}${item.sourceUrl ? ` — [来源](${item.sourceUrl})` : ""}`)}

[打开完整商业事件](${siteBase}/data-center.html?view=events)`);

write(GUANLAN_VAULT_PATHS.fde, `${yaml("企业 AI 与 FDE")}# 企业 AI 与 FDE

当前记录：${number(fdeIndex.fde?.length)}。

${listRows(latestFde, (item) => `- **${text(item.dataDate || item.date)}** ${text(item.title || item.name || item.company)}${item.sourceUrl ? ` — [来源](${item.sourceUrl})` : ""}`)}

[打开企业 AI / FDE](${siteBase}/data-center.html?view=fde)`);

write(GUANLAN_VAULT_PATHS.hardware, `${yaml("AI 硬件")}# AI 硬件

当前记录：${number(hardwareIndex.hardware?.length)}。

${listRows(latestHardware, (item) => `- **${text(item.dataDate || item.date)}** ${text(item.title || item.name || item.company)}${item.sourceUrl ? ` — [来源](${item.sourceUrl})` : ""}`)}

[打开 AI 硬件](${siteBase}/data-center.html?view=hardware)`);

write(GUANLAN_VAULT_PATHS.viewpoints, `${yaml("一线观点")}# 一线观点

- Builders：${number(viewpoints.builders?.length)}
- 已发布观点：${number(viewpoints.remarks?.length)}
- 最新数据日：${text(viewpoints.meta?.latestDate)}

${listRows(latestRemarks, (item) => `- **${text(item.date)} · ${text(item.builderName || item.author || item.name)}** ${text(item.zhText || item.textZh || item.text || item.title)}${item.url ? ` — [原文](${item.url})` : ""}`)}

一线观点是独立阅读栏目，不作为商业事实证据。`);

write(GUANLAN_VAULT_PATHS.community, `${yaml("社群情报")}# 社群情报

- 当前条目：${number(community.items?.length)}
- 文档链接：${number(community.links?.length)}
- 数据日期：${text(community.meta?.date)}

${listRows(latestCommunity, (item) => `- **${text(item.source || item.category)}** ${text(item.title || item.summary || item.content)}${item.url ? ` — [查看](${item.url})` : ""}`)}

社群内容是线索；只有经过原始来源捕获和 Claim 门禁后才能进入事实层。`);

write(GUANLAN_VAULT_PATHS.applicationCenterOverview, `${yaml("应用中心总览")}# 应用中心总览

应用中心消费 V4 事实，但其报告、趋势、机会和资本判断不回写事实层。

- [[行业报告]]
- [[融资洞察]]
- [[机会地图]]
- [[变化雷达]]`);

write(GUANLAN_VAULT_PATHS.industryReports, `${yaml("行业报告")}# 行业报告

当前归档 ${reportFiles.length} 份。

${listRows(reportFiles, (file) => `- [[${file.replace(/\.md$/u, "")}|${path.basename(file, ".md")}]]`)}

[打开线上报告中心](${siteBase}/intelligence-map.html)`);

write(GUANLAN_VAULT_PATHS.fundingInsights, `${yaml("融资洞察")}# 融资洞察

- 已发布卡片：${number(funding.cards?.length)}
- 最新日期：${text(funding.meta?.latest_date)}
- 自动发布：${funding.meta?.automatic_publication === true ? "是" : "否"}

${listRows(latestFunding, (item) => `- **${text(item.date || item.published_at)}** ${text(item.title || item.company_name || item.company)}${item.source_url ? ` — [来源](${item.source_url})` : ""}`)}

[打开融资洞察](${siteBase}/funding-insights.html)`);

write(GUANLAN_VAULT_PATHS.opportunityMap, `${yaml("机会地图")}# 机会地图

- 证据：${number(opportunity.evidence?.length)}
- 已审方向卡：${number(opportunity.directionCards?.length)}
- 活跃日期：${text(opportunity.meta?.activeDate)}
- 版本：${text(opportunity.meta?.applicationVersion)}

机会地图是应用层，不是 AI Startup Radar，也不进入 V4 事实表。

[打开机会地图](${siteBase}/opportunity-map.html)`);

write(GUANLAN_VAULT_PATHS.trendRadar, `${yaml("变化雷达")}# 变化雷达

- 最新数据日：${text(trend.meta?.latestDataDate)}
- 事件来源：${number(trend.meta?.sourceCounts?.events)}
- 实体来源：${number(trend.meta?.sourceCounts?.entities)}
- 关系来源：${number(trend.meta?.sourceCounts?.relationships)}
- 边界：${text(trend.meta?.boundary)}

[打开变化雷达](${siteBase}/trend-radar.html)`);

write(GUANLAN_VAULT_PATHS.siteOperations, `${yaml("网站运营总台")}# 网站运营总台

此页是观澜 AI 网站的本地运营入口。Vault 展示当前生产状态和必要知识资产；代码、Canonical JSON、站点数据与发布历史仍由 WaveSight Git 仓库负责。

## 日常顺序

1. 在 WaveSight 仓库完成数据采集、事实门禁与应用构建。
2. 通过 GitHub PR 合入 \`main\`，由 GitHub Pages 发布网站。
3. 本地同步 \`main\` 后运行 \`npm run sync:guanlan-vault\`。
4. 运行 \`npm run assert:guanlan-vault\`，确认目录、链接、资料数量与 V3 隔离边界。
5. 从本 Vault 的数据中心、应用中心和运营中心进入当天工作。

## 发布边界

- Vault 是单向生成的本地控制面，不直接参加 GitHub Actions。
- \`90-工作区\` 的人工笔记不会自动进入生产。
- 需要发布的内容必须先进入仓库对应的 V4 数据、应用或报告路径并通过门禁。
- 正式行业报告的仓库源位于 \`01-SiteV2/content/12-applications/industry-reports/\`。

## 网站入口

- [商业事件](${siteBase}/data-center.html?view=events)
- [行业报告](${siteBase}/intelligence-map.html)
- [融资洞察](${siteBase}/funding-insights.html)
- [机会地图](${siteBase}/opportunity-map.html)
- [变化雷达](${siteBase}/trend-radar.html)
- [OPS 仪表盘](${siteBase}/operations-console.html)`);

write(GUANLAN_VAULT_PATHS.operations, `${yaml("运行状态")}# 运行状态

| 项目 | 状态 |
|---|---|
| 日期 | ${text(ops.daily?.date || ops.meta?.date)} |
| 日运行 | ${text(ops.daily?.statusText || ops.daily?.status)} |
| 开放事故 | ${number(ops.inbox?.open)} |
| 已解决事故 | ${number(ops.inbox?.resolved)} |
| OPS 版本 | ${text(ops.meta?.version)} |

${Array.isArray(ops.daily?.issues) && ops.daily.issues.length
  ? ops.daily.issues.map((issue) => `- ${text(issue.message || issue.title || issue)}`).join("\n")
  : "当前没有记录中的开放问题。"}

[打开 OPS](${siteBase}/operations-console.html)`);

write(GUANLAN_VAULT_PATHS.automation, `${yaml("自动化与发布")}# 自动化与发布

\`\`\`text
外部来源
→ SourceArtifact / RawDocument
→ Claim / Entity / CanonicalEvent
→ V4 数据服务
→ 应用层
→ GitHub PR / main
→ GitHub Pages
→ 本地单向刷新观澜 AI Vault
\`\`\`

Vault 不参加 GitHub Actions，不保存代码，不反向修改生产数据。`);

write(GUANLAN_VAULT_PATHS.quality, `${yaml("质量门禁")}# 质量门禁

- Claim 必须引用 RawDocument 精确原文片段。
- Event 必须解析到 Claim 和 SourceArtifact。
- FDE、硬件、关系、标签必须受证据边界约束。
- 缺失和冲突必须显式保留。
- Canonical 层禁止机会、价值、成熟度、建议和行动判断。
- V3 Card、Pool、desk、graph 与兼容接口不得恢复。`);

write(GUANLAN_VAULT_PATHS.dataBoundary, `${yaml("事实数据边界")}# 事实数据边界

## 可以进入事实层

- 原始来源快照
- 精确引用 Claim
- 实体与规范事件
- 有 Claim 和 SourceArtifact 支撑的关系、FDE、硬件与标签

## 只能留在应用层

- 趋势组织
- 机会判断
- 融资研究判断
- 周报和月报叙事
- 推荐、建议与行动方向`);

write(GUANLAN_VAULT_PATHS.contracts, `${yaml("当前契约")}# 当前契约

| 契约 | 版本 |
|---|---|
| Raw | RAW-V4.0 |
| Event | EVENT-V1.1 |
| Entity | ENTITY-V1.0 |
| Relation | RELATION-V2.1 |
| Backfill | BACKFILL-V1.0 |
| FDE | FDE-V2.0 |
| Hardware | HARDWARE-V1.0 |
| Tag | TAG-V4.0 |
| Reports | REPORTS-V1.1.0-lane-independent |
| Opportunity Map | OMAP-V2.0.0-v4-evidence |
| Trend Radar | TRADAR-V1.0.0-factual-change-explorer |`);

const fdeAssetFiles = (fdeDetails.fde || []).map((item) => {
  const relativePath = `${GUANLAN_VAULT_PATHS.fdeArchive}/${filename(item.date || item.dataDate)}--${filename(item.customer || item.vendor || item.title)}--${filename(item.id)}.md`;
  write(relativePath, `${yaml(text(item.title), "Data Center V4 FDE")}# ${text(item.title)}

| 字段 | 内容 |
|---|---|
| 事实日期 | ${text(item.date)} |
| 数据日期 | ${text(item.dataDate)} |
| 客户 | ${text(item.customer)} |
| 服务商 | ${text(item.vendor)} |
| 行业 | ${text(item.industry)} |
| 用例 | ${text(item.useCase)} |
| 阶段 | ${text(item.stageLabel || item.stage)} |

## 已披露需求

${text(item.reportedNeed)}

## 交付组成

${bullets(item.deliveryComponents)}

## 已披露结果

${bullets(item.outcomes)}

## 指标

${bullets(item.metrics, metricText)}

${item.sourceUrl ? `[原始来源](${item.sourceUrl})` : "原始来源未披露。"}`);
  return relativePath;
});

const hardwareAssetFiles = (hardwareDetails.hardware || []).map((item) => {
  const relativePath = `${GUANLAN_VAULT_PATHS.hardwareArchive}/${filename(item.date || item.dataDate)}--${filename(item.supplier || item.title)}--${filename(item.id)}.md`;
  write(relativePath, `${yaml(text(item.title), "Data Center V4 Hardware")}# ${text(item.title)}

| 字段 | 内容 |
|---|---|
| 事实日期 | ${text(item.date)} |
| 数据日期 | ${text(item.dataDate)} |
| 类型 | ${text(item.eventTypeLabel || item.hardwareType)} |
| 供应商 | ${text(item.supplier)} |
| 客户 | ${text(item.customer)} |
| 制程 | ${text(item.processNode)} |
| 容量 | ${text([item.capacity, item.capacityUnit].filter(Boolean).join(" "))} |
| 地点 | ${text(item.site || item.region)} |
| 合同金额 | ${text(item.contractValue)} |
| 出货日期 | ${text(item.shipmentDate)} |

${item.sourceUrl ? `[原始来源](${item.sourceUrl})` : "原始来源未披露。"}`);
  return relativePath;
});

const fundingAssetFiles = (funding.cards || []).map((card) => {
  const company = card.company || {};
  const financing = card.financing || {};
  const analysis = card.analysis || {};
  const relativePath = `${GUANLAN_VAULT_PATHS.fundingArchive}/${filename(card.as_of_date)}--${filename(company.name)}--${filename(card.funding_insight_id)}.md`;
  write(relativePath, `${yaml(`${text(company.name)} 融资研究`, "Funding Insights V1")}# ${text(company.name)} 融资研究

| 字段 | 内容 |
|---|---|
| 研究日期 | ${text(card.as_of_date)} |
| 轮次 | ${text(financing.round)} |
| 金额 | ${text(financing.amount)} |
| 累计融资 | ${text(financing.total_raised)} |
| 总部 | ${text(company.headquarters)} |
| 产品分类 | ${text(card.application_category?.name)} |
| 发布状态 | ${text(card.publication_status)} |

## 公司与产品

${text(company.summary)}

## 投资方

${bullets(financing.investors, (investor) => `${text(investor.name)}${investor.role ? `（${investor.role}）` : ""}`)}

## 已验证信号

${bullets(analysis.validated_signals)}

## 风险

${bullets(analysis.risks)}

## 资本判断

${text(analysis.capital_judgment)}

## 研究来源

${bullets(card.research_sources, (source) => source?.source_url
    ? `[${text(source.title || source.publisher || source.source_id)}](${source.source_url})`
    : text(source?.source_id))}

${company.website ? `[公司网站](${company.website})` : ""}`);
  return relativePath;
});

const remarksByPerson = new Map();
for (const remark of viewpoints.remarks || []) {
  const key = text(remark.handle || remark.name, "unknown");
  if (!remarksByPerson.has(key)) remarksByPerson.set(key, []);
  remarksByPerson.get(key).push(remark);
}
const viewpointAssetFiles = [...remarksByPerson.entries()].map(([handle, remarks]) => {
  const ordered = currentItems(remarks, ["date", "createdAt"], Number.MAX_SAFE_INTEGER);
  const person = ordered[0] || {};
  const relativePath = `${GUANLAN_VAULT_PATHS.viewpointArchive}/${filename(person.name || handle)}--${filename(handle)}.md`;
  write(relativePath, `${yaml(text(person.name || handle), "First-Line Viewpoints V4")}# ${text(person.name || handle)}

- 账号：${handle}
- 角色：${text(person.role)}
- 已发布观点：${ordered.length}

## 时间线

${listRows(ordered, (item) => `- **${text(item.date)} · ${text(item.topic)}** ${text(item.contentTranslation || item.translation || item.content || item.text)}${item.url ? ` — [原文](${item.url})` : ""}`)}

> 一线观点不作为商业事件、关系或趋势证据。`);
  return relativePath;
});

const communityDailyRoot = path.join(root, "01-SiteV2", "site", "data", "community-intelligence-daily");
const communityAssetFiles = fs.existsSync(communityDailyRoot)
  ? fs.readdirSync(communityDailyRoot)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name))
    .sort()
    .map((name) => {
      const daily = readJson(path.join("01-SiteV2/site/data/community-intelligence-daily", name), { items: [] });
      const date = name.replace(/\.json$/u, "");
      const relativePath = `${GUANLAN_VAULT_PATHS.communityArchive}/${date} 社群资料.md`;
      write(relativePath, `${yaml(`${date} 社群资料`, "Community Intelligence")}# ${date} 社群资料

- 条目：${number(daily.items?.length)}
- 文档链接：${number(daily.links?.length)}

${listRows(daily.items || [], (item) => `- **${text(item.sourceName || item.source)} · ${text(item.insightType)}** ${text(item.title || item.summary)}${item.url ? ` — [查看](${item.url})` : ""}`)}

> 社群内容是线索，不能直接进入 V4 事实层。`);
      return relativePath;
    })
  : [];

write(GUANLAN_VAULT_PATHS.knowledgeAssets, `${yaml("知识资产总览")}# 知识资产总览

这里保留旧 Vault 中仍有长期价值的内容，但全部从当前生产数据重新生成或去重迁移。

| 资产 | 数量 | 处理方式 |
|---|---:|---|
| 行业周报与月报 | ${reportFiles.length} | 保留正式报告正文 |
| 企业 AI / FDE 案例 | ${fdeAssetFiles.length} | 按 V4 FDE ID 去重 |
| AI 硬件资料 | ${hardwareAssetFiles.length} | 按 V4 Hardware ID 去重 |
| 融资研究 | ${fundingAssetFiles.length} | 按 Funding Insight ID 去重 |
| 一线人物时间线 | ${viewpointAssetFiles.length} | 按账号合并观点 |
| 社群历史资料 | ${communityAssetFiles.length} | 按数据日期聚合 |

未迁移：V1/V2/V3 规则、迁移过程、旧 Prompt、QC/repair/diff 报告、重复卡片、缓存和临时文件。`);

write(GUANLAN_VAULT_PATHS.workspace, `${yaml("工作区", "human-maintained")}# 工作区

此目录用于人工笔记、临时思考和附件。

自动同步只管理清单中标记为 generated 的现状页面，不会把这里的内容写回 WaveSight 生产数据。`);

const currentGeneratedFiles = new Set([...generatedFiles, ".guanlan-generated.json"]);
for (const relativePath of previousGeneratedFiles) {
  if (currentGeneratedFiles.has(relativePath) || relativePath.startsWith("90-工作区/")) continue;
  const stalePath = path.resolve(vaultRoot, relativePath);
  if (stalePath === vaultRoot || !stalePath.startsWith(`${vaultRoot}${path.sep}`)) {
    throw new Error(`Refusing to remove a stale file outside Guanlan Vault: ${relativePath}`);
  }
  if (fs.existsSync(stalePath) && fs.statSync(stalePath).isFile()) fs.unlinkSync(stalePath);
}

write(".guanlan-generated.json", JSON.stringify({
  schemaVersion: "GUANLAN-VAULT-PROJECTION-V1.0",
  vaultName: GUANLAN_VAULT_NAME,
  generatedAt: new Date().toISOString(),
  generatedDate,
  source: "WaveSight V4",
  generatedFiles: [...currentGeneratedFiles].sort(),
}, null, 2));

console.log(JSON.stringify({
  ok: true,
  vault: GUANLAN_VAULT_NAME,
  generatedDate,
  files: generatedFiles.length,
  reports: reportFiles.length,
  knowledgeAssets: {
    fde: fdeAssetFiles.length,
    hardware: hardwareAssetFiles.length,
    funding: fundingAssetFiles.length,
    viewpoints: viewpointAssetFiles.length,
    communityDays: communityAssetFiles.length,
  },
}, null, 2));
