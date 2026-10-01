# AIHOT 2026 融资历史补采

本轮授权范围为 2026-01-01 至 2026-10-02 的 AI 融资，用户已确认拥有 AIHOT 数据用于融资站和小程序的授权。仅本次显式历史任务执行，不加入日常调度。

## 可访问范围

AIHOT `/api/v1/items` 只有最近七天窗口，不能按年导出全部内容。`/api/v1/selected/snapshot` 可以分页读取完整历史精选，但不涵盖过去未入选条目。本轮另利用网页历史搜索中的“融资、funding、raises、获投、raised、Series、领投、注资”取得精选之外的线索；网页搜索每查询最多 50 页、每页 40 条，达到上限必须记为未完整覆盖，不能靠换身份绕过限制。

网页端 `/api/site/*` 是其网页当前使用的内部接口，没有稳定版本承诺；本轮保存响应与实际范围，不把它加入每日订阅依赖。历史精选和全部历史关键词搜索也不能代表 AIHOT 全部数据库或市场上的全部融资。缺少原文的条目保持待核验。

原始接口响应、来源和 attribution 信息保留在私有运行目录。AIHOT 标题和摘要仅作发现；入库证据来自原始网页。按公开限流串行读取，保留检查点，尊重 Retry-After，不改变身份或访问受限的后台。

## 采集与重复控制

历史采集入口为 `agent-workflow/financing/history-collect.mjs`。必须显式给出输入、历史范围、采集批次日期和独立运行目录；正文进入私有证据仓，公开仓仅保存 `evidence://` 定位符。默认先捕获并保存检查点，完成发现后才用 `--finalize=true` 写入事实输入。

```sh
node agent-workflow/financing/history-collect.mjs --date=2026-10-02 --from=2026-01-01 --to=2026-10-02 --input=<私有候选文件> --runtime-dir=<独立历史运行目录> --finalize=true
```

输入格式为 `{processed,total,complete,items:[{id,title,originalTitle,links:{original,aihot}}]}`。范围限制使用原始网页发布日期，不使用 AIHOT 入选时间、抓取日期或搜索日期。`complete` 只表示输入发现步骤是否成功完成，不代表全部 AIHOT 历史可访问。

已在融资事实中引用的原文 URL 记为 `existing`；一般产品页、同公司名称或同轮次名称不足以判重复。新证据进入融资生成器后，再按主体、金额、披露日期和融资轮次与历史卡核验。同一报道多个链接不能重复造事件。

历史授权写入当次数据批次的 `targeted-funding-authorization.json`，仅列出本次接受的 SourceArtifact 和范围。日常七天窗口、既有采集检查点及历史来源保持不变。已接受原文不因下游失败重采；有明确修复原因时仅重试受影响的待核验原文。

## 生产与发布

最终历史 `collection.json` 位于独立目录，可交给现有 `financing/run.mjs --phase=produce --runtime-dir=<同一目录>`，复用事实提取、二次搜索、融资卡、融资标签与发布门禁。事实保留原始披露日期，采集批次日期不冒充新融资日期。

全球融资流程不要求每批必须包含国内来源；原国内监测的非空数量门禁不再作为全球融资发布条件。国内归属仍由原文、实体与 Claim 支持，经 V4 事实门禁和融资分类校验。显式历史授权只解开指定来源的日期窗口，不允许该批来源生成产品、合作或其他非融资事件。

本轮实测修复包括 ISO 日期、微信合并 Content-Type 与文章发布日期、历史候选进入事实提取的窗口衔接，以及标题中的万亿缩写、倍数和“doubles down”习语。模型无事实可提取时保存拒绝/待核验结果，缺少精确证据仍不可发布，不反复生成同一条。

发布仍需数据 PR、CI、接受 main、Pages、融资站发布器及网站/小程序数据回读。可获取条目数、关键词线索数、原文数、重复数、待核验数和新增融资卡数分别报告。

验证：`node --test agent-workflow/financing/tests/history.test.mjs`；融资全套测试为 `npm run test:funding-insights`。原文日期的 ISO 时间格式和重复响应式 `<time>` 元素由信源回归测试覆盖。
