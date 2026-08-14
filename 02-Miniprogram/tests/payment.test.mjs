import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadPaymentWx({ orderStatus = "PAID", paymentFailure = null } = {}) {
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
      if (url.endsWith("/invites/visit")) return success({ statusCode: 201, data: { recorded: true } });
      if (url.endsWith("/invites/me")) return success({ statusCode: 200, data: { summary: { inviteCode: "abc", invitedCount: 1, successfulCount: 1, rewardPoints: 300 } } });
      if (url.endsWith("/pay/wechat/orders")) return success({ statusCode: 201, data: {
        orderNo: "GL001",
        payment: { timeStamp: "1", nonceStr: "n", package: "prepay_id=x", signType: "RSA", paySign: "s" },
      } });
      return success({ statusCode: 200, data: { order: { status: orderStatus }, membership: { status: "member" } } });
    },
    requestPayment: ({ success, fail }) => paymentFailure ? fail({ errMsg: paymentFailure }) : success({ errMsg: "requestPayment:ok" }),
  };
  delete require.cache[require.resolve("../miniprogram/utils/payment.js")];
  return { payment: require("../miniprogram/utils/payment.js"), requests };
}

test("creates a server-priced order and confirms paid status", async () => {
  const { payment, requests } = loadPaymentWx();
  const result = await payment.purchaseMembership("annual");
  assert.equal(result.order.status, "PAID");
  assert.deepEqual(requests.find((item) => item.url.endsWith("/pay/wechat/orders")).data, { planId: "annual" });
  assert.ok(requests.some((item) => item.url.endsWith("/pay/orders/GL001")));
});

test("does not confirm membership when the user cancels payment", async () => {
  const { payment, requests } = loadPaymentWx({ paymentFailure: "requestPayment:fail cancel" });
  await assert.rejects(payment.purchaseMembership("monthly"), (error) => error.code === "PAYMENT_CANCELLED");
  assert.equal(requests.some((item) => item.url.includes("/pay/orders/")), false);
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
