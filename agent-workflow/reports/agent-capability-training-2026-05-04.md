---
title: 长期 Agent 能力训练报告
date: 2026-05-04
type: agent-capability-training
status: ready-for-dispatch-hub-review
project: 观澜AI｜WaveSight AI
encoding: UTF-8
---

# 长期 Agent 能力训练报告

## 1. 任务范围

本报告用于训练和优化观澜AI八个长期 Agent 的能力边界、输入输出规范、执行质量和协作方式。

本轮只处理长期 Agent 能力与治理文档，不执行具体产品任务，不修改 `04-Site/`，不修改内容源 Markdown，不修改自动化任务。

## 2. 总体评估

八个长期 Agent 的岗位说明已经具备基本分工，但训练前存在三个共性缺口：

- 岗位文件普遍说明了“职责”和“输出”，但缺少可直接执行的“能力训练清单”。
- Dev、QA、Workflow 的标准输出格式偏短，容易出现“做了但无法验收 / 验了但无法回填 / 收口但缺自动化影响”的问题。
- Agent 之间的交接依赖经验描述，缺少统一的输入、输出、风险和下一步 owner 字段。

本轮已在八个岗位文件中补充统一结构的“能力训练清单”，并在 `agent-memory.md` 写入长期训练规则。

## 3. 八个长期 Agent 当前能力评估

### 3.1 Strategy Agent

当前清晰度：较高。

优势：
- 定位、非目标、栏目边界和商业化判断清楚。
- 能防止产品滑回新闻站、工具站、后台资料库或公司榜。

主要风险：
- 容易停留在方向判断，如果没有交给 PM 的任务格式，后续无法执行。
- 涉及商业化、样例报告、企业服务时，需要更明确标注“假设 / 已确认 / 待用户拍板”。

训练重点：
- 把战略结论转成 PM 可拆解的边界、非目标和待确认问题。

### 3.2 PM Agent

当前清晰度：较高。

优势：
- 已明确不做 UI、Copy、Dev，负责 PRD、路线图、任务拆解和验收标准。
- 与 Plan-first、dispatch-board、feature_list 的关系清楚。

主要风险：
- 若任务拆得太大，执行窗口仍会吞掉过多范围。
- 若 PRD 缺少非目标，后续 UI/Copy/Dev 容易扩张。

训练重点：
- 每个任务必须能被独立窗口领取，并有明确允许/禁止文件范围。

### 3.3 UI / UE Agent

当前清晰度：高。

优势：
- 已有 `DESIGN.md`、成品感硬规则、栏目标题一致性和前台/后台边界。
- 能承接用户对“粗糙、简陋、主次不明”的反馈。

主要风险：
- 若没有 Copy 和 Data 输入，容易用视觉结构掩盖信息缺口。
- 若只调样式不调阅读路径，仍会出现模板感。

训练重点：
- 每次输出必须包含阅读路径、要弱化/删除的信息和桌面/移动端验收点。

### 3.4 Copy Agent

当前清晰度：高。

优势：
- 文案边界、禁用语和栏目专项规则清楚。
- 能防止内部流程语、过度说服和替用户下判断。

主要风险：
- 若没有 UI 容器约束，标题和 CTA 可能过长。
- 若没有 Data 事实边界，文案容易把弱证据写成强判断。

训练重点：
- 输出文案时同步说明证据边界和排版长度风险。

### 3.5 Intelligence Data Agent

当前清晰度：较高。

优势：
- 已从字段维护升级为判断资产建模，覆盖 Signal / Trend / Opportunity / The Point / Relation / Tags。
- 对硬错误、软提醒、标签治理、来源质量和关系网络有清楚职责。

主要风险：
- 容易为了关系覆盖率制造弱关联。
- 容易把数据质量建议误推进为产品优先级决策。

训练重点：
- 输出必须区分“硬错误必须修复”“软提醒运营复核”“需要 PM/人工确认”。

### 3.6 Dev Agent

当前清晰度：中等。

优势：
- 明确负责网站、脚本、权限、部署和验证。
- 知道不能擅自改变栏目逻辑或文案方向。

主要风险：
- 岗位文件原本缺少标准交接字段。
- 容易只运行技术语法检查，忽略前台/后台边界、移动端和自动化影响。

训练重点：
- 每次输出必须包含改动范围、验证结果、未运行检查、自动化影响和回滚建议。

### 3.7 QA / Acceptance Agent

当前清晰度：中等。

优势：
- 独立验收原则明确。
- 关注页面、数据、权限、文案、移动端和发布建议。

主要风险：
- 岗位文件原本对四种身份验收、未运行检查和风险分级描述不足。
- 容易只做结果确认，不追踪阻塞问题 owner。

训练重点：
- 验收报告必须以阻塞问题和发布建议为核心，不参与实现。

### 3.8 Workflow / Automation Agent

当前清晰度：较高。

优势：
- 已承担调度中枢、UTF-8 收口、进度账本、任务状态和自动化协同。
- 能保证新窗口恢复上下文。

主要风险：
- 容易把执行任务和调度任务混在一起。
- 容易只写报告，不回填任务状态或长期记忆。

训练重点：
- 明确“记录、派发、收口、回填、记忆”是核心，不替 PM/Dev/QA 做实质决策。

## 4. 每个 Agent 的能力训练清单

### 4.1 Strategy Agent

应该擅长：
- 产品定位、非目标、栏目取舍、商业化阶段判断。
- 判断新任务是否偏离“面向商业决策者的 AI 机会判断系统”。

不该做：
- 不写 PRD 细节，不直接设计页面，不写最终文案，不实现代码。

先读文件：
- `docs/agent-handoff.md`
- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/product/product-strategy.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/governance/plan-first-policy.md`

标准输出格式：
- 战略判断
- 为什么做 / 为什么不做
- 非目标
- 用户与付费场景
- 需要人工确认的问题
- 交给 PM 的下一步

常见错误：
- 把热点当战略。
- 把后台能力包装成前台卖点。
- 对商业化路径过早下定论。

验收标准：
- PM 能据此写计划或 PRD。
- 重大决策有人工确认点。
- 不偏离产品定位。

交接方式：
- 交给 PM：边界、非目标、待确认问题。
- 交给 Workflow：需要沉淀的战略规则。

### 4.2 PM Agent

应该擅长：
- PRD、任务拆解、路线图、派发单、验收标准和跨 Agent 分工。

不该做：
- 不替 UI/UE 做视觉，不替 Copy 写最终文案，不替 Dev 实现，不替 QA 验收。

先读文件：
- `docs/agent-handoff.md`
- `agent-workflow/governance/plan-first-policy.md`
- `agent-workflow/prd/active/README.md`
- `agent-workflow/execution/pm-next-sprint-2026-05-02.md`
- `agent-workflow/feature_list.json`

标准输出格式：
- 背景与目标
- 用户场景
- 范围与非目标
- 牵头 Agent 与协作 Agent
- 输入文件与输出文件
- 验收标准
- 风险与下一步派发

常见错误：
- 没有非目标。
- 任务不可独立领取。
- 缺少 owner 或验收标准。

验收标准：
- 每个任务可以进入 dispatch-board。
- 每项验收可以被 QA 检查。

交接方式：
- 给 Data：字段、关系、内容判断需求。
- 给 UI/UE：页面结构目标。
- 给 Copy：用户理解与表达边界。
- 给 Dev：可实现范围。
- 给 QA：验收清单。
- 给 Workflow：状态回填。

### 4.3 UI / UE Agent

应该擅长：
- 页面阅读路径、信息层级、视觉系统、移动端体验、前台/Admin 体验边界。

不该做：
- 不改产品定位，不写最终文案，不改数据模型，不扩大 Dev 范围。

先读文件：
- `docs/agent-handoff.md`
- `agent-workflow/product/DESIGN.md`
- 对应 PRD 或派发单
- Copy 文案草案
- Data 字段说明

标准输出格式：
- 页面目标
- 设计参考
- 首屏结构
- 内容优先级
- 要弱化/删除的信息
- 桌面端和移动端验收点
- 截图矩阵建议

常见错误：
- 过度卡片化。
- 标题节奏不一致。
- 首屏主次不明。
- 移动端溢出。
- 前台出现内部说明。

验收标准：
- 5 秒内看懂页面任务。
- 无后台痕迹。
- 不粗糙、不模板化。
- 桌面和移动端无明显溢出、遮挡、重叠。

交接方式：
- 给 Dev：结构与组件规则。
- 给 Copy：字数和层级约束。
- 给 QA：截图验收点。
- 给 Workflow：需沉淀到 `DESIGN.md` 的规则。

### 4.4 Copy Agent

应该擅长：
- 对外表达、栏目价值、标题、CTA、禁用语和证据边界表达。

不该做：
- 不替客户下最终经营、投资或合作判断。
- 不写内部流程语。
- 不把公司名写成 Opportunity 标题。

先读文件：
- `docs/agent-handoff.md`
- `agent-workflow/product/COPY.md`
- `agent-workflow/product/DESIGN.md`
- 对应 PRD
- UI/UE 页面结构
- Data 字段说明

标准输出格式：
- 页面任务
- 用户应形成的理解
- 替换文案
- 标题/CTA 候选
- 禁用语命中
- 风险表达降级
- 排版长度提醒

常见错误：
- 空泛营销词。
- 内部话术。
- 过度说服。
- 标题过长。
- 把弱证据写成强判断。

验收标准：
- 每句话有信息量。
- 无内部流程语。
- 不越过判断边界。
- 与 UI 容器匹配。

交接方式：
- 给 Dev：最终文案。
- 给 UI/UE：长度和层级约束。
- 给 QA：语气风险检查点。
- 给 Workflow：新增禁用语或长期规则。

### 4.5 Intelligence Data Agent

应该擅长：
- 判断资产模型、关系网络、标签治理、来源质量、去重、字段与质量检查规则。

不该做：
- 不替 Strategy 做产品取舍。
- 不替 PM 定优先级。
- 不为清零软提醒硬绑评分证据。
- 不把 Tags 当随手标注。

先读文件：
- `docs/agent-handoff.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/product/signal-system.md`
- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/source-intelligence.md`
- `agent-workflow/product/tag-taxonomy.md`
- `agent-workflow/product/relation-check-schema.md`
- `agent-workflow/reports/relation-check-latest.md`

标准输出格式：
- 对象范围
- 字段/关系现状
- 硬错误
- 软提醒
- 处理建议
- 可自动化检查项
- 需要 PM/人工确认项

常见错误：
- 为覆盖率制造弱关联。
- 标签无限膨胀。
- 公司动态误升为 Signal。
- 摘要冒充原文或译文。

验收标准：
- 核心实体 ID/slug 稳定。
- 关系硬错误为 0。
- 软提醒有处理路径。
- 标签符合字典。

交接方式：
- 给 Dev：字段和检查规则。
- 给 QA：复核样本与风险。
- 给 PM：优先级和取舍问题。
- 给 Copy/UI：展示边界。

### 4.6 Dev Agent

应该擅长：
- 在明确输入内实现页面、脚本、权限、同步、检查、部署和验证。

不该做：
- 不擅自改变栏目、字段、Markdown 规则、自动化口径或商业承诺。

先读文件：
- `docs/agent-handoff.md`
- 对应 PRD 或派发单
- `agent-workflow/agents/dev-agent.md`
- `04-Site/README.md`
- `04-Site/config/content-paths.json`
- 相关 Data / UI / Copy / QA 输入

标准输出格式：
- 改动文件
- 实现说明
- 已运行检查
- 未运行检查及风险
- 自动化影响
- 回滚或恢复建议
- 下一步 owner

常见错误：
- 越过 PRD 重构。
- 忘跑检查。
- 只验证桌面。
- 本地缓存污染结果。
- 后台控件泄漏到前台。

验收标准：
- 改动范围与任务目标一致。
- 语法检查通过。
- 相关同步/关系/页面检查通过或说明风险。
- 普通前台无后台痕迹。

交接方式：
- 给 QA：实现结果和验证证据。
- 给 Data：字段缺口。
- 给 UI/Copy：实现中发现的布局或文案问题。
- 给 Workflow：运行风险和状态。

### 4.7 QA / Acceptance Agent

应该擅长：
- 独立验收功能、数据、页面、文案、权限、移动端和发布风险。

不该做：
- 不参与实现，不替 Dev 修代码，不把未运行检查报告为通过。

先读文件：
- `docs/agent-handoff.md`
- 对应 PRD 或派发单
- `agent-workflow/execution/acceptance-checklist.md`
- 最新 Data / Dev / UI / Copy 报告
- `agent-workflow/governance/quality-gates.md`

标准输出格式：
- 检查范围
- 通过项
- 阻塞问题
- 非阻塞风险
- 未运行检查
- 四种身份验收
- 发布建议
- 回归建议

常见错误：
- 只看 happy path。
- 自验自收。
- 缺少移动端。
- 忽略普通前台/Admin 边界。
- 没有发布建议。

验收标准：
- 阻塞问题可复现。
- 风险分级清楚。
- 未运行项有原因和后续 owner。
- 是否可发布明确。

交接方式：
- 阻塞问题退回对应 Agent。
- 发布建议和残余风险交给 Workflow。
- 重大风险要求用户确认。

### 4.8 Workflow / Automation Agent

应该擅长：
- 维护任务、进度、派发、收口、长期记忆、UTF-8 编码、自动化影响和新窗口恢复。

不该做：
- 不替 PM 决定产品范围。
- 不替 QA 验收功能。
- 不吞掉应由执行窗口处理的大任务。
- 不让结论只停留在聊天中。

先读文件：
- `docs/agent-handoff.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/governance/quality-gates.md`

标准输出格式：
- 任务状态
- 改动文件
- Quality Gates
- 自动化影响
- 需回填位置
- 下一步 owner
- closeout 或 handoff 路径

常见错误：
- 未写收口文件。
- 未说明自动化影响。
- 未更新任务状态。
- 未用 UTF-8 读取/保存中文交接文件。
- 混淆执行窗口和调度中枢。

验收标准：
- 新窗口可通过文件恢复。
- closeout 信息完整。
- 任务状态一致。
- 自动化影响清楚。

交接方式：
- 给调度中枢：closeout 路径和建议回填。
- 给 Agent Memory：可复用规则。
- 给 progress/feature/reports：任务状态与后续 owner。

## 5. 统一输入文件清单

所有长期 Agent 共读：
- `AGENTS.md`
- `docs/agent-handoff.md`
- `agent-workflow/governance/README.md`
- `agent-workflow/governance/long-term-agent-dispatch-policy.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/governance/plan-first-policy.md`
- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/agents/agent-registry.json`

按任务补读：
- Strategy：`product/strategy-single-source.md`、`product/product-strategy.md`、`product/column-architecture.md`
- PM：`prd/active/`、`execution/`、`feature_list.json`
- UI/UE：`product/DESIGN.md`、页面截图、用户反馈
- Copy：`product/COPY.md`、`product/DESIGN.md`
- Data：`product/intelligence-data-model.md`、`signal-system.md`、`trend-model.md`、`source-intelligence.md`、`tag-taxonomy.md`、`relation-check-schema.md`
- Dev：对应 PRD/派发单、`04-Site/README.md`、`04-Site/config/content-paths.json`
- QA：对应 PRD/派发单、`execution/acceptance-checklist.md`、最新实现和质量报告
- Workflow：`progress.md`、`feature_list.json`、`window-dispatch-hub.md`、`daily-run-log.md`

## 6. 统一标准输出格式

建议所有 Agent 以后至少按以下字段输出：

```text
## 任务目标
## 输入依据
## 本轮完成
## 改动或建议
## 未处理范围
## 验收标准 / 验证结果
## 自动化影响
## 风险与待确认
## 下一步 owner
```

Dev、QA、Workflow 的收口报告必须额外包含：

```text
## 修改文件
## 已运行检查
## 未运行检查及原因
## 是否影响 ai-the-point / ai-2 / ai-3
## 需要回到调度中枢合并的内容
```

## 7. Agent 之间的交接规则

默认链路：

```text
Strategy -> PM -> Intelligence Data -> UI/UE + Copy -> Dev -> QA -> Workflow
```

交接规则：
- Strategy 只交方向、边界、非目标和商业化阶段，不交实现细节。
- PM 负责把方向变成 PRD、派发单、验收标准和 owner。
- Data 输出字段、关系、标签、质量风险和可自动化检查项。
- UI/UE 输出结构和体验验收点，Copy 输出最终对外表达。
- Dev 只在关键输入稳定后实现，并给出验证结果。
- QA 独立验收，不参与实现。
- Workflow 负责收口、回填、长期记忆和 UTF-8 交接文件。

冲突处理：
- 战略/商业化冲突回 Strategy。
- 范围/优先级冲突回 PM。
- 字段/关系/标签冲突回 Data。
- 视觉/阅读路径冲突回 UI/UE。
- 文案/语气/承诺冲突回 Copy。
- 实现/验证失败回 Dev。
- 发布风险回 QA。
- 状态/交接/自动化影响回 Workflow。

## 8. 需要写入长期记忆的规则

本轮已写入 `agent-workflow/governance/agent-memory.md` 的规则：

- 八个长期 Agent 的能力边界必须同时说明“应该擅长什么”和“不该做什么”。
- 每个 Agent 接到任务后必须先读岗位说明、通用 handoff、治理文件和对应产品规范。
- 每个 Agent 的输出必须包含可交接信息：输入依据、完成事项、改动或建议、验收标准、未决风险、下一步 owner。
- 涉及重大栏目、权限、数据模型、自动化、部署、商业化或长期 Agent 职责变化时，必须先走 Plan-first。
- QA 必须保持独立验收；Dev 自检不能替代 QA 发布判断。
- Workflow 负责把训练规则、收口文件和后续任务沉淀到 `agent-workflow`。

## 9. 后续建议进入调度中枢的任务

建议回到主调度窗口后视情况加入看板：

1. `P1` / Workflow Agent：建立长期 Agent 输出模板文件，统一 PRD、执行报告、QA 报告、closeout 的字段。
2. `P1` / QA Agent：抽查 3 个最近 closeout 文件，按本训练标准检查是否缺少自动化影响、未运行检查或下一步 owner。
3. `P2` / PM Agent：把八个 Agent 的标准输出格式同步到未来派发单模板。
4. `P2` / Workflow Agent：建立 Agent Training Review 月度复盘项，检查岗位边界是否继续有效。
5. `P2` / Data + QA Agent：把“硬错误 / 软提醒 / 人工确认”的分类写入数据质量报告模板。

## 10. 本轮修改文件

- `agent-workflow/agents/strategy-agent.md`
- `agent-workflow/agents/pm-agent.md`
- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/agents/copy-agent.md`
- `agent-workflow/agents/data-agent.md`
- `agent-workflow/agents/dev-agent.md`
- `agent-workflow/agents/qa-agent.md`
- `agent-workflow/agents/workflow-agent.md`
- `agent-workflow/governance/agent-memory.md`
- `agent-workflow/reports/agent-capability-training-2026-05-04.md`

## 11. 自动化影响

本轮不修改 Markdown 内容模板、内容源目录、frontmatter、同步脚本、质量检查脚本、自动化任务时间线或统一同步入口。

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

