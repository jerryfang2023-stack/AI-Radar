# 2026-06-12 Daily Loop + Skill Evolution Audit

## 1. Summary

- Audit date: 2026-06-12
- Scope: V3.3.5 Daily Loop, Hermes / Codex repair loop, experience automation, mirrored skills, and legacy daily-monitor skill.
- Result: needs-fix
- Biggest issue: V3.3.5 current context declares three lane-specific monitor skills, but they do not exist in either `agent-workflow/skills/` or `C:\Users\86186\.skill-store`.

This audit did not change production site data, Raw / Pool / Card assets, frontstage JSON, GitHub workflows, or installed skills.

## 2. Sources Read

Current context:

- `context/05-daily-monitoring.md`
- `context/06-execution-harness.md`
- `context/08-v3-3-automation.md`
- `context/09-v3-3-current-action-index.md`
- `context/10-v3-3-experience-automation.md`
- `context/11-hermes-daily-supervision-instructions.md`

Skill governance:

- `agent-workflow/skills/guanlan-skill-editor/SKILL.md`
- `agent-workflow/skills/guanlan-skill-editor/references/audit-checklist.md`
- `agent-workflow/skills/guanlan-skill-editor/references/memory-policy.md`

Current mirrored skills:

- `agent-workflow/skills/guanlan-raw-pool-card/`
- `agent-workflow/skills/guanlan-daily-monitor-qc/`
- `agent-workflow/skills/guanlan-monitor-quality-gate/`
- `agent-workflow/skills/guanlan-trend-candidate-writer/`
- `agent-workflow/skills/follow-builders/`
- `agent-workflow/skills/guanlan-typography-qc/`

Installed legacy / runtime skills:

- `C:\Users\86186\.skill-store\guanlan-daily-monitor\SKILL.md`
- `C:\Users\86186\.skill-store\guanlan-daily-monitor-qc\SKILL.md`
- `C:\Users\86186\.skill-store\guanlan-monitor-quality-gate\SKILL.md`
- `C:\Users\86186\.skill-store\guanlan-raw-pool-card\SKILL.md`
- `C:\Users\86186\.skill-store\follow-builders\SKILL.md`

Recent reports:

- `agent-workflow/reports/2026-06-12-guanlan-monitor-quality-gate.md`
- `agent-workflow/reports/2026-06-12-guanlan-daily-monitor-quality-loop.md`
- `agent-workflow/reports/2026-06-12-daily-supervision-report.md`
- `agent-workflow/reports/2026-06-12-weekly-health.md`
- `agent-workflow/reports/2026-06-12-action-retrospective.md`
- `agent-workflow/inbox/hermes-to-codex/2026-06-12-business-signals-top10-recurring.md`
- `agent-workflow/inbox/hermes-to-codex/2026-06-12-business-signals-gate-failure-and-top10-empty.md`

## 3. What Is Working

### 3.1 Current Daily Loop Is Operational

The 2026-06-12 monitor quality gate passed:

- Raw count: 185 / required 150.
- Pool count: 86 / required 75.
- Routed Pool: 60 / required 60.
- Core Pool: 33 / required 30.
- Homepage / directory core items: 0.
- M-source-only core items: 0.
- Core large-vendor ratio: 0.152 / max 0.35.

The 2026-06-12 daily supervision report passed all three current lanes:

- Community Intelligence: passed.
- Business Signals / Intelligence Map / Dashboard: passed.
- First-Line Viewpoints: passed.

### 3.2 Self-Improvement Loop Exists And Is Being Used

The 2026-06-12 weekly health report detected repeated incident categories:

- `business_signals_top10_missing`: 2x.
- `monitor_or_gate_failure`: 2x.

The prevention artifact was partly added:

- `agent-workflow/skills/guanlan-raw-pool-card/evals/raw-pool-card-evals.md` now checks that `v3-data-observation-desk.json.top10` exists and contains exactly 10 active-date items.
- `agent-workflow/skills/guanlan-raw-pool-card/MEMORY.md` has a 2026-06-12 entry stating that `frontstageCards` is not a substitute for the public / Hermes Top10 contract.

This matches the V3.3.5 experience loop: repeated failure -> gate / eval / MEMORY / context prevention.

### 3.3 Raw / Pool / Card Skill Is The Best-Structured Current Skill

`guanlan-raw-pool-card` has:

- concise `SKILL.md`;
- `evals/`;
- `examples/`;
- `references/`;
- `MEMORY.md`.

It is the closest current implementation of "center short, radius thick".

## 4. Findings

### P0-1. Declared Lane Monitor Skills Are Missing

Current V3.3.5 documents declare three current monitor skills:

- `skills/guanlan-business-signals-monitor/SKILL.md`
- `skills/guanlan-first-line-viewpoints-monitor/SKILL.md`
- `skills/guanlan-community-intelligence-monitor/SKILL.md`

Checked locations:

- `agent-workflow/skills/guanlan-business-signals-monitor`: missing.
- `agent-workflow/skills/guanlan-first-line-viewpoints-monitor`: missing.
- `agent-workflow/skills/guanlan-community-intelligence-monitor`: missing.
- `C:\Users\86186\.skill-store\guanlan-business-signals-monitor`: missing.
- `C:\Users\86186\.skill-store\guanlan-first-line-viewpoints-monitor`: missing.
- `C:\Users\86186\.skill-store\guanlan-community-intelligence-monitor`: missing.

Impact:

- V3.3.5 says column monitor skills are current execution entries, but agents cannot load them.
- Repeated failures are currently assigned to nearby generic skills, mainly `guanlan-raw-pool-card`, not to lane-specific monitor skills.
- Hermes / Codex repair requests use lane names, but the skill system does not yet mirror that ownership model.

Required fix:

- Create and mirror the three lane-specific monitor skills.
- Treat existing generic skills as downstream capabilities called by those lane skills.

### P0-2. Installed `guanlan-daily-monitor` Still Uses Retired Quantity Gates

`C:\Users\86186\.skill-store\guanlan-daily-monitor\SKILL.md` still says:

- Raw target: `80-150`, or `50-80` degraded.
- Pool target: `20-40`.
- command uses `--raw-target=120 --raw-min=80 --raw-max=150`.

Current V3.3.5 rules require:

- at least 150 active Raw candidates;
- at least 75 Pool items;
- at least 60 routed Pool items;
- at least 30 usable `core_pool` items.

Impact:

- If an agent triggers the installed `guanlan-daily-monitor` directly, it can route production through obsolete thresholds.
- This contradicts `context/05-daily-monitoring.md`, `context/07-v3-intelligence-generation-rules.md`, and the updated QC / quality gate skills.

Required fix:

- Update `.skill-store\guanlan-daily-monitor\SKILL.md`.
- Mirror it into `agent-workflow/skills/` only if it remains a current lower-level skill.
- Add `evals/daily-monitor-evals.md`.
- Remove follow-builders as a monitoring output for Business Signals; keep it only as independent First-Line Viewpoints discovery / viewpoint lane.

### P0-3. Hermes Inbox Closure Is Inconsistent

Two related inbox items exist:

- `2026-06-12-business-signals-gate-failure-and-top10-empty.md`: resolved, with resolution notes.
- `2026-06-12-business-signals-top10-recurring.md`: still open and urgent.

The open item describes the same Top10 recurrence that has already produced prevention artifacts in `guanlan-raw-pool-card`.

Impact:

- Hermes / weekly health may continue to treat a repaired class as open.
- The closure contract says repairs should be closed only after validation plus prevention; here prevention exists, but one inbox item remains open.

Required fix:

- Resolve or merge the open recurring inbox item with the fixed item.
- Use `npm run resolve:hermes -- --file=<inbox-file> --fix-commit=<commit-or-pending> --validation=<check> --prevention=eval`.

### P1-1. Existing Skills Are Not Yet Aligned To V3.3.5 Naming

Several mirrored skills still say `V3.3.1` in descriptions or body:

- `guanlan-daily-monitor-qc`
- `guanlan-monitor-quality-gate`
- `guanlan-trend-candidate-writer`
- `follow-builders`
- `guanlan-typography-qc`

Most rules are compatible with V3.3.5, but version wording can mislead future agents.

Required fix:

- Replace V3.3.1 wording with V3.3.5 or "current V3.3 rules" where stable.
- Prefer linking to `context/version-ledger.md` for exact current version.

### P1-2. Absolute `.skill-store` Paths Leaked Into Project Mirrors

Examples:

- `agent-workflow/skills/guanlan-monitor-quality-gate/SKILL.md` references `C:\Users\86186\.skill-store\guanlan-daily-monitor-qc\SKILL.md`.
- It also references `.skill-store` eval / reference paths.

Impact:

- The project mirror is less portable.
- A future agent reading the mirrored skill may follow installed runtime paths instead of project-versioned mirror paths.

Required fix:

- In mirrored skills, use project-relative references such as `agent-workflow/skills/guanlan-daily-monitor-qc/SKILL.md`.
- In installed `.skill-store` skills, keep installed-path references only when needed.

### P1-3. Follow-Builders Skill Is Too Broad For The First-Line Viewpoints Lane

`follow-builders` now has a good WaveSight boundary and Obsidian sync section, but most of its `SKILL.md` is still a generic digest onboarding / delivery product:

- OpenClaw platform detection.
- Telegram / email setup.
- cron delivery.
- first-run onboarding.

Impact:

- It is useful as a base skill, but not ideal as the V3.3.5 First-Line Viewpoints monitor skill.
- A production agent may load a large amount of irrelevant delivery/onboarding context.

Required fix:

- Keep `follow-builders` as the source / digest base skill.
- Create `guanlan-first-line-viewpoints-monitor` as the thin lane owner that reads only the WaveSight-specific boundary, build script, gate, and Obsidian timeline sync.

### P1-4. Most Skills Lack Good / Bad Examples

Current mirrored skill structure:

| Skill | Has evals | Has examples | Has memory | Has references |
|---|---|---|---|---|
| `guanlan-raw-pool-card` | yes | yes | yes | yes |
| `guanlan-daily-monitor-qc` | yes | no | no | no |
| `guanlan-monitor-quality-gate` | yes | no | no | yes |
| `guanlan-trend-candidate-writer` | yes | no | no | no |
| `follow-builders` | yes | yes | no | no |
| `guanlan-typography-qc` | yes | no | no | no |
| `guanlan-skill-editor` | no | no | no | yes |

Impact:

- Evals exist, but many skills lack concrete artifact-shape examples.
- Future repairs may drift into prose rules instead of clear examples.

Required fix:

- Add at least one good and one bad example for:
  - Daily Monitor QC report.
  - Monitor quality gate handoff.
  - Trend candidate / no-candidate decision.
  - First-Line Viewpoints timeline entry after the lane skill is created.
  - Community Intelligence lead / verified promotion boundary after the lane skill is created.

### P1-5. Weekly Health Correctly Escalates Repeated Incidents, But The Responsible Skill Is Ambiguous

Weekly health escalated repeated Business Signals incidents. The prevention went into `guanlan-raw-pool-card`.

Impact:

- This is acceptable as a short-term landing zone.
- Long-term, repeated Business Signals lane failures should be owned by `guanlan-business-signals-monitor`, which then delegates to `guanlan-raw-pool-card` for Raw / Pool / Card-specific fixes.

Required fix:

- Once `guanlan-business-signals-monitor` exists, move or reference the 2026-06-12 Top10 lesson from `guanlan-raw-pool-card` into the lane monitor's MEMORY or eval index.

### P2-1. Missing Skill Registry

There is `agent-workflow/skills/README.md`, but no operational registry showing current / archive / retired skill status, lane ownership, installed source, mirror path, eval coverage, and last prevention artifact.

Impact:

- Agents can list folders, but not reliably choose the current execution skill.

Recommended fix:

- Add `agent-workflow/skills/skill-registry.md`.

### P2-2. Historical Daily-Monitor Reports Are Useful But Not Classified

Daily monitor reports exist across 2026-05-23 through 2026-06-12.

Impact:

- They are valuable failure / trend evidence.
- Without classification, older V2-ish reports may accidentally reintroduce retired thresholds.

Recommended fix:

- Treat pre-V3.3.5 reports as `manual/archive`.
- Use only repeated failure signatures to create evals, not to restore old thresholds.

## 5. Current Alignment Matrix

| Area | Status | Notes |
|---|---|---|
| Daily monitor current context | pass | `context/05` and `context/07` agree on 150 / 75 / 60 / 30 gates. |
| Execution harness | partial | Still references `skills/guanlan-daily-monitor/SKILL.md`, but installed skill is stale. |
| V3.3.5 automation | partial | Correct lane model, but declared lane monitor skills are missing. |
| Hermes daily supervision | pass | Clear handoff format, user escalation boundary, and no direct rule editing. |
| Experience automation | pass | Correct failure -> eval / MEMORY / context escalation loop. |
| Skill mirrors | partial | Good start, but missing lane-specific current skills and registry. |
| Installed `.skill-store` skills | partial | QC / gate / raw-pool-card updated; `guanlan-daily-monitor` stale. |
| Recent prevention artifact | partial | Top10 eval and memory exist; one related Hermes inbox item remains open. |

## 6. Recommended Fix Plan

### P0

1. Create lane-specific monitor skills:
   - `guanlan-business-signals-monitor`
   - `guanlan-first-line-viewpoints-monitor`
   - `guanlan-community-intelligence-monitor`

2. Update or retire installed `guanlan-daily-monitor`:
   - If kept, align thresholds to V3.3.5.
   - Add evals.
   - Remove old Raw 80-150 / Pool 20-40 default.

3. Resolve the open recurring Top10 Hermes inbox item:
   - Link it to the fixed gate / eval / memory.
   - Close it with validation and prevention metadata.

### P1

4. Normalize version wording in mirrored skills:
   - Use "current V3.3 rules" or V3.3.5 where appropriate.

5. Replace absolute `.skill-store` paths inside project mirrors with project-relative mirror paths.

6. Add examples for the main report / artifact shapes:
   - monitor QC report;
   - quality gate report;
   - trend candidate and no-candidate;
   - first-line viewpoint timeline entry;
   - community lead verification boundary.

7. Move repeated Business Signals incident ownership into `guanlan-business-signals-monitor` after that skill exists.

### P2

8. Add `agent-workflow/skills/skill-registry.md`.

9. Add a small report classification note:
   - current reports are evidence;
   - historical reports are archive;
   - archived thresholds must not override current context.

## 7. Borrowed Principles From The Skills Article

The article's strongest guidance maps cleanly to Guanlan:

- Skill is not a prompt; it is a versioned capability asset.
- `description` is routing, not marketing.
- Keep the center short and put heavy rules in references / examples / evals.
- A repeated failure should first become an eval, not another long paragraph.
- Gotchas from real failures are higher value than generic advice.
- Thin harness, fat skills is the right architecture for Guanlan's GitHub Actions + scripts + lane skills.

## 8. Final Judgment

Guanlan's production loop is now healthier than its skill ownership model.

The runtime system has already moved to V3.3.5: independent lanes, supervision, PR publication, Pages deployment, Obsidian sync, and prevention artifacts. The skill system is halfway there: generic chain skills are useful and partly testable, but the current V3.3.5 lane monitor skills are missing, while one installed legacy monitor skill still carries obsolete thresholds.

The next governance upgrade should not add more prose to existing generic skills. It should create the three lane-specific monitor skills and make them the explicit owners of daily failures, evals, and memory.

## 9. P0 Follow-Up Executed

Executed after the audit on 2026-06-12:

- Created and mirrored `guanlan-business-signals-monitor`.
- Created and mirrored `guanlan-first-line-viewpoints-monitor`.
- Created and mirrored `guanlan-community-intelligence-monitor`.
- Updated installed `C:\Users\86186\.skill-store\guanlan-daily-monitor` from retired Raw `80-150` / Pool `20-40` defaults to current V3.3.5 monitoring thresholds.
- Mirrored `guanlan-daily-monitor` into `agent-workflow/skills/`.
- Updated current context references from `skills/...` to `agent-workflow/skills/...`.
- Resolved `agent-workflow/inbox/hermes-to-codex/2026-06-12-business-signals-top10-recurring.md` with `fix_commit=2f5fb1c`, validation, and `prevention_added=eval`.

Validation:

- New project-mirrored skills passed `quick_validate.py`.
- New installed `.skill-store` skills passed `quick_validate.py`.
- Legacy threshold scan shows retired Raw `80-150` / Pool `20-40` only inside explicit eval forbidden examples and historical version-ledger freeze text.
- `npm run inbox:hermes -- --status=open --latest=false` returned zero open items.
