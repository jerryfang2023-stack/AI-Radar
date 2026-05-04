# Intelligence Data Agent 升级与任务分派

日期：2026-05-03  
owner：`data-agent` / `pm-agent`  
状态：已立项，进入长期执行

## 1. 背景

本轮决定在不改变当前 8 个长期 agent 结构的前提下，将原 `Data Agent` 升级为 `Intelligence Data Agent`。

升级目标不是增加一个新临时 agent，而是把 Data Agent 从“字段、标签、质量报告维护者”提升为“观澜AI判断资产建模负责人”。

## 2. 战略判断

观澜AI的长期竞争力不只来自每日内容生产，而来自持续积累和校验以下资产：

- 商业信号证据。
- 建造者观点证据。
- 机会优先级判断。
- 趋势状态与反证。
- 来源、关键词、人物和标签网络。
- Signal / Priority / Trend / Opportunity / Point 的关系图谱。

因此，Intelligence Data Agent 应成为观澜AI护城河的底层维护者。

## 3. 岗位变化

已更新：

- `agent-workflow/agents/data-agent.md`
- `agent-workflow/agents/agent-registry.json`

保持不变：

- agent id 继续使用 `data-agent`。
- 不新增临时 agent。
- 不替代 Strategy、PM、Copy、UI/UE、Dev、QA、Workflow 的职责。

## 4. P0 任务

### P0-1：关系软提醒收口

输入：

- `agent-workflow/reports/relation-check-latest.md`
- `04-Site/data/radar-data.json`
- `01-Signals/`
- `02-Scoring/`
- `03-Trends/AI趋势总表.md`
- `07-Opportunities/`

目标：

- 处理当前关系检查中的软提醒。
- 优先补齐 `Priority -> Signal`、`Signal -> Trend`、`Trend -> Signal`、`Opportunity -> Priority`。

输出：

- `agent-workflow/reports/intelligence-data-relation-review-2026-05-03.md`
- 需要 Dev 自动化的规则清单。

验收：

- 关系检查硬错误继续为 0。
- 每类软提醒都有处理结论：补齐、观察、暂不处理或需人工确认。

### P0-2：The Point Intelligence 质量规则固化

输入：

- `agent-workflow/product/the-point-model.md`
- `05-Point/`
- `05-Point/sources/`
- `agent-workflow/reports/the-point-quality-check-latest.md`

目标：

- 将 The Point 当前质量规则固化为 Intelligence Data Agent 的长期规则。
- 覆盖同人多观点、来源去重、素材笔记、原文/译文完整性、短链清理、speaker/timecode 清理、授权说明。

输出：

- `agent-workflow/reports/intelligence-data-point-rules-2026-05-03.md`
- 给 Dev Agent 的 `check-point-quality.mjs` 后续增强建议。

验收：

- The Point 观点能稳定关联来源、人物、主题、趋势或机会。
- 不把摘要、观澜判断或截断句冒充原文/译文。

### P0-3：Signal / Trend / Opportunity 统一判断资产清单

输入：

- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/opportunity-priority-schema.md`
- `agent-workflow/product/relation-check-schema.md`

目标：

- 统一三类判断资产的最小合格标准。
- 明确哪些内容进入前台，哪些进入观察池，哪些进入后台候选，哪些标记为噪音。

输出：

- `agent-workflow/product/intelligence-data-model.md`

验收：

- Signal、Trend、Opportunity、Point 的入库标准不互相冲突。
- PM、Copy、Dev、QA 都能基于该文件继续执行。

## 5. P1 任务

### P1-1：Tags 字典化

目标：

- 建立正式 `tag-taxonomy.md`。
- 将标签分为赛道、职能、客户、场景、阶段、地域、证据、行动、人物/观点等层。
- 避免标签墙和同义词膨胀。

输出：

- `agent-workflow/product/tag-taxonomy.md`
- 标签合并、别名和候选移除清单。

### P1-2：关键词与来源质量周报

目标：

- 建立每周 Signal 关键词、来源和人物池质量报告。
- 识别高产词、低效词、噪音来源、新增候选来源和降权来源。

输出：

- `agent-workflow/reports/signal-quality-weekly-YYYY-WW.md`

### P1-3：Opportunity 证据覆盖率提升

目标：

- 对早期无评分证据或证据弱的机会卡进行复核。
- 判断补评分、补 Signal、降级观察或合并到其他机会。

输出：

- `agent-workflow/reports/opportunity-evidence-coverage-YYYY-MM-DD.md`

## 6. P2 任务

### P2-1：数据智能月度校准

目标：

- 复盘过去 30 天 Signal、Point、Trend、Opportunity 的转化关系。
- 判断哪些高分 Signal 变成机会，哪些只是热度。
- 判断哪些 Point 形成趋势共识或分歧。

输出：

- `agent-workflow/reports/intelligence-model-calibration-YYYY-MM.md`

### P2-2：判断资产图谱

目标：

- 为未来趋势地图、标签网络、企业版简报和样例报告准备关系图谱。

输出：

- 图谱字段建议。
- Dev 实现影响评估。

## 7. 与其他长期 Agent 的交接

| Agent | 交接内容 |
|---|---|
| Strategy Agent | 判断资产是否仍服务“AI机会判断系统”，是否偏离为新闻站或工具站 |
| PM Agent | 将 Intelligence Data 输出转成 PRD、任务批次和验收标准 |
| UI/UE Agent | 根据数据关系定义页面结构、筛选和关联网络 |
| Copy Agent | 根据数据智能判断写对外表达，不暴露字段、同步、脚本等后台语 |
| Dev Agent | 实现同步解析、质量检查、关系检查和自动化脚本 |
| QA Agent | 独立验收硬错误、软提醒、权限边界、移动端和前台表达 |
| Workflow Agent | 记录任务状态、报告、失败原因和下一轮交接 |

## 8. 验收标准

- `data-agent` 已在注册表中升级为 `Intelligence Data Agent`。
- 不新增临时 agent。
- 相关任务已写入 `feature_list.json`。
- 每个 P0 任务都有输入、输出和验收标准。
- 下一轮任何 Data Agent 工作都应按 Intelligence Data Agent 岗位说明执行。
