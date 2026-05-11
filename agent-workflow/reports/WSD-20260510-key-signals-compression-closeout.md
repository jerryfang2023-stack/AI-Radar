# WSD-20260510 Key Signals Compression Closeout

生成时间：2026-05-11 00:18 CST

## 范围

- 页面：`01-SiteV2/site/signals.html`
- 代码：`01-SiteV2/site/assets/app.js`
- 样式：`01-SiteV2/site/assets/styles.css`

## 完成项

1. 将关键信号栏目页收敛为 5 个核心区：
   - Signal Header 顶部控制区
   - Lead Signal 今日主信号
   - Signal Library 信号库
   - Evidence & Calibration 证据和一线看法
   - Tracking Index 追踪索引
2. 合并重复内容：
   - “继续追踪的线”并入 Structured Signals 上方的追踪筛选条。
   - “12 条可继续盯的变化”压缩为 8 条结构化扫描。
   - 趋势温度、来源结构、风险边界、一线观点合并为同一个证据分析面板。
3. 强化内参元素：
   - Lead Signal 增加 `Source Ledger`、`Evidence Checked`、`Watch Status`、`Risk Boundary`。
   - 右侧图保持信息型信号簇 / 趋势图风格。
   - 底部索引改为公司、趋势、机会、一线观点四组紧凑台账。
4. 拉开视觉层级：
   - Lead Signal 仍为最高权重。
   - Front Signals 从 4 张减为 3 张中型报告卡。
   - Structured Signals 使用紧凑列表，不与 Front Signal 同权。
   - Builder 观点在栏目页只作为批注式摘要，不做信息流。
5. 语言清理：
   - 信号页范围未发现 Raw / Pool / Heat Candidate / M/C / JSON / 同步 / 后台 / Admin / 入库等后台词。
   - “可进入深读”等表达已替换为“值得细看”等更易懂表达。

## 验收

- `node --check 01-SiteV2/site/assets/app.js`：通过
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过
- 桌面截图检测：
  - 5 个核心区
  - 页面高度：4272px -> 3700px，约压缩 13.4%（相对本轮中间态 5031px 约压缩 26.5%）
  - 横向溢出：0
  - Front Signal：3 条
  - Structured Signal：8 条
- 移动端截图检测：
  - 横向溢出：0
  - Front Signal：3 条
  - Structured Signal：8 条

## 截图

- `agent-workflow/reports/v2-signal-system-2026-05-10-compress/signals-desktop-first-screen-v4.png`
- `agent-workflow/reports/v2-signal-system-2026-05-10-compress/signals-desktop-full-v4.png`
- `agent-workflow/reports/v2-signal-system-2026-05-10-compress/signals-mobile-full-v4.png`

## 残余说明

- 浏览器截图中仍有一次 404 资源请求，页面脚本无错误；疑似默认 favicon / 静态资源请求，不影响页面渲染。
- 禁用词扫描在 `app.js` 中仍可扫到其他页面历史文案，例如首页的“编辑部判断”和旧详情片段的“观点校准”，不属于本次 `signals.html` 输出范围。
