---
task_id: WSD-20260524-column-filter-rail-alignment
title: 商业信号与趋势追踪栏目筛选栏位置统一 closeout
date: 2026-05-24
status: completed
owner: Codex / Experience & Editorial / Build & Release
encoding: UTF-8
revision: 20260524-1328
---

# WSD-20260524 商业信号与趋势追踪栏目筛选栏位置统一 closeout

## 1. 执行结论

本轮按用户要求，以「今日观察」首屏日期 / 标签筛选栏的位置作为基准，统一了「商业信号」和「趋势追踪」栏目页的筛选栏版心、顶部位置和宽度。

最终三页在桌面视口下已对齐：

| 页面 | x | y | width | height |
|---|---:|---:|---:|---:|
| 今日观察 | 414 | 106 | 1220 | 58 |
| 商业信号 | 414 | 106 | 1220 | 58 |
| 趋势追踪 | 414 | 106 | 1220 | 58 |

## 2. Harness 与上下文

本任务属于页面 / UI / 排版微调，执行 Page / Copy / Typography Harness 的轻量路径。

已读取：

- `context/00-current-state.md`
- `context/02-vi-style.md`
- `context/04-qc-rules.md`
- `context/06-execution-harness.md`

未额外补读二级引用。原因：本轮只统一现有筛选条位置，不新增页面结构、字体体系、文案体系或品牌资产。

## 3. 已修改文件

| 文件 | 修改内容 |
|---|---|
| `01-SiteV2/site/assets/styles.css` | 新增栏目筛选栏对齐规则，将商业信号、趋势追踪的筛选条统一到今日观察的 `1220px` 版心和首屏顶部位置 |
| `01-SiteV2/site/*.html` | 更新 CSS 资源版本号到 `20260524-1328`，避免浏览器继续使用旧样式缓存 |

## 4. 视觉规则

本轮没有重做筛选组件，只做位置收口：

- 不改变今日观察现有筛选栏。
- 商业信号复用今日观察的首屏 x / y / width / height 对齐标准。
- 趋势追踪复用同一标准。
- 不新增颜色、字体、按钮样式或文案。
- 不改变一级导航。
- 不修改 Logo、SVG、VI token 或部署配置。

## 5. 验证记录

已执行：

```powershell
git diff --check -- 01-SiteV2/site/assets/styles.css 01-SiteV2/site/*.html
```

结果：

- 空白检查通过。
- 仅有 Git 对历史 HTML 行尾格式的提示，不构成本次功能阻断。

浏览器运行态测量：

```text
daily.html          .daily-article-datebar                         x=414 y=106 width=1220 height=58
signals.html        .signal-command-bar-minimal.daily-article-datebar x=414 y=106 width=1220 height=58
trend-tracking.html .trend-lab-command.daily-article-datebar          x=414 y=106 width=1220 height=58
```

结论：三页筛选栏位置已完全一致。

## 6. 未做事项

- 未删除文件。
- 未修改 `AGENTS.md`。
- 未修改数据内容、卡片字段、标题翻译或观点内容。
- 未运行数据同步、自动化任务、Netlify 部署或 GitHub 操作。
- 未对移动端做专项重排，本轮验收以桌面首屏为准。

## 7. 后续风险

- `styles.css` 已有较多历史追加样式，本轮采用末尾覆盖规则完成低风险收口。若后续继续大改商业信号或趋势追踪页面，建议单独做一次样式分层清理，避免页面级规则继续堆叠。
- HTML 资源版本号已统一刷新，若线上仍显示旧样式，优先检查浏览器缓存、静态服务缓存或部署缓存。
