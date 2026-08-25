const SOURCE_LABELS = {
  aihot: "AI HOT",
  "rss-feed": "RSS",
  "keyword-search": "关键词检索",
  gdelt: "GDELT",
};

const SOURCE_ORDER = ["aihot", "rss-feed", "keyword-search", "gdelt"];

function rate(part, total) {
  return total ? Math.round((part / total) * 100) : 0;
}

function qualityGrade(score) {
  if (score >= 90) return "优";
  if (score >= 80) return "良";
  if (score >= 60) return "中";
  return "待改善";
}

export function buildOpsSourceQuality({ rawDocuments = [], claims = [], canonicalEvents = [] } = {}) {
  const acceptedClaims = claims.filter((claim) => claim.verification_status === "accepted");
  const claimsByRaw = new Map();
  for (const claim of acceptedClaims) {
    if (!claim.raw_id) continue;
    claimsByRaw.set(claim.raw_id, (claimsByRaw.get(claim.raw_id) || 0) + 1);
  }

  const eventsBySource = new Map();
  for (const event of canonicalEvents) {
    for (const sourceRef of event.source_refs || []) {
      if (!sourceRef) continue;
      eventsBySource.set(sourceRef, (eventsBySource.get(sourceRef) || 0) + 1);
    }
  }

  const stats = new Map();
  for (const document of rawDocuments) {
    const diagnostics = document.intake_diagnostics || {};
    const id = diagnostics.acquisition_channel || "unknown";
    if (!stats.has(id)) {
      stats.set(id, {
        id,
        label: SOURCE_LABELS[id] || id,
        total: 0,
        eligible: 0,
        fullText: 0,
        highQuality: 0,
        readabilityKnown: 0,
        readabilityTotal: 0,
        claimDocuments: 0,
        acceptedClaims: 0,
        canonicalEvents: 0,
      });
    }
    const row = stats.get(id);
    row.total += 1;
    if (diagnostics.eligible_for_v4_extraction === true) row.eligible += 1;
    if (diagnostics.has_full_text === true) row.fullText += 1;
    if (diagnostics.extraction_quality === "high") row.highQuality += 1;
    if (Number.isFinite(Number(diagnostics.readability_score))) {
      row.readabilityKnown += 1;
      row.readabilityTotal += Number(diagnostics.readability_score);
    }
    const claimCount = claimsByRaw.get(document.raw_id) || 0;
    if (claimCount > 0) row.claimDocuments += 1;
    row.acceptedClaims += claimCount;
    row.canonicalEvents += eventsBySource.get(document.source_artifact_id) || 0;
  }

  const rows = [...stats.values()].map((row) => {
    const eligibleRate = rate(row.eligible, row.total);
    const fullTextRate = rate(row.fullText, row.total);
    const highQualityRate = rate(row.highQuality, row.total);
    const factHitRate = rate(row.claimDocuments, row.total);
    const readabilityScore = row.readabilityKnown
      ? Math.round(row.readabilityTotal / row.readabilityKnown)
      : 0;
    const score = Math.round(
      eligibleRate * 0.3
      + fullTextRate * 0.2
      + highQualityRate * 0.2
      + readabilityScore * 0.15
      + factHitRate * 0.15,
    );
    return {
      id: row.id,
      label: row.label,
      total: row.total,
      eligibleRate,
      fullTextRate,
      highQualityRate,
      readabilityScore,
      factHitRate,
      acceptedClaims: row.acceptedClaims,
      canonicalEvents: row.canonicalEvents,
      score,
      grade: qualityGrade(score),
    };
  });

  rows.sort((a, b) => {
    const aOrder = SOURCE_ORDER.indexOf(a.id);
    const bOrder = SOURCE_ORDER.indexOf(b.id);
    if (aOrder === -1 && bOrder === -1) return a.label.localeCompare(b.label, "zh-CN");
    if (aOrder === -1) return 1;
    if (bOrder === -1) return -1;
    return aOrder - bOrder;
  });

  return {
    updatedAt: new Date().toISOString(),
    sampleNote: "按最新 V4 RawDocument 的 acquisition_channel 聚合；样本量为已落盘 Raw 文档数。",
    metricNote: "诊断分由可用率、全文率、高质提取率、可读性和事实命中率组成，仅用于运营观察，不参与来源准入、排序或事实门禁。",
    rows,
  };
}
