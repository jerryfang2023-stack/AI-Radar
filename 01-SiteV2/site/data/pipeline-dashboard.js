window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-21T00:27:58.642Z",
    "dateRange": {
      "start": "2026-08-15",
      "end": "2026-08-21"
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
        "capture_succeeded": 252,
        "capture_failed": 13,
        "raw_documents": 252
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-21/manifest.json",
        "agent-workflow/reports/2026-08-21-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 86,
        "rejected_claims": 0,
        "accepted": 86,
        "rejected": 0,
        "pending_claims": 4,
        "canonical_events": 24,
        "entities": 46,
        "relationships": 90,
        "conflicts": 0,
        "qa_queue": 228
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-21/manifest.json",
        "agent-workflow/reports/2026-08-21-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-08-21-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-08-21-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-21",
    "label": "2026.08.21",
    "shortLabel": "08.21",
    "discovered": 252,
    "captured": 252,
    "claims": 90,
    "events": 24,
    "entities": 46,
    "relationships": 90,
    "conflicts": 0,
    "qaQueue": 228,
    "telemetryDate": "2026-08-21",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 252,
      "capture_failed": 13,
      "raw_documents": 252
    },
    "factBuild": {
      "accepted_claims": 86,
      "rejected_claims": 0,
      "accepted": 86,
      "rejected": 0,
      "pending_claims": 4,
      "canonical_events": 24,
      "entities": 46,
      "relationships": 90,
      "conflicts": 0,
      "qa_queue": 228,
      "qa_by_status": {
        "review_optional": 212,
        "open": 16
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
      "date": "2026-08-21",
      "label": "2026.08.21",
      "shortLabel": "08.21",
      "discovered": 252,
      "captured": 252,
      "claims": 90,
      "events": 24,
      "entities": 46,
      "relationships": 90,
      "conflicts": 0,
      "qaQueue": 228
    },
    {
      "date": "2026-08-20",
      "label": "2026.08.20",
      "shortLabel": "08.20",
      "discovered": 262,
      "captured": 262,
      "claims": 108,
      "events": 43,
      "entities": 58,
      "relationships": 108,
      "conflicts": 0,
      "qaQueue": 219
    },
    {
      "date": "2026-08-19",
      "label": "2026.08.19",
      "shortLabel": "08.19",
      "discovered": 255,
      "captured": 255,
      "claims": 91,
      "events": 24,
      "entities": 45,
      "relationships": 91,
      "conflicts": 0,
      "qaQueue": 231
    },
    {
      "date": "2026-08-18",
      "label": "2026.08.18",
      "shortLabel": "08.18",
      "discovered": 260,
      "captured": 260,
      "claims": 93,
      "events": 39,
      "entities": 64,
      "relationships": 93,
      "conflicts": 0,
      "qaQueue": 221
    },
    {
      "date": "2026-08-17",
      "label": "2026.08.17",
      "shortLabel": "08.17",
      "discovered": 251,
      "captured": 251,
      "claims": 88,
      "events": 33,
      "entities": 55,
      "relationships": 88,
      "conflicts": 0,
      "qaQueue": 218
    },
    {
      "date": "2026-08-16",
      "label": "2026.08.16",
      "shortLabel": "08.16",
      "discovered": 231,
      "captured": 231,
      "claims": 127,
      "events": 42,
      "entities": 61,
      "relationships": 127,
      "conflicts": 0,
      "qaQueue": 192
    },
    {
      "date": "2026-08-15",
      "label": "2026.08.15",
      "shortLabel": "08.15",
      "discovered": 239,
      "captured": 239,
      "claims": 96,
      "events": 35,
      "entities": 52,
      "relationships": 96,
      "conflicts": 0,
      "qaQueue": 205
    }
  ],
  "totals": {
    "discovered": 1750,
    "captured": 1750,
    "claims": 693,
    "events": 240,
    "entities": 381,
    "relationships": 693,
    "conflicts": 0,
    "qaQueue": 1514
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-21",
    "gate_date": "2026-08-21",
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
