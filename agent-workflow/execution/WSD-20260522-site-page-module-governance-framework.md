---
task_id: WSD-20260522-site-page-module-governance-framework
date: 2026-05-22
status: current-framework
owner: Product Commander
---

# WSD-20260522 Site Page / Module Governance Framework

## 目标

接下来进入网站模块与页面治理，不再重复 Source / Raw / Pool / Card 治理。

治理对象包括：

- 首页。
- 栏目页。
- 详情页。
- 栏目模块。
- 卡片展示模块。
- 导航、页头、页脚。
- 内容字段在前台的展示方式。
- 页面文案、视觉节奏、Typography 和 VI 一致性。

## 四个治理层

| 层级 | 治理对象 | 负责 Agent | 核心问题 | 当前状态 |
|---|---|---|---|---|
| 1. Module / 信息架构层 | 首页模块、栏目结构、导航关系、模块合并 / 删除 / 新增 | Product Commander + Experience & Editorial | 哪些模块该保留？哪些该删？首页和栏目页如何承接 V2.1 内容资产？ | ready |
| 2. Page / 模板层 | 首页、栏目页、详情页、列表页、专题页模板 | Experience & Editorial | 页面路径是否清楚？版式是否有主次？详情页是否适合长文和卡片阅读？ | blocked by 层 1 |
| 3. Copy / Visual / Typography 层 | 页面文案、栏目名、卡片文案、按钮、标题层级、字体大小位置、VI | Experience & Editorial | 是否像观澜 AI？是否有商业判断？是否克制、清楚、低 AI 味？ | blocked by 层 2 |
| 4. Build / Release 层 | 组件、路由、数据绑定、样式、视觉资产、发布检查 | Build & Release | 设计和规则是否落到代码？页面是否稳定、干净、可继续维护？ | blocked by 层 3 |

## 五个执行阶段

| 阶段 | 负责 Agent | 做什么 | 输出 | 状态 |
|---|---|---|---|---|
| 阶段 1 | Experience & Editorial + Product Commander | 诊断首页、栏目页、详情页和模块体系，提出页面治理方案 | 页面 / 模块诊断报告 | ready |
| 阶段 2A | Experience & Editorial | 输出页面结构、模块取舍、Copy-first、Typography 和视觉规范表 | 页面治理规格表 | blocked by 阶段 1 |
| 阶段 2B | Build & Release | 按确认后的规格表落到代码和数据绑定 | 页面开发 closeout | blocked by 阶段 2A |
| 阶段 3 | Build & Release | 桌面端跑检，确认路由、页面、样式、数据链不坏 | 页面回归报告 | blocked by 阶段 2B |
| 验收 | Product Commander | 按派发单验收是否 accepted | 验收结论 + 看板回填 | blocked by 阶段 3 |

## 当前约束

- 当前网站开发先以桌面端为主，移动端暂不作为本阶段重点。
- 不再回到 V1 / V2.0 旧页面逻辑。
- 不重复 Source / Raw / Pool / Card 治理。
- 不恢复自动化。
- 不推送 GitHub，不部署 Netlify，除非用户明确恢复。
- 页面任务必须遵守 VI、Typography、Copy-first 和公开前台不得出现内部生产语言。

## 下一步任务

优先执行：

```text
WSD-20260522-site-page-module-layer1-diagnostic
```

它只做首页、栏目页、详情页和模块体系诊断，不直接改代码。
