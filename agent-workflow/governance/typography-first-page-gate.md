---
title: Typography First Page Gate
date: 2026-05-19
status: active
owner: experience-editorial / build-release / product-commander
encoding: UTF-8
---

# Typography-first 页面字体硬闸门

## 1. 定位

本闸门把页面位置字体规范前置到页面生成之前。只要任务涉及新页面、新模块、栏目页、详情页、首页区域、导航、页脚或页面重构，执行窗口必须先确定字体层级表，再进入 Build & Release。

`$guanlan-typography-qc` 不是事后补救工具。它必须在设计 / 实现前用于核对页面字体表，在实现后用于复核偏差。

## 2. 必读规范

页面类任务进入 Build & Release 前，必须读取：

1. `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md`
2. `docs/brand/wavesight-ai-vi/typography-guidelines.md`
3. `docs/brand/wavesight-ai-vi/brand-tokens.css`
4. `context/02-vi-style.md`
5. `context/frontstage-page-contracts.md`
6. `agent-workflow/skills/guanlan-typography-qc/SKILL.md`

## 3. 派发前硬要求

页面派发单必须要求 Experience & Editorial 先输出 `Typography 页面位置表`。

没有该表，不得进入 Build & Release。

## 4. Typography 页面位置表最小格式

```markdown
## Typography 页面位置表

| 页面/模块 | 位置 | 字体角色 | 字号/行高 | 字重 | Token / CSS 变量 | 最大行数 | 禁止项 | Build & Release 实现说明 |
|---|---|---|---|---|---|---|---|---|
|  | 导航文字 / Hero H1 / 栏目 H1 / 详情 H1 / 模块标题 / 卡片标题 / 正文 / 标签 / 页脚 | serif-cn / sans-cn / en / mono |  |  |  |  |  |  |
```

必须覆盖：

- 导航文字。
- 页面 H1。
- 首页 Hero 或栏目首屏标题。
- 模块标题。
- 卡片标题。
- 卡片摘要 / 正文。
- 标签、日期、来源、按钮。
- 侧栏标题与正文。
- 页脚和备案文字。

## 5. Build & Release 权限边界

Build & Release 只能按 Typography 页面位置表实现。

Build & Release 允许：

- 使用表中指定的 token、字号、行高和字重。
- 为适配选择器命名做不改变视觉层级的 class 调整。
- 在 closeout 中指出 Typography 表不适配页面结构，并回退 Experience & Editorial。

Build & Release 不允许：

- 临场新增不在表中的字号体系。
- 在普通页面标题、栏目标题或卡片标题上使用不受控 `vw`。
- 在非 Hero 位置使用最大值超过规范的 `clamp()`。
- 在导航、正文、卡片标题、标签和按钮上使用 700 以上字重。
- 使用 `760` / `780` 等非规范字重。
- 给中文标题使用负字距。
- 把栏目页、详情页、卡片或侧栏做成 Hero 尺寸。

如果实现必须突破 Typography 表，任务状态必须改为 `blocked / typography-required`，不得继续实现。

## 6. `$guanlan-typography-qc` 使用方式

页面类任务必须在两个节点使用：

1. Build 前：用 `$guanlan-typography-qc` 对 Typography 页面位置表进行前置审查。
2. Build 后：用 `$guanlan-typography-qc` 对页面 CSS / 截图进行偏差复核。

Build 前审查必须确认：

- 页面每个位置都有明确字号、行高和字重。
- 表中没有不受控 `vw`、过大 `clamp()`、过重字重或负字距。
- 页面 H1、模块标题、卡片标题、正文和标签不会互相抢层级。

Build 后复核必须输出：

- 是否 100% 按 Typography 表实现。
- 哪些 selector 偏离了表。
- 是否存在新增表外字体规则。
- 是否需要返修。

## 7. Closeout 必填

页面类 closeout 必须说明：

- Typography 页面位置表路径或正文。
- `$guanlan-typography-qc` Build 前审查结论。
- Build & Release 是否 100% 按 Typography 表实现。
- 是否新增表外字体规则。
- 若新增，新增 selector 是什么、为什么新增、是否经过 Experience & Editorial 复核。
- `$guanlan-typography-qc` Build 后复核结论。
- 桌面截图路径和主要页面坐标 / 字号 / 行高检查结果。

未填写上述内容，调度窗口不得 accepted。

## 8. 阻塞条件

以下任一情况，页面任务不得 accepted：

- 缺 Typography 页面位置表。
- Typography 表只有原则，没有每个页面位置的具体字号 / 行高 / 字重。
- Build & Release 自行新增表外字体层级。
- 普通页面使用 Hero 级字号。
- 栏目页 H1、详情页 H1、模块标题、卡片标题互相抢层级。
- 导航文字在不同页面大小或字重不一致。
- CSS 出现不受控 `vw`、过大 `clamp()`、`760 / 780` 字重或中文负字距。
