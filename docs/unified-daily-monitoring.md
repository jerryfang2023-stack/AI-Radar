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

2026-10-07 起按 [并发发布与二次复核 Harness](../agent-workflow/harness/publication-concurrency-and-review.md) 执行。首次采集后对待核验原文补查；每条独立提供 4 组搜索、12 次提供方请求和 6 次原文尝试，单轮原文补查上限 480 次，余项按 `recheck_summary.continuation_required` 续跑。已形成事件的二次研究每事件保留 48 次搜索请求、24 次原文尝试和两次最多 16,000 tokens 的模型输出机会。搜索摘要仍只是线索，原文补获须再过语义复核和事实门禁。新额度复用已配置服务，不自动购买或开通套餐。

续跑待核验来源：`node agent-workflow/financing/run.mjs --phase=recheck --date=YYYY-MM-DD`。该入口不重新发现全批线索，不重采已接受原文；新增原文按来源追加，后续 `--phase=produce` 只重建受影响事实与投影。逐条回执位于 `collection.json` 的 `rechecks`；`awaiting_agent_review` 不等于已核验。历史回执缺少标题时先补来源上下文再判断。

报告：`agent-workflow/reports/financing/YYYY-MM-DD/`。`collection.json` 保存查询覆盖、原文定位、纳入/排除/待核验；`stages.json` 保存阶段恢复；`publication.json` 记录已通过门禁的产物。已接受原文不可因下游失败重采，失败只恢复本阶段及其依赖。零融资允许有效结束，无须补入其他内容凑数。云端 `resume_run_id` 恢复带哈希的检查点，拒绝脚本、日期不符与路径穿越。

检查点基线落后于 main 时，同日原文、模型复核和融资卡按身份合并，冲突保留 main 已接受版本；已并入新卡的来源事件不得恢复成重复旧卡。同日事实与全局投影由合并后的输入重建，不能直接覆盖。原文 Claim 的人工修订写入同日 `model-assist-v1/YYYY-MM-DD.json` 的审核候选；该文件变更会使 facts 及依赖检查点失效，再复用已接受原文继续执行。生成的 `claims.json` 是投影，不作为修订入口。外币金额保留原始币种和数量单位，包括印度卢比 crore/lakh；网页换行不得截掉 million 等数量单位。

PR/CI 合并到 main 并完成 Pages 后，运行：

`node agent-workflow/financing/publish.mjs --date=YYYY-MM-DD --runtime-dir="D:/Fang/项目/观澜AI/runtime/financing/YYYY-MM-DD"`

发布器隔离读取接受的 main，刷新数据层/知识库、独立融资站与小程序、受保护 OPS，并回读网站与小程序日期。`--dry-run=true` 只预览；门户默认为生产仓旁的 `Guanlan-Funding-Portal`，支持 `--portal-repo`。成功回执绑定接受提交，电脑离线时云端可生产，本地阶段待恢复。

可用 `--source-sha=<完整提交>` 显式绑定接受版本。三个独立本地目标（数据层、读取模型、Vault）并行刷新；门户和 OPS 顺序发布。锁按目标跨日期共用，忙时立即返回并保留成功检查点；远端前进不会更换本轮原文和发布输入。门户默认在独立检出中构建、提交和发布，失败检出保留供恢复。检查点按相关输入和发布实现建键，无关提交不重跑成功阶段；每阶段记录实际耗时。Pages 完成正在进行的构建并复用 npm 缓存，切换前拒绝落后的 artifact。

`dispatched/running/checks_pending/ci_failed/ready_for_review/awaiting_portal` 均不等于发布完成。当天只维护一份知识库 `90-工作区/每日监测整合/YYYY-MM-DD-日报.md`，记录各赛道、六类硬件覆盖、待核验/排除、接口故障、工作流/PR、接受提交及线上回读。仅有可行动新增、更正、持续失败或需用户处理时通知；无变化保持安静。二次复核采用已授权的独立额度；不自动购买搜索额度或升级套餐。

接口与 AIHOT 边界见 [搜索链路](daily-monitor-search.md)。融资专用分类规则独立于旧平台的技术与实施标签。

## 融资主体卡与轮次

前台每个已核验融资主体仅展示一张卡，主信息采用最新已接受轮次，卡内保存历次融资。`catalog.mjs` 通过 `subjects.mjs` 生成主体 `cards` 与独立统计 `event_cards`；资本流向必须使用后者。主体身份优先使用已审核 `application_entity_id`，不按失配的历史 canonical ID 或名称相似度自动合并。简称、跨编号主体别名、同轮重复披露与产品别名由 `funding-insights/card-review.json` 保存核验依据。旧卡链接和无歧义主体旧编号映射到当前主体；不同币种不相加，累计总额及拟融资不能当作新轮次。详见 [本次复查](2026-10-02-financing-card-review.md)。

## 监测后待核验线索

历史处置通过 `verification-dispositions.mjs` 在网络操作前核对：只继承最近七天责任账本中同一URL、同一当前正文hash的明确来源排除，并验证私有原文可解析。当前抓取没有hash不代表内容未变，不借用旧队列hash直接排除；较新的pending审核、私有状态或证据冲突优先保留。`accepted_original`仅代表原文准入，同企业/重复事件断言仍须融资与去重门禁，不作为自动关闭依据。

`FINANCING-DISPOSITION-REVIEW-1` 的 `disposition-review.json` 保存责任人、时间、来源hash和逐字短引；它只处置对应来源，不批准融资、精选或实体合并。`event_not_ai_relevant`等可选QA提示不能单独关闭队列。`already_covered` 必须附 `event_binding`，指向当前已发布事件卡，并匹配公司、公告日期和轮次；同轮金额换币种时在审核理由中说明对应关系。人工确认排除须有可核查原文；截断或身份不明的证据仍待补。恢复时重新校验处置依据，不能让旧账本盖过更新的保留结论。

既有队列修复可先只读调用 `reconcileDispositions` 生成逐条计划；经审核后在既有写入锁内以 `expectedQueueHash` 应用。只删除通过来源校验的条目，不重采、不调用模型、不改尝试次数，其余队列逐项保持不变。私有 `verification-reconciliations/` 写入准备/应用回执及前后hash；队列变化必须重新规划，禁止把旧快照推回主分支。历史公开生产回执表示当时的结果，当前积压以最新私有队列及后续对账回执为准。

每日480次原文尝试内，为到期队列最多预留32次（不增加预算），按最早入队日期优先核验。采集因预留未抓取的新线索明确记录 `attempted:false`，进入同一后续队列；未使用的预留可在核验阶段供新线索使用。采集调用前预写尝试回执，中断未知结果不得自动重抓。当天采集已接受或排除的旧队列URL也必须对账：排除保存原日期和原因，接受原文仍进入事实与研究门禁；新的责任审核结论优先。

生产顺序为 `collect → verify → 私有证据持久化 → produce`。`verify` 接收已接受采集中的待核验条目，并消费私有 `financing-monitor-state/verification-queue.json` 中到期的后续任务；不重新执行发现查询、不改 collection。直接调用 `--phase=produce` 或 `all` 也先做幂等准备。

核验先复用有哈希的原文及责任复核记录。已完成处置保持不变；历史 `pending247-review.json`／通用 `lead-review.json` 的 pending 不是完成依据，必须进入实际后续流程。PR1191 的存量私有抓取可按来源、正文哈希、文章结构和日期重新检查后送入事实链，不能仅因有 content_hash 就当合格原文。

缺少可用原文时，优先尝试责任审核记录提供的原始替代来源；否则使用原融资标题作一次精确搜索，只获取候选URL，之后必须捕获原文。搜索摘要不作事实证据。替代原文先保留在私有证据库并进入needs_attention；必须由责任人核对主体和轮次，在lead-review条目提供source_binding（source_url、reviewed_by、reviewed_at、reason），才可送入supplement和事实链。不能仅因标题相似或替代页面有融资内容就生成无关新增卡。

预算不变：补取和当日采集、已知私有补录尝试共同占用480次上限，并发4；原文阅读器沿用每日20次回执。后续搜索按已有采集请求量扣减160次采集搜索上限，每条精确查询最多使用一个提供商请求，预写私有请求回执；不配置新凭据。已有融资研究链的120次搜索上限独立保留，不宣称这两条原有链共用160次总额。2026-10-06的已知补录尝试必须计入，不能只以collection的439条推断尚有41条额度。

结构和日期合格原文写入既有 `FINANCING-SUPPLEMENT-1` 并合并原 supplement。`produce` 复用现有 Claim/实体处理、融资研究、分类与发布门禁，核对企业身份、AI主营、日期、本轮金额/币种、轮次和同轮去重。累计金额不作本轮金额回退值；合法未披露与字段已确认不是同一含义。核验准备、取得原文、事实门禁通过和发布完成分别记录。

`verification.json` 保存逐条状态、来源、原始及最新原因、QA/融资事件/卡片引用和后续处理字段。`publication.json.verification.counts` 为核验后计数，原counts保持不可变采集统计。缺原文或日期、主体冲突、研究或分类待审均保留原因；单条缺少私有对象不应使整日监测失败。

后续任务只由既有每日verify阶段消费，不新增定时任务。每条最多两轮实际处理，未用到网络/事实链的纯预算延期不消耗处理轮次；下一次到期为次日，最长七天。达到轮次上限或期限进入 `needs_attention`，责任人为 `responsible_financing_reviewer`，下一步明确为补充新原文与责任审核。新责任审核证据可重新激活对应条目，但不能清空既有付费请求回执。当天未知搜索/原文尝试不自动重试；私有已完成抓取可以恢复丢失的公开检查点。此处completed只表示本次有界核验已结束，不能解释为pending已解决。

旧 `pending_verification` 缺少后置回执时返回 `verification_required`，VPS记录needs_attention并要求恢复接受检查点，不能把它当完成或据此重采。旧ready_for_review/已发布批次不自动重做；存量迁移应显式恢复该日接受产物。生产回执和私有队列随已有证据持久化/哈希检查点发布，故须工作流进入main后才生效。VPS主控仍以真实配置为准，本改动不切换模式。

发布验证包括 `npm run test:financing-monitor` 和现有跨平台生产CI。真实日批次还应检查有界队列是否持久化、到期条目是否消费、每项缺证原因、门禁和网站/小程序回读；离线账本重放不替代真实模型或线上验收。

中断跨日恢复以 `fact_review_completed` 判定事实阶段是否已执行，不能用已有 raw_ids 推断完成；只有完成门禁对账且对应 Raw 已进入事实产物才标记。只完成核验准备的原文次日从私有证据恢复，沿用来源关联审核，不再补搜或重复增加处理轮次；七天期限仍有效。
