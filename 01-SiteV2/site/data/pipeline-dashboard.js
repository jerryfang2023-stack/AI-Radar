window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-19T00:31:46.854Z",
    "dateRange": {
      "start": "2026-09-13",
      "end": "2026-09-19"
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
        "capture_succeeded": 259,
        "capture_failed": 6,
        "recovered_source_failures": 9,
        "raw_documents": 259
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-19/manifest.json",
        "agent-workflow/reports/2026-09-19-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-19-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 113,
        "rejected_claims": 0,
        "accepted": 113,
        "rejected": 0,
        "pending_claims": 5,
        "canonical_events": 44,
        "entities": 75,
        "relationships": 118,
        "conflicts": 0,
        "qa_queue": 215
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-19/manifest.json",
        "agent-workflow/reports/2026-09-19-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-19-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-19-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-19",
    "label": "2026.09.19",
    "shortLabel": "09.19",
    "discovered": 259,
    "captured": 259,
    "claims": 118,
    "events": 44,
    "entities": 75,
    "relationships": 118,
    "conflicts": 0,
    "qaQueue": 215,
    "telemetryDate": "2026-09-19",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 259,
      "capture_failed": 6,
      "recovered_source_failures": 9,
      "raw_documents": 259
    },
    "factBuild": {
      "accepted_claims": 113,
      "rejected_claims": 0,
      "accepted": 113,
      "rejected": 0,
      "pending_claims": 5,
      "canonical_events": 44,
      "entities": 75,
      "relationships": 118,
      "conflicts": 0,
      "qa_queue": 215,
      "qa_by_status": {
        "review_optional": 205,
        "open": 10
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
      "date": "2026-09-19",
      "label": "2026.09.19",
      "shortLabel": "09.19",
      "discovered": 259,
      "captured": 259,
      "claims": 118,
      "events": 44,
      "entities": 75,
      "relationships": 118,
      "conflicts": 0,
      "qaQueue": 215
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
    },
    {
      "date": "2026-09-15",
      "label": "2026.09.15",
      "shortLabel": "09.15",
      "discovered": 300,
      "captured": 300,
      "claims": 107,
      "events": 54,
      "entities": 79,
      "relationships": 107,
      "conflicts": 0,
      "qaQueue": 246
    },
    {
      "date": "2026-09-14",
      "label": "2026.09.14",
      "shortLabel": "09.14",
      "discovered": 300,
      "captured": 300,
      "claims": 84,
      "events": 40,
      "entities": 66,
      "relationships": 84,
      "conflicts": 0,
      "qaQueue": 260
    },
    {
      "date": "2026-09-13",
      "label": "2026.09.13",
      "shortLabel": "09.13",
      "discovered": 297,
      "captured": 297,
      "claims": 73,
      "events": 32,
      "entities": 56,
      "relationships": 73,
      "conflicts": 1,
      "qaQueue": 263
    }
  ],
  "totals": {
    "discovered": 2110,
    "captured": 2110,
    "claims": 703,
    "events": 312,
    "entities": 523,
    "relationships": 703,
    "conflicts": 1,
    "qaQueue": 1793
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-19",
    "gate_date": "2026-09-19",
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
