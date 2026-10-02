import test from 'node:test';
import assert from 'node:assert/strict';
import {financingDecisionText,fundingClaimGroupingProblem,eventSourceEligibility,reviewedFundingDate} from '../build-data-center-v4.mjs';
import {canonicalFundingEventAmount,isEligibleFundingInsightEvent,normalizeFundingAmount,subjectCompanyForEvent} from '../funding-insight-v1-utils.mjs';
import {isPendingFundingTitle} from '../lib/funding-transaction-status.mjs';
const event={event_type:'funding',event_status:'completed',publication_status:'verified',display_title_zh:'某AI企业完成融资',claim_refs:['C'],metrics:['1.45 million']};
const claim=quote=>({claim_id:'C',claim_type:'funding',verification_status:'accepted',object:quote,source_quote:quote});
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
