# WSD-20260504-13 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-13-homepage-hero-carousel-assets

本任务必须在派生工作树中完成。建议工作树名称：
01-WaveSight-p0-2a-hero-carousel

建议分支名：
task/WSD-20260504-13-homepage-hero-carousel-assets

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

你是本任务的独立执行窗口。

牵头角色：
UI / UE Agent

协作角色：
Copy Agent、Dev Agent、QA Agent

任务目标：
在派生工作树中制作 3 张首页首屏轮播图，并替换现在首页首屏画面。轮播图要体现观澜AI“面向商业决策者的 AI 机会判断系统”的价值，而不是普通 AI 科技感背景、资讯站首屏或后台仪表盘。

P0-2 已验收结论：
首页首屏主视觉必须从抽象雷达转向“情报桌面 + 真实判断样张”。用户已喜欢展示图风格，参考路径为：
C:\Users\86186\.codex\generated_images\019def03-4307-7030-9f0c-2652d44d41c3\ig_0cfd0bd9306732b40169f88439f79c8191b41ca3226c8b9d39.png

视觉边界：
- 保留象牙白底、深石墨文字、深墨绿重点面板和少量铜棕强调。
- 右侧视觉应展示 Signals、Opportunity Watch、Trend Status 与 Brief 的判断关系。
- 不做霓虹科技风、大屏监控风、后台数据面板或抽象氛围图。

执行要求：
1. 先确认当前派生工作树可用；如果不可用，停止并写明阻塞原因。
2. 制作或生成 3 张首页首屏图，建议放入：
   - 04-Site/assets/hero/hero-signal-radar.webp
   - 04-Site/assets/hero/hero-commercial-adoption.webp
   - 04-Site/assets/hero/hero-opportunity-map.webp
3. 图片中不要嵌入文字；首屏文字由 HTML/CSS 承载。
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
