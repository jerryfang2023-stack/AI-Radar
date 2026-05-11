---
title: ai-news-radar 默认源与 Obsidian 同步执行记录
date: 2026-05-06
type: automation-report
status: completed
owner: workflow/dev/data
---

# ai-news-radar 默认源与 Obsidian 同步执行记录

## 任务

用户要求按懂王 Skill 原先配置运行，不再提供额外信息源清单。

目标：
- 使用 `https://github.com/LearnPrompt/ai-news-radar` 的原始默认源配置。
- 保持无服务器静态站与 GitHub Actions 自动更新路径。
- 将监测内容同步到本地 Obsidian 知识库 `08-AI news`。
- 不把 API Key、cookies、token、真实 OPML、邮箱正文或私有邮件内容写入仓库。

## 本轮处理

- 已下载目标仓库到本地副本：
  - `C:\Users\86186\Documents\Fang\wiki\AI热点\ai-news-radar`
- 已读取仓库内 Skill：
  - `skills/ai-news-radar/SKILL.md`
  - `skills/ai-news-radar/references/source-intake.md`
  - `docs/SOURCE_COVERAGE.md`
- 已按默认公开源运行：
  - 未启用 `feeds/follow.opml`
  - 未启用 AgentMail
  - 未使用任何 API Key、cookie、token 或私有邮箱正文
- 已新增本地 Obsidian 导出能力：
  - `scripts/export_obsidian.py`
  - `docs/OBSIDIAN_SYNC.md`
  - `docs/DEFAULT_SOURCE_ROUTING.md`
  - `README.md` 补充 Obsidian 同步说明
  - `requirements.txt` 补充 Windows 运行所需 `tzdata==2026.1`

## 默认源路由结论

- RSS / Atom：OpenAI News、Google DeepMind、Google AI Blog、Hugging Face Blog、GitHub AI & ML、GitHub Changelog、OpenAI Skills commits。
- 静态页面：OpenAI Codex Changelog、Anthropic News、TechURLs、TopHub、AI HubToday、AIbase。
- 公开 feed / JSON：Follow Builders、Buzzing、Info Flow、BestBlogs、Zeli、NewsNow。
- Jina 兜底：AI Breakfast。
- OPML：仅作为私有扩展，通过本地 `feeds/follow.opml` 或 GitHub Secret `FOLLOW_OPML_B64`，默认未启用。
- AgentMail：仅作为私有进阶邮箱入口，默认未启用，且只允许 metadata-only。
- 跳过：需要 cookies、登录态、私有 X token、私有邮件正文或脆弱桥接的来源。

详细表见：
- `C:\Users\86186\Documents\Fang\wiki\AI热点\ai-news-radar\docs\DEFAULT_SOURCE_ROUTING.md`

## 输出

GitHub Pages / Actions 路径：
- 目标仓库已有 `.github/workflows/update-news.yml`
- 该 workflow 每 30 分钟运行一次并更新 `data/*.json`
- 本轮未修改 workflow 的密钥策略

本地 Obsidian 输出：
- `08-AI news/daily/2026-05-06-AI-news-radar.md`
- `08-AI news/sources/2026-05-06-source-health.md`
- `08-AI news/items/` 下生成 80 条公开新闻条目笔记

本轮抓取结果：
- `latest-24h.json`：905 条
- `latest-24h-all.json`：6525 条
- `archive.json`：147227 条
- `waytoagi-7d.json`：9 条
- `source-status.json`：12 个默认源全部成功
- OPML：disabled
- AgentMail：disabled

## 验证

已通过：
- `python -m py_compile scripts/update_news.py scripts/export_obsidian.py`
- `python scripts/update_news.py --output-dir data --window-hours 24 --archive-days 21`
- `python scripts/export_obsidian.py --data-dir data --vault-dir "../01-WaveSight/08-AI news" --limit 80`
- `node --check assets/app.js`
- `pytest -q`：36 passed

未运行：
- `git diff --check`

原因：
- 本地目标仓库是通过 GitHub zip 下载的工作副本，不包含 `.git` 元数据。

风险：
- 若要直接提交到 GitHub，需要后续用真实 fork / clone 工作树执行 git status、diff、commit、push。

## 自动化影响

对观澜AI现有自动化：
- `ai-the-point`：不影响。
- `ai-2`：不影响。
- `ai-3`：不影响。

对 `ai-news-radar`：
- 保持 GitHub Actions 自动更新静态站的路线。
- 新增本地 Obsidian 导出脚本，但不会由 GitHub Actions 写入本机 vault。
- GitHub Actions 无法直接写本地 Obsidian；本地同步需要在本机运行导出命令或配置本地计划任务。
