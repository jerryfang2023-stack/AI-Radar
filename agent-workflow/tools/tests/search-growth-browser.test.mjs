import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {chromium} from 'playwright';

const read=p=>fs.readFileSync(p,'utf8');
const providers={google_search:'Google 搜索',bing_search:'Bing 搜索',baidu_search:'百度搜索',google_ai:'Google AI 搜索曝光',bing_ai:'Bing AI 引用',google_indexing:'Google 收录',bing_indexing:'Bing 收录',baidu_indexing:'百度收录'};
const fixture=()=>({schemaVersion:'SEARCH-AI-GROWTH-V1',dataSource:'production',generatedAt:'2026-10-02T12:00:00Z',
  traffic:{status:'available',totals:{searchSessions:2,aiSessions:3,pageViews:10,unattributedSessions:4},channels:[{source:'chatgpt',sessions:3,pageViews:6,contentViews:2,researchCtaSessions:1,applicationCtaSessions:0}],trend:[{date:'2026-10-01',sessions:3},{date:'2026-10-02',sessions:6}]},
  reports:Object.entries(providers).map(([provider,label])=>({provider,label,status:'not_connected',metrics:{impressions:null,clicks:null,ctr:null,position:null,citations:null,indexed:null,excluded:null},dimensions:{}})),
  evaluation:{baselineDate:'2026-10-02',questions:65,engines:[{engine:'ChatGPT Search',status:'not_measured',observations:null,citationRate:null,accuracyReviewed:null,correct:null,incorrect:null,citedPages:[]}]},
  health:{status:'verified',portalCommit:'accepted-portal',releaseId:'FUNDING-PORTAL-V2.13.2',verifiedAt:'2026-10-02T10:29:00Z',pagesChecked:3574,pagesPassed:3574,crawlerProbes:44,crawlerProbesPassed:44,indexNowStatus:'accepted',indexNowSubmitted:3574,indexNowAt:'2026-10-02T10:27:00Z'}});

async function open(browser,options={}) {
  const page=await browser.newPage({viewport:{width:1440,height:960}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.route('**/*',async route=>{
    const url=new URL(route.request().url());
    if(url.pathname==='/'){
      const html=read('01-SiteV2/site/operations-console.html').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'').replace('</head>',`<style>${read('01-SiteV2/site/assets/search-growth.css')}</style></head>`);
      return route.fulfill({contentType:'text/html',body:html});
    }
    if(url.pathname==='/publication.json')return route.fulfill({json:{portalCommit:'accepted-portal'}});
    if(url.pathname==='/ops/growth-api/summary')return route.fulfill(options.fail?{status:503,json:{}}:{json:fixture()});
    if(url.pathname==='/ops/growth-api/import') {options.onImport?.(route.request().postDataJSON(),route.request().headers());return route.fulfill({status:201,json:{rows:1,replayed:false}});}
    return route.fulfill({json:{}});
  });
  await page.goto('https://growth-test.local/#growth');
  await page.addScriptTag({content:read('01-SiteV2/site/assets/search-growth.js')});
  await page.addScriptTag({content:read('01-SiteV2/site/assets/operations-console.js')});
  await page.evaluate(()=>{document.querySelector('[data-ops-console]').hidden=false;document.dispatchEvent(new CustomEvent('operations:authenticated',{detail:{csrfToken:'synthetic-csrf'}}));});
  return {page,errors};
}

test('growth sidebar, real states, typography and responsive overflow',async()=>{
  const browser=await chromium.launch();try {
    const {page,errors}=await open(browser);await page.locator('[data-growth-content]').waitFor();
    assert.match(await page.locator('[data-growth-search]').innerText(),/未接入/);
    assert.match(await page.locator('[data-growth-evaluations]').innerText(),/未评测/);
    assert.match(await page.locator('[data-growth-health]').innerText(),/通知已接收/);
    assert.equal(await page.locator('[data-tab=growth]').getAttribute('aria-current'),'true');
    for(const width of [1440,768,390]) {
      await page.setViewportSize({width,height:960});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
      const font=await page.locator('.growth-head h1').evaluate(e=>{const s=getComputedStyle(e);return [s.fontSize,s.lineHeight,s.fontWeight];});
      assert.deepEqual(font,['30px','42px','600']);
      if(process.env.GROWTH_SCREENSHOTS){fs.mkdirSync(process.env.GROWTH_SCREENSHOTS,{recursive:true});await page.screenshot({path:path.join(process.env.GROWTH_SCREENSHOTS,`growth-${width}.png`),fullPage:true});}
    }
    await page.locator('[data-tab=analytics]').first().click();await page.locator('[data-tab=growth]').first().click();
    assert.equal(await page.locator('[data-growth-content]').isVisible(),true);
    assert.deepEqual(errors,[]);
  }finally{await browser.close();}
});

test('CSV import preserves quoted query and sends CSRF; missing metrics rejected',async()=>{
  const browser=await chromium.launch();try {
    let imported,headers;const {page}=await open(browser,{onImport:(body,h)=>{imported=body;headers=h;}});
    await page.locator('[data-growth-content]').waitFor();await page.locator('.growth-import summary').click();
    await page.locator('[data-growth-dimension]').selectOption('query');
    await page.locator('[data-growth-start]').fill('2026-10-01');await page.locator('[data-growth-end]').fill('2026-10-02');
    await page.locator('[data-growth-file]').setInputFiles({name:'gsc.csv',mimeType:'text/csv',buffer:Buffer.from('Query,Clicks,Impressions,Position\r\n"融资,\"\"数据\"\"",1,10,-\r\n')});
    await page.locator('[data-growth-submit]').click();await page.getByText('导入成功 · 1 条',{exact:true}).waitFor();
    assert.equal(imported.rows[0].query,'融资,"数据"');assert.equal(imported.rows[0].position,null);assert.equal(headers['x-csrf-token'],'synthetic-csrf');
    await page.locator('[data-growth-file]').setInputFiles({name:'invalid.csv',mimeType:'text/csv',buffer:Buffer.from('Query\nhello\n')});
    await page.locator('[data-growth-submit]').click();await page.getByText('报表缺少指标',{exact:true}).waitFor();
  }finally{await browser.close();}
});

test('network failure retries and logout clears protected content and form',async()=>{
  const browser=await chromium.launch();try {
    const options={fail:true};const {page}=await open(browser,options);
    await page.getByText('数据读取失败，请刷新重试。',{exact:true}).waitFor();
    assert.equal(await page.locator('[data-growth-content]').isVisible(),false);
    options.fail=false;await page.locator('[data-growth-refresh]').click();await page.locator('[data-growth-content]').waitFor();
    await page.evaluate(()=>document.dispatchEvent(new Event('operations:logout')));
    assert.equal(await page.locator('[data-growth-content]').isVisible(),false);
    assert.equal(await page.locator('[data-growth-channels]').innerHTML(),'');
    assert.equal(await page.locator('[data-growth-health]').innerHTML(),'');
    assert.equal(await page.locator('[data-growth-status]').innerText(),'登录后可查看');
  }finally{await browser.close();}
});

test('late JSON from a previous session cannot render after logout and reauthentication',async()=>{
  const browser=await chromium.launch();try {
    const {page}=await open(browser);await page.locator('[data-growth-content]').waitFor();
    await page.evaluate(()=>{
      const original=window.fetch;window.fetch=async(...args)=>{
        if(String(args[0]).includes('/growth-api/summary'))return {ok:true,status:200,json:()=>new Promise(resolve=>{window.oldGrowthResolve=resolve;})};return original(...args);
      };
      document.querySelector('[data-growth-refresh]').click();
    });
    await page.waitForFunction(()=>!!window.oldGrowthResolve);
    await page.evaluate(()=>{
      document.dispatchEvent(new Event('operations:logout'));
      window.oldGrowthResolve({schemaVersion:'SEARCH-AI-GROWTH-V1',dataSource:'production',traffic:{totals:{pageViews:999999}}});
    });
    await page.waitForTimeout(100);
    assert.equal(await page.locator('[data-growth-content]').isVisible(),false);
    assert.equal(await page.locator('[data-growth-kpis]').innerHTML(),'');
  }finally{await browser.close();}
});
