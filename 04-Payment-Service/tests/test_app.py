from datetime import datetime, timezone
import sqlite3

import pytest

from app import PLANS, create_app


class FakePayClient:
    def __init__(self):
        self.orders = {}
        self.notification = None

    def configured(self):
        return True

    def exchange_code(self, code):
        return {"openid": f"openid-{code}"}

    def exchange_phone_code(self, code):
        assert code
        if code in {"phone-code", "first", "second"}:
            number = "13800138000"
        else:
            suffix = sum(ord(character) for character in code) % 100000000
            number = f"139{suffix:08d}"
        return {"phoneNumber": number, "countryCode": "86"}

    def create_jsapi_order(self, **values):
        self.orders[values["order_no"]] = values
        return {"timeStamp": "1700000000", "nonceStr": "nonce", "package": "prepay_id=fake", "signType": "RSA", "paySign": "signature"}

    def query_order(self, order_no):
        order = self.orders[order_no]
        return {
            "appid": "wx34133741173154d4",
            "mchid": "1116466183",
            "out_trade_no": order_no,
            "transaction_id": f"wx-{order_no}",
            "trade_state": "SUCCESS",
            "success_time": datetime.now(timezone.utc).isoformat(),
            "amount": {"total": order["total_cents"]},
            "payer": {"openid": order["openid"]},
        }

    def parse_notification(self, headers, body):
        return self.notification


@pytest.fixture()
def client(tmp_path):
    fake = FakePayClient()
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "test-secret",
        "DATABASE_PATH": str(tmp_path / "payments.db"),
        "WECHAT_APP_ID": "wx34133741173154d4",
        "WECHAT_PAY_MCH_ID": "1116466183",
    }, pay_client=fake)
    return app.test_client()


def registration_payload(code="user-a", **values):
    return {
        "code": code,
        "phoneCode": f"phone-{code}",
        "nickname": "观澜用户",
        "avatarSelected": True,
        **values,
    }


def login(client, code="user-a"):
    response = client.post("/api/v1/auth/wechat", json=registration_payload(code))
    assert response.status_code == 200
    return response.get_json()["token"]


def auth(token):
    return {"Authorization": f"Bearer {token}"}


def test_health_exposes_non_secret_account_ids(client):
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.get_json() == {
        "service": "wavesight-payment-service",
        "status": "ok",
        "paymentConfigured": True,
        "appId": "wx34133741173154d4",
        "mchId": "1116466183",
    }


def test_login_creates_seven_day_trial(client):
    token = login(client)
    response = client.get("/api/v1/member/me", headers=auth(token))
    membership = response.get_json()["membership"]
    assert membership["status"] == "trial"
    assert membership["remainingDays"] == 7


def test_new_user_trial_does_not_start_before_required_profile_is_complete(client):
    response = client.post("/api/v1/auth/wechat", json={"code": "incomplete-user"})
    assert response.status_code == 409
    assert response.get_json()["error"]["code"] == "REGISTRATION_REQUIRED"
    assert response.get_json()["error"]["missing"] == ["phone", "nickname", "avatar"]

    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        count = conn.execute("SELECT COUNT(*) FROM users WHERE openid=?", ("openid-incomplete-user",)).fetchone()[0]
    assert count == 0

    completed = client.post("/api/v1/auth/wechat", json=registration_payload("incomplete-user", nickname="新用户"))
    assert completed.status_code == 200
    payload = completed.get_json()
    assert payload["isNewUser"] is True
    assert payload["membership"]["remainingDays"] == 7
    assert payload["profile"]["nickname"] == "新用户"
    assert payload["profile"]["avatarSelected"] is True
    assert payload["profile"]["phoneMasked"].startswith("139****")


def test_phone_authorization_binds_masked_number_without_storing_plaintext(client):
    token = login(client, "phone-user")
    response = client.post("/api/v1/member/phone", headers=auth(token), json={"code": "phone-code"})
    assert response.status_code == 200
    assert response.get_json()["profile"] == {"phoneMasked": "138****8000", "nickname": "观澜用户", "avatarSelected": True}

    profile = client.get("/api/v1/member/me", headers=auth(token)).get_json()["profile"]
    assert profile == {"phoneMasked": "138****8000", "nickname": "观澜用户", "avatarSelected": True}

    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        phone_hash, phone_masked = conn.execute(
            "SELECT phone_hash, phone_masked FROM users WHERE openid=?",
            ("openid-phone-user",),
        ).fetchone()
    assert phone_masked == "138****8000"
    assert len(phone_hash) == 64
    assert phone_hash != "13800138000"


def test_phone_cannot_be_bound_to_two_accounts(client):
    first_token = login(client, "phone-owner")
    second_token = login(client, "phone-other")
    assert client.post("/api/v1/member/phone", headers=auth(first_token), json={"code": "first"}).status_code == 200
    response = client.post("/api/v1/member/phone", headers=auth(second_token), json={"code": "second"})
    assert response.status_code == 409
    assert response.get_json()["error"]["code"] == "PHONE_ALREADY_BOUND"


def test_invite_visit_registration_and_reward_stats_are_idempotent(client):
    inviter_login = client.post("/api/v1/auth/wechat", json=registration_payload("inviter")).get_json()
    inviter_token = inviter_login["token"]
    invite_code = inviter_login["inviteCode"]

    first_visit = client.post("/api/v1/invites/visit", json={"inviteCode": invite_code, "visitorKey": "device-1"})
    repeated_visit = client.post("/api/v1/invites/visit", json={"inviteCode": invite_code, "visitorKey": "device-1"})
    assert first_visit.status_code == 201
    assert repeated_visit.status_code == 200

    invited_login = client.post("/api/v1/auth/wechat", json=registration_payload("invitee", inviteCode=invite_code))
    repeated_login = client.post("/api/v1/auth/wechat", json={"code": "invitee", "inviteCode": invite_code})
    assert invited_login.get_json()["isNewUser"] is True
    assert invited_login.get_json()["invitationAccepted"] is True
    assert repeated_login.get_json()["isNewUser"] is False
    assert repeated_login.get_json()["invitationAccepted"] is False

    summary = client.get("/api/v1/invites/me", headers=auth(inviter_token)).get_json()["summary"]
    assert summary == {
        "inviteCode": invite_code,
        "invitedCount": 1,
        "successfulCount": 1,
        "rewardPoints": 300,
    }


@pytest.mark.parametrize("plan_id", list(PLANS))
def test_paid_order_uses_server_price_and_extends_membership(client, plan_id):
    token = login(client, f"buyer-{plan_id}")
    created = client.post("/api/v1/pay/wechat/orders", headers=auth(token), json={"planId": plan_id, "totalCents": 1})
    assert created.status_code == 201
    payload = created.get_json()
    assert payload["plan"]["totalCents"] == PLANS[plan_id]["total_cents"]
    queried = client.get(f"/api/v1/pay/orders/{payload['orderNo']}", headers=auth(token))
    assert queried.status_code == 200
    result = queried.get_json()
    assert result["order"]["status"] == "PAID"
    assert result["membership"]["status"] == "member"


def test_order_requires_authentication(client):
    response = client.post("/api/v1/pay/wechat/orders", json={"planId": "monthly"})
    assert response.status_code == 401


def test_invalid_plan_is_rejected(client):
    token = login(client)
    response = client.post("/api/v1/pay/wechat/orders", headers=auth(token), json={"planId": "fake"})
    assert response.status_code == 400


def test_verified_notification_is_idempotent(client):
    token = login(client, "notify-buyer")
    created = client.post("/api/v1/pay/wechat/orders", headers=auth(token), json={"planId": "monthly"}).get_json()
    order_no = created["orderNo"]
    fake = client.application.pay_client
    transaction = {
        "appid": "wx34133741173154d4",
        "mchid": "1116466183",
        "out_trade_no": order_no,
        "transaction_id": f"wx-notify-{order_no}",
        "trade_state": "SUCCESS",
        "success_time": datetime.now(timezone.utc).isoformat(),
        "amount": {"total": 3000},
        "payer": {"openid": "openid-notify-buyer"},
    }
    fake.notification = ({"id": "notice-1", "event_type": "TRANSACTION.SUCCESS"}, transaction)
    first = client.post("/api/v1/pay/wechat/notify", data=b"encrypted")
    second = client.post("/api/v1/pay/wechat/notify", data=b"encrypted")
    assert first.status_code == 204
    assert second.status_code == 204
    result = client.get(f"/api/v1/pay/orders/{order_no}", headers=auth(token)).get_json()
    assert result["order"]["status"] == "PAID"
