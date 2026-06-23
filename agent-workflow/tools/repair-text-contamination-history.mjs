#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RAW_ROOT = path.join(ROOT, "01-SiteV2", "content", "01-raw", "originals");
const POOL_ROOT = path.join(ROOT, "01-SiteV2", "content", "02-pool");
const WRITE = process.argv.includes("--write=true") || process.argv.includes("--write");
const REPAIRED_AT = new Date().toISOString();

const BINARY_MARKERS = [
  /%PDF-\d/i,
  /\bendobj\b/i,
  /\bxref\b/i,
  /\bstartxref\b/i,
  /\bstream\b[\s\S]{0,200}\bJFIF\b/i,
  /\bstream\b[\s\S]{0,200}\bExif\b/i,
  /\bstream\b[\s\S]{0,200}Photoshop 3\.0/i,
  /\bstream\s+[xX]\u009c/,
];

const MOJIBAKE_MARKERS = [
  /浼佷笟/,
  /鍙戝竷/,
  /鏅鸿兘/,
  /妯″瀷/,
  /鐢熸垚/,
  /æ[\u0080-\u00bf]/,
  /å[\u0080-\u00bf]/,
  /ã[\u0080-\u00bf]/,
  /Ã[\u0080-\u00bf]/,
];

function walkFiles(dir, extensions, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, extensions, out);
    } else if (extensions.has(path.extname(entry.name).toLowerCase())) {
      out.push(fullPath);
    }
  }
  return out;
}

function contaminationDiagnostics(text) {
  const source = String(text || "");
  const binaryMarkers = BINARY_MARKERS.filter((pattern) => pattern.test(source)).map((pattern) => pattern.source);
  const mojibakeMarkers = MOJIBAKE_MARKERS.filter((pattern) => pattern.test(source)).map((pattern) => pattern.source);
  const replacementCount = (source.match(/\uFFFD/g) || []).length;
  const replacementRatio = source.length ? replacementCount / source.length : 0;
  const controlCount = (source.match(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g) || []).length;
  const strong =
    binaryMarkers.length > 0 ||
    controlCount >= 3 ||
    replacementCount >= 8 ||
    (replacementCount >= 3 && replacementRatio > 0.003) ||
    mojibakeMarkers.length > 0;

  return {
    contaminated: strong,
    binaryMarkers,
    mojibakeMarkers,
    replacementCount,
    replacementRatio: Number(replacementRatio.toFixed(5)),
    controlCount,
  };
}

function sha256(text) {
  return crypto.createHash("sha256").update(String(text || ""), "utf8").digest("hex");
}

function safeSummaryFromRaw(record) {
  const parts = [
    record?.title,
    record?.source_name,
    record?.discovery_record?.discovery_summary,
    record?.summary,
    record?.description,
  ]
    .map((part) => String(part || "").trim())
    .filter(Boolean);
  return [...new Set(parts)].join("\n\n").slice(0, 2000);
}

function appendUnique(list, value) {
  const next = Array.isArray(list) ? [...list] : [];
  if (!next.includes(value)) next.push(value);
  return next;
}

function repairRawJson(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let record;
  try {
    record = JSON.parse(original);
  } catch {
    return null;
  }

  const fields = [
    record.full_text,
    record.clean_text,
    record.readable_text,
    record.text,
    record.markdown_snapshot,
    Array.isArray(record.key_excerpts) ? JSON.stringify(record.key_excerpts) : "",
    record.evidence_seed ? JSON.stringify(record.evidence_seed) : "",
  ].join("\n\n");
  const diagnostics = contaminationDiagnostics(fields);
  if (!diagnostics.contaminated) return null;

  const safeText = safeSummaryFromRaw(record);
  const safeSnapshot = [
    `# ${record?.title || path.basename(filePath, ".json")}`,
    "",
    "This historical raw snapshot was quarantined because its extracted text contained binary or mojibake contamination and must not be used as evidence.",
    "",
    record?.original_url || record?.canonical_url ? `Source URL: ${record.original_url || record.canonical_url}` : "",
  ]
    .filter((line, index, lines) => line || lines[index - 1] !== "")
    .join("\n");

  const repaired = {
    ...record,
    full_text: safeText,
    clean_text: safeText,
    readable_text: safeText,
    extraction_quality: "failed",
    extraction_method: "binary_or_mojibake_repaired",
    readability_score: 0,
    has_full_text: false,
    content_length: safeText.length,
    fetch_status: "historical-text-contamination-repaired",
    raw_qc_decision: "block",
    raw_qc_downstream_use: "blocked_historical_text_contamination",
    degradation_reasons: appendUnique(record.degradation_reasons, "historical_text_contamination_repaired"),
    key_excerpts: [],
    evidence_seed: {},
    markdown_snapshot: `${safeSnapshot}\n`,
    text_contamination_repair: {
      repaired_at: REPAIRED_AT,
      reason: "historical binary/mojibake text was previously admitted as readable evidence",
      original_full_text_hash: sha256(record.full_text || ""),
      repair_strategy: "quarantine_full_text_use_discovery_summary",
      original_url: record.original_url || record.canonical_url || "",
      diagnostics,
    },
  };

  const next = `${JSON.stringify(repaired, null, 2)}\n`;
  return { filePath, changed: next !== original, next, diagnostics };
}

function repairRawMarkdown(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const diagnostics = contaminationDiagnostics(original);
  if (!diagnostics.contaminated) return null;

  const title = (original.match(/^#\s+(.+)$/m) || [])[1] || path.basename(filePath, ".md");
  const sourceUrl =
    (original.match(/^original_url:\s*(.+)$/m) || [])[1] ||
    (original.match(/^canonical_url:\s*(.+)$/m) || [])[1] ||
    "";
  const next = [
    "---",
    "raw_qc_decision: block",
    "raw_qc_downstream_use: blocked_historical_text_contamination",
    "extraction_quality: failed",
    "extraction_method: binary_or_mojibake_repaired",
    "has_full_text: false",
    "readability_score: 0",
    "degradation_reasons: [historical_text_contamination_repaired]",
    `text_contamination_repaired_at: ${REPAIRED_AT}`,
    "---",
    "",
    `# ${title}`,
    "",
    "This historical raw snapshot was quarantined because its extracted text contained binary or mojibake contamination and must not be used as evidence.",
    "",
    sourceUrl ? `Source URL: ${sourceUrl}` : "",
    "",
  ]
    .filter((line, index, lines) => line || lines[index - 1] !== "")
    .join("\n");

  const normalized = `${next.trimEnd()}\n`;
  return { filePath, changed: normalized !== original, next: normalized, diagnostics };
}

function replaceOrAppendLine(block, key, value) {
  const pattern = new RegExp(`^(\\s*-\\s*)?${key}:.*$`, "m");
  if (pattern.test(block)) return block.replace(pattern, `$1${key}: ${value}`);
  const lines = block.split(/\r?\n/);
  const insertAt = lines.findIndex((line) => /^source_id:/.test(line));
  if (insertAt >= 0) {
    lines.splice(insertAt + 1, 0, `${key}: ${value}`);
  } else {
    lines.splice(1, 0, `${key}: ${value}`);
  }
  return lines.join("\n");
}

function sanitizePoolBlock(block) {
  let next = block;
  next = replaceOrAppendLine(next, "pool_routes", "watchlist");
  next = replaceOrAppendLine(next, "raw_qc_decision", "block");
  next = replaceOrAppendLine(next, "raw_qc_downstream_use", "blocked_historical_text_contamination");
  next = replaceOrAppendLine(next, "extraction_quality", "failed");
  next = replaceOrAppendLine(next, "has_full_text", "false");
  next = replaceOrAppendLine(next, "readability_score", "0");
  next = replaceOrAppendLine(next, "key_excerpts", "[]");
  next = replaceOrAppendLine(next, "evidence_seed", "{}");
  next = next.replace(
    /^\s*-\s*key_excerpts:[\s\S]*?(?=^\s*-\s*missing_information:|^##\s+)/m,
    "- key_excerpts: []\n- evidence_seed: {}\n"
  );
  next = replaceOrAppendLine(next, "degradation_reasons", "[historical_text_contamination_repaired]");
  next = replaceOrAppendLine(next, "text_contamination_repair", `historical_text_contamination_repaired_at_${REPAIRED_AT}`);
  return next;
}

function repairPoolMarkdown(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  const fileDiagnostics = contaminationDiagnostics(original);
  if (!fileDiagnostics.contaminated) return null;

  const lines = original.split(/\r?\n/);
  const blocks = [];
  let current = [];
  for (const line of lines) {
    if (/^##\s+/.test(line) && current.length) {
      blocks.push(current.join("\n"));
      current = [line];
    } else {
      current.push(line);
    }
  }
  if (current.length) blocks.push(current.join("\n"));

  let contaminatedBlocks = 0;
  const repairedBlocks = blocks.map((block) => {
    if (!/^##\s+/m.test(block)) return block;
    const diagnostics = contaminationDiagnostics(block);
    if (!diagnostics.contaminated) return block;
    contaminatedBlocks += 1;
    return sanitizePoolBlock(block);
  });

  if (contaminatedBlocks === 0) return null;
  const next = `${repairedBlocks.join("\n").replace(/\n+$/, "")}\n`;
  return { filePath, changed: next !== original, next, diagnostics: fileDiagnostics, contaminatedBlocks };
}

function main() {
  const repairs = [];
  for (const filePath of walkFiles(RAW_ROOT, new Set([".json"]))) {
    const repair = repairRawJson(filePath);
    if (repair?.changed) repairs.push({ type: "raw_json", ...repair });
  }
  for (const filePath of walkFiles(RAW_ROOT, new Set([".md"]))) {
    const repair = repairRawMarkdown(filePath);
    if (repair?.changed) repairs.push({ type: "raw_md", ...repair });
  }
  for (const filePath of walkFiles(POOL_ROOT, new Set([".md"]))) {
    const repair = repairPoolMarkdown(filePath);
    if (repair?.changed) repairs.push({ type: "pool_md", ...repair });
  }

  if (WRITE) {
    for (const repair of repairs) {
      fs.writeFileSync(repair.filePath, repair.next, "utf8");
    }
  }

  const summary = {
    ok: true,
    mode: WRITE ? "write" : "dry-run",
    repaired_files: repairs.length,
    pool_blocks_repaired: repairs.reduce((sum, repair) => sum + (repair.contaminatedBlocks || 0), 0),
    files: repairs.map((repair) => ({
      type: repair.type,
      path: path.relative(ROOT, repair.filePath).replaceAll(path.sep, "/"),
      binary_markers: repair.diagnostics.binaryMarkers.length,
      mojibake_markers: repair.diagnostics.mojibakeMarkers.length,
      replacement_count: repair.diagnostics.replacementCount,
      control_count: repair.diagnostics.controlCount,
      contaminated_blocks: repair.contaminatedBlocks || undefined,
    })),
  };
  console.log(JSON.stringify(summary, null, 2));
}

main();
