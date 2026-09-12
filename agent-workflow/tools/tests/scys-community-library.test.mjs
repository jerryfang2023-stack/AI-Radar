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
  assert.deepEqual(model.weekRange("2026-09-12"), { start: "2026-09-07", end: "2026-09-13" });
  assert.equal(model.weekly([post], editorial, "2026-09-12").length, 2);
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

test("calendar weeks include Sunday and cross year boundaries", () => {
  assert.deepEqual(model.weekRange("2027-01-01"), { start: "2026-12-28", end: "2027-01-03" });
  assert.deepEqual(model.weekRange("2026-09-13"), model.weekRange("2026-09-07"));
  assert.equal(model.weekRange("2026-09-14").start, "2026-09-14");
});

test("MCP exact-match repair preserves archive identity, dates and complete resource links", () => {
  const missing = { ...post, author: '作者甲', url: 'https://scys.com/' };
  const data = buildLibrary([{date:'2026-09-11',payload:{items:[missing]}}], [{id:post.id,title:post.title,author:'作者甲',url:post.url,basis:'mcp-exact-title-author'}]);
  assert.equal(data.items[0].id, post.id);
  assert.equal(data.items[0].url, missing.url);
  assert.equal(data.items[0].originalUrl, post.url);
  assert.equal(data.items[0].firstSeen, '2026-09-11');
  assert.equal(data.items[0].lastSeen, '2026-09-11');
  assert.equal(data.items[0].bodyRef, post.bodyRef);
  assert.equal(data.resources[0].href, link.href);
  assert.equal(data.resources[0].owners[0].itemUrl, post.url);
  assert.deepEqual(data.missingOriginalLinkIds, []);
});

test("later homepage records recover a known address only for an unambiguous title and author", () => {
  const known = {...post, author:'甲'};
  const missing = {...post,id:'b',author:'甲',url:'https://scys.com/',links:[]};
  const other = {...missing,id:'c',author:'乙',title:'不同作者的帖子'};
  const data=buildLibrary([{date:'2026-09-11',payload:{items:[known]}},{date:'2026-09-12',payload:{items:[missing,other]}}]);
  assert.equal(data.items.find(x=>x.id==='b').originalUrl, post.url);
  assert.deepEqual(data.missingOriginalLinkIds, ['c']);
  assert.equal(data.resources[0].href, link.href);
});

test("link repair rejects mismatched authors, unsafe addresses and ambiguous archived titles", async () => {
  const {resolveScysOriginalLinks}=await import('../lib/scys-original-links.mjs');
  const missing={...post,author:'甲',url:'https://scys.com/'};
  const resolution={id:post.id,title:post.title,author:'乙',url:post.url,basis:'mcp-exact-title-author'};
  assert.throws(()=>resolveScysOriginalLinks([missing],[resolution]), /identity mismatch/);
  assert.throws(()=>resolveScysOriginalLinks([missing],[{...resolution,author:'甲',url:'https://scys.com.evil.test/articleDetail/xq_topic/123'}]), /Invalid/);
  const result=resolveScysOriginalLinks([missing,{...post,id:'b',author:'甲'},{...post,id:'c',author:'甲',url:post.url+'4'}]);
  assert.equal(result.items[0].originalUrl,undefined);
  assert.deepEqual(result.unresolved,['a']);
});

test("verified links survive a changed collection ID without overriding an existing original", async () => {
  const {resolveScysOriginalLinks}=await import('../lib/scys-original-links.mjs');
  const entry={id:'old-id',title:post.title,author:'甲',url:post.url,basis:'mcp-exact-title-author'};
  const missing={...post,id:'new-id',author:'甲',url:'https://scys.com/'};
  const other={...missing,id:'other-author',author:'乙'};
  const existing={...missing,id:'existing',url:post.url+'4'};
  const repaired=resolveScysOriginalLinks([missing,other],[entry]);
  assert.equal(repaired.items[0].originalUrl,post.url);
  assert.deepEqual(repaired.unresolved,['other-author']);
  assert.equal(resolveScysOriginalLinks([existing],[entry]).items[0].url,existing.url);
});
