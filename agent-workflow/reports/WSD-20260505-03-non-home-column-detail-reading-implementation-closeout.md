# WSD-20260505-03 非首页栏目与详情阅读系统收口

时间：2026-05-05

## 结论

本轮先撤回上一版 P1-4B 中失败的粗重样式层，再改为克制的商业内参阅读母版。上一版没有达到 Design Director 要求：参考停留在原则层，落地时变成了过大的栏目标题、突兀色块、空白状态条和卡片堆叠，确实显得粗糙、呆板。

本轮修正后：

- 栏目页标题回到统一上方节奏，不再大幅下沉。
- Trends 页移除空白感很强的总览块，并修正趋势卡图表与文字重叠。
- 详情页改为正文优先、右侧摘要辅助、细分线分隔，降低装饰和卡片感。
- 清理公开前台中的编辑、后台、同步、字段等内部表达。
- 首页未改动。

## 文件改动

- `04-Site/css/styles.css`
  - 移除失败的 P1-4B 大样式层。
  - 新增克制版栏目和详情页阅读母版。
  - 隐藏 Trends 空白总览块，修正趋势卡图表溢出。
- `04-Site/js/app.js`
  - 调整公开前台文案，避免内部流程语言。
- `04-Site/daily.html`
- `04-Site/signals.html`
- `04-Site/opportunities.html`
- `04-Site/trends.html`
  - 更新栏目标题表达。
  - `signals.html` 移除公开页编辑弹窗残留。
- `agent-workflow/execution/dispatch-board.md`
  - P1-4B 已在本窗口执行中。

## 参考与设计判断

- 使用 `frontend-design` 规范约束页面品质。
- 参考 `awesome-design-md` 与项目既有 `DESIGN.md`，但上一版没有把 Bloomberg / FT / Economist 这类商业内参的克制排版真正落到实现里。
- 本轮修正采用更接近商业内参的原则：少装饰、少卡片、标题克制、正文优先、右栏只做摘要和关联。

## 验证

- `node --check 04-Site/js/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
- 最新报告：`agent-workflow/reports/quality-gates-syntax-2026-05-05-20260505-135410.md`。
- Chrome / Playwright 截图：
  - `agent-workflow/reports/WSD-20260505-03-trends-editorial-fix-2.png`
  - `agent-workflow/reports/WSD-20260505-03-signal-detail-editorial-fix.png`
  - `agent-workflow/reports/WSD-20260505-03-opportunity-detail-editorial-fix.png`
  - `agent-workflow/reports/WSD-20260505-03-point-detail-editorial-fix.png`

## 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

本轮只影响普通前台样式、页面标题和展示文案，未改 Markdown 命名、frontmatter、同步脚本、关系检查或自动化运行口径。
