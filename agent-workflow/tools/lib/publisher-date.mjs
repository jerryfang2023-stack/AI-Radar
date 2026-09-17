// Only the publisher's first article date label, never dates in related stories.
export function articleLabelDate(html = "") {
  const label = String(html).match(/<span\b[^>]*class\s*=\s*["'][^"']*\bmg-blog-date\b[^"']*["'][^>]*>([\s\S]*?)<\/span>/iu)?.[1] || "";
  const text = label.replace(/<[^>]*>/gu, " ").replace(/&nbsp;/gu, " ").trim();
  const match = text.match(/^(\d{1,2})\s*月\s*(\d{1,2})\s*,\s*(20\d{2})$/u);
  if (!match) return "";
  const [, month, day, year] = match.map(Number);
  const value = new Date(Date.UTC(year, month - 1, day));
  if (value.getUTCFullYear() !== year || value.getUTCMonth() !== month - 1 || value.getUTCDate() !== day) return "";
  return value.toISOString();
}
