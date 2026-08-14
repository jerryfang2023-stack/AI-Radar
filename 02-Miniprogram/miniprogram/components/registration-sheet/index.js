const { login } = require("../../utils/payment.js");
const { saveProfile, syncMembership } = require("../../utils/member.js");

Component({
  properties: {
    visible: { type: Boolean, value: false },
    required: { type: Boolean, value: false },
    inviteCode: { type: String, value: "" },
  },

  data: {
    avatarUrl: "/assets/brand/app-icon-light.svg",
    avatarSelected: false,
    nickname: "",
    canSubmit: false,
    registering: false,
    registered: false,
    membership: {},
  },

  observers: {
    visible(value) {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const tabBar = page?.getTabBar?.();
      if (tabBar) tabBar.setData({ hidden: value });
    },
  },

  lifetimes: {
    detached() {
      const pages = getCurrentPages();
      const page = pages[pages.length - 1];
      const tabBar = page?.getTabBar?.();
      if (tabBar) tabBar.setData({ hidden: false });
    },
  },

  methods: {
    noop() {},

    close() {
      if (this.data.registering) return;
      this.triggerEvent("close");
    },

    chooseAvatar(event) {
      const tempFilePath = event.detail.avatarUrl;
      if (!tempFilePath) return;
      wx.getFileSystemManager().saveFile({
        tempFilePath,
        success: ({ savedFilePath }) => {
          this.setData({ avatarUrl: savedFilePath, avatarSelected: true }, () => this.updateSubmitState());
        },
        fail: () => wx.showToast({ title: "头像保存失败，请重新选择", icon: "none" }),
      });
    },

    inputNickname(event) {
      this.setData({ nickname: event.detail.value }, () => this.updateSubmitState());
    },

    updateSubmitState() {
      this.setData({ canSubmit: this.data.avatarSelected && Boolean(this.data.nickname.trim()) });
    },

    async registerWithPhone(event) {
      if (!this.data.canSubmit || this.data.registering) return;
      const phoneCode = event.detail.code;
      if (!phoneCode) {
        wx.showToast({ title: "需要手机号授权才能完成注册", icon: "none" });
        return;
      }
      this.setData({ registering: true });
      try {
        const nickname = this.data.nickname.trim().slice(0, 20);
        const result = await login({
          inviteCode: this.properties.inviteCode,
          phoneCode,
          nickname,
          avatarSelected: true,
        });
        const membership = syncMembership(result.membership);
        saveProfile({
          nickname,
          avatarUrl: this.data.avatarUrl,
          phoneMasked: result.profile?.phoneMasked || "",
          phonePending: false,
        });
        this.setData({ registered: true, membership });
        this.triggerEvent("registered", { membership, isNewUser: result.isNewUser });
      } catch (error) {
        wx.showToast({ title: error.message || "注册未完成，请重试", icon: "none" });
      } finally {
        this.setData({ registering: false });
      }
    },

    continueBrowsing() {
      this.triggerEvent("continue", { membership: this.data.membership });
    },
  },
});
