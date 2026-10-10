"""Protected PC acquisition aggregates and explicitly imported search evidence."""
from contextlib import closing
from datetime import date, datetime, timedelta, timezone
import hashlib
import json
import math
import re
from pathlib import Path
from urllib.parse import urlsplit

from flask import g, jsonify, request

VERSION = "SEARCH-AI-GROWTH-V1"
MEASUREMENT_VERSION = "GEO-MEASUREMENT-V2"
LOCAL = timezone(timedelta(hours=8))
PROVIDERS = {
    "google_search": "Google 搜索", "bing_search": "Bing 搜索", "baidu_search": "百度搜索",
    "google_ai": "Google AI 搜索曝光", "bing_ai": "Bing AI 引用",
    "google_indexing": "Google 收录", "bing_indexing": "Bing 收录", "baidu_indexing": "百度收录",
}
AI_SOURCES = {"chatgpt", "perplexity", "copilot", "gemini", "deepseek", "doubao", "kimi", "qwen"}
SEARCH_SOURCES = {"google", "bing", "baidu"}
OBSERVATION_FIELDS = {"observationType", "searchMode", "collectionMethod", "language", "variantId", "answerStatus", "brandMentioned", "evidenceRef", "reviewedClaims", "correctClaims", "incorrectClaims"}
COHORT_FIELDS = ("engine", "model", "observationType", "searchMode", "collectionMethod", "language", "variantId")


def public_path(value):
    """Project known public routes only; discard query strings and private paths."""
    if not isinstance(value, str) or len(value) > 2000 or not value.startswith("/") or value.startswith("//"):
        return None
    path = urlsplit(value).path
    if re.fullmatch(r"/(?:en/)?(?:|about/|community/|heatmap/|reports/|(?:funding|companies|investors|people)/|sectors/[a-z-]+/|funding/(?:records/|page/\d+/|[A-Za-z0-9_-]+/)|(?:companies|investors|people)/(?:page/\d+/|profile/[A-Za-z0-9_-]+/))", path):
        return path
    return None


def public_citation_url(value):
    if not isinstance(value, str) or len(value) > 2000:
        return None
    try:
        u = urlsplit(value)
        path = public_path(u.path or "/")
        return "https://www.zkdlj.vip" + path if u.scheme == "https" and u.netloc == "www.zkdlj.vip" and not u.username and not u.password and path else None
    except ValueError:
        return None


def observation_metadata(row, case):
    choices = {
        "observationType": ({"legacy", "discovery", "direct_url"}, "legacy"),
        "searchMode": ({"unknown", "web_search", "no_search"}, "unknown"),
        "collectionMethod": ({"unknown", "manual_ui", "api_search", "provider_report"}, "unknown"),
        "language": ({"zh-CN", "en"}, case.get("language", "zh-CN")),
        "answerStatus": ({"answered", "failed"}, "answered"),
    }
    result = {}
    for key, (allowed, default) in choices.items():
        value = row.get(key, default)
        if not isinstance(value, str) or value not in allowed:
            raise ValueError("评测方式无效")
        result[key] = value
    variant = row.get("variantId", "base")
    if not isinstance(variant, str) or not re.fullmatch(r"[A-Za-z0-9_-]{1,64}", variant):
        raise ValueError("问题变体标识无效")
    result["variantId"] = variant
    if result["observationType"] == "legacy" and (result["searchMode"] != "unknown" or result["collectionMethod"] != "unknown" or variant != "base" or result["language"] != case.get("language", "zh-CN")):
        raise ValueError("已知评测条件须使用 discovery 或 direct_url")
    mentioned = row.get("brandMentioned")
    if mentioned is not None and not isinstance(mentioned, bool):
        raise ValueError("品牌提及须为布尔值或 null")
    result["brandMentioned"] = mentioned
    ref = row.get("evidenceRef")
    if ref is not None and (not isinstance(ref, str) or not re.fullmatch(r"sha256:[a-f0-9]{64}", ref)):
        raise ValueError("证据引用须为 SHA-256 标识")
    result["evidenceRef"] = ref
    claims = [row.get(key) for key in ("reviewedClaims", "correctClaims", "incorrectClaims")]
    if any(value is not None for value in claims):
        if any(value is None for value in claims) or any(count(value) > 10000 for value in claims) or claims[0] != claims[1] + claims[2]:
            raise ValueError("事实核验计数不一致")
    result.update(zip(("reviewedClaims", "correctClaims", "incorrectClaims"), claims))
    if result["answerStatus"] == "failed" and (row.get("citations") or mentioned is not None or any(value is not None for value in claims) or row.get("accuracyReview", "unreviewed") != "unreviewed"):
        raise ValueError("失败请求不能记录回答效果")
    return result


def observation_key(row):
    # Preserve the key used by historical imports, while keeping new test modes apart.
    if row.get("observationType", "legacy") == "legacy":
        return json.dumps([row[k] for k in ("caseId", "engine", "model", "observedAt")])
    return json.dumps([row[k] for k in ("caseId", "observedAt", *COHORT_FIELDS)])


def evaluation_summary(observations, questions):
    cohorts, cases = {}, {}
    case_config = {c["id"]: c for c in questions["cases"]}
    projected = []
    for row in observations:
        urls = sorted({url for raw in row["citationURLs"] if (url := public_citation_url(raw))})
        expected = case_config.get(row["caseId"], {}).get("expectedCitationURLs", [])
        projected.append({**row, "citationURLs": urls, "expectedPageCited": bool(set(urls) & set(expected))})
    observations = projected
    for row in observations:
        metadata = {key: row.get(key, {"observationType": "legacy", "searchMode": "unknown", "collectionMethod": "unknown", "language": case_config.get(row["caseId"], {}).get("language", "zh-CN"), "variantId": "base", "model": ""}.get(key)) for key in COHORT_FIELDS}
        key = tuple(metadata[k] for k in COHORT_FIELDS)
        cohorts.setdefault(key, {"metadata": metadata, "rows": []})["rows"].append(row)
        cases.setdefault((key, row["caseId"]), {"metadata": {**metadata, "caseId": row["caseId"]}, "rows": []})["rows"].append(row)

    def aggregate(group):
        rows = group["rows"]
        answered = [r for r in rows if r.get("answerStatus", "answered") == "answered"]
        mentioned = [r for r in answered if isinstance(r.get("brandMentioned"), bool)]
        reviewed = [r for r in answered if r["accuracyReview"] != "unreviewed"]
        claims = [r for r in answered if r.get("reviewedClaims") is not None]
        denominator = sum(r["reviewedClaims"] for r in claims)
        cited = sum(bool(r["citationURLs"]) for r in answered)
        return {**group["metadata"], "observations": len(rows), "validAnswers": len(answered), "failedAnswers": len(rows) - len(answered),
                "siteCitations": cited if answered else None, "citationRate": cited / len(answered) if answered else None,
                "mentionReviewed": len(mentioned), "brandMentioned": sum(r["brandMentioned"] for r in mentioned) if mentioned else None,
                "mentionRate": sum(r["brandMentioned"] for r in mentioned) / len(mentioned) if mentioned else None,
                "accuracyReviewed": len(reviewed), "answerAccuracyRate": sum(r["accuracyReview"] == "correct" for r in reviewed) / len(reviewed) if reviewed else None,
                "reviewedClaims": denominator if claims else None, "correctClaims": sum(r["correctClaims"] for r in claims) if claims else None,
                "incorrectClaims": sum(r["incorrectClaims"] for r in claims) if claims else None,
                "factAccuracyRate": sum(r["correctClaims"] for r in claims) / denominator if denominator else None,
                "evidenceReferenced": sum(bool(r.get("evidenceRef")) for r in answered),
                "citedPages": sorted({u for r in answered for u in r["citationURLs"]}), "lastObservedAt": max(r["observedAt"] for r in rows)}

    engines = []
    for engine in questions["engines"]:
        # Compatibility metrics use old observations and discovery only, never URL-assisted tests or failures.
        rows = [r for r in observations if r["engine"] == engine and r.get("observationType", "legacy") != "direct_url" and r.get("answerStatus", "answered") == "answered"]
        cited = sum(bool(r["citationURLs"]) for r in rows)
        engines.append({"engine": engine, "aggregation": "pooled_compatibility", "comparisonEligible": False, "status": "available" if rows else "not_measured", "observations": len(rows) if rows else None,
                        "siteCitations": cited if rows else None, "citationRate": cited / len(rows) if rows else None,
                        "expectedPageCitations": sum(r["expectedPageCited"] for r in rows) if rows else None,
                        "accuracyReviewed": sum(r["accuracyReview"] != "unreviewed" for r in rows) if rows else None,
                        "correct": sum(r["accuracyReview"] == "correct" for r in rows) if rows else None,
                        "incorrect": sum(r["accuracyReview"] == "incorrect" for r in rows) if rows else None,
                        "citedPages": sorted({u for r in rows for u in r["citationURLs"]}), "lastObservedAt": max(r["observedAt"] for r in rows) if rows else None})
    return {"baselineDate": questions["baselineDate"], "questions": len(questions["cases"]), "engines": engines,
            "cohorts": [aggregate(g) for g in cohorts.values()], "cases": [aggregate(g) for g in cases.values()]}


def parsed(value):
    try:
        stamp = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        return stamp.replace(tzinfo=timezone.utc) if stamp.tzinfo is None else stamp
    except (TypeError, ValueError):
        return None


def own_url(value):
    if not isinstance(value, str) or len(value) > 500:
        raise ValueError("页面链接无效")
    u = urlsplit(value)
    if u.scheme != "https" or u.netloc != "www.zkdlj.vip" or u.username or u.password or u.query or u.fragment:
        raise ValueError("页面须为本站 HTTPS 链接，且不含查询参数")
    return "https://www.zkdlj.vip" + (u.path or "/")


def count(value):
    if value is None:
        return None
    if isinstance(value, bool) or not isinstance(value, int) or not 0 <= value <= 10**12:
        raise ValueError("计数须为非负整数，未知值请用 null")
    return value


def checked_date(value, today):
    if not isinstance(value, str) or len(value) != 10:
        raise ValueError("日期须为 YYYY-MM-DD")
    d = date.fromisoformat(value)
    if d > today or d < date(2020, 1, 1):
        raise ValueError("日期超出有效范围")
    return d.isoformat()


def normalize_import(body, today, questions):
    if not isinstance(body, dict) or set(body) - {"provider", "dimension", "startDate", "endDate", "rows"}:
        raise ValueError("报表字段无效")
    provider = body.get("provider")
    rows = body.get("rows")
    if not isinstance(rows, list) or not 1 <= len(rows) <= 5000:
        raise ValueError("每次导入须含 1 至 5000 条记录")
    if provider == "ai_evaluation":
        normalized, seen = [], set()
        engines = set(questions["engines"])
        cases = {c["id"]: c for c in questions["cases"]}
        for row in rows:
            if not isinstance(row, dict) or set(row) - ({"caseId", "engine", "model", "observedAt", "citations", "accuracyReview"} | OBSERVATION_FIELDS):
                raise ValueError("评测字段无效")
            stamp = parsed(row.get("observedAt"))
            if not stamp or stamp.astimezone(LOCAL).date() > today or stamp.astimezone(LOCAL).date() < date.fromisoformat(questions["baselineDate"]):
                raise ValueError("评测须有题库日期之后的真实观察时间")
            case, engine = cases.get(row.get("caseId")), row.get("engine")
            review = row.get("accuracyReview", "unreviewed")
            if not case or engine not in engines or review not in {"correct", "incorrect", "unreviewed"}:
                raise ValueError("题目、平台或事实核验状态无效")
            metadata = observation_metadata(row, case)
            model = row.get("model") or ""
            if not isinstance(model, str) or len(model) > 120:
                raise ValueError("模型版本过长")
            links = row.get("citations")
            if not isinstance(links, list) or len(links) > 100:
                raise ValueError("引用链接列表无效")
            own = []
            for link in links:
                if not isinstance(link, str) or len(link) > 2000:
                    raise ValueError("引用链接无效")
                u = urlsplit(link)
                if u.scheme not in {"https", "http"} or not u.hostname or u.username or u.password:
                    raise ValueError("引用链接无效")
                if public := public_citation_url(link):
                    own.append(public)
            observed = stamp.astimezone(timezone.utc).isoformat()
            # Keep historical payload hashes and keys stable; new metadata is opt-in.
            candidate = {"caseId": row["caseId"], "engine": engine, "model": model,
                         "observedAt": observed, "date": stamp.astimezone(LOCAL).date().isoformat(),
                         "citationURLs": sorted(set(own)), "expectedPageCited": bool(set(own) & set(case["expectedCitationURLs"])),
                         "accuracyReview": review, **(metadata if set(row) & OBSERVATION_FIELDS else {})}
            key = observation_key(candidate)
            if key in seen:
                raise ValueError("同一观察记录重复")
            seen.add(key)
            normalized.append(candidate)
        normalized.sort(key=lambda x: (x["observedAt"], x["caseId"], x["engine"], x["model"]))
        return {"provider": provider, "dimension": "observation", "rows": normalized}
    if provider not in PROVIDERS or body.get("dimension") not in {"date", "page", "query"}:
        raise ValueError("平台或报表维度无效")
    dimension = body["dimension"]
    indexing = provider.endswith("_indexing")
    if (indexing and dimension != "date") or (provider == "google_ai" and dimension == "query"):
        raise ValueError("该平台不支持此报表维度")
    start = checked_date(body.get("startDate"), today)
    end = checked_date(body.get("endDate"), today)
    if start > end or (date.fromisoformat(end) - date.fromisoformat(start)).days > 730:
        raise ValueError("报表周期无效")
    fields = {"indexed", "excluded"} if indexing else {"citations"} if provider == "bing_ai" else {"impressions"} if provider == "google_ai" else {"clicks", "impressions", "position"}
    normalized, seen = [], set()
    for row in rows:
        if not isinstance(row, dict) or set(row) - (fields | {dimension}):
            raise ValueError("报表字段与平台或维度不符")
        key = row.get(dimension)
        if dimension == "date":
            key = checked_date(key, today)
            if not start <= key <= end:
                raise ValueError("记录日期不在声明周期内")
        elif dimension == "page":
            key = own_url(key)
        elif not isinstance(key, str) or not key.strip() or len(key) > 200:
            raise ValueError("关键词无效")
        if key in seen:
            raise ValueError("报表维度重复，不能重复汇总")
        seen.add(key)
        item = {dimension: key}
        for field in fields:
            value = row.get(field)
            if field == "position":
                if value == 0 and row.get("impressions") == 0:
                    value = None
                if value is not None and (isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value) or not 0 < value <= 10000):
                    raise ValueError("平均排名须为正数或 null")
                item[field] = value
            else:
                item[field] = count(value)
        if "clicks" in item and item["clicks"] is not None and item["impressions"] is not None and item["clicks"] > item["impressions"]:
            raise ValueError("点击次数不能超过展现次数")
        if all(item[f] is None for f in fields):
            # Unknown rows are valid and must remain unavailable instead of becoming zero.
            pass
        normalized.append(item)
    normalized.sort(key=lambda x: x[dimension])
    return {"provider": provider, "dimension": dimension, "startDate": start, "endDate": end, "rows": normalized}


def traffic_summary(conn, start, now, tracking_since):
    sessions, totals, trend = {}, {"sessions": 0, "searchSessions": 0, "aiSessions": 0, "unattributedSessions": 0, "pageViews": 0}, {}
    conn.execute("PRAGMA query_only=ON")
    for row in conn.execute("SELECT session_id,event_name,properties_json,page_path,occurred_at FROM analytics_events WHERE platform='pc' AND julianday(occurred_at)>=julianday(?) AND julianday(occurred_at)<=julianday(?) ORDER BY julianday(occurred_at),id", (max(start, parsed(tracking_since) or start).isoformat(), now.isoformat())):
        try:
            props = json.loads(row["properties_json"] or "{}")
        except (ValueError, TypeError):
            props = {}
        if not isinstance(props, dict):
            props = {}
        item = sessions.setdefault(row["session_id"], {"first": None, "path": None, "evidence": "unknown", "views": 0, "content": 0, "research": False, "application": False})
        event = row["event_name"]
        if event == "page_view":
            item["views"] += 1
            if item["first"] is None:
                source, medium = props.get("trafficSource"), props.get("trafficMedium")
                valid = (medium == "ai_referral" and source in AI_SOURCES) or (medium == "organic_search" and source in SEARCH_SOURCES) or (medium == "direct" and source == "direct") or (medium == "other_referral" and source == "other") or (medium == "unattributed" and source == "unattributed")
                item["first"] = (source if valid else "unattributed", medium if valid else "unattributed")
                item["path"] = public_path(props.get("landingPath")) or public_path(row["page_path"])
                evidence = props.get("attributionEvidence")
                item["evidence"] = evidence if valid and evidence in {"utm_source", "referrer", "none"} else "unknown"
            day = parsed(row["occurred_at"]).astimezone(LOCAL).date().isoformat()
            daily = trend.setdefault(day, {"date": day, "pageViews": 0, "sessions": set()})
            daily["pageViews"] += 1
            daily["sessions"].add(row["session_id"])
        elif event == "content_view":
            item["content"] += 1
        elif event == "public_cta_click":
            item["research"] |= props.get("scope") == "full_research"
            item["application"] |= props.get("scope") == "community_application"
    groups, landings, evidence_groups = {}, {}, {}
    for item in sessions.values():
        if not item["first"]:
            continue
        source, medium = item["first"]
        group = groups.setdefault((source, medium), {"source": source, "medium": medium, "sessions": 0, "pageViews": 0, "contentViews": 0, "researchCtaSessions": 0, "applicationCtaSessions": 0})
        group["sessions"] += 1
        group["pageViews"] += item["views"]
        group["contentViews"] += item["content"]
        group["researchCtaSessions"] += int(item["research"])
        group["applicationCtaSessions"] += int(item["application"])
        landing = landings.setdefault((source, medium, item["path"]), {"source": source, "medium": medium, "path": item["path"], "sessions": 0, "pageViews": 0, "contentViews": 0, "researchCtaSessions": 0, "applicationCtaSessions": 0})
        for field, value in (("sessions", 1), ("pageViews", item["views"]), ("contentViews", item["content"]), ("researchCtaSessions", int(item["research"])), ("applicationCtaSessions", int(item["application"]))):
            landing[field] += value
        evidence_group = evidence_groups.setdefault((source, medium, item["evidence"]), {"source": source, "medium": medium, "evidence": item["evidence"], "sessions": 0})
        evidence_group["sessions"] += 1
        totals["sessions"] += 1
        totals["pageViews"] += item["views"]
        if medium == "organic_search": totals["searchSessions"] += 1
        if medium == "ai_referral": totals["aiSessions"] += 1
        if medium == "unattributed": totals["unattributedSessions"] += 1
    return {"status": "available" if tracking_since else "not_connected", "trackingSince": tracking_since or None,
            "totals": totals if tracking_since else None, "channels": sorted(groups.values(), key=lambda x: -x["sessions"]) if tracking_since else [],
            "trend": [{**d, "sessions": len(d["sessions"])} for d in sorted(trend.values(), key=lambda x: x["date"])] if tracking_since else [],
            "landingPages": sorted(landings.values(), key=lambda x: (-x["sessions"], x["source"], x["path"] or "")) if tracking_since else [],
            "attributionEvidence": sorted(evidence_groups.values(), key=lambda x: (-x["sessions"], x["source"], x["evidence"])) if tracking_since else [],
            "conversions": {"status": "not_connected", "reason": "pc_acquisition_identity_not_linked", "registrations": None, "paidOrders": None, "paidRevenueCents": None}}


def report_summary(conn, start_day, end_day):
    result = []
    for provider, label in PROVIDERS.items():
        dimensions = {}
        for dimension in ("date", "page", "query"):
            row = conn.execute("SELECT payload_json,imported_at FROM operations_growth_imports WHERE provider=? AND dimension=? ORDER BY id DESC LIMIT 1", (provider, dimension)).fetchone()
            if not row:
                continue
            data = json.loads(row["payload_json"])
            # Non-date reports are period aggregates and must never be partially assigned to a window.
            in_window = data["startDate"] >= start_day and data["endDate"] <= end_day
            rows = [r for r in data["rows"] if start_day <= r["date"] <= end_day] if dimension == "date" else data["rows"] if in_window else []
            dimensions[dimension] = {"importedAt": row["imported_at"], "startDate": data["startDate"], "endDate": data["endDate"], "rows": rows,
                                     "partialWindow": data["startDate"] > start_day or data["endDate"] < end_day}
        date_data = dimensions.get("date")
        rows = date_data["rows"] if date_data else []
        metrics = {}
        fields = {"indexed", "excluded"} if provider.endswith("_indexing") else {"citations"} if provider == "bing_ai" else {"impressions"} if provider == "google_ai" else {"impressions", "clicks"}
        for field in fields:
            values = [r.get(field) for r in rows]
            metrics[field] = values[-1] if values and provider.endswith("_indexing") else sum(values) if values and all(v is not None for v in values) else None
        if provider == "bing_ai":
            pages = dimensions.get("page", {}).get("rows", [])
            metrics["citedPages"] = sum((r.get("citations") or 0) > 0 for r in pages) if pages and all(r.get("citations") is not None for r in pages) else None
        if "clicks" in metrics:
            impressions, clicks = metrics["impressions"], metrics["clicks"]
            metrics["ctr"] = clicks / impressions if impressions and clicks is not None else None
            ranked = [(r.get("position"), r.get("impressions")) for r in rows]
            metrics["position"] = sum(p * n for p, n in ranked) / impressions if impressions and all(p is not None and n is not None for p, n in ranked) else None
        result.append({"provider": provider, "label": label, "status": "not_connected" if not dimensions else "available" if rows else "no_records",
                       "metrics": metrics, "dimensions": dimensions})
    return result


def register(app, db, clock, admin_required):
    question_file = Path(__file__).parent.parent / "config" / "growth-questions.json"
    questions = json.loads(question_file.read_text(encoding="utf-8"))
    with closing(db()) as conn:
        conn.execute("CREATE TABLE IF NOT EXISTS operations_growth_imports (id INTEGER PRIMARY KEY, provider TEXT NOT NULL, dimension TEXT NOT NULL, content_hash TEXT UNIQUE NOT NULL, payload_json TEXT NOT NULL, actor_hash TEXT NOT NULL, imported_at TEXT NOT NULL)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_growth_source ON operations_growth_imports(provider,dimension,id)")
        conn.execute("CREATE TABLE IF NOT EXISTS operations_growth_observations (observation_key TEXT PRIMARY KEY,payload_json TEXT NOT NULL,observed_at TEXT NOT NULL)")
        conn.commit()

    from payment_service.google_search_console import register as register_google
    register_google(app, db, clock, admin_required)

    @app.get("/api/v1/admin/growth/summary")
    @admin_required(touch=False)
    def growth_summary():
        days = request.args.get("days", "30")
        if days not in {"7", "30", "90"}:
            return jsonify(error={"code": "INVALID_DAYS", "message": "请选择 7、30 或 90 天"}), 400
        now = clock()
        start = datetime.combine(now.astimezone(LOCAL).date() - timedelta(days=int(days)-1), datetime.min.time(), LOCAL)
        start_day, end_day = start.date().isoformat(), now.astimezone(LOCAL).date().isoformat()
        with closing(db()) as conn:
            traffic = traffic_summary(conn, start, now, app.config.get("ANALYTICS_LIVE_FROM"))
            reports = report_summary(conn, start_day, end_day)
            observations = [json.loads(r[0]) for r in conn.execute("SELECT payload_json FROM operations_growth_observations WHERE julianday(observed_at)>=julianday(?) AND julianday(observed_at)<=julianday(?) ORDER BY observed_at", (start.isoformat(), now.isoformat()))]
            evaluation = evaluation_summary(observations, questions)
        health_file = Path(app.config.get("GROWTH_EVIDENCE_PATH") or Path(app.config["DATABASE_PATH"]).parent / "growth-evidence.json")
        health = {"status": "not_verified"}
        try:
            raw = json.loads(health_file.read_text(encoding="utf-8"))
            health = {k: raw[k] for k in ("status", "verifiedAt", "portalCommit", "releaseId", "pagesChecked", "pagesPassed", "crawlerProbes", "crawlerProbesPassed", "indexNowStatus", "indexNowSubmitted", "indexNowAt") if k in raw}
        except (OSError, ValueError, TypeError):
            pass
        google = app.extensions["google_search_console"]
        automatic = google.report(int(days), start_day, end_day)
        if automatic:
            reports = [automatic if r["provider"] == "google_search" else r for r in reports]
        response = jsonify(schemaVersion=VERSION, measurementVersion=MEASUREMENT_VERSION, dataSource="production", generatedAt=now.isoformat(),
                           window={"days": int(days), "from": start.isoformat(), "to": now.isoformat(), "timezone": "Asia/Shanghai"},
                           traffic=traffic, reports=reports, googleConnection=google.status(), evaluation=evaluation, health=health)
        response.headers["Cache-Control"] = "private, no-store"
        return response

    @app.post("/api/v1/admin/growth/import")
    @admin_required(write=True)
    def growth_import():
        if (request.content_length or 0) > 2 * 1024 * 1024:
            return jsonify(error={"code": "REPORT_TOO_LARGE", "message": "报表不能超过 2 MB"}), 413
        try:
            data = normalize_import(request.get_json(silent=True), clock().astimezone(LOCAL).date(), questions)
        except (ValueError, TypeError, KeyError, OverflowError):
            return jsonify(error={"code": "INVALID_REPORT", "message": "报表格式或数值无效，请核对模板、周期和链接"}), 400
        encoded = json.dumps(data, ensure_ascii=False, sort_keys=True, separators=(",", ":"))
        content_hash = hashlib.sha256(encoded.encode()).hexdigest()
        with closing(db()) as conn:
            conn.execute("BEGIN IMMEDIATE")
            # Replays return the original receipt and never mutate observation reviews.
            previous = conn.execute("SELECT id,imported_at FROM operations_growth_imports WHERE content_hash=?", (content_hash,)).fetchone()
            if previous:
                result = {"id": previous["id"], "importedAt": previous["imported_at"], "replayed": True}
            else:
                imported_at = clock().astimezone(timezone.utc).isoformat()
                cursor = conn.execute("INSERT INTO operations_growth_imports(provider,dimension,content_hash,payload_json,actor_hash,imported_at) VALUES(?,?,?,?,?,?)", (data["provider"], data["dimension"], content_hash, encoded, g.operations_admin_session["email_hash"], imported_at))
                if data["provider"] == "ai_evaluation":
                    for observation in data["rows"]:
                        key = observation_key(observation)
                        conn.execute("INSERT INTO operations_growth_observations VALUES(?,?,?) ON CONFLICT(observation_key) DO UPDATE SET payload_json=excluded.payload_json", (key, json.dumps(observation, ensure_ascii=False), observation["observedAt"]))
                conn.commit()
                result = {"id": cursor.lastrowid, "importedAt": imported_at, "replayed": False}
        response = jsonify(schemaVersion=VERSION, provider=data["provider"], rows=len(data["rows"]), **result)
        response.headers["Cache-Control"] = "private, no-store"
        return response, 200 if result["replayed"] else 201

    @app.get("/api/v1/admin/growth/questions")
    @admin_required(touch=False)
    def growth_questions():
        response = jsonify(questions)
        response.headers["Cache-Control"] = "private, no-store"
        return response
