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

## V0.6 虚拟支付

- 小程序使用 `wx.requestVirtualPayment` 的道具直购模式，不再使用普通 JSAPI 支付。
- 固定商品为 `membership_30d`、`membership_180d`、`membership_365d`，价格和权益时长均由服务端校验。
- 下单接口：`POST /api/v1/pay/virtual/orders`。客户端需同时提交新获取的 `wx.login` code，服务端只用对应 `session_key` 生成当次用户态签名，不保存该会话密钥。
- 消息推送地址：`https://www.zkdlj.vip/api/v1/pay/virtual/notify`。订阅 `xpay_goods_deliver_notify`、`xpay_refund_notify` 和 `xpay_subscribe_ios_refund_query_notify`；iOS 退款问询按 15 天全额退款政策返回建议结果。
- 客户端支付成功不直接发放权益；仅在验签消息或主动查询微信订单确认后发放。
- 退款接口：`POST /api/v1/pay/orders/<orderNo>/refund`。当前仅支持购买后 15 天内按原订单全额退款，退款确认后回收该订单对应的会员时长。
- 沙箱联调使用 `WECHAT_VIRTUAL_ENV=1`；正式发布前切换为 `0`，两套 AppKey 必须分开配置。

商品配置可在 VPS 安全环境中重复执行：

```text
python scripts/provision_virtual_products.py --env 1
python scripts/provision_virtual_products.py --env 0
```

## 社群集成

详细的数据流、接口和运维冒烟命令见 [社群集成说明](docs/community-integration.md)。核心原则：手机号必须由微信 `getPhoneNumber` 服务端换取后才能自动匹配；昵称仅可创建待管理员确认的候选，不能自行获得社群权限；已审核社群成员首次绑定后同步社群权限并获得一次性 90 天小程序使用期；社群历史积分全量进入可用积分和累计成长积分；兑换只减少可用积分。

## 邀请注册

- `GET /api/v1/invites/me`：返回当前用户的邀请码、邀请页独立访问人数、注册成功人数和累计奖励积分。
- `POST /api/v1/invites/visit`：按邀请码与设备访客标识去重记录邀请页访问。
- `POST /api/v1/auth/wechat`：首次注册时可携带 `inviteCode`；邀请关系只确认一次，并向邀请人记入 300 活跃积分。

## 手机号绑定

- `POST /api/v1/member/phone`：登录用户提交微信 `getPhoneNumber` 返回的一次性 `code`，服务端向微信换取手机号并完成账号绑定。
- 接口只向小程序返回脱敏号码，例如 `138****8000`；数据库仅保存脱敏号码和基于服务端密钥生成的 HMAC 摘要，不保存原始手机号或授权码。
- 同一手机号只能绑定一个小程序账号。

## PC 统一账户与受保护内容

- PC 会话使用随机凭据，数据库只保存 HMAC；Cookie 为 `HttpOnly`、`Secure`、`SameSite=Lax`，写操作同时校验 CSRF。
- PC 端仅使用邮箱验证码或小程序扫码登录；手机号只保留为小程序核验和老会员关联身份，不提供 PC 注册、登录或绑定入口。邮箱验证码优先通过腾讯云 SES 模板发送，模板变量名由 `TENCENT_SES_TEMPLATE_CODE_KEY` 配置；旧 `VERIFICATION_WEBHOOK_URL` 仅作为兼容回退。所有密钥只放服务器 `.env`。未配置时生产环境明确返回“验证码通道未配置”，不会在响应中泄露验证码。
- PC 微信登录使用小程序码：PC 创建短时票据，小程序 `pages/account-qr/index` 确认后由 PC 轮询完成登录或绑定。
- 邮箱、微信身份发生冲突时不自动合并；用户必须同时证明当前账户和目标身份，确认后才合并会员、积分和订单，并保留审计记录。
- `CONTENT_ROOT` 指向站点发布脚本原子更新的受保护内容目录。融资、主体、赛道和报告正文只通过 `/api/v1/content/...` 按统一权益返回，响应禁止缓存。
- 游客按服务端访客凭据计量：允许完整阅读 1 个不同详情，同一详情可重复打开；第 2 个不同详情返回注册提示。无效登录令牌不能降级为游客额度。
- PC 会员通过 `/api/v1/pay/native/orders` 使用微信 Native 扫码支付；订单价格由服务端固定并带幂等标识，购买后 15 天内支持原订单全额退款。

## 成长任务积分

- `POST /api/v1/member/behaviors`：按用户、北京时间日期、任务类型和内容标识幂等记录签到、阅读与收藏；允许补传当天及前一天的待同步事件。
- 达标奖励直接进入服务端统一钱包，同时增加可用积分与累计成长积分；客户端刷新不会丢失。
- 社群积分回调时可用积分按差额调整，累计成长积分只增不减。

## 应用运营统计

- `POST /api/v1/analytics/events`：接收小程序与 PC 端的匿名访问事件，单批最多 20 条；事件按 `eventId` 幂等写入。
- `GET /api/v1/admin/analytics/summary?days=7&platform=all`：返回访问、页面、内容、注册、付费、退款和漏斗聚合；需要 `Authorization: Bearer <ANALYTICS_ADMIN_TOKEN>`。
- `GET /api/v1/analytics/summary?days=7&platform=all`：保留为仅供环回代理调用的兼容汇总；公网 Nginx 对旧 URL 返回 404，运营后台通过经过统一会话检查的 `/ops/analytics-api/summary` 读取。不返回原始事件、访客/会话 ID、用户身份或订单明细；页面路径剥离查询参数及片段。
- 注册漏斗分别统计打开注册引导、提交手机号授权、服务端注册成功及失败原因；普通登录与静默鉴权不进入注册漏斗。
- 注册成功、支付、退款、积分兑换和社群申请均由服务端记录，运营口径不依赖客户端成功提示。
- `ANALYTICS_LIVE_FROM` 定义正式运营统计起点（ISO 8601）；起点前的访问事件、注册和订单不进入运营汇总，离线队列中的旧测试事件也不会重新写入。
- 原管理员查询仍使用生产环境随机 `ANALYTICS_ADMIN_TOKEN`；令牌不得写入仓库或前端。VPS 运营后台不需要、不存储、不发送该令牌。
- 默认允许 `https://www.zkdlj.vip` 与 WaveSight GitHub Pages 读取；若内部站点域名变化，通过 `ANALYTICS_ALLOWED_ORIGINS` 调整。

## 会员与权益运营

`GET /api/v1/analytics/membership/summary?days=30` 保留为环回兼容汇总，公网旧 URL 返回 404；后台通过会话保护的 `/ops/application-membership-summary` 读取，契约为 `MEMBER-OPS-V1.0`。统一运营后台发布在 VPS 的 `/ops/` 路径；管理员通过邮箱验证码登录一次，服务端设置限定 `/ops` 的 HttpOnly 会话 Cookie，Nginx 在返回后台 HTML、脚本、快照和应用汇总前调用会话检查。小程序用户明细使用 `GET /api/v1/admin/analytics/membership/users`，权益或积分调整使用 `POST /api/v1/admin/analytics/membership/users/<id>/adjustments`，契约为 `MEMBER-ADMIN-V1.0`，并复用整个后台会话。允许邮箱仅配置在服务器 `OPERATIONS_ADMIN_EMAILS`，不写入仓库或前端。

验证码 10 分钟有效、最多尝试 5 次且同一邮箱 10 分钟最多发送 3 次；浏览器会话默认 8 小时。会话 Cookie 为 Secure、HttpOnly、SameSite=Strict，CSRF Cookie 与服务端 HMAC 双重校验；数据库不保存邮箱原文、验证码、会话或 CSRF 原文。

列表仅包含具备微信身份且未合并的小程序账户，只返回昵称、脱敏手机号、权益、积分、非退款付费汇总和最近活跃，不返回 OpenID、身份摘要或订单明细。写操作只允许按 7/30/90/180/365 天延长权益，或在余额不低于零的前提下调整可用积分；每次必须填写原因，并同时写入业务流水与 `operations_admin_audits`。不支持删除账号、修改/合并身份、改订单、任意覆盖到期日或改累计成长积分。
