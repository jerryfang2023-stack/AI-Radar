# 调度收口箱

用途：减少执行窗口完成后由用户手动复制 closeout 路径的成本。

执行窗口完成任务后，必须：

1. 写入 UTF-8 closeout 文件。
2. 向 `agent-workflow/inbox/closeout-queue.jsonl` 追加一行 JSONL 登记。
3. 仍可在聊天中提示用户任务已完成，但调度窗口可以通过 `检查收口箱` 自动发现。

登记格式：

```json
{"task_id":"<TASK-ID>","board_id":"<BOARD-ID>","closeout_path":"agent-workflow/reports/<TASK-ID>-closeout.md","status":"ready_for_review","created_at":"YYYY-MM-DDTHH:mm:ss+08:00","owner":"<lead-agent>"}
```

调度窗口规则：

- `检查收口箱`：列出待验收 closeout。
- `验收收口箱`：逐个读取并按派发单硬闸门验收。
- 已在看板中为 `accepted / failed / blocked` 的任务自动跳过。
- 收口箱只负责发现，不替代验收和回填。
