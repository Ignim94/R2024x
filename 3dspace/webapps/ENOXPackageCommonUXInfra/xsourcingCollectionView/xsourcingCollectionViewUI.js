//XSS_CHECKED
/* global widget */
/*eslint no-unused-vars: "off"*/
/* eslint-disable complexity */
/*eslint no-useless-return: "off"*/
/**
 * This file builds UI for xrfqCollectionView
 *
 */
define('DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionViewUI',
		[
			'DS/DataGridView/DataGridView',
			'DS/CollectionView/ResponsiveTilesCollectionView',
			'DS/CollectionView/ResponsiveLargeTilesCollectionView',
			'DS/CollectionView/ResponsiveThumbnailsCollectionView',
			'DS/ENOXCollectionToolBar/js/ENOXCollectionToolBarV2',
			'DS/ENOXPackageCommonUXInfra/Mediator',
			'css!DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView.css',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/Controls/Expander',
			'DS/Windows/ImmersiveFrame',
			'UWA/Core',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/Utilities/Utils',
			'DS/UIKIT/Iconbar',
			'DS/ENOXPackageCommonUXInfra/Search/SearchUtility'
			],
			function(DataGridView,
					ResponsiveTilesCollectionView,
					ResponsiveLargeTilesCollectionView,
					ResponsiveThumbnailsCollectionView,
					ENOXCollectionToolBar,
					Mediator,
					xsourcingCollectionView_css,
					NLS,
					WUXExpander,
					WUXImmersiveFrame,
					UWA,
					constants,
					ENOXSourcingPlatformServices,
					Utils,
					Iconbar,
					SearchUtility){
	'use strict';

	//this function provides either the original value of the cell or, if the cell is
	//an object containing the label property, its label value
	function getLabelForCell (cellInfos) {
		var cellValue = "";
		if(this.layout.getLeafColumns()[cellInfos.columnID]){
			let dataIndex = this.layout.getLeafColumns()[cellInfos.columnID].dataIndex;
	        cellValue = cellInfos.nodeModel.getAttributeValue(dataIndex); 
	        cellValue = cellValue?((cellValue.label)?cellValue.label:cellValue):"";
		}
		return cellValue;
	}
    function getLabelForCellExport (cellInfos) {
		let cellValue = this.getModelAt(cellInfos.cellID);
		return cellValue?((cellValue.label)?cellValue.label:cellValue):"";
	}
	//this method is called when grouping rows by one or more columns and prevents unexpected results
	//when the TreeNodeModel's label property is not the chosen property to figure in the tree column
	function defaultGetGroupingNodeOptions (rowModel) {
		//first create the label that contains the column title, the grouping element and the aggregation count.
		let groupingColumnDataIndex = rowModel.getProperty();
		let groupingColumnText = this.layout.getColumnOptionValue(groupingColumnDataIndex, 'text');
		//let label = (groupingColumnText ? groupingColumnText + ': ' : '') + rowModel.getIdentifier() + ' (' + rowModel.getNumberOfOriginalChildren().notHidden + ')'; this method not available
		let label = (groupingColumnText ? groupingColumnText + ': ' : '') + rowModel.getIdentifier() + ' (' + rowModel.getOriginalChildrenInformation().notHiddenNotFilteredChildrenCount + ')';
		//now create an object that will compose the grid property of the fake node
		let resultingGrid = {
			"grouped":true
		};
		//if there is a 'tree' dataIndex among the columns use its 'property' attribute to place the label in the treeColumn. Otherwise,
		//default to the first column
		let treeColumn = this.layout.getLeafColumns().filter(col => col.dataIndex === 'tree' && col.property)[0] || this.layout.getLeafColumns()[0];
		if(treeColumn) resultingGrid[treeColumn.property||treeColumn.dataIndex] = label;

		return resultingGrid;
	}

	function isSectionSafe (safeSections, section) {
		return safeSections.indexOf(section) !== -1;
	}

	function onStatusbarIconPointerDown (params) {
		let {cellInfos} = params;
		let {nodeModel} = cellInfos;
		let {options} = nodeModel;
		let iconPointerDownCallback = options.statusbarActions, me = this;
		if(iconPointerDownCallback && iconPointerDownCallback instanceof Array && typeof iconPointerDownCallback[params.clickedIconIndex] === 'function') {
			iconPointerDownCallback[params.clickedIconIndex](params, me);
		}
	}

	var CollectionView = function(){
		this.currentView = "Tile View";
	};

	CollectionView.prototype.init = function(options){
		var that = this;
		this.options=options;
	    this.searchUtility = new SearchUtility();
		this._allData = options.data;
		this._model = options.model;
		this._gridModel = options.gridModel;
		if(!options.container)
				options.container = widget.app._triptychWrapper.getMainPanelContainer();
		
		//SI-3515
		if(options.container.empty)
		    options.container.empty();
		
		let immersiveFrame = widget.app.immersiveFrame || new WUXImmersiveFrame({reactToPointerEventsFlag: false}).inject(options.container);
		let wrapper = UWA.createElement('div', {'class': 'xsourcingcollectionview-wrapper-container'}).inject(options.container);
		let toolbarwrapper = UWA.createElement('div', {'class': 'xsourcingcollectionview-toolbarwrapper-container'}).inject(wrapper);
		let toolbarMobileIconContainer = UWA.createElement('div', {'class': 'xsourcingcollectionview-toolbar-mobileicon-container'}).inject(toolbarwrapper);
		let toolbarIconBarContainer = UWA.createElement('div', {'class': 'xsourcingcollectionview-iconbar-toolbar-container'}).inject(toolbarwrapper);		
		let viewContainer = UWA.createElement('div', {'class': 'xsourcingcollectionview-content-container'}).inject(wrapper);
		
		/*let immersiveFrame = widget.app.immersiveFrame || new WUXImmersiveFrame({reactToPointerEventsFlag: false}).inject(options.container);
		let wrapper = UWA.createElement('div', {'class': 'xsourcingcollectionview-wrapper-container'}).inject(options.container);
		let toolbarContainer = UWA.createElement('div', {'class': 'xsourcingcollectionview-toolbar-container'}).inject(wrapper);
		let viewContainer = UWA.createElement('div', {'class': 'xsourcingcollectionview-content-container'}).inject(wrapper);*/
		
		options.columnsConfigurations.forEach((column)=>{
		    if(column.hasOwnProperty('isEditedCellToHighlight')){
		    	column.getCellValueTemp = column.getCellValue;
	            column.getCellValue = function(cellInfos){
	            	var returnValue, newValue, oldValue;
	            	if(column.hasOwnProperty('getCellValue'))
			    		returnValue = column.getCellValueTemp(cellInfos);
					else
			    		returnValue = cellInfos.nodeModel.options.grid[options.xsourcingCollectionView._xsourcingCollectionViewUI._dataGridView.columns[cellInfos.columnID].dataIndex];
	            	if(returnValue && returnValue.hasOwnProperty('label'))
						newValue = returnValue['label'];
					else
						newValue = returnValue;
	            	oldValue = this.previousValue?this.previousValue[cellInfos.cellID]:undefined;
	            	if(document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]').length > 0){
		            	if(!document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.fontWeight){
		            		if(oldValue && newValue !== oldValue){
				            	var existingFontWeight = document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.fontWeight;
								var existingFontColor = document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.color;
								document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.fontWeight = 'bold';
								document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.color = 'dodgerblue';
								setTimeout(function(){
									document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.fontWeight = existingFontWeight;
									document.querySelectorAll('[cell-id="'+cellInfos.cellID+'"]')[0].style.color = existingFontColor;
								}, 2000);
	            			}
	            		}
			        }   
	            	if(!this.previousValue)
	            		this.previousValue = [];
	            	if(newValue !== oldValue)
						this.previousValue[cellInfos.cellID] = newValue;
	            	return returnValue;
	            };
		    }    
		});
		this._columnsConfiguration = options.columnsConfigurations;

		this.viewContainer = viewContainer;

		this.collectionViewEvents=options.collectionViewEvents;
		this._toolbarChannel = new Mediator().createNewChannel();
		this._selectedItems = [];
		this.toolbarOptions = {};
		this.toolbarOptions.actions = options.toolbarActions;
		this.toolbarOptions.modelEvents = that._toolbarChannel;
		this.toolbarOptions.showItemCount = options.showItemCount!==undefined?options.showItemCount:true;
		this.uniqueIdentifier=options.uniqueIdentifier;
		this.disableNoDataMessage=options.disableNoDataMessage;
		if(!options.hideTitle){
		this.toolbarOptions.itemName=options.itemsName;
		this.toolbarOptions.itemsName=options.itemsName;
		}
		
		if(options.withmultisel){
		  this.toolbarOptions.withmultisel =  true;
		}
		if(options.sort){
		  this.toolbarOptions.sort= options.sort;
		}
		
		this.toolbarOptions.views = [{
			id: "Tile View",
			text : NLS.TILE_VIEW,
			fonticon : "view-small-tile"
		},
		{
			id: "Thumbnail View",
			text : NLS.THUMBNAIL_VIEW,
			fonticon : "view-small-thb"
		},
		{
			id: "Grid View",
			text : NLS.GRID_VIEW,
			fonticon : "view-list"
		}		
		];
		if(options.customView) {
			this.toolbarOptions.views.push(options.customView);
		}
		if(options.views /*&& ((!options.customView && options.views.length!==4) || (options.customView && options.views.length!==5))*/){
			if(!options.views.includes("Grid")){
				this.toolbarOptions.views.splice(2, 1);
			}
			if(!options.views.includes("Thumbnail")){
				this.toolbarOptions.views.splice(1, 1);
			}
			if(!options.views.includes("Tile")){
				this.toolbarOptions.views.splice(0, 1);
			}
			if(options.views.includes("Large Tile")){
				this.toolbarOptions.views.push({
					id: "Large Tile View",
					text : NLS.LARGE_TILE_VIEW,
					fonticon : "view-big-tile"
				});
			}
		}
		this.toolbarOptions.currentView = options.currentView?options.currentView:this.toolbarOptions.views[0].id?this.toolbarOptions.views[0].id:'Tile View';
		
		//optoins.uniqueIdentifier to remember view behaviour in collections
		if(options.uniqueIdentifier){
		var selectedView=widget.getValue(options.uniqueIdentifier); 
		if(selectedView && selectedView!==null && selectedView!==''){
			this.toolbarOptions.currentView=selectedView;
		}
		}
		
		this.toolbarOptions.filter = {
			enableCache : true
		};
		if(options.disableSearchFilter)delete this.toolbarOptions.filter;
		if(this.toolbarOptions.views.length===1){
			this.toolbarOptions.views.length = 0;
		} 
		if(options.showToolbar){
			this.collectionToolbar = new ENOXCollectionToolBar(this.toolbarOptions);
	        this.collectionToolbar.inject(toolbarIconBarContainer);
	        if(options.toolbarSearchActionOverride && typeof options.toolbarSearchActionOverride === 'function'){
	        	this.collectionToolbar._clickSearch = options.toolbarSearchActionOverride.bind(this.collectionToolbar, this.collectionToolbar._clickSearch);
	        }
	        if(!options.hideWelcomePanelIcon || options.showMobileWelcomePanelIcon){
	            that.addMobileIconContainer(options,toolbarMobileIconContainer);	
	        }
	        if( options.showToolbarInfoIcon===true){
	        	options.toolbarInfoIcon=  [
	        	                   		{
	        	                   			"id" : "sourcinginfoicon",
	        	                   			text : NLS.information,
	        	                   			fonticon : 'info',
	        	                   			disabled : true,
	        	                   			handler : function()
	        	                   			{
	        	                   				var iIcon = document.querySelector('#sourcinginfoicon');
	        	                   				var iconContainer = iIcon.getChildren()[0];
	        	                   				if(!iconContainer.className.contains('enox-collection-toolbar-filter-activated'))
	        	                   				{
	        	                   					// Add the blue color on the icon when it selected
	        	                   					//iconContainer.removeAttribute('class');
	        	                   					iconContainer.addClassName('enox-collection-toolbar-filter-activated');
									options.app._applicationChannel.publish({ event: 'information-panel-open', data: 'right' });
	        	                   				}else{
	        	                   					iconContainer.removeClassName('enox-collection-toolbar-filter-activated');
									options.app._applicationChannel.publish({ event: 'information-panel-close', data: '' });
	        	                   				}

	        	                   			}
	        	                   		}
	        	                   		];
	        	this.collectionToolbar._actionsIconBar.addItem(options.toolbarInfoIcon[0]);
	        	
	        }
		}

		let tileViewOptions = {
				useDragAndDrop: options.enableDrag?options.enableDrag:false,
						pageScrollValueTriggeringInfiniteScroll: 0.5,
						...(options.displayedOptionalCellProperties!==undefined) ? 
								{displayedOptionalCellProperties:options.displayedOptionalCellProperties} : 
								{},
								...(options.shouldAllowUnsafeHTMLAt !== undefined && options.shouldAllowUnsafeHTMLAt instanceof Array) ? 
										{ shouldCellAllowUnsafeHTMLContentAt: function(cellInfos, origin) {
									return isSectionSafe(options.shouldAllowUnsafeHTMLAt, origin);
								}}:{},
								onDragEnterBlankDefault: function(event) {},
								onDragEnterBlank: function(event) {},
								onDragStartCell : function(dragEvent, data){
									var selectedNodes = this.getTreeDocument().getSelectedNodes(); 
									var DnDData = that.formatDataForDnD(selectedNodes);
									dragEvent.dataTransfer.setData("text/plain", JSON.stringify(DnDData));
									return false;
								}
		};
		
		let largeTileViewOptions = {
				...tileViewOptions
		};

		let thumbnailViewOptions = {
				useDragAndDrop : options.enableDrag?options.enableDrag:false,
						...(options.displayedOptionalCellProperties!==undefined) ? 
								{displayedOptionalCellProperties:options.displayedOptionalCellProperties} : 
								{displayedOptionalCellProperties: ['contextualMenu','statusbarIcons']},
								pageScrollValueTriggeringInfiniteScroll:0.5,
								...(options.descriptionLinesNumber!== undefined) ? {descriptionLinesNumber: options.descriptionLinesNumber}: {},
										...(options.shouldAllowUnsafeHTMLAt !== undefined && options.shouldAllowUnsafeHTMLAt instanceof Array) ? 
												{ shouldCellAllowUnsafeHTMLContentAt: function(cellInfos, origin) {
											return isSectionSafe(options.shouldAllowUnsafeHTMLAt, origin);
										}}:{},
										onDragEnterBlankDefault: function(event) {},
										onDragEnterBlank: function(event) {},
										onDragStartCell : function(dragEvent, data){
											var selectedNodes = this.getTreeDocument().getSelectedNodes(); 
											var DnDData = that.formatDataForDnD(selectedNodes);
											dragEvent.dataTransfer.setData("text/plain", JSON.stringify(DnDData));
											return false;
										}
		};

		if(options.canMultiSelect === false){ //Because by default it is true and we have to worry about only false case
			tileViewOptions.selectionBehavior = largeTileViewOptions.selectionBehavior = thumbnailViewOptions.selectionBehavior = {
																			canMultiSelect: false
																		};
		}
		
		//Setup Tile, thumbnail  view
		this._tilecollectionView = new ResponsiveTilesCollectionView(tileViewOptions);
		this._largeTilecollectionView = new ResponsiveLargeTilesCollectionView(largeTileViewOptions);
		this._thumbnailCollectionView = new ResponsiveThumbnailsCollectionView(thumbnailViewOptions);

		if(options.getSubLabel) {
			this._tilecollectionView.getSubLabel = options.getSubLabel;
			this._thumbnailCollectionView.getSubLabel = options.getSubLabel;
			}
			if (options.getLabel) {
				this._tilecollectionView.getLabel = options.getLabel;
				this._thumbnailCollectionView.getLabel = options.getLabel;
		}
		if(options.getDescription) {
			this._tilecollectionView.getDescription = options.getDescription;
			this._thumbnailCollectionView.getDescription = options.getDescription;
		}
		if(options.getStatusbarIcons) {
			this._tilecollectionView.getStatusbarIcons = options.getStatusbarIcons;			
			this._thumbnailCollectionView.getStatusbarIcons = options.getStatusbarIcons;
		}
		if(options.getStatusbarIconsTooltips) {
			this._tilecollectionView.getStatusbarIconsTooltips = options.getStatusbarIconsTooltips;
			this._thumbnailCollectionView.getStatusbarIconsTooltips = options.getStatusbarIconsTooltips;
		}
		if(options.getCustomTooltip) {
			this._tilecollectionView.getCustomTooltip = options.getCustomTooltip;
			this._thumbnailCollectionView.getCustomTooltip = options.getCustomTooltip;
		}
		if(options.getEmptyStatusbarVisibleFlag) {
			this._largeTilecollectionView.getEmptyStatusbarVisibleFlag = this._tilecollectionView.getEmptyStatusbarVisibleFlag = options.getEmptyStatusbarVisibleFlag;
			this._thumbnailCollectionView.getEmptyStatusbarVisibleFlag = options.getEmptyStatusbarVisibleFlag;
		}
		//enable status bar click behaviors
		this._largeTilecollectionView.onStatusbarIconPointerDown = this._tilecollectionView.onStatusbarIconPointerDown = options.onStatusbarIconPointerDown || onStatusbarIconPointerDown;
		this._thumbnailCollectionView.onStatusbarIconPointerDown = options.onStatusbarIconPointerDown || onStatusbarIconPointerDown;		
		
		if(options.onPostCellRequest) {
			this._tilecollectionView.onPostCellRequest(options.onPostCellRequest);
			this._largeTilecollectionView.onPostCellRequest(options.onPostCellRequest);
			this._thumbnailCollectionView.onPostCellRequest(options.onPostCellRequest);
		}
		
		
		if(options.getLargeTileSubLabel) {
			this._largeTilecollectionView.getSubLabel = options.getLargeTileSubLabel;
		}
		if(options.getLargeTileDescription) {
			this._largeTilecollectionView.getDescription = options.getLargeTileDescription;
		}
		if(options.getLargeTileStatusbarIcons) {
			this._largeTilecollectionView.getStatusbarIcons = options.getLargeTileStatusbarIcons;			
		}
		if(options.getLargeTileStatusbarIconsTooltips) {
			this._largeTilecollectionView.getStatusbarIconsTooltips = options.getLargeTileStatusbarIconsTooltips;
		}
		if(options.getLargeTileCustomTooltip) {
			this._largeTilecollectionView.getCustomTooltip = options.getLargeTileCustomTooltip;
		}
		
		let rowGroupingOptions = {
			getGroupingNodeOptions: defaultGetGroupingNodeOptions
		};

			let dataGridViewOptions = {
				identifier: options.uniqueIdentifier ? options.uniqueIdentifier : "",
				layoutOptions: {
				    layoutDensity: options.activateComfortableView?'comfortable':'compact',
					...(options.showColumnsHeader !== undefined)?{columnsHeader:options.showColumnsHeader} : {},
					...(options.showRowsHeader !== undefined)?{rowsHeader:options.showRowsHeader} : {}
				},
				selectionBehavior: {
	                ...(options.toggleSelection !== undefined)?{toggle:options.toggleSelection} : {}
	            },
				useWidgetPreferencesFlag: true,
				selectionMode: 'row',
				columns: this._columnsConfiguration,
				showSelectionCheckBoxesFlag: 'OnOver',
				cellSelection: "single",
				rowSelection: options.rowSelection ? options.rowSelection : "multiple",
				defaultColumnDef: {
					editionPolicy: "EditionOnClick",
					getCellValueForExport: getLabelForCellExport,
					getCellGroupingKey: getLabelForCell
				},
				rowGroupingOptions: rowGroupingOptions,
				pageScrollValueTriggeringInfiniteScroll: 0.5,
				showRowBorderFlag:options.showRowBorderFlag,
				showColumnBorderFlag:options.showColumnBorderFlag,
				placeholder: options.dgvPlaceholder?options.dgvPlaceholder:NLS.data_unavailable_message,
				...(options.showAlternateBackgroundFlag !== undefined)?{showAlternateBackgroundFlag:options.showAlternateBackgroundFlag} : {},
				...(options.showRowBorderFlag !== undefined)?{showRowBorderFlag:options.showRowBorderFlag} : {},
				...(options.cellSelection !== undefined)?{cellSelection:options.cellSelection} : {},
				...(options.selectionStyle !== undefined)?{selectionStyle:options.selectionStyle} : {},
				...(options.useAsyncPreExpand !== undefined)?{useAsyncPreExpand:options.useAsyncPreExpand} : {},
				...(options.dataSource ? { dataSource: options.dataSource } : {}),
				...(options.virtuallyLoadAllModelItems ? { virtuallyLoadAllModelItems: options.virtuallyLoadAllModelItems } : {})
			};

			if (options.enableCellDrag && options.onDragStartCell) {
				dataGridViewOptions.cellDragEnabledFlag = options.enableCellDrag;
				dataGridViewOptions.onDragStartCell = options.onDragStartCell;
			}
			if (options.enableDrag && options.onDragStartRowHeader) {
				dataGridViewOptions.rowDragEnabledFlag = options.enableDrag;
				dataGridViewOptions.onDragStartRowHeader = options.onDragStartRowHeader;
			}
			else {
				dataGridViewOptions.rowDragEnabledFlag = options.enableDrag ? options.enableDrag : false;
				dataGridViewOptions.onDragStartRowHeader = function (dragEvent, dropInfos) {
					let selectedNodes = this.getTreeDocument().getSelectedNodes();
					let DnDData = that.formatDataForDnD(selectedNodes);
					dragEvent.dataTransfer.setData("text/plain", JSON.stringify(DnDData));
					return false;
				};
			}
			this._dataGridView = new DataGridView(dataGridViewOptions);

		this._dataGridView.immersiveFrame = immersiveFrame;
		//sadly, this may not work when the table model is loaded asynchronously, in which case
		//a new call to groupRows must be made at the end of the data fetching process
		this._dataGridView.onReady(function() {
			if (options.groupingOptions) {
				that.groupingOptionsforViewSwitch = { ...options.groupingOptions };
				that._dataGridView.prepareUpdateView();
				that._dataGridView.groupRows(options.groupingOptions);
				that._dataGridView.pushUpdateView();
			}
			if (options.toHighlight) {
				that.selectNodeModel(options.toHighlight);
			}
		});
				
		this._dataGridView.subscribeOnceToAllCellsRendered(()=>{
			that.collectionViewEvents.publish({event:'xsourcing-collectionview-dgv-subscribeOnceToAllCellsRendered',data:{dataGridView:this._dataGridView}});
		});

		this._dataGridView.addEventListener('click', Utils.debounce((evt, cellInfos) => {

    		if (cellInfos && cellInfos.nodeModel && evt.target.hasClassName) {
    			var hasClickedOnLink = evt.target.hasClassName("wux-tweakers-string-label");

                if(!hasClickedOnLink) return ; // usr has not clicked on  the link

                var columnKey = evt.dsModel.layout.getDataIndexFromColumnIndex(cellInfos.columnID);
                //we should consider leaf level columns(grouped columns) as well.
                //var columnOptions = evt.dsModel.layout.columns.find(obj => obj.dataIndex === columnKey);
                var columnOptions = evt.dsModel.layout.getLeafColumns().find(obj => obj.dataIndex === columnKey);

                if((columnOptions.typeRepresentation === 'url' || (columnOptions.getCellTypeRepresentation && columnOptions.getCellTypeRepresentation(cellInfos)==="url")) && columnOptions.hyperlinkTarget==='_self'){
                   if(evt.target.hasClassName("wux-tweakers-string-label")){
                     var params = cellInfos;
                     if(cellInfos.cellModel.hyperlinkClickCallback)
                    	 cellInfos.cellModel.hyperlinkClickCallback(params);
                   }
             }
    		} 
		},300));
		
		this._dataGridView.addEventListener('mouseover', function (evt, cellInfos) {
				if (cellInfos && cellInfos.nodeModel && evt.target.hasClassName) {
    			var hasClickedOnLink = evt.target.hasClassName("wux-tweakers-string-label");

                if(!hasClickedOnLink) return ; // usr has not clicked on  the link

                var columnKey = evt.dsModel.layout.getDataIndexFromColumnIndex(cellInfos.columnID);
                var columnOptions = evt.dsModel.layout.columns.find(obj => obj.dataIndex === columnKey);
                if(!columnOptions){
                	evt.dsModel.layout.columns.map(function(clmn){
                		if(clmn.children && clmn.children.length > 0 && clmn.children.some(obj => obj.dataIndex === columnKey)){
                			columnOptions = clmn.children.find(obj => obj.dataIndex === columnKey);
                			return;
                		}
                	});
                }
                if(columnOptions && columnOptions.typeRepresentation === 'url' && columnOptions.hyperlinkTarget==='_self'){
					if(!(columnOptions.typesNAForHyperlink && cellInfos.nodeModel.options.grid.actualType 
						 && columnOptions.typesNAForHyperlink.includes(cellInfos.nodeModel.options.grid.actualType))){
						if(evt.target.hasClassName("wux-tweakers-string-label")){
	                	   evt.target.setStyle('text-decoration', 'underline');
	                	   evt.target.setStyle('cursor', 'pointer');
	                   }	
					}
	             }
    		} 
        });
		
		this._dataGridView.addEventListener('mouseout', function (evt, cellInfos) {
				if (cellInfos && cellInfos.nodeModel && evt.target.hasClassName) {
    			var hasClickedOnLink = evt.target.hasClassName("wux-tweakers-string-label");

                if(!hasClickedOnLink) return ; // user has not clicked on  the link

                var columnKey = evt.dsModel.layout.getDataIndexFromColumnIndex(cellInfos.columnID);
                var columnOptions = evt.dsModel.layout.columns.find(obj => obj.dataIndex === columnKey);
                if(!columnOptions){
                	evt.dsModel.layout.columns.map(function(clmn){
                		if(clmn.children && clmn.children.length > 0 && clmn.children.some(obj => obj.dataIndex === columnKey)){
                			columnOptions = clmn.children.find(obj => obj.dataIndex === columnKey);
                			return;
                		}
                	});
                }
                if(columnOptions && columnOptions.typeRepresentation === 'url' && columnOptions.hyperlinkTarget==='_self'){
					if(!(columnOptions.typesNAForHyperlink && cellInfos.nodeModel.options.grid.actualType 
						 && columnOptions.typesNAForHyperlink.includes(cellInfos.nodeModel.options.grid.actualType))){
	                   if(evt.target.hasClassName("wux-tweakers-string-label")){
	                	   evt.target.setStyle('text-decoration', 'none');
	                	   evt.target.setStyle('cursor', 'none');
	                   }
					}
             }
    		} 
        });

			if(options.onPostAdd && typeof options.onPostAdd === 'function') {
				this._dataGridView.getCellsXSO().onPostAdd(function (addedElements) {
					addedElements.forEach(function (xsoElement) {
						options.onPostAdd(xsoElement);
					});
				});
			}
						
			if (options.onContextualEventCallback) {
				//var that = this;
				this._tilecollectionView.onContextualEvent = {
					'callback': options.onContextualEventCallback
				};
				this._largeTilecollectionView.onContextualEvent = {
					'callback': options.onContextualEventCallback
				};
				this._thumbnailCollectionView.onContextualEvent = {
					'callback': options.onContextualEventCallback
				};
				this._dataGridView.onContextualEvent = options.onContextualEventCallback;

			this._dataGridView.getContainingImmersiveFrame = function() {
				return that._dataGridView.immersiveFrame;
			};
		}

		this._subscribeToEvents(options);
		that._toolbarChannel.publish({event : 'enox-collection-toolbar-switch-view-activated', data:this.toolbarOptions.currentView});
		if(options.expander){
			this.addExpander(options);
		}
		if(widget && widget.app && widget.app._applicationChannel)
			widget.app._applicationChannel.publish({event :"xsourcingcollectionviewui_init_complete" , data:this});
	};

	CollectionView.prototype._subscribeToEvents = function(options){
		var that = this;
		var tileAndThumbnailModel = that._tilecollectionView.getModel();
		var dataGridModel = this._gridModel.getXSO();
		var dataGridViewModel = this._dataGridView.getNodesXSO();

		that._toolbarChannel.subscribe({event : 'enox-collection-toolbar-switch-view-activated'} , function(data){
			//that._gridModel.unselectAll();
			//that._model.unselectAll();
			// that.viewContainer.innerHTML = "";
			
			// //optoins.uniqueIdentifier to remember view behaviour in collections
			// if(options.uniqueIdentifier){
			// widget.setValue(options.uniqueIdentifier,data);
			// }
			// if(that.groupingOptionsforViewSwitch){
			// that._gridModel.prepareUpdate();
			// that._gridModel.ungroupRoots();
			// that._gridModel.pushUpdate();
			// }
			// if(data === "Thumbnail View"){
			// 	that._thumbnailCollectionView.getContent().inject(that.viewContainer);
			// 	that.currentView = "Thumbnail View";
			// 	that.checkNoDataFoundMessage();
			// }
			// else if(data === "Tile View"){
			// 	that._tilecollectionView.getContent().inject(that.viewContainer);
			// 	that.currentView = "Tile View";
			// 	that.checkNoDataFoundMessage();
			// }
			// else if(data === "Grid View"){
			// 	that._dataGridView.getContent().inject(that.viewContainer);
			// 	that.currentView = "Grid View";
			// 	if(that.groupingOptionsforViewSwitch){
			// 		that._dataGridView.prepareUpdateView();
			// 		that._dataGridView.groupRows({...that.groupingOptionsforViewSwitch});
			// 		that._dataGridView.pushUpdateView();
			// 	}
			// }
			that.switchView(data);
		});

		that._thumbnailCollectionView.onCellDoubleClick(function(data){
			that.collectionViewEvents.publish({event:'xsourcing-collectionview-cell-dblclick', data: data.nodeModel.options.grid});
		});
		
		that._largeTilecollectionView.onCellDoubleClick(function(data){
			that.collectionViewEvents.publish({event:'xsourcing-collectionview-cell-dblclick', data: data.nodeModel.options.grid});
		});
		
		// This works. but not for DataGridView
		tileAndThumbnailModel.onCellDoubleClick(function(data){
			that.collectionViewEvents.publish({event:'xsourcing-collectionview-cell-dblclick', data: data.nodeModel.options.grid});
		});
		
		//Method to handle Sorting option on Toolbar
		this._toolbarChannel.subscribe({event:'enox-collection-toolbar-sort-activated'}, function(data){
			
			//Data coming from ENOXCollectionToolbar.js as per user selection
			var sortOptions = {
					sortAttribute : data.sortAttribute,
        			sortOrder : data.sortOrder
        	};
	      
	        //Call to the sortChildren method for sorting
			var reverseFactor = (sortOptions.sortOrder).toLowerCase() === 'asc' ? 1 : -1;
	          that._dataGridView.treeDocument._trueRoot.sortChildren({
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
		
		if(options.withmultisel){
			that._toolbarChannel.subscribe({event : 'enox-collection-toolbar-all-selected'} , function(){
				tileAndThumbnailModel.selectAll();
			});
			
			that._toolbarChannel.subscribe({event : 'enox-collection-toolbar-all-unselected'} , function(){
				tileAndThumbnailModel.unselectAll();
			});
		}
		//For filter functionality in toolbar
		that._toolbarChannel.subscribe({event: 'enox-collection-toolbar-filter-search-value'}, function (data) {
			that.collectionViewEvents.publish({event : 'filter-on-search', data: data.searchValue[0]});
		});
    
    	dataGridModel.onChange(function(){
			var selectedNodes = that._gridModel.getSelectedNodes();
			var selectedIds = selectedNodes.map(function(selectedNode){return selectedNode._options.grid['id'];});
				that._selectedItems = [];
				if (selectedNodes.length !== 0) {
					if (that._allData.length > 0){
						that._allData = that._allData
										     .map(e => e.grid.id)
										     .map((e, i, final) => final.indexOf(e) === i && i)
										     .filter(obj=> that._allData[obj])
										     .map(e => that._allData[e]);//To remove duplicate objects. 
											 //TODO: Temp workaround is to remove duplicates, ideally we need to get rid of allData logic
						that._selectedItems = that._allData.filter(function (data) { return selectedIds.indexOf(data.grid.id) !== -1; });
					} else {
						selectedNodes.forEach((item) => { that._selectedItems.push(item.options); });	
					}
				}
				that.collectionViewEvents.publish({ event: 'xsourcing-collectionview-selection-updated', data: { selectedItems: that._selectedItems, selectedNodes: selectedNodes } });
				
				let paths = selectedNodes.map(function(selectedNode){return [selectedNode._options.grid['id']];});
                that.searchUtility.getPlatfromAPIObj().publish(constants.PUBLISH_TO_PROPERTY,{data : {
					paths : paths
				}});
			});

			if (dataGridViewModel !== null) {
				dataGridViewModel.onChange(function () {
					var selectedNodes = that._dataGridView.getTreeDocument().getSelectedNodes();
					var selectedIds = selectedNodes.map(function (selectedNode) { return selectedNode._options.grid['id']; });
					that._selectedItems = [];
					if (selectedNodes.length !== 0) {
						if (that._allData.length > 0) {
							that._allData = that._allData
								.map(e => e.id)
								.map((e, i, final) => final.indexOf(e) === i && i)
								.filter(obj => that._allData[obj])
								.map(e => that._allData[e]);//To remove duplicate objects. 
							//TODO: Temp workaround is to remove duplicates, ideally we need to get rid of allData logic
							that._selectedItems = that._allData.filter(function (data) { return selectedIds.indexOf(data.id) !== -1; });
						} else {
							selectedNodes.forEach((item) => { that._selectedItems.push(item.options); });
						}
					}
					that.collectionViewEvents.publish({ event: 'xsourcing-collectionview-selection-updated', data: { selectedItems: that._selectedItems, selectedNodes: selectedNodes } });
				});
			}

			that.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-disable-toolbar-button' }, function (buttonID) {
				that._toolbarChannel.publish({
					event: 'enox-collection-toolbar-disable-action',
					data: buttonID
				});
			});

			that.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-enable-toolbar-button' }, function (buttonID) {
				that._toolbarChannel.publish({
					event: 'enox-collection-toolbar-enable-action',
					data: buttonID
				});
			});

			that.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-toolbar-add-action-with-content' }, function (obj) {
				that.collectionToolbar._actionsIconBar.addItem(obj);
				//this is a temporary way to handle this use case as suggested by VDO1(Toolbar Component Owner). For proper way to handle this changes need to come from OOTB side first against IR-886551
			});

			that.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-update-count' }, function (count) {
				if (that.toolbarOptions.showItemCount)
					that._updateCount(count);
			});

		that.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-load-full-model'},function(){
			if(that.options.groupingOptions) {
				//copying the whole object instead of reference of the object using spread operator.
				//that._dataGridView.groupRows(that.options.groupingOptions);
				that._dataGridView.groupRows({...that.options.groupingOptions}); 
			}
		});
		
		that.collectionViewEvents.subscribe({ event: 'xsourcing-collectionview-selection-updated'},function(data){
			if(data.selectedItems.length>0){
				if(options.showToolbarInfoIcon)
				that.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'sourcinginfoicon'});
			}else{
				if(options.showToolbarInfoIcon)
				that.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'sourcinginfoicon'});
			}
		});

	};

	CollectionView.prototype.setModel = function(gridModel){
		this._dataGridView.treeDocument = gridModel;

		//this._dataGridView.immersiveFrame = new WUXImmersiveFrame().inject(document.body);

		this._thumbnailCollectionView.model = gridModel;
		this._tilecollectionView.model = gridModel;
		this._largeTilecollectionView.model = gridModel;
		if(this.toolbarOptions.showItemCount)
			this._updateCount();
	};

	CollectionView.prototype._updateCount = function (countNumber) {
		var that = this;
		var count = '';
		if (that.options.showNodeCount === false) {
			count = '';
		} else {
			count = 0;
			if (countNumber) {
				count = countNumber;
			}
			else if (this._tilecollectionView && this._tilecollectionView.treeDocument) {
				count = this._tilecollectionView.treeDocument.getNumberOfVisibleDescendants();
			} else if (this._largeTilecollectionView && this._largeTilecollectionView.treeDocument) {
				count = this._largeTilecollectionView.treeDocument.getNumberOfVisibleDescendants();
			} else if (this._thumbnailCollectionView && this._thumbnailCollectionView.treeDocument) {
				count = this._thumbnailCollectionView.treeDocument.getNumberOfVisibleDescendants();
			} else {
				count = this._dataGridView.treeDocument ? this._dataGridView.treeDocument.getNumberOfVisibleDescendants() : 0;
			}
		}

		this._toolbarChannel.publish({
			event: 'enox-collection-toolbar-items-count-update',
			data: count
		});
		this.checkNoDataFoundMessage();
	};
	//Handling Expander for Collection View
	CollectionView.prototype.addExpander = function(options){
		var expanderDiv = new UWA.Element('div', {styles: {'height': '100%'}});
		var wrapperContainer=options.container.querySelector('.xsourcingcollectionview-wrapper-container');
		wrapperContainer.style.height=options.expander.height?options.expander.height:"250px";
		 this._expander = new WUXExpander({
	            style: options.expander.style?options.expander.style:'simple',
	            header: options.expander.expanderHeader?options.expander.expanderHeader:"",
	            body: wrapperContainer,
	            allowUnsafeHTMLHeader : false,
	            expandedFlag: options.expander.expandedFlag?options.expander.expandedFlag:false
	        }).inject(expanderDiv);
		 expanderDiv.inject(options.container);
	};

	CollectionView.prototype.checkNoDataFoundMessage=function(){
		if(this.disableNoDataMessage)return;
		if(this._dataGridView.treeDocument){	//checks if the grid model is defined...if not it will not break the code because of this check
			var _id="no-object-found-"+(this.toolbarOptions.itemsName||this.uniqueIdentifier);
			var noObjFoundElement=widget.getElement('[id="'+_id+'"]');
		if(this._dataGridView.treeDocument.getAllDescendants().length!==0){	//checks if the view has any element
			if(noObjFoundElement){		//if yes and if "No obj msg" is still there
				noObjFoundElement.remove();		//it will be removed
			}
		}else{
			/*checks three conditions
			 * 1.!noObjFoundElement implies if the view has 0 elements and No data message is not displayed yet
			 * 2.noObjFoundElement.parentNode!==this.viewContainer implies if the parent container of the found element is different from current container
			 * this is the usecase when user selects same type in both tables on home page
			 * 3.this.currentView!=='Grid View' implies if the view is grid view then don't show message as it has inbuilt message
			*/
			
			if((!noObjFoundElement || (noObjFoundElement.parentNode!==this.viewContainer)) && this.currentView!=='Grid View'){
				if(this.viewContainer.querySelector('#no-object-found-MembersView')){
					this.viewContainer.querySelector('#no-object-found-MembersView').remove();
				}
				this._noObjectAvailableDiv = UWA.createElement('div', {
					id : _id,
					'class': 'emptyContainerStyle',
					html : this.options.data_unavailable_message?this.options.data_unavailable_message:NLS.data_unavailable_message
				});
				this.viewContainer.appendChild(this._noObjectAvailableDiv);
			}
			
		}
		}
	};
	
	//this function checks for number of objects selected for delete.
	//if exceeds maximum limit, throw warning message and return true else false
	//delete limit changes should be updated in both constants and NLS files.
	CollectionView.prototype.checkIfExceedsDeleteLimit=function(selectedNodes) {
		if(selectedNodes.length > constants.DELETE_LIMIT){
			let message =  NLS.delete_limit_exceeds;
			message = message.replace('$1', NLS.delete_limit);
			widget.notificationUtil.showWarning(message);
			return true;
		}
			return false;
	};

	CollectionView.prototype.formatDataForDnD = function(nodeModels) {
		var that = this;
		let items = [];
		nodeModels.forEach(nodeModel=>{
			let draggedData = nodeModel.options.grid;
			var objectType = draggedData.actualType?draggedData.actualType:draggedData.type;
			var displayType = draggedData.displayType?draggedData.displayType:draggedData.type;
			var objectId = draggedData.actualId?draggedData.actualId:draggedData.id;
			var serviceId = draggedData.service?draggedData.service:constants.SOURCE_3DSPACE;
			if(constants.ONPREMISE === ENOXSourcingPlatformServices.getPlatformId())
				serviceId = constants.SOURCE_3DSPACE;
			items.push({
							"envId" : ENOXSourcingPlatformServices.getPlatformId(),
							"serviceId" : serviceId,
							"contextId" : "",
							"objectId" : objectId,
							"objectType" : objectType,
							"displayName" : nodeModel.options.label,
							"displayType" : displayType,
							...(draggedData.additionalDragData)
			});
		});

		return {    
					"protocol" : "3DXContent",
					"version" : "1.1",
					"source" : widget.data.appId,
					"widgetId" : widget.id,
					"data" : {
						"items" : items
					}
				};
	};

	CollectionView.prototype.switchView = function(view) {
		this.viewContainer.innerHTML = "";
			
		//optoins.uniqueIdentifier to remember view behaviour in collections
		if(this.options.uniqueIdentifier){
			widget.setValue(this.options.uniqueIdentifier,view);
		}
		if(this.groupingOptionsforViewSwitch){
		this._gridModel.prepareUpdate();
		this._gridModel.ungroupRoots();
		this._gridModel.pushUpdate();
		}
		if(view === "Thumbnail View"){
			this._gridModel.prepareUpdate();
			this._gridModel.ungroupRoots();
			this._gridModel.pushUpdate();
			this._thumbnailCollectionView.getContent().inject(this.viewContainer);
			this.currentView = "Thumbnail View";
			this.checkNoDataFoundMessage();
		}
		else if(view === "Tile View"){
			this._gridModel.prepareUpdate();
			this._gridModel.ungroupRoots();
			this._gridModel.pushUpdate();
			this._tilecollectionView.getContent().inject(this.viewContainer);
			this.currentView = "Tile View";
			this.checkNoDataFoundMessage();
      this.changeNodesVisibility(this.options,this._gridModel,"hide");
		}
		else if(view === "Large Tile View"){
			this._gridModel.prepareUpdate();
			this._gridModel.ungroupRoots();
			this._gridModel.pushUpdate();
			this._largeTilecollectionView.getContent().inject(this.viewContainer);
			this.currentView = "Large Tile View";
			this.checkNoDataFoundMessage();
		}
		else if(view === "Grid View"){
			this.changeNodesVisibility(this.options,this._gridModel,"show");
			this._dataGridView.getContent().inject(this.viewContainer);
			this.currentView = "Grid View";
			if(this.groupingOptionsforViewSwitch){
				this._dataGridView.prepareUpdateView();
				this._dataGridView.groupRows({...this.groupingOptionsforViewSwitch});
				this._dataGridView.pushUpdateView();
			}else{
				this._dataGridView.prepareUpdateView();
				//let existingGroupingOpts = this._dataGridView.getGroupingOptions();
				this._dataGridView.groupRows({dataIndexesToGroup: []}); //To ungroup first cleanly
				//this._dataGridView.groupRows(existingGroupingOpts); //To group again cleanly
				this._dataGridView.pushUpdateView();
			}
		} else if(this.options.customView && view === this.options.customView.id) {
			this.currentView = this.options.customView.id;
			this.options.customViewLoader();
		}
	};
	
	
	CollectionView.prototype.addMobileIconContainer = function(options,toolbarMobileIconContainer) {
		//var that = this;
		this._actionsInfoIconBar = new Iconbar(
				{
					renderTo : toolbarMobileIconContainer,
					events : {
						onClick : function(e, i) {
							options.app._applicationChannel.publish({ event: 'welcome-panel-expand' });
						}
					}
				});
		
		
		var iconViewsActionBar = {
				id : 'menuIcon',
				fonticon : 'menu',
				text : 'Menu',
				disabled : false
			};
		this._actionsInfoIconBar.addItem(iconViewsActionBar);
	};

    //Method Selects the given TreeNodeModel (selectNodeModel) and Ensures the given TreeNodeModel is visible. If needed, the scroller position is changed. (ensureNodeModelVisible)
	CollectionView.prototype.selectNodeModel = function (optionsTohighLight) {
		var that = this;
		that._dataGridView.selectNodeModel(
			that._dataGridView.model.filter(obj => obj.getAttributeValue(optionsTohighLight.key) === optionsTohighLight.id)[0], false, false
		);
		that._dataGridView.ensureNodeModelVisible(
			that._dataGridView.model.filter(obj => obj.getAttributeValue(optionsTohighLight.key) === optionsTohighLight.id)[0], true, false, 0
		);
	};

	CollectionView.prototype.unSelectAll = function () {
		let that = this;
		that._dataGridView.unselectAll();
	};

	CollectionView.prototype.changeNodesVisibility=function(options,treeDocument,action){
		let criteriasArray=options.nodesVisibilityCriterias?options.nodesVisibilityCriterias:[];
		treeDocument.prepareUpdate();
		treeDocument.getAllDescendants().forEach(function(node){
			criteriasArray.forEach(function(criterias){
				let matchesCriteria=true;
				for(let key in criterias){
					if(criterias.hasOwnProperty(key)){
						if(node.getAttributeValue(key)!==criterias[key]){
							matchesCriteria=false;
						}
					}
				}
				if(matchesCriteria){
					if(action==="hide")node.hide();
					else if(action==="show")node.show();
				}
			});
		});
		treeDocument.expandAll();
		treeDocument.pushUpdate();
		this._updateCount();
	};

	CollectionView.prototype.exportDataToCSV = function (optionsToExportDGV, filename) {
		let that = this;
		let csvString = that._dataGridView.getAsCSV(optionsToExportDGV);
		let fileName = filename;
		var universalBOM = "\uFEFF";
		let blob = new Blob([universalBOM + csvString], { type: 'text/csv;charset=utf-8;' });
		let link = document.createElement('a');
		let url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
		link.setAttribute("download", fileName);
		link.style.visibility = 'hidden';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	
	return CollectionView;

});
