#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildSourceIntake,
  mergeSourceIntakes,
  readSourceIntake,
  sourceIntakePath,
} from "./lib/source-intake-v1.mjs";
import { resolveSourceTitleTranslation } from "./source-title-translation-generator.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const rawRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const translationFile = path.join(root, "01-SiteV2/content/11-databases/source-title-translations.json");
const defaultInput = path.join(root, "agent-workflow/reports/targeted-backfill-capture-2026-07-25.json");

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/gu)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/u);
    if (!match || process.env[match[1]]) continue;
    process.env[match[1]] = match[2].replace(/^['"]|['"]$/gu, "");
  }
}

function hash(value, length = 16) {
  return crypto.createHash("sha256").update(String(value || ""), "utf8").digest("hex").slice(0, length);
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function decodeHtmlEntities(text = "") {
  return String(text || "")
    .replace(/&nbsp;/giu, " ")
    .replace(/&amp;/giu, "&")
    .replace(/&lt;/giu, "<")
    .replace(/&gt;/giu, ">")
    .replace(/&quot;/giu, "\"")
    .replace(/&#39;|&#x27;/giu, "'")
    .replace(/&#(\d+);/gu, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/giu, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function normalizeText(text = "") {
  return decodeHtmlEntities(text)
    .replace(/\r/gu, "")
    .replace(/\u00a0/gu, " ")
    .replace(/[ \t]+/gu, " ")
    .replace(/\n[ \t]+/gu, "\n")
    .replace(/\n{3,}/gu, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 1)
    .join("\n")
    .trim();
}

function htmlToText(fragment = "") {
  return normalizeText(
    String(fragment || "")
      .replace(/<!--[\s\S]*?-->/gu, " ")
      .replace(/<(script|style|svg|noscript|form|iframe)\b[\s\S]*?<\/\1>/giu, " ")
      .replace(/<\/(h1|h2|h3|h4|p|li|blockquote|section|article|main|div|tr)>/giu, "\n")
      .replace(/<br\s*\/?>/giu, "\n")
      .replace(/<[^>]+>/gu, " "),
  );
}

function attrValue(tag = "", attr = "") {
  const pattern = new RegExp(`${attr}\\s*=\\s*([\"'])([\\s\\S]*?)\\1`, "iu");
  return decodeHtmlEntities(tag.match(pattern)?.[2] || "");
}

function jsonLdObjects(html = "") {
  const objects = [];
  for (const block of String(html).matchAll(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/giu)) {
    try {
      objects.push(JSON.parse(decodeHtmlEntities(block[1] || "").trim()));
    } catch {
      // Visible source text remains available when a publisher emits invalid JSON-LD.
    }
  }
  return objects;
}

function visitObjects(value, visitor) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => visitObjects(item, visitor));
    return;
  }
  if (typeof value !== "object") return;
  visitor(value);
  for (const child of Object.values(value)) {
    if (child && typeof child === "object") visitObjects(child, visitor);
  }
}

function sourceTitleFromHtml(html, fallback) {
  const candidates = [];
  jsonLdObjects(html).forEach((object) => visitObjects(object, (node) => {
    if (typeof node.headline === "string") candidates.push(node.headline);
  }));
  for (const match of String(html).matchAll(/<meta\b[^>]*>/giu)) {
    const tag = match[0];
    const key = `${attrValue(tag, "property")} ${attrValue(tag, "name")}`.toLowerCase();
    if (/(?:og:title|twitter:title)/u.test(key)) candidates.push(attrValue(tag, "content"));
  }
  candidates.push(htmlToText(String(html).match(/<h1\b[^>]*>[\s\S]*?<\/h1>/iu)?.[0] || ""));
  candidates.push(htmlToText(String(html).match(/<title\b[^>]*>[\s\S]*?<\/title>/iu)?.[0] || ""));
  return candidates.map((value) => normalizeText(value).replace(/\n/gu, " ")).find((value) => value.length >= 8 && value.length <= 260)
    || fallback;
}

function readableBody(html = "") {
  const candidates = [];
  jsonLdObjects(html).forEach((object) => visitObjects(object, (node) => {
    for (const field of ["articleBody", "text", "description"]) {
      if (typeof node[field] === "string" && node[field].length >= 300) {
        candidates.push({ method: `json-ld-${field}`, text: normalizeText(node[field]) });
      }
    }
  }));
  for (const match of String(html).matchAll(/<(article|main)\b[^>]*>[\s\S]*?<\/\1>/giu)) {
    candidates.push({ method: match[1].toLowerCase(), text: htmlToText(match[0]) });
  }
  const visible = htmlToText(html);
  if (visible) candidates.push({ method: "body-visible-text", text: visible });
  return candidates
    .filter((candidate) => candidate.text.length >= 400)
    .sort((a, b) => {
      const preferred = (value) => value.method.startsWith("json-ld") ? 2 : value.method === "article" ? 1 : 0;
      return preferred(b) - preferred(a) || b.text.length - a.text.length;
    })[0] || { method: "", text: "" };
}

async function fetchWithBrowser(url) {
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(2500);
    const visibleText = normalizeText(await page.locator("body").innerText().catch(() => ""));
    const html = visibleText.length >= 400
      ? `<main>${visibleText.replace(/&/gu, "&amp;").replace(/</gu, "&lt;").replace(/>/gu, "&gt;").replace(/\n/gu, "<br>")}</main>`
      : await page.content();
    return { html, status: 200, method: "playwright" };
  } finally {
    await browser.close();
  }
}

async function fetchSource(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "accept": "text/html,application/xhtml+xml",
        "accept-language": "en-US,en;q=0.8",
        "user-agent": "Mozilla/5.0 (compatible; WaveSightEvidenceBot/1.0; +https://github.com/jerryfang2023-stack/AI-Radar)",
      },
    });
    const html = await response.text();
    if (!response.ok || html.length < 800) return fetchWithBrowser(url);
    return { html, status: response.status, method: "http-fetch" };
  } catch {
    return fetchWithBrowser(url);
  } finally {
    clearTimeout(timer);
  }
}

function markdownSnapshot(source, title, titleZh, collectedAt, text) {
  return [
    `# ${title}`,
    "",
    `- 中文标题：${titleZh}`,
    `- 来源：${source.publisher}`,
    `- 原始链接：${source.url}`,
    `- 抓取时间：${collectedAt}`,
    `- 回填任务：${source.task_id}`,
    "",
    "## 原始正文",
    "",
    text,
    "",
  ].join("\n");
}

loadEnvFile(path.join(root, ".env"));
loadEnvFile(path.join(root, ".env.local"));

const input = path.resolve(root, arg("input", rel(defaultInput)));
const payload = JSON.parse(fs.readFileSync(input, "utf8").replace(/^\uFEFF/u, ""));
const collectedAt = arg("at", new Date().toISOString());
const requestedTasks = new Set(arg("task", "").split(",").map((value) => value.trim()).filter(Boolean));
const selectedSources = (payload.sources || []).filter((source) => !requestedTasks.size || requestedTasks.has(source.task_id));
const results = [];
const failures = [];
const capturedEntries = [];

for (const source of selectedSources) {
  try {
    const fetched = await fetchSource(source.url);
    const body = readableBody(fetched.html);
    if (!body.text) throw new Error("no_readable_original_body");
    const contentStart = source.content_start_needle ? body.text.indexOf(source.content_start_needle) : -1;
    if (source.content_start_needle && contentStart < 0) throw new Error(`content_start_missing:${source.content_start_needle}`);
    const capturedText = contentStart >= 0 ? body.text.slice(contentStart) : body.text;
    const missingNeedles = (source.expected_needles || []).filter((needle) => !capturedText.toLocaleLowerCase().includes(String(needle).toLocaleLowerCase()));
    if (missingNeedles.length) throw new Error(`source_verification_missing:${missingNeedles.join("|")}`);

    const capturedTitle = sourceTitleFromHtml(fetched.html, source.source_title);
    const sourceTitle = capturedTitle.length >= source.source_title.length * 0.65 ? capturedTitle : source.source_title;
    const translation = await resolveSourceTitleTranslation(sourceTitle, {
      translationFile,
      sourceUrl: source.url,
      provider: "deepseek",
      timeoutMs: 30000,
      allowNetwork: true,
    });
    if (!translation.titleZh) throw new Error("deepseek_title_translation_failed");

    const directory = path.join(rawRoot, source.batch_date);
    const stem = `targeted-backfill-${source.task_id.toLowerCase()}`;
    const jsonFile = path.join(directory, `${stem}.json`);
    const markdownFile = path.join(directory, `${stem}.md`);
    const contentHash = hash(capturedText, 64);
    const raw = {
      raw_id: `RAW-BF-${hash(`${source.task_id}|${source.url}`)}`,
      title: sourceTitle,
      title_zh: translation.titleZh,
      original_url: source.url,
      canonical_url: source.url,
      source_name: source.publisher,
      source_type: "article",
      source_level: source.source_level,
      source_role: "resolved_original_source",
      author: "",
      published_at: source.published_at || "",
      collected_at: collectedAt,
      last_seen_at: collectedAt,
      language: /[\u3400-\u9fff]/u.test(capturedText) ? "zh" : "en",
      full_text: capturedText,
      clean_text: capturedText,
      markdown_snapshot_path: rel(markdownFile),
      json_snapshot_path: rel(jsonFile),
      fetch_status: String(fetched.status),
      extraction_quality: capturedText.length >= 1000 ? "high" : "medium",
      extraction_method: `${fetched.method}:${body.method}`,
      content_hash: contentHash,
      full_text_hash: contentHash,
      raw_qc_decision: "pass",
      raw_qc_downstream_use: "canonical_extraction_candidate",
      acquisition_channel: "targeted-backfill",
      evidence_object_type: "supporting_article",
      evidence_object_usable: true,
      evidence_strength: source.source_level === "official" ? "original_source" : "source_class_a",
      has_full_text: true,
      origin_fetch_status: "fetched",
      source_registry_id: source.source_registry_id || "",
      source_region: source.source_region || "",
      market_region: source.market_region || "",
      china_market_match: source.china_market_match === true,
      china_market_match_basis: source.china_market_match_basis || "",
      targeted_backfill_task_id: source.task_id,
    };

    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(markdownFile, markdownSnapshot(source, sourceTitle, translation.titleZh, collectedAt, capturedText), "utf8");
    fs.writeFileSync(jsonFile, `${JSON.stringify(raw, null, 2)}\n`, "utf8");
    capturedEntries.push({
      date: source.batch_date,
      record: raw,
      jsonPath: jsonFile,
      markdownPath: markdownFile,
      pooled: true,
    });
    results.push({
      task_id: source.task_id,
      batch_date: source.batch_date,
      raw_id: raw.raw_id,
      title: sourceTitle,
      title_zh: translation.titleZh,
      content_hash: contentHash,
      text_length: capturedText.length,
      json_path: rel(jsonFile),
      markdown_path: rel(markdownFile),
    });
    console.log(JSON.stringify(results.at(-1)));
  } catch (error) {
    failures.push({ task_id: source.task_id, url: source.url, reason: error.message });
    console.error(JSON.stringify(failures.at(-1)));
  }
}

const mergedIntakes = [];
if (arg("merge-intake", "false") === "true") {
  const dates = [...new Set(capturedEntries.map((entry) => entry.date))];
  for (const date of dates) {
    const entries = capturedEntries.filter((entry) => entry.date === date);
    const supplemental = buildSourceIntake({ root, date, entries, generatedAt: collectedAt });
    const current = readSourceIntake(root, date);
    const merged = current ? mergeSourceIntakes(current.payload, supplemental) : supplemental;
    const intakeFile = sourceIntakePath(root, date);
    fs.mkdirSync(path.dirname(intakeFile), { recursive: true });
    fs.writeFileSync(intakeFile, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
    mergedIntakes.push({
      date,
      intake_file: rel(intakeFile),
      added_source_artifacts: supplemental.counts.source_artifacts,
      added_raw_documents: supplemental.counts.raw_documents,
      total_raw_documents: merged.counts.raw_documents,
    });
  }
}

console.log(JSON.stringify({
  ok: failures.length === 0,
  captured: results.length,
  failed: failures.length,
  merged_intakes: mergedIntakes,
  results,
  failures,
}, null, 2));
if (failures.length) process.exitCode = 2;
