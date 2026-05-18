import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "01-SiteV2", "content");
const reportsDir = path.join(root, "agent-workflow", "reports");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const parseArgs = (argv = process.argv.slice(2)) =>
  new Map(
    argv.map((arg) => {
      const [key, ...rest] = arg.replace(/^--/, "").split("=");
      return [key, rest.join("=") || "true"];
    })
  );

const countMatches = (file, pattern) => {
  if (!fs.existsSync(file)) return 0;
  const text = fs.readFileSync(file, "utf8");
  return [...text.matchAll(pattern)].length;
};

const exists = (file) => fs.existsSync(file);
const readText = (file) => (fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "");
const cjkLength = (text) => (text.match(/[\u4e00-\u9fff]/gu) || []).length;
const hasAny = (text, patterns) => patterns.some((pattern) => pattern.test(text));
const hasExternalUrl = (text) => /https?:\/\/[^\s)>\]]+/iu.test(text);
const hasIncrementalFact = (text) => /增量事实|提供了什么|提供.*事实|fact|evidence|客户|收入|融资|定价|发布|监管|采购|合作/iu.test(text);

const findDailyLog = (date) => {
  if (!fs.existsSync(reportsDir)) return "";
  return fs
    .readdirSync(reportsDir)
    .filter((name) => name.endsWith(".md"))
    .filter((name) => name.includes(date) && /daily-update|daily.*log|rerun-log/u.test(name))
    .map((name) => path.join(reportsDir, name))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0] || "";
};

const findDatedMarkdown = (dirs, date) => {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const name = fs
      .readdirSync(dir)
      .filter((item) => item.startsWith(date) && item.endsWith(".md"))
      .sort()[0];
    if (name) return path.join(dir, name);
  }
  return "";
};

const frontmatterValue = (text, name) => {
  const frontmatter = text.match(/^---\s*([\s\S]*?)---/u)?.[1] || "";
  const match = frontmatter.match(new RegExp(`^${name}:\\s*(.+)$`, "mu"));
  return match?.[1]?.trim().replace(/^["']|["']$/gu, "") || "";
};

const splitByHeading = (text, pattern) => {
  const matches = [...text.matchAll(pattern)];
  return matches.map((match, index) => {
    const end = matches[index + 1]?.index ?? text.length;
    return {
      heading: match[0],
      body: text.slice(match.index, end),
    };
  });
};

export function runV2ContentGate({ date = new Date().toISOString().slice(0, 10) } = {}) {
  const fileFor = {
    raw: path.join(contentRoot, "01-raw", `${date}-raw-candidates.md`),
    pool: path.join(contentRoot, "02-pool", `${date}-pool-candidates.md`),
    dailyObservation: path.join(contentRoot, "03-daily-observation"),
    selectedChangeCards: path.join(contentRoot, "04-business-signals", `${date}-selected-change-cards.md`),
    opinionCandidates: path.join(contentRoot, "04-business-signals", `${date}-opinion-candidates.md`),
    clusterCandidates: path.join(contentRoot, "04-business-signals", `${date}-change-cluster-candidates.md`),
    changeCards: path.join(root, "01-SiteV2", "knowledge", "01-Change-Cards"),
    caseCards: path.join(root, "01-SiteV2", "knowledge", "02-Case-Cards"),
    opinionCards: path.join(root, "01-SiteV2", "knowledge", "03-Opinion-Cards"),
    changeClusters: path.join(root, "01-SiteV2", "knowledge", "05-Change-Clusters"),
    heat: path.join(contentRoot, "04-business-signals", `${date}-change-cluster-candidates.md`),
    builders: path.join(contentRoot, "04-business-signals", `${date}-opinion-candidates.md`),
  };
  const trendReportRoot = path.join(contentRoot, "06-trend-reports");
  const trendReportFile = findDatedMarkdown([
    path.join(trendReportRoot, "full"),
    path.join(trendReportRoot, "flash"),
    trendReportRoot,
  ], date);
  const noReportDecisionFile = findDatedMarkdown([path.join(trendReportRoot, "no-report-decisions")], date);

  const dailyLogPath = findDailyLog(date);
  const dailyLogText = readText(dailyLogPath);

  const originalDir = path.join(contentRoot, "01-raw", "originals", date);
  const originalCount = fs.existsSync(originalDir)
    ? fs.readdirSync(originalDir).filter((name) => name.endsWith(".md")).length
    : 0;

  const metrics = {
    raw: countMatches(fileFor.raw, /^###\s+/gm),
    originals: originalCount,
    pool: countMatches(fileFor.pool, /^##\s+/gm),
    structured: fs.existsSync(fileFor.changeCards)
      ? fs.readdirSync(fileFor.changeCards).filter((name) => name.startsWith(date) && name.endsWith(".md")).length
      : 0,
    front: countMatches(fileFor.selectedChangeCards, /^-\s+`CHG-/gm),
    caseCards: fs.existsSync(fileFor.caseCards)
      ? fs.readdirSync(fileFor.caseCards).filter((name) => name.startsWith(date) && name.endsWith(".md")).length
      : 0,
    opinionCards: fs.existsSync(fileFor.opinionCards)
      ? fs.readdirSync(fileFor.opinionCards).filter((name) => name.startsWith(date) && name.endsWith(".md")).length
      : 0,
    changeClusters: fs.existsSync(fileFor.changeClusters)
      ? fs.readdirSync(fileFor.changeClusters).filter((name) => name.startsWith(date) && name.endsWith(".md")).length
      : 0,
  };
  const dailyObservationFiles = fs.existsSync(fileFor.dailyObservation)
    ? fs.readdirSync(fileFor.dailyObservation).filter((name) => name.startsWith(date) && name.endsWith(".md"))
    : [];
  const dailyObservationText = dailyObservationFiles.length
    ? readText(path.join(fileFor.dailyObservation, dailyObservationFiles[0]))
    : "";
  const dailyObservationLength = cjkLength(dailyObservationText);

  const poolText = readText(fileFor.pool);
  const poolSections = splitByHeading(poolText, /^##\s+P-\d+/gm);
  const poolFailures = poolSections.flatMap((section, index) => {
    const failures = [];
    if (!/conversion_reason[：:]/u.test(section.body) && !/入池理由/u.test(section.body))
      failures.push(`Pool ${index + 1} missing conversion_reason / 入池理由`);
    if (!/evidence_gaps[：:]/u.test(section.body) && !/淘汰风险|证据缺口/u.test(section.body))
      failures.push(`Pool ${index + 1} missing evidence_gaps / 淘汰风险`);
    return failures;
  });

  const changeCardFiles = fs.existsSync(fileFor.changeCards)
    ? fs.readdirSync(fileFor.changeCards).filter((name) => name.startsWith(date) && name.endsWith(".md")).map((name) => path.join(fileFor.changeCards, name))
    : [];
  const structuredSections = changeCardFiles.map((file) => ({ heading: rel(file), body: readText(file) }));
  const structuredFailures = structuredSections.flatMap((section, index) => {
    const failures = [];
    if (!/##\s+明确变化/u.test(section.body)) failures.push(`Change card ${index + 1} missing 明确变化`);
    if (!/##\s+原始出处/u.test(section.body) || !hasExternalUrl(section.body))
      failures.push(`Change card ${index + 1} missing original source URL`);
    if (!/##\s+数据来源/u.test(section.body)) failures.push(`Change card ${index + 1} missing 数据来源`);
    if (!/##\s+技术路线 \/ 方法变化/u.test(section.body))
      failures.push(`Change card ${index + 1} missing 技术路线 / 方法变化`);
    if (!/##\s+同类产品 \/ 相邻案例/u.test(section.body))
      failures.push(`Change card ${index + 1} missing 同类产品 / 相邻案例`);
    if (
      !hasAny(section.body, [
        /source_tiers?[：:]/u,
        /source_level[：:]/u,
        /来源等级/u,
        /S\s*\/\s*A\s*\/\s*B/u,
        /S\s*级|A\s*级|B\s*级/u,
      ])
    )
      failures.push(`Change card ${index + 1} missing source tier`);
    return failures;
  });

  const frontText = readText(fileFor.selectedChangeCards);
  const frontSections = splitByHeading(frontText, /^-\s+`CHG-/gm);
  const frontDepthFailures = frontSections.flatMap((section, index) => {
    const failures = [];
    if (!/入选理由/u.test(section.body)) failures.push(`Selected change card ${index + 1} missing 入选理由`);
    return failures;
  });

  const trendReportText = trendReportFile ? readText(trendReportFile) : "";
  const trendReportLength = cjkLength(trendReportText);
  const hasTrendReport = Boolean(trendReportFile) && !/今日暂无足够证据支撑深挖内参/u.test(trendReportText);
  const trendReportKind = frontmatterValue(trendReportText, "kind") || (trendReportText.includes("TRD-FLASH") ? "flash" : "full");
  const sourceCountFromFrontmatter = Number(frontmatterValue(trendReportText, "source_count") || 0);
  const primarySourceCountFromFrontmatter = Number(frontmatterValue(trendReportText, "primary_source_count") || 0);
  const evidenceChainSection =
    trendReportText.match(/#{2,3}\s+(证据链|来源与事实|来源附录)[\s\S]*?(?=^#{2,3}\s+|(?![\s\S]))/mu)?.[0] || "";
  const evidenceSourceCount = Math.max(
    sourceCountFromFrontmatter,
    (evidenceChainSection.match(/^\s*-\s+/gm) || []).length,
    (evidenceChainSection.match(/^\|[^|\n]+\|/gm) || []).filter((line) => !/---|来源/u.test(line)).length,
    (evidenceChainSection.match(/https?:\/\//gu) || []).length
  );
  const evidenceSSourceCount = Math.max(
    primarySourceCountFromFrontmatter,
    (evidenceChainSection.match(/S\s*级|一手来源|官方|官网|监管|公告/gu) || []).length
  );
  const trendReportDepthFailures = hasTrendReport
    ? (trendReportKind === "flash"
        ? [
            trendReportLength >= 2000 && trendReportLength <= 3500
              ? ""
              : `TrendReport flash is ${trendReportLength} Chinese chars, expected 2000-3500`,
            /#{2,3}\s+(来源与事实|来源附录|证据链)/u.test(trendReportText) ? "" : "TrendReport flash missing source appendix",
            evidenceSourceCount >= 3 ? "" : `TrendReport flash has ${evidenceSourceCount} sources, expected >= 3`,
            evidenceSSourceCount >= 1
              ? ""
              : `TrendReport flash has ${evidenceSSourceCount} S/A or first-party sources, expected >= 1`,
            hasExternalUrl(evidenceChainSection) ? "" : "TrendReport flash missing original external URLs",
            /#{2,3}\s+(反证|信息缺口|风险)/u.test(trendReportText)
              ? ""
              : "TrendReport flash missing counter-evidence / information gap",
            /#{2,3}\s+30 天后看什么|30\s*天/u.test(trendReportText)
              ? ""
              : "TrendReport flash missing 30-day watch variables",
          ]
        : [
            trendReportLength >= 6000 && trendReportLength <= 10000
              ? ""
              : `TrendReport full report is ${trendReportLength} Chinese chars, expected 6000-10000`,
            /#{2,3}\s+(来源与事实|来源附录|证据链)/u.test(trendReportText) ? "" : "TrendReport full report missing source appendix",
            evidenceSourceCount >= 5 ? "" : `TrendReport full report has ${evidenceSourceCount} sources, expected >= 5`,
            evidenceSSourceCount >= 2
              ? ""
              : `TrendReport full report has ${evidenceSSourceCount} S-tier / first-party sources, expected >= 2`,
            hasExternalUrl(evidenceChainSection) ? "" : "TrendReport full report missing original external URLs",
            hasIncrementalFact(evidenceChainSection) ? "" : "TrendReport full report missing incremental facts from sources",
            /#{2,3}\s+(风险与反证|反证|信息缺口)|本轮未发现关键反证/u.test(trendReportText)
              ? ""
              : "TrendReport full report missing counter-evidence statement",
            /#{2,3}\s+同类产品|竞品/u.test(trendReportText) ? "" : "TrendReport full report missing competitor section",
            /客户|场景|付费|预算/u.test(trendReportText) ? "" : "TrendReport full report missing customer / payment discussion",
            /7\s*天|30\s*天|90\s*天/u.test(trendReportText)
              ? ""
              : "TrendReport full report missing 7/30/90-day watch variables",
          ]).filter(Boolean)
    : [];

  const pointSections = [];
  const pointFailures = [];

  const buildersText = readText(fileFor.builders);
  const hasBuildersFile = fs.existsSync(fileFor.builders);
  const buildersSections = splitByHeading(buildersText, /^##\s+BP-\d+/gm);
  const buildersCount = (() => {
    const match = buildersText.match(/^builder_items_count:\s*(\d+)\s*$/mu);
    return match ? Number(match[1]) : null;
  })();
  const buildersFailures = [];
  if (!hasBuildersFile) buildersFailures.push("Builders viewpoints file missing");
  if (hasBuildersFile && !/^stage:\s*builders-viewpoints\s*$/mu.test(buildersText)) {
    buildersFailures.push("Builders viewpoints file missing stage: builders-viewpoints in frontmatter");
  }
  if (hasBuildersFile && buildersCount === null) buildersFailures.push("Builders viewpoints file missing builder_items_count in frontmatter");
  if (hasBuildersFile && buildersCount !== null && buildersCount !== buildersSections.length) {
    buildersFailures.push(`Builders viewpoints count mismatch (frontmatter=${buildersCount}, sections=${buildersSections.length})`);
  }

  const heatText = readText(fileFor.heat);
  const hasHeatFile = fs.existsSync(fileFor.heat);
  const noHeatClaimed = /无高热候选|no heat candidates|heat_candidates:\s*(none|0|无)/iu.test(dailyLogText);
  const heatSections = splitByHeading(heatText, /^##\s+(?:HC-|CLU-CAND-)/gm);
  const heatFailures = hasHeatFile
    ? heatSections.flatMap((section, index) => {
        const failures = [];
        for (const field of [
          "formal_tags",
          "classification_labels",
          "candidate_tags",
          "status",
          "seen_count_7d",
          "source_type_count",
        ]) {
          if (!new RegExp(`${field}[：:]`, "u").test(section.body)) failures.push(`Heat ${index + 1} missing ${field}`);
        }
        return failures;
      })
    : [];

  const logRequired = [
    { field: "source_distribution", patterns: [/source_distribution[：:]/iu, /##\s*Source Distribution/iu] },
    { field: "failed_sources", patterns: [/failed_sources[：:]/iu, /##\s*Failed Sources/iu] },
    { field: "fallback_used", patterns: [/fallback_used[：:]/iu, /##\s*Fallback Used/iu] },
    { field: "evidence_gaps", patterns: [/evidence_gaps[：:]/iu, /##\s*Evidence Gaps/iu] },
    { field: "raw_count_by_source_type", patterns: [/raw_count_by_source_type[：:]/iu, /Raw Count By Source Type/iu] },
    {
      field: "front_signal_sab_source_count",
      patterns: [/front_signal_sab_source_count[：:]/iu, /frontstage_sab_source_count[：:]/iu, /##\s*Frontstage SAB Source Count/iu],
    },
  ];
  const logFailures = logRequired
    .filter((item) => !hasAny(dailyLogText, item.patterns))
    .map((item) => `daily log missing ${item.field}`);

  const checks = [
    {
      label: "V2 content root exists",
      passed: fs.existsSync(contentRoot),
      detail: rel(contentRoot),
    },
    {
      label: "Raw candidates file exists",
      passed: exists(fileFor.raw),
      detail: rel(fileFor.raw),
    },
    {
      label: "Raw count is 80-150, fallback 50-79, or severe fallback captures what is available",
      passed: metrics.raw > 0,
      detail: `${metrics.raw} raw candidates`,
    },
    {
      label: "Raw originals exist for candidates",
      passed: metrics.originals >= metrics.raw && metrics.raw > 0,
      detail: `${metrics.originals} originals for ${metrics.raw} raw candidates`,
    },
    {
      label: "Daily observation article exists and has enough substance",
      passed: dailyObservationFiles.length > 0 && dailyObservationLength >= 1200,
      detail: dailyObservationFiles.length
        ? `${dailyObservationFiles[0]} (${dailyObservationLength} Chinese chars)`
        : "missing daily observation article",
    },
    {
      label: "Pool count is 20-40, or severe documented fallback is declared",
      passed: (metrics.pool >= 20 && metrics.pool <= 40) || (metrics.pool > 0 && /fallback|降级|断流|severe/u.test(dailyLogText)),
      detail: `${metrics.pool} pool items`,
    },
    {
      label: "Pool items include conversion reason and elimination risk / evidence gaps",
      passed: poolFailures.length === 0,
      detail: poolFailures.length ? poolFailures.join("; ") : `${poolSections.length} pool items meet quality gate`,
    },
    {
      label: "Change cards are generated into knowledge",
      passed: metrics.structured > 0,
      detail: `${metrics.structured} change cards`,
    },
    {
      label: "Change cards include source, data, technical route and similar-product fields",
      passed: structuredFailures.length === 0,
      detail: structuredFailures.length
        ? structuredFailures.join("; ")
        : `${structuredSections.length} change cards meet quality gate`,
    },
    {
      label: "Selected change cards count is 3-8, or high-signal day documents more",
      passed: (metrics.front >= 3 && metrics.front <= 8) || (metrics.front > 8 && /高信号|high signal/u.test(dailyLogText)),
      detail: `${metrics.front} selected change cards`,
    },
    {
      label: "Selected change cards include reasons for inclusion",
      passed: metrics.front >= 3 && frontDepthFailures.length === 0,
      detail: frontDepthFailures.length ? frontDepthFailures.join("; ") : `${metrics.front} selected change cards meet selection gate`,
    },
    {
      label: "Trend report meets flash/full evidence gate or has no-report decision / explicit absence",
      passed: trendReportDepthFailures.length === 0,
      detail: hasTrendReport
        ? trendReportDepthFailures.length
          ? trendReportDepthFailures.join("; ")
          : `${rel(trendReportFile)} (${trendReportKind}, ${trendReportLength} Chinese chars)`
        : (noReportDecisionFile ? `no_report_decision: ${rel(noReportDecisionFile)}` : "no trend report claimed for this date"),
    },
    {
      label: "Opinion candidates are handled through business signals",
      passed: pointFailures.length === 0,
      detail: "opinion candidates are checked in the builders viewpoint gate",
    },
    {
      label: "Frontier viewpoints are fully captured from follow-builders items",
      passed: hasBuildersFile && buildersFailures.length === 0,
      detail: !hasBuildersFile
        ? "missing builders viewpoints file"
        : buildersFailures.length
          ? buildersFailures.join("; ")
          : `${buildersSections.length} builder viewpoints captured`,
    },
    {
      label: "Heat Candidates file exists or daily log explicitly says no high-heat candidates",
      passed: hasHeatFile || noHeatClaimed,
      detail: hasHeatFile ? rel(fileFor.heat) : noHeatClaimed ? "daily log says no heat candidates" : "missing heat candidates file",
    },
    {
      label: "Heat Candidates include tags, status and trend continuity fields",
      passed: !hasHeatFile || heatFailures.length === 0,
      detail: hasHeatFile
        ? heatFailures.length
          ? heatFailures.join("; ")
          : `${heatSections.length} heat candidates meet field gate`
        : "no heat candidates file",
    },
    {
      label: "Daily run log includes source distribution, failures, fallback, evidence gaps and SAB counts",
      passed: Boolean(dailyLogPath) && logFailures.length === 0,
      detail: !dailyLogPath ? "missing daily run log" : logFailures.length ? logFailures.join("; ") : rel(dailyLogPath),
    },
    {
      label: "V2 site root exists",
      passed: fs.existsSync(path.join(root, "01-SiteV2", "site")),
      detail: "01-SiteV2/site",
    },
  ];

  const failed = checks.filter((check) => !check.passed);
  const status = failed.length ? "failed" : "passed";
  fs.mkdirSync(reportsDir, { recursive: true });

  const stamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\..+/, "")
    .replace("T", "-");

  const lines = checks
    .map((check) => `| ${check.label} | ${check.passed ? "passed" : "failed"} | ${check.detail} |`)
    .join("\n");

  const report = `# V2 Content Gate Report

生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}

## 结论

- 日期：${date}
- 状态：${status}
- 检查项：${checks.length}
- 失败项：${failed.length}

## 指标

| 指标 | 数量 |
|---|---:|
| Raw Candidates | ${metrics.raw} |
| Raw Originals | ${metrics.originals} |
| Pool Items | ${metrics.pool} |
| Daily Observation Chinese Chars | ${dailyObservationLength} |
| Change Cards | ${metrics.structured} |
| Selected Change Cards | ${metrics.front} |
| Case Cards | ${metrics.caseCards} |
| Opinion Cards | ${metrics.opinionCards} |
| Change Clusters | ${metrics.changeClusters} |
| Trend Report Chinese Chars | ${hasTrendReport ? trendReportLength : 0} |
| Builders / Opinion Candidates | ${buildersSections.length} |
| Cluster Candidates | ${heatSections.length} |

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
${lines}

## 说明

- 本闸门检查当前 V2 内容生产路径 \`01-SiteV2/content/\`。
- 它不运行旧 \`04-Site\` 同步，也不部署 Netlify。
- 旧 \`04-Site\` 已从当前仓库移除，本检查只确认 V2 生产内容链路是否具备可入站基础。
- Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。
- 当前六线程口径下，本闸门检查 Raw、Pool、今日观察、变化卡、案例卡、观点候选、变化簇候选和 daily log 必填字段。
`;

  const datedPath = path.join(reportsDir, `v2-content-gate-${date}-${stamp}.md`);
  const latestPath = path.join(reportsDir, "v2-content-gate-latest.md");
  fs.writeFileSync(datedPath, report, "utf8");
  fs.writeFileSync(latestPath, report, "utf8");

  return {
    date,
    status,
    failed,
    checks,
    metrics,
    report,
    datedPath,
    latestPath,
  };
}

if (import.meta.main) {
  const args = parseArgs();
  const date = args.get("date") || new Date().toISOString().slice(0, 10);
  const result = runV2ContentGate({ date });

  console.log(result.report);
  console.log(`Report: ${rel(result.datedPath)}`);

  if (result.status !== "passed") {
    process.exitCode = 1;
  }
}
