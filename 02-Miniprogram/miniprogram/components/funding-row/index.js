Component({
  properties: {
    card: { type: Object, value: {} },
    selectable: { type: Boolean, value: false },
    selected: { type: Boolean, value: false },
    watched: { type: Boolean, value: false },
    dense: { type: Boolean, value: false },
  },
  methods: {
    open() { this.triggerEvent("open", { id: this.data.card.id }); },
    select() { this.triggerEvent("select", { id: this.data.card.id }); },
    watch() { this.triggerEvent("watch", { id: this.data.card.id }); },
  },
});
