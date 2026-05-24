---
task_id: WSD-20260523-home-business-signals-guanlan-comment
title: 首页商业信号观澜点评补强 closeout
date: 2026-05-23
status: completed
owner: Codex / Experience & Editorial / Build & Release
encoding: UTF-8
revision: 2026-05-23-home-signal-commentary
---

# WSD-20260523 首页商业信号观澜点评补强 closeout

## 1. 执行结论

本轮针对首页商业信号板块完成补强：卡片不再只展示新闻摘要，而是拆成“事实摘要 + 观澜点评”两层。

处理目标：

- 让首页商业信号不再显得空。
- 摘要只讲发生了什么。
- 观澜点评只讲这条信号对企业、采购、产品、组织或商业判断的意义。
- 不硬编没有来源的数据。
- 不暴露后台字段或内部生产语言。

## 2. 已修改文件

| 文件 | 修改内容 |
|---|---|
| `01-SiteV2/site/assets/app.js` | 为首页商业信号卡新增事实摘要与观澜点评取值逻辑；首页卡片渲染增加 `home-signal-fact` 与 `home-signal-comment` |
| `01-SiteV2/site/assets/styles.css` | 为首页商业信号点评块增加克制的金色左线、浅底色、字号和截断规则；保持卡片高度一致 |
| `01-SiteV2/site/*.html` | 更新前端资源缓存版本到 `20260523-1246` |

## 3. 字段与文案口径

首页商业信号卡片现在按以下顺序展示：

| 层级 | 前台显示 | 取值口径 |
|---|---|---|
| 一级 | 标题 | `frontend.displayTitle` 优先，缺失时使用卡片短标题 |
| 二级 | 事实摘要 | 优先使用 `frontend.eventLine`、结构化事件或来源事实摘要 |
| 二级 | 观澜点评 | 优先使用 `frontend.businessMeaning`，其次使用商业含义、入选理由等已存在字段 |
| 三级 | 标签 | 只展示 3 个前台标签 |
| 三级 | 更多入口 | 进入对应融资 / 案例 / 产品聚合页 |

文案约束：

- 不把标题当原文。
- 不把摘要伪装成原文引用。
- 不出现“边界、反证、后续观察、内部评级、displayLane”等后台词。
- 点评必须是商业解释，不写行动指导。

## 4. 预览结果

浏览器预览确认首页三张商业信号卡已出现观澜点评：

| 卡片 | 事实摘要 | 观澜点评状态 | 高度 |
|---|---|---|---|
| Netomi 融资 1.1 亿美元，押注高风险客户体验智能体 | 已显示 | 已显示 | 487px |
| Accenture 与 Amazon Business 推出企业采购 Ordering Agent | 已显示 | 已显示 | 487px |
| OpenAI 推出 Frontier，争取更多企业客户 | 已显示 | 已显示 | 487px |

高度一致，未出现底部错位或卡片撑裂。

## 5. 验证记录

已执行：

```powershell
node --check 01-SiteV2/site/assets/app.js
git diff --check -- 01-SiteV2/site/assets/app.js 01-SiteV2/site/assets/styles.css 01-SiteV2/site/*.html
```

结果：

- `app.js` 语法检查通过。
- diff 空白检查通过。
- 本地浏览器预览通过。

## 6. 未做事项

- 未删除文件。
- 未修改 `AGENTS.md`。
- 未改变一级导航。
- 未改 Logo、VI 正式资产或部署配置。
- 未补写没有来源支撑的新闻原文。

## 7. 后续风险

首页商业信号点评依赖已有结构化字段。如果后续入库卡片缺少 `frontend.businessMeaning` 或等价商业含义字段，前台会自然不显示点评块，避免硬编。后续 Raw / Pool / Card 入库时，应继续按 copy 规范补齐“事实摘要”和“观澜点评”两个前台字段。
