---
status: current
scope: mini-program-and-pc-operations-analytics
last_updated: 2026-08-30
---

# 应用运营统计 V1.3

## 生产启用记录

- 正式统计起点：`2026-08-17T15:12:20Z`。
- 启用时已备份生产数据库和环境配置，清除 1,871 条上线前联调、自动化体验和冒烟访问事件。
- 清理不修改正式会员和订单表；当时保留 25 个会员记录和 32 条订单记录。
- 生产服务已验证只返回 `production` 数据源；起点前的离线队列事件会被拒绝且不写入数据库。

## 目标与边界

应用运营统计位于 `https://www.zkdlj.vip/ops/#analytics` 的“运营统计”栏目，不再占用数据中心“应用中心”导航。`application-analytics.html` 仅保留迁移跳转。整个运营后台先通过管理员邮箱验证码登录，再展示小程序与 PC 融资站的聚合运营事实。

- 不采集明文手机号、微信号、OpenID、UnionID、IP 地址或完整 User-Agent。
- 访客、会话和事件使用随机匿名 ID；登录用户只在服务端关联内部 user_id。
- 付费收入、退款和注册数以服务端数据库为准，不能用客户端成功提示代替。
- 页面事件最多补传 7 天；单次最多 20 条，客户端离线队列最多 100 条。
- `ANALYTICS_LIVE_FROM` 是正式运营统计起点；起点前的联调访问、注册与订单不进入汇总，旧离线队列也不能在清理后回灌。
- 后台只显示服务端返回的 `production` 数据源，并明确展示正式统计开始时间，不提供演示数据回退。
- 自 OPS V3.4 起，公网旧 `/api/v1/analytics/summary` 由 Nginx 返回 404；后台通过统一会话保护的 `/ops/analytics-api/summary` 读取访问、注册、付费、热门页面和内容聚合。兼容路由仅供 VPS 环回代理调用，且不返回原始事件、访客/会话 ID、个人身份或订单明细。页面 URL 聚合剥离查询参数及片段。
- 原 `/api/v1/admin/analytics/summary` 仍要求服务端 `ANALYTICS_ADMIN_TOKEN`；VPS 页面不读取或保存该令牌。后台 HTML、脚本、快照及应用聚合均由服务端会话门禁保护，不依赖隐藏入口或 CORS。
- 切入栏目自动加载；支持今日/7/30/90 天、平台筛选、刷新、空状态与超时重试，快速切换筛选时忽略旧请求。

## 核心指标口径

| 指标 | 口径 | 运营用途 |
|---|---|---|
| 访客数 | 周期内匿名 visitor_id 去重 | 判断触达规模 |
| 会话数 | 周期内 session_id 去重，30 分钟无操作切分 | 判断使用频次 |
| 页面浏览 | page_view 事件数 | 判断栏目消费 |
| 新注册 | users.created_at | 判断注册增长 |
| 注册转化率 | 新注册 / 访客 | 判断注册链路效率 |
| 付费订单 | 已确认支付的 payment_orders | 判断购买人数 |
| 付费转化率 | 付费订单 / 新注册 | 判断商业转化 |
| 收入 | 已支付订单金额；同时展示退款与净收入 | 判断商业结果 |
| 平均会话时长 | 同会话最晚事件 - 最早事件 | 判断使用深度 |
| 跳出率 | 仅 0–1 次 page_view 的会话 / 全部会话 | 判断落地页质量 |
| 热门页面/内容 | 浏览次数与访客数双指标 | 决定选题和入口调整 |

## Typography 页面位置表

| 位置 | 字号 / 行高 | 字体 | 字重 |
|---|---:|---|---:|
| 侧栏导航 | 复用 OPS 现有侧栏 | sans | 复用 OPS 规范 |
| 页面 H1 | 44 / 58px | serif | 600 |
| 页面说明 | 16 / 28px | sans | 400 |
| KPI 数字 | 28 / 36px | mono | 600 |
| 模块标题 | 24 / 34px | sans | 600 |
| 表格/图表正文 | 13 / 22px | sans | 400/500 |
| 英文标签/日期 | 12 / 18px | mono | 600 |

不新增表外字号，不使用 `vw`、不使用 700 以上字重。后台采用黑体标题，页面 H1 延续数据中心栏目页衬线规范。

## Copy 页面文案表

| 位置 | 文案 |
|---|---|
| 导航 | 运营统计 |
| H1 | 应用运营 |
| 说明 | 小程序与融资网站的访问、注册、内容和付费表现 |
| 数据状态 | 真实数据 · 自正式统计起点起 |
| 总览模块 | 核心表现 |
| 趋势模块 | 每日趋势 |
| 漏斗模块 | 注册漏斗 |
| 页面模块 | 热门页面 |
| 内容模块 | 热门内容 |
| 空状态 | 当前周期暂无数据，监测接入后会自动更新。 |
| 错误状态 | 运营数据暂时无法读取，请点击刷新重试。 |

## 首期事件

`app_launch`、`app_show`、`app_hide`、`page_view`、`page_leave`、`content_view`、`search_submitted`、`filter_changed`、`registration_started`、`registration_success`、`checkout_started`、`payment_order_created`、`payment_success`、`payment_refunded`、`points_redeemed`、`community_application_submitted`。
