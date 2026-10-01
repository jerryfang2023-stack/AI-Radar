/* Shared pure capital-map model. Portal ships an identical copy; no protected data. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CapitalMap = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  const sum = values => values.reduce((n, v) => n + v, 0);
  const pct = (n, d) => d ? (100 * n / d).toFixed(1) : '0.0';
  function validDate(s) {
    return /^\d{4}-\d{2}-\d{2}$/.test(s || '') && Number.isFinite(Date.parse(s)) && new Date(s).toISOString().slice(0, 10) === s;
  }
  function monthAt(date, offset) {
    const d = new Date(date + 'T00:00:00Z');
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + offset, 1)).toISOString().slice(0, 7);
  }
  function hierarchy(taxonomy) {
    const parents = [];
    for (const child of taxonomy.sectors) {
      let p = parents.find(p => p.id === child.parentId);
      if (!p) { p = { id: child.parentId, name: child.parentName, children: [] }; parents.push(p); }
      p.children.push({ id: child.id, name: child.name, parentId: p.id, child: true });
    }
    return parents;
  }
  function build(index, taxonomy, options = {}) {
    const parents = hierarchy(taxonomy), entries = parents.flatMap(p => [p, ...p.children]);
    const date = index && index.meta && (index.meta.lastCheckedDate || index.meta.latestDate);
    const ready = Boolean(validDate(date) && index.meta.taxonomyVersion === taxonomy.version);
    const range = Number(options.range) === 3 ? 3 : 6;
    const market = options.market === 'china' ? 'china' : 'global';
    const keys = ready ? Array.from({ length: range }, (_, i) => monthAt(date, i - range + 1)) : [];
    const lastDay = ready ? new Date(Date.UTC(+date.slice(0,4), +date.slice(5,7), 0)).getUTCDate() : 0;
    const partial = ready && +date.slice(8) < lastDay;
    const current = ready ? monthAt(date, partial ? -1 : 0) : '';
    const previous = ready ? monthAt(date, partial ? -2 : -1) : '';
    const children = new Map(taxonomy.sectors.map(s => ['subcategory:' + s.id, s]));
    const seen = new Set(); let unclassified = 0;
    const cards = ready ? (index.cards || []).filter(c => {
      if (!c.id || seen.has(c.id) || c.marketRegion !== market || !validDate(c.date) || c.date > date) return false;
      seen.add(c.id);
      const child = children.get(c.categoryId);
      if (!child || child.parentId !== c.parentCategoryId) { if(keys.includes(c.date.slice(0,7))) unclassified++; return false; }
      return true;
    }) : [];
    const matches = (c, id) => c.parentCategoryId === id || c.categoryId === 'subcategory:' + id;
    const windowCards = cards.filter(c => keys.includes(c.date.slice(0,7)));
    const denominators = keys.map(m => windowCards.filter(c => c.date.startsWith(m)).length);
    const rows = entries.map(e => {
      const own = cards.filter(c => matches(c, e.id));
      const values = keys.map(m => own.filter(c => c.date.startsWith(m)).length);
      const now = own.filter(c => c.date.startsWith(current)).length;
      const before = own.filter(c => c.date.startsWith(previous)).length;
      const delta = now - before;
      return { id:e.id, name:e.name, parentId:e.parentId || '', child:!!e.child, values, count:sum(values), now,
        delta, deltaText:(delta >= 0 ? '+' : '') + delta, share:pct(sum(values), windowCards.length) };
    });
    const max = Math.max(1, ...rows.flatMap(r => r.values.map((v,i) => options.unit === 'share' ? Number(pct(v,denominators[i])) : v)));
    rows.forEach(r => {
      r.cells = r.values.map((v,i) => {
        const value = options.unit === 'share' ? Number(pct(v,denominators[i])) : v;
        return { key:keys[i], count:v, label:v ? (options.unit === 'share' ? pct(v,denominators[i]) + '%' : String(v)) : '—', level:v ? Math.max(1, Math.ceil(value/max*4)) : 0 };
      });
    });
    const parentRows = rows.filter(r => !r.child);
    const leader = [...parentRows].sort((a,b) => b.count-a.count)[0];
    const focus = rows.find(r => r.id === options.selected) || parentRows.find(r=>r.id==='enterprise') || rows[0];
    return { ready, date:ready ? date : '', range, market, partial, keys,
      months:keys.map((key,i) => ({key,label:Number(key.slice(5))+'月', partial:partial && i===keys.length-1})),
      comparison:ready ? current + ' 较 ' + previous : '', current, previous, parents, rows, focus,
      count:windowCards.length, unclassified, active:parentRows.filter(r=>r.count>0).length,
      leader:leader ? {name:leader.name,share:leader.share} : null,
      distribution:parentRows.map(r=>({id:r.id,name:r.name,count:r.count,width:pct(r.count,windowCards.length)})),
      ranking:rows.filter(r=>r.child && r.now>0).sort((a,b)=>b.now-a.now || a.id.localeCompare(b.id)).slice(0,3),
      cards:windowCards.slice().sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id)) };
  }
  function details(model,id,month) {
    const row=model.rows.find(r=>r.id===id); if(!row) return null;
    return {id,name:row.name,month:month || '',cards:model.cards.filter(c=>(c.parentCategoryId===id||c.categoryId==='subcategory:'+id)&&(!month||c.date.startsWith(month)))};
  }
  return { build, details, hierarchy, validDate };
});
