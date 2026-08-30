"""Allowlisted, read-only membership aggregates. Never serialize account rows."""
from contextlib import closing
from datetime import datetime, timedelta, timezone

from flask import jsonify, request

LOCAL = timezone(timedelta(hours=8))
VERSION = "MEMBER-OPS-V1.0"


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


def register(app, db, clock):
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
