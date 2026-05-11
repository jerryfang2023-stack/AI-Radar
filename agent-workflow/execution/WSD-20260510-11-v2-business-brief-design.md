# WSD-20260510-11-v2-business-brief-design 派发单

日期：2026-05-10  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue`  
协作 Agent：`pm` / `copy` / `data` / `qa` / `workflow`

## 0. 快速执行卡

- 看板编号：`V2-BUSINESS-BRIEF-DESIGN`
- Task ID：`WSD-20260510-11-v2-business-brief-design`
- 任务类型：页面类 / 产品功能类 / 文案类
- 派发模式：formal_task
- 派发单：`agent-workflow/execution/WSD-20260510-11-v2-business-brief-design.md`
- 默认 closeout：`agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md`
- 收口箱登记：`agent-workflow/inbox/closeout-queue.jsonl`
- 调度口令：`收口：WSD-20260510-11-v2-business-brief-design`
- 是否可能影响自动化：否
- 是否需要更新 `current-context.md`：否，除非提出修改一级导航、会员边界或商业内参产品角色
- 是否写入收口箱：是
- Skill Pattern：Tool Wrapper + Inversion + Generator + Reviewer
- Pattern 顺序：读取规范 -> 反推商业内参用户任务与会员边界 -> 生成页面/模块设计方案 -> Design Director / QA 评审
- 硬停顿：不得修改站点代码；不得改变一级导航；不得修改 VI token / Logo / SVG 资产；不得继承 `V2-SITE-QUALITY-AUTO` failed 成果；如需改变商业化、会员或付费边界，先停下来写 PM 决策
- Reviewer：UI / UE Design Director + QA Agent

执行窗口最短启动提示词：

```text
执行任务：WSD-20260510-11-v2-business-brief-design
请读取 AGENTS.md、agent-workflow/governance/current-context.md 和 agent-workflow/execution/WSD-20260510-11-v2-business-brief-design.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md。
追加收口登记到 agent-workflow/inbox/closeout-queue.jsonl。
回调度窗口：收口：WSD-20260510-11-v2-business-brief-design
```

## 1. 任务目标

为 V2 一级栏目“商业内参”输出可执行的页面设计方案，解决商业内参需要同时承载深度判断、商业热力图、会员价值感、报告阅读体验和增值产品入口的问题。

本任务只做设计与规范，不做 Dev 实现。目标是让下一步开发窗口可以按表实现。

必须回答：

- 商业内参在 V2 中是普通内容栏目、会员栏目，还是增值产品入口。
- 商业热力图在页面中的角色：核心模块、摘要入口、报告内组件，还是后台判断资产的前台表达。
- 每日 / 每周内参、专题报告、热力图、机会雷达、趋势背景、证据链如何组合。
- 列表页、详情页、报告封面、热力图模块、会员预览态、锁定态、CTA 如何设计。
- 桌面端与移动端的首屏、阅读路径、模块节奏和付费边界如何设计。
- 哪些现有模块应保留、合并、重命名、隐藏或删除。

## 2. 非目标

- 不直接修改 `01-SiteV2/site/` 代码。
- 不生成或替换正式图片、SVG、Logo 或品牌 token。
- 不改变 V2 一级导航：今日要点 / 关键信号 / 机会解码 / 商业内参。
- 不恢复 V1 旧页面口径。
- 不继承 `V2-SITE-QUALITY-AUTO` 的 stage1 / stage2 / reference mockups / local-site-quality-pass。
- 不做 Netlify / GitHub / 自动化部署。
- 不直接决定定价、支付或会员系统实现。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Design Director | 商业内参页面结构、报告质感、热力图展示、会员态体验和审美评分 |
| PM Agent | 栏目任务、会员/增值产品边界、WAVE / 模块决策表 |
| Copy Agent | 栏目标题、内参文案、CTA、锁定态文案、判断边界 |
| Intelligence Data Agent | 热力图、Signal / Trend / Opportunity / Point / HeatEvidence 映射 |
| QA Agent | 对设计方案做硬闸门验收，列出开发前阻塞项 |
| Workflow Agent | 写 closeout、登记收口箱 |

## 4. 执行窗口必须读取

默认读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 本派发单

任务补读：

- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/v2/v2-navigation-column-finalization.md`
- `agent-workflow/reports/WSD-20260507-07-v2-ai-brief-heatmap-premium-product-plan-closeout.md`
- `docs/brand/wavesight-ai-vi/USAGE.md`
- `docs/brand/wavesight-ai-vi/brand-tokens.css`
- 需要字体时读取：`docs/brand/wavesight-ai-vi/typography-guidelines.md`

如需要查看当前页面现状，可读取但不得修改：

- `01-SiteV2/site/`
- `01-SiteV2/content/06-insights/`
- `01-SiteV2/content/10-databases/`
- `01-SiteV2/content/04-selected-signals/`
- `01-SiteV2/content/08-opportunities/`

## 5. 允许改动范围

- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md`
- 可新增设计说明：`agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-spec.md`
- 可新增模块矩阵：`agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-matrix.md`
- `agent-workflow/inbox/closeout-queue.jsonl`

## 6. 禁止改动范围

- 不修改 `01-SiteV2/site/`。
- 不修改 `01-SiteV2/content/`。
- 不修改 `docs/brand/wavesight-ai-vi/`。
- 不修改自动化、Netlify、GitHub、脚本或生产数据。
- 不修改 `agent-workflow/product/DESIGN.md`，如发现冲突，只在报告中提出建议。

## 7. 预期输出

主交付物：

- 商业内参 V2 栏目定位与用户任务。
- 页面信息架构：列表页、详情页、报告封面、热力图、会员预览态、锁定态、CTA。
- UI/UE 页面规范表。
- Copy 文案规范表。
- 数据字段 / 内容模块映射表。
- 模块取舍表：保留 / 合并 / 强化 / 删除 / 后台化。
- 桌面端与移动端布局说明。
- Design Director 证据化评分表。
- 下一步 Dev 执行建议与硬阻塞清单。

收口文件：

- `agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md`

收口箱登记：

```json
{"task_id":"WSD-20260510-11-v2-business-brief-design","board_id":"V2-BUSINESS-BRIEF-DESIGN","closeout_path":"agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md","status":"ready_for_review","created_at":"YYYY-MM-DDTHH:mm:ss+08:00","owner":"ui-ue"}
```

## 7S. Skill Pattern Gate

| 项目 | 结论 |
|---|---|
| 主 Pattern | Tool Wrapper + Inversion + Generator + Reviewer |
| Pattern 组合顺序 | 先读取 V2 / VI / Copy / AI Brief 产品规划，再反推商业内参用户任务、热力图角色和会员边界，生成页面规范，最后由 Design Director / QA 评审 |
| 为什么选这个 Pattern | 商业内参是高价值栏目和潜在会员产品，不应直接套模板页 |
| 必须读取的 Tool Wrapper / 规范 | DESIGN、COPY、VI USAGE、brand tokens、V2 PRD、导航定稿、AI Brief / Heatmap 产品规划 |
| 必须生成的 Generator 产物 | 设计规范、模块矩阵、页面规范表、Copy 表 |
| 必须独立执行的 Reviewer | UI / UE Design Director、QA Agent |
| 必须先诊断 / 先确认的 Inversion 节点 | 商业内参不是新闻聚合页，而是“判断成品 + 热力证据 + 会员价值”的商业内参产品 |
| Pipeline 阶段顺序 | 规范读取 -> 当前页面与内容诊断 -> 模块设计 -> 文案规范 -> QA 评审 -> closeout |
| 硬停顿 | 需要改变一级导航、付费边界、VI token、站点代码或自动化时停止 |
| closeout 必须提供的 Pattern 证据 | 读取清单、诊断表、模块矩阵、Reviewer 评分与阻塞项 |

缺少 Pattern 字段或 closeout 未提供对应证据，不得标记为 accepted。

## 7P. 产品功能类任务硬性要求

本任务涉及一级栏目下的页面、会员态与增值产品表达，必须填写 PM 门禁与模块决策表。

### 7P.1 新增功能门禁记录

至少覆盖：

- 商业内参是否继续作为一级导航。
- 商业热力图、报告封面、会员预览态、锁定态、CTA 是否为前台模块。
- 哪些内容对普通用户开放，哪些作为会员 / 增值产品预览。
- 是否需要新增专题报告、Issue No.、下载 / 保存 / 分享等模块。
- 是否有模块应后台化、合并进机会解码或仅作为详情页组件。

WAVE 通过线：

- W - Worth paying for：>= 2
- A - Alignment：>= 2
- V - Validation：>= 1
- E - Experience / Effort：>= 2

任一项为 0 或未达到通过线，不得建议进入 Dev。

### 7P.2 模块决策表

每个候选模块必须给出：

- 用户是谁。
- 用户为什么需要。
- 商业价值。
- 与现有模块是否重复。
- 是否可通过加强现有模块解决。
- 是否应作为会员 / 增值产品权益。
- 使用路径是否顺畅。
- 决策：新增 / 保留 / 强化 / 合并 / 优化已有 / 后台化 / 隐藏 / 延期复核 / 淘汰 / 不做。

## 7A. 页面类任务硬性要求

### 7A.1 UI/UE 页面规范表

必须至少包含：

- 页面类型：商业内参列表页 / 内参详情页 / 热力图模块 / 会员预览态。
- 页面目标：
- 用户任务：
- 首屏结构：
- 模块顺序：
- 字体层级：
- 间距基准：
- 报告封面呈现方式：
- 热力图呈现方式：
- 证据摘要呈现方式：
- 会员边界呈现方式：
- CTA 呈现方式：
- 桌面端验收点：
- 移动端验收点：
- 禁止项：

### 7A.2 Design Director 证据化风格美观质检表

必须按 V2 设计规范给出评分。栏目 / 详情页通过线：>= 80；若定义为会员/商业化核心页，建议按 >= 85 执行。

至少覆盖：

- 商业内参感。
- 判断成品质感。
- 热力图是否克制、专业、不装饰化。
- 信息层级清晰度。
- 视觉克制与高级感。
- 阅读效率。
- 模块节奏。
- 移动端可读性。
- 是否像商业情报产品，而不是新闻列表、后台面板、模板页或营销落地页。

### 7A.3 QA 验收

本轮不要求真实页面截图，因为不做 Dev。但 QA 必须检查：

- 是否没有继承 failed 任务成果。
- 是否不改变一级导航。
- 是否不使用 `frontend-design`。
- 是否遵守 VI / token / 字体规范。
- 是否清楚区分普通前台、会员预览和内部后台。
- 是否可以交给 Dev 按表实现。

## 7B. 文案类任务硬性要求

必须输出 Copy 文案规范表：

- 栏目主标题建议。
- 栏目说明。
- 报告标题规则。
- 热力图模块标题和说明。
- 会员预览态文案。
- 锁定态 / CTA 文案。
- 禁用语检查。
- 判断边界：不替用户下最终经营、投资或合作判断。

公开前台不得出现后台、同步、字段、证据链、强证据、下一步验证等内部流程语；如需要表达证据，应转化为用户可读的“来源”“观察边界”“变化原因”。

## 8. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] PM 新增功能门禁记录
- [ ] 模块决策表
- [ ] Skill Pattern Gate：Pattern 标注、硬停顿和 Reviewer 证据
- [ ] UI/UE 页面规范表
- [ ] Design Director 证据化风格美观质检表，栏目 / 详情页通过线 >= 80，会员核心页建议 >= 85
- [ ] Copy 文案规范表
- [ ] QA 设计可开发性验收

未运行的检查必须在收口文件中说明原因和风险。

## 9. V2 自动化影响

- 是否可能影响 `v2-content-site-daily-update`：否。
- 是否可能影响内容入库、知识库、站点生成或部署：否。
- 如提出未来字段调整，只能作为建议，不得直接改 schema 或脚本。

## 10. 外部 GitHub skill / repo 安全审查

本任务默认不安装、不引用外部 GitHub repo。如执行窗口确需引用外部设计 repo 或 skill，必须在 closeout 中写明来源、安全风险和适配边界。

## 11. 执行窗口启动提示词

```text
执行任务：WSD-20260510-11-v2-business-brief-design
请读取 AGENTS.md、agent-workflow/governance/current-context.md 和 agent-workflow/execution/WSD-20260510-11-v2-business-brief-design.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：
agent-workflow/reports/WSD-20260510-11-v2-business-brief-design-closeout.md
追加收口登记到 agent-workflow/inbox/closeout-queue.jsonl。
回调度窗口：收口：WSD-20260510-11-v2-business-brief-design
```

说明：本任务是“商业内参 V2 设计规范任务”，不是开发任务。执行窗口不得直接改站点代码；如认为可以进入 Dev，必须在 closeout 中输出下一阶段 Dev 派发建议。
