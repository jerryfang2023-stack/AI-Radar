---
title: AIBrief Library
type: knowledge-index
status: active
---

# 商业内参库

存放 AIBriefIssue：跨周期、跨栏目、可归档的商业组合判断报告。

商业内参不是单个 Opportunity Deep Dive。它围绕一个主题、赛道、趋势或周期，把多个 Signal、Opportunity、Trend、Builders 观点和风险证据组织成一份可复盘的判断资产。

入库要求：

- 有明确覆盖周期：7 天、30 天、90 天、月度、季度或专题周期。
- 至少关联 Signal / Trend / Opportunity / Point 中的两类资产。
- 有执行摘要、信号链、机会组合、趋势判断、Builders 观点分歧、风险与反证、判断结论、后续观察和来源附录。
- 所有事实、数据和案例必须有来源名、来源等级、原始外链和增量事实。
- Builder 观点只能作为观点校准，不替代事实主证据。

最小字段：

```yaml
id:
brief_id:
type: ai_brief_issue
title:
date:
period:
brief_type:
status:
source_level:
source_urls:
formal_tags:
evidence_status:
covered_signals:
covered_trends:
covered_opportunities:
covered_points:
covered_builders:
related_signals:
related_trends:
related_opportunities:
related_points:
related_people:
related_briefs:
related_heat_candidates:
evidence_summary:
risk_summary:
judgment_status:
last_reviewed:
```

模板：`../09-Templates/ai-brief-note-template.md`
