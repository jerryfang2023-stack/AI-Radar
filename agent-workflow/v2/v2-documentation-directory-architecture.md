---
title: V2 Documentation Directory Architecture
date: 2026-05-07
task_id: WSD-20260507-16-v2-documentation-directory-optimization
board_id: V2-DOC
status: documentation-index
owner: Workflow Agent / PM Agent / Dev Agent
encoding: UTF-8
automation_impact: none
---

# V2 文档目录架构与索引方案

## 0. 结论

V2 文档整理先采用“入口 + 索引 + 只读标记”的方式处理历史任务证据；V2 新开发入口已按用户最新口径物理整理为 `01-SiteV2/`。

2026-05-07 用户新增目录口径：在 `01-WaveSight` 下使用 `10-Archive/` 作为归档目录，使用 `01-SiteV2/` 作为 V2 新站和内容生产线入口。

已落地的新增入口：

- `10-Archive/v1.0/v1.0-content-archive.md`
- `01-SiteV2/README.md`
- `01-SiteV2/site/README.md`
- `01-SiteV2/content/README.md`

本轮只完成三件事：

1. 明确 `docs/README.md` 是新窗口的文档入口。
2. 明确 `agent-workflow/v2/` 是 V2 当前生产规范层。
3. 明确历史内容、测试管线、外部 radar 和 reports 大目录先通过索引治理，不做物理迁移。

## 1. 输入依据

- `AGENTS.md`
- `docs/README.md`
- `docs/agent-handoff.md`
- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/v2/v2-directory-content-architecture.md`
- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

## 2. 当前文档目录盘点

| 路径 | 当前文件量 | 当前角色 | V2 处理 |
|---|---:|---|---|
| `docs/` | 2 | 新窗口入口与长期 handoff | 保留为入口层 |
| `10-Archive/v1.0/` | 2 | V1.0 内容合并归档 | read-only archive |
| `01-SiteV2/` | 1 | 后续 V2 新文件默认入口 | active V2 root |
| `agent-workflow/v2/` | 38 | V2 产品、算法、VI、目录、schema、rules、migration、quality gates | 作为 V2 生产规范层 |
| `agent-workflow/governance/` | 13 | 长期调度、质量门禁、Plan-first、自动化降级 | 保留为治理层 |
| `agent-workflow/execution/` | 91 | 派发单、任务说明、窗口提示词 | 保留为执行层 |
| `agent-workflow/reports/` | 634 | closeout、stage summary、quality gate、验收报告、截图索引 | 保留为收口层，不移动历史路径 |
| `agent-workflow/product/` | 20 | V1 / V2 可复用产品模型 | 标记为历史产品资产与可复用规则 |
| `agent-workflow/prd/` | 11 | V1 活跃 PRD 和历史 PRD | V2 新 PRD 优先进入 `agent-workflow/v2/` 或后续 `prd/v2/` |
| `01-SiteV2/content/` | 目录骨架 | V2 内容生产线内容库 | 保留为正式 V2 内容入口 |
| `01-Signals/` | 10 | V1 Signals / Daily 生产内容 | legacy read-only |
| `02-Scoring/` | 9 | V1 Scoring / Priority Engine 历史内容 | legacy read-only |
| `03-Trends/` | 1 | V1 Trend 总表 | legacy read-only |
| `05-point/` | 13 | V1 The Point 内容与来源 | legacy read-only |
| `07-Opportunities/` | 30 | V1 Opportunity 内容 | legacy read-only |
| `09-ai-news-radar/` | 2969 | 本地 radar / external candidate | 外部候选，不进入 V2 默认内容库 |
| `提示词/` | 5 | V1 / 测试提示词和关键词 | 历史提示词层，V2 生产提示词另派任务 |
| `测试期文档/` | 3 | 早期测试材料 | historical reference |

## 3. V2-only 目标结构

推荐逻辑结构如下。它是读取和新增文档的规则，不代表本轮移动文件。

```text
docs/
  README.md
  agent-handoff.md

agent-workflow/
  governance/
  execution/
  reports/
  v2/
    README.md
    v2-product-architecture-prd.md
    v2-algorithm-source-architecture.md
    v2-vi-design-direction.md
    v2-directory-content-architecture.md
    v2-documentation-directory-architecture.md
    schemas/
    rules/
    migration/
    quality-gates/

10-Archive/
  v1.0/
    README.md
    v1.0-content-archive.md

01-SiteV2/
  README.md
  docs/
  product/
  content/
  site/
  workflow/
  reports/
```

### 3.1 入口层

入口层只回答“新窗口该从哪里开始”。

| 文件 | 职责 |
|---|---|
| `AGENTS.md` | 项目级长期规则和新会话必读顺序 |
| `docs/README.md` | V2-only 文档入口和当前主线索引 |
| `docs/agent-handoff.md` | 最新接手状态和重要决策 |
| `agent-workflow/execution/dispatch-board.md` | 当前任务状态和下一步 |
| `01-SiteV2/README.md` | 后续 V2 新文件入口 |
| `10-Archive/v1.0/README.md` | V1.0 归档说明 |

### 3.2 V2 生产规范层

V2 生产规范集中在 `agent-workflow/v2/`。后续新增 V2 产品、数据、页面、文案、生产线和验证方案时，优先进入这一层。

| 类型 | 推荐路径 |
|---|---|
| 产品与栏目 | `agent-workflow/v2/v2-product-architecture-prd.md` |
| 算法与来源 | `agent-workflow/v2/v2-algorithm-source-architecture.md` |
| VI 与页面母题 | `agent-workflow/v2/v2-vi-design-direction.md` |
| 内容目录 | `agent-workflow/v2/v2-directory-content-architecture.md` |
| 文档目录 | `agent-workflow/v2/v2-documentation-directory-architecture.md` |
| Schema | `agent-workflow/v2/schemas/` |
| Rules | `agent-workflow/v2/rules/` |
| Migration | `agent-workflow/v2/migration/` |
| Quality gates | `agent-workflow/v2/quality-gates/` |

### 3.3 执行与报告层

`execution/` 和 `reports/` 不追求物理整洁优先，因为大量 handoff、progress 和 dispatch-board 已经引用这些路径。

| 目录 | 保留原因 | 读取方式 |
|---|---|---|
| `agent-workflow/execution/` | 派发单是任务边界证据 | 按 Task ID 读取 |
| `agent-workflow/reports/` | closeout 和质量报告是验收证据 | 按 Task ID / 日期 / quality-gate 读取 |

未来可以新增索引文件，例如：

```text
agent-workflow/reports/README.md
agent-workflow/reports/v2-report-index.md
agent-workflow/execution/README.md
```

但不建议批量移动历史报告。

## 4. 可移动 / 不移动 / 只建索引 / 归档候选

### 4.1 本轮可新增或更新

| 路径 | 动作 |
|---|---|
| `docs/README.md` | 更新 V2 主线索引、文件层级和安全整理原则 |
| `agent-workflow/v2/v2-documentation-directory-architecture.md` | 新增文档目录架构方案 |
| `agent-workflow/reports/WSD-20260507-16-v2-documentation-directory-optimization-closeout.md` | 新增 closeout |
| `10-Archive/v1.0/v1.0-content-archive.md` | V1.0 内容合并归档 |
| `01-SiteV2/README.md` | V2.0 新根目录说明 |

### 4.2 暂不移动

| 路径 | 原因 |
|---|---|
| `agent-workflow/reports/` | 历史 closeout、截图、quality gate 报告已被多处引用 |
| `agent-workflow/execution/` | 派发单路径是任务边界，不应改名 |
| `10-Archive/v1.0/source-dirs/` | V1 legacy read-only，保留历史来源目录 |
| `10-Archive/v1.0/site/04-Site/` | V1 旧网站工程，只读历史参考 |
| `09-ai-news-radar/` | 外部本地 radar 候选，需用户确认和 Source Registry 审核 |
| `agent-workflow/v2/` | 已被 handoff、progress、dispatch-board、reports 引用，后续只做映射或复制，不直接改历史路径 |

### 4.3 只建索引

| 路径 | 建议索引 |
|---|---|
| `agent-workflow/reports/` | 后续新增 reports README，按 accepted / failed / test-only / quality-gate 分组 |
| `agent-workflow/execution/` | 后续新增 execution README，说明派发单、window prompt 和计划文件 |
| `agent-workflow/product/` | 后续标记历史产品规范和仍被 V2 继承的规则 |
| `提示词/` | 后续标记 V1 提示词、V2 候选提示词、废弃提示词 |
| `测试期文档/` | 后续标记 historical reference |

### 4.4 归档候选

这些只是在未来任务中可审查的候选，不代表本轮归档。

| 候选 | 条件 |
|---|---|
| V1 failed / void / stopped 页面任务报告 | 先建索引，保留 closeout 事实，不移动 |
| 大量截图目录 | 先确认是否仍被 closeout 引用，再决定是否压缩或转移 |
| `09-ai-news-radar/` | 需用户确认是否保留为本地工具、外部来源库，或排除 Git |
| `测试期文档/` | 只在确认无任务引用后可转入 historical index |

## 5. README / Index 入口设计

### 5.1 `docs/README.md`

定位：新窗口入口。

必须包含：

- 当前 V2-only 口径。
- 必读文件。
- V2 当前主线。
- 目录分工。
- 历史目录说明。
- 当前优先任务。

### 5.2 `agent-workflow/v2/README.md`

定位：V2 规范入口。

建议后续补充：

- V2 accepted 文档列表。
- Draft / planning / historical 文件标记。
- schemas / rules / migration / quality-gates 子目录说明。

### 5.3 `agent-workflow/reports/README.md`

定位：报告读取索引。

建议后续新增：

- `accepted closeout`
- `review / blocked`
- `failed / void / stopped`
- `test-only`
- `quality-gate`
- `screenshots`

### 5.4 `agent-workflow/execution/README.md`

定位：派发单索引。

建议后续新增：

- 当前 ready / running / review 任务。
- 已 accepted 任务。
- abandoned / superseded 任务。
- Task ID 命名规则。

## 6. 后续如需移动文件的安全方案

任何物理迁移必须另派任务，并满足以下条件：

1. 先生成移动清单：源路径、目标路径、引用文件、风险等级。
2. 用全文搜索确认引用：`dispatch-board.md`、`progress.md`、`docs/agent-handoff.md`、`feature_list.json`、closeout。
3. 先备份或确认 Git baseline。
4. 只移动低风险文件，不移动已被 closeout 和 handoff 反复引用的任务证据。
5. 移动后更新索引和引用。
6. 运行 syntax Quality Gate。
7. 写 closeout，说明回滚路径。

禁止：

- 为了目录美观移动历史 closeout。
- 批量重命名 Task ID 文件。
- 移动 `04-Site/`、内容源或自动化路径。
- 将 failed / stopped / abandoned 结果改写成 accepted 历史。

## 8. V1.0 归档与 V2.0 新根目录规则

### 8.1 V1.0 归档

V1.0 内容已合并到：

```text
10-Archive/v1.0/v1.0-content-archive.md
```

合并范围：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`

归档文件保留每个来源文件的原路径分隔，便于后续追溯。

### 8.2 V2.0 新目录

后续 V2 新文件默认进入：

```text
01-SiteV2/
```

建议结构：

```text
01-SiteV2/
  docs/
  product/
  content/
  site/
  workflow/
  reports/
```

### 8.3 过渡规则

- 已存在的 `agent-workflow/v2/` 暂不移动，因为它已经被派发单、handoff、progress 和 closeout 引用。
- 后续新增 V2 文件优先进入 `01-SiteV2/`。
- 如果需要把 `agent-workflow/v2/` 中已验收文件复制或迁移到 `01-SiteV2/`，必须单独派发迁移任务，先做引用检查。

## 7. 本轮自动化影响

本轮是文档索引和架构任务。

- 不修改 V1 旧站工程。
- 不修改内容同步脚本。
- 不修改自动化配置。
- 本轮仅按用户确认做入口整理，不改历史任务证据。
- 不改变 V2 生产线切换任务范围。

旧自动化已停止；本轮不按 V1 影响口径判断。
