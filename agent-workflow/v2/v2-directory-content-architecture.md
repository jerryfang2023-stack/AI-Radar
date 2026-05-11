---
title: V2 Directory and Content Architecture
date: 2026-05-07
task_id: WSD-20260507-09-v2-directory-content-architecture
status: proposal
owner: V2 Directory / Content Architecture Agent
encoding: UTF-8
automation_impact: planning-only; website update stopped and automation tasks should not run unless explicitly restarted
---

# V2 文件目录与内容资产架构方案

## 0. 结论

V1 网站内容从 2026-05-07 起进入冻结口径：不再作为日更入口，不再承接 V2 新内容。由于网站不再更新，`ai-the-point`、`ai-2`、`ai-3` 也不应继续运行。现有 `01-Signals/`、`02-Scoring/`、`03-Trends/`、`05-point/`、`07-Opportunities/` 和 `04-Site/config/content-paths.json` 继续作为 `legacy / read-only / compatibility` 层保留，仅用于历史读取、回滚、审计和未来如需重启 V2 生产链路时的迁移参考。

V2 正式内容库建议新增在：

```text
06-content/v2/
```

原则是先新增 V2 路径，不替换 V1 路径；先建立 schema、source registry、HeatEvidence、AIBriefIssue 和 migration 规则，不移动旧内容。自动化任务当前按停止处理，不再设计“继续并行运行”的兼容期；未来只有在用户明确要求重启网站更新或启动 V2 生产链路时，才单独设计新的入站、同步和闸门任务。

本方案只新增文档，不移动文件、不删除文件、不重命名目录、不修改 `04-Site/config/content-paths.json`、不修改 `sync-data.mjs`、不修改 `unified-site-sync.mjs`、不修改长期自动化任务。

## 1. 输入与产品架构吸收

本方案已读取并吸收：

- `AGENTS.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/execution/WSD-20260507-09-v2-directory-content-architecture.md`
- `agent-workflow/v2/v2-transition-charter.md`
- `agent-workflow/v2/v2-workspace-strategy.md`
- `agent-workflow/v2/v2-dev-workspace-baseline.md`
- `agent-workflow/v2/v2-algorithm-source-architecture.md`
- `agent-workflow/v2/v2-ai-brief-heatmap-premium-product-plan.md`
- `agent-workflow/v2/v2-vi-design-direction.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/reports/WSD-20260507-08-v1-accepted-baseline-tag-branch-closeout.md`
- `04-Site/config/content-paths.json`
- `04-Site/README.md`

V2-4 PRD 文件已存在，状态为 `draft-for-dispatch-review`；看板仍显示 V2-4 为 `ready`，尚未验收为 accepted。本方案吸收其已有结论，但将其视为“产品架构草案约束”，后续若 V2-4 正式收口并调整栏目或会员入口，V2-6 后续执行任务必须重新对齐。

已吸收的 V2-4 关键结论：

- V2 不建议新增普通公开一级栏目。
- 首页从 V1 内容索引升级为“判断价值 + 今日 3 条 Signal + 热力变化 + AI商业内参预览”。
- `AI商业内参` 属于会员 / 增值产品层。
- `AI商业热力图` 是内参核心模块和后台判断资产，不做公开榜单。
- Raw / Pool / Structured / HeatEvidence / 评分 / 同步状态不进入普通前台。
- V2 数据主链路为 `Raw -> Pool -> Structured -> Front Signal -> Deep Dive -> Trend -> HeatEvidence -> HeatCard / HeatmapTriple -> AIBriefIssue -> AI商业内参`。

## 2. V1 内容冻结规则

### 2.1 冻结口径

- V1 网站内容不再日更。
- 因网站不再更新，`ai-the-point`、`ai-2`、`ai-3` 默认停止运行，不再继续生成 Markdown 或触发网站同步。
- V1 生产内容目录默认转为 `legacy / read-only / compatibility` 层。
- 不得继续把新 V2 内容写入 V1 生产目录，除非用户明确启动 V2 生产迁移，并另有入站、同步脚本、QA 和回滚方案。
- V1 历史内容可供 V2 训练、回溯、迁移、关系校验、legacy index 和质量对照参考。
- V1 历史内容不作为 V2 新内容入站默认位置。
- P0-11、P0-2A、P0-2B、P1-4B 等未验收、failed、stopped 或 abandoned 成果不得作为 V2 目录迁移依据。

### 2.2 兼容保留范围

以下路径进入只读兼容层，保留给当前同步脚本、关系检查、网站数据回滚和 V1 历史访问：

```text
01-Signals/
02-Scoring/
03-Trends/
05-point/
07-Opportunities/
04-Site/data/
04-Site/config/content-paths.json
```

只读含义：

- 不作为 V2 日常新增内容入口。
- 不在本任务移动、重命名或删除。
- 未来若必须补历史修复，应由 Workflow / Data / Dev 单独派发；不得因此恢复 `ai-the-point`、`ai-2`、`ai-3`，除非用户明确要求重启自动化。

### 2.3 V1 与 V2 的边界

| 类型 | V1 兼容层 | V2 正式层 |
|---|---|---|
| 日更入口 | 停止新增 | `06-content/v2/` |
| 网站同步 | 当前仍由 `content-paths.json` 指向 V1 | 停止日更同步；仅未来重启时由 V2-6D 评估切换或双读 |
| 关系检查 | 当前检查 V1 数据结构 | 停止作为日更闸门；仅未来重启时扩展 HeatEvidence / AIBriefIssue |
| 内容用途 | 历史、回滚、迁移映射 | 正式升级后的新内容资产 |
| 前台展示 | V1 静态站兼容 | V2 页面和会员层后续开发 |

## 3. V2 推荐目录树

建议先新增以下目录，不替换现有 `06-content/` 的 P0-12 test-only 结构。当前 `06-content/` 下已有测试管线目录，应作为 `legacy-test / v2-pilot` 记录，不等同正式 V2 内容库。

```text
06-content/
  README.md
  v2/
    README.md
    00-raw/
      YYYY-MM-DD/
        raw-candidates.md
        originals/
    01-pool/
      YYYY-MM-DD-pool.md
    02-structured/
      YYYY-MM-DD-structured-signals.md
    03-front-signals/
      YYYY-MM-DD-front-signals.md
    04-deep-dives/
      YYYY-MM-DD-deep-dive.md
    05-trends/
      trend-updates/
      trend-candidates/
      legacy-map/
    06-heat-evidence/
      YYYY-Www-heat-evidence.md
    07-heat-cards/
      industry/
      job/
      workflow/
      triple/
    08-ai-brief/
      weekly/
      monthly/
      drafts/
      published/
    09-opportunity-maps/
      YYYY-MM/
    10-counter-evidence/
      commercial/
      technical/
      regulatory/
      transfer/
      point-calibration/
    11-source-registry/
      source-registry.md
      source-levels.md
      source-watchlist.md
      blocked-sources.md
    12-legacy-index/
      v1-signals-index.md
      v1-priority-index.md
      v1-trends-index.md
      v1-point-index.md
      v1-opportunities-index.md
```

### 3.1 目录职责

| V2 目录 | 职责 | 前台可见性 |
|---|---|---|
| `00-raw/` | 原始候选、本地原文档案、来源记录 | 不可见 |
| `01-pool/` | 20-30 条候选池、入池 / 淘汰理由 | 不可见 |
| `02-structured/` | 8-15 条结构化 Signal、商业变量、来源等级、证据边界和趋势候选 | Admin / Data |
| `03-front-signals/` | 每日 3-5 条可进入前台的深度 Signal | 公开 / 登录 / 会员分层 |
| `04-deep-dives/` | 1-2 条内参级深挖，证据不足可明确缺席 | 会员 / Opportunity 素材 |
| `05-trends/` | Trend update、候选趋势、V1 趋势映射 | 公开摘要 / 会员展开 |
| `06-heat-evidence/` | 四栏目进入热力图前的统一证据对象 | 会员证据展开摘要 / Admin 完整 |
| `07-heat-cards/` | Industry / Job / Workflow / Triple 热力卡 | 会员内参核心 |
| `08-ai-brief/` | weekly / monthly AIBriefIssue | 会员 / 增值产品 |
| `09-opportunity-maps/` | 可验证机会地图、验证动作和迁移卡点 | 公开摘要 / 会员完整 |
| `10-counter-evidence/` | 商业化、技术、监管、迁移、观点反证 | Admin / 会员摘要 |
| `11-source-registry/` | 来源等级、来源类型、观察名单、禁用来源 | Admin / Data |
| `12-legacy-index/` | V1 历史内容索引与 V2 映射 | Admin / Migration |

### 3.2 agent-workflow/v2 新增治理目录

建议新增：

```text
agent-workflow/v2/
  schemas/
    raw-candidate.schema.md
    structured-signal.schema.md
    heat-evidence.schema.md
    heat-card.schema.md
    ai-brief-issue.schema.md
    source-registry.schema.md
  rules/
    v2-ingestion-rules.md
    v2-source-level-rules.md
    v2-counter-evidence-rules.md
    v2-tag-mapping-rules.md
    v2-frontstage-backstage-boundary.md
  migration/
    v1-readonly-compatibility-plan.md
    v1-to-v2-legacy-index-plan.md
    content-paths-switch-plan.md
    automation-cutover-plan.md
    rollback-plan.md
  quality-gates/
    v2-content-quality-gate.md
    heat-evidence-quality-gate.md
    ai-brief-quality-gate.md
    automation-cutover-quality-gate.md
```

这些目录承接规则与 schema，不承接日常内容。日常内容放在 `06-content/v2/`，避免把工作流治理文件和内容资产混在一起。

### 3.3 04-Site / V2 前端目录策略

短期不建议在主工作树直接新增大量 V2 页面代码。根据 V2-5，优先等 `v1.0-baseline-20260507`、`codex/v2-planning` 和可选 worktree 成立后再进入页面和脚本开发。

若仍沿用静态站路线，建议在 V2 分支 / worktree 中新增：

```text
04-Site/
  v2/
    README.md
    brief.html
    heatmap.html
    signal-detail.html
  css/
    v2-tokens.css
    v2-primitives.css
    v2-layouts.css
  js/
    v2-brief.js
    v2-heatmap.js
  scripts/
    v2/
      heatmap-evidence.mjs
      heatmap-scoring.mjs
      heatmap-aggregate.mjs
      ai-brief-issue.mjs
  data/
    v2/
      heatmap-data.json
      ai-brief-issues.json
```

正式落地前必须由 V2-5A 或后续 Dev baseline 任务确认分支 / worktree，避免未验收 V2 页面污染 V1 主线。

## 4. 当前目录处置矩阵

| 当前目录 / 文件 | 当前用途 | V2 处置建议 | 是否移动 | 自动化状态 / 影响 | 风险 | 后续任务 |
|---|---|---|---|---|---|---|
| `01-Signals/` | V1 Signals / Daily Brief 生产内容源 | 冻结为 legacy read-only；仅供回滚、V1 展示、V2 legacy index 和迁移映射 | 本轮不移动 | `ai-2` 应停止；未来如重启需另行设计入站 | 新 V2 内容继续写入会污染 V1 / V2 边界 | V2-6C / V2-6D / V2-6E |
| `02-Scoring/` | V1 评分与 Priority Engine 内容源 | 冻结为 legacy read-only；Priority Engine 历史可映射到 V2 判断资产 | 本轮不移动 | 不再新增；脚本依赖仅作历史兼容 | 继续新增会让 V2 HeatEvidence 与 V1 评分并行混乱 | V2-6E / V2-13 |
| `03-Trends/` | V1 趋势总表，当前 `AI趋势总表.md` 是同步源 | 冻结为 legacy read-only；V2 新趋势只在未来重启时进入 `06-content/v2/05-trends/` | 本轮不移动 | 自动化停止；配置依赖只作历史兼容 | 单文件总表难承接 V2 热力和反证 | V2-6B / V2-6D / V2-6E |
| `04-Site/` | V1 静态站、同步脚本、关系检查、数据输出、Admin 原型 | 保留为 V1 compatibility site；V2 页面和脚本应在分支 / worktree 中新增隔离路径 | 本轮不移动 | `ai-3` 应停止；同步脚本不再定时运行 | 直接改会影响 Netlify preview 和 V1 回滚 | V2-5A / V2-9 / V2-10 / V2-13 |
| `05-point/` | V1 The Point 内容和来源 | 冻结为 legacy read-only；未来如重启，Point 可转为 HeatEvidence 校准层 | 本轮不移动 | `ai-the-point` 应停止；配置中写为 `05-Point` 存在大小写风险 | Windows 可容忍大小写，部署或脚本迁移时可能出错 | V2-6B / V2-6D / V2-6E |
| `06-content/` | P0-12 test-only 日常监测 v2 管线 | 保留为 test-only / pilot 记录；新增正式 `06-content/v2/`，不直接复用旧测试目录为正式结构 | 本轮不移动 | 当前不影响生产；不得被自动化继续消费 | 测试管线被误认为正式生产入口 | V2-6A / V2-6B |
| `07-Opportunities/` | V1 Opportunity 生产内容源 | 冻结为 legacy read-only；V2 新机会地图进入 `06-content/v2/09-opportunity-maps/` | 本轮不移动 | 是，`sync-data.mjs` 依赖 | Opportunity 标题和字段规则与 V2 深挖 / 热力映射不完全一致 | V2-6E / V2-11 |
| `08-AI news/` | 外部 AI 新闻素材 / 参考内容 | 标记为 external / source archive candidate；是否纳入 V2 Source Registry 需 Data Agent 复核 | 本轮不移动 | 暂不确定，当前不在 `content-paths.json` | 来源版权、质量等级和入库边界不清 | V2-6B / Source Registry 审核 |
| `09-ai-news-radar/` | 本地外部雷达目录 / private-external candidate | 不进入 V2 默认内容库；需用户确认是否保留、归档或排除 Git | 本轮不移动 | 不影响，自动化停止 | 外部目录混入正式 baseline 或来源库 | V2-5A 用户确认 / V2-6B |
| `agent-workflow/v2/` | V2 规划、PRD、VI、算法、迁移方案 | 保留为 V2 治理与规则中心；新增 schemas / rules / migration / quality-gates | 本轮不移动 | 仅作为未来重启参考，不触发自动化 | 规则与内容混放会降低可维护性 | V2-6B |
| `提示词/` | V1 和测试管线提示词、关键词、自动化文档候选 | 冻结 V1 提示词；V2 提示词只在用户明确重启生产自动化时再创建或升级 | 本轮不移动 | 自动化停止；不得继续调用旧提示词日更 | 旧提示词继续被当作 V2 入站规则 | V2-6C / 自动化重启任务 |
| `测试期文档/` | 早期测试文档 | 归为 historical / reference；不作为 V2 目录迁移依据 | 本轮不移动 | 否 | 历史实验结论被误用 | 后续归档审计 |
| `04-Site/config/content-paths.json` | 当前生产同步路径配置 | 本轮不得修改；继续作为 V1 历史兼容配置；后续只有重启 V2 生产时才评估双读或切换 | 本轮不移动不修改 | 自动化停止；配置仅作历史兼容 | 路径切换会影响 `sync-data.mjs`、`ai-3`、Netlify 数据 | V2-6D / V2-13 |

## 5. 自动化停止与未来重启影响表

用户已明确：网站不再更新，因此自动化任务也不再运行。下表不表示这些任务仍会继续执行，只记录它们作为历史自动化的依赖关系，以及未来如果用户明确要求重启 V2 生产链路时需要处理的影响。

| 对象 | 历史依赖 | 当前口径 | 未来如重启的迁移影响 | 责任 |
|---|---|---|---|---|
| `ai-the-point` | 写入 The Point Markdown，依赖 `05-point/` 体系 | 停止运行 | 若 Point 进入 HeatEvidence 校准层，需重新设计观点立场、反证、Point Cluster / Fragment、来源授权和 heat calibration 字段 | V2 Point / Builder Insight Agent + Workflow Agent |
| `ai-2` | 每日 AI 商业雷达，写入 `01-Signals/` 和 `02-Scoring/` | 停止运行 | 若重启，应新建 V2 漏斗：Raw / Pool / Structured / Front Signal / HeatEvidence / Opportunity Map；不得恢复写入 V1 生产目录 | V2-6C |
| `ai-3` | 统一网站同步闸门，读取 V1 同步结果并检查 Priority / Judgment Node | 停止运行 | 若重启，应识别 V2 数据、HeatEvidence、AIBriefIssue、source registry、关系断链、备份和回滚 | V2-6D / V2-13 |
| `04-Site/scripts/sync-data.mjs` | 读取 `content-paths.json` 指向 V1 内容源 | 不再定时运行，只作手工历史兼容 | 若重启网站更新，需要支持 V2 内容库、legacy index、HeatEvidence / AIBriefIssue 输出 | V2-6D |
| `04-Site/scripts/check-relations.mjs` | 检查 V1 Signal / Priority / Trend / Opportunity / Point 关系 | 不再作为日更闸门运行 | 若重启，需新增 HeatEvidence 反向追溯、AIBriefIssue 证据覆盖、Point 非事实加权约束 | V2-6D |
| `04-Site/scripts/check-tags.mjs` | 检查现有 Tags 质量 | 不再作为日更闸门运行 | 若重启，需区分 formalTags、candidateTags、industry / job / workflow seed tags | V2-6B / V2-6D |
| `agent-workflow/tools/unified-site-sync.mjs` | `ai-3` 统一闸门与备份恢复 | 停止运行 | 若重启，需重建 V2 闸门、备份和回滚，不沿用日更假设 | V2-6D / V2-13 |
| `04-Site/config/content-paths.json` | 当前路径：`01-Signals`、`02-Scoring`、`03-Trends/AI趋势总表.md`、`05-Point`、`07-Opportunities` | 保留为 V1 历史兼容配置 | 若重启，才评估新增 `v2ContentDir`、`v2HeatEvidenceDir`、`v2BriefDir` 或双源配置 | V2-6D |

### 5.1 停止期策略

V1 路径继续保留只读：

```text
01-Signals/
02-Scoring/
03-Trends/
05-point/
07-Opportunities/
04-Site/data/radar-data.*
```

V2 路径先新增不替换：

```text
06-content/v2/
agent-workflow/v2/schemas/
agent-workflow/v2/rules/
agent-workflow/v2/migration/
agent-workflow/v2/quality-gates/
04-Site/data/v2/       # 后续 Dev 任务中创建
04-Site/scripts/v2/    # 后续 Dev 任务中创建
```

任务分工：

- 重启或重建自动化入站：`V2-6C`，牵头 Workflow / Data / Dev，前提是用户明确要求恢复网站更新。
- 重启或重建网站同步：`V2-6D`，牵头 Dev / Data / QA / Workflow，前提是用户明确要求恢复网站更新。
- QA 与回滚：`V2 Verification Agent` + QA / Acceptance Agent，在 `V2-6D` 和 `V2-13` 中执行。
- V1 历史映射：`V2-6E`，牵头 Data / Workflow。

## 6. 分阶段迁移建议

### V2-6A：创建 V2 内容目录骨架和 README

目标：

- 创建 `06-content/v2/` 及 README。
- 创建空目录或占位 README，不移动旧内容。
- 标注 `06-content/` 旧 P0-12 结构为 `test-only / pilot`。

禁止：

- 不改 `content-paths.json`。
- 不改自动化。
- 不把 P0-12 测试内容转为生产内容。

验收：

- 目录存在。
- README 说明 V1 frozen、V2 入站和禁止直接同步。
- syntax Quality Gate 通过。

### V2-6B：定义 V2 schemas / source registry / HeatEvidence 文件规范

目标：

- 新增 `agent-workflow/v2/schemas/`、`rules/`、`quality-gates/`。
- 定义 Raw、Structured Signal、HeatEvidence、HeatCard、AIBriefIssue、Source Registry 最小字段。
- 定义 formalTags / candidateTags / seed tags 映射规则。

验收：

- V2-2 / V2-4A / V2-4 草案字段被吸收。
- Point 只能作为校准层，不作为事实主证据。
- Opportunity 标题不得写公司名的规则保留。

### V2-6C：如需重启，重建 ai-2 到 V2 内容库的入站

目标：

- 仅在用户明确要求恢复网站更新时执行。
- 将新的内容入站设计为 `06-content/v2/`，不恢复写入 V1 生产路径。
- 保留 V1 只读兼容。
- 保持每日 3 条 Front Signal、6 维机会拆解、二次来源、反证、HeatEvidence 抽取。

策略：

- 可先 V2-only draft，不进入前台。
- 不建议双写 V1；如为迁移验证临时生成兼容副本，必须明确标为迁移副本，不能恢复 V1 日更。

验收：

- 当日 V2 内容能反向追溯来源。
- 每条 Front Signal 至少 3 个 S/A/B 来源。
- 不污染 `01-Signals/` 作为 V2 新入口。

### V2-6D：如需重启，重建 ai-3 / sync-data / relation checks 支持 V2 数据

目标：

- 仅在用户明确要求恢复网站更新时执行。
- 在 V2 分支 / worktree 中重建同步脚本、关系检查、tag 检查和统一闸门。
- 支持 V1 fallback 与 V2 数据输出并行。
- 输出到 `04-Site/data/v2/`，通过后再进入页面。

验收：

- V1 同步仍可运行。
- V2 HeatEvidence 反向 sourceId 不断链。
- AIBriefIssue 的 evidenceSummary 能找到对应 Signal / Point / Opportunity / Trend。
- 失败可恢复同步前备份。

### V2-6E：迁移或映射 V1 历史内容到 V2 legacy index

目标：

- 不移动 V1 原文件。
- 为 V1 Signals、Priority Rows、Trends、Point、Opportunities 建立 legacy index。
- 给可复用资产补稳定 ID、slug、日期、sourceType、related IDs 和映射状态。

验收：

- V1 原路径未改变。
- legacy index 可支持 V2 训练、回溯、关系校验和页面引用。
- failed / abandoned / stopped 成果不会被标为 accepted source。

## 7. 风险、回滚与验收要求

| 风险 | 控制 |
|---|---|
| V1 frozen 内容继续被日更写入 | 自动化已停止；V2-6C 如重启必须明确新入口，禁止恢复 V1 日更 |
| `content-paths.json` 过早切换导致同步失败 | V2-6D 单独开发双读 / fallback，并有备份恢复 |
| 旧 P0-12 test-only 内容被误认为正式 V2 | `06-content/v2/` 与旧测试目录分离 |
| `05-point` / `05-Point` 大小写差异在部署环境出错 | 后续 Dev 任务在配置切换时统一核查，不在本轮修改 |
| 外部 `09-ai-news-radar/` 混入正式来源库 | Source Registry 任务先做来源审计和用户确认 |
| V2 schema 过重，拖慢内容生产 | P0 只定义最小字段，monthly 完整内参后置 |
| 热力图变成公开榜单或后台仪表盘 | 按 V2-4A / V2 VI：内参核心模块，不做普通公开栏目 |
| 回滚点不可信 | 先完成 V2-5A baseline，再做真实迁移 |

实际迁移的回滚要求：

- 每次修改 `content-paths.json`、同步脚本、统一闸门或自动化提示词前，必须先确认用户已要求重启网站更新，并记录原文件、备份路径和恢复命令。
- V2 数据输出失败不得覆盖上一版 V1 有效数据。
- V2 branch / worktree 中验证通过后，才能合并到主线。
- QA 必须覆盖普通用户、登录用户、会员 / 到期用户、管理员四类状态；本方案任务不做页面，因此该检查后置。

## 8. 本轮自动化影响声明

本轮只输出架构方案，不修改生产路径、同步脚本、自动化本体或 Netlify 配置。按用户最新口径，网站不再更新，自动化任务也不再运行。

- `ai-the-point`：本轮未修改；按停止处理。
- `ai-2`：本轮未修改；按停止处理。未来只有用户明确重启时，V2-6C 才会影响。
- `ai-3`：本轮未修改；按停止处理。未来只有用户明确重启时，V2-6D / V2-13 才会影响。
- `04-Site/config/content-paths.json`：本轮未修改。
- `sync-data.mjs` / `unified-site-sync.mjs`：本轮未修改。
