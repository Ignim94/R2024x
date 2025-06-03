//XSS_CHECKED
/* global widget */
/* global UWA */

define('DS/ENOXPackageManagement/ENOXPackageManagement', [
	'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
	'DS/ENOXPackageCommonUXInfra/Mediator',
	'DS/ENOXPackageCommonUXInfra/ENOXPackageLogger',
	'DS/ENOXPackageManagement/components/Triptych/TriptychWrapper',
	'DS/ENOXPackageManagement/components/ApplicationTopBar/ApplicationTopBarWrapper',
	'DS/ENOXPackageManagement/components/xPackageManagementRouter/xPackageManagementRouter',
	'DS/ENOXPackageManagement/views/LandingPage',
	'DS/ENOXPackageManagement/components/WelcomePanel/WelcomePanelWrapper',
	'DS/Notifications/NotificationsManagerUXMessages',
	'DS/Notifications/NotificationsManagerViewOnScreen',
	'DS/Handlebars/Handlebars',
	'WebappsUtils/WebappsUtils',
	'text!DS/ENOXPackageManagement/ENOXPackageManagement_template.html',
	'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
    'DS/ENOXPackageCommonUXInfra/UpdateWidgetTitle/UpdateWidgetTitle',
	'DS/ENOXPackageCommonUXInfra/NotificationsUtil/NotificationsUtil',
	'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
	'DS/ENOXPackageManagement/models/Configuration',
	'DS/UIKIT/Mask',
	'css!DS/ENOXPackageManagement/ENOXPackageManagement.css'

	],
	function(
			ENOXSourcingPlatformServices,
			ENOXMediator,
			ENOXPackageLogger,
			TriptychWrapper,
			ApplicationTopBarWrapper,
			xPackageManagementRouter,
			LandingPage,
			WelcomePanelWrapper,
			NotificationsManagerUXMessages,
			WUXNotificationsManagerViewOnScreen,
			Handlebars,
			WebappsUtils,
			_html_xTDPApp,
			NLS,
			NLSInfra,
			UpdateWidgetTitle,
	        NotificationsUtil,
			ENOXSourcingConstants,
			Configuration,
			UIMask
	) {
	'use strict';
	var isLastListCR = true;
	var updateWidgetObject = new UpdateWidgetTitle();
	let configurator = {
		_modelersRoot: 'DS/ENOXPackageManagement/modelers/',
		_modelersList: ['Package','Publication'],
		_serviceViewControllersList: [
			{ name: 'controllers/ModalWindowController', label: 'modalWindowController', initializeController: false }],
		_wizardConfigurator: {
			_wizardStepsList: [],
			_wizardViews: []
		}
		
	};

	var ENOXPackageManagement = {
			onLoad: function() {
            	widget.body.empty();
				widget.setIcon(WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/ENOVIA_WIDGET_Favicon.png'));
				var app = ENOXPackageManagement;
				this.app = app;
				app.widget = this;
				app._mediator = new ENOXMediator();
				app._applicationChannel = app._mediator.getApplicationBroker();
				ENOXPackageManagement.initializeGlobalMethods();
				app.i18NProvider = Object.freeze(NLS);
				app.genericI18nProvider = Object.freeze(NLSInfra);
				app.logname = 'ENOXCollaborationPackageManagement';
                app.logger = new ENOXPackageLogger(app);
				app._initTriptychAndToolbar();
				app.configurator = configurator;
				app.mandatoryStartupPromises = [];
				widget.notificationUtil = NotificationsUtil;

                    //wait for Promises created by extensions and declared as mandatory
                    var allMandReady = UWA.Promise.all( app.mandatoryStartupPromises);
                    allMandReady.then(function() {
						app._initPlatformServices();
                        //app._initRouter();
                        //app.mainController.initialize();
                    });
				
				this.notifs = NotificationsManagerUXMessages;
				WUXNotificationsManagerViewOnScreen.setNotificationManager(this.notifs);

			},
			onRefresh: function() {
				ENOXSourcingPlatformServices.setCredentialPreference();
            	if(ENOXPackageManagement.router){
					ENOXPackageManagement._welcomePanelComponent.updateActions();
					var currentRoute=ENOXPackageManagement.router._router.getState().name;
	            	var params=ENOXPackageManagement.router._router.getState().params;
	            	params.isRefresh=true;
	            	ENOXPackageManagement.router._router.navigate(currentRoute,params,{reload: true});
            	}
            	else{
            		ENOXPackageManagement._initPlatformServices();
            	}
			},
			endEdit: function() {
				this.app.logger.setLevel(widget.getValue('debug')?ENOXPackageLogger.LEVEL.DEBUG:ENOXPackageLogger.LEVEL.ERROR);
			},
            onResize: function() {
                var pathname = this.app.router? this.app.router.getRouter().getState().name : '';
				if (widget.body.offsetWidth > 550 && pathname !== 'home.PackageDetails' && pathname !== 'home.PackageDetails' && pathname !== 'home.PublicationDetails') {
					// Add condition for all details pages as welcome panel is to be hidden there
					this.app._applicationChannel.publish({ event: 'welcome-panel-expand'});
				}else{
					this.app._applicationChannel.publish({ event: 'triptych-hide-panel', data: 'left' });
				}
            }
	};
  ENOXPackageManagement._setPasswordFlag = async function () { //app
            let options = {};
            let configuration = new Configuration();
			options.setting="passwordFlag";
            let resp = await configuration.getSettings(options);
            try {
                if (resp) {
                    if (resp.isPasswordProtectionEnabled) {
                        widget.setValue("isPasswordProtectionEnabled", resp.isPasswordProtectionEnabled);
                    }
                } else {
                    widget.notificationUtil.showError("Error getting password protection flag");
                    throw new Error("Error");
                }
                return true;
            }
            catch (error) {
                widget.notificationUtil.showError(error.internalError ? error.internalError : "Error getting password protection flag");
                UIMask.unmask(widget.body);
                return true;
            }
        };
	/** Initialization of the triptych and the Page ToolBar with the Breadcrumb */
	ENOXPackageManagement._initTriptychAndToolbar = function() {
		this._applicationContainer = UWA.createElement('div');
		this._applicationContainer.classList.add('xTDP-application');
		widget.body.setContent(this._applicationContainer);

		this._triptychWrapper = new TriptychWrapper();
		this._pageToolBarComponent = new ApplicationTopBarWrapper();

		var _mainPanel = UWA.createElement('div');
		_mainPanel.innerHTML = Handlebars.compile(_html_xTDPApp)();
		_mainPanel = _mainPanel.firstChild;
		this._applicationContainer.appendChild(_mainPanel);

		this._mainPanelApplicationContent = _mainPanel.querySelector('.xTDP-content');
		this._triptychWrapper.init(this._applicationChannel, this._mainPanelApplicationContent);
		//var toptoolbarContainer = _mainPanel.querySelector('.xTDP-topbar');
		var toptoolbarContainer = UWA.createElement('div');
		toptoolbarContainer.style.display='none';
	        this._pageToolBarComponent.init(this._applicationChannel, xPackageManagementRouter, toptoolbarContainer);
	        
	        this._middleContainer = document.createElement('div');
	        this._middleContainer.appendChild(toptoolbarContainer);
	        this._middleContainer.appendChild(this._triptychWrapper.getMainPanelContainer());
	        this._applicationChannel.publish({ event: 'triptych-set-content', data: { side: 'middle', content: this._middleContainer } });

	};

	ENOXPackageManagement.reactivateWP = function() {
		ENOXPackageManagement._initxCS();
		this._applicationChannel.publish({ event: 'welcome-panel-expand' });
	};
	
	ENOXPackageManagement.deactivateWP = function() {
	};

	ENOXPackageManagement._getRouteTitle = function(route) {
		var title = '';
		if(route === 'home.MyPackages')
			title = NLS.my_packages;
		if(route === 'home.MyPublications')
			title = NLS.my_publications;
		if(route === 'home.PackageDetails')
			title = NLS.package_details;
		if(route === 'home.PublicationDetails')
			title = NLS.PublicationDetails;
		if(route === 'home.Configuration')
			title = NLS.Configuration;
		else
			title = NLS.my_packages;
		return title;
	};

	ENOXPackageManagement._initRouter = function() {
		var that = this;
		var reactivateWP = function() {
			that.router.navigate('home.MyPackages');
			that._applicationChannel.publish({ event: 'welcome-panel-expand' });
		};

		var deactivateWP = function() {

		};


		//Setting up xPackageManagementRouter
		xPackageManagementRouter.initialize();
		xPackageManagementRouter.addRoute({
			name: 'home.NewPublication',
			path: '/' + 'NewPublication'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.NewPackage',
			path: '/' + 'NewPackage'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.MyPublications',
			path: '/' + 'MyPublications'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.MyPackages',
			path: '/' + 'MyPackages'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.PackageDetails',
			path: '/' + 'PackageDetails'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.PublicationDetails',
			path: '/' + 'PublicationDetails'
		});
		//NJ9 start
		xPackageManagementRouter.addRoute({
			name: 'home.TestMenu',
			path: '/' + 'TestMenu'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.OpenTestMenuItem',
			path: '/' + 'OpenTestMenuItem'
		});
		xPackageManagementRouter.addRoute({
			name: 'home.Configuration',
			path: '/' + 'Configuration'
		});

		//end
		// regarding HOME Page
		xPackageManagementRouter.addRouteMethods('home', {
			activate: function() {

				/*reactivateWP();
				
				that._applicationChannel.publish({
                    event: 'topbar-hide-title',
                    data: null
                });*/
				
			},
			deactivate: function() {
				// should never happen
			}
		});

		xPackageManagementRouter.addRouteMethods('home.NewPublication', {
			activate: function() { //data
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				deactivateWP();
				that._initxCS('home.NewPublication');
			},
			deactivate: function() {
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});
			}
		});

		xPackageManagementRouter.addRouteMethods('home.NewPackage', {
			activate: function() { //data
				//that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				deactivateWP();
				that._initxCS('home.NewPackage');
			},
			deactivate: function() {
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});
			}
		});

		xPackageManagementRouter.addRouteMethods('home.MyPublications', {
			activate: function() { //data
			that.resetWidgetPreferencesValue("LastSelectedTab");
			    isLastListCR = true;
				that._applicationChannel.publish({ event: 'show-welcomepanel-icon'});
				that._applicationChannel.publish({event:'welcome-panel-select-action',data:{id:'MyPublications'}});
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				updateWidgetObject.updateTitle(" ");
				that._applicationChannel.publish({
    				event: 'breadcrumb-reset',
    				data: null
    			});
				deactivateWP();
				that._initxCS('home.MyPublications');
				
				//require(['i18n!DS/ENOXComponentRequestManagement/assets/nls/ENOXComponentRequestManagement'], function(NLS) {
	                that._applicationChannel.publish({
	                    event: 'topbar-show-title',
	                    data: NLS.my_publications
	                });
	               // });
				
			},
			deactivate: function() {
				//that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});
				that._applicationChannel.publish({ event: 'xsrc-destroy-drop-token', data: null });
			}
		});


		
		xPackageManagementRouter.addRouteMethods('home.MyPackages', {
			activate: function(data) { //data
				that.resetWidgetPreferencesValue("LastSelectedTab");
			    isLastListCR = false;
				that._applicationChannel.publish({ event: 'show-welcomepanel-icon'});
				that._applicationChannel.publish({event:'welcome-panel-select-action',data:{id:'MyPackages'}});
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				updateWidgetObject.updateTitle(" ");
				widget.setConfigTabParam('lastVisitedConfigTab',JSON.stringify({name:"home.MyPackages"}));
				that._applicationChannel.publish({
    				event: 'breadcrumb-reset',
    				data: null
    			});
				deactivateWP();
				that._initxCS('home.MyPackages');
				that._applicationChannel.publish({
					event: 'topbar-show-title',
					data: NLS.my_packages
				});

				
				if(data.name){
					var linkObject = {
							linkID: data.name,
							linkText: NLS.my_packages
					};
					that._applicationChannel.publish({
						event: 'breadcrumb-add-link',
						data: linkObject
					});
				}
				
			},
			deactivate: function() {
				//that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});
				that._applicationChannel.publish({ event: 'xsrc-destroy-drop-token', data: null });
			}
		});



		xPackageManagementRouter.addRouteMethods('home.PackageDetails', {
			activate: function(data) {
				that._applicationChannel.publish({event:'welcome-panel-unselect-action',data:{id:'PackageDetails'}});
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				deactivateWP();
				that._initxCS('home.PackageDetails', data);
				
				that._applicationChannel.publish({
	                    event: 'topbar-hide-title',
	                    data: null
	             });
				

				var fromView = {};
				var conditions = ["open", "details"];
				var isPrevDetailsRoute = conditions.some(el => that.router._router.previousRoute.toLowerCase().includes(el));
				var isRefresh = that.router._router.getState().params.isRefresh;
				if(!isRefresh && !isPrevDetailsRoute && that.router._router.previousRoute && that.router._router.previousRoutePath
				    && that.router._router.previousRoute!=='home.PackageDetails' && !isLastListCR) {
					//var tempText  = (that.router._router.previousRoute).split(".");
					fromView = {
							linkID: that.router._router.previousRoute,
							linkText: that._getRouteTitle(that.router._router.previousRoute)
					};
					if(fromView.linkText === NLS.packages)
					    fromView.linkID = 'home.PackageDetails';
					that._applicationChannel.publish({
						event: 'breadcrumb-add-link',
						data: fromView
					});
				}
			},
			deactivate: function() {
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				/*that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});*/
			}
		});


		xPackageManagementRouter.addRouteMethods('home.PublicationDetails', {
			activate: function(data) {
				that._applicationChannel.publish({event:'welcome-panel-unselect-action',data:{id:'PublicationDetails'}});
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				deactivateWP();
				that._initxCS('home.PublicationDetails', data);
				
				that._applicationChannel.publish({
	                    event: 'topbar-hide-title',
	                    data: null
	             });
				

				var fromView = {};
				var conditions = ["open", "details"];
				var isPrevDetailsRoute = conditions.some(el => that.router._router.previousRoute.toLowerCase().includes(el));
				var isRefresh = that.router._router.getState().params.isRefresh;
				if(!isRefresh && !isPrevDetailsRoute && that.router._router.previousRoute && that.router._router.previousRoutePath
				    && that.router._router.previousRoute!=='home.PublicationDetails' && !isLastListCR) {
					//var tempText  = (that.router._router.previousRoute).split(".");
					fromView = {
							linkID: that.router._router.previousRoute,
							linkText: that._getRouteTitle(that.router._router.previousRoute)
					};
					if(fromView.linkText === NLS.publications)
					    fromView.linkID = 'home.PublicationDetails';
					that._applicationChannel.publish({
						event: 'breadcrumb-add-link',
						data: fromView
					});
				}
			},
			deactivate: function() {
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				/*that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});*/
			}
		});
		
		
		xPackageManagementRouter.addRouteMethods('home.Configuration', {
			activate: function() { //data
				that.resetWidgetPreferencesValue("LastSelectedTab");
			    isLastListCR = false;
				that._applicationChannel.publish({ event: 'show-welcomepanel-icon'});
				that._applicationChannel.publish({event:'welcome-panel-select-action',data:{id:'Configuration'}});
				that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				updateWidgetObject.updateTitle(" ");
				that._applicationChannel.publish({
    				event: 'breadcrumb-reset',
    				data: null
    			});
				deactivateWP();
				that._initxCS('home.Configuration');
				that._applicationChannel.publish({
					event: 'topbar-show-title',
					data: NLS.Configuration
				});
				
			},
			deactivate: function() {
				//that._triptychWrapper.getMainPanelContainer().innerHTML = '';
				if (arguments[0].name === "home") {
					reactivateWP();
				}
				that._applicationChannel.publish({
					event: 'breadcrumb-reset',
					data: null
				});
				that._applicationChannel.publish({ event: 'xsrc-destroy-drop-token', data: null });
			}
		});
		this.router = xPackageManagementRouter;


		//Open the view last visited by the user instead of homepage
		var lastVisited = JSON.parse(widget.getValue('xpflLastVisitedRoute'));
		if (!lastVisited.route) {
			widget.setValue('xpflLastVisitedRoute', JSON.stringify({
				route: "home",
				objectId: "",
				viewName: ""
			}));
			lastVisited.route = "home";
		}
		xPackageManagementRouter.start(function() {
			var launchWindowURL = decodeURIComponent(top.location.href);
            var urlContent = launchWindowURL.split("X3DContentId=");
			var routeContentType = launchWindowURL.split("routeContentType=");
			let objectId = launchWindowURL.split("id=");
            if(urlContent && urlContent.length === 2){
                var jsonContent = JSON.parse(urlContent[1]);
                var obj = that.decideRouteUsingURL(jsonContent);
            if(obj.route)
		           xPackageManagementRouter.navigate(obj.route, obj);
            }
			else if(objectId){
				if(objectId.length === 2) {
					let route = routeContentType[1] === ENOXSourcingConstants.TYPE_TDP_PUBLICATION ? "home.PublicationDetails" : "home.PackageDetails";
					let pkgorpubObj = {
						route: route,
						//mge29:kept platform specific checks as these check would be required
						id: (ENOXSourcingPlatformServices.getPlatformId() === ENOXSourcingConstants.ONPREMISE)?objectId[1]:objectId[1].substr(0, objectId[1].indexOf('&')),
						downloadZip: false
					};
					xPackageManagementRouter.navigate(pkgorpubObj.route, pkgorpubObj);
				}
				else {
					let route = routeContentType[1] === ENOXSourcingConstants.TYPE_TDP_PUBLICATION ? "home.MyPublications" : "home.MyPackages";
					xPackageManagementRouter.navigate(route);
				}
            }else{
                 xPackageManagementRouter.navigate(lastVisited.route, {
                     id: lastVisited.objectId ? lastVisited.objectId : '',
                     name: lastVisited.viewName ? lastVisited.viewName : ''
                 });
            }
		});

	};

    ENOXPackageManagement.decideRouteUsingURL = function(data) {
    	var retObj = {};
    	if(data.data.items[0].objectId && data.data.items[0].objectType === ENOXSourcingConstants.TYPE_TDP_PACKAGE){
    		retObj.route = "home.PackageDetails";
    		retObj.id = data.data.items[0].objectId;
    	}else if(data.data.items[0].objectId && data.data.items[0].objectType === ENOXSourcingConstants.TYPE_TDP_PUBLICATION ){
    		retObj.route = "home.PublicationDetails";
    		retObj.id = data.data.items[0].objectId;
    	}
        return retObj;
    };

	ENOXPackageManagement._initxCS = function(route, data) {
		var landingPage = new LandingPage();
		var options = {};
		options._mainPanelApplicationContent = this._mainPanelApplicationContent;
		//options._applicationChannel = this._applicationChannel;
		options.applicationChannel = this._applicationChannel;
		options.platformServices = this.platformServices;
		options._triptychWrapper = this._triptychWrapper;
		options.route = route;
		options.router = this.router;
		options.storage = this.storage;
		options.app = this;
		options._mediator = this._mediator;
		options.data = data;
		landingPage.init(options);
	};

	/** Initialization of the WelcomePanel
	 *  Inits menu in the left panel of triptych
	 * */
	ENOXPackageManagement._initWelcomePanel = function() {
		this._welcomePanelComponent = new WelcomePanelWrapper();
		this._triptychWrapper.getLeftPanelContainer().innerHTML = '';
		var options = {
				_applicationChannel: this._applicationChannel,
				xPackageManagementRouter: xPackageManagementRouter,
				_triptychWrapper: this._triptychWrapper,
				platformServices: this.platformServices,
				router:this.router
		};
		this._welcomePanelComponent.init(options);
	};
	
	ENOXPackageManagement.initializeGlobalMethods = function (){
	
		widget.setConfigTabParam=function(key,value){
			key=key+widget.id;
			window.localStorage.removeItem(key);
			window.localStorage.setItem(key,value);
		};
		widget.getConfigTabParam=function(key){
			key=key+widget.id;
			return window.localStorage.getItem(key);
		};
	};

	ENOXPackageManagement.onSearch = function() { //query


	};

	ENOXPackageManagement._initPlatformServices = function() {
		var app = this;
		var initPlatformServices = ENOXSourcingPlatformServices.getPlatformServices(app);
		//var initSecurityContext = ENOXSourcingPlatformServices.getSecurityContext(app);

		initPlatformServices.then(async function(platformServices) {
			app.platformServices = platformServices;
			app._initWelcomePanel();
            updateWidgetObject.init(app);
			widget.platformServices = platformServices;
			app._applicationChannel.publish({event:'platform-service-ready',data:ENOXPackageManagement});
			
			app._initRouter();

			await app._setPasswordFlag(app);
		}, function() { //reason
			app.logger.warn("Skipping Security Context and CSRF Token retrieval");
		});
	};
	ENOXPackageManagement.resetWidgetPreferencesValue=function(key){
		widget.setValue(key,"");
	};
	
	return ENOXPackageManagement;
});
