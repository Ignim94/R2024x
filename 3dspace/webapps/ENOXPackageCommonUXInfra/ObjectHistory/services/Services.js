/**
 @requires UWA/Class/Promise
 @requires UWA/Core

 @requires DS/WAFData/WAFData

 @supported Performance, Documentation
 **/
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/services/Services', [
	'UWA/Class/Promise',
	'UWA/Core',

	'DS/WAFData/WAFData',
	'DS/WidgetServices/WidgetServices',

	'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService'
	], function (Promise, UWA, WAFData,WidgetServices,ENOXSourcingService) {

	'use strict';

	var _CONSTANTS = {

			// The header to accept json
			HEADER_ACCEPT_JSON: 'application/json',

			// The header to indicate that the request contains json
			HEADER_CONTENT_TYPE_JSON: 'application/json'
	};

	var exports = {

			/**
			 * Returns the whole history of an ENOVIA object.
			 * @param {Object} options - Contains the field physical id. No callbacks needed.
			 * @returns {Promise} Returns a promise once we have the history.
			 */
			getHistory: function (options) {
				var request = {};
				var url=ENOXSourcingService.getServiceURL({source:"3DSpace",endpoint:"/resources/v1/modeler/dstdp/objecthistory/"+options.physicalId});
				options.method = 'GET';
				request.headers = {
						Accept: _CONSTANTS.HEADER_ACCEPT_JSON,
						'Content-Type': _CONSTANTS.HEADER_CONTENT_TYPE_JSON,
						SecurityContext:ENOXSourcingService. getSecurityContext(),
						'Accept-Language': WidgetServices.getLanguage()
				};

				// We set a promise for the onComplete/onFailure callbacks
				return new Promise(function (resolve, reject) {

					request.onComplete = function (response) {
						if (UWA.is(response, 'string')) {
							response = JSON.parse(response);
						}

						resolve(response);
					};

					request.onFailure = function (response) {
						if (UWA.is(response, 'string')) {
							response = JSON.parse(response);
						}

						reject(response);
					};
					WAFData.authenticatedRequest(url, request);
				});
			}
	};

	return exports;
});
