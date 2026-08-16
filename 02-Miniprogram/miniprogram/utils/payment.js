const API_ROOT = "https://www.zkdlj.vip/api/v1";
const TOKEN_KEY = "guanlan_api_token_v1";
const analytics = require("./analytics.js");

function apiRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_ROOT}${path}`,
      method: options.method || "GET",
      data: options.data,
      timeout: options.timeout || 30000,
      header: {
        "content-type": "application/json",
        ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      },
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) return resolve(response.data || {});
        const error = new Error(response.data?.error?.message || `请求失败（${response.statusCode}）`);
        error.code = response.data?.error?.code || "API_ERROR";
        error.statusCode = response.statusCode;
        reject(error);
      },
      fail(error) {
        const reason = new Error(error?.errMsg?.includes("timeout") ? "连接超时，请重试" : "网络连接失败，请重试");
        reason.code = "NETWORK_ERROR";
        reject(reason);
      },
    });
  });
}

function wxLogin() {
  return new Promise((resolve, reject) => {
    wx.login({
      timeout: 15000,
      success: (result) => result.code ? resolve(result.code) : reject(new Error("微信登录失败，请重试")),
      fail: () => reject(new Error("微信登录失败，请重试")),
    });
  });
}

async function login(options = {}) {
  if (!hasAuthToken()) analytics.track("registration_started", { hasPhoneCode: Boolean(options.phoneCode) });
  const code = await wxLogin();
  const result = await apiRequest("/auth/wechat", {
    method: "POST",
    data: {
      code,
      ...(options.inviteCode ? { inviteCode: options.inviteCode } : {}),
      ...(options.phoneCode ? { phoneCode: options.phoneCode } : {}),
      ...(options.nickname ? { nickname: options.nickname } : {}),
      ...(options.avatarSelected ? { avatarSelected: true } : {}),
    },
  });
  if (!result.token) throw new Error("登录状态获取失败，请重试");
  wx.setStorageSync(TOKEN_KEY, result.token);
  if (result.isNewUser) analytics.track("registration_client_confirmed", { communityLinked: result.community?.status === "joined" });
  analytics.flush();
  return result;
}

function hasAuthToken() {
  return Boolean(wx.getStorageSync(TOKEN_KEY));
}

async function withExistingToken(fn) {
  const token = wx.getStorageSync(TOKEN_KEY);
  if (!token) {
    const error = new Error("请先完成注册");
    error.code = "AUTH_REQUIRED";
    throw error;
  }
  try {
    return await fn(token);
  } catch (error) {
    if (error.statusCode === 401 || error.code === "AUTH_EXPIRED" || error.code === "AUTH_INVALID") {
      wx.removeStorageSync(TOKEN_KEY);
    }
    throw error;
  }
}

async function withToken(fn, retry = true) {
  let token = wx.getStorageSync(TOKEN_KEY);
  if (!token) token = (await login()).token;
  try {
    return await fn(token);
  } catch (error) {
    if (retry && (error.statusCode === 401 || error.code === "AUTH_EXPIRED" || error.code === "AUTH_INVALID")) {
      wx.removeStorageSync(TOKEN_KEY);
      return withToken(fn, false);
    }
    throw error;
  }
}

function requestVirtualPayment(payment) {
  return new Promise((resolve, reject) => {
    if (typeof wx.requestVirtualPayment !== "function") {
      const reason = new Error("当前微信版本暂不支持虚拟支付，请升级微信后重试");
      reason.code = "VIRTUAL_PAYMENT_UNSUPPORTED";
      reject(reason);
      return;
    }
    wx.requestVirtualPayment({
      mode: payment.mode,
      signData: payment.signData,
      paySig: payment.paySig,
      signature: payment.signature,
      success: resolve,
      fail(error) {
        const cancelled = error?.errMsg?.includes("cancel");
        const reason = new Error(cancelled ? "已取消支付" : "支付未完成，请重试");
        reason.code = cancelled ? "PAYMENT_CANCELLED" : "PAYMENT_FAILED";
        reject(reason);
      },
    });
  });
}

const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));

async function queryOrder(orderNo, attempts = 4) {
  let result;
  for (let index = 0; index < attempts; index += 1) {
    result = await withToken((token) => apiRequest(`/pay/orders/${encodeURIComponent(orderNo)}`, { token }));
    if (result.order?.status === "PAID") return result;
    if (index < attempts - 1) await delay(800 + index * 600);
  }
  return result;
}

async function purchaseMembership(planId) {
  analytics.track("checkout_started", { planId });
  analytics.flush();
  const created = await withToken(async (token) => {
    const loginCode = await wxLogin();
    return apiRequest("/pay/virtual/orders", {
      method: "POST",
      token,
      data: { planId, loginCode },
    });
  });
  await requestVirtualPayment(created.payment);
  const result = await queryOrder(created.orderNo);
  if (result?.order?.status !== "PAID") {
    const error = new Error("支付结果确认中，请稍后在会员中心刷新");
    error.code = "PAYMENT_CONFIRMING";
    error.orderNo = created.orderNo;
    throw error;
  }
  analytics.track("payment_client_confirmed", { planId, orderNo: created.orderNo });
  analytics.flush();
  return result;
}

async function fetchMembership() {
  return withExistingToken((token) => apiRequest("/member/me", { token }));
}

async function recordMemberBehavior(type, subjectId, behaviorDate) {
  return withExistingToken((token) => apiRequest("/member/behaviors", {
    method: "POST",
    token,
    data: { type, subjectId, behaviorDate },
  }));
}

async function bindPhoneNumber(code) {
  if (!code) throw new Error("未获得手机号授权");
  return withToken((token) => apiRequest("/member/phone", { method: "POST", token, data: { code } }));
}

async function linkCommunityPhone(code) {
  return withToken((token) => apiRequest("/community/link-phone", { method: "POST", token, data: { code } }));
}

async function submitCommunityApplication(application) {
  return withToken((token) => apiRequest("/community/applications", { method: "POST", token, data: application }));
}

async function redeemPoints(benefitId) {
  return withToken((token) => apiRequest("/points/redeem", { method: "POST", token, data: { benefitId } }));
}

async function fetchInviteSummary() {
  return withToken((token) => apiRequest("/invites/me", { token }));
}

async function recordInviteVisit(inviteCode, visitorKey) {
  if (!inviteCode || !visitorKey) return { recorded: false };
  return apiRequest("/invites/visit", { method: "POST", data: { inviteCode, visitorKey } });
}

module.exports = {
  API_ROOT,
  apiRequest,
  login,
  hasAuthToken,
  fetchMembership,
  recordMemberBehavior,
  bindPhoneNumber,
  purchaseMembership,
  queryOrder,
  linkCommunityPhone,
  submitCommunityApplication,
  redeemPoints,
  fetchInviteSummary,
  recordInviteVisit,
};
