---
title: WSD-20260505-04 P1-4B Stop And Restore Baseline Closeout
date: 2026-05-05
type: closeout
status: accepted
task_id: WSD-20260505-04-p1-4b-stop-restore-baseline
board_id: P1-4C
owner: dev / qa / workflow
encoding: UTF-8
---

# WSD-20260505-04 P1-4B Stop And Restore Baseline Closeout

## 1. 结论

`P1-4B / WSD-20260505-03-non-home-column-detail-reading-implementation` 已停止，建议保持 `stopped / not accepted`。

本轮只做可审计基线恢复，不继续优化页面，不重做设计。已撤回能明确归属 P1-4B 的网页展示层改动，并保留其它任务已经产生或正在进行的改动。

## 2. 回退前备份

已备份 P1-4B 涉及的 6 个网页文件：

- `agent-workflow/backups/p1-4b-restore-20260505/styles.css`
- `agent-workflow/backups/p1-4b-restore-20260505/app.js`
- `agent-workflow/backups/p1-4b-restore-20260505/daily.html`
- `agent-workflow/backups/p1-4b-restore-20260505/signals.html`
- `agent-workflow/backups/p1-4b-restore-20260505/opportunities.html`
- `agent-workflow/backups/p1-4b-restore-20260505/trends.html`

## 3. 已确认属于 P1-4B 并已回退

- `04-Site/css/styles.css`
  - 删除明确标注为 `P1-4B correction: restrained commercial briefing rhythm` 的栏目页、详情页和长文页样式块。
  - 该样式块覆盖 Daily / Signals / The Point / Opportunities / Trends 栏目标题区、Trends 总览隐藏、详情页主栏与侧栏阅读母版。
- `04-Site/daily.html`
  - 标题恢复为 `每天一页，看清 AI 商业主线`。
- `04-Site/signals.html`
  - 标题恢复为 `从 AI 变化中，筛出商业信号`。
  - 恢复 P1-4B 移除的隐藏 `newSignalBtn` 与 `editorDialog` 片段，以回到任务前状态。
- `04-Site/opportunities.html`
  - 标题恢复为 `把商业信号，变成机会卡`。
  - 右栏标题恢复为 `机会排行`。
- `04-Site/trends.html`
  - 标题恢复为 `不只看新闻，更看赛道势能`。
- `04-Site/js/app.js`
  - 恢复 P1-4B 中可明确识别的公开文案替换，包括 Signals 指标、Signal Detail 小标题、Daily Detail H1、Trend Detail eyebrow、Opportunities 筛选 / 统计 / CTA、Point Source 素材文案等。

## 4. 未回退和原因

以下改动未回退，因为当前 diff 中可判断它们来自其它任务或无法明确归属 P1-4B：

- 首页 Intelligence Desk / 首页节奏相关 CSS 和 `renderHomeDesk()`：归属 P0-11 / 首页相关任务，不在 P1-4C 范围。
- Signal Lab 相关 JS / CSS：归属 P0-12 测试管线，不在 P1-4C 范围。
- The Point 单页返工中的人物标题、站内 / 原文链接和纸面样式：已有单独进度记录，不作为 P1-4B 回退对象。
- Admin、Account、Checkout、Apply 等页面级审美返工：不在 P1-4B 明确回退范围。
- `04-Site/index.html`、内容源 Markdown、`04-Site/data/`、同步脚本、关系检查脚本、统一同步闸门、自动化提示词：均未触碰。

## 5. 首页与自动化影响

- `04-Site/index.html`：未触碰。
- 内容源 Markdown：未触碰。
- `04-Site/data/`：未触碰。
- 同步 / 关系 / 标签 / 统一同步脚本：未触碰。
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

## 6. 检查结果

已运行：

- `node --check 04-Site/js/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-151838.md`
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js 04-Site/daily.html 04-Site/signals.html 04-Site/opportunities.html 04-Site/trends.html`：通过，无空白错误；仅提示 Git 后续可能规范化 `styles.css` 行尾。
- 静态文本抽查：Daily、Signals、Opportunities、Trends 标题已恢复；Signals 隐藏编辑弹窗片段已恢复；`styles.css` 中不再存在 `P1-4B correction` 标记块。

未完成：

- 未产出浏览器截图。原因：Codex Node 环境缺少 Playwright，本机未发现可命令行调用的 Chrome / Edge / Chromium。风险：本轮只能确认语法和静态回退，不能确认真实渲染。后续 `P1-4D` 证据化审美审计必须在具备浏览器截图能力的窗口补齐桌面 / 移动截图。

## 7. 建议下一步

`P1-4C` 可进入调度中枢验收。验收通过后，将 `P1-4D / WSD-20260505-05-page-evidence-design-audit` 从 `blocked` 改为 `ready`，由 Design Director 按 SYS-7 对页面逐页截图评分和提出修改建议。

## 8. 2026-05-05 23:28 补回退

用户截图指出 Opportunity 列表、Opportunity Detail 和 Trends 仍有大面积横向行、巨型标题和空白节奏，说明首次回退过窄。

本轮追加撤回：

- 删除 `04-Site/css/styles.css` 中 `Detail page standard: consistent editorial hierarchy across Daily, Trend, Opportunity and Signal detail views` 对 Daily / Trend / Opportunity 详情页造成的巨型标题和 1520px 宽布局覆盖。
- 删除 `Design Director QA v3` 中覆盖 Opportunities 列表、Trends 列表、Opportunity Detail 的残留规则。
- 删除 `Opportunities index fix: compact opportunity memo rows` 整块，恢复机会列表到任务前卡片/列表基线。

再次验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-152805.md`

仍未触碰：

- `04-Site/index.html`
- 内容源 Markdown
- `04-Site/data/`
- 同步脚本、关系检查脚本、统一同步闸门
- 自动化任务

## 9. 2026-05-05 23:35 硬恢复覆盖层

用户再次反馈“没有恢复”。复查后确认：仓库两个 Git 提交中都已经包含部分放大详情页的历史样式，不能靠切回提交得到干净视觉基线。

本轮改为在 `04-Site/css/styles.css` 末尾新增明确的 `P1-4C hard restore` 覆盖层，只覆盖以下页面：

- `opportunities.html`
- `opportunity.html`
- `trends.html`
- `trend.html`

覆盖目标：

- Opportunity 列表恢复为双列卡片，不再是横向大行。
- Opportunity Detail 标题压回 `clamp(34px, 3vw, 48px)`，主容器压回 `1180px`。
- Opportunity Detail 恢复左侧摘要 / 右侧正文的紧凑卡片结构。
- Trends 列表恢复为双列卡片，不再是一整屏横向趋势行。
- Trend Detail 主容器压回 `1180px`，保持侧栏布局但不再超宽。

再次验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-153530.md`

说明：

- 这是视觉恢复覆盖层，不是新的设计优化。
- 仍未触碰首页、内容源、数据、同步脚本或自动化任务。

## 10. 2026-05-05 23:44 五页最终强制恢复

用户继续指出以下五页仍未恢复：

- `trend.html`
- `opportunity.html`
- `trends.html`
- `opportunities.html`
- `point.html`

本轮在 `04-Site/css/styles.css` 末尾新增 `P1-4C final restore` 强制覆盖层，使用更高优先级覆盖这五页的巨型标题、超宽首屏、横向大行卡片和详情页过大布局。

覆盖内容：

- 五页 `main` 宽度统一压回 `1180px`。
- 五页 H1 压回 `clamp(34px, 3vw, 46px)`。
- Opportunities 列表强制回到双列卡片。
- Trends 列表强制回到双列卡片。
- Opportunity / Trend / Point 详情页强制回到 `1180px` 主体宽度和紧凑详情布局。
- 移动端五页均强制单列。

再次验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-154448.md`

仍未触碰：

- `04-Site/index.html`
- 内容源 Markdown
- `04-Site/data/`
- 同步脚本、关系检查脚本、统一同步闸门
- 自动化任务

## 11. 2026-05-05 23:51 五页版心对齐修正

用户指出五个页面仍不对，核心问题是所有页面左右两侧间距过大，和其它栏目完全不一样，应参照其它栏目。

本轮修正：

- 删除此前错误的 `P1-4C hard restore` 与 `P1-4C final restore` 过窄覆盖层。
- 新增 `P1-4C viewport alignment`，将五页主版心对齐到其它栏目使用的 `width: min(1520px, calc(100% - 56px))`。
- 对齐范围：
  - `opportunities.html`
  - `trends.html`
  - `opportunity.html`
  - `trend.html`
  - `point.html`
- 同步对齐标题区、栏目 section、机会列表、趋势列表和详情页 layout 的 `max-width: 1520px`。

再次验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-155140.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 16. 2026-05-06 00:24 The Point 来源列表排版优化

用户指出 The Point 详情页来源列表的“阅读原文 1 / 2”按钮与日期排版不协调。

本轮修正：

- 来源列表改为稳定的日期-动作两列布局。
- 日期列宽调整为 `118px`，与按钮垂直居中。
- “阅读原文”按钮从大胶囊收紧为内容页操作按钮，降低视觉重量。
- 多条来源之间增加浅色分隔线，形成清晰阅读顺序。

验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-162440.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 15. 2026-05-06 00:20 The Point 阅读原文按钮二次修正

用户指出 The Point 详情页“阅读原文”胶囊仍有框体异常，文字贴边。

本轮修正：

- 将 `point.html` 的“阅读原文”从外层容器画框改为链接自身画框。
- 链接按钮增加稳定最小宽度、内边距、边框和圆角。
- 去除外层容器边框，避免外框与文字宽度计算错位。

验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-162012.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 13. 2026-05-06 00:04 The Point 原文跳转修正

用户指出 The Point 详情页只应提供“阅读原文”，不提供“站内”入口。

本轮修正：

- `point.html` 观点时间线移除“站内”链接。
- 来源列表移除“站内阅读”链接。
- 保留并统一为外部原文 CTA：`阅读原文` / `阅读原文 1`。

验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-160400.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 14. 2026-05-06 00:13 Signal 标题与原文按钮修正

用户指出 Signal 详情页 H1 没有提炼，长标题发生断行；同时 The Point 的“阅读原文”胶囊按钮出现裁字变形。

本轮修正：

- `signal.html` 详情页 H1 改为短判断标题，针对“WebVNC / 浏览器租赁”和“graph / 图谱化记忆”类标题做页面标题化提炼。
- Signal H1 增加单行兜底，避免详情页页头断成两行。
- 原始新闻标题继续保留在“新闻详情源”区域，不丢失来源语义。
- `point.html` 的“阅读原文”按钮改为稳定胶囊尺寸，去掉外层裁切，避免文字被截断。

验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-161301.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。

## 12. 2026-05-05 23:58 The Point 详情与 H1 层级修正

用户指出 The Point 详情页应突出人和岗位，而不是把观点标题作为主角；同时五页 H1 字号仍大于其它栏目。

本轮修正：

- `point.html` 页头 H1 改为人物 / 机构名。
- 岗位、日期和热度分数保留在 `point-title-meta`。
- 观点标题降级为 `point-title-topic`，作为人物页下的主题，不再压过人物。
- 五页 H1 字号从错误的 `clamp(42px, 4vw, 64px)` 改回栏目标准 `clamp(34px, 3.3vw, 52px)`。
- 修复 `point.html` 中 `站内 / 原文` 链接竖排问题，改为稳定横排胶囊。

验证：

- `node --check 04-Site/js/app.js`：通过。
- `git diff --check -- 04-Site/css/styles.css 04-Site/js/app.js`：通过，仅提示 Git 行尾规范化。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-155828.md`

自动化影响：不影响 `ai-the-point`、`ai-2`、`ai-3`。
