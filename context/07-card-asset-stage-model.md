---
status: current
scope: card-asset-stage-model
last_updated: 2026-05-21
use_when:
  - Card / 资产层设计
  - Pool-to-Asset 规则治理
  - 商业信号与前沿观点展示
  - 变化 / 场景 / 趋势候选升级
do_not_use_when:
  - Raw / Pool 证据字段治理
  - 今日观察正文写作
  - 前台页面视觉设计
priority: current
---

# Card Asset Stage Model｜卡片资产阶段化模型

本文是观澜 AI 当前 Card / 资产层的阶段化口径。目标是让系统前期先跑起来，优先积累数据、事件和案例，不把卡片体系一开始做得过重。

核心原则：

- Pool 类型不等于卡片类型。Pool 解决材料分流，卡片解决资产用途。
- 前期前台只保留两条流：商业信号流、前沿观点流。
- 后台只保留三种轻量候选：变化候选、场景候选、趋势候选。
- 显性事实先积累，隐性判断谨慎生成。
- 卡片体系允许阶段性变复杂，但不能在数据和案例不足时提前复杂化。

## 1. 前期前台结构

### 1.1 商业信号流

商业信号流只展示显性事实事件，前期只保留三种主类型：

```text
signal_type:
  - product_service
  - funding
  - case
```

含义：

- `product_service`：谁发布、上线、开放、集成了什么新产品、新服务或新能力。
- `funding`：谁融了钱，投资方是谁，资本押注什么方向。
- `case`：谁在真实客户、行业场景、岗位流程或业务工作流里使用了 AI。

合作、采购、定价、风险、监管、合规等不作为前期主类型。它们只能作为：

```text
business_variable
supporting_signal
evidence_tag
watch_reason
```

如果某个合作、采购、定价或风险事件足够重要，必须归入三种主类型之一：

- 合作推出新产品：归入 `product_service`。
- 合作进入客户场景：归入 `case`。
- 合作伴随投资、融资或资本动作：归入 `funding`。

如果归不到三种主类型，前期不进入主信号流，最多进入观察池或补证任务。

### 1.2 前沿观点流

前沿观点流独立于商业信号流。它不是商业信号的附属侧栏，也不只是其他卡片的校准材料。

适合进入前沿观点流的来源：

```text
opinion_type:
  - builder_view
  - investor_view
  - researcher_view
  - executive_view
  - essay_view
```

前沿观点流入选门槛：

1. 说话者身份明确：builder、investor、researcher、executive 或高质量文章作者。
2. 观点完整，不是玩笑、转发、情绪表达、祝贺或纯营销。
3. 指向一个判断问题：技术路线、产品路线、组织变化、商业采用、资本判断、客户需求、成本结构或竞争边界。
4. 原文可追溯：有原文链接、平台、发布时间 / 抓取时间、原文或快照。
5. 不把观点里的事实主张当事实。观点中提到公司动作、客户采用、收入、融资、市场规模等，必须另有事实来源。

展示规则：

- 短观点尽量展示完整原文。
- 长观点展示原文关键摘录。
- 必须保留原文链接，支持跳转到原文出处。
- 观澜解读只能放在原文之后，用来说明它指向什么判断问题，不能替代原文。

前沿观点卡建议字段：

```text
speaker
title_at_time
opinion_type
original_text_or_excerpt
original_url
platform
published_at
collected_at
guanlan_interpretation
judgment_question
fact_boundary
related_signals
related_candidates
```

### 1.3 前沿观点四档评级

前沿观点卡必须先评级，再决定是否进入前台。评级不是内容价值的绝对判断，而是当前阶段的展示与治理分流。

```yaml
opinion_tier: feature | sidebar | archive | discard
display_lane: daily_feature | signal_sidebar | archive_only | hidden
selection_reason:
opinion_rating_score:
opinion_rating_version: 2026-05-22-v1
publish_status: frontstage_feature | frontstage_sidebar | internal_archive | hidden
translation_status: translated | pending_translation
```

| 档位 | 展示位置 | 作用 |
|---|---|---|
| `feature` | 今日观察主推观点 | 当天最值得读的观点，直接支撑今日观察主线或核心商业判断 |
| `sidebar` | 商业信号页观点模块 / 侧栏 | 有判断价值，可作为商业信号参照，但不一定构成当日主线 |
| `archive` | 知识库归档 | 有保留价值，但信息量、上下文或关联度不足，暂不进前台 |
| `discard` | 隐藏或后续清理 | 玩笑、祝贺、纯转发、纯营销、无上下文、无原文或无判断价值 |

前台同步只允许完成中文翻译的 `feature` 与 `sidebar`。`archive`、`discard` 和 `translation_status: pending_translation` 不得因为存在 `frontend` 字段而被同步。

## 2. 后台轻量候选

前期不做五种完整卡片模板，只做：

```text
前台可见：
  - signal_card
  - opinion_card

后台轻量候选：
  - change_candidate
  - scene_candidate
  - trend_candidate
```

后台候选不是前台内容，不应直接出现在首页或栏目主列表。它们用于积累、聚类、复盘和后续升级。

## 2.1 卡片生成环节

卡片生成发生在 `guanlan-daily-assets-chain` 手动资产链环节，不发生在每日监测，也不发生在今日观察写作。

顺序是：

```text
Daily Monitor
-> Raw / Pool
-> Daily Monitor QC
-> readiness: assert-guanlan-automation-readiness --command=assets
-> asset-card-generator
-> cardcopy gate
-> content / knowledge 写入
-> 后续才允许今日观察、趋势追踪或前台同步引用
```

其中：

- `guanlan-daily-monitor` 只产出 Raw、Pool、前沿观点发现索引和 QC 交接，不生成正式商业信号或正式判断。
- `asset-card-generator` 负责把 eligible `core_pool` 转成 `signal_card`、`opinion_card`、`change_candidate`、`scene_candidate`、`trend_candidate`。
- `case-signal-researcher` 只在触发后补厚商业信号、场景候选或变化候选，不做全量生成。
- `trend-report-writer` 只在趋势候选达到门槛后写趋势报告或维护趋势候选，不从单条 Pool 直接生成趋势判断。

## 2.2 当前目录落点

内容生产层：

```text
01-SiteV2/content/04-business-signals/signals/
01-SiteV2/content/04-business-signals/change-topics/
01-SiteV2/content/05-frontier-opinions/
01-SiteV2/content/06-asset-candidates/change/
01-SiteV2/content/06-asset-candidates/scene/
01-SiteV2/content/06-asset-candidates/trend/
01-SiteV2/content/08-trend-reports/
01-SiteV2/content/09-business-briefs/
01-SiteV2/content/10-publication-index/
01-SiteV2/content/11-databases/
```

长期知识层：

```text
01-SiteV2/knowledge/01-Signal-Cards/
01-SiteV2/knowledge/02-Opinion-Cards/
01-SiteV2/knowledge/03-Asset-Candidates/
01-SiteV2/knowledge/04-Publication-Index/
```

历史变化类资产已迁入 `knowledge/03-Asset-Candidates/change/`，历史案例类资产迁入 `knowledge/01-Signal-Cards/case/`，历史观点类资产迁入 `knowledge/02-Opinion-Cards/`，历史趋势类资产迁入 `knowledge/03-Asset-Candidates/trend/`。

## 3. 变化候选与正式变化判断

### 3.1 定义

正式变化判断不是单条事件的高级摘要。正式变化判断必须建立在一定时间窗口内的材料积累、前后对比和商业变量之上。

```text
正式变化判断 = 在一定时间窗口内，由多个事实、案例、产品动作、观点或数据共同支撑的商业变化判断。
```

单一材料不能直接生成正式变化判断。单一强材料最多触发 `change_candidate`。

### 3.2 正式变化判断触发规则

正式变化判断至少满足：

1. 至少 3 条相关商业信号，来自不同主体或不同来源。
2. 至少 1 个案例信号，说明它进入了真实场景、客户或工作流。
3. 至少 1 个前后对比，例如：
   - 过去怎么做，现在怎么做；
   - 原来谁负责，现在谁负责；
   - 原来怎么收费，现在怎么收费；
   - 原来是工具，现在变成流程；
   - 原来是 demo，现在进入采购、部署或真实使用。
4. 至少落到 1 个商业变量：
   - 客户；
   - 流程；
   - 预算；
   - 组织；
   - 责任；
   - 风险；
   - 竞争；
   - 交付；
   - 成本；
   - 渠道。
5. 有明确风险边界、信息缺口或后续观察变量：什么情况出现，说明这个变化还不能写成确定结论。

软加分：

- 有 1 条高价值前沿观点呼应。
- 有融资或资本动作跟进。
- 有多个行业、岗位或客户类型出现相似信号。
- 有平台、头部客户或监管因素加入。

### 3.3 展示形态

正式变化判断前期是后台判断资产，不作为普通前台卡片展示。

当正式变化判断达到展示条件时，前台优先使用“变化短专题”，放在“商业信号”下，而不是直接进入“趋势追踪”。

变化短专题结构：

1. 核心判断：一句话说明什么正在变。
2. 为什么现在值得看：说明它不是单点噪音。
3. 三条支撑材料：商业信号、案例、产品动作或融资等。
4. 一个案例或场景：说明它进入了真实业务语境。
5. 一条前沿观点：可选，用于校准判断，不替代事实。
6. 商业变量：说明影响客户、流程、预算、组织、责任、风险、竞争中的哪一项。
7. 还没确定什么：风险边界、信息缺口和后续观察变量。

成熟后，变化短专题可以升级为文章、商业内参或趋势追踪的一部分。

## 4. 场景候选与正式场景判断

### 4.1 定义

正式场景判断不是行业标签，而是 AI 进入具体行业、岗位、流程或任务的可复用场景资产。

不合格：

```text
医疗 AI
法律 AI
客服 AI
企业服务 AI
```

合格方向：

```text
保险理赔员用 AI 预审索赔材料
律师团队用 AI 比对合同风险条款
客服主管用 AI 复盘高投诉会话
销售团队用 AI 自动生成账户跟进记录
```

### 4.2 正式场景判断触发规则

正式场景判断至少满足：

1. 至少 2 条相关案例、产品或客户场景信号。
2. 能写清行业或部门。
3. 能写清岗位或使用者。
4. 能写清具体流程或任务。
5. 能写清 AI 替代、增强或重组了哪个步骤。
6. 至少有 1 个证据缺口或观察变量。

软加分：

- 有真实客户或部署证据。
- 有成本、效率、风险、合规或交付变化。
- 有多个公司在相似流程上出现。
- 有 builder / 投资人 / 研究者观点呼应。

### 4.3 展示形态

正式场景判断前期不作为前台主内容。建议路径：

```text
前期：后台场景候选
中期：商业信号详情页里的“相关场景”
成熟后：场景专题 / AI 商业热力图节点
```

## 5. 趋势候选与正式趋势判断

### 5.1 定义

正式趋势判断比正式变化判断更后置。它不是“某类事件变多了”，而是多个变化和场景共同指向一个阶段性方向。

```text
正式趋势判断 = 多个正式变化判断 + 多个正式场景判断 + 多类证据共同支撑的阶段性方向判断。
```

### 5.2 正式趋势判断触发规则

正式趋势判断至少满足：

1. 至少 3 个正式变化判断或成熟变化短专题。
2. 至少 2 个正式场景判断或成熟场景。
3. 至少 2 个不同赛道、行业或客户类型出现相似信号。
4. 至少 2 类来源：公司动作、案例、融资、观点、研究 / 数据等。
5. 能说明它对预算、流程、组织、竞争或风险的阶段性影响。
6. 清楚说明风险边界、证据缺口或尚未证明的商业变量。

软加分：

- 有融资连续性。
- 有头部平台参与。
- 有真实客户部署。
- 有监管或采购环境变化。
- 有高价值观点呼应。

### 5.3 展示形态

趋势候选是后台判断资产；正式趋势判断不作为普通前台卡片。

前台表达形式：

- 趋势追踪专题；
- 趋势报告；
- AI 商业热力图节点；
- 商业内参主题。

## 6. Pool 到资产的关系

Pool 六类是材料入口，不是卡片类型。

| Pool 类型 | 前期资产去向 |
|---|---|
| `important_case` | 商业信号流的 `case`；也可支撑场景候选、变化候选 |
| `important_funding` | 商业信号流的 `funding`；也可支撑变化候选、趋势候选 |
| `important_technical_trend` | 先进入商业信号或变化候选；技术路线先做字段，不单独成卡 |
| `important_product_or_service` | 商业信号流的 `product_service`；也可支撑变化候选、场景候选 |
| `important_vertical_solution` | 优先进入 `case` 或场景候选；成熟后支撑正式场景判断 |
| `important_viewpoint_or_article` | 前沿观点流；也可支撑变化、场景、趋势候选，但不替代事实 |

## 7. 当前不做的事

前期暂不做：

- 独立融资卡模板。
- 独立产品卡模板。
- 独立技术路线卡。
- 独立商业变量卡。
- 普通前台正式变化判断。
- 普通前台趋势判断卡片。
- 把合作、采购、定价、风险作为主 signal type。
- 把社区观点、AI HOT 摘要或搜索摘要做成事实卡。

这些内容可以作为字段、标签、观察理由或后台候选材料存在。等数据、案例和复盘稳定后，再决定是否拆成独立资产类型。

## 8. 阶段演进

```text
Phase 1｜先跑起来
前台只做商业信号流和前沿观点流。
后台只做变化候选、场景候选、趋势候选。

Phase 2｜积累后抽象
当同类事件、案例、观点和前后对比足够时，升级正式变化判断和正式场景判断。
正式变化判断前台用变化短专题表达。

Phase 3｜成熟后体系化
当正式变化判断、正式场景判断、多来源、风险边界和后续观察变量足够时，升级正式趋势判断。
正式趋势判断支撑趋势追踪、热力图和商业内参。
```

最终原则：

> 前期不要追求卡片体系完整，而要保证系统能稳定积累高质量事件、案例和观点。隐性判断只能在材料足够时浮现，不要用卡片结构强行制造判断。

