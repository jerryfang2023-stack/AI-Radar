import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const appConfig = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
const terminalSource = fs.readFileSync("miniprogram/pages/terminal/index.wxml", "utf8");
const marketSource = fs.readFileSync("miniprogram/pages/market/index.wxml", "utf8");
const marketLogic = fs.readFileSync("miniprogram/pages/market/index.js", "utf8");
const watchlistSource = fs.readFileSync("miniprogram/pages/watchlist/index.wxml", "utf8");
const headerSource = fs.readFileSync("miniprogram/components/app-header/index.wxml", "utf8");
const headerStyles = fs.readFileSync("miniprogram/components/app-header/index.wxss", "utf8");
const membershipSource = fs.readFileSync("miniprogram/pages/membership/index.wxml", "utf8");
const membershipModelSource = fs.readFileSync("miniprogram/utils/membership-model.js", "utf8");
const profileSource = fs.readFileSync("miniprogram/pages/profile/index.wxml", "utf8");
const profileLogic = fs.readFileSync("miniprogram/pages/profile/index.js", "utf8");
const inviteSource = fs.readFileSync("miniprogram/pages/invite/index.wxml", "utf8");
const publicFiles = [
  "miniprogram/pages/terminal/index.wxml",
  "miniprogram/pages/market/index.wxml",
  "miniprogram/pages/entity-detail/index.wxml",
  "miniprogram/pages/watchlist/index.wxml",
  "miniprogram/pages/detail/index.wxml",
  "miniprogram/pages/follows/index.wxml",
  "miniprogram/pages/compare/index.wxml",
  "miniprogram/pages/saved/index.wxml",
];

test("uses the confirmed financing column and public-facing copy", () => {
  assert.equal(appConfig.tabBar.list[0].text, "融资");
  assert.equal(appConfig.tabBar.list[1].text, "生态");
  assert.match(terminalSource, /<app-header title="融资情报"/u);
  assert.match(marketSource, /<app-header title="生态图谱"/u);
  assert.match(watchlistSource, /<app-header title="商业观察"/u);
  assert.match(publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n"), /中国区/u);

  const publicSource = publicFiles.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  for (const internalCopy of ["融资终端", "多源核验", "多源已核验", "已验证信号", "证据状态"]) {
    assert.doesNotMatch(publicSource, new RegExp(internalCopy, "u"));
  }
});

test("exposes the confirmed membership plans and point exchange entry", () => {
  const membershipContract = `${membershipSource}\n${membershipModelSource}`;
  for (const copy of ["7 天完整权益体验", "30", "168", "300", "月度会员", "半年会员", "年度会员", "所有栏目的完整浏览权", "活跃积分兑换"]) {
    assert.match(membershipContract, new RegExp(copy, "u"));
  }
  assert.match(membershipSource, /wx:for="\{\{plans\}\}"/u);
});

test("keeps observer growth primary and membership status compact on profile", () => {
  assert.ok(profileSource.indexOf('class="growth-card"') < profileSource.indexOf('class="membership-card"'));
  assert.doesNotMatch(profileSource, /class="stats-card/u);
  const compactMembership = profileSource.slice(profileSource.indexOf('class="membership-card"'), profileSource.indexOf('class="section-heading"'));
  assert.match(compactMembership, /会员权益/u);
  assert.match(compactMembership, /有效至/u);
  assert.doesNotMatch(compactMembership, /元\/月/u);
  assert.match(compactMembership, /开通会员/u);
  assert.match(profileSource, /邀请人得 300 活跃积分/u);
});

test("opens a dedicated invitation value page before sharing", () => {
  assert.ok(appConfig.pages.includes("pages/invite/index"));
  assert.match(profileLogic, /openInvite/u);
  assert.match(profileSource, /bindtap="openInvite"/u);
  assert.doesNotMatch(profileSource, /open-type="share"/u);
  for (const copy of ["新用户首次注册即可获得 7 天全部栏目体验", "300 活跃积分", "融资情报", "生态图谱", "商业观察", "每位新用户仅计入一次有效邀请", "系统确认结果为准", "开始 7 天体验"]) {
    assert.match(inviteSource, new RegExp(copy, "u"));
  }
  assert.match(inviteSource, /open-type="share"/u);
});

test("keeps list pages concise while preserving detail-page actions", () => {
  assert.doesNotMatch(terminalSource, /收藏/u);
  assert.doesNotMatch(terminalSource, /checkbox/u);
  assert.match(terminalSource, /placeholder="公司 \/ 机构 \/ 产品"/u);
  assert.doesNotMatch(terminalSource, /category-chip|市场类别|全部市场/u);
  assert.match(marketSource, /企业库/u);
  assert.match(marketSource, /机构库/u);
  assert.match(marketSource, /人物库/u);
  assert.match(marketLogic, /企业 \/ 产品 \/ 赛道/u);
  assert.match(marketLogic, /机构 \/ 已投公司 \/ 赛道/u);
  assert.match(marketLogic, /人物 \/ 企业 \/ 职务/u);
  assert.doesNotMatch(`${marketSource}\n${watchlistSource}`, /AI FUNDING|GUANLAN RESEARCH|更新日期/u);
});

test("matches the H5 branded header across the first three tabs", () => {
  assert.match(headerSource, /logo-wavesight-reference-horizontal\.svg/u);
  assert.match(headerSource, /class="tab-header-title"/u);
  assert.match(headerStyles, /\.tab-header-logo/u);
  assert.match(headerStyles, /text-align:\s*center/u);
  assert.match(headerStyles, /border-bottom:\s*1rpx/u);
});
