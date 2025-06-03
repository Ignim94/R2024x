/// <amd-module name="DS/DELPXPFoundations/DELPXPFoundations"/>
define("DS/DELPXPFoundations/DELPXPFoundations", ["require", "exports", "./bus/BusContainer", "./bus/BusType", "./bus/BusType", "./typeGuard", "DS/DELPXPFoundations/PXPEventTransport", "./PXPSpace", "./bus/BusDisconnected", "./event/Transport", "./auth/Auth", "./type/PXPError", "./type/PXPResult", "./type/PortableUID", "./PXPBackendConnect", "./corpus/PXPSerializer", "./corpus/CorpusManager", "./corpus/PXPObject"], function (require, exports, BusContainer_1, BusType_1, BusType_2, typeGuard_1, Event, PXPSpace_1, BusDisconnected_1, Transport_1, Auth_1, PXPError_1, PXPResult_1, PortableUID_1, PXPBackendConnect_1, PXPSerializer_1, CorpusManager_1, PXPObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SetObjects = exports.ArrayObjects = exports.BagObjects = exports.PXPObject = exports.ReviverPolicies = exports.CorpusManager = exports.enDeSerializerLevel = exports.enSerializerLevel = exports.serializeToPXPJSON = exports.deserializeFromPXPJSON = exports.reviverFinalizeObject = exports.ConnectToPXPBackend = exports.BusStatus = exports.PortableUID = exports.MakeResult = exports.CheckResult = exports.enTypeError = exports.StdCode = exports.PXPError = exports.AuthProfile = exports.KeySignal = exports.Transport = exports.EventFlag = exports.EventType = exports.EventStatus = exports.HeaderKey = exports.useDisconnectedEndpointClient = exports.GetSecurityCtxList = exports.RetrieveBusEK = exports.ConnectToBusEK = exports.Event = exports.isTypeEndpointClient = exports.enMessagePolicies = exports.enFeaturesBusOptions = exports.enObsoleteBusStatus = exports.enConnectionBusStatus = exports.enReconnectPolicies = exports.enAutoConnectPolicies = exports.enConnectionStatus = exports.enInterceptResult = void 0;
    Object.defineProperty(exports, "BusStatus", { enumerable: true, get: function () { return BusType_1.enObsoleteBusStatus; } });
    Object.defineProperty(exports, "enInterceptResult", { enumerable: true, get: function () { return BusType_2.enInterceptResult; } });
    Object.defineProperty(exports, "enConnectionStatus", { enumerable: true, get: function () { return BusType_2.enConnectionStatus; } });
    Object.defineProperty(exports, "enAutoConnectPolicies", { enumerable: true, get: function () { return BusType_2.enAutoConnectPolicies; } });
    Object.defineProperty(exports, "enReconnectPolicies", { enumerable: true, get: function () { return BusType_2.enReconnectPolicies; } });
    Object.defineProperty(exports, "enConnectionBusStatus", { enumerable: true, get: function () { return BusType_2.enConnectionBusStatus; } });
    Object.defineProperty(exports, "enObsoleteBusStatus", { enumerable: true, get: function () { return BusType_2.enObsoleteBusStatus; } });
    Object.defineProperty(exports, "enFeaturesBusOptions", { enumerable: true, get: function () { return BusType_2.enFeaturesBusOptions; } });
    Object.defineProperty(exports, "enMessagePolicies", { enumerable: true, get: function () { return BusType_2.enMessagePolicies; } });
    Object.defineProperty(exports, "isTypeEndpointClient", { enumerable: true, get: function () { return typeGuard_1.isTypeEndpointClient; } });
    exports.Event = Event;
    function ConnectToBusEK(key, options) {
        return BusContainer_1.BusContainer.getInstance().retrieveOrConnect(key, options);
    }
    exports.ConnectToBusEK = ConnectToBusEK;
    function RetrieveBusEK(key) {
        return BusContainer_1.BusContainer.getInstance().retrieve(key);
    }
    exports.RetrieveBusEK = RetrieveBusEK;
    Object.defineProperty(exports, "GetSecurityCtxList", { enumerable: true, get: function () { return PXPSpace_1.GetSecurityCtxList; } });
    Object.defineProperty(exports, "useDisconnectedEndpointClient", { enumerable: true, get: function () { return BusDisconnected_1.useDisconnectedEndpointClient; } });
    Object.defineProperty(exports, "HeaderKey", { enumerable: true, get: function () { return Transport_1.HeaderKey; } });
    Object.defineProperty(exports, "EventStatus", { enumerable: true, get: function () { return Transport_1.EventStatus; } });
    Object.defineProperty(exports, "EventType", { enumerable: true, get: function () { return Transport_1.EventType; } });
    Object.defineProperty(exports, "EventFlag", { enumerable: true, get: function () { return Transport_1.EventFlag; } });
    Object.defineProperty(exports, "Transport", { enumerable: true, get: function () { return Transport_1.Transport; } });
    Object.defineProperty(exports, "KeySignal", { enumerable: true, get: function () { return Transport_1.KeySignal; } });
    Object.defineProperty(exports, "AuthProfile", { enumerable: true, get: function () { return Auth_1.Auth; } });
    Object.defineProperty(exports, "PXPError", { enumerable: true, get: function () { return PXPError_1.PXPError; } });
    Object.defineProperty(exports, "StdCode", { enumerable: true, get: function () { return PXPError_1.StdCode; } });
    Object.defineProperty(exports, "enTypeError", { enumerable: true, get: function () { return PXPError_1.enTypeError; } });
    Object.defineProperty(exports, "CheckResult", { enumerable: true, get: function () { return PXPResult_1.CheckResult; } });
    Object.defineProperty(exports, "MakeResult", { enumerable: true, get: function () { return PXPResult_1.MakeResult; } });
    Object.defineProperty(exports, "PortableUID", { enumerable: true, get: function () { return PortableUID_1.PortableUID; } });
    Object.defineProperty(exports, "ConnectToPXPBackend", { enumerable: true, get: function () { return PXPBackendConnect_1.ConnectToPXPBackend; } });
    Object.defineProperty(exports, "reviverFinalizeObject", { enumerable: true, get: function () { return PXPSerializer_1.reviverFinalizeObject; } });
    Object.defineProperty(exports, "deserializeFromPXPJSON", { enumerable: true, get: function () { return PXPSerializer_1.deserializeFromPXPJSON; } });
    Object.defineProperty(exports, "serializeToPXPJSON", { enumerable: true, get: function () { return PXPSerializer_1.serializeToPXPJSON; } });
    Object.defineProperty(exports, "enSerializerLevel", { enumerable: true, get: function () { return PXPSerializer_1.enSerializerLevel; } });
    Object.defineProperty(exports, "enDeSerializerLevel", { enumerable: true, get: function () { return CorpusManager_1.enDeSerializerLevel; } });
    Object.defineProperty(exports, "CorpusManager", { enumerable: true, get: function () { return CorpusManager_1.CorpusManager; } });
    Object.defineProperty(exports, "ReviverPolicies", { enumerable: true, get: function () { return CorpusManager_1.ReviverPolicies; } });
    Object.defineProperty(exports, "PXPObject", { enumerable: true, get: function () { return PXPObject_1.PXPObject; } });
    Object.defineProperty(exports, "BagObjects", { enumerable: true, get: function () { return PXPObject_1.BagObjects; } });
    Object.defineProperty(exports, "ArrayObjects", { enumerable: true, get: function () { return PXPObject_1.ArrayObjects; } });
    Object.defineProperty(exports, "SetObjects", { enumerable: true, get: function () { return PXPObject_1.SetObjects; } });
});
