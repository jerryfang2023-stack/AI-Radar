import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const data = require("../miniprogram/utils/community-data.js");
test("WXML expressions use native operators, not HTML entities", () => {
  for (const page of ["community", "community-bounty", "community-graph", "community-program", "community-points"]) {
    const source = fs.readFileSync(`miniprogram/pages/${page}/index.wxml`, "utf8");
    assert.doesNotMatch(source, /<\/?(?:strong|small|span|i)[\s>]/, page);
    for (const expression of source.matchAll(/\{\{([\s\S]*?)\}\}/g)) assert.doesNotMatch(expression[1], /&amp;|&gt;|&lt;/, page);
  }
});
function fixture(enabled = true, envVersion = "develop") {
  const storage = {};
  const wx = { getAccountInfoSync: () => ({ miniProgram: { envVersion } }), getStorageSync: (key) => storage[key] ? JSON.parse(storage[key]) : undefined, setStorageSync: (key, value) => { storage[key] = JSON.stringify(value); } };
  const exp = { exports: {} };
  vm.runInNewContext(fs.readFileSync("miniprogram/utils/experience.js", "utf8"), { module: exp, require: () => ({ enabled }), wx });
  const cases = { exports: {} };
  vm.runInNewContext(fs.readFileSync("miniprogram/utils/community-case-store.js", "utf8"), { module: cases, require: (id) => id.includes("community-data") ? data : exp.exports });
  return { exp: exp.exports, store: cases.exports, storage };
}
test("isolated data cannot activate in release/trial or an unenabled source tree", () => {
  for (const [enabled, env] of [[false, "develop"], [true, "release"], [true, "trial"]]) {
    const { exp, store, storage } = fixture(enabled, env);
    assert.equal(exp.readExperience(), null);
    assert.throws(() => store.createCase({}));
    assert.equal(Object.keys(storage).length, 0);
  }
  assert.equal(require("../miniprogram/utils/experience-config.js").enabled, false);
  assert.deepEqual(require("../miniprogram/utils/sharing-preview.js"), {});
});
test("drafts persist, responses update instead of duplicating, co-creation is idempotent", () => {
  const { store, storage } = fixture();
  const item = data.bounties.find((entry) => entry.status === "进行中" && entry.mode === "社群共创");
  const response = { judgement: "先验证需求", reason: "根据已有客户", steps: "做三次访谈" };
  store.saveDraft(item.id, response);
  assert.equal(store.getDraft(item.id).judgement, response.judgement);
  store.answerCase(item.id, response);
  store.answerCase(item.id, { ...response, judgement: "更新的判断" });
  store.joinCase(item.id); store.joinCase(item.id);
  const current = store.listCases().find((entry) => entry.id === item.id);
  assert.equal(current.responses.length, 1);
  assert.equal(current.answers, item.answers + 1);
  assert.equal(current.participants, item.participants + 1);
  assert.equal(current.responses[0].judgement, "更新的判断");
  assert.deepEqual(Object.keys(storage), ["guanlan_isolated_experience_v1"]);
});
test("founder workflow validates ownership and budget and settles once", () => {
  const { store } = fixture();
  assert.throws(() => store.createCase({ question: "短", summary: "", points: 9 }));
  const item = store.createCase({ question: "我们应该怎样验证新产品需求？", summary: "客户需求还不确定", points: 30 });
  assert.equal(item.status, "待审核");
  assert.throws(() => store.answerCase(item.id, {}));
  store.approveCase(item.id);
  assert.throws(() => store.answerCase(item.id, { judgement: "a", reason: "b", steps: "c" }));
  store.addSampleResponse(item.id);
  for (const points of [-1, 10.5, 20, 31]) assert.throws(() => store.closeCase(item.id, [{ id: "sample-helper", points }]));
  assert.throws(() => store.closeCase(item.id, [{ id: "outsider", points: 30 }]));
  assert.throws(() => store.closeCase(data.bounties[0].id, [{ id: "sample-helper", points: 30 }]));
  assert.equal(store.closeCase(item.id, [{ id: "sample-helper", points: 30 }]).status, "已结案");
  assert.throws(() => store.closeCase(item.id, [{ id: "sample-helper", points: 30 }]));
});
test("nonmembers cannot mutate isolated cases", () => {
  const { exp, store } = fixture();
  const value = exp.readExperience(); value.status = "none"; exp.saveExperience(value);
  assert.throws(() => store.saveDraft("create", {}));
});
test("points never substitute demo balance or identity for a real zero balance", async () => {
  let page;
  vm.runInNewContext(fs.readFileSync("miniprogram/pages/community-points/index.js", "utf8"), {
    Page: (value) => { page = value; },
    require: (id) => id.includes("community-loading") ? require("../miniprogram/utils/community-loading.js") : id.includes("payment") ? { communityRequest: async () => { throw new Error("Unavailable"); } } : id.includes("community-data") ? data : id.includes("member.js") ? { getCommunity: () => ({ points: 0, name: "测试账户" }) } : id.includes("access") ? { requireCommunityMember: () => true } : { readExperience: () => null },
  });
  page.setData = (value) => Object.assign(page.data, value); await page.onLoad({});
  assert.equal(page.data.myPoints, 0); assert.equal(page.data.myName, "测试账户");
  assert.equal(page.data.myRank, "—"); assert.equal(page.data.leaderboard.length, 0);
});
test("preview application stores public profile fields without sending or persisting contacts", async () => {
  const { exp } = fixture();
  let page; let requests = 0;
  vm.runInNewContext(fs.readFileSync("miniprogram/pages/community-apply/index.js", "utf8"), {
    Page: (value) => { page = value; },
    require: (id) => id.includes("experience") ? exp : id.includes("payment") ? { submitCommunityApplication() { requests += 1; } } : {},
    wx: { showModal() {}, showToast() {} },
  });
  page.setData = (value) => Object.assign(page.data, value);
  page.data.form = { name: "体验姓名", phone: "13800000000", wechat: "example-only", city: "上海", role: "Founder", industry: "软件", skills: "技术", project: "工具", needs: "交流", direction: "应用", perspective: "实践" };
  await page.submit();
  assert.equal(requests, 0);
  const saved = exp.readExperience();
  assert.equal(saved.status, "pending"); assert.equal(saved.profile.name, "体验姓名");
  assert.equal(saved.application.phone, undefined); assert.equal(saved.application.wechat, undefined);
});
test("edited preview profile appears in directory without writing real member storage", () => {
  const { exp } = fixture();
  const value = exp.readExperience(); value.profile = { name: "新的体验姓名", city: "上海", role: "Founder", industry: "软件", project: "新项目" }; exp.saveExperience(value);
  let page;
  vm.runInNewContext(fs.readFileSync("miniprogram/pages/community-graph/index.js", "utf8"), {
    Page: (result) => { page = result; },
    require: (id) => id.includes("experience") ? exp : id.includes("community-data") ? data : id.includes("access") ? { requireCommunityMember: () => true } : { saveCommunityProfile() { throw new Error("must not write real profile"); } },
  });
  page.setData = (result) => Object.assign(page.data, result); page.onLoad({}); page.onShow();
  assert.equal(page.data.filteredMembers[0].name, "新的体验姓名");
  page.loadProfile("profile"); assert.equal(page.data.profile.project, "新项目");
});
