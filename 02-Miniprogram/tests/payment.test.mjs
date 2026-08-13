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

