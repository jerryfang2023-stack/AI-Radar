# 生财 MCP 社群情报升级验收

日期：2026-09-12。范围：本机采集器、社群情报数据与详情展示；经用户授权通过 PR / main / GitHub Pages 发布。

栏目版本：`CINT-V1.1.0-scys-mcp-feishu`。Git 标签：`community-intelligence-v1.1.0-scys-mcp-feishu`，指向通过部署验收的 main 提交。

## 完成结果

- 本机 Codex 官方 app-server 复用既有 OAuth，实际搜索与详情调用成功；只读白名单、绝对可执行路径、无 shell 参数拼接，不自动授权。
- 复用当日已接受的 69 条社群情报，对其中 6 篇具有稳定原帖地址的生财帖子补充详情和私有证据；破局原帖地址、标题和正文摘录逐项保持一致。
- 升级前顶层记录 60 个链接，其中 56 个为去重、排除明确截短显示副本后的资源地址。升级后 58 个；原有 56 个全部保留，新增 2 个。跨帖子仅追踪参数不同的引用合并到同一资源，同时保留全部来源帖子。这里的资源地址有效性指可解析及来源对照，不代表已逐个验证飞书访问权限。
- 6 篇生财正文通过 PRIVATE-EVIDENCE-STORE-V2.0 归档，页面仅保留短摘录、资料链接和 evidence 定位，不生成已核验商业事实。
- 关联 13 条同主题资料：5 个项目案例、5 个工具、3 份航海手册。标题/正文与检索结果均需有匹配关键词，关联标记为 keyword_match。
- 1 份航海手册返回“本内容限指定用户访问”，已跳过并记录。AI 情报列表接口仍不作为生产依赖。
- 现有定时任务仍调用同一采集器：生财优先 MCP，失败记录后回退原浏览器路径；破局保留原路径。没有新增定时任务。

## 主要文件

- `01-SiteV2/site/scripts/community-document-links.mjs`：编码 href、HTML 锚点、零宽字符边界、截短副本、独立链接保留及逐帖检查。
- `01-SiteV2/site/scripts/collect-scys-mcp.mjs`：搜索分页、详情、私有正文记录、受权限约束的资料关联及覆盖报告。
- `agent-workflow/tools/lib/scys-mcp-client.mjs`：Codex 官方传输、只读限制、服务端限流等待和安全错误分类。
- `01-SiteV2/site/scripts/collect-community-intelligence.mjs`：MCP 分支、浏览器回退、旧资源合并、私有归档和既有数据输出。
- `agent-workflow/tools/enrich-scys-community-resources.mjs`：从已归档正文恢复关联阶段，成功查询检查点位于本机 runtime。
- `agent-workflow/tools/assert-community-intelligence-data.mjs`：独立链接索引、私有证据可读取及关联身份检查。
- `01-SiteV2/site/assets/data-center-v4.js`、`data-center.html`：详情内同主题资料、实际返回的工具入口及手册目录。
- `community-intelligence.json`、当日快照及日期索引：已完成本机数据更新。
- `package.json`、社群情报 Skill 和 `docs/scys-mcp-community-intelligence.md`：测试入口、维护流程与边界。

## 验证

- `npm run test:community-intelligence`：20/20 通过。
- 官方客户端实际只读搜索成功；6 篇详情获取、正文归档和资源关联实际执行成功。
- 栏目数据 gate：通过，69 条情报、58 个资料链接；证据定位可读取。
- 逐帖旧链接保留：无缺失。所有来源旧资源地址对照：无缺失。
- 桌面 1280×900 与手机 390×844：详情可打开，完整资料 href 保留，关联与目录可展示，无页面脚本异常和横向溢出。
- `git diff --check`：通过。
- 扩展回归：65/66 通过。唯一失败是既有发布并发测试以首个 `jobs:` 文本截取 YAML，遇到前面的注释后得到空串。对 HEAD 中同一工作流运行原断言也失败；相关测试和工作流均未被本次修改。

## 交付边界

原工作区已有用户改动保留；独立发布工作区仅同步社群情报版本字段。生产发布走既有 PR / main / GitHub Pages 流程；以 Git 标签及对应成功的 Pages run 作为上线凭证。手册详情没有服务端 URL 时只展示真实目录并保留可继续查询的 ID，不编造网页直达地址。
