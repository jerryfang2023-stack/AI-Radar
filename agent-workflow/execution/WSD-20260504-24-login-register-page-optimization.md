# WSD-20260504-24-login-register-page-optimization 派发单

日期：2026-05-04  
状态：ready  
调度窗口：当前主窗口  
牵头 Agent：`ui-ue / copy / dev / qa`

## 1. 任务目标

优化观澜AI登录页与注册页，让普通用户能清楚理解账号入口、注册后的阅读权限、登录后的去向，并使页面视觉、文案和交互质量达到上线前可验收水平。

本任务必须直接完成页面设计、文案、前端实现和基础验收，结束后再回到调度中枢窗口提交 closeout。

## 2. 非目标

- 不接入真实后端账号系统。
- 不接入真实短信、邮箱验证码或支付。
- 不改变会员策略、默认阅读有效期或 Admin 权限模型。
- 不新增公开“申请访问 / 申请试读”流程。
- 不改内容源 Markdown、网站数据、同步脚本或自动化任务。

## 3. 牵头与协作

| Agent | 职责 |
|---|---|
| UI / UE Agent | 输出登录 / 注册页面规范表，定义布局、层级、桌面与移动验收点 |
| Copy Agent | 输出登录 / 注册文案规范表，控制语气、边界、CTA、禁用语和容器适配 |
| Dev Agent | 按 UI/UE 与 Copy 规范表实现页面，不自行新增关键文案 |
| QA / Acceptance Agent | 独立做桌面 / 移动截图、页面类与文案类验收 |
| PM Agent | 负责范围边界，确认不改变会员策略 |
| Workflow / Automation Agent | 记录 closeout、质量门和自动化影响 |

## 4. 执行窗口必须读取

1. `AGENTS.md`
2. `docs/agent-handoff.md`
3. `agent-workflow/governance/window-dispatch-hub.md`
4. `agent-workflow/execution/WSD-20260504-24-login-register-page-optimization.md`
5. `agent-workflow/agents/ui-ue-agent.md`
6. `agent-workflow/agents/copy-agent.md`
7. `agent-workflow/agents/dev-agent.md`
8. `agent-workflow/agents/qa-agent.md`
9. `agent-workflow/product/DESIGN.md`
10. `agent-workflow/product/COPY.md`
11. `agent-workflow/prd/active/PRD-005-membership-access.md`
12. `agent-workflow/execution/acceptance-checklist.md`

## 5. 允许改动范围

- `04-Site/login.html`
- `04-Site/register.html`
- `04-Site/css/styles.css`
- `04-Site/js/app.js`，仅限登录 / 注册页面交互、状态提示、跳转或演示态逻辑
- `agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`
- 必要截图或验收报告：
  - `agent-workflow/reports/WSD-20260504-24-login-desktop.png`
  - `agent-workflow/reports/WSD-20260504-24-login-mobile.png`
  - `agent-workflow/reports/WSD-20260504-24-register-desktop.png`
  - `agent-workflow/reports/WSD-20260504-24-register-mobile.png`

## 6. 禁止改动范围

- 不改 `04-Site/data/`。
- 不改 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-Point/`、`07-Opportunities/`。
- 不改 `sync-data.mjs`、`check-relations.mjs`、`check-point-quality.mjs`、`unified-site-sync.mjs`。
- 不改自动化任务 `ai-the-point`、`ai-2`、`ai-3`。
- 不把 Admin、JSON、同步、编辑、恢复、字段、后台等痕迹放入普通登录 / 注册页。

## 7. 预期输出

- 登录页完成设计、文案和前端实现。
- 注册页完成设计、文案和前端实现。
- 页面清楚表达：
  - 注册后获得默认阅读有效期。
  - 已注册用户从登录进入。
  - 管理员能力不从普通入口暴露。
  - 观澜AI提供商业信号、趋势与机会观察，不替代最终经营、投资或合作判断。
- 收口文件：`agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md`

## 7A. 页面类任务硬性要求

本任务是页面类 + 文案类任务，必须执行页面派发闸门。

### 7A.1 UI/UE 页面规范表

执行窗口必须先由 UI/UE Agent 输出登录 / 注册页面规范表，至少包含：

- 页面类型：会员 / 账号入口页，普通前台页面。
- 页面目标：用户 5 秒内知道该登录还是注册，以及注册后能获得什么阅读权限。
- 设计基准：必须读取 `DESIGN.md`，必须使用 `frontend-design` 规范；必要时可参考 `awesome-design-md`，但不得做营销落地页式夸张 hero。
- 布局基准：主容器宽度、表单区宽度、标题位置、字段高度、按钮高度、页面上下留白、移动端单列规则。
- 字体层级：H1、导语、字段 label、按钮、辅助说明、错误提示。
- 间距基准：标题区、表单字段、CTA、辅助链接、说明区和移动端压缩规则。
- 组件克制规则：不做后台面板堆叠，不做粗糙表单卡片，不用夸张渐变或大面积装饰。
- 前台 / Admin 边界：普通入口不得出现后台能力、管理员入口提示、同步、JSON、编辑、恢复等词。
- 桌面端验收点：登录页和注册页标题、表单起点、按钮宽度、视觉重心一致，无横向溢出。
- 移动端验收点：字段可点击、按钮不拥挤、标题不压迫、辅助说明不断裂。
- 禁止项：申请访问、申请试读、保证结果、立即抢占机会、必投机会、内部审批、后台、字段、同步、JSON。

没有 UI/UE 页面规范表，不得进入 Dev 实现；closeout 不得标记完成。

### 7A.2 Copy 文案规范表

执行窗口必须先由 Copy Agent 输出登录 / 注册文案规范表，至少包含：

- 页面任务：登录页帮助已注册用户返回阅读；注册页帮助新用户建立账号并获得默认阅读有效期。
- 目标理解：用户知道观澜AI是什么、注册后能看什么、登录后会去哪里。
- 栏目/页面标题：登录页和注册页最终 H1。
- 关键文案：H1、导语、字段 label、主按钮、辅助链接、错误提示、空状态、权限说明。
- 证据边界：不承诺经营、投资、合作结果；只表达商业信号、趋势和机会观察。
- 禁用语检查：不得出现内部流程语、申请访问、申请试读、强说服、过度承诺。
- 标题长度与容器适配：桌面和移动端都不能断行难看或挤压按钮。
- 与 UI/UE 的交接：长说明如何放置、是否需要折行、是否需要弱化为辅助说明。
- QA 文案验收点：禁用语、判断边界、标题长度、CTA 语气、容器适配。

Dev 不得自行补写、改写或扩写 Copy 未提供的关键文案。

### 7A.3 Dev 按表实现

Dev Agent 必须逐条说明 UI/UE 页面规范表和 Copy 文案规范表的实现情况：

- 已实现条目。
- 未实现条目及原因。
- 是否新增临时样式或偏离规范。
- 是否自行新增或改写 Copy 未提供的关键文案。
- 是否影响其他栏目 / Admin 模块 / 移动端。

### 7A.4 QA 独立验收

QA Agent 必须独立按 UI/UE 页面规范表和 Copy 文案规范表验收：

- 登录页桌面截图。
- 登录页移动截图。
- 注册页桌面截图。
- 注册页移动截图。
- 标题位置 / 字号 / 行高 / 模块起点。
- 首屏主次。
- 字体层级。
- 间距一致性。
- 无横向溢出。
- 普通前台无后台痕迹。
- 禁用语检查。
- 判断边界检查。
- 标题长度与容器适配。

以下任一情况即阻塞，不得验收通过：

- 登录 / 注册页面粗糙、简陋、像模板页或临时拼装页。
- 表单字段、标题、按钮或辅助链接层级混乱。
- 移动端横向溢出、遮挡、重叠或按钮不可点。
- 普通前台出现 Admin、JSON、同步、编辑、恢复、字段、后台等痕迹。
- 出现申请访问、申请试读、保证收益、立即行动、必投机会等禁用表达。

## 7B. 文案类任务硬性要求

本任务已经并入 7A 页面类任务闸门，不单独执行 7B。

## 8. 必跑检查

- [ ] `node agent-workflow/tools/run-quality-gates.mjs syntax`
- [ ] 如修改 `04-Site/js/app.js`，运行 `node --check 04-Site/js/app.js`
- [ ] 浏览器桌面 / 移动端检查
- [ ] 页面类任务：UI/UE 页面规范表
- [ ] 页面类任务：Copy 文案规范表
- [ ] 页面类任务：Dev 按表实现说明
- [ ] 页面类任务：QA 桌面 / 移动端截图和坐标/字号/间距/文案验收

未运行的检查必须在收口文件中说明原因和风险。

## 9. 自动化影响

- 是否可能影响 `ai-the-point`：否
- 是否可能影响 `ai-2`：否
- 是否可能影响 `ai-3`：否

本任务只改普通前台登录 / 注册页面，不改 Markdown 字段、内容源、同步脚本、统一同步闸门或自动化时间线。

## 10. 执行窗口启动提示词

```text
请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-24-login-register-page-optimization.md

你是本任务的独立执行窗口，牵头 Agent 为 UI / UE Agent、Copy Agent、Dev Agent、QA / Acceptance Agent。

任务目标：
直接完成登录页和注册页优化，包括 UI/UE 页面规范表、Copy 文案规范表、前端开发实现、桌面与移动端截图验收。不要中途回调度窗口；全部完成后再提交 closeout。

必须读取并遵守：
- agent-workflow/product/DESIGN.md
- agent-workflow/product/COPY.md
- agent-workflow/prd/active/PRD-005-membership-access.md
- agent-workflow/governance/window-dispatch-hub.md 中页面 / 文案类任务硬闸门

允许改动：
- 04-Site/login.html
- 04-Site/register.html
- 04-Site/css/styles.css
- 04-Site/js/app.js，仅限登录 / 注册页面交互、状态提示、跳转或演示态逻辑
- agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md
- 必要截图文件

禁止改动：
- 内容源 Markdown
- 04-Site/data/
- 同步脚本、关系检查脚本、统一同步闸门
- ai-the-point、ai-2、ai-3 自动化任务
- 真实后端账号、真实验证码、真实支付或会员策略

强制要求：
1. 先输出 UI/UE 页面规范表。
2. 再输出 Copy 文案规范表。
3. Dev 按两个规范表逐条实现，不得自行补写关键文案。
4. QA 独立做登录页与注册页的桌面 / 移动端截图、坐标 / 字号 / 间距 / 文案验收。
5. 登录 / 注册普通前台不得出现 Admin、JSON、同步、编辑、恢复、字段、后台、申请访问、申请试读等表达。

完成后必须生成 UTF-8 收口文件：
agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md

收口文件必须写清：
- UI/UE 页面规范表
- Copy 文案规范表
- Dev 逐条实现情况
- QA 桌面 / 移动端截图路径
- 坐标 / 字号 / 间距 / 文案验收
- 改动文件
- 运行检查
- 未运行检查与风险
- 自动化影响
- 是否可由调度中枢标记 accepted
```
