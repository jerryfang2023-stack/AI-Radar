import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildLibrary } from "../build-scys-community-library.mjs";
const model = globalThis.ScysCommunityModel;
const link = { href: "https://my.feishu.cn/wiki/CompleteAddress?from=from_copylink", text: "交付流程" };
const post = { id: "a", source: "scys", url: "https://scys.com/articleDetail/xq_topic/123", title: "AI 交付复盘", bodyRef: "evidence://test", links: [link] };

test("historical SCYS library preserves resources when a later snapshot returns no links", () => {
  const data = buildLibrary([
    { date: "2026-09-11", payload: { items: [post] } },
    { date: "2026-09-12", payload: { items: [{ ...post, id: "b", links: [], bodyRef: undefined }, { id: "other", source: "aipoju", links: [link] }] } },
  ]);
  assert.equal(data.items.length, 1);
  assert.equal(data.resources[0].href, link.href);
  assert.equal(data.resources[0].owners[0].itemId, "b");
  assert.equal(data.items[0].bodyRef, post.bodyRef);
  assert.equal(data.items[0].firstSeen, "2026-09-11");
});

test("generic homepage links do not collapse different posts and shared resources retain both owners", () => {
  const data = buildLibrary([{ date: "2026-09-12", payload: { items: [
    { ...post, url: "https://scys.com/", title: "AI 案例甲" },
    { ...post, id: "b", url: "https://scys.com/", title: "AI 案例乙" },
  ] } }]);
  assert.equal(data.items.length, 2);
  assert.equal(data.resources.length, 1);
  assert.equal(data.resources[0].owners.length, 2);
});

test("library is body-free and does not manufacture case fields", () => {
  const data = buildLibrary([{ date: "2026-09-12", payload: { items: [{ ...post, articleContent: "private original", access_token: "private" }] } }]);
  assert.equal(data.items[0].articleContent, undefined);
  assert.equal(data.items[0].access_token, undefined);
  assert.deepEqual(model.profile(post, {}).fields, {});
  assert.equal(model.profile({ title: "教师节送花", evidence: "谢谢老师" }, {}).caseMaterial, false);
});

test("weekly selection uses natural weeks and rejects stale source reviews", () => {
  const editorial = { reviews: { [model.key(post)]: { bodyRef: post.bodyRef } }, weekly: [
    { itemKey: model.key(post), selectedAt: "2026-09-06" },
    { itemKey: model.key(post), selectedAt: "2026-09-12" },
    { itemKey: model.key(post), selectedAt: "2026-09-13" },
  ] };
  assert.deepEqual(model.weekRange("2026-09-12"), { start: "2026-09-07", end: "2026-09-12" });
  assert.equal(model.weekly([post], editorial, "2026-09-12").length, 1);
  assert.equal(model.weekly([{ ...post, bodyRef: "new source" }], editorial, "2026-09-12").length, 0);
});

test("published selections resolve to existing source records with current evidence locators", () => {
  const library = JSON.parse(fs.readFileSync("01-SiteV2/site/data/scys-community-library.json", "utf8"));
  const editorial = JSON.parse(fs.readFileSync("01-SiteV2/site/data/scys-community-editorial.json", "utf8"));
  assert.equal(model.weekly(library.items, editorial, "2026-09-12").length, 3);
  for (const [key, entry] of Object.entries(editorial.reviews)) {
    const item = library.items.find((item) => model.key(item) === key);
    assert.ok(item);
    assert.equal(item.bodyRef, entry.bodyRef);
  }
  assert.ok(library.resources.every((r) => r.owners.every((owner) => library.items.some((item) => item.id === owner.itemId))));
});
