# Pool Routing Rules Alignment｜2026-05-18

## 结论

此前没有当前生效的独立 Pool 主规则文档。Pool 规则散落在 Raw schema、source intelligence、content README、daily-monitor-router prompt 和部分脚本提示语中，容易导致不同自动化线程对入池、降级、回源补证和观点资产使用标准理解不一致。

本轮已新增并启用：

- `agent-workflow/product/pool-routing-rules.md`

它现在是 Pool 分流的唯一细则文档。其他文档只引用它，不再各自定义一套 Pool 入池标准。

## 已处理冲突

1. `daily-monitor-router.md`
   - 新增必读 `pool-routing-rules.md`。
   - 修正 AI HOT `paper` 类默认入候选的旧口径：paper 必须命中技术迭代、商业动作、开发者生态或明确应用场景。
   - 明确 `core_pool / emerging_pool / user_feedback_pool / watchlist / index_only / discard` 不能混用。
   - 明确不得为凑数量把低证据线索硬升为核心候选。

2. `raw-evidence-schema.md`
   - 已标注 Pool 分流细则以 `pool-routing-rules.md` 为准。
   - Raw schema 只保留 Raw 字段、证据门槛和下游使用边界。

3. `source-intelligence.md`
   - 已标注该文档只定义来源治理和采集通道。
   - Pool 入池标准统一转到 `pool-routing-rules.md`。

4. `01-SiteV2/content/README.md`
   - 已标注 README 只说明 content 目录如何承接 Pool。
   - 具体入池、降级、淘汰和禁止项统一转到 `pool-routing-rules.md`。

5. 自动化脚本提示语
   - 清理 `Structured / Front Signal`、`Point 阶段`、旧 `10-databases` 等历史残留。
   - `v2-content-gate.mjs` 移除旧的 `12-20` Pool 降级硬范围，改为常规 20-40，严重降级必须在日志显式声明。

## 当前 Pool 规则摘要

- Pool 是 Raw 之后的候选索引，不是事实正文，也不是最终判断资产。
- Pool 只能从 Raw 进入，必须能回到 `raw_ref / raw_archive / raw_json / source_url / full_text_hash / key_excerpts / business_elements / evidence_seed / missing_information`。
- `core_pool` 需要 `has_full_text=true`、`extraction_quality=high|medium`、`source_level=S|A|B`、明确商业变化、`commercial_value>=3`、`guanlan_relevance>=3`。
- `emerging_pool` 可接纳 B/C 级早期线索，但需要 `emerging_signal_score>=4`，不得直接写成前台事实。
- `user_feedback_pool` 用于社区反馈、讨论升温、开发者阻力和客户痛点，不证明公司动作、融资、收入、市场规模。
- `watchlist` 用于值得观察但证据不足的线索。
- `index_only` 用于有索引价值但商业变化不足的材料。
- `discard` 用于噪音、重复、抓取失败、标题党、SEO、affiliate、prompt 模板、教程合集等。

## 仍需注意

- `agent-workflow/product/archive/` 中仍保留旧 `Structured Signal / Front Signal` 文案。该目录是历史归档，不参与当前执行口径；如未来做全库文本清扫，可单独处理 archive。
- 旧内容产物里可能仍有历史标题、历史字段或历史路径，不应作为当前自动化判断依据。

## 验证

已执行：

- `node --check agent-workflow/tools/run-v2-daily-pipeline.mjs`
- `node --check agent-workflow/tools/v2-content-gate.mjs`
- `node --check agent-workflow/tools/v2-source-probe.mjs`
- `node --check agent-workflow/tools/generate-builders-viewpoints-from-follow-builders-skill.mjs`
- `node --check agent-workflow/tools/generate-builders-viewpoints-from-originals.mjs`
- `node --check agent-workflow/tools/manual-backfill-raw-from-json.mjs`

关键冲突扫描：

- 当前执行文档和工具中未再发现 `S/A/B/C/M`、`Structured / Front Signal`、`Point 阶段`、`10-databases`、`12-20` 等旧执行口径。
- 仅 archive 归档文档中仍保留历史 `Front Signal` 表述。
