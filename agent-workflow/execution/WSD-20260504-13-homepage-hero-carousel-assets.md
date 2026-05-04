# WSD-20260504-13-homepage-hero-carousel-assets 派发单

日期：2026-05-04  
状态：dispatched  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue`  
协作 Agent：`copy` / `dev` / `qa` / `pm`

## 1. 任务目标

- 在派生工作树中制作 3 张首页首屏轮播图。
- 替换当前首页首屏画面，让首页第一眼更像“面向商业决策者的 AI 机会判断系统”，而不是普通资讯站、模板页或后台页面。
- 轮播图必须服务首页价值表达，和 `观澜AI｜WaveSight AI` 的克制商业情报调性一致。
- 完成后生成 UTF-8 收口文件，回到调度中枢窗口汇报。

## 2. 非目标

- 不修改内容源 Markdown。
- 不修改 `sync-data.mjs`、`check-relations.mjs`、`unified-site-sync.mjs`。
- 不调整 Daily Brief、Signals、The Point、Opportunities、Trends 的数据结构。
- 不接入真实 CMS、云端存储或后台上传能力。
- 不把首页改成营销长页面；本任务只处理首页首屏轮播图与必要的首屏承载结构。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Agent | 定义三张图的视觉方向、构图、裁切、首屏层级和桌面/移动端验收点 |
| Copy Agent | 控制首屏叠加文案，避免空泛营销语和内部话术 |
| Dev Agent | 在派生工作树中新增图片资产并替换首页首屏轮播展示 |
| QA / Acceptance Agent | 做桌面端、移动端、无横向溢出、轮播可用性和首屏成品感验收 |
| PM Agent | 确认任务边界，不扩散成整站首页重构 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md`
5. `agent-workflow/product/DESIGN.md`
6. `agent-workflow/product/COPY.md`
7. `agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md`
8. `agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md`
9. `agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md`

`WSD-20260504-09-homepage-hero-optimization-plan` 已由调度中枢验收为 `accepted`。本任务必须承接其规划结论，不再另起首页首屏方向。

## 5. 允许改动范围

- `04-Site/index.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`
- `04-Site/assets/hero/`
- `agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`
- 必要的截图验收文件：`agent-workflow/reports/*hero-carousel*.png`

## 6. 禁止改动范围

- 不改动内容源 Markdown：`01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/`。
- 不改动网站数据文件：`04-Site/data/radar-data.json`、`04-Site/data/radar-data.js`。
- 不改动同步、关系、标签、统一同步脚本。
- 不改动自动化任务提示词、时间线或运行顺序。
- 不新增重型前端依赖。
- 不在轮播图片中嵌入文字；文字应由 HTML/CSS 承载，保证可访问、可响应、可修改。

## 7. 视觉方向

P0-2 已确认的主方向：

- 首页首屏从抽象雷达流程图转向“情报桌面 + 真实判断样张”。
- 用户已明确喜欢本轮展示图风格，后续应参考其象牙白底、深石墨文字、深墨绿重点面板和少量铜棕强调。
- 展示图仅作风格参考，不是最终站点资产：`C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png`
- 右侧视觉应展示 Signals、Opportunity Watch、Trend Status 与 Brief 的判断关系。
- 不做霓虹科技风、大屏监控风、后台数据面板或抽象氛围图。

三张图建议分别表达：

1. **信号雷达**：从 AI 热点、融资、客户采用、产品入口中筛出商业信号。视觉可用克制的情报地图、信号节点、资料层、低饱和光线。
2. **商业采用**：AI 从概念进入企业工作流、客户场景和收入证据。视觉可用董事会桌面、产业地图、企业工作流、轻量数据层。
3. **机会判断**：从信号形成趋势判断，再连接到可继续观察的机会。视觉可用机会网络、趋势分层、决策桌面、报告纸面。

视觉约束：

- 必须是高端商业情报 / 专业研究产品气质。
- 避免紫蓝科技渐变、霓虹、赛博风、通用 SaaS 插画、股市 K 线堆叠、AI 机器人头像。
- 图片不要像后台仪表盘截图，不要出现 JSON、同步、Admin、字段等内部痕迹。
- 色彩优先象牙白、深石墨、深墨绿、低饱和青绿、少量铜棕。
- 桌面端和移动端都要裁切自然；重要视觉元素不得只出现在最边缘。

建议资产：

- `04-Site/assets/hero/hero-signal-radar.webp`
- `04-Site/assets/hero/hero-commercial-adoption.webp`
- `04-Site/assets/hero/hero-opportunity-map.webp`

如工具链不便生成 WebP，可先使用 PNG，但 closeout 中要说明压缩与后续优化建议。

## 8. 首屏文案建议

首页首屏必须保留品牌第一信号：

```text
观澜AI｜WaveSight AI
```

可在轮播中使用的短句方向：

1. `在共识形成前，看见 AI 商业变化`
2. `少追概念，多看谁正在变成生意`
3. `从信号到机会，保留证据边界`

支撑文案可从以下方向中选择或压缩：

- `从融资、客户采用、产品入口和产业落地中，筛出值得继续观察的信号。`
- `把碎片新闻压缩成可讨论、可追踪、可复盘的商业判断。`
- `不替你下最终判断，只呈现事实、关系和仍需观察的反证。`

禁用：

- `赋能`
- `生态闭环`
- `一站式`
- `颠覆未来`
- `确定性机会`
- `立即行动`
- `财富密码`
- `本页用于`
- `入口`
- `同步`
- `字段`
- `后台`

## 9. 交互与实现要求

- 轮播自动切换间隔建议 6-8 秒，不要高频闪动。
- 提供上一张 / 下一张按钮和圆点状态，按钮需有 `aria-label`。
- 支持键盘或点击操作。
- 支持 `prefers-reduced-motion`，用户减少动态时应降低或关闭过渡动画。
- 图片加载前不能造成首屏布局跳动。
- 移动端首屏文字不能压住主体视觉，也不能溢出屏幕。
- 不使用重型轮播库；优先用少量原生 JS + CSS。

## 10. 派生工作树要求

- 本任务必须在派生工作树中完成。
- 如果当前项目不是 git 仓库，或无法创建派生工作树，执行窗口不要假装完成；必须在 closeout 中写明阻塞原因，并回到调度中枢确认替代方案。
- 不要修改主工作树中的无关文件。
- 不要回滚用户或其他窗口的改动。

## 11. 必跑检查

- [ ] `node --check 04-Site/js/app.js`
- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 浏览器桌面端首页截图验收
- [ ] 浏览器移动端首页截图验收
- [ ] 检查首页无横向溢出
- [ ] 检查轮播 3 张图都能加载、切换和显示

如未运行某项，必须在 closeout 中说明原因和风险。

## 12. 自动化影响

预计不影响：

- `ai-the-point`
- `ai-2`
- `ai-3`

原因：本任务只修改首页展示层和静态图片资产，不改变 Markdown 命名、内容字段、同步脚本、关系检查或统一同步闸门。

如果执行过程中改动超出 `04-Site/index.html`、`04-Site/css/styles.css`、`04-Site/js/app.js` 和 `04-Site/assets/hero/`，必须在 closeout 中单独说明是否影响自动化。

## 13. 预期输出

- 3 张首页首屏轮播图资产。
- 首页首屏替换为可用轮播。
- 桌面端和移动端截图。
- 收口文件：`agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md`

## 14. 执行窗口启动提示词

如果派生工作树界面中不方便复制长提示词，可让执行窗口直接读取：

```text
agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets-window-prompt.md
```

然后执行其中任务。

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

本任务必须在派生工作树中完成，不要直接在主工作树里改无关文件。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-13-homepage-hero-carousel-assets.md
5. agent-workflow/product/DESIGN.md
6. agent-workflow/product/COPY.md
7. agent-workflow/execution/WSD-20260504-09-homepage-hero-optimization-plan.md
8. agent-workflow/reports/homepage-hero-optimization-plan-2026-05-04.md
9. agent-workflow/reports/WSD-20260504-09-homepage-hero-optimization-plan-closeout.md

你是本任务的独立执行窗口，牵头角色为 UI / UE Agent，协作角色为 Copy Agent、Dev Agent、QA Agent。

任务目标：
在派生工作树中制作 3 张首页首屏轮播图，并替换现在首页首屏画面。轮播图要体现观澜AI“面向商业决策者的 AI 机会判断系统”的价值，而不是普通 AI 科技感背景、资讯站首屏或后台仪表盘。

P0-2 已验收结论：
首页首屏主视觉必须从抽象雷达转向“情报桌面 + 真实判断样张”。用户已喜欢展示图风格，参考路径为：
C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png

执行要求：
1. 先确认当前是否能使用派生工作树；如果不能，停止并在 closeout 写明阻塞原因。
2. 生成或制作 3 张首屏图，建议放入：
   - 04-Site/assets/hero/hero-signal-radar.webp
   - 04-Site/assets/hero/hero-commercial-adoption.webp
   - 04-Site/assets/hero/hero-opportunity-map.webp
3. 图片中不要嵌入文字；文字由 HTML/CSS 承载。
4. 修改首页首屏为 3 图轮播，保留品牌第一信号：观澜AI｜WaveSight AI。
5. 叠加文案要克制、有判断边界，避免内部话术和空泛营销语。
6. 不改内容源 Markdown，不改同步脚本，不改自动化任务。
7. 完成后做桌面端和移动端浏览器截图验收，确认无横向溢出，3 张图都能加载与切换。

必跑检查：
- node --check 04-Site/js/app.js
- node agent-workflow/tools/run-quality-gates.mjs syntax
- 浏览器桌面端首页截图
- 浏览器移动端首页截图

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-13-homepage-hero-carousel-assets-closeout.md

收口文件必须写清：
- 做了什么
- 生成了哪 3 张图
- 改了哪些文件
- 运行了哪些检查
- 截图路径
- 哪些检查未运行及原因
- 是否影响 ai-the-point、ai-2、ai-3
- 是否可以由主调度窗口验收合并
```
