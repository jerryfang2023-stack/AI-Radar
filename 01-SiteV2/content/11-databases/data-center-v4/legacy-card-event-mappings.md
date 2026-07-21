# Legacy Signal Card → V4 Canonical Event Mapping

> 旧 Signal Card 是兼容资产，不等于 V4 CanonicalEvent。一个 Card 可能没有正式事件，也可能因旧聚合逻辑对应多个事件；以本表的 `mapping_status` 为准。

- schema: `LEGACY-CARD-EVENT-MAP-V1.0`
- card instances: 1041
- logical card ids: 931
- duplicate legacy ids: 104
- mapped to one event: 455
- ambiguous (multiple events): 3
- Raw found, no canonical event: 545
- unresolved: 38

## Status semantics

| status | meaning |
|---|---|
| `mapped` | 该旧 Card 的来源可解析到一个 V4 商业事件。 |
| `ambiguous` | 旧 Card 的聚合证据可解析到多个 V4 事件，不能视为同一个事件。 |
| `raw_only` | 原始材料已纳入 V4，但未形成符合 V4 事实合同的商业事件。 |
| `unresolved` | 当前无法可靠解析旧 Card 的原始材料。 |

完整逐条映射见 [[legacy-card-event-mappings.json]]。
