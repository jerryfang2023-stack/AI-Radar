---
task_id: WSD-20260520-daily-monitor-rules-confirm-optimization
title: 每日监测任务细节确认与优化
status: ready / two-stage-dispatch
owner: Intelligence Engine / Build & Release
created_at: 2026-05-20
encoding: UTF-8
---

# WSD-20260520｜每日监测任务细节确认与优化

## 1. 任务背景

当前 `guanlan-daily-monitor` 已进入 V2.1 生产链路，但用户需要在继续改规则前，先完整看清楚：

- 当前每日监测规则是什么；
- 相关规则文档分别负责什么；
- Raw 如何进入 Pool；
- Pool 如何分流为 `core_pool / index_only / watchlist / needs_backfill`；
- 哪些规则可能导致低质量官网、工具页、目录页、中文官网或非一线来源进入核心素材；
- 后续如何优化，避免污染变化卡、案例卡、观点卡、趋势卡和前台内容。

本任务分两步执行，不能跳步。

## 2. 两阶段边界

### 阶段 1｜规则展示与确认

只允许阅读、梳理、展示，不允许修改文件，不允许运行长时采集，不允许生成内容。

阶段 1 必须输出：

1. 当前每日监测流程总图：
   - Source discovery
   - Raw capture
   - Full text / snapshot
   - Quality gate
   - Pool routing
   - Monitor QC
   - Assets chain readiness
2. 当前来源结构：
   - AI HOT
   - follow-builders
   - HN / GitHub / GDELT / RSS / official / media / VC / research / developer / keyword-search
   - 各自角色：发现入口、事实主证据、补证入口、降级入口
3. 当前 Raw 生成规则：
   - 目标数量
   - 必填字段
   - full_text / snapshot / hash / source_level 要求
   - C / D / M 级来源边界
4. 当前 Pool 生成规则：
   - Pool 数量目标
   - `core_pool`
   - `index_only`
   - `watchlist_only`
   - `needs_backfill`
   - homepage / directory / search result / tool page 降级规则
5. 当前 QC 与放行规则：
   - `guanlan-monitor-quality-gate`
   - `guanlan-daily-monitor-qc`
   - `assert-guanlan-automation-readiness.mjs`
6. 当前相关文档地图：
   - 哪个文件是主规则；
   - 哪个文件是按需参考；
   - 哪个文件被脚本读取；
   - 是否存在重复、冲突、过时或职责不清。
7. 需要用户确认的问题清单：
   - 哪些来源应该更重；
   - 哪些来源应该只作发现入口；
   - 是否需要固定 S/A 来源覆盖底线；
   - Pool 是否需要比例或阈值；
   - AI HOT / follow-builders / 关键词搜索如何平衡；
   - 是否允许中文官网、工具官网、公司官网首页进入任何核心层。

阶段 1 结束时，必须暂停，等待用户确认。

### 阶段 2｜优化建议与执行

只有用户在新窗口明确确认后，才允许进入阶段 2。

阶段 2 可执行：

- 重写或精简每日监测相关规则文档；
- 调整 Pool routing；
- 调整 source registry / keyword monitoring / monitor quality gate 配置；
- 调整 `guanlan-daily-monitor` Skill；
- 调整自动化 prompt；
- 调整必要脚本中的硬门禁；
- 补充验证命令；
- 写 closeout。

阶段 2 不得执行：

- 不得推送 GitHub；
- 不得部署 Netlify；
- 不得生成今日观察；
- 不得更新前台网站内容；
- 不得把未确认规则直接接入生产自动化；
- 不得恢复已停止的 daily pipeline。

## 3. 必读文件

阶段 1 必读：

1. `AGENTS.md`
2. `context/05-daily-monitoring.md`
3. `skills/guanlan-daily-monitor/SKILL.md`
4. `skills/guanlan-monitor-quality-gate/SKILL.md`
5. `skills/guanlan-daily-monitor-qc/SKILL.md`
6. `agent-workflow/product/daily-monitoring-playbook.md`
7. `agent-workflow/product/source-intelligence.md`
8. `agent-workflow/product/evidence-and-routing-rules.md`
10. `01-SiteV2/content/README.md`
11. `01-SiteV2/content/11-databases/keyword-monitoring-v2.json`
12. `01-SiteV2/content/11-databases/source-registry-v2.json`
13. `01-SiteV2/content/11-databases/monitor-quality-gate-v2.json`
14. `agent-workflow/automation-prompts/guanlan-daily-monitor.md`
15. `agent-workflow/automation-prompts/asset-card-generator.md`
16. `agent-workflow/tools/assert-guanlan-automation-readiness.mjs`
17. `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
18. `agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs`
19. `agent-workflow/tools/guanlan-monitor-quality-gate.mjs`

如阶段 1 已能说明问题，不要继续扩大阅读范围。

## 4. 阶段 1 输出格式

```md
# 每日监测规则确认报告

## 1. 当前流程图

## 2. 相关文档地图

| 文件 | 当前职责 | 是否主规则 | 是否脚本读取 | 发现的问题 |
|---|---|---|---|---|

## 3. 来源结构与分级

## 4. Raw 生成规则

## 5. Pool 生成与分流规则

## 6. QC 与下游放行规则

## 7. 当前疑点 / 冲突 / 风险

## 8. 需要用户确认的问题
```

阶段 1 输出后必须停下，不得自动进入阶段 2。

## 5. 阶段 2 输出要求

阶段 2 完成后必须写 UTF-8 closeout：

```text
agent-workflow/reports/WSD-20260520-daily-monitor-rules-confirm-optimization-closeout.md
```

closeout 必须包括：

- 用户确认了哪些规则；
- 实际修改了哪些文件；
- 哪些规则被删除、合并或降级；
- Pool routing 如何变化；
- 自动化是否受影响；
- 是否改脚本；
- 运行了哪些验证；
- 是否仍有风险；
- 是否需要调度窗口验收。

完成后向调度窗口回报：

```text
收口：agent-workflow/reports/WSD-20260520-daily-monitor-rules-confirm-optimization-closeout.md
```

## 6. 验收闸门

阶段 2 若发生文件修改，至少运行：

```powershell
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor-with-qc.mjs
node --check agent-workflow/tools/guanlan-monitor-quality-gate.mjs
node --check agent-workflow/tools/assert-guanlan-automation-readiness.mjs
node -e "JSON.parse(require('fs').readFileSync('01-SiteV2/content/11-databases/keyword-monitoring-v2.json','utf8')); JSON.parse(require('fs').readFileSync('01-SiteV2/content/11-databases/source-registry-v2.json','utf8')); JSON.parse(require('fs').readFileSync('01-SiteV2/content/11-databases/monitor-quality-gate-v2.json','utf8')); console.log('json ok')"
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如果只完成阶段 1，不需要运行验证。
