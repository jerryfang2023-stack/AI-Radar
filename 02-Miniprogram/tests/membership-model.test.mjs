import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { DAY_MS, PRICING_PLANS, createMembership, membershipSnapshot, extendMembership } = require("../miniprogram/utils/membership-model.js");

test("publishes the confirmed monthly, half-year and annual prices", () => {
  assert.deepEqual(
    PRICING_PLANS.map(({ price, days }) => ({ price, days })),
    [{ price: 30, days: 30 }, { price: 168, days: 180 }, { price: 300, days: 365 }]
  );
});
const now = Date.parse("2026-08-13T00:00:00.000Z");

test("new users receive a seven day full-access trial", () => {
  const membership = createMembership(now);
  const snapshot = membershipSnapshot(membership, now);
  assert.equal(snapshot.status, "trial");
  assert.equal(snapshot.remainingDays, 7);
  assert.equal(Date.parse(membership.trialEndsAt) - now, 7 * DAY_MS);
});

test("visitors remain unregistered until the server confirms a trial", () => {
  const snapshot = membershipSnapshot({}, now);
  assert.equal(snapshot.status, "unregistered");
  assert.equal(snapshot.registered, false);
  assert.equal(snapshot.active, false);
  assert.equal(snapshot.activeUntil, "");
});

test("point redemptions extend membership after the current entitlement", () => {
  const trial = createMembership(now);
  const extended = extendMembership(trial, 30, now + DAY_MS);
  assert.equal(Date.parse(extended.memberEndsAt), Date.parse(trial.trialEndsAt) + 30 * DAY_MS);
  assert.equal(membershipSnapshot(extended, now + DAY_MS).status, "member");
});

test("expired users have no active entitlement", () => {
  const membership = createMembership(now);
  const snapshot = membershipSnapshot(membership, now + 8 * DAY_MS);
  assert.equal(snapshot.status, "expired");
  assert.equal(snapshot.active, false);
});
