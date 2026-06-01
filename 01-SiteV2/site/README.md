# V2.2.1 Site

状态：current-site-workbench
更新时间：2026-05-24

## 定位

本目录是观澜 AI V2.2.1 网站工程入口。

## 任务启动

站点开发任务默认只读取：

1. `AGENTS.md`
2. `context/00-current-state.md`
3. `context/02-vi-style.md`
4. 当前任务派发单
5. 派发单指定的页面、组件或数据文件

文案任务补读 `context/03-copy-style.md` 和 `skills/guanlan-copy-style/SKILL.md`。
字体任务补读 `docs/brand/wavesight-ai-vi/page-typography-position-guidelines.md` 和 `skills/guanlan-typography-qc/SKILL.md`。

## 开发原则

- 桌面端优先。
- 普通前台不出现后台、同步、JSON、恢复、编辑等内部痕迹。
- 页面生成前先有 Typography 页面位置表和 Copy-first 文案表。
- GitHub / Netlify 推送或部署必须等用户明确确认。
