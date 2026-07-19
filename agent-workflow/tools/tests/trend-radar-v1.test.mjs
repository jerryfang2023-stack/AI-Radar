import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { buildTrendRadarData, COLUMN_VERSION } from "../../../01-SiteV2/site/scripts/build-trend-radar-frontstage.mjs";

const root = process.cwd();
const data = buildTrendRadarData(root);
const page = fs.readFileSync(path.join(root, "01-SiteV2/site/trend-radar.html"), "utf8");
const client = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/trend-radar.js"), "utf8");
const sharedStyles = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/data-center-v4.css"), "utf8");

test("Trend Radar uses the current factual column contract", () => {
  assert.equal(data.meta.columnVersion, COLUMN_VERSION);
  assert.equal(data.meta.dateBasis, "dataDate");
  assert.equal(data.periods.day.defaultKey, data.meta.latestDataDate);
  assert.ok(data.meta.boundary.includes("no viewpoints"));
});

test("every projected event retains evidence lineage", () => {
  for (const event of Object.values(data.events)) {
    assert.ok(event.claimIds.length > 0, event.id);
    assert.ok(event.sourceIds.length > 0, event.id);
    assert.match(event.sourceUrl, /^https?:\/\//, event.id);
  }
});

test("daily category counts resolve exactly to projected events", () => {
  for (const [key, record] of Object.entries(data.periods.day.records)) {
    const events = record.eventIds.map((id) => data.events[id]);
    assert.ok(events.every(Boolean));
    for (const category of data.meta.categoryOrder) assert.equal(record.counts[category], events.filter((event) => event.category === category).length, `${key} ${category}`);
  }
});

test("weekly and monthly structures expose evidence IDs", () => {
  for (const record of Object.values(data.periods.week.records)) {
    assert.ok(record.deploymentEventIds.every((id) => data.events[id]));
    for (const item of record.activeEntities) assert.ok(item.eventIds.every((id) => data.events[id]));
  }
  for (const record of Object.values(data.periods.month.records)) for (const list of Object.values(record.distributions)) for (const item of list) {
    assert.ok(item.eventIds.length > 0);
    assert.ok(item.eventIds.every((id) => data.events[id]));
  }
});

test("entity kinds are normalized for structural calculations", () => {
  const kinds = new Set(Object.values(data.entities).map((entity) => entity.entityType));
  assert.ok(kinds.has("organization"));
  assert.ok(kinds.has("product"));
  assert.ok(!kinds.has("organization_candidate"));
  assert.ok(Object.values(data.periods.week.records).some((record) => record.activeEntities.length > 0));
  assert.ok(Object.values(data.periods.week.records).some((record) => record.productsEnteringUse.length > 0));
  assert.ok(Object.values(data.periods.week.records).some((record) => record.deploymentEventIds.some((id) => data.events[id].eventType === "hardware_deployment")));
});

test("monthly comparisons use equal observed windows and new entities retain events", () => {
  for (const record of Object.values(data.periods.month.records)) {
    for (const item of [...record.newCompanies, ...record.newProducts]) {
      assert.ok(item.eventIds.length > 0);
      assert.ok(item.eventIds.every((id) => data.events[id]));
    }
    if (record.comparisonAvailable) {
      assert.equal(record.comparisonWindow.previousObservedDataDays.length, record.comparisonWindow.currentEndDay);
    } else {
      assert.ok(Object.values(record.deltas).every((value) => value === null));
    }
  }
});

test("page is a V4 application page with factual period controls", () => {
  assert.match(page, /TRADAR-V1\.0\.0-factual-change-explorer/);
  assert.match(page, /<h1>趋势雷达<\/h1>/);
  assert.match(page, /data-period="day"/);
  assert.match(page, /data-period="week"/);
  assert.match(page, /data-period="month"/);
  assert.match(page, /href="trend-radar\.html" aria-current="page"/);
  assert.match(page, /<header class="dc-header">/);
  assert.match(page, /<div class="dc-layout">/);
  assert.doesNotMatch(page, /dc-brandbar|class="dc-shell"/);
  assert.match(sharedStyles, /\.dc-skip-link:focus-visible/);
  assert.match(client, /data\/trend-radar-v1\.json/);
  assert.ok(Object.values(data.events).every((event) => event.detailUrl.startsWith("data-center.html?view=events")));
});
