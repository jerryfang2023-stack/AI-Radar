# WSD-20260511-08｜V2 网站细节修改实时窗口

状态：ready  
牵头 Agent：UI / UE Agent + Copy Agent + Dev Agent  
任务类型：轻量页面细节修改 / 桌面端优先  
执行方式：用户在执行窗口中逐条指出细节，执行窗口直接修改并即时验证  

## 1. 任务目标

建立一个专门用于 V2 网站细节微调的执行窗口。

这个窗口只处理小范围、可即时确认的页面细节：

- 文案删减、改短、统一口径
- 按钮、链接、栏目入口、卡片可点击性
- 字号、行距、间距、对齐、卡片高度
- 首页和栏目页局部视觉细节
- 不改变产品结构、不新增栏目、不重做大页面

## 2. 必读规范

进入窗口后只读取：

1. `AGENTS.md`
2. `agent-workflow/governance/current-context.md`
3. 本派发单：`agent-workflow/execution/WSD-20260511-08-v2-site-detail-polish-live.md`
4. VI 规范：
   - `docs/brand/wavesight-ai-vi/USAGE.md`
   - `docs/brand/wavesight-ai-vi/visual-identity-guidelines.md`
   - `docs/brand/wavesight-ai-vi/typography-guidelines.md`
   - `docs/brand/wavesight-ai-vi/brand-tokens.css`
5. 文案规范：
   - `agent-workflow/product/COPY.md`

除非用户明确要求，不读取历史 closeout、旧任务、旧 V1 文件、旧设计报告或长篇交接文件。

## 3. 执行范围

默认只修改：

- `01-SiteV2/site/*.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- 必要时引用 `01-SiteV2/site/assets/brand/` 或 `01-SiteV2/site/assets/generated/` 现有资产

不得修改：

- `09-ai-news-radar/`
- `10-Archive/`
- 每日自动化任务
- 内容生成 pipeline
- 会员定价、支付、部署、Netlify、GitHub 同步
- VI 正式 Logo / SVG 源资产
- 数据 schema 或站点生成器

## 4. 工作方式

用户会在窗口中逐条提出细节修改。

每次修改按以下方式执行：

1. 判断是否属于“小范围细节修改”。
2. 若属于，直接修改对应文件。
3. 修改后至少运行：

```powershell
node --check 01-SiteV2/site/assets/app.js
```

4. 涉及布局、点击、视觉位置时，打开本地页面截图确认。
5. 简短回复用户：改了哪里、是否通过检查。

如果用户提出的内容变成“大改版 / 新栏目 / 新功能 / 内容生产线 / 会员系统 / 部署”，立即暂停，回调度窗口重新派发任务。

## 5. 文案处理口径

按 `COPY.md` 执行：

- 少解释，多判断。
- 能短就短。
- 不写内部流程词。
- 不写营销套话。
- 不写“本页用于”“入口”“证据链”“强证据”等内部口径。
- 页面文案应像一个冷静、有判断的商业内参，而不是 AI 新闻站说明文。

## 6. 视觉处理口径

按 VI 规范执行：

- 背景默认 `#fffdf8` / `--gl-bg-page`。
- 使用现有 token，不新增冲突色板。
- 字体遵守标题衬线、正文黑体、英文标签 Inter、数字等宽字体的角色分工。
- Logo 只引用正式 SVG，不重画。
- 桌面端优先；移动端只保证不严重破版和无横向溢出。

## 7. 验收要求

每轮细节修改至少满足：

- 页面可打开
- 无明显错别字
- 无明显横向溢出
- 修改点符合 VI 与文案规范
- 不引入后台词、内部词或无意义说明

阶段结束时写 UTF-8 closeout：

`agent-workflow/reports/WSD-20260511-08-v2-site-detail-polish-live-closeout.md`

closeout 需包含：

- 修改文件
- 修改摘要
- 用户现场确认点
- 已运行检查
- 未处理或需要另派任务的问题

