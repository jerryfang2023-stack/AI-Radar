const { getProfile, saveProfile, getProfileCompletion } = require("../../utils/member.js");
const { bindPhoneNumber, fetchMembership } = require("../../utils/payment.js");

Page({
  data: { profile: {}, nickname: "", profileCompletion: 0, bindingPhone: false },

  onShow() {
    this.refreshProfile();
    this.loadRemoteProfile();
  },

  refreshProfile() {
    const profile = getProfile();
    this.setData({ profile, nickname: profile.nickname, profileCompletion: getProfileCompletion(profile) });
  },

  async loadRemoteProfile() {
    try {
      const result = await fetchMembership();
      if (result.profile?.phoneMasked) {
        saveProfile({ phoneMasked: result.profile.phoneMasked, phonePending: false });
        this.refreshProfile();
      }
    } catch (error) {
      // Keep locally saved public profile available when the network is unavailable.
    }
  },

  chooseAvatar(event) {
    const tempFilePath = event.detail.avatarUrl;
    if (!tempFilePath) return;
    wx.getFileSystemManager().saveFile({
      tempFilePath,
      success: ({ savedFilePath }) => {
        saveProfile({ avatarUrl: savedFilePath });
        this.refreshProfile();
      },
      fail: () => wx.showToast({ title: "头像保存失败，请重试", icon: "none" }),
    });
  },

  inputNickname(event) { this.setData({ nickname: event.detail.value }); },

  saveNickname() {
    const nickname = this.data.nickname.trim();
    if (!nickname) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }
    saveProfile({ nickname });
    this.refreshProfile();
    wx.showToast({ title: "资料已保存", icon: "success" });
  },

  async getPhoneNumber(event) {
    const code = event.detail.code;
    if (!code) {
      wx.showToast({ title: "未获得手机号授权", icon: "none" });
      return;
    }
    if (this.data.bindingPhone) return;
    this.setData({ bindingPhone: true });
    try {
      const result = await bindPhoneNumber(code);
      saveProfile({ phoneMasked: result.profile?.phoneMasked || "", phonePending: false });
      this.refreshProfile();
      wx.showToast({ title: "手机号绑定成功", icon: "success" });
    } catch (error) {
      wx.showToast({ title: error.message || "手机号绑定失败，请重试", icon: "none" });
    } finally {
      this.setData({ bindingPhone: false });
    }
  },
});
