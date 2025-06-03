//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/Configuration/ConfigurationDetailsView',
		[
			'DS/Controls/Tab',
			'DS/ENOXPackageManagement/views/Configuration/ElementsRequiredView',
			'DS/ENOXPackageManagement/views/Configuration/SettingsView',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement'
		 ],
		 function(Tab, ElementsRequiredView,SettingsView, NLS) {
	'use strict';

	let configurationDetailsView = function ConfigurationDetailsView(options) {
		this.options=options;
	};
	
	configurationDetailsView.prototype.render=function(options){
		
		this._myModelEvents = options.modelEvents;
		this._container = options._triptychWrapper.getMainPanelContainer();
		this._applicationChannel = options.applicationChannel;
		this._utils = options.utils;
		this.router = options.router;
		this._mediator = options._mediator;
		this._myContentEvents = this._mediator.createNewChannel();
		this._triptychWrapper=options._triptychWrapper;
		this.controller=options.controller;
		this.createTabView(this._container,options);
		
	};
	
	configurationDetailsView.prototype.createTabView = function(container, options){
		let that = this;
		//let elementsView={};
		
		this._tabsComponent = new Tab({
			multiSelFlag : false,
			touchMode : true,
			displayStyle : ['strip'],
			autoCloseFlag: true,
			newTabButtonFlag : false
		});
		this._tabsComponent.getContent().style.height='100%';
		this._tabsComponent.tabPanelContainer.style.height = 'calc(100% - 44px)';
		this._tabsComponent.tabBar.centeredFlag = false;
		this._addTabs(options);
		this._tabsComponent.inject(container);
		this._tabsComponent.addEventListener("change", function(){
			
			let lastvisitedRouteData= JSON.parse(widget.getConfigTabParam('lastVisitedConfigTab'));
			let selectedTab=that._tabsComponent.value[0];
			if(lastvisitedRouteData)lastvisitedRouteData.selectedTab={configurationTab:selectedTab};
			widget.setConfigTabParam('lastVisitedConfigTab',JSON.stringify(lastvisitedRouteData));
			
			
		});
	};
	
	configurationDetailsView.prototype._addTabs = function(options) {
		let selectedTab= JSON.parse(widget.getConfigTabParam('lastVisitedConfigTab')).selectedTab;
		if(selectedTab)options.selectedTab=selectedTab.configurationTab;
		this._initElementsRequiredTab(options);
		this._initSettingTab(options);
	};
	
	
	configurationDetailsView.prototype._initElementsRequiredTab=function(options){
		let that=this;
		let elementsRequiredDiv = new UWA.Element('div', {styles: {'height': '100%'}});
		//var erOptions = {... options};
	
	let ElementsRequiredModel = new UWA.Class.Model({
				data:options.attributeRanges,
    			parentOptions:options,
    			contextObject:options.controller.model,
    			controller: options.controller,
    			mediator:options._mediator,
    			modelEvent:options._mediator.createNewChannel(),
                tenant: widget.getValue("x3dPlatformId"),
                additionalHeaders:  {},
                platformServices:options.platformServices,
                applicationChannel:options.applicationChannel,
                triptychWrapper:options._triptychWrapper,
                router:options.router
    		});
        	let elementsRequiredView = new ElementsRequiredView({
    			model : ElementsRequiredModel
    		});
        	that.elementsRequiredView = elementsRequiredView;
        	elementsRequiredView.render().inject(elementsRequiredDiv);
		
		var elementsRequiredTab =  {
				label :NLS.Elements_Required,
				isSelected : options.selectedTab?options.selectedTab==="Elements_Required":true,
				icon : {iconName: 'legend', fontIconFamily: 1},
				content: elementsRequiredDiv,
				view:elementsRequiredView,
				index : 1,
				value : 'Elements_Required'
		};
		this._tabsComponent.add(elementsRequiredTab);
	};
	configurationDetailsView.prototype._initSettingTab=function(options){
		let that=this;
		let settingsTab = new UWA.Element('div', {styles: {'height': '100%'}});
		
		let settingsOptions = {... options};
		let settingsView =that.settingsView= new SettingsView(settingsOptions);
		settingsView.render(settingsOptions).inject(settingsTab);
		
		let settingstab =  {
				label :NLS.settings_tab_label,
				isSelected : options.selectedTab?options.selectedTab==="settings":false,
				icon : {iconName: 'fonticon fonticon-cog', fontIconFamily: 1},
				content: settingsTab,
				index : 2,
				value : 'settings'
		};
		this._tabsComponent.add(settingstab);
	};
	
	return configurationDetailsView;
});
