# WSD-20260504-24 新窗口执行提示词

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

完成后回到主调度窗口汇报：
收口：agent-workflow/reports/WSD-20260504-24-login-register-page-optimization-closeout.md
```
