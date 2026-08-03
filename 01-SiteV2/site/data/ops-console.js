window.WaveSightOpsConsole = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-03T02:06:03.596Z",
    "date": "2026-08-03",
    "sources": [
      "agent-workflow/reports/daily-supervision-report-latest.json",
      "01-SiteV2/site/data/pipeline-dashboard.json",
      "01-SiteV2/site/data/collection-telemetry-v1.json",
      "context/version-ledger.md",
      "agent-workflow/inbox/production-incidents/*.md"
    ]
  },
  "navigation": [
    {
      "id": "overview",
      "label": "总览"
    },
    {
      "id": "issues",
      "label": "问题中心"
    },
    {
      "id": "tasks",
      "label": "任务链路"
    },
    {
      "id": "quality",
      "label": "数据质量"
    },
    {
      "id": "governance",
      "label": "版本治理"
    },
    {
      "id": "skills",
      "label": "Skill Store"
    },
    {
      "id": "settings",
      "label": "系统设置"
    }
  ],
  "daily": {
    "date": "2026-08-03",
    "status": "passed",
    "statusText": "已通过",
    "issueSummary": {
      "total": 5,
      "daily": 0,
      "open": 1,
      "resolved": 4,
      "urgent": 0
    },
    "issues": []
  },
  "periods": {
    "weekly": {
      "windowDays": 7,
      "total": 3,
      "open": 1,
      "resolved": 2,
      "byLane": {
        "business_signals": 2,
        "community_intelligence": 1
      },
      "byCategory": {
        "recurring_automation_issue": 3
      },
      "recurring": [
        {
          "category": "recurring_automation_issue",
          "count": 3
        }
      ],
      "latest": [
        {
          "id": "2026-07-30-community-intelligence-recurring-73a400f41c5af405",
          "date": "2026-07-30",
          "title": "Recurring warning: community_intelligence",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-30T08:45:26.578Z",
          "updatedAt": "2026-08-02T12:59:54+08:00",
          "resolvedAt": "2026-08-02T12:59:54+08:00",
          "resolver": "codex",
          "fixCommit": "dae49febd",
          "validation": "npm test; 2026-08-02 daily supervision community_intelligence passed",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-30-community-intelligence-recurring-73a400f41c5af405.md"
        },
        {
          "id": "2026-07-30-business-signals-recurring-fef63b1d095e1eec",
          "date": "2026-07-30",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-27-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-30T08:45:26.579Z",
          "updatedAt": "2026-08-02T12:59:53+08:00",
          "resolvedAt": "2026-08-02T12:59:53+08:00",
          "resolver": "codex",
          "fixCommit": "dae49febd",
          "validation": "npm test; 2026-08-02 daily supervision business_signals passed",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-30-business-signals-recurring-fef63b1d095e1eec.md"
        },
        {
          "id": "2026-08-02-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-02",
          "title": "Recurring warning: business_signals",
          "status": "open",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-02",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-02T08:45:37.557Z",
          "updatedAt": "",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-02-business-signals-recurring-05f820ce67869f02.md"
        }
      ]
    },
    "monthly": {
      "windowDays": 30,
      "total": 5,
      "open": 1,
      "resolved": 4,
      "byLane": {
        "community_intelligence": 2,
        "skill_ops": 1,
        "business_signals": 2
      },
      "byCategory": {
        "recurring_automation_issue": 4,
        "weekly_learning_loop": 1
      },
      "recurring": [
        {
          "category": "recurring_automation_issue",
          "count": 4
        }
      ],
      "latest": [
        {
          "id": "2026-07-30-community-intelligence-recurring-73a400f41c5af405",
          "date": "2026-07-30",
          "title": "Recurring warning: community_intelligence",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-30T08:45:26.578Z",
          "updatedAt": "2026-08-02T12:59:54+08:00",
          "resolvedAt": "2026-08-02T12:59:54+08:00",
          "resolver": "codex",
          "fixCommit": "dae49febd",
          "validation": "npm test; 2026-08-02 daily supervision community_intelligence passed",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-30-community-intelligence-recurring-73a400f41c5af405.md"
        },
        {
          "id": "2026-07-30-business-signals-recurring-fef63b1d095e1eec",
          "date": "2026-07-30",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-27-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-30T08:45:26.579Z",
          "updatedAt": "2026-08-02T12:59:53+08:00",
          "resolvedAt": "2026-08-02T12:59:53+08:00",
          "resolver": "codex",
          "fixCommit": "dae49febd",
          "validation": "npm test; 2026-08-02 daily supervision business_signals passed",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-30-business-signals-recurring-fef63b1d095e1eec.md"
        },
        {
          "id": "2026-08-02-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-02",
          "title": "Recurring warning: business_signals",
          "status": "open",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-02",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-02T08:45:37.557Z",
          "updatedAt": "",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-02-business-signals-recurring-05f820ce67869f02.md"
        },
        {
          "id": "2026-07-26-skill_ops-weekly-learning-loop",
          "date": "2026-07-26",
          "title": "Weekly Learning Loop - 2026-07-26",
          "status": "resolved",
          "state": "resolved",
          "priority": "medium",
          "laneId": "skill_ops",
          "category": "weekly_learning_loop",
          "failedGate": "weekly_learning_loop",
          "reportPath": "agent-workflow/reports/2026-07-26-weekly-health.md",
          "dataGenerated": "not_applicable",
          "neededAction": "add or tighten gate / eval / MEMORY prevention",
          "createdAt": "2026-07-26T11:16:52.426Z",
          "updatedAt": "2026-07-27T14:13:06+08:00",
          "resolvedAt": "2026-07-27T14:13:06+08:00",
          "resolver": "codex",
          "fixCommit": "f3ea9554c",
          "validation": "node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs agent-workflow/tools/tests/recurring-production-incidents.test.mjs",
          "prevention": "eval",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-skill_ops-weekly-learning-loop.md"
        },
        {
          "id": "2026-07-26-community-intelligence-recurring-73a400f41c5af405",
          "date": "2026-07-26",
          "title": "Recurring warning: community_intelligence",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-26T08:45:31.857Z",
          "updatedAt": "2026-07-27T11:35:25+08:00",
          "resolvedAt": "2026-07-27T11:35:25+08:00",
          "resolver": "codex",
          "fixCommit": "f3ea9554c",
          "validation": "node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs && npm run supervise:daily -- --date=2026-07-27",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-community-intelligence-recurring-73a400f41c5af405.md"
        }
      ]
    }
  },
  "inbox": {
    "open": [
      {
        "id": "2026-08-02-business-signals-recurring-05f820ce67869f02",
        "date": "2026-08-02",
        "title": "Recurring warning: business_signals",
        "status": "open",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "runtime://daily-supervision/2026-08-02",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-08-02T08:45:37.557Z",
        "updatedAt": "",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-02-business-signals-recurring-05f820ce67869f02.md"
      }
    ],
    "resolved": [
      {
        "id": "2026-07-30-community-intelligence-recurring-73a400f41c5af405",
        "date": "2026-07-30",
        "title": "Recurring warning: community_intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-07-30T08:45:26.578Z",
        "updatedAt": "2026-08-02T12:59:54+08:00",
        "resolvedAt": "2026-08-02T12:59:54+08:00",
        "resolver": "codex",
        "fixCommit": "dae49febd",
        "validation": "npm test; 2026-08-02 daily supervision community_intelligence passed",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-30-community-intelligence-recurring-73a400f41c5af405.md"
      },
      {
        "id": "2026-07-30-business-signals-recurring-fef63b1d095e1eec",
        "date": "2026-07-30",
        "title": "Recurring warning: business_signals",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "agent-workflow/reports/2026-07-27-daily-supervision-report.json",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-07-30T08:45:26.579Z",
        "updatedAt": "2026-08-02T12:59:53+08:00",
        "resolvedAt": "2026-08-02T12:59:53+08:00",
        "resolver": "codex",
        "fixCommit": "dae49febd",
        "validation": "npm test; 2026-08-02 daily supervision business_signals passed",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-30-business-signals-recurring-fef63b1d095e1eec.md"
      },
      {
        "id": "2026-07-26-skill_ops-weekly-learning-loop",
        "date": "2026-07-26",
        "title": "Weekly Learning Loop - 2026-07-26",
        "status": "resolved",
        "state": "resolved",
        "priority": "medium",
        "laneId": "skill_ops",
        "category": "weekly_learning_loop",
        "failedGate": "weekly_learning_loop",
        "reportPath": "agent-workflow/reports/2026-07-26-weekly-health.md",
        "dataGenerated": "not_applicable",
        "neededAction": "add or tighten gate / eval / MEMORY prevention",
        "createdAt": "2026-07-26T11:16:52.426Z",
        "updatedAt": "2026-07-27T14:13:06+08:00",
        "resolvedAt": "2026-07-27T14:13:06+08:00",
        "resolver": "codex",
        "fixCommit": "f3ea9554c",
        "validation": "node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs agent-workflow/tools/tests/recurring-production-incidents.test.mjs",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-skill_ops-weekly-learning-loop.md"
      },
      {
        "id": "2026-07-26-community-intelligence-recurring-73a400f41c5af405",
        "date": "2026-07-26",
        "title": "Recurring warning: community_intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-07-26T08:45:31.857Z",
        "updatedAt": "2026-07-27T11:35:25+08:00",
        "resolvedAt": "2026-07-27T11:35:25+08:00",
        "resolver": "codex",
        "fixCommit": "f3ea9554c",
        "validation": "node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs && npm run supervise:daily -- --date=2026-07-27",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-community-intelligence-recurring-73a400f41c5af405.md"
      }
    ]
  },
  "tasks": {
    "lanes": [
      {
        "id": "skill_ops",
        "label": "Skill Ops Governance",
        "schedule": "daily supervision preflight",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": []
      },
      {
        "id": "community_intelligence",
        "label": "Community Intelligence",
        "schedule": "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 69
          }
        ]
      },
      {
        "id": "business_signals",
        "label": "Data Center V4 / Business Signals Operations",
        "schedule": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Sources",
            "value": 290
          },
          {
            "label": "Claims",
            "value": 96
          },
          {
            "label": "Events",
            "value": 27
          },
          {
            "label": "QA",
            "value": 204
          }
        ]
      },
      {
        "id": "first_line_viewpoints",
        "label": "First-Line Viewpoints",
        "schedule": "08:30 local RSS collection + page build; 09:15 conditional fallback; 09:50 consolidated closure",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 36
          }
        ]
      },
      {
        "id": "follow_builders_skill",
        "label": "First-Line Viewpoints Skill",
        "schedule": "16:10 local follow-builders skill publish; Hermes record 16:30; report review 16:45",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 34
          }
        ]
      }
    ],
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
    "latestProduction": {
      "date": "2026-08-03",
      "discovered": 228,
      "captured": 228,
      "claims": 96,
      "events": 27,
      "entities": 39,
      "relationships": 96
    },
    "sync": [
      {
        "label": "GitHub Pages",
        "status": "passed",
        "detail": "https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/30526606863"
      },
      {
        "label": "Business Signals PR",
        "status": "passed",
        "detail": "https://github.com/jerryfang2023-stack/AI-Radar/pull/477"
      },
      {
        "label": "本地观澜 Vault 同步准备度",
        "status": "passed",
        "detail": "工作区干净"
      },
      {
        "label": "Pipeline Dashboard",
        "status": "passed",
        "detail": "2026-08-03T02:06:03.559Z"
      },
      {
        "label": "Daily Supervision",
        "status": "passed",
        "detail": "2026-07-30T08:45:26.339Z"
      }
    ]
  },
  "quality": {
    "telemetry": {
      "meta": {
        "version": "COLLECTION-TELEMETRY-V1.0",
        "ops_version": "OPS-V2.0.0-v4-telemetry",
        "data_date": "2026-08-03",
        "generated_at": "2026-08-03T02:06:03.518Z",
        "scope": "OPS",
        "canonical_writeback": false,
        "source_of_truth": "Data Center V4 manifest and integrity gate"
      },
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
      "v4Gate": {
        "status": "passed",
        "manifest_date": "2026-08-03",
        "gate_date": "2026-08-03",
        "failures": [],
        "warnings": []
      },
      "applicationProjection": {
        "opportunity_map": "passed",
        "trend_radar": "passed",
        "funding_insights": "passed",
        "fde_hardware_sync": "passed"
      },
      "publication": {
        "status": "waiting"
      },
      "compatibility": {
        "status": "retired_archive",
        "production_write": "disabled",
        "active_consumers": 0,
        "blocking": false,
        "warnings": []
      }
    },
    "pipelineMeta": {
      "version": "OPS-V2.0.0-v4-telemetry",
      "generatedAt": "2026-08-03T02:06:03.559Z",
      "dateRange": {
        "start": "2026-07-28",
        "end": "2026-08-03"
      },
      "source": "Data Center V4 manifest + collection-telemetry-v1",
      "telemetryVersion": "COLLECTION-TELEMETRY-V1.0"
    },
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
    "engineQuality": {}
  },
  "governance": {
    "versions": [
      {
        "key": "SITE",
        "label": "Main website",
        "value": "SITE-V4.4.1-china-market-scope"
      },
      {
        "key": "OPS",
        "label": "Operations backend",
        "value": "OPS-V2.0.0-v4-telemetry"
      },
      {
        "key": "BSIG",
        "label": "Business Signals",
        "value": "BSIG-V2.2.0-pipeline-stage-ownership"
      },
      {
        "key": "TAG",
        "label": "Tag taxonomy",
        "value": "TAG-V4.1"
      },
      {
        "key": "FLV",
        "label": "First-Line Viewpoints",
        "value": "FLV-V1.1.0-history-backfill"
      },
      {
        "key": "CINT",
        "label": "Community Intelligence",
        "value": "CINT-V1.0.2-publication-waiting-gate"
      },
      {
        "key": "FDE",
        "label": "Enterprise AI / FDE data contract",
        "value": "FDE-V2.0"
      },
      {
        "key": "EAI",
        "label": "Enterprise AI compatibility lens",
        "value": ""
      },
      {
        "key": "HARDWARE",
        "label": "AI Hardware data",
        "value": "HARDWARE-V1.0"
      },
      {
        "key": "REPORTS",
        "label": "Guanlan Research",
        "value": "REPORTS-V1.2.0-research-hub"
      },
      {
        "key": "OMAP",
        "label": "Opportunity Map",
        "value": "OMAP-V2.0.0-v4-evidence"
      },
      {
        "key": "TRADAR",
        "label": "Trend Radar",
        "value": "TRADAR-V1.1.0-tag-v4-1"
      },
      {
        "key": "RAW",
        "label": "Data Center Raw contract",
        "value": "RAW-V4.0"
      },
      {
        "key": "EVENT",
        "label": "Canonical event contract",
        "value": "EVENT-V1.1"
      },
      {
        "key": "ENTITY",
        "label": "Entity history contract",
        "value": "ENTITY-V1.0"
      },
      {
        "key": "PERSON",
        "label": "Person-account review contract",
        "value": "PERSON-REVIEW-V1.1"
      },
      {
        "key": "RELATION",
        "label": "Factual relationship contract",
        "value": "RELATION-V2.1"
      },
      {
        "key": "BACKFILL",
        "label": "Targeted historical collection contract",
        "value": "BACKFILL-V1.0"
      },
      {
        "key": "SKILL",
        "label": "Skill Store",
        "value": "v2.0.1 GPT-5.6 full-audit corrections"
      }
    ],
    "principles": [
      "问题先进入问题中心，不在聊天里丢失",
      "每个问题必须有责任链路、下一步动作和关闭证据",
      "重复问题进入周/月复盘，不靠当天修补结束",
      "创作相关能力从本后台剥离，后台只治理数据观察台"
    ]
  }
};
