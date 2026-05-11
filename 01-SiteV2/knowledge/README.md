---
title: WaveSight Knowledge
date: 2026-05-10
status: active-knowledge-layer
type: obsidian-knowledge-root
encoding: UTF-8
---

# WaveSight Knowledge｜观澜AI 长期知识库

本目录用于在 Obsidian 中长期沉淀观澜 AI 的观点库、案例库、信号库、机会库和来源库。

它不是每日生产漏斗。每日自动化仍写入：

```text
01-SiteV2/content/
```

本目录只接收经过筛选、可复用、可双链的知识资产。

## 目录分工

| 目录 | 用途 | 入库条件 |
|---|---|---|
| `00-MOC/` | 总索引、主题索引、每日判断索引 | 手工维护、阶段性更新或每日生成 Daily Brief Index |
| `01-Signals/` | 长期信号库 | 来自 Front / Structured，需有稳定 ID 和来源 |
| `02-Points/` | 观点库 | Builder / VC / Founder / Research 观点，需保留原文链接 |
| `03-Cases/` | 案例库 | 公司、产品、客户、部署、融资、失败案例 |
| `04-Opportunities/` | 机会库 | 经过六维分析或 Deep Dive 的机会判断 |
| `05-Trends/` | 趋势库 | 多条 Signal 支撑的长期趋势 |
| `06-Sources/` | 来源库 | 官网、媒体、论文、X、播客、报告、数据库 |
| `07-Companies/` | 公司库 | 公司、产品、团队、融资、客户线索 |
| `08-People/` | 人物库 | Builder、投资人、研究员、创始人、专家 |
| `09-Templates/` | Obsidian 模板 | 新建知识卡片时复制使用 |
| `10-AIBriefs/` | 商业内参库 | AIBriefIssue，跨周期组合判断报告 |
| `11-Heat-Candidates/` | 热度候选观察库 | 未升级 Heat Candidate，作为观察型知识资产 |
| `99-Archive/` | 过期或废弃知识卡片 | 不删除，保留历史判断 |

## 与内容生产线的关系

```text
content/01-raw        -> 一般不进入 knowledge
content/02-pool       -> 仅少数候选可进入 Sources / Cases
content/03-structured -> 可沉淀为 Signals / Trends
content/04-selected   -> 优先沉淀为 Signals
content/05-trend-chain -> Heat Candidates / Trends
content/07-points     -> 优先沉淀为 Points / People
content/08-opportunities -> 优先沉淀为 Opportunities / Cases
content/10-databases  -> 可映射到 Trends / Companies / Sources
content/08-ai-brief 或 AIBriefIssue -> AIBriefs
today daily brief -> 00-MOC daily brief index
```

## 命名规则

建议文件名：

```text
YYYY-MM-DD--type--slug.md
```

示例：

```text
2026-05-10--signal--cx-agent-delivery-economics.md
2026-05-10--point--html-is-new-markdown.md
2026-05-10--case--sierra-cx-agent-platform.md
```

## 稳定 ID

每张卡片必须保留原始稳定 ID：

- Signal：`FS-YYYYMMDD-xx` 或 `S-YYYYMMDD-xx`
- Point：`PT-YYYYMMDD-xx`
- Case：`CASE-YYYYMMDD-xx`
- Opportunity：`OPP-...`
- Trend：`TRD-...`
- Source：`SRC-...`
- Company：`CO-...`
- Person：`PER-...`
- AIBriefIssue：`BRIEF-...`
- Heat Candidate：`HC-...`

## 双链规则

每张卡片至少连接 2 类关系：

```text
related_signals:
related_points:
related_cases:
related_opportunities:
related_trends:
related_sources:
related_companies:
related_people:
related_briefs:
related_heat_candidates:
```

正文中建议使用 Obsidian wikilink：

```markdown
[[2026-05-10--signal--cx-agent-delivery-economics]]
[[sierra]]
[[cx-agent-platform-consolidation]]
```

## 入库原则

- 不把 Raw 80-150 全部搬入知识库。
- Pool 默认不入库，只保留每日筛选过程。
- 未升级 Heat Candidate 不进入 Signals / Trends / Opportunities，但进入 `11-Heat-Candidates/` 作为观察型知识资产。
- 今日要点不全文入库，只沉淀 Daily Brief Index 到 `00-MOC/`。
- Heat Candidate 升级为 Signal / Trend 后必须双向回链：原候选写 `converted_to`，新资产写 `origin_heat_candidates`。
- 不把社媒观点当作事实证据。
- 每条观点必须保留 `source_url` 和 `original_view`。
- 每条案例必须说明“为什么是案例”，不是只存公司名。
- 每条信号必须说明商业变量：客户、成本、收入、效率、风险、采购、渠道或竞争位置。
- 每条机会必须保留反证和证据缺口。
- 每期商业内参必须关联 Signal / Trend / Opportunity / Point 中至少两类资产。
- 过时判断不删除，移动到 `99-Archive/` 并写明 archive reason。

## Frontmatter 最小字段

所有正式知识卡必须包含通用基础字段。允许空数组，但不允许缺字段。

```yaml
id:
type:
title:
date:
status:
source_level:
source_urls:
formal_tags:
evidence_status:
related_signals:
related_trends:
related_opportunities:
related_points:
related_people:
related_briefs:
related_heat_candidates:
last_reviewed:
```

硬规则：

- `id` 必须稳定，不能随标题变化。
- `type` 允许值：`signal`、`point`、`person`、`opportunity`、`trend`、`source`、`company`、`case`、`ai_brief_issue`、`heat_candidate`。
- `source_urls`、`formal_tags`、`last_reviewed` 不允许缺字段。
- `M` 不能作为事实证据来源等级，只能作为 `source_role: source-router`。

### Signal 增量字段

```yaml
signal_id:
signal_level: structured | front
event_type:
business_variables:
source_cluster:
counter_evidence_status:
trend_candidate:
origin_heat_candidates:
converted_from:
```

### Point 增量字段

```yaml
point_id:
person_id:
person_name:
person_title:
platform:
source_url:
original_view:
translated_view:
guanlan_interpretation:
view_status: new | continuing | revised | shifted | conflicting
```

### Person / Builder 增量字段

```yaml
person_id:
name:
title:
organization:
role_type:
focus_areas:
timeline_points:
current_view_summary:
view_change_status:
```

### Opportunity 增量字段

```yaml
opportunity_id:
opportunity_stage:
target_customer:
payer:
workflow_changed:
business_model:
evidence_level:
risk_status:
representative_cases:
related_deep_dive:
```

### Trend / Risk Trend 增量字段

```yaml
trend_id:
trend_type: normal | risk
trend_status: emerging | rising | splitting | cooling | mature | risk
time_window:
supporting_signals:
supporting_heat_candidates:
counter_evidence:
upgrade_trigger:
downgrade_trigger:
```

### Source 增量字段

```yaml
source_id:
source_name:
source_type:
source_level:
original_url:
publisher:
author:
published_at:
source_role: fact-main | fact-support | lead-only | point-only | source-router
```

### Company / Case 增量字段

```yaml
company_id:
company_name:
case_id:
case_type:
product:
customer:
funding_stage:
evidence_facts:
related_sources:
```

### AIBriefIssue 增量字段

```yaml
brief_id:
period:
brief_type:
covered_signals:
covered_trends:
covered_opportunities:
covered_points:
covered_people:
evidence_summary:
risk_summary:
judgment_status:
```

### Heat Candidate 增量字段

```yaml
heat_id:
first_seen:
last_seen:
seen_count_7d:
seen_count_30d:
heat_status: 热度上升 | 证据不足 | 继续观察 | 风险升温
source_type_count:
source_samples:
candidate_tags:
upgrade_trigger:
downgrade_reason:
converted_to:
```
