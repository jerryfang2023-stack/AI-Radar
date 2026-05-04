# 任务确认稿：Trends 趋势模块优化

更新时间：2026-05-02  
状态：待用户确认  
PM Owner：PM Agent  
第一责任 Agent：Trend Intelligence Agent  
协作 Agent：Data Agent / UI-UE Agent / Copy Agent / Dev Agent / QA Agent  
执行规则：使用长期 agent 岗位，不新建临时 agent

## 1. PM 检查结果

Trends 模块已有任务描述，分布在以下文档：

- `prd/active/PRD-004-trends-model.md`
- `product/trend-model.md`
- `feature_list.json` 中的 `GL-M1-006`
- `execution/pm-next-sprint-2026-05-02.md` 中的 `P1-1：Trends 趋势详情页`

现有定义是正确的：Trends 不是趋势名称列表，而是判断某个 AI 方向是否正在形成商业势能的模型。

## 2. 当前问题

当前 Trends 的风险是：

- 页面容易停留在“上升 / 下降 / 震荡”的简单描述。
- 趋势卡与 Signals、Opportunities 的关系还不够直观。
- 趋势详情页虽已存在，但还没有充分体现证据阶梯、反证点、机会温度。
- 对外阅读体验还不够像商业内参，更像数据列表。

## 3. 本轮目标

把 Trends 从“趋势列表”升级为“趋势判断页”。

用户进入 Trends 时，应能快速看清：

- 哪些 AI 方向正在升温。
- 哪些方向出现分化。
- 哪些方向需要谨慎。
- 当前判断由哪些 Signals 支撑。
- 相关机会卡有哪些。
- 哪些反证可能削弱趋势判断。

## 4. 非目标

本轮不做：

- 不新增 Method 独立栏目。
- 不把 Trends 写成行业长文。
- 不输出确定性投资、经营或合作建议。
- 不把每个趋势都做成营销式“风口”。
- 不重做首页整体结构。

## 5. 建议模块结构

### Trends 列表页

建议从普通卡片列表改为趋势地图：

- 升温中
- 分化中
- 成熟化
- 风险变量
- 反证增强

每张趋势卡展示：

- 趋势名称
- 当前状态
- 一句话判断
- 7 / 30 天变化
- 代表 Signal
- 关联机会卡数量

### Trend 详情页

建议固定为商业内参结构：

- 趋势一句话判断
- 当前状态
- 证据阶梯
- 机会温度
- 最近变化
- 相关 Signals
- 相关 Opportunities
- 风险与反证

## 6. 数据字段需求

Data Agent 需要先确认或补齐：

- `trend_id`
- `slug`
- `title`
- `track`
- `status`
- `summary`
- `evidence_ladder`
- `adoption_stage`
- `opportunity_temperature`
- `counter_evidence`
- `related_signal_ids`
- `related_opportunity_ids`
- `updated_at`

如果旧趋势文档暂时没有完整字段，允许同步脚本先根据现有 `7天趋势 / 30天趋势 / 判断 / 具体产品` 自动推断。

## 7. 文案规则

Copy Agent 需要遵守：

- 用“正在升温”“出现分化”“证据增强”“反证需要保留”等克制表达。
- 每个趋势必须解释为什么。
- 不使用“必然爆发”“确定性机会”“风口已来”等绝对化表达。
- 有观点，但不替客户下最终判断。

## 8. UI 规则

UI / UE Agent 需要遵守：

- 趋势页要像商业判断地图，不像后台表格。
- 列表页先给状态分层，再给具体趋势。
- 详情页主阅读区展示判断和证据，侧栏展示关联机会和反证。
- 少用堆叠小卡片，避免信息碎片化。
- 移动端优先保证趋势判断、状态和证据链可读。

## 9. Agent 分工

### Trend Intelligence Agent

主责趋势模型解释和趋势状态判断。

交付物：

- 3 个趋势样例重构
- 趋势状态判定规则
- 反证表达规则

### Data Agent

主责字段和同步关系。

交付物：

- trend 字段补齐规则
- trend 与 signal / opportunity 的关联规则
- 缺失字段检查规则

### UI / UE Agent

主责页面结构。

交付物：

- Trends 列表页结构
- Trend 详情页结构
- 桌面端 / 移动端验收点

### Copy Agent

主责对外表达。

交付物：

- 趋势卡文案模板
- 趋势详情页文案模板
- 禁用词清单

### Dev Agent

等前面输出后执行。

交付物：

- 同步脚本字段增强
- Trends 页面优化
- Trend 详情页优化
- 关系字段展示

### QA Agent

最后验收。

交付物：

- 趋势字段完整性检查
- 趋势与 Signals / Opportunities 关系检查
- 页面可读性检查

## 10. 验收标准

本任务通过必须满足：

- 每个 Trend 有状态、判断、证据、反证或风险边界。
- 每个 Trend 至少关联 1 条 Signal 或 1 个 Opportunity。
- Trend 详情页有独立 URL。
- Trends 页面不是简单趋势名称堆砌。
- 首页和 Daily 只引用精选趋势，不堆叠全部趋势。
- 文案不出现绝对化结论。

## 11. 建议下一步

确认后，先交给 Trend Intelligence Agent 和 Data Agent：

1. 抽样重构 3 个趋势。
2. 定义 trend 字段补齐和推断规则。
3. 再交给 UI / Copy / Dev 做页面优化。

