# WSD-20260511-02-v2-member-auth-pages-redesign 派发单

日期：2026-05-11  
状态：ready  
派发模式：autopilot_chain / desktop_first  
牵头 Agent：UI-UE Agent / Dev Agent  
协作 Agent：PM Agent / Copy Agent / QA Agent / Workflow Agent  
任务类型：页面设计开发 / 会员入口 / V2-only 新站接入  
Skill Pattern：Inversion + Generator + Reviewer + Pipeline  

## 0. 任务卡片

将 V1 归档中的会员注册、登录、申请访问、账户和价格相关页面作为流程参考，按当前观澜AI V2 的 UI、VI、文案和桌面端优先开发口径重新设计，并接入 `01-SiteV2/site/`。

本任务不是恢复 V1 页面，也不是沿用 V1 旧样式；目标是在 V2 新站中建立可用、统一、克制、有商业内参气质的会员入口页面体系。

## 1. 执行窗口启动读取

新窗口先读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. `agent-workflow/execution/WSD-20260511-02-v2-member-auth-pages-redesign.md`

本任务补读：

1. `agent-workflow/product/DESIGN.md`
2. `agent-workflow/product/COPY.md`
3. `docs/brand/wavesight-ai-vi/USAGE.md`
4. `docs/brand/wavesight-ai-vi/brand-tokens.css`
5. `docs/brand/wavesight-ai-vi/typography-guidelines.md`

V1 参考页面只允许读取以下归档文件作为流程和字段参考：

1. `10-Archive/v1.0/site/04-Site/login.html`
2. `10-Archive/v1.0/site/04-Site/register.html`
3. `10-Archive/v1.0/site/04-Site/account.html`
4. `10-Archive/v1.0/site/04-Site/apply.html`
5. `10-Archive/v1.0/site/04-Site/invite-request.html`
6. `10-Archive/v1.0/site/04-Site/pricing.html`
7. `10-Archive/v1.0/site/04-Site/checkout.html`

不要读取或恢复 V1 旧站的全局样式、旧视觉基线或旧自动化。

## 2. 当前约束

1. 当前项目是 V2-only 生产开发。
2. 当前网站开发采用桌面端优先：桌面端设计、实现和截图 QA 是 accepted 硬闸门。
3. 移动端专项设计 / 开发 / 截图暂缓；本任务只做基础不崩坏观察，不作为 accepted 阻塞。
4. 禁止继承 `V2-SITE-QUALITY-AUTO` 的任何失败结论。
5. 禁止使用 `frontend-design` 作为设计口径。
6. Logo、字体、背景、色彩和页面气质必须按 `docs/brand/wavesight-ai-vi/` 与 `DESIGN.md`。
7. 普通前台不能出现 Admin、JSON、同步、恢复、编辑等后台痕迹。

## 3. 目标范围

至少完成以下 V2 会员入口页面或等价页面：

1. 登录页：`01-SiteV2/site/login.html`
2. 注册 / 申请访问页：`01-SiteV2/site/register.html` 或 `01-SiteV2/site/apply.html`
3. 会员账户页 / 访问状态页：`01-SiteV2/site/account.html`
4. 会员方案 / 订阅说明页：`01-SiteV2/site/pricing.html`
5. 结账 / 申请确认页：`01-SiteV2/site/checkout.html` 或等价确认页

如执行窗口判断部分页面应合并，必须在 Stage A 写出页面合并决策表，并保证用户路径仍完整：

```text
未登录用户 -> 了解会员价值 -> 申请 / 注册 -> 登录 -> 查看账户状态 -> 返回商业内参或机会解码
```

## 4. 非目标

本任务不做：

1. 不接入真实支付。
2. 不新增真实后端认证。
3. 不修改 Netlify、GitHub、自动化任务或环境变量。
4. 不修改内容 schema、每日内容脚本或 `01-SiteV2/content/`。
5. 不处理 `09-ai-news-radar/`。
6. 不恢复 V1 页面样式。
7. 不做移动端专项设计。

如发现需要真实认证、支付、权限或数据库方案，停止并写为后续 PM / Dev 专项，不得在本任务中临时硬接。

## 5. 允许写入范围

允许写入或修改：

1. `01-SiteV2/site/login.html`
2. `01-SiteV2/site/register.html`
3. `01-SiteV2/site/apply.html`
4. `01-SiteV2/site/account.html`
5. `01-SiteV2/site/pricing.html`
6. `01-SiteV2/site/checkout.html`
7. `01-SiteV2/site/assets/styles.css`
8. `01-SiteV2/site/assets/app.js`
9. `agent-workflow/reports/WSD-20260511-02-v2-member-auth-pages-redesign-closeout.md`
10. `agent-workflow/inbox/closeout-queue.jsonl`

如新增页面数量少于以上列表，必须说明合并理由。

禁止写入：

1. `10-Archive/`
2. `09-ai-news-radar/`
3. `docs/brand/wavesight-ai-vi/`
4. `agent-workflow/product/DESIGN.md`
5. `agent-workflow/product/COPY.md`
6. `agent-workflow/tools/`
7. `.netlify/`

## 6. 执行阶段

### Stage A：页面体系和路径确认

输出一张页面决策表：

| 页面 | V1 参考 | V2 是否保留 | 页面角色 | 关键用户动作 | 是否需要新文件 |
|---|---|---|---|---|---|

必须回答：

1. 登录、注册、申请访问是否分开。
2. Pricing 是否作为公开会员价值页。
3. Checkout 在无真实支付时如何表达。
4. Account 在无真实登录后端时如何展示“访问状态 / 会员状态”。

### Stage B：UI / UE 规范表

输出桌面端 UI / UE 规范表：

| 页面 | 首屏结构 | 视觉资产 | 表单字段 | 主要按钮 | 次要路径 | 状态反馈 |
|---|---|---|---|---|---|---|

要求：

1. 统一使用 V2 导航、背景、Logo 和字体系统。
2. 表单区域要克制、清晰、可信，不做普通 SaaS 模板感。
3. 页面应像“商业内参会员入口”，不是后台登录页。
4. 视觉资产优先使用现有 VI SVG、澜线、地平线、热力/雷达/内参符号，不重画 Logo。

### Stage C：Copy 规范表

输出 Copy 表：

| 页面 | H1 | 副标题 | 主按钮 | 次按钮 | 边界提示 | 禁用表达 |
|---|---|---|---|---|---|---|

要求：

1. 不写“赋能”“领先平台”“立即抓住风口”等营销化文案。
2. 不承诺投资、经营或商业回报。
3. 会员价值表达聚焦：更早发现信号、更清楚理解证据、更系统跟踪机会。
4. 无真实支付或认证能力时，文案必须写清当前是“申请访问 / 访问状态 / 会员预览”，不能伪装成已完成真实支付。

### Stage D：Dev 实现

按 Stage A-C 表格实现 V2 页面。

必须完成：

1. 新页面能从 V2 当前导航或相关 CTA 进入。
2. 登录 / 注册 / 申请 / 账户 / 价格之间路径可跳转。
3. 表单有基础前端状态：空字段提示、提交反馈、返回路径。
4. 不出现后台痕迹。
5. 不破坏现有首页、今日要点、关键信号、机会解码、商业内参页面。

### Stage E：桌面端 QA

至少完成桌面端截图或浏览器检查：

1. `login.html`
2. `register.html` 或 `apply.html`
3. `account.html`
4. `pricing.html`
5. `checkout.html` 或等价确认页

建议桌面视口：

```text
1440 x 1000
```

移动端只做基础观察：无严重横向溢出、页面不白屏；不作为本任务 accepted 硬阻塞。

## 7. 验收标准

1. V2 会员入口页面体系完整。
2. 页面风格符合当前 VI、DESIGN 和桌面端优先口径。
3. V1 只作为流程参考，未恢复旧样式。
4. 有 UI / UE 规范表。
5. 有 Copy 规范表。
6. Dev 按表实现。
7. 桌面端截图 QA 完成。
8. 页面跳转路径可用。
9. `app.js` 语法检查通过。
10. 未修改禁止范围。
11. closeout queue 已登记。

## 8. 质量检查

至少执行：

```powershell
node --check 01-SiteV2/site/assets/app.js
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如运行本地浏览器验收，closeout 中写明：

1. 本地地址。
2. 检查页面。
3. 桌面视口。
4. 截图路径或检查结论。
5. 移动端基础观察结论，如未做需说明原因。

## 9. 收口文件要求

收口文件保存为 UTF-8：

```text
agent-workflow/reports/WSD-20260511-02-v2-member-auth-pages-redesign-closeout.md
```

收口必须包含：

1. 任务结论：accepted / needs-followup / blocked。
2. 修改文件列表。
3. 页面决策表。
4. UI / UE 规范表。
5. Copy 规范表。
6. Dev 实现摘要。
7. 桌面端 QA 结果。
8. 质量检查结果。
9. 未覆盖移动端的说明。
10. 后续真实认证 / 支付 / 权限建议。
11. closeout queue 登记状态。

## 10. 给新窗口的执行提示词

请复制以下内容到新窗口：

```text
请按 01-WaveSight 项目长期 agent-workflow 执行任务。

任务 ID：WSD-20260511-02-v2-member-auth-pages-redesign
任务名称：V2 会员注册 / 登录 / 账户页面重新设计并接入新站

先读取：
1. AGENTS.md
2. agent-workflow/governance/current-context.md
3. agent-workflow/execution/WSD-20260511-02-v2-member-auth-pages-redesign.md

你是本任务执行窗口，不是调度中枢。

请按派发单完成：
1. 读取 V2 DESIGN / COPY / VI 规范。
2. 只把 V1 归档中的 login / register / account / apply / invite-request / pricing / checkout 作为流程参考，不继承旧 UI。
3. 先输出页面决策表、桌面端 UI/UE 规范表、Copy 规范表。
4. 按表在 01-SiteV2/site/ 中实现 V2 会员注册、登录、账户、会员方案和确认页或等价页面。
5. 当前开发桌面端优先：桌面端设计、实现和截图 QA 是硬闸门；移动端专项暂缓，只做基础不崩坏观察。
6. 不接入真实支付、真实后端认证、Netlify、自动化或 09-ai-news-radar。
7. 完成后运行 node --check 01-SiteV2/site/assets/app.js 和 syntax quality gate。
8. 写 UTF-8 收口文件：agent-workflow/reports/WSD-20260511-02-v2-member-auth-pages-redesign-closeout.md
9. 向 agent-workflow/inbox/closeout-queue.jsonl 追加登记。

完成后只回复收口文件路径和结论，等待调度窗口验收。
```
