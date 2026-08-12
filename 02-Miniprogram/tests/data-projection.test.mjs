import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { projectFundingData, regionFor, roundGroup } from "../scripts/build-funding-data.mjs";

const source = JSON.parse(fs.readFileSync(path.resolve("..", "01-SiteV2", "site", "data", "funding-insights-v1.json"), "utf8"));
const projected = projectFundingData(source);

test("projects every published funding card with a matching detail", () => {
  assert.equal(projected.index.cards.length, source.cards.length);
  assert.equal(Object.keys(projected.details).length, source.cards.length);
  assert.equal(new Set(projected.index.cards.map((item) => item.id)).size, source.cards.length);
  for (const card of projected.index.cards) assert.ok(projected.details[card.id]);
  assert.equal(projected.index.meta.chinaMarketCardCount, source.meta.china_market_card_count || 0);
});

test("preserves bounded public fields and evidence links", () => {
  for (const card of projected.index.cards) {
    assert.ok(card.company);
    assert.ok(card.round);
    assert.ok(card.amount);
    assert.ok(Array.isArray(card.products));
    assert.ok(["multi", "official", "single"].includes(card.evidenceId));
    assert.ok(["china", "global"].includes(card.marketRegion));
  }
  const withSources = Object.values(projected.details).filter((item) => item.sources.length);
  assert.ok(withSources.length > 0);
  assert.ok(withSources.every((item) => item.sources.every((sourceItem) => /^https?:\/\//u.test(sourceItem.url))));
});

test("uses conservative region and round grouping", () => {
  assert.equal(regionFor("Beijing, China"), "china");
  assert.equal(regionFor("San Francisco"), "overseas");
  assert.equal(regionFor(""), "undisclosed");
  assert.equal(roundGroup("seed", "种子轮"), "early");
  assert.equal(roundGroup("series_b", "B轮"), "growth");
  assert.equal(roundGroup("series_f", "F轮"), "late");
});

test("does not project internal operational links", () => {
  const serialized = JSON.stringify(projected);
  assert.doesNotMatch(serialized, /data-center\.html|auto_publish_gate|model_provenance|evidence:\/\//u);
});
