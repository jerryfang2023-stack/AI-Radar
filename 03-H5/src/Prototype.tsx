import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeftIcon,
  BarChartIcon,
  BookmarkFilledIcon,
  BookmarkIcon,
  CheckCircledIcon,
  ChevronRightIcon,
  ClockIcon,
  Cross1Icon,
  EyeOpenIcon,
  GearIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  PersonIcon,
  ReaderIcon,
  Share1Icon,
  StarFilledIcon,
  StarIcon,
} from "@radix-ui/react-icons";
import { BottomSheet, KeyboardInput, MobileScroll, useKeyboard } from "./mobile";

type FundingCard = {
  id: string;
  company: string;
  initial: string;
  summary: string;
  categoryId: string;
  category: string;
  subcategory: string;
  productForm: string;
  products: string[];
  round: string;
  roundGroup: string;
  amount: string;
  amountValue: number;
  date: string;
  leadInvestor: string;
  investorsText: string;
  headquarters: string;
  region: string;
  evidenceLabel: string;
  sourceCount: number;
};

type FundingDetail = FundingCard & {
  companySummary: string;
  website: string;
  founders: Array<{ id?: string; name: string; role: string }>;
  cumulativeAmount: string;
  investors: Array<{ name: string; role: string }>;
  signals: string[];
  risks: string[];
  capitalJudgment: string;
  history: Array<{ round: string; amount: string; date: string; current: boolean }>;
  sources: Array<{ id: string; title: string; publisher: string; url: string; quotes: string[] }>;
};

type ReportSummary = {
  id: string;
  type: "weekly" | "monthly";
  typeLabel: string;
  title: string;
  date: string;
  dateShort: string;
  issue: string;
  window: string;
  summary: string;
  counts: { signals: number; opinions: number; community: number } | null;
  sectionCount: number;
};

type ReportDetail = ReportSummary & { blocks: Array<{ id: string; type: string; text: string }> };
type FundingIndex = {
  meta: { cardCount: number; latestDate: string; multiSourceRate: number; disclosedAmountCount: number };
  categories: Array<{ id: string; name: string; count: number }>;
  cards: FundingCard[];
};
type EntityRound = { id: string; company?: string; date: string; round: string; amount: string; role?: string };
type CompanyEntity = {
  key: string;
  name: string;
  initial: string;
  summary: string;
  headquarters: string;
  products: string[];
  categories: string[];
  investors: string[];
  founders: Array<{ id?: string; name: string; role: string }>;
  rounds: EntityRound[];
  roundCount: number;
  investorCount: number;
  founderCount: number;
  latest: FundingCard;
  searchText: string;
};
type InvestorEntity = {
  key: string;
  name: string;
  initial: string;
  companies: string[];
  categories: string[];
  rounds: EntityRound[];
  roundCount: number;
  leadCount: number;
  companyCount: number;
  latest: FundingCard;
  searchText: string;
};
type PersonEntity = {
  key: string;
  name: string;
  initial: string;
  roles: string[];
  companies: string[];
  categories: string[];
  rounds: EntityRound[];
  roundCount: number;
  companyCount: number;
  latest: FundingCard;
  searchText: string;
};
type EntityType = "companies" | "investors" | "people";
type EntityLibrary = { companies: CompanyEntity[]; investors: InvestorEntity[]; people: PersonEntity[] };
type ReportIndex = { meta: { weeklyCount: number; monthlyCount: number }; reports: ReportSummary[] };
type Tab = "terminal" | "market" | "observe" | "profile";
type View =
  | { kind: "tab"; tab: Tab }
  | { kind: "funding"; id: string; returnTo?: { kind: "entity"; entityType: EntityType; key: string } }
  | { kind: "report"; id: string }
  | { kind: "saved" }
  | { kind: "history" }
  | { kind: "follows" }
  | { kind: "growth" }
  | { kind: "membership" }
  | { kind: "invite" }
  | { kind: "profile-edit" }
  | { kind: "compare" }
  | { kind: "entity"; entityType: EntityType; key: string };

type GrowthState = {
  balance: number;
  lifetime: number;
  completed: string[];
  browseIds: string[];
  redeemed: string[];
  ledger: Array<{ id: string; label: string; points: number; date: string }>;
};

const BENEFITS = [
  { id: "membership_7d", title: "7 天会员权益", description: "全部栏目浏览权益顺延 7 天", cost: 300, days: 7 },
  { id: "membership_30d", title: "30 天会员权益", description: "全部栏目浏览权益顺延 30 天", cost: 1000, days: 30 },
];

const MEMBER_RIGHTS = ["融资情报完整浏览", "生态图谱主体档案", "商业观察周报月报", "收藏、关注与浏览记录"];
const PRICING_PLANS = [
  { id: "monthly", title: "月度会员", price: 30, unit: "月" },
  { id: "half-year", title: "半年会员", price: 168, unit: "6 个月", badge: "省 12 元" },
  { id: "annual", title: "年度会员", price: 300, unit: "年", badge: "省 60 元" },
];
const DAY_MS = 24 * 60 * 60 * 1000;
type MembershipState = { trialStartedAt: string; trialEndsAt: string; memberEndsAt: string };

const STORE = {
  favorites: "guanlan_h5_favorites_v1",
  history: "guanlan_h5_history_v1",
  follows: "guanlan_h5_follows_v1",
  growth: "guanlan_h5_growth_v1",
  profile: "guanlan_h5_profile_v1",
  membership: "guanlan_h5_membership_v1",
};

function readLocal<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function dateLabel() {
  return new Intl.DateTimeFormat("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).format(new Date());
}

function createMembership(now = Date.now()): MembershipState {
  return { trialStartedAt: new Date(now).toISOString(), trialEndsAt: new Date(now + 7 * DAY_MS).toISOString(), memberEndsAt: "" };
}

function membershipFor(value: MembershipState, now = Date.now()) {
  const trialEnd = Date.parse(value.trialEndsAt || "") || 0;
  const memberEnd = Date.parse(value.memberEndsAt || "") || 0;
  const isMember = memberEnd > now;
  const isTrial = !isMember && trialEnd > now;
  const activeUntil = isMember ? memberEnd : isTrial ? trialEnd : Math.max(trialEnd, memberEnd);
  return { ...value, status: isMember ? "member" : isTrial ? "trial" : "expired", active: isMember || isTrial, statusLabel: isMember ? "观澜会员" : isTrial ? "7 天体验中" : "体验已结束", remainingDays: activeUntil > now ? Math.max(1, Math.ceil((activeUntil - now) / DAY_MS)) : 0, activeUntil: activeUntil ? new Date(activeUntil).toISOString().slice(0, 10) : "" };
}

function extendMembership(value: MembershipState, days: number, now = Date.now()): MembershipState {
  const start = Math.max(now, Date.parse(value.trialEndsAt || "") || now, Date.parse(value.memberEndsAt || "") || 0);
  return { ...value, memberEndsAt: new Date(start + days * DAY_MS).toISOString() };
}

function levelFor(points: number) {
  if (points >= 700) return { level: 5, name: "共建者", next: 700, progress: 100 };
  if (points >= 400) return { level: 4, name: "洞察者", next: 700, progress: Math.round(((points - 400) / 300) * 100) };
  if (points >= 200) return { level: 3, name: "研究者", next: 400, progress: Math.round(((points - 200) / 200) * 100) };
  if (points >= 100) return { level: 2, name: "观察者", next: 200, progress: points - 100 };
  return { level: 1, name: "初识者", next: 100, progress: points };
}

function publicAnalysisText(text: string) {
  return text
    .replace(/已验证的?信号/g, "关键进展")
    .replace(/判断的证据边界在于/g, "需要注意的是")
    .replace(/证据边界在于/g, "需要注意的是")
    .replace(/证据边界/g, "信息限制")
    .replace(/当前证据/g, "现有信息")
    .replace(/现有证据/g, "现有信息");
}

function isPublicReportBlock(block: ReportDetail["blocks"][number], index: number, blocks: ReportDetail["blocks"]) {
  const text = block.text.trim();
  if (/^(0\.\s*)?(数据边界|证据边界)/.test(text)) return false;
  if (index > 0 && /^(0\.\s*)?(数据边界|证据边界)/.test(blocks[index - 1].text.trim())) return false;
  if (/EVIDENCE_MANIFEST|事件 ID|观点 ID|社群 ID|V4 事实表|下游研究判断/.test(text)) return false;
  if (/^(观澜 AI|内容团队|社群运营)[：:]/.test(text)) return false;
  return true;
}

function publicReportText(text: string) {
  return publicAnalysisText(text)
    .replace(/证据完整性与弱趋势降级/g, "趋势观察")
    .replace(/趋势链\s*·\s*完整性\s*·\s*本月裁决\s*·\s*证据限制/g, "趋势 · 当前进展 · 后续关注")
    .replace(/证据链/g, "相关动态")
    .replace(/待验证信号/g, "后续关注")
    .replace(/验证清单/g, "关注清单");
}

function publicDateWindow(window: string) {
  return window.replace(/\s+to\s+/i, " 至 ");
}

function appendUnique(values: string[], value: string) {
  if (value && !values.includes(value)) values.push(value);
}

function companyEntityKey(name: string) {
  return name.trim().toLowerCase();
}

function investorEntityKey(name: string) {
  return name.trim().toLowerCase();
}

function personEntityKey(founder: { id?: string; name: string }, companyName: string) {
  return founder.id ? `id:${founder.id}` : `${founder.name.trim().toLowerCase()}|${companyEntityKey(companyName)}`;
}

function buildEntityLibrary(cards: FundingCard[], details: Record<string, FundingDetail>): EntityLibrary {
  const sortedCards = [...cards].sort((left, right) => right.date.localeCompare(left.date) || right.amountValue - left.amountValue);
  const companyMap = new Map<string, Omit<CompanyEntity, "searchText" | "roundCount" | "investorCount" | "founderCount">>();
  const investorMap = new Map<string, Omit<InvestorEntity, "searchText" | "roundCount" | "companyCount">>();
  const personMap = new Map<string, Omit<PersonEntity, "searchText" | "roundCount" | "companyCount">>();

  sortedCards.forEach((card) => {
    const detail = details[card.id];
    const companyKey = companyEntityKey(card.company);
    const company = companyMap.get(companyKey) || {
      key: companyKey, name: card.company, initial: card.initial,
      summary: detail?.companySummary || card.summary, headquarters: card.headquarters,
      products: [], categories: [], investors: [], founders: [], rounds: [], latest: card,
    };
    company.rounds.push({ id: card.id, date: card.date, round: card.round, amount: card.amount });
    (card.products || []).forEach((product) => appendUnique(company.products, product));
    appendUnique(company.products, card.productForm);
    appendUnique(company.categories, card.category);
    appendUnique(company.categories, card.subcategory);
    (detail?.investors || []).forEach((item) => appendUnique(company.investors, item.name));
    (detail?.founders || []).forEach((item) => {
      if (!company.founders.some((founder) => founder.name === item.name)) company.founders.push({ id: item.id || "", name: item.name, role: item.role || "创始团队" });
    });
    companyMap.set(companyKey, company);

    const investorRows = detail?.investors?.length ? detail.investors : card.leadInvestor && card.leadInvestor !== "投资方未披露" ? [{ name: card.leadInvestor, role: "" }] : [];
    const seenInvestors = new Set<string>();
    investorRows.forEach((item) => {
      const name = item.name.trim();
      const investorKey = investorEntityKey(name);
      if (!name || seenInvestors.has(investorKey)) return;
      seenInvestors.add(investorKey);
      const investor = investorMap.get(investorKey) || {
        key: investorKey, name, initial: name.slice(0, 1).toUpperCase(), companies: [], categories: [], rounds: [], leadCount: 0, latest: card,
      };
      investor.rounds.push({ id: card.id, company: card.company, date: card.date, round: card.round, amount: card.amount, role: item.role || "参投" });
      if (/领投|lead/i.test(item.role) || name === card.leadInvestor) investor.leadCount += 1;
      appendUnique(investor.companies, card.company);
      appendUnique(investor.categories, card.category);
      appendUnique(investor.categories, card.subcategory);
      investorMap.set(investorKey, investor);
    });

    (detail?.founders || []).forEach((founder) => {
      const name = founder.name.trim();
      const personKey = personEntityKey(founder, card.company);
      if (!name) return;
      const person = personMap.get(personKey) || {
        key: personKey, name, initial: name.slice(0, 1).toUpperCase(), roles: [], companies: [], categories: [], rounds: [], latest: card,
      };
      appendUnique(person.roles, founder.role || "创始团队");
      appendUnique(person.companies, card.company);
      appendUnique(person.categories, card.category);
      appendUnique(person.categories, card.subcategory);
      if (!person.rounds.some((roundItem) => roundItem.id === card.id)) person.rounds.push({ id: card.id, company: card.company, date: card.date, round: card.round, amount: card.amount });
      personMap.set(personKey, person);
    });
  });

  const companies: CompanyEntity[] = [...companyMap.values()].map((item) => ({
    ...item, roundCount: item.rounds.length, investorCount: item.investors.length, founderCount: item.founders.length,
    searchText: [item.name, item.summary, item.headquarters, ...item.products, ...item.categories].join(" ").toLowerCase(),
  })).sort((left, right) => right.latest.date.localeCompare(left.latest.date) || left.name.localeCompare(right.name, "zh-CN"));
  const investors: InvestorEntity[] = [...investorMap.values()].map((item) => ({
    ...item, roundCount: item.rounds.length, companyCount: item.companies.length,
    searchText: [item.name, ...item.companies, ...item.categories].join(" ").toLowerCase(),
  })).sort((left, right) => right.roundCount - left.roundCount || right.leadCount - left.leadCount || left.name.localeCompare(right.name, "zh-CN"));
  const people: PersonEntity[] = [...personMap.values()].map((item) => ({
    ...item, roundCount: item.rounds.length, companyCount: item.companies.length,
    searchText: [item.name, ...item.roles, ...item.companies, ...item.categories].join(" ").toLowerCase(),
  })).sort((left, right) => right.companyCount - left.companyCount || right.latest.date.localeCompare(left.latest.date) || left.name.localeCompare(right.name, "zh-CN"));
  return { companies, investors, people };
}

function AppHeader({ title, onBack, action, onAction, brand = true }: { title: string; onBack?: () => void; action?: string; onAction?: () => void; brand?: boolean }) {
  return (
    <header className="app-header">
      {onBack ? <button className="header-button back" onClick={onBack} aria-label="返回"><ArrowLeftIcon />返回</button> : brand ? <img src="/brand/logo-wavesight.svg" alt="观澜 AI" /> : <span className="header-spacer" />}
      <h1>{title}</h1>
      {action ? <button className="header-button action" onClick={onAction}>{action}</button> : <span className="header-spacer" />}
    </header>
  );
}

function SplashScreen({ onEnter }: { onEnter: () => void }) {
  return (
    <button className="splash-screen" type="button" onClick={onEnter} aria-label="进入观澜融资情报">
      <span className="splash-brand-stage">
        <img className="splash-logo" src="/brand/logo-wavesight.svg" alt="观澜 AI" />
        <strong className="splash-slogan">洞察趋势 · 智见未来</strong>
        <span className="splash-description">AI 融资情报与市场观察</span>
      </span>
    </button>
  );
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; label: string }> = [
    { id: "terminal", label: "融资" },
    { id: "market", label: "生态" },
    { id: "observe", label: "观察" },
    { id: "profile", label: "我的" },
  ];
  return <nav className="bottom-nav" aria-label="主栏目">{items.map((item) => <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onChange(item.id)}>{item.label}</button>)}</nav>;
}

export default function Prototype() {
  const keyboard = useKeyboard();
  const [fundingIndex, setFundingIndex] = useState<FundingIndex | null>(null);
  const [fundingDetails, setFundingDetails] = useState<Record<string, FundingDetail>>({});
  const [reportIndex, setReportIndex] = useState<ReportIndex | null>(null);
  const [reportDetails, setReportDetails] = useState<Record<string, ReportDetail>>({});
  const [view, setView] = useState<View>(() => typeof window !== "undefined" && new URLSearchParams(window.location.search).get("invite") === "1" ? { kind: "invite" } : { kind: "tab", tab: "terminal" });
  const [lastTab, setLastTab] = useState<Tab>("terminal");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [round, setRound] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [redeemTarget, setRedeemTarget] = useState("");
  const redemptionLock = useRef(false);
  const [reportType, setReportType] = useState<"weekly" | "monthly">("weekly");
  const [favorites, setFavorites] = useState<string[]>(() => readLocal(STORE.favorites, []));
  const [history, setHistory] = useState<string[]>(() => readLocal(STORE.history, []));
  const [follows, setFollows] = useState<string[]>(() => readLocal(STORE.follows, []));
  const [selected, setSelected] = useState<string[]>([]);
  const [nickname, setNickname] = useState(() => readLocal(STORE.profile, { nickname: "观澜用户" }).nickname);
  const [growth, setGrowth] = useState<GrowthState>(() => readLocal(STORE.growth, {
    balance: 128,
    lifetime: 128,
    completed: [],
    browseIds: [],
    redeemed: [],
    ledger: [{ id: "starter", label: "新用户积分", points: 128, date: dateLabel() }],
  }));
  const [membership, setMembership] = useState<MembershipState>(() => readLocal(STORE.membership, createMembership()));
  const [toast, setToast] = useState("");
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/funding-index.json").then((response) => response.json()),
      fetch("/data/funding-details.json").then((response) => response.json()),
      fetch("/data/report-index.json").then((response) => response.json()),
      fetch("/data/report-details.json").then((response) => response.json()),
    ]).then(([index, details, reports, reportBody]) => {
      setFundingIndex(index);
      setFundingDetails(details);
      setReportIndex(reports);
      setReportDetails(reportBody);
    });
  }, []);

  useEffect(() => { localStorage.setItem(STORE.favorites, JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem(STORE.history, JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem(STORE.follows, JSON.stringify(follows)); }, [follows]);
  useEffect(() => { localStorage.setItem(STORE.growth, JSON.stringify(growth)); }, [growth]);
  useEffect(() => { localStorage.setItem(STORE.profile, JSON.stringify({ nickname })); }, [nickname]);
  useEffect(() => { localStorage.setItem(STORE.membership, JSON.stringify(membership)); }, [membership]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 1900); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { const timer = setTimeout(() => setSplashVisible(false), 1500); return () => clearTimeout(timer); }, []);
  useEffect(() => {
    const forceMobileLayout = new URLSearchParams(window.location.search).get("mobile") === "1";
    document.documentElement.classList.toggle("forced-mobile-layout", forceMobileLayout);
    return () => document.documentElement.classList.remove("forced-mobile-layout");
  }, []);

  const activeTab = view.kind === "tab" ? view.tab : lastTab;
  const level = levelFor(growth.lifetime);
  const membershipStatus = membershipFor(membership);
  const redemptionBenefit = BENEFITS.find((item) => item.id === redeemTarget);
  const redemptionPreview = redemptionBenefit ? membershipFor(extendMembership(membership, redemptionBenefit.days)) : membershipStatus;
  const cards = fundingIndex?.cards || [];
  const entityLibrary = useMemo(() => buildEntityLibrary(cards, fundingDetails), [cards, fundingDetails]);
  const filteredCards = useMemo(() => cards.filter((card) => {
    const keyword = query.trim().toLowerCase();
    if (keyword && !`${card.company} ${card.category} ${card.subcategory} ${card.productForm} ${(card.products || []).join(" ")} ${card.summary} ${card.leadInvestor} ${card.investorsText}`.toLowerCase().includes(keyword)) return false;
    if (region !== "all" && card.region !== region) return false;
    if (round !== "all" && card.roundGroup !== round) return false;
    return true;
  }).slice(0, 40), [cards, query, region, round]);

  if (splashVisible || !fundingIndex || !reportIndex) {
    return <div className="guanlan-app splash-app"><SplashScreen onEnter={() => setSplashVisible(false)} /></div>;
  }

  function awardOnce(id: string, points: number, label: string) {
    setGrowth((current) => current.completed.includes(id) ? current : {
      ...current,
      balance: current.balance + points,
      lifetime: current.lifetime + points,
      completed: [...current.completed, id],
      ledger: [{ id: `${id}-${Date.now()}`, label, points, date: dateLabel() }, ...current.ledger],
    });
  }

  function showTab(tab: Tab) {
    keyboard.hide();
    setLastTab(tab);
    setView({ kind: "tab", tab });
  }

  function go(viewTo: View) {
    keyboard.hide();
    setView(viewTo);
  }

  function back() { go({ kind: "tab", tab: lastTab }); }

  function openFunding(id: string, returnTo?: { kind: "entity"; entityType: EntityType; key: string }) {
    setHistory((current) => [id, ...current.filter((item) => item !== id)].slice(0, 100));
    setGrowth((current) => {
      if (current.browseIds.includes(id)) return current;
      const browseIds = [...current.browseIds, id];
      if (browseIds.length >= 5 && !current.completed.includes("browse")) return {
        ...current,
        browseIds,
        balance: current.balance + 2,
        lifetime: current.lifetime + 2,
        completed: [...current.completed, "browse"],
        ledger: [{ id: `browse-${Date.now()}`, label: "完成任务：阅读 5 条情报", points: 2, date: dateLabel() }, ...current.ledger],
      };
      return { ...current, browseIds };
    });
    go({ kind: "funding", id, returnTo });
  }

  function toggleFavorite(id: string) {
    const adding = !favorites.includes(id);
    setFavorites((current) => adding ? [...current, id] : current.filter((item) => item !== id));
    if (adding) awardOnce("favorite", 3, "完成任务：收藏 1 条情报");
    setToast(adding ? "已加入收藏" : "已取消收藏");
  }

  function toggleFollow(id: string) {
    const adding = !follows.includes(id);
    setFollows((current) => adding ? [...current, id] : current.filter((item) => item !== id));
    if (adding) awardOnce("follow", 5, "完成任务：关注 1 个主题");
    setToast(adding ? "关注成功" : "已取消关注");
  }

  async function share(title: string, shareUrl = location.href) {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: shareUrl });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const field = document.createElement("textarea");
        field.value = shareUrl;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        document.execCommand("copy");
        field.remove();
      }
      setToast("链接已复制");
    } catch { /* User cancelled the browser share surface. */ }
  }

  function requestRedemption(id: string) {
    const benefit = BENEFITS.find((item) => item.id === id);
    if (!benefit) return;
    if (growth.balance < benefit.cost) { setToast("积分不足，继续完成成长任务吧"); return; }
    setRedeemTarget(id);
  }

  function confirmRedemption() {
    const benefit = BENEFITS.find((item) => item.id === redeemTarget);
    if (!benefit || redemptionLock.current) return;
    if (growth.balance < benefit.cost) {
      setRedeemTarget("");
      setToast("积分余额已变化，请重新确认");
      return;
    }
    redemptionLock.current = true;
    const transactionId = `redeem-${Date.now()}`;
    setGrowth({
      ...growth,
      balance: growth.balance - benefit.cost,
      ledger: [{ id: transactionId, label: `兑换：${benefit.title}`, points: -benefit.cost, date: dateLabel() }, ...growth.ledger],
    });
    setMembership(extendMembership(membership, benefit.days));
    setRedeemTarget("");
    setToast(`已增加 ${benefit.days} 天会员权益`);
    window.setTimeout(() => { redemptionLock.current = false; }, 0);
  }

  const page = (() => {
    if (view.kind === "funding") return <FundingDetailView card={fundingDetails[view.id]} watched={favorites.includes(view.id)} compared={selected.includes(view.id)} onBack={view.returnTo ? () => go(view.returnTo!) : back} onFavorite={() => toggleFavorite(view.id)} onToggleCompare={() => setSelected((current) => current.includes(view.id) ? current.filter((item) => item !== view.id) : current.length < 3 ? [...current, view.id] : current)} onOpenEntity={(entityType, key) => go({ kind: "entity", entityType, key })} />;
    if (view.kind === "report") return <ReportDetailView report={reportDetails[view.id]} onBack={back} onShare={() => share(reportDetails[view.id]?.title || "观澜研究报告")} />;
    if (view.kind === "saved") return <SavedView cards={cards.filter((card) => favorites.includes(card.id))} onBack={back} onOpen={openFunding} onFavorite={toggleFavorite} />;
    if (view.kind === "history") return <HistoryView cards={history.map((id) => cards.find((card) => card.id === id)).filter(Boolean) as FundingCard[]} onBack={back} onOpen={openFunding} />;
    if (view.kind === "follows") return <FollowsView categories={fundingIndex.categories} follows={follows} onBack={back} onToggle={toggleFollow} />;
    if (view.kind === "growth") return <GrowthView growth={growth} level={level} onBack={back} onRedeem={requestRedemption} />;
    if (view.kind === "membership") return <MembershipView membership={membershipStatus} points={growth.balance} onBack={back} onGrowth={() => go({ kind: "growth" })} onSubscribe={() => setToast("付费开通暂未开放，可先体验或积分兑换")} />;
    if (view.kind === "invite") return <InviteView isInvitee={new URLSearchParams(location.search).get("from") === "member_invite"} onBack={back} onExperience={() => showTab("terminal")} onShare={() => { const url = new URL(location.href); url.searchParams.set("invite", "1"); url.searchParams.set("from", "member_invite"); share("一起看懂 AI 商业变化，新用户可体验 7 天完整权益", url.toString()); }} />;
    if (view.kind === "profile-edit") return <ProfileEditView nickname={nickname} onChange={setNickname} onBack={back} />;
    if (view.kind === "compare") return <CompareView cards={selected.map((id) => cards.find((card) => card.id === id)).filter(Boolean) as FundingCard[]} onBack={back} />;
    if (view.kind === "entity") return <EntityDetailView entity={entityLibrary[view.entityType].find((item) => item.key === view.key)} type={view.entityType} onBack={back} onOpenFunding={(id) => openFunding(id, view)} onOpenEntity={(entityType, key) => go({ kind: "entity", entityType, key })} />;
    if (view.tab === "market") return <EntityLibraryView library={entityLibrary} onOpen={(entityType, key) => go({ kind: "entity", entityType, key })} />;
    if (view.tab === "observe") return <ObserveView index={reportIndex} type={reportType} onType={setReportType} onOpen={(id) => go({ kind: "report", id })} onSaved={() => go({ kind: "saved" })} />;
    if (view.tab === "profile") return <ProfileView nickname={nickname} favorites={favorites.length} history={history.length} follows={follows.length} growth={growth} level={level} membership={membershipStatus} onOpen={(kind) => go({ kind })} />;
    return <TerminalView index={fundingIndex} cards={filteredCards} query={query} onQuery={setQuery} favorites={favorites} selected={selected} onOpen={openFunding} onFavorite={toggleFavorite} onSelect={(id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)} onFilter={() => setFilterOpen(true)} onSaved={() => go({ kind: "saved" })} onCompare={() => selected.length >= 2 ? go({ kind: "compare" }) : setToast("请至少选择 2 家公司")} />;
  })();

  return (
    <div className="guanlan-app">
      {page}
      {view.kind === "tab" ? <BottomNav active={view.tab} onChange={showTab} /> : null}
      <BottomSheet open={filterOpen} onOpenChange={setFilterOpen} title="筛选融资情报" description="筛选只影响当前融资列表" snap={0.62}>
        <FilterGroup label="地区" value={region} options={[{ id: "all", name: "全部" }, { id: "china", name: "中国总部" }, { id: "overseas", name: "海外总部" }, { id: "undisclosed", name: "未披露" }]} onChange={setRegion} />
        <FilterGroup label="轮次" value={round} options={[{ id: "all", name: "全部" }, { id: "early", name: "种子/天使" }, { id: "growth", name: "A/B/C轮" }, { id: "late", name: "D轮以后" }, { id: "other", name: "其他" }]} onChange={setRound} />
        <button className="sheet-primary" onClick={() => setFilterOpen(false)}>查看结果</button>
      </BottomSheet>
      <BottomSheet open={Boolean(redemptionBenefit)} onOpenChange={(open) => { if (!open) setRedeemTarget(""); }} title={redemptionBenefit ? `兑换${redemptionBenefit.title}` : "确认兑换"} description="确认后立即扣除积分并顺延会员有效期" snap={0.46}>
        {redemptionBenefit ? <section className="redemption-confirm">
          <div><span>本次扣除</span><strong>{redemptionBenefit.cost} 分</strong></div>
          <div><span>兑换后积分</span><strong>{growth.balance - redemptionBenefit.cost} 分</strong></div>
          <div><span>会员有效期</span><strong>顺延至 {redemptionPreview.activeUntil}</strong></div>
          <p>积分兑换成功后不可撤销，会员有效期将在当前体验或会员权益结束后继续顺延。</p>
          <button className="sheet-primary" onClick={confirmRedemption}>确认兑换并扣除 {redemptionBenefit.cost} 分</button>
          <button className="sheet-secondary" onClick={() => setRedeemTarget("")}>暂不兑换</button>
        </section> : null}
      </BottomSheet>
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}

function Loading() {
  return <><AppHeader title="观澜" /><MobileScroll className="app-screen"><main className="screen-content loading"><img src="/brand/app-icon-light.svg" alt="" /><span>正在载入融资情报…</span></main></MobileScroll></>;
}

function TerminalView(props: { index: FundingIndex; cards: FundingCard[]; query: string; onQuery: (value: string) => void; favorites: string[]; selected: string[]; onOpen: (id: string) => void; onFavorite: (id: string) => void; onSelect: (id: string) => void; onFilter: () => void; onSaved: () => void; onCompare: () => void }) {
  const todayCount = props.index.cards.filter((card) => card.date === props.index.meta.latestDate).length;
  const weekCount = props.index.cards.filter((card) => {
    const latest = new Date(`${props.index.meta.latestDate}T00:00:00`);
    const current = new Date(`${card.date}T00:00:00`);
    return Number.isFinite(current.getTime()) && latest.getTime() - current.getTime() <= 6 * 86400000;
  }).length;
  return <><AppHeader title="融资情报" action={`收藏 ${props.favorites.length}`} onAction={props.onSaved} /><MobileScroll className="app-screen"><main className="screen-content terminal-screen">
    <label className="search-box terminal-search"><MagnifyingGlassIcon /><KeyboardInput value={props.query} onChange={(event) => props.onQuery(event.target.value)} placeholder="公司 / 机构 / 产品" aria-label="搜索公司、机构或产品" /></label>
    <section className="funding-metrics"><span><strong>{props.index.meta.cardCount}</strong> 笔融资</span><span>本周 <strong>+{weekCount}</strong></span><span>更新 {props.index.meta.latestDate.slice(5)}</span></section>
    <div className="compact-meta"><span>今日 {todayCount} 条融资动态</span>{props.selected.length >= 2 ? <button onClick={props.onCompare}>查看比较 {props.selected.length}/3</button> : props.selected.length === 1 ? <em>已选 1/3 · 继续选择</em> : null}</div>
    <section className="funding-list">{props.cards.map((card) => <FundingRow key={card.id} card={card} onOpen={() => props.onOpen(card.id)} />)}</section>
    {!props.cards.length ? <Empty title="没有符合条件的融资" copy="换一个关键词或清空筛选后再试。" /> : null}
  </main></MobileScroll></>;
}

function FundingRow({ card, watched, onOpen, onFavorite }: { card: FundingCard; watched?: boolean; selected?: boolean; onOpen: () => void; onFavorite?: () => void; onSelect?: () => void }) {
  return <article className="funding-row"><button className="company-avatar" onClick={onOpen}>{card.initial}</button><button className="funding-copy" onClick={onOpen}><span className="company-line"><strong>{card.company}</strong></span><span className="funding-facts">{card.round} · {card.date}</span></button><div className="funding-side"><strong>{card.amount}</strong>{watched && onFavorite ? <button className="saved-remove" onClick={onFavorite}>移除</button> : null}</div></article>;
}

function EntityLibraryView({ library, onOpen }: { library: EntityLibrary; onOpen: (type: EntityType, key: string) => void }) {
  const [mode, setMode] = useState<EntityType>("companies");
  const [entityQuery, setEntityQuery] = useState("");
  const [limit, setLimit] = useState(24);
  const queryValue = entityQuery.trim().toLowerCase();
  const items = library[mode].filter((item) => !queryValue || item.searchText.includes(queryValue));
  const visibleItems = items.slice(0, limit);
  const switchMode = (nextMode: EntityType) => { setMode(nextMode); setEntityQuery(""); setLimit(24); };
  const placeholder = mode === "companies" ? "企业 / 产品 / 赛道" : mode === "investors" ? "机构 / 已投公司 / 赛道" : "人物 / 企业 / 职务";
  const sortNote = mode === "companies" ? "按最近融资排序" : mode === "investors" ? "按投资活跃度排序" : "按关联企业与最近动态排序";
  return <><AppHeader title="生态图谱" /><MobileScroll className="app-screen"><main className="screen-content entity-library-screen">
    <section className="ecosystem-overview"><div className="ecosystem-overview-head"><span>商业主体全景</span><small>企业 · 机构 · 人物</small></div><div className="library-summary"><div><strong>{library.companies.length}</strong><span>企业</span></div><div><strong>{library.investors.length}</strong><span>机构</span></div><div><strong>{library.people.length}</strong><span>人物</span></div></div></section>
    <div className="library-tabs"><button className={mode === "companies" ? "active" : ""} onClick={() => switchMode("companies")}>企业库</button><button className={mode === "investors" ? "active" : ""} onClick={() => switchMode("investors")}>机构库</button><button className={mode === "people" ? "active" : ""} onClick={() => switchMode("people")}>人物库</button></div>
    <label className="library-search"><MagnifyingGlassIcon /><KeyboardInput value={entityQuery} onChange={(event) => { setEntityQuery(event.target.value); setLimit(24); }} placeholder={placeholder} aria-label="搜索生态图谱" /></label>
    <div className="library-result"><span>共 {items.length} 个{mode === "companies" ? "企业" : mode === "investors" ? "机构" : "人物"}主体</span><span>{sortNote}</span></div>
    <section className="entity-library-list">{visibleItems.map((item) => mode === "companies" ? <CompanyEntityCard key={item.key} item={item as CompanyEntity} onOpen={() => onOpen("companies", item.key)} /> : mode === "investors" ? <InvestorEntityCard key={item.key} item={item as InvestorEntity} onOpen={() => onOpen("investors", item.key)} /> : <PersonEntityCard key={item.key} item={item as PersonEntity} onOpen={() => onOpen("people", item.key)} />)}</section>
    {!items.length ? <Empty title="未找到相关主体" copy="换一个企业、机构、人物、产品或赛道关键词再试。" /> : null}
    {visibleItems.length < items.length ? <button className="library-load-more" onClick={() => setLimit((current) => current + 24)}>继续浏览</button> : null}
  </main></MobileScroll></>;
}

function CompanyEntityCard({ item, onOpen }: { item: CompanyEntity; onOpen: () => void }) {
  const secondary = [item.headquarters, item.products.slice(0, 2).join("、")].filter(Boolean).join(" · ") || "企业信息待补充";
  return <button className="entity-card" onClick={onOpen}><i className="entity-avatar">{item.initial}</i><span className="entity-card-copy"><strong>{item.name}</strong><small>{item.categories.slice(0, 2).join(" · ") || secondary}</small><em>{item.roundCount} 笔融资 · {item.investorCount} 家机构</em></span><ChevronRightIcon /></button>;
}

function InvestorEntityCard({ item, onOpen }: { item: InvestorEntity; onOpen: () => void }) {
  return <button className="entity-card" onClick={onOpen}><i className="entity-avatar">{item.initial}</i><span className="entity-card-copy"><strong>{item.name}</strong><small>{item.companies.slice(0, 2).join("、") || "科技投资机构"}</small><em>{item.roundCount} 笔投资 · {item.companyCount} 家企业</em></span><ChevronRightIcon /></button>;
}

function PersonEntityCard({ item, onOpen }: { item: PersonEntity; onOpen: () => void }) {
  return <button className="entity-card" onClick={onOpen}><i className="entity-avatar">{item.initial}</i><span className="entity-card-copy"><strong>{item.name}</strong><small>{item.roles.join("、") || "核心人物"} · {item.companies.slice(0, 1).join("、")}</small><em>{item.companyCount} 家关联企业 · 最近动态 {item.latest.date.slice(5)}</em></span><ChevronRightIcon /></button>;
}

function EntityDetailView({ entity, type, onBack, onOpenFunding, onOpenEntity }: { entity?: CompanyEntity | InvestorEntity | PersonEntity; type: EntityType; onBack: () => void; onOpenFunding: (id: string) => void; onOpenEntity: (type: EntityType, key: string) => void }) {
  if (!entity) return <Loading />;
  const title = type === "companies" ? "企业档案" : type === "investors" ? "机构档案" : "人物档案";
  const deck = type === "companies" ? (entity as CompanyEntity).summary : type === "investors" ? `已投企业：${(entity as InvestorEntity).companies.join("、")}` : `关联企业：${(entity as PersonEntity).companies.join("、")}`;
  const metrics = type === "companies"
    ? [["融资轮次", `${(entity as CompanyEntity).roundCount} 笔`], ["投资机构", `${(entity as CompanyEntity).investorCount} 家`], ["创始团队", `${(entity as CompanyEntity).founderCount} 人`]]
    : type === "investors"
      ? [["参与轮次", `${(entity as InvestorEntity).roundCount} 笔`], ["领投轮次", `${(entity as InvestorEntity).leadCount} 笔`], ["已投企业", `${(entity as InvestorEntity).companyCount} 家`]]
      : [["关联企业", `${(entity as PersonEntity).companyCount} 家`], ["融资动态", `${(entity as PersonEntity).roundCount} 笔`], ["最近动态", entity.latest.date]];
  return <><AppHeader title={title} onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content entity-detail-screen">
    <section className="entity-detail-hero"><span>{type === "companies" ? entity.categories.slice(0, 2).join(" · ") || "AI 企业" : type === "investors" ? "机构库" : "人物库"}</span><div><i>{entity.initial}</i><h2>{entity.name}</h2></div><p>{deck}</p></section>
    <section className="entity-detail-metrics">{metrics.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section>
    {type === "companies" ? <><EntitySection title="企业信息"><dl className="entity-facts"><div><dt>总部</dt><dd>{(entity as CompanyEntity).headquarters}</dd></div><div><dt>产品</dt><dd>{(entity as CompanyEntity).products.join("、") || "暂未披露"}</dd></div><div><dt>所属赛道</dt><dd>{entity.categories.join("、") || "暂未分类"}</dd></div></dl></EntitySection>{(entity as CompanyEntity).founders.length ? <EntitySection title="人物库"><div className="entity-link-list">{(entity as CompanyEntity).founders.map((founder) => <button key={founder.name} onClick={() => onOpenEntity("people", personEntityKey(founder, entity.name))}><span><strong>{founder.name}</strong><small>{founder.role}</small></span><em>查看人物 ›</em></button>)}</div></EntitySection> : null}{(entity as CompanyEntity).investors.length ? <EntitySection title="机构库"><div className="entity-link-list">{(entity as CompanyEntity).investors.map((investor) => <button key={investor} onClick={() => onOpenEntity("investors", investorEntityKey(investor))}><span><strong>{investor}</strong><small>关联本企业融资</small></span><em>查看机构 ›</em></button>)}</div></EntitySection> : null}</> : <><EntitySection title={type === "investors" ? "关注赛道" : "关联领域"}><p>{entity.categories.join("、") || "暂未分类"}</p></EntitySection><EntitySection title="关联企业"><div className="entity-link-list">{(entity as InvestorEntity | PersonEntity).companies.map((company) => <button key={company} onClick={() => onOpenEntity("companies", companyEntityKey(company))}><span><strong>{company}</strong><small>{type === "investors" ? "已投企业" : "任职企业"}</small></span><em>查看企业 ›</em></button>)}</div></EntitySection></>}
    <EntitySection title={type === "companies" ? "融资历史" : type === "investors" ? "最近投资活动" : "关联企业动态"}><div className="entity-activity-list">{entity.rounds.map((roundItem) => <button key={roundItem.id} onClick={() => onOpenFunding(roundItem.id)}><span><strong>{type === "companies" ? roundItem.round : roundItem.company}</strong><small>{roundItem.date} · {roundItem.round}</small></span><span><strong>{roundItem.amount}</strong><small>查看融资 ›</small></span></button>)}</div></EntitySection>
  </main></MobileScroll></>;
}

function EntitySection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="entity-section"><h3>{title}</h3>{children}</section>;
}

function ObserveView({ index, type, onType, onOpen }: { index: ReportIndex; type: "weekly" | "monthly"; onType: (value: "weekly" | "monthly") => void; onOpen: (id: string) => void; onSaved: () => void }) {
  const reports = index.reports.filter((item) => item.type === type);
  const featured = reports[0];
  return <><AppHeader title="商业观察" /><MobileScroll className="app-screen"><main className="screen-content observe-screen">{featured ? <button className="featured-report" onClick={() => onOpen(featured.id)}><span className="feature-meta"><em>本期核心判断</em><i>{featured.issue}</i></span><strong>{featured.title}</strong><p>{featured.summary}</p><span className="feature-footer"><i>{publicDateWindow(featured.window)}</i><em>阅读完整{featured.typeLabel}</em></span></button> : null}<div className="segmented report-tabs"><button className={type === "weekly" ? "active" : ""} onClick={() => onType("weekly")}>周报</button><button className={type === "monthly" ? "active" : ""} onClick={() => onType("monthly")}>月报</button></div><SectionTitle title={`往期${type === "weekly" ? "周报" : "月报"}`} note="按发布日期倒序" /><section className="report-list">{reports.slice(1).map((report) => <button key={report.id} className="report-row" onClick={() => onOpen(report.id)}><span className="report-date"><strong>{report.dateShort}</strong><em>{report.issue}</em></span><span className="report-copy"><strong>{report.title}</strong><p>{report.summary}</p><span><i>{report.sectionCount} 个章节</i><em>查看全文</em></span></span></button>)}</section></main></MobileScroll></>;
}

function ProfileView({ nickname, favorites, history, follows, growth, level, membership, onOpen }: { nickname: string; favorites: number; history: number; follows: number; growth: GrowthState; level: ReturnType<typeof levelFor>; membership: ReturnType<typeof membershipFor>; onOpen: (kind: "saved" | "history" | "follows" | "growth" | "membership" | "invite" | "profile-edit") => void }) {
  const tasks = [
    { id: "browse", title: "每日阅读 5 条情报", progress: Math.min(5, growth.browseIds.length), target: 5, points: 2 },
    { id: "favorite", title: "收藏 1 条情报", progress: favorites ? 1 : 0, target: 1, points: 3 },
    { id: "follow", title: "关注 1 个主题", progress: follows ? 1 : 0, target: 1, points: 5 },
  ];
  return <><AppHeader title="我的" action="设置" onAction={() => onOpen("profile-edit")} brand={false} /><MobileScroll className="app-screen"><main className="screen-content profile-screen">
    <button className="identity-row" onClick={() => onOpen("profile-edit")}><img src="/brand/app-icon-light.svg" alt="个人头像" /><span><strong>{nickname}</strong><em>资料完善度 60% · 管理个人信息</em></span><ChevronRightIcon /></button>
    <button className="growth-card" onClick={() => onOpen("growth")}><span className="growth-top"><span><em>本周情报成长</em><strong>L{level.level} {level.name}</strong></span><span><strong>{growth.balance}</strong><em>活跃积分</em></span></span><span className="growth-meta"><i>已完成 {growth.completed.length}/5 个成长任务</i><i>距下一级 {Math.max(0, level.next - growth.lifetime)} 分</i></span><span className="progress"><i style={{ width: `${level.progress}%` }} /></span><span className="growth-footer">继续研究，积累积分兑换会员权益</span></button>
    <button className="membership-card" onClick={() => onOpen("membership")}><span><em>会员权益</em><strong>{membership.statusLabel}</strong><small>{membership.active ? `有效至 ${membership.activeUntil}` : "浏览全部栏目"}</small></span><i>{membership.active ? "续费会员" : "开通会员"}<ChevronRightIcon /></i></button>
    <SectionTitle title="成长任务" note="查看明细" onClick={() => onOpen("growth")} /><section className="profile-list">{tasks.map((task) => <button key={task.id} onClick={() => task.id === "follow" ? onOpen("follows") : undefined}><span><strong>{task.title}</strong><em>今日进度 {task.progress}/{task.target}</em></span><i className={growth.completed.includes(task.id) ? "done" : ""}>{growth.completed.includes(task.id) ? "已完成" : `+${task.points} 分`}</i></button>)}</section>
    <SectionTitle title="会员权益兑换" note="全部权益" onClick={() => onOpen("growth")} /><section className="profile-list benefits-preview">{BENEFITS.map((item) => <button key={item.id} onClick={() => onOpen("growth")}><img src="/brand/app-icon-light.svg" alt="" /><span><strong>{item.title}</strong><em>{item.description}</em></span><i>{item.cost} 分</i></button>)}</section>
    <button className="invite-card" onClick={() => onOpen("invite")}><span><strong>邀请好友 · 共同成长</strong><em>好友完成首次注册后，邀请人得 300 活跃积分</em></span><i>查看详情 <ChevronRightIcon /></i></button>
  </main></MobileScroll></>;
}

function MembershipView({ membership, points, onBack, onGrowth, onSubscribe }: { membership: ReturnType<typeof membershipFor>; points: number; onBack: () => void; onGrowth: () => void; onSubscribe: () => void }) {
  return <><AppHeader title="会员中心" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen membership-screen"><section className="member-status"><em>当前权益</em><strong>{membership.statusLabel}</strong><span>{membership.active ? `剩余 ${membership.remainingDays} 天 · 有效至 ${membership.activeUntil}` : "体验期已结束，可开通会员或使用积分兑换"}</span></section><section className="member-plan"><header><span><strong>观澜会员</strong><em>所有栏目的完整浏览权</em></span><span><strong>30</strong><em>元/月起</em></span></header><section className="pricing-list">{PRICING_PLANS.map((plan) => <article key={plan.id}><span><strong>{plan.title}</strong>{plan.badge ? <i>{plan.badge}</i> : null}</span><span><strong>{plan.price}</strong><em>元 / {plan.unit}</em></span></article>)}</section><div>{MEMBER_RIGHTS.map((right) => <p key={right}><i>✓</i>{right}</p>)}</div><button onClick={onSubscribe}>选择会员套餐</button><small>新用户首次使用自动获得 7 天完整权益体验；月度、半年和年度会员均不自动续费。</small></section><button className="points-exchange" onClick={onGrowth}><span><strong>活跃积分兑换</strong><em>当前 {points} 分 · 可兑换 7 天或 30 天会员权益</em></span><i>去兑换</i></button><p className="boundary">会员有效期内可浏览全部栏目。积分兑换后，有效期会在当前权益结束日期之后顺延。</p></main></MobileScroll></>;
}

function InviteView({ isInvitee, onBack, onExperience, onShare }: { isInvitee: boolean; onBack: () => void; onExperience: () => void; onShare: () => void }) {
  const values = [
    ["01", "融资情报", "快速掌握 AI 企业融资动态与资本动向"],
    ["02", "生态图谱", "查询企业、投资机构与核心人物档案"],
    ["03", "商业观察", "阅读周报与月报，理解变化而不只看消息"],
  ];
  const steps = [
    ["1", "分享邀请", "把观澜分享给需要 AI 商业情报的好友"],
    ["2", "好友首次注册", "好友通过邀请进入并完成首次注册"],
    ["3", "积分到账", "系统确认邀请关系后，向邀请人发放 300 活跃积分"],
  ];
  return <><AppHeader title="邀请好友" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen invite-screen">
    <section className="invite-hero"><em>观澜同频邀请</em><h2>把有价值的 AI 商业情报，分享给同频的人</h2><p>新用户首次注册即可获得 7 天全部栏目体验；邀请关系确认后，邀请人获得 300 活跃积分。</p><div className="invite-reward-grid"><span><small>新用户获得</small><strong>7 天</strong><i>完整权益体验</i></span><span><small>邀请人获得</small><strong>300 分</strong><i>活跃积分</i></span></div></section>
    <section className="invite-panel"><h3>好友可以获得什么</h3><div className="invite-value-list">{values.map(([index, title, copy]) => <article key={index}><b>{index}</b><span><strong>{title}</strong><small>{copy}</small></span></article>)}</div></section>
    <section className="invite-panel"><h3>邀请如何生效</h3><div className="invite-step-list">{steps.map(([index, title, copy]) => <article key={index}><b>{index}</b><span><strong>{title}</strong><small>{copy}</small></span></article>)}</div></section>
    <section className="invite-rules"><strong>邀请规则</strong><p>每位新用户仅计入一次有效邀请；邀请关系及积分发放以系统确认结果为准。活跃积分不可提现，可用于兑换会员权益。</p></section>
    <button className="invite-primary" onClick={isInvitee ? onExperience : onShare}>{isInvitee ? null : <Share1Icon />}{isInvitee ? "开始 7 天体验" : "邀请好友加入"}</button>
    <p className="invite-note">{isInvitee ? "首次注册后自动开启 7 天完整权益体验。" : "分享本身不会立即发放积分，好友完成首次注册并确认邀请关系后到账。"}</p>
  </main></MobileScroll></>;
}

function FundingDetailView({ card, watched, compared, onBack, onFavorite, onToggleCompare, onOpenEntity }: { card?: FundingDetail; watched: boolean; compared: boolean; onBack: () => void; onFavorite: () => void; onToggleCompare: () => void; onOpenEntity: (type: EntityType, key: string) => void }) {
  if (!card) return <Loading />;
  return <><AppHeader title="融资详情" onBack={onBack} action={watched ? "已收藏" : "收藏"} onAction={onFavorite} /><MobileScroll className="app-screen"><main className="screen-content detail-screen"><button className="detail-identity entity-jump" onClick={() => onOpenEntity("companies", companyEntityKey(card.company))}><span>{card.initial}</span><div><h2>{card.company}</h2><p>{card.category} · {card.productForm || card.subcategory}</p></div><em>企业档案 ›</em></button><section className="fact-grid"><div><span>本轮金额</span><strong>{card.amount}</strong></div><div><span>融资轮次</span><strong>{card.round}</strong></div><div><span>披露日期</span><strong>{card.date}</strong></div><div><span>累计融资</span><strong>{card.cumulativeAmount}</strong></div></section><button className={`compare-action ${compared ? "active" : ""}`} onClick={onToggleCompare}>{compared ? "已加入公司比较" : "加入公司比较"}</button><ArticleSection title="公司做什么"><p>{card.companySummary}</p><small>总部：{card.headquarters}</small></ArticleSection>{card.founders.length ? <ArticleSection title="人物库">{card.founders.map((founder) => <button className="simple-row relation-row" key={founder.name} onClick={() => onOpenEntity("people", personEntityKey(founder, card.company))}><span><strong>{founder.name}</strong><small>{founder.role || "创始团队"}</small></span><em>查看人物 ›</em></button>)}</ArticleSection> : null}<ArticleSection title="机构库">{card.investors.length ? card.investors.map((item) => <button className="simple-row relation-row" key={item.name} onClick={() => onOpenEntity("investors", investorEntityKey(item.name))}><span><strong>{item.name}</strong><small>{item.role || "角色未披露"}</small></span><em>查看机构 ›</em></button>) : <p>投资方未披露</p>}</ArticleSection>{card.signals.length ? <ArticleSection title="关键进展">{card.signals.map((item, index) => <p className="numbered" key={item}><b>{index + 1}</b>{publicAnalysisText(item)}</p>)}</ArticleSection> : null}{card.capitalJudgment ? <ArticleSection title="资本为什么下注" kicker="观澜分析"><p>{publicAnalysisText(card.capitalJudgment)}</p></ArticleSection> : null}{card.risks.length ? <ArticleSection title="风险与未知">{card.risks.map((item, index) => <p className="numbered risk" key={item}><b>{index + 1}</b>{publicAnalysisText(item)}</p>)}</ArticleSection> : null}</main></MobileScroll></>;
}

function ReportDetailView({ report, onBack, onShare }: { report?: ReportDetail; onBack: () => void; onShare: () => void }) {
  if (!report) return <Loading />;
  const blocks = report.blocks.filter(isPublicReportBlock);
  return <><AppHeader title={report.typeLabel} onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content report-detail"><section className="reader-hero"><span><em>{report.typeLabel}</em><i>{report.issue}</i></span><h2>{report.title}</h2><p>{report.summary}</p><small>发布 {report.date}　{report.sectionCount} 个章节</small>{report.counts ? <div><span><strong>{report.counts.signals}</strong><em>商业事件</em></span><span><strong>{report.counts.opinions}</strong><em>一线观点</em></span><span><strong>{report.counts.community}</strong><em>行业观察</em></span></div> : null}</section><p className="boundary">内容仅供行业研究与信息参考，不构成投资建议。</p><article className="reader-body">{blocks.map((block) => { const text = publicReportText(block.text); return block.type === "heading" ? <h3 key={block.id}>{text}</h3> : block.type === "subheading" ? <h4 key={block.id}>{text}</h4> : block.type === "list" ? <p className="reader-list" key={block.id}>{text}</p> : block.type === "quote" ? <blockquote key={block.id}>{text}</blockquote> : block.type === "table" ? <p className="reader-table" key={block.id}>{text}</p> : <p key={block.id}>{text}</p>; })}</article><button className="secondary-action" onClick={onShare}><Share1Icon />分享这份{report.typeLabel}</button></main></MobileScroll></>;
}

function SavedView({ cards, onBack, onOpen, onFavorite }: { cards: FundingCard[]; onBack: () => void; onOpen: (id: string) => void; onFavorite: (id: string) => void }) {
  return <><AppHeader title="我的收藏" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen"><p className="sub-intro">已收藏 {cards.length} 笔融资</p>{cards.length ? cards.map((card) => <FundingRow key={card.id} card={card} watched selected={false} onOpen={() => onOpen(card.id)} onFavorite={() => onFavorite(card.id)} onSelect={() => undefined} />) : <Empty title="还没有收藏融资" copy="在融资页面点击收藏，即可建立你的观察列表。" />}</main></MobileScroll></>;
}

function HistoryView({ cards, onBack, onOpen }: { cards: FundingCard[]; onBack: () => void; onOpen: (id: string) => void }) {
  return <><AppHeader title="浏览记录" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen">{cards.length ? cards.map((card) => <button className="history-row" key={card.id} onClick={() => onOpen(card.id)}><span>{card.initial}</span><div><strong>{card.company}</strong><em>{card.round} · {card.amount}</em></div><ClockIcon /></button>) : <Empty title="还没有浏览记录" copy="打开融资详情后，最近记录会保存在这里。" />}</main></MobileScroll></>;
}

function FollowsView({ categories, follows, onBack, onToggle }: { categories: FundingIndex["categories"]; follows: string[]; onBack: () => void; onToggle: (id: string) => void }) {
  return <><AppHeader title="我的关注" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen"><div className="sub-hero"><h2>选择你的观察主题</h2><p>关注感兴趣的赛道，持续追踪融资变化与行业趋势。</p></div>{categories.map((item) => <article className="follow-row" key={item.id}><span><strong>{item.count}</strong><em>条情报</em></span><div><strong>{item.name}</strong><em>追踪该赛道融资变化</em></div><button className={follows.includes(item.id) ? "active" : ""} onClick={() => onToggle(item.id)}>{follows.includes(item.id) ? "已关注" : "关注"}</button></article>)}</main></MobileScroll></>;
}

function GrowthView({ growth, level, onBack, onRedeem }: { growth: GrowthState; level: ReturnType<typeof levelFor>; onBack: () => void; onRedeem: (id: string) => void }) {
  return <><AppHeader title="成长与权益" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen"><section className="wallet"><span>当前活跃积分</span><strong>{growth.balance}</strong><em>L{level.level} {level.name} · 累计成长 {growth.lifetime} 分</em><span className="progress"><i style={{ width: `${level.progress}%` }} /></span><small>距下一等级还差 {Math.max(0, level.next - growth.lifetime)} 分</small></section><SectionTitle title="会员权益兑换" /><section className="redeem-list">{BENEFITS.map((item) => { const shortfall = Math.max(0, item.cost - growth.balance); return <article key={item.id}><span><strong>{item.title}</strong><em>{item.description}</em></span><button disabled={shortfall > 0} onClick={() => onRedeem(item.id)}>{shortfall ? `还差 ${shortfall} 分` : `${item.cost} 分兑换`}</button></article>; })}</section><SectionTitle title="积分明细" /><section className="ledger">{growth.ledger.map((item) => <div key={item.id}><span><strong>{item.id === "starter" ? "新用户积分" : item.label}</strong><em>{item.date}</em></span><i className={item.points > 0 ? "income" : "expense"}>{item.points > 0 ? "+" : ""}{item.points}</i></div>)}</section><p className="boundary">社群活跃积分可兑换会员权益；邀请奖励将在好友完成注册后发放。</p></main></MobileScroll></>;
}

function ProfileEditView({ nickname, onChange, onBack }: { nickname: string; onChange: (value: string) => void; onBack: () => void }) {
  return <><AppHeader title="个人资料" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen"><section className="profile-edit-card"><img src="/brand/app-icon-light.svg" alt="当前头像" /><div><strong>头像</strong><em>用于展示你的个人形象</em></div></section><label className="edit-field"><span>昵称</span><KeyboardInput value={nickname} maxLength={20} onChange={(event) => onChange(event.target.value)} placeholder="请输入昵称" /></label><section className="account-list"><div><span><strong>手机号</strong><em>未绑定</em></span><i>绑定</i></div><div><span><strong>微信资料</strong><em>同步头像与昵称</em></span><i>授权</i></div></section></main></MobileScroll></>;
}

function CompareView({ cards, onBack }: { cards: FundingCard[]; onBack: () => void }) {
  return <><AppHeader title="公司比较" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen"><section className="compare-grid">{cards.map((card) => <article key={card.id}><span>{card.initial}</span><h3>{card.company}</h3><dl><dt>本轮金额</dt><dd>{card.amount}</dd><dt>融资轮次</dt><dd>{card.round}</dd><dt>披露日期</dt><dd>{card.date}</dd><dt>市场分类</dt><dd>{card.category}</dd><dt>总部</dt><dd>{card.headquarters}</dd></dl></article>)}</section></main></MobileScroll></>;
}

function ArticleSection({ title, kicker, children }: { title: string; kicker?: string; children: React.ReactNode }) {
  return <section className="article-section">{kicker ? <span>{kicker}</span> : null}<h3>{title}</h3>{children}</section>;
}

function FilterGroup({ label, value, options, onChange }: { label: string; value: string; options: Array<{ id: string; name: string }>; onChange: (value: string) => void }) {
  return <fieldset className="filter-group"><legend>{label}</legend><div>{options.map((item) => <button key={item.id} className={value === item.id ? "active" : ""} onClick={() => onChange(item.id)}>{item.name}</button>)}</div></fieldset>;
}

function SectionTitle({ title, note, onClick }: { title: string; note?: string; onClick?: () => void }) {
  return <div className="section-title"><h3>{title}</h3>{note ? <button onClick={onClick}>{note}</button> : null}</div>;
}

function Empty({ title, copy }: { title: string; copy: string }) {
  return <div className="empty"><img src="/brand/app-icon-light.svg" alt="" /><strong>{title}</strong><p>{copy}</p></div>;
}
