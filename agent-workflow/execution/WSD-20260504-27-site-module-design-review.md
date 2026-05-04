# WSD-20260504-27-site-module-design-review 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前调度中枢窗口  
牵头 Agent：`pm / ui-ue`

## 1. 任务目标

由升级后的 PM Agent 与 UI / UE Design Director 联合对观澜AI当前网站模块、页面体系和设计规范做一次系统梳理，输出“哪些模块应保留、强化、合并、后台化、隐藏、淘汰”和“哪些设计规范应升级、收敛、补充”的修改与优化意见。

本任务是规划与评审任务，不进入 Dev，不直接改页面代码。它应为后续 `P0-10` 全站 UI 方向、`P0-11` 首页右侧视觉资产、`P0-6` 前后台边界 QA、`P0-5` UI 截图矩阵提供上游判断。

## 2. 非目标

- 不直接修改 `04-Site/` 中任何 HTML、CSS、JS 或数据文件。
- 不生成首页海报图或最终视觉资产。
- 不新增前台栏目、后台模块或会员功能。
- 不改 Markdown 字段规则、同步脚本、关系检查脚本或自动化任务。
- 不把 `P0-2B` failed 结果当成可复用成功版本。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| PM Agent | 执行“宁缺毋滥”模块生命周期治理，输出模块决策表、WAVE 评分适用项和后续任务优先级 |
| UI / UE Design Director | 输出全站设计规范审计、页面母版建议、DESIGN v2 修改建议和审美阻塞项 |
| Strategy Agent | 校验模块与“面向商业决策者的 AI 机会判断系统”是否一致 |
| Copy Agent | 标记模块命名、栏目标题和前台表达中的内部话术 / 空泛表达风险 |
| QA / Acceptance Agent | 给出后续可验收的截图矩阵和阻塞项清单 |
| Workflow / Automation Agent | 记录收口、自动化影响和后续派发建议 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/agents/pm-agent.md`
5. `agent-workflow/agents/ui-ue-agent.md`
6. `agent-workflow/product/strategy-single-source.md`
7. `agent-workflow/product/column-architecture.md`
8. `agent-workflow/product/DESIGN.md`
9. `agent-workflow/product/COPY.md`
10. `agent-workflow/execution/dispatch-board.md`
11. `agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md`
12. `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`
13. `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`
14. `agent-workflow/prd/active/PRD-007-admin-console.md`

## 5. 允许改动范围

- `agent-workflow/reports/site-module-design-review-2026-05-04.md`
- `agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`
- 可选：`agent-workflow/product/DESIGN.md`，仅限追加“DESIGN v2 待采纳建议”小节；如不确定，先只写入报告，不改规范正文。
- 可选：`agent-workflow/product/column-architecture.md`，仅限追加“待 PM 确认的模块调整建议”小节；如不确定，先只写入报告，不改规范正文。

## 6. 禁止改动范围

- 不改 `04-Site/`。
- 不改内容源 Markdown。
- 不改 `04-Site/scripts/`、`agent-workflow/tools/unified-site-sync.mjs`、`check-relations.mjs`、`check-tags.mjs`。
- 不改自动化任务配置或提示词。
- 不改 Netlify 配置。
- 不回滚、不删除、不覆盖其他窗口已有修改。

## 7. 预期输出

主报告：

- `agent-workflow/reports/site-module-design-review-2026-05-04.md`

报告必须包含：

1. 当前网站模块地图：前台、会员/账号、Admin、后台判断引擎、自动化相关能力。
2. PM 模块生命周期决策表：至少覆盖首页、Daily Brief、Signals、The Point、Opportunities、Trends、Priority Engine、Tags/Search、登录注册、Pricing/Account、Admin。
3. 对每个模块给出：保留 / 强化 / 合并 / 优化已有 / 后台化 / 隐藏 / 延期复核 / 淘汰 / 不做。
4. 如提出任何新增模块、入口、视图、筛选或后台能力，必须给出新增功能门禁记录与 WAVE 评分；未通过不得建议进入 Dev。
5. Design Director 全站规范审计：Art Direction 是否清楚、页面母版是否统一、栏目标题是否一致、卡片/列表/侧栏/详情页规则是否足够可执行。
6. DESIGN v2 修改建议：字体、间距、色彩、材质、页面母版、移动端、Admin、视觉资产规则。
7. Copy 风险清单：模块命名、栏目标题、CTA、前台文案中的内部话术、过度承诺、空泛表达。
8. 后续任务建议：哪些任务应更新 `P0-10`，哪些进入 `P0-11`，哪些进入 `P0-6 / P0-5 / P0-4`，哪些暂缓。
9. 明确哪些建议需要用户确认，哪些可以后续直接派发。

收口文件：

- `agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md`

## 7P. 产品功能类任务硬性要求

本任务属于“产品功能 / 模块治理类评审任务”，不得直接进入 Dev。执行窗口必须输出存量模块决策表；如提出新增或强化能力，必须逐项输出新增功能门禁记录和 WAVE 评分。

### 7P.1 新增功能门禁记录

如提出任何新增模块、入口、视图、筛选器、榜单、图谱、报告形态、后台模块、会员权益、自动化产物或数据维度，必须填写：

| 门禁项 | 结论 |
|---|---|
| 功能名称 |  |
| 功能类型 | 前台 / 后台 / 会员 / 数据 / 自动化 / 商业化 |
| 对应用户任务 | 今天看什么 / 为什么值得看 / 下一步验证什么 / 是否持续成立 / 账号会员 / 内部运营 |
| 目标用户场景 |  |
| 预期商业结果 |  |
| 现有模块为什么不能承载 |  |
| 是否可改为已有模块内视图 |  |
| WAVE 评分 | W / A / V / E / 总分 |
| 数据与运营依赖 |  |
| 体验路径 |  |
| 前台 / 后台边界 |  |
| 非目标 |  |
| 决策 | 进入 PRD / 原型验证 / 合并进已有模块 / 后台化 / 延期复核 / 不做 |
| 下一步 owner |  |

WAVE 通过线：

- W - Worth paying for：>= 2
- A - Alignment：>= 2
- V - Validation：>= 1
- E - Experience / Effort：>= 2

任一项为 0 或未达到通过线，不得进入 Dev。

### 7P.2 模块决策表

至少覆盖以下模块：

- 首页
- Daily Brief
- Signals
- The Point
- Opportunities
- Trends
- Priority Engine
- Tags / Search / 关系网络能力
- 登录 / 注册 / 邀请申请
- Account / Pricing / Checkout
- Admin 工作台
- Netlify Preview / 上线准备能力

每个模块必须填写：

| 决策项 | 结论 |
|---|---|
| 模块名称 |  |
| 用户是谁 |  |
| 用户为什么需要 |  |
| 商业价值 |  |
| 与现有模块是否重复 |  |
| 是否可通过加强现有模块解决 |  |
| 用户是否愿意付费或持续使用 |  |
| 使用路径是否顺畅 |  |
| 是否贴合观澜战略核心 |  |
| 决策 | 新增 / 保留 / 强化 / 合并 / 优化已有 / 后台化 / 隐藏 / 延期复核 / 淘汰 / 不做 |
| 非目标 |  |
| 需要交接的 Agent |  |

## 7A. 页面 / 设计规范类硬性要求

本任务不改页面代码，但必须由 UI / UE Design Director 输出“全站页面规范审计表”，至少包含：

- 页面类型覆盖：首页 / 前台栏目页 / 前台详情页 / Admin / 会员页 / 移动端。
- 页面目标：每类页面用户 5 秒内应理解什么。
- 设计基准：必须引用 `DESIGN.md`，并说明与 `frontend-design`、`awesome-design-md`、`taste-skill` 的适配边界。
- 布局基准：主容器宽度、标题位置、标题字号、行高、模块起点、网格结构。
- 字体层级：H1 / H2 / 卡片标题 / 正文 / meta / CTA。
- 间距基准：栏目标题区、模块间距、卡片内边距、列表行距、移动端收缩规则。
- 组件克制规则：哪些卡片、徽章、阴影、边框、背景块必须删除、弱化或合并。
- 前台 / Admin 边界：普通前台不能出现的后台词、操作和视觉。
- 桌面端验收点：坐标、字号、首屏主次、无横向溢出。
- 移动端验收点：单列/折叠规则、字号、按钮可点击、无横向溢出。
- 禁止项：霓虹科技风、模板 SaaS 卡片墙、后台组件堆叠、内部流程话术等。

## 8. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] PM 模块生命周期决策表
- [ ] 如有新增功能建议：新增功能门禁记录
- [ ] 如有新增功能建议：WAVE 评分
- [ ] Design Director 全站页面规范审计表
- [ ] Copy 风险清单
- [ ] 后续任务拆分建议

未运行的检查必须在收口文件中说明原因和风险。

## 9. 自动化影响

- `ai-the-point`：默认不影响。
- `ai-2`：默认不影响。
- `ai-3`：默认不影响。

如执行窗口提出改变 Markdown 命名、字段规则、同步脚本、统一同步闸门、自动化时间线或内容生成口径，必须先标注“可能影响自动化任务”，并仅作为建议写入报告，不得直接修改。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/agents/pm-agent.md
5. agent-workflow/agents/ui-ue-agent.md
6. agent-workflow/execution/WSD-20260504-27-site-module-design-review.md

你是本任务的独立执行窗口，由升级后的 PM Agent 与 UI / UE Design Director 联合牵头。

任务目标：
对观澜AI当前网站模块、页面体系和设计规范做一次系统梳理，提出修改和优化意见。

严格边界：
- 不直接修改 04-Site。
- 不进入 Dev。
- 不生成首页海报图。
- 不新增前台栏目或后台能力，只能做评审和建议。
- 不把 P0-2B failed 结果当成成功版本。

必须输出：
1. 当前网站模块地图。
2. PM 模块生命周期决策表，至少覆盖首页、Daily Brief、Signals、The Point、Opportunities、Trends、Priority Engine、Tags/Search、登录注册、Account/Pricing、Admin。
3. 如提出任何新增模块、入口、视图或后台能力，必须输出新增功能门禁记录与 WAVE 评分；未通过不得建议进入 Dev。
4. UI / UE Design Director 全站页面规范审计表。
5. DESIGN v2 修改建议。
6. Copy 风险清单。
7. 后续任务拆分建议，说明哪些应更新 P0-10 / P0-11 / P0-6 / P0-5 / P0-4。
8. 哪些建议需要用户确认，哪些可以后续直接派发。

主报告写入：
agent-workflow/reports/site-module-design-review-2026-05-04.md

完成后生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md

收口文件必须写清：
- 做了什么
- 改了哪些文件
- 是否符合派发单范围
- 运行了哪些检查
- 哪些检查未运行及风险
- 是否影响 ai-the-point、ai-2、ai-3
- 是否建议调度中枢标记 accepted / blocked / failed

完成后回到调度中枢窗口汇报：
收口：agent-workflow/reports/WSD-20260504-27-site-module-design-review-closeout.md
```
