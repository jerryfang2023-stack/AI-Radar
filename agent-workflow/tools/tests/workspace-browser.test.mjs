import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {chromium} from 'playwright';

test('engineering entry is device-local, rejects unsafe URLs and preserves OPS navigation', async () => {
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({viewport:{width:1440,height:960}});
    const errors=[]; page.on('pageerror', e=>errors.push(e.message));
    await page.route('**/*', route=> {
      if(route.request().url().split('#')[0] === 'https://ops-test.local/') {
        const html = fs.readFileSync('01-SiteV2/site/operations-console.html','utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g,'').replace(/<link\b[^>]*>/g,'');
        return route.fulfill({contentType:'text/html',body:html});
      }
      return route.fulfill({status:200,json:{}});
    });
    async function open() {
      await page.goto('https://ops-test.local/#settings');
      await page.addScriptTag({content:fs.readFileSync('01-SiteV2/site/data/ops-console.js','utf8')});
      await page.addScriptTag({content:fs.readFileSync('01-SiteV2/site/assets/operations-console.js','utf8')});
      await page.evaluate(()=>{document.querySelector('[data-ops-console]').hidden=false;document.dispatchEvent(new CustomEvent('operations:authenticated'))});
    }
    await open();
    const link=page.locator('[data-workbench-open]');
    assert.equal(await link.getAttribute('href'),'http://127.0.0.1:18765/');
    await page.locator('[data-workbench-form]').locator('..').locator('summary').click();
    await page.locator('[data-workbench-url]').fill('javascript:alert(1)');
    await page.locator('[data-workbench-form]').evaluate(f=>f.dispatchEvent(new Event('submit',{bubbles:true,cancelable:true})));
    assert.match(await page.locator('[data-workbench-status]').innerText(),/请输入/);
    assert.equal(await link.getAttribute('href'),'http://127.0.0.1:18765/');
    await page.locator('[data-workbench-url]').fill('http://localhost:18765/');
    await page.locator('[data-workbench-form] button').click();
    await open(); assert.equal(await link.getAttribute('href'),'http://localhost:18765/');
    for(const width of [1440,390]) {
      await page.setViewportSize({width,height:960});
      const style=await link.evaluate(e=>{const s=getComputedStyle(e);return {font:s.fontFamily,size:s.fontSize,line:s.lineHeight,weight:s.fontWeight}});
      assert.equal(style.size,'14px');assert.equal(style.line,'20px');assert.equal(style.weight,'500');assert.match(style.font,/Noto Sans SC/);
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(process.env.WORKSPACE_REVIEW_DIR) await page.screenshot({path:process.env.WORKSPACE_REVIEW_DIR+`/ops-engineering-${width}.png`,fullPage:true});
    }
    await page.locator('[data-tab="governance"]').first().click();
    assert.ok(await page.locator('[data-version-cards]').innerText().then(s=>s.includes('OPS-V3.8.0')));
    assert.deepEqual(errors,[]);
  } finally {await browser.close()}
});
