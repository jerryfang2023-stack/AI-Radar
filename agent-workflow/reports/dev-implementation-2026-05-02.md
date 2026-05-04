# Dev Implementation Report - 2026-05-02

## 本轮目标

进入开发阶段后，优先打通「每日观澜AI商业雷达」自动化产出的新版 Signals 与网站同步脚本之间的字段兼容。

## 已完成

1. 更新 `04-Site/config/content-paths.json`
   - 保持内容目录配置化。
   - 修正 `03-Trends/AI趋势总表.md` 路径。
   - 保留 `07-Opportunities` 作为机会库目录。

2. 更新 `04-Site/scripts/sync-data.mjs`
   - Signals 解析支持新版 `Signal Score`。
   - 支持来源层级、运营状态、相关机会、相关趋势等新增字段。
   - 支持 Signal Score 拆分字段：商业证据强度、商业含义清晰度、来源可信度、赛道相关性、新变化程度、关联价值、反证与风险提示。
   - 修复路径斜杠转义问题。
   - 保留旧字段兼容，避免旧 MD 失效。

3. 执行同步验证
   - 同步结果：22 signals，26 score rows，10 trends，23 opportunities。
   - 最新日期：2026-05-02。
   - 最新 Signal 样例已成功读取标题、简介、Signal Score、来源层级和相关机会。

4. 收敛公开前台导航
   - 公开页面导航调整为：首页 / Daily Brief / Signals / Trends / Opportunities。
   - `Priorities` 与 `Tags` 不再作为普通用户的一层导航入口。
   - Admin 页面继续保留 `Priorities` 与 `Tags` 管理入口。
   - 首页和 Daily 中原先跳转到 `scoring.html` 的优先级入口，已改为进入 `Opportunities`。

5. 升级 Daily Brief 页面结构
   - 页面标题调整为“每天一页，看清 AI 商业变化的主线”。
   - Daily Brief 卡片改为：今日判断、关键 Signals、机会优先级、趋势观察、机会卡观察。
   - 删除偏“行动建议”的表达，改为信号强弱、证据密度、趋势观察和反证边界。
   - 增加“当前判断不构成经营、投资或合作指令”的边界口径。

6. 将 Priority Engine 合并进 Opportunities
   - `opportunities.html` 新增 `Priority Engine` 区块。
   - 机会优先级评分不再只依赖独立 `scoring.html`，而是在机会库顶部作为排序和复盘入口出现。
   - 评分说明文案从行动建议改为证据强度和观察状态。

7. Daily Brief 二层页面改造
   - 新增 `04-Site/daily-detail.html`。
   - `daily.html` 中每个 Daily Brief 卡片可点击进入独立详情页。
   - Daily 列表卡片撤掉“机会优先级”内容，仅保留：关键 Signals、机会卡、趋势观察。
   - Daily 详情页也围绕三部分展开：关键 Signal、机会卡观察、趋势观察。

8. 首页 Decision Brief 第一栏优化
   - 首页 Decision Brief 第一栏从“优先级/评分”改为“今日关键 Signals”。
   - Signal 卡片展示事件标题、Signal Score、来源层级和简介，提升首页第一屏后的证据感。

9. Daily Brief 视觉重排
   - 按 `frontend-design` 重新压缩视觉层级。
   - Daily 列表卡片改为左侧深色日期/指标栏，右侧判断摘要和三列证据预览。
   - Daily 详情页减少卡片堆叠，改为更安静的三栏阅读布局。
   - 首页 Decision Brief 三栏卡片统一为更克制的列表式呈现。

10. Daily Brief 版式修正
   - 根据用户反馈，修正 Daily 页面左右留白过多的问题。
   - Daily / Daily Detail 主体宽度提升到 `min(1680px, calc(100% - 36px))`。
   - Daily Detail 从三栏平铺改为“主 Signal 阅读区 + 右侧机会/趋势侧栏”。
   - 首条 Signal 使用更强的 lead 样式，降低详情页杂乱感。

11. Daily Detail 文案与阅读节奏继续优化
   - 使用 `frontend-design` 重新检查 Daily Detail 的信息层级。
   - 标题改为 `{日期} 观澜简报`。
   - 主判断文案改为“核心变化集中在……”，强调连续证据，而非单点新闻。
   - 主区标题改为“先读这些商业信号”。
   - 侧栏标题改为“可能延展出的机会”和“需要继续观察的趋势”。
   - CSS 继续收紧详情页阅读节奏：主区更宽、首条 Signal 更突出、右侧摘要文字减少压迫。

## 验收结果

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `04-Site/data/radar-data.json` 和 `04-Site/data/radar-data.js` 已重新生成。
- 公开页面导航复核通过，首页 / Daily Brief / Signals / Opportunities / Trends / Apply 不再显示旧的 `Priorities` 与 `Tags` 一层入口。
- `daily-detail.html` 已加入并通过路由识别。
- `Daily Brief` 卡片已确认不再包含机会优先级区块。
- `Daily Brief` 与首页 `Decision Brief` 完成一次视觉重排，减少盒子堆叠感。
- `Daily Brief` 页面宽度和详情页阅读结构已再次修正。
- `Daily Detail` 文案和排版已继续优化，重点改善标题、主判断、主阅读区和右侧摘要栏。

## 下一步开发建议

1. Admin 与普通前台继续剥离，确保普通页面不出现编辑或恢复数据入口。
2. 将 `scoring.html` 转为后台/管理员入口，普通用户不通过导航进入。
3. 继续优化 Opportunities 与 Priority Engine 的一一对应关系，让评分项能定位到具体机会卡。
4. 下一轮可检查 Daily Detail 在浏览器中的视觉高度、卡片密度和移动端断行。
