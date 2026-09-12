import test from "node:test";
import assert from "node:assert/strict";
import { extractDocumentLinks, mergeDocumentLinks, retainDocumentLinks, documentRetentionProblems, buildDocumentIndex } from "../../../01-SiteV2/site/scripts/community-document-links.mjs";
import { collectScysMcp, scysDetailCard, relatedScysResources, resourceKeyword } from "../../../01-SiteV2/site/scripts/collect-scys-mcp.mjs";
import { retryAfterSeconds } from "../lib/scys-mcp-client.mjs";
import { normalizeCard, mergeItems } from "../../../01-SiteV2/site/scripts/collect-community-intelligence.mjs";

const href = "https://my.feishu.cn/wiki/AbCdEf0123456789?from=from_copylink";
const url = "https://scys.com/articleDetail/xq_topic/12345678901234567";
const original = `实操复盘，飞书好读版 <e type="web" href="${encodeURIComponent(href)}" title="${encodeURIComponent('https://my.feishu.cn/wiki/AbCd...')}" />`;
const detail = { detailUrl: url, topicDTO: { showTitle: "Codex 项目交付复盘与资料", articleContent: original, articleContentContainFeishuDoc: `完整正文\n${href}\u200b\u200b文档标题`, gmtCreate: 1789200000 }, topicUserDTO: { name: "测试作者" } };

test("server retry hints are honored from metadata and escaped text, without guessing quotas", () => {
  assert.equal(retryAfterSeconds({ result: { _meta: { rateLimit: { retryAfterSeconds: 17 } } } }), 17);
  assert.equal(retryAfterSeconds({ content: [{ text: '{"retryAfterSeconds":42}' }] }), 42);
  assert.equal(retryAfterSeconds({ content: [{ text: "MCP_RATE_LIMITED" }] }), undefined);
});
test("resource query uses the post topic instead of unrelated rotated search metadata", () => {
  assert.equal(resourceKeyword({ title: "YouTube 长视频实战", original: "视频复盘" }, { keyword: "RPA" }), "YouTube");
  assert.equal(resourceKeyword({ title: "实战", original: "视频复盘" }, { keyword: "RPA" }), "");
});

test("encoded SCYS href survives while truncated display URL is ignored", () => {
  const links = extractDocumentLinks(original);
  assert.equal(links.length, 1);
  assert.equal(links[0].href, href);
});
test("zero-width separator stops merged text URL before the title", () => {
  assert.equal(extractDocumentLinks(detail.topicDTO.articleContentContainFeishuDoc)[0].href, href);
});
test("HTML entities decode and spoofed document domains are rejected", () => {
  assert.equal(extractDocumentLinks('<a href="https://my.feishu.cn/docx/AbCd?a=1&amp;b=2">资料</a>')[0].href, "https://my.feishu.cn/docx/AbCd?a=1&b=2");
  assert.deepEqual(extractDocumentLinks("https://feishu.cn.evil.test/wiki/AbCd https://evil.test/feishu.cn"), []);
});
test("old shortened text duplicate is removed only with its explicit display-text evidence", () => {
  const short = "https://my.feishu.cn/wiki/AbCdEf";
  assert.equal(mergeDocumentLinks([{ href: short }]).length, 1);
  const merged = mergeDocumentLinks([{ href: short }, { href, text: short + "..." }]);
  assert.equal(merged.length, 1);
  assert.equal(merged[0].href, href);
  assert.equal(mergeDocumentLinks([{ href: short, text: "另一份资料" }, { href, text: "实操资料" }]).length, 2);
});
test("tracking variants dedupe without stripping the original resource URL", () => {
  const links = mergeDocumentLinks([{ href }, { href: href.split('?')[0] }]);
  assert.equal(links.length, 1);
  assert.equal(links[0].href, href);
});
test("independent index merges cross-post tracking variants and preserves every source post", () => {
  const links = buildDocumentIndex([
    { id: "a", url, links: [{ href }] },
    { id: "b", url: url + "0", links: [{ href: href.split('?')[0] }] },
  ]);
  assert.equal(links.length, 1);
  assert.equal(links[0].owners.length, 2);
  assert.equal(links[0].href, href);
});
test("prior document survives empty MCP links and changed title or tracking URL", () => {
  const old = [{ source: "scys", url, title: "原题", links: [{ href }] }];
  const fresh = [{ id: "a", source: "scys", url: url + "?from=search", title: "新题", links: [] }];
  assert.equal(documentRetentionProblems(fresh, old).length, 1);
  assert.equal(retainDocumentLinks(fresh, old)[0].links[0].href, href);
  assert.deepEqual(documentRetentionProblems(retainDocumentLinks(fresh, old), old), []);
});
test("detail parsing distinguishes unavailable merged content from a missing post", () => {
  const card = scysDetailCard({ ...detail, topicDTO: { ...detail.topicDTO, articleContentContainFeishuDoc: null } });
  assert.ok(card.detailText);
  assert.equal(card.detailLinks[0].href, href);
  assert.equal(card.merged, "");
});
test("discovery pages are deduplicated before details and originals stay private", async () => {
  const calls = [];
  const call = async (name) => {
    calls.push(name);
    if (name === "searchTopic") return { total: 2, items: [1, 2].map(() => ({ topicDTO: { entityId: "12345678901234567", entityType: "xq_topic" } })) };
    if (name === "topicDetail") return detail;
    return { items: [] };
  };
  const result = await collectScysMcp({ call, normalizeCard, jobs: [{ mode: "search", keyword: "Codex" }] });
  assert.equal(calls.filter((name) => name === "topicDetail").length, 1);
  assert.equal(result.items[0].links[0].href, href);
  assert.match(result.items[0].bodyRef, /^evidence:\/\/[a-f0-9]{64}$/);
  assert.equal(result.originals.length, 1);
  assert.ok(!JSON.stringify(result.items).includes('articleContentContainFeishuDoc'));
  assert.ok(result.originals[0].body.includes('articleContentContainFeishuDoc'));
});
test("missing document invokes browser fallback and retains previous links", async () => {
  let fallback = 0;
  const old = { source: "scys", url, title: "原题", links: [{ href }] };
  const result = await collectScysMcp({
    call: async () => ({ ...detail, topicDTO: { showTitle: "实操", articleContent: "附飞书资料", gmtCreate: 1789200000 } }),
    normalizeCard, jobs: [], previous: [old], upgradeOnly: true,
    browserDetail: async () => { fallback++; throw new Error("unavailable"); },
  });
  assert.equal(fallback, 1);
  assert.equal(result.items[0].links[0].href, href);
  assert.equal(result.warnings.length, 1);
});
test("unresolved promised document blocks candidate instead of publishing linkless data", async () => {
  await assert.rejects(() => collectScysMcp({
    call: async () => ({ ...detail, topicDTO: { articleContent: "全文在飞书文档" } }),
    normalizeCard, jobs: [], previous: [{ source: "scys", url }], upgradeOnly: true,
  }), /SCYS_DOCUMENT_LINK_UNRESOLVED/);
});
test("mentioning Feishu as a workflow tool does not imply an omitted document URL", async () => {
  const result = await collectScysMcp({
    call: async (name) => name === "topicDetail" ? { ...detail, topicDTO: { showTitle: "运营复盘", articleContent: "配合飞书和 Codex 整理日报，做了二十个群。" } } : { items: [] },
    normalizeCard, jobs: [], previous: [{ source: "scys", url }], upgradeOnly: true,
  });
  assert.equal(result.items.length, 1);
});
test("related manuals use activity IDs from discovery and retain readable section IDs", async () => {
  const calls = [];
  const resources = await relatedScysResources(async (tool, args) => {
    calls.push({ tool, args });
    if (tool === "activitySearch") return { items: [{ id: "42", name: "Codex 航海" }] };
    if (tool === "activityManualToc") return { courseTitle: "Codex 手册", items: [{ itemId: "101", title: "目录", hasContent: false }, { itemId: "102", title: "实操", hasContent: true }] };
    return { items: [] };
  }, "Codex");
  assert.equal(calls.at(-1).args.activityId, "42");
  assert.deepEqual(resources[0].entries, [{ itemId: "102", title: "实操" }]);
  assert.equal(resources[0].association, "keyword_match");
});
test("merge preserves resource associations and MCP evidence locator", () => {
  const base = normalizeCard("scys", scysDetailCard(detail), { keyword: "Codex" });
  const result = mergeItems([base, { ...base, acquisition: "scys-mcp", bodyRef: "evidence://abc", relatedResources: [{ kind: "tool", id: "3" }] }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].bodyRef, "evidence://abc");
  assert.equal(result[0].relatedResources.length, 1);
});
