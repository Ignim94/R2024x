define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CheckResult = exports.MakeResult = void 0;
    class MakeResult {
        static success(value) {
            return {
                ok: true,
                value: value
            };
        }
        static fail(err) {
            return err; // PXPError is compatible with 'ResultKO'
        }
    }
    MakeResult.OK = { ok: true };
    exports.MakeResult = MakeResult;
    class CheckResult {
        static isSuccess(result) {
            return (result.ok);
        }
        static isFail(result) {
            return (!result.ok);
        }
        static get(result) {
            return (result.value);
        }
    }
    exports.CheckResult = CheckResult;
});
