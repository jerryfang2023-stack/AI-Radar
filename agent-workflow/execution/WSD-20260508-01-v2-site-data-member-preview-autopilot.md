---
task_id: WSD-20260508-01-v2-site-data-member-preview-autopilot
board_id: V2-DATA-PREVIEW-AUTO
title: V2 站点数据生成器、会员状态与 Netlify 预览自动包
date: 2026-05-08
status: ready
lead_agent: Dev Agent
support_agents:
  - Intelligence Data Agent
  - UI / UE Design Director
  - Copy Agent
  - QA / Acceptance Agent
  - Workflow / Automation Agent
encoding: UTF-8
merged_scope:
  - V2 site data generator
  - member-state rendering
  - preview deployment readiness
  - Netlify preview deploy
---

# V2-DATA-PREVIEW-AUTO｜V2 站点数据生成器、会员状态与 Netlify 预览自动包

## 1. 任务目标

在一个执行窗口中连续完成：

1. 从 `01-SiteV2/content/` 生成 V2 站点可消费的数据对象。
2. 将 `01-SiteV2/site/` 从纯 sample 数据推进到可读取生成数据的预览站。
3. 实现商业内参相关的基础会员状态展示：公开预览 / 登录提示 / 会员全文占位边界。
4. 做 Netlify 预览部署准备，并在满足检查时发布 Netlify Preview。
5. 输出桌面 / 移动截图、数据校验、部署记录、回滚方案和 closeout。

本任务目标是 **Preview 可验收版本**，不是生产域名正式切换。

## 2. 必读文件

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/v2/v2-navigation-column-finalization.md`
- `agent-workflow/v2/v2-page-master-spec.md`
- `agent-workflow/v2/v2-data-schema-minimum.md`
- `agent-workflow/v2/v2-copy-editorial-system.md`
- `agent-workflow/v2/v2-production-pipeline-cutover.md`
- `agent-workflow/v2/quality-gates/v2-content-quality-gate.md`
- `01-SiteV2/site/README.md`
- `01-SiteV2/content/README.md`
- `agent-workflow/reports/WSD-20260507-19-v2-site-foundation-page-autopilot-closeout.md`
- `agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md`

## 3. 阶段顺序

### Stage A｜数据生成器

目标：

- 新增 V2 site data generator，将 `01-SiteV2/content/` 的 Markdown 内容转成站点数据对象。
- 生成路径建议：

```text
01-SiteV2/site/data/site-content.json
01-SiteV2/site/data/site-content.js
```

最低覆盖：

- 今日要点。
- 关键信号 3 条。
- 机会解码 1 条。
- 商业内参预览数据。
- Point Calibration。
- Trend Context。
- 反证与边界。

要求：

- 不读取旧 `04-Site`。
- 不读取 `09-ai-news-radar/`。
- 不把 legacy candidate 直接前台发布，除非明确标记为 candidate / internal。
- 每条前台内容必须保留来源、日期、id / slug、关系字段和证据边界。

### Stage B｜站点接入生成数据

目标：

- `01-SiteV2/site/` 使用生成数据渲染核心页面。
- sample 数据可以保留为 fallback，但不能再作为唯一数据来源。

必须检查：

- Home 是否读取今日 3 条关键信号。
- 今日要点是否读取 2026-05-07 内容。
- Signal 详情是否能展示 6 维分析。
- 机会解码是否能展示机会报告。
- 商业内参是否能展示预览和会员边界。

### Stage C｜会员状态展示

实现基础状态，不做真实账号系统：

| 状态 | 要求 |
|---|---|
| public | 可看公开摘要、样张和边界 |
| logged-in | 可看更完整预览，但不越过会员全文 |
| member | 可展示会员全文样张 / 占位状态 |

要求：

- 不接入真实支付。
- 不接入真实身份服务。
- 不泄露后台字段。
- 商业内参不做公开热力排行榜。

### Stage D｜预览部署准备

必须完成：

- 检查 `netlify.toml` 发布目录为 `01-SiteV2/site`。
- 运行语法检查。
- 运行 `v2content`。
- 本地 HTTP 检查全部核心页面。
- 写明回滚方式。

### Stage E｜Netlify Preview

若 Netlify CLI / 认证可用：

- 发布 Netlify preview。
- 返回 preview URL。
- 不切生产域名。
- 不执行 production deploy，除非用户另行确认。

若 Netlify CLI / 认证不可用：

- 不硬卡任务。
- 输出阻塞原因、需要的授权或命令。
- 本地 preview 仍必须可运行。

### Stage F｜QA 验收

必须输出：

- 桌面截图。
- 移动截图。
- 数据加载检查。
- 会员状态截图或状态说明。
- Preview URL 或阻塞原因。
- 回滚方案。

截图和报告保存到：

```text
agent-workflow/reports/v2-data-preview-autopilot-2026-05-08/
```

## 4. 禁止事项

- 不恢复旧 `04-Site`。
- 不处理 `09-ai-news-radar/`。
- 不把 The Point / Trends 放回一级导航。
- 不把商业热力图做成公开排行榜。
- 不部署 production。
- 不切换正式域名。
- 不接入真实支付或真实身份。
- 不把 legacy candidates 未经精修直接作为正式前台内容。

## 5. 验收标准

- V2 site data generator 可运行。
- `01-SiteV2/site/data/site-content.json` 或等价数据产物生成成功。
- 站点核心页面读取生成数据，而非只依赖 sample。
- 商业内参 public / logged-in / member 三种展示边界清楚。
- 本地核心页面 HTTP 检查通过。
- 桌面和移动截图验收通过。
- `v2content` 通过。
- syntax 通过。
- Netlify Preview 成功，或写清认证 / CLI 阻塞原因。
- closeout 为 UTF-8 Markdown。

## 6. 新窗口提示词

```text
你是观澜AI V2 数据生成器、会员状态与 Netlify Preview 执行窗口。

请在 C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight 执行：

Task ID：WSD-20260508-01-v2-site-data-member-preview-autopilot
看板编号：V2-DATA-PREVIEW-AUTO
派发单：agent-workflow/execution/WSD-20260508-01-v2-site-data-member-preview-autopilot.md

任务目标：
把已经 accepted 的 `01-SiteV2/site/` 静态骨架推进到可预览验收版本：生成 V2 站点数据对象、接入核心页面、实现基础会员状态展示，并完成 Netlify Preview 准备和预览部署。

必须先读取：
- AGENTS.md
- docs/README.md
- docs/agent-handoff.md
- agent-workflow/execution/dispatch-board.md
- agent-workflow/v2/v2-product-architecture-prd.md
- agent-workflow/v2/v2-navigation-column-finalization.md
- agent-workflow/v2/v2-page-master-spec.md
- agent-workflow/v2/v2-data-schema-minimum.md
- agent-workflow/v2/v2-copy-editorial-system.md
- agent-workflow/v2/v2-production-pipeline-cutover.md
- agent-workflow/v2/quality-gates/v2-content-quality-gate.md
- 01-SiteV2/site/README.md
- 01-SiteV2/content/README.md
- agent-workflow/reports/WSD-20260507-19-v2-site-foundation-page-autopilot-closeout.md
- agent-workflow/reports/WSD-20260507-18-v2-production-content-migration-autopilot-closeout.md
- 本派发单

硬要求：
- 只使用 `01-SiteV2/content/` 和 `01-SiteV2/site/`。
- 不恢复旧 `04-Site`。
- 不处理 `09-ai-news-radar/`。
- 不做 production deploy，不切正式域名。
- 不把 legacy candidates 未经精修直接作为正式前台内容。
- 商业内参必须有 public / logged-in / member 三种展示边界，但不接入真实支付或真实身份。
- 如果 Netlify CLI / 认证不可用，写清阻塞原因；不要伪造 preview URL。

最终必须输出 UTF-8 closeout：
agent-workflow/reports/WSD-20260508-01-v2-site-data-member-preview-autopilot-closeout.md

截图和验收材料保存到：
agent-workflow/reports/v2-data-preview-autopilot-2026-05-08/

完成后回调度中枢：
收口：agent-workflow/reports/WSD-20260508-01-v2-site-data-member-preview-autopilot-closeout.md
```
