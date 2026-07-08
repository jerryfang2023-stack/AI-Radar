---
task_id: WSD-20260521-daily-observation-skill-raw-pool-card-sync
date: 2026-05-21
status: accepted
owner: Experience & Editorial / Intelligence Engine
depends_on:
  - WSD-20260520-02-raw-evidence-governance accepted
  - WSD-20260520-03-pool-routing-governance accepted
  - WSD-20260520-05-layered-search-and-lane-pool-governance accepted
  - WSD-20260521-repair-20260520-vertical-solution-lane accepted_with_degradation
related:
  - WSD-20260520-04-card-asset-governance
encoding: UTF-8
---

# WSD-20260521｜Daily Observation Skill Raw / Pool / Card Sync

## 1. 任务背景

观澜 AI 的 Raw / Pool / Card 链路已经发生变化：

- Raw 从松散新闻候选升级为证据对象。
- Pool 从内容候选升级为带路由、证据边界和使用限制的素材索引。
- `core_pool` 只能使用通过 Raw QC、可读全文、可追溯、非 index 页面、六类重要性达标的材料。
- Card 资产层正在治理变化卡、案例卡、观点卡、趋势卡的生成门槛。
- 每日观察写作不能再直接消费旧式 Raw 摘要或 Pool 列表。

本任务用于更新「每日观察」相关 Skill，使其适配新的 Raw / Pool / Card 输入体系。

## 2. 任务目标

更新以下 Skill：

```text
C:\Users\86186\.skill-store\guanlan-daily-observation-pitch\SKILL.md
C:\Users\86186\.skill-store\guanlan-daily-observation\SKILL.md
C:\Users\86186\.skill-store\guanlan-daily-observation-qc\SKILL.md
```

目标是让每日观察的选题、撰写和 QC 都遵守最新 Raw / Pool / Card 规则，避免：

- 把 AI HOT / 搜索聚合 / failed provider text 当事实主证据。
- 把 index-only Pool、community/frontier opinion 当公司事实。
- 把 Raw 摘要直接改写成今日观察正文。
- 绕过 Card / evidence gate 直接生成判断。
- 在 `allow_with_degradation` 情况下扩大可用范围。

## 3. 必读

只读取：

1. `AGENTS.md`
2. `context/03-copy-style.md`
3. `context/05-daily-monitoring.md`
4. `context/06-execution-harness.md`
5. `agent-workflow/product/evidence-and-routing-rules.md`
6. `agent-workflow/product/card-asset-copy-governance.md`
7. `agent-workflow/automation-prompts/asset-card-generator.md`
8. `agent-workflow/reports/WSD-20260521-repair-20260520-vertical-solution-lane-closeout.md`
9. 三个每日观察 Skill：
   - `C:\Users\86186\.skill-store\guanlan-daily-observation-pitch\SKILL.md`
   - `C:\Users\86186\.skill-store\guanlan-daily-observation\SKILL.md`
   - `C:\Users\86186\.skill-store\guanlan-daily-observation-qc\SKILL.md`

按需读取：

- `agent-workflow/reports/WSD-20260520-04-card-asset-governance-closeout.md`，如果该文件已存在。
- `agent-workflow/execution/WSD-20260520-04-card-asset-governance.md`，如果 closeout 尚不存在。
- `skills/guanlan-copy-style/SKILL.md`

禁止读取：

- V1 / V2.0 历史文档。
- 已删除、归档、过程、草稿文档。
- 与每日观察 Skill 无关的页面开发文档。

## 4. 必须更新的规则

### 4.1 输入优先级

每日观察选题和写作应按以下优先级消费材料：

```text
已通过 QC 的 Card / Cluster / Trend 资产
-> Daily Monitor QC 允许的 eligible core_pool
-> allow_with_degradation 中明确允许低强度使用的材料
-> watchlist / user_feedback / index_only 只能作为背景或待补证，不得支撑事实判断
```

### 4.2 Raw / Pool 使用边界

写入 Skill：

- `raw_qc_decision=allow` 才能作为事实主证据候选。
- `allow_with_degradation` 只能按 Daily Monitor QC 明确范围使用。
- `block` 不得使用。
- `index_only` 不得写成事实判断。
- AI HOT daily selected 的渠道标签不是事实证据；必须回到原文后按统一证据门槛判定。
- follow-builders / 社区材料只能证明“谁说了什么 / 社区如何反馈”，不能证明公司动作、客户采用、融资、收入或市场规模。
- failed provider text、搜索摘要、入口摘要、工具目录、官网首页和导航页不得作为事实主证据。

### 4.3 新字段纳入每日观察判断

每日观察 Skill 必须识别并使用：

```text
evidence_completeness
raw_qc_decision
degradation_reasons
pool_routes
importance_type
importance_score
extraction_method
readability_score
key_excerpts
evidence_seed
missing_information
usable_for
```

其中 `extraction_method` 和 `readability_score` 用于判断 `full_text` 是否真可读，而不是导航、登录、目录、评论加载、订阅提示或 fallback 摘要。

### 4.4 Pitch Skill 更新方向

`guanlan-daily-observation-pitch` 必须：

- 先检查 Daily Monitor QC 是否允许下游使用。
- 识别当天可用的主线材料、禁止使用材料和待补证材料。
- 从 Card / eligible core_pool 中挑选今日观察主线。
- 不用 AI HOT 热度直接决定主线。
- 不为凑热点使用 index-only 或 failed provider text。
- 输出选题时标注证据边界和不可写方向。

### 4.5 Writer Skill 更新方向

`guanlan-daily-observation` writer 必须：

- 不直接改写 Raw 摘要。
- 只把 eligible core_pool / 已通过资产卡作为事实支撑。
- 写作时区分事实、观点、反馈和判断。
- 在正文中避免暴露 Raw / Pool / gate / 字段等内部生产语言。
- 对 `allow_with_degradation` 只做弱判断，不写成强结论。
- 不把单条事实包装成趋势。
- 不把海外案例直接等同国内机会。
- 不把融资热度等同商业价值。

### 4.6 QC Skill 更新方向

`guanlan-daily-observation-qc` 必须新增检查：

- 是否读取了 Daily Monitor QC / 资产 readiness。
- 是否使用了 blocked / degraded / index-only 材料做事实。
- 是否引用了 failed provider text 或搜索摘要。
- 是否把 community/frontier opinion 写成公司事实。
- 是否忽略 `missing_information`、`degradation_reasons` 或证据边界。
- 是否把 Raw 摘要直接润色成正文。
- 是否绕过 Card / eligible core_pool 直接下结论。

## 5. 严格边界

- 本任务只更新每日观察相关 Skill。
- 不写今日观察文章。
- 不恢复 `daily-observation-writer` 自动化。
- 不运行每日监测。
- 不运行资产链。
- 不更新前台网站。
- 不推 GitHub / Netlify。
- 不新增常驻 Agent。

## 6. 验收要求

执行后必须检查：

```powershell
rg -n "raw_qc_decision|allow_with_degradation|eligible core_pool|extraction_method|readability_score|index_only|failed provider|AI HOT|follow-builders|Daily Monitor QC" C:\Users\86186\.skill-store\guanlan-daily-observation-pitch\SKILL.md C:\Users\86186\.skill-store\guanlan-daily-observation\SKILL.md C:\Users\86186\.skill-store\guanlan-daily-observation-qc\SKILL.md
```

并人工确认：

- 三个 Skill 没有互相冲突。
- 今日观察 writer 不覆盖 pitch 和 QC 职责。
- QC 不负责写稿。
- Skill 中没有要求读取已删除历史文档。
- Skill 中没有自动恢复定时任务、网站同步、GitHub 或 Netlify。
- Skill 已按 `context/06-execution-harness.md` 约束 Raw / Pool / Card 输入和下游放行边界。

## 7. Closeout

完成后写：

```text
agent-workflow/reports/WSD-20260521-daily-observation-skill-raw-pool-card-sync-closeout.md
```

closeout 必须包含：

- 修改了哪些 Skill。
- 每个 Skill 新增的 Raw / Pool / Card 适配规则。
- 是否吸收了 Card governance closeout；如果当时不存在，要写明后续需二次同步。
- 是否执行了 Daily Monitoring / Raw-Pool-Card 相关 harness 约束。
- 验证结果。
- 是否仍保持 daily-observation-writer 自动化暂停。
