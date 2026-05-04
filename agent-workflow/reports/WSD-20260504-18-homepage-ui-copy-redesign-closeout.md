# WSD-20260504-18 首页 UI / Copy 重设计收口

日期：2026-05-04  
任务 ID：`WSD-20260504-18-homepage-ui-copy-redesign`  
执行窗口：独立执行窗口  
执行工作树：`C:\Users\86186\Documents\Fang\wiki\AI热点\01-WaveSight-p0-2a-hero-carousel`  
状态：待主调度窗口验收

## 1. 做了什么

- 按长期 agent-workflow 读取任务指定文件、首页 PRD、UI / UE Agent、Copy Agent、Dev Agent、QA Agent、`DESIGN.md`、`COPY.md` 和上一轮首页收口。
- 明确废弃“三图轮播替换首屏”方向，本轮未恢复图片轮播。
- 先输出 UI/UE 页面规范表与 Copy 文案规范表，再进入实现。
- 重写首页首屏最终生效样式层：
  - 顶部导航回到极简白底、细分割线、文字导航。
  - 首屏采用左侧主判断 + 右侧 `WaveSight AI Intelligence Desk` 判断样张。
  - 修正 H1、导语、CTA、依据标签、Desk 样张文案。
  - 为首页 CSS / JS 引用追加 `v=20260504-18` 版本参数，降低旧浏览器缓存继续命中上一版首页的概率。
  - 压缩粗糙的大留白，统一标题位置、字号、行高和模块起点。
- 重写首页第一屏 `Decision Brief` 表达：
  - 标题改为 `今日信号与判断`。
  - 四个栏目为 `商业信号 / 一线观点 / 机会观察 / 趋势状态`。
  - 每个栏目保留数量标记、短摘要、三条内容和底部栏目动作。
- 完成桌面端与移动端浏览器截图、横向溢出、禁用语和前台边界检查。

## 2. UI/UE 页面规范表

| 项目 | 规范 |
|---|---|
| 页面类型 | 首页 |
| 页面目标 | 用户 5 秒内理解：观澜AI是面向商业决策者的 AI 机会判断系统，不是资讯站、后台页或抽象 AI 展示页。 |
| 设计基准 | `DESIGN.md + frontend-design + taste-skill 适配规则`。采用 Bloomberg / FT 内参阅读 + Linear 信息密度 + Apple 式克制首屏。taste-skill 只取 `VISUAL_DENSITY 6-8`、CSS Grid、反过度卡片化、移动端稳定；禁用强动效、大圆角 Bento、玻璃拟态和紫蓝 AI 风。 |
| 布局基准 | 顶部导航为极简白底细线；首屏为左侧价值判断 + 右侧 Intelligence Desk 样张；首屏下沿露出今日内容入口；主容器桌面宽度 `min(1480px, calc(100% - 80px))`，移动端 `calc(100% - 32px)`；模块起点统一左对齐。 |
| 字体层级 | H1：中文衬线，桌面 `56-72px`，移动 `38-46px`，行高 `1.12-1.16`；H2：`30-46px`；卡片标题：`17-24px`；正文：`15-18px`；meta：`12-13px`；CTA：`15-17px`。 |
| 间距基准 | 首屏顶部 `44-64px`；首屏底部 `28-40px`；模块间距 `32-48px`；卡片内边距 `16-22px`；移动端大间距收缩到 `18-28px`，不强行占满一屏。 |
| 组件克制规则 | 删除或弱化过度圆角、重阴影、漂浮卡片、过多徽章；卡片只表达层级，不做装饰；Desk 样张像商业判断样张，不像后台组件堆叠；栏目卡有信息密度但不做数据大屏。 |
| 前台边界 | 普通前台不得出现 Admin、JSON、同步、编辑、恢复、字段、后台、脚本、Markdown 等痕迹；首页不展示内部机制。 |
| 桌面端验收点 | H1 两行节奏自然；导语不超过两行；CTA 与依据标签不抢主标题；右侧样张与左侧标题垂直对齐；Decision Brief 紧跟首屏；卡片不单薄；无横向溢出。 |
| 移动端验收点 | 导航可横向滚动但不撑宽；H1 不断成单字列；Desk 样张可读；CTA 不挤压；栏目卡单列且间距紧凑；无横向溢出。 |
| 禁止项 | 三图轮播方向、霓虹科技风、紫蓝渐变、赛博大屏、机器人头像、抽象流程图、后台面板、资讯流瀑布、厚重胶囊、大圆角 Bento、空洞营销口号。 |

## 3. Copy 文案规范表

| 项目 | 规范 |
|---|---|
| 页面/模块 | 首页首屏与第一屏 |
| 用户任务 | 快速判断“这里是否能帮我看清 AI 商业变化”，然后进入今日简报或申请完整情报层。 |
| 当前文案问题 | 部分文案偏功能说明；“今日值得看的变化”较弱；栏目摘要有解释感；CTA 重复；Desk 样张文案还不够像真实商业判断。 |
| 替换后 H1 | `在共识形成前，看见 AI 商业变化` |
| 替换后导语 | `从融资、客户采用、产品落地和产业变化中，筛出可追踪的商业信号。` |
| 替换后 CTA | 主 CTA：`查看今日简报`；次 CTA：`申请完整情报层` |
| 替换后模块标题 | 首屏样张：`今日情报桌面`；第一屏：`今日信号与判断`；栏目：`商业信号 / 一线观点 / 机会观察 / 趋势状态`。 |
| 空状态/提示文案 | `今日暂无新增信号。`、`今日暂无新观点。`、`暂无新的机会观察。`、`暂无趋势更新。` |
| 禁用语检查 | 禁用：入口、同步、字段、后台、证据链、强证据、机会确定、下一步验证、本页用于、赋能、生态闭环、风口红利、确定性机会。 |
| 判断边界 | 只说“信号、观察、趋势、值得继续跟踪”，不说“确定机会、必须行动、建议立即验证”。 |
| 标题长度与容器适配 | H1 控制 18 字内；模块标题 8 字内；Desk 样张标题 14 字内；动态列表标题最多两行截断，正文最多两行。 |
| QA 文案验收点 | 5 秒能懂产品价值；无内部话术；无过度承诺；无公司名被写成机会名；中文断行自然；CTA 清楚但不焦虑。 |

## 4. Dev 按表实现情况

| 规范项 | 实现情况 |
|---|---|
| 首屏结构 | 已实现：左侧 H1 / 导语 / 依据标签 / CTA，右侧 Intelligence Desk 样张。 |
| 主容器宽度 | 已实现：桌面 `min(1480px, calc(100% - 80px))`，移动端 `min(100% - 32px, 1480px)`。 |
| 字体层级 | 已实现：H1、H2、卡片标题、正文、meta、CTA 均在最终 CSS 锁定层中定义。 |
| 间距基准 | 已实现：首屏、Decision Brief、CTA、卡片内边距和移动端收缩均重新定义。 |
| 组件克制 | 已实现：不恢复轮播；降低阴影、圆角、徽章和装饰；Desk 样张使用细边框与浅阴影。 |
| 前台边界 | 已实现：`index.html` 与浏览器渲染文本均未命中后台/内部禁用语。 |
| Copy 表 H1 / 导语 / CTA | 已实现。 |
| Copy 表模块标题 | 已实现：`今日信号与判断`、`商业信号 / 一线观点 / 机会观察 / 趋势状态`。 |
| Copy 表空状态 | 已实现到 `renderHomeHighlights()`。 |
| 判断边界 | 已实现：未出现确定性机会、强证据、立即行动等表达。 |
| 标题长度适配 | 已实现：H1 两行；动态列表标题两行截断；移动端 H1 正常换行。 |

未实现项：

- 未新增轻量视觉资产。
  - 原因：当前目标可以由 HTML/CSS Intelligence Desk 达成，新增资产会增加维护成本。
- 未恢复三图轮播。
  - 原因：该方向已被任务明确废弃。

是否自行新增或改写 Copy 未提供的关键文案：

- 是。执行窗口按 Copy 文案规范表自行收敛了以下关键文案：
  - H1：`在共识形成前，看见 AI 商业变化`
  - 第一屏标题：`今日信号与判断`
  - 栏目摘要：`先看今天发生了什么。`、`把一线判断放回商业语境。`、`看哪些需求被反复指向。`、`看哪些方向仍在延续。`
  - 空状态文案。

是否影响其他栏目、全站标题规范或移动端：

- 其他栏目：未改其他 HTML 页面。
- 全站标题规范：未修改其他栏目标题规则。
- 移动端：首页移动端样式已改，浏览器截图和横向溢出检查通过。

## 5. QA 独立验收结果

| 验收项 | 结果 |
|---|---|
| 首页桌面端截图 | 通过。 |
| 首页移动端截图 | 通过。 |
| 首屏 5 秒价值理解 | 通过：H1 + 导语明确表达“AI 商业变化 + 商业信号”。 |
| 标题位置、字号、行高、模块起点、间距一致性 | 通过：最终 CSS 锁定层统一了 H1、H2、栏目卡和 CTA。 |
| 字体层级是否统一 | 通过：H1 / H2 / 卡片标题 / 正文 / meta / CTA 有明确层级。 |
| 是否无横向溢出 | 通过：桌面 `scrollWidth=1521`、`clientWidth=1521`；移动 `scrollWidth=390`、`clientWidth=390`。 |
| 禁用语检查 | 通过：浏览器渲染文本未命中禁用语。 |
| 判断边界检查 | 通过：未出现确定机会、强证据、立即行动、投资承诺类表达。 |
| 标题长度与容器适配 | 通过：H1 桌面两行，移动端自然换行；列表标题两行截断。 |
| 普通前台无后台痕迹 | 通过：首页渲染文本无 Admin、JSON、同步、编辑、恢复、字段、后台等痕迹。 |

## 6. 截图路径

- 桌面端截图：`agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-desktop.png`
- 移动端截图：`agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-mobile.png`

## 7. 改了哪些文件

- `04-Site/index.html`
  - 更新 H1、Desk 样张 aria-label、Desk 样张图标与文案、第一屏标题；为 CSS / JS 引用追加版本参数。
- `04-Site/css/styles.css`
  - 新增 `WSD-20260504-18 homepage UI/copy redesign final lock` 最终样式层，覆盖旧首页多轮样式。
- `04-Site/js/app.js`
  - 更新首页第一屏标题、栏目标题、栏目摘要、空状态文案。
- `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`
  - 本收口文件。
- `agent-workflow/reports/quality-gates-syntax-latest.md`
  - Quality Gates 自动更新。

## 8. 运行了哪些检查

- `node --check 04-Site/js/app.js`
  - 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
  - 通过，6 项检查，失败 0。
  - 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-135310.md`
- 首页桌面端浏览器截图
  - 通过。
- 首页移动端浏览器截图
  - 通过。
- 首页无横向溢出检查
  - 通过。
- 首页浏览器渲染禁用语检查
  - 通过。
- 首页模块结构检查
  - `deskCards=4`
  - `highlightPanels=4`
  - `panelHeads=4`
  - `panelActions=4`
  - `flowCards=0`
  - `methodRail=0`

## 9. 哪些检查未运行及原因

- 未运行内容同步、关系检查、标签检查。
  - 原因：本任务禁止改内容源、`04-Site/data/`、同步脚本、数据模型；本轮仅改首页展示层。
  - 风险：低。
- 未做登录 / 试读 / 到期 / 管理员四身份权限验收。
  - 原因：本任务未改权限、登录、订阅或 Admin 逻辑。
  - 风险：低；权限专项任务可另行覆盖。
- 未做真实发布环境验收。
  - 原因：本任务是本地派生工作树内页面执行任务。
  - 风险：低；合并部署前由发布任务覆盖。

## 10. 自动化影响

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

原因：未改 Markdown 命名、目录、frontmatter、Signal / Priority / Trend / Opportunity / Point 字段规则、同步脚本、关系检查、统一同步闸门、自动化提示词或运行顺序。

## 11. 是否建议主调度窗口验收 accepted

建议主调度窗口验收为 `accepted`。

建议验收重点：

- 首页是否已摆脱粗糙、简陋、排版不统一的问题。
- 首屏是否能在 5 秒内表达“面向商业决策者的 AI 机会判断系统”。
- 是否接受当前静态 Intelligence Desk 样张作为首页主视觉，而不再推进三图轮播方向。

## 12. 整页重设计补充执行

用户复核后指出：任务目标应是“重新设计首页”，不是仅返工首屏。已追加完成整页首页 redesign。

### 做了什么

- 重建首页信息架构：
  - 首屏保留“主判断 + Intelligence Desk 样张”。
  - 第二屏从旧四列栏目卡改为“今日主判断 + 四条情报栏 + 右侧读数”。
  - 新增 `Intelligence Layer` 段落，用三步说明从热点到商业判断的阅读路径。
  - 会员 CTA 保留，但弱化为页面末端动作，不抢首屏注意力。
- 更新首页动态渲染：
  - `renderHomeHighlights()` 不再输出旧 `highlight-panel` 四列栏目。
  - 改为输出 `judgment-brief-card`、`home-lane-grid`、`home-readout`。
- 更新首页视觉：
  - 追加 `homepage full redesign final override` 与 `homepage full redesign component lock`。
  - 补回 Desk 关系线与左侧信号标签图标。
  - 首页隐藏登录 / 注册工具区，避免首屏质感被通用账户按钮打断。
- 更新缓存版本：
  - CSS / JS 引用改为 `v=20260504-18-full`。

### 本次补充改动文件

- `04-Site/index.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`
- `agent-workflow/reports/WSD-20260504-18-homepage-ui-copy-redesign-closeout.md`
- `agent-workflow/reports/quality-gates-syntax-latest.md`

### 本次补充截图

- 桌面端：`agent-workflow/reports/WSD-20260504-18-homepage-full-redesign-desktop.png`
- 移动端：`agent-workflow/reports/WSD-20260504-18-homepage-full-redesign-mobile.png`

### 本次补充检查

- `node --check 04-Site/js/app.js`
  - 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
  - 通过，6 项检查，失败 0。
  - 最新报告：`agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-141607.md`
- 浏览器桌面端截图
  - 通过。
- 浏览器移动端截图
  - 通过。
- 首页无横向溢出检查
  - 通过。
  - 桌面端：`overflow=0`。
  - 移动端：`overflow=0`。
- 首页禁用语检查
  - 通过，未命中 `Admin / JSON / 同步 / 编辑 / 恢复 / 字段 / 后台 / 入口 / 证据链 / 强证据 / 机会确定 / 下一步验证 / 本页用于`。

### 本次补充 QA 结论

- 桌面端：首页已从单一首屏优化升级为完整首页设计。
- 移动端：单列阅读路径正常，无横向溢出。
- 首屏 5 秒价值理解：通过，品牌、H1、导语和 Desk 样张均指向“AI 商业变化判断”。
- 首页整体：比上一版更接近参考 demo 的“商业情报桌面”气质，但后续仍可继续提高真实图标、品牌资产和 Desk 样张细节。

### 自动化影响补充

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

原因：仍未改内容源、`04-Site/data/`、同步脚本、数据模型、权限、云端部署路径或自动化任务。

### 补充验收建议

建议主调度窗口按“整页首页 redesign”重新验收，结论可进入 `accepted`，但建议把“Desk 图标资产与真实品牌样张精修”作为后续 P1 视觉资产任务。

## 13. 最终收口结论

用户复核后判定：`failed`。

原因：当前结果仍未达到参考 demo 的首页质感要求；任务不再继续返工。后续改为“网站 UI 优化”重新进入任务池，并单独增加“首页右侧海报图优化”小任务。

## 14. 调度中枢验收

2026-05-04 调度中枢已按失败任务收口，状态为 `failed / not accepted`。

验收结论：

- 本任务不进入 `accepted`。
- 本任务不合并、不作为首页最终方向。
- closeout 最终结论已明确为 `failed`，优先级高于前文阶段性 “建议 accepted”。
- closeout 中引用的桌面 / 移动端截图未同步到主工作树，因此主调度窗口无法按页面类硬闸门完成截图复核。
- 当前主工作树未登记本任务派发单，且 `WSD-20260504-18` 编号曾被 Priority Engine 2.0 PM 边界任务使用，后续不再复用该编号派发首页任务。

调度中枢回填：

- `dispatch-board.md` 已新增 `P0-2B / WSD-20260504-18-homepage-ui-copy-redesign`，状态为 `failed / not accepted`。
- 已新增后续任务：
  - `P0-10 / WSD-20260504-25-site-ui-design-direction`
  - `P0-11 / WSD-20260504-26-homepage-desk-visual-asset`
- `progress.md` 与 `docs/agent-handoff.md` 已记录失败原因、不可合并状态和后续任务。
- 2026-05-04 22:48 调度中枢补跑 `node agent-workflow/tools/run-quality-gates.mjs syntax`，6 项检查通过，报告为 `agent-workflow/reports/quality-gates-syntax-2026-05-04-20260504-144808.md`。

自动化影响复核：

- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。
