import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const app = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
const home = fs.readFileSync("miniprogram/pages/community/index.wxml", "utf8");
const homeLogic = fs.readFileSync("miniprogram/pages/community/index.js", "utf8");
const access = fs.readFileSync("miniprogram/utils/community-access.js", "utf8");
const graph = fs.readFileSync("miniprogram/pages/community-graph/index.wxml", "utf8");
const points = fs.readFileSync("miniprogram/pages/community-points/index.wxml", "utf8");
const dataSource = fs.readFileSync("miniprogram/utils/community-data.js", "utf8");
const data = require("../miniprogram/utils/community-data.js");

test("registers the confirmed native community hub as the third tab", () => {
  assert.equal(app.tabBar.list[2].pagePath, "pages/community/index");
  assert.equal(app.tabBar.list[2].text, "社群");
  for (const page of ["community", "community-program", "community-bounty", "community-points", "community-graph"]) {
    assert.ok(app.pages.includes(`pages/${page}/index`));
  }
});

test("keeps the community home visible and gates detail actions", () => {
  for (const label of ["造浪者计划", "悬赏令", "积分榜", "行业图谱", "下一场", "近期实录"]) assert.match(home, new RegExp(label, "u"));
  assert.match(home, /community-focus-card/u);
  assert.match(homeLogic, /archives\.slice\(0, 2\)/u);
  assert.match(homeLogic, /requireCommunityMember/u);
  assert.match(access, /申请加入/u);
  assert.doesNotMatch(access, /switchTab/u);
});

test("publishes only public member fields in the packaged directory", () => {
  assert.equal(data.members.length, 15);
  assert.equal(data.roles.length, 6);
  assert.equal(data.leaderboard.length, 15);
  for (const member of data.members) {
    for (const privateField of ["phone", "wechat", "review", "internal", "contact"]) assert.equal(member[privateField], undefined);
  }
  assert.doesNotMatch(dataSource, /手机号|微信号|审核备注/u);
  assert.match(graph, /手机号、微信号和内部审核信息不会公开/u);
});

test("uses the confirmed points terminology and rule grouping", () => {
  assert.match(points, />积分榜</u);
  assert.doesNotMatch(points, /贡献积分榜|社群贡献积分榜/u);
  assert.match(points, /互动积分/u);
  assert.match(points, /专项积分/u);
  assert.equal(data.pointRules.interactive[0].title, "活动主持");
  assert.ok(data.pointRules.special.some((item) => item.title === "Demo 秀"));
});
