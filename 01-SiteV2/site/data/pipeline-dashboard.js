window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-06T01:18:25.094Z",
    "dateRange": {
      "start": "2026-07-31",
      "end": "2026-08-06"
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
        "capture_succeeded": 245,
        "capture_failed": 3,
        "raw_documents": 245
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-06/manifest.json",
        "agent-workflow/reports/2026-08-06-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 70,
        "rejected_claims": 0,
        "accepted": 70,
        "rejected": 0,
        "pending_claims": 4,
        "canonical_events": 23,
        "entities": 27,
        "relationships": 74,
        "conflicts": 0,
        "qa_queue": 223
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-06/manifest.json",
        "agent-workflow/reports/2026-08-06-data-center-v4-integrity-gate.json"
      ]
    },
    {
      "id": "application_projection",
      "label": "应用投影",
      "status": "passed",
      "counts": {
        "opportunity_map": "passed",
        "trend_radar": "passed",
        "funding_insights": "passed",
        "fde_hardware_sync": "passed"
      },
      "evidence": [
        "agent-workflow/reports/2026-08-06-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-08-06-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-06",
    "label": "2026.08.06",
    "shortLabel": "08.06",
    "discovered": 245,
    "captured": 245,
    "claims": 74,
    "events": 23,
    "entities": 27,
    "relationships": 74,
    "conflicts": 0,
    "qaQueue": 223,
    "telemetryDate": "2026-08-06",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 245,
      "capture_failed": 3,
      "raw_documents": 245
    },
    "factBuild": {
      "accepted_claims": 70,
      "rejected_claims": 0,
      "accepted": 70,
      "rejected": 0,
      "pending_claims": 4,
      "canonical_events": 23,
      "entities": 27,
      "relationships": 74,
      "conflicts": 0,
      "qa_queue": 223,
      "qa_by_status": {
        "review_optional": 204,
        "open": 19
      }
    },
    "applicationProjection": {
      "opportunity_map": "passed",
      "trend_radar": "passed",
      "funding_insights": "passed",
      "fde_hardware_sync": "passed"
    },
    "publication": {
      "status": "waiting"
    }
  },
  "days": [
    {
      "date": "2026-08-06",
      "label": "2026.08.06",
      "shortLabel": "08.06",
      "discovered": 245,
      "captured": 245,
      "claims": 74,
      "events": 23,
      "entities": 27,
      "relationships": 74,
      "conflicts": 0,
      "qaQueue": 223
    },
    {
      "date": "2026-08-05",
      "label": "2026.08.05",
      "shortLabel": "08.05",
      "discovered": 250,
      "captured": 250,
      "claims": 81,
      "events": 30,
      "entities": 42,
      "relationships": 81,
      "conflicts": 0,
      "qaQueue": 219
    },
    {
      "date": "2026-08-04",
      "label": "2026.08.04",
      "shortLabel": "08.04",
      "discovered": 250,
      "captured": 250,
      "claims": 90,
      "events": 29,
      "entities": 48,
      "relationships": 90,
      "conflicts": 0,
      "qaQueue": 221
    },
    {
      "date": "2026-08-03",
      "label": "2026.08.03",
      "shortLabel": "08.03",
      "discovered": 243,
      "captured": 243,
      "claims": 151,
      "events": 44,
      "entities": 75,
      "relationships": 151,
      "conflicts": 0,
      "qaQueue": 199
    },
    {
      "date": "2026-08-02",
      "label": "2026.08.02",
      "shortLabel": "08.02",
      "discovered": 227,
      "captured": 227,
      "claims": 80,
      "events": 28,
      "entities": 38,
      "relationships": 80,
      "conflicts": 0,
      "qaQueue": 201
    },
    {
      "date": "2026-08-01",
      "label": "2026.08.01",
      "shortLabel": "08.01",
      "discovered": 249,
      "captured": 249,
      "claims": 83,
      "events": 28,
      "entities": 35,
      "relationships": 83,
      "conflicts": 0,
      "qaQueue": 220
    },
    {
      "date": "2026-07-31",
      "label": "2026.07.31",
      "shortLabel": "07.31",
      "discovered": 288,
      "captured": 288,
      "claims": 71,
      "events": 22,
      "entities": 37,
      "relationships": 71,
      "conflicts": 1,
      "qaQueue": 263
    }
  ],
  "totals": {
    "discovered": 1752,
    "captured": 1752,
    "claims": 630,
    "events": 204,
    "entities": 302,
    "relationships": 630,
    "conflicts": 1,
    "qaQueue": 1546
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-06",
    "gate_date": "2026-08-06",
    "failures": [],
    "warnings": [
      "No source-bounded FDE projection was produced.",
      "No source-bounded hardware projection was produced."
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
