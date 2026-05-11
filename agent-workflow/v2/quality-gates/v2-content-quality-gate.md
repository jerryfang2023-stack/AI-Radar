# V2 Content Quality Gate

Status: isolation gate. It does not run production sync.

## Required Checks

- V2 content is under `01-SiteV2/content/`.
- V1 directories remain read-only.
- Raw items have source level, source URL or archive path, and collection reason.
- Pool items have promotion or rejection reason.
- Structured Signals include event, evidence, business meaning, six-part decomposition, counter-evidence, and evidence gaps.
- Front Signals have at least 3 S/A/B sources.
- Opportunity titles are direction or scenario titles, not company names.
- Point material is calibration or boundary evidence, not fact evidence.
- Tags are split into seed, formal, and candidate layers.

## Blocking Failures

- V2 content written into V1 archive directories or old production directories without explicit migration approval.
- Front Signal with fewer than 3 S/A/B sources.
- Missing six-part decomposition.
- Certainty language or action command.
- Missing source trace.

## Executable Gate

Use:

```powershell
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
```

Current executable checks cover:

- Raw 30-50.
- Raw originals present.
- Pool 10-15.
- Structured 5-8.
- Front Signals exactly 3.
- Front Signals secondary-search depth:
  - each selected Signal must be 1200-1800 Chinese characters;
  - each selected Signal must contain `二次搜索补强`;
  - each selected Signal must include at least 3 secondary-search source bullets;
  - each selected Signal must contain `反证与边界` and `后续观察`.
- Opportunity Deep Dive depth:
  - if a deep dive is claimed, it must be 3000-6000 Chinese characters;
  - the `证据链` section must include at least 5 source bullets;
  - it must contain `证据链`, `反向证据`, `代表公司`, `融资信号`, `客户场景`, `定价 / 商业模式`, and `中国迁移卡点`;
  - if evidence is insufficient, the file may explicitly state `今日暂无足够证据支撑深挖内参。`.
- V2 content root and V2 site root exist.

This gate does not run old `04-Site` sync and does not deploy.
