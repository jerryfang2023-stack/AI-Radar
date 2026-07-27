#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  fundingInsightProblems,
  latestDataDate,
  loadDailyBundle,
  readJson,
} from "./funding-insight-v1-utils.mjs";

const root = process.cwd();

export function inspectFundingInsightWork(projectRoot = root, requestedDate = "") {
  const date = requestedDate || latestDataDate(projectRoot);
  if (!date) throw new Error("funding_insight_date_missing");
  const bundle = loadDailyBundle(projectRoot, date);
  const output = path.join(
    projectRoot,
    "01-SiteV2/content/12-applications/funding-insights",
    `${date}.json`,
  );
  const outputExists = fs.existsSync(output);
  const existing = readJson(output, { cards: [], queue: [] });
  const acceptedEventIds = new Set((existing.cards || [])
    .filter((card) => fundingInsightProblems(card).length === 0)
    .map((card) => card.triggered_by_event_id));
  const eligibleEvents = [...new Map(bundle.events
    .filter((event) => event.event_type === "funding")
    .filter((event) => event.publication_status === "verified")
    .filter((event) => event.display_title_zh)
    .map((event) => [event.event_id, event])).values()];
  const pendingEventIds = eligibleEvents
    .filter((event) => !acceptedEventIds.has(event.event_id))
    .map((event) => event.event_id);
  const needsGeneration = !outputExists || pendingEventIds.length > 0;
  return {
    ok: true,
    date,
    output: path.relative(projectRoot, output).replace(/\\/gu, "/"),
    output_exists: outputExists,
    eligible_funding_events: eligibleEvents.length,
    auto_published: eligibleEvents.length - pendingEventIds.length,
    pending: pendingEventIds.length,
    pending_event_ids: pendingEventIds,
    needs_generation: needsGeneration,
    reason: !outputExists
      ? "daily_application_bundle_missing"
      : pendingEventIds.length
        ? "verified_funding_events_without_published_cards"
        : "up_to_date",
  };
}

function cliArgs() {
  return new Map(process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  }));
}

function appendGithubOutput(file, result) {
  if (!file) return;
  const lines = [
    `date=${result.date}`,
    `needs_generation=${result.needs_generation}`,
    `eligible_funding_events=${result.eligible_funding_events}`,
    `auto_published=${result.auto_published}`,
    `pending=${result.pending}`,
    `reason=${result.reason}`,
  ];
  fs.appendFileSync(path.resolve(file), `${lines.join("\n")}\n`, "utf8");
}

function main() {
  const args = cliArgs();
  const result = inspectFundingInsightWork(root, args.get("date") || "");
  appendGithubOutput(args.get("github-output") || "", result);
  console.log(JSON.stringify(result, null, 2));
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) main();
