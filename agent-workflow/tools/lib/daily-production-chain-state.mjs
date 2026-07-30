export function isV4ManifestReady(manifest = {}, date = "") {
  return manifest.product_version === "SITE-V4.0-data-center"
    && manifest.date === date
    && manifest.compatibility_state === "retired"
    && Boolean(manifest.counts && typeof manifest.counts === "object");
}

export function isCollectionTelemetryReady(telemetry = {}, date = "") {
  return telemetry.meta?.version === "COLLECTION-TELEMETRY-V1.0"
    && telemetry.meta?.data_date === date
    && telemetry.v4_gate?.status === "passed"
    && telemetry.v4_gate?.manifest_date === date
    && telemetry.v4_gate?.gate_date === date;
}
