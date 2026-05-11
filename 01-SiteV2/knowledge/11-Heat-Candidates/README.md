---
title: Heat Candidate Library
type: knowledge-index
status: active-observation-layer
---

# 热度候选观察库

存放未升级的 Heat Candidate。这里是观察型知识资产池，不是正式 Signal / Trend / Opportunity。

用途：

- 保存高热但证据不足的主题。
- 记录首次出现、重复出现、来源结构和关联标签。
- 支持 7 / 30 / 90 天回看。
- 为未来升级为 Signal / Trend / Risk Trend 提供历史积累和回链。
- 避免每天重复判断同一批热度线索。

处理规则：

- 未升级 Heat Candidate 入本目录。
- 升级为 Structured / Front Signal 后，原 Heat Candidate 必须标记 `converted_to`，新 Signal 必须回链 `origin_heat_candidates`。
- 升级为 Trend / Risk Trend 后，原 Heat Candidate 必须标记 `converted_to`，新 Trend 必须回链 `origin_heat_candidates`。
- 连续 3 次无法补证，标记 `downgraded_noise`，但不删除。
- 未来重新升温时更新同一 Heat Candidate，不新建重复资产。

该回链规则是 F 类验收硬门槛。

最小字段：

```yaml
id:
type: heat_candidate
title:
date:
status: watch | upgraded | downgraded_noise
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
last_reviewed:
```

正文建议：

1. 为什么热。
2. 目前缺什么证据。
3. 来源结构。
4. 关联标签。
5. 后续升级条件。
6. 历史出现记录。
7. 已转化资产。

模板：`../09-Templates/heat-candidate-note-template.md`
