#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const phase2Path = path.resolve(root, args.get("phase2") || "agent-workflow/reports/entity-catalog-deepseek-audit-phase2.json");
const secondaryPath = path.resolve(root, args.get("secondary") || "agent-workflow/reports/entity-catalog-secondary-search.json");
const outputPath = path.resolve(root, args.get("output") || "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json");
const reportPath = path.resolve(root, args.get("report") || "agent-workflow/reports/entity-catalog-review-closeout.md");
const reviewer = args.get("reviewer") || "codex-entity-review";
const write = args.get("write") === "true";

const explicitOverrides = new Map([
  ["EN-0d014547a90d8fea", {
    action: "confirm",
    canonical: { name: "Apptio", catalog_type: "company", company_names: [] },
    rationale: "Apptio 官方公司页明确将其称为技术支出与价值管理公司；显式复核后确认组织类型。",
    secondary_sources: [{
      source_id: "SRC-apptio-company-official",
      source_url: "https://www.apptio.com/company/",
      source_class: "official",
      quote: "We are the leading technology spend and value management company."
    }]
  }],
  ["EN-636fa9664f878a4d", {
    action: "confirm",
    canonical: { name: "LMSYS", catalog_type: "company", company_names: [] },
    rationale: "LMSYS 官方 About 页明确说明其为已注册的非营利组织；本目录的 company 类型包含机构，显式复核后确认。",
    secondary_sources: [{
      source_id: "SRC-lmsys-about-official",
      source_url: "https://www.lmsys.org/about/",
      source_class: "official",
      quote: "Large Model Systems (LMSYS Corp.) is a 501(c)(3) non-profit focused on incubating open-source projects and research."
    }]
  }],
  ["EN-ae0facccf0a3723a", {
    action: "correct",
    canonical: { name: "Soul", catalog_type: "product", company_names: [] },
    rationale: "现有 Claim 将 Soul 描述为交友应用/社交平台，不能作为发布其他产品的公司实体；显式复核后改为产品。"
  }],
  ["EN-50fbf46e6eff93e5", {
    action: "quarantine",
    canonical: { name: "Lean 4", catalog_type: "other", company_names: [] },
    rationale: "现有 Claim 中 Lean 4 是 Leanstral 1.5 面向的编程语言/证明助手，不是 Mistral AI 在该事件中发布的产品；显式复核后从产品索引隔离。"
  }],
  ["EN-33ea25778e18d372", {
    action: "correct",
    canonical: { name: "GenFlow", catalog_type: "product", company_names: ["Baidu"] },
    rationale: "现有 Claim 明确指向百度文库、网盘升级的 GenFlow；二次检索命中的同名海外站点不是本事件产品，显式复核后保留原名并绑定百度。"
  }],
  ["EN-a1b0d8a938903dc7", {
    action: "correct",
    canonical: { name: "Jetson Thor", catalog_type: "product", company_names: ["NVIDIA"] },
    rationale: "NVIDIA 官方发布事件的标题与 accepted Claims 共同证明 Jetson Thor 产品族由 NVIDIA 发布；显式复核后补齐归属。"
  }],
  ["EN-3969dd578ebf6c65", {
    action: "merge",
    merge_into_entity_id: "EN-3eee4f30151db45a",
    canonical: { name: "Nous Research", catalog_type: "company", company_names: [] },
    rationale: "同名 verified 产品候选实际是 Nous Research 公司，合并到现有组织实体 EN-3eee4f30151db45a。"
  }],
  ["EN-7bf321fa55418fba", {
    action: "merge",
    merge_into_entity_id: "EN-b9db1ff13ae8496e",
    canonical: { name: "Frontier", catalog_type: "product", company_names: ["OpenAI"] },
    rationale: "Frontier in bid 是标题残片，与现有 Frontier 产品实体重复，合并到 EN-b9db1ff13ae8496e。"
  }]
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function key(value = "") {
  return clean(value).normalize("NFKC").toLocaleLowerCase();
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function sameSet(left = [], right = []) {
  return JSON.stringify(unique(left.map(clean)).sort()) === JSON.stringify(unique(right.map(clean)).sort());
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, value, "utf8");
  fs.renameSync(temporary, file);
}

function capturedEvidence(review) {
  const sourceById = new Map((review?.sources || []).map((source) => [source.source_id, source]));
  return (review?.evidence || []).map((evidence) => {
    const source = sourceById.get(evidence.source_id);
    return {
      source_id: evidence.source_id,
      source_url: source?.source_url || "",
      source_class: source?.source_class || "",
      quote: clean(evidence.quote)
    };
  }).filter((evidence) => evidence.source_id && evidence.source_url && evidence.quote);
}

function advisoryFor(phase2Review, secondaryReview) {
  if (secondaryReview && ["confirmed", "correction_candidate"].includes(secondaryReview.decision) && capturedEvidence(secondaryReview).length) {
    return { review: secondaryReview, source: "secondary_search" };
  }
  if (secondaryReview && ["requires_review", "insufficient_evidence"].includes(secondaryReview.decision)) {
    if (secondaryReview.model_error && phase2Review.decision === "correction_candidate" && phase2Review.confidence >= 0.85 && (phase2Review.evidence_claim_ids || []).length) {
      return { review: phase2Review, source: "phase2_claim_audit_after_secondary_format_failure" };
    }
    return { review: secondaryReview, source: "secondary_search_exhausted" };
  }
  return { review: phase2Review, source: "phase2_claim_audit" };
}

function canonicalFor(phase2Review, advisory) {
  const review = advisory.review;
  if (review.decision === "confirmed") {
    return {
      name: phase2Review.current_name,
      catalog_type: phase2Review.catalog_type,
      company_names: [...(phase2Review.current_company_names || [])]
    };
  }
  const catalogType = clean(review.proposed_catalog_type) || phase2Review.catalog_type;
  return {
    name: clean(review.proposed_name) || phase2Review.current_name,
    catalog_type: catalogType,
    company_names: catalogType === "product" && Array.isArray(review.proposed_company_names) ? unique(review.proposed_company_names.map(clean)) : []
  };
}

function actionFor(phase2Review, advisory, canonical) {
  const review = advisory.review;
  const changed = canonical.name !== phase2Review.current_name
    || canonical.catalog_type !== phase2Review.catalog_type
    || !sameSet(canonical.company_names, phase2Review.current_company_names || []);
  if (["requires_review", "insufficient_evidence"].includes(review.decision)) return "quarantine";
  if (canonical.catalog_type === "other") return "quarantine";
  if (review.decision === "confirmed" || !changed) return "confirm";
  const claimBacked = (phase2Review.evidence_claim_ids || []).length > 0;
  const secondaryBacked = advisory.source === "secondary_search" && capturedEvidence(review).length > 0;
  return claimBacked || secondaryBacked ? "correct" : "quarantine";
}

function chooseMergeTarget(group) {
  return [...group].sort((left, right) => {
    const leftExact = key(left.current.name) === key(left.canonical.name) ? 1 : 0;
    const rightExact = key(right.current.name) === key(right.canonical.name) ? 1 : 0;
    if (leftExact !== rightExact) return rightExact - leftExact;
    const leftClaims = left.evidence.claim_refs.length;
    const rightClaims = right.evidence.claim_refs.length;
    if (leftClaims !== rightClaims) return rightClaims - leftClaims;
    return left.entity_id.localeCompare(right.entity_id);
  })[0];
}

function assertKnownCorrections(decisions) {
  const byCurrentName = new Map(decisions.map((decision) => [key(decision.current.name), decision]));
  const expectations = [
    ["1Password", "company", "1Password"],
    ["1Password for Claude", "product", "1Password for Claude"],
    ["峰谷 Token", "product", "峰谷 Token"],
    ["Clive Chan", "person", "Clive Chan"]
  ];
  for (const [currentName, catalogType, canonicalName] of expectations) {
    const decision = byCurrentName.get(key(currentName));
    if (!decision) throw new Error(`known_entity_missing:${currentName}`);
    if (decision.action === "quarantine" || decision.canonical.catalog_type !== catalogType || decision.canonical.name !== canonicalName) {
      throw new Error(`known_entity_review_mismatch:${currentName}`);
    }
  }
  const ownership = [
    ["1Password for Claude", "1Password"],
    ["峰谷 Token", "阿里云"]
  ];
  for (const [productName, companyName] of ownership) {
    const decision = byCurrentName.get(key(productName));
    if (!decision.canonical.company_names.some((name) => key(name) === key(companyName))) {
      throw new Error(`known_ownership_review_mismatch:${productName}:${companyName}`);
    }
  }
}

function markdown(report) {
  const lines = [
    "# Entity Catalog Review Closeout",
    "",
    `- Schema: \`${report.schema_version}\``,
    `- Reviewer: \`${report.reviewer}\``,
    `- Reviewed: ${report.summary.reviewed}`,
    `- Confirmed: ${report.summary.confirmed}`,
    `- Corrected: ${report.summary.corrected}`,
    `- Merged: ${report.summary.merged}`,
    `- Quarantined: ${report.summary.quarantined}`,
    `- Secondary-search completed: ${report.summary.secondary_search_completed}`,
    `- Secondary-search advisories used: ${report.summary.secondary_search_advisories_used}`,
    "",
    "## Corrected and merged",
    "",
    "| Current | Final | Type | Action | Companies |",
    "|---|---|---|---|---|",
    ...report.decisions.filter((item) => ["correct", "merge"].includes(item.action)).map((item) => `| ${item.current.name.replace(/\|/gu, "\\|")} | ${item.canonical.name.replace(/\|/gu, "\\|")} | ${item.canonical.catalog_type} | ${item.action} | ${item.canonical.company_names.join(" / ").replace(/\|/gu, "\\|")} |`),
    "",
    "## Quarantined",
    "",
    "| Current | Proposed type | Reason |",
    "|---|---|---|",
    ...report.decisions.filter((item) => item.action === "quarantine").map((item) => `| ${item.current.name.replace(/\|/gu, "\\|")} | ${item.canonical.catalog_type} | ${item.rationale.replace(/\|/gu, "\\|")} |`)
  ];
  return `${lines.join("\n")}\n`;
}

function main() {
  const phase2 = readJson(phase2Path);
  const secondary = readJson(secondaryPath);
  if (phase2.summary?.reviewed !== phase2.summary?.catalog_total || phase2.failures?.length) throw new Error("phase2_audit_incomplete");
  if (secondary.summary?.selected !== 97 || secondary.summary?.completed !== 97 || secondary.summary?.failures !== 0) throw new Error("secondary_search_incomplete");
  const secondaryById = new Map((secondary.reviews || []).map((review) => [review.entity_id, review]));
  const reviewedAt = args.get("reviewed-at") || new Date().toISOString();
  const decisions = phase2.reviews.map((phase2Review) => {
    const secondaryReview = secondaryById.get(phase2Review.entity_id);
    const advisory = advisoryFor(phase2Review, secondaryReview);
    const override = explicitOverrides.get(phase2Review.entity_id);
    const canonical = override?.canonical || canonicalFor(phase2Review, advisory);
    const action = override?.action || actionFor(phase2Review, advisory, canonical);
    return {
      entity_id: phase2Review.entity_id,
      current: {
        name: phase2Review.current_name,
        catalog_type: phase2Review.catalog_type,
        company_names: [...(phase2Review.current_company_names || [])]
      },
      action,
      merge_into_entity_id: override?.merge_into_entity_id || "",
      canonical,
      evidence: {
        claim_refs: unique(phase2Review.evidence_claim_ids || []),
        secondary_sources: [...capturedEvidence(secondaryReview), ...(override?.secondary_sources || [])]
      },
      advisory_source: advisory.source,
      advisory_decision: advisory.review.decision,
      confidence: Number(advisory.review.confidence || 0),
      rationale: override?.rationale || clean(advisory.review.rationale) || "证据不足，已从公开实体索引隔离。",
      review_status: "accepted",
      reviewer,
      reviewed_at: reviewedAt
    };
  });

  for (const decision of decisions) {
    if (decision.action === "quarantine" || !phase2.reviews.find((review) => review.entity_id === decision.entity_id)?.issue_fields?.includes("duplicate")) continue;
    const targetId = decision.rationale.match(/EN-[a-f0-9]{16}/u)?.[0] || "";
    if (!targetId || targetId === decision.entity_id || !decisions.some((item) => item.entity_id === targetId && item.action !== "quarantine")) continue;
    decision.action = "merge";
    decision.merge_into_entity_id = targetId;
  }

  const publishable = decisions.filter((decision) => !["quarantine", "merge"].includes(decision.action));
  const duplicateGroups = new Map();
  for (const decision of publishable) {
    const identity = `${decision.canonical.catalog_type}|${key(decision.canonical.name)}`;
    if (!duplicateGroups.has(identity)) duplicateGroups.set(identity, []);
    duplicateGroups.get(identity).push(decision);
  }
  for (const group of duplicateGroups.values()) {
    if (group.length < 2) continue;
    const target = chooseMergeTarget(group);
    for (const decision of group) {
      if (decision.entity_id === target.entity_id) continue;
      decision.action = "merge";
      decision.merge_into_entity_id = target.entity_id;
    }
  }

  const decisionById = new Map(decisions.map((decision) => [decision.entity_id, decision]));
  for (const decision of decisions.filter((item) => item.action === "merge")) {
    const seen = new Set([decision.entity_id]);
    let target = decisionById.get(decision.merge_into_entity_id);
    while (target?.action === "merge" && !seen.has(target.entity_id)) {
      seen.add(target.entity_id);
      decision.merge_into_entity_id = target.merge_into_entity_id;
      target = decisionById.get(target.merge_into_entity_id);
    }
  }

  assertKnownCorrections(decisions);
  const summary = {
    reviewed: decisions.length,
    confirmed: decisions.filter((item) => item.action === "confirm").length,
    corrected: decisions.filter((item) => item.action === "correct").length,
    merged: decisions.filter((item) => item.action === "merge").length,
    quarantined: decisions.filter((item) => item.action === "quarantine").length,
    secondary_search_completed: secondary.reviews.length,
    secondary_search_advisories_used: decisions.filter((item) => item.advisory_source.startsWith("secondary_search")).length
  };
  if (summary.reviewed !== 476 || summary.confirmed + summary.corrected + summary.merged + summary.quarantined !== 476) throw new Error("review_closeout_count_mismatch");
  const report = {
    schema_version: "ENTITY-CATALOG-REVIEW-V1",
    generated_at: reviewedAt,
    reviewer,
    inputs: [
      path.relative(root, phase2Path).replace(/\\/gu, "/"),
      path.relative(root, secondaryPath).replace(/\\/gu, "/")
    ],
    summary,
    decisions
  };
  if (write) {
    writeText(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    writeText(reportPath, markdown(report));
  }
  console.log(JSON.stringify({ ok: true, write, output: path.relative(root, outputPath).replace(/\\/gu, "/"), report: path.relative(root, reportPath).replace(/\\/gu, "/"), summary }, null, 2));
}

main();
