# 每日融资监测云端主运行

2026-10-12：GitHub Actions 负责采集、核验和生产；VPS 负责每日派发、受限 Hermes 审核、CI 接续、合并及发布。本机版本保留为可恢复备用，正常日运行不依赖电脑开机。此文补充 [统一监测规则](unified-daily-monitoring.md)，不恢复任何已暂停的社群、Builders 或旧周度生产任务。

## 当前调度

- 本机 Codex 自动化 `ai` 保留配置并暂停，作为人工恢复入口。原 runner、SSH 入口和本机知识库保留；VPS 的 Vault 更新不会自动写入关机电脑。
- VPS `guanlan-financing.timer` 每十分钟检查一次，`Persistent=true`；每日 08:10 前不启动新的日期，已有未完成日期可恢复。
- `/etc/guanlan-financing/runtime.env` 配置 `GUANLAN_VPS_MODE=active`。`standby` 可用于回退，仅调用融资派发器的 `--dry-run=true`，保存观察回执。
- `active` 模式复用同一 GitHub 融资生产工作流及恢复检查点，Hermes 审核开放的融资 PR，检查精确提交与 CI 后合并，再等 Pages 和 VPS 发布。模型 API ID 固定 `deepseek-flash`（DeepSeek V4.1 Flash）。每日期最多三次不同提交/基线的模型审核；失败或中断记录为未知，不自动重复付费。
- `funding-health-dispatch.yml` 每日 08:10 云端主触发与 10:30 幂等兜底保留；VPS 同样在 08:10 后派发，两端先查同日接受结果、开放 PR 和在途运行，复用同一工作流。每天只做一次正式发现；十分钟轮询是恢复检查，不是额外复核时段。

## 故障接续

2026-10-15 起，研究阶段仅对 `research_sources_insufficient` / `research_independent_sources_insufficient` 且没有已有卡片的新融资生成 `FINANCING-RESEARCH-DEFERRAL-1` 回执。回执绑定事件、Claims、原文 URL/ID/hash，保存在研究 queue 的 deferral 字段；断言重算绑定，过期、无证据、已有卡片或其他错误仍失败。暂缓事件不进入公开目录，发布收尾把其原文注册进私有复核队列，下一次日运行复用原文补证；不得计作批准或关闭。人工 hold 仍由责任人维护。VPS 最终审核须核对暂缓绑定与队列保留，合格卡片可同批发布。

DeepSeek 网络超时及 408/429/5xx 有界重试，认证错误直接保留失败。模型辅助结果每完成一项即原子保存，标题翻译每通过一项即保存，恢复仅请求缺失任务；持续失败不降级为事实批准。生产阶段把当前模型/翻译失败明细写入当日 `facts-failure.json` 等 metadata 检查点，不上传原文日志。GitHub GET/list/view 查询对临时网络或限流错误重试并保留 HTTP 类型和次数，审批、合并与派发写操作不自动重放。

私有原文仓库仍须同时通过匿名不可见、认证 Git 可访问和本地/远端 HEAD 一致检查。匿名 API 的 403、429、5xx 或网络错误会有限重试，再检查匿名仓库页面；只有明确的 404 才证明该匿名入口不可见，403 本身不能通过隐私检查。持续不可核验仍停止并保留诊断。

派发器读取 main 接受回执时，仅明确的 HTTP 404 表示回执尚不存在。限流、认证失败、超时和服务错误停止本次派发，不能被当作“尚未采集”而重跑发现。

控制器每次先检查同日开放 PR，再采用已有发布回执。`checks_pending` 可先执行一次受限原文审核，随后复用绑定 head/base 的审核，等待 CI 或处理其审批；没有通过审核和两平台 CI 不能合并。目录 hash 和审核 diff 采用流式处理，避免数据增长触及子进程 32 MiB 输出上限。发布锁忙返回 `awaiting_portal/publisher_busy`，下一次轮询接续；成功回执清除当前错误标记，历史错误文件仍保留。

AIHOT 全公开分页和精选同步对网络/正文超时、429、5xx 作最多四次有间隔重试，每次使用新超时信号；4xx、JSON/契约错误立即保留失败。成功页面不因后页瞬时失败重新请求，游标仍在页面验证完成后保存。持续故障保持采集未完成，不填零结果。

VPS 主运行优先当天，旧日期的发布等待不能阻塞新一天采集。每天最多三次生产派发，先记录尝试；优先 `resume_run_id` 复用有哈希的接受检查点。结果未知不盲目重派，已接受原文不能因下游失败重采。控制仓 `package-lock.json` 变化才安装依赖；失败诊断写到当天私有 `last-error.json`，状态摘要不输出凭据或原文。

`awaiting_approval` 先核对同仓、同日融资分支和数据路径，再由 Hermes 阅读原文审核。仅 approved 才核对固定 production-code-checks 工作流 ID、精确 head 及 pull_request 事件，发起对应运行的审批。审批后仍必须等待当前运行及 Linux/Windows 精确提交检查成功，不能将审批当作检查通过。代码/工作流 PR、fork、事实 hold 或未知审核均不自动批准或合并。

发布器可能在并发 main 前进后采用更晚的接受提交。控制器校验回执日期、网站/Mini 日期及完整 SHA，并验证该 SHA 是原接受版本的后代且仍在 main；缓存实际发布 SHA 的目录 hash。远端前进不替代实际发布验收。

Portal 隔离发布器使用 `/home/ubuntu/.guanlan-runtime/publisher-checkouts`。部署前创建该目录并归 ubuntu 所有，service 仅对 `/home/ubuntu/.guanlan-runtime` 添加 `ReadWritePaths` 例外，其余 HOME 继续只读。所有发布仓和恢复文件由 ubuntu 写入，不能用 root 把手工恢复产物写进它的 Git 工作树；维护后核对所有者和跟踪文件干净。部分 checkout 失败时保留旧目录，在新干净检出恢复，不 reset 掩盖人工或半更新内容。旧日期恢复允许复用更晚的线上日期，但网站与 Mini 日期仍须一致，不得倒退。

## VPS 边界和目录

控制器使用独立账户 `guanlan-financing`：

| 内容 | 路径 |
|---|---|
| 干净的接受主分支与控制器 | `/srv/guanlan-financing/WaveSight` |
| 日状态、只读审核、私有日志 | `/srv/guanlan-financing/runtime` |
| 私有原文镜像 | `/srv/guanlan-financing/private-evidence/store` |
| 独立 Hermes HOME | `/srv/guanlan-financing/hermes-home` |
| 独立 Node 22、Hermes、Python、DuckDB | `/opt/guanlan-financing-tools` |
| publisher 的仓库、Vault 和发布检查点 | `/srv/guanlan-financing-publisher` |

只读审核器只暴露 `read_evidence_file`、`find_evidence_files`。读取限定在接受 PR 的 checkout、审核上下文和私有证据镜像；禁止路径越界、凭据路径与逃逸软链接。原文和 PR 文件中的操作指令不可信。缺证据返回 hold；代码、工作流或非融资允许路径的变更不得自动合并。

每次模型审核结束即删除干净的临时 checkout，保留 diff、结果和读取审计，避免每天堆积完整仓库副本。若有未提交修改，Git 拒绝删除并保留现场；主机断电留下的 checkout 需由管理员核验后清理，不能强删。

发布入口为 root 所有的 `/usr/local/libexec/guanlan-financing-publish YYYY-MM-DD`，只接受日期，以现有 `ubuntu` 身份运行原发布器。控制器不获得任意 shell 的 sudo 权限。原发布器保留来源进展、卡片保留、Pages、哈希、受保护内容、原子切换、现场回读和回滚门禁。服务器通过显式本地 transport 执行同机部署；本机继续使用原 SSH/SCP 路径。

仅复用已有 DeepSeek 密钥；不复制公众号、消息平台或其他 Hermes 凭据到控制器。待核验线索按 `agent-workflow/financing/config.json` 的逐条二次复核额度执行，详见 Harness 的提交、并发发布与二次复核规范；不自动购买搜索套餐。Hermes 默认配置、data profile 和既有六个 cron 的模型均切换为 Flash，原启停状态保持；历史报告中的原模型记录不改写。

## 发布运行根与版本

发布器以接受的 main 提交为固定输入，并向下游传递 `--source-sha`；失败时按检查点恢复必要阶段。控制器模式以 `/etc/guanlan-financing/runtime.env` 的实际配置为准。

`agent-workflow/financing/vps/publish.sh` 设置 `GUANLAN_PUBLICATION_RUNTIME_ROOT=/srv/guanlan-financing-publisher/runtime`。该绝对目录由发布用户可写，保存发布目标锁和运行回执；Portal 在其 `portal-geo/` 子目录保存 IndexNow 与遥测回执。不要依赖临时 Git 检出相对位置推导 `/srv/runtime`，也不要将回执放入公开仓库。`GUANLAN_PUBLICATION_STATE_ROOT` 是 Portal 不可变 release 的独立恢复状态目录，不因设置运行根而替代。

本机未设置运行根时，程序从 Git common-dir 找到原仓后按注册项目布局定位 runtime；独立工作树共享同一目标运行根和所有者锁。操作前核对用户权限、固定提交及回执，不按锁龄删除其他发布者的锁。

## 检查与恢复

```sh
sudo systemctl status guanlan-financing.timer
sudo systemctl show guanlan-financing.service -p Result -p ExecMainStatus
sudo cat /srv/guanlan-financing/runtime/standby.json
sudo tail -n 20 /srv/guanlan-financing/runtime/supervisor.log
```

只看某日正式运行计划，不修改远端生产：

```sh
sudo -u guanlan-financing /opt/guanlan-financing-tools/run.sh --mode=active --dry-run=true --date=YYYY-MM-DD
```

重试已接受日期的发布链，不重采：

```sh
sudo -u guanlan-financing sudo /usr/local/libexec/guanlan-financing-publish YYYY-MM-DD
```

`publication-stages.json` 保留已通过的阶段和首个失败阶段。`published.json` 绑定接受 SHA、网站日期和 Mini 日期；Pages 成功或单次 CLI 成功不代替完整发布回执。无新增和全待核验按真实状态收尾，不能人为更新融资日期。

`awaiting_approval` 回执保留待批 CI 运行及精确 head，不能把它当采集失败或重新派发发现。旧日期仍待审批或检查时保留现场，避免阻止新一天 08:10 任务；需要时以 `--date=原日期` 恢复同一 PR。真实检查失败继续记录 ci_failed，缺证据继续 hold，不跳过 CI。

## 切换顺序与回退

本机 `ai` 保留为暂停的备用任务，VPS 作为正式主控。切换验收包括定时器、依赖、当天派发预览、已接受日期的真实 VPS 发布和线上回读；没有把这些检查描述为未来新日期的全流程结果。含新融资的次日 Hermes 自动审核与 CI 审批仍须按实际运行回执判断，hold 或持续失败保留现场待责任人处理。

VPS 有问题时，停用 `guanlan-financing.timer` 或恢复 `GUANLAN_VPS_MODE=standby`；本机 runner 与 `ai` 均已保留。若本机未来被暂停，通过 Codex automation 工具恢复原配置；不要新建重复的每日任务。恢复从未发布的接受日期和失败阶段开始。

本机知识库继续由接受 main 的生成入口更新；VPS Vault 物理独立。需要拉回 VPS 状态时仅取 body-free 回执，不将私有原文整库复制到知识库。部署脚本、迁移前源码和自动化配置备份位于本机 `90-工作区/每日监测整合/2026-10-03-VPS迁移`。
