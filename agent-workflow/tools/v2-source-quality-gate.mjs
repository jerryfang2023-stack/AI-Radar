import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const registryPath = path.join(root, "01-SiteV2", "content", "09-databases", "source-registry-v2.json");
const reportsDir = path.join(root, "agent-workflow", "reports");

const rel = (file) => path.relative(root, file).replace(/\\/g, "/");

const requiredFields = [
  "source_id",
  "name",
  "source_level",
  "source_type",
  "interface_type",
  "endpoint_or_url",
  "auth_required",
  "rate_limit_note",
  "query_scope",
  "extraction_fields",
  "fallback_path",
  "evidence_role",
  "enabled_default",
  "risk_note",
];

const allowedLevels = new Set(["S", "A", "B", "C", "D", "M"]);
const allowedInterfaces = new Set([
  "official-api",
  "rss",
  "public-web",
  "search-only",
  "manual-review",
  "requires-key",
  "requires-consent",
  "blocked-or-deferred",
]);
const allowedEvidenceRoles = new Set([
  "fact-main",
  "fact-support",
  "lead-only",
  "point-only",
  "counter-evidence",
  "source-router",
]);

const checkSource = (source, index) => {
  const errors = [];
  for (const field of requiredFields) {
    if (!(field in source) || source[field] === "" || source[field] === null || source[field] === undefined) {
      errors.push(`source[${index}] missing ${field}`);
    }
  }
  if (!allowedLevels.has(source.source_level)) errors.push(`${source.source_id || index} has invalid source_level`);
  if (!allowedInterfaces.has(source.interface_type)) errors.push(`${source.source_id || index} has invalid interface_type`);
  if (!allowedEvidenceRoles.has(source.evidence_role)) errors.push(`${source.source_id || index} has invalid evidence_role`);
  if (source.enabled_default && !source.fallback_path) errors.push(`${source.source_id || index} enabled without fallback_path`);
  if ((source.interface_type === "requires-key" || source.interface_type === "requires-consent") && source.enabled_default) {
    errors.push(`${source.source_id || index} requires key/consent but is enabled by default`);
  }
  if (source.source_level === "C" && source.evidence_role === "fact-main") {
    errors.push(`${source.source_id || index} is C-level but marked fact-main`);
  }
  if (source.source_level === "M" && (source.evidence_role === "fact-main" || source.evidence_role === "fact-support")) {
    errors.push(`${source.source_id || index} is a mixed acquisition channel but marked as direct evidence`);
  }
  if (!Array.isArray(source.extraction_fields) || source.extraction_fields.length < 4) {
    errors.push(`${source.source_id || index} extraction_fields must list at least 4 fields`);
  }
  return errors;
};

export function runV2SourceQualityGate({ date = new Date().toISOString().slice(0, 10) } = {}) {
  const checks = [];
  const push = (label, passed, detail) => checks.push({ label, passed, detail });

  let registry = null;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, "utf8"));
    push("source-registry-v2.json parses", true, rel(registryPath));
  } catch (error) {
    push("source-registry-v2.json parses", false, error.message);
  }

  if (registry) {
    const sources = registry.sources || [];
    const ids = sources.map((source) => source.source_id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
    const sourceErrors = sources.flatMap(checkSource);
    const enabled = sources.filter((source) => source.enabled_default);
    const enabledTypes = new Set(enabled.map((source) => source.source_type));
    const enabledLevels = new Set(enabled.map((source) => source.source_level));
    const cMain = sources.filter((source) => source.source_level === "C" && source.evidence_role === "fact-main");
    const gated = sources.filter(
      (source) => source.interface_type === "requires-key" || source.interface_type === "requires-consent"
    );

    push("registry has sources", sources.length >= 12, `${sources.length} sources`);
    push("source_id values are unique", duplicateIds.length === 0, duplicateIds.join(", ") || "unique");
    push("required fields are complete", sourceErrors.length === 0, sourceErrors.join("; ") || "complete");
    push("enabled sources cover at least 4 source types", enabledTypes.size >= 4, `${enabledTypes.size} types`);
    push("enabled sources include S/A/B levels", ["S", "A", "B"].every((level) => enabledLevels.has(level)), [...enabledLevels].join(", "));
    push("C-level sources are never fact-main", cMain.length === 0, cMain.map((item) => item.source_id).join(", ") || "ok");
    push(
      "requires-key / requires-consent sources are disabled by default",
      gated.every((source) => !source.enabled_default),
      `${gated.length} gated sources`
    );
  }

  const failed = checks.filter((check) => !check.passed);
  const status = failed.length ? "failed" : "passed";
  fs.mkdirSync(reportsDir, { recursive: true });

  const report = `# V2 Source Quality Gate

生成时间：${new Date().toLocaleString("zh-CN", { hour12: false })}

## 结论

- 日期：${date}
- 状态：${status}
- 检查项：${checks.length}
- 失败项：${failed.length}

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
${checks.map((check) => `| ${check.label} | ${check.passed ? "passed" : "failed"} | ${check.detail || ""} |`).join("\n")}
`;

  const reportPath = path.join(reportsDir, `v2-source-quality-gate-${date}.md`);
  const latestPath = path.join(reportsDir, "v2-source-quality-gate-latest.md");
  fs.writeFileSync(reportPath, report, "utf8");
  fs.writeFileSync(latestPath, report, "utf8");
  return { status, checks, failed, reportPath, latestPath };
}

if (import.meta.main) {
  const argDate = process.argv.find((arg) => arg.startsWith("--date="))?.split("=")[1];
  const result = runV2SourceQualityGate({ date: argDate });
  console.log(result.status);
  console.log(`Report: ${rel(result.reportPath)}`);
  if (result.status !== "passed") process.exitCode = 1;
}
