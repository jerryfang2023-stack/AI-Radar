---
task_id: WSD-20260522-formal-tags-backfill
title: 旧正式资产 formal_tags 回填 Closeout
date: 2026-05-22
status: passed
owner: Intelligence Engine / Build & Release
encoding: UTF-8
---

# WSD-20260522 Formal Tags Backfill Closeout

## 1. 结论

本次回填完成。

- 152 个被 tag gate 计入缺 `formal_tags` 的正式资产 / 模板已补齐 `formal_tags` 字段。
- 未新增正式 tag。
- 未修改 `agent-workflow/product/tag-taxonomy.md`。
- 未修改正文事实、观点评级、前台展示字段、source URL、Raw / Pool 文件。
- 未同步 `site-content.json` / `site-content.js`。
- 未推送、未部署。
- `check-tags.mjs` 最新结果：passed，缺 `formal_tags` 的正式资产为 0。

允许后续 Raw / Pool / Card 链路继续。

## 2. 实际读取清单

固定读取：

- `AGENTS.md`
- `context/01-product-map.md`
- `context/06-execution-harness.md`
- `agent-workflow/product/tag-taxonomy.md`
- `agent-workflow/reports/WSD-20260522-tag-taxonomy-chain-governance-closeout.md`
- `agent-workflow/reports/tag-quality-gate-latest.md`
- `agent-workflow/execution/WSD-20260522-formal-tags-backfill.md`

执行与抽样读取：

- `agent-workflow/tools/check-tags.mjs`
- `agent-workflow/tools/tag-taxonomy-utils.mjs`
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`
- `01-SiteV2/content/06-asset-candidates/scene/*.md`
- `01-SiteV2/content/06-asset-candidates/trend/*.md`
- `01-SiteV2/knowledge/01-Signal-Cards/**/*.md`
- `01-SiteV2/knowledge/02-Opinion-Cards/**/*.md`
- `01-SiteV2/knowledge/03-Asset-Candidates/scene/*.md`
- `01-SiteV2/knowledge/03-Asset-Candidates/trend/*.md`
- `01-SiteV2/knowledge/10-Templates/{signal-card-template,change-candidate-template,trend-candidate-template}.md`

补充说明：初始 tag gate 总数为 152；派发单列出的四类目录中有 144 个缺口，另有 8 个被同一 gate 计入缺口，分别在 `knowledge/03-Asset-Candidates` 镜像候选资产和 3 个模板中。为满足“缺 formal_tags 的正式资产：0”，本次一并补齐，并在本 closeout 中显式说明。

## 3. 修改范围

补标文件数：152。

按类型统计：

| type | count |
|---|---:|
| `opinion_card` | 118 |
| `signal_card` | 22 |
| `scene_candidate` | 6 |
| `trend_candidate` | 5 |
| `change_candidate` | 1 |

模板处理：

- `signal-card-template.md`
- `change-candidate-template.md`
- `trend-candidate-template.md`

模板只补 `formal_tags` 空结构，保持与既有趋势报告 / 观点卡模板一致，不写默认具体 tag。

## 4. 标签规则执行

- 所有补入 tag 均来自 `agent-workflow/product/tag-taxonomy.md` 已登记 `tag_id`。
- 未把 `candidate_tags` 当成正式 `formal_tags`。
- 未使用人物名、公司名、泛 `AI` / `创业` / `科技` 类标签。
- 前沿观点卡保留 `scenario-frontier-opinion`、`evidence-frontier-opinion`、`source-social`、观点主题和核心赛道；未用标签替代 `opinion_tier` / `display_lane` / `publish_status`。
- 商业信号卡按 `signal_type` 补 `evidence-*`，并按 `source_level` 补来源类型。

## 5. 前后指标对比

| 指标 | 回填前 | 回填后 |
|---|---:|---:|
| 脚本 hardcoded unknown tags | 0 | 0 |
| Markdown formal_tags unknown tags | 0 | 0 |
| site-content tags unknown 数 | 0 | 0 |
| site tagTaxonomy unknown / missing | 0 / 0 | 0 / 0 |
| candidate_tags 中未登记 tag | 0 | 0 |
| 缺 formal_tags 的正式资产 | 152 | 0 |

## 6. 人工复核资产表

无阻塞复核项。

保守提示：本次为批量回填，标签只服务筛选和关系网络；后续如做人工编辑精选，可优先抽样复核 `opinion_card` 中被归到 `opinion-agent-workflow` 的低信息短帖。

## 7. 验证

已运行：

```powershell
node --check agent-workflow/tools/check-tags.mjs
node --check agent-workflow/tools/tag-taxonomy-utils.mjs
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs tags
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：

- `node --check agent-workflow/tools/check-tags.mjs`：passed。
- `node --check agent-workflow/tools/tag-taxonomy-utils.mjs`：passed。
- `node agent-workflow/tools/check-tags.mjs`：passed；缺 `formal_tags` 的正式资产为 0。
- `node agent-workflow/tools/run-quality-gates.mjs tags`：passed，报告写入 `agent-workflow/reports/quality-gates-tags-2026-05-22-20260522-132323.md`。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed，报告写入 `agent-workflow/reports/quality-gates-syntax-2026-05-22-20260522-132323.md`。

注意：统一质量门报告中若干子项显示 `child_process spawn blocked (EPERM) in this environment`，但本任务直接要求的两个 tag 脚本语法检查已单独运行并通过。

## 8. 下游放行

允许后续 Raw / Pool / Card 链路继续。

限制仍然有效：

- Raw / Pool 继续只产出 tag hints，不产出未经 normalization 的正式 `formal_tags`。
- Card / Candidate / Report / Brief 必须写正式 `formal_tags`。
- Site Sync 必须继续从 `tag-taxonomy.md` 派生 `tagTaxonomy`。
- 后续提交前必须至少运行 `node agent-workflow/tools/run-quality-gates.mjs tags`。
