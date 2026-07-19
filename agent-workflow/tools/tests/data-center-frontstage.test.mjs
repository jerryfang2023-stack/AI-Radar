import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { buildFrontstageData as buildFreshFrontstageData, isCompletePublicEventTitle, sourceDateOnly } from "../../../01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "../../..");
let cachedFrontstageData;
const buildFrontstageData = (targetRoot) => cachedFrontstageData ??= buildFreshFrontstageData(targetRoot);

test("business-signal publishing persists the split V4 frontstage service", () => {
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/daily-persistent-assets-pr.yml"), "utf8");

  assert.match(workflow, /01-SiteV2\/site\/data\/data-center-v4\/\*\*/u);
  assert.match(workflow, /stage_if_exists "01-SiteV2\/site\/data\/data-center-v4"/u);
});

test("checked-in split frontstage data matches the monolithic adapter date", () => {
  const full = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/manifest.json"), "utf8"));
  const eventIndex = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/events.json"), "utf8"));

  assert.equal(manifest.currentDate, full.meta.currentDate);
  assert.equal(eventIndex.meta.currentDate, full.meta.currentDate);
  assert.equal(eventIndex.meta.eventCount, full.meta.eventCount);
});

test("frontstage adapter builds real V4 data collections", () => {
  const data = buildFrontstageData(root);

  assert.match(data.meta.currentDate, /^\d{4}-\d{2}-\d{2}$/u);
  assert.ok(data.events.length > 0);
  assert.ok(data.companies.length > 0);
  assert.ok(data.products.length > 0);
  assert.ok(data.community.length > 0);
  assert.ok(data.viewpoints.length > 0);
  assert.ok(data.events.every((event) => event.id && event.title && event.date));
  assert.ok(data.events.every((event) => /[\u3400-\u9fff]/u.test(event.title)));
  assert.ok(data.events.every((event) => Array.isArray(event.tags) && Array.isArray(event.sources)));
});

test("person index contains reviewed natural people while preserving all viewpoint records", () => {
  const data = buildFrontstageData(root);
  const source = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json"), "utf8"));
  const peopleByName = new Map(data.people.map((person) => [person.name, person]));
  const forbiddenAccounts = ["Ben's Bites AI Newsletter", "Claude", "Dataiku Blog", "Google Labs", "Tigera Blog (Calico / AI Security)", "TLDR AI Newsletter"];

  assert.equal(data.people.length, 31);
  assert.equal(data.viewpoints.length, source.remarks.length);
  assert.ok(forbiddenAccounts.every((name) => !peopleByName.has(name)));
  assert.ok(peopleByName.get("Jack Clark")?.aliases.includes("Import AI (Jack Clark)"));
  assert.ok(peopleByName.get("Nathan Lambert")?.aliases.includes("Interconnects (Nathan Lambert)"));
  assert.ok(peopleByName.get("Lilian Weng")?.aliases.includes("Lilian Weng's Blog (OpenAI)"));
  assert.ok(peopleByName.get("Simon Willison")?.aliases.includes("Simon Willison's Blog"));
  assert.ok(data.viewpoints.some((item) => item.person === "Claude" && !item.personEntityId));
  assert.ok(data.viewpoints.some((item) => item.person === "Import AI (Jack Clark)" && item.personEntityId === peopleByName.get("Jack Clark")?.id));
});

test("current commercial event titles are complete and evidence-specific", () => {
  const data = buildFrontstageData(root);
  const currentEvents = data.events.filter((event) => event.dataDate === data.meta.currentDate);

  assert.ok(currentEvents.every((event) => isCompletePublicEventTitle(event.title)));
  assert.equal(currentEvents.some((event) => /模型券即时补贴平台/u.test(event.title)), false);
});

test("default event date follows the latest accepted data batch", () => {
  const data = buildFrontstageData(root);
  const defaultEvents = data.events.filter((event) => event.dataDate === data.meta.currentDate);
  const legacyDesk = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/v3-data-observation-desk.json"), "utf8"));
  const legacyCurrentCards = legacyDesk.cards.filter((card) => card.date === data.meta.currentDate && card.category !== "opinion");

  assert.ok(defaultEvents.length > 0);
  assert.ok(defaultEvents.every((event) => event.dataDate === data.meta.currentDate));
  assert.ok(defaultEvents.length >= legacyCurrentCards.length);
  assert.equal(data.meta.currentDate, data.events.map((event) => event.dataDate).filter(Boolean).sort().at(-1));
});

test("source timestamps are displayed by Shanghai calendar date", () => {
  assert.equal(sourceDateOnly("2026-07-15T22:56:47.000Z"), "2026-07-16");
  assert.equal(sourceDateOnly("2026-07-15"), "2026-07-15");
});

test("frontstage event grouping follows the confirmed PRD", () => {
  const data = buildFrontstageData(root);
  const partnership = data.events.find((event) => event.eventType === "partnership");
  const acquisition = data.eventTypes.acquisition;

  if (partnership) assert.equal(partnership.eventGroup, "商业合作");
  assert.equal(acquisition.group, "融资与并购");
  assert.equal(data.eventTypes.procurement_contract.group, "商业合作");
});

test("company projection contains normalized organizations only", () => {
  const data = buildFrontstageData(root);
  const names = data.companies.map((item) => item.name);

  assert.ok(names.includes("OpenAI"));
  assert.ok(names.includes("Meta"));
  assert.ok(names.includes("NVIDIA"));
  assert.ok(names.every((name) => !/员工|研究员|CEO|发布|推出|上线|融资|起诉|诉讼|大模型|\d{4}/u.test(name)));
  assert.equal(new Set(names.map((name) => name.toLocaleLowerCase())).size, names.length);
});

test("product projection contains named products with bounded ownership", () => {
  const data = buildFrontstageData(root);
  const adapter = fs.readFileSync(path.join(root, "01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs"), "utf8");
  const names = data.products.map((item) => item.name);
  const inkling = data.products.find((item) => item.name === "Inkling");
  const jetsonThor = data.products.find((item) => item.name === "Jetson Thor");
  const msNat5000 = data.products.find((item) => item.name === "MS-NAT5000");

  assert.ok(names.includes("1Password for Claude"));
  assert.ok(names.includes("PerceptionBench"));
  assert.ok(names.includes("GenFlow"));
  assert.ok(names.includes("Jetson Thor"));
  assert.ok(names.includes("Kimi K3"));
  assert.ok(names.includes("LM Studio Bionic"));
  assert.deepEqual(inkling?.companyNames, ["Thinking Machines Lab"]);
  assert.deepEqual(jetsonThor?.companyNames, ["NVIDIA"], "a direct product launch proves bounded ownership");
  assert.deepEqual(msNat5000?.companyNames, ["映泰"], "the system launch proves its publisher without assigning the component supplier");
  assert.equal(names.includes("Codex Micro"), false);
  assert.doesNotMatch(adapter, /namedProductRules|extractNamedProducts/u);
  assert.ok(names.every((name) => !/^(?:的|会|训练|多款|可|全球首个|人工智能标准|推理优化|record|with |Apollo|Development|notes|YC:)/iu.test(name)));
  assert.equal(new Set(names.map((name) => name.toLocaleLowerCase())).size, names.length);
});

test("hardware projection exposes its real source artifact", () => {
  const data = buildFrontstageData(root);
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const projectedEventIds = new Set(data.hardware.map((item) => item.eventId));
  const hardwareEvents = data.events.filter((item) => item.eventGroup === "AI 硬件");

  assert.ok(data.hardware.some((item) => /Jetson Thor/iu.test(item.title)));
  assert.ok(data.hardware.every((item) => data.events.some((event) => event.id === item.eventId)));
  assert.ok(hardwareEvents.some((item) => projectedEventIds.has(item.id)));
  assert.ok(data.hardware.every((item) => item.sourceName && item.sourceUrl));
  assert.ok(data.hardware.every((item) => !/\b(?:search|anysearch|gdelt)\b|关键词搜索/iu.test(item.sourceName)));
  assert.ok(data.hardware.every((item) => /^https?:\/\//u.test(item.sourceUrl)));
  assert.match(script, /sub: `来源：\$\{item\.sourceName/u);
  assert.match(script, /item\.sourceName \|\| "打开原始来源"/u);
});

test("frontstage output excludes judgment and recommendation fields", () => {
  const data = buildFrontstageData(root);
  const text = JSON.stringify(data);
  const forbidden = [
    "business_meaning",
    "why_watch",
    "why_selected",
    "importance_score",
    "opportunity_score",
    "recommendation"
  ];

  for (const key of forbidden) assert.equal(text.includes(`"${key}"`), false, `${key} must not enter frontstage data`);
});

test("data center page uses the official logo and sidebar navigation", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/data-center.html"), "utf8");
  const viewpointPosition = html.indexOf('data-view-link="viewpoints"');
  const indexPosition = html.indexOf('data-view-link="index"');

  assert.match(html, /logo-wavesight-reference-horizontal\.svg/u);
  assert.match(html, /data-view-link="events"/u);
  assert.match(html, /data-view-link="events">商业事件/u);
  assert.match(html, /data-center\.html\?view=index" data-view-link="index">实体索引/u);
  assert.ok(indexPosition > viewpointPosition);
  assert.match(html, />数据中心</u);
  assert.match(html, />应用中心</u);
  assert.match(html, /href="intelligence-map\.html">行业报告</u);
  assert.match(html, /href="opportunity-map\.html">机会地图</u);
  assert.doesNotMatch(html, />报告中心<\/a>/u);
  assert.doesNotMatch(html, /data-center\.html\?view=companies/u);
  assert.doesNotMatch(html, /data-center\.html\?view=products/u);
  assert.doesNotMatch(html, />周报<\/a>/u);
  assert.doesNotMatch(html, />月报<\/a>/u);
  assert.doesNotMatch(html, /全局搜索/u);
});

test("community intelligence keeps the V3.4.5 content and link workflow in the V4 shell", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/data-center.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.css"), "utf8");
  const dailyIndex = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/community-intelligence-daily/index.json"), "utf8"));
  const latestEntry = dailyIndex.dates.find((item) => item.date === dailyIndex.meta.latestDate);
  const latest = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/community-intelligence-daily", latestEntry.href), "utf8"));

  assert.match(html, /data-community-dialog/u);
  assert.match(html, /data-community-dialog-content/u);
  assert.match(script, /data\/community-intelligence-daily\/index\.json/u);
  assert.match(script, /all: \{ label: "全部", rail: "场景索引"/u);
  assert.match(script, /activeView: "all"/u);
  assert.match(script, /targetView === "all"/u);
  assert.match(script, /industry_case/u);
  assert.match(script, /tool_tip/u);
  assert.match(script, /opportunity/u);
  assert.match(script, /links/u);
  assert.match(script, /data-community-scene/u);
  assert.match(script, /data-community-page/u);
  assert.match(script, /data-community-open/u);
  assert.match(script, /communityCanonicalItemUrl/u);
  assert.match(script, /communityLinks/u);
  assert.match(css, /\.dc-community-dialog/u);
  assert.match(css, /\.dc-community-rail/u);
  assert.match(css, /\.dc-community-card/u);
  assert.ok(latest.items.length >= 12);
  assert.equal(latest.items.length, latestEntry.items);
  assert.ok(latest.items.some((item) => item.links?.some((link) => /feishu\.cn/u.test(link.href || ""))));
});

test("first-line viewpoints uses both monitoring lanes and the three-level V4 page structure", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/data-center.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const projection = fs.readFileSync(path.join(root, "01-SiteV2/site/scripts/build-first-line-viewpoints-v4-data.mjs"), "utf8");
  const data = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json"), "utf8"));

  assert.match(html, /data-viewpoint-dialog/u);
  assert.match(script, /data\/first-line-viewpoints-v4\.json/u);
  assert.match(script, /观点流/u);
  assert.match(script, /人物索引/u);
  assert.match(script, /人物时间线/u);
  assert.match(script, /data-viewpoint-open/u);
  assert.match(projection, /morning-rss/u);
  assert.match(projection, /afternoon-skill/u);
  assert.match(projection, /first-line-viewpoints-history\.json/u);
  assert.match(projection, /coveredByMorning/u);
  assert.equal(data.meta.lanes.morning.id, "morning-rss");
  assert.equal(data.meta.lanes.afternoon.id, "afternoon-skill");
  assert.equal(data.meta.lanes.afternoon.declaredCount, data.intake.length);
  assert.ok(data.remarks.every((item) => item.laneCoverage.includes("morning-rss")));
  assert.ok(data.remarks.every((item) => item.aiRelevant === true));
  assert.ok(data.remarks.some((item) => item.historical === true));
  assert.ok(data.stats.historicalPublished > 0);
  assert.ok(data.meta.earliestDate < data.meta.latestDate);
  assert.ok(data.morningIntake.some((item) => item.publicationStatus === "intake_only_non_ai"));
  assert.ok(data.intake.every((item) => item.laneCoverage.includes("afternoon-skill")));
});

test("industry reports uses the V4 sidebar and contains reports only", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/intelligence-map.html"), "utf8");
  const viewpointPosition = html.indexOf("data-center.html?view=viewpoints");
  const indexPosition = html.indexOf("data-center.html?view=index");
  const weeklyFeaturePosition = html.indexOf('class="report-feature-card is-weekly"');
  const monthlyFeaturePosition = html.indexOf('class="report-feature-card is-monthly"');
  const weeklyArchivePosition = html.indexOf('aria-labelledby="weekly-archive-title"');
  const monthlyArchivePosition = html.indexOf('aria-labelledby="monthly-archive-title"');

  assert.match(html, /http-equiv="Cache-Control" content="no-store, no-cache, must-revalidate"/u);
  assert.match(html, /assets\/data-center-v4\.css/u);
  assert.match(html, /class="dc-sidebar"/u);
  assert.match(html, /data-center\.html\?view=events">商业事件/u);
  assert.ok(indexPosition > viewpointPosition);
  assert.doesNotMatch(html, /data-center\.html\?view=companies/u);
  assert.doesNotMatch(html, /data-center\.html\?view=products/u);
  assert.match(html, /<title>行业报告｜观澜 AI<\/title>/u);
  assert.match(html, /href="intelligence-map\.html" aria-current="page">行业报告</u);
  assert.match(html, /href="opportunity-map\.html">机会地图/u);
  assert.match(html, /class="report-feature-grid"/u);
  assert.ok(weeklyFeaturePosition >= 0 && weeklyFeaturePosition < monthlyFeaturePosition);
  assert.match(html, /REPORTS-V1\.0\.0-periodic-report-center/u);
  assert.match(html, /class="report-archive-grid"/u);
  assert.ok(weeklyArchivePosition >= 0 && weeklyArchivePosition < monthlyArchivePosition);
  assert.match(html, /最新月报/u);
  assert.match(html, /最新周报/u);
  assert.doesNotMatch(html, /data-map-panel|data-cell-modal|industry-reports-frontstage\.json/u);
  assert.doesNotMatch(html, /Reports Center/iu);
  assert.doesNotMatch(html, /关联路径/u);
  assert.doesNotMatch(html, /data-network-list/u);
  assert.doesNotMatch(html, /relationSpecs|buildRelations|renderNetwork/u);
  assert.doesNotMatch(html, /class="wavesight-topbar"/u);
  assert.doesNotMatch(html, /class="wavesight-nav"/u);
});

test("opportunity map is an independent application-center column", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/opportunity-map.html"), "utf8");

  assert.match(html, /<title>机会地图｜观澜 AI<\/title>/u);
  assert.match(html, /href="intelligence-map\.html">行业报告/u);
  assert.match(html, /href="opportunity-map\.html" aria-current="page">机会地图/u);
  assert.match(html, /id="entry-map"/u);
  assert.match(html, /OMAP-V1\.0\.0-independent-column/u);
  assert.match(html, /id="pain-map"/u);
  assert.match(html, /data-map-panel="entry"/u);
  assert.match(html, /data-map-panel="pain"/u);
  assert.match(html, /data-cell-modal/u);
  assert.match(html, /data\/industry-reports-frontstage\.json/u);
  assert.doesNotMatch(html, /最新月报|最新周报|report-feature-grid/u);
});

test("event toolbar is wired to real query controls", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.css"), "utf8");

  assert.match(script, /events: \{ title: "商业事件", description: "AI 行业商业事件数据库"/u);
  assert.match(script, /全部商业事件类型/u);
  assert.doesNotMatch(script, /dc-chevron/u);
  assert.doesNotMatch(css, /\.dc-chevron/u);
  assert.match(css, /\.dc-list-row:hover \.dc-row-title/u);
  assert.match(script, /new FormData\(form\)/u);
  assert.match(script, /data-auto-submit/u);
  assert.match(script, /name="from"/u);
  assert.match(script, /name="to"/u);
  assert.match(script, /应用筛选/u);
  assert.match(script, /terms\.every/u);
  assert.match(script, /item\.dataDate === data\.meta\.currentDate/u);
});

test("commercial events expose TAG-V4 technical tags and structured facets separately", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const adapter = fs.readFileSync(path.join(root, "01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs"), "utf8");
  const data = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4-frontstage.json"), "utf8"));

  assert.match(adapter, /tag-taxonomy-v4\.json/u);
  assert.match(adapter, /facet_assertions\.jsonl/u);
  assert.doesNotMatch(adapter, /frontstageTitleFallbacks|fallbackChineseEventTitle|fallbackEventTitle/u);
  assert.match(script, /技术 \/ 场景 \/ 产品/u);
  assert.match(script, /function renderClassificationGroups/u);
  assert.ok(data.events.some((item) => item.tags.length > 0));
  assert.ok(data.events.some((item) => item.classifications.length > item.tags.length));
  assert.ok(data.events.every((item) => item.tags.every((tag) => tag.dimensionId === "technology")));
  assert.ok(data.events.every((item) => item.classifications.every((entry) => entry.dimensionId && entry.id && entry.name)));
});

test("FDE and hardware projections preserve the daily batch date", () => {
  const data = buildFrontstageData(root);
  const publicEventIds = new Set(data.events.map((item) => item.id));

  assert.ok(data.fde.every((item) => /^\d{4}-\d{2}-\d{2}$/u.test(item.dataDate)));
  assert.ok(data.hardware.every((item) => /^\d{4}-\d{2}-\d{2}$/u.test(item.dataDate)));
  assert.ok(data.fde.every((item) => publicEventIds.has(item.eventId)));
  assert.ok(data.hardware.every((item) => publicEventIds.has(item.eventId)));
  assert.ok(data.fde.some((item) => item.dataDate === data.meta.currentDate));
  assert.ok(data.hardware.some((item) => item.dataDate === data.meta.currentDate));
});

test("FDE and hardware default to the current month while commercial events remain daily", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const data = buildFrontstageData(root);
  const currentMonth = data.meta.currentDate.slice(0, 7);
  const fdeToday = data.fde.filter((item) => item.dataDate === data.meta.currentDate).length;
  const hardwareToday = data.hardware.filter((item) => item.dataDate === data.meta.currentDate).length;
  const fdeMonth = data.fde.filter((item) => item.dataDate.startsWith(`${currentMonth}-`)).length;
  const hardwareMonth = data.hardware.filter((item) => item.dataDate.startsWith(`${currentMonth}-`)).length;

  assert.match(script, /targetView === "events" && !\["from", "to"\]/u);
  assert.match(script, /function monthlyProjectionMode\(targetView = view\)/u);
  assert.match(script, /item\.dataDate\.startsWith\(`\$\{currentDataMonth\(data\)\}-`\)/u);
  assert.match(script, /数据月份/u);
  assert.ok(fdeMonth > fdeToday);
  assert.ok(hardwareMonth > hardwareToday);
});

test("public event sources expose original publishers instead of discovery channels", () => {
  const data = buildFrontstageData(root);

  assert.ok(data.events.every((item) => !/\b(?:keyword search|anysearch|gdelt)\b/iu.test(item.publisher)));
  assert.ok(data.events.every((item) => item.sources.every((source) => !/\b(?:keyword search|anysearch|gdelt)\b/iu.test(source.publisher))));
});

test("commercial events prioritize financing and cases before products and other records", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");

  assert.match(script, /const eventDisplayPriority = new Map/u);
  assert.match(script, /\["融资与并购", 0\]/u);
  assert.match(script, /\["部署与案例", 1\]/u);
  assert.match(script, /\["商业合作", 2\]/u);
  assert.match(script, /\["模型、产品与服务", 3\]/u);
  assert.match(script, /function sortEventsForDisplay\(items\)/u);
  assert.match(script, /items = sortEventsForDisplay\(items\)/u);
  assert.match(script, /a\.index - b\.index/u);
});

test("formal entities and classification nodes share one entity index", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");

  assert.match(script, /index: \{ title: "实体索引"/u);
  assert.match(script, /function entityIndexItems\(data\)/u);
  assert.match(script, /\.\.\.\(data\.companies \|\| \[\]\)\.map/u);
  assert.match(script, /\.\.\.\(data\.products \|\| \[\]\)\.map/u);
  assert.match(script, /\.\.\.\(data\.people \|\| \[\]\)\.map/u);
  assert.match(script, /\.\.\.\(data\.taxonomyNodes \|\| \[\]\)\.map/u);
  assert.match(script, /label: "公司与机构"/u);
  assert.match(script, /label: "产品模型服务"/u);
  assert.match(script, /label: "人物"/u);
  assert.match(script, /label: "AI 技术"/u);
  assert.match(script, /label: "场景与行业"/u);
  assert.match(script, /legacyView === "companies" \|\| legacyView === "products"/u);
  assert.match(script, /detailLink\("index", item\.detailKind, item\.id\)/u);
  assert.match(script, /isIndex && params\.get\("type"\)/u);
});
