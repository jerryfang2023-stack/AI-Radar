---
title: Dispatch Hub Handoff
date: 2026-05-04
type: dispatch-hub-closeout
status: current
owner: workflow / pm
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# 调度中心窗口交接文档

本文件用于把当前过长的调度中心窗口交接到新窗口。新窗口应继续作为“调度中枢窗口”，不直接承担大型执行任务；具体执行仍应单独开新窗口，完成后回到调度中枢提交 closeout。

本文件不是普通状态摘要，还包含今天多任务执行后的成功记录、失败记录、经验教训和可复用提示词。新窗口接手后，应优先按这里的经验减少重复试错。

## 1. 新窗口启动提示词

请在新窗口粘贴：

```text
请按 01-WaveSight 项目的长期 agent-workflow 接手观澜AI调度中心窗口。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/dispatch-board.md
5. agent-workflow/reports/dispatch-hub-handoff-2026-05-04.md
6. agent-workflow/progress.md
7. agent-workflow/feature_list.json

你现在是新的调度中枢窗口，只负责：
- 分配任务
- 生成派发单和新窗口提示词
- 接收 closeout
- 按硬闸门验收
- 回填 dispatch-board / progress / agent-handoff

不要直接执行大型页面或开发任务，除非我明确要求“在当前窗口执行”。

当前优先级：
1. 执行：P0-10
2. P0-10 accepted 后再执行 P0-11
3. 执行：P0-6
4. 执行：P0-5
5. 执行：P0-4
```

## 1A. 调度常用提示词

### 执行已有任务

当用户说：

```text
执行：P0-10
```

调度中心应读取看板和派发单，输出新执行窗口提示词，而不是自己直接做。输出格式建议：

```text
请新开一个执行窗口，粘贴以下提示词：

【放入派发单中的执行窗口启动提示词】

完成后回到调度中心汇报：
收口：agent-workflow/reports/<TASK-ID>-closeout.md
```

### 接收 closeout

当用户说：

```text
收口：agent-workflow/reports/<TASK-ID>-closeout.md
```

调度中心必须逐项检查：

- closeout 文件是否存在，是否 UTF-8 正常。
- 是否符合派发单范围。
- 页面 / 文案类任务是否包含 UI/UE 规范表、Copy 规范表、Dev 按表实现、QA 截图与测量。
- closeout 中提到的截图、报告、产物文件是否真的存在。
- Quality Gates 是否运行；未运行是否说明原因。
- 自动化影响是否说明。
- 最终状态应是 `accepted`、`failed / not accepted`、`blocked`、`void / abandoned` 中哪一个。

### 结束执行窗口提示词

每个执行窗口结束前必须写：

```text
请生成 UTF-8 收口文件：
agent-workflow/reports/<TASK-ID>-closeout.md

收口文件必须写清：
- 做了什么
- 改了哪些文件
- 是否符合派发单范围
- 运行了哪些检查
- 哪些检查未运行及风险
- 页面类任务的 UI/UE 页面规范表、Copy 文案规范表、Dev 按表实现、QA 桌面 / 移动截图与坐标 / 字号 / 间距 / 文案验收
- 是否影响 ai-the-point、ai-2、ai-3
- 是否建议调度中枢标记 accepted / failed / blocked / void

完成后回到调度中心汇报：
收口：agent-workflow/reports/<TASK-ID>-closeout.md
```

## 2. 当前调度机制

快捷口令：

- `执行：<看板编号或 Task ID>`：读取派发单，输出独立执行窗口提示词。
- `收口：<closeout 文件路径>`：读取 closeout，验收并回填。
- `看板` / `状态`：查看任务面板。
- `下一批`：列出建议执行顺序。
- `加入看板：<优先级> <牵头 Agent> <任务描述>`：追加任务。

所有 handoff / closeout / stage-summary Markdown 必须保存为 UTF-8。

## 3. 最新硬规则

### 页面类任务

涉及首页、栏目页、详情页、会员页、Admin、移动端、`04-Site/*.html` 或 `04-Site/css/styles.css` 页面体验改动的任务，一律视为页面类任务。

必须包含：

- UI/UE 页面规范表。
- Copy 文案规范表，如果涉及可见文案。
- Dev 按表实现说明。
- QA 桌面 / 移动端截图。
- 坐标 / 字号 / 间距 / 首屏节奏 / 文案验收。

缺少任一项，调度中枢不得标记 `accepted`。

### UI / UE Design Director

`ui-ue-agent` 已原地升级为 `UI / UE Design Director`，不新增第九个长期 Agent。

后续首页、全站 UI、栏目体系、Admin、移动端、海报 / 首屏视觉任务，不得直接进入 Dev。必须先输出：

- Art Direction
- 页面母版
- DESIGN v2 草案或升级建议
- 字体 / 间距 / 色彩 / 材质系统
- 视觉资产规则
- 审美阻塞项

### 文案类任务

涉及可见文案的页面任务必须有 Copy 文案规范表。Dev 不得自行补写、改写或扩写关键文案。QA 必须检查禁用语、判断边界、标题长度和容器适配。

公开前台继续避免：

- `本页用于`
- `入口`
- `同步`
- `字段`
- `后台`
- `证据链`
- `强证据`
- `来源明确`
- `阅读证据`
- `机会确定`
- `下一步验证`
- 空泛营销、过度承诺、替用户下最终经营 / 投资 / 合作判断。

### 产品功能类任务

`SYS-5` 已 accepted：PM Agent 新增功能门禁与“宁缺毋滥”模块生命周期治理已生效。

后续任何新增功能、页面、入口、视图、筛选、后台能力、会员能力、自动化产物或数据维度，不得直接进入 Dev。必须先由 PM Agent 输出：

- 新增功能门禁记录。
- WAVE 评分：Worth paying for、Alignment、Validation、Experience / Effort。
- 模块决策表。
- 结论：新增、保留、强化、合并、优化已有、后台化、隐藏、延期复核、淘汰或不做。

任一 WAVE 项为 0，或缺少模块决策表，调度中枢不得标记 `accepted`，也不得派发进入开发落地。

## 4. 当前看板摘要

### 系统治理任务

- `SYS-0`：调度中枢机制，accepted。
- `SYS-1`：任务看板驱动，accepted。
- `SYS-2`：GitHub 外部能力学习与 taste-skill 安全审查，accepted。
- `SYS-3`：页面 / 文案类派发硬闸门，accepted。
- `SYS-4`：UI / UE Design Director 升级，accepted。
- `SYS-5`：PM 新增功能门禁与“宁缺毋滥”模块治理，accepted。

### 首页与视觉

- `P0-2`：首页首屏与海报图规划，accepted，规划保留。
- `P0-2A`：三图轮播方向，void / abandoned，不合并。
- `P0-2B`：首页 UI / Copy redesign 尝试，failed / not accepted，不合并。
- `P0-10`：网站 UI 优化方向，ready，下一步优先执行。
- `P0-11`：首页右侧海报图 / Intelligence Desk 样张优化，ready-after-P0-10，必须等 P0-10 accepted 后执行。

### Admin / 权限 / 登录注册

- `P0-3`：Admin 需求规划，accepted。
- `P0-3A`：Admin P0 工作台落地，accepted。
- `P0-6`：普通前台与 Admin 边界复查，ready。必须包含 `signals.html` 隐藏 `editorDialog` 源码风险。
- `P0-9`：登录 / 注册页面优化，accepted。

Admin P0 范围扩展已接受：邀请码、邀请申请审批、本地访问统计、注册邀请码闭环。但这些仍是本地浏览器演示数据，不是正式云端账号、邮件发放或服务端统计。

### 部署与上线

- `P0-4A`：Netlify Preview 部署，accepted。
  - 不可变部署链接：`https://69f88cb84d559e9a6e9354bd--wavesight-ai-preview.netlify.app`
  - 默认站点链接：`https://wavesight-ai-preview.netlify.app`
  - Netlify 后台：`https://app.netlify.com/projects/wavesight-ai-preview`
- `P0-4`：上线前准备，ready。仍需正式 release checklist、权限边界、备份、回滚、生产发布方案。

### Priority Engine / 数据智能 / 自动化

- `P0-7`：Signal 关键词与来源优化，accepted。下一次 `ai-2` 需观察早期融资、新趋势、技术迭代、开发者生态和反证覆盖。
- `P0-8`：Priority Engine 2.0 模型，accepted。
- `P0-8A`：Priority Engine 2.0 快速落地，accepted。
- `P0-8B`：ai-3 Judgment Node 同步闸门，accepted。

当前数据能力：

- `judgmentNodes` 已进入网站数据。
- Priority Row -> Judgment Node 覆盖率要求 100%。
- `ai-3` 已加入 Judgment Node 硬闸门。

### 其他 ready 任务

- `P0-5`：Signals / Daily / Opportunities / Trends UI 截图矩阵验收，ready。
- `P1-1`：移动端设计系统，ready。
- `P1-2`：观澜AI 助理产品规划，ready。
- `P1-3`：全站前台 Copy 语气审计，ready。
- `P1-4`：Daily Brief 详情页产品化，ready。
- `P1-5`：自动化首跑与日志复查，ready。

## 4A. 今日成功任务记录

以下任务可以作为后续窗口复用的成功样板：

- `SYS-3` 页面 / 文案派发硬闸门：把 UI/UE 规范、Copy 规范、Dev 按表实现、QA 截图验收前置为硬条件。经验：页面任务不能只看“代码改了没有”，必须看设计、文案、实现和验收是否闭环。
- `SYS-4` UI / UE Design Director 升级：没有新增第九个 agent，而是把 `ui-ue-agent` 原地升级。经验：长期岗位优先升级职责边界，不轻易制造新的临时角色。
- `SYS-5` PM 模块治理：新增功能门禁和“宁缺毋滥”模块生命周期治理已 accepted。经验：产品功能不是越多越好，新增或保留模块前必须先判断商业价值、战略贴合、用户验证、体验成本和与现有模块关系。
- `P0-1A` The Point 首页模块落地：已完成并 accepted。经验：有明确规划、页面边界和文案边界的任务，执行窗口更容易收口。
- `P0-3A` Admin P0 工作台：已完成并 accepted，包含邀请码、邀请申请、本地访问统计和注册邀请码闭环。经验：范围扩展可以接受，但必须在 closeout 中写清“本地演示”与“生产能力”的边界。
- `P0-4A` Netlify Preview 部署：已拿到可访问链接。经验：Preview 可访问只代表部署成功，不代表后续本地变更自动上线。
- `P0-7` Signal 关键词 / 来源优化：已 accepted，并影响 `ai-2`。经验：内容质量问题不只靠更多大公司关键词，应加入早期融资、技术迭代、开发者生态、垂直采用和反证来源。
- `P0-8A` Priority Engine 2.0 快速落地：已 accepted，`judgmentNodes` 进入网站数据。经验：新判断模型要同时落到产品文档、数据结构、解析逻辑和 QA 闸门，不能只停在概念文档。
- `P0-8B` ai-3 Judgment Node 同步闸门：已 accepted。经验：自动化相关模型升级必须补同步检查，否则后续日更会漂移。
- `P0-9` 登录 / 注册页面优化：已 accepted，并补了邀请申请页和 Admin 处理入口。经验：登录注册不是孤立页面，必须连到用户资格、邀请和 Admin 运营闭环。

## 4B. 今日失败 / 作废记录

这些任务不要被新窗口误判为可继续合并的成果：

- `P0-2A` / `WSD-20260504-13-homepage-hero-carousel-assets`：提前终止，状态 `void / abandoned`。作废原因是首页首屏轮播方向未被采用，需要重新派发新任务。不可合并，不影响 `ai-the-point`、`ai-2`、`ai-3`。
- `P0-2B` / `WSD-20260504-18-homepage-ui-copy-redesign`：状态 `failed / not accepted`。用户明确反馈首页仍没有达到预期，不能合并、不能作为 P0 首页成功版本复用。经验：首页不能只局部改 CSS 或堆模块，要先做全站视觉方向和页面母版。
- `WSD-20260504-18` 编号冲突：同一编号曾被不同语义任务复用。经验：后续派发必须先查 `dispatch-board.md` 和 `agent-workflow/reports/`，避免 Task ID 重号。
- 截图证据问题：部分执行窗口 closeout 写了截图路径，但主工作区没有对应文件。经验：调度验收时必须检查文件真实存在，不能只看 closeout 自述。

## 4C. 范围扩展但已接受的任务

- `P0-3A` Admin P0 工作台扩展了邀请码、邀请申请和本地访问统计。接受边界：这些是本地浏览器演示能力，不是生产后端、真实邮件发放或正式用户系统。
- `P0-9` 登录 / 注册优化扩展到 `invite-request.html` 和 Admin 邀请申请处理。接受边界：页面体验和本地闭环已接受，后续生产化仍归入 Admin / 权限 / 上线准备任务。

## 5. 建议下一批

1. `执行：P0-10`
2. P0-10 accepted 后再执行 `P0-11`
3. `执行：P0-6`
4. `执行：P0-5`
5. `执行：P0-4`

理由：

- 首页 redesign 已失败一次，必须先回到 Design Director 的全站 UI 方向和母版，不要继续局部 CSS 返工。
- Admin P0 已 accepted，但普通前台 / Admin 边界仍需独立 QA。
- 上线准备依赖权限边界、截图验收和 release checklist。

## 6. 已知风险

- `signals.html` 仍有历史隐藏 `editorDialog` 源码风险，必须进 P0-6。
- Netlify Preview 已可访问，但 Priority Engine 2.0 与后续本地变化未必已重新部署到远端，不要冒充线上已更新。
- `P0-2B` 首页 redesign closeout 最终结论为 failed；不要合并或沿用其结果。
- 邀请码、邀请申请和访问统计为本地浏览器演示数据，不是生产系统。
- Git 工作树很脏，包含多窗口修改。不要回滚不属于当前任务的文件。

## 6A. 接手后的经验教训

1. 首页类任务不要直接派给 Dev。先让 UI / UE Design Director 完成 Art Direction、页面母版、DESIGN v2 方向和审美阻塞项，再进入 Copy 和 Dev。
2. 首页右侧海报 / Intelligence Desk 视觉资产不要抢跑。必须等 `P0-10` accepted 后，再派 `P0-11`，否则容易再次走偏。
3. closeout 中的“建议 accepted”不是最终结论。必须看 closeout 的最终状态、用户反馈和验收证据；如果写明 failed / not accepted，就按失败处理。
4. 页面验收不能只读文字。截图、报告、产物文件必须真实存在，并且要能对应到桌面 / 移动端视口。
5. Copy 是硬闸门。任何前台可见文案都要遵守 `COPY.md`，避免内部话术、说服式表达和过度确定性表达。
6. 产品功能类任务必须先过 PM 新增功能门禁和 WAVE 评分。未证明值得做、符合战略、有人需要且体验成本合理的功能，不进入 Dev。
7. Admin、登录、邀请、统计当前多为本地演示能力。上线前必须通过 `P0-4` 和 `P0-6` 补生产权限、数据写入、备份和回滚方案。
8. Netlify Preview 链接可访问不代表本地最新任务已发布。每次用户问“线上是否已更新”，必须确认最近一次部署时间和部署内容。
9. `feature_list.json` 更新后要复查目标条目是否真的改到。今天曾出现状态更新命中不稳的问题，后续不要只相信补丁成功提示。
10. 失败 / 作废任务必须保留在看板里，不要删除。删除会让新窗口误以为任务从未发生，重复试错。
11. 交接、handoff、closeout、stage-summary 全部使用 UTF-8，Windows 读取中文 Markdown 时优先指定 UTF-8。

## 6B. 新窗口最容易踩的坑

- 不要把 `P0-2B` 当成首页成功版本。
- 不要在 `P0-10` 前执行 `P0-11`。
- 不要把本地邀请码 / 本地访问统计当成生产账号系统。
- 不要因为 `P0-3A` 已 accepted 就跳过 `P0-6`。
- 不要对纯调度文档强行跑内容同步类闸门；语法闸门即可。
- 不要重置或回滚 Git 工作树中的陌生修改。
- 不要把 closeout 里的“未影响自动化”直接照收；涉及字段、同步、内容生成、部署时间线时必须重新判断。
- 不要创建临时 agent 代替八个长期 agent；除非用户明确同意。
- 不要把“用户提出了新功能”直接等同于“功能应该开发”；先让 PM 做 WAVE 和模块决策表。

## 7. feature_list 关键状态

- `GL-M3-005`：`verify`，Admin P0 工作台已落地，仍待 P0-6 权限边界复查。
- `GL-M2-006`：`verify`，Priority Engine 2.0 判断节点快速落地。
- `GL-M2-004`：`in_progress`，关键词策略已优化，但关键词质量检查脚本 / 周期复盘未完成。
- `GL-M4-001`：仍需正式上线准备路径继续推进；Netlify Preview 已完成，但 production launch 未完成。

## 8. 自动化影响总览

- `ai-the-point`：近期治理和页面任务默认不影响。
- `ai-2`：受 P0-7 与 P0-8A 影响，需要持续输出新版关键词策略与 Priority Engine 2.0 / Judgment Node 结构。
- `ai-3`：已升级 Judgment Node 同步硬闸门。

任何后续改动如果影响 Markdown 命名、字段规则、同步脚本、统一同步闸门、自动化时间线，必须先提示“可能影响自动化任务”，完成后同步更新对应自动化说明或任务配置。

## 9. 本窗口最终质量门

本交接文档生成后，调度中枢已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：passed，6 项检查通过。

报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-150444.md`

未运行 `content` / `sync-data` 的原因：本收口只改调度文档，不改内容源、网站数据或同步脚本。
