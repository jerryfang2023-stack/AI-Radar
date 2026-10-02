# AI 融资订阅信源

配置唯一源：`agent-workflow/financing/sources.json`。当前 39 个订阅入口；36氪文章与快讯分别订阅，因此入口数不等于出版方数量。AIHOT 的两个聚合接口另计。所有入口只发现融资线索，AI 相关性、具身/机器人排除与原文证据由统一融资流程核验。

状态随每次运行变化：直连失败时记录原因，并通过出版方域名定向搜索补查；反爬或付费内容无法取到原文的仍待核验。来源入选此表不代表内容已全部抓取，也不承诺全历史覆盖。

## 国内（15 个入口）

| 来源 | 层级 | 接口 | 订阅地址 |
|---|---|---|---|
| 36氪文章 | 媒体 | RSS/Atom | [公开入口](https://36kr.com/feed-article) |
| 36氪快讯 | 媒体 | RSS/Atom | [公开入口](https://36kr.com/feed-newsflash) |
| 投资界 | 媒体 | 网页列表 | [公开入口](https://www.pedaily.cn/) |
| 创业邦 | 媒体 | 网页列表 | [公开入口](https://www.cyzone.cn/) |
| 猎云网 | 媒体 | 网页列表 | [公开入口](https://www.lieyunpro.com/) |
| 投中网 | 媒体 | 网页列表 | [公开入口](https://www.chinaventure.com.cn/) |
| 钛媒体 | 媒体 | 网页列表 | [公开入口](https://www.tmtpost.com/) |
| 雷峰网 | 媒体 | 网页列表 | [公开入口](https://www.leiphone.com/category/touzi) |
| 界面新闻 | 媒体 | 网页列表 | [公开入口](https://www.jiemian.com/lists/4.html) |
| 虎嗅 | 媒体 | 网页列表 | [公开入口](https://www.huxiu.com/) |
| IT桔子 | 媒体 | 网页列表 | [公开入口](https://www.itjuzi.com/) |
| 亿欧 | 媒体 | 网页列表 | [公开入口](https://www.iyiou.com/) |
| 红杉中国 | 投资机构 | 网页列表 | [公开入口](https://www.hongshan.com/) |
| 启明创投 | 投资机构 | 网页列表 | [公开入口](https://www.qimingvc.com/cn/newsroom) |
| IT之家 | 媒体 | RSS/Atom | [公开入口](https://www.ithome.com/rss/) |

## 海外（21 个入口）

| 来源 | 层级 | 接口 | 订阅地址 |
|---|---|---|---|
| TechCrunch AI | 媒体 | RSS/Atom | [公开入口](https://techcrunch.com/category/artificial-intelligence/feed/) |
| a16z News | 投资机构 | RSS/Atom | [公开入口](https://www.a16z.news/feed) |
| Sequoia Capital | 投资机构 | RSS/Atom | [公开入口](https://www.sequoiacap.com/feed/) |
| EU-Startups | 媒体 | RSS/Atom | [公开入口](https://www.eu-startups.com/feed/) |
| Tech.eu | 媒体 | RSS/Atom | [公开入口](https://tech.eu/feed/) |
| Sifted | 媒体 | RSS/Atom | [公开入口](https://sifted.eu/feed) |
| UKTN | 媒体 | RSS/Atom | [公开入口](https://www.uktech.news/feed) |
| Crunchbase News | 媒体 | RSS/Atom | [公开入口](https://news.crunchbase.com/feed/) |
| VentureBeat | 媒体 | RSS/Atom | [公开入口](https://venturebeat.com/feed/) |
| GeekWire | 媒体 | RSS/Atom | [公开入口](https://www.geekwire.com/feed/) |
| FinSMEs | 媒体 | RSS/Atom | [公开入口](https://www.finsmes.com/feed) |
| Silicon Canals | 媒体 | RSS/Atom | [公开入口](https://siliconcanals.com/feed/) |
| Reuters AI | 媒体 | 网页列表 | [公开入口](https://www.reuters.com/technology/artificial-intelligence/) |
| Bloomberg Technology | 媒体 | RSS/Atom | [公开入口](https://feeds.bloomberg.com/technology/news.rss) |
| Insight Partners | 投资机构 | RSS/Atom | [公开入口](https://www.insightpartners.com/feed/) |
| Accel | 投资机构 | 网页列表 | [公开入口](https://www.accel.com/noteworthy) |
| Index Ventures | 投资机构 | 网页列表 | [公开入口](https://www.indexventures.com/perspectives/) |
| YourStory | 媒体 | RSS/Atom | [公开入口](https://yourstory.com/feed) |
| Entrackr | 媒体 | RSS/Atom | [公开入口](https://entrackr.com/feed) |
| Tech in Asia | 媒体 | RSS/Atom | [公开入口](https://www.techinasia.com/feed) |
| DealStreetAsia | 媒体 | RSS/Atom | [公开入口](https://www.dealstreetasia.com/feed) |

## 国内外（3 个入口）

| 来源 | 层级 | 接口 | 订阅地址 |
|---|---|---|---|
| PR Newswire | 公告通讯社 | RSS/Atom | [公开入口](https://www.prnewswire.com/rss/news-releases-list.rss) |
| GlobeNewswire 融资公告 | 公告通讯社 | RSS/Atom | [公开入口](https://www.globenewswire.com/RssFeed/subjectcode/20-Financing%20Agreements/feedTitle/GlobeNewswire%20-%20Financing%20Agreements) |
| Business Wire | 公告通讯社 | 网页列表 | [公开入口](https://www.businesswire.com/portal/site/home/news/) |

## 使用与维护

RSS/Atom 保留发布者提供的链接和发布时间；网页列表使用每站明确的文章选择器。接口迁移时更新此配置并执行单源检查，不以空结果掩盖失败。原文另行读取，公告转载不自动算独立来源。投资机构的观点文章只为具体融资事件补查背景，不恢复独立非融资栏目。

搜索接口、AIHOT 同步、私有检查点及验证命令见 [搜索与研究规则](daily-monitor-search.md)。
