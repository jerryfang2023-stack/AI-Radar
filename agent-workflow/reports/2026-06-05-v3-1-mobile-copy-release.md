---
status: current
scope: release-record
version: V3.1-data-observation-mobile-copy
date: 2026-06-05
---

# V3.1 Release Record｜数据观察台移动端与文案治理版

## 版本定义

- 版本号：V3.1-data-observation-mobile-copy
- Git tag：`v3.1-data-observation-mobile-copy`
- 当前入口：`01-SiteV2/site/v3-data-observation.html`
- 版本性质：V3 数据观察台的小版本升级，不改变 Raw / Pool / Card / 观点 / 趋势资产生产主链路。

## 移动端变化

- 数据观察台适配手机端浏览。
- 首屏统计模块压缩空间，避免移动端首屏被统计卡占满。
- 趋势模块在手机端改为一行一列，避免双列卡片把页面拉长。
- 商业信号工作区在移动端保留当日日期和核心筛选，不再显示重复的 Card 数量小行。

## 文案与标题变化

- `TABLE / CARDS` 和 `Card 工作区` 改为商业信号 / Business Signals。
- 商业信号标题优先使用可追溯原文标题，再进入中文展示。
- 英文标题、英文摘要和英文详情在前台展示前必须中文化。
- 暂停并删除观澜前台文案规范与文案门禁，避免旧文案规则把标题改成机械判断句。
- V3 数据包过滤机械模板、旧合成标题和英文详情直出。

## 保留内容

- V3 数据观察台仍然保留每日 Raw / Pool / Card / 观点 / 趋势资产。
- 运营后台、运营仪表盘、管线仪表盘和管理入口继续保留。
- V2 静态页面仅作为本地存档，不作为当前前台执行依据。

## 验证记录

- `node --check 01-SiteV2/site/assets/v3-data-observation-desk.js`
- `node --check 01-SiteV2/site/scripts/build-v3-data-observation-desk.mjs`
- `node --check agent-workflow/tools/run-quality-gates.mjs`
- `node agent-workflow/tools/frontstage-regression-gate.mjs`
- 移动端 smoke：390px 视口确认商业信号标题、中文详情、趋势模块单列和无横向溢出。
