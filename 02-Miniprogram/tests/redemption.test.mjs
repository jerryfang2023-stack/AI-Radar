import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  global.wx = {
    getStorageSync(key) { return values.get(key); },
    setStorageSync(key, value) { values.set(key, structuredClone(value)); },
    removeStorageSync(key) { values.delete(key); },
  };
  return values;
}

test("repeatable point redemption deducts balance and extends membership each time", () => {
  const storage = createStorage({
    guanlan_growth_wallet_v1: { balance: 650, lifetime: 650, ledger: [] },
    guanlan_membership_v1: {
      trialStartedAt: "2099-01-01T00:00:00.000Z",
      trialEndsAt: "2099-01-08T00:00:00.000Z",
      memberEndsAt: "",
    },
  });
  const { redeemBenefit } = require("../miniprogram/utils/member.js");

  const first = redeemBenefit("membership_7d");
  const second = redeemBenefit("membership_7d");

  assert.equal(first.ok, true);
  assert.equal(second.ok, true);
  assert.equal(storage.get("guanlan_growth_wallet_v1").balance, 50);
  assert.equal(storage.get("guanlan_growth_wallet_v1").lifetime, 650);
  assert.equal(storage.get("guanlan_growth_wallet_v1").ledger.length, 2);
  assert.equal(storage.get("guanlan_membership_v1").memberEndsAt, "2099-01-22T00:00:00.000Z");
});

test("insufficient balance leaves wallet and membership unchanged", () => {
  const initialMembership = {
    trialStartedAt: "2099-01-01T00:00:00.000Z",
    trialEndsAt: "2099-01-08T00:00:00.000Z",
    memberEndsAt: "",
  };
  const storage = createStorage({
    guanlan_growth_wallet_v1: { balance: 128, lifetime: 128, ledger: [] },
    guanlan_membership_v1: initialMembership,
  });
  const { redeemBenefit } = require("../miniprogram/utils/member.js");

  const result = redeemBenefit("membership_7d");

  assert.equal(result.ok, false);
  assert.equal(result.reason, "积分不足");
  assert.equal(storage.get("guanlan_growth_wallet_v1").balance, 128);
  assert.deepEqual(storage.get("guanlan_membership_v1"), initialMembership);
});

test("remote paid membership sync preserves a later point-redemption entitlement", () => {
  const storage = createStorage({
    guanlan_membership_v1: {
      trialStartedAt: "2099-01-01T00:00:00.000Z",
      trialEndsAt: "2099-01-08T00:00:00.000Z",
      memberEndsAt: "2099-03-01T00:00:00.000Z",
    },
  });
  const { syncMembership } = require("../miniprogram/utils/member.js");
  syncMembership({
    trialStartedAt: "2099-01-01T00:00:00.000Z",
    trialEndsAt: "2099-01-08T00:00:00.000Z",
    memberEndsAt: "2099-02-01T00:00:00.000Z",
  });
  assert.equal(storage.get("guanlan_membership_v1").memberEndsAt, "2099-03-01T00:00:00.000Z");
});
