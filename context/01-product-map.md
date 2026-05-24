---
status: current
scope: product-map
last_updated: 2026-05-22
use_when:
  - product planning
  - column changes
  - page or navigation decisions
do_not_use_when:
  - pure implementation with explicit files
  - past-state analysis
priority: current
---

# 01 Product Map｜产品结构与数据流

## 一级栏目

| 栏目 | 作用 | 当前状态 |
|---|---|---|
| 今日观察 | 每日主编选择：从 AI 商业信息里挑一个最有冲突和叙事价值的对象，用商业语言讲清它刺穿了什么旧说法、改变了谁的位置，以及读者该如何重新理解这件事 | 一级导航 |
| 商业信号 | 商业信号流和成熟变化短专题 | 一级导航 |
| 趋势追踪 | 趋势快报、深度趋势报告和机会判断段落 | 一级导航 |
| 商业内参 | 周期性融合判断、会员内容和机会判断复盘 | 一级导航 |

不作为一级栏目：

- 前沿观点流：承接旧观点栏目中的有效能力，当前作为商业信号相邻内容流和后台判断资产，不新增一级导航。观点卡必须先评级，再决定展示位置。
- 机会判断：趋势追踪 / 商业内参中的段落。
- Scoring / Priority Engine：后台能力。
- Tags：筛选、搜索和关系网络能力。

## 今日观察定位

今日观察不是每日行情综述、Card 扩写、趋势预告、AI 能力说明文或内部质检表。

当前定位：

> 每天从 Raw / Pool / Card / Candidate 中选一个最有商业冲突和述事价值的对象，写成一篇有商业钩子、有角色变化、有公开场面、有可带走判断的商业观察。

写作重点：

- 标题先给商业钩子，不写成观点摘要；
- 小标题先抓段落推进，再压成自然、稳、能独立成立的商业判断；
- 用商业故事讲 AI，少写模型能力说明；
- 这件事刺穿了什么旧说法；
- 谁获得新的话语权，谁被挤到后台；
- 公开材料里能看到什么动作、场面或矛盾；
- 读者看完后能多一个什么判断。

不得把企业内部购买动机、真实 ROI、预算审批、客户内部验收、销售转化、组织阻力或长期满意度写成事实，除非公开材料直接证明。

## 前台页面

```text
index.html
daily.html
daily-detail.html
signals.html
signal-detail.html
trend-tracking.html
trend-detail.html
brief.html
```

## 内容与资产流

```text
AI HOT / follow-builders / keyword search / S-A-B sources
-> Raw
-> Pool
-> Signal / Opinion cards + Change / Scene / Trend candidates
-> Daily Observation / Business Signals / Frontier Opinions / Change Topics / Trend Reports / Briefs
-> Site data
```

该链路中的三个高风险环节必须套用 `context/06-execution-harness.md`：

- Source / Raw / Pool：每日监测 Harness。
- Pool -> Signal / Opinion cards + Change / Scene / Trend candidates：Raw / Pool / Card 资产 Harness。
- assets -> Site data / 前台页面：页面 / 文案 / Typography Harness。

## 资产边界

- `content/04-business-signals/` 保存商业信号流和变化短专题，不保存长期资产本体。
- `content/05-frontier-opinions/` 保存前沿观点流索引。
- `content/06-asset-candidates/` 保存变化、场景、趋势候选，不直接前台展示。
- 商业信号卡、前沿观点卡和后台判断候选写入 `01-SiteV2/knowledge/` 的新结构。
- 趋势候选写入 `01-SiteV2/content/06-asset-candidates/trend/`。
- 趋势报告正式内容写入 `01-SiteV2/content/08-trend-reports/flash/` 或 `full/`。
- 无报告决策写入 `no-report-decisions/`，不进前台。

## 前台放行

商业信号卡、前沿观点卡或变化短专题进入前台必须满足：

- `fact_draft_gate: passed`
- `frontend_copy_gate: passed`
- `cardcopy_gate: passed`
- 有合格 `frontend.displayTitle`
- `asset_level` 不为 `candidate` / `draft`
- `status` 不为 `draft`

前沿观点卡还必须满足：

- `opinion_tier` 只能是 `feature` 或 `sidebar`。
- `display_lane` 只能是 `daily_feature` 或 `signal_sidebar`。
- `publish_status` 只能是 `frontstage_feature` 或 `frontstage_sidebar`。
- `frontend.originalTranslation` 或等价中文翻译必须存在，且 `translation_status` 不能是 `pending_translation`。
- `archive` / `discard` 即使存在 `frontend` 字段，也不得同步到前台。

未过门禁的卡片不能用 Raw 摘要、后台字段或 selected 索引半成品 fallback 到前台。

变化、场景、趋势候选默认是后台资产。变化成熟后以前台“变化短专题”展示；趋势成熟后进入趋势追踪、热力图或商业内参，不作为普通前台卡片。
