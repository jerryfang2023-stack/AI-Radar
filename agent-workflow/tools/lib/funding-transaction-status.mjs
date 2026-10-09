// Source-title admission shared by the factual builder and funding-card gate.
// Do not scan an article's whole body: a cancelled historical round must not
// withdraw a separately completed current round.
export function isPendingFundingTitle(value = "") {
  const text = String(value || "").replace(/(?:课程|教学|备课|教案)计划(?:构建|生成|编制)?/gu, "教案");
  return /(?:又要|欲|拟|寻求|筹划|计划|即将完成|有望完成|接近完成).{0,24}(?:融资|募资)|(?:融资|募资).{0,20}(?:初步接触|早期谈判|洽谈中|谈判中)/u.test(text)
    || /(?:安排|筹措|筹备).{0,32}(?:融资|募资|贷款|债务融资)|(?:融资|募资|贷款|债务融资).{0,24}(?:安排|筹措|筹备|初步接触|早期阶段|洽谈|谈判)/u.test(text)
    || /\b(?:in talks|in discussions|seeking|plans? to|negotiating|nearing|closing in on|close to closing)\b.{0,90}\b(?:raise|funding|financing|round)\b/iu.test(text);
}

export function isWithdrawnFundingTitle(value = "") {
  // A product pivot can precede a completed financing in the same headline.
  // Mask only an explicit product object; retain any separate cancelled round.
  const text = String(value || "")
    .replace(/(?:取消|撤回|终止|放弃)(?:了)?(?:其)?(?:首款|第一款|最初的|原有的)?产品(?!融资|募资)/gu, "产品调整")
    .replace(/\b(?:scrubbed|shelved|abandoned|cancelled|canceled|withdrew|withdrawn)\s+(?:(?:its|their|the|a)\s+)?(?:(?:first|original|initial)\s+)?product\b(?!\s+(?:funding|financing|round)\b)/giu, "product pivot");
  return /\b(?:scrubbed|shelved|abandoned|cancelled|canceled|withdrew|withdrawn)\b[^!?。\n]{0,100}\b(?:funding|financing|round)\b/iu.test(text)
    || /\b(?:funding|financing|round)\b[^!?。\n]{0,60}\b(?:scrubbed|shelved|abandoned|cancelled|canceled|withdrawn|never closed|did not close|fell through)\b/iu.test(text)
    || /(?:取消|撤回|终止|放弃).{0,40}(?:融资|募资)|(?:融资|募资).{0,40}(?:取消|撤回|终止|未完成|未交割)/u.test(text);
}
