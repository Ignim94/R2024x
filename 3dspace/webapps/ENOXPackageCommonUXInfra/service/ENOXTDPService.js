//XSS_CHECKED
/* global UWA */
/* global widget */
define('DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
		['UWA/Class',
			'DS/WAFData/WAFData',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/WidgetServices/WidgetServices',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/ErrorMessageHandlerUtil/ErrorMessageHandlerUtil'
			], function(Class,WAFData,ENOXSourcingPlatformServices, WidgetServices, NLS, Constants, ErrorMessageHandlerUtil) {
	'use strict';

	var ENOXSourcingService = Class.singleton({

		initialize: function() {},
		isSessionExpired : function(wsResponse){
			let statusCode = wsResponse.status || wsResponse.statusCode;
			let returnStatus = false;
			if(statusCode && (statusCode === Constants.SESSSION_EXPIRED || statusCode === Constants.UNAUTHORISED_REQUEST)){
				widget.notificationUtil.showError(NLS.session_expired);
				returnStatus = true;
			}
			return returnStatus;
		},
		getServiceURL : function(options){
			var baseUrl = ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace');
			var baseWithEndpoint = baseUrl + options.endpoint;
			return (baseWithEndpoint.includes("?")?baseWithEndpoint+"&tenant="+ENOXSourcingPlatformServices.getPlatformId():baseWithEndpoint+"?tenant="+ENOXSourcingPlatformServices.getPlatformId());
		},
		getSecurityContext : function() { //removed parameter "source" to resolve mkcs issue. All functions passing source eg.3DSpace calls this function only to set the security context
			var returnSC = "";
			returnSC = 'ctx::'+widget.getValue('SC');
			//In future we need a dynamic mechanism to get Security context based on a particular service being passed here and not just Sourcing and 3DSpace service
			return returnSC;
		},
		getService: function(options) {
			var that=this;
			if (!options.onComplete) {
				//console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){

				var url = that.getServiceURL(options);

				var headers = {
						"Content-Type": 'application/json',
						"ENO_CSRF_TOKEN": csrfToken
				};
				//if(options.source === "3DSpace" || options.on3DSpace){
					headers.SecurityContext=that.getSecurityContext(options.source);
				//}
				headers['Accept-Language'] = WidgetServices.getLanguage();

				WAFData.authenticatedRequest(url, {
					'method': 'GET',
					'type': 'json',
					headers: headers,
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});

						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});

		},
		deleteService: function(options) {
			var that=this;
			if (!options.onComplete) {
				//console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				var url = that.getServiceURL(options);
				if(options.deleteData){
					options.deleteData.csrf= {
						"name": "ENO_CSRF_TOKEN",
						"value": csrfToken
					};
				}
				WAFData.authenticatedRequest(url, {
					'method': 'DELETE',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						"ENO_CSRF_TOKEN": csrfToken,
						SecurityContext:that.getSecurityContext(options.source),
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode((options.deleteData)?options.deleteData:{}),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});
						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		deleteServicePromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url = that.getServiceURL(options);
					if(options.deleteData){
						options.deleteData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value": csrfToken
						};
					}
					WAFData.authenticatedRequest(url, {
						'method': 'DELETE',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: UWA.Json.encode((options.deleteData)?options.deleteData:{}),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) {
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject((wsResponse)?wsResponse:error.message?error.message:error);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		createService: function(options) {
			var that=this;
			if (!options.onComplete) {
				//console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				var url = that.getServiceURL(options);
				options.addData.csrf= {
						"name": "ENO_CSRF_TOKEN",
						"value": csrfToken
				};
				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					'type': 'json',
					headers: {
						//"Access-Control-Allow-Origin": "*.3ds.com",
						"Content-Type": 'application/json',
						"ENO_CSRF_TOKEN": csrfToken,
						SecurityContext:that.getSecurityContext(options.source),
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode(options.addData),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});
						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});

		},
		createServicePromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url = that.getServiceURL(options);
					options.addData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value": csrfToken
					};
					WAFData.authenticatedRequest(url, {
						'method': 'POST',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: UWA.Json.encode(options.addData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) {
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject((wsResponse)?wsResponse:error.message?error.message:error);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});

		},
		createServiceXInfra: function(options) {
			var that=this;
			if (!options.onComplete) {
				// console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				var url = that.getServiceURL(options);
				options.addData.csrf= {
						"name": "ENO_CSRF_TOKEN",
						"value": csrfToken
				};
				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						SecurityContext:that.getSecurityContext(options.source),
						"ENO_CSRF_TOKEN": csrfToken,
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode(options.addData),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});
						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		deleteServiceXInfra: function(options) {
			var that=this;
			if (!options.onComplete) {
				// console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				var url = that.getServiceURL(options);
				options.data.csrf= {
						"name": "ENO_CSRF_TOKEN",
						"value": csrfToken
				};
				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						SecurityContext:that.getSecurityContext(options.source),
						"ENO_CSRF_TOKEN": csrfToken,
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode(options.data),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});
						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		updateService: function(options) {
			var that=this;
			if (!options.onComplete) {
				// console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				var url = that.getServiceURL(options);
				options.addData.csrf= {
						"name": "ENO_CSRF_TOKEN",
						"value": csrfToken
				};
				WAFData.authenticatedRequest(url, {
					'method': 'PATCH',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						"ENO_CSRF_TOKEN": csrfToken,
						SecurityContext:that.getSecurityContext(options.source),
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode(options.addData),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});
						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		updateServicePromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
						var url = that.getServiceURL(options);
						options.addData.csrf= {
								"name": "ENO_CSRF_TOKEN",
								"value": csrfToken
						};
						WAFData.authenticatedRequest(url, {
							'method': 'PATCH',
							'type': 'json',
							headers: {
								"Content-Type": 'application/json',
								"ENO_CSRF_TOKEN": csrfToken,
								SecurityContext:that.getSecurityContext(options.source),
								'Accept-Language': WidgetServices.getLanguage()
							},
							data: UWA.Json.encode(options.addData),
							'onComplete': function(wsResponse) {
								resolve(wsResponse);
							},
							'onFailure': function(error, wsResponse) {
								if(wsResponse)
									if(that.isSessionExpired(wsResponse))return;
								reject((wsResponse)?wsResponse:error.message?error.message:error);
							}
						});
					});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		updateServiceXInfra: function(options) {
			var that=this;
			if (!options.onComplete) {
				// console.log(error + "\n" + wsResponse);
			}
			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				var url = that.getServiceURL(options);
				WAFData.authenticatedRequest(url, {
					'method': 'PATCH',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						SecurityContext:that.getSecurityContext(options.source),
						"ENO_CSRF_TOKEN": csrfToken,
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode(options.addData),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						if (options.onFailure)
							options.onFailure((wsResponse)?wsResponse:{error:error.message});
						else{
							widget.notificationUtil.showError(ErrorMessageHandlerUtil.getErrorMessage(wsResponse));
						}
					}
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		updateServiceXInfraPromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					WAFData.authenticatedRequest(url, {
					'method': 'PATCH',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						SecurityContext:that.getSecurityContext(options.source),
						"ENO_CSRF_TOKEN": csrfToken,
						'Accept-Language': WidgetServices.getLanguage()
					},
					data: UWA.Json.encode(options.addData),
					'onComplete': function(wsResponse) {
						resolve(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						reject((wsResponse)?wsResponse:error.message?error.message:error);
					}
				});
			});	
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		getLifeCycleDataForAnObject: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					WAFData.authenticatedRequest(url, {
						'method': 'GET',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(error);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error + options.source);
			});
		},
		performLifeCycleAction: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					options.lifeCycleData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value": csrfToken
					};
					WAFData.authenticatedRequest(url, {
						'method': 'POST',		
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: UWA.Json.encode(options.lifeCycleData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(wsResponse);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		getDataPromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					var headers = {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
					};

					WAFData.authenticatedRequest(url, {
						'method': 'GET',
						'type': 'json',
						headers: headers,
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject((wsResponse)?wsResponse:error.message?error.message:error);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		getDataPromiseWithCSRF: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					WAFData.authenticatedRequest(url, {
						'method': 'GET',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(error);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});
		},
		performPatchPromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					options.attachDocumentData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value": csrfToken
					};
					WAFData.authenticatedRequest(url, {
						'method': 'PATCH',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: UWA.Json.encode(options.attachDocumentData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error,wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(wsResponse);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error+options.source);
			});

		},
		performDeletePromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					WAFData.authenticatedRequest(url, {
						'method': 'DELETE',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: UWA.Json.encode((options.deleteData)?options.deleteData:{}),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error,wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(wsResponse);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error + options.source);
			});
		},
		performPostPromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					let postData = options.postData;
					if (typeof options.postData === 'object') {
						postData = UWA.Json.encode(options.postData);
						options.postData.csrf = {
							"name": "ENO_CSRF_TOKEN",
							"value": csrfToken
						};
						options.postData.SecurityContext3DSpace = that.getSecurityContext(Constants.SERVICE_3DSPACE);
					}
					WAFData.authenticatedRequest(url, {
						'method': 'POST',
						'type': 'json',
						headers: {
							"Content-Type": options.contentType ? options.contentType : 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: postData,
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error,wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(wsResponse);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error + options.source);
			});
		},
		performPutPromise: function(options) {
			var that=this;
			return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
				return new Promise(function(resolve, reject) {
					var url =  that.getServiceURL(options);
					options.putData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value": csrfToken
					};
					WAFData.authenticatedRequest(url, {
						'method': 'PUT',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": csrfToken,
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						data: UWA.Json.encode(options.putData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error,wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(wsResponse);
						}
					});
				});
			},function(){ //error
				widget.notificationUtil.showError(NLS.csrf_error + options.source);
			});
		},
		getFederatedSearchDataPromise: function(options) {
			var that=this;
			//return ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace')).then(function(){ //csrfToken :://For federated search no need CSRF
				return new Promise(function(resolve, reject) {
					if(!options.searchPayLoad.login){
				 		let securityContexts = {};
				 		securityContexts[Constants.SOURCE_3DSPACE] = {
				 				"SecurityContext": that.getSecurityContext(Constants.SOURCE_3DSPACE)
				 		};
				     	options.searchPayLoad.login = securityContexts;
					}
					WAFData.authenticatedRequest(ENOXSourcingPlatformServices.getServiceURL('3DSearch')+((options.recent)?"/recent":"/search"), {
						'method': 'POST',
						'type': 'json',		
						headers: {
							"Content-Type": 'application/json',
							SecurityContext:that.getSecurityContext(options.source),
							'Accept-Language': WidgetServices.getLanguage()
						},
						onComplete: function (data) {		
							resolve(data);
						},
						data: UWA.Json.encode(options.searchPayLoad),
						onFailure: function (data, wsResponse) {
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							widget.notificationUtil.showError(NLS.error_search_index_get);
							reject(data);
						},

						onTimeout: function (data) {
							reject(data);
						}
					});
				});
		}
		/*getNetworkService:function(){
			var options={};
			options.platForms=ENOXSourcingPlatformServices._platforms;
			ENONetworkServices.initialize(options);
			return ENONetworkServices;
		},*/
		//commenting as not required for TDP
		/*updateServiceSupplierPortal: function(options) {

			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			//var url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			var url = baseUrl;
			if(options.endpoint.toString().contains('?')){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}
			var optionsArgs={
					endpoint:"/resources/v1/application/CSRF",
					source:"sourcing"
			};
			ENOXSourcingService.getDataPromiseSupplierPortal(optionsArgs).then(function(respData){
				options.addData.csrf= {
						"name": "ENO_CSRF_TOKEN",
						"value":respData.csrf.value
				};
				WAFData.authenticatedRequest(url, {
					'method': 'PATCH',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						"ENO_CSRF_TOKEN": respData.csrf.value
					},
					data: UWA.Json.encode(options.addData),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if (options.onFailure)
							options.onFailure(wsResponse);
						else{
							//console.log(error + "\n" + wsResponse);
						}
					}
				});
			});
		},*/
		//commenting as not required for TDP
		/*updateServicePromiseSupplierPortal: function(options) {
			return new Promise(function(resolve,reject){
				var baseUrl=requirejs.s.contexts._.config.baseUrl;
				baseUrl = baseUrl.replace("/webapps/", "");
				//var url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
				var url = baseUrl;
				if(options.endpoint.toString().contains('?')){
					url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
				}else{
					url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
				}
				var optionsArgs={
						endpoint:"/resources/v1/application/CSRF",
						source:"sourcing"
				};
				ENOXSourcingService.getDataPromiseSupplierPortal(optionsArgs).then(function(respData){
					options.addData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value":respData.csrf.value
					};
					WAFData.authenticatedRequest(url, {
						'method': 'PATCH',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": respData.csrf.value
						},
						data: UWA.Json.encode(options.addData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) {
							reject(wsResponse);
						}
					});
				});
			});
		},*/
		//commenting as not required for TDP
		/*createServicePromiseSupplierPortal: function(options) {

			return new Promise(function(resolve,reject){
				var baseUrl=requirejs.s.contexts._.config.baseUrl;
				baseUrl = baseUrl.replace("/webapps/", "");
				//var url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
				var url = baseUrl;
				if(options.endpoint.toString().contains('?')){
					url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
				}else{
					url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
				}
				var optionsArgs={
						endpoint:"/resources/v1/application/CSRF",
						source:"sourcing"
				};
				ENOXSourcingService.getDataPromiseSupplierPortal(optionsArgs).then(function(respData){
					options.addData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value":respData.csrf.value
					};
					WAFData.authenticatedRequest(url, {
						'method': 'POST',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": respData.csrf.value
						},
						data: UWA.Json.encode(options.addData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) {
							reject(wsResponse);
						}
					});
				});
			});	
		},*/
		//commenting as not required for TDP
		/*deleteServicePromiseSupplierPortal: function(options) {


			return new Promise(function(resolve,reject){
				var baseUrl=requirejs.s.contexts._.config.baseUrl;
				baseUrl = baseUrl.replace("/webapps/", "");
				//var url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
				var url = baseUrl;
				if(options.endpoint.toString().contains('?')){
					url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
				}else{
					url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
				}

				var optionsArgs={
						endpoint:"/resources/v1/application/CSRF",
						source:"sourcing"
				};
				ENOXSourcingService.getDataPromiseSupplierPortal(optionsArgs).then(function(respData){
					options.deleteData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value":respData.csrf.value
					};
					WAFData.authenticatedRequest(url, {
						'method': 'DELETE',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": respData.csrf.value
						},
						data: UWA.Json.encode(options.deleteData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(error, wsResponse) {
							reject(wsResponse);
						}
					});
				});
			});
		},*/
		//commenting as not required for TDP
		/*getServiceSupplierPortal: function(options) {

			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			var url = baseUrl;
			if(options.endpoint.contains("?")){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}

			WAFData.authenticatedRequest(url, {
				'method': 'GET',
				'type': 'json',
				headers: {
					"Content-Type": 'application/json'
				},
				'onComplete': function(wsResponse) {
					options.onComplete(wsResponse);
				},
				'onFailure': function(error, wsResponse) {
					if (options.onFailure)
						options.onFailure(wsResponse);
					else{
						// console.log(error + "\n" + wsResponse);
					}
				}
			});
		},*/
		//commenting as not required for TDP
		/*getDataPromiseSupplierPortal: function(options) {
			var that=this;
			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			var url = baseUrl;
			if(options.endpoint.toString().contains('?')){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}
			return new Promise(function(resolve, reject) {
				var headers = {
						"Content-Type": 'application/json'
				};

				WAFData.authenticatedRequest(url, {
					'method': 'GET',
					'type': 'json',
					headers: headers,
					'onComplete': function(wsResponse) {
						resolve(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(that.isSessionExpired(wsResponse))return;
						reject((wsResponse)?wsResponse:error.message?error.message:error);
					}
				});
			});
		},*/
		//commenting as not required for TDP
		/*performPostPromiseSupplierPortal: function(options) {


			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			var url = baseUrl;
			if(options.endpoint.toString().contains('?')){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}
			return new Promise(function(resolve, reject) {

				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						"ENO_CSRF_TOKEN": window.widget.app.platformServices.ENO_CSRF_TOKEN
					},
					data: UWA.Json.encode(options.postData),
					'onComplete': function(wsResponse) {
						resolve(wsResponse);
					},
					'onFailure': function(error,wsResponse) {
						reject(wsResponse);
					}
				});
			});

		},*/
		//commenting as not required for TDP
		/*performLifeCycleActionSupplierPortal: function(options) {
			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			var url = baseUrl;
			if(options.endpoint.toString().contains('?')){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}

			return new Promise(function(resolve, reject) {

				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json'
					},
					data: UWA.Json.encode(options.lifeCycleData),
					'onComplete': function(wsResponse) {
						resolve(wsResponse);
					},
					'onFailure': function(error) { //wsResponse
						reject(error);
					}
				});
			});
		},*/
		//commenting as not required for TDP
		/*postServiceSupplierPortal: function(options) {

			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			var url = baseUrl;
			if(options.endpoint.toString().contains('?')){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}
            //url="https://devopsvbt1ard7208713-euw1-24dsw10812-3dnetwork.3dx-staging.3ds.com"+options.endpoint+"?tenant="+window.widget.data.tenant;
			return new Promise(function() {

				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					'type': 'json',
					headers: {
						"Content-Type": 'application/json',
						'X-Requested-With':'XMLHttpRequest'
					},
					data: UWA.Json.encode(options.postData),
					'onComplete': function(wsResponse) {
						options.onComplete(wsResponse);
					},
					'onFailure': function(wsResponse) { //wsResponse
						options.onFailure(wsResponse);
					}
				});
			});

		},*/
		//commenting as not required for TDP
		/*performPutPromisePortal: function(options) {
			var that = this;
			var baseUrl=requirejs.s.contexts._.config.baseUrl;
			baseUrl = baseUrl.replace("/webapps/", "");
			var url = baseUrl;
			if(options.endpoint.toString().contains('?')){
				url = baseUrl+options.endpoint+"&tenant="+window.widget.data.tenant;
			}else{
				url = baseUrl+options.endpoint+"?tenant="+window.widget.data.tenant;
			}
			var optionsArgs={
					endpoint:"/resources/v1/application/CSRF",
					source:"sourcing"
			};

			return new Promise(function(resolve, reject) {

				ENOXSourcingService.getDataPromiseSupplierPortal(optionsArgs).then(function(respData){
					options.putData.csrf= {
							"name": "ENO_CSRF_TOKEN",
							"value":respData.csrf.value
					};

					WAFData.authenticatedRequest(url, {
						'method': 'PUT',
						'type': 'json',
						headers: {
							"Content-Type": 'application/json',
							"ENO_CSRF_TOKEN": respData.csrf.value,
							SecurityContext:that.getSecurityContext(options.source)
						},
						data: UWA.Json.encode(options.putData),
						'onComplete': function(wsResponse) {
							resolve(wsResponse);
						},
						'onFailure': function(wsResponse) { //wsResponse
							if(wsResponse)
								if(that.isSessionExpired(wsResponse))return;
							reject(wsResponse);
						}
					});
				});
			});
		}*/

	
	});

	return ENOXSourcingService;

});
