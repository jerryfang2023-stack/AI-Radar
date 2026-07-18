# Agent System｜观澜 AI 新 Agent 使用指引

观澜 AI 当前采用：

```text
流程驱动的轻 Agent + 可复用 Skill
```

Agent 不再按栏目、页面或传统岗位碎片拆分。Agent 只负责生产流程中的关键责任节点；报告写作、页面生成、字体、监测 QC 等可复用能力沉淀为 Skill。

观澜 AI 的目标是 AI Native。Agent 不只是分工表，而要形成联动：持续感知外部变化，把来源和证据转化为结构化情报资产，再经由表达、实现、发布、复盘进入下一轮生产。所有 Agent 协作优先通过结构化 handoff、质量门和自动化任务衔接，避免靠长提示词和人工转述维持流程。

高风险流程统一套用 `context/06-execution-harness.md`：

- 每日监测 / Raw / Pool。
- Raw / Pool / Card 资产生成。
- 页面 / 文案 / Typography 生成或大改。

派发、执行和 closeout 都必须说明使用的 harness、固定读取、质量门和下游放行结论。

## 1. 四个 Agent 的定位

| Agent | 一句话职责 | 典型问题 |
|---|---|---|
| Product Commander | 入口、判断、派发、验收 | 要不要做？先做哪步？谁来做？怎么算完成？ |
| Intelligence Engine | 来源、证据、Raw / Pool / Card | 信息从哪里来？证据够不够？能不能入库？卡片怎么关联？ |
| Experience & Editorial | 内容、页面、表达、Copy / Typography | 页面怎么组织？文案怎么说？字体位置是否合规？像不像观澜？ |
| Build & Release | 实现、质量门、发布 | 怎么落到代码和脚本？检查是否通过？能不能发布？ |

## 2. 推荐工作流

### 标准任务流

```text
Product Commander
  -> Intelligence Engine
  -> Experience & Editorial
  -> Build & Release
  -> Product Commander 验收
```

不是每个任务都要走完整链路。调度时按任务性质取最短路径。

AI Native 联动闭环：

```text
感知 -> 判断 -> 表达 -> 发布 -> 复盘 -> 规则更新
```

其中 Intelligence Engine 负责感知和证据资产，Product Commander 负责判断和取舍，Experience & Editorial 负责表达，Build & Release 负责实现和发布，复盘结果再回到规则、Skill、自动化和 Agent handoff 中。

### 页面 / 栏目任务

```text
Product Commander 定范围
  -> 套用 页面 / 文案 / Typography Harness
  -> Experience & Editorial 出结构、Typography 表、Copy 表
  -> Build & Release 按表实现
  -> Product Commander 验收
```

页面任务不能让 Build & Release 临场补核心文案、临场定字号、临场改产品结构。

### 每日监测 / 内容资产任务

```text
Product Commander 定边界
  -> 套用 每日监测 或 Raw / Pool / Card 资产 Harness
  -> Intelligence Engine 定来源、证据、Raw / Pool / Card 规则
  -> Build & Release 改脚本和质量门
  -> Product Commander 验收
```

如果涉及前台展示文案，再插入 Experience & Editorial。

### 自动化 / 脚本 / 发布任务

```text
Product Commander 定允许范围
  -> Intelligence Engine 提供数据规则
  -> Build & Release 实现、检查、说明风险
  -> Product Commander 验收
```

GitHub Pages 发布必须等用户明确确认；Netlify 已退役，不再作为网站部署服务。

## 3. 各 Agent 怎么用

### Product Commander

使用场景：

- 新任务进入。
- 任务拆分、合并、排序。
- 判断是否需要先计划。
- 判断是否进入开发。
- 输出派发单。
- 接收 closeout。
- 验收是否 accepted。
- 更新看板、进度和当前状态。

输出：

- 产品判断。
- 任务边界。
- 派发单。
- 验收标准。
- 看板状态。

不做：

- 不直接写页面。
- 不直接改代码。
- 不替 Intelligence Engine 编造证据。
- 不替 Experience & Editorial 临场写前台文案。

### Intelligence Engine

使用场景：

- 每日监测规则。
- 来源等级。
- Raw / Pool 生成。
- 变化卡、案例卡、观点卡、趋势卡；观点卡必须执行 `feature` / `sidebar` / `archive` / `discard` 四档评级。
- 标签、关系、去重。
- 内容资产能否进入前台。
- 证据是否足够。

输出：

- 来源规则。
- 证据规则。
- Raw / Pool / Card 结构。
- 质量报告。
- 标签和关系建议。

不做：

- 不决定一级栏目商业取舍。
- 不写最终前台表达。
- 不为了凑数量把弱来源包装成强证据。

### Experience & Editorial

使用场景：

- 首页、栏目页、详情页、内参页结构。
- 页面信息架构。
- VI、字体、排版、节奏。
- Copy-first 文案表。
- Typography 页面位置表。
- 普通页面文案、按钮、标签、空状态。
- 内容是否像观澜 AI。

输出：

- 页面结构表。
- Typography 表。
- Copy 表。
- 栏目表达建议。
- 桌面端体验验收点。

不做：

- 不改监测算法。
- 不部署。
- 不绕过 Copy / Typography 表。
- 不把页面写成普通新闻站、工具站或营销页。

### Build & Release

使用场景：

- 网站页面实现。
- 脚本和自动化实现。
- 数据同步。
- 质量门运行。
- GitHub Pages 状态处理。
- 发布风险说明。

输出：

- 代码或脚本改动。
- 验证结果。
- 发布风险。
- 回滚说明。
- closeout。

不做：

- 不自行改变产品范围。
- 不临场补关键文案。
- 不自行新增字体体系。
- 不绕过质量门。
- 不在未确认时推送或部署。

## 4. Skill 怎么插入

Skill 是能力模块，不是流程 owner。

| 能力 | 优先使用 |
|---|---|
| 每日监测 | `agent-workflow/skills/guanlan-daily-monitor/SKILL.md` |
| 监测预闸门 | `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md` |
| Raw / Pool 质检 | `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md` |
| V4 页面字段与表达 | `context/frontstage-page-contracts.md` + 目标数据合同 |
| 报告页表达 | 对应周报 / 月报页面生成 Skill |
| 字体位置审查 | `guanlan-typography-qc` |

原则：

- Agent 决定流程和责任。
- Skill 提供专门能力。
- 栏目能力优先做 Skill，不新增常驻 Agent。
- 新 Skill 必须有明确适用场景、输入、输出和不适用场景。

## 5. 常见任务怎么派

| 用户任务 | 牵头 Agent | 需要的 Skill / 规则 |
|---|---|---|
| 新增栏目或调整导航 | Product Commander | Plan-first、产品结构 |
| 优化首页 / 栏目页 / 详情页 | Experience & Editorial -> Build & Release | 页面 / 文案 / Typography Harness、VI、Typography、Copy |
| 修改普通页面文案 | Experience & Editorial | V4 页面合同、目标数据合同、VI |
| 每日监测规则调整 | Intelligence Engine -> Build & Release | 每日监测 Harness、daily monitor、monitor QC |
| Raw / Pool 质量下降 | Intelligence Engine | 每日监测 Harness、monitor quality gate、source rules |
| 自动化脚本改造 | Build & Release | 对应自动化 prompt / quality gates |
| 内容卡片规则调整 | Intelligence Engine | Raw / Pool / Card 资产 Harness、card copy governance、tag taxonomy |
| 发布 / 部署 | Build & Release | quality gates，用户确认 |
| closeout 验收 | Product Commander | 派发单硬闸门 |

## 6. 调度窗口使用口诀

```text
先问 Product Commander：要不要做、谁来做、怎么算完成。
证据和入库问 Intelligence Engine。
页面和表达问 Experience & Editorial。
代码、脚本、检查和发布问 Build & Release。
具体能力优先找 Skill。
```

## 7. 什么时候不能直接执行

以下情况必须先由 Product Commander 判断：

- 新增、删除或合并一级栏目。
- 改变每日监测生产线。
- 改变 Raw / Pool / Card schema。
- 改变会员、权限、Admin、支付或发布路径。
- 改变 GitHub Pages / 部署策略。
- 用户没有确认但任务会影响正式网站。

## 8. 不再恢复的模式

以下拆分不再作为常驻 Agent：

- Strategy Agent
- PM Agent
- UI / UE Agent
- Copy Agent
- Dev Agent
- QA Agent
- Workflow Agent
- Column-specific Agent

这些能力现在由 4 个流程 Agent + 对应 Skill 承接。

## 9. 新增 Agent 的门槛

只有同时满足以下条件，才考虑新增常驻 Agent：

- 它对应稳定流程节点，而不是临时任务。
- 现有 4 个 Agent + Skill 不能覆盖。
- 有明确输入、输出、验收和写入边界。
- 不会增加新窗口启动阅读负担。
- 用户明确同意。

默认情况下，新增能力应写成 Skill，而不是新增 Agent。
