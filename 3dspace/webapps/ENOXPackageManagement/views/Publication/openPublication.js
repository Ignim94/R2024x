//XSS_CHECKED
/* global widget */
/* global UWA */
/* global WUXManagedFontIcons */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/Publication/openPublication',
		[ 
			'DS/ENOXPackageManagement/models/Publication',
			'DS/UIKIT/Mask',
			'DS/Controls/Button',
			'DS/ENOXPackageCommonUXInfra/DetailsView/DetailsView',
			'DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesView',
			'DS/ENOXPackageCommonUXInfra/LifeCycleView/LifeCycleViewBis',
			'DS/ENOXPackageCommonUXInfra/ObjectHistory/SourcingTimeline',
			'DS/ENOXPackageManagement/helpers/PublicationHelper',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'DS/ENOXPackageCommonUXInfra/components/IDCardInfo/IDCardInfo',
			'DS/ENOXPackageUXInfra/views/Publication/openPublication',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageManagement/helpers/CommonHelper',
			'css!DS/ENOXPackageManagement/ENOXPackageManagement.css'
			],function(PublicationModel,UIMask,WUXButton,DetailsView,PropertiesView,LifeCycleView,SourcingTimeline, PublicationHelper,
			NLS, NLSInfra,NLSPackageInfra,ENOXSourcingConstants,CommonUtils,ENOXTDPConstants,XsourcingCollectionView,IDCardInfo,CommonOpenPublication,ENOXTDPPlatformServices,CommonHelper){

	'use strict';
	var openPublication = function(controller){
		this.controller = controller;
		this.helper = new PublicationHelper();
		this.commonHelper = new CommonHelper();
		
	};
	let infoActivityView;
	let modifiedPropertyField ={};
	openPublication.prototype.render=function(publicationOptions){

		//var infoIcon = widget.getElement('.information-panel.panel-icon-wrapper');
	//	infoIcon.style.display='none';
		var that=this;
		//var infoIcon = widget.getElement('.information-panel.panel-icon-wrapper');
		let options = publicationOptions;
		let commonOpenPublication= new CommonOpenPublication(that.controller);
		if(!options.detailsContainer){
			//options.applicationChannel.publish({ event: 'make-information-panel-disappear', data: {forInfo:options.forInfo} });
			options.applicationChannel.publish({ event: 'welcome-panel-hide' });
		}
		
		that.options= options;    	
	          var propertiesModel = new UWA.Class.Model({
		        	modifyAccess:options.data.respParams.modifyAccess,
					stateAccess:true,
					currentState:options.data.respParams.state,
		        	fields:that.getFieldsForPropertiesPage(options),
					
					save:function(properties){
						let options = that.options;
						if(!properties["title"].getValue() || !properties["title"].getValue().trim()){ 
							widget.notificationUtil.showError(NLS.title_empty);
							return;
						}

						options.id =options.data.respParams.id;
		    			options.formValues = {};
	                    for (var key in properties) {
		                    if (properties.hasOwnProperty(key) && !properties[key].options.nonEditable) {
	                    		if(modifiedPropertyField[key]){
									if(properties[key].options.type === "date") {
										
										let creationdate = new Date(options.publication_creation_date);
										creationdate.setHours(0,0,0,0);
										let startdate = creationdate.setDate(creationdate.getDate() + 30);	
										let endDate = creationdate.setDate(creationdate.getDate() + 60);
										let fileremovaldate = Date.parse(properties[key].elements.input.value);
										if(!(fileremovaldate <= endDate && fileremovaldate >= startdate)){
											widget.notificationUtil.showError(NLS.file_removal_date_invalid);
											return 1;
										}
										
										options.formValues[key] = properties[key].elements.input.value;	
									}
									else if(properties[key].options.type === "wuxDate") {
											options.formValues[key] = properties[key].elements.inputField.value;
									}
			                    	else if (properties[key].elements.content || properties[key].elements.input) { 
											if(key === "title"){
												widget.notificationUtil.showWarning(NLS.title_modification_warning);
											}		
											options.formValues[key] = properties[key].elements.content ? properties[key].elements.content.value : properties[key].elements.input.value;
											
			                    		 }
									
								}
							}
						}
						if(Object.keys(options.formValues).length === 0){
							return 0;
						}
						
						modifiedPropertyField = {};
						let effectivityEndDate = options.formValues["effectivityEndDate"] || options.data.respParams.effectivityEndDate;
						let fileRemovalDate = options.formValues["File Removal Date"];
						if(effectivityEndDate && fileRemovalDate) {
							if(Date.parse(effectivityEndDate)>Date.parse(fileRemovalDate)) {
								widget.notificationUtil.showError(NLS.effectivity_date_invalid);
								return;
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
				infoContainer:options._triptychWrapper.getRightPanelContainer(),
				excludeRoles:["contributor"]
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
         let is_shared_with_user_group=NLS.is_shared_with_user_group?NLS.is_shared_with_user_group:"is assigned to user";
		 let activityView=that.activityView= new SourcingTimeline({
						physicalId:  options.id,
						objectTitle: options.data.title,
						historyContainer:historycontainer,
						activityMappingObject:{
						connect:{
							"Sharing Access":function(connectedObjectParams){
							if(connectedObjectParams.type.indexOf("Group")!==-1)return access_for+" {contextTitle} "+is_shared_with_user_group+" {title}";
							return access_for+" {contextTitle} "+is_shared_with_user+" {title}";
								}
							}
						}
					});
		    	//For ODT
		    	if(window.odtProp){
					window.odtProp = propertiesView;
				}
				//Creating lifeCycle View Object
	
				
				var data =  (options.data)?options.data:{};
				
				//Details view options can be provided as follows
				var detailsViewOptions = {
						
				};
				
								
				// To show the Tab View, this setting has dependency with tabConfiguration
				detailsViewOptions.showTabView = true;
				if(!options.forInfo)
					detailsViewOptions.uniqueIdentifierForPersistency=NLS.openPublication;
				else
					detailsViewOptions.uniqueIdentifierForPersistency="Related Publications InfoPanel";
				detailsViewOptions.isInfoPanel = options.forInfo !== undefined;
				detailsViewOptions.tabConfiguration = [] ;
				detailsViewOptions.that = that;
				//detailsViewOptions.membersView = memberView;
				let sharePublicationContainer = that.createExpanderUWADiv('sharePublicationDiv');
				options.shareContainer = sharePublicationContainer;
				options.model = that.controller.model;
				if(options.forInfo===undefined){
					widget.setValue("LastSelectedTabInfoPanel", undefined);
					detailsViewOptions.tabConfiguration.push({ label:NLSPackageInfra.contentReport,
								  content:commonOpenPublication.getContentReportTab(options) ,	
								  index: "1" ,
								  value:"ContentReportDiv",
								  isSelected:true,
								  icon : {iconName: 'collection wux-ui-3ds', fontIconFamily: 1},
								  events:{
									  
								  }
								});
					detailsViewOptions.tabConfiguration.push({ label:NLS.share, 
							content: sharePublicationContainer,
							index: "2",
							value:"sharePublicationDiv",
							icon : {iconName: 'navigation-history-share wux-ui-3ds', fontIconFamily: 1},
							events:{
								click: function() {
									that.commonHelper.getTrackDistributionTab(options);
								}
							}
						});								
				}
				
				else if(options.forInfo && options.infoPanelForPublicationDetails){
					detailsViewOptions.tabConfiguration.push(
						{ label: NLS.properties, 
							  content: propertiesView.render(), // View reference
							  index: "1" ,
							  value:"properties",
					isSelected:true,
							 icon : {iconName: 'attributes', fontIconFamily: 1},
							  events:{
								  
							  }
							}
					);
					that.commonHelper.getFacetTabs(detailsViewOptions, options,2);
					detailsViewOptions.tabConfiguration.push({ 	label: NLS.activity, 
								content: historycontainer, 
								index: "4" ,
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
				else{
					detailsViewOptions.tabConfiguration.push({ label:NLS.content_report_tab_header,
								  content:commonOpenPublication.getContentReportTab(options)  ,	
								  index: "1" ,
								  value:"ContentReportDiv",
								  isSelected:true,
								  icon : {iconName: 'collection wux-ui-3ds', fontIconFamily: 1},
								  events:{
									  
								  }
								});
					detailsViewOptions.tabConfiguration.push(
						{ label: NLS.properties, 
							  content: propertiesView.render(), // View reference
							  index: "2" ,
							  value:"properties",
							 icon : {iconName: 'attributes', fontIconFamily: 1},
							  events:{
								  
							  }
							}
					);
					
					that.commonHelper.getFacetTabs(detailsViewOptions, options,3);
					detailsViewOptions.tabConfiguration.push({ label:NLS.share, 
							content: sharePublicationContainer,
							index: "5",
							value:"sharePublicationDiv",
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
								view: activityView.render(),
								value:"Activity",
								icon : {iconName: 'navigation-history', fontIconFamily: 1},
								events:{
								click:function(){
										infoActivityView=activityView.render();
										}
								}
							});						
				}
				//Creating lifeCycle View Object
	
				var lifeCycleModel = new UWA.Class.Model({
					modelEvent:options._mediator.createNewChannel(),
					id:options.data.respParams.id,
					source:ENOXSourcingConstants.SERVICE_3DSPACE,
					dataProviderPromise: new PublicationModel().getLifeCycleDataProviderPromise(options),  // It is a data provider implemetation method which will return the json data format
					relativePath:"/resources/v1/modeler/dstdp/publications",	
					callBackForExecuteCmd:function(){
					that.controller.commonModel.getPublication(options).then(function(respData2){
						var processedData=that.helper.processData(respData2.data[0]);
						options.openPublicationEvent.publish({ event: 'update-id-card-publication', data:processedData});
						if(widget.getValue("isInfoPanelOpen")) {
										options.applicationChannel.publish({ event: 'information-panel-open', data: 'right' });
									}
						let lastSelectedTab=widget.getValue("LastSelectedTabInfoPanel");
						if(lastSelectedTab!==undefined && infoActivityView!==undefined){
						let lastSelectedTabJSON=JSON.parse(lastSelectedTab);
							if(lastSelectedTabJSON["Related Publications InfoPanel"].contentPagetab==="Activity")
							{
							publicationOptions.applicationChannel.publish({ event:'update-history-tab-publication', data: {}});
							}
						}
						
					});
				}
				});
				
				
				that.lifeCycleModel = lifeCycleModel;
				var lifeCycleView =  new LifeCycleView({model:lifeCycleModel}); //LifeCycleViewBis
				// Providing the ID card Options
				options.lifeCycleView=lifeCycleView;
				options.lifeCycleModel = lifeCycleModel;
				
				
				commonOpenPublication.getIDCardDetails(options,detailsViewOptions);
				detailsViewOptions.idCardDetails.dropdown={
						items: [
							{ text: NLS.life_cycle_label, name:ENOXSourcingConstants.MATURITY_STATE, fonticon: 'collaborative-lifecycle-management' },
							{ text: NLS.downLoad, name:ENOXTDPConstants.download_publication_zip, fonticon: 'download'}
							],
							events: {
								onClick: function (e, item) { 
									if(item.name === ENOXSourcingConstants.MATURITY_STATE){
											lifeCycleView.render();
										}else if(item.name === ENOXTDPConstants.download_publication_zip){
											var downloadOptions = {
												id:data.respParams.id,
												helper:that.controller.commonhelper,
												applicationChannel:options.applicationChannel
											};
											that.controller.model.downloadZipFile(downloadOptions);
										} 
									}
								}
					};
				detailsViewOptions.dropdown=
				options.callback=function(){
					UIMask.unmask(widget.body);
				};
				options.detailsViewOptions = detailsViewOptions;
				var detailsView =  new DetailsView();
				detailsView.init(options);
				// Add custom events to id card
				detailsView.myIDCardModel._attributes.modelEvents.subscribe({event: 'idcard-attributes-clicked'}, (attributeInfo) => {
					if(attributeInfo.attributeName === NLS.Publication_IDCard_Package)
						options.router.navigate("home.PackageDetails",{id:data.respParams.packageId,title:data.respParams.TDP_Package});
				});
				detailsView.myIDCardModel._attributes.modelEvents.subscribe(detailsView.myIDCardModel._attributes.customEvents.homeIconClick, () => {
					options.router.navigate("home.MyPublications");
					options.applicationChannel.publish({ event: 'welcome-panel-expand' });
				});
				
				
				options.openPublicationEvent.subscribe({ event: 'update-id-card-publication' },function(eventdata){
	        		var dd = detailsView.mIDCardContainer;
	        		dd._idCard.model.set("name",eventdata.grid.title);
	        		
	        		detailsView.updateWidgetObject.updateTitle(eventdata.grid.title?eventdata.grid.title:eventdata.grid.name);
	        		
	    			that.attributeMap = [
	    				{ name: NLS.name, value: eventdata.grid.name, displayWhenMinified: true },
	    				{ name: NLS.revision, value: eventdata.grid.revision},
	    				{ name: NLS.maturity_state, value: "",type: 'type-text', id : 'maturityState', editable:true, displayWhenMinified: true},
	    				{ name: NLS.Publication_IDCard_Package, value: data.respParams.TDP_Package+" - "+data.respParams.Package_revision,type: 'type-hyperlink',editable:true,displayWhenMinified: true},	
						{ name: NLS.owner, value:data.respParams.owner},
	    				{ name: NLS.Package_Level, value: eventdata.grid.Package_Level }
	    			];
					let idCardInfo = new IDCardInfo({
						infoAttributes: [
							{ name: NLS.creation_date, value:CommonUtils.getDateStringForDisplay(options.data.respParams.created),type: 'type-text'}
						]
					});
					if(dd && dd._idCard){
		        		dd._idCard.model.unset('attributes');
		        		dd._idCard.model.set("attributes",that.attributeMap);
						dd._idCard.model.unset('additionalInfomation');
						dd._idCard.model.set("additionalInfomation",[idCardInfo]);
					}
					
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

				publicationOptions.applicationChannel.subscribe({ event: 'update-history-tab-publication' },function(){
						if(infoActivityView)
						infoActivityView.historyApplicationChannel.publish({ event:'reload-history-content', data: {}});	
					});
			
		
		
	//});
	//});
	};

	openPublication.prototype.getFieldsForPropertiesPage=function(options){
		let that = this;
		that.options.data.respParams = options.data.respParams;
		options.publication_creation_date=CommonUtils.getDateStringForDisplay(new Date(options.data.respParams.created));
		let allFields=[];
	
	   
					allFields.push({
			            type: 'text',
			            label: NLS.type,
			            name:'type',
			            value:NLS[options.data.respParams.type]?NLS[options.data.respParams.type]:
			            	options.data.respParams.type,
			            disable: true,
			            nonEditable:true
					});
					allFields.push({
			            type: 'text',
			            label: NLS.name,
			            name:'name',
			            value:options.data.respParams.name,
			            disable: true,
			            nonEditable:true
					});
					allFields.push({
		                type: 'text',
		                label: NLS.title,
		                required: true,
		                name:'title',
		                value:options.data.respParams.title,
		                disable: true,
		                errorText: NLSInfra.max_char_limit_err_msg,
		                "isLengthy": false,
						"helperText": NLSInfra.length_100_limit,
						events:{
							onChange:function(){
								modifiedPropertyField["title"] = "changed";
							}
						}
					});
					allFields.push({
					  type: 'text',
			          label: NLS.Package_Level,
			          name:'Package_Level',
			          options: that.tdpLevel,
			          value:options.data.respParams.Package_Level,
			          disable: true,
			          nonEditable:true
					});
					allFields.push({
						type: 'text', 
						label: NLS.contained_format_recommendations_title,
						name:'formats',
						"isLengthy": false,
						value:options.data.respParams.ExportFormats,
						disable: true,
						"helperText": NLSInfra.length_100_limit,
			        	 nonEditable:true
					});
					allFields.push({
						type: 'text', 
						label: NLS.creation_date,
						name:'Creation Date',
						"isLengthy": false,
						value:options.publication_creation_date,
						disable: true,
			         	nonEditable:true
					});
					allFields.push({
		                type: 'text',
		                label: NLS.publication_properties_filename,
		                name:'publication_file_name',
		                value:options.data.respParams.publication_file_name,
		                "isLengthy": true,
		                disable: true,
				        nonEditable:true
					});
					allFields.push({
		                type: 'text',
		                label: NLS.description,
		                name:'description',
		                value:options.data.respParams.description,
		                "isLengthy": true,
		                disable: true,
						events:{
							onChange:function(){
								modifiedPropertyField["description"] = "changed";
							}
						}
					});
					allFields.push({
		                type: 'wuxDate',
		                label: NLS.FileRemovalDate,
		                name: 'File Removal Date',
						timePickerFlag:false,
		                value: options.data.respParams.FileRemovalDate,
						minValue: (() => {
							let date = new Date(options.data.respParams.created);
							date.setDate(date.getDate()+ENOXTDPConstants.PUBLICATION_FILE_REMOVAL_MIN_LIMIT);
							return date;
							
						})(),
						maxValue: (() => {
							let date = new Date(options.data.respParams.created);
							date.setDate(date.getDate()+ENOXTDPConstants.PUBLICATION_FILE_REMOVAL_MAX_LIMIT);
							return date;
						})(),
						events:{
							onChange:function(){
									modifiedPropertyField["File Removal Date"] = "changed";
							}
						}
					});
					allFields.push({
						type: 'wuxDate',
						label: NLS.effective_date_end,
						name: 'effectivityEndDate',
						timePickerFlag: false,
						allowUndefinedFlag: true,
						value: options.data.respParams.effectivityEndDate,
						minValue: "today",
						maxValue: new Date(options.data.respParams.FileRemovalDate),
						id: 'effectivityEndDate',
						events:{
							onChange:function(){
									modifiedPropertyField["effectivityEndDate"] = "changed";
							}
						}
					});
					
					/*{ //Do Not Remove :: (NLS File entry)"SecondaryOwner":"Secondary Owner",
		                type: 'text',
		                label: NLS.SecondaryOwner,
		                name:'Secondary Owner"',
		                value:options.data.respParams.packageOwner,
		                disable: true,
				        nonEditable:true
					},*/
		if(options.data.respParams.isPasswordProtected==="TRUE"&&ENOXSourcingConstants.ONPREMISE === ENOXTDPPlatformServices.getPlatformId()){
			let passwordContainer = UWA.createElement('div', {
			"id": "passwordContainer",
			 styles: {
				    "display": 'flex'
                }
			});
			if(options.data.respParams.isPasswordAccessible==="True"){
					let password = UWA.createElement('span', {
						"id": "passwordValue",
						text: "********",
							styles: {
							   "padding-top":"5px"	
							}
					});
					let eyeButton = new WUXButton({id:"eyeButtonID",showLabelFlag : false,displayStyle: "lite",visibleFlag: true, icon: { iconName: "eye"}});
					eyeButton.addEventListener('click', () =>  {	

						that.controller.model.getPassword(that.options).then(function(respData){
							let vsisibilityVutton=document.querySelector('#visibilityButton').getChildren();
							vsisibilityVutton[0].style.display = 'none';
							vsisibilityVutton[1].style.display = 'block';
							let passwordValue=document.querySelector('#passwordValue');
								passwordValue.innerHTML=atob(respData.data[0].filePassword);
								passwordValue.style["padding-top"]="2px";
						});
						
					});
					let eyeOffButton = new WUXButton({id:"eyeOffButtonID", showLabelFlag : false,displayStyle: "lite",visibleFlag: false, icon: { iconName: "eye-off",fontIconFamily: WUXManagedFontIcons.Font3DS}});
					eyeOffButton.addEventListener('click', () =>  {
						let vsisibilityVutton=document.querySelector('#visibilityButton').getChildren();
						
						vsisibilityVutton[1].style.display = 'none';
						vsisibilityVutton[0].style.display = 'block';
						let passwordValue=document.querySelector('#passwordValue');
						passwordValue.style["padding-top"]="5px";
						passwordValue.innerHTML="********";
					});
					let visibilityButton = UWA.createElement('span', {
						"id": "visibilityButton",
						styles: {
							   "padding-left":"5px"	
							},
						 html: [eyeButton,eyeOffButton]
					});
					password.inject(passwordContainer);
					visibilityButton.inject(passwordContainer);
			}else{
				let passwordNA = UWA.createElement('span', {
						"id": "passwordNA",
						text: NLS.password_not_accessible
					});
				passwordNA.inject(passwordContainer);
		  }
		  allFields.push({
		                type: 'customField',
		                label: NLS.file_password,
		                name:'File Password',
						id:'passwordWrapperProperties',
						content: passwordContainer

					});
	    }
				
	
		return allFields;
	};
	
	openPublication.prototype.createExpanderUWADiv = function(id){
		var uwaDiv = UWA.createElement('div', {
			id:id,
			styles:{
				'position': 'relative',
				'height': '100%'
			}
		});
		return uwaDiv;
	};
	
	
		
	return openPublication;
});
