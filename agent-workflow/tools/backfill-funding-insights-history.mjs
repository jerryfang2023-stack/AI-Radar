#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  clean,
  latestDataDate,
  readJson,
  subjectCompanyForEvent,
  writeJson,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));

function fundingEventsForDate(projectRoot, date, entityIndex) {
  const dir = path.join(
    projectRoot,
    "01-SiteV2/content/11-databases/data-center-v4",
    date,
  );
  const entities = readJson(path.join(dir, "entities.json"), []);
  const claims = readJson(path.join(dir, "claims.json"), []);
  return readJson(path.join(dir, "canonical-events.json"), [])
    .filter((event) => (
      event.event_type === "funding"
      && event.publication_status === "verified"
      && clean(event.display_title_zh)
    ))
    .map((event) => ({
      event,
      subject_company_resolved: Boolean(subjectCompanyForEvent(event, entities, entityIndex, claims)),
    }));
}

function occurrenceQuality(occurrence) {
  const event = occurrence.event;
  return [
    occurrence.subject_company_resolved ? 1 : 0,
    (event.source_refs || []).length,
    (event.claim_refs || []).length,
    -(event.missing_fields || []).length,
    occurrence.date,
  ];
}

function compareQuality(left, right) {
  const leftQuality = occurrenceQuality(left);
  const rightQuality = occurrenceQuality(right);
  for (let index = 0; index < leftQuality.length; index += 1) {
    if (leftQuality[index] === rightQuality[index]) continue;
    return leftQuality[index] > rightQuality[index] ? 1 : -1;
  }
  return 0;
}

export function selectHistoricalFundingEvents(projectRoot, {
  from = "",
  to = latestDataDate(projectRoot),
  maxEvents = 0,
} = {}) {
  const dataRoot = path.join(projectRoot, "01-SiteV2/content/11-databases/data-center-v4");
  const dates = fs.readdirSync(dataRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name)
    .filter((date) => (!from || date >= from) && (!to || date <= to))
    .sort();
  const entityIndex = readJson(
    path.join(projectRoot, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"),
    {},
  );
  const occurrencesByEvent = new Map();
  let occurrenceCount = 0;
  for (const date of dates) {
    for (const candidate of fundingEventsForDate(projectRoot, date, entityIndex)) {
      const { event, subject_company_resolved: subjectCompanyResolved } = candidate;
      occurrenceCount += 1;
      const occurrence = { date, event, subject_company_resolved: subjectCompanyResolved };
      if (!occurrencesByEvent.has(event.event_id)) occurrencesByEvent.set(event.event_id, []);
      occurrencesByEvent.get(event.event_id).push(occurrence);
    }
  }
  let owners = [...occurrencesByEvent.entries()]
    .map(([eventId, occurrences]) => {
      const owner = occurrences.reduce((best, item) => (
        !best || compareQuality(item, best) > 0 ? item : best
      ), null);
      return {
        event_id: eventId,
        owner_date: owner.date,
        event: owner.event,
        occurrence_dates: occurrences.map((item) => item.date),
      };
    })
    .sort((left, right) => (
      left.owner_date.localeCompare(right.owner_date)
      || left.event_id.localeCompare(right.event_id)
    ));
  if (maxEvents) owners = owners.slice(0, maxEvents);
  const groups = new Map();
  for (const owner of owners) {
    if (!groups.has(owner.owner_date)) groups.set(owner.owner_date, []);
    groups.get(owner.owner_date).push(owner);
  }
  return {
    from: from || dates[0] || "",
    to: to || dates.at(-1) || "",
    dates,
    occurrence_count: occurrenceCount,
    unique_event_count: occurrencesByEvent.size,
    selected_event_count: owners.length,
    duplicate_occurrences_removed: occurrenceCount - occurrencesByEvent.size,
    owners,
    groups,
  };
}

function runNode(script, commandArgs) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...commandArgs], {
      cwd: root,
      env: process.env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`funding_insight_child_failed:${path.basename(script)}:${code}`));
    });
  });
}

async function mapConcurrent(items, worker, size) {
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      await worker(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, Math.max(1, items.length)) }, run));
}

function reportForSelection(selection) {
  const outputRoot = path.join(root, "01-SiteV2/content/12-applications/funding-insights");
  const statusByEvent = new Map();
  for (const [date, owners] of selection.groups) {
    const bundle = readJson(path.join(outputRoot, `${date}.json`), {});
    const cards = new Map((bundle.cards || []).map((card) => [card.triggered_by_event_id, card]));
    const queue = new Map((bundle.queue || []).map((item) => [item.event_id, item]));
    for (const owner of owners) {
      const card = cards.get(owner.event_id);
      const queueItem = queue.get(owner.event_id);
      statusByEvent.set(owner.event_id, card
        ? { status: "auto_published", problems: [] }
        : {
            status: queueItem?.status || "pending",
            problems: queueItem?.problems || [],
          });
    }
  }
  const blocked = [...statusByEvent.entries()]
    .filter(([, item]) => item.status === "blocked")
    .map(([eventId, item]) => ({ event_id: eventId, problems: item.problems }));
  const pending = [...statusByEvent.entries()]
    .filter(([, item]) => !["auto_published", "blocked", "deduplicated"].includes(item.status))
    .map(([eventId, item]) => ({ event_id: eventId, problems: item.problems }));
  return {
    schema_version: "FUNDING-INSIGHT-HISTORICAL-BACKFILL-V1.0",
    generated_at: new Date().toISOString(),
    range: { from: selection.from, to: selection.to },
    counts: {
      funding_event_occurrences: selection.occurrence_count,
      unique_funding_events: selection.unique_event_count,
      selected_events: selection.selected_event_count,
      duplicate_occurrences_removed: selection.duplicate_occurrences_removed,
      auto_published: [...statusByEvent.values()].filter((item) => item.status === "auto_published").length,
      deduplicated: [...statusByEvent.values()].filter((item) => item.status === "deduplicated").length,
      blocked: blocked.length,
      pending: pending.length,
    },
    blocked,
    pending,
  };
}

async function main() {
  const from = clean(args.get("from") || "");
  const to = clean(args.get("to") || latestDataDate(root));
  const write = args.get("write") === "true";
  const force = args.get("force") === "true";
  const concurrency = Math.max(1, Math.min(4, Number(args.get("concurrency") || 2)));
  const dateConcurrency = Math.max(1, Math.min(4, Number(args.get("date-concurrency") || 1)));
  const maxEvents = Math.max(0, Number(args.get("max-events") || 0));
  const selection = selectHistoricalFundingEvents(root, { from, to, maxEvents });
  const dryRun = {
    ok: true,
    mode: write ? "write" : "dry-run",
    range: { from: selection.from, to: selection.to },
    data_dates: selection.dates.length,
    funding_event_occurrences: selection.occurrence_count,
    unique_funding_events: selection.unique_event_count,
    selected_events: selection.selected_event_count,
    duplicate_occurrences_removed: selection.duplicate_occurrences_removed,
    date_concurrency: dateConcurrency,
    event_concurrency_per_date: concurrency,
    owner_dates: [...selection.groups].map(([date, owners]) => ({ date, events: owners.length })),
  };
  console.log(JSON.stringify(dryRun, null, 2));
  if (!write) return;
  if (!selection.selected_event_count) throw new Error("funding_insight_historical_selection_empty");
  if (!process.env.DEEPSEEK_API_KEY) throw new Error("deepseek_key_missing_for_funding_insight");
  if (!process.env.TAVILY_API_KEY && !process.env.EXA_API_KEY) {
    throw new Error("funding_insight_search_provider_missing");
  }
  const generator = path.join(root, "agent-workflow/tools/generate-funding-insights-deepseek.mjs");
  const assertion = path.join(root, "agent-workflow/tools/assert-funding-insights-v1.mjs");
  await mapConcurrent([...selection.groups], async ([date, owners]) => {
    const eventIds = owners.map((owner) => owner.event_id);
    await runNode(generator, [
      `--date=${date}`,
      `--event-ids=${eventIds.join(",")}`,
      "--selected-only=true",
      "--write=true",
      `--force=${force}`,
      `--concurrency=${concurrency}`,
    ]);
    await runNode(assertion, [`--date=${date}`]);
  }, dateConcurrency);
  await runNode(path.join(root, "01-SiteV2/site/scripts/build-funding-insights-frontstage.mjs"), []);
  await runNode(assertion, ["--all=true", "--frontstage=true"]);
  const report = reportForSelection(selection);
  const reportFile = path.resolve(args.get("report")
    || path.join(root, "agent-workflow/reports/funding-insight-historical-backfill-current.json"));
  writeJson(reportFile, report);
  console.log(JSON.stringify({
    ok: report.counts.blocked === 0 && report.counts.pending === 0,
    report: path.relative(root, reportFile).replace(/\\/gu, "/"),
    counts: report.counts,
  }, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
