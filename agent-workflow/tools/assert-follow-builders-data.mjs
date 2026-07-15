#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { buildTagIndex, readTagTaxonomy } from "./tag-taxonomy-utils.mjs";
import { completeOpinionTranslation } from "./opinion-translation-utils.mjs";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/u, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const date = args.get("date") || beijingDate();
const remarksMin = numberArg("remarks-min", 12);
const buildersMin = numberArg("builders-min", 6);
const maxGeneratedAgeHours = numberArg("max-generated-age-hours", 36);
const maxFeedAgeHours = numberArg("max-feed-age-hours", 96);
const maxFallbackFeedAgeHours = numberArg("max-fallback-feed-age-hours", 72);
const maxRemarkAgeHours = numberArg("max-remark-age-hours", 96);
const reportsDir = path.join(root, "agent-workflow", "reports");
const dataFile = path.join(root, "01-SiteV2", "site", "data", "follow-builders-daily.json");
const tagIndex = buildTagIndex(readTagTaxonomy(root));

function numberArg(name, fallback) {
  const value = Number(args.get(name));
  return Number.isFinite(value) ? value : fallback;
}

function beijingDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function hoursSince(value) {
  const time = Date.parse(value || "");
  if (!Number.isFinite(time)) return null;
  return (Date.now() - time) / 36e5;
}

function newestDate(items, key) {
  const times = items
    .map((item) => Date.parse(item?.[key] || ""))
    .filter(Number.isFinite)
    .sort((a, b) => b - a);
  return times.length ? new Date(times[0]).toISOString() : "";
}

function markdownList(items) {
  return items.length ? items.map((item) => `- ${item}`).join("\n") : "- none";
}

function tagGroups(tags = []) {
  return new Set(tags.map((tag) => tag.group).filter(Boolean));
}

const problems = [];
const warnings = [];
let payload = null;

if (!fs.existsSync(dataFile)) {
  problems.push(`missing builders data: ${rel(dataFile)}`);
} else {
  try {
    payload = JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (error) {
    problems.push(`invalid builders data JSON: ${error.message}`);
  }
}

if (payload) {
  const remarks = Array.isArray(payload.remarks) ? payload.remarks : [];
  const builders = Array.isArray(payload.builders) ? payload.builders : [];
  const podcasts = Array.isArray(payload.podcasts) ? payload.podcasts : [];
  const stats = payload.stats || {};
  const meta = payload.meta || {};

  if (meta.sourceSkill !== "follow-builders") problems.push("meta.sourceSkill must be follow-builders");
  if (!meta.generatedAt) problems.push("meta.generatedAt is missing");
  if (!meta.sourceRoute) warnings.push("meta.sourceRoute is missing; source path is less observable");
  if (!meta.sourcePolicy || !/original URL|previous generated data/iu.test(meta.sourcePolicy)) {
    problems.push("meta.sourcePolicy must preserve original URL policy or explicit fallback policy");
  }

  const generatedAge = hoursSince(meta.generatedAt);
  const feedAge = hoursSince(meta.feedGeneratedAt);
  const newestRemarkAge = hoursSince(newestDate(remarks, "createdAt"));
  if (generatedAge === null) problems.push("meta.generatedAt is not parseable");
  else if (generatedAge > maxGeneratedAgeHours) problems.push(`builders data generated ${generatedAge.toFixed(1)}h ago, above ${maxGeneratedAgeHours}h`);
  if (meta.feedGeneratedAt && feedAge !== null && feedAge > maxFeedAgeHours) {
    problems.push(`follow-builders feed generated ${feedAge.toFixed(1)}h ago, above ${maxFeedAgeHours}h`);
  }
  if (meta.fallbackUsed) {
    if (!meta.fallbackReason) problems.push("fallbackUsed=true but fallbackReason is missing");
    if (feedAge !== null && feedAge > maxFallbackFeedAgeHours) {
      problems.push(`fallback data feed is ${feedAge.toFixed(1)}h old, above ${maxFallbackFeedAgeHours}h`);
    }
  }
  if (newestRemarkAge === null) problems.push("no parseable remark createdAt timestamp");
  else if (newestRemarkAge > maxRemarkAgeHours) problems.push(`newest remark is ${newestRemarkAge.toFixed(1)}h old, above ${maxRemarkAgeHours}h`);

  if (remarks.length < remarksMin) problems.push(`remarks count ${remarks.length} below ${remarksMin}`);
  if (builders.length < buildersMin) problems.push(`builders count ${builders.length} below ${buildersMin}`);
  if (Number(stats.remarks) !== remarks.length) problems.push(`stats.remarks ${stats.remarks} does not match remarks length ${remarks.length}`);
  if (Number(stats.builders) !== builders.length) problems.push(`stats.builders ${stats.builders} does not match builders length ${builders.length}`);
  if (podcasts.length === 0) warnings.push("no podcast item is present");
  const podcastUrls = new Set();
  for (const [index, podcast] of podcasts.entries()) {
    if (!podcast?.url) warnings.push(`podcast[${index}] missing original url`);
    else if (podcastUrls.has(podcast.url)) problems.push(`podcast[${index}] duplicate url`);
    else podcastUrls.add(podcast.url);
  }

  const ids = new Set();
  const urls = new Set();
  const seenHandles = new Set(builders.map((builder) => builder.handle).filter(Boolean));
  for (const [index, remark] of remarks.entries()) {
    const prefix = `remark[${index}] ${remark?.id || "(missing id)"}`;
    if (!remark?.id) problems.push(`${prefix} missing id`);
    else if (ids.has(remark.id)) problems.push(`${prefix} duplicate id`);
    else ids.add(remark.id);

    if (!remark?.url) problems.push(`${prefix} missing original url`);
    else if (urls.has(remark.url)) problems.push(`${prefix} duplicate url`);
    else urls.add(remark.url);

    if (!remark?.name) problems.push(`${prefix} missing builder name`);
    if (!remark?.handle) problems.push(`${prefix} missing builder handle`);
    if (remark?.handle && !seenHandles.has(remark.handle)) warnings.push(`${prefix} handle is absent from builders summary`);
    if (!remark?.text && !remark?.translation) problems.push(`${prefix} missing text or translation`);
    if (!completeOpinionTranslation(remark?.text || "", remark?.translation || "", { preferFullTranslation: true })) {
      problems.push(`${prefix} missing complete Chinese translation`);
    }
    if (remark?.translationStatus !== "translated") {
      problems.push(`${prefix} translationStatus must be translated`);
    }
    if (!remark?.observation) problems.push(`${prefix} missing observation`);

    const tags = Array.isArray(remark?.columnTags) ? remark.columnTags : [];
    const groups = tagGroups(tags);
    for (const requiredGroup of ["opinion"]) {
      if (!groups.has(requiredGroup)) problems.push(`${prefix} missing ${requiredGroup} tag`);
    }
    if (!remark?.sourceType) problems.push(`${prefix} missing sourceType metadata`);
    for (const tag of tags) {
      const active = tagIndex.byId.get(tag.id);
      if (!active) {
        problems.push(`${prefix} unknown tag ${tag.id}`);
      } else if (active.group !== tag.group) {
        problems.push(`${prefix} tag ${tag.id} group ${tag.group} should be ${active.group}`);
      }
    }
  }

  const payloadText = JSON.stringify(payload);
  for (const forbidden of ["signal_card", "raw_refs", "pool_refs", "relationshipGraph", "trendCandidates"]) {
    if (payloadText.includes(forbidden)) problems.push(`builders data contains forbidden business-signal field marker: ${forbidden}`);
  }
}

fs.mkdirSync(reportsDir, { recursive: true });
const status = problems.length ? "failed" : "passed";
const report = `# Follow Builders Data Gate

- generated_at: ${new Date().toISOString()}
- date: ${date}
- status: ${status}
- data_file: ${rel(dataFile)}
- remarks_min: ${remarksMin}
- builders_min: ${buildersMin}

## Problems

${markdownList(problems)}

## Warnings

${markdownList(warnings)}
`;

const reportFile = path.join(reportsDir, `${date}-follow-builders-data-gate.md`);
const latestFile = path.join(reportsDir, "follow-builders-data-gate-latest.md");
fs.writeFileSync(reportFile, report, "utf8");
fs.writeFileSync(latestFile, report, "utf8");

console.log(JSON.stringify({
  ok: problems.length === 0,
  status,
  issue_count: problems.length,
  warning_count: warnings.length,
  report: rel(reportFile),
}, null, 2));

if (problems.length) process.exit(1);
