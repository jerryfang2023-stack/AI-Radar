import json
import sqlite3
from datetime import datetime, timezone

from payment_service.member_operations import summarize
from test_app import client, login


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
