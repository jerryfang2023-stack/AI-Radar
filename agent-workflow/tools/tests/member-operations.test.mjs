import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script = fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8");
const page = fs.readFileSync("01-SiteV2/site/operations-console.html", "utf8");
const style = fs.readFileSync("01-SiteV2/site/assets/member-operations.css", "utf8");
function harness(active = true) {
  const elements = new Map();
  const documentListeners = {};
  const element = (selector) => {
    if (!elements.has(selector)) elements.set(selector, { innerHTML: "", textContent: "", value: "", hidden: false, disabled: false, listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; } });
    return elements.get(selector);
  };
  const root = element("root");
  root.querySelector = element;
  root.classList = { contains: () => active };
  const requests = [];
  class TestEvent { constructor(type, options = {}) { this.type = type; this.detail = options.detail; } }
  const document = { querySelector: () => root, addEventListener(name, fn) { documentListeners[name] = fn; }, dispatchEvent(event) { documentListeners[event.type]?.(event); } };
  vm.runInNewContext(script, { document, CustomEvent: TestEvent, Event: TestEvent, Intl, Date, AbortController, setTimeout, clearTimeout,
    fetch(url, options) { return new Promise((resolve, reject) => requests.push({ url, options, resolve, reject })); },
  });
  return { document, element, root, requests, TestEvent };
}
const metrics = { joinedMembers: 12, newJoinedMembers: 2, awaitingJoin: 0, participants: 3, speakers: 1, participations: 4, issues: 2, unresolvedParticipants: 1, expiring7d: null, renewals: null, accounts: 9, newAccounts: 1, activeEntitlements: 3, trialAccounts: 2, firstPaidAccounts: 1, repeatPaidAccounts: 0, engagedAccounts: 2, redemptions: 1, redeemingAccounts: 1, redeemedPoints: 300, offlineClaims: null };
const payload = (source, days = 30) => ({ schemaVersion: "MEMBER-OPS-V1.0", source, dataSource: "production", generatedAt: "2026-08-30T00:00:00Z", window: { days }, metrics, tiers: { monthly: 1, half_year: 0, annual: 2, other: 0 }, pointBuckets: { zero: 1, low: 2, mid: 3, high: 4 } });
const respond = async (req, data, ok = true) => { req.resolve({ ok, json: async () => data }); await new Promise(setImmediate); };

test("membership loads lazily with source-appropriate credentials and survives partial failure", async () => {
  const h = harness(false);
  assert.equal(h.requests.length, 0);
  h.root.listeners["membership:open"]();
  assert.equal(h.requests.length, 2);
  assert.equal(h.requests[0].options.credentials, "omit");
  assert.equal(h.requests[1].options.credentials, "same-origin");
  assert.match(h.requests[1].url, /^\/ops\/application-membership-summary/);
  for (const request of h.requests) { assert.equal(request.options.method, "GET"); assert.equal(request.options.headers, undefined); }
  await respond(h.requests[0], payload("community"));
  await respond(h.requests[1], {}, false);
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /12/);
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /待接入/);
  assert.doesNotMatch(h.element('[data-mo-content="community"]').innerHTML, /当前审核通过且已登记入群日期|活动昵称未能唯一匹配/);
  assert.match(h.element('[data-mo-content="application"]').innerHTML, /不代表人数为零/);
});

test("filters discard stale responses and refresh retries both sources", async () => {
  const h = harness();
  h.root.listeners["membership:open"]();
  h.element("[data-mo-days]").listeners.change({ target: { value: "7" } });
  assert.equal(h.requests.length, 4);
  await respond(h.requests[2], payload("community", 7));
  const current = h.element('[data-mo-content="community"]').innerHTML;
  await respond(h.requests[0], { ...payload("community"), metrics: { ...metrics, joinedMembers: 999 } });
  assert.equal(h.element('[data-mo-content="community"]').innerHTML, current);
  await respond(h.requests[1], payload("application"));
  await respond(h.requests[3], payload("application", 7));
  h.element("[data-mo-refresh]").listeners.click();
  assert.equal(h.requests.length, 6);
  await respond(h.requests[4], payload("community", 7));
  await respond(h.requests[5], payload("application", 7));
});

test("invalid or non-production payloads fail closed without rendering arbitrary fields", async () => {
  const h = harness();
  h.root.listeners["membership:open"]();
  await respond(h.requests[0], { ...payload("community"), metrics: { ...metrics, participants: "<script>" } });
  await respond(h.requests[1], { ...payload("application"), dataSource: "test", name: "PRIVATE" });
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /暂不可用/);
  assert.doesNotMatch(h.element('[data-mo-content="application"]').innerHTML, /PRIVATE/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|\.metrics\s*\)|Object\.entries\(payload/);
});

test("user details reuse the protected console cookie session", async () => {
  const h = harness();
  h.document.dispatchEvent(new h.TestEvent("operations:authenticated", { detail: { csrfToken: "csrf-token-with-enough-entropy" } }));
  assert.equal(h.requests.length, 2);
  const request = h.requests.find((item) => item.url.startsWith("/ops/member-api/users"));
  assert.match(request.url, /^\/ops\/member-api\/users/);
  assert.equal(request.options.credentials, "same-origin");
  assert.equal(request.options.headers.Authorization, undefined);
  await respond(request, {
    schemaVersion: "MEMBER-ADMIN-V1.0", dataSource: "production", generatedAt: "2026-09-03T00:00:00Z",
    page: { number: 1, size: 20, total: 1, totalPages: 1 }, users: [{
      id: 7, displayName: "测试用户", phoneMasked: "138****8000", community: { name: "社群成员", status: "approved" },
      membership: { status: "member", trialEndsAt: "", memberEndsAt: "2026-10-01T00:00:00Z", activeUntil: "2026-10-01T00:00:00Z" },
      points: { balance: 120, lifetime: 300, community: 80 }, payment: { paidOrders: 1, paidCents: 3000, lastPaidAt: "2026-09-01T00:00:00Z" },
      activity: { lastBehaviorAt: "2026-09-02T00:00:00Z" }, createdAt: "2026-08-01T00:00:00Z", updatedAt: "2026-09-02T00:00:00Z", recentAdjustments: [], openid: "must-not-render",
    }],
  });
  assert.match(h.element("[data-mo-admin-users]").innerHTML, /测试用户/);
  assert.match(h.element("[data-mo-admin-users]").innerHTML, /138\*\*\*\*8000/);
  assert.doesNotMatch(h.element("[data-mo-admin-users]").innerHTML, /must-not-render|csrf-token/);
  assert.match(script, /"X-CSRF-Token": adminCsrfToken/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|ANALYTICS_ADMIN_TOKEN|data-mo-admin-token/);
  assert.doesNotMatch(page, /运营后台访问令牌|data-mo-admin-token|type="password"|data-mo-admin-email|data-mo-admin-code/);
  assert.doesNotMatch(page, /先看跨平台汇总|当前存量按读取时刻统计|这里不显示 OpenID|无需从终端获取/);
});

test("community approval is embedded in the membership panel and uses the same session", async () => {
  const h = harness();
  h.document.dispatchEvent(new h.TestEvent("operations:authenticated", { detail: { csrfToken: "csrf-token-with-enough-entropy" } }));
  const request = h.requests.find((item) => item.url.startsWith("/ops/member-api/community-members"));
  assert.ok(request);
  assert.equal(request.options.credentials, "same-origin");
  assert.equal(request.options.headers.Authorization, undefined);
  await respond(request, {
    schemaVersion: "COMMUNITY-APPROVAL-V1.0", generatedAt: "2026-09-03T00:00:00Z",
    statusCounts: { pending: 1, approved: 2, waitlist: 0, rejected: 0 },
    page: { number: 1, size: 20, total: 1, totalPages: 1 },
    members: [{ id: 77, name: "待审成员", city: "杭州", company: "示例公司", role: "创业者", status: "pending", totalScore: 68, joinedOn: "", createdAt: "2026-09-01T00:00:00Z", updatedAt: "2026-09-01T00:00:00Z" }],
  });
  assert.match(h.element("[data-mo-approval-members]").innerHTML, /待审成员/);
  assert.match(h.element("[data-mo-approval-state]").textContent, /待审核 1 项/);
  assert.match(page, /data-mo-approval[^]*社群会员审批/u);
  assert.doesNotMatch(page, /href="https:\/\/members\.zkdlj\.vip\/admin"/u);
});
