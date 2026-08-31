window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.1.0-membership",
    "generatedAt": "2026-08-31T02:51:59.566Z",
    "dateRange": {
      "start": "2026-08-25",
      "end": "2026-08-31"
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
        "capture_succeeded": 237,
        "capture_failed": 0,
        "recovered_source_failures": 19,
        "raw_documents": 237
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-31/manifest.json",
        "agent-workflow/reports/2026-08-31-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-08-31-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 57,
        "rejected_claims": 0,
        "accepted": 57,
        "rejected": 0,
        "pending_claims": 8,
        "canonical_events": 23,
        "entities": 37,
        "relationships": 65,
        "conflicts": 0,
        "qa_queue": 216
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-31/manifest.json",
        "agent-workflow/reports/2026-08-31-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-08-31-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-08-31-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-31",
    "label": "2026.08.31",
    "shortLabel": "08.31",
    "discovered": 237,
    "captured": 237,
    "claims": 65,
    "events": 23,
    "entities": 37,
    "relationships": 65,
    "conflicts": 0,
    "qaQueue": 216,
    "telemetryDate": "2026-08-31",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 237,
      "capture_failed": 0,
      "recovered_source_failures": 19,
      "raw_documents": 237
    },
    "factBuild": {
      "accepted_claims": 57,
      "rejected_claims": 0,
      "accepted": 57,
      "rejected": 0,
      "pending_claims": 8,
      "canonical_events": 23,
      "entities": 37,
      "relationships": 65,
      "conflicts": 0,
      "qa_queue": 216,
      "qa_by_status": {
        "review_optional": 210,
        "open": 6
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
      "date": "2026-08-31",
      "label": "2026.08.31",
      "shortLabel": "08.31",
      "discovered": 237,
      "captured": 237,
      "claims": 65,
      "events": 23,
      "entities": 37,
      "relationships": 65,
      "conflicts": 0,
      "qaQueue": 216
    },
    {
      "date": "2026-08-30",
      "label": "2026.08.30",
      "shortLabel": "08.30",
      "discovered": 244,
      "captured": 244,
      "claims": 84,
      "events": 30,
      "entities": 45,
      "relationships": 84,
      "conflicts": 0,
      "qaQueue": 216
    },
    {
      "date": "2026-08-29",
      "label": "2026.08.29",
      "shortLabel": "08.29",
      "discovered": 257,
      "captured": 257,
      "claims": 73,
      "events": 30,
      "entities": 46,
      "relationships": 73,
      "conflicts": 0,
      "qaQueue": 229
    },
    {
      "date": "2026-08-28",
      "label": "2026.08.28",
      "shortLabel": "08.28",
      "discovered": 249,
      "captured": 249,
      "claims": 101,
      "events": 43,
      "entities": 57,
      "relationships": 101,
      "conflicts": 0,
      "qaQueue": 207
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
    }
  ],
  "totals": {
    "discovered": 1732,
    "captured": 1732,
    "claims": 620,
    "events": 243,
    "entities": 348,
    "relationships": 620,
    "conflicts": 0,
    "qaQueue": 1500
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-31",
    "gate_date": "2026-08-31",
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
