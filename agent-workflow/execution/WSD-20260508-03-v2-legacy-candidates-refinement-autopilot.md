---
task_id: WSD-20260508-03-v2-legacy-candidates-refinement-autopilot
board_id: V2-LEGACY-REFINE-AUTO
title: V2 Legacy Candidates 精修、合并、入站与网站可用自动包
date: 2026-05-08
status: ready
lead_agent: Intelligence Data Agent
support_agents:
  - V2 Source Intelligence Agent
  - V2 Content Product Agent
  - Copy Agent
  - QA / Acceptance Agent
  - Workflow / Automation Agent
encoding: UTF-8
---

# V2-LEGACY-REFINE-AUTO｜V2 Legacy Candidates 精修、合并、入站与网站可用自动包

## 1. 任务目标

对已经进入 `01-SiteV2/content/` 的 V1 legacy candidates 做精修，判断哪些可以作为 V2 网站内容来源进入正式站点数据。

本任务不是重新搬运 V1 文档，也不是无审核发布旧内容，而是把已改写的候选内容继续做：

1. 去重合并。
2. 来源补证。
3. V2 六维补齐。
4. Point / Trend / Opportunity / Signal 关系校准。
5. publish-ready / hold / reject 判断。
6. 输出可被 V2 site data generator 读取的 refined 内容。
7. 将 publish-ready 内容接入站点数据生成器。
8. 重新生成 `01-SiteV2/site/data/site-content.json` 与 `site-content.js`。
9. 完成本地网站 HTTP、桌面截图、移动截图和关键页面检查，确保任务结束后新网站本地直接可用。

## 2. 输入范围

必须读取：

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/v2/v2-data-schema-minimum.md`
- `agent-workflow/v2/v2-copy-editorial-system.md`
- `agent-workflow/v2/v2-production-pipeline-cutover.md`
- `agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md`
- `agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md`
- `agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md`

Legacy candidate 输入：

```text
01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md
01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md
01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md
01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md
01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md
```

历史查证来源：

```text
10-Archive/v1.0/v1.0-content-archive.md
10-Archive/v1.0/source-dirs/
```

禁止输入：

```text
09-ai-news-radar/
failed / void / stopped 页面任务产物
旧 04-Site 站点数据
```

## 3. 阶段顺序

### Stage A｜Inventory 精修表

输出：

```text
agent-workflow/reports/WSD-20260508-03-legacy-refinement-inventory.md
```

每条候选必须有：

| 字段 | 要求 |
|---|---|
| candidate_id | 稳定候选 ID |
| source_legacy_path | 原始来源 |
| candidate_type | Signal / Point / Trend / Opportunity / HeatEvidence |
| original_date | 原始日期 |
| current_v2_path | 当前 V2 candidate 路径 |
| duplicate_group | 合并组 |
| evidence_status | sufficient / partial / weak / stale |
| publish_decision | publish-ready / hold / reject |
| reason | 判断理由 |

### Stage B｜优先精修顺序

按以下顺序处理：

1. V1 Opportunities -> V2 机会解码 refined candidates。
2. V1 The Point -> Point Calibration refined candidates。
3. V1 AI 商业雷达 / Scoring -> Structured Signal / HeatEvidence refined candidates。
4. V1 Trends -> Trend Context refined candidates。

### Stage C｜精修输出路径

建议输出：

```text
01-SiteV2/content/08-opportunities/deep-dive/refined/legacy-opportunities-publish-ready-2026-05-08.md
01-SiteV2/content/07-points/refined/legacy-point-calibration-publish-ready-2026-05-08.md
01-SiteV2/content/03-structured-signals/refined/legacy-signals-publish-ready-2026-05-08.md
01-SiteV2/content/05-trend-chain/refined/legacy-trend-context-publish-ready-2026-05-08.md
01-SiteV2/content/10-databases/refined/legacy-heat-evidence-publish-ready-2026-05-08.md
```

每个 refined 文件必须区分：

- `publish_ready`
- `hold`
- `reject`

### Stage D｜前台发布候选包

输出一份可供站点数据生成器读取或后续接入的发布候选索引：

```text
01-SiteV2/content/00-inbox/legacy-import/legacy-publish-ready-index-2026-05-08.md
```

其中必须说明：

- 哪些内容可进入 Home / 今日要点。
- 哪些内容可进入关键信号。
- 哪些内容可进入机会解码。
- 哪些内容只作为观点校准 / 趋势背景嵌入。
- 哪些内容仅留作内部证据，不前台展示。

### Stage E｜站点数据接入与本地可用

必须完成：

1. 更新或扩展 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`，让它能读取 refined publish-ready 内容。
2. 运行站点数据生成器，更新：

```text
01-SiteV2/site/data/site-content.json
01-SiteV2/site/data/site-content.js
```

3. 确认 V2 网站页面实际读取生成后的内容，而不是停留在旧 sample / 旧 site-content。
4. 本地启动 `01-SiteV2/site/dev-server.mjs` 或等价静态服务，完成 HTTP 检查。
5. 至少检查这些页面：

```text
/
/daily.html
/signals.html
/opportunities.html
/brief.html
/daily-detail.html
/signal-detail.html
/opportunity-detail.html
```

6. 输出桌面与移动截图，证明新网站本地直接可用。

截图和 QA 材料保存到：

```text
agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/
```

### Stage F｜质量检查

必须运行：

```powershell
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如果新增 refined validator，则一起运行。

## 4. 发布判断硬标准

### publish-ready 必须满足

- 有稳定 ID 和 slug。
- 有原始来源路径。
- 有 V2 类型。
- 有至少一个来源或明确说明来自 V1 历史归档。
- 完成 V2 六维或 Point / Trend / HeatEvidence 对应最小字段。
- 有反证、边界或证据缺口。
- 不含后台字段、JSON、同步、编辑、恢复等前台痕迹。
- Opportunity 标题不写公司名。

### hold

适用于：

- 有价值但来源不足。
- 与已有内容重复，需要合并。
- 方向成立但日期过旧，需要二次搜索。
- 关系字段缺失。

### reject

适用于：

- 浅新闻。
- 工具教程。
- 无商业信号。
- 已过时且无历史判断价值。
- failed / void / stopped 页面任务产物。

## 5. 禁止事项

- 不把 V1 文档原样发布到 V2 网站。
- 不把 legacy candidates 未经精修直接塞进 `site-content.json`。
- 不处理 `09-ai-news-radar/`。
- 不恢复旧 `04-Site`。
- 不做 Netlify deploy。
- 不切正式域名。
- 不把 The Point / Trends 恢复成一级栏目。

## 6. 验收标准

- Legacy refinement inventory 完成。
- Refined files 写入 `01-SiteV2/content/`。
- publish-ready / hold / reject 分类明确。
- 发布候选索引完成。
- publish-ready 内容已接入站点数据生成器。
- `01-SiteV2/site/data/site-content.json` 和 `site-content.js` 已更新。
- 本地 V2 网站直接可访问，核心页面 HTTP 检查通过。
- 桌面和移动截图完成。
- v2content 与 syntax 通过。
- closeout 为 UTF-8 Markdown。

## 7. 新窗口提示词

```text
你是观澜AI V2 Legacy Candidates 精修、合并与发布判断执行窗口。

请在 C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight 执行：

Task ID：WSD-20260508-03-v2-legacy-candidates-refinement-autopilot
看板编号：V2-LEGACY-REFINE-AUTO
派发单：agent-workflow/execution/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot.md

任务目标：
对已经进入 `01-SiteV2/content/` 的 V1 legacy candidates 做精修，输出 publish-ready / hold / reject 判断；并且必须把 publish-ready 内容接入 V2 site data generator，重新生成 `01-SiteV2/site/data/site-content.json` 和 `site-content.js`，完成本地网站 HTTP 与桌面 / 移动截图验收，保证任务结束后新网站本地直接可用。

必须先读取：
- AGENTS.md
- docs/README.md
- docs/agent-handoff.md
- agent-workflow/execution/dispatch-board.md
- agent-workflow/v2/v2-algorithm-source-architecture.md
- agent-workflow/v2/v2-data-schema-minimum.md
- agent-workflow/v2/v2-copy-editorial-system.md
- agent-workflow/v2/v2-production-pipeline-cutover.md
- agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md
- agent-workflow/reports/WSD-20260507-18-legacy-content-inventory.md
- agent-workflow/reports/WSD-20260507-18-v2-content-migration-map.md
- 本派发单

输入候选：
- 01-SiteV2/content/03-structured-signals/legacy/v1-signals-legacy-candidates-2026-05-07.md
- 01-SiteV2/content/10-databases/legacy/v1-scoring-legacy-heat-evidence-candidates-2026-05-07.md
- 01-SiteV2/content/05-trend-chain/legacy/v1-trend-context-2026-05-07.md
- 01-SiteV2/content/07-points/legacy/v1-point-calibration-candidates-2026-05-07.md
- 01-SiteV2/content/08-opportunities/deep-dive/legacy/v1-opportunity-report-candidates-2026-05-07.md

硬要求：
- 不把 V1 文档原样发布到 V2 网站。
- 不把 legacy candidates 未经精修直接塞进 site-content.json。
- 不处理 09-ai-news-radar。
- 不恢复旧 04-Site。
- 不做 Netlify deploy。
- 不切正式域名。
- Opportunity 标题不能写公司名。

最终必须输出：
- agent-workflow/reports/WSD-20260508-03-legacy-refinement-inventory.md
- 01-SiteV2/content/00-inbox/legacy-import/legacy-publish-ready-index-2026-05-08.md
- refined 内容文件写入 `01-SiteV2/content/*/refined/`
- 更新后的 `01-SiteV2/site/data/site-content.json`
- 更新后的 `01-SiteV2/site/data/site-content.js`
- 本地网站 HTTP 检查和桌面 / 移动截图，保存到 `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/`
- agent-workflow/reports/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot-closeout.md

完成后回调度中枢：
收口：agent-workflow/reports/WSD-20260508-03-v2-legacy-candidates-refinement-autopilot-closeout.md
```
