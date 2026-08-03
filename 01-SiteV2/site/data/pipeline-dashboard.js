window.WaveSightPipelineDashboard = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-03T02:06:03.559Z",
    "dateRange": {
      "start": "2026-07-28",
      "end": "2026-08-03"
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
        "capture_succeeded": 228,
        "capture_failed": 0,
        "raw_documents": 228
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-03/manifest.json",
        "agent-workflow/reports/2026-08-03-guanlan-daily-monitor-log.md"
      ]
    },
    {
      "id": "fact_build",
      "label": "事实构建",
      "status": "passed",
      "counts": {
        "accepted_claims": 96,
        "rejected_claims": 0,
        "accepted": 96,
        "rejected": 0,
        "pending_claims": 0,
        "canonical_events": 27,
        "entities": 39,
        "relationships": 96,
        "conflicts": 0,
        "qa_queue": 204
      },
      "evidence": [
        "01-SiteV2/content/11-databases/data-center-v4/2026-08-03/manifest.json",
        "agent-workflow/reports/2026-08-03-data-center-v4-integrity-gate.json"
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
        "agent-workflow/reports/2026-08-03-persistent-asset-manifest.json"
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
        "agent-workflow/reports/2026-08-03-persistent-asset-manifest.json"
      ]
    }
  ],
  "latest": {
    "date": "2026-08-03",
    "label": "2026.08.03",
    "shortLabel": "08.03",
    "discovered": 228,
    "captured": 228,
    "claims": 96,
    "events": 27,
    "entities": 39,
    "relationships": 96,
    "conflicts": 0,
    "qaQueue": 204,
    "telemetryDate": "2026-08-03",
    "collection": {
      "discovered": 290,
      "capture_succeeded": 228,
      "capture_failed": 0,
      "raw_documents": 228
    },
    "factBuild": {
      "accepted_claims": 96,
      "rejected_claims": 0,
      "accepted": 96,
      "rejected": 0,
      "pending_claims": 0,
      "canonical_events": 27,
      "entities": 39,
      "relationships": 96,
      "conflicts": 0,
      "qa_queue": 204,
      "qa_by_status": {
        "review_optional": 194,
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
      "status": "waiting"
    }
  },
  "days": [
    {
      "date": "2026-08-03",
      "label": "2026.08.03",
      "shortLabel": "08.03",
      "discovered": 228,
      "captured": 228,
      "claims": 96,
      "events": 27,
      "entities": 39,
      "relationships": 96,
      "conflicts": 0,
      "qaQueue": 204
    },
    {
      "date": "2026-08-02",
      "label": "2026.08.02",
      "shortLabel": "08.02",
      "discovered": 227,
      "captured": 227,
      "claims": 80,
      "events": 28,
      "entities": 38,
      "relationships": 80,
      "conflicts": 0,
      "qaQueue": 201
    },
    {
      "date": "2026-08-01",
      "label": "2026.08.01",
      "shortLabel": "08.01",
      "discovered": 249,
      "captured": 249,
      "claims": 83,
      "events": 28,
      "entities": 35,
      "relationships": 83,
      "conflicts": 0,
      "qaQueue": 220
    },
    {
      "date": "2026-07-31",
      "label": "2026.07.31",
      "shortLabel": "07.31",
      "discovered": 288,
      "captured": 288,
      "claims": 71,
      "events": 22,
      "entities": 37,
      "relationships": 71,
      "conflicts": 1,
      "qaQueue": 263
    },
    {
      "date": "2026-07-30",
      "label": "2026.07.30",
      "shortLabel": "07.30",
      "discovered": 179,
      "captured": 179,
      "claims": 87,
      "events": 28,
      "entities": 38,
      "relationships": 87,
      "conflicts": 0,
      "qaQueue": 149
    },
    {
      "date": "2026-07-29",
      "label": "2026.07.29",
      "shortLabel": "07.29",
      "discovered": 159,
      "captured": 159,
      "claims": 151,
      "events": 42,
      "entities": 72,
      "relationships": 151,
      "conflicts": 0,
      "qaQueue": 112
    },
    {
      "date": "2026-07-28",
      "label": "2026.07.28",
      "shortLabel": "07.28",
      "discovered": 156,
      "captured": 156,
      "claims": 188,
      "events": 56,
      "entities": 85,
      "relationships": 188,
      "conflicts": 0,
      "qaQueue": 95
    }
  ],
  "totals": {
    "discovered": 1486,
    "captured": 1486,
    "claims": 756,
    "events": 231,
    "entities": 344,
    "relationships": 756,
    "conflicts": 1,
    "qaQueue": 1244
  },
  "v4Gate": {
    "status": "passed",
    "manifest_date": "2026-08-03",
    "gate_date": "2026-08-03",
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
