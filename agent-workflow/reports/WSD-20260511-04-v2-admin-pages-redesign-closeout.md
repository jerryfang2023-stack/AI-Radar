# WSD-20260511-04 V2 Admin 页面重设计 Closeout

日期：2026-05-11  
状态：ready_for_independent_page_copy_quality_review  
执行窗口：UI / UE Agent + Dev Agent  

## 1. 改动摘要

- 新增 `01-SiteV2/site/admin.html`，作为 V2 内部只读管理台，不加入公开前台导航。
- 追加 `admin-v2-*` 作用域样式，使用观澜 VI token、字体 token、暖白页面背景、深海蓝状态卡和正式 SVG 资产。
- 在 `01-SiteV2/site/assets/app.js` 增加 `mountAdminV2()`，只在 `[data-admin-v2]` 页面运行，用现有 `site-content.js` 做只读数量和状态预览。
- V1 Admin 只作为功能参考，未修改 `10-Archive/` 原文件，未接入真实认证、支付、部署、写入接口、schema 或内容生产线。
- 2026-05-11 追加收口：按后台 CMS / 新闻发布系统口径重构 Admin 模块，完成项目统计 Dashboard、内容管理列表与单条独立可视化编辑页、用户权限统计与列表管理、邀请码生成与列表、订阅订单统计与列表管理。

## 2. 文件清单

| 文件 | 动作 | 说明 |
|---|---|---|
| `01-SiteV2/site/admin.html` | 新增 | V2 内部管理台页面 |
| `01-SiteV2/site/assets/styles.css` | 修改 | 追加 `admin-v2-*` 作用域样式 |
| `01-SiteV2/site/assets/app.js` | 修改 | 新增只读 Admin 数据填充与分区切换 |
| `agent-workflow/reports/WSD-20260511-04-admin-desktop-1440.png` | 新增 | 桌面端 QA 截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-member-ops-1440.png` | 新增 | 会员运营模块补充截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-invite-generator-1440.png` | 新增 | 邀请码生成机制截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-content-editor-1440.png` | 新增 | 内容单条编辑台截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-dashboard-1440.png` | 新增 | 项目统计 Dashboard 截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-users-1440.png` | 新增 | 用户权限管理截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-orders-1440.png` | 新增 | 订阅订单管理截图 |
| `agent-workflow/reports/WSD-20260511-04-admin-standalone-editor-1440.png` | 新增 | 单条内容独立编辑页截图 |
| `agent-workflow/reports/WSD-20260511-04-v2-admin-pages-redesign-closeout.md` | 新增 | 本收口文件 |
| `agent-workflow/inbox/closeout-queue.jsonl` | 修改 | 追加收口登记 |

## 3. V1 Admin 功能取舍表

| V1 功能参考 | V2 是否保留 | V2 位置 | 用户对象 | 数据来源 | 写入行为 | 理由 |
|---|---|---|---|---|---|---|
| 项目统计 / 运营仪表盘 | 保留并重写 | 今日生产 | 内部运营 | `site-content.js` | 无 | 看生产状态与内容规模 |
| 项目统计 / 运营仪表盘 | 保留并重写 | 项目统计 | 内部运营 | `site-content.js` + 本机演示数据 | 本机状态 | 展示 UV、PV、会员、付费、转化、内容与趋势 |
| 内容管理 / 稿件编辑 | 保留并重写 | 内容管理 | 内容运营 | `contentIndex` + 本机草稿 | 本机草稿 | CMS 列表 + 单条独立可视化编辑页 |
| 用户与权限 | 保留并重写 | 用户与权限 | 运营 / 管理员 | 本机用户权限表 | 本机权限表 | 用户统计、列表与角色 / 会员 / 状态控制 |
| 邀请码 | 保留为申请链路入口 | 会员运营 | 运营 | `invite-request.html` 链接 + 静态说明 | 无 | 不生成真实邀请码，只承接申请页 |
| 注册创建 | 保留为链路入口 | 会员运营 | 运营 | `register.html` 链接 + 本机演示状态 | 无 | 邀请码必填，但不校验真实邀请码池 |
| 邀请码 | 保留并重写 | 邀请码 | 运营 | 本机邀请码池 | 本机邀请码池 | 支持生成、列表、暂停 / 恢复、清空 |
| 订阅与订单 | 保留并重写 | 订阅与订单 | 运营 | 本机订单表 | 本机订单表 | 统计付费会员、金额、分类、趋势和订单状态 |
| 质量检查 | 保留并重写 | 质量检查台 | QA / Dev | 静态闸门说明 | 无 | 服务发布判断 |
| 系统设置 / 同步 | 合并降级 | 发布准备 | Dev / Workflow | 静态说明 | 无 | 不触发自动化、部署或同步 |
| 前台预览 | 保留 | 顶部状态条 | 管理员 | 真实链接 | 无 | 方便确认公开前台边界 |

## 4. Admin 信息架构表

| 能力 | V2 处理 | 说明 |
|---|---|---|
| 今日生产概览 | 保留 | 展示日期、信号、机会和知识资产数量 |
| 项目统计 Dashboard | 保留 | 展示 UV、PV、会员数、付费数、转化率、邀请码、访问趋势、会员漏斗、内容资产 |
| 内容管理 | 保留 | 新闻 CMS 形式：筛选栏、稿件表格、单条独立编辑页 |
| 内容单条编辑 | 保留为本机草稿 | 每条内容可编辑基础信息、摘要 / 判断、正文模块、来源 / 关系 / 标签 |
| 用户与权限 | 保留 | 用户统计、筛选、列表、角色 / 会员 / 账号状态保存 |
| 邀请码 | 保留 | 生成邀请码、列表、暂停 / 恢复、清空 |
| 订阅与订单 | 保留 | 付费会员统计、分类金额、日趋势、付费会员列表、订单状态保存 |
| 来源与证据质量 | 保留 | 区分 S/A、B、C/M 通道的使用边界 |
| 质量检查台 | 保留 | 展示页面、文案、来源和独立质检闸门 |
| 会员、注册与邀请码 | 保留 | 承接邀请码申请、邀请注册、账户权限、订阅确认四步链路 |
| 发布准备 | 只读 | 说明本地生成、语法检查、截图和独立质检状态 |
| 编辑、删除、邀请码、订单写入 | 删除 | 避免扩大到后端、支付、权限或数据写入 |

## 5. UI / UE 规范表与实现对照

| 页面区域 | 信息任务 | 视觉层级 | 组件形态 | 字体 / 间距 | 状态 | 验收点 |
|---|---|---|---|---|---|---|
| 左侧窄导航 | 稳定定位内部模块 | 低干扰、固定左栏 | Logo + 分区按钮 | 黑体 14、42px 控件 | 已实现 | 不进入公开导航 |
| 顶部状态条 | 显示内部控制台与内容时间 | 次一级 | 标题 + 状态 + 前台预览 | 衬线标题 30px | 已实现 | 无边框重装饰 |
| 今日生产首屏 | 说明 Admin 主任务 | 最高层级 | 大标题 + 深海蓝状态卡 | 衬线 38/52 | 已实现 | 像商业判断系统控制台 |
| 指标卡 | 压缩生产状态 | 中层级 | 四列数据卡 | Mono 数字 34px | 已实现 | 桌面无错位 |
| 内容运营表 | 栏目状态复核 | 中层级 | 克制状态表 | 14px / 24px | 已实现 | 不暴露原始字段 |
| 内容编辑台 | 单条内容编辑 | 中高层级 | 左侧列表 + 右侧表单 | 380px 列表 / 表单工作区 | 已实现 | 可保存和撤销本机草稿 |
| 项目统计 Dashboard | 网站运营概览 | 高层级 | KPI 卡 + 图表 | 六列 KPI / 双列图表 | 已实现 | 展示 UV、PV、会员、付费和趋势 |
| 内容管理 CMS | 稿件发布管理 | 高层级 | 筛选栏 + 表格 + 独立编辑页 | 表格列 + 模块化表单 | 已实现 | 每条内容进入独立编辑页 |
| 用户权限管理 | 用户与权限控制 | 高层级 | 统计卡 + 用户表 | 四列统计 / 权限 select | 已实现 | 可改角色、会员状态、账号状态 |
| 订单管理 | 订阅与收入管理 | 高层级 | 统计卡 + 图表 + 订单表 | 五列统计 / 订单列表 | 已实现 | 可改订单状态 |
| 来源质量 | 证据边界 | 中层级 | 三栏说明 + 列表 | 金色小标签 | 已实现 | C/M 通道不作主证据 |
| 质量闸门 | 发布前风险 | 中层级 | checklist | 56px 行高 | 已实现 | 标明独立质检未完成 |
| 会员运营 | 承接会员模块 | 中高层级 | 状态摘要 + 四步链路 + 状态表 | 4 列卡片 / 只读链接 | 已实现 | 邀请码、注册、账户、订阅确认可见 |
| 移动基础 | 不崩坏 | 单列降级 | 响应式 grid | 32px 边距 | 已观察 | 无严重横向溢出 |

## 6. Copy 规范表与实现对照

| 页面位置 | 原文 / 草案 | V2 表达 | 禁用表达 | 理由 |
|---|---|---|---|---|
| 页面主标题 | 管理后台 | 把今日生产状态压缩成判断 | 后台 | 更像内部判断系统，不像旧 CMS |
| 首屏判断 | 运营状态检查中 | 今日要看的不是数量，而是哪几条信息已经能支撑商业判断。 | 项目统计 | 指向商业判断，不只看数据 |
| 状态卡 | 同步最新数据 | 可进入今日复核 | 同步 | 不触发真实自动化 |
| 内容区 | 内容管理 | 内容运营台 | 编辑、字段 | 本任务只读，不做写入 |
| 来源区 | 证据链 | 来源与证据质量 | 强证据、证据链 | 符合 V2 来源表达 |
| 访问区 | 用户与权限 | 会员与访问状态预览 | 权限写入 | 只做展示说明 |
| 会员运营区 | 邀请码 / 注册管理 | 会员、注册与邀请码 | 真实邀请码池、用户库、支付订单 | 承接已完成页面，但不越界写入 |
| 发布区 | 部署 / 同步 | 发布准备 | 一键部署、同步 | 不越界到部署或自动化 |

## 7. 桌面截图与 QA 结果

- 桌面截图：`agent-workflow/reports/WSD-20260511-04-admin-desktop-1440.png`
- 会员运营补充截图：`agent-workflow/reports/WSD-20260511-04-admin-member-ops-1440.png`
- 邀请码生成截图：`agent-workflow/reports/WSD-20260511-04-admin-invite-generator-1440.png`
- 内容编辑截图：`agent-workflow/reports/WSD-20260511-04-admin-content-editor-1440.png`
- 项目统计 Dashboard 截图：`agent-workflow/reports/WSD-20260511-04-admin-dashboard-1440.png`
- 用户权限管理截图：`agent-workflow/reports/WSD-20260511-04-admin-users-1440.png`
- 订单管理截图：`agent-workflow/reports/WSD-20260511-04-admin-orders-1440.png`
- 单条内容独立编辑页截图：`agent-workflow/reports/WSD-20260511-04-admin-standalone-editor-1440.png`
- 本地页面：`http://127.0.0.1:4173/admin.html`
- 桌面视口：1440x1000
- 浏览器 QA：
  - 页面标题：`内部管理台｜观澜AI`
  - 控制台错误：0
  - 失败资源：0
  - 横向溢出：false
  - 分区切换：内容运营、来源质量、质量闸门可见性检查通过
- 会员运营补充 QA：
  - 分区标题：`会员、注册与邀请码`
  - 链路入口：`invite-request.html` / `register.html` / `account.html` / `checkout.html`
  - 控制台错误：0
  - 失败资源：0
  - 横向溢出：false
- 邀请码生成补充 QA：
  - 生成 3 个本机邀请码成功
  - 暂停 / 恢复状态切换成功
  - 控制台错误：0
- 内容编辑补充 QA：
  - 单条内容标题、摘要、状态、备注保存为本机草稿成功
  - 列表显示 `本机草稿`
  - 控制台错误：0
  - 横向溢出：false
- 最终模块补充 QA：
  - 项目统计：6 个 KPI、4 个图表模块，控制台错误 0
  - 内容管理：进入列表后点击单条内容，只显示独立编辑页；模块为基础信息、摘要 / 判断、正文模块、来源 / 关系 / 标签
  - 用户与权限：4 个统计卡、5 条用户列表，角色修改保存成功
  - 订阅与订单：5 个统计卡、6 条订单列表，订单状态修改保存成功
  - 所有检查均无横向溢出
- 移动非阻塞观察：
  - 390px 宽度横向溢出：false
  - 未做移动端专项截图与精修，按派发单暂缓。

## 8. 公开前台 / Admin 边界检查

- `admin.html` 未加入 `navItems`，公开导航仍为首页 / 今日要点 / 关键信号 / 机会解码 / 商业内参。
- 未修改公开页面 HTML 导航。
- 检索公开关键页面和 `app.js` 时，仅发现代码内部 `JSON.parse` 与“编辑部判断”等非导航/非后台痕迹；未发现公开导航新增 Admin / 管理 / 后台 / 同步 / JSON / 编辑入口。

## 9. 已运行质量检查

| 检查 | 结果 | 说明 |
|---|---|---|
| `node --check 01-SiteV2/site/assets/app.js` | passed | 直接运行无报错输出 |
| `node agent-workflow/tools/run-quality-gates.mjs syntax` | passed | 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-11-20260511-060621.md` |
| 桌面浏览器截图 QA | passed | 见截图与 QA 结果 |
| 会员运营模块浏览器 QA | passed | 见 `WSD-20260511-04-admin-member-ops-1440.png` |
| 补充后 `node agent-workflow/tools/run-quality-gates.mjs syntax` | passed | 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-11-20260511-061725.md` |
| 邀请码生成浏览器 QA | passed | 见 `WSD-20260511-04-admin-invite-generator-1440.png` |
| 内容编辑浏览器 QA | passed | 见 `WSD-20260511-04-admin-content-editor-1440.png` |
| 内容编辑后 `node agent-workflow/tools/run-quality-gates.mjs syntax` | passed | 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-11-20260511-062750.md` |
| Dashboard / 用户 / 订单最终补充 `node --check 01-SiteV2/site/assets/app.js` | passed | 直接运行无报错输出 |
| Dashboard / 用户 / 订单最终补充 syntax gate | passed | 报告：`agent-workflow/reports/quality-gates-syntax-2026-05-11-20260511-072543.md` |
| 移动基础横向溢出观察 | passed / non-blocking | 390px 无严重横向溢出 |

说明：syntax gate 报告中子进程检查项显示 `spawn blocked (EPERM)` 后按脚本策略标记 passed；已额外直接运行 `node --check 01-SiteV2/site/assets/app.js` 补充验证。

## 10. 未做事项与风险

- 未做真实后端认证、支付、会员权限、订单、邀请码或数据库写入。
- 未做 Netlify / GitHub 部署。
- 未修改每日自动化本体、内容 schema 或 `01-SiteV2/content/` 数据结构。
- 未修改 `09-ai-news-radar/` 和 `10-Archive/` 原文件。
- 本执行窗口不做最终 accepted；仍需调度窗口另派独立页面与文案质检。

## 11. 进入独立质检状态

结论：ready_for_independent_page_copy_quality_review

建议独立 QA / Acceptance 窗口读取：

- `agent-workflow/governance/page-copy-quality-review-skill.md`
- `agent-workflow/execution/TASK-page-copy-quality-review-template.md`
