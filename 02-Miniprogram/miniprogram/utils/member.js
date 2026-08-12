const { getLevel, applyReward, applyRedemption } = require("./growth-model.js");

const PROFILE_KEY = "guanlan_member_profile_v1";
const HISTORY_KEY = "guanlan_browse_history_v1";
const FOLLOW_KEY = "guanlan_follow_topics_v1";
const WALLET_KEY = "guanlan_growth_wallet_v1";
const TASK_KEY = "guanlan_daily_tasks_v1";
const BENEFIT_KEY = "guanlan_redeemed_benefits_v1";

const TASKS = [
  { id: "browse", title: "每日阅读 5 条情报", target: 5, reward: 2, unit: "条" },
  { id: "favorite", title: "收藏 1 条情报", target: 1, reward: 3, unit: "条" },
  { id: "follow", title: "关注 1 个主题", target: 1, reward: 5, unit: "个" },
];

const BENEFITS = [
  { id: "advanced_filter", title: "高级筛选试用", description: "解锁 7 天高级筛选体验", cost: 150 },
  { id: "follow_limit", title: "关注上限扩容", description: "增加 10 个主题关注名额", cost: 200 },
  { id: "weekly_priority", title: "周报优先阅读", description: "连续 4 周提前阅读周报", cost: 300 },
];

function nowLabel() {
  const date = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function dateKey() {
  return nowLabel().slice(0, 10);
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
  if (value && typeof value.balance === "number" && Array.isArray(value.ledger)) return value;
  const createdAt = nowLabel();
  const initial = {
    balance: 128,
    lifetime: 128,
    ledger: [{ id: "experience_starter", label: "本地体验起始积分", points: 128, type: "earn", createdAt }],
  };
  wx.setStorageSync(WALLET_KEY, initial);
  return initial;
}

function saveWallet(wallet) {
  wx.setStorageSync(WALLET_KEY, wallet);
  return wallet;
}

function getTodayState() {
  const all = wx.getStorageSync(TASK_KEY) || {};
  return all[dateKey()] || { browse: [], favorite: [], follow: [], awarded: [] };
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
  const state = all[day] || { browse: [], favorite: [], follow: [], awarded: [] };
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
  if (redeemed.includes(id)) return { ok: false, reason: "该权益已兑换" };
  const result = applyRedemption(getWallet(), benefit.cost, `兑换权益：${benefit.title}`, nowLabel(), `redeem_${id}_${Date.now()}`);
  if (!result.ok) return result;
  saveWallet(result.wallet);
  wx.setStorageSync(BENEFIT_KEY, [...redeemed, id]);
  return { ok: true, benefit, wallet: result.wallet };
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
    benefits: BENEFITS.map((item) => ({ ...item, redeemed: redeemed.includes(item.id), affordable: wallet.balance >= item.cost })),
  };
}

module.exports = {
  TASKS,
  BENEFITS,
  getProfile,
  saveProfile,
  getProfileCompletion,
  getHistory,
  recordBrowse,
  clearHistory,
  getFollowIds,
  toggleFollow,
  getWallet,
  getTaskProgress,
  recordBehavior,
  redeemBenefit,
  getGrowthSnapshot,
};
