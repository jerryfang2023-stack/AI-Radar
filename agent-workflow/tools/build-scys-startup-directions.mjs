import fs from "node:fs";
import path from "node:path";
import "../../01-SiteV2/site/assets/scys-community-model.js";
import { canonicalScysUrl } from "./lib/scys-original-links.mjs";

const normalized = value => String(value || "").normalize("NFKC").replace(/\s/gu, "");
const identity = item => JSON.stringify([normalized(item.title), normalized(item.author)]);
const original = item => canonicalScysUrl(item.originalUrl || item.url);

// Conservative title rules: conflicting or missing matches remain visible in pending.
const rules = [
  ["apps", /小程序|APP|简历.*插件|应用定制/iu],
  ["enterprise", /FDE|企业.{0,8}(?:AI|智能体)|AI.{0,8}(?:企业|咨询|实施)|美业|门店/iu],
  ["education", /培训|少儿|启蒙|教育服务/iu],
  ["knowledge-products", /虚拟资料|虚拟项目|知识产品|课件|资料.{0,6}(?:售卖|变现)|图解卡片/iu],
  ["commerce", /选品|测款|电商运营/iu],
  ["content-agents", /内容.{0,8}(?:工作|系统|自动化|Agent)|(?:工作|系统|自动化|Agent).{0,8}内容|公众号运营|自动剪辑|自动写稿/iu],
  ["video-commerce", /视频.{0,8}(?:带货|分成|变现)|(?:带货|分成).{0,8}视频|短剧/iu],
  ["video-services", /视频.{0,8}(?:定制|接单|商单)|(?:品牌|定制).{0,8}视频/iu],
  ["writing", /小说|写作工具/iu],
  ["saas", /SaaS|工具站|独立开发|出海网站/iu],
  ["marketing", /获客|拉新|广告服务|线索工具/iu],
  ["mcp-knowledge", /MCP|知识管理|知识地图|听书|转录/iu],
];

export function buildDirections(library, config, editorial = {}) {
  const model = globalThis.ScysCommunityModel;
  const known = new Map();
  for (const item of library.items) if (original(item)) {
    const key = identity(item);
    if (!known.has(key)) known.set(key, new Set());
    known.get(key).add(original(item));
  }
  const sourceKey = item => original(item) || (known.get(identity(item))?.size === 1 ? [...known.get(identity(item))][0] : identity(item));
  const groups = new Map();
  for (const item of library.items) {
    const key = sourceKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const assignments = new Map();
  for (const entry of config.assignments) {
    const key = sourceKey(entry);
    if (assignments.has(key) && assignments.get(key) !== entry.direction) throw new Error("Conflicting direction review");
    assignments.set(key, entry.direction);
  }
  const directions = config.directions.map(direction => ({ ...direction, posts: [] }));
  const pending = [];
  const selected = new Map();
  const pricingReview = [];
  let automaticPosts = 0;
  for (const [key, group] of groups) {
    const reviewed = assignments.get(key);
    if (!reviewed && !group.some(item => model.profile(item, editorial).caseMaterial)) continue;
    group.sort((a,b) => Number(model.profile(b, editorial).reviewed) - Number(model.profile(a, editorial).reviewed) || Number(!!b.bodyRef) - Number(!!a.bodyRef) || String(b.lastSeen).localeCompare(String(a.lastSeen)) || a.id.localeCompare(b.id));
    const item = group[0];
    const matches = rules.filter(([,pattern]) => pattern.test(item.title)).map(([id]) => id);
    const direction = reviewed || (matches.length === 1 ? matches[0] : "");
    const post = { itemId:item.id, title:item.title, author:item.author || "", originalUrl:original(item) || (key.startsWith("https://") ? key : ""), links:[...new Map(group.flatMap(item => item.links || []).map(link => [link.href, link])).values()] };
    const bucket = directions.find(entry => entry.id === direction);
    if (direction && !bucket) throw new Error("Unknown reviewed direction: " + direction);
    if (bucket) { bucket.posts.push(post); selected.set(key, post); if (!reviewed) automaticPosts++; }
    else pending.push(post);
    if (group.some(item => /收费|报价|定价|客单价|佣金/u.test(`${item.title} ${item.evidence || ""}`))) pricingReview.push(post.itemId);
  }
  const byId = new Map(library.items.map(item => [item.id, item]));
  const sortPosts = posts => posts.sort((a,b) => String(byId.get(b.itemId)?.lastSeen).localeCompare(String(byId.get(a.itemId)?.lastSeen)) || a.itemId.localeCompare(b.itemId));
  directions.forEach(direction => sortPosts(direction.posts));
  sortPosts(pending);
  const prices = config.prices.map(({source, ...price}) => {
    const post = selected.get(sourceKey(source));
    if (!post) throw new Error("Reviewed price source is missing from directions");
    return {itemId:post.itemId, ...price};
  });
  const reviewedPriceIds = new Set(prices.map(price => price.itemId));
  return {
    version:2,
    asOf:library.items.map(item => item.lastSeen).filter(Boolean).sort().at(-1) || "",
    basis:"随每日已验收的生财入库数据累计更新，按原帖去重，同项目不同帖子分别计数。沿用已整理方向；新增帖子按明确标题规则归类，歧义进入待分类。方向痛点为编辑归纳，收费为已核对的历史来源陈述，未经独立核验。",
    meta:{classifiedPosts:directions.reduce((n,direction) => n + direction.posts.length,0),pendingPosts:pending.length,automaticPosts,pricingReviewIds:pricingReview.filter(id => !reviewedPriceIds.has(id))},
    directions, pending, prices,
  };
}

export function updateDirections(root, library, {check = false} = {}) {
  const read = file => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  const result = buildDirections(library, read("agent-workflow/product/scys-direction-reviews.json"), read("01-SiteV2/site/data/scys-community-editorial.json"));
  const target = path.join(root, "01-SiteV2/site/data/scys-startup-directions.json");
  const body = JSON.stringify(result, null, 2) + "\n";
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target,"utf8") !== body) throw new Error("SCYS direction statistics are stale; run build:scys-library");
  } else fs.writeFileSync(target, body);
  return result.meta;
}
