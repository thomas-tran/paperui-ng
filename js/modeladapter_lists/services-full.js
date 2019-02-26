import { store } from '../app.js';

class ModelAdapter {
  constructor() {
    this.STORE_ITEM_INDEX_PROP = Object.freeze("id");
    this.runtimeKeys = []; this.items = []; this.config = {}; this.configDescription = {};
  }
  stores() { return { "services": "items" } };
  sortStore() { return "services" };
  async getall(options = null) {
    await this.get(options);
  }
  async getConfig(serviceid, configDescriptionURI) {
    this.configDescription[serviceid] = await store.get("config-descriptions", configDescriptionURI, { force: true });
    this.config[serviceid] = await store.get("service-config", serviceid, { force: true });
  }
  async get(options = null) {
    let services = await store.get("services", null, options);
    for (let service of services) {
      if (service.configDescriptionURI)
        await this.getConfig(service.id, service.configDescriptionURI);
    }
    this.items = services;
  }
  dispose() {
  }
}

const ListItemMixin = {
  computed: {
    configuration() {
      return this.$root.configDescription[this.item.id];
    },
  },
  methods: {
    configValue(param) {
      return this.$root.config[this.item.id][param.name];
    }
  }
};

const mixins = [ListItemMixin];
const listmixins = [];

export { mixins, listmixins, ModelAdapter };
