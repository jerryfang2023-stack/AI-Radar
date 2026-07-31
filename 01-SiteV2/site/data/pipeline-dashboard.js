window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-07-31T09:31:52.117Z",
    "dateRange": {
      "start": "2026-07-25",
      "end": "2026-07-31"
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
        "discovered": 1,
        "capture_succeeded": 288,
        "capture_failed": 0,
        "raw_documents": 288
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-07-31/manifest.json",
        "agent-workflow/reports/2026-07-31-guanlan-daily-monitor-log.md"
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
        "pending_claims": 2,
        "canonical_events": 23,
        "entities": 38,
        "relationships": 72,
        "conflicts": 1,
        "qa_queue": 262
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-07-31/manifest.json",
        "agent-workflow/reports/2026-07-31-data-center-v4-integrity-gate.json"
      ]
    },
    {
      "id": "application_projection",
      "label": "应用投影",
      "status": "unknown",
      "counts": {
        "opportunity_map": "unknown",
        "trend_radar": "unknown",
        "funding_insights": "unknown",
        "fde_hardware_sync": "unknown"
      },
      "evidence": [
        "agent-workflow/reports/2026-07-31-persistent-asset-manifest.json"
      ]
    },
    {
      "id": "publication",
      "label": "发布",
      "status": "unknown",
      "counts": {
        "v4_bundle_ready": true
      },
      "evidence": [
        "agent-workflow/reports/2026-07-31-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-07-31",
    "label": "2026.07.31",
    "shortLabel": "07.31",
    "discovered": 288,
    "captured": 288,
    "claims": 72,
    "events": 23,
    "entities": 38,
    "relationships": 72,
    "conflicts": 1,
    "qaQueue": 262,
    "telemetryDate": "2026-07-31",
    "collection": {
      "discovered": 1,
      "capture_succeeded": 288,
      "capture_failed": 0,
      "raw_documents": 288
    },
    "factBuild": {
      "accepted_claims": 70,
      "rejected_claims": 0,
      "accepted": 70,
      "rejected": 0,
      "pending_claims": 2,
      "canonical_events": 23,
      "entities": 38,
      "relationships": 72,
      "conflicts": 1,
      "qa_queue": 262,
      "qa_by_status": {
        "review_optional": 241,
        "open": 21
      }
    },
    "applicationProjection": {
      "opportunity_map": "unknown",
      "trend_radar": "unknown",
      "funding_insights": "unknown",
      "fde_hardware_sync": "unknown"
    },
    "publication": {
      "status": "unknown"
    }
  },
  "days": [
    {
      "date": "2026-07-31",
      "label": "2026.07.31",
      "shortLabel": "07.31",
      "discovered": 288,
      "captured": 288,
      "claims": 72,
      "events": 23,
      "entities": 38,
      "relationships": 72,
      "conflicts": 1,
      "qaQueue": 262
    },
    {
      "date": "2026-07-30",
      "label": "2026.07.30",
      "shortLabel": "07.30",
      "discovered": 179,
      "captured": 179,
      "claims": 87,
      "events": 28,
      "entities": 38,
      "relationships": 87,
      "conflicts": 0,
      "qaQueue": 149
    },
    {
      "date": "2026-07-29",
      "label": "2026.07.29",
      "shortLabel": "07.29",
      "discovered": 159,
      "captured": 159,
      "claims": 151,
      "events": 42,
      "entities": 72,
      "relationships": 151,
      "conflicts": 0,
      "qaQueue": 112
    },
    {
      "date": "2026-07-28",
      "label": "2026.07.28",
      "shortLabel": "07.28",
      "discovered": 156,
      "captured": 156,
      "claims": 188,
      "events": 56,
      "entities": 85,
      "relationships": 188,
      "conflicts": 0,
      "qaQueue": 95
    },
    {
      "date": "2026-07-27",
      "label": "2026.07.27",
      "shortLabel": "07.27",
      "discovered": 73,
      "captured": 73,
      "claims": 81,
      "events": 23,
      "entities": 39,
      "relationships": 81,
      "conflicts": 0,
      "qaQueue": 50
    },
    {
      "date": "2026-07-26",
      "label": "2026.07.26",
      "shortLabel": "07.26",
      "discovered": 121,
      "captured": 121,
      "claims": 142,
      "events": 42,
      "entities": 59,
      "relationships": 142,
      "conflicts": 0,
      "qaQueue": 77
    },
    {
      "date": "2026-07-25",
      "label": "2026.07.25",
      "shortLabel": "07.25",
      "discovered": 163,
      "captured": 163,
      "claims": 122,
      "events": 28,
      "entities": 54,
      "relationships": 122,
      "conflicts": 0,
      "qaQueue": 131
    }
  ],
  "totals": {
    "discovered": 1139,
    "captured": 1139,
    "claims": 843,
    "events": 242,
    "entities": 385,
    "relationships": 843,
    "conflicts": 1,
    "qaQueue": 876
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-07-31",
    "gate_date": "2026-07-31",
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
