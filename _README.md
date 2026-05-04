# 01-WaveSight — 观澜 AI 每日数据源

> 上游数据源：每日监测 → Signals → Priorities → Trends → Opportunities。

## 目录结构

| 子目录 | 用途 |
|---|---|
| `01-Signals/` | 每日 AI 商业雷达，沉淀当天新增 signals 与机会拆解 |
| `02-Scoring/` | 每日 AI 机会评分，对机会方向进行优先级判断 |
| `03-Trends/` | 趋势总表，持续记录赛道升温、降温与变化 |
| `提示词/` | 监测提示词、评分提示词、关键词列表 |
| `agent-workflow/` | 长任务协同、健康检查和运行记录 |

## 命名规则

- Signals：`YYYY-MM-DD-AI商业雷达.md`
- Scoring / Priorities：`YYYY-MM-DD-AI机会评分.md`
- Trends：`03-Trends/AI趋势总表.md`

## 同步规则

- 每日新增 Signals 和 Scoring 文件后，运行网站同步脚本即可更新网站数据。
- Opportunities 是长期机会库，位于 `07-Opportunities/`。
- 云端部署前应参考 `08-MOC/观澜AI云端部署目录与字段规范.md`，逐步补齐 ID、slug、标签和关系字段。
