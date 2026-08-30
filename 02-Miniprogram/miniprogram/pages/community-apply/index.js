const { fetchMembership, submitCommunityApplication } = require("../../utils/payment.js");
const { getCommunity, syncCommunity, syncWallet, syncMembership, getCommunityProfile, saveCommunityProfile } = require("../../utils/member.js");
const { readExperience, saveExperience } = require("../../utils/experience.js");

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
    const preview = readExperience();
    const publicProfile = preview ? preview.profile : getCommunityProfile();
    this.setData({
      community: preview ? { ...preview, statusLabel: preview.status === "pending" ? "体验审核中" : "体验身份", points: 0 } : getCommunity(),
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
    if (preview && preview.application) this.setData({ form: { ...EMPTY_FORM, ...preview.application } });
    if (!preview) this.refreshStatus();
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
    const preview = readExperience();
    if (preview) {
      const { phone, wechat, ...publicApplication } = form;
      preview.application = publicApplication;
      preview.profile = { ...preview.profile, name: form.name, avatar: form.name.slice(0, 1), city: form.city, role: form.role, industry: form.industry, ai: form.direction, project: form.project, ability: form.skills, need: form.needs };
      preview.status = "pending";
      saveExperience(preview);
      this.setData({ community: { status: "pending", statusLabel: "体验审核中", points: 0 } });
      wx.showModal({ title: "体验申请已保存", content: "仅保存在本机，未提交正式审核。返回社群首页可切换为已入群身份继续体验。", showCancel: false });
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
