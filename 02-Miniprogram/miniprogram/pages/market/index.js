const directoryPage = require('../../utils/directory-page.js');
const { getFundingData, refreshFundingData, getReportData, refreshReportData } = require("../../utils/live-data.js");
const capital = require("../../utils/capital-map.js");
const taxonomy = require("../../data/financing-taxonomy.js");
const { mergeCommunityEssays } = require("../../utils/community-essays.js");
const { syncTabBar } = require("../../utils/tab-bar.js");
const { track } = require("../../utils/analytics.js");

const MARKET_SCOPE_KEY = "guanlan_ecosystem_market_scope_v1";
const ECOSYSTEM_MODE_KEY = "guanlan_ecosystem_mode_v1";

Page({
  ...directoryPage,
  data: {
    ...directoryPage.data,
    mapRange: 6, mapMode: "heat", mapUnit: "count", mapExpanded: ["enterprise"], mapSelected: "enterprise", mapRows: [], capital: null, mapSheet: null, methodsOpen: false,
    mode: "map", marketRegion: "global", latestDate: "", signals: [], ranking: [], months: [], heatmap: [],
    activeType: "all", activeLabel: "最新观察", featured: null, reports: [],
    systemCheckDate: "", latestFundingDate: "", refreshFailed: false,
  },
  onLoad(options = {}) {
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    const savedRegion = wx.getStorageSync(MARKET_SCOPE_KEY);
    const savedMode = wx.getStorageSync(ECOSYSTEM_MODE_KEY);
    const mode = options.mode === "directory" || savedMode === "directory" ? "directory" : "map";
    if (["global", "china"].includes(savedRegion)) this.setData({ marketRegion: savedRegion });
    this.setData({ mode });
    this.applyFunding(getFundingData());
    this.applyDirectory();

  },
  onShow() {
    this.mapHidden = false;
    syncTabBar(this, 1);
    const savedMode = wx.getStorageSync(ECOSYSTEM_MODE_KEY);
    if (["map", "directory"].includes(savedMode) && savedMode !== this.data.mode) this.setData({ mode: savedMode });
    this.applyFunding(getFundingData());
    this.applyDirectory();
    return this.refreshData();
  },
  refreshData() {
    if (this.refreshRequest) return this.refreshRequest;
    // Keep the current content visible while checking both remote versions on every entry.
    this.refreshRequest = Promise.all([refreshFundingData(), refreshReportData(), this.refreshDirectory()]).then(([funding, reports]) => {
      this.applyFunding(funding);
      this.applyDirectory();
      this.setData({ refreshFailed: Boolean(funding.refreshFailed || reports.refreshFailed) });
    }).catch(() => this.setData({ refreshFailed: true })).finally(() => { this.refreshRequest = null; });
    return this.refreshRequest;
  },
  onPullDownRefresh() {
    return this.refreshData().then(() => {
      if (this.data.refreshFailed && wx.showToast) wx.showToast({ title: "刷新未完成，已保留原内容", icon: "none" });
    }).finally(() => wx.stopPullDownRefresh());
  },
  setMode(event) {
    const mode = event.currentTarget.dataset.mode;
    if (!["map", "directory"].includes(mode) || mode === this.data.mode) return;
    wx.setStorageSync(ECOSYSTEM_MODE_KEY, mode);
    this.setData({ mode },()=>this.drawMapCharts());
    track("filter_changed", { scope: "ecosystem", filter: "mode", value: mode });
  },
  applyFunding(state) {
    if(this.data.mapSheet)this.closeMapDetail();
    this.fundingState = state;
    const model = capital.build(state.index, taxonomy, {market:this.data.marketRegion,range:this.data.mapRange,unit:this.data.mapUnit,selected:this.data.mapSelected});
    this.capitalModel = model;
    const mapRows = model.rows.filter(r=>!r.child || this.data.mapExpanded.includes(r.parentId)).map(r=>({...r,expanded:this.data.mapExpanded.includes(r.id)}));
    const {cards, ...publicModel} = model;
    this.setData({capital:publicModel,mapRows,mapOptions:model.rows.map(r=>r.name),mapOptionIndex:model.rows.findIndex(r=>r.id===model.focus.id),mapSelected:model.focus.id,
      latestDate:model.date,systemCheckDate:model.date, mapSheet:null}, ()=>this.drawMapCharts());
  },
  updateMap(patch) { this.setData(patch,()=>this.applyFunding(this.fundingState || getFundingData())); },
  changeMapRange(e) { this.updateMap({mapRange:Number(e.currentTarget.dataset.range)}); },
  changeMapMode(e) { this.updateMap({mapMode:e.currentTarget.dataset.mode}); },
  toggleMapUnit() { this.updateMap({mapUnit:this.data.mapUnit==='count'?'share':'count'}); },
  toggleMapRow(e) { const id=e.currentTarget.dataset.id; const a=this.data.mapExpanded; this.updateMap({mapExpanded:a.includes(id)?a.filter(v=>v!==id):a.concat(id)}); },
  toggleMapAll() { this.updateMap({mapExpanded:this.data.mapExpanded.length===this.capitalModel.parents.length?[]:this.capitalModel.parents.map(p=>p.id)}); },
  changeMapFocus(e) { const r=this.capitalModel.rows[Number(e.detail.value)]; if(r)this.updateMap({mapSelected:r.id}); },
  openMapDetail(e) { const {id,month}=e.currentTarget.dataset; this.setData({mapSheet:capital.details(this.capitalModel,id,month)}); if(this.getTabBar)this.getTabBar()?.setData({hidden:true}); },
  closeMapDetail() { this.setData({mapSheet:null},()=>this.drawMapCharts()); if(this.getTabBar)this.getTabBar()?.setData({hidden:false}); },
  stopMapTap() {},
  openMapFunding(e) { const id=e.currentTarget.dataset.id; this.closeMapDetail(); if(id)wx.navigateTo({url:'/pages/detail/index?id='+encodeURIComponent(id)}); },
  toggleMethods() { this.setData({methodsOpen:!this.data.methodsOpen}); },
  retryMap() { return this.refreshData(); },
  drawMapCharts() {
    if(!wx.createCanvasContext || this.data.mode!=='map' || this.data.mapSheet || this.mapHidden || !this.capitalModel) return;
    const draw=()=>{
      if(this.data.mapSheet || this.mapHidden || this.data.mode!=='map')return;
      if(this.data.mapMode==='trend') this.data.mapRows.forEach(r=>this.paintMapChart('map-'+r.id,r,90,32,false));
      const width=(wx.getWindowInfo?wx.getWindowInfo():wx.getSystemInfoSync()).windowWidth-60;
      this.paintMapChart('map-focus',this.capitalModel.focus,width,166,true);
    };
    if(wx.nextTick)wx.nextTick(draw);else draw();
  },
  paintMapChart(id,row,width,height,labels) {
    if(!row)return;
    const ctx=wx.createCanvasContext(id,this), max=Math.max(1,...row.values), left=labels?20:2,top=labels?22:3,bottom=height-(labels?28:3);
    ctx.clearRect(0,0,width,height);
    if(labels){ctx.setStrokeStyle('#ece8df');[0,.5,1].forEach(f=>{ctx.beginPath();ctx.moveTo(left,bottom-f*(bottom-top));ctx.lineTo(width-12,bottom-f*(bottom-top));ctx.stroke();});}
    const pts=row.values.map((v,i)=>[left+i*(width-left-14)/Math.max(1,row.values.length-1),bottom-v/max*(bottom-top)]);
    ctx.setStrokeStyle(labels?'#123b59':'#af8c45');ctx.setLineWidth(labels?2:1.5);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.stroke();
    if(labels){ctx.setFontSize(10);ctx.setTextAlign('center');pts.forEach((p,i)=>{ctx.setFillStyle('#af8c45');ctx.beginPath();ctx.arc(p[0],p[1],3,0,Math.PI*2);ctx.fill();ctx.setFillStyle('#6f7f8f');ctx.fillText(String(row.values[i]),p[0],p[1]-8);ctx.fillText(this.capitalModel.months[i].label,p[0],height-6);});}
    ctx.draw();
  },
  changeMarket(event) {
    const marketRegion = event.currentTarget.dataset.region;
    if (!["global", "china"].includes(marketRegion) || marketRegion === this.data.marketRegion) return;
    wx.setStorageSync(MARKET_SCOPE_KEY, marketRegion);
    this.setData({ marketRegion }, () => {
      track("filter_changed", { scope: "ecosystem", filter: "marketRegion", value: marketRegion });
      this.applyFunding(getFundingData());
    });
  },
  openSector(event) {
    const sector = event.currentTarget.dataset.sector;
    if (!sector) return;
    track("content_opened", { scope: "ecosystem_sector", sector });
    wx.navigateTo({ url: `/pages/sector-detail/index?sector=${encodeURIComponent(sector)}&market=${this.data.marketRegion}` });
  },
  refreshReports(type) {
    const reportIndex = getReportData().index;
    const community = mergeCommunityEssays(reportIndex.reports);
    const editorialReports = reportIndex.reports.filter((item) => item.type !== "community");
    const all = [...community, ...editorialReports].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const reports = type === "all" ? all : type === "community" ? community : editorialReports.filter((item) => item.type === type);
    const labels = { all: "最新观察", community: "社群精华", weekly: "周报", monthly: "月报" };
    this.setData({ activeType: type, activeLabel: labels[type], featured: reports[0] || null, reports: reports.slice(1) });
  },
  switchType(event) { this.refreshReports(event.currentTarget.dataset.type); },
  openReport(event) {
    const id = event.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: `/pages/report-detail/index?id=${id}` });
  },
  onHide() { this.mapHidden=true; this.closeMapDetail(); },
  onUnload() { this.mapHidden=true; this.directoryDisposed = true; },
  onReachBottom() { if(this.data.mode === "directory") this.moreDirectory(); },
  onShareAppMessage() {
    return this.data.mode === "directory"
      ? { title: "观澜 AI 生态名录", path: "/pages/market/index?mode=directory" }
      : { title: "观澜 AI 生态图谱", path: "/pages/market/index" };
  },
  onShareTimeline() { return { title: this.data.mode === "directory" ? "观澜 AI 生态名录" : "观澜 AI 生态图谱" }; },
});
