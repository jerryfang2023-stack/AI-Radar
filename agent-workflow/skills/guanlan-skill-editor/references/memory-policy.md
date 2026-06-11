# Skill Memory Policy

Use `MEMORY.md` to improve the skill over time, not to record everything that happened.

## Add Memory When

- A real production failure exposed a missing rule.
- A repeated user correction changed how the skill should behave.
- A confusing boundary between skills was clarified.
- A durable quality bar emerged that is hard to express as a simple eval.

## Do Not Add Memory For

- Daily counts, dates, or routine run results.
- Command output.
- One-off debugging notes.
- Rules already covered in evals.
- Long examples that belong in `examples/`.

## Entry Shape

```markdown
## YYYY-MM-DD

- Two to three sentences or bullets.
- Explain the lesson and the future behavior change.
- Link to eval/example names only if helpful.
```

## Maintenance

- Merge repeated lessons.
- Delete contradicted or retired lessons.
- Prefer absolute dates.
- Keep the file short enough to read in one pass.
