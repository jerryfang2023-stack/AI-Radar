# Column Architecture｜栏目架构与边界

更新时间：2026-06-07
状态：current / V3.3.1

栏目按“用户要完成的判断任务”设计。V3.3.1 当前前台只保留三个一级入口。

## 当前前台导航

```text
Business Signals / First-Line Viewpoints / Dashboard
商业信号 / 一线观点 / 仪表盘
```

## 页面边界

| 栏目 | 用户任务 | 核心内容 | 不应承担 |
|---|---|---|---|
| 商业信号 | 每天看 10 件最值得看的 AI 商业事实 | 产品 / 服务、融资、案例三类正式 signal cards；关系图；趋势候选 | builders 观点、泛新闻流、无证据摘要 |
| 一线观点 | 阅读公开 builders / operators 的第一手判断 | 观点原文、来源、正式观点类 tags | 商业事实证明、关系图证据、趋势候选证据 |
| 仪表盘 | 查看生产链路、质量门和数据状态 | Raw / Pool / Core Pool / Card / Builders / Sync 状态 | 面向普通读者的内容消费 |

## 商业信号

商业信号是“少数值得精读的商业事实库”。当前正式前台信号只保留三类：

```text
product_service / funding / case
```

每日规则：

- 前台展示必须是 10 条，不是“不超过 10 条”。
- 按重要性排序。
- 同一个大厂最多 1 条；多个大厂合计最多 3 条。
- 少于 10 条时，优先扩大 Raw 和优化 Pool / Core Pool 晋级，而不是缩减前台目标。
- 关系图和趋势候选基于完整 Core Pool / Cards，不只基于前台展示的 10 条。

## 一线观点

一线观点是独立阅读流，只证明“谁在何时何处说了什么”。它不能替代公司公告、客户证据、财报、监管文件或原始业务材料。

固定链路：

```text
builder_source -> viewpoint_item -> follow-builders page data
```

一线观点可以与商业信号共享正式 tag 体系，但不得进入商业信号事实、关系图边或趋势候选证据。
