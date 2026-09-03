"""Membership aggregates plus authenticated Mini Program account operations."""
from contextlib import closing
from datetime import datetime, timedelta, timezone
import hashlib
import json
import math

from flask import jsonify, request

LOCAL = timezone(timedelta(hours=8))
VERSION = "MEMBER-OPS-V1.0"
ADMIN_VERSION = "MEMBER-ADMIN-V1.0"
ADMIN_DAYS = {7, 30, 90, 180, 365}


def parsed(value):
    try:
        result = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        return result.replace(tzinfo=timezone.utc) if result.tzinfo is None else result
    except (TypeError, ValueError):
        return None


def summarize(conn, now, days):
    start = datetime.combine(now.astimezone(LOCAL).date() - timedelta(days=days - 1), datetime.min.time(), LOCAL)
    in_window = lambda value: (stamp := parsed(value)) is not None and start <= stamp <= now
    users = conn.execute("SELECT id, created_at, trial_ends_at, member_ends_at, point_balance FROM users WHERE merged_into_user_id IS NULL").fetchall()
    users = [row for row in users if (stamp := parsed(row["created_at"])) and stamp <= now]
    ids = {row["id"] for row in users}
    orders = {}
    for row in conn.execute("SELECT user_id, plan_id, paid_at FROM payment_orders WHERE status='PAID' AND refund_status!='REFUNDED' ORDER BY paid_at, id"):
        if row["user_id"] in ids and (stamp := parsed(row["paid_at"])) and stamp <= now:
            orders.setdefault(row["user_id"], []).append(row)
    # Sort parsed instants: legacy records may mix UTC and +08:00 strings.
    for rows in orders.values():
        rows.sort(key=lambda row: parsed(row["paid_at"]))
    active = {row["id"] for row in users if (end := parsed(row["member_ends_at"])) and end > now}
    expiring = sum(1 for row in users if row["id"] in active and parsed(row["member_ends_at"]) <= now + timedelta(days=7))
    trial = sum(1 for row in users if row["id"] not in active and (end := parsed(row["trial_ends_at"])) and end > now)
    engaged = {row["user_id"] for row in conn.execute("SELECT user_id, created_at FROM member_behavior_events") if row["user_id"] in ids and in_window(row["created_at"])}
    redeemed = [row for row in conn.execute("SELECT user_id, points, created_at FROM point_ledger WHERE source_type='redemption' AND points<0") if row["user_id"] in ids and in_window(row["created_at"])]
    tiers = {key: 0 for key in ("monthly", "half_year", "annual", "other")}
    for user_id in active:
        plan = orders[user_id][-1]["plan_id"] if user_id in orders else "other"
        tiers[plan if plan in tiers else "other"] += 1
    balances = [max(0, row["point_balance"] or 0) for row in users]
    return {
        "schemaVersion": VERSION, "source": "application", "generatedAt": now.isoformat(),
        "window": {"days": days, "from": start.isoformat(), "to": now.isoformat(), "timezone": "Asia/Shanghai"},
        "metrics": {
            "accounts": len(users), "newAccounts": sum(in_window(row["created_at"]) for row in users),
            "activeEntitlements": len(active), "expiring7d": expiring, "trialAccounts": trial,
            "engagedAccounts": len(engaged),
            "firstPaidAccounts": sum(in_window(rows[0]["paid_at"]) for rows in orders.values()),
            "repeatPaidAccounts": sum(any(in_window(row["paid_at"]) for row in rows[1:]) for rows in orders.values()),
            "redemptions": len(redeemed), "redeemingAccounts": len({row["user_id"] for row in redeemed}),
            "redeemedPoints": sum(-row["points"] for row in redeemed), "offlineClaims": None,
        },
        "tiers": tiers,
        "pointBuckets": {"zero": sum(v == 0 for v in balances), "low": sum(0 < v < 300 for v in balances), "mid": sum(300 <= v < 1000 for v in balances), "high": sum(v >= 1000 for v in balances)},
    }


def init_admin_schema(conn):
    conn.execute("""
        CREATE TABLE IF NOT EXISTS operations_admin_audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            operation_id TEXT NOT NULL UNIQUE,
            actor_hash TEXT NOT NULL,
            action TEXT NOT NULL,
            reason TEXT NOT NULL,
            before_json TEXT NOT NULL,
            after_json TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    """)
    conn.execute("CREATE INDEX IF NOT EXISTS idx_operations_admin_audits_user ON operations_admin_audits(user_id, created_at DESC)")


def status_for(user, now):
    member_end = parsed(user["member_ends_at"])
    trial_end = parsed(user["trial_ends_at"])
    if member_end and member_end > now:
        return "member", member_end
    if trial_end and trial_end > now:
        return "trial", trial_end
    return "expired", max((value for value in (member_end, trial_end) if value), default=None)


def admin_user(conn, user, now):
    membership_status, active_until = status_for(user, now)
    payment = conn.execute(
        """SELECT COUNT(*) AS paid_orders, COALESCE(SUM(total_cents),0) AS paid_cents, MAX(paid_at) AS last_paid_at
           FROM payment_orders WHERE user_id=? AND status='PAID' AND refund_status!='REFUNDED'""",
        (user["id"],),
    ).fetchone()
    last_behavior = conn.execute("SELECT MAX(created_at) FROM member_behavior_events WHERE user_id=?", (user["id"],)).fetchone()[0]
    adjustments = conn.execute(
        "SELECT action, reason, before_json, after_json, created_at FROM operations_admin_audits WHERE user_id=? ORDER BY created_at DESC, id DESC LIMIT 5",
        (user["id"],),
    ).fetchall()
    return {
        "id": int(user["id"]),
        "displayName": user["nickname"] or user["community_name"] or f"用户 {user['id']}",
        "phoneMasked": user["phone_masked"] or "未绑定",
        "community": {"name": user["community_name"] or "", "status": user["community_status"] or "none"},
        "membership": {
            "status": membership_status,
            "trialEndsAt": user["trial_ends_at"], "memberEndsAt": user["member_ends_at"] or "",
            "activeUntil": active_until.isoformat() if active_until else "",
        },
        "points": {"balance": int(user["point_balance"] or 0), "lifetime": int(user["point_lifetime"] or 0), "community": int(user["community_points"] or 0)},
        "payment": {"paidOrders": int(payment["paid_orders"] or 0), "paidCents": int(payment["paid_cents"] or 0), "lastPaidAt": payment["last_paid_at"] or ""},
        "activity": {"lastBehaviorAt": last_behavior or ""},
        "createdAt": user["created_at"], "updatedAt": user["updated_at"],
        "recentAdjustments": [{
            "action": row["action"], "reason": row["reason"], "before": json.loads(row["before_json"]),
            "after": json.loads(row["after_json"]), "createdAt": row["created_at"],
        } for row in adjustments],
    }


def register(app, db, clock, admin_required=None):
    with closing(db()) as conn:
        init_admin_schema(conn)
        conn.commit()

    @app.get("/api/v1/analytics/membership/summary")
    def membership_operations_summary():
        raw_days = request.args.get("days", "30")
        if raw_days not in {"7", "30", "90"}:
            return jsonify(error={"code": "INVALID_DAYS"}), 400
        with closing(db()) as conn:
            conn.execute("PRAGMA query_only=ON")
            conn.execute("BEGIN")
            result = summarize(conn, clock(), int(raw_days))
        result["dataSource"] = "production" if app.config.get("APP_ENV") == "production" else "test"
        return jsonify(result)

    if admin_required is None:
        return

    def mini_program_user(conn, user_id):
        return conn.execute(
            """SELECT * FROM users WHERE id=? AND merged_into_user_id IS NULL
               AND EXISTS (SELECT 1 FROM user_identities i WHERE i.user_id=users.id AND i.identity_type='wechat_openid')""",
            (user_id,),
        ).fetchone()

    @app.get("/api/v1/admin/analytics/membership/users")
    @admin_required
    def membership_admin_users():
        query = str(request.args.get("query") or "").strip().casefold()[:80]
        wanted_status = str(request.args.get("status") or "all")
        if wanted_status not in {"all", "member", "trial", "expired"}:
            return jsonify(error={"code": "INVALID_STATUS", "message": "权益筛选无效"}), 400
        try:
            page = max(1, int(request.args.get("page", "1")))
            page_size = min(50, max(10, int(request.args.get("pageSize", "20"))))
        except ValueError:
            return jsonify(error={"code": "INVALID_PAGE", "message": "分页参数无效"}), 400
        now = clock()
        with closing(db()) as conn:
            conn.execute("PRAGMA query_only=ON")
            rows = conn.execute(
                """SELECT * FROM users WHERE merged_into_user_id IS NULL
                   AND EXISTS (SELECT 1 FROM user_identities i WHERE i.user_id=users.id AND i.identity_type='wechat_openid')
                   ORDER BY updated_at DESC, id DESC"""
            ).fetchall()
            filtered = []
            for row in rows:
                state, _ = status_for(row, now)
                searchable = " ".join((str(row["id"]), row["nickname"] or "", row["phone_masked"] or "", row["community_name"] or "")).casefold()
                if (not query or query in searchable) and (wanted_status == "all" or state == wanted_status):
                    filtered.append(row)
            total = len(filtered)
            start = (page - 1) * page_size
            users = [admin_user(conn, row, now) for row in filtered[start:start + page_size]]
        return jsonify(
            schemaVersion=ADMIN_VERSION, dataSource="production" if app.config.get("APP_ENV") == "production" else "test",
            generatedAt=now.isoformat(), filters={"query": query, "status": wanted_status},
            page={"number": page, "size": page_size, "total": total, "totalPages": max(1, math.ceil(total / page_size))}, users=users,
        )

    @app.post("/api/v1/admin/analytics/membership/users/<int:user_id>/adjustments")
    @admin_required
    def membership_admin_adjust(user_id):
        payload = request.get_json(silent=True) or {}
        reason = str(payload.get("reason") or "").strip()
        operation_id = str(payload.get("operationId") or "").strip()
        if not 12 <= len(operation_id) <= 80 or not all(character.isalnum() or character in "_-" for character in operation_id):
            return jsonify(error={"code": "INVALID_OPERATION_ID", "message": "操作标识无效"}), 400
        if len(reason) < 2 or len(reason) > 120:
            return jsonify(error={"code": "INVALID_REASON", "message": "请填写 2—120 字的调整原因"}), 400
        has_days, has_points = "membershipDays" in payload, "pointsDelta" in payload
        if has_days == has_points:
            return jsonify(error={"code": "INVALID_ADJUSTMENT", "message": "每次只能调整一种项目"}), 400
        now = clock()
        now_text = now.astimezone(timezone.utc).isoformat(timespec="seconds")
        actor = request.headers.get("Authorization", "")[7:]
        actor_hash = hashlib.sha256(actor.encode("utf-8")).hexdigest()[:16]
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            user = mini_program_user(conn, user_id)
            if not user:
                conn.rollback()
                return jsonify(error={"code": "USER_NOT_FOUND", "message": "小程序用户不存在或已合并"}), 404
            existing_operation = conn.execute("SELECT user_id FROM operations_admin_audits WHERE operation_id=?", (operation_id,)).fetchone()
            if existing_operation:
                conn.rollback()
                if int(existing_operation["user_id"]) != user_id:
                    return jsonify(error={"code": "OPERATION_ID_CONFLICT", "message": "操作标识已被使用"}), 409
                return jsonify(schemaVersion=ADMIN_VERSION, replayed=True, user=admin_user(conn, user, now))
            source_id = f"ops-admin:{operation_id}"
            if has_days:
                try:
                    days = int(payload["membershipDays"])
                except (TypeError, ValueError):
                    days = 0
                if days not in ADMIN_DAYS:
                    conn.rollback()
                    return jsonify(error={"code": "INVALID_MEMBERSHIP_DAYS", "message": "权益天数无效"}), 400
                previous = user["member_ends_at"] or ""
                base = max((value for value in (now, parsed(user["trial_ends_at"]), parsed(user["member_ends_at"])) if value), default=now)
                new_end = base + timedelta(days=days)
                new_text = new_end.astimezone(timezone.utc).isoformat(timespec="seconds")
                conn.execute("UPDATE users SET member_ends_at=?, updated_at=? WHERE id=?", (new_text, now_text, user_id))
                conn.execute(
                    "INSERT INTO membership_ledger(user_id, source_type, source_id, days, previous_ends_at, new_ends_at, created_at) VALUES(?,?,?,?,?,?,?)",
                    (user_id, "ops_admin", source_id, days, previous or None, new_text, now_text),
                )
                action, before, after = "extend_membership", {"memberEndsAt": previous}, {"memberEndsAt": new_text, "days": days}
            else:
                try:
                    delta = int(payload["pointsDelta"])
                except (TypeError, ValueError):
                    delta = 0
                if delta == 0 or abs(delta) > 100000:
                    conn.rollback()
                    return jsonify(error={"code": "INVALID_POINTS_DELTA", "message": "积分调整须为 ±1—100000 的整数"}), 400
                previous = int(user["point_balance"] or 0)
                next_balance = previous + delta
                if next_balance < 0:
                    conn.rollback()
                    return jsonify(error={"code": "INSUFFICIENT_POINTS", "message": "扣减后可用积分不能小于零"}), 409
                lifetime = int(user["point_lifetime"] or 0)
                conn.execute("UPDATE users SET point_balance=?, updated_at=? WHERE id=?", (next_balance, now_text, user_id))
                conn.execute(
                    "INSERT INTO point_ledger(user_id, source_type, source_id, points, balance_after, lifetime_after, label, created_at) VALUES(?,?,?,?,?,?,?,?)",
                    (user_id, "ops_admin_adjustment", source_id, delta, next_balance, lifetime, f"运营调整：{reason}", now_text),
                )
                action, before, after = "adjust_points", {"pointBalance": previous}, {"pointBalance": next_balance, "delta": delta}
            conn.execute(
                "INSERT INTO operations_admin_audits(user_id, operation_id, actor_hash, action, reason, before_json, after_json, created_at) VALUES(?,?,?,?,?,?,?,?)",
                (user_id, operation_id, actor_hash, action, reason, json.dumps(before, separators=(",", ":")), json.dumps(after, separators=(",", ":")), now_text),
            )
            conn.commit()
            updated = mini_program_user(conn, user_id)
            result = admin_user(conn, updated, now)
        return jsonify(schemaVersion=ADMIN_VERSION, user=result)
