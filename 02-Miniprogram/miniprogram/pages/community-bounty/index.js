const { bounties } = require("../../utils/community-data.js");
const { isExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const store = require("../../utils/community-case-store.js");

Page({
  data: { mode: "list", experience: false, activeFilter: "全部", filters: ["全部", "进行中", "待结案", "已结案", "我的"], bounties, item: null, form: {}, response: {}, allocation: {}, own: false, participating: false, error: "" },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    this.caseId = options.id;
    this.setData({ experience: isExperience() });
    this.refresh();
  },
  onShow() { if (this.loaded) this.refresh(); },
  run(action) { try { action(); } catch (error) { wx.showToast({ title: error.message, icon: "none" }); } },
  refresh() {
    this.run(() => {
      const all = this.data.experience ? store.listCases() : bounties;
      if (this.caseId) {
        const item = all.find((entry) => entry.id === this.caseId);
        if (!item) return this.setData({ error: "未找到此悬赏令" });
        const draft = this.data.experience ? store.getDraft(item.id) : {};
        const mine = (item.responses || []).find((entry) => entry.id === store.SELF) || {};
        this.setData({ mode: "detail", item: { ...item, founderInitial: item.founder.slice(0, 1) }, own: item.owner === store.SELF, response: { ...mine, ...draft }, participating: (item.joined || []).includes(store.SELF) });
      } else {
        const filter = this.data.activeFilter;
        const filtered = all.filter((item) => filter === "全部" || (filter === "我的" ? item.owner === store.SELF || (item.responses || []).some((answer) => answer.id === store.SELF) || (item.joined || []).includes(store.SELF) : item.status === filter));
        this.setData({ bounties: filtered, activeCount: all.filter((item) => item.status === "进行中").length });
      }
      this.loaded = true;
    });
  },
  switchFilter(event) { this.setData({ activeFilter: event.currentTarget.dataset.value }); this.refresh(); },
  openCase(event) { wx.navigateTo({ url: `/pages/community-bounty/index?id=${event.currentTarget.dataset.id}` }); },
  createCase() { this.run(() => { const draft = store.getDraft("create"); this.setData({ mode: "create", form: { points: 30, mode: "线上回答", ...draft } }); }); },
  editForm(event) { this.setData({ [`form.${event.currentTarget.dataset.field}`]: event.detail.value }); },
  chooseMode(event) { this.setData({ "form.mode": event.currentTarget.dataset.value }); },
  choosePoints(event) { this.setData({ "form.points": Number(event.currentTarget.dataset.value) }); },
  saveCaseDraft() { this.run(() => { store.saveDraft("create", this.data.form); wx.showToast({ title: "草稿已保存到本机" }); }); },
  submitCase() { this.run(() => { const item = store.createCase(this.data.form); wx.redirectTo({ url: `/pages/community-bounty/index?id=${item.id}` }); }); },
  backToList() { this.caseId = null; this.setData({ mode: "list" }); this.refresh(); },
  inputAnswer(event) { this.setData({ [`response.${event.currentTarget.dataset.field}`]: event.detail.value }); },
  saveAnswerDraft() { this.run(() => { store.saveDraft(this.caseId, this.data.response); wx.showToast({ title: "草稿已保存到本机" }); }); },
  submitAnswer() { this.run(() => { store.answerCase(this.caseId, this.data.response); this.refresh(); wx.showToast({ title: "体验回答已保存" }); }); },
  joinCocreate() { this.run(() => { store.joinCase(this.caseId); this.refresh(); wx.showToast({ title: "已登记本机共创" }); }); },
  approve() { this.run(() => { store.approveCase(this.caseId); this.refresh(); }); },
  sampleAnswer() { this.run(() => { store.addSampleResponse(this.caseId); this.refresh(); }); },
  setAllocation(event) { this.setData({ [`allocation.${event.currentTarget.dataset.id}`]: event.detail.value }); },
  closeCase() {
    wx.showModal({ title: "确认体验结案", content: "只记录本机模拟分配，不改变正式积分；本次体验结案后不可修改。", success: (result) => {
      if (result.confirm) this.run(() => { store.closeCase(this.caseId, this.data.item.responses.map((answer) => ({ id: answer.id, points: Number(this.data.allocation[answer.id] || 0) }))); this.refresh(); });
    } });
  },
});
