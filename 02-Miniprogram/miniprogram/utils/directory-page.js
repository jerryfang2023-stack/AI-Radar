const {getFundingData,refreshFundingEntities}=require('./live-data.js');
const {TYPES,directory}=require('./directory.js');
module.exports={
 data:{directoryTypes:TYPES,directoryTabs:[{id:'all',name:'全部'},...TYPES],directoryType:'all',directoryMarket:'china',directoryQuery:'',directoryInput:'',directoryCategory:'全部赛道',directoryCategories:['全部赛道'],directoryCategoryIndex:0,directoryItems:[],directoryGroups:[],directoryTotal:0,directoryMore:false,directoryLimit:20},
 applyDirectory(){const result=directory(getFundingData(),{type:this.data.directoryType,market:this.data.directoryMarket,query:this.data.directoryQuery,category:this.data.directoryCategory,limit:this.data.directoryLimit});this.setData({directoryItems:result.items,directoryGroups:result.groups,directoryTotal:result.total,directoryMore:result.hasMore,directoryCategories:result.categories,directoryCategory:result.category,directoryCategoryIndex:result.categories.indexOf(result.category)});},
 async refreshDirectory(){await refreshFundingEntities();if(!this.directoryDisposed)this.applyDirectory();},
 changeDirectoryMarket(e){const market=e.currentTarget.dataset.market;if(!['china','global'].includes(market))return;this.setData({directoryMarket:market,directoryLimit:20});this.applyDirectory();},
 changeDirectoryType(e){this.setData({directoryType:e.currentTarget.dataset.type,directoryLimit:20,directoryCategory:'全部赛道'});this.applyDirectory();},
 changeDirectoryCategory(e){this.setData({directoryCategory:this.data.directoryCategories[Number(e.detail.value)]||'全部赛道',directoryLimit:20});this.applyDirectory();},
 directoryInput(e){this.setData({directoryInput:e.detail.value});},
 searchDirectory(){this.setData({directoryQuery:this.data.directoryInput.trim(),directoryLimit:20});this.applyDirectory();if(wx.hideKeyboard)wx.hideKeyboard();},
 moreDirectory(){this.setData({directoryLimit:this.data.directoryLimit+20});this.applyDirectory();},
 openDirectory(e){const type=e.currentTarget.dataset.type||'all';wx.navigateTo({url:`/pages/directory/index?type=${type}&market=${this.data.directoryMarket}`});},
 openDirectoryEntity(e){const {type,key,name}=e.currentTarget.dataset;wx.navigateTo({url:`/pages/entity-detail/index?type=${type}&key=${encodeURIComponent(key)}&name=${encodeURIComponent(name||'')}`});},
 clearDirectory(){this.setData({directoryQuery:'',directoryInput:'',directoryCategory:'全部赛道',directoryLimit:20});this.applyDirectory();},
};
