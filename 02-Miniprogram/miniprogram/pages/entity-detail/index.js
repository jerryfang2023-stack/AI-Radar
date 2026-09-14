const {isCompared,toggleCompare}=require('../../utils/storage.js');
const { getFundingData } = require("../../utils/live-data.js");
const { buildEntityLibrary, findEntity, companyEntityKey } = require("../../utils/entity-library.js");
const { resolveDetailAccess, contentLockReason, requestLockedContent, protectedResourceId } = require("../../utils/metered-access.js");
const { getAccessState, openMembership } = require("../../utils/access.js");
const { fetchProtectedContent, entityFollows, hasAuthToken } = require("../../utils/payment.js");

const TITLES = { companies: "企业档案", investors: "机构档案", people: "人物档案", products: "产品档案" };

Page({
  data: { title: "主体档案", type: "", entity: null, following: false, followBusy: false, contentError: "", sharedEntry: false, registrationOpen: false, contentLocked: false, lockReason: "" },

  onLoad(options) {
    this.type = options.type;
    const sharedEntry = options.from === "share";
    this.setData({ sharedEntry });
    if (wx.showShareMenu) wx.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    try { this.key = decodeURIComponent(options.key || ""); } catch { this.key = options.key || ""; }
    try { this.name = decodeURIComponent(options.name || ""); } catch { this.name = options.name || ""; }
    this.setData(resolveDetailAccess(`entity:${this.type || "unknown"}:${this.key || "unknown"}`));
    this.setData({ title: TITLES[this.type] || "主体档案", type: this.type });
    this.applyData(getFundingData());
    this.verifyServerAccess();
    this.refreshFollow();
  },

  async refreshFollow(){ if(!hasAuthToken())return;try{const result=await entityFollows();if(!this.disposed)this.setData({following:result.items.some(item=>item.resourceId===protectedResourceId(`entity:${this.type}:${this.key}`))});}catch(_){} },
  async toggleEntityFollow(){if(this.data.followBusy)return;const access=getAccessState();if(access==='unregistered'){this.pendingAction='follow';this.setData({registrationOpen:true});return;}if(access==='expired'&&!this.data.following)return openMembership();this.setData({followBusy:true});try{const result=await entityFollows(this.data.following?'DELETE':'POST',protectedResourceId(`entity:${this.type}:${this.key}`));if(!this.disposed)this.setData({following:result.following});}catch(error){if(error.code!=='AUTH_CHANGED')wx.showToast({title:error.message||'操作失败，请重试',icon:'none'});}finally{if(!this.disposed)this.setData({followBusy:false});}},
  onShow(){const identity=wx.getStorageSync('guanlan_api_token_v1')||'';if(this.identity!==undefined&&this.identity!==identity){this.setData({entity:null,following:false,contentLocked:true});this.applyData({index:getFundingData().index,details:{}});this.verifyServerAccess();this.refreshFollow();}this.identity=identity;},
  onUnload(){this.disposed=true;},
  compareCompany(){const id=this.data.entity?.rounds?.[0]?.id;if(!id)return;toggleCompare(id);wx.showToast({title:isCompared(id)?'已加入对比':'已取消对比',icon:'none'});},
  copySource(e){const url=e.currentTarget.dataset.url;if(/^https?:\/\//.test(url||''))wx.setClipboardData({data:url});},
  async verifyServerAccess() {
    if(!this.key)return;
    this.setData({contentError:''});
    try {
      const entity = await fetchProtectedContent("entity", protectedResourceId(`entity:${this.type}:${this.key}`));
      if(this.disposed)return;
      if (entity) this.setData({ entity: {...this.data.entity,...entity} });
      this.setData({ contentLocked: false, lockReason: "server" });
    } catch (error) {
      if(this.disposed||error.code==='AUTH_CHANGED')return;
      this.setData({contentError:error.statusCode===404?'资料暂不可用':'资料加载失败，点击重试'});
      if (error.accessState || error.statusCode === 401 || error.statusCode === 403 || error.code === "MEMBERSHIP_REQUIRED" || error.code === "AUTH_INVALID") this.setData({ contentLocked: true, lockReason: contentLockReason(error) });
    }
  },

  applyData(state) {
    const library = buildEntityLibrary(state.index.cards, state.details);
    const entity = findEntity(library, this.type, this.key);
    if (entity) this.setData({ entity,relatedProducts:this.type==='products'?(library.products||[]).filter(item=>item.key!==entity.key&&item.categories.some(c=>entity.categories.includes(c))).slice(0,5):[] });
    else if (this.type === "companies" && this.name && !this.data.entity) {
      // Protected person/investor profiles can reference a company that is newer
      // than the bundled funding index. Keep the relation navigable while the
      // authoritative server profile is fetched instead of reporting a false
      // "not found" from the stale local projection.
      this.setData({ entity: {
        key: companyEntityKey(this.name), type: "companies", name: this.name,
        initial: this.name.slice(0, 1).toUpperCase(), summary: "企业资料正在同步",
        headquarters: "暂未披露", productsText: "暂未披露", categoriesText: "AI 企业",
        categoriesFullText: "暂未分类", website: "", rounds: [], founders: [], investors: [],
        investorLinks: [], roundCount: 0, investorCount: 0, founderCount: 0,
      } });
    }
  },

  openFunding(event) {
    const id = event.currentTarget.dataset.id;
    if (id) this.openProtectedUrl(`/pages/detail/index?id=${id}`);
  },

  openEntity(event) {
    const { key, name, type } = event.currentTarget.dataset;
    // Protected person/investor profiles may carry canonical relation IDs, while
    // the Mini Program company library is keyed by the normalized company name.
    const resolvedKey = type === "companies" && name ? companyEntityKey(name) : key;
    const nameQuery = type === "companies" && name ? `&name=${encodeURIComponent(name)}` : "";
    if (resolvedKey && type) this.openProtectedUrl(`/pages/entity-detail/index?type=${type}&key=${encodeURIComponent(resolvedKey)}${nameQuery}`);
  },

  copyWebsite() {
    if (!this.data.entity?.website) return;
    wx.setClipboardData({ data: this.data.entity.website });
  },

  openProtectedUrl(url) {
    wx.navigateTo({ url });
  },

  unlockContent() { requestLockedContent(this); },
  closeRegistration() { this.pendingAction = ""; this.setData({ registrationOpen: false }); },
  continueAfterRegistration() {
    const action=this.pendingAction;
    const unlock = action === "content";
    this.pendingAction = "";
    this.setData({ registrationOpen: false });
    this.verifyServerAccess();
    if(action==='follow')this.toggleEntityFollow();
  },

  onShareAppMessage() {
    const entity = this.data.entity;
    const key = encodeURIComponent(this.key || "");
    const name = this.name ? `&name=${encodeURIComponent(this.name)}` : "";
    return {
      title: entity ? `${entity.name}｜${this.data.title}｜观澜 AI` : "观澜 AI 生态图谱",
      path: `/pages/entity-detail/index?type=${this.type || "companies"}&key=${key}${name}&from=share`,
    };
  },

  onShareTimeline() {
    const entity = this.data.entity;
    const key = encodeURIComponent(this.key || "");
    const name = this.name ? `&name=${encodeURIComponent(this.name)}` : "";
    return {
      title: entity ? `${entity.name}｜${this.data.title}｜观澜 AI` : "观澜 AI 生态图谱",
      query: `type=${this.type || "companies"}&key=${key}${name}&from=share`,
    };
  },
});
