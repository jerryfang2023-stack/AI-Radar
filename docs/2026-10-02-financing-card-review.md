# 2026-10-02 融资主体卡复查

复查范围：按入库事件标识比较 10 月 1 日、2 日新增的 180 条事件记录，并跨全目录核对相同企业及产品；不是按融资发生日期截取两天。

## 结果

- 修正前 553 张按事件分开的卡片；修正后 **509 张主体卡、542 条独立融资事件**。
- 31 组多卡主体收敛为一张卡；38 个旧卡 ID 保留跳转及受保护详情别名。
- 5 组同轮重复披露归并，只计一次；所有原始事件及证据仍留在事实档案。
- 3 条融资事实待核实；3 条具身智能相关事件退出当前融资目录（光轮智能 2 条、Ethernovia 1 条）。不是把这些企业认定为非 AI 企业。
- 30 条原卡标题统一为已核验简称；简称用于标题，全称保留搜索。
- AIUC / Anthropic、enso / Google、Gradium / NVIDIA 等不按共用的历史 canonical ID 误并，以已审核 application identity 为准。
- Positron、曦望、OLIX、Upscale 四组跨编号主体经产品、官网或企业身份引文核对后归并。

## 逐轮规则

主体卡主信息来自披露日期最近的已接受融资事件。每轮保留日期、轮次、金额原文、投资方、事件 ID 与来源证据。独立融资追加保留单独记录；同一轮在不同媒体重复披露只计一次。OpenAI 1100 亿美元扩大至 1220 亿美元属于同一轮关闭，采用最终金额，不相加。

目录 cards 用于展示主体，event_cards 用于资本流向统计，历史原始 facts 不覆盖。网站和小程序分别提供 eventCards / events，旧卡链接映射到主体卡。不得以主体卡减少误报融资事件减少。

## 同轮重复披露

| 保留卡 | 合并旧卡 | 依据 |
|---|---|---|
| FI-4880b1e3fb7a4da4 | FI-7108544d47292865 | [同日同一笔生数科技 B 轮，保留原文“近20亿元”而非改成精确金额。](https://news.pedaily.cn/202604/562614.shtml) |
| FI-ee613463b934eef6 | FI-16674c19e6f87ab9 | [9月报道回顾已经完成的 B 轮，不是新一轮融资。](https://news.pedaily.cn/202609/569177.shtml) |
| FI-f59cd4d7e9ffcb18 | FI-24441bfba8aff1ad | [同一创始人访谈的文章和播客重复披露同一笔5500万美元种子轮，保留7月16日披露日。](https://techcrunch.com/2026/07/16/how-a-former-deepmind-researcher-raised-at-a-300m-pre-seed-valuation-before-launching-a-product/) |
| FI-352a7cfb23508f3e | FI-f55b62cf10cb7c98 | [8月投资方报道回顾2月12日的同一笔300亿美元G轮。](https://www.gic.com.sg/newsroom/all/gic-leads-30-billion-series-g-in-anthropic/) |
| FI-b76fffbf5d0d91bd | FI-72755fd9439ecca6 | [2月宣布的1100亿美元承诺在3月同一轮关闭时增至1220亿美元，保留最终轮次金额，不能相加。](https://openai.com/index/accelerating-the-next-phase-ai/) |

## 暂缓三条融资事实

- **Etched**：原文800M为累计融资总额，不是本次融资；独立500M轮次已有卡片，累计披露留在原始档案，暂不作为新事件发布。 [原文](https://www.techtimes.com/articles/319393/20260630/transformer-chip-startup-etched-exits-stealth-800m-raised-1b-contracts.htm)
- **Anthropic**：Apollo原文350亿美元融资主体是Broadcom AI XPV基础设施平台，Anthropic是算力使用方，不能当作Anthropic企业自身一轮融资；待核定真正融资主体。 [原文](https://www.bloomberg.com/news/videos/2026-06-10/apollo-wraps-up-35b-chip-deal-for-anthropic-video)
- **Moonshot AI**：原文为寻求新估值/拟融资，未证明完成20亿美元新融资，不能计入已完成融资。 [原文](https://the-decoder.com/moonshot-ai-targets-a-30-billion-valuation-more-than-six-times-its-late-2025-worth)

## AI 范围与产品

未把“只是服务机器人客户”的通用模型、软件或通用 AI 算力企业排除。光轮智能主营物理 AI/具身仿真数据，Ethernovia 主营自主机器感知控制网络芯片，按现行排除边界移出。秋水半导体及至格科技原文明示 AI 眼镜显示/光学组件，保留并归入消费 AI 硬件/AI 眼镜；不标成完整眼镜终端。光轮与 Ethernovia 是范围排除，并非非 AI 判断。

同一主体内合并 Instinct、DeepSYS、DeepBot、Wonderful 平台、Sohu、耀速 3D Bio Intelligence、SkyHammer、曦望芯片、n8n 平台等名称别写；不同版本、不同产品保留。

## 主体合并清单

| 主体 | 原卡数 | 独立事件数 |
|---|---:|---:|
| 芯光界 | 2 | 2 |
| Instinct | 2 | 2 |
| 索格智算 | 2 | 2 |
| Hang Ten Systems | 2 | 2 |
| Factory | 2 | 2 |
| Temporal | 2 | 2 |
| 听象科技 | 2 | 2 |
| Positron AI | 2 | 2 |
| Mistral AI | 2 | 2 |
| 深度智控 | 2 | 2 |
| Wonderful | 2 | 2 |
| 曦望 | 2 | 2 |
| 中数睿智 | 2 | 2 |
| Etched | 3 | 3 |
| Groq | 2 | 2 |
| MemoraX AI | 3 | 3 |
| 玩点旅行 | 2 | 2 |
| OLIX | 2 | 2 |
| Moonshot AI | 2 | 2 |
| ChipAgents | 2 | 2 |
| 智象未来 | 3 | 3 |
| 设序科技 | 2 | 1 |
| Elorian | 2 | 1 |
| 耀速科技 | 2 | 2 |
| Upscale AI | 2 | 2 |
| Anthropic | 5 | 4 |
| Recursive Superintelligence | 2 | 2 |
| 生数科技 | 3 | 2 |
| OpenAI | 2 | 1 |
| Replit | 2 | 2 |
| n8n | 2 | 2 |

## 验证与发布

- 分类与主体聚合测试 8 项通过；融资研究事实验证通过。
- 小程序 1.2.5 在合入 1.2.4 昵称修复后 verify 通过（206 项测试、数据构建与项目校验）；含两项主体/事件统计回归测试。
- 网站 41 项相关测试通过，覆盖中外市场统计、旧链接、完整融资历史、GEO 页面、公开/付费数据边界与构建确定性。
- 用户已授权本窗口 Git 提交并部署。上线结果以随后发布回执为准；本报告的本地结果不等同上线完成。

## 两日逐条复查

| 原标题 | 修正后主体 | 状态 |
|---|---|---|
| Volantis | Volantis | 保留 |
| Unveilr AI | Unveilr AI | 保留 |
| GMI Cloud | GMI Cloud | 保留 |
| Halluminate | Halluminate | 保留 |
| Revnu | Revnu | 保留 |
| Armadin | Armadin | 保留 |
| Metaview | Metaview | 保留 |
| Osavul | Osavul | 保留 |
| Deepslate | Deepslate | 保留 |
| Arceus Legal | Arceus Legal | 保留 |
| FRANK | FRANK | 保留 |
| enso | enso | 保留 |
| PaleBlueDot AI | PaleBlueDot AI | 保留 |
| Ascerta | Ascerta | 保留 |
| Kanu AI | Kanu AI | 保留 |
| 芯光界 | 芯光界 | 保留 |
| CScale | CScale | 保留 |
| Prodoc AI | Prodoc AI | 保留 |
| 无锡迅杰光远科技有限公司 | 迅杰光远 | 保留 |
| 好心情（Good Mood） | 好心情 | 保留 |
| Vytalyou | Vytalyou | 保留 |
| Zenithon | Zenithon | 保留 |
| Traveltech Tryp.com | Tryp.com | 保留 |
| Menos AI | Menos AI | 保留 |
| Blue Fire AI | Blue Fire AI | 保留 |
| EliseAI | EliseAI | 保留 |
| Dodge AI | Dodge AI | 保留 |
| Elio Mortgage | Elio Mortgage | 保留 |
| 上海智灵新境科技有限公司 | 智灵新境 | 保留 |
| Autoheal | Autoheal | 保留 |
| Mona | Mona | 保留 |
| Outmarket AI | Outmarket AI | 保留 |
| 北京新烛时代科技有限公司 | 新烛时代 | 保留 |
| Dextr AI | Dextr AI | 保留 |
| BigHat Biosciences | BigHat Biosciences | 保留 |
| 索格智算 | 索格智算 | 保留 |
| Delos | Delos | 保留 |
| Factory | Factory | 保留 |
| Artificial Intelligence Underwriting Company (AIUC) | AIUC | 保留 |
| Flam | Flam | 保留 |
| Temporal | Temporal | 保留 |
| Positron AI | Positron AI | 保留 |
| Lightfield | Lightfield | 保留 |
| CloudNC | CloudNC | 保留 |
| Cymphony | Cymphony | 保留 |
| 佳量脑科学 | 佳量脑科学 | 保留 |
| Violoop | Violoop | 保留 |
| 鼎犀智创（Rhinovate™） | 鼎犀智创 | 保留 |
| 开放传神（OpenCSG） | 开放传神 | 保留 |
| 曦望 | 曦望 | 保留 |
| 晰见科技 | 晰见科技 | 保留 |
| 原力引擎 | 原力引擎 | 保留 |
| 蜂巢互联 | 蜂巢互联 | 保留 |
| 星辰技术 | 星辰技术 | 保留 |
| Arga Labs | Arga Labs | 保留 |
| Legato | Legato | 保留 |
| Alice | Alice | 保留 |
| OJO | OJO | 保留 |
| 芯光界 | 芯光界 | 保留 |
| Keenable | Keenable | 保留 |
| 数美万物 | 数美万物 | 保留 |
| 北京清程极智科技有限公司 | 清程极智 | 保留 |
| 九川智能 | 九川智能 | 保留 |
| Synthefy | Synthefy | 保留 |
| PandaAI | PandaAI | 保留 |
| Xpander | Xpander | 保留 |
| Lovable | Lovable | 保留 |
| 玩点旅行 | 玩点旅行 | 保留 |
| Throne Science | Throne Science | 保留 |
| Naïve | Naïve | 保留 |
| Omilia | Omilia | 保留 |
| OmAI联汇 | OmAI联汇 | 保留 |
| Sapiom | Sapiom | 保留 |
| Zenity | Zenity | 保留 |
| Tiiny AI | Tiiny AI | 保留 |
| ChipAgents | ChipAgents | 保留 |
| Fish Audio | Fish Audio | 保留 |
| 北京面壁智能科技股份有限公司 | 面壁智能 | 保留 |
| Neko Health | Neko Health | 保留 |
| Ollama | Ollama | 保留 |
| Savi Security | Savi Security | 保留 |
| LinqAlpha | LinqAlpha | 保留 |
| 耀速科技 | 耀速科技 | 保留 |
| 科辉智药（Artivila Biopharma） | 科辉智药 | 保留 |
| Sazabi | Sazabi | 保留 |
| 骁柔集团 | 骁柔集团 | 保留 |
| Engram | Engram | 保留 |
| Fika Jobs | Fika Jobs | 保留 |
| Ploy | Ploy | 保留 |
| Pramaana Labs | Pramaana Labs | 保留 |
| Bland | Bland | 保留 |
| Pool | Pool | 保留 |
| Prometheus | Prometheus | 保留 |
| 玩点旅行 | 玩点旅行 | 保留 |
| Supabase | Supabase | 保留 |
| ProLearn | ProLearn | 保留 |
| Town | Town | 保留 |
| Coralogix | Coralogix | 保留 |
| Suno | Suno | 保留 |
| ZeroDrift | ZeroDrift | 保留 |
| 秋水半导体 | 秋水半导体 | 保留 |
| Reactor | Reactor | 保留 |
| Anthropic | Anthropic | 保留 |
| SOND | SOND | 保留 |
| Modal | Modal | 保留 |
| 智象未来 | 智象未来 | 保留 |
| Exa | Exa | 保留 |
| NanoCo | NanoCo | 保留 |
| Isomorphic Labs | Isomorphic Labs | 保留 |
| 飞拓星驰（FitX AI） | 飞拓星驰 | 保留 |
| Astrocade | Astrocade | 保留 |
| MONTEE AI | MONTEE AI | 保留 |
| 级数AI | 级数AI | 保留 |
| Sinai.ai | Sinai.ai | 保留 |
| Recursive Superintelligence | Recursive Superintelligence | 保留 |
| Zūm | Zūm | 保留 |
| Factory | Factory | 保留 |
| 明日新程 | 明日新程 | 保留 |
| 生数科技 | 生数科技 | 保留 |
| 耀速科技（Xellar Biosystems） | 耀速科技 | 保留 |
| Mojo Vision | Mojo Vision | 保留 |
| Normal Computing | Normal Computing | 保留 |
| 南京创析智能网络科技有限公司 | 创析智能 | 保留 |
| 至格科技 | 至格科技 | 保留 |
| Kandou AI | Kandou AI | 保留 |
| Claros | Claros | 保留 |
| Chalkie AI Ltd. | Chalkie | 保留 |
| Axiom | Axiom | 保留 |
| Xscape Photonics | Xscape Photonics | 保留 |
| Amber Semiconductor | Amber Semiconductor | 保留 |
| Eridu | Eridu | 保留 |
| Vertical Compute | Vertical Compute | 保留 |
| Ayar Labs | Ayar Labs | 保留 |
| 致敬未知 | 致敬未知 | 保留 |
| Pensive | Pensive | 保留 |
| VITURE | VITURE | 保留 |
| SambaNova | SambaNova | 保留 |
| MatX | MatX | 保留 |
| Taalas Inc. | Taalas | 保留 |
| World Labs | World Labs | 保留 |
| Vervesemi Microelectronics | Vervesemi Microelectronics | 保留 |
| Efficient Computer | Efficient Computer | 保留 |
| ChipAgents | ChipAgents | 保留 |
| ThirdAI Automation, Inc. | ThirdAI Automation | 保留 |
| Mesh Optical Technologies | Mesh Optical Technologies | 保留 |
| OLIX Computing Ltd. | OLIX | 保留 |
| Modem | Modem | 保留 |
| ElevenLabs | ElevenLabs | 保留 |
| Cerebras Systems | Cerebras Systems | 保留 |
| ORamaVR | ORamaVR | 保留 |
| Eliyan Corporation | Eliyan | 保留 |
| Vimi | Vimi | 保留 |
| Ricursive Intelligence | Ricursive Intelligence | 保留 |
| Primemas, Inc. | Primemas | 保留 |
| Sparkli | Sparkli | 保留 |
| Optalysys | Optalysys | 保留 |
| Neurophos Inc. | Neurophos | 保留 |
| Railway | Railway | 保留 |
| Preply | Preply | 保留 |
| Upscale, Inc. | Upscale AI | 保留 |
| AheadComputing, Inc. | AheadComputing | 保留 |
| Ethernovia, Inc. | Ethernovia, Inc. | 具身范围排除 |
| 影目INMO | 影目INMO | 保留 |
| Quadric | Quadric | 保留 |
| Listen Labs | Listen Labs | 保留 |
| XREAL | XREAL | 保留 |
| GS Microelectronics U.S., Inc. | GSME | 保留 |
| xAI | xAI | 保留 |
| Photon | Photon | 保留 |
| Satlyt | Satlyt | 保留 |
| Miter | Miter | 保留 |
| Restate | Restate | 保留 |
| Flow Engineering | Flow Engineering | 保留 |
| Reco | Reco | 保留 |
| bilt.me | bilt.me | 保留 |
| Modulate | Modulate | 保留 |
| Instinct | Instinct | 保留 |
| Nscale Limited | Nscale | 保留 |
| Island | Island | 保留 |
| Basecamp Research | Basecamp Research | 保留 |
