window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-13T00:26:14.632Z",
    "dateRange": {
      "start": "2026-08-07",
      "end": "2026-08-13"
    },
    "source": "Data Center V4 manifest + collection-telemetry-v1",
    "telemetryVersion": "COLLECTION-TELEMETRY-V1.0"
  },
  "stages": [
    {
      "id": "collection",
      "label": "采集",
      "status": "passed",
      "counts": {
        "discovered": 290,
        "capture_succeeded": 249,
        "capture_failed": 0,
        "raw_documents": 249
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-13/manifest.json",
        "agent-workflow/reports/2026-08-13-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 102,
        "rejected_claims": 0,
        "accepted": 102,
        "rejected": 0,
        "pending_claims": 0,
        "canonical_events": 38,
        "entities": 64,
        "relationships": 102,
        "conflicts": 0,
        "qa_queue": 211
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-13/manifest.json",
        "agent-workflow/reports/2026-08-13-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-08-13-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-08-13-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-13",
    "label": "2026.08.13",
    "shortLabel": "08.13",
    "discovered": 249,
    "captured": 249,
    "claims": 102,
    "events": 38,
    "entities": 64,
    "relationships": 102,
    "conflicts": 0,
    "qaQueue": 211,
    "telemetryDate": "2026-08-13",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 249,
      "capture_failed": 0,
      "raw_documents": 249
    },
    "factBuild": {
      "accepted_claims": 102,
      "rejected_claims": 0,
      "accepted": 102,
      "rejected": 0,
      "pending_claims": 0,
      "canonical_events": 38,
      "entities": 64,
      "relationships": 102,
      "conflicts": 0,
      "qa_queue": 211,
      "qa_by_status": {
        "review_optional": 195,
        "open": 16
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
      "date": "2026-08-13",
      "label": "2026.08.13",
      "shortLabel": "08.13",
      "discovered": 249,
      "captured": 249,
      "claims": 102,
      "events": 38,
      "entities": 64,
      "relationships": 102,
      "conflicts": 0,
      "qaQueue": 211
    },
    {
      "date": "2026-08-12",
      "label": "2026.08.12",
      "shortLabel": "08.12",
      "discovered": 264,
      "captured": 264,
      "claims": 113,
      "events": 37,
      "entities": 57,
      "relationships": 113,
      "conflicts": 0,
      "qaQueue": 226
    },
    {
      "date": "2026-08-11",
      "label": "2026.08.11",
      "shortLabel": "08.11",
      "discovered": 256,
      "captured": 256,
      "claims": 78,
      "events": 31,
      "entities": 37,
      "relationships": 78,
      "conflicts": 0,
      "qaQueue": 224
    },
    {
      "date": "2026-08-10",
      "label": "2026.08.10",
      "shortLabel": "08.10",
      "discovered": 246,
      "captured": 246,
      "claims": 44,
      "events": 15,
      "entities": 24,
      "relationships": 44,
      "conflicts": 0,
      "qaQueue": 231
    },
    {
      "date": "2026-08-09",
      "label": "2026.08.09",
      "shortLabel": "08.09",
      "discovered": 253,
      "captured": 253,
      "claims": 78,
      "events": 29,
      "entities": 42,
      "relationships": 78,
      "conflicts": 0,
      "qaQueue": 224
    },
    {
      "date": "2026-08-08",
      "label": "2026.08.08",
      "shortLabel": "08.08",
      "discovered": 261,
      "captured": 261,
      "claims": 88,
      "events": 33,
      "entities": 53,
      "relationships": 88,
      "conflicts": 0,
      "qaQueue": 228
    },
    {
      "date": "2026-08-07",
      "label": "2026.08.07",
      "shortLabel": "08.07",
      "discovered": 258,
      "captured": 258,
      "claims": 55,
      "events": 22,
      "entities": 37,
      "relationships": 55,
      "conflicts": 0,
      "qaQueue": 236
    }
  ],
  "totals": {
    "discovered": 1787,
    "captured": 1787,
    "claims": 558,
    "events": 205,
    "entities": 314,
    "relationships": 558,
    "conflicts": 0,
    "qaQueue": 1580
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-13",
    "gate_date": "2026-08-13",
    "failures": [],
    "warnings": []
  },
  "compatibility": {
    "status": "retired_archive",
    "production_write": "disabled",
    "active_consumers": 0,
    "blocking": false,
    "warnings": []
  }
};
