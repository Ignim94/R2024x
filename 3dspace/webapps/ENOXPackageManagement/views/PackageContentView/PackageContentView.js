//XSS_CHECKED
/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/PackageContentView/PackageContentView',
		[ 
			'UWA/Core', 
			'UWA/Class/View',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'WebappsUtils/WebappsUtils',
			'DS/DocumentManagement/DocumentManagement',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/Utilities/Dom',
			'DS/ENOXPackageCommonUXInfra/Search/ENOXPackageSearch',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/UIKIT/SuperModal',
			'DS/Controls/DatePicker',
			'DS/ENOXPackageUXInfra/Constants/ENOXPackageConstants',
	        'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
	        'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
			'DS/ENOXPackageCommonUXInfra/ErrorMessageHandlerUtil/ErrorMessageHandlerUtil',
			'DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/ENOSubscriptionMgmt/Commands/Subscribe',
			'DS/ENOSubscriptionMgmt/Commands/UnSubscribe',
			'DS/ENOSubscriptionMgmt/Commands/EditSubscribe',
			'DS/ENOSubscriptionMgmt/Commands/MySubscriptions',		
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/Controls/TooltipModel',
			'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
			'DS/ENOXPackageUXInfra/models/CommonPackage',
			'DS/ENOXPackageManagement/controllers/CommonController',	
			'DS/ENOXPackageCommonUXInfra/openwithservice/ENOXSourcingOpenWithService',								  
			'css!DS/UIKIT/UIKIT.css'
			],function(UWA,View,UIMask,XSourcingCollectionViewObj,WebappsUtils,DocumentManagement,
					NLS,DomUtils,ENOXComponentSourcingSearch,ENOXSourcingService,ENOXSourcingPlatformServices,SuperModal,DatePicker, ENOXPackageConstants,
					Constants, SearchUtility, ErrorMessageHandlerUtil, ENOXSourcingDataDragAndDrop, ENOXTDPConstants, Subscribe, UnSubscribe, EditSubscribe,
					MySubscriptions, NLSInfra, WUXTooltipModel,TDPCommonHelper,CommonPackageModel,CommonController,ENOXSourcingOpenWithService){

	'use strict';
	var _name = 'content-view';
    var PackageContentView = View.extend({
		name : _name,
		tagName : "div",
		domEvents : {},

		init : function(options) {
			//var that = this;
			this.model=options.model;
			this.commonPackageModel = new CommonPackageModel();
			this.searchUtil =  new SearchUtility();
			this.commonhelper= new TDPCommonHelper();
			this.commonController = new CommonController();	
			this.modelEvent = this.model.get("modelEvent");

			[ 'container', 'template', 'tagName', 'domEvents' ].forEach(function(propToDelete) {
				delete options[propToDelete];
			});
            this._parent(this, options);
		},

		setup : function() { 
			this.container.addClassName(this.getClassNames('-container'));            
		},
		update:function(){

			var boundingClientRect = this.outerDiv.parentElement.parentElement.getBoundingClientRect();
			this.outerDiv.style.height = boundingClientRect.height+"px";

		},
		getErrorIcon: function(node, isIP, packageState) {
			return this.commonhelper.getErrorIcon(node, isIP, packageState);
		},
		getDefaultContexualMenu: function(menu,model){
			var that= this;
			if(that.model.get("parentOptions").data.respParams.state === ENOXTDPConstants.state_inWork || that.model.get("parentOptions").data.respParams.state === ENOXTDPConstants.state_inDraft){
				if(model.getAttributeValue("last_revision").toUpperCase() === ENOXTDPConstants.key_false) {
					menu.push({
						'type': 'SeparatorItem'
					});
					menu.push(
					{
						id: 'latestRevisionContent',
						'type': 'PushItem',
						'title': NLS.package_content_latest_revision,
						icon: "part-replace-new", // need relevant icon
						action : {
							callback: function(){
								let tempData = model.options.grid;
								// This will execute only when ODT run and it will not fail for normal scenario
								if(window.odtData){
									window.odtData = model;
								}
								var superModal = new SuperModal({ renderTo: widget.body, okButtonText: NLS.replace_button});
								superModal.confirm(NLS.replace_confirmation,NLS["package_content_latest_revision"]+" - "+tempData.title , function (result) {
									result && that.getLatestRevisionOfContent(tempData);
								});
							}
						}
					});
				}
				menu.push({
					'type': 'SeparatorItem'
				});
				menu.push(
				{
					id: 'remove',
					'type': 'PushItem',
					'title': NLS.remove,
					icon: "remove",
					action : {
						callback: function(){
							let tempData = model.options.grid;
							// This will execute only when ODT run and it will not fail for normal scenario
							if(window.odtData){
								window.odtData = model;
							}
							var superModal = new SuperModal({ renderTo: widget.body, okButtonText: NLS.remove});
							superModal.confirm(NLS.remove_confirmation,NLS["remove"]+" - "+tempData.title , function (result) {
								result && that.detachContent(tempData);
							});
						}
					}
				});
			}
		},		
		render : function() {
			var that=this;
			that.controller=that.model.get("controller");
		    that.parentOptions=that.model.get("parentOptions");
			this.container.empty();
			this.outerDiv = UWA.createElement('div', {
				'class': 'outerDiv',
				'styles':{
					"height":'100%'
				}
			}).inject(this.container);


			UIMask.mask(this.container,NLS.loading_content);
			var options = {};
			options.data=[];
			if(that.model.get("contextObject")){
				that.loadData();
			}

			var hasDisconnectAccess = false;
			if(this.model.get("parentOptions").data.respParams.state === ENOXTDPConstants.state_inWork || this.model.get("parentOptions").data.respParams.state === ENOXTDPConstants.state_inDraft) 
			hasDisconnectAccess = true;
			
			options._mediator=that.model.get("mediator");
			options.openPackageEvent=that.model.get("openPackageEvent");
			options.toolbarActions = [];
			options.showToolbar = true;
			options.toolbarActions.push({
				id : "subscriptions",
				fonticon: "bell",
				text: NLS.Subscriptions,
				content :that.pupulateSubscriptionToolbarMenus()
			});				
			if(hasDisconnectAccess) {
				options.toolbarActions.push({
					fonticon: "plus",
					text: NLS["add_content"],
					disabled: this.model.get("hasConnectAccess")===false,
					content :that.pupulateToolbarMenus(false)
				});
	
			
				options.toolbarActions.push({
					id : "replaceWithLatestRevisionContent",
					text : NLS["package_content_latest_revision"],
					disabled : true,
					fonticon : "part-replace-new",
					handler: function(){
						var selectedContent = that.tableView._gridModel.getSelectedNodes();
						var superModal = new SuperModal({ renderTo: widget.body, okButtonText: NLS.replace_button});
						superModal.confirm(NLS.replace_confirmation,NLS["package_content_latest_revision"]+" - "+selectedContent[0].getAttributeValue("title") , function (result) {
							result && that.getLatestRevisionOfContent(selectedContent[0].options.grid);
						});
					}
	
				});
			
				options.toolbarActions.push({
					id : "detachContent",
					text : NLS["remove"],
					disabled : true,
					fonticon : "remove",
					handler: function(){
						var selectedDocs=that.tableView._gridModel.getSelectedNodes();
						var superModal = new SuperModal({ renderTo: widget.body, okButtonText: NLS.remove});
						var titleLabel = (selectedDocs.length === 1)?selectedDocs[0].options.label:selectedDocs.length+" "+ NLS.PackageContent;
						superModal.confirm(NLS.remove_confirmation,NLS["remove"]+" - "+titleLabel , function (result) {
							if(result){
								selectedDocs.forEach(function(obj){
									that.detachContent(obj.options.grid);
								});
							}
						});
					}
	
				});
			}
			
			
		
      	
			options.columnsConfigurations = [{
				"text": NLS.title,
				"dataIndex": "tree",
				"resizableFlag": true,
				"sortableFlag": true,
				"pinned": "left",
				minWidth : 150,
				getCellSemantics: function(cellInfos){
	        		var iconPath = cellInfos.nodeModel.options.grid.grouped ? cellInfos.nodeModel.options.grid.tree : cellInfos.nodeModel.options.grid.icon;
	        		return {
	        			icon:{ 
	        				"iconPath" : require.toUrl(iconPath),
	        				"iconSize":{
	        					height: "20px",
	        					width: "20px"
	        				}
	        			}
	        		};
	        	},
	        	getCellValue: function(cellInfos){
	        		return cellInfos.nodeModel.options.grid.grouped ? cellInfos.nodeModel.options.grid.tree : cellInfos.nodeModel.options.grid.title;	
	        	}
			},
			{ 
			    "text": NLS.type,
				"dataIndex": "typeDisplay"
				
		    },
		    {
			    "text": NLS.name,
				"dataIndex": "name"
		    },
		    {
				"text": NLS.revision,
				"dataIndex": "revision"
			},
			{
				"text":NLS.maturity_state,
				"dataIndex": "maturityStateDisplay"
			},
			{	
			        
				 "text":NLS.Is_last_revision,
			     "dataIndex": "last_revision",
				 "editableFlag":false,
				 "resizableFlag": true,
				 //"typeRepresentation":"boolean",
				 "editionPolicy":"EditionInPlace",
				 getCellTypeRepresentation: function (cellInfos) {
					let returnType = "boolean";
					if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible) {
						if(cellInfos.nodeModel.options.grid.isContentRowAccessible==="false") {
							returnType = "string";
						}
					}
					return returnType;
				}		
			},	
			{
				"text": NLS.owner,
				"dataIndex": "owner"
			},
			{
				"text": NLS.IP_Protection,
				"dataIndex": "ipclasses",
				getCellSemantics: function(cellInfos){
					if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible==="false") {
							return "";
					}					
					return that.getErrorIcon(cellInfos.nodeModel, true, that.parentOptions.data.respParams.state);
	        	},
				getCellClassName: function(cellInfos) {
							if (!cellInfos.nodeModel) {
								return "IP-Class";
							}
							// get content response to be checked for changed IPclass flag and add relevant class for red color
				},
				getCellValue : function (cellInfos) {
					if(cellInfos.nodeModel.options.grid.ipclasses){
						let ipclassesValue = cellInfos.nodeModel.options.grid.ipclasses;
						
						if(Array.isArray(ipclassesValue)) {
							if(ipclassesValue.length>0){
								let obj={
									"classesArray" :cellInfos.nodeModel.options.grid.ipclasses,
								    "width" :that.tableView._xsourcingCollectionViewUI._dataGridView.elements.header.getElementsByClassName("IP-Class")[0].clientWidth
								}; 
								let responseData=that.controller.commonhelper.getDisplayDataForIPandECClasses(obj);	
								that.TooltipString=responseData.Classes;
								return responseData.dataToBeDisplayed;
							}
							return " ";
						}	 
						return ipclassesValue;
					}
					return " ";
                },
				getCellTooltip: function(cellInfos) {
					// if IP class has changed then show previous IP class
					if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.ipclasses) {
						if(!Array.isArray(cellInfos.nodeModel.options.grid.ipclasses)) {
							that.TooltipString = cellInfos.nodeModel.options.grid.classesTooltip;  
						}
						return {
						  shortHelp: that.TooltipString
						};
					}	
					return that.tableView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
				}
			},
			{
				"text": NLS.Export_Control,
				"dataIndex": "exportClasses",
				getCellSemantics: function(cellInfos){
					if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible==="false") {
							return "";
					}					
					return that.getErrorIcon(cellInfos.nodeModel, false, that.parentOptions.data.respParams.state);
	        	},
				getCellClassName: function(cellInfos) {
					if (!cellInfos.nodeModel) {
						return "EC-Class";
					}
				},
				getCellValue : function (cellInfos) {
					if(cellInfos.nodeModel.options.grid.exportClasses){
						let exportClassesValue = cellInfos.nodeModel.options.grid.exportClasses;
						if(Array.isArray(exportClassesValue)) {
							if( exportClassesValue.length>0){
								let obj={
									"classesArray" :cellInfos.nodeModel.options.grid.exportClasses,
								    "width" :that.tableView._xsourcingCollectionViewUI._dataGridView.elements.header.getElementsByClassName("EC-Class")[0].clientWidth
							
								}; 
								let responseData=that.controller.commonhelper.getDisplayDataForIPandECClasses(obj);	
								that.TooltipString=responseData.Classes;
								return responseData.dataToBeDisplayed;
							}
							return " ";	
						}
						return exportClassesValue;
	                }
				    return " ";
                },
				getCellTooltip: function(cellInfos) {
					if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.exportClasses) {
						if(!Array.isArray(cellInfos.nodeModel.options.grid.exportClasses)) {
							that.TooltipString = cellInfos.nodeModel.options.grid.classesTooltip; 
						}
						return {
						  shortHelp: that.TooltipString
						};
					}	
					return that.tableView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
				}
			},
	       {
				"text": NLS.Allow_To_Publish,
				"dataIndex": "allowToPublish",
				"editionPolicy": "EditionInPlace",
				"getCellEditableState": (cellInfos) => {
					if(cellInfos.nodeModel) {
						let packageState = that.parentOptions.data.respParams.state;
						return ((packageState === ENOXTDPConstants.state_inWork || packageState === ENOXTDPConstants.state_inDraft) && 
						(cellInfos.nodeModel.getAttributeValue("exportClasses") || cellInfos.nodeModel.getAttributeValue("ipclasses")) &&
						 cellInfos.nodeModel.getAttributeValue("canEditAllowToPublish")!=="false");
					}
					return false;
				},
				"typeRepresentation": "boolean",
				"getCellClassName": (cellInfos) => {
							if (cellInfos.nodeModel) {
								if(cellInfos.nodeModel.getAttributeValue("allowToPublish") === ENOXTDPConstants.EMPTY_STRING)
									return cellInfos.cellView.getInitialClassName() + " has-error";
								return cellInfos.cellView.getInitialClassName();
							}
				},
				"getCellTooltip": function(cellInfos) {
					  if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("allowToPublish") === ENOXTDPConstants.EMPTY_STRING) {
						if(cellInfos.nodeModel.getAttributeValue("actualId") === ENOXTDPConstants.Not_Accessible){
							  return {
								shortHelp: NLS.content_tooltip_not_accessible
								};
						  }
						return {
						  shortHelp: NLS.content_tooltip
						};
					  } 
					  return that.tableView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
				},
				"setCellValue": function(cellInfos, value) {
					options.contextObjectId = that.model.get("parentOptions").id;
					that.setCellValueHandlerForAllowToPublish(options,cellInfos, value);
				}
			},
			{
		        text: NLS.files_to_publish,
		        dataIndex: "fileData",
		        //typeRepresentation: "functionIcon",
		        getCellSemantics: (cellInfos) => {
					if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible==="false"){
						return "";
					}					
					return {
						icon: cellInfos.nodeModel.options.grid.actionIcon,
						label: cellInfos.nodeModel.options.grid.actionLabel
					};
		        },
				getCellTypeRepresentation: function (cellInfos) {
					let returnType = "functionIcon";
					if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible) {
						if(cellInfos.nodeModel.options.grid.isContentRowAccessible==="false") {
							returnType = "string";
						}
					}
					return returnType;
				},
		        width: "auto"
			}];
			
			options.views=["Grid"];	
			options.enableDrag = false;
			options.uniqueIdentifier = "PackageContentView";
			options.onContextualEventCallback= function(params){
				var menu = [];
				if(params){

					var node = ( params.cellInfos && params.cellInfos.nodeModel) ? params.cellInfos.nodeModel : null;
					var rowID = ( params.cellInfos)  ? params.cellInfos.rowID : null;
					if(rowID ===-1 || !node){
						return this._contextualMenuBuilder ? this._contextualMenuBuilder.buildMenu(params, options) : [];
					}

					var model = params.cellInfos.nodeModel?params.cellInfos.nodeModel: params.cellInfos.cellModel;
					if(model){
				       return ENOXSourcingOpenWithService.getOpenWithMenu(model).then(function(openWithApps) {
							menu.push(
									{
										id:"OpenWith",
										'type': 'PushItem',
										'title': NLS.open_with,
										icon: "open",
										submenu: openWithApps
									});
							that.getDefaultContexualMenu(menu,model);
				        	return menu;
				           },function(){
				        	  that.getDefaultContexualMenu(menu,model);
				        	  return menu;
				           }).catch(function(){ //reason
				            //console.warn(reason);
						});
					}
				}else if (!params.cellCtxMenuRequired) {
					//console.log("");
				}
				return menu;
			};

			that.tableView = new XSourcingCollectionViewObj();
			options.container = that.outerDiv;
			options.rowSelection="multiple";
			options.sort=[{
				id: "title",
				text: NLS.title,
				type: "string"
			}];
			 options.rowUnSelectCallback = function(){
               let hyperLinkOption = {
                                             contextObjId: that.parentOptions.id,
                                               callControllerMethod: that.model._attributes.controller,
											   infoPanelForPackageDetails:true
                              };
       
                              widget.app._applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',
                                       data:{
                                               selectedObject: true, //to mimic a selected object to cater to current info panel mechanism
                                               openDetails: that.model._attributes.controller.commonhelper.getObjectDetailsInInfoPanel(hyperLinkOption)
                                       }
                               });
               };
			that.tableView.init(options);
			that.tableView._xsourcingCollectionViewUI._dataGridView.addEventListener('columnWidthChange', function() {
					that.tableView._xsourcingCollectionViewUI._dataGridView.updateColumnView("ipclasses",{
						 updateCellContent: true
					});
					that.tableView._xsourcingCollectionViewUI._dataGridView.updateColumnView("exportClasses",{
						 updateCellContent: true
					});
		    });

			that.tableView._gridModel.addEventListener("select", function(eventData){
				that._selectedRow=eventData.data.nodeModel.options.grid;
			});
			that.tableView._gridModel.addEventListener("unselect", function(){ //eventData data
				that._selectedRow=undefined;
			});	

			that.tableView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-selection-updated'},function(data){

				if(data.selectedItems.length>0){
					if(data.selectedItems.length===1 
					&& data.selectedItems[0].grid.last_revision.toUpperCase() === ENOXTDPConstants.key_false 
					&& that.parentOptions.data.respParams.fromdisconnectAccess.toUpperCase() === ENOXTDPConstants.key_true) {
						that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'replaceWithLatestRevisionContent'});	
					}
					else {
						that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'replaceWithLatestRevisionContent'});
					}
					if(!(that.model.get("hasDisconnectAccess")===false))
						that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'detachContent'});	
					// This is to handle upload export output for content othet than document objects.
					if(data.selectedItems[0].grid.actualType !== ENOXPackageConstants.DOCUMENT)
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'UploadExportOutput'});
					
					var infoOption = that.getContentInfoData((event && event.dsModel && event.dsModel.activeNode)?event.dsModel.activeNode:{options:data.selectedItems[data.selectedItems.length-1]});
					infoOption.triptychWrapper = that.model.get('triptychWrapper');
					infoOption.mediator=that.model.get('mediator');
					that.model.get('applicationChannel').publish({event:'xsourcing-collectionview-selected-object-id',data:{selectedObject:infoOption}});
				
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'subscribe'});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'Unsubscribe'});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'EditSubscription'});				
				}else{
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'replaceWithLatestRevisionContent'});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'detachContent'});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'UploadExportOutput'});	
					//that.model.get('applicationChannel').publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObject':null}});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'subscribe'});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'Unsubscribe'});
					that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'EditSubscription'});					
				}
			});

			//UIMask.unmask(this.container);


			that.modelEvent.subscribe({'event':'add-model'}, function(){ //eventData

				//var newModel = that.processForDocumentData(eventData.data);
				//aaa._setData(newModel);
				//aaa._xsourcingCollectionViewUI._updateCount();
				that.loadData();

				UIMask.unmask(widget.body);
			}); 
			
			that.modelEvent.subscribe({'event':'update-model'}, function(packageUpdatedData){ //eventData

				that.model.get("parentOptions").data.respParams=packageUpdatedData.grid;
			});

           
			/*var dropdownValues = that.model.get("parentOptions").allowToPublish["Allow To Publish"];
			var allowToPublishRanges = [];
			if(dropdownValues)
				dropdownValues.forEach(field => {allowToPublishRanges.push({value:field,label:field});});
			var myCustomRep = {
					allowToPublishDropDown: {
					stdTemplate: 'enumCombo',
					semantics: {
						valueType: "enumString",
						possibleValues: allowToPublishRanges
					}
				}
			};
			
			that.tableView._xsourcingCollectionViewUI._dataGridView
			.getTypeRepresentationFactory().
			registerTypeRepresentations(JSON.stringify(myCustomRep));*/
			
			let dropOptions = {
				dropArea: that.tableView._xsourcingCollectionViewUI.viewContainer,
				applicationChannel: that.model.get("applicationChannel"),
				dropStrategy: "CREATE",
				multiObjs : true,
				onDropCallback: (droppedObj) => {
					UIMask.mask(that.container.parentElement,NLS.loading);
					let sources = [...new Set(droppedObj.map(ob => ob.serviceId))];
					let types = [...new Set(droppedObj.map(ob => ob.objectType))];
					let objIds = droppedObj.map(ob => ob.objectId);
					var searchPayload = that.searchUtil.getSearchPayload(objIds, types, sources);
					that.searchUtil.callFederatedSearch(searchPayload).then(function(searchResp){
						let processedData = that.searchUtil.processResults(searchResp);
						if(processedData.length !== searchPayload.resourceid_in.length){
						    widget.notificationUtil.showError(NLSInfra.not_found_not_indexed);
							if(that.container.parentElement){
                                   UIMask.unmask(that.container.parentElement);
                               }
						}
						else {
							that.model.get("processForObject")(processedData);
						}
					});	
				}
			};
			let dataDragAndDrop = new ENOXSourcingDataDragAndDrop();
			dataDragAndDrop.makeAreaDroppable(dropOptions);
			DomUtils.addResizeListener(this.outerDiv, function() { that.update(); }, 0);	
			return this.container;
		},
		//rendering done
		onDestroy : function() {

			return this._parent.apply(this, arguments);
		},
		isTouchDevice: function () {
			return ("ontouchstart" in document.documentElement);
		},

		setCellValueHandlerForAllowToPublish : function(options,cellInfos, value) {
			var that=this;
			var resultPromise,updateData;
			updateData = {
            				"data": [{
            					    "id":cellInfos.nodeModel.getAttributeValue('id'),
				                    "AllowToPublish":value ? "Yes" : "",
									"IPExportControlNameId": value ? cellInfos.nodeModel.options.grid.IPExportControlNameId: "",
									"IPProtectionNameId": value ? cellInfos.nodeModel.options.grid.IPProtectionNameId: ""
								}]
            		};
			
			options.addData = updateData;
			resultPromise = that.model.get("contextObject").updateAllowToPublish(options);
						
			that.publishContentResponseHandler(options,resultPromise,cellInfos,"allowToPublish",value);
		},

		getCellEditableState:function(optionsModel){
			        //var that = this;
					var state =optionsModel.get("parentOptions").data.respParams.state;
					if(state===undefined)
					state= optionsModel.get("parentOptions").data.params.state;
					if(state===NLS.Package_InDraft || state===NLS.Package_InWork){
                        return true;
					}
					return false;
		},
		
		publishContentResponseHandler : function(options,resultPromise,cellInfos,dataIndex,value) {
			//var that = this;
			resultPromise.then(function(){
				cellInfos.nodeModel.updateOptions({
					grid:{
						[dataIndex]:value ? "Yes" : ""
					}
				});
			if(options.openPackageEvent!==undefined){
					options.openPackageEvent.publish({event : "update-history-tab"});
				}
			},function(data){
				cellInfos.nodeModel.updateOptions({
					grid:{
						[dataIndex]:cellInfos.cellModel
					}
				});
				widget.notificationUtil.showError(data.internalError?data.internalError:(data.error?data.error:data));
			}).finally(function(){
				//UIMask.unmask(widget.body);
			});
	},

	processForContentData: function(options,items){
			var returnData = [];
			var that=this;
			var helper = that.model.get("helper");	
			let updatedOptions = {...options, items:items, helper:helper, returnData:returnData, that:that};
			return that.commonController.getClassificationNames(updatedOptions);
		},
	launchA3DSearch:function(searchType){
			var that = this;
			var searchOptions = {
				multiSel:true,
				typeSearch: searchType,
				callbackMethod:function(searchData) { 
					if(searchData){
					if(that.model.get("processForObject")){
							that.model.get("processForObject")(searchData);
						}
			        }
				}
			};
			var searchUtility = new ENOXComponentSourcingSearch();
			searchUtility.init(searchOptions);
		},
		loadData:function(){
			var that=this;
			let commonPackageModel = that.commonPackageModel;			
			if(that.container && that.container.parentElement)
				UIMask.mask(that.container.parentElement,NLS.loading);			
			    commonPackageModel.getContents(that.model.get("parentOptions")).then(function(respData){
				that.processForContentData(that.model.get("parentOptions"),respData.data).then(function(data){
					that.tableView._setData(data);
					that.tableView._xsourcingCollectionViewUI.collectionViewEvents.publish({event: 'xsourcing-collectionview-update-count'});
					that.tableView._xsourcingCollectionViewUI._allData = data;
				});

			}).finally(() => {
				if(that.container && that.container.parentElement){
					UIMask.unmask(that.container.parentElement);	
                    UIMask.unmask(that.container);
				}
			});				
		},
		getLatestRevisionOfContent: function(contentData){
				let that=this;
				let commonPackageModel = that.commonPackageModel;
				let tempOptions = that.model.get("parentOptions");
				(async () => {
					let detachOptions = {
						id: contentData.id,
						connectLatestRevision: true
					};
					let handleFailure = (response) => {
						widget.notificationUtil.showError(response);
					};
					UIMask.mask(that.container,NLS.loading_content);
					let detachContentResponse = await commonPackageModel.detachContent(tempOptions,detachOptions);
					let latestRevisionContent = detachContentResponse.data[0].latestRevisionContent;
					if(detachContentResponse.success && !!latestRevisionContent) {
						let successData = {
							data: latestRevisionContent
						};
						tempOptions.that.commonPackageHelper.handleAttachContentSuccess(successData);
						that.loadData();
					}
					else {
						handleFailure(detachContentResponse);
					}
					UIMask.unmask(that.container);
				})();
		},
		detachContent:function(contentData){
			this.model.get("detachContent")(contentData);
		},
		pupulateToolbarMenus:function(){
			var that=this;
			var toolbarMenus = [];
			toolbarMenus.push({ text: NLS.add_content, className: 'header' });
			toolbarMenus.push({
					id : "AddProductParts",
					text : NLS.add_Products_Parts,
					icon: WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/32/I_PADInsertExisting.png'),
					handler : function() {
						that.toolbarCommandsCallback(ENOXTDPConstants.VPMREFERENCE);
					}
				});
			toolbarMenus.push({
					id : "AddDocuments",
					text : NLS.add_existing_documents,
					icon: WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/32/I_CatalogAddPLMItemCBPRef.png'),
					handler : function() {
						that.toolbarCommandsCallback(ENOXTDPConstants.DOCUMENT);
					}
				});
			toolbarMenus.push({
					id : "AddDrawing",
					text :NLS.add_existing_drawing,
					icon: WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/22/I_VPMNavDrawing.png'),
					handler : function() {
						that.toolbarCommandsCallback(ENOXTDPConstants.DRAWING);
					}
				});
			toolbarMenus.push({
					id : "AddReqSpecification",
					text : NLS.add_existing_requirement_specification,
					icon: WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/22/requirement-specification-insert.png'),
					handler : function() {
						that.toolbarCommandsCallback(ENOXTDPConstants.REQUIREMENT_SPECIFICATION);
					}
				});	
			return toolbarMenus;
		},
		
		pupulateSubscriptionToolbarMenus:function(){
			var that=this;
			var toolbarSubscriptionMenus = [];
			toolbarSubscriptionMenus.push({
				id : "subscribe",
				text : NLS.Subscribe,
				fonticon: "bell-add",
				disabled : true,
				handler:function() {
					that.processSubscriptions(ENOXTDPConstants.SUBSCRIBE);
				}
			});

			toolbarSubscriptionMenus.push({
				id : "Unsubscribe",
				text : NLS.Unsubscribe,
				fonticon: "bell-delete",
				disabled : true,
				handler:function() {
					that.processSubscriptions(ENOXTDPConstants.UNSUBSCRIBE);
				}					
			});
			
			toolbarSubscriptionMenus.push({
				id : "EditSubscription",
				text : NLS.Edit_Subscriptions,
				fonticon: "bell-pencil",
				disabled : true,
				handler:function() {
					that.processSubscriptions(ENOXTDPConstants.EDIT_SUBSCRIPTION);
				}					
			});

			toolbarSubscriptionMenus.push({
				id : "MySubscription",
				text : NLS.My_Subscriptions,
				fonticon: "bell",
				handler:function() {
					var mySubscriptionsCmd = new MySubscriptions({
					'ID': 'MySubscriptionsCmdHdr'
					});
					mySubscriptionsCmd.execute(that.options);
				}				
			});			
			return toolbarSubscriptionMenus;
		},	
		
		processSubscriptions:function(actionName) {
			var that=this;
			var targetNodes = that.tableView._gridModel.getSelectedNodes().map(function (nodeModel) {
			let sType = nodeModel.options.grid.actualType;
			
				return {   			
					physicalid: nodeModel.options.grid.actualId, 
					type: sType,
					getID : function () {
						return nodeModel.options.grid.actualId;
					},
					getType: function(){
						return sType;
					}
				};
			});
		
			var context = {
				getSelectedNodes: () => targetNodes                     
			};
			
			var subscriptionCmd;
			if(actionName ===ENOXTDPConstants.SUBSCRIBE) {
				subscriptionCmd = new Subscribe({
				'ID': 'SubscribeCmdHdr',
				'context': context
				});
			} else if(actionName ===ENOXTDPConstants.UNSUBSCRIBE) {
				subscriptionCmd = new UnSubscribe({
				'ID': 'UnSubscribeCmdHdr',
				'context': context
				});
			} else if(actionName ===ENOXTDPConstants.EDIT_SUBSCRIPTION) {
				subscriptionCmd = new EditSubscribe({
				'ID': 'EditSubscriptionCmdHdr',
				'context': context
				});
			}
			subscriptionCmd.execute(that.options);
		},
				
		toolbarCommandsCallback:function(typeToSearch){ //e,i
			var that = this;
			that.launchA3DSearch(typeToSearch);
			
		},
		getContentInfoData: function(nodeModel){
			var modDate = new DatePicker({timePickerFlag: true,type: 'datetime',value:new Date(nodeModel.options.grid.modified)});
			var credate = new DatePicker({timePickerFlag: true,type: 'datetime',value:new Date(nodeModel.options.grid.created)});
			var fields = [{
				disable: true,
				label: NLS.type,
				placeholder: NLS.type,
				type: "labelValue",
				value: nodeModel.options.grid.type
			},{
				disable: true,
				label: NLS.name,
				placeholder: NLS.name,
				type: "labelValue",
				value: nodeModel.options.grid.name
			},{
				disable: true,
				label: NLS.description,
				placeholder: NLS.description,
				type: "labelValue",
				value: nodeModel.options.grid.description
			},{
				disable: true,
				label: NLS.revision,
				placeholder: NLS.revision,
				type: "labelValue",
				value: nodeModel.options.grid.revision
			},{
				disable: true,
				label: NLS.title,
				placeholder: NLS.title,
				type: "labelValue",
				value: nodeModel.options.grid.title
			},{
				disable: true,
				label: NLS.owner,
				placeholder: NLS.owner,
				type: "labelValue",
				value: nodeModel.options.grid.owner
			},{
				disable: true,
				label: NLS.created,
				placeholder: NLS.created,
				type: "labelValue",
				value: credate.elements.inputField.value
			},{
				disable: true,
				label: NLS.modified,
				placeholder: NLS.modified,
				type: "labelValue",
				value: modDate.elements.inputField.value
			}];
			var objectData = {
					attributes: [
						{name: NLS.name, value: nodeModel.options.grid.title},
						{name: NLS.created, value: credate.elements.inputField.value},
						{name: NLS.owner, value: nodeModel.options.grid.owner}
						],
						image: nodeModel.options.grid.image,
						name: nodeModel.options.grid.title
//						thumbnail: require.toUrl(nodeModel.options.grid.image)
			};
			return {
				fields: fields,
				objectData: objectData
			};
		}
	});
		
	return PackageContentView;
});

