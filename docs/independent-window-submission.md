# 独立窗口提交

不同窗口维护不同模块时，每个窗口使用自己的 Git worktree、分支和 PR。窗口完成本模块改动即可提交与启动 CI，无须先更新共享检出、等待其他窗口合并，或把别人的模块一起提交。`main` 仍是接受后的集成基线；需要统一生成的产品与数据发布继续使用对应模块现有门禁。

## 开始一个窗口

从任一 WaveSight 检出执行，名称在本仓唯一，路径是仓库相对路径；可重复写 `--scope`：

```powershell
node agent-workflow/tools/window-submit.mjs start --name=financing-fix-20261003 --scope=agent-workflow/financing --scope=docs/unified-daily-monitoring.md
```

命令只在开始时获取最新 `origin/main`，创建 `codex/window/<name>` 和独立 worktree，打印新目录。之后在**新目录**工作。若模块有额外事实源、文档或测试文件，开始时一并声明路径。不要在共享生产检出里工作，也不要让两个窗口使用同一个分支或运行目录。

## 提交本窗口

在新 worktree 中执行：

```powershell
node agent-workflow/tools/window-submit.mjs check
node agent-workflow/tools/window-submit.mjs submit --message="Fix financing module"
```

`check` 显示本窗口相对起点的全部改动及越界路径。`submit` 拒绝任何越界的已提交、暂存、未暂存或未跟踪文件；只暂存声明路径，然后提交、推送本分支并创建独立 PR。若推送成功但 PR 创建失败，原命令可重试，不会重写已提交内容。暂不创建 PR 时可用 `--pr=false`，仍会推送分支；稍后重复 `submit` 创建 PR。该命令不拉取、合并或变基本窗口分支，也不更新其他 worktree。

每个 PR 独立运行代码检查和审核；本窗口可在其检查通过且无冲突时直接合并，无须等待无关窗口。GitHub 报告冲突时，只处理实际重叠路径。共享生成文件、版本表、同日数据投影、私有证据仓写入及线上发布需要按其现有所有权和门禁协调，不能通过绕开冲突检查抢先覆盖。融资日报等数据发布仍以已接受的 `main` 提交和线上回读为完成条件。

若任务已在其他分支或有未提交改动，先保留原工作树，按实际文件范围迁移到新窗口；工具不会自动搬运或清理任何旧工作树。完成后可用 `npm run audit:workspace` 查看可移除工作树，再按审计结果定向清理。
