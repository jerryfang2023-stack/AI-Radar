import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const template = fs.readFileSync('miniprogram/components/registration-sheet/index.wxml', 'utf8');
const input = template.match(/<input\b[^>]*type="nickname"[^>]*>/)[0];
function harness({ review = true, serverName, pendingLogin } = {}) {
  let definition;
  const calls = [], saved = [], toasts = [];
  vm.runInNewContext(fs.readFileSync('miniprogram/components/registration-sheet/index.js', 'utf8'), {
    Component: value => definition = value,
    require: id => id.includes('payment.js') ? { login: async payload => {
      calls.push(payload);
      if (pendingLogin) await pendingLogin;
      return { profile: { nickname: serverName || payload.nickname }, membership: { active: true }, community: { status: 'none' } };
    } } : id.includes('analytics.js') ? { track() {}, flush() {} } : {
      saveProfile: p => saved.push(p), syncBehaviorQueue: async () => {}, syncCommunity() {}, syncMembership: p => p, syncWallet() {},
    },
    wx: { canIUse: () => review, showToast: p => toasts.push(p) }, getCurrentPages: () => [],
  });
  const component = { ...definition.methods, data: { ...definition.data, avatarSelected: true }, properties: {},
    setData(p, cb) { Object.assign(this.data, p); cb?.(); }, triggerEvent() {},
  };
  function emit(event, detail = {}) {
    const binding = input.match(new RegExp(`bind${event}="([^"]+)"`));
    assert.ok(binding, `native ${event} must be bound`);
    component[binding[1]]({ detail });
  }
  return { component, emit, calls, saved, toasts };
}
function select(h, name = '微信昵称') {
  h.emit('focus'); h.emit('blur', { value: name });
}
const phone = { detail: { code: 'single-use-code' } };

test('native nickname selection without input event is submitted after review', async () => {
  const h = harness(); select(h);
  assert.equal(h.component.data.nickname, '微信昵称');
  assert.equal(h.component.data.canSubmit, false);
  await h.component.registerWithPhone(phone);
  assert.equal(h.calls.length, 0);
  h.emit('nicknamereview', { pass: true });
  assert.equal(h.component.data.canSubmit, true);
  await h.component.registerWithPhone(phone);
  assert.equal(h.calls[0].nickname, '微信昵称');
  assert.equal(h.saved[0].nickname, '微信昵称');
});
test('native selection replaces a previously typed WeChat ID', async () => {
  const h = harness(); h.emit('focus'); h.emit('input', { value: 'wxid_old' });
  h.emit('blur', { value: '实际昵称' }); h.emit('nicknamereview', { pass: true });
  await h.component.registerWithPhone(phone);
  assert.equal(h.calls[0].nickname, '实际昵称');
});
for (const detail of [{ pass: false }, { pass: true, timeout: true }]) {
  test(`nickname review failure or timeout blocks both registration paths: ${JSON.stringify(detail)}`, async () => {
    const h = harness(); select(h); h.emit('nicknamereview', detail);
    await h.component.registerWithPhone(phone); await h.component.linkExistingMember(phone);
    assert.equal(h.calls.length, 0); assert.ok(h.component.data.nicknameNotice);
    select(h, '重新选择'); h.emit('nicknamereview', { pass: true });
    await h.component.registerWithPhone(phone); assert.equal(h.calls[0].nickname, '重新选择');
  });
}
test('editing a previously reviewed nickname invalidates eligibility and ignores late review while focused', async () => {
  const h = harness(); select(h); h.emit('nicknamereview', { pass: true });
  h.emit('focus'); h.emit('input', { value: '新昵称' }); h.emit('nicknamereview', { pass: true });
  await h.component.registerWithPhone(phone); assert.equal(h.calls.length, 0);
  h.emit('blur', { value: '新昵称' }); h.emit('nicknamereview', { pass: true });
  await h.component.registerWithPhone(phone); assert.equal(h.calls[0].nickname, '新昵称');
});
test('older base libraries take the final blur value without waiting for unsupported review', async () => {
  const h = harness({ review: false }); select(h);
  await h.component.registerWithPhone(phone); assert.equal(h.calls[0].nickname, '微信昵称');
});
test('empty names, placeholder names, and WeChat IDs cannot register even with stale canSubmit', async () => {
  for (const name of ['', '   ', 'wxid_example', 'WXID_example', '观澜用户', '微信用户']) {
    const h = harness({ review: false }); select(h, name); h.component.data.canSubmit = true;
    await h.component.registerWithPhone(phone); assert.equal(h.calls.length, 0, name);
  }
});
test('verified-phone community lookup remains available without entering a nickname', async () => {
  const h = harness(); await h.component.linkExistingMember(phone);
  assert.equal(h.calls.length, 1); assert.equal(h.calls[0].nickname, '');
});
test('server-confirmed display name wins over submitted nickname in local profile', async () => {
  const h = harness({ serverName: '社群确认姓名' }); select(h); h.emit('nicknamereview', { pass: true });
  await h.component.registerWithPhone(phone); assert.equal(h.saved[0].nickname, '社群确认姓名');
});
test('repeated phone callbacks and switching registration paths do not submit twice', async () => {
  let finish; const h = harness({ pendingLogin: new Promise(resolve => finish = resolve) });
  select(h); h.emit('nicknamereview', { pass: true });
  const task = h.component.registerWithPhone(phone);
  await h.component.registerWithPhone(phone); await h.component.linkExistingMember(phone);
  assert.equal(h.calls.length, 1); finish(); await task;
});
test('phone authorization cancellation never submits registration', async () => {
  const h = harness(); select(h); h.emit('nicknamereview', { pass: true });
  await h.component.registerWithPhone({ detail: {} }); assert.equal(h.calls.length, 0);
  assert.match(h.toasts[0].title, /手机号授权/);
});
