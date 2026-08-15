#!/usr/bin/env python3
"""Create and publish the fixed Guanlan virtual-payment products.

Secrets are read from the service environment and are never printed. The script is
safe to rerun: WeChat's query result is used to confirm each asynchronous task.
"""

import argparse
import hashlib
import hmac
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request


PRODUCTS = (
    {
        "id": "membership_30d",
        "name": "观澜会员30天",
        "price": 3000,
        "remark": "观澜AI全部栏目30天浏览权益",
    },
    {
        "id": "membership_180d",
        "name": "观澜会员180天",
        "price": 16800,
        "remark": "观澜AI全部栏目180天浏览权益",
    },
    {
        "id": "membership_365d",
        "name": "观澜会员365天",
        "price": 30000,
        "remark": "观澜AI全部栏目365天浏览权益",
    },
)

DEFAULT_IMAGE_URL = "https://www.zkdlj.vip/assets/virtual-membership.png"


class ProvisionError(RuntimeError):
    pass


def compact_json(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def request_json(url, body=None):
    data = None if body is None else compact_json(body).encode("utf-8")
    request = urllib.request.Request(
        url,
        data=data,
        method="POST" if body is not None else "GET",
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read() or b"{}")
    except urllib.error.HTTPError as exc:
        raw = exc.read()
        try:
            detail = json.loads(raw or b"{}")
        except json.JSONDecodeError:
            detail = {"errmsg": raw.decode("utf-8", "replace")}
        raise ProvisionError(
            f"WeChat HTTP {exc.code}: {detail.get('errcode', '')} {detail.get('errmsg', '')}".strip()
        ) from exc
    except urllib.error.URLError as exc:
        raise ProvisionError(f"WeChat API unavailable: {exc.reason}") from exc


def access_token(app_id, app_secret):
    query = urllib.parse.urlencode(
        {
            "grant_type": "client_credential",
            "appid": app_id,
            "secret": app_secret,
        }
    )
    result = request_json(f"https://api.weixin.qq.com/cgi-bin/token?{query}")
    token = result.get("access_token")
    if not token:
        raise ProvisionError(
            f"Access token failed: {result.get('errcode', '')} {result.get('errmsg', '')}".strip()
        )
    return token


def xpay_request(token, app_key, operation, body):
    body_text = compact_json(body)
    endpoint = f"/xpay/{operation}"
    pay_sig = hmac.new(
        app_key.encode("utf-8"),
        f"{endpoint}&{body_text}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    query = urllib.parse.urlencode({"access_token": token, "pay_sig": pay_sig})
    for attempt in range(4):
        result = request_json(f"https://api.weixin.qq.com/xpay/{operation}?{query}", body)
        error_code = int(result.get("errcode") or 0)
        if error_code == 0:
            return result
        if error_code == 268490015 and attempt < 3:
            time.sleep(5 * (attempt + 1))
            continue
        raise ProvisionError(
            f"{operation} failed: {result.get('errcode', '')} {result.get('errmsg', '')}".strip()
        )
    raise ProvisionError(f"{operation} failed after retry")


def wait_task(token, app_key, operation, body, item_key, *, attempts=20):
    result = {}
    for _ in range(attempts):
        result = xpay_request(token, app_key, operation, body)
        status = int(result.get("status") or 0)
        if status in (2, 3):
            status_key = "upload_status" if item_key == "upload_item" else "publish_status"
            accepted = (1, 2)
            failures = [item for item in result.get(item_key, []) if int(item.get(status_key) or 0) not in accepted]
            if failures:
                failure = failures[0]
                raise ProvisionError(f"{operation} rejected: {compact_json(failure)}")
            return result
        time.sleep(2)
    safe_status = {
        "status": result.get("status"),
        item_key: result.get(item_key, []),
        "errmsg": result.get("errmsg"),
    }
    raise ProvisionError(f"{operation} timed out: {compact_json(safe_status)}")


def provision_product(token, app_key, offer_id, env, image_url, product):
    del offer_id
    xpay_request(
        token,
        app_key,
        "start_upload_goods",
        {
            "upload_item": [{
                **product,
                "item_url": image_url,
            }],
            "env": env,
        },
    )
    wait_task(token, app_key, "query_upload_goods", {"env": env}, "upload_item")

    xpay_request(
        token,
        app_key,
        "start_publish_goods",
        {"publish_item": [{"id": product["id"]}], "env": env},
    )
    wait_task(token, app_key, "query_publish_goods", {"env": env}, "publish_item")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--env", type=int, choices=(0, 1), required=True, help="0 production, 1 sandbox")
    parser.add_argument("--image-url", default=DEFAULT_IMAGE_URL)
    arguments = parser.parse_args()

    required = {
        "WECHAT_APP_ID": os.getenv("WECHAT_APP_ID", ""),
        "WECHAT_APP_SECRET": os.getenv("WECHAT_APP_SECRET", ""),
        "WECHAT_VIRTUAL_OFFER_ID": os.getenv("WECHAT_VIRTUAL_OFFER_ID", ""),
        "WECHAT_VIRTUAL_APP_KEY": os.getenv(
            "WECHAT_VIRTUAL_SANDBOX_APP_KEY" if arguments.env == 1 else "WECHAT_VIRTUAL_APP_KEY", ""
        ),
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        raise ProvisionError(f"Missing environment keys: {', '.join(missing)}")

    token = access_token(required["WECHAT_APP_ID"], required["WECHAT_APP_SECRET"])
    environment = "sandbox" if arguments.env == 1 else "production"
    for product in PRODUCTS:
        provision_product(
            token,
            required["WECHAT_VIRTUAL_APP_KEY"],
            required["WECHAT_VIRTUAL_OFFER_ID"],
            arguments.env,
            arguments.image_url,
            product,
        )
        print(f"{environment}: {product['id']} published")
        time.sleep(5)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ProvisionError as error:
        print(str(error), file=sys.stderr)
        raise SystemExit(1)
