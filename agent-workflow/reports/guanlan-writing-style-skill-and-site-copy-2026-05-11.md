# 观澜AI文风 Skill 与全站页面文案优化记录

日期：2026-05-11  
状态：completed / needs follow-up review  
范围：建立全站文风 Skill，并按“冷静、有判断、有温度的商业内参风”优化 V2 站点固定页面文案。

## 完成内容

1. 新增 Skill：
   - `skills/guanlan-writing-style/SKILL.md`
   - `skills/guanlan-writing-style/agents/openai.yaml`

2. 优化 V2 站点固定文案：
   - `01-SiteV2/site/index.html`
   - `01-SiteV2/site/daily.html`
   - `01-SiteV2/site/brief.html`
   - `01-SiteV2/site/opportunities.html`
   - `01-SiteV2/site/opportunity-detail.html`
   - `01-SiteV2/site/assets/app.js`

3. 更新公开文本清洗规则，降低后续同步重新引入 AI 味和营销词的概率：
   - `01-SiteV2/site/scripts/sync-v2-site-data.mjs`

4. 重新生成站点数据：
   - `01-SiteV2/site/data/site-content.json`
   - `01-SiteV2/site/data/site-content.js`

## 文案处理方向

- 删除或弱化“行动路径、强验证、入口、闭环、生态、AI商业”等机械或内部感表达。
- 页面文案更靠近企业经营者真实问题：行业、岗位、流程、风险、从哪里先试。
- CTA 从销售式表达改为“查看、阅读、继续看、进入分析”等克制动作。
- 保留事实材料，不对历史内容做大段重写，避免改坏来源和判断边界。

## 检查结果

- `node --check 01-SiteV2/site/assets/app.js`：通过。
- `01-SiteV2/site/data/site-content.json` JSON 解析：通过。
- `node agent-workflow/tools/run-quality-gates.mjs syntax`：通过；统一脚本内部分子进程因当前环境显示 `spawn blocked`，已用直接检查补充验证。
- Skill 官方 `quick_validate.py` 未完成：当前 Python 环境缺少 `yaml` 模块。已做 frontmatter 轻量检查，结果通过。
- 本地页面抽查：`index.html`、`daily.html`、`signals.html`、`opportunities.html`、`brief.html` 可打开。

## 截图

- `agent-workflow/reports/wavesight-writing-style-home-1440.png`
- `agent-workflow/reports/wavesight-writing-style-brief-390.png`

## 后续建议

1. 后续内容生产任务应显式使用 `guanlan-writing-style` Skill。
2. 对历史长文内容建议另派 Copy / Data 联合任务逐篇审校，不建议全局替换“入口、验证、真正”等可能在上下文中合理的词。
3. 若要把该 Skill 安装为全局可发现 Skill，可再复制到 Codex skills 目录；本次按用户建议路径创建在项目 `skills/` 下。
