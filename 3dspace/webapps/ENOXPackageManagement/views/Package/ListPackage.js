//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageManagement/views/Package/ListPackage',
		[
			'DS/UIKIT/Mask',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'DS/ENOXPackageManagement/helpers/PackageHelper',
	        'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
			'DS/ENOXPackageCommonUXInfra/EmptyContent/ENOXPackageEmptyContent',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/TypeAHead/ENOXTypeaheadWithSearch',
			'DS/Menu/Menu',
			'DS/ENOXPackageManagement/helpers/CommonHelper',
			'DS/ENOXPackageManagement/controllers/CommonController'
		],function(UIMask,NLS,XSourcingCollectionViewObj, PackageHelper, NLSInfra, ENOXTDPConstants, ENOXSourcingDataDragAndDrop,ENOXSourcingEmptyContent,ENOXSourcingConstants,
		ENOXTypeaheadWithSearch,WUXMenu,CommonHelper,CommonController){

	'use strict';

	var ListPackage = function(controller){
		this.helper = new PackageHelper();
		this.commonHelper = new CommonHelper();
		this.commonController = new CommonController();
		this.controller = controller;
	};
	
	ListPackage.prototype.render=function(options){
		var that=this;
		widget.setValue("LastSelectedTabInfoPanel", undefined);
		widget.setValue("selectedNodeIds", undefined);
		var infoIcon = widget.getElement('.information-panel.panel-icon-wrapper');
		if(infoIcon)infoIcon.style.removeProperty('display');
		that.options= options;
		let xsourcingCollectionView = new XSourcingCollectionViewObj();
		that.collectionView=options.xsourcingCollectionView=xsourcingCollectionView;
		let additionalOptions = that.commonHelper.initCollectionsAndDropOptions(that);
		options = {...options, additionalOptions:additionalOptions};
		options.hideTitle=true;
		options.uniqueIdentifier='NewPackage';
		options.itemsName = NLS.packages;
		options.views=["Tile","Grid"];
		options.enableDrag = true;
		options.columnsConfigurations = [{
					"text": NLS.title,
					"dataIndex": "tree",
					"resizableFlag": true,
					"sortableFlag": true,
					"pinned": "left",
					"typeRepresentation": "url",
					"hyperlinkTarget": "_self",
					hyperlinkClickCallback: function(params){
						options.router.navigate("home.PackageDetails",params.nodeModel.options.grid);
					},
					getCellValue: function(cellInfos){
						return {
							label:cellInfos.nodeModel.options.grid.grouped ? cellInfos.nodeModel.options.grid.tree : cellInfos.nodeModel.options.grid.title,
							url: '#UNEXISTANT_ID',
							hyperlinkClickCallback: cellInfos.nodeModel.options.grid.grouped ? undefined : this.layout.getColumnOptionValue(cellInfos.columnID, 'hyperlinkClickCallback')
						};
					}
					
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
			"text": NLS.maturity_state,
			"dataIndex": "stateDisplay"
		},
		{
			"text": NLS.Package_Level,
			"dataIndex": "Package_Level"
		},
		{
			"text": NLS.target_format_recommendations_title,
			"dataIndex": "ExportFormats"
		},
		{
			"text": NLS.Require_matured_content,
			"dataIndex": "MaturedContent"
		},
		{
			"text": NLS.owner,
			"dataIndex": "owner"
		},
		{
			"text": NLS.modified_date,
			"dataIndex": "modified",
			"typeRepresentation": "datetime"
		},
		{
			"text": NLS.creation_date,
			"dataIndex": "created",
			"typeRepresentation": "datetime",
			visibleFlag:false
		}];			
		options.showToolbar = true;
		options.toolbarActions= [];

		options.toolbarActions.push({
			id : "createNewPackage",
			text : NLS.new_package,
			fonticon : "plus",
			handler : function() {
				that.controller.createView(options);
			}
		});
		options.toolbarActions.push({
			id: "revisePackage",
			text: NLS.revise,
			fonticon: "flow-line-add",
			disabled: true,
			handler: function() {
				that.controller.revisePackageItem(that, options); 
			}
		});
		options.toolbarActions.push(
				{
					id : "delete",
					text : NLS["delete"],
					fonticon : "trash",
					disabled : true,
					handler : function() {
						that.deletePackage(that, options);
						
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
		that.overrideToolbarSearchAction(options);
        options.showToolbarInfoIcon = true;
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
				let maturityState = data1.state;
				if(model && !data1.grouped){
					menu.push({
						id: 'OpenItem',
						type: 'PushItem',
						title: NLS["open"],
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-open'
						},
						action : {
							callback: function(){
								that.options.router.navigate("home.PackageDetails",data1);
							}
						}
					},
					{
						type: 'PushItem',
						title: NLS.revise,
						state: (maturityState === ENOXTDPConstants.state_released || 
						    maturityState === ENOXTDPConstants.state_obsolete)?'enabled':'disabled',
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-flow-line-add'
						},
						action: {
							callback: function() {
								options.contextualNode=[node];
								that.controller.revisePackageItem(that, options);
							}
						}
					},
					{
						type: 'PushItem',
						title: NLS["delete"],
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-trash'
						},
						action: {
							callback: function() {
								options.contextualNode=[node];
								that.deletePackage(that, options);
								
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

					}
					);
				}

			}
			return menu;
		};
		options.rowUnSelectCallback = function(){
			widget.setValue("LastSelectedTabInfoPanel", undefined);
			widget.setValue("selectedNodeIds", undefined);
		};
		
		ListPackage.prototype.deletePackage = function(thatRef, opts){
			thatRef.commonController.deleteObject(thatRef, opts, NLS.packages);
		};
		
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
		options.collectionView = xsourcingCollectionView;
		that.commonHelper.updateInfoPanel(that);

		xsourcingCollectionView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-cell-dblclick'},function(data){
			that.options.router.navigate("home.PackageDetails",data);
		});
		xsourcingCollectionView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-selection-updated'},function(data){
			widget.setValue("LastSelectedTabInfoPanel", undefined);
			if(data.selectedItems.length>0){
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'delete'});
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
					let getPackageDetails = that.controller.model.getPackage;
					that.commonController.updateInfoPanelDetails(that, getPackageDetails);
					if(nodeSelected.options.grid.state === ENOXTDPConstants.state_released || nodeSelected.options.grid.state === ENOXTDPConstants.state_obsolete){
	                        xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'revisePackage'});
					}
				}
				else {
					options.applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',data:{selectedObject:'multipleSelected'}});
					xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'revisePackage'});
				}
			}else{
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'delete'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'revisePackage'});			
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'sourcinginfoicon'});
				xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'subscriptions'});
																																		 
				options.applicationChannel.publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObject':null}});
			}
		});
		let dropOptions = {
			...options.commonDropOptions,
			dropArea: that.xsourcingCollectionView._xsourcingCollectionViewUI.viewContainer
		};
		let packageDragAndDrop = new ENOXSourcingDataDragAndDrop();
		packageDragAndDrop.makeAreaDroppable(dropOptions);		
		//widget.app._initDroppable(widget.app,xsourcingCollectionView._xsourcingCollectionViewUI.viewContainer);
	};

	ListPackage.prototype.overrideToolbarSearchAction = function(collectionViewOptions){
		let that = this;
		let PackageContentTypes = [ENOXTDPConstants.VPMREFERENCE,ENOXTDPConstants.DOCUMENT];//VPMREFERENCE is added for engineering item,MEI;DOCUMENT is added for document
		
		let fieldOptsInput = {
				name: "contentId",//
				placeholder: NLS.Search_by_Package_Content,
				typeSearch: PackageContentTypes
			};
		//Add type ahead field with package content criteria
		let packageContentField = that.getAutocompletefieldForSearchBar(fieldOptsInput);
		let packageContentAutocomplete = packageContentField[0];
		let packageContentAutocompleteController = packageContentField[1];
		
		collectionViewOptions.toolbarSearchActionOverride = function toolbarSearchAction(originalFunction){
			//this --> CollectionToolbar Object
			//originalFunction --> The original method of OOTB file which is fired on click of search button

			let collectionToolbar = this;
			
			packageContentAutocomplete.style.display = 'none';
			collectionToolbar._actionsIconBar.getItem("enox-search").tooltip.getBody().innerText = NLS.Search;
			if(packageContentAutocompleteController.autocompleteField.selectedItems){
				packageContentAutocompleteController.autocompleteField.selectedItems= undefined; //To unset previously selected values
				return;
			}

			//Default case: calling original method(everytime when search toolbar menu is clicked,OOTB search will be rendered
			originalFunction.call(collectionToolbar);
			collectionToolbar._searchComponent.searchTextBox.elements.input.placeholder = NLS.Search;

			//to draw the menu options when it is inactive to active case
			let searchContainer = collectionToolbar._searchComponent._container;
			let pos = collectionToolbar._searchComponent._autocomplteWrapper.getBoundingClientRect();

			if(searchContainer.style.display !== 'none'){
				let menu = [{
					id:"ootbSearch",
					type: "CheckItem",
					title: NLS.Search,
					state: "selected",
					action : {
						callback: function(){
							collectionToolbar._actionsIconBar.getItem("enox-search").tooltip.getBody().innerText = NLS.Search;
							that.controller.helper.visibilityToggler(searchContainer, packageContentAutocomplete);
						}
					}
				},{
					id:"packageContentBasedSearch",
					'type': 'PushItem',
					'title': NLS.Search_by_Package_Content ,
					action : {
						callback: function(){
							collectionToolbar._actionsIconBar.getItem("enox-search").tooltip.getBody().innerText = NLS.Search_by_Package_Content;
							packageContentAutocomplete.inject(collectionToolbar._filterContainer);
							that.controller.helper.resizeAutocomplete(packageContentAutocomplete,packageContentAutocompleteController, collectionToolbar);
							that.controller.helper.visibilityToggler(packageContentAutocomplete, searchContainer);
							collectionToolbar._actionsIconBar.resize();
						}
					}
				}];
				WUXMenu.show(menu, {
					position : {
						x : pos.right,
						y : pos.bottom
					}
				});
			}
		};
	};
	
	ListPackage.prototype.getAutocompletefieldForSearchBar = function(options){
		let that = this;
		//Prepare auto-complete field in hidden mode
		let autocompleteOptions = {
			name: options.name,
			placeholder: options.placeholder,
			typeSearch: options.typeSearch,
			sources: [ENOXSourcingConstants.SOURCE_3DSPACE],
			searchButtonNotRequired: true
		};
		let enoxTypeaheadWithSearch = new ENOXTypeaheadWithSearch();
    	let wrappedField = enoxTypeaheadWithSearch.createField(autocompleteOptions);
    	enoxTypeaheadWithSearch.autocompleteField.addEventListener('change', function() {
    		let opts = {...that.options};
    		if(enoxTypeaheadWithSearch.getSelectedObjectAttrValue("resourceid")){
				opts.packageContentFilter = true;
    			opts[enoxTypeaheadWithSearch.getInputField().name] = enoxTypeaheadWithSearch.getSelectedObjectAttrValue("resourceid");
    		}
			that.controller.allPkgData = [];
    		that.collectionView._gridModel.removeRoots();
    		that.controller.list(opts);
         });
    	return [wrappedField, enoxTypeaheadWithSearch];
	};
	
	ListPackage.prototype.setEmptyView = function(options) {
		let that=this;
		let emptyContainer = options.externalContainer?options.externalContainer:options._triptychWrapper.getMainPanelContainer();
		emptyContainer.empty();
		let emptyContentOptions = {
			...options.commonDropOptions,
			dropArea: emptyContainer,
			emptyContentArea: emptyContainer,
			dropIconLabel: NLSInfra.DropInvit_drop,
			emptyDataButtonIcon: "plus",
			emptyDataButtonLabel: NLS.new_package,
			emptyDataButtonCallback: () => {
				that.controller.createView(options);
			}
		};
		var emptyContent = new ENOXSourcingEmptyContent();
		emptyContent.init(emptyContentOptions);
	};

	return ListPackage;
});
