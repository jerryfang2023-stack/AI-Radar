Component({
  properties: {
    card: { type: Object, value: {} },
    selected: { type: Boolean, value: false },
    watched: { type: Boolean, value: false },
    dense: { type: Boolean, value: false },
  },
  methods: {
    open() { this.triggerEvent("open", { id: this.data.card.id }); },
    watch() { this.triggerEvent("watch", { id: this.data.card.id }); },
  },
});
