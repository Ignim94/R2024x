// XSS_CHECKED
define('DS/ENOSpecMultiGrid/control/ENOSpecMultiGridTabManager',
	[
		'UWA/Core',
		'DS/Controls/TabBar',
		'UWA/Class/View',
		'DS/Controls/TooltipModel',
		'DS/XSRCommonComponents/utils/Utils',
		'DS/XSRCommonComponents/utils/XSRMask',
		'text!DS/ENOSpecMultiGrid/assets/config/ENOSpecMultiGridTabConfig.json',
		'i18n!DS/ENOSpecMultiGrid/assets/nls/ENOSpecMultiGrid',
		'DS/XSRCommonComponents/utils/Constants'
	], function (UWA, WUXTabBar , View, WUXTooltipModel, Utils, Mask ,tabConfig, NLS, Constants) {

	'use strict';

	var multiGridTabManager = View.extend({

			setup: function (options) {
				
				this.appCore = options.appCore;
				this.multiGridTopBarMiddleDiv=this.appCore.multiGridMiddleTopBarDiv;
				this.tabOptions=options;
		
				this.container = new UWA.Element('div', {
					"id": "multigrid-item-tab-view"
				});
				this.container.inject(options.container);
				var ctx = this;
				
				this.itemViewSubsList=[];
				
				this.basicEvtSubsList=[];
				
			   if(tabConfig)
				   this._tabConfig = JSON.parse(tabConfig);
			},
			
			
			render: function () {
				var ctx = this;
	
				
				var mutiGridTabWindow = new WUXTabBar({
					    allowUnsafeHTMLOnTabButton:false,
						reorderFlag: false,
						showComboBoxFlag: true,
						pinFlag: true,
						editableFlag: false,
						multiSelFlag: false,
						centeredFlag : false,
						displayStyle: ['strip'],
						domId : "multigrid-item-tab",
						touchMode : true
						});
				mutiGridTabWindow.inject(ctx.multiGridTopBarMiddleDiv);
				var tabloaderInfo = {};
				var deafultTabLoader = {};
				//Mask.maskLoader(ctx.container);
				if(ctx._tabConfig){					
					var isFirstTabSet = false;					
					for (var tabName in ctx._tabConfig) {
						let tabDetails = ctx._tabConfig[tabName];
						let tLabel = NLS[tabDetails.nls_key] ? NLS[tabDetails.nls_key] : tabDetails.nls_key;
						let tIcon = tabDetails.icon;
						let tkey = tabDetails.key;
						let tLicense = tabDetails.license;
						let torder = tabDetails.order;
						let toolTipInfo =  NLS[tabDetails.toolTipKey] ? NLS[tabDetails.toolTipKey] : tLabel;
						tabloaderInfo[torder] = {loader :tabDetails.AmdLoader, key : tkey};
						let isSelected = false;
						 if(!isFirstTabSet&&!isSelected){
								deafultTabLoader = {loader :tabDetails.AmdLoader, key : tkey};								
								isSelected= true;
								isFirstTabSet = true;
						}
						let toolTip = new WUXTooltipModel({shortHelp:toolTipInfo ,allowUnsafeHTMLShortHelp:false});
						let tabBtn = mutiGridTabWindow.add({ label: tLabel , showTitleFlag: true, isSelected:isSelected, index: torder, icon: { iconName: tIcon , fontIconFamily: 1 }, allowClosableFlag: false });						
						tabBtn.tooltipInfos = toolTip;
						tabBtn.domId = "multigrid-item-tab-button-"+tkey;

				   }

				}
	
				ctx.tabContainer  = new UWA.Element('div', {"id": "multigrid-item-tab-contentview","class":"listContainer"}).inject(ctx.container);
				ctx._instantiateTab(deafultTabLoader.loader, ctx.tabContainer,deafultTabLoader.key);

			},
			
			_instantiateTab:function (AMDLoader, target , key) {
				var currentTabArguments = {AMDLoader :AMDLoader,target: target , key : key };
				var ctx = this;
				var options = {};
				options.container= target;
				options.selectedNodes =this.tabOptions.selectedItems;
				options.modelEvents =this.tabOptions.gridModelEvents;				
				options.currentTabKey = key;
				options.appCore = this.appCore;
				if(AMDLoader){
	
						require([AMDLoader], function(TabView){
							if(TabView){
								var view= new TabView(options);
								view.render();
								ctx.currentTab = {instance : view, currentTabArguments : currentTabArguments};
							}
							//Mask.unmaskLoader(ctx.container);

						});	


				}
				
				
			},
			
			destroy : function(){
				if(this.currentTab&& this.currentTab.instance.destroy) this.currentTab.instance.destroy();
				//if(this.itemViewSubsList)  this.modelEvents.unsubscribeList(this.itemViewSubsList);	
				//if(this.basicEvtSubsList)  this.basicModelEvents.unsubscribeList(this.basicEvtSubsList);				
				this.container.destroy();
				
			}
		});
	return multiGridTabManager;
});
