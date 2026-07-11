#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const date = args.get("date") || new Date().toISOString().slice(0, 10);
const cardRoot = path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards");

function scalar(markdown, key) {
  return String(markdown.match(new RegExp(`^\\s*${key}:\\s*"?(.+?)"?\\s*$`, "mu"))?.[1] || "").replace(/^"|"$/gu, "").trim();
}

function section(markdown, heading) {
  return String(markdown.match(new RegExp(`## ${heading}\\s*\\n\\n?([\\s\\S]*?)(?=\\n## |$)`, "u"))?.[1] || "")
    .replace(/^[-*]\s*/gmu, "")
    .trim();
}

function normalized(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/原文称，|原始来源标题显示：/gu, "")
    .replace(/[^a-z0-9\u4e00-\u9fff]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim();
}

function tooSimilar(a, b) {
  const left = normalized(a);
  const right = normalized(b);
  if (!left || !right) return false;
  if (left === right) return true;
  const prefixLength = Math.min(90, left.length, right.length);
  return prefixLength >= 48 && left.slice(0, prefixLength) === right.slice(0, prefixLength);
}

function parseDate(raw = {}) {
  const direct = raw.published_at ? new Date(raw.published_at) : null;
  if (direct && !Number.isNaN(direct.getTime())) return direct;
  const url = String(raw.canonical_url || raw.original_url || "");
  const urlMatch = url.match(/\/(20\d{2})\/(\d{1,2})\/(\d{1,2})(?:\/|$)/u);
  if (urlMatch) return new Date(Date.UTC(Number(urlMatch[1]), Number(urlMatch[2]) - 1, Number(urlMatch[3])));
  const text = String(raw.full_text || raw.clean_text || "").slice(0, 4000);
  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})(?:T|\b)/u);
  if (iso) return new Date(Date.UTC(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3])));
  const named = text.match(/\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(20\d{2})\b/iu);
  if (!named) return null;
  const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].indexOf(named[1].toLowerCase());
  return new Date(Date.UTC(Number(named[3]), month, Number(named[2])));
}

function cardFiles() {
  const files = [];
  for (const dir of ["case", "funding", "product-service"]) {
    const target = path.join(cardRoot, dir);
    if (!fs.existsSync(target)) continue;
    for (const name of fs.readdirSync(target)) {
      if (name.startsWith(`${date}--signal--`) && name.endsWith(".md")) files.push(path.join(target, name));
    }
  }
  return files;
}

const problems = [];
const files = cardFiles();
if (!files.length) problems.push(`no formal Signal Cards generated for ${date}`);
for (const file of files) {
  const markdown = fs.readFileSync(file, "utf8");
  const relative = path.relative(root, file).replace(/\\/gu, "/");
  const title = scalar(markdown, "title");
  const sourceTitle = scalar(markdown, "source_title");
  const signalType = scalar(markdown, "signal_type");
  const extractionQuality = scalar(markdown, "extraction_quality");
  const hasFullText = scalar(markdown, "has_full_text");
  const evidenceStrength = scalar(markdown, "evidence_strength");
  const rawJsonRel = scalar(markdown, "raw_json");
  const details = ["新闻事实", "原文要点", "价值描述", "可见原文片段"].map((heading) => ({ heading, value: section(markdown, heading) }));

  if (!details.every((item) => item.value)) problems.push(`${relative}: missing public detail field`);
  for (let i = 0; i < details.length; i += 1) {
    for (let j = i + 1; j < details.length; j += 1) {
      if (tooSimilar(details[i].value, details[j].value)) problems.push(`${relative}: duplicate ${details[i].heading}/${details[j].heading}`);
    }
  }
  if (tooSimilar(title, details[0].value)) problems.push(`${relative}: news fact repeats title`);
  if (hasFullText !== "true" || extractionQuality === "failed" || evidenceStrength === "traceable_summary") {
    problems.push(`${relative}: formal Card lacks readable source body`);
  }

  let raw = {};
  if (rawJsonRel) {
    try {
      raw = JSON.parse(fs.readFileSync(path.resolve(root, rawJsonRel), "utf8"));
    } catch {
      problems.push(`${relative}: invalid or missing raw_json`);
    }
  }
  const published = parseDate(raw);
  if (!published) problems.push(`${relative}: missing source publication date`);
  else {
    const runDate = new Date(`${date}T12:00:00Z`);
    const sourceText = `${sourceTitle} ${String(raw.full_text || raw.clean_text || "").slice(0, 4000)}`;
    const productAction = /\b(unveils?|launches?|introduces?|announces?|released?|general availability|available now|shuts? down|discontinues?|kills?)\b|发布|推出|上线|正式可用|关停|下线|并入/iu.test(sourceText);
    const maxDays = signalType === "funding" ? 30 : productAction ? 14 : 30;
    const ageDays = (runDate.getTime() - published.getTime()) / 86400000;
    if (ageDays > maxDays) problems.push(`${relative}: stale source (${ageDays.toFixed(1)} days > ${maxDays})`);
  }
  if (/ycombinator\.com\/companies\//iu.test(String(raw.original_url || "")) && !published) problems.push(`${relative}: undated company profile`);
  if (/\b(staffer maps out|employee explains?|which .{0,80} fits)\b|员工详解|适用场景/iu.test(sourceTitle)) problems.push(`${relative}: explainer is not a commercial event`);
}

const result = { ok: problems.length === 0, date, card_count: files.length, problems };
console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
