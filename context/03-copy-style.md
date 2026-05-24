---
status: current
scope: base-copy-style
last_updated: 2026-05-22
use_when:
  - page title
  - module copy
  - card copy
  - button copy
  - empty state
  - general site expression
do_not_use_when:
  - full daily observation article
  - specialist column writing with its own skill
priority: current
---

# 03 Copy Style｜全站基础文案规范

全站基础文案以 `guanlan-copy-style` Skill 为准。本文件只保留路由和压缩版原则。

## 职责

适用：

- 栏目名、页面标题、模块标题。
- 卡片标题、摘要、标签。
- 按钮文案、空状态、提示语。
- 普通页面说明和通用运营短文案。
- 商业信号卡、前沿观点卡、变化候选、场景候选、趋势候选、成熟变化短专题和商业信号发布索引中的模型生成展示文案。
- 今日观察进入首页、栏目页或其他前台模块时所需的短标题、摘要和卡片文案。

不适用：

- 今日观察完整文章。
- 今日观察选题和 QC。
- 专题栏目深度写作。
- 原始证据改写。

今日观察 writer 只负责文章本体；首页摘要、栏目页摘要、卡片等前台短文案归本文件和页面 / 文案流程处理。

专题内容优先调用专题 Skill。

## 基础气质

观澜文案追求：

- 克制。
- 清楚。
- 有判断。
- 有商业感。
- 读起来不像机器生成。

不要追求：

- AI 感。
- 科技口号。
- 宏大叙事。
- 公关稿腔。
- 行业黑话。

## 硬规则

- 清楚，不装深。
- 克制，不喊趋势。
- 有判断，但不过度断言。
- 短文案也要有信息量。
- 技术词要转译成业务问题。
- 不用“赋能、重塑、生态、闭环”等词填空。
- 如果一句话删掉后信息无损，就删掉。

## 前沿观点卡文案边界

- 前台标题必须写成人物 / 机构 + 观点要点，不暴露 `opinion_tier`、`display_lane`、`cardcopy_gate` 等内部字段。
- 摘要只解释观点的商业含义，不把观点里的公司动作、客户采用、融资、收入或市场规模写成已验证事实。
- 短观点优先保留原文；长观点保留关键原文摘录，并给出原文链接。
- `archive` / `discard` 观点卡可用于内部归档和复盘，不得为了凑前台内容补写成展示文案。

## 当前 Skill

- 生成：`skills/guanlan-copy-style/SKILL.md`
- 基础 QC：`skills/guanlan-copy-style-qc/SKILL.md`
- 今日观察：`guanlan-daily-observation-pitch` / `guanlan-daily-observation-writer` / `guanlan-daily-observation-qc`
