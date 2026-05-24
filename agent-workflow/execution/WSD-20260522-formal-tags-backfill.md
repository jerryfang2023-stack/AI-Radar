---
task_id: WSD-20260522-formal-tags-backfill
title: 152 个旧正式资产 formal_tags 补标
date: 2026-05-22
status: ready
owner: Intelligence Engine / Build & Release
encoding: UTF-8
---

# WSD-20260522 Formal Tags Backfill｜152 个旧正式资产 formal_tags 补标

## 1. 任务目标

本任务修补 `WSD-20260522-tag-taxonomy-chain-governance` 收口后留下的 152 个旧正式资产缺 `formal_tags` 问题。

目标：

- 为 tag gate 报告中列出的旧正式资产补齐 `formal_tags`。
- 所有补入的 tag 必须来自 `agent-workflow/product/tag-taxonomy.md`。
- 不新增正式 tag。
- 不把 `candidate_tags` 当成正式 `formal_tags`。
- 不改正文事实、不改评级、不改前台展示字段、不部署、不推送。

完成标准：

```text
node agent-workflow/tools/check-tags.mjs
```

必须显示：

- 脚本 hardcoded unknown tags：0
- Markdown formal_tags unknown tags：0
- site-content tags unknown 数：0
- site tagTaxonomy unknown / missing：0 / 0
- candidate_tags 中未登记 tag：0
- 缺 formal_tags 的正式资产：0

## 2. 必须读取

1. `AGENTS.md`
2. `context/01-product-map.md`
3. `context/06-execution-harness.md`
4. `agent-workflow/product/tag-taxonomy.md`
5. `agent-workflow/reports/WSD-20260522-tag-taxonomy-chain-governance-closeout.md`
6. `agent-workflow/reports/tag-quality-gate-latest.md`
7. 本派发单

## 3. 允许读取 / 修改范围

允许读取：

- `agent-workflow/tools/check-tags.mjs`
- `agent-workflow/tools/tag-taxonomy-utils.mjs`
- `01-SiteV2/content/06-asset-candidates/scene/*.md`
- `01-SiteV2/content/06-asset-candidates/trend/*.md`
- `01-SiteV2/knowledge/01-Signal-Cards/**/*.md`
- `01-SiteV2/knowledge/02-Opinion-Cards/**/*.md`

允许修改：

- tag gate 报告列出的缺 `formal_tags` 旧正式资产文件。
- 仅限补齐或修正 frontmatter / 元信息区中的 `formal_tags`。

不允许修改：

- `agent-workflow/product/tag-taxonomy.md`，除非先列出新增候选并等待用户确认。
- Raw / Pool 文件。
- 正文事实、标题、观点评级、门禁状态、前台字段、source URL。
- `site-content.json` / `site-content.js`，除非补标后确需重新同步，并在 closeout 中说明。
- 自动化、部署、GitHub、Netlify 配置。

## 4. 补标规则

### 4.1 标签真源

所有 `formal_tags` 必须使用 `agent-workflow/product/tag-taxonomy.md` 中登记的 `tag_id`。

### 4.2 按资产类型补最低标签

| 资产类型 | 必填 group | 建议 group | 说明 |
|---|---|---|---|
| `signal_card` | `track` / `evidence` | `function` / `scenario` / `source` | 根据信号类型、来源、动作和使用场景判断 |
| `opinion_card` | `opinion` / `track` / `source` | `scenario` / `function` | 不用人物名作 tag；观点评级字段保持不变 |
| `scene_candidate` | `track` / `function` / `scenario` | `customer` / `evidence` | 聚焦行业、岗位、流程或任务场景 |
| `trend_candidate` | `track` / `stage` | `evidence` / `scenario` / `source` | 候选一般使用 `stage-watch` 或 `stage-rising` |

### 4.3 不确定项处理

如果无法确定：

- 不编造 tag。
- 优先使用更保守的正式 tag。
- 在 closeout 中列入“需人工复核资产表”。
- 但 tag gate 中“缺 formal_tags 的正式资产”必须降为 0；不能留空。

### 4.4 禁止项

不得使用：

- 人物名 tag。
- 公司名 tag。
- `AI`、`创业`、`科技` 等泛标签。
- taxonomy 未登记 tag。
- 已被治理为非正式的 tag：`track-ai-startup`、`track-vertical-ai`、`stage-proven`、`evidence-market-signal`、`source-original-or-registry`、`source-media`、`source-research`。

## 5. 建议执行方式

1. 先运行：

```powershell
node agent-workflow/tools/check-tags.mjs
```

拿到 152 个缺 `formal_tags` 文件清单。

2. 按文件类型分批补标：

- `scene_candidate`
- `trend_candidate`
- `signal_card`
- `opinion_card`

3. 每批补完后运行：

```powershell
node agent-workflow/tools/check-tags.mjs
```

4. 最后运行完整验证。

## 6. 验证要求

至少运行：

```powershell
node --check agent-workflow/tools/check-tags.mjs
node --check agent-workflow/tools/tag-taxonomy-utils.mjs
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs tags
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如果执行窗口修改了站点同步数据，再运行：

```powershell
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs --date=2026-05-22
node agent-workflow/tools/check-tags.mjs
```

## 7. Closeout 输出

完成后写入：

```text
agent-workflow/reports/WSD-20260522-formal-tags-backfill-closeout.md
```

closeout 必须包含：

1. 实际读取清单。
2. 修改文件数量。
3. 按类型统计：`signal_card` / `opinion_card` / `scene_candidate` / `trend_candidate`。
4. 是否新增正式 tag：必须为否；如不是否，必须说明用户确认来源。
5. 是否修改正文事实 / 评级 / 前台字段：必须为否。
6. `check-tags.mjs` 前后指标对比。
7. 需人工复核资产表。
8. 运行的验证命令和结果。
9. 是否允许后续 Raw / Pool / Card 链路继续。

## 8. 新窗口执行指令

```text
请执行任务：WSD-20260522-formal-tags-backfill

你是 Intelligence Engine + Build & Release 协作执行窗口。本任务只修补 tag gate 报告中 152 个旧正式资产缺 formal_tags 的问题。

要求：
1. 以 agent-workflow/product/tag-taxonomy.md 为唯一正式标签真源。
2. 只补 formal_tags，不改正文事实、不改评级、不改前台字段。
3. 不新增正式 tag，除非先列候选并等待用户确认。
4. 不推送、不部署。
5. 完成后 check-tags 中“缺 formal_tags 的正式资产”必须为 0。

完成后写 closeout：
agent-workflow/reports/WSD-20260522-formal-tags-backfill-closeout.md
```
