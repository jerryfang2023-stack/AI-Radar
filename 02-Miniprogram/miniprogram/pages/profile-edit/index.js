const { getProfile, saveProfile, getProfileCompletion } = require("../../utils/member.js");

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

  getPhoneNumber(event) {
    if (!event.detail.code) {
      wx.showToast({ title: "未获得手机号授权", icon: "none" });
      return;
    }
    const profile = saveProfile({ phonePending: true });
    this.setData({ profile });
    wx.showModal({
      title: "授权凭证已取得",
      content: "为保护手机号，授权码不会保存在本机。接入服务端后，将由服务端换取并保存脱敏手机号。",
      showCancel: false,
      confirmColor: "#0D355C",
    });
  },
});
