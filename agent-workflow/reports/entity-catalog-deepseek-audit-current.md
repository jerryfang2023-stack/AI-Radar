# Entity Catalog DeepSeek Audit

- Generated: 2026-07-25T05:05:00.889Z
- Model: deepseek-v4-flash
- Catalog: 570
- Reviewed: 570
- Confirmed (advisory): 427
- Correction candidates: 131
- Requires review: 9
- Insufficient evidence: 3
- Failed batches: 0

> DeepSeek output is advisory. No canonical entity, company-product relation, or public index was changed.

## Flagged items

### Broadcom (EN-373ac021a2c0bb2c)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: Broadcom / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-461c6f0b139447ca, CL-51bfd0c4c0762526, CL-1664c1e84b50e11f
- Rationale: 证据中Broadcom与OpenAI合作设计芯片、与FuriosaAI合作，是公司实体。仅引用提供的证据ID，未提供的ID不引用。

### C3 AI (EN-f48a4090493d2b5e)

- Decision: correction_candidate
- Current type / company: company / -
- Proposed: C3 AI / company / -
- Issues: evidence
- Confidence: 0.9
- Claims: CL-05bf675cfda1eee5, CL-19d3e0977badeec6, CL-85c9ac69bab6b39c
- Rationale: 证据中C3 AI与壳牌扩大合作，是公司实体。仅引用提供的证据ID。

### Huawei (EN-b81c8201acfc7639)

- Decision: requires_review
- Current type / company: company / -
- Proposed: - / - / -
- Issues: name, type, evidence
- Confidence: 0.3
- Claims: -
- Rationale: 证据中主语为“华为 Pura 80 系列率先升级 HarmonyOS...”，这是一个产品/系统升级描述，而非直接证明“Huawei”作为公司实体的运营或所有权。证据不足以确认该条目为公司。

### LM Studio (EN-7df09a7717ef2feb)

- Decision: requires_review
- Current type / company: company / -
- Proposed: - / - / -
- Issues: type, evidence
- Confidence: 0.3
- Claims: -
- Rationale: 证据中LM Studio发布产品“LM Studio Bionic”，但LM Studio本身可能是一个产品名称而非公司；无明确证据表明LM Studio是组织实体，需进一步审查。

### 4T AMD AI 395 (EN-88d56d69ca3828db)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 4T AMD AI 395 / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-ad86541bb81c96ff
- Rationale: 证据提到极摩客发布该产品，但当前公司字段为空，需补充公司信息。

### 高德问店 (EN-6631ecf47788552e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 高德问店 / product / 阿里巴巴
- Issues: company
- Confidence: 0.9
- Claims: CL-042d0d8f4ce542df, CL-b7cc20da766c8922, CL-ed55e8601f197aea
- Rationale: 证据显示阿里巴巴推出该服务，应补充公司为阿里巴巴。

### 国内首个全周期高考志愿填报 (EN-3c2a3673eabc9a46)

- Decision: correction_candidate
- Current type / company: product / 阿里巴巴
- Proposed: 国内首个全周期高考志愿填报 / product / 阿里巴巴
- Issues: name
- Confidence: 0.85
- Claims: CL-6d08d5517a55c877, CL-82f9a33c6e075b9f, CL-9139659758440553
- Rationale: 证据中产品名称为'国内首个全周期高考志愿填报 Agent'，当前名称缺少'Agent'，建议修正。

### 妈祖 (EN-d90a8e9b152bf236)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 妈祖 / product / 中国气象局
- Issues: company
- Confidence: 0.85
- Claims: CL-491ba3ef5ab3104f, CL-68dc6574de1b85ac, CL-85c16d8f334f5f10
- Rationale: 证据显示中国气象局发布了该AI工具箱产品，但当前公司字段为空，应补充中国气象局为公司。

### 云燧 ESL64-O 超节点 (EN-0b706b4b95ba647c)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 云燧 ESL64-O 超节点 / product / 燧原科技
- Issues: company
- Confidence: 0.9
- Claims: CL-23db5f68b34959d3, CL-4acaacad906c6cc7, CL-bef992849f6c8110
- Rationale: 证据显示燧原科技发布了该产品，当前公司列表为空，应补充为燧原科技。中兴通讯为联合发布方，但无明确所有权声明。

### 运通工程师信用卡 (EN-a4eee620f5a081bd)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: 运通工程师信用卡 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0055eba8920e653f
- Rationale: 证据显示招商银行推出该信用卡，但无明确声明招商银行拥有或运营该产品，且当前公司名为空，故保留产品类型，公司字段需审查。

### ACE (EN-285c8f76de6c6c97)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE / product / -
- Issues: company
- Confidence: 0.6
- Claims: CL-575c04e2b07891de, CL-a2375b5fa313c2b6, CL-e81385ade6248b7b
- Rationale: 证据显示ACE是规范/指令集，由EAG小组发布，英特尔和AMD参与，但无明确单一公司拥有或发布，公司字段应留空。

### ACE 1.15 (EN-252da501233d3c2d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ACE 1.15 / product / -
- Issues: company
- Confidence: 0.6
- Claims: CL-03a4844da011f8bc, CL-575c04e2b07891de, CL-a2375b5fa313c2b6
- Rationale: 证据显示ACE 1.15是规范版本，由EAG发布，无单一公司拥有，公司字段应留空。

### ADK Go 2.0 (EN-9ec037a4f41bae8f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ADK Go 2.0 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-905fa90e14050d1e, CL-dfd488a73661be1a
- Rationale: 证据明确显示ADK Go 2.0是一个产品发布，但未提供所属公司信息，当前公司列表为空，保留原状。

### Agent Governance Toolkit (EN-e75a2e5083aa0089)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Governance Toolkit / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-8db9327ffefca608
- Rationale: 证据CL-8db9327ffefca608显示微软开源了该工具包，应补充公司名称。

### Agent Marketplace (EN-dba61afed18c85d6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Agent Marketplace / product / AWS
- Issues: company
- Confidence: 0.9
- Claims: CL-47e8000d9e590827
- Rationale: 证据CL-47e8000d9e590827明确AWS将推出Agent Marketplace，应补充公司名称。

### AI Agent Platform for Supply Chain Execution (EN-87b3ab1e46b7ee62)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Agent Platform for Supply Chain Execution / product / DeepFabric
- Issues: company
- Confidence: 0.9
- Claims: CL-b1e68ee5b2f20cf6, CL-e1070ff4b709c5ad, CL-fab74f8dd810022d
- Rationale: 证据显示DeepFabric发布该平台，当前公司字段为空，应补充为DeepFabric。

### AI detector (EN-892b87f4931551f6)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0.6
- Claims: -
- Rationale: 证据显示Substack新增了AI检测器，但未明确说明Substack是开发者/发布者，检测器由Pangram提供，当前公司名称为空，需进一步确认归属。

### AI Factories (EN-a614180064f7ef60)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0.6
- Claims: -
- Rationale: 证据显示Amazon发布了AI Factories，但当前公司名称为空，需确认是否应归属Amazon或AWS。

### AI Factory (EN-e58ee91f1d57df05)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Factory / product / HPE
- Issues: company
- Confidence: 0.9
- Claims: CL-76a95a4a201509d2
- Rationale: 证据显示HPE发布了名为“HPE AI Factory”的产品，因此应补充公司名称为HPE。

### AI for Teams (EN-c921627ea80315ed)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI for Teams / product / JetBrains
- Issues: company
- Confidence: 0.9
- Claims: CL-69dd5c891f2411f1, CL-c3859fd272726fd0
- Rationale: 证据显示JetBrains发布了面向团队的AI功能，且产品名称与“AI for Teams”相符，因此应补充公司名称为JetBrains。

### AI Interconnect Platform (EN-b0eea3ad7b0d0a48)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0.6
- Claims: -
- Rationale: 证据显示Chelsio推出了AI Interconnect Platform，但当前公司名称为空，需确认是否应归属Chelsio。

### AI Processing Chip (EN-683d8d597da71192)

- Decision: correction_candidate
- Current type / company: product / NVIDIA
- Proposed: AI Processing Chip / product / NVIDIA
- Issues: name
- Confidence: 0.7
- Claims: CL-f255de03bcf06a3c, CL-1586d254462219c3, CL-318ecea40fae1876
- Rationale: 证据提到英伟达计划推出新款AI处理芯片，但未给出具体产品名称，当前名称过于泛化，建议标记为需审查。

### AI Workforce Platform (EN-9e51ca48d5ecf16f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI Workforce Platform / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-03d4dea4c9bf0564, CL-55d4c2c5a74b2a19, CL-62501b66860c9002
- Rationale: 证据显示Atomicwork发布了该平台，但无明确声明证明Atomicwork拥有或开发该产品，当前公司字段为空，需补充所有权证据。

### AI-RAN (EN-f0fa30cd90f406c8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-RAN / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-a7d807152cb083b1, CL-acfe2b27d62beca2, CL-32ea00e5c0e5b9a8
- Rationale: 诺基亚发布AI-RAN平台，但无明确声明证明诺基亚拥有或开发该产品，当前公司字段为空，需补充所有权证据。

### AI-specific (EN-d0cf06b547fad71d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AI-specific / product / Meta
- Issues: name, company
- Confidence: 0.7
- Claims: CL-35aa14c242a3f09a
- Rationale: 证据提到Meta的AI-specific芯片，但名称不完整，且当前公司为空，应补充Meta。

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
- Proposed: Air 3 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-092fa3ba898c9332, CL-122d5452e326e7e0, CL-a46da6f2ae0481e9
- Rationale: 科大讯飞发布Air 3系列产品，但无明确声明证明科大讯飞拥有或开发该产品，当前公司字段为空，需补充所有权证据。

### Akrites (EN-88a9157d1b3e66ae)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Akrites / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-02ff9cbe615696e5, CL-3497137323547849, CL-c77cb7816ce8025c
- Rationale: Linux基金会联合多方推出Akrites项目，但无明确声明证明Linux基金会拥有或开发该项目，当前公司字段为空，需补充所有权证据。

### Amazon Bedrock (EN-c910c1cd382be9a0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Amazon Bedrock / product / Amazon
- Issues: company
- Confidence: 0.85
- Claims: CL-27075dcf46bfc402, CL-2f4e7913712d6a87
- Rationale: 证据提及Amazon Bedrock，但未明确声明Amazon拥有或发布该产品，仅显示其他模型在其上可用，建议补充公司为Amazon。

### AMD AI 395 (EN-b8087e26a688494b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AMD AI 395 / product / 极摩客
- Issues: company
- Confidence: 0.7
- Claims: CL-ad86541bb81c96ff
- Rationale: 证据显示极摩客产品使用了AMD AI 395，但当前公司为空，应补充极摩客。

### Android 17 (EN-e0bab6f6c58bfe4e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Android 17 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-2d3d4cf25f483fee, CL-9ca1813b0e901145, CL-524ffc470ce7246d
- Rationale: 证据提到谷歌推送Android 17，但无明确声明证明谷歌拥有或开发该产品，当前公司字段为空，需补充所有权证据。

### Antares-1B AI (EN-02be787a1aacea06)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Antares-1B AI / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-3f0f1cc25f747501
- Rationale: 证据显示Cisco发布了Antares-1B AI模型，但未明确声明Cisco是开发者或所有者，仅提及发布行为。当前公司名为空，证据不足以建立所有权关系，保留原状。

### Antares-350M (EN-2ca3f7d58fdda0f5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Antares-350M / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-3f0f1cc25f747501
- Rationale: 证据显示Cisco发布了Antares-350M模型，但未明确声明Cisco是开发者或所有者。当前公司名为空，证据不足以建立所有权，保留原状。

### AstraBrain-WBC 0.5 (EN-0d049cd1e9f619f9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AstraBrain-WBC 0.5 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-2d9c0183892f925c, CL-3166c56a9815c0ee, CL-8a246deb4a52a8fa
- Rationale: 证据显示银河通用发布了该模型，但未提供银河通用的规范公司名称，因此公司字段留空。

### Auto Immersive (EN-b6fe9abdb194022b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Auto Immersive / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-55c9e40db0870801, CL-5e86f6a358db4d82, CL-bc6b71076b399a17
- Rationale: 证据显示VITURE发布了该技术，但VITURE未在规范公司名称列表中，公司字段留空。

### Auto-review (EN-b7efc8f24f2e2358)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Auto-review / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-27edd7de05c58272, CL-421f045aefa19028, CL-2578da7feac7d3ee
- Rationale: 证据显示Cursor推出了Auto-review，但Cursor未在规范公司名称列表中，公司字段留空。

### Automation Suite (EN-e99987e5c504a796)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Automation Suite / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-ad5e85b0afa3f6c2
- Rationale: 证据显示UiPath发布了Automation Suite，但当前公司名为空。UiPath是公司名，应映射，但当前记录未包含。

### AZ3 Pro (EN-553d045569eaf2e5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: AZ3 Pro / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-236ba598e4252340
- Rationale: 证据提到AZ3 Pro是亚马逊自研芯片，但未明确说明亚马逊是发布者或所有者，当前公司字段为空可接受。

### BioNeMo (EN-bc604773f5053671)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: BioNeMo / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-ae506e9c56d61e36
- Rationale: 证据提到NVIDIA BioNeMo平台，但未明确NVIDIA是发布者，当前公司字段为空可接受。

### Brain2Qwerty v2 (EN-2ba325ce6f8e3dc9)

- Decision: correction_candidate
- Current type / company: product / Meta
- Proposed: Brain2Qwerty v2 / product / Meta
- Issues: duplicate
- Confidence: 0.9
- Claims: CL-601390d975f30011, CL-22b210018f5193f7, CL-7c6f61d5cad29584
- Rationale: 该产品与EN-557203e8cc173124（Brain2Qwerty）高度相似，可能是同一产品的版本变体，建议合并或标记为重复。

### Claude for Small Business (EN-efd2f8add3dd89c7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Claude for Small Business / product / Anthropic
- Issues: company
- Confidence: 0.95
- Claims: CL-34caf28aa829aa12
- Rationale: 证据显示Anthropic发布了该产品，但当前公司列表为空，应补充Anthropic。

### Compact, Energy-Efficient Systems (EN-56ee86045cfb0ddd)

- Decision: correction_candidate
- Current type / company: product / Supermicro
- Proposed: Compact, Energy-Efficient Systems / product / Supermicro
- Issues: name
- Confidence: 0.85
- Claims: CL-71e2abe848866c02, CL-5276acf634a2cdf7, CL-55659ee9c4f25cec
- Rationale: 证据显示Supermicro推出紧凑节能系统系列，但'Compact, Energy-Efficient Systems'更像描述性短语而非正式产品名，建议确认正式名称。

### Composer 2.5 (EN-ba1269449ab76537)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Composer 2.5 / product / Cursor
- Issues: company
- Confidence: 0.95
- Claims: CL-02ec1f669993f2f4, CL-1cefd5ca06db9785, CL-9a143b175e97cc12
- Rationale: 证据显示 Cursor 发布了 Composer 2.5，明确为产品发布，但当前公司名称为空，应补充为 Cursor。

### Computer Use (EN-3aa38718f0399af9)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Computer Use / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-c7f6ee0108809633
- Rationale: 证据显示Google将Computer Use功能集成到Gemini 3.5 Flash中，当前缺少公司归属。

### Continuum (EN-02bb4eeba3bde980)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Continuum / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0cc7e31523493be6, CL-24c0c5e4ec909641, CL-a5a3a28dc159637e
- Rationale: Continuum是AWS推出的新服务产品，证据显示AWS发布该服务，但无明确所有权声明，公司字段为空，保留现状。

### CUGA (EN-d6d6e4e33c59b45e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: CUGA / product / IBM
- Issues: company
- Confidence: 0.95
- Claims: CL-2126331ef6503828, CL-9ce295a92a1fc3bf, CL-b9d0d3f3c8c311b9
- Rationale: 证据显示 IBM 开源了 CUGA 框架，当前公司名称为空，应补充为 IBM。

### Cursor Router (EN-1f9d72d5cc62d35e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Cursor Router / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-44753af41b8c40bc, CL-b97835c526656871, CL-0a0a652be7d568e9
- Rationale: 证据显示Cursor发布Cursor Router，但未明确Cursor是公司名还是产品名，当前公司字段为空，需确认发布方实体。

### Custom (EN-ba961b5c6d1aee29)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Custom / product / M-Files
- Issues: company
- Confidence: 0.9
- Claims: CL-23c756ddc6d7a867, CL-8d31cb4dd0cdd635
- Rationale: 证据显示M-Files推出Custom Agents，当前公司名称为空，应补充为M-Files。

### Data Readiness Problem Killing (EN-73df89424ba2e889)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Data Readiness Problem Killing / product / Rabble AI
- Issues: company
- Confidence: 0.9
- Claims: CL-c414c81d8d9e7fad
- Rationale: 证据显示Rabble AI推出数据就绪平台，当前公司名称为空，应补充为Rabble AI。

### DataRobot AI Cloud (EN-64d17ceed397dfde)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DataRobot AI Cloud / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-57ed0bec96d075d4, CL-3ce00d540bcdd10e, CL-b84ce1a03fcf6751
- Rationale: 名称是产品，证据显示产品发布事件，但未提供明确声明证明所属公司，当前公司列表为空，保留原状。

### Design Stream (EN-d692adb22248825f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Design Stream / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-25bcdd5994eed390, CL-5859ce277c3fe2cf, CL-0ab85bc911845c03
- Rationale: 名称是产品特征/工具，证据显示由MattoBoard发布，但无明确所有权声明，当前公司列表为空，保留原状。

### DFlash (EN-16912c2e35f7be68)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DFlash / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-8e15d6bf22070b22
- Rationale: DFlash是一个模型（产品），但证据中未明确提及所属公司，仅提到'jointly-released'，无法确定公司归属。当前公司为空，但无证据可补充具体公司名。

### DNN (EN-7e6582d8b1b179bf)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: DNN / product / -
- Issues: company
- Confidence: 0.6
- Claims: CL-d6f1e0a0ab2ff05f
- Rationale: DNN是OpenCV 5中的引擎组件（产品），但证据未提及所属公司，仅提到OpenCV 5。当前公司为空，无证据可补充。

### Dragonfly (EN-9d534deeea39a521)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Dragonfly / product / Qualcomm
- Issues: company
- Confidence: 0.95
- Claims: CL-2ae83064809b93df, CL-cae005bb954b2ef9
- Rationale: 证据明确显示Dragonfly是高通（Qualcomm）推出的数据中心产品组合，属于产品。当前公司为空，应补充为Qualcomm。

### Duet AI for Developers (EN-9086d4784c07561e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Duet AI for Developers / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-74e56808cfbc0e29
- Rationale: 证据提到Google的Duet AI for Developers将采用Gemini模型，表明该产品属于Google。当前公司为空，应补充为Google。

### EdgeMesa N AI (EN-3f750f52c80c4445)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: EdgeMesa N AI / product / 微星
- Issues: company
- Confidence: 0.95
- Claims: CL-16816af68c993d57
- Rationale: 证据显示EdgeMesa N AI+是微星（MSI）推出的迷你主机产品。当前公司为空，应补充为微星。

### Elements Claw (EN-94caa859c22071b1)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Elements Claw / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-64369a09ca7e9385, CL-ae24dc6d66a8f1d1, CL-dce7f3ddb3fd068e
- Rationale: 证据显示阿里达摩院发布了Elements Claw AI智能体，但当前公司字段为空。证据明确支持阿里达摩院为发布者，建议补充公司信息。

### End-to-End Supply Chain Operations (EN-774e4ae6eef0efdb)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: End-to-End Supply Chain Operations / product / DeepFabric
- Issues: company
- Confidence: 0.95
- Claims: CL-b1e68ee5b2f20cf6, CL-e1070ff4b709c5ad
- Rationale: 证据明确显示DeepFabric发布了端到端供应链运营AI智能体平台，属于产品。当前公司为空，应补充为DeepFabric。

### EPYC Venice (EN-9eb316bd917fbc04)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: EPYC Venice / product / -
- Issues: company
- Confidence: 0.85
- Claims: CL-1a457c9264413ff0, CL-36a0449fe84221b1, CL-6212c68629b73001
- Rationale: 名称是处理器产品，证据提及AMD发布活动，但未明确声明EPYC Venice由AMD拥有或发布，当前公司列表为空，保留原状。

### EPYC Venice-X (EN-ee8bda452bc807fa)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: EPYC Venice-X / product / -
- Issues: company
- Confidence: 0.85
- Claims: CL-a434c3ea842a93bd, CL-0b3c4576b5017f1e, CL-698a7677a5cbfbdb
- Rationale: 名称是处理器产品，证据提及AMD计划发布，但未提供明确所有权声明，当前公司列表为空，保留原状。

### Fin AI (EN-1ec93c99d07feadd)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Fin AI / product / Intercom
- Issues: company
- Confidence: 0.9
- Claims: CL-7a2d6d9738b7b016
- Rationale: 证据明确Intercom发布Fin AI，应补充公司名Intercom。

### Foundation Models framework (EN-41dcc2d4951f337b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Foundation Models framework / product / Apple
- Issues: company
- Confidence: 0.85
- Claims: CL-5e55b73326fc1077, CL-9b9af4ee977e02f6, CL-d39aa41668213fa3
- Rationale: 证据显示该框架是Apple的Foundation Models框架，当前公司名为空，应归属Apple。

### Foundry (EN-d0bfa24cf1e53827)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Foundry / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-8a79c00232e1ccdc, CL-c485598b128a179d, CL-99352dba6260dc88
- Rationale: 证据明确Microsoft Foundry是微软平台，应补充公司名Microsoft。

### Gemini API (EN-a6f1623a1e5232a6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini API / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-21d206ae86a7b6eb, CL-3cad9a139bae62ba, CL-80619fd5e25eabb6
- Rationale: 证据显示Google Deepmind为Gemini API添加功能，但未明确声明开发或拥有关系，当前公司字段为空，需补充所有权证据。

### Gemini Flash (EN-204d4b18c9d78e88)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Flash / product / Google
- Issues: company
- Confidence: 0.95
- Claims: CL-833fd2e043d19c10
- Rationale: 证据CL-833fd2e043d19c10明确提到Google发布了Gemini Flash系列模型，属于产品发布行为，因此应将当前公司名称补充为Google。

### Gemini Notebook (EN-ec75c4fe965a0492)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Notebook / product / Google
- Issues: company
- Confidence: 0.95
- Claims: CL-f723ec5f7128c2b4
- Rationale: 证据CL-f723ec5f7128c2b4明确提到Google将NotebookLM更名为Gemini Notebook，属于产品发布行为，因此应将当前公司名称补充为Google。

### Gemini Omni Flash (EN-7ed9c9e7c260ed06)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Omni Flash / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-1030b31c165540d3, CL-3ca47c32c729c6e8, CL-4cf8bbb7f166e862
- Rationale: 证据显示Google DeepMind发布该模型，但未明确声明所有权，当前公司字段为空，需补充所有权证据。

### Gemini Spark (EN-307557d99a7eb726)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Gemini Spark / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-b000143fed6c52d3, CL-b0dab5d514b2d3a0, CL-51ad135c82b9455b
- Rationale: 证据提及谷歌AI智能体，但未明确声明开发或拥有关系，当前公司字段为空，需补充所有权证据。

### Grok 4.5 (EN-24caf10fe9bfb1c5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Grok 4.5 / product / SpaceXAI
- Issues: company
- Confidence: 0.95
- Claims: CL-913d46a75159fe2c, CL-ec2d6107c732e14c, CL-9237aaeca90244b9
- Rationale: 证据明确显示 SpaceXAI 发布 Grok 4.5，但当前公司列表为空，应补充 SpaceXAI。

### Grok Build (EN-c4bc2d00a42f220f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Grok Build / product / SpaceXAI
- Issues: company
- Confidence: 0.9
- Claims: CL-54c7c187771e7610, CL-66990e99d6c6046f, CL-8dea0880a232aacb
- Rationale: 证据显示SpaceXAI开源并发布Grok Build，当前公司字段为空，应更正为SpaceXAI。

### HarmonyOS 7.0 Developer Beta (EN-e18cb6435603205d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: HarmonyOS 7.0 Developer Beta / product / 华为
- Issues: company
- Confidence: 0.9
- Claims: CL-b8364b9d819b3559
- Rationale: 证据显示华为发布了HarmonyOS 7.0 Developer Beta，当前公司字段为空，应补充为华为。

### Helios AI (EN-9ff7e3ae1b1ab43f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Helios AI / product / AMD
- Issues: company
- Confidence: 0.95
- Claims: CL-0143c186f2ae58b4, CL-8051681057e7a9cd, CL-b739e359719a38c7
- Rationale: 证据显示 AMD 发布 Helios AI 系统，但当前公司列表为空，应补充 AMD。

### Instinct MI455X (EN-eab9999c377924ae)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Instinct MI455X / product / AMD
- Issues: company
- Confidence: 0.95
- Claims: CL-6212c68629b73001, CL-02fdf0c306a3a67d
- Rationale: 证据明确显示AMD发布Instinct MI455X，当前公司为空，应补充为AMD。

### Instinct MI455X AI (EN-1e87a708856ea16d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Instinct MI455X AI / product / AMD
- Issues: company
- Confidence: 0.95
- Claims: CL-02fdf0c306a3a67d, CL-3174954e19d3683b
- Rationale: 证据显示AMD发布Instinct MI455X AI加速器，当前公司为空，应补充为AMD。

### Intelligent Terminal (EN-f8ceb65dd1764cd4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Intelligent Terminal / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-7b3da75ee3eee173, CL-e1c4bb634f348b94, CL-fff01b9449a39855
- Rationale: 证据显示微软推出了Intelligent Terminal，当前公司列表为空，应归属Microsoft。

### Interactions API (EN-2360133a02c078a8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Interactions API / product / Google
- Issues: company
- Confidence: 0.95
- Claims: CL-59445c7295de43cc
- Rationale: 证据显示Interactions API由Google Deepmind（属于Google）作为默认接口，表明产品由Google发布。当前company_names为空，应补充为Google。

### Introduces Maestro Case (EN-27c0390d5f3de698)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Introduces Maestro Case / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-9f53fed93458f1a8
- Rationale: 证据显示UiPath发布了Maestro Case，这是一个AI原生案例管理能力，属于产品。但当前公司字段为空，证据中明确提到UiPath，但未直接声明UiPath是发布者或拥有者，仅提及'announced'，因此公司字段证据不足，标记为需要审查。

### Introducing Claude Opus 4.8 (EN-876fd4f1c5320cc4)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Introducing Claude Opus 4.8 / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-c7786252962e5ed7
- Rationale: 证据提及Claude Opus 4.8模型及定价变化，属于产品。但未明确声明所属公司，仅提及'fast mode for Opus 4.8'，无直接所有权声明，公司字段需补充。

### Introducing Gemini Enterprise (EN-5567ce1995cc85d7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Introducing Gemini Enterprise / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-5912581fa2dc70b8
- Rationale: 证据显示Google Cloud发布了Gemini Enterprise Agent平台，属于产品。但当前公司字段为空，证据中Google Cloud是发布者，但未直接声明所有权，需补充公司信息。

### Keep (EN-4e80857d445cea34)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: - / product / Google
- Issues: company
- Confidence: 0.8
- Claims: CL-51ad135c82b9455b
- Rationale: 名称'Keep'是Google服务/产品，证据中Google增加了对Tasks和Keep的支持，表明Keep是Google的产品，当前公司字段为空，应补充Google。

### Ling-3.0-flash (EN-8989aada6eb4a4c3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Ling-3.0-flash / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-0905882f05086f45, CL-28f467ec31f53f91, CL-315b3e77ed185068
- Rationale: 证据显示蚂蚁集团发布了该模型，但当前公司字段为空，需补充蚂蚁集团。

### Llama API (EN-5b76e682643efda7)

- Decision: requires_review
- Current type / company: product / -
- Proposed: Llama API / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-fc300cf26339c37e, CL-368028d4325f1c06, CL-60b815ce658fe627
- Rationale: 证据显示Meta下线该API，但当前公司字段为空，需补充Meta。

### Lynx (EN-48d357471ca207b8)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Lynx / product / Tigera
- Issues: company
- Confidence: 0.85
- Claims: CL-28f53e06690eb1ab
- Rationale: 证据显示 Tigera 发布了产品 Lynx，当前公司字段为空，建议补充公司为 Tigera。

### M-Files Custom Agents (Beta) (EN-b465eebe35e3889a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: M-Files Custom Agents (Beta) / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-23c756ddc6d7a867, CL-8d31cb4dd0cdd635
- Rationale: 证据显示M-Files发布了该产品，但当前公司名为空，且无证据表明M-Files是公司而非产品。需补充公司信息。

### M-Robots OS 2.0 (EN-80ea42a231357d12)

- Decision: requires_review
- Current type / company: product / -
- Proposed: M-Robots OS 2.0 / product / -
- Issues: company
- Confidence: 0.8
- Claims: CL-c1f4199a021ea02a, CL-4bb257a6d8170957, CL-53d42ff7b84a2843
- Rationale: 证据显示深开鸿发布该操作系统，但当前公司字段为空，需补充深开鸿。

### MAI-Thinking-1 (EN-1f8a924e62194552)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MAI-Thinking-1 / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-1aea9f343691d1ff, CL-4f184a6088c1fe4b
- Rationale: 证据显示微软推出MAI-Thinking-1模型，但当前公司列表为空，应补充Microsoft。

### MAI-Transcribe-1.5 (EN-72d74884ff03d39c)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MAI-Transcribe-1.5 / product / Microsoft
- Issues: company
- Confidence: 0.9
- Claims: CL-4287c28c44de797b, CL-dddcf80426ef8ef4
- Rationale: 证据显示Microsoft AI推出MAI-Transcribe-1.5，建议补充公司为Microsoft。

### MattoBoard (EN-45066a1a95a3a0f2)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MattoBoard / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-0ab85bc911845c03, CL-25bcdd5994eed390
- Rationale: 证据描述MattoBoard为3D情绪板与市场产品，但未明确提及所属公司名称，当前公司列表为空，无法确认归属。

### MCP (EN-b60e6df651264e14)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MCP / product / Maybern
- Issues: company
- Confidence: 0.85
- Claims: CL-6f112fcf5e02796f
- Rationale: 证据显示Maybern发布了MCP产品，应归属Maybern而非空。

### MCP Connector (EN-d7f998cb97f37349)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MCP Connector / product / Smartsheet
- Issues: company
- Confidence: 0.9
- Claims: CL-7c1f8792fffc831d
- Rationale: 证据显示Smartsheet发布了该连接器产品，应归属Smartsheet。

### MCP Connector for (EN-46045341ebce3cd6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MCP Connector for / product / Smartsheet
- Issues: name, company
- Confidence: 0.8
- Claims: CL-7c1f8792fffc831d
- Rationale: 名称不完整，证据显示Smartsheet发布了该连接器，应归属Smartsheet。

### MiniCPM (EN-12a81529bba89666)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MiniCPM / product / 面壁智能
- Issues: company
- Confidence: 0.9
- Claims: CL-6ec9ec2903819053, CL-e036cc41f39e2bd4, CL-0b9269713872b516
- Rationale: 证据显示面壁智能自主研发并发布MiniCPM系列端侧模型，明确支持面壁智能是开发/发布方，应补充current_company_names。

### MiniMax 2.7 Trillion Parameter Model (EN-cf5378a2305a999f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MiniMax 2.7 Trillion Parameter Model / product / MiniMax
- Issues: company
- Confidence: 0.95
- Claims: CL-5b1c1ec9e1d977ba, CL-837ef054f32e38ca, CL-bdf2be420c647faa
- Rationale: 证据表明MiniMax计划开源该模型，MiniMax是开发/发布方，应补充current_company_names。

### MTT S5000 (EN-7d48744f8d0f0657)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MTT S5000 / product / 摩尔线程
- Issues: company
- Confidence: 0.9
- Claims: CL-d84fef6e4d16816a, CL-49496920ca14ae8c, CL-83769eab21cfffcc
- Rationale: 证据提到摩尔线程推出MTT S5000，摩尔线程是开发/发布方，应补充current_company_names。

### MuleRun (EN-1725c58362aadc2a)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: MuleRun / product / 阿里巴巴
- Issues: company
- Confidence: 0.85
- Claims: CL-404e2f09a3ef7471, CL-987b6b91845064eb, CL-b28fcafff0a14b4d
- Rationale: 证据显示阿里巴巴计划整合MuleRun产品，阿里巴巴是拥有/运营方，应补充current_company_names。

### Mythos AI (EN-c8185a1a8a6595ad)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Mythos AI / product / Anthropic
- Issues: company
- Confidence: 0.85
- Claims: CL-5572124dcc10c5ad, CL-c55c682ea203271e
- Rationale: 证据明确Anthropic开发Mythos AI工具，应补充公司名称。

### NemoClaw (EN-ab9e3beebd83960d)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NemoClaw / product / NVIDIA
- Issues: company
- Confidence: 0.9
- Claims: CL-763c596f78cb7f74, CL-8ee78257d6ea9b9f, CL-b0e16c8146dc5224
- Rationale: 证据显示NVIDIA推出NemoClaw平台，当前公司字段为空，应补充为NVIDIA。

### North Mini Code (EN-833cd615d86b73ca)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: North Mini Code / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-e8ba0d81b2700e89, CL-15111d0a7d902419
- Rationale: 证据显示Cohere发布North Mini Code模型，但当前公司名称为空，需补充公司信息。

### NotebookLM (EN-7496c16a89e136e6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NotebookLM / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-f723ec5f7128c2b4
- Rationale: 证据显示Google将NotebookLM更名为Gemini Notebook，但当前公司名称为空，需补充Google。

### NousCoder-14B (EN-761c4b9294ee43a7)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NousCoder-14B / product / Nous Research
- Issues: company
- Confidence: 0.95
- Claims: CL-e828e0ea08beaf67
- Rationale: 证据显示Nous Research发布了名为NousCoder-14B的编程模型，明确产品归属。当前公司名为空，应填入Nous Research。

### NPO (EN-581b48f2032c9621)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: NPO / product / -
- Issues: company
- Confidence: 0.7
- Claims: CL-136ba5c1ac1faec3, CL-4803481bd6c46420, CL-940b75befd32b922
- Rationale: 壁仞科技推出NPO方案，但证据未明确显示NPO是壁仞科技的产品（可能为方案名称），当前公司列表为空，保留现状。

### On-Premises Agentic AI (EN-c4de175a35d9d9d1)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: On-Premises Agentic AI / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-ad5e85b0afa3f6c2
- Rationale: 证据显示UiPath发布本地部署智能体AI能力，但当前公司名称为空，需补充UiPath。

### OpenCode (EN-b644c0a9d493976a)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0.5
- Claims: CL-972909f107eb213a, CL-98568a4769d6cba5, CL-56f2e0c1154392a0
- Rationale: 证据将OpenCode与Claude Code对比，并提到小米基于OpenCode开发，但未明确OpenCode的所属公司。

### OpenWorker (EN-833940e4d17c9df3)

- Decision: requires_review
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company
- Confidence: 0.5
- Claims: CL-1a8071d4f4d0b3cd, CL-38ab9e83066a167b, CL-51f8e5ff59682997
- Rationale: 证据显示Andrew Ng发布了OpenWorker，但Andrew Ng是个人而非公司，当前公司字段为空，需确认是否应归为个人发布。

### Orca (EN-4d8ee3ec190ebf35)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Orca / product / 北京智源
- Issues: company
- Confidence: 0.9
- Claims: CL-94b09f30f734236f, CL-b40da776a8cd0ce7
- Rationale: 证据中Claim明确显示北京智源（Beijing Academy of Artificial Intelligence）发布了Orca模型，当前公司字段为空，应补充为北京智源。

### Outcome-Based Pricing (EN-a6ed199f8859e462)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Outcome-Based Pricing / product / Intercom
- Issues: company
- Confidence: 0.9
- Claims: CL-7a2d6d9738b7b016
- Rationale: 证据显示Outcome-Based Pricing是Intercom为其Fin AI推出的定价模式，属于产品特性。当前company_names为空，应补充Intercom。

### Parallel Web Search (EN-7a6d113e2d376015)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Parallel Web Search / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-724d4050ecf3fcf2
- Rationale: 证据显示Parallel Web Search是Gemini Enterprise Agent Platform的一项功能，通过Google Cloud Marketplace提供。当前company_names为空，应补充Google。

### Pixel (EN-afe83c198e329ef2)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: evidence
- Confidence: 0
- Claims: -
- Rationale: 证据中仅提及Pixel作为设备系列名称，但无任何Claim明确证明Pixel是某个公司发布的产品，无法确认公司归属。

### Precursor (EN-7099a2200559e508)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Precursor / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-6f6b0b46fcc12dac, CL-8b30e9fc10c6508f, CL-a3387598db51ee73
- Rationale: 证据显示Cloudflare推出Precursor，但current_company_names为空，需补充公司信息。

### Project Indigo (EN-419f2cd96ee122e3)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Project Indigo / product / Adobe
- Issues: company
- Confidence: 0.95
- Claims: CL-6c1695609b367e3d, CL-c3a677c5071160a3, CL-1bb286d7b194f0ef
- Rationale: 证据明确显示 Project Indigo 是 Adobe 的实验性相机应用，属于产品。当前公司字段为空，应补充为 Adobe。

### Project Indigo 1.1 (EN-e86f78ed260caf24)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Project Indigo 1.1 / product / Adobe
- Issues: company
- Confidence: 0.95
- Claims: CL-fae01c88202346d1, CL-8c436aaac417b068, CL-c81733bd753cbdff
- Rationale: 证据明确显示 Project Indigo 1.1 是 Adobe 的产品版本。当前公司字段为空，应补充为 Adobe。

### Proton Order & Quote Entry Automation (EN-076804bec879d667)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Proton Order & Quote Entry Automation / product / Proton.ai
- Issues: company
- Confidence: 0.9
- Claims: CL-827ed4416c2a6307
- Rationale: 证据明确显示Proton.ai发布该产品，当前公司名为空，应补充Proton.ai。

### QoderWork (EN-09c344df70df9660)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: QoderWork / product / Alibaba
- Issues: company
- Confidence: 0.95
- Claims: CL-404e2f09a3ef7471, CL-b28fcafff0a14b4d, CL-f2d4b04a0a1dd78d
- Rationale: 证据明确 QoderWork 是阿里巴巴的桌面 AI 智能体工具，属于产品。当前公司字段为空，应补充为 Alibaba。

### Quests (EN-76dc4156f3e14597)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Quests / product / Bluesky
- Issues: company
- Confidence: 0.95
- Claims: CL-3e7029c150ca3774, CL-89702df940cdd1d8, CL-5a9a3eedbe48d41e
- Rationale: 证据显示 Quests 是 Bluesky 为其 AI 助手 Attie 新增的功能，属于产品特性。当前公司字段为空，应补充为 Bluesky。

### Quote Entry Automation (EN-c21867c45d603d0b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Quote Entry Automation / product / Proton.ai
- Issues: company
- Confidence: 0.9
- Claims: CL-827ed4416c2a6307
- Rationale: 证据显示“Quote Entry Automation”是Proton.ai发布的产品“Proton Order & Quote Entry Automation”的一部分，当前无所属公司，建议补充Proton.ai。

### Qwen3.8 (EN-0f553f48551aef83)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Qwen3.8 / product / Alibaba
- Issues: company
- Confidence: 0.95
- Claims: CL-2a291114dd799b88, CL-2e4e6649f19166e7, CL-79511cdc077fcaa5
- Rationale: 证据显示 Qwen3.8 是阿里最新旗舰模型，属于产品。当前公司字段为空，应补充为 Alibaba。

### RegattaDB (EN-5f6367300dabc238)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: RegattaDB / product / Regatta Data
- Issues: company
- Confidence: 0.9
- Claims: CL-442ef4ea70dab9f9
- Rationale: 新闻稿中Regatta Data宣布发布RegattaDB，当前公司名为空，应补充为Regatta Data。

### Robostral Navigate (EN-994f9b7ac2d11473)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Robostral Navigate / product / Mistral
- Issues: company
- Confidence: 0.9
- Claims: CL-a37cbd6c6489aec5
- Rationale: 证据明确说明Mistral发布该模型，属于产品。当前公司为空，应补充为Mistral。

### ROCm 7.14 (EN-6066d80012446517)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ROCm 7.14 / product / AMD
- Issues: company
- Confidence: 0.9
- Claims: CL-0a453ae27b7c1567, CL-7d48a848272f329d, CL-00b4ec8c054d2146
- Rationale: 证据显示AMD在ROCm 7.14中新增支持，ROCm是AMD的产品，当前公司名为空，应补充为AMD。

### RTX PRO 6000 (EN-65b3aa2f527deeef)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: RTX PRO 6000 / product / NVIDIA
- Issues: company
- Confidence: 0.9
- Claims: CL-9cc98d31288c9ff7, CL-fa424945c58620bc
- Rationale: 证据显示Supermicro支持NVIDIA RTX PRO 6000，该产品由NVIDIA制造，当前公司名为空，应补充为NVIDIA。

### S 30 (EN-59252e364ef9a41f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: S 30 / product / Soofi 联盟
- Issues: company
- Confidence: 0.9
- Claims: CL-ecbd398d1cee8977
- Rationale: 证据显示Soofi联盟发布该模型，属于产品。当前公司为空，应补充为Soofi联盟。

### Safari Technology Preview 247 (EN-e13642b766c1f8d1)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Safari Technology Preview 247 / product / Apple
- Issues: company
- Confidence: 0.9
- Claims: CL-e0d5c7d729d4aed0
- Rationale: 证据显示Apple发布该技术预览版，属于产品。当前公司为空，应补充为Apple。

### Search (EN-dd782f5241cd7e50)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Search / product / Google
- Issues: company
- Confidence: 0.85
- Claims: CL-8aa5913ecc6b8be7
- Rationale: 证据提到Google搜索的AI图像生成功能，但Search作为产品名过于泛化，且未明确公司归属，需补充。

### Self-Serve Inference Deployments (EN-f8c237773fe24a98)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Self-Serve Inference Deployments / product / Crusoe
- Issues: company
- Confidence: 0.9
- Claims: CL-0296823c8ca00f22, CL-b6401dd6d9f46a12
- Rationale: 证据显示Crusoe推出Self-Serve Deployments，应归属Crusoe公司，当前公司列表为空。

### Server Edition GPUs (EN-8f451ae7730ddb67)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Server Edition GPUs / product / NVIDIA
- Issues: company
- Confidence: 0.85
- Claims: CL-76a95a4a201509d2
- Rationale: 证据提到HPE AI Factory使用NVIDIA RTX PRO Blackwell Server Edition GPUs，但产品本身属于NVIDIA，当前公司为空，需修正。

### Serverless Fine-Tuning (EN-2b5e92d1908d42f6)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Serverless Fine-Tuning / product / Crusoe
- Issues: company
- Confidence: 0.9
- Claims: CL-0296823c8ca00f22, CL-b6401dd6d9f46a12
- Rationale: 证据显示Crusoe推出Serverless Fine-Tuning，当前公司列表为空，应归属Crusoe。

### SQRL (EN-833cc1efccceb180)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: SQRL / product / Feyn AI
- Issues: company
- Confidence: 0.95
- Claims: CL-b0791a07fdf6acf3, CL-b2fa7fd810072a42
- Rationale: 证据显示Feyn AI发布了SQRL模型族，当前缺少关联公司，应添加Feyn AI。

### Sting Ray (EN-f53afc9370d87317)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Sting Ray / product / TokyoArtisan Intelligence
- Issues: company
- Confidence: 0.95
- Claims: CL-87254c3fba0aa3ec
- Rationale: 证据显示TokyoArtisan Intelligence完成了Sting Ray芯片原型验证，当前缺少关联公司，应添加TokyoArtisan Intelligence。

### StoryKit (EN-c2624a0c7838487f)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: StoryKit / product / Meta
- Issues: company
- Confidence: 0.95
- Claims: CL-80583475af66b4af
- Rationale: 证据显示Meta正在开发StoryKit应用，当前缺少关联公司，应添加Meta。

### Studio (EN-419f38e27e81e1f1)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Studio / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-f47ca11b3cce6401
- Rationale: 证据显示“Setset Studio”是一个产品发布，但未明确声明Setset是开发或发布该产品的公司，因此公司字段为空是合理的。

### Surface Laptop Ultra (EN-4c66141fde69a497)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Surface Laptop Ultra / product / 微软
- Issues: company
- Confidence: 0.95
- Claims: CL-aef210c47613a275
- Rationale: 证据中微软明确表示该产品由其发布，因此应添加微软为公司。

### T-Head SAIL (EN-5398729239788ca5)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: T-Head SAIL / product / -
- Issues: company
- Confidence: 0.9
- Claims: CL-29ef28cd664376e4, CL-391fc36b78a2ade0, CL-85b848bd100ce23d
- Rationale: 证据显示T-Head SAIL是一个被开源的软件栈，属于产品。但没有任何一条声明明确说明其开发或发布公司，因此当前公司字段为空是合理的，但缺少公司信息需要标注。

### T7 AI Interconnect Platform (EN-9c515f4c878bdb2e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: T7 AI Interconnect Platform / product / Chelsio
- Issues: company
- Confidence: 0.95
- Claims: CL-6d446e6da55bdde6, CL-7a606b483bf24c80, CL-9a80556cc27c0403
- Rationale: 证据中Chelsio明确发布该平台，属于产品。当前公司字段为空，应补充为Chelsio。

### Tasks (EN-2e0d0d78480f0cac)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Tasks / product / Google
- Issues: company
- Confidence: 0.9
- Claims: CL-51ad135c82b9455b
- Rationale: 证据显示Google为Gemini Spark添加了Tasks支持，暗示Tasks是Google的产品，应添加公司。

### TPU Developer Hub (EN-094b0c7d2d7a382e)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: TPU Developer Hub / product / Google
- Issues: company
- Confidence: 0.95
- Claims: CL-1781673ba2a165aa, CL-2cb4260e9ce8493a, CL-7662823a90569cbd
- Rationale: 证据显示该Hub由Google发布，属于产品。当前公司字段为空，应补充为Google。

### TPU v9 (EN-1cd41545564777ce)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: TPU v9 / product / 谷歌
- Issues: company
- Confidence: 0.95
- Claims: CL-df5ef5e62cf87b4e
- Rationale: 证据明确提到谷歌开发TPU v9芯片，应添加谷歌为公司。

### V9X AI (EN-bfa86ed4368cf7d0)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: V9X AI / product / 长城汽车
- Issues: company
- Confidence: 0.9
- Claims: CL-a4fa8902bc6f865c
- Rationale: 证据CL-a4fa8902bc6f865c明确提到'长城汽车旗下魏牌 V9X'，表明长城汽车是发布方，应补充公司名称。

### Veea Announces (EN-c9db5a13a1b509b2)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Veea Announces / product / Veea Inc.
- Issues: name, company
- Confidence: 0.85
- Claims: CL-acdcdd157aa5237c
- Rationale: 名称'Veea Announces'是动词短语，非产品名；证据显示Veea Inc.发布解决方案，但未明确产品名称为'Veea Announces'，需修正名称并补充公司。

### VeeaONE Distributed Intelligence (EN-bedb12f1287b2f70)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: VeeaONE Distributed Intelligence / product / Veea Inc.
- Issues: company
- Confidence: 0.9
- Claims: CL-acdcdd157aa5237c
- Rationale: 证据CL-acdcdd157aa5237c提到Veea Inc.宣布全栈解决方案可用，但未明确提及'VeeaONE'名称；需补充公司名称Veea Inc.。

### Vera Rubin NVL72 (EN-9f39a037ee96670b)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: Vera Rubin NVL72 / product / NVIDIA
- Issues: company
- Confidence: 0.9
- Claims: CL-d3be7a0f70319fd1
- Rationale: 证据CL-d3be7a0f70319fd1提到NVIDIA Vera Rubin NVL72，表明NVIDIA是所属公司，应补充公司名称。

### Visual Studio 2026 (EN-b6779d8d1c36e158)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据仅提及Visual Studio 2026发布，未明确指明所属公司，无法确认公司归属。

### WEEBILL 5 (EN-62a4b84fb5a8f6b0)

- Decision: insufficient_evidence
- Current type / company: product / -
- Proposed: - / - / -
- Issues: company, evidence
- Confidence: 0
- Claims: -
- Rationale: 证据仅提及智云WEEBILL 5发布，但未明确指明所属公司，无法确认公司归属。

### ZCode (EN-bc77259c5d2eb341)

- Decision: correction_candidate
- Current type / company: product / -
- Proposed: ZCode / product / 智谱AI
- Issues: company
- Confidence: 0.95
- Claims: CL-561e07b12fe3bead, CL-8d3f53e900c124b2
- Rationale: 证据明确显示智谱AI（Zhipu AI）发布了ZCode，当前公司字段为空，应补充为智谱AI。
