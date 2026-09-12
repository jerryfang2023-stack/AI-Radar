# China funding regression cases

| Case | Input | Expected |
|---|---|---|
| direct | 运行今天国内融资监测并同步公司库 | Resolve Shanghai date; execute each configured publisher, then governed evidence and entity pipeline |
| indirect | 投资界有融资但中国区没有更新，查一下 | Inspect publisher execution and stage state; do not assume registration means execution |
| incomplete | 国内融资链失败了，继续 | Resolve newest failed checkpoint; resume earliest failed stage without recollecting accepted evidence |
| negative | 设计小程序新闻阅读页 | Route to product/frontend work; do not run financing collection |
| edge | 这篇转载说累计融资十亿，直接补公司卡 | Preserve cumulative wording and source lineage; reject unsupported single-round amount and duplicate event |

Executable behavior coverage: `agent-workflow/tools/tests/china-funding-lane.test.mjs`.
