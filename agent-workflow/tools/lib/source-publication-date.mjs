// A publisher's visible author header can correct a conflicting page timestamp.
// Bind it to the current article URL and title; narrative dates are not dates of publication.
export function publisherHeaderDate(source = {}) {
  let url;
  try { url = new URL(source.original_url || source.source_url || source.canonical_url || source.url); } catch { return null; }
  if (!(url.hostname === '36kr.com' || url.hostname.endsWith('.36kr.com')) || !/^\/p\/\d+\/?$/u.test(url.pathname)) return null;
  const normalizeTitle = value => String(value || '').normalize('NFKC').trim()
    .replace(/\s*[-–—|_]\s*36氪\s*$/u, '').replace(/\s+/gu, '');
  const title = normalizeTitle(source.title || source.title_original || source.title_zh);
  const lines = String(source.clean_text || source.full_text || source.body || source.body_clean || '').split(/\r?\n/u).map(x => x.trim()).filter(Boolean);
  if (!title || normalizeTitle(lines[0]) !== title) return null;
  const authorDate = /^([\p{L}\p{N} _-]{1,40})[·•]\s*(20\d{2})年(\d{1,2})月(\d{1,2})日\s+(\d{1,2}):(\d{2})$/u;
  const match = lines[1]?.match(authorDate);
  if (!match || lines.slice(2, 6).some(line => authorDate.test(line))) return null;
  const [, author, year, month, day, hour, minute] = match;
  if (!author.trim() || Number(hour) > 23 || Number(minute) > 59) return null;
  const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  const parsed = new Date(`${date}T00:00:00Z`);
  if (!Number.isFinite(+parsed) || parsed.toISOString().slice(0, 10) !== date) return null;
  return { date, method: 'publisher_header:36kr_author_date', value: lines[1] };
}
