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

## Current governance contract

- Skill Store version: `v2.2.0`.
- Prompt contract: `GPT-5.6-SKILL-V1.0`.
- Every active governed Skill requires `agents/openai.yaml` and five-case trigger-eval inventory coverage.
- Run `npm run check:skill-ops` after synchronization; do not edit this generated runtime directly.
- Content registrations and external inventory in `agent-workflow/skills/skill-catalog-sources.json` do not create runtime copies or change invocation settings. AIP remains project-owned; plugin caches do not prove installation or enablement.

不要直接编辑 `.agents/skills/`。应修改 `agent-workflow/skills/<skill>/`，完成验证后重新同步。
