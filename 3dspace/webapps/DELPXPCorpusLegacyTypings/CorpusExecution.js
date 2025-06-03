/// <amd-module name="DS/DELPXPCorpusLegacyTypings/CorpusExecution"/>
define("DS/DELPXPCorpusLegacyTypings/CorpusExecution", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SeverityValue = exports.ClassificationValue = void 0;
    var ClassificationValue;
    (function (ClassificationValue) {
        ClassificationValue["Create"] = "create";
        ClassificationValue["Assign"] = "assign";
        ClassificationValue["Active"] = "active";
        ClassificationValue["Review"] = "review";
        ClassificationValue["Closed"] = "closed";
    })(ClassificationValue = exports.ClassificationValue || (exports.ClassificationValue = {}));
    ;
    var SeverityValue;
    (function (SeverityValue) {
        SeverityValue["Low"] = "low";
        SeverityValue["Medium"] = "medium";
        SeverityValue["High"] = "high";
        SeverityValue["Urgent"] = "urgent";
    })(SeverityValue = exports.SeverityValue || (exports.SeverityValue = {}));
    ;
});
