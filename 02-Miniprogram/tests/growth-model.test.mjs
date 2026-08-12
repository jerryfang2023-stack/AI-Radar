import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { getLevel, applyReward, applyRedemption } = require("../miniprogram/utils/growth-model.js");

test("growth levels preserve boundaries and progress", () => {
  assert.deepEqual(getLevel(128), { level: 2, name: "观察者", min: 100, next: 200, progress: 28, remaining: 72 });
  assert.equal(getLevel(700).level, 5);
  assert.equal(getLevel(700).progress, 100);
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
