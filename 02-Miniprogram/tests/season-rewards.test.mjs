import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);

function harness(name, request, allowed = true) {
  let page;
  const navigation = [];
  vm.runInNewContext(fs.readFileSync(`miniprogram/pages/${name}/index.js`, "utf8"), {
    Page: (config) => { page = config; }, setTimeout, clearTimeout,
    require: (id) => {
      if (id.includes("community-data")) return require("../miniprogram/utils/community-data.js");
      if (id.includes("community-loading")) return require("../miniprogram/utils/community-loading.js");
      if (id.includes("payment")) return { communityRequest: request };
      if (id.includes("access")) return { requireCommunityMember: () => allowed };
      if (id.includes("member.js")) return { getCommunity: () => ({ name: "Current", points: 999999 }) };
      return { readExperience: () => null };
    },
    wx: { navigateTo: ({ url }) => navigation.push(url), stopPullDownRefresh: () => navigation.push("stopped") },
  });
  page.setData = (data) => Object.assign(page.data, data);
  return { page, navigation };
}
const payload = (season, points) => ({ season, myPoints: points, myRank: 1, myName: "Current", totalPoints: 30, totalMembers: 1, totalSessions: 2, leaderboard: [{ memberId: 7, points }], ledger: [], updatedAt: "2026-09-14" });

test("season tabs discard stale responses and preserve the selected detail/share link", async () => {
  const reads = [];
  const { page, navigation } = harness("community-points", (path, options) => new Promise((resolve, reject) => reads.push({ path, options, resolve, reject })));
  const initial = page.onLoad({});
  assert.equal(page.data.myPoints, 0);
  const second = page.switchSeason({ currentTarget: { dataset: { season: "season-2" } } });
  assert.equal(reads[1].path, "season-points?season=season-2");
  reads[1].resolve(payload("season-2", 10)); await second;
  reads[0].resolve(payload("total", 30)); await initial;
  assert.equal(page.data.myPoints, 10);
  assert.equal(page.data.season, "season-2");
  assert.equal(page.__shareOptions.season, "season-2");
  page.openDetail(); assert.match(navigation[0], /mode=detail&season=season-2$/);
  const retry = page.onPullDownRefresh();
  assert.equal(reads[2].options.force, true);
  reads[2].reject(new Error("Membership revoked")); await retry;
  assert.equal(page.data.leaderboard.length, 0);
  assert.equal(page.data.totalPoints, 0);
  assert.equal(navigation.at(-1), "stopped");
});

test("season and Token pages require membership and never invent granted rewards", async () => {
  for (const name of ["community-points", "community-token"]) {
    let calls = 0;
    const { page } = harness(name, () => { calls++; }, false);
    await page.onLoad(); assert.equal(calls, 0);
  }
  let fail = false;
  const { page } = harness("community-token", async () => {
    if (fail) throw new Error("Revoked");
    return { pool: { amount: null, status: "draft" }, reward: { amount: null, status: "pending", issuedAt: "" }, myPoints: 0 };
  });
  await page.onLoad(); assert.equal(page.data.reward.amount, null);
  assert.equal(page.data.rulesOpen, true);
  page.toggleRules(); assert.equal(page.data.rulesOpen, false);
  fail = true; await page.refresh(); assert.equal(page.data.pool, null);
  const template = fs.readFileSync("miniprogram/pages/community-token/index.wxml", "utf8");
  assert.doesNotMatch(template, /兑换|折扣|bindtap="claim/);
});

test("Token amounts use thousands separators and preserve missing values", async () => {
  const { page } = harness("community-token", async () => ({ pool: { amount: 1000000000, start: "2026-09-14", end: "2026-10-10" }, reward: { amount: 1234567, issuedAt: "" } }));
  await page.onLoad();
  assert.equal(page.data.poolAmount, "1,000,000,000");
  assert.equal(page.data.rewardAmount, "1,234,567");
});
