const { persistAvatar, systemAvatars } = require("../../utils/avatar.js");

Component({
  properties: { visible: { type: Boolean, value: false } },
  data: { avatars: systemAvatars, saving: false, message: "", nativeSupported: true },
  observers: {
    visible(value) {
      if (value) this.setData({ message: "", nativeSupported: !wx.canIUse || wx.canIUse("button.open-type.chooseAvatar") });
    },
  },
  lifetimes: { detached() { this.disposed = true; } },
  methods: {
    noop() {},
    close() { if (!this.data.saving) this.triggerEvent("close"); },
    nativeTap() {
      this.setData({ message: this.data.nativeSupported ? "请在微信窗口选择头像，也可以使用下方系统头像。" : "当前微信版本不支持微信头像选择，请使用系统头像或升级微信。" });
    },
    async chooseAvatar(event) {
      if (this.data.saving) return;
      const temporary = event.detail?.avatarUrl;
      if (!temporary) {
        this.setData({ message: "未选择头像，原头像保持不变，可重新选择。" });
        return;
      }
      const identity = wx.getStorageSync("guanlan_api_token_v1") || "";
      this.setData({ saving: true, message: "正在保存头像…" });
      try {
        const avatarUrl = await persistAvatar(temporary);
        if (this.disposed) return;
        if ((wx.getStorageSync("guanlan_api_token_v1") || "") !== identity) {
          this.setData({ message: "登录状态已变化，请重新选择头像。" });
          return;
        }
        this.triggerEvent("selected", { avatarUrl });
      } catch (_) {
        if (!this.disposed) this.setData({ message: "头像保存失败，请重试或选择系统头像。" });
      } finally {
        if (!this.disposed) this.setData({ saving: false });
      }
    },
    selectSystemAvatar(event) {
      if (this.data.saving) return;
      const avatar = systemAvatars.find(item => item.id === event.currentTarget.dataset.id);
      if (avatar) this.triggerEvent("selected", { avatarUrl: avatar.url });
    },
  },
});
