const { getLevel, applyReward, applyRedemption } = require("./growth-model.js");
const { MONTHLY_PRICE, PRICING_PLANS, createMembership, membershipSnapshot, extendMembership } = require("./membership-model.js");

const PROFILE_KEY = "guanlan_member_profile_v1";
const HISTORY_KEY = "guanlan_browse_history_v1";
const FOLLOW_KEY = "guanlan_follow_topics_v1";
const WALLET_KEY = "guanlan_growth_wallet_v1";
const TASK_KEY = "guanlan_daily_tasks_v1";
const BENEFIT_KEY = "guanlan_redeemed_benefits_v1";
const MEMBERSHIP_KEY = "guanlan_membership_v1";
const INVITE_REWARD_SYNC_KEY = "guanlan_invite_reward_synced_v1";

const TASKS = [
  { id: "checkin", title: "每日签到", target: 1, reward: 5, unit: "次" },
  { id: "browse", title: "每日阅读 5 条情报", target: 5, reward: 2, unit: "条" },
  { id: "favorite", title: "收藏 1 条情报", target: 1, reward: 3, unit: "条" },
];

const BENEFITS = [
  { id: "membership_7d", title: "7 天会员权益", description: "全部栏目浏览权益顺延 7 天", cost: 300, days: 7, repeatable: true },
  { id: "membership_30d", title: "30 天会员权益", description: "全部栏目浏览权益顺延 30 天", cost: 1000, days: 30, repeatable: true },
];

const MEMBER_RIGHTS = ["融资情报完整浏览", "生态图谱主体档案", "商业观察周报月报", "收藏与浏览记录"];

function nowLabel() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dateKey() {
  return nowLabel().slice(0, 10);
}

function normalizeTaskState(value = {}) {
  return {
    ...value,
    checkin: Array.isArray(value.checkin) ? value.checkin : [],
    browse: Array.isArray(value.browse) ? value.browse : [],
    favorite: Array.isArray(value.favorite) ? value.favorite : [],
    awarded: Array.isArray(value.awarded) ? value.awarded : [],
  };
}

function getProfile() {
  const value = wx.getStorageSync(PROFILE_KEY) || {};
  return {
    nickname: "观澜用户",
    avatarUrl: "/assets/brand/app-icon-light.svg",
    phoneMasked: "",
    phonePending: false,
    ...value,
  };
}

function saveProfile(input) {
  const current = getProfile();
  const nickname = String(input.nickname || current.nickname || "观澜用户").trim().slice(0, 20) || "观澜用户";
  const next = { ...current, ...input, nickname };
  wx.setStorageSync(PROFILE_KEY, next);
  return next;
}

function getProfileCompletion(profile = getProfile()) {
  return (profile.avatarUrl ? 30 : 0) + (profile.nickname ? 30 : 0) + (profile.phoneMasked ? 40 : 0);
}

function getHistory() {
  const value = wx.getStorageSync(HISTORY_KEY);
  return Array.isArray(value) ? value : [];
}

function recordBrowse(id) {
  if (!id) return { awarded: 0 };
  const current = getHistory().filter((item) => item.id !== id);
  wx.setStorageSync(HISTORY_KEY, [{ id, viewedAt: nowLabel() }, ...current].slice(0, 100));
  return recordBehavior("browse", id);
}

function clearHistory() {
  wx.removeStorageSync(HISTORY_KEY);
}

function getFollowIds() {
  const value = wx.getStorageSync(FOLLOW_KEY);
  return Array.isArray(value) ? value : [];
}

function toggleFollow(id) {
  const current = getFollowIds();
  const following = !current.includes(id);
  const next = following ? [...current, id] : current.filter((item) => item !== id);
  wx.setStorageSync(FOLLOW_KEY, next);
  const reward = following ? recordBehavior("follow", id) : { awarded: 0 };
  return { following, ids: next, ...reward };
}

function getWallet() {
  const value = wx.getStorageSync(WALLET_KEY);
  if (value && typeof value.balance === "number" && Array.isArray(value.ledger)) {
    const ledger = value.ledger.map((item) =>
      item.id === "experience_starter" ? { ...item, label: "新用户积分" } : item
    );
    const wallet = { ...value, ledger };
    wx.setStorageSync(WALLET_KEY, wallet);
    return wallet;
  }
  const createdAt = nowLabel();
  const initial = {
    balance: 128,
    lifetime: 128,
    ledger: [{ id: "experience_starter", label: "新用户积分", points: 128, type: "earn", createdAt }],
  };
  wx.setStorageSync(WALLET_KEY, initial);
  return initial;
}

function saveWallet(wallet) {
  wx.setStorageSync(WALLET_KEY, wallet);
  return wallet;
}

function syncInviteRewards(totalPoints) {
  const confirmed = Math.max(0, Number(totalPoints) || 0);
  const synced = Math.max(0, Number(wx.getStorageSync(INVITE_REWARD_SYNC_KEY)) || 0);
  if (confirmed <= synced) return { awarded: 0, wallet: getWallet() };
  const awarded = confirmed - synced;
  const wallet = applyReward(getWallet(), awarded, "邀请好友奖励", nowLabel(), `invite_reward_${confirmed}`);
  saveWallet(wallet);
  wx.setStorageSync(INVITE_REWARD_SYNC_KEY, confirmed);
  return { awarded, wallet };
}

function getMembership() {
  const value = wx.getStorageSync(MEMBERSHIP_KEY);
  const membership = value && value.trialEndsAt ? value : createMembership();
  if (!value || !value.trialEndsAt) wx.setStorageSync(MEMBERSHIP_KEY, membership);
  return membershipSnapshot(membership);
}

function saveMembership(membership) {
  wx.setStorageSync(MEMBERSHIP_KEY, membership);
  return membershipSnapshot(membership);
}

function syncMembership(membership) {
  if (!membership || !membership.trialEndsAt) return getMembership();
  const current = getMembership();
  const laterIso = (left, right) => {
    const leftTime = Date.parse(left || "") || 0;
    const rightTime = Date.parse(right || "") || 0;
    return leftTime >= rightTime ? (left || "") : (right || "");
  };
  return saveMembership({
    trialStartedAt: current.trialStartedAt || membership.trialStartedAt,
    trialEndsAt: laterIso(current.trialEndsAt, membership.trialEndsAt),
    memberEndsAt: laterIso(current.memberEndsAt, membership.memberEndsAt),
  });
}

function getTodayState() {
  const all = wx.getStorageSync(TASK_KEY) || {};
  return normalizeTaskState(all[dateKey()]);
}

function getTaskProgress() {
  const state = getTodayState();
  return TASKS.map((task) => ({
    ...task,
    current: Math.min(task.target, (state[task.id] || []).length),
    completed: state.awarded.includes(task.id),
  }));
}

function recordBehavior(type, subjectId) {
  const task = TASKS.find((item) => item.id === type);
  if (!task || !subjectId) return { awarded: 0 };
  const day = dateKey();
  const all = wx.getStorageSync(TASK_KEY) || {};
  const state = normalizeTaskState(all[day]);
  if (!state[type].includes(subjectId)) state[type].push(subjectId);
  let awarded = 0;
  if (state[type].length >= task.target && !state.awarded.includes(type)) {
    state.awarded.push(type);
    awarded = task.reward;
    const wallet = applyReward(getWallet(), task.reward, `完成任务：${task.title}`, nowLabel(), `${day}_${type}`);
    saveWallet(wallet);
  }
  all[day] = state;
  wx.setStorageSync(TASK_KEY, all);
  return { awarded, taskId: type };
}

function getRedeemedBenefitIds() {
  const value = wx.getStorageSync(BENEFIT_KEY);
  return Array.isArray(value) ? value : [];
}

function redeemBenefit(id) {
  const benefit = BENEFITS.find((item) => item.id === id);
  if (!benefit) return { ok: false, reason: "权益不存在" };
  const redeemed = getRedeemedBenefitIds();
  if (!benefit.repeatable && redeemed.includes(id)) return { ok: false, reason: "该权益已兑换" };
  const previousWallet = getWallet();
  const previousMembership = getMembership();
  const transactionId = `redeem_${id}_${Date.now()}`;
  const result = applyRedemption(previousWallet, benefit.cost, `兑换权益：${benefit.title}`, nowLabel(), transactionId);
  if (!result.ok) return result;
  const nextMembership = benefit.days ? extendMembership(previousMembership, benefit.days) : previousMembership;
  try {
    saveWallet(result.wallet);
    saveMembership(nextMembership);
    if (!benefit.repeatable) wx.setStorageSync(BENEFIT_KEY, [...redeemed, id]);
    return { ok: true, transactionId, benefit, wallet: result.wallet, membership: membershipSnapshot(nextMembership) };
  } catch (error) {
    wx.setStorageSync(WALLET_KEY, previousWallet);
    wx.setStorageSync(MEMBERSHIP_KEY, previousMembership);
    return { ok: false, reason: "兑换未完成，请重试" };
  }
}

function getGrowthSnapshot() {
  const wallet = getWallet();
  const tasks = getTaskProgress();
  const redeemed = getRedeemedBenefitIds();
  const allTaskState = wx.getStorageSync(TASK_KEY) || {};
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - 6);
  const weeklyCompleted = Math.min(5, Object.entries(allTaskState).reduce((sum, [day, state]) => {
    const parsed = new Date(`${day}T00:00:00`);
    return parsed >= start ? sum + (Array.isArray(state.awarded) ? state.awarded.length : 0) : sum;
  }, 0));
  return {
    wallet,
    level: getLevel(wallet.lifetime),
    tasks,
    completedToday: tasks.filter((item) => item.completed).length,
    weeklyCompleted,
    membership: getMembership(),
    benefits: BENEFITS.map((item) => ({ ...item, redeemed: !item.repeatable && redeemed.includes(item.id), affordable: wallet.balance >= item.cost })),
  };
}

module.exports = {
  TASKS,
  BENEFITS,
  MEMBER_RIGHTS,
  MONTHLY_PRICE,
  PRICING_PLANS,
  getProfile,
  saveProfile,
  getProfileCompletion,
  getHistory,
  recordBrowse,
  clearHistory,
  getFollowIds,
  toggleFollow,
  getWallet,
  getMembership,
  syncMembership,
  syncInviteRewards,
  getTaskProgress,
  recordBehavior,
  redeemBenefit,
  getGrowthSnapshot,
};
