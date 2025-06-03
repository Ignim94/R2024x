define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.enFeaturesBusOptions = exports.enObsoleteBusStatus = exports.enConnectionBusStatus = exports.enErrorPolicies = exports.enMessagePolicies = exports.enConnectionStatus = exports.enAutoConnectPolicies = exports.enReconnectPolicies = exports.enInterceptResult = void 0;
    var enInterceptResult;
    (function (enInterceptResult) {
        enInterceptResult[enInterceptResult["Continue"] = 0] = "Continue";
        enInterceptResult[enInterceptResult["Intercept"] = 1] = "Intercept";
    })(enInterceptResult = exports.enInterceptResult || (exports.enInterceptResult = {}));
    var enReconnectPolicies;
    (function (enReconnectPolicies) {
        enReconnectPolicies[enReconnectPolicies["no"] = 0] = "no";
        enReconnectPolicies[enReconnectPolicies["onlyNetwork"] = 1] = "onlyNetwork";
        enReconnectPolicies[enReconnectPolicies["all"] = 2] = "all";
    })(enReconnectPolicies = exports.enReconnectPolicies || (exports.enReconnectPolicies = {}));
    var enAutoConnectPolicies;
    (function (enAutoConnectPolicies) {
        enAutoConnectPolicies[enAutoConnectPolicies["manual"] = 0] = "manual";
        enAutoConnectPolicies[enAutoConnectPolicies["atCreate"] = 1] = "atCreate";
        enAutoConnectPolicies[enAutoConnectPolicies["onDemand"] = 2] = "onDemand";
    })(enAutoConnectPolicies = exports.enAutoConnectPolicies || (exports.enAutoConnectPolicies = {}));
    var enConnectionStatus;
    (function (enConnectionStatus) {
        enConnectionStatus[enConnectionStatus["no_connected"] = -1] = "no_connected";
        enConnectionStatus[enConnectionStatus["pending"] = 0] = "pending";
        enConnectionStatus[enConnectionStatus["connected"] = 1] = "connected";
        enConnectionStatus[enConnectionStatus["disconnected"] = 2] = "disconnected";
    })(enConnectionStatus = exports.enConnectionStatus || (exports.enConnectionStatus = {}));
    var enMessagePolicies;
    (function (enMessagePolicies) {
        enMessagePolicies[enMessagePolicies["sendOnlyServer"] = 1] = "sendOnlyServer";
        enMessagePolicies[enMessagePolicies["sendOnlyLocal"] = 2] = "sendOnlyLocal";
        enMessagePolicies[enMessagePolicies["sendAll"] = 3] = "sendAll";
    })(enMessagePolicies = exports.enMessagePolicies || (exports.enMessagePolicies = {}));
    var enErrorPolicies;
    (function (enErrorPolicies) {
        enErrorPolicies[enErrorPolicies["asFetch"] = 0] = "asFetch";
        enErrorPolicies[enErrorPolicies["catchMessageError"] = 1] = "catchMessageError";
        enErrorPolicies[enErrorPolicies["catchMessageErrorStatus"] = 2] = "catchMessageErrorStatus";
        enErrorPolicies[enErrorPolicies["catchAll"] = 3] = "catchAll"; // combine catchMEssageError AND catchMessageErrorStatus
    })(enErrorPolicies = exports.enErrorPolicies || (exports.enErrorPolicies = {}));
    var enConnectionBusStatus;
    (function (enConnectionBusStatus) {
        enConnectionBusStatus[enConnectionBusStatus["no_connected"] = 0] = "no_connected";
        enConnectionBusStatus[enConnectionBusStatus["connected"] = 1] = "connected";
        enConnectionBusStatus[enConnectionBusStatus["connection_failed"] = 2] = "connection_failed";
    })(enConnectionBusStatus = exports.enConnectionBusStatus || (exports.enConnectionBusStatus = {}));
    var enObsoleteBusStatus;
    (function (enObsoleteBusStatus) {
        enObsoleteBusStatus["Connected"] = "connected";
        enObsoleteBusStatus["Disconnected"] = "disconnected";
        enObsoleteBusStatus["Error"] = "error";
    })(enObsoleteBusStatus = exports.enObsoleteBusStatus || (exports.enObsoleteBusStatus = {}));
    var enFeaturesBusOptions;
    (function (enFeaturesBusOptions) {
        enFeaturesBusOptions[enFeaturesBusOptions["enFeaturesDefault"] = 0] = "enFeaturesDefault";
        enFeaturesBusOptions[enFeaturesBusOptions["enCheckHypervisorConnectionOnCreate"] = 2] = "enCheckHypervisorConnectionOnCreate";
    })(enFeaturesBusOptions = exports.enFeaturesBusOptions || (exports.enFeaturesBusOptions = {}));
});
