# 每日监测持续失败：执行链审计与修复

## 基线与范围

- 基线：`63a959abfbd27b6c32744a8c45dfa679a3f0cd9d`，隔离分支 `fix/daily-reliability-audit-20260913`。
- 范围：四个 Windows 生产任务、商业信号/中国融资/融资应用/一线观点/社群的执行入口、Skill、证据与发布门禁、失败恢复和最终闭环。
- 方法：当前合同与可达代码核对；GitHub 运行记录；代表性完整日志；本机历史闭环/Vault 回执；确定性回归；真实 Codex 模型测试。没有重新采集、补造事实或降低原文/翻译/融资门槛。
- 本地主工作区的 OPS 开发修改不属于本次补丁，未清理、覆盖或提交。

## 历史事实（2026-08-17 至 2026-09-13 审计时点）

商业信号共 61 次运行：21 成功、38 失败、2 取消。失败不是每天都发生在采集阶段，也不是一个模型问题。

| GitHub 首个失败步骤标签 | 失败运行数 |
|---|---:|
| Syntax checks（其中包含业务数据测试，不只是语法） | 6 |
| 恢复已接受 source intake | 2 |
| 私有原文持久化/公开边界 | 2 |
| 必需原文标题翻译 | 11 |
| 自动合并 | 3 |
| 最终 Business signals PR result | 14 |

最后 14 项是汇总标签，**不是根因分类**：`continue-on-error` 会让更早的失败步骤在 API 中显示 success，必须读 outcome 和原始日志。

同期一线 RSS 工作流 27/27 成功；融资应用 89 次包含 29 成功、41 skipped、18 失败、1 取消。独立社群 GitHub 工作流无运行不能推断社群未采集，其当前采集归属本机登录态链。Pages 仅取最近 200 条，不作为全区间总数。

## 已有修复的历史根因：不重复改写

1. **门禁越界扫描。** 8 月 17 日 Vault 回执把个人工作区 `node_modules` 的 README 示例认作坏 Wiki 链接；9 月 4 日又被个人 PDF 引用和旧目录拖累。这是本地投影闭环失败，不是融资采集失败。当前 `assert-guanlan-vault.mjs` 已跳过依赖目录并隔离 `90-工作区` 的正文规则（`e70aa1c453` 等已有修复）。
2. **翻译数值保护/单位归一化不足。** 8 月 25 日倍数、8 月 28 日连字符金额、9 月 9 日印度 crore/卢比标题失败；后者在运行 `34309251252` 中明确为两条必需事件标题未解决。已有金额保护、等值验证及 Flash→Pro 修复（`e3aa53a542`、`61e0f1889e`、`acf00c8bdc`、`88c6e0cdaa`）。重跑整轮来源无助于这类失败。
3. **恢复误判/证据身份冲突。** 8 月 20 日 `32322295176` 把已恢复来源的 skipped 当作不可复用；9 月 8 日 `34172530345` 被 content_hash collision 拦截。复用已恢复且私有归档成功的检查点、保留完整原文及日期/URL/标题身份，已有对应代码和回归。冲突必须保留诊断，不能覆盖原文消除红灯。
4. **版本与测试不同步。** 8 月 19 日测试卡在未登记英文描述；9 月 13 日 `34727353617` 的采集、私有证据、V4 完整性均成功，失败在人物/社群/共享发布锁等旧前台断言。当天已有 PR #898/#901 修复并恢复发布。
5. **发布竞争和本机环境。** 多条任务写同一投影、排队后仍检出旧 SHA、Portal 脏工作区、Git TLS 连接失败分别造成冲突或闭环失败。共享发布锁、获取锁后检出最新分支、独立发布回执和网络预检属于已有修复；不能归因于 GPT-6。

日志样本与运行清单保存在项目外 `runtime/audit-reliability-20260913/`，不提交本地路径、完整日志或凭据到公开仓。

## 本次确认并修复的缺陷

| 编号 / 严重度 / 置信度 | 最早责任点与补丁 | 验证 |
|---|---|---|
| R1 / P1 / confirmed | `run-business-signals-health-dispatch.mjs::v4Assets` 和工作流 `existing-assets` 只看共享的同日 V4。新增共享 `isBusinessSignalsProductionReady`，须有同日 general Business Signals 的监测/恢复、intake 和 factual build/gate/materialize 回执。中国专线先发布不能跳过总链。 | 空、错误 lane、旧日期、部分失败均拒绝；success/restored 均接受；当天回执通过。潜在跳过已复现，未把它推定为全部历史失败原因。 |
| R2 / P1 / confirmed | `classify-business-signals-production-state.mjs` 未接收私有归档、model rebuild、标题修复结果，导致标题失败被报成后续完整性门禁 skipped。工作流显式传参，分类器按执行顺序报告首个失败拥有者。 | 标题失败→source_title_translation；原文归档失败→private_evidence；模型重建失败→model_rebuild；合法跳过模型辅助不阻塞。 |
| R3 / P2 / confirmed | `run-daily-automation-controller.mjs::finalClosure` 把旧 JSON 的存在当作本次监督完成。改为校验生产日期、结构、当前命令起止时间和退出状态。 | 旧报告、未来报告、running、超时/中断拒绝；新生成的失败报告可记录 lane findings，而不是伪装全链健康。 |
| R4 / P1 / confirmed | `firstLineRecovery` 只读本地 RSS 快照，可能因本地落后或草稿误报。显式刷新 main，`assert-follow-builders-data.mjs --source-ref=origin/main` 钉住 SHA 读取。 | 隔离 Git 仓中已提交正确快照/本地损坏草稿：接受远端、保留草稿；无效 ref 拒绝；当天已接受快照门禁通过。 |
| R5 / P1 / confirmed | 五条每日 PR 发布流程可立即合并，主分支没有保护。`wait-for-production-code-checks.mjs` 要求当前 SHA 的 Ubuntu/Windows 两项 GitHub Actions 检查成功，并把 SHA 传给 `--match-head-commit`。 | 空、旧 SHA、伪同名 app、失败/取消/skipped、重跑未完均拒绝；两平台成功允许。15 分钟有界等待，失败保留 PR/上游产物，不重新采集。已有 `34732245131` 是 failure 且 jobs 为空，不能当绿灯。 |
| R6 / P2 / confirmed | Daily Monitor Skill 禁止整个 `01-raw`，与当前临时 originals/source-index 采集路径冲突。v1.3.1 明确只禁旧 Raw/Pool Markdown，仍要求私有持久化及发布前移除公开正文。 | 增加临时采集边界、lane 身份 eval 和好例；同步仓内 runtime、登记与版本门禁，未改用户级兼容镜像。 |

## 模型适配和验证边界

缺陷定位（本补丁）：R1 `agent-workflow/tools/run-business-signals-health-dispatch.mjs:81`、`agent-workflow/tools/lib/daily-production-chain-state.mjs:3`；R2 `agent-workflow/tools/classify-business-signals-production-state.mjs:30`；R3 `agent-workflow/tools/run-daily-automation-controller.mjs:387`；R4 同文件 `:182` 和 `agent-workflow/tools/assert-follow-builders-data.mjs:35`；R5 `agent-workflow/tools/wait-for-production-code-checks.mjs:7` 及五个工作流的 merge step；R6 `agent-workflow/skills/guanlan-daily-monitor/SKILL.md:63`。

- GPT-6 Astra/high 真实执行于 2026-09-13：24/24 场景判断、24/24 精确证据引用，总分 48/48，137.6 秒。见 `model-routing-eval-latest.json` 和 `.md`。此前 23-case 报告不再被当作当前 24-case 覆盖。
- 24 个治理 Skill 的静态验证与仓内镜像同步通过；模型评分器测试 7 项通过。Skill discovery 仪表盘重建到运行时，未用本机安装清单改写公开站点。
- 新增执行边界及已有金额回归 45 项通过；一线监督测试 9 项通过；OPS/恢复测试、Skill Ops 测试通过。当前标题完整性覆盖 114 个日期、3,938 条关联原文、3,757 条事件，零违规。
- 版本、V3 退休、生产策略、Harness 结构门禁通过。隔离 worktree 的 Harness 外部项目路径不可用仅为环境诊断，不是所有外部项目已验收。
- PR 必须再取得 exact-head Windows/Linux CI，通过后才合并。实际下一轮定时任务和供应商/登录态可用性不能由离线测试保证。

## 尚不能推断的事项

- GPT-6 规则路由通过不等于 DeepSeek 生产翻译、浏览器登录、GitHub runner、TLS 或 VPS 永不失败。
- 本次没有重采今日已接受原文、重生成融资卡、重部署无变化的小程序数据，也没有把过去全部失败都归到新发现的六项。
- Final Closure 的本机 data-lake 是可重建且 Git 忽略的查询缓存；仍从本地主检出读取，存在与最新 main 不一致的风险。本次未观察到它导致网站或小程序发布失败，列为 `needs-runtime-proof`，不修改缓存存储架构。
- 分支保护未做远端配置变更；本次 guard 覆盖五条每日云端 PR 自动合并，不声称阻止拥有写权限的人工合并或所有历史工具绕过检查。
