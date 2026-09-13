# 字体／文案／设计规范中心

这是观澜 AI 的集中导航。规范正文与资产仍在各自事实源；修改下列源文件即可，不在本页复制一套规范。管理台 Harness 中对应 `H-expression-design`，沿用“Skill 与算法规则”模块登记。

| 要管理的内容 | 现行源文件 | 何时读取或修改 |
|---|---|---|
| 视觉总入口 | [视觉与页面规范](../../context/02-vi-style.md) | 页面与品牌任务开始时 |
| 专业领域文案 | [专业领域文案规范](../governance/professional-copy-guidelines.md) | 营销、管理、组织行为、投资、战略、财务、人力资源、经济学等专业内容 |
| 页面文案流程 | [Copy-first](../governance/copy-first-page-gate.md) | 标题、按钮、说明、空状态等可见文案 |
| 字体角色 | [字体规范](../../docs/brand/wavesight-ai-vi/typography-guidelines.md) | 中文、英文、数字的字体选择 |
| 字号与排版 | [页面位置字体规范](../../docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md) | 具体位置的字号、字重与行高 |
| 品牌与设计 | [VI 使用说明](../../docs/brand/wavesight-ai-vi/USAGE.md)、[视觉识别规范](../../docs/brand/wavesight-ai-vi/visual-identity-guidelines.md) | Logo、色彩、布局与品牌应用 |
| 样式参数 | [品牌变量](../../docs/brand/wavesight-ai-vi/brand-tokens.css)、[动效变量](../../docs/brand/wavesight-ai-vi/motion-tokens.css) | 实现中引用或映射变量 |
| 正式组件与源图 | [SVG 资产](../../docs/brand/wavesight-ai-vi/executable-svg/README.md)、[规范源图](../../docs/brand/wavesight-ai-vi/reference-images/README.md) | 查找可复用资产和视觉对照 |
| 目标页面契约 | [前台页面契约](../../context/frontstage-page-contracts.md) | 与所属产品当前规则一起确定页面职责与信息边界 |
| 字体前置及复核 | [Typography-first](../governance/typography-first-page-gate.md)、[字体质检 Skill](../skills/guanlan-typography-qc/SKILL.md) | 实现前检查字体表、实现后检查偏差 |
| 文案与体验验收 | [Experience & Editorial](../agents/experience-editorial-agent.md) | 文案、信息层级、交互状态与视觉验收 |

## 如何管理

- 通用规范归约束层，具体页面的文案表、字体表和设计规格归设计层，实施角色与 Skill 归执行层，语义审校和视觉检查归交付完整性层。一个源文件可被多个层引用。
- 修改规范：编辑对应源文件；改变路径时同步 `manifest.json` 与本导航，然后刷新管理台。新增需求或验收缺口沿用既有任务，不新增重复任务队列。
- 产品有客户端、响应式或业务契约差异时，明确适用范围与依据；不能把历史网站字号直接套到所有客户端。源文件中的 V2 历史字样也不能用于恢复退役页面，当前路由以现行产品规则为准。
- 本中心建立导航与规则关联，不代表现有全部页面、文章和物料都已按新规范重新审校。每次交付仍需记录具体适用范围及检查结果。
