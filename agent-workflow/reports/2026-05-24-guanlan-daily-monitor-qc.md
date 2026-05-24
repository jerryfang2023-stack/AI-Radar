# Guanlan Daily Monitor QC Report

## 1. Summary

- Date: 2026-05-24
- Result: passed_with_notes
- Score: 88.65
- Downstream decision: allow_with_degradation
- Biggest issue: 监测已通过硬门槛，但有 3 个来源失败记录，且成熟商业信号占比 61.3%，下游需要降低泛化表述，避免把单日样本写成整体趋势。

## 2. Metrics

| Metric | Value | Required | Result |
|---|---:|---:|---|
| Raw count | 80 | 80-150, or 50-80 with reason | passed |
| Pool count | 40 | 20-40 target | passed |
| Core pool count | 25 | task-dependent / >=5 gate baseline | passed |
| Routed pool count | 28 | excludes index-only and discard / >=15 | passed |
| Index-only pool count | 12 | audit only | note |
| AI HOT index-only / core | 12 / 1 | separated | passed |
| Usable original-evidence core items | 25 | >= core_pool baseline | passed |
| Homepage / directory core items | 0 | 0 | passed |
| Discovery-entrance-only core items | 0 | 0 | passed |
| Missing full_text core items | 0 | 0 | passed |
| Raw-QC blocked / degraded core items | 0 / 0 | 0 | passed |
| Six importance types covered | yes | yes | passed |
| Scoped degradation permission | required | required when downstream decision is allow_with_degradation | passed |

## 3. Hard Gates

| Gate | Triggered | Evidence | Required Fix |
|---|---|---|---|
| Raw / Pool minimums | no | Raw 80, Pool 40, routed Pool 28 | none |
| Keyword non-community minimum | no | 38 non-community keyword-search items; paths include official, developer, capital, industry, procurement, A-media/GDELT | none |
| AI relevance | no | title relevance ratio 0.825; off-topic title count 0 | none |
| Core evidence integrity | no | 25 core items with usable original evidence; no missing full text; no homepage/directory core item | none |
| Importance coverage | no | Raw and Pool both cover required importance types | none |

## 4. Raw / Pool Findings

| Item | Problem | Current Route | Correct Route | Fix |
|---|---|---|---|---|
| failed_sources | 关键词预闸过滤 5 条，其中 job/salary 页面 4 条、avatar 噪音 1 条；NewsAPI query `AI Agent funding enterprise customers` fallback failed | excluded / fallback | excluded or watchlist only | 不得进入事实型下游；必要时用官方、投资方、可信报道重新补证 |
| theme concentration | 成熟商业信号占比 61.3%，超过 40% 提醒线 | mixed Pool | downstream note | 商业信号、今日观察、内参写作需声明单日样本偏成熟商业信号，避免扩大为全市场判断 |
| AI HOT index-only | AI HOT daily 12 条作为 index-only，另有 1 条进入 core | index_only / core_pool | separated | 已分离；index-only 不得直接生成事实型卡片 |
| core_pool | 25 条 core 均为 Raw-QC allow，无 block / degradation，无缺全文 | core_pool | eligible_after_qc | 可供下游使用，但仍需回看 Raw archive / JSON 和 source_url |

## 5. Importance Coverage

| Importance Type | Evidence Found | Gap | Fix |
|---|---|---|---|
| important_case | Pool 5 | no blocking gap | 生成案例类内容时仍需确认客户、部署、流程或使用路径证据 |
| important_funding | Pool 1 | thin but covered | 融资类内容优先补官方公告、投资方说明或可信报道 |
| important_technical_trend | Pool 1 | thin but covered | 技术趋势下游需避免泛化，优先引用 release / benchmark / repo / paper 证据 |
| important_product_or_service | Pool 15 | no blocking gap | 可进入产品服务候选，但要区分新产品、平台能力、API、Marketplace 上架和愿景叙事 |
| important_vertical_solution | Pool 15 | no blocking gap | 可进入垂直场景候选，但弱客户证据只能写 scene_candidate，不包装成强案例 |
| important_viewpoint_or_article | Pool 1 | thin but covered | 观点型内容需保留观点/事实边界 |

## 6. Source And Page-Type Audit

| Item | Source Type | Page Type | Evidence Boundary | Decision |
|---|---|---|---|---|
| Core pool overall | S/A/B/C mixed, B=48 in Raw source distribution | non-index evidence object | 25 usable original-evidence core items | allow |
| AI HOT entries | M acquisition entrance | index / selected entrance unless original resolved | AI HOT itself is discovery only | allow only after original source evidence |
| Keyword search entries | Anysearch / fallback discovery | original or media pages when resolved | search result text is not fact evidence | allow only with original URL, full text and Raw-QC allow |
| Community / HN / X feedback | C / M feedback | feedback or discussion | can prove discussion exists only | watchlist or user-feedback unless resolved original exists |

## 7. Downstream Permission

- Daily observation: allow_with_degradation. 可使用 core_pool 中 Raw-QC allow、全文完整、非目录页材料；必须标注单日样本偏成熟商业信号。
- Business signal: allow_with_degradation. 可使用 25 条 core_pool；index-only、失败来源、搜索入口摘要不得直接成卡。
- Trend tracking: allow_with_degradation. 可使用技术趋势和垂直方案材料，但趋势判断需降低强度，不能把薄覆盖类型写成稳定趋势。
- Business brief: allow_with_degradation. 可引用融资、产品服务、垂直方案，但需注明来源边界。
- Asset chain: allow_with_degradation. 允许 eligible_core_pool_only 继续进入事实型资产。
- Asset chain restrictions: 只允许 Raw-QC allow 且 full_text 完整的 core_pool；allow_with_degradation / index_only / failed_sources 不能进入事实型资产。

## 8. Required Repair Prompt

本日不需要阻断性返修。若后续要生成卡片或今日观察，请按以下约束执行：

1. 只从 `core_pool` 且 `raw_qc_decision=allow` 的条目生成事实型资产。
2. 对 `important_case` 和 `important_product_or_service` 继续执行较温和放宽规则：有明确垂直场景、流程对象、部署动作、客户角色或使用路径的条目可生成 `case` / `scene_candidate`；有明确新产品、新服务、API、平台能力、Marketplace 上架或商业化能力的条目可生成 `product_service` / `product_candidate`。
3. 不得把缺少真实客户、部署证据、产品交付描述或原文全文的材料包装成强案例或强产品服务卡。
4. 对 3 个 failed_sources 只保留为失败记录；需要使用时重新补采官方、投资方或可信报道原文。
