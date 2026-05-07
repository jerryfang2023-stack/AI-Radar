# WSD-20260505-02 Closeout

任务：日常监测算法 v2 测试管线  
日期：2026-05-05  
执行窗口：PM / Data / Workflow / Dev / UI / Copy / QA 协作  
建议状态：accepted

## 1. 做了什么

建立了日常监测算法 v2 测试管线：

- 原始采集样例 36 条。
- 初筛入池 12 条。
- 结构化入库 8 条，均完成 6 维度分析。
- 前台测试展示 3 条，均补二次搜索来源。
- 深挖机会卡 1 条，包含行动地图。
- 趋势归类 5 条，并写入测试趋势数据库。
- 新建 `signal-lab.html` 测试页，不替换正式 Signals 栏目。

根据用户后续反馈，已补充 PM Agent 与 Intelligence Data Agent 联合规则：网页展示不急，当前优先把从入库到精选、再到深挖的内容标准立起来。精选 3 条 Signal 必须写成短深度信号文章；深挖机会必须升级为内参级深度报道，而不是泛泛机会卡。

## 2. 改动文件

新增：

- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/reports/daily-monitoring-v2-test-pipeline-2026-05-05.md`
- `06-content/README.md`
- `06-content/01-raw/2026-05-05-raw-candidates.md`
- `06-content/02-pool/2026-05-05-signal-pool.md`
- `06-content/03-structured-signals/2026-05-05-structured-signals.md`
- `06-content/04-selected-signals/2026-05-05-front-signals.md`
- `06-content/08-opportunities/deep-dive/2026-05-05-opportunity-deep-dive.md`
- `06-content/05-trend-chain/2026-05-05-trend-classification.md`
- `06-content/10-databases/trends/trend-database.md`
- `04-Site/signal-lab.html`
- `04-Site/data/signal-lab-data.json`
- `04-Site/data/signal-lab-data.js`
- `04-Site/scripts/sync-signal-lab.mjs`
- `提示词/日常监测算法V2测试.md`
- `agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-manual-runbook.md`
- `agent-workflow/reports/WSD-20260505-02-signal-lab-desktop.png`
- `agent-workflow/reports/WSD-20260505-02-signal-lab-mobile.png`

修改：

- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- `agent-workflow/execution/daily-automation-coordination-2026-05-03.md`
- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/execution/WSD-20260505-02-daily-monitoring-v2-test-pipeline.md`

## 3. PM 门禁 / WAVE / 模块决策

已完成。

- WAVE：W=3 / A=3 / V=2 / E=2 / 总分=10。
- 决策：原型验证 / 测试管线。
- 不进入正式 Signals 替换。
- 成熟条件：连续 7 天稳定产出、QA 通过、前台 3 条质量优于现有 Signals、另行派发正式入站任务。

详情见：

- `agent-workflow/product/daily-monitoring-algorithm-v2.md`
- `agent-workflow/reports/daily-monitoring-v2-test-pipeline-2026-05-05.md`

追加 PM 结论：

- v2 管线商业价值在于“更少但更深”的判断资产。
- 精选 3 条是内参候选，不是网页卡片。
- 深挖每天最多 1 篇，不满足证据门槛时应明确写“今日暂无足够证据支撑深挖内参”。

追加 Data 结论：

- Structured 入库必须形成可追溯判断单元。
- 精选 3 条必须体现二次搜索后的证据增强。
- 深挖内参必须至少 5 个来源，其中至少 2 个 S 级或一手来源，并列出反证和证据缺口。

用户补充的判断资产循环已写入规则：

```text
Trend -> Signal -> Insight -> Opportunity -> MVP -> Database -> Content -> User -> Feedback -> Signal
```

已新增：

- Insight 判断层。
- Point 观点层：一线观点输入，不作为事实证据直接加权。
- Builder 共识聚类：多个 Point 形成趋势共识。
- MVP 7-14 天验证层。
- Database 沉淀层：机会库 / 场景库 / 项目库 / 风险库。
- Content 分发层：内参 / 朋友圈 / 海报 / 短视频。
- Feedback 回流到 Signal 的规则。

已根据用户提供的角色提示词新增：

- Signal Selector 模板：用于从 filtered candidates 中选择 TOP 3。
- Opportunity Analyst 模板：用于从 TOP 3 中选择 1 个深挖机会。
- 新文件：`提示词/Signal精选与机会深挖V2.md`。

最新补充：

- `06-content/` 已优化为编号目录，按判断链路从 `00-inbox` 到 `12-feedback` 排列。
- 已明确每日交付物和建议字数：Raw 每条 30-80 字、Pool 每条 120-250 字、Structured 每条 700-1200 字、精选 Signal 每条 1200-1800 字、深挖内参 3000-6000 字。
- 已补充 Raw 原文归档规则：30-50 条 Raw 每条必须保存本地原文档案，路径为 `06-content/01-raw/originals/YYYY-MM-DD/R-xxx-source-title.md`；只有链接、没有本地原文档案的线索不得进入 `01-raw`。
- 已新增标签治理：`primary_title_family` 对齐现有栏目标题体系，`primary_trend_label` 服务趋势归类，`formal_tags` 只使用现有 tag taxonomy，`classification_labels` 和 `candidate_tags` 不直接迁移。
- 已新增手工启动口令：`启动：日常监测v2`、`启动：日常监测v2-采集`、`启动：日常监测v2-入库`、`启动：日常监测v2-精选`、`启动：日常监测v2-深挖`、`启动：日常监测v2-趋势`、`启动：日常监测v2-复核`。
- 新增 Trend Classifier 模板，每条 Signal 只归入 1 个 primary trend。
- 新增 Signal -> Trend 自动生成逻辑：Trend 由多个高质量 Signal 反复验证，不是普通分类标签。
- 明确检索分层：初筛靠广度，精选靠评分，深挖靠二次搜索和交叉验证。
- 精选 3 条每条必须查官网、融资/投资人、客户/案例/定价三类信息。
- 深挖机会卡必须查代表公司、融资信号、客户场景、商业模式、中国迁移卡点五类信息。
- 深挖机会卡结尾必须包含 `证据链` 和 `反向证据`。
- Opportunity 使用 10 分制评分，并加入反向扣分项。
- Signal 详情页后续按“标题 -> 评分 -> 趋势 -> 影响 -> 机会 -> 行动”的决策工具路径组织。

## 4. UI/UE 页面规范表

已完成。

- 页面类型：测试页 / 内部直达页。
- 页面目标：5 秒内看懂 v2 漏斗如何从热点筛出 3 条测试信号。
- 设计基准：`DESIGN.md` 商业情报桌面；参考用户提供的深色顶栏 + 白色研究工作台方向。
- 布局：左侧漏斗与趋势、主区 3 条 Signal 与机会卡、右侧二次搜索和淘汰原因。
- 移动端：单列堆叠，标题压缩，避免横向裁切。
- 前台边界：测试页不进入普通主导航，不展示后台编辑控件。

## 5. Copy 文案规范表

已完成。

- 页面标题：`AI 商业信号筛选`。
- 关键边界：`只进入 06-content 与测试页，成熟前不替换正式 Signals。`
- 未使用投资建议、确定性机会、经营命令或公开前台禁用语。
- Opportunity 标题未写公司名。

## 6. Dev 实现说明

已完成。

- `sync-signal-lab.mjs` 会检查 raw/pool/structured/front/deep dive 数量约束。
- 检查每条前台 Signal 至少 3 个二次来源。
- 检查每条前台 Signal 有 6 维度分析。
- 检查 deep dive 有行动地图。
- 只生成 `signal-lab-data.js`，不触碰正式 `radar-data`。

## 7. QA 验收

已运行：

- `node --check 04-Site/js/app.js`
- `node --check 04-Site/scripts/sync-signal-lab.mjs`
- `node 04-Site/scripts/sync-signal-lab.mjs`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`

通过：

- `sync-signal-lab` 成功输出 3 条前台测试 Signal。
- Quality Gates syntax 通过。
- 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-161030.md`

本轮补充验证：

- 已按新编号目录重新运行 `sync-signal-lab.mjs`。
- 已重新运行 `run-quality-gates.mjs syntax`，6 项语法检查通过，失败项 0。

截图：

- 桌面：`agent-workflow/reports/WSD-20260505-02-signal-lab-desktop.png`
- 移动：`agent-workflow/reports/WSD-20260505-02-signal-lab-mobile.png`

未运行：

- 未运行 `sync-data.mjs` 和生产 `unified-site-sync.mjs`，因为本任务明确禁止测试内容进入正式同步链路。
- 未做四种身份权限验收，因为 `signal-lab.html` 是直达测试页，不进入普通导航；后续若要纳入会员体系需另行派发权限 QA。

## 8. 自动化影响

本任务可能影响自动化任务。

- `ai-the-point`：不影响。
- `ai-2`：有影响；已新增 `提示词/日常监测算法V2测试.md` 和手工启动 Runbook，并在 `daily-automation-coordination-2026-05-03.md` 追加 v2 测试说明，但未改生产自动化本体。
- `ai-3`：不影响；未修改 `agent-workflow/tools/unified-site-sync.mjs`，测试内容不进入统一同步闸门。

补充说明：

- 已为 Codex 自动化准备每日监测 v2 提议，默认仍只写 `06-content/`。
- 手工启动优先使用项目口令，不依赖生产自动化。
- 下一轮自动化 / 手工采集必须补齐 Raw 本地原文；2026-05-05 测试样例若继续复用，应先回填 `originals`。

## 9. 风险与后续

- 当前样例用于测试管线验证，不代表正式每日内容质量已经稳定。
- 需要连续 7 天跑 v2 才能判断是否优于现有 Signals。
- 若后续要迁入正式 Signals，必须另行派发生产入站、关系检查、权限和 QA 任务。

## 10. 回到调度中枢

请在调度中枢窗口执行：

```text
收口：agent-workflow/reports/WSD-20260505-02-daily-monitoring-v2-test-pipeline-closeout.md
```
