import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadPaymentWx() {
  const storage = new Map();
  const requests = [];
  global.wx = {
    getStorageSync: (key) => storage.get(key),
    setStorageSync: (key, value) => storage.set(key, value),
    removeStorageSync: (key) => storage.delete(key),
    login: ({ success }) => success({ code: "login-code" }),
    request: ({ url, method, data, header, success }) => {
      requests.push({ url, method, data, header });
      if (url.endsWith("/auth/wechat")) return success({ statusCode: 200, data: { token: "token-1", isNewUser: true } });
      if (url.endsWith("/member/phone")) return success({ statusCode: 200, data: { profile: { phoneMasked: "138****8000" } } });
      if (url.endsWith("/member/me")) return success({ statusCode: 200, data: { membership: { status: "trial" }, profile: { phoneMasked: "138****8000" } } });
      if (url.endsWith("/member/behaviors")) return success({ statusCode: 200, data: { awarded: 5, wallet: { balance: 5, lifetime: 5 } } });
      if (url.endsWith("/invites/visit")) return success({ statusCode: 201, data: { recorded: true } });
      if (url.endsWith("/invites/me")) return success({ statusCode: 200, data: { summary: { inviteCode: "abc", invitedCount: 1, successfulCount: 1, rewardPoints: 300 } } });
      if (url.endsWith("/community/link-phone")) return success({ statusCode: 200, data: { community: { status: "joined", points: 860 }, wallet: { balance: 860, lifetime: 860 } } });
      if (url.endsWith("/community/applications")) return success({ statusCode: 201, data: { community: { status: "pending" } } });
      if (url.endsWith("/points/redeem")) return success({ statusCode: 200, data: { wallet: { balance: 560, lifetime: 860 }, membership: { status: "member" } } });
      return success({ statusCode: 200, data: { membership: { status: "member" } } });
    },
  };
  delete require.cache[require.resolve("../miniprogram/utils/payment.js")];
  return { payment: require("../miniprogram/utils/payment.js"), requests };
}

test("links an existing member, submits native applications, and redeems on the server", async () => {
  const { payment, requests } = loadPaymentWx();
  const linked = await payment.linkCommunityPhone("phone-code");
  assert.equal(linked.community.status, "joined");
  assert.equal(linked.wallet.lifetime, 860);

  const application = { name: "申请人", phone: "13900139000" };
  assert.equal((await payment.submitCommunityApplication(application)).community.status, "pending");
  assert.equal((await payment.redeemPoints("membership_7d")).wallet.balance, 560);
  assert.deepEqual(requests.find((item) => item.url.endsWith("/community/applications")).data, application);
});

test("attributes registration to an invite and loads confirmed invite stats", async () => {
  const { payment, requests } = loadPaymentWx();
  const registration = await payment.login({ inviteCode: "invite-abc", phoneCode: "phone-code", nickname: "新用户", avatarSelected: true });
  assert.equal(registration.isNewUser, true);
  assert.deepEqual(requests.find((item) => item.url.endsWith("/auth/wechat")).data, {
    code: "login-code",
    inviteCode: "invite-abc",
    phoneCode: "phone-code",
    nickname: "新用户",
    avatarSelected: true,
  });

  await payment.recordInviteVisit("invite-abc", "device-1");
  const stats = await payment.fetchInviteSummary();
  assert.equal(stats.summary.rewardPoints, 300);
  assert.ok(requests.some((item) => item.url.endsWith("/invites/visit")));
});

test("does not silently register while checking membership", async () => {
  const { payment, requests } = loadPaymentWx();
  assert.equal(payment.hasAuthToken(), false);
  await assert.rejects(payment.fetchMembership(), (error) => error.code === "AUTH_REQUIRED");
  assert.equal(requests.some((item) => item.url.endsWith("/auth/wechat")), false);
});

test("exchanges a phone authorization code and returns the masked phone", async () => {
  const { payment, requests } = loadPaymentWx();
  const result = await payment.bindPhoneNumber("phone-code");
  assert.equal(result.profile.phoneMasked, "138****8000");
  const request = requests.find((item) => item.url.endsWith("/member/phone"));
  assert.equal(request.method, "POST");
  assert.deepEqual(request.data, { code: "phone-code" });
  assert.equal(request.header.Authorization, "Bearer token-1");
});

test("records growth task points in the unified server wallet", async () => {
  const { payment, requests } = loadPaymentWx();
  await payment.login({ phoneCode: "phone-code", nickname: "会员", avatarSelected: true });
  const result = await payment.recordMemberBehavior("checkin", "daily", "2026-08-14");
  assert.deepEqual(result.wallet, { balance: 5, lifetime: 5 });
  const request = requests.find((item) => item.url.endsWith("/member/behaviors"));
  assert.equal(request.method, "POST");
  assert.deepEqual(request.data, { type: "checkin", subjectId: "daily", behaviorDate: "2026-08-14" });
  assert.equal(request.header.Authorization, "Bearer token-1");
});
