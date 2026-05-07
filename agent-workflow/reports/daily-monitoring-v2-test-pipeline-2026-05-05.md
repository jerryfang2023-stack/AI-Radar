# Daily Monitoring Algorithm v2 Test Pipeline

日期：2026-05-05  
任务：`WSD-20260505-02-daily-monitoring-v2-test-pipeline`  
状态：test pipeline established

## 1. 本轮结论

已建立日常监测算法 v2 测试管线。根据后续 PM / Data 讨论，网页展示降为次要事项，当前优先建立内容规则：从 Structured 入库到精选 3 条 Signal，再到深挖内参，必须形成全面、详细、可复核的文字。

新能力只进入 `06-content/`，未替换正式 `01-Signals/`、`signals.html`、`sync-data.mjs` 或 `ai-3` 统一同步闸门。

测试样例满足：

- Raw：36 条。
- Pool：12 条。
- Structured：8 条。
- Front Signals：3 条。
- Opportunity Deep Dive：1 条。
- Trends：5 条归类，进入测试趋势库。

## 2. PM 门禁

| 门禁项 | 结论 |
|---|---|
| 功能名称 | 日常监测算法 v2 测试管线 |
| 功能类型 | 数据 / 自动化 / 测试页面 |
| 用户任务 | 今天看什么 / 为什么值得看 / 是否持续成立 |
| WAVE | W=3 / A=3 / V=2 / E=2 / 总分=10 |
| 决策 | 原型验证 / 测试管线 |
| 成熟条件 | 连续 7 天稳定产出、QA 通过、前台 3 条质量优于现有 Signals、另行派发正式入站任务 |

模块决策：新增 `Signal Lab` 测试页作为内部质量样张，不进入普通主导航，不替代正式 Signals。

## 3. Data 规则

已建立四层评分：

- Raw Candidate Score。
- Pool Signal Score。
- Structured Signal Score。
- Front Signal Score。

深挖机会卡使用独立 Opportunity Deep Dive Score，不直接等同 Signal Score。

已建立：

- 公司 / 产品 / 事件三元去重。
- 同一融资多来源合并。
- 同一产品发布和客户案例合并。
- Builder 观点不冒充事实证据。
- 已进入正式 Signals 时标记 `already_in_production` 的规则。
- 前台 3 条和深挖机会卡的二次搜索规则。

## 3A. PM / Data 追加讨论：从卡片到内参

PM Agent 结论：

- v2 管线的价值不是“更多信息”，而是“更少但更深”的判断资产。
- 精选 3 条 Signal 应成为今日信号内参候选，每条都要写成短深度信号文章。
- 深挖每天最多 1 篇，目标是内参级深度报道，可用于后续会员内容、闭门简报、行业报告和资源连接判断。
- 如果当天证据不足，宁可不写深挖，也不能硬凑机会分析。

Intelligence Data Agent 结论：

- Structured 入库必须可追溯、可回测、可关联，不是字段填充。
- 精选 3 条必须体现二次搜索后的证据增强。
- 深挖内参必须至少包含 5 个来源，其中至少 2 个 S 级或一手来源，并明确反证与证据缺口。
- 每篇深挖必须区分事实、推断、观澜判断和待验证问题。

已同步更新：

- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `提示词/日常监测算法V2测试.md`

## 3B. 判断资产循环

用户补充的流程已写入 v2 规则：

```text
Trend -> Signal -> Insight -> Opportunity -> MVP -> Database -> Content -> User -> Feedback -> Signal
```

PM / Data 共识：

- Trend 是上层方向：行业变化、资本流向、技术拐点。
- Signal 每日只精选 3 条，服务 Trend 和 Insight。
- Insight 是观澜核心判断，位于 Signal 与 Opportunity 之间。
- Opportunity 必须回答谁付钱、怎么做、能否迁移。
- MVP 是 7-14 天验证层，不是开发产品。
- Database 需要沉淀机会库、场景库、项目库、风险库。
- Content 是分发层，包含内参、朋友圈、海报和短视频。
- User 和 Feedback 是回流层，真实需求要反向修正 Signal、Trend 和 Opportunity。

已新增规则：

- Insight 判断层字段。
- Point 观点层模板和入链规则。
- MVP 验证层字段。
- Database 沉淀层要求。
- Content 分发层要求。

Point 补充口径：

- Point 是一线观点输入，不作为事实证据直接加权。
- Point 可以辅助 Insight、Trend 和 Opportunity 的判断边界。
- Point 进入 Opportunity 前必须经过 Signal、二次搜索和交叉验证。
- 已增加 Builder 共识聚类：至少 3 个独立 Point 指向同一趋势时，形成共识提炼和观澜判断。

## 3C. Signal Selector / Opportunity Analyst 模板

已将用户提供的两段角色提示词固化为执行模板：

- Signal Selector：从 filtered candidates 中选 TOP 3，必须强影响收入、成本或核心业务流程，且不能 3 条都来自同一子类。
- Opportunity Analyst：从 TOP 3 中选 1 个最适合深挖的机会，必须具备重复信号、商业潜力、真实场景和 7-14 天验证可能。

新增文件：

- `提示词/Signal精选与机会深挖V2.md`

同步更新：

- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `提示词/日常监测算法V2测试.md`

## 3D. 检索强度与趋势分类补充

已追加用户确认的检索分层：

```text
初筛靠广度，精选靠评分，深挖靠二次搜索和交叉验证。
```

精选 3 条 Signal 必须做轻量二次搜索：

- 公司 / 产品官网。
- 融资或投资人信息。
- 客户 / 案例 / 定价信息。

深挖机会卡必须做 5 类交叉验证：

- 代表公司。
- 融资信号。
- 客户场景。
- 定价 / 商业模式。
- 中国迁移卡点。

每张深挖机会卡最后必须补：

- `证据链`
- `反向证据`

同时新增 Trend Classifier：每条 Signal 只能选择一个 primary trend，避免趋势归类发散。

## 3D-2. Signal -> Trend 自动生成逻辑

已写入用户补充的 Signal -> Trend 链路规则。核心原则：

```text
Signal 是点，Trend 是由多个高质量 Signal 反复验证出来的方向。
```

关键规则：

- 每条 Signal 入库后先打 6 个标签：场景、技术、商业、影响对象、价值维度、迁移判断。
- 新 Signal 与已有 Trend 匹配时，看场景相似、工作流相似、商业信号相似和关键词相似。
- 新建 Trend 必须满足：过去 30 天相关高质量 Signal >= 3 条、来源类型 >= 2 种、平均 Signal 评分 >= 7.5，并能说明正在重构哪个岗位 / 流程。
- Trend Score 采用 10 分制：信号数量、信号质量、来源多样性、商业化强度、迁移可行性、增长速度。
- Trend 生命周期：萌芽期、起步期、加速期、爆发期、成熟期、衰退 / 泡沫期。
- 如果不能帮助老板提前判断岗位、流程、行业或商业模式的结构性变化，就不能叫 Trend，只能叫标签。

## 3E. Opportunity 10 分制与 Signal 决策路径

已新增机会卡 10 分制：

- 市场价值 20%。
- 痛点强度 15%。
- 付费意愿 15%。
- AI 适配度 15%。
- 迁移可行性 15%。
- MVP 可验证性 10%。
- 风险可控性 10%。

评级：

- S：9.0-10，值得重点跟踪，可进入项目库。
- A：8.0-8.9，值得关注，可做机会卡。
- B：7.0-7.9，入库观察。
- C：6.0-6.9，作为趋势信号保留。
- D：<6.0，不建议进入机会库。

已新增反向扣分项：强监管风险、平台封禁风险、交付过重、客户预算不确定、同质化严重。

同时补充 Signal 详情页核心路径：

```text
看标题 -> 看评分 -> 理解趋势 -> 判断影响 -> 看到机会 -> 产生行动
```

## 4. UI/UE 页面规范表

| 字段 | 规范 |
|---|---|
| 页面类型 | 测试页 / 内部直达页 |
| 页面目标 | 5 秒内看懂 v2 漏斗如何从热点筛出 3 条测试信号 |
| 设计基准 | `DESIGN.md` 商业情报桌面；参考用户给出的深色顶栏 + 白色研究工作台方向 |
| 布局基准 | 深色顶部标题区；三栏：左侧漏斗与趋势、主区 3 条 Signal 和机会卡、右侧二次搜索与淘汰原因 |
| 字体层级 | H1 移动端收缩；卡片标题 22-30px；正文 15-17px |
| 间距基准 | 卡片 8px 圆角；主区 18-24px 间距；移动端单列 |
| 组件克制 | 不展示内部 prompt、JSON、编辑、同步入口；不做正式栏目导航 |
| 前台 / Admin 边界 | 测试页直达访问，不进入普通主导航；不出现后台编辑控件 |
| 桌面验收点 | 三栏结构完整，3 条 Signal 可读，来源链接可见 |
| 移动验收点 | 单列堆叠，标题不遮挡，漏斗与趋势可继续向下阅读 |
| 禁止项 | 不做新闻流、公司榜、投资建议、确定性机会判断 |

## 5. Copy 文案规范表

| 字段 | 规范 |
|---|---|
| 页面任务 | 内部判断团队查看 v2 测试漏斗结果 |
| 目标理解 | 这是测试管线，不是正式 Signals 替换 |
| 页面标题 | `AI 商业信号筛选` |
| 关键文案 | `只进入 06-content 与测试页，成熟前不替换正式 Signals。` |
| 证据边界 | 前台 3 条必须标明二次来源；未入选候选要说明证据不足或边界 |
| 禁用语检查 | 未使用“入口、同步、字段、后台、证据链、强证据、机会确定、下一步验证”等公开前台禁用表达 |
| 标题适配 | 移动端标题已压缩，避免长句断行难看 |
| QA 文案验收点 | 不替用户下最终经营、投资或合作判断 |

## 6. Dev 实现说明

新增：

- `04-Site/signal-lab.html`
- `04-Site/scripts/sync-signal-lab.mjs`
- `04-Site/data/signal-lab-data.json`
- `04-Site/data/signal-lab-data.js`

修改：

- `04-Site/js/app.js`：新增 `renderSignalLabPage()`，只读取 `window.SIGNAL_LAB_DATA`。
- `04-Site/css/styles.css`：新增 `signal-lab` 页面样式。
- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md`：追加 v2 测试管线说明。

未修改：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/AI趋势总表.md`
- `07-Opportunities/`
- `04-Site/signals.html`
- `04-Site/scripts/sync-data.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`

## 7. QA 验收

已运行：

- `node --check 04-Site/js/app.js`
- `node --check 04-Site/scripts/sync-signal-lab.mjs`
- `node 04-Site/scripts/sync-signal-lab.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`

Quality Gates：

- 通过。
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-134331.md`

截图：

- 桌面：`agent-workflow/reports/WSD-20260505-02-signal-lab-desktop.png`
- 移动：`agent-workflow/reports/WSD-20260505-02-signal-lab-mobile.png`

QA 结论：

- 测试页能直达访问。
- 3 条前台 Signal 渲染正常。
- 1 张深挖机会卡渲染正常。
- `06-content/` 分阶段目录与样例文件存在。
- 未替换正式 Signals 栏目。
- 未修改 `ai-3` 生产闸门。

## 8. 自动化影响

本任务可能影响自动化任务。

- `ai-the-point`：不影响；Builder 观点可作为 raw 线索。
- `ai-2`：有影响；已新增 v2 测试提示词与协调说明，但未改生产自动化本体。
- `ai-3`：不影响；测试内容不进入统一同步闸门。

后续如要把 v2 管线迁入生产，必须另行派发 PM / Data / Dev / QA 任务。
