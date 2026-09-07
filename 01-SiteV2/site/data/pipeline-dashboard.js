window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.6.1-member-editor-collapse",
    "generatedAt": "2026-09-07T02:26:53.768Z",
    "dateRange": {
      "start": "2026-09-01",
      "end": "2026-09-07"
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
        "capture_succeeded": 243,
        "capture_failed": 11,
        "recovered_source_failures": 6,
        "raw_documents": 243
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-07/manifest.json",
        "agent-workflow/reports/2026-09-07-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-07-guanlan-monitor-quality-gate.md"
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
        "pending_claims": 6,
        "canonical_events": 43,
        "entities": 74,
        "relationships": 119,
        "conflicts": 0,
        "qa_queue": 202
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-07/manifest.json",
        "agent-workflow/reports/2026-09-07-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-07-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-07-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-07",
    "label": "2026.09.07",
    "shortLabel": "09.07",
    "discovered": 243,
    "captured": 243,
    "claims": 119,
    "events": 43,
    "entities": 74,
    "relationships": 119,
    "conflicts": 0,
    "qaQueue": 202,
    "telemetryDate": "2026-09-07",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 243,
      "capture_failed": 11,
      "recovered_source_failures": 6,
      "raw_documents": 243
    },
    "factBuild": {
      "accepted_claims": 113,
      "rejected_claims": 0,
      "accepted": 113,
      "rejected": 0,
      "pending_claims": 6,
      "canonical_events": 43,
      "entities": 74,
      "relationships": 119,
      "conflicts": 0,
      "qa_queue": 202,
      "qa_by_status": {
        "review_optional": 194,
        "open": 8
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
      "date": "2026-09-07",
      "label": "2026.09.07",
      "shortLabel": "09.07",
      "discovered": 243,
      "captured": 243,
      "claims": 119,
      "events": 43,
      "entities": 74,
      "relationships": 119,
      "conflicts": 0,
      "qaQueue": 202
    },
    {
      "date": "2026-09-06",
      "label": "2026.09.06",
      "shortLabel": "09.06",
      "discovered": 248,
      "captured": 248,
      "claims": 108,
      "events": 37,
      "entities": 65,
      "relationships": 108,
      "conflicts": 0,
      "qaQueue": 211
    },
    {
      "date": "2026-09-05",
      "label": "2026.09.05",
      "shortLabel": "09.05",
      "discovered": 228,
      "captured": 228,
      "claims": 121,
      "events": 43,
      "entities": 78,
      "relationships": 121,
      "conflicts": 0,
      "qaQueue": 181
    },
    {
      "date": "2026-09-04",
      "label": "2026.09.04",
      "shortLabel": "09.04",
      "discovered": 277,
      "captured": 277,
      "claims": 98,
      "events": 36,
      "entities": 59,
      "relationships": 98,
      "conflicts": 1,
      "qaQueue": 239
    },
    {
      "date": "2026-09-03",
      "label": "2026.09.03",
      "shortLabel": "09.03",
      "discovered": 241,
      "captured": 241,
      "claims": 108,
      "events": 45,
      "entities": 57,
      "relationships": 108,
      "conflicts": 1,
      "qaQueue": 196
    },
    {
      "date": "2026-09-02",
      "label": "2026.09.02",
      "shortLabel": "09.02",
      "discovered": 197,
      "captured": 197,
      "claims": 99,
      "events": 40,
      "entities": 49,
      "relationships": 99,
      "conflicts": 0,
      "qaQueue": 157
    },
    {
      "date": "2026-09-01",
      "label": "2026.09.01",
      "shortLabel": "09.01",
      "discovered": 250,
      "captured": 250,
      "claims": 85,
      "events": 35,
      "entities": 60,
      "relationships": 85,
      "conflicts": 0,
      "qaQueue": 218
    }
  ],
  "totals": {
    "discovered": 1684,
    "captured": 1684,
    "claims": 738,
    "events": 279,
    "entities": 442,
    "relationships": 738,
    "conflicts": 2,
    "qaQueue": 1404
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-07",
    "gate_date": "2026-09-07",
    "failures": [],
    "warnings": [
      "No source-bounded FDE projection was produced."
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
