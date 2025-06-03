/*global define */
/**
 * Contains various utils functions used by Delmia PXP Manufacturing.
 *
 * @module   DS/DELPXPFoundations/PXPUtils
 *
 */
 define('DS/DELPXPFoundationsLegacy/PXPUtils', ['UWA/Utils'], function (UWAUtils) {
  'use strict';

  /** Used to match leading and trailing whitespace. */
  //var reTrim = /^\s+|\s+$/g,
  //    reTrimStart = /^\s+/,
  //    reTrimEnd = /\s+$/;

  //Number.isInteger = Number.isInteger || function (value) {
  //    return typeof value === "number" &&
  //        isFinite(value) &&
  //        Math.floor(value) === value;
  //};

  const cstDate = Object.freeze({
    y: 31557600000,
    mo: 2629800000,
    w: 604800000,
    d: 86400000,
    h: 3600000,
    m: 60000,
    s: 1000,
    ms: 1,
  });

  var s4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  var getUrlVars = function () {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
      vars[key] = value;
    });
    return vars;
  };

  var Utils = {
    /**
     * Checks if 'content' is classified as a string primitive or object.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if content is a string, else 'false'.
     */
    isString: function (content) {
      return content !== undefined && content !== null && (typeof content === 'string' || content instanceof String);
    },

    /**
     *  Converts `value` to a string. An empty string is returned for `null`.
     *
     *  @param {any} content - value to convert.
     *  @returns {string} Returns the converted string.
     */
    convertToString: function (content) {
      if (content === null || content === undefined) return '';
      if (this.isString(content)) return content;
      if (this.isObject(content)) return JSON.stringify(content);
      return '' + content;
    },

    //toString: function (content) {
    //  console.log('DEPRECATED -- Uses convertToString( content)');
    //  return this.convertToString(content);
    //},

    /**
     * Checks if `value` is an empty object (string, object, array).
     *
     *  @param {any} value - the value to check.
     *  @returns {string} returns true, if 'value' is empty.
     */
    isEmpty: function (value) {
      if (value === undefined) return true;

      if (typeof value === 'function' || typeof value === 'number' || typeof value === 'boolean' || Object.prototype.toString.call(value) === '[object Date]')
        return false;

      if (value === null || value === undefined || value.length === 0)
        // null or 0 length array
        return true;

      if (typeof value === 'object') {
        if (value instanceof Number) return false;
        if (value instanceof Boolean) return false;

        // empty object
        return Object.keys(value).length === 0;
      }
      return false;
    },

    /**
     * Checks if 'content' is classified as a object.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if content is a object, else 'false'.
     */
    isObject: function (content) {
      return content !== undefined && content !== null && typeof content === 'object';
    },

    /**
     * Checks if 'content' is classified as a plain object (constructed by the Object constructor).
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if content is a plain object, else 'false'.
     */
    isPlainObject: function (content) {
      // Basic check for Type object that's not null
      if (this.isObject(content)) {
        // If Object.getPrototypeOf supported, use it
        if (typeof Object.getPrototypeOf === 'function') {
          var proto = Object.getPrototypeOf(content);
          return proto === Object.prototype || proto === null;
        }

        // Otherwise, use internal class
        // This should be reliable as if getPrototypeOf not supported, is pre-ES5
        return Object.prototype.toString.call(content) === '[object Object]';
      }

      // Not an object
      return false;
    },

    /**
     * Checks if 'content' is classified as a boolean.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if content is a boolean, else 'false'.
     */
    isBool: function (content) {
      return content === true || content === false || content instanceof Boolean;
    },

    /**
     * Checks if 'content' is nill.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if `content` is null or undefined.
     */
    isNill: function (content) {
      return content === undefined || content === null;
    },

    /**
     * Checks if 'content' is null.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if `content` is null.
     */
    isNull: function (content) {
      return content === null;
    },

    /**
     * Checks if 'content' is undefined.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if `content` is undefined.
     */
    isUndefined: function (content) {
      return content === undefined;
    },

    /**
     * Checks if 'content' is defined.
     * @param {any} content - the value to check.
     * @returns {bool} - Returns 'true' if `content` is defined.
     */
    isDefined: function (content) {
      return !(content === undefined);
    },

    /**
     * Checks if 'value' is a positive number.
     * @param {any} value - the value to check.
     * @returns {bool} - Returns 'true' if `value` is a positive number.
     */
    isUint64: function (value) {
      if (this.isObject(value)) value = value.valueOf();
      return Number.isInteger(value) && value >= 0;
    },

    /**
     * Checks if 'value' is a number.
     * @param {any} value - the value to check.
     * @returns {bool} - Returns 'true' if `value` is a number.
     */
    isInt64: function (value) {
      if (this.isObject(value)) value = value.valueOf();
      return Number.isInteger(value);
    },

    /**
     * Checks if 'value' is a number.
     * @param {any} value - the value to check.
     * @returns {bool} - Returns 'true' if `value` is a number.
     */
     isNumber: function (value) {
        if (this.isObject(value)) value = value.valueOf();  
        return typeof value === 'number';
    },

    /**
     * Checks if 'value' is a number.
     * @param {any} value - the value to check.
     * @returns {bool} - Returns 'true' if `value` is a number.
     */
     isDouble: function (value) {
      return this.isNumber(value);
    },

    /**
     * Pad a number.
     * @param {number } - number to  display
     * @returns {String} - returns a string in the format '01'
     */
    pad2: function (number) {
      if ( number < 0 ) {
        return '-'+ this.pad2( Math.abs(number) );
      }
      if ( number < 10 )
        return ('0' + number).slice(-2);
      return '' + number;
    },
    /**
     * Pad a number.
     * @param {number} - number to  display
     * @returns {String} - returns a string in the format '001'
     */
    pad3: function (number) {
      if ( number < 0 ) {
        return '-'+ this.pad3( Math.abs(number) );
      }
      if ( number < 100 )
        return ('00' + number).slice(-3);
      return '' + number;
    },
    /**
     * Pad a number.
     * @param {number} - number to  display
     * @returns {String} - returns a string in the format '0001'
     */
    pad4: function (number) {
      if ( number < 0 ) {
        return '-'+ this.pad4( Math.abs(number) );
      }
      if ( number < 1000 )
        return ('000' + number).slice(-4);
      return '' + number;
    },
    /**
     * Pad a number.
     * @param {number } - number to  display
     * @returns {String} - returns a string in the format '00001'
     */
    pad5: function (number) {
      if ( number < 0 ) {
        return '-'+ this.pad5( Math.abs(number) );
      }
      if ( number < 10000 )
        return ('0000' + number).slice(-5);
      return '' + number;
    },

    /**
     * Convert a duration to a string.
     * @param {number} - duration to display
     * @returns {String} - returns a string in the format 'HH:MM::SS.MS'
     */
    string2duration: function( duration ) {
      let current = duration;

      // Hours
      let hours = Math.floor(current / cstDate.h);
      current -= hours * cstDate.h;

      // Minutes
      let minutes = Math.floor(current / cstDate.m);
      current -= minutes * cstDate.m;

      // Seconds
      let seconds = Math.floor(current / cstDate.s);
      current -= seconds * cstDate.s;

      let ms = current;

      let s = '';
      s += this.pad2(hours) + ':';
      s += this.pad2(minutes) + ':';
      s += this.pad2(seconds);
      s += Number.parseFloat(ms / 1000)
        .toFixed(4)
        .slice(1);
      return s;
    },

    strMapToObj: function (strMap) {
      let obj = Object.create(null);
      for (let [k, v] of strMap) {
        // We dont escape the key '__proto__' which can cause problems on older engines
        obj[k] = v;
      }
      return obj;
    },

    generateGUID: function () {
      return (s4() + s4() + '-' + s4() + s4()).toLowerCase();
    },

    /**
     * Function to get a parameter in the url
     * @param {*} parameter - Parameter to search in the URL
     * @param {*} defaultvalue - Default value if this parameter is not found
     * @return {string} returns url param
     * @example
     * The URL of the webpage is dsrtv://webapps/DELPXPBIPanel/index.html?endPoint=ENDPOINT&hostName=localhost&port=2097
     * PXPUtils.getUrlParam('hostName', '127.0.0.1') return localhost
     * PXPUtils.getUrlParam('notExist', 'ok') return the fault value 'ok'
     */
    getUrlParam: function (parameter, defaultvalue) {
      var urlparameter = defaultvalue;
      if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
      }
      return urlparameter;
    },

    /**
     * Returns a UUID v4 (Random)
     *    uses UWA/Utils/getUUID()
     * @returns {string} - Returns a uuid.
     */
    UUIDv4: function () {
      return UWAUtils.getUUID();
    },

    /**
     * Sleep the program. Uses 'await sleep(2000)` to stop during 2s [Promise version]
     *
     * @param {number} ms time to sleep in milliseconds.
     * @returns {Promise<void>} a Promise on Timeout...
     */
    sleep: async function (ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },

    /**
     * Sleep the program. Uses 'pause(2000)` to stop during 2s
     *
     * @param {*} ms time to pause in milliseconds.
     */
    pause: async function (ms) {
      await this.sleep(ms);
    },

    /**
     * Checks to see if the protocol is HTTPS
     * @returns {boolean} returns true, if current location protocol is `https`.
     */
    isHttps: function() {
      return (document.location.protocol === 'https:');
    }
  };

  return Utils;
});
