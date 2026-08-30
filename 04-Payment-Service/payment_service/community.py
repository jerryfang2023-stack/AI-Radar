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

    def submit_application(self, payload):
        return self._request("/api/internal/v1/applications", method="POST", payload=payload)

    def hub(self, path, *, viewer=None, method="GET", payload=None):
        query = "?" + urllib.parse.urlencode({"viewer": int(viewer)}) if viewer is not None else ""
        return self._request("/api/internal/v1/community/" + path + query, method=method, payload=payload)
