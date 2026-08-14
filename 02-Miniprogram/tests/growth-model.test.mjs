import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { getLevel, applyReward, applyRedemption } = require("../miniprogram/utils/growth-model.js");

test("growth levels preserve boundaries and progress", () => {
  assert.deepEqual(getLevel(0), { level: 1, name: "初识者", min: 0, next: 300, progress: 0, remaining: 300 });
  assert.deepEqual(getLevel(860), { level: 2, name: "观察者", min: 300, next: 1000, progress: 80, remaining: 140 });
  assert.equal(getLevel(1000).name, "研究者");
  assert.equal(getLevel(50000).level, 8);
  assert.equal(getLevel(50000).progress, 100);
});

test("rewards add to balance and lifetime", () => {
  const wallet = { balance: 128, lifetime: 128, ledger: [] };
  const next = applyReward(wallet, 5, "关注任务", "2026-08-12 10:00", "reward_1");
  assert.equal(next.balance, 133);
  assert.equal(next.lifetime, 133);
  assert.equal(next.ledger[0].points, 5);
});

test("redemptions cannot overdraw and do not reduce lifetime", () => {
  const wallet = { balance: 128, lifetime: 128, ledger: [] };
  assert.equal(applyRedemption(wallet, 150, "权益", "2026-08-12 10:00", "redeem_1").ok, false);
  const result = applyRedemption(wallet, 100, "权益", "2026-08-12 10:00", "redeem_2");
  assert.equal(result.ok, true);
  assert.equal(result.wallet.balance, 28);
  assert.equal(result.wallet.lifetime, 128);
});
