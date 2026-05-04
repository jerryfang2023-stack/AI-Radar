# Trends 趋势模块优化报告

更新时间：2026-05-02  
Owner：Trend Intelligence Agent / Data Agent / UI-UE Agent / Dev Agent  
状态：已完成，待页面验收

## 本轮目标

把 Trends 从“趋势列表”升级为“趋势判断模块”，并引入每日机会评分表作为趋势强弱和证据变化的第二证据层。

## 已完成

### 数据层

- 每个趋势自动吸收每日 `AI机会评分` 中的相关评分项。
- 新增趋势字段：
  - `status`
  - `statusLabel`
  - `summary`
  - `latestScore`
  - `latestScoreDate`
  - `relatedScoringIds`
  - `topScoringRows`
  - `evidenceLadder`
  - `adoptionStage`
  - `opportunityTemperature`
  - `counterEvidence`
- 评分关联规则已收紧为：
  - 同赛道评分项。
  - 或趋势表中具体产品/代表案例命中。
- 避免用泛标签把无关评分吸入趋势。

### 页面层

- Trends 列表页改为趋势地图：
  - 持续升温
  - 新出现
  - 成熟化
  - 分化观察
  - 风险变量
  - 降温观察
  - 反证增强
- Trend 卡片展示：
  - 状态
  - 采用阶段
  - 一句话判断
  - 评分变化
  - 最新评分
  - 关联 Signals / Opportunities 数量
  - 代表评分证据
- Trend 详情页改为商业内参结构：
  - 趋势主判断
  - 评分变化
  - 证据阶梯
  - 机会温度
  - 每日评分证据
  - 关联机会
  - 关联 Signals
  - 反证观察

### 文案层

- 去掉趋势判断中的表情符号。
- 使用“持续升温、分化观察、风险变量、反证增强”等克制表达。
- 不输出确定性投资、经营或合作建议。

## 当前数据结果

- trends：10
- 每个 trend 均已生成状态。
- 每个 trend 均已生成证据阶梯。
- 每个 trend 均已生成反证观察。
- 每个 trend 均已关联机会卡。
- 大部分 trend 已关联每日评分项；没有直接评分项的趋势仍可使用趋势表原始分数和关联机会判断。

## 验证

- `node --check 04-Site/scripts/sync-data.mjs` 通过。
- `node --check 04-Site/js/app.js` 通过。
- `node 04-Site/scripts/sync-data.mjs` 通过。
- `04-Site/data/radar-data.json` 解析通过。
- `agent-workflow/feature_list.json` 解析通过。

## 待验收

1. 打开 Trends 页面，检查趋势地图是否比原列表更清晰。
2. 抽查 `AI Agent`、`AI治理`、`AI基础设施` 三个详情页。
3. 检查详情页是否像商业内参，而不是后台数据页。
4. 检查移动端是否存在标题或卡片拥挤。

