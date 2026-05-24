---
task_id: WSD-20260523-trend-page-real-candidates-frontstage
title: 趋势页面真实候选前台同步
date: 2026-05-23
status: ready
priority: P0
owner: Build & Release / Product Commander
harness: page-copy-typography
encoding: UTF-8
---

# WSD-20260523 趋势页面真实候选前台同步

## 1. 背景

趋势追踪页面已完成专项重设计，但当前前台数据仍没有把真实 `trend_candidate` 写入 `contentIndex.trends`。

用户已确认：可以推到前台，并要求把两条真实趋势候选信息写入。

本任务只负责把真实候选趋势作为“正在形成的趋势 / 观察方向”进入前台，不生成、不伪装、不升级为正式趋势报告。

## 2. 固定读取

执行窗口只读取以下最小上下文：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/02-vi-style.md`
5. `context/03-copy-style.md`
6. `context/06-execution-harness.md`
7. `agent-workflow/product/trend-model.md`
8. `agent-workflow/product/tag-taxonomy.md`
9. `agent-workflow/reports/WSD-20260522-trend-tracking-page-redesign-build-closeout.md`
10. 本派发单

执行窗口可按需读取且仅限以下真实候选资产：

- `01-SiteV2/content/06-asset-candidates/trend/2026-05-21--trend-candidate--enterprise-agent-budget-and-workflow-signals-are-accumulating.md`
- `01-SiteV2/content/06-asset-candidates/trend/2026-05-22--trend-candidate--enterprise-agent-deployment-shifts-to-workflow-context-and-governance.md`

如发现 content 与 knowledge 镜像不一致，优先以 `01-SiteV2/content/06-asset-candidates/trend/` 为当前前台同步源，并在 closeout 说明差异。

## 3. 真实信息写入范围

必须把以下两条真实趋势候选写入前台数据：

| ID | 前台标题 | 前台口径 |
|---|---|---|
| `TRC-20260521-01` | 企业 Agent 的预算和工作流信号开始积累 | 企业 Agent 不再只按模型能力被讨论，而是被放进预算、容量、行业流程和运营指标里评估。 |
| `TRC-20260522-01` | 企业 Agent 部署问题转向流程上下文和治理 | 企业 Agent 要进入真实流程，必须同时解决上下文、稳定运行和人工复核。 |

写入位置：

- 进入 `contentIndex.trends`。
- 不进入 `contentIndex.trendReports`。
- 不新建正式 Trend Report。
- 不把 `trend_evidence_gate: threshold_pending` 解释成已形成趋势。

## 4. 实现要求

### 4.1 数据同步

更新 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`，支持从 `trend_candidate` markdown 解析并写入 `contentIndex.trends`。

字段映射建议：

| 候选资产字段 | 前台字段用途 |
|---|---|
| `id` | 趋势候选 ID |
| `title` | 卡片标题 |
| `date` / `updated_at` | 更新时间 |
| `status` | 候选状态 |
| `asset_level` | 阶段：candidate |
| `trend_evidence_gate` | 证据门状态，不得包装为正式通过 |
| `trend_hypothesis` | 一句话判断 / 观察方向 |
| `boundary_notes` | 内部边界字段；前台不要显性写“证据缺口” |
| `next_observation` | 后续观察点 |
| `related_signal_cards` | 关联商业信号 |
| `related_opinion_cards` | 关联观点卡 |
| `supporting_scenes` | 关联场景 |
| `formal_tags` | 前台 tags，必须来自正式 tag 体系 |

同步后运行站点数据生成，让 `01-SiteV2/site/data/site-content.json` 与 `01-SiteV2/site/assets/site-content.js` 同步更新。

### 4.2 前台展示

趋势追踪页应把这两条显示为：

- 正在形成的趋势。
- 观察方向。
- 材料正在累积。

不得显示为：

- 已形成趋势报告。
- 正式趋势报告。
- 机会判断。
- 确定性结论。

如果当前前台存在 `TRD-WATCH-20260522` 这类 fallback 观察项：

- 当 `contentIndex.trends` 已有真实候选时，不得让 fallback 成为主列表第一项。
- 可隐藏、降级到辅助提示，或仅在没有真实候选时使用。
- closeout 必须说明最终处理方式。

### 4.3 关系建立

前台至少要能保留以下关系，不要求一次做复杂关系图：

- 趋势候选 -> 相关商业信号。
- 趋势候选 -> 相关观点卡。
- 趋势候选 -> 相关场景。
- 趋势候选 -> 正式 tags。

如当前前台卡片无法点击到完整详情页，可先保证关系 ID 和 tags 进入数据层，并在页面中以可识别的关联摘要呈现。

### 4.4 文案边界

页面不得恢复以下表达：

- `7D / 30D / 90D` 作为硬时间窗口。
- `反证` 作为必填门槛。
- `还缺什么` / `主要缺口` / `证据缺口` 作为前台模块标题。
- `机会判断` 作为当前趋势候选的独立卡片类型。

可以使用：

- 近期观察。
- 同类信号。
- 判断参照。
- 风险边界。
- 后续观察。

## 5. 验收标准

必须通过：

```text
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

必须人工或脚本确认：

- `contentIndex.trends` 至少包含 `TRC-20260521-01` 与 `TRC-20260522-01`。
- `contentIndex.trendReports` 未因本任务新增正式趋势报告。
- 两条趋势候选的 tags 均来自正式 tag 体系。
- 趋势追踪页主列表能看到两条真实候选。
- 正式趋势报告区在没有正式报告时仍保持克制空状态。
- 页面没有恢复旧栏目标题区。
- 页面没有出现被禁止的旧前台表达。

建议补充浏览器截图：

- 桌面趋势追踪页。
- 移动趋势追踪页基础观察。

如浏览器或截图环境不可用，closeout 说明原因。

## 6. 禁止事项

- 不新增一级导航。
- 不修改 GitHub / Netlify / 自动化配置。
- 不部署。
- 不推送。
- 不把候选趋势提升为正式趋势报告。
- 不新增正式 tag。
- 不继承 failed / abandoned / stopped 成果。

## 7. 交付物

执行完成后新增 closeout：

```text
agent-workflow/reports/WSD-20260523-trend-page-real-candidates-frontstage-closeout.md
```

closeout 必须说明：

- 实际修改了哪些文件。
- 两条真实候选是否已进入 `contentIndex.trends`。
- `TRD-WATCH-20260522` fallback 如何处理。
- 是否新增或删除文件。
- 跑了哪些验证。
- 是否部署或推送，默认应为未部署、未推送。

