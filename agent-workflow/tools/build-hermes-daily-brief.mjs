import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const reportsDir = path.join(root, "agent-workflow", "reports");

function argValue(name, fallback = "") {
  const prefix = `--${name}=`;
  const item = process.argv.slice(2).find((arg) => arg.startsWith(prefix));
  return item ? item.slice(prefix.length) : fallback;
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function exists(file) {
  return fs.existsSync(file);
}

function countFiles(dir, pattern) {
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.reduce((count, entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return count + countFiles(file, pattern);
    return count + (pattern.test(entry.name) ? 1 : 0);
  }, 0);
}

function countOpinionTimelineDetails(date) {
  const dir = path.join(root, "01-SiteV2", "knowledge", "02-Opinion-Timelines", "people");
  if (!fs.existsSync(dir)) return 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.reduce((count, entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return count + countOpinionTimelineDetailsInDir(file, date);
    return count;
  }, 0);
}

function countOpinionTimelineDetailsInDir(dir, date) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir, { withFileTypes: true }).reduce((count, entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return count + countOpinionTimelineDetailsInDir(file, date);
    if (!entry.name.endsWith(".md") || entry.name === "README.md") return count;
    const markdown = fs.readFileSync(file, "utf8");
    const matches = [...markdown.matchAll(new RegExp(`^###\\s+${date}\\b[\\s\\S]*?(?=^### |$(?![\\s\\S]))`, "gmu"))];
    return count + matches.filter((match) => /^#### 观点详情/mu.test(match[0])).length;
  }, 0);
}

function markdownItem(label, value) {
  const text = String(value || "").trim() || "-";
  return `- ${label}: ${text}`;
}

function outcome(name) {
  return argValue(name, "not_run");
}

function statusFromOutcomes(outcomes, skipped) {
  if (skipped === "true") return "skipped";
  return Object.values(outcomes).every((value) => value === "success" || value === "not_required")
    ? "passed"
    : "failed";
}

function main() {
  const date = argValue("date", new Date().toISOString().slice(0, 10));
  const runUrl = argValue("run-url");
  const prUrl = argValue("pr-url");
  const manualUrl = argValue("manual-url");
  const trigger = argValue("trigger");
  const skip = argValue("skip", "false");
  const skipReason = argValue("skip-reason");
  const pageUrl = argValue("page-url");
  const commitSha = argValue("commit-sha");

  const manifest = readJson(path.join(reportsDir, `${date}-persistent-asset-manifest.json`), {});
  const siteData = readJson(path.join(root, "01-SiteV2", "site", "data", "site-content.json"), {});
  const rawFile = path.join(root, "01-SiteV2", "content", "01-raw", `${date}-raw-candidates.md`);
  const poolFile = path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`);
  const signalsFile = path.join(root, "01-SiteV2", "content", "04-business-signals", "signals", `${date}-signals.md`);
  const opinionCandidatesFile = path.join(root, "01-SiteV2", "content", "05-frontier-opinions", `${date}-opinion-candidates.md`);

  const signalCards = countFiles(path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"), new RegExp(`^${date}--signal--.*\\.md$`, "u"));
  const opinionTimelineDetails = countOpinionTimelineDetails(date);

  const outcomes = {
    monitor: outcome("monitor"),
    monitor_readiness: outcome("monitor-readiness"),
    raw_pool_gate: outcome("raw-pool-gate"),
    asset_generation: outcome("asset-generation"),
    cardcopy_gate: outcome("cardcopy"),
    pool_to_card_dedupe_gate: outcome("pool-to-card-dedupe"),
    site_data_sync: outcome("site-data"),
    source_first_frontstage_gate: outcome("source-first-frontstage"),
    frontstage_regression_gate: outcome("frontstage-regression"),
    pre_commit_gate: outcome("pre-commit-gate"),
    commit: outcome("commit"),
    pr: outcome("pr"),
    auto_merge: outcome("auto-merge"),
  };

  const status = statusFromOutcomes(outcomes, skip);
  const dailyTitle = siteData?.daily?.title || siteData?.contentIndex?.dates?.find((item) => String(item.date || item.label || "").includes(date))?.title || "";
  const trendTitle = siteData?.trendReport?.title || "";
  const siteDate = siteData?.meta?.date || "";
  const summaryLines = [
    `观澜 AI｜${date} 日更 ${status === "passed" ? "完成" : status === "skipped" ? "跳过" : "异常"}`,
    markdownItem("触发方式", trigger),
    markdownItem("Raw", exists(rawFile) ? "present" : "missing"),
    markdownItem("Pool", exists(poolFile) ? "present" : "missing"),
    markdownItem("商业信号文件", exists(signalsFile) ? "present" : "missing"),
    markdownItem("观点候选文件", exists(opinionCandidatesFile) ? "present" : "missing"),
    markdownItem("商业信号卡", signalCards),
    markdownItem("观点时间线详情", opinionTimelineDetails),
    markdownItem("今日观察", dailyTitle || "未生成"),
    markdownItem("趋势状态", trendTitle ? `显示：${trendTitle}` : "暂无趋势展示"),
    markdownItem("站点数据日期", siteDate),
    markdownItem("跳过原因", skip === "true" ? skipReason : "无"),
    markdownItem("PR", prUrl || manualUrl || "无"),
    markdownItem("网站", pageUrl || "GitHub Pages 将在 main 更新后部署"),
    markdownItem("GitHub Run", runUrl),
    markdownItem("Commit", commitSha),
  ];

  const gateLines = Object.entries(outcomes).map(([key, value]) => markdownItem(key, value));
  const text = [
    summaryLines.join("\n"),
    "",
    "门禁与自动化状态",
    gateLines.join("\n"),
  ].join("\n");

  const result = {
    ok: status === "passed" || status === "skipped",
    status,
    date,
    generated_at: new Date().toISOString(),
    run_url: runUrl,
    pr_url: prUrl,
    manual_url: manualUrl,
    page_url: pageUrl,
    commit_sha: commitSha,
    manifest,
    counts: {
      signal_cards: signalCards,
      opinion_timeline_details: opinionTimelineDetails,
    },
    frontstage: {
      site_date: siteDate,
      daily_title: dailyTitle,
      trend_title: trendTitle,
    },
    outcomes,
    feishu_text: text,
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-hermes-daily-brief.json`);
  const mdPath = path.join(reportsDir, `${date}-hermes-daily-brief.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, `# Hermes Daily Brief｜${date}\n\n${text}\n`, "utf8");
  console.log(JSON.stringify({ ok: true, status, report: path.relative(root, jsonPath).replace(/\\/g, "/") }, null, 2));
}

main();
