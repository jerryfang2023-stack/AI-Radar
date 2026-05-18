# Window Dispatch Hub

更新时间：2026-05-06  
owner：`pm` / `workflow`  
状态：长期生效

## 1. 定位

本文件定义“调度中枢窗口”机制。

当前主窗口是任务看板驱动的调度中枢，只负责：

- 维护任务看板。
- 接收用户的新任务并加入看板。
- 判断牵头长期 Agent。
- 预生成或更新任务派发单。
- 将任务从 `ready` 流转到 `running` / `review` / `accepted`。
- 等待独立执行窗口完成。
- 读取收口文件。
- 验收收口质量。
- 更新进度、看板和下一步。

具体执行任务应在单独窗口完成。执行窗口结束后，必须写 closeout 并登记到收口箱；如用户仍希望手动汇报，可继续提供收口文件路径。

自 `SYS-8 / WSD-20260506-01-dispatch-flow-efficiency-upgrade` 起，调度中枢默认采用“文件驱动短口令”模式：长规则写入派发单、模板和治理文件，聊天窗口只传递 Task ID、派发单路径和默认 closeout 路径。除非任务极特殊，调度窗口不再输出整段长背景提示词。

自 2026-05-10 起，调度中枢默认采用“轻量启动读取”模式。执行窗口默认只读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 当前任务派发单

其他文件只按任务类型补读 1-4 个单一真源。派发单不得再复制 10-20 个通用必读文件；如果确需扩展读取范围，必须说明原因、用途和不读取的风险。

轻量启动不等于轻量验收。页面类、产品功能类、自动化、部署、外部 skill / repo、安全、权限和生产数据任务，仍必须按派发单与 Quality Gates 完整验收。

## 1A. 三轨派发模式

自 2026-05-10 起，调度中枢采用三轨派发，避免所有事项都走同一套重流程：

| 模式 | 适用场景 | 默认动作 |
|---|---|---|
| `quick_fix` | 很小、低风险、用户明确要求“直接处理”的治理 / 文档 / 状态修正 | 当前窗口直接完成，必要时更新进度和运行检查 |
| `formal_task` | 需要独立窗口执行、但阶段不复杂的标准任务 | 生成派发单，执行窗口三文件轻量启动 |
| `autopilot_chain` | 多个可连贯执行的阶段，适合一口气做完并最终收口 | 一个执行窗口按阶段推进，写 stage summary，硬停顿时暂停 |

选择规则：

- 能 `quick_fix` 的，不强行建任务。
- 能 `autopilot_chain` 连贯执行的，不拆成 6A / 6B / 6C 反复回调度。
- 需要用户产品取舍、UI/UE Design Director 审美判定、PM 门禁、部署 / Git / Netlify、生产自动化改造时，必须设置硬停顿。
- 自动化和合并执行不得降低任何页面、文案、产品、数据或 QA 闸门。

派发单必须在快速执行卡中标注：`派发模式`、`是否需要更新 current-context.md`、`是否写入收口箱`。

## 1B. 连贯 / 自动化优先派发原则

自 2026-05-07 起，后续创建派发任务时默认遵守“一个能连贯或自动化执行的优先原则”。

调度中枢新增任务时，必须优先判断：

1. 是否属于同一条连续工作链路。
2. 是否可以由同一执行窗口顺序完成。
3. 是否可以用 stage summary 代替每个小阶段反复回调度窗口。
4. 是否可以在一个 closeout 中汇总多个安全阶段。

默认优先派发：

- `AUTO` / `autopilot` 顺序执行包。
- 阶段内自检 + stage summary。
- 最终一次回调度中枢。

只有遇到以下硬闸门时，才拆分成独立任务或要求执行窗口停止：

- 需要用户产品决策或商业取舍。
- 需要 PM 新增功能门禁、WAVE 评分、模块决策表。
- 需要 UI / UE Design Director 证据化审美验收。
- 需要修改生产自动化、生产同步脚本、`content-paths.json`、Netlify 配置。
- 需要 Git commit、tag、branch、worktree 或远端 push。
- 需要正式页面 Dev、部署、生产数据切换或权限变更。
- 执行窗口发现会触碰 failed / abandoned / stopped / review 成果。

自动化执行包必须写清：

- 阶段顺序。
- 每阶段允许做什么。
- 每阶段禁止做什么。
- 哪些阶段必须写 stage summary。
- 哪些动作是硬停止点。
- 最终 closeout 路径。

调度中枢验收时，以“是否遵守硬停止点”和“是否保留生产安全边界”为优先，不因任务合并而降低任何质量闸门。

## 1C. 收口箱机制

为减少“执行窗口完成后用户复制 closeout 到调度窗口”的来回成本，新增收口箱：

- 收口箱目录：`agent-workflow/inbox/`
- 队列文件：`agent-workflow/inbox/closeout-queue.jsonl`

执行窗口完成后，除写入 UTF-8 closeout 文件外，必须向队列追加一行 JSONL：

```json
{"task_id":"<TASK-ID>","board_id":"<BOARD-ID>","closeout_path":"agent-workflow/reports/<TASK-ID>-closeout.md","status":"ready_for_review","created_at":"YYYY-MM-DDTHH:mm:ss+08:00","owner":"<lead-agent>"}
```

调度中枢新增快捷口令：

- `检查收口箱`：读取 `closeout-queue.jsonl`，自动定位待验收 closeout。
- `验收收口箱`：按队列逐个执行收口验收，已 accepted / failed / blocked 的任务自动跳过。
- `忽略收口：<TASK-ID>`：仅当队列登记错误或用户明确放弃该收口时使用。

收口箱是登记机制，不替代验收。调度中枢仍必须读取 closeout、核对派发单、检查硬闸门并回填看板 / 进度。

## 1D. current-context 维护规则

以下任务通过后，必须同步检查并更新 `agent-workflow/governance/current-context.md`：

- 当前一级导航、栏目角色、页面入口或 V2 目录口径发生变化。
- VI、Logo、品牌 token、字体、背景、SVG 使用规则发生变化。
- 每日监测、内容入库、知识库、站点生成或部署口径发生变化。
- failed / abandoned / stopped / not-accepted 基线发生变化。
- 调度机制、派发模式、收口机制或必读文件口径发生变化。

如果任务不影响上述内容，closeout 中标注“不需要更新 current-context”即可。

## 1E. 状态冲突消解规则

长期调度会在多个文件留下历史状态。派发或收口前，调度中枢必须按 `agent-workflow/governance/dispatch-state-reconciliation.md` 统一状态。

当前有效状态优先级：

```text
用户最新明确裁决 -> 最新 closeout / failed closeout -> dispatch-board -> feature_list -> handoff 顶部最新章节 -> progress 顶部最新章节 -> 历史章节 / stage summary / mockups
```

硬规则：

- 历史章节中的 `ready`、`completed`、`local-site-quality-pass` 不得覆盖最新 failed closeout。
- `failed / not-accepted / closed` 任务不得继续派发原 Task ID。
- 并入 failed 任务的子项不得视为已解决，必须改为 `review / needs-successor-after-failed-merge` 或重新派发继任任务。
- “使用建议 / 下一步”不得推荐已经 completed / accepted 的任务、failed 任务、abandoned 任务或被 failed 任务吞并的任务。
- V2-only 阶段默认入口是 `01-SiteV2/`，旧 `04-Site/` 已从当前仓库移除，不得恢复为当前开发入口。

## 2. 任务 ID

任务 ID 统一使用：

```text
WSD-YYYYMMDD-NN-short-name
```

示例：

```text
WSD-20260504-01-copy-audit
WSD-20260504-02-ui-screenshot-matrix
```

## 3. 状态

| 状态 | 含义 |
|---|---|
| `backlog` | 已记录，尚未派发 |
| `ready` | 已生成派发单，等待用户领取执行 |
| `dispatched` | 已给出执行窗口提示词，等待独立窗口启动 |
| `running` | 执行窗口正在处理 |
| `review` | 已提交收口文件，等待本窗口验收 |
| `accepted` | 收口通过，进度已回填 |
| `blocked` | 有阻塞，需要用户或 PM 决策 |

## 4. 快捷口令

用户可在调度中枢窗口使用以下短句：

```text
执行：<看板编号或 Task ID>
```

PM / Workflow Agent 应从 `dispatch-board.md` 找到对应任务，输出：

- Task ID。
- 派发单路径。
- 独立执行窗口短提示词。
- 预期 closeout 路径。
- 必跑检查。

如用户确认该任务已开新窗口执行，则把状态更新为 `running`。

```text
派发：<任务描述>
```

PM / Workflow Agent 应输出：

- 任务 ID。
- 牵头 Agent。
- 看板编号。
- 派发模式：`quick_fix` / `formal_task` / `autopilot_chain`。
- 派发单路径。
- 执行窗口短提示词。
- 需要读取的文件。默认只列 `AGENTS.md`、`current-context.md`、本派发单和按任务类型补读的少量单一真源。
- 输出和收口文件路径。
- 是否写入收口箱。
- 是否需要更新 `current-context.md`。
- 必跑 Quality Gates。

```text
收口：<Task ID 或 closeout 文件路径>
```

PM / Workflow Agent 应优先支持短收口：如果用户只输入 Task ID，应按默认路径自动读取 `agent-workflow/reports/<TASK-ID>-closeout.md`；如果用户输入完整路径，则读取该路径。随后检查：

- 是否说明任务目标、改动文件、验证结果、遗留风险。
- 是否说明自动化影响。
- 是否通过对应 Quality Gates。
- 是否需要更新 `feature_list.json`、`progress.md`、`docs/agent-handoff.md`。
- 是否可以标记 `accepted`，或退回补充。

```text
检查收口箱
```

读取 `agent-workflow/inbox/closeout-queue.jsonl`，列出尚未验收或看板仍处于 `review / running / dispatched` 的收口文件。

```text
验收收口箱
```

按收口箱队列逐个读取 closeout 并执行标准验收；已 `accepted / failed / blocked` 的任务自动跳过。

```text
状态
```

输出 `agent-workflow/execution/dispatch-board.md` 中当前任务状态。

```text
看板
```

等同于 `状态`，但优先输出 ready / running / review 任务。

```text
下一批
```

根据当前 backlog 和项目交接，列出建议派发顺序。

```text
加入看板：<优先级> <牵头 Agent> <任务描述>
```

将新任务写入 `dispatch-board.md`，必要时创建派发单。任务复杂或影响重大时，应先按 Plan-first 创建计划。

```text
阻塞：<task-id> <原因>
```

把任务标记为 `blocked`，并写清需要谁决策。

## 5. 派发单

看板驱动模式下，调度中枢应尽量提前为 ready 任务创建派发单：

```text
agent-workflow/execution/<task-id>.md
```

派发单模板见：

```text
agent-workflow/execution/TASK-window-dispatch-template.md
```

派发单必须写清：

- 任务目标。
- 非目标。
- 牵头 Agent 和协作 Agent。
- 执行窗口启动时必须读取的文件。
- 允许改动的文件范围。
- 禁止改动的文件范围。
- 预期收口文件路径。
- 收口箱登记要求。
- 派发模式。
- 是否需要更新 `current-context.md`。
- 必跑检查。
- 自动化影响判断。

### 5.0A 文件驱动短派发规则

派发单是执行窗口的单一任务入口。调度窗口输出给新窗口的提示词默认压缩为：

```text
执行任务：<TASK-ID>
请读取 AGENTS.md、agent-workflow/governance/current-context.md 和 agent-workflow/execution/<TASK-ID>.md。
只处理派发单允许范围。
完成后写 UTF-8 closeout：agent-workflow/reports/<TASK-ID>-closeout.md。
追加收口登记到 agent-workflow/inbox/closeout-queue.jsonl。
回调度窗口：收口：<TASK-ID>
```

长背景、UI/UE 表、Copy 表、Dev/QA 硬闸门、V2 自动化影响、必跑检查、禁止范围，都必须写在派发单里，不再在聊天提示词中重复展开。

调度中枢输出派发提示时必须同时给出：

- 看板编号。
- Task ID。
- 派发模式。
- 派发单路径。
- 默认 closeout 路径。
- 收口箱登记要求。
- 是否需要更新 `current-context.md`。
- 本任务是否为页面类 / 文案类 / 产品功能类 / 自动化影响类。
- 最短新窗口口令。

执行窗口如果只收到短口令，必须自行读取派发单，不得以“提示词未展开”为由省略闸门。

### 5.0 产品功能类任务派发硬规则

凡任务涉及新增前台导航、页面、详情页、卡片视图、筛选器、榜单、图谱、报告形态、后台模块、管理动作、会员权益、付费入口、样例报告、newsletter、企业版能力、资源连接流程、自动化产物或数据维度，调度中枢必须把该任务标记为“产品功能类任务”。

产品功能类任务不得直接派给 Dev。必须先由 PM Agent 输出“新增功能门禁记录”和“模块决策表”。

新增功能门禁采用 PM Agent 的 WAVE 评分：

| 维度 | 说明 | 通过线 |
|---|---|---:|
| W - Worth paying for | 是否增强付费理由、复访动力、销售可信度或定制服务线索 | >= 2 |
| A - Alignment | 是否紧扣“信号 -> 判断 -> 机会 -> 趋势/验证”的战略链路 | >= 2 |
| V - Validation | 是否来自用户场景、销售反馈、内容质量问题、数据证据或明确反复痛点 | >= 1 |
| E - Experience / Effort | 用户路径是否顺畅，且实现、维护、运营成本可控 | >= 2 |

任一项为 0，或未达到通过线，不得进入 Dev；只能进入原型验证、合并进已有模块、后台化、延期复核或不做。

产品功能类派发单必须要求 PM 回答：

1. 该功能帮助用户完成哪一个判断任务。
2. 它提升了哪个商业结果。
3. 现有模块为什么无法承载。
4. 是否可改为已有模块内视图、筛选或状态。
5. 用户在真实场景中何时打开，30 秒内完成什么。
6. 它需要哪些数据、内容或运营动作才能长期成立。
7. 是否增加导航复杂度、维护成本或前后台边界混乱。

观澜AI需要的功能必须提升判断质量、判断效率、证据可信度、机会验证能力、复访与付费理由、后台运营质量或克制的商业化转化。默认拒绝 AI 新闻流、工具导航、公司排行榜、项目黄页、开发者社区、泛仪表盘、泛 AI 助手、只增加信息量但不提高判断质量的功能。

### 5.1 页面类任务派发硬规则

凡任务涉及首页、栏目页、详情页、今日观察、商业信号、机会判断、商业内参、The Point / Trends 降级模块、会员页、Admin、移动端或任何 `01-SiteV2/site/*.html` / `01-SiteV2/site/assets/*.css` / `01-SiteV2/site/assets/*.js` 页面体验改动，调度中枢必须把该任务标记为“页面类任务”，并在派发单中加入以下硬性要求。旧 `04-Site/` 已从当前仓库移除，不再作为 V2 页面类任务参考或改动范围。

页面类任务不得只写“读取 `DESIGN.md`”或“使用 UI/UE 规范”。必须要求 UI/UE Agent 先产出可验收的页面规范表，再允许 Dev 实现。
页面类任务如果涉及任何对外或后台可见文案，也必须要求 Copy Agent 先产出可验收的文案规范表；Dev 不得自行补写、改写或扩写关键文案。
页面类任务还必须要求 Design Director 输出证据化风格美观质检表。该表既是创作要求，也是交付后的验收标准；必须包含桌面截图、移动端截图、逐项扣分原因、必须重做清单和 Dev 实现偏差清单。没有证据化质检时，不得进入 Dev 或不得标记 `accepted`。

#### 5.1.1 页面类任务强制阶段

页面类任务默认拆为四段，除非用户明确要求只做规划且不改代码：

```text
PM 范围确认 -> UI/UE 页面规范表 + Copy 文案规范表 -> Dev 按表实现 -> QA 独立截图/测量/文案验收 -> Workflow 收口
```

如果一个执行窗口被要求连续完成 UI/UE、Dev、QA，也必须在同一个 closeout 中分段写清：

1. UI/UE 页面规范表。
2. Copy 文案规范表。
3. Dev 如何逐条实现。
4. QA 如何独立按表验收。
5. 未满足项是否阻塞。
6. Design Director 证据化风格美观质检分数、截图、扣分原因和是否重做。

没有 UI/UE 页面规范表的页面实现任务，不得标记为 `accepted`。
涉及可见文案但没有 Copy 文案规范表的页面实现任务，不得标记为 `accepted`。
没有 Design Director 证据化风格美观质检表的页面实现任务，不得标记为 `accepted`。

#### 5.1.2 UI/UE 页面规范表必填字段

派发单必须要求 UI/UE 输出以下字段：

- 页面类型：前台栏目页 / 前台详情页 / 首页 / Admin / 会员页 / 移动端。
- 页面目标：用户 5 秒内应理解什么。
- 设计基准：必须引用 `DESIGN.md` 与 `docs/brand/wavesight-ai-vi/`；可补充 `design-taste-frontend`、`gpt-taste`、`redesign-existing-projects`、`high-end-visual-design`、`awesome-design-md`，并说明适配边界；不得使用 `frontend-design`。
- 布局基准：主容器宽度、首屏顶部位置、标题位置、标题字号、行高、模块起点、主要网格结构。
- 字体层级：H1 / H2 / 卡片标题 / 正文 / meta / 按钮文字的大小和使用场景。
- 间距基准：栏目标题区、模块间距、卡片内边距、列表行距、移动端收缩规则。
- 组件克制规则：哪些卡片、徽章、阴影、边框、背景块必须删除、弱化或合并。
- 前台 / Admin 边界：普通前台是否允许出现后台词、后台操作或后台视觉。
- 桌面端验收点：至少包含坐标、字号、首屏主次、无横向溢出。
- 移动端验收点：至少包含单列/折叠规则、字号、按钮可点击、无横向溢出。
- 禁止项：本任务不得出现的视觉、文案和交互模式。

#### 5.1.2A Design Director 证据化风格美观质检表必填字段

派发单必须要求 UI/UE Design Director 输出以下评分表。每项 0-20 分，总分 100 分。

质检必须基于截图和具体扣分原因。页面已实现或已有可访问页面时，缺少桌面截图、移动端截图、逐项扣分原因、必须重做清单或 Dev 实现偏差清单的，质检无效。

| 质检项 | 得分 | 说明 |
|---|---:|---|
| Style Purity / 风格一致性与纯净度 |  |
| Proportion & Rhythm / 比例与韵律感 |  |
| Color Sophistication / 色彩深度与平衡 |  |
| Craftsmanship / 细节的艺术处理 |  |
| Emotional Resonance / 情感共鸣 |  |
| Squint Test / 眯眼测试 | 通过 / 不通过 |
| 总分 |  |
| 结论 | 通过 / 重做 |
| 必须重做的问题 |  |
| 可延后优化的问题 |  |

证据字段：

- 设计基准引用：
- 桌面端截图：
- 移动端截图：
- 逐项扣分原因：
- Dev 实现偏差清单：
- QA 复核建议：

评分规则：

- `90-100`：优秀，可作为母版或参考样张。
- `80-89`：通过，可进入 Dev 或 QA，但记录可优化项。
- `70-79`：勉强通过，只能在无阻塞项时继续，必须列出后续优化点。
- `<70`：不通过，必须重做。
- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产低于 `85` 必须重做。
- 一级栏目页 / 详情页 / 会员页低于 `80` 必须重做。
- Admin 工作台和后台模块低于 `75` 必须重做。
- 任一单项低于 `14`、Squint Test 不通过或出现审美阻塞项，即使总分达到对应通过线也必须重做。

扣分规则必须至少覆盖：

- 标题位置、字号、行高或模块起点与同级页面不一致：-8 到 -12。
- 同屏超过 3 种卡片风格、圆角或阴影系统：-10。
- 按钮、徽章、数字和摘要争抢注意力：-8 到 -12。
- 首屏没有明确主任务或视觉重心：-12 到 -18。
- 海报或首屏视觉像通用 AI 氛围图：直接阻塞。
- 前台像后台组件堆叠：直接阻塞。
- 移动端标题断行难看、按钮拥挤或横向溢出：-10 到直接阻塞。
- 眯眼后只看到散乱卡片或随机色块：直接阻塞。

#### 5.1.3 Dev 执行硬规则

页面类任务中，Dev Agent 必须在 closeout 中逐条说明：

- UI/UE 页面规范表中的哪些条目已实现。
- Copy 文案规范表中的哪些条目已实现。
- 哪些条目未实现，原因是什么。
- 是否新增了与规范不一致的临时样式、页面结构或组件。
- 是否自行新增、改写或扩写了 Copy 未提供的关键文案。
- 是否影响其他栏目标题、全站字体层级、Admin 模块节奏或移动端布局。

如果 Dev 无法按 UI/UE 页面规范表实现，必须标记 `blocked` 或退回 UI/UE / PM，不得自行改成另一套视觉。
如果 Dev 发现文案缺失、过长、无法适配容器或语义不清，必须退回 Copy / PM，不得自行补成内部话术或空泛营销语。

#### 5.1.4 QA 独立验收硬规则

页面类任务中，QA Agent 必须按 UI/UE 页面规范表验收，并在 closeout 中写清：

- 桌面端截图路径。
- 移动端截图路径。
- 对比页面或对比模块。
- 标题位置、字号、行高和模块起点是否一致。
- 是否存在页面粗糙、简陋、模板感、后台组件堆叠、主次不明、占位过大、字体随意或间距不一。
- 普通前台是否出现 Admin、JSON、同步、编辑、恢复、字段、后台等痕迹。
- 文案是否通过 Copy 文案规范表验收。
- 是否出现内部话术、空泛营销、过度承诺、替用户下最终判断、标题过长、CTA 命令式或容器断行难看。

以下问题一律视为页面类阻塞项，不得标记 `accepted`：

- 栏目之间标题位置、字号、行高或首屏节奏明显不一致。
- 同一 Admin 侧栏模块之间顶部工具栏、模块框起点、模块标题起点或标题区高度不一致。
- 页面像后台组件堆叠、模板页或临时拼装页。
- 字体大小随意，缺少统一层级。
- 桌面端或移动端出现横向溢出、遮挡、重叠。
- 普通前台出现后台操作或内部流程痕迹。
- 公开前台出现“本页用于、入口、同步、字段、后台、证据链、强证据、来源明确、机会确定、下一步验证”等禁用或说服式表达。
- 文案出现“赋能、生态闭环、风口红利、颠覆未来、确定性机会、立即行动、保证收益”等空泛或过度承诺表达。
- Daily Brief 出现行动指令，Signal 把单条新闻写成确定机会，Opportunity 标题写公司名。
- 标题、CTA 或卡片文案过长导致断行难看、卡片拥挤或遮挡。

#### 5.1.5 Copy 文案规范表必填字段

凡页面类任务涉及可见文案，派发单必须要求 Copy 输出以下字段：

- 页面任务：用户来到本页正在做什么判断。
- 目标理解：用户看完 5 秒内应明白什么。
- 栏目/页面标题：最终标题，不写解释型副标题，除非派发单明确允许。
- 关键文案：H1、导语、模块标题、卡片标题、CTA、空状态、错误状态、提示文案。
- 证据边界：哪些表达必须降级为观察、仍需验证、单信源、多信源或反证。
- 禁用语检查：列出本页不得出现的内部话术、空泛词和过度承诺词。
- 标题长度与容器适配：说明是否会造成断行难看、按钮拥挤或卡片溢出。
- 与 UI/UE 的交接：哪些文案需要 UI 调整容器或层级。
- QA 文案验收点：需要 QA 检查的禁用语、语气、边界和标题长度。

没有 Copy 文案规范表时，Dev 不得自行编写以下文案：

- 首页首屏标题、导语、CTA。
- 栏目页标题。
- 详情页 H1。
- Signal / Opportunity / Trend / The Point 对外标题。
- 会员页、订阅页、登录注册页转化文案。
- Admin 高风险操作提示。

#### 5.1.6 调度中枢验收硬规则

调度中枢收到页面类 closeout 后，必须先检查：

1. 是否包含 UI/UE 页面规范表。
2. 如涉及可见文案，是否包含 Copy 文案规范表。
3. Dev 是否逐条对应实现。
4. QA 是否有桌面端和移动端截图。
5. QA 是否按页面规范表做坐标/字号/间距/首屏节奏验收。
6. QA 是否按 Copy 文案规范表做禁用语、判断边界、标题长度和容器适配验收。
7. 是否说明未满足项和阻塞项。
8. 是否包含 Design Director 证据化风格美观质检表，且有截图、扣分原因、必须重做清单、Dev 偏差清单。
9. 风格美观分数是否达到页面类型通过线：首页/全站母版/核心首屏/海报/视觉资产 >=85；一级栏目页/详情页/会员页 >=80；Admin >=75；任一单项不得低于 14，Squint Test 必须通过。

缺少任一项时，调度中枢不得代补事实，不得标记 `accepted`，应退回执行窗口补齐。

### 5.2 文案类任务派发硬规则

凡任务涉及首页、栏目页、详情页、会员页、Admin、CTA、卡片标题、空状态、错误提示、订阅/登录注册、The Point、Signals、Opportunities、Trends 或任何公开前台可见文案，调度中枢必须把该任务标记为“文案类任务”。

文案类任务必须要求 Copy Agent 输出 Copy 文案规范表。若任务只做文案、不改页面，也必须执行 Copy 文案规范表和 QA 文案验收；若任务同时改页面，则合并进入 `5.1 页面类任务派发硬规则`。

文案类任务 closeout 必须说明：

- Copy 是否读取 `COPY.md` 和 `DESIGN.md`。
- 当前页面的用户任务。
- 替换前问题：内部话术、空泛、过度承诺、替用户下判断、标题过长、容器不适配。
- 替换后文案。
- 禁用语检查结果。
- 判断边界检查结果。
- UI 容器适配风险。
- QA 文案验收结论。

以下问题一律视为文案类阻塞项，不得标记 `accepted`：

- 公开前台出现内部流程语。
- 公开前台以说服、推销或行动指令替代事实、来源、观察边界。
- 文案空泛，删掉后不影响理解。
- Opportunity 标题写公司名。
- Signal 标题退回公司名、产品名或纯新闻标题。
- Daily Brief 输出“下一步应该做、建议立即验证、必须进入验证清单”等行动指令。
- 文案与 UI 容器不匹配，造成标题断行难看、按钮拥挤、卡片压迫或移动端遮挡。

## 6. 收口文件

每个独立执行窗口结束前，必须生成收口文件：

```text
agent-workflow/reports/<task-id>-closeout.md
```

收口模板见：

```text
agent-workflow/reports/TASK-window-closeout-template.md
```

所有 handoff、closeout、阶段总结 Markdown 必须保存为 UTF-8。

### 6.1 Closeout 轻量索引头

为缩短调度验收时间，所有新 closeout 必须在正文前 40 行内提供“调度摘要”。调度摘要用于快速判断是否能进入详细验收，至少包含：

```yaml
task_id:
board_id:
status:
recommended_status:
dispatch_path:
closeout_path:
changed_files:
gates:
automation_impact:
blockers:
next_action:
```

页面类、文案类、产品功能类任务仍必须在后文提供完整证据表。调度摘要不能替代硬闸门，只负责让调度窗口更快定位结论、改动范围、检查结果和阻塞项。

## 7. 看板流转流程

### 7.1 领取执行

用户输入：

```text
执行：P0-1
```

调度中枢应：

1. 读取 `dispatch-board.md`。
2. 找到 `P0-1` 对应 Task ID。
3. 读取派发单。
4. 输出独立执行窗口提示词。
5. 将看板状态从 `ready` 更新为 `dispatched` 或 `running`。

### 7.2 收口验收

收到 `收口：<Task ID 或 path>` 后，按以下流程处理：

1. 如果输入是 Task ID，先按 `agent-workflow/reports/<TASK-ID>-closeout.md` 寻找收口文件；如果输入是路径，则读取该路径。
2. 用 UTF-8 读取收口文件。
3. 先读取前 40 行调度摘要，定位推荐状态、改动范围、阻塞项、检查结果和自动化影响。
4. 核对任务 ID 与派发单是否一致。
5. 检查改动文件是否超出派发范围。
6. 检查 Quality Gates 是否运行，未运行项是否说明原因。
7. 检查是否影响自动化任务。
8. 如涉及外部 GitHub skill / repo，检查来源、安装路径、静态安全审查、风险等级和观澜AI适配边界。
9. 如涉及页面类任务，检查 UI/UE 页面规范表、Copy 文案规范表、Dev 逐条实现说明、QA 独立截图/测量/文案验收是否齐全。
10. 如涉及页面类任务，检查 Design Director 证据化风格美观质检：缺少截图、扣分原因、必须重做清单或 Dev 偏差清单时，退回补齐；低于页面类型通过线、任一单项低于 14、Squint Test 不通过或有审美阻塞项时，退回重做。
11. 如涉及文案类任务，检查 Copy 文案规范表、禁用语检查、判断边界检查、UI 容器适配和 QA 文案验收是否齐全。
12. 按 `dispatch-state-reconciliation.md` 检查是否引用 failed / abandoned / stopped 成果作为通过证据。
13. 检查 `dispatch-board.md` 的“使用建议”是否需要刷新，避免继续推荐已完成或失败任务。
14. 如通过，更新 `dispatch-board.md` 为 `accepted`。
15. 必要时更新 `feature_list.json`、`progress.md`、`docs/agent-handoff.md`。
16. 输出下一步建议。

如果收口文件缺少关键内容，调度中枢不应代补事实，应退回执行窗口补充。

## 8. 执行窗口启动提示词

调度中枢给执行窗口的提示词默认使用短版：

```text
执行任务：<TASK-ID>
请读取 AGENTS.md、agent-workflow/governance/current-context.md 和 <本任务派发单路径>。
只处理派发单允许范围。
完成后写 UTF-8 closeout：<closeout 文件路径>。
追加收口登记到 agent-workflow/inbox/closeout-queue.jsonl。
回调度窗口：收口：<TASK-ID>
```

如任务涉及页面类、文案类、产品功能类、自动化影响类或外部 GitHub skill / repo，执行窗口必须按派发单中的对应硬闸门补齐证据。调度窗口无需在聊天提示词中重复展开这些规则。

## 9. 禁止事项

- 调度中枢窗口不直接吞掉大任务执行，除非任务非常小且用户明确要求。
- 独立执行窗口不得超出派发单范围。
- 执行窗口不得只在聊天中汇报，必须写收口文件。
- 收口文件不得省略 Quality Gates 和自动化影响。
- 未回填进度的任务不得标记为 `accepted`。
