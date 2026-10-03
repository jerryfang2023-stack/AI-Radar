const {unpackIndex}=require("./compact-index.js");
let catalog = { profiles: [] };
let pending;
function request(url) {
  return new Promise((resolve, reject) => wx.request({url:`https://www.zkdlj.vip${url}`,timeout:15000,success:r=>r.statusCode===200?resolve(r.data):reject(new Error('档案暂不可用')),fail:reject}));
}
function getResearchProfiles() { return catalog.profiles; }
function refreshResearchProfiles() {
  if (pending) return pending;
  pending = (async()=>{
    const manifest = await request('/data/mini/profile-manifest.json');
    if (manifest.schemaVersion !== 'MINI-ENTITY-PROFILES-V1' || !Number.isInteger(manifest.profileCount) || !/^[a-f0-9]{64}$/.test(manifest.contentHash)) throw new Error('档案清单不完整');
    if (manifest.contentHash === catalog.contentHash && manifest.profileCount === catalog.profiles.length) return catalog.profiles;
    const validateIndex = next => {
      if (next.schemaVersion !== manifest.schemaVersion || next.contentHash !== manifest.contentHash || next.profileCount !== manifest.profileCount || !Array.isArray(next.profiles) || next.profiles.length !== manifest.profileCount) throw new Error('档案清单不一致');
      const ids = new Set();
      for (const p of next.profiles) {
        if (typeof p.id !== 'string' || !/^[A-Za-z0-9._-]+$/.test(p.id) || ids.has(p.id) || !['investors','people'].includes(p.type) || p.key !== `id:${p.id}` || typeof p.name !== 'string' || !p.name.trim() || !Array.isArray(p.markets) || !Array.isArray(p.categories) || p.markets.some(m=>!['china','global'].includes(m)) || p.categories.some(c=>typeof c!=='string') || ['investmentDirection','summary','initial','latestDate','searchText','legacyInvestorKey'].some(k=>p[k]!==undefined && typeof p[k]!=='string')) throw new Error('档案条目不完整');
        ids.add(p.id);
      }
      return next;
    };
    const next = manifest.compactIndexPath === '/data/mini/domains/profiles/compact-index.json'
      ? await request(manifest.compactIndexPath).then(unpackIndex).then(validateIndex).catch(()=>request('/data/mini/profile-index.json'))
      : await request('/data/mini/profile-index.json');
    validateIndex(next);
    catalog = {contentHash:next.contentHash,profiles:next.profiles.map(p=>({id:p.id,key:p.key,type:p.type,name:p.name,initial:p.initial||p.name.slice(0,1),summary:p.summary||'',investmentDirection:p.investmentDirection||'',markets:p.markets,categories:p.categories,latestDate:p.latestDate||'',searchText:p.searchText||p.name.toLowerCase(),legacyInvestorKey:p.legacyInvestorKey||''}))};
    return catalog.profiles;
  })().finally(()=>{pending=null;});
  return pending;
}
module.exports={getResearchProfiles,refreshResearchProfiles};
