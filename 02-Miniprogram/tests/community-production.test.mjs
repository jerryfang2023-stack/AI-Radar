import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
function pageFor(name, request) {
  let page;
  const events = [];
  vm.runInNewContext(fs.readFileSync(`miniprogram/pages/${name}/index.js`, "utf8"), {
    Page(value) { page = value; },
    require(id) {
      if (id.endsWith("payment.js")) return { communityRequest: request, fetchMembership: async () => ({}) };
      if (id.endsWith("experience.js")) return { isExperience: () => false, readExperience: () => null };
      if (id.endsWith("community-access.js")) return { requireCommunityMember: () => true };
      if (id.endsWith("member.js")) return { getCommunity: () => ({ status: "joined" }), saveCommunityProfile: (data) => events.push(["save", data]) };
      if (id.endsWith("community-data.js")) return require("../miniprogram/utils/community-data.js");
      if (id.endsWith("community-loading.js")) return require("../miniprogram/utils/community-loading.js");
      if (id.endsWith("tab-bar.js") || id.endsWith("sharing-preview.js") || id.endsWith("community-case-store.js")) return {};
      throw new Error(id);
    },
    setTimeout(fn) { fn(); },
    wx: Object.fromEntries(["navigateTo", "redirectTo", "showToast"].map((method) => [method, (data) => events.push([method, data])])),
  });
  page.setData = (values) => Object.assign(page.data, values);
  return { page, events };
}

test("production homepage never substitutes demo archives on API failure", async () => {
  const { page } = pageFor("community", async () => { throw new Error("Unavailable"); });
  await page.refresh();
  assert.equal(page.data.featuredArchive, null);
  assert.equal(page.data.bounty, null);
  assert.equal(page.data.error, "Unavailable");
});

test("homepage renders one recommendation and four distinct full-width archive rows", async () => {
  let archives = Array.from({ length: 7 }, (_, index) => ({ id: "issue-" + index, issue: index, title: "Archive " + index, date: "2026-08-30" }));
  const { page } = pageFor("community", async () => ({ archives, bounty: null, featuredMembers: [], memberCount: 0 }));
  await page.refresh();
  assert.equal(page.data.featuredArchive.id, "issue-0");
  assert.equal(page.data.olderArchives.length, 4);
  assert.deepEqual(Array.from(page.data.olderArchives, item => item.id), ["issue-1", "issue-2", "issue-3", "issue-4"]);
  archives = archives.slice(0, 2);
  await page.refresh();
  assert.equal(page.data.olderArchives.length, 1);
  const markup = fs.readFileSync("miniprogram/pages/community/index.wxml", "utf8");
  const style = fs.readFileSync("miniprogram/pages/community/index.wxss", "utf8");
  assert.match(markup, /编辑推荐/);
  assert.match(markup, /class="community-archive-list"/);
  assert.match(style, /\.community-archive-list\s*\{[^}]*flex-direction: column/);
  assert.match(style, /\.community-archive-list button\s*\{[^}]*width: 100%/);
});

test("homepage hides the bounty module unless a published bounty exists", async () => {
  let bounty = null;
  const { page } = pageFor("community", async () => ({ archives: [], bounty, featuredMembers: [], memberCount: 0 }));
  await page.refresh();
  assert.equal(page.data.bounty, null);
  bounty = { id: "published-case", question: "A reviewed question", points: 20 };
  await page.refresh();
  assert.equal(page.data.bounty.id, "published-case");
  bounty = null;
  await page.refresh();
  assert.equal(page.data.bounty, null);
  const template = fs.readFileSync("miniprogram/pages/community/index.wxml", "utf8");
  const cards = template.match(/<button[^>]*class="bounty-feature"[^>]*>/g);
  assert.equal(cards.length, 1);
  assert.match(cards[0], /wx:if="{{bounty}}"/);
  assert.doesNotMatch(template, /发起问题，与成员一起寻找答案/);
  assert.match(template, /data-url="\/pages\/community-bounty\/index" bindtap="openProtected">悬赏令/);
});

test("protected reader renders server sections and clears them when access is revoked", async () => {
  let revoked = false;
  const { page } = pageFor("community-program", async (path) => {
    assert.equal(path, "archives/issue-13");
    if (revoked) throw new Error("请先加入社群");
    return { item: { speakerDetails: [{ name: "Test", sections: [{ title: "Section", paragraphs: ["Server-only body"] }], qa: [] }] } };
  });
  await page.onLoad({ type: "speaker", id: "issue-13", speaker: "0" });
  assert.equal(page.data.speaker.sections[0].paragraphs[0], "Server-only body");
  revoked = true;
  await page.refresh();
  assert.equal(page.data.speaker, null);
  assert.equal(page.data.item, null);
});

test("profile evidence links to its source and is never submitted as self-editable data", async () => {
  const calls = [];
  const profile = { name: "Test", city: "Test city", company: "", role: "Builder", industry: "Tools", ai: "", project: "Test project", ability: "", need: "", revision: 2, roleEvidence: { archiveId: "issue-13", speakerIndex: 1, roles: ["Test role"] } };
  let fail = true;
  const { page, events } = pageFor("community-graph", async (path, options) => {
    calls.push([path, options]);
    if (!options) return { profile };
    if (fail) throw new Error("Network failed");
    return { profile: { ...profile, revision: 3 } };
  });
  await page.onLoad({ mode: "profile" });
  page.openEvidence();
  assert.match(events[0][1].url, /type=speaker&id=issue-13&speaker=1/);
  await page.saveProfile();
  assert.equal(events.filter(([type]) => type === "save" || type === "redirectTo").length, 0);
  assert.equal(calls[1][1].data.roleEvidence, undefined);
  assert.equal(calls[1][1].data.revision, 2);
  fail = false;
  await page.saveProfile();
  assert.equal(events.filter(([type]) => type === "save").length, 1);
  assert.equal(events.filter(([type]) => type === "redirectTo").length, 1);
});

test("directory refresh failures clear earlier protected member records", async () => {
  const { page } = pageFor("community-graph", async () => { throw new Error("Access denied"); });
  page.data.member = { name: "Old protected profile" };
  page.data.members = [page.data.member];
  page.options = { id: "1" };
  page.data.mode = "member";
  await page.refresh();
  assert.equal(page.data.member, null);
  assert.equal(page.data.members.length, 0);
});

test("role map sorts actual counts and preserves supply meanings after reordering", async () => {
  const roles = [
    { name: "行业资源方", count: 1, members: [{ id: "resource" }] },
    { name: "流量与增长", count: 5, members: [] },
    { name: "出海与跨境", count: 2, members: [] },
    { name: "企业服务落地", count: 32, members: [{ id: "builder" }] },
    { name: "技术构建者", count: 2, members: [] },
    { name: "资本与研究", count: 3, members: [] },
  ];
  const { page } = pageFor("community-graph", async () => ({ members: [], roles }));
  await page.onLoad();
  assert.equal(page.data.activeRoleData.name, "企业服务落地");
  assert.equal(page.data.supply[0].count, 8);
  assert.equal(page.data.supply[1].count, 32);
  page.selectRole({ currentTarget: { dataset: { index: 1 } } });
  const selected = page.data.activeRoleData.name;
  roles[4].count = 50;
  await page.refresh();
  assert.equal(page.data.roles[0].name, "技术构建者");
  assert.equal(page.data.activeRoleData.name, selected);
});

test("bounty answer waits for server acknowledgement and cannot report success on failure", async () => {
  const { page, events } = pageFor("community-bounty", async () => { throw Object.assign(new Error("Access revoked"), { statusCode: 403 }); });
  page.caseId = "a".repeat(24);
  page.data.item = { question: "Protected question" };
  page.submitAnswer();
  await new Promise(setImmediate);
  assert.equal(page.data.item, null);
  assert.equal(events.filter(([type, data]) => type === "showToast" && data.title.includes("已提交")).length, 0);
  assert.equal(page.data.error, "Access revoked");
});

test("community consistently names the member navigation as role map", () => {
  for (const page of ["community", "community-graph"]) {
    const markup = fs.readFileSync(`miniprogram/pages/${page}/index.wxml`, "utf8");
    assert.match(markup, /角色图谱/);
    assert.doesNotMatch(markup, /行业图谱|INDUSTRY ROLE MAP/);
  }
  assert.match(fs.readFileSync("miniprogram/pages/community-graph/index.wxml", "utf8"), /行业领域/);
});

test("role evidence stays runtime-only and is distinct from original self-reported profile", () => {
  const source = fs.readFileSync("miniprogram/pages/community-graph/index.wxml", "utf8");
  assert.match(source, /member\.roleEvidence/);
  assert.match(source, /profile\.roleEvidence/);
  assert.match(source, /member\.project/);
  assert.match(source, /profile\.project/);
  assert.match(source, /bindtap="openEvidence"/);
  assert.doesNotMatch(source, /expectedCreatedAt|expectedNames|sourceSha256/);
});
