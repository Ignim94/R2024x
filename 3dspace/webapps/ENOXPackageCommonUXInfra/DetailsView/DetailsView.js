//XSS_CHECKED
/* global UWA */
/* global widget */
/*eslint complexity: off */
define('DS/ENOXPackageCommonUXInfra/DetailsView/DetailsView',
	[
		'DS/Controls/Tab',
		'DS/Menu/Menu',
		'DS/ENOXIDCardContainer/js/ENOXIDCardContainer',
		'DS/ENOXPackageCommonUXInfra/UpdateWidgetTitle/UpdateWidgetTitle',
		'DS/Utilities/Utils',
		'DS/ENOXPackageCommonUXInfra/DetailsView/IDCardUtilities',
		'DS/ENOXPackageCommonUXInfra/LifeCycleView/LifeCycleViewBis'
	], function (WUXTab, Menu, ENOXIDCardContainer, UpdateWidgetTitle, Utils, IDCardUtil, LifeCycleView) {

		'use strict';

		var DetailsView = function () {
			this.updateWidgetObject = new UpdateWidgetTitle();
		};
		DetailsView.prototype.init = function (options) {
			var that = this;
			if (!options.forInfo) {
				that.updateWidgetObject.init(options);
				let title = options.data.respParams.title ? options.data.respParams.title : options.data.respParams.Title ? options.data.respParams.Title : options.data.respParams.name;
				that.updateWidgetObject.updateTitle(title);
			}
			that.options = options;
			var container = "";

			if (that.options.detailsContainer) {
				if ((that.options.emptyDetailsView === undefined || that.options.emptyDetailsView === true) && that.options.detailsContainer.empty) that.options.detailsContainer.empty();
				container = that.options.detailsContainer;
			}
			else {
				if (widget.app._triptychWrapper.getMainPanelContainer().empty) {
					if (that.options.emptyDetailsView === undefined || that.options.emptyDetailsView === true) widget.app._triptychWrapper.getMainPanelContainer().empty();
				}
				container = widget.app._triptychWrapper.getMainPanelContainer();
			}

			var withHomeButton = true, withInformationButton = true;
			var lastVisitedRouteName = widget.getValue("lastVisitedRouteName");
			var previousRoutes = (widget.getRefreshViewParams) ? JSON.parse(widget.getRefreshViewParams(lastVisitedRouteName)).previousRoutes : [];
			var showBackButton = false;
			if (previousRoutes.length > 0 && previousRoutes[previousRoutes.length - 1].name &&(previousRoutes[previousRoutes.length-1].name !== widget.getValue("defaultRoute")))
				showBackButton = true;
			if (options.forInfo) {
				withHomeButton = withInformationButton = showBackButton = false;
			} else {
				if (that.options.app && that.options.idCardConfigs) {
					withHomeButton = that.options.idCardConfigs.withHomeButton;
					withInformationButton = that.options.idCardConfigs.withInformationButton;
					showBackButton = that.options.idCardConfigs.showBackButton;
				}
			}

			var idCardEvents = widget.app._mediator.createNewChannel();
			var idCardDetails = that.options.detailsViewOptions.idCardDetails;
			that.myIDCardModel = new UWA.Class.Model({
				name: idCardDetails.name,
				version: idCardDetails.version,
				configuration: idCardDetails.name ? idCardDetails.name.configuration : "",
				thumbnail: idCardDetails.thumbnail,
				withHomeButton: withHomeButton,    /** Add home button (false by default) */
				withExpandCollapseButton: false,    /** Add expand / collapse button (false by default) */
				withActionsButton: false === idCardDetails.withActionsButton ? idCardDetails.withActionsButton : true,    /** Add actions menu button (true by default) */
				withInformationButton: withInformationButton,    /** Add information button (false by default) */
				showBackButton: showBackButton,
				modelEvents: idCardEvents,
				dropdown: idCardDetails.dropdown,
				withToggleMinifiedButton: true,
				freezones: idCardDetails.additionalInfomation,    /** Two ways to pass parameters (plain HTML as string or HTMLElement) */
				/** Define some attributes */
				attributes: idCardDetails.attributes,
				/** Define custom events when interacting with the component */
				customEvents: {
					homeIconClick: { event: 'custom-show-landing-page-event' },
					expandCollapseIconClick: { event: 'custom-welcome-panel-toggle-event' },
					informationIconClick: { event: 'custom-information-icon-event' },
					configurationLabelClick: { event: 'custom-show-configuration-event' },
					versionLabelClick: { event: 'custom-show-version-explorer-event' },
					actionsMenuClick: { event: 'custom-open-actions-menu-event' },
					backButtonClick: { event: 'idcard-back' }
				},
				minified: idCardDetails.minified ? Boolean(idCardDetails.minified) : undefined
			});
			var containerOptions = {
				withtransition: true
			};
			that.mIDCardContainer = new ENOXIDCardContainer();
			that.mIDCardContainer.init(containerOptions, that.myIDCardModel);
			that.mIDCardContainer.inject(container);
			
			//for maturity state compact view
			let maturityAttr = that.mIDCardContainer._idCardModel.get("attributes").filter((attr)=>attr.id==="maturityState")[0];
			if(maturityAttr){
				options.lifeCycleModel.set('maturityContainer',that.mIDCardContainer);
				options.lifeCycleModel.set("subscribeLifeCycleModification",true);
				options.lifeCycleModel.set("applicationChannel",options.applicationChannel);
				options.lifeCycleModel.set("forInfoPanel",options.forInfo);
				that.lifeCycleView =  new LifeCycleView({model:options.lifeCycleModel});
				that.lifeCycleView.buildMaturityBadge();
			}
				
			if (widget.app && widget.app._initDroppable) {
				widget.app._initDroppable(that.mIDCardContainer._idCardContainer);
			}

			//No image in ID Card
			var idcardImageDiv = widget.getElement('.xapp-id-card-container .image-placeholder');
			if (idcardImageDiv && idcardImageDiv.children.length > 0 && idcardImageDiv.children[0].attributes.src.value === 'false')
				idcardImageDiv.style.display = 'none';

			//that._myModelEvents.publish({event : that.EVENT_IDCARD_LOAD_COMPLETE,data : {idCardContainer: that.mIDCardContainer, portfolio: portfolio }});

			//No free-zone data
			var freeZone0 = that.mIDCardContainer._idCardContainer.getElementsByClassName("free-zone free-zone-0")[0];
			if (!idCardDetails.additionalInfomation)
				freeZone0.style.display = 'none';

			//No free-zone data
			var freeZone1 = that.mIDCardContainer._idCardContainer.getElementsByClassName("free-zone free-zone-1")[0];
			if (!idCardDetails.additionalInfomation)
				freeZone1.style.display = 'none';

			idCardEvents.subscribe({ 'event': 'idcard-load-complete' }, function () { //data

			});

			that._idCardAttributeEditorHandler = function () {

				//console.log("qq");
			};

			idCardEvents.subscribe({ event: "idcard-attributes-clicked" }, Utils.debounce((data) => {
				var attribueObj = idCardDetails.attributes[data.index];
				if (attribueObj && data.attributeName === attribueObj.name && attribueObj.view) {
					attribueObj.view.render();
				}
				else if (attribueObj && data.attributeName === attribueObj.name && attribueObj.openTab) {
					attribueObj.openTab();
				}
			}, 300));
			
			idCardEvents.subscribe({ event: "idcard-minify" }, () => {
				if(that.mIDCardContainer._idCardModel.get("attributes").filter((attr)=>attr.id==="maturityState")[0])
					that.lifeCycleView.buildMaturityBadge();
			});
			
			idCardEvents.subscribe({ event: "idcard-expand" }, () => {
				if(that.mIDCardContainer._idCardModel.get("attributes").filter((attr)=>attr.id==="maturityState")[0])
					that.lifeCycleView.buildMaturityBadge();
			});

			idCardEvents.subscribe({ event: "custom-open-actions-menu-event" }, function () {
				if (that.options.detailsViewOptions.getActionsMenuCallback) {
					var actionButton = that.options._triptychWrapper.getMainPanelContainer().querySelector('.xapp-id-card-container .fonticon-open-down');

					var rect = actionButton.getBoundingClientRect();
					Menu.show(that.options.detailsViewOptions.getActionsMenuCallback(that.options), {
						position: {
							x: rect.left,
							y: rect.bottom
						},
						submenu: 'outside'
					});
				}
			});

			idCardEvents.subscribe({ event: "idcard-back" }, IDCardUtil.prototype.idcardBackButtonHandler.bind(that, options));

			idCardEvents.subscribe({ event: "custom-show-landing-page-event" }, IDCardUtil.prototype.idcardHomeButtonHandler.bind(that, options));

			idCardEvents.subscribe({ event: "custom-information-icon-event" }, IDCardUtil.prototype.idcardInfoButtonHandler.bind(that, options));

			if (that.options.detailsViewOptions && that.options.detailsViewOptions.showTabView && that.options.detailsViewOptions.tabConfiguration) {
				/*
				 * Draw Buttom Content
				 * 
				 */
				that.tabWindow = new WUXTab({
					multiSelFlag: false,
					touchMode: true,
					displayStyle: ['strip'],
					autoCloseFlag: true,
					newTabButtonFlag: false
				});

				that.tabWindow.getContent().style.height = '100%';
				that.tabWindow.tabPanelContainer.style.height = 'calc(100% - 44px)';
				that.tabWindow.tabBar.centeredFlag = false;

				that.tabWindow.inject(that.mIDCardContainer.getMainContent());

				that.tabAndInfoPanelPersistency(that);
				that.options.detailsViewOptions.tabConfiguration.forEach(function (tabItem) {
					that.tabWindow.add(tabItem);
				});

				/*        		that.tabWindow.addEventListener('change', function(){
						var tabEvent = this;
						that.options.detailsViewOptions.tabConfiguration.forEach(function(tabItem,idx){
							if(tabItem.value === tabEvent.dsModel.value[0]){
								tabItem.events.change();
							}
						});
					});*/

				that.tabWindow.addEventListener('tabButtonClick', function () {
					var tabEvent = this;
					that.options.detailsViewOptions.tabConfiguration.forEach(function (tabItem) { //idx
						if (tabItem.value === tabEvent.dsModel.value[0] && tabItem.reload && tabItem.view) {
							if(typeof tabItem.view === 'function') {
							tabItem.view(true);
							}else{
								tabItem.view.render(true);
							}
						}
						if (tabItem.value === tabEvent.dsModel.value[0] && tabItem.events && tabItem.events.click)
							tabItem.events.click();
					});

				});
			}
			if (!that.options.detailsViewOptions.showTabView && that.options.detailsViewOptions.contentView) {
				that.options.detailsViewOptions.contentView.inject(that.mIDCardContainer.getMainContent());
			}

			if (that.options.callback) {
				that.options.callback();
			}

			if (that.options.ODTCallBack) {
				that.options.ODTCallBack();
			}
		};

		DetailsView.prototype.tabAndInfoPanelPersistency = function (that) {
			var uniqueIdentifierForPersistency;
			let detailsViewOptions = that.options.detailsViewOptions;
			if (detailsViewOptions.uniqueIdentifierForPersistency) {
				uniqueIdentifierForPersistency = detailsViewOptions.uniqueIdentifierForPersistency;

				var LastSelectedTab;
				let obj = "{}";
				if (!detailsViewOptions.isInfoPanel && widget.getValue("LastSelectedTab"))
					obj = widget.getValue("LastSelectedTab");
				if (detailsViewOptions.isInfoPanel && widget.getValue("LastSelectedTabInfoPanel"))
					obj = widget.getValue("LastSelectedTabInfoPanel");
				obj = JSON.parse(obj);
				if (obj[uniqueIdentifierForPersistency])
					LastSelectedTab = obj[uniqueIdentifierForPersistency].contentPagetab;

				if (LastSelectedTab === undefined || LastSelectedTab === null) {
					detailsViewOptions.tabConfiguration[0].isSelected = true;
					obj = {
						[uniqueIdentifierForPersistency]: {
							contentPagetab: detailsViewOptions.tabConfiguration[0].value
						}
					};
					widget.setValue(uniqueIdentifierForPersistency, JSON.stringify(obj));
				}
				else {
					detailsViewOptions.tabConfiguration.every(tabItem => {
						if (tabItem.value === LastSelectedTab) {
							tabItem.isSelected = true;
							return false;
						}
						return true;
					});
				}
				that.tabWindow.addEventListener("change", function () {
					obj = {
						[uniqueIdentifierForPersistency]: {
							contentPagetab: that.tabWindow.value[0]
						}
					};

					if (detailsViewOptions.isInfoPanel) {
						let valuesForInfoPanelTabs = {};
						if (widget.getValue("LastSelectedTabInfoPanel")) {
							valuesForInfoPanelTabs = JSON.parse(widget.getValue("LastSelectedTabInfoPanel"));
						}
						let infoPanelObj = {
							...valuesForInfoPanelTabs,
							[uniqueIdentifierForPersistency]: {
								contentPagetab: that.tabWindow.value[0]
							}
						};
						widget.setValue("LastSelectedTabInfoPanel", JSON.stringify(infoPanelObj));
					}
					else
						widget.setValue("LastSelectedTab", JSON.stringify(obj));
				});
			}
		};

		return DetailsView;
	});
