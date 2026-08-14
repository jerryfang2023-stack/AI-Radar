import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const storage = new Map();
globalThis.wx = {
  getStorageSync(key) { return storage.get(key); },
  setStorageSync(key, value) { storage.set(key, value); },
  removeStorageSync(key) { storage.delete(key); },
};

const require = createRequire(import.meta.url);
const { getGrowthSnapshot, getWallet, recordBehavior, syncInviteRewards } = require("../miniprogram/utils/member.js");

test("daily check-in awards five points only once per day", () => {
  storage.clear();
  const before = getGrowthSnapshot().wallet.balance;
  const first = recordBehavior("checkin", "daily");
  const second = recordBehavior("checkin", "daily");
  const growth = getGrowthSnapshot();
  const task = growth.tasks.find((item) => item.id === "checkin");

  assert.equal(first.awarded, 5);
  assert.equal(second.awarded, 0);
  assert.equal(growth.wallet.balance, before + 5);
  assert.equal(task.current, 1);
  assert.equal(task.completed, true);
  assert.equal(growth.wallet.ledger.filter((item) => item.label === "完成任务：每日签到").length, 1);
});

test("server-confirmed invite rewards sync into the local wallet once", () => {
  storage.clear();
  const before = getWallet().balance;
  const first = syncInviteRewards(600);
  const repeated = syncInviteRewards(600);
  assert.equal(first.awarded, 600);
  assert.equal(repeated.awarded, 0);
  assert.equal(getWallet().balance, before + 600);
  assert.equal(getWallet().ledger.filter((item) => item.label === "邀请好友奖励").length, 1);
});
