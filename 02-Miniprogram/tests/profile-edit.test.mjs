import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
function harness() {
 let page, profile={nickname:'原昵称',phoneMasked:'',avatarUrl:'local-avatar'}, resolveRead, fail=false;
 const remote=new Promise(resolve=>resolveRead=resolve), writes=[], toasts=[];
 vm.runInNewContext(fs.readFileSync('miniprogram/pages/profile-edit/index.js','utf8'),{
  Page:p=>page=p,
  require:id=>id.includes('member.js')?{getProfile:()=>({...profile}), saveProfile:p=>{profile={...profile,...p};return profile}, getProfileCompletion:()=>100,syncCommunity:()=>{}}:{fetchMembership:()=>remote, updateProfile:async nickname=>{writes.push(nickname);if(fail)throw Error('网络错误');return {profile:{nickname}}}},
  wx:{showToast:p=>toasts.push(p),getFileSystemManager:()=>({saveFile:p=>p.success({savedFilePath:'new-avatar'})})}
 });page.setData=patch=>Object.assign(page.data,patch);
 return {page,resolveRead,writes,toasts,profile:()=>profile,reject:()=>fail=true};
}
test('late profile reads and avatar saves preserve nickname draft; form value persists after reopening',async()=>{
 const h=harness();h.page.onShow();h.page.inputNickname({detail:{value:'输入中的昵称'}});
 h.resolveRead({profile:{nickname:'服务器旧昵称',phoneMasked:'138****0000'}});await new Promise(setImmediate);
 assert.equal(h.page.data.nickname,'输入中的昵称');
 h.page.chooseAvatar({detail:{avatarUrl:'temp'}});assert.equal(h.page.data.nickname,'输入中的昵称');
 await h.page.saveNickname({detail:{value:{nickname:'微信昵称选择结果'}}});
 assert.equal(h.profile().nickname,'微信昵称选择结果');assert.deepEqual(h.writes,['微信昵称选择结果']);
 h.page._nicknameDirty=false;h.page.refreshProfile();assert.equal(h.page.data.nickname,'微信昵称选择结果');
});
test('failed remote save keeps draft and never reports success or overwrites persisted nickname',async()=>{
 const h=harness();h.page.refreshProfile();h.reject();await h.page.saveNickname({detail:{value:{nickname:'新昵称'}}});
 assert.equal(h.profile().nickname,'原昵称');assert.equal(h.page.data.nickname,'新昵称');assert.equal(h.page.data.saving,false);
 assert.equal(h.toasts.at(-1).icon,'none');
});
