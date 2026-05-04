# WSD-20260504-14 The Point 首页改版落地收口

日期：2026-05-04  
任务 ID：`WSD-20260504-14-the-point-home-redesign-implementation`  
执行窗口：独立执行窗口  
牵头 Agent：`ui-ue` / `dev`  
协作 Agent：`copy` / `qa` / `pm` / `workflow`  
状态：accepted  
编码：UTF-8

## 1. 做了什么

- 将 The Point 首页 H1 固定为：`从一线观点中，看见 AI 共识、分歧与边界。`
- 首页从旧的日期归档列表，改为“栏目标题 + 主观点 + 共识 / 分歧 / 早期信号 + 今日一线观点 + 往期观点 / 主题侧栏”的阅读路径。
- 首屏突出一线人物 / 机构、来源类型、出处链接、原始观点中文转述和观澜解读。
- 观澜解读作为第二层增值展示，不盖过一线来源本身。
- 今日观点展示 10 条少而精内容，每条观点只保留 `查看观点` 一个动作，进入详情页后再看来源与关联内容。
- 保持移动端阅读顺序：H1 -> 主观点 -> 判断分组 -> 今日观点 -> 往期观点 / 主题侧栏。
- 根据用户截图反馈追加收敛：首屏主观点标题改为短标题并限制不超过 2 行；绿色链接入口从多项收敛为单一入口；压缩主观点、判断分组和今日观点区之间的间距，并下调卡片内标题与正文大小。
- 根据第二轮反馈补充栏目首页时间入口：右侧栏新增 `往期观点`，可进入历史日期集合页。
- 根据最新反馈删除栏目首页底部 `相关判断`：首页不再展示不明指向的关联内容，具体条目的关联信息保留在详情页承担。
- 根据第三轮反馈修复往期集合页序号：当日观点超过 10 条时，第二组从 `11` 继续，不再重置为 `01`。
- `正在升温的主题` 已改为可点击主题集合，点击后在 The Point 首页内展示该主题下的历史观点集合。
- 主题集合页只保留聚合主题内容和右侧 `往期观点` / `正在升温的主题` 入口，不再混入首页主观点、今日观点或底部关联内容。
- 修复 UE 执行偏差：撤销 The Point 对一级栏目标题区的单独 CSS 覆盖，标题位置、字号、行高回到全站栏目统一规范。

## 2. 改动文件

- `04-Site/the-point.html`
- `04-Site/js/app.js`
- `04-Site/css/styles.css`
- `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-desktop.png`
- `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-mobile.png`
- `agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-implementation-closeout.md`

运行 Quality Gates 时额外生成：

- `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-104008.md`
- `agent-workflow/reports/quality-gates-syntax-latest.md`

## 3. 页面设计和文案如何落实规划

- Copy：模块标题采用 `今日一线观点`、`往期观点`、`正在升温的主题`，避免内部流程语和说服式表达；删除首页底部不明指向的 `相关判断` 聚合。
- UI / UE：参考 `frontend-design + Bloomberg / FT / Economist 内参式阅读 + Linear 信息密度`，使用克制的主阅读区、列表行和状态标签，避免人物墙、社媒流和卡片套卡片。
- Dev：只使用现有 `points`、`pointTopics`、Signal / Trend / Opportunity 关联字段生成页面，不改数据模型、不改内容源、不改同步脚本。
- QA：检查桌面端、移动端、四种访问状态、禁用前台话术、主题集合页、栏目标题规范和关键链接。

## 4. 已运行检查

- `node --check 04-Site/js/app.js`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过，6 项检查全部 passed；最新报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-111743.md`。
- `git diff --check -- 04-Site/the-point.html 04-Site/js/app.js 04-Site/css/styles.css`：通过。
- 浏览器桌面端截图：通过，无横向溢出。
- 浏览器移动端截图：通过，无横向溢出。
- 追加浏览器检查：桌面端首屏主观点标题 1 行，移动端 2 行；每条观点 CTA 数量为 1；今日观点行内关联链接数量为 0。
- 追加浏览器检查：桌面端 / 移动端均有历史日期入口；当前可进入 `2026-05-04` 和 `2026-05-03` 两个每日集合页；底部相关判断三列无卡片边框背景；无横向溢出。
- 追加浏览器检查：The Point / Signals / Trends 桌面端栏目标题 `sectionTop=109`、`h1Top=151`、`h1Left=28`、`fontSize=47.52px`、`lineHeight=51.3216px`，已按一级栏目统一规范对齐。
- 追加浏览器检查：首页不再出现 `.point-related-assets`；主题集合页有 `.point-topic-collection`，无 `.point-home-lead`、无 `.point-today-section`、无 `.point-related-assets`，右侧保留 2 个日期入口和 8 个主题入口。
- 追加浏览器检查：`point-daily.html?date=2026-05-03` 序号从 `01` 连续到 `14`；`正在升温的主题` 8 个主题均为可点击链接；`AI Agent` 主题集合展示 12 条观点；桌面 / 移动端无横向溢出。
- 普通前台禁用词检查：未出现 `Admin` / `JSON` / `同步` / `编辑` / `恢复`。
- 链接抽查：
  - 观点详情：`point.html?...` 返回 200。
  - 每日集合：`point-daily.html?date=2026-05-04` 返回 200。
  - 来源页：`point-source.html?...` 返回 200。
- 四种访问状态轻量验收：
  - 未登录：显示阅读限制页，无横向溢出，无后台痕迹。
  - 试读有效用户：The Point 首页正常展示，无横向溢出，无后台痕迹。
  - 到期用户：显示续订提示，无横向溢出，无后台痕迹。
  - 管理员：普通前台正常展示，无横向溢出，无后台痕迹。

## 5. 截图路径

- 桌面端：`agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-desktop.png`
- 移动端：`agent-workflow/reports/WSD-20260504-14-the-point-home-redesign-mobile.png`

## 6. 未运行检查及原因

- 未运行 `sync-data.mjs`、`check-relations.mjs`、`check-tags.mjs`：本任务禁止改动内容源、网站数据、同步脚本和关系检查口径；本轮只改 The Point 首页展示层。
- 未更新 `feature_list.json`、`progress.md`、`docs/agent-handoff.md`：本窗口是执行窗口，按派发单只生成 closeout；建议由调度中枢验收后统一回填。

## 7. 自动化影响

不影响 `ai-the-point`、`ai-2`、`ai-3`。

原因：

- 未修改 `05-Point/` 内容源。
- 未修改 Markdown 命名、frontmatter 或字段规则。
- 未修改 `04-Site/data/radar-data.json` / `radar-data.js`。
- 未修改 `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs` 或 `unified-site-sync.mjs`。
- 未修改自动化任务配置或提示词。

## 8. 是否可由主调度窗口验收合并

可以提交主调度窗口验收。

建议主调度窗口重点复核：

- 改动范围是否符合派发单。
- The Point 首页截图是否符合规划报告的“判断入口”方向。
- 是否接受 Quality Gates 运行产生的语法报告文件。
