# Good Weekly Opportunity Radar Update

User request:

> 更新本周切入点图和产品痛点图。

Good response behavior:

1. Read `opportunity-evidence-v2.json` and resolve its Event, Claim, and Source refs to accepted V4 bundles.
2. Use latest 7 days as the active window.
3. Compare against the previous 30 days.
4. Re-check weak or surprising cells against original excerpts.
5. Leave unsupported cells blank.
6. Update only the opportunity radar data or rendering needed for:
   - Entry Point Map / 切入点图;
   - Product Pain Map / 产品痛点图;
   - a small reviewed Direction Card set when at least two accepted CanonicalEvents support each hypothesis.
7. Use DeepSeek V4 Pro to write candidate titles and content from the bounded evidence manifest.
8. Keep the generated file pending until a human reviews evidence, unsupported numbers, hype language, and counter-signals.
9. Do not modify the relationship graph's tag logic.
10. Run Direction Card and frontstage regression tests.

Example judgment:

- `法务 x 合同审查` can heat only if accepted Claims mention legal teams, contract review, customer deployment, product launch, procurement, or adoption evidence.
- `成本 x 模型网关` can heat only if sources mention AI usage cost, billing, routing, gateway, API pricing, or cost governance.
- `企业工作流 x AI Agent` should not appear as a decision cell because it is too broad.
- `开源模型推理成本骤降，正在将价值从模型层迁移至模型路由与成本治理层` is a valid title shape because it states a value migration; `多模型路由与成本控制` is only a category label.
- A DeepSeek V4 Pro candidate may publish only after review confirms multiple accepted Events, Claim/Source refs, original-source links, a structural judgment, a counter-signal, concrete unknowns, and a first validation action; tag frequency or model fluency alone is insufficient.
