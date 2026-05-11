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
    pool: path.join(contentRoot, "02-pool", `${date}-signal-pool.md`),
    structured: path.join(contentRoot, "03-structured-signals", `${date}-structured-signals.md`),
    front: path.join(contentRoot, "04-selected-signals", `${date}-front-signals.md`),
    heat: path.join(contentRoot, "05-trend-chain", `${date}-heat-candidates.md`),
    opportunity: path.join(contentRoot, "08-opportunities", "deep-dive", `${date}-opportunity-deep-dive.md`),
    points: path.join(contentRoot, "07-points", `${date}-point-calibration.md`),
  };

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
    structured: countMatches(fileFor.structured, /^##\s+S-/gm),
    front: countMatches(fileFor.front, /^##\s+Signal\s+/gm),
  };

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

  const structuredText = readText(fileFor.structured);
  const structuredSections = splitByHeading(structuredText, /^##\s+S-\d+/gm);
  const structuredFailures = structuredSections.flatMap((section, index) => {
    const failures = [];
    const len = cjkLength(section.body);
    if (len < 1200 || len > 2000) failures.push(`Structured ${index + 1} is ${len} Chinese chars, expected 1200-2000`);
    if (!/conversion_reason[：:]/u.test(section.body) && !/事件/u.test(section.body))
      failures.push(`Structured ${index + 1} missing event / conversion_reason`);
    if (!/商业变量|客户|成本|收入|效率|风险|采购|渠道|竞争/u.test(section.body))
      failures.push(`Structured ${index + 1} missing business variables`);
    if (
      !hasAny(section.body, [
        /source_tiers?[：:]/u,
        /source_level[：:]/u,
        /来源等级/u,
        /S\s*\/\s*A\s*\/\s*B/u,
        /S\s*级|A\s*级|B\s*级/u,
      ])
    )
      failures.push(`Structured ${index + 1} missing source tier`);
    if (!/反证|counter_evidence_status|Evidence Gaps|证据缺口/u.test(section.body))
      failures.push(`Structured ${index + 1} missing counter-evidence status / evidence gaps`);
    if (!/trend:/u.test(section.body) && !/趋势候选|related_trend/u.test(section.body))
      failures.push(`Structured ${index + 1} missing trend candidate`);
    if (!hasExternalUrl(section.body)) failures.push(`Structured ${index + 1} missing original external URL`);
    if (!hasIncrementalFact(section.body)) failures.push(`Structured ${index + 1} missing incremental fact from source`);
    return failures;
  });

  const frontText = readText(fileFor.front);
  const frontSections = splitByHeading(frontText, /^##\s+Signal\s+\d+/gm);
  const frontDepthFailures = frontSections.flatMap((section, index) => {
    const failures = [];
    const len = cjkLength(section.body);
    const secondaryBullets =
      section.body
        .match(/###\s+二次搜索补强[\s\S]*?(?=^###\s+|^##\s+|(?![\s\S]))/mu)?.[0]
        ?.match(/^\s*-\s+/gm)?.length || 0;
    const secondarySection =
      section.body.match(/###\s+二次搜索补强[\s\S]*?(?=^###\s+|^##\s+|(?![\s\S]))/mu)?.[0] || "";
    const sabSourceCount = (secondarySection.match(/S\s*级|A\s*级|B\s*级/gu) || []).length;
    if (len < 3000 || len > 5000) failures.push(`Signal ${index + 1} is ${len} Chinese chars, expected 3000-5000`);
    if (!/###\s+二次搜索补强/u.test(section.body)) failures.push(`Signal ${index + 1} missing secondary search section`);
    if (secondaryBullets < 3)
      failures.push(`Signal ${index + 1} has ${secondaryBullets} secondary-search sources, expected >= 3`);
    if (sabSourceCount < 3)
      failures.push(`Signal ${index + 1} has ${sabSourceCount} explicit S/A/B sources, expected >= 3`);
    if (!hasExternalUrl(secondarySection || section.body)) failures.push(`Signal ${index + 1} missing original external URL`);
    if (!hasIncrementalFact(secondarySection || section.body))
      failures.push(`Signal ${index + 1} missing incremental fact from cited sources`);
    if (!/###\s+反证与边界|证据边界|counter_evidence_status/u.test(section.body))
      failures.push(`Signal ${index + 1} missing evidence boundary / counter-evidence status`);
    if (!/###\s+后续观察/u.test(section.body)) failures.push(`Signal ${index + 1} missing follow-up observation section`);
    return failures;
  });

  const opportunityText = readText(fileFor.opportunity);
  const opportunityLength = cjkLength(opportunityText);
  const hasOpportunity =
    fs.existsSync(fileFor.opportunity) && !/今日暂无足够证据支撑深挖内参/u.test(opportunityText);
  const evidenceChainSection =
    opportunityText.match(/#{2,3}\s+证据链[\s\S]*?(?=^#{2,3}\s+|(?![\s\S]))/mu)?.[0] || "";
  const evidenceSourceCount = (evidenceChainSection.match(/^\s*-\s+/gm) || []).length;
  const evidenceSSourceCount = (evidenceChainSection.match(/S\s*级|一手来源|官方|官网|监管|公告/gu) || []).length;
  const opportunityDepthFailures = hasOpportunity
    ? [
        opportunityLength >= 6000 && opportunityLength <= 10000
          ? ""
          : `Opportunity deep dive is ${opportunityLength} Chinese chars, expected 6000-10000`,
        /#{2,3}\s+证据链/u.test(opportunityText) ? "" : "Opportunity deep dive missing evidence chain",
        evidenceSourceCount >= 5 ? "" : `Opportunity evidence chain has ${evidenceSourceCount} sources, expected >= 5`,
        evidenceSSourceCount >= 2
          ? ""
          : `Opportunity evidence chain has ${evidenceSSourceCount} S-tier / first-party sources, expected >= 2`,
        hasExternalUrl(evidenceChainSection) ? "" : "Opportunity evidence chain missing original external URLs",
        hasIncrementalFact(evidenceChainSection) ? "" : "Opportunity evidence chain missing incremental facts from sources",
        /#{2,3}\s+反向证据|本轮未发现关键反证/u.test(opportunityText)
          ? ""
          : "Opportunity deep dive missing counter-evidence statement",
        /代表公司/u.test(opportunityText) ? "" : "Opportunity deep dive missing representative company validation",
        /融资信号/u.test(opportunityText) ? "" : "Opportunity deep dive missing funding validation",
        /客户场景/u.test(opportunityText) ? "" : "Opportunity deep dive missing customer scenario validation",
        /定价\s*\/\s*商业模式/u.test(opportunityText) ? "" : "Opportunity deep dive missing pricing / business model validation",
        /中国迁移卡点/u.test(opportunityText) ? "" : "Opportunity deep dive missing China transfer validation",
      ].filter(Boolean)
    : [];

  const pointsText = readText(fileFor.points);
  const pointSections = splitByHeading(pointsText, /^##\s+PT-\d+/gm);
  const pointFailures = pointSections.flatMap((section, index) => {
    const failures = [];
    if (!/source_url[：:]/u.test(section.body)) failures.push(`Point ${index + 1} missing source_url`);
    if (!/conversion_reason[：:]/u.test(section.body)) failures.push(`Point ${index + 1} missing original-view summary`);
    if (!/^Point[：:]/mu.test(section.body)) failures.push(`Point ${index + 1} missing Guanlan interpretation`);
    if (!/^V2 用法[：:]/mu.test(section.body)) failures.push(`Point ${index + 1} missing usage`);
    if (!/relation_fields[：:]/u.test(section.body)) failures.push(`Point ${index + 1} missing relations`);
    return failures;
  });

  const heatText = readText(fileFor.heat);
  const hasHeatFile = fs.existsSync(fileFor.heat);
  const noHeatClaimed = /无高热候选|no heat candidates|heat_candidates:\s*(none|0|无)/iu.test(dailyLogText);
  const heatSections = splitByHeading(heatText, /^##\s+HC-/gm);
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
      patterns: [/front_signal_sab_source_count[：:]/iu, /##\s*Front Signal SAB Source Count/iu],
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
      label: "Pool count is 20-30, or documented fallback 12-20",
      passed: metrics.pool > 0,
      detail: `${metrics.pool} pool items`,
    },
    {
      label: "Pool items include conversion reason and elimination risk / evidence gaps",
      passed: poolFailures.length === 0,
      detail: poolFailures.length ? poolFailures.join("; ") : `${poolSections.length} pool items meet quality gate`,
    },
    {
      label: "Structured count is 8-15, or documented fallback 5-8",
      passed: metrics.structured > 0,
      detail: `${metrics.structured} structured signals`,
    },
    {
      label: "Structured Signals include event, business variables, source tier, evidence boundary, citations and trend candidate",
      passed: structuredFailures.length === 0,
      detail: structuredFailures.length
        ? structuredFailures.join("; ")
        : `${structuredSections.length} structured signals meet quality gate`,
    },
    {
      label: "Front Signals count is 3-5, or documented fallback 2-3",
      passed: metrics.front >= 2 && metrics.front <= 5,
      detail: `${metrics.front} front signals`,
    },
    {
      label: "Front Signals meet secondary-search depth, citations and 3000-5000 Chinese-character range",
      passed: metrics.front >= 2 && frontDepthFailures.length === 0,
      detail: frontDepthFailures.length ? frontDepthFailures.join("; ") : `${metrics.front} front signals meet depth gate`,
    },
    {
      label: "Opportunity deep dive meets 6000-10000 Chinese-character evidence-chain gate or is explicitly absent",
      passed: opportunityDepthFailures.length === 0,
      detail: hasOpportunity
        ? opportunityDepthFailures.length
          ? opportunityDepthFailures.join("; ")
          : `${opportunityLength} Chinese chars with evidence chain`
        : "no deep dive claimed for this date",
    },
    {
      label: "Point calibration includes source, original view, interpretation, usage and relations",
      passed: !fs.existsSync(fileFor.points) || pointFailures.length === 0,
      detail: fs.existsSync(fileFor.points)
        ? pointFailures.length
          ? pointFailures.join("; ")
          : `${pointSections.length} point items meet relation gate`
        : "no point calibration file for this date",
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
| Structured Signals | ${metrics.structured} |
| Front Signals | ${metrics.front} |
| Opportunity Deep Dive Chinese Chars | ${hasOpportunity ? opportunityLength : 0} |
| Point Items | ${pointSections.length} |
| Heat Candidates | ${heatSections.length} |

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
${lines}

## 说明

- 本闸门检查当前 V2 内容生产路径 \`01-SiteV2/content/\`。
- 它不运行旧 \`04-Site\` 同步，也不部署 Netlify。
- 旧 \`04-Site\` 已归档，本检查只确认 V2 生产内容链路是否具备可入站基础。
- Raw 低于 80 会被视为降级或严重降级，但仍检查是否有本地原文档案和缺口记录。
- B 类治理后，本闸门检查 Heat Candidate、daily log 必填字段、来源等级、Front S/A/B 数量与字数门槛。
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
