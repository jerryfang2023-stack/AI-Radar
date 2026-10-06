# 融资项目与轮次重复复核 · 2026-10-06

范围：当前对外融资目录的 529 张项目卡、563 条融资事件。依据公司名称、法律主体、官网、创始人、产品及融资公告交叉复核；名称近似本身不作为合并依据。

## 修复结果

在 `card-review.json` 新增 9 组经过复核的企业 ID 对照及 5 组重复轮次决策，通过原有生成器重建目录：**520 张项目卡、558 条融资事件**。所有原始来源、事件 ID 和旧卡链接保留。采集档案不删除；后续重建继续应用这些决策。

| 企业 | 处理 | 核验依据 |
| --- | --- | --- |
| 无问智科 | 合并项目及重复 A 轮 | 刘盛翔及物理 AI 数据业务一致；9 月 9/10 日报道的洪泰领投及跟投阵容一致。保留资料完整的 10 日报道作为主卡。 |
| Cognition | 合并项目，保留两轮 | Scott Wu、Devin/Windsurf 一致；5 月 D 轮与 9 月 E 轮不同。 |
| Cato | 合并项目，保留两轮 | 两位创始人及米兰公共采购平台一致；pre-seed 和 seed 不同。 |
| Lumilens | 合并项目及重复披露 | 8 月 6 日同一公告；保留现有 7 亿美元本轮记录，9 亿美元是累计额，不另计一轮。 |
| telli | 合并项目，保留两轮 | telli.com 及三位创始人一致；2025 pre-seed、2026 seed 不同。 |
| Neo | 合并项目及重复披露 | 7 月 20 日同一 1 亿美元亮相公告；保留多轮汇总口径，移除重复 B 轮计数。 |
| General Compute | 合并项目，保留两轮 | 同一官网及创始人；1500 万美元种子轮和 4 亿美元债务融资不同。 |
| Norm Ai | 合并项目及重复 C 轮 | Nomos 记录与 Norm 同为 John Nay 公司，引用同一 Law.com 报道；日期、金额及领投方一致。 |
| Lio | 合并项目及重复 A 轮 | 同一官网、CEO 及 3 月 5 日 a16z 领投 3000 万美元公告；保留三位创始人资料完整的卡。 |

每组原卡 ID、来源 URL、原文摘录及理由见注册表新增项。额外复核的公司原始公告：

- [Lumilens：本轮与累计融资口径](https://lumilens.com/news-insights/lumilens-emerges-with-900m-in-funding)
- [Neo：1 亿美元公开亮相](https://www.neo.ai/news/neo-launches-100m/)
- [Lio：3000 万美元 A 轮](https://www.lio.ai/newsroom/lio-technologies-raises-30m-series-a-to-bring-agentic-ai-to-enterprise-procurement)

## 不合并的情况

Photon / Xscape Photonics、Intelligence / Recursive Superintelligence 等近似名、两家 Arrakis、Scaled Cognition / Cognition 均缺乏同一主体证据。听象 A1/A2、深度智控 B/B+ 保留不同轮次；融资金额区间相同不代表同一融资。

## 验证

- 真实 9 组数据回归：修复前失败，修复后通过。
- 五组重复融资只计一次；四组不同轮次保留完整历史。
- Lumilens 本轮及已知轮次合计不混入 9 亿美元累计额；Neo 保留 `multi_round`。
- 重建前后全部来源事件 ID 集合一致；每条旧卡 ID 仍为现卡或有重定向。
- 发布使用 Portal 标准固定源版本生成与部署流程，保留卡片减少保护检查，通过来源事件血缘识别合并。
