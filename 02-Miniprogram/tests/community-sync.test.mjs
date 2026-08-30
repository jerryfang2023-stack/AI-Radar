import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { readCommunityPage } = require("../miniprogram/utils/community-loading.js");

function fixture() {
  const storage = { guanlan_api_token_v1: "session-A" };
  const requests = [];
  let now = 100000;
  const module = { exports: {} };
  vm.runInNewContext(fs.readFileSync("miniprogram/utils/payment.js", "utf8"), {
    module, require: () => ({ flush() {} }),
    Date: class extends Date { static now() { return now; } },
    wx: { getStorageSync: (key) => storage[key], setStorageSync: (key, value) => { storage[key] = value; }, removeStorageSync: (key) => { delete storage[key]; }, request: (request) => requests.push(request) },
  });
  return { api: module.exports, storage, requests, advance: (ms) => { now += ms; }, reply: (index, data, statusCode = 200) => requests[index].success({ data, statusCode }) };
}

test("community lists coalesce requests, clone snapshots and never persist private data", async () => {
  const f = fixture();
  const first = f.api.communityRequest("points");
  const second = f.api.communityRequest("points");
  assert.equal(f.requests.length, 1);
  f.reply(0, { myPoints: 354 });
  const [a, b] = await Promise.all([first, second]);
  a.myPoints = 999;
  assert.equal(b.myPoints, 354);
  assert.equal((await f.api.communityRequest("points")).myPoints, 354);
  assert.equal(f.requests.length, 1);
  assert.deepEqual(Object.keys(f.storage), ["guanlan_api_token_v1"]);
  f.advance(31000);
  let shown;
  const refresh = f.api.communityRequest("points", { onCached: (value) => { shown = value; } });
  assert.equal(shown.myPoints, 354);
  f.reply(1, { myPoints: 360 });
  assert.equal((await refresh).myPoints, 360);
});

test("public home restores bounded local data while syncing current members", async () => {
  const f = fixture();
  const home = { archives: [], featuredMembers: [{ id: 37, name: "Former" }], memberCount: 1 };
  f.storage.guanlan_public_community_home_v2 = { time: 60000, value: home };
  let cached;
  const pending = f.api.communityRequest("home", { onCached: (value) => { cached = value; } });
  assert.equal(cached.memberCount, 1);
  f.reply(0, { archives: [], featuredMembers: [], memberCount: 0 });
  assert.equal((await pending).memberCount, 0);
  assert.equal(f.storage.guanlan_public_community_home_v2.value.memberCount, 0);
  f.advance(300001);
  cached = null;
  const expired = f.api.communityRequest("home", { onCached: (value) => { cached = value; } });
  assert.equal(cached, null);
  f.reply(1, { archives: [], featuredMembers: [], memberCount: 0 });
  await expired;
});

test("account changes and revocation invalidate protected snapshots and old responses", async () => {
  const f = fixture();
  const previous = f.api.communityRequest("directory");
  f.storage.guanlan_api_token_v1 = "session-B";
  const current = f.api.communityRequest("directory");
  f.reply(0, { members: ["A"] });
  await assert.rejects(previous, { code: "COMMUNITY_CHANGED" });
  f.reply(1, { members: ["B"] });
  assert.deepEqual(Array.from((await current).members), ["B"]);
  const revoked = f.api.communityRequest("points", { force: true });
  f.reply(2, { error: { message: "Access revoked" } }, 403);
  await assert.rejects(revoked);
  const fresh = f.api.communityRequest("directory");
  assert.equal(f.requests.length, 4);
  f.reply(3, { error: { message: "Access revoked" } }, 403);
  await assert.rejects(fresh);
});

test("writes invalidate snapshots and full archives are always permission-checked", async () => {
  const f = fixture();
  const listing = f.api.communityRequest("cases");
  f.reply(0, { items: [] }); await listing;
  const write = f.api.communityRequest("cases", { method: "POST", data: { question: "Synthetic" } });
  f.reply(1, { item: { id: "new" } }); await write;
  const updated = f.api.communityRequest("cases");
  f.reply(2, { items: [{ id: "new" }] }); await updated;
  for (let index = 3; index < 5; index += 1) {
    const archive = f.api.communityRequest("archives/issue-13");
    f.reply(index, { item: { body: "private body" } }); await archive;
  }
  assert.equal(f.requests.length, 5);
  assert.deepEqual(Object.keys(f.storage), ["guanlan_api_token_v1"]);
});

test("home prefetch warms common lists without duplicate network calls", async () => {
  const f = fixture();
  const pending = f.api.prefetchCommunity();
  assert.equal(f.requests.length, 4);
  for (let index = 0; index < 4; index += 1) f.reply(index, { value: index });
  await pending;
  await f.api.prefetchCommunity();
  assert.equal(f.requests.length, 4);
});

test("a read racing a write cannot restore the pre-write cache", async () => {
  const f = fixture();
  const write = f.api.communityRequest("cases", { method: "POST", data: {} });
  const earlyRead = f.api.communityRequest("cases");
  f.reply(1, { items: [] }); await earlyRead;
  f.reply(0, { item: { id: "created" } }); await write;
  const current = f.api.communityRequest("cases");
  assert.equal(f.requests.length, 3);
  f.reply(2, { items: [{ id: "created" }] });
  assert.equal((await current).items[0].id, "created");
});

test("fast reads and repeat refreshes never flash a loading strip", async () => {
  const updates = [];
  const page = { data: {}, setData(value) { updates.push(value); Object.assign(this.data, value); } };
  await readCommunityPage(page, async () => {});
  assert.equal(page.data.loaded, true);
  assert.ok(updates.every((update) => !update.showLoading));
  let finish;
  const slow = readCommunityPage(page, () => new Promise((resolve) => { finish = resolve; }));
  const same = readCommunityPage(page, () => { throw new Error("must coalesce"); });
  assert.equal(slow, same);
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.equal(page.data.showLoading, false);
  finish(); await slow;
});

test("first slow read has a skeleton and failed protected refresh clears prior data", async () => {
  const page = { data: { secret: "old" }, setData(value) { Object.assign(this.data, value); } };
  let fail;
  const pending = readCommunityPage(page, () => new Promise((resolve, reject) => { fail = reject; }), () => page.setData({ secret: null }));
  await new Promise((resolve) => setTimeout(resolve, 200));
  assert.equal(page.data.showLoading, true);
  fail(new Error("Access denied")); await pending;
  assert.equal(page.data.secret, null);
  assert.equal(page.data.loaded, false);
  assert.equal(page.data.showLoading, false);
  for (const name of ["community", "community-points", "community-bounty", "community-program", "community-graph"]) {
    const markup = fs.readFileSync(`miniprogram/pages/${name}/index.wxml`, "utf8");
    assert.doesNotMatch(markup, /正在加载|正在处理/);
    assert.match(markup, /community-skeleton/);
  }
});
