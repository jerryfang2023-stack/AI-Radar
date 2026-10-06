# 每日 AI 融资监测

生效：2026-10-01。唯一运行规则为本说明与 `agent-workflow/financing/config.json`。底层独立位于 `agent-workflow/financing/`。旧综合监测器、Raw/Pool 数量配额、评分补池、历史补采任务、旧时间截止和递归修复代理不参与执行。

## 范围

覆盖国内、海外全部 AI 企业融资，包括模型、算力与基础设施、芯片、开发工具、企业与行业应用、消费应用及消费级 AI 硬件。赛道分组不是收录白名单。六类消费硬件为眼镜、随身挂件、玩具与陪伴设备、手机、耳机与录音穿戴、家庭消费设备。

排除以具身智能、机器人本体和机器人核心部件为主营业务的企业；普通 AI 企业服务机器人客户不能据此排除。分类以原文为准，疑义留待核验。暂停独立 FDE、硬件产品内容、社群与 Builders 监测，包含原独立周度任务。产品、公司、投资方查询必须绑定具体融资事件。历史事实保留查证，不再驱动当前监测规则。

## 调度与执行

- Codex 自动化 `ai` 每日北京时间 08:10，负责派发、跟进、审核、合并及本地发布。
- `funding-health-dispatch.yml` 每日 10:30 为同一融资流程的幂等兜底。
- 2026-10-03 起另部署 VPS 备用版本，初始仅观察状态；本机 `ai` 保持启用，真实日批次验收后再切主。部署、模型和回退入口见 [VPS 备用版本](financing-vps.md)。
- 云端生产工作流在精确提交的 Linux/Windows 检查通过后保留开放 PR，由 Codex 审核并合并；兜底发现同日开放 PR 时核对该提交的 CI，分别报告检查中、CI 失败或待审核，不重复派发。
- 旧 Windows 早间生产、最终收尾及修复监测任务已删除。旧商业信号、独立国内融资、独立融资研究、健康派发和恢复看门狗工作流已删除；历史运行记录仅供追溯。
- 社群与 Builders 的代码和任务定义保留，Windows 与 GitHub 两端均禁用，等待用户后续升级；不属于融资流程，也不得自动恢复。

入口：`node agent-workflow/financing/dispatch.mjs --date=YYYY-MM-DD`。
生产：`funding-daily-pr.yml` 调用 `financing/run.mjs --phase=collect`、`--phase=verify` 和 `--phase=produce`。
只看计划：`node agent-workflow/financing/run.mjs --phase=plan --date=YYYY-MM-DD`。

采集按 AIHOT 全公开窗口分页和独立国内/海外赛道查询执行，并接入 39 个媒体/公告/投资机构订阅入口及 AIHOT 精选快照与增量。39 条初始查询分别留存成功、空结果、失败状态；每轮原文尝试最多 480 条，并发 4，超出部分续跑。搜索摘要不作原文证据，抓取失败/原始日期缺失进入待核验。具身智能/机器人主营关键词只触发待核验，由责任 agent 根据原文确认排除；服务机器人客户的普通 AI 企业不得被关键词排除。补充订阅故障留在 `supplemental_failures` 并按域名搜索补查，不抹掉其他渠道成功结果；来源状态保存在私有证据仓 `financing-monitor-state/`，随原文备份持久化。来源清单见 `docs/financing-sources.md`。

原文先进入私有内容寻址证据库，公开仓仅存 `evidence://` 定位符。采集完成后，通过共享事实适配器生成精确引用 Claim 与融资事件，按事件二次研究，执行融资卡及融资专用分类门禁，生成融资投影并提交 PR。共享证据和发布基础能力不加载旧监测配额或评分规则。

## 检查点与发布

报告：`agent-workflow/reports/financing/YYYY-MM-DD/`。`collection.json` 保存查询覆盖、原文定位、纳入/排除/待核验；`stages.json` 保存阶段恢复；`publication.json` 记录已通过门禁的产物。已接受原文不可因下游失败重采，失败只恢复本阶段及其依赖。零融资允许有效结束，无须补入其他内容凑数。云端 `resume_run_id` 恢复带哈希的检查点，拒绝脚本、日期不符与路径穿越。

检查点基线落后于 main 时，同日原文、模型复核和融资卡按身份合并，冲突保留 main 已接受版本；已并入新卡的来源事件不得恢复成重复旧卡。同日事实与全局投影由合并后的输入重建，不能直接覆盖。原文 Claim 的人工修订写入同日 `model-assist-v1/YYYY-MM-DD.json` 的审核候选；该文件变更会使 facts 及依赖检查点失效，再复用已接受原文继续执行。生成的 `claims.json` 是投影，不作为修订入口。外币金额保留原始币种和数量单位，包括印度卢比 crore/lakh；网页换行不得截掉 million 等数量单位。

PR/CI 合并到 main 并完成 Pages 后，运行：

`node agent-workflow/financing/publish.mjs --date=YYYY-MM-DD --runtime-dir="D:/Fang/项目/观澜AI/runtime/financing/YYYY-MM-DD"`

发布器隔离读取接受的 main，刷新数据层/知识库、独立融资站与小程序、受保护 OPS，并回读网站与小程序日期。`--dry-run=true` 只预览；门户默认为生产仓旁的 `Guanlan-Funding-Portal`，支持 `--portal-repo`。成功回执绑定接受提交，电脑离线时云端可生产，本地阶段待恢复。

`dispatched/running/checks_pending/ci_failed/ready_for_review/awaiting_portal` 均不等于发布完成。当天只维护一份知识库 `90-工作区/每日监测整合/YYYY-MM-DD-日报.md`，记录各赛道、六类硬件覆盖、待核验/排除、接口故障、工作流/PR、接受提交及线上回读。仅有可行动新增、更正、持续失败或需用户处理时通知；无变化保持安静。不提高模型预算或自动购买搜索额度。

接口与 AIHOT 边界见 [搜索链路](daily-monitor-search.md)。融资专用分类规则独立于旧平台的技术与实施标签。

## 融资主体卡与轮次

前台每个已核验融资主体仅展示一张卡，主信息采用最新已接受轮次，卡内保存历次融资。`catalog.mjs` 通过 `subjects.mjs` 生成主体 `cards` 与独立统计 `event_cards`；资本流向必须使用后者。主体身份优先使用已审核 `application_entity_id`，不按失配的历史 canonical ID 或名称相似度自动合并。简称、跨编号主体别名、同轮重复披露与产品别名由 `funding-insights/card-review.json` 保存核验依据。旧卡链接和无歧义主体旧编号映射到当前主体；不同币种不相加，累计总额及拟融资不能当作新轮次。详见 [本次复查](2026-10-02-financing-card-review.md)。

## 监测后待核验线索

生产顺序为 `collect → verify → produce`。`verify` 只接收已接受的 `collection.json` 中待核验条目，写独立 `verification.json`；不修改采集回执，不重新执行发现查询。直接调用 `--phase=produce` 或 `all` 也会先执行幂等核验准备，不能跳过。

- 已捕获但 AI 主营范围不明的原文保留在私有库，核验复用其哈希；缺失原文最多补取同一 URL 一次。补取与当前采集共享 480 次上限、并发 4，并复用原文阅读器每天 20 次的私有回执。没有额外检索、独立模型调用或预算上调。额度耗尽、缺日期、无法读取及未知中断均保留具体原因；不自动递归找替代网页。
- 补取前先落私有尝试回执，跨恢复/跨日期不自动重复同一失败 URL。已完成补取或已知私有原文按哈希复用；同 URL 原文哈希未变化时不重复提取。中断发生在原文入库和公开回执之间时，保守保留未知结果，人工确认私有存证后恢复，不能直接清空付费回执。
- 结构可用且日期符合采集窗口的原文写入既有 `FINANCING-SUPPLEMENT-1`，合并原 supplement，不代表融资或精选获批。`produce` 沿用原有 Claim/实体审核、融资研究、分类与发布门禁，核对企业身份、AI 相关性、日期、本轮金额/币种、轮次及同轮去重。累计融资额不替代本轮金额；事实/研究失败只恢复该阶段。提取范围改变会使相关阶段检查点失效。
- 正常门禁全部完成后，账本以来源哈希、Raw/Event/Card 身份关联逐条结果，并引用 QA/研究中的缺证原因。`publication.json.verification.counts` 是后置核验结果；原 `counts` 仍是不可变采集计数。`completed` 只表示本次受限核验已执行，`pending` 仍需新证据或责任人复核，不代表融资已核验通过、PR 已审核或产品已发布。
- 复用责任审核账本 `lead-review.json`（`FINANCING-LEAD-REVIEW-1`）；PR #1191 的 `pending247-review.json` 为兼容输入。2026-10-06 的 247 条不得全量重做：208 条已有处置、7 条原文已补入既有门禁链、32 条仍需补证。原处置按来源保存，不把线索分流判定升级成已核验融资。审核账本更新可在恢复时重新对账。
- 原始 `pending_verification` 没有后置核验完成回执时，派发器返回 `verification_required`，VPS 提示 `needs_attention`，不得当作已完成，也不得因此重采。恢复接受的同日检查点后执行 `--phase=produce`。完成受限核验后仍待补证的批次可以停在明确的待核验状态，防止看门狗无限重试。

核验原文与私有尝试回执在生产前持久化；公开账本、supplement、intake 跟随现有哈希检查点和数据 PR。此能力须代码/工作流进入 `main` 后生效，不新增每日调度；VPS 是否 active 以服务器配置为准，本变更不切换主控。发布前运行 `npm run test:financing-monitor`，其中 DuckDB CLI 使用生产代码检查工作流的固定版本与校验值。历史存量需显式恢复同日接受产物；不会自动遍历并重做所有旧批次。
