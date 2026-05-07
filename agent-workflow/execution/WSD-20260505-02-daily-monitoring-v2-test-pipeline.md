# WSD-20260505-02-daily-monitoring-v2-test-pipeline 派发单

日期：2026-05-05  
状态：ready  
调度窗口：当前调度中枢窗口  
牵头 Agent：`pm / data / workflow / dev / qa`

## 0. 自动化影响提示

本任务可能影响自动化任务。

原因：本任务涉及日常监测算法、内容目录、Signal 筛选漏斗、机会卡生成数量、趋势归类和测试网页。执行窗口不得直接替换现有 `Signals` 栏目或破坏 `ai-2 / ai-3` 当前稳定链路。所有新能力先进入 `06-content/` 与测试页面，成熟后再由 PM / Data / QA 决定是否替代原 `01-Signals` 与前台 `signals.html`。

## 1. 任务目标

建立“日常监测算法 v2 测试管线”，把每日 AI 商业雷达从一次性生成 Signals，升级为分阶段漏斗：

1. 原始采集：30-50 条。
2. 初筛入池：10-15 条。
3. 结构化入库：5-8 条。
4. 前台测试展示：3 条高商业价值 Signal。
5. 深挖机会卡：每天最多 1 条。
6. 趋势归类：形成长期趋势数据库。

所有内容先进入 `06-content/` 分阶段内容库，并新建测试网页展示，作为测试项目运行；成熟前不替代现有 `Signals` 栏目。

## 2. 非目标

- 不替换现有 `01-Signals/` 日常内容源。
- 不替换现有 `signals.html` 正式栏目。
- 不改现有 `ai-3` 统一同步闸门的生产入站规则。
- 不把 5-8 条结构化候选全部推到前台。
- 不每天生成多张机会卡；每天最多 1 张深挖机会卡。
- 不输出投资建议、经营命令或确定性机会判断。
- 不新增正式前台一级栏目；测试页只能直达访问或 Admin / 内部链接访问。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 执行新增功能门禁和 WAVE 评分，确认这是测试管线而非正式栏目替换 |
| Intelligence Data Agent | 设计漏斗算法、评分权重、去重规则、二次搜索规则、趋势归类规则 |
| Workflow / Automation Agent | 更新测试运行说明、ai-2 影响说明、06-content 目录规范和回滚边界 |
| Dev Agent | 建立 06-content 解析 / 测试数据输出 / 测试网页，不触碰正式 Signals 入站 |
| UI / UE Design Director | 为测试页输出页面规范，保持内部测试但不粗糙 |
| Copy Agent | 定义测试页和 Signal / Opportunity 展示文案边界 |
| QA / Acceptance Agent | 验收目录、数据、测试页、二次搜索证据、自动化影响和不替换正式 Signals |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/agents/pm-agent.md`
5. `agent-workflow/agents/data-agent.md`
6. `agent-workflow/agents/workflow-agent.md`
7. `agent-workflow/product/signal-system.md`
8. `agent-workflow/product/source-intelligence.md`
9. `agent-workflow/product/priority-engine-2.md`
10. `agent-workflow/product/trend-model.md`
11. `agent-workflow/product/DESIGN.md`
12. `agent-workflow/product/COPY.md`
13. `提示词/监测提示词V4.0.md`
14. `提示词/关键词列表.md`
15. `04-Site/config/content-paths.json`

## 5. 允许改动范围

内容库与规范：

- `06-content/README.md`
- `06-content/01-raw/`
- `06-content/02-pool/`
- `06-content/03-structured-signals/`
- `06-content/04-selected-signals/`
- `06-content/08-opportunities/deep-dive/`
- `06-content/05-trend-chain/`
- `06-content/10-databases/`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md`
- `agent-workflow/reports/daily-monitoring-v2-test-pipeline-2026-05-05.md`

提示词 / 自动化说明：

- 可新增 `提示词/日常监测算法V2测试.md`
- 可更新 `agent-workflow/execution/daily-automation-coordination-2026-05-03.md` 的测试说明
- 如确需更新 `提示词/监测提示词V4.0.md`，必须保留当前生产口径，并以“V2 测试管线”小节追加，不得覆盖现有正式规则

测试网页与解析：

- `04-Site/signal-lab.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`，仅限测试页渲染
- `04-Site/data/signal-lab-data.json`
- `04-Site/data/signal-lab-data.js`
- 可新增 `04-Site/scripts/sync-signal-lab.mjs`

## 6. 禁止改动范围

- 不改 `01-Signals/` 正式内容源。
- 不改 `02-Scoring/` 正式评分源。
- 不改 `03-Trends/AI趋势总表.md` 生产趋势源，除非只在报告中提出后续迁移建议。
- 不改 `07-Opportunities/` 正式机会卡源。
- 不改 `04-Site/signals.html` 的正式栏目结构，除非只增加内部测试入口且需 PM 确认。
- 不改 `04-Site/scripts/sync-data.mjs` 的生产入站逻辑，除非先在报告中说明影响并等待调度确认。
- 不改 `agent-workflow/tools/unified-site-sync.mjs`。
- 不改自动化任务本体；如果无法直接更新实际自动化配置，必须写清替代文档和阻塞。

## 7. 需求定义

### 7.1 原始采集：30-50 条

来源范围：

- 海外 AI 新闻。
- 融资和并购。
- 产品发布和价格 / API / 文档变化。
- VC 观点和投向。
- Builder 观点。
- X / LinkedIn。
- Product Hunt。
- YC / accelerator / demo day。
- GitHub / Hugging Face / 云市场 / 插件市场。
- 垂直行业采购、试点、客户案例和监管。

每条原始候选必须记录：

- `raw_id`
- `date`
- `title`
- `source_url`
- `source_name`
- `source_tier`
- `source_type`
- `event_type`
- `track`
- `one_line_why_collected`
- `trigger_query`
- `collected_at`

输出位置：

```text
06-content/01-raw/YYYY-MM-DD-raw-candidates.md
```

### 7.2 初筛入池：10-15 条

过滤掉：

- 重复转载。
- 浅新闻。
- 工具教程。
- prompt 模板。
- 纯产品功能小更新且无商业信号。
- 无客户、流程、商业模式、成本、渠道、监管或生态变化的信息。

每条入池候选必须记录：

- `pool_id`
- `raw_ids`
- `dedupe_key`
- `commercial_signal_reason`
- `evidence_stage`
- `score_v2`
- `rejection_reason`，如从 raw 中被排除

输出位置：

```text
06-content/02-pool/YYYY-MM-DD-signal-pool.md
```

### 7.3 结构化入库：5-8 条

每条必须完成 6 维度分析：

1. 解决什么具体问题？
2. 目标客户是谁？
3. 替代或优化什么流程？
4. 商业模式是什么？
5. 为什么现在值得关注？
6. 是否可迁移中国市场？

每条还必须包含：

- 来源摘要。
- 商业信号解释。
- 反证 / 风险。
- 关联 Trend 候选。
- 关联 Opportunity 候选。
- 是否进入前台展示候选。

输出位置：

```text
06-content/03-structured-signals/YYYY-MM-DD-structured-signals.md
```

### 7.4 前台测试展示：3 条

从 5-8 条结构化候选中只选 3 条最有商业价值的 Signal，用于测试网页展示和未来内参候选。

要求：

- 必须二次搜索。
- 每条前台 Signal 至少补 3 个来源，优先 S/A/B 来源。
- C 级来源只能触发检索，不得单独支撑高价值 Signal。
- 必须形成更强的信号解释和观澜解读。
- 必须说明为什么另外 2-5 条结构化候选没有进入前台 3 条。

输出位置：

```text
06-content/04-selected-signals/YYYY-MM-DD-front-signals.md
```

测试网页：

```text
04-Site/signal-lab.html
```

测试数据：

```text
04-Site/data/signal-lab-data.json
04-Site/data/signal-lab-data.js
```

### 7.5 深挖机会卡：每天最多 1 条

从前台 3 条或结构化 5-8 条中选择最多 1 个方向做深挖机会卡。

要求：

- 必须二次搜索。
- 至少 5 个来源，优先包含一手来源、融资 / 客户 / 产品 / 垂直行业来源。
- 必须深挖：
  - 机会定义。
  - 目标客户。
  - 替代流程。
  - 付费方式。
  - 进入壁垒。
  - 竞争和替代方案。
  - 中国市场迁移判断。
  - 反证与风险。
  - 行动地图：可验证问题、应访谈客户、应观察指标、后续 7/30/90 天观察点。
- 不写投资建议，不写确定性机会。

输出位置：

```text
06-content/08-opportunities/deep-dive/YYYY-MM-DD-opportunity-deep-dive.md
```

### 7.6 趋势归类与长期数据库

所有结构化 Signal、前台 3 条和深挖机会卡都必须进入趋势归类。

输出：

```text
06-content/05-trend-chain/YYYY-MM-DD-trend-classification.md
06-content/10-databases/trends/trend-database.md
```

趋势库字段：

- `trend_id`
- `trend_name`
- `status`: emerging / warming / diverging / cooling / risk
- `related_signal_ids`
- `related_opportunity_ids`
- `evidence_stage`
- `counter_evidence`
- `last_seen`
- `notes`

## 8. 算法升级要求

### 8.1 漏斗分层

算法必须明确 4 层评分：

1. Raw Candidate Score：用于 30-50 条内部排序。
2. Pool Signal Score：用于筛到 10-15 条。
3. Structured Signal Score：用于筛到 5-8 条。
4. Front Signal Score：用于选 3 条前台测试展示。

### 8.2 建议权重

Front Signal Score 建议权重：

| 维度 | 权重 |
|---|---:|
| 商业证据强度 | 20 |
| 目标客户与流程清晰度 | 15 |
| 商业模式可解释性 | 12 |
| 为什么现在 | 12 |
| 来源质量与二次搜索强度 | 15 |
| 趋势 / 机会关联价值 | 12 |
| 中国市场迁移判断 | 7 |
| 反证与风险质量 | 7 |

Opportunity Deep Dive 评分必须单独设置，不得直接等同 Signal Score。

### 8.3 去重规则

必须包含：

- 公司 / 产品 / 事件三元去重。
- 同一融资新闻多来源合并。
- 同一产品发布与客户案例合并。
- 同一 Builder 观点不得冒充事实证据。
- 已进入正式 Signals 的内容在测试管线中标记 `already_in_production`。

### 8.4 二次搜索规则

进入前台 3 条和深挖机会卡前，必须执行二次搜索：

- 回找公司官网、产品页、公告、客户案例。
- 回找投资方、融资数据库、监管 / 采购 / 垂直行业来源。
- 查找反证来源。
- 记录新增来源和未找到的证据。

## 9. 产品功能门禁要求

本任务属于产品功能类 + 数据模型 + 自动化 + 页面类任务。

PM Agent 必须输出：

- 新增功能门禁记录。
- WAVE 评分。
- 模块决策表。

默认建议：

- 决策类型：原型验证 / 测试管线。
- 不进入正式 Signals 替换。
- 成熟条件：连续 7 天稳定产出、QA 通过、前台 3 条质量优于现有 Signals、ai-3 可安全入站。

## 10. 页面类要求

测试页 `signal-lab.html` 必须有：

- UI/UE 页面规范表。
- Copy 文案规范表。
- Dev 按表实现说明。
- QA 桌面 / 移动端截图。
- 前台边界说明：这是测试页，不进入普通主导航。

页面展示建议：

- 漏斗概览：30-50 / 10-15 / 5-8 / 3 / 1。
- 今日前台 3 条 Signal。
- 深挖机会卡 1 条。
- 趋势归类摘要。
- 来源质量与二次搜索说明。
- 不展示内部 prompt、原始噪音全文或后台编辑控件。

## 11. 必跑检查

- [ ] `node --check 04-Site/js/app.js`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 如新增脚本：`node --check 04-Site/scripts/sync-signal-lab.mjs`
- [ ] 如新增脚本：运行 `node 04-Site/scripts/sync-signal-lab.mjs`
- [ ] 检查 `06-content/` 目录结构和样例文件
- [ ] 检查测试页数据文件存在
- [ ] 浏览器桌面 / 移动端检查 `signal-lab.html`
- [ ] 确认未替换 `signals.html`
- [ ] 确认未修改 `ai-3` 生产闸门

未运行项必须说明原因和风险。

## 12. 自动化影响

- `ai-the-point`：默认不影响，但 Builder 观点可作为 raw 线索来源。
- `ai-2`：有影响。需要新增或更新测试管线说明，但不得破坏当前生产日更。
- `ai-3`：短期不影响。测试内容不得进入生产同步闸门；成熟后另行派发同步闸门升级。

## 13. 收口文件

执行窗口必须生成：

```text
agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md
```

收口文件必须写清：

- 做了什么。
- 改了哪些文件。
- 是否建立 `06-content/` 分阶段目录。
- 是否建立算法 v2 文档。
- 是否建立测试页与测试数据。
- 是否完成 PM 门禁 / WAVE / 模块决策表。
- 是否完成 UI/UE 页面规范表、Copy 规范表、Dev 实现说明、QA 截图。
- 是否运行检查。
- 哪些检查未运行及风险。
- 是否影响 `ai-the-point`、`ai-2`、`ai-3`。
- 是否建议调度中枢标记 accepted / blocked / failed。

## 14. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-test-pipeline.md
5. agent-workflow/product/signal-system.md
6. agent-workflow/product/source-intelligence.md
7. agent-workflow/product/priority-engine-2.md
8. agent-workflow/product/trend-model.md
9. agent-workflow/product/DESIGN.md
10. agent-workflow/product/COPY.md

你是本任务的独立执行窗口，由 PM Agent、Intelligence Data Agent、Workflow / Automation Agent、Dev Agent、UI / UE Design Director、Copy Agent、QA / Acceptance Agent 协作。

重要提醒：本任务可能影响自动化任务。新能力只进入 `06-content/` 与测试页，成熟前不得替换现有 `01-Signals` 或 `signals.html`。

任务目标：
建立日常监测算法 v2 测试管线：
- 原始采集 30-50 条。
- 初筛入池 10-15 条。
- 结构化入库 5-8 条，完成 6 维度分析。
- 前台测试展示 3 条，必须二次搜索并补强来源。
- 深挖机会卡每天最多 1 条，必须二次搜索并输出行动地图。
- 趋势归类进入长期数据库。
- 所有内容进入 `06-content/` 分阶段目录。
- 新建测试网页，不替换正式 Signals 栏目。

必须输出：
1. PM 新增功能门禁、WAVE 评分和模块决策表。
2. `06-content/` 目录结构与样例文件。
3. `agent-workflow/product/daily-monitoring-algorithm-v2.md`。
4. 测试页 `04-Site/signal-lab.html` 与测试数据。
5. 如需要，新增 `04-Site/scripts/sync-signal-lab.mjs`。
6. UI/UE 页面规范表、Copy 文案规范表、Dev 实现说明、QA 桌面 / 移动截图。
7. 自动化影响说明。

完成后生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md

完成后回到调度中枢窗口汇报：
收口：agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md
```
