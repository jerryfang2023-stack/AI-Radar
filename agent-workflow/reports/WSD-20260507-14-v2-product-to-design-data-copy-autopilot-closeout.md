---
title: V2-8AUTO 产品架构到设计 / 数据 / 文案规范连贯包 closeout
date: 2026-05-07
task_id: WSD-20260507-14-v2-product-to-design-data-copy-autopilot
board_id: V2-8AUTO
status: accepted
encoding: UTF-8
---

# V2-8AUTO closeout

## 1. 合并执行说明

本轮按用户要求与 `V2-4B / WSD-20260507-12-v2-navigation-column-finalization` 合并执行。执行顺序为：

1. 先完成 V2 导航与栏目收敛确认。
2. 再基于已确认的四导航输出 UI/UE、Data、Copy / Editorial 和 QA / Dev 交接规范。

## 2. 完成产物

| 产物 | 路径 |
|---|---|
| V2 导航最终决策 | `agent-workflow/v2/v2-navigation-column-finalization.md` |
| 页面母版与设计验收规范 | `agent-workflow/v2/v2-page-master-spec.md` |
| 最小数据 schema | `agent-workflow/v2/v2-data-schema-minimum.md` |
| Copy / Editorial System | `agent-workflow/v2/v2-copy-editorial-system.md` |
| Stage A 摘要 | `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-A.md` |
| Stage B 摘要 | `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-B.md` |
| Stage C 摘要 | `agent-workflow/reports/WSD-20260507-14-v2-product-to-design-data-copy-autopilot-stage-C.md` |
| V2-4B closeout | `agent-workflow/reports/WSD-20260507-12-v2-navigation-column-finalization-closeout.md` |

## 3. Stage D：QA / Dev 交接

可进入 `V2-9` 的内容：

- Design tokens、布局 primitives、按钮、标签、卡片、报告阅读组件。
- 澜线 / 地平线 / 细分割线基础图形语言。
- 页面级截图验收模板。

可进入 `V2-10` 的内容：

- Home 母版。
- 今日 3 条关键信号摘要。
- 今日要点预览。
- 机会解码预览。
- 商业内参样张与会员入口。

可进入 `V2-11` 的内容：

- 今日要点栏目页 / 详情页。
- 关键信号栏目页 / 详情页。
- 机会解码栏目页 / 详情页。
- 观点校准和趋势背景嵌入模块。

需要等 `V2-13` 的内容：

- 真实 V2 内容路径接入。
- 生产 validator。
- HeatEvidence / AIBriefIssue 入站。
- 备份、回滚、同步失败恢复。

不再等待 `V2-7`：

- 用户已明确跳过七日隔离验证，`V2-7` 不作为阻塞项。
- 但数据质量风险必须由 `V2-13` 的生产线切换计划、validator 和 QA 承接。

## 4. 页面类硬闸门覆盖

| 要求 | 结果 |
|---|---|
| UI/UE 页面规范表 | 已在 `v2-page-master-spec.md` 输出 |
| Copy 规范表 | 已在 `v2-copy-editorial-system.md` 输出 |
| Design Director 评分表模板 | 已在 `v2-page-master-spec.md` 输出 |
| 桌面 / 移动截图验收要求 | 已在 `v2-page-master-spec.md` 输出 |
| Dev 偏差清单要求 | 已在 `v2-page-master-spec.md` 输出 |

## 5. 范围合规

未修改：

- `04-Site/`
- `01-SiteV2/site/` 代码
- V1 生产内容目录
- 生产同步脚本
- `content-paths.json`
- 长期自动化任务
- Netlify 配置

## 6. 自动化影响

本轮未修改自动化本体。未来影响集中在 `V2-13`：

- V2 内容路径。
- HeatEvidence / AIBriefIssue 入站。
- 生产 validator。
- 备份与回滚。
- Point / Trend 从独立栏目降级为引用资产后的同步关系。

## 7. Quality Gates

已运行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
```

结果：passed，7 项检查，失败 0。

报告：

- `agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-114727.md`

说明：

- V1 旧站已归档，syntax 模式跳过不存在的旧 `04-Site` 探针。
- 本轮未做浏览器截图、多身份权限或生产同步检查，因为没有实现页面代码、权限逻辑或生产内容同步。
