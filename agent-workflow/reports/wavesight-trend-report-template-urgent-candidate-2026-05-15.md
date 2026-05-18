# 2026-05-15 Trend Report 模板与急件候选规则收口

状态：accepted / templates-created

## 本轮目标

将第 122-134 题确认的 Trend Report 模板、状态字段、ID 规则、急件候选记录和人工复核规则落到项目文件。

## 已创建

### Trend Report 模板

- `01-SiteV2/knowledge/10-Templates/trend-report-flash-template.md`
- `01-SiteV2/knowledge/10-Templates/trend-report-full-template.md`

模板拆分，schema 不拆。两者统一使用 `asset_type: trend_report`。

### 急件候选库说明

- `01-SiteV2/content/09-databases/urgent-trend-candidates/README.md`

该目录用于记录急件候选和人工放行结果，不作为前台文章。

## 已固化规则

### ID

```text
TRD-FLASH-YYYYMMDD-XX
TRD-FULL-YYYYMMDD-XX
UTCAND-YYYYMMDD-XX
```

### 状态

| status | front_status | 前台 |
|---|---|---|
| `watching` | `visible` | 继续观察 |
| `upgraded` | `visible` | 已升级为深度报告 |
| `archived` | `hidden` | 后台保留 |
| `revised` | `hidden` | 后台保留 |

前台第一版只展示 `watching` 和 `upgraded`。`archived` / `revised` 保留给后台和商业内参复盘。

### 升级关系

快报：

```yaml
status: upgraded
upgrade_target: TRD-FULL-YYYYMMDD-XX
```

正式深度报告：

```yaml
kind: full
upgraded_from: TRD-FLASH-YYYYMMDD-XX
```

### 急件候选

急件候选 ID 使用：

```text
UTCAND-YYYYMMDD-XX
```

`review_decision` 只保留三种：

- `approve_flash`
- `keep_watching`
- `downgrade_to_trend_card`

`approve_flash` 必须有人工作出最终放行。记录 `reviewer_role`、`reviewer_window`、`decision_time`、`review_notes`，不记录真实姓名。

## 已更新文档

- `agent-workflow/product/trend-model.md`
- `agent-workflow/product/intelligence-data-model.md`
- `agent-workflow/governance/current-context.md`
- `docs/agent-handoff.md`
- `AGENTS.md`

## 结论

Trend Report 的内容模板、急件候选记录和状态规则已经具备执行基础。下一步可以更新 `trend-report-writer` prompt，让它支持 weekly mode 和 urgent mode。

## 验证

- 字段扫描：`TRD-FLASH`、`TRD-FULL`、`UTCAND`、`front_status`、`upgrade_target`、`upgraded_from`、`approve_flash`、`reviewer_role`、`reviewer_window` 已在模板、急件候选 README 和产品文档中出现。
- 旧 schema 扫描：新增模板、急件候选 README 和相关当前文档未发现旧 `opportunities`、`contentIndex.opportunities`、`relatedOpportunities`、`hasOpportunity`、`data-opportunity` 当前引用。
- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`：通过。
- `node --check agent-workflow/tools/v2-content-gate.mjs`：通过。
- `node --check agent-workflow/tools/unified-site-sync.mjs`：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed。
- `node agent-workflow/tools/run-quality-gates.mjs style`：首次发现 2026-05-15 今日观察同类句式超限；已修正文案后复跑 passed。
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-15`：passed。
