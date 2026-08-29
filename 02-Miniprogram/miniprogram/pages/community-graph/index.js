const { members, roles, getMember } = require("../../utils/community-data.js");
const { getCommunity, getCommunityProfile, saveCommunityProfile } = require("../../utils/member.js");

const DEFAULT_PROFILE = {
  name: "老方", avatar: "方", city: "上海", company: "星翼", role: "Founder / 创业者",
  industry: "金融、教育、游戏", ai: "Agent、AI 应用", project: "金融行业流量与增长；AI 矩阵号，金融与大健康。",
  ability: "Agent 应用、流量增长、团队打造；矩阵号运营与大数据精准营销。",
  need: "寻找垂直行业的小场景创业机会，聚焦金融和大健康；希望连接金融机构相关创业者。",
};

function decorateMember(member) {
  return { ...member, aiText: Array.isArray(member.ai) ? member.ai.join("、") : member.ai };
}

Page({
  data: { mode: "graph", tab: "map", roles: [], activeRole: 0, activeRoleData: null, members, filteredMembers: members, member: null, profile: DEFAULT_PROFILE, query: "" },
  onLoad(options) {
    const mode = options.mode || "graph";
    if (mode === "member") return this.setData({ mode, member: decorateMember(getMember(options.id)) });
    if (mode === "profile" || mode === "edit") return this.loadProfile(mode);
    const roleData = roles.map((role) => ({ ...role, members: role.memberIds.map((id) => decorateMember(getMember(id))) }));
    this.setData({ mode: "graph", tab: options.tab === "directory" ? "directory" : "map", roles: roleData, activeRoleData: roleData[0] });
  },
  loadProfile(mode) {
    const stored = getCommunityProfile();
    const community = getCommunity();
    const profile = { ...DEFAULT_PROFILE, ...stored };
    if (!stored.name && community.name) profile.name = community.name;
    profile.avatar = profile.avatar || profile.name.slice(0, 1);
    this.setData({ mode, profile });
  },
  switchTab(event) { this.setData({ tab: event.currentTarget.dataset.tab }); },
  selectRole(event) {
    const activeRole = Number(event.currentTarget.dataset.index);
    this.setData({ activeRole, activeRoleData: this.data.roles[activeRole] });
  },
  search(event) {
    const query = event.detail.value.trim().toLowerCase();
    const filteredMembers = !query ? members : members.filter((item) => [item.name, item.city, item.company, item.role, item.industry].join(" ").toLowerCase().includes(query));
    this.setData({ query, filteredMembers });
  },
  openMember(event) { wx.navigateTo({ url: `/pages/community-graph/index?mode=member&id=${event.currentTarget.dataset.id}` }); },
  openProfile() { wx.navigateTo({ url: "/pages/community-graph/index?mode=profile" }); },
  editProfile() { wx.navigateTo({ url: "/pages/community-graph/index?mode=edit" }); },
  updateField(event) { this.setData({ [`profile.${event.currentTarget.dataset.field}`]: event.detail.value }); },
  saveProfile() {
    const profile = Object.fromEntries(Object.entries(this.data.profile).map(([key, value]) => [key, String(value || "").trim()]));
    if (!profile.name || !profile.city || !profile.role || !profile.industry || !profile.project) return wx.showToast({ title: "请完成必填公开资料", icon: "none" });
    profile.avatar = profile.avatar || profile.name.slice(0, 1);
    saveCommunityProfile(profile);
    wx.showToast({ title: "档案已保存", icon: "success" });
    setTimeout(() => wx.redirectTo({ url: "/pages/community-graph/index?mode=profile" }), 450);
  },
});
