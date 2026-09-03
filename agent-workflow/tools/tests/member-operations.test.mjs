import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const script = fs.readFileSync("01-SiteV2/site/assets/member-operations.js", "utf8");
function harness(active = true) {
  const elements = new Map();
  const element = (selector) => {
    if (!elements.has(selector)) elements.set(selector, { innerHTML: "", textContent: "", value: "", hidden: false, disabled: false, listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; } });
    return elements.get(selector);
  };
  const root = element("root");
  root.querySelector = element;
  root.classList = { contains: () => active };
  const requests = [];
  vm.runInNewContext(script, { document: { querySelector: () => root }, Intl, Date, AbortController, setTimeout, clearTimeout,
    fetch(url, options) { return new Promise((resolve, reject) => requests.push({ url, options, resolve, reject })); },
  });
  return { element, root, requests };
}
const metrics = { joinedMembers: 12, newJoinedMembers: 2, awaitingJoin: 0, participants: 3, speakers: 1, participations: 4, issues: 2, unresolvedParticipants: 1, expiring7d: null, renewals: null, accounts: 9, newAccounts: 1, activeEntitlements: 3, trialAccounts: 2, firstPaidAccounts: 1, repeatPaidAccounts: 0, engagedAccounts: 2, redemptions: 1, redeemingAccounts: 1, redeemedPoints: 300, offlineClaims: null };
const payload = (source, days = 30) => ({ schemaVersion: "MEMBER-OPS-V1.0", source, dataSource: "production", generatedAt: "2026-08-30T00:00:00Z", window: { days }, metrics, tiers: { monthly: 1, half_year: 0, annual: 2, other: 0 }, pointBuckets: { zero: 1, low: 2, mid: 3, high: 4 } });
const respond = async (req, data, ok = true) => { req.resolve({ ok, json: async () => data }); await new Promise(setImmediate); };

test("membership loads lazily, uses no credentials and survives partial failure", async () => {
  const h = harness(false);
  assert.equal(h.requests.length, 0);
  h.root.listeners["membership:open"]();
  assert.equal(h.requests.length, 2);
  for (const request of h.requests) { assert.equal(request.options.credentials, "omit"); assert.equal(request.options.method, "GET"); assert.equal(request.options.headers, undefined); }
  await respond(h.requests[0], payload("community"));
  await respond(h.requests[1], {}, false);
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /12/);
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /待接入/);
  assert.match(h.element('[data-mo-content="application"]').innerHTML, /不代表人数为零/);
});

test("filters discard stale responses and refresh retries both sources", async () => {
  const h = harness();
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
  await respond(h.requests[0], { ...payload("community"), metrics: { ...metrics, participants: "<script>" } });
  await respond(h.requests[1], { ...payload("application"), dataSource: "test", name: "PRIVATE" });
  assert.match(h.element('[data-mo-content="community"]').innerHTML, /暂不可用/);
  assert.doesNotMatch(h.element('[data-mo-content="application"]').innerHTML, /PRIVATE/);
  assert.doesNotMatch(script, /localStorage|sessionStorage|\.metrics\s*\)|Object\.entries\(payload/);
});

test("user details require an in-memory admin token and render only validated fields", async () => {
  const h = harness();
  h.element("[data-mo-admin-token]").value = "admin-secret";
  h.element("[data-mo-admin-connect]").listeners.click();
  assert.equal(h.element("[data-mo-admin-token]").value, "");
  assert.equal(h.requests.length, 3);
  const request = h.requests[2];
  assert.match(request.url, /\/api\/v1\/admin\/analytics\/membership\/users/);
  assert.equal(request.options.headers.Authorization, "Bearer admin-secret");
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
  assert.doesNotMatch(h.element("[data-mo-admin-users]").innerHTML, /must-not-render|admin-secret/);
  assert.doesNotMatch(script, /localStorage|sessionStorage/);
});
