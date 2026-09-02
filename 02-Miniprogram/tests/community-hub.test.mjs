import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
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
  for (const label of ["造浪者计划", "悬赏令", "积分榜", "角色图谱", "分享实录"]) assert.match(home, new RegExp(label, "u"));
  assert.match(home, /community-focus-card/u);
  assert.match(homeLogic, /requireCommunityMember/u);
  assert.match(access, /申请加入/u);
  assert.match(access, /claim_pending/u);
  assert.match(access, /无需再次申请/u);
  assert.doesNotMatch(access, /switchTab/u);
});

test("features three distinct real archives without homepage schedules or personal points", async () => {
  let page;
  const navigations = [];
  let memberAllowed = false;
  let tabIndex;
  vm.runInNewContext(homeLogic, {
    Page(config) { page = config; },
    require(id) {
      if (id.endsWith("community-data.js")) return data;
      if (id.endsWith("community-loading.js")) return require("../miniprogram/utils/community-loading.js");
      if (id.endsWith("community-access.js")) return { requireCommunityMember(callback) { if (memberAllowed) callback(); } };
      if (id.endsWith("tab-bar.js")) return { syncTabBar(instance, index) { tabIndex = index; } };
      if (id.endsWith("experience.js")) return { isExperience() { return false; }, readExperience() { return null; } };
      if (id.endsWith("payment.js")) return { communityRequest: async () => ({ archives: data.archives.slice(0, 3), bounty: null, featuredMembers: [], memberCount: 0 }), fetchMembership: async () => ({}) };
      if (id.endsWith("member.js")) return {};
      throw new Error(`Unexpected homepage dependency: ${id}`);
    },
    wx: { navigateTo({ url }) { navigations.push(url); } },
  });
  assert.equal(page.data.featuredArchive, null);
  page.setData = (value) => Object.assign(page.data, value);
  await page.refresh();
  const displayed = [page.data.featuredArchive, ...page.data.olderArchives];
  assert.equal(displayed.length, 3);
  assert.equal(new Set(displayed.map((item) => item.id)).size, 3);
  for (const item of displayed) {
    const source = data.archives.find((entry) => entry.id === item.id);
    assert.ok(source);
    for (const field of ["title", "subtitle", "speakers", "date"]) assert.equal(item[field], source[field]);
  }
  assert.doesNotMatch(home, /type=schedule|schedules\[|下一场|本场排期|正在进行|points-strip|最近积分|社群积分/u);
  assert.match(home, /data-id="\{\{featuredArchive\.id\}\}" bindtap="openArchive"/u);
  assert.match(home, /data-id="\{\{item\.id\}\}" bindtap="openArchive"/u);
  assert.match(home, /tab=archive/u);
  for (const item of displayed) {
    memberAllowed = false;
    page.openArchive({ currentTarget: { dataset: { id: item.id } } });
    memberAllowed = true;
    page.openArchive({ currentTarget: { dataset: { id: item.id } } });
  }
  assert.equal(navigations.length, 3);
  page.setData = (value) => Object.assign(page.data, value);
  page.onShow();
  assert.equal(tabIndex, 2);
});

test("publishes only public member fields in the packaged directory", () => {
  assert.equal(data.members.length, 14);
  assert.equal(data.roles.length, 6);
  assert.equal(data.leaderboard.length, 14);
  assert.doesNotMatch(dataSource, /sylvan/i);
  for (const member of data.members) {
    for (const privateField of ["phone", "wechat", "review", "internal", "contact"]) assert.equal(member[privateField], undefined);
  }
  assert.doesNotMatch(dataSource, /手机号|微信号|审核备注/u);
  assert.match(graph, /手机号、微信号和内部审核信息不会公开/u);
});

test("shows the role member list immediately after role selection", () => {
  assert.doesNotMatch(graph, /role-hero|member-heading|MEMBERS BY ROLE|当前角色/u);
  assert.match(graph, /class="role-tabs"[\s\S]*?<\/scroll-view>\s*(?:<text[^>]*>[\s\S]*?<\/text>)?<view class="member-list">/u);
  assert.ok(graph.includes('wx:for="{{activeRoleData.members}}"'));
  assert.match(graph, /bindtap="openMember"/u);
  assert.match(graph, /bindtap="selectRole"/u);
});

test("uses the confirmed points terminology and rule grouping", () => {
  assert.match(points, />积分榜</u);
  assert.doesNotMatch(points, /贡献积分榜|社群贡献积分榜/u);
  assert.match(points, /互动积分/u);
  assert.match(points, /专项积分/u);
  assert.equal(data.pointRules.interactive[0].title, "活动主持");
  assert.ok(data.pointRules.special.some((item) => item.title === "Demo 秀"));
});
