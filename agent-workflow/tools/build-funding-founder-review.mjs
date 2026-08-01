#!/usr/bin/env node

import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const PERSON_REVIEW_VERSION = "PERSON-REVIEW-V1.1";
export const FOUNDER_REVIEW_SCHEMA_VERSION = "ENTITY-FUNDING-FOUNDER-REVIEW-V1";
export const REVIEWED_AT = "2026-07-30T12:00:00.000+08:00";

const REVIEWED_FOUNDER_NAMES = [
  "Gavin Uberti",
  "Robert Wachen",
  "Raja Koduri",
  "Bar Winkler",
  "Vishal Dugar",
  "Haroun Beltaifa",
  "Mikhail Galkov",
  "Rafael Quintanilla",
  "Romain Fouilland",
  "Stephen Haney",
  "Chris Zhu",
  "Enrique Lizaso",
  "Andrew Dai",
  "Finn Puklowski",
  "Jason Goodison",
  "Jan Oberhauser",
  "Stav Levi-Neumark",
  "Alex Saroyan",
  "Daniela Amodei",
  "Antonio Mallia",
  "Eugene Cheah",
  "Christian Ferreira",
  "Dr. Dvir Ginzburg",
  "Kyle Rush",
  "Martha Stewart",
  "Paul Eremenko",
  "Faris Masad",
  "Haya Odeh",
  "Alex Dimakis",
  "Mahesh Sathiamoorthy"
];

function clean(value = "") {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function key(value = "") {
  return clean(value).normalize("NFKC").toLocaleLowerCase();
}

function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function stablePersonId(name) {
  const digest = crypto.createHash("sha256").update(`person|${key(name)}`).digest("hex").slice(0, 16);
  return `EN-${digest}`;
}

function companyEvidenceKey(value = "") {
  return key(value)
    .replace(/\b(?:incorporated|corporation|company|limited|inc|corp|ltd|llc|plc)\b/giu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function isExplicitFounderEvidence(person = {}) {
  return /(?:\bfound(?:er|ers|ed|ing)?\b|\bco-?found(?:er|ers|ed|ing)?\b|创始|联合创)/iu.test(
    `${clean(person.role)} ${(person.evidence_refs || []).map((item) => clean(item.quote)).join(" ")}`
  );
}

export function collectFundingFounderCandidates(cards = []) {
  const grouped = new Map();
  for (const card of cards) {
    const sourceById = new Map((card.research_sources || []).map((source) => [source.source_id, source]));
    for (const person of card.company?.founders || []) {
      const name = clean(person.name);
      if (!name || !isExplicitFounderEvidence(person)) continue;
      const companyName = clean(card.company?.name);
      const companyFullName = clean(card.company?.full_name);
      if (companyFullName && companyEvidenceKey(companyName) !== companyEvidenceKey(companyFullName)) continue;
      const companyKey = companyEvidenceKey(companyName);
      const evidenceSupportsCompany = companyKey.length >= 3 && (person.evidence_refs || [])
        .some((reference) => companyEvidenceKey(reference.quote).includes(companyKey));
      if (!evidenceSupportsCompany) continue;
      const profile = {
        funding_insight_id: clean(card.funding_insight_id),
        company_entity_id: clean(card.company?.entity_id),
        company_name: companyName,
        role: clean(person.role),
        as_of_date: clean(card.as_of_date),
        source_event_id: clean(card.triggered_by_event_id),
        evidence_refs: (person.evidence_refs || []).map((reference) => {
          const source = sourceById.get(reference.source_id) || {};
          return {
            source_id: clean(reference.source_id),
            source_url: clean(source.source_url),
            quote: clean(reference.quote),
            source_content_hash: clean(reference.source_content_hash),
            quote_hash: clean(reference.quote_hash)
          };
        }).filter((reference) =>
          reference.source_id
          && reference.source_url
          && reference.quote
          && reference.source_content_hash
          && reference.quote_hash
        )
      };
      if (!profile.funding_insight_id || !profile.company_entity_id || !profile.company_name || !profile.evidence_refs.length) continue;
      const personKey = key(name);
      const candidate = grouped.get(personKey) || { name, profiles: [] };
      const profileKey = `${profile.funding_insight_id}|${profile.company_entity_id}|${profile.role}|${profile.evidence_refs.map((item) => item.quote_hash).join(",")}`;
      if (!candidate.profiles.some((item) => item.profile_key === profileKey)) {
        candidate.profiles.push({ ...profile, profile_key: profileKey });
      }
      grouped.set(personKey, candidate);
    }
  }
  return [...grouped.values()].map((candidate) => ({
    name: candidate.name,
    profiles: candidate.profiles
      .map(({ profile_key: _profileKey, ...profile }) => profile)
      .sort((a, b) => b.as_of_date.localeCompare(a.as_of_date) || a.funding_insight_id.localeCompare(b.funding_insight_id))
  }));
}

function preferredRole(profiles = []) {
  return profiles
    .map((profile) => profile.role)
    .find((role) => /(?:CEO|首席执行官)/iu.test(role))
    || profiles.map((profile) => profile.role).find(Boolean)
    || "Founder";
}

export function buildFundingFounderReview({ cards = [], pendingPersonCount = 0 } = {}) {
  const candidates = collectFundingFounderCandidates(cards);
  const candidateByName = new Map(candidates.map((candidate) => [key(candidate.name), candidate]));
  const missing = REVIEWED_FOUNDER_NAMES.filter((name) => !candidateByName.has(key(name)));
  if (missing.length) throw new Error(`reviewed funding founders missing explicit source evidence: ${missing.join(", ")}`);

  const decisions = REVIEWED_FOUNDER_NAMES.map((reviewedName) => {
    const candidate = candidateByName.get(key(reviewedName));
    const organizationNames = unique(candidate.profiles.map((profile) => profile.company_name));
    const roleTitle = preferredRole(candidate.profiles);
    return {
      entity_id: stablePersonId(reviewedName),
      current: {
        name: reviewedName,
        catalog_type: "person",
        company_names: organizationNames
      },
      action: "confirm",
      merge_into_entity_id: "",
      canonical: {
        name: reviewedName,
        catalog_type: "person",
        aliases: [],
        company_names: organizationNames,
        organization_names: organizationNames,
        role_title: roleTitle,
        funding_profiles: candidate.profiles
      },
      evidence: {
        claim_refs: [],
        secondary_sources: []
      },
      rationale: "融资应用来源摘录明确标识该自然人为创始人或联合创始人；该审核只建立人物档案与融资卡引用，不创建 RELATION-V2.1。",
      review_status: "accepted",
      reviewer: "codex-funding-founder-review",
      reviewed_at: REVIEWED_AT
    };
  });

  return {
    schema_version: FOUNDER_REVIEW_SCHEMA_VERSION,
    review_version: PERSON_REVIEW_VERSION,
    reviewed_at: REVIEWED_AT,
    scope: "Evidence-backed natural-person founder profiles referenced by published FUNDING-INSIGHT-V1.2 cards",
    selection_rule: "Manual first batch: explicit founder/co-founder source language, accepted funding card, stable natural-person identity; no inferred canonical relationship.",
    summary: {
      pending_person_candidates: pendingPersonCount,
      explicit_founder_candidates: candidates.length,
      accepted_founder_profiles: decisions.length,
      deferred_candidates: pendingPersonCount
    },
    decisions
  };
}

function loadRepositoryInputs(root) {
  const fundingRoot = path.join(root, "01-SiteV2/content/12-applications/funding-insights");
  const cards = fs.readdirSync(fundingRoot)
    .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/u.test(name))
    .sort()
    .flatMap((name) => JSON.parse(fs.readFileSync(path.join(fundingRoot, name), "utf8")).cards || []);
  const queue = JSON.parse(fs.readFileSync(path.join(fundingRoot, "entity-review-queue.json"), "utf8"));
  return {
    cards,
    pendingPersonCount: (queue.candidates || []).filter((candidate) => candidate.candidate_kind === "person").length
  };
}

export function assertFundingFounderReview(review = {}) {
  const problems = [];
  if (review.review_version !== PERSON_REVIEW_VERSION) problems.push("review_version_mismatch");
  if (review.decisions?.length !== REVIEWED_FOUNDER_NAMES.length) problems.push("accepted_count_mismatch");
  const expectedNames = [...REVIEWED_FOUNDER_NAMES].map(key).sort();
  const reviewedNames = (review.decisions || []).map((decision) => key(decision.canonical?.name)).sort();
  if (new Set(reviewedNames).size !== reviewedNames.length) problems.push("reviewed_name_duplicate");
  if (JSON.stringify(reviewedNames) !== JSON.stringify(expectedNames)) problems.push("reviewed_name_allowlist_mismatch");
  const ids = new Set();
  for (const decision of review.decisions || []) {
    if (decision.review_status !== "accepted" || !decision.reviewer) problems.push(`${decision.entity_id}:not_accepted`);
    if (decision.canonical?.catalog_type !== "person") problems.push(`${decision.entity_id}:not_person`);
    if (decision.entity_id !== stablePersonId(decision.canonical?.name)) problems.push(`${decision.entity_id}:unstable_id`);
    if (ids.has(decision.entity_id)) problems.push(`${decision.entity_id}:duplicate_id`);
    ids.add(decision.entity_id);
    if (decision.evidence?.claim_refs?.length) problems.push(`${decision.entity_id}:application_claim_refs_forbidden`);
    for (const profile of decision.canonical?.funding_profiles || []) {
      if (!profile.funding_insight_id || !profile.company_entity_id || !profile.as_of_date) problems.push(`${decision.entity_id}:profile_identity_incomplete`);
      if (!(profile.evidence_refs || []).length) problems.push(`${decision.entity_id}:profile_evidence_missing`);
      const profileCompanyKey = companyEvidenceKey(profile.company_name);
      if (profileCompanyKey.length < 3 || !(profile.evidence_refs || [])
        .some((evidence) => companyEvidenceKey(evidence.quote).includes(profileCompanyKey))) {
        problems.push(`${decision.entity_id}:profile_company_evidence_mismatch`);
      }
      for (const evidence of profile.evidence_refs || []) {
        if (!evidence.source_id || !evidence.source_url || !evidence.quote || !evidence.source_content_hash || !evidence.quote_hash) {
          problems.push(`${decision.entity_id}:evidence_incomplete`);
        }
      }
    }
  }
  return [...new Set(problems)];
}

function assertStoredReviewProvenance(review = {}, cards = []) {
  const available = new Map(collectFundingFounderCandidates(cards).map((candidate) => [key(candidate.name), candidate]));
  const problems = [];
  for (const decision of review.decisions || []) {
    const candidate = available.get(key(decision.canonical?.name));
    if (!candidate) {
      problems.push(`${decision.entity_id}:source_candidate_missing`);
      continue;
    }
    const availableQuotes = new Set(candidate.profiles.flatMap((profile) =>
      (profile.evidence_refs || []).map((evidence) => `${evidence.source_id}|${evidence.quote_hash}|${evidence.source_content_hash}`)
    ));
    for (const profile of decision.canonical?.funding_profiles || []) {
      for (const evidence of profile.evidence_refs || []) {
        const evidenceKey = `${evidence.source_id}|${evidence.quote_hash}|${evidence.source_content_hash}`;
        if (!availableQuotes.has(evidenceKey)) problems.push(`${decision.entity_id}:evidence_not_in_funding_source`);
      }
    }
  }
  return [...new Set(problems)];
}

function main() {
  const root = process.cwd();
  const inputs = loadRepositoryInputs(root);
  const review = buildFundingFounderReview(inputs);
  const problems = assertFundingFounderReview(review);
  if (problems.length) throw new Error(`funding founder review invalid:\n- ${problems.join("\n- ")}`);
  const output = path.join(root, "01-SiteV2/content/11-databases/entity-history-v1/funding-founder-review-decisions.json");
  const write = process.argv.includes("--write=true");
  let reportedReview = review;
  if (write) {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    fs.writeFileSync(output, `${JSON.stringify(review, null, 2)}\n`, "utf8");
  } else {
    const current = fs.existsSync(output) ? JSON.parse(fs.readFileSync(output, "utf8")) : {};
    const storedProblems = [
      ...assertFundingFounderReview(current),
      ...assertStoredReviewProvenance(current, inputs.cards)
    ];
    if (storedProblems.length) throw new Error(`stored funding founder review invalid:\n- ${storedProblems.join("\n- ")}`);
    reportedReview = current;
  }
  console.log(JSON.stringify({
    ok: true,
    review_version: reportedReview.review_version,
    accepted_founder_profiles: reportedReview.summary.accepted_founder_profiles,
    explicit_founder_candidates: reportedReview.summary.explicit_founder_candidates,
    deferred_candidates: reportedReview.summary.deferred_candidates,
    output: path.relative(root, output).replaceAll("\\", "/"),
    mode: write ? "write" : "check"
  }, null, 2));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main();
}
