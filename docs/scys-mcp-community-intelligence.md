# 生财 MCP 与社群情报

生财优先使用本机 Codex 官方 `mcpServer/tool/call` 读取帖子；破局保留浏览器采集。MCP 失败会记录回退信息，继续走已有生财浏览器路径。AI 情报接口尚未通过验证，未接入生产。

## 本机配置与授权

- `%LOCALAPPDATA%/WaveSight/runtime/scys-mcp.json` 仅保存 `codexExecutable` 的绝对路径。
- 当前固定使用宿主已验证的 Codex 安装，调用通过参数数组和 `shell: false` 执行，不从 PATH 切换安装。
- OAuth 配置和凭据仍由当前 Windows 用户的 Codex 管理。采集器不读取、导出、复制凭据，不调用 login，也不自动打开授权页。
- 官方 app-server 创建 ephemeral 传输上下文，不发起模型 turn，不创建持久任务，不产生模型推理费用。
- CLI 升级后若原路径消失，生财回退浏览器并记录警告；需核对实际宿主路径后更新本机配置。
- 不增加 Windows 定时任务。现有 08:30 任务仍运行同一个 collector。

## 采集与覆盖

首页采集对应最近 24 小时的时间窗，关键词沿用既有轮换池。每个查询最多两页，每页十条，单轮最多读取八十个去重帖子详情。这些是采集预算，不是服务端限流配额；`meta.scysCoverage` 明确记录命中数、已读数和截断情况，不宣称全量覆盖。

工具调用使用只读白名单。服务端返回可解析的 `retryAfterSeconds` 时按其等待；失败记录阶段并停止或回退，不自动重新授权。

## 飞书资料保留

1. 搜索摘要只用于发现，帖子必须读取 `topicDetail`。
2. 优先解析原始 `articleContent` 中 `<e type="web" href="...">` 的百分号编码真实地址；同时兼容普通 HTML 锚点。
3. `articleContentContainFeishuDoc` 可补充链接和正文，但可能缺失；零宽字符应视为 URL 边界。
4. 资料独立存入 `items[].links` 与顶层 `links`。顶层保留 `itemId`、`itemTitle`、`itemUrl` 和来源，摘要截断不能影响资料链接。
5. 相同帖子按稳定原帖身份合并旧资料。MCP 缺失旧链接或明确的文档入口时，尝试浏览器详情补采；旧链接保留，无法解析的新文档入口阻止该候选发布。
6. 有完整对应地址时清理旧显示文字产生的截短副本。已知追踪参数只用于判重，保存的原始地址不删除访问参数。
7. 采集器逐帖验证旧链接保留；栏目 gate 检查独立资源索引及私有证据定位。历史快照继续保留，不能把一次有限采集解释为全站资源删除。

## 正文与资料关联

完整帖子及飞书合并正文通过现有 PRIVATE-EVIDENCE-STORE-V2.0 入库，栏目只保存 `bodyRef`、短摘录及链接。MCP 获取到飞书合并正文不等于已验证用户浏览器能打开飞书页面。

案例、工具、航海手册通过原帖标题/正文中的明确关键词检索；结果标题、简介或场景也必须包含该关键词。不能仅因轮换任务使用过某个关键词，就给未提及该主题的帖子强加关联。

关联保存为 `relatedResources`，`association=keyword_match`。手册保存同一航海返回的可读目录及 `activityId/itemId`，可经 `activityManualDetail` 继续读取。页面在帖子详情显示资料类型、名称、简介及手册目录；只有服务端实际返回 URL 的资源才显示直接链接，不编造案例或手册地址。

社群自述保持线索身份，关联不代表作者推荐、实际使用或已核验商业关系。此链路不写 Claims、CanonicalEvents 或 RELATION 表。

## 验证与阶段恢复

- `node --test agent-workflow/tools/tests/scys-community.test.mjs agent-workflow/tools/tests/community-intelligence-collector.test.mjs`
- `node 01-SiteV2/site/scripts/collect-community-intelligence.mjs --scys-upgrade`：读取当前已采集生财帖的详情，保留其余来源；用于首次升级，不重复全量浏览器采集。
- `node agent-workflow/tools/enrich-scys-community-resources.mjs`：仅从已归档正文恢复资料关联，不重新搜索或读取帖子。
- 继续运行既有 `translate:community-intelligence` 和 `assert:community-intelligence`。发布仍走原有发布流程；本机代码和数据验证成功不等于线上部署完成。

## 发布门禁

本机数据门禁默认 `--private-evidence=read`，必须实际读取私有原文。GitHub 发布显式使用 `--private-evidence=references`，仅验证已归档证据定位及公开数据契约；此模式不代表远端读取过原文。不得向 GitHub 上传私有原文以满足门禁。

栏目版本：`CINT-V1.1.0-scys-mcp-feishu`；Git 标签：`community-intelligence-v1.1.0-scys-mcp-feishu`。

## 生财与 AI 破局子栏目

当前前台为 `CINT-V1.2.0-source-subcolumns`，具体入口、编辑记录、历史资料库及验收见 `docs/releases/2026-09-12-community-subcolumns.md`。从已接受快照执行 `npm run build:scys-library`，用 `npm run assert:scys-library` 检查漂移。编辑数据在 `scys-community-editorial.json`；周精选是按整理日期策划的条目，不能仅因关键词命中而自动发布为精选。案例中的来源陈述、外部核验及成员实践必须区分，当前仅有来源陈述。
