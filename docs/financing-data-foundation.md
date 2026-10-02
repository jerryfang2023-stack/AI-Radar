# 融资数据基座

共享 V4 事实、身份、来源和证据仍由原有生产链维护；原有 24 表 DuckDB 契约不变。独立融资读库是可重建投影，不是第二个采集、审核或身份事实源。

`node agent-workflow/financing/read-model.mjs` 只读取已验收的 `01-SiteV2/site/data/financing-catalog-v1.json`，生成 `data-marts/financing/releases/<hash>/finance.duckdb`、10 张 JSONL 表及哈希清单；`current.json` 指向通过校验的完整版本。表分为公司、融资主体、融资事件、事件血缘、投资参与、人物任职、来源引用、证据链接、应用研究和 ID 别名。金额缺失保留 null，币种独立保存；编辑分析与事实表分离，不复制私有全文。主体/事件/证据/别名引用及数据库行数均需通过校验。

每日生产门禁先验证无数据库的 JSONL 投影；合并后的 `agent-workflow/financing/publish.mjs` 构建独立 DuckDB。它与共享 `data-lake/` 使用不同目录和锁，不进入旧 24 表清理白名单。构建失败保留旧 current 指针；重复输入复用校验通过的完整版本。DuckDB CLI 由 `DUCKDB_BIN` 或 PATH 提供。

门户生成 `/data/mini/domains/{financing,reports,community,profiles}/` 的独立清单和内容版本。融资索引排除专题栏目的非融资数据；融资报告与社群内容分开计版。紧凑索引使用列名、重复字符串字典和缺省字段表，保持 ID、别名、金额、筛选、事件和排序字段；新版客户端解码为原有对象，请求失败则回退旧接口。旧客户端继续使用既有 funding/report/profile 接口，详情仍按需读取，付费正文继续位于受保护目录。

账户支付 SQLite 与创始会员 SQLite 不迁移。本轮不改变小程序版本号、不重复上传其他任务的 1.2.6 包。紧凑索引的客户端启用随后续正式包发布生效。

Obsidian 使用同一 Vault 的融资与专题分区，具体路径、单向同步、证据边界和首次迁移见 [obsidian-vault.md](obsidian-vault.md)。
