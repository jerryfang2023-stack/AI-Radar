# 观澜小程序支付服务

该服务管理小程序用户身份、统一积分、社群会员关联、微信支付订单和内容会员有效期。商户号为 `1116466183`，小程序 AppID 为 `wx34133741173154d4`。

## 上线前的安全配置

1. 在微信支付商户平台确认商户号已绑定小程序 AppID。
2. 设置 32 字节 APIv3 密钥。
3. 申请并下载商户 API 证书，只将 `apiclient_key.pem` 放到服务器 `shared/secrets/`。
4. 下载微信支付公钥，并记录 `PUB_KEY_ID_...`。
5. 从 `.env.example` 创建服务器端 `.env`。密钥、AppSecret 和证书不得写入 Git。
6. 将 `https://www.zkdlj.vip` 加入小程序“request 合法域名”。
7. 配置 `COMMUNITY_SERVICE_URL` 与 `COMMUNITY_SERVICE_TOKEN`，令牌需与现有会员服务的 `MINIPROGRAM_API_TOKEN` 一致。

支付回调地址固定为：

```text
https://www.zkdlj.vip/api/v1/pay/wechat/notify
```

## 本地验证

```text
python -m venv .venv
.venv/Scripts/pip install -r requirements-dev.txt
.venv/Scripts/python -m pytest -q
```

测试使用假微信网关，不会发起真实扣款。

## 社群集成

详细的数据流、接口和运维冒烟命令见 [社群集成说明](docs/community-integration.md)。核心原则：手机号必须由微信 `getPhoneNumber` 服务端换取后才能匹配；社群历史积分全量进入可用积分和累计成长积分；兑换只减少可用积分。

## 邀请注册

- `GET /api/v1/invites/me`：返回当前用户的邀请码、邀请页独立访问人数、注册成功人数和累计奖励积分。
- `POST /api/v1/invites/visit`：按邀请码与设备访客标识去重记录邀请页访问。
- `POST /api/v1/auth/wechat`：首次注册时可携带 `inviteCode`；邀请关系只确认一次，并向邀请人记入 300 活跃积分。

## 手机号绑定

- `POST /api/v1/member/phone`：登录用户提交微信 `getPhoneNumber` 返回的一次性 `code`，服务端向微信换取手机号并完成账号绑定。
- 接口只向小程序返回脱敏号码，例如 `138****8000`；数据库仅保存脱敏号码和基于服务端密钥生成的 HMAC 摘要，不保存原始手机号或授权码。
- 同一手机号只能绑定一个小程序账号。

## 成长任务积分

- `POST /api/v1/member/behaviors`：按用户、北京时间日期、任务类型和内容标识幂等记录签到、阅读与收藏；允许补传当天及前一天的待同步事件。
- 达标奖励直接进入服务端统一钱包，同时增加可用积分与累计成长积分；客户端刷新不会丢失。
- 社群积分回调时可用积分按差额调整，累计成长积分只增不减。
