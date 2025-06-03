//XSS_CHECKED

define(
    'DS/ENOXPackageManagement/components/WelcomePanel/WelcomePanelWrapper',
    [
     	'DS/ENOXPackageCommonUXInfra/components/WelcomePanel/CustomWelcomePanel',
        'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
        'DS/ENOXPackageManagement/controllers/PackageController',
		'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices'
    ],
    function(
    		CustomWelcomePanel,NLS, PackageController,ENOXTDPConstants,ENOXTDPPlatformServices
    ) {
        'use strict';

        var WelcomePanelWrapper = function() {};

        WelcomePanelWrapper.prototype.init = function(options) {
            var that = this;
            this._applicationChannel = options._applicationChannel;
            this.xPackageManagementRouter = options.xPackageManagementRouter;
            that.options = options;
            var parentContainer = options._triptychWrapper.getLeftPanelContainer();

            var activities = [
                {
                    id: 'access_work',
                    actions: [
                        {
                            id: 'NewPackage',
                            text: NLS.new_package,
                            fonticon: 'fonticon fonticon-plus',
                            className: 'action-new',
							isNotHighlightable : true
                        },
                        {
                            id: 'MyPackages',
                            text: NLS.my_packages,
                            fonticon: 'fonticon fonticon-box',
                            className: 'action-new activity-btn selected'
                        }
						
                    ]
                }
            ];
			//on cloud hide command if xcad or eventpublishing is not available
			if((ENOXTDPPlatformServices.getPlatformId() === "OnPremise")||(ENOXTDPConstants.XCAD_PROCESSOR_SERVICE in options.platformServices && ENOXTDPConstants.EVENT_PUBLISHING_SERVICE in options.platformServices)){
				activities[0].actions.push({
	                            id: 'MyPublications',
	                            text: NLS.my_publications,
	                            fonticon: 'fonticon fonticon-box-status-ok',
	                            className: 'action-new'
	            });
			}
			let securityContext = widget.getValue("SC");
			if(securityContext && securityContext.split(ENOXTDPConstants.DOT).shift().contains(ENOXTDPConstants.ADMIN_CONTEXT)) {
				activities[0].actions.push({
                            id: 'Configuration',
                            text: NLS.Configuration,
                            fonticon: 'fonticon fonticon-cog',
                            className: 'action-new'
                		});
			}
                       
            var welcomePanelOptions={
            		title: NLS.collaboration_package_management,
                    description:NLS.welcome_message,
                    parentContainer: parentContainer,
                    activities: activities,
                    applicationChannel: this._applicationChannel,
                    userAssistnceLink:"ENXCpmUserMap/enxcpm-c-ov.htm",
                    trainingLink:"ENXCpmUserMap/enxcpm-c-ov.htm"
                    };
            let customWelcomePanel = new CustomWelcomePanel();
            customWelcomePanel.injectCustomHTML(welcomePanelOptions);
			this.welcomePanelOptions = customWelcomePanel.getWelcomePanel();
            this._subscribeToEvents();
        };

		WelcomePanelWrapper.prototype.updateActions = function() {
			let securityContext = widget.getValue("SC");
			let isConfigurationCommandPresent = this.welcomePanelOptions.container.querySelector("#Configuration");
			if(securityContext && securityContext.split(ENOXTDPConstants.DOT).shift().contains(ENOXTDPConstants.ADMIN_CONTEXT)) {
				if(!isConfigurationCommandPresent) {
					let configurationAction = {
	                            id: 'Configuration',
	                            text: NLS.Configuration,
	                            fonticon: 'fonticon fonticon-cog',
	                            className: 'action-new'
	                		};
					this.welcomePanelOptions.createNewAction('access_work',configurationAction,3);
				}
			}
			else {
				if(isConfigurationCommandPresent) {
					this.welcomePanelOptions.removeAction('Configuration');
				}
			}
		}

        WelcomePanelWrapper.prototype._subscribeToEvents = function() {
            var that = this;
            this._applicationChannel.subscribe({
                event: 'welcome-panel-action-selected'
            }, function(data) {
            	if(data.id ==='NewPackage'){
        			var options = {};
        			options.router = that.xPackageManagementRouter._router;
        			options.applicationChannel = that._applicationChannel;
        			options.platformServices = that.options.platformServices;
					var refController = new PackageController();
					refController.createView(options); 
            	} else{
					if(data.id!=='Home'){
						var route = '', reload = false;
						if (!data.id.contains('modal'))
							route += 'home.';
						else {
							reload = true;
						}
						that.xPackageManagementRouter.navigate(route + data.id.replace(/-/g,'.'), {}, {reload: reload});
					}else{
						that.xPackageManagementRouter._router.routerMethods.home.activate();
						that.xPackageManagementRouter.navigate('home');
					}
            	}
            });
        };

        return WelcomePanelWrapper;
    });
