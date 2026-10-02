#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { isMainModule } from '../tools/lib/module-entry.mjs';

export const VERSION = 'FINANCING-READ-MODEL-1';
export function resolveReadModelOutput(root, output = process.env.GUANLAN_FINANCING_READ_MODEL_ROOT) {
  return path.resolve(root, output || 'data-marts/financing');
}
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const list = value => Array.isArray(value) ? value : [];
const json = value => JSON.stringify(value ?? null);
const companyId = card => card.company?.application_entity_id || card.company?.entity_id;
export const SCHEMAS = {
  companies: { company_id:'VARCHAR', name:'VARCHAR', full_name:'VARCHAR', website:'VARCHAR', headquarters:'VARCHAR' },
  funding_subjects: { card_id:'VARCHAR', company_id:'VARCHAR', latest_event_id:'VARCHAR', market:'VARCHAR', sector_id:'VARCHAR', subsector_id:'VARCHAR', product_form_id:'VARCHAR' },
  funding_events: { card_id:'VARCHAR', subject_card_id:'VARCHAR', company_id:'VARCHAR', canonical_event_id:'VARCHAR', announced_at:'VARCHAR', round:'VARCHAR', round_code:'VARCHAR', currency:'VARCHAR', amount_value:'DOUBLE', amount_status:'VARCHAR', amount_original:'VARCHAR', amount_json:'VARCHAR', market:'VARCHAR', sector_id:'VARCHAR', subsector_id:'VARCHAR' },
  event_lineage: { card_id:'VARCHAR', canonical_event_id:'VARCHAR' },
  investment_participations: { card_id:'VARCHAR', ordinal:'INTEGER', institution_id:'VARCHAR', entity_id:'VARCHAR', name:'VARCHAR', role:'VARCHAR', evidence_json:'VARCHAR' },
  people_affiliations: { company_id:'VARCHAR', ordinal:'INTEGER', person_id:'VARCHAR', name:'VARCHAR', role:'VARCHAR', evidence_json:'VARCHAR' },
  source_references: { card_id:'VARCHAR', source_id:'VARCHAR', source_artifact_id:'VARCHAR', raw_id:'VARCHAR', content_hash:'VARCHAR', url:'VARCHAR', title:'VARCHAR', publisher:'VARCHAR' },
  evidence_links: { card_id:'VARCHAR', field_path:'VARCHAR', ordinal:'INTEGER', source_id:'VARCHAR', source_content_hash:'VARCHAR', quote_hash:'VARCHAR', quote:'VARCHAR', claim_id:'VARCHAR' },
  application_research: { card_id:'VARCHAR', company_id:'VARCHAR', company_summary:'VARCHAR', analysis_json:'VARCHAR' },
  id_aliases: { kind:'VARCHAR', old_id:'VARCHAR', target_id:'VARCHAR' },
};

export function projectReadModel(catalog) {
  if (!Array.isArray(catalog.cards) || !Array.isArray(catalog.event_cards)) throw new Error('explicit_financing_subjects_and_events_required');
  const tables = Object.fromEntries(Object.keys(SCHEMAS).map(name => [name, []]));
  const subjects = new Map();
  const companies = new Set();
  for (const card of catalog.cards) {
    const id = card.funding_insight_id, cid = companyId(card);
    if (!id || !cid || subjects.has(id) || companies.has(cid)) throw new Error(`invalid_or_duplicate_financing_subject:${id}`);
    subjects.set(id, card); companies.add(cid);
    tables.companies.push({company_id:cid,name:card.company.name || '',full_name:card.company.full_name || '',website:card.company.website || '',headquarters:card.company.headquarters || ''});
    tables.funding_subjects.push({card_id:id,company_id:cid,latest_event_id:card.triggered_by_event_id || '',market:card.market_scope?.market_region || '',sector_id:card.financing_tags?.sector?.id || '',subsector_id:card.financing_tags?.subsector?.id || '',product_form_id:card.financing_tags?.product_form?.id || ''});
    tables.application_research.push({card_id:id,company_id:cid,company_summary:card.company.summary || '',analysis_json:json(card.analysis)});
    for (const [ordinal,p] of list(card.company.founders).entries()) tables.people_affiliations.push({company_id:cid,ordinal,person_id:p.entity_id || null,name:p.name || '',role:p.role || '',evidence_json:json(p.evidence_refs || [])});
    const sources = new Set();
    for (const s of list(card.research_sources)) {
      if (!s.source_id || sources.has(s.source_id)) throw new Error(`invalid_or_duplicate_financing_source:${id}:${s.source_id}`);
      sources.add(s.source_id);
      tables.source_references.push({card_id:id,source_id:s.source_id,source_artifact_id:s.source_artifact_id || null,raw_id:s.raw_id || null,content_hash:s.content_hash || null,url:s.source_url || '',title:s.title || '',publisher:s.publisher || ''});
    }
    const walk = (value, field) => {
      if (!value || typeof value !== 'object') return;
      for (const [key,child] of Object.entries(value)) {
        if (key === 'evidence_refs' && Array.isArray(child)) {
          for (const [ordinal,ref] of child.entries()) {
            if (!ref.source_id || !sources.has(ref.source_id)) throw new Error(`unresolved_financing_evidence:${id}:${ref.source_id}`);
            tables.evidence_links.push({card_id:id,field_path:field,ordinal,source_id:ref.source_id,source_content_hash:ref.source_content_hash || null,quote_hash:ref.quote_hash || null,quote:ref.quote || '',claim_id:ref.claim_id || null});
          }
        } else if (key !== 'research_sources') walk(child, `${field}.${key}`);
      }
    };
    walk(card, 'subject');
  }
  const eventIds = new Set();
  for (const event of catalog.event_cards) {
    const id=event.funding_insight_id, subjectId=event.subject_card_id;
    if (!id || eventIds.has(id) || !subjects.has(subjectId) || companyId(event)!==companyId(subjects.get(subjectId))) throw new Error(`invalid_financing_event_join:${id}`);
    eventIds.add(id);
    const f=event.financing || {}, amount=f.amount_normalized || {};
    tables.funding_events.push({card_id:id,subject_card_id:subjectId,company_id:companyId(event),canonical_event_id:event.triggered_by_event_id || '',announced_at:f.announced_at || '',round:f.round || '',round_code:f.round_code || '',currency:amount.currency || '',amount_value:Number.isFinite(amount.value)?amount.value:null,amount_status:amount.status || '',amount_original:f.amount_original || f.amount || '',amount_json:json(amount),market:event.market_scope?.market_region || '',sector_id:event.financing_tags?.sector?.id || '',subsector_id:event.financing_tags?.subsector?.id || ''});
    for (const canonical of new Set([event.triggered_by_event_id,...list(event.source_event_ids)].filter(Boolean))) tables.event_lineage.push({card_id:id,canonical_event_id:canonical});
    for (const [ordinal,i] of list(f.investors).entries()) tables.investment_participations.push({card_id:id,ordinal,institution_id:i.institution_id || null,entity_id:i.entity_id || null,name:i.name || '',role:i.role || '',evidence_json:json(i.evidence_refs || [])});
  }
  for (const [kind,aliases,targets] of [['card',catalog.card_aliases,subjects],['company',catalog.company_aliases,companies]]) for (const [old_id,target_id] of Object.entries(aliases || {})) {
    if (!targets.has(target_id)) throw new Error(`unresolved_financing_alias:${old_id}`);
    tables.id_aliases.push({kind,old_id,target_id});
  }
  if (catalog.meta?.card_count!==subjects.size || catalog.meta?.event_count!==eventIds.size) throw new Error('financing_read_model_count_mismatch');
  return tables;
}

const sqlString = value => `'${String(value).replaceAll('\\','/').replaceAll("'","''")}'`;
export function verifyReadModel(release) {
  const manifest=JSON.parse(fs.readFileSync(path.join(release,'manifest.json'),'utf8'));
  if(manifest.version!==VERSION || json(manifest.files.map(f=>f.table).sort())!==json(Object.keys(SCHEMAS).sort())) throw new Error('financing_read_model_contract_mismatch');
  for(const file of manifest.files) {
    const bytes=fs.readFileSync(path.join(release,`${file.table}.jsonl`));
    const rows=bytes.toString('utf8').trim().split('\n').filter(Boolean).map(line=>JSON.parse(line));
    if(hash(bytes)!==file.sha256 || bytes.length!==file.bytes || rows.length!==file.rows) throw new Error(`financing_read_model_file_mismatch:${file.table}`);
  }
  if(manifest.database && (manifest.database!=='finance.duckdb' || hash(fs.readFileSync(path.join(release,manifest.database)))!==manifest.databaseHash)) throw new Error('financing_read_model_database_mismatch');
  return manifest;
}
export function verifyCurrentReadModel({output,inputHash,requireDatabase=true}) {
  const pointer=JSON.parse(fs.readFileSync(path.join(output,'current.json'),'utf8'));
  if(pointer.version!==VERSION || !/^[a-f0-9]{32}$/.test(pointer.releaseId || ''))throw new Error('financing_read_model_pointer_invalid');
  const manifest=verifyReadModel(path.join(output,'releases',pointer.releaseId));
  if(manifest.releaseId!==pointer.releaseId || manifest.inputHash!==pointer.inputHash || (inputHash && manifest.inputHash!==inputHash))throw new Error('financing_read_model_pointer_mismatch');
  if(requireDatabase && manifest.database!=='finance.duckdb')throw new Error('financing_read_model_database_required');
  return manifest;
}
export function buildReadModel({root,output,input=path.join(root,'01-SiteV2/site/data/financing-catalog-v1.json'),duckdb='duckdb',database=true}) {
  const bytes=fs.readFileSync(input), catalog=JSON.parse(bytes), tables=projectReadModel(catalog);
  const inputHash=hash(bytes), releaseId=hash(json([VERSION,inputHash,database,fs.readFileSync(new URL(import.meta.url))])).slice(0,32);
  fs.mkdirSync(output,{recursive:true});
  const lock=path.join(output,'build.lock'); let fd;
  try { fd=fs.openSync(lock,'wx'); } catch (error) { if(error.code==='EEXIST')throw new Error('financing_read_model_build_busy');throw error; }
  const release=path.join(output,'releases',releaseId), temp=`${release}.${process.pid}.tmp`;
  const updatePointer=()=>{const pointer=path.join(output,`current.${process.pid}.tmp`);fs.writeFileSync(pointer,json({version:VERSION,releaseId,inputHash})+'\n');fs.renameSync(pointer,path.join(output,'current.json'));};
  try {
    if(fs.existsSync(release)) {const accepted=verifyReadModel(release);if(accepted.inputHash!==inputHash || accepted.releaseId!==releaseId)throw new Error('financing_read_model_release_mismatch');updatePointer();return {...accepted,reused:true};}
    fs.mkdirSync(temp,{recursive:true});
    const files=[];
    for(const [name,rows] of Object.entries(tables)) {
      const body=rows.map(json).join('\n')+(rows.length?'\n':'');
      fs.writeFileSync(path.join(temp,`${name}.jsonl`),body);
      files.push({table:name,rows:rows.length,bytes:Buffer.byteLength(body),sha256:hash(body)});
    }
    if(database) {
      const statements=[];
      for(const [name,columns] of Object.entries(SCHEMAS)) {
        statements.push(`CREATE TABLE ${name} (${Object.entries(columns).map(([k,t])=>`${k} ${t}`).join(',')});`);
        if(tables[name].length) statements.push(`INSERT INTO ${name} SELECT ${Object.entries(columns).map(([k,t])=>`CAST(${k} AS ${t})`).join(',')} FROM read_json_auto(${sqlString(path.join(temp,`${name}.jsonl`))},format='newline_delimited');`);
      }
      const result=spawnSync(duckdb,[path.join(temp,'finance.duckdb'),'-c',statements.join('\n')],{encoding:'utf8',windowsHide:true,maxBuffer:4*1024*1024});
      if(result.error || result.status!==0) throw new Error(`financing_duckdb_build_failed:${result.error?.message || result.stderr}`);
      const counts=spawnSync(duckdb,[path.join(temp,'finance.duckdb'),'-readonly','-json','-c',Object.keys(SCHEMAS).map(name=>`SELECT '${name}' AS name,count(*) AS rows FROM ${name}`).join(' UNION ALL ')],{encoding:'utf8',windowsHide:true});
      if(counts.status!==0 || JSON.parse(counts.stdout).some(row=>row.rows!==tables[row.name].length)) throw new Error('financing_duckdb_count_mismatch');
    }
    const commit=spawnSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8',windowsHide:true});
    if(commit.status!==0) throw new Error('financing_read_model_source_commit_missing');
    const manifest={version:VERSION,releaseId,inputHash,sourceCommit:commit.stdout.trim(),taxonomyVersion:catalog.meta.taxonomy_version,latestDate:catalog.meta.latest_date,subjectCount:catalog.cards.length,eventCount:catalog.event_cards.length,database:database?'finance.duckdb':null,databaseHash:database?hash(fs.readFileSync(path.join(temp,'finance.duckdb'))):null,files};
    fs.writeFileSync(path.join(temp,'manifest.json'),json(manifest)+'\n');
    // The pointer only advances after the complete immutable release is validated.
    verifyReadModel(temp);
    fs.renameSync(temp,release);
    updatePointer();
    return manifest;
  } finally {
    if(fs.existsSync(temp))fs.rmSync(temp,{recursive:true});
    fs.closeSync(fd);fs.unlinkSync(lock);
  }
}
if(isMainModule(import.meta.url)) {
  const args=new Map(process.argv.slice(2).map(arg=>{const [key,...value]=arg.replace(/^--/,'').split('=');return[key,value.join('=')];}));
  const root=path.resolve(args.get('root') || process.cwd());
  try {console.log(JSON.stringify(buildReadModel({root,output:resolveReadModelOutput(root,args.get('output')),input:args.has('input')?path.resolve(args.get('input')):undefined,duckdb:args.get('duckdb') || process.env.DUCKDB_BIN || 'duckdb',database:args.get('database')!=='false'})));} catch(error) {console.error(error.message);process.exitCode=1;}
}
