const LEVELS = [
  { level: 1, name: "初识者", min: 0, next: 100 },
  { level: 2, name: "观察者", min: 100, next: 200 },
  { level: 3, name: "研究者", min: 200, next: 400 },
  { level: 4, name: "洞察者", min: 400, next: 700 },
  { level: 5, name: "共建者", min: 700, next: null },
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
