# 观澜AI｜WaveSight 文档入口

状态：V2-only 生产开发模式  
更新时间：2026-05-07

## 当前口径

V1.0 网站不再更新，旧自动化任务已停止。后续文档、任务和开发默认服务 V2.0 正式生产线。

V1.0 内容和旧站工程已归档到：

- `10-Archive/v1.0/v1.0-content-archive.md`
- `10-Archive/v1.0/site/04-Site/`

V2.0 后续新文件默认进入：

- `01-SiteV2/`

## 必读文件

| 用途 | 文件 |
|---|---|
| 新窗口接手 | `AGENTS.md` |
| 最新交接 | `docs/agent-handoff.md` |
| 任务看板 | `agent-workflow/execution/dispatch-board.md` |
| 工作进度 | `agent-workflow/progress.md` |
| 功能账本 | `agent-workflow/feature_list.json` |
| 文档目录架构 | `agent-workflow/v2/v2-documentation-directory-architecture.md` |
| V2 产品架构 | `agent-workflow/v2/v2-product-architecture-prd.md` |
| V2 算法与来源 | `agent-workflow/v2/v2-algorithm-source-architecture.md` |
| V2 VI 方向 | `agent-workflow/v2/v2-vi-design-direction.md` |
| V2 目录架构 | `agent-workflow/v2/v2-directory-content-architecture.md` |

## V2 当前主线

| 主线 | 当前文件 | 状态 |
|---|---|---|
| 产品架构 | `agent-workflow/v2/v2-product-architecture-prd.md` | accepted / architecture |
| 算法与来源 | `agent-workflow/v2/v2-algorithm-source-architecture.md` | accepted / architecture |
| VI 与设计方向 | `agent-workflow/v2/v2-vi-design-direction.md` | accepted |
| 内容目录 | `agent-workflow/v2/v2-directory-content-architecture.md` | accepted / architecture |
| V2 内容库 | `01-SiteV2/content/README.md` | active content library |
| V2 Obsidian 知识库 | `01-SiteV2/knowledge/README.md` | active knowledge layer |
| 文档目录 | `agent-workflow/v2/v2-documentation-directory-architecture.md` | documentation index |
| V1 内容归档 | `10-Archive/v1.0/v1.0-content-archive.md` | read-only archive |
| V2 新根目录 | `01-SiteV2/README.md` | active-v2-root |
| V2 生产线切换 | `agent-workflow/v2/v2-production-pipeline-cutover.md` | active-production-path |
| V2 内容闸门 | `agent-workflow/tools/v2-content-gate.mjs` | executable gate |

## 目录分工

| 目录 | V2 用途 |
|---|---|
| `docs/` | 接手入口、项目级索引、长期交接 |
| `agent-workflow/v2/` | V2 产品、算法、VI、目录、生产线和迁移规范 |
| `agent-workflow/execution/` | 派发单、执行任务、窗口提示词 |
| `agent-workflow/reports/` | closeout、验收报告、quality gate 报告 |
| `agent-workflow/governance/` | 调度、质量门禁、长期规则 |
| `agent-workflow/product/` | 历史产品规范和可复用资产 |
| `01-SiteV2/content/` | V2 内容生产线内容库 |
| `01-SiteV2/knowledge/` | Obsidian 长期知识库层，沉淀观点库 / 案例库 / 信号库 |
| `01-SiteV2/site/` | V2 新网站工程入口 |
| `10-Archive/v1.0/site/04-Site/` | V1 旧网站工程，只读历史参考 |
| `10-Archive/v1.0/` | V1.0 内容合并归档，只读 |
| `01-SiteV2/` | 后续 V2.0 新文件默认入口 |

## 文件层级判断

| 层级 | 读取场景 | 规则 |
|---|---|---|
| 入口层 | 新窗口、接手、恢复上下文 | 先读 `AGENTS.md`、本文件和 `docs/agent-handoff.md` |
| V2 规范层 | 规划、页面、数据、生产线改造 | 以 `agent-workflow/v2/` 为准 |
| 治理层 | 调度、质量门禁、自动化降级 | 以 `agent-workflow/governance/` 为准 |
| 执行层 | 领取任务或核对范围 | 以 `agent-workflow/execution/` 为准 |
| 收口层 | 验收、回溯、质量报告 | 以 `agent-workflow/reports/` 为准 |
| 历史层 | 追溯 V1 内容或旧决策 | 只读，不作为 V2 默认生产入口 |

## 历史目录

以下目录保留为历史资产或待迁移来源，不再作为 V1 日更生产入口：

- `01-Signals/`
- `02-Scoring/`
- `03-Trends/`
- `05-point/`
- `07-Opportunities/`
- `提示词/`
- `测试期文档/`
- `09-ai-news-radar/`

## 安全整理原则

- 先建索引，再做迁移。
- 不移动或删除已被派发单、closeout、handoff 引用的文件。
- `agent-workflow/reports/` 可通过索引分层读取，不用为了整洁而改历史路径。
- `09-ai-news-radar/` 暂按 external / local radar candidate 处理，不直接并入 V2 正式内容库。
- 后续新增 V2 文件优先放入 `01-SiteV2/`。
- V2 网站不再基于旧根目录 `04-Site/` 直接改造，新站工程从 `01-SiteV2/site/` 开始。
- 已存在且被调度、交接、质量闸门引用的路径暂不整体搬迁。
- 后续若要移动文件，必须另派 Dev / Workflow 任务，先给路径映射、引用检查、备份和回滚方案。

## 当前优先任务

1. `V2-13AUTO` 已完成：V2 生产路径、文档索引、legacy inventory、migration map 和 V2 内容闸门。
2. `V2-8AUTO` 已完成：V2 页面母版、数据 schema、Copy 规范连贯包。
3. 后续按批重写历史 V1 判断资产，不能原样搬入 V2。
4. 后续页面 Dev 从 `01-SiteV2/site/` 开始，不恢复旧 `04-Site`。
