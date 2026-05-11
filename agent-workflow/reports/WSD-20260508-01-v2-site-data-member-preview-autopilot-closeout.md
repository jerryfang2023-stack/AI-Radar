---
title: V2-DATA-PREVIEW-AUTO Closeout
date: 2026-05-08
task_id: WSD-20260508-01-v2-site-data-member-preview-autopilot
board_id: V2-DATA-PREVIEW-AUTO
status: completed / local-preview-ready / netlify-paused-after-user-instruction
owner: Dev Agent / Intelligence Data Agent / QA Agent / Workflow Agent
encoding: UTF-8
---

# V2-DATA-PREVIEW-AUTO Closeout

## 1. 结果

本轮已把 `01-SiteV2/site/` 从 sample-only 推进到 generated-data driven 的本地可验收版本。

完成：

- 新增 V2 站点数据生成器：`01-SiteV2/site/scripts/sync-v2-site-data.mjs`。
- 从 `01-SiteV2/content/` 的 2026-05-07 内容生成：
  - `01-SiteV2/site/data/site-content.json`
  - `01-SiteV2/site/data/site-content.js`
- `assets/app.js` 优先读取 `window.WaveSightContent`，保留 `WaveSightSample` 作为 fallback。
- Home / 今日要点 / 关键信号 / 机会解码 / 商业内参 / 三个详情母版均可读取生成数据。
- 商业内参页实现 `public / logged-in / member` 三种展示边界，使用 `brief.html?state=public|logged-in|member` 切换。
- 本地 HTTP 与桌面 / 移动截图验收完成。

## 2. 数据生成范围

数据来源只使用：

- `01-SiteV2/content/04-selected-signals/2026-05-07-front-signals.md`
- `01-SiteV2/content/03-structured-signals/2026-05-07-structured-signals.md`
- `01-SiteV2/content/06-insights/2026-05-07-insights.md`
- `01-SiteV2/content/07-points/2026-05-07-point-calibration.md`
- `01-SiteV2/content/08-opportunities/deep-dive/2026-05-07-opportunity-deep-dive.md`
- `01-SiteV2/content/05-trend-chain/2026-05-07-trend-classification.md`
- `01-SiteV2/content/10-databases/risks/2026-05-07-risk-database-update.md`

未读取旧 `04-Site`，未处理 `09-ai-news-radar/`，未把 legacy candidates 直接前台发布。

生成对象最低覆盖：

- 今日要点：2026-05-07 三条 Insight 转为日更判断。
- 关键信号：3 条 Front Signal，带稳定 ID、slug、来源路径、关系字段和六维分析。
- 机会解码：`OPP-20260507-01｜企业 Agent 控制与审计层`。
- 商业内参：Preview.001，含热力摘要、观点校准、趋势背景和反证边界。
- Point Calibration：读取 2026-05-07 follow-builders 改写结果。
- Trend Context：读取 2026-05-07 trend classification。

## 3. 会员状态边界

本轮只实现基础展示状态，不接入真实身份、支付或云端权限。

| 状态 | 入口 | 展示 |
|---|---|---|
| public | `brief.html?state=public` | 本期主题、核心判断和少量热力摘要 |
| logged-in | `brief.html?state=logged-in` | 目录、部分试读和往期入口说明 |
| member | `brief.html?state=member` | 高热三元组、证据摘要、观点校准、趋势背景和反证边界样张 |

商业内参没有做公开排行榜，没有暴露后台字段或生成流程。

## 4. QA 截图与本地检查

截图目录：

```text
agent-workflow/reports/v2-data-preview-autopilot-2026-05-08/
```

已生成：

- Home：桌面 / 移动
- 今日要点：桌面 / 移动
- 关键信号：桌面 / 移动
- Signal 详情：桌面 / 移动
- 机会解码：桌面 / 移动
- 机会解码详情：桌面 / 移动
- 商业内参 public：桌面 / 移动
- 商业内参 logged-in：桌面 / 移动
- 商业内参 member：桌面 / 移动

浏览器检查结果写入：

```text
agent-workflow/reports/v2-data-preview-autopilot-2026-05-08/browser-check.json
```

结论：

- 18 项页面 / 状态 / 视口检查全部 200。
- 全部确认读取 `window.WaveSightContent`。
- 桌面与移动均无横向溢出。

本地 HTTP 检查通过：

- `/`
- `/daily.html`
- `/signals.html`
- `/signal-detail.html?id=企业-agent-控制平面开始成为新预算层`
- `/opportunities.html`
- `/opportunity-detail.html`
- `/brief.html?state=public`
- `/brief.html?state=logged-in`
- `/brief.html?state=member`
- `/data/site-content.json`
- `/data/site-content.js`

## 5. Quality Gates

已通过：

```powershell
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-07
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/dev-server.mjs
node --check 01-SiteV2/site/data/site-content.js
node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-07
node agent-workflow/tools/run-quality-gates.mjs syntax
```

报告：

- `agent-workflow/reports/quality-gates-v2content-2026-05-07-20260507-163828.md`
- `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-163828.md`

## 6. Netlify 状态

`netlify.toml` 当前发布目录为：

```toml
[build]
publish = "01-SiteV2/site"
```

本轮按派发单曾尝试 Netlify Preview：

1. 从项目根目录上传失败，Netlify MCP 返回 `500 Internal Server Error`。
2. 改从 `01-SiteV2/site/` 发布目录上传成功，Deploy ID：`69fcc0a7b0abf8160747727f`，状态 `ready`。
3. 该上传在用户发出“暂时不上传到netlify”之前已完成。

用户最新指令：

```text
暂时不上传到netlify
```

因此本 closeout 之后不再进行任何 Netlify 上传、复传或远端发布检查。本任务状态按“本地 preview 可验收，Netlify 后续上传暂停”处理。

未切正式域名，未接入真实身份或支付，未继续触发 production 发布。

## 7. 修改文件

- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/index.html`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/signals.html`
- `01-SiteV2/site/opportunities.html`
- `01-SiteV2/site/brief.html`
- `01-SiteV2/site/daily-detail.html`
- `01-SiteV2/site/signal-detail.html`
- `01-SiteV2/site/opportunity-detail.html`
- `agent-workflow/reports/v2-data-preview-autopilot-2026-05-08/`
- `agent-workflow/reports/WSD-20260508-01-v2-site-data-member-preview-autopilot-closeout.md`

## 8. 自动化影响

- 旧 `ai-the-point`、`ai-2`、`ai-3` 已停止，本轮未恢复。
- 新增的是 V2 本地站点数据生成器，不改变 V2 内容生产目录口径。
- 后续如果把本脚本并入 V2 日常发布链，需要另派任务补 V2 relation gate、备份、回滚和 Git / Netlify 发布闸门。

## 9. 回滚方式

本地回滚：

1. 删除 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`。
2. 删除 `01-SiteV2/site/data/site-content.json` 与 `site-content.js`。
3. 将 HTML 页面移除 `data/site-content.js` 引用，恢复只读 `sample-content.js`。
4. 将 `assets/app.js` 恢复为只读 `window.WaveSightSample`。
5. 移除 `brief.html` 的会员状态预览块和对应 CSS。

远端说明：

- 用户已要求暂不继续上传 Netlify，本轮不再做远端回滚操作。
- 如需处理已产生的 Deploy ID 或恢复远端旧版本，应另派 Netlify / release 管理任务。

## 10. 建议状态

建议调度中枢标记：

```text
completed / local-preview-ready / netlify-paused-after-user-instruction
```

下一步建议：

- 本地继续验收 V2 generated-data 页面。
- 暂停 Netlify 上传，等用户重新确认后再进行远端预览发布或回滚处理。
