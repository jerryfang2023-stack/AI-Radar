const { login } = require("../../utils/payment.js");
const { saveProfile, syncBehaviorQueue, syncCommunity, syncMembership, syncWallet } = require("../../utils/member.js");

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
    linkingExisting: false,
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

    syncAccountSnapshot(result, profile = {}) {
      const membership = syncMembership(result.membership);
      if (result.community) syncCommunity(result.community);
      if (result.wallet) syncWallet(result.wallet);
      saveProfile({
        nickname: profile.nickname || result.profile?.nickname || "观澜用户",
        ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
        phoneMasked: result.profile?.phoneMasked || "",
        phonePending: false,
      });
      syncBehaviorQueue().catch(() => {});
      return membership;
    },

    async linkExistingMember(event) {
      if (this.data.linkingExisting || this.data.registering) return;
      const phoneCode = event.detail.code;
      if (!phoneCode) {
        wx.showToast({ title: "需要手机号授权才能同步", icon: "none" });
        return;
      }
      this.setData({ linkingExisting: true });
      try {
        const result = await login({ phoneCode });
        if (result.community?.status !== "joined") {
          const error = new Error("未匹配到社群成员，请完成资料注册");
          error.code = "REGISTRATION_REQUIRED";
          throw error;
        }
        const membership = this.syncAccountSnapshot(result);
        this.setData({ registered: true, membership });
        this.triggerEvent("registered", { membership, isNewUser: result.isNewUser, linkedCommunity: true });
      } catch (error) {
        const message = error.code === "REGISTRATION_REQUIRED" ? "未匹配到社群成员，请完成资料注册" : (error.message || "同步失败，请重试");
        wx.showToast({ title: message, icon: "none" });
      } finally {
        this.setData({ linkingExisting: false });
      }
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
        const membership = this.syncAccountSnapshot(result, { nickname, avatarUrl: this.data.avatarUrl });
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
