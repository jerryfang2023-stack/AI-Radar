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
