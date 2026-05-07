# 观澜AI｜四栏目保留 + AI商业热力图增值产品升级规划

> 目标：保留现有四个栏目：Signals、Point、Opportunity、Trends。  
> 新增一个核心增值产品：**观澜AI商业内参**，其核心资产是 **AI商业热力图**。  
> AI商业热力图不替代四个栏目，而是由四个栏目提供内容依据，按周或按月沉淀成高价值决策产品。

---

## 0. 产品定位结论

建议采用这个产品结构：

```text
公开内容层
├── Signals：每日外部变化信号
├── Point：一线 builder 观点与实践碎片
├── Opportunity：商业机会观察
└── Trends：长期趋势观察

增值产品层
└── 观澜AI商业内参
    └── 核心模块：AI商业热力图
```

一句话定义：

> **Signals、Point、Opportunity、Trends 是日常内容与证据来源；AI商业内参是周期性增值产品；AI商业热力图是内参里的核心决策资产。**

对外表达：

> **观澜AI商业内参：基于每日 Signals、一线 Point、Opportunity 和 Trends，生成 AI商业热力图，追踪 AI 正在影响的行业、岗位和工作流。**

---

## 1. 为什么不把热力图直接替代四个栏目

四个栏目要保留，因为它们承担不同产品功能：

| 栏目 | 产品作用 | 对热力图的贡献 |
|---|---|---|
| Signals | 日常变化捕捉 | 提供外部变化证据 |
| Point | 一线观点校准 | 提供实践反馈、阻力、非共识判断 |
| Opportunity | 机会方向识别 | 提供商业价值与需求判断 |
| Trends | 长期趋势沉淀 | 提供时间维度和持续性判断 |
| AI商业热力图 | 增值产品核心 | 聚合四栏目证据，输出行业、岗位、流程热力 |

热力图如果每天作为公开栏目展示，容易变成普通榜单；如果作为周度/月度内参核心，则更像高价值商业产品。

---

## 2. 推荐产品形态

### 2.1 公开层：四个栏目继续存在

```text
Signals：每天 3 条精选信号
Point：滚动一线观点池，不强行每天 10 条
Opportunity：有依据才生成机会观察
Trends：周期性趋势观察
```

四个栏目用于：

```text
1. 维持网站日常更新；
2. 建立内容可信度；
3. 积累热力图证据；
4. 给 AI商业内参提供依据；
5. 让用户看到热力图不是拍脑袋生成的。
```

### 2.2 增值层：观澜AI商业内参

内参可设计为：

```text
周度版：观澜AI商业热力周报
月度版：观澜AI商业热力图
季度版：AI商业变化专题内参
```

建议第一阶段先做：

```text
每周一期 AI商业热力周报
每月一期 AI商业热力图完整版
```

### 2.3 核心产品：AI商业热力图

AI商业热力图回答四个问题：

```text
1. AI 正在影响哪些行业？
2. AI 正在影响哪些岗位？
3. AI 正在影响哪些具体工作流？
4. 哪些「行业 × 岗位 × 流程」组合正在升温？
```

热力图的核心对象：

```text
行业 × 岗位 × 流程
```

示例：

```text
电商 × 在线客服 × 重复问答
企业服务 × SDR × 销售线索初筛
教育培训 × 私域运营 × 学员跟进
内容传媒 × 内容运营 × 短视频脚本生成
SaaS × 客户成功经理 × 知识库检索
研发团队 × 初级开发 × 单元测试生成
```

---

## 3. AI商业内参结构

建议每期内参包含 7 个模块。

```text
1. 本期核心判断
2. AI商业热力图总览
3. 升温行业
4. 升温岗位
5. 升温工作流
6. 高热三元组
7. 证据来源与观澜判断
```

### 3.1 本期核心判断

输出 3-5 条高度压缩的商业判断。

示例：

```text
1. AI客服继续升温，但真正升温的不是“客服岗位整体”，而是重复问答、工单分类、售后进度查询这几段流程。
2. SDR 相关流程正在被 AI 重新拆解，销售线索初筛、客户画像、跟进提醒成为高热工作流。
3. 内容运营从“文案生成”走向“多渠道内容生产与分发自动化”，短视频脚本和SEO内容仍是高热区域。
```

### 3.2 AI商业热力图总览

展示：

```text
- 本期高热行业 Top N
- 本期高热岗位 Top N
- 本期高热流程 Top N
- 本期高热三元组 Top N
- 与上期相比的热力变化
```

### 3.3 升温行业

字段：

```text
行业名称
行业热力值
当前阶段
本期热力变化
高热岗位
高热流程
相关证据数量
观澜判断
```

### 3.4 升温岗位

字段：

```text
岗位名称
所属部门
岗位热力值
当前阶段
高热流程
典型行业
AI影响方式
商业影响
证据来源
观澜判断
```

### 3.5 升温工作流

字段：

```text
流程名称
流程热力值
相关岗位
相关行业
AI影响方式
商业价值
证据来源
观澜判断
```

### 3.6 高热三元组

字段：

```text
行业 × 岗位 × 流程
三元组热力值
当前阶段
主要影响方式
商业价值
证据来源
观澜判断
```

### 3.7 证据来源

每个热力判断都必须能反向展开：

```text
关联 Signals
关联 Point
关联 Opportunity
关联 Trends
```

---

## 4. 热力图核心数据模型

### 4.1 HeatEvidence：统一证据模型

四个栏目都要转成统一证据。

```ts
export type HeatEvidenceSource =
  | 'signal'
  | 'point'
  | 'opportunity'
  | 'trend';

export type HeatDirection =
  | 'up'
  | 'stable'
  | 'down'
  | 'mixed';

export interface HeatEvidence {
  id: string;
  sourceType: HeatEvidenceSource;
  sourceId: string;

  title: string;
  summary: string;

  industryTags: string[];
  jobTags: string[];
  workflowTags: string[];

  impactModes: string[];
  businessValueTags: string[];

  evidenceScore: number;      // 0-100，证据自身强度
  confidenceScore: number;    // 0-100，可信度
  heatDirection: HeatDirection;

  heatContribution: number;   // 对热力图贡献值，0-100
  period: string;             // 例如 2026-W19 或 2026-05
  publishedAt: string;
}
```

### 4.2 IndustryHeatCard

```ts
export interface IndustryHeatCard {
  id: string;
  industryName: string;

  aiHeatScore: number;        // 0-10
  stage: HeatStage;

  heatChange: number;         // 相比上期变化
  affectedJobs: string[];
  affectedWorkflows: string[];
  topImpactModes: string[];

  revenueImpact: ImpactLevel;
  costImpact: ImpactLevel;
  efficiencyImpact: ImpactLevel;
  customerExperienceImpact: ImpactLevel;
  managementImpact: ImpactLevel;

  evidenceIds: string[];
  relatedSignals: string[];
  relatedPoints: string[];
  relatedOpportunities: string[];
  relatedTrends: string[];

  guanlanJudgment: string;
}
```

### 4.3 JobHeatCard

```ts
export interface JobHeatCard {
  id: string;
  jobName: string;
  department: string;
  jobType: string;

  typicalIndustries: string[];

  aiHeatScore: number;
  stage: HeatStage;
  heatChange: number;

  replaceableWorkflows: string[];
  augmentedWorkflows: string[];
  hardToReplaceWorkflows: string[];

  impactModes: string[];

  revenueImpact: ImpactLevel;
  costImpact: ImpactLevel;
  efficiencyImpact: ImpactLevel;
  customerExperienceImpact: ImpactLevel;
  managementImpact: ImpactLevel;

  evidenceIds: string[];
  guanlanJudgment: string;
}
```

### 4.4 WorkflowHeatCard

```ts
export interface WorkflowHeatCard {
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

### 4.5 HeatmapTripleCard

```ts
export interface HeatmapTripleCard {
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

### 4.6 通用枚举

```ts
export type HeatStage =
  | '观察期'
  | '起步期'
  | '加速期'
  | '爆发期'
  | '成熟期'
  | '争议期';

export type ImpactLevel =
  | '低'
  | '中'
  | '高'
  | '极高';
```

---

## 5. 热力评分算法

### 5.1 HeatEvidence 贡献值

```text
Heat Contribution =
Evidence Score × Confidence Score × Source Weight × Time Weight × Direction Weight
```

建议来源权重：

```text
Signal：0.90
Point：1.00
Opportunity：1.10
Trend：1.15
```

原因：

```text
Signal 代表外部变化，但不一定落地；
Point 代表一线实践校准，价值高；
Opportunity 代表商业机会已经成形，权重更高；
Trend 代表长期持续性，权重最高。
```

方向权重：

```text
up：+1.0
stable：+0.4
mixed：+0.1
down：-0.6
```

时间权重：

```text
本期：1.0
上一期：0.65
两期前：0.35
更早：0.15
```

### 5.2 行业热力值

```text
行业AI热力值 =
相关Signal密度 × 20%
+ Point校准密度 × 20%
+ 高热岗位数量 × 20%
+ 高热流程数量 × 20%
+ Opportunity商业机会强度 × 10%
+ Trend持续性 × 10%
```

### 5.3 岗位热力值

```text
岗位AI热力值 =
重复度 × 15%
+ AI成熟度 × 20%
+ 成本影响 × 15%
+ 收入影响 × 15%
+ 数据可获得性 × 10%
+ 流程标准化程度 × 10%
+ 四栏目证据强度 × 15%
```

### 5.4 流程热力值

```text
流程AI热力值 =
重复度 × 20%
+ 标准化程度 × 20%
+ 数据可获得性 × 15%
+ AI成熟度 × 20%
+ 商业价值 × 15%
+ 四栏目证据强度 × 10%
```

### 5.5 三元组热力值

```text
三元组热力值 =
行业热力 × 20%
+ 岗位热力 × 25%
+ 流程热力 × 25%
+ Signal证据强度 × 10%
+ Point校准强度 × 10%
+ Opportunity商业机会强度 × 5%
+ Trend持续性 × 5%
```

### 5.6 阶段判断

```text
0 - 3.9：低热区
暂不作为内参重点展示，只保留归档。

4.0 - 5.9：观察期
有零星变化，但证据不足。

6.0 - 7.2：起步期
已经出现外部信号，开始有一线讨论或初步机会。

7.3 - 8.5：加速期
Signal、Point、Opportunity 至少两类证据同时出现，商业价值明确。

8.6 - 10：爆发期
多类证据共同出现，热力持续上升，且多个行业、岗位或流程形成共振。

成熟期：
热力值高但增长趋稳，说明方向已经相对明确。

争议期：
外部热度高，但 Point 中存在明显质疑、失败反馈或商业阻力。
```

---

## 6. 四栏目算法升级

# 6.1 Signals 算法升级

## 定位

Signals 保持日常栏目，负责捕捉外部变化。

每条 Signal 要回答：

```text
这条外部变化影响了哪些行业？
影响了哪些岗位？
影响了哪些流程？
对 AI商业热力图贡献多少？
```

## Signal Score

```text
Signal Score =
变化强度 × 20%
+ 商业相关度 × 20%
+ 行业影响范围 × 15%
+ 岗位/流程指向性 × 15%
+ 可结构化程度 × 10%
+ 新鲜度 × 10%
+ 可信度 × 5%
+ 稀缺性 × 5%
```

## Signal 入库规则

```text
30-50 条原始信息
↓
10-15 条候选 Signal
↓
5-8 条结构化入库
↓
3 条前台精选 Signal
↓
全部高质量 Signal 转成 HeatEvidence
```

## Signal → HeatEvidence 规则

Signal 必须至少命中：

```text
1 个行业标签
+
1 个岗位标签或流程标签
```

否则只作为背景信息，不进入热力图证据池。

## Signal Prompt

```text
你是观澜AI的 Signals 分析器，也是 AI商业热力图的外部变化证据提取器。

请从以下 AI 相关原始信息中，筛选真正会影响行业、岗位或工作流的商业信号。

不要写成普通新闻摘要。请判断：
1. 这条信息代表什么外部变化；
2. 它可能影响哪些行业；
3. 它可能影响哪些岗位；
4. 它可能影响哪些具体工作流；
5. 它的 AI 影响方式是什么；
6. 它对收入、成本、效率、客户体验或管理难度有什么影响；
7. 它是否应该作为 AI商业热力图的证据。

输出字段：
- signal_title
- external_change
- affected_industries
- affected_jobs
- affected_workflows
- impact_modes
- business_value_tags
- signal_score
- confidence_score
- heat_direction
- heat_contribution
- guanlan_judgment
```

---

# 6.2 Point 算法升级

## 定位

Point 保持独立栏目，但从“观点展示”升级为：

```text
一线 builder 观点池 + AI商业热力图校准层
```

由于每天观点数量有限，继续采用三层结构：

```text
Point Fragment
↓
Point Cluster
↓
Point Insight
```

## Point Fragment Score

```text
Point Fragment Score =
一线程度 × 20%
+ 实操场景 × 20%
+ 证据强度 × 20%
+ 商业启发 × 15%
+ 非共识价值 × 10%
+ 与热力图标签关联度 × 10%
+ 表达可转化度 × 5%
```

## Point 对热力图的作用

Point 不一定只升温，也可能降温或标记争议。

```text
up：一线实践支持该方向升温
stable：保持观察
down：一线反馈显示该方向热度过高或难以落地
mixed：既有机会，也有明显阻力
```

## Point 入库规则

```text
每天抓取一线观点 8-15 条
↓
筛出 3-6 条 Point Fragment
↓
进入滚动观点池
↓
7-14 天聚合 Point Cluster
↓
成熟后形成 Point Insight
↓
高质量 Point 转成 HeatEvidence
```

## Point Prompt

```text
你是观澜AI的 Point 分析器，也是 AI商业热力图的一线实践校准器。

请从以下一线 builder 观点中，提取可以校准 AI商业热力图的观点碎片。

你需要判断：
1. 这是不是一线实践观点；
2. 它来自什么实践场景；
3. 它指向哪些行业、岗位、工作流；
4. 它是支持升温、保持观察、降温，还是呈现混合信号；
5. 它对哪些热力点有校准作用；
6. 它是否揭示了商业阻力、客户反馈、技术限制或非共识判断。

输出字段：
- point_title
- builder_type
- core_view
- practice_context
- affected_industries
- affected_jobs
- affected_workflows
- impact_modes
- business_value_tags
- evidence_strength
- point_score
- heat_direction
- heat_contribution
- risk_or_resistance
- guanlan_interpretation
```

---

# 6.3 Opportunity 算法升级

## 定位

Opportunity 保持独立栏目，但不再是泛泛机会文章，而是：

```text
从高热行业 × 岗位 × 流程组合中解释商业机会。
```

Opportunity 的来源：

```text
高分 Signal
高质量 Point
持续升温 Trend
高热三元组
```

## Opportunity 分级

```text
Opportunity Hint：
出现机会苗头，但证据还不完整。

Opportunity Card：
已有 Signal 和 Point 两类证据支撑，商业价值清晰。

Opportunity Brief：
多类证据共同支撑，且已进入趋势或内参级别。
```

## Opportunity Score

```text
Opportunity Score =
三元组热力值 × 30%
+ 商业价值强度 × 25%
+ 目标企业清晰度 × 15%
+ 需求明确度 × 15%
+ 竞争空白 × 10%
+ 风险限制清晰度 × 5%
```

## Opportunity 输出约束

Opportunity 不输出：

```text
测试步骤
验证动作
启动成本
验证周期
```

Opportunity 只输出：

```text
机会方向
行业 × 岗位 × 流程
机会为何出现
目标企业类型
核心需求
商业价值
竞争格局
风险限制
观澜判断
```

## Opportunity Prompt

```text
你是观澜AI的 Opportunity 分析器，也是 AI商业热力图的商业机会解释器。

请基于以下热力图三元组，以及相关 Signals、Point 和 Trends，判断它是否已经形成商业机会。

注意：
不要输出测试步骤、验证动作、启动成本、验证周期。
只判断商业机会本身。

你需要输出：
1. 机会名称；
2. 对应的行业 × 岗位 × 流程；
3. 机会为何出现；
4. 外部变化依据；
5. 一线观点依据；
6. 趋势依据；
7. 目标企业类型；
8. 核心需求；
9. 商业价值；
10. 竞争格局；
11. 风险与限制；
12. Opportunity Score；
13. 机会等级；
14. 观澜判断。

输出字段：
- opportunity_name
- heatmap_triple
- opportunity_level
- why_now
- signal_basis
- point_basis
- trend_basis
- target_companies
- core_demand
- business_value
- competition_landscape
- risks_and_limits
- opportunity_score
- guanlan_judgment
```

---

# 6.4 Trends 算法升级

## 定位

Trends 保持独立栏目，但从“趋势文章”升级为：

```text
AI商业热力图的长期热力沉淀层。
```

Trend 不只看新闻热点，而是看：

```text
某个行业是否持续升温；
某个岗位是否持续被影响；
某个流程是否在多个行业反复出现；
某个 AI 影响方式是否正在扩散。
```

## Trend Heat

```text
Trend Heat =
相关行业热力变化 × 20%
+ 相关岗位热力变化 × 20%
+ 相关流程热力变化 × 25%
+ Signal持续出现 × 10%
+ Point持续校准 × 10%
+ Opportunity持续生成 × 10%
+ 时间跨度 × 5%
```

## Trend 成立条件

```text
1. 连续多个周期出现相关 Signal；
2. 连续多个周期出现相关 Point 或 Point Cluster；
3. 至少影响 2 个以上行业，或 3 个以上岗位/流程；
4. 热力值不是单日上升，而是持续升温；
5. 能说明一个长期方向。
```

## Trend Prompt

```text
你是观澜AI的 Trend 分析器，也是 AI商业热力图的长期热力沉淀器。

请基于最近一段时间的 HeatEvidence、Signals、Point、Opportunity 和热力图变化，判断哪些趋势正在形成。

不要只看单条新闻热度。
你要判断：
1. 哪些行业正在持续升温；
2. 哪些岗位正在连续被影响；
3. 哪些工作流在多个行业中重复出现；
4. 哪些 AI 影响方式正在扩散；
5. 哪些热力点只是短期噪音；
6. 哪些变化可以沉淀为长期趋势。

输出字段：
- trend_title
- trend_summary
- related_industries
- related_jobs
- related_workflows
- impact_modes
- heat_change_summary
- signal_basis
- point_basis
- opportunity_basis
- trend_heat
- stage
- guanlan_judgment
```

---

## 7. AI商业内参生成算法

### 7.1 输入

```text
本期 Signals
本期 Point Fragments / Clusters / Insights
本期 Opportunities
本期 Trends
历史 HeatEvidence
上期热力图数据
```

### 7.2 处理流程

```text
1. 将四栏目内容全部转成 HeatEvidence；
2. 按行业、岗位、流程、三元组聚合证据；
3. 计算本期热力值；
4. 对比上期热力值；
5. 识别升温、降温、争议和成熟区域；
6. 生成本期热力图；
7. 生成核心判断；
8. 生成内参正文；
9. 关联证据来源。
```

### 7.3 输出

```text
AI商业内参 Issue
├── issue_id
├── period
├── title
├── executive_summary
├── top_industries
├── top_jobs
├── top_workflows
├── top_triples
├── heat_changes
├── key_judgments
├── evidence_summary
└── guanlan_conclusion
```

### 7.4 AIBriefIssue Type

```ts
export interface AIBriefIssue {
  id: string;
  title: string;
  period: string; // 2026-W19 或 2026-05
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

  guanlanConclusion: string;
}
```

---

## 8. 前台产品结构建议

### 8.1 导航结构

保留原四栏目：

```text
Signals
Point
Opportunity
Trends
```

新增增值栏目：

```text
AI内参
```

AI内参下包含：

```text
AI商业热力图
往期内参
行业热力
岗位热力
流程热力
高热组合
```

### 8.2 AI内参首页

模块：

```text
1. 最新一期 AI商业内参
2. 本期 AI商业热力图
3. 本期升温行业
4. 本期升温岗位
5. 本期升温工作流
6. 本期高热三元组
7. 证据来源
8. 往期内参
```

### 8.3 热力图详情页

每个热力点详情页结构：

```text
# 行业 × 岗位 × 流程

## 一、热力概览
- 热力值
- 当前阶段
- 本期变化
- 主要影响方式
- 商业价值

## 二、影响分析
- 行业影响
- 岗位影响
- 流程影响
- 对收入、成本、效率、客户体验、管理难度的影响

## 三、证据来源
- 相关 Signals
- 相关 Point
- 相关 Opportunity
- 相关 Trends

## 四、观澜判断
- 这代表什么变化
- 为什么值得关注
- 哪些企业应该关注
- 主要风险与限制
```

---

## 9. 推荐代码目录

```text
/src/lib/heatmap/types.ts
/src/lib/heatmap/tags.ts
/src/lib/heatmap/scoring.ts
/src/lib/heatmap/evidence.ts
/src/lib/heatmap/aggregate.ts
/src/lib/heatmap/stage.ts
/src/lib/heatmap/brief.ts
/src/lib/heatmap/prompts.ts

/src/data/heatmap/seed-industries.ts
/src/data/heatmap/seed-jobs.ts
/src/data/heatmap/seed-workflows.ts
/src/data/heatmap/seed-triples.ts

/src/app/signals/page.tsx
/src/app/point/page.tsx
/src/app/opportunity/page.tsx
/src/app/trends/page.tsx

/src/app/ai-brief/page.tsx
/src/app/ai-brief/[issueId]/page.tsx
/src/app/ai-brief/heatmap/[tripleId]/page.tsx
```

---

## 10. 开发优先级

### P0：数据和算法

```text
1. HeatEvidence 统一证据模型
2. IndustryHeatCard / JobHeatCard / WorkflowHeatCard / HeatmapTripleCard
3. 四栏目内容转 HeatEvidence
4. 热力评分函数
5. 热力阶段判断
6. AIBriefIssue 数据结构
7. 周度/月度内参生成函数
```

### P1：内容与 Prompt

```text
1. Signal Prompt
2. Point Prompt
3. Opportunity Prompt
4. Trend Prompt
5. AI内参生成 Prompt
6. 热力图判断 Prompt
```

### P2：前台展示

```text
1. AI内参首页
2. 最新一期内参详情页
3. AI商业热力图模块
4. 高热三元组卡片
5. 证据来源展开
6. 往期内参列表
```

---

## 11. Codex 开发指令

```text
请将观澜AI项目升级为「四栏目保留 + AI商业内参增值产品」结构。

新的产品定位：
Signals、Point、Opportunity、Trends 四个栏目继续保留，作为日常内容栏目。
AI商业热力图不替代四个栏目，而是作为「AI内参」中的核心增值产品。
AI内参每周或每月生成一期，核心内容是基于四栏目证据生成的 AI商业热力图。

核心目标：
1. 保留 Signals、Point、Opportunity、Trends 四个栏目；
2. 新增 AI内参栏目；
3. AI内参的核心模块是 AI商业热力图；
4. 四栏目内容必须能转成 HeatEvidence；
5. HeatEvidence 聚合生成行业热力、岗位热力、流程热力和三元组热力；
6. 每个热力点必须能反向关联其证据来源；
7. AI内参支持 weekly 和 monthly 两种 issueType。

优先实现：
1. HeatEvidence 统一证据模型；
2. IndustryHeatCard；
3. JobHeatCard；
4. WorkflowHeatCard；
5. HeatmapTripleCard；
6. AIBriefIssue；
7. Signals → HeatEvidence 转换逻辑；
8. Point → HeatEvidence 转换逻辑；
9. Opportunity → HeatEvidence 转换逻辑；
10. Trends → HeatEvidence 转换逻辑；
11. 行业、岗位、流程、三元组热力评分函数；
12. AI内参生成函数；
13. AI内参页面；
14. 热力图详情页；
15. 四栏目内容与热力点的关联展示。

重要约束：
1. 不要删除或替代现有四个栏目；
2. 不要把 AI商业热力图做成普通新闻列表；
3. 不要把岗位热力图做成“AI是否替代岗位”的简单判断；
4. 不要输出测试步骤、验证动作、启动成本、验证周期相关字段；
5. Opportunity 只输出机会方向、商业价值、目标企业、风险限制和观澜判断；
6. Point 不要强行每天生成 10 条完整观点，允许 Point Fragment、Point Cluster、Point Insight 三层结构；
7. 每条 Signal、Point、Opportunity、Trend 都尽量映射到行业、岗位或流程标签；
8. 热力图每个点都必须能反向展开其证据来源；
9. 先完成数据结构、评分算法、标签体系和聚合服务，再改前台 UI。

建议目录：
/src/lib/heatmap/types.ts
/src/lib/heatmap/tags.ts
/src/lib/heatmap/scoring.ts
/src/lib/heatmap/evidence.ts
/src/lib/heatmap/aggregate.ts
/src/lib/heatmap/stage.ts
/src/lib/heatmap/brief.ts
/src/lib/heatmap/prompts.ts
/src/data/heatmap/seed-industries.ts
/src/data/heatmap/seed-jobs.ts
/src/data/heatmap/seed-workflows.ts
/src/data/heatmap/seed-triples.ts
/src/app/ai-brief/page.tsx
/src/app/ai-brief/[issueId]/page.tsx
/src/app/ai-brief/heatmap/[tripleId]/page.tsx

完成后写 handoff，包含：
- 修改文件；
- 新增数据结构；
- 新增算法；
- AI内参生成逻辑；
- 四栏目如何映射到 HeatEvidence；
- 热力图如何聚合；
- 未完成项；
- 风险提醒；
- 下一步建议。
```

---

## 12. 最终产品主线

```text
Signals：外部变化
Point：一线观点
Opportunity：商业机会
Trends：长期趋势
↓
统一转为 HeatEvidence
↓
聚合成行业、岗位、流程、三元组热力
↓
生成 AI商业热力图
↓
沉淀为 AI商业内参
```

最终定义：

> **观澜AI不是把热力图当作普通栏目，而是把 AI商业热力图做成增值型 AI内参的核心资产。四个栏目负责持续输入，AI内参负责周期性输出判断。**

