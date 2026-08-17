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
