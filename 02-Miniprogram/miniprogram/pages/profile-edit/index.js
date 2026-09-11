const { getProfile, saveProfile, getProfileCompletion, syncCommunity } = require("../../utils/member.js");
const { bindPhoneNumber, fetchMembership, updateProfile } = require("../../utils/payment.js");

Page({
  data: { profile: {}, nickname: "", profileCompletion: 0, bindingPhone: false, saving: false },

  onShow() {
    this.refreshProfile();
    this.loadRemoteProfile();
  },

  refreshProfile() {
    const profile = getProfile();
    this.setData({ profile, nickname: this._nicknameDirty ? this.data.nickname : profile.nickname, profileCompletion: getProfileCompletion(profile) });
  },

  async loadRemoteProfile() {
    try {
      const result = await fetchMembership();
      if (result.community) syncCommunity(result.community);
      if (!this._nicknameDirty && !this.data.saving && result.profile?.nickname) {
        saveProfile({ nickname: result.profile.nickname });
      }
      if (result.profile?.phoneMasked) saveProfile({ phoneMasked: result.profile.phoneMasked, phonePending: false });
      this.refreshProfile();
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

  inputNickname(event) { this._nicknameDirty = true; this.setData({ nickname: event.detail.value }); },

  async saveNickname(event = {}) {
    if (this.data.saving) return;
    const nickname = String(event.detail?.value?.nickname ?? this.data.nickname).trim();
    if (!nickname) {
      wx.showToast({ title: "请输入昵称", icon: "none" });
      return;
    }
    this._nicknameDirty = true;
    this.setData({ saving: true, nickname });
    try {
      const result = await updateProfile(nickname);
      if (result.profile?.nickname !== nickname) throw new Error("保存结果未确认，请重试");
      saveProfile({ nickname });
      this.refreshProfile();
      wx.showToast({ title: "资料已保存", icon: "success" });
    } catch (error) {
      wx.showToast({ title: error.message || "资料未保存，请重试", icon: "none" });
    } finally { this.setData({ saving: false }); }
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
