window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-24T02:18:59.018Z",
    "dateRange": {
      "start": "2026-09-18",
      "end": "2026-09-24"
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
        "capture_succeeded": 350,
        "capture_failed": 5,
        "recovered_source_failures": 11,
        "raw_documents": 350
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-24/manifest.json",
        "agent-workflow/reports/2026-09-24-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-24-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 137,
        "rejected_claims": 0,
        "accepted": 137,
        "rejected": 0,
        "pending_claims": 3,
        "canonical_events": 54,
        "entities": 79,
        "relationships": 140,
        "conflicts": 0,
        "qa_queue": 295
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-24/manifest.json",
        "agent-workflow/reports/2026-09-24-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-24-persistent-asset-manifest.json"
      ]
    },
    {
      "id": "publication",
      "label": "发布",
      "status": "waiting",
      "counts": {
        "v4_bundle_ready": true,
        "snapshot_phase": "pre_deploy_snapshot",
        "authoritative": false
      },
      "evidence": [
        "agent-workflow/reports/2026-09-24-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-24",
    "label": "2026.09.24",
    "shortLabel": "09.24",
    "discovered": 350,
    "captured": 350,
    "claims": 140,
    "events": 54,
    "entities": 79,
    "relationships": 140,
    "conflicts": 0,
    "qaQueue": 295,
    "telemetryDate": "2026-09-24",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 350,
      "capture_failed": 5,
      "recovered_source_failures": 11,
      "raw_documents": 350
    },
    "factBuild": {
      "accepted_claims": 137,
      "rejected_claims": 0,
      "accepted": 137,
      "rejected": 0,
      "pending_claims": 3,
      "canonical_events": 54,
      "entities": 79,
      "relationships": 140,
      "conflicts": 0,
      "qa_queue": 295,
      "qa_by_status": {
        "review_optional": 277,
        "open": 18
      }
    },
    "applicationProjection": {
      "opportunity_map": "passed",
      "trend_radar": "passed",
      "funding_insights": "passed",
      "fde_hardware_sync": "passed"
    },
    "publication": {
      "status": "waiting",
      "phase": "pre_deploy_snapshot",
      "authoritative": false,
      "finalization": "github_pages_artifact"
    }
  },
  "days": [
    {
      "date": "2026-09-24",
      "label": "2026.09.24",
      "shortLabel": "09.24",
      "discovered": 350,
      "captured": 350,
      "claims": 140,
      "events": 54,
      "entities": 79,
      "relationships": 140,
      "conflicts": 0,
      "qaQueue": 295
    },
    {
      "date": "2026-09-23",
      "label": "2026.09.23",
      "shortLabel": "09.23",
      "discovered": 306,
      "captured": 306,
      "claims": 91,
      "events": 37,
      "entities": 55,
      "relationships": 91,
      "conflicts": 0,
      "qaQueue": 269
    },
    {
      "date": "2026-09-22",
      "label": "2026.09.22",
      "shortLabel": "09.22",
      "discovered": 317,
      "captured": 317,
      "claims": 101,
      "events": 41,
      "entities": 68,
      "relationships": 101,
      "conflicts": 0,
      "qaQueue": 275
    },
    {
      "date": "2026-09-21",
      "label": "2026.09.21",
      "shortLabel": "09.21",
      "discovered": 344,
      "captured": 344,
      "claims": 102,
      "events": 44,
      "entities": 74,
      "relationships": 102,
      "conflicts": 0,
      "qaQueue": 299
    },
    {
      "date": "2026-09-20",
      "label": "2026.09.20",
      "shortLabel": "09.20",
      "discovered": 300,
      "captured": 300,
      "claims": 112,
      "events": 44,
      "entities": 72,
      "relationships": 112,
      "conflicts": 0,
      "qaQueue": 256
    },
    {
      "date": "2026-09-19",
      "label": "2026.09.19",
      "shortLabel": "09.19",
      "discovered": 332,
      "captured": 332,
      "claims": 139,
      "events": 57,
      "entities": 93,
      "relationships": 139,
      "conflicts": 0,
      "qaQueue": 275
    },
    {
      "date": "2026-09-18",
      "label": "2026.09.18",
      "shortLabel": "09.18",
      "discovered": 338,
      "captured": 338,
      "claims": 109,
      "events": 49,
      "entities": 90,
      "relationships": 109,
      "conflicts": 0,
      "qaQueue": 289
    }
  ],
  "totals": {
    "discovered": 2287,
    "captured": 2287,
    "claims": 794,
    "events": 326,
    "entities": 531,
    "relationships": 794,
    "conflicts": 0,
    "qaQueue": 1958
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-24",
    "gate_date": "2026-09-24",
    "failures": [],
    "warnings": [
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
