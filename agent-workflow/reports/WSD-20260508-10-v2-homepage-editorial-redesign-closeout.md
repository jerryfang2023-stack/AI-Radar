# WSD-20260508-10 V2 首页商业内参式重排收口

## 任务

用户反馈首页排版堆砌、杂乱、粗糙，缺少商业内参的美感、严谨感和阅读体验。本轮只重排首页，不改其他栏目页主结构。

## 使用规范

- 使用 `redesign-existing-projects` 的现有项目重设计思路。
- 使用 `high-end-visual-design` 的高级视觉判断标准。
- 未使用用户明确排除的 `frontend-design` 技能。
- 继续遵守观澜 AI VI：中文标题宋体类、正文黑体类、英文标签、墨海蓝 / 雾蓝灰 / 香槟金体系。

## 改动范围

- `01-SiteV2/site/index.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`

## 完成内容

- 移除首页原先的连续栏目堆叠结构：`home-entry-band`、多个普通 section 的顺序堆砌不再作为首页骨架。
- 首页改为四段阅读路径：
  1. 首屏品牌判断与融合视觉图。
  2. `home-briefing`：左侧今日主判断，右侧今日关键信号。
  3. `home-secondary`：机会解码与相关观察。
  4. `home-timeline`：轻量近期归档。
- 今日主判断改为商业内参式主阅读卡，展示标题、导语和 3 条核心判断。
- 今日关键信号改为纵向情报索引，不再使用三列卡片堆叠。
- 相关观察收敛为 1 条，避免首页信息过载。
- 近期归档只展示前 4 条，降低底部噪音。

## 验证

- `node --check 01-SiteV2/site/assets/app.js`：passed
- `node --check 01-SiteV2/site/dev-server.mjs`：passed
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：passed
- 最新语法门禁报告：`agent-workflow/reports/quality-gates-syntax-2026-05-07-20260507-201218.md`

## 截图与浏览器检查

目录：`agent-workflow/reports/v2-homepage-editorial-redesign-2026-05-08/`

- `desktop-home-top.png`
- `desktop-home-scroll.png`
- `mobile-home.png`
- `homepage-editorial-qa.json`

关键结果：

- 2048px 桌面：无横向溢出。
- 1440px 桌面滚动抽查：无横向溢出。
- 390px 移动端：单列布局，无横向溢出。

## 未做

- 未部署 Netlify。
- 未提交 Git。
