import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { buildHomepageFrontstage } from "../../../01-SiteV2/site/scripts/build-homepage-frontstage.mjs";

function writeJson(root, relative, data) {
  const file = path.join(root, relative);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data), "utf8");
}

test("homepage projection uses verified event counts without summing currencies", () => {
  const projectRoot = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-homepage-"));
  try {
    writeJson(projectRoot, "01-SiteV2/site/data/funding-insights-v1.json", {
      meta: { latest_date: "2026-08-08", generated_at: "2026-08-08T00:00:00Z", duplicate_rounds_removed: 2 },
      cards: [
        {
          funding_insight_id: "FI-USD",
          published_at: "2026-08-08T00:00:00Z",
          company: { name: "Acme" },
          financing: {
            round: "A轮",
            round_code: "series_a",
            amount_original: "$10M",
            amount_normalized: { currency: "USD", value: 10000000, display_zh: "1,000 万美元" },
            announced_at: "2026-08-05",
            disclosure_status: "disclosed",
            investors: [{ name: "Northstar", role: "本轮领投", institution_id: "INV-1" }],
          },
          market_category: { id: "infrastructure_compute", name: "基础设施与算力" },
          research_sources: [{ source_id: "SRC-1" }],
        },
        {
          funding_insight_id: "FI-CNY",
          published_at: "2026-08-07T00:00:00Z",
          company: { name: "Beta" },
          financing: {
            round: "种子轮",
            amount_original: "人民币 2,000 万元",
            amount_normalized: { currency: "CNY", value: 20000000, display_zh: "2,000 万元" },
            announced_at: "2026-08-04",
            disclosure_status: "disclosed",
            investors: [],
          },
          market_category: { id: "enterprise_applications", name: "企业级应用" },
          research_sources: [{ source_id: "SRC-2" }],
        },
      ],
    });
    writeJson(projectRoot, "01-SiteV2/content/11-databases/investment-institutions-v1.json", {
      meta: { evidence_backed_count: 1, current_round_activity_count: 3 },
      institutions: [{
        id: "INV-1",
        name: "Northstar",
        aliases: [],
        investor_kind_label: "投资机构",
        collection_status: "evidence_backed",
        current_round_count: 3,
        portfolio_company_count: 2,
        latest_disclosed_at: "2026-08-05",
      }],
    });
    const data = buildHomepageFrontstage(projectRoot);
    assert.equal(data.metrics.verified_financing_events, 2);
    assert.equal(data.metrics.evidence_backed_investor_subjects, 1);
    assert.equal(data.metrics.current_round_activities, 3);
    assert.equal(data.weekly_financing_counts.at(-1).count, 2);
    assert.deepEqual(data.latest_deals.map((deal) => deal.amount_display), ["1,000 万美元", "2,000 万元"]);
    assert.doesNotMatch(JSON.stringify(data), /total_amount|cumulative_currency_total/u);
    assert.doesNotMatch(JSON.stringify(data), /market_categories|"disclosure_status":|institution_id|aliases/u);
  } finally {
    fs.rmSync(projectRoot, { recursive: true, force: true });
  }
});

test("public homepage binds its magazine layout to the lightweight verified projection", () => {
  const root = path.resolve(import.meta.dirname, "../../..");
  const html = fs.readFileSync(path.join(root, "01-SiteV2/site/index.html"), "utf8");
  const script = fs.readFileSync(path.join(root, "01-SiteV2/site/assets/home.js"), "utf8");
  assert.match(html, /logo-wavesight-reference-horizontal\.svg/u);
  assert.match(html, /data-center\.html\?view=events/u);
  assert.match(html, /data-center\.html\?view=index/u);
  assert.match(html, /trend-radar\.html/u);
  assert.match(html, /intelligence-map\.html/u);
  assert.doesNotMatch(html, /newsletter|订阅成功|92%/iu);
  assert.match(script, /data\/homepage-v1\.json/u);
  assert.doesNotMatch(script, /235|1079|1080|1223/u);
});
