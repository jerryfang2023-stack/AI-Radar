---
task_id: WSD-20260522-site-page-module-layer1-diagnostic
date: 2026-05-22
status: ready
owner: Experience & Editorial / Product Commander
framework: WSD-20260522-site-page-module-governance-framework
---

# WSD-20260522 Site Page / Module Layer 1 Diagnostic

## 任务性质

这是网站模块与页面治理的阶段 1 诊断任务。

只做诊断和方案，不直接改代码、不生成页面、不同步前台、不部署。

## 必读

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/01-product-map.md`
4. `context/02-vi-style.md`
5. `context/03-copy-style.md`
6. `context/06-execution-harness.md`
7. `agent-workflow/execution/WSD-20260522-site-page-module-governance-framework.md`

按需只补读：

- `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/product/column-architecture.md`
- 当前网站代码中与首页、栏目页、详情页直接相关的文件

禁止读取历史 V1 / V2.0 页面方案、旧失败任务、旧质检流程或已删除文档。

## 诊断范围

### 1. 首页

- 首页当前是否清楚表达观澜 AI 的产品定义。
- 今日观察、商业信号、趋势追踪、商业内参等模块是否有清楚主次。
- 哪些模块重复、弱、空泛或影响阅读节奏。
- 首页是否需要重新组织第一屏、核心判断区、栏目入口和内容流。

### 2. 栏目页

覆盖当前前台栏目：

- 今日观察。
- 商业信号。
- 趋势追踪。
- 商业内参。

检查：

- 每个栏目是否有明确价值。
- 栏目之间是否重复或边界不清。
- 列表页模块是否过多、过散或像普通资讯站。
- 每个栏目应该展示哪些字段、卡片和入口。

### 3. 详情页

检查：

- 今日观察详情页。
- 商业信号详情页。
- 趋势 / 内参类详情页。
- 长文阅读和卡片阅读是否清楚。
- 标题、摘要、判断、来源、边界、相关内容是否有合理顺序。

### 4. 模块体系

输出每个模块的处理建议：

- 保留。
- 合并。
- 删除。
- 弱化。
- 强化。
- 重写。
- 新增。

不得为了完整保留所有模块。

### 5. 文案与视觉风险

只做诊断，不改文案。

指出：

- 哪些文案像 AI 模板。
- 哪些模块缺少商业判断。
- 哪些页面字体层级、位置、留白或卡片节奏不稳定。
- 哪些公开字段暴露了内部生产语言。

## 输出要求

输出 closeout：

```text
agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md
```

closeout 必须包含：

1. 首页诊断。
2. 栏目页诊断。
3. 详情页诊断。
4. 模块保留 / 合并 / 删除 / 新增建议表。
5. 页面类型优先级。
6. 阶段 2A 是否可以启动。
7. 阶段 2A 需要输出哪些规格表。

## 新窗口执行指令

```text
请执行任务：WSD-20260522-site-page-module-layer1-diagnostic

你是 Experience & Editorial + Product Commander 协作窗口。本任务是网站模块与页面治理的阶段 1 诊断，不是开发任务。

只读取：
1. AGENTS.md
2. context/00-current-state.md
3. context/01-product-map.md
4. context/02-vi-style.md
5. context/03-copy-style.md
6. context/06-execution-harness.md
7. agent-workflow/execution/WSD-20260522-site-page-module-governance-framework.md

按需只补读：
- docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md
- agent-workflow/product/DESIGN.md
- agent-workflow/product/column-architecture.md
- 当前网站代码中与首页、栏目页、详情页直接相关的文件

诊断范围：
- 首页。
- 今日观察栏目页与详情页。
- 商业信号栏目页与详情页。
- 趋势追踪栏目页与详情页。
- 商业内参栏目页与详情页。
- 导航、页头、页脚、卡片模块、内容字段展示。

不要改代码。
不要生成新页面。
不要同步前台。
不要部署。
不要推送 GitHub / Netlify。
不要重复 Source / Raw / Pool / Card 治理。

请输出：
1. 首页诊断。
2. 栏目页诊断。
3. 详情页诊断。
4. 模块保留 / 合并 / 删除 / 新增建议表。
5. 阶段 2A 需要做的页面规格表清单。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-site-page-module-layer1-diagnostic-closeout.md
```
