define(["require", "exports", "DS/DELPXPFoundations/PXPWAFData"], function (require, exports, PXPWAFData_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GetSecurityCtxList = void 0;
    function GetSecurityCtxList(iUrl, iTenant) {
        if (iUrl == null || iTenant == null) {
            throw new Error('GetSecurityCtxList(url, tenant) - url and tenant are mandatory');
        }
        let pathWS = iUrl + '/resources/modeler/pno/person?current=true';
        pathWS += '&select=preferredcredentials&select=collabspaces';
        pathWS += '&tenant=' + iTenant;
        return PXPWAFData_1.WAFData.authenticatedRequest(pathWS, { method: 'GET', type: 'json' }).then((response) => {
            return response.data;
        });
    }
    exports.GetSecurityCtxList = GetSecurityCtxList;
});
