import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
  assert.ok(data.events.every((event) => isCompletePublicEventTitle(event.title)));
  assert.ok(data.events.every((event) => Array.isArray(event.tags) && Array.isArray(event.sources)));
});

test("person index contains reviewed natural people while preserving all viewpoint records", () => {
  const data = buildFrontstageData(root);
  const source = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/first-line-viewpoints-v4.json"), "utf8"));
  const review = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/person-account-review-decisions.json"), "utf8"));
  const peopleByName = new Map(data.people.map((person) => [person.name, person]));
  const reviewedNaturalNames = new Set(review.decisions
    .filter((decision) => decision.review_status === "accepted" && decision.action !== "quarantine" && decision.canonical?.catalog_type === "person")
    .map((decision) => decision.canonical.name));
  const forbiddenAccounts = ["Ben's Bites AI Newsletter", "Claude", "Dataiku Blog", "Google Labs", "Tigera Blog (Calico / AI Security)", "TLDR AI Newsletter"];

  assert.ok(data.people.length >= reviewedNaturalNames.size);
  assert.ok([...reviewedNaturalNames].every((name) => peopleByName.has(name)));
  assert.equal(data.viewpoints.length, source.remarks.length);
  assert.ok(forbiddenAccounts.every((name) => !peopleByName.has(name)));
  assert.ok(peopleByName.get("Jack Clark")?.aliases.includes("Import AI (Jack Clark)"));
  assert.ok(peopleByName.get("Nathan Lambert")?.aliases.includes("Interconnects (Nathan Lambert)"));
  assert.ok(peopleByName.get("Lilian Weng")?.aliases.includes("Lilian Weng's Blog (OpenAI)"));
  assert.ok(peopleByName.get("Simon Willison")?.aliases.includes("Simon Willison's Blog"));
  assert.ok(data.viewpoints.some((item) => item.person === "Claude" && !item.personEntityId));
  assert.ok(data.viewpoints.some((item) => item.person === "Import AI (Jack Clark)" && item.personEntityId === peopleByName.get("Jack Clark")?.id));
});

test("person index publishes exactly the reviewed founder batch with funding and source lineage", () => {
  const data = buildFrontstageData(root);
  const review = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/funding-founder-review-decisions.json"), "utf8"));
  const fundingFounders = data.people.filter((person) => person.fundingInsightIds?.length);
  const reviewedIds = new Set(review.decisions.map((decision) => decision.entity_id));

  assert.equal(fundingFounders.length, 30);
  assert.ok(fundingFounders.every((person) => reviewedIds.has(person.id)));
  assert.ok(fundingFounders.every((person) => person.founderCompanies.length > 0));
  assert.ok(fundingFounders.every((person) => person.founderEvidence.every((evidence) =>
    evidence.sourceUrl && evidence.sourceContentHash && evidence.quoteHash
  )));
  assert.ok(fundingFounders.every((person) => person.relationIds.length === 0 || person.eventIds.length > 0));
});

test("entity catalog deployment gate accepts the composite reviewed-person service", () => {
  const result = spawnSync(process.execPath, [
    path.join(root, "agent-workflow/tools/assert-entity-catalog-review.mjs")
  ], {
    cwd: root,
    encoding: "utf8",
    windowsHide: true
  });

  assert.equal(result.status, 0, result.stderr || result.stdout);
  const output = JSON.parse(result.stdout);
  assert.equal(output.public_natural_people, 61);
  assert.equal(output.funding_founder_profiles, 30);
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

  assert.ok(defaultEvents.length > 0);
  assert.ok(defaultEvents.every((event) => event.dataDate === data.meta.currentDate));
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
  const moonshotProducts = data.products.filter((item) =>
    item.companyNames.some((name) => ["Moonshot AI", "月之暗面"].includes(name)));

  assert.ok(names.includes("1Password for Claude"));
  assert.ok(names.includes("PerceptionBench"));
  assert.ok(names.includes("GenFlow"));
  assert.ok(names.includes("Jetson Thor"));
  assert.ok(names.includes("LM Studio Bionic"));
  assert.ok(moonshotProducts.length > 0);
  assert.ok(moonshotProducts.every((item) => item.eventIds.length > 0));
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
  assert.ok(data.hardwareCatalog.every((item) => item.sourceUrl && item.factCount > 0));
  assert.match(script, /dataKey: "hardwareCatalog"/u);
  assert.match(script, /产品规格目录、产能供应面板与变化时间线/u);
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
  assert.match(html, /data-view-link="events">事件库/u);
  assert.match(html, /data-center\.html\?view=index" data-view-link="index">实体库/u);
  assert.doesNotMatch(html, /data-view-link="fde"|data-view-link="hardware"|data-view-link="relations"/u);
  assert.ok(indexPosition > viewpointPosition);
  assert.match(html, />数据中心</u);
  assert.match(html, />应用中心</u);
  assert.match(html, /href="intelligence-map\.html">观澜研究</u);
  assert.doesNotMatch(html, /href="funding-insights\.html"|href="opportunity-map\.html"/u);
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
  const workflow = fs.readFileSync(path.join(root, ".github/workflows/daily-first-line-viewpoints-pr.yml"), "utf8");
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
  assert.match(workflow, /Refresh Data Center viewpoint adapter/u);
  assert.match(workflow, /refresh-data-center-viewpoints-adapter\.mjs/u);
  assert.match(workflow, /stage_if_exists "01-SiteV2\/site\/data\/data-center-v4-frontstage\.json"/u);
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

test("Guanlan Research uses the focused two-center sidebar and owns research topics", () => {
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
  assert.match(html, /data-center\.html\?view=events">事件库/u);
  assert.ok(indexPosition > viewpointPosition);
  assert.doesNotMatch(html, /data-center\.html\?view=companies/u);
  assert.doesNotMatch(html, /data-center\.html\?view=products/u);
  assert.match(html, /<title>观澜研究｜观澜 AI<\/title>/u);
  assert.match(html, /href="intelligence-map\.html" aria-current="page">观澜研究/u);
  assert.match(html, /href="funding-insights\.html"/u);
  assert.match(html, /资本与融资/u);
  assert.match(html, /企业 AI 落地/u);
  assert.doesNotMatch(html, /href="opportunity-map\.html"/u);
  assert.match(html, /class="report-feature-grid"/u);
  assert.ok(weeklyFeaturePosition >= 0 && weeklyFeaturePosition < monthlyFeaturePosition);
  assert.match(html, /REPORTS-V1\.2\.0-research-hub/u);
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

test("opportunity map remains a noindex internal lab route", () => {
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/opportunity-map.html"), "utf8");

  assert.match(html, /<title>机会地图｜观澜 AI<\/title>/u);
  assert.match(html, /href="intelligence-map\.html">观澜研究/u);
  assert.match(html, /<meta name="robots" content="noindex, nofollow">/u);
  assert.doesNotMatch(html, /href="opportunity-map\.html" aria-current="page"/u);
  assert.doesNotMatch(html, /href="funding-insights\.html"/u);
  assert.match(html, /id="entry-map"/u);
  assert.match(html, /OMAP-V2\.0\.0-v4-evidence/u);
  assert.match(html, /id="pain-map"/u);
  assert.match(html, /data-map-panel="entry"/u);
  assert.match(html, /data-map-panel="pain"/u);
  assert.match(html, /data-cell-modal/u);
  assert.match(html, /data\/opportunity-evidence-v2\.json/u);
  assert.doesNotMatch(html, /最新月报|最新周报|report-feature-grid/u);
});

test("event toolbar is wired to real query controls", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const css = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.css"), "utf8");
  const fdeIndex = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/fde.json"), "utf8"));
  const hardwareIndex = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/hardware.json"), "utf8"));

  assert.match(script, /events: \{ title: "事件库", description: "可追溯的 AI 行业事实事件，FDE 与 AI 硬件作为主题视图统一检索"/u);
  assert.match(script, /name="theme" aria-label="事件专题"/u);
  assert.match(script, /theme === "fde"[\s\S]*data\.fde[\s\S]*fdeDossiers[\s\S]*theme === "hardware"[\s\S]*data\.hardware[\s\S]*hardwareCatalog/u);
  assert.match(script, /indexes\/events[\s\S]*indexes\/fde[\s\S]*indexes\/hardware/u);
  assert.match(script, /fde: fdeData\.fde \|\| \[\][\s\S]*hardware: hardwareData\.hardware \|\| \[\]/u);
  const fdeThemeEventIds = new Set([
    ...fdeIndex.fde.map((item) => item.eventId),
    ...fdeIndex.fdeDossiers.flatMap((item) => item.eventIds || []),
  ]);
  const hardwareThemeEventIds = new Set([
    ...hardwareIndex.hardware.map((item) => item.eventId),
    ...hardwareIndex.hardwareCatalog.flatMap((item) => item.eventIds || []),
  ]);
  assert.ok(fdeIndex.fde.every((item) => fdeThemeEventIds.has(item.eventId)));
  assert.ok(hardwareIndex.hardware.every((item) => hardwareThemeEventIds.has(item.eventId)));
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
  const currentMonth = data.meta.currentDate.slice(0, 7);

  assert.ok(data.fde.every((item) => /^\d{4}-\d{2}-\d{2}$/u.test(item.dataDate)));
  assert.ok(data.hardware.every((item) => /^\d{4}-\d{2}-\d{2}$/u.test(item.dataDate)));
  assert.ok(data.fde.every((item) => publicEventIds.has(item.eventId)));
  assert.ok(data.hardware.every((item) => publicEventIds.has(item.eventId)));
  assert.ok(data.fde.some((item) => item.dataDate.startsWith(`${currentMonth}-`)));
  assert.ok(data.hardware.some((item) => item.dataDate.startsWith(`${currentMonth}-`)));
});

test("FDE and hardware projections prioritize newly collected records", () => {
  const data = buildFrontstageData(root);

  for (const records of [data.fde, data.hardware]) {
    const expected = [...records].sort((a, b) => (
      b.dataDate.localeCompare(a.dataDate)
      || b.date.localeCompare(a.date)
      || a.id.localeCompare(b.id)
    ));
    assert.deepEqual(records.map((item) => item.id), expected.map((item) => item.id));
  }
});

test("FDE and hardware list rows expose dossier and snapshot state", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");

  assert.match(script, /date: `更新 \$\{item\.dataDate\}`/u);
  assert.match(script, /secondaryDate: `\$\{item\.observationCount\} 条观察 · 完整度 \$\{item\.completenessPercent\}%`/u);
  assert.match(script, /date: `快照 \$\{item\.dataDate\}`/u);
  assert.match(script, /secondaryDate: `\$\{item\.factCount\} 条事实 · \$\{item\.snapshotCount\} 个快照`/u);
  assert.match(script, /row\.secondaryDate/u);
});

test("FDE dossiers, hardware catalog, and monitoring funnel are materialized", () => {
  const data = buildFrontstageData(root);
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");

  assert.ok(data.fdeDossiers.length > 0);
  assert.ok(data.fdeDossiers.every((item) => item.observationCount > 0 && item.completeness >= 0 && item.completeness <= 1));
  assert.ok(data.hardwareCatalog.length > 0);
  assert.ok(data.hardwareCatalog.every((item) => item.snapshotCount > 0 && item.factCount > 0));
  assert.deepEqual(data.monitoringFunnel.map((item) => item.lens).sort(), ["fde", "hardware"]);
  assert.match(script, /function renderLensOverview/u);
  assert.match(script, /原始来源率/u);
  assert.match(script, /有效 Claim 率/u);
  assert.match(script, /观察记录率/u);
  assert.match(script, /事件转化率/u);
});

test("FDE and hardware default to the current month while commercial events remain daily", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");
  const data = buildFrontstageData(root);
  const currentMonth = data.meta.currentDate.slice(0, 7);
  const fdeToday = data.fde.filter((item) => item.dataDate === data.meta.currentDate).length;
  const hardwareToday = data.hardware.filter((item) => item.dataDate === data.meta.currentDate).length;
  const fdeMonth = data.fde.filter((item) => item.dataDate.startsWith(`${currentMonth}-`)).length;
  const hardwareMonth = data.hardware.filter((item) => item.dataDate.startsWith(`${currentMonth}-`)).length;

  assert.match(script, /targetView === "events"[\s\S]*!params\.get\("theme"\)[\s\S]*!\["from", "to"\]/u);
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

test("entity library and embedded relationship views use the unified entity service", () => {
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.js"), "utf8");

  assert.match(script, /index: \{ title: "实体库"/u);
  assert.match(script, /relations: \{ title: "关系图谱"/u);
  assert.match(script, /function entityIndexItems\(data\)/u);
  assert.match(script, /\.\.\.\(data\.companies \|\| \[\]\)\.map/u);
  assert.match(script, /\.\.\.\(data\.products \|\| \[\]\)\.map/u);
  assert.match(script, /\.\.\.\(data\.people \|\| \[\]\)\.map/u);
  assert.match(script, /\.\.\.\(data\.taxonomyNodes \|\| \[\]\)\.map/u);
  assert.match(script, /label: "公司机构库"/u);
  assert.match(script, /label: "产品模型库"/u);
  assert.match(script, /label: "人物库"/u);
  assert.match(script, /label: "技术词表"/u);
  assert.match(script, /label: "场景行业词表"/u);
  assert.match(script, /legacyView === "companies" \|\| legacyView === "products"/u);
  assert.match(script, /detailLink\("index", item\.detailKind, item\.id\)/u);
  assert.match(script, /isIndex && params\.get\("type"\)/u);
  assert.match(script, /function renderRelationshipGraphPage\(data\)/u);
  assert.match(script, /function relationshipGraphSvg\(center, relations, entityById\)/u);
  assert.match(script, /splitDataUrl\("details\/relationships"\)/u);
  assert.match(script, /最近 30 天/u);
  assert.match(script, /最近 7 天/u);
});

test("relationship detail service resolves every edge to exact claims and sources", () => {
  const payload = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/details/relationships.json"), "utf8"));
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/manifest.json"), "utf8"));

  assert.equal(manifest.paths.relationshipsDetail, "data/data-center-v4/details/relationships.json");
  assert.ok(payload.relationships.length > 0);
  assert.ok(payload.relationships.every((item) => item.event_id && item.event?.id === item.event_id));
  assert.ok(payload.relationships.every((item) => item.claims.every((claim) => item.claim_refs.includes(claim.id) && claim.quote)));
  assert.ok(payload.relationships.every((item) => item.sources.every((source) => item.source_refs.includes(source.id) && source.url)));
});
