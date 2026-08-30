const { isExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");
const store = require("../../utils/community-case-store.js");

Page({
  data: { mode: "list", experience: false, activeFilter: "全部", filters: ["全部", "进行中", "待结案", "已结案", "我的"], bounties: [], item: null, form: {}, response: {}, allocation: {}, own: false, participating: false, error: "", busy: false, selfId: null, activeCount: 0, approvedResponses: [] },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    this.caseId = options.id;
    this.setData({ experience: isExperience() });
    this.refresh();
  },
  onShow() { if (this.loaded && !this.data.busy) this.refresh(); },
  async run(action) {
    if (this.data.busy) return;
    this.setData({ busy: true, error: "" });
    try { await action(); }
    catch (error) {
      this.setData({ error: error.message });
      if (error.status === 401 || error.status === 403 || error.statusCode === 401 || error.statusCode === 403) this.setData({ item: null, bounties: [], response: {}, form: {}, own: false, approvedResponses: [] });
      wx.showToast({ title: error.message, icon: "none" });
    }
    finally { this.setData({ busy: false }); }
  },
  refresh() { return this.run(() => this.load()); },
  async load() {
    const preview = this.data.experience;
    const result = preview ? { items: store.listCases(), selfId: store.SELF } : await communityRequest(this.caseId ? "cases/" + encodeURIComponent(this.caseId) : "cases");
    this.setData({ selfId: result.selfId });
    if (this.caseId) {
      const item = preview ? result.items.find((entry) => entry.id === this.caseId) : result.item;
      if (!item) throw new Error("未找到此悬赏令");
      const draft = preview ? store.getDraft(item.id) : (await communityRequest("drafts/" + item.id)).draft;
      const mine = (item.responses || []).find((entry) => entry.id === result.selfId) || {};
      this.setData({ mode: "detail", item: { ...item, founderInitial: item.founder.slice(0, 1) }, own: preview ? item.owner === store.SELF : item.own,
        response: { ...mine, ...draft }, approvedResponses: (item.responses || []).filter((entry) => preview || entry.status === "approved"),
        participating: preview ? (item.joined || []).includes(store.SELF) : item.participating });
    } else {
      const all = result.items;
      const filter = this.data.activeFilter;
      const filtered = all.filter((item) => filter === "全部" || (filter === "我的" ? item.own || item.owner === result.selfId || item.participating || (item.responses || []).some((answer) => answer.id === result.selfId) : item.status === filter));
      this.setData({ bounties: filtered, activeCount: all.filter((item) => item.status === "进行中").length });
    }
    this.loaded = true;
  },
  switchFilter(event) { this.setData({ activeFilter: event.currentTarget.dataset.value }); this.refresh(); },
  openCase(event) { wx.navigateTo({ url: "/pages/community-bounty/index?id=" + event.currentTarget.dataset.id }); },
  createCase() { this.run(async () => {
    const draft = this.data.experience ? store.getDraft("create") : (await communityRequest("drafts/create")).draft;
    this.setData({ mode: "create", form: { points: 30, mode: "线上回答", requestKey: "case-" + Date.now() + "-" + Math.random().toString(36).slice(2), ...draft } });
  }); },
  editForm(event) { this.setData({ ["form." + event.currentTarget.dataset.field]: event.detail.value }); },
  chooseMode(event) { this.setData({ "form.mode": event.currentTarget.dataset.value }); },
  choosePoints(event) { this.setData({ "form.points": Number(event.currentTarget.dataset.value) }); },
  saveCaseDraft() { this.run(async () => {
    if (this.data.experience) store.saveDraft("create", this.data.form);
    else await communityRequest("drafts/create", { method: "PUT", data: this.data.form });
    wx.showToast({ title: "草稿已保存" });
  }); },
  submitCase() { this.run(async () => {
    const item = this.data.experience ? store.createCase(this.data.form) : (await communityRequest("cases", { method: "POST", data: this.data.form })).item;
    wx.redirectTo({ url: "/pages/community-bounty/index?id=" + item.id });
  }); },
  backToList() { this.caseId = null; this.setData({ mode: "list" }); this.refresh(); },
  inputAnswer(event) { this.setData({ ["response." + event.currentTarget.dataset.field]: event.detail.value }); },
  answerFields() { return Object.fromEntries(["judgement", "reason", "steps", "help"].map((key) => [key, this.data.response[key] || ""])); },
  saveAnswerDraft() { this.run(async () => {
    const data = this.answerFields();
    if (this.data.experience) store.saveDraft(this.caseId, data);
    else await communityRequest("drafts/" + this.caseId, { method: "PUT", data });
    wx.showToast({ title: "草稿已保存" });
  }); },
  submitAnswer() { this.run(async () => {
    if (this.data.experience) store.answerCase(this.caseId, this.answerFields());
    else await communityRequest("cases/" + this.caseId + "/answer", { method: "POST", data: this.answerFields() });
    await this.load(); wx.showToast({ title: this.data.experience ? "体验回答已保存" : "回答已提交审核" });
  }); },
  joinCocreate() { this.run(async () => {
    if (this.data.experience) store.joinCase(this.caseId);
    else await communityRequest("cases/" + this.caseId + "/join", { method: "POST", data: {} });
    await this.load(); wx.showToast({ title: "已登记参加共创" });
  }); },
  approve() { if (this.data.experience) this.run(async () => { store.approveCase(this.caseId); await this.load(); }); },
  sampleAnswer() { if (this.data.experience) this.run(async () => { store.addSampleResponse(this.caseId); await this.load(); }); },
  setAllocation(event) { this.setData({ ["allocation." + event.currentTarget.dataset.id]: event.detail.value }); },
  closeCase() {
    wx.showModal({ title: "确认分配并结案", content: this.data.experience ? "只记录本机模拟分配，不改变正式积分。" : "结案后积分记入回答者账户，分配不可重复提交或修改。", success: (result) => {
      if (result.confirm) this.run(async () => {
        const allocations = this.data.approvedResponses.map((answer) => ({ id: answer.id, points: Number(this.data.allocation[answer.id] || 0) }));
        if (this.data.experience) store.closeCase(this.caseId, allocations);
        else await communityRequest("cases/" + this.caseId + "/settle", { method: "POST", data: { allocations } });
        await this.load();
      });
    } });
  },
});
