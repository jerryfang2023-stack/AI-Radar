function unpackIndex(payload) {
  if(payload?.schemaVersion!=='GUANLAN-COMPACT-INDEX-1'||!payload.index||!payload.collections)throw new Error('轻量索引格式无效');
  const index={...payload.index};
  for(const [name,table] of Object.entries(payload.collections)) {
    if(['__proto__','constructor','prototype'].includes(name)||!Array.isArray(table.columns)||!Array.isArray(table.rows)||new Set(table.columns).size!==table.columns.length||table.columns.some(key=>typeof key!=='string'||['__proto__','constructor','prototype'].includes(key)))throw new Error('轻量索引列无效');
    index[name]=table.rows.map((row,i)=>{
      if(!Array.isArray(row)||row.length!==table.columns.length)throw new Error('轻量索引行无效');
      const omitted=table.omitted?.[i]||[];
      if(!Array.isArray(omitted)||omitted.some(n=>!Number.isInteger(n)||n<0||n>=row.length))throw new Error('轻量索引缺省字段无效');
      const result={};
      table.columns.forEach((key,col)=>{
        if(omitted.includes(col))return;
        const dict=table.dictionaries?.[key],value=row[col];
        if(dict){if(!Array.isArray(dict)||!Number.isInteger(value)||value<0||value>=dict.length||typeof dict[value]!=='string')throw new Error('轻量索引字典无效');result[key]=dict[value];}
        else result[key]=value;
      });
      return result;
    });
  }
  return index;
}
module.exports={unpackIndex};
