# Opportunities 与 Priority Engine 关系打通报告

更新时间：2026-05-02  
Owner：Data Agent / Dev Agent  
状态：已完成，待页面验收

## 完成内容

- 在同步脚本中拆分 scoring 原始名称、机会方向和代表案例。
- 为 scoring row 写入关联 opportunity 的 ID、slug、标题、匹配原因和匹配状态。
- 为 opportunity card 写入关联 scoring IDs、评分、排序、判断和代表案例。
- Opportunities 右侧排行可点击进入匹配到的机会详情页。
- 机会卡列表显示来自 Priority Engine 的评分。

## 关系质量

- scoring rows：26
- matched：26
- unmatched：0
- opportunities with score：18
- opportunities without score：5

## 重点修正

- `AI Native互动内容（Loopit）` 已正确匹配到 `AI互动内容平台`。
- `AI记忆层基础设施（MemoraX）` 已正确匹配到 `AI记忆层基础设施`。
- `企业桌面端 Agent 执行层（Amazon Quick）` 已匹配到 `企业Agent工作平台`。
- `合规引擎/Agent 治理（Haast）` 与 `跨境并购与监管变量（Manus 并购受阻）` 均匹配到 `Agent治理与权限审计服务`。

## 验收建议

1. 打开 Opportunities 页面，检查右侧机会排行是否可点击进入机会详情。
2. 抽查 5 个评分项，确认进入的机会卡方向正确。
3. 检查普通前台是否仍隐藏 Scoring 一级入口。
4. 下次新增评分文档后再次查看 `relations.scoringOpportunity.unmatched` 是否为 0。

