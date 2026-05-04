---
title: WSD-20260504-22 Priority Engine 2.0 Fast Track Closeout
type: task-closeout
task_id: WSD-20260504-22-priority-engine-2-fast-track-implementation
date: 2026-05-04
status: done
owner: pm / data / dev
---

# WSD-20260504-22 收口｜Priority Engine 2.0 快速落地

## 1. 任务状态

状态：`done`

本窗口已连续完成 PM 边界确认、`ai-2` 提示词升级、Dev 第一版解析实现、QA 抽查与可运行验证。按用户后续说明，Netlify 仍在绑定和授权，暂不纳入本轮验收阻塞；本地预览已可访问。

本地预览：

```text
http://localhost:8791/index.html
```

## 2. PM 边界确认

- Priority Engine 2.0 继续是后台判断能力，不新增普通前台栏目。
- Judgment Node 是后台判断节点，不是公司榜单、投资建议或单条新闻评分。
- 旧 30 分评分表短期保留，避免破坏现有同步、Opportunity 匹配和 Trend 关系。
- 对外状态统一为：优先验证、持续观察、早期观察、谨慎观察、暂缓关注。
- The Point 只作为观点共识、分歧或边界信号，不作为事实证据直接加权。

## 3. ai-2 提示词升级

已更新：

- `提示词/AI机会评分与趋势判断系统V4.0.md`

主要变化：

- 保留旧 30 分评分表。
- 将旧角色从机会方向的投资化判断改为 WaveSight AI Priority Engine 商业信号评分。
- 新增 `Priority Engine 2.0 判断节点` 输出段。
- 新增 Judgment Node、判断类型、Priority 状态、六个 0-100 模块、7 / 30 / 90 天回测提示。
- 明确 The Point 不作为事实证据直接加权。
- 清理 `做多 / 做空 / 必投 / 稳赚 / 确定性机会` 等表达。

## 4. Dev 实现

已更新：

- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/js/app.js`
- `04-Site/data/radar-data.json`
- `04-Site/data/radar-data.js`
- `agent-workflow/product/priority-engine-2.md`
- `agent-workflow/prd/active/PRD-003-opportunities-engine.md`
- `agent-workflow/prd/active/PRD-004-trends-model.md`

实现内容：

- 新增 `judgmentNodes` 输出层。
- 新增 `priorityEngine` 摘要：版本、Judgment Node 数量、显式 / 派生行数、The Point 证据模式。
- 每条 Priority Row 输出 `judgmentId`、`judgmentTitle`、`judgmentNodeSource`、`priorityScoreV2`、`priorityStatusV2`、`judgmentType`、六个 2.0 模块字段、回测提示和 The Point 边界。
- Opportunity 输出 `relatedJudgmentIds`、`judgmentId`、`priorityScoreV2`、`priorityStatusV2`、`evidenceQualityScore`、`momentumScore`、`pointSupportScore`、`counterEvidenceScore`。
- Trend 输出 `judgmentIds`、`trendConfidence`、`pointConsensusState`、`counterEvidenceState`、`lastCalibrationDate`。
- 历史 Markdown 没有 2.0 字段时采用 `derived` 降级策略，不批量重写内容源。
- 修复判断节点关系中 ID 被 `/` 拆分的问题，保证 `AI客服/语音Agent` 等名称不被误拆。
- 前台脚本改为展示非投资化状态，并从生成数据中净化历史评分说明里的旧表达。

当前数据结果：

```text
33 Signals / 39 Priority Rows / 22 Judgment Nodes / 13 Trends / 34 Points / 5 Point Sources / 27 Opportunities
```

## 5. QA 抽查

抽查 5 条 Priority / Opportunity / Trend：

| Priority Row | Judgment Node | Source | Status | Opportunity | Trend | Point Mode |
|---|---|---|---|---|---|---|
| `2026-04-29-Hightouch` | `AI营销Agent` | derived | priority_verify | AI营销Agent | AI营销 | viewpoint_only |
| `2026-04-29-Avoca` | `AI语音客服首轮分流助手` | derived | priority_verify | AI语音客服首轮分流助手 | AI客服/语音Agent | viewpoint_only |
| `2026-04-30-AI营销平台（Hightouch）` | `AI营销Agent` | derived | priority_verify | AI营销Agent | AI营销 | viewpoint_only |
| `2026-05-01-AI客服Agent（Netomi）` | `AI企业客服执行Agent` | derived | priority_verify | AI企业客服执行Agent | AI客服/语音Agent | viewpoint_only |
| `2026-04-29-Parallel Web Systems` | `AI Agent基础设施服务` | derived | priority_verify | AI Agent基础设施服务 | AI Agent | viewpoint_only |

QA 结论：

- 5 条样本均有稳定 Judgment Node。
- 5 条样本均能落到 Opportunity 和 Trend。
- `pointIntelligenceScore` 在历史派生数据中为 `N/A`，未把 The Point 当事实证据加权。
- 生成数据和普通前台文件未命中 `做多 / 做空 / 必投 / 稳赚 / 确定性机会`。
- 旧 30 分表仍保留，`priorityScoreV2` 由旧分数兼容映射到 0-100。

## 6. 运行检查

已运行并通过：

- `node --check 04-Site/scripts/sync-data.mjs`
- `node --check 04-Site/scripts/check-relations.mjs`
- `node --check 04-Site/js/app.js`
- `node 04-Site/scripts/sync-data.mjs`
- `node 04-Site/scripts/check-relations.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- UTF-8 读取更新后的提示词与本收口文件，中文无乱码。

关系检查结果：

- 硬错误：0
- 软提醒：12
- Priority -> Judgment Node：39/39
- Judgment Node -> Priority：22/22
- Judgment Node -> Signal：22/22
- Judgment Node -> Trend：22/22
- Judgment Node -> Opportunity：22/22

软提醒说明：

- 1 条 2026-05-04 Sage 评分项暂未进入 Trend。
- 1 条对应 Signal 暂未进入 Trend。
- 5 张早期 Opportunity 仍缺评分证据及 Signal 证据，这是既有运营复核项，不是本次硬错误。

未运行：

- 浏览器截图验收未运行。本任务主要改数据解析、提示词和关系检查；已用本地 HTTP 预览确认首页可访问。
- `check-tags.mjs` 未运行。本任务未改标签字典、Markdown tags 或标签检查口径。

## 7. 可运行 / 可预览状态

本地可运行：

```text
http://localhost:8791/index.html
```

Netlify：

- 已发现 `netlify.toml`，发布目录为 `04-Site`。
- 已发现站点绑定：`7ab8a5d2-477b-439d-ad4b-57f449ebad9e`。
- 已通过 Netlify 插件获取部署命令并执行。
- 远端部署失败：`500 Internal Server Error`。
- 用户后续说明：Netlify 还在绑定和授权，可以先忽略 Netlify。
- 结论：本次不冒充已上线；Netlify 不作为 WSD-20260504-22 的验收阻塞，后续待授权完成后再由部署任务继续处理。

## 8. 自动化影响

`ai-2`：有影响。

- 已更新每日机会评分提示词。
- 后续 `ai-2` 应继续输出旧 30 分表，并新增 Priority Engine 2.0 拆解段。

`ai-the-point`：本轮未改。

- 后续轻量增强项：The Point 可补充观点立场、支持 / 质疑 / 修正的 Judgment Node、可验证边界和是否进入反证观察。

`ai-3`：本轮未改统一同步闸门。

- 因 `judgmentNodes` 已进入网站数据，后续应在 `ai-3` 或统一同步质量口径中补充 Priority Row -> Judgment Node 的检查摘要。
- 当前 `check-relations.mjs` 已覆盖基础断链检查，可作为后续闸门升级依据。

## 9. 主调度窗口验收建议

可以提交主调度窗口验收。

建议验收重点：

- 确认 `ai-2` 提示词是否接受非投资化状态命名。
- 确认 `judgmentNodes` 第一版字段可作为后续 Admin / 回测视图基础。
- Netlify 授权完成后，再由 `P0-4A / WSD-20260504-17-netlify-preview-deploy` 继续处理预览部署。

## 10. 调度中枢验收

2026-05-04 调度中枢已验收通过，状态更新为 `accepted`。

调度中枢复核：

- 数据中已有 `22` 个 `judgmentNodes`。
- `priorityEngine.version` 为 `2.0`。
- `priorityRowsWithJudgmentNode` 为 `39`，全部为 `derived` 兼容派生。
- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/scripts/check-relations.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过，同步结果为 `33 signals / 39 score rows / 13 trends / 34 points / 5 point sources / 27 opportunities`。
- `node 04-Site/scripts/check-relations.mjs` 通过，硬错误 0，软提醒 12，`Priority -> Judgment Node` 为 `39/39`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-123257.md`。

非阻塞遗留：

- 浏览器截图验收未运行；本轮主要是数据解析、提示词和关系检查，页面展示未作为 P0 验收面。
- Netlify 未重新部署本轮 Priority Engine 2.0 数据；closeout 已说明远端部署遇到授权 / 绑定问题，不冒充上线。
- 旧 `04-Site/scoring.html` 中存在否定式文案 `不是投资建议`，属于历史页面遗留表达，不阻塞本轮 Judgment Node 验收；后续 Copy / 前台栏目边界复查可处理。
