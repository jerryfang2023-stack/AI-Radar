import os
import math
import re
import secrets
import sqlite3
import hashlib
import hmac
from contextlib import closing
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

from flask import Flask, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from payment_service.wechatpay import WeChatPayClient, WeChatPayError
from payment_service.community import CommunityClient, CommunityServiceError


PLANS = {
    "monthly": {"title": "观澜月度会员", "total_cents": 3000, "days": 30},
    "half_year": {"title": "观澜半年会员", "total_cents": 16800, "days": 180},
    "annual": {"title": "观澜年度会员", "total_cents": 30000, "days": 365},
}

POINT_BENEFITS = {
    "membership_7d": {"title": "7 天会员权益", "cost": 300, "days": 7},
    "membership_30d": {"title": "30 天会员权益", "cost": 1000, "days": 30},
}

POINT_TASKS = {
    "checkin": {"title": "每日签到", "target": 1, "reward": 5},
    "browse": {"title": "每日阅读 5 条情报", "target": 5, "reward": 2},
    "favorite": {"title": "收藏 1 条情报", "target": 1, "reward": 3},
}


def utcnow():
    return datetime.now(timezone.utc)


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="seconds")


def create_app(test_config=None, *, pay_client=None, community_client=None):
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
        COMMUNITY_SERVICE_URL=os.getenv("COMMUNITY_SERVICE_URL", "http://127.0.0.1:8000"),
        COMMUNITY_SERVICE_TOKEN=os.getenv("COMMUNITY_SERVICE_TOKEN", ""),
    )
    if test_config:
        app.config.update(test_config)
    if not app.config["SECRET_KEY"]:
        if app.config["APP_ENV"] == "production":
            raise RuntimeError("SECRET_KEY is required in production")
        app.config["SECRET_KEY"] = secrets.token_urlsafe(32)

    Path(app.config["DATABASE_PATH"]).parent.mkdir(parents=True, exist_ok=True)
    app.pay_client = pay_client or WeChatPayClient(app.config)
    app.community_client = community_client or CommunityClient(app.config)
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
                    phone_hash TEXT,
                    phone_masked TEXT,
                    phone_bound_at TEXT,
                    nickname TEXT,
                    avatar_selected_at TEXT,
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
                CREATE TABLE IF NOT EXISTS point_ledger (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    source_type TEXT NOT NULL,
                    source_id TEXT NOT NULL UNIQUE,
                    points INTEGER NOT NULL,
                    balance_after INTEGER NOT NULL,
                    lifetime_after INTEGER NOT NULL,
                    label TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                );
                CREATE TABLE IF NOT EXISTS member_behavior_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    behavior_date TEXT NOT NULL,
                    behavior_type TEXT NOT NULL,
                    subject_id TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    UNIQUE(user_id, behavior_date, behavior_type, subject_id),
                    FOREIGN KEY(user_id) REFERENCES users(id)
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
            user_columns = {row[1] for row in conn.execute("PRAGMA table_info(users)").fetchall()}
            for name, definition in {
                "invite_code": "TEXT",
                "phone_hash": "TEXT",
                "phone_masked": "TEXT",
                "phone_bound_at": "TEXT",
                "nickname": "TEXT",
                "avatar_selected_at": "TEXT",
                "community_member_id": "INTEGER",
                "community_name": "TEXT",
                "community_status": "TEXT NOT NULL DEFAULT 'none'",
                "community_points": "INTEGER NOT NULL DEFAULT 0",
                "community_balance_deficit": "INTEGER NOT NULL DEFAULT 0",
                "point_balance": "INTEGER NOT NULL DEFAULT 0",
                "point_lifetime": "INTEGER NOT NULL DEFAULT 0",
            }.items():
                if name not in user_columns:
                    conn.execute(f"ALTER TABLE users ADD COLUMN {name} {definition}")
            conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code)")
            conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_hash ON users(phone_hash)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_users_community_member ON users(community_member_id)")
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

    def wallet(row):
        return {"balance": int(row["point_balance"] or 0), "lifetime": int(row["point_lifetime"] or 0)}

    def community_snapshot(row):
        raw_status = row["community_status"] or "none"
        status = "joined" if raw_status == "approved" else raw_status
        labels = {"joined": "已入群", "pending": "审核中", "candidate": "候补", "rejected": "暂未通过", "none": "未入群"}
        return {
            "memberId": row["community_member_id"],
            "name": row["community_name"] or "",
            "status": status,
            "statusLabel": labels.get(status, "申请状态"),
            "points": int(row["community_points"] or 0) if status == "joined" else 0,
        }

    def public_profile(row):
        return {
            "phoneMasked": row["phone_masked"] or "",
            "nickname": row["nickname"] or "",
            "avatarSelected": bool(row["avatar_selected_at"]),
        }

    def mask_phone(phone_number):
        value = "".join(character for character in str(phone_number) if character.isdigit())
        if len(value) < 7:
            return ""
        return f"{value[:3]}****{value[-4:]}"

    def phone_digest(phone_number):
        return hmac.new(
            app.config["SECRET_KEY"].encode("utf-8"),
            str(phone_number).encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

    def import_community_points(conn, user, member):
        points = max(0, int(member.get("points") or 0))
        source_id = f"community-history:{int(member['id'])}"
        existing = conn.execute("SELECT id, points FROM point_ledger WHERE source_id=?", (source_id,)).fetchone()
        previous_current = max(0, int(user["community_points"] or 0))
        credited_high_water = max(0, int(existing["points"] or 0)) if existing else 0
        balance_delta = points - previous_current
        lifetime_delta = max(0, points - credited_high_water)
        balance = max(0, int(user["point_balance"] or 0))
        deficit = max(0, int(user["community_balance_deficit"] or 0))
        if balance_delta < 0:
            reduction = -balance_delta
            absorbed = min(balance, reduction)
            balance -= absorbed
            deficit += reduction - absorbed
        elif balance_delta > 0:
            repaid = min(deficit, balance_delta)
            deficit -= repaid
            balance += balance_delta - repaid
        lifetime = max(0, int(user["point_lifetime"] or 0) + lifetime_delta)
        next_high_water = max(credited_high_water, points)
        now = iso(utcnow())
        conn.execute(
            "UPDATE users SET community_points=?, community_balance_deficit=?, point_balance=?, point_lifetime=?, updated_at=? WHERE id=?",
            (points, deficit, balance, lifetime, now, user["id"]),
        )
        if existing:
            conn.execute(
                "UPDATE point_ledger SET points=?, balance_after=?, lifetime_after=? WHERE id=?",
                (next_high_water, balance, lifetime, existing["id"]),
            )
        elif points:
            conn.execute(
                "INSERT INTO point_ledger(user_id, source_type, source_id, points, balance_after, lifetime_after, label, created_at) VALUES(?,?,?,?,?,?,?,?)",
                (user["id"], "community_history", source_id, points, balance, lifetime, "社群历史积分", now),
            )

    def extend_member_days(conn, user, days, source_type, source_id):
        now = utcnow()
        trial_end = datetime.fromisoformat(user["trial_ends_at"])
        member_end = datetime.fromisoformat(user["member_ends_at"]) if user["member_ends_at"] else now
        start = max(now, trial_end, member_end)
        new_end = start + timedelta(days=days)
        conn.execute("UPDATE users SET member_ends_at=?, updated_at=? WHERE id=?", (iso(new_end), iso(now), user["id"]))
        conn.execute(
            "INSERT OR IGNORE INTO membership_ledger(user_id, source_type, source_id, days, previous_ends_at, new_ends_at, created_at) VALUES(?,?,?,?,?,?,?)",
            (user["id"], source_type, source_id, days, user["member_ends_at"], iso(new_end), iso(now)),
        )
        return user_by_id(conn, user["id"])

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

    def user_by_id(conn, user_id):
        return conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()

    def token_for(user_id):
        return serializer.dumps({"user_id": user_id})

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

    @app.errorhandler(CommunityServiceError)
    def handle_community_error(error):
        return jsonify(error={"code": "COMMUNITY_SERVICE_ERROR", "message": str(error)}), 502

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
        phone_code = str(payload.get("phoneCode") or "").strip()
        nickname = str(payload.get("nickname") or "").strip()
        avatar_selected = payload.get("avatarSelected") is True
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
            if not user and result.get("unionid"):
                user = conn.execute("SELECT * FROM users WHERE unionid=?", (result["unionid"],)).fetchone()
                if user:
                    conn.execute("UPDATE users SET openid=?, updated_at=? WHERE id=?", (result["openid"], iso(now), user["id"]))
                    conn.commit()
                    user = user_by_id(conn, user["id"])
            is_new_user = user is None
            if not user:
                if not phone_code:
                    return jsonify(error={
                        "code": "REGISTRATION_REQUIRED",
                        "message": "请先授权手机号",
                        "missing": ["phone"],
                    }), 409
                phone_info = app.pay_client.exchange_phone_code(phone_code)
                number = "".join(character for character in str(phone_info.get("phoneNumber") or "") if character.isdigit())
                masked = mask_phone(number)
                if not masked:
                    return jsonify(error={"code": "INVALID_PHONE_NUMBER", "message": "手机号格式无效"}), 400
                try:
                    remote = app.community_client.lookup(number)
                    community_member = remote.get("member") if remote.get("found") else None
                except CommunityServiceError:
                    community_member = None
                if not community_member:
                    missing = []
                    if not nickname or len(nickname) > 20:
                        missing.append("nickname")
                    if not avatar_selected:
                        missing.append("avatar")
                    if missing:
                        return jsonify(error={
                            "code": "REGISTRATION_REQUIRED",
                            "message": "请确认头像和昵称",
                            "missing": missing,
                        }), 409
                display_name = str((community_member or {}).get("name") or nickname or "观澜用户")[:20]
                community_status = str((community_member or {}).get("status") or "none")
                try:
                    conn.execute(
                        """INSERT INTO users(
                            openid, unionid, phone_hash, phone_masked, phone_bound_at, nickname, avatar_selected_at,
                            community_member_id, community_name, community_status,
                            trial_started_at, trial_ends_at, created_at, updated_at
                        ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)""",
                        (
                            result["openid"], result.get("unionid"), phone_digest(number), masked, iso(now), display_name,
                            iso(now) if avatar_selected else None,
                            (community_member or {}).get("id"), (community_member or {}).get("name") or "", community_status,
                            iso(now), iso(now + timedelta(days=7)), iso(now), iso(now),
                        ),
                    )
                except sqlite3.IntegrityError:
                    return jsonify(error={"code": "PHONE_ALREADY_BOUND", "message": "该手机号已绑定其他账号"}), 409
                conn.commit()
                user = conn.execute("SELECT * FROM users WHERE openid=?", (result["openid"],)).fetchone()
                if community_member:
                    import_community_points(conn, user, community_member)
                    conn.commit()
                    user = user_by_id(conn, user["id"])
                inviter = conn.execute("SELECT * FROM users WHERE invite_code=?", (invite_code,)).fetchone() if invite_code else None
                if inviter and inviter["id"] != user["id"]:
                    before = conn.total_changes
                    conn.execute(
                        "INSERT OR IGNORE INTO invite_referrals(inviter_user_id, invited_user_id, reward_points, created_at) VALUES(?,?,300,?)",
                        (inviter["id"], user["id"], iso(now)),
                    )
                    invitation_accepted = conn.total_changes > before
                    if invitation_accepted:
                        inviter_balance = int(inviter["point_balance"] or 0) + 300
                        inviter_lifetime = int(inviter["point_lifetime"] or 0) + 300
                        source_id = f"invite:{user['id']}"
                        conn.execute(
                            "UPDATE users SET point_balance=?, point_lifetime=?, updated_at=? WHERE id=?",
                            (inviter_balance, inviter_lifetime, iso(now), inviter["id"]),
                        )
                        conn.execute(
                            "INSERT OR IGNORE INTO point_ledger(user_id, source_type, source_id, points, balance_after, lifetime_after, label, created_at) VALUES(?,?,?,?,?,?,?,?)",
                            (inviter["id"], "invite", source_id, 300, inviter_balance, inviter_lifetime, "邀请好友奖励", iso(now)),
                        )
            else:
                if phone_code:
                    phone_info = app.pay_client.exchange_phone_code(phone_code)
                    number = "".join(character for character in str(phone_info.get("phoneNumber") or "") if character.isdigit())
                    masked = mask_phone(number)
                    if not masked:
                        return jsonify(error={"code": "INVALID_PHONE_NUMBER", "message": "手机号格式无效"}), 400
                    digest = phone_digest(number)
                    owner = conn.execute("SELECT id FROM users WHERE phone_hash=?", (digest,)).fetchone()
                    if owner and owner["id"] != user["id"]:
                        return jsonify(error={"code": "PHONE_ALREADY_BOUND", "message": "该手机号已绑定其他账号"}), 409
                    remote = app.community_client.lookup(number)
                    community_member = remote.get("member") if remote.get("found") else None
                    if not community_member:
                        return jsonify(error={
                            "code": "REGISTRATION_REQUIRED",
                            "message": "未匹配到社群成员，请完成资料注册",
                        }), 409
                    conn.execute(
                        """UPDATE users SET phone_hash=?, phone_masked=?, phone_bound_at=?,
                           community_member_id=?, community_name=?, community_status=?,
                           nickname=COALESCE(NULLIF(?, ''), nickname), updated_at=? WHERE id=?""",
                        (
                            digest, masked, iso(now), community_member.get("id"), community_member.get("name") or "",
                            community_member.get("status") or "none", (community_member.get("name") or "")[:20],
                            iso(now), user["id"],
                        ),
                    )
                    user = user_by_id(conn, user["id"])
                    import_community_points(conn, user, community_member)
                    conn.commit()
                    user = user_by_id(conn, user["id"])
                if nickname or avatar_selected:
                    conn.execute(
                        "UPDATE users SET nickname=COALESCE(NULLIF(?, ''), nickname), avatar_selected_at=CASE WHEN ? THEN COALESCE(avatar_selected_at, ?) ELSE avatar_selected_at END, updated_at=? WHERE id=?",
                        (nickname[:20], avatar_selected, iso(now), iso(now), user["id"]),
                    )
                    user = user_by_id(conn, user["id"])
            own_invite_code = ensure_invite_code(conn, user)
            conn.commit()
            user = user_by_id(conn, user["id"])
            return jsonify(
                token=token_for(user["id"]),
                membership=membership(user),
                profile=public_profile(user),
                community=community_snapshot(user),
                wallet=wallet(user),
                isNewUser=is_new_user,
                invitationAccepted=invitation_accepted,
                inviteCode=own_invite_code,
            )

    @app.get("/api/v1/member/me")
    @auth_required
    def member_me():
        with closing(db()) as conn:
            user = user_by_id(conn, g.user_id)
            if user["community_member_id"]:
                remote = app.community_client.status(user["community_member_id"])
                member = remote.get("member") or {}
                conn.execute(
                    "UPDATE users SET community_name=?, community_status=?, updated_at=? WHERE id=?",
                    (member.get("name") or user["community_name"], member.get("status") or user["community_status"], iso(utcnow()), user["id"]),
                )
                import_community_points(conn, user, member)
                conn.commit()
                user = user_by_id(conn, g.user_id)
            return jsonify(
                membership=membership(user),
                profile=public_profile(user),
                community=community_snapshot(user),
                wallet=wallet(user),
            )

    @app.post("/api/v1/member/behaviors")
    @auth_required
    def record_member_behavior():
        payload = request.get_json(silent=True) or {}
        behavior_type = str(payload.get("type") or "").strip()
        subject_id = str(payload.get("subjectId") or "").strip()
        requested_date = str(payload.get("behaviorDate") or "").strip()
        task = POINT_TASKS.get(behavior_type)
        if not task or not subject_id or len(subject_id) > 128:
            return jsonify(error={"code": "INVALID_BEHAVIOR", "message": "成长任务信息无效"}), 400
        now = utcnow()
        today = now.astimezone(timezone(timedelta(hours=8))).date()
        if requested_date:
            try:
                behavior_day = datetime.strptime(requested_date, "%Y-%m-%d").date()
            except ValueError:
                return jsonify(error={"code": "INVALID_BEHAVIOR_DATE", "message": "成长任务日期无效"}), 400
            if behavior_day not in {today, today - timedelta(days=1)}:
                return jsonify(error={"code": "INVALID_BEHAVIOR_DATE", "message": "成长任务已超过同步期限"}), 400
        else:
            behavior_day = today
        behavior_date = behavior_day.isoformat()
        with closing(db()) as conn:
            before = conn.total_changes
            conn.execute(
                "INSERT OR IGNORE INTO member_behavior_events(user_id, behavior_date, behavior_type, subject_id, created_at) VALUES(?,?,?,?,?)",
                (g.user_id, behavior_date, behavior_type, subject_id, iso(now)),
            )
            recorded = conn.total_changes > before
            progress = conn.execute(
                "SELECT COUNT(*) AS count FROM member_behavior_events WHERE user_id=? AND behavior_date=? AND behavior_type=?",
                (g.user_id, behavior_date, behavior_type),
            ).fetchone()["count"]
            source_id = f"task:{g.user_id}:{behavior_date}:{behavior_type}"
            awarded = 0
            already_awarded = conn.execute("SELECT id FROM point_ledger WHERE source_id=?", (source_id,)).fetchone()
            if progress >= task["target"] and not already_awarded:
                user = user_by_id(conn, g.user_id)
                balance = int(user["point_balance"] or 0) + task["reward"]
                lifetime = int(user["point_lifetime"] or 0) + task["reward"]
                conn.execute(
                    "UPDATE users SET point_balance=?, point_lifetime=?, updated_at=? WHERE id=?",
                    (balance, lifetime, iso(now), g.user_id),
                )
                conn.execute(
                    "INSERT INTO point_ledger(user_id, source_type, source_id, points, balance_after, lifetime_after, label, created_at) VALUES(?,?,?,?,?,?,?,?)",
                    (g.user_id, "growth_task", source_id, task["reward"], balance, lifetime, f"完成任务：{task['title']}", iso(now)),
                )
                awarded = task["reward"]
            conn.commit()
            return jsonify(
                recorded=recorded,
                awarded=awarded,
                behaviorDate=behavior_date,
                progress=min(progress, task["target"]),
                wallet=wallet(user_by_id(conn, g.user_id)),
            )

    @app.post("/api/v1/member/phone")
    @auth_required
    def bind_member_phone():
        payload = request.get_json(silent=True) or {}
        code = str(payload.get("code") or "").strip()
        if not code or len(code) > 256:
            return jsonify(error={"code": "INVALID_PHONE_CODE", "message": "手机号授权凭证无效"}), 400
        phone_info = app.pay_client.exchange_phone_code(code)
        number = "".join(character for character in str(phone_info.get("phoneNumber") or "") if character.isdigit())
        masked = mask_phone(number)
        if not masked:
            return jsonify(error={"code": "INVALID_PHONE_NUMBER", "message": "手机号格式无效"}), 400
        now = utcnow()
        try:
            with closing(db()) as conn:
                conn.execute(
                    "UPDATE users SET phone_hash=?, phone_masked=?, phone_bound_at=?, updated_at=? WHERE id=?",
                    (phone_digest(number), masked, iso(now), iso(now), g.user_id),
                )
                conn.commit()
                user = user_by_id(conn, g.user_id)
                return jsonify(profile=public_profile(user))
        except sqlite3.IntegrityError:
            return jsonify(error={"code": "PHONE_ALREADY_BOUND", "message": "该手机号已绑定其他账号"}), 409

    @app.post("/api/v1/community/link-phone")
    @auth_required
    def link_community_phone():
        payload = request.get_json(silent=True) or {}
        code = str(payload.get("code") or "").strip()
        if not code or len(code) > 256:
            return jsonify(error={"code": "INVALID_PHONE_CODE", "message": "手机号授权凭证无效"}), 400
        phone_info = app.pay_client.exchange_phone_code(code)
        phone = re.sub(r"\D", "", str(phone_info.get("phoneNumber") or ""))
        if len(phone) != 11:
            return jsonify(error={"code": "INVALID_PHONE", "message": "未获得有效手机号"}), 400
        remote = app.community_client.lookup(phone)
        member = remote.get("member") if remote.get("found") else None
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            user = user_by_id(conn, g.user_id)
            conn.execute(
                "UPDATE users SET phone_hash=?, phone_masked=?, phone_bound_at=?, updated_at=? WHERE id=?",
                (phone_digest(phone), mask_phone(phone), iso(utcnow()), iso(utcnow()), user["id"]),
            )
            if member:
                conn.execute(
                    "UPDATE users SET community_member_id=?, community_name=?, community_status=?, updated_at=? WHERE id=?",
                    (member["id"], member.get("name") or "", member.get("status") or "pending", iso(utcnow()), user["id"]),
                )
                user = user_by_id(conn, g.user_id)
                import_community_points(conn, user, member)
            conn.commit()
            user = user_by_id(conn, g.user_id)
            return jsonify(
                community=community_snapshot(user),
                wallet=wallet(user),
                membership=membership(user),
                phoneMasked=mask_phone(phone),
            )

    @app.post("/api/v1/community/applications")
    @auth_required
    def submit_community_application():
        payload = request.get_json(silent=True) or {}
        required = ["name", "phone", "wechat", "city", "role", "industry", "skills", "project", "needs", "direction", "perspective"]
        cleaned = {field: str(payload.get(field) or "").strip() for field in required}
        if any(not cleaned[field] for field in required):
            return jsonify(error={"code": "APPLICATION_INCOMPLETE", "message": "请完成全部必填信息"}), 400
        if any(len(value) > 2000 for value in cleaned.values()):
            return jsonify(error={"code": "APPLICATION_TOO_LONG", "message": "申请内容过长"}), 400
        cleaned["source"] = "miniprogram"
        remote = app.community_client.submit_application(cleaned)
        member = remote.get("member") or {}
        with closing(db()) as conn:
            conn.execute(
                "UPDATE users SET community_member_id=?, community_name=?, community_status=?, updated_at=? WHERE id=?",
                (member.get("id"), member.get("name") or cleaned["name"], member.get("status") or "pending", iso(utcnow()), g.user_id),
            )
            conn.commit()
            user = user_by_id(conn, g.user_id)
            return jsonify(community=community_snapshot(user), wallet=wallet(user), membership=membership(user)), 201

    @app.post("/api/v1/points/redeem")
    @auth_required
    def redeem_points():
        payload = request.get_json(silent=True) or {}
        benefit_id = str(payload.get("benefitId") or "")
        benefit = POINT_BENEFITS.get(benefit_id)
        if not benefit:
            return jsonify(error={"code": "INVALID_BENEFIT", "message": "兑换权益不存在"}), 400
        source_id = f"points:{benefit_id}:{secrets.token_hex(12)}"
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            user = user_by_id(conn, g.user_id)
            if int(user["point_balance"] or 0) < benefit["cost"]:
                conn.rollback()
                return jsonify(error={"code": "INSUFFICIENT_POINTS", "message": "积分不足"}), 409
            balance = int(user["point_balance"]) - benefit["cost"]
            lifetime = int(user["point_lifetime"])
            conn.execute("UPDATE users SET point_balance=?, updated_at=? WHERE id=?", (balance, iso(utcnow()), user["id"]))
            conn.execute(
                "INSERT INTO point_ledger(user_id, source_type, source_id, points, balance_after, lifetime_after, label, created_at) VALUES(?,?,?,?,?,?,?,?)",
                (user["id"], "redemption", source_id, -benefit["cost"], balance, lifetime, benefit["title"], iso(utcnow())),
            )
            user = user_by_id(conn, user["id"])
            user = extend_member_days(conn, user, benefit["days"], "points", source_id)
            conn.commit()
            return jsonify(wallet=wallet(user), membership=membership(user), benefit={"id": benefit_id, **benefit})

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
            user = user_by_id(conn, g.user_id)
            return jsonify(summary=summary, wallet=wallet(user))

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
