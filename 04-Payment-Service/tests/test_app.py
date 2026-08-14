from datetime import datetime, timezone

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

    def exchange_phone_number(self, code):
        return {"phoneNumber": "13800138000"}

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


@pytest.fixture()
def client(tmp_path):
    fake = FakePayClient()
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "test-secret",
        "DATABASE_PATH": str(tmp_path / "payments.db"),
        "WECHAT_APP_ID": "wx34133741173154d4",
        "WECHAT_PAY_MCH_ID": "1116466183",
    }, pay_client=fake, community_client=FakeCommunityClient())
    return app.test_client()


def login(client, code="user-a"):
    response = client.post("/api/v1/auth/wechat", json={"code": code})
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


def test_point_redemption_extends_membership_without_reducing_lifetime(client):
    token = login(client, "redeemer")
    client.post("/api/v1/community/link-phone", headers=auth(token), json={"code": "phone-code"})
    response = client.post("/api/v1/points/redeem", headers=auth(token), json={"benefitId": "membership_7d"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["wallet"] == {"balance": 560, "lifetime": 860}
    assert payload["membership"]["active"] is True


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
