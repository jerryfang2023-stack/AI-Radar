# V2.0 Preflight Roadmap

日期：2026-05-07  
状态：ready-for-dispatch  
owner：`pm` / `workflow`

## 阶段 A：冻结与规划

| 编号 | 任务 | Owner | 状态 | 产物 |
|---|---|---|---|---|
| SYS-9 | V2 转场准备与基线规划 | workflow / pm | accepted | `agent-workflow/v2/`、看板与 closeout |
| V2-1 | V2 Agent 体系设计 | strategy / pm / workflow | ready | 新 Agent 岗位、协作流、调度规则 |
| V2-2 | V2 算法与内容源架构 | data / pm / workflow | ready | 算法、来源、监测、入库规则 |
| V2-3 | V2 VI / Design Direction | ui-ue / copy / strategy | ready | VI、品牌视觉、页面母版方向 |
| V2-4 | V2 产品架构与 PRD | pm / strategy / data | ready | 栏目、后台、会员、内容资产关系 |
| V2-4A | AI商业内参与热力图增值产品规划 | pm / data / strategy / ui-ue | ready | PM 门禁、WAVE、HeatEvidence 产品口径、MVP 范围 |
| V2-5 | V2 技术工作区与迁移方案 | dev / qa / workflow | ready | 分支/worktree、tag、迁移、回滚方案 |

## 阶段 B：原型与测试

| 编号 | 任务 | Owner | 状态 | 产物 |
|---|---|---|---|---|
| V2-6 | V2 监测算法 7 日测试 | data / workflow / qa | backlog | 7 日样本、质量报告、替换建议 |
| V2-7 | V2 Signal Lab 产品化评估 | pm / ui-ue / data | backlog | 是否替换或并入正式 Signals |
| V2-8 | V2 首页与栏目母版原型 | ui-ue / copy / dev / qa | blocked | 需等 V2-3 / V2-4 |

## 阶段 C：生产替换

生产替换必须等阶段 A/B 的验收结论，不得直接跳到 Dev。

## 当前建议执行顺序

1. `执行：V2-1`
2. `执行：V2-2`
3. `执行：V2-3`
4. `执行：V2-4A`
5. `执行：V2-4`
6. `执行：V2-5`

其中 `V2-1`、`V2-2`、`V2-3` 可以并行开独立窗口执行；`V2-4A` 应吸收 `V2-2` 的算法口径并反哺 `V2-4`；`V2-4` 需要吸收 `V2-1`、`V2-2`、`V2-3`、`V2-4A`；`V2-5` 在规划结论明确后执行。
