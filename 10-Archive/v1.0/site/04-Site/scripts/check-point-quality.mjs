import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "04-Site", "data", "radar-data.json");
const reportsDir = path.join(root, "agent-workflow", "reports");
const latestReportPath = path.join(reportsDir, "the-point-quality-check-latest.md");
const datedReportPath = path.join(reportsDir, `the-point-quality-check-${new Date().toISOString().slice(0, 10)}.md`);

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const points = data.points || [];
const pointSources = data.pointSources || [];

const errors = [];
const warnings = [];
const notes = [];

const asList = (value) => (Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []);
const plain = (value = "") => String(value || "").replace(/\s+/g, " ").trim();
const label = (item) => item?.title || item?.id || "";
const hasChinese = (value = "") => /[\u4e00-\u9fa5]/.test(value);
const hasLatin = (value = "") => /[A-Za-z]/.test(value);
const wordCount = (value = "") => (String(value || "").match(/[A-Za-z0-9]+|[\u4e00-\u9fa5]/g) || []).length;

const addError = (scope, id, message) => errors.push({ scope, id, message });
const addWarning = (scope, id, message) => warnings.push({ scope, id, message });
const addNote = (scope, id, message) => notes.push({ scope, id, message });

const disallowedPatterns = [
  {
    name: "YouTube speaker/timecode",
    pattern: /(?:Speaker\s+\d+|Host|Guest|Interviewer|主持人|嘉宾)\s*\|\s*\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2}/i,
  },
  {
    name: "X t.co 短链",
    pattern: /https?:\/\/t\.co\/\S+/i,
  },
];

const pointById = new Map(points.map((point) => [point.id, point]));
const sourceById = new Map(pointSources.map((source) => [source.id, source]));
const duplicateIds = (items) => {
  const seen = new Set();
  const duplicates = new Set();
  for (const item of items) {
    if (!item?.id) continue;
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  }
  return [...duplicates];
};

for (const id of duplicateIds(points)) addError("Point ID", id, "Point ID 重复，会导致详情页和关联关系不稳定。");
for (const id of duplicateIds(pointSources)) addError("Point Source ID", id, "Point Source ID 重复，会导致素材页链接不稳定。");

const pointRequiredFields = [
  ["date", "日期"],
  ["title", "标题"],
  ["person", "人物"],
  ["source", "来源"],
  ["originalUrl", "原文链接"],
  ["originalText", "原文"],
  ["originalTranslation", "中文译文"],
  ["pointSummary", "观点摘要"],
  ["interpretation", "观澜解读"],
  ["commercialMeaning", "商业含义"],
  ["boundary", "观点边界"],
];

for (const point of points) {
  for (const [key, fieldName] of pointRequiredFields) {
    if (!plain(point[key])) addError("Point 字段", point.id, `缺少${fieldName}。`);
  }

  if (!asList(point.topics).length) addWarning("Point 主题", point.id, "缺少主题，后续难以进入长期热度和标签网络。");
  if (!asList(point.relatedSignalIds).length) addWarning("Point -> Signal", point.id, "缺少关联 Signal，观点难以回到商业信号证据。");
  if (!asList(point.relatedTrendIds).length) addWarning("Point -> Trend", point.id, "缺少关联 Trend，观点难以进入趋势观察。");
  if (!asList(point.relatedOpportunityIds).length) addWarning("Point -> Opportunity", point.id, "缺少关联 Opportunity，观点暂不能辅助机会判断。");

  if (point.sourceNoteId && !sourceById.has(point.sourceNoteId)) {
    addError("Point -> Source", point.id, `关联的素材笔记不存在：${point.sourceNoteId}`);
  }

  const sourceType = String(point.source || "").toLowerCase();
  if ((sourceType.includes("podcast") || sourceType.includes("blog") || sourceType.includes("youtube")) && !point.sourceNoteId) {
    addWarning("Point Source", point.id, "Podcast / Blog / YouTube 类观点建议绑定站内素材笔记。");
  }

  if (point.originalText && point.originalTranslation) {
    const originalWords = wordCount(point.originalText);
    const translatedWords = wordCount(point.originalTranslation);
    if (originalWords >= 25 && translatedWords < Math.max(12, originalWords * 0.2)) {
      addWarning("Point 译文", point.id, "中文译文明显短于原文，需确认不是摘要替代译文。");
    }
    if (hasLatin(point.originalText) && !hasChinese(point.originalTranslation)) {
      addWarning("Point 译文", point.id, "原文含英文但中文译文缺少中文字符。");
    }
  }

  const displayText = [
    point.title,
    point.originalText,
    point.originalTranslation,
    point.pointSummary,
    point.interpretation,
    point.commercialMeaning,
    point.boundary,
  ].join("\n");
  for (const item of disallowedPatterns) {
    if (item.pattern.test(displayText)) addError("Point 清理", point.id, `展示文本仍包含${item.name}。`);
  }
}

const sourceRequiredFields = [
  ["title", "标题"],
  ["date", "日期"],
  ["sourceType", "素材类型"],
  ["sourceName", "素材来源"],
  ["sourceUrl", "原始链接"],
  ["sourcePolicy", "来源与版权"],
  ["readingSummary", "站内阅读摘要"],
  ["structure", "内容结构"],
  ["keySegments", "高价值原文段"],
  ["interpretation", "长期知识沉淀"],
];

for (const source of pointSources) {
  for (const [key, fieldName] of sourceRequiredFields) {
    if (!plain(source[key])) addWarning("Point Source 字段", source.id, `素材笔记缺少${fieldName}。`);
  }

  if (!asList(source.relatedPointIds).length) {
    addError("Source -> Point", source.id, "素材笔记缺少 related_points，无法回到观点卡。");
  }

  for (const pointId of asList(source.relatedPointIds)) {
    const point = pointById.get(pointId);
    if (!point) addError("Source -> Point", source.id, `关联的 Point 不存在：${pointId}`);
    else if (point.sourceNoteId && point.sourceNoteId !== source.id) {
      addWarning("Source <-> Point", source.id, `Point ${pointId} 指向了另一个素材笔记：${point.sourceNoteId}`);
    } else if (!point.sourceNoteId) {
      addWarning("Source <-> Point", source.id, `Point ${pointId} 未反向写入 sourceNoteId。`);
    }
  }

  const sourceDisplayText = [
    source.sourcePolicy,
    source.fullText,
    source.fullTranslation,
    source.readingSummary,
    source.structure,
    source.keySegments,
    source.interpretation,
  ].join("\n");
  for (const item of disallowedPatterns) {
    if (item.pattern.test(sourceDisplayText)) addError("Source 清理", source.id, `素材展示文本仍包含${item.name}。`);
  }

  if (source.fullText && !source.fullTranslation) {
    addWarning("Source 译文", source.id, "已有全文文档但缺少全文译文。");
  }

  if (!source.fullText) {
    addNote("Source 全文", source.id, "尚未写入全文文档，当前素材页会使用结构化阅读摘要和高价值原文段。");
  }

  if (!/授权|自有|来源|版权|转载|导出/.test(source.sourcePolicy || "")) {
    addWarning("Source 授权", source.id, "来源与版权说明不够明确，全文入库前需确认授权或自有导出边界。");
  }
}

const personMap = new Map();
for (const point of points) {
  const person = plain(point.person);
  if (!person) continue;
  if (!personMap.has(person)) personMap.set(person, []);
  personMap.get(person).push(point);
}
const repeatedPeople = [...personMap.entries()].filter(([, items]) => items.length > 1);
for (const [person, items] of repeatedPeople) {
  addNote("同人多观点", person, `${items.length} 条观点，应在人物详情页合并展示，并保留每条独立来源。`);
}

const urlMap = new Map();
for (const point of points) {
  if (!point.originalUrl) continue;
  if (!urlMap.has(point.originalUrl)) urlMap.set(point.originalUrl, []);
  urlMap.get(point.originalUrl).push(point.id);
}
for (const [url, ids] of urlMap.entries()) {
  if (ids.length <= 1) continue;
  const sourceNoteIds = [
    ...new Set(ids.map((id) => pointById.get(id)?.sourceNoteId).filter(Boolean)),
  ];
  if (sourceNoteIds.length === 1) {
    addNote("同源多观点", url, `同一原文链接拆为 ${ids.length} 条 Point，并共享素材笔记 ${sourceNoteIds[0]}：${ids.join(", ")}。`);
  } else {
    addWarning("来源去重", url, `同一原文链接对应 ${ids.length} 条 Point：${ids.join(", ")}。需确认是否为同源多观点。`);
  }
}

const pct = (part, total) => (total ? `${Math.round((part / total) * 100)}%` : "-");
const issueLines = (items) =>
  items.length
    ? items
        .slice(0, 120)
        .map((item, index) => `${index + 1}. **${item.scope}** \`${item.id}\`：${item.message}`)
        .join("\n")
    : "无";

const pointStats = {
  total: points.length,
  withSourceNote: points.filter((point) => point.sourceNoteId).length,
  withSignal: points.filter((point) => asList(point.relatedSignalIds).length).length,
  withTrend: points.filter((point) => asList(point.relatedTrendIds).length).length,
  withOpportunity: points.filter((point) => asList(point.relatedOpportunityIds).length).length,
};
const sourceStats = {
  total: pointSources.length,
  withFullText: pointSources.filter((source) => source.fullText).length,
  withFullTranslation: pointSources.filter((source) => source.fullTranslation).length,
};

const report = `# The Point 质量检查

生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}

## 检查结论

- 硬错误：${errors.length}
- 软提醒：${warnings.length}
- 备注：${notes.length}
- 当前数据：${pointStats.total} Points / ${sourceStats.total} Point Sources

## 覆盖概览

| 项目 | 覆盖 |
|---|---|
| Point 绑定素材笔记 | ${pointStats.withSourceNote}/${pointStats.total} (${pct(pointStats.withSourceNote, pointStats.total)}) |
| Point -> Signal | ${pointStats.withSignal}/${pointStats.total} (${pct(pointStats.withSignal, pointStats.total)}) |
| Point -> Trend | ${pointStats.withTrend}/${pointStats.total} (${pct(pointStats.withTrend, pointStats.total)}) |
| Point -> Opportunity | ${pointStats.withOpportunity}/${pointStats.total} (${pct(pointStats.withOpportunity, pointStats.total)}) |
| Source 有全文文档 | ${sourceStats.withFullText}/${sourceStats.total} (${pct(sourceStats.withFullText, sourceStats.total)}) |
| Source 有全文译文 | ${sourceStats.withFullTranslation}/${sourceStats.total} (${pct(sourceStats.withFullTranslation, sourceStats.total)}) |

## 硬错误

${issueLines(errors)}

## 软提醒

${issueLines(warnings)}

## 备注

${issueLines(notes)}

## 固化规则

1. 来源去重：同一原文链接对应多条 Point 时，若共享同一素材笔记，记录为同源多观点；否则进入来源去重软提醒。
2. 同人多观点：同一人物多条 Point 不合并删除，人物详情页应合并展示，并保留每条独立来源。
3. 素材笔记：Podcast / Blog / YouTube 类观点必须绑定站内素材笔记；X 观点不强制绑定素材笔记。
4. 原文/译文完整性：原文和译文均为必填；中文译文明显短于原文或缺少中文时进入软提醒。
5. 清理规则：Point 展示文本和素材展示文本不得包含 X \`t.co\` 短链，不得包含 YouTube speaker/timecode 痕迹。
6. 授权说明：素材笔记必须包含来源与版权说明；第三方全文入库前必须确认授权或自有导出边界。

## 处理规则

- 硬错误代表展示或关联链路不稳定，需要 Data / Dev 立即修复。
- 软提醒代表内容质量或运营复核项，不一定阻塞，但应进入后续任务池。
- X 观点不强制绑定站内素材笔记；Podcast / Blog / YouTube 观点建议绑定素材笔记。
- 第三方全文入库前必须确认授权或自有导出边界；没有全文时，素材页使用结构化阅读摘要和高价值原文段。
- 每次运行同步脚本和关系检查后，建议继续运行本检查。
`;

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(latestReportPath, report, "utf8");
fs.writeFileSync(datedReportPath, report, "utf8");
console.log(report);

if (errors.length) {
  process.exitCode = 1;
}
