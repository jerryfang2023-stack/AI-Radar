#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {isMainModule} from '../tools/lib/module-entry.mjs';
import {verifyCurrentReadModel,resolveReadModelOutput} from './read-model.mjs';
import {verifyVaultDomains} from '../tools/build-guanlan-vault-domains.mjs';
import {resolveGuanlanVaultRoot} from '../tools/guanlan-vault-paths.mjs';
import {parseArgs} from './args.mjs';

const hash=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const observed=fn=>{try{return {ok:true,...fn()};}catch(error){return {ok:false,error:error.message};}};
export function foundationQuality({source,readModel,portal,client,performance}) {
  const gaps=[];
  const readModelCompatible=readModel.ok===true && readModel.inputHash===source.inputHash;
  if(!readModelCompatible)gaps.push('融资读库未验证或输入哈希不匹配');
  const portalSchemaAndCountsCompatible=portal.ok===true && portal.funding?.taxonomyVersion===source.taxonomyVersion
    && portal.funding?.cardCount===source.subjectCount && portal.funding?.latestDate===source.latestDate;
  if(!portalSchemaAndCountsCompatible)gaps.push('线上融资清单不可读或结构、数量、日期与接受输入不一致');
  if(!client.ok)gaps.push('客户端上传证据缺失');
  if(performance?.realDevice?.status!=='verified')gaps.push('真机性能待验');
  // Manifest parity is a summary check. It does not replace the complete
  // publication verifier, receipt pairing or immutable artifact gates.
  return {readModelCompatible,portalSchemaAndCountsCompatible,fullPublicationGate:'see publication checkpoint and live verifier',gaps};
}
export async function collectFoundationDashboard({root,readModelOutput,vaultRoot,liveUrl='https://www.zkdlj.vip',clientSourceReceipt,clientUploadReceipt,clientUploadLog,performanceFile,vaultReceipt,fetcher=fetch}) {
  const git=(...args)=>{const result=spawnSync('git',args,{cwd:root,encoding:'utf8',windowsHide:true,maxBuffer:64*1024*1024});if(result.status!==0)throw Error(result.stderr.trim());return result.stdout.trim();};
  const acceptedCommit=git('rev-parse','origin/main');
  // Read exactly the bytes of the accepted Git object, preserving the read-model hash.
  const raw=spawnSync('git',['show',`${acceptedCommit}:01-SiteV2/site/data/financing-catalog-v1.json`],{cwd:root,windowsHide:true,maxBuffer:64*1024*1024});
  if(raw.status!==0)throw Error('accepted_financing_catalog_missing');
  const catalog=JSON.parse(raw.stdout),source={acceptedCommit,inputHash:hash(raw.stdout),taxonomyVersion:catalog.meta.taxonomy_version,latestDate:catalog.meta.latest_date,subjectCount:catalog.cards.length,eventCount:catalog.event_cards.length};
  const readModel=observed(()=>{const m=verifyCurrentReadModel({output:readModelOutput,requireDatabase:true});return {releaseId:m.releaseId,inputHash:m.inputHash,sourceCommit:m.sourceCommit,latestDate:m.latestDate,subjectCount:m.subjectCount,eventCount:m.eventCount,views:m.views};});
  const vault=observed(()=>{const m=verifyVaultDomains(vaultRoot),inventory=read(path.join(vaultRoot,'.guanlan-generated.json'));return {layoutVersion:m.layoutVersion,lastSuccess:inventory.generatedAt,domains:Object.fromEntries(Object.entries(m.domains).map(([name,d])=>[name,{contentHash:d.contentHash,fileCount:d.fileCount}])),syncReceipt:vaultReceipt?read(vaultReceipt):null};});
  let portal;
  try {
    const names=['publication.json','version.json','data/mini/funding-manifest.json','data/mini/domain-manifest.json','data/mini/profile-manifest.json'];
    const data=await Promise.all(names.map(async name=>{const response=await fetcher(`${liveUrl.replace(/\/$/u,'')}/${name}?dashboard=${Date.now()}`,{cache:'no-store',signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`${name}:HTTP_${response.status}`);return response.json();}));
    portal={ok:true,publication:data[0],version:data[1],funding:data[2],domains:data[3],profiles:data[4],checkedAt:new Date().toISOString()};
  } catch(error){portal={ok:false,error:error.message};}
  const client=observed(()=>{
    if(!clientSourceReceipt || !clientUploadReceipt || !clientUploadLog)throw Error('client_upload_evidence_not_supplied');
    const sourceReceipt=read(clientSourceReceipt),upload=read(clientUploadReceipt),log=fs.readFileSync(clientUploadLog,'utf8');
    if(!/^[a-f0-9]{40}$/u.test(sourceReceipt.sourceCommit || '') || !sourceReceipt.version || !upload.size?.total || !log.includes('√ upload'))throw Error('client_upload_evidence_invalid');
    const decoder=git('show',`${sourceReceipt.sourceCommit}:02-Miniprogram/miniprogram/utils/compact-index.js`);
    if(!decoder)throw Error('client_compact_decoder_missing');
    const record=git('show',`${acceptedCommit}:02-Miniprogram/docs/releases/${sourceReceipt.version}/README.md`);
    if(!record.includes(sourceReceipt.sourceCommit) || !record.includes(String(upload.size.total)))throw Error('client_receipts_do_not_match_accepted_upload_record');
    return {version:sourceReceipt.version,sourceCommit:sourceReceipt.sourceCommit,bytes:upload.size.total,uploaded:true,compactDecoderIncluded:true,sourceCheckedAt:sourceReceipt.checkedAt,receiptHashes:{source:hash(fs.readFileSync(clientSourceReceipt)),upload:hash(fs.readFileSync(clientUploadReceipt)),log:hash(log),acceptedRecord:hash(record)}};
  });
  const measured=performanceFile?observed(()=>read(performanceFile)):{ok:false,error:'performance_evidence_not_supplied'};
  const performance={desktop:measured,realDevice:{status:'pending',reason:measured.realDevice || 'No device measurement supplied'}};
  const quality=foundationQuality({source,readModel,portal,client,performance});
  if(!vault.ok)quality.gaps.push('Vault 域清单校验失败');
  const dateAge=(date)=>/^\d{4}-\d{2}-\d{2}$/u.test(date || '')?Math.floor((Date.now()-Date.parse(`${date}T00:00:00+08:00`))/86400000):null;
  return {version:'GUANLAN-FOUNDATION-DASHBOARD-1',generatedAt:new Date().toISOString(),source,readModel,vault,portal,client,performance,quality,freshness:{sourceAgeDays:dateAge(source.latestDate),readModelAgeDays:dateAge(readModel.latestDate),portalAgeDays:dateAge(portal.funding?.latestDate)}};
}
const escape=value=>String(value??'未知').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function dashboardHtml(data) {
  const rows=[['接受的事实源',data.source.latestDate,data.source.acceptedCommit,`${data.source.subjectCount} 主体 / ${data.source.eventCount} 事件`],['融资读库',data.readModel.latestDate,data.readModel.releaseId,data.quality.readModelCompatible?'输入哈希一致':data.readModel.error || '输入不同'],['线上发布',data.portal.funding?.latestDate,data.portal.publication?.portalCommit,data.quality.portalSchemaAndCountsCompatible?'结构、数量、日期一致；完整核验见发布回执':data.portal.error || '摘要不一致'],['Obsidian',data.vault.lastSuccess,data.vault.layoutVersion,data.vault.ok?'分域文件哈希已校验':data.vault.error],['小程序开发版',data.client.sourceCheckedAt,data.client.version,data.client.ok?`已上传 / 源码 ${data.client.sourceCommit}`:data.client.error]];
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>数据基座版本与质量</title><style>body{font:16px system-ui;margin:32px;background:#f8fafc;color:#172033}table{width:100%;border-collapse:collapse;background:white}td,th{padding:12px;border-bottom:1px solid #ddd;text-align:left;overflow-wrap:anywhere}pre{white-space:pre-wrap}details{margin-top:20px}h1{font-size:26px}</style><h1>数据基座版本与质量</h1><p>只读汇总 · ${escape(data.generatedAt)} · 本地私有报告</p><table><tr><th>模块</th><th>最近成功 / 数据日期</th><th>版本</th><th>核验</th></tr>${rows.map(row=>`<tr>${row.map(v=>`<td>${escape(v)}</td>`).join('')}</tr>`).join('')}</table><h2>待验与证据缺口</h2><ul>${data.quality.gaps.map(g=>`<li>${escape(g)}</li>`).join('')}</ul><p>真机性能待验。电脑端响应字节、解码耗时和进程内存不能证明手机启动收益。</p><details><summary>分域版本及测量详情</summary><pre>${escape(JSON.stringify({domains:data.vault.domains,freshness:data.freshness,performance:data.performance},null,2))}</pre></details></html>`;
}
if(isMainModule(import.meta.url)) {
  const args=parseArgs(),root=process.cwd(),output=args.get('output');
  if(!output)throw Error('Specify --output outside the public repository');
  const target=path.resolve(output);if(target===root || target.startsWith(root+path.sep))throw Error('dashboard_output_must_be_private');
  const data=await collectFoundationDashboard({root,readModelOutput:resolveReadModelOutput(root,args.get('read-model-dir')),vaultRoot:resolveGuanlanVaultRoot(root,{vaultRoot:args.get('vault-root')}),liveUrl:args.get('live-url'),clientSourceReceipt:args.get('client-source-receipt'),clientUploadReceipt:args.get('client-upload-receipt'),clientUploadLog:args.get('client-upload-log'),performanceFile:args.get('performance-file'),vaultReceipt:args.get('vault-receipt')});
  fs.mkdirSync(target,{recursive:true});fs.writeFileSync(path.join(target,'foundation-dashboard.json'),JSON.stringify(data,null,2)+'\n');fs.writeFileSync(path.join(target,'foundation-dashboard.html'),dashboardHtml(data));
  console.log(JSON.stringify({ok:true,output:target,quality:data.quality}));
}
