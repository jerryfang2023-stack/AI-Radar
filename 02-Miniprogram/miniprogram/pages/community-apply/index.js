const { fetchMembership, submitCommunityApplication } = require("../../utils/payment.js");
const { getCommunity, syncCommunity, syncWallet, syncMembership, getCommunityProfile, saveCommunityProfile } = require("../../utils/member.js");

const EMPTY_FORM = {
  name: "", phone: "", wechat: "", city: "", role: "Founder / 创业者", industry: "",
  skills: "", project: "", needs: "", direction: "", perspective: "",
};

Page({
  data: {
    community: { status: "none", statusLabel: "未入群", points: 0 },
    form: { ...EMPTY_FORM },
    submitting: false,
  },
  onShow() {
    const publicProfile = getCommunityProfile();
    this.setData({
      community: getCommunity(),
      form: {
        ...this.data.form,
        name: publicProfile.name || this.data.form.name,
        city: publicProfile.city || this.data.form.city,
        role: publicProfile.role || this.data.form.role,
        industry: publicProfile.industry || this.data.form.industry,
        skills: publicProfile.ability || this.data.form.skills,
        project: publicProfile.project || this.data.form.project,
        needs: publicProfile.need || this.data.form.needs,
        direction: publicProfile.ai || this.data.form.direction,
      },
    });
    this.refreshStatus();
  },
  async refreshStatus() {
    try {
      const result = await fetchMembership();
      if (result.community) syncCommunity(result.community);
      if (result.wallet) syncWallet(result.wallet);
      if (result.membership) syncMembership(result.membership);
      this.setData({ community: getCommunity() });
    } catch (_) {}
  },
  updateField(event) {
    this.setData({ [`form.${event.currentTarget.dataset.field}`]: event.detail.value });
  },
  editAgain() {
    this.setData({ community: { ...this.data.community, status: "none", statusLabel: "未入群" } });
  },
  async submit() {
    if (this.data.submitting) return;
    const form = Object.fromEntries(Object.entries(this.data.form).map(([key, value]) => [key, String(value || "").trim()]));
    if (Object.values(form).some((value) => !value)) {
      wx.showToast({ title: "请完成全部必填信息", icon: "none" });
      return;
    }
    this.setData({ submitting: true });
    wx.showLoading({ title: "正在提交", mask: true });
    try {
      const result = await submitCommunityApplication(form);
      saveCommunityProfile({
        name: form.name, avatar: form.name.slice(0, 1), city: form.city, role: form.role,
        industry: form.industry, ai: form.direction, project: form.project,
        ability: form.skills, need: form.needs,
      });
      const community = syncCommunity(result.community);
      this.setData({ community });
      wx.hideLoading();
      wx.showToast({ title: "申请已提交", icon: "success" });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({ title: error.message || "提交失败，请重试", icon: "none" });
    } finally {
      this.setData({ submitting: false });
    }
  },
});
