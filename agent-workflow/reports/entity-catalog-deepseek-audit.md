# Entity Catalog DeepSeek Audit

- Generated: 2026-07-18T05:22:39.867Z
- Model: deepseek-v4-flash
- Catalog: 476
- Reviewed: 476
- Confirmed (advisory): 211
- Correction candidates: 145
- Requires review: 39
- Insufficient evidence: 81
- Failed batches: 0

> DeepSeek output is advisory. No canonical entity, company-product relation, or public index was changed.

## Flagged items

### Apptio (EN-0d014547a90d8fea)

- Decision: insufficient_evidence
- Current type / company: company / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明仅提及Apptio联合创始人创立新公司Thira，未直接证明Apptio本身是公司、产品或其他类型。无足够证据确认其catalog_type或名称正确性。

### ByteDance (EN-5388bc10736a0eff)

- Decision: insufficient_evidence
- Current type / company: company / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明中仅提及“努比亚豆包手机大模型”，未直接证明ByteDance（字节跳动）本身是公司、产品或其他。无足够证据确认其catalog_type或名称正确性。

### Canva (EN-3db1f560db626918)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Canva / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-683c9eb3000ec555, CL-5abf8e821a0d0b9a
- Rationale: 提供的声明中CL-683c9eb3000ec555和CL-5abf8e821a0d0b9a明确将Canva描述为“Visual communication platform provider”和“Canva unveils...”，支持其为组织实体。其他声明ID未在证据列表中提供，故仅引用可用声明。

### Crusoe (EN-d41ebd9f02722fc8)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Crusoe / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-0296823c8ca00f22, CL-b6401dd6d9f46a12, CL-fa0de804eb5da4f2
- Rationale: 声明CL-b6401dd6d9f46a12明确称Crusoe为“world's first vertically integrated AI infrastructure company”，支持其为公司。其他声明ID未在证据列表中提供，故仅引用可用声明。

### Databricks (EN-2dc010636b9dce91)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Databricks / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-6cb989c70ce83861, CL-ac9f900ccbf46662, CL-3722b23157090c55
- Rationale: 声明中Databricks作为主体发布产品（如“Databricks Launches Genie One”），表明其为组织。其他声明ID未在证据列表中提供，故仅引用可用声明。

### FuriosaAI (EN-f4bec299df3f4f27)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: FuriosaAI / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-0c210509638f5894, CL-461c6f0b139447ca, CL-51bfd0c4c0762526
- Rationale: 声明CL-0c210509638f5894称FuriosaAI为“Chip startup”，CL-461c6f0b139447ca描述其与博通合作，支持其为公司。其他声明ID未在证据列表中提供，故仅引用可用声明。

### Gaode (EN-ef8ef0d64526209a)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Gaode / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-642cdb177273adf4, CL-6de0b33f2de748b4, CL-6120256dc8784518
- Rationale: 声明CL-642cdb177273adf4明确称“阿里巴巴集团旗下高德”，表明其为组织实体。其他声明ID未在证据列表中提供，故仅引用可用声明。

### LM Studio (EN-7df09a7717ef2feb)

- Decision: requires_review
- Current type / company: company / -
- Proposed: LM Studio / company / -
- Issues: name, type
- Confidence: 0.4
- Claims: CL-f8f0a879e968d315, CL-69587155c2ed4e51, CL-9cd679381f7dec6f
- Rationale: 声明中提及“LM Studio Bionic”作为产品发布，但“LM Studio”本身在声明中作为产品名称（如“LM Studio本地运行”）出现，而非明确作为公司主体。缺乏直接声明证明“LM Studio”是一个组织而非产品。需要进一步证据确认其公司身份。

### LMSYS (EN-636fa9664f878a4d)

- Decision: insufficient_evidence
- Current type / company: company / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有声明中“LMSYS”均作为团队或项目名称出现（如“LMSYS 与 SGLang 团队”），没有明确声明表明其是一个公司实体或发布产品。缺乏支持其为公司的直接证据。

### Nubia (EN-6f21a653c48f4f19)

- Decision: insufficient_evidence
- Current type / company: company / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明中仅提及“努比亚豆包手机大模型”，但未明确说明Nubia是公司还是产品名称，且无声明证明其作为组织发布、制造或运营产品，因此证据不足。

### SGLang (EN-6c87e5496f592f3c)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: SGLang / product / -
- Issues: type
- Confidence: 0.8
- Claims: CL-28348c4fe65170b5, CL-fe19ca104837cb24, CL-5f21324ca48bdbb5
- Rationale: 声明中SGLang被描述为推理引擎/软件发布物，而非公司。当前类型为“company”有误，应改为“product”。无证据表明其属于某公司。

### Soofi (EN-27aaa410b20647e0)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Soofi S / product / -
- Issues: name, type
- Confidence: 0.85
- Claims: CL-8ed5aa6af8a49598, CL-ba6eead5959435a3, CL-f37ab989d912208b
- Rationale: 声明中“Soofi S”是一个开源语言模型（产品），而非公司。当前规范名称“Soofi”不完整，类型应为“product”。无证据表明其属于某公司。

### Soul (EN-ae0facccf0a3723a)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Soul / product / -
- Issues: type
- Confidence: 0.8
- Claims: CL-3a7c8985cbe0b56b, CL-d429e1c09b341b1a, CL-dee4845ec1b8b8ca
- Rationale: 声明中“Soul”被描述为一款交友应用（产品），而非公司。当前类型为“company”有误，应改为“product”。无证据表明其属于某公司。

### 2026 创作者工具包报告 (EN-5d5ed5526ff07a29)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称“2026 创作者工具包报告”更像一份报告而非产品，且无证据表明其由某公司发布或拥有。

### 5K2K OLED (EN-ebf795c7403ad5b4)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: “5K2K OLED”是显示器规格描述，非产品名称；证据中LG发布的是具体显示器型号，而非此名称。

### 国内首个全周期高考志愿填报 (EN-3c2a3673eabc9a46)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称“国内首个全周期高考志愿填报”是描述性短语，非产品名；证据中提及的是千问Agent功能，并非此名称的产品。

### 妈祖 (EN-d90a8e9b152bf236)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 妈祖 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-491ba3ef5ab3104f, CL-68dc6574de1b85ac, CL-85c16d8f334f5f10
- Rationale: 证据显示中国气象局发布“妈祖”风云卫星AI工具箱，名称和类型正确，但当前公司名称为空，证据未提供公司名称。

### 全球首款动态数据流 AI 芯片 (EN-e9830c30bc572802)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: “全球首款动态数据流 AI 芯片”是描述性短语，非产品名；证据中实际产品名称为“理想马赫 M100”。

### 天枢领航 (EN-24dcf762a3ebce39)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 天枢领航 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0716bbba0dbedec3, CL-42f70ec26cd5d0d9, CL-c8f8abeb7dd35e7e
- Rationale: 证据显示长安汽车发布“天枢领航”辅助驾驶系统，名称和类型正确，但当前公司名称为空，证据未提供公司名称。

### 运通工程师信用卡 (EN-a4eee620f5a081bd)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 运通工程师信用卡 / product / 招商银行
- Issues: company
- Confidence: 0.95
- Claims: CL-0055eba8920e653f
- Rationale: Claim CL-0055eba8920e653f明确记载招商银行推出该信用卡，属于产品发布，确认产品归属。

### 总体体验：在智能体 AI 时代重新定义卓越 (EN-ef6aa1a04b3f52ab)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 总体体验：在智能体 AI 时代重新定义卓越 / product / 毕马威
- Issues: type
- Confidence: 0.7
- Claims: CL-889b87399f297138
- Rationale: 该名称实际为毕马威发布的报告标题，并非产品。Claim明确提及毕马威发布报告，建议类型改为'产品'并关联公司毕马威。

### A2P2 (EN-6c959f6391a7ce86)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: A2P2 / product / 京东
- Issues: company
- Confidence: 0.95
- Claims: CL-0288789d9a06dbc1
- Rationale: Claim CL-0288789d9a06dbc1明确京东发布A2P2协议，确认产品归属京东。

### ACE (EN-285c8f76de6c6c97)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE / product / 英特尔, AMD
- Issues: company
- Confidence: 0.8
- Claims: CL-575c04e2b07891de, CL-a2375b5fa313c2b6
- Rationale: Claim显示ACE由英特尔与AMD联合发布，当前无关联公司，建议补充两家公司。

### ACE 1.15 (EN-252da501233d3c2d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE 1.15 / product / 英特尔, AMD
- Issues: company
- Confidence: 0.8
- Claims: CL-a2375b5fa313c2b6
- Rationale: ACE 1.15为ACE规范版本，由英特尔与AMD联合发布，当前无公司映射，建议补充。

### Across Any Cloud (EN-3137a20f5252af53)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Across Any Cloud / product / Thoughtworks
- Issues: company
- Confidence: 0.7
- Claims: CL-417f3430556889ce
- Rationale: Claim中'Across Any Cloud'为Thoughtworks平台Agent/works™的描述性短语，并非产品名。建议将名称修正为'Agent/works™'并关联Thoughtworks。

### ADK Go 2.0 (EN-9ec037a4f41bae8f)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 当前证据仅描述产品发布和功能，未提供任何明确声明证明该产品由某公司发布、开发或拥有。无法确认公司归属。

### Agent Bucket (EN-7ff4fb5ddc1f4700)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Bucket / product / 腾讯云
- Issues: company
- Confidence: 0.95
- Claims: CL-dd73ae1ae16c53d1, CL-e3e97c87921ce32d, CL-6089f3684eed36c3
- Rationale: 证据明确声明腾讯云发布Agent Bucket，且多次提及腾讯云为其发布方，确认产品公司归属。

### Agent Marketplace (EN-dba61afed18c85d6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Marketplace / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-47e8000d9e590827, CL-4f806bffe6a5ad2e, CL-786d5f23a31b595e
- Rationale: 证据显示AWS发布了Agent Marketplace，但未明确声明AWS是开发者或所有者，仅提及平台集成与列表功能，无法确认产品归属公司。

### Agent Report (EN-a6f7e7d15269ba2d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据均关于Entire公司及其CEO，未提及“Agent Report”产品，无法确认该产品存在或归属。

### Agentic AI Goes Mainstream (EN-22d9e9f0b17223fe)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agentic AI Goes Mainstream / product / OutSystems
- Issues: type, company
- Confidence: 0.8
- Claims: CL-01c9133e30ad8243, CL-08f80b7f78f717d9, CL-3c10e430f763099b
- Rationale: 证据显示该名称为OutSystems研究报告标题，非产品；OutSystems为AI开发平台，应归类为产品，且公司应为OutSystems。

### Agently Mail (EN-30a63b26b06e096e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agently Mail / product / 腾讯
- Issues: company
- Confidence: 0.9
- Claims: CL-3a5697d62cea7b5e, CL-380ea0da32168193
- Rationale: 声明显示QQ邮箱（腾讯旗下）推出Agently Mail，应补充公司为腾讯。

### AI 志愿助手 (EN-87591eb8ddaae303)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI 志愿助手 / product / vivo
- Issues: company
- Confidence: 0.9
- Claims: CL-30e781cd79058e3e, CL-ee93482e6fc8b526
- Rationale: 声明显示vivo上线该功能，应补充公司为vivo。

### AI Adoption (EN-d7acd28717af7078)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明仅提及Zensar推出ZenseAI.AgentMesh，未明确证明“AI Adoption”是独立产品。

### AI Agent Directory (EN-ddc6bcfaf931295c)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明描述的是开源目录而非具体产品，且未提及任何公司。

### AI Agent Framework (EN-23fa906ab8df13d6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提及VoltAgent框架，但未证明“AI Agent Framework”是具体产品，也无公司归属。

### AI Agent Marketplace (EN-761a66c29a55bc53)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agent Marketplace / product / AWS
- Issues: company
- Confidence: 0.9
- Claims: CL-5225b764ba1d9728, CL-fd24eb544cd9b969
- Rationale: 声明明确AWS推出该市场，应补充公司为AWS。

### AI Agents Across Any (EN-1b0a2528912919f4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agents Across Any / product / Thoughtworks
- Issues: company
- Confidence: 0.95
- Claims: CL-417f3430556889ce, CL-0472d9e46c65b045, CL-4ec2992a62659404
- Rationale: 提供的声明明确显示Thoughtworks发布了名为Agent/works™的平台，该平台用于跨任意云环境治理和运行AI智能体。声明中“Thoughtworks launches Agent/works™”和“Thoughtworks announced the launch of Agent/works™”直接证明了Thoughtworks是此产品的发布者。因此，产品名称和公司映射得到确认。

### AI Agents Are (EN-19018cddd8946526)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明中“Vertical AI Agents Are Eating Horizontal SaaS”是一个文章标题或观点陈述，并非产品名称。声明中提到的Sierra、Legora、Harvey是其他公司的产品，与“AI Agents Are”无直接关联。没有声明证明“AI Agents Are”是一个产品，也没有声明证明其由任何公司发布、开发或拥有。证据不足。

### AI Agents Are Eating (EN-fef851474e3c4311)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明中“Vertical AI Agents Are Eating Horizontal SaaS”是一个文章标题，并非产品名称。声明中提到的Sierra、Legora、Harvey是其他公司的产品，与“AI Agents Are Eating”无直接关联。没有声明证明“AI Agents Are Eating”是一个产品，也没有声明证明其由任何公司发布、开发或拥有。证据不足。

### AI Agents On Partner (EN-5ab8fde232c3c298)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agents On Partner / product / AWS
- Issues: company
- Confidence: 0.95
- Claims: CL-ea4ce0d501f5281e, CL-1c574a247ac0f458
- Rationale: 提供的声明明确显示AWS在合作伙伴中心推出了AI代理。声明中“AWS Launches AI Agents On Partner Central”直接证明了AWS是此产品的发布者。因此，产品名称和公司映射得到确认。

### AI Cloud Launches (EN-64d17ceed397dfde)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Cloud Launches / product / DataRobot
- Issues: company
- Confidence: 0.95
- Claims: CL-57ed0bec96d075d4, CL-3ce00d540bcdd10e, CL-b84ce1a03fcf6751
- Rationale: 提供的声明明确显示DataRobot AI Cloud在Google Cloud Marketplace上线。声明中“DataRobot AI Cloud Launches on Google Cloud Marketplace”和“AI Cloud leader DataRobot today announced”直接证明了DataRobot是此产品的发布者。因此，产品名称和公司映射得到确认。

### AI Goes Mainstream (EN-a52f1da2224ffd03)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明中“Agentic AI Goes Mainstream in the Enterprise”是一个研究报告标题，并非产品名称。声明中提到的OutSystems是一个公司，但声明是关于其发布的研究报告，而非产品发布。没有声明证明“AI Goes Mainstream”是一个产品，也没有声明证明其由任何公司发布、开发或拥有。证据不足。

### AI Inference (EN-ae11c0abf6288776)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称“AI Inference”是通用术语，非具体产品名；证据仅描述Neysa与Pipeshift合作推出推理服务，未明确声明该实体是产品，也无公司所有权声明。

### AI INTERCONNECT PLATFORM WITH (EN-9cc48d787f521562)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称“AI INTERCONNECT PLATFORM WITH”不完整且像片段；证据中Chelsio发布平台，但未明确该名称对应具体产品，也无所有权声明。

### AI MAX PRO 400 (EN-8b0a3af52a26dde3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Ryzen AI MAX PRO 400 / product / AMD
- Issues: name, company
- Confidence: 0.9
- Claims: CL-0a453ae27b7c1567, CL-7d48a848272f329d
- Rationale: 证据明确提到“Ryzen AI MAX PRO 400 系列处理器”由AMD发布，当前名称缺少“Ryzen”前缀；AMD是发布公司。

### AI Pro AI (EN-16afaf30cb520fb4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ER939-AI Pro / product / MINIX
- Issues: name, company
- Confidence: 0.9
- Claims: CL-1619d19bfb89e437, CL-2dfe2a5e12ed9d33, CL-3f935ac7e0ad3e86
- Rationale: 证据明确产品名为“ER939-AI Pro”，由MINIX推出；当前名称“AI Pro AI”错误，且缺少公司归属。

### AI Safely (EN-a39230f0613145dc)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称“AI Safely”可能为拼写错误（应为Safely？）；证据中Atos推出Sovereign Agentic Studios，但未提及该名称，无任何所有权声明。

### AI Trust Platform Built (EN-8487426ba81162db)

- Decision: requires_review
- Current type / company: product / -
- Proposed: AI Trust Platform Built / product / -
- Issues: company, evidence
- Confidence: 0.6
- Claims: CL-3265eaa722ce0cd3, CL-4025bb89e730bc8a, CL-5c9136b4d8345f5e
- Rationale: 证据显示OpenBox AI发布了该平台，但未明确说明OpenBox AI是开发或运营该产品的公司。名称“AI Trust Platform Built”可能不完整，且当前公司列表为空，需进一步确认归属。

### AI visual search (EN-d692adb22248825f)

- Decision: requires_review
- Current type / company: product / -
- Proposed: AI visual search / product / -
- Issues: company, evidence
- Confidence: 0.5
- Claims: CL-42cf14cef9e10d2a, CL-0ab85bc911845c03, CL-25bcdd5994eed390
- Rationale: 证据提到MattoBoard推出AI视觉搜索功能，但该功能名为Design Stream，并非独立产品“AI visual search”。名称可能为功能描述而非产品名，且未明确归属公司。

### AI workbench (EN-91410aa2c40210be)

- Decision: requires_review
- Current type / company: product / -
- Proposed: AI workbench / product / -
- Issues: name, company, evidence
- Confidence: 0.6
- Claims: CL-915aaf68c542c36e, CL-ab22ef0a3fa94c62, CL-2bb4cebdfb94dae4
- Rationale: 证据显示Synthetic Sciences发布了名为OpenScience的AI工作台，但当前名称“AI workbench”是通用描述而非具体产品名。OpenScience才是产品名，且公司归属明确，但当前字段未更新。

### AI Workforce (EN-6d51d80daa73eb4a)

- Decision: requires_review
- Current type / company: product / -
- Proposed: AI Workforce / product / -
- Issues: name, company, evidence
- Confidence: 0.6
- Claims: CL-55d4c2c5a74b2a19, CL-62501b66860c9002, CL-03d4dea4c9bf0564
- Rationale: 证据显示Atomicwork推出了AI劳动力管理平台，但名称“AI Workforce”可能是平台功能描述而非产品名。Atomicwork明确为发布方，但当前公司列表为空，需确认产品确切名称和归属。

### AI-eSIM (EN-94b6413ed53a1867)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 所有声明均未明确提及任何公司发布、开发或拥有AI-eSIM产品，仅描述产业协同平台活动，无法确认产品归属。

### AI-Native Cloud Built (EN-3c827e340320d4cb)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DigitalOcean AI-Native Cloud / product / DigitalOcean
- Issues: name, company
- Confidence: 0.95
- Claims: CL-452cd72b30375988, CL-0bf122b32e29ddd6, CL-79b197557a56ecbe
- Rationale: 声明明确DigitalOcean发布了AI-Native Cloud平台，当前名称不完整且缺少公司归属，建议修正为完整名称并关联DigitalOcean。

### AI-Native Cloud Built for (EN-34e408ff65178379)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DigitalOcean AI-Native Cloud / product / DigitalOcean
- Issues: name, company
- Confidence: 0.95
- Claims: CL-452cd72b30375988, CL-0bf122b32e29ddd6, CL-79b197557a56ecbe
- Rationale: 与EN-3c827e340320d4cb为同一产品，当前名称截断不完整，声明明确DigitalOcean拥有该平台，建议合并修正。

### AI内容标注行为守则 (EN-5dcd7df1a5bf068f)

- Decision: requires_review
- Current type / company: product / -
- Proposed: AI内容标注行为守则 / product / -
- Issues: type, company
- Confidence: 0.3
- Claims: CL-0048ea0ed4a5e659, CL-1382a007ab508203, CL-5b441ac110766c08
- Rationale: 条目被归类为产品，但证据显示这是一份由欧盟委员会发布的《行为守则》（Code of Practice），更像是一份政策文件或指南，而非通常意义上的产品。没有证据表明任何公司发布、开发或拥有该守则。需要进一步审查其类型和归属。

### Air 3 (EN-14754db7f1439c88)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Air 3 / product / 科大讯飞
- Issues: company
- Confidence: 0.9
- Claims: CL-092fa3ba898c9332, CL-122d5452e326e7e0, CL-a46da6f2ae0481e9
- Rationale: 证据明确显示“科大讯飞”发布了“智能办公本 Air 3 系列”，且引文直接提到“科大讯飞推出了新一代智能办公本 Air 3 系列产品”。因此，当前公司列表为空，应补充为“科大讯飞”。

### Akrites (EN-88a9157d1b3e66ae)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Akrites / product / -
- Issues: type, company
- Confidence: 0.4
- Claims: CL-02ff9cbe615696e5, CL-3497137323547849, CL-c77cb7816ce8025c
- Rationale: 证据显示Akrites是一个由Linux基金会联合多家公司推出的“项目”，旨在保护开源软件。它更像一个开源项目或倡议，而非单一公司发布的产品。没有证据表明任何一家公司单独拥有或发布它。需要审查其类型和归属。

### Android 17 (EN-e0bab6f6c58bfe4e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Android 17 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-2d3d4cf25f483fee, CL-9ca1813b0e901145, CL-524ffc470ce7246d
- Rationale: 证据显示Android 17是谷歌推送的操作系统版本，属于产品。但没有任何一条Claim明确声明谷歌是Android 17的开发者或所有者，仅提及“谷歌推送”和“搭载于谷歌Pixel设备”，不足以证明所有权归属，因此公司字段留空。

### Artemis (EN-2f00e6c060e01051)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Artemis / product / Kore.ai
- Issues: company
- Confidence: 0.95
- Claims: CL-7f46f6606ae2343d, CL-aa3414767466f37f, CL-e1505fc42fbdf511
- Rationale: 多条Claim明确说明Kore.ai推出了Artemis平台，且描述为“Kore.ai Agent Platform Artemis edition”，直接表明Kore.ai是开发者和所有者，产品类型为平台产品，公司归属明确。

### Asian AI (EN-b50e6e7659f1018e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有Claim中“Asian AI”仅作为描述性短语出现（如“Asian AI startups”），并非一个具体产品名称。没有任何Claim将“Asian AI”定义为一个产品、公司或实体，无法确认其存在或类型。

### ASRock Claw Quickset (EN-aa70ef0a3cae0638)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ASRock Claw Quickset / product / 华擎
- Issues: company
- Confidence: 0.95
- Claims: CL-767c6e27f18d910a, CL-97c9b12f91823925, CL-a6b0029076353c91
- Rationale: 多条Claim明确说明华擎推出了ASRock Claw Quickset桌面工具，华擎是发布者，产品类型为桌面工具，公司归属明确。

### ASRs. Our main finding is (EN-96ec1b8a414d3a4e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的Claim中“ASRs. Our main finding is”是研究结果中的片段，并非产品名称，且无任何Claim表明该实体是产品、由某公司发布或拥有。

### AstraBrain-WBC 0.5 (EN-0d049cd1e9f619f9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AstraBrain-WBC 0.5 / product / 银河通用
- Issues: company
- Confidence: 0.95
- Claims: CL-2d9c0183892f925c, CL-3166c56a9815c0ee, CL-8a246deb4a52a8fa
- Rationale: Claim明确提到“银河通用发布AstraBrain-WBC 0.5”，表明该产品由银河通用发布，应补充公司名称。

### Auto-review (EN-b7efc8f24f2e2358)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Auto-review / product / Cursor
- Issues: company
- Confidence: 0.95
- Claims: CL-27edd7de05c58272, CL-421f045aefa19028
- Rationale: Claim明确提到“Cursor推出Auto-review”，表明该产品由Cursor发布，应补充公司名称。

### Autonomous Service Workforce (EN-33a6331aaa822714)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Service Workforce / product / Zendesk
- Issues: company
- Confidence: 0.95
- Claims: CL-063e57d74686a010
- Rationale: Claim明确提到“Zendesk推出自主服务团队（Autonomous Service Workforce）”，表明该产品由Zendesk发布，应补充公司名称。

### Autonomous Worker Agents for (EN-a9f74d68b2b7c964)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Worker Agents for / product / Harness
- Issues: name, company
- Confidence: 0.9
- Claims: CL-8d7813f50efd79be
- Rationale: Claim提到“Harness推出Autonomous Worker Agents for software delivery”，但当前名称末尾“for”不完整，且应补充公司名称Harness。

### AutoPilot (EN-c141d2237427f30d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AutoPilot / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-f4fdde2db1597bc8
- Rationale: Claim提到微软计划推出名为“AutoPilot”的AI智能体，表明该产品由微软发布，应补充公司名称。

### AWS Marketplace (EN-f5b119e89624f88e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 无任何声明证明AWS Marketplace由某公司发布、开发或运营；仅提及SambaNova在其上发布平台，属平台提及，不构成所有权证据。

### Baichuan-M4 (EN-86acdf589a6723d5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Baichuan-M4 / product / 百川智能
- Issues: company
- Confidence: 0.9
- Claims: CL-6b51fd7d11260cbc
- Rationale: 声明明确百川智能联合清华发布Baichuan-M4，表明百川智能是发布方，应列为当前公司。

### Bessemer Venture Partners (EN-ea49a9968098499a)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称Bessemer Venture Partners为投资机构，但证据中无任何声明证明其为产品；所有声明均为文章内容，不涉及产品发布或所有权。

### BitCPM-CANN (EN-54ef981ab82586b5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: BitCPM-CANN / product / 面壁智能
- Issues: company
- Confidence: 0.9
- Claims: CL-820aed390dfd9d67
- Rationale: 声明面壁智能联合清华等发布BitCPM-CANN，面壁智能为主要发布方，应列为当前公司。

### Blog (EN-fbe26af59be95e52)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称Blog为通用词，证据中仅提及AWS Open Source Blog，无任何声明证明Blog是产品、由某公司发布或拥有。

### Bonsai 27 (EN-03e2a9d18916f7c5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Bonsai 27 / product / PrismML
- Issues: company
- Confidence: 0.9
- Claims: CL-86b22b342fb297d9
- Rationale: 声明PrismML公司宣布推出Bonsai 27B模型，表明PrismML是发布方，应列为当前公司。

### Booster T2 (EN-c4ef31845ea79710)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Booster T2 / product / 加速进化
- Issues: company
- Confidence: 0.95
- Claims: CL-0aca511b9b7dd59f, CL-297221466f1efecf
- Rationale: 声明加速进化发布Booster T2具身开发旗舰平台，明确加速进化为发布方，应列为当前公司。

### BrainCo (EN-dbd6a2f6ddb95ca7)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中BrainCo强脑科技是公司名称，但当前条目列为产品且无公司归属，无明确证据证明其为产品。

### Build 2026 (EN-cf49fab26fe3c4a1)

- Decision: insufficient_evidence
- Current type / company: product / Microsoft
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中Build 2026是微软开发者大会名称，非产品发布，无证据支持其为产品。

### Canaries Dashboard (EN-a48d2a42132217d6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Canaries Dashboard / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-bbfbda35db3ee3c5
- Rationale: 证据显示ADP与斯坦福联合推出Canaries Dashboard，但当前无公司归属，需补充公司信息。

### Capabilities for Production (EN-b937d305ea1f064f)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中Capabilities for Production是DigitalOcean发布的功能描述，非独立产品名称，无明确产品定义。

### Central To Simplify Funding (EN-5f863a922cd1bc75)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Central To Simplify Funding / product / -
- Issues: company, evidence
- Confidence: 0.3
- Claims: CL-ea4ce0d501f5281e, CL-1c574a247ac0f458, CL-d1030a8a497aaa2c
- Rationale: 名称'Central To Simplify Funding'看起来像是一个功能描述或短语，而非明确的产品名称。证据中提及AWS在合作伙伴中心推出AI代理，但未明确声明该名称是一个产品，也未指明其所属公司。无法确认该名称是产品，且缺乏所有权证据。

### CEO Thomas Dohmke (EN-45cbca5f78f1ef44)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Thomas Dohmke / company / -
- Issues: name, type
- Confidence: 0.8
- Claims: CL-7f1ee7bec414a00d, CL-b967f75e7c42d240, CL-bbe3b5838db213f3
- Rationale: 当前名称'CEO Thomas Dohmke'是一个人物头衔加姓名，而非产品。证据显示Thomas Dohmke是前GitHub CEO，并创立了公司'Entire'。因此该实体应归类为公司，名称应为'Entire'或'Thomas Dohmke'（作为创始人）。但证据未明确给出公司名称'Entire'作为canonical_name，故提出修正候选。

### Chinese AI (EN-cf5378a2305a999f)

- Decision: correction_candidate
- Current type / company: product / MiniMax
- Proposed: MiniMax / company / -
- Issues: name, type
- Confidence: 0.9
- Claims: CL-5b1c1ec9e1d977ba, CL-837ef054f32e38ca, CL-bdf2be420c647faa
- Rationale: 名称'Chinese AI'是一个描述性短语，而非产品名称。证据中提及'Chinese AI startup MiniMax'，表明MiniMax是一家公司，而非产品。当前类型为产品，但证据支持其应为公司。建议将名称改为'MiniMax'，类型改为公司。

### Chrome (EN-e1a4e41919f7c2dc)

- Decision: correction_candidate
- Current type / company: product / Microsoft
- Proposed: Chrome / product / Google
- Issues: company
- Confidence: 0.7
- Claims: CL-70922a7ba521886f, CL-0b370d47531a1859, CL-70535c622b3df059
- Rationale: 名称'Chrome'是明确的产品名称。但当前公司名称为'Microsoft'，而证据中提及'谷歌Chrome浏览器'，暗示Chrome属于Google。现有关系显示Microsoft发布Chrome，但证据未明确支持Microsoft拥有或发布Chrome。根据常识，Chrome通常由Google开发，但仅凭现有证据无法确认。建议修正公司为'Google'，但需进一步证据。

### Claude Code v2.1.193 (EN-774251f8d6e46d3d)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Claude Code v2.1.193 / product / Anthropic
- Issues: evidence
- Confidence: 0.95
- Claims: CL-328a54cce2445303, CL-6d1c28eb85de7256, CL-70a2d985e6abce68
- Rationale: 产品名称明确，类型为产品。Claim CL-328a54cce2445303、CL-6d1c28eb85de7256、CL-70a2d985e6abce68 均描述产品发布事件，但CL-919fe14a95c35c04不在提供的Claim列表中，已排除。当前公司名称Anthropic由已验证关系支持。

### Claude Code v2.1.198 (EN-8218ed4e007b0ad1)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Claude Code v2.1.198 / product / Anthropic
- Issues: evidence
- Confidence: 0.95
- Claims: CL-3cf1d0d1a1f86ff3, CL-61227cdf9b53be75, CL-1f7d823bb7872786
- Rationale: 产品名称明确，类型为产品。Claim CL-3cf1d0d1a1f86ff3、CL-61227cdf9b53be75、CL-1f7d823bb7872786 均描述产品发布事件，但CL-ea8d581916c7ec4b不在提供的Claim列表中，已排除。当前公司名称Anthropic由已验证关系支持。

### Claude Code v2.1.202 (EN-85a7b756f3a700d0)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Claude Code v2.1.202 / product / Anthropic
- Issues: evidence
- Confidence: 0.95
- Claims: CL-67001824539d7679, CL-709283621618c805, CL-00e119907c3e5b48
- Rationale: 产品名称明确，类型为产品。Claim CL-67001824539d7679、CL-709283621618c805、CL-00e119907c3e5b48 均描述产品发布事件，但CL-b4ec1c96ecd4804e不在提供的Claim列表中，已排除。当前公司名称Anthropic由已验证关系支持。

### Claude Code v2.1.203 (EN-40bad8003c5ee358)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Claude Code v2.1.203 / product / Anthropic
- Issues: evidence
- Confidence: 0.95
- Claims: CL-64772a58ba191af1, CL-1610d540de36d81d, CL-3666845c0cf3e786
- Rationale: 产品名称明确，类型为产品。Claim CL-64772a58ba191af1、CL-1610d540de36d81d、CL-3666845c0cf3e786 均描述产品发布事件，但CL-7c45c9b9e2b3573f不在提供的Claim列表中，已排除。当前公司名称Anthropic由已验证关系支持。

### Claude Mythos (EN-b8c236d640d6a5fb)

- Decision: requires_review
- Current type / company: product / OpenAI, Anthropic
- Proposed: Claude Mythos / product / Anthropic
- Issues: company
- Confidence: 0.7
- Claims: CL-6efbc9da742294ac, CL-36ad8dab40651f22
- Rationale: 声明显示Anthropic发布Mythos-class模型，但OpenAI仅作为竞争对手提及，无所有权证据。当前公司列表含OpenAI需审查。

### Claude Science on Tuesday (EN-bb5b6487f881bbb1)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Claude Science / product / Anthropic
- Issues: name
- Confidence: 0.9
- Claims: CL-262b9c1886051391, CL-4ba1eb0e0182bccd
- Rationale: 声明中产品名称为Claude Science，'on Tuesday'是发布日描述而非产品名。建议修正为Claude Science。

### ClaudeFable 5 (EN-08013bb0b80d23f7)

- Decision: requires_review
- Current type / company: product / -
- Proposed: ClaudeFable 5 / product / -
- Issues: company, evidence
- Confidence: 0.5
- Claims: CL-2665cddb1fb8782d, CL-65dfe7a9e21cf457
- Rationale: 声明提及Anthropic推出ClaudeFable 5，但当前公司列表为空，且声明中subject为undisclosed_subject，需审查公司归属。

### Clive Chan (EN-da20c5952dba19d8)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: Clive Chan / person / -
- Issues: type, company
- Confidence: 0.95
- Claims: CL-3d14375d56b4f1cb, CL-751e56462533bd02, CL-8d37b1ffa4580b30
- Rationale: 所有证据均描述Clive Chan为OpenAI芯片团队元老，是个人而非产品。无任何证据表明其为产品、服务或平台。当前记录错误归类为产品，且关联公司OpenAI不适用。

### Cloud Marketplace (EN-2aae0de3f5530f08)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 条目类型为产品，但提供的声明仅提及DataRobot AI Cloud在Google Cloud Marketplace上线，未明确说明“Cloud Marketplace”本身是由哪家公司开发、发布或运营的产品。声明中的“Google Cloud Marketplace”是平台名称，而非被审计的产品。无任何声明证明该产品的所有权或公司归属，因此证据不足。

### Code (EN-7ec0224e483d913b)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 当前证据仅提及“Claude Code”和“Anthropic”，但未明确声明Anthropic发布、开发或拥有名为“Code”的产品。产品名“Code”与引用中的“Claude Code”不一致，无法确认归属。

### Codex (EN-1ecf93c539fcffca)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 证据仅提及“OpenAI Codex”和“OpenAI”，但未明确声明OpenAI发布、开发或拥有名为“Codex”的产品。产品名“Codex”与引用中的“OpenAI Codex”不完全一致，且无直接所有权声明。

### ColorOS 16 (EN-c38c7d20347bd908)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ColorOS 16 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-283a5aa2f1f1aab3, CL-ae48434223721c51, CL-da4f064dea42dff9
- Rationale: 产品名称为ColorOS 16，证据显示OPPO发布更新，但未提供明确声明OPPO开发或拥有该产品的Claim，无法确认公司归属。

### Compact (EN-9dde0c2d375060f6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 产品名称为Compact，但证据中仅描述Supermicro推出紧凑节能系统，未明确将Compact作为产品名称，且无Claim证明Compact是具体产品。

### Company Announcement (EN-1943e48082f97bd6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 产品名称为Company Announcement，但证据均为IBM研究报告，未提及任何名为Company Announcement的产品，无法确认其为产品。

### Composer 2.5 (EN-ba1269449ab76537)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Composer 2.5 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-02ec1f669993f2f4, CL-1cefd5ca06db9785, CL-9a143b175e97cc12
- Rationale: 产品名称为Composer 2.5，证据显示Cursor发布该产品，但无Claim明确Cursor拥有或开发Composer 2.5，无法确认公司归属。

### Connect AI Developer Edition (EN-a250ebc1862540b0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Connect AI Developer Edition / product / CData
- Issues: company
- Confidence: 0.9
- Claims: CL-259b0862836da331, CL-df197344e8d4a1cf, CL-5d5b2ddeffe666f7
- Rationale: 产品名称为Connect AI Developer Edition，证据明确显示CData推出该产品，且CData首席产品官提及发布，公司归属明确。

### Continuum (EN-02bb4eeba3bde980)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Continuum / product / AWS
- Issues: company
- Confidence: 0.9
- Claims: CL-0cc7e31523493be6, CL-24c0c5e4ec909641, CL-a5a3a28dc159637e
- Rationale: 产品名称为Continuum，证据显示AWS推出Continuum和Context两项新服务，明确AWS发布该产品，公司归属明确。

### Control Plane (EN-049e948563e03e97)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 产品名称为Control Plane，但证据全部关于Upbound推出的Modelplane，未提及Control Plane作为产品名称，无法确认该实体。

### CoreAI (EN-dd920a8cd166f486)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: CoreAI / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-18d554f72c3e47aa, CL-c219014c38d3e963
- Rationale: 证据提到“苹果推出CoreAI引擎”，但当前公司名称为空。证据支持苹果发布该产品，应补充公司名称。

### Cowork on Monday (EN-a18162bf7228289d)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: Cowork / product / Anthropic
- Issues: name
- Confidence: 0.9
- Claims: CL-df0a3aadcfe5c2a3
- Rationale: 证据中产品名称为“Cowork”，而非“Cowork on Monday”。“on Monday”是发布时间的描述，非产品名称组成部分。建议修正为“Cowork”。

### Creator Studio (EN-05644efc4f4a9f67)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Creator Studio / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-2204de91346ffc61, CL-31af81a492f0ce43, CL-49047465cc27fd44
- Rationale: 证据明确“Facebook推出...Creator Studio”，但当前公司名称为空。证据支持Facebook发布该产品，应补充公司名称。

### DeepSeek-V3.2 (EN-a8109a87003a555b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DeepSeek-V3.2 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-5a081faed20b82a3, CL-b7c9aaf6b3960b34, CL-e81a5774adbdcf76
- Rationale: 名称明确为模型产品，证据显示腾讯云提供该模型服务，但无明确声明腾讯云开发或拥有该模型，无法确认公司归属。

### DeepSeek-V4 (EN-9fd74b87b71e744a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DeepSeek-V4 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-0c746843d3400533, CL-957c52a5e90b0909, CL-a3b6aba8f727f6b7
- Rationale: 名称明确为模型产品，证据提及腾讯云提供该模型，但无声明腾讯云拥有或开发该模型，公司归属证据不足。

### Dev (EN-73209317ae64f32b)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称'Dev'过于泛化，证据中未明确提及该名称对应的具体产品或公司，无法确认其类型和归属。

### Dev Tools Companies (EN-210c1cad011e5afb)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称'Dev Tools Companies'为类别描述而非具体产品，证据中未提及该名称对应的实体，无法确认。

### DevEco Code (EN-b42e5eda1d1a3720)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DevEco Code / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-8a3a1df8c7e68443, CL-d5c691aa90e23d0e, CL-e217215d444c80bc
- Rationale: 名称明确为华为发布的AI工具产品，证据显示华为发布该产品，但未明确声明华为拥有或开发该产品，公司归属需进一步确认。

### Elements Claw (EN-94caa859c22071b1)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Elements Claw / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-64369a09ca7e9385, CL-ae24dc6d66a8f1d1, CL-dce7f3ddb3fd068e
- Rationale: 名称明确为AI智能体产品，证据显示阿里达摩院发布该产品，但未明确声明阿里达摩院拥有或开发该产品，公司归属需进一步确认。

### Enterprise Deployment Scales (EN-ba68e0d45eda3690)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据均为IBM研究报告标题或摘要，未提及名为“Enterprise Deployment Scales”的产品，无法确认其为产品。

### Enterprise IT (EN-e466d31379abfeeb)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中“Enterprise IT”仅为描述性短语，未作为产品名称出现，无法确认其为产品。

### ER939-AI Pro AI (EN-908c564e03e36ecc)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ER939-AI Pro AI / product / MINIX
- Issues: company
- Confidence: 0.95
- Claims: CL-1619d19bfb89e437, CL-2dfe2a5e12ed9d33
- Rationale: 证据明确显示MINIX推出了名为ER939-AI Pro的硬件产品，支持产品-公司映射。

### EVO-X3 (EN-790b8bc0b57d7a37)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: EVO-X3 / product / 极摩客
- Issues: company
- Confidence: 0.95
- Claims: CL-0993390da9398403, CL-a4bafacf7d7e205d
- Rationale: 证据明确显示极摩客发布了EVO-X3迷你主机，支持产品-公司映射。

### F4-425 Pro (EN-ae830c95cd553df8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: F4-425 Pro / product / 铁威马
- Issues: company
- Confidence: 0.95
- Claims: CL-0a4b1d772329b67a, CL-9df3af02ba89a94b
- Rationale: 证据明确显示铁威马推出了F4-425 Pro NAS产品，支持产品-公司映射。

### Fable (EN-34ec8666daf7b665)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.3
- Claims: CL-9f1b6e3dd0c30068
- Rationale: 证据中“Fable”被提及为Anthropic的模型，但名称不完整（应为Fable 5），且当前无公司映射，需进一步确认。

### Fable 5 (EN-9f15bb7e29e191eb)

- Decision: correction_candidate
- Current type / company: product / OpenAI, Anthropic
- Proposed: Fable 5 / product / Anthropic
- Issues: company
- Confidence: 0.9
- Claims: CL-022ff08fc8204a5e, CL-0c2d8eedf393ff6e, CL-0dfe28151e772826
- Rationale: 证据明确显示Anthropic发布了Claude Fable 5，但当前公司列表包含OpenAI，应移除OpenAI，仅保留Anthropic。

### Fastest Growing Open Source (EN-3b8ce17ae22357b6)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'Fastest Growing Open Source'是描述性短语，非产品名；证据未提及任何公司发布该产品。

### Featherless.ai (EN-ce31f92c521b7b08)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Featherless.ai / company / -
- Issues: type
- Confidence: 0.9
- Claims: CL-4a7aba5c5b345c7d, CL-4d3226bfb67eac47, CL-5e39cfad058f0146
- Rationale: 证据明确描述Featherless.ai为一家公司（获融资、创始人、平台），应归类为公司而非产品。

### First Enterprise AI Trust (EN-26ea860e3f994da6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: First Enterprise AI Trust / product / OpenBox AI
- Issues: company
- Confidence: 0.85
- Claims: CL-3265eaa722ce0cd3, CL-4025bb89e730bc8a, CL-5c9136b4d8345f5e
- Rationale: 证据显示OpenBox AI推出企业AI信任平台，应归属OpenBox AI而非空公司。

### First Governed AI Workforce (EN-9e51ca48d5ecf16f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: First Governed AI Workforce / product / Atomicwork
- Issues: company
- Confidence: 0.85
- Claims: CL-03d4dea4c9bf0564, CL-55d4c2c5a74b2a19, CL-62501b66860c9002
- Rationale: 证据显示Atomicwork推出受监管AI劳动力平台，应归属Atomicwork而非空公司。

### Flexibility (EN-9f8d56e79c059f04)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称“Flexibility”是通用词汇，证据中仅提及“开源灵活性”，未明确其为产品名称。无任何声明表明该实体由某公司发布、开发或拥有。无法确认其为产品。

### FPC-9309W-G5 (EN-e3a80a99bb5fa250)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: FPC-9309W-G5 / product / 磐仪
- Issues: company
- Confidence: 0.9
- Claims: CL-7088c965de696f86, CL-7321602e8e376ee4, CL-7976fa739a9fd65e
- Rationale: 证据明确显示“磐仪推出强固型边缘AI平台FPC-9309W-G5”，磐仪（ARBOR）是发布公司。当前公司列表为空，应补充为“磐仪”。

### FT.com (EN-d736115a934212d4)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称“FT.com”是新闻网站域名，证据中仅作为新闻来源提及，未表明其为产品。无任何声明表明该实体由某公司发布、开发或拥有。无法确认其为产品。

### Fusion API (EN-779965438dd9e7a7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Fusion API / product / -
- Issues: company
- Confidence: 0.85
- Claims: CL-8baf55396569778e, CL-37bb9b7ce057bacb, CL-73f4cfe9ec18e00c
- Rationale: 证据显示OpenRouter发布Fusion API，但无明确声明OpenRouter拥有或开发该产品，无法确认公司归属。

### Gemini API (EN-a6f1623a1e5232a6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini API / product / -
- Issues: company
- Confidence: 0.85
- Claims: CL-21d206ae86a7b6eb, CL-3cad9a139bae62ba, CL-80619fd5e25eabb6
- Rationale: 证据显示Google Deepmind为Gemini API添加功能，但无明确声明Google Deepmind拥有或开发该API，无法确认公司归属。

### Gemini Spark (EN-307557d99a7eb726)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Spark / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-b000143fed6c52d3, CL-b0dab5d514b2d3a0, CL-a06e131db75a6c1d
- Rationale: 证据提及谷歌AI智能体Gemini Spark，但无明确声明谷歌拥有或开发该产品，无法确认公司归属。

### GeneBench-Pro (EN-65ef4539bbcbe9fc)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明显示OpenAI推出GeneBench-Pro基准测试，但未明确说明OpenAI开发、拥有或运营该产品，无法确认产品-公司归属。

### GenFlow (EN-33ea25778e18d372)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提到百度文库、网盘升级GenFlow，但未明确说明百度开发、拥有或运营GenFlow产品，无法确认归属。

### German AI (EN-aaf5dd513fc95bd5)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提到German AI consortium发布Soofi S模型，但未明确说明German AI是一个公司实体，且无证据表明German AI是产品名称。

### GLM-5.2 (EN-bc1fc5140040180e)

- Decision: requires_review
- Current type / company: product / SGLang
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.3
- Claims: CL-fe19ca104837cb24, CL-5f21324ca48bdbb5, CL-9565270c2ee6db60
- Rationale: 声明提到LMSYS与SGLang团队为GLM-5.2做优化，但未明确SGLang开发或拥有GLM-5.2，且智谱AI是模型发布方，当前公司映射可能错误。

### GLM-5.2 NVFP4 (EN-64c4e740f32911e8)

- Decision: requires_review
- Current type / company: product / SGLang
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.3
- Claims: CL-28348c4fe65170b5, CL-fe19ca104837cb24, CL-5f21324ca48bdbb5
- Rationale: 声明显示LMSYS与SGLang团队为GLM-5.2 NVFP4提供推理优化，但未明确SGLang开发或拥有该产品，当前公司映射可能错误。

### GPT-2 (EN-f696d5fb767e377c)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明讨论GPT-2的历史和OpenAI的发布决策，但未提供明确声明证明当前产品-公司归属关系。

### GPT-5.5 (EN-62ce3c1a5a893a2c)

- Decision: requires_review
- Current type / company: product / SpaceX, Moonshot AI
- Proposed: GPT-5.5 / product / SpaceX, Moonshot AI
- Issues: company, evidence
- Confidence: 0.6
- Claims: CL-95f44cb09829ce61, CL-a93154756285b513, CL-7df93efc4a64cc9c
- Rationale: 条目列为产品，名称合理。但关联的SpaceX和Moonshot AI的发布关系所引用的声明中，CL-8e0772ef6fe2fd0e不在提供的证据列表中，无法验证该声明内容。剩余声明仅提及GPT-5.5名称，未明确证明SpaceX或Moonshot AI发布/拥有该产品，需进一步审查。

### GPT-5.6 amid US AI regulatory drama (EN-272d6a7a0db89710)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: GPT-5.6 / product / OpenAI
- Issues: name
- Confidence: 0.85
- Claims: CL-b73a154303e7df28, CL-aa36bdc799c098b9, CL-cf8700ceac9a5e1e
- Rationale: 当前名称'GPT-5.6 amid US AI regulatory drama'包含新闻标题式描述，非标准产品名。声明中均称'GPT-5.6'，建议修正为'GPT-5.6'。OpenAI发布关系证据充分。

### GPT-Bidi-1 AI (EN-f2272e70be63bc65)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: GPT-Bidi-1 / product / OpenAI
- Issues: name, duplicate
- Confidence: 0.8
- Claims: CL-6d0e84f3ec701d54, CL-8487e3e6cecb0a37, CL-5c0db6d40d137cb2
- Rationale: 当前名称'GPT-Bidi-1 AI'与EN-b269456229397ef3的'GPT-Bidi-1'高度重复，声明中均称'GPT-Bidi-1模型'，建议合并或修正为'GPT-Bidi-1'。OpenAI发布关系证据充分。

### Grok (EN-1a254d17cfa54b16)

- Decision: requires_review
- Current type / company: product / xAI
- Proposed: Grok / product / xAI
- Issues: company, evidence
- Confidence: 0.5
- Claims: CL-34ad279d62cf4bdc, CL-1fb492b260514e14, CL-77833569bd63ddac
- Rationale: 产品名称合理。但关联的xAI发布关系所引用的声明中，CL-78afe1659d3c2512不在提供的证据列表中。剩余声明提及'SpaceXAI'而非xAI，且未明确证明xAI拥有或发布Grok，需进一步审查。

### H200 NVL (EN-a2413f7c5095f988)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 声明仅提及Supermicro支持NVIDIA H200 NVL平台，但未明确说明H200 NVL是NVIDIA的产品，也未提供任何公司发布或拥有该产品的直接证据，无法确认所属公司。

### Help Customers (EN-151013fb8438c046)

- Decision: requires_review
- Current type / company: product / Google
- Proposed: Help Customers / product / Google
- Issues: name, evidence
- Confidence: 0.3
- Claims: CL-7a420af6eefcd3e0, CL-6ffa953da2d8fbdc, CL-e33e9cde13a8d5ca
- Rationale: 声明描述的是家得宝与谷歌云合作推出的AI工具，但产品名称“Help Customers”可能为描述性短语而非正式产品名，且声明未明确谷歌单独发布该产品，当前关系可能不准确，需进一步审查。

### Hermes (EN-0db2d631b42da133)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hermes Agent / product / Nous Research
- Issues: name, company
- Confidence: 0.8
- Claims: CL-a9e6156c1a1a2462, CL-7bac82227b837b4a
- Rationale: 声明明确Hermes Agent是Nous Research的开源个人代理，当前条目名称为“Hermes”可能不完整，且缺少所属公司信息，建议修正为“Hermes Agent”并添加公司“Nous Research”。

### Hermes Agent Profile Builder (EN-c18179b68329b054)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hermes Agent Profile Builder / product / Nous Research
- Issues: company
- Confidence: 0.8
- Claims: CL-df4e79b3ca7d8bd6
- Rationale: 声明中Nous Research发布Hermes Agent Profile Builder，当前条目缺少所属公司，建议添加“Nous Research”。

### HiCar 7.0 (EN-24381ecb01753c1b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HiCar 7.0 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-130338c5508e70c3, CL-c61188c3b5bb06e7, CL-dc99caf32a5e5bbf
- Rationale: 证据显示华为发布HiCar 7.0，但未提供明确声明证明华为是开发者或所有者，仅提及发布事件，无法确认公司归属。

### HKGAI V3 (EN-67c6738648b7e247)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HKGAI V3 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-11286782f3bae1b7, CL-bf1077c26c75a457, CL-c2adf9ebcc1b916a
- Rationale: 证据显示HKGAI发布V3模型，但HKGAI是研发中心名称而非公司实体，且未提供明确公司所有权声明。

### Home (EN-6470c8584a9d35d3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Home / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-4b9e08f54f2d9d06, CL-a0448403eafbb56a, CL-d1420643b5c6f063
- Rationale: 证据显示谷歌推出Google Home智能音箱，但产品名称为'Google Home'而非'Home'，且未提供明确所有权声明。

### Home 6 (EN-3546e1b15e6549b2)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Home 6 / product / -
- Issues: company
- Confidence: 0.6
- Claims: CL-2a52a0c41ab1b678, CL-480417c449ba510c, CL-794c5c61fddce842
- Rationale: 证据提及Google Home功能更新，但'Home 6'可能指版本号而非产品名，且未提供公司所有权声明。

### Hot French (EN-5bd0203f18d83c93)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中'Hot French'是描述性短语而非产品名称，引用内容指ZML公司发布产品，但未提供明确产品名称为'Hot French'的声明。

### How-to (EN-242e21e3dc6869a9)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: How-to / product / Google
- Issues: name
- Confidence: 0.8
- Claims: CL-7a420af6eefcd3e0, CL-6ffa953da2d8fbdc, CL-e33e9cde13a8d5ca
- Rationale: 证据显示家得宝与谷歌云合作推出AI工具，但'How-to'是项目描述而非产品名称，且现有关系已验证谷歌发布该产品。

### Hugging Face (EN-d9352ce019e77ab3)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中'Hugging Face'是公司/平台名称而非产品，引用内容涉及博客发布和开源现状，未提供任何产品名称为'Hugging Face'的声明。

### Hy3 (EN-be1a3c9420d88ea5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Hy3 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-3a8619e7c67dab96, CL-8aab7b79006b4541, CL-f213f8f529bbde36
- Rationale: 证据显示腾讯混元发布并开源Hy3模型，但未提供明确声明证明腾讯是开发者或所有者，仅提及发布事件。

### Increased (EN-9eb42ffb4942bcc2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'Increased'是普通动词，无任何声明将其作为产品发布或归属。所有声明仅描述研究结果中的'增加'现象，无法确认其为产品。

### Inference Engine (EN-4540952d4d9138db)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Inference Engine / product / DigitalOcean
- Issues: company
- Confidence: 0.95
- Claims: CL-5136009817417e5e, CL-cd1bb6a16dd0b1ea, CL-15727e9bf33985fa
- Rationale: 声明明确DigitalOcean推出Inference Engine，属于产品发布，确认DigitalOcean为开发/发布方。

### Inference Era (EN-2a817d99285e12c4)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'Inference Era'是描述性短语，声明中仅作为'for the Inference Era'的修饰语，未作为独立产品名称发布。无证据表明其为产品。

### Intelligent Terminal (EN-f8ceb65dd1764cd4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Intelligent Terminal / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-7b3da75ee3eee173, CL-e1c4bb634f348b94, CL-fff01b9449a39855
- Rationale: 声明标题和内容均提及微软推出Intelligent Terminal，描述为Windows Terminal的AI分支，确认微软为发布方。

### Introduces Compact (EN-56ee86045cfb0ddd)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 名称'Introduces Compact'是动词短语，声明中仅作为标题的一部分，未作为独立产品名称。无证据表明其为产品。

### Jetson Thor (EN-a1b0d8a938903dc7)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Jetson Thor / product / -
- Issues: company
- Confidence: 0.6
- Claims: CL-34eae2e3cf08f5dd, CL-491026e3b84ada48, CL-bf403f976718f0a9
- Rationale: 证据显示Jetson Thor是NVIDIA的模组，被映泰用于其产品中，但无明确声明NVIDIA是开发者或所有者。当前公司字段为空，需补充。

### Jio Call (EN-a4e7560e8d2b340f)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Jio Call / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-c19527da2838ee4a, CL-1c224d072885b4a9, CL-ed96cc19b0ba7804
- Rationale: 证据提到Jio Call Agent由信实工业发布，但产品名称为'Jio Call'，与'Jio Call Agent'不完全一致，且当前公司字段为空，需确认归属。

### JoyAI-VL-Interaction (EN-a759ee8f6d212de8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: JoyAI-VL-Interaction / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-5800e10426256754, CL-b88429af2de339b9, CL-c1226250de82c608
- Rationale: 证据明确显示京东开源了该模型，但当前公司字段为空，需补充京东为公司。

### K3 (EN-76ac3e702b5ccaff)

- Decision: requires_review
- Current type / company: product / -
- Proposed: K3 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-5ae97e93b6e818fb, CL-ca9f649550e1e44f, CL-d9131a0314310537
- Rationale: 证据显示K3是月之暗面（Moonshot AI）发布的模型，但当前公司字段为空，需补充。

### Karamo Brown (EN-0fc990954c0aea17)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Karamo Brown / product / -
- Issues: name, company
- Confidence: 0.5
- Claims: CL-25e76f88684f5309, CL-291b248f0d0b7be2, CL-98b594285f787add
- Rationale: 证据显示Karamo Brown是个人名，而非产品名；实际产品为健康应用Kē。当前名称和公司字段均需修正。

### Kimi K3 (EN-607964040e4b62e0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Kimi K3 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-2902f31e35790727, CL-8727a77633aa692c, CL-8a46daded90710eb
- Rationale: 证据提及月之暗面发布Kimi K3，但未明确声明所有权或发布关系，公司字段留空。

### Kolibri (EN-e97edd12a2b8befa)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Kolibri / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-3cb5df62219fe339, CL-a43b207dd4369d2b, CL-de9bbea60aae9c26
- Rationale: 证据显示Konecta推出Kolibri平台，但未提供明确所有权声明，公司字段留空。

### LangBuilder (EN-51a5b811990f2a2a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LangBuilder / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-2c92678b9b52b31f, CL-352eef31fe17fd2e, CL-6847cf10caebcfd3
- Rationale: 证据显示LangBuilder是CloudGeometry的平台，但未提供明确所有权声明，公司字段留空。

### Launch FuriosaAI-Powered AI (EN-59fd7e12c890c379)

- Decision: correction_candidate
- Current type / company: product / Samsung SDS
- Proposed: Launch FuriosaAI-Powered AI / product / Samsung SDS
- Issues: name
- Confidence: 0.85
- Claims: CL-f4aef3f955fb2648
- Rationale: 证据显示Samsung SDS推出基于FuriosaAI的服务，但名称'Launch FuriosaAI-Powered AI'更像描述而非产品名，保留原名。

### Launches (EN-77fe4e790d5bc756)

- Decision: insufficient_evidence
- Current type / company: product / Crusoe, FuriosaAI, Google, OpenAI, Microsoft, Anthropic, Meta, Databricks
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称'Launches'为动词片段，非有效产品名；证据中多个公司发布不同产品，无证据表明'Launches'是统一产品。

### Launches AI (EN-e947caedcfbb4b90)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: 名称'Launches AI'为动词短语，非有效产品名；证据仅描述AWS发布AI代理功能，无具体产品名称。

### Launches Artemis (EN-0f714d682ed97e64)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Launches Artemis / product / -
- Issues: name, company
- Confidence: 0.6
- Claims: CL-aa3414767466f37f, CL-e1505fc42fbdf511, CL-2f660c3ed6b51b9c
- Rationale: 证据显示Kore.ai发布Artemis平台，但名称包含'Launches'动词，建议修正为'Artemis'；公司字段无明确所有权声明。

### Launches Autonomous Worker (EN-098a7df7f42ccf8b)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Launches Autonomous Worker / product / Harness
- Issues: name, company
- Confidence: 0.7
- Claims: CL-62e26c367ac42c6a, CL-8d7813f50efd79be, CL-b18f3ef179ab58bf
- Rationale: 规范名称'Launches Autonomous Worker'看起来像是一个事件描述（'推出...'），而非产品名称。证据显示Harness发布了'Autonomous Worker Agents'，但规范名称与产品实际名称不符。证据明确表明Harness是发布方，因此公司映射正确，但名称需要修正。

### Launches Connect AI (EN-b176dfaec25b5143)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Launches Connect AI / product / CData
- Issues: name
- Confidence: 0.7
- Claims: CL-259b0862836da331, CL-5d5b2ddeffe666f7, CL-df197344e8d4a1cf
- Rationale: 规范名称'Launches Connect AI'包含动词'Launches'，更像是新闻标题而非产品名。证据显示CData发布了'Connect AI Developer Edition'等产品，但规范名称不准确。公司映射正确，但产品名称需修正。

### Launches Genie One (EN-9e5d9b729e161734)

- Decision: correction_candidate
- Current type / company: product / Databricks
- Proposed: Launches Genie One / product / Databricks
- Issues: name
- Confidence: 0.8
- Claims: CL-6cb989c70ce83861, CL-ac9f900ccbf46662, CL-3722b23157090c55
- Rationale: 证据明确显示Databricks发布了'Genie One'产品，且当前公司名称已正确映射为Databricks。但规范名称'Launches Genie One'包含动词'Launches'，更像事件标题而非产品名，不过由于已有verified关系，整体可确认。

### Launches Inference Engine (EN-e9b9f3fb5a138cd5)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Launches Inference Engine / product / DigitalOcean
- Issues: name
- Confidence: 0.7
- Claims: CL-5136009817417e5e, CL-15727e9bf33985fa, CL-26c18169ae8fea67
- Rationale: 规范名称'Launches Inference Engine'包含动词'Launches'，更像是新闻标题。证据显示DigitalOcean发布了'Inference Engine'产品，公司映射正确，但产品名称需修正为更准确的产品名。

### Launches Its AI (EN-efe10579b49d54d9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: SambaNova AI Platform / product / SambaNova
- Issues: name, company
- Confidence: 0.95
- Claims: CL-a0dc064228e2280a, CL-05962c7be259e6cd, CL-71a7d4446f823c59
- Rationale: 当前名称'Launches Its AI'是事件描述片段，非产品名。证据中SambaNova发布'AI Platform'，明确表明SambaNova是开发/发布方，应更正产品名称为'SambaNova AI Platform'，并添加公司'SambaNova'。

### Launches Modelplane (EN-9855ef88d183e07b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Modelplane / product / Upbound
- Issues: name, company
- Confidence: 0.95
- Claims: CL-b56b4f9da5ca525d, CL-1ecb85f4fb243eda, CL-7256d1d09d548b37
- Rationale: 当前名称'Launches Modelplane'是事件描述，非产品名。证据中Upbound发布'Modelplane'，明确表明Upbound是开发/发布方，应更正产品名称为'Modelplane'，并添加公司'Upbound'。

### Lean 4 (EN-50fbf46e6eff93e5)

- Decision: requires_review
- Current type / company: product / Mistral AI
- Proposed: Lean 4 / product / Mistral AI
- Issues: type, evidence
- Confidence: 0.6
- Claims: CL-51796767bcae979d, CL-b2ca87455d9c5de5, CL-23c4158d25f76d5c
- Rationale: 证据中Lean 4被描述为编程语言/证明助手，而非Mistral AI发布的产品。Mistral AI发布的是Leanstral 1.5模型，该模型针对Lean 4。当前条目将Lean 4列为产品并关联Mistral AI，但证据不支持Mistral AI开发或发布Lean 4，需人工审查类型和公司映射是否正确。

### LingBot-World 2.0 (EN-7a3ecc54829211df)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LingBot-World 2.0 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-887c5dc7fbee2024, CL-b92e419d7a18dd98, CL-d43100e1d509196e
- Rationale: 证据显示蚂蚁灵波开源该产品，但蚂蚁灵波并非当前公司列表中的实体，无法确认公司归属。

### Llama API (EN-5b76e682643efda7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Llama API / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-fc300cf26339c37e, CL-368028d4325f1c06, CL-60b815ce658fe627
- Rationale: 证据显示Meta运营Llama API，但Meta未出现在当前公司列表中，无法确认归属。

### LongCat-2.0 (EN-8992f4a61a19a74b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: LongCat-2.0 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-3918c79bf6fe9714, CL-8a0fd635b5b314bd, CL-bdc51ac046a759bd
- Rationale: 证据显示美团发布LongCat-2.0，但美团未出现在当前公司列表中，无法确认归属。

### M-Robots OS 2.0 (EN-80ea42a231357d12)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: M-Robots OS 2.0 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-c1f4199a021ea02a, CL-4bb257a6d8170957, CL-53d42ff7b84a2843
- Rationale: 证据显示深开鸿发布M-Robots OS 2.0，但深开鸿未出现在当前公司列表中，无法确认归属。

### MacWhisper 14 (EN-1d77d67a89bfd2c2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有Claim仅描述MacWhisper 14的发布和功能，未提及任何公司名称或所有权关系，无法确认所属公司。

### MacWhisper 14.0 (EN-c02834bd64ce3d10)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有Claim仅提及MacWhisper 14.0更新内容，未指明任何公司名称或所有权，无法确认所属公司。

### Marketplace (EN-d2f4e09cb01afa3c)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有Claim仅描述在Microsoft Marketplace上发布应用，未明确说明Marketplace本身是微软的产品，且无直接所有权声明。

### MattoBoard (EN-45066a1a95a3a0f2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有Claim仅描述MattoBoard的功能和融资，未提及任何公司名称或所有权关系，无法确认所属公司。

### Micro-Industries (EN-2eb073b22916de55)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有Claim仅描述VeltrisOne平台，未提及“Micro-Industries”作为产品名称或所有权，无法确认该实体。

### MiniCPM (EN-12a81529bba89666)

- Decision: requires_review
- Current type / company: product / -
- Proposed: MiniCPM / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-6ec9ec2903819053, CL-e036cc41f39e2bd4, CL-0b9269713872b516
- Rationale: 证据显示面壁智能发布MiniCPM系列模型，但未明确声明面壁智能是开发或拥有该产品的公司。需要进一步确认所有权关系。

### Modelplane (EN-8950d72f381130ac)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Modelplane / product / Upbound
- Issues: company
- Confidence: 0.95
- Claims: CL-1ecb85f4fb243eda, CL-a0a427d0cc34f0ba, CL-b56b4f9da5ca525d
- Rationale: 多条证据明确声明Upbound发布了Modelplane，属于产品发布，公司名称Upbound直接关联。

### Mozilla 2026 (EN-6ac6ad44bb9995ca)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Mozilla 2026 开源 AI 报告 / product / Mozilla
- Issues: name, type
- Confidence: 0.85
- Claims: CL-0ca78d09377de663, CL-1dbd2ede8ecf5a49, CL-55f74a5ffae0e6d8
- Rationale: 证据显示'Mozilla 2026'实际是一份由Mozilla发布的报告（research_result），而非产品。建议更正为报告名称，类型改为产品（报告可视为产品），公司为Mozilla。

### MS-NAT5000 (EN-cb29f2627d5408e0)

- Decision: requires_review
- Current type / company: product / -
- Proposed: MS-NAT5000 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-030aaa8424464499, CL-34eae2e3cf08f5dd, CL-491026e3b84ada48
- Rationale: 证据显示映泰推出MS-NAT5000系统，但未明确声明映泰是开发或拥有该产品的公司。需要确认所有权。

### MuleRun (EN-1725c58362aadc2a)

- Decision: requires_review
- Current type / company: product / -
- Proposed: MuleRun / product / -
- Issues: company
- Confidence: 0.6
- Claims: CL-404e2f09a3ef7471, CL-987b6b91845064eb, CL-b28fcafff0a14b4d
- Rationale: 证据提到阿里巴巴计划整合MuleRun，但未明确声明阿里巴巴开发或拥有该产品。需要进一步确认公司归属。

### MusaCoder (EN-c27c48199bb1e14b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MusaCoder / product / 摩尔线程
- Issues: company
- Confidence: 0.95
- Claims: CL-57cfe19e948589f8, CL-fda9da9b3aa8feed, CL-3cf8b2b77dd0c405
- Rationale: 证据明确声明摩尔线程发布并开源MusaCoder代码大模型，属于产品发布，公司名称直接关联。

### Mythos-like (EN-784c7cd63a83ccaa)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: Mythos-like仅为描述性术语，非正式产品名，无任何公司发布或拥有该产品的直接证据。

### N8L (EN-b3f3ddb837329753)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0.1
- Claims: -
- Rationale: N8L在证据中仅作为车型名称出现，无任何证据表明其为AI产品，也无公司发布或拥有关系。

### Next Developer Platform for (EN-0decbc3b45f73b2b)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 提供的声明中“Next Developer Platform for”是描述性短语，非产品名称；无声明证明其为产品、公司或归属。

### NEXT-GENERATION DATA CENTER (EN-b0eea3ad7b0d0a48)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 无任何声明明确将“NEXT-GENERATION DATA CENTER”定义为产品，也未指明其由某公司发布、开发或拥有。所有声明仅描述CHELSIO的平台面向下一代数据中心，但“下一代数据中心”本身并非产品名称。

### Nexus (EN-c73da23142d2205b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Nexus / product / Slimbook
- Issues: company
- Confidence: 0.95
- Claims: CL-2aaf0fc18ffbfb07, CL-6a57a8710feb8939, CL-c050f1e378d3febe
- Rationale: 声明明确Slimbook推出Nexus系列AI工作站，并详细描述产品配置，确认Nexus为Slimbook发布的产品。

### Nous Research (EN-3969dd578ebf6c65)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Nous Research / company / -
- Issues: type
- Confidence: 0.9
- Claims: CL-e828e0ea08beaf67
- Rationale: 声明中“Nous Research”被描述为一家开源AI初创公司，并发布模型，表明其应为公司而非产品。

### NousCoder-14B (EN-761c4b9294ee43a7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NousCoder-14B / product / Nous Research
- Issues: company
- Confidence: 0.95
- Claims: CL-e828e0ea08beaf67
- Rationale: 声明明确Nous Research发布了名为NousCoder-14B的编程模型，确认其为产品且由Nous Research发布。

### NXT RNGD server (EN-977d20414b3b8be9)

- Decision: correction_candidate
- Current type / company: product / FuriosaAI
- Proposed: NXT RNGD server / product / FuriosaAI
- Issues: duplicate
- Confidence: 0.9
- Claims: CL-0c210509638f5894, CL-8fae10d119f22475, CL-38c8cddac76c3aca
- Rationale: 该条目与EN-5f5fcd8701ab30c0（NXT RNGD）实质为同一产品，仅名称略有差异，建议合并或统一名称。

### Oasis 3 (EN-94ff75465b1afa65)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Oasis 3 / product / Decart
- Issues: company
- Confidence: 0.95
- Claims: CL-5c92ec7ee55a3124, CL-62260e499c34fefe, CL-040f0a847e88c69d
- Rationale: 声明明确Decart发布Oasis 3世界模型，确认产品名称及所属公司。

### OCR 4 (EN-2c2a76216a876127)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: OCR 4 / product / Mistral
- Issues: company
- Confidence: 0.95
- Claims: CL-8db6e572caff04f0, CL-e93ecebce51681b4
- Rationale: 声明明确Mistral AI发布OCR 4模型，确认产品名称及所属公司。

### Office (EN-26e4951af4490c21)

- Decision: requires_review
- Current type / company: product / Kingsoft Office, xAI
- Proposed: Office / product / Kingsoft Office, xAI
- Issues: company, evidence
- Confidence: 0.6
- Claims: CL-34ad279d62cf4bdc, CL-78afe1659d3c2512, CL-77833569bd63ddac
- Rationale: 当前公司名包含Kingsoft Office和xAI，但证据中仅提及微软Office和SpaceXAI扩展，未明确证明Kingsoft Office或xAI拥有或发布该产品。需进一步核实所有权。

### One-Stop Shop (EN-efd004603fda1d53)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0.1
- Claims: -
- Rationale: 证据中'One-Stop Shop'仅为AWS市场功能的描述性短语，未明确作为产品名称发布，且无公司所有权声明。

### Open Source (EN-202ac21492470b79)

- Decision: requires_review
- Current type / company: product / Microsoft
- Proposed: Open Source / product / Microsoft
- Issues: name, evidence
- Confidence: 0.4
- Claims: CL-8db9327ffefca608, CL-785b4a16eb92e436, CL-d1d802757ac20e21
- Rationale: 规范名称'Open Source'过于泛化，可能非具体产品。证据中提及Microsoft发布Agent Governance Toolkit，但未明确该工具名为'Open Source'，需确认产品名称。

### Open Source Flexibility (EN-979ed4c1e4eb3a04)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0.1
- Claims: -
- Rationale: 'Open Source Flexibility'为描述性短语，非具体产品名称，证据中未将其作为独立产品发布。

### Open Source TypeScript AI (EN-feecb1b1adc8584d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0.1
- Claims: -
- Rationale: 'Open Source TypeScript AI'为描述性短语，证据中提及VoltAgent框架，但未明确该短语为产品名称，且无公司所有权声明。

### OpenCode (EN-b644c0a9d493976a)

- Decision: requires_review
- Current type / company: product / Xiaomi
- Proposed: OpenCode / product / Xiaomi
- Issues: company, evidence
- Confidence: 0.5
- Claims: CL-56f2e0c1154392a0, CL-5a36ba36f10f70be, CL-74848e2afb65c933
- Rationale: 证据显示小米基于OpenCode二次开发MiMo Code，但未明确小米拥有或发布OpenCode本身。OpenCode可能为第三方开源项目，需确认所有权。

### Optimized Systems Supporting (EN-c165c006a5968443)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据均为Supermicro扩展GPU优化系统的描述，未提供任何明确声明证明“Optimized Systems Supporting”是一个独立产品名称，该名称更像是描述性短语而非产品名，无法确认其类型或归属。

### PerceptionBench (EN-d831f1170590ddb1)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有声明均描述 PerceptionBench 是一个基准测试（benchmark），未明确说明其是产品（product）或由某公司发布、开发、制造、运营或拥有。声明中 Moonshot AI 是研究主体，但未提供产品-公司映射的直接证据。无法确认其产品类型及所属公司。

### Pipeshift Launch Real-Time AI (EN-d200de545425ea63)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 所有提供的声明均描述Neysa与Pipeshift的合作关系，提及Pipeshift的推理平台和集成，但没有任何声明明确说明Pipeshift Launch Real-Time AI是由某公司发布、开发、制造、运营或拥有的产品。声明中未出现该确切产品名称，也未提供产品类型或所属公司的直接证据。因此无法确认该条目的产品类型或公司归属。

### Pixel (EN-afe83c198e329ef2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: 条目类型为产品，但未提供任何明确声明证明“Pixel”是产品名称，也未提供任何声明证明其由某公司发布、开发、制造或拥有。所有引用仅提及“Pixel 系列设备”或“Pixel 硬件”，属于同现或平台提及，不构成所有权或产品归属证据。无法确认 canonical_name 是否为有效产品，也无法确认所属公司。

### Platform Built for Everyone (EN-1ca156b825e21de0)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Platform Built for Everyone / product / -
- Issues: company, evidence
- Confidence: 0.3
- Claims: CL-3265eaa722ce0cd3, CL-4025bb89e730bc8a, CL-5c9136b4d8345f5e
- Rationale: 条目类型为产品，但规范名称“Platform Built for Everyone”更像一个描述性短语而非具体产品名。所有证据均提及OpenBox AI发布平台，但未明确声明该名称即为产品名，也未提供当前所属公司。证据中无直接支持“发布、开发、制造、运营或所有权”的精确声明，无法确认产品与公司的映射关系。

### PowerEdge XE8812 (EN-85852fd45706e894)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: PowerEdge XE8812 / product / 戴尔
- Issues: company
- Confidence: 0.9
- Claims: CL-67441b3f514a4524, CL-42bde7a5c54867e9, CL-92e82040e33cee86
- Rationale: 声明明确戴尔发布PowerEdge XE8812服务器，应归属戴尔，当前公司列表为空需补充。

### Precursor (EN-7099a2200559e508)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Precursor / product / Cloudflare
- Issues: company
- Confidence: 0.95
- Claims: CL-6f6b0b46fcc12dac, CL-8b30e9fc10c6508f, CL-a3387598db51ee73
- Rationale: 声明明确Cloudflare推出Precursor产品，应归属Cloudflare，当前公司列表为空需补充。

### Purpose-Built (EN-02072c80a8386e8d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明中'Purpose-Built'仅为描述性短语，未作为独立产品名称发布，无法确认其为产品。

### PYMNTS.com (EN-cb24c5a65581e3ed)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明仅提及AWS推出AI智能体市场，未提及PYMNTS.com，无法确认该实体为产品。

### QoderWork (EN-09c344df70df9660)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: QoderWork / product / 阿里巴巴
- Issues: company
- Confidence: 0.9
- Claims: CL-404e2f09a3ef7471, CL-b28fcafff0a14b4d, CL-f2d4b04a0a1dd78d
- Rationale: 声明明确QoderWork是阿里巴巴推出的桌面AI智能体工具，应归属阿里巴巴，当前公司列表为空需补充。

### RDMA FOR NEXT-GENERATION DATA (EN-9c515f4c878bdb2e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明中'RDMA FOR NEXT-GENERATION DATA'为描述性短语，非具体产品名称，无法确认其为产品。

### Real-Time AI Inference (EN-1766fb6fac8f1c5d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 声明中'Real-Time AI Inference'为通用服务描述，非具体产品名称，无法确认其为独立产品。

### Real-World Clinical Setting (EN-668a3f52e25f8f4c)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0.1
- Claims: -
- Rationale: 无任何Claim明确声明“Real-World Clinical Setting”是一个产品，也未提供其开发者或所有者信息。该名称更像一个场景描述而非产品。

### Reality Elite (EN-8bc5e80636cd4b86)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 骁龙 Reality Elite / product / 高通
- Issues: name, company
- Confidence: 0.9
- Claims: CL-371c7db36d18efed, CL-41f452ae89b6f4c8, CL-a26620e846034228
- Rationale: Claim明确高通发布“骁龙 Reality Elite”芯片，属于硬件产品。当前名称“Reality Elite”不完整，缺少品牌前缀“骁龙”；公司字段为空，应填入“高通”。

### Relate 2026 (EN-b3b5882e4eb97824)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Relate 2026 / product / Zendesk
- Issues: company
- Confidence: 0.95
- Claims: CL-063e57d74686a010
- Rationale: Claim指出Zendesk在“Relate 2026”会议上发布产品，但“Relate 2026”是会议名称而非产品。当前名称正确，但公司字段为空，应填入Zendesk。

### Release (EN-5f6367300dabc238)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: RegattaDB / product / Regatta Data
- Issues: name, company
- Confidence: 0.95
- Claims: CL-442ef4ea70dab9f9
- Rationale: Claim明确“Regatta Data”发布“RegattaDB”产品。当前名称“Release”是通用词，非产品名；公司字段为空，应填入“Regatta Data”。

### Releases New AI (EN-936f01f91fdadf69)

- Decision: correction_candidate
- Current type / company: product / NVIDIA
- Proposed: NVIDIA 新 AI 模型与开发者工具 / product / NVIDIA
- Issues: name
- Confidence: 0.7
- Claims: CL-6e49ac10053e7c69
- Rationale: 当前名称“Releases New AI”是动词短语，非产品名。Claim标题为“NVIDIA 发布新 AI 模型与开发者工具”，但未给出具体产品名称，建议修正为更准确的描述。公司字段已有NVIDIA，正确。

### Research (EN-e3db3da2b7dc6057)

- Decision: correction_candidate
- Current type / company: product / Google
- Proposed: PHRM / product / Google
- Issues: name
- Confidence: 0.9
- Claims: CL-10875abfda0f096f
- Rationale: 当前名称“Research”是通用词，非产品名。Claim明确Google Research发布“PHRM”（被动心率监测系统），应以此作为产品名。公司字段已有Google，正确。

### ROCm 7.14 (EN-6066d80012446517)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ROCm 7.14 / product / AMD
- Issues: company
- Confidence: 0.95
- Claims: CL-0a453ae27b7c1567, CL-7d48a848272f329d, CL-00b4ec8c054d2146
- Rationale: Claim明确AMD在ROCm 7.14中新增支持，且说明ROCm是AMD的软件栈。当前产品名正确，但公司字段为空，应填入AMD。

### RTX PRO 6000 (EN-65b3aa2f527deeef)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NVIDIA RTX PRO 6000 Blackwell Server Edition / product / NVIDIA
- Issues: name, company
- Confidence: 0.95
- Claims: CL-9cc98d31288c9ff7
- Rationale: Claim明确Supermicro支持“NVIDIA RTX PRO 6000 Blackwell Server Edition”，该产品属于NVIDIA。当前名称“RTX PRO 6000”不完整，缺少品牌和版本信息；公司字段为空，应填入NVIDIA。

### Run Enterprise AI (EN-5c5f862c2a5059df)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提及Thoughtworks发布Agent/works，未提及Run Enterprise AI，无法确认该产品及其所属公司。

### Ryzen AI MAX PRO (EN-630d75372b4d1eb5)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提到AMD支持Ryzen AI MAX PRO，但未明确说明AMD发布或拥有该产品，无法确认产品-公司映射。

### S-1 (EN-148b42653f5e08b1)

- Decision: requires_review
- Current type / company: product / OpenAI
- Proposed: - / - / -
- Issues: type, evidence
- Confidence: 0.3
- Claims: CL-33e98d13578e6a9e, CL-5d756448caf51a9c, CL-c390dc03009f18dc
- Rationale: S-1是证券注册文件而非产品，现有声明仅提及OpenAI提交S-1草案，未证明S-1是OpenAI发布的产品。

### SaaS (EN-623fbff8d5179d4e)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: name, type, company, evidence
- Confidence: 0
- Claims: -
- Rationale: SaaS是通用术语，声明未将其作为特定产品发布，无公司归属证据。

### Seedance 2.0 Mini (EN-4f96127fdacbb405)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Seedance 2.0 Mini / product / 字节跳动
- Issues: company
- Confidence: 0.9
- Claims: CL-28b3c29eaf8f9f1c, CL-4b2d508b68827b34, CL-687c5027592b39c5
- Rationale: 声明显示字节跳动推出Seedance 2.0 Mini，建议将公司从空值更正为字节跳动。

### SenseNova-Vision (EN-8fc4d0cdb7b45668)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: SenseNova-Vision / product / 商汤
- Issues: company
- Confidence: 0.95
- Claims: CL-0a07df5755be5277, CL-55064fc713f68fca, CL-7c6f5cd8bf74d2e5
- Rationale: 提供的声明明确显示商汤（商汤科技）发布并开源了SenseNova-Vision，属于产品发布行为，因此确认产品名称为SenseNova-Vision，类型为产品，所属公司为商汤。

### SiliconANGLE (EN-f475981105d2acbd)

- Decision: requires_review
- Current type / company: product / Canva
- Proposed: SiliconANGLE / product / Canva
- Issues: name, evidence
- Confidence: 0.3
- Claims: CL-5abf8e821a0d0b9a, CL-683c9eb3000ec555, CL-9e7b93ef54af8b54
- Rationale: 条目声称产品名称为SiliconANGLE，但所有提供的声明均提及Canva AI 2.0，未出现SiliconANGLE。声明显示Canva发布Canva AI 2.0，但未证明Canva拥有或运营SiliconANGLE。名称与证据不匹配，无法确认产品-公司映射。

### Software Delivery (EN-e8fc8b3e92a8dc5a)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提到Harness推出面向软件交付的自主工作代理，但未明确提及“Software Delivery”作为产品名称，且当前公司名为空，无直接证据证明该产品归属。

### Sovereign Agentic Studios (EN-5f59f157b0f3c885)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 声明提到Atos Group推出Sovereign Agentic Studios，但当前公司名为空，且无任何关系表或声明明确该产品由某公司拥有或发布，无法确认归属。

### SpaceXAI (EN-0b9ca57f53ba758b)

- Decision: requires_review
- Current type / company: product / xAI, NVIDIA
- Proposed: SpaceXAI / product / -
- Issues: company, evidence
- Confidence: 0.3
- Claims: CL-34ad279d62cf4bdc, CL-66990e99d6c6046f, CL-77833569bd63ddac
- Rationale: 提供的声明中仅CL-34ad279d62cf4bdc、CL-66990e99d6c6046f、CL-77833569bd63ddac存在于证据列表中，其余声明ID未提供。现有声明显示SpaceXAI被提及为产品发布主体，但未明确证明其由xAI或NVIDIA发布、开发或拥有。关系记录中引用了大量未提供的声明ID，无法验证。

### Spark incubator program (EN-39a37ee3a2b2c3c0)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Spark incubator program / product / -
- Issues: type, company
- Confidence: 0.4
- Claims: CL-627eae8c455f0cab, CL-4a8e4292b32c2821, CL-72117354e6877a18
- Rationale: 现有声明显示Suno推出了Spark孵化器计划，但该实体更可能是一个项目/计划而非产品。声明中未明确指定所属公司名称，且无任何声明证明其由某公司发布、开发或拥有。

### Specialty Care Program Enrollment (EN-b6e23938808f272d)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0.1
- Claims: -
- Rationale: 所有声明均讨论AI语音智能体在专科护理项目注册中的研究结果，未提及'Specialty Care Program Enrollment'作为产品，也未证明其由任何公司发布、开发或拥有。

### Step Edge (EN-44a9bf3b11abea5c)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Step Edge / product / -
- Issues: company
- Confidence: 0.5
- Claims: CL-257e63d8454919b6, CL-cac59cf17d5304e8, CL-f9fe92db57e2480f
- Rationale: 声明显示阶跃星辰发布了Step Edge端侧模型全家桶，但'阶跃星辰'作为公司名称未在current_company_names中列出。现有声明支持Step Edge是产品，但缺少明确的公司归属声明。

### StepAudio 2.5 Realtime (EN-ed501d3e2d977553)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: StepAudio 2.5 Realtime / product / 阶跃星辰
- Issues: company
- Confidence: 0.95
- Claims: CL-52a84bcf4c306930, CL-b7a461c1023fcdc8
- Rationale: 证据明确显示阶跃星辰（StepFun）发布了该产品，应补充公司名称。

### STEPX Neo (EN-8b619895a83e35c8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: STEPX Neo / product / 阶跃星辰
- Issues: company
- Confidence: 0.95
- Claims: CL-7c7ce8232dd3a0b9
- Rationale: 证据表明阶跃星辰发布了该产品，应补充公司名称。

### Superagent (EN-6837142183eb8261)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Superagent / product / i10X
- Issues: company
- Confidence: 0.95
- Claims: CL-0e680b0143d24814, CL-4202b366b19102c3, CL-d4c253ac6783d333
- Rationale: 证据明确显示i10X.ai发布了Superagent，应补充公司名称。

### SWE-Bench Pro (EN-536c4035ba0c7047)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: SWE-Bench Pro / product / Scale AI
- Issues: company
- Confidence: 0.9
- Claims: CL-ff05c04825ec9325
- Rationale: 证据明确说明SWE-Bench Pro由Scale AI推出，当前公司名OpenAI不正确，应改为Scale AI。

### TPU Developer Hub (EN-094b0c7d2d7a382e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: TPU Developer Hub / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-1781673ba2a165aa, CL-2cb4260e9ce8493a, CL-7662823a90569cbd
- Rationale: 证据明确描述为产品发布，但未提及所属公司，因此保留产品类型，公司字段为空。

### TRACE (EN-8775f30318a77aea)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: TRACE / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-192a87e64ca4b5a9, CL-75c18f308c9d4f4f, CL-7bffc38e62f55b6d
- Rationale: 证据显示斯坦福大学发布该产品，但斯坦福大学是教育机构而非公司，因此公司字段留空。

### TypeScript AI Agent Framework (EN-d87e6bf7aa180a4a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: TypeScript AI Agent Framework / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-51cc83a2889e23f2, CL-7507646f63868460, CL-e1ad432c9824b470
- Rationale: 证据描述为开源框架发布，但未明确所属公司，因此保留产品类型，公司字段为空。

### U.S (EN-3c92cc7e49924a6f)

- Decision: correction_candidate
- Current type / company: product / OpenAI
- Proposed: U.S / product / OpenAI
- Issues: name
- Confidence: 0.95
- Claims: CL-93b0d4a31067426c, CL-bbdd2091c6b95965, CL-c735fe30141305e7
- Rationale: 证据中'U.S. government'指美国政府，并非产品名称。但当前映射关系已验证，故保留现有值。

### Ultimate Open-Source AI (EN-576c367dfd7686e8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Ultimate Open-Source AI / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-5fa3e168c9d3793d, CL-06d4c798834a8ed3, CL-7cc2f9883e782e4a
- Rationale: 证据描述为目录/集合，但未明确所属公司，保留产品类型，公司字段为空。

### Unveils Autonomous (EN-a83eedd800c2433b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Autonomous Service Workforce / product / Zendesk
- Issues: name, company
- Confidence: 0.85
- Claims: CL-063e57d74686a010, CL-0dab2fc5d56516ed, CL-c69a64e985228325
- Rationale: 证据显示Zendesk发布了'Autonomous Service Workforce'，而非'Unveils Autonomous'，后者是动词短语。建议修正名称并关联公司。

### Unveils Canva AI (EN-954dc5d6516f127c)

- Decision: correction_candidate
- Current type / company: product / Canva
- Proposed: Unveils Canva AI / product / Canva
- Issues: name
- Confidence: 0.95
- Claims: CL-683c9eb3000ec555, CL-5abf8e821a0d0b9a, CL-6b4b7db9ba44e97b
- Rationale: 证据显示Canva发布'Canva AI 2.0'，但当前名称'Unveils Canva AI'包含动词。不过映射已验证，故保留现有值。

### Unveils Peraton (EN-0dba03107c52ed3e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Peraton[x] / product / Peraton
- Issues: name, company
- Confidence: 0.95
- Claims: CL-93fcc0157621326b, CL-029c456d4eed8080, CL-23a57e3c51e70323
- Rationale: 当前名称'Unveils Peraton'是事件描述片段，非产品名。证据显示Peraton发布了产品'Peraton[x]™'，因此建议更正产品名为'Peraton[x]'，并添加公司'Peraton'。

### V3 AI (EN-7237be4cf93bf940)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 雷鸟 V3 AI 拍摄眼镜 / product / -
- Issues: name, company
- Confidence: 0.9
- Claims: CL-11ac1171efcd7656, CL-3c67d397d410b44c, CL-0f1dfe362ae5b3a3
- Rationale: 当前名称'V3 AI'不完整。证据中产品全称为'雷鸟 V3 AI 拍摄眼镜'，建议更正。证据未明确提及开发公司，故公司字段留空。

### VC Corner (EN-d31a4982f920e657)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 终极开源AI代理目录 / product / -
- Issues: name, company
- Confidence: 0.85
- Claims: CL-06d4c798834a8ed3, CL-5fa3e168c9d3793d, CL-7cc2f9883e782e4a
- Rationale: 当前名称'VC Corner'是事件标题的一部分，非产品名。证据中产品描述为'终极开源AI代理目录'，建议更正。未提及所属公司。

### VeltrisOne (EN-23b979df49741c93)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VeltrisOne / product / Veltris
- Issues: company
- Confidence: 0.95
- Claims: CL-199c1fcc1678d87d
- Rationale: 证据明确显示Veltris发布了产品VeltrisOne™，与当前产品名一致，且公司为Veltris。当前公司字段为空，但证据支持添加Veltris。

### Verifiers (EN-1c6392c229ed9069)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: verifiers / product / Prime Intellect
- Issues: name, company
- Confidence: 0.95
- Claims: CL-434349c3bb4f4e0d, CL-640c4ad549143696, CL-73a06a2613c622b3
- Rationale: 当前名称'Verifiers'首字母大写，但证据中产品名称为小写'verifiers'，建议更正为小写。证据明确Prime Intellect发布了该产品，应添加公司名。

### Verifiers v1 (EN-8c8c58ec2d92d598)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: verifiers v1 / product / Prime Intellect
- Issues: name, company
- Confidence: 0.95
- Claims: CL-73a06a2613c622b3, CL-434349c3bb4f4e0d, CL-640c4ad549143696
- Rationale: 当前名称'Verifiers v1'首字母大写，但证据中产品名称为小写'verifiers v1'，建议更正。证据显示Prime Intellect发布了该产品，应添加公司名。

### Vids (EN-c4593a0a1bbaf20b)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Vids / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-17db8b867d10467d, CL-509812acb58631bd, CL-5b504871819e12c4
- Rationale: 证据显示“谷歌 Google Vids”为产品发布，但未提供明确声明证明谷歌（Google）是开发者或所有者，仅提及品牌名称，无法确认归属关系。

### VisionRay Flow Pro AI (EN-30bb70f57054ca83)

- Decision: requires_review
- Current type / company: product / -
- Proposed: VisionRay Flow Pro AI / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-07a2decdb599ec04, CL-7d58908dfc229a35, CL-e5c59b1872c60260
- Rationale: 证据显示DPVR发布该产品，但未提供明确声明证明DPVR是开发者或所有者，仅提及制造商，无法确认归属关系。

### Walker C1 (EN-d558e1de958b9d05)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Walker C1 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-35a814ab6cf1ac87, CL-d1cac0d94682d59d, CL-eae2cec5964f6779
- Rationale: 证据显示优必选发布Walker C1，但未提供明确声明证明优必选是开发者或所有者，仅提及发布行为，无法确认归属关系。

### Wan-Streamer (EN-d83624eb3ab9192e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Wan-Streamer / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-47b055cf37ef6dfe, CL-4d141439dc141d59, CL-61d37cba6a3df4ef
- Rationale: 条目类型为产品，名称合理。证据显示阿里通义实验室发布了该模型，但未提供明确声明证明阿里通义实验室是当前拥有或运营该产品的公司，因此公司字段留空。

### Wan-Streamer v0.2 (EN-925a688403e10965)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Wan-Streamer / product / -
- Issues: name, duplicate
- Confidence: 0.95
- Claims: CL-47b055cf37ef6dfe, CL-61d37cba6a3df4ef, CL-8357b380ef8383c8
- Rationale: 该条目名称包含版本号“v0.2”，但证据中产品名称为“Wan-Streamer”，版本号应视为产品属性而非名称一部分。且该产品与EN-d83624eb3ab9192e重复，建议合并为“Wan-Streamer”。

### Webwright (EN-10e5255f25e37ceb)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Webwright / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-dffd972d520d8a29
- Rationale: 条目类型为产品，名称合理。证据显示微软研究院发布了该框架，但未提供明确声明证明微软研究院是当前拥有或运营该产品的公司，因此公司字段留空。

### wheelScrollAccelerationEnabled setting (EN-c23eb5fae3cdd763)

- Decision: correction_candidate
- Current type / company: product / Anthropic
- Proposed: wheelScrollAccelerationEnabled setting / product / -
- Issues: type, company
- Confidence: 0.85
- Claims: CL-4a6ed87bb9fa740f, CL-21d23df5cc09744f, CL-67a5b366c704944f
- Rationale: 条目名称为“wheelScrollAccelerationEnabled setting”，证据显示这是Claude Code v2.1.174发布中的一个设置项，并非独立产品，更像产品功能或配置。当前公司字段标注为Anthropic，但证据中未明确声明Anthropic拥有或运营该设置项，仅提及Claude Code的发布。建议重新评估类型和公司归属。

### WWDC 2026 (EN-dfabe4215e8c07cb)

- Decision: insufficient_evidence
- Current type / company: product / Apple
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 所有证据中WWDC 2026被描述为开发者大会或活动，而非产品；无任何声明支持其为Apple发布的产品，无法确认产品类型和公司归属。

### ZCode (EN-bc77259c5d2eb341)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZCode / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-561e07b12fe3bead, CL-8d3f53e900c124b2
- Rationale: 证据明确显示ZCode是智谱AI发布的编程智能体产品，类型为product。但当前company_names为空，证据中提及发布方为智谱AI，但未提供明确的所有权声明（如'智谱AI开发/拥有ZCode'），仅通过产品发布事件关联，因此标记company字段需审查。

### ZCode 3.0 (EN-993599624a199fe0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZCode 3.0 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-42bb46570b181556, CL-76a2dcd87a41c61c, CL-a39f135edafa0bd5
- Rationale: 证据表明ZCode 3.0是智谱发布的AI编程工具新版本，类型为product。但当前company_names为空，证据中仅提及'智谱发布'，未提供明确的所有权声明，因此company字段需进一步确认。

### ZenseAI.AgentMesh (EN-4d8f3ef9d13d6777)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZenseAI.AgentMesh / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-c8af52ead25dfa23
- Rationale: 证据显示ZenseAI.AgentMesh是Zensar Technologies推出的产品，类型为product。但当前company_names为空，证据中仅提及'推出'，未提供明确的所有权声明，因此company字段需审查。

### ZUNA1.1 (EN-20ca085ff30e9339)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZUNA1.1 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-5b5393973f497832, CL-b64be3969ec03109, CL-f7959ebd8cf5d425
- Rationale: 证据显示ZUNA1.1是Zyphra发布的EEG基础模型，类型为product。但当前company_names为空，证据中提及'Zyphra发布'，未提供明确的所有权声明，因此company字段需进一步确认。
