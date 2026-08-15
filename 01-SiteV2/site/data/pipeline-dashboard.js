window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-15T04:37:57.528Z",
    "dateRange": {
      "start": "2026-08-09",
      "end": "2026-08-15"
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
        "capture_succeeded": 238,
        "capture_failed": 1,
        "raw_documents": 238
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-15/manifest.json",
        "agent-workflow/reports/2026-08-15-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 73,
        "rejected_claims": 0,
        "accepted": 73,
        "rejected": 0,
        "pending_claims": 6,
        "canonical_events": 23,
        "entities": 41,
        "relationships": 79,
        "conflicts": 0,
        "qa_queue": 216
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-15/manifest.json",
        "agent-workflow/reports/2026-08-15-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-08-15-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-08-15-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-15",
    "label": "2026.08.15",
    "shortLabel": "08.15",
    "discovered": 238,
    "captured": 238,
    "claims": 79,
    "events": 23,
    "entities": 41,
    "relationships": 79,
    "conflicts": 0,
    "qaQueue": 216,
    "telemetryDate": "2026-08-15",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 238,
      "capture_failed": 1,
      "raw_documents": 238
    },
    "factBuild": {
      "accepted_claims": 73,
      "rejected_claims": 0,
      "accepted": 73,
      "rejected": 0,
      "pending_claims": 6,
      "canonical_events": 23,
      "entities": 41,
      "relationships": 79,
      "conflicts": 0,
      "qa_queue": 216,
      "qa_by_status": {
        "review_optional": 203,
        "open": 13
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
      "date": "2026-08-15",
      "label": "2026.08.15",
      "shortLabel": "08.15",
      "discovered": 238,
      "captured": 238,
      "claims": 79,
      "events": 23,
      "entities": 41,
      "relationships": 79,
      "conflicts": 0,
      "qaQueue": 216
    },
    {
      "date": "2026-08-14",
      "label": "2026.08.14",
      "shortLabel": "08.14",
      "discovered": 234,
      "captured": 234,
      "claims": 113,
      "events": 39,
      "entities": 57,
      "relationships": 113,
      "conflicts": 0,
      "qaQueue": 195
    },
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
    }
  ],
  "totals": {
    "discovered": 1740,
    "captured": 1740,
    "claims": 607,
    "events": 212,
    "entities": 322,
    "relationships": 607,
    "conflicts": 0,
    "qaQueue": 1527
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-15",
    "gate_date": "2026-08-15",
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
