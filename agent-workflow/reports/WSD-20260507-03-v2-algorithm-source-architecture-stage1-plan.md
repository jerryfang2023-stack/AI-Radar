---
title: WSD-20260507-03 V2 Algorithm Source Architecture Stage 1 Plan
date: 2026-05-07
type: stage1-plan
status: stage1-completed
task_id: WSD-20260507-03-v2-algorithm-source-architecture
board_id: V2-2
owner: v2-source-intelligence / v2-heatmap-algorithm / data / pm / workflow
encoding: UTF-8
---

# 阶段 1 方案：V2 算法与来源架构

## 1. 任务目标复述

本任务是 `V2-2 / WSD-20260507-03-v2-algorithm-source-architecture` 的阶段 1，只做任务理解和执行方案，不进入正式产出。

阶段 2 正式执行时，应设计 V2.0 的算法、来源分层、监测规则、去重、二次搜索、反证、长期趋势数据库规则，并把这些规则与 `HeatEvidence`、行业 / 岗位 / 流程 / 三元组热力、`AIBriefIssue` weekly / monthly 输入结构接起来。

本阶段不创建正式文件：

- 不创建 `agent-workflow/v2/v2-algorithm-source-architecture.md`
- 不修改 `04-Site`
- 不修改生产内容源
- 不修改 `sync-data.mjs` / `unified-site-sync.mjs`
- 不替换 `ai-the-point` / `ai-2` / `ai-3` 自动化

## V2 正式升级口径

`V2-2 / WSD-20260507-03-v2-algorithm-source-architecture` 服务的是观澜AI V2.0 正式产品升级，不是一次性测试项目，也不是 demo 方案。

阶段 2 正式产出的 V2 算法、来源分层、`HeatEvidence`、AI商业热力图、`AIBriefIssue` weekly / monthly 结构，最终都应服务正式 V2 版本，并能指导后续实际开发、迁移、上线和生产链路替换。

当前提到的分支、worktree、测试页、test-only 管线和 `06-content/` 隔离运行，只是降低迁移风险的验证手段。它们用于在不污染 V1 稳定生产链路的前提下验证算法质量、来源质量、证据完整性、热力评分可解释性和 AI内参生成稳定性。它们不是 V2 的最终交付形态。

最终目标是：在隔离验证充分、QA 通过、用户验收通过、调度中枢标记 `accepted` 后，将成熟规则逐步迁入正式 V2 生产链路。进入生产前至少需要通过以下闸门：

1. PM / Strategy 确认算法与产品架构服务正式 V2，不偏离“AI 机会判断系统”定位。
2. Intelligence Data / V2 Source Intelligence 确认来源分层、去重、二次搜索、反证和标签规则可追溯、可治理。
3. V2 Heatmap Algorithm 确认 `HeatEvidence`、行业 / 岗位 / 流程 / 三元组热力、阶段判断和 `AIBriefIssue` 输入输出可解释、可复核。
4. V2 Verification Agent 独立验收证据完整性、反证机制、生产迁移风险和自动化影响。
5. Dev / QA 在正式开发阶段完成代码、数据同步、关系检查、回滚和多身份验收。
6. 调度中枢收口并明确标记对应任务 `accepted` 后，才允许进入生产替换或正式上线。

因此，本阶段 1 的边界是“只确认正式升级架构方案，不执行生产改动”；阶段 2 的目标是“输出可指导正式 V2 开发与迁移的算法与内容源架构文档”，并在文档中清楚标明哪些部分需要先隔离验证，哪些部分成熟后应进入正式 V2 生产链路。

## 2. 输入材料梳理

### 2.1 项目治理与边界

- `AGENTS.md`：确认观澜AI定位、八个长期 Agent、调度中枢机制、Plan-first、Quality Gates、自动化影响提醒。
- `docs/agent-handoff.md`：确认 V2-1 已 accepted，V2-2 由 `V2 Source Intelligence Agent` + `V2 Heatmap Algorithm Agent` 牵头；V2-4A 已把 AI内参 + 热力图纳入 V2 核心候选。
- `agent-workflow/governance/README.md`、`long-term-agent-dispatch-policy.md`、`agent-memory.md`、`plan-first-policy.md`、`quality-gates.md`、`automation-fallback-policy.md`：确认本任务属于重大数据 / 算法 / 自动化相关规划，必须先计划，不允许用临时 agent 替代长期岗位，不允许未验证即替换生产链路。
- `agent-workflow/progress.md`、`agent-workflow/feature_list.json`：确认当前 V2-2 已进入 `dispatched / stage1-plan`，阶段 1 期望产物就是本文件。

### 2.2 V2 任务与 Agent 系统

- `agent-workflow/execution/WSD-20260507-03-v2-algorithm-source-architecture.md`：明确两阶段规则、阶段 1 禁止范围、阶段 2 正式输出。
- `agent-workflow/v2/v2-agent-system.md`：确认本任务主要由 V2 Source Intelligence、V2 Signal Evidence、V2 Point / Builder Insight、V2 Heatmap Algorithm、V2 AI Brief Editorial、V2 Verification 协作。
- `agent-workflow/v2/v2-transition-charter.md`：确认 V2 目标是从“AI 商业信号网站 + 工作流”升级为“AI 机会判断系统”，核心链路是更多来源、更强去重、更准 Signal、更稳 Judgment、更少但更深 Opportunity、可积累 Trend。

### 2.3 算法与来源材料

- `agent-workflow/v2/briefs/v2-algorithm-brief.md`：要求覆盖 Raw 30-50、Pool 10-15、Structured 5-8、Front Signal 3、Deep Dive 0-1、Trend 长期归类、反证与可信度、入库 schema、7 日测试计划。
- `agent-workflow/v2/briefs/v2-source-monitoring-brief.md`：要求建立海外 AI 新闻、融资并购、产品发布、VC、Builder、X / LinkedIn、Product Hunt、YC、GitHub / HN / Reddit 等来源分层与采集规则。
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`：提供 P0-12 test-only 管线，强调 V2 成熟前只进入 `06-content/`，不得替换正式 Signals、生产同步闸门或 `ai-2`。

### 2.4 AI内参与热力图材料

- `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`：提出四栏目保留，Signals / Point / Opportunity / Trends 统一转为 `HeatEvidence`，聚合行业、岗位、流程、三元组热力，生成 AI商业热力图，再沉淀为 AI商业内参。
- `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`：明确 V2-2 必须回应 `HeatEvidence`、热力评分、阶段判断、争议期、反证机制、`AIBriefIssue` weekly / monthly 结构。

## 3. 计划产出的文档结构

阶段 2 正式文件建议为：

`agent-workflow/v2/v2-algorithm-source-architecture.md`

建议结构：

1. 文档定位与执行边界
2. V2 判断流水线总览
3. 来源分层与监测规则
4. Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> Trend 漏斗
5. 去重、合并与已跟踪信号补充规则
6. 二次搜索与交叉验证规则
7. 反证、争议期与可信度规则
8. 四栏目 -> `HeatEvidence` 转换规则
9. `HeatEvidence` schema 草案与字段解释
10. 行业 / 岗位 / 流程 / 三元组热力计算规则
11. 热力阶段、热力变化与方向判断
12. `AIBriefIssue` weekly / monthly 输入、输出与生成流程
13. test-only 与生产规划分层
14. 7 日测试计划
15. V2 Verification Agent 验收清单
16. 自动化影响与迁移前置条件
17. 未决问题与后续任务交接

## 4. 拆解思路

### 4.1 算法

算法应分两层：

- 日常监测漏斗算法：从 30-50 条 Raw 到 3 条精选 Signal 和 0-1 条 Deep Dive，解决“今天哪些变化值得进入判断资产”。
- 周期热力聚合算法：从一段时间内的四栏目证据生成行业、岗位、流程、三元组热力，解决“哪些 AI 商业影响正在升温、降温或进入争议”。

日常漏斗继承 `daily-monitoring-algorithm-v2.md` 的 test-only 管线，正式文档只补足结构化规则、阈值、schema、反证和迁移条件，不直接推动生产替换。

### 4.2 来源

来源架构应按“用途”而不是“平台名”组织：

- S 级 / 一手来源：公司官网、产品页、公告、定价页、客户案例、监管文件、招聘 JD、开源仓库。
- A 级 / 高可信二手来源：高质量媒体、融资数据库、投资机构文章、行业报告、上市公司材料。
- B 级 / 产业与生态来源：Product Hunt、YC、demo day、垂直社区、开发者生态、采购与招聘信号。
- C 级 / 线索来源：X / LinkedIn、HN、Reddit、聚合榜单、Builder 个人观点。

C 级来源可触发检索，但不能作为事实主证据。Builder / Point 可进入观点校准、假设或反证，不直接推高事实证据权重。

### 4.3 HeatEvidence

`HeatEvidence` 是四栏目进入热力图的统一证据单元。阶段 2 应定义：

- `sourceType`: signal / point / opportunity / trend
- `sourceId`: 关联原栏目稳定 ID
- `industryTags` / `jobTags` / `workflowTags`
- `impactModes` / `businessValueTags`
- `evidenceScore` / `confidenceScore`
- `heatDirection`: up / stable / down / mixed
- `heatContribution`
- `period` / `publishedAt`
- `counterEvidence` / `evidenceGaps` / `relatedIds`

转换原则：

- Signal 提供外部变化证据。
- Point 提供一线实践校准、阻力、非共识和争议信号。
- Opportunity 提供商业价值、目标企业和需求判断。
- Trend 提供持续性、阶段和时间维度。

### 4.4 热力图

热力图不应做成普通榜单，应作为 AI商业内参的核心决策资产。

热力对象建议拆为四类：

- 行业热力：AI 正在影响哪些行业。
- 岗位热力：AI 正在影响哪些岗位或部门职责。
- 流程热力：AI 正在影响哪些具体工作流。
- 三元组热力：行业 × 岗位 × 流程的组合是否正在升温。

计算应同时考虑：

- 证据数量与质量。
- 来源多样性。
- 商业化强度。
- Point 校准与反证。
- Opportunity 成形程度。
- Trend 持续性。
- 本期与上期变化。

阶段判断建议保留：低热区、观察期、起步期、加速期、爆发期、成熟期、争议期。

### 4.5 AIBriefIssue

`AIBriefIssue` 是周度 / 月度 AI商业内参的结构化输出，不是页面实现。

weekly 输入建议：

- 本周精选 Signals
- 本周 Point Fragments / Clusters
- 本周 Opportunities
- 本周 Trends
- 本周新增 `HeatEvidence`
- 上周热力图基线
- 争议与反证

monthly 输入建议：

- 当月全部 weekly evidence 汇总
- 历史 HeatEvidence
- 上月热力图基线
- 高热三元组变化
- 成熟 / 争议 / 降温区域
- 可沉淀长期 Trend 的对象

weekly 更偏“变化识别”，monthly 更偏“结构性判断与持续性复盘”。

## 5. 需要用户确认的问题

1. `AI内参` 在阶段 2 文档中是否只做数据 / 算法输入规划，还是同时给出产品层推荐口径。
2. `HeatEvidence` 是否允许在阶段 2 中提出新增字段草案，但不改现有生产 schema。
3. 行业、岗位、流程标签字典是否先使用 seed dictionary 草案，还是必须完全映射现有 `tag-taxonomy.md`。
4. weekly / monthly `AIBriefIssue` 是否都进入同一份架构文档，还是 weekly 先作为 MVP。
5. 7 日测试计划是否只验证 `06-content/` test-only 管线，还是也要模拟 AI内参样张。
6. 是否允许阶段 2 明确提出后续 Dev 文件路径建议，但不创建代码文件。
7. V2-2 正式 closeout 是否需要同步回填 `progress.md` / `feature_list.json`，还是由调度中枢收口时统一处理。

## 6. 风险与非目标

### 风险

- 过早把热力图做成前台榜单，会削弱“AI商业内参”的增值感。
- 把 Point / Builder 观点当作事实证据，会污染热力评分。
- 来源数量扩张后若缺少去重与二次搜索，会退化成新闻池。
- 行业 / 岗位 / 流程标签若无治理，会快速膨胀并失去检索价值。
- 直接修改生产自动化会影响 `ai-2` / `ai-3` 稳定性，必须等待 test-only 证明。
- 公式过细但缺少可解释性，会让内参判断像后台评分而不是商业判断产品。

### 非目标

- 不改前台导航。
- 不新增 AI内参页面。
- 不写代码实现。
- 不改 `04-Site`。
- 不修改生产 Markdown frontmatter。
- 不修改 `sync-data.mjs`、`check-relations.mjs`、`unified-site-sync.mjs`。
- 不替换 `ai-the-point`、`ai-2`、`ai-3`。
- 不把热力图输出为投资、经营或合作指令。

## 7. 建议执行顺序

1. 固定阶段 2 文档边界：只做架构规划，不做 Dev。
2. 先写来源分层与监测规则，明确哪些来源只能做线索、哪些可做事实主证据。
3. 写日常监测漏斗，继承 P0-12 test-only 管线并标明差异。
4. 写去重、二次搜索、反证、可信度和中国迁移判断规则。
5. 定义四栏目到 `HeatEvidence` 的转换规则。
6. 定义 `HeatEvidence` schema 草案。
7. 定义行业、岗位、流程、三元组热力计算与阶段判断。
8. 定义 `AIBriefIssue` weekly / monthly 输入输出。
9. 明确 test-only / production-planning 分层，列出哪些算法只能测试、哪些可进入生产规划。
10. 写 7 日测试计划与 V2 Verification Agent 验收清单。
11. 写自动化影响说明和后续任务交接。

## 8. Quality Gates 与自动化影响

本阶段只新增 reports 下的阶段计划文件，未运行站点同步、关系检查或语法 Quality Gate。原因是本阶段不修改代码、生产内容源、同步脚本或站点数据。

自动化影响：

- `ai-the-point`：不影响。
- `ai-2`：不影响，阶段 1 未替换生产日更。
- `ai-3`：不影响，阶段 1 未修改统一同步闸门。

阶段 2 若进入正式架构文档，仍应说明可能影响自动化任务，但在未获用户确认前不得修改任何自动化本体或同步脚本。

## 9. 调度回报口径

阶段1完成：WSD-20260507-03-v2-algorithm-source-architecture
