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

function text(value) {
  return value == null ? "" : String(value).trim();
}

function list(value) {
  if (Array.isArray(value)) return value;
  if (value && typeof value === "object") return Object.values(value);
  return value ? [value] : [];
}

function materialRole(kind) {
  if (kind === "business_signal") return "fact_base";
  if (kind === "first_line_viewpoint") return "viewpoint_lead";
  if (kind === "community_intelligence") return "community_lead";
  return "supporting_material";
}

function materialPath(kind, id, date) {
  const suffix = id ? `#id=${id}` : "";
  if (kind === "business_signal") return `01-SiteV2/site/data/v3-data-observation-desk.json${suffix}`;
  if (kind === "first_line_viewpoint") return `01-SiteV2/site/data/follow-builders-daily.json${suffix}`;
  if (kind === "community_intelligence") return `01-SiteV2/site/data/community-intelligence-daily/${date}.json${suffix}`;
  return "";
}

function compactMaterial(item, index, date) {
  const kind = item.kind || "";
  return {
    materialId: item.materialId || `material-${index + 1}`,
    kind,
    id: item.id || "",
    role: item.role || materialRole(kind),
    title: item.title || "",
    source: item.source || "",
    url: item.url || "",
    note: item.note || "",
    localDataPath: item.localDataPath || materialPath(kind, item.id || "", date),
    verificationUse: item.verificationUse || (kind === "business_signal" ? "fact_base" : "lead_only_not_verified_fact"),
  };
}

function topicMaterials(topic, date) {
  if (list(topic.rawMaterials).length) {
    return list(topic.rawMaterials).map((item, index) => compactMaterial(item, index, date));
  }
  const grouped = [
    ...list(topic.sources?.businessSignals || topic.sourceInputs?.businessSignals),
    ...list(topic.sources?.firstLineViewpoints || topic.sourceInputs?.viewpoints),
    ...list(topic.sources?.communityIntelligence || topic.sourceInputs?.communityItems),
  ];
  return grouped.map((item, index) => compactMaterial(item, index, date));
}

function compactTopicFromTopicCenter(topic, index) {
  const date = topic.date || "";
  const rawMaterials = topicMaterials(topic, date);
  return {
    rank: topic.rank || index + 1,
    id: topic.id || "",
    score: Number(topic.score || 0),
    grade: topic.grade || "",
    sourceId: topic.sourceId || "",
    sourceName: topic.sourceName || "",
    priority: topic.priority || "",
    title: topic.spreadTitle || topic.title || "",
    core: topic.core || "",
    bossPain: topic.bossPain || "",
    moneyLine: topic.moneyLine || "",
    oldFrame: topic.oldFrame || "",
    newFrame: topic.newFrame || "",
    actionHint: topic.actionHint || "",
    evidenceBoundary: topic.evidenceBoundary || "",
    rawMaterialSummary: topic.rawMaterialSummary || {
      total: rawMaterials.length,
      businessSignals: rawMaterials.filter((item) => item.kind === "business_signal").length,
      firstLineViewpoints: rawMaterials.filter((item) => item.kind === "first_line_viewpoint").length,
      communityIntelligence: rawMaterials.filter((item) => item.kind === "community_intelligence").length,
    },
    rawMaterials,
    sources: topic.sources || {
      businessSignals: rawMaterials.filter((item) => item.kind === "business_signal"),
      firstLineViewpoints: rawMaterials.filter((item) => item.kind === "first_line_viewpoint"),
      communityIntelligence: rawMaterials.filter((item) => item.kind === "community_intelligence"),
    },
  };
}

function loadTopicCenter() {
  const hermesTable = readJson(path.join(root, "01-SiteV2", "site", "data", "topic-center-hermes.json"), null);
  if (hermesTable?.topics?.length) {
    return {
      meta: hermesTable.meta || {},
      topics: hermesTable.topics.map(compactTopicFromTopicCenter),
    };
  }

  const topicCenter = readJson(path.join(root, "01-SiteV2", "site", "data", "topic-center.json"), null);
  const topics = list(topicCenter?.topics).map(compactTopicFromTopicCenter);
  return {
    meta: {
      version: topicCenter?.meta?.version || "",
      date: topicCenter?.meta?.date || "",
      generatedAt: topicCenter?.meta?.generatedAt || "",
      source: "topic-center.json",
      rule: "hermes_all_topic_table_fallback",
      readMode: "all_topics",
      topicCount: topics.length,
      githubPath: "01-SiteV2/site/data/topic-center.json",
      pagesJsonPath: "/data/topic-center.json",
    },
    topics,
  };
}

function topicCenterLines(topicCenter) {
  const topics = list(topicCenter.topics);
  if (!topics.length) {
    return [
      "Boss Topic Center",
      "- topic_center: missing or empty",
    ];
  }
  const lines = [
    `Boss Topic Center ${topicCenter.meta?.date || ""}: ${topics.length} topics`,
    markdownItem("source", topicCenter.meta?.githubPath || "01-SiteV2/site/data/topic-center-hermes.json"),
    markdownItem("read_mode", topicCenter.meta?.readMode || "all_topics"),
  ];
  for (const topic of topics) {
    lines.push(
      "",
      `${topic.rank}. ${topic.title}`,
      `   type: ${topic.sourceName || "-"} | score: ${topic.score || "-"} | priority: ${topic.priority || "-"}`,
      `   boss_pain: ${topic.bossPain || "-"}`,
      `   money_line: ${topic.moneyLine || "-"}`,
      `   action: ${topic.actionHint || "-"}`,
    );
    const materials = list(topic.rawMaterials);
    if (materials.length) {
      lines.push(`   materials: ${materials.length}`);
      for (const material of materials) {
        const source = material.source ? ` | ${material.source}` : "";
        const url = material.url ? ` | ${material.url}` : "";
        const local = material.localDataPath ? ` | ${material.localDataPath}` : "";
        lines.push(`   - [${material.role || material.kind || "material"}] ${material.title || "-"}${source}${url}${local}`);
      }
    }
  }
  return lines;
}

function outcome(name) {
  return argValue(name, "not_run");
}

function isSuccess(value) {
  return value === "success" || value === "not_required" || value === "skipped";
}

function statusFromOutcomes(outcomes, businessSkipped) {
  const buildersPassed = isSuccess(outcomes.builders_data) && isSuccess(outcomes.builders_gate);
  const businessKeys = [
    "monitor",
    "monitor_readiness",
    "raw_pool_gate",
    "asset_generation",
    "pool_to_card_dedupe_gate",
    "site_data_sync",
    "source_first_frontstage_gate",
    "frontstage_regression_gate",
    "pre_commit_gate",
  ];
  const businessPassed = businessSkipped === "true" || businessKeys.every((key) => isSuccess(outcomes[key]));
  if (businessPassed && buildersPassed) return businessSkipped === "true" ? "business_skipped_builders_passed" : "passed";
  if (businessPassed || buildersPassed) return "partial";
  return "failed";
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
  const topicCenter = loadTopicCenter();

  const signalCards = countFiles(path.join(root, "01-SiteV2", "knowledge", "01-Signal-Cards"), new RegExp(`^${date}--signal--.*\\.md$`, "u"));
  const opinionTimelineDetails = countOpinionTimelineDetails(date);

  const outcomes = {
    monitor: outcome("monitor"),
    monitor_readiness: outcome("monitor-readiness"),
    raw_pool_gate: outcome("raw-pool-gate"),
    asset_generation: outcome("asset-generation"),
    pool_to_card_dedupe_gate: outcome("pool-to-card-dedupe"),
    builders_data: outcome("builders-data"),
    builders_gate: outcome("builders-gate"),
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
    `WaveSight daily run ${date}: ${status}`,
    markdownItem("trigger", trigger),
    markdownItem("business_signal_skip", skip === "true" ? skipReason || "true" : "false"),
    markdownItem("Raw", exists(rawFile) ? "present" : "missing"),
    markdownItem("Pool", exists(poolFile) ? "present" : "missing"),
    markdownItem("business_signals_file", exists(signalsFile) ? "present" : "missing"),
    markdownItem("opinion_candidates_file", exists(opinionCandidatesFile) ? "present" : "missing"),
    markdownItem("signal_cards", signalCards),
    markdownItem("opinion_timeline_details", opinionTimelineDetails),
    markdownItem("daily_title", dailyTitle || "not_generated"),
    markdownItem("trend_title", trendTitle || "none"),
    markdownItem("site_data_date", siteDate),
    markdownItem("PR", prUrl || manualUrl || "none"),
    markdownItem("site", pageUrl || "GitHub Pages deploys after main updates"),
    markdownItem("GitHub Run", runUrl),
    markdownItem("Commit", commitSha),
  ];

  const gateLines = Object.entries(outcomes).map(([key, value]) => markdownItem(key, value));
  const text = [
    summaryLines.join("\n"),
    "",
    topicCenterLines(topicCenter).join("\n"),
    "",
    "Gates and automation outcomes",
    gateLines.join("\n"),
  ].join("\n");

  const result = {
    ok: status === "passed" || status === "business_skipped_builders_passed",
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
    topic_center: topicCenter,
    outcomes,
    feishu_text: text,
  };

  fs.mkdirSync(reportsDir, { recursive: true });
  const jsonPath = path.join(reportsDir, `${date}-hermes-daily-brief.json`);
  const mdPath = path.join(reportsDir, `${date}-hermes-daily-brief.md`);
  fs.writeFileSync(jsonPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  fs.writeFileSync(mdPath, `# Hermes Daily Brief - ${date}\n\n${text}\n`, "utf8");
  console.log(JSON.stringify({ ok: true, status, report: path.relative(root, jsonPath).replace(/\\/g, "/") }, null, 2));
}

main();
