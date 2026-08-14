const { getProfile, saveProfile, getProfileCompletion } = require("../../utils/member.js");
const { linkCommunityPhone } = require("../../utils/payment.js");

Page({
  data: { profile: {}, nickname: "", profileCompletion: 0 },

  onShow() {
    const profile = getProfile();
    this.setData({ profile, nickname: profile.nickname, profileCompletion: getProfileCompletion(profile) });
  },

  chooseAvatar(event) {
    const tempFilePath = event.detail.avatarUrl;
    if (!tempFilePath) return;
    wx.getFileSystemManager().saveFile({
      tempFilePath,
      success: ({ savedFilePath }) => {
        const profile = saveProfile({ avatarUrl: savedFilePath });
        this.setData({ profile, profileCompletion: getProfileCompletion(profile) });
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
    const profile = saveProfile({ nickname });
    this.setData({ profile, nickname: profile.nickname, profileCompletion: getProfileCompletion(profile) });
    wx.showToast({ title: "资料已保存", icon: "success" });
  },

  async getPhoneNumber(event) {
    if (!event.detail.code) {
      wx.showToast({ title: "未获得手机号授权", icon: "none" });
      return;
    }
    wx.showLoading({ title: "正在绑定", mask: true });
    try {
      const result = await linkCommunityPhone(event.detail.code);
      const profile = saveProfile({ phonePending: false, phoneMasked: result.phoneMasked || "已绑定" });
      this.setData({ profile, profileCompletion: getProfileCompletion(profile) });
      wx.hideLoading();
      wx.showToast({ title: "手机号已绑定", icon: "success" });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: error.message || "绑定失败，请重试", icon: "none" });
    }
  },
});
