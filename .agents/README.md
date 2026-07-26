# Repo-scoped Skills

WaveSight AI 的可版本化 Skill 源文件位于：

```text
agent-workflow/skills/
```

Codex 从本目录下的 `skills/` 发现项目级 Skill。该目录由下面的命令生成，不提交生成副本：

```text
npm run sync:repo-skills
```

检查运行镜像是否与项目源一致：

```text
npm run diff:repo-skills
```

不要直接编辑 `.agents/skills/`。应修改 `agent-workflow/skills/<skill>/`，完成验证后重新同步。
