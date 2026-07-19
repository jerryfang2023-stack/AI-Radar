window.WaveSightOpsConsole = {
  "meta": {
    "version": "OPS-V1.2.3-content-factory-cleanout",
    "generatedAt": "2026-07-19T08:47:26.951Z",
    "date": "2026-07-19",
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
    "date": "2026-07-19",
    "status": "passed",
    "statusText": "已通过",
    "issueSummary": {
      "total": 47,
      "daily": 0,
      "open": 0,
      "resolved": 47,
      "urgent": 0
    },
    "issues": []
  },
  "periods": {
    "weekly": {
      "windowDays": 7,
      "total": 2,
      "open": 0,
      "resolved": 2,
      "byLane": {
        "follow_builders_skill": 1,
        "skill_ops": 1
      },
      "byCategory": {
        "first_line_viewpoints": 1,
        "monitor_or_gate_failure": 1
      },
      "recurring": [],
      "latest": [
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
        }
      ]
    },
    "monthly": {
      "windowDays": 30,
      "total": 28,
      "open": 0,
      "resolved": 28,
      "byLane": {
        "business_signals": 12,
        "community_intelligence": 5,
        "skill_ops": 7,
        "first_line_viewpoints": 2,
        "follow_builders_skill": 2
      },
      "byCategory": {
        "business_signals_top10_missing": 5,
        "monitor_or_gate_failure": 12,
        "obsidian_sync": 2,
        "community_intelligence": 2,
        "no_run_or_stale_assets": 3,
        "core_supply_shortfall": 1,
        "daily_problem_watchdog": 1,
        "skill_ops": 1,
        "first_line_viewpoints": 1
      },
      "recurring": [
        {
          "category": "monitor_or_gate_failure",
          "count": 12
        },
        {
          "category": "business_signals_top10_missing",
          "count": 5
        },
        {
          "category": "no_run_or_stale_assets",
          "count": 3
        },
        {
          "category": "obsidian_sync",
          "count": 2
        },
        {
          "category": "community_intelligence",
          "count": 2
        }
      ],
      "latest": [
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
        }
      ]
    }
  },
  "inbox": {
    "open": [],
    "resolved": [
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
        "schedule": "08:30 local logged-in collection and publish handoff; 09:15 local-data validation; 09:50 publication closure",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Items",
            "value": 67
          }
        ]
      },
      {
        "id": "business_signals",
        "label": "Business Signals / Intelligence Map / Dashboard",
        "schedule": "08:10 local conditional production; 09:15 targeted recovery; 09:50 consolidated closure; 10:30 cloud safety fallback",
        "status": "passed",
        "statusText": "已通过",
        "problemCount": 0,
        "warningCount": 0,
        "actions": [],
        "evidence": [
          {
            "label": "Pool",
            "value": 33
          },
          {
            "label": "Cards",
            "value": 33
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
            "value": 51
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
            "value": 24
          }
        ]
      }
    ],
    "latestProduction": {
      "date": "2026-07-19",
      "raw": 111,
      "pool": 103,
      "cards": 33,
      "assets": {
        "case": 6,
        "funding": 4,
        "product-service": 23
      }
    },
    "sync": [
      {
        "label": "GitHub Pages",
        "status": "passed",
        "detail": "https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/29679998199"
      },
      {
        "label": "Business Signals PR",
        "status": "waiting",
        "detail": "当前监督报告显示未合并或等待中"
      },
      {
        "label": "本地 Obsidian 同步",
        "status": "passed",
        "detail": "工作区干净"
      },
      {
        "label": "Pipeline Dashboard",
        "status": "passed",
        "detail": "2026-07-19T06:41:27.556Z"
      },
      {
        "label": "Daily Supervision",
        "status": "passed",
        "detail": "2026-07-19T08:42:30.884Z"
      }
    ]
  },
  "quality": {
    "pipelineMeta": {
      "generatedAt": "2026-07-19T06:41:27.556Z",
      "dateRange": {
        "start": "2025-10-13",
        "end": "2026-07-19"
      },
      "source": "01-SiteV2/content + 01-SiteV2/knowledge"
    },
    "latest": {
      "date": "2026-07-19",
      "label": "2026.07.19",
      "shortLabel": "07.19",
      "raw": 111,
      "pool": 103,
      "assets": {
        "case": 6,
        "funding": 4,
        "product-service": 23
      },
      "cards": 33,
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
    },
    "totals": {
      "raw": 8649,
      "pool": 5007,
      "assets": {
        "case": 434,
        "funding": 151,
        "product-service": 403,
        "opinion": 1514,
        "trend": 6,
        "scene": 3,
        "change": 14
      }
    },
    "days": [
      {
        "date": "2026-07-19",
        "label": "2026.07.19",
        "shortLabel": "07.19",
        "raw": 111,
        "pool": 103,
        "assets": {
          "case": 6,
          "funding": 4,
          "product-service": 23
        },
        "cards": 33,
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
      },
      {
        "date": "2026-07-18",
        "label": "2026.07.18",
        "shortLabel": "07.18",
        "raw": 150,
        "pool": 140,
        "assets": {
          "case": 7,
          "funding": 9,
          "product-service": 20,
          "opinion": 19
        },
        "cards": 55,
        "rawChannels": {
          "aihot": 91,
          "keyword_search": 38,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 58,
          "emerging_pool": 18,
          "watchlist": 51,
          "index_only": 29
        },
        "evidenceLevels": {
          "core_evidence_candidate": 108,
          "user_feedback_signal": 4,
          "supporting_evidence": 6,
          "discovery_only": 22
        },
        "sourceLevels": {
          "A": 25,
          "S": 7,
          "B": 102,
          "C": 6
        },
        "sourceTypes": {
          "news": 11,
          "developer": 10,
          "web": 95,
          "operators": 6,
          "media": 14,
          "newsletter": 1,
          "builder": 2,
          "official": 1
        },
        "assetStatus": {
          "case": {
            "published": 7
          },
          "funding": {
            "published": 9
          },
          "product-service": {
            "published": 20
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 7
          },
          "funding": {
            "frontstage": 9
          },
          "product-service": {
            "frontstage": 20
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 7
          },
          "funding": {
            "core_evidence_passed": 9
          },
          "product-service": {
            "core_evidence_passed": 20
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-17",
        "label": "2026.07.17",
        "shortLabel": "07.17",
        "raw": 160,
        "pool": 148,
        "assets": {
          "opinion": 35
        },
        "cards": 35,
        "rawChannels": {
          "aihot": 90,
          "keyword_search": 31,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 48,
          "watchlist": 59,
          "index_only": 40,
          "emerging_pool": 21
        },
        "evidenceLevels": {
          "core_evidence_candidate": 99,
          "user_feedback_signal": 7,
          "supporting_evidence": 12,
          "community_signal": 1,
          "discovery_only": 29
        },
        "sourceLevels": {
          "B": 96,
          "A": 36,
          "C": 5,
          "S": 11
        },
        "sourceTypes": {
          "web": 86,
          "media": 20,
          "operators": 5,
          "developer": 4,
          "news": 16,
          "official": 5,
          "product": 3,
          "analysis": 1,
          "builder": 2,
          "funding": 3,
          "industry": 1,
          "newsletter": 2
        },
        "assetStatus": {},
        "assetLevels": {},
        "assetEvidenceGates": {},
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-16",
        "label": "2026.07.16",
        "shortLabel": "07.16",
        "raw": 157,
        "pool": 149,
        "assets": {
          "case": 4,
          "funding": 3,
          "product-service": 18,
          "opinion": 43
        },
        "cards": 68,
        "rawChannels": {
          "aihot": 100,
          "keyword_search": 28,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 55,
          "watchlist": 53,
          "index_only": 41,
          "emerging_pool": 20
        },
        "evidenceLevels": {
          "core_evidence_candidate": 98,
          "user_feedback_signal": 10,
          "supporting_evidence": 12,
          "community_signal": 1,
          "discovery_only": 28
        },
        "sourceLevels": {
          "A": 40,
          "B": 94,
          "C": 3,
          "S": 12
        },
        "sourceTypes": {
          "news": 18,
          "media": 22,
          "web": 83,
          "operators": 3,
          "product": 1,
          "official": 6,
          "marketplace": 2,
          "developer": 8,
          "funding": 2,
          "builder": 3,
          "newsletter": 1
        },
        "assetStatus": {
          "case": {
            "published": 4
          },
          "funding": {
            "published": 3
          },
          "product-service": {
            "published": 18
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 4
          },
          "funding": {
            "frontstage": 3
          },
          "product-service": {
            "frontstage": 18
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 4
          },
          "funding": {
            "core_evidence_passed": 3
          },
          "product-service": {
            "core_evidence_passed": 18
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-15",
        "label": "2026.07.15",
        "shortLabel": "07.15",
        "raw": 171,
        "pool": 157,
        "assets": {
          "case": 5,
          "funding": 7,
          "product-service": 13,
          "opinion": 43
        },
        "cards": 68,
        "rawChannels": {
          "aihot": 107,
          "keyword_search": 35,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 44,
          "index_only": 46,
          "emerging_pool": 26,
          "watchlist": 64
        },
        "evidenceLevels": {
          "core_evidence_candidate": 100,
          "user_feedback_signal": 11,
          "supporting_evidence": 11,
          "weak_signal": 2,
          "discovery_only": 33
        },
        "sourceLevels": {
          "A": 42,
          "B": 91,
          "C": 5,
          "S": 19
        },
        "sourceTypes": {
          "news": 16,
          "web": 81,
          "operators": 5,
          "media": 26,
          "official": 10,
          "product": 4,
          "developer": 9,
          "funding": 2,
          "builder": 2,
          "newsletter": 2
        },
        "assetStatus": {
          "case": {
            "published": 5
          },
          "funding": {
            "published": 7
          },
          "product-service": {
            "published": 13
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 5
          },
          "funding": {
            "frontstage": 7
          },
          "product-service": {
            "frontstage": 13
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 5
          },
          "funding": {
            "core_evidence_passed": 7
          },
          "product-service": {
            "core_evidence_passed": 13
          }
        },
        "assetCopyGates": {}
      },
      {
        "date": "2026-07-14",
        "label": "2026.07.14",
        "shortLabel": "07.14",
        "raw": 122,
        "pool": 112,
        "assets": {
          "case": 2,
          "funding": 4,
          "product-service": 2,
          "opinion": 54
        },
        "cards": 62,
        "rawChannels": {
          "aihot": 59,
          "keyword_search": 40,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 43,
          "emerging_pool": 18,
          "watchlist": 39,
          "index_only": 28
        },
        "evidenceLevels": {
          "core_evidence_candidate": 83,
          "user_feedback_signal": 7,
          "supporting_evidence": 10,
          "discovery_only": 12
        },
        "sourceLevels": {
          "A": 33,
          "B": 67,
          "S": 11,
          "C": 1
        },
        "sourceTypes": {
          "news": 15,
          "web": 61,
          "developer": 5,
          "media": 18,
          "product": 4,
          "operators": 1,
          "official": 2,
          "marketplace": 1,
          "industry": 1,
          "builder": 3,
          "newsletter": 1
        },
        "assetStatus": {
          "case": {
            "published": 2
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
            "frontstage": 2
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
            "core_evidence_passed": 2
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
        "date": "2026-07-13",
        "label": "2026.07.13",
        "shortLabel": "07.13",
        "raw": 120,
        "pool": 110,
        "assets": {
          "case": 2,
          "funding": 2,
          "product-service": 17,
          "opinion": 29
        },
        "cards": 50,
        "rawChannels": {
          "aihot": 57,
          "keyword_search": 33,
          "follow_builders": 0
        },
        "poolRoutes": {
          "core_pool": 41,
          "emerging_pool": 15,
          "watchlist": 33,
          "index_only": 36,
          "user_feedback_pool": 4
        },
        "evidenceLevels": {
          "core_evidence_candidate": 76,
          "user_feedback_signal": 9,
          "supporting_evidence": 12,
          "weak_signal": 2,
          "discovery_only": 11
        },
        "sourceLevels": {
          "B": 85,
          "A": 15,
          "C": 3,
          "S": 7
        },
        "sourceTypes": {
          "web": 65,
          "news": 1,
          "media": 14,
          "domestic_vendor": 1,
          "operators": 3,
          "research": 1,
          "builder": 4,
          "funding": 3,
          "developer": 8,
          "official": 1,
          "industry": 1,
          "newsletter": 7,
          "product": 1
        },
        "assetStatus": {
          "case": {
            "published": 2
          },
          "funding": {
            "published": 2
          },
          "product-service": {
            "published": 17
          }
        },
        "assetLevels": {
          "case": {
            "frontstage": 2
          },
          "funding": {
            "frontstage": 2
          },
          "product-service": {
            "frontstage": 17
          }
        },
        "assetEvidenceGates": {
          "case": {
            "core_evidence_passed": 2
          },
          "funding": {
            "core_evidence_passed": 2
          },
          "product-service": {
            "core_evidence_passed": 17
          }
        },
        "assetCopyGates": {}
      }
    ],
    "engineQuality": {
      "updatedAt": "2026-07-19T06:41:27.686Z",
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
          "total": 769,
          "freshKnown": 77,
          "fresh": 1,
          "duplicates": 123,
          "official": 6,
          "convertible": 286,
          "freshnessRate": 1,
          "duplicateRate": 16,
          "officialRate": 1,
          "conversionRate": 37
        },
        {
          "id": "anysearch",
          "label": "AnySearch",
          "total": 2226,
          "freshKnown": 172,
          "fresh": 31,
          "duplicates": 200,
          "official": 401,
          "convertible": 1156,
          "freshnessRate": 18,
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
          "total": 4884,
          "freshKnown": 3908,
          "fresh": 3878,
          "duplicates": 16,
          "official": 268,
          "convertible": 1624,
          "freshnessRate": 99,
          "duplicateRate": 0,
          "officialRate": 5,
          "conversionRate": 33
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
        "value": "OMAP-V1.0.0-independent-column"
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
        "value": "RELATION-V2.0"
      },
      {
        "key": "BACKFILL",
        "label": "Targeted historical collection contract",
        "value": "BACKFILL-V1.0"
      },
      {
        "key": "SKILL",
        "label": "Skill Store",
        "value": "v1.6.3 V4 governance alignment"
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
