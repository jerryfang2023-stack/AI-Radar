# WSD-20260511-02-v2-member-auth-pages-redesign Closeout

日期：2026-05-11  
执行窗口：V2 会员注册 / 登录 / 账户页面重新设计并接入新站  
结论：accepted

## 1. 修改文件列表

- `01-SiteV2/site/login.html`
- `01-SiteV2/site/register.html`
- `01-SiteV2/site/account.html`
- `01-SiteV2/site/pricing.html`
- `01-SiteV2/site/checkout.html`
- `01-SiteV2/site/index.html`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/assets/app.js`
- `agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/*.png`
- `agent-workflow/reports/WSD-20260511-02-v2-member-auth-pages-redesign-closeout.md`
- `agent-workflow/inbox/closeout-queue.jsonl`

## 2. 页面决策表

| 页面 | V1 参考 | V2 是否保留 | 页面角色 | 关键用户动作 | 是否需要新文件 |
|---|---|---|---|---|---|
| 登录页 `login.html` | `login.html` | 保留 | 会员访问返回路径 | 输入邮箱和密码，查看页面反馈，进入账户状态 | 是 |
| 申请访问页 `register.html` | `register.html` / `invite-request.html` | 合并保留 | 注册与申请访问合并，避免邀请码流程伪装成真实认证 | 填写姓名、邮箱、机构、身份、关注议题 | 是 |
| 账户页 `account.html` | `account.html` | 保留 | 访问状态 / 会员状态预览 | 查看公开、申请中、会员预览状态和继续阅读路径 | 是 |
| 会员方案页 `pricing.html` | `pricing.html` | 保留 | 公开会员价值页 | 对比公开预览、商业内参会员、团队阅读 | 是 |
| 确认页 `checkout.html` | `checkout.html` | 降级为申请确认 | 无真实支付时说明确认边界 | 确认访问申请，不付款，不开通真实权限 | 是 |
| 旧 `apply.html` | `apply.html` | 不新增 | 由 `register.html` 承接 | 申请访问已合并 | 否 |

决策回答：

- 登录、注册、申请访问：登录独立；注册与申请访问合并为 `register.html`，不恢复 V1 邀请码 UI。
- Pricing：作为公开会员价值页保留，入口接入导航和首页 CTA。
- Checkout：降级为“访问确认页”，明确不付款、不真实开通权限。
- Account：展示访问状态 / 会员状态预览，不伪装真实登录账户。

## 3. 桌面端 UI / UE 规范表

| 页面 | 首屏结构 | 视觉资产 | 表单字段 | 主要按钮 | 次要路径 | 状态反馈 |
|---|---|---|---|---|---|---|
| 登录 | 左侧标题 + 右侧会员阅读说明 + 下方表单 | Logo、member brief tag、品牌 symbol | 邮箱、密码 | 登录并继续阅读 | 申请访问、会员方案、商业内参 | 空字段提示、提交成功提示 |
| 申请访问 | 左侧申请价值 + 右侧审核说明 + 双列申请表 | key judgment block、品牌 symbol | 姓名、邮箱、公司/机构、身份、关注议题 | 提交访问申请 | 登录、会员方案、确认页 | 空字段提示、提交成功提示 |
| 账户 | 左侧状态说明 + 右侧状态卡 + 下方两栏 | 品牌 symbol | 无输入 | 按状态进入申请 / 确认 / 内参 | 商业内参、会员方案、补充申请 | 读取本地访问状态预览 |
| 会员方案 | 左侧价值表达 + 右侧内参样张 + 三栏方案 | brief cover、品牌 symbol | 无输入 | 申请进入完整情报层 | 本期预览、确认方式 | 明确无真实价格和支付 |
| 确认页 | 左侧确认边界 + 右侧方案摘要 + 表单 | 品牌 symbol | 邮箱、访问类型、边界确认 | 确认访问申请 | 账户状态 | 空字段提示、提交成功提示 |

## 4. Copy 规范表

| 页面 | H1 | 副标题 | 主按钮 | 次按钮 | 边界提示 | 禁用表达 |
|---|---|---|---|---|---|---|
| 登录 | 回到你的 AI 商业判断层 | 登录后继续查看商业内参预览、账户访问状态和已保存的阅读路径。 | 登录并继续阅读 | 申请访问 | 尚未开放真实账户认证。 | 不写立即开通、保证收益、财富密码 |
| 申请访问 | 申请进入完整情报层 | 适合需要持续观察 AI 商业信号、证据边界和机会变化的读者。 | 提交访问申请 | 查看确认页 | 当前不接入真实审核、邀请码或支付服务。 | 不写赋能、领先平台、马上行动 |
| 账户 | 查看你的访问状态 | 当前账户页展示会员访问层级预览。 | 按状态进入下一步 | 返回内参 / 会员方案 | 真实认证、权限和订阅服务后续接入。 | 不写后台、Admin、JSON、同步 |
| 会员方案 | 持续阅读 AI 商业判断 | 当前只展示方案说明，不接入真实支付。 | 申请进入完整情报层 | 查看本期预览 | 不展示真实价格，不完成支付。 | 不写投资回报、确定性机会 |
| 确认页 | 确认申请，不在这里付款 | 确认页只说明申请信息、阅读边界和后续处理方式。 | 确认访问申请 | 查看账户状态 | 不付款，不代表权限已经开通。 | 不伪装真实 checkout |

## 5. Dev 实现摘要

- 新增 5 个 V2 会员页面，全部复用 `data-header`、`data-footer`、`assets/styles.css`、`assets/app.js`。
- 导航右侧 `会员方案` 指向 `pricing.html`，头像入口指向 `login.html`。
- 首页最终 CTA 改为进入会员方案；商业内参页动态会员动作改为进入 `pricing.html` / `register.html`。
- 表单统一支持必填校验、空字段提示和提交成功反馈；不连接真实认证、支付、Netlify、自动化或 `09-ai-news-radar`。
- 账户页读取本地 `wavesight-member-state` 状态，仅用于页面预览。

## 6. 桌面端 QA 结果

本地地址：`http://127.0.0.1:4173`

桌面视口：`1440 x 1000`

截图路径：

- `agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/login-desktop.png`
- `agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/register-desktop.png`
- `agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/account-desktop.png`
- `agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/pricing-desktop.png`
- `agent-workflow/reports/screenshots/WSD-20260511-02-v2-member-auth-pages-redesign/checkout-desktop.png`

检查结论：

- 5 个页面均可打开，H1、导航、Logo、页脚和主要跳转存在。
- 登录表单空字段提示通过：`请先补全必填信息。`
- 登录表单提交反馈通过：`已记录登录演示状态。你可以继续查看账户访问状态。`
- 页面未出现 Admin、JSON、同步、恢复、编辑等后台痕迹。

## 7. 移动端基础观察

移动端专项设计 / 截图验收按派发单暂缓。  
基础观察视口：`390 x 844`

结论：`login.html`、`register.html`、`account.html`、`pricing.html`、`checkout.html` 均无严重横向溢出；检测结果均为 `scrollWidth = clientWidth = 390`。

## 8. 质量检查结果

- `node --check 01-SiteV2/site/assets/app.js`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed

说明：syntax gate 报告中子命令显示 `child_process spawn blocked (EPERM)`，但统一闸门返回 `passed`；已额外直接执行 `app.js` 语法检查并通过。

最新报告：`agent-workflow/reports/quality-gates-syntax-2026-05-11-20260511-052846.md`

## 9. 后续真实认证 / 支付 / 权限建议

- PM / Dev 另立专项确认真实账号模型、会员状态、过期状态、团队席位和权限边界。
- 支付接入前先确定价格策略、发票、退款、试读和人工审核流程。
- 后端认证接入后，账户页应从真实 session / profile 读取状态，不再依赖本地预览状态。
- 权限接入后，商业内参、机会解码和来源摘要应统一使用同一套访问判定。

## 10. closeout queue 登记状态

已向 `agent-workflow/inbox/closeout-queue.jsonl` 追加登记，等待调度窗口验收。
