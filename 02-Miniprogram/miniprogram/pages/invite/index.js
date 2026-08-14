const { getProfile, syncInviteRewards, syncMembership } = require("../../utils/member.js");
const { fetchInviteSummary, login, recordInviteVisit } = require("../../utils/payment.js");

const VISITOR_KEY = "guanlan_invite_visitor_v1";
const INVITE_CODE_KEY = "guanlan_own_invite_code_v1";

function decoded(value, fallback) {
  try {
    return decodeURIComponent(value || "") || fallback;
  } catch (error) {
    return fallback;
  }
}

function getVisitorKey() {
  const current = wx.getStorageSync(VISITOR_KEY);
  if (current) return current;
  const value = `visitor_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  wx.setStorageSync(VISITOR_KEY, value);
  return value;
}

Page({
  data: {
    isInvitee: false,
    sharedEntry: false,
    inviterName: "一位朋友",
    inviteCode: wx.getStorageSync(INVITE_CODE_KEY) || "",
    registering: false,
    registered: false,
    summary: { invitedCount: 0, successfulCount: 0, rewardPoints: 0 },
  },

  onLoad(options) {
    const isInvitee = options.from === "member_invite";
    const inviterName = decoded(options.inviterName, "一位朋友");
    const inviteCode = String(options.inviteCode || "");
    this.setData({
      isInvitee,
      sharedEntry: isInvitee || getCurrentPages().length <= 1,
      inviterName,
      inviteCode,
    });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    if (isInvitee) {
      recordInviteVisit(inviteCode, getVisitorKey()).catch(() => {});
    } else {
      this.loadSummary();
    }
  },

  async loadSummary() {
    try {
      const result = await fetchInviteSummary();
      wx.setStorageSync(INVITE_CODE_KEY, result.summary.inviteCode);
      syncInviteRewards(result.summary.rewardPoints);
      this.setData({ inviteCode: result.summary.inviteCode, summary: result.summary });
    } catch (error) {
      wx.showToast({ title: "邀请统计暂时无法加载", icon: "none" });
    }
  },

  async registerInvitee() {
    if (this.data.registering) return;
    if (this.data.registered) return this.openExperience();
    this.setData({ registering: true });
    try {
      const result = await login({ inviteCode: this.data.inviteCode });
      if (result.membership) syncMembership(result.membership);
      this.setData({ registered: true });
      wx.showToast({
        title: result.isNewUser ? "注册成功，7 天体验已开启" : "你已是观澜用户",
        icon: "none",
      });
    } catch (error) {
      wx.showToast({ title: error.message || "注册失败，请重试", icon: "none" });
    } finally {
      this.setData({ registering: false });
    }
  },

  openExperience() {
    wx.switchTab({ url: "/pages/terminal/index" });
  },

  switchSection(event) {
    wx.switchTab({ url: event.currentTarget.dataset.url });
  },

  onShareAppMessage() {
    const profile = getProfile();
    const inviterName = encodeURIComponent(profile.nickname || "观澜用户");
    const inviteCode = encodeURIComponent(this.data.inviteCode || "");
    return {
      title: `${profile.nickname || "一位朋友"} 邀请你一起看懂 AI 商业变化`,
      path: `/pages/invite/index?from=member_invite&inviteCode=${inviteCode}&inviterName=${inviterName}`,
    };
  },

  onShareTimeline() {
    const profile = getProfile();
    return {
      title: `${profile.nickname || "一位朋友"} 邀请你一起看懂 AI 商业变化`,
      query: `from=member_invite&inviteCode=${encodeURIComponent(this.data.inviteCode || "")}&inviterName=${encodeURIComponent(profile.nickname || "观澜用户")}`,
    };
  },
});
