import {createHash} from 'node:crypto';
import {normalizeFundingAmount,normalizeFundingRound} from '../tools/funding-insight-v1-utils.mjs';

const normalized=value=>String(value || '').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const amount=card=>normalizeFundingAmount(card.financing?.amount_original || card.financing?.amount);
const equal=(a,b)=>a.status==='exact' && b.status==='exact' && a.currency===b.currency && a.value===b.value;
const investors=card=>[...new Set((card.financing?.investors || []).map(row=>normalized(row.name)).filter(Boolean))].sort();
const round=card=>card.financing?.round_code || normalizeFundingRound(card.financing?.round_original || card.financing?.round).code;

// Same-day identity and investors only select candidates. An exact, source-bound
// parenthetical currency equivalence is required; exchange rates are not evidence.
export function crossCurrencyRoundEvidence(left,right) {
  const a=amount(left),b=amount(right),names=investors(left);
  if(a.currency===b.currency || !a.currency || !b.currency || a.status!=='exact' || b.status!=='exact')return null;
  const code=round(left);
  if(!code || ['undisclosed','multi_round','other','early_stage'].includes(code) || code!==round(right))return null;
  const date=left.financing?.announced_at;
  if(!/^\d{4}-\d{2}-\d{2}$/u.test(date || '') || date!==right.financing?.announced_at)return null;
  if(!names.length || JSON.stringify(names)!==JSON.stringify(investors(right)))return null;
  const company=normalized(left.company?.name);
  if(!company || company!==normalized(right.company?.name))return null;
  const money=String.raw`[$€£¥₹]\s*\d[\d,.]*\s*(?:billion|million|bn|mn|[MBK])?`;
  const pair=new RegExp(`(${money})\\s*[（(]\\s*(${money})\\s*[)）]`,'giu');
  for(const card of [left,right])for(const ref of card.financing?.evidence_refs || []) {
    const quote=ref.quote || '';
    const source=(card.research_sources || []).find(row=>row.source_id===ref.source_id);
    if(!source?.source_url || !/^[a-f0-9]{64}$/u.test(ref.source_content_hash || '')
      || source.content_hash!==ref.source_content_hash
      || ref.quote_hash!==createHash('sha256').update(quote).digest('hex'))continue;
    // Reject totals, valuations, comparisons and multi-round accounts, even if
    // they happen to contain the same two numbers in a conversion.
    if(!normalized(quote).includes(company)
      || !/\b(?:funding|financing|raised|raises|round)\b|融资|募资/iu.test(quote)
      || /\b(?:valuation|valued|total|cumulative|previous|prior|earlier|debt|credit|another|other round)\b|估值|累计|此前|另一轮|债务/iu.test(quote))continue;
    for(const match of quote.matchAll(pair)) {
      const x=normalizeFundingAmount(match[1]),y=normalizeFundingAmount(match[2]);
      if((equal(a,x)&&equal(b,y)) || (equal(a,y)&&equal(b,x)))return {...ref,source_url:source.source_url};
    }
  }
  return null;
}
