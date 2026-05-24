---
task_id: WSD-20260522-tag-taxonomy-chain-governance
title: Raw / Pool / Card 标签体系链路治理 Closeout
date: 2026-05-22
status: passed-with-backfill-observation
owner: Intelligence Engine / Build & Release / Product Commander
encoding: UTF-8
---

# WSD-20260522 Tag Taxonomy Chain Governance Closeout

## 1. 结论

本次治理完成。

- 正式标签真源仍为 `agent-workflow/product/tag-taxonomy.md`。
- 未新增正式 tag。
- 未新增一级导航。
- 未推送、未部署。
- `site-content.json` 当前前台 tags unknown 数量为 0。
- 生成侧脚本 hardcoded unknown tags 数量为 0。
- Markdown `formal_tags` unknown tags 数量为 0。
- `candidate_tags` 未被前台当成正式 tags；当前检查结果为 0 个未知 candidate tag。

允许后续 Raw / Pool / Card 链路继续，但必须使用本次新增的 tag gate。

## 2. 必须回答的问题

| 问题 | 结论 |
|---|---|
| Raw 阶段是否应该生成正式 tags？ | 不应该。Raw 是证据底座，只保存 `theme`、`theme_label`、`keyword_group`、`importance_type`、`source_type`、`source_level`、`routing_lane`、`tag_hints`、`needs_tag_review` 等线索字段。 |
| Pool 阶段是否应该生成正式 tags？ | 不应该。Pool 是 Raw 后的候选索引，可保留 `tag_hints`、`pool_routes`、`importance_type`、`source_level` 和补证字段，但不能把 hint 当成正式 `formal_tags`。 |
| Card / Candidate 阶段正式 `formal_tags` 的生成规则是什么？ | `signal_card`、`opinion_card`、`change_candidate`、`scene_candidate`、`trend_candidate`、`trend_report`、`brief_issue` 必须使用 `tag-taxonomy.md` 已登记的 `tag_id`；生成脚本只能写入已知 tag，未知项进入报告或 `needs_tag_review`。 |
| `candidate_tags` 与 `formal_tags` 如何区分？ | `candidate_tags` 是模型或人工观察词，不参与前台筛选和关系网络；`formal_tags` 是正式结构化字段，只能使用 taxonomy 登记 ID。 |
| `site-content.json` 的 `tagTaxonomy` 如何维护？ | 已从硬编码改为由 `agent-workflow/product/tag-taxonomy.md` 派生，避免同步脚本与真源漂移。 |
| 当前脚本中哪些 tag id 不在正式 taxonomy？ | 治理前有 `stage-proven`、`track-ai-startup`、`track-vertical-ai`、`evidence-market-signal`、`source-original-or-registry`、`source-media`、`source-research` 等；治理后 tag gate 显示脚本 hardcoded unknown tags 为 0。 |
| 哪些不一致可以直接映射，哪些必须用户确认？ | 明确同义或边界清楚的已直接映射；当前没有必须新增正式 tag 的候选。 |
| 如何阻止未来生成侧继续写入未登记 tag？ | 新增 `agent-workflow/tools/check-tags.mjs`，并接入 `run-quality-gates.mjs tags` 与 `v2content` 模式；未知正式 tag 会阻塞。 |

## 3. 链路标签职责表

| 层级 | 是否允许正式 tags | 允许字段 | 禁止字段 | 质量门 |
|---|---|---|---|---|
| Raw | 否 | `theme` / `theme_label` / `keyword_group` / `importance_type` / `source_type` / `source_level` / `tag_hints` / `needs_tag_review` | 未归一的 `formal_tags` | Raw evidence gate + tag gate 观察 |
| Pool | 否 | `pool_routes` / `importance_type` / `tag_hints` / `usable_for` / `missing_information` | 把 hint 当正式 tag | Daily Monitor QC + tag gate 观察 |
| Card | 是 | `formal_tags` | 未登记 tag / 人物名 tag / 公司名 tag | `check-tags.mjs` 阻塞 |
| Candidate | 是 | `formal_tags` + 可选 `candidate_tags` | `candidate_tags` 进入前台正式 tags | `check-tags.mjs` 阻塞 unknown formal tags |
| Report / Brief | 是 | `formal_tags` | 未登记 tag / 一次性热词 | `check-tags.mjs` 阻塞 |
| Site Sync | 是 | 派生 `tagTaxonomy` / 前台 item `tags` | 硬编码漂移 taxonomy | `check-tags.mjs` 校验 taxonomy missing / unknown |

## 4. 当前 tag 来源审计表

| 文件 / 脚本 | 产生 tags 的位置 | tag 类型 | 是否使用正式 taxonomy | 问题 | 处理 |
|---|---|---|---|---|---|
| `agent-workflow/tools/run-guanlan-daily-monitor.mjs` | theme/source tag hints helper | Raw / Pool hint | 是 | 旧代码中有未登记 tag id | 改为正式 ID 或移出正式 tag 语义，函数改名为 `tagHintsForItem` |
| `agent-workflow/tools/generate-asset-cards-from-pool.mjs` | Card / Candidate frontmatter | `formal_tags` | 是 | 新生成资产缺 formal_tags | 新增正式标签生成与 YAML 输出 |
| `agent-workflow/tools/regenerate-v2-assets-from-existing-raw.mjs` | legacy regeneration | `formal_tags` | 是 | legacy 脚本仍会生成正式 tag | 保持 legacy，不作为默认入口；纳入 tag gate 扫描 |
| `01-SiteV2/site/scripts/sync-v2-site-data.mjs` | `tagTaxonomy` / inferred frontend tags | 前台 tags | 是 | 内置 taxonomy 有漂移风险 | 改为从 `tag-taxonomy.md` 派生 |
| `01-SiteV2/knowledge/10-Templates/*.md` | 模板 frontmatter | `formal_tags` | 是 | trend report 模板仍写 `tags:` | 改为完整 `formal_tags` 结构 |
| `01-SiteV2/content/10-publication-index/2026-05-19--publication-index--daily-observation.md` | publication index frontmatter | `formal_tags` | 是 | 3 个未登记旧 tag | 直接映射到正式 tag |
| `01-SiteV2/site/data/site-content.json` | 站点数据 | 前台 tags | 是 | 需验证 unknown=0 | 已重新同步并通过 tag gate |

## 5. 非正式 tag 迁移表

| 当前 tag | 出现位置 | 建议处理 | 归并到 | 是否需用户确认 |
|---|---|---|---|---|
| `stage-proven` | monitor hint | 语义为成熟商业信号 | `stage-mature` | 否 |
| `track-ai-startup` | monitor hint | Raw/Pool 不应造创业正式标签；只保留融资/升温 hints | `evidence-funding` + `stage-rising` | 否 |
| `track-vertical-ai` | monitor hint | 垂直 AI 过宽，不作为正式 tag | 移出正式 hint，必要时后续按具体 track 补 | 否 |
| `evidence-market-signal` | monitor hint | 市场信号过宽，不作为正式证据 tag | 移出正式 hint | 否 |
| `source-original-or-registry` | monitor source hint | 一手 / registry 来源 | `source-first-party` | 否 |
| `source-media` / `source-research` | monitor source hint | 媒体 / 研究来源 | `source-business-media` | 否 |
| `function-security` | publication index | 安全/治理职能归入法务合规与治理 track | `function-legal-compliance` | 否 |
| `scenario-software-delivery` | publication index | 软件交付场景未登记，当前内容更接近文档/工程流程 | `scenario-document-workflow` | 否 |
| `source-official` | publication index | 官方来源 | `source-first-party` | 否 |

当前无新增正式标签候选需要用户确认。

## 6. 内容类型最低标签要求表

| 内容类型 | 必填 group | 建议 group | 不允许 |
|---|---|---|---|
| `signal_card` | `track` / `evidence` | `function` / `scenario` / `source` | 人物名、公司名、泛 AI 词 |
| `opinion_card` | `opinion` / `track` / `source` | `scenario` / `function` | 用观点 tag 替代四档评级 |
| `change_candidate` | `track` / `stage` / `evidence` | `source` / `scenario` | 单条弱事实强行趋势化 |
| `scene_candidate` | `track` / `function` / `scenario` | `customer` / `evidence` | 行业名替代具体流程 |
| `trend_candidate` / `trend_report` | `track` / `stage` | `evidence` / `scenario` / `source` | 热词、公司名、一次性事件词 |
| `brief_issue` | 与引用资产一致，至少覆盖主 `track` | `stage` / `evidence` / `source` | 用标签替代内参判断 |

## 7. Gate / 脚本补强表

| 检查项 | 应放在哪个脚本 | 阻塞级别 | 失败信息 |
|---|---|---|---|
| taxonomy 解析失败 / 重复 tag_id | `check-tags.mjs` | P0 | `duplicate taxonomy id` 或读取失败 |
| 脚本 hardcoded unknown tag | `check-tags.mjs` | P0 | `script unknown tag` |
| Markdown `formal_tags` unknown tag | `check-tags.mjs` | P0 | `formal_tags unknown tag` |
| `site-content.json` item tags unknown | `check-tags.mjs` | P0 | `site-content unknown tag` |
| `site-content.json` tagTaxonomy 与真源漂移 | `check-tags.mjs` | P0 | `site tagTaxonomy unknown/missing` |
| `candidate_tags` unknown | `check-tags.mjs` | P2 观察 | `candidate_tags 观察项` |
| 正式资产缺 `formal_tags` | `check-tags.mjs` | P2 观察 | `缺 formal_tags 的正式资产` |

## 8. 本次改动

新增：

- `agent-workflow/tools/tag-taxonomy-utils.mjs`
- `agent-workflow/tools/check-tags.mjs`
- `agent-workflow/reports/tag-quality-gate-latest.md`
- `agent-workflow/reports/quality-gates-tags-2026-05-22-20260522-130314.md`

修改：

- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `agent-workflow/tools/generate-asset-cards-from-pool.mjs`
- `agent-workflow/tools/run-quality-gates.mjs`
- `01-SiteV2/site/scripts/sync-v2-site-data.mjs`
- `01-SiteV2/knowledge/10-Templates/trend-report-flash-template.md`
- `01-SiteV2/knowledge/10-Templates/trend-report-full-template.md`
- `01-SiteV2/content/10-publication-index/2026-05-19--publication-index--daily-observation.md`
- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

删除：

- 未删除文件。

正式 taxonomy：

- 未修改 `agent-workflow/product/tag-taxonomy.md`。

## 9. 验证

已运行：

```powershell
node --check agent-workflow/tools/tag-taxonomy-utils.mjs
node --check agent-workflow/tools/check-tags.mjs
node --check agent-workflow/tools/run-guanlan-daily-monitor.mjs
node --check agent-workflow/tools/generate-asset-cards-from-pool.mjs
node --check agent-workflow/tools/regenerate-v2-assets-from-existing-raw.mjs
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check agent-workflow/tools/v2-content-gate.mjs
node --check agent-workflow/tools/card-copy-style-gate.mjs
node --check agent-workflow/tools/run-quality-gates.mjs
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-22
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs tags
```

验证结果：

- `check-tags.mjs`：passed。
- `run-quality-gates.mjs tags`：passed。
- `run-quality-gates.mjs syntax`：passed。
- `site-content.json` 当前前台 tags unknown 数量：0。
- 生成侧脚本 hardcoded unknown tags 数量：0。
- `candidate_tags` unknown 数量：0。
- 缺 `formal_tags` 的旧正式资产：152，当前作为非阻塞 backfill observation；后续可开独立补齐任务。

## 10. 下游放行

允许后续 Raw / Pool / Card 链路继续。

下游限制：

- Raw / Pool 继续只产出 tag hints，不产出未经 normalization 的正式 `formal_tags`。
- Card / Candidate / Report / Brief 必须写正式 `formal_tags`。
- Site Sync 必须继续从 `tag-taxonomy.md` 派生 `tagTaxonomy`。
- 后续提交前必须至少运行 `node agent-workflow/tools/run-quality-gates.mjs tags`。
- 152 个旧资产缺 `formal_tags` 不阻断当前链路，但不应被视为已完成历史资产回填。
