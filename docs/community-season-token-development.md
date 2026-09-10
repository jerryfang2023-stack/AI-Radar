# 社群赛季积分与 Token 权益开发

状态：2026-09-10 已部署真实后台、网关和成员服务；小程序 0.9.6 已上传微信开发版，尚未提交审核或正式发布。本功能仅涉及社群积分，不调整小程序钱包。精确源码与回执见 [0.9.6 上传记录](../02-Miniprogram/docs/releases/0.9.6/README.md)，提审材料见 [审核说明](../02-Miniprogram/docs/REVIEW-0.9.6.md)。

## 范围

- 积分榜沿用现有页面，墨蓝总览卡下增加总积分 / 第二季 / 第一季切换。
- Token 权益独立页面，仅激励池、本人奖励、规则与记录；隐藏悬赏首页入口，保留历史业务。
- 大后台会员运营下新增「Token 权益管理」，共用会话与 CSRF 校验。
- 赛季日期、奖励计分类别、供应方、计量单位、额度均由后台配置。第二季预置 2026-09-14 开始，结束时间待定；规则默认未启用。
- 不接供应商自动发放；分配先预览，确认后锁定，再逐笔记录实际发放凭据。

## 沿用的视觉与文案

| 位置 | 字体 / 样式 | 文案 |
|---|---|---|
| 原生顶部 | 现有 app-header，不新增导航层 | 积分榜 / Token 权益 / 返回 |
| 总览卡标题 | 39rpx，现有墨蓝渐变 | 总积分榜 |
| 卡片数字 | 31rpx，现有金色 | 我的总积分 / 入榜成员 / 已完成场次 |
| 赛季切换 | 24rpx，暖灰底白色选中 | 总积分 / 第二季 / 第一季 |
| 奖励记录 | 24rpx，现有列表分隔线 | 待发放 / 已发放 |
| 后台表单 | 复用 mo-admin / mo-schedule-fields | 赛季设置 / 激励池 / 分配预览 / 发放记录 |

## 安全与验收

- 社群成员 ID 是身份键，昵称只用于展示；每次远端检查成员资格。
- 历史计分方式保持不变；仅按日期分组，不删除原始记录，不把奖励发放当作扣分。
- 分配只允许已结束、已配置的赛季；使用整数最小单位向下取整，余量保留池中。
- 分配预览绑定配置和积分快照；确认时重新计算校验，拒绝过期预览。
- 一个赛季仅一次分配，事务锁与幂等操作号防重复；已分配配置不可修改。
- 发放是人工凭据登记，不代表调用供应商到账；退出成员不能新增发放。
- 测试覆盖身份、赛季边界、总分隔离、空池、快照变更、重复确认与发放、后台鉴权及前端切换。

启用激励池前需要确认供应方、计量单位、实际可用额度、结束日期与参与分配的计分类别；小程序发布前还需完成微信真机验收。

## 实现与验证

- 小程序：`pages/community-points`、新增 `pages/community-token`、社群首页入口、分享参数和按身份/赛季隔离的内存缓存。
- 网关：`payment_service/community_hub.py` 的新接口不读取小程序积分；`member_operations.py` 复用管理员会话和 CSRF。
- 大后台：`operations-console.html` → 会员与权益 → Token 权益管理（`#membership-token`）；逻辑与样式位于现有 `member-operations.*`，仍属于私有 OPS 资源，不进入公开 Pages。
- 成员服务：相邻 `Guanlan-Founding-Members` 仓库的 `season_rewards.py` 与 `docs/SEASON_REWARDS.md`。
- `npm run verify`：118 项小程序测试通过，25 页/56 个 JS 文件结构及包体检查通过。
- `npm run test:ops-unified`：15 项 OPS 测试；另运行 `node --test agent-workflow/tools/tests/token-operations-browser.test.mjs`，验证真实面板的完整点击流程和 1280/390 宽度。
- 服务端测试均使用临时 SQLite；没有操作生产会员、积分或奖励。

本轮不修改发布版本号，不执行 Git 提交/推送、部署或微信上传。融资/报告构建验证产生的两个无关数据文件已还原，保持本次改动只涉及赛季与 Token 权益。

## 2026-09-10 接管复验

- 已核对两仓库的现有未提交实现：WaveSight 位于 `main`，HEAD 为 `29402fd451`；相邻 Guanlan-Founding-Members 位于 `main`，HEAD 为 `cc735d1`。这些提交号仅标记已有基线，不包含当前未提交的赛季与 Token 权益功能。
- 小程序执行 `npm test`：118 项通过；`npm run validate`：25 页、56 个 JS 文件，包体 815,852 字节。本次没有重新构建无关融资/报告数据，不将本次验证表述为重新执行完整 `npm run verify`。
- 后台执行 `npm run test:ops-unified`：15 项通过；`node --test agent-workflow/tools/tests/token-operations-browser.test.mjs`：1 项通过，覆盖配置、预览、确认、凭据登记和 1280/390 宽度。浏览器请求均由测试模拟，不能替代线上联调或微信真机验收。
- 网关 `04-Payment-Service` 执行 `.venv/Scripts/python.exe -m pytest -q`：72 项通过；成员服务执行同一命令：79 项通过。测试使用临时数据库。
- 两仓库 `git diff --check` 通过。本次仅补充交接记录，保留全部既有代码改动；没有提交、推送、部署、微信上传或生产数据操作。

接续事项：确认供应方、计量单位、实际可用额度、结束日期与参与分配的计分类别；按成员服务 → 网关 → 私有 OPS 资源 → 小程序体验验收的顺序完成后续发布。生产发布前备份成员服务 SQLite，并确保发布包包含 `season_rewards.py`。当前仍为本地开发已复验、未部署状态。

## 2026-09-10 真实后台发布（晚于上述接管复验）

- 入口：`https://www.zkdlj.vip/ops/#membership-token`，位于「会员与权益 → Token 权益管理」，沿用原后台登录和 CSRF。
- 不可变发布标识：`token-20260910-3ccfb72b9ff2`。发布源提交：WaveSight `3ccfb72b9ff23c4cb9dcb5bd3019ebfb5c1690bf`，成员服务 `afcda9ec00f94d91624cf0f557c91c77de2919b3`。WaveSight 推送前合并了同期上游数据提交，主干合并提交为 `e776c353b14bcc7c726959148dec16362c71254c`；本次发布的后台和网关文件与源提交逐字节一致。
- 成员服务更新 `app.py`、`community_hub.py`、`season_rewards.py`；网关更新三个关联模块；OPS 更新 HTML 和三个 JS/CSS 资源。共 10 个发布文件均通过 SHA-256 校验，未覆盖运行时配置、历史实录或数据库。
- 发布前使用 SQLite 在线备份两个数据库并通过 `quick_check`。服务器备份及发布回执位于 `/opt/guanlan-backups/token-20260910-3ccfb72b9ff2/`；两个原发布链接也已记录。回退只恢复代码，保留新增表与业务记录。
- 网关当前链接：`/opt/wavesight-payment-service/releases/token-20260910-3ccfb72b9ff2`；OPS 当前链接：`/var/www/wavesight-ops/releases/token-20260910-3ccfb72b9ff2`。两个 systemd 服务均为 active，健康检查通过。
- 真实成员接口带服务令牌的 GET、网关客户端到成员服务的实际 GET 均通过；新建 4 张奖励表，两个赛季均关闭且额度为 0，分配批次、发放记录及奖励操作审计均为空。本次没有启用规则或发放权益。
- 公网只读检查：后台及脚本匿名访问 302 到原登录页；登录页 200；Token 管理接口、小程序权益接口和成员内部接口匿名访问均为 401。
- 发布检查通过：`assert:no-active-v3`、`assert:compatibility-retirement`、`assert:pipeline-policy`、`test:data-center`、`test:data-center-site`、`test:ops-v2`、`assert:versions`、`test:ops-unified`、`test:skill-ops`。服务端和前端专项测试沿用本日同一代码的接管复验结果。
- GitHub Pages 工作流 [34445609901](https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/34445609901) 成功，私有 OPS 仍只部署到认证 VPS。
- 浏览器控制连接不可用，尚未完成本次生产环境的登录后页面人工验收；此前本地浏览器完整点击流程测试已通过。小程序文件仍保留在本地未提交状态，未上传微信。

## 2026-09-10 页面优化与默认总积分分配（已重新部署）

- 修复复用四列排期样式导致的错位：Token 额度、计量单位、赞助商、开始日期、结束日期使用独立五列布局；按实际面板宽度在平板及手机上换行。统一表单间距与底部保存/预览操作，自动规则随内容展开。
- 界面「供应方」统一改为「赞助商」，内部 `provider` 字段保持兼容。
- 分配方式默认 `season_total`，直接按该赛季积分榜的成员总积分比例分配，包含各类积分及调整，零/负总积分不参与。选择 `custom` 后才显示分类，至少选择一类；既有非空分类配置继续视为自定义，不静默转换。
- 默认规则由日期、赞助商、额度及单位自动生成，前端实时预览，服务端校准后保存；自定义规则可编辑。未保存的变动会清除分配预览并要求先保存，避免按旧规则误结算。
- 验证：成员服务全量 81 项、OPS 15 项通过；完整后台外壳内的浏览器流程通过，覆盖默认/自定义选择、分类保存、自动规则、分配与凭据登记，以及 1600/1280/1024/768/390 宽度。新增断言检查桌面五字段同一行、控件不溢出各自单元格、自动规则无内部滚动条；已人工检查桌面与手机截图。
- 发布标识 `token-layout-20260910-bc3052154aa9`，WaveSight 提交 `bc3052154aa93046484090b4d63b1c3a0843e248`，成员服务提交 `b3c188ef7643b9a15b6a21ceeb2fc93910e0856b`。仅发布 1 个成员服务模块及 3 个 OPS 资源；网关无需更换。
- 4 个线上文件哈希全部匹配；成员服务和网关均 active。真实网关 GET 已核验分配方式、生成规则及现有设置；奖励四张表的完整行摘要在发布前后保持一致，没有修改已有配置、分配、发放或审计记录。
- 本次 SQLite 在线备份、旧模块与发布回执：`/opt/guanlan-backups/token-layout-20260910-bc3052154aa9/`。OPS 当前发布链接指向 `/var/www/wavesight-ops/releases/token-layout-20260910-bc3052154aa9`，回退保持只恢复代码。
- 公网后台和脚本匿名访问仍跳转登录，Token API 为 401，登录页为 200。GitHub Pages 工作流 [34448750405](https://github.com/jerryfang2023-stack/AI-Radar/actions/runs/34448750405) 成功，私有 OPS 仍由认证 VPS 提供。
