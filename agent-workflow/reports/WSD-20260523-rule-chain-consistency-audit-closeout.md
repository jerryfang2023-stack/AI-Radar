# WSD-20260523-rule-chain-consistency-audit Closeout

生成时间：2026-05-23
状态：accepted
范围：观点卡、商业信号卡生成规则、Raw / Pool 规则、今日观察三个写作 Skill、Tags 体系、相关质量门

## 1. 核对结论

今日规则链路已经统一到当前口径：

- 商业信号卡：eligible `core_pool` + `raw_qc_decision=allow` 默认全部生成正式前台 `signal_card`，不再用单日卡片数量、人工精选名额或 selected change cards 挡在前台之外。
- 观点卡：follow-builders 先进入 `opinion_intake`，入库保留原文 / 原文摘录、中文翻译、来源和 `formal_tags`；完成四档评级后，只有 `feature` / `sidebar` 能升级为正式 `opinion_card`。
- Raw / Pool：每日监测只负责 Raw、Pool、follow-builders intake、日志和 QC；不直接生成正式信号卡、今日观察正文或前台同步。
- 今日观察三 Skill：Pitch 只做主编选题，Writer 只写一件最有商业冲突的对象，QC 只做可读性和前台表达检查，不把证据链 checklist 当文章主评分轴。
- Tags：正式资产 `signal_card` / `opinion_card` 已要求 `formal_tags`，`check-tags` 中未知 tag、site taxonomy 漂移和缺 `formal_tags` 均为 0。

## 2. 清理的问题

1. 清理趋势 / 变化链路中的历史硬条件：
   - 删除“反证”作为硬必填条件的残留。
   - 删除 `7 / 30 / 90` 作为趋势报告硬时间窗口的残留。
   - 统一改成“风险边界、信息缺口或后续观察变量”。

2. 修正 `v2-content-gate` 的旧口径：
   - 不再把 `selected-change-cards 3-8 张` 当成前台商业信号门槛。
   - 改为检查正式 `signal_card`。
   - 变化候选改为“有则检查质量，无则不阻塞”，符合当前商业信号 / 前沿观点优先的阶段模型。

3. 修正每日日志字段：
   - 补齐 2026-05-23 `front_signal_sab_source_count: S=1; A=1; B=9; total=11`。
   - 资产生成脚本后续会自动回写该字段，避免日志字段再次缺失。

4. 清理前台历史残留：
   - 人物详情页观点时间轴不再渲染“观澜点评”模块。

## 3. 验证

- `check-tags`：passed
  - hardcoded unknown tags：0
  - Markdown formal_tags unknown tags：0
  - site-content tags unknown：0
  - 缺 formal_tags 的正式资产：0
- `quality-gates tags`：passed
- `quality-gates syntax --date=2026-05-23`：passed
- `card-copy-style-gate --date=2026-05-23 --require-gates=true`：passed，51 files，0 issues
- `quality-gates v2content --date=2026-05-23`：passed
- `git diff --check`：passed

## 4. 后续执行边界

- 后续如果不希望某条商业信号进入前台，应回到 Raw-to-Pool 修正其 `core_pool` 资格，不应在卡片生成阶段静默过滤。
- 后续趋势报告仍需要写清风险边界、信息缺口和后续变量，但不再要求固定 `7 / 30 / 90` 时间窗口，也不要求必须写“反证”。
- 观点卡是否进入前台只能看四档评级、翻译状态和发布状态，不能用 tags、人物热度或主题命中替代。
- Tags 只能从正式 taxonomy 归并；无法确定时写 `needs_tag_review` 到报告，不编造新 tag。
