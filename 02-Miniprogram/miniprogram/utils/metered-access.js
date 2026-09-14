const { getAccessState, openMembership } = require("./access.js");

const SAMPLE_DETAIL_KEY = "guanlan_public_sample_detail_v1";

function decideDetailAccess(accessState, sampleKey, detailKey) {
  if (accessState === "active") return { contentLocked: false, lockReason: "active" };
  if (accessState === "expired") return { contentLocked: true, lockReason: "expired" };
  if (!sampleKey || sampleKey === detailKey) return { contentLocked: false, lockReason: "sample" };
  return { contentLocked: true, lockReason: "unregistered" };
}

function resolveDetailAccess(detailKey) {
  const accessState = getAccessState();
  const sampleKey = wx.getStorageSync(SAMPLE_DETAIL_KEY) || "";
  const result = decideDetailAccess(accessState, sampleKey, detailKey);
  if (accessState === "unregistered" && !sampleKey && detailKey) {
    wx.setStorageSync(SAMPLE_DETAIL_KEY, detailKey);
  }
  return result;
}

function contentLockReason(error) {
  if (error.accessState === "unregistered" && require("./member.js").getMembership().registered) return "session";
  if (error.accessState) return error.accessState;
  if (error.statusCode === 401 || error.code === "AUTH_REQUIRED") return "session";
  return getAccessState() === "unregistered" ? "unregistered" : "expired";
}

async function requestLockedContent(page) {
  if (page.data.lockReason === "session") {
    try {
      const { login } = require("./payment.js");
      const result = await login();
      const { syncMembership, syncWallet, syncCommunity, saveProfile } = require("./member.js");
      if (result.membership) syncMembership(result.membership);
      if (result.wallet) syncWallet(result.wallet);
      if (result.community) syncCommunity(result.community);
      if (result.profile) saveProfile({ nickname: result.profile.nickname, phoneMasked: result.profile.phoneMasked });
      return page.verifyServerAccess ? page.verifyServerAccess() : page.loadProtectedCards();
    } catch (error) {
      wx.showToast({ title: error.message || "登录未完成，请重试", icon: "none" });
      return;
    }
  }
  if (page.data.lockReason === "expired") {
    openMembership();
    return;
  }
  page.pendingAction = "content";
  page.setData({ registrationOpen: true });
}

function protectedResourceId(value) {
  let hash = 0x811c9dc5;
  const input = String(value || "");
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `r-${hash.toString(16).padStart(8, "0")}`;
}

module.exports = { contentLockReason, SAMPLE_DETAIL_KEY, decideDetailAccess, resolveDetailAccess, requestLockedContent, protectedResourceId };
