import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { syncFundingInsightsToObsidian } from "../sync-funding-insights-to-obsidian.mjs";

function card({
  id,
  eventId,
  date,
  company,
  status = "auto_published",
  gatePassed = true,
}) {
  const sourceId = `SRC-${id}`;
  return {
    schema_version: "FUNDING-INSIGHT-V1.0",
    funding_insight_id: id,
    triggered_by_event_id: eventId,
    as_of_date: date,
    company: {
      entity_id: `EN-${id}`,
      name: company,
      full_name: `${company} Inc.`,
      summary: `${company} 公司概况`,
      founders: [],
      evidence_refs: [{ source_id: sourceId, quote: `${company} builds AI products.` }],
    },
    financing: {
      round: "A 轮",
      amount: "2000 万美元",
      total_raised: "3000 万美元",
      announced_at: date,
      investors: [{
        name: "Northstar Ventures",
        role: "本轮领投",
        evidence_refs: [{ source_id: sourceId, quote: "Northstar Ventures led the round." }],
      }],
      evidence_refs: [{ source_id: sourceId, quote: "The company raised $20 million." }],
    },
    products: [],
    customers: [],
    comparisons: [],
    metrics: [],
    quotes: [],
    analysis: {
      capital_judgment: "资本关注已验证的产品采用信号。",
      validated_signals: ["产品已有付费客户"],
      risks: ["规模化仍待验证"],
      investment_rationale: [],
      sector: "企业 AI",
    },
    funding_history: [],
    research_sources: [{
      source_id: sourceId,
      source_url: `https://example.com/${id}`,
      title: `${company} funding`,
      publisher: "Example",
    }],
    auto_publish_gate: { passed: gatePassed, problems: [] },
    publication_status: status,
    links: {
      company: `data-center.html?view=index&id=EN-${id}`,
      funding_event: `data-center.html?view=events&id=${eventId}`,
    },
  };
}

test("融资透视 Obsidian 同步只写入已发布卡片，并保持幂等", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-obsidian-"));
  try {
    const input = path.join(root, "funding-insights-v1.json");
    const output = path.join(root, "knowledge", "04-Funding-Insights");
    fs.writeFileSync(input, JSON.stringify({
      meta: { generated_at: "2026-07-27T00:00:00.000Z" },
      cards: [
        card({ id: "FI-1", eventId: "EV-1", date: "2026-07-27", company: "Acme" }),
        card({ id: "FI-2", eventId: "EV-2", date: "2026-06-30", company: "Beta" }),
        card({ id: "FI-3", eventId: "EV-3", date: "2026-07-26", company: "Blocked", status: "blocked", gatePassed: false }),
      ],
    }, null, 2));

    const first = syncFundingInsightsToObsidian({ root, input, output });
    assert.equal(first.source_cards, 3);
    assert.equal(first.synced_cards, 2);
    assert.equal(first.skipped_cards, 1);
    assert.equal(first.months, 2);
    assert.equal(first.files, 6);
    assert.equal(first.created, 6);

    const acmeFile = path.join(output, "cards", "2026-07", "2026-07-27--Acme Inc--FI-1.md");
    const acme = fs.readFileSync(acmeFile, "utf8");
    assert.match(acme, /sync_owner: guanlan-funding-insight-obsidian-sync/u);
    assert.match(acme, /Northstar Ventures led the round\./u);
    assert.match(acme, /https:\/\/example\.com\/FI-1/u);
    assert.doesNotMatch(acme, /Blocked/u);

    const second = syncFundingInsightsToObsidian({ root, input, output });
    assert.equal(second.created, 0);
    assert.equal(second.updated, 0);
    assert.equal(second.unchanged, 6);
    assert.equal(second.deleted, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("融资透视 Obsidian 同步只清理自身生成的过期笔记", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "wavesight-funding-obsidian-cleanup-"));
  try {
    const input = path.join(root, "funding-insights-v1.json");
    const output = path.join(root, "knowledge", "04-Funding-Insights");
    fs.writeFileSync(input, JSON.stringify({
      meta: { generated_at: "2026-07-27T00:00:00.000Z" },
      cards: [card({ id: "FI-1", eventId: "EV-1", date: "2026-07-27", company: "Acme" })],
    }));
    syncFundingInsightsToObsidian({ root, input, output });

    const monthDir = path.join(output, "cards", "2026-07");
    const stale = path.join(monthDir, "stale.md");
    const userNote = path.join(monthDir, "我的补充.md");
    fs.writeFileSync(stale, "---\nsync_owner: guanlan-funding-insight-obsidian-sync\n---\n");
    fs.writeFileSync(userNote, "# 我的补充\n");

    const result = syncFundingInsightsToObsidian({ root, input, output });
    assert.equal(result.deleted, 1);
    assert.equal(fs.existsSync(stale), false);
    assert.equal(fs.existsSync(userNote), true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
