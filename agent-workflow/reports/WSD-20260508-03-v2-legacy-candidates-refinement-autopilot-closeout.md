---
title: V2 Legacy Candidates Refinement Closeout
date: 2026-05-08
task_id: WSD-20260508-03-v2-legacy-candidates-refinement-autopilot
board_id: V2-LEGACY-REFINE-AUTO
status: completed / local-site-ready / netlify-paused
owner: Intelligence Data Agent / Dev Agent / QA Agent / Workflow Agent
encoding: UTF-8
---

# V2 Legacy Candidates 精修、合并、入站与网站可用 Closeout

## 1. 执行范围

本轮按派发单执行 `V2-LEGACY-REFINE-AUTO`，对 V1 legacy candidates 做精修、合并和发布判断，并接入 V2 本地站点数据生成器。

执行边界：

- 未处理 `09-ai-news-radar/`。
- 未恢复旧 `04-Site`。
- 未做 Netlify deploy。
- 未把 V1 文档原样发布到 V2。
- 未恢复 The Point / Trends / Scoring 为一级前台栏目。

## 2. Data Agent 精修判断

已输出 inventory：

- `agent-workflow/reports/WSD-20260508-03-legacy-refinement-inventory.md`

发布结果：

| 类型 | publish-ready | hold / merged | reject |
|---|---:|---:|---:|
| Opportunity | 3 | 17+ | 0 |
| Point | 3 | 3 | 0 |
| Signal | 2 | 6 | 0 |
| Trend | 3 | 2 | 0 |
| HeatEvidence | 4 | 7 | 0 |

核心合并：

- 客服执行 Agent / 语音客服分流 / 客户体验 Agent 合并为 `客户体验 Agent 平台`。
- Agent 治理 / 权限审计 / 企业 Agent 工作平台合并进 `企业 Agent 控制与审计层`。
- 专业服务 AI 工作流 / 行业专家知识 Agent 化合并为 `专业服务 AI 工作流平台`。
- 采购 / 应付流程相关 legacy 方向已由 2026-05-06 `采购应付 Agent 运营层` 承接，本轮不重复新增前台机会。

## 3. Refined 内容输出

已新增：

- `01-SiteV2/content/08-opportunities/deep-dive/refined/legacy-opportunities-publish-ready-2026-05-08.md`
- `01-SiteV2/content/07-points/refined/legacy-point-calibration-publish-ready-2026-05-08.md`
- `01-SiteV2/content/03-structured-signals/refined/legacy-signals-publish-ready-2026-05-08.md`
- `01-SiteV2/content/05-trend-chain/refined/legacy-trend-context-publish-ready-2026-05-08.md`
- `01-SiteV2/content/10-databases/refined/legacy-heat-evidence-publish-ready-2026-05-08.md`

发布索引：

- `01-SiteV2/content/00-inbox/legacy-import/legacy-publish-ready-index-2026-05-08.md`

## 4. Dev 接入

已更新：

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

生成器新增 refined publish-ready 读取逻辑，只读取 `refined/` 目录内 `publish_decision: publish-ready` 的条目，不读取未精修 legacy candidate。

生成数据摘要：

| 内容索引 | 数量 |
|---|---:|
| `meta.legacyRefined.signals` | 2 |
| `meta.legacyRefined.points` | 3 |
| `meta.legacyRefined.trends` | 3 |
| `meta.legacyRefined.opportunities` | 3 |
| `contentIndex.signals` | 11 |
| `contentIndex.points` | 9 |
| `contentIndex.trends` | 13 |
| `contentIndex.opportunities` | 6 |

## 5. QA 检查

本地服务：

- `http://127.0.0.1:4173/`

HTTP 检查页面：

- `/`
- `/daily.html`
- `/signals.html`
- `/opportunities.html`
- `/brief.html?state=member`
- `/daily-detail.html`
- `/signal-detail.html?id=<legacy-signal-slug>`
- `/opportunity-detail.html?id=<legacy-opportunity-slug>`
- `/data/site-content.json`
- `/data/site-content.js`

结果：

- HTTP 检查均为 200。
- 桌面 / 移动截图完成。
- 核心页面无横向溢出。
- legacy signal detail 与 legacy opportunity detail 已按 generated data slug 复检，页面标题命中预期内容。

QA 材料：

- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/browser-check.json`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-home.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-daily.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-signals.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-opportunities.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-brief-member.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-daily-detail.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-legacy-signal-detail.png`
- `agent-workflow/reports/v2-legacy-refine-site-ready-2026-05-08/desktop-legacy-opportunity-detail.png`
- 对应 `mobile-*.png`

## 6. Quality Gates

已运行并通过：

```powershell
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/data/site-content.js
node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07
node agent-workflow/tools/run-quality-gates.mjs syntax
```

报告：

- `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-175618.md`
- `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-175618.md`

公开页面 / app / generated data 禁用词扫描通过，未发现 `后台 / JSON / 同步 / 字段 / 下一步验证 / 强证据 / 机会确定 / 确定性 / 编辑 / 恢复`。

## 7. 自动化与部署影响

- V2 daily automation 后续生成站点数据时会继续读取 refined publish-ready 内容。
- 本轮没有创建、更新或恢复旧 V1 自动化。
- 本轮没有 Netlify 上传、远端发布检查或域名动作。

## 8. 残余风险

- legacy refined 内容仍主要基于本地归档和已有 V2 样本，没有为每个 hold 项做联网二次补证。
- 营销、具身智能、医疗、工业仿真和端侧推理等 legacy 方向仍保留为 hold，需要后续按赛道单独二搜和精修。
- 真实会员权限和云端发布仍需另行任务，不在本轮范围。

## 9. 建议

下一步可派发：

1. V2 legacy hold 二次搜索补证批次，优先营销 / AI Coding / 医疗 / 工业。
2. V2 relation validator，检查 refined publish-ready 与现有 V2 资产的双向关系。
3. V2 本地站点发布前 release checklist，等待用户重新确认 Netlify 后再执行。
