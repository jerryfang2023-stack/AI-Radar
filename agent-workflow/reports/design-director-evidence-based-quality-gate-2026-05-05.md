---
title: Design Director Evidence-Based Quality Gate
date: 2026-05-05
type: training-report
status: completed
owner: ui-ue / workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# Design Director Evidence-Based Quality Gate

## 1. 背景

用户指出：Design Director 即使完成风格美观质检，设计细节仍然粗糙，说明原有质检存在“主观自评、缺少截图、缺少扣分、缺少退回机制”的问题。

本轮训练将 Design Director 风格美观质检从“填分数”升级为“证据化审片机制”。

## 2. 核心升级

页面类任务的风格美观质检必须包含：

1. 设计基准引用。
2. 桌面端截图。
3. 移动端截图。
4. 五项评分与逐项扣分原因。
5. Squint Test 结论。
6. 必须重做清单。
7. 可延后优化清单。
8. Dev 实现偏差清单。
9. QA 复核建议。

如果没有截图、没有扣分原因、没有重做清单或没有 Dev 偏差清单，质检无效。

## 3. 新通过线

| 页面类型 | 通过线 |
|---|---:|
| 首页 / 全站母版 / 核心首屏 / 海报 / 视觉资产 | 85 |
| 一级栏目页 / 详情页 / 会员页 | 80 |
| Admin 工作台和后台模块 | 75 |

所有页面任一单项低于 14、Squint Test 不通过或出现审美阻塞项时，必须重做。

## 4. 扣分规则

| 问题 | 扣分 / 处理 |
|---|---:|
| 标题位置、字号、行高或模块起点与同级页面不一致 | -8 到 -12 |
| 同屏超过 3 种卡片风格、圆角或阴影系统 | -10 |
| 按钮、徽章、数字和摘要争抢注意力 | -8 到 -12 |
| 首屏没有明确主任务或视觉重心 | -12 到 -18 |
| 海报或首屏视觉像通用 AI 氛围图 | 直接阻塞 |
| 前台像后台组件堆叠 | 直接阻塞 |
| 移动端标题断行难看、按钮拥挤或横向溢出 | -10 到直接阻塞 |
| 配色脏、廉价、高饱和或偏离 `DESIGN.md` 色彩系统 | -8 到 -15 |
| 圆角、图标线宽、边框、hover / active 状态不统一 | -6 到 -12 |
| 图片素材色温、饱和度、构图视角不统一 | -8 到 -14 |
| 文案过长破坏布局但未退回 Copy | -8 到 -12 |
| 眯眼后只看到散乱卡片或随机色块 | 直接阻塞 |

## 5. 已写入位置

- `agent-workflow/agents/ui-ue-agent.md`
- `agent-workflow/product/DESIGN.md`
- `agent-workflow/governance/window-dispatch-hub.md`
- `agent-workflow/execution/TASK-window-dispatch-template.md`
- `agent-workflow/reports/TASK-window-closeout-template.md`
- `agent-workflow/governance/agent-memory.md`

## 6. 后续调度要求

后续页面类任务必须在派发单中写入：

```text
Design Director 风格美观质检必须证据化。页面已实现或已有可访问页面时，必须包含桌面截图、移动端截图、逐项扣分原因、必须重做清单和 Dev 实现偏差清单。首页/全站母版/核心首屏/海报/视觉资产低于 85，一级栏目页/详情页/会员页低于 80，Admin 低于 75，任一单项低于 14，Squint Test 不通过或有审美阻塞项时，必须重做。
```
