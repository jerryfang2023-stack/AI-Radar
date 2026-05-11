---
title: V2 每日生产线 / 栏目 / 知识库治理 Stage 1 分类诊断
date: 2026-05-10
task_id: WSD-20260510-08-v2-daily-pipeline-column-knowledge-governance
status: stage1 / confirmation-first
owner: workflow / data / pm
encoding: UTF-8
---

# Stage 1 分类诊断

本阶段只做分类诊断和确认清单，不修改每日自动化 prompt，不清理历史规则，不修改 `01-SiteV2/content/`、`01-SiteV2/knowledge/` 或 `01-SiteV2/site/`。

## 1. 每日抓取流程分类

当前应以 V2 每日自动化为准：

- 入口：`v2-content-site-daily-update`，每天 09:00。
- 内容路径：`01-SiteV2/content/`。
- 来源入口：`01-SiteV2/content/10-databases/source-registry-v2.json`、`agent-workflow/v2/v2-daily-source-collection-strategy.md`。
- 当前 registry：27 个来源，类型覆盖 news / builder / developer / research / product / funding / marketplace。
- 漏斗：Raw 80-150；降级日 50-80；Pool 20-30；Structured 8-15；Front Signal 3-5；Deep Dive 1-2；Trend Updates 3-5。
- M 级通道：AI HOT / follow-builders / HN / X / Reddit 等只作 discovery / source-router，必须回看原始 URL 后重新判定 S/A/B/C/D。
- 失败降级：GDELT、AI HOT、GitHub、arXiv、requires-key 来源失败时记录 `failed_sources`、`fallback_used`、`evidence_gaps`，不得用低质量来源硬凑数量。

## 2. 各栏目产出质量要求分类

V2 前台栏目建议以当前导航为准：今日要点 / 关键信号 / 机会解码 / 商业内参。

- 今日要点：每日主线、关键变化、风险边界和需要继续观察的信号，不是新闻列表。
- 关键信号：事件 + 商业含义 + S/A/B 来源 + 二搜补强 + 反证边界；默认 3 条，高信号日 4-5 条。
- 机会解码：只在证据足够时生成 1-2 条 Deep Dive；每条需要至少 5 个来源、至少 2 个 S 级或一手来源、反向证据和商业模式说明。
- 商业内参：承担深度解释和展示元素，不输出空泛观点；面向普通老板，落到客户、成本、收入、效率、风险、采购、渠道或竞争位置。
- Point 校准：观点层，只能支持、挑战或校准判断，不能替代事实主证据。
- Trend 背景：用于趋势链、热力输入和长期背景，不作为 V2 一级导航恢复。

## 3. Obsidian 知识库生成规则分类

当前边界：

- `content/` 是生产漏斗。
- `knowledge/` 是 Obsidian 长期知识库。
- `site/` 是前台展示。
- `agent-workflow/` 是治理和验收账本。

入库分类：

- Raw：一般不进入 knowledge，只保留生产回溯。
- Pool：少数高价值候选可沉淀为 Source / Case。
- Structured：可沉淀为 Signal / Trend 候选。
- Front Signal：优先沉淀为 Signal 卡。
- Point Calibration：优先沉淀为 Point / Person / Company 卡。
- Deep Dive：优先沉淀为 Opportunity / Case / Source 卡。
- 长期 Trend：多条 Signal 支撑后沉淀为 Trend 卡。

模板现状：

- 已有 Signal / Point / Case / Opportunity / Trend / Source / Company / Person / Daily Curation 模板。
- 模板已包含稳定 ID、关系字段、来源路径、反证与边界。
- 仍需确认何时触发 Source / Trend / Opportunity 卡，避免把知识库变成 Raw 归档。

## 4. 历史冲突规则清单

需要后续按 E 类确认后清理或标注的冲突：

- 旧 V1 `04-Site` 命令仍在部分历史文件中出现，只能作归档参考，不能作为 V2 当前完成标准。
- 旧自动化 `ai-the-point`、`ai-2`、`ai-3` 已停止，不应再作为 V2 任务影响判断对象。
- 旧 Raw 30-50 口径已被 Raw 80-150 取代；如历史文件仍出现，应标记 historical 或废止。
- `P0-12` 测试管线是 test-only，不得替代 V2 正式生产漏斗。
- `V2-SITE-QUALITY-AUTO` 已 failed / not-accepted / closed，不得继承其 stage1、stage2、reference mockups 或 local-site-quality-pass。
- 曾并入 failed 任务的 `V2-PUBLIC-COPY-FOOTER-CLEANUP`、`V2-PAGE-TIME-DIMENSION` 不得视为已解决。
- The Point / Trends 的旧一级导航口径与 V2 当前导航冲突，应只保留为观点校准、趋势背景和热力输入。
- Tags 旧前台一级栏目口径与当前口径冲突，应保留为搜索、筛选和关系网络能力。
- `09-ai-news-radar` 不属于本任务范围，除非用户后续明确纳入。

## 5. A-F 六类确认清单

### A. 每日抓取流程

- 建议保留：09:00 自动化、Raw 80-150、降级 50-80、source registry、S/A/B/C/D 分级、M 级 source-router 规则。
- 建议修改：把 “M 级通道必须回看原始 URL” 写成更硬的执行检查；明确 source_distribution 和 raw_count_by_source_type 是 daily log 必填。
- 建议废止：任何 Raw 30-50 或单一泛搜索可完成 V2 监测的口径。
- 确认后会影响：每日自动化 prompt、source registry 说明、fallback policy 或 daily run log 模板。

### B. 内容漏斗质量

- 建议保留：Raw / Pool / Structured / Front / Deep Dive / Trend / Point 分层。
- 建议修改：把每阶段数量、最低来源、二搜、反证、字数、缺口记录统一成一张质量表。
- 建议废止：只满足数量、不满足证据和深度也可报告完成的口径。
- 确认后会影响：内容质量规范、v2content gate、daily run log 模板。

### C. 栏目产出标准

- 建议保留：今日要点 / 关键信号 / 机会解码 / 商业内参为 V2 前台主结构。
- 建议修改：明确 Point 校准和 Trend 背景不作为一级栏目，而是进入每日判断和内参材料。
- 建议废止：The Point / Trends 恢复为 V2 一级导航、Scoring 普通前台化、Tags 一线栏目化。
- 确认后会影响：栏目规范、内容 schema、站点数据生成口径。

### D. 知识库生成规则

- 建议保留：Raw 不全量入库；只沉淀可复用、可双链、可追溯资产。
- 建议修改：补充 Signal / Point / Case / Source / Trend / Opportunity 卡的触发条件和不入库条件。
- 建议废止：把 `content/` 当唯一长期知识库，或把 `knowledge/` 当自动化原始归档。
- 确认后会影响：`01-SiteV2/knowledge/README.md`、模板、MOC 规则。

### E. 历史冲突清理

- 建议保留：历史文件作为归档参考，不删除。
- 建议修改：在 governance / handoff / progress / dispatch-board 中标注不得继承规则。
- 建议废止：V1、P0/P1、test-only、failed 任务、旧 Raw 30-50 作为 V2 当前规则的默认依据。
- 确认后会影响：governance、handoff、dispatch-board、progress。

### F. 验收与回填

- 建议保留：source quality gate、v2content、syntax、feature_list JSON parse、UTF-8 closeout。
- 建议修改：每日自动化 closeout 必须写已确认数量、降级原因、来源分布、证据缺口、是否更新 site data。
- 建议废止：未跑 gate 或未说明风险也报告完成。
- 确认后会影响：closeout 模板、quality-gates 说明、调度验收口径。

## 6. 建议执行顺序

1. A 每日抓取流程：先锁输入质量，否则后续质量标准没有稳定来源。
2. B 内容漏斗质量：定义 Raw 到 Front / Deep Dive 的可验收门槛。
3. C 栏目产出标准：把内容漏斗映射到前台主栏目与降级模块。
4. D 知识库生成规则：在内容标准稳定后定义 Obsidian 入库触发。
5. E 历史冲突清理：避免清理时误删仍需引用的规则，先有新规则再标旧规则。
6. F 验收与回填：最后把 gate、stage summary、closeout 和调度回填统一。

## Stage 1 验证

- `feature_list.json` JSON parse：通过。
- 未运行站点同步：本阶段不修改站点或内容。
- 未运行 `v2content`：本阶段不修改 V2 内容。
- 未运行 `syntax`：本阶段只新增 Markdown 诊断报告，未修改脚本或页面。
