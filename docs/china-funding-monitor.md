# 国内融资独立监测

国内链路由 `daily-persistent-assets-pr.yml` 调用 `china-funding-pr.yml`，与海外业务监测在 08:10 Morning Production Dispatch 同次触发。采集独立运行，只有共享事实与应用发布使用现有串行锁。无需新增 Windows 任务。手动补跑通过国内工作流，不必重跑海外。

来源配置：`01-SiteV2/content/11-databases/china-funding-monitor-v1.json`。投资界、投中网、36氪、创业邦、财联社／科创板日报、量子位、机器之心各有独立列表页与两条检索预算。入口受限显示部分失败；媒体所在地只决定采集路由，不能证明公司属于中国区。

生产顺序：候选 URL → 原文采集 → 私有证据备份 → 精确引用 Claim → CanonicalEvent → 组织／产品与实体历史 → 融资卡 → 投资机构库 → 前台投影与门禁。未披露金额、产品、投资人保持未知；摘要与搜索结果不可替代原文事实。

候选、逐源诊断、接受后的原文引用和阶段检查点保存在 `agent-workflow/reports/china-funding/YYYY-MM-DD/`。全文只进入私有证据库。失败时保留共享库的最后成功版本，发布失败质量数据。用工作流 `resume_run_id` 复用已备份证据的检查点，恢复后以最新 main 合并，禁止因下游失败重新采集。阶段是否成功与网站是否发布分开记录。

OPS 的“国内融资监测质量”展示来源状态、候选数、可读原文、核验融资、中国区融资、匹配融资卡、关联组织与产品、失败请求和披露日；未运行显示空值，历史批次标出过期。匹配卡可能是去重复用的已有卡，不代表新增数。执行失败时中间指标仅供诊断。

16:45 Final Closure 使用现有融资门户发布脚本同步独立门户与小程序受保护内容，并运行 `publish-ops-console.mjs`，将 origin/main 的受控 OPS 文件原子部署到现有鉴权路径。部署脚本验证 Git 内容哈希、Nginx 配置、匿名鉴权重定向与健康接口，保留旧发布目录。实时回执在本机运行目录 `ops-publication.json`，源码快照不冒充线上回执。

Skill：`agent-workflow/skills/guanlan-china-funding-monitor/SKILL.md`，版本 1.0.0；Skill Store 2.4.0；OPS 3.7.0。验证命令：`npm run test:china-funding`、`npm run test:ops-v2`、`npm run test:ops-unified`、`npm run test:data-center`、`npm run test:funding-insights`、版本／Skill／私有证据边界门禁。

小程序本次继续以提炼后的融资及产品信息为阅读入口，新闻原文作为可追溯来源。独立新闻阅读页、转载全文及外链浏览没有纳入本次实施范围。
