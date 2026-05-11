---
title: V2 每日生产线治理 Stage D Obsidian 知识库生成规则阶段总结
date: 2026-05-10
task_id: WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
stage: D
status: in_progress / D-1-confirmed-and-written
owner: data / workflow
encoding: UTF-8
---

# Stage D｜Obsidian 知识库生成规则

## 已确认目录规则

用户已确认新增观察与内参目录，但需避开现有编号冲突。

现有目录：

- `01-SiteV2/knowledge/06-Sources/`
- `01-SiteV2/knowledge/08-People/`
- `01-SiteV2/knowledge/09-Templates/`

因此本阶段采用：

- Builders 不新建 `08-Builders/`，使用现有 `01-SiteV2/knowledge/08-People/`。
- AIBriefs 不新建 `09-AIBriefs/`，新增 `01-SiteV2/knowledge/10-AIBriefs/`。
- Heat Candidates 不使用 `06-Heat-Candidates/`，新增 `01-SiteV2/knowledge/11-Heat-Candidates/`。
- Sources 使用现有 `01-SiteV2/knowledge/06-Sources/`。

## Heat Candidate 规则修正

用户指出：未升级 Heat Candidate 如果完全不入库，未来难以调取和形成积累。

已确认修正：

- 未升级 Heat Candidate 不进入正式 Signal / Trend / Opportunity。
- 未升级 Heat Candidate 进入 `01-SiteV2/knowledge/11-Heat-Candidates/`，作为观察型知识资产。
- 用于 7 / 30 / 90 天回看、重复热度累计和未来升级回链。
- 连续 3 次无法补证可标记 `downgraded_noise`，但不删除。

## 内容类型映射

| 内容类型 | 知识库处理 |
|---|---|
| Raw | 不入正式知识库；保留本地原文档案 |
| Pool | 默认不入库；保留当日筛选过程 |
| Heat Candidate | 入 `11-Heat-Candidates/` 观察资产 |
| Structured Signal | 选择性入 `01-Signals/` |
| Front Signal | 优先入 `01-Signals/` |
| Builders / Point | 入 `02-Points/`，人物聚合入 `08-People/` |
| Opportunity Deep Dive | 入 `04-Opportunities/` |
| Trend / Risk Trend | 入 `05-Trends/`，Risk 用 `trend_type: risk` |
| Source | 入 `06-Sources/` |
| Company / Case | 分别入 `07-Companies/` / `03-Cases/` |
| AIBriefIssue | 入 `10-AIBriefs/` |
| 今日要点 | 不全文入库；沉淀主判断、关键词和关联索引到 `00-MOC/` |

## D-3 今日要点 MOC 规则

用户已确认：

- 今日要点不全文入库。
- 每日生成一份 Daily Brief Index，进入 `01-SiteV2/knowledge/00-MOC/`。
- 文件命名：`YYYY-MM-DD--daily-brief-index.md`。
- 示例：`2026-05-10--daily-brief-index.md`。

Daily Brief Index 只保存：

1. 今日主判断：3-5 条，不超过 500 中文字。
2. 关键词表：公司、产品、人物、赛道、场景、风险、来源类型、正式标签。
3. 相关内容索引：Front Signals、Structured Signals、Opportunities、Trends、Builders / Points、AIBriefs、Heat Candidates。
4. 来源状态摘要：S/A/B 来源数量、M/C 讨论升温线索数量、证据缺口、是否降级日。
5. 今日状态：complete、fallback、evidence_insufficient、no_deep_dive。

已写入：

- `01-SiteV2/knowledge/00-MOC/README.md`
- `01-SiteV2/knowledge/README.md`

## D-2 Frontmatter 最小字段

用户已确认：

- 基础字段作为所有知识卡通用硬门槛。
- 类型增量字段作为对应类型硬门槛。
- 允许空数组，但不允许缺字段。
- `source_urls`、`formal_tags`、`last_reviewed` 不允许缺。
- `M` 不能作为事实证据 `source_level`，只能作为 `source_role: source-router`。

已写入 `01-SiteV2/knowledge/README.md`：

- 通用基础字段。
- Signal 增量字段。
- Point 增量字段。
- Person / Builder 增量字段。
- Opportunity 增量字段。
- Trend / Risk Trend 增量字段。
- Source 增量字段。
- Company / Case 增量字段。
- AIBriefIssue 增量字段。
- Heat Candidate 增量字段。

同时已补齐：

- `01-SiteV2/knowledge/10-AIBriefs/README.md`
- `01-SiteV2/knowledge/11-Heat-Candidates/README.md`

## 已修改文件

- `01-SiteV2/knowledge/README.md`
- `01-SiteV2/knowledge/00-MOC/README.md`
- `01-SiteV2/knowledge/08-People/README.md`
- `01-SiteV2/knowledge/05-Trends/README.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/knowledge/10-AIBriefs/README.md`
- `01-SiteV2/knowledge/11-Heat-Candidates/README.md`
- `agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage-C.md`
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/v2/v2-directory-content-architecture.md`

## 未修改文件

- 未修改既有知识卡正文。
- 未修改每日内容正文。
- 未修改站点页面和自动化 toml。

## A-D 横向一致性检查

已检查 A-D 阶段中的数量、字数、栏目、知识库和历史规则残留。

已修正的冲突：

- `agent-workflow/product/daily-monitoring-algorithm-v2.md` 后段残留 Raw 30-50、Pool 10-15、Structured 5-8 的旧口径，已改为 Raw 80-150 / Pool 20-30 / Structured 8-15 / Front 3-5 / Deep Dive 1-2。
- `agent-workflow/v2/v2-algorithm-source-architecture.md` 残留旧数量目标，已同步新口径。
- `agent-workflow/v2/v2-directory-content-architecture.md` 残留旧目录数量说明，已同步新口径。
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md` 残留 Heat Candidate 不进入 Obsidian 长期知识库的旧表述，已改为进入 `01-SiteV2/knowledge/11-Heat-Candidates/` 观察资产。

剩余搜索命中但不是冲突：

- `AGENTS.md` 中“是否可迁移中国市场”属于 V1 历史商业雷达格式约束，不适用于 V2 机会解码。
- `agent-workflow/v2/v1-baseline-freeze.md` 中旧一级导航属于 V1 baseline freeze 历史记录。
- `column-architecture.md`、`COPY.md`、`intelligence-data-model.md`、stage-C 中的“中国迁移难点”均为反向规则，表示 V2 不再作为固定模块。
- stage-D 中 `08-Builders`、`09-AIBriefs`、`06-Heat-Candidates` 只出现在“不要新建这些冲突目录”的说明中。

当前未解决但需后续确认的遗漏：

- 2026-05-10 既有内容尚未按新版 v2content gate 回填，留到 F 类验收与回填确认。

## 下一步

已完成 D 类当前确认项。下一步进入 E 类历史冲突清理。

## D-4 Heat Candidate 升级回链硬门槛

用户已确认：

- Heat Candidate 一旦升级为 Structured / Front Signal，原 Heat Candidate 必须写 `converted_to`，新 Signal 必须写 `origin_heat_candidates`。
- Heat Candidate 一旦升级为 Trend / Risk Trend，原 Heat Candidate 必须写 `converted_to`，新 Trend 必须写 `origin_heat_candidates`。
- 原候选不删除，保留为热度历史。
- `converted_to` 和 `origin_heat_candidates` 纳入 F 类验收硬门槛。

已写入：

- `01-SiteV2/knowledge/README.md`
- `01-SiteV2/knowledge/11-Heat-Candidates/README.md`
- `01-SiteV2/content/README.md`
