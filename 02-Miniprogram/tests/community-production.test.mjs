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

test("role evidence stays runtime-only and is distinct from original self-reported profile", () => {
  const source = fs.readFileSync("miniprogram/pages/community-graph/index.wxml", "utf8");
  assert.match(source, /member\.roleEvidence/);
  assert.match(source, /profile\.roleEvidence/);
  assert.match(source, /member\.project/);
  assert.match(source, /profile\.project/);
  assert.match(source, /bindtap="openEvidence"/);
  assert.doesNotMatch(source, /expectedCreatedAt|expectedNames|sourceSha256/);
});
