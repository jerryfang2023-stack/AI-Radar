import base64
import json

import pytest
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

from payment_service.wechatpay import WeChatPayClient, WeChatPayError


def configured_client(tmp_path):
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    private_path = tmp_path / "merchant_private.pem"
    public_path = tmp_path / "wechatpay_public.pem"
    private_path.write_bytes(private_key.private_bytes(
        serialization.Encoding.PEM,
        serialization.PrivateFormat.PKCS8,
        serialization.NoEncryption(),
    ))
    public_path.write_bytes(private_key.public_key().public_bytes(
        serialization.Encoding.PEM,
        serialization.PublicFormat.SubjectPublicKeyInfo,
    ))
    api_v3_key = "0123456789abcdef0123456789abcdef"
    client = WeChatPayClient({
        "WECHAT_APP_ID": "wx34133741173154d4",
        "WECHAT_APP_SECRET": "test-secret",
        "WECHAT_PAY_MCH_ID": "1116466183",
        "WECHAT_PAY_MERCHANT_SERIAL": "MERCHANT_SERIAL",
        "WECHAT_PAY_PRIVATE_KEY_PATH": str(private_path),
        "WECHAT_PAY_PUBLIC_KEY_ID": "PUB_KEY_ID_TEST",
        "WECHAT_PAY_PUBLIC_KEY_PATH": str(public_path),
        "WECHAT_PAY_API_V3_KEY": api_v3_key,
        "WECHAT_PAY_NOTIFY_URL": "https://www.zkdlj.vip/api/v1/pay/wechat/notify",
    })
    return client, private_key, api_v3_key


def signed_headers(private_key, body, *, serial="PUB_KEY_ID_TEST"):
    timestamp = "1700000000"
    nonce = "callback-nonce"
    message = f"{timestamp}\n{nonce}\n{body.decode('utf-8')}\n".encode("utf-8")
    signature = private_key.sign(message, padding.PKCS1v15(), hashes.SHA256())
    return {
        "Wechatpay-Timestamp": timestamp,
        "Wechatpay-Nonce": nonce,
        "Wechatpay-Signature": base64.b64encode(signature).decode("ascii"),
        "Wechatpay-Serial": serial,
    }


def test_notification_signature_and_aes_gcm_are_both_verified(tmp_path):
    client, private_key, api_v3_key = configured_client(tmp_path)
    transaction = {"out_trade_no": "GL001", "trade_state": "SUCCESS", "amount": {"total": 3000}}
    nonce = "123456789012"
    associated_data = "transaction"
    ciphertext = AESGCM(api_v3_key.encode("utf-8")).encrypt(
        nonce.encode("utf-8"),
        json.dumps(transaction).encode("utf-8"),
        associated_data.encode("utf-8"),
    )
    body = json.dumps({
        "id": "notice-1",
        "event_type": "TRANSACTION.SUCCESS",
        "resource": {
            "algorithm": "AEAD_AES_256_GCM",
            "nonce": nonce,
            "associated_data": associated_data,
            "ciphertext": base64.b64encode(ciphertext).decode("ascii"),
        },
    }, separators=(",", ":")).encode("utf-8")
    notification, decrypted = client.parse_notification(signed_headers(private_key, body), body)
    assert notification["id"] == "notice-1"
    assert decrypted == transaction


def test_notification_rejects_unknown_wechat_public_key(tmp_path):
    client, private_key, _ = configured_client(tmp_path)
    body = b'{"id":"notice-1"}'
    with pytest.raises(WeChatPayError) as caught:
        client.verify_signature("1700000000", "callback-nonce", body, signed_headers(private_key, body)["Wechatpay-Signature"], "PUB_KEY_ID_OTHER")
    assert caught.value.code == "WECHAT_PAY_SERIAL_MISMATCH"

