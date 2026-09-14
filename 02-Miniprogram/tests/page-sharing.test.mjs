import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import fs from "node:fs";

const require = createRequire(import.meta.url);
const sharing = require("../miniprogram/utils/page-sharing.js");

test("the global sharing wrapper covers every registered Mini Program page", () => {
  const appConfig = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
  const appSource = fs.readFileSync("miniprogram/app.js", "utf8");
  assert.match(appSource, /pageSharing\.installPageSharing\(\)/u);
  assert.equal(appConfig.pages.length, 25);
  for (const page of appConfig.pages) {
    assert.match(fs.readFileSync(`miniprogram/${page}.js`, "utf8"), /\bPage\s*\(/u, page);
  }
});

test("builds deep links for every community child page without leaking unknown options", () => {
  const cases = [
    ["pages/community-program/index", { type: "archive", id: "issue-14", token: "secret" }, "/pages/community-program/index?type=archive&id=issue-14"],
    ["pages/community-points/index", { mode: "rules" }, "/pages/community-points/index?mode=rules"],
    ["pages/community-points/index", { season: "season-2", memberId: 99 }, "/pages/community-points/index?season=season-2"],
    ["pages/community-token/index", { token: "secret" }, "/pages/community-token/index"],
    ["pages/community-graph/index", { mode: "member", id: 42 }, "/pages/community-graph/index?mode=member&id=42"],
  ];
  for (const [route, options, path] of cases) {
    const payload = sharing.sharePayload({ route, __shareOptions: options });
    assert.equal(payload.path, path);
    assert.doesNotMatch(payload.path, /secret/u);
  }
});

test("shares private and settings pages through the public front door", () => {
  const payload = sharing.sharePayload({ route: "pages/profile-edit/index", __shareOptions: { code: "private" } });
  assert.equal(payload.path, "/pages/terminal/index");
  assert.equal(payload.query, "");
});

test("injects native forwarding and timeline callbacks into every Page registration", () => {
  const registered = [];
  const shareMenus = [];
  const originalPage = globalThis.Page;
  const originalWx = globalThis.wx;
  const originalInstalled = globalThis.__guanlanPageSharingInstalled;
  try {
    globalThis.Page = (config) => registered.push(config);
    globalThis.wx = { showShareMenu: (options) => shareMenus.push(options) };
    delete globalThis.__guanlanPageSharingInstalled;
    sharing.installPageSharing();
    globalThis.Page({ onLoad(options) { this.loaded = options; } });
    assert.equal(registered.length, 1);
    const page = { route: "pages/community-points/index" };
    registered[0].onLoad.call(page, { mode: "rules" });
    assert.deepEqual(page.loaded, { mode: "rules" });
    assert.deepEqual(shareMenus[0].menus, ["shareAppMessage", "shareTimeline"]);
    assert.equal(registered[0].onShareAppMessage.call(page).path, "/pages/community-points/index?mode=rules");
    assert.equal(registered[0].onShareTimeline.call(page).query, "mode=rules");
  } finally {
    globalThis.Page = originalPage;
    globalThis.wx = originalWx;
    if (originalInstalled === undefined) delete globalThis.__guanlanPageSharingInstalled;
    else globalThis.__guanlanPageSharingInstalled = originalInstalled;
  }
});


test("retired bounty cannot be opened or shared from the uploaded package", () => {
  const config = JSON.parse(fs.readFileSync("miniprogram/app.json", "utf8"));
  assert.ok(!config.pages.some(page => page.includes("bounty")));
  assert.equal(fs.existsSync("miniprogram/pages/community-bounty"), false);
  assert.equal(sharing.sharePayload({ route: "pages/community-bounty/index", __shareOptions: { id: "old" } }).path, "/pages/terminal/index");
  for (const file of fs.readdirSync("miniprogram", { recursive: true }).filter(file => /\.(js|wxml|json)$/.test(file))) {
    assert.doesNotMatch(fs.readFileSync(`miniprogram/${file}`, "utf8"), /发起一个悬赏令|参与悬赏令|community-bounty/, file);
  }
});
