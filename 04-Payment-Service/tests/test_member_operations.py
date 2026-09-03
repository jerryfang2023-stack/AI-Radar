import json
import sqlite3
from datetime import datetime, timezone

from payment_service.member_operations import summarize
from test_app import client, login


def admin_login(client, email="operator@example.com"):
    client.application.config["OPERATIONS_ADMIN_EMAILS"] = email
    created = client.post(
        "/api/v1/admin/auth/challenges",
        headers={"Origin": "https://jerryfang2023-stack.github.io"},
        json={"email": email},
    )
    assert created.status_code == 201
    assert created.headers["Access-Control-Allow-Origin"] == "https://jerryfang2023-stack.github.io"
    challenge = created.get_json()
    assert challenge["schemaVersion"] == "OPS-AUTH-V1.0"
    verified = client.post(
        f"/api/v1/admin/auth/challenges/{challenge['challengeId']}/verify",
        json={"code": challenge["testCode"]},
    )
    assert verified.status_code == 200
    session = verified.get_json()
    return session, {
        "Authorization": f"Bearer {session['sessionToken']}",
        "X-CSRF-Token": session["csrfToken"],
        "Origin": "https://jerryfang2023-stack.github.io",
    }


def test_membership_stock_orders_refunds_and_merged_accounts():
    conn = sqlite3.connect(":memory:")
    conn.row_factory = sqlite3.Row
    conn.executescript("""
        CREATE TABLE users(id, created_at, trial_ends_at, member_ends_at, point_balance, merged_into_user_id);
        CREATE TABLE payment_orders(id, user_id, plan_id, paid_at, status, refund_status);
        CREATE TABLE member_behavior_events(user_id, created_at);
        CREATE TABLE point_ledger(user_id, source_type, points, created_at);
        INSERT INTO users VALUES
          (1,'2026-08-01','2026-08-02','2026-09-01',500,NULL),
          (2,'2026-08-23T16:00:00Z','2026-09-02',NULL,0,NULL),
          (3,'2026-08-01','2026-08-02','2026-09-01',900,1),
          (4,'2026-08-01','2026-08-02','2026-08-30T00:00:00Z',10,NULL),
          (5,'2026-08-01','2026-08-02','2026-09-15',1000,NULL),
          (6,'2026-09-01','2026-09-02','2026-09-15',1000,NULL);
        INSERT INTO payment_orders VALUES
          (1,1,'annual','2026-08-05','PAID','NONE'),
          (2,1,'monthly','2026-08-25','PAID','NONE'),
          (3,2,'monthly','2026-08-26','REFUNDED','REFUNDED'),
          (4,3,'monthly','2026-08-26','PAID','NONE'),
          (5,4,'monthly','2026-08-26','PAID','REFUNDED'),
          (6,5,'annual','2026-08-25','PAID','NONE'),
          (7,5,'monthly','2026-09-01','PAID','NONE');
        INSERT INTO member_behavior_events VALUES (1,'2026-08-25'),(1,'2026-08-26'),(3,'2026-08-26'),(2,'2026-09-01');
        INSERT INTO point_ledger VALUES (1,'redemption',-300,'2026-08-25'),(1,'redemption',-1000,'2026-08-26'),(3,'redemption',-300,'2026-08-25'),(2,'checkin',5,'2026-08-25');
    """)
    now = datetime(2026, 8, 30, tzinfo=timezone.utc)
    conn.execute("PRAGMA query_only=ON")
    result = summarize(conn, now, 7)
    assert result["window"]["from"] == "2026-08-24T00:00:00+08:00"
    assert result["metrics"] == {"accounts": 4, "newAccounts": 1, "activeEntitlements": 2, "expiring7d": 1, "trialAccounts": 1, "engagedAccounts": 1, "firstPaidAccounts": 1, "repeatPaidAccounts": 1, "redemptions": 2, "redeemingAccounts": 1, "redeemedPoints": 1300, "offlineClaims": None}
    assert result["tiers"] == {"monthly": 1, "half_year": 0, "annual": 1, "other": 0}
    assert sum(result["pointBuckets"].values()) == 4
    assert "user_id" not in json.dumps(result)


def test_public_summary_readonly_cors_and_private_routes(client):
    login(client)
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        before = list(conn.iterdump())
    path = "/api/v1/analytics/membership/summary"
    response = client.get(path + "?days=30", headers={"Origin": "https://jerryfang2023-stack.github.io"})
    assert response.status_code == 200
    payload = response.get_json()
    assert payload["metrics"]["accounts"] == 1
    assert set(payload) == {"schemaVersion", "source", "generatedAt", "window", "metrics", "tiers", "pointBuckets", "dataSource"}
    for forbidden in ("openid", "phone", "nickname", "token", "order_no", "user_id"):
        assert forbidden not in response.get_data(as_text=True)
    assert response.headers["Cache-Control"] == "no-store"
    assert response.headers["Access-Control-Allow-Origin"] == "https://jerryfang2023-stack.github.io"
    assert "Access-Control-Allow-Credentials" not in response.headers
    assert "Access-Control-Allow-Origin" not in client.get(path, headers={"Origin": "https://evil.example"}).headers
    assert client.options(path).status_code == 200
    assert client.post(path).status_code == 405
    assert client.get(path + "?days=999").status_code == 400
    assert client.get("/api/v1/member/me").status_code == 401
    assert client.post("/api/v1/points/redeem", json={}).status_code == 401
    assert client.get("/api/v1/admin/analytics/summary").status_code in {401, 503}
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        assert list(conn.iterdump()) == before


def test_admin_can_list_search_and_adjust_mini_program_users(client):
    token = login(client, "ops-managed-user")
    assert token
    path = "/api/v1/admin/analytics/membership/users"
    assert client.get(path).status_code == 401
    client.application.config["ANALYTICS_ADMIN_TOKEN"] = "admin-test-token"
    assert client.get(path, headers={"Authorization": "Bearer admin-test-token"}).status_code == 503
    session, headers = admin_login(client)
    assert session["admin"]["emailMasked"] == "op***@example.com"

    listed = client.get(path + "?query=观澜用户&status=trial&page=1&pageSize=20", headers=headers)
    assert listed.status_code == 200
    assert listed.headers["Access-Control-Allow-Origin"] == headers["Origin"]
    assert listed.headers["Access-Control-Allow-Methods"] == "GET, POST, OPTIONS"
    payload = listed.get_json()
    assert payload["schemaVersion"] == "MEMBER-ADMIN-V1.0"
    assert payload["page"] == {"number": 1, "size": 20, "total": 1, "totalPages": 1}
    user = payload["users"][0]
    assert user["displayName"] == "观澜用户"
    assert user["phoneMasked"].startswith("139")
    assert user["membership"]["status"] == "trial"
    encoded = json.dumps(payload, ensure_ascii=False)
    for private in ("openid-ops-managed-user", "phone_hash", "identity_hash", "admin-test-token", session["sessionToken"]):
        assert private not in encoded

    user_id = user["id"]
    assert client.post(
        f"{path}/{user_id}/adjustments",
        headers={"Authorization": headers["Authorization"]},
        json={"operationId": "membership-adjust-csrf", "membershipDays": 30, "reason": "缺少安全凭证"},
    ).status_code == 403
    extended = client.post(
        f"{path}/{user_id}/adjustments", headers=headers,
        json={"operationId": "membership-adjust-0001", "membershipDays": 30, "reason": "客户补偿权益"},
    )
    assert extended.status_code == 200
    assert extended.get_json()["user"]["membership"]["status"] == "member"
    adjusted = client.post(
        f"{path}/{user_id}/adjustments", headers=headers,
        json={"operationId": "points-adjust-0001", "pointsDelta": 120, "reason": "线下活动奖励"},
    )
    assert adjusted.status_code == 200
    managed = adjusted.get_json()["user"]
    assert managed["points"]["balance"] == 120
    assert [item["action"] for item in managed["recentAdjustments"][:2]] == ["adjust_points", "extend_membership"]
    replayed = client.post(f"{path}/{user_id}/adjustments", headers=headers, json={"operationId": "points-adjust-0001", "pointsDelta": 120, "reason": "线下活动奖励"})
    assert replayed.status_code == 200 and replayed.get_json()["replayed"] is True
    assert client.post(f"{path}/{user_id}/adjustments", headers=headers, json={"operationId": "points-adjust-0002", "pointsDelta": -121, "reason": "错误扣减测试"}).status_code == 409
    assert client.post(f"{path}/{user_id}/adjustments", headers=headers, json={"operationId": "membership-adjust-0002", "membershipDays": 1, "reason": "无效权益"}).status_code == 400
    assert client.post(f"{path}/{user_id}/adjustments", headers=headers, json={"operationId": "points-adjust-0003", "pointsDelta": 1}).status_code == 400

    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        assert conn.execute("SELECT COUNT(*) FROM operations_admin_audits WHERE user_id=?", (user_id,)).fetchone()[0] == 2
        assert conn.execute("SELECT source_type, points FROM point_ledger WHERE user_id=? ORDER BY id DESC", (user_id,)).fetchone() == ("ops_admin_adjustment", 120)
        assert conn.execute("SELECT source_type, days FROM membership_ledger WHERE user_id=? ORDER BY id DESC", (user_id,)).fetchone() == ("ops_admin", 30)


def test_admin_membership_routes_reject_untrusted_origin_and_non_mini_account(client):
    _, headers = admin_login(client)
    path = "/api/v1/admin/analytics/membership/users"
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        now = datetime.now(timezone.utc).isoformat()
        conn.execute(
            "INSERT INTO users(openid, trial_started_at, trial_ends_at, created_at, updated_at) VALUES(?,?,?,?,?)",
            ("pc:private-account", now, now, now, now),
        )
        pc_id = conn.execute("SELECT last_insert_rowid()").fetchone()[0]
        conn.commit()
    assert client.get(path, headers=headers).get_json()["page"]["total"] == 0
    missing = client.post(f"{path}/{pc_id}/adjustments", headers=headers, json={"operationId": "points-adjust-pc01", "pointsDelta": 1, "reason": "不可操作"})
    assert missing.status_code == 404
    untrusted = client.get(path, headers={**headers, "Origin": "https://evil.example"})
    assert "Access-Control-Allow-Origin" not in untrusted.headers
    preflight = client.options(path, headers={"Origin": "https://jerryfang2023-stack.github.io"})
    assert preflight.status_code == 204
    assert preflight.headers["Access-Control-Allow-Methods"] == "GET, POST, OPTIONS"
    assert "X-CSRF-Token" in preflight.headers["Access-Control-Allow-Headers"]


def test_admin_email_challenge_session_and_logout_are_hardened(client):
    auth_path = "/api/v1/admin/auth/challenges"
    assert client.post(auth_path, json={"email": "operator@example.com"}).status_code == 503
    client.application.config["OPERATIONS_ADMIN_EMAILS"] = "operator@example.com"
    assert client.post(auth_path, json={"email": "attacker@example.com"}).status_code == 403
    locked = client.post(auth_path, json={"email": "operator@example.com"}).get_json()
    locked_path = f"{auth_path}/{locked['challengeId']}/verify"
    for _ in range(5):
        assert client.post(locked_path, json={"code": "invalid"}).status_code == 400
    assert client.post(locked_path, json={"code": locked["testCode"]}).status_code == 400
    created = client.post(auth_path, json={"email": "Operator@Example.com"})
    assert created.status_code == 201
    challenge = created.get_json()
    verify_path = f"{auth_path}/{challenge['challengeId']}/verify"
    assert client.post(verify_path, json={"code": "000000"}).status_code == 400
    verified = client.post(verify_path, json={"code": challenge["testCode"]})
    assert verified.status_code == 200
    session = verified.get_json()
    assert client.post(verify_path, json={"code": challenge["testCode"]}).status_code == 410
    auth = {"Authorization": f"Bearer {session['sessionToken']}"}
    assert client.get("/api/v1/admin/analytics/membership/users", headers=auth).status_code == 200
    assert client.post("/api/v1/admin/auth/logout", headers=auth).status_code == 403
    logged_out = client.post("/api/v1/admin/auth/logout", headers={**auth, "X-CSRF-Token": session["csrfToken"]})
    assert logged_out.status_code == 204
    assert client.get("/api/v1/admin/analytics/membership/users", headers=auth).status_code == 401
    assert client.post(auth_path, json={"email": "operator@example.com"}).status_code == 201
    assert client.post(auth_path, json={"email": "operator@example.com"}).status_code == 429
    assert "Access-Control-Allow-Origin" not in client.post(auth_path, headers={"Origin": "https://evil.example"}, json={"email": "operator@example.com"}).headers
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        dump = "\n".join(conn.iterdump())
    assert "operator@example.com" not in dump
    assert session["sessionToken"] not in dump
