# V2 Source Quality Gate

生成时间：2026/5/8 14:14:48

## 结论

- 日期：2026-05-08
- 状态：passed
- 检查项：8
- 失败项：0

## 检查明细

| 检查 | 状态 | 说明 |
|---|---|---|
| source-registry-v2.json parses | passed | 01-SiteV2/content/10-databases/source-registry-v2.json |
| registry has sources | passed | 27 sources |
| source_id values are unique | passed | unique |
| required fields are complete | passed | complete |
| enabled sources cover at least 4 source types | passed | 7 types |
| enabled sources include S/A/B levels | passed | A, M, C, B, S |
| C-level sources are never fact-main | passed | ok |
| requires-key / requires-consent sources are disabled by default | passed | 5 gated sources |
