window.WaveSightOpsConsole = {
  "meta": {
    "version": "OPS-V1.2.3-content-factory-cleanout",
    "generatedAt": "2026-07-02T08:39:51.827Z",
    "date": "2026-07-02",
    "sources": [
      "agent-workflow/reports/daily-supervision-report-latest.json",
      "01-SiteV2/site/data/pipeline-dashboard.json",
      "context/version-ledger.md",
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
    "date": "2026-07-02",
    "status": "manual_required",
    "statusText": "需人工处理",
    "issueSummary": {
      "total": 52,
      "daily": 6,
      "open": 11,
      "resolved": 41,
      "urgent": 1
    },
    "issues": [
      {
        "id": "supervision-2026-07-02-skill_ops-problem-0",
        "date": "2026-07-02",
        "title": "skill-registry.md is stale; run npm run build:skill-registry",
        "status": "manual_required",
        "state": "open",
        "priority": "high",
        "laneId": "skill_ops",
        "lane": "Skill Ops Governance",
        "category": "manual_required",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "evidence": "daily supervision preflight"
      },
      {
        "id": "supervision-2026-07-02-community_intelligence-warning-0",
        "date": "2026-07-02",
        "title": "same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/189",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "community_intelligence",
        "lane": "Community Intelligence",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-0",
        "date": "2026-07-02",
        "title": "signal card files 8 below 10, but source-backed Core Pool Top10 fallback is healthy",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-1",
        "date": "2026-07-02",
        "title": "latest same-date GitHub Pages workflow conclusion is skipped",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-2",
        "date": "2026-07-02",
        "title": "local Obsidian sync may be blocked by 3 dirty file(s)",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-3",
        "date": "2026-07-02",
        "title": "latest Business Signals workflow conclusion is cancelled, but same-date data and gates are healthy; repair branch / PR / publication only",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      }
    ]
  },
  "periods": {
    "weekly": {
      "windowDays": 7,
      "total": 20,
      "open": 9,
      "resolved": 11,
      "byLane": {
        "skill_ops": 4,
        "community_intelligence": 4,
        "business_signals": 11,
        "follow_builders_skill": 1
      },
      "byCategory": {
        "manual_required": 1,
        "warning": 5,
        "business_signals_top10_missing": 2,
        "community_intelligence": 2,
        "monitor_or_gate_failure": 4,
        "no_run_or_stale_assets": 3,
        "core_supply_shortfall": 1,
        "daily_problem_watchdog": 1,
        "skill_ops": 1
      },
      "recurring": [
        {
          "category": "warning",
          "count": 5
        },
        {
          "category": "monitor_or_gate_failure",
          "count": 4
        },
        {
          "category": "no_run_or_stale_assets",
          "count": 3
        },
        {
          "category": "business_signals_top10_missing",
          "count": 2
        },
        {
          "category": "community_intelligence",
          "count": 2
        }
      ],
      "latest": [
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
          "id": "2026-07-02-skill_ops-skill-ops",
          "date": "2026-07-02",
          "title": "Hermes Repair Request: Skill Ops Governance",
          "status": "open",
          "state": "open",
          "priority": "normal",
          "laneId": "skill_ops",
          "category": "skill_ops",
          "failedGate": "skill_ops daily supervision",
          "reportPath": "agent-workflow/reports/2026-07-02-daily-supervision-report.md",
          "dataGenerated": "not_applicable",
          "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
          "createdAt": "2026-07-02T11:18:08+08:00",
          "updatedAt": "2026-07-02T11:20:31+08:00",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-02-skill_ops-skill-ops.md"
        },
        {
          "id": "supervision-2026-07-02-skill_ops-problem-0",
          "date": "2026-07-02",
          "title": "skill-registry.md is stale; run npm run build:skill-registry",
          "status": "manual_required",
          "state": "open",
          "priority": "high",
          "laneId": "skill_ops",
          "lane": "Skill Ops Governance",
          "category": "manual_required",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
          "evidence": "daily supervision preflight"
        },
        {
          "id": "supervision-2026-07-02-community_intelligence-warning-0",
          "date": "2026-07-02",
          "title": "same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/189",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "community_intelligence",
          "lane": "Community Intelligence",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-0",
          "date": "2026-07-02",
          "title": "signal card files 8 below 10, but source-backed Core Pool Top10 fallback is healthy",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-1",
          "date": "2026-07-02",
          "title": "latest same-date GitHub Pages workflow conclusion is skipped",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-2",
          "date": "2026-07-02",
          "title": "local Obsidian sync may be blocked by 3 dirty file(s)",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-3",
          "date": "2026-07-02",
          "title": "latest Business Signals workflow conclusion is cancelled, but same-date data and gates are healthy; repair branch / PR / publication only",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
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
          "id": "2026-06-29-follow_builders_skill-monitor-or-gate-failure",
          "date": "2026-06-29",
          "title": "Hermes Repair Request: First-Line Viewpoints Skill",
          "status": "open",
          "state": "open",
          "priority": "urgent",
          "laneId": "follow_builders_skill",
          "category": "monitor_or_gate_failure",
          "failedGate": "follow_builders_skill daily supervision",
          "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
          "dataGenerated": "yes",
          "neededAction": "send Codex a follow_builders_skill repair request with publish report path",
          "createdAt": "2026-06-29T16:40:24+08:00",
          "updatedAt": "2026-06-29T16:40:24+08:00",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-follow_builders_skill-monitor-or-gate-failure.md"
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
        }
      ]
    },
    "monthly": {
      "windowDays": 30,
      "total": 50,
      "open": 9,
      "resolved": 41,
      "byLane": {
        "skill_ops": 9,
        "community_intelligence": 9,
        "business_signals": 23,
        "first_line_viewpoints": 3,
        "follow_builders_skill": 3,
        "unknown": 1,
        "first_line_viewpoints_skill": 1,
        "site_version": 1
      },
      "byCategory": {
        "manual_required": 1,
        "warning": 5,
        "frontstage Top10 selection": 1,
        "source_first_frontstage_gate + top10 missing": 1,
        "Top10 selection (frontstage data build)": 1,
        "business_signals_top10_missing": 8,
        "monitor_or_gate_failure": 16,
        "first_line_viewpoints": 1,
        "uncategorized": 1,
        "afternoon_skill_check": 1,
        "business_signals_weekend_gate_thresholds_and_broken_rss": 1,
        "site_v337_weekly_report_integration": 1,
        "community_intelligence": 3,
        "obsidian_sync": 3,
        "no_run_or_stale_assets": 3,
        "core_supply_shortfall": 1,
        "daily_problem_watchdog": 1,
        "skill_ops": 1
      },
      "recurring": [
        {
          "category": "monitor_or_gate_failure",
          "count": 16
        },
        {
          "category": "business_signals_top10_missing",
          "count": 8
        },
        {
          "category": "warning",
          "count": 5
        },
        {
          "category": "community_intelligence",
          "count": 3
        },
        {
          "category": "obsidian_sync",
          "count": 3
        },
        {
          "category": "no_run_or_stale_assets",
          "count": 3
        }
      ],
      "latest": [
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
          "id": "2026-07-02-skill_ops-skill-ops",
          "date": "2026-07-02",
          "title": "Hermes Repair Request: Skill Ops Governance",
          "status": "open",
          "state": "open",
          "priority": "normal",
          "laneId": "skill_ops",
          "category": "skill_ops",
          "failedGate": "skill_ops daily supervision",
          "reportPath": "agent-workflow/reports/2026-07-02-daily-supervision-report.md",
          "dataGenerated": "not_applicable",
          "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
          "createdAt": "2026-07-02T11:18:08+08:00",
          "updatedAt": "2026-07-02T11:20:31+08:00",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-02-skill_ops-skill-ops.md"
        },
        {
          "id": "supervision-2026-07-02-skill_ops-problem-0",
          "date": "2026-07-02",
          "title": "skill-registry.md is stale; run npm run build:skill-registry",
          "status": "manual_required",
          "state": "open",
          "priority": "high",
          "laneId": "skill_ops",
          "lane": "Skill Ops Governance",
          "category": "manual_required",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
          "evidence": "daily supervision preflight"
        },
        {
          "id": "supervision-2026-07-02-community_intelligence-warning-0",
          "date": "2026-07-02",
          "title": "same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/189",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "community_intelligence",
          "lane": "Community Intelligence",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-0",
          "date": "2026-07-02",
          "title": "signal card files 8 below 10, but source-backed Core Pool Top10 fallback is healthy",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-1",
          "date": "2026-07-02",
          "title": "latest same-date GitHub Pages workflow conclusion is skipped",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-2",
          "date": "2026-07-02",
          "title": "local Obsidian sync may be blocked by 3 dirty file(s)",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
        },
        {
          "id": "supervision-2026-07-02-business_signals-warning-3",
          "date": "2026-07-02",
          "title": "latest Business Signals workflow conclusion is cancelled, but same-date data and gates are healthy; repair branch / PR / publication only",
          "status": "warning",
          "state": "open",
          "priority": "normal",
          "laneId": "business_signals",
          "lane": "Business Signals / Intelligence Map / Dashboard",
          "category": "warning",
          "source": "daily-supervision",
          "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
          "neededAction": "",
          "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
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
          "id": "2026-06-29-follow_builders_skill-monitor-or-gate-failure",
          "date": "2026-06-29",
          "title": "Hermes Repair Request: First-Line Viewpoints Skill",
          "status": "open",
          "state": "open",
          "priority": "urgent",
          "laneId": "follow_builders_skill",
          "category": "monitor_or_gate_failure",
          "failedGate": "follow_builders_skill daily supervision",
          "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
          "dataGenerated": "yes",
          "neededAction": "send Codex a follow_builders_skill repair request with publish report path",
          "createdAt": "2026-06-29T16:40:24+08:00",
          "updatedAt": "2026-06-29T16:40:24+08:00",
          "resolvedAt": "",
          "resolver": "",
          "fixCommit": "",
          "validation": "",
          "prevention": "",
          "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-follow_builders_skill-monitor-or-gate-failure.md"
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
        }
      ]
    }
  },
  "inbox": {
    "open": [
      {
        "id": "supervision-2026-07-02-skill_ops-problem-0",
        "date": "2026-07-02",
        "title": "skill-registry.md is stale; run npm run build:skill-registry",
        "status": "manual_required",
        "state": "open",
        "priority": "high",
        "laneId": "skill_ops",
        "lane": "Skill Ops Governance",
        "category": "manual_required",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "evidence": "daily supervision preflight"
      },
      {
        "id": "supervision-2026-07-02-community_intelligence-warning-0",
        "date": "2026-07-02",
        "title": "same-date Community Intelligence automation PR already merged: https://github.com/jerryfang2023-stack/AI-Radar/pull/189",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "community_intelligence",
        "lane": "Community Intelligence",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-0",
        "date": "2026-07-02",
        "title": "signal card files 8 below 10, but source-backed Core Pool Top10 fallback is healthy",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-1",
        "date": "2026-07-02",
        "title": "latest same-date GitHub Pages workflow conclusion is skipped",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-2",
        "date": "2026-07-02",
        "title": "local Obsidian sync may be blocked by 3 dirty file(s)",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "supervision-2026-07-02-business_signals-warning-3",
        "date": "2026-07-02",
        "title": "latest Business Signals workflow conclusion is cancelled, but same-date data and gates are healthy; repair branch / PR / publication only",
        "status": "warning",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "lane": "Business Signals / Intelligence Map / Dashboard",
        "category": "warning",
        "source": "daily-supervision",
        "reportPath": "agent-workflow/reports/daily-supervision-report-latest.json",
        "neededAction": "",
        "evidence": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox"
      },
      {
        "id": "2026-07-02-skill_ops-skill-ops",
        "date": "2026-07-02",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "open",
        "state": "open",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "skill_ops",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-07-02-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-07-02T11:18:08+08:00",
        "updatedAt": "2026-07-02T11:20:31+08:00",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-07-02-skill_ops-skill-ops.md"
      },
      {
        "id": "2026-06-29-community_intelligence-community-intelligence",
        "date": "2026-06-29",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "open",
        "state": "open",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "community_intelligence",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "rerun gate",
        "createdAt": "2026-06-29T13:06:03+08:00",
        "updatedAt": "2026-06-29T13:36:22+08:00",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-community_intelligence-community-intelligence.md"
      },
      {
        "id": "2026-06-29-follow_builders_skill-monitor-or-gate-failure",
        "date": "2026-06-29",
        "title": "Hermes Repair Request: First-Line Viewpoints Skill",
        "status": "open",
        "state": "open",
        "priority": "urgent",
        "laneId": "follow_builders_skill",
        "category": "monitor_or_gate_failure",
        "failedGate": "follow_builders_skill daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-29-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "send Codex a follow_builders_skill repair request with publish report path",
        "createdAt": "2026-06-29T16:40:24+08:00",
        "updatedAt": "2026-06-29T16:40:24+08:00",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-29-follow_builders_skill-monitor-or-gate-failure.md"
      },
      {
        "id": "README",
        "date": "",
        "title": "Hermes To Codex Inbox",
        "status": "open",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md",
        "failedGate": "agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md",
        "reportPath": "agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "repair rule",
        "createdAt": "YYYY-MM-DDTHH:mm:ss+08:00",
        "updatedAt": "",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/README.md"
      },
      {
        "id": "TEMPLATE",
        "date": "",
        "title": "Hermes Repair Request",
        "status": "open",
        "state": "open",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "monitor_or_gate_failure",
        "failedGate": "agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md",
        "reportPath": "agent-workflow/reports/YYYY-MM-DD-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "repair rule",
        "createdAt": "YYYY-MM-DDTHH:mm:ss+08:00",
        "updatedAt": "YYYY-MM-DDTHH:mm:ss+08:00",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/TEMPLATE.md"
      }
    ],
    "resolved": [
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
      },
      {
        "id": "2026-06-20-skill_ops-monitor-or-gate-failure",
        "date": "2026-06-20",
        "title": "Hermes Repair Request: Skill Ops Governance",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "skill_ops",
        "category": "monitor_or_gate_failure",
        "failedGate": "skill_ops daily supervision",
        "reportPath": "agent-workflow/reports/2026-06-20-daily-supervision-report.md",
        "dataGenerated": "not_applicable",
        "neededAction": "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
        "createdAt": "2026-06-20T16:23:13+08:00",
        "updatedAt": "2026-06-20T16:29:46+08:00",
        "resolvedAt": "2026-06-20T16:29:46+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "not production blocking; existing skill-store drift remains tracked separately",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-20-skill_ops-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-20-business_signals-monitor-or-gate-failure",
        "date": "2026-06-20",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "monitor_or_gate_failure",
        "failedGate": "passed",
        "reportPath": "agent-workflow/reports/2026-06-20-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-20T16:23:13+08:00",
        "updatedAt": "2026-06-20T16:29:45+08:00",
        "resolvedAt": "2026-06-20T16:29:45+08:00",
        "resolver": "codex",
        "fixCommit": "pending",
        "validation": "assert-business-signals-frontstage + assert-pool-to-card-dedupe + assert-daily-production-chain passed",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-20-business_signals-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-20-business_signals-business-signals-top10-missing",
        "date": "2026-06-20",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-20-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-20T15:39:24+08:00",
        "updatedAt": "2026-06-20T16:04:05+08:00",
        "resolvedAt": "2026-06-20T16:04:05+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "scratch replay generate/build/assert-business-signals-frontstage --date=2026-06-20 passed",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-20-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-19-business_signals-business-signals-top10-missing",
        "date": "2026-06-19",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "urgent",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-19-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "send Codex a business_signals repair request with failed gate and report path",
        "createdAt": "2026-06-19T11:20:14+08:00",
        "updatedAt": "2026-06-19T11:46:40+08:00",
        "resolvedAt": "2026-06-19T11:46:40+08:00",
        "resolver": "codex",
        "fixCommit": "87eb5e8741195ac56fb342e8e055cc14447f87e4",
        "validation": "artifact replay build-v3-data-observation-desk + assert-v3-source-first-frontstage (2026-06-19 passed, top10_count=10)",
        "prevention": "memory",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-19-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-17-community_intelligence-community-intelligence",
        "date": "2026-06-17",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "community_intelligence",
        "failedGate": "agent-workflow/reports/2026-06-17-community-intelligence-gate.md",
        "reportPath": "agent-workflow/reports/2026-06-17-daily-supervision-report.md",
        "dataGenerated": "yes",
        "neededAction": "run `npm run hermes:early-handoff -- --date=<YYYY-MM-DD>` or dispatch `.github/workflows/daily-community-intelligence-pr.yml` after local collection and archive pass",
        "createdAt": "2026-06-17T11:19:15+08:00",
        "updatedAt": "2026-06-18T11:24:46+08:00",
        "resolvedAt": "2026-06-18T11:24:46+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "npm run supervise:daily -- --date=2026-06-18",
        "prevention": "gate",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-17-community_intelligence-community-intelligence.md"
      },
      {
        "id": "2026-06-14-builders-skill-afternoon",
        "date": "2026-06-14",
        "title": "下午 follow-builders skill 链路补充检查 — 2026-06-14",
        "status": "resolved",
        "state": "resolved",
        "priority": "medium",
        "laneId": "first_line_viewpoints_skill",
        "category": "afternoon_skill_check",
        "failedGate": "afternoon_skill_check",
        "reportPath": "agent-workflow/reports/2026-06-14-follow-builders-skill-local-publish.md",
        "dataGenerated": "no",
        "neededAction": "inspect",
        "createdAt": "2026-06-14T16:30:00+08:00",
        "updatedAt": "2026-06-17T11:20:58+08:00",
        "resolvedAt": "2026-06-17T11:20:58+08:00",
        "resolver": "codex",
        "fixCommit": "pending-local-change",
        "validation": "node stale-afternoon-skill-check-2026-06-14",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-14-builders-skill-afternoon.md"
      },
      {
        "id": "2026-06-15-site-v337-weekly-report-integration",
        "date": "2026-06-15",
        "title": "Hermes Repair Request: SITE-V3.3.7 Weekly Report Integration",
        "status": "resolved",
        "state": "resolved",
        "priority": "medium",
        "laneId": "site_version",
        "category": "site_v337_weekly_report_integration",
        "failedGate": "n/a",
        "reportPath": "n/a",
        "dataGenerated": "n/a",
        "neededAction": "update version-ledger.md + AGENTS.md to SITE-V3.3.7, create weekly report infrastructure, add Intelligence Map navigation entry",
        "createdAt": "2026-06-15T16:30:00+08:00",
        "updatedAt": "2026-06-15T16:30:00+08:00",
        "resolvedAt": "",
        "resolver": "",
        "fixCommit": "",
        "validation": "",
        "prevention": "",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-15-site-v337-weekly-report-integration.md"
      },
      {
        "id": "2026-06-13-business_signals-business-signals-top10-missing",
        "date": "2026-06-13",
        "title": "Hermes Repair Request: Business Signals / Intelligence Map / Dashboard",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "business_signals",
        "category": "business_signals_top10_missing",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-13-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "manual dispatch",
        "createdAt": "2026-06-13T10:45:49+08:00",
        "updatedAt": "2026-06-14T16:42:32+08:00",
        "resolvedAt": "2026-06-14T16:42:32+08:00",
        "resolver": "codex",
        "fixCommit": "e479565a",
        "validation": "2026-06-13 monitor gate/readiness/manifest all passed; persistent asset manifest records source-first/frontstage/pre-commit success",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-13-business_signals-business-signals-top10-missing.md"
      },
      {
        "id": "2026-06-13-community_intelligence-monitor-or-gate-failure",
        "date": "2026-06-13",
        "title": "Hermes Repair Request: Community Intelligence",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "community_intelligence",
        "category": "monitor_or_gate_failure",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-13-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "manual dispatch",
        "createdAt": "2026-06-13T10:45:49+08:00",
        "updatedAt": "2026-06-14T16:42:32+08:00",
        "resolvedAt": "2026-06-14T16:42:32+08:00",
        "resolver": "codex",
        "fixCommit": "1bdabf15",
        "validation": "community daily snapshot 2026-06-13 exists with 61 items; 2026-06-13 local publish report exists; later active-date gate failure is historical-date supersession only",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-13-community_intelligence-monitor-or-gate-failure.md"
      },
      {
        "id": "2026-06-13-first_line_viewpoints-monitor-or-gate-failure",
        "date": "2026-06-13",
        "title": "Hermes Repair Request: First-Line Viewpoints",
        "status": "resolved",
        "state": "resolved",
        "priority": "normal",
        "laneId": "first_line_viewpoints",
        "category": "monitor_or_gate_failure",
        "failedGate": "missing",
        "reportPath": "agent-workflow/reports/2026-06-13-daily-supervision-report.md",
        "dataGenerated": "no_or_stale",
        "neededAction": "manual dispatch",
        "createdAt": "2026-06-13T10:45:49+08:00",
        "updatedAt": "2026-06-14T16:42:32+08:00",
        "resolvedAt": "2026-06-14T16:42:32+08:00",
        "resolver": "codex",
        "fixCommit": "002b0c72",
        "validation": "node agent-workflow/tools/assert-follow-builders-data.mjs --date=2026-06-13 passed; 2026-06-13 first-line manifest records builders_gate and obsidian_sync success",
        "prevention": "not-needed",
        "sourceFile": "agent-workflow/inbox/hermes-to-codex/2026-06-13-first_line_viewpoints-monitor-or-gate-failure.md"
      }
    ]
  },
  "tasks": {
    "lanes": [
      {
        "id": "skill_ops",
        "label": "Skill Ops Governance",
        "schedule": "daily supervision preflight",
        "status": "manual_required",
        "statusText": "需人工处理",
        "problemCount": 1,
        "warningCount": 0,
        "actions": [
          "repair the owning Guanlan skill metadata, evals, examples, registry, or .skill-store mirror",
          "run `npm run audit:skills` after the repair"
        ],
        "evidence": []
      },
      {
        "id": "community_intelligence",
        "label": "Community Intelligence",
        "schedule": "08:30 local collection; 08:45 / 10:45 GitHub publish windows; Daily Problem Watchdog records failures to Hermes inbox",
        "status": "warning",
        "statusText": "warning",
        "problemCount": 0,
        "warningCount": 1,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 61
          }
        ]
      },
      {
        "id": "business_signals",
        "label": "Business Signals / Intelligence Map / Dashboard",
        "schedule": "08:57 primary production; 09:27 conditional health dispatch; Daily Problem Watchdog records failures to Hermes inbox",
        "status": "warning",
        "statusText": "warning",
        "problemCount": 0,
        "warningCount": 4,
        "actions": [],
        "evidence": [
          {
            "label": "Pool",
            "value": 15
          },
          {
            "label": "Cards",
            "value": 10
          }
        ]
      },
      {
        "id": "first_line_viewpoints",
        "label": "First-Line Viewpoints",
        "schedule": "08:30 local Codex RSS collection + page build + Obsidian sync; 09:17 GitHub fallback; Daily Problem Watchdog records failures to Hermes inbox",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 48
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
            "value": 0
          }
        ]
      }
    ],
    "latestProduction": {
      "date": "2026-07-02",
      "raw": 147,
      "pool": 95,
      "cards": 22,
      "assets": {
        "case": 10,
        "funding": 4,
        "product-service": 2,
        "opinion": 6
      }
    },
    "sync": [
      {
        "label": "GitHub Pages",
        "status": "unknown",
        "detail": "https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/28562131797"
      },
      {
        "label": "Business Signals PR",
        "status": "waiting",
        "detail": "当前监督报告显示未合并或等待中"
      },
      {
        "label": "本地 Obsidian 同步",
        "status": "manual_required",
        "detail": "3 个本地变更阻塞自动判断"
      },
      {
        "label": "Pipeline Dashboard",
        "status": "passed",
        "detail": "2026-07-02T08:32:24.309Z"
      },
      {
        "label": "Daily Supervision",
        "status": "manual_required",
        "detail": "2026-07-02T03:20:31.647Z"
      }
    ]
  },
  "quality": {
    "pipelineMeta": {
      "generatedAt": "2026-07-02T08:32:24.309Z",
      "dateRange": {
        "start": "2025-10-13",
        "end": "2026-07-02"
      },
      "source": "01-SiteV2/content + 01-SiteV2/knowledge"
    },
    "latest": {
      "date": "2026-07-02",
      "label": "2026.07.02",
      "shortLabel": "07.02",
      "raw": 147,
      "pool": 95,
      "assets": {
        "case": 10,
        "funding": 4,
        "product-service": 2,
        "opinion": 6
      },
      "cards": 22,
      "rawChannels": {
        "aihot": 61,
        "keyword_search": 55,
        "follow_builders": 0
      },
      "poolRoutes": {
        "core_pool": 33,
        "emerging_pool": 23,
        "index_only": 20,
        "watchlist": 40,
        "user_feedback_pool": 5
      },
      "evidenceLevels": {
        "core_evidence_candidate": 72,
        "supporting_evidence": 2,
        "community_signal": 3,
        "user_feedback_signal": 3,
        "discovery_only": 15
      },
      "sourceLevels": {
        "A": 19,
        "S": 12,
        "B": 60,
        "C": 4
      },
      "sourceTypes": {
        "news": 9,
        "product": 2,
        "research": 1,
        "developer": 6,
        "media": 9,
        "official": 8,
        "web": 53,
        "operators": 4,
        "analysis": 1,
        "industry": 1,
        "marketplace": 1
      },
      "assetStatus": {
        "case": {
          "published": 10
        },
        "funding": {
          "published": 4
        },
        "product-service": {
          "published": 2
        }
      },
      "assetLevels": {
        "case": {
          "frontstage": 10
        },
        "funding": {
          "frontstage": 4
        },
        "product-service": {
          "frontstage": 2
        }
      },
      "assetEvidenceGates": {
        "case": {
          "core_evidence_passed": 10
        },
        "funding": {
          "core_evidence_passed": 4
        },
        "product-service": {
          "core_evidence_passed": 2
        }
      },
      "assetCopyGates": {}
    },
    "totals": {
      "raw": 6160,
      "pool": 3001,
      "assets": {
        "case": 346,
        "funding": 83,
        "product-service": 267,
        "opinion": 962,
        "trend": 6,
        "scene": 3,
        "change": 14
      }
    },
    "days": [
      {
        "date": "2026-07-02",
        "label": "2026.07.02",
        "shortLabel": "07.02",
        "raw": 147,
        "pool": 95,
        "assets": {
          "case": 10,
          "funding": 4,
          "product-service": 2,
          "opinion": 6
        },
        "cards": 22,
        "rawChannels": {
          "aihot": 61,
          "keyword_search": 55,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 33,
          "emerging_pool": 23,
          "index_only": 20,
          "watchlist": 40,
          "user_feedback_pool": 5
        },
        "evidenceLevels": {
          "core_evidence_candidate": 72,
          "supporting_evidence": 2,
          "community_signal": 3,
          "user_feedback_signal": 3,
          "discovery_only": 15
        },
        "sourceLevels": {
          "A": 19,
          "S": 12,
          "B": 60,
          "C": 4
        },
        "sourceTypes": {
          "news": 9,
          "product": 2,
          "research": 1,
          "developer": 6,
          "media": 9,
          "official": 8,
          "web": 53,
          "operators": 4,
          "analysis": 1,
          "industry": 1,
          "marketplace": 1
        },
        "assetStatus": {
          "case": {
            "published": 10
          },
          "funding": {
            "published": 4
          },
          "product-service": {
            "published": 2
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 10
          },
          "funding": {
            "frontstage": 4
          },
          "product-service": {
            "frontstage": 2
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 10
          },
          "funding": {
            "core_evidence_passed": 4
          },
          "product-service": {
            "core_evidence_passed": 2
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-01",
        "label": "2026.07.01",
        "shortLabel": "07.01",
        "raw": 159,
        "pool": 95,
        "assets": {
          "case": 2,
          "product-service": 3,
          "opinion": 44
        },
        "cards": 49,
        "rawChannels": {
          "aihot": 65,
          "keyword_search": 82,
          "follow_builders": 0
        },
        "poolRoutes": {
          "watchlist": 40,
          "emerging_pool": 22,
          "user_feedback_pool": 16,
          "core_pool": 30,
          "index_only": 20,
          "discard": 1
        },
        "evidenceLevels": {
          "core_evidence_candidate": 59,
          "user_feedback_signal": 5,
          "supporting_evidence": 2,
          "community_signal": 11,
          "index_only_evidence": 1,
          "discovery_only": 17
        },
        "sourceLevels": {
          "A": 17,
          "S": 21,
          "B": 45,
          "C": 12
        },
        "sourceTypes": {
          "news": 8,
          "product": 6,
          "web": 36,
          "media": 9,
          "official": 14,
          "industry": 1,
          "operators": 12,
          "organization-capability": 1,
          "marketplace": 4,
          "developer": 4
        },
        "assetStatus": {
          "case": {
            "published": 2
          },
          "product-service": {
            "published": 3
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 2
          },
          "product-service": {
            "frontstage": 3
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 2
          },
          "product-service": {
            "core_evidence_passed": 3
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-06-30",
        "label": "2026.06.30",
        "shortLabel": "06.30",
        "raw": 116,
        "pool": 95,
        "assets": {
          "case": 10,
          "opinion": 37
        },
        "cards": 47,
        "rawChannels": {
          "aihot": 22,
          "keyword_search": 68,
          "follow_builders": 0
        },
        "poolRoutes": {
          "emerging_pool": 17,
          "watchlist": 34,
          "core_pool": 31,
          "user_feedback_pool": 15,
          "index_only": 25,
          "discard": 5
        },
        "evidenceLevels": {
          "core_evidence_candidate": 45,
          "community_signal": 13,
          "user_feedback_signal": 2,
          "supporting_evidence": 3,
          "weak_signal": 10,
          "discovery_only": 22
        },
        "sourceLevels": {
          "B": 63,
          "C": 15,
          "A": 7,
          "S": 10
        },
        "sourceTypes": {
          "web": 57,
          "operators": 15,
          "media": 5,
          "developer": 5,
          "organization-capability": 1,
          "industry": 2,
          "official": 3,
          "marketplace": 1,
          "news": 2,
          "builder": 1,
          "product": 3
        },
        "assetStatus": {
          "case": {
            "published": 10
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 10
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 10
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-06-29",
        "label": "2026.06.29",
        "shortLabel": "06.29",
        "raw": 152,
        "pool": 95,
        "assets": {
          "case": 26,
          "funding": 6,
          "product-service": 6,
          "opinion": 20
        },
        "cards": 58,
        "rawChannels": {
          "aihot": 7,
          "keyword_search": 65,
          "follow_builders": 0
        },
        "poolRoutes": {
          "emerging_pool": 43,
          "watchlist": 45,
          "core_pool": 33,
          "index_only": 17
        },
        "evidenceLevels": {
          "core_evidence_candidate": 81,
          "supporting_evidence": 7,
          "discovery_only": 7
        },
        "sourceLevels": {
          "B": 82,
          "A": 6,
          "S": 7
        },
        "sourceTypes": {
          "industry": 1,
          "web": 60,
          "news": 2,
          "official": 4,
          "media": 3,
          "developer": 1,
          "marketplace": 3,
          "research": 1,
          "product": 3,
          "builder": 12,
          "newsletter": 4,
          "funding": 1
        },
        "assetStatus": {
          "case": {
            "published": 26
          },
          "funding": {
            "published": 6
          },
          "product-service": {
            "published": 6
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 26
          },
          "funding": {
            "frontstage": 6
          },
          "product-service": {
            "frontstage": 6
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 26
          },
          "funding": {
            "core_evidence_passed": 6
          },
          "product-service": {
            "core_evidence_passed": 6
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-06-28",
        "label": "2026.06.28",
        "shortLabel": "06.28",
        "raw": 126,
        "pool": 95,
        "assets": {
          "case": 11,
          "product-service": 10
        },
        "cards": 21,
        "rawChannels": {
          "aihot": 10,
          "keyword_search": 42,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 32,
          "emerging_pool": 22,
          "watchlist": 41,
          "user_feedback_pool": 11,
          "index_only": 15,
          "discard": 5
        },
        "evidenceLevels": {
          "core_evidence_candidate": 64,
          "community_signal": 10,
          "user_feedback_signal": 1,
          "supporting_evidence": 5,
          "weak_signal": 5,
          "discovery_only": 10
        },
        "sourceLevels": {
          "B": 70,
          "A": 14,
          "S": 11
        },
        "sourceTypes": {
          "web": 42,
          "marketplace": 3,
          "funding": 2,
          "analysis": 7,
          "developer": 9,
          "news": 7,
          "media": 7,
          "industry": 3,
          "builder": 9,
          "newsletter": 2,
          "product": 3,
          "official": 1
        },
        "assetStatus": {
          "case": {
            "published": 11
          },
          "product-service": {
            "published": 10
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 11
          },
          "product-service": {
            "frontstage": 10
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 11
          },
          "product-service": {
            "core_evidence_passed": 10
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-06-27",
        "label": "2026.06.27",
        "shortLabel": "06.27",
        "raw": 177,
        "pool": 95,
        "assets": {
          "case": 9,
          "funding": 3,
          "product-service": 7,
          "opinion": 6
        },
        "cards": 25,
        "rawChannels": {
          "aihot": 12,
          "keyword_search": 53,
          "follow_builders": 0
        },
        "poolRoutes": {
          "emerging_pool": 24,
          "watchlist": 49,
          "core_pool": 30,
          "user_feedback_pool": 3,
          "index_only": 15,
          "discard": 1
        },
        "evidenceLevels": {
          "core_evidence_candidate": 76,
          "community_signal": 3,
          "index_only_evidence": 2,
          "supporting_evidence": 2,
          "discovery_only": 12
        },
        "sourceLevels": {
          "B": 87,
          "S": 4,
          "A": 4
        },
        "sourceTypes": {
          "web": 76,
          "marketplace": 1,
          "developer": 6,
          "official": 3,
          "funding": 1,
          "industry": 1,
          "product": 1,
          "media": 3,
          "news": 1,
          "analysis": 2
        },
        "assetStatus": {
          "case": {
            "published": 9
          },
          "funding": {
            "published": 3
          },
          "product-service": {
            "published": 7
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 9
          },
          "funding": {
            "frontstage": 3
          },
          "product-service": {
            "frontstage": 7
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 9
          },
          "funding": {
            "core_evidence_passed": 3
          },
          "product-service": {
            "core_evidence_passed": 7
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-06-26",
        "label": "2026.06.26",
        "shortLabel": "06.26",
        "raw": 188,
        "pool": 95,
        "assets": {
          "opinion": 43
        },
        "cards": 43,
        "rawChannels": {
          "aihot": 86,
          "keyword_search": 102,
          "follow_builders": 0
        },
        "poolRoutes": {
          "watchlist": 71,
          "core_pool": 23,
          "index_only": 1,
          "emerging_pool": 26,
          "user_feedback_pool": 2
        },
        "evidenceLevels": {
          "core_evidence_candidate": 61,
          "supporting_evidence": 5,
          "user_feedback_signal": 1,
          "index_only_evidence": 2,
          "community_signal": 2,
          "discovery_only": 24
        },
        "sourceLevels": {
          "A": 12,
          "B": 73,
          "S": 10
        },
        "sourceTypes": {
          "news": 5,
          "web": 60,
          "media": 7,
          "product": 1,
          "funding": 1,
          "developer": 8,
          "marketplace": 4,
          "official": 7,
          "organization-capability": 1,
          "industry": 1
        },
        "assetStatus": {},
        "assetLevels": {},
        "assetEvidenceGates": {},
        "assetCopyGates": {}
      }
    ],
    "engineQuality": {
      "updatedAt": "2026-07-02T08:32:24.376Z",
      "sampleNote": "样本为 Raw 条目中的入口命中；同一条 Raw 可能被多个入口标记。",
      "metricNote": "新鲜度按已知发布时间中 48 小时内比例计算；重复率按跨 Raw 归一化 URL / 标题计算；Raw Card 候选率按可进入 core / emerging / user_feedback 或具备卡片可用方向计算。",
      "rows": [
        {
          "id": "tavily",
          "label": "Tavily",
          "total": 114,
          "freshKnown": 0,
          "fresh": 0,
          "duplicates": 1,
          "official": 28,
          "convertible": 64,
          "freshnessRate": null,
          "duplicateRate": 1,
          "officialRate": 25,
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
          "total": 626,
          "freshKnown": 49,
          "fresh": 1,
          "duplicates": 92,
          "official": 6,
          "convertible": 258,
          "freshnessRate": 2,
          "duplicateRate": 15,
          "officialRate": 1,
          "conversionRate": 41
        },
        {
          "id": "anysearch",
          "label": "AnySearch",
          "total": 1510,
          "freshKnown": 0,
          "fresh": 0,
          "duplicates": 141,
          "official": 227,
          "convertible": 824,
          "freshnessRate": null,
          "duplicateRate": 9,
          "officialRate": 15,
          "conversionRate": 55
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
          "total": 3574,
          "freshKnown": 2826,
          "fresh": 2826,
          "duplicates": 6,
          "official": 235,
          "convertible": 1246,
          "freshnessRate": 100,
          "duplicateRate": 0,
          "officialRate": 7,
          "conversionRate": 35
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
        "value": "SITE-V3.4.5"
      },
      {
        "key": "OPS",
        "label": "Operations backend",
        "value": "OPS-V1.2.3-content-factory-cleanout"
      },
      {
        "key": "BSIG",
        "label": "Business Signals",
        "value": "BSIG-V2.1.2-v3-gate-cleanout"
      },
      {
        "key": "IMAP",
        "label": "Intelligence Map",
        "value": ""
      },
      {
        "key": "FLV",
        "label": "First-Line Viewpoints",
        "value": "FLV-V1.0.2-supervision-idempotency"
      },
      {
        "key": "CINT",
        "label": "Community Intelligence",
        "value": "CINT-V1.0.2-publication-waiting-gate"
      },
      {
        "key": "EAI",
        "label": "Enterprise AI lens",
        "value": "EAI-V1.2.0-raw-card-ingestion-boundary"
      },
      {
        "key": "SKILL",
        "label": "Skill Store",
        "value": "v1.3.2 Cleanup management cache and common-action fix"
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
