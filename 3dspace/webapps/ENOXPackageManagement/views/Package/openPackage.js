//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/Package/openPackage',
		[ 
			'DS/ENOXPackageManagement/models/Package',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/DetailsView/DetailsView',
			'DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesView',
			'DS/ENOXPackageCommonUXInfra/LifeCycleView/LifeCycleViewBis',
			'DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline',
			'DS/ENOXPackageManagement/helpers/PackageHelper',
			'DS/ENOXPackageManagement/helpers/PublicationHelper',
			'DS/ENOXPackageManagement/views/PackageContentView/PackageContentView',
			'DS/ENOXPackageManagement/views/Publication/RelatedPublications',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/ENOXPackageManagement/views/Publication/CreatePublication',
	        'DS/ENOXPackageManagement/controllers/PublicationController',
			'DS/ENOXPackageManagement/views/Package/AttachmentsTabView',
			'DS/ENOXPackageUXInfra/models/CommonPackage',
			'DS/ENOXPackageUXInfra/helpers/CommonPackageHelper',
			'DS/ENOXPackageManagement/helpers/CommonHelper',
			'css!DS/ENOXPackageManagement/ENOXPackageManagement.css'
			],function(PackageModel,UIMask,DetailsView,PropertiesView,LifeCycleView,SourcingTimeline, PackageHelper,
			PublicationHelper,PackageContentView,RelatedPublications,NLS, NLSInfra,ENOXTDPPlatformServices,
			ENOXSourcingConstants,CommonUtils,ENOXTDPConstants,CreatePublication,PublicationController,
			AttachmentsTabView,CommonPackageModel,CommonPackageHelper,CommonHelper){

	'use strict';

	var openPackage = function(controller){
		this.controller = controller;
		this.helper = new PackageHelper();
		this.commonPackageModel = new CommonPackageModel();
		this.commonPackageHelper = new CommonPackageHelper();
		this.commonHelper = new CommonHelper();
	};
     let infoActivityView;
	openPackage.prototype.render=function(options){
		
		var that=this;
		//var infoIcon = widget.getElement('.information-panel.panel-icon-wrapper');
		if(!options.detailsContainer){
			//options.applicationChannel.publish({ event: 'make-information-panel-disappear', data: {forInfo:options.forInfo} });
			//options.applicationChannel.publish({ event: 'welcome-panel-hide' });
		}
		
		
		that.options= options;
        	var tdpLevel = [];
			tdpLevel.push({ label: "",
				value: ""});
			tdpLevel.push({ label: NLS.CONCEPTUAL,
				value: 'Conceptual Level'});
			tdpLevel.push({ label: NLS.DEVELOPMENTAL,
				value: 'Developmental Level'});
			tdpLevel.push({ label: NLS.PRODUCT,
				value: 'Product Level'});

			that.tdpLevel = tdpLevel;
			options.that = that;
	        var propertiesModel = new UWA.Class.Model({
		        	modifyAccess:options.data.respParams.modifyAccess,
					stateAccess:true,
					currentState:options.data.respParams.state,
		        	fields:that.getFieldsForPropertiesPage(options),
		    		save:async function(properties){
						if(!properties["title"].getValue() || !properties["title"].getValue().trim()){ 
							widget.notificationUtil.showError(NLS.title_empty);
							return;
						}
						options.id =options.data.respParams.id;
		    			options.formValues = {};
	                    for (var key in properties) {
		                    	 if (properties.hasOwnProperty(key) && !properties[key].options.nonEditable) {
									if(properties[key].options.identifier==="TDP_PackageContext") {
										let selectedItem = properties[key].selectedItems;
										options.formValues[key]=ENOXTDPConstants.EMPTY_STRING;
										if(selectedItem) {
											if (selectedItem.options.sourceid) {
												options.proxyRequestData = options.that.helper.getProxyPayload(selectedItem);
												let proxyResponseData = await options.that.controller.model.getProxyObject(options).catch(() => {
													widget.notificationUtil.showError(NLS.error_getting_proxy_object);
												});
												options.formValues[key] = proxyResponseData.data[0].proxyId;// if added from search
											}
											else {
												options.formValues[key] = properties[key].options.id;//case when same product without search is saved
											}
										}
									}
		                    		else if(properties[key].selectedItems) {		
										options.formValues[key] = properties[key].selectedItems.map(item => item.value);
		                    	 	}
			                    	else if(properties[key]._properties && properties[key]._properties.checkFlag)
		                    	 	      options.formValues[key] =  !!properties[key]._properties.checkFlag.value;
			                    	else if (properties[key].elements.content || properties[key].elements.input) { 
			                    		   options.formValues[key] = properties[key].elements.content ? properties[key].elements.content.value : properties[key].elements.input.value;
			                    	}
		                    	 }
	                    }
	                    that.controller.update(options);
		    		}
	        	});
	
	        	that.propertiesModel=propertiesModel;
	        	that.propertiesModel.id=options.id;
	        	
	        	//Creating the properties view object
				var propertiesView = new PropertiesView({
					model:propertiesModel
				});
				
					/*	
				//Do Not Remove Commented Code	
				let memberModel = new UWA.Class.Model({
				id:options.data.respParams.id,
				changeAccess:options.data.respParams.changeAccess,//added to add toolbar actions
				excludeQuery:"AND NOT [ds6w:identifier]:(\""+options.data.respParams.ownerIdentifier+"\")",//find members to add based on owner name
				mediator:options._mediator,
				modelEvent:options._mediator.createNewChannel(),
				infoContainer:options._triptychWrapper.getRightPanelContainer()
				});	
			
				let memberView = new MembersView({
					model:memberModel
				});
					*/
				let historycontainer =  UWA.createElement('div',{
    			styles:{
    				height:"100%",
    				width:"100%"
					}
				});
				 let access_for=NLS.access_for?NLS.access_for:"Access for";
				 let is_shared_with_user=NLS.is_shared_with_user?NLS.is_shared_with_user:"is shared with user";
				 let is_assigned_to_user=NLS.is_assigned_to_user?NLS.is_assigned_to_user:"is assigned to user";
				 let activityView=that.activityView= new SourcingTimeline({
						physicalId:  options.id,
						objectTitle: options.data.title,
						historyContainer:historycontainer,
						activityMappingObject:{
						connect:{
							"Sharing Access":function(connectedObjectParams){
							if(connectedObjectParams.type.indexOf("Group")!==-1)return access_for+" {contextTitle} "+is_assigned_to_user+" {title}";
							return access_for+" {contextTitle} "+is_shared_with_user+" {title}";
								}
							}
						}
					});
				
		    	//For ODT
		    	if(window.odtProp){
					window.odtProp = propertiesView;
				}
				that.attachmentsView = new AttachmentsTabView();
				//Creating lifeCycle View Object
				var lifeCycleModel = new UWA.Class.Model({
					modelEvent:options._mediator.createNewChannel(),
					id:options.data.respParams.id,
					source:ENOXSourcingConstants.SERVICE_3DSPACE,
					dataProviderPromise: new PackageModel().getLifeCycleDataProviderPromise(options),  // It is a data provider implemetation method which will return the json data format
					relativePath:"/resources/v1/modeler/dstdp/packages",	
					callBackForExecuteCmd:function(){
						new PackageModel().getPackage(options).then(function(respData2){
							var processedData=that.helper.processData(respData2.data[0]);
								
							if (processedData.grid.state===ENOXTDPConstants.state_inWork){
									that.relatedPublicationsView.modelEvent.publish({ event: 'update-model', data:processedData});
							}
							options.openPackageEvent.publish({ event: 'update-id-card-package', data:processedData});
							if(widget.getValue("isInfoPanelOpen")) {
										options.applicationChannel.publish({ event: 'information-panel-open', data: 'right' });
									}
							if (processedData.grid.state===ENOXTDPConstants.state_inWork 
								||processedData.grid.state===ENOXTDPConstants.state_frozen ){
									
									that.contentView.modelEvent.publish({ event: 'update-model',data:processedData});
									that.contentView.render().inject(that.contentContainer);
							}
							options.openPackageEvent.publish({
	    											event : "update-history-tab"});
							/*
							let lastSelectedTab=widget.getValue("LastSelectedTabInfoPanel");
							if(lastSelectedTab!==undefined && infoActivityView!==undefined){
							let lastSelectedTabJSON=JSON.parse(lastSelectedTab);
								if(lastSelectedTabJSON["Package InfoPanel"].contentPagetab==="Activity")
								{
								infoActivityView.historyApplicationChannel.publish({ event:'reload-history-content', data: {}});
								}
							}*/
						});
					}
				});
				
				that.lifeCycleModel = lifeCycleModel;
				var lifeCycleView =  new LifeCycleView({model:lifeCycleModel}); //LifeCycleViewBis
				options.lifeCycleModel = lifeCycleModel;
				
				var data =  (options.data)?options.data:{};
				
				//Details view options can be provided as follows
				var detailsViewOptions = {
						
				};
				
				options.attachmentsContainer = 	that.createExpanderUWADiv('attachments');
				options.attachmentsContainer.style.height = '100%';	
				// To show the Tab View, this setting has dependency with tabConfiguration
				detailsViewOptions.showTabView = true;
				detailsViewOptions.isInfoPanel = options.forInfo !== undefined;
				detailsViewOptions.tabConfiguration = [];
				detailsViewOptions.that = that;
				//detailsViewOptions.membersView = memberView;
				let sharePackageContainer = that.createExpanderUWADiv('sharePackageDiv');
				options.shareContainer = sharePackageContainer;
				options.model = that.controller.model;
				if(options.forInfo===undefined){
					detailsViewOptions.uniqueIdentifierForPersistency=NLS.openPackage;
					detailsViewOptions.tabConfiguration.push({ label: NLS.PackageContent, 
					  	content:that.getPackageContentTabContainer(options) ,
					  	index: "1" ,
					  	value:"PackageContentDiv",
					  	view:openPackage.contentView,
					  	icon : {iconName: 'collection wux-ui-3ds', fontIconFamily: 1}
					});
					//on cloud hide command if xcad or eventpublishing is not available
					if((ENOXTDPPlatformServices.getPlatformId() === "OnPremise")||(ENOXTDPConstants.XCAD_PROCESSOR_SERVICE in widget.platformServices && ENOXTDPConstants.EVENT_PUBLISHING_SERVICE in widget.platformServices)){
						detailsViewOptions.tabConfiguration.push({ label: NLS.publications, 
							content:that.relatedPublicationsViewContainer(options) ,
							index: "2" ,
							value:"PublicationsContentDiv",
							view:openPackage.relatedPublicationsView,
							icon : {iconName: 'box-status-ok wux-ui-3ds', fontIconFamily: 1}
						});
					}
				} else if(options.forInfo && options.infoPanelForPackageDetails){
					detailsViewOptions.uniqueIdentifierForPersistency="Package InfoPanel";
					detailsViewOptions.tabConfiguration.push({ label: NLS.properties, 
						content: propertiesView.render(), // View reference
					  	index: "1" ,
					  	value:"properties",
						isSelected:true,
					 	icon : {iconName: 'attributes', fontIconFamily: 1}
					});
					detailsViewOptions.tabConfiguration.push({ 
					  	label: NLS.attachments, 
					  	content: that.getAttachmentsView(options),
					  	index: "2" ,
					  	value: "attachments",
					 	icon : {iconName: 'docs', fontIconFamily: 1},
						events:{
							click: function() {
								that.getAttachmentsView(options);
							}
						}
					});
					that.commonHelper.getFacetTabs(detailsViewOptions, options,3);
					detailsViewOptions.tabConfiguration.push({ label:NLS.share, 
							content: sharePackageContainer,
							index: "5",
							value:"sharePackageDiv",
							icon : {iconName: 'navigation-history-share wux-ui-3ds', fontIconFamily: 1},
							events:{
								click: function() {
									that.commonHelper.getTrackDistributionTab(options);
								}
							}
					});	
					detailsViewOptions.tabConfiguration.push({ 	label: NLS.activity, 
						content: historycontainer, 
						index: "6" ,
						view:activityView.render(),
						value:"Activity",
						icon : {iconName: 'navigation-history', fontIconFamily: 1},
						events:{
						click:function(){
								infoActivityView=activityView.render();
							}
						}
					});
				} else {
					detailsViewOptions.uniqueIdentifierForPersistency="Package InfoPanel";
					detailsViewOptions.tabConfiguration.push({ label: NLS.PackageContent, 
						  content:that.getPackageContentTabContainer(options) ,
						  index: "1" ,
						  value:"PackageContentDiv",
						  isSelected:true,
						  view:openPackage.contentView,
						  icon : {iconName: 'collection wux-ui-3ds', fontIconFamily: 1}
					});
					if((ENOXTDPPlatformServices.getPlatformId() === "OnPremise")||(ENOXTDPConstants.XCAD_PROCESSOR_SERVICE in widget.platformServices && ENOXTDPConstants.EVENT_PUBLISHING_SERVICE in widget.platformServices)){
						detailsViewOptions.tabConfiguration.push({ label: NLS.publications, 
							  content:that.relatedPublicationsViewContainer(options) ,
							  index: "2" ,
							  value:"PublicationsContentDiv",
							  view:openPackage.relatedPublicationsView,
							  icon : {iconName: 'box-status-ok wux-ui-3ds', fontIconFamily: 1}
						});
					}
					detailsViewOptions.tabConfiguration.push({ label: NLS.properties, 
					  	content: propertiesView.render(), // View reference
					  	index: "3" ,
					  	value:"properties",
					  	icon : {iconName: 'attributes', fontIconFamily: 1}
					});
					detailsViewOptions.tabConfiguration.push({ 
					  	label: NLS.attachments, 
					  	content: that.getAttachmentsView(options),
					  	index: "4" ,
					  	value: "attachments",
					 	icon : {iconName: 'docs', fontIconFamily: 1},
						events:{
							click: function() {
								that.getAttachmentsView(options);
							}
						}
					});
					that.commonHelper.getFacetTabs(detailsViewOptions, options,5);
					detailsViewOptions.tabConfiguration.push({ label:NLS.share, 
						content: sharePackageContainer,
						index: "7",
						value:"sharePackageDiv",
						icon : {iconName: 'navigation-history-share wux-ui-3ds', fontIconFamily: 1},
						events:{
							click: function() {
								that.commonHelper.getTrackDistributionTab(options);
							}
						}
					});
					detailsViewOptions.tabConfiguration.push({ 	label: NLS.activity, 
						content: historycontainer, 
						index: "8" ,
						view:activityView.render(),
						value:"Activity",
						icon : {iconName: 'navigation-history', fontIconFamily: 1},
						events:{
						click:function(){
								infoActivityView=activityView.render();
							}
						}
					});
				}
				// Providing the ID card Options
				let reviseAccess = false;
				let id = data.respParams.id;
				let label = data.respParams.title;
				reviseAccess = (data.respParams.state === ENOXTDPConstants.state_released || data.respParams.state === ENOXTDPConstants.state_obsolete);
				let getDropdown = (revisionAccess, packageId, packageLabel) => {
					let menus=[{ text: NLS.revise, name:"revise", fonticon: 'flow-line-add', disabled:!revisionAccess},
							   { text: NLS.life_cycle_label, name:ENOXSourcingConstants.MATURITY_STATE, fonticon: 'collaborative-lifecycle-management' }];
					if((ENOXTDPPlatformServices.getPlatformId() === "OnPremise")||(ENOXTDPConstants.XCAD_PROCESSOR_SERVICE in widget.platformServices && ENOXTDPConstants.EVENT_PUBLISHING_SERVICE in widget.platformServices)){
						menus.push({ text: NLS.generate_publication_label, name:ENOXTDPConstants.generate_publication, fonticon: 'lifecycle-management-3d-object'});
					}
					return {
							items: menus,
							events: {
								onClick: function (e, item) { 
									if(item.name === ENOXSourcingConstants.MATURITY_STATE){
										lifeCycleView.render();
									}
									else if(item.name === ENOXTDPConstants.generate_publication){
										let selectedPackageId =  that.options.data.respParams.id;
										let packageOptions = {};
										packageOptions.router=that.options.router;
										packageOptions.controller = that.controller;
										packageOptions.label=that.options.data.respParams.title;
										packageOptions.grid={
											description:that.options.data.respParams.description
										};
										packageOptions.data = {
											params: {
												id: selectedPackageId,
												hasIPRole:that.options.data.respParams.hasIPRole
											}
										};
										packageOptions.state=that.options.data.respParams.state;
										var createPub = new CreatePublication(new PublicationController());
										packageOptions.createPub=createPub;
										packageOptions.mediator = options._mediator;
										packageOptions.getFiles = "files";
										packageOptions.getClasses = "classes";
										//packageOptions.getBOM ="bom";// Uncomment for bomdisplay
										packageOptions.route="packageDetails";
										packageOptions.relatedPublicationsView=that.relatedPublicationsView;
										packageOptions.openPackageEvent=options.openPackageEvent;
										createPub.verifyAndCreatePublication(packageOptions);
									}
									else if(item.name === ENOXTDPConstants.revise){
										that.controller.confirmRevisionAction(options, packageId, packageLabel);
									}
								}
							}
					};
				};
				that.attributeMap = [
					{ name: NLS.name, value: data.respParams.name, displayWhenMinified: true },
					{ name: NLS.revision, value: data.respParams.revision},				
					{ name: NLS.maturity_state, value: "",type: 'type-text', id : 'maturityState', editable:true, displayWhenMinified: true},
					{ name: NLS.owner, value:data.respParams.owner, displayWhenMinified: true },
					{ name: NLS.Package_Level, value: data.respParams.Package_Level},	
					{ name: NLS.creation_date, value:CommonUtils.getDateStringForDisplay(options.data.respParams.created),type: 'type-text'}
					];
				detailsViewOptions.idCardDetails={
					name:data.respParams.title,
					//thumbnail: (data.respParams.image)?require.toUrl(data.respParams.image):"",
					thumbnail: require.toUrl('ENOXPackageManagement/assets/icons/I_DataPackage_Thumbnail.png'),
					attributes:that.attributeMap,
					withHomeButton: !options.forInfo,
					withActionsButton: true,
					dropdown: getDropdown(reviseAccess, id, label),
					withExpandCollapseButton: true,
					withInformationButton: !options.forInfo, // will be enabled when functionality is added
					minified: true
				};
				options.callback=function(){
					UIMask.unmask(widget.body);
				};
				options.detailsViewOptions = detailsViewOptions;
				var detailsView =  new DetailsView();
				detailsView.init(options);
				// Add custom events to id card
				detailsView.myIDCardModel._attributes.modelEvents.subscribe(detailsView.myIDCardModel._attributes.customEvents.homeIconClick, () => {
					options.router.navigate("home.MyPackages");
					options.applicationChannel.publish({ event: 'welcome-panel-expand' });
				});
			
				 options.openPackageEvent.subscribe({ event: 'update-history-tab' },function(){
						let lastSelectedTab=widget.getValue("LastSelectedTabInfoPanel");
						if(lastSelectedTab!==undefined && infoActivityView!==undefined){
						let lastSelectedTabJSON=JSON.parse(lastSelectedTab);
							if(lastSelectedTabJSON["Package InfoPanel"].contentPagetab==="Activity")
							{
							infoActivityView.historyApplicationChannel.publish({ event:'reload-history-content', data: {}});
							}
						}	
					});
				
	        	options.openPackageEvent.subscribe({ event: 'update-id-card-package' },function(eventdata){
	        		var dd = detailsView.mIDCardContainer;
					dd._idCard.model.set("name",eventdata.grid.title);
	        		
	        		detailsView.updateWidgetObject.updateTitle(eventdata.grid.title?eventdata.grid.title:eventdata.grid.name);
	        		
	    			that.attributeMap = [
	    				{ name: NLS.name, value: eventdata.grid.name, displayWhenMinified: true },
	    				{ name: NLS.revision, value: eventdata.grid.revision},
	    				{ name: NLS.maturity_state, value: "",type: 'type-text', id : 'maturityState', editable:true, displayWhenMinified: true},
	    				{ name: NLS.owner, value: eventdata.grid.owner, displayWhenMinified: true },
	    				{ name: NLS.Package_Level, value: eventdata.grid.Package_Level },
	    				{ name: NLS.creation_date, value:CommonUtils.getDateStringForDisplay(eventdata.grid.created)}
	    			];
					if(dd && dd._idCard){
		        		dd._idCard.model.unset('attributes');
		        		dd._idCard.model.set("attributes",that.attributeMap);
						that.options.data.respParams.title=eventdata.grid.title;
						that.options.data.respParams.description=eventdata.grid.description;
						that.options.data.respParams.state=eventdata.grid.state;
					}
					
					
					reviseAccess = (data.respParams.state === ENOXTDPConstants.state_released || data.respParams.state === ENOXTDPConstants.state_obsolete);
					let dropdown= getDropdown(reviseAccess, eventdata.grid.id, eventdata.grid.title);
					dd._idCard.model.set('dropdown',dropdown);
					
					detailsView.lifeCycleView.model.unset('maturityContainer');
					detailsView.lifeCycleView.model.set('maturityContainer',dd);
					
	    			var evtOptions = {};
	    			evtOptions.platformServices = options.platformServices;
	    			evtOptions.data = {
	    					"respParams":eventdata.grid
	    			};
	    			evtOptions.that = that;
	    			var fields = that.getFieldsForPropertiesPage(evtOptions);
	    			that.propertiesModel.unset('fields');
	    			that.propertiesModel.set("fields", fields);
	    			that.propertiesModel.set("modifyAccess", eventdata.grid.modifyAccess);
					if(options.updateCRList)
					options.updateCRList(eventdata);
	        	});
	};
	
	openPackage.prototype.getFieldsForPropertiesPage=function(options){
		var that = this;
		var elementsRequiredChoice = [];
		
		options.data.respParams.ElementsRequiredRange.forEach((item) => {
				elementsRequiredChoice.push({"value" : item.name,"label":item.name});
		});
		
		options.data.respParams.ElementsRequired.forEach((selectedItem) => {
			elementsRequiredChoice.forEach((item) => {
				if(item.value === selectedItem)
				    item.selected = true;
			});
		});
		let allFields = [
					{
			            type: 'text',
			            label: NLS.type,
			            name:'type',
			            value:NLS[options.data.respParams.type]?NLS[options.data.respParams.type]:
			            	options.data.respParams.type,
			            disable: true,
			            nonEditable:true
					},
					{
			            type: 'text',
			            label: NLS.name,
			            name:'name',
			            value:options.data.respParams.name,
			            disable: true,
			            nonEditable:true
					},
					{
		                type: 'text',
		                label: NLS.title,
		                placeholder: NLS.title,
		                required: true,
		                name:'title',
		                value:options.data.respParams.title,
		                disable: true,
		                errorText: NLSInfra.max_char_limit_err_msg,
		                "isLengthy": false,
		                "helperText": NLSInfra.length_100_limit
					},
					{
					  type: 'select',
			          label: NLS.Package_Level,
			          name:'Package_Level',
			          options: that.tdpLevel,
			          value:options.data.respParams.Package_Level,
			          disable: true
					},
					{
            		    type: 'checkbox',
						name: 'isReleased',
						id:'packageReleaseMaturity',
            		    label:NLS.release_package_based_on_maturity,
            		    checked:options.data.respParams.IsContentReleased === ENOXTDPConstants.key_true
            		},
					{
						type: 'text', 
						label: NLS.target_format_recommendations_title,
						placeholder: NLS.export_format_recommendations_placeholder,
						name:'formats',
						"isLengthy": false,
						value: options.data.respParams.ExportFormats,
						disable: true,
						"helperText": NLSInfra.length_100_limit
					},
					{
		                type: 'autocomplete',
		                className: "src-multi-select-autocomplete",
		                label: NLS.tdp_elements_required,
		                name: 'TDPElements',
		                multiSelect : true,
		                showSuggestsOnFocus : true,
		                floatingSuggestions : false,
		                allowFreeInput : false,
		                dataSet : {
		        			'name' : 'Elements Required Dataset',
		        			'items' : elementsRequiredChoice
		            	},
		                placeholder: NLS.ElementsRequired_Placeholder,
		                disable: true,
		                value: options.data.respParams.ElementsRequired    
		            },
					{
		 				type: 'autocompleteWithSearch',
						label: NLS.package_product_context_label,
						nonEditable: options.data.respParams.contextProductId===ENOXTDPConstants.Not_Accessible,
						placeholder: NLS.package_product_context_placeholder,
						allowDrop : false,
						name: "contextProductId",
						value:(options.data.respParams.contextProductTitle)?options.data.respParams.contextProductTitle:"",
						multiSelect: false,
						itemMultiSelect: false,
						allowFreeInput: false,
						floatingSuggestions: true,
						identifier: "TDP_PackageContext",
		                id: (options.data.respParams.contextProductId)?options.data.respParams.contextProductId:"",
						completePreCond: ENOXSourcingConstants.QUERY_ENG_ITEM_SEARCH,
						searchButtonNotRequired: false,
						sources: [ENOXSourcingConstants.SERVICE_3DSPACE],
						callback : function (e){ //callback for Autocomplete with search
							var textfield = e.getInputField();
							textfield.value = e.getSelectedObjectAttrValue("label");
							textfield.id = e.getSelectedObjectAttrValue("value");
							textfield.identifier = e.getSelectedObjectAttrValue("value");
							e.autocompleteField.elements.input = textfield;
							if(e.getSelectedObjectAttrValue("resourceid") === undefined) e.clearIdentifier(e);
						}		
		            },
					{
		                type: 'textarea',
		                label: NLS.disclaimer,
		                placeholder: NLS.disclaimer,
		                name:'disclaimer',
		                value:options.data.respParams.TDP_Disclaimer,
					        	"maxlength":1000,
		                "helperText": NLS.Disclaimer_Helper_Text
					},
					{
		                type: 'textarea',
		                label: NLS.description,
		                placeholder: NLS.description,
		                name:'description',
		                value:options.data.respParams.description,
		                disable: true,
		                errorText: NLSInfra.max_char_limit_err_msg,
		                "isLengthy": true,
		                "helperText": NLSInfra.length_256_limit
					}
				];
		return allFields;
	};
	
	openPackage.prototype.getAttachmentsView = function(attachmentOptions) {
		let that = this;
		let viewOptions = {
			container: attachmentOptions.attachmentsContainer,
			platformServices: attachmentOptions.platformServices,
			applicationChannel: attachmentOptions.applicationChannel,
			_triptychWrapper: attachmentOptions._triptychWrapper,
			_mediator: attachmentOptions._mediator,
			id: attachmentOptions.id,
			state: attachmentOptions.data.respParams.state,
			modifyAccess: Boolean(attachmentOptions.data.respParams.modifyAccess.toLowerCase()),
			worksheetHeader: NLS.worksheet_files,
			disclaimerHeader: NLS.disclaimer_files
		};
		that.attachmentsView.list(viewOptions);
		return attachmentOptions.attachmentsContainer;
	};

openPackage.prototype.relatedPublicationsViewContainer = function(options){
			var that = this;
		  	var publicationContainer = openPackage.prototype.createExpanderUWADiv('publicationsDiv');
		  	publicationContainer.style.height='100%';
        var packageModel = new PackageModel();
		    
		    var helper= new PublicationHelper();
			var publicationController=new PublicationController();
    		var relatedPublicationsView = {};
        var relatedPublicationModel = new UWA.Class.Model({
        parentOptions:options,
				controller:that.controller,
				contextObject:packageModel,
				mediator:options._mediator,
				modelEvent:options._mediator.createNewChannel(),
				infoContainer:options._triptychWrapper.getRightPanelContainer(),
				additionalHeaders:  {},
				applicationChannel:options.applicationChannel,
				triptychWrapper:options._triptychWrapper,	
				helper:helper,
				publicationController:publicationController,
				router:options.router
    		});
			
        	 relatedPublicationsView = new RelatedPublications({
    		    model : relatedPublicationModel
    		});
			 openPackage.relatedPublicationsView=relatedPublicationsView;
	         that.relatedPublicationsView=relatedPublicationsView;
       relatedPublicationsView.render().inject(publicationContainer);
		  	UIMask.unmask(widget.body);
	
    		return publicationContainer;
        };

	openPackage.prototype.addContentToPackage=function(options,attachContentData,contentView){
		let that =this;
		UIMask.mask(that.contentContainer, NLS.packagecontent_adding_message);
		that.commonPackageModel.addContent(options,attachContentData).then((respData) => {
			if(contentView && contentView.modelEvent) {
				that.commonPackageHelper.handleAttachContentSuccess(respData);
			}
		},(respData) => {
			that.commonPackageHelper.handleUpdateContentFailure(respData);
			UIMask.unmask(that.contentContainer);
		}).finally(
			function(respData){
				if(contentView && contentView.modelEvent){
					contentView.modelEvent.publish({ event: 'add-model',data:respData});
					UIMask.unmask(widget.body);
					UIMask.unmask(that.contentContainer);		
					options.openPackageEvent.publish({event : "update-history-tab"});						
				}
			}
		);
	};
	
	openPackage.prototype.getPackageContentTabContainer=function(options){
		var that = this;
		options.getClasses = "classes";
		if(options.forInfo===undefined){
			options.applicationChannel.publish({ event: 'welcome-panel-hide' });
		}
		var contentContainer = openPackage.prototype.createExpanderUWADiv('contenttDiv');
		contentContainer.style.height='98%';
		//--------------------------------------------------------Document Model Starts------------------------------------------------//
		
		var packageModel = new PackageModel(); 
		
		var helper= new PackageHelper();
		
		var contentView = {};
		var contentModel = new UWA.Class.Model({
			parentOptions:options,
			controller:that.controller,
			contextObject:packageModel,
			mediator:options._mediator,
			modelEvent:options._mediator.createNewChannel(),
			packageState :options.data.respParams.state,
			infoContainer:options._triptychWrapper.getRightPanelContainer(),
            additionalHeaders:  {},
            applicationChannel:options.applicationChannel,
            triptychWrapper:options._triptychWrapper,	
            helper:helper,
			openPackageEvent:options.openPackageEvent,
            processForObject: function(objectData){
				
				let title = [];
				let objId = [];
				for (let eachData of objectData) {
					title.push(eachData["ds6w:label"]?eachData["ds6w:label"]:"");
					objId.push(eachData.id?eachData.id:eachData.physicalid);
				}
				let that = this;
					let dataValues = [];
					for(let i = 0; i < objectData.length; i++){
						dataValues.push({
							"content_ID":objId[i] ,
							"content_Title": title[i]
						});
					}

					var attachContentData = {
        				"data": dataValues
            		};

            		options.attachDocumentData = attachContentData;
        			that.addContentToPackage(options,attachContentData,contentView);
				
			}.bind(that),
			
			detachContent:function(objectData){
			
					that.commonPackageModel.detachContent(options,objectData).then(function(){ //respData
						contentView.modelEvent.publish({ event: 'add-model',data:objectData});
						contentView.model.get("applicationChannel").publish({event: 'information-panel-close'});
						that.commonPackageHelper.handleDetachContentSuccess(objectData);
						UIMask.unmask(widget.body);
						options.openPackageEvent.publish({event : "update-history-tab"});
					},function(objectData){
						that.commonPackageHelper.handleUpdateContentFailure(objectData);
						UIMask.unmask(widget.body);
					});
			}
		});		
		
		contentView = new PackageContentView({
			model:contentModel
		});	
		//check this call
       packageModel.getAttributesRange({data:{"attributes": ["TDP_PackageContent.AllowToPublish"]}}).then(function(attributeRange) {
					var temp = attributeRange["TDP_PackageContent.AllowToPublish"].range;
					var range = temp.replace('[','').replace(']','').split(',');
					range = range.map(attr => attr.trim());
					options.allowToPublish = {'Allow To Publish': range};
					openPackage.contentView =contentView;
		            contentView.render().inject(contentContainer);
				}).catch(function() {
					widget.notificationUtil.showError(NLS.error_attribute_range_fetching);
					UIMask.unmask(widget.body);
				}).finally(function(){});
				
				that.contentView=contentView;
				that.contentContainer=contentContainer;
		
		return contentContainer;
	};
	

	openPackage.prototype.createExpanderUWADiv = function(id){
		var uwaDiv = UWA.createElement('div', {
			id:id,
			styles:{
				'position': 'relative'
			}
		});
		return uwaDiv;
	};
	
	return openPackage;
});
