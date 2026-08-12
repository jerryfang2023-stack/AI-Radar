import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appConfig = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
const terminalSource = fs.readFileSync("miniprogram/pages/terminal/index.wxml", "utf8");
const marketSource = fs.readFileSync("miniprogram/pages/market/index.wxml", "utf8");
const watchlistSource = fs.readFileSync("miniprogram/pages/watchlist/index.wxml", "utf8");
const publicFiles = [
  "miniprogram/pages/terminal/index.wxml",
  "miniprogram/pages/market/index.wxml",
  "miniprogram/pages/watchlist/index.wxml",
  "miniprogram/pages/detail/index.wxml",
  "miniprogram/pages/follows/index.wxml",
  "miniprogram/pages/compare/index.wxml",
  "miniprogram/pages/saved/index.wxml",
];

test("uses the confirmed financing column and public-facing copy", () => {
  assert.equal(appConfig.tabBar.list[0].text, "融资");
  assert.match(terminalSource, /<app-header title="融资情报"/u);
  assert.match(marketSource, /<app-header title="市场概览"/u);
  assert.match(watchlistSource, /<app-header title="商业观察"/u);
  assert.match(publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n"), /中国区/u);

  const publicSource = publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  for (const internalCopy of ["融资终端", "多源核验", "多源已核验", "已验证信号", "证据状态"]) {
    assert.doesNotMatch(publicSource, new RegExp(internalCopy, "u"));
  }
});

test("keeps list pages concise while preserving detail-page actions", () => {
  assert.doesNotMatch(terminalSource, /收藏/u);
  assert.doesNotMatch(terminalSource, /checkbox/u);
  assert.doesNotMatch(`${marketSource}\n${watchlistSource}`, /AI FUNDING|GUANLAN RESEARCH|更新日期/u);
});
