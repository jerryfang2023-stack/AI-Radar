---
status: current
scope: card-asset-qc
last_updated: 2026-05-22
use_when:
  - generate signal cards or opinion cards
  - upgrade change, scene, or trend candidates
  - review asset-card-generator output
priority: execution
---

# Card Asset QC Checklist｜卡片资产轻量质检清单

本清单用于资产写入和前台同步前的轻量 QC。当前暂停使用观澜前台文案规范与文案门禁；验收以事实、来源、中文展示和边界为准。

## 1. 前置检查

- Daily Monitor QC 必须是 `allow`，或明确 `allow_with_degradation` 且给出 eligible `core_pool` 范围。
- 资产链只能使用 eligible `core_pool` 作为事实主证据。
- failed provider text、index-only AI HOT、community / frontier opinion 不得作为公司事实证据。
- 实际运行资产链或生成卡片前，必须先运行 readiness；不通过时只写 blocked 说明。

## 2. 入库前检查

每张资产必须回答：

1. 它属于 `signal_card`、`opinion_card`、`change_candidate`、`scene_candidate` 还是 `trend_candidate`。
2. 主证据在哪里，是否能回到 Raw、原文出处或明确快照。
3. 是否保留原文、原文摘录、URL、发布时间和抓取范围。
4. 是否把观点、事实、判断和缺口分开。
5. 前台标题是否优先使用可追溯原文标题，英文标题 / 摘要 / 详情是否已翻译为中文展示。

## 3. 类型检查

### 商业信号卡

- 主类型只能是 `product_service`、`funding`、`case`。
- 标题必须是事件型：谁做了什么。
- 摘要必须补充事实，不能重复标题。
- 商业含义必须落到客户、流程、预算、组织、责任、风险、竞争、成本、交付或渠道。
- 合作、采购、定价、风险、合规等只能作为变量或观察理由。

### 变化候选

- 单一材料只能生成候选，不能生成正式变化。
- 必须有变化假设、支撑信号、前后对比、商业变量、风险边界或后续观察变量。
- 缺前后对比时，只能留作 watchlist 或补证任务。

### 场景候选

- 必须写清行业 / 部门、岗位 / 使用者、流程 / 任务和 AI 改变的步骤。
- 不能写成公司百科或产品目录。
- 没有真实案例或流程证据时，不得升级为前台内容。

### 趋势候选

- 不得由单条新闻、单个观点或公司名清单生成。
- 必须关联多个变化、多个场景 / 案例和多类来源。
- 未达门槛时只能写 `threshold_pending`、`watchlist_only` 或 `rejected`。

## 4. 前台同步检查

只有 `signal_card`、`opinion_card` 和成熟变化短专题可以进入当前前台表达。


```powershell
node agent-workflow/tools/govern-opinion-card-ratings.mjs --date=<YYYY-MM-DD>
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=<YYYY-MM-DD>
```


前台文案不得出现：

- Raw / Pool / gate / usable_for。
- 入库、补证、强证据、证据链、字段、候选、后台。
- “赋能、生态、底座、闭环、重塑、一站式、未来已来”等模板词。
- 把缺口写成确定结论的表达。

## 5. 通过条件

资产进入前台前必须满足：

- 事实清晰。
- 证据可追溯。
- 商业信号标题优先使用原文标题；英文前台展示内容已翻译为中文。
- 观点和事实分开。
- 候选和正式资产分开。
- 弱材料没有被伪装成公司事实。
- 观点卡评级、展示位置和发布状态一致。

不满足以上任一项时，保持候选 / 归档 / 隐藏状态，不得同步前台。


## Opinion lane paused

The previous viewpoint / opinion-card lane is not part of current Raw / Pool / business-signal Card generation. Do not generate, stage, or publish opinion cards from the business-signal chain until the column is rebuilt.
