# Dispatch Board｜当前任务看板

更新时间：2026-05-24
状态：V2.2 current

本看板只保留当前可执行、运行中或需要注意的任务。历史过程和已验收任务以 `agent-workflow/reports/` 的 closeout 为准，不再堆叠在当前看板中。

## 快捷口令

- `执行：<Task ID>`：输出独立执行窗口指令。
- `派发：<任务描述>`：新建派发单。
- `收口：<closeout 文件路径>`：验收并回填。
- `看板` / `状态`：查看当前任务。

## 当前基座

| 编号 | 状态 | 说明 |
|---|---|---|
| V2.2 | current | 只服务 V2.2 生产线 |
| Context | current | 默认入口为 `AGENTS.md` + `context/` + 当前派发单 |
| Harness | current | `context/06-execution-harness.md` 覆盖每日监测、Raw / Pool / Card、页面 / 文案 / Typography 三个高风险流程 |
| Agents | current | 流程驱动 4 个轻 Agent；栏目能力优先用 Skill |
| Monitor | manual / paused | `guanlan-daily-monitor` 不定时自动运行，按需手动触发 |
| Assets | manual / paused | `guanlan-daily-assets-chain` 不定时自动运行，按需手动触发，先过 readiness |
| Daily Observation Writer | paused | 不自动写稿，不自动更新网站 |
| GitHub / Netlify | paused-by-user | 未经用户明确允许不得推送、部署或重写远端历史 |

## 当前可执行任务

| 优先级 | Task ID | 状态 | 牵头 | 任务 | 约束 |
|---|---|---|---|---|---|
| P0 | `WSD-20260522-card-frontend-field-confirmation` | ready | Experience & Editorial / Product Commander | 前台卡片显示字段确认：列出所有前台卡片、当前渲染字段、可用字段和用户确认表 | 只盘点字段，不改代码、不改数据、不进入页面设计 |
| P0 | `WSD-20260522-site-page-module-layer2a-specs` | blocked_by_field_confirmation | Experience & Editorial | 阶段 2A：输出页面结构、模块取舍、Copy-first、Typography 和视觉规格表 | 等卡片前台字段确认后继续；不改代码、不部署、不推送 |
| P0 | `WSD-20260522-site-page-module-layer2b-build` | blocked | Build & Release | 阶段 2B：按确认后的规格表落到代码和数据绑定 | 等阶段 2A accepted |
| P0 | `WSD-20260522-site-page-module-layer3-regression` | blocked | Build & Release | 阶段 3：桌面端跑检，确认路由、页面、样式、数据链不坏 | 等阶段 2B accepted |
| P0 | `WSD-20260522-site-page-module-acceptance` | blocked | Product Commander | 验收：按派发单检查是否 accepted | 等阶段 3 closeout |

## 当前注意项

| 事项 | 状态 | 说明 |
|---|---|---|
| 版本口径 | V2.2 | `AGENTS.md`、`context/`、站点 README、产品真源和运行看板已更新到 V2.2 |
| NewsAPI | retired | 不在活跃搜索链路中；保留的历史说明只能作为 retired 记录 |
| 趋势规则 | current | 不再把“反证”或固定 `7 / 30 / 90` 时间窗口作为硬准入；必须写清风险边界、信息缺口或后续观察变量 |
| 标签体系 | current | 正式资产必须使用 `formal_tags`，不得新增非体系标签或让未知 tag 漏到前台 |
| 页面设计 | current | 当前设计规范以 `agent-workflow/product/DESIGN.md` 和 VI / Typography 真源为准，`frontend-design` 不作为项目主设计技能 |
| 本地清理 | active | 临时截图和过程产物可清；历史业务素材不伪装为当前规则，必要时以 closeout 标注归档边界 |

