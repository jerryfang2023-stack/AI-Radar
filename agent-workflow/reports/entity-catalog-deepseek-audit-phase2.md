# Entity Catalog DeepSeek Audit

- Generated: 2026-07-18T05:45:47.890Z
- Model: deepseek-v4-flash
- Catalog: 476
- Reviewed: 476
- Confirmed (advisory): 228
- Correction candidates: 205
- Requires review: 13
- Insufficient evidence: 30
- Failed batches: 0

> DeepSeek output is advisory. No canonical entity, company-product relation, or public index was changed.

## Flagged items

### Anthropic (EN-c70eca6b0f88f44d)

- Decision: insufficient_evidence
- Current type / company: company / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有关联的声明ID均未在提供的证据列表中找到，无法验证任何关系或实体属性。

### Apptio (EN-0d014547a90d8fea)

- Decision: requires_review
- Current type / company: company / -
- Proposed: Apptio / company / -
- Issues: evidence
- Confidence: 0.3
- Claims: CL-2d2c3a58146b870c
- Rationale: 条目类型为company，但唯一提及Apptio的Claim仅称其为“Apptio co-founders”，未明确说明Apptio本身是公司、产品或其他实体。缺乏直接支持Apptio作为组织运营、开发或拥有的证据，无法确认其公司身份。

### LM Studio (EN-7df09a7717ef2feb)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: LM Studio / product / -
- Issues: type
- Confidence: 0.85
- Claims: CL-f8f0a879e968d315, CL-69587155c2ed4e51, CL-9cd679381f7dec6f, CL-d6839b8f0cc3549d, CL-d834d32776bdd624, CL-cb16a92c37d3862b, CL-e33e52acd478fb53, CL-f66b93f950efa308, CL-46fb3d5ad9508a38, CL-727fd142f1eda91e
- Rationale: 证据中LM Studio被描述为“本地AI模型运行平台”、“发布公告推出LM Studio Bionic”，表明它是一个产品/平台，而非公司。没有证据显示LM Studio作为公司发布其他产品。建议类型改为product。

### LMSYS (EN-636fa9664f878a4d)

- Decision: insufficient_evidence
- Current type / company: company / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据中LMSYS均作为团队或组织名称出现，与SGLang团队合作进行推理优化，没有明确声明其为公司或发布产品。无法确认其类型。

### SGLang (EN-6c87e5496f592f3c)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: SGLang / product / -
- Issues: type
- Confidence: 0.85
- Claims: CL-28348c4fe65170b5, CL-fe19ca104837cb24, CL-5f21324ca48bdbb5, CL-9565270c2ee6db60
- Rationale: 证据中SGLang被描述为推理引擎/框架，用于服务模型，属于产品而非公司。当前类型为company，应改为product。

### Soofi (EN-27aaa410b20647e0)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Soofi S / product / -
- Issues: name, type
- Confidence: 0.9
- Claims: CL-8ed5aa6af8a49598, CL-ba6eead5959435a3, CL-f37ab989d912208b, CL-e21b356d0af89aa5
- Rationale: 证据中Soofi S是一个开源语言模型，属于产品。当前名称Soofi可能指模型系列，但规范名称应为Soofi S；类型应为product。

### Soul (EN-ae0facccf0a3723a)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Soul / company / -
- Issues: -
- Confidence: 0.9
- Claims: CL-3a7c8985cbe0b56b, CL-d429e1c09b341b1a, CL-dee4845ec1b8b8ca, CL-f50f6b1a06e0e05d
- Rationale: 证据中Soul被描述为“交友应用”，即社交平台/产品，但当前类型为company。需确认Soul是否为运营该应用的公司实体，证据不足，建议审查。

### 5K2K OLED (EN-ebf795c7403ad5b4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 5K2K OLED / product / LG
- Issues: company
- Confidence: 0.85
- Claims: CL-4cc90af48d883858, CL-6f3976278db158ba, CL-fd07c59fb8523541
- Rationale: 证据明确显示LG发布了该显示器产品，但当前公司字段为空，应补充LG为公司。

### 国内首个全周期高考志愿填报 (EN-3c2a3673eabc9a46)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 国内首个全周期高考志愿填报 / product / 阿里巴巴
- Issues: company
- Confidence: 0.85
- Claims: CL-6d08d5517a55c877, CL-82f9a33c6e075b9f, CL-9139659758440553
- Rationale: 证据显示阿里巴巴千问上线了该Agent产品，但当前公司字段为空，应补充阿里巴巴为公司。

### 妈祖 (EN-d90a8e9b152bf236)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 妈祖 / product / 中国气象局
- Issues: company
- Confidence: 0.85
- Claims: CL-491ba3ef5ab3104f, CL-68dc6574de1b85ac, CL-85c16d8f334f5f10
- Rationale: 证据显示中国气象局发布了该AI工具箱产品，但当前公司字段为空，应补充中国气象局为公司。

### 全球首款动态数据流 AI 芯片 (EN-e9830c30bc572802)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 全球首款动态数据流 AI 芯片 / product / 理想汽车
- Issues: company
- Confidence: 0.85
- Claims: CL-b676343f7dedcf37, CL-ca044777717424e5, CL-686e36f03a60435e, CL-747739bb5e2ca184
- Rationale: 证据显示理想汽车发布了该芯片产品，但当前公司字段为空，应补充理想汽车为公司。

### 天枢领航 (EN-24dcf762a3ebce39)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 天枢领航 / product / 长安汽车
- Issues: company
- Confidence: 0.85
- Claims: CL-0716bbba0dbedec3, CL-42f70ec26cd5d0d9, CL-c8f8abeb7dd35e7e, CL-d163dfdeaf1347ee
- Rationale: 证据显示长安汽车发布了该辅助驾驶系统产品，但当前公司字段为空，应补充长安汽车为公司。

### 运通工程师信用卡 (EN-a4eee620f5a081bd)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 运通工程师信用卡 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0055eba8920e653f
- Rationale: 证据显示招商银行推出该信用卡，但无明确声明招商银行拥有或运营该产品，且当前公司名为空，故保留产品类型，公司字段需审查。

### 总体体验：在智能体 AI 时代重新定义卓越 (EN-ef6aa1a04b3f52ab)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 总体体验：在智能体 AI 时代重新定义卓越 / other / -
- Issues: type
- Confidence: 0.95
- Claims: CL-889b87399f297138
- Rationale: 证据表明该名称为毕马威发布的报告标题，非产品、公司或人物，应归类为其他（报告/文章）。

### A2P2 (EN-6c959f6391a7ce86)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: A2P2 / product / 京东
- Issues: company
- Confidence: 0.95
- Claims: CL-0288789d9a06dbc1
- Rationale: 证据显示京东发布A2P2协议，明确京东为发布方，应添加京东为公司名。

### ACE (EN-285c8f76de6c6c97)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE / product / 英特尔, AMD
- Issues: company
- Confidence: 0.9
- Claims: CL-575c04e2b07891de, CL-a2375b5fa313c2b6, CL-e81385ade6248b7b
- Rationale: 证据显示英特尔与AMD联合发布ACE规范，但未明确单一公司拥有，建议添加英特尔和AMD为公司名。

### ACE 1.15 (EN-252da501233d3c2d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE 1.15 / product / 英特尔, AMD
- Issues: company, duplicate
- Confidence: 0.9
- Claims: CL-03a4844da011f8bc, CL-575c04e2b07891de, CL-a2375b5fa313c2b6, CL-e81385ade6248b7b
- Rationale: 证据与ACE条目相同，均为同一规范版本，建议合并或标记重复，并添加英特尔和AMD为公司名。

### Across Any Cloud (EN-3137a20f5252af53)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Across Any Cloud / product / Thoughtworks
- Issues: company
- Confidence: 0.95
- Claims: CL-417f3430556889ce, CL-4ec2992a62659404
- Rationale: 证据显示Thoughtworks推出Agent/works平台，可跨任意云运行，但Across Any Cloud为描述性短语，非产品名；建议修正为Agent/works并添加Thoughtworks为公司名。

### ADK Go 2.0 (EN-9ec037a4f41bae8f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ADK Go 2.0 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-905fa90e14050d1e, CL-dfd488a73661be1a
- Rationale: 证据明确显示ADK Go 2.0是一个产品发布，但未提供所属公司信息，当前公司列表为空，保留原状。

### Agent Bucket (EN-7ff4fb5ddc1f4700)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Bucket / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-dd73ae1ae16c53d1, CL-e3e97c87921ce32d, CL-6089f3684eed36c3, CL-c0a8fc99b3e37a9c
- Rationale: 证据明确显示腾讯云发布了Agent Bucket，但当前公司列表为空，需补充公司信息。

### Agent Marketplace (EN-dba61afed18c85d6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Marketplace / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-47e8000d9e590827, CL-4f806bffe6a5ad2e, CL-786d5f23a31b595e, CL-7f695a95cdc30ef6
- Rationale: 证据显示AWS发布了Agent Marketplace，但当前公司列表为空，需补充公司信息。

### Agent Report (EN-a6f7e7d15269ba2d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据均关于Entire公司和其CLI工具，未提及名为'Agent Report'的产品，无法确认该产品存在或归属。

### Agentic AI (EN-ffc6caa049c23d48)

- Decision: insufficient_evidence
- Current type / company: product / Google
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据描述的是家得宝与谷歌云合作推出的代理式AI工具，并非谷歌单独发布的名为'Agentic AI'的产品，无法确认该产品归属谷歌。

### Agentic AI Goes Mainstream (EN-22d9e9f0b17223fe)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agentic AI Goes Mainstream / other / -
- Issues: type
- Confidence: 0.85
- Claims: CL-01c9133e30ad8243, CL-08f80b7f78f717d9, CL-3c10e430f763099b, CL-e1a41c8ba90b1962
- Rationale: 证据显示这是一个研究报告标题，而非产品，应归类为'other'（文章/报告）。

### Agently Mail (EN-30a63b26b06e096e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agently Mail / product / 腾讯
- Issues: company
- Confidence: 0.9
- Claims: CL-3a5697d62cea7b5e, CL-380ea0da32168193, CL-acbba404b4cb7f94
- Rationale: Claim显示QQ邮箱（腾讯旗下）推出Agently Mail，但当前公司列表为空，应补充腾讯。

### AI 志愿助手 (EN-87591eb8ddaae303)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI 志愿助手 / product / vivo
- Issues: company
- Confidence: 0.9
- Claims: CL-30e781cd79058e3e, CL-ee93482e6fc8b526, CL-f458ddd8280f974d
- Rationale: Claim显示vivo上线“AI 志愿助手”功能，但当前公司列表为空，应补充vivo。

### AI Adoption (EN-d7acd28717af7078)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: Claim中“AI Adoption”仅为描述性短语，非产品名称，无证据表明其为独立产品。

### AI Agent Directory (EN-ddc6bcfaf931295c)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: Claim描述的是GitHub上的开源目录，非特定产品，无公司发布或拥有证据。

### AI Agent Framework (EN-23fa906ab8df13d6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: Claim提及VoltAgent框架，但无明确公司发布或拥有该框架的证据。

### AI Agent Marketplace (EN-761a66c29a55bc53)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agent Marketplace / product / AWS
- Issues: company
- Confidence: 0.9
- Claims: CL-5225b764ba1d9728, CL-fd24eb544cd9b969, CL-2398193d0594d6e3, CL-7bf5f7c534363577
- Rationale: 多个Claim显示AWS推出AI Agent Marketplace，但当前公司列表为空，应补充AWS。

### AI Agents Across Any (EN-1b0a2528912919f4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent/works™ / product / Thoughtworks
- Issues: name, company
- Confidence: 0.95
- Claims: CL-417f3430556889ce, CL-4ec2992a62659404
- Rationale: 证据明确显示Thoughtworks发布了名为Agent/works™的平台，当前名称'AI Agents Across Any'是引用的片段而非产品名，且缺少所属公司。

### AI Agents Are (EN-19018cddd8946526)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Vertical AI Agents Are Eating Horizontal SaaS: Inside the 2026 Specialization Boom / other / -
- Issues: name, type, evidence
- Confidence: 0.9
- Claims: CL-7b5285fbd5416bdf
- Rationale: 当前名称'AI Agents Are'是文章标题片段，证据显示这是一篇报道的标题而非产品，应归类为other。

### AI Agents Are Eating (EN-fef851474e3c4311)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Vertical AI Agents Are Eating Horizontal SaaS: Inside the 2026 Specialization Boom / other / -
- Issues: name, type, evidence
- Confidence: 0.9
- Claims: CL-7b5285fbd5416bdf
- Rationale: 当前名称'AI Agents Are Eating'是同一文章标题的另一个片段，证据不支持其为产品，应归类为other。

### AI Agents On Partner (EN-5ab8fde232c3c298)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agents On Partner Central / product / AWS
- Issues: name, company
- Confidence: 0.95
- Claims: CL-ea4ce0d501f5281e, CL-1c574a247ac0f458
- Rationale: 证据显示AWS在Partner Central中推出了AI代理功能，当前名称'AI Agents On Partner'不完整，且缺少所属公司AWS。

### AI Cloud Launches (EN-64d17ceed397dfde)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DataRobot AI Cloud / product / DataRobot
- Issues: name, company
- Confidence: 0.95
- Claims: CL-57ed0bec96d075d4, CL-3ce00d540bcdd10e
- Rationale: 证据明确显示DataRobot发布了'DataRobot AI Cloud'产品，当前名称'AI Cloud Launches'是动词短语，且缺少所属公司DataRobot。

### AI generator (EN-de1afc61dd4d2cea)

- Decision: correction_candidate
- Current type / company: product / Meta
- Proposed: Muse Image / product / Meta
- Issues: name
- Confidence: 0.95
- Claims: CL-78c0f35e75695674, CL-fd58cc445b0a0bcf
- Rationale: 证据显示Meta发布的是名为'Muse Image'的AI图像生成器，当前名称'AI generator'是通用描述而非具体产品名，所属公司Meta正确。

### AI Goes Mainstream (EN-a52f1da2224ffd03)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agentic AI Goes Mainstream in the Enterprise, but 94% Raise Concern About Sprawl, OutSystems Research Finds / other / -
- Issues: name, type, evidence
- Confidence: 0.9
- Claims: CL-01c9133e30ad8243
- Rationale: 当前名称'AI Goes Mainstream'是研究报告标题片段，证据显示这是一份OutSystems的研究报告而非产品，应归类为other。

### AI Inference (EN-ae11c0abf6288776)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 无任何Claim明确声明“AI Inference”是一个产品，也未指明其开发者或所有者。所有Claim仅描述Neysa与Pipeshift的合作服务，无法确认该名称对应一个独立产品实体。

### AI INTERCONNECT PLATFORM WITH (EN-9cc48d787f521562)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Interconnect Platform / product / Chelsio Communications
- Issues: name, company
- Confidence: 0.9
- Claims: CL-acb61a846e6acac5
- Rationale: Claim CL-acb61a846e6acac5明确Chelsio Communications发布“seventh-generation AI Interconnect Platform”，且名称中“WITH”为多余片段。证据支持产品名称为“AI Interconnect Platform”，公司为Chelsio Communications。

### AI MAX PRO 400 (EN-8b0a3af52a26dde3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Ryzen AI MAX PRO 400 / product / AMD
- Issues: name, company
- Confidence: 0.95
- Claims: CL-0a453ae27b7c1567, CL-7d48a848272f329d
- Rationale: Claim CL-0a453ae27b7c1567和CL-7d48a848272f329d明确AMD发布“Ryzen AI MAX PRO 400”系列处理器，当前名称缺少“Ryzen”前缀。证据支持产品全称及公司归属。

### AI Pro AI (EN-16afaf30cb520fb4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ER939-AI Pro / product / MINIX
- Issues: name, company
- Confidence: 0.95
- Claims: CL-1619d19bfb89e437, CL-2dfe2a5e12ed9d33
- Rationale: Claim CL-1619d19bfb89e437和CL-2dfe2a5e12ed9d33明确MINIX推出“ER939-AI Pro”迷你主机，当前名称“AI Pro AI”为错误片段。证据支持正确产品名和公司。

### AI Safely (EN-a39230f0613145dc)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Sovereign Agentic Studios / product / Atos Group
- Issues: name, company
- Confidence: 0.9
- Claims: CL-6bf69c861c4360ff, CL-e9e6292cdd44d70e
- Rationale: Claim CL-6bf69c861c4360ff和CL-e9e6292cdd44d70e明确Atos Group发布“Sovereign Agentic Studios”，当前名称“AI Safely”为标题中误读的片段。证据支持正确产品名和公司。

### AI Silicon (EN-74beb25bdfe7bdd1)

- Decision: correction_candidate
- Current type / company: product / TYLsemi
- Proposed: Full-Stack Chiplet Platform / product / TYLsemi
- Issues: name
- Confidence: 0.85
- Claims: CL-bb89b2f344ac2037, CL-8b941b4cf3279dc5
- Rationale: Claim CL-bb89b2f344ac2037和CL-8b941b4cf3279dc5明确TYLsemi推出“Full-Stack Chiplet Platform”，当前名称“AI Silicon”过于泛化且未在证据中出现。证据支持更准确的产品名称，公司信息正确。

### AI Trust Platform Built (EN-8487426ba81162db)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Trust Platform / product / OpenBox AI
- Issues: name, company
- Confidence: 0.9
- Claims: CL-3265eaa722ce0cd3, CL-4025bb89e730bc8a, CL-5c9136b4d8345f5e, CL-a71d32f1e3db1e97
- Rationale: 证据显示OpenBox AI发布了“AI Trust Platform”，当前名称末尾多余“Built”一词，且缺少所属公司。

### AI visual search (EN-d692adb22248825f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Design Stream / product / MattoBoard
- Issues: name, company
- Confidence: 0.85
- Claims: CL-42cf14cef9e10d2a, CL-25bcdd5994eed390, CL-5859ce277c3fe2cf
- Rationale: 证据表明MattoBoard推出的AI视觉搜索功能名为“Design Stream”，当前名称“AI visual search”是通用描述而非产品名，且缺少所属公司。

### AI workbench (EN-91410aa2c40210be)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: OpenScience / product / Synthetic Sciences
- Issues: name, company
- Confidence: 0.95
- Claims: CL-915aaf68c542c36e, CL-ab22ef0a3fa94c62, CL-2bb4cebdfb94dae4
- Rationale: 证据明确Synthetic Sciences发布了名为“OpenScience”的AI工作台，当前名称“AI workbench”是通用类别，且缺少所属公司。

### AI Workforce (EN-6d51d80daa73eb4a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Workforce / product / Atomicwork
- Issues: company
- Confidence: 0.9
- Claims: CL-55d4c2c5a74b2a19, CL-62501b66860c9002
- Rationale: 证据显示Atomicwork推出了“AI Workforce”平台，当前名称正确但缺少所属公司Atomicwork。

### AI-eSIM (EN-94b6413ed53a1867)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-eSIM / product / 中国移动
- Issues: company
- Confidence: 0.8
- Claims: CL-e437c38eff52ae67
- Rationale: 证据提到中国移动发起AI-eSIM产业协同平台，但未明确中国移动是开发者或所有者，仅作为发起方，需进一步确认所有权。

### AI-Native Cloud Built (EN-3c827e340320d4cb)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-Native Cloud / product / DigitalOcean
- Issues: name, company
- Confidence: 0.95
- Claims: CL-452cd72b30375988, CL-0bf122b32e29ddd6, CL-79b197557a56ecbe
- Rationale: 证据明确DigitalOcean发布了“AI-Native Cloud”，当前名称末尾多余“Built”一词，且缺少所属公司。

### AI-Native Cloud Built for (EN-34e408ff65178379)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-Native Cloud / product / DigitalOcean
- Issues: name, duplicate
- Confidence: 0.95
- Claims: CL-452cd72b30375988, CL-0bf122b32e29ddd6, CL-79b197557a56ecbe
- Rationale: 与EN-3c827e340320d4cb证据相同，DigitalOcean发布的是“AI-Native Cloud”，当前名称末尾多余“Built for”，且疑似重复条目。

### AI内容标注行为守则 (EN-5dcd7df1a5bf068f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI内容标注行为守则 / product / 欧盟委员会
- Issues: company
- Confidence: 0.95
- Claims: CL-0048ea0ed4a5e659, CL-1382a007ab508203
- Rationale: 证据显示欧盟委员会发布了该行为守则，属于产品发布，应归属欧盟委员会。

### Air 3 (EN-14754db7f1439c88)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Air 3 / product / 科大讯飞
- Issues: company
- Confidence: 0.95
- Claims: CL-092fa3ba898c9332, CL-122d5452e326e7e0, CL-a46da6f2ae0481e9
- Rationale: 证据明确显示科大讯飞发布了Air 3系列产品，应归属科大讯飞。

### Akrites (EN-88a9157d1b3e66ae)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Akrites / product / Linux基金会
- Issues: company
- Confidence: 0.95
- Claims: CL-02ff9cbe615696e5, CL-3497137323547849, CL-c77cb7816ce8025c
- Rationale: 证据显示Linux基金会联合多方推出了Akrites项目，应归属Linux基金会。

### Android 17 (EN-e0bab6f6c58bfe4e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Android 17 / product / 谷歌
- Issues: company
- Confidence: 0.95
- Claims: CL-2d3d4cf25f483fee, CL-9ca1813b0e901145, CL-524ffc470ce7246d
- Rationale: 证据显示谷歌推送了Android 17正式版，应归属谷歌。

### Artemis (EN-2f00e6c060e01051)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Artemis / product / Kore.ai
- Issues: company
- Confidence: 0.95
- Claims: CL-7f46f6606ae2343d, CL-aa3414767466f37f, CL-e1505fc42fbdf511
- Rationale: 证据显示Kore.ai推出了Artemis平台，应归属Kore.ai。

### Asian AI (EN-b50e6e7659f1018e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中'Asian AI'并非具体产品名称，而是泛指亚洲AI初创公司，无明确产品实体，无法确认归属。

### ASRock Claw Quickset (EN-aa70ef0a3cae0638)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ASRock Claw Quickset / product / 华擎
- Issues: company
- Confidence: 0.95
- Claims: CL-767c6e27f18d910a, CL-97c9b12f91823925, CL-a6b0029076353c91
- Rationale: 证据显示华擎推出了该桌面工具，应归属华擎。

### ASRs. Our main finding is (EN-96ec1b8a414d3a4e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / other / -
- Issues: name, type
- Confidence: 0.95
- Claims: CL-82f00a90d2b461ee
- Rationale: 名称“ASRs. Our main finding is”明显是文章片段，非产品实体。证据中提及ASR系统，但该名称本身是句子片段，应归类为other。

### AstraBrain-WBC 0.5 (EN-0d049cd1e9f619f9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AstraBrain-WBC 0.5 / product / 银河通用
- Issues: company
- Confidence: 0.95
- Claims: CL-2d9c0183892f925c, CL-3166c56a9815c0ee, CL-8a246deb4a52a8fa, CL-b9e882ebf1259292
- Rationale: 证据明确显示“银河通用发布AstraBrain-WBC 0.5”，表明该产品由银河通用发布，应补充公司名称。

### Auto-review (EN-b7efc8f24f2e2358)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Auto-review / product / Cursor
- Issues: company
- Confidence: 0.95
- Claims: CL-27edd7de05c58272, CL-421f045aefa19028
- Rationale: 证据显示Cursor推出Auto-review，当前公司名称为空，应补充为Cursor。

### autoMode.classifyAllShell setting (EN-4f237537da9719b4)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: autoMode.classifyAllShell setting / product / Anthropic
- Issues: name
- Confidence: 0.9
- Claims: CL-328a54cce2445303
- Rationale: 名称包含“setting”，表明这是一个配置项而非独立产品。但当前类型为product，证据中作为Claude Code的功能发布，建议保留为product但名称需确认。

### Autonomous Service Workforce (EN-33a6331aaa822714)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Service Workforce / product / Zendesk
- Issues: company
- Confidence: 0.95
- Claims: CL-063e57d74686a010
- Rationale: 证据显示Zendesk推出Autonomous Service Workforce愿景，当前公司名称为空，应补充为Zendesk。

### Autonomous Worker Agents for (EN-a9f74d68b2b7c964)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Worker Agents for / product / Harness
- Issues: name, company
- Confidence: 0.95
- Claims: CL-8d7813f50efd79be
- Rationale: 名称末尾“for”不完整，应为“Autonomous Worker Agents for software delivery”。证据显示Harness发布该产品，应补充公司名称。

### AutoPilot (EN-c141d2237427f30d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AutoPilot / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-f4fdde2db1597bc8
- Rationale: 证据显示微软计划推出AutoPilot智能体，当前公司名称为空，应补充为Microsoft。

### Bessemer Venture Partners (EN-ea49a9968098499a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Bessemer Venture Partners / company / -
- Issues: type
- Confidence: 0.9
- Claims: CL-1a75e660b1619120, CL-2e8c4be90cea0b95, CL-3a17065b54bb8b28, CL-e33131a5f8688baf
- Rationale: 证据中Bessemer Venture Partners是文章标题的一部分，内容为投资机构发布的设计合作伙伴相关文章，无任何产品发布或开发声明。名称本身是风险投资公司，应归类为company而非product。

### Blog (EN-fbe26af59be95e52)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AWS Open Source Blog / other / -
- Issues: name, type
- Confidence: 0.85
- Claims: CL-dd5677fa70729195, CL-18c1591b318afa02, CL-2531624d4f97a0e7, CL-35f41b48f35dce60
- Rationale: 证据中'Blog'是文章来源标识（AWS Open Source Blog），并非产品、公司或人物。应归类为other，名称建议修正为'AWS Open Source Blog'。

### BrainCo (EN-dbd6a2f6ddb95ca7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: BrainCo 强脑科技 / company / -
- Issues: type, name
- Confidence: 0.9
- Claims: CL-bfecc3a277fd0cfe, CL-ad93f247e085f6bf, CL-bcd6954696dde333, CL-ccc2d870b38266c7
- Rationale: 证据中'BrainCo 强脑科技'作为主体发布产品，是组织而非产品。当前列为产品且无公司归属，应更正为公司类型，名称建议为'BrainCo 强脑科技'。

### Build 2026 (EN-cf49fab26fe3c4a1)

- Decision: correction_candidate
- Current type / company: product / Microsoft
- Proposed: Microsoft Build 2026 / other / -
- Issues: type, name
- Confidence: 0.85
- Claims: CL-96d300f8929429c2, CL-dfc4f8144dfc84c7, CL-82a3e6ecba6d8daf, CL-5bab2d1e336e2e2c
- Rationale: 证据中'Build 2026'是微软开发者大会，属于活动/事件，非产品。当前列为产品且公司为Microsoft，应更正为other类型，名称建议为'Microsoft Build 2026'。

### Canaries Dashboard (EN-a48d2a42132217d6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Canaries Dashboard / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-bbfbda35db3ee3c5
- Rationale: 证据显示ADP与斯坦福联合推出了Canaries Dashboard，属于产品。但未提供明确证据证明ADP或斯坦福单独拥有该产品，当前公司为空，需进一步确认归属。

### Capabilities for Production (EN-b937d305ea1f064f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Capabilities for Production / other / -
- Issues: type
- Confidence: 0.8
- Claims: CL-5136009817417e5e, CL-15727e9bf33985fa, CL-26c18169ae8fea67, CL-cd1bb6a16dd0b1ea
- Rationale: 证据中'Capabilities for Production'是DigitalOcean推理引擎的一组新功能描述，并非独立产品名称，更像是特性集合。当前列为产品，建议更正为other。

### Central To Simplify Funding (EN-5f863a922cd1bc75)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agents On Partner Central / product / AWS
- Issues: name, company
- Confidence: 0.9
- Claims: CL-ea4ce0d501f5281e, CL-1c574a247ac0f458
- Rationale: 证据显示AWS发布了名为'AI Agents On Partner Central'的产品，用于简化资金和联合销售。当前名称'Central To Simplify Funding'是描述性短语而非产品名，且缺少所属公司。

### CEO Thomas Dohmke (EN-45cbca5f78f1ef44)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Thomas Dohmke / person / -
- Issues: name, type
- Confidence: 0.95
- Claims: CL-7f1ee7bec414a00d, CL-b967f75e7c42d240
- Rationale: 证据明确提到'Ex-GitHub CEO Thomas Dohmke'，表明这是一个自然人，而非产品。当前条目错误地将人名列为产品名。

### Chinese AI (EN-cf5378a2305a999f)

- Decision: correction_candidate
- Current type / company: product / MiniMax
- Proposed: MiniMax 2.7 Trillion Parameter Model / product / MiniMax
- Issues: name
- Confidence: 0.85
- Claims: CL-5b1c1ec9e1d977ba, CL-837ef054f32e38ca, CL-bdf2be420c647faa, CL-c7052e949737c57a
- Rationale: 证据描述的是MiniMax计划开源的一个2.7万亿参数模型，而非名为'Chinese AI'的产品。当前名称过于泛化，建议改为具体模型名称。

### Chrome (EN-e1a4e41919f7c2dc)

- Decision: correction_candidate
- Current type / company: product / Microsoft
- Proposed: Chrome / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-70922a7ba521886f, CL-0b370d47531a1859
- Rationale: 证据提到Chrome是谷歌浏览器，微软为其发布扩展。当前所属公司列为微软，但Chrome本身由谷歌开发，证据未显示微软拥有Chrome。

### Claude Fable 5 and Mythos 5 (EN-540dfc8c5e1b1136)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Claude Fable 5 and Mythos 5 / product / Anthropic
- Issues: name
- Confidence: 0.7
- Claims: CL-022ff08fc8204a5e, CL-0f37c2091158dc07, CL-4b1710f3a8a8d8f2, CL-ed2867d0b13b7090
- Rationale: 名称包含两个产品（Fable 5和Mythos 5），可能应拆分为独立条目，但当前证据支持Anthropic发布，类型和公司正确，名称需审查。

### Claude Mythos (EN-b8c236d640d6a5fb)

- Decision: correction_candidate
- Current type / company: product / OpenAI, Anthropic
- Proposed: Claude Mythos / product / Anthropic
- Issues: company
- Confidence: 0.9
- Claims: CL-6efbc9da742294ac, CL-36ad8dab40651f22, CL-4ff7bb9716ade0f4, CL-6f8b56682d62571e
- Rationale: Claim明确Anthropic发布Claude Mythos模型，属于Anthropic产品。当前记录错误地将OpenAI列为公司，但无Claim证明OpenAI拥有或发布该产品。OpenAI仅作为竞争对手提及，不构成所有权。

### ClaudeFable 5 (EN-08013bb0b80d23f7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ClaudeFable 5 / product / Anthropic
- Issues: company
- Confidence: 0.95
- Claims: CL-2665cddb1fb8782d, CL-65dfe7a9e21cf457, CL-8682265b6de10912, CL-87428a4d4c2b2daf
- Rationale: 当前记录中 current_company_names 为空。多条 Claim 明确显示 Anthropic 推出了 ClaudeFable 5，并称其为该公司模型，因此应补充公司名称为 Anthropic。

### Clive Chan (EN-da20c5952dba19d8)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: Clive Chan / person / -
- Issues: name, type, company
- Confidence: 0.95
- Claims: CL-3d14375d56b4f1cb, CL-751e56462533bd02, CL-8d37b1ffa4580b30, CL-dc1d0b96c708ffb9
- Rationale: 所有证据均称Clive Chan为OpenAI芯片团队元老，描述其个人离职跳槽，而非产品发布。名称是个人姓名，应归类为person，非product。

### Cloud (EN-8d323d8bba783aa3)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: Google Cloud / product / Google
- Issues: name
- Confidence: 0.9
- Claims: CL-1cc211dda48a2df5, CL-a474abd4f4f26091, CL-349612643de6fc05, CL-4f231c50ce2a04bc, CL-c83d337cfa0736fd, CL-ca554276228d639a, CL-dca0f01153b681c9, CL-191ed56085648a37
- Rationale: 证据中产品名称为'Google Cloud'而非'Cloud'，且所有引用均指向Google Cloud发布芯片、OKF等。当前名称'Cloud'不完整，建议修正为'Google Cloud'。

### Cloud Marketplace (EN-2aae0de3f5530f08)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Google Cloud Marketplace / product / Google
- Issues: company
- Confidence: 0.85
- Claims: CL-3ce00d540bcdd10e, CL-57ed0bec96d075d4, CL-b84ce1a03fcf6751, CL-eec2d7118595677e
- Rationale: 证据显示DataRobot AI Cloud在Google Cloud Marketplace上线，表明该平台由Google运营。当前company_names为空，应补充为Google。

### Code (EN-7ec0224e483d913b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Claude Code / product / Anthropic
- Issues: name, company
- Confidence: 0.9
- Claims: CL-deecb393c84fdad3, CL-f7f9a46e7662739e, CL-09da470a73f9efc5, CL-c6c460440f11105c
- Rationale: 所有证据均提及'Claude Code'为Anthropic的产品，当前名称'Code'不完整且company为空。应修正为'Claude Code'并归属Anthropic。

### Codex (EN-1ecf93c539fcffca)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Codex / product / OpenAI
- Issues: company
- Confidence: 0.9
- Claims: CL-1de92b0a01512ccd, CL-250f0a59736ec262, CL-813eaeb274f4ef39, CL-f3b4491e25ca7ec2
- Rationale: 证据显示OpenAI扩展Codex使用场景，明确Codex为OpenAI产品。当前company_names为空，应补充为OpenAI。

### ColorOS 16 (EN-c38c7d20347bd908)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ColorOS 16 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-283a5aa2f1f1aab3, CL-ae48434223721c51, CL-da4f064dea42dff9, CL-103f81e6a01ea069
- Rationale: 名称ColorOS 16是产品，证据显示OPPO发布更新，但无明确声明OPPO拥有或开发该产品，公司字段为空，保留现状。

### Compact (EN-9dde0c2d375060f6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 名称Compact是通用描述词，证据中Supermicro发布的是紧凑型系统系列而非名为Compact的单一产品，无明确产品名称对应，无法确认。

### Company Announcement (EN-1943e48082f97bd6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / other / -
- Issues: name, type
- Confidence: 0.8
- Claims: CL-05555dd2e0168af7, CL-0e9ab37b8f9e6388, CL-492ec8ee5501b3e4, CL-4b128a844b41c0df
- Rationale: 名称Company Announcement是文章片段或新闻稿标题，非产品实体，证据为IBM研究报告，应归类为other。

### Composer 2.5 (EN-ba1269449ab76537)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Composer 2.5 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-02ec1f669993f2f4, CL-1cefd5ca06db9785, CL-9a143b175e97cc12, CL-ac46a13e315b8680
- Rationale: Composer 2.5是AI编码模型产品，证据显示Cursor发布该模型，但无明确声明Cursor拥有或开发，公司字段为空，保留现状。

### Connect AI Developer Edition (EN-a250ebc1862540b0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Connect AI Developer Edition / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-259b0862836da331, CL-df197344e8d4a1cf, CL-5d5b2ddeffe666f7, CL-fa4724cc69359d98
- Rationale: Connect AI Developer Edition是产品，证据显示CData发布该产品，但无明确所有权声明，公司字段为空，保留现状。

### Continuum (EN-02bb4eeba3bde980)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Continuum / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0cc7e31523493be6, CL-24c0c5e4ec909641, CL-a5a3a28dc159637e
- Rationale: Continuum是AWS推出的新服务产品，证据显示AWS发布该服务，但无明确所有权声明，公司字段为空，保留现状。

### Control Plane (EN-049e948563e03e97)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 名称Control Plane是通用术语，证据中Upbound发布的是Modelplane而非Control Plane，无任何Claim提及Control Plane作为产品名称，无法确认。

### CoreAI (EN-dd920a8cd166f486)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: CoreAI / product / Apple
- Issues: company
- Confidence: 0.9
- Claims: CL-18d554f72c3e47aa, CL-c219014c38d3e963
- Rationale: 证据显示苹果推出CoreAI引擎，但当前公司列表为空，应补充苹果为开发公司。

### Cowork on Monday (EN-a18162bf7228289d)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Cowork / product / Anthropic
- Issues: name
- Confidence: 0.85
- Claims: CL-df0a3aadcfe5c2a3
- Rationale: 证据中产品名称为Cowork，而非Cowork on Monday，后者可能是误将发布时间纳入名称。

### Creator Studio (EN-05644efc4f4a9f67)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Creator Studio / product / Meta
- Issues: company
- Confidence: 0.9
- Claims: CL-2204de91346ffc61, CL-31af81a492f0ce43
- Rationale: 证据显示Facebook（Meta旗下）推出Creator Studio应用，当前公司列表为空，应补充Meta。

### DeepMind (EN-4d09c69c19f5f67b)

- Decision: correction_candidate
- Current type / company: product / Google DeepMind
- Proposed: DeepMind / company / -
- Issues: type
- Confidence: 0.8
- Claims: CL-0e3152343b11ebca, CL-73c5596c4635da55, CL-bde1074da1e7f759, CL-d04784c9de8d1429, CL-035fba984bda80eb, CL-1030b31c165540d3, CL-3ca47c32c729c6e8, CL-4cf8bbb7f166e862, CL-66d9fb66d9687af6, CL-917ac73263ec2d6c
- Rationale: 证据中Google DeepMind作为发布主体出现，是组织而非产品，当前类型为产品有误。

### DeepSeek-V3.2 (EN-a8109a87003a555b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DeepSeek-V3.2 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-5a081faed20b82a3, CL-b7c9aaf6b3960b34, CL-e81a5774adbdcf76, CL-fe5e22c0917dba98
- Rationale: 证据显示该模型由腾讯云提供接入服务，但未明确声明腾讯云是开发者或所有者，仅提及服务变更和迁移。当前公司字段为空，证据不足以确认归属，需进一步审查。

### DeepSeek-V4 (EN-9fd74b87b71e744a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DeepSeek-V4 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-0c746843d3400533, CL-957c52a5e90b0909, CL-a3b6aba8f727f6b7, CL-ecad57a9206cfcab
- Rationale: 证据提及腾讯云提供该模型并引入定价机制，但未明确腾讯云是开发者或所有者。当前公司字段为空，证据不足以确认归属，需进一步审查。

### Dev (EN-73209317ae64f32b)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中未明确提及“Dev”作为独立产品，仅作为通用术语出现在文章标题和上下文中，无法确认其作为产品实体的存在。

### Dev Tools Companies (EN-210c1cad011e5afb)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中“Dev Tools Companies”是文章中的通用描述性短语，并非具体产品名称，无法确认其为产品实体。

### DevEco Code (EN-b42e5eda1d1a3720)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DevEco Code / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-8a3a1df8c7e68443, CL-d5c691aa90e23d0e, CL-e217215d444c80bc, CL-f5bd4673a6f3ddd1
- Rationale: 证据显示华为发布了DevEco Code工具，但当前公司字段为空。证据明确支持华为为发布者，建议补充公司信息。

### Elements Claw (EN-94caa859c22071b1)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Elements Claw / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-64369a09ca7e9385, CL-ae24dc6d66a8f1d1, CL-dce7f3ddb3fd068e
- Rationale: 证据显示阿里达摩院发布了Elements Claw AI智能体，但当前公司字段为空。证据明确支持阿里达摩院为发布者，建议补充公司信息。

### Enterprise Deployment Scales (EN-ba68e0d45eda3690)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / other / -
- Issues: name, type
- Confidence: 0.85
- Claims: CL-0e9ab37b8f9e6388, CL-05555dd2e0168af7, CL-492ec8ee5501b3e4, CL-4b128a844b41c0df
- Rationale: “Enterprise Deployment Scales” 是 IBM 研究报告中的短语，非产品名称，应归类为 other。

### Enterprise IT (EN-e466d31379abfeeb)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / other / -
- Issues: name, type
- Confidence: 0.85
- Claims: CL-03d4dea4c9bf0564, CL-55d4c2c5a74b2a19, CL-62501b66860c9002, CL-af6039a445226763
- Rationale: “Enterprise IT” 是描述性短语，非具体产品名称，证据中提及的是 Atomicwork 平台，应归类为 other。

### ER939-AI Pro AI (EN-908c564e03e36ecc)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ER939-AI Pro AI / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-1619d19bfb89e437, CL-2dfe2a5e12ed9d33, CL-3f935ac7e0ad3e86, CL-f880cbd4fb11411b
- Rationale: 证据确认 ER939-AI Pro 是 MINIX 推出的硬件产品，但无证据显示其归属公司，当前公司列表为空合理。

### EVO-X3 (EN-790b8bc0b57d7a37)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: EVO-X3 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0993390da9398403, CL-a4bafacf7d7e205d, CL-9e5ec7cadaae1881, CL-5290639f977e4b33, CL-e73d6dd9fc2b7218, CL-697078b4d704b439, CL-7c4de70744b8e991, CL-a1451ccb6f9abaa4
- Rationale: 证据确认 EVO-X3 是极摩客发布的迷你主机产品，但无明确所有权声明，当前公司列表为空合理。

### F4-425 Pro (EN-ae830c95cd553df8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: F4-425 Pro / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0a4b1d772329b67a, CL-9df3af02ba89a94b, CL-d30a524bd251a144, CL-d7215b3b46b8847c
- Rationale: 证据确认 F4-425 Pro 是铁威马推出的 NAS 产品，但无明确所有权声明，当前公司列表为空合理。

### Fable (EN-34ec8666daf7b665)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Fable / product / Anthropic
- Issues: company
- Confidence: 0.85
- Claims: CL-9f1b6e3dd0c30068, CL-fe3ec3a665b7a169
- Rationale: 证据中“Anthropic Fable”表明 Fable 是 Anthropic 的模型产品，当前公司列表为空，应补充 Anthropic。

### Fable 5 (EN-9f15bb7e29e191eb)

- Decision: correction_candidate
- Current type / company: product / OpenAI, Anthropic
- Proposed: Fable 5 / product / Anthropic
- Issues: company
- Confidence: 0.95
- Claims: CL-022ff08fc8204a5e, CL-0c2d8eedf393ff6e, CL-0dfe28151e772826, CL-0eea4ecb1dde07fa, CL-0f37c2091158dc07, CL-1851a003cfc5c07a, CL-18954b77fd39ca67, CL-1e20e2fb059c6477, CL-200210cc6f668bc1, CL-232fe29cfa1f1638
- Rationale: 所有证据均表明 Fable 5 由 Anthropic 发布，当前公司列表包含 OpenAI 无证据支持，应移除 OpenAI 并保留 Anthropic。

### Fastest Growing Open Source (EN-3b8ce17ae22357b6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'Fastest Growing Open Source'是文章标题片段，非具体产品；无证据表明其为实体或归属任何公司。

### Featherless.ai (EN-ce31f92c521b7b08)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Featherless.ai / company / -
- Issues: type
- Confidence: 0.9
- Claims: CL-4a7aba5c5b345c7d, CL-4d3226bfb67eac47, CL-5e39cfad058f0146
- Rationale: 证据描述Featherless.ai为初创公司、平台运营商，有CEO和融资，应为公司而非产品。

### First Enterprise AI Trust (EN-26ea860e3f994da6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'First Enterprise AI Trust'是描述性短语，非具体产品名；证据提及OpenBox AI平台，但无直接证据表明该名称是实体或归属关系。

### First Governed AI Workforce (EN-9e51ca48d5ecf16f)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'First Governed AI Workforce'是描述性短语，非具体产品名；证据提及Atomicwork平台，但无直接证据表明该名称是实体或归属关系。

### Flexibility (EN-9f8d56e79c059f04)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LangBuilder / product / CloudGeometry
- Issues: name, company
- Confidence: 0.95
- Claims: CL-2c92678b9b52b31f, CL-352eef31fe17fd2e, CL-54873506b81edd19, CL-6847cf10caebcfd3
- Rationale: 当前名称'Flexibility'是描述性词语，非产品名。证据显示产品实际名称为'LangBuilder'，由CloudGeometry发布，应修正名称和公司。

### footerLinksRegexes setting (EN-ea4ea767088c4a22)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: footerLinksRegexes setting / product / Anthropic
- Issues: type
- Confidence: 0.9
- Claims: CL-ad6ae9f6375dd85f
- Rationale: 该条目是Claude Code的一个设置项（feature），而非独立产品。应归类为product（功能/设置），但名称和公司正确。

### Foundation (EN-41dcc2d4951f337b)

- Decision: correction_candidate
- Current type / company: product / Apple
- Proposed: Foundation Models framework / product / Apple
- Issues: name
- Confidence: 0.9
- Claims: CL-5e55b73326fc1077, CL-9b9af4ee977e02f6, CL-d39aa41668213fa3
- Rationale: 当前名称'Foundation'不完整。证据显示完整名称为'Foundation Models framework'，是Apple的框架产品，公司正确。

### FPC-9309W-G5 (EN-e3a80a99bb5fa250)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: FPC-9309W-G5 / product / -
- Issues: company
- Confidence: 0.85
- Claims: CL-7088c965de696f86, CL-7321602e8e376ee4, CL-7976fa739a9fd65e, CL-a6ac92cb46e88c76
- Rationale: 名称和类型正确，是磐仪(ARBOR)推出的边缘AI平台产品。但当前公司为空，证据显示由磐仪发布，需补充公司信息。

### Frontier in bid (EN-7bf321fa55418fba)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: Frontier / product / OpenAI
- Issues: name
- Confidence: 0.95
- Claims: CL-2826c92839743351, CL-64dccb12e1a09649, CL-d7bf7f510f350336
- Rationale: 当前名称'Frontier in bid'包含无关短语。证据显示产品名称为'Frontier'，是OpenAI的企业平台，应修正名称。

### FSD (EN-7d5f17368c04f04c)

- Decision: correction_candidate
- Current type / company: product / xAI
- Proposed: FSD / product / Tesla
- Issues: company
- Confidence: 0.8
- Claims: CL-87512dc4ff7dc7be, CL-f60f2cdb6d25ad05, CL-0febde26abbb50bd, CL-2afb32525c04ca66
- Rationale: FSD是特斯拉的全自动驾驶功能/产品，当前公司标注为xAI不正确。证据中提及特斯拉FSD与Grok集成，但无证据表明xAI拥有FSD。应改为Tesla。

### FT.com (EN-d736115a934212d4)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 当前条目'FT.com'无任何证据直接描述该产品本身。所有证据均为其他公司产品发布新闻，仅提及FT.com作为新闻来源，不构成产品证据。

### FuriosaAI-Powered AI (EN-464631bd17a23159)

- Decision: correction_candidate
- Current type / company: product / Samsung SDS
- Proposed: FuriosaAI-Powered AI Services / product / Samsung SDS
- Issues: name
- Confidence: 0.9
- Claims: CL-f4aef3f955fb2648
- Rationale: 证据中产品名称为“FuriosaAI-Powered AI Services”，当前名称“FuriosaAI-Powered AI”不完整，建议修正为完整名称。

### Fusion API (EN-779965438dd9e7a7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Fusion API / product / -
- Issues: company
- Confidence: 0.85
- Claims: CL-8baf55396569778e, CL-37bb9b7ce057bacb, CL-73f4cfe9ec18e00c, CL-ee968ec26fbadd33
- Rationale: 证据显示OpenRouter发布了Fusion API，但未提供任何公司作为发布方或所有者，当前公司列表为空，需补充公司信息。

### Gemini API (EN-a6f1623a1e5232a6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini API / product / Google DeepMind
- Issues: company
- Confidence: 0.9
- Claims: CL-21d206ae86a7b6eb, CL-3cad9a139bae62ba, CL-80619fd5e25eabb6, CL-a8b11d5a5372ff6b
- Rationale: 证据显示Google DeepMind为Gemini API添加新功能，表明Google DeepMind是发布方，当前公司列表为空，建议补充。

### Gemini Spark (EN-307557d99a7eb726)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Spark / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-b000143fed6c52d3, CL-b0dab5d514b2d3a0, CL-a06e131db75a6c1d, CL-bdd121210d6019c5
- Rationale: 证据中多次提及“谷歌”发布Gemini Spark，表明Google是发布方，当前公司列表为空，建议补充。

### GeneBench-Pro (EN-65ef4539bbcbe9fc)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: GeneBench-Pro / product / OpenAI
- Issues: company
- Confidence: 0.9
- Claims: CL-24714b5c4b56aef3, CL-632e5137598a0607, CL-90641c6556124c37, CL-ba97f0933ad78da9
- Rationale: 所有Claim均指出OpenAI推出GeneBench-Pro基准测试，属于产品（基准测试），但当前公司列表为空，应补充OpenAI。

### GenFlow (EN-33ea25778e18d372)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: GenFlow / product / 百度
- Issues: company
- Confidence: 0.85
- Claims: CL-772290ad6669ce52, CL-4220995c2d9a7652, CL-79f2d88b4a79b4af, CL-bb399a6fc1e5aef6
- Rationale: Claim显示百度文库、网盘升级GenFlow，明确提及百度，但当前公司列表为空，应添加百度。

### German AI (EN-aaf5dd513fc95bd5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: German AI consortium / company / -
- Issues: name, type, company
- Confidence: 0.85
- Claims: CL-8ed5aa6af8a49598, CL-ba6eead5959435a3, CL-e21b356d0af89aa5, CL-f37ab989d912208b
- Rationale: 所有证据均指向“German AI consortium”（德国AI联盟）是一个发布模型的研究联盟，而非产品。证据中明确提到该联盟发布了Soofi S模型，且由KI Bundesverband协调。因此当前条目“German AI”应为组织名称，而非产品。建议更正为“German AI consortium”，类型改为company。

### GLM-5.2 (EN-bc1fc5140040180e)

- Decision: correction_candidate
- Current type / company: product / SGLang
- Proposed: GLM-5.2 / product / 智谱AI
- Issues: company
- Confidence: 0.9
- Claims: CL-43fc0a73a9b8ff50, CL-dd02a198256fca4d
- Rationale: 当前公司名称为SGLang，但证据CL-43fc0a73a9b8ff50和CL-dd02a198256fca4d明确引用智谱AI（Zhipu AI）发布了GLM-5.2，表明智谱AI是发布方。SGLang仅出现在优化或服务上下文中，未证明所有权。因此建议将公司名称更正为智谱AI。

### GLM-5.2 NVFP4 (EN-64c4e740f32911e8)

- Decision: correction_candidate
- Current type / company: product / SGLang
- Proposed: GLM-5.2 NVFP4 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-28348c4fe65170b5, CL-fe19ca104837cb24, CL-5f21324ca48bdbb5, CL-9565270c2ee6db60
- Rationale: 当前记录为产品，名称和类型正确。但当前公司名称为SGLang，而所有证据均显示该产品由LMSYS与SGLang团队共同发布，且LMSYS作为主体出现在事件标题中。没有证据表明SGLang单独拥有或运营该产品。因此公司映射不准确，建议将公司名称清空或进一步调查LMSYS是否为实际运营方。

### GPT-2 (EN-f696d5fb767e377c)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 条目为产品GPT-2，但未提供任何明确声明证明其由某公司发布、开发或拥有。所有引用仅描述模型规模、训练数据及发布争议，未提及开发或运营实体。无法确认公司归属。

### GPT-5.5 (EN-62ce3c1a5a893a2c)

- Decision: requires_review
- Current type / company: product / SpaceX, Moonshot AI
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.3
- Claims: -
- Rationale: 条目为产品GPT-5.5，但当前关联公司SpaceX和Moonshot AI均无明确声明发布、开发或拥有该产品。所有证据中GPT-5.5仅作为对比对象出现（如价格比较、基准测试），未提及任何公司对其的出版或所有权。关系声明虽标注为已验证，但缺乏支持性声明内容。因此无法确认公司归属，需进一步审查。

### GPT-5.6 amid US AI regulatory drama (EN-272d6a7a0db89710)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: GPT-5.6 / product / OpenAI
- Issues: name
- Confidence: 0.95
- Claims: CL-b73a154303e7df28, CL-aa36bdc799c098b9, CL-cf8700ceac9a5e1e, CL-db27a308e99ff4c7
- Rationale: 当前名称“GPT-5.6 amid US AI regulatory drama”包含新闻标题片段，非产品标准名称。证据中明确提及“GPT-5.6”为模型套件，且OpenAI发布该产品，因此建议修正为“GPT-5.6”，类型保持产品，公司保持OpenAI。

### GPT-Bidi-1 AI (EN-f2272e70be63bc65)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: GPT-Bidi-1 / product / OpenAI
- Issues: name
- Confidence: 0.9
- Claims: CL-6d0e84f3ec701d54, CL-8487e3e6cecb0a37, CL-5c0db6d40d137cb2, CL-ba43f9bd410153ff
- Rationale: 证据中产品名称为'GPT-Bidi-1'而非'GPT-Bidi-1 AI'，后者可能是标题中的修饰，建议修正为证据中的标准名称。

### Grok (EN-1a254d17cfa54b16)

- Decision: requires_review
- Current type / company: product / xAI
- Proposed: Grok / product / xAI
- Issues: company
- Confidence: 0.6
- Claims: CL-34ad279d62cf4bdc, CL-78afe1659d3c2512, CL-1fb492b260514e14, CL-77833569bd63ddac
- Rationale: 证据中提及'SpaceXAI'而非'xAI'，且未明确说明xAI与Grok的发布关系，需进一步确认当前公司映射是否正确。

### H200 NVL (EN-a2413f7c5095f988)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据仅提及Supermicro支持NVIDIA H200 NVL平台，未提供任何明确声明证明NVIDIA开发、制造或拥有该产品，无法确认公司归属。

### Help Customers (EN-151013fb8438c046)

- Decision: insufficient_evidence
- Current type / company: product / Google
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据仅描述家得宝与谷歌云合作推出AI工具，未提供任何明确声明证明Google开发或拥有该产品，无法确认公司归属。

### Hermes (EN-0db2d631b42da133)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hermes Agent / product / Nous Research
- Issues: name, company
- Confidence: 0.85
- Claims: CL-a9e6156c1a1a2462, CL-7bac82227b837b4a
- Rationale: 证据显示Hermes Agent是Nous Research的开源个人代理，当前名称'Hermes'不完整且缺少公司归属，建议修正为完整名称并添加公司。

### Hermes Agent Profile Builder (EN-c18179b68329b054)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hermes Agent Profile Builder / product / Nous Research
- Issues: company
- Confidence: 0.85
- Claims: CL-df4e79b3ca7d8bd6
- Rationale: 证据显示Nous Research发布Hermes Agent Profile Builder，当前缺少公司归属，建议添加Nous Research为公司。

### HiCar 7.0 (EN-24381ecb01753c1b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HiCar 7.0 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-130338c5508e70c3, CL-c61188c3b5bb06e7, CL-dc99caf32a5e5bbf, CL-3232c17acf5ee06a
- Rationale: 证据明确描述为产品发布，名称正确，类型为产品。但无明确声明证明所属公司，当前公司列表为空，需标记公司字段待补充。

### HKGAI V3 (EN-67c6738648b7e247)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HKGAI V3 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-11286782f3bae1b7, CL-bf1077c26c75a457, CL-c2adf9ebcc1b916a, CL-ad7c50c2a9e3c1a6
- Rationale: 证据显示为模型发布，名称和类型正确。但未提供明确声明证明所属公司，当前公司列表为空，需标记公司字段待补充。

### Home (EN-6470c8584a9d35d3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Google Home / product / 谷歌
- Issues: name, company
- Confidence: 0.95
- Claims: CL-4b9e08f54f2d9d06, CL-a0448403eafbb56a, CL-d1420643b5c6f063
- Rationale: 证据中产品名称为“Google Home”，而非“Home”。且证据明确显示谷歌发布该产品，应补充公司名“谷歌”。

### Home 6 (EN-3546e1b15e6549b2)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Google Home / product / Google
- Issues: name, company
- Confidence: 0.95
- Claims: CL-2a52a0c41ab1b678, CL-480417c449ba510c, CL-794c5c61fddce842, CL-79d9bbabded14f95
- Rationale: 证据中产品名称为“Google Home”，而非“Home 6”。且证据提及Google，应补充公司名“Google”。

### Hot French (EN-5bd0203f18d83c93)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZML / company / -
- Issues: name, type, company
- Confidence: 0.9
- Claims: CL-aae94e9f5d1a367a, CL-7fc7752f05d748a4
- Rationale: 证据中“Hot French startup ZML”表明ZML是一家初创公司，而非产品“Hot French”。应更正为组织类型，名称为ZML。

### How-to (EN-242e21e3dc6869a9)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: How-to / other / -
- Issues: name, type, company
- Confidence: 0.8
- Claims: CL-7a420af6eefcd3e0, CL-6ffa953da2d8fbdc, CL-e33e9cde13a8d5ca, CL-9e426a27544ca591
- Rationale: 证据中“How-to”是文章标题中的短语，描述AI工具帮助用户完成项目，并非独立产品、公司或人物。应归类为other。

### Hugging Face (EN-d9352ce019e77ab3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hugging Face / company / -
- Issues: name, type, company
- Confidence: 0.9
- Claims: CL-82f00a90d2b461ee, CL-8dc1566f9b823707
- Rationale: 证据中“Hugging Face 博客”和“Hugging Face 开源现状”表明Hugging Face是一个组织（公司或平台），而非产品。应更正为组织类型。

### Hy3 (EN-be1a3c9420d88ea5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hy3 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-3a8619e7c67dab96, CL-8aab7b79006b4541, CL-f213f8f529bbde36, CL-09c2c443b4087436
- Rationale: 证据显示为模型发布，名称和类型正确。但未提供明确声明证明所属公司，当前公司列表为空，需标记公司字段待补充。

### Increased (EN-9eb42ffb4942bcc2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'Increased'是普通动词，证据中仅作为研究结果中的动词出现，无任何证据表明它是一个产品、公司或实体。

### Inference Engine (EN-4540952d4d9138db)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Inference Engine / product / DigitalOcean
- Issues: company
- Confidence: 0.9
- Claims: CL-5136009817417e5e, CL-cd1bb6a16dd0b1ea
- Rationale: 证据显示DigitalOcean发布了Inference Engine，应归属DigitalOcean，当前公司列表为空，需补充。

### Inference Era (EN-2a817d99285e12c4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-Native Cloud / product / DigitalOcean
- Issues: name, company
- Confidence: 0.85
- Claims: CL-452cd72b30375988, CL-0bf122b32e29ddd6, CL-79b197557a56ecbe
- Rationale: 证据中产品实际名称为'AI-Native Cloud'，'Inference Era'是描述性短语，且DigitalOcean是发布方，需修正名称和公司。

### Intelligent Terminal (EN-f8ceb65dd1764cd4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Intelligent Terminal / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-7b3da75ee3eee173, CL-e1c4bb634f348b94, CL-fff01b9449a39855
- Rationale: 证据显示微软推出了Intelligent Terminal，当前公司列表为空，应归属Microsoft。

### Introduces Compact (EN-56ee86045cfb0ddd)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Compact, Energy-Efficient Systems / product / Supermicro
- Issues: name, company
- Confidence: 0.85
- Claims: CL-71e2abe848866c02, CL-5276acf634a2cdf7, CL-55659ee9c4f25cec
- Rationale: 证据中'Introduces Compact'是动词短语，实际产品为Supermicro发布的紧凑节能系统，需修正名称和公司。

### JavaScript (EN-992eafe973f69075)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: LiteRT.js / product / Google
- Issues: name
- Confidence: 0.9
- Claims: CL-0b9e84b1b5bb3529, CL-f1c1c7bd86022006, CL-a86ade0b17b2516b
- Rationale: 证据中产品实际名称为'LiteRT.js'，'JavaScript'是编程语言，当前名称错误，需修正为LiteRT.js。

### Jio Call (EN-a4e7560e8d2b340f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Jio Call Agent / product / Reliance Industries
- Issues: name, company
- Confidence: 0.95
- Claims: CL-c19527da2838ee4a, CL-1c224d072885b4a9, CL-ed96cc19b0ba7804
- Rationale: 证据中产品名称为'Jio Call Agent'，而非'Jio Call'；且明确由Reliance Industries（信实工业）发布。建议修正名称和公司。

### JoyAI-VL-Interaction (EN-a759ee8f6d212de8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: JoyAI-VL-Interaction / product / 京东
- Issues: company
- Confidence: 0.95
- Claims: CL-5800e10426256754, CL-b88429af2de339b9, CL-c1226250de82c608, CL-4c8ffb4175bb1631
- Rationale: 证据明确京东开源了该模型，当前公司字段为空，应补充为京东。名称无误。

### K3 (EN-76ac3e702b5ccaff)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Kimi K3 / product / Moonshot AI
- Issues: name, company
- Confidence: 0.95
- Claims: CL-5ae97e93b6e818fb, CL-ca9f649550e1e44f, CL-d9131a0314310537, CL-2902f31e35790727, CL-581b7659c405c824, CL-8727a77633aa692c, CL-8a46daded90710eb, CL-e13bc9dd77efa0b4, CL-eb93ab1918bb222c, CL-f6c1e379e9656514
- Rationale: 证据中产品名称为'Kimi K3'或'K3'，但当前名称为'K3'，建议修正为完整名称；且明确由月之暗面（Moonshot AI）发布，当前公司字段为空，应补充。

### Karamo Brown (EN-0fc990954c0aea17)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Karamo Brown / person / -
- Issues: type
- Confidence: 0.9
- Claims: CL-25e76f88684f5309, CL-291b248f0d0b7be2, CL-98b594285f787add, CL-9afffd2702092b1e
- Rationale: 证据显示Karamo Brown是《粉雄救兵》中的生活教练，推出健康应用Kē，其本人是人物而非产品。建议类型改为person。

### Kimi K3 (EN-607964040e4b62e0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Kimi K3 / product / Moonshot AI
- Issues: company
- Confidence: 0.95
- Claims: CL-d9131a0314310537, CL-2902f31e35790727, CL-8727a77633aa692c
- Rationale: 证据中多次提及月之暗面（Moonshot AI）发布Kimi K3模型，但当前公司名称为空，应补充为Moonshot AI。

### Kolibri (EN-e97edd12a2b8befa)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Kolibri / product / Konecta
- Issues: company
- Confidence: 0.95
- Claims: CL-3cb5df62219fe339, CL-a43b207dd4369d2b, CL-de9bbea60aae9c26, CL-f85fdf2b14e981e7
- Rationale: 证据明确显示Konecta发布了Kolibri平台，但当前公司名称为空，应补充为Konecta。

### LangBuilder (EN-51a5b811990f2a2a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LangBuilder / product / CloudGeometry
- Issues: company
- Confidence: 0.95
- Claims: CL-352eef31fe17fd2e, CL-54873506b81edd19
- Rationale: 证据指出LangBuilder是CloudGeometry的开源企业级AI平台，但当前公司名称为空，应补充为CloudGeometry。

### Launches (EN-77fe4e790d5bc756)

- Decision: correction_candidate
- Current type / company: product / Crusoe, FuriosaAI, Google, OpenAI, Microsoft, Anthropic, Meta, Databricks
- Proposed: - / other / -
- Issues: name, type, company
- Confidence: 0.95
- Claims: CL-083dede3547eb7ab, CL-1b2414334803833d, CL-1cc211dda48a2df5, CL-24e3b16ac281c899, CL-267496c4f8fc8e4f, CL-2826c92839743351, CL-6cb989c70ce83861, CL-856fd3d929db7b81, CL-8fae10d119f22475, CL-9054353c70406853
- Rationale: 所有提供的声明中，“Launches”均作为动词出现在引文中（如“OpenAI launches...”、“Microsoft launches...”），并非一个产品名称。当前将其列为产品，但证据显示它只是描述发布动作的通用词汇，而非实体。因此建议改为“other”类型，名称留空。

### Launches AI (EN-e947caedcfbb4b90)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agents On Partner Central / product / AWS
- Issues: name, company
- Confidence: 0.9
- Claims: CL-ea4ce0d501f5281e, CL-1c574a247ac0f458, CL-dff6bc37d24a0901
- Rationale: 当前名称“Launches AI”是动词短语，非产品名。证据显示AWS发布了名为“AI Agents On Partner Central”的产品，且AWS是开发运营方。建议修正产品名并补充所属公司。

### Launches Artemis (EN-0f714d682ed97e64)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Artemis / product / Kore.ai
- Issues: name, company
- Confidence: 0.95
- Claims: CL-aa3414767466f37f, CL-e1505fc42fbdf511, CL-2f660c3ed6b51b9c, CL-7f46f6606ae2343d
- Rationale: 当前名称“Launches Artemis”包含动词“Launches”，是产品发布动作的一部分，而非产品名称。证据中明确提到“Kore.ai Launches Artemis”以及“Kore.ai Agent Platform Artemis edition”，表明产品名称为“Artemis”，由Kore.ai发布。因此建议修正名称为“Artemis”，类型为产品，所属公司为Kore.ai。

### Launches Autonomous Worker (EN-098a7df7f42ccf8b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Worker Agents / product / Harness
- Issues: name, company
- Confidence: 0.95
- Claims: CL-62e26c367ac42c6a, CL-8d7813f50efd79be, CL-ef355ec62d46b874
- Rationale: 证据显示Harness发布了名为'Autonomous Worker Agents'的产品，当前名称'Launches Autonomous Worker'是事件标题片段而非产品名。证据明确表明Harness是发布方，应补全公司名。

### Launches Connect AI (EN-b176dfaec25b5143)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Connect AI Developer Edition / product / CData
- Issues: name, company
- Confidence: 0.95
- Claims: CL-259b0862836da331, CL-df197344e8d4a1cf
- Rationale: 证据显示CData发布了'Connect AI Developer Edition'，当前名称'Launches Connect AI'是事件标题片段。CData是明确的发布公司，应补全。

### Launches Inference Engine (EN-e9b9f3fb5a138cd5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Inference Engine / product / DigitalOcean
- Issues: name, company
- Confidence: 0.95
- Claims: CL-5136009817417e5e, CL-cd1bb6a16dd0b1ea
- Rationale: 证据显示DigitalOcean发布了'Inference Engine'，当前名称'Launches Inference Engine'是事件标题片段。DigitalOcean是明确的发布公司，应补全。

### Launches Its AI (EN-efe10579b49d54d9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Platform / product / SambaNova
- Issues: name, company
- Confidence: 0.9
- Claims: CL-a0dc064228e2280a, CL-05962c7be259e6cd
- Rationale: 证据显示SambaNova在AWS Marketplace发布了其'AI Platform'，当前名称'Launches Its AI'是事件标题片段。SambaNova是明确的发布公司，应补全。

### Launches Modelplane (EN-9855ef88d183e07b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Modelplane / product / Upbound
- Issues: name, company
- Confidence: 0.95
- Claims: CL-b56b4f9da5ca525d, CL-1ecb85f4fb243eda, CL-a0a427d0cc34f0ba
- Rationale: 证据显示Upbound发布了'Modelplane'，当前名称'Launches Modelplane'是事件标题片段。Upbound是明确的发布公司，应补全。

### Lean 4 (EN-50fbf46e6eff93e5)

- Decision: correction_candidate
- Current type / company: product / Mistral AI
- Proposed: Lean 4 / product / -
- Issues: type, company
- Confidence: 0.85
- Claims: CL-51796767bcae979d, CL-b2ca87455d9c5de5, CL-23c4158d25f76d5c
- Rationale: 证据描述Lean 4是一种编程语言/证明助手，而非Mistral AI发布的产品。Mistral发布的是Leanstral 1.5模型，Lean 4是目标语言。当前类型应为'other'，且不应归属Mistral AI。

### LingBot-World 2.0 (EN-7a3ecc54829211df)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LingBot-World 2.0 / product / 蚂蚁灵波
- Issues: company
- Confidence: 0.9
- Claims: CL-887c5dc7fbee2024, CL-b92e419d7a18dd98, CL-d43100e1d509196e, CL-dad3a52f0fc6e925
- Rationale: 证据显示蚂蚁灵波发布并开源该模型，当前公司字段为空，应补充为蚂蚁灵波。

### Llama API (EN-5b76e682643efda7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Llama API / product / Meta
- Issues: company
- Confidence: 0.9
- Claims: CL-fc300cf26339c37e, CL-368028d4325f1c06, CL-60b815ce658fe627, CL-dd0c08036c9bbbf1
- Rationale: 证据显示 Meta 运营 Llama API，当前公司字段为空，应补充为 Meta。

### LongCat-2.0 (EN-8992f4a61a19a74b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LongCat-2.0 / product / 美团
- Issues: company
- Confidence: 0.9
- Claims: CL-3918c79bf6fe9714, CL-8a0fd635b5b314bd, CL-bdc51ac046a759bd
- Rationale: 证据显示美团发布 LongCat-2.0 模型，当前公司字段为空，应补充为美团。

### M-Robots OS 2.0 (EN-80ea42a231357d12)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: M-Robots OS 2.0 / product / 深开鸿
- Issues: company
- Confidence: 0.9
- Claims: CL-c1f4199a021ea02a, CL-4bb257a6d8170957, CL-53d42ff7b84a2843, CL-d0150be45add875b
- Rationale: 证据显示深开鸿发布 M-Robots OS 2.0，当前公司字段为空，应补充为深开鸿。

### MacWhisper 14 (EN-1d77d67a89bfd2c2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据显示MacWhisper 14是产品，但未提供任何公司名称或所有权声明，无法确认所属公司。

### MacWhisper 14.0 (EN-c02834bd64ce3d10)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MacWhisper 14.0 / product / -
- Issues: name, duplicate
- Confidence: 0.7
- Claims: CL-25436952df3f099f, CL-828c96bc3da724c4, CL-4ba43bfe1eec0ea9, CL-fd16a4c8da456a6b
- Rationale: 证据中MacWhisper 14.0是MacWhisper 14的一个版本，可能为重复或子版本，建议合并或明确区分。

### Marketplace (EN-d2f4e09cb01afa3c)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Microsoft Marketplace / product / Microsoft
- Issues: name, company
- Confidence: 0.8
- Claims: CL-409b1ac6f7c6dba6, CL-e3d419ad56cad157, CL-454b0816fc8c7809, CL-a29cce00dcb0adfd
- Rationale: 证据中提及Microsoft Marketplace，建议将名称补充完整，并关联微软公司。

### MattoBoard (EN-45066a1a95a3a0f2)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MattoBoard / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0ab85bc911845c03, CL-25bcdd5994eed390, CL-42cf14cef9e10d2a, CL-5859ce277c3fe2cf
- Rationale: 证据确认MattoBoard是一个3D情绪板与市场产品，但未提供所属公司名称。

### Micro-Industries (EN-2eb073b22916de55)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VeltrisOne / product / Veltris
- Issues: name, company
- Confidence: 0.85
- Claims: CL-199c1fcc1678d87d
- Rationale: 证据中VeltrisOne是专为微型行业打造的AI编排平台，由Veltris公司发布，当前名称Micro-Industries不准确。

### MiniCPM (EN-12a81529bba89666)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MiniCPM / product / 面壁智能
- Issues: company
- Confidence: 0.95
- Claims: CL-6ec9ec2903819053, CL-e036cc41f39e2bd4, CL-0b9269713872b516
- Rationale: 证据明确显示面壁智能自主研发MiniCPM系列端侧模型，并搭载于三星手机上市，属于产品发布。当前公司字段为空，应补充为面壁智能。

### Modelplane (EN-8950d72f381130ac)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Modelplane / product / Upbound
- Issues: company
- Confidence: 0.95
- Claims: CL-1ecb85f4fb243eda, CL-a0a427d0cc34f0ba, CL-b56b4f9da5ca525d
- Rationale: 证据显示Upbound发布了Modelplane开源控制平面，属于产品发布。当前公司字段为空，应补充为Upbound。

### Mozilla 2026 (EN-6ac6ad44bb9995ca)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Mozilla 2026 开源 AI 报告 / other / -
- Issues: name, type
- Confidence: 0.9
- Claims: CL-0ca78d09377de663
- Rationale: 证据显示Mozilla 2026是一份开源AI报告，而非产品。名称应更准确描述为报告，类型应为other。

### MS-NAT5000 (EN-cb29f2627d5408e0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MS-NAT5000 / product / 映泰
- Issues: company
- Confidence: 0.95
- Claims: CL-030aaa8424464499, CL-34eae2e3cf08f5dd, CL-491026e3b84ada48
- Rationale: 证据显示映泰推出边缘AI系统MS-NAT5000，属于硬件产品发布。当前公司字段为空，应补充为映泰。

### MuleRun (EN-1725c58362aadc2a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MuleRun / product / 阿里巴巴
- Issues: company
- Confidence: 0.9
- Claims: CL-404e2f09a3ef7471
- Rationale: 证据显示阿里巴巴计划整合MuleRun产品，表明MuleRun是阿里巴巴的产品。当前公司字段为空，应补充为阿里巴巴。

### MusaCoder (EN-c27c48199bb1e14b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MusaCoder / product / 摩尔线程
- Issues: company
- Confidence: 0.95
- Claims: CL-57cfe19e948589f8, CL-fda9da9b3aa8feed
- Rationale: 证据显示摩尔线程发布并开源MusaCoder代码大模型，属于模型发布。当前公司字段为空，应补充为摩尔线程。

### Mythos (EN-db68703d8d719bd0)

- Decision: requires_review
- Current type / company: product / OpenAI, Anthropic
- Proposed: Mythos / product / OpenAI, Anthropic
- Issues: company
- Confidence: 0.6
- Claims: CL-5572124dcc10c5ad, CL-c55c682ea203271e, CL-022ff08fc8204a5e, CL-0c2d8eedf393ff6e, CL-0dfe28151e772826, CL-0eea4ecb1dde07fa, CL-0f37c2091158dc07, CL-10448def9b55c060, CL-1851a003cfc5c07a, CL-200210cc6f668bc1
- Rationale: 证据显示Anthropic发布Mythos，但OpenAI仅作为竞争对手提及，无发布或所有权证据，当前公司列表包含OpenAI需审查。

### Mythos-like (EN-784c7cd63a83ccaa)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据仅提及亚洲初创公司推出类似Mythos的模型，未提供具体产品名称或公司所有权信息，无法确认。

### N8L (EN-b3f3ddb837329753)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中N8L作为腾势车型提及，但未明确其为AI产品，且无公司发布或所有权证据。

### Next Developer Platform for (EN-0decbc3b45f73b2b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Entire / product / -
- Issues: name, company
- Confidence: 0.7
- Claims: CL-7f1ee7bec414a00d, CL-b967f75e7c42d240, CL-bbe3b5838db213f3, CL-f449cdd84412379e
- Rationale: 当前名称'Next Developer Platform for'是描述性片段而非产品名。证据显示'Entire'是一个开发者平台（产品），由前GitHub CEO创立的新公司，但证据未明确该公司名称，且无证据显示与任何现有公司有发布/拥有关系。建议修正名称为'Entire'，类型为product，公司留空。

### NEXT-GENERATION DATA CENTER (EN-b0eea3ad7b0d0a48)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Interconnect Platform / product / Chelsio Communications
- Issues: name, company
- Confidence: 0.9
- Claims: CL-6d446e6da55bdde6, CL-7a606b483bf24c80, CL-9a80556cc27c0403, CL-acb61a846e6acac5
- Rationale: 证据显示CHELSIO发布了“seventh-generation AI Interconnect Platform”，而非名为“NEXT-GENERATION DATA CENTER”的产品。当前名称是通用描述而非产品名。证据明确表明CHELSIO是发布方，应填入公司名。

### Nexus (EN-c73da23142d2205b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Nexus / product / Slimbook
- Issues: company
- Confidence: 0.95
- Claims: CL-2aaf0fc18ffbfb07, CL-6a57a8710feb8939, CL-c050f1e378d3febe, CL-c9c9122cdc5e75b5
- Rationale: 证据显示Slimbook推出了Nexus系列AI工作站，明确Slimbook是发布方。当前公司名为空，应补充为Slimbook。

### Nous Research (EN-3969dd578ebf6c65)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Nous Research / company / -
- Issues: type
- Confidence: 0.95
- Claims: CL-e828e0ea08beaf67
- Rationale: 证据描述Nous Research为“open-source artificial intelligence startup”，表明它是一个公司实体，而非产品。当前类型为product，应改为company。

### NousCoder-14B (EN-761c4b9294ee43a7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NousCoder-14B / product / Nous Research
- Issues: company
- Confidence: 0.95
- Claims: CL-e828e0ea08beaf67
- Rationale: 证据显示Nous Research发布了名为NousCoder-14B的编程模型，明确产品归属。当前公司名为空，应填入Nous Research。

### NXT RNGD server (EN-977d20414b3b8be9)

- Decision: correction_candidate
- Current type / company: product / FuriosaAI
- Proposed: NXT RNGD server / product / FuriosaAI
- Issues: duplicate
- Confidence: 0.9
- Claims: CL-0c210509638f5894, CL-8fae10d119f22475, CL-38c8cddac76c3aca, CL-58bce007eb76e2ff
- Rationale: 该条目与EN-5f5fcd8701ab30c0（NXT RNGD）指向同一产品，证据相同，属于重复条目。建议合并或标记重复。

### Oasis 3 (EN-94ff75465b1afa65)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Oasis 3 / product / Decart
- Issues: company
- Confidence: 0.95
- Claims: CL-5c92ec7ee55a3124, CL-62260e499c34fefe, CL-040f0a847e88c69d, CL-b837900dd05d8830
- Rationale: 证据显示Decart发布了Oasis 3模型，明确产品归属。当前公司名为空，应填入Decart。

### OCR 4 (EN-2c2a76216a876127)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: OCR 4 / product / Mistral AI
- Issues: company
- Confidence: 0.95
- Claims: CL-8db6e572caff04f0, CL-e93ecebce51681b4
- Rationale: 证据显示Mistral AI发布了OCR 4模型，明确产品归属。当前公司名为空，应填入Mistral AI。

### Office (EN-26e4951af4490c21)

- Decision: requires_review
- Current type / company: product / Kingsoft Office, xAI
- Proposed: Office / product / Kingsoft Office, xAI
- Issues: company, evidence
- Confidence: 0.3
- Claims: CL-34ad279d62cf4bdc, CL-78afe1659d3c2512, CL-77833569bd63ddac, CL-08c01a84d1450680, CL-1fb492b260514e14, CL-53adfd6ec3d4e899, CL-85e283c4e7a19617, CL-928afe90f7fa47bd
- Rationale: 条目为产品'Office'，但证据中提及的是'微软 Office'，且引文描述的是为微软Office推出的扩展，并非直接证明Kingsoft Office或xAI发布或拥有名为'Office'的产品。当前关联的公司名称与证据不匹配，需要进一步审查。

### OKF v0.1 (EN-eb0cc8fb584389db)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: OKF / product / Google
- Issues: name, duplicate
- Confidence: 0.9
- Claims: CL-c83d337cfa0736fd, CL-ca554276228d639a, CL-dca0f01153b681c9, CL-191ed56085648a37
- Rationale: 证据中产品名称为'Open Knowledge Format (OKF)'，版本号'v0.1'是版本标识而非独立产品名。此条目与EN-b5c336c0dd1ff29c（OKF）重复，建议合并或重命名为'OKF'。

### One-Stop Shop (EN-efd004603fda1d53)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agent Marketplace / product / AWS
- Issues: name, company
- Confidence: 0.85
- Claims: CL-fd24eb544cd9b969, CL-2398193d0594d6e3, CL-5225b764ba1d9728, CL-7bf5f7c534363577
- Rationale: 证据中'One-Stop Shop'是描述性短语，实际产品为'AWS AI Agent Marketplace'。当前公司名称为空，证据显示由AWS发布，应补充公司名称并修正产品名。

### Open Source (EN-202ac21492470b79)

- Decision: correction_candidate
- Current type / company: product / Microsoft
- Proposed: Agent Governance Toolkit / product / Microsoft
- Issues: name
- Confidence: 0.9
- Claims: CL-8db9327ffefca608, CL-d1d802757ac20e21, CL-785b4a16eb92e436, CL-f142f9c6204d2962
- Rationale: 证据中'Open Source'是通用术语，实际产品为'Agent Governance Toolkit'，由Microsoft发布。当前公司名称Microsoft正确，但产品名应修正为'Agent Governance Toolkit'。

### Open Source Flexibility (EN-979ed4c1e4eb3a04)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LangBuilder / product / CloudGeometry
- Issues: name, company
- Confidence: 0.85
- Claims: CL-2c92678b9b52b31f, CL-352eef31fe17fd2e, CL-54873506b81edd19, CL-6847cf10caebcfd3
- Rationale: 证据中'Open Source Flexibility'是描述性短语，实际产品为'LangBuilder'，由CloudGeometry发布。当前公司名称为空，应补充公司名称并修正产品名。

### Open Source TypeScript AI (EN-feecb1b1adc8584d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VoltAgent / product / -
- Issues: name, company
- Confidence: 0.8
- Claims: CL-51cc83a2889e23f2, CL-7507646f63868460, CL-e1ad432c9824b470, CL-f2a9507602c2b524
- Rationale: 证据中'Open Source TypeScript AI'是描述性短语，实际产品为'VoltAgent'。当前公司名称为空，证据未明确指明发布公司，需进一步审查。

### OpenCode (EN-b644c0a9d493976a)

- Decision: requires_review
- Current type / company: product / Xiaomi
- Proposed: OpenCode / product / Xiaomi
- Issues: company, evidence
- Confidence: 0.4
- Claims: CL-56f2e0c1154392a0, CL-5a36ba36f10f70be, CL-74848e2afb65c933, CL-81cbc84733597f2c, CL-972909f107eb213a, CL-98568a4769d6cba5, CL-0d31b12e78daafe8, CL-176a954d9d2dec69
- Rationale: 证据显示小米基于OpenCode二次开发了MiMo Code，但未明确证明小米发布或拥有OpenCode本身。OpenCode可能为独立开源项目，当前公司名称Xiaomi与证据不直接匹配，需要进一步审查。

### Optimized Systems Supporting (EN-c165c006a5968443)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: GPU-Optimized Systems / product / Supermicro
- Issues: name, company
- Confidence: 0.85
- Claims: CL-9cc98d31288c9ff7, CL-a35e34184928739f, CL-eef10607234667d5, CL-fa424945c58620bc
- Rationale: 当前canonical_name 'Optimized Systems Supporting' 是描述性短语，非产品名。证据显示Supermicro发布了'GPU-Optimized Systems'系列产品，应修正为更准确的产品名称，并关联公司Supermicro。

### Pipeshift Launch Real-Time AI (EN-d200de545425ea63)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Real-Time AI Inference Service / product / Neysa, Pipeshift
- Issues: name, company
- Confidence: 0.8
- Claims: CL-1136a84b4fda3f74, CL-784d33474a583712, CL-a85f33f2c807ae60, CL-ee65bc0a316031e2
- Rationale: 当前canonical_name 'Pipeshift Launch Real-Time AI' 是事件描述，非产品名。证据显示Neysa与Pipeshift联合推出实时AI推理服务，产品名应为'Real-Time AI Inference Service'，关联公司为Neysa和Pipeshift。

### Platform Built for Everyone (EN-1ca156b825e21de0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Enterprise AI Trust Platform / product / OpenBox AI
- Issues: name, company
- Confidence: 0.85
- Claims: CL-3265eaa722ce0cd3, CL-4025bb89e730bc8a, CL-5c9136b4d8345f5e, CL-a71d32f1e3db1e97
- Rationale: 当前canonical_name 'Platform Built for Everyone' 是宣传语，非产品名。证据显示OpenBox AI推出了一个企业AI信任平台，产品名应为'Enterprise AI Trust Platform'，关联公司为OpenBox AI。

### PowerEdge XE8812 (EN-85852fd45706e894)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: PowerEdge XE8812 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-67441b3f514a4524, CL-42bde7a5c54867e9, CL-92e82040e33cee86, CL-a4ef8058a846b125
- Rationale: 证据显示戴尔发布该服务器，但current_company_names为空，需补充公司信息。

### Precursor (EN-7099a2200559e508)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Precursor / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-6f6b0b46fcc12dac, CL-8b30e9fc10c6508f, CL-a3387598db51ee73
- Rationale: 证据显示Cloudflare推出Precursor，但current_company_names为空，需补充公司信息。

### Purpose-Built (EN-02072c80a8386e8d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VeltrisOne / product / Veltris
- Issues: name, company
- Confidence: 0.85
- Claims: CL-199c1fcc1678d87d
- Rationale: 证据中产品名称为VeltrisOne而非Purpose-Built，且明确由Veltris发布，建议修正名称和公司。

### PYMNTS.com (EN-cb24c5a65581e3ed)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据均关于AWS推出AI智能体市场，未提及PYMNTS.com，无法确认该实体。

### QoderWork (EN-09c344df70df9660)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: QoderWork / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-404e2f09a3ef7471, CL-b28fcafff0a14b4d, CL-f2d4b04a0a1dd78d, CL-987b6b91845064eb
- Rationale: 证据显示QoderWork是阿里巴巴的AI产品，但current_company_names为空，需补充公司信息。

### RDMA FOR NEXT-GENERATION DATA (EN-9c515f4c878bdb2e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: T7 AI Interconnect Platform / product / Chelsio Communications
- Issues: name, company
- Confidence: 0.85
- Claims: CL-6d446e6da55bdde6, CL-7a606b483bf24c80, CL-9a80556cc27c0403, CL-acb61a846e6acac5
- Rationale: 证据中产品为Chelsio第七代AI互连平台，非RDMA FOR NEXT-GENERATION DATA，且公司为Chelsio，建议修正。

### Real-Time AI Inference (EN-1766fb6fac8f1c5d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据描述的是Neysa与Pipeshift联合推出的实时推理服务，未提及名为Real-Time AI Inference的独立产品，无法确认。

### Real-World Clinical Setting (EN-668a3f52e25f8f4c)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / other / -
- Issues: name, type
- Confidence: 0.9
- Claims: CL-0581a6be6d26dce4, CL-33efd9167d0f81d9, CL-3f689640ff78ed82, CL-54c36b180fb4893f
- Rationale: 名称“Real-World Clinical Setting”是研究场景描述，非产品。证据中提及的是AI语音智能体在真实临床环境中的研究，该名称本身不是可发布、制造或运营的产品实体，应归类为other。

### Reality Elite (EN-8bc5e80636cd4b86)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 骁龙 Reality Elite / product / 高通
- Issues: name, company
- Confidence: 0.95
- Claims: CL-371c7db36d18efed, CL-41f452ae89b6f4c8, CL-a26620e846034228, CL-f131981479936512
- Rationale: 证据明确显示“骁龙 Reality Elite”是高通发布的旗舰XR芯片产品，属于硬件产品。当前名称“Reality Elite”不完整，缺少品牌前缀“骁龙”。证据中高通发布该芯片，应归属高通公司。

### Relate 2026 (EN-b3b5882e4eb97824)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / other / -
- Issues: name, type
- Confidence: 0.95
- Claims: CL-063e57d74686a010, CL-0dab2fc5d56516ed, CL-c69a64e985228325, CL-e6d07d39d2caaa94
- Rationale: “Relate 2026”是Zendesk举办的年度会议名称，并非产品。证据中描述的是在该会议上发布的产品，但名称本身是会议事件，应归类为other。

### Release (EN-5f6367300dabc238)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: RegattaDB / product / Regatta Data
- Issues: name, company
- Confidence: 0.95
- Claims: CL-6fea220b95074489, CL-442ef4ea70dab9f9, CL-86684197df24b879, CL-dd57aad51c2e05c9
- Rationale: 当前名称“Release”是通用动词，非产品名。证据显示“RegattaDB”是由Regatta Data公司发布的数据库产品，应修正为产品名并归属Regatta Data。

### Releases New AI (EN-936f01f91fdadf69)

- Decision: correction_candidate
- Current type / company: product / NVIDIA
- Proposed: NVIDIA Cosmos Predict-2 / product / NVIDIA
- Issues: name
- Confidence: 0.9
- Claims: CL-ead11e489b74d617, CL-7a2cf3057497c5f0, CL-6e49ac10053e7c69, CL-aa0756db01b89b6c
- Rationale: 当前名称“Releases New AI”是动词短语，非产品名。证据中明确提到NVIDIA发布了“NVIDIA Cosmos Predict-2”模型及开发者工具，应修正为具体产品名称。公司归属NVIDIA正确。

### Research (EN-e3db3da2b7dc6057)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: PHRM / product / Google
- Issues: name
- Confidence: 0.95
- Claims: CL-6a28dd5e05d2c912, CL-292b34ecd870b3d7, CL-cbe87de0cc539f77, CL-10875abfda0f096f
- Rationale: 当前名称“Research”是通用部门名，非产品。证据显示Google Research发布了被动心率监测系统“PHRM”，应修正为产品名。公司归属Google正确。

### RTX PRO 6000 (EN-65b3aa2f527deeef)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NVIDIA RTX PRO 6000 Blackwell Server Edition / product / NVIDIA
- Issues: name, company
- Confidence: 0.95
- Claims: CL-9cc98d31288c9ff7, CL-fa424945c58620bc, CL-a35e34184928739f, CL-eef10607234667d5
- Rationale: 当前名称“RTX PRO 6000”不完整。证据中明确产品全称为“NVIDIA RTX PRO 6000 Blackwell Server Edition”，是NVIDIA的GPU产品。应修正完整名称并归属NVIDIA。

### Run Enterprise AI (EN-5c5f862c2a5059df)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据均描述Thoughtworks的Agent/works平台，未提及'Run Enterprise AI'这一名称，无法确认该实体存在或归属。

### Ryzen AI MAX PRO (EN-630d75372b4d1eb5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Ryzen AI MAX PRO 400 / product / AMD
- Issues: name, company
- Confidence: 0.9
- Claims: CL-0a453ae27b7c1567, CL-7d48a848272f329d, CL-00b4ec8c054d2146, CL-f931dc75580e0776
- Rationale: 证据显示AMD新增支持Ryzen AI MAX PRO 400系列处理器，明确提及AMD和产品名称，但当前名称缺少'400'后缀且公司字段为空，建议修正。

### S-1 (EN-148b42653f5e08b1)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: S-1 / other / -
- Issues: type, company
- Confidence: 0.95
- Claims: CL-33e98d13578e6a9e, CL-5d756448caf51a9c, CL-fa37220043fac3d3, CL-c390dc03009f18dc
- Rationale: 所有证据表明S-1是OpenAI提交的证券注册文件（IPO相关），并非产品，应归类为other；且OpenAI是提交方而非产品所属公司，当前公司映射错误。

### SaaS (EN-623fbff8d5179d4e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: SaaS 是通用术语，非具体产品；无任何 Claim 证明其由某公司发布、开发或运营。

### Seedance 2.0 Mini (EN-4f96127fdacbb405)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Seedance 2.0 Mini / product / 字节跳动
- Issues: company
- Confidence: 0.9
- Claims: CL-28b3c29eaf8f9f1c, CL-4b2d508b68827b34, CL-687c5027592b39c5
- Rationale: Claim 明确字节跳动推出 Seedance 2.0 Mini 视频生成模型，应补充公司名称。

### SenseNova-Vision (EN-8fc4d0cdb7b45668)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: SenseNova-Vision / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0a07df5755be5277, CL-55064fc713f68fca, CL-7c6f5cd8bf74d2e5, CL-26af16a56efd3a88
- Rationale: 条目为产品类型，名称 SenseNova-Vision 在证据中被描述为“理解生成统一视觉大模型”，符合产品定义。证据显示商汤科技发布并开源该模型，但未提供明确的所有权声明（如“商汤科技拥有”），因此 current_company_names 保持为空，需标记 company 字段待补充。

### SiliconANGLE (EN-f475981105d2acbd)

- Decision: correction_candidate
- Current type / company: product / Canva
- Proposed: Canva AI 2.0 / product / Canva
- Issues: name, company
- Confidence: 0.9
- Claims: CL-5abf8e821a0d0b9a, CL-683c9eb3000ec555, CL-9e7b93ef54af8b54, CL-b583f4a673dd1fa8
- Rationale: 当前名称SiliconANGLE与证据不符。证据显示Canva发布了产品Canva AI 2.0，且Canva是发布方。SiliconANGLE是新闻媒体名称，非产品。根据证据，产品应为Canva AI 2.0，公司为Canva。

### Software Delivery (EN-e8fc8b3e92a8dc5a)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有声明均描述Harness公司发布自主工作代理，但未明确说明“Software Delivery”是产品名称。该短语在上下文中作为软件交付领域或平台描述出现，无任何声明直接证明其为产品、其类型或其所属公司。无法确认其为产品实体。

### Specialty Care Program Enrollment (EN-b6e23938808f272d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据仅提及AI语音智能体提升专科护理注册率，未证明'Specialty Care Program Enrollment'是产品或其归属。

### TypeScript AI Agent Framework (EN-d87e6bf7aa180a4a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VoltAgent / product / -
- Issues: name
- Confidence: 0.9
- Claims: CL-51cc83a2889e23f2, CL-7507646f63868460, CL-e1ad432c9824b470, CL-f2a9507602c2b524
- Rationale: 证据中产品实际名称为VoltAgent，而非TypeScript AI Agent Framework，后者是描述性短语。建议修正为VoltAgent。

### U.S (EN-3c92cc7e49924a6f)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: GPT-5.6 / product / OpenAI
- Issues: name
- Confidence: 0.95
- Claims: CL-93b0d4a31067426c, CL-bbdd2091c6b95965, CL-c735fe30141305e7, CL-f0a75dd978f15381
- Rationale: 证据中产品实际名称为GPT-5.6，而非U.S。U.S是政府名称，非产品。OpenAI发布该产品，公司归属正确。建议修正产品名称为GPT-5.6。

### Ultimate Open-Source AI (EN-576c367dfd7686e8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Ultimate Open-Source AI Agent Directory / product / -
- Issues: name
- Confidence: 0.85
- Claims: CL-5fa3e168c9d3793d, CL-06d4c798834a8ed3, CL-7cc2f9883e782e4a, CL-8a1feaca0ce05720
- Rationale: 证据中实际名称为'The Ultimate Open-Source AI Agent Directory'，是一个GitHub仓库目录，而非'Ultimate Open-Source AI'。建议修正名称。

### Unveils Autonomous (EN-a83eedd800c2433b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Service Workforce / product / Zendesk
- Issues: name, company
- Confidence: 0.9
- Claims: CL-063e57d74686a010, CL-0dab2fc5d56516ed, CL-c69a64e985228325, CL-e6d07d39d2caaa94
- Rationale: 证据显示Zendesk发布了'Autonomous Service Workforce'，而非'Unveils Autonomous'。后者是动词短语。建议修正名称为Autonomous Service Workforce，并添加公司Zendesk。

### Unveils Canva AI (EN-954dc5d6516f127c)

- Decision: correction_candidate
- Current type / company: product / Canva
- Proposed: Canva AI 2.0 / product / Canva
- Issues: name
- Confidence: 0.95
- Claims: CL-683c9eb3000ec555, CL-5abf8e821a0d0b9a, CL-6b4b7db9ba44e97b, CL-9e7b93ef54af8b54, CL-b583f4a673dd1fa8, CL-c635fa44c2d34d46, CL-c8139e776a8f06ec, CL-e07a1ba7fbb0f9d9
- Rationale: 证据中产品实际名称为'Canva AI 2.0'，而非'Unveils Canva AI'。后者是动词短语。Canva公司归属正确。建议修正名称为Canva AI 2.0。

### Unveils Peraton (EN-0dba03107c52ed3e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Peraton[x] / product / Peraton
- Issues: name, company
- Confidence: 0.95
- Claims: CL-93fcc0157621326b, CL-029c456d4eed8080, CL-23a57e3c51e70323, CL-3240f22f5dc8d1ea
- Rationale: 当前名称'Unveils Peraton'是事件标题片段，非产品名。证据显示Peraton发布了产品'Peraton[x]™'，因此建议更正产品名为'Peraton[x]'，并添加公司'Peraton'。

### V3 AI (EN-7237be4cf93bf940)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 雷鸟 V3 AI 拍摄眼镜 / product / -
- Issues: name, company
- Confidence: 0.9
- Claims: CL-11ac1171efcd7656, CL-3c67d397d410b44c
- Rationale: 当前名称'V3 AI'不完整。证据中产品全称为'雷鸟 V3 AI 拍摄眼镜'，由'雷鸟'发布，但证据未明确'雷鸟'是否为公司名，故公司字段留空。

### VC Corner (EN-d31a4982f920e657)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: The Ultimate Open-Source AI Agent Directory / product / -
- Issues: name, company
- Confidence: 0.85
- Claims: CL-5fa3e168c9d3793d, CL-7cc2f9883e782e4a
- Rationale: 当前名称'VC Corner'是事件标题的一部分，非产品名。证据指向一个GitHub仓库目录，名称为'The Ultimate Open-Source AI Agent Directory'，但未明确开发公司，故公司字段留空。

### VeltrisOne (EN-23b979df49741c93)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VeltrisOne / product / Veltris
- Issues: company
- Confidence: 0.95
- Claims: CL-199c1fcc1678d87d
- Rationale: 当前产品名'VeltrisOne'正确。证据明确显示Veltris公司发布了VeltrisOne平台，因此应添加公司名'Veltris'。

### Verifiers (EN-1c6392c229ed9069)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Verifiers / product / Prime Intellect
- Issues: company
- Confidence: 0.95
- Claims: CL-434349c3bb4f4e0d, CL-640c4ad549143696
- Rationale: 当前产品名'Verifiers'正确。证据显示Prime Intellect发布了Verifiers环境栈，因此应添加公司名'Prime Intellect'。

### Verifiers v1 (EN-8c8c58ec2d92d598)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Verifiers v1 / product / Prime Intellect
- Issues: company
- Confidence: 0.95
- Claims: CL-434349c3bb4f4e0d, CL-640c4ad549143696
- Rationale: 当前产品名'Verifiers v1'正确。证据显示Prime Intellect发布了Verifiers v1，因此应添加公司名'Prime Intellect'。

### Vids (EN-c4593a0a1bbaf20b)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Vids / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-17db8b867d10467d, CL-509812acb58631bd, CL-5b504871819e12c4, CL-15e7ef028575f33f
- Rationale: 证据显示“谷歌 Google Vids”为产品发布，但未提供明确声明证明谷歌（Google）是开发者或所有者。当前公司字段为空，需补充所有权证据。

### VisionRay Flow Pro AI (EN-30bb70f57054ca83)

- Decision: requires_review
- Current type / company: product / -
- Proposed: VisionRay Flow Pro AI / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-07a2decdb599ec04, CL-7d58908dfc229a35, CL-e5c59b1872c60260
- Rationale: 证据显示DPVR发布该产品，但未明确声明DPVR是制造商或所有者。当前公司字段为空，需确认所有权。

### Walker C1 (EN-d558e1de958b9d05)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Walker C1 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-35a814ab6cf1ac87, CL-d1cac0d94682d59d, CL-eae2cec5964f6779
- Rationale: 证据显示优必选发布该产品，但未明确声明优必选是制造商或所有者。当前公司字段为空，需确认所有权。

### Wan-Streamer (EN-d83624eb3ab9192e)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Wan-Streamer / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-47b055cf37ef6dfe, CL-4d141439dc141d59, CL-61d37cba6a3df4ef, CL-8357b380ef8383c8
- Rationale: 证据显示阿里通义实验室发布该模型，但未明确声明其为所有者。当前公司字段为空，需确认所有权。

### Wan-Streamer v0.2 (EN-925a688403e10965)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Wan-Streamer v0.2 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-47b055cf37ef6dfe, CL-61d37cba6a3df4ef, CL-8357b380ef8383c8, CL-4d141439dc141d59
- Rationale: 证据显示阿里通义实验室发布该模型，但未明确声明其为所有者。当前公司字段为空，需确认所有权。

### Webwright (EN-10e5255f25e37ceb)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Webwright / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-dffd972d520d8a29
- Rationale: 证据提到微软研究院推出该框架，但未明确声明微软是所有者。当前公司字段为空，需确认所有权。

### wheelScrollAccelerationEnabled setting (EN-c23eb5fae3cdd763)

- Decision: requires_review
- Current type / company: product / Anthropic
- Proposed: wheelScrollAccelerationEnabled setting / product / Anthropic
- Issues: name, type
- Confidence: 0.6
- Claims: CL-4a6ed87bb9fa740f, CL-67a5b366c704944f, CL-cbaff86d744f269b, CL-21d23df5cc09744f
- Rationale: 证据显示该条目是Claude Code v2.1.174发布中的一个设置项，而非独立产品。当前名称和类型可能不准确，需审查是否为产品特性。

### WWDC 2026 (EN-dfabe4215e8c07cb)

- Decision: correction_candidate
- Current type / company: product / Apple
- Proposed: WWDC 2026 / other / -
- Issues: type
- Confidence: 0.9
- Claims: CL-167cc4a45ad498cf, CL-779e90a07aec3259, CL-936cfd8d3ae7e94a, CL-d03c5c9cb47fce47
- Rationale: 证据中WWDC 2026被描述为苹果开发者大会（event），是一个活动/会议，而非可发布的产品。应归类为other。

### Xcode 27 Beta (EN-1acf3a98930680ec)

- Decision: correction_candidate
- Current type / company: product / Apple
- Proposed: Xcode 27 Beta / product / Apple
- Issues: duplicate
- Confidence: 0.9
- Claims: CL-abeb123796984e45, CL-be6397745be4b268, CL-237aa10e9131be89, CL-bb177f8c54f761c6
- Rationale: 证据中Xcode 27 Beta与Xcode 27（EN-0502bb9ed34980aa）为同一产品不同版本，存在重复。建议合并或标记为同一产品。

### ZCode (EN-bc77259c5d2eb341)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZCode / product / 智谱AI
- Issues: company
- Confidence: 0.95
- Claims: CL-561e07b12fe3bead, CL-8d3f53e900c124b2
- Rationale: 证据明确显示智谱AI（Zhipu AI）发布了ZCode，当前公司字段为空，应补充为智谱AI。

### ZCode 3.0 (EN-993599624a199fe0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZCode 3.0 / product / 智谱
- Issues: company
- Confidence: 0.95
- Claims: CL-42bb46570b181556, CL-76a2dcd87a41c61c, CL-a39f135edafa0bd5
- Rationale: 证据显示智谱发布了ZCode 3.0，当前公司字段为空，应补充为智谱。

### ZenseAI.AgentMesh (EN-4d8f3ef9d13d6777)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZenseAI.AgentMesh / product / Zensar Technologies
- Issues: company
- Confidence: 0.95
- Claims: CL-c8af52ead25dfa23
- Rationale: 证据显示Zensar Technologies发布了ZenseAI.AgentMesh，当前公司字段为空，应补充为Zensar Technologies。

### ZUNA1.1 (EN-20ca085ff30e9339)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZUNA1.1 / product / Zyphra
- Issues: company
- Confidence: 0.95
- Claims: CL-5b5393973f497832, CL-b64be3969ec03109, CL-f7959ebd8cf5d425
- Rationale: 证据显示Zyphra发布了ZUNA1.1，当前公司字段为空，应补充为Zyphra。
