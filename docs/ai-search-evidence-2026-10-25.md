# 融资证据关系修复 · 2026-10-25

对应公开产品 https://www.zkdlj.vip/ ，Portal V2.15.0。原始日期批次、事件 ID、企业 ID、既有来源 ID 和融资永久 URL 保持。原始媒体披露有依据，所以不改写 Raw/Claim 历史；在规范化后的融资应用层附加受保护的审阅覆盖，区分官方原始披露与媒体表达。网站、企业历史、金额排序与月份统计消费同一份生成 catalog。

## 结构审查与首批范围

只读审查全部 846 条规范化融资记录：3146 处来源未保存发布时间，2679 处来源使用 legacy 短哈希。按仓库 `evidenceQuoteHash` 的空白归一化契约核对，引文哈希错误为 0。初版逐字节比较的 3 处差异已排除，并加回归防止误报，不篡改合法原文引文或其哈希。

首批外部核验 5 个事件／9 个 URL：重点审阅 Cognitive Credit、Karta AI；另读 Mueon、Finches、Eridu 的原始页面，核对初版哈希疑点。后 3 条没有形成事实更正。Cognitive Credit / Karta 共 5 次成功直读的正文通过已有 V2 私有原文存储入库并推送私有仓，EU-Startups 直读 403、网页读取可用，其已接受原文也存在私有仓 `objects/42/4250b199b65c99bc49131885ed7e11b3c6905f5dd5e836f03d60a33a125777fe.txt`。不将工具网络限制解释成融资站拒绝请求。

未全库联网重抓，缺失发布日期和 legacy 哈希保留待核验。完整只读问题清单及 HTTP/原文响应留在本机私有运行目录 `runtime/ai-search-20261025`，不作为已完成事实复核的数量。

## 更正依据

| 事件 | 审阅结果 | 原始依据 |
|---|---|---|
| EV-0d7fe2f7274f7448 / FI-d8fd29312f7415a9 | 原始披露为 2026-10-22、4000 万美元成长投资；保留 10-23 媒体 3573 万欧元折算，同一事件计一次。2024 年 B 轮来源只支持历史。投资方角色不改。 | [本轮官方](https://cognitivecredit.com/blog/cognitive-credit-announces-40-million-strategic-growth-investment)、[媒体折算](https://www.eu-startups.com/2026/10/londons-cognitive-credit-lands-e35-73-million-to-scale-its-ai-and-data-platform-for-credit-markets/)、[历史官方](https://cognitivecredit.com/blog/cognitive-credit-completes-10mm-series-b-fundraise) |
| EV-bc1d1f284b31e230 / FI-e57481409918a342 | 保留 2026-10-22、300 万美元种子轮与现有角色。补录 Open Magazine 的 2026-10-22T10:24:50+05:30 与 Entrackr 的 2026-10-22T08:39:14.130+05:30；不假定其他来源日期。 | [Open Magazine](https://openthemagazine.com/business/karta-ai-raises-3-million-can-voice-ai-fix-indias-bank-helplines)、[Entrackr](https://entrackr.com/snippets/voice-ai-platform-karta-ai-raises-3-mn-in-seed-round-led-by-peercapital-and-cedar-hill-12705952) |

`first_public_disclosure` 表示目前核验到的最早来源，不宣称穷尽全网。来源发布时间、来源改版时间、抓取时刻、收录批次、页面修改时间与审阅时刻分别保留；没有首次收录时刻时不拿批次或今天代填。约数、区间、下限、累计融资与估值继续沿用原有规范化约束。

## 实现与重算

- `evidence-review.json`：声明式事件绑定、预期旧值与新值、审阅人/时间/原因、精确来源定位、current_round/historical_round 与字段绑定；源数据仍可完整恢复。
- `evidence-review.mjs`：纯函数，不改输入；预期值漂移报错，禁止历史来源支持当前字段。没有审阅的记录只保留既有证据对应关系，不猜字段与日期。
- `build-funding-insights-frontstage.mjs`：ID 规范化后应用审阅，防止日期／币种调整使现有 FI URL 改名。
- `subjects.mjs`：事件精简投影保留各自来源与当前来源 ID；企业跨轮来源仍保留于历史，不再默认全部支撑本轮。去重后重新计算来源集合。

修复前后都是 657 个融资主体、703 个独立事件。2026 年 10 月事件仍为 155；确定金额的 EUR 小计由 812390000 降至 776660000，USD 小计由 9607210000 增至 9647210000，其余币种不变。只改变 Cognitive Credit 的归属日期和本轮原始金额；不是两次融资或新增一笔 2024 年融资。Karta 和 8/9 月历史专题数字不因这次更正改变。企业历史、机构参与和榜单使用重建结果，不手工改显示数字。

## 验证和恢复

`node agent-workflow/financing/evidence-review.mjs --output=私有路径/report.json` 默认为 dry-run。报告列融资字段及来源元数据旧新差异；从已应用的输入重复运行，业务差异为零。可用 `applyFinancingEvidenceReview(cards, registry, {rollback:true})` 核对旧值；恢复发布时禁用对应审阅项并重建，或在独立分支 revert 本次补丁后按正常发布链发新版本，保留所有采集原文与更正历史，不强行切回其他人的生产版本。

已验证历史来源不绑定当前事实、正确记录不改、缺失与不确定金额不猜、冲突显式保留、同轮新增来源不增计、修复幂等与恢复、旧 ID 保持。完整融资模块回归与当前 funding gate 的最终回执附于 Portal 交付记录。
