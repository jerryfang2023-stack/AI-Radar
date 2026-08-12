import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appConfig = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
const publicFiles = [
  "miniprogram/pages/terminal/index.wxml",
  "miniprogram/pages/market/index.wxml",
  "miniprogram/pages/detail/index.wxml",
  "miniprogram/pages/follows/index.wxml",
  "miniprogram/pages/compare/index.wxml",
  "miniprogram/pages/saved/index.wxml",
];

test("uses the confirmed financing column and public-facing copy", () => {
  assert.equal(appConfig.tabBar.list[0].text, "融资");
  const source = publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  assert.match(source, /title="融资情报"/u);
  for (const internalCopy of ["融资终端", "多源核验", "多源已核验", "已验证信号", "证据状态"]) {
    assert.doesNotMatch(source, new RegExp(internalCopy, "u"));
  }
});
