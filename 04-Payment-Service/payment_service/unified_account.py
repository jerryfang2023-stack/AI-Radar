import hashlib
import hmac
import base64
import io
import json
import secrets
import sqlite3
import urllib.error
import urllib.request
from contextlib import closing
from datetime import datetime, timedelta, timezone
from pathlib import Path

from flask import g, jsonify, make_response, request
import qrcode

from payment_service.wechatpay import WeChatPayError


SESSION_COOKIE = "wavesight_session"
VISITOR_COOKIE = "wavesight_visitor"
IDENTITY_TYPES = {"phone", "email", "wechat_openid", "wechat_unionid"}
CONTENT_KINDS = {"funding", "entity", "sector", "report"}
CAPABILITIES = {
    "funding": "funding.detail.full",
    "entity": "ecosystem.detail.full",
    "sector": "ecosystem.detail.full",
    "report": "report.full",
}


def iso(value):
    return value.astimezone(timezone.utc).isoformat(timespec="seconds")


def utcnow():
    return datetime.now(timezone.utc)


def digest(secret, namespace, value):
    return hmac.new(secret.encode("utf-8"), f"{namespace}:{value}".encode("utf-8"), hashlib.sha256).hexdigest()


def phone_digest(secret, value):
    return hmac.new(secret.encode("utf-8"), value.encode("utf-8"), hashlib.sha256).hexdigest()


def mask_identity(kind, value):
    if kind == "phone":
        digits = "".join(character for character in value if character.isdigit())
        return f"{digits[:3]}****{digits[-4:]}" if len(digits) >= 7 else ""
    local, separator, domain = value.partition("@")
    if not separator:
        return ""
    visible = local[:2] if len(local) > 2 else local[:1]
    return f"{visible}***@{domain}"


def normalize_identity(kind, value):
    value = str(value or "").strip()
    if kind == "phone":
        value = "".join(character for character in value if character.isdigit())
        if value.startswith("86") and len(value) == 13:
            value = value[2:]
        return value if len(value) == 11 else ""
    if kind == "email":
        value = value.casefold()
        if len(value) > 254 or value.count("@") != 1:
            return ""
        local, domain = value.split("@", 1)
        return value if local and "." in domain else ""
    return value[:256]


class VerificationSender:
    def __init__(self, config):
        self.url = str(config.get("VERIFICATION_WEBHOOK_URL") or "")
        self.token = str(config.get("VERIFICATION_WEBHOOK_TOKEN") or "")

    def configured(self):
        return bool(self.url and self.token)

    def send(self, kind, destination, code):
        if not self.configured():
            raise WeChatPayError("验证码服务尚未配置", code="VERIFICATION_NOT_CONFIGURED", status=503)
        payload = json.dumps({"channel": kind, "destination": destination, "code": code}, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(
            self.url,
            data=payload,
            method="POST",
            headers={"Content-Type": "application/json", "Authorization": f"Bearer {self.token}"},
        )
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status >= 300:
                    raise RuntimeError("verification delivery failed")
        except (urllib.error.URLError, TimeoutError, RuntimeError) as exc:
            raise WeChatPayError("验证码发送失败，请稍后重试", code="VERIFICATION_DELIVERY_FAILED", status=502) from exc


def init_schema(conn):
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS user_identities (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            identity_type TEXT NOT NULL,
            identity_hash TEXT NOT NULL,
            identity_masked TEXT NOT NULL DEFAULT '',
            verified_at TEXT NOT NULL,
            created_at TEXT NOT NULL,
            UNIQUE(identity_type, identity_hash),
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE INDEX IF NOT EXISTS idx_user_identities_user ON user_identities(user_id);
        CREATE TABLE IF NOT EXISTS auth_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token_hash TEXT NOT NULL UNIQUE,
            csrf_hash TEXT NOT NULL,
            user_agent TEXT NOT NULL DEFAULT '',
            ip_hash TEXT NOT NULL DEFAULT '',
            last_seen_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            revoked_at TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE INDEX IF NOT EXISTS idx_auth_sessions_user ON auth_sessions(user_id, created_at DESC);
        CREATE TABLE IF NOT EXISTS verification_challenges (
            id TEXT PRIMARY KEY,
            identity_type TEXT NOT NULL,
            identity_hash TEXT NOT NULL,
            identity_masked TEXT NOT NULL,
            code_hash TEXT NOT NULL,
            attempts INTEGER NOT NULL DEFAULT 0,
            expires_at TEXT NOT NULL,
            consumed_at TEXT,
            purpose TEXT NOT NULL DEFAULT 'login',
            request_user_id INTEGER,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS qr_login_sessions (
            ticket_hash TEXT PRIMARY KEY,
            user_id INTEGER,
            source_user_id INTEGER,
            purpose TEXT NOT NULL DEFAULT 'login',
            status TEXT NOT NULL DEFAULT 'PENDING',
            expires_at TEXT NOT NULL,
            confirmed_at TEXT,
            consumed_at TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS content_sample_grants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            visitor_hash TEXT NOT NULL UNIQUE,
            resource_type TEXT NOT NULL,
            resource_id TEXT NOT NULL,
            granted_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS content_access_events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            visitor_hash TEXT,
            resource_type TEXT NOT NULL,
            resource_id TEXT NOT NULL,
            decision TEXT NOT NULL,
            reason TEXT NOT NULL,
            ip_hash TEXT NOT NULL,
            user_agent TEXT NOT NULL DEFAULT '',
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
        CREATE INDEX IF NOT EXISTS idx_content_access_recent ON content_access_events(ip_hash, created_at DESC);
        CREATE TABLE IF NOT EXISTS risk_actions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            actor_hash TEXT NOT NULL,
            action TEXT NOT NULL,
            reason TEXT NOT NULL,
            expires_at TEXT,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS account_merge_requests (
            id TEXT PRIMARY KEY,
            source_user_id INTEGER NOT NULL,
            target_user_id INTEGER NOT NULL,
            identity_type TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'PENDING',
            expires_at TEXT NOT NULL,
            completed_at TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(source_user_id) REFERENCES users(id),
            FOREIGN KEY(target_user_id) REFERENCES users(id)
        );
        CREATE TABLE IF NOT EXISTS account_merge_audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            merge_request_id TEXT NOT NULL,
            source_user_id INTEGER NOT NULL,
            target_user_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            created_at TEXT NOT NULL
        );
        CREATE TABLE IF NOT EXISTS account_security_audits (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            identity_type TEXT,
            session_id INTEGER,
            created_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        );
    """)
    ensure_column(conn, "verification_challenges", "purpose", "TEXT NOT NULL DEFAULT 'login'")
    ensure_column(conn, "verification_challenges", "request_user_id", "INTEGER")
    ensure_column(conn, "qr_login_sessions", "source_user_id", "INTEGER")
    ensure_column(conn, "qr_login_sessions", "purpose", "TEXT NOT NULL DEFAULT 'login'")


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


def sync_legacy_identities(conn, user, secret):
    now = iso(utcnow())
    values = []
    if user["openid"]:
        values.append(("wechat_openid", user["openid"], "微信账号"))
    if user["unionid"]:
        values.append(("wechat_unionid", user["unionid"], "微信联合账号"))
    if user["phone_hash"]:
        values.append(("phone", None, user["phone_masked"] or "手机号"))
    for kind, value, masked in values:
        identity_hash = user["phone_hash"] if kind == "phone" else digest(secret, kind, value)
        conn.execute(
            "INSERT OR IGNORE INTO user_identities(user_id, identity_type, identity_hash, identity_masked, verified_at, created_at) VALUES(?,?,?,?,?,?)",
            (user["id"], kind, identity_hash, masked, now, now),
        )


def register_routes(app, *, db, membership, user_by_id, fulfill_order, complete_refund, record_analytics):
    secret = app.config["SECRET_KEY"]
    sender = VerificationSender(app.config)

    def client_ip():
        return (request.headers.get("X-Forwarded-For") or request.remote_addr or "unknown").split(",")[0].strip()

    def cookie_options():
        return {
            "httponly": True,
            "secure": app.config.get("APP_ENV") == "production",
            "samesite": "Lax",
            "path": "/",
            "max_age": int(app.config["PC_SESSION_DAYS"]) * 86400,
        }

    def session_context(required=False):
        raw = request.cookies.get(SESSION_COOKIE, "")
        if not raw:
            return None
        token_hash = digest(secret, "session", raw)
        now = iso(utcnow())
        with closing(db()) as conn:
            row = conn.execute(
                "SELECT * FROM auth_sessions WHERE token_hash=? AND revoked_at IS NULL AND expires_at>?",
                (token_hash, now),
            ).fetchone()
            if not row:
                return None
            conn.execute("UPDATE auth_sessions SET last_seen_at=? WHERE id=?", (now, row["id"]))
            conn.commit()
            user = user_by_id(conn, row["user_id"])
            return {"session": row, "user": user, "raw": raw}

    def bearer_user():
        header = request.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return None
        serializer = app.extensions["user_token_serializer"]
        try:
            payload = serializer.loads(header[7:], max_age=app.config["TOKEN_MAX_AGE"])
        except Exception:
            return None
        with closing(db()) as conn:
            return user_by_id(conn, payload.get("user_id"))

    def current_user():
        context = session_context()
        return context["user"] if context else bearer_user()

    def require_pc_session(write=False):
        context = session_context()
        if not context:
            return None, (jsonify(error={"code": "AUTH_REQUIRED", "message": "请先登录"}), 401)
        if write:
            csrf = request.headers.get("X-CSRF-Token", "")
            if not csrf or not hmac.compare_digest(digest(secret, "csrf", csrf), context["session"]["csrf_hash"]):
                return None, (jsonify(error={"code": "CSRF_INVALID", "message": "页面安全凭证已过期，请刷新后重试"}), 403)
        return context, None

    def issue_session(conn, user_id):
        token = secrets.token_urlsafe(40)
        csrf = secrets.token_urlsafe(24)
        now = utcnow()
        conn.execute(
            "INSERT INTO auth_sessions(user_id, token_hash, csrf_hash, user_agent, ip_hash, last_seen_at, expires_at, created_at) VALUES(?,?,?,?,?,?,?,?)",
            (
                user_id,
                digest(secret, "session", token),
                digest(secret, "csrf", csrf),
                request.headers.get("User-Agent", "")[:256],
                digest(secret, "ip", client_ip()),
                iso(now),
                iso(now + timedelta(days=int(app.config["PC_SESSION_DAYS"]))),
                iso(now),
            ),
        )
        return token, csrf

    def account_payload(conn, user, csrf=""):
        identities = conn.execute(
            "SELECT identity_type, identity_masked, verified_at FROM user_identities WHERE user_id=? ORDER BY id",
            (user["id"],),
        ).fetchall()
        member = membership(user)
        capabilities = list(CAPABILITIES.values()) + ["analysis.compare", "content.export", "watchlist.sync"] if member["active"] else []
        return {
            "userId": user["id"],
            "profile": {"nickname": user["nickname"] or "观澜用户"},
            "membership": member,
            "capabilities": capabilities,
            "identities": [dict(row) for row in identities],
            "csrfToken": csrf,
        }

    def create_pc_user(conn):
        now = utcnow()
        placeholder = f"pc:{secrets.token_urlsafe(18)}"
        conn.execute(
            "INSERT INTO users(openid, trial_started_at, trial_ends_at, created_at, updated_at) VALUES(?,?,?,?,?)",
            (placeholder, iso(now), iso(now + timedelta(days=7)), iso(now), iso(now)),
        )
        return user_by_id(conn, conn.execute("SELECT last_insert_rowid()").fetchone()[0])

    def merge_accounts(conn, merge_request):
        source_id = int(merge_request["source_user_id"])
        target_id = int(merge_request["target_user_id"])
        source = user_by_id(conn, source_id)
        target = user_by_id(conn, target_id)
        if not source or not target or source["id"] == target["id"]:
            return target or source
        source_id, target_id = int(source["id"]), int(target["id"])
        now = utcnow()
        trial_started = min(datetime.fromisoformat(source["trial_started_at"]), datetime.fromisoformat(target["trial_started_at"]))
        trial_ends = trial_started + timedelta(days=7)
        member_values = [datetime.fromisoformat(value) for value in [source["member_ends_at"], target["member_ends_at"]] if value]
        member_ends = max(member_values).isoformat(timespec="seconds") if member_values else None

        conn.execute(
            """UPDATE users SET trial_started_at=?, trial_ends_at=?, member_ends_at=?, point_balance=?, point_lifetime=?,
               nickname=CASE WHEN nickname IS NULL OR nickname='' OR nickname='观澜用户' THEN ? ELSE nickname END,
               community_member_id=COALESCE(community_member_id, ?), community_name=CASE WHEN community_name='' THEN ? ELSE community_name END,
               community_status=CASE WHEN community_status='none' THEN ? ELSE community_status END,
               community_points=MAX(community_points, ?), updated_at=? WHERE id=?""",
            (
                iso(trial_started), iso(trial_ends), member_ends,
                int(target["point_balance"] or 0) + int(source["point_balance"] or 0),
                int(target["point_lifetime"] or 0) + int(source["point_lifetime"] or 0),
                source["nickname"], source["community_member_id"], source["community_name"], source["community_status"],
                int(source["community_points"] or 0), iso(now), target_id,
            ),
        )
        conn.execute(
            "DELETE FROM user_identities WHERE user_id=? AND EXISTS (SELECT 1 FROM user_identities target WHERE target.user_id=? AND target.identity_type=user_identities.identity_type AND target.identity_hash=user_identities.identity_hash)",
            (source_id, target_id),
        )
        for table in ["user_identities", "auth_sessions", "qr_login_sessions", "content_access_events", "payment_orders", "membership_ledger", "point_ledger", "analytics_events"]:
            conn.execute(f"UPDATE {table} SET user_id=? WHERE user_id=?", (target_id, source_id))
        conn.execute(
            "INSERT OR IGNORE INTO member_behavior_events(user_id, behavior_date, behavior_type, subject_id, created_at) SELECT ?, behavior_date, behavior_type, subject_id, created_at FROM member_behavior_events WHERE user_id=?",
            (target_id, source_id),
        )
        conn.execute("DELETE FROM member_behavior_events WHERE user_id=?", (source_id,))
        conn.execute(
            "INSERT OR IGNORE INTO invite_visits(inviter_user_id, visitor_key, created_at) SELECT ?, visitor_key, created_at FROM invite_visits WHERE inviter_user_id=?",
            (target_id, source_id),
        )
        conn.execute("DELETE FROM invite_visits WHERE inviter_user_id=?", (source_id,))
        if conn.execute("SELECT 1 FROM invite_referrals WHERE invited_user_id=?", (target_id,)).fetchone():
            conn.execute("DELETE FROM invite_referrals WHERE invited_user_id=?", (source_id,))
        else:
            conn.execute("UPDATE invite_referrals SET invited_user_id=? WHERE invited_user_id=?", (target_id, source_id))
        conn.execute("UPDATE invite_referrals SET inviter_user_id=? WHERE inviter_user_id=?", (target_id, source_id))
        conn.execute("DELETE FROM invite_referrals WHERE inviter_user_id=invited_user_id")
        conn.execute("UPDATE users SET merged_into_user_id=?, merged_at=?, updated_at=? WHERE id=?", (target_id, iso(now), iso(now), source_id))
        conn.execute("UPDATE account_merge_requests SET status='COMPLETED', completed_at=? WHERE id=?", (iso(now), merge_request["id"]))
        conn.execute(
            "INSERT INTO account_merge_audits(merge_request_id, source_user_id, target_user_id, action, created_at) VALUES(?,?,?,?,?)",
            (merge_request["id"], source_id, target_id, "MERGED", iso(now)),
        )
        return user_by_id(conn, target_id)

    @app.post("/api/v1/auth/challenges")
    def create_challenge():
        payload = request.get_json(silent=True) or {}
        purpose = str(payload.get("purpose") or "login")
        request_user_id = None
        if purpose == "bind":
            context, error = require_pc_session(write=True)
            if error:
                return error
            request_user_id = context["user"]["id"]
        elif purpose != "login":
            return jsonify(error={"code": "INVALID_PURPOSE", "message": "验证用途无效"}), 400
        kind = str(payload.get("type") or "")
        value = normalize_identity(kind, payload.get("value"))
        if kind != "email" or not value:
            return jsonify(error={"code": "INVALID_IDENTITY", "message": "请输入有效的邮箱"}), 400
        identity_hash = digest(secret, kind, value)
        now = utcnow()
        challenge_id = secrets.token_urlsafe(24)
        code = f"{secrets.randbelow(1000000):06d}"
        with closing(db()) as conn:
            recent = conn.execute(
                "SELECT COUNT(*) FROM verification_challenges WHERE identity_hash=? AND created_at>?",
                (identity_hash, iso(now - timedelta(minutes=10))),
            ).fetchone()[0]
            if recent >= 3:
                return jsonify(error={"code": "TOO_MANY_CHALLENGES", "message": "验证码发送过于频繁，请稍后再试"}), 429
            conn.execute(
                "INSERT INTO verification_challenges(id, identity_type, identity_hash, identity_masked, code_hash, expires_at, purpose, request_user_id, created_at) VALUES(?,?,?,?,?,?,?,?,?)",
                (challenge_id, kind, identity_hash, mask_identity(kind, value), digest(secret, "verification", code), iso(now + timedelta(minutes=10)), purpose, request_user_id, iso(now)),
            )
            conn.commit()
        if not app.config.get("TESTING"):
            try:
                sender.send(kind, value, code)
            except Exception:
                with closing(db()) as conn:
                    conn.execute("DELETE FROM verification_challenges WHERE id=? AND consumed_at IS NULL", (challenge_id,))
                    conn.commit()
                raise
        response = {"challengeId": challenge_id, "masked": mask_identity(kind, value), "expiresIn": 600}
        if app.config.get("TESTING"):
            response["testCode"] = code
        return jsonify(response), 201

    @app.post("/api/v1/auth/challenges/<challenge_id>/verify")
    def verify_challenge(challenge_id):
        code = str((request.get_json(silent=True) or {}).get("code") or "").strip()
        now = utcnow()
        bind_context = None
        with closing(db()) as lookup_conn:
            challenge_purpose = lookup_conn.execute("SELECT purpose FROM verification_challenges WHERE id=?", (challenge_id,)).fetchone()
        if challenge_purpose and challenge_purpose["purpose"] == "bind":
            bind_context, bind_error = require_pc_session(write=True)
            if bind_error:
                return bind_error
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            challenge = conn.execute("SELECT * FROM verification_challenges WHERE id=?", (challenge_id,)).fetchone()
            if not challenge or challenge["consumed_at"] or challenge["expires_at"] <= iso(now):
                return jsonify(error={"code": "CHALLENGE_EXPIRED", "message": "验证码已失效，请重新获取"}), 410
            if challenge["identity_type"] != "email":
                return jsonify(error={"code": "UNSUPPORTED_IDENTITY", "message": "PC 端仅支持邮箱或微信扫码登录"}), 400
            if challenge["attempts"] >= 5 or not hmac.compare_digest(challenge["code_hash"], digest(secret, "verification", code)):
                conn.execute("UPDATE verification_challenges SET attempts=attempts+1 WHERE id=?", (challenge_id,))
                conn.commit()
                return jsonify(error={"code": "INVALID_CODE", "message": "验证码不正确"}), 400
            if challenge["purpose"] == "bind":
                context = bind_context
                if int(challenge["request_user_id"] or 0) != int(context["user"]["id"]):
                    return jsonify(error={"code": "BIND_SESSION_MISMATCH", "message": "绑定验证与当前账户不一致"}), 403
                identity = conn.execute(
                    "SELECT * FROM user_identities WHERE identity_type=? AND identity_hash=?",
                    (challenge["identity_type"], challenge["identity_hash"]),
                ).fetchone()
                if identity and int(identity["user_id"]) != int(context["user"]["id"]):
                    merge_id = secrets.token_urlsafe(24)
                    conn.execute("UPDATE verification_challenges SET consumed_at=? WHERE id=?", (iso(now), challenge_id))
                    conn.execute(
                        "INSERT INTO account_merge_requests(id, source_user_id, target_user_id, identity_type, expires_at, created_at) VALUES(?,?,?,?,?,?)",
                        (merge_id, context["user"]["id"], identity["user_id"], challenge["identity_type"], iso(now + timedelta(minutes=10)), iso(now)),
                    )
                    conn.execute(
                        "INSERT INTO account_merge_audits(merge_request_id, source_user_id, target_user_id, action, created_at) VALUES(?,?,?,?,?)",
                        (merge_id, context["user"]["id"], identity["user_id"], "REQUESTED", iso(now)),
                    )
                    conn.commit()
                    return jsonify(error={"code": "ACCOUNT_MERGE_REQUIRED", "message": "该身份属于另一账户，请确认合并", "mergeId": merge_id}), 409
                if not identity:
                    conn.execute(
                        "INSERT INTO user_identities(user_id, identity_type, identity_hash, identity_masked, verified_at, created_at) VALUES(?,?,?,?,?,?)",
                        (context["user"]["id"], challenge["identity_type"], challenge["identity_hash"], challenge["identity_masked"], iso(now), iso(now)),
                    )
                    conn.execute(
                        "INSERT INTO account_security_audits(user_id, action, identity_type, session_id, created_at) VALUES(?,?,?,?,?)",
                        (context["user"]["id"], "IDENTITY_BOUND", challenge["identity_type"], context["session"]["id"], iso(now)),
                    )
                conn.execute("UPDATE verification_challenges SET consumed_at=? WHERE id=?", (iso(now), challenge_id))
                conn.commit()
                return jsonify(account_payload(conn, user_by_id(conn, context["user"]["id"]), ""))
            identity = conn.execute(
                "SELECT * FROM user_identities WHERE identity_type=? AND identity_hash=?",
                (challenge["identity_type"], challenge["identity_hash"]),
            ).fetchone()
            user = user_by_id(conn, identity["user_id"]) if identity else create_pc_user(conn)
            if not identity:
                conn.execute(
                    "INSERT INTO user_identities(user_id, identity_type, identity_hash, identity_masked, verified_at, created_at) VALUES(?,?,?,?,?,?)",
                    (user["id"], challenge["identity_type"], challenge["identity_hash"], challenge["identity_masked"], iso(now), iso(now)),
                )
            conn.execute("UPDATE verification_challenges SET consumed_at=? WHERE id=?", (iso(now), challenge_id))
            token, csrf = issue_session(conn, user["id"])
            record_analytics(conn, "pc_login_success", user["id"], {"identityType": challenge["identity_type"]}, event_key=challenge_id)
            conn.commit()
            payload = account_payload(conn, user_by_id(conn, user["id"]), csrf)
        response = make_response(jsonify(payload))
        response.set_cookie(SESSION_COOKIE, token, **cookie_options())
        return response

    @app.post("/api/v1/account/merge-requests/<merge_id>/confirm")
    def confirm_account_merge(merge_id):
        context, error = require_pc_session(write=True)
        if error:
            return error
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            merge_request = conn.execute("SELECT * FROM account_merge_requests WHERE id=?", (merge_id,)).fetchone()
            if not merge_request or merge_request["status"] != "PENDING" or merge_request["expires_at"] <= iso(utcnow()):
                return jsonify(error={"code": "MERGE_REQUEST_EXPIRED", "message": "合并确认已失效，请重新验证"}), 410
            if int(merge_request["source_user_id"]) != int(context["user"]["id"]):
                return jsonify(error={"code": "MERGE_FORBIDDEN", "message": "无权处理该合并"}), 403
            user = merge_accounts(conn, merge_request)
            conn.commit()
            return jsonify(account_payload(conn, user, ""))

    @app.get("/api/v1/auth/session")
    def get_session():
        context = session_context()
        if not context:
            return jsonify(authenticated=False)
        csrf = secrets.token_urlsafe(24)
        with closing(db()) as conn:
            conn.execute("UPDATE auth_sessions SET csrf_hash=? WHERE id=?", (digest(secret, "csrf", csrf), context["session"]["id"]))
            conn.commit()
            return jsonify(authenticated=True, **account_payload(conn, context["user"], csrf))

    @app.post("/api/v1/auth/logout")
    def logout():
        context, error = require_pc_session(write=True)
        if error:
            return error
        with closing(db()) as conn:
            now = iso(utcnow())
            conn.execute("UPDATE auth_sessions SET revoked_at=? WHERE id=?", (now, context["session"]["id"]))
            conn.execute(
                "INSERT INTO account_security_audits(user_id, action, session_id, created_at) VALUES(?,?,?,?)",
                (context["user"]["id"], "SESSION_LOGOUT", context["session"]["id"], now),
            )
            conn.commit()
        response = make_response("", 204)
        response.delete_cookie(SESSION_COOKIE, path="/")
        return response

    @app.get("/api/v1/auth/sessions")
    def list_sessions():
        context, error = require_pc_session()
        if error:
            return error
        with closing(db()) as conn:
            rows = conn.execute(
                "SELECT id, user_agent, last_seen_at, expires_at, created_at FROM auth_sessions WHERE user_id=? AND revoked_at IS NULL ORDER BY created_at DESC",
                (context["user"]["id"],),
            ).fetchall()
            return jsonify(sessions=[dict(row) for row in rows], currentSessionId=context["session"]["id"])

    @app.delete("/api/v1/auth/sessions/<int:session_id>")
    def revoke_session(session_id):
        context, error = require_pc_session(write=True)
        if error:
            return error
        with closing(db()) as conn:
            now = iso(utcnow())
            result = conn.execute("UPDATE auth_sessions SET revoked_at=? WHERE id=? AND user_id=? AND revoked_at IS NULL", (now, session_id, context["user"]["id"]))
            if result.rowcount:
                conn.execute(
                    "INSERT INTO account_security_audits(user_id, action, session_id, created_at) VALUES(?,?,?,?)",
                    (context["user"]["id"], "SESSION_REVOKED", session_id, now),
                )
            conn.commit()
        return "", 204

    @app.post("/api/v1/auth/qr-sessions")
    def create_qr_session():
        payload = request.get_json(silent=True) or {}
        purpose = str(payload.get("purpose") or "login")
        source_user_id = None
        if purpose == "bind":
            context, error = require_pc_session(write=True)
            if error:
                return error
            source_user_id = context["user"]["id"]
        elif purpose != "login":
            return jsonify(error={"code": "INVALID_PURPOSE", "message": "二维码用途无效"}), 400
        ticket = secrets.token_urlsafe(30)
        now = utcnow()
        with closing(db()) as conn:
            conn.execute(
                "INSERT INTO qr_login_sessions(ticket_hash, source_user_id, purpose, expires_at, created_at) VALUES(?,?,?,?,?)",
                (digest(secret, "qr", ticket), source_user_id, purpose, iso(now + timedelta(minutes=5)), iso(now)),
            )
            conn.commit()
        return jsonify(ticket=ticket, expiresIn=300, codeImageUrl=f"/api/v1/auth/qr-sessions/{ticket}/code"), 201

    @app.get("/api/v1/auth/qr-sessions/<ticket>/code")
    def qr_session_code(ticket):
        ticket_hash = digest(secret, "qr", ticket)
        with closing(db()) as conn:
            row = conn.execute("SELECT * FROM qr_login_sessions WHERE ticket_hash=?", (ticket_hash,)).fetchone()
        if not row or row["expires_at"] <= iso(utcnow()):
            return jsonify(error={"code": "QR_EXPIRED", "message": "二维码已失效"}), 410
        image = app.pay_client.create_mini_program_code(f"pages/account-qr/index?ticket={ticket}")
        response = make_response(image)
        response.headers["Content-Type"] = "image/png"
        response.headers["Cache-Control"] = "no-store"
        return response

    @app.post("/api/v1/auth/qr-sessions/<ticket>/confirm")
    def confirm_qr_session(ticket):
        user = bearer_user()
        if not user:
            return jsonify(error={"code": "AUTH_REQUIRED", "message": "请先在小程序登录"}), 401
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM qr_login_sessions WHERE ticket_hash=?", (digest(secret, "qr", ticket),)).fetchone()
            if not row or row["status"] != "PENDING" or row["expires_at"] <= iso(utcnow()):
                return jsonify(error={"code": "QR_EXPIRED", "message": "二维码已失效"}), 410
            conn.execute("UPDATE qr_login_sessions SET status='CONFIRMED', user_id=?, confirmed_at=? WHERE ticket_hash=?", (user["id"], iso(utcnow()), row["ticket_hash"]))
            conn.commit()
        return jsonify(status="CONFIRMED")

    @app.get("/api/v1/auth/qr-sessions/<ticket>")
    def poll_qr_session(ticket):
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM qr_login_sessions WHERE ticket_hash=?", (digest(secret, "qr", ticket),)).fetchone()
            if not row or row["expires_at"] <= iso(utcnow()):
                return jsonify(status="EXPIRED"), 410
            if row["status"] != "CONFIRMED" or row["consumed_at"]:
                return jsonify(status=row["status"])
            if row["purpose"] == "bind":
                source_user = user_by_id(conn, row["source_user_id"])
                target_user = user_by_id(conn, row["user_id"])
                if not source_user or not target_user:
                    return jsonify(error={"code": "ACCOUNT_NOT_FOUND", "message": "账户不存在"}), 404
                if int(source_user["id"]) == int(target_user["id"]):
                    conn.execute("UPDATE qr_login_sessions SET consumed_at=? WHERE ticket_hash=?", (iso(utcnow()), row["ticket_hash"]))
                    conn.commit()
                    return jsonify(status="BOUND", **account_payload(conn, target_user, ""))
                merge_id = secrets.token_urlsafe(24)
                now = utcnow()
                conn.execute(
                    "INSERT INTO account_merge_requests(id, source_user_id, target_user_id, identity_type, expires_at, created_at) VALUES(?,?,?,?,?,?)",
                    (merge_id, source_user["id"], target_user["id"], "wechat", iso(now + timedelta(minutes=10)), iso(now)),
                )
                conn.execute(
                    "INSERT INTO account_merge_audits(merge_request_id, source_user_id, target_user_id, action, created_at) VALUES(?,?,?,?,?)",
                    (merge_id, source_user["id"], target_user["id"], "REQUESTED", iso(now)),
                )
                conn.execute("UPDATE qr_login_sessions SET consumed_at=? WHERE ticket_hash=?", (iso(now), row["ticket_hash"]))
                conn.commit()
                return jsonify(status="MERGE_REQUIRED", mergeId=merge_id)
            token, csrf = issue_session(conn, row["user_id"])
            conn.execute("UPDATE qr_login_sessions SET consumed_at=? WHERE ticket_hash=?", (iso(utcnow()), row["ticket_hash"]))
            user = user_by_id(conn, row["user_id"])
            conn.commit()
            payload = account_payload(conn, user, csrf)
        response = make_response(jsonify(status="AUTHENTICATED", **payload))
        response.set_cookie(SESSION_COOKIE, token, **cookie_options())
        return response

    @app.get("/api/v1/account/me")
    def account_me():
        user = current_user()
        if not user:
            return jsonify(error={"code": "AUTH_REQUIRED", "message": "请先登录"}), 401
        with closing(db()) as conn:
            return jsonify(account_payload(conn, user))

    @app.get("/api/v1/account/products")
    def account_products():
        return jsonify(products=[
            {"id": plan_id, "title": plan["title"], "totalCents": plan["total_cents"], "days": plan["days"]}
            for plan_id, plan in app.config["MEMBERSHIP_PLANS"].items()
        ])

    @app.get("/api/v1/account/orders")
    def account_orders():
        context, error = require_pc_session()
        if error:
            return error
        with closing(db()) as conn:
            rows = conn.execute(
                "SELECT order_no, plan_id, description, total_cents, status, refund_status, paid_at, created_at FROM payment_orders WHERE user_id=? ORDER BY created_at DESC LIMIT 30",
                (context["user"]["id"],),
            ).fetchall()
            now = utcnow()
            orders = []
            for row in rows:
                item = dict(row)
                item["refundable"] = bool(row["paid_at"] and row["status"] == "PAID" and now <= datetime.fromisoformat(row["paid_at"]) + timedelta(days=15))
                orders.append(item)
            return jsonify(orders=orders)

    @app.post("/api/v1/pay/native/orders")
    def create_native_order():
        context, error = require_pc_session(write=True)
        if error:
            return error
        payload = request.get_json(silent=True) or {}
        plan_id = str(payload.get("planId") or "")
        idempotency_key = str(payload.get("idempotencyKey") or request.headers.get("Idempotency-Key") or "").strip()
        if not (16 <= len(idempotency_key) <= 80) or any(character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-" for character in idempotency_key):
            return jsonify(error={"code": "INVALID_IDEMPOTENCY_KEY", "message": "订单请求标识无效"}), 400
        plans = app.config["MEMBERSHIP_PLANS"]
        if plan_id not in plans:
            return jsonify(error={"code": "INVALID_PLAN", "message": "会员套餐不存在"}), 400
        plan = plans[plan_id]
        now = utcnow()
        order_no = f"GLPC{now.strftime('%Y%m%d%H%M%S')}{secrets.token_hex(5).upper()}"
        with closing(db()) as conn:
            existing = conn.execute(
                "SELECT * FROM payment_orders WHERE user_id=? AND idempotency_key=?",
                (context["user"]["id"], idempotency_key),
            ).fetchone()
            if existing:
                if existing["plan_id"] != plan_id:
                    return jsonify(error={"code": "IDEMPOTENCY_CONFLICT", "message": "同一订单请求标识不能用于不同套餐"}), 409
                if existing["code_url"]:
                    qr_buffer = io.BytesIO()
                    qrcode.make(existing["code_url"]).save(qr_buffer, format="PNG")
                    return jsonify(
                        orderNo=existing["order_no"],
                        plan={"id": plan_id, **plan},
                        payment={
                            "codeUrl": existing["code_url"],
                            "qrDataUrl": "data:image/png;base64," + base64.b64encode(qr_buffer.getvalue()).decode("ascii"),
                        },
                    )
                return jsonify(error={"code": "ORDER_CREATE_IN_PROGRESS", "message": "订单正在创建，请稍后重试"}), 409
            conn.execute(
                "INSERT INTO payment_orders(order_no, user_id, plan_id, description, total_cents, status, payment_mode, idempotency_key, created_at, updated_at) VALUES(?,?,?,?,?,'PENDING','wechat_native',?,?,?)",
                (order_no, context["user"]["id"], plan_id, plan["title"], plan["total_cents"], idempotency_key, iso(now), iso(now)),
            )
            record_analytics(conn, "payment_order_created", context["user"]["id"], {"orderNo": order_no, "planId": plan_id, "platform": "pc"}, event_key=order_no)
            conn.commit()
        try:
            payment = app.pay_client.create_native_order(
                order_no=order_no,
                description=plan["title"],
                total_cents=plan["total_cents"],
                client_ip=client_ip(),
            )
        except Exception:
            with closing(db()) as conn:
                conn.execute("UPDATE payment_orders SET status='CREATE_FAILED', updated_at=? WHERE order_no=?", (iso(utcnow()), order_no))
                conn.commit()
            raise
        code_url = payment["codeUrl"]
        with closing(db()) as conn:
            conn.execute("UPDATE payment_orders SET code_url=?, updated_at=? WHERE order_no=?", (code_url, iso(utcnow()), order_no))
            conn.commit()
        qr_buffer = io.BytesIO()
        qrcode.make(code_url).save(qr_buffer, format="PNG")
        payment["qrDataUrl"] = "data:image/png;base64," + base64.b64encode(qr_buffer.getvalue()).decode("ascii")
        return jsonify(orderNo=order_no, plan={"id": plan_id, **plan}, payment=payment), 201

    @app.get("/api/v1/pay/native/orders/<order_no>")
    def native_order(order_no):
        context, error = require_pc_session()
        if error:
            return error
        with closing(db()) as conn:
            order = conn.execute("SELECT * FROM payment_orders WHERE order_no=? AND user_id=? AND payment_mode='wechat_native'", (order_no, context["user"]["id"])).fetchone()
            if not order:
                return jsonify(error={"code": "ORDER_NOT_FOUND", "message": "订单不存在"}), 404
            if order["status"] == "PENDING":
                transaction = app.pay_client.query_order(order_no)
                conn.execute("BEGIN IMMEDIATE")
                fresh = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
                if transaction.get("trade_state") == "SUCCESS":
                    fulfill_order(conn, fresh, transaction)
                conn.commit()
                order = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
            elif order["status"] == "REFUNDING" and order["refund_no"]:
                refund = app.pay_client.query_refund(order["refund_no"])
                if refund.get("status") == "SUCCESS":
                    conn.execute("BEGIN IMMEDIATE")
                    complete_refund(conn, order, source_type="wechat_pay", refunded_at=refund.get("success_time") or iso(utcnow()))
                    conn.commit()
                    order = conn.execute("SELECT * FROM payment_orders WHERE id=?", (order["id"],)).fetchone()
            return jsonify(order={"orderNo": order_no, "status": order["status"], "refundStatus": order["refund_status"]}, membership=membership(user_by_id(conn, context["user"]["id"])))

    @app.post("/api/v1/pay/native/orders/<order_no>/refund")
    def refund_native_order(order_no):
        context, error = require_pc_session(write=True)
        if error:
            return error
        with closing(db()) as conn:
            order = conn.execute("SELECT * FROM payment_orders WHERE order_no=? AND user_id=? AND payment_mode='wechat_native'", (order_no, context["user"]["id"])).fetchone()
            if not order or order["status"] not in {"PAID", "REFUNDING"}:
                return jsonify(error={"code": "ORDER_NOT_REFUNDABLE", "message": "该订单当前不可退款"}), 409
            if utcnow() > datetime.fromisoformat(order["paid_at"]) + timedelta(days=15):
                return jsonify(error={"code": "REFUND_WINDOW_EXPIRED", "message": "已超过15天退款有效期"}), 409
            if order["refund_status"] == "REFUNDED":
                return jsonify(order={"orderNo": order_no, "refundStatus": "REFUNDED"})
            refund_no = order["refund_no"] or f"GLPCR{utcnow().strftime('%Y%m%d%H%M%S')}{secrets.token_hex(4).upper()}"
            result = app.pay_client.refund_order(order_no=order_no, refund_no=refund_no, total_cents=order["total_cents"])
            status = str(result.get("status") or "PROCESSING")
            if status == "SUCCESS":
                complete_refund(conn, order, source_type="wechat_pay")
            else:
                conn.execute("UPDATE payment_orders SET status='REFUNDING', refund_status='PROCESSING', refund_no=?, updated_at=? WHERE id=?", (refund_no, iso(utcnow()), order["id"]))
            conn.commit()
            return jsonify(order={"orderNo": order_no, "refundStatus": "REFUNDED" if status == "SUCCESS" else "PROCESSING"}), 202

    def visitor_identity(response=None):
        raw = request.cookies.get(VISITOR_COOKIE, "") or request.headers.get("X-Visitor-ID", "")
        if raw and (len(raw) < 20 or len(raw) > 128 or any(character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-" for character in raw)):
            raw = ""
        created = False
        if not raw:
            raw = secrets.token_urlsafe(28)
            created = True
        return raw, created

    def resource_path(kind, resource_id):
        if kind not in CONTENT_KINDS or not resource_id or len(resource_id) > 160 or any(character not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-" for character in resource_id):
            return None
        root = Path(app.config["CONTENT_ROOT"]).resolve()
        path = (root / kind / f"{resource_id}.json").resolve()
        return path if root in path.parents else None

    @app.get("/api/v1/content/<kind>/<resource_id>")
    def protected_content(kind, resource_id):
        path = resource_path(kind, resource_id)
        if not path or not path.is_file():
            return jsonify(error={"code": "CONTENT_NOT_FOUND", "message": "内容不存在"}), 404
        content = json.loads(path.read_text(encoding="utf-8"))
        access_resource_id = str(content.get("_canonicalId") or resource_id) if isinstance(content, dict) else resource_id
        authorization_present = bool(request.headers.get("Authorization", ""))
        user = current_user()
        if authorization_present and not user:
            response = make_response(jsonify(error={"code": "AUTH_INVALID", "message": "登录状态已失效，请重新登录"}), 401)
            response.headers["Cache-Control"] = "private, no-store, max-age=0"
            response.headers["Vary"] = "Cookie, Authorization"
            return response
        raw_visitor, visitor_created = visitor_identity()
        visitor_hash = digest(secret, "visitor", raw_visitor)
        ip_hash = digest(secret, "ip", client_ip())
        now = utcnow()
        decision = "DENY"
        reason = "MEMBERSHIP_REQUIRED"
        with closing(db()) as conn:
            recent = conn.execute("SELECT COUNT(*) FROM content_access_events WHERE ip_hash=? AND created_at>?", (ip_hash, iso(now - timedelta(minutes=1)))).fetchone()[0]
            if recent >= int(app.config["CONTENT_RATE_PER_MINUTE"]):
                reason = "RATE_LIMITED"
            elif user and membership(user)["active"]:
                decision, reason = "ALLOW", "ENTITLED"
            elif not user:
                conn.execute("BEGIN IMMEDIATE")
                grant = conn.execute("SELECT * FROM content_sample_grants WHERE visitor_hash=?", (visitor_hash,)).fetchone()
                if not grant:
                    conn.execute("INSERT INTO content_sample_grants(visitor_hash, resource_type, resource_id, granted_at) VALUES(?,?,?,?)", (visitor_hash, kind, access_resource_id, iso(now)))
                    decision, reason = "ALLOW", "FIRST_SAMPLE"
                elif grant["resource_type"] == kind and grant["resource_id"] == access_resource_id:
                    decision, reason = "ALLOW", "SAME_SAMPLE"
            conn.execute(
                "INSERT INTO content_access_events(user_id, visitor_hash, resource_type, resource_id, decision, reason, ip_hash, user_agent, created_at) VALUES(?,?,?,?,?,?,?,?,?)",
                (user["id"] if user else None, visitor_hash, kind, access_resource_id, decision, reason, ip_hash, request.headers.get("User-Agent", "")[:256], iso(now)),
            )
            conn.commit()
        if reason == "RATE_LIMITED":
            response = make_response(jsonify(error={"code": reason, "message": "访问较频繁，请稍后再试"}), 429)
        elif decision != "ALLOW":
            response = make_response(jsonify(
                error={"code": "MEMBERSHIP_REQUIRED", "message": "注册后可继续浏览，会员可查看全部内容"},
                preview={"resourceType": kind, "resourceId": resource_id},
                requiredCapability=CAPABILITIES[kind],
            ), 403)
        else:
            if isinstance(content, dict):
                content = {key: value for key, value in content.items() if key != "_canonicalId"}
            response = make_response(jsonify(content=content, access={"reason": reason, "capability": CAPABILITIES[kind]}))
        response.headers["Cache-Control"] = "private, no-store, max-age=0"
        response.headers["Vary"] = "Cookie, Authorization"
        if visitor_created:
            response.set_cookie(VISITOR_COOKIE, raw_visitor, httponly=True, secure=app.config.get("APP_ENV") == "production", samesite="Lax", max_age=31536000, path="/")
        return response

    return {"sync_legacy_identities": lambda conn, user: sync_legacy_identities(conn, user, secret)}
