# Google Search Console 自动同步

范围：运营后台「搜索与 AI 增长」，Google 只读授权，PC 主站 `https://www.zkdlj.vip/`。既有手动导入及来源流量不变。

## Copy 文案规范表（实现前复核）

| 位置 | 用户任务 | 最终文案 | 约束及证据边界 |
|---|---|---|---|
| 搜索表现连接区 | 查看连接 | Google Search Console；未配置；待授权；已连接；需重新授权；同步失败；等待同步；正在同步 | 标题单行，状态不代替收录状态 |
| 按钮 | 授权及同步 | 连接 Google；重新授权；立即同步；断开连接 | 按钮不超过 6 个汉字，沿用后台控件 |
| 说明 | 理解统计 | 每天北京时间 09:00 同步。Google 报表按太平洋日期统计，仅包含 PC 主站。 | 允许自动换行 |
| 时间 | 查看新鲜度 | 最近同步；最新数据日期；尚未同步；未记录 | 最新数据日期只来自返回的日期行 |
| 报表 | 了解边界 | Google API 自动同步；API 返回热门明细，可能省略部分记录；当前周期覆盖不完整；每日展现、点击、点击率及平均排名 | 不用页面或关键词明细相加推导总量 |
| 操作状态 | 查看结果 | 正在处理…；授权已完成，等待首次同步；已提交同步请求；已断开连接；授权未完成，请重试；操作失败，请重试；授权链接无效，请重试 | 不回显 Google 原始错误、凭据或令牌 |
| 配置状态 | 创建客户端 | 请先配置 Google OAuth 网页客户端。 | 不提供浏览器输入客户端密钥的入口 |
| 回调页 | 返回后台 | Google 授权已返回，请继续完成连接。；返回运营后台；授权请求已失效，请返回后台重新连接。 | 无外部链接或资源；一次性凭证绑定原管理员会话 |
| 持久错误 | 排查连接 | Google 暂时无法访问，请稍后重试；Google 授权已失效，请重新授权；当前 Google 账号没有本站权限；Google 报表格式无效；服务配置无效，请联系管理员 | 保留上次成功数据 |

## Typography 页面位置表（实现前检查）

| 元素/位置 | 桌面及移动 | 字体/字重 | 映射 |
|---|---|---|---|
| 连接区卡片标题 | 16px / 24px | 后台 sans，600 | 已有 `.growth-section h3`，侧栏标题角色 |
| 状态及正文 | 14px / 24px | 后台 sans，400 | `.growth-panel`，caption 角色 |
| 按钮 | 14px / 20px | 后台 sans，500 | `.growth-toolbar`，导航/控件角色 |
| 时间与边界注释 | 12px / 18px | 后台 sans，500 | `.growth-note`，label 角色 |
| 每日指标表 | 14px / 24px | 日期/数值 mono，500 | `.growth-table`，既有数据表 |

构建前字体检查：沿用现有选择器，不增大标题，不使用 vw/clamp、负中文字距或超重字重。渲染后验证换行、溢出及注销清理。

## 接入步骤

1. Google Cloud 新建项目并启用 Google Search Console API。
2. Google Auth Platform 创建外部应用，填写名称、支持邮箱及联系邮箱，测试用户添加 Search Console 资源拥有者。数据访问只用 `https://www.googleapis.com/auth/webmasters.readonly`。
3. 创建 Web 应用 OAuth 客户端，精确登记回调 `https://www.zkdlj.vip/ops/growth-api/google/callback`。下载 JSON 到私密目录，不提交 Git。
4. 在服务器私密 secrets 目录部署 JSON（服务用户只读），环境变量 `GSC_CLIENT_CONFIG_PATH` 指向此文件。资源优先固定 `sc-domain:zkdlj.vip`，亦接受 `https://www.zkdlj.vip/`；不接受任意资源。
5. 安装同步 service/timer；管理员在后台点击「连接 Google」完成 Google 同意页，返回后台继续连接。首次同步及「立即同步」在下一次五分钟调度执行。
6. 外部应用正式发布后长期运行；测试模式下非基础资料 scope 的 refresh token 通常 7 天过期。授权过期后后台提示重新授权。

## 合同与保护

- 服务端使用 Google OAuth 库，offline access、PKCE、一用 state、十分钟有效期；令牌及临时代码由分离上下文密钥加密后存入私有 SQLite。密钥派生自现有服务 SECRET_KEY；轮换此密钥后需重新授权。
- Google 回调不依赖跨站 Strict cookie：只暂存加密授权码，返回同源中转页，再由原会话和 CSRF 的 POST 完成兑换。其他会话、注销后的会话和重放均拒绝。回调禁用访问日志及第三方资源，Referrer-Policy 为 no-referrer。
- API 请求只走固定 Google HTTPS 端点；不使用下载文件中的任意 auth_uri/token_uri。客户端密钥不返回前端。
- 同步 worker 通过数据库租约隔离并发；断开/重新连接会改变连接标识，旧任务不能提交数据。断开只删除本服务保存的授权，不撤销该 Google 客户端的其他用途授权。保留历史报表。
- 默认每天北京时间 09:00 拉取近 90 天已完成的日期报告及 7/30/90 天页面/关键词报告。结束日期保守取太平洋当前日期减 3 天，并请求 dataState=final；API 可能有延迟或省略数据，空日期不补零。
- 使用主站 URL 正则过滤域资源的子域名；明细最多 5000 行，标明热门明细/可能省略。总量只从日期报告计算。
- 保留手动报表。自动报表按选定窗口读取；同步失败保留最近成功快照，并显示错误与成功时间。未知指标为 null。

官方参考：[服务端 OAuth](https://developers.google.com/identity/protocols/oauth2/web-server)、[令牌有效期](https://developers.google.com/identity/protocols/oauth2#expiration)、[Search Analytics API](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)。
