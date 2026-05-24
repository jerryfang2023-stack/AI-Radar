---
task_id: WSD-20260522-dispatch-window-handoff
date: 2026-05-22
status: handoff
owner: Product Commander
purpose: handoff to next dispatch window
---

# WSD-20260522 Dispatch Window Handoff

## 1. 下个窗口身份

你是观澜 AI V2.1 的 Product Commander / 调度中枢窗口。

职责：

- 分配任务。
- 生成派发单和新窗口指令。
- 接收 closeout。
- 按硬闸门验收。
- 回填 `dispatch-board` / `progress` / `feature_list`。

除非用户明确说“在当前窗口执行”，不要直接执行大型页面、设计或开发任务。

## 2. 启动读取

只读最小上下文：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `agent-workflow/execution/dispatch-board.md`
4. `agent-workflow/progress.md`
5. `agent-workflow/feature_list.json`

如用户继续当前页面治理任务，再读：

6. `agent-workflow/execution/WSD-20260522-site-page-module-governance-framework.md`
7. `agent-workflow/execution/WSD-20260522-site-page-module-layer1-diagnostic.md`

不要扫描全库 Markdown。不要读取 V1 / V2.0 历史文档、旧失败任务、旧自动化方案或已删除文档。

## 3. 当前总状态

- 当前版本：V2.1。
- 当前工作方向：V2-only 生产线。
- GitHub / Netlify：用户要求暂停推送和部署，未经明确允许不得执行。
- `guanlan-daily-monitor`：暂停定时，改为手动触发。
- `guanlan-daily-assets-chain`：暂停定时，改为手动触发，先过 readiness。
- `daily-observation-writer`：暂停自动写稿，不自动同步网站。
- 当前 Agent 体系：Product Commander / Intelligence Engine / Experience & Editorial / Build & Release。
- 当前优先原则：Agent 按流程节点设置，Skill 按能力模块沉淀。

## 4. 最近关键变化

### 4.1 每日观察 Skill 优化

`WSD-20260522-daily-observation-writing-skill-optimization` 已在原撰写窗口执行。

调度窗已将其状态改为：

```text
in_progress_external
```

不要重复派发。

等待原窗口 closeout。

### 4.2 搜索 provider

Anysearch 已接入每日监测搜索层。

Firecrawl key 后续已配置，并已重新跑通 provider benchmark。

相关文件：

- `agent-workflow/tools/run-guanlan-daily-monitor.mjs`
- `agent-workflow/tools/benchmark-search-providers.mjs`
- `agent-workflow/reports/WSD-20260522-anysearch-provider-quality-benchmark.md`
- `agent-workflow/reports/WSD-20260522-anysearch-daily-monitor-provider-closeout.md`

密钥只在本地忽略文件 `.env.local`，不要写入仓库文件、派发单或报告正文。

### 4.3 方向纠偏

用户明确指出：Source / Raw / Pool / Card 治理已经走过一遍，不需要重复走。

接下来不是每日监测治理，而是：

```text
网站模块与页面治理
首页 / 栏目页 / 详情页 / 模块体系
```

因此刚才误建的监测治理框架已删除，并改为页面治理框架。

## 5. 当前 ready 任务

当前应该派发的下一个任务是：

```text
WSD-20260522-site-page-module-layer1-diagnostic
```

派发单：

```text
agent-workflow/execution/WSD-20260522-site-page-module-layer1-diagnostic.md
```

框架文件：

```text
agent-workflow/execution/WSD-20260522-site-page-module-governance-framework.md
```

任务性质：

- 网站模块与页面治理阶段 1。
- 只诊断，不开发。
- 覆盖首页、今日观察、商业信号、趋势追踪、商业内参的栏目页和详情页。
- 覆盖导航、页头、页脚、卡片模块、内容字段展示。
- 不改代码、不生成页面、不部署、不推送。

## 6. 给新窗口的直接指令

用户如果问“下一个任务”或要求派发，给这段：

```text
执行：WSD-20260522-site-page-module-layer1-diagnostic
```

如果用户需要完整新窗口提示词，输出派发单中的“新窗口执行指令”部分即可。

## 7. 页面治理阶段安排

当前页面治理框架分为：

1. 阶段 1：页面 / 模块诊断。
2. 阶段 2A：页面结构、模块取舍、Copy-first、Typography、视觉规格表。
3. 阶段 2B：Build & Release 按规格落到代码和数据绑定。
4. 阶段 3：桌面端跑检，确认路由、页面、样式、数据链不坏。
5. 验收：Product Commander 按派发单 accepted / rejected。

当前只有阶段 1 是 ready，后续阶段 blocked。

## 8. 注意事项

- 当前网站开发先以桌面端为主，移动端暂不作为本阶段重点。
- 页面任务必须遵守 VI、Typography、Copy-first。
- 前台不得出现 Raw、Pool、Card、QC、gate、同步、入库、eligible、index_only 等内部生产语言。
- 不再回到 V1 / V2.0 旧页面逻辑。
- 不重复 Source / Raw / Pool / Card 治理。
- 不恢复自动化，除非用户明确要求。
- 不推送 GitHub / Netlify，除非用户明确恢复。

## 9. 当前看板文件

已同步更新：

- `agent-workflow/execution/dispatch-board.md`
- `agent-workflow/progress.md`
- `agent-workflow/feature_list.json`

`feature_list.json` 已通过 JSON 校验。

## 10. 522 观点卡评级收口同步

新增 closeout：

```text
agent-workflow/reports/WSD-20260522-opinion-rating-followbuilders-closeout.md
```

主窗口接续结论：

- 522 观点卡前台展示问题已闭环。
- 根因是资产生成后缺少固定后置链路：`govern-opinion-card-ratings.mjs -> cardcopy -> sync-v2-site-data.mjs`。
- 已将 follow-builders 调整为“知名人物池入口”加权，同时强化回复、寒暄、招募、纯链接、祝贺式转发等噪音剔除。
- 当前 522 结果：`feature=1`，`sidebar=11`，`archive=2`，`discard=15`；前台数据唯一展示项为 12 张。
- 后续 Card 资产链不得只生成或手改 `content/05-frontier-opinions/<date>-opinion-cards.md` 后结束；该文件只是评级索引，不是前台展示数量的唯一依据。
