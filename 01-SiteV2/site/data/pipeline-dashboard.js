window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-27T03:22:56.059Z",
    "dateRange": {
      "start": "2026-09-20",
      "end": "2026-09-27"
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
        "capture_succeeded": 250,
        "capture_failed": 4,
        "recovered_source_failures": 11,
        "raw_documents": 250
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-27/manifest.json",
        "agent-workflow/reports/2026-09-27-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-27-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 56,
        "rejected_claims": 0,
        "accepted": 56,
        "rejected": 0,
        "pending_claims": 0,
        "canonical_events": 21,
        "entities": 39,
        "relationships": 56,
        "conflicts": 0,
        "qa_queue": 229
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-27/manifest.json",
        "agent-workflow/reports/2026-09-27-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-27-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-27-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-27",
    "label": "2026.09.27",
    "shortLabel": "09.27",
    "discovered": 250,
    "captured": 250,
    "claims": 56,
    "events": 21,
    "entities": 39,
    "relationships": 56,
    "conflicts": 0,
    "qaQueue": 229,
    "telemetryDate": "2026-09-27",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 250,
      "capture_failed": 4,
      "recovered_source_failures": 11,
      "raw_documents": 250
    },
    "factBuild": {
      "accepted_claims": 56,
      "rejected_claims": 0,
      "accepted": 56,
      "rejected": 0,
      "pending_claims": 0,
      "canonical_events": 21,
      "entities": 39,
      "relationships": 56,
      "conflicts": 0,
      "qa_queue": 229,
      "qa_by_status": {
        "review_optional": 222,
        "open": 7
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
      "date": "2026-09-27",
      "label": "2026.09.27",
      "shortLabel": "09.27",
      "discovered": 250,
      "captured": 250,
      "claims": 56,
      "events": 21,
      "entities": 39,
      "relationships": 56,
      "conflicts": 0,
      "qaQueue": 229
    },
    {
      "date": "2026-09-26",
      "label": "2026.09.26",
      "shortLabel": "09.26",
      "discovered": 267,
      "captured": 267,
      "claims": 53,
      "events": 32,
      "entities": 57,
      "relationships": 53,
      "conflicts": 0,
      "qaQueue": 235
    },
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
    }
  ],
  "totals": {
    "discovered": 2134,
    "captured": 2134,
    "claims": 655,
    "events": 273,
    "entities": 444,
    "relationships": 655,
    "conflicts": 0,
    "qaQueue": 1858
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-27",
    "gate_date": "2026-09-27",
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
