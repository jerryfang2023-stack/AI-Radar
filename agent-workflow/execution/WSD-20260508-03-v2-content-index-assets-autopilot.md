# WSD-20260508-03-v2-content-index-assets-autopilot

## 任务摘要

- 看板编号：`V2-CONTENT-INDEX-AUTO`
- 状态：`completed / local-index-ready`
- 牵头 Agent：`dev / data / ui-ue / copy / qa / workflow`
- 用户触发：补齐“其他时间段、观点类内容、trend / 趋势、详细拆解后的长文”的前台可见入口。

## 范围

1. 扩展 V2 site data generator，从单日内容扩展为多日期内容索引。
2. 将观点类内容作为 `观点校准` 资产进入商业内参，不设一级导航。
3. 将 trend / 趋势作为 `趋势背景` 与热力输入进入商业内参和机会页，不设一级导航。
4. 将已详细拆解的 opportunity deep-dive 生成长文索引，并支持按 slug 打开历史长文详情。
5. 清理公开页面和生成数据里的内部口径。

## 明确不做

- 不上传 Netlify。
- 不做 production deploy，不切正式域名。
- 不恢复旧 `04-Site`。
- 不处理 `09-ai-news-radar/`。

## 验收要求

- `01-SiteV2/site/data/site-content.json` / `.js` 包含 `contentIndex.dates/signals/points/trends/opportunities`。
- 今日要点页可见时间索引。
- 关键信号页可见历史信号。
- 机会解码页可见长文索引。
- 商业内参页可见观点校准和趋势背景。
- 机会长文详情页可按历史 slug 打开，并展示拆解章节。
- 桌面 / 移动浏览器检查无横向溢出。
- V2 content 与 syntax Quality Gates 通过。
