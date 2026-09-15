window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V3.8.0-engineering-integration",
    "generatedAt": "2026-09-15T07:33:44.472Z",
    "dateRange": {
      "start": "2026-09-09",
      "end": "2026-09-15"
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
        "capture_succeeded": 234,
        "capture_failed": 6,
        "recovered_source_failures": 8,
        "raw_documents": 234
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-15/manifest.json",
        "agent-workflow/reports/2026-09-15-guanlan-daily-monitor-log.md",
        "agent-workflow/reports/2026-09-15-guanlan-monitor-quality-gate.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 81,
        "rejected_claims": 0,
        "accepted": 81,
        "rejected": 0,
        "pending_claims": 3,
        "canonical_events": 38,
        "entities": 58,
        "relationships": 84,
        "conflicts": 0,
        "qa_queue": 196
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-09-15/manifest.json",
        "agent-workflow/reports/2026-09-15-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-09-15-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-09-15-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-09-15",
    "label": "2026.09.15",
    "shortLabel": "09.15",
    "discovered": 234,
    "captured": 234,
    "claims": 84,
    "events": 38,
    "entities": 58,
    "relationships": 84,
    "conflicts": 0,
    "qaQueue": 196,
    "telemetryDate": "2026-09-15",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 234,
      "capture_failed": 6,
      "recovered_source_failures": 8,
      "raw_documents": 234
    },
    "factBuild": {
      "accepted_claims": 81,
      "rejected_claims": 0,
      "accepted": 81,
      "rejected": 0,
      "pending_claims": 3,
      "canonical_events": 38,
      "entities": 58,
      "relationships": 84,
      "conflicts": 0,
      "qa_queue": 196,
      "qa_by_status": {
        "review_optional": 185,
        "open": 11
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
      "date": "2026-09-15",
      "label": "2026.09.15",
      "shortLabel": "09.15",
      "discovered": 234,
      "captured": 234,
      "claims": 84,
      "events": 38,
      "entities": 58,
      "relationships": 84,
      "conflicts": 0,
      "qaQueue": 196
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
    }
  ],
  "totals": {
    "discovered": 3217,
    "captured": 3217,
    "claims": 1147,
    "events": 627,
    "entities": 851,
    "relationships": 1147,
    "conflicts": 8,
    "qaQueue": 2509
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-09-15",
    "gate_date": "2026-09-15",
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
