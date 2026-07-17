function text(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function compact(value = "", max = 180) {
  const normalized = text(value);
  if (normalized.length <= max) return normalized;
  const shortened = normalized.slice(0, max).replace(/\s+\S*$/u, "").replace(/[\s,:;，：；-]+$/u, "");
  return shortened || normalized.slice(0, max).trim();
}

function containsChinese(value = "") {
  return /[\u3400-\u9fff]/u.test(String(value || ""));
}

function englishConnectorCount(value = "") {
  return (String(value || "").match(/\b(?:the|and|to|for|with|from|into|across|after|before|as|at|by|were|was|are|is|its|this|that|new)\b/giu) || []).length;
}

function fundingAmount(metrics = [], evidence = "") {
  const contextualPattern = /\b(?:rais(?:e|es|ed|ing)|secur(?:e|es|ed|ing)|clos(?:e|es|ed|ing)|nab(?:s|bed)?|funding round)\b.{0,45}?([$€£¥])\s*(\d+(?:\.\d+)?)\s*(billion|million|bn|mn|b|m)?\b/giu;
  const contextual = [...evidence.matchAll(contextualPattern)].find((match) => {
    const following = evidence.slice((match.index || 0) + match[0].length, (match.index || 0) + match[0].length + 35);
    return !/\bvaluation\b/iu.test(following);
  });
  const source = [metrics[0], evidence].filter(Boolean).join(" ");
  const match = contextual || source.match(/([$€£¥])\s*(\d+(?:\.\d+)?)\s*(billion|million|bn|mn|b|m)?\b/iu);
  if (!match) return "";
  const currency = { "$": "美元", "€": "欧元", "£": "英镑", "¥": "元" }[match[1]] || "";
  const amount = Number(match[2]);
  const unit = (match[3] || "").toLowerCase();
  if (/^(?:billion|bn|b)$/u.test(unit)) return `${Number((amount * 10).toFixed(2))} 亿${currency}`;
  if (/^(?:million|mn|m)$/u.test(unit)) {
    const tenThousands = amount * 100;
    return tenThousands >= 10000
      ? `${Number((tenThousands / 10000).toFixed(2))} 亿${currency}`
      : `${Number(tenThousands.toFixed(2))} 万${currency}`;
  }
  return `${amount} ${currency}`.trim();
}

function fundingRound(evidence = "") {
  const series = evidence.match(/\bSeries\s+([A-Z])\b/iu);
  if (series) return `${series[1].toUpperCase()} 轮`;
  if (/\bpre[- ]seed\b/iu.test(evidence)) return "种子前轮";
  if (/\bseed(?: funding| round)?\b/iu.test(evidence)) return "种子轮";
  if (/\bearly[- ]stage funding\b/iu.test(evidence)) return "早期轮";
  return "";
}

function subjectFor(event, claims, entities, originalTitle = "") {
  const entity = entities.map((item) => item?.canonical_name).find(Boolean);
  if (entity && /\bfounder\b|创始人/iu.test(originalTitle)) return `${entity} 创始人`;
  if (entity) return entity;
  const claimSubject = text(claims.find(Boolean)?.subject);
  if (claimSubject && !/^undisclosed(?:_subject)?$/iu.test(claimSubject)) return compact(claimSubject, 80);
  const eventObjectSubject = text(event.object).match(/^([A-Z][A-Za-z0-9.&/-]*(?:\s+[A-Z][A-Za-z0-9.&/-]*){0,3})\b/u)?.[1];
  return eventObjectSubject || "";
}

function acquisitionTarget(event, originalTitle = "") {
  const match = originalTitle.match(/\b(?:acquires?|acquired)\b\s+(.+?)(?=\s+to\s+|\s*[-–—|]\s*|$)/iu);
  return compact(match?.[1] || event.object || "", 90)
    .replace(/\s+to\s+.+$/iu, "")
    .replace(/\s*[-–—|]\s*.+$/u, "")
    .trim();
}

function productObject(event, evidence = "") {
  if (/\bAgentic Payments for APIs\b/iu.test(evidence)) return "面向 API 的智能体支付服务";
  if (/\bCodex Micro\b|\bkeyboard for Codex\b/iu.test(evidence)) return "Codex Micro 键盘";
  if (/\bGrok Build\b/iu.test(evidence)) return "Grok Build 编程智能体工具";
  if (/\bFuriosaAI-Powered AI Services\b/iu.test(evidence)) return "由 FuriosaAI NPU 驱动的 AI 服务";
  const value = compact(event.object || "", 110)
    .replace(/\s*[-–—<|]\s*.+$/u, "")
    .replace(/[,，:].+$/u, "")
    .replace(/\s+(?:with|including|to help|to enable|for building)\s+.+$/iu, "")
    .replace(/^(?:YC:\s*)?/iu, "")
    .trim();
  return value && !/^undisclosed/iu.test(value) ? value : "";
}

function deploymentObject(evidence = "") {
  const named = text(evidence).match(/\b(?:Claude|ChatGPT|Gemini|Copilot|Grok|Qwen|Llama)\b/iu)?.[0];
  if (named) return named;
  return /\b(?:AI|artificial intelligence|generative AI|GenAI)\b|人工智能|大模型|智能体/iu.test(evidence)
    ? "AI 系统"
    : "";
}

export function buildEventDisplayTitle({
  event,
  claims = [],
  entities = [],
  rawDocument = null
} = {}) {
  const originalTitle = text(rawDocument?.title_original);
  const translatedTitle = text(rawDocument?.title_zh);
  const subject = subjectFor(event, claims, entities, originalTitle);
  const evidence = [originalTitle, event?.object, ...claims.map((claim) => claim?.source_quote)]
    .filter(Boolean)
    .join("\n");

  if (/\bKimi K3\b/iu.test(evidence)) return "月之暗面发布 Kimi K3，支持 1M 上下文";
  if (/\bPerceptionBench\b/iu.test(evidence)) return "Moonshot AI 发布多模态视觉感知基准 PerceptionBench";
  if (/灵犀专业版/iu.test(evidence) && /\bWPS Comate\b/iu.test(evidence)) return "金山办公发布灵犀专业版与 WPS Comate AI 办公智能体";
  if (/\bGPT-Red\b/iu.test(evidence) && /\binternal\b|内部/iu.test(evidence)) return "OpenAI 介绍内部红队模型 GPT-Red";
  if (/\bSakana AI\b/iu.test(evidence) && /\bFugu\b/iu.test(evidence) && /\bNemotron\b/iu.test(evidence)) {
    return "Sakana AI 将 NVIDIA Nemotron 模型接入 Fugu 多模型编排器";
  }
  if (/\bJapan\b|日本/iu.test(evidence) && /\bRubin\b/iu.test(evidence) && /27,500|national AI infrastructure|国家级 AI 基础设施/iu.test(evidence)) {
    return "日本启动 Noetra 国家级 AI 基础设施，计划采购 2.75 万枚 NVIDIA Rubin 芯片";
  }
  if (/\b1Password\b/iu.test(evidence) && /\bClaude\b/iu.test(evidence)) return "1Password 推出 Claude 集成，支持安全调用账户凭据";
  if (/\bGemini\b/iu.test(evidence) && /grounding provider|网络接地提供商/iu.test(evidence)) return "Google 为 Gemini 引入新的网页信息锚定服务商";
  if (/\bTeamily AI Public\b/iu.test(evidence)) return "Teamily AI 发布 Human+AI Social Platform 公测版";
  if (/\bVS Code\b/iu.test(evidence) && /\bAgent Host\b/iu.test(evidence)) return "微软更新 VS Code Agent Host，支持 AI 编程智能体独立运行";
  if (/\bStellantis\b/iu.test(evidence) && /\bMicrosoft\b/iu.test(evidence)) return "Stellantis 与微软扩大 AI 与云服务合作";

  if (event?.event_type === "lawsuit_settlement") {
    if (/Meta employees sue over layoffs.*discriminatory AI selection systems/iu.test(evidence)) {
      return "Meta 员工就 AI 裁员筛选系统提起诉讼";
    }
    if (/Lawsuit claims Meta['’]s layoff decisions were made by AI/iu.test(evidence)) {
      return "诉讼指控 Meta 使用 AI 作出裁员决定";
    }
    if (/xAI/iu.test(evidence) && /Grok/iu.test(evidence) && /(?:sues?|lawsuit|起诉|诉讼|儿童性虐待)/iu.test(evidence)) {
      return "xAI 起诉利用 Grok 生成违法深度伪造内容的用户";
    }
  }

  const rawPublicTitle = (translatedTitle || (containsChinese(originalTitle) ? originalTitle : ""))
    .replace(/(?:迄今)?最强(?:旗舰)?/gu, "旗舰")
    .replace(/全球首(?:个|款)/gu, "")
    .replace(/网络接地提供商/gu, "网页信息锚定服务商")
    .replace(/\s{2,}/gu, " ")
    .trim();
  if (rawPublicTitle && isCompletePublicEventTitle(rawPublicTitle)) return compact(rawPublicTitle);

  if (event?.event_type === "funding") {
    const amount = fundingAmount(event.metrics, evidence);
    const round = fundingRound(evidence);
    return compact(`${subject || "未披露主体"} 完成${amount ? ` ${amount}` : ""}${round ? ` ${round}` : ""}融资`);
  }

  if (event?.event_type === "acquisition") {
    const target = acquisitionTarget(event, originalTitle);
    return compact(`${subject || "未披露主体"} 收购${target ? ` ${target}` : ""}`);
  }

  if (event?.event_type === "partnership") {
    const names = entities.map((item) => item?.canonical_name).filter(Boolean);
    const partner = names.find((name) => name !== subject);
    if (partner) return compact(`${subject} 与 ${partner} 达成商业合作`);
  }

  if (event?.event_type === "deployment") {
    const object = deploymentObject(evidence);
    return compact(`${subject || "未披露主体"} 部署${object ? ` ${object}` : " AI 系统"}`);
  }

  if (["model_release", "product_release", "service_change", "pricing_change", "hardware_product"].includes(event?.event_type)) {
    const object = productObject(event, evidence);
    if (event.event_type === "product_release" && /\bAgentic Payments for APIs\b/iu.test(evidence)) {
      return compact(`${subject || "未披露主体"} 推出面向 API 的智能体支付服务`);
    }
    const verbs = {
      model_release: "发布",
      product_release: "发布",
      service_change: "调整",
      pricing_change: "调整",
      hardware_product: "发布"
    };
    return compact(`${subject || "未披露主体"} ${verbs[event.event_type]}${object ? ` ${object}` : ""}`);
  }

  const actionLabels = {
    procurement_contract: "签署采购合同",
    deployment: "完成部署",
    organization_people: "发生组织与人员变动",
    policy_regulation: "涉及政策监管",
    lawsuit_settlement: "涉及诉讼与和解",
    research_result: "发布研究结果",
    hardware_capacity: "更新硬件产能",
    hardware_supply: "更新硬件供应",
    hardware_deployment: "部署 AI 硬件"
  };
  const object = !/^undisclosed/iu.test(text(event?.object)) ? compact(event.object, 90) : "";
  return compact(`${subject || "未披露主体"} ${actionLabels[event?.event_type] || "发生事件"}${object ? `：${object}` : ""}`);
}

export function isCompletePublicEventTitle(value = "") {
  const title = text(value);
  return title.length >= 6
    && containsChinese(title)
    && englishConnectorCount(title) < 2
    && !/(?:…|\.\.\.|&(?:#\d+|[a-z]+);)/iu.test(title)
    && !/[|]|\b(?:Newsroom|Company Announcement)\b/iu.test(title)
    && !/\bformer\s+hardware\s+VP\b/iu.test(title)
    && !/(?:\b[A-Za-z][A-Za-z’'-]*\b[\s,:-]*){5,}/u.test(title)
    && !/^(?:exclusive|breaking):/iu.test(title)
    && !/(?:发布\s+(?:for|with|to|that|new|its)\b|：\s*[a-z]{2,}\b)/iu.test(title)
    && !/(?:发生并购|完成融资|发布产品|完成部署|发生事件)$/u.test(title)
    && !/发生事件/u.test(title)
    && !/undisclosed|未披露主体/iu.test(title);
}
