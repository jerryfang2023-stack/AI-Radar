import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.replace(/^--/, "").split("=");
    return [key, rest.join("=") || "true"];
  })
);

const command = args.get("command") || args.get("mode") || "monitor";
const date = args.get("date") || new Date().toISOString().slice(0, 10);
const reportsDir = path.join(root, "agent-workflow", "reports");

function rel(file) {
  return path.relative(root, file).replace(/\\/g, "/");
}

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  return exists(file) ? fs.readFileSync(file, "utf8") : "";
}

function writeBlockedReport(kind, reasons, details = {}) {
  fs.mkdirSync(reportsDir, { recursive: true });
  const file = path.join(reportsDir, `${date}-${kind}-blocked.md`);
  const detailLines = Object.entries(details).map(([key, value]) => `- ${key}: ${value}`);
  const text = [
    `# ${date} ${kind} Blocked`,
    "",
    `- generated_at: ${new Date().toISOString()}`,
    "- status: blocked",
    "",
    "## Reasons",
    "",
    ...reasons.map((reason) => `- ${reason}`),
    "",
    "## Details",
    "",
    ...(detailLines.length ? detailLines : ["- none"]),
    "",
  ].join("\n");
  fs.writeFileSync(file, `${text}\n`, "utf8");
  return file;
}

function parseLineValue(text, key) {
  const pattern = new RegExp(`^-\\s*${key}:\\s*(.+)$`, "im");
  const match = text.match(pattern);
  return match ? match[1].trim() : "";
}

function parseNumberLine(text, key) {
  const value = parseLineValue(text, key);
  const numeric = Number(String(value).replace(/[^\d.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : null;
}

function parseResultStatus(text = "") {
  return (
    parseLineValue(text, "Result") ||
    parseLineValue(text, "result") ||
    parseLineValue(text, "status") ||
    ""
  )
    .trim()
    .toLowerCase();
}

function isNoGap(value = "") {
  return /^none$/iu.test(String(value).trim());
}

function monitorFiles() {
  return {
    raw: path.join(root, "01-SiteV2", "content", "01-raw", `${date}-raw-candidates.md`),
    rawOriginals: path.join(root, "01-SiteV2", "content", "01-raw", "originals", date),
    pool: path.join(root, "01-SiteV2", "content", "02-pool", `${date}-pool-candidates.md`),
    log: path.join(reportsDir, `${date}-guanlan-daily-monitor-log.md`),
    qualityGate: path.join(reportsDir, `${date}-guanlan-monitor-quality-gate.md`),
    qualityLoop: path.join(reportsDir, `${date}-guanlan-daily-monitor-quality-loop.md`),
    finalQc: path.join(reportsDir, `${date}-guanlan-daily-monitor-qc.md`),
  };
}

function parseFinalQcDecision(text = "") {
  const direct =
    parseLineValue(text, "Downstream decision") ||
    parseLineValue(text, "downstream_decision") ||
    parseLineValue(text, "decision");
  const normalized = String(direct || "").trim().toLowerCase();
  if (/allow_with_degradation/u.test(normalized)) return "allow_with_degradation";
  if (/^allow\b/u.test(normalized)) return "allow";
  if (/^block\b|blocked/u.test(normalized)) return "block";
  if (/\ballow_with_degradation\b/iu.test(text)) return "allow_with_degradation";
  if (/\bdownstream decision:\s*allow\b/iu.test(text)) return "allow";
  if (/\bdownstream decision:\s*block\b|\bblock:\s*downstream/iu.test(text)) return "block";
  return "";
}

function parseDownstreamPermission(text = "", label = "") {
  const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`^-\\s*${escapedLabel}:\\s*(.+)$`, "im");
  const match = text.match(pattern);
  return match ? match[1].trim().toLowerCase() : "";
}

function isAssetPermissionAllowed(permission = "") {
  if (!permission) return false;
  if (/\b(block|blocked|pause|paused|not allowed)\b|\u4e0d\u5f97|\u6682\u505c|\u963b\u65ad/iu.test(permission)) return false;
  return /\b(allow|allowed|may continue|continue)\b|\u5141\u8bb8|\u53ef\u7ee7\u7eed|\u653e\u884c/iu.test(permission);
}

function assertMonitorReady({ minScore = 80, requireFinalQc = false } = {}) {
  const files = monitorFiles();
  const reasons = [];
  for (const [key, file] of Object.entries(files)) {
    if (key === "finalQc" && !requireFinalQc) continue;
    if (!exists(file)) reasons.push(`missing ${key}: ${rel(file)}`);
  }

  const loopText = read(files.qualityLoop);
  const gateText = read(files.qualityGate);
  const finalQcText = read(files.finalQc);
  const logText = read(files.log);

  const loopStatus = parseLineValue(loopText, "status");
  const manualIntervention = parseLineValue(loopText, "manual_intervention_required");
  const gateStatus = parseLineValue(gateText, "status").toLowerCase();
  const importanceGaps = parseLineValue(gateText, "importance_coverage_gaps");
  const poolImportanceGaps = parseLineValue(gateText, "pool_importance_coverage_gaps");
  const usableCoreEvidenceCount = parseNumberLine(gateText, "usable_core_evidence_count");
  const score =
    parseNumberLine(gateText, "total_score") ??
    parseNumberLine(gateText, "score") ??
    parseNumberLine(loopText, "quality_score");
  const finalQcResult = parseResultStatus(finalQcText);
  const finalQcDecision = finalQcText ? parseFinalQcDecision(finalQcText) : "";
  const assetPermission = command === "assets" ? parseDownstreamPermission(finalQcText, "Asset chain") : "";

  const acceptedLoopStatuses = new Set(["passed", "passed_with_notes", "passed_after_manual_backfill"]);
  const acceptedFinalQcResults = new Set(["passed", "passed_with_notes", "passed_after_manual_backfill"]);
  const loopStatusAccepted = loopText && acceptedLoopStatuses.has(String(loopStatus).toLowerCase());
  const loopHasHistoricalBlock = loopText && (!loopStatusAccepted || /true/i.test(manualIntervention));
  const finalQcAllowsAssets =
    requireFinalQc &&
    ["allow", "allow_with_degradation"].includes(finalQcDecision) &&
    (command !== "assets" || isAssetPermissionAllowed(assetPermission));
  const finalQcResultAccepted = !finalQcText || acceptedFinalQcResults.has(finalQcResult);
  const gateAllowsRepair =
    gateStatus === "passed" &&
    (score === null || score >= minScore) &&
    isNoGap(importanceGaps) &&
    isNoGap(poolImportanceGaps) &&
    (usableCoreEvidenceCount === null || usableCoreEvidenceCount >= 5);
  const supersededByFinalQc =
    command === "assets" &&
    loopHasHistoricalBlock &&
    finalQcAllowsAssets &&
    finalQcResultAccepted &&
    gateAllowsRepair;

  if (loopText && !loopStatusAccepted && !supersededByFinalQc) reasons.push(`quality loop status is ${loopStatus || "unknown"}`);
  if (/true/i.test(manualIntervention) && !supersededByFinalQc) reasons.push("quality loop requires manual intervention");
  if (score !== null && score < minScore) reasons.push(`quality score ${score} below ${minScore}`);

  for (const key of ["source_distribution", "failed_sources", "fallback_used", "evidence_gaps"]) {
    if (logText && !logText.includes(key)) reasons.push(`monitor log missing ${key}`);
  }

  if (requireFinalQc) {
    if (!finalQcText) reasons.push(`missing final QC report: ${rel(files.finalQc)}`);
    else if (!["allow", "allow_with_degradation"].includes(finalQcDecision)) reasons.push(`final QC decision is ${finalQcDecision || "unknown"}`);
    else if (command === "assets" && finalQcDecision === "allow_with_degradation") {
      if (!assetPermission) {
        reasons.push("final QC is allow_with_degradation but Asset chain permission is missing");
      } else if (!isAssetPermissionAllowed(assetPermission)) {
        reasons.push(`final QC does not permit Asset chain under degradation: ${assetPermission}`);
      }
    }
  }

  return {
    ok: reasons.length === 0,
    reasons,
    files,
    status: loopStatus || "unknown",
    manualIntervention: manualIntervention || "unknown",
    score,
    finalQcDecision: finalQcDecision || "not_required",
    supersededByFinalQc,
    assetScope:
      command === "assets" && finalQcDecision === "allow_with_degradation"
        ? "eligible_core_pool_only"
        : command === "assets"
          ? "eligible_core_pool"
          : "not_applicable",
  };
}

function main() {
  const minScore = Number(args.get("min-score") || 80);
  const requireFinalQcArg = args.get("require-final-qc");
  const requireFinalQc =
    requireFinalQcArg === "true" || (requireFinalQcArg !== "false" && command === "assets");
  const result = assertMonitorReady({ minScore, requireFinalQc });
  const kind = command === "assets" ? "daily-assets-chain" : "daily-monitor-readiness";

  if (!result.ok) {
    const blockedReport = writeBlockedReport(kind, result.reasons, {
      date,
      quality_loop_status: result.status,
      manual_intervention_required: result.manualIntervention,
      quality_score: result.score ?? "unknown",
      final_qc_decision: result.finalQcDecision,
      superseded_by_final_qc: result.supersededByFinalQc,
      asset_scope: result.assetScope,
    });
    console.log(
      JSON.stringify(
        {
          ok: false,
          command,
          date,
          reasons: result.reasons,
          blocked_report: rel(blockedReport),
          final_qc_decision: result.finalQcDecision,
          superseded_by_final_qc: result.supersededByFinalQc,
          asset_scope: result.assetScope,
        },
        null,
        2
      )
    );
    process.exit(2);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        command,
        date,
        quality_loop_status: result.status,
        manual_intervention_required: result.manualIntervention,
        quality_score: result.score,
        final_qc_decision: result.finalQcDecision,
        superseded_by_final_qc: result.supersededByFinalQc,
        asset_scope: result.assetScope,
      },
      null,
      2
    )
  );
}

main();
