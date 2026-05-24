# 观澜AI Codex 工作入口

本文件是唯一默认入口。它是路由表，不是百科全书。

## 总原则

- 不要在任务开始时扫描全部 Markdown。
- 默认只读取本文件、必要的 `context/` 文件和任务指定文件。
- 补读文档中的二级引用不自动继续读取。
- 每个任务最多补读 1-3 个单一真源；超出必须先说明原因。
- 如果上下文不足，先说明缺什么，不要自行扩大读取范围。

## 当前有效上下文

当前有效上下文只以 `context/` 和 `skills/` 为准。

| 文档 | 用途 |
|---|---|
| `context/00-current-state.md` | 当前项目状态 |
| `context/01-product-map.md` | 产品结构、栏目、数据流 |
| `context/02-vi-style.md` | VI、字体、页面视觉 |
| `context/03-copy-style.md` | 全站基础文案 |
| `context/04-qc-rules.md` | 通用质量门禁 |
| `context/05-daily-monitoring.md` | 每日监测最小上下文 |
| `context/06-execution-harness.md` | 高风险流程执行外壳 |
| `context/context-index.md` | 当前上下文索引 |
| `context/task-start-template.md` | 新窗口任务启动模板 |

## 项目当前口径

- 项目名称：观澜AI｜WaveSight AI。
- 当前版本：V2.2。
- 产品定义：观澜 AI 是一个由 Agent 驱动的 AI 商业情报系统。
- 核心逻辑：持续监测全球 AI 商业变化，将外部信息转化为结构化情报资产，再生成面向企业老板、资源型合伙人、行业操盘手的商业信号、机会判断、AI 内参和 AI 商业热力图。
- 系统定位：观澜 AI 不是内容站，而是一个会持续感知、判断、表达、发布、复盘和进化的 AI 商业决策系统。
- AI Native 方向：后续能力建设优先让 Agent 之间形成联动，通过结构化 handoff、质量门和自动化任务串联 Source / Evidence / Asset / Editorial / Build / Review。
- 当前前台导航：今日观察 / 商业信号 / 趋势追踪 / 商业内参。
- 当前开发阶段：V2.2-only 生产开发。
- 已停止的网站版本、内容日更和自动化任务不作为当前执行依据。

## Agent 与 Skill 设置

当前采用“流程驱动的轻 agent + 可复用 skill”。

详细使用说明见 `agent-workflow/agents/README.md`。`AGENTS.md` 只保留路由摘要，不展开完整岗位手册。

| Agent | 流程节点 | 文件 |
|---|---|---|
| Product Commander | Intake / Decision / Dispatch | `agent-workflow/agents/product-commander-agent.md` |
| Intelligence Engine | Source / Evidence / Asset | `agent-workflow/agents/data-agent.md` |
| Experience & Editorial | Content / UX / Expression | `agent-workflow/agents/experience-editorial-agent.md` |
| Build & Release | Build / Gate / Release | `agent-workflow/agents/build-release-agent.md` |

规则：

- Agent 不按栏目拆分。
- 栏目写作、文案、字体、监测 QC、今日观察等能力沉淀为 Skill。
- 后续新增栏目能力优先新增或更新 Skill，不新增常驻 Agent。
- 新增常驻 Agent 必须对应稳定流程节点，且不能被现有 Agent + Skill 覆盖。

## 任务路由

高风险流程先读取 `context/06-execution-harness.md`，再按对应任务读取最小上下文。当前高风险流程为：

- 每日监测 / Raw / Pool。
- Raw / Pool / Card 资产生成。
- 页面 / 文案 / Typography 生成或大改。

### 页面设计 / UI / 排版

读取：

1. `context/00-current-state.md`
2. `context/02-vi-style.md`
3. `context/06-execution-harness.md`
4. 任务指定页面或代码文件

按需：

- 字体问题读 `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`。
- 动效问题读 `docs/brand/wavesight-ai-vi/motion-tokens.css`。
- SVG / Logo 问题读 `docs/brand/wavesight-ai-vi/executable-svg/README.md`。

### 文案 / 栏目命名 / CTA

读取：

1. `context/03-copy-style.md`
2. `skills/guanlan-copy-style/SKILL.md`

按需：

- 普通短文案 QC 调用 `skills/guanlan-copy-style-qc/SKILL.md`。
- 专题内容调用对应专题 Skill。

### 今日观察

读取：

1. `context/00-current-state.md`
2. `context/05-daily-monitoring.md`
3. `context/06-execution-harness.md`
4. 对应今日观察 pitch / writer / QC Skill
5. 当日已放行 Raw / Pool / Card / Case / Trend 素材

### 每日监测 / Raw / Pool

读取：

1. `context/05-daily-monitoring.md`
2. `context/06-execution-harness.md`
3. `skills/guanlan-daily-monitor/SKILL.md`
4. `skills/guanlan-monitor-quality-gate/SKILL.md`
5. `skills/guanlan-daily-monitor-qc/SKILL.md`

按需：

- 来源等级：`agent-workflow/product/source-intelligence.md`
- 证据字段与 Pool 分流：`agent-workflow/product/evidence-and-routing-rules.md`
- 写入目录：`01-SiteV2/content/README.md`
- JSON 配置只在改配置或排错时打开。

### 产品 / 栏目 / 数据结构

读取：

1. `context/01-product-map.md`
2. 与任务直接相关的一个产品真源

按需：

- `agent-workflow/product/strategy-single-source.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/product/tag-taxonomy.md`

### 质检 / 收口 / 发布检查

读取：

1. `context/04-qc-rules.md`
2. 当前任务 closeout 或派发单
3. 任务对应专项 Skill 或质量门

按需：

- `agent-workflow/governance/quality-gates.md`
- `agent-workflow/governance/window-dispatch-hub.md`

## 冲突处理

如果多个文档冲突，按以下顺序：

1. 用户当前明确指令。
2. 对应专题 Skill。
3. `context/` 当前文档。
4. 当前产品 / VI / Copy 真源。
5. 已删除文档不作为执行依据；需要追溯时先说明缺口。

## 硬停顿

遇到以下情况，先停下并说明需要用户确认：

- 需要新增或改变一级导航。
- 需要改变 VI 正式资产、Logo、SVG 生成脚本或品牌 token。
- 需要修改自动化本体、部署、GitHub、Netlify 配置。
- 任务会继承 failed / abandoned / stopped 成果。
- 需要用户产品取舍或商业判断。
- 页面任务缺少 Typography 页面位置表、Copy-first 文案表或桌面验收要求。

## 交付要求

- 修改 Markdown 必须保存为 UTF-8。
- 明确无效、重复或不相干的文档可以直接删除。
- 不把过程内容合并进 `AGENTS.md`。
- 新增当前规范必须放入 `context/` 或 `skills/`。
- 每次完成后说明：改了什么、是否删除无效文件、运行了哪些验证。
