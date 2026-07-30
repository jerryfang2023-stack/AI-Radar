---
type: wavesight_vault_reference
status: current
---

# 使用说明

- `vault/` 是唯一 Obsidian 入口。
- 数据中心与应用中心目录不可混写。
- 生成型笔记由同步脚本维护，人工修改可能在下次同步时被覆盖。
- 原始证据、JSON、JSONL、DuckDB、站点代码和运行报告不进入 Vault。
- 历史恢复使用 Git，不在生产 Vault 中保留重复副本。
