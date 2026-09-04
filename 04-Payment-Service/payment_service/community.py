import json
import urllib.error
import urllib.parse
import urllib.request


class CommunityServiceError(RuntimeError):
    def __init__(self, message, status=502, code="COMMUNITY_SERVICE_ERROR"):
        super().__init__(message)
        self.status = status
        self.code = code


class CommunityClient:
    def __init__(self, config):
        self.base_url = str(config.get("COMMUNITY_SERVICE_URL") or "").rstrip("/")
        self.token = str(config.get("COMMUNITY_SERVICE_TOKEN") or "")

    def configured(self):
        return bool(self.base_url and self.token)

    def _request(self, path, *, method="GET", payload=None):
        if not self.configured():
            raise CommunityServiceError("社群服务暂未配置")
        body = None if payload is None else json.dumps(payload, ensure_ascii=False).encode("utf-8")
        request = urllib.request.Request(
            f"{self.base_url}{path}",
            data=body,
            method=method,
            headers={"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"},
        )
        try:
            with urllib.request.urlopen(request, timeout=15) as response:
                return json.loads(response.read() or b"{}")
        except urllib.error.HTTPError as exc:
            raw = exc.read()
            try:
                message = (json.loads(raw or b"{}").get("error") or {}).get("message")
            except json.JSONDecodeError:
                message = ""
            status = exc.code if exc.code in {400, 403, 404, 409, 429} else 502
            raise CommunityServiceError(message or "社群服务请求失败", status) from exc
        except (urllib.error.URLError, TimeoutError) as exc:
            raise CommunityServiceError("社群服务暂时不可用") from exc

    def lookup(self, phone):
        query = urllib.parse.urlencode({"phone": phone})
        return self._request(f"/api/internal/v1/members/lookup?{query}")

    def status(self, member_id):
        return self._request(f"/api/internal/v1/members/{int(member_id)}")

    def submit_claim(self, account_ref, nickname):
        return self._request(
            "/api/internal/v1/members/claims",
            method="POST",
            payload={"accountRef": account_ref, "nickname": nickname},
        )

    def claim_status(self, account_ref):
        value = urllib.parse.quote(str(account_ref), safe="")
        return self._request(f"/api/internal/v1/members/claims/{value}")

    def submit_application(self, payload):
        return self._request("/api/internal/v1/applications", method="POST", payload=payload)

    def operations_members(self, *, query="", status="pending", page=1, page_size=20):
        params = urllib.parse.urlencode(
            {"query": query, "status": status, "page": page, "pageSize": page_size}
        )
        return self._request(f"/api/internal/v1/operations/member-approvals?{params}")

    def operations_member(self, member_id):
        return self._request(f"/api/internal/v1/operations/member-approvals/{int(member_id)}")

    def review_operations_member(self, member_id, payload):
        return self._request(
            f"/api/internal/v1/operations/member-approvals/{int(member_id)}/reviews",
            method="POST",
            payload=payload,
        )

    def operations_community_members(self, *, query="", cohort="all", state="all", page=1, page_size=20):
        params = urllib.parse.urlencode(
            {"query": query, "cohort": cohort, "state": state, "page": page, "pageSize": page_size}
        )
        return self._request(f"/api/internal/v1/operations/community-members?{params}")

    def operations_community_member(self, member_id):
        return self._request(f"/api/internal/v1/operations/community-members/{int(member_id)}")

    def manage_operations_community_member(self, member_id, payload):
        return self._request(
            f"/api/internal/v1/operations/community-members/{int(member_id)}/management",
            method="POST",
            payload=payload,
        )

    def operations_schedule(self):
        return self._request("/api/internal/v1/operations/schedule")

    def create_operations_schedule_session(self, payload):
        return self._request(
            "/api/internal/v1/operations/schedule/season-2/sessions",
            method="POST",
            payload=payload,
        )

    def update_operations_schedule_session(self, session_id, payload):
        value = urllib.parse.quote(str(session_id), safe="")
        return self._request(
            f"/api/internal/v1/operations/schedule/season-2/sessions/{value}",
            method="POST",
            payload=payload,
        )

    def hub(self, path, *, viewer=None, method="GET", payload=None):
        query = "?" + urllib.parse.urlencode({"viewer": int(viewer)}) if viewer is not None else ""
        return self._request("/api/internal/v1/community/" + path + query, method=method, payload=payload)
