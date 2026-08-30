const { members, roles, getMember } = require("../../utils/community-data.js");
const { getCommunity, getCommunityProfile, saveCommunityProfile } = require("../../utils/member.js");
const { readExperience, saveExperience } = require("../../utils/experience.js");
const { requireCommunityMember } = require("../../utils/community-access.js");

const DEFAULT_PROFILE = {
  name: "", avatar: "", city: "", company: "", role: "",
  industry: "", ai: "", project: "", ability: "", need: "",
};

function decorateMember(member) {
  return { ...member, aiText: Array.isArray(member.ai) ? member.ai.join("、") : member.ai };
}

Page({
  data: { mode: "graph", tab: "map", roles: [], activeRole: 0, activeRoleData: null, members, filteredMembers: members, member: null, profile: DEFAULT_PROFILE, query: "", experience: false },
  onLoad(options = {}) {
    if (!requireCommunityMember()) return;
    this.setData({ experience: Boolean(readExperience()) });
    const mode = options.mode || "graph";
    if (mode === "member") return this.setData({ mode, member: decorateMember(getMember(options.id)) });
    if (mode === "profile" || mode === "edit") return this.loadProfile(mode);
    const roleData = roles.map((role) => ({ ...role, count: role.memberIds.length, members: role.memberIds.map((id) => decorateMember(getMember(id))) }));
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
    if (this.data.mode === "profile") this.loadProfile("profile");
    if (this.data.mode === "graph") {
      const preview = readExperience();
      const own = preview ? preview.profile : getCommunityProfile();
      const rows = own.name ? [{ ...own, id: "my-profile", avatar: own.name.slice(0, 1) }, ...members] : members;
      this.setData({ members: rows, filteredMembers: rows, query: "" });
    }
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
  updateField(event) { this.setData({ [`profile.${event.currentTarget.dataset.field}`]: event.detail.value }); },
  saveProfile() {
    const profile = Object.fromEntries(Object.entries(this.data.profile).map(([key, value]) => [key, String(value || "").trim()]));
    if (!profile.name || !profile.city || !profile.role || !profile.industry || !profile.project) return wx.showToast({ title: "请完成必填公开资料", icon: "none" });
    profile.avatar = profile.avatar || profile.name.slice(0, 1);
    const preview = readExperience();
    if (preview) { preview.profile = profile; saveExperience(preview); }
    else saveCommunityProfile(profile);
    wx.showToast({ title: "档案已保存", icon: "success" });
    setTimeout(() => wx.redirectTo({ url: "/pages/community-graph/index?mode=profile" }), 450);
  },
});
