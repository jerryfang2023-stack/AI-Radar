window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-23T00:30:40.942Z",
    "dateRange": {
      "start": "2026-09-17",
      "end": "2026-09-23"
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
        "capture_succeeded": 248,
        "capture_failed": 5,
        "recovered_source_failures": 10,
        "raw_documents": 248
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-23/manifest.json",
        "agent-workflow/reports/2026-09-23-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-23-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 84,
        "rejected_claims": 0,
        "accepted": 84,
        "rejected": 0,
        "pending_claims": 4,
        "canonical_events": 34,
        "entities": 52,
        "relationships": 88,
        "conflicts": 0,
        "qa_queue": 214
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-23/manifest.json",
        "agent-workflow/reports/2026-09-23-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-23-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-23-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-23",
    "label": "2026.09.23",
    "shortLabel": "09.23",
    "discovered": 248,
    "captured": 248,
    "claims": 88,
    "events": 34,
    "entities": 52,
    "relationships": 88,
    "conflicts": 0,
    "qaQueue": 214,
    "telemetryDate": "2026-09-23",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 248,
      "capture_failed": 5,
      "recovered_source_failures": 10,
      "raw_documents": 248
    },
    "factBuild": {
      "accepted_claims": 84,
      "rejected_claims": 0,
      "accepted": 84,
      "rejected": 0,
      "pending_claims": 4,
      "canonical_events": 34,
      "entities": 52,
      "relationships": 88,
      "conflicts": 0,
      "qa_queue": 214,
      "qa_by_status": {
        "review_optional": 199,
        "open": 15
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
      "date": "2026-09-23",
      "label": "2026.09.23",
      "shortLabel": "09.23",
      "discovered": 248,
      "captured": 248,
      "claims": 88,
      "events": 34,
      "entities": 52,
      "relationships": 88,
      "conflicts": 0,
      "qaQueue": 214
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
    },
    {
      "date": "2026-09-17",
      "label": "2026.09.17",
      "shortLabel": "09.17",
      "discovered": 303,
      "captured": 303,
      "claims": 83,
      "events": 35,
      "entities": 65,
      "relationships": 83,
      "conflicts": 0,
      "qaQueue": 266
    }
  ],
  "totals": {
    "discovered": 2182,
    "captured": 2182,
    "claims": 734,
    "events": 304,
    "entities": 514,
    "relationships": 734,
    "conflicts": 0,
    "qaQueue": 1874
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-23",
    "gate_date": "2026-09-23",
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
