/*global define */
/**
 * PXPError, class uses to transport error information.
 * @module   DS/DELPXPFoundations/PXPError
 */
define('DS/DELPXPFoundationsLegacy/PXPError', ['DS/DELPXPFoundationsLegacy/PXPUtils'], function (Utils) {
    'use strict';
    
    /** 
     * Standard "Foundations" Code -- must be synchronized with DELPXPFoundationsErrorCode - Here only "Classic Error"
     * @readonly
     * @enum {number} 
     */
    const StdCode = Object.freeze({
        NoError: 0,
        GenericError: 1,                // Generic Error
        MemoryBadAlloc: 2,
        InvalidArgument: 3,             // InvalidArgument
        OutofRange: 4,                  // Out of Range

        PXPErrorFromJVariant: 10
    });    
    
    /** 
     * Typology of errors (code, hresult, exception, http, user).
     * Must be synchronized with DELPXPFoundations/DELPXPError.h/enum enTypeError.
     * @readonly
     * @enum {number} 
     */
    const TypeError = Object.freeze({
        code: 'C',          // source: Code 
        hresult: 'X',       // source: HRESULT 
        exception: 'R',     // source: Exception 
        http: 'H',          // source: Code HTTP
        user: 'U'           // source: User
    });

    /**
     * Create a new PXPError.
     * @class
     * @param {string} iMessage - Error text message
     * @param {number} iErrorCode - Error code
     * @param {TypeError} iErrorType - Typology of error (code, hresult, exception, http, user).
     * @param {string} [iErrorDomain=JSError] - Error domain.
     * @param {PXPError} [iErrorSource] - Source Error (to chain error).
     */
    function PXPError(iMessage, iErrorCode, iErrorType, iErrorDomain, iErrorSource ) {
        if ( Utils.isUndefined(iMessage) && Utils.isUndefined(iErrorCode) ) {
            this.errorCode= 0;  // no error
            this.errorType= TypeError.code;
        } else {
            this.errorMessage = iMessage;
            this.errorCode = iErrorCode || 1;  // 1 == Generic_Error
        }
        this.errorDomain= Utils.isDefined(iErrorDomain) ? iErrorDomain : 'JSError';
        this.errorType = iErrorType || TypeError.code;
        this.errorSource= iErrorSource || null;
    }

    /**
     * returns Typology of error (code, hresult, exception, http, user).
     * @returns {TypeError}
     */
    PXPError.prototype.getType = function () {
        return this.errorType;
    };

    /**
     * returns Error message.
     * @returns {string} Error message
     */
    PXPError.prototype.getMessage = function () {
        return this.errorMessage;
    };

    /**
     * returns Error code.
     * @returns {number} Error code
     */
    PXPError.prototype.getCode = function () {
        return this.errorCode;
    };

    /**
     * returns Error domain.
     * @returns {number} Error domain
     */
    PXPError.prototype.getDomain = function () {
        return this.errorDomain;
    };

    /**
     * @returns {boolean} True, if there are an Error source information.
     */
    PXPError.prototype.hasSourceError = function () {
        return Utils.isObject(this.errorSource);
    };

    /**
     * @returns {PXPError} returns Error source information (or null if there are no source).
     */
    PXPError.prototype.getSourceError = function () {
        return this.errorSource;
    };

    /**
     * returns the full error code, composed of Domain, Error type and error code.
     * @returns {string} returns full Code.
     */
    PXPError.prototype.getCodeAsString = function () {
        switch (this.errorType) {
            // Display code as number
            case TypeError.http:
                return '' + this.errorType + this.errorCode.toString(10);

            case TypeError.code:
            case TypeError.exception:
            case TypeError.user:
            case TypeError.hresult:
                if (0 === this.errorCode) {
                    return "OK";
                }
                return '' + this.errorType + this.errorCode.toString(16).toUpperCase();
        }
    };

    PXPError.prototype.toString = function () {
        let ret;
        if ( Utils.isEmpty(this.errorDomain))
            ret= '['+ this.getCodeAsString() +'] ';
        else
            ret= '[' + this.errorDomain + '/' + this.getCodeAsString() + '] ';
        ret +=  this.errorMessage;

        if ( this.hasSourceError() )
            ret+= ' -> ' + this.errorSource.toString();

        return ret;
    };
    
    /**
     * transform PXPError to a native javascript error
     * @returns {Error} returns error javascript construct on PXPError information.
     */
    PXPError.prototype.toNativeError= function () {
        return new Error( this.toString() );
    };

    /**
     * JSON serialization overload
     * @returns {string} returns a stream json: { code: _CodeAsString_, message: _message_, domain: _domain_ }
     */
    PXPError.prototype.toJSON = function () {
        let obj = {
            code: '' + this.getCodeAsString(),
            message: this.errorMessage,
            domain: this.errorDomain
        };
        if ( this.hasSourceError() ) {
            obj.source = this.errorSource.toJSON();
        }
        return obj;
    };

    /**
     * From a stream json, construct a new PXPError
     * @param {string|json} content - JSON stream of the form: { code: _CodeAsString_, message: _message_, domain: _domain_, source: { _other_error_ }}
     * @returns {PXPError} returns a new PXPError
     */
    PXPError.CreateFromJSON = function (content) {
        if (Utils.isString(content)) {
            content = JSON.parse(content);
        }
        if ( Utils.isDefined(content.code) ) {
            var code = content.code;  // PXPErrorFromJVariant
            var msg = content.message || '';
            var domain = content.domain || '';

            var errorType = code[0];
            var errorCode= NaN;
            switch ( errorType ) {
            case TypeError.http:
                errorCode = Number.parseInt(code.substr(1), 10);
                break;
            case TypeError.code:
            case TypeError.exception:
            case TypeError.user:
            case TypeError.hresult:
                errorCode = Number.parseInt(code.substr(1), 16);
                break;
            }
            let sourceError= null;
            if ( content.source ) {
                sourceError= PXPError.CreateFromJSON( content.source );
            }

            if (!isNaN(errorCode)) {
                return new PXPError(msg, errorCode, errorType, domain, sourceError);
            }
        }        
        return new PXPError("invalid stream PXPXPError", StdCode.PXPErrorFromJVariant, TypeError.code, "Foundations"); // PXPErrorFromJVariant
    };
    
    PXPError.enTypeError = TypeError;
    PXPError.stdCode = StdCode;

    return PXPError;
});
