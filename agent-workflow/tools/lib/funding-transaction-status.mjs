// Source-title admission shared by the factual builder and funding-card gate.
// Do not scan an article's whole body: a cancelled historical round must not
// withdraw a separately completed current round.
export function isWithdrawnFundingTitle(value = "") {
  const text = String(value || "");
  return /\b(?:scrubbed|shelved|abandoned|cancelled|canceled|withdrew|withdrawn)\b[^!?。\n]{0,100}\b(?:funding|financing|round)\b/iu.test(text)
    || /\b(?:funding|financing|round)\b[^!?。\n]{0,60}\b(?:scrubbed|shelved|abandoned|cancelled|canceled|withdrawn|never closed|did not close|fell through)\b/iu.test(text)
    || /(?:取消|撤回|终止|放弃).{0,40}(?:融资|募资)|(?:融资|募资).{0,40}(?:取消|撤回|终止|未完成|未交割)/u.test(text);
}
