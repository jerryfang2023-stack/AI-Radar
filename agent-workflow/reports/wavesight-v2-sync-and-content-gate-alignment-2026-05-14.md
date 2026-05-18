---
title: WaveSight V2 Site Sync And Content Gate Alignment
date: 2026-05-14
status: completed
owner: dev / workflow
---

# WaveSight V2 Sync And Content Gate Alignment

## 背景

V2 内容目录已经切换到六线程生产线：

- `03-daily-observation/`
- `04-business-signals/`
- `05-case-research/`
- `06-trend-reports/`
- `07-business-briefs/`
- `09-databases/`

但站点同步脚本和 V2 内容闸门仍主要按旧目录读取，例如 `04-selected-signals/`、`03-structured-signals/`、`08-opportunities/`。这会导致新内容已经生成，前台数据和质量门禁却继续沿用旧漏斗。

## 本次处理

1. 更新 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`。
   - 优先读取新目录：今日观察、商业信号、观点候选、变化簇候选、趋势报告和商业内参。
   - 保留旧 Front Signal / Structured / Opportunity 解析作为 fallback。
   - 前台数据键保持稳定：`daily`、`signals`、`points`、`trends`、`opportunities` 不做破坏性重命名。
   - 趋势追踪无正式报告时，生成“继续观察 / 暂无公开信息补足深挖条件”的兜底项，避免前台空对象。

2. 更新 `agent-workflow/tools/v2-content-gate.mjs`。
   - Pool 改读 `02-pool/YYYY-MM-DD-pool-candidates.md`。
   - 变化卡改读 `knowledge/01-Change-Cards/`。
   - 案例卡改读 `knowledge/02-Case-Cards/`。
   - 观点候选改读 `content/04-business-signals/*opinion-candidates.md`。
   - 变化簇候选改读 `content/04-business-signals/*change-cluster-candidates.md`。
   - 新增今日观察文章厚度检查。

3. 补厚今日观察文章。
   - 文件：`01-SiteV2/content/03-daily-observation/2026-05-14--daily-observation--agent-execution-enters-engineering-workflow.md`
   - 新增“接下来盯什么”段落，使文章更接近日常市场综述，而不是短评。
   - 按 writer style gate 修改了触发词。

## 当前生成结果

`site-content.json` 已重新生成，当前前台数据：

- activeDate：`2026-05-14`
- 今日观察：1 篇
- 商业信号：4 条
- Builders / 观点线索：2 条
- 趋势候选：12 条
- 趋势追踪兜底项：1 条

## 质量检查

已通过：

- `node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `node --check agent-workflow/tools/v2-content-gate.mjs`
- `node --check 01-SiteV2/site/assets/app.js`
- `node agent-workflow/tools/run-quality-gates.mjs syntax`
- `node agent-workflow/tools/run-quality-gates.mjs style`
- `node agent-workflow/tools/run-quality-gates.mjs v2content --date=2026-05-14`

本地 HTTP 检查通过：

- `index.html` 200
- `daily.html` 200
- `signals.html` 200
- `opportunities.html` 200
- `brief.html` 200

未完成：

- 浏览器截图 QA 未完成。当前环境缺少 Playwright 运行库，无法用本地浏览器截图复核视觉。

## 后续建议

下一轮应继续处理同步链路的命名债：

- 前台仍保留 `opportunities.html` 等历史路由作为兼容层，显示名称已是“趋势追踪”。
- 可等内容同步稳定后，再决定是否做路由级改名。
- 历史 PRD 和历史 closeout 中仍有旧栏目名，不建议批量改历史报告；只需维护 `current-context.md`、`column-architecture.md`、`COPY.md`、`DESIGN.md` 等当前真源。
