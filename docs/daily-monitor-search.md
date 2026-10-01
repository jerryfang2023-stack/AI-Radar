# 每日监测搜索与二次研究

当前入口：`run-daily-automation-controller.mjs --phase=daily`。消费级 AI 硬件是国内、海外融资监测的固定子范围，复用同一原文、事件、研究和发布链。

## 搜索网关

采集和融资二次研究都调用 `lib/search-gateway.mjs`。默认顺序为 Anysearch、可选 Brave、Tavily、Exa；结果不足时使用免费兜底。采集保留 DuckDuckGo/Bing 页面兜底，研究使用 Bing RSS。RSS、GDELT 和公司／投资方原始来源仍是独立发现渠道。

- 中文查询保持中文；`site:` 和 `-site:` 转成提供方支持的域名参数，并在结果端再次校验。
- URL 去追踪参数并去重；同查询并发合并，非空缓存 6 小时、空结果 15 分钟。
- 401/403、402、429 分别记录认证、配额和限流，本轮停止请求该提供方。超时、响应结构错误、空结果分别记录；失败不得伪装成零融资。
- 单次请求和总调用数有界。采集默认最多 200 次付费请求，研究默认 120 次；`--search-request-budget` 可设更低预算。未配置 Brave 不调用、不开户、不购买额度。
- 搜索摘要、AIHOT 改写摘要和搜索抓取片段仅供发现，不作为正文或 Claim。原始页面捕获失败时保持待核验。
- `inspect-search-providers.mjs --live=true --env-file=<本地环境文件> --output=<私有运行目录>` 可探测接口，不输出凭据。调用一次每个已配置接口，避免把诊断变成高频轮询。

2026-10-01 本机实测：Anysearch、Tavily、Bing RSS 返回结果；Exa 返回 HTTP 402；Brave 未配置。可用性是该次观察，云端仍须以运行报告确认。

## AIHOT 的可借鉴部分与接口边界

参考 [AIHOT](https://github.com/KKKKhazix/AIHOT)，审阅版本 `8d5a39bb47c917616798a3fdd71688a80f6c9b6c`。适配器统一入口、来源分层、抓取失败不推进水位、限制并发和分页，是可借鉴的工程机制。其文本搜索检索的是已聚合内容，并非互联网多引擎搜索；不替代本项目的原始来源核验。融资不按热度决定是否采集。

仓库公开的是 18 个示例来源，生产完整源表并未公开。不能声称已获得所有底层来源、全文或全历史。

当前公开接口为 `https://aihot.news/api/v1/items`，使用 `mode=all&window=7d&by=timeline&limit=100`，沿 `page.nextCursor` 拉取直到 `page.hasMore=false`。不再使用旧域名、猜测的 `since` 参数、每日精选兜底或固定 500 条上限。

先保存公开元数据各页，再从全部条目筛融资线索，包含未入选条目。原始标题和原始 URL 保留，改写标题／摘要单独标明来源。重复游标、响应异常或页数预算耗尽标记 `complete=false`，不能推进成功水位。每天覆盖最近七天可抵抗延迟发现；超过七天的停机缺口需要原始来源回补，不能用此接口宣称历史全覆盖。

`pull-aihot-funding.mjs --window=7d --output-dir=<私有运行目录>` 可单独验证。2026-10-01 实测 26 页、2,532 条唯一公开条目，筛出 41 条融资线索；它们不是已核验事件数。

## 二次搜索规则

先复用已接受原文和逐事件检查点，再执行最多六种定向查询：主体及披露年、公司别名与本轮融资、官网产品、投资方理由、本轮公告、创始人／客户／总部。金额只是部分查询的提示，不要求每条查询精确匹配金额；未知字段保持未知。

查询顺序有界，共享配额熔断和缓存。结果按原文 URL 去重，优先公告及独立报道；前一页面不可读时继续尝试后备 URL，最多保留八份原始来源。已存在 `FUNDING-RESEARCH-SEEDS-V1` 时复用人工确认链接，跳过重复搜索。正式卡仍需主体、轮次、金额语义、至少两份引用来源和逐项原文证据门禁。

国内七家来源每家保留六类硬件的独立查询结果；海外先执行六类，每类最多保留四条，不被通用查询预算挤掉。`collected/empty/failed` 和保留／截断数均进入采集报告。失败类重试，成功类复用；无新增有效，未查询不能算覆盖。

接口参数依据：[Exa](https://exa.ai/docs/reference/search)、[Tavily](https://docs.tavily.com/documentation/api-reference/endpoint/search)、[Brave](https://api-dashboard.search.brave.com/api-reference/web/search/get)。
