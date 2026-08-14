const LEVELS = [
  { level: 1, name: "初识者", min: 0, next: 300 },
  { level: 2, name: "观察者", min: 300, next: 1000 },
  { level: 3, name: "研究者", min: 1000, next: 2500 },
  { level: 4, name: "洞察者", min: 2500, next: 5000 },
  { level: 5, name: "实践者", min: 5000, next: 10000 },
  { level: 6, name: "共建者", min: 10000, next: 20000 },
  { level: 7, name: "引领者", min: 20000, next: 50000 },
  { level: 8, name: "领航者", min: 50000, next: null },
];

function getLevel(lifetimePoints) {
  const points = Math.max(0, Number(lifetimePoints) || 0);
  const current = [...LEVELS].reverse().find((item) => points >= item.min) || LEVELS[0];
  const span = current.next ? current.next - current.min : 1;
  const progress = current.next ? Math.min(100, Math.round(((points - current.min) / span) * 100)) : 100;
  return {
    ...current,
    progress,
    remaining: current.next ? Math.max(0, current.next - points) : 0,
  };
}

function applyReward(wallet, reward, label, createdAt, id) {
  const safeReward = Math.max(0, Number(reward) || 0);
  return {
    ...wallet,
    balance: wallet.balance + safeReward,
    lifetime: wallet.lifetime + safeReward,
    ledger: [{ id, label, points: safeReward, type: "earn", createdAt }, ...wallet.ledger],
  };
}

function applyRedemption(wallet, cost, label, createdAt, id) {
  const safeCost = Math.max(0, Number(cost) || 0);
  if (wallet.balance < safeCost) return { ok: false, reason: "积分不足", wallet };
  return {
    ok: true,
    wallet: {
      ...wallet,
      balance: wallet.balance - safeCost,
      ledger: [{ id, label, points: -safeCost, type: "spend", createdAt }, ...wallet.ledger],
    },
  };
}

module.exports = { LEVELS, getLevel, applyReward, applyRedemption };
