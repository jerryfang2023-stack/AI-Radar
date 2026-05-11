import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataPath = path.join(root, "04-Site", "data", "radar-data.json");
const reportsDir = path.join(root, "agent-workflow", "reports");
const latestReportPath = path.join(reportsDir, "relation-check-latest.md");
const datedReportPath = path.join(reportsDir, `relation-check-${new Date().toISOString().slice(0, 10)}.md`);

const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const signals = data.signals || [];
const scoreRows = data.scoring?.rows || [];
const trends = data.trends || [];
const points = data.points || [];
const judgmentNodes = data.judgmentNodes || [];
const opportunities = data.opportunities || [];

const byId = (items) => new Map(items.filter((item) => item?.id).map((item) => [item.id, item]));
const signalById = byId(signals);
const scoreById = byId(scoreRows);
const judgmentNodeById = byId(judgmentNodes);
const opportunityById = byId(opportunities);
const trendByTrack = new Map(trends.filter((trend) => trend?.track).map((trend) => [trend.track, trend]));
const asList = (value) => (Array.isArray(value) ? value.filter(Boolean) : value ? [value] : []);
const has = (items, value) => asList(items).includes(value);
const label = (item, fallback = "") => item?.title || item?.track || item?.product || item?.opportunityTitle || item?.id || fallback;

const errors = [];
const warnings = [];
const stats = {
  signalCount: signals.length,
  priorityCount: scoreRows.length,
  trendCount: trends.length,
  pointCount: points.length,
  opportunityCount: opportunities.length,
  priorityWithSignal: 0,
  priorityWithJudgmentNode: 0,
  priorityWithOpportunity: 0,
  priorityWithTrend: 0,
  signalWithOpportunity: 0,
  signalWithTrend: 0,
  trendWithSignal: 0,
  trendWithPriority: 0,
  trendWithOpportunity: 0,
  pointWithSignal: 0,
  pointWithTrend: 0,
  pointWithOpportunity: 0,
  judgmentNodeWithPriority: 0,
  judgmentNodeWithSignal: 0,
  judgmentNodeWithTrend: 0,
  judgmentNodeWithOpportunity: 0,
  opportunityWithPriority: 0,
  opportunityWithSignal: 0,
  opportunityWithTrend: 0,
};

const addError = (scope, id, message) => errors.push({ scope, id, message });
const addWarning = (scope, id, message) => warnings.push({ scope, id, message });

for (const row of scoreRows) {
  if (row.judgmentId) {
    const judgmentNode = judgmentNodeById.get(row.judgmentId);
    if (judgmentNode) {
      stats.priorityWithJudgmentNode += 1;
      if (!has(judgmentNode.relatedScoringIds, row.id)) {
        addWarning("Priority <-> Judgment Node", row.id, `Judgment Node 未反向包含该评分项：${label(judgmentNode)}。`);
      }
    } else {
      addError("Priority -> Judgment Node", row.id, `关联的 Judgment Node 不存在：${row.judgmentId}`);
    }
  } else {
    addWarning("Priority -> Judgment Node", row.id, "评分项缺少 judgmentId，无法进入 Priority Engine 2.0 判断节点。");
  }

  if (row.relatedSignalId) {
    if (signalById.has(row.relatedSignalId)) stats.priorityWithSignal += 1;
    else addError("Priority -> Signal", row.id, `关联的 Signal 不存在：${row.relatedSignalId}`);
  } else {
    addWarning("Priority -> Signal", row.id, "评分项缺少 relatedSignalId，无法回到原始 Signal。");
  }

  if (row.relatedOpportunityId) {
    const opportunity = opportunityById.get(row.relatedOpportunityId);
    if (opportunity) {
      stats.priorityWithOpportunity += 1;
      if (!has(opportunity.relatedScoringIds, row.id)) {
        addWarning("Priority <-> Opportunity", row.id, `Opportunity 未反向包含该评分项：${label(opportunity)}。`);
      }
    } else {
      addError("Priority -> Opportunity", row.id, `关联的 Opportunity 不存在：${row.relatedOpportunityId}`);
    }
  } else {
    addWarning("Priority -> Opportunity", row.id, "评分项缺少 relatedOpportunityId，无法进入机会卡。");
  }

  const linkedTrend = trends.find((trend) => has(trend.relatedScoringIds, row.id));
  if (linkedTrend) stats.priorityWithTrend += 1;
  else addWarning("Priority -> Trend", row.id, "评分项暂未被任何 Trend 纳入趋势证据。");
}

for (const judgmentNode of judgmentNodes) {
  const relatedScores = asList(judgmentNode.relatedScoringIds);
  const relatedSignals = asList(judgmentNode.relatedSignalIds);
  const relatedTrends = asList(judgmentNode.relatedTrendIds);
  const relatedOpportunities = asList(judgmentNode.relatedOpportunityIds);
  const relatedPoints = asList(judgmentNode.relatedPointIds);

  if (relatedScores.length) stats.judgmentNodeWithPriority += 1;
  else addWarning("Judgment Node -> Priority", judgmentNode.id, `判断节点缺少评分来源：${label(judgmentNode)}。`);
  for (const scoreId of relatedScores) {
    if (!scoreById.has(scoreId)) addError("Judgment Node -> Priority", judgmentNode.id, `关联的评分项不存在：${scoreId}`);
  }

  if (relatedSignals.length) stats.judgmentNodeWithSignal += 1;
  for (const signalId of relatedSignals) {
    if (!signalById.has(signalId)) addError("Judgment Node -> Signal", judgmentNode.id, `关联的 Signal 不存在：${signalId}`);
  }

  if (relatedTrends.length) stats.judgmentNodeWithTrend += 1;
  for (const track of relatedTrends) {
    if (!trendByTrack.has(track)) addError("Judgment Node -> Trend", judgmentNode.id, `关联的 Trend 不存在：${track}`);
  }

  if (relatedOpportunities.length) stats.judgmentNodeWithOpportunity += 1;
  for (const opportunityId of relatedOpportunities) {
    if (!opportunityById.has(opportunityId)) addError("Judgment Node -> Opportunity", judgmentNode.id, `关联的 Opportunity 不存在：${opportunityId}`);
  }

  for (const pointId of relatedPoints) {
    if (!byId(points).has(pointId)) addError("Judgment Node -> Point", judgmentNode.id, `关联的 Point 不存在：${pointId}`);
  }
}

for (const signal of signals) {
  const directOpportunities = asList(signal.relatedOpportunityIds);
  if (directOpportunities.length) stats.signalWithOpportunity += 1;
  for (const opportunityId of directOpportunities) {
    const opportunity = opportunityById.get(opportunityId);
    if (!opportunity) addError("Signal -> Opportunity", signal.id, `关联的 Opportunity 不存在：${opportunityId}`);
  }

  const linkedTrend = trends.find((trend) => has(trend.relatedSignalIds, signal.id));
  if (linkedTrend) stats.signalWithTrend += 1;
  else addWarning("Signal -> Trend", signal.id, `Signal 暂未进入任何 Trend：${label(signal)}。`);
}

for (const trend of trends) {
  const trendSignals = asList(trend.relatedSignalIds);
  const trendScores = asList(trend.relatedScoringIds);
  const trendOpportunities = asList(trend.relatedOpportunityIds);

  if (trendSignals.length) stats.trendWithSignal += 1;
  else addWarning("Trend -> Signal", trend.track, "Trend 缺少 relatedSignalIds，趋势缺少原始信号证据。");
  for (const signalId of trendSignals) {
    if (!signalById.has(signalId)) addError("Trend -> Signal", trend.track, `关联的 Signal 不存在：${signalId}`);
  }

  if (trendScores.length) stats.trendWithPriority += 1;
  else addWarning("Trend -> Priority", trend.track, "Trend 缺少 relatedScoringIds，趋势没有接入评分证据。");
  for (const scoreId of trendScores) {
    if (!scoreById.has(scoreId)) addError("Trend -> Priority", trend.track, `关联的评分项不存在：${scoreId}`);
  }

  if (trendOpportunities.length) stats.trendWithOpportunity += 1;
  else addWarning("Trend -> Opportunity", trend.track, "Trend 缺少 relatedOpportunityIds，趋势没有落到机会卡。");
  for (const opportunityId of trendOpportunities) {
    const opportunity = opportunityById.get(opportunityId);
    if (!opportunity) addError("Trend -> Opportunity", trend.track, `关联的 Opportunity 不存在：${opportunityId}`);
  }
}

for (const point of points) {
  const relatedSignals = asList(point.relatedSignalIds);
  const relatedTrends = asList(point.relatedTrendIds);
  const relatedOpportunities = asList(point.relatedOpportunityIds);

  if (relatedSignals.length) stats.pointWithSignal += 1;
  for (const signalId of relatedSignals) {
    if (!signalById.has(signalId)) addError("Point -> Signal", point.id, `关联的 Signal 不存在：${signalId}`);
  }

  if (relatedTrends.length) stats.pointWithTrend += 1;
  for (const track of relatedTrends) {
    if (!trendByTrack.has(track)) addError("Point -> Trend", point.id, `关联的 Trend 不存在：${track}`);
  }

  if (relatedOpportunities.length) stats.pointWithOpportunity += 1;
  for (const opportunityId of relatedOpportunities) {
    if (!opportunityById.has(opportunityId)) addError("Point -> Opportunity", point.id, `关联的 Opportunity 不存在：${opportunityId}`);
  }
}

for (const opportunity of opportunities) {
  const relatedScores = asList(opportunity.relatedScoringIds);
  const relatedSignals = asList(opportunity.relatedSignalIds);
  const relatedTrends = asList(opportunity.relatedTrendTracks);

  if (relatedScores.length) stats.opportunityWithPriority += 1;
  else addWarning("Opportunity -> Priority", opportunity.id, `机会卡没有评分证据：${label(opportunity)}。`);
  for (const scoreId of relatedScores) {
    const row = scoreById.get(scoreId);
    if (!row) addError("Opportunity -> Priority", opportunity.id, `关联的评分项不存在：${scoreId}`);
    else if (row.relatedOpportunityId !== opportunity.id) {
      addWarning("Opportunity <-> Priority", opportunity.id, `评分项未反向指向该机会卡：${scoreId}。`);
    }
  }

  if (opportunity.priorityRowId && !has(relatedScores, opportunity.priorityRowId)) {
    addWarning("Opportunity Priority", opportunity.id, `priorityRowId 不在 relatedScoringIds 中：${opportunity.priorityRowId}`);
  }

  if (relatedSignals.length) stats.opportunityWithSignal += 1;
  else addWarning("Opportunity -> Signal", opportunity.id, `机会卡没有关联 Signal：${label(opportunity)}。`);
  for (const signalId of relatedSignals) {
    if (!signalById.has(signalId)) addError("Opportunity -> Signal", opportunity.id, `关联的 Signal 不存在：${signalId}`);
  }

  if (relatedTrends.length) stats.opportunityWithTrend += 1;
  else addWarning("Opportunity -> Trend", opportunity.id, `机会卡没有关联 Trend：${label(opportunity)}。`);
  for (const track of relatedTrends) {
    const trend = trendByTrack.get(track);
    if (!trend) addError("Opportunity -> Trend", opportunity.id, `关联的 Trend 不存在：${track}`);
  }
}

const pct = (part, total) => (total ? `${Math.round((part / total) * 100)}%` : "-");
const table = (rows) => rows.map((row) => `| ${row.join(" | ")} |`).join("\n");
const issueLines = (items) =>
  items.length
    ? items
        .slice(0, 80)
        .map((item, index) => `${index + 1}. **${item.scope}** \`${item.id}\`：${item.message}`)
        .join("\n")
    : "无";

const report = `# Signal-Priority-Trend-Opportunity 关系检查

生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}

## 检查结论

- 硬错误：${errors.length}
- 软提醒：${warnings.length}
- 当前数据：${stats.signalCount} Signals / ${stats.priorityCount} Priority Rows / ${judgmentNodes.length} Judgment Nodes / ${stats.trendCount} Trends / ${stats.pointCount} Points / ${stats.opportunityCount} Opportunities

## 关系覆盖率

${table([
  ["关系", "覆盖", "说明"],
  ["Priority -> Signal", `${stats.priorityWithSignal}/${stats.priorityCount} (${pct(stats.priorityWithSignal, stats.priorityCount)})`, "评分项是否能回到原始商业信号"],
  ["Priority -> Judgment Node", `${stats.priorityWithJudgmentNode}/${stats.priorityCount} (${pct(stats.priorityWithJudgmentNode, stats.priorityCount)})`, "评分项是否进入后台判断节点"],
  ["Priority -> Opportunity", `${stats.priorityWithOpportunity}/${stats.priorityCount} (${pct(stats.priorityWithOpportunity, stats.priorityCount)})`, "评分项是否能进入机会卡"],
  ["Priority -> Trend", `${stats.priorityWithTrend}/${stats.priorityCount} (${pct(stats.priorityWithTrend, stats.priorityCount)})`, "评分项是否被趋势模型吸收"],
  ["Signal -> Opportunity", `${stats.signalWithOpportunity}/${stats.signalCount} (${pct(stats.signalWithOpportunity, stats.signalCount)})`, "信号是否能落到机会方向"],
  ["Signal -> Trend", `${stats.signalWithTrend}/${stats.signalCount} (${pct(stats.signalWithTrend, stats.signalCount)})`, "信号是否被趋势线吸收"],
  ["Trend -> Signal", `${stats.trendWithSignal}/${stats.trendCount} (${pct(stats.trendWithSignal, stats.trendCount)})`, "趋势是否有原始 Signal 证据"],
  ["Trend -> Priority", `${stats.trendWithPriority}/${stats.trendCount} (${pct(stats.trendWithPriority, stats.trendCount)})`, "趋势是否引入评分证据"],
  ["Trend -> Opportunity", `${stats.trendWithOpportunity}/${stats.trendCount} (${pct(stats.trendWithOpportunity, stats.trendCount)})`, "趋势是否落到机会卡"],
  ["Point -> Signal", `${stats.pointWithSignal}/${stats.pointCount} (${pct(stats.pointWithSignal, stats.pointCount)})`, "一线观点是否能回到信号证据"],
  ["Point -> Trend", `${stats.pointWithTrend}/${stats.pointCount} (${pct(stats.pointWithTrend, stats.pointCount)})`, "一线观点是否进入趋势观察"],
  ["Point -> Opportunity", `${stats.pointWithOpportunity}/${stats.pointCount} (${pct(stats.pointWithOpportunity, stats.pointCount)})`, "一线观点是否能辅助机会判断"],
  ["Judgment Node -> Priority", `${stats.judgmentNodeWithPriority}/${judgmentNodes.length} (${pct(stats.judgmentNodeWithPriority, judgmentNodes.length)})`, "判断节点是否有评分来源"],
  ["Judgment Node -> Signal", `${stats.judgmentNodeWithSignal}/${judgmentNodes.length} (${pct(stats.judgmentNodeWithSignal, judgmentNodes.length)})`, "判断节点是否能回到事实信号"],
  ["Judgment Node -> Trend", `${stats.judgmentNodeWithTrend}/${judgmentNodes.length} (${pct(stats.judgmentNodeWithTrend, judgmentNodes.length)})`, "判断节点是否进入趋势网络"],
  ["Judgment Node -> Opportunity", `${stats.judgmentNodeWithOpportunity}/${judgmentNodes.length} (${pct(stats.judgmentNodeWithOpportunity, judgmentNodes.length)})`, "判断节点是否落到机会卡"],
  ["Opportunity -> Priority", `${stats.opportunityWithPriority}/${stats.opportunityCount} (${pct(stats.opportunityWithPriority, stats.opportunityCount)})`, "机会卡是否有评分支撑"],
  ["Opportunity -> Signal", `${stats.opportunityWithSignal}/${stats.opportunityCount} (${pct(stats.opportunityWithSignal, stats.opportunityCount)})`, "机会卡是否有信号证据"],
  ["Opportunity -> Trend", `${stats.opportunityWithTrend}/${stats.opportunityCount} (${pct(stats.opportunityWithTrend, stats.opportunityCount)})`, "机会卡是否进入趋势网络"],
])}

## 硬错误

${issueLines(errors)}

## 软提醒

${issueLines(warnings)}

## 处理规则

- 硬错误需要 Dev/Data 立即修复，通常是 ID 或 slug 断链。
- 软提醒是运营复核项，不一定是错误，可能是新机会、新趋势或早期信号尚未形成闭环。
- Signal / Opportunity / Trend 的弱关联可能来自标签相似度，本检查只校验引用是否存在，不逐条要求双向完全一致。
- The Point 只作为观点共识、分歧或边界信号，不作为 Judgment Node 的事实证据直接加权。
- 每次运行同步脚本后，应再运行本检查，确认新增内容没有断链。
`;

fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(latestReportPath, report, "utf8");
fs.writeFileSync(datedReportPath, report, "utf8");
console.log(report);

if (errors.length) {
  process.exitCode = 1;
}
