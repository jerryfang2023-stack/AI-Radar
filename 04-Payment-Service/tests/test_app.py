from datetime import datetime, timedelta, timezone
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import sqlite3
from types import SimpleNamespace

import pytest

from app import PLANS, create_app
from payment_service.unified_account import VerificationSender


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

    def create_native_order(self, **values):
        self.orders[values["order_no"]] = {**values, "openid": ""}
        return {"codeUrl": f"weixin://wxpay/{values['order_no']}"}

    def refund_order(self, **values):
        return {"status": "SUCCESS", "out_refund_no": values["refund_no"]}

    def create_mini_program_code(self, path):
        return b"fake-png"

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


def test_verification_sender_uses_tencent_ses_template(monkeypatch):
    captured = {}

    class FakeSesClient:
        def __init__(self, cred, region, profile=None):
            captured["region"] = region

        def SendEmail(self, request):
            captured["request"] = json.loads(request.to_json_string())
            return SimpleNamespace(MessageId="message-id")

    monkeypatch.setattr("payment_service.unified_account.ses_client.SesClient", FakeSesClient)
    sender = VerificationSender(
        {
            "TENCENT_SES_SECRET_ID": "secret-id",
            "TENCENT_SES_SECRET_KEY": "secret-key",
            "TENCENT_SES_REGION": "ap-guangzhou",
            "TENCENT_SES_FROM": "观澜 AI <verify@mail.zkdlj.vip>",
            "TENCENT_SES_TEMPLATE_ID": "57298",
            "TENCENT_SES_TEMPLATE_CODE_KEY": "验证码",
            "TENCENT_SES_SUBJECT": "观澜 AI 登录验证码",
        }
    )

    sender.send("email", "reader@example.com", "123456")

    request = captured["request"]
    assert captured["region"] == "ap-guangzhou"
    assert request["FromEmailAddress"] == "观澜 AI <verify@mail.zkdlj.vip>"
    assert request["Destination"] == ["reader@example.com"]
    assert request["Subject"] == "观澜 AI 登录验证码"
    assert request["Template"]["TemplateID"] == 57298
    assert json.loads(request["Template"]["TemplateData"]) == {"验证码": "123456"}
    assert request["TriggerType"] == 1


def test_schema_initialization_is_safe_across_concurrent_workers(tmp_path):
    database = tmp_path / "concurrent.db"

    def initialize(_):
        app = create_app(
            {
                "TESTING": True,
                "APP_ENV": "test",
                "SECRET_KEY": "concurrent-schema-test",
                "DATABASE_PATH": str(database),
            },
            pay_client=FakePayClient(),
            virtual_pay_client=FakeVirtualPayClient(),
            community_client=FakeCommunityClient(),
        )
        return app.name

    with ThreadPoolExecutor(max_workers=4) as pool:
        assert len(list(pool.map(initialize, range(4)))) == 4

    with sqlite3.connect(database) as conn:
        payment_columns = {row[1] for row in conn.execute("PRAGMA table_info(payment_orders)")}
        assert {"idempotency_key", "code_url"}.issubset(payment_columns)


class FakeCommunityClient:
    def __init__(self):
        self.applications = []
        self.member_points = 860
        self.claims = {}
        self.claim_member = None
        self.operations_reviews = []
        self.operations_member_management = []
        self.operations_schedule_writes = []
        self.member_state = "joined"

    def lookup(self, phone):
        if phone == "13800138000":
            status = "eliminated" if self.member_state == "eliminated" else "approved"
            return {"found": True, "member": {"id": 42, "name": "现有社群成员", "status": status, "communityState": self.member_state, "points": self.member_points}}
        return {"found": False}

    def status(self, member_id):
        status = "eliminated" if self.member_state == "eliminated" else "approved"
        return {"member": {"id": member_id, "name": "现有社群成员", "status": status, "communityState": self.member_state, "points": self.member_points}}

    def submit_application(self, payload):
        self.applications.append(payload)
        return {"member": {"id": 77, "name": payload["name"], "status": "pending", "points": 0}}

    def submit_claim(self, account_ref, nickname):
        claim = self.claims.get(account_ref)
        if claim:
            return {"claim": claim}
        if not self.claim_member:
            return {"claim": {"nickname": nickname, "status": "not_found"}}
        claim = {"id": len(self.claims) + 1, "nickname": nickname, "status": "pending"}
        self.claims[account_ref] = claim
        return {"claim": claim}

    def operations_members(self, **filters):
        member = {"id": 77, "name": "待审成员", "city": "杭州", "company": "示例公司", "role": "Founder / 创业者", "status": "pending", "totalScore": 68, "joinedOn": "", "createdAt": "2026-09-01T08:00:00+08:00", "updatedAt": "2026-09-01T08:00:00+08:00"}
        return {"schemaVersion": "COMMUNITY-APPROVAL-V1.0", "generatedAt": "2026-09-03T08:00:00+08:00", "filters": filters, "statusCounts": {"pending": 1, "approved": 0, "waitlist": 0, "rejected": 0}, "page": {"number": 1, "size": 20, "total": 1, "totalPages": 1}, "members": [member]}

    def operations_member(self, member_id):
        return {"schemaVersion": "COMMUNITY-APPROVAL-V1.0", "member": {"id": member_id, "name": "待审成员", "status": "pending", "scores": {"ai": 20, "industry": 18, "entrepreneurship": 15, "contribution": 10, "fit": 5, "total": 68}}}

    def review_operations_member(self, member_id, payload):
        self.operations_reviews.append({"memberId": member_id, **payload})
        return {"schemaVersion": "COMMUNITY-APPROVAL-V1.0", "member": {"id": member_id, "name": "待审成员", "status": payload["status"], "scores": {**payload["scores"], "total": sum(payload["scores"].values())}}}

    def operations_community_members(self, **filters):
        member = {
            "id": 88, "name": "二期成员", "city": "上海", "company": "示例公司",
            "role": "产品", "status": "approved", "cohort": 2, "communityState": "joined",
            "joinedOn": "2026-09-04", "eliminatedOn": "", "eliminationReason": "", "points": 42,
        }
        return {
            "schemaVersion": "COMMUNITY-MEMBER-ADMIN-V1.0", "filters": filters,
            "cohorts": [2, 1], "stateCounts": {"not_joined": 0, "joined": 1, "eliminated": 0},
            "page": {"number": 1, "size": 20, "total": 1, "totalPages": 1}, "members": [member],
        }

    def operations_community_member(self, member_id):
        return {"schemaVersion": "COMMUNITY-MEMBER-ADMIN-V1.0", "member": {
            "id": member_id, "name": "二期成员", "status": "approved", "cohort": 2,
            "communityState": "joined", "joinedOn": "2026-09-04", "points": 42,
        }}

    def manage_operations_community_member(self, member_id, payload):
        self.operations_member_management.append({"memberId": member_id, **payload})
        return {"schemaVersion": "COMMUNITY-MEMBER-ADMIN-V1.0", "member": {
            "id": member_id, "name": "二期成员", "status": "approved", "cohort": payload["cohort"],
            "communityState": payload["state"], "joinedOn": payload.get("joinedOn", ""),
        }}

    def operations_schedule(self):
        return {"schemaVersion": "COMMUNITY-SCHEDULE-V1.0", "seasons": [
            {"season": 1, "label": "一期", "status": "completed", "completedCount": 15, "sessions": []},
            {"season": 2, "label": "二期", "status": "planning", "sessions": []},
        ]}

    def create_operations_schedule_session(self, payload):
        self.operations_schedule_writes.append({"action": "create", **payload})
        return {"schemaVersion": "COMMUNITY-SCHEDULE-V1.0", "session": {"id": "S2-01", **payload}}

    def update_operations_schedule_session(self, session_id, payload):
        self.operations_schedule_writes.append({"action": "update", "sessionId": session_id, **payload})
        return {"schemaVersion": "COMMUNITY-SCHEDULE-V1.0", "session": {"id": session_id, **payload}}


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
    content_root = tmp_path / "protected-content"
    (content_root / "funding").mkdir(parents=True)
    (content_root / "funding" / "round-a.json").write_text(json.dumps({"title": "首篇完整内容", "body": "完整正文"}), encoding="utf-8")
    (content_root / "funding" / "round-b.json").write_text(json.dumps({"title": "第二篇内容", "body": "会员正文"}), encoding="utf-8")
    app = create_app({
        "TESTING": True,
        "SECRET_KEY": "test-secret",
        "DATABASE_PATH": str(tmp_path / "payments.db"),
        "WECHAT_APP_ID": "wx34133741173154d4",
        "WECHAT_PAY_MCH_ID": "1116466183",
        "WECHAT_VIRTUAL_ENV": 1,
        "WECHAT_VIRTUAL_REFUND_DAYS": 15,
        "CONTENT_ROOT": str(content_root),
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


def analytics_event(**values):
    return {
        "eventId": "event-0001",
        "event": "page_view",
        "platform": "miniprogram",
        "visitorId": "visitor-0001",
        "sessionId": "session-0001",
        "page": "/pages/terminal/index",
        "appVersion": "0.6.5",
        "properties": {"source": "test"},
        **values,
    }


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


def pc_login(client, identity_type="email", value="reader@example.com"):
    created = client.post("/api/v1/auth/challenges", json={"type": identity_type, "value": value})
    assert created.status_code == 201
    challenge = created.get_json()
    verified = client.post(
        f"/api/v1/auth/challenges/{challenge['challengeId']}/verify",
        json={"code": challenge["testCode"]},
    )
    assert verified.status_code == 200
    return verified.get_json()


def test_pc_verification_session_and_logout(client):
    account = pc_login(client)
    assert account["membership"]["status"] == "trial"
    assert account["identities"][0]["identity_masked"] == "re***@example.com"
    current = client.get("/api/v1/auth/session")
    assert current.status_code == 200
    assert current.get_json()["authenticated"] is True
    denied = client.post("/api/v1/auth/logout")
    assert denied.status_code == 403
    logged_out = client.post("/api/v1/auth/logout", headers={"X-CSRF-Token": current.get_json()["csrfToken"]})
    assert logged_out.status_code == 204
    assert client.get("/api/v1/auth/session").get_json() == {"authenticated": False}


def test_pc_phone_challenge_is_rejected(client):
    response = client.post(
        "/api/v1/auth/challenges",
        json={"type": "phone", "value": "13900000002"},
    )
    assert response.status_code == 400
    assert response.get_json()["error"] == {"code": "INVALID_IDENTITY", "message": "请输入有效的邮箱"}


def test_verified_identity_conflict_requires_explicit_audited_merge(client):
    target_client = client.application.test_client()
    target = pc_login(target_client, identity_type="email", value="merge-target@example.com")
    source = pc_login(client, identity_type="email", value="merge-source@example.com")
    challenge_response = client.post(
        "/api/v1/auth/challenges",
        headers={"X-CSRF-Token": source["csrfToken"]},
        json={"type": "email", "value": "merge-target@example.com", "purpose": "bind"},
    )
    assert challenge_response.status_code == 201
    challenge = challenge_response.get_json()
    conflict = client.post(
        f"/api/v1/auth/challenges/{challenge['challengeId']}/verify",
        headers={"X-CSRF-Token": source["csrfToken"]},
        json={"code": challenge["testCode"]},
    )
    assert conflict.status_code == 409
    merge_id = conflict.get_json()["error"]["mergeId"]
    merged = client.post(
        f"/api/v1/account/merge-requests/{merge_id}/confirm",
        headers={"X-CSRF-Token": source["csrfToken"]},
        json={},
    )
    assert merged.status_code == 200
    assert merged.get_json()["userId"] == target["userId"]
    assert len(merged.get_json()["identities"]) == 2
    assert {identity["identity_type"] for identity in merged.get_json()["identities"]} == {"email"}


def test_pc_account_can_bind_existing_mini_account_by_confirmed_qr_merge(client):
    mini_client = client.application.test_client()
    mini_token = login(mini_client, "qr-existing-mini")
    source = pc_login(client, identity_type="email", value="qr-source@example.com")
    created = client.post(
        "/api/v1/auth/qr-sessions",
        headers={"X-CSRF-Token": source["csrfToken"]},
        json={"purpose": "bind"},
    )
    assert created.status_code == 201
    ticket = created.get_json()["ticket"]
    assert client.get(f"/api/v1/auth/qr-sessions/{ticket}/code").data == b"fake-png"
    assert mini_client.post(f"/api/v1/auth/qr-sessions/{ticket}/confirm", headers=auth(mini_token)).status_code == 200
    polled = client.get(f"/api/v1/auth/qr-sessions/{ticket}")
    assert polled.status_code == 200
    assert polled.get_json()["status"] == "MERGE_REQUIRED"
    merged = client.post(
        f"/api/v1/account/merge-requests/{polled.get_json()['mergeId']}/confirm",
        headers={"X-CSRF-Token": source["csrfToken"]},
        json={},
    )
    assert merged.status_code == 200
    assert {identity["identity_type"] for identity in merged.get_json()["identities"]} >= {"email", "wechat_openid"}


def test_anonymous_content_allows_one_distinct_sample(client):
    first = client.get("/api/v1/content/funding/round-a")
    assert first.status_code == 200
    assert first.get_json()["access"]["reason"] == "FIRST_SAMPLE"
    repeated = client.get("/api/v1/content/funding/round-a")
    assert repeated.status_code == 200
    second = client.get("/api/v1/content/funding/round-b")
    assert second.status_code == 403
    assert second.get_json()["error"]["code"] == "MEMBERSHIP_REQUIRED"


def test_pc_trial_can_create_and_complete_native_order(client):
    account = pc_login(client, value="payer@example.com")
    created = client.post(
        "/api/v1/pay/native/orders",
        headers={"X-CSRF-Token": account["csrfToken"]},
        json={"planId": "monthly", "idempotencyKey": "native-order-test-0001"},
    )
    assert created.status_code == 201
    assert created.get_json()["payment"]["codeUrl"].startswith("weixin://")
    order_no = created.get_json()["orderNo"]
    queried = client.get(f"/api/v1/pay/native/orders/{order_no}")
    assert queried.status_code == 200
    assert queried.get_json()["order"]["status"] == "PAID"


def test_pc_native_order_creation_is_idempotent(client):
    account = pc_login(client, value="idempotent-payer@example.com")
    headers = {"X-CSRF-Token": account["csrfToken"]}
    payload = {"planId": "monthly", "idempotencyKey": "native-order-test-0002"}
    first = client.post("/api/v1/pay/native/orders", headers=headers, json=payload)
    repeated = client.post("/api/v1/pay/native/orders", headers=headers, json=payload)
    assert first.status_code == 201
    assert repeated.status_code == 200
    assert repeated.get_json()["orderNo"] == first.get_json()["orderNo"]


def test_analytics_events_are_anonymous_idempotent_and_aggregated(client):
    first = client.post("/api/v1/analytics/events", json={"events": [analytics_event(
        referrer="https://example.com/source?phone=13800138000#private",
        properties={"source": "test", "phoneNumber": "13800138000", "openId": "openid-secret"},
    )]})
    assert first.status_code == 200
    assert first.get_json() == {"accepted": 1, "received": 1}
    repeated = client.post("/api/v1/analytics/events", json={"events": [analytics_event()]})
    assert repeated.status_code == 200
    assert repeated.get_json() == {"accepted": 0, "received": 1}

    assert client.get("/api/v1/admin/analytics/summary").status_code == 503
    client.application.config["ANALYTICS_ADMIN_TOKEN"] = "admin-test-token"
    assert client.get("/api/v1/admin/analytics/summary").status_code == 401
    summary = client.get(
        "/api/v1/admin/analytics/summary?days=7",
        headers={"Authorization": "Bearer admin-test-token"},
    )
    assert summary.status_code == 200
    payload = summary.get_json()
    assert payload["overview"]["visitors"] == 1
    assert payload["overview"]["sessions"] == 1
    assert payload["overview"]["pageViews"] == 1
    assert payload["topPages"][0] == {
        "page": "/pages/terminal/index",
        "views": 1,
        "visitors": 1,
    }
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        stored = conn.execute("SELECT referrer, properties_json FROM analytics_events WHERE event_id='event-0001'").fetchone()
    assert stored == ("https://example.com/source", '{"source":"test"}')


def test_passwordless_analytics_is_aggregate_only_and_keeps_admin_protected(client):
    tracked = client.post("/api/v1/analytics/events", json={"events": [analytics_event(
        page="/pages/terminal/index?phone=13800138000#openid-secret",
        properties={"phoneNumber": "13800138000", "openId": "openid-secret"},
    )]})
    assert tracked.status_code == 200
    origin = "https://jerryfang2023-stack.github.io"
    response = client.get("/api/v1/analytics/summary?days=7", headers={"Origin": origin})
    assert response.status_code == 200
    assert response.headers["Access-Control-Allow-Origin"] == origin
    assert response.headers["Access-Control-Allow-Methods"] == "GET, OPTIONS"
    assert response.headers["Cache-Control"] == "no-store"
    payload = response.get_json()
    assert payload["overview"]["visitors"] == 1
    assert payload["topPages"] == [{"page": "/pages/terminal/index", "views": 1, "visitors": 1}]
    encoded = json.dumps(payload)
    for private in ("13800138000", "openid-secret", "event-0001", "visitor-0001", "session-0001", "user_id", "properties_json"):
        assert private not in encoded
    assert client.get("/api/v1/admin/analytics/summary").status_code == 503
    client.application.config["ANALYTICS_ADMIN_TOKEN"] = "admin-test-token"
    assert client.get("/api/v1/admin/analytics/summary").status_code == 401
    assert client.get("/api/v1/admin/analytics/summary", headers={"Authorization": "Bearer wrong"}).status_code == 401
    assert client.get("/api/v1/member/me").status_code == 401
    for method in ("POST", "PUT", "PATCH", "DELETE"):
        assert client.open("/api/v1/analytics/summary", method=method).status_code == 405
    assert client.get("/api/v1/analytics/summary?platform=invalid").status_code == 400
    assert client.get("/api/v1/analytics/summary?days=invalid").get_json()["filters"]["days"] == 7
    preflight = client.options("/api/v1/analytics/summary", headers={"Origin": origin})
    assert preflight.status_code == 204
    assert preflight.headers["Access-Control-Allow-Origin"] == origin
    untrusted = client.get("/api/v1/analytics/summary", headers={"Origin": "https://untrusted.example"})
    assert "Access-Control-Allow-Origin" not in untrusted.headers


@pytest.mark.parametrize("endpoint", ["/api/v1/admin/analytics/summary", "/api/v1/analytics/summary"])
def test_analytics_summary_uses_server_truth_for_registration_and_payment(client, endpoint):
    client.application.config["ANALYTICS_ADMIN_TOKEN"] = "admin-test-token"
    events = [
        analytics_event(
            eventId=f"event-registration-{index}",
            event=event,
            visitorId="visitor-registration",
            sessionId="session-registration",
            properties=properties,
        )
        for index, (event, properties) in enumerate([
            ("registration_prompt_opened", {"required": True}),
            ("registration_phone_submitted", {"flow": "new_registration"}),
            ("registration_failed", {"flow": "new_registration", "reason": "network_error"}),
        ], start=1)
    ]
    tracked = client.post("/api/v1/analytics/events", json={"events": events})
    assert tracked.status_code == 200
    assert tracked.get_json()["accepted"] == 3
    token = login(client, "analytics-paying-user")
    created = client.post(
        "/api/v1/pay/virtual/orders",
        headers=auth(token),
        json={"planId": "monthly", "loginCode": "analytics-paying-user"},
    )
    assert created.status_code == 201
    order_no = created.get_json()["orderNo"]
    paid = client.get(f"/api/v1/pay/orders/{order_no}", headers=auth(token))
    assert paid.status_code == 200
    assert paid.get_json()["order"]["status"] == "PAID"

    summary = client.get(
        f"{endpoint}?days=7&platform=miniprogram",
        headers={"Authorization": "Bearer admin-test-token"},
    ).get_json()
    assert summary["overview"]["newRegistrations"] == 1
    assert summary["overview"]["paidOrders"] == 1
    assert summary["overview"]["grossRevenueCents"] == 3000
    assert summary["eventCounts"]["registration_success"] == 1
    assert summary["eventCounts"]["payment_order_created"] == 1
    assert summary["eventCounts"]["payment_success"] == 1
    assert summary["funnel"] == [
        {"key": "registration_prompt_opened", "label": "打开注册引导", "count": 1},
        {"key": "registration_phone_submitted", "label": "提交手机号授权", "count": 1},
        {"key": "registration_success", "label": "注册成功", "count": 1},
        {"key": "registration_failed", "label": "注册失败", "count": 1},
    ]
    assert summary["registrationFailures"] == [{
        "reason": "network_error",
        "label": "网络连接失败",
        "count": 1,
        "visitors": 1,
    }]


def test_analytics_cors_allows_configured_portal_origin(client):
    response = client.options(
        "/api/v1/analytics/events",
        headers={"Origin": "https://www.zkdlj.vip"},
    )
    assert response.status_code == 204
    assert response.headers["Access-Control-Allow-Origin"] == "https://www.zkdlj.vip"


@pytest.mark.parametrize("endpoint", ["/api/v1/admin/analytics/summary", "/api/v1/analytics/summary"])
def test_analytics_live_cutoff_rejects_demo_history_and_scopes_server_truth(client, endpoint):
    login(client, "prelaunch-user")
    cutoff = datetime.now(timezone.utc).replace(microsecond=0) + timedelta(minutes=1)
    client.application.config.update(
        ANALYTICS_ADMIN_TOKEN="admin-test-token",
        ANALYTICS_LIVE_FROM=cutoff.isoformat(),
    )

    stale = client.post("/api/v1/analytics/events", json={"events": [analytics_event(
        eventId="event-stale-demo",
        visitorId="visitor-stale-demo",
        sessionId="session-stale-demo",
        occurredAt=(cutoff - timedelta(minutes=1)).isoformat(),
    )]})
    assert stale.status_code == 200
    assert stale.get_json() == {"accepted": 0, "received": 1}

    live = client.post("/api/v1/analytics/events", json={"events": [analytics_event(
        eventId="event-live-real",
        visitorId="visitor-live-real",
        sessionId="session-live-real",
        occurredAt=(cutoff + timedelta(seconds=1)).isoformat(),
    )]})
    assert live.status_code == 200
    assert live.get_json() == {"accepted": 1, "received": 1}

    payload = client.get(
        f"{endpoint}?days=7",
        headers={"Authorization": "Bearer admin-test-token"},
    ).get_json()
    assert payload["dataSource"] == "production"
    assert payload["trackingSince"] == cutoff.isoformat(timespec="seconds")
    assert payload["overview"]["visitors"] == 1
    assert payload["overview"]["newRegistrations"] == 0


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
    assert payload["membership"]["remainingDays"] == 90
    assert payload["membership"]["status"] == "member"
    assert payload["membership"]["statusLabel"] == "观澜会员"


def test_eliminated_community_member_does_not_receive_points_or_welcome_membership(client):
    client.application.community_client.member_state = "eliminated"
    response = client.post("/api/v1/auth/wechat", json={"code": "community-user", "phoneCode": "phone-code"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["community"]["status"] == "eliminated"
    assert payload["community"]["statusLabel"] == "已淘汰"
    assert payload["wallet"] == {"balance": 0, "lifetime": 0}
    assert payload["membership"]["status"] == "trial"
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        assert conn.execute(
            "SELECT COUNT(*) FROM membership_ledger WHERE source_id='community-welcome:42'"
        ).fetchone()[0] == 0


def test_nickname_claim_waits_for_admin_then_syncs_member_and_90_day_access_once(client):
    community = client.application.community_client
    community.claim_member = {"id": 88, "name": "阿泽", "status": "approved", "points": 126}
    registered = client.post(
        "/api/v1/auth/wechat",
        json=registration_payload(
            "nickname-community-member",
            phoneCode="nickname-phone",
            nickname="阿泽",
            avatarSelected=True,
        ),
    )
    assert registered.status_code == 200
    payload = registered.get_json()
    assert payload["community"]["status"] == "claim_pending"
    assert payload["community"]["statusLabel"] == "资料认领审核中"
    assert payload["community"]["points"] == 0
    assert len(community.claims) == 1

    claim = next(iter(community.claims.values()))
    claim.update({"status": "approved", "member": community.claim_member})
    refreshed = client.get("/api/v1/member/me", headers=auth(payload["token"]))
    assert refreshed.status_code == 200
    result = refreshed.get_json()
    assert result["community"] == {
        "memberId": 88,
        "name": "阿泽",
        "status": "joined",
        "statusLabel": "已入群",
        "points": 126,
    }
    assert result["membership"]["status"] == "member"
    assert result["membership"]["statusLabel"] == "观澜会员"

    repeated = client.get("/api/v1/member/me", headers=auth(payload["token"]))
    assert repeated.status_code == 200
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        count = conn.execute(
            "SELECT COUNT(*) FROM membership_ledger WHERE source_id='community-welcome:88'"
        ).fetchone()[0]
    assert count == 1


def test_existing_community_welcome_trial_is_formalized_without_renewal(client):
    response = client.post("/api/v1/auth/wechat", json={"code": "community-user", "phoneCode": "phone-code"})
    assert response.status_code == 200
    token = response.get_json()["token"]

    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        recorded_end = conn.execute(
            "SELECT new_ends_at FROM membership_ledger WHERE source_id='community-welcome:42'"
        ).fetchone()[0]
        conn.execute(
            "UPDATE users SET trial_ends_at=?, member_ends_at=NULL WHERE openid='openid-community-user'",
            (recorded_end,),
        )
        conn.commit()

    refreshed = client.get("/api/v1/member/me", headers=auth(token))
    assert refreshed.status_code == 200
    membership = refreshed.get_json()["membership"]
    assert membership["status"] == "member"
    assert membership["statusLabel"] == "观澜会员"
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        member_end = conn.execute(
            "SELECT member_ends_at FROM users WHERE openid='openid-community-user'"
        ).fetchone()[0]
        grant_count = conn.execute(
            "SELECT COUNT(*) FROM membership_ledger WHERE source_id='community-welcome:42'"
        ).fetchone()[0]
    assert member_end == recorded_end
    assert grant_count == 1


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
    assert payload["membership"]["remainingDays"] == 90

    repeated = client.post("/api/v1/auth/wechat", json={"code": "legacy-community", "phoneCode": "phone-code"}).get_json()
    assert repeated["membership"]["remainingDays"] == 90
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        grants = conn.execute("SELECT COUNT(*) FROM membership_ledger WHERE source_type='community_welcome'").fetchone()[0]
    assert grants == 1


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


def test_invalid_bearer_cannot_fall_back_to_anonymous_content_sample(client):
    response = client.get(
        "/api/v1/content/funding/round-a",
        headers={"Authorization": "Bearer invalid-token", "X-Visitor-ID": "visitor-invalid-bearer-12345"},
    )
    assert response.status_code == 401
    assert response.get_json()["error"]["code"] == "AUTH_INVALID"


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


def test_ios_virtual_refund_query_allows_paid_orders_within_fifteen_days(client):
    buyer = "ios-refund-buyer"
    token = login(client, buyer)
    created = client.post(
        "/api/v1/pay/virtual/orders",
        headers=auth(token),
        json={"planId": "monthly", "loginCode": buyer},
    ).get_json()
    client.get(f"/api/v1/pay/orders/{created['orderNo']}", headers=auth(token))
    client.application.virtual_pay_client.notification = {
        "event": "xpay_subscribe_ios_refund_query_notify",
        "pay_order_id": f"virtual-{created['orderNo']}",
        "product_id": "membership_30d",
    }

    response = client.post("/api/v1/pay/virtual/notify", data=b"signed")

    assert response.status_code == 200
    assert response.get_json() == {
        "result_code": 0,
        "result_info": "建议退款",
        "evidence": "订单支付后15天内，符合全额退款政策",
    }


def test_ios_virtual_refund_query_rejects_unknown_orders(client):
    client.application.virtual_pay_client.notification = {
        "Event": "xpay_subscribe_ios_refund_query_notify",
        "pay_order_id": "unknown",
        "product_id": "membership_30d",
    }

    response = client.post("/api/v1/pay/virtual/notify", data=b"signed")

    assert response.status_code == 200
    assert response.get_json()["result_code"] == 1
    assert response.get_json()["evidence"] == "未找到对应的虚拟支付订单"


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
    assert payload["membership"]["remainingDays"] == 90

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
    verified_phone = client.application.pay_client.exchange_phone_code("phone-applicant")["phoneNumber"]
    response = client.post("/api/v1/community/applications", headers=auth(token), json={
        "name": "新申请人", "phone": verified_phone, "wechat": "new_member",
        "city": "上海", "role": "Founder / 创业者", "industry": "企业服务",
        "skills": "产品与交付", "project": "AI 企业服务", "needs": "寻找客户",
        "direction": "企业 AI", "perspective": "从真实交付开始验证"
    })
    assert response.status_code == 201
    assert response.get_json()["community"]["status"] == "pending"
    assert client.application.community_client.applications[0]["source"] == "miniprogram"
