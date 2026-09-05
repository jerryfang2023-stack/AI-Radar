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

export function sourceTitleMetadataMatches(raw, date, entry, metadata) {
  const accepted = titleTranslationKey(raw.title_original || raw.title || "");
  const stored = titleTranslationKey(metadata.title || metadata.title_original || "");
  const extendsPrefix = (short, full) => /(?:\.\.\.|…)$/u.test(short)
    && full.startsWith(short.replace(/(?:\.\.\.|…)$/u, "").trim());
  return Boolean(date && entry.data_date === date
    && entry.content_hash === raw.content_hash
    && sourceIdentity(entry.source_url) === sourceIdentity(raw.canonical_url || raw.source_url)
    && accepted && stored
    && (accepted === stored || extendsPrefix(accepted, stored) || extendsPrefix(stored, accepted)));
}
