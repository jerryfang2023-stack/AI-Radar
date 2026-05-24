---
title: WSD-20260522 今日观察 Pitch / Writer / QC 一致性同步收口
date: 2026-05-22
status: completed
owner: Experience & Editorial
scope:
  - guanlan-daily-observation-pitch
  - guanlan-daily-observation-writer
  - guanlan-daily-observation-qc
  - context sync
  - obsolete homepage field cleanup
---

# WSD-20260522 今日观察 Pitch / Writer / QC 一致性同步收口

## 1. 本次属于哪类流程

本次属于今日观察专项 Skill 维护 + 页面内容字段同步检查。

同时套用：

- 今日观察专项 Skill：pitch / writer / QC。
- `context/06-execution-harness.md` 中页面 / 文案 / Typography Harness 的前台文案门禁要求。

## 2. 固定读取与补读

已读取：

- `context/00-current-state.md`
- `context/01-product-map.md`
- `context/05-daily-monitoring.md`
- `context/06-execution-harness.md`
- `context/context-index.md`
- `~/.skill-store/guanlan-daily-observation-pitch/SKILL.md`
- `~/.skill-store/guanlan-daily-observation/SKILL.md`
- `~/.skill-store/guanlan-daily-observation-qc/SKILL.md`

未继续扩大读取范围；只用定向搜索检查今日观察相关口径。

## 3. 一致性结论

三个 Skill 当前分工一致：

- Pitch：只做商业主编选题，不写标题、提纲、正文或首页字段。
- Writer：负责标题、正文、小标题和结尾，核心方向是“用商业故事写 AI”；不再产出首页或栏目摘要。
- QC：只做文章本体可读性质检，不做事实审计；重点看标题钩子、开头、推进、语言质感、重复和结尾。

已确认无冲突：

- Pitch 不再要求写作框架。
- Writer 不再使用过重 checklist。
- QC 不再以证据链完整性作为主要评分。
- 三者均禁止把内部购买动机、验收、ROI、预算审批、组织阻力等不可知内容写成事实。
- 三者均服务“一个对象、一条商业冲突、一句可带走判断”的栏目定位。

## 4. 已同步修改

### Context 同步

- `context/01-product-map.md`
  - 今日观察栏目说明改为“用商业语言讲 AI”。
  - 写作重点新增：标题先给商业钩子、小标题先抓段落推进、少写 AI 能力说明。
  - 删除旧的“推测企业为什么会买、怎么验收、哪里失败”方向表达。

- `context/context-index.md`
  - 增补今日观察 pitch / writer / QC 三个用户 Skill 路径，避免调度窗口只查项目内 `skills/`。

- `context/00-current-state.md`
  - 明确项目内 Skill 与当前载入用户 Skill 的关系。
  - 今日观察三件套以 `~/.skill-store/` 中的用户 Skill 为准。

### Skill 同步

- `~/.skill-store/guanlan-daily-observation-pitch/SKILL.md`
  - 删除“账本怎么验收”等旧审稿口径。
  - 自检改为避免用内部购买动机、验收、ROI、组织阻力等不可知内容支撑选题。

- `~/.skill-store/guanlan-daily-observation/SKILL.md`
  - 删除不合时宜的“工程团队上桌”“顺风局进不了生产”具体坏例。
  - 改为通用原则：小标题先抓段落推进，再追求好记，不强行押句式。

- `~/.skill-store/guanlan-daily-observation-qc/SKILL.md`
  - 删除网站展示、首页摘要、栏目字段等检查要求。
  - 增加小标题质检项：不得为了金句感强行押句式，导致隐喻不贴合、主语别扭或语气过重。

### 内容字段清理

删除三篇旧今日观察稿中的废弃字段 `### 首页今日看点`：

- `01-SiteV2/content/03-daily-observation/2026-05-19--daily-observation--enterprise-buys-permission-and-connectivity.md`
- `01-SiteV2/content/03-daily-observation/2026-05-20--daily-observation--agent-budget-moves-into-workflow-responsibility.md`
- `01-SiteV2/content/03-daily-observation/2026-05-21--daily-observation--vertical-agents-enter-operational-workflows.md`

同步脚本已重新生成：

- `01-SiteV2/site/data/site-content.json`
- `01-SiteV2/site/data/site-content.js`

## 5. 质量门与验证

已运行：

```text
quick_validate.py guanlan-daily-observation-pitch
quick_validate.py guanlan-daily-observation
quick_validate.py guanlan-daily-observation-qc
node 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/scripts/sync-v2-site-data.mjs
node --check 01-SiteV2/site/assets/app.js
```

结果：

- 三个 Skill 均 `Skill is valid!`
- 站点数据同步成功。
- 同步脚本与前端脚本语法检查通过。
- 定向搜索未发现以下废弃口径残留：
  - `首页今日看点`
  - `今日看点`
  - `homeLook`
  - `工程团队上桌`
  - `顺风局进不了生产`
  - `账本怎么验收`
  - `企业为什么买、怎么验收、哪里失败`

## 6. 删除与保留

未删除文件。

已删除内容：

- 三篇历史今日观察稿中的废弃 `首页今日看点` 字段块。

保留：

- 文章正文未做额外改写。
- 522 文章标题仍为 `帮 Agent 收拾残局，是门 50 亿美元生意`。

## 7. 下游允许与注意事项

允许下游继续使用当前 pitch / writer / QC 三件套。

后续写今日观察时：

- Pitch 只负责选题评分，不给写作框架。
- Writer 负责商业叙事、标题、小标题和结尾，不写首页或栏目摘要。
- QC 只抓文章本体可读性，不做事实审计。
- 首页不再使用 `首页今日看点` 字段。
- 小标题不得为了对仗牺牲自然语感；先看段落推进，再压成商业判断。

## 8. 给调度窗口的汇报

今日观察三件套已完成一次口径收敛：栏目定位、选题、撰写和可读性 QC 已同步。Writer / QC 不再负责首页或栏目摘要；旧的“首页今日看点”字段已从历史稿中清理，站点数据已重建。当前无已知口径冲突；下游可以按新版 Skill 继续生产和返修今日观察。
