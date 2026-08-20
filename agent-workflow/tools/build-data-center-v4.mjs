#!/usr/bin/env node

import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { extractExplicitProductNames } from "../product/product-entity-normalizer.mjs";
import { buildEventDisplayTitle, isCompletePublicEventTitle } from "./event-public-title.mjs";
import { loadSourceIntakeEntries, readSourceIntake } from "./lib/source-intake-v1.mjs";
import {
  availablePrivateEvidenceDates,
  evidenceRef,
  loadPrivateEvidenceEntries,
} from "./lib/private-evidence-store.mjs";
import { normalizeEvidenceBody } from "./lib/evidence-body-normalizer.mjs";
import {
  chinaMarketBasisType,
  chinaMarketMatch,
  chinaMarketOrganizationAliases,
  loadChinaMarketConfig,
} from "./lib/china-market-v1.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");
const rawRoot = path.join(root, "01-SiteV2/content/01-raw/originals");
const outputRoot = path.join(root, "01-SiteV2/content/11-databases/data-center-v4");
const modelAssistRoot = path.join(root, "01-SiteV2/content/11-databases/model-assist-v1");
const taxonomyPath = path.join(root, "agent-workflow/product/tag-taxonomy-v4.json");
const chinaMarketConfig = loadChinaMarketConfig(root);

const VERSION = Object.freeze({
  product: "SITE-V4.0-data-center",
  raw: "RAW-V4.0",
  event: "EVENT-V1.1",
  fde: "FDE-V2.0",
  fdeObservation: "FDE-OBSERVATION-V1.0",
  hardware: "HARDWARE-V1.0",
  hardwareFact: "HARDWARE-FACT-V1.0",
  hardwareSnapshot: "HARDWARE-SNAPSHOT-V1.0",
  monitoringFunnel: "LENS-FUNNEL-V1.0",
  tag: "TAG-V4.1"
});

const EVENT_RULES = [
  ["acquisition", /\b(?:acquires?|acquired|acquisition|merges? with|merged with)\b|收购|并购|合并/iu],
  ["lawsuit_settlement", /\b(?:sues?|sued|lawsuit|settles?|settlement|antitrust action|trademark dispute|legal challenge|court ruled)\b|起诉|诉讼|和解|反垄断|商标纠纷|败诉|驳回注册/iu],
  ["funding", /\b(?:raises?|raised|closes?|closed|nabs?|landed)\b(?=.{0,80}(?:[$€£¥]\s?\d|\b(?:funding|financing|investment|series|seed|round)\b))|\b(?:funding round|financing round|series [a-z])\b|\blaunch(?:es|ed)? with [$€£¥]\s?\d|\b(?:secures?|secured)\b(?=.{0,60}\b(?:funding|financing|investment|series|seed|round)\b|.{0,60}[$€£¥]\s?\d)|融资|获投|募资|完成.*轮/iu],
  ["ipo_listing", /\b(?:files?|filed|filing|plans?|planned)?\s*(?:for\s+)?(?:an?\s+)?(?:ipo|initial public offering)\b|\b(?:public listing|stock market listing)\b|首次公开募股|递交.{0,30}(?:IPO|上市申请)|上市聆讯|公开发行股票/iu],
  ["capital_investment", /\b(?:invests?|invested|investment|capital expenditure|capex)\b.{0,100}\b(?:data cent(?:er|re)|ai infrastructure|compute infrastructure|fab|factory|campus|capacity)\b|资本开支|投资.{0,80}(?:数据中心|AI基础设施|人工智能基础设施|算力基础设施|晶圆厂|工厂|园区|产能)/iu],
  ["financial_performance", /\b(?:reports?|reported|reaches?|reached|grew|increases?|increased)\b.{0,80}\b(?:revenue|arr|annual recurring revenue|profit|earnings|sales)\b|\b(?:revenue|arr|annual recurring revenue|profit|earnings|sales)\b.{0,50}\b(?:grew|growth|reaches?|reached|increases?|increased|exceeds?|surpasses?)\b|(?:营收|收入|利润|销售额|年度经常性收入).{0,50}(?:增长|达到|超(?:过|越)?|突破|同比|环比|报告|披露|减值)/iu],
  ["partnership", /\b(?:partners? with|partnership|collaborat(?:es?|ion)|alliance|integrat(?:es?|ion)\s+with)\b|合作|伙伴关系|结盟|接入/iu],
  ["procurement_contract", /\b(?:procurement agreement|signs? .{0,50}contract|enters? (?:into )?.{0,50}contract|tender|awarded? .{0,50}contract|selected .{0,50}provider)\b|采购|招标|中标|签署.{0,30}合同|达成.{0,30}合同/iu],
  ["market_expansion", /\b(?:opens?|opened)\b.{0,50}\b(?:office|hub|headquarters)\b|\b(?:expands?|expanded|enters?|entered)\b.{0,50}\b(?:market|region|country)\b|市场扩张|进入.{0,30}(?:市场|地区)|开设.{0,30}(?:办公室|中心|总部)/iu],
  ["organization_restructuring", /\b(?:lays? off|laid off|layoffs?|workforce reduction|restructur(?:es?|ed|ing)|bankruptcy|insolvency|liquidation)\b|裁员|组织重组|业务重组|破产|清算/iu],
  ["certification_compliance", /\b(?:obtains?|obtained|earns?|earned|receives?|received|achieves?|achieved)\b.{0,60}\b(?:certification|certified|iso\/iec)\b|通过.{0,30}认证|获得.{0,30}认证|取得.{0,30}认证/iu],
  ["security_incident", /\b(?:suffers?|suffered|discloses?|disclosed|confirms?|confirmed|fixes?|fixed)\b.{0,80}\b(?:security breach|data breach|cyberattack|vulnerability|data leak|outage)\b|遭遇.{0,40}(?:安全事件|数据泄露|网络攻击|宕机)|披露.{0,40}(?:漏洞|数据泄露|安全事件)|修复.{0,40}(?:安全漏洞|高危漏洞)/iu],
  ["hardware_capacity", /\b(?:fab capacity|manufacturing capacity|production capacity|wafer capacity)\b|晶圆产能|制造产能|扩产/iu],
  ["hardware_supply", /\b(?:chip supply|gpu supply|semiconductor supply|ship(?:s|ped)? .*(?:chips?|gpus?|accelerators?)|deliver(?:s|ed) .*(?:chips?|gpus?|accelerators?)|(?:buys?|orders?|purchases?) .{0,80}(?:chips?|gpus?|accelerators?))\b|芯片供应|GPU供应|出货.*(?:芯片|GPU)|交付.*(?:芯片|GPU)|(?:购买|订购|采购).{0,40}(?:芯片|GPU|加速器)/iu],
  ["hardware_deployment", /\b(?:deploys?|deployed|installs?|installed)\b.{0,80}\b(?:gpu|accelerator|server|cluster|data cent(?:er|re))\b|部署.{0,40}(?:GPU|芯片|服务器|集群|数据中心)/iu],
  ["pricing_change", /\b(?:price|pricing|subscription|billing)\b.{0,40}\b(?:changes?|changed|increases?|decreases?|cuts?|launches?)\b|调价|定价|计费变化|降价|涨价/iu],
  ["policy_regulation", /\b(?:regulator|regulation|policy|executive order|approved by|banned by|European Commission.{0,100}(?:announced|requires?|orders?|binding|DMA measures)|(?:commission|authority|regulator).{0,80}(?:requires?|orders?|rules?))\b|监管|法规|政策|行政令|批准|禁令|(?:欧盟|网信|监管|政府|有关部门).{0,50}(?:备案|公告|公布|要求|裁定)|(?:人工智能法案|AI\s*法案|AI\s*透明度准则).{0,50}(?:生效|实施|要求)|备案信息/iu],
  ["standard_specification", /\b(?:publishes?|published|releases?|released|adopts?|adopted)\b.{0,70}\b(?:(?:open )?technical specification|open specification|industry standard|technical standard|protocol)\b|发布.{0,40}(?:技术规范|开放规范|行业标准|技术标准|协议)|制定.{0,40}(?:行业标准|技术标准|技术规范)|(?:技术)?规范.{0,24}(?:发布|更新|生效)/iu],
  ["deployment", /\b(?:deploy(?:s|ed|ing)?|rolls? out|rolled out|implement(?:s|ed|ing)?|goes? live|pilots?|piloted)\b|部署|上线|落地|试点|实施/iu],
  ["research_result", /\b(?:study|research|benchmark|paper|report)\b.{0,70}\b(?:finds?|shows?|reports?|achieves?|usage|gap)\b|(?:研究(?!员)|论文|基准|报告).{0,50}(?:显示|表明|达到|结果|差距|用量|增长|下降|登顶|占比)/iu],
  ["organization_people", /\b(?:appoints?|appointed|hires?|hired|joins?|joined|resigns?|leaves?|depart(?:s|ed)?)\b|任命|加入|离职|辞任|聘任/iu],
  ["model_release", /\b(?:releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|open[- ]sources?)\b.{0,90}\b(?:model|llm|foundation model)\b|发布.{0,40}(?:模型|大模型)|推出.{0,40}(?:模型|大模型)|开源.{0,50}(?:模型|大模型)|(?:模型|大模型).{0,30}开源/iu],
  ["hardware_product", /\b(?:releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|ships?|shipped|debuts?|expands?|adds?)\b.{0,90}\b(?:gpus?|chips?|processors?|accelerators?|servers?|computers?(?!\s+vision)|devices?|robots?|glasses|keyboards?|npus?|chiplets?|modules?)\b|(?:发布|推出|扩展|新增).{0,80}(?:芯片|GPU|服务器|计算机(?!视觉)|设备|机器人|眼镜|键盘|NPU|芯粒|工作站|模组)|(?:硬件|键盘|设备|计算机(?!视觉)|工作站|模组).{0,40}(?:登场|亮相|新增|扩展)/iu],
  ["service_change", /\b(?:discontinues?|discontinued|shuts? down|sunsets?|removes?|removed)\b|停止服务|关闭服务|下线|移除功能/iu],
  ["product_release", /\b(?:releases?|released|launch(?:es|ed)?|introduces?|introduced|unveils?|unveiled|adds?|added|open[- ]sources?)\b|发布|推出|上线新|新增|宣布开源|开源.{0,50}(?:工具|框架|软件)/iu]
];

const SPECIAL_EVENT_RULES = [
  ["capital_investment", /\bparticipates?\s+in\s+(?:the\s+)?(?:a\s+)?new\s+financing\s+round\b/iu],
  ["policy_regulation", /备案|filed? with .{0,40}(?:regulator|authority)/iu],
  ["organization_people", /\b(?:resigns?|resigned|leaves?|left)\b|辞职|离职/iu],
  ["research_result", /\b(?:introduces?|introduced|describes?|described|presents?|presented)\b.{0,80}\binternal\b.{0,40}\b(?:model|system)\b|(?:介绍|披露).{0,60}内部.{0,30}(?:模型|系统)/iu],
  ["research_result", /\b(?:releas(?:e|es|ed|ing)|publish(?:es|ed|ing)?)\b.{0,80}\b(?:benchmark|evaluation dataset)\b|(?:发布|推出).{0,60}(?:基准|评测集)/iu],
  ["model_release", /\bKimi\s*K3\b.{0,80}(?:model|模型|上线|发布)|(?:model|模型|上线|发布).{0,80}\bKimi\s*K3\b/iu],
  ["hardware_product", /(?:发布|推出|亮相|launch(?:es|ed)?|release[sd]?).{0,50}(?:AI|人工智能).{0,20}(?:智能)?硬件|(?:AI|人工智能).{0,20}(?:智能)?硬件.{0,40}(?:发布|推出|亮相|launch(?:es|ed)?|release[sd]?)/iu],
  ["product_release", /\b1Password\b.{0,80}\bClaude\b|\bClaude\b.{0,80}\b1Password\b|\bLM Studio Bionic\b/iu],
  ["product_release", /\b(?:launch(?:es|ed)?|releases?|released|introduces?|introduced|unveils?|unveiled)\b.{0,100}\b(?:app|plugin|extension|tool|platform|service|workspace)\b|(?:发布|推出|上线).{0,60}(?:应用|插件|扩展|工具|平台|服务|工作台)/iu],
  ["product_release", /(?:上线|推出|发布).{0,18}(?:新功能|功能更新)|\brolls? out\b.{0,50}\b(?:feature|capability|update)\b/iu],
  ["hardware_deployment", /\b(?:gpus?|chips?|accelerators?|servers?|clusters?|network switches?|ethernet infrastructure|interconnects?)\b.{0,60}\b(?:deploy(?:s|ed|ment)?|install(?:s|ed|ation)?|rolls? out)\b|\b(?:deploy(?:s|ed|ment)?|install(?:s|ed|ation)?|rolls? out)\b.{0,60}\b(?:gpus?|chips?|accelerators?|servers?|clusters?|network switches?|ethernet infrastructure|interconnects?)\b|(?:GPU|芯片|加速器|服务器|集群|交换系统|以太网基础设施|互连).{0,50}(?:部署|落地|安装)|(?:部署|落地|安装).{0,50}(?:GPU|芯片|加速器|服务器|集群|交换系统|以太网基础设施|互连)/iu],
  ["hardware_deployment", /(?:发布|建设|推出|launch(?:es|ed)?|build(?:s|ing)?|construct(?:s|ing)?|unveil(?:s|ed)?).{0,100}(?:(?:国家级|national).{0,30}(?:AI|人工智能).{0,30}(?:infrastructure|factory|基础设施|数据中心)|(?:AI|人工智能).{0,20}(?:factory|data cent(?:er|re)|infrastructure|基础设施|数据中心|智算中心))/iu],
  ["funding", /完成.{0,30}(?:融资|募资)|\bcompleted\b.{0,40}\b(?:funding|financing)\b/iu],
  ["partnership", /合资成立|\b(?:forms?|creates?|establishes?)\b.{0,40}\bjoint venture\b|\bjoint venture\b/iu],
  ["product_release", /(?:桌面端|客户端|工作台).{0,30}(?:焕新|升级|更新)|\b(?:desktop|client|workbench)\b.{0,30}\b(?:refresh|upgrade|update)\b/iu],
  ["policy_regulation", /(?:推出|发布|制定|设立|成立).{0,30}(?:人工智能|AI).{0,20}(?:标准|规范|办公室|监管机构)|(?:人工智能|AI).{0,20}(?:标准|规范|办公室|监管机构).{0,30}(?:推出|发布|制定|设立|成立)|\b(?:launch|establish|create|publish)\b.{0,50}\bAI\b.{0,30}\b(?:standard|standards|office|regulator)\b/iu]
];

const LEAD_EVENT_RULES = [
  ["product_release", /(?:发布|推出|上线).{0,60}(?:AI\s*办公智能体|AI\s*智能体|智能体|模型)(?:.{0,40}(?:产品|应用|工具|平台|服务|专业版|助手))?|(?:AI|智能体|模型).{0,50}(?:同步)?发布|\b(?:launch(?:es|ed)?|releases?|released)\b.{0,100}\b(?:AI product|AI app|AI tool|AI platform|AI service)\b/iu],
  ["product_release", /\b(?:a new (?:ios|android|web )?app|the app['’]s launch|a new product|a new service)\b|一款新(?:应用|产品|服务)/iu]
];

const HIGH_SPECIFICITY_EVENT_RULES = [
  ["model_release", /\bGemini\s+Robotics\s+ER\s*2\b/iu],
  ["research_result", /\b(?:benchmark|strict grading|failures?)\b|(?:基准测试|评测研究)/iu],
  ["standard_specification", /(?:技术)?规范.{0,24}(?:发布|更新|生效)|(?:发布|更新).{0,30}(?:技术规范|开放规范|行业标准|技术标准|协议)/iu],
  ["policy_regulation", /(?:发布|制定).{0,40}(?:合规指引|监管指引)|(?:AI|人工智能|生成合成内容).{0,40}(?:须|必须|应当).{0,30}(?:标识|披露)|(?:AI|人工智能)法.{0,30}(?:立法|进程)|(?:立法|加快).{0,30}(?:AI|人工智能)法/iu],
  ["security_incident", /\b(?:cybersecurity|security)\s+incidents?\b|网络安全事件/iu],
  ["financial_performance", /(?:营收|收入|利润|销售额|年度经常性收入).{0,50}(?:增长|达到|超(?:过|越)?|突破|同比|环比|报告|披露|减值)|\b(?:revenue|arr|annual recurring revenue|profit|earnings|sales)\b.{0,50}\b(?:grew|growth|reaches?|reached|increases?|increased|exceeds?|surpasses?)\b/iu]
];

const OPINION_ONLY = /\b(?:says?|warns?|predicts?|criticizes?|argues?|believes?|interview)\b|表示|认为|警告|预测|直言|批评|访谈/iu;
const PROPOSAL_ONLY = /\b(?:predicts?|proposes?|suggests?|calls? for)\b|预言|提议|建议设立|呼吁设立/iu;
const NEGATED_OR_SPECULATIVE_EVENT = /(?:合作|收购|并购|融资).{0,20}(?:可能性较低|可能性不大|尚无计划|不会|不太可能)|\b(?:unlikely|not expected|no plans?)\b.{0,50}\b(?:partner|acquir|merge|rais)/iu;
const NON_AI_MERCHANDISE = /\b(?:merch(?:andise)?|basketball|t-?shirts?|hoodies?|apparel|swag)\b|官方周边|篮球|T\s*恤|卫衣/iu;
const RUMOR = /\b(?:rumou?r|reportedly|leak(?:ed)?)\b|传闻|爆料|泄露|据称|消息称|据.{0,10}消息/iu;
const DISPUTE = /\b(?:disputes?|disputed|denies?|denied|not (?:be )?final|could change)\b|否认|有争议|尚未最终确定|可能变化/iu;
const IN_PROGRESS = /\b(?:in talks|in discussions|negotiating|seeking to)\b|洽谈|讨论中|正在谈判/iu;
const PLANNED = /\b(?:plans? to|expected to|will|intends? to|proposed|set to be|to (?:launch|release|deploy|ship|introduce))\b|计划|预计|将|拟/iu;
const WITHDRAWN = /\b(?:withdrawn|withdraws?|cancelled|canceled)\b|撤回|取消/iu;
const COMPLETED = /\b(?:completed|closed|acquired|merged|raised|secured|launched|released|introduced|unveiled|shipped|deployed|implemented|appointed|joined|left)\b|完成|收购|合并|获得|融资|发布|推出|出货|部署|上线|任命|加入|离职/iu;
const BOILERPLATE_LINE = /^(?:(?:topics?|most popular|related articles?|view bio|register now|loading the next article|error loading|when you purchase through links|back to top|cookie settings?)\b|(?:相关文章|相关阅读|相关推荐|软媒旗下网站|스크롤 이동|상태바|기사본문))/iu;
const BOILERPLATE_TEXT = /^(?:most popular|loading the next article|error loading the next article|register now|cookie settings|when you purchase through links|스크롤 이동|상태바|기사본문|the body content)\b/iu;
const INFORMATIONAL_TITLE = /^(?:how\b|what\b|why\b|when\b|where\b|guide\b|cost\b|the cost\b)|\b(?:essential|complete|ultimate)\s+(?:guide|handbook)\b|\bcost to implement\b/iu;
const TRUNCATED_OR_NON_EVENT_TITLE = /(?:…|\.\.\.)|^(?:show hn:|ask hn:|launch hn:|open[- ]source\b|github\b|youtube\b|ep\s+\d+\b|hype\b|you need\b|frontier ai labs\b|if you\b)|\b(?:roadmap|playbook|handbook)\b.*\b(?:engineer|engineering|deployment)\b/iu;
const COMMUNITY_DISCOVERY_URL = /^https?:\/\/(?:www\.)?(?:facebook\.com\/groups\/|reddit\.com\/|news\.ycombinator\.com\/|linkedin\.com\/|youtube\.com\/|youtu\.be\/|podcasters\.spotify\.com\/|x\.com\/)/iu;
const GENERIC_NON_EVENT_TITLE = /^(?:top\s+\d+|\d+\s+best\b|best\b|hire\b)|^\d{4}年\d{1,2}月\d+\s*家.{0,30}(?:融资|初创)|^(?:情境感知的缺失|the missing context awareness)$|^(?:open\s+models?|AI\s+(?:industry|market))\s+recap\b|\b(?:role explained|job opening|careers page|marketplace listing|case studies index|TLDR)\b|(?:真正含义|what .{0,80}(?:means|is really saying))(?:\s*[|｜].*)?$/iu;
const REVIEWED_RETAINED_SOURCE = /^https?:\/\/(?:www\.)?aifundingtracker\.com\/top-50-ai-startups\/?$/iu;
const QUESTION_HEADLINE = /^(?:(?:can|could|will|would|is|are|do|does|did|should|has|have)\b|.{0,40}(?:能否|是否|会不会|可否)).*[?？]$/iu;
const GENERIC_INDEX_TITLE = /^(?:newsroom|enterprise ai news)(?:\s*(?:[\\|｜:—-])\s*.*)?$|^funding breaking news and press releases(?:\s+from\s+.*)?$|^(?:新闻室(?:\s*[\\|｜:—-]\s*.*)?|企业\s*AI\s*新闻|商业新闻融资快讯与新闻稿)$/iu;
const GENERIC_ROUNDUP_TITLE = /^硬科技投向标[|｜]|^(?:AI\s+giants?|AI\s+companies?|AI\s+startups?)\b.{0,100}\b(?:billions?|millions?|funding|investment|deployment)\b|^AI\s*(?:巨头|公司|初创企业).{0,80}(?:数十亿|数百万|融资|投资|部署)|^latest\s+open\s+(?:models?|artifacts?)\s*(?:\(#?\d+\)|#\d+)?\s*[:：]|^最新(?:开源)?(?:模型|产品|模型与产品)?(?:盘点|汇总)\s*(?:[（(]#?\d+[）)])?\s*[:：]|\b(?:daily|weekly)\s+(?:AI\s+)?(?:roundup|digest)\b|(?:每日|每周|本周).{0,20}(?:汇总|速览|快讯)/iu;
const REACTION_ONLY_TITLE = /(?:回应|谈及|评论).{0,60}(?:诉讼|传闻|争议)|(?:诉讼|传闻|争议).{0,60}(?:回应|表态)|\b(?:responds? to|comments? on)\b.{0,80}\b(?:lawsuit|rumou?r|controversy|dispute)\b/iu;
const RESEARCH_CONTAINER_TITLE = /\b(?:technology|industry|market|technical)?\s*report\b|\b(?:benchmark|research paper|whitepaper)\b|(?:技术|行业|市场|研究)?报告|基准测试|研究论文|白皮书/iu;
const EXPLICIT_AI_EVIDENCE = /\b(?:ai|agi|artificial intelligence|generative ai|genai|ai[- ](?:native|powered|generated|coding|assistant|assistants|agent|agents|model|models|system|systems|service|services|platform|platforms|tool|tools|chip|chips|hardware|infrastructure|workload|workloads|research|video)|agentic(?:\s+ai)?|large language models?|foundation models?|coding models?|vision[- ]language(?:[- ]action)? models?|multimodal(?:\s+moe)?|machine learning|deep learning|neural (?:network|networks|processing)|llms?|chatbots?|model inference|model training|open[- ]weight|npus?|edge ai|physical ai|embodied ai|computer vision|natural language processing)\b|人工智能|生成式\s*(?:人工智能|AI)|AI\s*(?:智能体|模型|系统|平台|服务|产品|工具|编程|助手|芯片|硬件|基础设施|应用|研究|视频|办公|手机|短剧|生产力|推理|训练|算力)|智能体|大模型|基础模型|编码模型|多模态|机器学习|深度学习|神经网络|生成模型|推理模型|世界模型|具身(?:智能|模型)|端侧生成式人工智能|模型服务|模型券|算力(?:集群|基础设施)/iu;
const NAMED_AI_EVIDENCE = /\b(?:OpenAI|Anthropic|ChatGPT|Claude|Gemini|DeepMind|DeepSeek|Qwen|Grok|xAI|Mistral(?: AI)?|Llama|Hugging Face|OpenRouter|Codex|Bedrock AgentCore|Thinking Machines Lab|FuriosaAI|InstaLILY|C3 AI|MiniMax|Moonshot AI|StepFun|Astribot|Helixon|Moffett AI|Lightwheel|RobotEra|MemoraX|Westlake Mind|Arcade\.dev)\b|豆包|混元|千问|月之暗面|阶跃星辰|生数科技|星海图|极佳视界|华深智药|墨芯(?:人工智能)?|微纳核芯|光轮智能|星动纪元|灵睿智芯|昉擎科技|西湖心辰|Kimi|灵犀专业版|WPS Comate/iu;
const GENERIC_VERTICAL_AI_PUBLICITY = /(?:我国|国内|全球)(?:首个|首款|首套).{0,80}(?:智慧|智能).{0,30}(?:大模型|系统)|(?:水风光|流域|气象|水文).{0,60}(?:智慧运营|大模型)/iu;
const ADMINISTRATIVE_AI_SUPPORT_PROGRAM = /(?:模型券|算力券|数据券).{0,100}(?:补贴|补助|申领|发放|优惠|兑付|平台)|(?:补贴|补助|申领|发放|优惠|兑付).{0,100}(?:模型券|算力券|数据券)/iu;
const AI_NATIVE_ORGANIZATIONS = new Set([
  "Anthropic",
  "C3 AI",
  "DeepSeek",
  "FuriosaAI",
  "Google DeepMind",
  "InstaLILY",
  "MiniMax",
  "Mistral AI",
  "OpenAI",
  "StepFun",
  "Thinking Machines Lab",
  "xAI"
].map((value) => value.toLocaleLowerCase()));
const JUDGMENT_KEYS = new Set([
  "importance", "importance_score", "importance_type", "value", "value_score", "impact", "impact_score",
  "opportunity", "opportunity_score", "pain_score", "trend_relevance", "trend_state", "trend_maturity",
  "business_meaning", "why_selected", "why_watch", "recommendation", "advice", "usable_for", "pool_routes",
  "emerging_signal_score", "guanlan_relevance", "interview_priority"
]);

const DEVELOPER_PACKAGE_NAME = String.raw`(?:@[a-z0-9._-]+\/)?[a-z][a-z0-9]*(?:[-_.][a-z0-9]+)*`;
const DEVELOPER_PACKAGE_VERSION = String.raw`v?\d+\.\d+(?:\.\d+)?(?:[-.]?(?:a|alpha|b|beta|rc|dev)\d*)?(?:[-+][a-z0-9.-]+)?`;
const VERSIONED_DEVELOPER_PACKAGE_TITLE = new RegExp(
  `^${DEVELOPER_PACKAGE_NAME}\\s+${DEVELOPER_PACKAGE_VERSION}(?:\\s+发布)?$`,
  "iu",
);
const VERSIONED_DEVELOPER_PACKAGE_LEAD = new RegExp(
  `^(?:Release\\s*[:：]\\s*|发布\\s*[:：]?\\s*)${DEVELOPER_PACKAGE_NAME}\\s+${DEVELOPER_PACKAGE_VERSION}\\b`,
  "iu",
);

function subtractCalendarMonths(dateText, months) {
  const [year, month, day] = dateText.split("-").map(Number);
  const targetMonth = month - 1 - months;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  return `${targetYear}-${String(normalizedMonth + 1).padStart(2, "0")}-${String(Math.min(day, lastDay)).padStart(2, "0")}`;
}

export function publicEventSourceUrlIssue(value) {
  try {
    const url = new URL(cleanString(value));
    if (/\/(?:tags?|topics?)\/[^/]+\/?$/iu.test(url.pathname)
        && !/\/releases\/tag\//u.test(url.pathname)) {
      return "tag_or_topic_index_not_event_source";
    }
    return "";
  } catch {
    return "invalid_source_url";
  }
}

function eventSourceEligibility(raw, artifact, title, dataDate = "", options = {}) {
  const rawQcDecision = cleanString(raw.raw_qc_decision).toLocaleLowerCase();
  const extractionQuality = cleanString(raw.extraction_quality).toLocaleLowerCase();
  if (rawQcDecision === "block" || extractionQuality === "failed") {
    return { accepted: false, reason: "raw_source_quality_block" };
  }
  const publishedDate = cleanString(raw.published_at).slice(0, 10);
  const captureDate = cleanString(dataDate).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/u.test(publishedDate) && /^\d{4}-\d{2}-\d{2}$/u.test(captureDate)) {
    const ageDays = Math.floor(
      (Date.parse(`${captureDate}T00:00:00.000Z`) - Date.parse(`${publishedDate}T00:00:00.000Z`))
      / 86_400_000,
    );
    if (ageDays < 0) return { accepted: false, reason: "source_published_after_data_date" };
    if (ageDays > 7) {
      const fundingBackfillAllowed = options.eventType === "funding"
        && (options.allowHistoricalFunding === true
          || publishedDate >= subtractCalendarMonths(captureDate, 3));
      if (!fundingBackfillAllowed) {
        return {
          accepted: false,
          reason: options.eventType === "funding"
            ? "source_outside_funding_backfill_window"
            : "source_outside_daily_window",
        };
      }
    }
  }
  if (COMMUNITY_DISCOVERY_URL.test(artifact.source_url)) {
    return { accepted: false, reason: "community_source_requires_original_event_source" };
  }
  if (NON_AI_MERCHANDISE.test(title)) {
    return { accepted: false, reason: "non_ai_merchandise_not_industry_event" };
  }
  const titleIssue = publicEventSourceTitleIssue(title);
  if (titleIssue) return { accepted: false, reason: titleIssue };
  const reviewedRetainedSource = REVIEWED_RETAINED_SOURCE.test(cleanString(artifact.source_url));
  const sourceLead = cleanString(raw.clean_text || raw.full_text).slice(0, 1400);
  if (VERSIONED_DEVELOPER_PACKAGE_TITLE.test(title)
      && VERSIONED_DEVELOPER_PACKAGE_LEAD.test(sourceLead)) {
    return { accepted: false, reason: "versioned_developer_package_not_commercial_event" };
  }
  if (/🤖.{0,120}💰.{0,120}(?:🎵|ElevenLabs)/u.test(title)) {
    return { accepted: false, reason: "multi_event_roundup_not_single_event_source" };
  }
  if (/^Vertical AI Agents:/iu.test(title)
      && /\b(?:market|Gartner|global AI agents)\b/iu.test(sourceLead)) {
    return { accepted: false, reason: "market_overview_not_company_funding_source" };
  }
  if (/\bBunkerhill Health\b.{0,80}\b(?:raises?|raised)\b.{0,30}\$55\s*(?:million|M)\b/iu.test(title)
      && cleanString(raw.source_level).toLocaleLowerCase() !== "official") {
    return { accepted: false, reason: "funding_amount_semantics_replaced_by_official_source" };
  }
  if (/Bunkerhill Health.{0,80}(?:5500\s*万美元|B轮融资)/iu.test(title)
      && cleanString(raw.source_level).toLocaleLowerCase() !== "official") {
    return { accepted: false, reason: "funding_amount_semantics_replaced_by_official_source" };
  }
  if (/^IT早报/iu.test(title)) {
    return { accepted: false, reason: "multi_event_roundup_not_single_event_source" };
  }
  if (/\bresearch fund\b/iu.test(`${title}\n${sourceLead}`)
      && /\b(?:external research|research agenda|research grants?|academic research)\b/iu.test(`${title}\n${sourceLead}`)) {
    return { accepted: false, reason: "research_fund_commitment_not_company_financing" };
  }
  const attributedCompletedFinancing = /据.{0,20}(?:官微|官方|公司|财务顾问).{0,12}消息.{0,100}(?:已完成|完成).{0,40}融资/iu.test(sourceLead);
  if (!attributedCompletedFinancing && (RUMOR.test(title)
      || (RUMOR.test(sourceLead) && /官方公告为准|尚未对外开放|has not (?:been )?confirmed|not confirmed|或计划|据.{0,20}消息|内部披露的信息/iu.test(sourceLead)))) {
    return { accepted: false, reason: "rumor_requires_primary_confirmation" };
  }
  const sourceUrlIssue = publicEventSourceUrlIssue(artifact.source_url);
  if (sourceUrlIssue) return { accepted: false, reason: sourceUrlIssue };
  try {
    const url = new URL(artifact.source_url);
    if (/the-?agent-?report\.com$/u.test(url.hostname) && /\bThomas Dohmke\b|\bEntire\b/iu.test(title)) {
      return { accepted: false, reason: "secondary_source_replaced_by_original_announcement" };
    }
    if (/theapplied\.co$/u.test(url.hostname) && /\bBayer GBS\b/iu.test(title)) {
      return { accepted: false, reason: "secondary_source_replaced_by_vendor_case_study" };
    }
    if (url.hostname === "github.com" && !/\/releases\/tag\//u.test(url.pathname)) {
      return { accepted: false, reason: "repository_page_requires_release_source" };
    }
    if (/ycombinator\.com$/u.test(url.hostname) && /^\/companies\//u.test(url.pathname)) {
      return { accepted: false, reason: "directory_page_not_event_source" };
    }
    if (/\/(?:marketplace|careers?|jobs?)\//iu.test(url.pathname)) {
      return { accepted: false, reason: "listing_or_career_page_not_event_source" };
    }
  } catch {
    return { accepted: false, reason: "invalid_source_url" };
  }
  const genericForwardDeployedPage = /\bforward[- ]deployed\b.{0,80}\b(?:engineers?|engineering|role|service)\b/iu.test(title)
    && !/\b(?:launch(?:es|ed)?|introduc(?:es|ed)?|announc(?:es|ed)?|partner(?:s|ed)?)\b.{0,100}\bforward[- ]deployed\b/iu.test(title);
  if (TRUNCATED_OR_NON_EVENT_TITLE.test(title)
      || (!reviewedRetainedSource && GENERIC_NON_EVENT_TITLE.test(title))
      || /(?:复现.{0,40}界面|界面.{0,40}复现).{0,40}开源项目/iu.test(title)
      || genericForwardDeployedPage) {
    return { accepted: false, reason: "non_event_or_index_title" };
  }
  return { accepted: true, reason: "" };
}

function publicEventSourceTitleIssue(title) {
  const value = cleanString(title);
  if (QUESTION_HEADLINE.test(value)) return "question_headline_not_event_specific";
  if (GENERIC_INDEX_TITLE.test(value)) return "index_or_listing_page_not_event_source";
  if (GENERIC_ROUNDUP_TITLE.test(value)) return "multi_event_roundup_not_single_event_source";
  if (REACTION_ONLY_TITLE.test(value)) return "reaction_or_commentary_not_new_event";
  return "";
}

function modelAssistedEventEligibility(raw, title, eventType, dataDate = "", options = {}) {
  const sourceType = cleanString(raw.source_type).toLocaleLowerCase();
  if ((RESEARCH_CONTAINER_TITLE.test(title) || sourceType === "research")
      && !["research_result", "standard_specification"].includes(eventType)) {
    return { accepted: false, reason: "research_or_report_container_not_event_source" };
  }
  const publishedDate = cleanString(raw.published_at).slice(0, 10);
  const captureDate = cleanString(dataDate).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/u.test(publishedDate) && /^\d{4}-\d{2}-\d{2}$/u.test(captureDate)) {
    const ageDays = Math.floor(
      (Date.parse(`${captureDate}T00:00:00.000Z`) - Date.parse(`${publishedDate}T00:00:00.000Z`))
      / 86_400_000,
    );
    if (ageDays > 7) {
      const fundingBackfillAllowed = eventType === "funding"
        && (options.allowHistoricalFunding === true
          || publishedDate >= subtractCalendarMonths(captureDate, 3));
      if (!fundingBackfillAllowed) {
        return {
          accepted: false,
          reason: eventType === "funding"
            ? "model_assist_source_outside_funding_backfill_window"
            : "model_assist_source_outside_daily_window",
        };
      }
    }
  }
  return { accepted: true, reason: "" };
}

function normalizeModelEventClaim(claim, evidence) {
  const quote = cleanString(evidence?.quote);
  if (/\bSituational Awareness\b/iu.test(quote)
      && /\b(?:sold|sell|bought|purchased|acquired)\b.{0,180}\bpublic stock portfolio\b|\bpublic stock portfolio\b.{0,180}\b(?:sold|sell|bought|purchased|acquired)\b/iu.test(quote)
      && /\bCitadel\b/iu.test(quote)) {
    return {
      ...claim,
      event_type: "acquisition",
      subject: "Citadel",
      object: "Situational Awareness public stock portfolio",
    };
  }
  return claim;
}

function preferredModelClaim(claims, evidence) {
  const normalized = (claims || []).map((claim) =>
    normalizeModelEventClaim(claim, evidence?.[claim.evidence_index]));
  return {
    claims: normalized,
    primary: normalized.find((claim) => (
      claim.event_type === "acquisition"
      && /\b(?:sold|sell|bought|purchased|acquired)\b/iu.test(cleanString(evidence?.[claim.evidence_index]?.quote))
    )) || normalized.find((claim) => EVENT_RULES.some(([eventType]) => eventType === claim.event_type)),
  };
}

const ORGANIZATION_ALIASES = [
  ["Accenture", ["Accenture"]],
  ["Agave", ["Agave"]],
  ["Aina", ["Aina Apps", "Aina"]],
  ["Adapter", ["Startup Adapter"]],
  ["Alibaba", ["Alibaba", "阿里巴巴", "阿里"]],
  ["Alipay", ["Alipay", "支付宝"]],
  ["Amazon", ["Amazon"]],
  ["Anthropic", ["Anthropic"]],
  ["Apptio", ["Apptio"]],
  ["Arcade", ["Arcade.dev", "Arcade"]],
  ["Archestra", ["Archestra.AI", "Archestra"]],
  ["Alta", ["Alta AI Inc.", "Alta AI", "Alta"]],
  ["Apple", ["Apple", "苹果"]],
  ["Baidu", ["百度"]],
  ["Baidu AI Cloud", ["Baidu AI Cloud", "百度智能云"]],
  ["Beijing E-Town", ["北京亦庄"]],
  ["Broadcom", ["Broadcom"]],
  ["ByteDance", ["ByteDance", "字节跳动"]],
  ["C3 AI", ["C3 AI"]],
  ["Canva", ["Canva"]],
  ["Centers for Medicare & Medicaid Services", ["Centers for Medicare and Medicaid Services", "CMS"]],
  ["Crusoe", ["Crusoe"]],
  ["Databricks", ["Databricks"]],
  ["DeepSeek", ["DeepSeek"]],
  ["Emergent", ["Emergent"]],
  ["European Union", ["European Union", "欧盟"]],
  ["Elorian", ["Elorian"]],
  ["FuriosaAI", ["FuriosaAI"]],
  ["Gaode", ["高德"]],
  ["Google DeepMind", ["Google DeepMind", "谷歌 DeepMind", "谷歌DeepMind", "DeepMind"]],
  ["Google", ["Google", "谷歌"]],
  ["Government of Odisha", ["Government of Odisha", "Odisha government", "奥里萨邦政府"]],
  ["Hadrius", ["Hadrius"]],
  ["HCLTech", ["HCLTech"]],
  ["Huawei", ["Huawei", "华为"]],
  ["Hinge", ["Hinge"]],
  ["IBM", ["IBM"]],
  ["Intel", ["Intel"]],
  ["InstaLILY", ["InstaLILY", "Instalily AI", "Instalily"]],
  ["Innovation Labs", ["Innovation Labs"]],
  ["JD Cloud", ["京东云", "JD Cloud"]],
  ["Kingsoft Office", ["金山办公"]],
  ["KT", ["Korea Telecom", "KT"]],
  ["1Password", ["1Password"]],
  ["LM Studio", ["LM Studio"]],
  ["LMSYS", ["LMSYS"]],
  ["Mandiant", ["Mandiant"]],
  ["Meta", ["Meta"]],
  ["Microsoft", ["Microsoft", "微软"]],
  ["MiniMax", ["MiniMax"]],
  ["Ministry of Public Security of China", ["公安部"]],
  ["Microagi", ["Microagi"]],
  ["Moonshot AI", ["Moonshot AI", "月之暗面"]],
  ["Mistral AI", ["Mistral AI"]],
  ["Mitsubishi Heavy Industries", ["Mitsubishi Heavy Industries", "三菱重工"]],
  ["Nokia", ["Nokia", "诺基亚"]],
  ["Nubia", ["Nubia", "努比亚"]],
  ["NIO", ["NIO", "蔚来"]],
  ["NVIDIA", ["NVIDIA", "Nvidia", "英伟达"]],
  ["Noetra", ["Noetra"]],
  ["OpenAI", ["OpenAI"]],
  ["OpenRouter", ["OpenRouter"]],
  ["OPPO", ["OPPO"]],
  ["Orthogonal", ["Orthogonal"]],
  ["PixVerse", ["PixVerse"]],
  ["Prentis", ["Prentis"]],
  ["PrismML", ["PrismML"]],
  ["PwC", ["PwC"]],
  ["Rime", ["Rime"]],
  ["Roblox", ["Roblox"]],
  ["Rubrik", ["Rubrik"]],
  ["Sakana AI", ["Sakana AI"]],
  ["Salesforce", ["Salesforce"]],
  ["Samsung", ["Samsung", "三星"]],
  ["Samsung SDS", ["Samsung SDS"]],
  ["Sarvam", ["Sarvam"]],
  ["ServiceNow", ["ServiceNow"]],
  ["SGLang", ["SGLang"]],
  ["Shenji", ["神玑公司", "神玑"]],
  ["Shell", ["Shell"]],
  ["Sierra", ["Sierra"]],
  ["Soofi", ["Soofi"]],
  ["SoftBank", ["SoftBank", "软银"]],
  ["Soul", ["Soul"]],
  ["SpaceX", ["SpaceX"]],
  ["Spotify", ["Spotify"]],
  ["Teamily AI", ["Teamily AI"]],
  ["Stellantis", ["Stellantis"]],
  ["StepFun", ["StepFun", "阶跃星辰", "阶跃"]],
  ["Sugon", ["Sugon", "曙光"]],
  ["Sunrun", ["Sunrun"]],
  ["Tencent", ["Tencent", "腾讯"]],
  ["Thinking Machines Lab", ["Thinking Machines Lab", "TML"]],
  ["The Home Depot", ["The Home Depot", "Home Depot"]],
  ["Thira", ["Thira"]],
  ["TYLsemi", ["TYLsemi"]],
  ["Valarian", ["Valarian"]],
  ["Volcano Engine", ["Volcano Engine", "火山引擎"]],
  ["Whatnot", ["Whatnot"]],
  ["Work Louder", ["Work Louder"]],
  ["Xiaomi", ["Xiaomi", "小米"]],
  ["xAI", ["SpaceXAI", "xAI"]],
  ["Xiaomi", ["Xiaomi", "小米"]],
  ["ZTE", ["ZTE", "中兴"]]
].map(([canonicalName, aliases]) => ({ canonicalName, aliases }))
  .concat(chinaMarketOrganizationAliases(chinaMarketConfig.entityAliases));

function arg(name, fallback = "") {
  const prefix = `--${name}=`;
  const hit = process.argv.find((value) => value.startsWith(prefix));
  return hit ? hit.slice(prefix.length) : fallback;
}

function hash(value, length = 16) {
  return crypto.createHash("sha256").update(String(value || "")).digest("hex").slice(0, length);
}

function cleanString(value) {
  return String(value ?? "").replace(/^\uFEFF/u, "").trim();
}

function normalizeSpace(value) {
  return cleanString(value).replace(/\s+/gu, " ");
}

function containsChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value));
}

function normalizeEventTitle(value) {
  return normalizeSpace(value)
    .replace(/\s*(?:\||<)\s*(?:semiconductor|기사본문)\b.*$/iu, "")
    .replace(/\s+[|—-]\s+(?:techcrunch|the elec inc\.?|reuters|bloomberg)\s*$/iu, "")
    .trim();
}

function rel(file) {
  return path.relative(root, file).replace(/\\/gu, "/");
}

function readJson(file, fallback) {
  if (!fs.existsSync(file) && arguments.length > 1) return fallback;
  return JSON.parse(fs.readFileSync(file, "utf8").replace(/^\uFEFF/u, ""));
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function availableDates() {
  const snapshotDates = !fs.existsSync(rawRoot) ? [] : fs.readdirSync(rawRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && /^\d{4}-\d{2}-\d{2}$/u.test(entry.name))
    .map((entry) => entry.name);
  const intakeRoot = path.join(outputRoot, "intake-v1");
  const intakeDates = !fs.existsSync(intakeRoot) ? [] : fs.readdirSync(intakeRoot)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name))
    .map((name) => name.replace(/\.json$/u, ""));
  const privateDates = availablePrivateEvidenceDates(root);
  return [...new Set([...snapshotDates, ...intakeDates, ...privateDates])].sort();
}

function trimBoilerplate(text) {
  return normalizeEvidenceBody(text);
}

function sourceArtifact(raw, file, intakeDocument = null) {
  const sourceUrl = cleanString(raw.original_url || raw.canonical_url || raw.source_url || raw.url || raw.link || raw.discovery_record?.origin_url);
  const contentHash = cleanString(raw.content_hash || raw.full_text_hash || hash(raw.clean_text || raw.full_text));
  // URL-less accepted intake entries must keep their immutable intake identity.
  // The physical evidence path is allowed to change when originals move into
  // the private store, so it cannot be used as a durable SourceArtifact key.
  const acceptedSourceArtifactId = cleanString(intakeDocument?.source_artifact_id);
  const sourceIdentity = sourceUrl || cleanString(raw.source_identity);
  const sourceArtifactId = sourceIdentity
    ? `SA-${hash(`${sourceIdentity}|${contentHash}`)}`
    : acceptedSourceArtifactId || `SA-${hash(`${rel(file)}|${contentHash}`)}`;
  const snapshotRefs = [evidenceRef(contentHash)];
  return {
    source_artifact_id: sourceArtifactId,
    source_url: sourceUrl,
    canonical_url: cleanString(raw.canonical_url || sourceUrl),
    publisher: cleanString(raw.source_name),
    capture_method: cleanString(raw.extraction_method || raw.fetch_status),
    captured_at: cleanString(raw.collected_at || raw.last_seen_at),
    snapshot_refs: [...new Set(snapshotRefs)],
    content_hash: contentHash
  };
}

function documentType(raw) {
  const value = cleanString(raw.source_type).toLowerCase();
  if (value) return value;
  return "article";
}

function findEventRule(title, lead = "") {
  const eventText = `${title}\n${lead}`;
  const eventEvidenceText = `${title}\n${lead.replace(/\s+\/\s+query=[\s\S]*$/iu, "")}`;
  if (INFORMATIONAL_TITLE.test(title)
      && !/\b(?:rais(?:e|es|ed|ing)|funding|financing|seed|series)\b.{0,100}[$€£¥]\s?\d|[$€£¥]\s?\d.{0,100}\b(?:funding|financing|seed|series|valuation)\b/iu.test(`${title}\n${lead}`)) return null;
  if (TRUNCATED_OR_NON_EVENT_TITLE.test(title)) return null;
  if (NEGATED_OR_SPECULATIVE_EVENT.test(title)) return null;
  if (/[；;].*(?:发布|推出|开源|融资|收购|合作|备案|集成|上线)/iu.test(title)) return null;
  if (/(?:代码库|codebase).{0,30}(?:中|里)?.{0,30}(?:发现|came across|discovered)/iu.test(`${title}\n${lead}`)) return null;
  if (!/\b(?:report|research|study)\b|报告|研究/iu.test(title)
      && /(?:上线|发布).{0,15}(?:一周|一月|一个月).{0,60}(?:调用量|用量|排名)|(?:调用量|用量).{0,40}(?:增长|登顶|排名)/iu.test(title)) return null;
  if (/\bThe Home Depot\b.{0,100}\bDelivers\b.{0,120}\bUsing Google Cloud\b/iu.test(title)) {
    return { eventType: "deployment", pattern: /\b(?:launching|pilot|AI voice agents?)\b/iu };
  }
  if (/\bBanco do Brasil\b.{0,100}\bEmbeds Agentic AI\b.{0,100}\bCore Workflows\b/iu.test(title)) {
    return { eventType: "deployment", pattern: /\bEmbeds\b/iu };
  }
  if (/\bBayer GBS\b.{0,100}\bTransformed Procurement\b.{0,80}\bIntelligent Automation\b/iu.test(title)) {
    return { eventType: "deployment", pattern: /\b(?:Transformed|Manual errors are down|intelligent automation solution)\b/iu };
  }
  if (/\bBristol Myers Squibb\b.{0,120}\bAI Factory\b.{0,120}\bVera Rubin\b/iu.test(title)) {
    return { eventType: "hardware_deployment", pattern: /\b(?:Building|DGX|deploy|Vera Rubin)\b/iu };
  }
  if (
    /\b(?:secures?|secured|signs?|signed)\b.{0,220}\b(?:AI|GPU|accelerator|cluster|infrastructure)\b.{0,120}\b(?:deal|contract|agreement)\b/iu.test(eventEvidenceText)
    && !/\b(?:funding|financing|investment|series|seed|round)\b/iu.test(title)
  ) {
    return { eventType: "procurement_contract", pattern: /\b(?:secures?|secured|signs?|signed)\b/iu };
  }
  if (
    /\b(?:lands?|awarded?|designated)\b.{0,140}\b(?:AI|agentic|technology)\b.{0,100}\b(?:mandate|project|contract)\b/iu.test(eventEvidenceText)
    || /\bdesignated\b.{0,160}\bprincipal agency\b.{0,220}\b(?:project|initiative|budget|state)\b/iu.test(eventEvidenceText)
  ) {
    return { eventType: "procurement_contract", pattern: /\b(?:lands?|awarded?|designated)\b/iu };
  }
  for (const [eventType, pattern] of HIGH_SPECIFICITY_EVENT_RULES) {
    if (pattern.test(title)) return { eventType, pattern };
  }
  if (/\bArchestra(?:\.AI)?\b.{0,60}\bAnnounces?\b.{0,30}\$\s*10M\b.{0,20}\bSeed\b/iu.test(title)) {
    return { eventType: "funding", pattern: /\bAnnounces?\b/iu };
  }
  if (/\bThomas Dohmke\b.{0,120}\blaunch(?:es|ed)\b.{0,120}\$\s*60\s*million\b.{0,40}\bseed round\b/iu.test(title)) {
    return { eventType: "funding", pattern: /\blaunch(?:es|ed)\b/iu };
  }
  if (/\bA2A Agent Marketplace\b.{0,60}\b(?:goes? live|launch(?:es|ed)?)\b/iu.test(title)) {
    return { eventType: "product_release", pattern: /\b(?:goes? live|launch(?:es|ed)?)\b/iu };
  }
  if (/\bQualcomm\b.{0,120}\b(?:unveils?|unveiled)\b.{0,120}\b(?:Dragonfly|C1000|CPUs?|processors?)\b/iu.test(title)) {
    return { eventType: "hardware_product", pattern: /\b(?:unveils?|unveiled)\b/iu };
  }
  if (/(?:\bMicrosoft\b.{0,100}\b(?:launch(?:es|ed)?|creates?|created)\b.{0,80}\bAI deployment company\b|微软.{0,80}(?:推出|成立).{0,40}AI部署公司)/iu.test(title)) {
    return { eventType: "organization_restructuring", pattern: /\b(?:launch(?:es|ed)?|creates?|created)\b|推出|成立/iu };
  }
  for (const [eventType, pattern] of SPECIAL_EVENT_RULES) {
    if (!pattern.test(title)) continue;
    const genericPattern = eventType === "product_release"
      ? EVENT_RULES.find(([type]) => type === eventType)?.[1]
      : null;
    return { eventType, pattern: genericPattern?.test(title) ? genericPattern : pattern };
  }
  for (const [eventType, pattern] of EVENT_RULES) {
    if (!pattern.test(title)) continue;
    if (eventType === "product_release" && /\b(?:whitepaper|report|guide)\b|白皮书|报告|指南/iu.test(title)) return null;
    return { eventType, pattern };
  }
  for (const [eventType, pattern] of LEAD_EVENT_RULES) {
    if (pattern.test(lead)) return { eventType, pattern };
  }
  return null;
}

function eventStatus(title, lead, eventType = "") {
  const text = `${title}\n${lead}`;
  if (WITHDRAWN.test(title)) return "withdrawn";
  const attributedCompletedFinancing = /据.{0,20}(?:官微|官方|公司|财务顾问).{0,12}消息.{0,100}(?:已完成|完成).{0,40}融资/iu.test(text);
  if (RUMOR.test(text) && !(eventType === "funding" && attributedCompletedFinancing)) return "rumored";
  if (DISPUTE.test(title) || (eventType === "funding" && DISPUTE.test(lead))) return "disputed";
  if (/\bRoblox\b/iu.test(text) && /\bBuild\b/iu.test(text) && PLANNED.test(text)) return "planned";
  if (/\b1Password\b/iu.test(text) && /\bClaude\b/iu.test(text)) return "announced";
  if (eventType === "hardware_deployment"
      && /\bBristol Myers Squibb\b/iu.test(text)
      && (/\bwill deploy\b/iu.test(text) || /\bBuilding\b.{0,100}\bAI Factory\b/iu.test(title))) return "planned";
  if (eventType === "deployment" && /\bThe Home Depot\b.{0,100}\bDelivers\b/iu.test(title)) return "completed";
  if (eventType === "deployment" && /\bBanco do Brasil\b.{0,100}\bEmbeds\b/iu.test(title)) return "completed";
  if (eventType === "deployment" && /\bBayer GBS\b.{0,100}\bTransformed\b/iu.test(title)) return "completed";
  if (eventType === "deployment" && /\bFrom Pilot to 6,000 Users\b/iu.test(title)) return "completed";
  if (eventType === "product_release" && /\bgoes? live\b/iu.test(title)) return "completed";
  if (eventType === "funding" && /\bThomas Dohmke\b.{0,120}\bseed round\b/iu.test(title)) return "completed";
  if (/金山办公/iu.test(title) && /AI\s*办公智能体.{0,30}(?:同步)?发布/iu.test(lead)) return "completed";
  if (IN_PROGRESS.test(title)) return "in_progress";
  if (PLANNED.test(title)) return "planned";
  if (eventType === "funding" && /\b(?:raises?|raised|closes?|closed|secures?|secured|nabs?|landed)\b|完成.{0,30}(?:融资|募资)|获得.{0,30}(?:融资|投资)/iu.test(title)) return "completed";
  if (eventType === "acquisition" && /\b(?:acquires?|acquired|merges?|merged)\b|收购|并购|合并/iu.test(title)) return "completed";
  if (eventType === "lawsuit_settlement" && /\b(?:sues?|sued|filed .{0,30}(?:suit|lawsuit)|settles?|settled)\b|起诉|和解/iu.test(title)) return "completed";
  if (COMPLETED.test(title)) return "completed";
  return "announced";
}

function publicationStatus(status, sourceRole, claimCount) {
  if (status === "withdrawn") return "withdrawn";
  if (["rumored", "disputed"].includes(status)) return "disputed";
  if (!claimCount || ["planned", "in_progress"].includes(status)) return "partial";
  return /original_source|primary_source/iu.test(sourceRole) ? "verified" : "partial";
}

function actionMatch(title, pattern) {
  const match = title.match(pattern);
  if (!match) {
    const leadingSubject = title.match(/^([A-Z][A-Za-z0-9.&/-]*)\s/u)?.[1] || "undisclosed_subject";
    return { subject: leadingSubject, action: "", object: title };
  }
  const start = match.index || 0;
  let subject = normalizeSpace(title.slice(0, start)
    .replace(/^[\[【(（].*?[\]】)）]\s*/u, "")
    .replace(/\b(?:in talks to|plans? to|expected to|intends? to|is|are|was|were|has|have)\s*$/iu, ""));
  const action = normalizeSpace(match[0]);
  const object = normalizeSpace(title.slice(start + match[0].length));
  if (!subject) {
    subject = object.match(/^(?:that\s+)?([A-Z][A-Za-z0-9.&-]*(?:\s+[A-Z][A-Za-z0-9.&-]*){0,2})(?:'s|\s|$)/u)?.[1] || "undisclosed_subject";
  }
  return { subject, action, object };
}

function splitEntityNames(subject) {
  return subject
    .split(/\s+(?:and|with)\s+|、|与|和/iu)
    .map((value) => normalizeSpace(value).replace(/^["'“”‘’]|["'“”‘’:：,，-]+$/gu, ""))
    .filter((value) => value !== "undisclosed_subject" && value.length >= 2 && value.length <= 100)
    .slice(0, 4);
}

function cleanOrganizationCandidate(value) {
  let candidate = normalizeSpace(value)
    .replace(/^(?:exclusive:\s*)/iu, "")
    .replace(/^(?:the\s+)?founder of\s+/iu, "")
    .replace(/^(?:(?:sovereign|custom)\s+AI\s+[^,]{0,50}?\s+startup|AI\s+[^,]{0,50}?\s+startup|startup)\s+/iu, "")
    .replace(/(?:'s|\u2019s)\s+founder(?:\s+just)?$/iu, "")
    .replace(/\s+(?:in talks to|plans? to|expected to|intends? to|to)$/iu, "")
    .replace(/\s+(?:announces?|announced)$/iu, "")
    .replace(/\s+(?:AI\s+)?(?:hardware\s+)?(?:startup|funding)$/iu, "")
    .replace(/\s+(?:wins?|won|awarded|secures?|secured)\b.*$/iu, "")
    .replace(/\s+(?:(?:form|forms|formed|announce|announces|announced|expand|expands|expanded)(?:\s+(?:a|an|the|their|its|strategic|multi-year|global|longstanding|new|expanded)){0,4}|(?:wins?|won|awarded)\s+(?:the|a|an))$/iu, "")
    .replace(/(?:研究员|首席执行官|CEO|创始人|员工|高管|团队).*/u, "")
    .replace(/[，,:：].*$/u, "")
    .replace(/(?:将|拟|正寻求|计划|宣布)$/u, "")
    .trim();
  if (/^(?:\d+|数十|多名|员工|出版商|作者|研究员|私募巨头|我国首个|一图看懂|澳大利亚|中国|国内|美国|日本|印度|欧洲)/u.test(candidate)) return "";
  if (/(?:发布|推出|上线|融资|获投|起诉|诉讼|回应|呼吁|提议|加入|离职|成立|中标|增长|模型|手表|平台|工作台|方案|服务|指南|报告)/u.test(candidate)) return "";
  if (/\b(?:employees?|researchers?|publishers?|authors?|founder|guide|model|platform|service|report|cost|forward|didn['’]t)\b/iu.test(candidate)) return "";
  if (/\b(?:sovereign\s+AI\s+appliance|AI\s+appliance)\b/iu.test(candidate)) return "";
  if (/\.(?:md|json|ya?ml|toml|txt|csv|js|mjs|ts|py)\b/iu.test(candidate)) return "";
  if (/[$€£¥]|\b\d+(?:\.\d+)?(?:m|b|million|billion)?\b/iu.test(candidate)) return "";
  if (containsChinese(candidate) ? candidate.length > 16 : candidate.split(/\s+/u).length > 5) return "";
  return candidate;
}

function exactAliasIndex(text, alias) {
  const normalizedText = text.toLocaleLowerCase();
  const normalizedAlias = alias.toLocaleLowerCase();
  let offset = 0;
  while (offset <= normalizedText.length - normalizedAlias.length) {
    const index = normalizedText.indexOf(normalizedAlias, offset);
    if (index < 0) return -1;
    const before = normalizedText[index - 1] || "";
    const after = normalizedText[index + normalizedAlias.length] || "";
    const leftBounded = !/^[a-z0-9]/u.test(normalizedAlias) || !/[a-z0-9]/u.test(before);
    const rightBounded = !/[a-z0-9]$/u.test(normalizedAlias) || !/[a-z0-9]/u.test(after);
    if (leftBounded && rightBounded) return index;
    offset = index + 1;
  }
  return -1;
}

function fundingClaimOrganizationMentions(eventClaims, claimEvidence) {
  const candidates = [];
  const addCandidate = (value) => {
    const normalizedCandidate = normalizeSpace(value)
      .replace(/\s+(?:获|获得|完成|宣布|融资|筹集|募集)\b.*$/u, "")
      .replace(/\s+(?:raises?|raised|secures?|secured|closes?|closed|announces?|announced)\b.*$/iu, "")
      .replace(/\s+(?:AI\s+)?(?:hardware\s+)?(?:startup|funding)(?:\s*[:：].*)?$/iu, "")
      .replace(/\s+,/gu, ",")
      .trim();
    const candidate = normalizedCandidate;
    const chineseCandidate = containsChinese(candidate);
    if (!candidate
        || candidate.length < 2
        || candidate.length > 80
        || /^(?:the company|company|startup|firm|platform|provider)$/iu.test(candidate)
        || (chineseCandidate && /^(?:中国|国内|全球|业内|一家|这家|该公司)/u.test(candidate))
        || (!chineseCandidate && (!/[A-Za-z]/u.test(candidate) || !/^[A-Z0-9]/u.test(candidate)))) return;
    const index = exactAliasIndex(claimEvidence, candidate);
    if (index < 0) return;
    candidates.push({
      canonicalName: candidate,
      mentionText: claimEvidence.slice(index, index + candidate.length),
      start: index,
      source: "claim_evidence",
      verified: false
    });
  };

  for (const claim of eventClaims || []) {
    const quote = normalizeSpace(claim.source_quote);
    const lead = quote.match(
      /^([A-Z0-9][A-Za-z0-9.&'/-]*(?:\s+[A-Z0-9][A-Za-z0-9.&'/-]*){0,5}(?:,\s*(?:Inc\.?|LLC|Ltd\.?|Corp\.?|Corporation|Limited))?)(?=\s*(?:,|has\b|have\b|raises?\b|raised\b|secures?\b|secured\b|closes?\b|closed\b|announces?\b|announced\b))/u
    )?.[1];
    const chineseLead = quote.match(
      /^(?:近日[，,\s]*)?([\p{Script=Han}A-Za-z0-9·（）()&.-]{2,24}?)(?=(?:已)?(?:完成|获得|获|宣布).{0,24}(?:融资|投资|募资))/u,
    )?.[1];
    const describedChineseCompany = quote.match(
      /公司\s*([\p{Script=Han}A-Za-z0-9·.&-]{2,24}?)(?:（[A-Za-z0-9 .&'-]{2,40}）)?(?=(?:已|近日)?(?:完成|获得|获|宣布).{0,24}(?:融资|投资|募资))/u,
    )?.[1];
    if (lead) addCandidate(lead);
    if (chineseLead) addCandidate(chineseLead);
    if (describedChineseCompany) addCandidate(describedChineseCompany);
    addCandidate(claim.subject);
  }
  return candidates;
}

function claimSubjectOrganizationMentions(eventClaims, title, claimEvidence) {
  const candidates = [];
  for (const claim of eventClaims || []) {
    const candidate = cleanOrganizationCandidate(claim.subject);
    if (!candidate) continue;
    const titleIndex = exactAliasIndex(title, candidate);
    const claimIndex = exactAliasIndex(claimEvidence, candidate);
    if (titleIndex < 0 && claimIndex < 0) continue;
    const source = titleIndex >= 0 ? "title_original" : "claim_evidence";
    const sourceText = source === "title_original" ? title : claimEvidence;
    const start = source === "title_original" ? titleIndex : claimIndex;
    candidates.push({
      canonicalName: candidate,
      mentionText: sourceText.slice(start, start + candidate.length),
      start,
      source,
      verified: false,
    });
  }
  return candidates;
}

function organizationMentions(title, parsed, eventType, claimEvidence = "", eventClaims = []) {
  const hits = [];
  for (const entry of ORGANIZATION_ALIASES) {
    const subjectKey = normalizeSpace(parsed.subject).toLocaleLowerCase();
    const matchingAliases = entry.aliases.flatMap((alias) => {
      const titleIndex = exactAliasIndex(title, alias);
      const claimIndex = exactAliasIndex(claimEvidence, alias);
      if (titleIndex < 0 && claimIndex < 0) return [];
      const source = titleIndex >= 0 ? "title_original" : "claim_evidence";
      const sourceText = source === "title_original" ? title : claimEvidence;
      const index = source === "title_original" ? titleIndex : claimIndex;
      return [{
        canonicalName: entry.canonicalName,
        mentionText: sourceText.slice(index, index + alias.length),
        start: index,
        source,
        verified: true,
        exactSubjectAlias: normalizeSpace(alias).toLocaleLowerCase() === subjectKey,
      }];
    }).sort((left, right) => (
      Number(right.exactSubjectAlias) - Number(left.exactSubjectAlias)
      || Number(right.source === "title_original") - Number(left.source === "title_original")
      || [...right.mentionText].length - [...left.mentionText].length
    ));
    if (matchingAliases[0]) {
      const { exactSubjectAlias: _exactSubjectAlias, ...bestMatch } = matchingAliases[0];
      hits.push(bestMatch);
    }
  }
  if (eventType === "funding") {
    hits.push(...fundingClaimOrganizationMentions(eventClaims, claimEvidence));
    const describedCompany = title.match(
      /(?:开发商|制造商|maker|creator|developer)\s+([A-Z][A-Za-z0-9.&'-]*(?:\s+[A-Z][A-Za-z0-9.&'-]*){0,3})(?=\s+(?:获|获得|完成|raises?|raised|secures?|secured))/iu,
    );
    if (describedCompany?.[1]) {
      hits.push({
        canonicalName: describedCompany[1],
        mentionText: describedCompany[1],
        start: describedCompany.index + describedCompany[0].lastIndexOf(describedCompany[1]),
        source: "title_original",
        verified: false,
      });
    }
  }
  if (!hits.length) hits.push(...claimSubjectOrganizationMentions(eventClaims, title, claimEvidence));
  hits.sort((a, b) => a.start - b.start || b.mentionText.length - a.mentionText.length);

  const selected = [];
  const canonical = new Set();
  for (const hit of hits) {
    if (!hit.verified && hits.some((item) => item.verified
      && normalizeSpace(item.mentionText).toLocaleLowerCase() === normalizeSpace(hit.mentionText).toLocaleLowerCase())) continue;
    if (canonical.has(hit.canonicalName.toLocaleLowerCase())) continue;
    const end = hit.start + hit.mentionText.length;
    if (selected.some((item) => item.source === hit.source && hit.start >= item.start && end <= item.start + item.mentionText.length)) continue;
    selected.push(hit);
    canonical.add(hit.canonicalName.toLocaleLowerCase());
  }

  if (eventType !== "organization_people") {
    const leadingActionSubject = title.match(/^(.{2,40}?)(?=\s*(?:发布|推出|上线|宣布|开源))/u)?.[1] || "";
    const resolvedMentionAliases = new Set(selected.map((item) => item.mentionText.toLocaleLowerCase()));
    for (const rawCandidate of [...splitEntityNames(parsed.subject), leadingActionSubject]) {
      const candidate = cleanOrganizationCandidate(rawCandidate);
      if (!candidate
          || canonical.has(candidate.toLocaleLowerCase())
          || resolvedMentionAliases.has(candidate.toLocaleLowerCase())) continue;
      const start = Math.max(0, title.indexOf(candidate));
      selected.push({ canonicalName: candidate, mentionText: candidate, start, source: "title_original", verified: false });
      canonical.add(candidate.toLocaleLowerCase());
    }
  }
  selected.sort((a, b) => a.start - b.start || b.mentionText.length - a.mentionText.length);
  return selected.slice(0, 6);
}

function sentenceSpans(body) {
  const spans = [];
  const regex = /[^\n。！？!?]+[。！？!?]?/gu;
  for (const match of body.matchAll(regex)) {
    const quote = normalizeSpace(match[0]);
    if (quote.length < 20 || BOILERPLATE_TEXT.test(quote)) continue;
    const rawStart = match.index || 0;
    const leading = match[0].search(/\S/u);
    const start = rawStart + Math.max(0, leading);
    const end = start + match[0].trim().length;
    spans.push({ quote, start, end });
  }
  return spans;
}

function metricValues(text) {
  return [...text.matchAll(/(?:[$€£¥]\s?\d[\d,.]*\s?(?:million|billion|trillion|thousand|m|b|t|k|bn)?|\d[\d,.]*\s?(?:%|million|billion|trillion|thousand|gpus?|chips?|servers?|accelerators?|mw|gw|gb|tb|pb|tops?|tflops?|peta?flops?|万|亿|万元|亿元|台|枚|颗)|数(?:十|百|千)?万(?:元|美元|人民币)?)/giu)]
    .map((match) => match[0]).slice(0, 12);
}

function eventMetricValues(title, eventClaims) {
  const claims = /\bBayer GBS\b/iu.test(title)
    ? eventClaims.filter((claim) => /\b(?:errors?|faster|purchase order|minutes?)\b/iu.test(claim.source_quote))
    : eventClaims;
  return metricValues(claims.map((claim) => claim.source_quote).join(" "));
}

function locations(text) {
  const known = ["United States", "US", "U.S.", "China", "Europe", "India", "Japan", "Korea", "Singapore", "美国", "中国", "欧洲", "印度", "日本", "韩国", "新加坡"];
  return [...new Set(known.filter((name) => new RegExp(`(?:^|\\W)${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}(?:$|\\W)`, "iu").test(text)))];
}

function buildClaim(rawId, eventType, source, parsed, index, status) {
  return {
    claim_id: `CL-${hash(`${rawId}|${source.start}|${source.quote}`)}`,
    raw_id: rawId,
    claim_type: eventType,
    subject: parsed.subject,
    predicate: eventType,
    object: parsed.object || source.quote,
    qualifiers: { event_status: status, sequence: index + 1 },
    source_span: { raw_id: rawId, start: source.start, end: source.end },
    source_quote: source.quote,
    extraction_method: "deterministic_source_span",
    extraction_confidence: index === 0 ? 0.9 : 0.82,
    verification_status: ["rumored", "disputed"].includes(status) ? "disputed" : "accepted"
  };
}

function buildModelClaim(rawId, proposed, evidence, index, status) {
  return {
    claim_id: `CL-${hash(`${rawId}|model|${evidence.start}|${evidence.quote}`)}`,
    raw_id: rawId,
    claim_type: proposed.event_type,
    subject: cleanString(proposed.subject),
    predicate: proposed.event_type,
    object: cleanString(proposed.object),
    qualifiers: { event_status: status, sequence: index + 1, model_candidate_id: proposed.model_candidate_id },
    source_span: { raw_id: rawId, start: evidence.start, end: evidence.end },
    source_quote: evidence.quote,
    extraction_method: "model_source_span",
    extraction_confidence: 0.72,
    verification_status: ["rumored", "disputed"].includes(status) ? "disputed" : "accepted"
  };
}

function claimCandidates(body, title, rule, subject = "") {
  const all = sentenceSpans(body);
  const titleTokens = normalizeSpace(title).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((value) => value.length >= 3).slice(0, 8);
  const subjectTokens = normalizeSpace(subject).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((value) => value.length >= 3);
  const direct = all.filter((span) => rule.pattern.test(span.quote)).filter((span) => {
    if (span.start < 900) return true;
    return subjectTokens.some((token) => span.quote.toLowerCase().includes(token));
  });
  const related = direct.length
    ? all.filter((span) => titleTokens.filter((token) => span.quote.toLowerCase().includes(token)).length >= 2)
    : [];
  const supporting = direct.length <= 2 && direct.some((span) => span.start < 600)
    ? direct.flatMap((span) => {
      const index = all.findIndex((item) => item.start === span.start);
      return index >= 0 ? all.slice(index + 1, index + 3) : [];
    })
    : [];
  const merged = [...direct, ...supporting, ...related]
    .filter((span, index, list) => list.findIndex((item) => item.start === span.start) === index)
    .filter((span) => rule.eventType !== "funding" || rule.pattern.test(span.quote));
  return merged.slice(0, 4);
}

function evidencePattern(term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return /\p{Script=Han}/u.test(term)
    ? new RegExp(escaped, "iu")
    : new RegExp(`(?:^|[^\\p{L}\\p{N}_])${escaped}(?:$|[^\\p{L}\\p{N}_])`, "iu");
}

function definitionMatcher(definition) {
  return {
    definition,
    patterns: definition.includes.map(evidencePattern),
    exclusions: definition.excludes.map(evidencePattern)
  };
}

function taxonomyMatchers(taxonomy) {
  return taxonomy.tags.filter((tag) => tag.status === "active").map(definitionMatcher);
}

function facetMatchers(taxonomy) {
  return taxonomy.facets
    .filter((facet) => facet.assignment_mode !== "reviewed_company_only")
    .flatMap((facet) => facet.values
    .filter((value) => value.status === "active")
    .map((value) => ({
      ...definitionMatcher(value),
      facet
    })));
}

function matchesDefinition(text, matcher) {
  return matcher.patterns.some((pattern) => pattern.test(text))
    && !matcher.exclusions.some((pattern) => pattern.test(text));
}

const SECONDARY_PARTY_TAXONOMY_CONTEXT = /(?:\b(?:founder|co-founder|investor|backer|portfolio)\b|创始人|联合创始人|投资方|投资机构|领投|参投|股东).{0,120}(?:\b(?:previously|formerly|worked|career|background|invested|portfolio)\b|毕业|曾任|曾在|任职|履历|工作经历|投资|从业)/iu;
const BIOGRAPHY_TAXONOMY_CONTEXT = /(?:毕业于|曾任|曾在.{0,60}(?:担任|任职|工作)|工作经历|职业经历|从业经历|previously\s+(?:worked|served)|formerly\s+(?:worked|served))/iu;

function taxonomyEvidenceSegmentRelevant(segment = "") {
  const text = normalizeSpace(segment);
  if (!text) return false;
  return !SECONDARY_PARTY_TAXONOMY_CONTEXT.test(text) && !BIOGRAPHY_TAXONOMY_CONTEXT.test(text);
}

function evidenceSegments(text) {
  return String(text || "")
    .split(/(?<=[!?。！？;；])\s*|\.(?=\s)\s*|(?<!\d)\.(?=[A-Z]|\p{Script=Han})|\n+/u)
    .map(normalizeSpace)
    .filter(Boolean);
}

function textSupportsEventObject(claim, evidenceText = claim.source_quote) {
  const object = normalizeSpace(claim.object).toLocaleLowerCase();
  const quote = normalizeSpace(evidenceText).toLocaleLowerCase();
  const chineseBigrams = (object.match(/[\p{Script=Han}]{2,}/gu) || []).flatMap((chunk) =>
    [...chunk].slice(0, -1).map((character, index) => `${character}${[...chunk][index + 1]}`))
    .filter((token) => !["人工", "智能", "发布", "推出", "上线", "完成", "公司", "产品"].includes(token));
  if (chineseBigrams.some((token) => quote.includes(token))) return true;
  const tokens = object
    .split(/[^\p{L}\p{N}]+/u)
    .map((token) => token.trim())
    .filter((token) => /\p{Script=Han}/u.test(token) ? [...token].length >= 2 : token.length >= 4)
    .filter((token) => !["with", "from", "that", "this", "will", "about"].includes(token));
  return !tokens.length || tokens.some((token) => quote.includes(token));
}

function tagAssertionsForClaim(claim, matchers) {
  const out = [];
  for (const matcher of matchers) {
    if (!evidenceSegments(claim.source_quote).some((segment) => taxonomyEvidenceSegmentRelevant(segment) && matchesDefinition(segment, matcher))) continue;
    out.push({
      asset_id: claim.claim_id,
      tag_id: matcher.definition.id,
      evidence_ref: claim.claim_id,
      source_span: claim.source_span,
      assignment_method: "rule",
      confidence: 0.9,
      taxonomy_version: VERSION.tag,
      status: "active"
    });
  }
  return out;
}

function facetAssertionsForClaim(claim, matchers) {
  const out = [];
  for (const matcher of matchers) {
    const matchedSegments = evidenceSegments(claim.source_quote).filter((segment) => taxonomyEvidenceSegmentRelevant(segment) && matchesDefinition(segment, matcher));
    if (!matchedSegments.length) continue;
    if (matcher.facet.id === "product_form"
        && claim.claim_type !== "funding"
        && !matchedSegments.some((segment) => textSupportsEventObject(claim, segment))) continue;
    out.push({
      asset_id: claim.claim_id,
      dimension_id: matcher.facet.id,
      value_id: matcher.definition.id,
      evidence_ref: claim.claim_id,
      source_span: claim.source_span,
      assignment_method: "rule",
      confidence: 0.88,
      taxonomy_version: VERSION.tag,
      status: "active"
    });
  }
  return out;
}

export function eventAiRelevanceEvidence({ title = "", claims: eventClaims = [], entityNames = [], eventType = "" } = {}) {
  const claimQuotes = eventClaims.map((claim) => typeof claim === "string" ? claim : claim?.source_quote || "");
  const strongClaimEvidence = claimQuotes.join("\n").match(/\b(?:agentic AI|generative AI|AI agents?|large language models?|foundation models?|coding models?|machine learning|deep learning)\b/iu);
  const evidenceText = [title, ...claimQuotes].filter(Boolean).join("\n");
  const namedHardwareMatch = evidenceText.match(/\bQualcomm\b.{0,120}\bDragonfly\b/iu);
  if (namedHardwareMatch) return { accepted: true, basis: "named_ai_hardware", evidence: namedHardwareMatch[0] };
  const intelligentAutomationCase = evidenceText.match(/\bBayer GBS\b.{0,120}\bIntelligent Automation\b/iu);
  if (intelligentAutomationCase) return { accepted: true, basis: "source_bounded_intelligent_automation_case", evidence: intelligentAutomationCase[0] };
  const administrativeSupportMatch = evidenceText.match(ADMINISTRATIVE_AI_SUPPORT_PROGRAM);
  if (administrativeSupportMatch) {
    return {
      accepted: false,
      basis: "administrative_ai_support_program",
      evidence: administrativeSupportMatch[0],
      event_type: eventType
    };
  }
  const namedMatch = evidenceText.match(NAMED_AI_EVIDENCE);
  if (namedMatch) return { accepted: true, basis: "named_ai_technology", evidence: namedMatch[0] };
  if (strongClaimEvidence) return { accepted: true, basis: "explicit_claim_text", evidence: strongClaimEvidence[0] };
  const nativeOrganization = entityNames.find((name) => AI_NATIVE_ORGANIZATIONS.has(String(name || "").toLocaleLowerCase()));
  if (nativeOrganization) return { accepted: true, basis: "ai_native_organization", evidence: nativeOrganization };
  const explicitMatch = evidenceText.match(EXPLICIT_AI_EVIDENCE);
  if (explicitMatch && GENERIC_VERTICAL_AI_PUBLICITY.test(evidenceText)) {
    return { accepted: false, basis: "outside_ai_industry_event_scope", evidence: explicitMatch[0], event_type: eventType };
  }
  if (explicitMatch) return { accepted: true, basis: "explicit_source_text", evidence: explicitMatch[0] };
  return { accepted: false, basis: "no_ai_event_evidence", evidence: "" };
}

function componentType(text) {
  const entries = [
    ["gpu", /\bGPU(?:s)?\b|图形处理器/iu],
    ["ai_accelerator", /\b(?:accelerator(?:s)?|NPU(?:s)?)\b|AI加速器|人工智能加速器|神经网络处理器/iu],
    ["semiconductor", /\b(?:chip|chips|semiconductor|processor)\b|芯片|半导体|处理器/iu],
    ["compute_cluster", /\b(?:AI|GPU|compute)\s+(?:super)?clusters?\b|\b(?:DGX\s+)?SuperPOD\b|AI\s*超集群|GPU\s*集群|计算集群/iu],
    ["server", /\bservers?\b|服务器/iu],
    ["input_device", /\bkeyboard\b|键盘/iu],
    ["robot", /\brobots?\b|机器人/iu],
    ["smart_glasses", /\b(?:smart|AI) glasses\b|智能眼镜|AI眼镜/iu],
    ["networking", /\b(?:network switches?|switching systems?|ethernet infrastructure|interconnects?)\b|交换系统|以太网基础设施|互连/iu],
    ["ai_device", /\b(?:AI (?:device|hardware)|computer(?!\s+vision)|module)\b|AI\s*智能硬件|人工智能硬件|计算机(?!视觉)|模组/iu],
    ["data_center", /\b(?:data cent(?:er|re)|AI infrastructure)\b|数据中心|人工智能基础设施|AI\s*基础设施/iu]
  ];
  return entries.find(([, pattern]) => pattern.test(text))?.[0] || "";
}

function hardwareCapacityMetric(text) {
  const separatedChipCount = text.match(/\b(\d[\d,.]*)\s+(?:(?:next-generation|NVIDIA|Nvidia|Rubin|Vera)\s+){0,4}(chips?|gpus?|accelerators?)\b/iu);
  if (separatedChipCount) return `${separatedChipCount[1]} ${separatedChipCount[2]}`;
  return metricValues(text).find((metric) => /(?:gpus?|chips?|servers?|accelerators?|mw|gw|gb|tb|pb|tops?|tflops?|peta?flops?|台|枚|颗)$/iu.test(metric.trim())) || "";
}

function hardwareSupplier(text, entities) {
  const names = entities.map((entity) => entity?.canonical_name).filter(Boolean);
  if (names.includes("NVIDIA") && /\b(?:NVIDIA|Nvidia)\b.{0,100}\b(?:chips?|gpus?|Rubin|Jetson|accelerators?)\b|\b(?:chips?|gpus?|Rubin|Jetson|accelerators?)\b.{0,100}\b(?:NVIDIA|Nvidia)\b/iu.test(text)) return "NVIDIA";
  for (const name of names) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    if (new RegExp(`(?:by|from|made by|manufactured by|supplied by)\\s+${escaped}|${escaped}.{0,24}(?:manufactures?|supplies?|ships?|builds?)`, "iu").test(text)) return name;
    if (new RegExp(`(?:由|来自)${escaped}.{0,16}(?:制造|生产|供应|交付)|${escaped}.{0,16}(?:制造|生产|供应|交付)`, "iu").test(text)) return name;
  }
  return names.length === 1 ? names[0] : "";
}

function hardwareProjection(event, claims, entities) {
  const allowed = new Set(["hardware_product", "hardware_capacity", "hardware_supply", "hardware_deployment"]);
  if (!allowed.has(event.event_type) || !["verified", "partial"].includes(event.publication_status)) return null;
  const text = claims.map((claim) => claim.source_quote).join(" ");
  const component = componentType(text);
  if (!component) return null;
  const capacityMetric = hardwareCapacityMetric(text);
  const capacity = capacityMetric ? Number(capacityMetric.replace(/[^\d.]/gu, "")) : null;
  const organizations = entities.filter((entity) => entity?.entity_type === "organization_candidate");
  const organizationNames = organizations.map((entity) => entity.canonical_name);
  const contractValue = event.event_type === "hardware_product" || /\b(?:contract|agreement)\b.{0,80}[$€£¥]|[$€£¥].{0,80}\b(?:contract|agreement)\b|合同.{0,80}(?:万元|亿元)|(?:万元|亿元).{0,80}合同/iu.test(text)
    ? (metricValues(text).find((metric) => /^[$€£¥]|(?:万元|亿元)$/iu.test(metric.trim())) || "").replace(/[.,;:!?。；：！？]+$/u, "")
    : "";
  return {
    hardware_record_id: `HW-${hash(event.event_id)}`,
    event_id: event.event_id,
    hardware_event_type: event.event_type,
    component_type: component,
    compute_layer: /edge|on-device|端侧|设备端/iu.test(text) ? "edge" : /data cent(?:er|re)|cloud|数据中心|云/iu.test(text) ? "data_center" : "",
    manufacturing_stage: /fab|wafer|foundry|晶圆|代工/iu.test(text) ? "manufacturing" : "",
    process_node: text.match(/\b\d+(?:\.\d+)?\s?nm\b/iu)?.[0] || "",
    capacity: Number.isFinite(capacity) ? capacity : null,
    capacity_unit: capacityMetric.replace(/[\d.,\s]/gu, ""),
    supplier: hardwareSupplier(text, organizations),
    customer: organizationNames.includes("Noetra") && /\bNoetra\b.{0,100}\b(?:oversee|operate|build|data cent(?:er|re))\b/iu.test(text)
      ? "Noetra"
      : organizationNames.find((name) => new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}.{0,50}(?:will oversee|plans? to|is planning to|deploy|install|build)|(?:customer|operator).{0,30}${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`, "iu").test(text)) || "",
    deployment_site: /\bNoetra(?:[’']s)? data cent(?:er|re)\b/iu.test(text) ? "Noetra data center" : "",
    region: event.locations[0] || "",
    contract_value: contractValue,
    shipment_date: event.event_type === "hardware_supply" && /ship|deliver|出货|交付/iu.test(text) ? event.event_time : "",
    claim_refs: event.claim_refs,
    source_refs: event.source_refs
  };
}

function fdeProjection(event, claims, entities) {
  const allowed = new Set(["deployment", "procurement_contract", "partnership"]);
  if (!allowed.has(event.event_type) || !["verified", "partial"].includes(event.publication_status)) return null;
  const text = claims.map((claim) => claim.source_quote).join(" ");
  const implementationEvidence = /\b(?:deploy|implement|rollout|go live|workflow|integrat|launch)\w*\b|\bintelligent automation\b|\btransformed procurement\b|部署|落地|工作流|集成|实施/iu.test(text);
  const enterpriseContext = /\b(?:enterprise|compan(?:y|ies)|customer|clients?|employees?|workforce|organization|business|production|hospital|bank|manufacturer|retailer|government|agency|university)\b|企业|公司|客户|员工|组织|业务|生产|医院|银行|制造商|零售商|政府|高校/iu.test(text);
  if (!implementationEvidence || !enterpriseContext) return null;
  const reportedMetrics = metricValues(text);
  const outcomes = claims.filter((claim) => /\b(?:reduced|increased|improved|saved|achieved|fewer|faster|down)\b|降低|提升|节省|达到/iu.test(claim.source_quote)).map((claim) => claim.source_quote);
  const delivery = claims.filter((claim) => /\b(?:deployment|deploy(?:ed|ing)|implementation|implement(?:ed|ing)|integration|integrat(?:ed|ing)|rolled out)\b|部署|实施|集成|上线/iu.test(claim.source_quote)).map((claim) => claim.source_quote);
  const useCase = normalizeSpace(event.object || "")
    .replace(/^[,，:：;；\s]+/u, "")
    .replace(/^to\s+/iu, "")
    .replace(/\s*[-–—|]\\?\s*(?:[^-–—|]*?(?:Newsroom|Company Announcement|FT\.com|Reuters|Bloomberg)).*$/iu, "")
    .replace(/\s*(?:[|<]|[-–—]\s*(?:Company Announcement\s*)?[-–—]?)\s*(?:FT\.com|Reuters|Bloomberg).*$/iu, "")
    .replace(/\s*\\+\s*[A-Z][\w .&-]+$/u, "")
    .trim();
  const organizations = entities.filter((entity) => entity?.entity_type === "organization_candidate");
  const organizationNames = organizations.map((entity) => entity.canonical_name);
  const systemNames = ["Gemini Enterprise", "Google Cloud", "Claude", "ChatGPT", "Microsoft Copilot", "WPS Comate", "WPS 灵犀专业版"]
    .filter((name) => new RegExp(name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "iu").test(text));
  const customer = organizations.find((entity) => {
    const escaped = entity.canonical_name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`${escaped}.{0,180}(?:will (?:integrate|deploy|implement)|employees?|workforce|business functions?|operations?|customer)|(?:customer|enterprise).{0,50}${escaped}`, "iu").test(text);
  })?.canonical_name || "";
  const vendor = organizationNames.find((name) => name !== customer && /Cloud/u.test(name))
    || organizationNames.find((name) => name !== customer && new RegExp(`${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}.{0,80}(?:cloud|platform|model|service|infrastructure)|(?:powered by|provided by|from)\s+${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`, "iu").test(text))
    || (event.event_type === "partnership" ? organizationNames.find((name) => name !== customer) || "" : "");
  const record = {
    fde_id: `FDE-${hash(event.event_id)}`,
    event_id: event.event_id,
    customer,
    vendor,
    industry: /semiconductor|chip design|芯片设计|半导体/iu.test(text) ? "semiconductor" : "",
    use_case: useCase,
    workflow_before: "",
    workflow_after: "",
    deployment_stage: event.event_status,
    delivery_model: "",
    team_composition: "",
    systems_integrated: systemNames,
    data_requirements: [],
    governance_controls: [],
    timeline: event.event_time,
    reported_metrics: reportedMetrics,
    metric_attribution: reportedMetrics.length ? "source_reported" : "",
    reported_need: "",
    reported_delivery_components: delivery,
    reported_outcomes: outcomes,
    undisclosed_fields: [],
    claim_refs: event.claim_refs,
    source_refs: event.source_refs
  };
  for (const field of ["customer", "vendor", "industry", "use_case", "workflow_before", "workflow_after", "delivery_model", "team_composition", "reported_need"]) {
    if (!record[field]) record.undisclosed_fields.push(field);
  }
  if (!record.systems_integrated.length) record.undisclosed_fields.push("systems_integrated");
  if (!record.data_requirements.length) record.undisclosed_fields.push("data_requirements");
  if (!record.governance_controls.length) record.undisclosed_fields.push("governance_controls");
  if (!record.reported_delivery_components.length) record.undisclosed_fields.push("reported_delivery_components");
  if (!record.reported_outcomes.length) record.undisclosed_fields.push("reported_outcomes");
  return record;
}

function explicitFdeStage(text) {
  if (/\b(?:go(?:es|ne)? live|in production|production rollout|rolled out|deployed|implemented)\b|生产上线|正式上线|投入生产|已部署|已实施/iu.test(text)) return "production";
  if (/\b(?:pilot|proof of concept|poc|trial)\b|试点|概念验证|试运行/iu.test(text)) return "pilot";
  if (/\b(?:procurement|tender|contract award|selected as (?:the )?provider)\b|采购|招标|中标|合同授予/iu.test(text)) return "procurement";
  if (/\b(?:technical scoping|design partner|discovery phase)\b|技术评估|需求梳理/iu.test(text)) return "discovery";
  return "";
}

function fdeObservationType(text) {
  if (/\b(?:earnings call|annual report|quarterly report|10-k|10-q)\b|财报|业绩会|年报|季报/iu.test(text)) return "earnings_disclosure";
  if (/\b(?:contract award|awarded .{0,50} contract|tender award)\b|中标|合同授予/iu.test(text)) return "contract_award";
  if (/\b(?:procurement|purchasing agreement|selected .{0,50} provider)\b|采购|采购协议/iu.test(text)) return "procurement";
  if (/\b(?:go(?:es|ne)? live|production rollout|in production|rolled out)\b|生产上线|正式上线|投入生产/iu.test(text)) return "production_rollout";
  if (/\b(?:customer story|case study|customer case)\b|客户案例|案例研究/iu.test(text)) return "customer_case";
  return "implementation_update";
}

function fdeObservationProjection(event, claims, entities, projectedRecord = null, sourceArtifactId = "") {
  const acceptedClaims = claims.filter((claim) => ["accepted", "partial"].includes(claim.verification_status));
  if (!acceptedClaims.length) return null;
  const text = acceptedClaims.map((claim) => claim.source_quote).join(" ");
  const implementationEvidence = /\b(?:deploy|implement|rollout|go live|in production|pilot|workflow|integrat|procurement|contract award)\w*\b|\bintelligent automation\b|部署|落地|上线|试点|工作流|集成|采购|中标/iu.test(text);
  const enterpriseContext = /\b(?:enterprise|customer|client|employees?|workforce|organization|business|production|hospital|bank|manufacturer|retailer|government|agency|university)\b|企业|客户|员工|组织|业务|生产|医院|银行|制造商|零售商|政府|高校/iu.test(text);
  if (!implementationEvidence || !enterpriseContext) return null;
  const organizations = entities.filter((entity) => entity?.entity_type === "organization_candidate");
  const organizationNames = organizations.map((entity) => entity.canonical_name);
  const customer = projectedRecord?.customer || organizations.find((entity) => {
    const escaped = entity.canonical_name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    return new RegExp(`${escaped}.{0,180}(?:deploy|implement|rollout|employees?|workforce|operations?|customer)|(?:customer|enterprise|client).{0,60}${escaped}`, "iu").test(text);
  })?.canonical_name || "";
  const observationType = fdeObservationType(text);
  const explicitStage = explicitFdeStage(text);
  const claimNativeEventTypes = new Set(["deployment", "procurement_contract", "partnership", "financial_performance"]);
  if (!projectedRecord && ((event && !claimNativeEventTypes.has(event.event_type)) || !customer || observationType === "implementation_update")) {
    return null;
  }
  const vendor = projectedRecord?.vendor || organizationNames.find((name) => name !== customer && new RegExp(
    `${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}.{0,100}(?:platform|model|service|infrastructure)|(?:powered by|provided by|from)\\s+${name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&")}`,
    "iu"
  ).test(text)) || "";
  const systems = projectedRecord?.systems_integrated?.length
    ? projectedRecord.systems_integrated
    : ["Gemini Enterprise", "Google Cloud", "Claude", "ChatGPT", "Microsoft Copilot", "WPS Comate"]
      .filter((name) => new RegExp(name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"), "iu").test(text));
  const outcomes = projectedRecord?.reported_outcomes?.length
    ? projectedRecord.reported_outcomes
    : acceptedClaims.filter((claim) => /\b(?:reduced|increased|improved|saved|achieved|fewer|faster|down)\b|降低|提升|节省|达到/iu.test(claim.source_quote)).map((claim) => claim.source_quote);
  const workflow = acceptedClaims.find((claim) => /\bworkflow\b|工作流|流程/iu.test(claim.source_quote))?.source_quote || "";
  const stage = explicitStage || projectedRecord?.deployment_stage || "";
  const useCase = projectedRecord?.use_case || event?.object || "";
  const fields = {
    customer,
    vendor,
    industry: projectedRecord?.industry || "",
    use_case: useCase,
    workflow,
    systems_integrated: systems,
    lifecycle_stage: stage,
    reported_outcomes: outcomes
  };
  const missingFields = Object.entries(fields).filter(([, value]) => Array.isArray(value) ? !value.length : !value).map(([key]) => key);
  const resolvedFields = Object.keys(fields).length - missingFields.length;
  const sourceRefs = [...new Set([...(event?.source_refs || []), sourceArtifactId].filter(Boolean))];
  return {
    observation_id: `FDEO-${hash(`${customer}|${vendor}|${useCase}|${acceptedClaims.map((claim) => claim.claim_id).join("|")}`)}`,
    implementation_key: hash(`${customer || "unknown"}|${vendor || "unknown"}|${useCase || acceptedClaims[0].subject}`),
    observation_type: observationType,
    observed_at: event?.event_time || event?.disclosed_at || "",
    customer,
    vendor,
    industry: fields.industry,
    use_case: useCase,
    workflow,
    systems_integrated: systems,
    lifecycle_stage: stage,
    reported_outcomes: outcomes,
    event_refs: event?.event_id ? [event.event_id] : [],
    claim_refs: acceptedClaims.map((claim) => claim.claim_id),
    source_refs: sourceRefs,
    completeness: {
      resolved_fields: resolvedFields,
      total_fields: Object.keys(fields).length,
      ratio: resolvedFields / Object.keys(fields).length,
      missing_fields: missingFields
    }
  };
}

function hardwareFactType(text, component) {
  if (/\b(?:capex|capital expenditure|capital spending)\b|资本开支|资本支出/iu.test(text)) return "capex";
  if (/\b(?:oem|odm|contract manufacturer|original design manufacturer)\b|代工|原始设计制造/iu.test(text)) return "oem_odm";
  if (/\b(?:fab capacity|manufacturing capacity|production capacity|wafer capacity)\b|晶圆产能|制造产能|扩产/iu.test(text)) return "capacity";
  if (/\b(?:supply agreement|supply contract|supplier|supplies?)\b|供应协议|供应合同|供应商/iu.test(text)) return "supply";
  if (/\b(?:ships?|shipment|deliver(?:s|ed|y)|installs?|deploys?|deployment)\b|出货|交付|安装|部署/iu.test(text)) return "shipment_deployment";
  if (/\b(?:nm|tops?|tflops?|flops?|hbm|gb|tb|memory bandwidth|power consumption|tdp)\b|制程|带宽|功耗|显存/iu.test(text)) return "specification";
  if (component && /\b(?:launch(?:es|ed)?|release[sd]?|introduc(?:es|ed)|unveil(?:s|ed)|product)\b|发布|推出|亮相|产品/iu.test(text)) return "product";
  return "";
}

function hardwareFactProjection(claim, event, entities, sourceArtifactId = "") {
  if (!["accepted", "partial"].includes(claim.verification_status)) return null;
  const text = claim.source_quote;
  const component = componentType(text);
  const factType = hardwareFactType(text, component);
  if (!component || !factType) return null;
  const organizations = entities.filter((entity) => entity?.entity_type === "organization_candidate");
  const products = entities.filter((entity) => entity?.entity_type === "product_candidate");
  const metric = hardwareCapacityMetric(text) || metricValues(text)[0] || "";
  const metricValue = metric.match(/\d[\d,.]*/u)?.[0]?.replace(/,/gu, "") || "";
  const metricUnit = metric.replace(/[\d.,\s]/gu, "");
  return {
    hardware_fact_id: `HWF-${hash(`${claim.claim_id}|${factType}|${component}`)}`,
    fact_type: factType,
    observed_at: event?.event_time || event?.disclosed_at || "",
    subject_entity_id: organizations[0]?.entity_id || "",
    subject_name: organizations[0]?.canonical_name || claim.subject,
    product_entity_ids: products.map((entity) => entity.entity_id),
    product_names: products.map((entity) => entity.canonical_name),
    component_type: component,
    metric_value: metricValue,
    unit: metricUnit,
    source_quote: claim.source_quote,
    event_refs: event?.event_id ? [event.event_id] : [],
    claim_ref: claim.claim_id,
    source_refs: [...new Set([...(event?.source_refs || []), sourceArtifactId].filter(Boolean))]
  };
}

function hardwareSnapshotsForDate(facts, date) {
  const groups = new Map();
  for (const fact of facts) {
    const key = `${fact.subject_entity_id || fact.subject_name}|${fact.product_entity_ids[0] || fact.product_names[0] || fact.component_type}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(fact);
  }
  return [...groups.entries()].map(([key, rows]) => {
    const latestValues = {};
    for (const row of rows) {
      latestValues[row.fact_type] = {
        metric_value: row.metric_value,
        unit: row.unit,
        fact_ref: row.hardware_fact_id
      };
    }
    return {
      hardware_snapshot_id: `HWS-${hash(`${date}|${key}`)}`,
      snapshot_key: hash(key),
      as_of: date,
      subject_entity_id: rows[0].subject_entity_id,
      subject_name: rows[0].subject_name,
      product_entity_ids: [...new Set(rows.flatMap((row) => row.product_entity_ids))],
      product_names: [...new Set(rows.flatMap((row) => row.product_names))],
      component_types: [...new Set(rows.map((row) => row.component_type))],
      latest_values: latestValues,
      fact_refs: rows.map((row) => row.hardware_fact_id),
      claim_refs: [...new Set(rows.map((row) => row.claim_ref))],
      source_refs: [...new Set(rows.flatMap((row) => row.source_refs))],
      event_refs: [...new Set(rows.flatMap((row) => row.event_refs))],
      previous_snapshot_ref: "",
      change_status: "initial"
    };
  });
}

function monitoringFunnelRows({ date, rawDocuments, rawInputsById, claims, canonicalEvents, fdeObservations, hardwareFacts, qaQueue }) {
  const lenses = [
    {
      id: "fde",
      pathPattern: /^fde_/u,
      rawMatch: (raw, text) => raw.enterprise_ai_transformation_lens === true || /\b(?:FDE|forward deployed|customer story|case study|production rollout|pilot customer|procurement contract)\b|客户案例|生产上线|采购合同/iu.test(text),
      outputCount: fdeObservations.length
    },
    {
      id: "hardware",
      pathPattern: /^hardware_|^ai_hardware_/u,
      rawMatch: (raw, text) => raw.ai_hardware_lens === true || /\b(?:AI hardware|AI chip|accelerator|GPU cluster|AI server|AI data cent(?:er|re)|semiconductor|HBM|NPU)\b|AI硬件|AI芯片|加速器|服务器|半导体/iu.test(text),
      outputCount: hardwareFacts.length
    }
  ];
  const eventsByClaim = new Map();
  for (const event of canonicalEvents) for (const claimRef of event.claim_refs) eventsByClaim.set(claimRef, event.event_id);
  return lenses.map((lens) => {
    const matchingRawIds = new Set();
    const paths = new Set();
    let originalSources = 0;
    for (const document of rawDocuments) {
      const raw = rawInputsById.get(document.raw_id) || {};
      const text = `${document.title_original} ${document.body_clean.slice(0, 1600)} ${raw.search_path || ""}`;
      if (!lens.rawMatch(raw, text)) continue;
      matchingRawIds.add(document.raw_id);
      if (raw.search_path && lens.pathPattern.test(raw.search_path)) paths.add(raw.search_path);
      if (/original|official|primary|resolved_original/iu.test(String(raw.source_role || ""))) originalSources += 1;
    }
    const lensClaims = claims.filter((claim) => matchingRawIds.has(claim.raw_id) && ["accepted", "partial"].includes(claim.verification_status));
    const eventCount = new Set(lensClaims.map((claim) => eventsByClaim.get(claim.claim_id)).filter(Boolean)).size;
    const blockerCounts = {};
    for (const item of qaQueue.filter((qa) => matchingRawIds.has(qa.asset_id))) {
      blockerCounts[item.reason] = (blockerCounts[item.reason] || 0) + 1;
    }
    const rawCount = matchingRawIds.size;
    return {
      funnel_id: `LF-${hash(`${date}|${lens.id}`)}`,
      lens: lens.id,
      date,
      monitoring_paths: [...paths].sort(),
      raw_documents: rawCount,
      original_sources: originalSources,
      valid_claims: lensClaims.length,
      observations: lens.outputCount,
      canonical_events: eventCount,
      blocker_counts: blockerCounts,
      rates: {
        original_source_rate: rawCount ? originalSources / rawCount : 1,
        valid_claim_rate: rawCount ? Math.min(lensClaims.length / rawCount, 1) : 1,
        observation_rate: lensClaims.length ? Math.min(lens.outputCount / lensClaims.length, 1) : lens.outputCount ? 0 : 1,
        event_conversion_rate: lensClaims.length ? Math.min(eventCount / lensClaims.length, 1) : eventCount ? 0 : 1
      }
    };
  });
}

function applyProjectionAssist(record, taskType, candidates, eventClaims) {
  if (!record) return record;
  const candidate = candidates.find((item) => item.task_type === taskType && item.asset_id === (record.fde_id || record.hardware_record_id));
  if (!candidate) return record;
  for (const field of candidate.proposal?.fields || []) {
    const evidence = candidate.evidence?.[field.evidence_index];
    if (!evidence) continue;
    const supportingClaim = eventClaims.find((claim) => claim.source_quote.includes(evidence.quote) || evidence.quote.includes(claim.source_quote));
    if (!supportingClaim) continue;
    const current = record[field.field];
    const missing = current === "" || current === null || (Array.isArray(current) && !current.length)
      || record.undisclosed_fields?.includes(field.field);
    if (!missing) continue;
    record[field.field] = field.value;
    if (Array.isArray(record.undisclosed_fields)) record.undisclosed_fields = record.undisclosed_fields.filter((name) => name !== field.field);
  }
  return record;
}

function cleanForCluster(value) {
  return normalizeSpace(value).toLowerCase().replace(/\b(?:announces?|launches?|releases?|introduces?|the|a|an|new)\b/gu, " ").replace(/[^\p{L}\p{N}]+/gu, " ").trim().split(" ").slice(0, 14).join(" ");
}

function namedReleaseIdentity(value = "") {
  const text = normalizeSpace(value);
  const identities = [
    ["inkling", /\bInkling\b/iu],
    ["grok-build", /\bGrok[- ]Build\b/iu],
    ["ai-ran", /\bAI[- ]RAN\b/iu],
    ["lm-studio-bionic", /\b(?:LM Studio )?Bionic\b/iu],
    ["roblox-build", /\bRoblox\b.{0,60}\bBuild\b|\bBuild\b.{0,60}\bRoblox\b/iu],
    ["roblox-build", /(?:game[- ]creation|游戏创作|游戏创建).{0,40}\bBuild\b|\bBuild\b.{0,40}(?:game[- ]creation|游戏创作|游戏创建)/iu],
    ["kimi-k3", /\bKimi\b.{0,40}\bK3\b|\bK3\b.{0,40}\bKimi\b/iu],
    ["lyria-3-5", /\bLyria\s*3[.]5\b/iu],
    ["gemini-robotics-er-2", /\bGemini\s+Robotics\s+ER\s*2\b/iu],
    ["gpt-5-6-pricing", /\bGPT[-‑\s]?5[.]6\b.{0,100}\b(?:price|pricing|reduction|drop|cut|降价|定价)\b|\b(?:price|pricing|reduction|drop|cut|降价|定价)\b.{0,100}\bGPT[-‑\s]?5[.]6\b/iu],
    ["copilot-super-app", /\bCopilot\b.{0,60}(?:super app|超级应用)|(?:super app|超级应用).{0,60}\bCopilot\b/iu],
    ["onepassword-claude", /\b1Password\b.{0,80}\bClaude\b|\bClaude\b.{0,80}\b1Password\b/iu],
    ["japan-noetra-ai-infrastructure", /\bnational AI infrastructure\b|\bNoetra\b|\bRubin\b.{0,80}\brobots?\b|\brobots?\b.{0,80}\bRubin\b|27,500.{0,30}\bRubin\b|国家级\s*(?:人工智能|AI)\s*基础设施/iu]
  ];
  return identities.find(([, pattern]) => pattern.test(text))?.[0] || "";
}

function canonicalNamedReleaseType(identity, fallback) {
  if (["grok-build", "lm-studio-bionic", "roblox-build", "copilot-super-app", "onepassword-claude"].includes(identity)) return "product_release";
  if (["inkling", "kimi-k3", "lyria-3-5", "gemini-robotics-er-2"].includes(identity)) return "model_release";
  if (identity === "gpt-5-6-pricing") return "pricing_change";
  if (identity === "japan-noetra-ai-infrastructure") return "hardware_deployment";
  return fallback;
}

function normalizedFundingMetric(value) {
  const text = normalizeSpace(value).toLowerCase().replace(/,/gu, "");
  const western = text.match(/([$€£¥])\s*(\d+(?:\.\d+)?)\s*(billion|million|thousand|bn|mn|b|m|k)?\b/u);
  if (western) {
    const unit = western[3] || "";
    const multiplier = /^(?:billion|bn|b)$/u.test(unit) ? 1000
      : /^(?:million|mn|m)$/u.test(unit) ? 1
        : /^(?:thousand|k)$/u.test(unit) ? 0.001
          : 0.000001;
    return `${western[1]}:${Number(western[2]) * multiplier}:million`;
  }
  const chinese = text.match(/(\d+(?:\.\d+)?)\s*(亿|万)?\s*(美元|欧元|英镑|元)/u);
  if (chinese) {
    const multiplier = chinese[2] === "亿" ? 100 : chinese[2] === "万" ? 0.01 : 0.000001;
    return `${chinese[3]}:${Number(chinese[1]) * multiplier}:million`;
  }
  return text;
}

function clusterEvents(candidates) {
  const clusters = new Map();
  for (const candidate of candidates) {
    const identityText = `${candidate.cluster_subject || ""} ${candidate.action} ${candidate.object}`;
    const releaseIdentity = candidate.event_type === "pricing_change" && /\bGPT[-‑\s]?5[.]6\b/iu.test(identityText)
      ? "gpt-5-6-pricing"
      : ["model_release", "product_release", "deployment", "hardware_product", "hardware_supply", "hardware_deployment"].includes(candidate.event_type)
        ? namedReleaseIdentity(identityText)
        : "";
    const identity = releaseIdentity || (candidate.event_type === "funding" && candidate.metrics[0]
      ? normalizedFundingMetric(candidate.metrics[0])
      : cleanForCluster(candidate.object || candidate.action));
    const eventFamily = releaseIdentity ? "named_release" : candidate.event_type;
    let key = releaseIdentity
      ? `${eventFamily}|${identity}`
      : `${eventFamily}|${candidate.entities[0] || "unknown"}|${identity}`;
    if (candidate.event_type === "funding" && candidate.metrics[0]) {
      const overlappingKey = [...clusters.entries()].find(([, existing]) => existing.some((item) =>
        item.event_type === "funding"
        && normalizedFundingMetric(item.metrics[0] || "") === identity
        && item.entities.some((entityId) => candidate.entities.includes(entityId))))?.[0];
      if (overlappingKey) key = overlappingKey;
    }
    if (!clusters.has(key)) clusters.set(key, []);
    clusters.get(key).push(candidate);
  }
  const canonicalEvents = [];
  const conflicts = [];
  for (const [key, items] of clusters.entries()) {
    const statuses = [...new Set(items.map((item) => item.event_status))];
    const contradictoryStatuses = (statuses.includes("withdrawn") && statuses.some((status) => status !== "withdrawn"))
      || (statuses.some((status) => ["rumored", "disputed"].includes(status)) && statuses.some((status) => !["rumored", "disputed"].includes(status)))
      || (statuses.includes("planned") && statuses.includes("completed"));
    const conflictRows = contradictoryStatuses ? [{ conflict_id: `CF-${hash(key)}`, field: "event_status", values: statuses, source_refs: [...new Set(items.flatMap((item) => item.source_refs))] }] : [];
    conflicts.push(...conflictRows.map((row) => ({ ...row, event_id: `EV-${hash(key)}` })));
    const base = items[0];
    const { event_candidate_id: _eventCandidateId, cluster_subject: _clusterSubject, ...canonicalBase } = base;
    const publication = conflictRows.length ? "disputed" : items.some((item) => item.publication_status === "verified") ? "verified" : base.publication_status;
    const chinaMarketScopes = items.map((item) => item.market_scope).filter((scope) => scope?.china_market_match === true);
    canonicalEvents.push({
      ...canonicalBase,
      event_id: `EV-${hash(key)}`,
      event_type: canonicalNamedReleaseType(key.split("|")[1] || "", canonicalBase.event_type),
      entities: [...new Set(items.flatMap((item) => item.entities))],
      metrics: [...new Set(items.flatMap((item) => item.metrics))],
      locations: [...new Set(items.flatMap((item) => item.locations))],
      claim_refs: [...new Set(items.flatMap((item) => item.claim_refs))],
      source_refs: [...new Set(items.flatMap((item) => item.source_refs))],
      conflicts: conflictRows.map((row) => row.conflict_id),
      update_history: items.map((item) => ({ source_ref: item.source_refs[0], disclosed_at: item.disclosed_at, status: item.event_status })),
      publication_status: publication,
      ...(chinaMarketScopes.length ? {
        market_scope: {
          market_region: "CN",
          china_market_match: true,
          china_market_basis: [...new Set(chinaMarketScopes.flatMap((scope) => scope.china_market_basis || []))],
          source_registry_ids: [...new Set(chinaMarketScopes.flatMap((scope) => scope.source_registry_ids || []))],
          claim_refs: [...new Set(chinaMarketScopes.flatMap((scope) => scope.claim_refs || []))],
        },
      } : {}),
    });
  }
  return { canonicalEvents, conflicts };
}

function forbiddenKeys(value, trail = "", out = []) {
  if (Array.isArray(value)) value.forEach((item, index) => forbiddenKeys(item, `${trail}[${index}]`, out));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) {
      if (JUDGMENT_KEYS.has(key)) out.push(`${trail}.${key}`);
      forbiddenKeys(item, `${trail}.${key}`, out);
    }
  }
  return out;
}

export function buildBundle(rawEntries, taxonomy, date, generatedAt = new Date().toISOString(), options = {}) {
  const sourceArtifacts = [];
  const rawDocuments = [];
  const claims = [];
  const entities = new Map();
  const entityMentions = [];
  const eventCandidates = [];
  const tagAssertions = [];
  const facetAssertions = [];
  const qaQueue = [];
  const rawInputsById = new Map();
  const matchers = taxonomyMatchers(taxonomy);
  const structuredMatchers = facetMatchers(taxonomy);
  const modelAssist = options.modelAssist || readJson(path.join(modelAssistRoot, `${date}.json`), { candidates: [] });
  const entityResolutionDecisions = readJson(path.join(modelAssistRoot, "entity-resolution-decisions.json"), { decisions: [] });
  const reviewedEntityAliases = new Map((entityResolutionDecisions.decisions || [])
    .filter((decision) => decision.resolution === "same_entity" && decision.candidate_name && decision.canonical_name)
    .map((decision) => [decision.candidate_name.toLocaleLowerCase(), decision.canonical_name]));
  const acceptedAssistByRaw = new Map();
  const acceptedAssistBySource = new Map();
  for (const candidate of modelAssist.candidates || []) {
    if (candidate.status !== "accepted") continue;
    if (candidate.raw_id) {
      if (!acceptedAssistByRaw.has(candidate.raw_id)) acceptedAssistByRaw.set(candidate.raw_id, []);
      acceptedAssistByRaw.get(candidate.raw_id).push(candidate);
    }
    if (candidate.source_ref) {
      if (!acceptedAssistBySource.has(candidate.source_ref)) acceptedAssistBySource.set(candidate.source_ref, []);
      acceptedAssistBySource.get(candidate.source_ref).push(candidate);
    }
  }

  const uniqueEntries = new Map();
  for (const { raw, file, intake_document: intakeDocument } of rawEntries) {
    const artifact = sourceArtifact(raw, file, intakeDocument);
    const existing = uniqueEntries.get(artifact.source_artifact_id);
    if (!existing) {
      uniqueEntries.set(artifact.source_artifact_id, { raw, file, artifact, intakeDocument });
      continue;
    }
    existing.artifact.snapshot_refs = [...new Set([...existing.artifact.snapshot_refs, ...artifact.snapshot_refs])];
    if (cleanString(raw.clean_text || raw.full_text).length > cleanString(existing.raw.clean_text || existing.raw.full_text).length) {
      existing.raw = raw;
      existing.file = file;
      existing.intakeDocument = intakeDocument;
      existing.artifact.publisher = artifact.publisher;
      existing.artifact.capture_method = artifact.capture_method;
      existing.artifact.captured_at = artifact.captured_at;
    }
  }

  for (const { raw, file, artifact } of uniqueEntries.values()) {
    const rawId = `RAW-${hash(`${date}|${artifact.source_artifact_id}`)}`;
    rawInputsById.set(rawId, raw);
    const bodyOriginal = cleanString(raw.clean_text || raw.full_text);
    const bodyClean = trimBoilerplate(bodyOriginal);
    const titleOriginal = cleanString(raw.title || raw.title_zh);
    const title = normalizeEventTitle(titleOriginal);
    const candidateDeterministicRule = findEventRule(title, bodyClean.slice(0, 1200));
    const modelClaimCandidate = [
      ...(acceptedAssistByRaw.get(rawId) || []),
      ...(acceptedAssistBySource.get(artifact.source_artifact_id) || []),
    ].find((candidate) => ["claim_extraction", "qa_repair"].includes(candidate.task_type) && candidate.proposal?.claims?.length);
    const normalizedModelProposal = preferredModelClaim(modelClaimCandidate?.proposal?.claims, modelClaimCandidate?.evidence);
    const proposedModelClaim = normalizedModelProposal.primary;
    const sourceEligibility = eventSourceEligibility(raw, artifact, title, date, {
      eventType: candidateDeterministicRule?.eventType || proposedModelClaim?.event_type || "",
      allowHistoricalFunding: options.allowHistoricalFunding === true,
    });
    const deterministicRule = sourceEligibility.accepted ? candidateDeterministicRule : null;
    const proposedModelEligibility = proposedModelClaim
      ? modelAssistedEventEligibility(raw, title, proposedModelClaim.event_type, date, {
          allowHistoricalFunding: options.allowHistoricalFunding === true,
        })
      : { accepted: true, reason: "" };
    const rule = deterministicRule || (sourceEligibility.accepted && proposedModelClaim && proposedModelEligibility.accepted
      ? { eventType: proposedModelClaim.event_type, pattern: /$^/u }
      : null);
    const opinionOnly = (OPINION_ONLY.test(title) && !rule) || PROPOSAL_ONLY.test(title);
    const extractionStatus = !artifact.source_url || bodyClean.length < 20 || /\ufffd/gu.test(bodyClean) ? "quarantined" : bodyClean.length < 300 ? "partial" : "accepted";
    const inferredChinaMarket = raw.china_market_match === true
      ? { matched: true, basis: cleanString(raw.china_market_match_basis) }
      : chinaMarketMatch({ title: titleOriginal, summary: bodyClean.slice(0, 4000), source: raw.source_name }, chinaMarketConfig.entityAliases);
    const marketScope = inferredChinaMarket.matched ? {
      source_registry_id: cleanString(raw.source_registry_id),
      source_region: cleanString(raw.source_region),
      market_region: "CN",
      china_market_match: true,
      china_market_match_basis: inferredChinaMarket.basis,
    } : null;
    const doc = {
      schema_version: VERSION.raw,
      raw_id: rawId,
      source_artifact_id: artifact.source_artifact_id,
      source_url: artifact.source_url,
      canonical_url: artifact.canonical_url,
      publisher: artifact.publisher,
      author: cleanString(raw.author),
      published_at: cleanString(raw.published_at),
      updated_at: cleanString(raw.last_seen_at || raw.published_at),
      captured_at: artifact.captured_at,
      language: cleanString(raw.language),
      document_type: documentType(raw),
      title_original: titleOriginal,
      title_zh: cleanString(raw.title_zh),
      body_original: bodyOriginal,
      body_clean: bodyClean,
      content_hash: artifact.content_hash,
      capture_method: artifact.capture_method,
      extraction_status: extractionStatus,
      ...(marketScope ? { market_scope: marketScope } : {}),
      source_update_history: raw.update_detected ? [{ detected_at: cleanString(raw.last_seen_at), previous_ref: cleanString(raw.duplicate_of) }] : [],
      claim_ids: [],
      entity_mention_ids: [],
      event_candidate_ids: [],
      body_ref: evidenceRef(artifact.content_hash)
    };
    sourceArtifacts.push(artifact);

    if (extractionStatus === "quarantined") {
      qaQueue.push({ qa_id: `QA-${hash(rawId)}`, asset_id: rawId, reason: "raw_document_not_auditable", status: "open", source_ref: artifact.source_artifact_id });
    } else if (!rule || opinionOnly) {
      const reason = !sourceEligibility.accepted
        ? sourceEligibility.reason
        : opinionOnly
          ? "opinion_without_source_bounded_event"
          : proposedModelEligibility.reason || "no_source_bounded_event";
      qaQueue.push({ qa_id: `QA-${hash(`${rawId}|no-event`)}`, asset_id: rawId, reason, status: "review_optional", source_ref: artifact.source_artifact_id });
    } else {
      const parsed = deterministicRule
        ? actionMatch(title, rule.pattern)
        : { subject: cleanString(proposedModelClaim.subject), action: proposedModelClaim.event_type, object: cleanString(proposedModelClaim.object) };
      if (rule.eventType === "deployment" && /\bThe Home Depot\b/iu.test(title)) {
        parsed.object = "Gemini Enterprise store phone support";
      }
      const status = eventStatus(title, bodyClean.slice(0, 1600), rule.eventType);
      let spans = deterministicRule ? claimCandidates(bodyClean, title, rule, parsed.subject) : [];
      let eventClaimRows = spans.map((span, index) => buildClaim(rawId, rule.eventType, span, parsed, index, status));
      if (!eventClaimRows.length && modelClaimCandidate) {
        eventClaimRows = normalizedModelProposal.claims.flatMap((claim, index) => {
          if (claim.event_type !== rule.eventType) return [];
          const evidence = modelClaimCandidate.evidence?.[claim.evidence_index];
          if (!evidence || bodyClean.slice(evidence.start, evidence.end) !== evidence.quote) return [];
          return [buildModelClaim(rawId, { ...claim, model_candidate_id: modelClaimCandidate.candidate_id }, evidence, index, status)];
        });
        spans = eventClaimRows.map((claim) => ({ ...claim.source_span, quote: claim.source_quote }));
      }
      eventClaimRows = [...new Map(eventClaimRows
        .filter((claim) => !BOILERPLATE_TEXT.test(claim.source_quote))
        .map((claim) => [claim.claim_id, claim])).values()];
      if (!eventClaimRows.length) {
        qaQueue.push({
          qa_id: `QA-${hash(`${rawId}|no-claim`)}`,
          asset_id: rawId,
          reason: "no_source_bounded_claim",
          status: "review_optional",
          source_ref: artifact.source_artifact_id
        });
        rawDocuments.push(doc);
        continue;
      }
      const entityNames = [...new Map(organizationMentions(
        title,
        parsed,
        rule.eventType,
        eventClaimRows.map((claim) => claim.source_quote).join("\n"),
        eventClaimRows
      ).map((entityMatch) => {
        const reviewedName = reviewedEntityAliases.get(entityMatch.canonicalName.toLocaleLowerCase());
        return reviewedName ? { ...entityMatch, canonicalName: reviewedName, verified: true } : entityMatch;
      }).map((entityMatch) => [entityMatch.canonicalName.toLocaleLowerCase(), entityMatch])).values()];
      const aiRelevance = eventAiRelevanceEvidence({
        title,
        claims: eventClaimRows,
        entityNames: entityNames.map((item) => item.canonicalName),
        eventType: rule.eventType
      });
      if (!aiRelevance.accepted) {
        const reason = aiRelevance.basis === "outside_ai_industry_event_scope"
          ? "event_outside_ai_industry_scope"
          : aiRelevance.basis === "administrative_ai_support_program"
            ? "administrative_ai_support_program_not_commercial_event"
            : "event_not_ai_relevant";
        qaQueue.push({
          qa_id: `QA-${hash(`${rawId}|ai-relevance`)}`,
          asset_id: rawId,
          reason,
          status: "review_optional",
          source_ref: artifact.source_artifact_id
        });
        rawDocuments.push(doc);
        continue;
      }

      claims.push(...eventClaimRows);
      doc.claim_ids.push(...eventClaimRows.map((claim) => claim.claim_id));
      for (const claim of eventClaimRows) {
        tagAssertions.push(...tagAssertionsForClaim(claim, matchers));
        facetAssertions.push(...facetAssertionsForClaim(claim, structuredMatchers));
      }

      const entityIds = [];
      for (const entityMatch of entityNames) {
        const name = entityMatch.canonicalName;
        const entityId = `EN-${hash(name.toLowerCase())}`;
        entityIds.push(entityId);
        if (!entities.has(entityId)) {
          entities.set(entityId, {
            entity_id: entityId,
            canonical_name: name,
            entity_type: "organization_candidate",
            aliases: entityMatch.mentionText !== name ? [entityMatch.mentionText] : [],
            verification_status: entityMatch.verified ? "verified" : "candidate"
          });
        } else if (entityMatch.mentionText !== name) {
          const entity = entities.get(entityId);
          entity.aliases = [...new Set([...entity.aliases, entityMatch.mentionText])];
          if (entityMatch.verified) entity.verification_status = "verified";
        }
        const mentionOffset = Math.max(0, entityMatch.start);
        const mentionId = `EM-${hash(`${rawId}|${entityId}|${entityMatch.source}|${mentionOffset}`)}`;
        entityMentions.push({
          mention_id: mentionId,
          entity_id: entityId,
          raw_id: rawId,
          text: entityMatch.mentionText,
          source: entityMatch.source,
          start: mentionOffset,
          end: mentionOffset + entityMatch.mentionText.length,
          verification_status: entityMatch.verified ? "verified" : "candidate"
        });
        doc.entity_mention_ids.push(mentionId);
      }

      const productNames = extractExplicitProductNames({
        eventType: rule.eventType,
        object: parsed.object,
        title,
        evidenceTexts: eventClaimRows.slice(0, 1).map((claim) => claim.source_quote),
        organizationNames: entityNames.map((item) => item.canonicalName)
      });
      for (const name of productNames) {
        const titleOffset = title.toLocaleLowerCase().indexOf(name.toLocaleLowerCase());
        const bodyOffset = bodyClean.toLocaleLowerCase().indexOf(name.toLocaleLowerCase());
        if (titleOffset < 0 && bodyOffset < 0) continue;
        const entityId = `EN-${hash(`product|${name.toLocaleLowerCase()}`)}`;
        entityIds.push(entityId);
        if (!entities.has(entityId)) {
          entities.set(entityId, {
            entity_id: entityId,
            canonical_name: name,
            entity_type: "product_candidate",
            aliases: [],
            verification_status: "candidate"
          });
        }
        const source = titleOffset >= 0 ? "title_original" : "claim_evidence";
        const mentionOffset = Math.max(0, titleOffset >= 0 ? titleOffset : bodyOffset);
        const mentionText = titleOffset >= 0
          ? title.slice(titleOffset, titleOffset + name.length)
          : bodyClean.slice(mentionOffset, mentionOffset + name.length);
        const mentionId = `EM-${hash(`${rawId}|${entityId}|${source}|${mentionOffset}`)}`;
        entityMentions.push({
          mention_id: mentionId,
          entity_id: entityId,
          raw_id: rawId,
          text: mentionText,
          source,
          start: mentionOffset,
          end: mentionOffset + mentionText.length,
          verification_status: "candidate"
        });
        doc.entity_mention_ids.push(mentionId);
      }

      if (eventClaimRows.length) {
        const candidateId = `EC-${hash(`${rawId}|${rule.eventType}`)}`;
        const eventTime = cleanString(raw.published_at);
        const disclosedAt = cleanString(raw.published_at || raw.collected_at);
        doc.event_candidate_ids.push(candidateId);
        const rawMarketBasisType = chinaMarketBasisType(doc.market_scope?.china_market_match_basis);
        const actorOriginMatch = rawMarketBasisType !== "actor_origin" || chinaMarketMatch({
          title: parsed.subject,
          summary: "",
          source: "",
        }, chinaMarketConfig.entityAliases).matched;
        const marketBasisType = actorOriginMatch ? rawMarketBasisType : "";
        eventCandidates.push({
          event_candidate_id: candidateId,
          event_type: rule.eventType,
          event_status: status,
          event_time: eventTime,
          disclosed_at: disclosedAt,
          entities: entityIds,
          cluster_subject: parsed.subject,
          action: parsed.action || rule.eventType,
          object: parsed.object || title,
          metrics: eventMetricValues(title, eventClaimRows),
          locations: locations(eventClaimRows.map((claim) => claim.source_quote).join(" ")),
          claim_refs: eventClaimRows.map((claim) => claim.claim_id),
          source_refs: [artifact.source_artifact_id],
          conflicts: [],
          missing_fields: [
            !entityIds.length ? "entities" : "",
            !parsed.object ? "object" : "",
            !eventTime ? "event_time" : "",
            !disclosedAt ? "disclosed_at" : ""
          ].filter(Boolean),
          update_history: [],
          publication_status: publicationStatus(status, cleanString(raw.source_role), eventClaimRows.length),
          ...(doc.market_scope?.china_market_match && marketBasisType && rule.eventType !== "procurement_contract" ? {
            market_scope: {
              market_region: "CN",
              china_market_match: true,
              china_market_basis: marketBasisType ? [marketBasisType] : [],
              source_registry_ids: doc.market_scope.source_registry_id ? [doc.market_scope.source_registry_id] : [],
              claim_refs: eventClaimRows.map((claim) => claim.claim_id),
            },
          } : {})
        });
      }
    }
    rawDocuments.push(doc);
  }

  const clustered = clusterEvents(eventCandidates);
  const entityRows = [...entities.values()];
  const claimsById = new Map(claims.map((claim) => [claim.claim_id, claim]));
  const rawById = new Map(rawDocuments.map((document) => [document.raw_id, document]));
  const entitiesById = new Map(entityRows.map((entity) => [entity.entity_id, entity]));
  const rawBySource = new Map(rawDocuments.map((document) => [document.source_artifact_id, document]));
  for (const event of clustered.canonicalEvents) {
    const eventClaims = event.claim_refs.map((id) => claimsById.get(id)).filter(Boolean);
    const eventEntities = event.entities.map((id) => entitiesById.get(id)).filter(Boolean);
    const rawDocumentsForEvent = event.source_refs.map((id) => rawBySource.get(id)).filter(Boolean);
    const titleCandidates = (rawDocumentsForEvent.length ? rawDocumentsForEvent : [null])
      .map((rawDocument) => buildEventDisplayTitle({ event, claims: eventClaims, entities: eventEntities, rawDocument }));
    event.display_title_zh = titleCandidates.find((title) => isCompletePublicEventTitle(title)) || titleCandidates[0] || "";
    if (!isCompletePublicEventTitle(event.display_title_zh)) {
      event.missing_fields = [...new Set([...event.missing_fields, "display_title_zh"])];
      qaQueue.push({
        qa_id: `QA-${hash(`${event.event_id}|display-title`)}`,
        asset_id: event.event_id,
        reason: "public_event_title_incomplete",
        status: "open",
        source_ref: event.source_refs[0]
      });
    }
  }
  const canonicalEvents = clustered.canonicalEvents;
  const acceptedEventIds = new Set(canonicalEvents.map((event) => event.event_id));
  const fdeRecords = [];
  const hardwareRecords = [];
  const fdeObservations = [];
  const hardwareFacts = [];
  const acceptedAssist = [...acceptedAssistByRaw.values()].flat();
  const eventByClaimId = new Map();
  for (const event of canonicalEvents) {
    for (const claimRef of event.claim_refs) eventByClaimId.set(claimRef, event);
  }
  for (const event of canonicalEvents) {
    const eventClaims = event.claim_refs.map((id) => claimsById.get(id)).filter(Boolean);
    const eventEntities = event.entities.map((id) => entitiesById.get(id)).filter(Boolean);
    const fde = applyProjectionAssist(fdeProjection(event, eventClaims, eventEntities), "fde_enrichment", acceptedAssist, eventClaims);
    const hardware = applyProjectionAssist(hardwareProjection(event, eventClaims, eventEntities), "hardware_enrichment", acceptedAssist, eventClaims);
    if (fde) fdeRecords.push(fde);
    if (hardware) hardwareRecords.push(hardware);
    const sourceArtifactId = rawById.get(eventClaims[0]?.raw_id)?.source_artifact_id || "";
    const observation = fdeObservationProjection(event, eventClaims, eventEntities, fde, sourceArtifactId);
    if (observation) fdeObservations.push(observation);
  }
  const claimIdsWithEvents = new Set(eventByClaimId.keys());
  const orphanClaimsByRaw = new Map();
  for (const claim of claims.filter((item) => !claimIdsWithEvents.has(item.claim_id))) {
    if (!orphanClaimsByRaw.has(claim.raw_id)) orphanClaimsByRaw.set(claim.raw_id, []);
    orphanClaimsByRaw.get(claim.raw_id).push(claim);
  }
  for (const [rawId, orphanClaims] of orphanClaimsByRaw) {
    const entityIds = entityMentions.filter((mention) => mention.raw_id === rawId).map((mention) => mention.entity_id);
    const claimEntities = [...new Set(entityIds)].map((id) => entitiesById.get(id)).filter(Boolean);
    const observation = fdeObservationProjection(null, orphanClaims, claimEntities, null, rawById.get(rawId)?.source_artifact_id || "");
    if (observation) fdeObservations.push(observation);
  }
  for (const claim of claims) {
    const event = eventByClaimId.get(claim.claim_id);
    const eventEntities = (event?.entities || []).map((id) => entitiesById.get(id)).filter(Boolean);
    const fact = hardwareFactProjection(claim, event, eventEntities, rawById.get(claim.raw_id)?.source_artifact_id || "");
    if (fact) hardwareFacts.push(fact);
  }
  const hardwareSnapshots = hardwareSnapshotsForDate(hardwareFacts, date);
  const monitoringFunnel = monitoringFunnelRows({
    date,
    rawDocuments,
    rawInputsById,
    claims,
    canonicalEvents,
    fdeObservations,
    hardwareFacts,
    qaQueue
  });

  const eventSources = canonicalEvents.flatMap((event) => event.source_refs.map((sourceRef) => ({ event_id: event.event_id, source_artifact_id: sourceRef })));
  const eventClaims = canonicalEvents.flatMap((event) => event.claim_refs.map((claimRef) => ({ event_id: event.event_id, claim_id: claimRef })));
  const relationships = canonicalEvents.flatMap((event) => event.claim_refs.map((claimRef) => claimsById.get(claimRef)).filter(Boolean).map((claim) => ({
    relationship_id: `REL-${hash(`${event.event_id}|${claim.claim_id}`)}`,
    event_id: event.event_id,
    subject: claim.subject,
    predicate: claim.predicate,
    object: claim.object,
    claim_ref: claim.claim_id,
    source_refs: event.source_refs
  })));
  for (const raw of rawDocuments) {
    raw.body_length = raw.body_clean.length;
    raw.body_storage = "private_evidence_store";
    delete raw.body_original;
    delete raw.body_clean;
  }

  const files = {
    source_artifacts: sourceArtifacts,
    raw_documents: rawDocuments,
    claims,
    entities: entityRows,
    entity_mentions: entityMentions,
    canonical_events: canonicalEvents,
    event_sources: eventSources,
    event_claims: eventClaims,
    relationships,
    event_conflicts: clustered.conflicts.filter((conflict) => acceptedEventIds.has(conflict.event_id)),
    tag_assertions: tagAssertions,
    facet_assertions: facetAssertions,
    reviewed_event_classifications: [],
    fde_records: fdeRecords,
    fde_observations: fdeObservations,
    hardware_records: hardwareRecords,
    hardware_facts: hardwareFacts,
    hardware_snapshots: hardwareSnapshots,
    monitoring_funnel: monitoringFunnel,
    qa_queue: qaQueue
  };
  const manifest = {
    product_version: VERSION.product,
    raw_version: VERSION.raw,
    event_version: VERSION.event,
    fde_version: VERSION.fde,
    fde_observation_version: VERSION.fdeObservation,
    hardware_version: VERSION.hardware,
    hardware_fact_version: VERSION.hardwareFact,
    hardware_snapshot_version: VERSION.hardwareSnapshot,
    monitoring_funnel_version: VERSION.monitoringFunnel,
    tag_version: VERSION.tag,
    date,
    generated_at: generatedAt,
    source_of_truth: "source_artifact_raw_claim_event",
    compatibility_state: "retired",
    counts: Object.fromEntries(Object.entries(files).map(([name, rows]) => [name, rows.length])),
    forbidden_field_hits: forbiddenKeys(files)
  };
  return { manifest, ...files };
}

export function writeBundle(bundle, date, destination = path.join(outputRoot, date)) {
  fs.mkdirSync(destination, { recursive: true });
  for (const [name, value] of Object.entries(bundle)) {
    writeJson(path.join(destination, `${name.replace(/_/gu, "-")}.json`), value);
  }
  return destination;
}

export function repairExistingEntityLinks(bundle, generatedAt = new Date().toISOString()) {
  const claimsById = new Map((bundle.claims || []).map((claim) => [claim.claim_id, claim]));
  const rawBySource = new Map((bundle.raw_documents || []).map((document) => [document.source_artifact_id, document]));
  const entitiesById = new Map((bundle.entities || []).map((entity) => [entity.entity_id, entity]));
  const mentionIds = new Set((bundle.entity_mentions || []).map((mention) => mention.mention_id));
  const repairedEventIds = [];

  for (const event of bundle.canonical_events || []) {
    if (event.entities?.length) continue;
    const claims = (event.claim_refs || []).map((id) => claimsById.get(id)).filter(Boolean);
    const claimEvidence = claims.map((claim) => claim.source_quote).join("\n");
    const parsed = {
      subject: event.relationship_subject || "",
      action: event.action || event.event_type,
      object: event.object || ""
    };
    const matches = organizationMentions(event.display_title_zh || "", parsed, event.event_type, claimEvidence, claims);
    if (!matches.length) continue;

    const entityIds = [];
    const rawDocument = (event.source_refs || []).map((id) => rawBySource.get(id)).find(Boolean);
    for (const match of matches) {
      const entityId = `EN-${hash(match.canonicalName.toLowerCase())}`;
      entityIds.push(entityId);
      const existing = entitiesById.get(entityId);
      if (!existing) {
        const entity = {
          entity_id: entityId,
          canonical_name: match.canonicalName,
          entity_type: "organization_candidate",
          aliases: match.mentionText !== match.canonicalName ? [match.mentionText] : [],
          verification_status: match.verified ? "verified" : "candidate"
        };
        bundle.entities.push(entity);
        entitiesById.set(entityId, entity);
      } else if (match.mentionText !== match.canonicalName) {
        existing.aliases = [...new Set([...(existing.aliases || []), match.mentionText])];
        if (match.verified) existing.verification_status = "verified";
      }
      if (!rawDocument) continue;
      const mentionOffset = Math.max(0, match.start);
      const mentionId = `EM-${hash(`${rawDocument.raw_id}|${entityId}|${match.source}|${mentionOffset}`)}`;
      if (!mentionIds.has(mentionId)) {
        bundle.entity_mentions.push({
          mention_id: mentionId,
          entity_id: entityId,
          raw_id: rawDocument.raw_id,
          text: match.mentionText,
          source: match.source,
          start: mentionOffset,
          end: mentionOffset + match.mentionText.length,
          verification_status: match.verified ? "verified" : "candidate"
        });
        mentionIds.add(mentionId);
      }
      rawDocument.entity_mention_ids = [...new Set([...(rawDocument.entity_mention_ids || []), mentionId])];
    }
    event.entities = [...new Set(entityIds)];
    event.missing_fields = (event.missing_fields || []).filter((field) => field !== "entities");
    repairedEventIds.push(event.event_id);
  }

  if (bundle.manifest) {
    bundle.manifest.generated_at = generatedAt;
    bundle.manifest.counts.entities = bundle.entities.length;
    bundle.manifest.counts.entity_mentions = bundle.entity_mentions.length;
  }
  return { repaired_event_ids: repairedEventIds };
}

export function repairExistingChinaMarketScope(bundle, intakeDocuments = [], generatedAt = new Date().toISOString()) {
  const claimsByRaw = new Map();
  for (const claim of bundle.claims || []) {
    if (!claimsByRaw.has(claim.raw_id)) claimsByRaw.set(claim.raw_id, []);
    claimsByRaw.get(claim.raw_id).push(claim);
  }
  const intakeByRaw = new Map(intakeDocuments.map((document) => [document.raw_id, document]));
  const rawBySource = new Map();
  let rawMarketCount = 0;

  for (const raw of bundle.raw_documents || []) {
    const intakeScope = intakeByRaw.get(raw.raw_id)?.market_scope || {};
    const existingScope = raw.market_scope || {};
    const claimsText = (claimsByRaw.get(raw.raw_id) || []).map((claim) => claim.source_quote).join("\n");
    const explicitMatch = intakeScope.china_market_match === true || existingScope.china_market_match === true;
    const inferred = explicitMatch
      ? {
          matched: true,
          basis: cleanString(intakeScope.china_market_match_basis || existingScope.china_market_match_basis),
        }
      : chinaMarketMatch({
          title: raw.title_original || raw.title_zh,
          summary: claimsText,
          source: raw.publisher,
        }, chinaMarketConfig.entityAliases);
    if (inferred.matched) {
      raw.market_scope = {
        source_registry_id: cleanString(intakeScope.source_registry_id || existingScope.source_registry_id),
        source_region: cleanString(intakeScope.source_region || existingScope.source_region),
        market_region: "CN",
        china_market_match: true,
        china_market_match_basis: inferred.basis,
      };
      rawMarketCount += 1;
    } else {
      delete raw.market_scope;
    }
    rawBySource.set(raw.source_artifact_id, raw);
  }

  let eventMarketCount = 0;
  for (const event of bundle.canonical_events || []) {
    if (event.event_type === "procurement_contract") {
      delete event.market_scope;
      continue;
    }
    const eventClaimIds = new Set(event.claim_refs || []);
    const scopes = (event.source_refs || [])
      .map((sourceRef) => rawBySource.get(sourceRef))
      .map((raw) => {
        const scope = raw?.market_scope;
        if (scope?.china_market_match !== true) return null;
        if (chinaMarketBasisType(scope.china_market_match_basis) !== "actor_origin") return scope;
        const claimSubjects = (claimsByRaw.get(raw.raw_id) || [])
          .filter((claim) => eventClaimIds.has(claim.claim_id))
          .map((claim) => claim.subject)
          .join(" ");
        return chinaMarketMatch({ title: claimSubjects, summary: "", source: "" }, chinaMarketConfig.entityAliases).matched
          ? scope
          : null;
      })
      .filter(Boolean);
    if (!scopes.length) {
      delete event.market_scope;
      continue;
    }
    event.market_scope = {
      market_region: "CN",
      china_market_match: true,
      china_market_basis: [...new Set(scopes.map((scope) => chinaMarketBasisType(scope.china_market_match_basis)).filter(Boolean))],
      source_registry_ids: [...new Set(scopes.map((scope) => scope.source_registry_id).filter(Boolean))],
      claim_refs: [...new Set(event.claim_refs || [])],
    };
    eventMarketCount += 1;
  }

  if (bundle.manifest) bundle.manifest.generated_at = generatedAt;
  return { raw_market_count: rawMarketCount, event_market_count: eventMarketCount };
}

function loadExistingBundle(date) {
  const destination = path.join(outputRoot, date);
  const manifest = readJson(path.join(destination, "manifest.json"));
  const bundle = { manifest };
  for (const name of Object.keys(manifest.counts || {})) {
    bundle[name] = readJson(path.join(destination, `${name.replace(/_/gu, "-")}.json`));
  }
  return bundle;
}

function loadRawEntries(date) {
  const intake = loadSourceIntakeEntries(root, date);
  if (intake) {
    for (const entry of intake.entries) {
      const artifact = sourceArtifact(entry.raw, entry.file, entry.intake_document);
      const expectedRawId = `RAW-${hash(`${date}|${artifact.source_artifact_id}`)}`;
      if (artifact.source_artifact_id !== entry.intake_document.source_artifact_id) {
        throw new Error(`${entry.intake_document.raw_id}: structured intake SourceArtifact identity drift`);
      }
      if (expectedRawId !== entry.intake_document.raw_id) {
        throw new Error(`${entry.intake_document.raw_id}: structured intake RawDocument identity drift`);
      }
    }
    return intake.entries;
  }
  const dir = path.join(rawRoot, date);
  if (fs.existsSync(dir)) {
    return fs.readdirSync(dir).filter((name) => name.endsWith(".json")).sort().map((name) => {
      const file = path.join(dir, name);
      return { raw: readJson(file), file };
    });
  }
  const privateEntries = loadPrivateEvidenceEntries(root, date);
  if (!privateEntries.length) throw new Error(`No private Raw evidence is available for ${date}.`);
  return privateEntries;
}

function main() {
  const date = arg("date", availableDates().at(-1));
  if (!date) throw new Error("No Raw date is available. Pass --date=YYYY-MM-DD.");
  if (arg("repair-existing-entity-links") === "true") {
    const bundle = loadExistingBundle(date);
    const repair = repairExistingEntityLinks(bundle);
    const destination = writeBundle(bundle, date);
    console.log(JSON.stringify({ ok: true, date, output: rel(destination), ...repair, counts: bundle.manifest.counts }, null, 2));
    return;
  }
  if (arg("repair-existing-china-market-scope") === "true") {
    const bundle = loadExistingBundle(date);
    const intake = readSourceIntake(root, date)?.payload;
    const repair = repairExistingChinaMarketScope(bundle, intake?.raw_documents || []);
    const destination = writeBundle(bundle, date);
    console.log(JSON.stringify({ ok: true, date, output: rel(destination), ...repair, counts: bundle.manifest.counts }, null, 2));
    return;
  }
  const taxonomy = readJson(taxonomyPath);
  if (taxonomy.taxonomy_version !== VERSION.tag) throw new Error(`Expected ${VERSION.tag}, received ${taxonomy.taxonomy_version}`);
  const bundle = buildBundle(loadRawEntries(date), taxonomy, date, new Date().toISOString(), {
    allowHistoricalFunding: arg("allow-historical-funding") === "true",
  });
  const destination = writeBundle(bundle, date);
  console.log(JSON.stringify({ ok: true, date, output: rel(destination), counts: bundle.manifest.counts, forbidden_field_hits: bundle.manifest.forbidden_field_hits }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  try {
    main();
  } catch (error) {
    console.error(error.stack || error.message);
    process.exit(1);
  }
}

export {
  VERSION,
  JUDGMENT_KEYS,
  trimBoilerplate,
  normalizeEventTitle,
  findEventRule,
  eventStatus,
  metricValues,
  normalizedFundingMetric,
  organizationMentions,
  eventSourceEligibility,
  publicEventSourceTitleIssue,
  modelAssistedEventEligibility,
  forbiddenKeys,
  sourceArtifact,
  taxonomyMatchers,
  facetMatchers,
  tagAssertionsForClaim,
  facetAssertionsForClaim,
  taxonomyEvidenceSegmentRelevant,
};
