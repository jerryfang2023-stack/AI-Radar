// Navigation and truncated text cannot substantiate a financing assertion.
export function fundingClaimQuoteUsable(quote = "") {
  const text=String(quote || "").replace(/\s+/gu," ").trim();
  return Boolean(text) && !/(?:\.{3}|…)\s*$/u.test(text)
    && !/^Home[A-Z]{2}[- ]?Startups/u.test(text);
}
