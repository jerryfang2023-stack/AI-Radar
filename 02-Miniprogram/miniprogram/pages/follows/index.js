const {entityFollows,hasAuthToken}=require('../../utils/payment.js');
const {TYPES}=require('../../utils/directory.js');
const { getFollowIds, toggleFollow } = require("../../utils/member.js");
const { getFundingData, refreshFundingData } = require("../../utils/live-data.js");
const { sectorName } = require("../../utils/ecosystem-insights.js");
const { getAccessState, openMembership } = require("../../utils/access.js");

Page({
  data: { categories: [], registrationOpen: false, entityItems:[], allEntityItems:[], followTypes:[{id:"all",name:"全部"},...TYPES,{id:"sectors",name:"赛道"}], followType:"all", onlyUpdates:false, followError:"" },
  onLoad() { refreshFundingData().then(() => this.refresh()); },
  onShow() {const identity=wx.getStorageSync('guanlan_api_token_v1')||'';if(this.identity!==identity)this.setData({allEntityItems:[],entityItems:[]});this.identity=identity;this.refresh();this.refreshEntities(); },
  onUnload(){this.disposed=true;},
  async refreshEntities(){if(!hasAuthToken()){this.setData({allEntityItems:[],entityItems:[]});return;}try{const result=await entityFollows();if(this.disposed)return;this.setData({allEntityItems:result.items.map(item=>({...item,typeLabel:TYPES.find(t=>t.id===item.type)?.name||'',categoriesText:item.unreadCount?`${item.unreadCount} 条新动态`:''})),followError:''});this.filterEntities();}catch(error){if(!this.disposed&&error.code!=='AUTH_CHANGED')this.setData({followError:'关注列表加载失败，点击重试'});}},
  filterEntities(){this.setData({entityItems:this.data.allEntityItems.filter(item=>(this.data.followType==='all'||item.type===this.data.followType)&&(!this.data.onlyUpdates||item.unreadCount>0))});},
  changeFollowType(e){this.setData({followType:e.currentTarget.dataset.type});this.filterEntities();},
  changeUpdateFilter(e){this.setData({onlyUpdates:e.currentTarget.dataset.value==='new'});this.filterEntities();},
  openDirectoryEntity(e){const {type,key}=e.currentTarget.dataset;wx.navigateTo({url:`/pages/entity-detail/index?type=${type}&key=${encodeURIComponent(key)}`});},
  refresh() {
    const followed = new Set(getFollowIds());
    const cards = getFundingData().index.cards;
    const groups = new Map();
    cards.forEach((card) => {
      const name = sectorName(card);
      const current = groups.get(name) || { name, count: 0, markets: new Set() };
      current.count += 1;
      current.markets.add(card.marketRegion);
      groups.set(name, current);
    });
    const categories = [...groups.values()].sort((a, b) => b.count - a.count).map((item) => {
      const market = item.markets.has("global") ? "global" : "china";
      const id = `sector:${market}:${item.name}`;
      return { id, name: item.name, count: item.count, market, followed: followed.has(id) };
    });
    this.setData({ categories });
  },
  toggle(event) {
    const id = event.currentTarget.dataset.id;
    const accessState = getAccessState();
    if (accessState === "expired") return openMembership();
    if (accessState === "unregistered") { this.pendingId = id; this.setData({ registrationOpen: true }); return; }
    this.applyToggle(id);
  },
  applyToggle(id) {
    const result = toggleFollow(id);
    this.refresh();
    const title = result.awarded ? `关注成功，获得 ${result.awarded} 积分` : (result.following ? "已关注" : "已取消关注");
    wx.showToast({ title, icon: "none" });
  },
  open(event) {
    const item = this.data.categories.find((candidate) => candidate.id === event.currentTarget.dataset.id);
    if (item) wx.navigateTo({ url: `/pages/sector-detail/index?sector=${encodeURIComponent(item.name)}&market=${item.market}` });
  },
  closeRegistration() { this.pendingId = ""; this.setData({ registrationOpen: false }); },
  continueAfterRegistration() { const id = this.pendingId; this.pendingId = ""; this.setData({ registrationOpen: false }); if (id) this.applyToggle(id); },
});
