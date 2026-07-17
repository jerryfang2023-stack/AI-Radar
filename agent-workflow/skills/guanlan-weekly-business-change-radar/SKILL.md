---
name: guanlan-weekly-business-change-radar
description: 观澜AI周度商业变化判断。从 Signals / Opinions / Community 三方数据中提取趋势链、机会卡、反共识判断和热力图，输出面向企业老板和创业者的周度 AI 商业机会雷达报告。
metadata:
  guanlan:
    version: "1.0.1"
    lane: "Business Signals"
    status: "downstream application"
    order: 90
    responsibility: "从 S×O×C 三方数据生成周度 AI 商业变化判断报告：趋势链五步法、100分机会评分、反共识判断、行业影响热力图。"
    upstream: "Business Signal Cards, First-Line Viewpoints data, Community Intelligence data"
    downstream: "weekly business change radar report, opportunity cards, trend chains"
    gates: "data completeness (exact counts), cross-verification (S×O×C), trend chain evidence threshold (≥2 Signals each), opportunity card scoring (100-point), quality gates (8 checks)"
    recent_learning: "报告质量差异在于：是否用精确数字而非估计、是否点名具体公司/产品/金额、是否对不同角色给不同建议。agent-workflow 版强在具体数据，需补趋势链五步法和机会卡打分。"
    mirrored_in_skill_store: true
    memory_required: false
---

# Guanlan Weekly Business Change Radar

This judgment report is a downstream application and cannot write Data Center V4 canonical facts.

## Required Reads

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/07-v3-intelligence-generation-rules.md`
4. `context/05-daily-monitoring.md`

## Scope

This skill produces a weekly judgment report — not a news roundup.

It writes one file per week:

```text
agent-workflow/reports/YYYY-MM-DD-weekly-ai-business-change-radar.md
```

It does NOT:
- Write daily observation, business brief, or trend report
- Publish frontstage copy
- Replace Raw / Pool / Signal Card generation
- Regurgitate news without judgment

## Core Method

Three data sources, cross-verified:

| Source | Role | Data Path |
|--------|------|-----------|
| **Signals** | Hard changes: what happened | `01-SiteV2/site/data/v3-data-observation-desk.json` |
| **Opinions** | Interpretation: how experts judge it | `01-SiteV2/site/data/follow-builders-daily.json` |
| **Community** | Real demand: what practitioners need | `01-SiteV2/site/data/community-intelligence-daily/*.json` |

Cross-verification rules:

| Signals | Opinions | Community | Judgment |
|---------|----------|-----------|----------|
| Strong | Strong | Strong | Trend confirmed — deep dive |
| Strong | Strong | Weak | Tech-leading — watch B2B/infra |
| Strong | Weak | Strong | Early window — validate fast |
| Weak | Strong | Weak | Narrative/bubble — deprioritize |
| Weak | Weak | Strong | Grassroots opportunity — service/tool play |
| Strong | Weak | Weak | Supply-noise — caution |

## Five Questions Every Week Must Answer

1. What change just happened?
2. Is it isolated or accumulating?
3. Which industry / role / workflow does it affect?
4. Do real users have demand and willingness to pay?
5. Is there a supply gap that can become a product, service, or content business?

## Report Structure

Every report MUST contain these 8 sections in order:

### §0. Data Scope
Declare exact data sources, counts, dedup method, and boundaries. Use precise numbers, not estimates.

Example:
```
- Signals: v3-data-observation-desk.json, 101 cards (case 44, product 38, funding 19)
- Opinions: follow-builders-daily.json, 44 viewpoints
- Community: community-intelligence-daily/*.json, ~44 items after URL dedup
- Boundary: Opinions and Community are for cross-verification only, not as fact evidence
```

### §1. One-Sentence Conclusion
One sentence stating the core shift. Followed by evidence from all three sources. End with impact on business owners.

### §2. Trend Heatmap (Top 5)
Five warming trends ranked by velocity, not volume. Each row must include:
- Evidence source tags (S+O+C)
- This week's judgment
- Change direction from prior week (↑ → ↓)

### §3. Three Trend Chains (3)
Each chain traces: fact change → opinion shift → community signal → business impact. Use the five-step method:
1. Technology capability change
2. Product form change
3. User behavior change
4. Business model change
5. Entrepreneurial opportunity change

Rules:
- Each chain must cite at least 2 specific Signals (company name, amount, product)
- Each chain must cite at least 1 Opinion (name + what they said)
- Each chain must cite at least 1 Community signal
- End with concrete business impact, not abstract prediction

### §4. Industry / Role / Workflow Impact Heatmap
Matrix of 5-10 targets scored on:
- Impact intensity
- Maturity
- Opportunity gap
- 1-3 month action

Add summary: which roles are most affected, which workflows are ripest for AI entry.

### §5. Opportunity Cards (2-3)
Each card follows fixed structure:

| Field | Content |
|-------|---------|
| Opportunity name | One sentence |
| Target user | Who hurts, who pays |
| Trigger signals | Specific Signals/Opinions/Community items |
| Current substitute | What users do now (the dumb way) |
| Supply gap | Why existing products fall short |
| MVP form | Minimum viable product |
| Monetization | How to charge |
| Risk points | Tech, acquisition, competition, platform, compliance |
| Score | /100 with itemized breakdown |

Scoring weights:
- Pain intensity: 25
- Willingness to pay: 20
- Supply gap: 20
- Timing change: 15
- Acquisition path: 10
- Team feasibility: 10
- Risk deduction: -20 max

Thresholds:
- ≥80: Validate
- 60-79: Watch
- <60: Archive

### §6. Contrarian View
One sharp judgment that challenges a mainstream narrative. Must:
- Name the mainstream view being challenged
- Provide counter-evidence from at least two sources
- State the implication for decision-makers

### §7. Next Week Watchlist
Categorized tracking targets:
- Companies / Products
- Tech directions
- Vertical industries
- Community questions
- Signals to verify (with specific verification criteria)

### §8. Actionable Conclusions
Role-specific actions:
- For business owners
- For entrepreneurs
- For content teams
- For tech teams
- For Guanlan AI itself

## Evidence Boundary

- Opinions and Community are for interpretation and demand cross-verification only.
- They MUST NOT be used as fact evidence for Business Signal Cards.
- Every trend chain claim must be anchored to specific Signals (company, amount, product, date).
- Community 赚钱案例只作为需求信号，不作为事实证据写入正文。

## Quality Gates

Before finalizing, verify:
1. Every trend chain has ≥2 specific Signal citations
2. Every opportunity card cites ≥1 Community signal
3. The contrarian view challenges a named mainstream narrative
4. §8 gives different advice to different roles (not generic "you should")
5. All numbers in §0 are exact counts from data files, not estimates
6. No section is pure methodology — every section delivers judgment
7. Trend chains follow the five-step method (tech→product→user→business→opportunity)
8. Opportunity cards include itemized 100-point scoring breakdown

## Output Path

The automated cadence is Monday 10:30 Asia/Shanghai. Each run covers the previous complete Monday through Sunday. After both Markdown outputs are written, `assert-periodic-report-content.mjs` must pass before the weekly page-generator skill may run.

双路径写入，每周生成两份（内容相同，用途不同）：

```text
# 工作流归档（agent-workflow 内）
agent-workflow/reports/YYYY-MM-DD-weekly-ai-business-change-radar.md

# 内容发布索引（供网站页面生成，带日期标签便于检索）
01-SiteV2/content/08-report/YYYY-MM-DD--weekly-report--ai-business-change-radar.md
```

`content/08-report/` 版本 frontmatter 额外携带 `content_type: weekly-report`、`slug` 和 ISO `week` 标签，供网站生成脚本识别和路由。

## Handoff

After weekly report, coordinate with:
- `guanlan-trend-candidate-writer` only when a chain needs a lightweight trend-candidate decision
- Codex / Hermes repair handoff when report generation exposes missing source data, weak counts, or cross-lane freshness gaps
