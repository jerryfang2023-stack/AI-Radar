# Quality Gates

更新时间：2026-05-10
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

### 2.1 V2-only 路径口径

当前项目默认处于 V2-only 生产开发：

- V2 网站工程：`01-SiteV2/site/`。
- V2 内容生产线：`01-SiteV2/content/`。
- V1 旧站 `04-Site/` 已归档到 `10-Archive/v1.0/site/04-Site/`，只作历史参考。
- 本文件中旧 `04-Site` 检查命令只适用于追溯 V1 归档或兼容历史报告；V2 当前任务不得把旧命令当作完成条件。

V2 当前常用入口：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
node agent-workflow/tools/v2-source-quality-gate.mjs --date=YYYY-MM-DD
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/dev-server.mjs
```

## 3. 内容更新闸门

适用于 V2 Signals、Trend Context、Point Calibration、Opportunity、Commercial Brief 等内容新增或修改。

V2 内容任务必须优先执行：

```powershell
node agent-workflow/tools/run-quality-gates.mjs v2content --date=YYYY-MM-DD
node agent-workflow/tools/run-quality-gates.mjs syntax
```

如涉及来源或接口升级，必须执行：

```powershell
node agent-workflow/tools/v2-source-quality-gate.mjs --date=YYYY-MM-DD
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

### 5.1 V2 Source Registry 闸门

适用于 V2 每日内容抓取来源、接口、source registry、source probe 和来源降级策略。

必须执行：

```powershell
node --check agent-workflow/tools/v2-source-probe.mjs
node --check agent-workflow/tools/v2-source-quality-gate.mjs
node agent-workflow/tools/v2-source-quality-gate.mjs --date=YYYY-MM-DD
```

建议执行：

```powershell
node agent-workflow/tools/v2-source-probe.mjs --date=YYYY-MM-DD
```

通过标准：

- `source-registry-v2.json` 可解析。
- 默认启用来源字段完整，且至少覆盖 4 类来源。
- S / A / B 来源均存在。
- `requires-key` / `requires-consent` 来源默认不启用。
- C 级来源不能标记为事实主证据。
- probe 结果只用于诊断，不进入公开前台。
- 公开接口失败时必须写清失败来源、错误、降级路径和后续处理。

## 6. 数据模型闸门

适用于字段、schema、标签、关系网络、检查脚本调整。

必须检查：

- 核心实体有稳定 ID 和 slug。
- 字段变更不会破坏同步脚本。
- 新字段有来源、用途、展示规则和缺失处理。
- 标签不会无限膨胀，有 group、alias 和合并规则。
- 关系检查覆盖新增实体。

通过标准：

- V2 schema、内容目录和生成器能被对应 quality gate 读取。
- `v2content` 闸门通过，或写清未运行原因和风险。
- 新字段在产品模型或 PRD 中有定义。
- 如果改动仍涉及 V1 归档脚本，需说明它是历史兼容工作，不得影响 V2 当前入口。

## 7. 开发闸门

适用于代码、脚本、页面、样式修改。

常用检查：

```powershell
node agent-workflow/tools/run-quality-gates.mjs syntax
node --check 01-SiteV2/site/assets/app.js
node --check 01-SiteV2/site/dev-server.mjs
```

如修改特定脚本，必须对该脚本运行 `node --check`。

通过标准：

- 语法检查通过。
- 涉及内容或数据生成时，V2 内容闸门通过。
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
