window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-28T02:47:47.423Z",
    "dateRange": {
      "start": "2026-08-22",
      "end": "2026-08-28"
    },
    "source": "Data Center V4 manifest + collection-telemetry-v1",
    "telemetryVersion": "COLLECTION-TELEMETRY-V1.0"
  },
  "stages": [
    {
      "id": "collection",
      "label": "采集",
      "status": "partial",
      "counts": {
        "discovered": 290,
        "capture_succeeded": 249,
        "capture_failed": 11,
        "raw_documents": 249
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-28/manifest.json",
        "agent-workflow/reports/2026-08-28-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 99,
        "rejected_claims": 0,
        "accepted": 99,
        "rejected": 0,
        "pending_claims": 6,
        "canonical_events": 44,
        "entities": 58,
        "relationships": 105,
        "conflicts": 0,
        "qa_queue": 206
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-28/manifest.json",
        "agent-workflow/reports/2026-08-28-data-center-v4-integrity-gate.json"
      ]
    },
    {
      "id": "application_projection",
      "label": "应用投影",
      "status": "partial",
      "counts": {
        "opportunity_map": "passed",
        "trend_radar": "passed",
        "funding_insights": "failed",
        "fde_hardware_sync": "passed"
      },
      "evidence": [
        "agent-workflow/reports/2026-08-28-persistent-asset-manifest.json"
      ]
    },
    {
      "id": "publication",
      "label": "发布",
      "status": "waiting",
      "counts": {
        "v4_bundle_ready": true
      },
      "evidence": [
        "agent-workflow/reports/2026-08-28-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-28",
    "label": "2026.08.28",
    "shortLabel": "08.28",
    "discovered": 249,
    "captured": 249,
    "claims": 105,
    "events": 44,
    "entities": 58,
    "relationships": 105,
    "conflicts": 0,
    "qaQueue": 206,
    "telemetryDate": "2026-08-28",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 249,
      "capture_failed": 11,
      "raw_documents": 249
    },
    "factBuild": {
      "accepted_claims": 99,
      "rejected_claims": 0,
      "accepted": 99,
      "rejected": 0,
      "pending_claims": 6,
      "canonical_events": 44,
      "entities": 58,
      "relationships": 105,
      "conflicts": 0,
      "qa_queue": 206,
      "qa_by_status": {
        "review_optional": 189,
        "open": 17
      }
    },
    "applicationProjection": {
      "opportunity_map": "passed",
      "trend_radar": "passed",
      "funding_insights": "failed",
      "fde_hardware_sync": "passed"
    },
    "publication": {
      "status": "waiting"
    }
  },
  "days": [
    {
      "date": "2026-08-28",
      "label": "2026.08.28",
      "shortLabel": "08.28",
      "discovered": 249,
      "captured": 249,
      "claims": 105,
      "events": 44,
      "entities": 58,
      "relationships": 105,
      "conflicts": 0,
      "qaQueue": 206
    },
    {
      "date": "2026-08-27",
      "label": "2026.08.27",
      "shortLabel": "08.27",
      "discovered": 236,
      "captured": 236,
      "claims": 105,
      "events": 42,
      "entities": 54,
      "relationships": 105,
      "conflicts": 0,
      "qaQueue": 195
    },
    {
      "date": "2026-08-26",
      "label": "2026.08.26",
      "shortLabel": "08.26",
      "discovered": 250,
      "captured": 250,
      "claims": 99,
      "events": 37,
      "entities": 50,
      "relationships": 99,
      "conflicts": 0,
      "qaQueue": 214
    },
    {
      "date": "2026-08-25",
      "label": "2026.08.25",
      "shortLabel": "08.25",
      "discovered": 259,
      "captured": 259,
      "claims": 93,
      "events": 38,
      "entities": 59,
      "relationships": 93,
      "conflicts": 0,
      "qaQueue": 223
    },
    {
      "date": "2026-08-24",
      "label": "2026.08.24",
      "shortLabel": "08.24",
      "discovered": 244,
      "captured": 244,
      "claims": 84,
      "events": 34,
      "entities": 51,
      "relationships": 84,
      "conflicts": 0,
      "qaQueue": 211
    },
    {
      "date": "2026-08-23",
      "label": "2026.08.23",
      "shortLabel": "08.23",
      "discovered": 241,
      "captured": 241,
      "claims": 71,
      "events": 32,
      "entities": 53,
      "relationships": 71,
      "conflicts": 0,
      "qaQueue": 211
    },
    {
      "date": "2026-08-22",
      "label": "2026.08.22",
      "shortLabel": "08.22",
      "discovered": 252,
      "captured": 252,
      "claims": 85,
      "events": 36,
      "entities": 50,
      "relationships": 85,
      "conflicts": 0,
      "qaQueue": 216
    }
  ],
  "totals": {
    "discovered": 1731,
    "captured": 1731,
    "claims": 642,
    "events": 263,
    "entities": 375,
    "relationships": 642,
    "conflicts": 0,
    "qaQueue": 1476
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-28",
    "gate_date": "2026-08-28",
    "failures": [],
    "warnings": [
      "No source-bounded FDE projection was produced."
    ]
  },
  "compatibility": {
    "status": "retired_archive",
    "production_write": "disabled",
    "active_consumers": 0,
    "blocking": false,
    "warnings": []
  }
};
