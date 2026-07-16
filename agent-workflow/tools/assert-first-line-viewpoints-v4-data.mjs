#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataFile = path.join(root, "01-SiteV2", "site", "data", "first-line-viewpoints-v4.json");
const problems = [];
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const requireAfternoon = args.get("require-afternoon") !== "false";

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    problems.push(`invalid or missing V4 viewpoints data: ${error.message}`);
    return {};
  }
}

function hasChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

const data = readJson(dataFile);
const meta = data.meta || {};
const stats = data.stats || {};
const remarks = Array.isArray(data.remarks) ? data.remarks : [];
const morningIntake = Array.isArray(data.morningIntake) ? data.morningIntake : [];
const intake = Array.isArray(data.intake) ? data.intake : [];
const builders = Array.isArray(data.builders) ? data.builders : [];
const morning = meta.lanes?.morning || {};
const afternoon = meta.lanes?.afternoon || {};

if (morning.id !== "morning-rss") problems.push("morning-rss lane metadata is missing");
if (afternoon.id !== "afternoon-skill") problems.push("afternoon-skill lane metadata is missing");
if (!morning.dataFile) problems.push("morning lane dataFile is missing");
if (requireAfternoon && !afternoon.dataFile) problems.push("afternoon lane dataFile is missing");
if (remarks.length === 0) problems.push("published remarks are empty");
if (morningIntake.length === 0) problems.push("morning intake is empty");
if (builders.length === 0) problems.push("builder index is empty");
if (requireAfternoon && intake.length === 0) problems.push("afternoon intake is empty");
if (Number(morning.collected) !== morningIntake.length) problems.push(`morning collected ${morning.collected} does not match intake ${morningIntake.length}`);
if (Number(morning.published) !== remarks.length) problems.push(`morning published ${morning.published} does not match published remarks ${remarks.length}`);
if (Number(afternoon.declaredCount) !== intake.length) problems.push(`afternoon declared count ${afternoon.declaredCount} does not match intake ${intake.length}`);
if (Number(stats.afternoonIntake) !== intake.length) problems.push(`stats.afternoonIntake ${stats.afternoonIntake} does not match intake ${intake.length}`);
if (Number(stats.morningIntake) !== morningIntake.length) problems.push(`stats.morningIntake ${stats.morningIntake} does not match morning intake ${morningIntake.length}`);
if (Number(stats.morningPublished) !== remarks.length) problems.push(`stats.morningPublished ${stats.morningPublished} does not match published remarks ${remarks.length}`);
if (Number(stats.dualCovered) !== intake.filter((item) => item.coveredByMorning).length) problems.push("dualCovered count does not match afternoon overlap");
if (Number(stats.intakeOnly) !== intake.filter((item) => !item.coveredByMorning).length) problems.push("intakeOnly count does not match afternoon-only intake");

const remarkUrls = new Set();
for (const [index, item] of remarks.entries()) {
  const prefix = `remark[${index}]`;
  if (!item.url) problems.push(`${prefix} missing original URL`);
  else if (remarkUrls.has(item.url)) problems.push(`${prefix} duplicate URL`);
  else remarkUrls.add(item.url);
  if (item.translationStatus !== "translated") problems.push(`${prefix} is not translated`);
  if (!hasChinese(item.contentTranslation || item.translation)) problems.push(`${prefix} has no Chinese primary content`);
  if (item.aiRelevant !== true) problems.push(`${prefix} did not pass AI relevance gate`);
  if (!Array.isArray(item.laneCoverage) || !item.laneCoverage.includes("morning-rss")) problems.push(`${prefix} bypassed the morning public gate`);
  if (item.publicationStatus !== "published") problems.push(`${prefix} publicationStatus must be published`);
}

for (const [index, item] of morningIntake.entries()) {
  const prefix = `morningIntake[${index}]`;
  if (!item.url) problems.push(`${prefix} missing original URL`);
  if (!["published", "intake_only_non_ai"].includes(item.publicationStatus)) problems.push(`${prefix} has invalid publicationStatus`);
}

const intakeUrls = new Set();
for (const [index, item] of intake.entries()) {
  const prefix = `intake[${index}]`;
  if (!item.url) problems.push(`${prefix} missing original URL`);
  else if (intakeUrls.has(item.url)) problems.push(`${prefix} duplicate URL`);
  else intakeUrls.add(item.url);
  if (!Array.isArray(item.laneCoverage) || !item.laneCoverage.includes("afternoon-skill")) problems.push(`${prefix} missing afternoon-skill coverage`);
}

const serialized = JSON.stringify(data);
for (const forbidden of ["signal_card", "relationshipGraph", "trendCandidates", "recommendation", "business_meaning"]) {
  if (serialized.includes(forbidden)) problems.push(`forbidden business-signal field marker: ${forbidden}`);
}

console.log(JSON.stringify({
  ok: problems.length === 0,
  status: problems.length ? "failed" : "passed",
  problems,
  remarks: remarks.length,
  morningIntake: morningIntake.length,
  builders: builders.length,
  afternoonIntake: intake.length,
  dualCovered: Number(stats.dualCovered || 0),
  intakeOnly: Number(stats.intakeOnly || 0),
  requireAfternoon,
  dataFile: path.relative(root, dataFile).replace(/\\/gu, "/")
}, null, 2));

if (problems.length) process.exit(1);
