import { useEffect, useMemo, useState } from "react";
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
type CompanyEntity = {
  key: string;
  name: string;
  initial: string;
  summary: string;
  headquarters: string;
  products: string[];
  categories: string[];
  roundCount: number;
  latest: FundingCard;
  searchText: string;
};
type InvestorEntity = {
  key: string;
  name: string;
  initial: string;
  companies: string[];
  categories: string[];
  roundCount: number;
  leadCount: number;
  latest: FundingCard;
  searchText: string;
};
type ReportIndex = { meta: { weeklyCount: number; monthlyCount: number }; reports: ReportSummary[] };
type Tab = "terminal" | "market" | "observe" | "profile";
type View =
  | { kind: "tab"; tab: Tab }
  | { kind: "funding"; id: string }
  | { kind: "report"; id: string }
  | { kind: "saved" }
  | { kind: "history" }
  | { kind: "follows" }
  | { kind: "growth" }
  | { kind: "profile-edit" }
  | { kind: "compare" };

type GrowthState = {
  balance: number;
  lifetime: number;
  completed: string[];
  browseIds: string[];
  redeemed: string[];
  ledger: Array<{ id: string; label: string; points: number; date: string }>;
};

const BENEFITS = [
  { id: "advanced", title: "高级筛选试用", description: "解锁 7 天高级筛选体验", cost: 150 },
  { id: "follow", title: "关注上限扩容", description: "增加 10 个主题关注名额", cost: 200 },
  { id: "weekly", title: "周报优先阅读", description: "连续 4 周提前阅读周报", cost: 300 },
];

const STORE = {
  favorites: "guanlan_h5_favorites_v1",
  history: "guanlan_h5_history_v1",
  follows: "guanlan_h5_follows_v1",
  growth: "guanlan_h5_growth_v1",
  profile: "guanlan_h5_profile_v1",
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

function buildEntityLibrary(cards: FundingCard[], details: Record<string, FundingDetail>) {
  const sortedCards = [...cards].sort((left, right) => right.date.localeCompare(left.date) || right.amountValue - left.amountValue);
  const companyMap = new Map<string, Omit<CompanyEntity, "searchText">>();
  const investorMap = new Map<string, Omit<InvestorEntity, "searchText">>();

  sortedCards.forEach((card) => {
    const companyKey = card.company.trim().toLowerCase();
    const company = companyMap.get(companyKey) || {
      key: companyKey,
      name: card.company,
      initial: card.initial,
      summary: card.summary,
      headquarters: card.headquarters,
      products: [],
      categories: [],
      roundCount: 0,
      latest: card,
    };
    company.roundCount += 1;
    (card.products || []).forEach((product) => appendUnique(company.products, product));
    appendUnique(company.products, card.productForm);
    appendUnique(company.categories, card.category);
    appendUnique(company.categories, card.subcategory);
    companyMap.set(companyKey, company);

    const detailInvestors = details[card.id]?.investors || [];
    const investors = detailInvestors.length ? detailInvestors : card.leadInvestor && card.leadInvestor !== "投资方未披露" ? [{ name: card.leadInvestor, role: "" }] : [];
    const seen = new Set<string>();
    investors.forEach((item) => {
      const name = item.name.trim();
      const investorKey = name.toLowerCase();
      if (!name || seen.has(investorKey)) return;
      seen.add(investorKey);
      const investor = investorMap.get(investorKey) || {
        key: investorKey,
        name,
        initial: name.slice(0, 1).toUpperCase(),
        companies: [],
        categories: [],
        roundCount: 0,
        leadCount: 0,
        latest: card,
      };
      investor.roundCount += 1;
      if (item.role.includes("领投")) investor.leadCount += 1;
      appendUnique(investor.companies, card.company);
      appendUnique(investor.categories, card.category);
      appendUnique(investor.categories, card.subcategory);
      investorMap.set(investorKey, investor);
    });
  });

  const companies = [...companyMap.values()].map((item) => ({
    ...item,
    searchText: [item.name, item.summary, item.headquarters, ...item.products, ...item.categories].join(" ").toLowerCase(),
  })).sort((left, right) => right.latest.date.localeCompare(left.latest.date) || left.name.localeCompare(right.name, "zh-CN"));
  const investors = [...investorMap.values()].map((item) => ({
    ...item,
    searchText: [item.name, ...item.companies, ...item.categories].join(" ").toLowerCase(),
  })).sort((left, right) => right.roundCount - left.roundCount || right.leadCount - left.leadCount || left.name.localeCompare(right.name, "zh-CN"));
  return { companies, investors };
}

function AppHeader({ title, onBack, action, onAction }: { title: string; onBack?: () => void; action?: string; onAction?: () => void }) {
  return (
    <header className="app-header">
      {onBack ? <button className="header-button back" onClick={onBack} aria-label="返回"><ArrowLeftIcon />返回</button> : <img src="/brand/logo-wavesight.svg" alt="观澜 AI" />}
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
        <span className="splash-divider" aria-hidden="true" />
        <strong className="splash-slogan">洞察趋势 · 智见未来</strong>
        <span className="splash-description">AI 融资情报与市场观察</span>
      </span>
      <span className="splash-footer">
        <span className="splash-progress" aria-hidden="true"><i /></span>
        <span>观澜 AI</span>
      </span>
    </button>
  );
}

function BottomNav({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const items: Array<{ id: Tab; label: string; icon: typeof BarChartIcon }> = [
    { id: "terminal", label: "融资", icon: ReaderIcon },
    { id: "market", label: "商业主体", icon: MagnifyingGlassIcon },
    { id: "observe", label: "观察", icon: EyeOpenIcon },
    { id: "profile", label: "我的", icon: PersonIcon },
  ];
  return <nav className="bottom-nav">{items.map((item) => { const Icon = item.icon; return <button key={item.id} className={active === item.id ? "active" : ""} onClick={() => onChange(item.id)}><Icon /><span>{item.label}</span></button>; })}</nav>;
}

export default function Prototype() {
  const keyboard = useKeyboard();
  const [fundingIndex, setFundingIndex] = useState<FundingIndex | null>(null);
  const [fundingDetails, setFundingDetails] = useState<Record<string, FundingDetail>>({});
  const [reportIndex, setReportIndex] = useState<ReportIndex | null>(null);
  const [reportDetails, setReportDetails] = useState<Record<string, ReportDetail>>({});
  const [view, setView] = useState<View>({ kind: "tab", tab: "terminal" });
  const [lastTab, setLastTab] = useState<Tab>("terminal");
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("all");
  const [round, setRound] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
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
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 1900); return () => clearTimeout(timer); }, [toast]);
  useEffect(() => { const timer = setTimeout(() => setSplashVisible(false), 1500); return () => clearTimeout(timer); }, []);

  const activeTab = view.kind === "tab" ? view.tab : lastTab;
  const level = levelFor(growth.lifetime);
  const cards = fundingIndex?.cards || [];
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

  function openFunding(id: string) {
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
    go({ kind: "funding", id });
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

  async function share(title: string) {
    try {
      if (navigator.share) {
        await navigator.share({ title, url: location.href });
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(location.href);
      } else {
        const field = document.createElement("textarea");
        field.value = location.href;
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

  function redeem(id: string) {
    const benefit = BENEFITS.find((item) => item.id === id);
    if (!benefit || growth.redeemed.includes(id)) return;
    if (growth.balance < benefit.cost) { setToast("积分不足，继续完成成长任务吧"); return; }
    setGrowth((current) => ({
      ...current,
      balance: current.balance - benefit.cost,
      redeemed: [...current.redeemed, id],
      ledger: [{ id: `redeem-${Date.now()}`, label: `兑换：${benefit.title}`, points: -benefit.cost, date: dateLabel() }, ...current.ledger],
    }));
    setToast("权益兑换成功");
  }

  const page = (() => {
    if (view.kind === "funding") return <FundingDetailView card={fundingDetails[view.id]} watched={favorites.includes(view.id)} onBack={back} onFavorite={() => toggleFavorite(view.id)} />;
    if (view.kind === "report") return <ReportDetailView report={reportDetails[view.id]} onBack={back} onShare={() => share(reportDetails[view.id]?.title || "观澜研究报告")} />;
    if (view.kind === "saved") return <SavedView cards={cards.filter((card) => favorites.includes(card.id))} onBack={back} onOpen={openFunding} onFavorite={toggleFavorite} />;
    if (view.kind === "history") return <HistoryView cards={history.map((id) => cards.find((card) => card.id === id)).filter(Boolean) as FundingCard[]} onBack={back} onOpen={openFunding} />;
    if (view.kind === "follows") return <FollowsView categories={fundingIndex.categories} follows={follows} onBack={back} onToggle={toggleFollow} />;
    if (view.kind === "growth") return <GrowthView growth={growth} level={level} onBack={back} onRedeem={redeem} />;
    if (view.kind === "profile-edit") return <ProfileEditView nickname={nickname} onChange={setNickname} onBack={back} />;
    if (view.kind === "compare") return <CompareView cards={selected.map((id) => cards.find((card) => card.id === id)).filter(Boolean) as FundingCard[]} onBack={back} />;
    if (view.tab === "market") return <EntityLibraryView cards={cards} details={fundingDetails} onOpen={openFunding} />;
    if (view.tab === "observe") return <ObserveView index={reportIndex} type={reportType} onType={setReportType} onOpen={(id) => go({ kind: "report", id })} onSaved={() => go({ kind: "saved" })} />;
    if (view.tab === "profile") return <ProfileView nickname={nickname} favorites={favorites.length} history={history.length} follows={follows.length} growth={growth} level={level} onOpen={(kind) => go({ kind })} onShare={() => share("一起用观澜追踪 AI 融资情报")} />;
    return <TerminalView index={fundingIndex} cards={filteredCards} query={query} onQuery={setQuery} favorites={favorites} selected={selected} onOpen={openFunding} onFavorite={toggleFavorite} onSelect={(id) => setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 3 ? [...current, id] : current)} onFilter={() => setFilterOpen(true)} onSaved={() => go({ kind: "saved" })} onCompare={() => selected.length >= 2 ? go({ kind: "compare" }) : setToast("请至少选择 2 家公司")} />;
  })();

  return (
    <div className="guanlan-app">
      {page}
      {view.kind === "tab" ? <BottomNav active={view.tab} onChange={showTab} /> : null}
      {selected.length ? <button className="compare-fab" onClick={() => selected.length >= 2 ? go({ kind: "compare" }) : setToast("请再选择 1 家公司")}>比较 {selected.length}/3</button> : null}
      <BottomSheet open={filterOpen} onOpenChange={setFilterOpen} title="筛选融资情报" description="筛选只影响当前融资列表" snap={0.62}>
        <FilterGroup label="地区" value={region} options={[{ id: "all", name: "全部" }, { id: "china", name: "中国总部" }, { id: "overseas", name: "海外总部" }, { id: "undisclosed", name: "未披露" }]} onChange={setRegion} />
        <FilterGroup label="轮次" value={round} options={[{ id: "all", name: "全部" }, { id: "early", name: "种子/天使" }, { id: "growth", name: "A/B/C轮" }, { id: "late", name: "D轮以后" }, { id: "other", name: "其他" }]} onChange={setRound} />
        <button className="sheet-primary" onClick={() => setFilterOpen(false)}>查看结果</button>
      </BottomSheet>
      {toast ? <div className="toast" role="status">{toast}</div> : null}
    </div>
  );
}

function Loading() {
  return <><AppHeader title="观澜" /><MobileScroll className="app-screen"><main className="screen-content loading"><img src="/brand/app-icon-light.svg" alt="" /><span>正在载入融资情报…</span></main></MobileScroll></>;
}

function TerminalView(props: { index: FundingIndex; cards: FundingCard[]; query: string; onQuery: (value: string) => void; favorites: string[]; selected: string[]; onOpen: (id: string) => void; onFavorite: (id: string) => void; onSelect: (id: string) => void; onFilter: () => void; onSaved: () => void; onCompare: () => void }) {
  return <><AppHeader title="融资情报" action={`收藏 ${props.favorites.length}`} onAction={props.onSaved} /><MobileScroll className="app-screen"><main className="screen-content terminal-screen">
    <section className="terminal-intro"><div><span>已发布融资情报</span><strong>{props.index.meta.cardCount}</strong></div><p>更新至<br />{props.index.meta.latestDate}</p></section>
    <div className="search-row"><label className="search-box"><MagnifyingGlassIcon /><KeyboardInput value={props.query} onChange={(event) => props.onQuery(event.target.value)} placeholder="公司 / 机构 / 产品" aria-label="搜索公司、机构或产品" /></label><button className="filter-button" onClick={props.onFilter}><MixerHorizontalIcon /></button></div>
    <div className="list-heading"><span>共 {props.cards.length} 条结果</span><button onClick={props.onCompare}>公司比较</button></div>
    <section className="funding-list">{props.cards.map((card) => <FundingRow key={card.id} card={card} watched={props.favorites.includes(card.id)} selected={props.selected.includes(card.id)} onOpen={() => props.onOpen(card.id)} onFavorite={() => props.onFavorite(card.id)} onSelect={() => props.onSelect(card.id)} />)}</section>
    {!props.cards.length ? <Empty title="没有符合条件的融资" copy="换一个关键词或清空筛选后再试。" /> : null}
  </main></MobileScroll></>;
}

function FundingRow({ card, watched, selected, onOpen, onFavorite, onSelect }: { card: FundingCard; watched: boolean; selected: boolean; onOpen: () => void; onFavorite: () => void; onSelect: () => void }) {
  return <article className={`funding-row ${selected ? "selected" : ""}`}><button className="company-avatar" onClick={onOpen}>{card.initial}</button><button className="funding-copy" onClick={onOpen}><span className="company-line"><strong>{card.company}</strong></span><span className="funding-facts">{card.round} · {card.date}</span></button><div className="funding-side"><strong>{card.amount}</strong><div><button aria-label="选择比较" className={selected ? "selected" : ""} onClick={onSelect}>{selected ? <CheckCircledIcon /> : <BarChartIcon />}</button><button aria-label={watched ? "取消收藏" : "收藏"} onClick={onFavorite}>{watched ? <BookmarkFilledIcon /> : <BookmarkIcon />}</button></div></div></article>;
}

function EntityLibraryView({ cards, details, onOpen }: { cards: FundingCard[]; details: Record<string, FundingDetail>; onOpen: (id: string) => void }) {
  const [mode, setMode] = useState<"companies" | "investors">("companies");
  const [entityQuery, setEntityQuery] = useState("");
  const [limit, setLimit] = useState(40);
  const library = useMemo(() => buildEntityLibrary(cards, details), [cards, details]);
  const queryValue = entityQuery.trim().toLowerCase();
  const items = (mode === "companies" ? library.companies : library.investors).filter((item) => !queryValue || item.searchText.includes(queryValue));
  const visibleItems = items.slice(0, limit);
  const switchMode = (nextMode: "companies" | "investors") => { setMode(nextMode); setEntityQuery(""); setLimit(40); };
  return <><AppHeader title="商业主体" /><MobileScroll className="app-screen"><main className="screen-content entity-library-screen">
    <section className="library-summary"><div><strong>{library.companies.length}</strong><span>家企业</span></div><div><strong>{library.investors.length}</strong><span>家投资机构</span></div></section>
    <div className="segmented library-tabs"><button className={mode === "companies" ? "active" : ""} onClick={() => switchMode("companies")}>企业库</button><button className={mode === "investors" ? "active" : ""} onClick={() => switchMode("investors")}>投资机构</button></div>
    <label className="library-search"><MagnifyingGlassIcon /><KeyboardInput value={entityQuery} onChange={(event) => { setEntityQuery(event.target.value); setLimit(40); }} placeholder={mode === "companies" ? "企业 / 产品 / 赛道" : "机构 / 已投公司 / 赛道"} aria-label={mode === "companies" ? "搜索企业" : "搜索投资机构"} /></label>
    <div className="library-result"><span>共 {items.length} 条结果</span><span>{mode === "companies" ? "按最近融资排序" : "按参与轮次数排序"}</span></div>
    <section className="entity-library-list">{visibleItems.map((item) => mode === "companies" ? <CompanyEntityRow key={item.key} item={item as CompanyEntity} onOpen={onOpen} /> : <InvestorEntityRow key={item.key} item={item as InvestorEntity} onOpen={onOpen} />)}</section>
    {!items.length ? <Empty title={mode === "companies" ? "未找到相关企业" : "未找到相关机构"} copy="换一个企业、机构、产品或赛道关键词再试。" /> : null}
    {visibleItems.length < items.length ? <button className="library-load-more" onClick={() => setLimit((current) => current + 40)}>继续浏览</button> : null}
  </main></MobileScroll></>;
}

function CompanyEntityRow({ item, onOpen }: { item: CompanyEntity; onOpen: (id: string) => void }) {
  const secondary = [item.headquarters, item.products.slice(0, 2).join("、")].filter(Boolean).join(" · ") || "企业信息待补充";
  return <button className="entity-library-row" onClick={() => onOpen(item.latest.id)}><span className="entity-avatar">{item.initial}</span><span className="entity-copy"><strong>{item.name}</strong><em>{secondary}</em><small>{item.categories.slice(0, 2).join(" · ")}</small></span><span className="entity-metrics"><strong>{item.latest.amount}</strong><em>{item.roundCount} 笔融资</em><small>{item.latest.date}</small></span></button>;
}

function InvestorEntityRow({ item, onOpen }: { item: InvestorEntity; onOpen: (id: string) => void }) {
  return <button className="entity-library-row" onClick={() => onOpen(item.latest.id)}><span className="entity-avatar">{item.initial}</span><span className="entity-copy"><strong>{item.name}</strong><em>{item.companies.slice(0, 3).join("、") || "已投公司待补充"}</em><small>{item.categories.slice(0, 2).join(" · ")}</small></span><span className="entity-metrics"><strong>{item.roundCount} 笔</strong><em>领投 {item.leadCount} 笔</em><small>{item.latest.date}</small></span></button>;
}

function ObserveView({ index, type, onType, onOpen, onSaved }: { index: ReportIndex; type: "weekly" | "monthly"; onType: (value: "weekly" | "monthly") => void; onOpen: (id: string) => void; onSaved: () => void }) {
  const reports = index.reports.filter((item) => item.type === type);
  const featured = reports[0];
  return <><AppHeader title="观察" action="我的收藏" onAction={onSaved} /><MobileScroll className="app-screen"><main className="screen-content observe-screen"><section className="report-intro"><span>GUANLAN RESEARCH</span><h2>AI 商业变化观察</h2><p>用周报追踪近期变化，用月报理解行业趋势与商业机会。</p></section><div className="segmented"><button className={type === "weekly" ? "active" : ""} onClick={() => onType("weekly")}>周报 {index.meta.weeklyCount}</button><button className={type === "monthly" ? "active" : ""} onClick={() => onType("monthly")}>月报 {index.meta.monthlyCount}</button></div>{featured ? <button className="featured-report" onClick={() => onOpen(featured.id)}><span className="feature-meta"><em>最新{featured.typeLabel}</em><i>{featured.issue}</i></span><strong>{featured.title}</strong><p>{featured.summary}</p>{featured.counts ? <span className="evidence-chips"><i>{featured.counts.signals} 条事件</i><i>{featured.counts.opinions} 条观点</i><i>{featured.counts.community} 条行业观察</i></span> : null}<span className="feature-footer"><i>{publicDateWindow(featured.window)}</i><em>阅读全文</em></span></button> : null}<SectionTitle title={`往期${type === "weekly" ? "周报" : "月报"}`} note="按发布日期倒序" /><section className="report-list">{reports.slice(1).map((report) => <button key={report.id} className="report-row" onClick={() => onOpen(report.id)}><span className="report-date"><strong>{report.dateShort}</strong><em>{report.issue}</em></span><span className="report-copy"><strong>{report.title}</strong><p>{report.summary}</p><span><i>{report.sectionCount} 个章节</i><em>查看全文</em></span></span></button>)}</section></main></MobileScroll></>;
}

function ProfileView({ nickname, favorites, history, follows, growth, level, onOpen, onShare }: { nickname: string; favorites: number; history: number; follows: number; growth: GrowthState; level: ReturnType<typeof levelFor>; onOpen: (kind: "saved" | "history" | "follows" | "growth" | "profile-edit") => void; onShare: () => void }) {
  const tasks = [
    { id: "browse", title: "每日阅读 5 条情报", progress: Math.min(5, growth.browseIds.length), target: 5, points: 2 },
    { id: "favorite", title: "收藏 1 条情报", progress: favorites ? 1 : 0, target: 1, points: 3 },
    { id: "follow", title: "关注 1 个主题", progress: follows ? 1 : 0, target: 1, points: 5 },
  ];
  return <><AppHeader title="" action="设置" onAction={() => onOpen("profile-edit")} /><MobileScroll className="app-screen"><main className="screen-content profile-screen"><button className="identity-row" onClick={() => onOpen("profile-edit")}><img src="/brand/app-icon-light.svg" alt="个人头像" /><span><strong>{nickname}</strong><em>资料完善度 60% · 管理个人信息</em></span><ChevronRightIcon /></button><button className="growth-card" onClick={() => onOpen("growth")}><span className="growth-top"><span><em>本周情报成长</em><strong>L{level.level} {level.name}</strong></span><span><strong>{growth.balance}</strong><em>积分</em></span></span><span className="growth-meta"><i>已完成 {growth.completed.length}/5 个成长任务</i><i>距下一级 {Math.max(0, level.next - growth.lifetime)} 分</i></span><span className="progress"><i style={{ width: `${level.progress}%` }} /></span><span className="growth-footer">继续研究，解锁更多情报权益</span></button><section className="stats"><button onClick={() => onOpen("history")}><strong>{history}</strong><span>浏览</span></button><button onClick={() => onOpen("saved")}><strong>{favorites}</strong><span>收藏</span></button><button onClick={() => onOpen("follows")}><strong>{follows}</strong><span>关注</span></button></section><SectionTitle title="成长任务" note="查看明细" onClick={() => onOpen("growth")} /><section className="profile-list">{tasks.map((task) => <button key={task.id} onClick={() => task.id === "follow" ? onOpen("follows") : undefined}><span><strong>{task.title}</strong><em>今日进度 {task.progress}/{task.target}</em></span><i className={growth.completed.includes(task.id) ? "done" : ""}>{growth.completed.includes(task.id) ? "已完成" : `+${task.points} 分`}</i></button>)}</section><SectionTitle title="我的权益" note="全部权益" onClick={() => onOpen("growth")} /><section className="profile-list benefits-preview">{BENEFITS.map((item) => <button key={item.id} onClick={() => onOpen("growth")}><img src="/brand/app-icon-light.svg" alt="" /><span><strong>{item.title}</strong><em>{item.description}</em></span><i>{growth.redeemed.includes(item.id) ? "已兑换" : `${item.cost} 分`}</i></button>)}</section><button className="invite-card" onClick={onShare}><span><strong>邀请好友 · 共同成长</strong><em>好友首次注册后，双方各得 20 积分</em></span><Share1Icon /></button></main></MobileScroll></>;
}

function FundingDetailView({ card, watched, onBack, onFavorite }: { card?: FundingDetail; watched: boolean; onBack: () => void; onFavorite: () => void }) {
  if (!card) return <Loading />;
  return <><AppHeader title="融资详情" onBack={onBack} action={watched ? "已收藏" : "收藏"} onAction={onFavorite} /><MobileScroll className="app-screen"><main className="screen-content detail-screen"><section className="detail-identity"><span>{card.initial}</span><div><h2>{card.company}</h2><p>{card.category} · {card.productForm || card.subcategory}</p></div></section><section className="fact-grid"><div><span>本轮金额</span><strong>{card.amount}</strong></div><div><span>融资轮次</span><strong>{card.round}</strong></div><div><span>披露日期</span><strong>{card.date}</strong></div><div><span>累计融资</span><strong>{card.cumulativeAmount}</strong></div></section><ArticleSection title="公司做什么"><p>{card.companySummary}</p><small>总部：{card.headquarters}</small></ArticleSection><ArticleSection title="本轮投资方">{card.investors.length ? card.investors.map((item) => <div className="simple-row" key={item.name}><strong>{item.name}</strong><span>{item.role || "角色未披露"}</span></div>) : <p>投资方未披露</p>}</ArticleSection>{card.signals.length ? <ArticleSection title="关键进展">{card.signals.map((item, index) => <p className="numbered" key={item}><b>{index + 1}</b>{publicAnalysisText(item)}</p>)}</ArticleSection> : null}{card.capitalJudgment ? <ArticleSection title="资本为什么下注" kicker="观澜分析"><p>{publicAnalysisText(card.capitalJudgment)}</p></ArticleSection> : null}{card.risks.length ? <ArticleSection title="风险与未知">{card.risks.map((item, index) => <p className="numbered risk" key={item}><b>{index + 1}</b>{publicAnalysisText(item)}</p>)}</ArticleSection> : null}</main></MobileScroll></>;
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
  return <><AppHeader title="成长与权益" onBack={onBack} /><MobileScroll className="app-screen"><main className="screen-content sub-screen"><section className="wallet"><span>当前积分</span><strong>{growth.balance}</strong><em>L{level.level} {level.name} · 累计成长 {growth.lifetime} 分</em><span className="progress"><i style={{ width: `${level.progress}%` }} /></span><small>距下一等级还差 {Math.max(0, level.next - growth.lifetime)} 分</small></section><SectionTitle title="可兑换权益" /><section className="redeem-list">{BENEFITS.map((item) => <article key={item.id}><span><strong>{item.title}</strong><em>{item.description}</em></span><button disabled={growth.redeemed.includes(item.id)} onClick={() => onRedeem(item.id)}>{growth.redeemed.includes(item.id) ? "已兑换" : `${item.cost} 分兑换`}</button></article>)}</section><SectionTitle title="积分明细" /><section className="ledger">{growth.ledger.map((item) => <div key={item.id}><span><strong>{item.id === "starter" ? "新用户积分" : item.label}</strong><em>{item.date}</em></span><i className={item.points > 0 ? "income" : "expense"}>{item.points > 0 ? "+" : ""}{item.points}</i></div>)}</section><p className="boundary">邀请奖励将在好友完成注册后发放。</p></main></MobileScroll></>;
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
