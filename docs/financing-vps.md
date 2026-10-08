# 每日融资监测 VPS 备用版本

2026-10-03：VPS 版本先部署、验收，本机版本保留并继续运行。此文补充 [统一监测规则](unified-daily-monitoring.md)，不恢复任何已暂停的社群、Builders 或旧周度生产任务。

## 当前调度

- 本机 Codex 自动化 `ai` 保持 `ACTIVE`，08:10 北京时间负责正式监测与发布。原 runner、SSH 入口和本机知识库不迁移、不删除。
- VPS `guanlan-financing.timer` 每十分钟检查一次，`Persistent=true`；每日 08:10 前不启动新的日期，已有未完成日期可恢复。
- 初始 `/etc/guanlan-financing/runtime.env` 为 `GUANLAN_VPS_MODE=standby`。此模式仅调用融资派发器的 `--dry-run=true`，保存观察回执，不派发、不调用模型、不合并、不发布。
- `active` 模式复用同一 GitHub 融资生产工作流及恢复检查点，Hermes 审核开放的融资 PR，检查精确提交与 CI 后合并，再等 Pages 和 VPS 发布。模型 API ID 固定 `deepseek-flash`（DeepSeek V4.1 Flash）。每日期最多三次不同提交/基线的模型审核；失败或中断记录为未知，不自动重复付费。
- `funding-health-dispatch.yml` 仅保留人工恢复入口，不再 10:30 定时触发。备用模式避免重复采集、审核与发布。

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

## 切换顺序与回退

当前不暂停本机 `ai`。完成真实日批次采集、审核及发布验收后，再将 VPS 配置改为 `active`，并将本机自动化保留为可恢复的备用任务，避免两个正式控制器并行。不得因为模型连通或 dry-run 通过就声称无人值守验收完成。

VPS 有问题时，停用 `guanlan-financing.timer` 或恢复 `GUANLAN_VPS_MODE=standby`；本机 runner 与 `ai` 均已保留。若本机未来被暂停，通过 Codex automation 工具恢复原配置；不要新建重复的每日任务。恢复从未发布的接受日期和失败阶段开始。

本机知识库继续由接受 main 的生成入口更新；VPS Vault 物理独立。需要拉回 VPS 状态时仅取 body-free 回执，不将私有原文整库复制到知识库。部署脚本、迁移前源码和自动化配置备份位于本机 `90-工作区/每日监测整合/2026-10-03-VPS迁移`。
