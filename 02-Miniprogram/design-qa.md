# Design QA

## 2026-08-16 V0.6.5 运营监测

- Visible scope: 前台页面、融资卡、生态图谱、观察内容、“我的”和底部导航均不改变视觉样式；本版只接入页面生命周期、关键操作和转化事件。
- Privacy boundary: 客户端只生成随机访客 ID、会话 ID 和失败重试队列；不采集手机号、微信号、OpenID、UnionID 或正文输入内容。
- Decision metrics: 页面浏览、独立访客、会话、注册、支付、退款、注册转化率、付费转化率、平均访问时长、跳出率、平台分布、热门页面与热门内容。
- Source of truth: 注册、支付成功与退款均由会员/支付服务端业务记录统计，客户端提示或重复点击不直接计入经营结果。
- Visual regression expectation: none；本版没有修改可见 WXML/WXSS 组件。

final result: passed（57/57 小程序测试、33/33 服务端测试、17 页面 / 38 JS / 983,724 bytes 包体校验；运营后台 393px 与桌面宽度均无横向溢出，控制台无错误）

---
## 2026-08-30 体验确认后的发布核对

- 用户已确认扫码体验并授权推送、部署和微信后台上传；提交审核仍由用户操作。
- 再次运行 `npm run verify`：83项测试全部通过，24页面/53个JS文件通过项目校验。
- 发布门槛未满足：正式模式积分榜无服务端数据、嘉宾全文仅在私有体验包内、悬赏互动与结算仅本机模拟、档案修改未跨设备保存。
- 因此只保存到独立开发分支 `codex/miniprogram-community-acceptance-20260830`；不把体验确认等同于生产功能验收，不执行主分支合并、服务部署或微信后台上传。
- 本次变更范围仅小程序代码、测试及说明；融资投影和站点情报数据的其他工作区变化不并入该开发提交。


## 2026-08-15 V0.6.4 融资统计卡视觉统一

- Source visual truth: `C:\Users\86186\Downloads\56503485.jpg`，原图 1180 × 2556 px；以生态图谱“商业主体全景”卡片为字体、排版、粗细和层级基准。原融资页截图为 `C:\Users\86186\Downloads\856892404.jpg`。
- Implementation screenshot: `C:\Users\86186\.codex\visualizations\2026\08\14\019ffec2-c996-7373-87d5-c4e8fbcce173\funding-metrics-v064-qa\implementation-393x180.png`，393 × 180 px、1× 密度；卡片按小程序实际 WXML 层级和 WXSS 数值渲染。
- Focused side-by-side comparison: `C:\Users\86186\.codex\visualizations\2026\08\14\019ffec2-c996-7373-87d5-c4e8fbcce173\funding-metrics-v064-qa\comparison-ecology-funding.png`；生态参考卡与融资实现卡均归一化为 361 × 120 px 后并排比较。
- State: 融资页全球范围，226 条融资、本周 6 条，更新日期 2026-08-15。
- Typography: 标题统一为宋体 29rpx/700；指标数字统一为宋体 44rpx/700；标签统一为 20rpx 常规字重。日期因十位字符长度保留 28rpx/700，以避免换行和截断。
- Spacing and layout: 与生态卡一致采用上方标题层和下方三等分指标层；标题层 26/28/20rpx 内边距，指标层 26/10/30rpx 内边距，分隔线透明度和圆角一致。
- Colors and tokens: 深海军蓝渐变、香槟金指标、白色标题及半透明辅助文字全部复用生态卡现有色值。
- Image quality and assets: 本组件不包含图片或图标资产；未新增或替代可见资产。
- Copy and behavior: 仅新增“融资动态全景 / 全球 · 中国”结构标题；融资、本周、更新及所有动态值保持原数据绑定，筛选与列表逻辑未改。
- Findings: 首轮归一化对照未发现 P0/P1/P2 差异；日期字号差异属于必要的内容适配，不影响层级和对齐。
- Regression verification: `npm run verify` 通过，55/55 测试通过；17 个页面、37 个 JavaScript 文件及 976,721 bytes 包体校验通过。Console errors: none.

final result: passed

---

## 2026-08-15 V0.6.3 生态图谱搜索与栏目顺序

- Source visual truth: `C:\Users\86186\Downloads\218112661.jpg`，原图 1180 × 2556 px；用户要求将搜索栏与“企业库 / 机构库 / 人物库”切换栏上下互换。
- Implementation screenshot: `C:\Users\86186\.codex\visualizations\2026\08\14\019ffec2-c996-7373-87d5-c4e8fbcce173\market-order-v063-qa\implementation-393x300.png`，按小程序实际 WXML 层级和 WXSS 数值在 393 px 手机宽度渲染。
- Side-by-side comparison: `C:\Users\86186\.codex\visualizations\2026\08\14\019ffec2-c996-7373-87d5-c4e8fbcce173\market-order-v063-qa\comparison-search-tabs.png`；左侧为原真机顺序，右侧为 V0.6.3 修改后顺序。
- Fix: 搜索栏移至栏目切换栏上方；原先的 26rpx 首段间距和 20rpx 相邻间距随位置互换，控件高度、颜色、圆角、字体、金色选中线及列表结构保持不变。
- Interaction verification: 企业库、机构库、人物库切换仍会更新输入提示语和结果数量；搜索输入事件、清空事件与主体详情入口未改动。
- Regression verification: `npm run verify` 通过，55/55 测试通过；17 个页面、37 个 JavaScript 文件及 975,965 bytes 包体校验通过。
- Console errors: none.

final result: passed

---

## 2026-08-15 V0.6.2 底部导航贴边修复

- Source visual truth: `C:\Users\86186\Downloads\1927083506.jpg`，原图 1180 × 2556 px；用户标注目标为底部导航按钮贴合屏幕边框、下方不留白。
- Implementation screenshot: `C:\Users\86186\.codex\visualizations\2026\08\14\019ffec2-c996-7373-87d5-c4e8fbcce173\tabbar-v062-qa\implementation-393x852-full.png`，使用小程序 `custom-tab-bar` 的同一结构与视觉数值在 393 × 852 CSS px、1× 密度下渲染。
- Focused side-by-side comparison: `C:\Users\86186\.codex\visualizations\2026\08\14\019ffec2-c996-7373-87d5-c4e8fbcce173\tabbar-v062-qa\comparison-bottom-nav.png`；左侧为真机问题区域，右侧为修复后组件。
- State: 融资页，第一项选中；四项文本导航、短分隔线和金色顶部标记保持原样。
- Earlier P1 finding: 安全区由 `.tab-bar` 的外部 `padding-bottom` 承担，导致四个按钮（尤其选中态底色和点击区域）在屏幕底边前结束，形成明显白条。
- Fix: `.tab-bar` 外边距归零；将 `safe-area-inset-bottom` 计入每个 `.tab-button` 的最小高度与内部底部留白，按钮背景和点击区域随导航容器延伸到 `bottom: 0`。
- Post-fix evidence: 浏览器实测 `screen.bottom = 852`、`tab-bar.bottom = 852`、`active-button.bottom = 852`、`bottomGap = 0`。
- Required fidelity surfaces: 字体、字号、字重、文字内容、暖白/香槟金/深海军蓝色值、分隔线、圆角和顶部标记均未改动；本次只调整底部安全区的布局归属。页面无新增图片资产。
- Primary interaction: 四个导航单元均保留完整按钮区域；此次组件级修复未改变页面切换事件绑定。
- Console errors: none.

final result: passed

---

## 2026-08-15 V0.6.1 融资金额与底栏优化

- Source visual truth: `C:\Users\86186\Downloads\1257227072.jpg`（用户真机截图）。
- Target state: 融资页默认“全球”在前、“中国”在后；中国列表不重复显示地区角标；人民币标准金额仅显示“元”；底部文本导航收紧安全区上方留白。
- Code and data verification passed: 259 张融资卡重新生成；全部 CNY 标准金额在融资源、PC 融资投影、Data Center 投影和小程序内置数据中均不再含 `人民币`、`CNY` 或 `RMB` 后缀；55 个小程序行为与公开文案测试通过。
- Native implementation capture: blocked. 微信开发者工具 RC 2.02.2607271 在仓库路径和短临时路径中均错误报告 `pages/community-apply/index.wxml` 不存在；Git、文件系统和项目校验均确认该文件存在，17 个页面路径全部有效。重置 DevTools fileutils 后问题仍复现，因此未伪造替代截图或 side-by-side comparison。

final result: blocked (native simulator capture only; implementation and project validation passed)

---

## 2026-08-14 个人资料与手机号绑定修复

- Source visual truth: 用户提供的“账号与联系”真机截图；implementation capture: `C:\Users\86186\.codex\tmp\wavesight-profile-fix\profile-edit.png`；side-by-side comparison: `C:\Users\86186\.codex\tmp\wavesight-profile-fix\comparison.png`。
- Removed the WeChat-ID row, privacy implementation note, pending-backend state, preview/production wording, and redundant account-section split.
- Rebuilt the remaining content as a compact completion summary, one cohesive profile-settings card, and a single primary save action using the existing warm-white, deep-navy, and champagne-gold system.
- Phone authorization now exchanges the one-time code through the account service and returns a masked bound number; the Mini Program no longer creates a local pending state.
- Visual comparison passed for hierarchy, spacing, type scale, card radius, divider contrast, control affordance, capsule-safe header, and removal of all requested copy.
- `npm run verify`: 43 tests passed; 16 pages and 33 JavaScript files validated.
- Payment/account service: 14 pytest cases passed, including code exchange, masked-only storage, unique phone binding, and access-token reuse.
- WeChat Developer Tools preview compiled with production AppID `wx34133741173154d4`; package size 754,564 bytes. Simulator capture completed from `pages/profile-edit/index`.

final result: passed

---

## 2026-08-14 分享、签到与邀请注册修复

- Source visual truth: 用户提供的周报、融资详情、企业档案及邀请好友真机截图。
- Financing and ecosystem detail pages now expose native WeChat session and Moments sharing with stable deep links.
- Reports opened from a share show a persistent text navigation fallback; direct-entry back actions return to the relevant tab.
- Profile growth tasks include an idempotent “每日签到” task worth 5 points.
- Invitee pages now lead with “邀请人昵称 + 邀请你来”, place the WeChat registration CTA directly below the hero, and provide direct-entry tab navigation.
- Inviter pages remove the repeated hero helper sentence and show server-confirmed invited visitors, successful registrations, and reward points.
- `npm run verify`: 41 tests passed; 16 pages and 33 JavaScript files validated.
- Payment/invitation service: 11 pytest cases passed, including duplicate visit and duplicate registration protection.
- WeChat Developer Tools CLI preview succeeded with production AppID `wx34133741173154d4`; package size 753,592 bytes.

final result: passed

---

## Scope

- Source visual truth: approved full-page UI demo at `C:\Users\86186\.codex\visualizations\2026\08\13\wavesight-full-ui-demo`.
- Target: native WeChat Mini Program, iOS capsule safe area, text-only system tab bar.
- States: splash, 融资情报、生态图谱、商业观察、我的、融资详情与公司比较。
- Production AppID: `wx34133741173154d4`.

## Fidelity review

| Surface | Result | Notes |
|---|---|---|
| Splash | Pass | Official horizontal logo, slogan and subtitle remain centered; divider, progress copy and extra footer were removed. |
| Header and navigation | Pass | First three tabs retain the official logo at left and four-character title centered; native tab bar remains text-only with no icons. |
| Funding | Pass | Search-only entry, navy statistics band, daily-new label and compact rows match the approved hierarchy. List collection/compare controls are absent. |
| Ecosystem | Pass | Navy “商业主体全景” summary, lightweight type tabs, direct search and compact enterprise/institution/person rows match the approved direction. |
| Observe | Pass | Navy featured report leads the page; weekly/monthly tabs and archive cards follow beneath it. |
| Profile | Pass | Observer growth remains primary; membership is compact; the redundant browse/favorite/follow statistic strip is absent. |
| Detail actions | Pass | Collection and 2–3 company comparison selection remain in financing detail; the dedicated comparison page remains available. |

## Validation

- `npm run verify`: 33 tests passed; 16 pages and 31 JavaScript files validated.
- Generated public data: 255 financing cards, 11 reports, latest funding dataset date `2026-08-13`.
- WeChat Developer Tools was opened with the production project and compile cache refreshed. The installed tool intermittently reports its pre-existing missing-file simulator error for `pages/compare/index.wxml`; the repository validator confirms the file exists and all page/component paths are valid.
- H5 implementation was rendered beside the approved demo at the same mobile state. Mini Program WXML/WXSS uses the same visual tokens and page hierarchy with native capsule/tab-bar adaptations.

final result: passed
## 2026-08-30 原生隔离体验（历史验收阶段）

- 基线：线上0.8.3后续开发分支；按已确认高保真Demo的首页实录优先方案实现。
- 首页：精选实录 → 两张往期实录 → 悬赏令 → 行业图谱；不显示排期或积分条。底部导航不改设计。
- 行业图谱：角色选择后直接名单，删除角色大卡和重复标题；保留通讯录、我的档案。
- 原生兼容：将计划、积分、图谱中遗留的HTML标签改为原生text/view组件；WXML逻辑表达式使用原生运算符。
- 防回归：测试覆盖草稿与回答持久化、重复报名、仅发起人结案、整数预算与重复结案、零积分账户、体验申请不调用生产接口、不落盘联系方式、档案回显。
- 原生验证：微信开发者工具已成功渲染社区首页、第10期实录入口与嘉宾全文阅读页。首次新工程使用浮动基础库trial时错误报告文件缺失/41002；固定为原工程已验证的3.17.0后编译及preview成功。构建脚本保留此预防措施。
- 验证结果：83项测试通过；24个原生页面/53个JS文件通过项目校验；最终扫码包765617字节。
- 当时体验边界：私有实录注入独立扫码包，示例互动仅写本机；当时完整生产服务端尚未接入，不作为生产发布凭据。
- 用户随后确认推送部署，并要求补齐生产服务与 PDF 个人档案证据。生产候选已完成：会员服务 50 项测试、小程序 89 项测试通过；固定基础库 3.17.0 的正式配置原生 preview 编译成功（745743 字节）。生产 API 故障和权限撤回不会回退示例正文，证据档案来源跳转与跨设备修改已纳入回归。部署及上传状态以本次发布记录为准，不将编译成功等同线上业务验收。

---
