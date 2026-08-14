import os
import math
import secrets
import sqlite3
from contextlib import closing
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

from flask import Flask, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from payment_service.wechatpay import WeChatPayClient, WeChatPayError


PLANS = {
    "monthly": {"title": "观澜月度会员", "total_cents": 3000, "days": 30},
    "half_year": {"title": "观澜半年会员", "total_cents": 16800, "days": 180},
    "annual": {"title": "观澜年度会员", "total_cents": 30000, "days": 365},
}


def utcnow():
    return datetime.now(timezone.utc)


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="seconds")


def create_app(test_config=None, *, pay_client=None):
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY=os.getenv("SECRET_KEY", ""),
        DATABASE_PATH=os.getenv("DATABASE_PATH", str(Path(__file__).parent / "data" / "payments.db")),
        WECHAT_APP_ID=os.getenv("WECHAT_APP_ID", "wx34133741173154d4"),
        WECHAT_APP_SECRET=os.getenv("WECHAT_APP_SECRET", ""),
        WECHAT_PAY_MCH_ID=os.getenv("WECHAT_PAY_MCH_ID", "1116466183"),
        WECHAT_PAY_MERCHANT_SERIAL=os.getenv("WECHAT_PAY_MERCHANT_SERIAL", ""),
        WECHAT_PAY_PRIVATE_KEY_PATH=os.getenv("WECHAT_PAY_PRIVATE_KEY_PATH", ""),
        WECHAT_PAY_PUBLIC_KEY_ID=os.getenv("WECHAT_PAY_PUBLIC_KEY_ID", ""),
        WECHAT_PAY_PUBLIC_KEY_PATH=os.getenv("WECHAT_PAY_PUBLIC_KEY_PATH", ""),
        WECHAT_PAY_API_V3_KEY=os.getenv("WECHAT_PAY_API_V3_KEY", ""),
        WECHAT_PAY_NOTIFY_URL=os.getenv("WECHAT_PAY_NOTIFY_URL", "https://www.zkdlj.vip/api/v1/pay/wechat/notify"),
        TOKEN_MAX_AGE=30 * 24 * 60 * 60,
        APP_ENV=os.getenv("APP_ENV", "development"),
    )
    if test_config:
        app.config.update(test_config)
    if not app.config["SECRET_KEY"]:
        if app.config["APP_ENV"] == "production":
            raise RuntimeError("SECRET_KEY is required in production")
        app.config["SECRET_KEY"] = secrets.token_urlsafe(32)

    Path(app.config["DATABASE_PATH"]).parent.mkdir(parents=True, exist_ok=True)
    app.pay_client = pay_client or WeChatPayClient(app.config)
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"], salt="wavesight-mini-user-v1")

    def db():
        connection = sqlite3.connect(app.config["DATABASE_PATH"], timeout=10)
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA busy_timeout=10000")
        connection.execute("PRAGMA foreign_keys=ON")
        return connection

    def init_db():
        with closing(db()) as conn:
            conn.execute("PRAGMA journal_mode=WAL")
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    openid TEXT NOT NULL UNIQUE,
                    unionid TEXT,
                    invite_code TEXT,
                    trial_started_at TEXT NOT NULL,
                    trial_ends_at TEXT NOT NULL,
                    member_ends_at TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS invite_visits (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    inviter_user_id INTEGER NOT NULL,
                    visitor_key TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    UNIQUE(inviter_user_id, visitor_key),
                    FOREIGN KEY(inviter_user_id) REFERENCES users(id)
                );
                CREATE TABLE IF NOT EXISTS invite_referrals (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    inviter_user_id INTEGER NOT NULL,
                    invited_user_id INTEGER NOT NULL UNIQUE,
                    reward_points INTEGER NOT NULL DEFAULT 300,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(inviter_user_id) REFERENCES users(id),
                    FOREIGN KEY(invited_user_id) REFERENCES users(id)
                );
                CREATE TABLE IF NOT EXISTS payment_orders (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    order_no TEXT NOT NULL UNIQUE,
                    user_id INTEGER NOT NULL,
                    plan_id TEXT NOT NULL,
                    description TEXT NOT NULL,
                    total_cents INTEGER NOT NULL,
                    status TEXT NOT NULL,
                    transaction_id TEXT UNIQUE,
                    paid_at TEXT,
                    raw_trade_state TEXT,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                );
                CREATE INDEX IF NOT EXISTS idx_payment_orders_user_created
                    ON payment_orders(user_id, created_at DESC);
                CREATE TABLE IF NOT EXISTS membership_ledger (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    source_type TEXT NOT NULL,
                    source_id TEXT NOT NULL UNIQUE,
                    days INTEGER NOT NULL,
                    previous_ends_at TEXT,
                    new_ends_at TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                );
                CREATE TABLE IF NOT EXISTS payment_notifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    notification_id TEXT NOT NULL UNIQUE,
                    order_no TEXT,
                    event_type TEXT NOT NULL,
                    created_at TEXT NOT NULL
                );
            """)
            columns = {row["name"] for row in conn.execute("PRAGMA table_info(users)")}
            if "invite_code" not in columns:
                conn.execute("ALTER TABLE users ADD COLUMN invite_code TEXT")
            conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code)")
            conn.commit()

    init_db()

    def membership(row):
        trial_end = datetime.fromisoformat(row["trial_ends_at"])
        member_end = datetime.fromisoformat(row["member_ends_at"]) if row["member_ends_at"] else None
        now = utcnow()
        active_end = max(value for value in [trial_end, member_end] if value is not None)
        is_member = member_end is not None and member_end > now
        is_trial = not is_member and trial_end > now
        return {
            "trialStartedAt": row["trial_started_at"],
            "trialEndsAt": row["trial_ends_at"],
            "memberEndsAt": row["member_ends_at"] or "",
            "status": "member" if is_member else "trial" if is_trial else "expired",
            "active": is_member or is_trial,
            "statusLabel": "观澜会员" if is_member else "7 天体验中" if is_trial else "体验已结束",
            "remainingDays": max(0, math.ceil((active_end - now).total_seconds() / 86400)),
            "activeUntil": active_end.date().isoformat(),
        }

    def user_by_id(conn, user_id):
        return conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()

    def token_for(user_id):
        return serializer.dumps({"user_id": user_id})

    def ensure_invite_code(conn, user):
        if user["invite_code"]:
            return user["invite_code"]
        while True:
            invite_code = secrets.token_urlsafe(8).replace("-", "").replace("_", "")[:10]
            try:
                conn.execute("UPDATE users SET invite_code=? WHERE id=?", (invite_code, user["id"]))
                return invite_code
            except sqlite3.IntegrityError:
                continue

    def invite_summary(conn, user):
        invite_code = ensure_invite_code(conn, user)
        invited_count = conn.execute(
            "SELECT COUNT(*) AS count FROM invite_visits WHERE inviter_user_id=?",
            (user["id"],),
        ).fetchone()["count"]
        successful = conn.execute(
            "SELECT COUNT(*) AS count, COALESCE(SUM(reward_points), 0) AS points FROM invite_referrals WHERE inviter_user_id=?",
            (user["id"],),
        ).fetchone()
        return {
            "inviteCode": invite_code,
            "invitedCount": invited_count,
            "successfulCount": successful["count"],
            "rewardPoints": successful["points"],
        }

    def auth_required(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            header = request.headers.get("Authorization", "")
            if not header.startswith("Bearer "):
                return jsonify(error={"code": "AUTH_REQUIRED", "message": "请先登录"}), 401
            try:
                payload = serializer.loads(header[7:], max_age=app.config["TOKEN_MAX_AGE"])
            except SignatureExpired:
                return jsonify(error={"code": "AUTH_EXPIRED", "message": "登录已过期，请重试"}), 401
            except BadSignature:
                return jsonify(error={"code": "AUTH_INVALID", "message": "登录状态无效"}), 401
            with closing(db()) as conn:
                user = user_by_id(conn, payload.get("user_id"))
            if not user:
                return jsonify(error={"code": "AUTH_INVALID", "message": "用户不存在"}), 401
            g.user_id = user["id"]
            g.openid = user["openid"]
            return fn(*args, **kwargs)
        return wrapped

    def fulfill_order(conn, order, transaction):
        if order["status"] == "PAID":
            return user_by_id(conn, order["user_id"])
        amount = transaction.get("amount") or {}
        payer = transaction.get("payer") or {}
        if transaction.get("appid") != app.config["WECHAT_APP_ID"] or transaction.get("mchid") != app.config["WECHAT_PAY_MCH_ID"]:
            raise WeChatPayError("支付商户信息不匹配", code="PAYMENT_ACCOUNT_MISMATCH", status=400)
        if transaction.get("out_trade_no") != order["order_no"] or amount.get("total") != order["total_cents"]:
            raise WeChatPayError("支付订单金额不匹配", code="PAYMENT_AMOUNT_MISMATCH", status=400)
        if payer.get("openid") and payer.get("openid") != conn.execute("SELECT openid FROM users WHERE id=?", (order["user_id"],)).fetchone()["openid"]:
            raise WeChatPayError("支付用户不匹配", code="PAYMENT_USER_MISMATCH", status=400)
        if transaction.get("trade_state") != "SUCCESS":
            return user_by_id(conn, order["user_id"])
        plan = PLANS[order["plan_id"]]
        user = user_by_id(conn, order["user_id"])
        now = utcnow()
        trial_end = datetime.fromisoformat(user["trial_ends_at"])
        member_end = datetime.fromisoformat(user["member_ends_at"]) if user["member_ends_at"] else now
        start = max(now, trial_end, member_end)
        new_end = start + timedelta(days=plan["days"])
        transaction_id = transaction.get("transaction_id") or f"query:{order['order_no']}"
        conn.execute(
            "UPDATE users SET member_ends_at=?, updated_at=? WHERE id=?",
            (iso(new_end), iso(now), user["id"]),
        )
        conn.execute(
            "UPDATE payment_orders SET status='PAID', transaction_id=?, paid_at=?, raw_trade_state='SUCCESS', updated_at=? WHERE id=?",
            (transaction_id, transaction.get("success_time") or iso(now), iso(now), order["id"]),
        )
        conn.execute(
            "INSERT OR IGNORE INTO membership_ledger(user_id, source_type, source_id, days, previous_ends_at, new_ends_at, created_at) VALUES(?,?,?,?,?,?,?)",
            (user["id"], "wechat_pay", order["order_no"], plan["days"], user["member_ends_at"], iso(new_end), iso(now)),
        )
        return user_by_id(conn, user["id"])

    @app.errorhandler(WeChatPayError)
    def handle_wechat_error(error):
        return jsonify(error={"code": error.code, "message": str(error)}), error.status

    @app.errorhandler(400)
    def handle_bad_request(error):
        return jsonify(error={"code": "BAD_REQUEST", "message": error.description or "请求参数错误"}), 400

    @app.get("/api/v1/health")
    def health():
        return jsonify(
            service="wavesight-payment-service",
            status="ok",
            paymentConfigured=app.pay_client.configured(),
            appId=app.config["WECHAT_APP_ID"],
            mchId=app.config["WECHAT_PAY_MCH_ID"],
        )

    @app.post("/api/v1/auth/wechat")
    def wechat_login():
        payload = request.get_json(silent=True) or {}
        code = str(payload.get("code") or "").strip()
        invite_code = str(payload.get("inviteCode") or "").strip()
        if not code or len(code) > 128:
            return jsonify(error={"code": "INVALID_CODE", "message": "微信登录凭证无效"}), 400
        if len(invite_code) > 32:
            return jsonify(error={"code": "INVALID_INVITE_CODE", "message": "邀请信息无效"}), 400
        result = app.pay_client.exchange_code(code)
        now = utcnow()
        with closing(db()) as conn:
            user = conn.execute("SELECT * FROM users WHERE openid=?", (result["openid"],)).fetchone()
            is_new_user = user is None
            invitation_accepted = False
            if not user:
                conn.execute(
                    "INSERT INTO users(openid, unionid, trial_started_at, trial_ends_at, created_at, updated_at) VALUES(?,?,?,?,?,?)",
                    (result["openid"], result.get("unionid"), iso(now), iso(now + timedelta(days=7)), iso(now), iso(now)),
                )
                conn.commit()
                user = conn.execute("SELECT * FROM users WHERE openid=?", (result["openid"],)).fetchone()
                inviter = conn.execute("SELECT * FROM users WHERE invite_code=?", (invite_code,)).fetchone() if invite_code else None
                if inviter and inviter["id"] != user["id"]:
                    before = conn.total_changes
                    conn.execute(
                        "INSERT OR IGNORE INTO invite_referrals(inviter_user_id, invited_user_id, reward_points, created_at) VALUES(?,?,300,?)",
                        (inviter["id"], user["id"], iso(now)),
                    )
                    invitation_accepted = conn.total_changes > before
            own_invite_code = ensure_invite_code(conn, user)
            conn.commit()
            return jsonify(
                token=token_for(user["id"]),
                membership=membership(user),
                isNewUser=is_new_user,
                invitationAccepted=invitation_accepted,
                inviteCode=own_invite_code,
            )

    @app.get("/api/v1/member/me")
    @auth_required
    def member_me():
        with closing(db()) as conn:
            return jsonify(membership=membership(user_by_id(conn, g.user_id)))

    @app.post("/api/v1/invites/visit")
    def record_invite_visit():
        payload = request.get_json(silent=True) or {}
        invite_code = str(payload.get("inviteCode") or "").strip()
        visitor_key = str(payload.get("visitorKey") or "").strip()
        if not invite_code or not visitor_key or len(invite_code) > 32 or len(visitor_key) > 128:
            return jsonify(error={"code": "INVALID_INVITE_VISIT", "message": "邀请访问参数无效"}), 400
        with closing(db()) as conn:
            inviter = conn.execute("SELECT * FROM users WHERE invite_code=?", (invite_code,)).fetchone()
            if not inviter:
                return jsonify(recorded=False), 200
            before = conn.total_changes
            conn.execute(
                "INSERT OR IGNORE INTO invite_visits(inviter_user_id, visitor_key, created_at) VALUES(?,?,?)",
                (inviter["id"], visitor_key, iso(utcnow())),
            )
            recorded = conn.total_changes > before
            conn.commit()
            return jsonify(recorded=recorded), 201 if recorded else 200

    @app.get("/api/v1/invites/me")
    @auth_required
    def my_invites():
        with closing(db()) as conn:
            user = user_by_id(conn, g.user_id)
            summary = invite_summary(conn, user)
            conn.commit()
            return jsonify(summary=summary)

    @app.post("/api/v1/pay/wechat/orders")
    @auth_required
    def create_payment_order():
        payload = request.get_json(silent=True) or {}
        plan_id = str(payload.get("planId") or "")
        if plan_id not in PLANS:
            return jsonify(error={"code": "INVALID_PLAN", "message": "会员套餐不存在"}), 400
        plan = PLANS[plan_id]
        now = utcnow()
        order_no = f"GL{now.strftime('%Y%m%d%H%M%S')}{secrets.token_hex(5).upper()}"
        with closing(db()) as conn:
            conn.execute(
                "INSERT INTO payment_orders(order_no, user_id, plan_id, description, total_cents, status, created_at, updated_at) VALUES(?,?,?,?,?,'PENDING',?,?)",
                (order_no, g.user_id, plan_id, plan["title"], plan["total_cents"], iso(now), iso(now)),
            )
            conn.commit()
        try:
            payment = app.pay_client.create_jsapi_order(
                order_no=order_no,
                description=plan["title"],
                total_cents=plan["total_cents"],
                openid=g.openid,
                client_ip=request.headers.get("X-Forwarded-For", request.remote_addr or "127.0.0.1").split(",")[0].strip(),
            )
        except Exception:
            with closing(db()) as conn:
                conn.execute("UPDATE payment_orders SET status='CREATE_FAILED', updated_at=? WHERE order_no=?", (iso(utcnow()), order_no))
                conn.commit()
            raise
        return jsonify(orderNo=order_no, plan={"id": plan_id, "title": plan["title"], "totalCents": plan["total_cents"], "days": plan["days"]}, payment=payment), 201

    @app.get("/api/v1/pay/orders/<order_no>")
    @auth_required
    def payment_order(order_no):
        with closing(db()) as conn:
            order = conn.execute("SELECT * FROM payment_orders WHERE order_no=? AND user_id=?", (order_no, g.user_id)).fetchone()
            if not order:
                return jsonify(error={"code": "ORDER_NOT_FOUND", "message": "订单不存在"}), 404
            if order["status"] == "PENDING":
                transaction = app.pay_client.query_order(order_no)
                conn.execute("BEGIN IMMEDIATE")
                fresh = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
                if transaction.get("trade_state") == "SUCCESS":
                    fulfill_order(conn, fresh, transaction)
                elif transaction.get("trade_state") in {"CLOSED", "REVOKED", "PAYERROR"}:
                    conn.execute("UPDATE payment_orders SET status=?, raw_trade_state=?, updated_at=? WHERE id=?", (transaction["trade_state"], transaction["trade_state"], iso(utcnow()), order["id"]))
                conn.commit()
                order = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
            user = user_by_id(conn, g.user_id)
            return jsonify(order={"orderNo": order["order_no"], "status": order["status"], "planId": order["plan_id"], "totalCents": order["total_cents"]}, membership=membership(user))

    @app.post("/api/v1/pay/wechat/notify")
    def payment_notification():
        raw_body = request.get_data(cache=False)
        notification, transaction = app.pay_client.parse_notification(request.headers, raw_body)
        notification_id = notification.get("id")
        order_no = transaction.get("out_trade_no")
        if not notification_id or not order_no:
            return jsonify(error={"code": "INVALID_NOTIFICATION", "message": "支付通知缺少必要字段"}), 400
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            known = conn.execute("SELECT id FROM payment_notifications WHERE notification_id=?", (notification_id,)).fetchone()
            if known:
                conn.rollback()
                return "", 204
            order = conn.execute("SELECT * FROM payment_orders WHERE order_no=?", (order_no,)).fetchone()
            if not order:
                conn.rollback()
                return jsonify(error={"code": "ORDER_NOT_FOUND", "message": "订单不存在"}), 404
            fulfill_order(conn, order, transaction)
            conn.execute(
                "INSERT INTO payment_notifications(notification_id, order_no, event_type, created_at) VALUES(?,?,?,?)",
                (notification_id, order_no, notification.get("event_type") or "UNKNOWN", iso(utcnow())),
            )
            conn.commit()
        return "", 204

    return app


app = create_app()
