---
task_id: WSD-20260523-trend-page-current-trend-formation-copy
date: 2026-05-23
status: completed
scope: trend-tracking-frontstage
---

# 趋势页当前趋势成形说明收口

## 1. 本次目标

围绕趋势追踪栏目页继续收口：

- 删除顶部栏目介绍和主题标题。
- 搜索栏改为与其他栏目一致的日期 / 标签筛选条。
- 主卡突出当前趋势判断和“为什么正在形成”。
- 右侧不再重复左侧主标题。
- 原四个说明块改为挂在右侧的当前趋势关联统计。
- 如果趋势候选没有成形说明，前台应明确标注；本次进一步补齐正式前台文案字段，不再长期依赖兜底。

## 2. 主要改动

### 2.1 趋势候选前台文案

为两条真实趋势候选补充前台展示字段：

- `frontend.whyForming`
- `frontend.relationSummary`
- `frontend.publicBoundary`

涉及文件：

- `01-SiteV2/content/06-asset-candidates/trend/2026-05-22--trend-candidate--enterprise-agent-deployment-shifts-to-workflow-context-and-governance.md`
- `01-SiteV2/content/06-asset-candidates/trend/2026-05-21--trend-candidate--enterprise-agent-budget-and-workflow-signals-are-accumulating.md`
- `01-SiteV2/knowledge/03-Asset-Candidates/trend/2026-05-22--trend-candidate--enterprise-agent-deployment-shifts-to-workflow-context-and-governance.md`
- `01-SiteV2/knowledge/03-Asset-Candidates/trend/2026-05-21--trend-candidate--enterprise-agent-budget-and-workflow-signals-are-accumulating.md`

### 2.2 数据同步

更新 `01-SiteV2/site/scripts/sync-v2-site-data.mjs`：

- 解析趋势候选 `frontend` 块。
- 将 `whyForming`、`relationSummary`、`publicBoundary` 写入 `contentIndex.trends`。
- 重新生成 `01-SiteV2/site/data/site-content.json` 与 `01-SiteV2/site/data/site-content.js`。

### 2.3 趋势页前台

更新：

- `01-SiteV2/site/trend-tracking.html`
- `01-SiteV2/site/assets/app.js`
- `01-SiteV2/site/assets/styles.css`

结果：

- 页面顶部无栏目介绍 / 主题标题。
- 筛选条与今日观察 / 商业信号一致。
- 左侧主卡优先展示正式“为什么在形成”文案。
- 没有正式文案时才显示“暂缺成形说明”兜底。
- 右侧面板改为“当前趋势关联”，突出它服务左侧当前趋势。
- 右侧“其他趋势”排除当前趋势，不再重复左侧标题。
- 点击不同日期的其他趋势会跳转到对应日期。

## 3. 前台当前效果

当前 `TRC-20260522-01` 前台展示：

- “为什么在形成”不再显示“暂缺成形说明”。
- 成形说明完整展示，不截断。
- 关系说明解释关联材料如何指向左侧判断。
- 边界说明提醒它仍是正在形成的趋势，不升级为成熟趋势报告。
- 右侧统计显示：
  - 共同变量
  - 关联信号
  - 关联案例 / 产品
  - 关联观点

## 4. 验证

已运行：

```text
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
node agent-workflow/tools/check-tags.mjs
node agent-workflow/tools/run-quality-gates.mjs syntax
```

验证结果：

- 数据同步成功。
- `site-content.json` / `site-content.js` 已包含两条趋势候选的 `whyForming`、`relationSummary`、`publicBoundary`。
- 标签质量门通过，未知 tag 为 0。
- syntax 质量门通过，失败项 0。
- 浏览器检查通过：
  - 不再出现“暂缺成形说明”。
  - 成形说明完整展示，无省略号。
  - 页面无横向溢出。
  - 无前台 JS 报错。

## 5. 未做事项

- 未新增一级导航。
- 未修改 VI token、Logo 或 SVG 资产。
- 未部署。
- 未推送。
- 未把趋势候选升级为正式趋势报告。
- 未删除文件。

## 6. 后续建议

后续新建趋势候选时，应把 `frontend.whyForming`、`frontend.relationSummary`、`frontend.publicBoundary` 作为前台展示必备字段处理；页面兜底只用于旧数据或临时缺字段，不应成为长期展示形态。
