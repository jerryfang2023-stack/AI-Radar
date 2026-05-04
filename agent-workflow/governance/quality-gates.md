# Quality Gates

更新时间：2026-05-03  
owner：`qa` / `workflow`  
状态：长期生效

## 1. 定位

`quality-gates.md` 定义观澜AI每类任务完成前必须通过的质量闸门。

任何 agent 不应只报告“已完成”，而应说明通过了哪些检查、哪些检查未运行、哪些风险仍需人工复核。

## 2. 通用闸门

所有任务完成前至少检查：

- 是否符合 `strategy-single-source.md`。
- 是否违反 `agent-memory.md` 中的长期规则。
- 是否需要更新 `feature_list.json`。
- 是否需要更新 `progress.md`、`docs/agent-handoff.md` 或 `reports/`。
- 是否有未说明的人工确认项。

## 3. 内容更新闸门

适用于 Signals、Scoring、Trends、The Point、Opportunities 的内容新增或修改。

必须执行：

```powershell
node 04-Site/scripts/sync-data.mjs
node 04-Site/scripts/check-relations.mjs
```

如涉及 The Point，必须执行：

```powershell
node 04-Site/scripts/check-point-quality.mjs
```

必须人工或脚本检查：

- Signal 是否包含事件、证据、商业含义。
- 每日雷达 Signal 是否包含 6 点机会拆解。
- Opportunity 标题是否避开公司名。
- Trend 是否有证据、状态和反证。
- The Point 是否无 `t.co`、无 speaker/timecode 残留、无摘要冒充译文。
- 普通前台文案是否无 Markdown、JSON、同步、脚本、字段等后台语。

通过标准：

- 关系检查硬错误为 0。
- The Point 质量检查硬错误为 0。
- 软提醒有处理路径。
- 同步结果数量符合预期。

## 4. 页面与体验闸门

适用于首页、Daily Brief、Signals、The Point、Opportunities、Trends、Admin、会员页等页面调整。

必须检查：

- 桌面端页面无明显重叠、溢出、遮挡。
- 移动端页面单列或合理响应式，不横向滚动。
- 文本不挤压、不越出按钮或卡片。
- 普通前台无后台入口、同步、编辑、JSON、恢复等痕迹。
- 受限内容在未登录、试读有效、试读到期、管理员四种状态下表现正确。

建议输出：

```text
agent-workflow/reports/<page-or-module>-browser-qa-YYYY-MM-DD.md
```

## 5. 自动化闸门

适用于每日雷达、The Point、统一同步、质量检查、定时任务。

必须检查：

- 自动化不会生成空文件。
- 自动化不会覆盖上一版有效数据。
- 失败时写入 `agent-workflow/daily-run-log.md`。
- 失败时标记 `needs_review`，不得进入首页精选。
- The Point 不单独触发网站同步。
- 内容生成与网站同步有明确闸门。

通过标准：

- 有成功日志或失败降级日志。
- 有输入、输出、失败原因和下一步。
- 不产生前台污染。

## 6. 数据模型闸门

适用于字段、schema、标签、关系网络、检查脚本调整。

必须检查：

- 核心实体有稳定 ID 和 slug。
- 字段变更不会破坏同步脚本。
- 新字段有来源、用途、展示规则和缺失处理。
- 标签不会无限膨胀，有 group、alias 和合并规则。
- 关系检查覆盖新增实体。

通过标准：

- `sync-data.mjs` 可运行。
- `check-relations.mjs` 可运行。
- 新字段在产品模型或 PRD 中有定义。

## 7. 开发闸门

适用于代码、脚本、页面、样式修改。

常用检查：

```powershell
node --check 04-Site/scripts/sync-data.mjs
node --check 04-Site/scripts/check-relations.mjs
node --check 04-Site/js/app.js
node 04-Site/scripts/sync-data.mjs
node 04-Site/scripts/check-relations.mjs
```

如修改特定脚本，必须对该脚本运行 `node --check`。

通过标准：

- 语法检查通过。
- 同步通过。
- 关系检查硬错误为 0。
- 改动范围与任务目标一致。

## 8. 发布前闸门

云端部署或对外发布前必须补齐：

- 版本管理方案。
- 备份方案。
- 回滚方案。
- 权限方案。
- 数据写入方案。
- 多身份验收。
- release checklist。

阻塞问题未清零，不建议发布。

## 9. 未运行检查的处理

如果某项检查未运行，最终报告必须说明：

- 未运行什么。
- 为什么未运行。
- 风险是什么。
- 后续由哪个 agent 补做。

不能把未验证的结果报告为已通过。
