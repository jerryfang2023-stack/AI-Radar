window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.7.1-china-funding-history",
    "generatedAt": "2026-09-13T01:29:19.602Z",
    "dateRange": {
      "start": "2026-09-07",
      "end": "2026-09-13"
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
        "capture_succeeded": 228,
        "capture_failed": 8,
        "recovered_source_failures": 8,
        "raw_documents": 228
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-13/manifest.json",
        "agent-workflow/reports/2026-09-13-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-13-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 58,
        "rejected_claims": 0,
        "accepted": 58,
        "rejected": 0,
        "pending_claims": 6,
        "canonical_events": 25,
        "entities": 47,
        "relationships": 64,
        "conflicts": 0,
        "qa_queue": 202
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-13/manifest.json",
        "agent-workflow/reports/2026-09-13-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-13-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-13-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-13",
    "label": "2026.09.13",
    "shortLabel": "09.13",
    "discovered": 228,
    "captured": 228,
    "claims": 64,
    "events": 25,
    "entities": 47,
    "relationships": 64,
    "conflicts": 0,
    "qaQueue": 202,
    "telemetryDate": "2026-09-13",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 228,
      "capture_failed": 8,
      "recovered_source_failures": 8,
      "raw_documents": 228
    },
    "factBuild": {
      "accepted_claims": 58,
      "rejected_claims": 0,
      "accepted": 58,
      "rejected": 0,
      "pending_claims": 6,
      "canonical_events": 25,
      "entities": 47,
      "relationships": 64,
      "conflicts": 0,
      "qa_queue": 202,
      "qa_by_status": {
        "review_optional": 192,
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
      "date": "2026-09-13",
      "label": "2026.09.13",
      "shortLabel": "09.13",
      "discovered": 228,
      "captured": 228,
      "claims": 64,
      "events": 25,
      "entities": 47,
      "relationships": 64,
      "conflicts": 0,
      "qaQueue": 202
    },
    {
      "date": "2026-09-12",
      "label": "2026.09.12",
      "shortLabel": "09.12",
      "discovered": 1677,
      "captured": 1677,
      "claims": 581,
      "events": 393,
      "entities": 475,
      "relationships": 581,
      "conflicts": 7,
      "qaQueue": 1206
    },
    {
      "date": "2026-09-11",
      "label": "2026.09.11",
      "shortLabel": "09.11",
      "discovered": 234,
      "captured": 234,
      "claims": 92,
      "events": 39,
      "entities": 65,
      "relationships": 92,
      "conflicts": 0,
      "qaQueue": 195
    },
    {
      "date": "2026-09-10",
      "label": "2026.09.10",
      "shortLabel": "09.10",
      "discovered": 236,
      "captured": 236,
      "claims": 137,
      "events": 44,
      "entities": 65,
      "relationships": 137,
      "conflicts": 0,
      "qaQueue": 193
    },
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
    }
  ],
  "totals": {
    "discovered": 3092,
    "captured": 3092,
    "claims": 1179,
    "events": 619,
    "entities": 853,
    "relationships": 1179,
    "conflicts": 7,
    "qaQueue": 2395
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-13",
    "gate_date": "2026-09-13",
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
