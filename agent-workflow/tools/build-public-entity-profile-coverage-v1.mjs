#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const database = path.join(root, "01-SiteV2/content/11-databases");
const investorData = JSON.parse(fs.readFileSync(path.join(database, "investment-institutions-v1.json"), "utf8"));
const entityData = JSON.parse(fs.readFileSync(path.join(root, "01-SiteV2/site/data/data-center-v4/indexes/entities.json"), "utf8"));
const curated = JSON.parse(fs.readFileSync(path.join(database, "public-entity-profiles-v1.json"), "utf8"));
const asOf = process.env.PUBLIC_PROFILE_AS_OF || "2026-09-25";
const hashPattern = /^(?:[a-f0-9]{16}|[a-f0-9]{64})$/u;

function normalizedQuote(value) {
  return String(value || "").replace(/\s+/gu, " ").trim();
}

function canonicalSource(raw, fallbackId) {
  const quote = normalizedQuote(raw.quote);
  const sourceUrl = raw.source_url || raw.sourceUrl || "";
  const sourceContentHash = raw.source_content_hash || raw.sourceContentHash || "";
  if (!quote || !/^https:\/\//u.test(sourceUrl) || !hashPattern.test(sourceContentHash)) return null;
  const sourceId = String(raw.source_id || raw.sourceId || fallbackId || "");
  if (!sourceId) return null;
  return {
    source_id: sourceId,
    source_url: sourceUrl,
    source_title: raw.source_title || raw.sourceTitle || "融资披露来源",
    source_content_hash: sourceContentHash,
    quote,
    quote_hash: crypto.createHash("sha256").update(quote).digest("hex")
  };
}

function evidenceFor(investor) {
  const activities = [...(investor.activities || [])].sort((a, b) => String(b.announced_at || "").localeCompare(String(a.announced_at || "")));
  const seen = new Set();
  const result = [];
  for (const activity of activities) {
    for (const raw of activity.evidence || []) {
      const source = canonicalSource(raw);
      if (!source || seen.has(source.source_id)) continue;
      seen.add(source.source_id);
      result.push({ activity, source });
      if (result.length >= 3) return result;
    }
  }
  return result;
}

function trackedActivity(activity, sourceId) {
  const pieces = [activity.company_name, activity.round, activity.announced_at, activity.role, activity.amount_original]
    .filter((value) => value && String(value).trim());
  return { description: `融资来源记录：${pieces.join(" · ")}。这是本库收录的披露案例，不代表完整投资组合。`, source_id: sourceId };
}

const coverage = { schema_version: "PUBLIC-ENTITY-PROFILE-COVERAGE-V1.0", as_of: asOf, institutions: {}, people: {} };
const backlog = { schema_version: "PUBLIC-ENTITY-PROFILE-BACKLOG-V1.0", as_of: asOf, unresolved_investors: [], unresolved_people: [] };

for (const investor of investorData.institutions || []) {
  const activityEvidence = evidenceFor(investor);
  if (!activityEvidence.length) {
    backlog.unresolved_investors.push({ id: investor.id, name: investor.name, reason: "no_source_linked_financing_evidence" });
    continue;
  }
  const kind = investor.investor_kind === "individual" ? "person" : investor.investor_kind === "unverified_investor" ? "unverified" : "organization";
  const coverageStatus = kind === "unverified" ? "identity_unverified" : "activity_only";
  const sources = activityEvidence.map((item) => item.source);
  const latest = investor.latest_disclosed_at || investor.first_disclosed_at || asOf;
  const details = activityEvidence.map(({ activity, source }) => trackedActivity(activity, source.source_id));
  const kindLabel = kind === "person" ? "个人投资者" : kind === "unverified" ? "主体类型待核验的投资者名称" : "投资组织";
  coverage.institutions[investor.id] = {
    profile_type: kind,
    coverage_status: coverageStatus,
    coverage_note: kind === "unverified"
      ? "目前只有融资披露中的参投记录，名称对应的法律主体、机构或个人身份尚未核实；请勿将本条视为已确认机构档案。"
      : "当前档案由融资披露证据建立，仅展示可追溯的参投案例；机构背景、现任团队、公开业绩口径与联系方式仍需独立的一手资料核验。",
    summary: `${investor.name} 当前按“${kindLabel}”收录。最新融资披露记录日期为 ${latest}；以下为本库可追溯的参投案例，不代表完整履历、机构业绩或完整投资组合。`,
    facts: [],
    milestones: [],
    track_record: details,
    contacts: [],
    sources,
    last_verified_at: asOf
  };
}

function personEvidence(person) {
  const rawRows = [...(person.founderEvidence || []), ...(person.affiliationEvidence || [])];
  const seen = new Set();
  const rows = [];
  for (const raw of rawRows) {
    const source = canonicalSource(raw);
    if (!source || seen.has(source.source_id)) continue;
    seen.add(source.source_id);
    rows.push({ raw, source });
    if (rows.length >= 4) break;
  }
  return rows;
}

for (const person of entityData.people || []) {
  const evidence = personEvidence(person);
  if (!evidence.length) {
    backlog.unresolved_people.push({ id: person.id, name: person.name, organizations: person.organizationNames || [], reason: "no_source_linked_founder_or_affiliation_evidence" });
    continue;
  }
  const sources = evidence.map((item) => item.source);
  const sourceByCompany = new Map();
  for (const { raw, source } of evidence) {
    const quote = normalizedQuote(raw.quote).toLocaleLowerCase();
    for (const company of person.founderCompanies || []) {
      if (company.name && quote.includes(company.name.toLocaleLowerCase()) && !sourceByCompany.has(company.name)) sourceByCompany.set(company.name, { company, source });
    }
  }
  const career = [...sourceByCompany.values()].map(({ company, source }) => ({
    organization: company.name,
    title: company.role || "创始人身份（来源表述）",
    period: "来源报道日期；任职起止时间未披露",
    description: `融资来源将${person.name}与该公司的此项身份关联；不据此推断其目前仍在任。`,
    source_id: source.source_id
  }));
  if (!career.length && person.roleTitle && (person.organizationNames || []).length) {
    const { raw, source } = evidence[0];
    career.push({
      organization: person.organizationNames[0],
      title: person.roleTitle,
      period: raw.asOfDate ? `来源记录于 ${raw.asOfDate}；任职起止时间未披露` : "来源未标注日期；任职起止时间未披露",
      description: "人物索引所列身份由关联来源支持；不据此推断其目前仍在任。",
      source_id: source.source_id
    });
  }
  const sourceDate = evidence.map(({ raw }) => raw.asOfDate).filter(Boolean).sort().at(-1) || asOf;
  const companyText = career.map((row) => `${row.organization}（${row.title}）`).join("、");
  coverage.people[person.id] = {
    coverage_status: career.length ? "activity_only" : "self_declared_affiliation",
    coverage_note: "当前仅整理已有融资报道或本人公开简介中的身份关联；这不是完整人物履历。职务与公司关系按来源日期呈现，不代表仍在任；教育经历和公开联系方式未核验时留空。",
    summary: `${person.name} 的来源线索${companyText ? `将其与${companyText}关联` : "记录了一项公开职业关联"}。来源日期：${sourceDate}；完整职业时间线仍待一手资料补充。`,
    current_roles: [],
    career,
    education: [],
    experience_summary: "已核验的来源范围限于融资披露或本人公开身份说明；未从无关报道推断任期、学历或更多关联公司。",
    track_record: [],
    sources,
    last_verified_at: asOf
  };
}

for (const [id, profile] of Object.entries(curated.institutions || {})) {
  coverage.institutions[id] = {
    ...profile,
    coverage_status: profile.coverage_status || "researched",
    coverage_note: profile.coverage_note || "本档案包含官网、本人公开资料或一手披露核验内容；详细来源和原文摘录见下方。"
  };
}
for (const [id, profile] of Object.entries(curated.people || {})) {
  coverage.people[id] = {
    ...profile,
    coverage_status: profile.coverage_status || "researched",
    coverage_note: profile.coverage_note || "本档案根据官网或本人公开资料整理；详细来源和原文摘录见下方。"
  };
}
backlog.unresolved_investors = backlog.unresolved_investors.filter((item) => !coverage.institutions[item.id]);
backlog.unresolved_people = backlog.unresolved_people.filter((item) => !coverage.people[item.id]);

fs.writeFileSync(path.join(database, "public-entity-profile-coverage-v1.json"), `${JSON.stringify(coverage, null, 2)}\n`, "utf8");
fs.writeFileSync(path.join(database, "public-entity-profile-backlog-v1.json"), `${JSON.stringify(backlog, null, 2)}\n`, "utf8");
console.log(JSON.stringify({
  ok: true,
  investorProfiles: Object.keys(coverage.institutions).length,
  peopleProfiles: Object.keys(coverage.people).length,
  unresolvedInvestors: backlog.unresolved_investors.length,
  unresolvedPeople: backlog.unresolved_people.length,
  curatedInstitutionOverrides: Object.keys(curated.institutions || {}).length,
  curatedPersonOverrides: Object.keys(curated.people || {}).length
}, null, 2));
