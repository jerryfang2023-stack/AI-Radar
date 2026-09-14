import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const TOKEN_KEY = "guanlan_api_token_v1";
function setup() {
  const storage = new Map([[TOKEN_KEY, "old"]]);
  const requests = [];
  let logins = 0;
  const context = {
    module: { exports: {} }, setTimeout,
    require: () => ({ track() {}, flush() {} }),
    wx: {
      getStorageSync: (key) => storage.get(key),
      setStorageSync: (key, value) => storage.set(key, value),
      removeStorageSync: (key) => storage.delete(key),
      request: (request) => requests.push(request),
      login: ({ success }) => { logins++; success({ code: "code" }); },
    },
  };
  vm.runInNewContext(fs.readFileSync("miniprogram/utils/payment.js", "utf8"), context);
  return { payment: context.module.exports, storage, requests, logins: () => logins };
}
const respond = (request, statusCode, data) => request.success({ statusCode, data });

for (const operation of ["fetchMembership", "redeemPoints", "fetchProtectedContent"]) {
  test(`${operation}: delayed expiry neither clears a new login nor replays across identities`, async () => {
    const { payment, storage, requests, logins } = setup();
    const pending = payment[operation]("membership_7d");
    storage.set(TOKEN_KEY, "new");
    respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
    await assert.rejects(pending, { code: "AUTH_CHANGED" });
    assert.equal(storage.get(TOKEN_KEY), "new");
    assert.equal(requests.length, 1);
    assert.equal(logins(), 0);
  });
}

for (const operation of ["fetchMembership", "redeemPoints", "fetchProtectedContent"]) {
  test(`${operation}: a successful response cannot apply to another identity`, async () => {
    const { payment, storage, requests } = setup();
    const pending = payment[operation]("report", "record");
    storage.set(TOKEN_KEY, "new");
    respond(requests[0], 200, { content: { mini: { body: "old private body" } } });
    await assert.rejects(pending, { code: "AUTH_CHANGED" });
    assert.equal(storage.get(TOKEN_KEY), "new");
  });
}

test("membership reads renew the existing account without registering it", async () => {
  const { payment, storage, requests, logins } = setup();
  const pending = payment.fetchMembership();
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await new Promise(setImmediate);
  assert.ok(requests[1].url.endsWith("/auth/wechat/refresh"));
  assert.equal(requests[1].header.Authorization, "Bearer old");
  respond(requests[1], 200, { token: "refreshed" });
  await new Promise(setImmediate);
  respond(requests[2], 200, { membership: { active: true } });
  assert.equal((await pending).membership.active, true);
  assert.equal(storage.get(TOKEN_KEY), "refreshed");
  assert.equal(logins(), 1);
});

test("automatic authentication retries once and removes a second expired token", async () => {
  const { payment, storage, requests, logins } = setup();
  const pending = payment.fetchInviteSummary();
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await new Promise(setImmediate);
  assert.ok(requests[1].url.endsWith("/auth/wechat/refresh"));
  respond(requests[1], 200, { token: "refreshed" });
  await new Promise(setImmediate);
  assert.equal(requests[2].header.Authorization, "Bearer refreshed");
  respond(requests[2], 401, { error: { code: "AUTH_EXPIRED" } });
  await assert.rejects(pending, { code: "AUTH_EXPIRED" });
  assert.equal(storage.has(TOKEN_KEY), false);
  assert.equal(requests.length, 3);
  assert.equal(logins(), 1);
});

test("old permission denial cannot invalidate a newer identity's list cache", async () => {
  const { payment, storage, requests } = setup();
  const old = payment.communityRequest("program");
  storage.set(TOKEN_KEY, "new");
  const fresh = payment.communityRequest("program");
  respond(requests[1], 200, { rows: ["new"] });
  await fresh;
  respond(requests[0], 403, { error: { code: "FORBIDDEN" } });
  await assert.rejects(old, { code: "COMMUNITY_CHANGED" });
  assert.deepEqual(Array.from((await payment.communityRequest("program")).rows), ["new"]);
  assert.equal(requests.length, 2);
});


test("concurrent membership and protected reads share a single same-account renewal", async () => {
  const { payment, requests, logins } = setup();
  const member = payment.fetchMembership();
  const content = payment.fetchProtectedContent("entity", "r-123");
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  respond(requests[1], 401, { error: { code: "AUTH_INVALID" } });
  await new Promise(setImmediate);
  assert.equal(logins(), 1);
  respond(requests[2], 200, { token: "refreshed" });
  await new Promise(setImmediate);
  for (const req of requests.slice(3)) {
    assert.equal(req.header.Authorization, "Bearer refreshed");
    respond(req, 200, req.url.includes("/content/") ? { content: { mini: { title: "full" } } } : { membership: { active: true } });
  }
  assert.equal((await content).title, "full");
  assert.equal((await member).membership.active, true);
});

test("account change during renewal neither overwrites the new token nor replays a write", async () => {
  const { payment, storage, requests } = setup();
  const pending = payment.redeemPoints("membership_7d");
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await new Promise(setImmediate);
  storage.set(TOKEN_KEY, "other-account");
  respond(requests[1], 200, { token: "refreshed" });
  await assert.rejects(pending, { code: "AUTH_CHANGED" });
  assert.equal(storage.get(TOKEN_KEY), "other-account");
  assert.equal(requests.length, 2);
});

test("temporary renewal failure preserves the registered session for retry", async () => {
  const { payment, storage, requests } = setup();
  const pending = payment.fetchProtectedContent("entity", "r-1");
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await new Promise(setImmediate);
  requests[1].fail({ errMsg: "timeout" });
  await assert.rejects(pending, { accessState: "session", code: "NETWORK_ERROR" });
  assert.equal(storage.get(TOKEN_KEY), "old");
});

test("registered membership denial is expired, while visitor denial is unregistered", async () => {
  for (const registered of [true, false]) {
    const { payment, storage, requests, logins } = setup();
    if (!registered) storage.delete(TOKEN_KEY);
    const pending = payment.fetchProtectedContent("entity", "r-1");
    respond(requests[0], 403, { error: { code: "MEMBERSHIP_REQUIRED" } });
    await assert.rejects(pending, { accessState: registered ? "expired" : "unregistered" });
    assert.equal(logins(), 0);
  }
});

test("community reads remain coherent across a verified renewal", async () => {
  const { payment, requests } = setup();
  const pending = payment.communityRequest("program");
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await new Promise(setImmediate);
  respond(requests[1], 200, { token: "refreshed" });
  await new Promise(setImmediate);
  respond(requests[2], 200, { rows: ["same account"] });
  assert.equal((await pending).rows[0], "same account");
  assert.equal((await payment.communityRequest("program")).rows[0], "same account");
  assert.equal(requests.length, 3);
});
