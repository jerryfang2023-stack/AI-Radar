---
task_id: WSD-20260521-daily-observation-manual-write
title: 撰写 2026-05-21 今日观察
status: ready
owner: Experience & Editorial
encoding: UTF-8
---

# WSD-20260521-daily-observation-manual-write｜撰写 2026-05-21 今日观察

## 1. 任务目标

基于已经通过 readiness 和 cardcopy gate 的 2026-05-21 Raw / Pool / 资产卡，手动撰写一篇可进入内容库的「今日观察」。

本任务只写 2026-05-21，不写 2026-05-20。2026-05-20 是 `allow_with_degradation`，可以作为边界对照，但不得作为 2026-05-21 主判断的核心事实来源。

目标不是新闻汇总，而是形成一篇面向企业老板、资源型合伙人、行业操盘手的商业判断文章，回答：

- 今天真正发生了什么变化？
- 它影响的是预算、流程、岗位、组织责任，还是竞争边界？
- 哪些事实可以支撑判断？
- 哪些地方还不能过度推断？
- 企业该从哪里开始观察或行动？

## 2. 最小读取

本任务禁止全库扫描 Markdown。

只读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/05-daily-monitoring.md`
4. `context/06-execution-harness.md`
5. `context/07-card-asset-stage-model.md`
6. `agent-workflow/execution/WSD-20260521-daily-observation-manual-write.md`
7. `agent-workflow/reports/WSD-20260521-generate-20260520-20260521-asset-cards-closeout.md`
8. `skills/guanlan-daily-observation-pitch/SKILL.md`
9. `skills/guanlan-daily-observation/SKILL.md`
10. `skills/guanlan-daily-observation-qc/SKILL.md`

素材只读取 2026-05-21 相关文件：

- `agent-workflow/reports/2026-05-21-guanlan-daily-monitor-qc.md`
- `agent-workflow/reports/2026-05-21-guanlan-monitor-quality-gate.md`
- `01-SiteV2/content/01-raw/2026-05-21-raw-candidates.md`
- `01-SiteV2/content/02-pool/2026-05-21-pool-candidates.md`
- `01-SiteV2/content/04-business-signals/signals/2026-05-21-signals.md`
- `01-SiteV2/content/05-frontier-opinions/2026-05-21-opinion-cards.md`
- `01-SiteV2/content/06-asset-candidates/scene/`
- `01-SiteV2/content/06-asset-candidates/trend/`
- `01-SiteV2/knowledge/01-Signal-Cards/`
- `01-SiteV2/knowledge/02-Opinion-Cards/`
- `01-SiteV2/knowledge/03-Asset-Candidates/`

如果上下文不足，先说明缺什么，不要自行扩大读取范围。

## 3. 执行边界

允许：

- 使用 `guanlan-daily-observation-pitch` 做选题取舍。
- 使用 `guanlan-daily-observation-writer` 撰写 2026-05-21 今日观察。
- 使用 `guanlan-daily-observation-qc` 做独立质检并返修。
- 写入 `01-SiteV2/content/03-daily-observation/`。
- 产出 QC 报告和 closeout。

不允许：

- 不运行每日监测。
- 不重新生成 Raw / Pool。
- 不重新生成资产卡。
- 不更新网站前台数据。
- 不修改页面、CSS、组件或导航。
- 不推送 GitHub。
- 不部署 Netlify。
- 不恢复任何自动化任务。
- 不把 AI HOT、follow-builders、community / social opinion 当作事实主证据。
- 不直接改写 Raw 摘要来制造判断。
- 不绕过 eligible core_pool / 资产卡下结论。

## 4. 写作硬规则

- 必须先做选题 brief，再写正文。
- 正文必须基于 2026-05-21 `allow` 的素材。
- 事实判断必须能回到 `signal_card`、`scene_candidate`、`trend_candidate` 或 eligible `core_pool`。
- 前沿观点只能用于解释行业看法，不得替代事实证据。
- 趋势只能写为 `trend_candidate` 级别，不得写成已成立长期趋势。
- 不得使用内部生产词：Raw、Pool、Card、gate、QC、eligible core_pool、readiness、字段名、同步、入库。
- 文案必须符合观澜基础表达：克制、清楚、具体、有商业判断，低 AI 味。

## 5. 输出

必须输出：

1. 选题 brief：可写入 closeout，或独立写入 `agent-workflow/reports/2026-05-21-daily-observation-pitch.md`。
2. 今日观察正文：`01-SiteV2/content/03-daily-observation/2026-05-21--daily-observation--<slug>.md`
3. QC 报告：`agent-workflow/reports/2026-05-21-daily-observation-qc.md`
4. closeout：`agent-workflow/reports/WSD-20260521-daily-observation-manual-write-closeout.md`

Closeout 必须说明：

- 使用的 harness。
- 固定读取文件。
- 选题依据。
- 使用了哪些事实素材 / 资产素材。
- 哪些素材没有使用以及原因。
- QC 是否通过。
- 是否允许后续进入前台同步任务。
- 明确说明：未运行监测、未生成资产卡、未更新前台、未推送部署。

## 6. 验证

至少运行：

```powershell
node --check agent-workflow/tools/writer-style-gate.mjs
node agent-workflow/tools/writer-style-gate.mjs --date=2026-05-21
```

如果 writer-style gate 不适配当前产物，应在 closeout 中说明原因，并提供人工 QC 结果。

