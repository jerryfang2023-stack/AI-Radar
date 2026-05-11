---
task_id: WSD-20260507-19-v2-site-foundation-page-autopilot
board_id: V2-SITE-AUTO
title: V2 新站工程骨架与核心页面自动包
date: 2026-05-07
status: ready
lead_agent: Dev Agent
support_agents:
  - UI / UE Design Director
  - Copy Agent
  - Intelligence Data Agent
  - QA / Acceptance Agent
encoding: UTF-8
merged_scope:
  - V2-9 tokens / primitives / brand assets
  - V2-10 Home prototype
  - V2-11 core column pages
---

# V2-SITE-AUTO｜V2 新站工程骨架与核心页面自动包

## 1. 任务目标

在 `01-SiteV2/site/` 内建立 V2 新站工程第一版可运行页面骨架，并按已验收的 V2 产品、VI、页面母版、数据 schema 和 Copy 规范落地：

- 全站基础工程与设计 tokens。
- Home 首页。
- 今日要点。
- 关键信号。
- 机会解码。
- 商业内参。
- 详情页 / 长文阅读母版。
- 桌面与移动截图验收。

本任务是页面开发任务，必须走页面类硬闸门：UI/UE 规范表、Copy 规范表、Dev 按表实现、QA 桌面和移动截图验收。

## 2. 必读文件

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/v2/v2-vi-design-direction.md`
- `agent-workflow/v2/v2-navigation-column-finalization.md`
- `agent-workflow/v2/v2-page-master-spec.md`
- `agent-workflow/v2/v2-data-schema-minimum.md`
- `agent-workflow/v2/v2-copy-editorial-system.md`
- `agent-workflow/v2/v2-production-pipeline-cutover.md`
- `01-SiteV2/README.md`
- `01-SiteV2/site/README.md`
- `01-SiteV2/content/README.md`

## 3. 开发范围

### Stage A｜工程骨架与 tokens

要求：

- 在 `01-SiteV2/site/` 建立可运行的新站工程。
- 建立基础样式 tokens：颜色、字体、间距、线条、圆角、阅读宽度、移动端断点。
- 落地“极简澜线型”：澜线、地平线、留白、文字秩序、内参文件感。
- 不复用旧 `04-Site` 为生产工程；如复制少量工具函数，必须说明来源和适配理由。

### Stage B｜首页

必须包含：

- Hero：`观 AI 之澜，识商业之势`。
- 今日 3 条关键信号摘要。
- 今日要点预览。
- 机会解码预览。
- 商业内参样张与会员入口。

要求：

- 首屏必须露出下一段内容。
- 不做满屏孤岛。
- 不做后台大屏、雷达、机器人、蓝紫渐变或公开排行榜。

### Stage C｜核心栏目页

实现：

- 今日要点栏目页。
- 关键信号栏目页。
- 机会解码栏目页。
- 商业内参页面。

要求：

- 顶部导航只保留 `今日要点 / 关键信号 / 机会解码 / 商业内参`。
- The Point 不作为一级导航，只作为观点校准模块。
- Trends 不作为一级导航，只作为趋势背景 / 热力输入模块。

### Stage D｜详情页 / 阅读母版

实现至少一套可复用详情页母版：

- Signal 详情页。
- 今日要点详情页。
- 机会解码报告详情页。

可以先使用样例数据，但结构必须匹配 `v2-data-schema-minimum.md`。

### Stage E｜QA 截图与验收

必须完成：

- 桌面截图。
- 移动截图。
- 导航可点击性检查。
- 文案禁用语抽查。
- 页面不重叠、不溢出、不像后台、不像模板页。
- Design Director 评分表。

截图和验收报告保存到：

```text
agent-workflow/reports/v2-site-autopilot-2026-05-07/
```

## 4. 数据口径

- 可使用 `01-SiteV2/content/` 中 2026-05-06 已通过 `v2content` 的样本数据。
- 可以创建前端样例 JSON，但必须标记为 sample。
- 不做正式生产同步。
- 不执行 Netlify 部署。
- 不批量重写 V1 历史资产；历史资产重写另走后续 batch。

## 5. 禁止事项

- 不恢复旧 `04-Site` 为生产工程。
- 不把 The Point / Trends 放回一级导航。
- 不把商业热力图做成公开排行榜。
- 不出现后台字段、JSON、同步、Admin、恢复、编辑等普通前台痕迹。
- 不部署 Netlify。
- 不处理 `09-ai-news-radar/`。
- 不把 V1 文档原样搬进页面。

## 6. 验收标准

- 页面范围完整覆盖 Home / 今日要点 / 关键信号 / 机会解码 / 商业内参 / 详情页母版。
- UI/UE 与 `v2-page-master-spec.md` 一致。
- Copy 与 `v2-copy-editorial-system.md` 一致。
- 数据结构与 `v2-data-schema-minimum.md` 不冲突。
- 桌面和移动截图通过 QA。
- 本地可运行，返回预览地址。
- syntax / 相关前端检查通过。
- closeout 为 UTF-8 Markdown。

## 7. 新窗口提示词

```text
你是观澜AI V2 新站工程骨架与核心页面开发执行窗口。

请在 C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight 执行：

Task ID：WSD-20260507-19-v2-site-foundation-page-autopilot
看板编号：V2-SITE-AUTO
派发单：agent-workflow/execution/WSD-20260507-19-v2-site-foundation-page-autopilot.md

任务目标：
在 `01-SiteV2/site/` 建立 V2 新站第一版可运行页面骨架，合并执行 tokens / primitives、Home 首页、今日要点、关键信号、机会解码、商业内参和详情页母版。

必须先读取：
- AGENTS.md
- docs/README.md
- docs/agent-handoff.md
- agent-workflow/execution/dispatch-board.md
- agent-workflow/v2/v2-product-architecture-prd.md
- agent-workflow/v2/v2-vi-design-direction.md
- agent-workflow/v2/v2-navigation-column-finalization.md
- agent-workflow/v2/v2-page-master-spec.md
- agent-workflow/v2/v2-data-schema-minimum.md
- agent-workflow/v2/v2-copy-editorial-system.md
- agent-workflow/v2/v2-production-pipeline-cutover.md
- 01-SiteV2/README.md
- 01-SiteV2/site/README.md
- 01-SiteV2/content/README.md
- 本派发单

硬要求：
- 只在 `01-SiteV2/site/` 做 V2 新站，不恢复旧 `04-Site`。
- 顶部导航只保留：今日要点 / 关键信号 / 机会解码 / 商业内参。
- The Point 只作为观点校准模块，Trends 只作为趋势背景 / 热力输入模块。
- 必须有 UI/UE 规范表、Copy 规范表、Dev 按表实现、QA 桌面和移动截图验收。
- 可以使用 `01-SiteV2/content/` 中已通过 v2content 的样本数据，正式生产同步和 Netlify 部署本轮不做。

最终必须输出 UTF-8 closeout：
agent-workflow/reports/WSD-20260507-19-v2-site-foundation-page-autopilot-closeout.md

截图和验收材料保存到：
agent-workflow/reports/v2-site-autopilot-2026-05-07/

完成后回调度中枢：
收口：agent-workflow/reports/WSD-20260507-19-v2-site-foundation-page-autopilot-closeout.md
```
