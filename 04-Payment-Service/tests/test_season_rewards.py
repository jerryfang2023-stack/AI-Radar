from test_app import client, auth
from test_community_hub import linked
from test_member_operations import admin_login


def test_season_gateway_uses_member_identity_and_no_wallet(client):
    token = linked(client)
    calls = []
    client.application.community_client.hub = lambda path, **kwargs: calls.append((path, kwargs)) or {"myPoints": 12}
    response = client.get("/api/v1/community/season-points?season=season-2&viewer=99", headers=auth(token))
    assert response.json == {"myPoints": 12}
    assert calls[-1] == ("season-points", {"viewer": 42, "season": "season-2"})
    assert response.headers["Cache-Control"] == "private, no-store"
    assert client.get("/api/v1/community/token-benefits", headers=auth(token)).status_code == 200
    assert calls[-1][1]["viewer"] == 42
    assert client.get("/api/v1/community/season-points?season=../x", headers=auth(token)).status_code == 400
    assert client.get("/api/v1/community/token-benefits").status_code == 401


def test_token_ops_auth_csrf_and_server_actor(client):
    root = "/api/v1/admin/analytics/membership/token-benefits"
    calls = []
    client.application.community_client.operations_token_benefits = lambda *args: calls.append(args) or {"seasons": []}
    assert client.get(root).status_code == 401
    _, headers = admin_login(client)
    assert client.get(root, headers=headers).status_code == 200
    path = root + "/season-2/configure"
    assert client.post(path, headers={"Authorization": headers["Authorization"]}, json={}).status_code == 403
    assert client.post(path, headers=headers, json={"actorHash": "forged"}).status_code == 200
    assert calls[-1][2]["actorHash"] != "forged"
    assert client.post(path, headers=headers, json=[]).status_code == 400
    assert client.post(root + "/season-2/delete", headers=headers, json={}).status_code == 404
