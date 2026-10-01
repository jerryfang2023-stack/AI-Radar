const { readExperience } = require("./experience.js");
const { fetchMembership } = require("./payment.js");
const { syncMembership } = require("./member.js");

async function requireCommunityMember(next) {
  if (readExperience()) { if (typeof next === "function") next(); return true; }
  try {
    const result = await fetchMembership();
    if (result.membership) syncMembership(result.membership);
    if (result.membership?.active) {
      if (typeof next === "function") next();
      return true;
    }
    wx.navigateTo({ url: "/pages/membership/index" });
  } catch (error) {
    if (error.code === "AUTH_CHANGED") return false;
    if (error.statusCode === 401 || error.code === "AUTH_REQUIRED") wx.navigateTo({ url: "/pages/membership/index" });
    else wx.showToast({ title: error.message || "账号状态暂未同步，请重试", icon: "none" });
  }
  return false;
}
module.exports = { requireCommunityMember };
