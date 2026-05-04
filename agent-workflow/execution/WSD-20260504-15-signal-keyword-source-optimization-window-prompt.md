# WSD-20260504-15 执行窗口提示词

请按 01-WaveSight 项目的长期 agent-workflow 执行任务。

任务 ID：
WSD-20260504-15-signal-keyword-source-optimization

牵头 Agent：
Intelligence Data Agent

协作 Agent：
Workflow / Automation Agent、PM Agent

先读取：
1. AGENTS.md
2. docs/agent-handoff.md
3. agent-workflow/governance/window-dispatch-hub.md
4. agent-workflow/execution/WSD-20260504-15-signal-keyword-source-optimization.md
5. agent-workflow/agents/data-agent.md
6. agent-workflow/product/source-intelligence.md
7. agent-workflow/product/signal-system.md
8. agent-workflow/product/tag-taxonomy.md
9. agent-workflow/product/intelligence-data-model.md
10. agent-workflow/reports/keyword-quality-weekly-2026-18.md
11. agent-workflow/reports/daily-radar-run-2026-05-04.md
12. 提示词/关键词列表.md
13. 提示词/监测提示词V4.0.md
14. 提示词/AI机会评分与趋势判断系统V4.0.md

任务目标：
优化每日 AI 商业雷达的监测关键词和来源策略，提高每日 Signal 质量。当前信号容易偏向大企业、大融资和高曝光新闻；本轮需要补充发现新趋势、新投资方向、小额起步融资、技术更新迭代方向、开源 / 开发者生态、垂直行业早期采用和反证信号的能力。

执行要求：
1. 不要只是堆关键词，要重做关键词和来源分层。
2. 保留大企业 / 大融资监测，但新增早期信号层。
3. 明确每类关键词的使用边界，避免噪音。
4. 给出组合查询示例，而不是只有单词列表。
5. 更新 `提示词/关键词列表.md`。
6. 更新 `提示词/监测提示词V4.0.md`，让每日监测明确覆盖早期融资、技术迭代、新趋势、开发者生态和反证。
7. 更新 `agent-workflow/product/source-intelligence.md`，补充早期来源、投资来源、开发者来源、垂直行业来源的分层和采信规则。
8. 不改网站页面，不改同步脚本，不改内容源历史文件，不改自动化任务配置对象。

必须覆盖的新增维度：
- 早期融资：pre-seed、seed、angel、grant、accelerator、YC、stealth、university spinout、research spinout。
- 新投资方向：vertical AI、agent infra、AI security、AI evals、AI memory、robotics、on-device AI、small models、AI workflow、AI compliance。
- 技术迭代：model release、inference cost、context window、multimodal、voice/video model、agent protocol、MCP、tool use、AI memory、evals、synthetic data、model routing。
- 开源与开发者生态：GitHub AI agent、open-source model、agent framework、AI SDK、plugin marketplace、developer adoption。
- 垂直早期采用：design partner、pilot customer、first customer、procurement、tender、industry-specific AI agent。
- 反证与降温：shutdown、churn、gross margin pressure、inference cost pressure、lawsuit、copyright risk、security incident、privacy enforcement。

输出：
1. 更新后的 `提示词/关键词列表.md`。
2. 更新后的 `提示词/监测提示词V4.0.md`。
3. 更新后的 `agent-workflow/product/source-intelligence.md`。
4. 报告：`agent-workflow/reports/signal-keyword-source-optimization-2026-05-04.md`。
5. UTF-8 收口文件：`agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md`。

必跑检查：
- node agent-workflow/tools/run-quality-gates.mjs syntax
- 用 UTF-8 读取你新增或修改的 Markdown 文件，确认中文不乱码。

自动化影响：
本任务可能影响 `ai-2` 每日商业雷达生成口径。closeout 中必须说明：
- 是否需要后续更新 `ai-2` 自动化提示词或运行说明。
- 是否影响 `ai-the-point`。
- 是否影响 `ai-3`。
- 下一次每日雷达应观察哪些质量指标。

完成后回到调度中枢窗口提交：
收口：agent-workflow/reports/WSD-20260504-15-signal-keyword-source-optimization-closeout.md
