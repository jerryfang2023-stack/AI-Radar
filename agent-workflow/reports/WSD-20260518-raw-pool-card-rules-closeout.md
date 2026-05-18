# WSD-20260518-RAW-POOL-CARD-RULES Closeout

日期：2026-05-18  
owner：`workflow-automation / intelligence-data`  
状态：accepted  
编码：UTF-8

## 0. 调度摘要

```yaml
task_id: WSD-20260518-RAW-POOL-CARD-RULES
board_id: V2-RAW-POOL-CARD-RULES
status: accepted
recommended_status: accepted
dispatch_path: ad-hoc-user-directed
closeout_path: agent-workflow/reports/WSD-20260518-raw-pool-card-rules-closeout.md
changed_files:
  - AGENTS.md
  - agent-workflow/governance/current-context.md
  - agent-workflow/product/source-intelligence.md
  - agent-workflow/product/raw-evidence-schema.md
  - agent-workflow/product/pool-routing-rules.md
  - agent-workflow/product/daily-monitoring-playbook.md
  - agent-workflow/automation-prompts/guanlan-daily-monitor.md
  - agent-workflow/automation-prompts/asset-card-generator.md
  - agent-workflow/automation-prompts/case-signal-researcher.md
  - agent-workflow/automation-prompts/trend-report-writer.md
  - 01-SiteV2/content/README.md
  - 01-SiteV2/knowledge/README.md
  - 01-SiteV2/knowledge/10-Templates/change-card-template.md
  - 01-SiteV2/knowledge/10-Templates/case-card-template.md
  - 01-SiteV2/knowledge/10-Templates/opinion-card-template.md
  - 01-SiteV2/knowledge/10-Templates/trend-card-template.md
  - skills/guanlan-daily-monitor/SKILL.md
gates:
  syntax: pass
  browser_desktop: n/a
  browser_mobile: n/a
  design_director: n/a
  pm_gate: n/a
automation_impact:
  guanlan-daily-monitor: changed / active
  asset-card-generator: changed
  daily-observation-writer: indirectly affected by Raw / Pool evidence gates
  case-signal-researcher: changed
  trend-report-writer: changed
blockers:
  - none
next_action: 调度中枢验收并回填；另派旧资产 schema 迁移与 Raw 回填任务
```

## 1. 对应任务

- 派发单：无独立派发单。本轮为用户在当前窗口连续指令推进。
- 任务目标：清理 Raw / Pool / 变化卡 / 案例卡 / 观点卡 / 趋势卡之间的证据规则冲突，重建每日监测任务，并把后续卡片生成规则统一到 Raw-first / Evidence-first。

## 2. 本轮完成

- 将每日监测从旧 `daily-monitor-router` 重建为独立 `guanlan-daily-monitor` 任务。
- 固化“三段式默认策略”：AI HOT 全量 + follow-builders + 关键词补齐；不足时启动搜索；重要卡片强制回源补证。
- 将 AI HOT 定义为主发现入口，不作为事实主证据；follow-builders 每日全量进入前沿观点候选。
- 新增 / 固化 Pool 独立分流规则：`core_pool / emerging_pool / user_feedback_pool / watchlist / index_only / discard`。
- 将 Raw 升级为“原始证据仓库 + 内容加工入口”，明确 `full_text`、`clean_text`、快照、抓取质量、去重版本、结构化摘录、商业要素、`evidence_seed`、评分、`usable_for`、`missing_information`。
- 清理 Raw / Pool / source intelligence / content README 之间的冲突和历史残留。
- 执行 2026-05-18 今日监测，生成当日 Raw / Pool / 候选文件，并记录证据缺口。
- 按 Raw / Pool 证据规则重设变化卡模板和 `asset-card-generator`。
- 按同一套规则重设案例卡、观点卡、趋势卡模板。
- 更新 `case-signal-researcher` 和 `trend-report-writer`，避免旧卡片或观点直接推动事实结论。

## 3. 关键规则变更

### 3.1 Raw

- Raw 是所有事实资产的证据底座。
- `full_text` 优先保存原文；`clean_text` 作为 AI 分析入口。
- `has_full_text=true`、`extraction_quality=high|medium`、`source_level=S|A|B` 才能作为核心事实证据。
- C / M / 社区 / 聚合来源可以触发检索，但不得单独作为事实主证据。
- AI HOT 只能作为 discovery source；原始页面抓取成功后，以原始页面重新定级。

### 3.2 Pool

- Pool 是候选分流层，不是事实正文。
- Pool 条目必须携带 Raw 回源字段和证据缺口。
- `core_pool` 才可进入正式事实资产候选；`watchlist` 和 `user_feedback_pool` 不得被硬升为前台事实。

### 3.3 变化卡

- 正式 / 前台变化卡必须有核心 Raw 证据。
- 必须保留 `raw_ref`、`raw_archive`、`raw_json`、`full_text_hash`、`key_excerpts`、`evidence_seed`、`missing_information`。
- 只有社区、聚合或弱线索时，只能是 `watchlist_only` 或内部候选。

### 3.4 案例卡

- 案例卡先写“对象和事件”，再说明支撑哪条变化。
- 不得写成公司百科、产品黄页或空泛赛道判断。
- 正式 / 前台案例卡必须有核心 Raw 证据。

### 3.5 观点卡

- 观点卡证明“谁在何时何处说了什么”，不证明观点里的事实成立。
- 必须保留原文摘录、原文链接、发表时间、抓取时间、平台、可见范围、capture_scope 和必要快照。
- 观点中的公司动作、客户采用、收入、融资、市场规模等事实主张，必须另补 S/A/B 来源。

### 3.6 趋势卡

- 趋势卡不由单条新闻、单个观点或未回填 Raw 的旧资产生成。
- 趋势成立必须汇总变化卡、案例卡、观点卡和 Raw 证据。
- 观点卡只能说明预期、叙事变化、产品路线或资本关注点，不能单独推动趋势成立。

## 4. 修改文件

### 规则 / 产品文档

- `agent-workflow/product/source-intelligence.md`：清理来源等级、AI HOT、follow-builders、三段式入口和高波动来源规则。
- `agent-workflow/product/raw-evidence-schema.md`：升级 Raw schema，明确全文、证据门槛、结构化摘录、商业要素、缺口和下游使用。
- `agent-workflow/product/pool-routing-rules.md`：新增 Pool 独立分流主规则。
- `agent-workflow/product/daily-monitoring-playbook.md`：新增每日监测独立任务规则。
- `01-SiteV2/content/README.md`：同步 Raw / Pool / 每日监测口径。
- `01-SiteV2/knowledge/README.md`：同步变化卡、案例卡、观点卡、趋势卡证据规则。

### 自动化提示 / Skill

- `agent-workflow/automation-prompts/guanlan-daily-monitor.md`：新增独立监测任务 prompt。
- `agent-workflow/automation-prompts/asset-card-generator.md`：同步变化卡 / 案例卡 / 观点卡证据门槛。
- `agent-workflow/automation-prompts/case-signal-researcher.md`：同步案例补证规则。
- `agent-workflow/automation-prompts/trend-report-writer.md`：同步趋势卡证据门槛。
- `skills/guanlan-daily-monitor/SKILL.md`：新增本地 skill。

### 知识库模板

- `01-SiteV2/knowledge/10-Templates/change-card-template.md`
- `01-SiteV2/knowledge/10-Templates/case-card-template.md`
- `01-SiteV2/knowledge/10-Templates/opinion-card-template.md`
- `01-SiteV2/knowledge/10-Templates/trend-card-template.md`

### 报告与进度

- `agent-workflow/reports/pool-routing-rules-alignment-2026-05-18.md`
- `agent-workflow/reports/guanlan-daily-monitor-rebuild-2026-05-18.md`
- `agent-workflow/reports/2026-05-18-v2-daily-source-router-log.md`
- `agent-workflow/reports/change-card-raw-pool-alignment-2026-05-18.md`
- `agent-workflow/reports/case-opinion-trend-template-raw-pool-reset-2026-05-18.md`
- `agent-workflow/progress.md`

## 5. 验证结果

已运行：

- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过。
- 最近报告：`agent-workflow/reports/quality-gates-syntax-2026-05-18-20260518-063409.md`。

已执行：

- 2026-05-18 每日监测：Raw 100 条，Pool 30 条。
- 输出：`01-SiteV2/content/01-raw/2026-05-18-raw-candidates.md`、`01-SiteV2/content/02-pool/2026-05-18-pool-candidates.md`、`01-SiteV2/content/04-business-signals/2026-05-18-change-cluster-candidates.md`、`01-SiteV2/content/04-business-signals/2026-05-18-opinion-candidates.md`。

未运行：

- 浏览器 / 页面验收：不适用，本轮为规则、模板、自动化任务和内容生产链路，不涉及前台页面布局。
- 旧资产迁移验证：未运行，本轮仅重设模板与规则，未批量迁移旧卡片。

## 6. 自动化影响

- `guanlan-daily-monitor`：已新建并启用，取代旧监测任务。
- `asset-card-generator`：证据门槛收紧；后续不能从 Pool 摘要、社区讨论或 AI HOT 聚合页直接生成正式前台卡。
- `case-signal-researcher`：补证任务必须围绕 Raw 缺口执行。
- `trend-report-writer`：趋势卡 / 趋势报告必须回看底层 Raw，旧卡片未回填时只能作背景。
- `daily-observation-writer`：间接受影响；引用变化卡 / 案例卡事实时必须尊重新证据门槛。

## 7. 风险与遗留

### 7.1 旧资产未迁移

扫描结果：

- `01-SiteV2/knowledge/01-Change-Cards/`：24 张旧变化卡均缺新版 Raw 回源字段。
- `01-SiteV2/knowledge/02-Case-Cards/`：23 张旧案例卡均缺新版 Raw 回源字段。
- `01-SiteV2/knowledge/03-Opinion-Cards/`：30 张旧观点卡均缺新版 Raw 回源字段。
- `01-SiteV2/knowledge/04-Trend-Cards/`：当前 0 张趋势卡。

建议另派任务：

- 旧变化卡 schema 迁移 + Raw 回填。
- 旧案例卡 schema 迁移 + Raw / 二搜补证。
- 旧观点卡 schema 迁移 + 原文摘录 / capture_scope 回填。
- 迁移后再执行商业信号前台数据重建。

### 7.2 工作区存在大量非本任务变更

当前 git 工作区有大量历史删除、生成文件和未跟踪报告。本 closeout 只覆盖 Raw / Pool / 每日监测 / 卡片模板规则这组变更。

调度窗口验收时应按本 closeout 的文件范围检查，不要把全部 git dirty 状态直接归入本任务。

### 7.3 外部搜索质量仍有缺口

2026-05-18 监测中，keyword-search 非社区路径仍有 timeout / GDELT 429 等问题。相关条目只能作为 Watchlist / User Feedback，不能作为前台事实。

## 8. 建议主调度窗口下一步

1. 验收本 closeout，回填 `progress.md` 和看板。
2. 新增任务：旧资产 schema 迁移与 Raw 回填。
3. 新增任务：按新版模板重新跑 `asset-card-generator`，生成可支撑前台的变化卡 / 案例卡 / 观点卡。
4. 新增任务：再同步商业信号栏目页和详情页，避免页面继续读取旧薄卡。

## 9. 推荐验收结论

推荐：`accepted`。

理由：本轮目标是规则和模板重设，不是旧资产迁移。规则冲突已清理，模板已重写，自动化提示已同步，语法检查已通过；旧资产迁移作为明确遗留任务处理。

## 10. 调度中枢验收记录

- 验收时间：2026-05-18
- 验收结论：`accepted`
- 复验范围：关键规则文件、自动化提示、知识库模板、`guanlan-daily-monitor` skill 是否存在；`syntax` Quality Gate 是否通过。
- 复验结果：`node agent-workflow/tools/run-quality-gates.mjs syntax` 通过，报告 `agent-workflow/reports/quality-gates-syntax-2026-05-18-20260518-064346.md`。
- 非阻塞说明：检索到的旧词残留主要位于历史派发单、旧进度记录、旧归档内容或 feature 历史项，不作为当前运行口径；已修正 `docs/agent-handoff.md` 中六线程第一项的旧 `daily-monitor-router` 表述。
- 后续任务：旧变化卡 / 案例卡 / 观点卡 schema 迁移与 Raw 回填；迁移后重跑 `asset-card-generator` 并同步商业信号前台数据。
