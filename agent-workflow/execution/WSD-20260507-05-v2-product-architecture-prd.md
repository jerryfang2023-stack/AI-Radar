# WSD-20260507-05-v2-product-architecture-prd 派发单

日期：2026-05-07  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`pm` / `strategy` / `data`

## 0. 快速执行卡

- 看板编号：`V2-4`
- Task ID：`WSD-20260507-05-v2-product-architecture-prd`
- 任务类型：产品功能类 / PRD / 模块治理
- 派发单：`agent-workflow/execution/WSD-20260507-05-v2-product-architecture-prd.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md`
- 调度口令：`收口：WSD-20260507-05-v2-product-architecture-prd`
- 是否可能影响自动化：可能影响，但本任务只做 PRD

## 1. 任务目标

输出 V2.0 产品架构与 PRD，明确栏目、后台、会员、内容资产、测试页和生产页之间的关系。

## 2. 必读

1. `AGENTS.md`
2. `agent-workflow/governance/pm-module-governance` 或 SYS-5 相关报告
3. `agent-workflow/v2/v2-transition-charter.md`
4. `agent-workflow/v2/v2-preflight-roadmap.md`
5. `agent-workflow/v2/references/guanlan-ai-brief-heatmap-premium-plan.md`
6. `agent-workflow/v2/briefs/v2-ai-brief-heatmap-premium-brief.md`
7. V2-1 / V2-2 / V2-3 / V2-4A closeout，若已完成

## 3. 输出

- `agent-workflow/v2/v2-product-architecture-prd.md`
- PM 新增功能门禁记录。
- WAVE 评分。
- 模块决策表。
- closeout：`agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md`

必须明确：

- `AI内参` 是否进入 V2 产品架构。
- `AI商业热力图` 是新增一级栏目、会员产品页、内参详情模块，还是后台生成资产。
- 若 V2-4A 已完成，必须吸收其 PM 门禁和模块决策结论。
- 基于 V2 算法和新闻监测入库流程，重新梳理每个前台栏目的模块更新、删减和优化建议，不得只局限于现有页面模块。
- 明确 Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> Trend -> AIBriefIssue 之后，各栏目应该展示哪些内容、隐藏哪些内部过程、增加哪些新模块。
- 明确每日新增 3 条高质量深度 Signal 时，Signals 页面与详情页应如何呈现：列表结构、核心摘要、6 维机会拆解、二次搜索来源、商业解释、关联 Trend / Opportunity / HeatEvidence。
- 明确 Trends 在新算法下的新页面模块：趋势热度、行业 / 岗位 / 流程三元组、证据增长、反证信号、关联 Signal、机会方向、时间变化和内参引用关系。
- 明确 Opportunities 在新模型下应如何从“机会卡”升级为“可验证机会地图”：目标客户、替代流程、商业模式、迁移判断、验证动作、证据强弱和关联热力。
- 明确 Daily Brief / The Point / AI商业内参 / 热力图之间的分工，避免重复展示同一组内容。
- 必须评估现有一级栏目 `Home / Daily Brief / Signals / The Point / Opportunities / Trends` 是否应在 V2 中保留、合并、升级、降级、改名或删除；不得默认沿用 V1 导航结构。

## 4. 硬规则

- 产品功能类任务必须先过 PM 门禁，不得直接进入 Dev。
- 不新增前台栏目，除非 WAVE 评分和模块决策表明确通过。

## 5. 本轮新增补充要求：算法驱动的栏目全面升级

本任务必须以 V2-2 的新算法与内容源架构为基础，输出“栏目模块升级矩阵”。矩阵至少覆盖：

| 栏目 / 页面 | 当前角色 | V2 新角色 | 应保留模块 | 应删除 / 降级模块 | 应新增模块 | 数据来源 | 用户状态 | 进入 Dev 前置条件 |
|---|---|---|---|---|---|---|---|---|
| Home | 入口与价值表达 | V2 价值入口与内参预览 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | 普通 / 登录 / 会员 / 管理员 | UI/UE Design Director |
| Daily Brief | 日常摘要 | 每日商业雷达入口 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | Raw / Pool / Structured / Signal | 普通 / 登录 / 会员 / 管理员 | PM + Copy |
| Signals | 商业信号 | 每日 3 条深度 Signal 展示层 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | Front Signal / HeatEvidence | 普通 / 登录 / 会员 / 管理员 | Data + UI/UE |
| The Point | 观点判断 | Builder / VC / 市场观察校准层 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | Point / Builder Insight / Counter Evidence | 普通 / 登录 / 会员 / 管理员 | Strategy + Copy |
| Opportunities | 机会卡 | 可验证机会地图 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | Deep Dive / Opportunity / HeatCard | 普通 / 登录 / 会员 / 管理员 | PM + Data |
| Trends | 趋势页 | 行业 / 岗位 / 流程热力变化页 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | Trend / HeatEvidence / HeatCard | 普通 / 登录 / 会员 / 管理员 | Data + UI/UE |
| AI商业内参 | 增值产品 | 周度 / 月度商业判断产品 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | AIBriefIssue / HeatCard / Signal / Point | 会员为主 | PM 门禁 + WAVE |
| AI商业热力图 | 内参核心模块 | 商业热度解释模块，不做公开榜单 | 由执行窗口判断 | 由执行窗口判断 | 由执行窗口判断 | HeatEvidence / HeatScore | 会员 / 管理员 | Algorithm + QA |

输出要求：

- 不要把现有页面模块当作默认答案；必须允许重构、删减、合并和新增。
- 不要把现有一级栏目当作默认答案；必须逐一给出 `Home / Daily Brief / Signals / The Point / Opportunities / Trends` 的保留、合并、升级、降级、改名或删除建议，并说明依据。
- 如建议合并栏目，必须说明合并后的用户问题、数据来源、页面结构、导航名称和被合并栏目的旧内容迁移去向。
- 如建议删除或降级栏目，必须说明哪些内容进入其他页面、会员层、Admin 或自动化资产库，避免内容资产丢失。
- 每个栏目必须解释它为什么适配新算法、服务哪个用户问题、消费哪些数据资产。
- 每个新增模块必须写清是否进入公开前台、会员层、Admin、测试页或自动化生成资产。
- 每个页面必须明确“展示给用户的判断”和“后台保留的证据 / 流程”的边界。
- 必须给出 Dev 后续拆分建议：哪些先做信息架构，哪些先做数据 schema，哪些先做页面母版，哪些暂缓。
