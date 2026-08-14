import base64
import json
import secrets
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.ciphers.aead import AESGCM


class WeChatPayError(RuntimeError):
    def __init__(self, message, *, code="WECHAT_PAY_ERROR", status=502):
        super().__init__(message)
        self.code = code
        self.status = status


class WeChatPayClient:
    API_ORIGIN = "https://api.mch.weixin.qq.com"

    def __init__(self, config):
        self.app_id = config["WECHAT_APP_ID"]
        self.app_secret = config["WECHAT_APP_SECRET"]
        self.mch_id = config["WECHAT_PAY_MCH_ID"]
        self.merchant_serial = config["WECHAT_PAY_MERCHANT_SERIAL"]
        self.private_key_path = config["WECHAT_PAY_PRIVATE_KEY_PATH"]
        self.public_key_id = config["WECHAT_PAY_PUBLIC_KEY_ID"]
        self.public_key_path = config["WECHAT_PAY_PUBLIC_KEY_PATH"]
        self.api_v3_key = config["WECHAT_PAY_API_V3_KEY"]
        self.notify_url = config["WECHAT_PAY_NOTIFY_URL"]

    def configured(self):
        required = [
            self.app_id, self.app_secret, self.mch_id, self.merchant_serial,
            self.private_key_path, self.public_key_id, self.public_key_path,
            self.api_v3_key, self.notify_url,
        ]
        return all(required) and Path(self.private_key_path).is_file() and Path(self.public_key_path).is_file()

    def _require_configured(self):
        if not self.configured():
            raise WeChatPayError("微信支付服务尚未完成密钥配置", code="PAYMENT_NOT_CONFIGURED", status=503)

    @staticmethod
    def _json_request(url, *, method="GET", body=None, headers=None, timeout=15):
        payload = None if body is None else json.dumps(body, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        request = urllib.request.Request(url, data=payload, method=method, headers=headers or {})
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                data = response.read()
                return response.status, dict(response.headers.items()), json.loads(data or b"{}")
        except urllib.error.HTTPError as exc:
            raw = exc.read()
            try:
                details = json.loads(raw or b"{}")
            except json.JSONDecodeError:
                details = {"message": raw.decode("utf-8", "replace")}
            raise WeChatPayError(
                details.get("message") or "微信接口请求失败",
                code=details.get("code") or "WECHAT_API_ERROR",
                status=502,
            ) from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            raise WeChatPayError("微信接口暂时不可用", code="WECHAT_API_UNAVAILABLE", status=502) from exc

    def exchange_code(self, code):
        if not self.app_secret:
            raise WeChatPayError("小程序登录尚未完成密钥配置", code="LOGIN_NOT_CONFIGURED", status=503)
        query = urllib.parse.urlencode({
            "appid": self.app_id,
            "secret": self.app_secret,
            "js_code": code,
            "grant_type": "authorization_code",
        })
        _, _, result = self._json_request(f"https://api.weixin.qq.com/sns/jscode2session?{query}")
        if not result.get("openid"):
            raise WeChatPayError(result.get("errmsg") or "微信登录失败", code="WECHAT_LOGIN_FAILED", status=401)
        return result

    def exchange_phone_number(self, code):
        if not self.app_secret:
            raise WeChatPayError("小程序手机号授权尚未完成密钥配置", code="LOGIN_NOT_CONFIGURED", status=503)
        token_query = urllib.parse.urlencode({
            "grant_type": "client_credential",
            "appid": self.app_id,
            "secret": self.app_secret,
        })
        _, _, token_result = self._json_request(f"https://api.weixin.qq.com/cgi-bin/token?{token_query}")
        access_token = token_result.get("access_token")
        if not access_token:
            raise WeChatPayError(token_result.get("errmsg") or "微信手机号授权失败", code="WECHAT_PHONE_TOKEN_FAILED", status=502)
        _, _, result = self._json_request(
            f"https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token={urllib.parse.quote(access_token, safe='')}",
            method="POST",
            body={"code": code},
            headers={"Content-Type": "application/json"},
        )
        phone_info = result.get("phone_info") or {}
        if result.get("errcode") not in (None, 0) or not phone_info.get("phoneNumber"):
            raise WeChatPayError(result.get("errmsg") or "微信手机号授权失败", code="WECHAT_PHONE_FAILED", status=400)
        return phone_info

    def _private_key(self):
        self._require_configured()
        return serialization.load_pem_private_key(Path(self.private_key_path).read_bytes(), password=None)

    def _public_key(self):
        self._require_configured()
        return serialization.load_pem_public_key(Path(self.public_key_path).read_bytes())

    @staticmethod
    def _rsa_sign(private_key, message):
        signature = private_key.sign(message.encode("utf-8"), padding.PKCS1v15(), hashes.SHA256())
        return base64.b64encode(signature).decode("ascii")

    def _authorization(self, method, path, body_text):
        timestamp = str(int(time.time()))
        nonce = secrets.token_hex(16)
        message = f"{method}\n{path}\n{timestamp}\n{nonce}\n{body_text}\n"
        signature = self._rsa_sign(self._private_key(), message)
        value = (
            f'mchid="{self.mch_id}",nonce_str="{nonce}",signature="{signature}",'
            f'timestamp="{timestamp}",serial_no="{self.merchant_serial}"'
        )
        return f"WECHATPAY2-SHA256-RSA2048 {value}"

    def _api_request(self, method, path, body=None):
        self._require_configured()
        body_text = "" if body is None else json.dumps(body, ensure_ascii=False, separators=(",", ":"))
        headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": self._authorization(method, path, body_text),
        }
        data = None if body is None else body_text.encode("utf-8")
        request = urllib.request.Request(f"{self.API_ORIGIN}{path}", data=data, method=method, headers=headers)
        try:
            with urllib.request.urlopen(request, timeout=20) as response:
                raw = response.read()
                self.verify_response(response.headers, raw)
                return json.loads(raw or b"{}")
        except urllib.error.HTTPError as exc:
            raw = exc.read()
            try:
                details = json.loads(raw or b"{}")
            except json.JSONDecodeError:
                details = {}
            raise WeChatPayError(
                details.get("message") or "微信支付接口请求失败",
                code=details.get("code") or "WECHAT_PAY_API_ERROR",
                status=502,
            ) from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            raise WeChatPayError("微信支付接口暂时不可用", code="WECHAT_PAY_UNAVAILABLE", status=502) from exc

    def verify_signature(self, timestamp, nonce, body, signature, serial):
        self._require_configured()
        if serial != self.public_key_id:
            raise WeChatPayError("微信支付签名公钥不匹配", code="WECHAT_PAY_SERIAL_MISMATCH", status=400)
        message = f"{timestamp}\n{nonce}\n{body.decode('utf-8')}\n".encode("utf-8")
        try:
            self._public_key().verify(base64.b64decode(signature), message, padding.PKCS1v15(), hashes.SHA256())
        except Exception as exc:
            raise WeChatPayError("微信支付签名验证失败", code="INVALID_WECHAT_PAY_SIGNATURE", status=400) from exc

    def verify_response(self, headers, body):
        self.verify_signature(
            headers.get("Wechatpay-Timestamp", ""),
            headers.get("Wechatpay-Nonce", ""),
            body,
            headers.get("Wechatpay-Signature", ""),
            headers.get("Wechatpay-Serial", ""),
        )

    def create_jsapi_order(self, *, order_no, description, total_cents, openid, client_ip):
        result = self._api_request("POST", "/v3/pay/transactions/jsapi", {
            "appid": self.app_id,
            "mchid": self.mch_id,
            "description": description,
            "out_trade_no": order_no,
            "notify_url": self.notify_url,
            "amount": {"total": total_cents, "currency": "CNY"},
            "payer": {"openid": openid},
            "scene_info": {"payer_client_ip": client_ip},
        })
        prepay_id = result.get("prepay_id")
        if not prepay_id:
            raise WeChatPayError("微信支付未返回预支付订单", code="PREPAY_ID_MISSING", status=502)
        timestamp = str(int(time.time()))
        nonce = secrets.token_hex(16)
        package = f"prepay_id={prepay_id}"
        pay_sign = self._rsa_sign(self._private_key(), f"{self.app_id}\n{timestamp}\n{nonce}\n{package}\n")
        return {"timeStamp": timestamp, "nonceStr": nonce, "package": package, "signType": "RSA", "paySign": pay_sign}

    def query_order(self, order_no):
        encoded = urllib.parse.quote(order_no, safe="")
        return self._api_request("GET", f"/v3/pay/transactions/out-trade-no/{encoded}?mchid={self.mch_id}")

    def parse_notification(self, headers, raw_body):
        self.verify_signature(
            headers.get("Wechatpay-Timestamp", ""),
            headers.get("Wechatpay-Nonce", ""),
            raw_body,
            headers.get("Wechatpay-Signature", ""),
            headers.get("Wechatpay-Serial", ""),
        )
        notification = json.loads(raw_body)
        resource = notification.get("resource") or {}
        if resource.get("algorithm") != "AEAD_AES_256_GCM":
            raise WeChatPayError("微信支付通知加密算法不受支持", code="INVALID_NOTIFICATION_ALGORITHM", status=400)
        try:
            plaintext = AESGCM(self.api_v3_key.encode("utf-8")).decrypt(
                resource["nonce"].encode("utf-8"),
                base64.b64decode(resource["ciphertext"]),
                (resource.get("associated_data") or "").encode("utf-8"),
            )
            return notification, json.loads(plaintext)
        except Exception as exc:
            raise WeChatPayError("微信支付通知解密失败", code="INVALID_NOTIFICATION_CIPHERTEXT", status=400) from exc
