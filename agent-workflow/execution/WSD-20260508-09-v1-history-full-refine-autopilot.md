---
task_id: WSD-20260508-09-v1-history-full-refine-autopilot
board_id: V2-HISTORY-FULL-REFINE-AUTO
title: V1 历史 AI商业雷达与 The Point 全量 V2 化自动包
date: 2026-05-08
status: ready
lead_agent: Intelligence Data Agent
support_agents:
  - V2 Source Intelligence Agent
  - V2 Content Product Agent
  - Copy Agent
  - Dev Agent
  - QA / Acceptance Agent
  - Workflow / Automation Agent
encoding: UTF-8
---

# V2-HISTORY-FULL-REFINE-AUTO｜V1 历史 AI商业雷达与 The Point 全量 V2 化自动包

## 1. 任务背景

用户指出：V1 版本网站中有不少历史 `AI商业雷达` 和 `The Point` 文章，但前一轮 `V2-LEGACY-REFINE-AUTO` 只完成了少量首批 publish-ready 内容。

本任务不是继续抽样，也不是只处理已抽出的 legacy candidates，而是对 V1 已归档历史内容做全量 V2 化梳理、精修、入库和新站接入。

## 2. 任务目标

逐篇处理 V1 归档中的：

- 8 篇 `AI商业雷达`
- 4 篇 `The Point`

每篇源文档都必须完成：

1. 源文档登记。
2. 原始条目拆解。
3. 去重合并。
4. V2 归类：Signal / Point / Trend / Opportunity / HeatEvidence / reject。
5. 必要二次搜索和证据补强。
6. V2 字段补齐。
7. publish-ready / hold / reject 判断。
8. 写入 `01-SiteV2/content/` 对应内容库。
9. 接入 V2 site data generator。
10. 重新生成 V2 网站数据。
11. 完成本地新站可用验收。

任务完成后，必须能回答：

- 12 篇 V1 历史文章各自处理到了哪里。
- 每篇提取了多少候选。
- 多少进入 V2 新站。
- 多少进入 hold。
- 多少 reject。
- 为什么不是简单全文搬运。

## 3. 必须读取

```text
AGENTS.md
docs/agent-handoff.md
agent-workflow/execution/dispatch-board.md
agent-workflow/v2/v2-algorithm-source-architecture.md
agent-workflow/v2/v2-data-schema-minimum.md
agent-workflow/v2/v2-copy-editorial-system.md
agent-workflow/v2/v2-production-pipeline-cutover.md
agent-workflow/reports/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot-closeout.md
agent-workflow/reports/WSD-20260508-08-v2-deep-dive-content-depth-closeout.md
```

参考已完成的 legacy 输出：

```text
agent-workflow/reports/WSD-20260508-03-legacy-refinement-inventory.md
01-SiteV2/content/00-inbox/legacy-import/legacy-publish-ready-index-2026-05-08.md
01-SiteV2/content/*/refined/
```

## 4. 输入范围

### 4.1 AI商业雷达

```text
10-Archive/v1.0/source-dirs/01-Signals/2026-04-29-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-04-30-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-05-01-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-05-02-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-05-03-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-05-04-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-05-05-AI商业雷达.md
10-Archive/v1.0/source-dirs/01-Signals/2026-05-06-AI商业雷达.md
```

### 4.2 The Point

```text
10-Archive/v1.0/source-dirs/05-point/2026-05-03-The-Point.md
10-Archive/v1.0/source-dirs/05-point/2026-05-04-The-Point.md
10-Archive/v1.0/source-dirs/05-point/2026-05-05-The-Point.md
10-Archive/v1.0/source-dirs/05-point/2026-05-06-The-Point.md
```

禁止输入：

```text
09-ai-news-radar/
旧 04-Site 站点数据
failed / void / stopped 页面任务产物
```

## 5. 执行阶段

### Stage A｜Source Coverage 全量登记

输出：

```text
agent-workflow/reports/WSD-20260508-09-v1-history-full-source-coverage.md
```

必须有 12 行源文档覆盖表：

| 字段 | 要求 |
|---|---|
| source_id | 稳定 ID |
| source_path | 源文件路径 |
| source_type | AI商业雷达 / The Point |
| source_date | 原始日期 |
| raw_items_count | 原文拆出的条目数 |
| processed_items_count | 已处理条目数 |
| publish_ready_count | 可发布数 |
| hold_count | 待补证数 |
| reject_count | 淘汰数 |
| output_paths | 输出路径 |
| notes | 处理说明 |

硬要求：

- 12 篇源文件不能漏。
- 任一源文件如果无法读取，必须写明原因。
- 任一源文件如果 0 publish-ready，也必须写 hold / reject 原因。

### Stage B｜逐篇拆解与去重合并

对每篇 AI商业雷达：

- 拆出原始新闻 / 商业信号 / 机会评分 / 趋势线索。
- 补齐或重写 V2 六维分析。
- 判断进入 Signal、Opportunity、Trend、HeatEvidence 还是 reject。
- 对重复主题做合并，不重复污染前台。

对每篇 The Point：

- 保留来源观点。
- 重写为 V2 `观点参照` 口径。
- 补充 `我们的读法`。
- 建立与 Signal / Trend / Opportunity 的关系。
- 判断进入 Point、Trend background、Opportunity evidence 还是 hold / reject。

### Stage C｜二次搜索与证据补强

publish-ready 的内容必须满足：

- Signal：至少 3 个 S/A/B 来源，1200-1800 中文字。
- Opportunity Deep Dive：如新增，3000-6000 中文字，至少 5 个来源，含证据链和反向证据。
- Point：必须有来源观点、我们的读法、关联内容；如来源不足，进入 hold。
- Trend：必须说明趋势线索、支撑信号、反向边界。
- HeatEvidence：必须可追溯到来源或历史归档。

### Stage D｜写入 V2 内容库

建议输出路径：

```text
01-SiteV2/content/00-inbox/legacy-full-import/history-full-publish-ready-index-2026-05-08.md
01-SiteV2/content/03-structured-signals/history-refined/history-signals-publish-ready-2026-05-08.md
01-SiteV2/content/05-trend-chain/history-refined/history-trends-publish-ready-2026-05-08.md
01-SiteV2/content/07-points/history-refined/history-points-publish-ready-2026-05-08.md
01-SiteV2/content/08-opportunities/deep-dive/history-refined/history-opportunities-publish-ready-2026-05-08.md
01-SiteV2/content/10-databases/history-refined/history-heat-evidence-publish-ready-2026-05-08.md
```

每个文件必须区分：

```text
publish_ready
hold
reject
```

### Stage E｜站点数据接入

必须完成：

1. 更新或扩展 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`。
2. 确认生成器能读取 `history-refined/` 和 `legacy-full-import/` 中的 publish-ready 内容。
3. 重新生成：

```text
01-SiteV2/site/data/site-content.json
01-SiteV2/site/data/site-content.js
```

4. 确认 V2 新站页面实际读取生成后的内容。

### Stage F｜本地新站可用验收

必须启动本地静态服务或使用现有 dev server，检查：

```text
/
/daily.html
/signals.html
/opportunities.html
/brief.html
/daily-detail.html
/signal-detail.html
/opportunity-detail.html
/data/site-content.json
/data/site-content.js
```

截图和 QA 材料保存到：

```text
agent-workflow/reports/v2-history-full-refine-site-ready-2026-05-08/
```

必须包含：

- 桌面截图。
- 移动截图。
- HTTP 检查结果。
- 至少一个历史 Signal 详情页。
- 至少一个历史 Opportunity 详情页。
- 至少一个历史 Point / brief 页面展示。

## 6. 质量检查

必须运行：

```powershell
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/data/site-content.js
node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如果新增 history validator，也必须一起运行。

## 7. 禁止事项

- 不处理 `09-ai-news-radar/`。
- 不恢复旧 `04-Site`。
- 不把 V1 文章原样搬进 V2 网站。
- 不把未处理内容直接塞进 `site-content.json`。
- 不做 Netlify deploy。
- 不切正式域名。
- 不恢复 The Point / Trends / Scoring 为一级栏目。
- 不为了数量牺牲质量；无法达标的内容进入 hold，并说明原因。

## 8. 验收标准

- 12 篇源文件全量覆盖登记完成。
- 每篇源文档都有 processed / publish-ready / hold / reject 数量。
- V2 内容库写入完成。
- publish-ready 内容已接入 V2 site data generator。
- `site-content.json` 和 `site-content.js` 已更新。
- 本地新网站可访问，核心页面 HTTP 通过。
- 桌面和移动截图完成。
- v2content 与 syntax 通过。
- closeout 为 UTF-8 Markdown。

## 9. 收口文件

```text
agent-workflow/reports/WSD-20260508-09-v1-history-full-refine-autopilot-closeout.md
```

收口必须明确：

- 12 篇源文档覆盖表。
- 总拆解条目数。
- publish-ready / hold / reject 总数。
- 新增到 V2 新站的数据数量。
- 站点检查结果。
- 未处理或 hold 的原因。

## 10. 新窗口提示词

```text
你是观澜AI V1 历史 AI商业雷达与 The Point 全量 V2 化执行窗口。

请在 C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight 执行：

看板编号：V2-HISTORY-FULL-REFINE-AUTO
Task ID：WSD-20260508-09-v1-history-full-refine-autopilot
派发单：agent-workflow/execution/WSD-20260508-09-v1-history-full-refine-autopilot.md

任务目标：
全量处理 V1 归档中的 8 篇 AI商业雷达和 4 篇 The Point，不再只处理少量 legacy candidates。每篇源文档必须登记、拆解、去重、按 V2 规则精修，给出 publish-ready / hold / reject 判断；publish-ready 内容必须写入 `01-SiteV2/content/`，接入 V2 site data generator，并重新生成 `01-SiteV2/site/data/site-content.json` 与 `site-content.js`。任务结束后，本地 V2 新网站必须直接可用。

必须先读取：
- AGENTS.md
- docs/agent-handoff.md
- agent-workflow/execution/dispatch-board.md
- agent-workflow/v2/v2-algorithm-source-architecture.md
- agent-workflow/v2/v2-data-schema-minimum.md
- agent-workflow/v2/v2-copy-editorial-system.md
- agent-workflow/v2/v2-production-pipeline-cutover.md
- agent-workflow/reports/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot-closeout.md
- agent-workflow/reports/WSD-20260508-08-v2-deep-dive-content-depth-closeout.md
- 本派发单

必须全量处理这些输入：
- 10-Archive/v1.0/source-dirs/01-Signals/2026-04-29-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-04-30-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-05-01-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-05-02-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-05-03-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-05-04-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-05-05-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/01-Signals/2026-05-06-AI商业雷达.md
- 10-Archive/v1.0/source-dirs/05-point/2026-05-03-The-Point.md
- 10-Archive/v1.0/source-dirs/05-point/2026-05-04-The-Point.md
- 10-Archive/v1.0/source-dirs/05-point/2026-05-05-The-Point.md
- 10-Archive/v1.0/source-dirs/05-point/2026-05-06-The-Point.md

硬要求：
- 12 篇源文档必须逐篇登记，不能漏。
- 每篇必须给出拆解条目数、publish-ready / hold / reject 数量。
- 不把 V1 文章原样搬进 V2 网站。
- 不处理 09-ai-news-radar。
- 不恢复旧 04-Site。
- 不做 Netlify deploy。
- 不切正式域名。
- 不恢复 The Point / Trends / Scoring 为一级栏目。
- 任务完成后本地 V2 新网站必须可用。

最终必须输出：
- agent-workflow/reports/WSD-20260508-09-v1-history-full-source-coverage.md
- 01-SiteV2/content/00-inbox/legacy-full-import/history-full-publish-ready-index-2026-05-08.md
- history-refined 内容文件写入 `01-SiteV2/content/*/history-refined/`
- 更新后的 `01-SiteV2/site/data/site-content.json`
- 更新后的 `01-SiteV2/site/data/site-content.js`
- 本地网站 HTTP 检查和桌面 / 移动截图，保存到 `agent-workflow/reports/v2-history-full-refine-site-ready-2026-05-08/`
- agent-workflow/reports/WSD-20260508-09-v1-history-full-refine-autopilot-closeout.md

完成后回调度中枢：
收口：agent-workflow/reports/WSD-20260508-09-v1-history-full-refine-autopilot-closeout.md
```
