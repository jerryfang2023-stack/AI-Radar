# WaveSight AI Website

观澜AI｜WaveSight AI 的本地静态网站原型。当前产品定位是面向商业决策者的 AI 机会判断系统：从每日 AI 热点中筛出商业信号，再通过 Priority Engine、趋势和机会卡，形成可追踪的判断依据。

本地入口：

```text
04-Site/index.html
```

## 页面结构

当前前台栏目已收敛为：

- `index.html`：公开首页，展示品牌定位、核心价值和精选内容
- `daily.html`：Daily Brief 列表页
- `daily-detail.html`：单篇 Daily Brief 详情页
- `signals.html`：Signals 商业信号栏目页
- `trends.html`：Trends 趋势栏目页
- `trend.html`：单个趋势详情页
- `opportunities.html`：Opportunities 机会栏目页，承接 Priority Engine 的前台展示
- `opportunity.html`：单张机会卡详情页

商业化与权限相关页面：

- `register.html`：注册占位页
- `login.html`：登录占位页
- `account.html`：账户占位页
- `pricing.html`：订阅方案占位页
- `checkout.html`：购买流程占位页
- `admin.html`：本地 Admin 管理页
- `apply.html`：旧申请入口，当前已降级为停用提示页

说明：`Scoring` 已被定义为后台 Priority Engine，不再作为普通用户的一线栏目。旧的 `scoring.html` 如仍存在，应视为历史页面或内部检查入口，不应出现在普通前台导航中。

## 每日更新流程

1. 将新的 AI 商业雷达 Markdown 放入 `01-Signals`，例如 `2026-05-03-AI商业雷达.md`
2. 将新的评分 Markdown 放入 `02-Scoring`，例如 `2026-05-03-AI机会评分.md`
3. 更新 `03-Trends/AI趋势总表.md`
4. 将新增 AI 创业机会卡放入 `07-Opportunities`
5. 在 `01-WaveSight` 根目录运行：

```bash
node 04-Site/scripts/sync-data.mjs
```

脚本会更新：

- `04-Site/data/radar-data.js`：网页直接读取的数据
- `04-Site/data/radar-data.json`：便于检查或后续接入服务的数据

同步脚本的数据源路径由 `04-Site/config/content-paths.json` 管理。云端部署或目录调整时，优先改配置文件，不直接改脚本。

## 同步规则

- `01-Signals` 下所有非 `_` 开头的 `.md` 文件都会被解析进 Signals 和 Daily Brief 相关数据。
- `02-Scoring` 下所有非 `_` 开头的 `.md` 文件都会被解析为 Priority Rows，作为机会排序和证据来源，不作为普通前台独立栏目。
- `03-Trends/AI趋势总表.md` 是 Trends 的主数据源；更新这个总表后会同步到趋势列表和趋势详情。
- `07-Opportunities` 下所有非 `_` 开头的 `.md` 机会卡都会同步到 Opportunities。

同步后可运行关系检查：

```bash
node 04-Site/scripts/check-relations.mjs
```

当前目标是保持关系检查硬错误为 0，并持续减少软提醒。

## 内容质量约束

- Daily Brief 不应替用户输出最终经营、投资或合作判断。
- Signal 标题应保持“事件 + 商业含义”，不要退回公司名堆叠。
- Opportunity 标题不应直接使用公司名；公司可作为案例或证据出现。
- 自动化生成的 Daily Radar 需要检查是否包含 6 点机会拆解。
- 前台文案不要使用内部流程语言，例如 Markdown、同步脚本、JSON、自动沉淀等。

## 当前原型边界

当前站点仍是静态网站原型，适合本地演示、栏目验证和内容结构验收。

- 会员、试读、订阅、支付和审批状态主要保存在浏览器 `localStorage`。
- Admin 与普通前台已做初步分离，但仍需要用多种身份继续验收权限边界。
- 网页中的部分新增、编辑、删除能力偏本地演示性质，刷新和跨设备一致性需要继续验证。
- 正式面向客户前，需要接入后端账号系统、数据库、真实支付、权限控制、备份和回滚流程。

## 关键文件

- `04-Site/config/content-paths.json`：内容源路径配置
- `04-Site/scripts/sync-data.mjs`：内容同步脚本
- `04-Site/scripts/check-relations.mjs`：关系检查脚本
- `04-Site/scripts/admin-server.mjs`：本地 Admin 辅助服务
- `04-Site/data/radar-data.js`：前台读取数据
- `04-Site/data/radar-data.json`：结构化检查数据
