# <TASK-ID> Closeout

日期：YYYY-MM-DD  
owner：`<agent-id>`  
状态：review / accepted / blocked  
编码：UTF-8

## 0. 调度摘要

```yaml
task_id: <TASK-ID>
board_id: <BOARD-ID>
status: review
recommended_status: accepted / blocked / evidence-required / not-accepted
dispatch_path: agent-workflow/execution/<TASK-ID>.md
closeout_path: agent-workflow/reports/<TASK-ID>-closeout.md
changed_files:
  - path/to/file
gates:
  syntax: pass / fail / not-run
  browser_desktop: pass / fail / not-run / n/a
  browser_mobile: pass / fail / not-run / n/a
  design_director: pass / fail / not-run / n/a
  pm_gate: pass / fail / not-run / n/a
automation_impact:
  ai-the-point: none / changed / risk
  ai-2: none / changed / risk
  ai-3: none / changed / risk
blockers:
  - none
next_action: 调度中枢验收并回填 / 退回补证据 / 重新派发
```

调度摘要必须出现在正文前 40 行内。它只用于快速验收索引，不能替代后文硬闸门证据。

## 1. 对应派发单

- 派发单：`agent-workflow/execution/<TASK-ID>.md`
- 任务目标：

## 2. 本轮完成

- 完成事项 1。
- 完成事项 2。
- 完成事项 3。

## 3. 修改文件

- `path/to/file`：改动说明。

## 4. 验证结果

已运行：

- `command`：结果。

未运行：

- `check name`：未运行原因，风险，建议后续由哪个 Agent 补做。

## 4A. 页面 / 文案类任务验收

如本任务涉及页面体验或可见文案改动，本节必须填写；如不适用，写“不适用，原因：...”。

### 4A.1 UI/UE 页面规范表

- 页面类型：
- 页面目标：
- 设计基准：
- 布局基准：
- 字体层级：
- 间距基准：
- 组件克制规则：
- 前台 / Admin 边界：
- 桌面端验收点：
- 移动端验收点：
- 禁止项：

### 4A.1A Design Director 证据化风格美观质检表

页面类任务必须填写。页面已实现或已有可访问页面时，必须提供桌面截图、移动端截图、逐项扣分原因、必须重做清单和 Dev 实现偏差清单。

页面类型通过线：

- 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产：低于 `85` 必须重做。
- 一级栏目页 / 详情页 / 会员页：低于 `80` 必须重做。
- Admin 工作台和后台模块：低于 `75` 必须重做。
- 任一单项低于 `14`、Squint Test 不通过或存在审美阻塞项时，必须重做，状态不得写 accepted。

| 质检项 | 得分 | 说明 |
|---|---:|---|
| Style Purity / 风格一致性与纯净度 |  |
| Proportion & Rhythm / 比例与韵律感 |  |
| Color Sophistication / 色彩深度与平衡 |  |
| Craftsmanship / 细节的艺术处理 |  |
| Emotional Resonance / 情感共鸣 |  |
| Squint Test / 眯眼测试 | 通过 / 不通过 |
| 总分 |  |
| 结论 | 通过 / 重做 |
| 必须重做的问题 |  |
| 可延后优化的问题 |  |

证据字段：

- 设计基准引用：
- 桌面端截图：
- 移动端截图：
- 逐项扣分原因：
- Dev 实现偏差清单：
- QA 复核建议：

### 4A.2 Dev 按表实现情况

- 已实现：
- 未实现：
- 偏离规范：
- 是否自行新增或改写 Copy 未提供的关键文案：
- 若有表外文案，新增内容、原因和 Copy 复核证据：
- 影响范围：

### 4A.3 Copy 文案规范表

本节必须按 `agent-workflow/governance/copy-first-page-gate.md` 填写。没有可直接落地的 Copy 表，页面 / 文案任务不得 recommended accepted。

| 页面/模块 | 用户任务 | 最终文案 | 字数/行数约束 | 证据边界 | 禁用语检查 | Dev 实现说明 |
|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |

Copy-first 自查：

- 是否 100% 按 Copy 表实现：
- 是否新增 Copy 表外可见文案：
- 禁用语扫描结果：
- 文案自然度自查：是否像真人写的、是否有商业判断、是否能让老板信任：

### 4A.4 QA 独立验收

- 桌面端截图：
- 移动端截图：
- 对比页面或模块：
- 标题位置 / 字号 / 行高 / 模块起点：
- 首屏主次：
- 字体层级：
- 间距一致性：
- 无横向溢出：
- 普通前台无后台痕迹：
- 禁用语检查：
- 判断边界检查：
- 标题长度与容器适配：
- 阻塞项：

## 5. 自动化影响

- `ai-the-point`：
- `ai-2`：
- `ai-3`：

如影响自动化，说明已更新哪些提示词、执行文档或检查口径。

## 6. 风险与遗留

- 风险：
- 软提醒：
- 需要用户确认：

## 7. 建议调度中枢更新

- `dispatch-board.md`：
- `feature_list.json`：
- `progress.md`：
- `docs/agent-handoff.md`：

## 8. 下一步

建议下一个任务：
