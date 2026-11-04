import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';

const catalogPath='01-SiteV2/site/data/financing-catalog-v1.json';
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const facts=card=>({company:card.company,financing:card.financing,financing_tags:card.financing_tags,products:card.products});
export function publicationReviewDelta(before,after) {
  const compare=(oldRows,newRows)=>{
    const old=new Map(oldRows.map(c=>[c.funding_insight_id,c])),current=new Map(newRows.map(c=>[c.funding_insight_id,c]));
    return {added:newRows.filter(c=>!old.has(c.funding_insight_id)),removed:oldRows.filter(c=>!current.has(c.funding_insight_id)),
      changed:newRows.filter(c=>old.has(c.funding_insight_id)&&hash(facts(c))!==hash(facts(old.get(c.funding_insight_id)))).map(c=>({before:old.get(c.funding_insight_id),after:c}))};
  };
  return {subjects:compare(before.cards,after.cards),events:compare(before.event_cards,after.event_cards)};
}

export function originalLocators(card,evidenceRoot,catalog) {
  const locators=[];
  const inside=relative=>{const resolved=path.resolve(evidenceRoot,relative);return !path.relative(evidenceRoot,resolved).startsWith('..')&&fs.existsSync(resolved);};
  for(const source of card.research_sources || []) {
    if(!/^FISRC-[a-f0-9]+$/u.test(source.source_id || '') || !source.content_hash)continue;
    const cache=`funding-research/${source.source_id}.json`;
    if(inside(cache)) {
      const record=JSON.parse(fs.readFileSync(path.join(evidenceRoot,cache),'utf8'));
      if(record.content_hash===source.content_hash && record.body_clean)locators.push({path:cache,source_url:source.source_url,content_hash:source.content_hash});
    }
    for(const row of catalog.filter(row=>row.source_url===source.source_url&&row.content_hash===source.content_hash)) {
      if(row.object_ref&&inside(row.object_ref))locators.push({path:row.object_ref,source_url:source.source_url,content_hash:source.content_hash});
    }
  }
  return [...new Map(locators.map(row=>[row.path,row])).values()];
}


// Text presence is an audit aid, not approval of a field's factual meaning.
export function publicationQuoteAudit(card, evidenceRoot, locators) {
  const sources = new Map((card.research_sources || []).map(source => [source.source_id, source]));
  const results = [];
  const visit = (value, field = 'card') => {
    if (!value || typeof value !== 'object') return;
    if (value.source_id && value.quote) {
      const source = sources.get(value.source_id);
      const candidates = locators.filter(row => row.source_url === source?.source_url && row.content_hash === source?.content_hash);
      let matched = false, originalPath = '';
      for (const candidate of candidates) {
        const file = path.resolve(evidenceRoot, candidate.path);
        const relative = path.relative(fs.realpathSync(evidenceRoot), fs.realpathSync(file));
        if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('review_original_path_escape');
        const raw = fs.readFileSync(file, 'utf8');
        const body = candidate.path.endsWith('.json') ? JSON.parse(raw).body_clean : raw;
        if (String(body || '').replace(/\s+/gu, ' ').trim().includes(String(value.quote).replace(/\s+/gu, ' ').trim())) {
          matched = true; originalPath = candidate.path; break;
        }
      }
      results.push({field, source_id: value.source_id, content_hash: source?.content_hash || '',
        quote_sha256: createHash('sha256').update(value.quote).digest('hex'), matched, original_path: originalPath});
    }
    for (const [key, child] of Object.entries(value)) visit(child, `${field}.${key}`);
  };
  visit(card);
  return results;
}

export function writePublicationReviewContext({checkout,directory,base,head,date,evidenceRoot}) {
  fs.mkdirSync(directory,{recursive:true});
  const baseFile=path.join(directory,'base-financing-catalog.json'),fd=fs.openSync(baseFile,'w',0o600);
  let result;try {result=spawnSync('git',['show',`${base}:${catalogPath}`],{cwd:checkout,stdio:['ignore',fd,'pipe'],encoding:'utf8',windowsHide:true});}finally{fs.closeSync(fd);}
  if(result.status!==0)throw new Error('review_base_catalog_unavailable');
  const before=JSON.parse(fs.readFileSync(baseFile,'utf8')),after=JSON.parse(fs.readFileSync(path.join(checkout,catalogPath),'utf8'));
  const delta=publicationReviewDelta(before,after),files=[];
  const emit=(name,data)=>{const file=path.join(directory,name);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(data,null,2)+'\n',{mode:0o600});files.push(name);};
  for(const kind of ['subjects','events'])for(const status of ['added','removed','changed'])for(const row of delta[kind][status]){
    const id=(row.after || row).funding_insight_id;
    if(!/^FI-[a-zA-Z0-9-]+$/u.test(id))throw new Error('review_card_id_invalid');
    emit(`publication-delta/${kind}-${status}-${id}.json`,row);
  }
  const publication=JSON.parse(fs.readFileSync(path.join(checkout,`agent-workflow/reports/financing/${date}/publication.json`),'utf8'));
  const required_originals={},quote_audit={};
  if(evidenceRoot) {
    const catalog=fs.readFileSync(path.join(evidenceRoot,'catalog.jsonl'),'utf8').split(/\r?\n/u).filter(Boolean).map(line=>JSON.parse(line));
    for(const card of [...delta.subjects.added,...delta.subjects.changed.map(row=>row.after)]) {
      const locators=originalLocators(card,evidenceRoot,catalog);
      if(!locators.length)throw new Error(`review_private_original_missing:${card.funding_insight_id}`);
      required_originals[card.funding_insight_id]=locators;
      quote_audit[card.funding_insight_id]=publicationQuoteAudit(card,evidenceRoot,locators);
    }
  }
  const summary={version:'FINANCING-PUBLICATION-REVIEW-CONTEXT-1',date,base_commit:base,head_commit:head,
    before:{subjects:before.cards.length,events:before.event_cards.length},after:{subjects:after.cards.length,events:after.event_cards.length},
    delta:Object.fromEntries(Object.entries(delta).map(([kind,rows])=>[kind,Object.fromEntries(Object.entries(rows).map(([status,items])=>[status,items.length]))])),
    files,required_originals,quote_audit,verification_queue_counts:publication.verification?.counts,
    boundary:'Queue verification counts are not publication delta counts. Monitoring date is not financing announcement date. This packet is navigation and comparison metadata, not factual approval. Read captured originals and claims for every admitted addition or factual change. Catalog review exclusions/holds must remain excluded. Raw canonical verified status does not itself establish financing publication eligibility.',
    pending_publication:after.review?.publication_pending || [],excluded_count:after.review?.excluded?.length,pending_classification_count:after.review?.pending?.length};
  fs.writeFileSync(path.join(directory,'publication-review-context.json'),JSON.stringify(summary,null,2)+'\n',{mode:0o600});
  return summary;
}
