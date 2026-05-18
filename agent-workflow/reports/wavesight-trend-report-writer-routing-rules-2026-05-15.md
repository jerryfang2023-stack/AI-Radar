# 2026-05-15 Trend Report Writer 路由与输出规则收口

状态：accepted / rules-solidified

## 本轮目标

固化第 136-148 题确认的趋势报告 writer 运行规则、候选排序、延期候选、无报告决策、输出路径、同步兼容和前台排序规则。本轮只固化文档和目录，不改 writer 脚本本体。

## 已创建目录

```text
01-SiteV2/content/06-trend-reports/
├─ flash/
├─ full/
└─ no-report-decisions/
```

## 已固化规则

### writer 产出上限

`trend-report-writer` 每次运行最多产出 1 篇。

- weekly mode：最多 1 篇 `TRD-FULL-*`。
- urgent mode：最多 1 篇 `TRD-FLASH-*`。

writer 的主任务仍然是写一篇趋势报告。生命周期管理是附带动作，不把 writer 变成后台调度器。

### 急件候选排序

```text
多源密度 > 观澜重点赛道 > 商业影响 > 来源质量 > 时间新鲜度
```

不按热度排序。

### Deferred Candidates

未选中的急件候选写入当天急件候选文件的 `Deferred Candidates`。

字段：

```yaml
deferred_reason:
next_review:
priority_rank:
defer_count:
```

最多延后 2 次。第三次必须落状态：

- `keep_watching`
- `downgrade_to_trend_card`
- `archived`

### no_report_decision

writer 每次运行，要么产出一篇 Trend Report，要么产出一份 `no_report_decision`。

目录：

```text
01-SiteV2/content/06-trend-reports/no-report-decisions/
```

命名：

```text
YYYY-MM-DD-no-trend-report-decision.md
```

最小字段：

```yaml
date:
mode: weekly | urgent
decision: no_report
reason:
checked_candidates:
missing_evidence:
next_action:
```

`no_report_decision` 不进入前台索引，不进入知识库，只供自动化复盘、调度检查和质量门禁使用。

### 输出路径

新内容只写入：

```text
06-trend-reports/flash/
06-trend-reports/full/
06-trend-reports/no-report-decisions/
```

文件名必须包含 ID：

```text
YYYY-MM-DD--TRD-FLASH-YYYYMMDD-XX--slug.md
YYYY-MM-DD--TRD-FULL-YYYYMMDD-XX--slug.md
```

### 同步兼容

站点同步脚本后续应按以下策略读取：

1. 优先读 `full/`。
2. 再读 `flash/`。
3. 短期兼容读 `06-trend-reports/` 根目录旧文件。
4. 不读取 `no-report-decisions/` 入前台。

生产写新结构，读取保留兼容。

### 前台排序

趋势追踪页排序：

1. 最新深度报告：`kind = full`，显示 1 篇主报告，最多 2 篇。
2. 正在升温：`kind = flash` + `status = watching`。
3. 已升级：`kind = flash` + `status = upgraded`，引导去 full report。
4. 报告库：历史 full reports；历史 flash 第一版弱展示或不展示。

### 今日观察引用规则

趋势快报发布后，不自动全文进入今日观察。

- 今日观察可以自然提及当天主线相关快报。
- 不复述完整快报。
- 可给链接或“延伸阅读”。
- 如果快报不是当天主线，不强行出现。

## 已更新文件

- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/column-architecture.md`
- `agent-workflow/governance/current-context.md`
- `docs/agent-handoff.md`
- `AGENTS.md`
- `01-SiteV2/content/09-databases/urgent-trend-candidates/README.md`

## 本轮验收

- `node --check 01-SiteV2/site/assets/app.js` 通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs` 通过。
- `node --check agent-workflow/tools/v2-content-gate.mjs` 通过。
- `node --check agent-workflow/tools/unified-site-sync.mjs` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax` 通过。
- `node agent-workflow/tools/run-quality-gates.mjs style` 初次检查发现 2026-05-15 当日内容存在过度工整表达和禁用风格残留；已修正当日 `daily-observation` 与 `business-brief` 内容后复跑通过。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-15` 通过。

## 结论

趋势报告 writer 的执行边界已经清楚：每次只写一篇，未选候选延期记录，证据不足写 no-report，内容按 kind 分路径。下一步可以改 `trend-report-writer` prompt 和同步脚本读取策略。
