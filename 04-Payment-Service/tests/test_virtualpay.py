import hashlib
import hmac
import json

import pytest

from payment_service.virtualpay import VirtualPayClient
from payment_service.wechatpay import WeChatPayError


class FakeWeChatClient:
    def exchange_code(self, code):
        return {"openid": f"openid-{code}", "session_key": f"session-{code}"}


def config():
    return {
        "WECHAT_APP_ID": "wx-test",
        "WECHAT_APP_SECRET": "secret",
        "WECHAT_VIRTUAL_OFFER_ID": "offer-test",
        "WECHAT_VIRTUAL_SANDBOX_APP_KEY": "sandbox-app-key",
        "WECHAT_VIRTUAL_APP_KEY": "production-app-key",
        "WECHAT_VIRTUAL_ENV": 1,
        "WECHAT_VIRTUAL_NOTIFY_TOKEN": "notify-token",
        "WECHAT_VIRTUAL_ENCODING_AES_KEY": "",
    }


def test_create_payment_uses_exact_virtual_payment_signatures():
    client = VirtualPayClient(config(), wechat_client=FakeWeChatClient())
    result = client.create_payment(
        order_no="GLV12345678",
        product_id="membership_30d",
        total_cents=3000,
        login_code="buyer",
        expected_openid="openid-buyer",
    )
    sign_data = json.loads(result["signData"])
    assert sign_data == {
        "offerId": "offer-test",
        "buyQuantity": 1,
        "env": 1,
        "currencyType": "CNY",
        "productId": "membership_30d",
        "goodsPrice": 3000,
        "outTradeNo": "GLV12345678",
        "attach": "GLV12345678",
    }
    expected_pay_sig = hmac.new(
        b"sandbox-app-key",
        f"requestVirtualPayment&{result['signData']}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    expected_user_sig = hmac.new(
        b"session-buyer",
        result["signData"].encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    assert result["paySig"] == expected_pay_sig
    assert result["signature"] == expected_user_sig
    assert result["mode"] == "short_series_goods"


def test_create_payment_rejects_login_code_for_different_openid():
    client = VirtualPayClient(config(), wechat_client=FakeWeChatClient())
    with pytest.raises(WeChatPayError) as error:
        client.create_payment(
            order_no="GLV12345678",
            product_id="membership_30d",
            total_cents=3000,
            login_code="other",
            expected_openid="openid-buyer",
        )
    assert error.value.code == "VIRTUAL_PAYMENT_USER_MISMATCH"


def test_plain_callback_requires_valid_wechat_signature():
    client = VirtualPayClient(config(), wechat_client=FakeWeChatClient())
    timestamp = "1700000000"
    nonce = "nonce"
    signature = hashlib.sha1("".join(sorted(["notify-token", timestamp, nonce])).encode("utf-8")).hexdigest()
    event = client.parse_callback(
        json.dumps({"Event": "xpay_goods_deliver_notify", "OutTradeNo": "GLV12345678"}).encode("utf-8"),
        {"timestamp": timestamp, "nonce": nonce, "signature": signature},
    )
    assert event["OutTradeNo"] == "GLV12345678"
