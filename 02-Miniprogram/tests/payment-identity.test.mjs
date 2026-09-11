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

for (const operation of ["fetchMembership", "redeemPoints"]) {
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

test("current expired identity is cleared without silently registering membership reads", async () => {
  const { payment, storage, requests, logins } = setup();
  const pending = payment.fetchMembership();
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await assert.rejects(pending, { code: "AUTH_EXPIRED" });
  assert.equal(storage.has(TOKEN_KEY), false);
  assert.equal(logins(), 0);
});

test("automatic authentication retries once and removes a second expired token", async () => {
  const { payment, storage, requests, logins } = setup();
  const pending = payment.fetchInviteSummary();
  respond(requests[0], 401, { error: { code: "AUTH_EXPIRED" } });
  await new Promise(setImmediate);
  assert.ok(requests[1].url.endsWith("/auth/wechat"));
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
  await assert.rejects(old, { statusCode: 403 });
  assert.deepEqual(Array.from((await payment.communityRequest("program")).rows), ["new"]);
  assert.equal(requests.length, 2);
});
