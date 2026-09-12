# 生财有术创业方向统计分析

第三个页签：community-scys.html?section=directions；方向深链示例：&direction=apps。

## 数据与维护

- 数据文件：01-SiteV2/site/data/scys-startup-directions.json。
- 2026-09-12 Excel 整理快照：12 个方向、179 篇案例与实践帖子、15 条金额记录。
- 每篇只归入一个主方向。按原帖去重，同一项目的不同帖子分别计数；数量不是创业项目数、成交数或市场规模。
- itemId 固定关联 scys-community-library.json，同时保留标题、作者校验；不使用 Excel 行号作为关联键。
- links 保留去重前各归档记录的完整资料地址，详情弹窗合并展示，不改写飞书参数。
- 方向痛点为编辑归纳，价格为历史来源陈述，不能进入 V4 事实表。缺失价格明确显示未披露；预约、佣金和竞品价格单独标识。
- 这是人工整理快照。新增帖子需审核后加入对应方向；改变采集排序不会改变成员。库内帖子缺失、身份变化或链接变更由现有社群测试阻止发布，不静默改配。
- JSON 仅含分类、来源定位、链接和短金额依据，不保存完整原文或私有证据正文。

## 页面规格与验收

| 位置 | 字体 / 字号 / 行高 | 文案 |
|---|---|---|
| 页签 | 品牌无衬线 / 14 / 20 | 创业方向统计分析 |
| 方向标题 | 品牌无衬线 / 20 / 30 | 数据内方向名称 |
| 统计数字 | 品牌数字字体 / 28 / 40 | 创业方向、案例与实践帖子、收费及金额记录 |
| 正文 | 品牌无衬线 / 14 / 24 | 主要痛点、产品与服务、收费与金额、对应帖子 |

Guanlan Typography QC：使用品牌 token、400/500/600 字重，不改左侧导航。桌面 1280 和手机 390 视口检查层级、换行、控制项和横向溢出。截图输出到本机 WaveSight/runtime/scys-directions-*.png，不进入源码。

验证命令：npm run test:community-intelligence；node agent-workflow/tools/tests/community-subcolumns-browser-smoke.mjs；node agent-workflow/tools/frontstage-regression-gate.mjs；node agent-workflow/tools/assert-version-consistency.mjs。
浏览器覆盖第三页签、12/179/15 统计、方向切换、URL 重载、分页、金额性质、原帖与详情，以及旧案例/资料页和 AI 破局隔离。
