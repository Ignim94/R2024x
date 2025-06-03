define(["require", "exports", "./BusSession"], function (require, exports, BusSession_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BusContainer = void 0;
    class BusContainer {
        constructor() {
            this._mapSession = new Map();
        }
        static getInstance() {
            if (!BusContainer.instance) {
                BusContainer.instance = new BusContainer();
            }
            return BusContainer.instance;
        }
        retrieve(key) {
            return this._mapSession.get(key);
        }
        async retrieveOrConnect(key, options) {
            let bus;
            if (options && options.newClient === true) {
                bus = undefined;
            }
            else {
                bus = this.retrieve(key);
            }
            if (bus == undefined) {
                return (0, BusSession_1.CreateBusSession)(key, options).then((busSession) => {
                    this._mapSession.set(key, busSession);
                    return busSession;
                });
            }
            else {
                return new Promise((resolve) => {
                    resolve(bus);
                });
            }
        }
        disconnect(key) {
            this._mapSession.delete(key);
        }
    }
    exports.BusContainer = BusContainer;
});
