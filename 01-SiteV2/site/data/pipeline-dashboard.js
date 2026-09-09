window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.6.1-member-editor-collapse",
    "generatedAt": "2026-09-09T04:16:03.968Z",
    "dateRange": {
      "start": "2026-09-03",
      "end": "2026-09-09"
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
        "capture_succeeded": 239,
        "capture_failed": 10,
        "recovered_source_failures": 8,
        "raw_documents": 239
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-09/manifest.json",
        "agent-workflow/reports/2026-09-09-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-09-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 92,
        "rejected_claims": 0,
        "accepted": 92,
        "rejected": 0,
        "pending_claims": 4,
        "canonical_events": 41,
        "entities": 66,
        "relationships": 96,
        "conflicts": 0,
        "qa_queue": 196
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-09/manifest.json",
        "agent-workflow/reports/2026-09-09-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-09-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-09-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-09",
    "label": "2026.09.09",
    "shortLabel": "09.09",
    "discovered": 239,
    "captured": 239,
    "claims": 96,
    "events": 41,
    "entities": 66,
    "relationships": 96,
    "conflicts": 0,
    "qaQueue": 196,
    "telemetryDate": "2026-09-09",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 239,
      "capture_failed": 10,
      "recovered_source_failures": 8,
      "raw_documents": 239
    },
    "factBuild": {
      "accepted_claims": 92,
      "rejected_claims": 0,
      "accepted": 92,
      "rejected": 0,
      "pending_claims": 4,
      "canonical_events": 41,
      "entities": 66,
      "relationships": 96,
      "conflicts": 0,
      "qa_queue": 196,
      "qa_by_status": {
        "review_optional": 189,
        "open": 7
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
      "date": "2026-09-09",
      "label": "2026.09.09",
      "shortLabel": "09.09",
      "discovered": 239,
      "captured": 239,
      "claims": 96,
      "events": 41,
      "entities": 66,
      "relationships": 96,
      "conflicts": 0,
      "qaQueue": 196
    },
    {
      "date": "2026-09-08",
      "label": "2026.09.08",
      "shortLabel": "09.08",
      "discovered": 235,
      "captured": 235,
      "claims": 100,
      "events": 37,
      "entities": 66,
      "relationships": 100,
      "conflicts": 0,
      "qaQueue": 198
    },
    {
      "date": "2026-09-07",
      "label": "2026.09.07",
      "shortLabel": "09.07",
      "discovered": 243,
      "captured": 243,
      "claims": 109,
      "events": 40,
      "entities": 69,
      "relationships": 109,
      "conflicts": 0,
      "qaQueue": 205
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
    }
  ],
  "totals": {
    "discovered": 1711,
    "captured": 1711,
    "claims": 740,
    "events": 279,
    "entities": 460,
    "relationships": 740,
    "conflicts": 2,
    "qaQueue": 1426
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-09",
    "gate_date": "2026-09-09",
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
