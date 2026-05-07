---
task_id: WSD-20260507-05-v2-product-architecture-prd
board_id: V2-4
status: revised / ready-for-dispatch-review
date: 2026-05-07
owner: V2 Strategy & Product Architecture Agent / PM / Strategy / Data
primary_output: agent-workflow/v2/v2-product-architecture-prd.md
closeout_path: agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md
automation_impact: future-impact-only
encoding: UTF-8
revision_note: 根据用户反馈重写，The Point 降级为栏目模块，Trends 并入 Opportunities，删除旧机会地图和落地方案口径。
---

# WSD-20260507-05 V2 产品架构与 PRD Closeout

## 调度摘要

| 项目 | 结果 |
|---|---|
| 看板编号 | `V2-4` |
| Task ID | `WSD-20260507-05-v2-product-architecture-prd` |
| 状态 | revised / ready-for-dispatch-review |
| 主产物 | `agent-workflow/v2/v2-product-architecture-prd.md` |
| 本轮性质 | 对初稿的产品返工 |
| 是否修改 `04-Site` | 否 |
| 是否修改内容源 / 同步脚本 | 否 |
| 是否修改自动化 | 否 |
| Quality Gates | syntax 已运行，结果见第 11 节 |
| 回调度口令 | `收口：WSD-20260507-05-v2-product-architecture-prd` |

## 1. 返工说明

上一版 PRD 未充分吸收 V2 新定位和算法升级后的产品结构变化，仍局限在 V1 的频道框架内。根据用户反馈，本轮已重写主 PRD。

关键修正：

- `The Point` 不再作为独立频道。
- `Trends` 不再作为短期独立频道。
- `Opportunities` 前台改名为 `机会解码`，与趋势背景合并，升级为低频深度机会分析报告。
- 删除旧机会地图、落地方案等越界口径。
- 明确观澜AI只给判断、建议关注方向、证据解释和风险边界，不替客户做决定或落地执行。

## 2. 完成事项

已重写：

- `agent-workflow/v2/v2-product-architecture-prd.md`
- `agent-workflow/reports/WSD-20260507-05-v2-product-architecture-prd-closeout.md`

文档覆盖：

- V2 产品架构总览。
- PM 新增功能门禁记录。
- WAVE 评分。
- 模块决策表。
- 首页重构方案。
- 现有一级栏目去留评估。
- 栏目模块升级矩阵。
- 商业热力度与解析维度。
- 栏目页与详情页模块构成。
- 用户状态矩阵。
- 数据资产与页面模块映射。
- Dev 后续拆分建议。

## 3. PM 新增功能门禁结果

PM 新增功能门禁：通过，但结论从“六栏目全部保留升级”改为“频道收敛”。

修订决策：

- Home：保留并升级。
- Daily Brief：保留并升级，前台名为 `今日要点`。
- Signals：保留并升级，前台名为 `关键信号`。
- The Point：降级为观点校准模块，移出一级导航。
- Opportunities：保留并升级为低频深度机会分析报告，前台名为 `机会解码`。
- Trends：合并进机会解码和商业内参，移出一级导航。
- 商业内参：进入会员 / 增值产品层。
- 商业热力图：作为内参核心模块和后台判断资产，不做普通公开榜单。

## 4. WAVE 评分

| 模块 / 决策 | W | A | V | E | 总分 | 结论 |
|---|---:|---:|---:|---:|---:|---|
| V2 频道收敛总架构 | 3 | 3 | 2 | 2 | 10 | 通过 |
| The Point 独立频道 | 1 | 2 | 1 | 1 | 5 | 不通过，降级 |
| Trends 独立频道 | 1 | 2 | 1 | 1 | 5 | 不通过，合并 |
| 机会解码 + Trends 合并为机会分析 | 3 | 3 | 2 | 2 | 10 | 通过 |
| 商业内参 + 热力图 | 3 | 3 | 2 | 2 | 10 | 沿用 V2-4A，通过 |

## 5. 模块决策表

| 模块 | 决策 |
|---|---|
| Home | 保留并升级为品牌、今日要点、机会解码和内参预览入口 |
| 今日要点 | 保留并升级为每日判断入口 |
| 关键信号 | 保留并升级为每日 3 条深度 Signal 展示层 |
| The Point | 降级为今日要点 / 关键信号 / 机会解码 / 商业内参中的观点校准模块 |
| 机会解码 | 保留并升级为低频深度机会分析报告 |
| Trends | 合并为机会解码的趋势背景、商业内参热力输入和 Admin 趋势资产 |
| 商业内参 | 新增为 V2 增值产品层 |
| 商业热力图 | 强化为商业内参核心模块，不做普通公开一级栏目 |
| Admin / Priority Engine / 内容入库后台 | 保留并升级为 V2 生产和质量治理中枢 |
| Signal Lab / 测试页 | 保持内部验证环境，不进入普通导航 |

## 6. 首页重构结论

V2 首页承担组合入口：

- 品牌价值入口。
- 今日要点入口。
- 机会解码入口。
- 商业内参预览。

首页展示建议：

- 今日 3 条深度 Signal。
- 今日要点摘要。
- 最新 1-2 篇机会解码预览。
- 轻量观点校准摘录。
- 商业内参预览。

首页不展示：

- 独立 The Point 频道入口。
- 独立 Trends 频道入口。
- 公开榜单式热力图。
- Raw / Pool / Structured。
- 同步、字段、后台、JSON、编辑、恢复等内部痕迹。

## 7. 现有一级栏目去留评估摘要

| 栏目 | 建议 |
|---|---|
| Home | 保留并升级 |
| Daily Brief | 保留并升级，前台名为 `今日要点` |
| Signals | 保留并升级，前台名为 `关键信号` |
| The Point | 降级 / 合并，移出一级导航 |
| Opportunities | 保留、改名为 `机会解码`，并吸收 Trends |
| Trends | 合并 / 降级，移出一级导航 |

推荐 V2 普通前台导航：

```text
今日要点 / 关键信号 / 机会解码 / 商业内参
```

其中 `商业内参` 作为会员 / 增值入口，不是普通公开内容栏目。

## 8. 栏目模块升级矩阵摘要

V2 PRD 已覆盖：

- Home
- 今日要点
- 关键信号
- The Point / Point Calibration
- 机会解码
- Trends / Trend Context
- 商业内参
- 商业热力图
- Admin / Priority Engine / 内容入库后台

核心升级：

- The Point：从频道降级为“观点校准”模块，作为碎片化观点、争议、反证和一线反馈的引用资产。
- Trends：从独立页降级为趋势背景、内参热力输入和 Admin 长期资产，积累不足时不生成前台页面。
- 机会解码：从浅层卡片改为低频报告型机会分析，只在多源论证足够时发布。
- 机会解码报告不写落地方案，只给机会判断、证据解释、趋势背景、反证、迁移观察和建议关注变量。

新增补充：

- 已在主 PRD 第 9 节新增 `商业热力度与解析维度`。
- 商业热力度改为 6 维：影响坐标、变化方式、证据密度、变化速度、商业强度、争议与边界。
- 机会解析 6 维改为：具体问题、首要感受者、流程变化、价值来源、触发信号、成立边界。
- 已删除旧版“时点原因 / 中国市场迁移判断”这类容易泛化或过大的维度口径。
- 已同步定义关键信号、机会解码、趋势背景、商业内参各自使用哪些解析维度。
- 已在主 PRD 第 10 节新增 `栏目页与详情页模块构成`。
- 覆盖首页、今日要点栏目页、今日要点详情页、关键信号栏目页、关键信号详情页、机会解码栏目页、机会解码详情页、商业内参栏目页、商业内参详情页。
- 单独补充观点校准、趋势背景、商业热力图摘要、反证与边界四类嵌入模块规范。
- 明确每个模块的内容构成、数据来源和展示边界，作为后续 UI/UE、Copy、Data、Dev 的输入。

## 9. 商业内参 / 热力图产品位置结论

| 对象 | 结论 |
|---|---|
| 商业内参 | 进入 V2 增值产品层，会员为主 |
| 商业热力图 | 内参核心模块和后台判断资产 |
| 是否公开普通榜单 | 否 |
| 是否新增普通公开一级栏目 | 否 |
| 是否进入 Admin | 是，生成、评分、证据池和质量检查留在 Admin |
| 是否作为自动化生成资产 | 是，未来 AIBriefIssue / HeatCards 可作为自动化生成资产，但本轮不改自动化 |

## 10. 是否影响自动化

本轮未修改自动化任务，因此当前不直接影响：

- `ai-the-point`
- `ai-2`
- `ai-3`

未来落地会影响自动化，必须另行派发：

- `ai-2`：V2 漏斗、3 条 Front Signal、6 维拆解、二次来源、机会解码候选和 HeatEvidence 提取。
- `ai-the-point`：从独立频道生产转为观点校准素材输出，需调整提示词和入站口径。
- `ai-3`：HeatEvidence / AIBriefIssue 入站、同步闸门、关系检查、备份和回滚。

## 11. 是否修改 04-Site / 内容源 / 同步脚本

未修改：

- `04-Site/`
- 生产内容源 Markdown。
- `sync-data.mjs`
- `check-relations.mjs`
- `check-tags.mjs`
- `unified-site-sync.mjs`
- Netlify 配置。

本轮只修改 V2 PRD 和 closeout。

## 12. Quality Gates 运行结果

已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：

- passed，检查项 6，失败项 0。
- 最新报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-102133.md`

未运行：

- `sync-data.mjs`
- `check-relations.mjs`
- `check-tags.mjs`
- 浏览器截图 / SYS-7
- 自动化真实同步闸门

未运行原因：

- 本任务只修改产品规划文档。
- 未修改站点、内容源、同步脚本或自动化本体。

## 13. 后续建议任务

建议后续派发：

1. `V2-4B`：V2 导航与栏目收敛确认，明确移出 The Point / Trends 一级导航。
2. `V2-5A`：整理 accepted 文件，创建可信 V1 baseline tag、V2 branch 和可选 worktree。
3. `V2-6`：7 日算法验证，重点检验 3 条 Front Signal、Point 校准质量、Trend 资产积累和机会分析候选。
4. `V2-8A`：UI/UE Design Director 输出 Home / 今日要点 / 关键信号 / 机会解码 / 商业内参母版。
5. `V2-8B`：Data schema 定义 Point Calibration、Trend Context、Opportunity Report、HeatEvidence / AIBriefIssue 最小字段。
6. `V2-8C`：Copy / Editorial 输出机会分析报告模板和禁用语表，明确不写落地方案。
7. `V2-9`：V2 tokens / primitives / brand assets 工程底座。
8. `V2-10`：首页 V2 原型实现。
9. `V2-11`：今日要点 / 关键信号 / 机会解码页面升级。
10. `V2-12`：商业内参会员页和热力图模块 MVP。
11. `V2-13`：生产自动化和同步闸门升级。

## 14. 回调度窗口

```text
收口：WSD-20260507-05-v2-product-architecture-prd
```
