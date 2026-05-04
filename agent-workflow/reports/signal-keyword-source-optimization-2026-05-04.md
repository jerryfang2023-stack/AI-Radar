---
title: Signal Keyword & Source Optimization
type: intelligence-data-report
schema_version: 1
id: signal-keyword-source-optimization-2026-05-04
task_id: WSD-20260504-15-signal-keyword-source-optimization
date: 2026-05-04
owner: data-agent
status: completed
---

# Signal 关键词与来源策略优化｜2026-05-04

## 1. 本轮结论

本轮已将每日 AI 商业雷达的关键词和来源策略，从“大企业 / 大融资 / 高曝光新闻优先”调整为更均衡的 6 类候选池：

| 候选池 | 作用 | 入选口径 |
|---|---|---|
| 成熟信号 | 保留大企业、大融资、并购、平台级发布 | 强证据可入选，但不独占每日名额 |
| 早期融资 / 新投资方向 | 捕捉 pre-seed、seed、angel、grant、accelerator、YC、stealth、spinout | 必须说明新方向、客户、技术路径或生态变化 |
| 技术迭代 | 捕捉模型能力、推理成本、协议、工具链、部署方式 | 只有影响成本、部署、客户场景或商业模式时进入 Signal |
| 开源 / 开发者生态 | 捕捉 GitHub AI agent、open-source model、AI SDK、agent framework、plugin marketplace | C 级线索必须回找 S/A/B 证据 |
| 垂直行业早期采用 | 捕捉 design partner、pilot customer、first customer、procurement、tender | 需求侧证据可作为高价值早期信号 |
| 反证与降温 | 捕捉 shutdown、churn、margin pressure、lawsuit、security incident、privacy enforcement | 必须说明削弱哪个趋势、机会或商业模式 |

## 2. 改动文件

- `提示词/关键词列表.md`
- `提示词/监测提示词V4.0.md`
- `agent-workflow/product/source-intelligence.md`

## 3. 关键词库优化

`提示词/关键词列表.md` 已升级为 V4.2，主要变化：

- 新增“成熟信号 / 早期信号 / 技术迭代 / 开发者生态 / 需求侧 / 反证”六类监测分层。
- 补齐早期融资关键词：`pre-seed`、`seed`、`angel`、`grant`、`accelerator`、`YC`、`stealth`、`university spinout`、`research spinout` 等。
- 补齐新投资方向：`vertical AI`、`agent infra`、`AI security`、`AI evals`、`AI memory`、`robotics`、`on-device AI`、`small models`、`AI workflow`、`AI compliance` 等。
- 补齐技术迭代：`model release`、`inference cost`、`context window`、`multimodal`、`voice/video model`、`agent protocol`、`MCP`、`tool use`、`evals`、`synthetic data`、`model routing` 等。
- 补齐开源与开发者生态：`GitHub AI agent`、`open-source model`、`agent framework`、`AI SDK`、`plugin marketplace`、`developer adoption` 等。
- 补齐垂直早期采用：`design partner`、`pilot customer`、`first customer`、`procurement`、`tender`、`industry-specific AI agent` 等。
- 补齐反证与降温：`shutdown`、`churn`、`gross margin pressure`、`inference cost pressure`、`lawsuit`、`copyright risk`、`security incident`、`privacy enforcement` 等。
- 新增组合查询示例，避免只使用单词列表。
- 新增每日候选配额建议，防止成熟融资和大公司新闻挤出早期信号。

## 4. 监测提示词优化

`提示词/监测提示词V4.0.md` 已升级为 V4.2，主要变化：

- 每日任务必须读取 `source-intelligence.md`、`tag-taxonomy.md` 和 `intelligence-data-model.md`。
- 明确每日候选池必须覆盖 6 类信号，不得只搜大公司和大融资。
- 新增每日候选配额：先形成 18-25 条候选，再筛出 3-6 条正式 Signal。
- 每条 Signal 新增：
  - `触发查询`
  - `监测维度`
  - 单一主 `相关机会`
  - `机会拆解（6点｜必须详细拆解）`
- “今日信号分布”和“监测质量反馈”新增早期信号、技术迭代、开发者生态、垂直采用和反证覆盖记录。
- 明确技术迭代、开源项目、GitHub 热度和早期融资的入选边界，避免噪音。

## 5. Source Intelligence 优化

`agent-workflow/product/source-intelligence.md` 已补充：

- 来源分层从通用 S/A/B/C/D 扩展为成熟、早期、技术、开发者、需求侧和反证的采信规则。
- S 级来源新增开发者文档、API 文档、SDK changelog、价格页、GitHub release、云市场和插件市场。
- B 级来源新增融资数据库、投资机构公告、加速器 Demo Day、university spinout、research spinout、grant、垂直行业采购和行业媒体。
- C 级来源明确只作为线索，GitHub trending、社媒和聚合站不得直接支撑高分 Signal。
- 新增早期融资、技术迭代、开源生态、垂直采用和反证的可入选条件与降级条件。
- `ai-2` 自动化应用段已明确每日候选池覆盖要求。

## 6. 新版监测执行口径

下一次每日雷达应按以下方式执行：

1. 先跑成熟信号查询，保留强证据，但最多选 1-2 条。
2. 再跑早期融资和新投资方向查询，重点看小额融资投向了什么新方向。
3. 再跑技术迭代查询，判断模型能力、成本、协议、工具链是否改变商业可用性。
4. 再跑开源和开发者生态查询，把 GitHub / SDK / 框架线索回找一手或高质量来源。
5. 再跑垂直行业早期采用查询，重点看设计伙伴、试点客户、采购和招投标。
6. 最后跑反证查询，记录是否有趋势降温、成本压力、诉讼、安全或隐私风险。

## 7. 自动化影响

### `ai-2`

有影响。

本轮改变了每日商业雷达的搜索范围、关键词结构、候选配额、来源采信和 Signal 输出字段。由于 `ai-2` 已被要求读取 `提示词/关键词列表.md`、`提示词/监测提示词V4.0.md` 和 `source-intelligence.md`，下一次运行会受到这些文件影响。

建议后续由调度中枢确认是否需要同步更新 `ai-2` 自动化配置对象中的提示摘要；本执行窗口未修改自动化任务配置对象，符合派发单禁止范围。

### `ai-the-point`

默认不影响。

本轮未改变 The Point Builder 池、来源规则、素材笔记、原文/译文或授权说明。

### `ai-3`

默认不影响。

本轮未改变同步闸门、同步脚本、关系检查脚本、字段解析或网站入站规则。`ai-3` 只需继续检查每日 Signal 是否具备 6 点机会拆解和内容状态。

## 8. 下一次每日雷达观察指标

下一次 `ai-2` 首跑后，应重点观察：

- 3-6 条正式 Signal 中，是否至少有 1 条早期融资 / 新投资方向信号。
- 是否至少覆盖 1 条技术迭代、开源 / 开发者生态、垂直早期采用或反证候选。
- 成熟大融资 / 大公司新闻是否控制在 1-2 条，不挤占全部名额。
- 每条 Signal 是否记录 `触发查询` 和 `监测维度`。
- 每条 Signal 是否只写 1 个主 Opportunity。
- 每条 Signal 是否包含 6 点机会拆解。
- C 级线索是否已回找 S/A/B 来源。
- “监测质量反馈”是否记录早期信号覆盖率、反证覆盖率、高产词和低效词。

## 9. 未改动范围

本轮未改动：

- `04-Site/`
- `01-Signals/` 历史正式内容
- `02-Scoring/` 历史正式内容
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`
- 自动化任务配置对象
- 同步脚本、关系检查脚本、统一同步脚本

## 10. 后续建议

- Workflow / Automation Agent：复核是否需要把新版 V4.2 摘要同步写入 `ai-2` 自动化提示词配置对象。
- Intelligence Data Agent：在下一次每日雷达后产出一份早期信号覆盖复核。
- QA / Acceptance Agent：抽查下一次雷达是否存在“早期信号名义覆盖，但实际仍只有大企业 / 大融资”的问题。
