import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dataFile = path.join(root, "01-SiteV2", "site", "data", "community-intelligence.json");
const archiveRoot = path.join(root, "01-SiteV2", "content", "07-community-intelligence");
const reportsDir = path.join(root, "agent-workflow", "reports");

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
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

function exists(file) {
  return fs.existsSync(file);
}

function writeReport(date, status, checks, details) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const lines = [
    `# Community Intelligence Data Gate - ${date}`,
    "",
    `- status: ${status}`,
    `- generated_at: ${new Date().toISOString()}`,
    `- data_file: ${path.relative(root, dataFile).replace(/\\/g, "/")}`,
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
  const checks = [];

  const add = (ok, label, detail = "") => checks.push({ ok, label, detail });

  add(exists(dataFile), "community intelligence data exists");
  if (!exists(dataFile)) {
    const reportFile = writeReport(date, "failed", checks, {
      itemsCount: 0,
      linksCount: 0,
      selectedKeywordsCount: 0,
      generatedAt: "",
    });
    console.error(`Community intelligence data missing. Report: ${path.relative(root, reportFile)}`);
    process.exit(1);
  }

  const payload = readJson(dataFile);
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

  const dailyArchive = path.join(archiveRoot, "daily", `${date} Community Intelligence.md`);
  const indexFile = path.join(archiveRoot, "Community Intelligence Index.md");
  const viewFiles = [
    "Industry Cases.md",
    "Tool Tips.md",
    "Opportunities.md",
    "Resource Links.md",
  ].map((file) => path.join(archiveRoot, "views", file));

  add(exists(dailyArchive), "daily Obsidian archive exists", path.relative(root, dailyArchive).replace(/\\/g, "/"));
  add(exists(indexFile), "community intelligence index exists", path.relative(root, indexFile).replace(/\\/g, "/"));
  for (const file of viewFiles) {
    add(exists(file), `archive view exists: ${path.basename(file)}`, path.relative(root, file).replace(/\\/g, "/"));
  }

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
