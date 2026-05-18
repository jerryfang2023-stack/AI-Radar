# WSD-20260518-GRILLME-STRATEGY-PRODUCT Closeout

日期：2026-05-18  
owner：`strategy / pm / copy / intelligence-data / workflow-automation`  
状态：accepted  
编码：UTF-8

## 0. 调度摘要

```yaml
task_id: WSD-20260518-GRILLME-STRATEGY-PRODUCT
board_id: V2-STRATEGY-PRODUCT-GRILLME
status: accepted
recommended_status: accepted
dispatch_path: ad-hoc-grill-me-session
closeout_path: agent-workflow/reports/WSD-20260518-grillme-strategy-product-closeout.md
changed_files:
  - AGENTS.md
  - agent-workflow/governance/current-context.md
  - agent-workflow/product/strategy-single-source.md
  - agent-workflow/product/column-architecture.md
  - agent-workflow/product/COPY.md
  - agent-workflow/product/trend-model.md
  - agent-workflow/product/intelligence-data-model.md
  - agent-workflow/product/source-intelligence.md
  - agent-workflow/product/raw-evidence-schema.md
  - agent-workflow/product/pool-routing-rules.md
  - agent-workflow/product/daily-monitoring-playbook.md
  - agent-workflow/automation-prompts/writer-style-guide.md
  - agent-workflow/automation-prompts/guanlan-daily-monitor.md
  - agent-workflow/automation-prompts/asset-card-generator.md
  - agent-workflow/automation-prompts/daily-observation-writer.md
  - agent-workflow/automation-prompts/case-signal-researcher.md
  - agent-workflow/automation-prompts/trend-report-writer.md
  - agent-workflow/automation-prompts/brief-periodical-writer.md
  - 01-SiteV2/content/README.md
  - 01-SiteV2/knowledge/README.md
gates:
  syntax: pass
  browser_desktop: n/a
  browser_mobile: n/a
  design_director: n/a
  pm_gate: n/a
automation_impact:
  guanlan-daily-monitor: changed / active
  asset-card-generator: changed
  daily-observation-writer: changed
  case-signal-researcher: changed
  trend-report-writer: changed
  brief-periodical-writer: changed
blockers:
  - none
next_action: 调度中枢验收并回填；按遗留任务继续派发旧资产迁移、writer 重跑和前台页面重构
```

## 1. 对应任务

- 派发单：无独立派发单。本轮为用户通过原生 `grill-me` 连续推进的战略 / 产品 / 内容 / 数据 / 自动化重构。
- 任务目标：把 100+ 题讨论形成的观澜AI V2 当前口径收束为可被主调度窗口接管的战略与产品总账。

## 2. 本轮共识摘要

观澜AI不是 AI 新闻站、热点导航、工具目录，也不是简单日报。

当前定位：

```text
观澜AI｜WAVESIGHT AI 是面向商业决策者的 AI 机会判断系统。
```

核心逻辑：

```text
从 AI 热点中筛出商业信号，从信号形成判断，从判断发现机会。
```

用户真实目标分两层：

1. 对用户本人或类似老板：短期了解趋势，中期形成行业嗅觉和判断力，长期发现创业机会；同时沉淀数据库、案例库、观点库。
2. 对内容经营：这些判断资产可以二次创作，在自媒体、社群、公众号、视频号等渠道获得流量和信任。

这一定位已经替代早期“新闻资讯 / 机会列表 / 评分前台化”的口径。

## 3. 战略定位调整

### 3.1 用户对象

核心用户不是泛泛的 AI 爱好者，而是商业决策者：

- 企业老板。
- 资源型合伙人。
- 行业操盘手。
- 投资观察者。
- 关心 AI 如何改变客户、流程、岗位、预算、交付和竞争的人。

用户不是来听“AI 又发生了什么”，而是要判断：

- 哪些变化和自己有关。
- 哪些变化会影响客户、团队、预算和业务流程。
- 哪些方向值得继续看。
- 哪些方向还只是热闹。

### 3.2 产品价值

原先“帮用户看清 AI 变化背后的客户、场景、付费、证据、风险和时机”的表达太机械，也容易被数据源约束掏空。

当前更现实的价值表达：

- 帮用户理解变化背后的原因。
- 判断变化带来的商业影响。
- 观察潜在趋势。
- 对照市面上的同类产品和相邻案例。
- 估计客户需求和场景进入 AI 的进程。
- 在有可靠来源时补充付费数据、市场规模和资本数据。

凡是没有实际数据源支撑的变量，不硬写；写“暂无公开信息”或“暂未监测到同类案例”。

### 3.3 证据与来源

所有前台事实、数据、融资、客户案例、产品发布、监管、观点和参数必须标注：

- 来源名。
- 来源等级。
- 原始外链。
- 本地 Raw 快照。
- 来源提供的增量事实。
- 证据缺口。

“可信边界度”不对外展示，进入后台证据门槛。前台只展示自然表达的来源状态和观察边界。

## 4. 前台栏目体系

V2 当前一级导航：

```text
今日观察 / 商业信号 / 趋势追踪 / 商业内参
```

降级与后台化：

- The Point 降级为 `前沿观点`，不作为一级导航，但保留聚合页和详情页。
- 机会判断不作为一级导航，进入趋势追踪和商业内参的文章段落。
- Scoring / Priority Engine 后台化，不进入普通前台。
- Tags 不作为一级导航，作为搜索、筛选和关系网络能力。
- Admin 仅后台入口，不进入普通用户导航。

## 5. 栏目定义

### 5.1 今日观察

今日观察是每天必读的一篇文章，不是变化卡小样本统计。

定位：

- 一篇当天 AI 商业行情综述。
- 读完能知道今日市场怎么动、为什么选这些变化、哪些只是讨论升温、哪些值得继续观察。
- 它基于当天 Raw 全量观察，而不是简单基于少数变化卡反推观点。

前台形态：

- 独立栏目页。
- 每日文章详情页。
- 文章与相关变化卡互相关联；卡片也可独立进入详情。
- 支持日期筛选、tags / 正式标签筛选和历史文章导航。

内容构成：

- 今日主问题。
- 开场场景或冲突，但不得生造案例。
- 当日市场判断。
- 变化展开。
- Builders / 前沿观点的自然露出。
- 风险和证据边界。
- 结尾按当天话题自然收束，不套固定说教框架。

### 5.2 商业信号

商业信号不是新闻列表，而是少数值得精读的商业变化库。

它承接今日观察中的精选变化，也为趋势追踪和商业内参提供可复盘的判断资产。

内容对象：

- 变化卡。
- 案例卡。
- 前沿观点。
- 来源和证据状态。
- 相关趋势 / 变化簇。

表达顺序：

1. 先讲事实 / 事件。
2. 再讲判断 / 商业含义。
3. 再挂结构化资产、案例、观点、来源和观察边界。

### 5.3 趋势追踪

趋势追踪不是卡片聚合页，而是：

```text
深度分析报告 + 变化簇 + 趋势卡
```

用户很难因为一张卡片产生认同，必须有专业分析：

- 行业分析。
- 赛道分析。
- 公司 / 竞品分析。
- 技术路线的商业含义。
- 客户需求。
- 商业案例。
- 风险与反证。

Trend Report 两种形态：

- `flash` 趋势快报：突发升温时的临时深读，2000-3500 字。
- `full` 深度报告：完整商业研究，6000-10000 字。

趋势报告 writer 每次最多产出 1 篇；证据不足时必须输出 `no_report_decision`。

### 5.4 商业内参

商业内参更像刊物，不是每日观察或趋势报告的照搬。

节奏：

- 周刊 / 半月刊 / 月刊均可。
- 内容不足时宁可降低频率，不硬凑。

定位：

- 对一个周期内的观察、案例、趋势、观点和风险做重新融合。
- 形成修正后的组合判断。
- 给出下个周期要观察的变量。

它是一篇刊物式长文，不是结构化页面。

## 6. 前沿观点口径

所有 builders 相关前台名称统一为：

```text
前沿观点
```

观点卡核心三要素：

1. 人物 / 机构。
2. 当时 title / 身份。
3. 原文摘录和原文出处。

观点卡不以观点摘要为核心。已有观澜解读时，不再用摘要替代原文。

观点状态如“新观点 / 延续 / 转向 / 分歧 / 被验证 / 被反证”放后台。前台如果要讲时间线变化，应以人物连续言论的自然解读呈现。

时间窗口：

- 周为主要观察单位。
- 30 天 / 90 天用于优化和复盘。

观点不能作为事实主证据，只能校准判断、说明行业预期或触发线索。

## 7. 内容与写作风格

用户明确要求：减少 AI 味，少空话套话。

当前写作风格：

```text
冷静、有判断、有温度的商业内参风。
```

写作者气质：

- 像商业记者。
- 像资深专栏作家。
- 有事实、有判断、有经营颗粒度。
- 不只写公司、行业、技术，也写具体的人、场景和冲突。

硬规则：

- 禁用“首先 / 其次 / 最后 / 值得注意的是 / 显而易见 / 不可否认 / 总而言之 / 综上所述 / 由此可见”。
- 三个 writer 正文禁用作者自己的“XX感 / XX性 / XX化”抽象名词。
- 不写空泛趋势词，不写内部流程语言。
- 标题必须短、准、完整，不能截断成半句话。
- 文章必须有起承转合，不能堆砌卡片内容。
- 场景不得生造；Raw 里有真实案例才引用，没有就不要装作现场。
- 结尾根据当天话题收束，不强行教育老板该做什么。

## 8. 数据资产与知识库

知识库不是每日 Raw 仓库，而是长期判断资产主库。

当前主资产：

- 变化卡。
- 案例卡。
- 观点卡。
- 趋势卡。
- 变化簇。
- 来源库。
- 人物库。
- 公司 / 机构库。
- 发布索引。

变化卡是知识库母体，但不能薄：

- 必须有事件。
- 必须有原始出处。
- 必须有数据来源或“暂无公开信息”。
- 必须有技术路线 / 方法变化的商业含义。
- 必须有同类产品 / 相邻案例或“暂未监测到同类案例”。
- 必须关联 Raw / Pool / 案例 / 观点 / 趋势。

## 9. Raw / Pool / 证据规则

Raw 已升级为：

```text
原始证据仓库 + 内容加工入口
```

Raw 必须尽量保存：

- 原文全文 `full_text`。
- 清洗文本 `clean_text`。
- Markdown 快照。
- HTML / 截图路径。
- 原始 URL / canonical URL。
- 抓取质量。
- 去重和版本字段。
- 结构化关键摘录。
- 商业要素。
- `evidence_seed`。
- `missing_information`。

Pool 是候选分流层，不是事实正文。

事实资产核心门槛：

```text
has_full_text=true
extraction_quality=high|medium
source_level=S|A|B
```

C / M / 社区 / 聚合来源可以触发检索，但不得单独支撑事实资产。

AI HOT 定位：

- 主发现入口。
- 必须回源抓取原始页面。
- AI HOT 自身不是事实主证据。

follow-builders：

- 每日全量进入前沿观点候选。
- 观点可校准判断，但不证明事实。

## 10. 每日监测与六线程自动化

当前生产口径拆为六个逻辑线程：

1. `guanlan-daily-monitor`：广泛监测、去重、来源分布、Raw / Pool。
2. `asset-card-generator`：生成变化卡、案例卡、观点卡候选和关联。
3. `daily-observation-writer`：写今日观察长文。
4. `case-signal-researcher`：补充案例、同类产品、市场竞争和二搜资料。
5. `trend-report-writer`：写趋势追踪深度报告并更新趋势卡。
6. `brief-periodical-writer`：写商业内参周期刊物。

三段式默认策略：

```text
默认：AI HOT 全量 + follow-builders + 关键词补齐。
不足：启动搜索。
重要卡片：强制回源补证。
```

不再兼容旧 V1 任务和旧日更链路。

## 11. 关键词与来源结构

关键词不应只覆盖几个大赛道，也不应只搜大公司。

四类信号必须覆盖：

- 成熟信号：大企业、大融资、并购、平台发布。
- 早期信号：pre-seed、seed、angel、grant、YC、spinout。
- 技术迭代信号：成本、能力、部署、协议、工具链。
- 开发者生态信号：开源、SDK、框架、插件市场、GitHub 采用。

P0 / P1 词是锚点，不是边界。要避免内容全部集中在 OpenAI、Google、Microsoft、Anthropic、Meta、NVIDIA 等大企业。

keyword-search 必须多路搜索：

- 官方原始路径。
- 开发生态路径。
- 资本与创业公司路径。
- 行业落地路径。
- 采购 / 招投标 / Marketplace 路径。
- A 级媒体 / GDELT 路径。
- 社区反馈路径。

## 12. 前台页面方向

前台页面是一个独立大模块，后续要整体推进。

已确认：

- 首屏基础样式先不推翻。
- 首页定位语使用：“从 AI 热点里，看见商业变化。”
- 首页今日观察要成为主角，是每日市场综述的大文章入口。
- 商业信号模块不再照旧卡片墙，应突出主信号与信号简报的主次关系。
- 页面需要保持 VI，不做赛博、霓虹、数据大屏或装饰图堆砌。
- 所有页面标题、字号、行高、间距必须遵循首页 / 今日观察已确认的字体规范。

商业信号页面已多次调整，但仍有遗留：旧卡片内容薄，前台支撑不足。后续要等 Raw 回填和卡片补厚后再做稳定页面重构。

## 13. 已固化 / 已修改的主要文档

本轮 grill-me 100+ 题后的口径已分散固化到以下文件：

- `AGENTS.md`
- `agent-workflow/governance/current-context.md`
- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/raw-evidence-schema.md`
- `agent-workflow/product/pool-routing-rules.md`
- `agent-workflow/product/daily-monitoring-playbook.md`
- `agent-workflow/automation-prompts/writer-style-guide.md`
- `agent-workflow/automation-prompts/guanlan-daily-monitor.md`
- `agent-workflow/automation-prompts/asset-card-generator.md`
- `agent-workflow/automation-prompts/daily-observation-writer.md`
- `agent-workflow/automation-prompts/case-signal-researcher.md`
- `agent-workflow/automation-prompts/trend-report-writer.md`
- `agent-workflow/automation-prompts/brief-periodical-writer.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/knowledge/README.md`

相关阶段报告包括：

- `agent-workflow/reports/wavesight-strategy-reframe-2026-05-12.md`
- `agent-workflow/reports/wavesight-grill-80-120-solidification-2026-05-14.md`
- `agent-workflow/reports/wavesight-six-automation-threads-2026-05-14.md`
- `agent-workflow/reports/wavesight-writer-style-update-2026-05-14.md`
- `agent-workflow/reports/wavesight-trend-report-template-urgent-candidate-2026-05-15.md`
- `agent-workflow/reports/wavesight-trend-report-writer-routing-rules-2026-05-15.md`
- `agent-workflow/reports/raw-evidence-schema-upgrade-2026-05-17.md`
- `agent-workflow/reports/pool-routing-rules-alignment-2026-05-18.md`
- `agent-workflow/reports/WSD-20260518-raw-pool-card-rules-closeout.md`

## 14. 验证结果

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
- 最近报告：`agent-workflow/reports/quality-gates-syntax-2026-05-18-20260518-063409.md`。

未运行：

- 浏览器 / 页面验收：不适用，本 closeout 是战略与产品口径收束，不是页面实现验收。
- 旧资产迁移验证：不适用，旧资产迁移另派。

## 15. 风险与遗留

### 15.1 旧资产与新口径未完全迁移

现有旧变化卡、案例卡、观点卡普遍缺少新版 Raw 回源字段。它们不能直接支撑新前台事实资产和趋势判断。

建议另派：

- 旧变化卡 schema 迁移 + Raw 回填。
- 旧案例卡 schema 迁移 + Raw / 二搜补证。
- 旧观点卡 schema 迁移 + 原文摘录 / capture_scope 回填。

### 15.2 writer 已改规则，但真实文章仍需重跑

写作规范已经更新，但部分既有文章仍保留旧 AI 味、结构拼接、标题生硬、结尾说教、证据展开不足等问题。

建议另派：

- 按新规范重跑 2026-05-16 / 2026-05-17 / 2026-05-18 今日观察。
- 按新模板重新生成商业信号前台内容。

### 15.3 前台页面还需基于新内容重构

用户已指出商业信号模块和详情页存在左侧空、右侧重、标题生硬、文案机械、字号混乱等问题。部分页面已修，但后续应在卡片补厚后统一重构。

建议另派：

- 商业信号首页模块二次设计。
- 商业信号栏目页重构。
- 商业信号详情页重构。
- 前沿观点聚合页和人物时间线页设计。

### 15.4 工作区 dirty 很大

当前工作区存在大量历史删除、生成文件和未跟踪报告。本 closeout 只覆盖 grill-me 100+ 题带来的战略与产品口径收束，不代表验收全部 git dirty 状态。

## 16. 建议主调度窗口下一步

1. 验收本 closeout，回填进度和看板。
2. 将本 closeout 与 `WSD-20260518-raw-pool-card-rules-closeout.md` 一起作为 V2 当前口径总入口。
3. 新增任务：旧资产 schema 迁移与 Raw 回填。
4. 新增任务：按新规则重跑 `asset-card-generator` 和 `daily-observation-writer`。
5. 新增任务：基于补厚卡片重构商业信号前台页面。

## 17. 推荐验收结论

推荐：`accepted`。

理由：本轮目标是把 grill-me 100+ 题形成的战略与产品调整整理为主调度可接管的总收口。核心定位、栏目、内容形态、写作风格、数据证据、自动化线程和遗留任务已明确；后续执行任务可以围绕本 closeout 拆分。 

## 18. 调度中枢验收记录

- 验收时间：2026-05-18
- 验收结论：`accepted`
- 本文件与 `WSD-20260518-raw-pool-card-rules-closeout.md` 合并作为 V2.1 当前基座。
- 已按新基座清理活文档中的旧冲突口径：旧 `daily-monitor-router`、`v2-content-site-daily-update`、`unified-site-sync`、V2.0 当前版本号、V1 归档路径和前台 `可信边界` 表达。
- 网站版本已升级为 `V2.1`。
- 后续执行任务不得再以旧“新闻资讯 / 机会列表 / 评分前台化 / V2.0 同步闸门”作为当前依据。
