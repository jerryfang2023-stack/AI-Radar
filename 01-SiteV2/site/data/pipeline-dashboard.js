window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-26T00:28:30.917Z",
    "dateRange": {
      "start": "2026-09-19",
      "end": "2026-09-26"
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
        "capture_succeeded": 256,
        "capture_failed": 6,
        "recovered_source_failures": 10,
        "raw_documents": 256
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-26/manifest.json",
        "agent-workflow/reports/2026-09-26-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-26-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 42,
        "rejected_claims": 0,
        "accepted": 42,
        "rejected": 0,
        "pending_claims": 0,
        "canonical_events": 21,
        "entities": 40,
        "relationships": 42,
        "conflicts": 0,
        "qa_queue": 235
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-26/manifest.json",
        "agent-workflow/reports/2026-09-26-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-26-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-26-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-26",
    "label": "2026.09.26",
    "shortLabel": "09.26",
    "discovered": 256,
    "captured": 256,
    "claims": 42,
    "events": 21,
    "entities": 40,
    "relationships": 42,
    "conflicts": 0,
    "qaQueue": 235,
    "telemetryDate": "2026-09-26",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 256,
      "capture_failed": 6,
      "recovered_source_failures": 10,
      "raw_documents": 256
    },
    "factBuild": {
      "accepted_claims": 42,
      "rejected_claims": 0,
      "accepted": 42,
      "rejected": 0,
      "pending_claims": 0,
      "canonical_events": 21,
      "entities": 40,
      "relationships": 42,
      "conflicts": 0,
      "qa_queue": 235,
      "qa_by_status": {
        "review_optional": 222,
        "open": 13
      }
    },
    "applicationProjection": {
      "opportunity_map": "passed",
      "trend_radar": "passed",
      "funding_insights": "failed",
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
      "date": "2026-09-26",
      "label": "2026.09.26",
      "shortLabel": "09.26",
      "discovered": 256,
      "captured": 256,
      "claims": 42,
      "events": 21,
      "entities": 40,
      "relationships": 42,
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
    }
  ],
  "totals": {
    "discovered": 2205,
    "captured": 2205,
    "claims": 727,
    "events": 298,
    "entities": 481,
    "relationships": 727,
    "conflicts": 0,
    "qaQueue": 1904
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-26",
    "gate_date": "2026-09-26",
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
