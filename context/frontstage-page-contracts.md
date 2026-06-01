---
status: current
scope: frontstage-page-contracts
last_updated: 2026-06-01
use_when:
  - page change
  - copy change
  - data sync
  - release check
priority: current
---

# Frontstage Page Contracts｜前台页面契约

本文件约束核心页面“不能被什么污染”。页面改动必须先读 `context/version-ledger.md`，再读本文件。

| 页面 | 当前职责 | 必须保留 | 禁止回退 / 禁止污染 | 必跑门禁 |
|---|---|---|---|---|
| 首页 | 展示观澜当前判断入口、最新商业信号、趋势追踪入口和内参入口 | V2.2.1 信息架构；趋势模块读取真实趋势候选或正式趋势报告 | 旧 hero、旧趋势模块、V2.1 文案、合成趋势、过期 activeDate | `frontstage-regression-gate` |
| 今日观察 | newsletter，一眼看清一天要点，并连接当天文章、商业信号、观点和趋势 | 当日文章详情；日期查看；关键词 tags；相关卡片跳转自己的详情页 | `今日判断` 口径、旧 summary 卡、把 Raw / Pool 字段露到前台 | `frontstage-regression-gate` + public copy |
| 商业信号 | 前台展示事实型商业信号，包括融资、案例、产品服务和合作信号 | 标题优先使用前台标题；摘要必须是公开读者可读文案；融资分类按真实标签统计 | 机械中文标题、内部处理语言、Raw 摘要 fallback、单一“种子轮”假统计 | cardcopy + public copy + regression |
| 趋势追踪 | 区分正在形成的趋势和趋势报告，展示直接关联材料 | 只显示当前趋势 `relations` 直接关联的信号、观点、案例；支持日期和 tags | 标签泛关联、全站列表 fallback、无关案例/观点、`TRD-WATCH-*` 合成报告 | `frontstage-regression-gate` |
| 趋势详情 | 解释一个趋势如何形成、证据链是什么、缺口在哪里 | 标题、判断、直接关联信号、时间线和边界 | 用全站信号/观点填空、展示不相干材料、旧报告模板回潮 | `frontstage-regression-gate` |
| 商业内参 | 周期性商业判断、热力变化和会员层材料入口 | 与今日观察、商业信号、趋势追踪形成关系，但不复用旧页面模块 | 借用旧首页模块、旧信号卡样式、普通新闻站口吻 | regression + public copy |

## 改动分级

| 类型 | 定义 | 示例 | 检查 |
|---|---|---|---|
| Patch | 不改变页面结构的小修复 | 修文案、修链接、删旧组件 | syntax + regression |
| Page Change | 页面布局、模块、视觉结构变化 | 重排趋势页、首页模块调整 | syntax + typography + public copy + regression |
| Copy Change | 前台标题、摘要、CTA、说明变化 | 商业信号标题规则、按钮文案 | public copy + cardcopy |
| Data Change | 字段、同步规则、生成规则变化 | activeDate、relations、sourceTitle 优先级 | v2content + cardcopy + regression |
| Release Change | 部署、自动化、GitHub Action 或 tag | 发布版本、冻结点、GitHub workflow | regression + release checklist |

## 冻结记录规则

页面被确认后，必须在 `context/version-ledger.md` 的“当前冻结点”记录：

- 页面名称。
- 确认日期。
- 对应版本。
- 不允许回退的内容。
- 当时通过的门禁。
- 可回滚的 Git commit 或 tag。
