# Release Plan

## R0：本地基线版

内容：

- 当前网站可本地访问。
- agent-workflow 建立。
- 健康检查可运行。
- 项目目录和同步路径完成初步整理。

验收：

- 运行健康检查能看到 signals、scores、trends、opportunities 数量。
- 普通端和 admin 基本可区分。

## R1：数据规范版

内容：

- frontmatter、slug、ID、tags、status 统一。
- 机会卡去公司名。
- 标签体系字典建立。
- schema-check 初版。

验收：

- 内容源可稳定同步到网站 JSON。
- 无重复 opportunity_id。
- 无高危空字段。

## R2：决策闭环版

内容：

- Scoring 后台化为 Priority Engine。
- Priority Engine 合并进入 Opportunities。
- Signals 标题从公司名升级为事件和商业含义。
- Tags 成为搜索和关系网络能力。

验收：

- 用户可以从首页进入 Daily Brief，再进入 Signal、Opportunity 和 Trend。
- 任意机会能追溯到证据。

## R3：产品演示版

内容：

- 首页更克制、更有品牌感。
- 注册、登录、7 天试读和会员权限路径清楚。
- 管理端隐藏并可用于内容维护。
- 关键页面有独立 URL。

验收：

- 可给小范围真实用户演示。
- 普通用户不会看到后台痕迹。

## R4：云端预发布版

内容：

- 云端部署脚本。
- 权限方案。
- 备份与回滚方案。
- 发布检查。

验收：

- 云端可访问。
- 每日自动更新闭环可跑。
- 异常可追踪、可回滚。

## R5：正式运营版

内容：

- 每日自动更新。
- 周度 PM Review。
- 月度机会复盘。
- 会员权限、企业版/私享内参申请和客户审批。

验收：

- 可长期对外运营。
- 有持续内容质量、产品质量和商业转化监测。
