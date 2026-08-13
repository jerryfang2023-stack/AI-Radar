const API_ROOT = "https://www.zkdlj.vip/api/v1";
const TOKEN_KEY = "guanlan_api_token_v1";

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

async function login() {
  const code = await wxLogin();
  const result = await apiRequest("/auth/wechat", { method: "POST", data: { code } });
  if (!result.token) throw new Error("登录状态获取失败，请重试");
  wx.setStorageSync(TOKEN_KEY, result.token);
  return result;
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

function requestPayment(payment) {
  return new Promise((resolve, reject) => {
    wx.requestPayment({
      ...payment,
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
  const created = await withToken((token) => apiRequest("/pay/wechat/orders", {
    method: "POST",
    token,
    data: { planId },
  }));
  await requestPayment(created.payment);
  const result = await queryOrder(created.orderNo);
  if (result?.order?.status !== "PAID") {
    const error = new Error("支付结果确认中，请稍后在会员中心刷新");
    error.code = "PAYMENT_CONFIRMING";
    error.orderNo = created.orderNo;
    throw error;
  }
  return result;
}

async function fetchMembership() {
  return withToken((token) => apiRequest("/member/me", { token }));
}

module.exports = { API_ROOT, apiRequest, login, fetchMembership, purchaseMembership, queryOrder };

