# WSD-20260512-02 Grill Me Skill Install Closeout

日期：2026-05-12  
状态：accepted / installed-local  
owner：workflow  
编码：UTF-8

## 1. 用户请求

用户要求将 `mattpocock/skills` 中的 `grill-me` skill 安装到本地，以便后续直接使用该 skill 梳理观澜 AI 项目思路。

## 2. 来源

- GitHub 仓库：`https://github.com/mattpocock/skills`
- 仓库 commit：`9f2e0bd0ea776eb6372eb81fa8a4a47814a8404a`
- 源路径：`skills/productivity/grill-me/SKILL.md`
- 本地路径：`C:\Users\86186\.skill-store\grill-me\SKILL.md`

## 3. 安全检查

- `grill-me` 目录仅包含 `SKILL.md`。
- 未发现脚本、依赖安装、远程执行、文件删除、凭证读取或 API key 读取内容。
- 本地已有 `grill-me`，与 GitHub 当前版本内容一致。

## 4. 使用边界

`grill-me` 的用途是对计划或设计做连续追问：

- 每次只问一个问题。
- 沿决策树逐步拆解依赖。
- 每个问题给出推荐答案。
- 如果问题能通过读取项目文件回答，应优先查项目文件，而不是反复询问用户。

该 skill 不替代观澜 AI 长期 Agent、派发单、Copy-first、VI / DESIGN / COPY 规范或质量闸门。

## 5. 注意事项

当前会话启动时的 Skill 列表没有加载到 `grill-me`，新窗口或重启会话后通常才能作为本地 skill 出现在可用列表中。当前窗口如需使用，可直接读取本地 `SKILL.md` 并严格按其规则执行。
