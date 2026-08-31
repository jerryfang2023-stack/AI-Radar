const { members, roles, getMember } = require("../../utils/community-data.js");
const { getCommunity, getCommunityProfile, saveCommunityProfile } = require("../../utils/member.js");
const { readExperience, saveExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");
const { communityRequest } = require("../../utils/payment.js");
const { readCommunityPage } = require("../../utils/community-loading.js");

const DEFAULT_PROFILE = {
  name: "", avatar: "", city: "", company: "", role: "",
  industry: "", ai: "", project: "", ability: "", need: "",
};

function decorateMember(member) {
  return { ...member, aiText: Array.isArray(member.ai) ? member.ai.join("、") : member.ai, aiList: Array.isArray(member.ai) ? member.ai : String(member.ai || "").split(/[、,，]/).filter(Boolean) };
}

Page({
  data: { mode: "graph", tab: "map", roles: [], activeRole: 0, activeRoleData: null, members: [], filteredMembers: [], member: null, profile: DEFAULT_PROFILE, query: "", experience: false, loading: false, error: "", saving: false, supply: [] },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    this.setData({ experience: Boolean(readExperience()) });
    const mode = options.mode || "graph";
    this.options = options;
    if (!readExperience()) {
      this.setData({ mode, tab: options.tab === "directory" ? "directory" : "map" });
      return this.refresh();
    }
    if (mode === "member") return this.setData({ mode, member: decorateMember(getMember(options.id)) });
    if (mode === "profile" || mode === "edit") return this.loadProfile(mode);
    const roleData = roles.map((role) => ({ ...role, count: role.memberIds.length, members: role.memberIds.map((id) => decorateMember(getMember(id))) })).sort((a, b) => b.count - a.count);
    this.setData({ mode: "graph", tab: options.tab === "directory" ? "directory" : "map", roles: roleData, activeRoleData: roleData[0] });
  },
  loadProfile(mode) {
    const preview = readExperience();
    const stored = preview ? preview.profile : getCommunityProfile();
    const community = preview ? { name: "体验用户" } : getCommunity();
    const profile = { ...DEFAULT_PROFILE, ...stored };
    if (!stored.name && community.name) profile.name = community.name;
    profile.avatar = profile.avatar || profile.name.slice(0, 1);
    this.setData({ mode, profile });
  },
  onShow() {
    if (!readExperience()) { if (this.options && !this.data.loading && this.data.mode !== "edit") this.refresh(); return; }
    if (this.data.mode === "profile") this.loadProfile("profile");
    if (this.data.mode === "graph") {
      const preview = readExperience();
      const own = preview ? preview.profile : getCommunityProfile();
      const rows = own.name ? [{ ...own, id: "my-profile", avatar: own.name.slice(0, 1) }, ...members] : members;
      this.setData({ members: rows, filteredMembers: rows, query: "" });
    }
  },
  applyDirectory(result) {
    const member = this.data.mode === "member" ? result.members.find((entry) => String(entry.id) === String(this.options.id)) : null;
    if (this.data.mode === "member" && !member) throw new Error("此成员资料暂不可见");
    const roles = [...result.roles].sort((a, b) => b.count - a.count);
    const selected = this.data.activeRoleData?.name;
    const activeRole = Math.max(0, roles.findIndex((role) => role.name === selected));
    const count = (names) => roles.filter((role) => names.includes(role.name)).reduce((sum, role) => sum + role.count, 0);
    const supply = [{ name: "场景 / 市场", count: count(["行业资源方", "流量与增长", "出海与跨境"]) }, { name: "企业服务", count: count(["企业服务落地"]) }, { name: "技术构建", count: count(["技术构建者"]) }, { name: "资本 / 研究", count: count(["资本与研究"]) }];
    this.setData({ ...result, roles, activeRole, member: member ? decorateMember(member) : null, filteredMembers: result.members, activeRoleData: roles[activeRole] || null, supply, loaded: true, showLoading: false });
    this.search({ detail: { value: this.data.query } });
  },
  refresh() {
    return readCommunityPage(this, async () => {
      if (this.data.mode === "member" && !this.options?.id) throw new Error("成员链接无效，请返回通讯录重新打开");
      if (this.data.mode === "profile" || this.data.mode === "edit") {
        const result = await communityRequest("profile");
        this.setData({ profile: result.profile });
      } else {
        this.applyDirectory(await communityRequest("directory", { onCached: (result) => this.applyDirectory(result) }));
      }
    }, () => this.setData({ member: null, members: [], filteredMembers: [], roles: [], activeRoleData: null, supply: [], profile: { ...DEFAULT_PROFILE } }));
  },
  switchTab(event) { this.setData({ tab: event.currentTarget.dataset.tab }); },
  selectRole(event) {
    const activeRole = Number(event.currentTarget.dataset.index);
    this.setData({ activeRole, activeRoleData: this.data.roles[activeRole] });
  },
  search(event) {
    const query = event.detail.value.trim().toLowerCase();
    const filteredMembers = !query ? this.data.members : this.data.members.filter((item) => [item.name, item.city, item.company, item.role, item.industry].join(" ").toLowerCase().includes(query));
    this.setData({ query, filteredMembers });
  },
  openMember(event) { if (event.currentTarget.dataset.id === "my-profile") return this.openProfile(); wx.navigateTo({ url: `/pages/community-graph/index?mode=member&id=${event.currentTarget.dataset.id}` }); },
  openProfile() { wx.navigateTo({ url: "/pages/community-graph/index?mode=profile" }); },
  editProfile() { wx.navigateTo({ url: "/pages/community-graph/index?mode=edit" }); },
  openEvidence() {
    const evidence = (this.data.mode === "member" ? this.data.member : this.data.profile)?.roleEvidence;
    if (!evidence) return;
    wx.navigateTo({ url: `/pages/community-program/index?type=speaker&id=${encodeURIComponent(evidence.archiveId)}&speaker=${evidence.speakerIndex}` });
  },
  updateField(event) { this.setData({ [`profile.${event.currentTarget.dataset.field}`]: event.detail.value }); },
  async saveProfile() {
    if (this.data.saving) return;
    const profile = Object.fromEntries(Object.entries(this.data.profile).map(([key, value]) => [key, String(value || "").trim()]));
    if (!profile.name || !profile.city || !profile.role || !profile.industry || !profile.project) return wx.showToast({ title: "请完成必填公开资料", icon: "none" });
    profile.avatar = profile.avatar || profile.name.slice(0, 1);
    const preview = readExperience();
    if (preview) { preview.profile = profile; saveExperience(preview); }
    else {
      this.setData({ saving: true, error: "" });
      try {
        const fields = ["name", "city", "company", "role", "industry", "ai", "project", "ability", "need"];
        const data = Object.fromEntries(fields.map((field) => [field, profile[field] || ""]));
        const result = await communityRequest("profile", { method: "PUT", data: { ...data, revision: this.data.profile.revision } });
        saveCommunityProfile(result.profile);
      } catch (error) { this.setData({ error: error.message }); return; }
      finally { this.setData({ saving: false }); }
    }
    wx.showToast({ title: "档案已保存", icon: "success" });
    setTimeout(() => wx.redirectTo({ url: "/pages/community-graph/index?mode=profile" }), 450);
  },
});
