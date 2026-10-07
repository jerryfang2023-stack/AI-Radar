import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {parseOriginal,originalDate,readOriginalPage,fetchText} from '../original-page.mjs';

test('WeChat current-article timestamp uses its display timezone without trusting other hosts',()=>{
 const timestamp=Date.parse('2026-04-09T16:05:00Z')/1000;
 const html=`<h1>融资公告</h1><div id="js_content">${'融资原文'.repeat(100)}</div><script>var ct = "${timestamp}";</script>`;
 assert.equal(parseOriginal(html,{url:'https://mp.weixin.qq.com/s/fixture'}).date,'2026-04-10');
 assert.equal(parseOriginal(html,{url:'https://example.com/fixture'}).date,'');
 assert.equal(parseOriginal(html.replace('js_content','unrelated'),{url:'https://mp.weixin.qq.com/s/fixture'}).date,'');
});
import {parseSubscription,collectSubscriptions,sourceRegistry} from '../subscriptions.mjs';
import {syncAIHotSelected} from '../aihot-selected.mjs';
import {createOriginalReader} from '../original-reader.mjs';
import {captureOriginal} from '../capture.mjs';
import {read,write} from '../state.mjs';
import {discover} from '../discovery.mjs';
import {fundingResearchCoverage,independentResearchSources,planFundingResearch} from '../../tools/lib/funding-research-plan.mjs';

const temp=t=>{const dir=fs.mkdtempSync(path.join(os.tmpdir(),'financing-sources-'));t.after(()=>fs.rmSync(dir,{recursive:true,force:true}));return dir;};
const body='Acme AI raised $20 million in Series A funding. It provides an AI platform to enterprise customers. '.repeat(6);
const html=(extra='')=>`<html><head><title>Acme AI raises funding</title>${extra}</head><article><h1>Acme AI raises funding</h1><p>${body}</p></article></html>`;
const json=value=>new Response(JSON.stringify(value),{headers:{'content-type':'application/json'}});
const item=(id='a',title='Acme AI raises funding')=>({id,title,originalTitle:title,links:{original:`https://example.com/${id}`},publishedAt:'2026-10-01T09:00:00Z'});

test('article dates support Chinese and absolute English dates but reject updates, URL and search dates',()=>{
 assert.equal(originalDate('2026年10月1日 12:20'),'2026-10-01');
 assert.equal(originalDate('September 30, 2026'),'2026-09-30');
 assert.equal(originalDate('2026-05-28T17:13:20.706Z'),'2026-05-28');
 assert.equal(originalDate('2026-05-28T23:13:20-07:00'),'2026-05-28');
 assert.equal(originalDate(Date.parse('2026-05-28T17:13:20Z')),'2026-05-28');
 assert.equal(originalDate('2026-02-31'),'');assert.equal(originalDate('昨天'),'');
 assert.equal(parseOriginal(html('<meta name="dateModified" content="2026-10-01">'),{url:'https://example.com/2026/10/01/a'}).date,'');
 const parsed=parseOriginal(html('<meta name="pubtime" content="2026-10-01 09:12:00">'));
 assert.equal(parsed.date,'2026-10-01');assert.equal(parsed.date_evidence.method,'meta:pubtime');
});
test('JSON-LD graphs, attribute order, Chinese publisher rules and article-only text are parsed',()=>{
 const article=html('<script type="application/ld+json">'+JSON.stringify({'@graph':[{'@type':'Organization'},{'@type':['Article','NewsArticle'],datePublished:'2026-10-01',headline:'Acme financing'}]})+'</script>').replace('<article>','<nav>not article</nav><article>');
 const parsed=parseOriginal(article);assert.equal(parsed.date,'2026-10-01');assert.ok(!parsed.body.includes('not article'));
 const chinese=parseOriginal(html().replace('<article>','<div class="news-info"><span class="date">2026年10月1日</span></div><article>'),{url:'https://news.pedaily.cn/a'});
 assert.equal(chinese.date,'2026-10-01');
});
test('unrelated visible dates do not supply missing publication time',()=>{
 assert.equal(parseOriginal(html().replace('</article>','<aside><time datetime="2026-10-01">Related</time></aside></article>')).date,'');
 assert.equal(parseOriginal(html().replace('</article>','<time class="updated" datetime="2026-10-01">Updated</time></article>')).date,'');
 assert.equal(parseOriginal(html().replace('</article>','<div><time datetime="2026-05-21">May 21</time></div><div><time datetime="2026-05-21">May 21</time></div></article>')).date,'2026-05-21');
});
test('homepages and financing lists cannot masquerade as single article originals',()=>{
 assert.equal(parseOriginal(html(),{url:'https://example.com/'}).article_like,false);
 assert.equal(parseOriginal(html(),{url:'https://example.com/financing-flash'}).article_like,false);
 assert.equal(parseOriginal(html(),{url:'https://example.com/news/acme-round'}).article_like,true);
 const p=parseOriginal(html().replace('<article>','<span id="pubtime_baidu">2026/10/1 15:43:13</span><article>'),{url:'https://www.ithome.com/1/009/085.htm'});
 assert.equal(p.date,'2026-10-01');assert.equal(p.date_evidence.method,'site:publication_date');
});
test('reader recovery still requires the requested original and cannot accept challenge text',async()=>{
 const fetcher=async()=>new Response('Forbidden',{status:403});
 const reader=async url=>({url,title:'Acme funding',body,published_at:'2026-10-01'});
 const result=await readOriginalPage('https://example.com/a',{fetcher,reader});
 assert.equal(result.method,'original_reader');assert.equal(result.date,'2026-10-01');
 await assert.rejects(readOriginalPage('https://example.com/a',{fetcher,reader:async()=>({url:'https://other.com/a',body})}),/source_mismatch/);
 await assert.rejects(readOriginalPage('https://example.com/a',{fetcher,reader:async()=>({body,title:'Just a moment'})}),/unreadable/);
});
test('original redirects cannot reach local services; quoted encodings work',async()=>{
 await assert.rejects(fetchText('https://example.com',{fetcher:async()=>new Response('',{status:302,headers:{location:'http://127.0.0.1/secrets'}})}),/not_public/);
 const p=await fetchText('https://example.com',{fetcher:async()=>new Response('中文',{headers:{'content-type':'text/html; charset="utf-8"'}})});assert.equal(p.text,'中文');
 const duplicateHeader=await fetchText('https://example.com',{fetcher:async()=>new Response('融资原文',{headers:{'content-type':'text/html; charset=utf-8, text/html; charset=utf-8'}})});assert.equal(duplicateHeader.text,'融资原文');
});
test('cross-origin redirects strip credentials and rendered listings stay pending',async()=>{
 const seen=[];
 await fetchText('https://example.com/a',{headers:{Authorization:'fixture',cookie:'fixture'},fetcher:async(url,options)=>{
   seen.push(options.headers);return seen.length===1?new Response('',{status:302,headers:{location:'https://other.com/a'}}):new Response('page');
 }});
 assert.equal(seen[0].Authorization,'fixture');assert.equal(seen[1].Authorization,undefined);assert.equal(seen[1].cookie,undefined);
 const result=await captureOriginal({url:'https://example.com/'},{date:'2026-10-02',fetcher:async()=>new Response('',{status:403}),reader:async url=>({url,title:'AI financing',body,published_at:'2026-10-01'})});
 assert.equal(result.reason,'original_article_required');
 await assert.rejects(readOriginalPage('https://example.com/a',{fetcher:async()=>new Response('',{status:403}),reader:async()=>({title:'Acme',body})}),/source_mismatch/);
});
test('RSS/Atom and JSON adapters keep metadata as discovery and ignore modified dates',()=>{
 const source={kind:'rss',url:'https://example.com/feed'};
 assert.equal(parseSubscription(source,'<rss><channel><item><title>AI &amp; funding</title><link>https://example.com/a</link><pubDate>Thu, 01 Oct 2026 09:00:00 GMT</pubDate></item></channel></rss>')[0].published_at,'2026-10-01');
 const atom=parseSubscription(source,'<feed xmlns="http://www.w3.org/2005/Atom"><entry><title>Acme raises</title><link rel="alternate" href="/a"/><updated>2026-10-01</updated></entry></feed>');assert.equal(atom[0].url,'https://example.com/a');assert.equal(atom[0].published_at,'');
 assert.throws(()=>parseSubscription(source,'<html>captcha</html>'),/invalid/);
 const api={kind:'json_list',url:'https://example.com/api',config:{itemsPath:'data.items',titlePath:'title',urlPath:'link',datePath:'date'}};
 assert.equal(parseSubscription(api,JSON.stringify({data:{items:[{title:'AI funding',link:'/a',date:'2026-10-01'}]}})).length,1);
 assert.throws(()=>parseSubscription(api,'{"data":{}}'),/not_array/);
});
test('source failure preserves the successful position; 304 reuses durable candidates',async t=>{
 const stateFile=path.join(temp(t),'state.json'),source={id:'test',name:'Media',kind:'rss',url:'https://example.com/feed',enabled:true},registry={sources:[source]};
 const feed='<rss><channel><item><title>AI startup raises funding</title><link>https://example.com/a</link><pubDate>2026-10-01</pubDate></item></channel></rss>';
 const first=await collectSubscriptions({date:'2026-10-02',stateFile,registry,now:()=> 'first',fetcher:async()=>new Response(feed,{headers:{etag:'v1'}})});assert.equal(first.items.length,1);
 const failed=await collectSubscriptions({date:'2026-10-02',stateFile,registry,now:()=> 'second',fetcher:async()=>new Response('',{status:403}),search:async()=>[{title:'AI startup raises funding',url:'https://example.com/b'}]});
 assert.equal(failed.complete,false);assert.equal(read(stateFile).sources.test.last_ok_at,'first');assert.equal(failed.health[0].fallback_count,1);
 const restored=await collectSubscriptions({date:'2026-10-02',stateFile,registry,fetcher:async(_,o)=>{assert.equal(o.headers['if-none-match'],'v1');return new Response(null,{status:304});}});assert.equal(restored.items[0].url,'https://example.com/a');assert.equal(restored.complete,true);
});
test('web adapter maps repeated article anchors and rejects changed selectors',()=>{
 const source={kind:'web_list',url:'https://example.com',config:{itemSelector:'a.news',linkSelector:':self'}};
 assert.equal(parseSubscription(source,'<a class="news" href="/a">AI startup raises $5M</a>')[0].title,'AI startup raises $5M');
 assert.throws(()=>parseSubscription(source,'<main>new layout</main>'),/no_matches/);
});
test('short feeds carry recent leads and failed feed searches use the publisher domain',async t=>{
 const stateFile=path.join(temp(t),'state.json'),source={id:'test',name:'Media',kind:'rss',url:'https://feeds.example.com/feed',search_domain:'example.com',enabled:true},registry={sources:[source]};
 const feed=id=>`<rss><channel><item><title>AI startup raises funding</title><link>https://example.com/${id}</link><pubDate>2026-10-01</pubDate></item></channel></rss>`;
 await collectSubscriptions({date:'2026-10-02',stateFile,registry,fetcher:async()=>new Response(feed('a'))});
 const second=await collectSubscriptions({date:'2026-10-02',stateFile,registry,fetcher:async()=>new Response(feed('b'))});assert.equal(second.items.length,2);
 let query='';
 await collectSubscriptions({date:'2026-10-02',stateFile,registry,fetcher:async()=>new Response('',{status:403}),search:async q=>{query=q;return[];}});
 assert.ok(query.startsWith('site:example.com '));assert.equal(read(stateFile).sources.test.items.length,2);
 const expired=await collectSubscriptions({date:'2026-10-12',stateFile,registry,fetcher:async()=>new Response('<rss><channel></channel></rss>')});assert.equal(expired.items.length,0);
});
test('selected sync commits all snapshot pages then applies edits/removals with the first watermark',async t=>{
 const stateFile=path.join(temp(t),'selected.json');let calls=0;
 const result=await syncAIHotSelected({stateFile,date:'2026-10-02',fetcher:async url=>{
   calls++;const u=new URL(url);
   if(calls===1)return json({schemaVersion:1,fields:'default',cursor:'w1',count:1,hasMore:true,nextPage:'page2',items:[item('a')]});
   if(calls===2){assert.equal(u.searchParams.get('page'),'page2');return json({schemaVersion:1,fields:'default',cursor:'w1',count:1,hasMore:false,nextPage:null,items:[item('b')]});}
   assert.equal(u.searchParams.get('cursor'),'w1');return json({schemaVersion:1,fields:'default',cursor:'w2',count:2,hasMore:false,changes:[{op:'remove',id:'a',changedAt:'today'},{op:'upsert',item:item('b','Acme AI raises $30M'),changedAt:'today'}]});
 }});
 assert.equal(result.complete,true);assert.equal(result.items.length,1);assert.equal(result.review_changes.length,2);assert.equal(read(stateFile).cursor,'w2');assert.equal(read(stateFile).items.a,undefined);
});
test('selected partial bootstrap resumes, invalid change page cannot advance cursor',async t=>{
 const stateFile=path.join(temp(t),'selected.json');
 const first=await syncAIHotSelected({stateFile,date:'2026-10-02',maxPages:1,fetcher:async()=>json({schemaVersion:1,fields:'default',cursor:'w1',count:1,hasMore:true,nextPage:'next',items:[item()]})});
 assert.equal(first.complete,false);assert.equal(read(stateFile).cursor,null);assert.equal(read(stateFile).bootstrap.nextPage,'next');
 let calls=0;
 await syncAIHotSelected({stateFile,date:'2026-10-02',fetcher:async url=>{calls++;if(calls===1){assert.equal(new URL(url).searchParams.get('page'),'next');return json({schemaVersion:1,fields:'default',cursor:'w1',count:0,hasMore:false,nextPage:null,items:[]});}return json({schemaVersion:1,fields:'default',cursor:'w2',count:1,hasMore:false,changes:[{op:'bad',id:'a'}]});}});
 assert.equal(read(stateFile).cursor,'w1');assert.ok(read(stateFile).items.a);
});
test('selected 409 snapshot_required rebuilds from a stable snapshot and tracks old removals',async t=>{
 const stateFile=path.join(temp(t),'selected.json');write(stateFile,{version:'AIHOT-SELECTED-STATE-1',cursor:'old',items:{old:{url:'https://example.com/old'}},bootstrap:null,review_changes:[]});let calls=0;
 const result=await syncAIHotSelected({stateFile,date:'2026-10-02',fetcher:async()=>{calls++;if(calls===1)return new Response(JSON.stringify({error:{code:'snapshot_required'}}),{status:409});if(calls===2)return json({schemaVersion:1,fields:'default',cursor:'new',count:1,hasMore:false,nextPage:null,items:[item()]});return json({schemaVersion:1,fields:'default',cursor:'new',count:0,hasMore:false,changes:[]});}});
 assert.equal(result.complete,true);assert.equal(read(stateFile).cursor,'new');assert.equal(result.review_changes[0].id,'old');
});
test('same-publisher and copied articles do not satisfy independent financing confirmation',()=>{
 const a={source_url:'https://one.com/a',body_clean:body},b={source_url:'https://two.com/b',body_clean:body},c={source_url:'https://one.com/c',body_clean:'different'};
 assert.equal(independentResearchSources([a,b,c]).length,1);
 const bridge={source_url:'https://two.com/bridge',body_clean:body};
 assert.equal(independentResearchSources([a,{source_url:'https://two.com/other',body_clean:'unrelated'},bridge]).length,1);
 assert.equal(fundingResearchCoverage([a,b],{canonical_name:'Acme'}).funding,false);
 const d={source_url:'https://three.com/a',body_clean:'Acme received new funding from a named investor. A separately reported financing story.'};
 const coverage=fundingResearchCoverage([a,d],{canonical_name:'Acme'});assert.equal(coverage.funding,true);
 const plan=planFundingResearch({company:{canonical_name:'Acme'},coverage});assert.ok(plan.every(q=>q.intent!=='funding'&&q.intent!=='event_discovery'));assert.ok(plan.some(q=>q.intent==='investor_rationale'));
});
test('optional source failure is visible and cannot erase other successful discovery',async()=>{
 const result=await discover({date:'2026-10-02',search:async()=>[],feed:async()=>({complete:true,items:[],pages:1,discovered_count:0,failures:[]}),supplements:[{id:'subscriptions',run:async()=>({complete:false,items:[{url:'https://example.com/a',title:'AI startup raises funding'}],failures:['offline']})}]});
 assert.equal(result.complete,true);assert.equal(result.supplementalFailures.length,1);assert.equal(result.leads.length,1);
});
test('paid reader reuses receipts, refuses uncertain results and respects request budget',async t=>{
 const directory=temp(t),env={JINA_API_KEY:'fixture'},date='2026-10-02';let calls=0;
 const reader=createOriginalReader({directory,env,date,maxRequests:1,fetcher:async()=>{calls++;return new Response(`Title: Acme\nURL Source: https://example.com/a\nPublished Time: 2026-10-01\nMarkdown Content:\n${body}`);}});
 await reader('https://example.com/a');await reader('https://example.com/a');assert.equal(calls,1);await assert.rejects(reader('https://example.com/b'),/budget/);
 const uncertain=createOriginalReader({directory:temp(t),env,date,fetcher:async()=>{throw new Error('timeout');}});
 await assert.rejects(uncertain('https://example.com/a'));await assert.rejects(uncertain('https://example.com/a'),/receipt_unknown/);
 assert.equal(createOriginalReader({directory,env:{}}),null);
});
test('secondary reader allowances are per lead while original receipts prevent double billing across leads',async t=>{
 const directory=temp(t),env={JINA_API_KEY:'fixture'},date='2026-10-07';let calls=0;
 const options={directory,env,date,maxRequests:1,fetcher:async request=>{calls++;const url=request.slice('https://r.jina.ai/'.length);return new Response(`Title: Acme\nURL Source: ${url}\nPublished Time: 2026-10-07\nMarkdown Content:\n${body}`);}};
 const a=createOriginalReader({...options,budgetKey:'lead-a'}),b=createOriginalReader({...options,budgetKey:'lead-b'});
 await a('https://example.com/a');await b('https://example.com/a');await b('https://example.com/b');
 await assert.rejects(a('https://example.com/c'),/budget/);assert.equal(calls,2);
});
test('source registry covers both markets, media, releases and investors without duplicate IDs',()=>{
 assert.equal(new Set(sourceRegistry.sources.map(s=>s.id)).size,sourceRegistry.sources.length);
 for(const market of ['domestic','overseas'])assert.ok(sourceRegistry.sources.filter(s=>s.market===market).length>=10);
 for(const tier of ['media','press_release','investor'])assert.ok(sourceRegistry.sources.some(s=>s.tier===tier));
});
