import crypto from "node:crypto";

export const ENTITY_HISTORY_VERSION = "ENTITY-V1.0";
export const RELATIONSHIP_VERSION = "RELATION-V2.0";

const ENTITY_TYPE_LABELS = {
  organization_candidate: "公司与机构",
  product_candidate: "产品、模型与服务",
  person_candidate: "人物"
};

const EVENT_GROUPS = {
  funding: "fundingAcquisition",
  acquisition: "fundingAcquisition",
  ipo_listing: "fundingAcquisition",
  financial_performance: "fundingAcquisition",
  capital_investment: "deployments",
  deployment: "deployments",
  procurement_contract: "deployments",
  hardware_deployment: "deployments",
  market_expansion: "deployments",
  partnership: "partnerships",
  model_release: "productsServices",
  product_release: "productsServices",
  service_change: "productsServices",
  pricing_change: "productsServices",
  hardware_product: "hardware",
  hardware_capacity: "hardware",
  hardware_supply: "hardware",
  organization_people: "organizationPeople",
  organization_restructuring: "organizationPeople",
  certification_compliance: "productsServices",
  standard_specification: "productsServices",
  security_incident: "productsServices"
};

const INDEXED_DIMENSIONS = new Set(["technology", "use_case", "industry"]);

const REVIEW_TYPE_TO_ENTITY_TYPE = {
  company: "organization_candidate",
  product: "product_candidate",
  person: "person_candidate"
};

function hash(value) {
  return crypto.createHash("sha256").update(String(value)).digest("hex").slice(0, 16);
}

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function key(value = "") {
  return clean(value).normalize("NFKC").toLocaleLowerCase();
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function acceptedReviewDecisions(reviewDecisions = {}) {
  const rows = Array.isArray(reviewDecisions) ? reviewDecisions : reviewDecisions.decisions || [];
  return rows.filter((decision) => decision?.review_status === "accepted" && clean(decision.reviewer));
}

export function mergeEntityReviewDecisionSets(...reviewDecisionSets) {
  const merged = new Map();
  for (const reviewDecisions of reviewDecisionSets) {
    const rows = Array.isArray(reviewDecisions) ? reviewDecisions : reviewDecisions?.decisions || [];
    for (const decision of rows) {
      if (decision?.entity_id) merged.set(decision.entity_id, decision);
    }
  }
  return { decisions: [...merged.values()] };
}

function applyEntityReviewDecisions(entityRows, events, reviewDecisions) {
  const decisions = acceptedReviewDecisions(reviewDecisions);
  if (!decisions.length) {
    return {
      entityRows,
      events,
      decisions,
      remap: new Map(),
      stats: { reviewed: 0, confirmed: 0, corrected: 0, merged: 0, quarantined: 0 }
    };
  }

  const decisionById = new Map(decisions.map((decision) => [decision.entity_id, decision]));
  const removed = new Set();
  const remap = new Map();
  const reviewedCompanyNames = new Set(decisions
    .filter((decision) => decision.action !== "quarantine" && decision.canonical?.catalog_type === "product" && (decision.evidence?.claim_refs || []).length)
    .flatMap((decision) => decision.canonical.company_names || [])
    .map(key));
  const preparedRows = entityRows.map((row) => {
    const decision = decisionById.get(row.entity_id);
    const canonical = decision?.canonical || {};
    const reviewedType = REVIEW_TYPE_TO_ENTITY_TYPE[canonical.catalog_type];
    if (decision?.action === "quarantine" || canonical.catalog_type === "other") {
      removed.add(row.entity_id);
      return null;
    }
    if (decision?.action === "merge" && decision.merge_into_entity_id) {
      remap.set(row.entity_id, decision.merge_into_entity_id);
    }
    if (!decision) return {
      ...row,
      aliases: [...(row.aliases || [])],
      verification_status: row.entity_type === "organization_candidate" && reviewedCompanyNames.has(key(row.canonical_name)) ? "verified" : row.verification_status
    };
    if (decision.action === "confirm") return { ...row, aliases: [...(row.aliases || [])], verification_status: "verified" };
    if (!["correct", "merge"].includes(decision.action)) return { ...row, aliases: [...(row.aliases || [])] };
    const reviewedName = clean(canonical.name);
    return {
      ...row,
      canonical_name: reviewedName || row.canonical_name,
      entity_type: reviewedType || row.entity_type,
      aliases: unique([...(row.aliases || []), reviewedName && key(reviewedName) !== key(row.canonical_name) ? row.canonical_name : ""]),
      verification_status: "verified"
    };
  }).filter(Boolean);

  const preparedIds = new Set(preparedRows.map((row) => row.entity_id));
  for (const decision of decisions) {
    if (preparedIds.has(decision.entity_id) || ["quarantine", "merge"].includes(decision.action)) continue;
    const entityType = REVIEW_TYPE_TO_ENTITY_TYPE[decision.canonical?.catalog_type];
    if (!entityType || !clean(decision.canonical?.name)) continue;
    if (entityType === "person_candidate") continue;
    preparedRows.push({
      entity_id: decision.entity_id,
      canonical_name: clean(decision.canonical.name),
      entity_type: entityType,
      aliases: unique([decision.current?.name]).filter((alias) => key(alias) !== key(decision.canonical.name)),
      verification_status: "verified"
    });
  }

  const resolveId = (entityId) => {
    const seen = new Set();
    let resolved = entityId;
    while (remap.has(resolved) && !seen.has(resolved)) {
      seen.add(resolved);
      resolved = remap.get(resolved);
    }
    return resolved;
  };

  const mergedRows = new Map();
  for (const row of preparedRows) {
    const resolvedId = resolveId(row.entity_id);
    if (removed.has(resolvedId)) continue;
    const target = mergedRows.get(resolvedId);
    const next = { ...row, entity_id: resolvedId };
    if (!target) mergedRows.set(resolvedId, next);
    else {
      if (row.entity_id === resolvedId) {
        target.aliases = unique([...target.aliases, target.canonical_name]).filter((alias) => key(alias) !== key(next.canonical_name));
        target.canonical_name = next.canonical_name;
        target.entity_type = next.entity_type;
      }
      target.aliases = unique([...target.aliases, ...next.aliases, next.canonical_name])
        .filter((alias) => key(alias) !== key(target.canonical_name));
      if (next.verification_status === "verified") target.verification_status = "verified";
    }
  }

  const evidenceEntityIdsByClaim = new Map();
  for (const decision of decisions) {
    if (decision.action === "quarantine") continue;
    const entityId = resolveId(decision.entity_id);
    for (const claimRef of decision.evidence?.claim_refs || []) {
      if (!evidenceEntityIdsByClaim.has(claimRef)) evidenceEntityIdsByClaim.set(claimRef, []);
      evidenceEntityIdsByClaim.get(claimRef).push(entityId);
    }
  }
  const reviewedEvents = events.map((event) => ({
    ...event,
    entityIds: unique([...(event.entityIds || [])
      .filter((entityId) => !removed.has(entityId))
      .map(resolveId)
      .filter((entityId) => !removed.has(entityId)),
    ...(event.claims || []).flatMap((claim) => evidenceEntityIdsByClaim.get(claim.id) || [])])
  }));
  return {
    entityRows: [...mergedRows.values()],
    events: reviewedEvents,
    decisions,
    remap,
    stats: {
      reviewed: decisions.length,
      confirmed: decisions.filter((item) => item.action === "confirm").length,
      corrected: decisions.filter((item) => item.action === "correct").length,
      merged: decisions.filter((item) => item.action === "merge").length,
      quarantined: decisions.filter((item) => item.action === "quarantine").length
    }
  };
}

function dateOnly(value = "") {
  return clean(value).match(/^\d{4}-\d{2}-\d{2}/u)?.[0] || "";
}

function minDate(values = []) {
  return values.filter(Boolean).sort()[0] || "";
}

function maxDate(values = []) {
  return values.filter(Boolean).sort().at(-1) || "";
}

function personId(handle = "", name = "") {
  return `EN-${hash(`person|${key(handle || name)}`)}`;
}

function taxonomyNodeId(dimensionId, valueId) {
  return `TX-${dimensionId}-${valueId}`;
}

function relationId(subjectRef, predicate, objectRef, eventId) {
  return `REL2-${hash(`${subjectRef}|${predicate}|${objectRef}|${eventId}`)}`;
}

function exactNameIndex(text = "", candidate = "") {
  return exactNamePositions(text, candidate).at(-1) ?? -1;
}

function exactNamePositions(text = "", candidate = "") {
  const normalizedText = clean(text).toLocaleLowerCase();
  const normalizedCandidate = key(candidate);
  if (!normalizedText || !normalizedCandidate) return [];
  if (/\p{Script=Han}/u.test(normalizedCandidate)) {
    const positions = [];
    let fromIndex = 0;
    while (fromIndex < normalizedText.length) {
      const index = normalizedText.indexOf(normalizedCandidate, fromIndex);
      if (index < 0) break;
      positions.push(index);
      fromIndex = index + normalizedCandidate.length;
    }
    return positions;
  }
  const escaped = normalizedCandidate.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return [...normalizedText.matchAll(new RegExp(`(?:^|[^\\p{L}\\p{N}_])(${escaped})(?=$|[^\\p{L}\\p{N}_])`, "giu"))]
    .map((match) => match.index + match[0].lastIndexOf(match[1]));
}

function exactNameInText(text = "", candidate = "") {
  return exactNameIndex(text, candidate) >= 0;
}

function eventSummary(event = {}) {
  return {
    id: event.id,
    dataDate: event.dataDate || "",
    date: event.date || "",
    eventType: event.eventType || "",
    eventTypeLabel: event.eventTypeLabel || "",
    eventGroup: event.eventGroup || "",
    status: event.status || "",
    statusLabel: event.statusLabel || "",
    title: event.title || "",
    displayTags: event.displayTags || event.tags || [],
    entityIds: event.entityIds || []
  };
}

function relationshipRow({ subjectRef, subjectType, predicate, objectRef, objectType, event }) {
  return {
    relationship_id: relationId(subjectRef, predicate, objectRef, event.id),
    relationship_version: RELATIONSHIP_VERSION,
    subject_ref: subjectRef,
    subject_type: subjectType,
    predicate,
    object_ref: objectRef,
    object_type: objectType,
    event_id: event.id,
    claim_refs: (event.claims || []).map((claim) => claim.id).filter(Boolean),
    source_refs: (event.sources || []).map((source) => source.id).filter(Boolean),
    data_date: event.dataDate || "",
    status: "verified"
  };
}

function resolveEntity(name, registryById, lookup) {
  const candidate = lookup.get(key(name));
  return candidate ? registryById.get(candidate) : null;
}

function primaryOrganization(event, organizations, allowSingleFallback = true) {
  if (!organizations.length) return null;
  const subjectMatches = organizations
    .map((entity) => ({
      entity,
      index: Math.max(...[entity.name, ...(entity.aliases || [])].map((name) => exactNameIndex(event.subject, name)))
    }))
    .filter((entry) => entry.index >= 0)
    .sort((a, b) => b.index - a.index);
  if (subjectMatches.length && (subjectMatches.length === 1 || subjectMatches[0].index > subjectMatches[1].index)) {
    return subjectMatches[0].entity;
  }
  return allowSingleFallback && organizations.length === 1 ? organizations[0] : null;
}

function hasPublicationAction(event = {}) {
  const actionText = [event.action, event.title, ...(event.claims || []).map((claim) => claim.quote)].map(clean).join(" ");
  return /(?:发布|推出|上线|开源|release(?:d|s)?|launch(?:ed|es)?|introduc(?:e|ed|es)|unveil(?:ed|s)?)/iu.test(actionText);
}

function claimPublisherOrganization(event, organizations) {
  const candidates = [];
  for (const claim of event.claims || []) {
    const quote = clean(claim.quote);
    const actionIndex = quote.search(/(?:发布|推出|上线|开源|release(?:d|s)?|launch(?:ed|es)?|introduc(?:e|ed|es)|unveil(?:ed|s)?)/iu);
    if (actionIndex < 0) continue;
    for (const entity of organizations) {
      const mentionIndices = [entity.name, ...(entity.aliases || [])]
        .flatMap((name) => exactNamePositions(quote, name))
        .filter((index) => index >= 0 && index < actionIndex);
      if (mentionIndices.length > 0) candidates.push({ entity, mentionIndex: Math.max(...mentionIndices) });
    }
  }
  const uniqueCandidates = unique(candidates.map((item) => item.entity.id));
  return uniqueCandidates.length === 1 ? candidates.find((item) => item.entity.id === uniqueCandidates[0])?.entity || null : null;
}

export function claimPublishesProduct(event, publisher, product, organizations = []) {
  const publicationAction = /(?:发布|推出|上线|开源|开放|release(?:d|s)?|launch(?:ed|es)?|introduc(?:e|ed|es)|unveil(?:ed|s)?|roll(?:ed|s)?\s+out|mak(?:e|es|ing)\s+available)/giu;
  const publicationEvidence = /(?:发布|推出|上线|开源|开放|release(?:d|s)?|launch(?:ed|es)?|introduc(?:e|ed|es)|unveil(?:ed|s)?|roll(?:ed|s)?\s+out|mak(?:e|es|ing)\s+available)/iu;
  const publisherNames = [publisher.name, ...(publisher.aliases || [])];
  const productNames = [product.name, ...(product.aliases || [])];
  const productNameInClaim = (text, name) => {
    if (exactNameInText(text, name)) return true;
    const tokens = key(name).split(/\s+/u).filter(Boolean);
    if (tokens.length < 2 || tokens.length > 4 || tokens.some((token) => !/^[a-z0-9][a-z0-9._+-]*$/iu.test(token))) return false;
    const tokenPattern = tokens
      .map((token) => token.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&"))
      .join("(?:\\s+[a-z0-9._+-]+){0,2}\\s+");
    return new RegExp(`(?:^|[^\\p{L}\\p{N}_])${tokenPattern}(?=$|[^\\p{L}\\p{N}_])`, "iu").test(clean(text));
  };

  const textPublishesProduct = (text) => {
    const clauses = clean(text).split(/[;；。！？\n]+/u).map(clean).filter(Boolean);
    for (const clause of clauses) {
      const publisherPositions = [...new Set(publisherNames.flatMap((name) => exactNamePositions(clause, name)))].sort((a, b) => a - b);
      const productPositions = [...new Set(productNames.flatMap((name) => exactNamePositions(clause, name)))].sort((a, b) => a - b);
      if (!publisherPositions.length || !productPositions.length) continue;

      for (const productPosition of productPositions) {
        const beforeProduct = clause.slice(Math.max(0, productPosition - 18), productPosition);
        const afterProduct = clause.slice(productPosition + product.name.length, productPosition + product.name.length + 12);
        if (/(?:类|类似|对比|相比|超过|击败|outperform(?:s|ed|ing)?|compar(?:e|ed|ing)|versus|vs\.?)\s*$/iu.test(beforeProduct) || /^\s*[-‑–—]?like\b/iu.test(afterProduct)) continue;

        for (const action of clause.matchAll(publicationAction)) {
          const actionPosition = action.index || 0;
          const attributedToAnotherOrganization = organizations
            .filter((organization) => organization.id !== publisher.id)
            .some((organization) => [organization.name, ...(organization.aliases || [])]
              .flatMap((name) => exactNamePositions(clause, name))
              .some((position) => position > actionPosition && position <= productPosition && productPosition - position <= 80));
          if (attributedToAnotherOrganization) continue;
          const publisherBefore = publisherPositions.some((position) => position < Math.max(actionPosition, productPosition));
          const activeTarget = publisherBefore && (
            (actionPosition < productPosition && productPosition - actionPosition <= 220)
            || (productPosition < actionPosition && actionPosition - productPosition <= 80)
          );
          const passiveTarget = productPosition < actionPosition
            && publisherPositions.some((position) => position > actionPosition && position - actionPosition <= 80)
            && /\bby\b/iu.test(clause.slice(actionPosition, Math.max(...publisherPositions) + publisher.name.length));
          if (activeTarget || passiveTarget) return true;
        }
      }
    }
    return false;
  };

  for (const claim of event.claims || []) {
    if (textPublishesProduct(claim.quote)) return true;
  }

  const publisherActionClaim = (event.claims || []).some((claim) => {
    const quote = clean(claim.quote);
    return publicationEvidence.test(quote) && publisherNames.some((name) => exactNameInText(quote, name));
  });
  const productClaim = (event.claims || []).some((claim) => productNames.some((name) => productNameInClaim(claim.quote, name)));
  const publisherIsEventSubject = publisherNames.some((name) => exactNamePositions(event.subject, name).includes(0));
  return publisherIsEventSubject && publisherActionClaim && productClaim && textPublishesProduct(event.title);
}

function entityMentioned(text, entity) {
  return [entity.name, ...(entity.aliases || [])].some((name) => exactNameInText(text, name));
}

function explicitOrganizations(event, organizations) {
  const coreText = [event.subject, event.action, event.object].map(clean).join(" ");
  return organizations.filter((entity) => entityMentioned(coreText, entity));
}

function hasPartnershipAction(event = {}) {
  const coreText = [event.subject, event.action, event.object].map(clean).join(" ");
  return /(?:合作|协作|伙伴|联合|携手|结盟|partnership|partner(?:ed|s|ing)?|collaborat(?:e|ed|es|ion)|team(?:s|ed)?\s+up|agreement|strategic[^.]{0,40}with|expand[^.]{0,30}with)/iu.test(coreText);
}

function buildCanonicalRegistry(entityRows, events) {
  const registry = new Map();
  const eventsByEntity = new Map();

  for (const event of events) {
    for (const entityId of event.entityIds || []) {
      if (!eventsByEntity.has(entityId)) eventsByEntity.set(entityId, []);
      eventsByEntity.get(entityId).push(event);
    }
  }

  for (const row of entityRows) {
    if (!ENTITY_TYPE_LABELS[row.entity_type]) continue;
    const existing = registry.get(row.entity_id) || {
      id: row.entity_id,
      name: clean(row.canonical_name) || row.entity_id,
      entityType: row.entity_type,
      typeLabel: ENTITY_TYPE_LABELS[row.entity_type],
      aliases: [],
      verificationStatus: row.verification_status || "candidate",
      datasetScopes: ["canonical"],
      eventIds: [],
      viewpointIds: [],
      classificationRefs: [],
      relatedEntityIds: [],
      firstSeen: "",
      lastSeen: ""
    };
    existing.aliases = unique([...existing.aliases, ...(row.aliases || [])]).filter((alias) => key(alias) !== key(existing.name));
    if (row.verification_status === "verified") existing.verificationStatus = "verified";
    registry.set(row.entity_id, existing);
  }

  for (const entity of registry.values()) {
    const relatedEvents = eventsByEntity.get(entity.id) || [];
    const dates = relatedEvents.flatMap((event) => [event.dataDate, event.date]).map(dateOnly).filter(Boolean);
    entity.eventIds = unique(relatedEvents.map((event) => event.id));
    entity.firstSeen = minDate(dates);
    entity.lastSeen = maxDate(dates);
  }

  const verifiedProductNames = new Set([...registry.values()]
    .filter((entity) => entity.entityType === "product_candidate" && entity.verificationStatus === "verified")
    .flatMap((entity) => [entity.name, ...(entity.aliases || [])])
    .map(key));
  for (const entity of registry.values()) {
    if (entity.entityType === "organization_candidate") {
      entity.aliases = entity.aliases.filter((alias) => !verifiedProductNames.has(key(alias)));
    }
  }

  return registry;
}

function mergeViewpointPeople(registry, viewpointData = {}, reviewDecisions = {}) {
  const decisionById = new Map(acceptedReviewDecisions(reviewDecisions).map((decision) => [decision.entity_id, decision]));
  const personLookup = new Map();
  for (const entity of registry.values()) {
    if (entity.entityType !== "person_candidate") continue;
    personLookup.set(key(entity.name), entity.id);
    for (const alias of entity.aliases) personLookup.set(key(alias), entity.id);
  }

  const builderByKey = new Map((viewpointData.builders || []).map((builder) => [key(builder.handle || builder.name), builder]));
  const grouped = new Map();
  for (const remark of viewpointData.remarks || []) {
    const personKey = key(remark.handle || remark.name);
    if (!personKey) continue;
    if (!grouped.has(personKey)) grouped.set(personKey, []);
    grouped.get(personKey).push(remark);
  }

  for (const [personKey, remarks] of grouped) {
    const latest = [...remarks].sort((a, b) => dateOnly(b.date || b.createdAt).localeCompare(dateOnly(a.date || a.createdAt)))[0] || {};
    const builder = builderByKey.get(personKey) || {};
    const displayName = clean(latest.name || builder.name || latest.handle || builder.handle);
    const id = personLookup.get(key(displayName)) || personId(latest.handle || builder.handle, displayName);
    const decision = decisionById.get(id);
    if (decision?.action === "quarantine" || decision?.canonical?.catalog_type === "other") continue;
    const canonicalName = decision?.canonical?.catalog_type === "person" ? clean(decision.canonical.name) : displayName;
    const existing = registry.get(id) || {
      id,
      name: canonicalName,
      entityType: "person_candidate",
      typeLabel: ENTITY_TYPE_LABELS.person_candidate,
      aliases: canonicalName && key(canonicalName) !== key(displayName) ? [displayName] : [],
      verificationStatus: decision?.canonical?.catalog_type === "person" ? "verified" : "candidate",
      datasetScopes: [],
      eventIds: [],
      viewpointIds: [],
      classificationRefs: [],
      relatedEntityIds: [],
      firstSeen: "",
      lastSeen: ""
    };
    existing.datasetScopes = unique([...existing.datasetScopes, "viewpoints"]);
    existing.viewpointIds = unique([...existing.viewpointIds, ...remarks.map((item) => item.id).filter(Boolean)]);
    existing.handle = clean(latest.handle || builder.handle);
    existing.role = clean(latest.role || builder.role);
    existing.organization = clean(latest.organization);
    existing.viewpointTags = unique(remarks.flatMap((item) => [item.topic, ...(item.columnTags || []).map((tag) => tag.name || tag.id)]));
    const dates = remarks.map((item) => dateOnly(item.date || item.createdAt)).filter(Boolean);
    existing.firstSeen = minDate([existing.firstSeen, ...dates]);
    existing.lastSeen = maxDate([existing.lastSeen, ...dates]);
    registry.set(id, existing);
  }
}

function buildTaxonomyNodes(events, fdeRecords, hardwareRecords) {
  const nodes = new Map();
  for (const event of events) {
    for (const classification of event.classifications || []) {
      if (!INDEXED_DIMENSIONS.has(classification.dimensionId)) continue;
      const nodeId = taxonomyNodeId(classification.dimensionId, classification.id);
      const node = nodes.get(nodeId) || {
        id: nodeId,
        name: classification.name || classification.id,
        nodeType: classification.dimensionId,
        typeLabel: classification.dimensionName || classification.dimensionId,
        valueId: classification.id,
        eventIds: [],
        entityIds: [],
        fdeIds: [],
        hardwareIds: [],
        firstSeen: "",
        lastSeen: ""
      };
      node.eventIds.push(event.id);
      node.entityIds.push(...(event.entityIds || []));
      node.fdeIds.push(...fdeRecords.filter((item) => item.eventId === event.id).map((item) => item.id));
      node.hardwareIds.push(...hardwareRecords.filter((item) => item.eventId === event.id).map((item) => item.id));
      const dates = [node.firstSeen, event.dataDate, event.date].map(dateOnly).filter(Boolean);
      node.firstSeen = minDate(dates);
      node.lastSeen = maxDate([node.lastSeen, ...dates]);
      nodes.set(nodeId, node);
    }
  }
  for (const node of nodes.values()) {
    node.eventIds = unique(node.eventIds);
    node.entityIds = unique(node.entityIds);
    node.fdeIds = unique(node.fdeIds);
    node.hardwareIds = unique(node.hardwareIds);
  }
  return nodes;
}

function buildTypedRelationships({ registry, events, fdeRecords, hardwareRecords, taxonomyNodes, reviewDecisions = [], entityIdRemap = new Map() }) {
  const relationships = new Map();
  const lookup = new Map();
  for (const entity of registry.values()) {
    lookup.set(key(entity.name), entity.id);
    for (const alias of entity.aliases || []) lookup.set(key(alias), entity.id);
  }
  const eventsById = new Map(events.map((event) => [event.id, event]));

  const add = (row) => {
    if (!row.subject_ref || !row.object_ref || !row.event_id || !row.claim_refs.length || !row.source_refs.length) return;
    if (row.subject_ref === row.object_ref) return;
    if (row.subject_type === "entity" && registry.get(row.subject_ref)?.verificationStatus !== "verified") return;
    if (row.object_type === "entity" && registry.get(row.object_ref)?.verificationStatus !== "verified") return;
    relationships.set(row.relationship_id, row);
  };

  for (const event of events) {
    const eventEntities = (event.entityIds || []).map((id) => registry.get(id)).filter(Boolean);
    const organizations = eventEntities.filter((entity) => entity.entityType === "organization_candidate" && entity.verificationStatus === "verified");
    const products = eventEntities.filter((entity) => entity.entityType === "product_candidate" && entity.verificationStatus === "verified");
    const primary = primaryOrganization(event, organizations);
    const explicitPrimary = primaryOrganization(event, organizations, false) || claimPublisherOrganization(event, organizations);

    if (["model_release", "product_release", "hardware_product"].includes(event.eventType) && hasPublicationAction(event) && explicitPrimary) {
      for (const product of products.filter((item) => claimPublishesProduct(event, explicitPrimary, item, organizations))) {
        add(relationshipRow({ subjectRef: explicitPrimary.id, subjectType: "entity", predicate: "publishes", objectRef: product.id, objectType: "entity", event }));
      }
    }

    const explicitPartners = explicitOrganizations(event, organizations);
    if (event.eventType === "partnership" && explicitPartners.length === 2 && hasPartnershipAction(event)) {
      const pair = [...explicitPartners].sort((a, b) => a.id.localeCompare(b.id));
      add(relationshipRow({ subjectRef: pair[0].id, subjectType: "entity", predicate: "partners_with", objectRef: pair[1].id, objectType: "entity", event }));
    }

    if (event.eventType === "acquisition") {
      const subject = primary;
      const object = organizations.find((entity) => entity.id !== subject?.id && exactNameInText(event.object, entity.name));
      if (subject && object) add(relationshipRow({ subjectRef: subject.id, subjectType: "entity", predicate: "acquires", objectRef: object.id, objectType: "entity", event }));
    }

    if (["deployment", "hardware_deployment"].includes(event.eventType)) {
      for (const product of products) {
        for (const classification of event.classifications || []) {
          if (classification.dimensionId !== "use_case") continue;
          const nodeId = taxonomyNodeId(classification.dimensionId, classification.id);
          if (taxonomyNodes.has(nodeId)) add(relationshipRow({ subjectRef: product.id, subjectType: "entity", predicate: "deployed_in", objectRef: nodeId, objectType: "taxonomy", event }));
        }
      }
    }
  }

  const resolveReviewedId = (entityId) => {
    const seen = new Set();
    let resolved = entityId;
    while (entityIdRemap.has(resolved) && !seen.has(resolved)) {
      seen.add(resolved);
      resolved = entityIdRemap.get(resolved);
    }
    return resolved;
  };
  for (const decision of reviewDecisions) {
    if (!["confirm", "correct", "merge"].includes(decision.action)) continue;
    const product = registry.get(resolveReviewedId(decision.entity_id));
    if (!product || product.entityType !== "product_candidate" || product.verificationStatus !== "verified") continue;
    const companyNames = decision.canonical?.company_names || [];
    const claimRefs = new Set(decision.evidence?.claim_refs || []);
    if (!companyNames.length || !claimRefs.size) continue;
    for (const event of events) {
      const reviewedClaims = (event.claims || []).filter((claim) => claimRefs.has(claim.id));
      if (!reviewedClaims.length) continue;
      const reviewedEvent = { ...event, claims: reviewedClaims };
      const eventOrganizations = unique([
        ...(event.entityIds || []).map((id) => registry.get(id)).filter((entity) => entity?.entityType === "organization_candidate"),
        ...companyNames.map((name) => resolveEntity(name, registry, lookup)).filter(Boolean)
      ]);
      for (const companyName of companyNames) {
        const company = resolveEntity(companyName, registry, lookup);
        if (!company || company.entityType !== "organization_candidate" || company.verificationStatus !== "verified") continue;
        if (!claimPublishesProduct(reviewedEvent, company, product, eventOrganizations)) continue;
        add(relationshipRow({ subjectRef: company.id, subjectType: "entity", predicate: "publishes", objectRef: product.id, objectType: "entity", event: reviewedEvent }));
      }
    }
  }

  for (const record of fdeRecords) {
    const event = eventsById.get(record.eventId);
    if (!event) continue;
    const vendor = resolveEntity(record.vendor, registry, lookup);
    const customer = resolveEntity(record.customer, registry, lookup);
    if (vendor && customer) add(relationshipRow({ subjectRef: vendor.id, subjectType: "entity", predicate: "serves", objectRef: customer.id, objectType: "entity", event }));
  }

  for (const record of hardwareRecords) {
    const event = eventsById.get(record.eventId);
    if (!event) continue;
    const supplier = resolveEntity(record.supplier, registry, lookup);
    const customer = resolveEntity(record.customer, registry, lookup);
    if (supplier && customer) add(relationshipRow({ subjectRef: supplier.id, subjectType: "entity", predicate: "supplies_hardware_to", objectRef: customer.id, objectType: "entity", event }));
  }

  const reviewedPublisherAllowlist = new Map();
  for (const decision of reviewDecisions) {
    if (decision.canonical?.catalog_type !== "product" || decision.action === "quarantine") continue;
    const productId = resolveReviewedId(decision.entity_id);
    const companyIds = new Set((decision.canonical.company_names || [])
      .map((name) => resolveEntity(name, registry, lookup)?.id)
      .filter(Boolean));
    reviewedPublisherAllowlist.set(productId, companyIds);
  }
  return [...relationships.values()]
    .filter((relation) => relation.predicate !== "publishes"
      || !reviewedPublisherAllowlist.has(relation.object_ref)
      || reviewedPublisherAllowlist.get(relation.object_ref).has(relation.subject_ref))
    .sort((a, b) => b.data_date.localeCompare(a.data_date) || a.relationship_id.localeCompare(b.relationship_id));
}

function buildProfiles({ registry, events, relationships, taxonomyNodes, viewpointData }) {
  const eventsById = new Map(events.map((event) => [event.id, event]));
  const remarksById = new Map((viewpointData.remarks || []).map((remark) => [remark.id, remark]));
  const nodesByEntity = new Map();
  for (const node of taxonomyNodes.values()) {
    for (const entityId of node.entityIds) {
      if (!nodesByEntity.has(entityId)) nodesByEntity.set(entityId, []);
      nodesByEntity.get(entityId).push(node.id);
    }
  }

  const relationsByEntity = new Map();
  for (const relation of relationships) {
    for (const entityId of [relation.subject_ref, relation.object_type === "entity" ? relation.object_ref : ""].filter(Boolean)) {
      if (!relationsByEntity.has(entityId)) relationsByEntity.set(entityId, []);
      relationsByEntity.get(entityId).push(relation.relationship_id);
    }
  }

  return [...registry.values()].map((entity) => {
    const relationEventIds = relationships
      .filter((relation) => relation.subject_ref === entity.id || (relation.object_type === "entity" && relation.object_ref === entity.id))
      .map((relation) => relation.event_id);
    const entityEvents = unique([...entity.eventIds, ...relationEventIds]).map((id) => eventsById.get(id)).filter(Boolean).sort((a, b) => (b.dataDate || b.date).localeCompare(a.dataDate || a.date));
    const groupedEventIds = {
      fundingAcquisition: [],
      deployments: [],
      partnerships: [],
      productsServices: [],
      hardware: [],
      organizationPeople: [],
      other: []
    };
    for (const event of entityEvents) groupedEventIds[EVENT_GROUPS[event.eventType] || "other"].push(event.id);
    const relatedEntityIds = unique(relationships.flatMap((relation) => {
      if (relation.subject_ref === entity.id && relation.object_type === "entity") return [relation.object_ref];
      if (relation.object_ref === entity.id && relation.subject_type === "entity") return [relation.subject_ref];
      return [];
    }));
    entity.relatedEntityIds = relatedEntityIds;
    entity.classificationRefs = unique(nodesByEntity.get(entity.id) || []);
    return {
      ...entity,
      relationIds: unique(relationsByEntity.get(entity.id) || []),
      groupedEventIds,
      timeline: entityEvents.map(eventSummary),
      viewpoints: entity.viewpointIds.map((id) => remarksById.get(id)).filter(Boolean).map((remark) => ({
        id: remark.id,
        date: dateOnly(remark.date || remark.createdAt),
        title: clean(remark.translation || remark.text),
        sourceUrl: remark.url || ""
      }))
    };
  }).sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
}

export function buildEntityHistoryService({
  entityRows = [],
  events = [],
  fdeRecords = [],
  hardwareRecords = [],
  viewpointData = {},
  reviewDecisions = {}
} = {}) {
  const reviewed = applyEntityReviewDecisions(entityRows, events, reviewDecisions);
  const registry = buildCanonicalRegistry(reviewed.entityRows, reviewed.events);
  mergeViewpointPeople(registry, viewpointData, reviewDecisions);
  const taxonomyNodes = buildTaxonomyNodes(reviewed.events, fdeRecords, hardwareRecords);
  const relationships = buildTypedRelationships({ registry, events: reviewed.events, fdeRecords, hardwareRecords, taxonomyNodes, reviewDecisions: reviewed.decisions, entityIdRemap: reviewed.remap });
  const profiles = buildProfiles({ registry, events: reviewed.events, relationships, taxonomyNodes, viewpointData });
  const dates = reviewed.events.flatMap((event) => [event.dataDate, event.date]).map(dateOnly).filter(Boolean);
  const manifest = {
    entityVersion: ENTITY_HISTORY_VERSION,
    relationshipVersion: RELATIONSHIP_VERSION,
    generatedAt: new Date().toISOString(),
    coverage: {
      startDate: minDate(dates),
      endDate: maxDate(dates),
      distinctDataDays: new Set(events.map((event) => dateOnly(event.dataDate)).filter(Boolean)).size
    },
    counts: {
      entities: profiles.length,
      organizations: profiles.filter((item) => item.entityType === "organization_candidate").length,
      products: profiles.filter((item) => item.entityType === "product_candidate").length,
      people: profiles.filter((item) => item.entityType === "person_candidate").length,
      taxonomyNodes: taxonomyNodes.size,
      relationships: relationships.length
    },
    review: reviewed.stats
  };
  return {
    manifest,
    registry: profiles.map(({ timeline, viewpoints, groupedEventIds, relationIds, ...item }) => item),
    profiles,
    taxonomyNodes: [...taxonomyNodes.values()].sort((a, b) => a.name.localeCompare(b.name, "zh-CN")),
    relationships
  };
}
