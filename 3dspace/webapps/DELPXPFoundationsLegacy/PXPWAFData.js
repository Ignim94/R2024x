/*global define */
/**
 * Promise version of WAFData. [BETA]
 *
 * @module   DS/DELPXPFoundations/PXPWAFData
 *
 */
define('DS/DELPXPFoundationsLegacy/PXPWAFData', ['DS/WAFData/WAFData' /*,'UWA/Promise'*/, 'DS/DELPXPFoundationsLegacy/PXPUtils'], function (
  WAFData /*,Promise*/,
  PXPUtils
) {
  'use strict';

  var exports = {};

  exports.request = async function (url, options) {
    if (PXPUtils.isDefined(options)) {
      if (!PXPUtils.isObject(options)) throw new Error('PXPWAFData syntax error: options is not a valid object');
      if (
        !PXPUtils.isEmpty(options.onComplete) ||
        !PXPUtils.isEmpty(options.onFailure) ||
        !PXPUtils.isEmpty(options.onTimeout) ||
        !PXPUtils.isEmpty(options.onPassportError)
      )
        throw new Error(
          "PXPWAFData syntax error: callback 'onComplete, onFailure, onPassportError or onTimeout' not expected with Promise version ! Uses request( url, options ).then(function(response){...}).catch(...)"
        );
    }
    return new Promise(function (resolve, reject) {
      let opts = options || {};

      opts.onComplete = function (data) {
        resolve(data);
      };
      opts.onFailure = function (error, data) {
        error ? reject(error) : reject(data);
      };
      opts.onTimeout = function (error) {
        reject(error);
      };
      opts.onPassportError = function (error) {
        reject(error);
      };

      WAFData.request(url, opts);
    });
  };

  exports.authenticatedRequest = async function (url, options) {
    if (PXPUtils.isDefined(options)) {
      if (!PXPUtils.isObject(options)) throw new Error('PXPWAFData syntax error: options is not a valid object');
      if (
        !PXPUtils.isEmpty(options.onComplete) ||
        !PXPUtils.isEmpty(options.onFailure) ||
        !PXPUtils.isEmpty(options.onTimeout) ||
        !PXPUtils.isEmpty(options.onPassportError)
      )
        throw new Error(
          "PXPWAFData syntax error: callback 'onComplete, onFailure, onPassportError or onTimeout' not expected with Promise version ! Uses authenticatedRequest( url, options ).then(function(response){...}).catch(...)"
        );
    }
    return new Promise(function (resolve, reject) {
      let opts = options || {};

      opts.onComplete = function (data) {
        resolve(data);
      };
      opts.onFailure = function (error, data) {
        error ? reject(error) : reject(data);
      };
      opts.onTimeout = function (error) {
        reject(error);
      };
      opts.onPassportError = function (error) {
        reject(error);
      };

      WAFData.authenticatedRequest(url, opts);
    });
  };

  exports.proxifiedRequest = async function (url, options) {
    if (PXPUtils.isDefined(options)) {
      if (!PXPUtils.isObject(options)) throw new Error('PXPWAFData syntax error: options is not a valid object');
      if (
        !PXPUtils.isEmpty(options.onComplete) ||
        !PXPUtils.isEmpty(options.onFailure) ||
        !PXPUtils.isEmpty(options.onTimeout) ||
        !PXPUtils.isEmpty(options.onPassportError)
      )
        throw new Error(
          "PXPWAFData syntax error: callback 'onComplete, onFailure, onPassportError or onTimeout' not expected with Promise version ! Uses proxifiedRequest( url, options ).then(function(response){...}).catch(...)"
        );
    }
    return new Promise(function (resolve, reject) {
      let opts = options || {};

      opts.onComplete = function (data) {
        resolve(data);
      };
      opts.onFailure = function (error, data) {
        error ? reject(error) : reject(data);
      };
      opts.onTimeout = function (error) {
        reject(error);
      };
      opts.onPassportError = function (error) {
        reject(error);
      };

      WAFData.proxifiedRequest(url, opts);
    });
  };

  exports.handleRequest = async function (url, options) {
    if (PXPUtils.isDefined(options)) {
      if (!PXPUtils.isObject(options)) throw new Error('PXPWAFData syntax error: options is not a valid object');
      if (
        !PXPUtils.isEmpty(options.onComplete) ||
        !PXPUtils.isEmpty(options.onFailure) ||
        !PXPUtils.isEmpty(options.onTimeout) ||
        !PXPUtils.isEmpty(options.onPassportError)
      )
        throw new Error(
          "PXPWAFData syntax error: callback 'onComplete, onFailure, onPassportError or onTimeout' not expected with Promise version ! Uses handleRequest( url, options ).then(function(response){...}).catch(...)"
        );
    }
    return new Promise(function (resolve, reject) {
      let opts = options || {};

      opts.onComplete = function (data) {
        resolve(data);
      };
      opts.onFailure = function (error, data) {
        error ? reject(error) : reject(data);
      };
      opts.onTimeout = function (error) {
        reject(error);
      };
      opts.onPassportError = function (error) {
        reject(error);
      };

      WAFData.handleRequest(url, opts);
    });
  };
  return exports;
});
