# <任务名称> Plan

日期：YYYY-MM-DD  
owner：`pm` / `<agent-id>`  
状态：draft / pending_approval / approved / in_progress / passed / blocked

## 1. 背景

说明为什么需要做这个任务。  
如果来自用户请求、QA 发现、自动化失败、商业化需要或战略调整，写清来源。

## 2. Strategy 判断

本任务是否符合观澜AI定位：

- 是否服务“面向商业决策者的 AI 机会判断系统”。
- 是否会把产品拉回新闻站、工具站、公司榜或后台系统。
- 应进入前台、后台，还是内部能力。
- 为什么现在做 / 为什么暂不做。

## 3. PM 目标

本轮要达成什么：

- 目标 1
- 目标 2
- 目标 3

## 4. 非目标

本轮明确不做什么，避免范围膨胀：

- 非目标 1
- 非目标 2
- 非目标 3

## 5. 涉及范围

### 页面 / 产品模块

- 首页 / Daily Brief / Signals / The Point / Opportunities / Trends / Admin / 会员页 / 其他

### 数据与内容源

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-Point/`
- `07-Opportunities/`
- 其他

### 脚本与自动化

- `04-Site/scripts/sync-data.mjs`
- `04-Site/scripts/check-relations.mjs`
- `04-Site/scripts/check-point-quality.mjs`
- `agent-workflow/tools/unified-site-sync.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`
- 其他

## 6. 输入文件

- `AGENTS.md`
- `docs/agent-handoff.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/plan-first-policy.md`
- `agent-workflow/governance/quality-gates.md`
- 其他与本任务相关文件

## 7. 输出文件

- `agent-workflow/reports/<task>-YYYY-MM-DD.md`
- `agent-workflow/product/<model>.md`
- `agent-workflow/prd/active/<prd>.md`
- `agent-workflow/execution/<task>.md`
- 其他

## 8. 长期 Agent 分工

| Agent | 任务 | 输出 |
|---|---|---|
| Strategy Agent | 判断战略边界 | 战略判断 |
| PM Agent | 拆任务、定验收 | PRD / 执行计划 |
| Intelligence Data Agent | 字段、关系、质量规则 | 数据模型 / 复核清单 |
| UI / UE Agent | 页面结构与体验 | 页面结构 / 截图验收建议 |
| Copy Agent | 对外表达 | 文案规则 / 禁用语 |
| Dev Agent | 实现脚本或页面 | 代码改动 / 验证结果 |
| QA Agent | 独立验收 | 验收报告 / 风险等级 |
| Workflow Agent | 记录进度和交接 | progress / handoff / reports |

## 9. 自动化影响检查

本任务是否影响自动化：

- [ ] Markdown 文件命名、目录或 frontmatter
- [ ] Signal / Priority / Trend / Opportunity / Point 字段规则
- [ ] `sync-data.mjs`
- [ ] `check-relations.mjs`
- [ ] `check-point-quality.mjs`
- [ ] `unified-site-sync.mjs`
- [ ] The Point 来源、素材笔记、原文/译文、授权说明
- [ ] 每日商业雷达机会拆解、评分表、趋势或机会卡生成规则
- [ ] 自动化时间线、入站顺序、备份、回滚或发布闸门
- [ ] 不影响自动化

如果有影响，必须说明：

- 影响哪些任务：`ai-the-point` / `ai-2` / `ai-3`
- 是否需要更新自动化提示词或执行文档
- 是否需要用户确认

## 10. Quality Gates

计划运行的检查：

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs content`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs point`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs site`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs all`
- [ ] 浏览器截图 QA
- [ ] 多身份权限 QA
- [ ] 其他

未计划运行的检查及原因：

- 检查项：
- 原因：
- 风险：

## 11. 验收标准

- 验收标准 1
- 验收标准 2
- 验收标准 3

## 12. 风险与降级

| 风险 | 影响 | 降级路径 | Owner |
|---|---|---|---|
|  |  |  |  |

## 13. 是否需要人工确认

- [ ] 不需要，agent 可直接执行
- [ ] 需要用户确认后执行

需要确认的问题：

1. 
2. 
3. 

## 14. 完成后回填

完成后必须更新：

- [ ] `agent-workflow/feature_list.json`
- [ ] `agent-workflow/progress.md`
- [ ] `docs/agent-handoff.md`
- [ ] `agent-workflow/reports/*.md`
- [ ] `agent-workflow/governance/agent-memory.md`
- [ ] 其他
