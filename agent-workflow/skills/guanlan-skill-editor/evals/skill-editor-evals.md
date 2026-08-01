# Guanlan Skill Editor Evals

1. Pass when a recurring failure becomes an eval or example before long prose is added.
2. Fail when a skill update only adds broad instructions without a pass/fail check.
3. Pass when retired V2 outputs are removed or explicitly marked out of scope.
4. Fail when adjacent skills claim the same lane owner responsibility without a boundary note.
5. Pass when MEMORY.md is added only for durable lessons from real incidents.
6. Fail when a project skill is edited but the repo runtime `.agents/skills` or configured `.skill-store` compatibility mirror is left unsynced.
7. Pass when `metadata.guanlan.version` changes only with a clear upgrade reason.
8. Fail when the registry is hand-edited instead of regenerated from skill metadata.
9. Pass when Data Center V4 is the factual authority and any V3 rule is explicitly bounded as compatibility-only; fail when a skill, checklist, or health action calls V3.3 the current cross-system conflict authority.
10. Pass when trigger metadata begins with the user goal and a concrete `Do not use` neighbor; fail when activation depends on body-only prose or a generic role label.
11. Pass when inputs, workflow, non-inference/stop rules, output, and observable completion are present; fail when a successful command or generated file is treated as completion.
12. Pass when safe authorized local work proceeds without repeated permission prompts while external, destructive, costly, credential, publication, and scope-expanding actions have one clear boundary.
13. Pass when direct, indirect, incomplete, negative-trigger, and edge-case requests are represented in evals or the full audit matrix.
14. Fail when ordinary domain Skills copy GPT-5.6 API parameters, Pro mode, caching, or reasoning settings without owning that API surface and a measured need.
15. Pass when every active governed Skill has valid `agents/openai.yaml` and its `default_prompt` explicitly mentions `$skill-name`; fail on missing metadata or mojibake.
16. Pass when “只审计 Skill 触发边界” routes to `guanlan-code-rule-auditor`, while “审计并修复这些 Skill” uses the auditor for findings and this editor for the authorized mutation; fail when both Skills claim the audit-only request.
