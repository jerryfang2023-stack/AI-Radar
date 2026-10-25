import test from 'node:test';
import assert from 'node:assert/strict';
import {financingDecisionText,fundingClaimGroupingProblem,eventSourceEligibility,reviewedFundingDate} from '../build-data-center-v4.mjs';
import {canonicalFundingEventAmount,isEligibleFundingInsightEvent,normalizeFundingAmount,subjectCompanyForEvent} from '../funding-insight-v1-utils.mjs';
import {isPendingFundingTitle,isWithdrawnFundingTitle} from '../lib/funding-transaction-status.mjs';
const event={event_type:'funding',event_status:'completed',publication_status:'verified',display_title_zh:'某AI企业完成融资',claim_refs:['C'],metrics:['1.45 million']};
const claim=quote=>({claim_id:'C',claim_type:'funding',verification_status:'accepted',object:quote,source_quote:quote});
test('abandoning a product is distinct from withdrawing its financing',()=>{
 assert.equal(isWithdrawnFundingTitle('前Ramp工程师在放弃首款产品后为平台Melius融资2000万美元'),false);
 assert.equal(isWithdrawnFundingTitle('Founders abandoned their first product before raising funding'),false);
 assert.equal(isWithdrawnFundingTitle('放弃首款产品后，公司取消2000万美元融资'),true);
 assert.equal(isWithdrawnFundingTitle('Startup abandoned its funding round to build a new product'),true);
 assert.equal(isWithdrawnFundingTitle('公司取消产品融资'),true);
 assert.equal(isWithdrawnFundingTitle('Startup abandoned its product funding'),true);
});
test('explicit USD and seed amounts retain currency when metrics lose the prefix',()=>{
 const claims=[claim('Acme raised USD 1.45 million in a pre-seed funding round.')];
 assert.equal(normalizeFundingAmount(canonicalFundingEventAmount(event,claims)).currency,'USD');
 assert.equal(isEligibleFundingInsightEvent(event,claims),true);
});
test('unrelated operating metrics do not turn undisclosed financing into proceeds',()=>{
 const c={...claim('某AI企业宣布完成首轮融资。'),qualifiers:{funding_amount_status:'not_disclosed'}};
 assert.equal(canonicalFundingEventAmount({...event,metrics:['2万','50%']},[c]),'');
 assert.equal(isEligibleFundingInsightEvent({...event,metrics:['2万']},[c]),true);
});
test('footers cannot introduce a financing rumor',()=>{
 assert.equal(financingDecisionText('AI公司完成融资。\n投稿爆料：联系记者'),'AI公司完成融资。');
 assert.equal(financingDecisionText('AI公司完成融资。\n【本文根据公开消息发布，不构成任何投资建议。】'),'AI公司完成融资。');
 assert.match(financingDecisionText('据称公司正在融资。'),/据称/);
});
test('reviewed combined disclosure remains distinct from an unreviewed lifetime total',()=>{
 const c={subject:'Acme',object:'近5亿元融资（三轮合并披露）',source_quote:'Acme宣布连续完成3轮融资，累计融资金额近5亿元。'};
 assert.equal(fundingClaimGroupingProblem([c]),'cumulative_funding_total_not_single_round');
 assert.equal(fundingClaimGroupingProblem([{...c,qualifiers:{funding_amount_scope:'combined_rounds'}}]),'');
});
test('lesson plan product is not a planned funding round',()=>{
 assert.equal(isPendingFundingTitle('AI课程计划构建工具完成400万美元融资'),false);
 assert.equal(isPendingFundingTitle('AI教育公司计划完成400万美元融资'),true);
 const result=eventSourceEligibility({published_at:'2026-03-19',clean_text:'Chalkie announced the closure of a $4M funding round.'},{source_url:'https://www.prnewswire.com/news-releases/chalkie.html'},'Chalkie AI-powered lesson plan builder closes $4M funding round','2026-03-19',{eventType:'funding'});
 assert.notEqual(result.reason,'proposed_financing_not_completed');
});
test('financing adverb cannot override the accepted company subject',()=>{
 const q='数美万物宣布完成融资。公司连续完成两轮融资，总额近5000万美元。';
 const c={...claim(q),subject:'数美万物',object:'近5000万美元融资（两轮合并披露）'};
 const e={...event,entities:['E1','E2'],object:c.object,metrics:['5000万美元']};
 const es=[{entity_id:'E1',entity_type:'organization_candidate',canonical_name:'数美万物'},{entity_id:'E2',entity_type:'organization_candidate',canonical_name:'连续'}];
 assert.equal(subjectCompanyForEvent(e,es,{},[c],[q]).canonical_name,'数美万物');
});

test('reviewed announcement date can precede the article without rewriting its publication date',()=>{
 const quote='8月10日，玩点旅行宣布完成近亿元Pre-A+轮融资。';
 const source={published_at:'2026-08-13',clean_text:quote};
 const context={subject:'玩点旅行',amount:'近亿元Pre-A+轮融资',publishedAt:'2026-08-13',sources:new Map([['SA',{raw:source}]])};
 const review={status:'accepted',reviewer:'test',date:'2026-08-10',source_ref:'SA',quote,date_basis:'explicit_announcement'};
 assert.equal(reviewedFundingDate(review,context),'2026-08-10');
 assert.equal(source.published_at,'2026-08-13');
 assert.throws(()=>reviewedFundingDate({...review,date_basis:undefined},context),/invalid_reviewed_funding_date/);
 assert.throws(()=>reviewedFundingDate({...review,date:'2026-08-11'},context),/invalid_reviewed_funding_date/);
 assert.throws(()=>reviewedFundingDate({...review,date:'2025-08-10'},context),/invalid_reviewed_funding_date/);
 assert.throws(()=>reviewedFundingDate(review,{...context,publishedAt:'2026-08-09'}),/invalid_reviewed_funding_date/);
 assert.throws(()=>reviewedFundingDate(review,{...context,amount:'超2亿元A轮融资'}),/invalid_reviewed_funding_date/);
 const historicalQuote='2025年8月10日，玩点旅行宣布完成近亿元Pre-A+轮融资。';
 assert.throws(()=>reviewedFundingDate({...review,quote:historicalQuote},{...context,sources:new Map([['SA',{raw:{...source,clean_text:historicalQuote}}]])}),/invalid_reviewed_funding_date/);
});


test('reviewed English announcement date keeps the article publication date and rejects mismatched dates',()=>{
 const quote='On October 20, that gamble became a $60M Series B at a $1B valuation. Daytona said the round takes its total funding to $91M.';
 const source={published_at:'2026-10-21',clean_text:quote};
 const context={subject:'Daytona',amount:'$60M',publishedAt:'2026-10-21',sources:new Map([['SA',{raw:source}]])};
 const review={status:'accepted',reviewer:'test',date:'2026-10-20',source_ref:'SA',quote,date_basis:'explicit_announcement'};
 assert.equal(reviewedFundingDate(review,context),'2026-10-20');
 assert.equal(source.published_at,'2026-10-21');
 for(const bad of [{...review,date:'2026-10-19'},{...review,date:'2025-10-20'},{...review,date_basis:undefined},{...review,reviewer:''}])assert.throws(()=>reviewedFundingDate(bad,context),/invalid_reviewed_funding_date/);
 assert.throws(()=>reviewedFundingDate(review,{...context,subject:'Other Company'}),/invalid_reviewed_funding_date/);
 assert.throws(()=>reviewedFundingDate(review,{...context,amount:'$70M'}),/invalid_reviewed_funding_date/);
 for(const oldDate of ['October 20, 2025','October 20 2025']) {
 const old=quote.replace('October 20',oldDate);
 assert.throws(()=>reviewedFundingDate({...review,quote:old},{...context,sources:new Map([['SA',{raw:{...source,clean_text:old}}]])}),/invalid_reviewed_funding_date/);
 }
});


test('canonical replay preserves distinct angel and angel-plus rounds and their investors',async()=>{
 const {canonicalFundingEventRound,ensureCanonicalFundingEvidence,normalizeFundingRound,partitionRoundInvestors}=await import('../funding-insight-v1-utils.mjs');
 const event={event_id:'EV-combined',object:'近亿元人民币天使轮及天使 + 轮融资',claim_refs:['CL-combined'],event_time:'2026-10-22'};
 const claims=[{claim_id:'CL-combined',claim_type:'funding',verification_status:'accepted',source_quote:'元示科技宣布已连续完成近亿元人民币天使轮及天使 + 轮融资。',object:event.object}];
 assert.equal(canonicalFundingEventRound(event,claims).code,'multi_round');
 const card={financing:{round:'多轮融资',round_original:'天使轮及天使+轮（多轮融资合计）',investors:[{name:'Angel investor',role:'天使轮联合领投'},{name:'Plus investor',role:'天使+轮领投'}]}};
 ensureCanonicalFundingEvidence(card,{claims},event,[]);
 assert.equal(card.financing.round_code,'multi_round');
 assert.equal(partitionRoundInvestors(card.financing.investors,card.financing.round).current.length,2);
 assert.equal(normalizeFundingRound('天使+轮').code,'angel_plus');
 assert.equal(normalizeFundingRound('种子轮及种子+轮').code,'multi_round');
 assert.equal(normalizeFundingRound('种子+轮').code,'seed_plus');
});
