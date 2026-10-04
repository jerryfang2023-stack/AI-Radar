"""Read-only Google authorization and leased, atomic Search Console snapshots."""
import base64
from contextlib import closing
from datetime import date, datetime, timedelta
import hashlib
import hmac
import html
import json
from pathlib import Path
import secrets
from urllib.parse import quote, urlencode
from zoneinfo import ZoneInfo

from cryptography.fernet import Fernet, InvalidToken
from flask import g, jsonify, request, Response

from payment_service.search_growth import LOCAL, count, own_url

SCOPE = "https://www.googleapis.com/auth/webmasters.readonly"
CALLBACK = "https://www.zkdlj.vip/ops/growth-api/google/callback"
TOKEN_URI = "https://oauth2.googleapis.com/token"
API = "https://www.googleapis.com/webmasters/v3/sites/"
ERRORS = {
    "config": "服务配置无效，请联系管理员",
    "reauthorize": "Google 授权已失效，请重新授权",
    "permission": "当前 Google 账号没有本站权限",
    "network": "Google 暂时无法访问，请稍后重试",
    "format": "Google 报表格式无效",
}


class GoogleError(Exception):
    def __init__(self, code):
        self.code = code
        super().__init__(ERRORS[code])


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


class Connector:
    def __init__(self, app, db, clock):
        self.app, self.db, self.clock = app, db, clock
        key = hmac.new(str(app.config["SECRET_KEY"]).encode(), b"gsc-token-encryption-v1", hashlib.sha256).digest()
        self.cipher = Fernet(base64.urlsafe_b64encode(key))
        with closing(db()) as conn:
            conn.executescript("""
                CREATE TABLE IF NOT EXISTS operations_google_connection (
                    id INTEGER PRIMARY KEY CHECK(id=1), generation TEXT NOT NULL,
                    tokens TEXT NOT NULL, actor_hash TEXT NOT NULL, connected_at TEXT NOT NULL,
                    requested INTEGER NOT NULL DEFAULT 1, lease TEXT, lease_until TEXT,
                    attempted_at TEXT, synced_at TEXT, error_code TEXT, snapshot_json TEXT
                );
                CREATE TABLE IF NOT EXISTS operations_google_pending (
                    state_hash TEXT PRIMARY KEY, session_id INTEGER NOT NULL,
                    verifier TEXT NOT NULL, expires_at TEXT NOT NULL,
                    ticket_hash TEXT UNIQUE, code TEXT, phase TEXT NOT NULL DEFAULT 'pending'
                );
                CREATE TABLE IF NOT EXISTS operations_google_snapshots (
                    id INTEGER PRIMARY KEY, generation TEXT NOT NULL, content_hash TEXT UNIQUE NOT NULL,
                    payload_json TEXT NOT NULL, synced_at TEXT NOT NULL
                );
            """)
            conn.commit()

    def seal(self, value):
        return self.cipher.encrypt(json.dumps(value).encode()).decode()

    def open(self, value):
        try:
            return json.loads(self.cipher.decrypt(value.encode()))
        except (InvalidToken, ValueError, TypeError):
            raise GoogleError("config") from None

    def config(self):
        try:
            path = self.app.config.get("GSC_CLIENT_CONFIG_PATH")
            if not path:
                raise GoogleError("config")
            raw = json.loads(Path(path).read_text(encoding="utf-8"))["web"]
            if not raw.get("client_secret") or not raw.get("client_id", "").endswith(".apps.googleusercontent.com") or CALLBACK not in raw.get("redirect_uris", []):
                raise GoogleError("config")
            return {"web": {"client_id": raw["client_id"], "client_secret": raw["client_secret"],
                            "auth_uri": "https://accounts.google.com/o/oauth2/auth", "token_uri": TOKEN_URI,
                            "redirect_uris": [CALLBACK]}}
        except (OSError, KeyError, ValueError, TypeError):
            raise GoogleError("config") from None

    def property(self):
        value = self.app.config.get("GSC_PROPERTY", "sc-domain:zkdlj.vip")
        if value not in {"sc-domain:zkdlj.vip", "https://www.zkdlj.vip/"}:
            raise GoogleError("config")
        return value

    def flow(self, verifier):
        from google_auth_oauthlib.flow import Flow
        return Flow.from_client_config(self.config(), scopes=[SCOPE], redirect_uri=CALLBACK, code_verifier=verifier)

    def status(self):
        configured = False
        try:
            self.config(); self.property(); configured = True
        except GoogleError:
            pass
        with closing(self.db()) as conn:
            row = conn.execute("SELECT * FROM operations_google_connection WHERE id=1").fetchone()
        return {"configured": configured, "connected": bool(row),
                "status": "not_configured" if not configured else "not_connected" if not row else "reauthorize" if row["error_code"] == "reauthorize" else "syncing" if row["lease_until"] and row["lease_until"] > self.clock().isoformat() else "queued" if row["requested"] else "failed" if row["error_code"] else "connected",
                "syncedAt": row["synced_at"] if row else None,
                "latestDataDate": json.loads(row["snapshot_json"])["latestDataDate"] if row and row["snapshot_json"] else None,
                "message": ERRORS.get(row["error_code"], "") if row else ""}

    def start(self, session):
        self.property()
        state, verifier = secrets.token_urlsafe(32), secrets.token_urlsafe(64)
        url, _ = self.flow(verifier).authorization_url(state=state, access_type="offline", prompt="consent", include_granted_scopes="false")
        with closing(self.db()) as conn:
            conn.execute("DELETE FROM operations_google_pending WHERE expires_at<? OR session_id=?", (self.clock().isoformat(), session["id"]))
            conn.execute("INSERT INTO operations_google_pending(state_hash,session_id,verifier,expires_at) VALUES(?,?,?,?)",
                         (digest(state), session["id"], self.seal(verifier), (self.clock()+timedelta(minutes=10)).isoformat()))
            conn.commit()
        return url

    def callback(self, state, code):
        if not state or not code or len(state)>128 or len(code)>2048:
            return None
        ticket = secrets.token_urlsafe(32)
        with closing(self.db()) as conn:
            cursor = conn.execute("UPDATE operations_google_pending SET ticket_hash=?,code=?,phase='staged' WHERE state_hash=? AND expires_at>? AND phase='pending'",
                                  (digest(ticket), self.seal(code), digest(state), self.clock().isoformat()))
            conn.commit()
            return ticket if cursor.rowcount == 1 else None

    def exchange(self, verifier, code):
        try:
            flow = self.flow(verifier)
            flow.fetch_token(code=code, timeout=10)
            cred = flow.credentials
            if not cred.refresh_token or SCOPE not in (cred.granted_scopes or cred.scopes or []):
                raise GoogleError("reauthorize")
            return {"refresh_token": cred.refresh_token}
        except GoogleError:
            raise
        except Exception:
            # Provider responses may contain credentials. Never persist or log exceptions.
            raise GoogleError("reauthorize") from None

    def finish(self, session, ticket):
        if not isinstance(ticket, str) or len(ticket)>128:
            raise GoogleError("reauthorize")
        with closing(self.db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM operations_google_pending WHERE ticket_hash=? AND session_id=? AND expires_at>? AND phase='staged'", (digest(ticket), session["id"], self.clock().isoformat())).fetchone()
            if not row:
                raise GoogleError("reauthorize")
            conn.execute("UPDATE operations_google_pending SET ticket_hash=NULL,code=NULL,phase='exchanging' WHERE state_hash=?", (row["state_hash"],))
            conn.commit()
        tokens = self.exchange(self.open(row["verifier"]), self.open(row["code"]))
        # Confirm property access before replacing the current connection.
        with self.api_session(tokens) as remote:
            response = remote.get(API, timeout=10)
            if response.status_code != 200:
                raise GoogleError("permission" if response.status_code in {401,403} else "network")
            if self.property() not in {r.get("siteUrl") for r in response.json().get("siteEntry", []) if r.get("permissionLevel") != "siteUnverifiedUser"}:
                raise GoogleError("permission")
        with closing(self.db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            # Logout during the Google exchange cancels completion.
            active = conn.execute("SELECT revoked_at,expires_at FROM operations_admin_sessions WHERE id=?", (session["id"],)).fetchone()
            if not active or active["revoked_at"] or active["expires_at"] <= self.clock().isoformat():
                raise GoogleError("reauthorize")
            if not conn.execute("SELECT 1 FROM operations_google_pending WHERE state_hash=? AND phase='exchanging' AND expires_at>?", (row["state_hash"],self.clock().isoformat())).fetchone():
                raise GoogleError("reauthorize")
            conn.execute("DELETE FROM operations_google_pending WHERE state_hash=?", (row["state_hash"],))
            conn.execute("INSERT OR REPLACE INTO operations_google_connection(id,generation,tokens,actor_hash,connected_at) VALUES(1,?,?,?,?)",
                         (secrets.token_urlsafe(24), self.seal(tokens), session["email_hash"], self.clock().isoformat()))
            conn.commit()

    def api_session(self, tokens):
        from google.auth.transport.requests import AuthorizedSession, Request
        from google.oauth2.credentials import Credentials
        from google.auth.exceptions import RefreshError
        import requests
        cfg = self.config()["web"]
        cred = Credentials(token=None, refresh_token=tokens["refresh_token"], token_uri=TOKEN_URI,
                           client_id=cfg["client_id"], client_secret=cfg["client_secret"], scopes=[SCOPE])
        with requests.Session() as transport:
            try:
                google_request = Request(session=transport)
                def bounded_request(**kwargs):
                    kwargs["timeout"] = 10
                    return google_request(**kwargs)
                cred.refresh(bounded_request)
            except RefreshError as exc:
                raise GoogleError("network" if getattr(exc,"retryable",False) else "reauthorize") from None
            except requests.RequestException:
                raise GoogleError("network") from None
        return AuthorizedSession(cred, refresh_timeout=10, max_refresh_attempts=0)

    def request_sync(self):
        with closing(self.db()) as conn:
            conn.execute("UPDATE operations_google_connection SET requested=1 WHERE id=1")
            conn.commit()

    def disconnect(self):
        with closing(self.db()) as conn:
            conn.execute("DELETE FROM operations_google_connection")
            conn.execute("DELETE FROM operations_google_pending")
            conn.commit()

    def query(self, remote, start, end, dimension):
        payload = {"startDate": start, "endDate": end, "dimensions": [dimension], "type": "web", "dataState": "final", "rowLimit": 5000,
                   "dimensionFilterGroups": [{"filters": [{"dimension": "page", "operator": "includingRegex", "expression": r"^https://www\.zkdlj\.vip/"}]}]}
        response = remote.post(API+quote(self.property(), safe="")+"/searchAnalytics/query", json=payload, timeout=10)
        if response.status_code != 200:
            raise GoogleError("permission" if response.status_code in {401,403} else "network")
        raw = response.json().get("rows", [])
        rows, seen = [], set()
        if not isinstance(raw, list) or len(raw)>5000:
            raise GoogleError("format")
        for item in raw:
            keys = item.get("keys", [])
            if len(keys)!=1 or not isinstance(keys[0], str) or keys[0] in seen:
                raise GoogleError("format")
            key = keys[0]; seen.add(key)
            if dimension == "page":
                # Parameter URLs cannot be represented by the existing canonical page contract.
                try: own_url(key)
                except ValueError: continue
            if dimension == "query" and (not key or len(key)>200): continue
            if dimension == "date" and (date.fromisoformat(key).isoformat()!=key or not start <= key <= end): raise GoogleError("format")
            def api_count(value):
                if isinstance(value,float) and value.is_integer(): value=int(value)
                return count(value)
            clicks, impressions = api_count(item.get("clicks")), api_count(item.get("impressions"))
            position = item.get("position")
            if clicks is None or impressions is None or clicks>impressions or isinstance(position, bool) or not isinstance(position,(int,float)) or not 0 < position <= 10000:
                raise GoogleError("format")
            rows.append({dimension:key, "clicks":clicks, "impressions":impressions, "position":position})
        if dimension == "date": rows.sort(key=lambda row:row["date"])
        return {"startDate":start, "endDate":end, "rows":rows, "source":"google_api", "topRowsOnly":dimension!="date", "rowLimitReached":len(raw)==5000}

    def sync_due(self):
        now = self.clock(); local = now.astimezone(LOCAL)
        lease = secrets.token_urlsafe(24)
        with closing(self.db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            row = conn.execute("SELECT * FROM operations_google_connection WHERE id=1").fetchone()
            if not row or row["error_code"]=="reauthorize" or (row["lease_until"] and row["lease_until"]>now.isoformat()):
                return False
            attempted = datetime.fromisoformat(row["attempted_at"]).astimezone(LOCAL).date() if row["attempted_at"] else None
            if not row["requested"] and not row["lease"] and (local.hour<9 or attempted==local.date()):
                return False
            conn.execute("UPDATE operations_google_connection SET lease=?,lease_until=?,requested=0,attempted_at=? WHERE id=1", (lease,(now+timedelta(minutes=10)).isoformat(),now.isoformat()))
            conn.commit()
        error, snapshot = None, None
        try:
            end = (now.astimezone(ZoneInfo("America/Los_Angeles")).date()-timedelta(days=3)).isoformat()
            with self.api_session(self.open(row["tokens"])) as remote:
                dates = self.query(remote,(local.date()-timedelta(days=89)).isoformat(),end,"date")
                windows = {}
                for days in (7,30,90):
                    start = (local.date()-timedelta(days=days-1)).isoformat()
                    windows[str(days)] = {d:self.query(remote,start,end,d) for d in ("page","query")}
            snapshot = {"date":dates,"windows":windows,"latestDataDate":max((r["date"] for r in dates["rows"]), default=None)}
        except GoogleError as exc:
            error = exc.code
        except (ValueError,TypeError,KeyError,OverflowError):
            error = "format"
        except Exception:
            error = "network"
        with closing(self.db()) as conn:
            if snapshot is not None:
                encoded = json.dumps(snapshot)
                updated = conn.execute("UPDATE operations_google_connection SET snapshot_json=?,synced_at=?,error_code=NULL,lease=NULL,lease_until=NULL WHERE id=1 AND generation=? AND lease=?", (encoded,self.clock().isoformat(),row["generation"],lease))
                if updated.rowcount:
                    conn.execute("INSERT OR IGNORE INTO operations_google_snapshots(generation,content_hash,payload_json,synced_at) VALUES(?,?,?,?)", (row["generation"],digest(row["generation"]+encoded),encoded,self.clock().isoformat()))
            else:
                conn.execute("UPDATE operations_google_connection SET error_code=?,lease=NULL,lease_until=NULL WHERE id=1 AND generation=? AND lease=?", (error,row["generation"],lease))
            conn.commit()
        return True

    def report(self, days, start, end):
        with closing(self.db()) as conn:
            row = conn.execute("SELECT snapshot_json,synced_at FROM operations_google_connection WHERE id=1").fetchone()
        if not row or not row["snapshot_json"]:
            return None
        snapshot = json.loads(row["snapshot_json"])
        date = {**snapshot["date"], "rows":[r for r in snapshot["date"]["rows"] if start<=r["date"]<=end], "importedAt":row["synced_at"], "partialWindow":snapshot["date"]["startDate"]>start or snapshot["date"]["endDate"]<end}
        covered_start, covered_end = max(start,date["startDate"]), min(end,date["endDate"])
        if covered_start <= covered_end:
            date.update(startDate=covered_start,endDate=covered_end)
        dimensions = {"date":date}
        for d, data in snapshot["windows"].get(str(days),{}).items():
            # Never display a mismatched stale aggregate after its reporting window moves.
            if data["startDate"]==start:
                dimensions[d] = {**data,"importedAt":row["synced_at"],"partialWindow":data["endDate"]<end}
        rows = date["rows"]
        clicks = sum(r["clicks"] for r in rows) if rows else None
        impressions = sum(r["impressions"] for r in rows) if rows else None
        metrics = {"clicks":clicks,"impressions":impressions,"ctr":clicks/impressions if impressions else None,
                   "position":sum(r["position"]*r["impressions"] for r in rows)/impressions if impressions else None}
        return {"provider":"google_search","label":"Google 搜索","status":"available" if rows else "no_records","metrics":metrics,"dimensions":dimensions}


def register(app, db, clock, admin_required):
    connector = Connector(app, db, clock)
    app.extensions["google_search_console"] = connector

    def protected_json(data, status=200):
        response = jsonify(data); response.status_code = status
        response.headers["Cache-Control"] = "private, no-store"
        return response

    @app.post("/api/v1/admin/growth/google/connect")
    @admin_required(write=True)
    def google_connect():
        try: return protected_json({"authorizationUrl":connector.start(g.operations_admin_session)})
        except GoogleError as exc: return protected_json({"error":{"message":str(exc)}},503)

    @app.get("/api/v1/admin/growth/google/callback")
    def google_callback():
        ticket = None if request.args.get("error") else connector.callback(request.args.get("state"),request.args.get("code"))
        target = "/ops/?"+urlencode({"google_connect":ticket})+"#growth" if ticket else "/ops/#growth"
        message = "Google 授权已返回，请继续完成连接。" if ticket else "授权请求已失效，请返回后台重新连接。"
        response = Response(f'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Google Search Console</title><p>{message}</p><a href="{html.escape(target,quote=True)}">返回运营后台</a></html>', status=200 if ticket else 400, mimetype="text/html")
        response.headers.update({"Cache-Control":"no-store","Referrer-Policy":"no-referrer","Content-Security-Policy":"default-src 'none'; base-uri 'none'; frame-ancestors 'none'","X-Content-Type-Options":"nosniff"})
        return response

    @app.post("/api/v1/admin/growth/google/finish")
    @admin_required(write=True)
    def google_finish():
        try:
            connector.finish(g.operations_admin_session,(request.get_json(silent=True) or {}).get("ticket"))
            return protected_json({"connected":True})
        except GoogleError as exc: return protected_json({"error":{"message":str(exc)}},400)
        except Exception: return protected_json({"error":{"message":ERRORS["network"]}},502)

    @app.post("/api/v1/admin/growth/google/sync")
    @admin_required(write=True)
    def google_sync():
        if not connector.status()["connected"]:
            return protected_json({"error":{"message":ERRORS["reauthorize"]}},409)
        connector.request_sync()
        return protected_json({"queued":True},202)

    @app.post("/api/v1/admin/growth/google/disconnect")
    @admin_required(write=True)
    def google_disconnect():
        connector.disconnect()
        return protected_json({"connected":False})
