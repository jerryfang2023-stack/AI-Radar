#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { annotateEntityReviewErrorPatterns } from "../product/entity-review-error-patterns.mjs";

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((arg) => {
  const [key, ...rest] = arg.replace(/^--/u, "").split("=");
  return [key, rest.join("=") || "true"];
}));
const auditPath = path.resolve(root, args.get("audit") || "agent-workflow/reports/entity-catalog-deepseek-audit-current.json");
const existingPath = path.resolve(root, args.get("existing") || "01-SiteV2/content/11-databases/entity-history-v1/entity-catalog-review-decisions.json");
const outputPath = path.resolve(root, args.get("output") || existingPath);
const reportPath = path.resolve(root, args.get("report") || "agent-workflow/reports/entity-catalog-review-current-closeout.md");
const claimsPath = path.resolve(root, "data-lake/tables/claims.jsonl");
const reviewer = args.get("reviewer") || "codex-current-entity-review";
const reviewedAt = args.get("reviewed-at") || new Date().toISOString();
const write = args.get("write") === "true";
const explicitAcceptedDecisionIds = new Set([
  "EN-8d323d8bba783aa3", // Google Cloud: corrected from the raw "Cloud" fragment.
  "EN-40f98159922ab514", // Google Images: corrected from the raw "Images 25" fragment.
  "EN-b81c8201acfc7639", // Huawei is explicitly named as the commercial actor in accepted Claims.
  "EN-42a64c68a4a98ad5", // Qualcomm is explicitly the subject of accepted product-release Claims.
  "EN-cb7124bb7e591ac6", // 阶跃终端 is explicitly described as a brand and release subject.
  "EN-7df09a7717ef2feb", // LM Studio is explicitly the announcement/release subject.
  "EN-e78bdebae031095b", // SpaceX is explicitly the subject of a signed commercial agreement.
  "EN-892b87f4931551f6", // Substack explicitly adds the AI detector feature.
  "EN-a614180064f7ef60", // Amazon explicitly announced AI Factories.
  "EN-b0eea3ad7b0d0a48", // Chelsio explicitly announced the platform.
  "EN-5b76e682643efda7", // Meta explicitly announced the Llama API shutdown.
  "EN-80ea42a231357d12", // 深开鸿 explicitly released M-Robots OS 2.0.
  "EN-b644c0a9d493976a", // OpenCode is explicitly compared and used as an open-source product.
  "EN-833940e4d17c9df3", // OpenWorker is explicitly described as Andrew Ng's product.
  "EN-afe83c198e329ef2" // Pixel is explicitly described as Google's hardware/product line.
]);
const organizationIdentityOverrides = [
  {
    entity_id: "EN-8d323d8bba783aa3",
    canonical_name: "Google Cloud",
    aliases: ["Cloud"],
    rationale: "accepted Claims 将 Google Cloud 明确作为芯片、规范与平台的发布主体，纠正原始 Cloud 片段并按机构实体保留。"
  },
  {
    entity_id: "EN-d9b1d7819af92e77",
    merge_into_entity_id: "EN-8d323d8bba783aa3",
    canonical_name: "Google Cloud",
    aliases: [],
    rationale: "当前批次抽取出的 Google Cloud 机构候选与已复核的 Google Cloud 稳定实体重复，合并到既有实体 ID。"
  },
  {
    entity_id: "EN-6f21a653c48f4f19",
    canonical_name: "努比亚",
    aliases: ["Nubia"],
    rationale: "Nubia 与努比亚是同一手机厂商的中英文名称，统一使用覆盖历史事件更完整的稳定实体 ID。"
  },
  {
    entity_id: "EN-6ef7552b4631e789",
    merge_into_entity_id: "EN-6f21a653c48f4f19",
    canonical_name: "努比亚",
    aliases: ["Nubia"],
    rationale: "中文名努比亚与 Nubia 重复，合并到覆盖历史事件更完整的稳定实体 ID。"
  },
  {
    entity_id: "EN-047364b9be67f665",
    canonical_name: "阿里巴巴",
    aliases: ["Alibaba", "Alibaba Group", "阿里"],
    organization_family_id: "EN-047364b9be67f665",
    organization_role: "group",
    rationale: "“Alibaba”“阿里巴巴”“阿里”是同一集团的中英文名与简称，统一保留稳定实体 ID，并以中文名展示。",
    secondary_sources: [{
      source_id: "SRC-alibaba-group-businesses-official",
      source_url: "https://www.alibabagroup.com/en-US/about-alibaba-businesses-1747835448811585536",
      source_class: "official",
      quote: "As part of Alibaba Group's globalization strategy, Cloud Intelligence Group continued to expand its international cloud computing infrastructure."
    }]
  },
  {
    entity_id: "EN-47c1e53c427aafb4",
    merge_into_entity_id: "EN-047364b9be67f665",
    canonical_name: "阿里巴巴",
    aliases: ["Alibaba", "Alibaba Group", "阿里"],
    organization_family_id: "EN-047364b9be67f665",
    organization_role: "group",
    rationale: "中文名“阿里巴巴”与 Alibaba 是同一集团实体，合并到历史事件覆盖更完整的稳定实体 ID。"
  },
  {
    entity_id: "EN-e16fc821f34228d1",
    canonical_name: "阿里云",
    aliases: ["Alibaba Cloud", "Cloud Intelligence Group"],
    organization_family_id: "EN-047364b9be67f665",
    parent_entity_id: "EN-047364b9be67f665",
    organization_role: "business_unit",
    rationale: "阿里云是阿里巴巴集团的云业务单元；保留独立实体以承载自身事件，同时记录集团归属，不与集团主体合并。",
    secondary_sources: [{
      source_id: "SRC-alibaba-cloud-arm-official",
      source_url: "https://www.alibabagroup.com/en-US/document-1491224164130881536",
      source_class: "official",
      quote: "Alibaba Cloud, the cloud computing and data intelligence arm of Alibaba Group"
    }]
  },
  {
    entity_id: "EN-b81c8201acfc7639",
    canonical_name: "华为",
    aliases: ["Huawei"],
    rationale: "“Huawei”与“华为”是同一机构的中英文名称，统一为一个稳定实体。"
  },
  {
    entity_id: "EN-82eaaba81d9dcc54",
    merge_into_entity_id: "EN-b81c8201acfc7639",
    canonical_name: "华为",
    aliases: ["Huawei"],
    rationale: "中文名“华为”与 Huawei 重复，合并到既有 verified 稳定实体。"
  },
  {
    entity_id: "EN-2ab6d53e717a0e0d",
    canonical_name: "诺基亚",
    aliases: ["Nokia"],
    rationale: "“Nokia”与“诺基亚”是同一机构的中英文名称，统一为一个稳定实体。"
  },
  {
    entity_id: "EN-accf304851de0ad2",
    merge_into_entity_id: "EN-2ab6d53e717a0e0d",
    canonical_name: "诺基亚",
    aliases: ["Nokia"],
    rationale: "中文名“诺基亚”与 Nokia 重复，合并到既有 verified 稳定实体。"
  },
  {
    entity_id: "EN-9c8ae69b84f21a2e",
    canonical_name: "腾讯",
    aliases: ["Tencent"],
    rationale: "“Tencent”与“腾讯”是同一机构的中英文名称，统一为一个稳定实体；“腾讯混元”保留为产品名称而不是机构别名。"
  },
  {
    entity_id: "EN-53874092e000069b",
    merge_into_entity_id: "EN-9c8ae69b84f21a2e",
    canonical_name: "腾讯",
    aliases: ["Tencent"],
    rationale: "中文名“腾讯”与 Tencent 重复，合并到既有 verified 稳定实体。"
  },
  {
    entity_id: "EN-a8100d425f663eac",
    canonical_name: "商汤科技",
    aliases: ["商汤", "SenseTime"],
    rationale: "“商汤”是“商汤科技”的常用简称，统一为一个稳定机构实体。"
  },
  {
    entity_id: "EN-6416272bf06ab3ec",
    merge_into_entity_id: "EN-a8100d425f663eac",
    canonical_name: "商汤科技",
    aliases: ["商汤", "SenseTime"],
    rationale: "简称“商汤”与“商汤科技”重复，合并到完整机构名称对应的稳定实体。"
  },
  {
    entity_id: "EN-1d79127e9d90e89b",
    canonical_name: "智谱AI",
    aliases: ["智谱", "Zhipu AI"],
    rationale: "“智谱”是“智谱AI”的常用简称，统一为一个稳定机构实体。"
  },
  {
    entity_id: "EN-8bcef51236d613cd",
    merge_into_entity_id: "EN-1d79127e9d90e89b",
    canonical_name: "智谱AI",
    aliases: ["智谱", "Zhipu AI"],
    rationale: "简称“智谱”与“智谱AI”重复，合并到完整机构名称对应的稳定实体。"
  },
  {
    entity_id: "EN-6fcba5d96a4fadfd",
    canonical_name: "xAI",
    aliases: ["SpaceXAI"],
    rationale: "历史数据中的“SpaceXAI”归一到 xAI 机构实体；Grok 是产品，不作为机构别名。"
  },
  {
    entity_id: "EN-0b9ca57f53ba758b",
    merge_into_entity_id: "EN-6fcba5d96a4fadfd",
    canonical_name: "xAI",
    aliases: ["SpaceXAI"],
    rationale: "历史“SpaceXAI”条目与 xAI 机构重复，合并到 xAI 稳定实体。"
  },
  {
    entity_id: "EN-630dc133336bc266",
    merge_into_entity_id: "EN-6fcba5d96a4fadfd",
    canonical_name: "xAI",
    aliases: ["SpaceXAI"],
    rationale: "历史“SpaceXAI”条目与 xAI 机构重复，合并到 xAI 稳定实体。"
  }
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function readJsonl(file) {
  return fs.readFileSync(file, "utf8").split(/\r?\n/u).filter(Boolean).map((line) => JSON.parse(line));
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function key(value = "") {
  return clean(value).normalize("NFKC").toLocaleLowerCase();
}

function unique(values = []) {
  return [...new Set(values.map(clean).filter(Boolean))];
}

function sameSet(left = [], right = []) {
  return JSON.stringify(unique(left).map(key).sort()) === JSON.stringify(unique(right).map(key).sort());
}

function writeText(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, value, "utf8");
  fs.renameSync(temporary, file);
}

function quotedText(claim = {}) {
  return [claim.subject, claim.object, claim.source_quote, claim.quote].map(clean).join("\n");
}

function exactNameSupported(name, claimRefs, claimsById) {
  const needle = key(name);
  if (!needle) return false;
  return claimRefs.some((claimRef) => key(quotedText(claimsById.get(claimRef))).includes(needle));
}

function matchingClaimRefs(claimsById, patterns) {
  return [...claimsById.entries()]
    .filter(([, claim]) => patterns.every((pattern) => pattern.test(quotedText(claim))))
    .map(([claimId]) => claimId)
    .sort();
}

function entireLaunchClaimRefs(claimsById) {
  return matchingClaimRefs(claimsById, [
    /Thomas Dohmke/iu,
    /\bEntire\b/iu,
    /\blaunch(?:es|ed)?\b|\bannounced the launch\b/iu
  ]);
}

function obviousNonProduct(name) {
  const value = clean(name);
  return /(?:报告|report)$/iu.test(value)
    || /^(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{4}$/iu.test(value)
    || /^(?:january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2}$/iu.test(value);
}

function currentDecision(review, claimsById) {
  const claimRefs = unique(review.evidence_claim_ids || []).filter((claimRef) => claimsById.has(claimRef));
  const current = {
    name: clean(review.current_name),
    catalog_type: review.catalog_type,
    company_names: unique(review.current_company_names || [])
  };
  let action = "confirm";
  let canonical = { ...current, company_names: [...current.company_names] };
  let rationale = clean(review.rationale) || "已按当前 Claim 证据完成显式复核。";

  if (["requires_review", "insufficient_evidence"].includes(review.decision)) {
    action = "quarantine";
    canonical = { name: current.name, catalog_type: "other", company_names: [] };
  } else if (review.decision === "correction_candidate") {
    const proposedType = clean(review.proposed_catalog_type);
    const proposedName = clean(review.proposed_name) || current.name;
    if (proposedType === "other") {
      action = "quarantine";
      canonical = { name: proposedName, catalog_type: "other", company_names: [] };
    } else if (
      ["company", "product", "person"].includes(proposedType)
      && (
        (key(proposedName) === key(current.name) && proposedType === current.catalog_type)
        || exactNameSupported(proposedName, claimRefs, claimsById)
      )
    ) {
      const companyNames = proposedType === "product"
        ? unique(review.proposed_company_names || []).filter((name) => exactNameSupported(name, claimRefs, claimsById))
        : [];
      canonical = { name: proposedName, catalog_type: proposedType, company_names: companyNames };
      action = canonical.name === current.name
        && canonical.catalog_type === current.catalog_type
        && sameSet(canonical.company_names, current.company_names)
        ? "confirm"
        : "correct";
    } else {
      action = "quarantine";
      canonical = { name: current.name, catalog_type: "other", company_names: [] };
      rationale = `${rationale}；建议名称或类型未被所引 Claim 精确支持，保守隔离。`;
    }
  }

  if (canonical.catalog_type === "product" && obviousNonProduct(canonical.name)) {
    action = "quarantine";
    canonical = { name: canonical.name, catalog_type: "other", company_names: [] };
    rationale = `${rationale}；名称是报告或日期，不作为产品实体收录。`;
  }

  return {
    entity_id: review.entity_id,
    current,
    action,
    merge_into_entity_id: "",
    canonical,
    evidence: { claim_refs: claimRefs, secondary_sources: [] },
    advisory_source: "current_claim_audit",
    advisory_decision: review.decision,
    confidence: Number(review.confidence || 0),
    rationale,
    review_status: "accepted",
    reviewer,
    reviewed_at: reviewedAt
  };
}

function supplementalClaimEntities(claimsById) {
  const entireClaimRefs = entireLaunchClaimRefs(claimsById);
  const googleCloudClaimRefs = matchingClaimRefs(claimsById, [
    /Google Cloud/iu,
    /\b(?:launch(?:es|ed|ing)?|announc(?:e|ed|es)|partnership|collaboration)\b/iu
  ]).slice(0, 6);
  const homeDepotClaimRefs = matchingClaimRefs(claimsById, [
    /\b(?:The )?Home Depot\b/iu,
    /\b(?:launch(?:es|ed|ing)?|deploy(?:s|ed|ing)?|announc(?:e|ed|es)|invest(?:s|ed|ing)?)\b/iu
  ]).slice(0, 6);
  const rows = [
    {
      entity_id: "EN-ade7ba309eb7a3bf",
      name: "Kē",
      company_names: [],
      claim_refs: ["CL-25e76f88684f5309", "CL-291b248f0d0b7be2"],
      rationale: "accepted Claim 精确写明 Karamo Brown 推出健康应用 Kē，补齐此前被标题抽取遗漏的产品实体。"
    },
    {
      entity_id: "EN-0decbc3b45f73b2b",
      name: "Entire",
      catalog_type: "company",
      company_names: [],
      claim_refs: entireClaimRefs,
      rationale: "accepted Claim 精确写明 Entire 是 Thomas Dohmke 创立的新公司，保留为公司实体。"
    },
    {
      entity_id: "EN-d9b1d7819af92e77",
      name: "Google Cloud",
      catalog_type: "company",
      company_names: [],
      claim_refs: googleCloudClaimRefs,
      rationale: "accepted Claims 精确写明 Google Cloud 是商业合作与产品发布主体，补齐当前批次产生的机构候选复核。"
    },
    {
      entity_id: "EN-1bf93b12e68cac56",
      name: "The Home Depot",
      catalog_type: "company",
      company_names: [],
      claim_refs: homeDepotClaimRefs,
      rationale: "多条 accepted Claims 明确将 The Home Depot 作为部署、产品发布与投资行为主体，确认其为公司实体。"
    },
    {
      entity_id: "EN-50ba7ff15827787b",
      name: "LM Studio Bionic",
      catalog_type: "product",
      company_names: ["LM Studio"],
      claim_refs: ["CL-d834d32776bdd624"],
      rationale: "accepted Claim 精确写明 LM Studio 宣布推出 LM Studio Bionic，恢复产品实体及发布归属。"
    },
    {
      entity_id: "EN-7df09a7717ef2feb",
      name: "LM Studio",
      catalog_type: "company",
      company_names: [],
      claim_refs: ["CL-d834d32776bdd624"],
      rationale: "accepted Claim 将 LM Studio 明确记为 LM Studio Bionic 的发布主体，按机构实体恢复。"
    },
    {
      entity_id: "EN-ca95aeb01df069e5",
      name: "OpenBMB",
      catalog_type: "company",
      company_names: [],
      claim_refs: ["CL-b3d90d07f2887208"],
      rationale: "accepted Claim 明确把 OpenBMB 作为 MiniCPM 模型发布主体，纠正为机构实体。"
    },
    {
      entity_id: "EN-b6779d8d1c36e158",
      name: "Visual Studio 2026",
      catalog_type: "product",
      company_names: [],
      claim_refs: ["CL-c3a3baabf4536d1e", "CL-281c274c2a72eedc"],
      rationale: "accepted Claim 精确支持 Visual Studio 2026 产品及版本发布；原文未明确公司归属，因此公司字段留空。"
    },
    {
      entity_id: "EN-62a4b84fb5a8f6b0",
      name: "WEEBILL 5",
      catalog_type: "product",
      company_names: ["智云"],
      claim_refs: ["CL-aaca441f759f3259"],
      rationale: "accepted Claim 精确写明智云宣布推出 WEEBILL 5，补全产品发布归属。"
    }
  ];
  return rows.map((row) => {
    const claimRefs = row.claim_refs.filter((claimRef) => claimsById.has(claimRef));
    if (!exactNameSupported(row.name, claimRefs, claimsById)) throw new Error(`supplemental_entity_name_not_claim_backed:${row.name}`);
    const companyNames = row.company_names.filter((name) => exactNameSupported(name, claimRefs, claimsById));
    return {
      entity_id: row.entity_id,
      current: { name: row.name, catalog_type: row.catalog_type || "product", company_names: [] },
      action: companyNames.length || row.catalog_type === "company" ? "correct" : "confirm",
      merge_into_entity_id: "",
      canonical: { name: row.name, catalog_type: row.catalog_type || "product", company_names: companyNames },
      evidence: { claim_refs: claimRefs, secondary_sources: [] },
      advisory_source: "codex_claim_backfill",
      advisory_decision: "explicit_review",
      confidence: 1,
      rationale: row.rationale,
      review_status: "accepted",
      reviewer,
      reviewed_at: reviewedAt
    };
  });
}

function applyOrganizationIdentityOverrides(decisionById) {
  for (const override of organizationIdentityOverrides) {
    const previous = decisionById.get(override.entity_id);
    if (!previous) throw new Error(`organization_identity_override_missing:${override.entity_id}`);
    const canonical = {
      name: override.canonical_name,
      catalog_type: "company",
      company_names: [],
      aliases: override.aliases
    };
    for (const field of ["organization_family_id", "parent_entity_id", "organization_role"]) {
      if (override[field]) canonical[field] = override[field];
    }
    decisionById.set(override.entity_id, {
      ...previous,
      action: override.merge_into_entity_id ? "merge" : "correct",
      merge_into_entity_id: override.merge_into_entity_id || "",
      canonical,
      evidence: {
        claim_refs: previous.evidence?.claim_refs || [],
        secondary_sources: override.secondary_sources || previous.evidence?.secondary_sources || []
      },
      advisory_source: "codex_explicit_organization_identity_review",
      advisory_decision: "explicit_review",
      confidence: 1,
      rationale: override.rationale,
      review_status: "accepted",
      reviewer,
      reviewed_at: reviewedAt
    });
  }
}

function chooseMergeTarget(group, currentIds) {
  return [...group].sort((left, right) => {
    const leftCurrent = currentIds.has(left.entity_id) ? 1 : 0;
    const rightCurrent = currentIds.has(right.entity_id) ? 1 : 0;
    if (leftCurrent !== rightCurrent) return rightCurrent - leftCurrent;
    const leftExact = key(left.current?.name) === key(left.canonical?.name) ? 1 : 0;
    const rightExact = key(right.current?.name) === key(right.canonical?.name) ? 1 : 0;
    if (leftExact !== rightExact) return rightExact - leftExact;
    return (right.evidence?.claim_refs?.length || 0) - (left.evidence?.claim_refs?.length || 0)
      || left.entity_id.localeCompare(right.entity_id);
  })[0];
}

function mergeDuplicateCanonicalEntities(decisions, currentIds) {
  const groups = new Map();
  for (const decision of decisions.filter((item) => !["quarantine", "merge"].includes(item.action))) {
    const identity = `${decision.canonical.catalog_type}|${key(decision.canonical.name)}`;
    if (!groups.has(identity)) groups.set(identity, []);
    groups.get(identity).push(decision);
  }
  for (const group of groups.values()) {
    if (group.length < 2) continue;
    const target = chooseMergeTarget(group, currentIds);
    for (const decision of group) {
      if (decision.entity_id === target.entity_id) continue;
      decision.action = "merge";
      decision.merge_into_entity_id = target.entity_id;
    }
  }
}

function mergeClaudeCodeVersions(decisions) {
  const target = decisions.find((item) => !["quarantine", "merge"].includes(item.action) && key(item.canonical?.name) === "claude code");
  if (!target) return;
  for (const decision of decisions) {
    if (decision.entity_id === target.entity_id || ["quarantine", "merge"].includes(decision.action)) continue;
    if (!/^claude code v\d+(?:\.\d+)+$/iu.test(clean(decision.canonical?.name))) continue;
    decision.action = "merge";
    decision.merge_into_entity_id = target.entity_id;
    decision.canonical = { ...target.canonical, company_names: unique([...(target.canonical.company_names || []), ...(decision.canonical.company_names || [])]) };
    decision.rationale = `${decision.rationale}；版本号归并到 Claude Code 主产品，版本变化保留在事件时间线。`;
  }
}

function enrichClaimBackedPeople(decisions, claimsById) {
  const enrichments = new Map([
    ["EN-da20c5952dba19d8", { organization_names: ["Anthropic"], role_title: "芯片团队成员" }],
    ["EN-0fc990954c0aea17", { organization_names: [], role_title: "生活教练、Kē 发起人" }],
    ["EN-45cbca5f78f1ef44", { organization_names: ["Entire"], role_title: "创始人" }]
  ]);
  for (const decision of decisions) {
    const enrichment = enrichments.get(decision.entity_id);
    if (!enrichment || decision.canonical?.catalog_type !== "person" || ["merge", "quarantine"].includes(decision.action)) continue;
    const claimRefs = decision.evidence?.claim_refs || [];
    const organizationNames = enrichment.organization_names.filter((name) => exactNameSupported(name, claimRefs, claimsById));
    decision.canonical = {
      ...decision.canonical,
      organization_names: organizationNames,
      role_title: enrichment.role_title
    };
  }
}

function refreshCurrentClaimEvidence(decisionById, claimsById) {
  const thomasDohmke = decisionById.get("EN-45cbca5f78f1ef44");
  const claimRefs = entireLaunchClaimRefs(claimsById);
  if (!thomasDohmke || !claimRefs.length) return;
  decisionById.set(thomasDohmke.entity_id, {
    ...thomasDohmke,
    evidence: {
      ...thomasDohmke.evidence,
      claim_refs: claimRefs
    }
  });
}

function applyProductOwnershipOverrides(decisionById, claimsById) {
  const overrides = [{
    entity_id: "EN-16fe95bd48dbf178",
    company_name: "阿里云",
    rationale: "accepted Claim 标题精确写明阿里云推出 QoderWork“峰谷 Token”，产品归属按直接发布主体阿里云记录。"
  }];
  for (const override of overrides) {
    const decision = decisionById.get(override.entity_id);
    const claimRefs = decision?.evidence?.claim_refs || [];
    if (!decision || decision.canonical?.catalog_type !== "product" || !exactNameSupported(override.company_name, claimRefs, claimsById)) {
      throw new Error(`product_ownership_override_not_claim_backed:${override.entity_id}`);
    }
    decision.action = "correct";
    decision.canonical = { ...decision.canonical, company_names: [override.company_name] };
    decision.rationale = `${decision.rationale}；${override.rationale}`;
  }
}

function resolveMergeChains(decisions, currentIds) {
  const byId = new Map(decisions.map((item) => [item.entity_id, item]));
  for (const decision of decisions.filter((item) => item.action === "merge")) {
    const seen = new Set([decision.entity_id]);
    let target = byId.get(decision.merge_into_entity_id);
    while (target?.action === "merge" && !seen.has(target.entity_id)) {
      seen.add(target.entity_id);
      decision.merge_into_entity_id = target.merge_into_entity_id;
      target = byId.get(target.merge_into_entity_id);
    }
    if (!target || ["merge", "quarantine"].includes(target.action)) {
      if (currentIds.has(decision.entity_id)) throw new Error(`invalid_merge_target:${decision.entity_id}`);
      decision.action = "quarantine";
      decision.merge_into_entity_id = "";
      decision.canonical = { ...decision.canonical, catalog_type: "other", company_names: [] };
      decision.rationale = `${decision.rationale}；原历史合并目标已被隔离，源实体继续隔离。`;
    }
  }
}

function markdown(report) {
  const current = report.decisions.filter((item) => item.reviewed_at === reviewedAt);
  const lines = [
    "# Current Entity Catalog Review Closeout",
    "",
    `- Generated: ${report.generated_at}`,
    `- Current catalog reviewed: ${report.summary.current_catalog_reviewed}`,
    `- Claim-backed entities added: ${report.summary.supplemental_claim_entities}`,
    `- Historical decisions retained: ${report.summary.historical_decisions_retained}`,
    `- Total explicit decisions: ${report.summary.reviewed}`,
    `- Confirmed: ${report.summary.confirmed}`,
    `- Corrected: ${report.summary.corrected}`,
    `- Merged: ${report.summary.merged}`,
    `- Quarantined: ${report.summary.quarantined}`,
    "",
    "## Current corrections and merges",
    "",
    "| Current | Final | Type | Action | Companies |",
    "|---|---|---|---|---|",
    ...current.filter((item) => ["correct", "merge"].includes(item.action)).map((item) =>
      `| ${item.current.name.replace(/\|/gu, "\\|")} | ${item.canonical.name.replace(/\|/gu, "\\|")} | ${item.canonical.catalog_type} | ${item.action} | ${(item.canonical.company_names || []).join(" / ").replace(/\|/gu, "\\|")} |`
    ),
    "",
    "## Current quarantines",
    "",
    "| Current | Reason |",
    "|---|---|",
    ...current.filter((item) => item.action === "quarantine").map((item) =>
      `| ${item.current.name.replace(/\|/gu, "\\|")} | ${item.rationale.replace(/\|/gu, "\\|")} |`
    ),
    ""
  ];
  return lines.join("\n");
}

function main() {
  const audit = readJson(auditPath);
  const existing = readJson(existingPath);
  const claimsById = new Map(readJsonl(claimsPath).map((claim) => [claim.claim_id, claim]));
  if (audit.summary?.catalog_total !== audit.summary?.reviewed || audit.summary?.remaining !== 0 || audit.failures?.length) {
    throw new Error("current_entity_audit_incomplete");
  }
  const currentIds = new Set((audit.reviews || []).map((review) => review.entity_id));
  if (currentIds.size !== audit.summary.catalog_total) throw new Error("current_entity_audit_not_unique");

  const decisionById = new Map((existing.decisions || []).map((decision) => [decision.entity_id, decision]));
  for (const review of audit.reviews) {
    const previous = decisionById.get(review.entity_id);
    if (explicitAcceptedDecisionIds.has(review.entity_id) && previous?.review_status === "accepted") {
      decisionById.set(review.entity_id, {
        ...previous,
        advisory_source: "codex_explicit_claim_review",
        advisory_decision: "explicit_review",
        rationale: `${previous.rationale}；当前审计升级人工复核后，基于既有 exact Claim 明确保留。`,
        reviewer,
        reviewed_at: reviewedAt
      });
      continue;
    }
    const next = currentDecision(review, claimsById);
    if (
      next.action === "confirm"
      && previous?.action === "correct"
      && key(previous.canonical?.name) === key(next.canonical?.name)
      && previous.canonical?.catalog_type === next.canonical?.catalog_type
    ) {
      next.action = "correct";
      next.rationale = `${next.rationale}；保留对原始实体行的既有名称或类型纠正。`;
    }
    decisionById.set(review.entity_id, next);
  }
  const supplemental = supplementalClaimEntities(claimsById);
  for (const decision of supplemental) decisionById.set(decision.entity_id, decision);
  refreshCurrentClaimEvidence(decisionById, claimsById);
  applyOrganizationIdentityOverrides(decisionById);
  applyProductOwnershipOverrides(decisionById, claimsById);
  for (const manualQuarantine of [
    {
      entity_id: "EN-8da473e7fc7e1edf",
      rationale: "当前 accepted Claims 不再包含 Entire CLI 的精确产品身份，无法维持来源可追溯的产品实体，保守隔离。"
    },
    {
      entity_id: "EN-5ce177312903c604",
      rationale: "“US AI”仅来自“US AI regulatory drama”标题片段，accepted Claim 实际产品为 GPT-5.6，不构成独立产品实体。"
    },
    {
      entity_id: "EN-ac0b142015086aaa",
      rationale: "所引 accepted Claim 只写明 AMD 将发布一系列 AI 硬件，未出现 Venice CPU 名称，证据不足，保守隔离。"
    }
  ]) {
    const previous = decisionById.get(manualQuarantine.entity_id);
    if (!previous) continue;
    decisionById.set(manualQuarantine.entity_id, {
      ...previous,
      action: "quarantine",
      merge_into_entity_id: "",
      canonical: { name: previous.current.name, catalog_type: "other", company_names: [] },
      evidence: { claim_refs: [], secondary_sources: [] },
      advisory_source: "codex_explicit_claim_review",
      advisory_decision: "explicit_review",
      confidence: 1,
      rationale: manualQuarantine.rationale,
      review_status: "accepted",
      reviewer,
      reviewed_at: reviewedAt
    });
  }
  const decisions = [...decisionById.values()];
  const supplementalIds = new Set(supplemental.map((item) => item.entity_id));
  mergeDuplicateCanonicalEntities(decisions, currentIds);
  mergeClaudeCodeVersions(decisions);
  enrichClaimBackedPeople(decisions, claimsById);
  resolveMergeChains(decisions, currentIds);
  annotateEntityReviewErrorPatterns(decisions);
  decisions.sort((left, right) => left.canonical.catalog_type.localeCompare(right.canonical.catalog_type)
    || left.canonical.name.localeCompare(right.canonical.name, "zh-CN")
    || left.entity_id.localeCompare(right.entity_id));

  const summary = {
    current_catalog_reviewed: currentIds.size,
    supplemental_claim_entities: supplemental.length,
    historical_decisions_retained: decisions.filter((item) => !currentIds.has(item.entity_id) && !supplementalIds.has(item.entity_id)).length,
    reviewed: decisions.length,
    confirmed: decisions.filter((item) => item.action === "confirm").length,
    corrected: decisions.filter((item) => item.action === "correct").length,
    merged: decisions.filter((item) => item.action === "merge").length,
    quarantined: decisions.filter((item) => item.action === "quarantine").length
  };
  if (summary.confirmed + summary.corrected + summary.merged + summary.quarantined !== summary.reviewed) {
    throw new Error("entity_review_action_totals_do_not_close");
  }
  const report = {
    schema_version: "ENTITY-CATALOG-REVIEW-V1",
    generated_at: reviewedAt,
    reviewer,
    inputs: unique([...(existing.inputs || []), path.relative(root, auditPath).replace(/\\/gu, "/")]),
    summary,
    decisions
  };
  if (write) {
    writeText(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    writeText(reportPath, markdown(report));
  }
  console.log(JSON.stringify({
    ok: true,
    write,
    output: path.relative(root, outputPath).replace(/\\/gu, "/"),
    report: path.relative(root, reportPath).replace(/\\/gu, "/"),
    summary
  }, null, 2));
}

main();
