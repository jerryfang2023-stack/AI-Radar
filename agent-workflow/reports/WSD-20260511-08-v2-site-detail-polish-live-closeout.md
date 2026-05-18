# WSD-20260511-08-v2-site-detail-polish-live Closeout

## 任务口径

- 执行窗口：V2 网站细节修改 live 窗口
- 范围：仅处理 `01-SiteV2/site/` 页面细节、局部文案与排版；同步补充本任务涉及的 COPY / writing skill 规则
- 状态：ready_for_independent_review
- 收口时间：2026-05-11T18:39:17+08:00

## 本轮完成

1. 今日要点页
   - 日期切换改为真实日期页面链接。
   - 删除顶部往日内容列表、辅助说明语言和“今日判断支撑证据”展示。
   - 今日判断按观澜文风重写为商业观察者视角，历史日期也按同一规则生成短标题、主判断、商业观察与右侧补充判断。
   - 删除“变化到了哪一步”模块。
   - 新增 `Builders 观点` 模块，与 `延申阅读` 同排；`机会观察` 下移到底部。
   - Builders 观点仅取 `follow-builders` 或 X/Twitter 等明确 builder 来源；不再用新闻稿 / 官方 PR 凑数。
   - Builders 卡片改为先显示名称和职位，再显示原始观点与观澜解读。
   - 商业信号、Builders 观点、延申阅读、机会观察均按所选日期联动，不再固定展示今天内容。

2. 首页
   - “今天先看三件事”改为 `今日判断`。
   - 今日判断右侧三张卡改为经营判断型内容：采购前提、上线门槛、证据类型。
   - 三张卡片等高拉齐；删除每张卡重复的“影响对象”和“阅读原文”，只保留左侧核心卡统一入口 `查看今日要点`。
   - 今日判断和商业信号标题同步使用优化后的短标题逻辑，避免与下方关键信号重复。

3. 视觉与排版
   - 页脚全站间距继续压缩并统一。
   - 商业信号标题加粗。
   - 延申阅读从半宽双列改为单列列表式卡片，降低拥挤感。
   - 首页卡片密度、行高、等高关系和底部入口对齐做了多轮截图校准。

4. 文案规则
   - 已将“今日判断主块写法”补充到：
     - `skills/guanlan-writing-style/SKILL.md`
     - `agent-workflow/product/COPY.md`
   - 规则强调：商业观察者视角、一段主判断加自然段落、覆盖变化 / 重要性 / 判断依据 / 影响对象，不使用 Q&A / 边框分点 / “结论先放在前面”。

## 主要修改文件

- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`
- `01-SiteV2/site/daily.html`
- `01-SiteV2/site/index.html`
- `agent-workflow/product/COPY.md`
- `skills/guanlan-writing-style/SKILL.md`
- `01-SiteV2/site/assets/generated/daily-brief-source-flow-imagegen.png`

## 验证

- 多次运行并通过：`node --check 01-SiteV2/site/assets/app.js`
- 本地页面服务检查通过：`http://127.0.0.1:4177/`
- 已用桌面浏览器截图检查首页与今日要点页关键区域，包括：
  - `agent-workflow/reports/screenshots/WSD-20260511-08-home-daily-judgment-aligned.png`
  - `agent-workflow/reports/screenshots/WSD-20260511-08-home-one-entry-cards.png`
  - `agent-workflow/reports/screenshots/WSD-20260511-08-builders-person-first-v2.png`
  - `agent-workflow/reports/screenshots/WSD-20260511-08-builders-index-layout-fixed.png`
  - `agent-workflow/reports/screenshots/WSD-20260511-08-daily-builders-history.png`

## 待主窗口注意

- 本窗口为开发 / 文案 / 视觉细节执行窗口，不做独立 QA accepted。
- 建议主窗口按页面文案质量门禁再派独立质检，重点看：
  - 首页“今日判断”是否与“关键信号”分工清楚。
  - 今日要点历史日期是否按日期正确联动。
  - Builders 观点来源是否符合 follow-builders / X / YouTube 口径。
  - Tags 聚合页需求尚未完成：用户已提出 tags 体系、栏目名一致、tag 可点击进入聚合页，此项应另起后续任务或继续派发。

