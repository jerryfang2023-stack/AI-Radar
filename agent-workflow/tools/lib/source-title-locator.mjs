import { titleTranslationKey } from "../source-title-translation-generator.mjs";

function sourceIdentity(value = "") {
  try {
    const url = new URL(value);
    url.hostname = url.hostname.replace(/^www\./u, "");
    return url.href.replace(/\/+$/u, "");
  } catch {
    return String(value).trim().replace(/\/+$/u, "");
  }
}

export function sourceTitleLocator(raw, candidates, date = "") {
  const title = titleTranslationKey(raw.title || raw.title_original || "");
  const url = sourceIdentity(raw.canonical_url || raw.source_url || "");
  const matches = candidates.filter((entry) => (
    String(entry.content_hash || "").toLowerCase() === String(raw.content_hash || "").toLowerCase()
    && sourceIdentity(entry.source_url) === url
    && titleTranslationKey(entry.title_original || entry.title || "") === title
  ));
  return matches.find((entry) => entry.data_date === date) || matches[0] || {};
}
