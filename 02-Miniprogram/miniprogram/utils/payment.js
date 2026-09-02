const API_ROOT = "https://www.zkdlj.vip/api/v1";
const TOKEN_KEY = "guanlan_api_token_v1";
const VISITOR_KEY = "guanlan_content_visitor_v1";
const analytics = require("./analytics.js");
const communityCache = new Map();
const communityPending = new Map();
const COMMUNITY_FRESH_MS = 30000;
const COMMUNITY_HOME_KEY = "guanlan_public_community_home_v2";
let communityIdentity;
let communityGeneration = 0;

function clearCommunityCache() {
  communityCache.clear();
  communityPending.clear();
  communityGeneration += 1;
}

function communityScope() {
  const identity = wx.getStorageSync(TOKEN_KEY) || "";
  if (identity !== communityIdentity) {
    clearCommunityCache();
    communityIdentity = identity;
  }
  return identity;
}

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
        ...(options.visitorId ? { "X-Visitor-ID": options.visitorId } : {}),
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
    const rejectLogin = () => {
      const error = new Error("微信登录失败，请重试");
      error.code = "WECHAT_LOGIN_ERROR";
      reject(error);
    };
    wx.login({
      timeout: 15000,
      success: (result) => result.code ? resolve(result.code) : rejectLogin(),
      fail: rejectLogin,
    });
  });
}

async function login(options = {}) {
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

async function communityRequest(path, options = {}) {
  const identity = communityScope();
  const reading = !options.method || options.method === "GET";
  // Only short-lived, identity-scoped list snapshots live in memory. Never store
  // full archives, personal profile forms or drafts; writes invalidate all lists.
  const cacheable = reading && ["home", "points", "cases", "program", "directory"].includes(path);
  if (!reading) {
    clearCommunityCache();
    wx.removeStorageSync(COMMUNITY_HOME_KEY);
  }
  const generation = communityGeneration;
  let cached = cacheable ? communityCache.get(path) : null;
  if (path === "home" && !cached) {
    const stored = wx.getStorageSync(COMMUNITY_HOME_KEY);
    if (stored && Number.isFinite(stored.time) && stored.time <= Date.now() && Array.isArray(stored.value?.archives) && Array.isArray(stored.value?.featuredMembers)) cached = stored;
  }
  const copy = (value) => JSON.parse(JSON.stringify(value));
  if (cached && Date.now() - cached.time < COMMUNITY_FRESH_MS && !options.force) return copy(cached.value);
  if (cached && Date.now() - cached.time < (path === "home" ? 300000 : COMMUNITY_FRESH_MS * 2) && options.onCached) options.onCached(copy(cached.value));
  if (cacheable && communityPending.has(path)) return communityPending.get(path).then(copy);
  const request = (path === "home" && reading ? apiRequest("/community/home") : withExistingToken((token) => apiRequest(`/community/${path}`, { ...options, token })))
    .then((result) => {
      if (communityScope() !== identity || generation !== communityGeneration) {
        throw Object.assign(new Error("数据已更新，请重试"), { code: "COMMUNITY_CHANGED" });
      }
      // A read started during a write may still contain the pre-write state.
      if (!reading) clearCommunityCache();
      if (cacheable) {
        const snapshot = { value: copy(result), time: Date.now() };
        communityCache.set(path, snapshot);
        if (path === "home") {
          try { wx.setStorageSync(COMMUNITY_HOME_KEY, snapshot); } catch (_) { /* Storage failure must not hide live content. */ }
        }
      }
      return result;
    }).catch((error) => {
      if (error.statusCode === 401 || error.statusCode === 403 || error.code === "AUTH_REQUIRED") clearCommunityCache();
      throw error;
    }).finally(() => {
      if (communityPending.get(path) === request) communityPending.delete(path);
    });
  if (cacheable) communityPending.set(path, request);
  return request.then(copy);
}

function prefetchCommunity() {
  if (!hasAuthToken()) return Promise.resolve();
  return Promise.all(["program", "cases", "points", "directory"].map((path) => communityRequest(path).catch(() => null)));
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
  // The phone code is single-use and is also sufficient to complete a first
  // Mini Program login. Do not discard it by starting an implicit login without
  // phoneCode: the server would correctly answer REGISTRATION_REQUIRED even
  // though the user just authorized their number.
  if (!hasAuthToken()) return login({ phoneCode: code });
  return withExistingToken((token) => apiRequest("/member/phone", { method: "POST", token, data: { code } }));
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

async function confirmPcLogin(ticket) {
  if (!ticket) throw new Error("登录二维码无效");
  return withExistingToken((token) => apiRequest(`/auth/qr-sessions/${encodeURIComponent(ticket)}/confirm`, {
    method: "POST",
    token,
    data: {},
  }));
}

function contentVisitorId() {
  let value = wx.getStorageSync(VISITOR_KEY);
  if (!value) {
    value = `${Date.now().toString(36)}.${Math.random().toString(36).slice(2)}.${Math.random().toString(36).slice(2)}`;
    wx.setStorageSync(VISITOR_KEY, value);
  }
  return value;
}

async function fetchProtectedContent(kind, id) {
  const token = wx.getStorageSync(TOKEN_KEY) || "";
  const result = await apiRequest(`/content/${encodeURIComponent(kind)}/${encodeURIComponent(id)}`, {
    token,
    visitorId: contentVisitorId(),
  });
  return result.content?.mini || result.content;
}

module.exports = {
  API_ROOT,
  apiRequest,
  login,
  hasAuthToken,
  fetchMembership,
  communityRequest,
  prefetchCommunity,
  clearCommunityCache,
  recordMemberBehavior,
  bindPhoneNumber,
  purchaseMembership,
  queryOrder,
  linkCommunityPhone,
  submitCommunityApplication,
  redeemPoints,
  fetchInviteSummary,
  recordInviteVisit,
  confirmPcLogin,
  fetchProtectedContent,
};
