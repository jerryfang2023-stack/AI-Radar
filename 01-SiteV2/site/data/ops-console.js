window.WaveSightOpsConsole = {
  "meta": {
    "version": "OPS-V1.2.3-content-factory-cleanout",
    "generatedAt": "2026-07-26T15:29:38.219Z",
    "date": "2026-07-26",
    "sources": [
      "agent-workflow/reports/daily-supervision-report-latest.json",
      "01-SiteV2/site/data/pipeline-dashboard.json",
      "context/version-ledger.md",
      "agent-workflow/inbox/production-incidents/*.md",
      "agent-workflow/inbox/hermes-to-codex/*.md"
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
    "date": "2026-07-26",
    "status": "failed",
    "statusText": "失败",
    "issueSummary": {
      "total": 60,
      "daily": 8,
      "open": 9,
      "resolved": 51,
      "urgent": 4
    },
    "issues": [
      {
        "id": "supervision-2026-07-26-community_intelligence-warning-0",
        "date": "2026-07-26",
        "title": "community scheduled task last result is 1, but same-date data and gate are healthy",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "community_intelligence",
        "lane": "Community Intelligence",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-0",
        "date": "2026-07-26",
        "title": "business-signal activeDate is 2026-07-25, expected 2026-07-26",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-1",
        "date": "2026-07-26",
        "title": "public Card count is 0 for 2026-07-26",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-2",
        "date": "2026-07-26",
        "title": "no same-date signal Card files or frontstage Core Signal Cards",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-3",
        "date": "2026-07-26",
        "title": "Business Signals workflow conclusion is failure",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-warning-0",
        "date": "2026-07-26",
        "title": "missing same-date persistent asset manifest: agent-workflow/reports/2026-07-26-persistent-asset-manifest.json",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-warning-1",
        "date": "2026-07-26",
        "title": "missing quality gate report: agent-workflow/reports/2026-07-26-guanlan-monitor-quality-gate.md",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-warning-2",
        "date": "2026-07-26",
        "title": "local Obsidian sync may be blocked by 44 dirty file(s)",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      }
    ]
  },
  "periods": {
    "weekly": {
      "windowDays": 7,
      "total": 13,
      "open": 9,
      "resolved": 4,
      "byLane": {
        "community_intelligence": 3,
        "business_signals": 9,
        "follow_builders_skill": 1
      },
      "byCategory": {
        "warning": 4,
        "failed": 4,
        "recurring_automation_issue": 1,
        "afternoon_skill_runner": 1,
        "no_run_or_stale_assets": 2,
        "community_intelligence": 1
      },
      "recurring": [
        {
          "category": "warning",
          "count": 4
        },
        {
          "category": "failed",
          "count": 4
        },
        {
          "category": "no_run_or_stale_assets",
          "count": 2
        }
      ],
      "latest": [
        {
          "id": "2026-07-26-community-intelligence-recurring-73a400f41c5af405",
          "date": "2026-07-26",
          "title": "Recurring warning: community_intelligence",
          "status": "open",
          "state": "open",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-26T08:45:31.857Z",
          "updatedAt": "",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-community-intelligence-recurring-73a400f41c5af405.md"
        },
        {
          "id": "supervision-2026-07-26-community_intelligence-warning-0",
          "date": "2026-07-26",
          "title": "community scheduled task last result is 1, but same-date data and gate are healthy",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "community_intelligence",
          "lane": "Community Intelligence",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-0",
          "date": "2026-07-26",
          "title": "business-signal activeDate is 2026-07-25, expected 2026-07-26",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-1",
          "date": "2026-07-26",
          "title": "public Card count is 0 for 2026-07-26",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-2",
          "date": "2026-07-26",
          "title": "no same-date signal Card files or frontstage Core Signal Cards",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-3",
          "date": "2026-07-26",
          "title": "Business Signals workflow conclusion is failure",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-warning-0",
          "date": "2026-07-26",
          "title": "missing same-date persistent asset manifest: agent-workflow/reports/2026-07-26-persistent-asset-manifest.json",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-warning-1",
          "date": "2026-07-26",
          "title": "missing quality gate report: agent-workflow/reports/2026-07-26-guanlan-monitor-quality-gate.md",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-warning-2",
          "date": "2026-07-26",
          "title": "local Obsidian sync may be blocked by 44 dirty file(s)",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "2026-07-25-business_signals-no-run-or-stale-assets",
          "date": "2026-07-25",
          "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
          "status": "manual_archive",
          "state": "resolved",
          "priority": "urgent",
          "laneId": "business_signals",
          "category": "no_run_or_stale_assets",
          "failedGate": "missing",
          "reportPath": "agent-workflow/reports/2026-07-25-daily-supervision-report.md",
          "dataGenerated": "no_or_stale",
          "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
          "createdAt": "2026-07-25T10:03:54+08:00",
          "updatedAt": "2026-07-25T10:44:38+08:00",
          "resolvedAt": "2026-07-25T10:44:38+08:00",
          "resolver": "codex",
          "fixCommit": "pending-local-change",
          "validation": "HERMES-V4.0 control-plane-only migration",
          "prevention": "context",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-25-business_signals-no-run-or-stale-assets.md"
        },
        {
          "id": "2026-07-25-community_intelligence-community-intelligence",
          "date": "2026-07-25",
          "title": "Hermes Repair Request: Community Intelligence",
          "status": "manual_archive",
          "state": "resolved",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "community_intelligence",
          "failedGate": "agent-workflow/reports/2026-07-25-community-intelligence-gate.md",
          "reportPath": "agent-workflow/reports/2026-07-25-daily-supervision-report.md",
          "dataGenerated": "yes",
          "neededAction": "inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-community-intelligence-pr.yml` only after local collection and archive pass",
          "createdAt": "2026-07-25T10:03:54+08:00",
          "updatedAt": "2026-07-25T10:44:38+08:00",
          "resolvedAt": "2026-07-25T10:44:38+08:00",
          "resolver": "codex",
          "fixCommit": "pending-local-change",
          "validation": "HERMES-V4.0 control-plane-only migration",
          "prevention": "context",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-25-community_intelligence-community-intelligence.md"
        },
        {
          "id": "2026-07-24-business_signals-no-run-or-stale-assets",
          "date": "2026-07-24",
          "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
          "status": "resolved",
          "state": "resolved",
          "priority": "urgent",
          "laneId": "business_signals",
          "category": "no_run_or_stale_assets",
          "failedGate": "missing",
          "reportPath": "agent-workflow/reports/2026-07-24-daily-supervision-report.md",
          "dataGenerated": "no_or_stale",
          "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
          "createdAt": "2026-07-24T16:54:08+08:00",
          "updatedAt": "2026-07-24T21:22:21+08:00",
          "resolvedAt": "2026-07-24T21:22:21+08:00",
          "resolver": "codex",
          "fixCommit": "pending",
          "validation": "38-card editorial, unified frontstage, and pre-commit gates passed",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-24-business_signals-no-run-or-stale-assets.md"
        }
      ]
    },
    "monthly": {
      "windowDays": 30,
      "total": 27,
      "open": 9,
      "resolved": 18,
      "byLane": {
        "community_intelligence": 5,
        "business_signals": 15,
        "skill_ops": 3,
        "follow_builders_skill": 3,
        "first_line_viewpoints": 1
      },
      "byCategory": {
        "warning": 4,
        "failed": 4,
        "recurring_automation_issue": 1,
        "business_signals_top10_missing": 1,
        "monitor_or_gate_failure": 5,
        "no_run_or_stale_assets": 5,
        "community_intelligence": 2,
        "core_supply_shortfall": 1,
        "daily_problem_watchdog": 1,
        "skill_ops": 1,
        "first_line_viewpoints": 1,
        "afternoon_skill_runner": 1
      },
      "recurring": [
        {
          "category": "monitor_or_gate_failure",
          "count": 5
        },
        {
          "category": "no_run_or_stale_assets",
          "count": 5
        },
        {
          "category": "warning",
          "count": 4
        },
        {
          "category": "failed",
          "count": 4
        },
        {
          "category": "community_intelligence",
          "count": 2
        }
      ],
      "latest": [
        {
          "id": "2026-07-26-community-intelligence-recurring-73a400f41c5af405",
          "date": "2026-07-26",
          "title": "Recurring warning: community_intelligence",
          "status": "open",
          "state": "open",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "recurring_automation_issue",
          "failedGate": "repeated daily supervision signal",
          "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
          "dataGenerated": "inspect linked daily reports",
          "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
          "createdAt": "2026-07-26T08:45:31.857Z",
          "updatedAt": "",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-community-intelligence-recurring-73a400f41c5af405.md"
        },
        {
          "id": "supervision-2026-07-26-community_intelligence-warning-0",
          "date": "2026-07-26",
          "title": "community scheduled task last result is 1, but same-date data and gate are healthy",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "community_intelligence",
          "lane": "Community Intelligence",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-0",
          "date": "2026-07-26",
          "title": "business-signal activeDate is 2026-07-25, expected 2026-07-26",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-1",
          "date": "2026-07-26",
          "title": "public Card count is 0 for 2026-07-26",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-2",
          "date": "2026-07-26",
          "title": "no same-date signal Card files or frontstage Core Signal Cards",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-problem-3",
          "date": "2026-07-26",
          "title": "Business Signals workflow conclusion is failure",
          "status": "failed",
          "state": "open",
          "priority": "urgent",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "failed",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-warning-0",
          "date": "2026-07-26",
          "title": "missing same-date persistent asset manifest: agent-workflow/reports/2026-07-26-persistent-asset-manifest.json",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-warning-1",
          "date": "2026-07-26",
          "title": "missing quality gate report: agent-workflow/reports/2026-07-26-guanlan-monitor-quality-gate.md",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "supervision-2026-07-26-business_signals-warning-2",
          "date": "2026-07-26",
          "title": "local Obsidian sync may be blocked by 44 dirty file(s)",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals compatibility / Operations",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "send Codex a business_signals repair request with failed gate and report path",
          "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
        },
        {
          "id": "2026-07-25-business_signals-no-run-or-stale-assets",
          "date": "2026-07-25",
          "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
          "status": "manual_archive",
          "state": "resolved",
          "priority": "urgent",
          "laneId": "business_signals",
          "category": "no_run_or_stale_assets",
          "failedGate": "missing",
          "reportPath": "agent-workflow/reports/2026-07-25-daily-supervision-report.md",
          "dataGenerated": "no_or_stale",
          "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
          "createdAt": "2026-07-25T10:03:54+08:00",
          "updatedAt": "2026-07-25T10:44:38+08:00",
          "resolvedAt": "2026-07-25T10:44:38+08:00",
          "resolver": "codex",
          "fixCommit": "pending-local-change",
          "validation": "HERMES-V4.0 control-plane-only migration",
          "prevention": "context",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-25-business_signals-no-run-or-stale-assets.md"
        },
        {
          "id": "2026-07-25-community_intelligence-community-intelligence",
          "date": "2026-07-25",
          "title": "Hermes Repair Request: Community Intelligence",
          "status": "manual_archive",
          "state": "resolved",
          "priority": "normal",
          "laneId": "community_intelligence",
          "category": "community_intelligence",
          "failedGate": "agent-workflow/reports/2026-07-25-community-intelligence-gate.md",
          "reportPath": "agent-workflow/reports/2026-07-25-daily-supervision-report.md",
          "dataGenerated": "yes",
          "neededAction": "inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-community-intelligence-pr.yml` only after local collection and archive pass",
          "createdAt": "2026-07-25T10:03:54+08:00",
          "updatedAt": "2026-07-25T10:44:38+08:00",
          "resolvedAt": "2026-07-25T10:44:38+08:00",
          "resolver": "codex",
          "fixCommit": "pending-local-change",
          "validation": "HERMES-V4.0 control-plane-only migration",
          "prevention": "context",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-25-community_intelligence-community-intelligence.md"
        },
        {
          "id": "2026-07-24-business_signals-no-run-or-stale-assets",
          "date": "2026-07-24",
          "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
          "status": "resolved",
          "state": "resolved",
          "priority": "urgent",
          "laneId": "business_signals",
          "category": "no_run_or_stale_assets",
          "failedGate": "missing",
          "reportPath": "agent-workflow/reports/2026-07-24-daily-supervision-report.md",
          "dataGenerated": "no_or_stale",
          "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
          "createdAt": "2026-07-24T16:54:08+08:00",
          "updatedAt": "2026-07-24T21:22:21+08:00",
          "resolvedAt": "2026-07-24T21:22:21+08:00",
          "resolver": "codex",
          "fixCommit": "pending",
          "validation": "38-card editorial, unified frontstage, and pre-commit gates passed",
          "prevention": "gate",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-24-business_signals-no-run-or-stale-assets.md"
        }
      ]
    }
  },
  "inbox": {
    "open": [
      {
        "id": "supervision-2026-07-26-community_intelligence-warning-0",
        "date": "2026-07-26",
        "title": "community scheduled task last result is 1, but same-date data and gate are healthy",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "community_intelligence",
        "lane": "Community Intelligence",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication check; 16:45 final closure"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-0",
        "date": "2026-07-26",
        "title": "business-signal activeDate is 2026-07-25, expected 2026-07-26",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-1",
        "date": "2026-07-26",
        "title": "public Card count is 0 for 2026-07-26",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-2",
        "date": "2026-07-26",
        "title": "no same-date signal Card files or frontstage Core Signal Cards",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-problem-3",
        "date": "2026-07-26",
        "title": "Business Signals workflow conclusion is failure",
        "status": "failed",
        "state": "open",
        "priority": "urgent",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "failed",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-warning-0",
        "date": "2026-07-26",
        "title": "missing same-date persistent asset manifest: agent-workflow/reports/2026-07-26-persistent-asset-manifest.json",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-warning-1",
        "date": "2026-07-26",
        "title": "missing quality gate report: agent-workflow/reports/2026-07-26-guanlan-monitor-quality-gate.md",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "supervision-2026-07-26-business_signals-warning-2",
        "date": "2026-07-26",
        "title": "local Obsidian sync may be blocked by 44 dirty file(s)",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals compatibility / Operations",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "evidence": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback"
      },
      {
        "id": "2026-07-26-community-intelligence-recurring-73a400f41c5af405",
        "date": "2026-07-26",
        "title": "Recurring warning: community_intelligence",
        "status": "open",
        "state": "open",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "recurring_automation_issue",
        "failedGate": "repeated daily supervision signal",
        "reportPath": "agent-workflow/reports/2026-07-26-daily-supervision-report.json",
        "dataGenerated": "inspect linked daily reports",
        "neededAction": "repair the owning script, gate, eval, memory, or data build path; do not close by editing same-day data only",
        "createdAt": "2026-07-26T08:45:31.857Z",
        "updatedAt": "",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/production-incidents/2026-07-26-community-intelligence-recurring-73a400f41c5af405.md"
      }
    ],
    "resolved": [
      {
        "id": "2026-07-25-business_signals-no-run-or-stale-assets",
        "date": "2026-07-25",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "manual_archive",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "no_run_or_stale_assets",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-07-25-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
        "createdAt": "2026-07-25T10:03:54+08:00",
        "updatedAt": "2026-07-25T10:44:38+08:00",
        "resolvedAt": "2026-07-25T10:44:38+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "HERMES-V4.0 control-plane-only migration",
        "prevention": "context",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-25-business_signals-no-run-or-stale-assets.md"
      },
      {
        "id": "2026-07-25-community_intelligence-community-intelligence",
        "date": "2026-07-25",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "manual_archive",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "community_intelligence",
        "failedGate": "agent-workflow/reports/2026-07-25-community-intelligence-gate.md",
        "reportPath": "agent-workflow/reports/2026-07-25-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-community-intelligence-pr.yml` only after local collection and archive pass",
        "createdAt": "2026-07-25T10:03:54+08:00",
        "updatedAt": "2026-07-25T10:44:38+08:00",
        "resolvedAt": "2026-07-25T10:44:38+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "HERMES-V4.0 control-plane-only migration",
        "prevention": "context",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-25-community_intelligence-community-intelligence.md"
      },
      {
        "id": "2026-07-24-business_signals-no-run-or-stale-assets",
        "date": "2026-07-24",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "no_run_or_stale_assets",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-07-24-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
        "createdAt": "2026-07-24T16:54:08+08:00",
        "updatedAt": "2026-07-24T21:22:21+08:00",
        "resolvedAt": "2026-07-24T21:22:21+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "38-card editorial, unified frontstage, and pre-commit gates passed",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-24-business_signals-no-run-or-stale-assets.md"
      },
      {
        "id": "2026-07-23-follow_builders_skill-afternoon-skill-runner",
        "date": "2026-07-23",
        "title": "Hermes Repair Request: First-Line Viewpoints Skill",
        "status": "resolved",
        "state": "resolved",
        "priority": "high",
        "laneId": "follow_builders_skill",
        "category": "afternoon_skill_runner",
        "failedGate": "agent-workflow/reports/2026-07-23-daily-supervision-report.md",
        "reportPath": "agent-workflow/reports/2026-07-23-daily-supervision-report.md",
        "dataGenerated": "no",
        "neededAction": "repair the existing 16:10 task wake/retry settings and force a post-run Hermes supervision refresh; do not fabricate a historical archive from a later feed",
        "createdAt": "2026-07-24T16:55:00+08:00",
        "updatedAt": "2026-07-24T16:55:19+08:00",
        "resolvedAt": "2026-07-24T16:55:19+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "node --test agent-workflow/tools/tests/daily-supervision-follow-builders.test.mjs; npm run test:data-center-site:core; forced 2026-07-21..24 supervision replay",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-23-follow_builders_skill-afternoon-skill-runner.md"
      },
      {
        "id": "2026-07-19-follow_builders_skill-first-line-viewpoints",
        "date": "2026-07-19",
        "title": "Hermes Repair Request: First-Line Viewpoints Skill",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "follow_builders_skill",
        "category": "first_line_viewpoints",
        "failedGate": "follow_builders_skill daily supervision",
        "reportPath": "agent-workflow/reports/2026-07-19-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "run the local follow-builders skill publisher and inspect the generated publish report",
        "createdAt": "2026-07-19T16:30:45+08:00",
        "updatedAt": "2026-07-19T16:32:47+08:00",
        "resolvedAt": "2026-07-19T16:32:47+08:00",
        "resolver": "codex",
        "fixCommit": "2d090149e8091ce3b4f018e3f07ac078a167d179",
        "validation": "node agent-workflow/tools/assert-follow-builders-data.mjs --date=2026-07-19",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-19-follow_builders_skill-first-line-viewpoints.md"
      },
      {
        "id": "2026-06-29-community_intelligence-community-intelligence",
        "date": "2026-06-29",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "community_intelligence",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "rerun gate",
        "createdAt": "2026-06-29T13:06:03+08:00",
        "updatedAt": "2026-07-19T14:43:37+08:00",
        "resolvedAt": "2026-07-19T14:43:37+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "2026-07-19_community_gate_67_items_77_links",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-community_intelligence-community-intelligence.md"
      },
      {
        "id": "2026-07-02-skill_ops-skill-ops",
        "date": "2026-07-02",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "skill_ops",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-07-02-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-07-02T11:18:08+08:00",
        "updatedAt": "2026-07-19T14:43:36+08:00",
        "resolvedAt": "2026-07-19T14:43:36+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "check:skill-ops_passed_registry_current",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-02-skill_ops-skill-ops.md"
      },
      {
        "id": "2026-07-19-skill_ops-monitor-or-gate-failure",
        "date": "2026-07-19",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "monitor_or_gate_failure",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-07-19-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-07-19T14:41:47+08:00",
        "updatedAt": "2026-07-19T14:43:35+08:00",
        "resolvedAt": "2026-07-19T14:43:35+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "check:skill-ops_passed_and_daily_supervision_healthy",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-19-skill_ops-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-07-04-first_line_viewpoints-monitor-or-gate-failure",
        "date": "2026-07-04",
        "title": "Hermes Repair Request: First-Line Viewpoints",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "first_line_viewpoints",
        "category": "monitor_or_gate_failure",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-07-04-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "inspect the Daily Problem Watchdog inbox report, then dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` only after targeted diagnosis",
        "createdAt": "2026-07-04T11:18:50+08:00",
        "updatedAt": "2026-07-04T11:22:26+08:00",
        "resolvedAt": "2026-07-04T11:22:26+08:00",
        "resolver": "codex",
        "fixCommit": "4563b3cfe479c10acb1661c15e2de518c8e383e7",
        "validation": "node agent-workflow/tools/assert-follow-builders-data.mjs --date=2026-07-04; node agent-workflow/tools/sync-follow-builders-to-opinion-timelines.mjs --from=2026-07-04 --to=2026-07-04 --dry-run=true; npm run supervise:daily -- --date=2026-07-04",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-04-first_line_viewpoints-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-29-follow_builders_skill-monitor-or-gate-failure",
        "date": "2026-06-29",
        "title": "Hermes Repair Request: First-Line Viewpoints Skill",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "follow_builders_skill",
        "category": "monitor_or_gate_failure",
        "failedGate": "follow_builders_skill daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "repair the local follow-builders skill runner or feed preparation before rerunning afternoon publish",
        "createdAt": "2026-06-29T16:40:24+08:00",
        "updatedAt": "2026-07-03T11:20:41+08:00",
        "resolvedAt": "2026-07-03T11:20:41+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "npm run supervise:daily -- --date=2026-06-29",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-follow_builders_skill-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-07-02-business_signals-daily-problem-watchdog",
        "date": "2026-07-02",
        "title": "Business Signals Daily Problem Watchdog (2026-07-02)",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "daily_problem_watchdog",
        "failedGate": "daily_problem_watchdog",
        "reportPath": "agent-workflow/reports/2026-07-02-daily-recovery-watchdog.md",
        "dataGenerated": "unknown",
        "neededAction": "inspect failed production report and repair the smallest responsible stage; do not dispatch a full rerun from Hermes",
        "createdAt": "2026-07-02T02:44:07.950Z",
        "updatedAt": "2026-07-02T11:20:58+08:00",
        "resolvedAt": "2026-07-02T11:20:58+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "npm run supervise:daily -- --date=2026-07-02",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-02-business_signals-daily-problem-watchdog.md"
      },
      {
        "id": "2026-07-02-business_signals-core-supply-shortfall",
        "date": "2026-07-02",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "core_supply_shortfall",
        "failedGate": "passed",
        "reportPath": "agent-workflow/reports/2026-07-02-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "diagnose Raw/Pool/Core/non-large Core counts and refill only the deficient source/channel",
        "createdAt": "2026-07-02T11:18:08+08:00",
        "updatedAt": "2026-07-02T11:20:57+08:00",
        "resolvedAt": "2026-07-02T11:20:57+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "npm run supervise:daily -- --date=2026-07-02",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-02-business_signals-core-supply-shortfall.md"
      },
      {
        "id": "2026-06-30-business_signals-no-run-or-stale-assets",
        "date": "2026-06-30",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "no_run_or_stale_assets",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-30-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
        "createdAt": "2026-06-30T11:19:44+08:00",
        "updatedAt": "2026-06-30T11:31:15+08:00",
        "resolvedAt": "2026-06-30T11:31:15+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-30-business_signals-no-run-or-stale-assets.md"
      },
      {
        "id": "2026-06-29-business_signals-no-run-or-stale-assets",
        "date": "2026-06-29",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "no_run_or_stale_assets",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
        "createdAt": "2026-06-29T13:16:51+08:00",
        "updatedAt": "2026-06-29T15:02:55+08:00",
        "resolvedAt": "2026-06-29T15:02:55+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run assert:business-frontstage -- --date=2026-06-29",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-business_signals-no-run-or-stale-assets.md"
      },
      {
        "id": "2026-06-26-community_intelligence-community-intelligence",
        "date": "2026-06-26",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "community_intelligence",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-26-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "wait and rerun supervision",
        "createdAt": "2026-06-26T11:19:25+08:00",
        "updatedAt": "2026-06-26T11:39:23+08:00",
        "resolvedAt": "2026-06-29T13:22:04+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run assert:community-intelligence -- --date=2026-06-29",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-26-community_intelligence-community-intelligence.md"
      },
      {
        "id": "2026-06-29-community_intelligence-monitor-or-gate-failure",
        "date": "2026-06-29",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "monitor_or_gate_failure",
        "failedGate": "agent-workflow/reports/2026-06-29-community-intelligence-gate.md",
        "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "rerun gate",
        "createdAt": "2026-06-29T13:16:51+08:00",
        "updatedAt": "2026-06-29T13:22:04+08:00",
        "resolvedAt": "2026-06-29T13:22:04+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run assert:community-intelligence -- --date=2026-06-29",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-community_intelligence-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-28-business_signals-no-run-or-stale-assets",
        "date": "2026-06-28",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "no_run_or_stale_assets",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-28-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "sync/fetch current assets first; if still stale, dispatch the Business Signals production workflow",
        "createdAt": "2026-06-28T11:18:49+08:00",
        "updatedAt": "2026-06-28T11:43:28+08:00",
        "resolvedAt": "2026-06-28T11:43:28+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "node agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs --date=2026-06-28 --pass-score=85 --max-cycles=1 --search-limit=200 --search-path-query-limit=5 --gdelt-query-limit=12 --hn-limit=8 --fetch-timeout-ms=20000 --snapshot-timeout-ms=16000 --use-source-artifacts=true --source-artifact-dir=.tmp-gh-run-28309791224/wavesight-business-signals-pr-2026-06-28/agent-workflow/reports/source-runs/2026-06-28 --monitor-timeout-ms=840000",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-28-business_signals-no-run-or-stale-assets.md"
      },
      {
        "id": "2026-06-27-skill_ops-monitor-or-gate-failure",
        "date": "2026-06-27",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "monitor_or_gate_failure",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-27-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-06-27T14:24:06+08:00",
        "updatedAt": "2026-06-27T14:50:46+08:00",
        "resolvedAt": "2026-06-27T14:50:46+08:00",
        "resolver": "codex",
        "fixCommit": "69ddf292",
        "validation": "npm run audit:skills",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-27-skill_ops-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-27-business_signals-business-signals-top10-missing",
        "date": "2026-06-27",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-27-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-27T11:18:25+08:00",
        "updatedAt": "2026-06-27T11:27:17+08:00",
        "resolvedAt": "2026-06-27T11:27:17+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "node agent-workflow/tools/assert-business-signals-frontstage.mjs --date=2026-06-27; node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-06-27 --stage=pre-commit --raw-min=150 --pool-min=75 --block-stale=true; npm run supervise:daily -- --date=2026-06-27",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-27-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-26-skill_ops-monitor-or-gate-failure",
        "date": "2026-06-26",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "monitor_or_gate_failure",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-26-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-06-26T11:37:02+08:00",
        "updatedAt": "2026-06-26T11:46:23+08:00",
        "resolvedAt": "2026-06-26T11:46:23+08:00",
        "resolver": "codex",
        "fixCommit": "343e59abdf4ead1b6a0609a2358c09f3075cfe12",
        "validation": "npm run audit:skills",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-26-skill_ops-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-26-business_signals-business-signals-top10-missing",
        "date": "2026-06-26",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-26-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-26T11:19:25+08:00",
        "updatedAt": "2026-06-26T11:46:22+08:00",
        "resolvedAt": "2026-06-26T11:46:22+08:00",
        "resolver": "codex",
        "fixCommit": "343e59abdf4ead1b6a0609a2358c09f3075cfe12",
        "validation": "node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-06-26 --stage=pre-commit --raw-min=150 --pool-min=75 --block-stale=true",
        "prevention": "eval",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-26-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-25-business_signals-business-signals-top10-missing",
        "date": "2026-06-25",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-25-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-25T11:18:23+08:00",
        "updatedAt": "2026-06-25T11:27:15+08:00",
        "resolvedAt": "2026-06-25T11:27:15+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-06-25 --stage=pre-commit --raw-min=150 --pool-min=75 --block-stale=true",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-25-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-23-skill_ops-obsidian-sync",
        "date": "2026-06-23",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "obsidian_sync",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-23-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-06-23T11:18:10+08:00",
        "updatedAt": "2026-06-23T11:20:38+08:00",
        "resolvedAt": "2026-06-23T11:20:38+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "npm run check:skill-ops -- --json; npm run audit:skills; npm run supervise:daily -- --date=2026-06-23",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-23-skill_ops-obsidian-sync.md"
      },
      {
        "id": "2026-06-17-skill_ops-obsidian-sync",
        "date": "2026-06-17",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "obsidian_sync",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-17-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-06-17T11:19:15+08:00",
        "updatedAt": "2026-06-21T13:37:15+08:00",
        "resolvedAt": "2026-06-21T13:37:15+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run check:skill-ops",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-17-skill_ops-obsidian-sync.md"
      },
      {
        "id": "2026-06-21-skill_ops-obsidian-sync",
        "date": "2026-06-21",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "obsidian_sync",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-21-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-06-21T12:54:37+08:00",
        "updatedAt": "2026-06-21T13:37:15+08:00",
        "resolvedAt": "2026-06-21T13:37:15+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run check:skill-ops",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-21-skill_ops-obsidian-sync.md"
      },
      {
        "id": "2026-06-21-first_line_viewpoints-monitor-or-gate-failure",
        "date": "2026-06-21",
        "title": "Hermes Repair Request: First-Line Viewpoints",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "first_line_viewpoints",
        "category": "monitor_or_gate_failure",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-21-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-first-line-viewpoints-pr.yml` for the production date",
        "createdAt": "2026-06-21T12:54:37+08:00",
        "updatedAt": "2026-06-21T13:26:25+08:00",
        "resolvedAt": "2026-06-21T13:26:25+08:00",
        "resolver": "codex",
        "fixCommit": "25139f9f",
        "validation": "node agent-workflow/tools/assert-follow-builders-data.mjs --date=2026-06-21",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-21-first_line_viewpoints-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-21-business_signals-business-signals-top10-missing",
        "date": "2026-06-21",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-21-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-21T12:57:36+08:00",
        "updatedAt": "2026-06-21T13:18:37+08:00",
        "resolvedAt": "2026-06-21T13:18:37+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run assert:business-frontstage -- --date=2026-06-21",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-21-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-21-business_signals-monitor-or-gate-failure",
        "date": "2026-06-21",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "monitor_or_gate_failure",
        "failedGate": "passed",
        "reportPath": "agent-workflow/reports/2026-06-21-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-21T13:10:21+08:00",
        "updatedAt": "2026-06-21T13:18:37+08:00",
        "resolvedAt": "2026-06-21T13:18:37+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "node agent-workflow/tools/assert-daily-production-chain.mjs --date=2026-06-21 --stage=pre-commit --raw-min=150 --pool-min=75 --block-stale=true",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-21-business_signals-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-21-community_intelligence-monitor-or-gate-failure",
        "date": "2026-06-21",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "monitor_or_gate_failure",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-21-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "rerun gate",
        "createdAt": "2026-06-21T12:57:36+08:00",
        "updatedAt": "2026-06-21T13:18:37+08:00",
        "resolvedAt": "2026-06-21T13:18:37+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "npm run assert:community-intelligence -- --date=2026-06-21",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-21-community_intelligence-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-20-community_intelligence-monitor-or-gate-failure",
        "date": "2026-06-20",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "monitor_or_gate_failure",
        "failedGate": "agent-workflow/reports/2026-06-20-community-intelligence-gate.md",
        "reportPath": "agent-workflow/reports/2026-06-20-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "send Codex a community_intelligence repair request with log and gate report path",
        "createdAt": "2026-06-20T16:23:13+08:00",
        "updatedAt": "2026-06-20T16:29:46+08:00",
        "resolvedAt": "2026-06-20T16:29:46+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "run-community-intelligence + assert-community-intelligence-data passed",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-20-community_intelligence-monitor-or-gate-failure.md"
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
        "status": "warning",
        "statusText": "warning",
        "problemCount": 0,
        "warningCount": 1,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 65
          }
        ]
      },
      {
        "id": "business_signals",
        "label": "Business Signals compatibility / Operations",
        "schedule": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback",
        "status": "failed",
        "statusText": "失败",
        "problemCount": 4,
        "warningCount": 3,
        "actions": [
          "send Codex a business_signals repair request with failed gate and report path"
        ],
        "evidence": [
          {
            "label": "Cards",
            "value": 0
          }
        ]
      },
      {
        "id": "first_line_viewpoints",
        "label": "First-Line Viewpoints",
        "schedule": "08:30 local RSS collection + page build + Obsidian sync; 09:15 conditional fallback; 09:50 consolidated closure",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 62
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
            "value": 35
          }
        ]
      }
    ],
    "latestProduction": {
      "date": "2026-07-25",
      "raw": 163,
      "pool": 150,
      "cards": 28,
      "assets": {
        "case": 7,
        "funding": 4,
        "product-service": 16,
        "opinion": 1
      }
    },
    "sync": [
      {
        "label": "GitHub Pages",
        "status": "passed",
        "detail": "https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/30194231608"
      },
      {
        "label": "Business Signals PR",
        "status": "waiting",
        "detail": "当前监督报告显示未合并或等待中"
      },
      {
        "label": "本地 Obsidian 同步",
        "status": "manual_required",
        "detail": "44 个本地变更阻塞自动判断"
      },
      {
        "label": "Pipeline Dashboard",
        "status": "passed",
        "detail": "2026-07-25T07:22:53.809Z"
      },
      {
        "label": "Daily Supervision",
        "status": "failed",
        "detail": "2026-07-26T08:45:31.578Z"
      }
    ]
  },
  "quality": {
    "pipelineMeta": {
      "generatedAt": "2026-07-25T07:22:53.809Z",
      "dateRange": {
        "start": "2025-10-13",
        "end": "2026-07-25"
      },
      "source": "01-SiteV2/content + 01-SiteV2/knowledge"
    },
    "latest": {
      "date": "2026-07-25",
      "label": "2026.07.25",
      "shortLabel": "07.25",
      "raw": 163,
      "pool": 150,
      "assets": {
        "case": 7,
        "funding": 4,
        "product-service": 16,
        "opinion": 1
      },
      "cards": 28,
      "rawChannels": {
        "aihot": 98,
        "keyword_search": 35,
        "follow_builders": 0
      },
      "poolRoutes": {
        "core_pool": 55,
        "emerging_pool": 17,
        "index_only": 39,
        "watchlist": 56
      },
      "evidenceLevels": {
        "core_evidence_candidate": 100,
        "user_feedback_signal": 12,
        "supporting_evidence": 12,
        "weak_signal": 3,
        "discovery_only": 23
      },
      "sourceLevels": {
        "A": 38,
        "S": 10,
        "B": 101,
        "C": 1
      },
      "sourceTypes": {
        "news": 15,
        "product": 2,
        "web": 96,
        "media": 23,
        "official": 3,
        "developer": 6,
        "analysis": 1,
        "operators": 1,
        "builder": 2,
        "newsletter": 1
      },
      "assetStatus": {
        "case": {
          "published": 7
        },
        "funding": {
          "published": 4
        },
        "product-service": {
          "published": 16
        }
      },
      "assetLevels": {
        "case": {
          "frontstage": 7
        },
        "funding": {
          "frontstage": 4
        },
        "product-service": {
          "frontstage": 16
        }
      },
      "assetEvidenceGates": {
        "case": {
          "core_evidence_passed": 7
        },
        "funding": {
          "core_evidence_passed": 4
        },
        "product-service": {
          "core_evidence_passed": 16
        }
      },
      "assetCopyGates": {}
    },
    "totals": {
      "raw": 9560,
      "pool": 5857,
      "assets": {
        "case": 485,
        "funding": 174,
        "product-service": 477,
        "opinion": 1709,
        "trend": 6,
        "scene": 3,
        "change": 14
      }
    },
    "days": [
      {
        "date": "2026-07-25",
        "label": "2026.07.25",
        "shortLabel": "07.25",
        "raw": 163,
        "pool": 150,
        "assets": {
          "case": 7,
          "funding": 4,
          "product-service": 16,
          "opinion": 1
        },
        "cards": 28,
        "rawChannels": {
          "aihot": 98,
          "keyword_search": 35,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 55,
          "emerging_pool": 17,
          "index_only": 39,
          "watchlist": 56
        },
        "evidenceLevels": {
          "core_evidence_candidate": 100,
          "user_feedback_signal": 12,
          "supporting_evidence": 12,
          "weak_signal": 3,
          "discovery_only": 23
        },
        "sourceLevels": {
          "A": 38,
          "S": 10,
          "B": 101,
          "C": 1
        },
        "sourceTypes": {
          "news": 15,
          "product": 2,
          "web": 96,
          "media": 23,
          "official": 3,
          "developer": 6,
          "analysis": 1,
          "operators": 1,
          "builder": 2,
          "newsletter": 1
        },
        "assetStatus": {
          "case": {
            "published": 7
          },
          "funding": {
            "published": 4
          },
          "product-service": {
            "published": 16
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 7
          },
          "funding": {
            "frontstage": 4
          },
          "product-service": {
            "frontstage": 16
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 7
          },
          "funding": {
            "core_evidence_passed": 4
          },
          "product-service": {
            "core_evidence_passed": 16
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-24",
        "label": "2026.07.24",
        "shortLabel": "07.24",
        "raw": 166,
        "pool": 151,
        "assets": {
          "case": 16,
          "funding": 3,
          "product-service": 19,
          "opinion": 14
        },
        "cards": 52,
        "rawChannels": {
          "aihot": 98,
          "keyword_search": 36,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 54,
          "emerging_pool": 28,
          "index_only": 37,
          "watchlist": 57
        },
        "evidenceLevels": {
          "user_feedback_signal": 11,
          "core_evidence_candidate": 114,
          "supporting_evidence": 9,
          "discovery_only": 17
        },
        "sourceLevels": {
          "B": 108,
          "A": 34,
          "C": 5,
          "S": 4
        },
        "sourceTypes": {
          "web": 95,
          "news": 11,
          "developer": 7,
          "media": 23,
          "marketplace": 2,
          "operators": 5,
          "industry": 1,
          "builder": 1,
          "funding": 1,
          "analysis": 1,
          "newsletter": 2,
          "official": 2
        },
        "assetStatus": {
          "case": {
            "published": 16
          },
          "funding": {
            "published": 3
          },
          "product-service": {
            "published": 19
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 16
          },
          "funding": {
            "frontstage": 3
          },
          "product-service": {
            "frontstage": 19
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 16
          },
          "funding": {
            "core_evidence_passed": 3
          },
          "product-service": {
            "core_evidence_passed": 19
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-23",
        "label": "2026.07.23",
        "shortLabel": "07.23",
        "raw": 163,
        "pool": 155,
        "assets": {
          "case": 11,
          "funding": 9,
          "product-service": 10,
          "opinion": 31
        },
        "cards": 61,
        "rawChannels": {
          "aihot": 92,
          "keyword_search": 39,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 49,
          "index_only": 41,
          "watchlist": 62,
          "emerging_pool": 27
        },
        "evidenceLevels": {
          "core_evidence_candidate": 114,
          "user_feedback_signal": 7,
          "supporting_evidence": 6,
          "community_signal": 1,
          "discovery_only": 27
        },
        "sourceLevels": {
          "A": 33,
          "S": 18,
          "B": 97,
          "C": 7
        },
        "sourceTypes": {
          "news": 12,
          "developer": 10,
          "product": 2,
          "web": 87,
          "builder": 4,
          "official": 10,
          "media": 21,
          "operators": 7,
          "marketplace": 1,
          "newsletter": 1
        },
        "assetStatus": {
          "case": {
            "published": 11
          },
          "funding": {
            "published": 9
          },
          "product-service": {
            "published": 10
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 11
          },
          "funding": {
            "frontstage": 9
          },
          "product-service": {
            "frontstage": 10
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 11
          },
          "funding": {
            "core_evidence_passed": 9
          },
          "product-service": {
            "core_evidence_passed": 10
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-22",
        "label": "2026.07.22",
        "shortLabel": "07.22",
        "raw": 164,
        "pool": 152,
        "assets": {
          "opinion": 32
        },
        "cards": 32,
        "rawChannels": {
          "aihot": 112,
          "keyword_search": 20,
          "follow_builders": 0
        },
        "poolRoutes": {
          "index_only": 48,
          "core_pool": 52,
          "emerging_pool": 20,
          "watchlist": 49
        },
        "evidenceLevels": {
          "core_evidence_candidate": 99,
          "user_feedback_signal": 5,
          "supporting_evidence": 12,
          "weak_signal": 1,
          "discovery_only": 35
        },
        "sourceLevels": {
          "B": 99,
          "S": 17,
          "A": 36
        },
        "sourceTypes": {
          "web": 93,
          "developer": 6,
          "news": 10,
          "official": 9,
          "product": 3,
          "media": 26,
          "builder": 2,
          "funding": 1,
          "newsletter": 2
        },
        "assetStatus": {},
        "assetLevels": {},
        "assetEvidenceGates": {},
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-21",
        "label": "2026.07.21",
        "shortLabel": "07.21",
        "raw": 139,
        "pool": 134,
        "assets": {
          "case": 13,
          "funding": 5,
          "product-service": 17,
          "opinion": 40
        },
        "cards": 75,
        "rawChannels": {
          "aihot": 93,
          "keyword_search": 24,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 57,
          "emerging_pool": 28,
          "watchlist": 43,
          "index_only": 31
        },
        "evidenceLevels": {
          "user_feedback_signal": 12,
          "core_evidence_candidate": 88,
          "supporting_evidence": 8,
          "index_only_evidence": 1,
          "discovery_only": 25
        },
        "sourceLevels": {
          "B": 86,
          "A": 30,
          "S": 12,
          "C": 6
        },
        "sourceTypes": {
          "web": 76,
          "news": 11,
          "developer": 6,
          "operators": 6,
          "official": 5,
          "marketplace": 1,
          "media": 19,
          "builder": 4,
          "product": 2,
          "funding": 3,
          "newsletter": 1
        },
        "assetStatus": {
          "case": {
            "published": 13
          },
          "funding": {
            "published": 5
          },
          "product-service": {
            "published": 17
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 13
          },
          "funding": {
            "frontstage": 5
          },
          "product-service": {
            "frontstage": 17
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 13
          },
          "funding": {
            "core_evidence_passed": 5
          },
          "product-service": {
            "core_evidence_passed": 17
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-20",
        "label": "2026.07.20",
        "shortLabel": "07.20",
        "raw": 116,
        "pool": 108,
        "assets": {
          "case": 4,
          "funding": 2,
          "product-service": 12,
          "opinion": 31
        },
        "cards": 49,
        "rawChannels": {
          "aihot": 65,
          "keyword_search": 31,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 51,
          "emerging_pool": 15,
          "watchlist": 38,
          "index_only": 19
        },
        "evidenceLevels": {
          "user_feedback_signal": 7,
          "core_evidence_candidate": 80,
          "community_signal": 1,
          "supporting_evidence": 6,
          "weak_signal": 2,
          "discovery_only": 12
        },
        "sourceLevels": {
          "B": 86,
          "A": 16,
          "C": 4,
          "S": 2
        },
        "sourceTypes": {
          "web": 74,
          "news": 7,
          "developer": 8,
          "marketplace": 3,
          "domestic_vendor": 2,
          "operators": 4,
          "media": 9,
          "official": 1
        },
        "assetStatus": {
          "case": {
            "published": 4
          },
          "funding": {
            "published": 2
          },
          "product-service": {
            "published": 12
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 4
          },
          "funding": {
            "frontstage": 2
          },
          "product-service": {
            "frontstage": 12
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 4
          },
          "funding": {
            "core_evidence_passed": 2
          },
          "product-service": {
            "core_evidence_passed": 12
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-19",
        "label": "2026.07.19",
        "shortLabel": "07.19",
        "raw": 111,
        "pool": 103,
        "assets": {
          "case": 6,
          "funding": 4,
          "product-service": 23,
          "opinion": 32
        },
        "cards": 65,
        "rawChannels": {
          "aihot": 70,
          "keyword_search": 28,
          "follow_builders": 0
        },
        "poolRoutes": {
          "index_only": 13,
          "core_pool": 56,
          "emerging_pool": 13,
          "watchlist": 34
        },
        "evidenceLevels": {
          "user_feedback_signal": 7,
          "core_evidence_candidate": 82,
          "index_only_evidence": 1,
          "supporting_evidence": 4,
          "discovery_only": 9
        },
        "sourceLevels": {
          "B": 77,
          "A": 17,
          "C": 1,
          "S": 8
        },
        "sourceTypes": {
          "web": 74,
          "news": 8,
          "operators": 1,
          "official": 1,
          "developer": 4,
          "media": 9,
          "product": 1,
          "industry": 1,
          "builder": 4
        },
        "assetStatus": {
          "case": {
            "published": 6
          },
          "funding": {
            "published": 4
          },
          "product-service": {
            "published": 23
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 6
          },
          "funding": {
            "frontstage": 4
          },
          "product-service": {
            "frontstage": 23
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 6
          },
          "funding": {
            "core_evidence_passed": 4
          },
          "product-service": {
            "core_evidence_passed": 23
          }
        },
        "assetCopyGates": {}
      }
    ],
    "engineQuality": {
      "updatedAt": "2026-07-25T07:22:54.192Z",
      "sampleNote": "样本为 Raw 条目中的入口命中；同一条 Raw 可能被多个入口标记。",
      "metricNote": "新鲜度按已知发布时间中 48 小时内比例计算；重复率按跨 Raw 归一化 URL / 标题计算；Raw Card 候选率按可进入 core / emerging / user_feedback 或具备卡片可用方向计算。",
      "rows": [
        {
          "id": "tavily",
          "label": "Tavily",
          "total": 117,
          "freshKnown": 0,
          "fresh": 0,
          "duplicates": 2,
          "official": 28,
          "convertible": 65,
          "freshnessRate": null,
          "duplicateRate": 2,
          "officialRate": 24,
          "conversionRate": 56
        },
        {
          "id": "exa",
          "label": "Exa",
          "total": 162,
          "freshKnown": 100,
          "fresh": 1,
          "duplicates": 23,
          "official": 26,
          "convertible": 87,
          "freshnessRate": 1,
          "duplicateRate": 14,
          "officialRate": 16,
          "conversionRate": 54
        },
        {
          "id": "newsapi",
          "label": "NewsAPI",
          "total": 0,
          "freshKnown": 0,
          "fresh": 0,
          "duplicates": 0,
          "official": 0,
          "convertible": 0,
          "freshnessRate": null,
          "duplicateRate": null,
          "officialRate": null,
          "conversionRate": null
        },
        {
          "id": "gdelt",
          "label": "GDELT",
          "total": 811,
          "freshKnown": 111,
          "fresh": 2,
          "duplicates": 131,
          "official": 7,
          "convertible": 295,
          "freshnessRate": 2,
          "duplicateRate": 16,
          "officialRate": 1,
          "conversionRate": 36
        },
        {
          "id": "anysearch",
          "label": "AnySearch",
          "total": 2434,
          "freshKnown": 311,
          "fresh": 65,
          "duplicates": 210,
          "official": 434,
          "convertible": 1257,
          "freshnessRate": 21,
          "duplicateRate": 9,
          "officialRate": 18,
          "conversionRate": 52
        },
        {
          "id": "firecrawl",
          "label": "Firecrawl",
          "total": 2,
          "freshKnown": 0,
          "fresh": 0,
          "duplicates": 0,
          "official": 0,
          "convertible": 2,
          "freshnessRate": null,
          "duplicateRate": 0,
          "officialRate": 0,
          "conversionRate": 100
        },
        {
          "id": "aihot",
          "label": "AI HOT",
          "total": 5442,
          "freshKnown": 4351,
          "fresh": 4291,
          "duplicates": 18,
          "official": 296,
          "convertible": 1842,
          "freshnessRate": 99,
          "duplicateRate": 0,
          "officialRate": 5,
          "conversionRate": 34
        },
        {
          "id": "follow_builders",
          "label": "Follow Builders",
          "total": 153,
          "freshKnown": 105,
          "fresh": 43,
          "duplicates": 37,
          "official": 33,
          "convertible": 42,
          "freshnessRate": 41,
          "duplicateRate": 24,
          "officialRate": 22,
          "conversionRate": 27
        }
      ]
    }
  },
  "governance": {
    "versions": [
      {
        "key": "SITE",
        "label": "Main website",
        "value": "SITE-V4.2.0-entity-history"
      },
      {
        "key": "OPS",
        "label": "Operations backend",
        "value": "OPS-V1.2.3-content-factory-cleanout"
      },
      {
        "key": "BSIG",
        "label": "Business Signals",
        "value": "BSIG-V2.2.0-pipeline-stage-ownership"
      },
      {
        "key": "TAG",
        "label": "Tag taxonomy",
        "value": "TAG-V4.0"
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
        "value": "EAI-V1.2.0-raw-card-ingestion-boundary"
      },
      {
        "key": "HARDWARE",
        "label": "AI Hardware data",
        "value": "HARDWARE-V1.0"
      },
      {
        "key": "REPORTS",
        "label": "Reports Center",
        "value": "REPORTS-V1.0.0-periodic-report-center"
      },
      {
        "key": "OMAP",
        "label": "Opportunity Map",
        "value": "OMAP-V1.1.0-direction-cards"
      },
      {
        "key": "TRADAR",
        "label": "Trend Radar",
        "value": "TRADAR-V1.0.0-factual-change-explorer"
      },
      {
        "key": "RAW",
        "label": "Data Center Raw contract",
        "value": "RAW-V3.0"
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
        "value": "PERSON-REVIEW-V1.0"
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
        "value": "v1.7.0 Funding Insights generation lane"
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
