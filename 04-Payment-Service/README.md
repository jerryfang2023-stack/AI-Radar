# 观澜小程序支付服务

该服务独立管理小程序用户身份、微信支付订单和付费会员有效期。商户号为 `1116466183`，小程序 AppID 为 `wx34133741173154d4`。

## 上线前的安全配置

1. 在微信支付商户平台确认商户号已绑定小程序 AppID。
2. 设置 32 字节 APIv3 密钥。
3. 申请并下载商户 API 证书，只将 `apiclient_key.pem` 放到服务器 `shared/secrets/`。
4. 下载微信支付公钥，并记录 `PUB_KEY_ID_...`。
5. 从 `.env.example` 创建服务器端 `.env`。密钥、AppSecret 和证书不得写入 Git。
6. 将 `https://www.zkdlj.vip` 加入小程序“request 合法域名”。

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

## 邀请注册

- `GET /api/v1/invites/me`：返回当前用户的邀请码、邀请页独立访问人数、注册成功人数和累计奖励积分。
- `POST /api/v1/invites/visit`：按邀请码与设备访客标识去重记录邀请页访问。
- `POST /api/v1/auth/wechat`：首次注册时可携带 `inviteCode`；邀请关系只确认一次，并向邀请人记入 300 活跃积分。
