import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const { decideDetailAccess } = require("../miniprogram/utils/metered-access.js");

test("allows one distinct detail sample and locks the second for unregistered visitors", () => {
  assert.deepEqual(decideDetailAccess("unregistered", "", "funding:1"), {
    contentLocked: false,
    lockReason: "sample",
  });
  assert.deepEqual(decideDetailAccess("unregistered", "funding:1", "funding:1"), {
    contentLocked: false,
    lockReason: "sample",
  });
  assert.deepEqual(decideDetailAccess("unregistered", "funding:1", "entity:company:2"), {
    contentLocked: true,
    lockReason: "unregistered",
  });
});

test("keeps registered access open and routes expired access to membership", () => {
  assert.deepEqual(decideDetailAccess("active", "funding:1", "entity:company:2"), {
    contentLocked: false,
    lockReason: "active",
  });
  assert.deepEqual(decideDetailAccess("expired", "", "funding:1"), {
    contentLocked: true,
    lockReason: "expired",
  });
});


test("registered denial routes to membership even when the local entitlement is stale", async () => {
  const { contentLockReason, requestLockedContent } = require("../miniprogram/utils/metered-access.js");
  const navigations = [];
  globalThis.wx = { getStorageSync: (key) => key === "guanlan_api_token_v1" ? "registered" : { trialEndsAt: "2099-01-01" }, navigateTo: (value) => navigations.push(value.url) };
  try {
    const reason = contentLockReason({ statusCode: 403, code: "MEMBERSHIP_REQUIRED" });
    assert.equal(reason, "expired");
    await requestLockedContent({ data: { lockReason: reason }, setData() { throw new Error("must not register again"); } });
    assert.deepEqual(navigations, ["/pages/membership/index"]);
    assert.equal(contentLockReason({ accessState: "session" }), "session");
    assert.equal(contentLockReason({ accessState: "unregistered" }), "session");
  } finally { delete globalThis.wx; }
});
