import fs from "node:fs";
import path from "node:path";

export function buildRoutingSchema(template, cases) {
  const schema = structuredClone(template);
  schema.properties.results.minItems = cases.length;
  schema.properties.results.maxItems = cases.length;
  schema.properties.results.items.properties.id.enum = cases.map(({ id }) => id);
  return schema;
}

// Verify a source-bounded exact quotation, not merely the existence of any file.
// This is mechanical provenance validation; semantic support still needs review.
function validCitation(root, item, row) {
  if (typeof row?.evidence_path !== "string" || typeof row?.evidence_quote !== "string") return false;
  const relative = row.evidence_path.replaceAll("\\", "/");
  const allowed = relative === item.evalFile
    || relative === `agent-workflow/skills/${item.skill}/SKILL.md`;
  if (!allowed || !row.evidence_quote.trim()) return false;
  try {
    const sourceRoot = fs.realpathSync(root);
    const file = fs.realpathSync(path.resolve(root, relative));
    const resolved = path.relative(sourceRoot, file);
    if (path.isAbsolute(resolved) || resolved === ".." || resolved.startsWith(`..${path.sep}`)) return false;
    return fs.statSync(file).isFile()
      && fs.readFileSync(file, "utf8").replaceAll("\r\n", "\n")
        .includes(row.evidence_quote.replaceAll("\r\n", "\n"));
  } catch {
    return false;
  }
}

export function scoreRoutingOutput(payload, cases, root) {
  const rows = Array.isArray(payload?.results) ? payload.results : [];
  const known = new Set(cases.map(({ id }) => id));
  const grouped = new Map();
  const errors = [];
  if (!payload || Object.keys(payload).join() !== "results" || !Array.isArray(payload.results)) errors.push("invalid result envelope");
  if (rows.length !== cases.length) errors.push(`expected ${cases.length} results, found ${rows.length}`);
  for (const row of rows) {
    const id = row?.id;
    if (!known.has(id)) errors.push(`unknown case id: ${String(id)}`);
    if (!grouped.has(id)) grouped.set(id, []);
    grouped.get(id).push(row);
  }
  const duplicateIds = [...grouped].filter(([, values]) => values.length > 1).map(([id]) => id);
  if (duplicateIds.length) errors.push("duplicate case ids");
  const keys = ["decision", "evidence_path", "evidence_quote", "id", "rationale"];
  const details = cases.map((item) => {
    const matches = grouped.get(item.id) || [];
    const row = matches.length === 1 ? matches[0] : null;
    const valid = row && Object.keys(row).sort().join() === keys.join()
      && keys.every((key) => typeof row[key] === "string" && row[key].trim())
      && ["pass", "fail"].includes(row.decision);
    if (!valid) errors.push(`${item.id}: missing, duplicate or malformed result`);
    return {
      id: item.id,
      expected: item.expected,
      actual: row?.decision || "missing",
      decisionCorrect: Boolean(valid && row.decision === item.expected),
      evidencePath: typeof row?.evidence_path === "string" ? row.evidence_path : "",
      evidenceQuote: typeof row?.evidence_quote === "string" ? row.evidence_quote : "",
      evidenceValid: Boolean(valid && validCitation(root, item, row)),
      rationale: typeof row?.rationale === "string" ? row.rationale : "",
    };
  });
  const correct = details.filter((row) => row.decisionCorrect).length;
  const evidenceValid = details.filter((row) => row.evidenceValid).length;
  return {
    passed: errors.length === 0 && correct === cases.length && evidenceValid === cases.length,
    errors, returned: rows.length, unique: grouped.size, duplicateIds,
    correct, accuracy: cases.length ? correct / cases.length : 0,
    evidenceValid, evidenceRate: cases.length ? evidenceValid / cases.length : 0,
    score: correct + evidenceValid, maxScore: cases.length * 2, details,
  };
}
