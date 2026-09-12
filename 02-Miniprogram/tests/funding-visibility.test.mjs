
import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { isFundingVisible } = require("../miniprogram/utils/funding-visibility.js");
test("hides robotic systems across canonical and runtime cards, retaining chips and software", () => {
  assert.equal(isFundingVisible({ product_form: { id: "robotic_system" } }), false);
  assert.equal(isFundingVisible({ productForm: "机器人系统" }), false);
  assert.equal(isFundingVisible({ productForm: "芯片", company: "机器人芯片公司" }), true);
  assert.equal(isFundingVisible({ productForm: "软件" }), true);
});
