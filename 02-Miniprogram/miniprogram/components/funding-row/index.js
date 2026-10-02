const {companyDisplayName}=require('../../utils/company-display.js');
Component({
  data: {displayName:'',displayInitial:''},
  observers: { card(card) {const displayName=companyDisplayName(card?.company,card?.marketRegion);this.setData({displayName,displayInitial:displayName.slice(0,1).toUpperCase()});} },
  properties: {
    card: { type: Object, value: {} },
    selected: { type: Boolean, value: false },
    watched: { type: Boolean, value: false },
    dense: { type: Boolean, value: false },
    showWatch: { type: Boolean, value: true },
  },
  methods: {
    open() { this.triggerEvent("open", { id: this.data.card.id }); },
    watch() { this.triggerEvent("watch", { id: this.data.card.id }); },
  },
});
