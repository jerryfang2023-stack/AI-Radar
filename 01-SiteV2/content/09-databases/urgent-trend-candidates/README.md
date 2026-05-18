# Urgent Trend Candidates

本目录记录趋势快报的急件候选。它是自动化和复核记录，不是前台文章，也不是知识卡模板。

## 目录规则

文件命名：

```text
YYYY-MM-DD-urgent-trend-candidates.md
```

候选 ID：

```text
UTCAND-YYYYMMDD-XX
```

`UTCAND` 表示 Urgent Trend Candidate，避免和 UTC 时间混淆。

## 触发链路

```text
urgent_trend_candidate -> rapid_review -> temporary_trend_report_run
```

系统可以自动识别候选、整理来源和给出推荐，但 `approve_flash` 必须有人工作出最终放行。

## 最小记录字段

```yaml
id: UTCAND-YYYYMMDD-XX
candidate_title:
triggered_at:
matched_conditions:
raw_count:
source_type_count:
commercial_impact:
system_recommendation:
review_decision:
reviewer_role:
reviewer_window:
decision_time:
review_notes:
linked_trend_report:
```

## matched_conditions

满足 3 个条件可进入急件候选，但必须同时包含“多源信号”和“商业影响”。

可选条件：

- `multi_source_signal`：24-48 小时内出现 5 条以上相关 Raw，且至少来自 3 个不同来源类型。
- `authoritative_source`：出现 S/A 来源，例如官方公告、监管文件、上市公司财报、权威媒体、重要论文 / 技术发布。
- `commercial_impact`：明确影响客户预算、业务流程、竞争格局、成本结构、收入方式或采购决策。
- `market_resonance`：builders、投资人、行业媒体、客户社区中至少两类人群开始讨论同一方向。

只满足热度不够。只满足技术发布不够。只满足 builders 兴奋也不够。

## candidate_priority

同一天多个急件候选时，按以下顺序排序：

```text
多源密度 > 观澜重点赛道 > 商业影响 > 来源质量 > 时间新鲜度
```

不要按热度排序。热度只说明有噪音或讨论，不代表值得写。

字段建议：

```yaml
priority_rank:
priority_reason:
multi_source_density:
key_track_fit:
commercial_impact_score:
source_quality_score:
freshness_score:
```

## review_decision

只保留三种：

| review_decision | 含义 |
|---|---|
| `approve_flash` | 放行趋势快报 |
| `keep_watching` | 继续观察，不写快报 |
| `downgrade_to_trend_card` | 降级为趋势卡，只进入状态记录 |

复杂情况写入 `review_notes`，不要扩展状态。

## Deferred Candidates

`trend-report-writer` 每次最多产出 1 篇。其他候选保留在当天文件中，不另开目录。

示例：

```markdown
## Deferred Candidates

- id: UTCAND-20260518-02
  candidate_title: AI Coding 成本路由
  priority_rank: 2
  deferred_reason: 多源密度高，但商业影响还需要补证
  next_review: 2026-05-19
  defer_count: 1
```

处理规则：

- weekly mode 检查过去 7 天 `deferred_candidates`。
- urgent mode 优先检查当天和前 48 小时 `deferred_candidates`。
- `next_review <= today` 时重新排序。
- 最多延后 2 次。
- 第三次必须落状态：`keep_watching`、`downgrade_to_trend_card` 或 `archived`。

## reviewer

不记录真实姓名，只记录角色和窗口。

推荐：

```yaml
reviewer_role: human_owner
reviewer_window: dispatch-hub
```

或：

```yaml
reviewer_role: Strategy Agent
reviewer_window: dispatch-hub
```

## linked_trend_report

如果放行快报，填入：

```yaml
linked_trend_report: TRD-FLASH-YYYYMMDD-XX
```

趋势快报 frontmatter 中必须反向记录：

```yaml
urgent_candidate_id: UTCAND-YYYYMMDD-XX
trigger: urgent_trend_candidate
```
