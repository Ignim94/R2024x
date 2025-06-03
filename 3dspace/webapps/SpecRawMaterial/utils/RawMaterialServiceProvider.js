define(
		"DS/SpecRawMaterial/utils/RawMaterialServiceProvider",
		[ 'UWA/Class', 'UWA/Promise',
			"DS/XSRCommonComponents/utils/IndexServiceProvider",
			'DS/XSRCommonComponents/utils/RequestUtil',
			'DS/XSRCommonComponents/utils/Constants' ],
			function(Class, Promise, PADServices, RequestUtil, Constants) {
			"use strict";
			var platFormId;

			var RawMaterialServiceProvider = Class
			.extend({

				init : function(options) {
					platFormId = RequestUtil.getPlatformId();
					this.isChangeControlled = options
					&& options.isChangeControlled ? true
							: false;
				},

				getHeaders : function(requestHeaders) {
					var headers = {};
					headers["Content-type"] = "application/json";

					if (this.isChangeControlled) {
						Object.assign(headers, RequestUtil
								.getWorkUnderHeaders());
					}

					if (requestHeaders) {
						Object
						.keys(requestHeaders)
						.forEach(
								function(reqHeader) {
									headers[reqHeader] = requestHeaders[reqHeader];
								});
					}
					return headers;
				},

				createRawM : function(input) {
					var requestInput = {};
					var that = this;
					var inputData = JSON.stringify(input.data);
					return new Promise(function(resolve, reject) {
						RequestUtil.send3DSpaceRequest(
								Constants.RM_BASE_URL + "Raw_Material",
								"POST", {
									"type" : "json",
									"headers" : that.getHeaders(),
									"data" : inputData
								}, resolve, reject);
					});
				}
			});

			return RawMaterialServiceProvider;
		});
