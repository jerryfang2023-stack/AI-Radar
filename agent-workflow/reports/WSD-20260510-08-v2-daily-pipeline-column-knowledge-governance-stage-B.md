---
title: V2 每日生产线治理 Stage B 内容漏斗质量确认与执行总结
date: 2026-05-10
task_id: WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
stage: B
status: completed / awaiting-C-confirmation
owner: workflow / data / pm
encoding: UTF-8
---

# Stage B｜内容漏斗质量

## 用户确认与修正

用户确认 B 类方向，并补充关键算法修正：

- Raw 不能只作为低权重背景。
- 如果一个事件有大量信息，说明热度升高。
- 仅以 Structured / Front Signals 作为高权重输入，基数太小，难以准确判断 Trend。

## 已确认算法

Trend Updates 采用双轴模型：

```text
Trend 判断 = Raw 热度变化 + Pool 主题簇 + Structured 证据强度 + 历史连续性 + 反证边界
```

### 热度轴

- 主要读取 Raw 80-150 与 Pool 20-30。
- 判断声量、扩散速度、重复事件密度、多来源同题频率。
- M 级通道只记录发现路径和讨论热度，不作为事实证据。

### 证据轴

- 主要读取 Structured Signals、Front Signals 和近 7 / 30 / 90 天历史 Signals。
- Point Calibration 用于共识、分歧、反证和假设校准。
- Deep Dive 用于机会侧和商业模式补强。

## 高热但未入 Signal 的保存规则

高热但暂未进入 Structured Signal / Front Signal 的内容统一保存为 Heat Candidates：

```text
01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md
```

用途：

- 记录高热主题、重复事件、来源扩散和未入选原因。
- 为 Trend Updates 提供热度轴输入。
- 为后续 7 / 30 / 90 天趋势连续性提供回看材料。

处理规则：

- 连续 2 天以上出现，且补齐 S/A/B 商业证据：升级为 Structured Signal 候选。
- 连续高热但无法补证：保留为 Trend 背景或 noise。
- 指向监管、诉讼、安全、成本、客户流失：优先进入 Trend risk / counter-evidence。
- 只来自 M / C 来源且无原始证据：保留在 heat candidates，不进入 Front Signal。

## Heat Candidate 标签规则

Heat Candidate 同步标签体系，但不直接扩充正式标签字典：

- `formal_tags` 只能使用 `agent-workflow/product/tag-taxonomy.md` 已存在的正式 tag_id。
- 建议至少挂 1 个 `track`，可选 `source`、`stage`、`evidence`、`function`。
- 新出现但未确认的热词写入 `classification_labels` 或 `candidate_tags`。
- 公司名、产品名、人物名不作为正式 tag。
- 无法归类时写 `needs_tag_review`，由 Data Agent 后续周报处理。

## Heat Candidate 升级与降级规则

Heat Candidate 不是永久停留池。每日复核必须判断：

- `watch`：单日热度高，但证据不足。
- `upgrade_to_structured_signal`：连续 2 天出现，且至少 2 个 S/A/B 原始来源，并能说明商业变量。
- `upgrade_to_front_signal_candidate`：至少 3 个 S/A/B 来源，有明确事件、商业含义和反证边界。
- `upgrade_to_trend_update`：同一主题跨 3 天或近 7 天出现 3 次以上，覆盖至少 2 类来源类型，并有 Structured / Front Signal 支撑。
- `upgrade_to_risk_trend`：监管、诉讼、安全、成本、客户流失等反证热度，且至少 1 个 S/A 来源确认。
- `keep_as_background`：热度高但商业变量不清。
- `downgrade_to_noise`：连续 3 次只来自 M/C 来源且无法补证，或是 SEO / 搬运 / 情绪噪音。

Heat Candidate 文件应维护 `first_seen`、`last_seen`、`seen_count_7d`、`source_type_count`、`related_heat_ids`、`related_signal_ids` 和 `upgrade_trigger`。

## 各阶段最低质量门槛

用户已确认以下门槛作为 B 类硬规则：

| 阶段 | 最低质量门槛 |
|---|---|
| Raw | 每条必须有本地原文档案 |
| Pool | 入池理由、淘汰风险必填 |
| Structured | 必须有事件、商业变量、来源等级、反证或证据边界、趋势候选，1200-2000 中文字 |
| Front | 固定至少 3 个 S/A/B 来源、3000-5000 中文字 |
| Deep Dive | 固定 5 来源、2 个 S 级 / 一手来源、6000-10000 中文字 |
| Point | 必须有原始观点、观澜解读、关联关系 |

处理原则：

- 数量达标但字段缺失，不得报告完整完成。
- 不足 Deep Dive 证据门槛时，不硬凑。
- Front 的 S/A/B 来源必须是解析后的原始来源，不计算 M 级通道本身。

## 数量不足时的处理

用户已确认以下降级规则：

| 阶段 | 处理 |
|---|---|
| Raw | 低于 80 但高于 50 是降级；低于 50 仍有多少抓多少，并标记严重降级 |
| Front | 不足 3 条时允许发布 2 条，并写明缺口 |
| Deep Dive | 无足够证据时明确写“今日暂无足够证据支撑深挖内参” |
| Trend | 不足 3 条时允许只更新 1-2 条，并写缺口 |

补充边界：

- Raw 低于 50 不是完整运行，但仍应保留已抓取内容和本地原文档案。
- 数量不足时不得把 M / C 级来源提升为 S/A/B。
- 缺口必须写入 daily log 和 evidence gaps。

## 重复与合并规则

用户已确认：

- 同一事件多来源应合并，不重复新建。
- 同一公司连续多天出现，默认更新旧 Signal，但必须增加热度说明或变化说明。
- Heat Candidate 升级后，原候选应转化 / 回链到新 Signal / Trend。

执行规则：

- 同一事件保留 `source_cluster`：主来源、补充来源、M 级发现通道和来源等级。
- 同一公司连续多天出现，只有新事件类型、新商业变量或新趋势候选出现时才新建 Signal。
- Heat Candidate 升级后，原 Heat Candidate 标记 `converted_to`，新 Signal / Trend 标记 `origin_heat_candidates`。
- 原候选不删除，保留为趋势热度历史。

## 反证、风险和字数硬门槛

用户已确认：

- 每条 Structured / Front 不强制写反证。
- 风险类高热内容进入 `risk trend`。
- 只有利好、没有反证的 Deep Dive 可以通过，但证据不足不得通过。
- Structured 1200-2000 中文字是必需。
- Front 3000-5000 中文字是必需。
- Deep Dive 6000-10000 中文字是必需。
- 字数达标但证据不足不得通过。
- 所有事实引用、数据、融资、客户案例、产品发布、监管、观点和参数必须有来源名、来源等级、原始外链和增量事实说明。

已补充边界：

- Structured / Front 未发现反证时，写清 `counter_evidence_status` 或证据边界，不得编造。
- Deep Dive 未发现关键反证时，必须说明“本轮未发现关键反证”。
- 风险类高热内容包括监管、诉讼、安全、隐私、成本、客户流失、关停、融资失败、产品下架等。

## v2content Gate 处理

用户后续确认：脚本也改，F 类再检查确认一次。

已升级 `agent-workflow/tools/v2-content-gate.mjs`，新增检查：

- Heat Candidate 文件和字段。
- daily run log 必填字段。
- 来源等级与 M 通道隔离。
- Raw 原文档案覆盖率。
- Pool 入池理由和淘汰风险。
- Structured / Front / Deep Dive 字数门槛。
- Front S/A/B 来源数量。
- Point 原始观点、观澜解读和关联关系。
- 引用来源名、来源等级、原始外链和增量事实。

## 脚本升级后试跑结果

已运行：

- `node --check agent-workflow/tools/v2-content-gate.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-10`：失败，符合预期暴露旧内容与新标准的差距。

失败项：

- 2026-05-10 Structured Signals 未达到新版 1200-2000 中文字门槛，且缺显式来源等级和原始外链。
- 2026-05-10 Front Signals 未达到新版 3000-5000 中文字门槛。
- 缺 `01-SiteV2/content/05-trend-chain/2026-05-10-heat-candidates.md`，daily log 也未明确说明无高热候选。
- daily log 缺 `raw_count_by_source_type`。

报告：

- `agent-workflow/reports/v2-content-gate-latest.md`
- `agent-workflow/reports/quality-gates-v2content-2026-05-10-20260510-112425.md`

处理口径：

- 本轮不回改 2026-05-10 既有内容正文。
- F 类“验收与回填”阶段需要确认这些新增 gate 是否作为每日自动化硬阻塞，以及是否需要补一次历史内容修复任务。

## 已修改文件

- `agent-workflow/v2/v2-daily-source-collection-strategy.md`
- `01-SiteV2/content/README.md`
- `agent-workflow/execution/WSD-20260508-02-v2-content-site-daily-automation.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/tools/v2-content-gate.mjs`

## 未修改文件

- 未修改既有每日内容正文。
- 未修改 Obsidian 已入库知识卡片。
- 未修改 V2 前台页面。
- 未修改实际 automation toml；自动化已被要求读取本阶段更新的策略文件和派发单。

## 下一类

下一类为 C：栏目产出标准。
