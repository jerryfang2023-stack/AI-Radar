---
id: CLU-YYYYMMDD-XX
type: change_cluster
title:
date:
status: active
created_at:
updated_at:

# 变化簇状态：new | strengthening | splitting | cooling | upgrade_candidate | archived
cluster_status: new

# 自动聚合信息
generated_by: auto
cluster_reason:
confidence:
review_status: auto_active

# 时间窗口
first_seen:
last_seen:
time_window:

# 聚合指标
change_card_count:
case_card_count:
opinion_card_count:
source_type_count:

# Tags 使用 agent-workflow/product/tag-taxonomy.md 的正式 tag_id
formal_tags:
  track: []
  function: []
  scenario: []
  customer: []
  evidence: []
  stage: []
  region: []
  source: []
  point: []

# 关联资产
related_change_cards: []
related_case_cards: []
related_opinion_cards: []
related_trend_cards: []
related_sources: []
related_people: []
related_companies: []
related_publications: []

# 升级 / 沉降
upgrade_candidate_for:
converted_to_trend_card:
archive_reason:
last_reviewed:
---

# {{变化簇标题}}

## 变化簇说明

用 2-4 句话说明这组变化为什么被聚在一起。

变化簇是临时工作资产，不是正式趋势结论。

## 聚合理由

说明系统为什么自动关联这些变化卡。

可包括：

- 同一技术路线。
- 同一场景。
- 相同客户需求。
- 同类产品。
- 同一公司 / 人物 / 机构。
- 同一来源链。
- 同一内容选题。

## 时间窗口

说明这组变化最早何时出现、最近何时更新、集中出现在哪个时间段。

## 关联变化卡

列出进入该簇的变化卡，并说明每张卡提供了什么增量信息。

- 变化卡：

## 关联案例卡

列出相关案例卡。

- 案例卡：

## 关联观点卡

列出相关前沿观点。

- 观点卡：

## 共同技术路线 / 方法变化

说明这组变化是否共享某种技术路线、方法、架构、交互、工作流或成本结构变化。

只解释商业含义，不做开发者教程。

## 共同客户需求 / 场景进程

说明这组变化是否指向相同客户需求或相同场景 AI 化进程。

## 当前状态

用自然语言说明该簇当前状态：

- 新出现。
- 增强中。
- 分化中。
- 降温。
- 升级候选。
- 归档。

前台如需展示，应使用自然表达，不展示内部状态字段。

## 是否接近趋势卡门槛

趋势卡最低门槛：

- 至少 3 张相关变化卡。
- 至少 2 个不同案例或对象。
- 至少 2 类来源。
- 至少 1 条技术路线或场景进程说明。

说明当前差距。

## 建议动作

可选：

- 保持观察。
- 合并到已有变化簇。
- 拆分为多个变化簇。
- 升级为趋势卡候选。
- 降级为历史背景。
- 归档。

## 自动关联质量

记录系统自动关联是否准确，是否存在误连、漏连、孤立卡片或需要批量审查的模式。

## 关联发布内容

列出引用过该簇的前台内容：

- 今日观察：
- 趋势追踪报告：
- 商业内参：

