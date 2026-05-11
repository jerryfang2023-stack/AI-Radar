---
title: MOC Library
type: knowledge-index
status: active
---

# MOC｜知识导航与每日判断索引

本目录存放知识库导航页、主题索引和每日判断索引。

今日要点不全文入库，但每天应沉淀一份每日判断索引，用于回看当天主判断、关键词、来源状态和相关资产。

## Daily Brief Index

命名规则：

```text
YYYY-MM-DD--daily-brief-index.md
```

示例：

```text
2026-05-10--daily-brief-index.md
```

每日判断索引只保存：

1. 今日主判断：3-5 条，不超过 500 中文字。
2. 关键词表：公司、产品、人物、赛道、场景、风险、来源类型、正式标签。
3. 相关内容索引：Front Signals、Structured Signals、Opportunities、Trends、Builders / Points、AIBriefs、Heat Candidates。
4. 来源状态摘要：S/A/B 来源数量、M/C 讨论升温线索数量、证据缺口、是否降级日。
5. 今日状态：complete、fallback、evidence_insufficient、no_deep_dive。

不保存：

- 今日要点全文。
- 每日流水账。
- Raw / Pool / Heat Candidate 内部过程明细。
- 未确认事实结论。

## Frontmatter

```yaml
id:
type: daily_brief_index
title:
date:
status:
daily_status: complete | fallback | evidence_insufficient | no_deep_dive
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
keywords:
source_summary:
last_reviewed:
```

## 边界

- Daily Brief Index 是导航资产，不是正式 Signal / Trend / Opportunity。
- 它可以回链当天相关资产，但不能替代原始来源和正式知识卡。
- 后续搜索某个趋势、人物、机会时，可以通过 MOC 找回当天判断。
