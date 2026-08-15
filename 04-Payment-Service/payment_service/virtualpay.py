import base64
import hashlib
import hmac
import json
import secrets
import struct
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes

from payment_service.wechatpay import WeChatPayError


class VirtualPayClient:
    API_ORIGIN = "https://api.weixin.qq.com"

    def __init__(self, config, *, wechat_client):
        self.app_id = config["WECHAT_APP_ID"]
        self.app_secret = config["WECHAT_APP_SECRET"]
        self.offer_id = config["WECHAT_VIRTUAL_OFFER_ID"]
        self.env = int(config["WECHAT_VIRTUAL_ENV"])
        self.app_key = (
            config["WECHAT_VIRTUAL_SANDBOX_APP_KEY"]
            if self.env == 1
            else config["WECHAT_VIRTUAL_APP_KEY"]
        )
        self.notify_token = config["WECHAT_VIRTUAL_NOTIFY_TOKEN"]
        self.encoding_aes_key = config["WECHAT_VIRTUAL_ENCODING_AES_KEY"]
        self.wechat_client = wechat_client
        self._access_token_value = ""
        self._access_token_expires_at = 0

    def configured(self):
        return bool(self.app_id and self.app_secret and self.offer_id and self.app_key)

    def notification_configured(self):
        return bool(self.notify_token and self.encoding_aes_key)

    def _require_configured(self):
        if not self.configured():
            raise WeChatPayError("虚拟支付尚未完成配置", code="VIRTUAL_PAYMENT_NOT_CONFIGURED", status=503)

    @staticmethod
    def _compact_json(value):
        return json.dumps(value, ensure_ascii=False, separators=(",", ":"))

    @staticmethod
    def _hmac(key, message):
        return hmac.new(key.encode("utf-8"), message.encode("utf-8"), hashlib.sha256).hexdigest()

    @staticmethod
    def _json_request(url, body):
        body_text = VirtualPayClient._compact_json(body)
        request = urllib.request.Request(
            url,
            data=body_text.encode("utf-8"),
            method="POST",
            headers={"Content-Type": "application/json", "Accept": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                return json.loads(response.read() or b"{}")
        except urllib.error.HTTPError as exc:
            raw = exc.read()
            try:
                details = json.loads(raw or b"{}")
            except json.JSONDecodeError:
                details = {}
            raise WeChatPayError(
                details.get("errmsg") or details.get("message") or "微信虚拟支付接口请求失败",
                code=str(details.get("errcode") or details.get("code") or "VIRTUAL_PAYMENT_API_ERROR"),
                status=502,
            ) from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            raise WeChatPayError("微信虚拟支付接口暂时不可用", code="VIRTUAL_PAYMENT_UNAVAILABLE", status=502) from exc

    def _access_token(self):
        now = int(time.time())
        if self._access_token_value and now < self._access_token_expires_at:
            return self._access_token_value
        query = urllib.parse.urlencode(
            {
                "grant_type": "client_credential",
                "appid": self.app_id,
                "secret": self.app_secret,
            }
        )
        request = urllib.request.Request(f"{self.API_ORIGIN}/cgi-bin/token?{query}")
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                result = json.loads(response.read() or b"{}")
        except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as exc:
            raise WeChatPayError("微信访问凭证获取失败", code="WECHAT_ACCESS_TOKEN_FAILED", status=502) from exc
        token = result.get("access_token")
        if not token:
            raise WeChatPayError(
                result.get("errmsg") or "微信访问凭证获取失败",
                code="WECHAT_ACCESS_TOKEN_FAILED",
                status=502,
            )
        self._access_token_value = token
        self._access_token_expires_at = now + max(60, int(result.get("expires_in") or 7200) - 300)
        return token

    def _api_request(self, endpoint, body):
        self._require_configured()
        body = {**body, "env": self.env}
        body_text = self._compact_json(body)
        pay_sig = self._hmac(self.app_key, f"{endpoint}&{body_text}")
        query = urllib.parse.urlencode({"access_token": self._access_token(), "pay_sig": pay_sig})
        result = self._json_request(f"{self.API_ORIGIN}{endpoint}?{query}", body)
        if int(result.get("errcode") or 0) != 0:
            raise WeChatPayError(
                result.get("errmsg") or "微信虚拟支付接口请求失败",
                code=str(result.get("errcode") or "VIRTUAL_PAYMENT_API_ERROR"),
                status=502,
            )
        return result

    def create_payment(self, *, order_no, product_id, total_cents, login_code, expected_openid):
        self._require_configured()
        code_result = self.wechat_client.exchange_code(login_code)
        if code_result.get("openid") != expected_openid:
            raise WeChatPayError("支付用户与当前账号不一致", code="VIRTUAL_PAYMENT_USER_MISMATCH", status=403)
        session_key = code_result.get("session_key")
        if not session_key:
            raise WeChatPayError("微信支付会话获取失败，请重试", code="VIRTUAL_PAYMENT_SESSION_MISSING", status=502)
        sign_data = self._compact_json(
            {
                "offerId": self.offer_id,
                "buyQuantity": 1,
                "env": self.env,
                "currencyType": "CNY",
                "productId": product_id,
                "goodsPrice": total_cents,
                "outTradeNo": order_no,
                "attach": order_no,
            }
        )
        return {
            "env": self.env,
            "offerId": self.offer_id,
            "mode": "short_series_goods",
            "signData": sign_data,
            "paySig": self._hmac(self.app_key, f"requestVirtualPayment&{sign_data}"),
            "signature": self._hmac(session_key, sign_data),
        }

    def query_order(self, *, openid, order_no):
        result = self._api_request("/xpay/query_order", {"openid": openid, "order_id": order_no})
        return result.get("order") or {}

    def refund_order(self, *, openid, order_no, refund_no, left_fee, refund_fee):
        return self._api_request(
            "/xpay/refund_order",
            {
                "openid": openid,
                "order_id": order_no,
                "refund_order_id": refund_no,
                "left_fee": left_fee,
                "refund_fee": refund_fee,
                "refund_reason": "3",
                "req_from": "2",
                "biz_meta": order_no,
            },
        )

    def verify_callback_signature(self, timestamp, nonce, signature, encrypted=""):
        if not self.notify_token:
            raise WeChatPayError("虚拟支付消息推送尚未配置", code="VIRTUAL_NOTIFY_NOT_CONFIGURED", status=503)
        values = [self.notify_token, str(timestamp or ""), str(nonce or "")]
        if encrypted:
            values.append(str(encrypted))
        expected = hashlib.sha1("".join(sorted(values)).encode("utf-8")).hexdigest()
        if not hmac.compare_digest(expected, str(signature or "")):
            raise WeChatPayError("虚拟支付消息签名无效", code="INVALID_VIRTUAL_NOTIFY_SIGNATURE", status=400)

    def decrypt_callback(self, encrypted):
        if not self.encoding_aes_key:
            raise WeChatPayError("虚拟支付消息解密尚未配置", code="VIRTUAL_NOTIFY_NOT_CONFIGURED", status=503)
        try:
            key = base64.b64decode(f"{self.encoding_aes_key}=")
            ciphertext = base64.b64decode(encrypted)
            decryptor = Cipher(algorithms.AES(key), modes.CBC(key[:16])).decryptor()
            padded = decryptor.update(ciphertext) + decryptor.finalize()
            padding_size = padded[-1]
            plaintext = padded[:-padding_size]
            message_length = struct.unpack("!I", plaintext[16:20])[0]
            message = plaintext[20 : 20 + message_length]
            receiver = plaintext[20 + message_length :].decode("utf-8")
            if receiver != self.app_id:
                raise ValueError("receiver mismatch")
            return message
        except Exception as exc:
            raise WeChatPayError("虚拟支付消息解密失败", code="INVALID_VIRTUAL_NOTIFY_CIPHERTEXT", status=400) from exc

    def parse_callback(self, raw_body, query):
        body = raw_body.decode("utf-8") if isinstance(raw_body, bytes) else str(raw_body)
        stripped = body.strip()
        encrypted = ""
        if stripped.startswith("<"):
            root = ET.fromstring(stripped)
            encrypted_node = root.find("Encrypt")
            encrypted = encrypted_node.text if encrypted_node is not None else ""
        if encrypted:
            self.verify_callback_signature(
                query.get("timestamp"), query.get("nonce"), query.get("msg_signature"), encrypted
            )
            stripped = self.decrypt_callback(encrypted).decode("utf-8")
        else:
            self.verify_callback_signature(query.get("timestamp"), query.get("nonce"), query.get("signature"))
        if stripped.startswith("<"):
            root = ET.fromstring(stripped)

            def element_value(element):
                children = list(element)
                return {child.tag: element_value(child) for child in children} if children else (element.text or "")

            return {child.tag: element_value(child) for child in root}
        return json.loads(stripped)

    def generate_notification_secrets(self):
        return {
            "token": secrets.token_urlsafe(24),
            "encodingAESKey": base64.b64encode(secrets.token_bytes(32)).decode("ascii")[:-1],
        }
