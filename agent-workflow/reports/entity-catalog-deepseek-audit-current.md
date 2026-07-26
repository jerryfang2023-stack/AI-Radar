# Entity Catalog DeepSeek Audit

- Generated: 2026-07-26T16:18:39.356Z
- Model: deepseek-v4-pro
- Catalog: 533
- Reviewed: 533
- Confirmed (advisory): 435
- Correction candidates: 90
- Requires review: 3
- Insufficient evidence: 5
- Failed batches: 0

> DeepSeek output is advisory. No canonical entity, company-product relation, or public index was changed.

## Flagged items

### LM Studio (EN-7df09a7717ef2feb)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: LM Studio / product / -
- Issues: type
- Confidence: 0.9
- Claims: CL-46fb3d5ad9508a38, CL-727fd142f1eda91e, CL-c8732339ea9bef1a
- Rationale: 证据中明确将 LM Studio 描述为“本地 AI 模型运行平台”，这是一个产品/平台类别，而非公司实体。与苹果的合作关系是平台层面的合作，没有证据表明 LM Studio 是一个独立的公司组织。因此，建议将其类型从 company 更正为 product。

### 峰谷 Token (EN-16fe95bd48dbf178)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 峰谷 Token / product / 阿里巴巴
- Issues: company
- Confidence: 0.9
- Claims: CL-7ffba551f34adfdb, CL-a791c3122c2ed06f, CL-c41530a8c9e2911c
- Rationale: 证据显示“峰谷 Token”是阿里云旗下产品QoderWork推出的一项优惠功能/服务。根据规则，功能/服务应映射为产品。证据明确指出QoderWork是阿里巴巴推出的工具，因此“峰谷 Token”的发布公司应为阿里巴巴。当前公司名称为空，需更正。

### 高德问店 (EN-6631ecf47788552e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 高德问店 / product / 阿里巴巴
- Issues: company
- Confidence: 0.9
- Claims: CL-042d0d8f4ce542df, CL-b7cc20da766c8922, CL-ed55e8601f197aea
- Rationale: 所有证据均显示“阿里推出‘高德问店’服务”，明确表明发布公司为阿里巴巴（阿里）。当前公司信息为空，因此建议更正。

### 极摩客 EVO-X3 4T AMD AI 395 机皇版 (EN-88d56d69ca3828db)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 极摩客 EVO-X3 4T AMD AI 395 机皇版 / product / 极摩客
- Issues: company
- Confidence: 0.9
- Claims: CL-ad86541bb81c96ff
- Rationale: 证据中“极摩客 EVO-X3 4T AMD AI 395 机皇版将于 6 月 22 日在京东平台全球首发”表明该产品由“极摩客”发布，因此应将“极摩客”添加为当前公司。

### 科大讯飞智能办公本 Air 3 系列 (EN-14754db7f1439c88)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 科大讯飞智能办公本 Air 3 系列 / product / 科大讯飞
- Issues: company
- Confidence: 0.9
- Claims: CL-092fa3ba898c9332, CL-122d5452e326e7e0, CL-a46da6f2ae0481e9
- Rationale: 证据显示“科大讯飞智能办公本 Air 3 系列发布”和“科大讯飞本周推出了新一代智能办公本 Air 3 系列产品”，明确表明该产品由科大讯飞发布和制造，因此应将“科大讯飞”添加为当前公司。

### 云燧 ESL64-O 超节点 (EN-0b706b4b95ba647c)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 云燧 ESL64-O 超节点 / product / 燧原科技, 中兴通讯
- Issues: company
- Confidence: 0.9
- Claims: CL-23db5f68b34959d3, CL-4acaacad906c6cc7, CL-bef992849f6c8110
- Rationale: 证据显示“云燧 ESL64-O 超节点”由燧原科技联合中兴通讯发布，属于硬件产品。当前公司字段为空，但证据支持将燧原科技和中兴通讯列为发布公司。

### ACE (EN-285c8f76de6c6c97)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE / product / 英特尔, AMD
- Issues: company
- Confidence: 0.85
- Claims: CL-575c04e2b07891de, CL-a2375b5fa313c2b6, CL-e81385ade6248b7b
- Rationale: 证据显示ACE是一组x86指令集规范，由英特尔和AMD联合发布，属于产品。当前公司字段为空，应补充英特尔和AMD。

### Agent Governance Toolkit (EN-e75a2e5083aa0089)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Governance Toolkit / product / Microsoft
- Issues: company
- Confidence: 0.95
- Claims: CL-8db9327ffefca608, CL-785b4a16eb92e436, CL-d1d802757ac20e21
- Rationale: 证据明确说明 Agent Governance Toolkit 是在 Microsoft 组织下发布的开源项目，表明 Microsoft 是其发布和开发公司，当前公司名称为空，需要更正。

### AI Agent Platform for Supply Chain Execution (EN-87b3ab1e46b7ee62)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agent Platform for Supply Chain Execution / product / DeepFabric
- Issues: company
- Confidence: 1
- Claims: CL-b1e68ee5b2f20cf6, CL-e1070ff4b709c5ad, CL-fab74f8dd810022d
- Rationale: 证据显示DeepFabric发布了该AI智能体平台，明确支持DeepFabric为发布者，当前公司名称为空，应修正为DeepFabric。

### AI detector (EN-892b87f4931551f6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI detector / product / Substack
- Issues: company
- Confidence: 0.9
- Claims: CL-0d2b6ef28e9d3582, CL-348b3b74683edc81
- Rationale: 证据显示Substack新增了AI检测器，该工具由Pangram提供支持，但Substack是将其作为自身平台功能发布和运营的。因此，该产品应归属于Substack。当前公司名称为空，需要更正。

### AI Factories (EN-a614180064f7ef60)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Factories / product / Amazon
- Issues: company
- Confidence: 0.9
- Claims: CL-073d7041514940e9, CL-86601bb1a02ec3d6
- Rationale: 证据显示亚马逊宣布了一款名为'AI Factories'的新产品，允许客户在本地数据中心运行其AI系统。亚马逊是明确的发布者和运营者，因此公司应归属为Amazon。当前公司名称为空，需要更正。

### AI Factory (EN-e58ee91f1d57df05)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Factory / product / HPE
- Issues: company
- Confidence: 0.9
- Claims: CL-76a95a4a201509d2
- Rationale: 证据显示HPE发布了名为'HPE AI Factory'的产品，该产品与NVIDIA合作，但由HPE推出和提供。因此，公司应归属为HPE。当前公司名称为空，需要更正。

### AI Interconnect Platform (EN-b0eea3ad7b0d0a48)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Interconnect Platform / product / Chelsio
- Issues: company
- Confidence: 0.95
- Claims: CL-9a80556cc27c0403, CL-acb61a846e6acac5
- Rationale: 证据明确显示Chelsio Communications宣布推出其第七代AI互连平台（AI Interconnect Platform）。Chelsio是明确的制造商和发布者，因此公司应归属为Chelsio。当前公司名称为空，需要更正。

### AI NAS (EN-40f6c2fd87ea61d5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI NAS / product / 极空间
- Issues: company
- Confidence: 0.9
- Claims: CL-617a7f25073fe551, CL-047c659c8eb3e8f7, CL-2ee60a40121399b2
- Rationale: 证据明确显示极空间宣布与奕斯伟计算合作推出全球首款 RISC-V 架构消费级 AI NAS，表明极空间是该产品的发布和制造方，当前公司名称为空，应更正为“极空间”。

### AI Overviews (EN-834ab0b6e4492d23)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Overviews / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-8aa5913ecc6b8be7, CL-66ad23809957cc98, CL-88aeea2a16ac2d86
- Rationale: 证据显示 Google 正在为搜索中的 AI Overviews 添加 AI 图像生成功能，且 Google Images 25 周年活动也提及 AI Overviews 图像生成，表明 AI Overviews 是 Google 的产品，当前公司名称为空，应更正为“Google”。

### AI Roleplay Sessions (EN-6852734baccb5ebd)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Roleplay Sessions / product / Synthesia
- Issues: company
- Confidence: 0.9
- Claims: CL-07ff97be47b0209a, CL-31868fac98857730, CL-ba7fa5d7a4b96eae
- Rationale: 证据明确显示 Synthesia 推出 AI Roleplay Sessions，作为其更广泛的“Sessions”平台下的首个产品，表明 Synthesia 是该产品的发布和开发方，当前公司名称为空，应更正为“Synthesia”。

### AI SDK 7 (EN-ce6d74a013453189)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI SDK 7 / product / Vercel
- Issues: company
- Confidence: 0.9
- Claims: CL-0fc50f41976365b4
- Rationale: 证据明确显示 Vercel 发布 AI SDK 7，表明 Vercel 是该产品的发布和开发方，当前公司名称为空，应更正为“Vercel”。

### AI Studio (EN-f37cf2572d42b328)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Studio / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-1b833e513f254cc0, CL-7f56d59fd8f58a23, CL-f0b72552bdd40a4b
- Rationale: 证据显示 Google AI Studio 推出 Gemini 模型与智能体交互 API，表明 AI Studio 是 Google 旗下的产品，当前公司名称为空，应更正为“Google”。

### AI Trust Platform (EN-8487426ba81162db)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Trust Platform / product / OpenBox AI
- Issues: company
- Confidence: 1
- Claims: CL-3265eaa722ce0cd3, CL-4025bb89e730bc8a, CL-5c9136b4d8345f5e
- Rationale: 证据显示OpenBox AI推出并公开发布了企业级AI信任平台，事件标题和引用均表明该产品由OpenBox AI发布，当前公司名称为空，应修正为OpenBox AI。

### AI Workforce Platform (EN-9e51ca48d5ecf16f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Workforce Platform / product / Atomicwork
- Issues: company, duplicate
- Confidence: 0.85
- Claims: CL-55d4c2c5a74b2a19, CL-62501b66860c9002, CL-03d4dea4c9bf0564
- Rationale: 证据显示Atomicwork发布了AI workforce management platform，'AI Workforce Platform'与EN-6d51d80daa73eb4a的'AI Workforce'指向同一产品，应合并。Atomicwork是发布者，应添加为公司名称。

### AI-RAN (EN-f0fa30cd90f406c8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-RAN / product / 诺基亚
- Issues: company
- Confidence: 0.9
- Claims: CL-a7d807152cb083b1, CL-acfe2b27d62beca2, CL-32ea00e5c0e5b9a8
- Rationale: 证据明确显示诺基亚推出了AI-RAN平台，'Nokia's AI-RAN platform'表明诺基亚是该产品的开发者和发布者，应添加诺基亚为公司名称。

### AI-specific chip (EN-d0cf06b547fad71d)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company
- Confidence: 0.5
- Claims: CL-35aa14c242a3f09a
- Rationale: 证据中“AI-specific chip”是Meta新款芯片的描述性短语，并非正式产品名称，且当前无公司名称记录。无法确定其是否为正式产品名或仅为一个通用描述，需进一步审核。

### AMD AI 395 (EN-b8087e26a688494b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AMD AI 395 / product / AMD
- Issues: company
- Confidence: 0.8
- Claims: CL-ad86541bb81c96ff
- Rationale: 证据中“AMD AI 395”作为极摩客EVO-X3产品的一个配置/组件出现，其名称本身暗示了与AMD的强关联。虽然证据未直接声明AMD制造或发布它，但作为组件名称，将其公司归属为AMD是合理的修正。

### Android 17 (EN-e0bab6f6c58bfe4e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Android 17 / product / 谷歌
- Issues: company
- Confidence: 0.9
- Claims: CL-2d3d4cf25f483fee, CL-9ca1813b0e901145, CL-524ffc470ce7246d
- Rationale: 证据标题和内容均提及“谷歌推送 Android 17 正式版”，并说明其将搭载于谷歌Pixel设备，这足以证明Android 17是由谷歌开发并发布的操作系统。

### AstraBrain-WBC 0.5 (EN-0d049cd1e9f619f9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AstraBrain-WBC 0.5 / product / 银河通用
- Issues: company
- Confidence: 0.95
- Claims: CL-2d9c0183892f925c, CL-3166c56a9815c0ee, CL-8a246deb4a52a8fa
- Rationale: 证据显示“银河通用机器人”发布了名为 AstraBrain-WBC 0.5 的模型。当前目录项未列出任何公司，应更正为“银河通用”。

### Auto-review (EN-b7efc8f24f2e2358)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Auto-review / product / Cursor
- Issues: company
- Confidence: 0.9
- Claims: CL-27edd7de05c58272, CL-421f045aefa19028
- Rationale: 所有证据均显示 Cursor 发布了 Auto-review，明确支持 Cursor 是该产品的发布者。当前公司名称为空，应更正为 Cursor。

### AutoPilot (EN-c141d2237427f30d)

- Decision: correction_candidate
- Current type / company: product / Microsoft
- Proposed: AutoPilot / product / Microsoft
- Issues: company
- Confidence: 0.85
- Claims: CL-f4fdde2db1597bc8
- Rationale: 证据显示 Microsoft 计划推出名为 AutoPilot 的 AI 智能体，当前公司名称已为 Microsoft，但证据中的 subject 为“微软八月将”，非标准公司名称。根据引用内容，发布主体为 Microsoft，公司名称可保留。但需注意 subject 字段不规范，建议审查。

### AZ3 Pro (EN-553d045569eaf2e5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AZ3 Pro / product / Amazon
- Issues: company
- Confidence: 0.9
- Claims: CL-236ba598e4252340
- Rationale: 证据明确显示 AZ3 Pro 是亚马逊的自有芯片，Amazon 是该产品的开发者和拥有者。当前公司名称为空，应更正为 Amazon。

### Claude for Small Business (EN-efd2f8add3dd89c7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Claude for Small Business / product / Anthropic
- Issues: company
- Confidence: 0.9
- Claims: CL-34caf28aa829aa12, CL-12dd00814752b4aa
- Rationale: 证据中“the company announced Wednesday the launch of Claude for Small Business”以及提及“Claude Cowork, the company’s task-automation platform”，结合事件标题“Anthropic 瞄准新客户群体：小企业主”，可以明确发布该产品的公司是Anthropic。当前条目缺少公司信息，应予以补充。

### Claude Opus 4.8 (EN-876fd4f1c5320cc4)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的证据仅提及Claude Opus 4.8 fast mode的定价变化，未明确说明其产品类型或所属公司，无法确认当前信息。

### ColorOS 16 (EN-c38c7d20347bd908)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ColorOS 16 / product / OPPO
- Issues: company
- Confidence: 0.9
- Claims: CL-283a5aa2f1f1aab3, CL-ae48434223721c51, CL-da4f064dea42dff9
- Rationale: 所有证据均显示“OPPO ColorOS 16”或“OPPO 今日公布 ColorOS 16”，明确 OPPO 是该操作系统的发布和拥有者。当前公司名称为空，应补充 OPPO。

### Compact, Energy-Efficient Systems (EN-56ee86045cfb0ddd)

- Decision: correction_candidate
- Current type / company: product / Supermicro
- Proposed: Compact, Energy-Efficient Systems / product / Supermicro
- Issues: name
- Confidence: 0.7
- Claims: CL-71e2abe848866c02, CL-55659ee9c4f25cec, CL-5276acf634a2cdf7
- Rationale: 证据中“Supermicro Introduces Compact, Energy-Efficient Systems”表明这是一类系统的描述性名称，而非专有产品名。但鉴于证据直接使用此短语作为发布对象，暂时保留原名并确认 Supermicro 为发布者。别名“Introduces Compact”是标题片段，应移除。

### Composer 2.5 (EN-ba1269449ab76537)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Composer 2.5 / product / Cursor
- Issues: company
- Confidence: 0.9
- Claims: CL-02ec1f669993f2f4, CL-1cefd5ca06db9785, CL-9a143b175e97cc12
- Rationale: 所有证据均显示Cursor发布了Composer 2.5，且产品已在Cursor中上线，明确支持Cursor为该产品的发布和运营公司，因此应将current_company_names更正为Cursor。

### Computer Use (EN-3aa38718f0399af9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Computer Use / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-c7f6ee0108809633
- Rationale: 证据显示Google将Computer Use功能集成到Gemini 3.5 Flash中，表明Google是该功能的开发者和提供者，因此应将current_company_names更正为Google。

### Continuum (EN-02bb4eeba3bde980)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Continuum / product / AWS
- Issues: company
- Confidence: 0.9
- Claims: CL-0cc7e31523493be6, CL-24c0c5e4ec909641, CL-a5a3a28dc159637e
- Rationale: 证据显示AWS推出了Continuum和Context两项新服务，明确支持AWS为Continuum的发布公司，因此应将current_company_names更正为AWS。

### CUGA (EN-d6d6e4e33c59b45e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: CUGA / product / IBM
- Issues: company
- Confidence: 1
- Claims: CL-2126331ef6503828, CL-9ce295a92a1fc3bf, CL-b9d0d3f3c8c311b9
- Rationale: 证据明确显示CUGA是IBM的开源智能体框架，由IBM发布，当前公司名称为空，应修正为IBM。

### Cursor Router (EN-1f9d72d5cc62d35e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Cursor Router / product / Cursor
- Issues: company
- Confidence: 1
- Claims: CL-44753af41b8c40bc, CL-b97835c526656871, CL-0a0a652be7d568e9
- Rationale: 证据明确显示Cursor发布了Cursor Router，当前公司名称为空，应修正为Cursor。

### Custom Agents (EN-ba961b5c6d1aee29)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: M-Files Custom Agents / product / M-Files
- Issues: name, company
- Confidence: 0.9
- Claims: CL-23c756ddc6d7a867, CL-8d31cb4dd0cdd635
- Rationale: 证据显示M-Files推出了新的M-Files Custom Agents (Beta)，产品名称应为M-Files Custom Agents，公司为M-Files，当前名称和公司信息不完整。

### Data Readiness Platform (EN-73df89424ba2e889)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Data Readiness Platform / product / Rabble AI
- Issues: name, company
- Confidence: 0.9
- Claims: CL-c414c81d8d9e7fad
- Rationale: 证据中Rabble AI宣布推出其AI数据就绪平台，产品名称应为AI Data Readiness Platform，公司为Rabble AI，当前名称和公司信息不完整。

### DeepFabric AI Agent Platform (EN-774e4ae6eef0efdb)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DeepFabric AI Agent Platform / product / DeepFabric
- Issues: company
- Confidence: 0.9
- Claims: CL-b1e68ee5b2f20cf6, CL-e1070ff4b709c5ad, CL-fab74f8dd810022d
- Rationale: 证据中DeepFabric宣布其AI代理平台全面上市，明确表明DeepFabric是该产品的发布者，当前公司信息缺失。

### Design Stream (EN-d692adb22248825f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Design Stream / product / MattoBoard
- Issues: company
- Confidence: 0.9
- Claims: CL-25bcdd5994eed390, CL-5859ce277c3fe2cf
- Rationale: 证据明确指出 Design Stream 是 MattoBoard 公司推出的 AI 驱动视觉搜索和发现工具，属于产品。当前公司名称为空，应更正为 MattoBoard。

### Dragonfly (EN-9d534deeea39a521)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Dragonfly / product / Qualcomm
- Issues: company
- Confidence: 0.9
- Claims: CL-2ae83064809b93df, CL-cae005bb954b2ef9
- Rationale: 证据显示高通（Qualcomm）推出了 Dragonfly 数据中心产品组合，包括 Dragonfly C1000 CPU 和 AI300 推理加速器。因此，Dragonfly 是高通的产品，当前公司名称为空，应更正为 Qualcomm。

### EdgeMesa N AI+ (EN-3f750f52c80c4445)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: EdgeMesa N AI+ / product / 微星
- Issues: company
- Confidence: 0.9
- Claims: CL-16816af68c993d57
- Rationale: 证据显示“微星宣布 NVIDIA RTX Spark 迷你主机 EdgeMesa N AI+”，明确表明微星发布了该产品，因此应将当前公司名称更正为“微星”。

### Foundation Models framework (EN-41dcc2d4951f337b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Foundation Models framework / product / Apple
- Issues: company
- Confidence: 0.9
- Claims: CL-5e55b73326fc1077, CL-9b9af4ee977e02f6
- Rationale: CL-5e55b73326fc1077 和 CL-9b9af4ee977e02f6 均提到 'Apple's Foundation Models framework'，表明该框架由 Apple 拥有和开发。当前目录中公司名称为空，应修正为 Apple。产品名称和类型保持不变。

### Gemini 3.5 Flash Cyber (EN-31055a8d9856fce4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini 3.5 Flash Cyber / product / 谷歌
- Issues: company
- Confidence: 1
- Claims: CL-bcccc3f03d4b38a9, CL-1407e158e3017631, CL-910d21a1f5ab0b3c
- Rationale: 所有证据均显示谷歌发布了 Gemini 3.5 Flash Cyber，明确支持谷歌是该产品的开发与发布公司，当前公司名称为空，应更正为谷歌。

### Gemini API (EN-a6f1623a1e5232a6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini API / product / Google Deepmind
- Issues: company
- Confidence: 1
- Claims: CL-21d206ae86a7b6eb, CL-3cad9a139bae62ba, CL-80619fd5e25eabb6
- Rationale: 所有证据均显示 Google Deepmind 为 Gemini API 添加新功能，明确支持 Google Deepmind 是该产品的开发与发布公司，当前公司名称为空，应更正为 Google Deepmind。

### Gemini Enterprise Agent Platform (EN-5567ce1995cc85d7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Enterprise Agent Platform / product / Google Cloud
- Issues: company
- Confidence: 0.9
- Claims: CL-5912581fa2dc70b8
- Rationale: 证据显示“Google Cloud 发布 Gemini Enterprise Agent 平台”，明确表明Google Cloud发布了该平台，因此应将当前公司名称更正为“Google Cloud”。

### Gemini Notebook (EN-ec75c4fe965a0492)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Notebook / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-f723ec5f7128c2b4
- Rationale: 证据明确指出Google将NotebookLM更名为Gemini Notebook，并作为工具集成到其生态系统中。这直接证明了Google对该产品的发布和所有权，因此应将公司名称更正为Google。

### Gemini Omni Flash (EN-7ed9c9e7c260ed06)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Omni Flash / product / Google DeepMind
- Issues: company
- Confidence: 0.9
- Claims: CL-1030b31c165540d3, CL-3ca47c32c729c6e8, CL-4cf8bbb7f166e862
- Rationale: 证据显示Google DeepMind在Google I/O上介绍了Gemini Omni Flash，并通过Gemini API和Google AI Studio向开发者推出。这明确表明Google DeepMind是该产品的发布和开发主体，应将其公司名称更正为Google DeepMind。

### Gemini Spark (EN-307557d99a7eb726)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Spark / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-b000143fed6c52d3, CL-b0dab5d514b2d3a0, CL-51ad135c82b9455b
- Rationale: 证据将Gemini Spark描述为“谷歌 AI 智能体”，并提及Google为其添加了Tasks和Keep支持。这直接证明了Google对该产品的开发和运营，应将其公司名称更正为Google。

### Grok 4.5 (EN-24caf10fe9bfb1c5)

- Decision: correction_candidate
- Current type / company: product / xAI
- Proposed: Grok 4.5 / product / SpaceXAI
- Issues: company
- Confidence: 0.9
- Claims: CL-913d46a75159fe2c, CL-ec2d6107c732e14c, CL-9237aaeca90244b9
- Rationale: 所有三条证据均明确指出 SpaceXAI 发布了 Grok 4.5，而非 xAI。证据中未出现 xAI 作为发布者，因此当前公司名称 xAI 应更正为 SpaceXAI。

### Grok Build (EN-c4bc2d00a42f220f)

- Decision: correction_candidate
- Current type / company: product / xAI
- Proposed: Grok Build / product / SpaceXAI
- Issues: company
- Confidence: 0.9
- Claims: CL-66990e99d6c6046f, CL-54c7c187771e7610, CL-8dea0880a232aacb
- Rationale: CL-66990e99d6c6046f 和 CL-8dea0880a232aacb 明确提到 SpaceXAI 开源了 Grok Build。CL-54c7c187771e7610 虽提及 xAI，但描述的是产品功能，而发布行为由 SpaceXAI 完成。根据发布者证据，公司应更正为 SpaceXAI。

### HarmonyOS 7.0 Developer Beta (EN-e18cb6435603205d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HarmonyOS 7.0 Developer Beta / product / 华为
- Issues: company
- Confidence: 0.8
- Claims: CL-b8364b9d819b3559
- Rationale: 证据中事件标题为“华为 HarmonyOS 7.0 Developer Beta 1 更新”，且主语为“华为”，表明华为发布了该产品。当前公司名称为空，应修正为“华为”。

### Hermes Agent (EN-0db2d631b42da133)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hermes Agent / product / Nous Research
- Issues: company
- Confidence: 0.9
- Claims: CL-a9e6156c1a1a2462, CL-7bac82227b837b4a
- Rationale: 证据明确指出“Hermes Agent is an open-source personal agent from Nous Research”，直接证明了开发公司为Nous Research。当前公司名称为空，应予以修正。

### Hermes Agent Profile Builder (EN-c18179b68329b054)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hermes Agent Profile Builder / product / Nous Research
- Issues: company
- Confidence: 0.8
- Claims: CL-df4e79b3ca7d8bd6
- Rationale: 证据提到“Hermes Agent is Nous Research’s open-source, self-improving agent... The Profile Builder brings those pieces into a browser form”，表明Profile Builder是Nous Research的Hermes Agent的一部分或相关工具，由Nous Research开发。当前公司名称为空，应修正为“Nous Research”。

### HKGAI V3 (EN-67c6738648b7e247)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HKGAI V3 / product / 香港生成式人工智能研发中心
- Issues: company
- Confidence: 0.9
- Claims: CL-c2adf9ebcc1b916a
- Rationale: 证据明确指出“香港生成式人工智能研发中心（HKGAI）...正式发布最新版本的本地大模型 HKGAI V3”，直接证明了发布机构。当前公司名称为空，应修正为“香港生成式人工智能研发中心”。

### Instinct MI455X (EN-eab9999c377924ae)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Instinct MI455X / product / AMD
- Issues: company
- Confidence: 0.9
- Claims: CL-6212c68629b73001, CL-02fdf0c306a3a67d, CL-1a457c9264413ff0
- Rationale: 证据中明确提到“AMD 展示了 Instinct MI455X”和“AMD 发布 Instinct MI455X AI 加速器”，表明Instinct MI455X是AMD的产品，当前公司名称为空，应更正为AMD。

### Kē (EN-ade7ba309eb7a3bf)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Kē / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-25e76f88684f5309, CL-291b248f0d0b7be2
- Rationale: 证据显示Kē是由Karamo Brown推出的健康应用，但Karamo Brown是个人而非公司。当前关系中的发布者EN-0fc990954c0aea17未在提供的目录项中定义，且证据未提供明确的公司实体作为发布者，因此建议将公司名称清空并标记为需审查。

### LangBuilder (EN-51a5b811990f2a2a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LangBuilder / product / CloudGeometry
- Issues: company
- Confidence: 0.95
- Claims: CL-352eef31fe17fd2e
- Rationale: 证据CL-352eef31fe17fd2e明确说明LangBuilder是CloudGeometry的开源企业级AI智能体平台，支持将公司名称从空更正为CloudGeometry。

### Lynx (EN-48d357471ca207b8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Lynx / product / Tigera
- Issues: company
- Confidence: 0.9
- Claims: CL-28f53e06690eb1ab
- Rationale: 证据中事件标题为“我们为何构建 Lynx”，事件主体为“Tigera”，引用内容为“Lynx is generally available today.”。这明确表明 Tigera 构建并发布了 Lynx，因此应将 Tigera 添加为发布公司。

### M-Files Custom Agents (Beta) (EN-b465eebe35e3889a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: M-Files Custom Agents (Beta) / product / M-Files
- Issues: company
- Confidence: 0.9
- Claims: CL-23c756ddc6d7a867, CL-8d31cb4dd0cdd635
- Rationale: 证据中“M-Files... launched new M-Files AI agents”和“The new M-Files Custom Agents (Beta) bring AI instructions...”明确表明 M-Files 发布了该产品。因此应将 M-Files 添加为发布公司。

### M-Robots OS 2.0 (EN-80ea42a231357d12)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: M-Robots OS 2.0 / product / 深开鸿
- Issues: company
- Confidence: 0.9
- Claims: CL-c1f4199a021ea02a, CL-4bb257a6d8170957, CL-53d42ff7b84a2843
- Rationale: 证据中“深开鸿发布了全国首个基于开源鸿蒙打造的机器人操作系统 —— M-Robots OS 2.0 版本”明确表明深开鸿发布了该产品。因此应将深开鸿添加为发布公司。

### Maestro Case (EN-478e0ad4e0940af0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Maestro Case / product / UiPath
- Issues: company
- Confidence: 0.9
- Claims: CL-9f53fed93458f1a8
- Rationale: 证据显示 UiPath 宣布推出 Maestro Case，明确表明 UiPath 是该产品的发布者。当前公司名称为空，应更正为 UiPath。

### MAI-Thinking-1 (EN-1f8a924e62194552)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MAI-Thinking-1 / product / Microsoft
- Issues: company
- Confidence: 0.95
- Claims: CL-1aea9f343691d1ff, CL-4f184a6088c1fe4b, CL-a40f054bb4ddede3
- Rationale: 证据显示微软推出MAI-Thinking-1，并明确称其为Microsoft AI的推理模型，由微软从零开始训练。当前产品未关联任何公司，应修正为Microsoft。

### MAI-Transcribe-1.5 (EN-72d74884ff03d39c)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MAI-Transcribe-1.5 / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-dddcf80426ef8ef4
- Rationale: 证据显示Microsoft AI宣布推出MAI-Transcribe-1.5，并称其为公司内部语音转文本系列的第二代产品。当前产品未关联任何公司，应修正为Microsoft。

### Microsoft Foundry (EN-d0bfa24cf1e53827)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company
- Confidence: 0.4
- Claims: CL-8a79c00232e1ccdc, CL-c485598b128a179d, CL-99352dba6260dc88
- Rationale: 证据仅提及 Claude 模型在 Microsoft Foundry 上可用，以及 Claude Desktop 通过 Microsoft Foundry 使用，属于平台托管或集成关系，未提供 Microsoft 发布、开发或拥有 Microsoft Foundry 的明确声明。无法确认其产品类型及所属公司，需进一步审查。

### MiniCPM (EN-12a81529bba89666)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MiniCPM / product / 面壁智能
- Issues: company
- Confidence: 0.9
- Claims: CL-6ec9ec2903819053, CL-e036cc41f39e2bd4, CL-0b9269713872b516
- Rationale: 证据明确指出 MiniCPM 系列端侧模型由面壁智能自主研发，当前目录未关联任何公司，应补充公司信息。产品名称和类型正确。

### N304-AI (EN-2a1a2c0e6618db48)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: N304-AI / product / MINIX
- Issues: company
- Confidence: 1
- Claims: CL-561fb20449aeb00c
- Rationale: 证据明确显示MINIX宣布了其AI迷你主机新品N304-AI，直接支持MINIX为制造商，产品类型为硬件产品。

### NaviX Ultra (EN-dd758281d0c70e60)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NaviX Ultra / product / 努比亚
- Issues: company
- Confidence: 0.9
- Claims: CL-307b10bcec775dcc
- Rationale: 证据显示“努比亚 NaviX Ultra”作为“全球首款 AI 智能体手机”亮相，且事件类型为 product_release，主语为“努比亚”。这明确表明努比亚发布了该产品，因此应将 current_company_names 修正为“努比亚”。

### NemoClaw (EN-ab9e3beebd83960d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NemoClaw / product / NVIDIA
- Issues: company
- Confidence: 0.9
- Claims: CL-763c596f78cb7f74, CL-8ee78257d6ea9b9f, CL-b0e16c8146dc5224
- Rationale: 所有证据均显示“NVIDIA 推出 NemoClaw 平台”或“NVIDIA NemoClaw”，事件类型为 product_release，主语为 NVIDIA。这明确表明 NVIDIA 发布了该产品，因此应将 current_company_names 修正为“NVIDIA”。

### North Mini Code (EN-833cd615d86b73ca)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: North Mini Code / product / Cohere
- Issues: company
- Confidence: 1
- Claims: CL-e8ba0d81b2700e89, CL-15111d0a7d902419
- Rationale: 证据显示 Cohere 发布了名为 'North Mini Code' 的编码模型。这明确支持 Cohere 是该产品的开发者和发布者。当前目录中公司名称为空，需要更正为 Cohere。产品名称和类型均正确。

### NotebookLM (EN-7496c16a89e136e6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NotebookLM / product / Google
- Issues: company
- Confidence: 1
- Claims: CL-f723ec5f7128c2b4
- Rationale: 证据显示 Google 正在将 NotebookLM 重命名并集成到其生态系统中。这直接证明了 Google 拥有并运营该产品。当前目录中公司名称为空，需要更正为 Google。产品名称和类型均正确。

### NousCoder-14B (EN-761c4b9294ee43a7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NousCoder-14B / product / Nous Research
- Issues: company
- Confidence: 1
- Claims: CL-e828e0ea08beaf67
- Rationale: 证据明确指出 Nous Research 发布了名为 NousCoder-14B 的模型。这直接证明了 Nous Research 是该产品的开发者。当前目录中公司名称为空，需要更正为 Nous Research。产品名称和类型均正确。

### OpenCode (EN-b644c0a9d493976a)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0
- Claims: -
- Rationale: 证据仅将OpenCode作为比较对象提及，或说明小米MiMo Code基于其二次开发，未提供任何关于OpenCode由哪家公司发布、开发或拥有的明确声明，无法确认其归属公司。

### OpenWorker (EN-833940e4d17c9df3)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0
- Claims: -
- Rationale: 证据提到吴恩达宣布推出OpenWorker，但个人宣布开源项目不能等同于其所属公司发布产品，且未提供任何公司实体发布或拥有该产品的声明，无法确认其归属公司。

### Outcome-Based Pricing (EN-a6ed199f8859e462)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Outcome-Based Pricing / product / Intercom
- Issues: company
- Confidence: 0.9
- Claims: CL-7a2d6d9738b7b016
- Rationale: 证据显示 Intercom 为其 Fin AI 智能体推出了基于结果的定价模式，表明“Outcome-Based Pricing”是 Intercom 发布的一项产品功能或服务。当前公司名称为空，应更正为 Intercom。

### Parallel Web Search (EN-7a6d113e2d376015)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Parallel Web Search / product / Gemini Enterprise Agent Platform
- Issues: company
- Confidence: 0.9
- Claims: CL-724d4050ecf3fcf2
- Rationale: 证据显示“Gemini Enterprise Agent Platform”新增了“Parallel Web Search”作为网络接地提供商，表明该功能由该平台发布。当前公司名称为空，应更正为 Gemini Enterprise Agent Platform。

### Pixel (EN-afe83c198e329ef2)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Pixel / product / 谷歌
- Issues: company
- Confidence: 0.9
- Claims: CL-524ffc470ce7246d, CL-a11cf53e9ae277c1
- Rationale: 证据提到“谷歌自家 Pixel 系列设备”和“谷歌依托安卓系统与 Pixel 硬件展示自研前沿 AI 技术”，明确表明 Pixel 是谷歌的产品。当前公司名称为空，应更正为谷歌。

### Project Indigo (EN-419f2cd96ee122e3)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: -
- Confidence: 0
- Claims: -
- Rationale: 该条目无任何证据，无法确认其名称、类型或所属公司。

### Proton Order & Quote Entry Automation (EN-076804bec879d667)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Proton Order & Quote Entry Automation / product / Proton.ai
- Issues: company
- Confidence: 0.9
- Claims: CL-827ed4416c2a6307
- Rationale: 证据显示“Proton.ai...announced the general availability of Proton Order & Quote Entry Automation”，明确表明Proton.ai发布了该产品，因此应将Proton.ai列为所属公司。

### Qwen3.8 (EN-0f553f48551aef83)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Qwen3.8 / product / 阿里巴巴
- Issues: company
- Confidence: 0.9
- Claims: CL-2a291114dd799b88, CL-79511cdc077fcaa5
- Rationale: 证据描述 Qwen3.8 是“阿里最新旗舰模型”，并提及阿里云对其进行了适配。这明确表明 Qwen3.8 是由阿里巴巴开发的模型，因此其公司应更正为“阿里巴巴”。

### RegattaDB (EN-5f6367300dabc238)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: RegattaDB / product / Regatta Data
- Issues: company
- Confidence: 0.95
- Claims: CL-442ef4ea70dab9f9
- Rationale: 证据中明确提到“Regatta Data today announced the general availability of RegattaDB”，表明Regatta Data是RegattaDB的发布和开发公司，因此应将current_company_names更新为Regatta Data。

### Robostral Navigate (EN-994f9b7ac2d11473)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Robostral Navigate / product / Mistral
- Issues: company
- Confidence: 0.95
- Claims: CL-a37cbd6c6489aec5
- Rationale: 证据中明确提到“Mistral is entering the robotics market with Robostral Navigate”，表明Mistral是Robostral Navigate的发布公司，因此应将current_company_names更新为Mistral。

### ROCm 7.14 (EN-6066d80012446517)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ROCm 7.14 / product / AMD
- Issues: company
- Confidence: 0.95
- Claims: CL-00b4ec8c054d2146
- Rationale: 证据中明确提到“ROCm 是 AMD 推出的开源软件栈”，表明AMD是ROCm 7.14的开发和发布公司，因此应将current_company_names更新为AMD。

### RTX PRO 6000 (EN-65b3aa2f527deeef)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: RTX PRO 6000 / product / NVIDIA
- Issues: company
- Confidence: 0.95
- Claims: CL-9cc98d31288c9ff7
- Rationale: 证据中多次提到“NVIDIA RTX PRO 6000 Blackwell Server Edition”，表明RTX PRO 6000是NVIDIA的产品，因此应将current_company_names更新为NVIDIA。

### S 30 (EN-59252e364ef9a41f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: S 30 / product / Soofi 联盟
- Issues: company
- Confidence: 0.95
- Claims: CL-ecbd398d1cee8977
- Rationale: 证据中明确提到“Soofi 联盟发布 Soofi S 30B-A3B”，表明Soofi 联盟是S 30的发布组织，因此应将current_company_names更新为Soofi 联盟。

### Smartsheet MCP Connector for Claude (EN-46045341ebce3cd6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Smartsheet MCP Connector for Claude / product / Smartsheet
- Issues: company
- Confidence: 0.9
- Claims: CL-7c1f8792fffc831d
- Rationale: 证据显示“The Smartsheet MCP Connector for Claude lets users...”，且事件主体为Smartsheet，表明该产品由Smartsheet发布或提供，应将其列为所属公司。

### SQRL (EN-833cc1efccceb180)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: SQRL / product / Feyn AI
- Issues: company
- Confidence: 0.9
- Claims: CL-b0791a07fdf6acf3, CL-b2fa7fd810072a42
- Rationale: 证据显示“The Feyn team has released SQRL”，明确Feyn AI发布了该模型族。当前目录中company_names为空，与证据不符，应修正为“Feyn AI”。

### Sting Ray (EN-f53afc9370d87317)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Sting Ray / product / TokyoArtisan Intelligence
- Issues: company
- Confidence: 0.95
- Claims: CL-87254c3fba0aa3ec
- Rationale: 证据CL-87254c3fba0aa3ec显示TokyoArtisan Intelligence（TAI）完成了其基于FPGA的40nm边缘物理AI芯片原型“Sting Ray”的验证，明确表明该公司开发/制造了该产品。当前current_company_names为空，应更正为TokyoArtisan Intelligence。

### StoryKit (EN-c2624a0c7838487f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: StoryKit / product / Meta
- Issues: company
- Confidence: 0.95
- Claims: CL-80583475af66b4af
- Rationale: 证据CL-80583475af66b4af明确声明“Meta 正在开发一款名为 StoryKit 的 AI 故事应用”，直接支持Meta为该产品的开发公司。当前current_company_names为空，应更正为Meta。

### Surface Laptop Ultra (EN-4c66141fde69a497)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Surface Laptop Ultra / product / 微软
- Issues: company
- Confidence: 0.95
- Claims: CL-aef210c47613a275
- Rationale: 证据CL-aef210c47613a275显示“微软公布的首款相关设备 Surface Laptop Ultra”，明确表明微软发布了该产品。当前current_company_names为空，应更正为微软。

### T-Head SAIL (EN-5398729239788ca5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: T-Head SAIL / product / 阿里平头哥半导体
- Issues: company
- Confidence: 0.95
- Claims: CL-29ef28cd664376e4, CL-391fc36b78a2ade0, CL-85b848bd100ce23d
- Rationale: 证据明确指出 T-Head SAIL 是阿里平头哥半导体自研并正式开源的 AI 软件栈，属于产品。当前目录中 canonical_name 和 catalog_type 正确，但 current_company_names 为空，应补充为“阿里平头哥半导体”。

### T7 AI Interconnect Platform (EN-9c515f4c878bdb2e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: T7 AI Interconnect Platform / product / Chelsio
- Issues: company
- Confidence: 0.95
- Claims: CL-6d446e6da55bdde6, CL-7a606b483bf24c80, CL-9a80556cc27c0403
- Rationale: 证据显示 Chelsio 推出了第七代基于以太网的 AI 互连平台 T7，属于产品。当前目录中 canonical_name 和 catalog_type 正确，但 current_company_names 为空，应补充为“Chelsio”。

### VeeaONE Distributed Intelligence (EN-bedb12f1287b2f70)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VeeaONE Distributed Intelligence / product / Veea Inc.
- Issues: company
- Confidence: 0.9
- Claims: CL-acdcdd157aa5237c
- Rationale: 证据显示Veea Inc.宣布其全栈边缘到云解决方案的商业可用性，产品名称为VeeaONE Distributed Intelligence，应补充公司归属Veea Inc.。

### Verifiers (EN-1c6392c229ed9069)

- Decision: correction_candidate
- Current type / company: product / Prime Intellect
- Proposed: Verifiers / product / Prime Intellect
- Issues: name
- Confidence: 0.85
- Claims: CL-434349c3bb4f4e0d, CL-640c4ad549143696, CL-73a06a2613c622b3
- Rationale: 证据中产品名称均为小写 'verifiers' 或 'verifiers v1'，但当前条目名称为 'Verifiers'。证据明确显示 Prime Intellect 发布了该产品，因此建议将名称修正为 'Verifiers' 并确认公司归属。

### Visual Studio 2026 (EN-b6779d8d1c36e158)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0
- Claims: -
- Rationale: 证据仅提供了 Visual Studio 2026 的发行说明和更新内容，未包含任何关于发布、开发或拥有该产品的公司实体的明确声明，无法确认其所属公司。

### WEEBILL 5 (EN-62a4b84fb5a8f6b0)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0.8
- Claims: CL-0017162f41227048, CL-2b57c426c3b0badc, CL-687d0e337ae7ff98
- Rationale: 证据中“智云 WEEBILL 5”作为主语出现，但“智云”是品牌名还是公司名无法从现有Claim中明确判定，且无明确“发布”“制造”等谓语指向具体公司实体，因此公司信息需复核。

### Win11 RP 预览版文件管理器 (EN-f2fbe15b2a0782c0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Win11 RP 预览版文件管理器 / product / 微软
- Issues: company
- Confidence: 0.85
- Claims: CL-34fddab81951af35, CL-e0e9848074748a46, CL-3c62d52890307500
- Rationale: 所有证据均将“微软Win11 RP预览版文件管理器”作为主语，描述其新增Copilot按钮的功能，表明这是微软Windows 11预览版中的一个功能/组件。证据明确将微软与该产品关联，因此建议将公司名称修正为“微软”。
