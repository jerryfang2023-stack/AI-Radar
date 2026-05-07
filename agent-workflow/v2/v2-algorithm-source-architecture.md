---
title: V2.0 算法与内容源架构
date: 2026-05-07
type: v2-architecture
status: draft-for-acceptance
task_id: WSD-20260507-03-v2-algorithm-source-architecture
owner: v2-source-intelligence / v2-heatmap-algorithm / data / pm
---

# V2.0 算法与内容源架构

## 1. 定位与边界

本文档服务观澜AI V2.0 正式产品升级，不是测试项目方案。

V2-2 的正式目标是建立后续可实际开发、迁移、上线的算法与内容源架构：

```text
更多来源
-> 更强去重
-> 更准 Signal
-> 更稳 HeatEvidence
-> 更可解释的行业 / 岗位 / 流程 / 三元组热力
-> 可生成 weekly / monthly AIBriefIssue
-> 成熟后迁入正式 V2 生产链路
```

本任务只输出架构规划，不执行开发：

- 不修改 `04-Site`
- 不修改生产内容源 frontmatter
- 不修改 `sync-data.mjs` / `unified-site-sync.mjs`
- 不替换 `ai-the-point` / `ai-2` / `ai-3`
- 不创建代码文件

分支、worktree、测试页、test-only 管线和 `06-content/` 只是风险隔离手段。它们用于验证算法质量、来源质量、证据完整性、热力评分可解释性和 AI内参生成稳定性，不是 V2 最终交付形态。

AI内参在本文档中只作为算法输入 / 输出结构处理。是否新增一级栏目、权限、会员产品页、定价或对外包装，由 `V2-4A` / `V2-4` 决策。

## 2. V2 判断流水线总览

V2 判断链路分为日常证据漏斗与周期热力聚合两层。

```text
Raw Candidate 30-50
  -> Signal Pool 10-15
  -> Structured Signals 5-8
  -> Front Signals 3
  -> Opportunity Deep Dive 0-1
  -> Trend / Insight / Database
  -> HeatEvidence
  -> Heatmap Cards
  -> AIBriefIssue weekly / monthly
```

日常证据漏斗解决：今天哪些 AI 变化值得进入判断资产。

周期热力聚合解决：一段时间内哪些行业、岗位、流程、三元组正在升温、降温、成熟或进入争议。

## 3. 来源分层与监测规则

### 3.1 来源等级

| 等级 | 定义 | 示例 | 可承担角色 |
|---|---|---|---|
| S | 一手事实来源 | 公司官网、产品页、官方博客、公告、定价页、客户案例、开发者文档、SEC / 监管文件、招聘 JD、开源仓库 | 事实主证据、二次搜索主锚点 |
| A | 高可信二手来源 | 高质量商业媒体、融资数据库、投资机构报告、行业研究、上市公司材料、采购 / 招投标平台 | 事实增强、背景校准、商业化验证 |
| B | 产业与生态来源 | Product Hunt、YC / demo day、startup directories、GitHub trending、Hacker News、垂直社区、播客长访谈 | 早期线索、生态热度、方向发现 |
| C | 社交与聚合线索 | X / LinkedIn 个人动态、Reddit 讨论、榜单、聚合站、单条 Builder 观点 | 触发检索、观点边界、反证线索 |

硬规则：

- C 级来源不能作为事实主证据。
- Builder / Point 可以校准趋势、暴露阻力、形成假设或反证，但不能替代 Signal 的事实证据。
- 每条精选 Signal 至少需要 3 个 S/A/B 来源。
- 每篇 Deep Dive 至少需要 5 个来源，其中至少 2 个 S 级或一手来源。
- 未找到的关键证据必须记录为 `evidenceGaps`，不得把未知写成确定。

### 3.2 来源类型与抓取频率

| 来源类型 | 监测频率 | 主要目标 | 初筛提示 |
|---|---|---|---|
| 海外 AI 新闻 | 每日 | 大事件、产品落地、企业采用 | 避免普通模型发布新闻占满候选 |
| 融资 / 并购 | 每日 | 资本押注、商业化方向、团队密度 | 必须回找投资方、产品和客户 |
| 产品发布 | 每日 | 新能力、新工作流、新定价 | 必须确认是否影响行业 / 岗位 / 流程 |
| VC / 研究观点 | 每周 + 事件触发 | 赛道判断、趋势解释、反证 | 只能增强判断，不作为事实主证据 |
| Builder 观点 | 每日滚动 | 实践反馈、失败经验、非共识 | 进入 Point / HeatEvidence 校准层 |
| X / LinkedIn | 每日滚动 | 早期线索、一线反馈 | C 级触发源，需二次搜索 |
| Product Hunt / YC | 每周 + demo day | 早期产品簇、创业方向 | 看同类项目数量，不看单点热度 |
| GitHub / HN / Reddit | 每日轻量 | 开发者侧弱信号、开源增长 | 只作为技术采用或反证线索 |
| 招聘 / 采购 / 客户案例 | 每周 | 真实需求、预算、落地场景 | 优先验证商业化和迁移可行性 |

### 3.3 剔除规则

以下内容默认不入 Pool：

- 纯教程、工具列表、prompt 合集。
- 没有商业影响的模型参数或 benchmark 新闻。
- 只有转发热度、没有原始事实的社媒讨论。
- 公司 PR 但无法说明客户、流程、收入、成本、效率或风险变化。
- 与观澜AI定位无关的通用科技新闻。
- 无法找到原始链接或可信二次来源的内容。

## 4. 日常漏斗算法

### 4.1 Raw Candidate

目标：每日 30-50 条。

每条 Raw 必须记录：

```yaml
raw_id:
date:
source_name:
source_url:
source_level: S | A | B | C
source_type:
captured_at:
language:
raw_title:
raw_summary:
collection_reason:
initial_business_relevance:
original_archive_path:
needs_secondary_search: true | false
```

Raw 不是链接列表。每条 Raw 必须有本地原文档案或合法摘录档案，供后续复核。

### 4.2 Signal Pool

目标：10-15 条。

入池条件：

- 能说明一个外部变化。
- 至少指向行业、岗位或流程之一。
- 能初步说明收入、成本、效率、客户体验、管理难度或合规风险影响。
- 不是与已有候选完全重复的新闻。
- 对 C 级来源触发的线索，必须标记需要回找 S/A/B 来源。

Pool Score 建议：

```text
Pool Score =
商业相关度 30%
+ 行业 / 岗位 / 流程指向性 25%
+ 来源可信度 20%
+ 新鲜度 10%
+ 稀缺性 10%
+ 可验证性 5%
```

### 4.3 Structured Signals

目标：5-8 条。

每条 Structured Signal 必须包含：

- 一句话判断。
- 事实背景。
- 分来源摘要。
- 商业信号解释。
- 机会解析 6 维：具体问题、首要感受者、流程变化、价值来源、触发信号、成立边界。
- 反证 / 风险，至少 2 个变量。
- 证据缺口。
- Trend / Insight / Opportunity 候选。
- 是否进入精选 3 条及原因。

Structured Score 建议：

```text
Structured Score =
事实强度 20%
+ 商业影响 20%
+ 二次搜索可补强性 15%
+ 趋势关联 15%
+ 成立边界清晰度 10%
+ 反证完整度 10%
+ 标签可结构化程度 10%
```

### 4.4 Front Signals

目标：正好 3 条。

精选标准：

- 强影响收入、成本或核心业务流程。
- 清楚指向趋势，不是孤立事件。
- 至少完成官网 / 产品、融资 / 投资人、客户 / 案例 / 定价三类轻量二次搜索。
- 至少 3 个 S/A/B 来源。
- 有 2-3 个反证或边界变量。
- 3 条之间应覆盖不同方向，避免同质化。

Signal Score 建议：

```text
Signal Score =
变化强度 20%
+ 商业相关度 20%
+ 行业影响范围 15%
+ 岗位 / 流程指向性 15%
+ 可结构化程度 10%
+ 新鲜度 10%
+ 可信度 5%
+ 稀缺性 5%
```

### 4.5 Opportunity Deep Dive

目标：每日 0-1 条。证据不足时正确输出是：今日暂无足够证据支撑深挖内参。

Deep Dive 必须完成 5 类交叉验证：

- 代表公司：方向中是否有 3 家以上公司在做。
- 融资信号：最近 6-12 个月是否持续融资。
- 客户场景：服务谁，是否有真实付费或采购信号。
- 定价 / 商业模式：订阅、席位、按量、按结果或服务费。
- 中国迁移卡点：监管、平台、数据、支付、客户预算、交付难度。

Deep Dive 不等同 Opportunity 正式产品页。它是内参级判断素材，后续是否进入正式 Opportunity 由 PM / Data / QA 另行验收。

### 4.6 Trend / Insight / Database

所有 Structured Signal 都必须进入趋势处理，不只处理精选 3 条。

趋势处理结果：

- 挂载已有 Trend。
- 新建 Trend 候选。
- 仅入库观察。
- 标记风险 / 降温 / 争议。

新建 Trend 条件：

```text
过去 30 天内相关高质量 Signal >= 3
且来源类型 >= 2
且平均 Signal Score >= 7.5
且能说明正在重构哪个岗位 / 流程 / 行业判断
```

## 5. 去重、合并与补充规则

基础去重键：

```text
company + product + event_type + event_date
```

增强去重键：

```text
workflow_change + customer_segment + business_signal_type
```

合并规则：

- 同一融资新闻多来源合并为一个 Pool 项。
- 同一产品发布与客户案例若指向同一商业变化，合并并记录新增证据。
- 同一 Builder 观点被多次转述，只保留原始来源和高质量长文解释。
- 已进入正式 `01-Signals/` 的内容，在 V2 隔离管线标记 `already_in_production`。
- 重复但新增证据明显的内容进入 `tracked_signal_update`，不新增前台样张。

## 6. 二次搜索、反证与可信度

### 6.1 二次搜索强度

| 阶段 | 检索强度 | 要求 |
|---|---|---|
| Raw / Pool | 广度优先 | 收集方向，标记是否需要补证 |
| Structured | 轻量二搜 | 至少确认事实、产品、来源可信度 |
| Front Signal | 标准二搜 | 至少 3 个 S/A/B 来源 |
| Deep Dive | 重搜索 | 至少 5 个来源，含反证和证据缺口 |
| AIBriefIssue | 周期复核 | 检查本期证据与上期热力变化是否一致 |

### 6.2 反证类型

| 类型 | 示例 | 进入字段 |
|---|---|---|
| 商业化反证 | 无客户、定价不明、销售周期过长、毛利压力 | `counterEvidence` |
| 技术反证 | 准确率不足、成本过高、延迟、集成复杂 | `counterEvidence` |
| 监管反证 | 数据跨境、行业准入、隐私、安全审计 | `counterEvidence` |
| 平台依赖 | 依赖模型 API、渠道封锁、生态政策变化 | `riskFactors` |
| 观点反证 | Builder 批评、客户失败反馈、VC 降温 | `pointCalibration` |
| 迁移反证 | 中国客户预算、交付方式、渠道、合规差异 | `chinaTransferRisks` |

### 6.3 可信度评分

```text
Confidence Score =
来源等级 30%
+ 一手证据数量 20%
+ 二次来源一致性 15%
+ 反证完整度 15%
+ 商业化可验证性 10%
+ 时间新鲜度 5%
+ 历史可靠性 5%
```

可信度低于 60 的内容不得进入 Front Signal；低于 70 的内容不得作为 AIBriefIssue 核心判断主证据。

## 7. 四栏目到 HeatEvidence

`HeatEvidence` 是四栏目进入热力图的统一证据模型。它不替代原栏目，而是抽取原栏目中可参与热力计算的判断证据。

### 7.1 转换总规则

| 来源栏目 | 对热力图的贡献 | 可加权内容 | 不可加权内容 |
|---|---|---|---|
| Signal | 外部变化事实 | 产品发布、融资、客户采用、收入、采购、大厂动作 | 无商业含义的新闻 |
| Point | 一线实践校准 | 实操反馈、失败经验、非共识、阻力、边界 | 单纯情绪、流量观点 |
| Opportunity | 商业机会解释 | 目标企业、需求、商业价值、竞争与风险 | 启动步骤、确定性行动指令 |
| Trend | 时间维度沉淀 | 持续升温、阶段变化、跨周期证据、反证变量 | 单日热点 |

### 7.2 HeatEvidence schema 草案

以下是字段草案，不修改当前生产 schema。

```ts
type HeatEvidenceSource = 'signal' | 'point' | 'opportunity' | 'trend';
type HeatDirection = 'up' | 'stable' | 'down' | 'mixed';
type EvidenceRole = 'fact' | 'calibration' | 'opportunity' | 'trend' | 'counter_evidence' | 'boundary';

interface HeatEvidence {
  id: string;
  sourceType: HeatEvidenceSource;
  sourceId: string;
  sourceTitle: string;
  sourceUrl?: string;

  title: string;
  summary: string;
  judgment: string;

  industryTags: string[];
  jobTags: string[];
  workflowTags: string[];
  seedTags: string[];
  formalTags: string[];
  candidateTags: string[];

  impactModes: string[];
  businessValueTags: string[];
  affectedCustomerTypes: string[];

  evidenceRole: EvidenceRole;
  evidenceScore: number;      // 0-100
  confidenceScore: number;    // 0-100
  heatDirection: HeatDirection;
  heatContribution: number;   // 0-100 normalized

  period: string;             // 2026-W19 or 2026-05
  publishedAt: string;
  capturedAt?: string;

  sourceLevel: 'S' | 'A' | 'B' | 'C';
  sourceTypes: string[];
  relatedSignalIds: string[];
  relatedPointIds: string[];
  relatedOpportunityIds: string[];
  relatedTrendIds: string[];

  counterEvidence: string[];
  riskFactors: string[];
  evidenceGaps: string[];
  chinaTransferNotes: string[];

  productionReadiness: 'isolation_only' | 'candidate' | 'production_ready';
}
```

### 7.3 来源权重

| sourceType | 默认权重 | 说明 |
|---|---:|---|
| Signal | 0.90 | 外部变化证据，需靠二次搜索增强 |
| Point | 1.00 | 一线实践校准，正负方向都重要 |
| Opportunity | 1.10 | 商业机会已被解释，权重略高 |
| Trend | 1.15 | 跨周期持续性最高 |

Point 的权重不是事实权重。Point 只能校准热力方向、争议、边界和反证，不能单独把某个热力点推入高热区。

## 8. Seed Dictionary 与正式标签映射

阶段 2 允许提出 seed dictionary 草案。正式迁移时必须映射到 `tag-taxonomy.md`，新词先进入 `candidate_tags`。

### 8.1 行业 seed

| seed | 说明 | 优先正式映射 |
|---|---|---|
| enterprise-software | 企业软件 / SaaS | `customer-enterprise` + `track-enterprise-workflow` |
| ecommerce-retail | 电商 / 零售 | `function-sales` / `function-customer-service` |
| media-content | 内容传媒 | `track-ai-marketing` + `function-marketing` |
| education-training | 教育培训 | `customer-smb` / candidate |
| healthcare | 医疗健康 | `track-medical-ai` + `customer-healthcare-provider` |
| legal-professional | 法务 / 专业服务 | `track-professional-services-ai` + `function-legal-compliance` |
| developer-tools | 开发者工具 | `track-ai-coding` + `function-engineering` |
| industrial-heavy | 制造 / 能源 / 重资产 | `customer-heavy-industry` |

### 8.2 岗位 seed

| seed | 说明 | 优先正式映射 |
|---|---|---|
| sdr-sales | SDR / 销售前端 | `function-sales` |
| customer-support | 客服 / 售后 | `function-customer-service` |
| content-operator | 内容运营 | `function-marketing` |
| product-manager | 产品经理 | candidate |
| software-engineer | 工程研发 | `function-engineering` |
| legal-compliance | 法务合规 | `function-legal-compliance` |
| operations-manager | 运营流程 | `function-operations` |
| procurement-bidding | 采购投标 | `function-procurement-bidding` |

### 8.3 流程 seed

| seed | 说明 | 优先正式映射 |
|---|---|---|
| lead-qualification | 线索筛选 | `scenario-sales-briefing` |
| outbound-followup | 外呼 / 跟进 | `function-sales` + candidate |
| ticket-triage | 工单分类 | `scenario-customer-ticket` |
| knowledge-retrieval | 知识库检索 | `scenario-knowledge-base` |
| document-extraction | 文档抽取 | `scenario-document-workflow` |
| code-generation | 代码生成 | `track-ai-coding` |
| test-generation | 测试生成 | `track-ai-coding` + candidate |
| bid-response | 标书响应 | `scenario-bidding-response` |
| agent-permission-control | Agent 权限控制 | `scenario-agent-governance` |

### 8.4 映射原则

- `industryTags` / `jobTags` / `workflowTags` 是热力图 seed 层，先服务聚合。
- `formalTags` 必须来自 `tag-taxonomy.md`。
- `candidateTags` 用于新行业、岗位、流程候选，不直接进入正式字典。
- 单条 Signal 最多 6 个正式标签；单条 Opportunity 最多 7 个正式标签。
- 公司名、产品名、人物名、轮次名、情绪词不进入正式 tag。

## 9. 热力计算规则

### 9.1 HeatEvidence Contribution

先把 `evidenceScore` 与 `confidenceScore` 归一化为 0-1：

```text
Heat Contribution =
evidenceScore
× confidenceScore
× sourceWeight
× timeWeight
× directionWeight
× roleWeight
```

方向权重：

| direction | 权重 |
|---|---:|
| up | 1.0 |
| stable | 0.4 |
| mixed | 0.1 |
| down | -0.6 |

时间权重：

| 时间 | weekly | monthly |
|---|---:|---:|
| 本期 | 1.0 | 1.0 |
| 上期 | 0.65 | 0.75 |
| 两期前 | 0.35 | 0.50 |
| 更早 | 0.15 | 0.25 |

角色权重：

| evidenceRole | 权重 |
|---|---:|
| fact | 1.0 |
| calibration | 0.8 |
| opportunity | 1.05 |
| trend | 1.1 |
| counter_evidence | -0.8 |
| boundary | -0.3 |

### 9.2 商业热力度核心维度

商业热力度不等于曝光度、新闻热度或公司热度。它衡量的是：

```text
AI 是否正在让某个行业 / 岗位 / 流程组合发生可解释的结构性变化。
```

核心维度：

| 维度 | 口径 | 主要字段 / 来源 |
|---|---|---|
| 影响坐标 | 哪个行业 / 岗位 / 流程被影响 | `industryTags` / `jobTags` / `workflowTags` |
| 变化方式 | 替代、增强、压缩、重组、平台化、外包化 | `impactModes` / Structured Signal |
| 证据密度 | Signal、来源、案例、融资、客户采用、观点数量和质量 | `evidenceScore` / `sourceTypes` / related IDs |
| 变化速度 | 本期相对上期是否升温、降温、稳定或进入争议 | `period` / `heatDirection` / historical baseline |
| 商业强度 | 是否影响预算、收入、成本、效率、交付、合规或管理复杂度 | `businessValueTags` / Deep Dive |
| 争议与边界 | 反证、失败反馈、监管限制、集成难度、客户习惯阻力 | `counterEvidence` / `riskFactors` / `evidenceGaps` |

建议公式：

```text
Business Heat =
影响坐标清晰度 15%
+ 变化方式明确度 15%
+ 证据密度 20%
+ 变化速度 15%
+ 商业强度 20%
- 争议与边界风险调整 15%
```

争议与边界不是简单扣分。若证据密度和商业强度高，同时反证也强，应进入 `争议期`，而不是被删除。

### 9.3 对象热力视图

行业 / 岗位 / 流程 / 三元组不再各自使用完全不同的评分逻辑，而是共享 `Business Heat`，只改变聚合视角。

| 视图 | 聚合口径 | 用途 |
|---|---|---|
| Industry Heat | 按行业聚合同期 Business Heat | 判断哪些行业正在被影响 |
| Job Heat | 按岗位聚合同期 Business Heat | 判断哪些岗位或职能正在变化 |
| Workflow Heat | 按流程聚合同期 Business Heat | 判断哪些工作流正在被重构 |
| Triple Heat | 按行业 x 岗位 x 流程聚合 Business Heat | 商业内参优先使用，最接近商业判断 |

Triple Heat 是商业热力图的主表达。Industry / Job / Workflow Heat 作为摘要和切片，不做公开榜单。

### 9.4 阶段判断

| 阶段 | 分数 / 条件 | 展示处理 |
|---|---|---|
| 低热区 | 0-3.9 | 归档，不作为内参重点 |
| 观察期 | 4.0-5.9 | 可进入周报观察区 |
| 起步期 | 6.0-7.2 | 可进入 weekly 候选 |
| 加速期 | 7.3-8.5 | weekly 重点展示 |
| 爆发期 | 8.6-10 | weekly / monthly 重点 |
| 成熟期 | 热力高但增长趋稳 | monthly 复盘 |
| 争议期 | 热度高且反证 / mixed / down Point 明显 | 必须附反证说明 |

## 10. Heat Cards schema 草案

以下结构用于后续 Dev 规划，不创建代码文件。

```ts
interface IndustryHeatCard {
  id: string;
  industryName: string;
  aiHeatScore: number;
  stage: HeatStage;
  heatChange: number;
  affectedJobs: string[];
  affectedWorkflows: string[];
  topImpactModes: string[];
  evidenceIds: string[];
  relatedSignals: string[];
  relatedPoints: string[];
  relatedOpportunities: string[];
  relatedTrends: string[];
  guanlanJudgment: string;
}
```

```ts
interface JobHeatCard {
  id: string;
  jobName: string;
  department: string;
  typicalIndustries: string[];
  aiHeatScore: number;
  stage: HeatStage;
  heatChange: number;
  replaceableWorkflows: string[];
  augmentedWorkflows: string[];
  hardToReplaceWorkflows: string[];
  impactModes: string[];
  evidenceIds: string[];
  guanlanJudgment: string;
}
```

```ts
interface WorkflowHeatCard {
  id: string;
  workflowName: string;
  relatedIndustries: string[];
  relatedJobs: string[];
  aiHeatScore: number;
  stage: HeatStage;
  heatChange: number;
  repeatabilityScore: number;
  standardizationScore: number;
  dataAvailabilityScore: number;
  aiMaturityScore: number;
  businessValueScore: number;
  impactModes: string[];
  evidenceIds: string[];
  guanlanJudgment: string;
}
```

```ts
interface HeatmapTripleCard {
  id: string;
  industry: string;
  job: string;
  workflow: string;
  aiHeatScore: number;
  stage: HeatStage;
  heatChange: number;
  signalEvidenceScore: number;
  pointEvidenceScore: number;
  opportunityEvidenceScore: number;
  trendEvidenceScore: number;
  impactModes: string[];
  businessValueTags: string[];
  evidenceIds: string[];
  relatedSignals: string[];
  relatedPoints: string[];
  relatedOpportunities: string[];
  relatedTrends: string[];
  guanlanJudgment: string;
}
```

## 11. AIBriefIssue 输入与生成规则

### 11.1 weekly AIBriefIssue

MVP 先做 weekly。

输入：

- 本周 selected Signals。
- 本周 Point Fragments / Clusters。
- 本周 Opportunities / Deep Dive 候选。
- 本周 Trends / Trend updates。
- 本周新增 HeatEvidence。
- 上周 heat baseline。
- 本周反证与争议记录。
- seed dictionary 与 formal tag mapping。

输出：

- 本期核心判断 3-5 条。
- Top Industries。
- Top Jobs。
- Top Workflows。
- Top Triples。
- Rising / Cooling / Controversial heat points。
- Evidence Summary。
- Guanlan Conclusion。

weekly 更关注变化、升温、争议和需要下周继续看的点。

### 11.2 monthly AIBriefIssue

输入：

- 当月全部 weekly HeatEvidence。
- 历史 HeatEvidence。
- 上月 heat baseline。
- 当月新增 / 成熟 / 降温 / 争议热力点。
- 已沉淀 Trends。
- 反证复盘与误判记录。

monthly 更关注结构性趋势、持续性、成熟度、误判修正和长期机会资产。

### 11.3 AIBriefIssue schema 草案

```ts
interface AIBriefIssue {
  id: string;
  title: string;
  period: string;
  issueType: 'weekly' | 'monthly';
  executiveSummary: string[];
  topIndustries: IndustryHeatCard[];
  topJobs: JobHeatCard[];
  topWorkflows: WorkflowHeatCard[];
  topTriples: HeatmapTripleCard[];
  risingHeatPoints: HeatmapTripleCard[];
  coolingHeatPoints: HeatmapTripleCard[];
  controversialHeatPoints: HeatmapTripleCard[];
  keyJudgments: string[];
  evidenceSummary: {
    signals: string[];
    points: string[];
    opportunities: string[];
    trends: string[];
  };
  counterEvidenceSummary: string[];
  evidenceGaps: string[];
  guanlanConclusion: string;
}
```

## 12. 7 日验证计划

7 日验证不是最终交付形态，而是正式迁移前的隔离闸门。

### 12.1 每日验证

每日产出：

- Raw 30-50。
- Pool 10-15。
- Structured 5-8。
- Front Signal 3。
- Trend update。
- HeatEvidence batch。

Deep Dive 只在证据充足时产出 0-1 篇。

### 12.2 第 7 天 weekly 样张模拟

第 7 天必须模拟 1 期 weekly AI内参样张的数据输入，至少包含：

- 7 天 selected Signals。
- 7 天 Point / Builder 校准。
- 7 天 Opportunity / Deep Dive 候选。
- 7 天 Trend updates。
- HeatEvidence 汇总。
- Top industries / jobs / workflows / triples。
- Rising / cooling / controversial heat points。
- 证据来源展开表。
- 反证与证据缺口。

样张只验证结构、数据、判断质量和可解释性，不代表 V2-4A / V2-4 已批准产品上线。

### 12.3 通过线

进入正式开发规划前，至少满足：

- 连续 7 天每日 3 条 Signal 均有 3 个 S/A/B 来源。
- 每条 selected Signal 能映射至少 1 个行业 seed，且命中岗位或流程之一。
- 每条 HeatEvidence 都能反向找到 sourceId。
- Point 没有被当作事实主证据直接加权。
- Weekly 样张能解释热力变化，不只是排序列表。
- V2 Verification Agent 未发现证据断链、反证缺失或自动化污染风险。

## 13. 隔离验证与生产迁移分层

### 13.1 必须先隔离验证

- Raw / Pool / Structured 多阶段漏斗。
- C 级来源触发二次搜索的策略。
- HeatEvidence 新字段。
- seed dictionary。
- HeatContribution 公式权重。
- 行业 / 岗位 / 流程 / 三元组热力聚合。
- weekly AIBriefIssue 样张生成。
- Point 对争议期和降温的校准。

### 13.2 可进入生产升级路径

满足 7 日验证和 QA 后，可进入生产升级规划：

- 来源等级与可信度规则。
- 去重与合并规则。
- 二次搜索和反证要求。
- Signal -> HeatEvidence 转换。
- Point 作为校准层而非事实层。
- HeatEvidence 反向关联 sourceId。
- `AIBriefIssue` weekly MVP 输入结构。

### 13.3 进入生产前另行派发

以下动作必须另行派发 PM / Data / Dev / QA / Workflow 任务：

- 修改正式 Markdown frontmatter。
- 修改 `sync-data.mjs`。
- 修改 `unified-site-sync.mjs`。
- 替换 `ai-2` 生产自动化提示词。
- 修改 `ai-3` 同步闸门。
- 新增 AI内参页面或热力图详情页。
- 将 `06-content/` 内容迁入正式 Signals / Opportunities / Trends。

## 14. 后续 Dev 文件路径建议

仅为后续规划建议，本任务不创建代码文件。

若 V2 采用现有静态站增强路线：

```text
04-Site/scripts/v2/heatmap-types.mjs
04-Site/scripts/v2/heatmap-evidence.mjs
04-Site/scripts/v2/heatmap-scoring.mjs
04-Site/scripts/v2/heatmap-aggregate.mjs
04-Site/scripts/v2/ai-brief-issue.mjs
04-Site/data/v2/heatmap-data.json
04-Site/data/v2/ai-brief-issues.json
```

若 V2 迁移到框架化前端路线，可参考：

```text
src/lib/heatmap/types.ts
src/lib/heatmap/tags.ts
src/lib/heatmap/scoring.ts
src/lib/heatmap/evidence.ts
src/lib/heatmap/aggregate.ts
src/lib/heatmap/stage.ts
src/lib/heatmap/brief.ts
src/data/heatmap/seed-industries.ts
src/data/heatmap/seed-jobs.ts
src/data/heatmap/seed-workflows.ts
src/data/heatmap/seed-triples.ts
```

实际路径由 `V2-5` 技术工作区与迁移方案决定。

## 15. 验收清单

V2 Verification Agent 应按以下清单验收：

- 是否明确 V2-2 服务正式 V2 升级。
- 是否没有把 test-only 当作最终交付形态。
- 是否覆盖来源分层、去重、二次搜索、反证。
- 是否明确四栏目到 HeatEvidence 的转换。
- 是否明确 Point 不能作为事实主证据。
- 是否给出 HeatEvidence schema 草案且不修改生产 schema。
- 是否给出行业 / 岗位 / 流程 / 三元组热力计算。
- 是否给出 weekly / monthly AIBriefIssue 输入输出。
- 是否说明 weekly MVP 和 7 日样张模拟。
- 是否列出哪些规则先隔离验证、哪些进入生产升级路径。
- 是否说明自动化影响和迁移前置条件。

## 16. 自动化影响

本架构文档会影响 V2 正式升级路线，但本任务未修改自动化本体。

- `ai-the-point`：本轮不修改。未来 Point 可作为 HeatEvidence 校准层输入，需另行派发。
- `ai-2`：本轮不替换。未来若将 V2 漏斗迁入生产，需单独升级提示词和内容字段。
- `ai-3`：本轮不修改。未来若 HeatEvidence / AIBriefIssue 进入正式数据，需要单独升级同步闸门和关系检查。

任何生产替换必须经过：规划确认、隔离开发、QA、用户验收、调度中枢 accepted。

## 17. 回填建议

执行窗口只给建议，最终由调度中枢验收和回填。

建议调度中枢在验收通过后：

- 将 `V2-2 / WSD-20260507-03-v2-algorithm-source-architecture` 标记为 `accepted` 或 `accepted / architecture`.
- 在 `progress.md` 追加 V2-2 完成记录。
- 在 `docs/agent-handoff.md` 增加 V2-2 指针。
- 在 `feature_list.json` 中为 V2 算法与来源架构增加或更新对应特性。
- 将 V2-4A / V2-4 标记为可读取本文档继续产品门禁。
