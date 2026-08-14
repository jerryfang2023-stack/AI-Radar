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
      if (url.endsWith("/auth/wechat")) return success({ statusCode: 200, data: { token: "token-1" } });
      if (url.endsWith("/pay/wechat/orders")) return success({ statusCode: 201, data: {
        orderNo: "GL001",
        payment: { timeStamp: "1", nonceStr: "n", package: "prepay_id=x", signType: "RSA", paySign: "s" },
      } });
      if (url.endsWith("/community/link-phone")) return success({ statusCode: 200, data: { community: { status: "joined", points: 860 }, wallet: { balance: 860, lifetime: 860 } } });
      if (url.endsWith("/community/applications")) return success({ statusCode: 201, data: { community: { status: "pending" } } });
      if (url.endsWith("/points/redeem")) return success({ statusCode: 200, data: { wallet: { balance: 560, lifetime: 860 }, membership: { status: "member" } } });
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
