#!/usr/bin/env node
import path from 'node:path';
import {collectSubscriptions,sourceRegistry} from './subscriptions.mjs';
import {syncAIHotSelected} from './aihot-selected.mjs';
import {write} from './state.mjs';
import {parseArgs} from './args.mjs';
const args=parseArgs();
if(args.get('live')!=='true') {
  console.log(JSON.stringify({sources:sourceRegistry.sources,live:false},null,2));
} else {
  if(!args.get('state-dir'))throw new Error('private_state_dir_required');
  const directory=path.resolve(args.get('state-dir'));
  const date=args.get('date')||new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Shanghai'}).format(new Date());
  const subscriptions=await collectSubscriptions({date,stateFile:path.join(directory,'subscriptions.json')});
  const selected=args.get('selected')==='true'?await syncAIHotSelected({date,stateFile:path.join(directory,'aihot-selected.json')}):null;
  const report={date,checked_at:new Date().toISOString(),source_count:sourceRegistry.sources.length,subscriptions:{complete:subscriptions.complete,lead_count:subscriptions.items.length,health:subscriptions.health},selected:selected?{...selected,items:undefined,review_changes:selected.review_changes.length}:null};
  write(path.join(directory,'inspection.json'),report);console.log(JSON.stringify(report,null,2));
}
