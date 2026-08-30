import copy
import sqlite3

from test_app import client, login, auth
from payment_service.community import CommunityServiceError


def linked(client):
    response = client.post("/api/v1/auth/wechat", json={"code": "community-user", "phoneCode": "phone-code"})
    assert response.status_code == 200
    return response.json["token"]


def test_gateway_never_accepts_client_member_id(client):
    calls = []
    client.application.community_client.hub = lambda path, **options: calls.append((path, options)) or {"members": []}
    assert client.get("/api/v1/community/directory?viewer=99").status_code == 401
    token = linked(client)
    result = client.get("/api/v1/community/directory?viewer=99", headers=auth(token))
    assert result.status_code == 200
    assert result.headers["Cache-Control"] == "private, no-store"
    assert calls[-1][1]["viewer"] == 42


def test_unlinked_user_cannot_read_full_archive(client):
    token = login(client)
    result = client.get("/api/v1/community/archives/issue-01", headers=auth(token))
    assert result.status_code == 403


def test_gateway_fail_closed_on_remote_revocation_and_outage(client):
    token = linked(client)
    def revoked(*args, **kwargs):
        raise CommunityServiceError("请先加入社群", 403)
    client.application.community_client.hub = revoked
    assert client.get("/api/v1/community/archives/issue-01", headers=auth(token)).status_code == 403
    def unavailable(*args, **kwargs):
        raise CommunityServiceError("服务暂不可用")
    client.application.community_client.hub = unavailable
    assert client.get("/api/v1/community/points", headers=auth(token)).status_code == 502


def test_typed_phone_cannot_claim_someone_elses_application(client):
    token = login(client, "attacker")
    result = client.post("/api/v1/community/applications", headers=auth(token), json={"phone": "13800138000"})
    assert result.status_code == 403
    assert client.application.community_client.applications == []


def test_leaderboard_adds_app_activity_without_counting_remote_import_twice(client):
    token = linked(client)
    payload = {"leaderboard": [{"memberId": 42, "name": "Current", "points": 860}, {"memberId": 43, "name": "Other", "points": 870}], "ledger": [{"id": "remote", "date": "2026-08-01", "title": "互动", "points": 860}], "selfId": 42}
    client.application.community_client.hub = lambda *args, **kwargs: copy.deepcopy(payload)
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        user_id = conn.execute("SELECT id FROM users WHERE community_member_id=42").fetchone()[0]
        conn.execute("UPDATE users SET point_lifetime=880,point_balance=580 WHERE id=?", (user_id,))
        conn.execute("INSERT INTO point_ledger(user_id,source_type,source_id,points,balance_after,lifetime_after,label,created_at) VALUES(?,?,?,?,?,?,?,?)", (user_id, "task", "test-task", 20, 580, 880, "活跃积分", "2026-08-30"))
    for _ in range(2):
        result = client.get("/api/v1/community/points", headers=auth(token))
        assert result.status_code == 200
        assert result.json["leaderboard"][0]["points"] == 880
        assert result.json["myPoints"] == 880
        assert result.json["myRank"] == 1
        assert len(result.json["ledger"]) == 2


def test_gateway_does_not_expose_admin_review_action(client):
    token = linked(client)
    assert client.post("/api/v1/community/cases/" + "a" * 24 + "/approve", headers=auth(token), json={}).status_code == 404


def test_management_grants_do_not_change_social_rank_or_ledger_or_wallet(client):
    token = linked(client)
    payload = {"leaderboard": [{"memberId": 42, "name": "Current", "points": 330}, {"memberId": 43, "name": "Other", "points": 400}], "ledger": [{"id": "remote", "date": "2026-08-01", "title": "社群互动", "points": 330}], "selfId": 42}
    client.application.community_client.hub = lambda *args, **kwargs: copy.deepcopy(payload)
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        user_id = conn.execute("SELECT id FROM users WHERE community_member_id=42").fetchone()[0]
        conn.execute("UPDATE users SET point_lifetime=50155,point_balance=50155 WHERE id=?", (user_id,))
        conn.execute("DELETE FROM point_ledger WHERE user_id=?", (user_id,))
        for kind, value, title in [("community_history", 330, "社群积分"), ("growth_task", 24, "正常互动"), ("admin_grant", 50001, "管理账号 L8 权限"), ("admin_grant", -200, "管理授分校正")]:
            conn.execute("INSERT INTO point_ledger(user_id,source_type,source_id,points,balance_after,lifetime_after,label,created_at) VALUES(?,?,?,?,?,?,?,?)", (user_id, kind, str(value), value, 50155, 50155, title, "2026-08-30"))
    for _ in range(2):
        result = client.get("/api/v1/community/points", headers=auth(token))
        assert result.status_code == 200
        assert result.json["myPoints"] == 354
        assert result.json["myRank"] == 2
        assert result.json["leaderboard"][0]["memberId"] == 43
        assert len(result.json["ledger"]) == 2
        assert all("管理" not in entry["title"] for entry in result.json["ledger"])
    with sqlite3.connect(client.application.config["DATABASE_PATH"]) as conn:
        assert conn.execute("SELECT point_lifetime,point_balance FROM users WHERE id=?", (user_id,)).fetchone() == (50155, 50155)
