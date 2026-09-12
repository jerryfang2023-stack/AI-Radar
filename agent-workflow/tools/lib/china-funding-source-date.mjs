// Read explicit publication stamps only. Never manufacture a date from capture time.
export function chinaFundingSourceDate(raw = {}) {
  if (raw.published_at || raw.acquisition_channel !== "china-funding") return raw.published_at || "";
  const header = String(raw.clean_text || raw.full_text || "").slice(0, 1400);
  const mobile = header.match(/(?:^|\n)(20\d{2})\/(\d{2})\s+(\d{2})\s*\n(\d{2}):(\d{2})(?:\s|$)/u);
  const stamped = header.match(/(?:^|\n)(?:[^\n]{1,60}[·•]\s*|(?:发布时间|发布于)[：:\s]*)?(20\d{2}-\d{2}-\d{2})(?:[ T](\d{2}):(\d{2})(?::\d{2})?)?\s*(?:\n|$)/u);
  const chinese = header.match(/(?:^|\n)(?:[^\n]{1,60}[·•]\s*|(?:发布时间|发布于)[：:\s]*)?(20\d{2})年(\d{1,2})月(\d{1,2})日(?:\s*(\d{2}):(\d{2}))?\s*(?:\n|$)/u);
  const day = mobile ? `${mobile[1]}-${mobile[2]}-${mobile[3]}` : stamped?.[1] || (chinese && `${chinese[1]}-${chinese[2].padStart(2, "0")}-${chinese[3].padStart(2, "0")}`);
  if (!day) return "";
  const time = mobile ? `${mobile[4]}:${mobile[5]}` : `${stamped?.[2] || chinese?.[4] || "00"}:${stamped?.[3] || chinese?.[5] || "00"}`;
  const value = `${day}T${time}:00+08:00`;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  const normalizedDay = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Shanghai" }).format(parsed);
  return normalizedDay === day ? value : "";
}
