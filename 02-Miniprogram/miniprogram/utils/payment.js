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
  linkCommunityPhone,
  submitCommunityApplication,
  redeemPoints,
  fetchInviteSummary,
  recordInviteVisit,
};
