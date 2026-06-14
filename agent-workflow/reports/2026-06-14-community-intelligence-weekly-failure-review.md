# 社群情报栏目过去一周监测失败复盘

- review_date: 2026-06-14
- range: 2026-06-08 to 2026-06-14
- lane: Community Intelligence / 社群情报
- conclusion: 过去一周没有证据表明“社群信息源不足”是主因；主要问题是监督覆盖缺口、生产窗口前误报、本地登录采集与 GitHub 发布阶段混淆、以及 PR / auto-merge 分类不够清晰。

## 每日情况

| 日期 | 状态 | 阻塞细节 | 当日解决方案 | 合理性复评 |
|---|---|---|---|---|
| 2026-06-08 | 覆盖缺口 | 无社群情报 gate / supervision 记录；当天仍处于 V3.3.2 社群栏目刚接入阶段。 | 无可复现失败；后续通过 V3.3.3+ 建立独立 lane 和 supervision。 | 合理，但需要把“缺报告”与“采集失败”分开。缺报告只能说明监督覆盖不足。 |
| 2026-06-09 | 通过 | gate passed；66 items / 53 links；daily supervision 中 Community Intelligence passed。 | 本地采集、归档、门禁完成。 | 合理。当天不是失败样本。 |
| 2026-06-10 | 通过，但监督报告缺口 | gate passed；66 items / 50 links；manifest 存在；weekly health 标记 daily supervision missing。 | 社群数据链路正常，监督覆盖后续补强。 | 合理。问题是 daily supervision 覆盖，不是社群数据质量。 |
| 2026-06-11 | 通过，但监督报告缺口 | gate passed；66 items / 51 links；daily supervision missing。 | 本地采集和 gate 正常，后续通过 Hermes 三线监督固化。 | 合理。仍需把“有 gate 无 supervision”作为治理提示，而不是生产失败。 |
| 2026-06-12 | 通过 | daily supervision passed；gate passed；61 items / 57 links；PR #28 merged。 | 本地采集后 GitHub publish workflow 发布。 | 合理。没有社群 lane 阻塞。 |
| 2026-06-13 | 真实阻塞后恢复 | 10:45 supervision 看到数据日期仍为 2026-06-12、缺 2026-06-13 gate、无同日 publish run；随后本地 08:30 路径产生 61 items / 58 links，gate passed，local publish opened PR #46 and merged commit `1bdabf15`。GitHub 手动 publish run #27458272039 / #27458284960 在同日数据未就绪时失败；run #27458339678 又暴露 auto-merge 未开启分类问题。 | 先本地运行 collect / archive / assert，再通过本地 publish/PR 合并。 | 方向正确，但诊断应更细：前两次 GitHub 失败是“发布前本地数据未就绪”，第三次是“PR/auto-merge handling”，不是社群内容不足。 |
| 2026-06-14 | 窗口前误报后通过 | 03:17 supervision 误判数据仍是 2026-06-13，缺 gate；这是 08:30 本地任务前的 pre-window false positive。08:30 本地任务随后产生 61 items / 57 links，gate passed，PR #66 merged commit `9869b4e3`。后续手动收集刷新到 62 items / 63 links。 | 把社群 supervision 约束到 08:45 / 09:30 后，早于窗口的 stale data 不再作为失败。 | 合理，而且应写入 skill/eval：08:45 前除非有本地 collector failure log，否则不要创建 missing-data inbox。 |

## 阻塞模式

1. 监督覆盖缺口：2026-06-08、2026-06-10、2026-06-11 缺 daily supervision，并不等于社群采集失败。
2. 生产窗口前误报：2026-06-14 03:17 把昨日数据误判为今日失败，实际 08:30 local task 尚未运行。
3. 本地采集与 GitHub 发布混淆：Community Intelligence 依赖本地 Chrome 登录态；GitHub 只能发布已采集文件。
4. 发布阶段分类不足：同一天的 GitHub 红叉可能来自无同日数据、shell/PR 处理、auto-merge 权限或 Pages 延迟，不应统一归类为“采集失败”。
5. 周末假设不成立：2026-06-13 / 2026-06-14 都有 61+ items 和 57+ links，远高于 12 items / 3 links 下限。

## 对既有方案的复评

- 保留本地 08:30 采集是必要的，因为 scys / aipoju 等来源需要本地登录态。
- GitHub publish workflow 作为 08:45 / 10:45 发布窗口是合理的，但前提是它只发布同日已采集文件。
- Hermes 09:30 接管发布是合理的，但 08:45 前不应把 stale data 报为失败。
- 对周末降低社群 gate 没有必要；本周证据显示周末数据量充足。
- 不应通过盲目 GitHub rerun 修复本地采集缺口；如果本地文件缺失，GitHub rerun 只会制造更多失败记录。

## 优化后的监测路径

```text
08:30 local task
  -> collect logged-in community sources
  -> archive daily/community views
  -> assert community data
  -> local publish handoff

08:45 Hermes local-output check
  -> if same-date data missing: local collection repair
  -> if gate failed: data/archive repair

09:30 Hermes publish check
  -> if local data exists but no PR/main update: dispatch GitHub publish
  -> if publish run failed: classify as shell / PR / auto-merge / Pages

09:45 / 09:55 recheck
  -> wait for queued/in_progress
  -> stop after bounded attempts and write exact inbox

10:50 publication check
  -> PR merged and Pages deployed, or report waiting/manual PR action
```

## 写入 Skill 的改动

- Added `pre_window_false_positive_guard` eval.
- Added `failure_stage_router` eval.
- Added `weekend_volume_not_assumed` eval.
- Added a `Failure Router` section to the Community Intelligence monitor skill.
- Added `good-community-failure-router.md` example.
- Added durable memory for the 2026-06-14 pre-window false positive and weekend-volume finding.

## 建议

1. 以后社群情报红灯先问“现在是否已过 08:45/09:30 窗口”。
2. 过了窗口仍失败，再按 local collection / gate / publish / PR / Pages 分流。
3. 只有 local collector log 指向 Chrome/CDP/login 才升级给用户处理登录态。
4. 周末不降社群 gate；先看实际 item/link 数。
5. 如果发布 workflow 红了但本地 gate 已通过，优先修 PR/auto-merge/Pages，而不是重跑采集。
