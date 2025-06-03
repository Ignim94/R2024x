//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint prefer-promise-reject-errors: ["error", {"allowEmptyReject": true}]*/
/*eslint no-unused-vars: "off"*/
/*eslint no-else-return: "off"*/
/*eslint no-useless-return: "off"*/
define('DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
		[
			'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
			'DS/WidgetServices/securityContextServices/SecurityContextServices',
			'DS/WAFData/WAFData',
			'UWA/Class',
			'UWA/Class/Debug',
			'DS/ENOXPackageCommonUXInfra/ENOXSourcingSCMgnt/ENOXSourcingSCMgnt',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/ENOXSourcingSCMgnt/ENOXSourcingSCChooser',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants'
			],
			function(i3DXCompassPlatformServices, SecurityContextServices, WAFData,UWAClass,UWADebug,ENOXSourcingSCMgnt,NLS,UIMask,ENOXSourcingSCChooser, ENOXSourcingConstants) {

	'use strict';

	var platformServices = UWA.Class.singleton(UWADebug,{
		_platforms:[],
		csrfTokenMap:{},
		init: function () {
			this._platforms = [];
			return;
		},
		getServiceURL : function(serviceId){ //tenant
			if (this._platforms[serviceId]) {
				return this._platforms[serviceId];
			}
			return null;
		},	
		getPlatformId: function() {
			var that = this;
			if(that._platformId) return that._platformId;
			try{
				if (widget)
					that._platformId = widget.getValue('x3dPlatformId') ? widget.getValue('x3dPlatformId') : 'OnPremise';
					//console.log(" that._platformId ---------------->:"+that._platformId);
					return that._platformId;
			}catch(ex){
				//console.log(" Exception that._platformId ---------------->:OnPremise");
				return 'OnPremise' ; //odt case
			}

		},		
		getPlatformServices: function(app) {
			var that=this;
			return new Promise(function(resolve, reject) {
				var platformId =that.getPlatformId(); 
				var options = {
						platformId: platformId,
						onComplete: function(data) {
							app.logger.info("Platform Services successfully retrieved");
							var platformServicesVal = data.hasOwnProperty('length') ? data[0] : data;
							that._platforms = platformServicesVal;
							
							that.getSCPreferences = "";
							that.getSCPreferences = that.populateSecurityContextWidgetPreferences(that._platforms["3DSpace"],app);
							
							// Setting Cookies -- Always
							that.setCookiesCall = that.setCookies(that._platforms["3DSpace"]);
							that.setCookiesCall.then(function(){
							// Setting Widget Preferences  -- Always
                            that.getSCPreferences.then(function() {
                                     app.logger.info('Security Context Populated Successfully');
									 that.setCredentialPreference();
                                     resolve(platformServicesVal);
                                }).catch(function(){
                                	app.logger.error('unable to retrieve SecurityContext');
									that.displayAlert("error","sc_error");
                                });
                                }).catch(function(){
                                	// When Set Cookies Fail 
                                that.getSCPreferences.then(function() {
                                         app.logger.info('Security Context Populated Successfully');
                                         that.setCredentialPreference();
                                         resolve(platformServicesVal);
                                }).catch(function(){
                                	app.logger.error('unable to retrieve SecurityContext');
									that.displayAlert("error","sc_error");
                                });
                                });
						},
						onFailure: function(error) {
							app.logger.error("Failed to get platform Services");
							app.logger.error("Reason: " + error);
							that.displayAlert("error","appLoadMessage");
							reject(error);
						}
				};
				i3DXCompassPlatformServices.getPlatformServices(options);
			});
		},
		setCredentialPreference: function() {
				widget.setValue("xPref_CREDENTIAL",widget.getValue("SC"));
		},
		setCommonWidgetPreferences: function() {
			var that = this;
			
			// Tenant name
			if(that.getPlatformId() !== ENOXSourcingConstants.ONPREMISE){
				widget.addPreference({
                    name: "tenantName",
                    type: "text",
                    label: NLS.tenant_name,
                    defaultValue: that._platforms.displayName,
                    disabled:true
                });
			}
		},
		getCSRFToken: function(platform3DSpaceURL,source) {
			var that=this;
			var sourcePassed = (source)?source:'3DSpace';

/*			if(!that.app){
				that.app = app;
			}*/
			return new Promise(function(resolve, reject) {
				if(that.csrfTokenMap && that.csrfTokenMap[sourcePassed]){
					resolve(that.csrfTokenMap[sourcePassed]);
					return;
				}
				var fetchOpts = {};
				var url = platform3DSpaceURL + "/resources/v1/application/CSRF";

				fetchOpts.method = 'GET';
				fetchOpts.proxy = 'passport';
				fetchOpts.onComplete = function(respData) {
					if(that.app)
					that.app.logger.info("CSRF Token retrieved successfully");
					that.csrfTokenMap[sourcePassed] = respData.csrf.value;
					resolve(respData.csrf.value);
				};
				fetchOpts.onFailure = function(respData) {
					if(that.app)
					that.app.logger.error("Error while getting CSRF token");
					reject(respData);
				};

				fetchOpts.type = "json";
				WAFData.authenticatedRequest(url, fetchOpts);
			});
		},
		populateSecurityContextWidgetPreferences : function(platform3DSpaceURL,app){
			var that=this;
			if(!that.app){
				that.app = app;
			}
			var options = {
					url:platform3DSpaceURL,
					platforminstance:that.getPlatformId()
			};
			this.scChooserHelper = new ENOXSourcingSCMgnt(options);
		      return new Promise(function(resolve, reject){
		          that.scChooserHelper.RetrieveSCListAndPrefered({
		            callback : function(isOk){
		              if(isOk){
		                var NlsPreference = "select_credentials";
		                var SCPreference = that.scChooserHelper.getSCPreference( NlsPreference );
		                widget.addPreference(SCPreference);
		                that.setCommonWidgetPreferences();
		                var _PreviousSC = that.setSecurityContextOnWidget( SCPreference.options , widget.getValue('SC') );
		                if(!_PreviousSC){ //!_PreviousSC
		                  var _CurrentSC  = that.scChooserHelper.getSCPreferred(_PreviousSC);
		                  if(_CurrentSC){
		                    _CurrentSC && widget.setValue('SC', _CurrentSC );
		                    resolve(true);
		                  } else{
		                    //ask user to choose a security context
									var scchooser = new ENOXSourcingSCChooser({
		                      SCManager : that.scChooserHelper, //
		                      resolve : resolve,
										reject : reject
									});
		                  }

		                }else{
		                  resolve(true);
		                }

		              }else{
		            	  reject();
		              }
		            }
		          });
		        });
			
		},
		setSecurityContextOnWidget : function ( listOfContexts, presentContext ) {
		      if ( presentContext ) {
		        for ( let context in listOfContexts ) {
		          if( listOfContexts[context].value === presentContext ) {
		            return widget.setValue( 'SC', presentContext );
		          }
		        }
		      }
		      return undefined;
		},
        setCookies:function(sourcingURL){
            var that=this;
            
            return new Promise(function(resolve, reject) {
            var fetchOpts = {};
            var url = sourcingURL+"/resources/v1/modeler/dstdp/packages?tenant="+that.getPlatformId().toUpperCase();
            fetchOpts.method = 'GET';
            fetchOpts.proxy = 'passport';
            fetchOpts.onComplete = function(respData) {
            resolve(respData);
            };
            fetchOpts.onFailure = function(respData) {
            reject(respData);
            };
            fetchOpts.type = "json";
            WAFData.authenticatedRequest(url, fetchOpts);
            });
		},
		displayAlert:function(level, key){ //message
			widget.notificationUtil.showMessage({
                level : level,
                subtitle : NLS[key]
            });
			UIMask.mask(widget.body,NLS.loading);
        }
});

	return platformServices;
});
