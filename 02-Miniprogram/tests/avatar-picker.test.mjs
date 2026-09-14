import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function harness(supported = true) {
 let component, token='account-a'; const pending=[], events=[];
 const wx={canIUse:()=>supported,getStorageSync:()=>token,getFileSystemManager:()=>({saveFile:options=>pending.push(options)})};
 const utility={exports:{}};
 vm.runInNewContext(fs.readFileSync('miniprogram/utils/avatar.js','utf8'),{module:utility,wx});
 vm.runInNewContext(fs.readFileSync('miniprogram/components/avatar-picker/index.js','utf8'),{Component:value=>component=value,require:()=>utility.exports,wx});
 Object.assign(component,component.methods);
 component.setData=(patch,done)=>{Object.assign(component.data,patch);done?.()};
 component.triggerEvent=(name,detail)=>events.push({name,detail});
 component.observers.visible.call(component,true);
 return {component,pending,events,changeIdentity:()=>token='account-b'};
}
test('both avatar labels are inside full-row buttons wired to the shared picker',()=>{
 for(const target of ['pages/profile-edit','components/registration-sheet']) {
  const source=fs.readFileSync(`miniprogram/${target}/index.wxml`,'utf8');
  const row=source.match(/<button[^>]*class="[^"]*avatar-field[^"]*"[\s\S]*?<\/button>/)?.[0];
  assert.ok(row,target); assert.match(row,/bindtap="openAvatarPicker"/);assert.match(row,/头像/);
  assert.equal((row.match(/<button/g)||[]).length,1);
  assert.match(source,/<avatar-picker[^>]*bindselected="selectAvatar"/);
  const config=JSON.parse(fs.readFileSync(`miniprogram/${target}/index.json`,'utf8'));
  assert.equal(config.usingComponents['avatar-picker'],'/components/avatar-picker/index');
 }
});
test('native selection is applied only after durable save confirms success',async()=>{
 const h=harness();const task=h.component.chooseAvatar({detail:{avatarUrl:'temp'}});
 assert.equal(h.component.data.saving,true);assert.equal(h.events.length,0);
 h.pending[0].success({savedFilePath:'wxfile://saved'});await task;
 assert.equal(h.events[0].detail.avatarUrl,'wxfile://saved');assert.equal(h.component.data.saving,false);
});
test('empty selection and save failure preserve the old avatar; retry succeeds',async()=>{
 const h=harness();await h.component.chooseAvatar({detail:{}});
 assert.equal(h.events.length,0);assert.match(h.component.data.message,/未选择头像/);
 const failed=h.component.chooseAvatar({detail:{avatarUrl:'temp'}});h.pending[0].fail({errMsg:'quota exhausted'});await failed;
 assert.equal(h.events.length,0);assert.match(h.component.data.message,/保存失败/);assert.equal(h.component.data.saving,false);
 const retried=h.component.chooseAvatar({detail:{avatarUrl:'retry'}});h.pending[1].success({savedFilePath:'saved'});await retried;
 assert.equal(h.events[0].detail.avatarUrl,'saved');
});
test('unsupported native chooser still offers usable bundled avatars without permissions',()=>{
 const h=harness(false);h.component.nativeTap();assert.match(h.component.data.message,/不支持/);
 for(const avatar of h.component.data.avatars)assert.ok(fs.existsSync(`miniprogram${avatar.url}`));
 h.component.selectSystemAvatar({currentTarget:{dataset:{id:'navy'}}});
 assert.equal(h.events[0].detail.avatarUrl,'/assets/avatars/navy.svg');assert.equal(h.pending.length,0);
 h.component.selectSystemAvatar({currentTarget:{dataset:{id:'arbitrary/path'}}});assert.equal(h.events.length,1);
});
test('cancel closes the picker without selecting or persisting a file',()=>{
 const h=harness();h.component.close();assert.equal(h.events[0].name,'close');assert.equal(h.events.length,1);assert.equal(h.pending.length,0);
});
test('duplicate callbacks and account changes during saving cannot replace the current avatar',async()=>{
 const h=harness();const task=h.component.chooseAvatar({detail:{avatarUrl:'temp'}});
 await h.component.chooseAvatar({detail:{avatarUrl:'duplicate'}});
 h.component.selectSystemAvatar({currentTarget:{dataset:{id:'gold'}}});assert.equal(h.pending.length,1);
 h.changeIdentity();h.pending[0].success({savedFilePath:'saved'});await task;
 assert.equal(h.events.length,0);assert.match(h.component.data.message,/登录状态已变化/);
});
test('registration selection updates preview and completes the avatar requirement without losing nickname',()=>{
 let component;vm.runInNewContext(fs.readFileSync('miniprogram/components/registration-sheet/index.js','utf8'),{Component:value=>component=value,require:()=>({})});
 Object.assign(component,component.methods);component.setData=(patch,done)=>{Object.assign(component.data,patch);done?.()};
 component.data.nickname='已有昵称';component.openAvatarPicker();assert.equal(component.data.avatarPickerOpen,true);
 component.selectAvatar({detail:{avatarUrl:'/assets/avatars/navy.svg'}});
 assert.equal(component.data.avatarSelected,true);assert.equal(component.data.avatarPickerOpen,false);assert.equal(component.data.canSubmit,true);assert.equal(component.data.nickname,'已有昵称');
});
