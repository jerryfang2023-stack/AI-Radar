from datetime import datetime, timedelta, timezone
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
        return {"openid": f"openid-{code}", "session_key": f"session-{code}"}

    def exchange_phone_code(self, code):
        assert code
        if code in {"phone-code", "first", "second"}:
            number = "13800138000"
        else:
            suffix = sum(ord(character) for character in code) % 100000000
            number = f"139{suffix:08d}"
        return {"phoneNumber": number, "countryCode": "86"}

    def exchange_phone_number(self, code):
        return self.exchange_phone_code(code)

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


class FakeCommunityClient:
    def __init__(self):
        self.applications = []
        self.member_points = 860

    def lookup(self, phone):
        if phone == "13800138000":
            return {"found": True, "member": {"id": 42, "name": "现有社群成员", "status": "approved", "points": self.member_points}}
        return {"found": False}

    def status(self, member_id):
        return {"member": {"id": member_id, "name": "现有社群成员", "status": "approved", "points": self.member_points}}

    def submit_application(self, payload):
        self.applications.append(payload)
        return {"member": {"id": 77, "name": payload["name"], "status": "pending", "points": 0}}


class FakeVirtualPayClient:
    def __init__(self):
        self.orders = {}
        self.refunds = {}
        self.notification = None

    def configured(self):
        return True

    def notification_configured(self):
        return False

    def create_payment(self, **values):
        if values["expected_openid"] != f"openid-{values['login_code']}":
            from payment_service.wechatpay import WeChatPayError

            raise WeChatPayError(
                "支付用户与当前账号不一致",
                code="VIRTUAL_PAYMENT_USER_MISMATCH",
                status=403,
            )
        self.orders[values["order_no"]] = values
        return {
            "env": 1,
            "offerId": "offer-test",
            "mode": "short_series_goods",
            "signData": "{}",
            "paySig": "pay-signature",
            "signature": "user-signature",
        }

    def query_order(self, *, openid, order_no):
        if order_no in self.refunds:
            return {"order_id": order_no, "status": 8}
        order = self.orders[order_no]
        return {
            "order_id": order_no,
            "status": 2,
            "order_fee": order["total_cents"],
            "paid_fee": order["total_cents"],
            "left_fee": order["total_cents"],
            "paid_time": int(datetime.now(timezone.utc).timestamp()),
            "env_type": 2,
            "wx_order_id": f"virtual-{order_no}",
        }

    def refund_order(self, *, openid, order_no, refund_no, left_fee, refund_fee):
        assert left_fee == refund_fee
        self.refunds[refund_no] = {"order_no": order_no, "openid": openid}
        return {"refund_order_id": refund_no}

    def parse_callback(self, body, query):
        return self.notification


@pytest.fixture()
def client(tmp_path):
    fake = FakePayClient()
    virtual = FakeVirtualPayClient()
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "test-secret",
        "DATABASE_PATH": str(tmp_path / "payments.db"),
        "WECHAT_APP_ID": "wx34133741173154d4",
        "WECHAT_PAY_MCH_ID": "1116466183",
        "WECHAT_VIRTUAL_ENV": 1,
        "WECHAT_VIRTUAL_REFUND_DAYS": 15,
    }, pay_client=fake, virtual_pay_client=virtual, community_client=FakeCommunityClient())
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
        "virtualPaymentConfigured": True,
        "virtualNotifyConfigured": False,
        "virtualEnvironment": 1,
        "appId": "wx34133741173154d4",
        "mchId": "1116466183",
    }


def test_login_creates_seven_day_trial(client):
    token = login(client)
    response = client.get("/api/v1/member/me", headers=auth(token))
    membership = response.get_json()["membership"]
    assert membership["status"] == "trial"
    assert membership["remainingDays"] == 7


def test_trial_waits_for_registration_and_stores_no_plaintext_phone(client):
    response = client.post("/api/v1/auth/wechat", json={"code": "incomplete-user"})
    assert response.status_code == 409
    assert response.get_json()["error"]["code"] == "REGISTRATION_REQUIRED"

    completed = client.post("/api/v1/auth/wechat", json=registration_payload("incomplete-user", nickname="新用户"))
    assert completed.status_code == 200
    payload = completed.get_json()
    assert payload["isNewUser"] is True
    assert payload["profile"]["phoneMasked"].startswith("139****")

    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        phone_hash, phone_masked = conn.execute(
            "SELECT phone_hash, phone_masked FROM users WHERE openid=?",
            ("openid-incomplete-user",),
        ).fetchone()
    assert phone_masked.startswith("139****")
    assert len(phone_hash) == 64
    assert "139" not in phone_hash


def test_existing_community_member_can_link_during_first_login_without_profile_repeat(client):
    response = client.post("/api/v1/auth/wechat", json={"code": "community-user", "phoneCode": "phone-code"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["profile"]["nickname"] == "现有社群成员"
    assert payload["community"]["status"] == "joined"
    assert payload["wallet"] == {"balance": 860, "lifetime": 860}


def test_existing_mini_program_user_can_link_by_phone_without_profile_repeat(client):
    created = client.post("/api/v1/auth/wechat", json=registration_payload("legacy-community"))
    assert created.status_code == 200

    linked = client.post("/api/v1/auth/wechat", json={"code": "legacy-community", "phoneCode": "phone-code"})
    assert linked.status_code == 200
    payload = linked.get_json()
    assert payload["isNewUser"] is False
    assert payload["profile"]["nickname"] == "现有社群成员"
    assert payload["community"]["status"] == "joined"
    assert payload["wallet"] == {"balance": 860, "lifetime": 860}


def test_phone_cannot_be_bound_to_two_accounts(client):
    first_token = login(client, "phone-owner")
    second_token = login(client, "phone-other")
    assert client.post("/api/v1/member/phone", headers=auth(first_token), json={"code": "first"}).status_code == 200
    response = client.post("/api/v1/member/phone", headers=auth(second_token), json={"code": "second"})
    assert response.status_code == 409
    assert response.get_json()["error"]["code"] == "PHONE_ALREADY_BOUND"


def test_invite_visit_registration_and_wallet_reward_are_idempotent(client):
    inviter_login = client.post("/api/v1/auth/wechat", json=registration_payload("inviter")).get_json()
    inviter_token = inviter_login["token"]
    invite_code = inviter_login["inviteCode"]

    first_visit = client.post("/api/v1/invites/visit", json={"inviteCode": invite_code, "visitorKey": "device-1"})
    repeated_visit = client.post("/api/v1/invites/visit", json={"inviteCode": invite_code, "visitorKey": "device-1"})
    assert first_visit.status_code == 201
    assert repeated_visit.status_code == 200

    invited_login = client.post("/api/v1/auth/wechat", json=registration_payload("invitee", inviteCode=invite_code))
    repeated_login = client.post("/api/v1/auth/wechat", json={"code": "invitee", "inviteCode": invite_code})
    assert invited_login.get_json()["invitationAccepted"] is True
    assert repeated_login.get_json()["invitationAccepted"] is False

    result = client.get("/api/v1/invites/me", headers=auth(inviter_token)).get_json()
    assert result["summary"]["successfulCount"] == 1
    assert result["summary"]["rewardPoints"] == 300
    assert result["wallet"] == {"balance": 300, "lifetime": 300}


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


@pytest.mark.parametrize("plan_id", list(PLANS))
def test_virtual_order_uses_fixed_product_and_verified_query(client, plan_id):
    buyer = f"virtual-{plan_id}"
    token = login(client, buyer)
    created = client.post(
        "/api/v1/pay/virtual/orders",
        headers=auth(token),
        json={"planId": plan_id, "loginCode": buyer, "totalCents": 1},
    )
    assert created.status_code == 201
    payload = created.get_json()
    assert payload["plan"]["productId"] == PLANS[plan_id]["product_id"]
    assert payload["plan"]["totalCents"] == PLANS[plan_id]["total_cents"]
    assert payload["payment"]["mode"] == "short_series_goods"

    result = client.get(f"/api/v1/pay/orders/{payload['orderNo']}", headers=auth(token)).get_json()
    assert result["order"]["status"] == "PAID"
    assert result["membership"]["status"] == "member"


def test_virtual_order_rejects_login_code_for_another_user(client):
    token = login(client, "virtual-owner")
    response = client.post(
        "/api/v1/pay/virtual/orders",
        headers=auth(token),
        json={"planId": "monthly", "loginCode": "different-user"},
    )
    assert response.status_code == 403
    assert response.get_json()["error"]["code"] == "VIRTUAL_PAYMENT_USER_MISMATCH"


def test_virtual_order_supports_full_refund_within_fifteen_days(client):
    buyer = "refund-buyer"
    token = login(client, buyer)
    created = client.post(
        "/api/v1/pay/virtual/orders",
        headers=auth(token),
        json={"planId": "monthly", "loginCode": buyer},
    ).get_json()
    client.get(f"/api/v1/pay/orders/{created['orderNo']}", headers=auth(token))

    refund = client.post(f"/api/v1/pay/orders/{created['orderNo']}/refund", headers=auth(token))
    assert refund.status_code == 202
    assert refund.get_json()["order"]["refundStatus"] == "PROCESSING"

    result = client.get(f"/api/v1/pay/orders/{created['orderNo']}", headers=auth(token)).get_json()
    assert result["order"]["status"] == "REFUNDED"
    assert result["order"]["refundStatus"] == "REFUNDED"
    assert result["membership"]["status"] == "trial"


def test_virtual_delivery_notification_is_verified_by_order_query_and_idempotent(client):
    buyer = "notify-virtual-buyer"
    token = login(client, buyer)
    created = client.post(
        "/api/v1/pay/virtual/orders",
        headers=auth(token),
        json={"planId": "monthly", "loginCode": buyer},
    ).get_json()
    client.application.virtual_pay_client.notification = {
        "Event": "xpay_goods_deliver_notify",
        "OpenId": f"openid-{buyer}",
        "OutTradeNo": created["orderNo"],
        "GoodsInfo": {"ProductId": "membership_30d"},
    }

    first = client.post("/api/v1/pay/virtual/notify", data=b"signed")
    second = client.post("/api/v1/pay/virtual/notify", data=b"signed")
    assert first.status_code == 200
    assert second.status_code == 200
    result = client.get(f"/api/v1/pay/orders/{created['orderNo']}", headers=auth(token)).get_json()
    assert result["order"]["status"] == "PAID"
    assert result["membership"]["status"] == "member"


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


def test_existing_community_member_links_by_verified_phone_and_imports_all_history(client):
    token = login(client, "existing-member")
    response = client.post("/api/v1/community/link-phone", headers=auth(token), json={"code": "phone-code"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["phoneMasked"] == "138****8000"
    assert payload["community"] == {"memberId": 42, "name": "现有社群成员", "status": "joined", "statusLabel": "已入群", "points": 860}
    assert payload["wallet"] == {"balance": 860, "lifetime": 860}

    repeated = client.post("/api/v1/community/link-phone", headers=auth(token), json={"code": "phone-code"}).get_json()
    assert repeated["wallet"] == {"balance": 860, "lifetime": 860}

    client.application.community_client.member_points = 1060
    refreshed = client.get("/api/v1/member/me", headers=auth(token)).get_json()
    assert refreshed["community"]["points"] == 1060
    assert refreshed["wallet"] == {"balance": 1060, "lifetime": 1060}

    client.application.community_client.member_points = 760
    decreased = client.get("/api/v1/member/me", headers=auth(token)).get_json()
    assert decreased["community"]["points"] == 760
    assert decreased["wallet"] == {"balance": 760, "lifetime": 1060}

    client.application.community_client.member_points = 1060
    restored = client.get("/api/v1/member/me", headers=auth(token)).get_json()
    assert restored["wallet"] == {"balance": 1060, "lifetime": 1060}


def test_growth_tasks_are_server_confirmed_and_idempotent(client):
    token = login(client, "task-member")
    headers = auth(token)

    first = client.post("/api/v1/member/behaviors", headers=headers, json={"type": "checkin", "subjectId": "daily"})
    repeated = client.post("/api/v1/member/behaviors", headers=headers, json={"type": "checkin", "subjectId": "daily"})
    assert first.get_json()["awarded"] == 5
    assert first.get_json()["wallet"] == {"balance": 5, "lifetime": 5}
    assert repeated.get_json()["awarded"] == 0
    assert repeated.get_json()["wallet"] == {"balance": 5, "lifetime": 5}

    for index in range(1, 6):
        reading = client.post("/api/v1/member/behaviors", headers=headers, json={"type": "browse", "subjectId": f"funding-{index}"})
    assert reading.get_json()["awarded"] == 2
    assert reading.get_json()["wallet"] == {"balance": 7, "lifetime": 7}

    favorite = client.post("/api/v1/member/behaviors", headers=headers, json={"type": "favorite", "subjectId": "funding-1"})
    assert favorite.get_json()["awarded"] == 3
    assert favorite.get_json()["wallet"] == {"balance": 10, "lifetime": 10}

    yesterday = (datetime.now(timezone(timedelta(hours=8))).date() - timedelta(days=1)).isoformat()
    delayed = client.post("/api/v1/member/behaviors", headers=headers, json={
        "type": "checkin", "subjectId": "daily", "behaviorDate": yesterday,
    })
    assert delayed.get_json()["behaviorDate"] == yesterday
    assert delayed.get_json()["wallet"] == {"balance": 15, "lifetime": 15}

    expired_date = (datetime.now(timezone(timedelta(hours=8))).date() - timedelta(days=2)).isoformat()
    expired = client.post("/api/v1/member/behaviors", headers=headers, json={
        "type": "checkin", "subjectId": "daily", "behaviorDate": expired_date,
    })
    assert expired.status_code == 400
    assert expired.get_json()["error"]["code"] == "INVALID_BEHAVIOR_DATE"


def test_point_redemption_extends_membership_without_reducing_lifetime(client):
    token = login(client, "redeemer")
    client.post("/api/v1/community/link-phone", headers=auth(token), json={"code": "phone-code"})
    response = client.post("/api/v1/points/redeem", headers=auth(token), json={"benefitId": "membership_7d"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["wallet"] == {"balance": 560, "lifetime": 860}
    assert payload["membership"]["active"] is True


def test_community_point_recovery_does_not_refund_spent_points(client):
    token = login(client, "community-balance-offset")
    client.post("/api/v1/community/link-phone", headers=auth(token), json={"code": "phone-code"})
    redeemed = client.post("/api/v1/points/redeem", headers=auth(token), json={"benefitId": "membership_7d"}).get_json()
    assert redeemed["wallet"] == {"balance": 560, "lifetime": 860}

    client.application.community_client.member_points = 0
    cleared = client.get("/api/v1/member/me", headers=auth(token)).get_json()
    assert cleared["wallet"] == {"balance": 0, "lifetime": 860}

    client.application.community_client.member_points = 860
    restored = client.get("/api/v1/member/me", headers=auth(token)).get_json()
    assert restored["wallet"] == {"balance": 560, "lifetime": 860}


def test_native_application_is_forwarded_to_existing_member_management(client):
    token = login(client, "applicant")
    response = client.post("/api/v1/community/applications", headers=auth(token), json={
        "name": "新申请人", "phone": "13900139000", "wechat": "new_member",
        "city": "上海", "role": "Founder / 创业者", "industry": "企业服务",
        "skills": "产品与交付", "project": "AI 企业服务", "needs": "寻找客户",
        "direction": "企业 AI", "perspective": "从真实交付开始验证"
    })
    assert response.status_code == 201
    assert response.get_json()["community"]["status"] == "pending"
    assert client.application.community_client.applications[0]["source"] == "miniprogram"
