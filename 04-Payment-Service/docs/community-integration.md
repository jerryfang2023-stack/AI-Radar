# 小程序与社群会员集成

## 数据流

1. 小程序登录后，支付服务按 `openid` 建立账号；微信返回 `unionid` 时优先复用已有账号。
2. 用户在“我的”授权手机号，支付服务调用微信接口换取真实手机号。
3. 支付服务使用内部令牌查询现有会员库。命中后保存 `community_member_id`、社群状态及社群积分；未命中时保留已核验手机号的 HMAC 和脱敏显示，用户可继续提交原生申请。手填号码必须与已授权号码摘要一致，不能凭号码认领他人身份。
4. 每次读取 `/api/v1/member/me` 时刷新社群状态和积分。积分按远端累计值与上次快照的差额更新，避免重复导入。
5. 原生申请通过现有会员服务写入同一 `members` 表，后台继续使用原审核与管理流程。

## 小程序接口

| 方法 | 路由 | 用途 |
|---|---|---|
| POST | `/api/v1/auth/wechat` | 微信登录与账号复用 |
| GET | `/api/v1/member/me` | 会员权益、统一积分、社群状态 |
| POST | `/api/v1/community/link-phone` | 服务端换取手机号并匹配现有会员 |
| POST | `/api/v1/community/applications` | 提交原生社群申请 |
| POST | `/api/v1/points/redeem` | 300 分兑 7 天或 1000 分兑 30 天 |

以上业务接口除登录外均要求 `Authorization: Bearer <token>`。

## 数据模型

- `users.phone_hash` / `users.phone_masked`：已核验手机号的 HMAC 与脱敏显示，不保存原始号码。
- `users.community_member_id`：现有会员库主键。
- `users.community_status`：`none`、`pending`、`candidate`、`rejected` 或 `approved`。
- `users.community_points`：远端社群积分最新快照。
- `users.point_balance`：可兑换积分。
- `users.point_lifetime`：累计成长积分，不因兑换减少。
- `point_ledger`：社群积分快照和兑换流水；`source_id` 保证幂等。

## 原生社群 0.9.1–0.9.3

`GET /api/v1/community/home` 仅返回实录、已审核悬赏和已同意公开成员的摘要，可匿名读取。以下 `/api/v1/community/` 路由要求账号令牌；网关仅使用服务端绑定的 `community_member_id`，会员服务每次重新核验已审核且正式入群状态：

| 路由 | 方法 | 内容 |
|---|---|---|
| `program`、`archives/<issue-slug>` | GET | 真实排期及受保护的完整实录 |
| `directory`、`profile` | GET | 公开资料及独立分享证据档案，排除联系方式 |
| `profile` | PUT | 白名单字段及 revision；版本冲突返回 409 |
| `points` | GET | 按会员 ID 合并社群分和正常累计活跃分，扣除已导入社群分及 `admin_grant` 管理权限授分；明细也排除管理授分，不改动钱包或权限 |
| `drafts/<key>` | GET / PUT | 本人跨设备悬赏草稿 |
| `cases`、`cases/<id>` | GET | 已审核悬赏及本人待审内容 |
| `cases` | POST | 幂等提交，进入原会员后台审核 |
| `cases/<id>/answer`、`join`、`settle` | POST | 回答审核、幂等报名及发起人原子结算 |

详情与档案响应禁止缓存；400/403/404/409/429 保留服务端错误，远端不可用返回 502，不回退示例数据。管理员审核不经公开网关代理。新增表在既有会员服务中，支付服务仍只维护账号绑定和原钱包。

先发布会员服务 1.7.0，再发布本服务，最后上传小程序；旧客户端接口保持兼容。代码回滚保留增量表，不覆盖包含新用户活动的数据库。

0.9.2 客户端公开首页采用最多五分钟的本地摘要，常用受限列表仅在当前身份内存中短暂复用（30 秒新鲜，最多 60 秒旧数据重验窗口）。每次真实受限请求仍由服务端核验资格；完整实录、个人档案和草稿不持久缓存。写操作及身份失效清理列表缓存。账户网关初始化 WAL 时对 BUSY/LOCKED 有界重试，不重放业务事务。

2026-08-30 社群配套部署：网关提交 `e52824573ce2bd0473e28a4e68593bc497eb654c`、成员提交 `2232ac84914d2826ed13eee404c485248810fb7d`。后续 0.9.3 客户端与融资站正文修复不改变此社群契约；截至 2026-08-31 微信 0.9.3 已上传，审核及正式发布由负责人操作。见 [0.9.1–0.9.3 合并审核说明](../../02-Miniprogram/docs/REVIEW-0.9.3-COMBINED.md)。

## 配置与运维

```text
COMMUNITY_SERVICE_URL=http://127.0.0.1:8000
COMMUNITY_SERVICE_TOKEN=<与会员服务一致的随机令牌>
```

部署顺序为会员服务、支付服务、小程序开发版。冒烟检查：

```bash
curl -fsS http://127.0.0.1:8000/healthz
curl -fsS http://127.0.0.1:8010/api/v1/health
```

内部会员接口还应使用共享令牌执行一次不存在手机号的查询，预期 HTTP 200 且 `found=false`；不要在终端或日志中打印令牌。
