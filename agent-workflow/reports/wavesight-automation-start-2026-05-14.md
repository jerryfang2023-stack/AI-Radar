# WaveSight 六线程自动化启动记录

日期：2026-05-14  
状态：completed / automations-active  
范围：source-router 配置、每日采集脚本、6 个自动化线程

## 1. 配置恢复

已将旧归档中的 source-router 配置恢复到新目录：

```text
01-SiteV2/content/09-databases/keyword-monitoring-v2.json
01-SiteV2/content/09-databases/source-registry-v2.json
```

旧来源：

```text
01-SiteV2/content/_archive/2026-05-12-pre-reframe-content/10-databases/
```

## 2. 脚本路径更新

已更新：

```text
agent-workflow/tools/run-v2-daily-pipeline.mjs
```

关键变化：

- 关键词配置路径从 `content/10-databases/` 改为 `content/09-databases/`。
- 新增 Pool 输出到 `content/02-pool/`。
- 变化簇候选输出到 `content/04-business-signals/`。
- 观点候选输出到 `content/04-business-signals/`。
- 旧 `05-trend-chain/`、`07-points/` 输出路径已移除。
- source-router 文案从旧 Front Signal / Point 口径调整为变化卡、案例卡、观点卡和今日观察口径。

## 3. 自动化 prompt 文件

已新增：

```text
agent-workflow/automation-prompts/daily-monitor-router.md
agent-workflow/automation-prompts/asset-card-generator.md
agent-workflow/automation-prompts/daily-observation-writer.md
agent-workflow/automation-prompts/case-signal-researcher.md
agent-workflow/automation-prompts/trend-report-writer.md
agent-workflow/automation-prompts/brief-periodical-writer.md
```

## 4. 自动化状态

已更新旧自动化：

- `v2-content-site-daily-update` -> 名称更新为 `daily-monitor-router`
- 状态：`ACTIVE`
- 节奏：每天 09:00

已创建并启动：

- `asset-card-generator`：`ACTIVE`，每天 09:45
- `daily-observation-writer`：`ACTIVE`，每天 10:30
- `case-signal-researcher`：`ACTIVE`，每天 14:00
- `trend-report-writer`：`ACTIVE`，每周二 10:00
- `brief-periodical-writer`：`ACTIVE`，每周五 16:00

## 5. Dry-run 验证

已运行小样本 dry-run：

```powershell
node agent-workflow/tools/run-v2-daily-pipeline.mjs --date=2026-05-14 --dry-run=true --aihot-limit=5 --builders-limit=5 --search-limit=5 --hn-limit=5 --raw-target=10 --gdelt-query-limit=1 --fetch-timeout-ms=5000
```

结果：

- `raw_count`: 10
- `aihot_count`: 5
- `follow_builders_count`: 2
- `keyword_search_count`: 3
- `theme_concentration_warning`: none
- 主题覆盖：企业 Agent / 治理、模型能力 / 成本、开发者工具 / 开源生态、垂直行业 / 客户采用、监管 / 风险 / 反证、uncategorized

失败源：

- 部分 keyword-search 查询 timeout。
- GDELT 返回 429。

说明：上述失败已符合旧 source-router 预期，应记录为 fallback / failed_sources，不阻塞 AI HOT、keyword-search、follow-builders 其他通道继续运行。

## 6. 后续注意

- 当前仅做小样本 dry-run，没有立即生成正式今日内容。
- 6 个自动化已 ACTIVE，会按设定时间运行。
- 后续还需要更新 `v2content` gate，使其识别新目录结构和 6 线程产物。
- 深度研究线程不得硬凑：无触发项或资料不足时，应写运行报告说明。

