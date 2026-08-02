function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function entityId(entity = {}) {
  return entity.entity_id || entity.id || "";
}

function entityName(entity = {}) {
  return clean(entity.canonical_name || entity.name);
}

function exactMention(text = "", name = "") {
  if (!clean(name)) return false;
  const escaped = clean(name).replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`(?:^|[^\\p{L}\\p{N}_])${escaped}(?=$|[^\\p{L}\\p{N}_])`, "iu").test(String(text));
}

export function classificationEntityIds(claims = [], entities = []) {
  const usableEntities = entities.filter((entity) => entityId(entity) && entityName(entity));
  const subjects = [...new Set(claims.map((claim) => clean(claim?.subject)).filter(Boolean))];
  const exactSubjects = usableEntities.filter((entity) => subjects.some((subject) => (
    subject.toLocaleLowerCase() === entityName(entity).toLocaleLowerCase()
  )));
  if (exactSubjects.length === 1) return [entityId(exactSubjects[0])];

  const evidenceText = claims.map((claim) => `${claim?.subject || ""} ${claim?.source_quote || ""}`).join(" ");
  const mentioned = usableEntities.filter((entity) => exactMention(evidenceText, entityName(entity)));
  if (mentioned.length === 1) return [entityId(mentioned[0])];

  const organizations = usableEntities.filter((entity) => (
    (entity.entity_type || entity.entityType) === "organization_candidate"
  ));
  return organizations.length === 1 ? [entityId(organizations[0])] : [];
}
