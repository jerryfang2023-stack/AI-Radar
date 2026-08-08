window.WaveSightOpsConsole = {
  "meta": {
    "version": "OPS-V2.0.0-v4-telemetry",
    "generatedAt": "2026-08-08T01:19:35.898Z",
    "date": "2026-08-08",
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
    "date": "2026-08-08",
    "status": "passed",
    "statusText": "已通过",
    "issueSummary": {
      "total": 9,
      "daily": 0,
      "open": 0,
      "resolved": 9,
      "urgent": 0
    },
    "issues": []
  },
  "periods": {
    "weekly": {
      "windowDays": 7,
      "total": 5,
      "open": 0,
      "resolved": 5,
      "byLane": {
        "business_signals": 3,
        "skill_ops": 2
      },
      "byCategory": {
        "recurring_automation_issue": 5
      },
      "recurring": [
        {
          "category": "recurring_automation_issue",
          "count": 5
        }
      ],
      "latest": [
        {
          "id": "2026-08-05-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-05",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-03",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-05T08:45:39.932Z",
          "updatedAt": "2026-08-06T12:38:23+08:00",
          "resolvedAt": "2026-08-06T12:38:23+08:00",
          "resolver": "codex",
          "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
          "validation": "npm run audit:workspace after commit; npm run assert:data-center -- --date=2026-08-06 passed after private evidence sync",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-business-signals-recurring-05f820ce67869f02.md"
        },
        {
          "id": "2026-08-05-skill-ops-recurring-042a16c9ca245da3",
          "date": "2026-08-05",
          "title": "Recurring problem: skill_ops",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "skill_ops",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-05",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-05T08:45:39.933Z",
          "updatedAt": "2026-08-06T12:35:48+08:00",
          "resolvedAt": "2026-08-06T12:35:48+08:00",
          "resolver": "codex",
          "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
          "validation": "npm run audit:skills passed; repo runtime drift 0",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-042a16c9ca245da3.md"
        },
        {
          "id": "2026-08-05-skill-ops-recurring-779272b982471f71",
          "date": "2026-08-05",
          "title": "Recurring problem: skill_ops",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "skill_ops",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-05",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-05T08:45:39.934Z",
          "updatedAt": "2026-08-06T12:35:48+08:00",
          "resolvedAt": "2026-08-06T12:35:48+08:00",
          "resolver": "codex",
          "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
          "validation": "npm run audit:skills passed; repo runtime drift 0",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-779272b982471f71.md"
        },
        {
          "id": "2026-08-04-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-04",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-04",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-04T08:45:44.932Z",
          "updatedAt": "2026-08-04T17:55:34+08:00",
          "resolvedAt": "2026-08-04T17:55:34+08:00",
          "resolver": "codex",
          "fixCommit": "a7eebed44fc27862d95b2966e09a193723819209",
          "validation": "isolated same-date Follow-Builders rerun added zero worktree changes; npm test passed; community and first-line gates passed; final-closure business_signals and follow_builders_skill passed with local dirtyFiles=0",
          "prevention": "context/08-automation.md Follow-Builders runtime worktree isolation contract plus daily-automation-runtime regression test",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-04-business-signals-recurring-05f820ce67869f02.md"
        },
        {
          "id": "2026-08-02-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-02",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-02",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-02T08:45:37.557Z",
          "updatedAt": "2026-08-04T13:04:16+08:00",
          "resolvedAt": "2026-08-04T13:04:16+08:00",
          "resolver": "codex",
          "fixCommit": "4ce8b1c5415f12ef151f235d90187b09389a7222",
          "validation": "2026-08-04 final-closure passed business_signals; V4 integrity passed; Pages success; local dirtyFiles=0 and fastForwarded=true; npm run assert:windows-automation passed 7/7",
          "prevention": "context/08-automation.md runtime isolation contract plus assert:windows-automation scheduled-task gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-02-business-signals-recurring-05f820ce67869f02.md"
        }
      ]
    },
    "monthly": {
      "windowDays": 30,
      "total": 9,
      "open": 0,
      "resolved": 9,
      "byLane": {
        "community_intelligence": 2,
        "skill_ops": 3,
        "business_signals": 4
      },
      "byCategory": {
        "recurring_automation_issue": 8,
        "weekly_learning_loop": 1
      },
      "recurring": [
        {
          "category": "recurring_automation_issue",
          "count": 8
        }
      ],
      "latest": [
        {
          "id": "2026-08-05-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-05",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-03",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-05T08:45:39.932Z",
          "updatedAt": "2026-08-06T12:38:23+08:00",
          "resolvedAt": "2026-08-06T12:38:23+08:00",
          "resolver": "codex",
          "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
          "validation": "npm run audit:workspace after commit; npm run assert:data-center -- --date=2026-08-06 passed after private evidence sync",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-business-signals-recurring-05f820ce67869f02.md"
        },
        {
          "id": "2026-08-05-skill-ops-recurring-042a16c9ca245da3",
          "date": "2026-08-05",
          "title": "Recurring problem: skill_ops",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "skill_ops",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-05",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-05T08:45:39.933Z",
          "updatedAt": "2026-08-06T12:35:48+08:00",
          "resolvedAt": "2026-08-06T12:35:48+08:00",
          "resolver": "codex",
          "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
          "validation": "npm run audit:skills passed; repo runtime drift 0",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-042a16c9ca245da3.md"
        },
        {
          "id": "2026-08-05-skill-ops-recurring-779272b982471f71",
          "date": "2026-08-05",
          "title": "Recurring problem: skill_ops",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "skill_ops",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-05",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-05T08:45:39.934Z",
          "updatedAt": "2026-08-06T12:35:48+08:00",
          "resolvedAt": "2026-08-06T12:35:48+08:00",
          "resolver": "codex",
          "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
          "validation": "npm run audit:skills passed; repo runtime drift 0",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-779272b982471f71.md"
        },
        {
          "id": "2026-08-04-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-04",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-04",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-04T08:45:44.932Z",
          "updatedAt": "2026-08-04T17:55:34+08:00",
          "resolvedAt": "2026-08-04T17:55:34+08:00",
          "resolver": "codex",
          "fixCommit": "a7eebed44fc27862d95b2966e09a193723819209",
          "validation": "isolated same-date Follow-Builders rerun added zero worktree changes; npm test passed; community and first-line gates passed; final-closure business_signals and follow_builders_skill passed with local dirtyFiles=0",
          "prevention": "context/08-automation.md Follow-Builders runtime worktree isolation contract plus daily-automation-runtime regression test",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-04-business-signals-recurring-05f820ce67869f02.md"
        },
        {
          "id": "2026-08-02-business-signals-recurring-05f820ce67869f02",
          "date": "2026-08-02",
          "title": "Recurring warning: business_signals",
          "status": "resolved",
          "state": "resolved",
          "priority": "normal",
          "laneId": "business_signals",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "runtime://daily-supervision/2026-08-02",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-08-02T08:45:37.557Z",
          "updatedAt": "2026-08-04T13:04:16+08:00",
          "resolvedAt": "2026-08-04T13:04:16+08:00",
          "resolver": "codex",
          "fixCommit": "4ce8b1c5415f12ef151f235d90187b09389a7222",
          "validation": "2026-08-04 final-closure passed business_signals; V4 integrity passed; Pages success; local dirtyFiles=0 and fastForwarded=true; npm run assert:windows-automation passed 7/7",
          "prevention": "context/08-automation.md runtime isolation contract plus assert:windows-automation scheduled-task gate",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-02-business-signals-recurring-05f820ce67869f02.md"
        },
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
    }
  },
  "inbox": {
    "open": [],
    "resolved": [
      {
        "id": "2026-08-05-business-signals-recurring-05f820ce67869f02",
        "date": "2026-08-05",
        "title": "Recurring warning: business_signals",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "runtime://daily-supervision/2026-08-03",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-08-05T08:45:39.932Z",
        "updatedAt": "2026-08-06T12:38:23+08:00",
        "resolvedAt": "2026-08-06T12:38:23+08:00",
        "resolver": "codex",
        "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
        "validation": "npm run audit:workspace after commit; npm run assert:data-center -- --date=2026-08-06 passed after private evidence sync",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-business-signals-recurring-05f820ce67869f02.md"
      },
      {
        "id": "2026-08-05-skill-ops-recurring-042a16c9ca245da3",
        "date": "2026-08-05",
        "title": "Recurring problem: skill_ops",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "runtime://daily-supervision/2026-08-05",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-08-05T08:45:39.933Z",
        "updatedAt": "2026-08-06T12:35:48+08:00",
        "resolvedAt": "2026-08-06T12:35:48+08:00",
        "resolver": "codex",
        "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
        "validation": "npm run audit:skills passed; repo runtime drift 0",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-042a16c9ca245da3.md"
      },
      {
        "id": "2026-08-05-skill-ops-recurring-779272b982471f71",
        "date": "2026-08-05",
        "title": "Recurring problem: skill_ops",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "runtime://daily-supervision/2026-08-05",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-08-05T08:45:39.934Z",
        "updatedAt": "2026-08-06T12:35:48+08:00",
        "resolvedAt": "2026-08-06T12:35:48+08:00",
        "resolver": "codex",
        "fixCommit": "2d30a70b386487f4c0492dd8c2902f24381fc1fd",
        "validation": "npm run audit:skills passed; repo runtime drift 0",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-05-skill-ops-recurring-779272b982471f71.md"
      },
      {
        "id": "2026-08-04-business-signals-recurring-05f820ce67869f02",
        "date": "2026-08-04",
        "title": "Recurring warning: business_signals",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "runtime://daily-supervision/2026-08-04",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-08-04T08:45:44.932Z",
        "updatedAt": "2026-08-04T17:55:34+08:00",
        "resolvedAt": "2026-08-04T17:55:34+08:00",
        "resolver": "codex",
        "fixCommit": "a7eebed44fc27862d95b2966e09a193723819209",
        "validation": "isolated same-date Follow-Builders rerun added zero worktree changes; npm test passed; community and first-line gates passed; final-closure business_signals and follow_builders_skill passed with local dirtyFiles=0",
        "prevention": "context/08-automation.md Follow-Builders runtime worktree isolation contract plus daily-automation-runtime regression test",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-04-business-signals-recurring-05f820ce67869f02.md"
      },
      {
        "id": "2026-08-02-business-signals-recurring-05f820ce67869f02",
        "date": "2026-08-02",
        "title": "Recurring warning: business_signals",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "runtime://daily-supervision/2026-08-02",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-08-02T08:45:37.557Z",
        "updatedAt": "2026-08-04T13:04:16+08:00",
        "resolvedAt": "2026-08-04T13:04:16+08:00",
        "resolver": "codex",
        "fixCommit": "4ce8b1c5415f12ef151f235d90187b09389a7222",
        "validation": "2026-08-04 final-closure passed business_signals; V4 integrity passed; Pages success; local dirtyFiles=0 and fastForwarded=true; npm run assert:windows-automation passed 7/7",
        "prevention": "context/08-automation.md runtime isolation contract plus assert:windows-automation scheduled-task gate",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-08-02-business-signals-recurring-05f820ce67869f02.md"
      },
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
            "value": 86
          },
          {
            "label": "Events",
            "value": 33
          },
          {
            "label": "QA",
            "value": 228
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
        "status": "partial",
        "counts": {
          "discovered": 290,
          "capture_succeeded": 261,
          "capture_failed": 5,
          "raw_documents": 261
        },
        "evidence": [
          "01-SiteV2/content/11-databases/data-center-v4/2026-08-08/manifest.json",
          "agent-workflow/reports/2026-08-08-guanlan-daily-monitor-log.md"
        ]
      },
      {
        "id": "fact_build",
        "label": "事实构建",
        "status": "passed",
        "counts": {
          "accepted_claims": 86,
          "rejected_claims": 0,
          "accepted": 86,
          "rejected": 0,
          "pending_claims": 5,
          "canonical_events": 33,
          "entities": 55,
          "relationships": 91,
          "conflicts": 0,
          "qa_queue": 228
        },
        "evidence": [
          "01-SiteV2/content/11-databases/data-center-v4/2026-08-08/manifest.json",
          "agent-workflow/reports/2026-08-08-data-center-v4-integrity-gate.json"
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
          "agent-workflow/reports/2026-08-08-persistent-asset-manifest.json"
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
          "agent-workflow/reports/2026-08-08-persistent-asset-manifest.json"
        ]
      }
    ],
    "latestProduction": {
      "date": "2026-08-08",
      "discovered": 261,
      "captured": 261,
      "claims": 91,
      "events": 33,
      "entities": 55,
      "relationships": 91
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
        "detail": "2026-08-08T01:19:35.859Z"
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
        "data_date": "2026-08-08",
        "generated_at": "2026-08-08T01:19:35.814Z",
        "scope": "OPS",
        "canonical_writeback": false,
        "source_of_truth": "Data Center V4 manifest and integrity gate"
      },
      "collection": {
        "discovered": 290,
        "capture_succeeded": 261,
        "capture_failed": 5,
        "raw_documents": 261
      },
      "factBuild": {
        "accepted_claims": 86,
        "rejected_claims": 0,
        "accepted": 86,
        "rejected": 0,
        "pending_claims": 5,
        "canonical_events": 33,
        "entities": 55,
        "relationships": 91,
        "conflicts": 0,
        "qa_queue": 228,
        "qa_by_status": {
          "review_optional": 210,
          "open": 18
        }
      },
      "v4Gate": {
        "status": "passed",
        "manifest_date": "2026-08-08",
        "gate_date": "2026-08-08",
        "failures": [],
        "warnings": [
          "No source-bounded FDE projection was produced."
        ]
      },
      "applicationProjection": {
        "opportunity_map": "passed",
        "trend_radar": "passed",
        "funding_insights": "failed",
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
      "generatedAt": "2026-08-08T01:19:35.859Z",
      "dateRange": {
        "start": "2026-08-02",
        "end": "2026-08-08"
      },
      "source": "Data Center V4 manifest + collection-telemetry-v1",
      "telemetryVersion": "COLLECTION-TELEMETRY-V1.0"
    },
    "latest": {
      "date": "2026-08-08",
      "label": "2026.08.08",
      "shortLabel": "08.08",
      "discovered": 261,
      "captured": 261,
      "claims": 91,
      "events": 33,
      "entities": 55,
      "relationships": 91,
      "conflicts": 0,
      "qaQueue": 228,
      "telemetryDate": "2026-08-08",
      "collection": {
        "discovered": 290,
        "capture_succeeded": 261,
        "capture_failed": 5,
        "raw_documents": 261
      },
      "factBuild": {
        "accepted_claims": 86,
        "rejected_claims": 0,
        "accepted": 86,
        "rejected": 0,
        "pending_claims": 5,
        "canonical_events": 33,
        "entities": 55,
        "relationships": 91,
        "conflicts": 0,
        "qa_queue": 228,
        "qa_by_status": {
          "review_optional": 210,
          "open": 18
        }
      },
      "applicationProjection": {
        "opportunity_map": "passed",
        "trend_radar": "passed",
        "funding_insights": "failed",
        "fde_hardware_sync": "passed"
      },
      "publication": {
        "status": "waiting"
      }
    },
    "totals": {
      "discovered": 1734,
      "captured": 1734,
      "claims": 622,
      "events": 209,
      "entities": 322,
      "relationships": 622,
      "conflicts": 0,
      "qaQueue": 1527
    },
    "days": [
      {
        "date": "2026-08-08",
        "label": "2026.08.08",
        "shortLabel": "08.08",
        "discovered": 261,
        "captured": 261,
        "claims": 91,
        "events": 33,
        "entities": 55,
        "relationships": 91,
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
      },
      {
        "date": "2026-08-03",
        "label": "2026.08.03",
        "shortLabel": "08.03",
        "discovered": 243,
        "captured": 243,
        "claims": 151,
        "events": 44,
        "entities": 75,
        "relationships": 151,
        "conflicts": 0,
        "qaQueue": 199
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
