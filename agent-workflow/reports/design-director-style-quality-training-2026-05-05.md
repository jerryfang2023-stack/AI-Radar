---
title: Design Director Style Quality Training
date: 2026-05-05
type: training-report
status: completed
owner: ui-ue / workflow
encoding: UTF-8
project: 观澜AI｜WaveSight AI
---

# Design Director Style Quality Training

## 1. 训练目标

本轮训练将 Design Director 的审美职责从“页面对不对”升级为“页面精不精”。

风格美观不再是主观补充意见，而是每一次页面设计、页面重构、视觉资产、海报、首屏样张、栏目页和 Admin 体验任务的强制创作要求与质检标准。

## 2. 已写入的强制标准

Design Director 每次页面设计必须检查五项：

| 维度 | 说明 | 分值 |
|---|---|---:|
| Style Purity / 风格一致性与纯净度 | 视觉方言是否纯粹，素材和装饰是否无杂质 | 20 |
| Proportion & Rhythm / 比例与韵律感 | 负空间、构图、排版建筑感、模块节奏是否成立 | 20 |
| Color Sophistication / 色彩深度与平衡 | 色调、灰阶、光影和材质是否通透且符合品牌情绪 | 20 |
| Craftsmanship / 细节的艺术处理 | 圆角、图标、字体渲染、微像素、状态反馈是否精致 | 20 |
| Emotional Resonance / 情感共鸣 | 第一秒气场是否可信、有判断、有边界、值得读 | 20 |

## 3. 眯眼测试

每次设计完成后必须执行 Squint Test：

- 忽略文字，只看色块、明暗分布、留白、轮廓和视觉重心。
- 眯眼后页面骨架仍清晰、平衡、有节奏，才算通过。
- 如果只看到散乱卡片、随机色块、过多按钮、无主次装饰或空洞大留白，必须重做结构。

## 4. 评分规则

- `90-100`：优秀，可作为母版或参考样张。
- `80-89`：通过，可进入 Dev 或 QA，但记录可优化项。
- `70-79`：勉强通过，只能在无阻塞项时继续，必须列出后续优化点。
- `<70`：不通过，必须重做。

以下情况即使总分达到 70 也必须重做：

- 任一单项低于 10。
- Squint Test 不通过。
- 出现审美阻塞项。

## 5. 已接入的工作流位置

- `agent-workflow/agents/ui-ue-agent.md`：写入 Design Director 风格美观创作与质检标准。
- `agent-workflow/product/DESIGN.md`：写入全站设计规范中的风格美观质检。
- `agent-workflow/governance/window-dispatch-hub.md`：页面类任务派发和验收必须检查风格美观质检表。
- `agent-workflow/execution/TASK-window-dispatch-template.md`：页面类派发单必须包含 Design Director 风格美观质检表。
- `agent-workflow/reports/TASK-window-closeout-template.md`：页面类 closeout 必须填写风格美观质检表。
- `agent-workflow/governance/agent-memory.md`：写入长期记忆。

## 6. 后续调度规则

后续任何页面类任务必须写入：

```text
页面类任务必须由 UI/UE Design Director 输出风格美观质检表。总分低于 70、任一单项低于 10、Squint Test 不通过或出现审美阻塞项时，必须重做，不得进入 Dev 或不得标记 accepted。
```

## 7. 后续建议进入调度中枢的任务

```text
派发：P0 UI / UE Design Director 牵头，对首页、Daily Brief、Signals、The Point、Opportunities、Trends、Admin 做一次全站风格美观基线审计，按 Style Purity、Proportion & Rhythm、Color Sophistication、Craftsmanship、Emotional Resonance 五项评分；低于 70 的页面输出重做建议，不改 04-Site 代码，只产出审计报告和后续派发建议。
```
