# 2026-07-13 商业信号质量审计

## 结论

- 当日链路实际产出为 Raw 154、Pool 98、正式 Card 10；Card 数量不是由一个“10 张上限”造成，而是 88 条 Pool 未通过正式商业事件、证据、时效或标题 Gate。
- `index_only` 是后端审计/线索路由，不是正式 Card 类型。它用于保留目录页、首页、文档入口、泛列表、无完整正文或尚未解析到单一商业事件的材料。当天 98 条 Pool 中有 33 条进入 `index_only`；可读、带日期、指向单一产品/融资/客户事件的文章不应被误判为 `index_only`。
- 当天质量差的首要原因是采集结构失衡：154 条 Raw 中 89 条来自 RSS；其中 No Priors、Training Data、The MAD Podcast、Unsupervised Learning 四个播客源合计 64 条。98 条 Raw 没有可用发布日期，97 条标题来自通用 MyMemory 机翻。
- 当天 10 张正式 Card 全是 `product_service`，没有 `funding` 或 `case`。这说明问题不只是 Gate 偏严，还包括资金/案例搜索召回不足和 RSS 旧存量挤占候选池。
- 前台还存在二次质量损失：9 张 Card 使用同一类目模板摘要；腾讯混元主体被 URL 推断成 `Tencent Hunyuan Officially`，努比亚 iMoochi 主体为空。

## 根因与修复

### 1. index-only

`index_only` 的正确边界是“只可索引，不足以生成正式 Card”。本次没有取消该路由，而是修复它的上游误用条件：

- RSS 标准 RFC 日期现在可被识别；
- 带日期 URL 可补充发布日期；
- 超过 30 天的 RSS 条目在采集阶段过滤；
- 无日期的播客/Newsletter 只能保留为 discovery lead，不能进入 Core；
- RSS 每源默认最多 8 条，播客最多 3 条，避免单一长 feed 冲掉当日商业事件。

抽查 4 个 RSS 源复采时，规则在入池前过滤了 33 条过期内容，并将 GitHub Blog AI 与 TechCrunch AI 各截断到 8 条。

### 2. 标题链路

标题问题改为在最早责任层处理：

- 生产自动翻译不再使用通用 MyMemory；只接受受控 OpenAI 翻译或确定性商业规则；
- 历史翻译库和历史 Raw 中标记为 `mymemory_title_translation` 的结果不再被 Card 或前台复用；
- 对 LLM、Anthropic、Cursor、Perplexity、Fable、AI Agent 等受保护名称/概念增加语义保真检查；
- Taskade TSK-1 与 Stigg 2.0 增加精确、可复现的业务标题规则；
- 正式 Card 的主体优先使用 `signal_owner`，不再优先猜 URL slug；
- GitHub 日常工作流显式接入可选 `OPENAI_API_KEY`；没有密钥且没有确定性规则时，标题保持待翻译并阻止发布，而不是生成“看起来像中文”的错误标题。

`fact_translation_zh` 仍用于中文事实，而不再充当英文标题翻译的重复前置条件。标题 Gate 检查的是原始标题对应的精确中文标题资产。

### 3. 当日前台质量

- 10 张当前 Card 的主体均有效；腾讯混元与努比亚已修复。
- 10 张 Card 的摘要改为优先使用各自 Card 资产中的“价值描述/原文要点”，不再显示类目统一模板。
- 新增 Gate：活跃日期 Card 若暴露“这条产品/融资/案例信号可用于……”类模板摘要，构建直接失败。

## 高质量遗漏候选

以下材料处在当日监控窗口内，且比大量旧播客/泛观点更符合商业信号定义，应由修复后的资金/案例搜索重新抓取原文后进入 Raw / Pool：

- Prime Intellect 完成 1.3 亿美元 A 轮融资（TechCrunch，2026-07-08）：https://techcrunch.com/2026/07/08/prime-intellect-raises-130m-series-a-to-help-enterprises-build-their-own-ai-agents/
- Alta 完成 2500 万美元 A 轮融资（PR Newswire，2026-07）：https://www.prnewswire.com/news-releases/alta-raises-25m-to-redefine-the-go-to-market-architecture-for-revenue-teams-302820618.html
- KOR Protocol 完成 750 万美元 A 轮融资（GlobeNewswire，2026-07-07）：https://www.globenewswire.com/news-release/2026/07/07/3323545/0/en/KOR-Protocol-Raises-7-5-Million-Series-A-to-Build-the-Creative-Asset-Clearinghouse.html
- Tripo AI 完成 1.5 亿美元 A3 轮融资（GlobeNewswire，2026-07-02）：https://www.globenewswire.com/news-release/2026/07/02/3321436/0/en/tripo-ai-raises-150-million-in-series-a3-financing-backed-by-investors-across-automotive-gaming-internet-and-technology-sectors.html
- 英国国防部签署 20 亿英镑 AI 训练与分析合同（GOV.UK，2026-07）：https://www.gov.uk/government/news/ai-battle-lab-to-prepare-british-army-for-modern-warfare

这些候选不能只凭搜索摘要直接升级成 Card；需要重新抓取原文、保存快照与证据摘录，并通过融资/案例事实 Gate。

## 验证

- 标题生成器回归：通过；坏的 `LLM -> 法学硕士` 历史机翻不再加载。
- RSS 时效/限流/线索路由回归：通过。
- Core recall、资金查询优先级、证据对象、Pipeline Policy 回归：通过。
- 2026-07-13 Card editorial、去重、source-first、frontstage、frontstage regression Gate：通过。
- Skill Store：17 个 governed skills 同步，drift 为 0，eval/example coverage 为 100%。

## 尚需执行

合并修复后应重新运行 2026-07-13 商业信号生产链，让资金/案例查询在新的 RSS 时效与单源限流条件下回补当天 Raw / Pool；不得把上述搜索结果手工直升为 Card。
