import os
import math
import re
import secrets
import sqlite3
import hashlib
import hmac
import json
from contextlib import closing
from datetime import datetime, timedelta, timezone
from functools import wraps
from pathlib import Path

from flask import Flask, g, jsonify, request
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from payment_service.wechatpay import WeChatPayClient, WeChatPayError
from payment_service.virtualpay import VirtualPayClient
from payment_service.community import CommunityClient, CommunityServiceError
from payment_service.unified_account import init_schema as init_unified_account_schema
from payment_service.unified_account import register_routes as register_unified_account_routes


PLANS = {
    "monthly": {"title": "观澜月度会员", "total_cents": 3000, "days": 30, "product_id": "membership_30d"},
    "half_year": {"title": "观澜半年会员", "total_cents": 16800, "days": 180, "product_id": "membership_180d"},
    "annual": {"title": "观澜年度会员", "total_cents": 30000, "days": 365, "product_id": "membership_365d"},
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

ANALYTICS_PLATFORMS = {"miniprogram", "pc"}
ANALYTICS_EVENT_RE = re.compile(r"^[a-z][a-z0-9_]{1,63}$")
ANALYTICS_ID_RE = re.compile(r"^[A-Za-z0-9._:-]{8,128}$")


def utcnow():
    return datetime.now(timezone.utc)


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="seconds")


def ensure_column(conn, table, name, definition):
    columns = {row[1] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}
    if name in columns:
        return
    try:
        conn.execute(f"ALTER TABLE {table} ADD COLUMN {name} {definition}")
    except sqlite3.OperationalError:
        columns = {row[1] for row in conn.execute(f"PRAGMA table_info({table})").fetchall()}
        if name not in columns:
            raise


def create_app(test_config=None, *, pay_client=None, virtual_pay_client=None, community_client=None):
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
        WECHAT_VIRTUAL_OFFER_ID=os.getenv("WECHAT_VIRTUAL_OFFER_ID", ""),
        WECHAT_VIRTUAL_SANDBOX_APP_KEY=os.getenv("WECHAT_VIRTUAL_SANDBOX_APP_KEY", ""),
        WECHAT_VIRTUAL_APP_KEY=os.getenv("WECHAT_VIRTUAL_APP_KEY", ""),
        WECHAT_VIRTUAL_ENV=int(os.getenv("WECHAT_VIRTUAL_ENV", "1")),
        WECHAT_VIRTUAL_NOTIFY_TOKEN=os.getenv("WECHAT_VIRTUAL_NOTIFY_TOKEN", ""),
        WECHAT_VIRTUAL_ENCODING_AES_KEY=os.getenv("WECHAT_VIRTUAL_ENCODING_AES_KEY", ""),
        WECHAT_VIRTUAL_REFUND_DAYS=int(os.getenv("WECHAT_VIRTUAL_REFUND_DAYS", "15")),
        TOKEN_MAX_AGE=30 * 24 * 60 * 60,
        APP_ENV=os.getenv("APP_ENV", "development"),
        COMMUNITY_SERVICE_URL=os.getenv("COMMUNITY_SERVICE_URL", "http://127.0.0.1:8000"),
        COMMUNITY_SERVICE_TOKEN=os.getenv("COMMUNITY_SERVICE_TOKEN", ""),
        ANALYTICS_ADMIN_TOKEN=os.getenv("ANALYTICS_ADMIN_TOKEN", ""),
        ANALYTICS_LIVE_FROM=os.getenv("ANALYTICS_LIVE_FROM", ""),
        ANALYTICS_ALLOWED_ORIGINS=os.getenv(
            "ANALYTICS_ALLOWED_ORIGINS",
            "https://www.zkdlj.vip,https://jerryfang2023-stack.github.io",
        ),
        PC_SESSION_DAYS=int(os.getenv("PC_SESSION_DAYS", "30")),
        VERIFICATION_WEBHOOK_URL=os.getenv("VERIFICATION_WEBHOOK_URL", ""),
        VERIFICATION_WEBHOOK_TOKEN=os.getenv("VERIFICATION_WEBHOOK_TOKEN", ""),
        CONTENT_ROOT=os.getenv("CONTENT_ROOT", str(Path(__file__).parent / "data" / "protected-content")),
        CONTENT_RATE_PER_MINUTE=int(os.getenv("CONTENT_RATE_PER_MINUTE", "60")),
        MEMBERSHIP_PLANS=PLANS,
    )
    if test_config:
        app.config.update(test_config)
    if not app.config["SECRET_KEY"]:
        if app.config["APP_ENV"] == "production":
            raise RuntimeError("SECRET_KEY is required in production")
        app.config["SECRET_KEY"] = secrets.token_urlsafe(32)

    Path(app.config["DATABASE_PATH"]).parent.mkdir(parents=True, exist_ok=True)
    app.pay_client = pay_client or WeChatPayClient(app.config)
    app.virtual_pay_client = virtual_pay_client or VirtualPayClient(app.config, wechat_client=app.pay_client)
    app.community_client = community_client or CommunityClient(app.config)
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"], salt="wavesight-mini-user-v1")
    app.extensions["user_token_serializer"] = serializer

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
                CREATE TABLE IF NOT EXISTS analytics_events (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    event_id TEXT NOT NULL UNIQUE,
                    event_name TEXT NOT NULL,
                    platform TEXT NOT NULL,
                    user_id INTEGER,
                    visitor_id TEXT NOT NULL,
                    session_id TEXT NOT NULL,
                    page_path TEXT,
                    referrer TEXT,
                    app_version TEXT,
                    properties_json TEXT NOT NULL DEFAULT '{}',
                    occurred_at TEXT NOT NULL,
                    received_at TEXT NOT NULL,
                    FOREIGN KEY(user_id) REFERENCES users(id)
                );
                CREATE INDEX IF NOT EXISTS idx_analytics_events_occurred
                    ON analytics_events(occurred_at DESC);
                CREATE INDEX IF NOT EXISTS idx_analytics_events_platform_occurred
                    ON analytics_events(platform, occurred_at DESC);
                CREATE INDEX IF NOT EXISTS idx_analytics_events_name_occurred
                    ON analytics_events(event_name, occurred_at DESC);
                CREATE INDEX IF NOT EXISTS idx_analytics_events_session
                    ON analytics_events(session_id, occurred_at);
            """)
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
                "merged_into_user_id": "INTEGER",
                "merged_at": "TEXT",
            }.items():
                ensure_column(conn, "users", name, definition)
            conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_invite_code ON users(invite_code)")
            conn.execute("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_phone_hash ON users(phone_hash)")
            conn.execute("CREATE INDEX IF NOT EXISTS idx_users_community_member ON users(community_member_id)")
            for name, definition in {
                "payment_mode": "TEXT NOT NULL DEFAULT 'wechat_jsapi'",
                "product_id": "TEXT",
                "idempotency_key": "TEXT",
                "code_url": "TEXT",
                "virtual_env": "INTEGER",
                "refund_status": "TEXT NOT NULL DEFAULT 'NONE'",
                "refund_no": "TEXT",
                "refunded_at": "TEXT",
            }.items():
                ensure_column(conn, "payment_orders", name, definition)
            conn.execute(
                "CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_orders_user_idempotency "
                "ON payment_orders(user_id, idempotency_key) WHERE idempotency_key IS NOT NULL"
            )
            init_unified_account_schema(conn)
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
        user = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
        seen = set()
        while user and user["merged_into_user_id"] and user["id"] not in seen:
            seen.add(user["id"])
            user = conn.execute("SELECT * FROM users WHERE id=?", (user["merged_into_user_id"],)).fetchone()
        return user

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

    def authenticated_user_id(optional=True):
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return None if optional else False
        try:
            payload = serializer.loads(header[7:], max_age=app.config["TOKEN_MAX_AGE"])
        except (SignatureExpired, BadSignature):
            return None if optional else False
        with closing(db()) as conn:
            user = user_by_id(conn, payload.get("user_id"))
        return int(user["id"]) if user else None

    def clean_analytics_properties(value):
        if not isinstance(value, dict):
            return {}
        cleaned = {}
        blocked_fragments = {"phone", "mobile", "openid", "unionid", "wechat", "email", "address", "name"}
        for raw_key, raw_value in list(value.items())[:24]:
            key = str(raw_key).strip()[:40]
            if not key or not re.fullmatch(r"[A-Za-z0-9_.-]+", key):
                continue
            if any(fragment in key.lower() for fragment in blocked_fragments):
                continue
            if isinstance(raw_value, bool) or raw_value is None:
                cleaned[key] = raw_value
            elif isinstance(raw_value, (int, float)):
                cleaned[key] = raw_value
            elif isinstance(raw_value, str):
                cleaned[key] = raw_value.strip()[:160]
            elif isinstance(raw_value, list):
                cleaned[key] = [str(item).strip()[:80] for item in raw_value[:10]]
        encoded = json.dumps(cleaned, ensure_ascii=False, separators=(",", ":"))
        return cleaned if len(encoded.encode("utf-8")) <= 4096 else {}

    def analytics_live_from():
        value = str(app.config.get("ANALYTICS_LIVE_FROM") or "").strip()
        if not value:
            return None
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
        if parsed.tzinfo is None:
            parsed = parsed.replace(tzinfo=timezone.utc)
        return parsed.astimezone(timezone.utc)

    def parse_analytics_time(value):
        try:
            parsed = datetime.fromisoformat(str(value or "").replace("Z", "+00:00"))
            if parsed.tzinfo is None:
                parsed = parsed.replace(tzinfo=timezone.utc)
            parsed = parsed.astimezone(timezone.utc)
        except (TypeError, ValueError):
            return utcnow()
        now = utcnow()
        if parsed < now - timedelta(days=7):
            return None
        if parsed > now + timedelta(minutes=10):
            return now
        return parsed

    def insert_analytics_event(conn, event, *, user_id=None, server=False):
        event_name = str(event.get("event") or "").strip()
        platform = str(event.get("platform") or "").strip()
        event_id = str(event.get("eventId") or "").strip()
        visitor_id = str(event.get("visitorId") or "").strip()
        session_id = str(event.get("sessionId") or "").strip()
        if not ANALYTICS_EVENT_RE.fullmatch(event_name):
            raise ValueError("INVALID_EVENT_NAME")
        if platform not in ANALYTICS_PLATFORMS:
            raise ValueError("INVALID_PLATFORM")
        if not ANALYTICS_ID_RE.fullmatch(event_id):
            raise ValueError("INVALID_EVENT_ID")
        if not ANALYTICS_ID_RE.fullmatch(visitor_id) or not ANALYTICS_ID_RE.fullmatch(session_id):
            raise ValueError("INVALID_ANALYTICS_ID")
        properties = clean_analytics_properties(event.get("properties"))
        page_path = str(event.get("page") or "").strip()[:160]
        referrer = str(event.get("referrer") or "").strip().split("?", 1)[0].split("#", 1)[0][:240]
        app_version = str(event.get("appVersion") or "").strip()[:32]
        occurred_at = parse_analytics_time(event.get("occurredAt"))
        live_from = analytics_live_from()
        if occurred_at is None or (live_from and occurred_at < live_from):
            return False
        before = conn.total_changes
        conn.execute(
            """INSERT OR IGNORE INTO analytics_events(
                event_id, event_name, platform, user_id, visitor_id, session_id, page_path,
                referrer, app_version, properties_json, occurred_at, received_at
            ) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)""",
            (
                event_id, event_name, platform, user_id, visitor_id, session_id, page_path,
                referrer, app_version, json.dumps(properties, ensure_ascii=False, separators=(",", ":")),
                iso(occurred_at), iso(utcnow()),
            ),
        )
        return conn.total_changes > before

    def record_system_analytics(conn, event_name, user_id, properties=None, *, event_key=""):
        identity = f"server-user:{int(user_id)}"
        suffix = event_key or secrets.token_hex(8)
        event = {
            "eventId": f"server:{event_name}:{suffix}"[:128],
            "event": event_name,
            "platform": "miniprogram",
            "visitorId": identity,
            "sessionId": f"server:{datetime.now(timezone.utc).date().isoformat()}",
            "page": "server",
            "appVersion": "server",
            "properties": properties or {},
            "occurredAt": iso(utcnow()),
        }
        return insert_analytics_event(conn, event, user_id=user_id, server=True)

    def analytics_admin_required(fn):
        @wraps(fn)
        def wrapped(*args, **kwargs):
            expected = str(app.config.get("ANALYTICS_ADMIN_TOKEN") or "")
            provided = request.headers.get("Authorization", "")
            if not expected:
                return jsonify(error={"code": "ANALYTICS_NOT_CONFIGURED", "message": "运营统计尚未配置"}), 503
            if not provided.startswith("Bearer ") or not hmac.compare_digest(provided[7:], expected):
                return jsonify(error={"code": "ADMIN_AUTH_REQUIRED", "message": "请输入运营后台访问令牌"}), 401
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
        record_system_analytics(
            conn,
            "payment_success",
            user["id"],
            {"orderNo": order["order_no"], "planId": order["plan_id"], "amountCents": order["total_cents"]},
            event_key=order["order_no"],
        )
        return user_by_id(conn, user["id"])

    def fulfill_virtual_order(conn, order, transaction, *, product_id="", notification_openid=""):
        if order["status"] == "PAID":
            return user_by_id(conn, order["user_id"])
        if order["payment_mode"] != "wechat_virtual":
            raise WeChatPayError("支付方式不匹配", code="PAYMENT_MODE_MISMATCH", status=400)
        user = user_by_id(conn, order["user_id"])
        if transaction.get("order_id") != order["order_no"]:
            raise WeChatPayError("虚拟支付订单号不匹配", code="PAYMENT_ORDER_MISMATCH", status=400)
        if notification_openid and notification_openid != user["openid"]:
            raise WeChatPayError("虚拟支付用户不匹配", code="PAYMENT_USER_MISMATCH", status=400)
        if product_id and product_id != order["product_id"]:
            raise WeChatPayError("虚拟商品不匹配", code="PAYMENT_PRODUCT_MISMATCH", status=400)
        expected_env_type = 2 if int(order["virtual_env"] or 0) == 1 else 1
        if transaction.get("env_type") is not None and int(transaction["env_type"]) != expected_env_type:
            raise WeChatPayError("虚拟支付环境不匹配", code="PAYMENT_ENV_MISMATCH", status=400)
        paid_fee = int(transaction.get("paid_fee") or transaction.get("order_fee") or 0)
        if paid_fee != int(order["total_cents"]):
            raise WeChatPayError("虚拟支付金额不匹配", code="PAYMENT_AMOUNT_MISMATCH", status=400)
        if int(transaction.get("status") or 0) not in {2, 3, 4}:
            return user

        plan = PLANS[order["plan_id"]]
        now = utcnow()
        trial_end = datetime.fromisoformat(user["trial_ends_at"])
        member_end = datetime.fromisoformat(user["member_ends_at"]) if user["member_ends_at"] else now
        start = max(now, trial_end, member_end)
        new_end = start + timedelta(days=plan["days"])
        transaction_id = str(
            transaction.get("wx_order_id")
            or transaction.get("wxpay_order_id")
            or transaction.get("channel_order_id")
            or f"virtual:{order['order_no']}"
        )
        paid_at = transaction.get("paid_time")
        if isinstance(paid_at, (int, float)):
            paid_at = iso(datetime.fromtimestamp(paid_at, timezone.utc))
        conn.execute("UPDATE users SET member_ends_at=?, updated_at=? WHERE id=?", (iso(new_end), iso(now), user["id"]))
        conn.execute(
            "UPDATE payment_orders SET status='PAID', transaction_id=?, paid_at=?, raw_trade_state='PAID', updated_at=? WHERE id=?",
            (transaction_id, paid_at or iso(now), iso(now), order["id"]),
        )
        conn.execute(
            "INSERT OR IGNORE INTO membership_ledger(user_id, source_type, source_id, days, previous_ends_at, new_ends_at, created_at) VALUES(?,?,?,?,?,?,?)",
            (user["id"], "wechat_virtual", order["order_no"], plan["days"], user["member_ends_at"], iso(new_end), iso(now)),
        )
        record_system_analytics(
            conn,
            "payment_success",
            user["id"],
            {"orderNo": order["order_no"], "planId": order["plan_id"], "amountCents": order["total_cents"]},
            event_key=order["order_no"],
        )
        return user_by_id(conn, user["id"])

    def complete_virtual_refund(conn, order, *, refunded_at=None, source_type="wechat_virtual"):
        if order["refund_status"] == "REFUNDED":
            return user_by_id(conn, order["user_id"])
        user = user_by_id(conn, order["user_id"])
        ledger = conn.execute(
            "SELECT * FROM membership_ledger WHERE source_type=? AND source_id=?",
            (source_type, order["order_no"]),
        ).fetchone()
        if ledger and user["member_ends_at"]:
            current_end = datetime.fromisoformat(user["member_ends_at"])
            candidate = current_end - timedelta(days=int(ledger["days"]))
            trial_end = datetime.fromisoformat(user["trial_ends_at"])
            previous_end = datetime.fromisoformat(ledger["previous_ends_at"]) if ledger["previous_ends_at"] else trial_end
            next_end = max(candidate, previous_end)
            member_ends_at = None if not ledger["previous_ends_at"] and next_end <= trial_end else iso(next_end)
            conn.execute("UPDATE users SET member_ends_at=?, updated_at=? WHERE id=?", (member_ends_at, iso(utcnow()), user["id"]))
        conn.execute(
            "UPDATE payment_orders SET status='REFUNDED', refund_status='REFUNDED', refunded_at=?, raw_trade_state='REFUNDED', updated_at=? WHERE id=?",
            (refunded_at or iso(utcnow()), iso(utcnow()), order["id"]),
        )
        record_system_analytics(
            conn,
            "payment_refunded",
            user["id"],
            {"orderNo": order["order_no"], "planId": order["plan_id"], "amountCents": order["total_cents"]},
            event_key=order["order_no"],
        )
        return user_by_id(conn, order["user_id"])

    unified_account = register_unified_account_routes(
        app,
        db=db,
        membership=membership,
        user_by_id=user_by_id,
        fulfill_order=fulfill_order,
        complete_refund=complete_virtual_refund,
        record_analytics=record_system_analytics,
    )
    with closing(db()) as conn:
        for legacy_user in conn.execute("SELECT * FROM users").fetchall():
            unified_account["sync_legacy_identities"](conn, legacy_user)
        conn.commit()

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
            virtualPaymentConfigured=app.virtual_pay_client.configured(),
            virtualNotifyConfigured=app.virtual_pay_client.notification_configured(),
            virtualEnvironment=app.config["WECHAT_VIRTUAL_ENV"],
            appId=app.config["WECHAT_APP_ID"],
            mchId=app.config["WECHAT_PAY_MCH_ID"],
        )

    @app.after_request
    def analytics_cors(response):
        if request.path.startswith("/api/v1/analytics") or request.path.startswith("/api/v1/admin/analytics"):
            origin = request.headers.get("Origin", "")
            allowed = {item.strip() for item in str(app.config["ANALYTICS_ALLOWED_ORIGINS"]).split(",") if item.strip()}
            if origin in allowed:
                response.headers["Access-Control-Allow-Origin"] = origin
                response.headers["Vary"] = "Origin"
                response.headers["Access-Control-Allow-Headers"] = "Authorization, Content-Type"
                response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
            response.headers["Cache-Control"] = "no-store"
        return response

    @app.route("/api/v1/analytics/events", methods=["OPTIONS"])
    @app.route("/api/v1/admin/analytics/summary", methods=["OPTIONS"])
    def analytics_options():
        return ("", 204)

    @app.post("/api/v1/analytics/events")
    def collect_analytics_events():
        payload = request.get_json(silent=True) or {}
        events = payload.get("events") if isinstance(payload.get("events"), list) else [payload]
        if not events or len(events) > 20:
            return jsonify(error={"code": "INVALID_EVENT_BATCH", "message": "单次最多上报 20 条事件"}), 400
        user_id = authenticated_user_id(optional=True)
        accepted = 0
        with closing(db()) as conn:
            for event in events:
                if not isinstance(event, dict):
                    return jsonify(error={"code": "INVALID_EVENT", "message": "事件格式无效"}), 400
                try:
                    accepted += int(insert_analytics_event(conn, event, user_id=user_id))
                except ValueError as error:
                    return jsonify(error={"code": str(error), "message": "事件字段无效"}), 400
            conn.commit()
        return jsonify(accepted=accepted, received=len(events))

    @app.get("/api/v1/admin/analytics/summary")
    @analytics_admin_required
    def analytics_summary():
        try:
            days = int(request.args.get("days", "7"))
        except ValueError:
            days = 7
        days = days if days in {1, 7, 30, 90} else 7
        platform = str(request.args.get("platform") or "all")
        if platform not in ANALYTICS_PLATFORMS | {"all"}:
            return jsonify(error={"code": "INVALID_PLATFORM", "message": "平台筛选无效"}), 400
        now = utcnow()
        local_timezone = timezone(timedelta(hours=8))
        local_today = now.astimezone(local_timezone).date()
        local_start = local_today - timedelta(days=days - 1)
        requested_start = datetime.combine(local_start, datetime.min.time(), tzinfo=local_timezone).astimezone(timezone.utc)
        live_from = analytics_live_from()
        start = max(requested_start, live_from) if live_from else requested_start
        params = [iso(start)]
        platform_clause = ""
        if platform != "all":
            platform_clause = " AND platform=?"
            params.append(platform)
        with closing(db()) as conn:
            rows = conn.execute(
                f"SELECT * FROM analytics_events WHERE occurred_at>=?{platform_clause} ORDER BY occurred_at ASC",
                params,
            ).fetchall()
            user_rows = conn.execute(
                "SELECT id, created_at FROM users WHERE created_at>=? ORDER BY created_at ASC",
                (iso(start),),
            ).fetchall() if platform in {"all", "miniprogram"} else []
            order_rows = conn.execute(
                """SELECT order_no, total_cents, status, refund_status, paid_at, refunded_at
                   FROM payment_orders WHERE paid_at IS NOT NULL AND paid_at>=? ORDER BY paid_at ASC""",
                (iso(start),),
            ).fetchall() if platform in {"all", "miniprogram"} else []

        local_offset = timedelta(hours=8)
        day_keys = [(local_start + timedelta(days=index)).isoformat() for index in range(days)]
        trend = {key: {"date": key, "visitors": set(), "sessions": set(), "pageViews": 0, "registrations": 0, "paidOrders": 0, "revenueCents": 0} for key in day_keys}
        visitors = set()
        sessions = {}
        page_counts = {}
        page_visitors = {}
        event_counts = {}
        content_counts = {}
        content_visitors = {}
        platform_counts = {"miniprogram": set(), "pc": set()}
        live_visitors = set()
        for row in rows:
            occurred = datetime.fromisoformat(row["occurred_at"]).astimezone(timezone.utc)
            day = (occurred + local_offset).date().isoformat()
            visitor_id = row["visitor_id"]
            session_id = row["session_id"]
            event_name = row["event_name"]
            properties = json.loads(row["properties_json"] or "{}")
            visitors.add(visitor_id)
            platform_counts.setdefault(row["platform"], set()).add(visitor_id)
            event_counts[event_name] = event_counts.get(event_name, 0) + 1
            session = sessions.setdefault(session_id, {"first": occurred, "last": occurred, "pageViews": 0})
            session["first"] = min(session["first"], occurred)
            session["last"] = max(session["last"], occurred)
            if event_name == "page_view":
                session["pageViews"] += 1
                page = row["page_path"] or "未知页面"
                page_counts[page] = page_counts.get(page, 0) + 1
                page_visitors.setdefault(page, set()).add(visitor_id)
            if event_name == "content_view":
                content_id = str(properties.get("contentId") or row["page_path"] or "")
                if content_id:
                    content_key = f"{properties.get('contentType') or 'content'}:{content_id}"
                    item = content_counts.setdefault(content_key, {
                        "id": content_id,
                        "type": str(properties.get("contentType") or "内容"),
                        "title": str(properties.get("title") or content_id)[:80],
                        "views": 0,
                    })
                    item["views"] += 1
                    content_visitors.setdefault(content_key, set()).add(visitor_id)
            if occurred >= now - timedelta(minutes=30):
                live_visitors.add(visitor_id)
            if day in trend:
                trend[day]["visitors"].add(visitor_id)
                trend[day]["sessions"].add(session_id)
                if event_name == "page_view":
                    trend[day]["pageViews"] += 1

        for row in user_rows:
            day = (datetime.fromisoformat(row["created_at"]).astimezone(timezone.utc) + local_offset).date().isoformat()
            if day in trend:
                trend[day]["registrations"] += 1
        paid_orders = []
        refunded_orders = []
        for row in order_rows:
            paid_orders.append(row)
            if row["refund_status"] == "REFUNDED" or row["status"] == "REFUNDED":
                refunded_orders.append(row)
            day = (datetime.fromisoformat(row["paid_at"]).astimezone(timezone.utc) + local_offset).date().isoformat()
            if day in trend:
                trend[day]["paidOrders"] += 1
                trend[day]["revenueCents"] += int(row["total_cents"] or 0)

        session_durations = [max(0, (item["last"] - item["first"]).total_seconds()) for item in sessions.values()]
        bounce_sessions = sum(1 for item in sessions.values() if item["pageViews"] <= 1)
        page_views = event_counts.get("page_view", 0)
        registrations = len(user_rows)
        gross_revenue = sum(int(row["total_cents"] or 0) for row in paid_orders)
        refund_amount = sum(int(row["total_cents"] or 0) for row in refunded_orders)
        unique_visitors = len(visitors)
        top_pages = sorted(
            ({"page": page, "views": views, "visitors": len(page_visitors.get(page, set()))} for page, views in page_counts.items()),
            key=lambda item: (-item["views"], item["page"]),
        )[:12]
        top_content = sorted(
            ({**item, "visitors": len(content_visitors.get(key, set()))} for key, item in content_counts.items()),
            key=lambda item: (-item["views"], item["title"]),
        )[:12]
        trend_rows = []
        for key in sorted(trend):
            item = trend[key]
            trend_rows.append({
                **{name: value for name, value in item.items() if name not in {"visitors", "sessions"}},
                "visitors": len(item["visitors"]),
                "sessions": len(item["sessions"]),
            })
        return jsonify(
            generatedAt=iso(now),
            trackingSince=iso(live_from) if live_from else None,
            dataSource="production",
            filters={"days": days, "platform": platform},
            overview={
                "visitors": unique_visitors,
                "sessions": len(sessions),
                "pageViews": page_views,
                "newRegistrations": registrations,
                "paidOrders": len(paid_orders),
                "grossRevenueCents": gross_revenue,
                "refundOrders": len(refunded_orders),
                "refundAmountCents": refund_amount,
                "netRevenueCents": gross_revenue - refund_amount,
                "registrationRate": round(registrations / unique_visitors, 4) if unique_visitors else 0,
                "paymentRate": round(len(paid_orders) / registrations, 4) if registrations else 0,
                "averageSessionSeconds": round(sum(session_durations) / len(session_durations)) if session_durations else 0,
                "bounceRate": round(bounce_sessions / len(sessions), 4) if sessions else 0,
                "activeVisitors30m": len(live_visitors),
            },
            funnel=[
                {"key": "visit", "label": "访问", "count": len(sessions)},
                {"key": "registration_started", "label": "开始注册", "count": event_counts.get("registration_started", 0)},
                {"key": "registration_success", "label": "注册成功", "count": registrations},
                {"key": "checkout_started", "label": "发起购买", "count": event_counts.get("checkout_started", 0) or event_counts.get("payment_order_created", 0)},
                {"key": "payment_success", "label": "支付成功", "count": len(paid_orders)},
            ],
            platforms=[
                {"platform": key, "visitors": len(value)} for key, value in platform_counts.items()
            ],
            trend=trend_rows,
            topPages=top_pages,
            topContent=top_content,
            eventCounts=event_counts,
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
            if user:
                user = user_by_id(conn, user["id"])
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
            unified_account["sync_legacy_identities"](conn, user)
            if is_new_user:
                record_system_analytics(
                    conn,
                    "registration_success",
                    user["id"],
                    {"communityLinked": bool(user["community_member_id"]), "invited": invitation_accepted},
                    event_key=f"user:{user['id']}",
                )
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
            record_system_analytics(
                conn,
                "community_application_submitted",
                g.user_id,
                {"status": member.get("status") or "pending"},
                event_key=f"application:{member.get('id') or g.user_id}:{datetime.now(timezone.utc).date().isoformat()}",
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
            record_system_analytics(
                conn,
                "points_redeemed",
                user["id"],
                {"benefitId": benefit_id, "points": benefit["cost"], "days": benefit["days"]},
                event_key=source_id,
            )
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

    @app.post("/api/v1/pay/virtual/orders")
    @auth_required
    def create_virtual_payment_order():
        payload = request.get_json(silent=True) or {}
        plan_id = str(payload.get("planId") or "")
        login_code = str(payload.get("loginCode") or "").strip()
        if plan_id not in PLANS:
            return jsonify(error={"code": "INVALID_PLAN", "message": "会员套餐不存在"}), 400
        if not login_code or len(login_code) > 128:
            return jsonify(error={"code": "INVALID_CODE", "message": "微信登录凭证无效"}), 400
        plan = PLANS[plan_id]
        now = utcnow()
        order_no = f"GLV{now.strftime('%Y%m%d%H%M%S')}{secrets.token_hex(4).upper()}"
        with closing(db()) as conn:
            conn.execute(
                """INSERT INTO payment_orders(
                    order_no, user_id, plan_id, description, total_cents, status,
                    payment_mode, product_id, virtual_env, created_at, updated_at
                ) VALUES(?,?,?,?,?,'PENDING','wechat_virtual',?,?,?,?)""",
                (
                    order_no,
                    g.user_id,
                    plan_id,
                    plan["title"],
                    plan["total_cents"],
                    plan["product_id"],
                    app.config["WECHAT_VIRTUAL_ENV"],
                    iso(now),
                    iso(now),
                ),
            )
            record_system_analytics(
                conn,
                "payment_order_created",
                g.user_id,
                {"orderNo": order_no, "planId": plan_id, "amountCents": plan["total_cents"]},
                event_key=order_no,
            )
            conn.commit()
        try:
            payment = app.virtual_pay_client.create_payment(
                order_no=order_no,
                product_id=plan["product_id"],
                total_cents=plan["total_cents"],
                login_code=login_code,
                expected_openid=g.openid,
            )
        except Exception:
            with closing(db()) as conn:
                conn.execute(
                    "UPDATE payment_orders SET status='CREATE_FAILED', updated_at=? WHERE order_no=?",
                    (iso(utcnow()), order_no),
                )
                conn.commit()
            raise
        return jsonify(
            orderNo=order_no,
            plan={
                "id": plan_id,
                "title": plan["title"],
                "totalCents": plan["total_cents"],
                "days": plan["days"],
                "productId": plan["product_id"],
            },
            payment=payment,
        ), 201

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
            record_system_analytics(
                conn,
                "payment_order_created",
                g.user_id,
                {"orderNo": order_no, "planId": plan_id, "amountCents": plan["total_cents"]},
                event_key=order_no,
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
                transaction = (
                    app.virtual_pay_client.query_order(openid=g.openid, order_no=order_no)
                    if order["payment_mode"] == "wechat_virtual"
                    else app.pay_client.query_order(order_no)
                )
                conn.execute("BEGIN IMMEDIATE")
                fresh = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
                if order["payment_mode"] == "wechat_virtual":
                    fulfill_virtual_order(conn, fresh, transaction)
                elif transaction.get("trade_state") == "SUCCESS":
                    fulfill_order(conn, fresh, transaction)
                elif transaction.get("trade_state") in {"CLOSED", "REVOKED", "PAYERROR"}:
                    conn.execute("UPDATE payment_orders SET status=?, raw_trade_state=?, updated_at=? WHERE id=?", (transaction["trade_state"], transaction["trade_state"], iso(utcnow()), order["id"]))
                conn.commit()
                order = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
            elif order["status"] == "REFUNDING" and order["refund_no"]:
                refund = app.virtual_pay_client.query_order(openid=g.openid, order_no=order["refund_no"])
                if int(refund.get("status") or 0) == 8:
                    conn.execute("BEGIN IMMEDIATE")
                    fresh = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
                    complete_virtual_refund(conn, fresh)
                    conn.commit()
                    order = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
            user = user_by_id(conn, g.user_id)
            return jsonify(order={
                "orderNo": order["order_no"],
                "status": order["status"],
                "planId": order["plan_id"],
                "totalCents": order["total_cents"],
                "refundStatus": order["refund_status"],
            }, membership=membership(user))

    @app.post("/api/v1/pay/orders/<order_no>/refund")
    @auth_required
    def refund_virtual_payment_order(order_no):
        with closing(db()) as conn:
            order = conn.execute(
                "SELECT * FROM payment_orders WHERE order_no=? AND user_id=?",
                (order_no, g.user_id),
            ).fetchone()
            if not order:
                return jsonify(error={"code": "ORDER_NOT_FOUND", "message": "订单不存在"}), 404
            if order["payment_mode"] != "wechat_virtual" or order["status"] not in {"PAID", "REFUNDING"}:
                return jsonify(error={"code": "ORDER_NOT_REFUNDABLE", "message": "该订单当前不可退款"}), 409
            if order["refund_status"] in {"PROCESSING", "REFUNDED"}:
                user = user_by_id(conn, g.user_id)
                return jsonify(order={"orderNo": order_no, "refundStatus": order["refund_status"]}, membership=membership(user))
            paid_at = datetime.fromisoformat(order["paid_at"])
            if utcnow() > paid_at + timedelta(days=app.config["WECHAT_VIRTUAL_REFUND_DAYS"]):
                return jsonify(error={"code": "REFUND_WINDOW_EXPIRED", "message": "已超过15天退款有效期"}), 409
            transaction = app.virtual_pay_client.query_order(openid=g.openid, order_no=order_no)
            left_fee = int(transaction.get("left_fee") or transaction.get("paid_fee") or 0)
            if left_fee != int(order["total_cents"]):
                return jsonify(error={"code": "FULL_REFUND_UNAVAILABLE", "message": "该订单无法按原金额全额退款"}), 409
            refund_no = f"GLR{utcnow().strftime('%Y%m%d%H%M%S')}{secrets.token_hex(4).upper()}"
            app.virtual_pay_client.refund_order(
                openid=g.openid,
                order_no=order_no,
                refund_no=refund_no,
                left_fee=left_fee,
                refund_fee=int(order["total_cents"]),
            )
            conn.execute(
                "UPDATE payment_orders SET status='REFUNDING', refund_status='PROCESSING', refund_no=?, updated_at=? WHERE id=?",
                (refund_no, iso(utcnow()), order["id"]),
            )
            conn.commit()
            user = user_by_id(conn, g.user_id)
            return jsonify(order={"orderNo": order_no, "refundStatus": "PROCESSING"}, membership=membership(user)), 202

    @app.get("/api/v1/pay/virtual/notify")
    def verify_virtual_payment_notification():
        echo = str(request.args.get("echostr") or "")
        encrypted = bool(request.args.get("msg_signature"))
        app.virtual_pay_client.verify_callback_signature(
            request.args.get("timestamp"),
            request.args.get("nonce"),
            request.args.get("msg_signature") if encrypted else request.args.get("signature"),
            echo if encrypted else "",
        )
        if encrypted:
            echo = app.virtual_pay_client.decrypt_callback(echo).decode("utf-8")
        return echo, 200, {"Content-Type": "text/plain; charset=utf-8"}

    @app.post("/api/v1/pay/virtual/notify")
    def virtual_payment_notification():
        event = app.virtual_pay_client.parse_callback(request.get_data(cache=False), request.args)
        event_type = event.get("Event") or event.get("event")
        if event_type == "xpay_subscribe_ios_refund_query_notify":
            pay_order_id = str(event.get("pay_order_id") or event.get("PayOrderId") or "").strip()
            product_id = str(event.get("product_id") or event.get("ProductId") or "").strip()
            with closing(db()) as conn:
                order = conn.execute(
                    "SELECT * FROM payment_orders WHERE transaction_id=? AND payment_mode='wechat_virtual'",
                    (pay_order_id,),
                ).fetchone()
            eligible = False
            reason = "未找到对应的虚拟支付订单"
            if order and order["product_id"] == product_id and order["paid_at"]:
                paid_at = datetime.fromisoformat(order["paid_at"])
                eligible = (
                    order["status"] == "PAID"
                    and utcnow() <= paid_at + timedelta(days=app.config["WECHAT_VIRTUAL_REFUND_DAYS"])
                )
                reason = (
                    "订单支付后15天内，符合全额退款政策"
                    if eligible
                    else "订单不在15天全额退款期限内或已完成退款"
                )
            return jsonify(
                result_code=0 if eligible else 1,
                result_info="建议退款" if eligible else "不建议退款",
                evidence=reason,
            )
        if event_type == "xpay_goods_deliver_notify":
            order_no = str(event.get("OutTradeNo") or "")
            openid = str(event.get("OpenId") or "")
            goods = event.get("GoodsInfo") or {}
            product_id = str(goods.get("ProductId") or "")
            with closing(db()) as conn:
                conn.execute("BEGIN IMMEDIATE")
                order = conn.execute("SELECT * FROM payment_orders WHERE order_no=?", (order_no,)).fetchone()
                if not order:
                    conn.rollback()
                    return jsonify(ErrCode=1, ErrMsg="order not found"), 404
                transaction = app.virtual_pay_client.query_order(openid=openid, order_no=order_no)
                fulfill_virtual_order(
                    conn,
                    order,
                    transaction,
                    product_id=product_id,
                    notification_openid=openid,
                )
                conn.commit()
            return jsonify(ErrCode=0, ErrMsg="success")
        if event_type == "xpay_refund_notify":
            order_no = str(event.get("MchOrderId") or "")
            refund_no = str(event.get("MchRefundId") or "")
            openid = str(event.get("OpenId") or "")
            refund_fee = int(event.get("RefundFee") or 0)
            ret_code = int(event.get("RetCode") or -1)
            with closing(db()) as conn:
                conn.execute("BEGIN IMMEDIATE")
                order = conn.execute("SELECT * FROM payment_orders WHERE order_no=?", (order_no,)).fetchone()
                user = user_by_id(conn, order["user_id"]) if order else None
                if (
                    not order
                    or not user
                    or user["openid"] != openid
                    or order["refund_no"] != refund_no
                    or refund_fee != int(order["total_cents"])
                    or ret_code != 0
                ):
                    conn.rollback()
                    return jsonify(ErrCode=1, ErrMsg="refund mismatch"), 400
                complete_virtual_refund(conn, order, refunded_at=iso(utcnow()))
                conn.commit()
            return jsonify(ErrCode=0, ErrMsg="success")
        return jsonify(ErrCode=0, ErrMsg="ignored")

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
            event_type = str(notification.get("event_type") or "UNKNOWN")
            if event_type.startswith("REFUND."):
                if order["payment_mode"] != "wechat_native" or transaction.get("refund_status") != "SUCCESS":
                    conn.rollback()
                    return jsonify(error={"code": "REFUND_NOTIFICATION_MISMATCH", "message": "退款通知与订单不匹配"}), 400
                complete_virtual_refund(conn, order, source_type="wechat_pay", refunded_at=transaction.get("success_time") or iso(utcnow()))
            else:
                fulfill_order(conn, order, transaction)
            conn.execute(
                "INSERT INTO payment_notifications(notification_id, order_no, event_type, created_at) VALUES(?,?,?,?)",
                (notification_id, order_no, event_type, iso(utcnow())),
            )
            conn.commit()
        return "", 204

    return app


app = create_app()
