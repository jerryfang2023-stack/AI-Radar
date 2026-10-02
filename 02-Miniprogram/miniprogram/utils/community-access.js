const { readExperience } = require("./experience.js");
const { fetchMembership, hasAuthToken } = require("./payment.js");
const { syncMembership, getMembership } = require("./member.js");
const { requestLockedContent } = require("./metered-access.js");

function block(page, reason, next, explicit) {
  if (!page) return false;
  page.pendingCommunity = next;
  page.setData({ communityAccessBlocked: true, lockReason: reason, loading: false, showLoading: false });
  if (explicit) return requestLockedContent(page).then(() => false);
  return false;
}
async function requireCommunityMember(next, page, explicit = false) {
  if (readExperience()) { page?.setData({communityAccessBlocked:false}); if (typeof next === "function") next(); return true; }
  if (!hasAuthToken()) return block(page, getMembership().registered ? 'session' : 'unregistered', next, explicit);
  try {
    const result = await fetchMembership();
    if (result.membership) syncMembership(result.membership);
    if (result.membership?.active) {
      page?.setData({communityAccessBlocked:false});
      if (typeof next === "function") next();
      return true;
    }
    return block(page, 'expired', next, explicit);
  } catch (error) {
    if (error.code === "AUTH_CHANGED") return false;
    if (error.statusCode === 401 || error.code === "AUTH_REQUIRED" || error.accessState === 'session') return block(page, getMembership().registered ? 'session' : 'unregistered', next, explicit);
    if (page) page.setData({communityAccessBlocked:true, lockReason:'retry'});
    wx.showToast({ title: error.message || "账号状态暂未同步，请重试", icon: "none" });
  }
  return false;
}
const communityGate = {
  unlockCommunity() { return this.data.lockReason==='retry' ? this.retryCommunityAccess() : requestLockedContent(this); },
  closeRegistration() { this.pendingCommunity=null; this.setData({registrationOpen:false}); },
  continueAfterRegistration() { this.setData({registrationOpen:false}); return this.retryCommunityAccess(); },
  verifyServerAccess() { return this.retryCommunityAccess(); },
  retryCommunityAccess() { const next=this.pendingCommunity; this.pendingCommunity=null; return next ? requireCommunityMember(next,this,true) : this.onLoad(this.communityEntryOptions||{}); },
};
module.exports = { requireCommunityMember, communityGate };
