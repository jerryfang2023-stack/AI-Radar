"""Authenticated gateway. The client never chooses its community member ID."""
from contextlib import closing
import re

from flask import g, jsonify, request


def register_routes(app, *, db, auth_required, user_by_id):
    def actor():
        with closing(db()) as conn:
            user = user_by_id(conn, g.user_id)
        return user["community_member_id"] if user else None

    def request_hub(path, method="GET", body=None):
        member_id = actor()
        if not member_id:
            return jsonify(error={"code": "COMMUNITY_REQUIRED", "message": "请先关联或加入社群"}), 403
        result = app.community_client.hub(path, viewer=member_id, method=method, payload=body)
        response = jsonify(result)
        response.headers["Cache-Control"] = "private, no-store"
        return response

    @app.get("/api/v1/community/home")
    def community_home():
        result = app.community_client.hub("home")
        response = jsonify(result)
        response.headers["Cache-Control"] = "no-store"
        return response

    @app.get("/api/v1/community/program")
    @auth_required
    def community_program():
        return request_hub("program")

    @app.get("/api/v1/community/archives/<slug>")
    @auth_required
    def community_archive(slug):
        if not re.fullmatch(r"issue-\d{2,4}", slug):
            return jsonify(error={"message": "实录不存在"}), 404
        return request_hub("archives/" + slug)

    @app.get("/api/v1/community/directory")
    @auth_required
    def community_directory():
        return request_hub("directory")

    @app.route("/api/v1/community/profile", methods=["GET", "PUT"])
    @auth_required
    def community_profile():
        return request_hub("profile", request.method, request.get_json(silent=True) if request.method == "PUT" else None)

    @app.get("/api/v1/community/points")
    @auth_required
    def community_points():
        member_id = actor()
        if not member_id:
            return jsonify(error={"code": "COMMUNITY_REQUIRED", "message": "请先加入社群"}), 403
        result = app.community_client.hub("points", viewer=member_id)
        # Remote points already contain every community activity and bounty award.
        # Management grants unlock account privileges; they are not social activity.
        # Exclude their net value from ranks and details without changing the wallet.
        with closing(db()) as conn:
            additions = {}
            for user in conn.execute("SELECT id,community_member_id,point_lifetime FROM users WHERE community_member_id IS NOT NULL AND merged_into_user_id IS NULL"):
                imported = conn.execute("SELECT COALESCE(SUM(points),0) FROM point_ledger WHERE user_id=? AND source_type='community_history'", (user["id"],)).fetchone()[0]
                management = conn.execute("SELECT COALESCE(SUM(points),0) FROM point_ledger WHERE user_id=? AND source_type='admin_grant'", (user["id"],)).fetchone()[0]
                additions[user["community_member_id"]] = additions.get(user["community_member_id"], 0) + max(0, int(user["point_lifetime"] or 0) - int(imported) - int(management))
            own_ledger = conn.execute("SELECT id,label,points,created_at FROM point_ledger WHERE user_id=? AND source_type NOT IN ('community_history','admin_grant') AND points>0 ORDER BY created_at DESC,id DESC", (g.user_id,)).fetchall()
        rows = result.get("leaderboard", [])
        for row in rows:
            row["points"] += additions.get(row["memberId"], 0)
            row["isMe"] = row["memberId"] == member_id
        rows.sort(key=lambda row: (-row["points"], row["memberId"]))
        previous, rank = None, 0
        for index, row in enumerate(rows, 1):
            if row["points"] != previous:
                rank, previous = index, row["points"]
            row["rank"] = rank
        result["ledger"] += [{"id": "app-" + str(row["id"]), "date": row["created_at"], "title": row["label"], "points": row["points"]} for row in own_ledger]
        result["ledger"].sort(key=lambda row: row["date"], reverse=True)
        result["myPoints"] = next((row["points"] for row in rows if row["isMe"]), sum(row["points"] for row in result["ledger"]))
        result["myRank"] = next((row["rank"] for row in rows if row["isMe"]), "—")
        response = jsonify(result)
        response.headers["Cache-Control"] = "private, no-store"
        return response

    @app.route("/api/v1/community/drafts/<key>", methods=["GET", "PUT"])
    @auth_required
    def community_draft(key):
        if key != "create" and not re.fullmatch(r"[a-f0-9]{24}", key):
            return jsonify(error={"message": "草稿不存在"}), 404
        return request_hub("drafts/" + key, request.method, request.get_json(silent=True) if request.method == "PUT" else None)

    @app.route("/api/v1/community/cases", methods=["GET", "POST"])
    @auth_required
    def community_cases():
        return request_hub("cases", request.method, request.get_json(silent=True) if request.method == "POST" else None)

    @app.get("/api/v1/community/cases/<case_id>")
    @auth_required
    def community_case(case_id):
        if not re.fullmatch(r"[a-f0-9]{24}", case_id):
            return jsonify(error={"message": "悬赏不存在"}), 404
        return request_hub("cases/" + case_id)

    @app.post("/api/v1/community/cases/<case_id>/<action>")
    @auth_required
    def community_case_action(case_id, action):
        if not re.fullmatch(r"[a-f0-9]{24}", case_id) or action not in {"answer", "join", "settle"}:
            return jsonify(error={"message": "操作不存在"}), 404
        return request_hub("cases/" + case_id + "/" + action, "POST", request.get_json(silent=True))
