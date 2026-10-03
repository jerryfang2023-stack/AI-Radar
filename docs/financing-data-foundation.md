# 融资数据基座

共享 V4 事实、身份、来源和证据仍由原有生产链维护；原有 24 表 DuckDB 契约不变。独立融资读库是可重建投影，不是第二个采集、审核或身份事实源。

`node agent-workflow/financing/read-model.mjs` 只读取已验收的 `01-SiteV2/site/data/financing-catalog-v1.json`，生成 `data-marts/financing/releases/<hash>/finance.duckdb`、10 张 JSONL 表及哈希清单；`current.json` 指向通过校验的完整版本。表分为公司、融资主体、融资事件、事件血缘、投资参与、人物任职、来源引用、证据链接、应用研究和 ID 别名。金额缺失保留 null，币种独立保存；编辑分析与事实表分离，不复制私有全文。主体/事件/证据/别名引用及数据库行数均需通过校验。

每日生产门禁先验证无数据库的 JSONL 投影；合并后的 `agent-workflow/financing/publish.mjs` 构建独立 DuckDB。它与共享 `data-lake/` 使用不同目录和锁，不进入旧 24 表清理白名单。构建失败保留旧 current 指针；重复输入复用校验通过的完整版本。DuckDB CLI 由 `DUCKDB_BIN` 或 PATH 提供。

预合并门禁只写当次运行目录的 `read-model-gate/`，不更新生产读库。发布默认更新调用 runner 的 `data-marts/financing/`，而非 Git 主工作仓；CLI 的 `--output`、发布器的 `--read-model-dir` 或统一环境变量 `GUANLAN_FINANCING_READ_MODEL_ROOT` 可指定同一外部目录。当前指针、release ID、输入哈希和实际 DuckDB 均须验证，JSONL-only 版本不能满足生产发布恢复检查。相同输入和实现复用旧 release 时，`sourceCommit` 保留首次构建来源，发布回执另外记录本次接受提交。

门户生成 `/data/mini/domains/{financing,reports,community,profiles}/` 的独立清单和内容版本。融资索引排除专题栏目的非融资数据；融资报告与社群内容分开计版。紧凑索引使用列名、重复字符串字典和缺省字段表，保持 ID、别名、金额、筛选、事件和排序字段；新版客户端解码为原有对象，请求失败则回退旧接口。旧客户端继续使用既有 funding/report/profile 接口，详情仍按需读取，付费正文继续位于受保护目录。

账户支付 SQLite 与创始会员 SQLite 不迁移。第一轮结构调整未重复上传 1.2.6；第二轮小程序窗口已从固定源码提交上传 1.2.7 开发版，包含紧凑索引读取。开发版上传与提交审核、正式发布分别记录。

Obsidian 使用同一 Vault 的融资与专题分区，具体路径、单向同步、证据边界和首次迁移见 [obsidian-vault.md](obsidian-vault.md)。

## 第二轮：恢复、查询与质量汇总

融资读库新增五个查询视图：`company_round_history`（每个已接受融资事件及企业轮次顺序）、`investment_relationships`（参与机构及公司）、`market_sector_statistics`（市场/赛道/币种/金额状态）、`monthly_financing_statistics`（月份/市场/币种/金额状态）、`financing_query_quality`（未知金额、币种、日期数量）。10 张事实与应用投影表及共享 V4 的 24 表契约保持。金额合计只累计有明确币种的 exact 数值；区间、约数、下限及未知金额单独计数，不折算汇率。相同输入和同一实现复用原库及 current 指针，无变化专题不会使融资库刷新。

示例：

```sql
SELECT * FROM company_round_history WHERE company_id = 'EN-...'
ORDER BY announced_at, card_id;
SELECT * FROM market_sector_statistics
ORDER BY market, sector_id, currency, amount_status;
```

发布器将独立精选审核放在生成/部署前；失败阶段恢复不回到采集。Vault 同步接受 `--source-commit` 固定提交，若 main 已推进则在生成之前拒绝；无变化笔记保留原 updated 日期和原始字节。Portal 中断恢复、私有检查点、进程与锁所有者核验见其 `docs/publication-recovery.md`。

`agent-workflow/financing/foundation-dashboard.mjs` 从接受的 Git 输入、读库指针、Vault 域清单、线上公开清单及原有上传/性能回执生成本地 JSON/HTML 汇总。指定 `--output` 为公共仓库外的私有目录，`--read-model-dir` 与发布器一致，`GUANLAN_VAULT_ROOT` 与已有 Vault 一致。客户端证据通过 `--client-source-receipt`、`--client-upload-receipt`、`--client-upload-log` 和 `--performance-file` 显式传入；缺失证据显示为待验，不能由主干版本推测上传成功。

看板分别呈现输入哈希一致、公开清单摘要一致及完整发布门禁，不用数量相等代替全量内容一致。电脑端内存/下载测量只描述该环境，1.2.7 开发版上传已由小程序窗口完成；用户已选择暂缓真机操作，真机冷/缓存启动、下载、内存与页面可用时间保持待验。无需另建事实库、支付库、公开 API 或重复调度。
