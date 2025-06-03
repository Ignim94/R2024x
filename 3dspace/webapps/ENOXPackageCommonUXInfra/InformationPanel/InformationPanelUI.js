define(
		'DS/ENOXPackageCommonUXInfra/InformationPanel/InformationPanelUI',
		[
			'UWA/Core',
			'DS/ENOXIDCardContainer/js/ENOXIDCardContainer',
			'DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesView',
			'DS/Controls/Tab',
			'css!DS/ENOXPackageCommonUXInfra/InformationPanel/customIDCard.css'
			],
			function (UWA,
					ENOXIDCardContainer,
					PropertiesView,
					Tab) {
			'use strict';

			var InformationPanel = function InformationPanel(options){
				this.triptychWrapper = options.triptychWrapper;
				this._mediator = options.mediator;

				this._myModelEvents = this._mediator.createNewChannel();
			};

			InformationPanel.prototype.init = function(data) {
				this.loadUI(data);
			};

			InformationPanel.prototype.loadUI = function(options) {

				var that = this;

				//start :: ID Card Section
				var objectData = {};

				objectData=options.objectData;
				objectData.withHomeButton = false;
				objectData.withExpandCollapseButton = false;
				objectData.withActionsButton = false;
				objectData.withInformationButton = false;
				objectData.withToggleMinifiedButton = true;
				objectData.modelEvents = that._myModelEvents;

				that.myIDCardModel = new UWA.Class.Model(objectData);
				var options1 = {
						withtransition : true,
						withoverflowhidden  : false
				};

				that.mIDCardContainer = new ENOXIDCardContainer();
				that.mIDCardContainer.init(options1, that.myIDCardModel);
				that.mIDCardContainer.inject(that.triptychWrapper.getRightPanelContainer());
				//end :: ID Card Section

				//start:: details section
				
				var stateAccess = false, modifyAccess ="FALSE";
				
				var propertiesModel = new UWA.Class.Model({
					modifyAccess : modifyAccess,
					stateAccess : stateAccess,
					fields : options.fields
				});
				
				that.propertiesModel=propertiesModel;
	        	
	        	//Creating the properties view object
				var propertiesView = new PropertiesView({
					model:propertiesModel
				});
				
				//that.mIDCardContainer._contentContainer.append(propertiesView.render());
				//vbt1-start
				if(options.tabs && options.tabs.length>0){
					this._tabsComponent = new Tab({
						multiSelFlag : false,
						touchMode : true,
						displayStyle : ['strip'],
						autoCloseFlag: true,
						newTabButtonFlag : false
					});
					this._tabsComponent.getContent().style.height='100%';
					this._tabsComponent.tabPanelContainer.style.height = 'calc(100% - 44px)';//Required for scrolling
					this._tabsComponent.tabBar.centeredFlag = false;
					//vbt1-end
					this._tabsComponent.inject(that.mIDCardContainer.getMainContent());
					this.propertiesTab = new UWA.Element('div', {styles: {'height': '100%'}});
					
					var propertiestab =  {
							label : "Properties",
							isSelected : true,
							icon : {iconName: 'wux-ui-3ds wux-ui-3ds-properties', fontIconFamily: 1},
							content : propertiesView.render(),
							index : 1,
							value : 'Properties'
								//value : '0',
								//allowClosableFlag: false
					};
					this._tabsComponent.add(propertiestab);
					options._tabsComponent=this._tabsComponent;
					this._addAdditionalTabs(options);
					
				}else{
				propertiesView.render().inject(that.mIDCardContainer.getMainContent());
				}
				//ends:: details section
			};
			
			InformationPanel.prototype._addAdditionalTabs = function(options) {
				for(var i=0;i<options.tabs.length;i++){
					options._tabsComponent.add(options.tabs[i]);
				}
				
			};

			return InformationPanel;
		});
