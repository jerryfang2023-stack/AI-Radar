import crypto from "node:crypto";

export const INVESTMENT_INSTITUTION_VERSION = "INVESTMENT-INSTITUTION-V1.0";

function clean(value = "") {
  return String(value || "").normalize("NFKC").replace(/\s+/gu, " ").trim();
}

function normalizedName(value = "") {
  return clean(value).toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, "");
}

const INVESTOR_ALIAS_GROUPS = [
  { name: "Y Combinator", aliases: ["YC"], kind: "investment_institution", stableKey: "name:ycombinator" },
  { name: "Andreessen Horowitz", aliases: ["a16z", "Andreessen Horowitz (a16z)"], kind: "investment_institution" },
  { name: "Sequoia Capital", aliases: ["Sequoia"], kind: "investment_institution" },
  { name: "Lightspeed Venture Partners", aliases: ["Lightspeed"], kind: "investment_institution" },
  { name: "Bessemer Venture Partners", aliases: ["Bessemer"], kind: "investment_institution" },
  { name: "Insight Partners", aliases: ["Insight Venture Partners"], kind: "investment_institution" },
  { name: "Coatue", aliases: ["Coatue Management"], kind: "investment_institution" },
  { name: "Khosla Ventures", aliases: ["Khosla"], kind: "investment_institution" },
  { name: "Accel", aliases: ["Accel Partners"], kind: "investment_institution" },
  { name: "New Enterprise Associates", aliases: ["NEA"], kind: "investment_institution" },
  { name: "GV", aliases: ["Google Ventures"], kind: "investment_institution" },
  { name: "Greylock", aliases: ["Greylock Partners"], kind: "investment_institution" },
  { name: "IVP", aliases: ["Institutional Venture Partners"], kind: "investment_institution" },
  { name: "Founders Fund", aliases: ["The Founders Fund"], kind: "investment_institution" },
];

const INVESTOR_ALIAS_INDEX = new Map(INVESTOR_ALIAS_GROUPS.flatMap((group) => (
  [group.name, ...group.aliases].map((name) => [normalizedName(name), group])
)));

function investorIdentity(name = "") {
  const group = INVESTOR_ALIAS_INDEX.get(normalizedName(name));
  return group
    ? { key: group.stableKey || `alias:${normalizedName(group.name)}`, name: group.name, kind: group.kind }
    : { key: `name:${normalizedName(name)}`, name: clean(name), kind: "" };
}

export function investmentInstitutionId(name = "", canonicalEntityId = "") {
  const key = investorIdentity(name).key;
  return `INV-${crypto.createHash("sha1").update(key).digest("hex").slice(0, 14)}`;
}

function roleCode(role = "", scope = "current_round") {
  if (scope !== "current_round") return "historical_or_ambiguous";
  if (/联合领投|共同领投|co-?lead/iu.test(role)) return "co_lead";
  if (/领投|led\s+the\s+round/iu.test(role)) return "lead";
  if (/参投|参与|追加|follow-?on|participat/iu.test(role)) return "participant";
  return "other_current_round";
}

function investorKind(rows = [], entityIndex = {}, identity = {}) {
  const peopleIds = new Set((entityIndex.people || []).map((entity) => entity.id));
  const items = rows.map((row) => row.item);
  const subjectText = items.map((item) => `${clean(item.name)} ${clean(item.role)}`).join(" ");
  if (identity.kind === "investment_institution") {
    return { code: "investment_institution", label: "投资机构", confidence: "evidence_bounded" };
  }
  if (items.some((item) => peopleIds.has(item.entity_id)) || /\b(?:angel investor|angels from|researchers?|engineers?|executives?)\b|天使投资人|个人投资者|个人身份|个人[）)]/iu.test(subjectText)) {
    return { code: "individual", label: "个人投资者", confidence: "evidence_bounded" };
  }
  if (/sovereign|government|state-owned|国资|政府|引导基金|母基金/iu.test(subjectText)) {
    return { code: "government_fund", label: "政府或主权基金", confidence: "evidence_bounded" };
  }
  if (/venture capital|venture firm|investment firm|private equity|\bvc\b|风投|创投|投资机构|私募|基金|ventures?\b|capital\b|partners?\b|fund\b|investments?\b|\binvest\b/iu.test(subjectText)) {
    return { code: "investment_institution", label: "投资机构", confidence: "evidence_bounded" };
  }
  if (items.some((item) => item.entity_id) || /\b(?:inc\.?|corp\.?|corporation|ltd\.?|plc|company|holdings?)\b|公司|集团/iu.test(subjectText)) {
    return { code: "corporate_investor", label: "企业投资方", confidence: "evidence_bounded" };
  }
  return { code: "unverified_investor", label: "投资方（类型待核验）", confidence: "unverified" };
}

function sourceEvidence(item, card) {
  const sources = new Map((card.research_sources || []).map((source) => [source.source_id, source]));
  return (item.evidence_refs || []).map((evidence) => {
    const source = sources.get(evidence.source_id) || {};
    return {
      source_id: evidence.source_id,
      source_url: source.source_url || "",
      source_title: source.title || "",
      source_content_hash: evidence.source_content_hash || source.content_hash || "",
      quote: evidence.quote || "",
      quote_hash: evidence.quote_hash || "",
    };
  });
}

function compactActivity(activity) {
  const { evidence, ...compact } = activity;
  return compact;
}

function activityId(card, item, scope, name) {
  const amount = card.financing?.amount_normalized || {};
  const evidenceKey = (item.evidence_refs || [])
    .map((evidence) => evidence.quote_hash || clean(evidence.quote))
    .filter(Boolean)
    .sort()
    .join("|");
  const key = [
    normalizedName(name),
    scope,
    roleCode(item.role, scope),
    card.financing?.round_code || "",
    amount.currency || "",
    amount.value ?? amount.min_value ?? "",
    amount.max_value ?? "",
    evidenceKey,
  ].join("|");
  return `IA-${crypto.createHash("sha1").update(key).digest("hex").slice(0, 16)}`;
}

function deduplicateActivities(activities = []) {
  const byFingerprint = new Map();
  for (const activity of activities) {
    if (!byFingerprint.has(activity.activity_id)) byFingerprint.set(activity.activity_id, []);
    const clusters = byFingerprint.get(activity.activity_id);
    const matching = clusters
      .map((cluster, index) => cluster.some((item) => companiesEquivalent(item, activity)) ? index : -1)
      .filter((index) => index >= 0);
    if (!matching.length) {
      clusters.push([activity]);
    } else {
      const merged = [activity, ...matching.flatMap((index) => clusters[index])];
      byFingerprint.set(activity.activity_id, [
        ...clusters.filter((_, index) => !matching.includes(index)),
        merged,
      ]);
    }
  }
  return [...byFingerprint.entries()].flatMap(([fingerprint, clusters]) => clusters.map((cluster) => {
    const selected = [...cluster].sort((left, right) => right.announced_at.localeCompare(left.announced_at))[0];
    const companyKey = cluster.map((item) => normalizedName(item.company_name)).filter(Boolean)
      .sort((left, right) => left.length - right.length || left.localeCompare(right))[0] || "unknown";
    return {
      ...selected,
      activity_id: `IA-${crypto.createHash("sha1").update(`${fingerprint}|${companyKey}`).digest("hex").slice(0, 16)}`,
      event_ids: [...new Set(cluster.flatMap((item) => item.event_ids))],
      evidence: [...new Map(cluster.flatMap((item) => item.evidence)
        .map((item) => [`${item.source_id}|${item.quote_hash || item.quote}`, item])).values()],
    };
  }));
}

function companiesEquivalent(left, right) {
  if (left.company_entity_id && left.company_entity_id === right.company_entity_id) return true;
  const leftName = normalizedName(left.company_name);
  const rightName = normalizedName(right.company_name);
  if (!leftName || !rightName) return false;
  if (leftName === rightName) return true;
  const shorter = leftName.length <= rightName.length ? leftName : rightName;
  const longer = shorter === leftName ? rightName : leftName;
  return shorter.length >= 5 && longer.includes(shorter);
}

export function buildInvestmentInstitutionRegistry(cards = [], entityIndex = {}, generatedAt = "") {
  const grouped = new Map();
  for (const card of cards) {
    for (const [scope, investors] of [
      ["current_round", card.financing?.investors || []],
      ["historical_or_ambiguous", card.financing?.other_round_investors || []],
    ]) {
      for (const item of investors) {
        const name = clean(item.name);
        if (!name) continue;
        const identity = investorIdentity(name);
        const id = investmentInstitutionId(name, item.entity_id || "");
        if (!grouped.has(id)) grouped.set(id, []);
        grouped.get(id).push({ card, item, scope, name, identity });
      }
    }
  }

  const institutions = [...grouped.entries()].map(([id, rows]) => {
    const names = [...new Set(rows.map((row) => row.name))];
    const primary = rows.find((row) => row.item.entity_id) || rows[0];
    const identity = rows[0].identity;
    const kind = investorKind(rows, entityIndex, identity);
    const activities = rows.map(({ card, item, scope, name }) => ({
      activity_id: activityId(card, item, scope, identity.name),
      funding_insight_id: card.funding_insight_id,
      event_ids: card.source_event_ids || [card.triggered_by_event_id].filter(Boolean),
      company_entity_id: card.company?.application_entity_id || card.company?.entity_id || "",
      company_canonical_entity_id: card.company?.canonical_entity_consistent ? card.company?.entity_id || "" : "",
      company_name: card.company?.name || "",
      round: card.financing?.round || "",
      round_code: card.financing?.round_code || "",
      round_original: card.financing?.round_original || "",
      amount_original: card.financing?.amount_original || card.financing?.amount || "",
      amount_normalized: card.financing?.amount_normalized || null,
      announced_at: card.financing?.announced_at || "",
      disclosure_status: card.financing?.disclosure_status || "unknown",
      scope,
      role: item.role || "",
      role_code: roleCode(item.role, scope),
      evidence: sourceEvidence(item, card),
    }));
    const uniqueActivities = deduplicateActivities(activities)
      .sort((left, right) => right.announced_at.localeCompare(left.announced_at) || left.company_name.localeCompare(right.company_name, "zh-CN"));
    const currentActivities = uniqueActivities.filter((activity) => activity.scope === "current_round");
    const roleCounts = Object.fromEntries([...new Set(uniqueActivities.map((activity) => activity.role_code))]
      .sort()
      .map((code) => [code, uniqueActivities.filter((activity) => activity.role_code === code).length]));
    const dates = uniqueActivities.map((activity) => activity.announced_at).filter(Boolean).sort();
    const evidence = [...new Map(uniqueActivities.flatMap((activity) => activity.evidence)
      .map((item) => [`${item.source_id}|${item.quote_hash || item.quote}`, item])).values()];
    return {
      id,
      name: identity.name,
      aliases: names.filter((name) => name !== identity.name),
      canonical_entity_id: primary.item.entity_id || null,
      investor_kind: kind.code,
      investor_kind_label: kind.label,
      classification_confidence: kind.confidence,
      collection_status: evidence.length && uniqueActivities.every((activity) => activity.evidence.length)
        ? "evidence_backed"
        : "partial",
      current_round_count: currentActivities.length,
      historical_or_ambiguous_count: uniqueActivities.length - currentActivities.length,
      portfolio_company_count: new Set(currentActivities.map((activity) => activity.company_entity_id || activity.company_name)).size,
      first_disclosed_at: dates[0] || "",
      latest_disclosed_at: dates.at(-1) || "",
      role_counts: roleCounts,
      round_codes: [...new Set(currentActivities.map((activity) => activity.round_code).filter(Boolean))].sort(),
      portfolio_companies: [...new Map(currentActivities.map((activity) => [
        activity.company_entity_id || activity.company_name,
        {
          entity_id: activity.company_entity_id,
          canonical_entity_id: activity.company_canonical_entity_id,
          name: activity.company_name,
        },
      ])).values()].sort((left, right) => left.name.localeCompare(right.name, "zh-CN")),
      activities: uniqueActivities,
      evidence,
    };
  }).sort((left, right) => (
    right.current_round_count - left.current_round_count
    || right.latest_disclosed_at.localeCompare(left.latest_disclosed_at)
    || left.name.localeCompare(right.name, "zh-CN")
  ));

  return {
    meta: {
      schema_version: INVESTMENT_INSTITUTION_VERSION,
      generated_at: generatedAt,
      source_contract: "FUNDING-INSIGHT-V1.3",
      institution_count: institutions.length,
      evidence_backed_count: institutions.filter((item) => item.collection_status === "evidence_backed").length,
      current_round_activity_count: institutions.reduce((sum, item) => sum + item.current_round_count, 0),
      individual_investor_count: institutions.filter((item) => item.investor_kind === "individual").length,
      boundary: "融资应用证据投影，不自动写入 Data Center V4 规范实体或 RELATION-V2.1",
    },
    institutions,
  };
}

export function investmentInstitutionIndexItem(institution) {
  const { activities, evidence, portfolio_companies, ...item } = institution;
  return {
    ...item,
    activity_count: activities.length,
    portfolio_companies: portfolio_companies.slice(0, 12),
    latest_activities: activities.slice(0, 3).map(compactActivity),
  };
}
