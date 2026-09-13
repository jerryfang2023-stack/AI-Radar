import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { sourceTextHash } from "./deepseek-translation-client.mjs";
import { documentKey, mergeDocumentLinks } from "../../01-SiteV2/site/scripts/community-document-links.mjs";
import { loadPrivateEvidenceRecord } from "./lib/private-evidence-store.mjs";

const root = process.cwd();
const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
}

const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const reportsDir = path.resolve(root, args.get("reports-dir") || path.join("agent-workflow", "reports"));
const sourceRef = args.get("source-ref") || "";
let sourceCommit = "";

function readSnapshot() {
  if (!sourceRef) return readJson(dataFile);
  if (!/^[A-Za-z0-9][A-Za-z0-9._/-]*$/u.test(sourceRef)) throw new Error("Invalid community source ref");
  const git = (values) => {
    const result = spawnSync("git", values, { cwd: root, encoding: "utf8", windowsHide: true, timeout: 30_000, maxBuffer: 32 * 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error(`Cannot read community source ref: ${result.stderr || result.error?.message || sourceRef}`);
    return result.stdout.trim();
  };
  sourceCommit = git(["rev-parse", "--verify", `${sourceRef}^{commit}`]);
  return JSON.parse(git(["show", `${sourceCommit}:01-SiteV2/site/data/community-intelligence.json`]));
}

function beijingDate(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function needsChineseTranslation(value = "") {
  const text = String(value || "").trim();
  const chinese = (text.match(/[\u3400-\u9fff]/gu) || []).length;
  const latinWords = (text.match(/\b[A-Za-z][A-Za-z'-]{1,}\b/gu) || []).length;
  return text.length >= 12 && chinese < 4 && latinWords >= 3;
}

function translationProblems(items = []) {
  const problems = [];
  for (const item of items) {
    const translatedFields = ["title", "summary", "excerpt"].filter((field) => item[`${field}Original`]);
    const stillEnglish = ["title", "summary", "excerpt"].filter((field) => needsChineseTranslation(item[field]));
    if (stillEnglish.length) problems.push(`${item.id}:untranslated:${stillEnglish.join(",")}`);
    if (!translatedFields.length) continue;
    const source = translatedFields.map((field) => `${field}:\n${item[`${field}Original`]}`).join("\n\n");
    if (item.translationStatus !== "translated") problems.push(`${item.id}:translation_status`);
    if (item.translationProvider !== "deepseek" || item.translationMethod !== "deepseek_translation") problems.push(`${item.id}:translation_provider`);
    if (!item.translationModel) problems.push(`${item.id}:translation_model`);
    if (item.translationSourceHash !== sourceTextHash(source)) problems.push(`${item.id}:translation_source_hash`);
  }
  return problems;
}

function writeReport(date, status, checks, details) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const lines = [
    `# Community Intelligence Data Gate - ${date}`,
    "",
    `- status: ${status}`,
    `- generated_at: ${new Date().toISOString()}`,
    `- data_file: ${path.relative(root, dataFile).replace(/\\/g, "/")}`,
    `- source_ref: ${sourceRef || "working-tree"}`,
    `- source_commit: ${sourceCommit || "not-applicable"}`,
    `- items: ${details.itemsCount}`,
    `- links: ${details.linksCount}`,
    `- selected_keywords: ${details.selectedKeywordsCount}`,
    `- data_generated_at: ${details.generatedAt || ""}`,
    "",
    "## Checks",
    "",
    ...checks.map((check) => `- ${check.ok ? "passed" : "failed"}: ${check.label}${check.detail ? ` - ${check.detail}` : ""}`),
    "",
  ];
  const reportFile = path.join(reportsDir, `${date}-community-intelligence-gate.md`);
  const latestFile = path.join(reportsDir, "community-intelligence-gate-latest.md");
  const body = `${lines.join("\n")}\n`;
  fs.writeFileSync(reportFile, body, "utf8");
  fs.writeFileSync(latestFile, body, "utf8");
  return reportFile;
}

function main() {
  const date = argValue("date", beijingDate());
  const minItems = Number.parseInt(argValue("min-items", "12"), 10);
  const minLinks = Number.parseInt(argValue("min-links", "3"), 10);
  const privateEvidenceMode = argValue("private-evidence", "read");
  if (!["read", "references"].includes(privateEvidenceMode)) throw new Error("Invalid private evidence validation mode");
  const checks = [];

  const add = (ok, label, detail = "") => checks.push({ ok, label, detail });

  let payload;
  let snapshotError = "";
  try { payload = readSnapshot(); } catch (error) { snapshotError = error.message; }
  add(Boolean(payload), "community intelligence data exists", snapshotError);
  if (!payload) {
    const reportFile = writeReport(date, "failed", checks, {
      itemsCount: 0,
      linksCount: 0,
      selectedKeywordsCount: 0,
      generatedAt: "",
    });
    console.error(`Community intelligence data missing. Report: ${path.relative(root, reportFile)}`);
    process.exit(1);
  }

  const generatedAt = payload?.meta?.generatedAt || "";
  const generatedDate = beijingDate(generatedAt);
  const items = Array.isArray(payload.items) ? payload.items : [];
  const links = Array.isArray(payload.links) ? payload.links : [];
  const selectedKeywords = Array.isArray(payload?.meta?.selectedKeywords) ? payload.meta.selectedKeywords : [];
  const errors = Array.isArray(payload?.meta?.errors) ? payload.meta.errors : [];
  const errorDetails = errors.map((error) => {
    if (typeof error === "string") return error;
    return [
      error?.source,
      error?.mode,
      error?.keyword,
      error?.message,
    ].filter(Boolean).join(" / ");
  }).join("; ");

  add(Boolean(generatedAt), "meta.generatedAt is present");
  add(generatedDate === date, "generatedAt matches Asia/Shanghai date", `actual=${generatedDate || "invalid"}`);
  add(items.length >= minItems, "items meet minimum", `${items.length}/${minItems}`);
  add(links.length >= minLinks, "deduped links meet minimum", `${links.length}/${minLinks}`);
  add(selectedKeywords.length > 0, "selected keyword rotation is recorded", String(selectedKeywords.length));
  add(errors.length === 0, "collector recorded no blocking errors", errorDetails);
  if (payload.meta?.scysAcquisition === "mcp") {
    const indexKeys = new Set(links.map((link) => documentKey(link.href)));
    const missingResources = items.flatMap((item) => mergeDocumentLinks(item.links || [])
      .filter((link) => !indexKeys.has(documentKey(link.href))).map(() => item.id));
    add(missingResources.length === 0, "every document resource remains in the independent link index", missingResources.join(","));
    const unarchived = items.filter((item) => {
      if (item.acquisition !== "scys-mcp") return false;
      if (!/^evidence:\/\/[a-f0-9]{64}$/.test(item.bodyRef || "")) return true;
      if (privateEvidenceMode === "references") return false;
      try { return !loadPrivateEvidenceRecord(root, item.bodyRef)?.body; } catch { return true; }
    });
    add(unarchived.length === 0, privateEvidenceMode === "read" ? "MCP originals are readable in the local private evidence store" : "MCP private evidence locators are valid (bodies verified locally)", unarchived.map((item) => item.id).join(","));
    add(items.every((item) => (item.relatedResources || []).every((resource) => resource.association === "keyword_match")),
      "related resources remain search associations, not factual relationships");
  }
  const translationErrors = translationProblems(items);
  add(translationErrors.length === 0, "English community content is translated with current-source DeepSeek provenance", translationErrors.slice(0, 10).join("; "));

  const failed = checks.filter((check) => !check.ok);
  const status = failed.length ? "failed" : "passed";
  const reportFile = writeReport(date, status, checks, {
    itemsCount: items.length,
    linksCount: links.length,
    selectedKeywordsCount: selectedKeywords.length,
    generatedAt,
  });

  console.log(JSON.stringify({
    ok: failed.length === 0,
    status,
    report: path.relative(root, reportFile).replace(/\\/g, "/"),
    items: items.length,
    links: links.length,
    generatedAt,
  }, null, 2));

  if (failed.length) process.exit(1);
}

main();
