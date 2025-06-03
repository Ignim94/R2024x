/* global widget */
define('DS/ENOXPackageManagement/views/Package/AttachmentsTabToolbar',
		[
			'DS/ENOXCollectionToolBar/js/ENOXCollectionToolBarV2',
			'DS/ENOXPackageCommonUXInfra/Mediator',
			'DS/UIKIT/SuperModal',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/Menu/Menu'
			],
			function(ENOXCollectionToolBar,Mediator,SuperModal,NLS,ENOXTDPConstants,Menu){
	'use strict';
	
	var AttachmentsTabToolbar = function(controller){
		this.controller=controller;
	};
	AttachmentsTabToolbar.prototype.render = function(options){
		var that = this;
		this.options=options;

		if(options.container.empty)
			options.container.empty();

		this._toolbarChannel = new Mediator().createNewChannel();
		this.toolbarOptions = {};
		this.toolbarOptions.actions = this.toolbarActions(options);
		this.toolbarOptions.modelEvents = that._toolbarChannel;
		this.toolbarOptions.showItemCount = options.showItemCount;
		if(!options.hideTitle){
			this.toolbarOptions.itemName=options.itemsName;
			this.toolbarOptions.itemsName=options.itemsName;
		}

		if(options.sort)
			this.toolbarOptions.sort= options.sort;

		this.toolbarOptions.views = [{
			id: "Tile View",
			text : NLS.Tile_View,
			fonticon : "view-small-tile"
		}];

		this.toolbarOptions.filter = {
			enableCache : true
		};

		this.collectionToolbar = new ENOXCollectionToolBar(this.toolbarOptions);
		this.collectionToolbar.inject(options.container);
		
		that.eventHandler();
		
	};
	
	AttachmentsTabToolbar.prototype.eventHandler = function(){
		var that = this;
		that.controller.worksheetTableView && 
		that.controller.worksheetTableView.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-disable-toolbar-button'},function(buttonID){
			that.toolbarOptions.modelEvents.publish({
				event : 'enox-collection-toolbar-disable-action',
				data : buttonID
			});
		});
		that.controller.worksheetTableView && 
		that.controller.worksheetTableView.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-enable-toolbar-button'},function(buttonID){
			that.toolbarOptions.modelEvents.publish({
				event : 'enox-collection-toolbar-enable-action',
				data : buttonID
			});
		});
		
		that.toolbarOptions.modelEvents.subscribe({event: 'enox-collection-toolbar-click-filter-search'}, function (data) {
			if(document.getElementsByClassName('triptych-right-content')[0].offsetWidth > 0){
				let contentDiv = document.getElementById('attachments');
				let filterWrapper = contentDiv.getElement('.enox-basic-filter-autocomplete-wrapper')?
						contentDiv.getElement('.enox-basic-filter-autocomplete-wrapper'):contentDiv.getElement('.info-content-filter');
				filterWrapper.addClassName('info-content-filter');
				filterWrapper.removeClassName('enox-basic-filter-autocomplete-wrapper');
				
				let mobileFilter = contentDiv.getElement('.mobile_filter_container')?
						contentDiv.getElement('.mobile_filter_container'):contentDiv.getElement('.mobile_filter_container_info');
				
				if(data.elements.container.classList.length === 1){
					mobileFilter.addClassName('mobile_filter_container_info');
					mobileFilter.removeClassName('mobile_filter_container');
				}else{
					mobileFilter.addClassName('mobile_filter_container');
					mobileFilter.removeClassName('mobile_filter_container_info');
				}
			}else{
				let contentDiv = document.getElementById('Content');
				let filterWrapper = contentDiv.getElement('.enox-basic-filter-autocomplete-wrapper')?
						contentDiv.getElement('.enox-basic-filter-autocomplete-wrapper'):contentDiv.getElement('.info-content-filter');
				filterWrapper.addClassName('enox-basic-filter-autocomplete-wrapper');
				filterWrapper.removeClassName('info-content-filter');
				
				let mobileFilter = contentDiv.getElement('.mobile_filter_container')?
						contentDiv.getElement('.mobile_filter_container'):contentDiv.getElement('.mobile_filter_container_info');
				mobileFilter.addClassName('mobile_filter_container');
				mobileFilter.removeClassName('mobile_filter_container_info');
			}
		});

		that.toolbarOptions.modelEvents.subscribe({event: 'enox-collection-toolbar-filter-search-value'}, function (data) {
			that.controller.worksheetTableView &&
			that.controller.worksheetTableView.collectionViewEvents.publish({event : 'filter-on-search', data: data.searchValue[0]});
		});
		

			that.controller.connectedTableView &&
			that.controller.connectedTableView.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-disable-toolbar-button'},function(buttonID){
				that.toolbarOptions.modelEvents.publish({
					event : 'enox-collection-toolbar-disable-action',
					data : buttonID
				});
			});
			
			that.controller.connectedTableView &&
			that.controller.connectedTableView.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-enable-toolbar-button'},function(buttonID){
				that.toolbarOptions.modelEvents.publish({
					event : 'enox-collection-toolbar-enable-action',
					data : buttonID
				});
			});
			
			that.toolbarOptions.modelEvents.subscribe({event: 'enox-collection-toolbar-filter-search-value'}, function (data) {
				that.controller.connectedTableView &&
				that.controller.connectedTableView.collectionViewEvents.publish({event : 'filter-on-search', data: data.searchValue[0]});
			});
//		});
		
		that._toolbarChannel.subscribe({event:'enox-collection-toolbar-sort-activated'}, function(data){
			
			var sortOptions = {
					sortAttribute : data.sortAttribute,
        			sortOrder : data.sortOrder
        	};
	      
			var reverseFactor = (sortOptions.sortOrder).toLowerCase() === 'asc' ? 1 : -1;
			that.controller.worksheetTableView &&
			that.controller.worksheetTableView._xsourcingCollectionViewUI._gridModel.getRoots().length > 1 &&
			that.controller.worksheetTableView._xsourcingCollectionViewUI._tilecollectionView.TreedocModel._trueRoot.sortChildren({
	                          isRecursive: true,
	                          sortFunction: function(treeNodeModelA, treeNodeModelB) {
	                        	  try{
	                        	  return  reverseFactor*(treeNodeModelA._options.grid[sortOptions.sortAttribute].localeCompare(treeNodeModelB._options.grid[sortOptions.sortAttribute]));
	                        	  }catch(err){
	                        		  //console.log("sort failed");
	                        	  }
	                             }
	                      });
			that.controller.connectedTableView &&
			that.controller.connectedTableView._xsourcingCollectionViewUI._gridModel.getRoots().length > 1 &&
			that.controller.connectedTableView._xsourcingCollectionViewUI._tilecollectionView.TreedocModel._trueRoot.sortChildren({
                isRecursive: true,
                sortFunction: function(treeNodeModelA, treeNodeModelB) {
              	  try{
              	  return  reverseFactor*(treeNodeModelA._options.grid[sortOptions.sortAttribute].localeCompare(treeNodeModelB._options.grid[sortOptions.sortAttribute]));
              	  }catch(err){
              		  //console.log("sort failed");
              	  }
                   }
            });
		});
	};
	
	AttachmentsTabToolbar.prototype.toolbarActions = function(toolbarOptions){
		var that = this;
		var toolbarActions = [];
		if(toolbarOptions.modifyAccess && (toolbarOptions.state && (toolbarOptions.state===ENOXTDPConstants.state_inWork || toolbarOptions.state===ENOXTDPConstants.state_inDraft))){
			toolbarActions.push(
			{
				id : "addExistingDoc",
				text : NLS.add_attachments,
				fonticon : "plus",
				handler : function(e) {
					let rect = e.target.getBoundingClientRect();
					let menuItems =  [...that.controller.getWorksheetMenuItems(), ...that.controller.getDisclaimerMenuItems()];
					Menu.show(menuItems, {
						position : {
							x : rect.right,
							y : rect.bottom
						},
						submenu : 'outside'
					});
				}
			},
			{
				id : "downloadDocument",
				text : NLS.download,
				fonticon : "download",
				disabled : true,
				handler : function() {
					let worksheetTable = that.controller.worksheetTableView;
					let disclaimerTable = that.controller.connectedTableView;
					let selectedWorksheets = [];
					let selectedDisclaimers = [];
					if (worksheetTable && that.controller.worksheetData.length>0)
						selectedWorksheets = worksheetTable._gridModel.getSelectedNodes();
					if (disclaimerTable && that.controller.disclaimerData.length>0)
						selectedDisclaimers = disclaimerTable._gridModel.getSelectedNodes();
					let selectedNodeList = [...selectedWorksheets,...selectedDisclaimers];
					that.downloadDocument(selectedNodeList);
				}
			},
			{
				id : "remove",
				text : NLS.delete,
				fonticon : "trash",
				disabled : true,
				handler : function() {
					// this selection is exclusive to worksheet section
					if(that.controller.worksheetTableView && that.controller.worksheetData.length>0) {
						let selectedNodeList = that.controller.worksheetTableView._gridModel.getSelectedNodes();
						if(selectedNodeList.length>0) {
							let deleteMsg = '';
							if(selectedNodeList.length === 1)
								deleteMsg = selectedNodeList[0].options.label;
							else
								deleteMsg = selectedNodeList.length+" "+NLS.worksheets;
							let superModal = new SuperModal({renderTo : widget.body, okButtonText: NLS.delete, cancelButtonText: NLS.cancel});
							superModal.confirm(NLS.delete_confirmation,NLS.delete+" - "+deleteMsg, function (result) {
								if(result){		
									let deleteData = selectedNodeList.map((node) => node.getAttributeValue("objectId"))
										.map((id) => {
											return {
												worksheetId: id
											};
										});
									var deleteOptions = {
										id: that.controller.options.id,
										//documentName: node.options.label,
										data: {data: deleteData},
										collectionViewEvents:that.controller.worksheetTableView.collectionViewEvents
									};
									var process = function() {
										deleteOptions.collectionViewEvents.publish({event:'xsourcing-collectionview-update-count'});
										widget.notificationUtil.showSuccess(NLS.FILE_REMOVED_SUCCESS);
									};
									deleteOptions.onComplete = process.bind(this);
									that.controller.removeDocument(deleteOptions,true);
									selectedNodeList.forEach(node => node.getTreeDocument().removeRoot(node));
								}
							});
						}
					}
					
					if(that.controller.connectedTableView && that.controller.disclaimerData.length>0) {
						let selectedDisclaimerNodeList = that.controller.connectedTableView._gridModel.getSelectedNodes();
						if(selectedDisclaimerNodeList.length>0) {
							let deleteMsg = '';
							if(selectedDisclaimerNodeList.length === 1)
								deleteMsg = selectedDisclaimerNodeList[0].options.label;
							else
								deleteMsg = selectedDisclaimerNodeList.length+" "+NLS.disclaimers;
							let superModal = new SuperModal({renderTo : widget.body, okButtonText: NLS.delete, cancelButtonText: NLS.cancel});
							superModal.confirm(NLS.delete_confirmation,NLS.delete+" - "+deleteMsg, function (result) {
								if(result){		
									let deleteData = selectedDisclaimerNodeList.map((node) => node.getAttributeValue("objectId"))
										.map((id) => {
											return {
												disclaimerId: id
											};
										});
									var deleteOptions = {
										id: that.controller.options.id,
										//documentName: node.options.label,
										data: {data: deleteData},
										collectionViewEvents:that.controller.connectedTableView.collectionViewEvents
									};
									var process = function() {
										deleteOptions.collectionViewEvents.publish({event:'xsourcing-collectionview-update-count'});
										widget.notificationUtil.showSuccess(NLS.FILE_REMOVED_SUCCESS);
									};
									deleteOptions.onComplete = process.bind(this);
									that.controller.removeDocument(deleteOptions,false);
									selectedDisclaimerNodeList.forEach(node => node.getTreeDocument().removeRoot(node));
								}
							});
						}
					}
				}
			});
		}else{
			toolbarActions.push({
				id : "downloadDocument",
				text : NLS.download,
				fonticon : "download",
				disabled: true,
				handler : function() {
					let worksheetTable = that.controller.worksheetTableView;
					let disclaimerTable = that.controller.connectedTableView;
					let selectedWorksheets = [];
					let selectedDisclaimers = [];
					if (worksheetTable && that.controller.worksheetData.length>0)
						selectedWorksheets = worksheetTable._gridModel.getSelectedNodes();
					if (disclaimerTable && that.controller.disclaimerData.length>0)
						selectedDisclaimers = disclaimerTable._gridModel.getSelectedNodes();
					let selectedNodeList = [...selectedWorksheets,...selectedDisclaimers];
					
					that.downloadDocument(selectedNodeList);
				}
			});
		}
		
		return toolbarActions;
	};
	AttachmentsTabToolbar.prototype.downloadDocument= function(selectedNodeList){
		var that=this;
		if(selectedNodeList.length === 1){
						var downloadOptions = {};
							downloadOptions.docName=selectedNodeList[0].options.label;
							downloadOptions.docId= selectedNodeList[0].options.grid.orignalId;
						
							that.controller.model.downloadDocument(downloadOptions).then(function(){
								widget.notificationUtil.showInfo(downloadOptions.docName+" "+NLS.download_message);
							},function(){
								widget.notificationUtil.showError(NLS.document_download_failed_message);
							});
						
		}else{
			widget.notificationUtil.showError(NLS.multiple_select_download_error);	
		}
	};
	return AttachmentsTabToolbar;
});
