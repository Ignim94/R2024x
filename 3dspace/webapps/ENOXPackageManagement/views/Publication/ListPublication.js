//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageManagement/views/Publication/ListPublication',
		[
			'DS/UIKIT/Mask',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'DS/ENOXPackageCommonUXInfra/Search/ENOXPackageSearch',
			'DS/ENOXPackageManagement/helpers/PublicationHelper',
			'DS/ENOXPackageManagement/views/Publication/CreatePublication',
	        'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
			'DS/ENOXPackageCommonUXInfra/EmptyContent/ENOXPackageEmptyContent',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/ENOXPackageManagement/helpers/CommonHelper',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageManagement/controllers/CommonController'
			],function(UIMask,NLS,XSourcingCollectionViewObj, 
			ENOXComponentSourcingSearch,PublicationHelper,
			CreatePublication, NLSInfra,ENOXSourcingDataDragAndDrop,ENOXSourcingEmptyContent,ENOXTDPConstants,CommonHelper,ENOXPackageCommonConstants,ENOXTDPPlatformServices,CommonController){

	'use strict';

	var ListPublication = function(controller){
		this.helper = new PublicationHelper();
		this.commonHelper = new CommonHelper();
		this.commonController = new CommonController();
		this.controller = controller;
	};															   

	ListPublication.prototype.render=function(options){
		var that=this;
		that.options= options;
		options.applicationChannel.publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObjectId':null}});
		let xsourcingCollectionView = new XSourcingCollectionViewObj();
		that.collectionView=options.xsourcingCollectionView=xsourcingCollectionView;
		let additionalOptions = that.commonHelper.initCollectionsAndDropOptions(that);
		options = {...options, additionalOptions:additionalOptions};		
		options.hideTitle=true;
		options.uniqueIdentifier='NewPublication';
		options.itemsName = NLS.publications;
		options.views=["Tile","Grid"];
		options.enableDrag = true;
		options.columnsConfigurations = [];
			options.columnsConfigurations.push({
					"text": NLS.title,
					"dataIndex": "tree",
					"resizableFlag": true,
					"sortableFlag": true,
					"pinned": "left",
					"typeRepresentation": "url",
					"hyperlinkTarget": "_self",
					hyperlinkClickCallback: function(params){
						options.router.navigate("home.PublicationDetails",params.nodeModel.options.grid);
					},
					getCellValue: function(cellInfos){
						return {
							label: cellInfos.nodeModel.options.grid.title,
							url: '#UNEXISTANT_ID',
							hyperlinkClickCallback: cellInfos.nodeModel.options.grid.grouped ? undefined : this.layout.getColumnOptionValue(cellInfos.columnID, 'hyperlinkClickCallback')
						};
					}
					
			});
			options.columnsConfigurations.push({
				"text": NLS.name,
				"dataIndex": "name",
				 width:100
			});
			options.columnsConfigurations.push({
				"text": NLS.contains_sensitive_data,
				"dataIndex": "hasIPData",
				"typeRepresentation":"boolean",
				"editableFlag":false,
				 width: 150
			});
			options.columnsConfigurations.push({
				"text": NLS.contained_format_recommendations_title,
				"dataIndex": "ExportFormats",
				 minWidth: 120

			});
			options.columnsConfigurations.push({
				"text": NLS.maturity_state,
				"dataIndex": "stateDisplay",
				 width: 100
			});
			options.columnsConfigurations.push({
				"text": NLS.creation_date,
				"dataIndex": "created",
				"typeRepresentation": "datetime",
				 width: 125
			});
			options.columnsConfigurations.push({
				"text": NLS.Package_Level,
				"dataIndex": "Package_Level"
			});
			options.columnsConfigurations.push({
				"text": NLS.owner,
				"dataIndex": "owner"

			});
			options.columnsConfigurations.push({
				"text": NLS.datapackage+" "+NLS.title,
				"dataIndex": "TDP_Package"
			});
			options.columnsConfigurations.push({
				"text": NLS.datapackage+" "+NLS.name,
				"dataIndex": "packageName",
				width:100
			});
		if(ENOXPackageCommonConstants.ONPREMISE === ENOXTDPPlatformServices.getPlatformId()){
			options.columnsConfigurations.push({
				"text":NLS.is_password_protected,
				"dataIndex": "isPasswordProtected"
			});
	  }
		options.showToolbar = true;
		options.toolbarActions= [];
		options.toolbarActions.push(
				{
					id : "plus",
					text :NLS.new_publication,
					fonticon : "plus",
					handler : function() {
						that.createPublicationAction();
					}
					
				});
		options.toolbarActions.push(
				{
					id : "delete",
					text : NLS["delete"],
					fonticon : "trash",
					disabled : true,
					handler : function() {
						that.deletePublication(that, options);
					}
				});
		options.toolbarActions.push(
				{
					id : "downloadDocument",
					text : NLS.downLoad,
					fonticon : "download",
					disabled : true,
					handler : function() {
						that.downloadPublicationZip(that,options);
					}
				});	
				options.toolbarActions.push({
				id : "subscriptions",
				fonticon: "bell-list",
				text: NLS.Subscriptions,
				disabled : true,
				content: that.commonHelper.populateSubscriptionToolbarMenus("",options)
				
			});				   
				
		options.toolbarInfoIcon = that.commonHelper.getInfoIcon(options);
            	options.showToolbarInfoIcon = true;
	
		ListPublication.prototype.downloadPublicationZip = function(thatRef, opts){
			opts.selectedNodes = thatRef.xsourcingCollectionView._gridModel.getSelectedNodes();
						if(opts.selectedNodes.length === 1){
							var downloadOptions = {
								id:opts.selectedNodes[0].options.grid.id,
								helper:that.controller.commonhelper,
								applicationChannel:opts.applicationChannel
								};
							that.controller.model.downloadZipFile(downloadOptions);
						}else{
							widget.notificationUtil.showError(NLS.FILE_DOWNLOAD_ONE_SELECT);
						}	
		};	


		options.onContextualEventCallback = function onContextualEvent(params){
			var cellInfo = cellInfo;
			var menu = [];
			if(params){
				var node = ( params.cellInfos && params.cellInfos.nodeModel) ? params.cellInfos.nodeModel : null;
				var rowID = ( params.cellInfos)  ? params.cellInfos.rowID : null;
				if(rowID ===-1 || !node){
					return this._contextualMenuBuilder ? this._contextualMenuBuilder.buildMenu(params, options) : [];
				}
				var model = params.cellInfos.nodeModel?params.cellInfos.nodeModel: params.cellInfos.cellModel;
				
				var data1 = model.options.grid;
				if(model){
					menu.push({
						id: 'OpenItem',
						type: 'PushItem',
						title: NLS["open"],
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-open'
						},
						action : {
							callback: function(){
								that.options.router.navigate("home.PublicationDetails",data1);
							}
						}
					},{
						type: 'PushItem',
						title: NLS["downLoad"],
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-download'
						},
						action: {
							callback: function() {
								options.contextualNode=[node];
								that.downloadPublicationZip(that,options);
							}
						}
					},{
						type: 'PushItem',
						title: NLS["delete"],
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-trash'
						},
						action: {
							callback: function() {
								options.contextualNode=[node];
								that.deletePublication(that, options);
							}
						}
					},
					{
						type: 'PushItem',
						fonticon: {
							content: 'wux-ui-3ds-bell-list wux-ui-3ds'
						},
						title: NLS.Subscriptions,
						submenu :that.commonHelper.populateSubscriptionToolbarMenus("contextualMenu",options)

					});
				}

			}
			return menu;
		};
		options.rowUnSelectCallback = function(){
			widget.setValue("LastSelectedTabInfoPanel", undefined);
			widget.setValue("selectedNodeIds", undefined);
		};
		ListPublication.prototype.deletePublication = function(thatRef, opts){
			thatRef.commonController.deleteObject(thatRef, opts, NLS.publications);
		};
		
		//var xsourcingCollectionView = new XSourcingCollectionViewObj();
		options.container = options.externalContainer?options.externalContainer:options._triptychWrapper.getMainPanelContainer();
		options.sort=[{
			id: "title",
			text: NLS.title,
			type: "string"
		}];
		options.applicationChannelEvents=[];
		options.applicationChannelEvents.push({
			eventName:"add-model"
		});

		xsourcingCollectionView.init(options);
		that.xsourcingCollectionView=xsourcingCollectionView;
		that.commonHelper.updateInfoPanel(that);

		xsourcingCollectionView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-cell-dblclick'},function(data){
			that.options.router.navigate("home.PublicationDetails",data);
		});
		xsourcingCollectionView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-selection-updated'},function(data){
			widget.setValue("LastSelectedTabInfoPanel", undefined);
			widget.setValue("selectedNodeIds", undefined);
			if(data.selectedItems.length>0){
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'delete'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'downloadDocument'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'sourcinginfoicon'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'subscriptions'});
				let selectedObjectIds = that.xsourcingCollectionView._xsourcingCollectionViewUI._gridModel.getSelectedNodes().map((selectedNode) => {
					return selectedNode._options.grid['id'];
				});
				widget.setValue("selectedNodeIds", selectedObjectIds);

				var nodeSelected = (event && event.dsModel && event.dsModel.activeNode)?event.dsModel.activeNode:{options:data.selectedItems[data.selectedItems.length-1]};
                that.nodeData = nodeSelected;
				var rightPanel = widget.getElement(".xTDP-triptych-wrapper-right");
				if(rightPanel)
					UIMask.mask(rightPanel);
				if(data.selectedItems.length===1) {
					let getPublicationDetails = that.controller.commonModel.getPublication;
					that.commonController.updateInfoPanelDetails(that, getPublicationDetails);
				}
				else {
					options.applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',data:{selectedObject:'multipleSelected'}});
				}
			}else{
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'delete'});	
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'downloadDocument'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'sourcinginfoicon'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'subscriptions'});																			   
				options.applicationChannel.publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObject':null}});
			}
		});
		let dropOptions = {
			...options.commonDropOptions,
			dropArea: that.xsourcingCollectionView._xsourcingCollectionViewUI.viewContainer
		};
		let publicationDragAndDrop = new ENOXSourcingDataDragAndDrop();
		publicationDragAndDrop.makeAreaDroppable(dropOptions);
		//widget.app._initDroppable(widget.app,xsourcingCollectionView._xsourcingCollectionViewUI.viewContainer);	

	};


	ListPublication.prototype.processDataandCreate = function(objectData){
				let that=this;
				let state=objectData[0]["ds6w:status_value"]?objectData[0]["ds6w:status_value"]:"";
		        let index= state.indexOf('.');
				let createPub = new CreatePublication(that.controller);
				let packageOptions = {
					...that.options,
					controller: that.controller,
					mediator: that.options._mediator,
					label: (objectData[0]["ds6w:label"])?objectData[0]["ds6w:label"]:"",
					grid: {
						description:(objectData[0]["ds6w:description"])?objectData[0]["ds6w:description"]:""
					},
					data: {
						params: {
							id: objectData[0].id?objectData[0].id:objectData[0].physicalid
						}
					},
					state: state.substring(index+1),
					createPub:createPub,
					route: "home.MyPublications",
					getFiles: "files",
					getClasses: "classes"
				};
				createPub.verifyAndCreatePublication(packageOptions);
              
	};
	
	ListPublication.prototype.setEmptyView = function(options) {
		var that=this;
		let emptyContainer = options.externalContainer?options.externalContainer:options._triptychWrapper.getMainPanelContainer();
			emptyContainer.empty();
			let emptyContentOptions = {
				...options.commonDropOptions,
				dropArea: emptyContainer,
				emptyContentArea: emptyContainer,
				dropIconLabel: NLSInfra.DropInvit_drop,
				emptyDataButtonIcon: "plus",
				emptyDataButtonLabel: NLS.new_publication,
				emptyDataButtonCallback: () => {
					that.createPublicationAction();
				}
			};
			var emptyContent = new ENOXSourcingEmptyContent();
			emptyContent.init(emptyContentOptions);
		
	};
	
	ListPublication.prototype.createPublicationAction = function(){
		var thatRef = this;
		//var publicationController=new PublicationController()
		var searchOptions = {
			typeSearch: ENOXTDPConstants.Type_Package,
			excludeCondition: "(current:Released)",
			multiSel:false,
			callbackMethod:function(searchData){ 
				if(searchData){
					thatRef.processDataandCreate(searchData);
				}
			}
		};
		var searchUtility = new ENOXComponentSourcingSearch();
		searchUtility.init(searchOptions);
	};

	return ListPublication;
});
