(function () {
	'use strict';
    var editor;
    // Define syntax (to put in a JS file)
    CodeMirror.defineSimpleMode("otscript", {
    start: [
        {regex: /"(?:[^"]|"["rlt])*"/, token: "string"},
        {regex: /`(?:[^`]|``)*`/, token: "variable-3"},
        {regex: /\b(?:CLASS|ATTRIBUTE|METHOD|TMP|THIS|EACH|IF|CATCH|RAISE|NEW|LABEL|HELPTEXT|CATEGORY|I18N)\b/, token: "keyword"},
        {regex: /-(?:doc)\b/, token: "meta"},
        {regex: /\b(?:TRUE|FALSE|VOID)\b/, token: "atom"},
        {regex: /[-+]?(?:\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/i, token: "number"},
        {regex: /\/\/.*/, token: "comment"},
        {regex: /\/\*/, token: "comment", next: "comment"},
        {regex: /[-+\/*=<>:$]+/, token: "operator"},
        {regex: /[\{\[\(]/, indent: true},
        {regex: /[\}\]\)]/, dedent: true},
        {regex: /[a-z$][\w$]*/i, token: "variable-2"},
    ],
    // The multi-line comment state.
    comment: [
        {regex: /.*?\*\//, token: "comment", next: "start"},
        {regex: /.*/, token: "comment"}
    ],
    meta: {
        dontIndentStates: ["comment"],
        lineComment: "//"
    }
    });
}())
