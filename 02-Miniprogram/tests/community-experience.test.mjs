import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import vm from "node:vm";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const data = require("../miniprogram/utils/community-data.js");
test("WXML navigation attributes never contain HTML-escaped query separators", () => {
  for (const file of fs.readdirSync("miniprogram", { recursive: true }).filter((file) => file.endsWith(".wxml"))) {
    const source = fs.readFileSync(`miniprogram/${file}`, "utf8");
    for (const [, value] of source.matchAll(/(?:data-url|\burl)="([^"]*)"/g)) assert.doesNotMatch(value, /&(?:amp|#0*38|#x0*26);/i, file);
  }
});
test("WXML expressions use native operators, not HTML entities", () => {
  for (const page of ["community", "community-graph", "community-program", "community-points"]) {
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
  return { exp: exp.exports, storage };
}
test("isolated data cannot activate in release/trial or an unenabled source tree", () => {
  for (const [enabled, env] of [[false, "develop"], [true, "release"], [true, "trial"]]) {
    const { exp, storage } = fixture(enabled, env);
    assert.equal(exp.readExperience(), null);
    assert.equal(Object.keys(storage).length, 0);
  }
  assert.equal(require("../miniprogram/utils/experience-config.js").enabled, false);
  assert.deepEqual(require("../miniprogram/utils/sharing-preview.js"), {});
});
test("points never substitute demo balance or identity for a real zero balance", async () => {
  let page;
  vm.runInNewContext(fs.readFileSync("miniprogram/pages/community-points/index.js", "utf8"), {
    setTimeout, clearTimeout,
    Page: (value) => { page = value; },
    require: (id) => id.includes("community-loading") ? require("../miniprogram/utils/community-loading.js") : id.includes("payment") ? { communityRequest: async () => { throw new Error("Unavailable"); } } : id.includes("community-data") ? data : id.includes("member.js") ? { getCommunity: () => ({ points: 0, name: "测试账户" }) } : id.includes("access") ? { requireCommunityMember: () => true } : { readExperience: () => null },
  });
  page.setData = (value) => Object.assign(page.data, value); await page.onLoad({});
  assert.equal(page.data.myPoints, 0); assert.equal(page.data.myName, "测试账户");
  assert.equal(page.data.myRank, "—"); assert.equal(page.data.leaderboard.length, 0);
});
test("legacy application route returns to community without an application form", () => {
  let page; let target;
  vm.runInNewContext(fs.readFileSync("miniprogram/pages/community-apply/index.js", "utf8"), { Page: p => { page=p; }, wx: {switchTab: v => {target=v.url;}} });
  page.onLoad();
  assert.equal(target,"/pages/community/index");
  assert.doesNotMatch(fs.readFileSync("miniprogram/pages/community-apply/index.wxml","utf8"), /input|form|申请|权限/);
});
test("edited preview profile appears in directory without writing real member storage", async () => {
  const { exp } = fixture();
  const value = exp.readExperience(); value.profile = { name: "新的体验姓名", city: "上海", role: "Founder", industry: "软件", project: "新项目" }; exp.saveExperience(value);
  let page;
  vm.runInNewContext(fs.readFileSync("miniprogram/pages/community-graph/index.js", "utf8"), {
    Page: (result) => { page = result; },
    require: (id) => id.includes("experience") ? exp : id.includes("community-data") ? data : id.includes("access") ? { requireCommunityMember: () => true } : { saveCommunityProfile() { throw new Error("must not write real profile"); } },
  });
  page.setData = (result) => Object.assign(page.data, result); await page.onLoad({}); page.onShow();
  assert.equal(page.data.filteredMembers[0].name, "新的体验姓名");
  page.loadProfile("profile"); assert.equal(page.data.profile.project, "新项目");
});
