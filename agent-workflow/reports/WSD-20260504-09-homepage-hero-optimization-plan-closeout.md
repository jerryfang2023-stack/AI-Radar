# WSD-20260504-09-homepage-hero-optimization-plan Closeout

日期：2026-05-04  
owner：`strategy` / `pm` / `ui-ue` / `copy`  
状态：accepted  
编码：UTF-8

## 1. 对应派发单

- 派发单：`agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md`
- 任务目标：优化首页，重点是首屏海报图和第一屏价值表达，让用户在 5 秒内理解观澜AI的商业判断价值。

## 2. 本轮完成

- 已按长期 agent-workflow 读取启动文件、调度中枢机制、派发单、战略事实源、首页 PRD、设计规范、文案规范和四个牵头 Agent 岗位说明。
- 已使用 `frontend-design` 规范，明确本任务推荐参考为 `Apple 留白 + Bloomberg / FT 内参式阅读 + Linear 信息密度`。
- 已输出首页首屏战略判断：首屏应从抽象雷达流程图转向“商业判断样张 + 今日信号入口”。
- 已给出海报图候选方向并排序：P0 推荐“情报桌面 + 真实判断样张”，P1 可选生成图海报或数据场景可视化，P2 可选真实资产拼贴。
- 已输出首页首屏信息架构、文案候选、验收标准和后续 UI / Copy / Visual / Dev / QA 任务拆分。
- 已按规划方向生成一张展示用首页首屏效果示意图；用户明确反馈“这个风格很喜欢，比现在的好”，后续 UI / Dev 应以该方向作为视觉参考。

## 2.1 展示用效果示意图

说明：下图仅作为首页首屏风格参考和调度中枢验收素材，不是最终站点图片资产，未放入 `04-Site/assets/`，也未接入前台页面。

![首页首屏效果示意图](C:/Users/86186/.codex/generated_images/019def03-4307-7030-9f0c-2652d44d41c3/ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png)

示意图路径：

```text
C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png
```

后续接手注意：

- 保留象牙白底、深石墨文字、深墨绿重点面板和少量铜棕强调。
- 首屏主视觉采用“情报桌面 / 判断样张”而不是纯抽象雷达图。
- 右侧视觉应展示 Signals、Opportunity Watch、Trend Status 与 Brief 的判断关系。
- 不做霓虹科技风、大屏监控风、后台数据面板或抽象氛围图。

## 3. 修改文件

- `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`：新增首页首屏与海报图优化规划报告。
- `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`：新增本任务 UTF-8 收口文件。
- `agent-workflow/reports/quality-gates-syntax-2026-05-03-20260503-180929.md`：运行 Quality Gates 时由脚本自动生成的语法检查报告。
- `C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png`：展示用首页首屏效果示意图，由本轮生成，作为风格参考，不是最终站点资产。

未改动：

- `04-Site/index.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- 自动化任务
- 数据模型

## 4. 验证结果

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed，6 项检查全部通过，失败项 0。报告文件：`agent-workflow/reports/quality-gates-syntax-2026-05-03-20260503-180929.md`。

未运行：

- 浏览器检查：本任务为规划任务，派发单明确不改首页代码、不生成最终图片资产，因此未运行浏览器检查。风险较低；后续 Dev / QA 执行实现任务时必须补跑桌面端和移动端截图验收。
- 同步 / 关系 / 标签检查：本任务未改内容数据、同步脚本、关系规则或标签体系，因此未运行。风险较低；如后续实现任务改动首页数据渲染逻辑，再由 Dev Agent 按需运行。

## 5. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

本任务只做首页方向和页面需求规划，未改变 Markdown 文件命名、目录、frontmatter、数据字段、同步脚本、质量检查脚本、自动化时间线或统一同步闸门。

## 6. 风险与遗留

- 风险：如果后续只换文案、不换右侧海报图，首屏仍可能停留在“抽象口号 + 流程图”的旧问题。
- 风险：如果海报图走生成图路线，必须避免变成无信息量的科技氛围图。
- 软提醒：当前推荐主文案仍需 Copy Agent 做最终压缩，并与 UI Agent 的真实首屏宽度匹配。
- 用户反馈：已认可本轮示意图风格，认为比当前首页更好。
- 需要调度中枢确认：后续是否直接按该风格派发 Copy / UI / Dev 落地任务。

## 7. 建议调度中枢更新

- `dispatch-board.md`：建议将 `WSD-20260504-09-homepage-hero-optimization-plan` 标记为 `review`，验收通过后标记为 `accepted`。
- `feature_list.json`：可将 `GL-M3-002` 保持 `in_progress`，等后续 Copy / UI / Dev / QA 落地后再进入 `verify`。
- `progress.md`：建议追加“首页首屏与海报图规划已完成，待 Copy / UI / Dev 执行”的记录。
- `docs/agent-handoff.md`：若调度中枢接受本规划，建议写入接手注意：用户已认可展示图风格，首屏主方向为情报桌面样张，避免继续使用纯抽象雷达图作为唯一视觉。

## 8. 下一步

建议下一个任务：

```text
WSD-20260504-09A-homepage-hero-copy
```

由 Copy Agent 输出首页首屏最终 H1、副标题、CTA、依据标签和禁用语检查，再交给 UI / UE Agent 制定首屏结构与海报规格。

## 9. 调度中枢验收

2026-05-04 调度中枢已验收通过，状态更新为 `accepted`。

- 本轮为首页首屏方向规划，不修改前台代码、内容源、数据模型或自动化任务。
- 用户已认可展示用效果示意图风格，后续 P0-2A 首页轮播图落地任务必须以“情报桌面 + 真实判断样张”为主方向。
- `GL-M3-002` 继续保持 `in_progress`，待 P0-2A 完成页面资产、实现和截图验收后再进入验证。
- 调度中枢复跑 `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-114355.md`。
