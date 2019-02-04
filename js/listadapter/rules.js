import { store, fetchMethodWithTimeout, createNotification } from '../app.js';

class StoreView {
    constructor() { this.items = []; }
    stores() { return { "rules": "items" } };
    async getall() {
        return store.get("rest/rules", "rules").then(items => this.items = items);
    }
    dispose() {
    }
}

const schema = {
    uri: 'http://openhab.org/schema/rules-schema.json',
    fileMatch: ["http://openhab.org/schema/rules-schema.json"],
    schema: {
        type: 'array',
        items: { "$ref": "#/definitions/item" },
        definitions: {
            item: {
                type: "object",
                description: "An openHAB thing",
                required: ["uid", "name"],
                properties: {
                    link: { type: "string", description: "Internal URI information for openHAB REST clients" },
                    editable: { type: "boolean", description: "Items defined via old .item files are not editable" },
                    uid: { type: "string", description: "A unique ID for this thing", minLength: 2 },
                    name: { type: "string", description: "A friendly name", minLength: 2 },
                    tags: { type: "array", "uniqueItems": true, description: "Tags of this item" },
                    // config: { // reference the second schema.. demo
                    //     $ref: 'http://myserver/bar-schema.json', 
                    // },
                }
            }
        }
    },
}

const RulesMixin = {
    methods: {
        rulesStatusinfo: function () { return this.item.status ? this.item.status.status.toLowerCase().replace(/^\w/, c => c.toUpperCase()) : "Unknown"; },
        rulesStatusDetails: function () { return this.item.status ? this.item.status.statusDetail : ""; },
        rulesStatusmessage: function () { return this.item.status ? this.item.status.description : ""; }, //TODO
        rulesStatusBadge: function () {
            const status = this.item.status ? this.item.status.status : "";
            switch (status) {
                case "RUNNING": return "badge badge-success";
                case "UNINITIALIZED": return "badge badge-danger";
                case "IDLE": return "badge badge-info";
            }
            return "badge badge-light";
        },
        run: function (target) {
            if (target.classList.contains("disabled")) return;
            target.classList.add("disabled");
            fetchMethodWithTimeout(store.host + "/rest/rules/" + this.item.uid + "/runnow", "POST", "", null)
                .then(r => {
                    createNotification(null, `Run ${this.item.name}`, false, 1500);
                    setTimeout(() => target.classList.remove("disabled"), 1000);
                }).catch(e => {
                    setTimeout(() => target.classList.remove("disabled"), 1000);
                    createNotification(null, `Failed ${this.item.name}: ${e}`, false, 4000);
                })
        },
    }
}

const mixins = [RulesMixin];
const listmixins = [];
const runtimekeys = ["link", "editable", "status", "runcounter"];
const ID_KEY = "UID";

export { mixins, listmixins, schema, runtimekeys, StoreView, ID_KEY };