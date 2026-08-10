window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-10T03:06:18.457Z",
    "dateRange": {
      "start": "2026-08-04",
      "end": "2026-08-10"
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
        "capture_succeeded": 246,
        "capture_failed": 0,
        "raw_documents": 246
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-10/manifest.json",
        "agent-workflow/reports/2026-08-10-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 44,
        "rejected_claims": 0,
        "accepted": 44,
        "rejected": 0,
        "pending_claims": 0,
        "canonical_events": 15,
        "entities": 24,
        "relationships": 44,
        "conflicts": 0,
        "qa_queue": 231
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-10/manifest.json",
        "agent-workflow/reports/2026-08-10-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-08-10-persistent-asset-manifest.json"
      ]
    },
    {
      "id": "publication",
      "label": "发布",
      "status": "waiting",
      "counts": {
        "v4_bundle_ready": true
      },
      "evidence": [
        "agent-workflow/reports/2026-08-10-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-10",
    "label": "2026.08.10",
    "shortLabel": "08.10",
    "discovered": 246,
    "captured": 246,
    "claims": 44,
    "events": 15,
    "entities": 24,
    "relationships": 44,
    "conflicts": 0,
    "qaQueue": 231,
    "telemetryDate": "2026-08-10",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 246,
      "capture_failed": 0,
      "raw_documents": 246
    },
    "factBuild": {
      "accepted_claims": 44,
      "rejected_claims": 0,
      "accepted": 44,
      "rejected": 0,
      "pending_claims": 0,
      "canonical_events": 15,
      "entities": 24,
      "relationships": 44,
      "conflicts": 0,
      "qa_queue": 231,
      "qa_by_status": {
        "review_optional": 225,
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
      "status": "waiting"
    }
  },
  "days": [
    {
      "date": "2026-08-10",
      "label": "2026.08.10",
      "shortLabel": "08.10",
      "discovered": 246,
      "captured": 246,
      "claims": 44,
      "events": 15,
      "entities": 24,
      "relationships": 44,
      "conflicts": 0,
      "qaQueue": 231
    },
    {
      "date": "2026-08-09",
      "label": "2026.08.09",
      "shortLabel": "08.09",
      "discovered": 253,
      "captured": 253,
      "claims": 78,
      "events": 29,
      "entities": 42,
      "relationships": 78,
      "conflicts": 0,
      "qaQueue": 224
    },
    {
      "date": "2026-08-08",
      "label": "2026.08.08",
      "shortLabel": "08.08",
      "discovered": 261,
      "captured": 261,
      "claims": 88,
      "events": 33,
      "entities": 53,
      "relationships": 88,
      "conflicts": 0,
      "qaQueue": 228
    },
    {
      "date": "2026-08-07",
      "label": "2026.08.07",
      "shortLabel": "08.07",
      "discovered": 258,
      "captured": 258,
      "claims": 55,
      "events": 22,
      "entities": 37,
      "relationships": 55,
      "conflicts": 0,
      "qaQueue": 236
    },
    {
      "date": "2026-08-06",
      "label": "2026.08.06",
      "shortLabel": "08.06",
      "discovered": 245,
      "captured": 245,
      "claims": 74,
      "events": 23,
      "entities": 27,
      "relationships": 74,
      "conflicts": 0,
      "qaQueue": 223
    },
    {
      "date": "2026-08-05",
      "label": "2026.08.05",
      "shortLabel": "08.05",
      "discovered": 250,
      "captured": 250,
      "claims": 81,
      "events": 30,
      "entities": 42,
      "relationships": 81,
      "conflicts": 0,
      "qaQueue": 219
    },
    {
      "date": "2026-08-04",
      "label": "2026.08.04",
      "shortLabel": "08.04",
      "discovered": 250,
      "captured": 250,
      "claims": 90,
      "events": 29,
      "entities": 48,
      "relationships": 90,
      "conflicts": 0,
      "qaQueue": 221
    }
  ],
  "totals": {
    "discovered": 1763,
    "captured": 1763,
    "claims": 510,
    "events": 181,
    "entities": 273,
    "relationships": 510,
    "conflicts": 0,
    "qaQueue": 1582
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-10",
    "gate_date": "2026-08-10",
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
