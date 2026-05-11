# WSD-20260510-08 Closeout

任务：`WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance`
日期：2026-05-10
状态：completed / awaiting hub acceptance
牵头：Workflow / Data / PM

## 1. 执行结论

本任务已按用户要求完成 A-F 六类逐项确认与分阶段治理。

本轮不是直接改每日内容或网站页面，而是完成 V2 每日生产线、栏目产出标准、Obsidian 知识库生成规则和历史冲突规则的治理收口。

未修改：

- 每日内容正文。
- 既有知识卡正文。
- V2 网站页面。
- Codex app 实际 09:00 automation prompt。

已修改：

- V2 内容生产规范。
- V2 栏目架构规范。
- Obsidian 知识库目录与 frontmatter 规范。
- V2 content gate。
- 历史冲突覆盖规则。
- handoff、progress、dispatch-board 和阶段 summary。

## 2. 阶段文件

- Stage 1：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage1.md`
- Stage A：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage-A.md`
- Stage B：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage-B.md`
- Stage C：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage-C.md`
- Stage D：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage-D.md`
- Stage E：`agent-workflow/reports/WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance-stage-E.md`

## 3. A-F 完成情况

### A. 每日抓取流程

已确认并写入规则：

- 每日 V2 生产入口仍以 09:00 自动化为准。
- Raw：80-150。
- 降级日 Raw：50-80，并必须写明降级原因。
- Pool：20-30。
- Structured：8-15。
- Front：3-5。
- Deep Dive：1-2。
- Trend Updates：3-5。
- AI HOT、follow-builders、HN、X、Reddit 等只作 M 级 discovery / source-router，不作为事实主证据。
- 必须回看原始 URL，并按原始来源重分 S/A/B/C/D。

### B. 内容漏斗质量

已确认并写入规则：

- Trend 判断改为 Raw 热度变化 + Pool 主题簇 + Structured 证据强度 + 历史连续性 + 反证边界。
- 高热但未进 Signal 的内容保存为 Heat Candidate。
- Heat Candidate 内容文件：`01-SiteV2/content/05-trend-chain/YYYY-MM-DD-heat-candidates.md`。
- Heat Candidate 知识库目录：`01-SiteV2/knowledge/11-Heat-Candidates/`。
- Structured / Front 不要求每条都有反证，但必须说明证据边界。
- Deep Dive 可在未发现关键反证时通过，但证据不足不得通过。
- V2 content gate 已升级检查 Heat Candidate、日志字段、来源等级、Front S/A/B 来源数量、引用 URL、字数等。

### C. 栏目产出标准

已确认并写入规则：

- 当前前台主结构：今日要点 / 关键信号 / 机会解码 / 商业内参。
- 今日要点定位为 AI 商业判断 Newsletter，2500-4500 中文字。
- Structured Signal：1200-2000 中文字，结构化信号卡。
- Front Signal：3000-5000 中文字，深度分析报告。
- Deep Dive / 机会解码：6000-10000 中文字，商业内参级长文。
- 商业内参是跨信号、趋势、机会、观点的组合判断报告，不等于单条 Deep Dive。
- Builders 观点放入关键信号下，详情页按人物 / title / 发言时间线展示观点变化。

### D. 知识库生成规则

已确认并写入规则：

- 不新建 `08-Builders`，Builders 归入 `08-People/`。
- 新增 `10-AIBriefs/`。
- 新增 `11-Heat-Candidates/`。
- 不把 Raw 80-150 全量搬入知识库。
- Daily Brief Index 使用 `00-MOC/YYYY-MM-DD--daily-brief-index.md`。
- 知识卡必须保留统一 frontmatter，`source_urls`、`formal_tags`、`last_reviewed` 等字段不可缺失。
- Heat Candidate 升级后必须保留双向回链：原候选写 `converted_to`，新 Signal / Trend 写 `origin_heat_candidates`。

### E. 历史冲突清理

已完成：

- 新增 `agent-workflow/governance/v2-current-rule-overrides.md`。
- 将旧 Daily Brief / Signals / The Point / Opportunities / Trends 一级栏目口径压回历史说明。
- 将 Raw 30-50 标记为历史测试管线，不作为当前生产标准。
- 将“行动建议 / 下一步验证动作”改为观察重点、风险边界和后续观察问题。
- 更新 governance、product、handoff、progress、dispatch-board。

### F. 验收与回填

已完成：

- 检查 A-E stage summary 齐全。
- 检查新窗口优先读取链路：handoff、governance README、v2-current-rule-overrides 均已覆盖。
- 检查 content / knowledge README 与当前规则一致。
- 回填 `docs/agent-handoff.md`。
- 回填 `agent-workflow/progress.md`。
- 回填 `agent-workflow/execution/dispatch-board.md`。
- 写入本 closeout。

## 4. 关键当前规则入口

后续新窗口如遇旧规则冲突，优先读取：

- `AGENTS.md`
- `docs/agent-handoff.md`
- `agent-workflow/governance/v2-current-rule-overrides.md`
- `agent-workflow/product/column-architecture.md`
- `01-SiteV2/content/README.md`
- `01-SiteV2/knowledge/README.md`

## 5. 验收结果

已运行：

- `feature_list.json` JSON 结构检查：passed。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。

说明：

- syntax gate 报告路径：`agent-workflow/reports/quality-gates-syntax-2026-05-10-20260510-130712.md`。
- 当前环境中部分 `node --check` 子进程显示 `spawn blocked (EPERM)`，质量门禁脚本按其内部降级逻辑标记为 passed。
- 本任务为规范治理，不涉及浏览器截图、多身份权限或页面部署验收。

## 6. 遗留与后续建议

建议后续另行派发：

- F 后续专项：真实跑一次 09:00 自动化或手动模拟日更，验证 Raw / Pool / Structured / Front / Deep Dive / Heat Candidate / Daily Brief Index 全链路。
- 页面专项：基于 C 类确认，分别设计今日要点、关键信号、机会解码、商业内参页面模板。
- 知识库专项：抽取一个 Heat Candidate 升级为 Signal / Trend，验证 `converted_to` 与 `origin_heat_candidates` 回链。

## 7. 调度回调

回调度窗口：

`收口：WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance`
