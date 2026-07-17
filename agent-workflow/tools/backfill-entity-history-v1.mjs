#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { writeFrontstageData } from "../../01-SiteV2/site/scripts/build-data-center-v4-frontstage.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const reportFile = path.join(root, "agent-workflow/reports/entity-history-v1-backfill.json");

function dateOnly(value = "") {
  return String(value).slice(0, 10);
}

function subtractMonths(value, months) {
  const date = new Date(`${value}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() - months);
  return date.toISOString().slice(0, 10);
}

function daysBetween(start, end) {
  return Math.floor((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86400000);
}

const { data } = writeFrontstageData(root);
const endDate = data.entityHistoryManifest.coverage.endDate;
const observedStart = data.entityHistoryManifest.coverage.startDate;
const targetStart = subtractMonths(endDate, 6);
const windowEvents = data.events.filter((event) => {
  const eventDate = dateOnly(event.date || event.dataDate);
  return eventDate >= targetStart && eventDate <= endDate;
});
const monthlyEventCounts = Object.entries(windowEvents.reduce((counts, event) => {
  const month = dateOnly(event.date || event.dataDate).slice(0, 7);
  counts[month] = (counts[month] || 0) + 1;
  return counts;
}, {})).sort(([a], [b]) => a.localeCompare(b)).map(([month, count]) => ({ month, count }));
const acceptedDataDates = [...new Set(windowEvents.map((event) => dateOnly(event.dataDate)).filter(Boolean))].sort();
const boundaryGapDays = Math.max(daysBetween(targetStart, observedStart), 0);
const eventTimeCoverageDays = daysBetween(observedStart, endDate);
const report = {
  ok: eventTimeCoverageDays >= 175 && boundaryGapDays <= 7,
  generatedAt: new Date().toISOString(),
  versions: {
    product: data.meta.productVersion,
    entity: data.entityHistoryManifest.entityVersion,
    relationship: data.entityHistoryManifest.relationshipVersion
  },
  scope: "Reproject all accepted canonical events into entity profiles, timelines, taxonomy nodes, and evidence-backed relationships. This does not claim one accepted source batch for every calendar day.",
  targetWindow: { startDate: targetStart, endDate, months: 6 },
  observedCoverage: {
    startDate: observedStart,
    endDate,
    eventTimeCoverageDays,
    boundaryGapDays,
    acceptedDataBatchCount: acceptedDataDates.length,
    acceptedDataDates
  },
  counts: {
    eventsInWindow: windowEvents.length,
    entities: data.entityProfiles.length,
    taxonomyNodes: data.taxonomyNodes.length,
    relationships: data.entityRelationships.length
  },
  monthlyEventCounts,
  unresolved: boundaryGapDays ? [
    `The accepted event-time history begins ${boundaryGapDays} days after the six-calendar-month boundary. No event or source was invented to fill this boundary gap.`
  ] : []
};

fs.mkdirSync(path.dirname(reportFile), { recursive: true });
fs.writeFileSync(reportFile, `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ ...report, report: path.relative(root, reportFile).replace(/\\/gu, "/") }, null, 2));
if (!report.ok) process.exit(1);
