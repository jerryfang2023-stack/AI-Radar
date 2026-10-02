# 每日 AI 融资监测

生效：2026-10-01。唯一运行规则为本说明与 `agent-workflow/financing/config.json`。底层独立位于 `agent-workflow/financing/`。旧综合监测器、Raw/Pool 数量配额、评分补池、历史补采任务、旧时间截止和递归修复代理不参与执行。

## 范围

覆盖国内、海外全部 AI 企业融资，包括模型、算力与基础设施、芯片、开发工具、企业与行业应用、消费应用及消费级 AI 硬件。赛道分组不是收录白名单。六类消费硬件为眼镜、随身挂件、玩具与陪伴设备、手机、耳机与录音穿戴、家庭消费设备。

排除以具身智能、机器人本体和机器人核心部件为主营业务的企业；普通 AI 企业服务机器人客户不能据此排除。分类以原文为准，疑义留待核验。暂停独立 FDE、硬件产品内容、社群与 Builders 监测，包含原独立周度任务。产品、公司、投资方查询必须绑定具体融资事件。历史事实保留查证，不再驱动当前监测规则。

## 调度与执行

- Codex 自动化 `ai` 每日北京时间 08:10，负责派发、跟进、审核、合并及本地发布。
- `funding-health-dispatch.yml` 每日 10:30 为同一融资流程的幂等兜底。
- 旧 Windows 早间生产、最终收尾及修复监测任务已删除。旧商业信号、独立国内融资、独立融资研究、健康派发和恢复看门狗工作流已删除；历史运行记录仅供追溯。
- 社群与 Builders 的代码和任务定义保留，Windows 与 GitHub 两端均禁用，等待用户后续升级；不属于融资流程，也不得自动恢复。

入口：`node agent-workflow/financing/dispatch.mjs --date=YYYY-MM-DD`。
生产：`funding-daily-pr.yml` 调用 `financing/run.mjs --phase=collect` 和 `--phase=produce`。
只看计划：`node agent-workflow/financing/run.mjs --phase=plan --date=YYYY-MM-DD`。

采集按 AIHOT 全公开窗口分页和独立国内/海外赛道查询执行，并接入 39 个媒体/公告/投资机构订阅入口及 AIHOT 精选快照与增量。39 条初始查询分别留存成功、空结果、失败状态；每轮原文尝试最多 480 条，并发 4，超出部分续跑。搜索摘要不作原文证据，抓取失败/原始日期缺失进入待核验，具身智能/机器人主营企业记录排除原因。补充订阅故障留在 `supplemental_failures` 并按域名搜索补查，不抹掉其他渠道成功结果；来源状态保存在私有证据仓 `financing-monitor-state/`，随原文备份持久化。来源清单见 `docs/financing-sources.md`。

原文先进入私有内容寻址证据库，公开仓仅存 `evidence://` 定位符。采集完成后，通过共享事实适配器生成精确引用 Claim 与融资事件，按事件二次研究，执行融资卡及融资专用分类门禁，生成融资投影并提交 PR。共享证据和发布基础能力不加载旧监测配额或评分规则。

## 检查点与发布

报告：`agent-workflow/reports/financing/YYYY-MM-DD/`。`collection.json` 保存查询覆盖、原文定位、纳入/排除/待核验；`stages.json` 保存阶段恢复；`publication.json` 记录已通过门禁的产物。已接受原文不可因下游失败重采，失败只恢复本阶段及其依赖。零融资允许有效结束，无须补入其他内容凑数。云端 `resume_run_id` 恢复带哈希的检查点，拒绝脚本、日期不符与路径穿越。

检查点基线落后于 main 时，同日原文、模型复核和融资卡按身份合并，冲突保留 main 已接受版本；已并入新卡的来源事件不得恢复成重复旧卡。同日事实与全局投影由合并后的输入重建，不能直接覆盖。人工修订原文 Claim 后须失效 facts 及其依赖检查点，再复用原文与未变更研究继续执行。外币金额保留原始币种和数量单位，包括印度卢比 crore/lakh；网页换行不得截掉 million 等数量单位。

PR/CI 合并到 main 并完成 Pages 后，运行：

`node agent-workflow/financing/publish.mjs --date=YYYY-MM-DD --runtime-dir="D:/Fang/项目/观澜AI/runtime/financing/YYYY-MM-DD"`

发布器隔离读取接受的 main，刷新数据层/知识库、独立融资站与小程序、受保护 OPS，并回读网站与小程序日期。`--dry-run=true` 只预览；门户默认为生产仓旁的 `Guanlan-Funding-Portal`，支持 `--portal-repo`。成功回执绑定接受提交，电脑离线时云端可生产，本地阶段待恢复。

`dispatched/running/ready_for_review/awaiting_portal` 均不等于发布完成。当天只维护一份知识库 `90-工作区/每日监测整合/YYYY-MM-DD-日报.md`，记录各赛道、六类硬件覆盖、待核验/排除、接口故障、工作流/PR、接受提交及线上回读。仅有可行动新增、更正、持续失败或需用户处理时通知；无变化保持安静。不提高模型预算或自动购买搜索额度。

接口与 AIHOT 边界见 [搜索链路](daily-monitor-search.md)。融资专用分类规则独立于旧平台的技术与实施标签。
