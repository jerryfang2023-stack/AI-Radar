import { load } from 'cheerio';

const tidy = value => String(value || '').replace(/[\t \u00a0]+/gu, ' ').replace(/\n\s*\n/gu, '\n').trim();
export function originalDate(value) {
  if (typeof value === 'number' || /^\d{10}(?:\d{3})?$/u.test(String(value))) {
    const n = Number(value),date = new Date(n < 1e12 ? n * 1000 : n); if(!Number.isFinite(+date))return ''; value = date.toISOString();
  }
  let text = String(value || '').trim().replace(/年|\//gu, '-').replace(/月/gu, '-').replace(/日/gu, '');
  const parts = text.match(/\b(20\d{2})-(\d{1,2})-(\d{1,2})(?=T\d{2}:|\b)/u);
  if (parts) {
    const date = `${parts[1]}-${parts[2].padStart(2,'0')}-${parts[3].padStart(2,'0')}`;
    return Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0,10) === date ? date : '';
  }
  // Only absolute, year-bearing dates. Relative dates and update-only metadata
  // cannot silently supply an article publication date.
  if (!/\b20\d{2}\b/u.test(text) || !/[a-z]{3}/iu.test(text)) return '';
  const months=['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const monthFirst=text.match(/\b([A-Za-z]+)\s+(\d{1,2}),?\s+(20\d{2})\b/u),dayFirst=text.match(/\b(\d{1,2})\s+([A-Za-z]+)\s+(20\d{2})\b/u);
  const match=monthFirst||dayFirst;
  if(!match)return '';
  const month=months.indexOf((monthFirst?match[1]:match[2]).slice(0,3).toLowerCase())+1;
  return month?originalDate(`${match[3]}-${month}-${monthFirst?match[2]:match[1]}`):'';
}

export const pageRules = [
  { hosts: ['pedaily.cn'], body: '#news-content, .news-content, .article-content', date: '.news-info .date, .news-info .time, .info .date' },
  { hosts: ['36kr.com'], body: '.article-content, .common-width.content', date: '.article-info .time, .article-header .time' },
  { hosts: ['prnewswire.com'], body: '.release-body', date: '.release-date' },
  { hosts: ['techcrunch.com'], body: '.entry-content', date: '.wp-block-post-date time' },
  { hosts: ['ithome.com'], body: '#paragraph', date: '#pubtime_baidu, .post_time' },
];
export function isListingUrl(url) {
  let pathname = ''; try { pathname = new URL(url).pathname; } catch { return false; }
  return pathname === '/' || /^\/(?:news|media|author|tag|category|feed|all|financing-flash|portfolio)\/?$/iu.test(pathname) || /\/t\d+-p\d+\/?$/u.test(pathname);
}
export function parseOriginal(html, { url = '', rules = pageRules } = {}) {
  const $ = load(html), nodes = [];
  const visit = (v, depth = 0) => { if (depth > 20 || !v || typeof v !== 'object') return; if (!Array.isArray(v)) nodes.push(v); Object.values(v).forEach(x=>visit(x,depth+1)); };
  $('script[type="application/ld+json"]').each((_,el)=>{ try { visit(JSON.parse($(el).text())); } catch {} });
  const articles = nodes.filter(n=>/^(?:NewsArticle|Article|BlogPosting|SocialMediaPosting)$/u.test(String(n['@type'])) || (Array.isArray(n['@type']) && n['@type'].some(t=>/Article|Posting/u.test(t))));
  const sameArticle = node => {
    const link=node.url||node.mainEntityOfPage?.['@id']||node.mainEntityOfPage;
    try {return typeof link==='string'&&new URL(link,url).pathname===new URL(url).pathname;} catch {return false;}
  };
  const article = articles.find(sameArticle) || (articles.length===1?articles[0]:null);
  const meta = {};
  $('meta').each((_,el)=>{ const key=$(el).attr('property')||$(el).attr('name'); if(key) meta[key.toLowerCase()]=$(el).attr('content'); });
  const title = tidy(article?.headline || meta['og:title'] || $('h1').first().text() || $('title').text());
  const articleLike=!isListingUrl(url)&&Boolean(article||meta['og:type']==='article'||$('article').length===1||$('h1').length===1);
  let host = ''; try { host = new URL(url).hostname; } catch {}
  const rule = rules.find(r=>r.hosts.some(h=>host===h || host.endsWith('.'+h)));
  const candidates = [];
  const add = (value, method) => { const date=originalDate(value); if(date) candidates.push({date,method,value:String(value)}); };
  add(article?.datePublished, 'jsonld:datePublished');
  for(const key of ['article:published_time','datepublished','pubdate','publishdate','pubtime','sailthru.date','dc.date.issued','citation_publication_date','og:release_date']) add(meta[key],`meta:${key}`);
  if(rule?.date) $(rule.date).each((_,el)=>add($(el).attr('datetime') || $(el).text(),'site:publication_date'));
  // Restrict visible dates to publication labels/header time elements. Dates
  // inside related links, comments or the article narrative are not evidence.
  $('[itemprop="datePublished"], time[pubdate], header time, article > time, .entry-date, .published, .publish-time, .publication-date').each((_,el)=>{
    if(!$(el).parents('aside,nav,footer,.comments,.related').length && !/updated|modified/iu.test($(el).attr('class')||'')) add($(el).attr('datetime')||$(el).attr('content')||$(el).text(),'visible:publication_date');
  });
  if(!candidates.length) {
    // WeChat renders its publication time from the current article's `ct`
    // variable. It is a Unix timestamp displayed in China Standard Time.
    if(host==='mp.weixin.qq.com' && $('#js_content').length) {
      const timestamps=[...new Set([...html.matchAll(/\bvar\s+ct\s*=\s*["'](\d{10})["']\s*;/gu)].map(m=>m[1]))];
      if(timestamps.length===1) add(new Date((Number(timestamps[0])+8*3600)*1000).toISOString().slice(0,10),'wechat:article_ct_cst');
    }
  }
  if(!candidates.length) {
    const times=$('time[datetime]').filter((_,el)=>!$(el).parents('aside,nav,footer,.comments,.related').length && !/updated|modified/iu.test($(el).attr('class')||''));
    const dates=[...new Set(times.map((_,el)=>originalDate($(el).attr('datetime'))).get().filter(Boolean))];
    if(dates.length===1) add(times.first().attr('datetime'),'time:unique');
  }
  const links = [...new Set($('a[href]').map((_,el)=>{ try { const u=new URL($(el).attr('href'),url); return /^https?:$/u.test(u.protocol)?u.href:null; } catch { return null; } }).get())].slice(0,100);
  $('script,style,nav,footer,header,form,aside,svg,noscript,.comments,.related,.share,.social-share').remove();
  $('br').replaceWith('\n'); $('p,div,li,h1,h2,h3,section').append('\n');
  const bodyCandidates = [rule?.body, 'article', 'main', '[itemprop="articleBody"]', '.entry-content', '.article-content', '#article-content', '#content'].filter(Boolean)
    .flatMap(selector=>$(selector).map((_,el)=>tidy($(el).text())).get()).filter(t=>t.length>=300);
  const body = article?.articleBody ? tidy(load(article.articleBody).text()) : bodyCandidates.sort((a,b)=>b.length-a.length)[0] || tidy($('body').text());
  const dateEvidence = candidates[0] || null;
  return {title,body,date:dateEvidence?.date||'',date_evidence:dateEvidence,links,article_like:articleLike};
}

export function publicHttpUrl(value) {
  const u = new URL(value);
  if(!/^https?:$/u.test(u.protocol) || u.username || u.password || /^(?:localhost|127\.|0\.|10\.|169\.254\.|192\.168\.|172\.(?:1[6-9]|2\d|3[01])\.|\[)/iu.test(u.hostname) || u.hostname.endsWith('.local')) throw new Error('original_url_not_public');
  return u.href;
}
export async function fetchText(url, {fetcher=fetch,timeoutMs=20000,headers={},maxBytes=8*1024*1024}={}) {
  let current=publicHttpUrl(url);
  const requestHeaders = { 'user-agent': 'Mozilla/5.0 (compatible; WaveSightFinancing/1.1)', ...headers };
  for(let hop=0;hop<6;hop++) {
    const response=await fetcher(current,{signal:AbortSignal.timeout(timeoutMs),redirect:'manual',headers:{...requestHeaders}});
    if([301,302,303,307,308].includes(response.status)) {
      const location=response.headers.get('location'); if(!location) throw new Error('original_redirect_missing');
      const next=publicHttpUrl(new URL(location,current).href);
      if (new URL(next).origin !== new URL(current).origin) {
        for (const key of Object.keys(requestHeaders)) if (/^(?:authorization|proxy-authorization|cookie)$/iu.test(key)) delete requestHeaders[key];
      }
      current=next; continue;
    }
    if(response.status===304) return {response,text:'',url:current};
    if(!response.ok) throw new Error(`original_http_${response.status}`);
    if(Number(response.headers.get('content-length'))>maxBytes) throw new Error('original_too_large');
    const chunks=[];let length=0;
    for await(const chunk of response.body) { length+=chunk.length;if(length>maxBytes)throw new Error('original_too_large');chunks.push(chunk); }
    const bytes=Buffer.concat(chunks);
    const charset=(response.headers.get('content-type')?.match(/charset\s*=\s*["']?([^;,\s"']+)/iu)?.[1] || bytes.toString('ascii',0,1500).match(/charset=["']?([\w-]+)/iu)?.[1] || 'utf-8').toLowerCase();
    return {response,text:new TextDecoder(charset).decode(bytes),url:current};
  }
  throw new Error('original_redirect_limit');
}
export async function readOriginalPage(url, {fetcher=fetch,reader=null,...options}={}) {
  const attempts=[];
  try {
    const page=await fetchText(url,{fetcher,...options});const parsed=parseOriginal(page.text,{url:page.url});
    if(parsed.body.length>=300 && !/\ufffd/u.test(parsed.body) && !/just a moment|access denied|verify you are human|captcha/iu.test(parsed.title)) {
      attempts.push({method:'original_http',status:'success'});
      if(parsed.date || !reader) return {...parsed,url:page.url,method:'original_http',attempts};
    } else attempts.push({method:'original_http',status:'failed',reason:'original_unreadable'});
    if(!reader) throw new Error('original_unreadable');
  } catch(error) { if(!attempts.length)attempts.push({method:'original_http',status:'failed',reason:error.message}); if(!reader)throw error; }
  // Optional reader must retrieve the actual URL, never a search snippet.
  const recovered=await reader(publicHttpUrl(url));
  if(recovered?.body?.length<300 || !recovered?.body || /\ufffd/u.test(recovered.body) || /just a moment|access denied|verify you are human|captcha/iu.test(recovered.title||'')) throw new Error('reader_unreadable');
  if(!recovered.url || publicHttpUrl(recovered.url)!==publicHttpUrl(url))throw new Error('reader_source_mismatch');
  return {...recovered,url,article_like:!isListingUrl(url),method:'original_reader',date:originalDate(recovered.published_at),date_evidence:originalDate(recovered.published_at)?{date:originalDate(recovered.published_at),method:'reader:original_publication',value:String(recovered.published_at)}:null,attempts:[...attempts,{method:'original_reader',status:'success'}]};
}
