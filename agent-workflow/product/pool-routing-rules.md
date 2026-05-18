---
title: Pool Routing Rules
date: 2026-05-18
status: active
owner: intelligence-data-agent / workflow-agent
---

# Pool Routing Rules｜候选池分流规则

Pool 是 Raw 之后的候选索引，不是事实正文，也不是最终判断资产。

它只回答三件事：

- 这条 Raw 是否值得继续加工。
- 它应该进入哪条后续链路。
- 它还缺哪些证据，不能写成什么结论。

Pool 只能引用 Raw，不能替代 Raw。变化卡、案例卡、趋势报告、今日观察和商业内参里的事实判断，必须回看 Raw 全文、Markdown 快照、JSON 证据对象，必要时二搜补 S/A/B 来源。

## 1. 输入

Pool 只能从 Raw 进入。

每条 Pool 候选必须能回到：

- `raw_ref`
- `raw_archive`
- `raw_json`
- `source_url`
- `full_text_hash`
- `key_excerpts`
- `business_elements`
- `evidence_seed`
- `missing_information`

没有 Raw 回链的材料不得进入正式 Pool，只能留在手工 inbox 或待补抓线索。

## 2. 分流类型

`pool_routes` 只允许：

- `core_pool`
- `emerging_pool`
- `user_feedback_pool`
- `watchlist`
- `index_only`
- `discard`

## 3. 分流条件

### core_pool

进入条件：

- `has_full_text=true`
- `extraction_quality=high|medium`
- `source_level=S|A|B`
- 有明确商业变化
- `commercial_value >= 3`
- `guanlan_relevance >= 3`

用途：

- 可作为变化卡、案例卡、趋势报告、今日观察和商业内参的事实候选。
- 进入前台前仍要检查 `missing_information`，必要时补证。

### emerging_pool

进入条件：

- B/C 级早期线索均可进入。
- `emerging_signal_score >= 4`。
- 指向新公司、新产品、新开源项目、早期融资、开发者采用、岗位 / 流程变化或新客户场景。

用途：

- 早期观察、趋势候选、商业热力图、后续补证。
- 不得直接写成前台事实结论。

### user_feedback_pool

进入条件：

- 来自 HN / Reddit / X / GitHub issues / forum / Product Hunt 评论等社区或用户反馈。
- 抓到可见文本、讨论串、评论、issue 内容或真实用户反馈。

用途：

- 讨论升温、开发者阻力、客户痛点、反证观察。
- 不得单独证明公司动作、客户采用、融资、收入、市场规模。

### watchlist

进入条件：

- 有继续观察价值，但证据不足。
- 可能缺少全文、缺少 S/A/B 来源、缺少客户案例、缺少变化前后流程或缺少数字。

用途：

- 后续补抓、补证、观察窗口管理。
- 不等于可以写成前台事实。

### index_only

进入条件：

- 有索引价值，但商业变化不足。
- S/A/B 来源也可以只进 `index_only`，例如普通通稿、普通版本更新、重复信息。

用途：

- 保存快照和检索入口。
- 不进入重加工链路。

### discard

进入条件：

- 低价值、重复、抓取失败、明显噪音、标题党、纯 SEO、affiliate、prompt 模板、教程合集或与 AI 商业变化无关。

用途：

- 记录噪音和降权依据。

## 4. 事实资产与观点资产

事实资产包括变化卡、案例卡、趋势报告、今日观察和商业内参中的事实判断。

事实资产只能使用满足核心证据门槛的 Raw：

```text
has_full_text = true
extraction_quality = high | medium
source_level = S | A | B
```

观点卡不使用同一事实门槛。观点卡证明的是“谁在何时何处说了什么”，必须保存：

- 人物 / 账号 / title
- 原文链接
- 原文摘录或当时可见文本
- 发布时间
- 抓取时间
- 观察边界 / `capture_scope`

观点中的公司动作、客户采用、收入、融资、市场规模等事实主张，必须另补 S/A/B 来源。

## 5. AI HOT / follow-builders / 社区来源

- AI HOT 是 Raw 主发现入口，但不是事实主证据。
- follow-builders 每日全量进入前沿观点库；可择优进入 Raw / Pool，但不证明公司事实。
- M 只表示 `acquisition_source_level`，不表示事实来源等级。
- C 级社区来源可以进入 `emerging_pool`、`user_feedback_pool` 或 `watchlist`，但不能单独进入事实资产。
- keyword-search 只返回社区讨论时，不得生成正式 Pool、案例卡、变化卡、趋势报告或今日观察；满足观点证据门槛时可进入前沿观点候选。

## 6. Pool 条目必填

每条 Pool 必须带：

- 入池理由 / `conversion_reason`
- 淘汰风险或证据缺口 / `evidence_gaps`
- `raw_ref`
- `raw_archive`
- `raw_json`
- `source_url`
- `extraction_quality`
- `has_full_text`
- `raw_content_hash`
- `raw_full_text_hash`
- `raw_semantic_hash`
- `usable_for`
- `pool_routes`
- `key_excerpts`
- `evidence_seed`
- `missing_information`

## 7. 数量与多样性

- 常规 Pool：20-40 条。
- Pool 每类必覆盖信号常规不少于 3 条候选。
- Pool 单一主题默认不得超过 40%。
- 不足时必须写入 `evidence_gaps`，不能用大企业新闻硬补齐。

## 8. 禁止

- 禁止把 Pool 摘要当事实正文。
- 禁止只凭 Pool 标签或观澜判断写变化卡、案例卡、今日观察、趋势报告或商业内参。
- 禁止把 M 级采集通道写成事实来源等级。
- 禁止把 C 级社区讨论写成公司动作、客户采用、收入、融资或市场规模事实。
- 禁止为填满数量把 `index_only` 或 `watchlist` 硬升为 `core_pool`。
