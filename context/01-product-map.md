---
status: current
scope: product-map
last_updated: 2026-06-06
use_when:
  - product planning
  - page or navigation decisions
  - data structure changes
priority: current
---

# 01 Product Map｜V3 产品结构与数据流

## 当前产品结构

V3 的前台主入口是“数据观察台”，后台主入口是“运营后台”。

| 模块 | 作用 | 当前状态 |
|---|---|---|
| 数据观察台 | 展示每日商业信号、关系图谱、趋势候选 | 当前前台入口 |
| 商业信号 | 产品 / 服务、融资、案例三类正式 Card | 当前核心资产 |
| 关系图谱 | 基于 Card 的主体、场景、动作、商业变量建立关系 | 当前分析层 |
| 趋势候选 | 基于多条同向商业信号形成候选，不写趋势报告 | 当前分析层 |
| 运营后台 | 查看生产链路、来源质量、选题池、发布状态 | 保留 |

## 停止使用的栏目输出

以下栏目和输出不再作为 V3 当前生产目标：

- 今日观察；
- 趋势报告；
- 商业内参；
- follow-builders / 观点流；
- 旧四栏目网站页面。

如需未来重建，必须另起规则，不得复用旧 V2 口径。

## 当前内容与资产流

```text
Monitor / Search / Source discovery
-> Raw candidate
-> Pool evidence
-> signal_card
   - product_service
   - funding
   - case
-> knowledge base
-> relation graph
-> trend candidate
-> V3 frontstage / operations data
```

## 资产边界

- `01-SiteV2/content/01-raw/`：每日 Raw 候选与原始材料。
- `01-SiteV2/content/02-pool/`：经过筛选的证据池。
- `01-SiteV2/content/04-business-signals/`：每日商业信号索引。
- `01-SiteV2/knowledge/01-Signal-Cards/`：正式 Card 长期知识资产。
- `01-SiteV2/knowledge/03-Asset-Candidates/`：关系与趋势候选相关资产。

## Card 类型

当前正式商业信号只保留三类：

- `product_service`：产品、服务、平台、模型、工具、API、能力发布。
- `funding`：单一公司融资事件，尤其关注新兴企业与中小公司。
- `case`：客户采用、垂直行业应用、部署案例、业务流程变化。

Pool 类型不等于 Card 类型。Card 类型必须由原文事实重新判断。

## 前台放行

Card 可以进入前台的最低条件：

- 有原始来源链接；
- 有可读正文或足够长的原文摘录；
- 有原文标题或可追溯事件标题；
- 有基于原文生成的新闻事实、原文要点、简要价值描述、可见原文片段；
- 无后台字段兜底展示；
- 无 follow-builders / opinion 内容混入商业信号。

## 关系与趋势

- 关系图谱只展示 Card 之间可追溯的主体、场景、动作和商业变量关系。
- 趋势候选必须来自多条同向 Card、多来源证据和明确商业变量。
- 趋势候选只说明“是什么趋势、表现在哪里、证据边界是什么”，不提供建议和方向。
