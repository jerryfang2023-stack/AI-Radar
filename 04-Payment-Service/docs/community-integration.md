# 小程序与社群会员集成

## 数据流

1. 小程序登录后，支付服务按 `openid` 建立账号；微信返回 `unionid` 时优先复用已有账号。
2. 用户在“我的”授权手机号，支付服务调用微信接口换取真实手机号。
3. 支付服务使用内部令牌查询现有会员库。命中后保存 `community_member_id`、社群状态及社群积分；未命中时保留手机号，用户可继续提交原生申请。
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

- `users.phone`：微信授权后取得的手机号，唯一索引。
- `users.community_member_id`：现有会员库主键。
- `users.community_status`：`none`、`pending`、`candidate`、`rejected` 或 `approved`。
- `users.community_points`：远端社群积分最新快照。
- `users.point_balance`：可兑换积分。
- `users.point_lifetime`：累计成长积分，不因兑换减少。
- `point_ledger`：社群积分快照和兑换流水；`source_id` 保证幂等。

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
