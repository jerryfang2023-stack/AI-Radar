export function isV4ManifestReady(manifest = {}, date = "") {
  return manifest.product_version === "SITE-V4.0-data-center"
    && manifest.date === date
    && manifest.compatibility_state === "retired"
    && Boolean(manifest.counts && typeof manifest.counts === "object");
}

// A resumed lane retains its original collection log. A composite intake may
// exceed that log only when recorded batches account for every accepted row.
export function matchesCollectionCounts(intake = {}, rawCount, poolCount) {
  const rows = intake.raw_documents || [];
  const eligible = rows.filter((row) => row.intake_diagnostics?.eligible_for_v4_extraction);
  if (rawCount === rows.length && poolCount === eligible.length) return true;
  const batches = intake.collection_batches || [];
  const ids = new Set(rows.map((row) => row.raw_id));
  const eligibleIds = new Set(eligible.map((row) => row.raw_id));
  const covered = new Set();
  const coveredEligible = new Set();
  for (const batch of batches) {
    if (!Array.isArray(batch.raw_ids) || !Array.isArray(batch.eligible_raw_ids)) return false;
    if (new Set(batch.raw_ids).size !== batch.raw_ids.length || new Set(batch.eligible_raw_ids).size !== batch.eligible_raw_ids.length) return false;
    if (batch.raw_ids.some((id) => !ids.has(id)) || batch.eligible_raw_ids.some((id) => !batch.raw_ids.includes(id) || !eligibleIds.has(id))) return false;
    batch.raw_ids.forEach((id) => covered.add(id));
    batch.eligible_raw_ids.forEach((id) => coveredEligible.add(id));
  }
  return covered.size === ids.size && coveredEligible.size === eligibleIds.size
    && batches.some((batch) => batch.raw_ids.length === rawCount && batch.eligible_raw_ids.length === poolCount);
}

export function isCollectionTelemetryReady(telemetry = {}, date = "") {
  return telemetry.meta?.version === "COLLECTION-TELEMETRY-V1.0"
    && telemetry.meta?.data_date === date
    && telemetry.v4_gate?.status === "passed"
    && telemetry.v4_gate?.manifest_date === date
    && telemetry.v4_gate?.gate_date === date;
}
