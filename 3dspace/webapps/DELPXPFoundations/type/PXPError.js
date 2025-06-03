define(["require", "exports", "DS/Logger/Logger"], function (require, exports, Logger) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PXPError = exports.enTypeError = exports.StdCode = void 0;
    var _logger = Logger.getLogger('PXP.SYS');
    /**
     * Standard "Foundations" Code -- must be synchronized with DELPXPFoundationsErrorCode - Here only "Classic Error"
     * @readonly
     * @enum {number}
     */
    var StdCode;
    (function (StdCode) {
        StdCode[StdCode["NoError"] = 0] = "NoError";
        StdCode[StdCode["GenericError"] = 1] = "GenericError";
        StdCode[StdCode["MemoryBadAlloc"] = 2] = "MemoryBadAlloc";
        StdCode[StdCode["InvalidArgument"] = 3] = "InvalidArgument";
        StdCode[StdCode["OutofRange"] = 4] = "OutofRange";
        StdCode[StdCode["PXPErrorFromJVariant"] = 10] = "PXPErrorFromJVariant";
        StdCode[StdCode["TransportStreamError"] = 11] = "TransportStreamError";
    })(StdCode = exports.StdCode || (exports.StdCode = {}));
    /**
     * Typology of errors (code, hresult, exception, http, user).
     * Must be synchronized with DELPXPFoundations/DELPXPError.h/enum enTypeError.
     * @readonly
     * @enum {char}
     */
    var enTypeError;
    (function (enTypeError) {
        enTypeError["code"] = "C";
        enTypeError["hresult"] = "X";
        enTypeError["exception"] = "R";
        enTypeError["http"] = "H";
        enTypeError["user"] = "U";
    })(enTypeError = exports.enTypeError || (exports.enTypeError = {}));
    class PXPError /*extends Error*/ {
        constructor(message, code = StdCode.GenericError, type = enTypeError.code, domain = 'JSError', source = null) {
            // ResultError compliant
            this.ok = false;
            this.error = this;
            //super(message)
            this.errorCode = code;
            this.errorType = type;
            this.errorMessage = message;
            this.errorDomain = domain;
            this.errorSource = source;
        }
        getCode() {
            return this.errorCode;
        }
        getType() {
            return this.errorType;
        }
        getMessage() {
            return this.errorMessage;
        }
        getDomain() {
            return this.errorDomain;
        }
        hasSourceError() {
            return this.errorSource != null;
        }
        getSourceError() {
            return this.errorSource;
        }
        getCodeAsString() {
            switch (this.errorType) {
                // Display code as number
                case enTypeError.http:
                    return '' + this.errorType + this.errorCode.toString(10);
                case enTypeError.code:
                case enTypeError.exception:
                case enTypeError.user:
                case enTypeError.hresult:
                    if (0 === this.errorCode) {
                        return 'OK';
                    }
                    return '' + this.errorType + this.errorCode.toString(16).toUpperCase();
            }
        }
        toString() {
            let ret;
            if (0 == this.errorDomain.length)
                ret = '[' + this.getCodeAsString() + '] ';
            else
                ret = '[' + this.errorDomain + '/' + this.getCodeAsString() + '] ';
            ret += this.errorMessage;
            if (this.errorSource instanceof PXPError) {
                ret += ' -> ' + this.errorSource.toString();
            }
            return ret;
        }
        toNativeError() {
            return new Error(this.toString());
        }
        toJSON() {
            let obj = {
                code: '' + this.getCodeAsString(),
                message: this.errorMessage,
                domain: this.errorDomain,
            };
            if (this.errorSource instanceof PXPError) {
                obj.source = this.errorSource.toJSON();
            }
            return obj;
        }
        static CreateFromJSON(json) {
            let stream = null;
            if (typeof json === 'string') {
                // if it's a string, parse it first
                try {
                    let s = JSON.parse(json);
                    if (PXPError.isCompatible(s)) {
                        stream = s;
                    }
                    _logger.debug("PXPError.CreateFromJSON: not compatible json >>" + json);
                }
                catch (err) {
                    // invalid stream...
                    _logger.debug("PXPError.CreateFromJSON: invalid json >>" + json);
                }
            }
            else {
                stream = json;
            }
            if (stream !== null) {
                let codeAsString = stream.code; // PXPErrorFromJVariant
                let msg = stream.message || '';
                let domain = stream.domain || '';
                let eType;
                let cType = codeAsString[0];
                let code = NaN;
                switch (cType) {
                    case 'H': //enTypeError.http:
                        eType = enTypeError.http;
                        code = Number.parseInt(codeAsString.substring(1), 10);
                        break;
                    case 'C':
                        eType = enTypeError.code;
                        code = Number.parseInt(codeAsString.substring(1), 16);
                        break;
                    case 'R':
                        eType = enTypeError.exception;
                        code = Number.parseInt(codeAsString.substring(1), 16);
                        break;
                    case 'U':
                        eType = enTypeError.user;
                        code = Number.parseInt(codeAsString.substring(1), 16);
                        break;
                    case 'X':
                        eType = enTypeError.hresult;
                        code = Number.parseInt(codeAsString.substring(1), 16);
                        break;
                    default:
                        eType = null;
                        break;
                }
                let sourceError = null;
                if (stream.source) {
                    sourceError = PXPError.CreateFromJSON(stream.source);
                }
                if (!isNaN(code) && eType != null) {
                    return new PXPError(msg, code, eType, domain, sourceError);
                }
            }
            return new PXPError('invalid stream PXPError', StdCode.PXPErrorFromJVariant, enTypeError.code, 'Foundations'); // PXPErrorFromJVariant
        }
        static isCompatible(stream) {
            if (stream &&
                typeof stream === 'object' &&
                'code' in stream &&
                typeof stream.code === 'string' &&
                'message' in stream &&
                typeof stream.message === 'string'
            //&& 'domain' in stream &&              // Domain is optional
            //typeof stream.domain === 'string'
            )
                return true;
            else
                return false;
        }
    }
    exports.PXPError = PXPError;
});
