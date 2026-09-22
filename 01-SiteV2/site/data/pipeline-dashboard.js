window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-22T00:32:24.806Z",
    "dateRange": {
      "start": "2026-09-16",
      "end": "2026-09-22"
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
        "capture_succeeded": 240,
        "capture_failed": 8,
        "recovered_source_failures": 10,
        "raw_documents": 240
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-22/manifest.json",
        "agent-workflow/reports/2026-09-22-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-22-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 78,
        "rejected_claims": 0,
        "accepted": 78,
        "rejected": 0,
        "pending_claims": 4,
        "canonical_events": 30,
        "entities": 54,
        "relationships": 82,
        "conflicts": 0,
        "qa_queue": 209
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-22/manifest.json",
        "agent-workflow/reports/2026-09-22-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-22-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-22-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-22",
    "label": "2026.09.22",
    "shortLabel": "09.22",
    "discovered": 240,
    "captured": 240,
    "claims": 82,
    "events": 30,
    "entities": 54,
    "relationships": 82,
    "conflicts": 0,
    "qaQueue": 209,
    "telemetryDate": "2026-09-22",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 240,
      "capture_failed": 8,
      "recovered_source_failures": 10,
      "raw_documents": 240
    },
    "factBuild": {
      "accepted_claims": 78,
      "rejected_claims": 0,
      "accepted": 78,
      "rejected": 0,
      "pending_claims": 4,
      "canonical_events": 30,
      "entities": 54,
      "relationships": 82,
      "conflicts": 0,
      "qa_queue": 209,
      "qa_by_status": {
        "review_optional": 201,
        "open": 8
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
      "date": "2026-09-22",
      "label": "2026.09.22",
      "shortLabel": "09.22",
      "discovered": 240,
      "captured": 240,
      "claims": 82,
      "events": 30,
      "entities": 54,
      "relationships": 82,
      "conflicts": 0,
      "qaQueue": 209
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
    },
    {
      "date": "2026-09-16",
      "label": "2026.09.16",
      "shortLabel": "09.16",
      "discovered": 313,
      "captured": 313,
      "claims": 129,
      "events": 58,
      "entities": 92,
      "relationships": 129,
      "conflicts": 0,
      "qaQueue": 254
    }
  ],
  "totals": {
    "discovered": 2170,
    "captured": 2170,
    "claims": 756,
    "events": 317,
    "entities": 540,
    "relationships": 756,
    "conflicts": 0,
    "qaQueue": 1848
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-22",
    "gate_date": "2026-09-22",
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
