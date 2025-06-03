define("DS/ENOSpecMultiGrid/attributes/controller/MultiGridAttributeManager", [
	"UWA/Core",
	"UWA/Promise",
	"DS/Controls/Abstract",
	"DS/PlatformAPI/PlatformAPI",
	"DS/Controls/TooltipModel",
	"DS/XSRCommonComponents/utils/Constants",
	"DS/ENOSpecMultiGridCommon/SpecMultiGridCommonView",
	"DS/ENOSpecMultiGrid/attributes/model/MultiGridItemModel",
	"DS/ENOSpecMultiGrid/attributes/model/MultiGridAttrColumn",
	"DS/ENOSpecMultiGridCommon/utils/SpecMultiGridMask",
	"DS/ENOSpecMultiGrid/attributes/view/MultiGridAttributeView",
	"DS/XSRCommonComponents/utils/XSRSearch",
	"DS/ENOSpecMultiGrid/attributes/model/MultiGridAttributeModel",
	"DS/ENOSpecMultiGrid/attributes/view/MultiGridToolBarConfig",
	"DS/XSRCommonComponents/utils/Notification",
	"DS/XSRCommonComponents/utils/RequestUtil",
	"DS/ENOSpecMultiGrid/attributes/controller/MultiGridAddExtensions",
	"DS/XSRCommonComponents/utils/Utils",
	"DS/XSRCommonComponents/utils/TypeUtils",
	"DS/XSRCommonComponents/components/XSpecDnD/DragDropUtil",
	"DS/ENOSpecMultiGrid/attributes/services/MultiGridAttrServiceProvider",
	"DS/ENOSpecMultiGrid/attributes/model/MultiGridItemSearchModel",
	"DS/ENOSpecMultiGridCommon/utils/SpecMultiGridUtil",
	"i18n!DS/ENOSpecMultiGrid/assets/nls/MultiGridAttribute",
	"css!DS/ENOSpecMultiGrid/attributes/MultiGridAttributes.css",
], function (
	UWA,
	Promise,
	Abstract,
	PlatformAPI,
	WUXTooltipModel,
	Constants,
	SpecMultiGridCommonView,
	MultiGridItemModel,
	MultiGridAttrColumn,
	Mask,
	MultiGridAttributeView,
	SearchManager,
	AttributeGridModel,
	MultiGridToolBarConfig,
	Notification,
	RequestUtil,
	GridAddExtensions,
	Utils,
	TypeUtils,
	DragDropUtil,
	AttrServiceProvider,
	MultiGridItemSearchModel,
	SpecMultiGridUtil,
	NLS
) {
	"use strict";
	var MultiGridAttributeManager = Abstract.extend({
		init: function (options) {
			RequestUtil.m3DSpaceURL = RequestUtil.get3DSpaceURL();
			this.isGridEmpty = true;
			this.selectedNodes = options.selectedNodes;
			this.container = options.container;
			this.modelEvents = options.modelEvents;
			this.appCore = options.appCore;
			this.coreModelEvents = this.appCore.basicModelEvents;
			this.currentTabKey = options.currentTabKey;
			this.triptychManager = this.appCore.multigridTriptych.triptychManager;
			this.gridEditContainer = UWA.createElement("div", { "class": "multigrid-edit-container" }).inject(this.container);
			let config = { gridEditContainer: this.gridEditContainer, appCore: this.appCore, modelEvents: this.modelEvents };
			this.gridAttributeView = new MultiGridAttributeView(config);
			this._emptyContentMsg = this.gridAttributeView.emptyMsg();
			this._multiGridAttrSubscriptionList = [];
			this._subscribeEvents();
			this.dnd = new DragDropUtil({ modelEvents: this.modelEvents });
			this.dnd.makeDroppable(this.gridEditContainer, "insertMultiGrid");
			this.landingPageGridDiv = document.getElementsByClassName("xspecs-content-container");
			this.itemColumnModels = [];
			this.gridColumn = new MultiGridAttrColumn();
			this.service = new AttrServiceProvider({ isChangeControlled: true });
		},
		render: function () {
			var that = this;
			that.getItemIds(that.selectedNodes);
			var attrGridOptions = {
				"itemIDs": that.itemIDs,
				"container": that.gridEditContainer,
				"modelEvents": that.modelEvents,
				"appCore": that.appCore,
				"currentTabKey": that.currentTabKey,
			};
			that.gridView = new SpecMultiGridCommonView(attrGridOptions);
			let toolBarConfig = new MultiGridToolBarConfig();
			let actions = toolBarConfig.getCommands();
			that.gridView.setToolBarActions(actions);
			if (that.selectedNodes && that.selectedNodes.length == 0) {
				that._EmptyGrid();
			} else {
				that.isGridEmpty = false;
				that.drawGrid(that.selectedNodes);
			}
		},
		getItemIds: function (selectedNodes) {
			let that = this;
			that.itemIDs = [];
			if (selectedNodes && Array.isArray(selectedNodes) && selectedNodes.length > 0) {
				selectedNodes.forEach(function (item) {
					that.itemIDs.push(item.getID());
				});
			} else {
				if (that.itemColumnModels && that.itemColumnModels.length > 0) {
					that.itemColumnModels.forEach(function (columnModel) {
						that.itemIDs.push(columnModel.getItemId());
					});
				}
			}
		},
		_buildRequestPayload: function (contextNodeModels, arrayOfItemIds) {
			let requestPayload = {};
			requestPayload.lIds = [];
			requestPayload.relIDs = [];
			requestPayload.busIDs = [];
			if (contextNodeModels) {
				if (contextNodeModels && Array.isArray(contextNodeModels) && contextNodeModels.length > 0) {
					contextNodeModels.forEach(function (item) {
						requestPayload.busIDs.push(item.getID());
					});
				}
			} else if (arrayOfItemIds) {
				requestPayload.busIDs = arrayOfItemIds;
			} else {
				requestPayload.busIDs = this.itemIDs;
			}

			requestPayload.plmparameters = "false";
			requestPayload.attributes = "true";
			requestPayload.navigateToMain = "true";
			requestPayload.readonly = "false";
			requestPayload.debug_properties = "";
			return requestPayload;
		},
		drawGrid: function (contextNodeModels, addFromSearch) {
			let that = this;
			//console.time("ExecutionTime");
			that.showLoader(true);
			let requestPayload = that._buildRequestPayload(contextNodeModels);
			let columnsConfig = that.gridColumn.getDefaultColumnsConfig();

			let allColumnConfig = that.getDynamicColumns(columnsConfig);
			return that.service
				.getAttributes(requestPayload)
				.then(function (response) {
					if (response.notification) {
						if (response.notification.type && response.notification.type == "ERROR") {
							Notification.displayNotification({
								eventID: "error",
								title: `${NLS.MaxMultiSelectionLimit} ${response.options.maxMultiSelectionLimit || 20}`,
								msg: response.notification.message || "Error",
							});
						}
					}
					that.itemColumnModels = [];
					let rowArray = that.extractAttributes(response);
					that.loadGrid(allColumnConfig, requestPayload.busIDs);
					if (addFromSearch) {
						setTimeout(function () {
							that._selOrDeselectNodes(requestPayload.busIDs, "add");
						}, 2000);
					}
					that.stopLoader(true);
					//gridView.setFiltersOnColumns(multiDataGrid.columns);
					//console.timeEnd("ExecutionTime");
				})
				.catch(function (error) {
					that.onError(error);
				});
		},
		createGridSearchModel: function (attrValues) {
			var currentNode = new MultiGridItemSearchModel().set(attrValues);
			return currentNode;
		},
		loadGrid: function (columnConfig, busIDs) {
			let that = this;
			that.processColumns(columnConfig);
			that.gridView.setColumns(columnConfig);
			that.gridView.initializeGridViewManager();
			that.gridView.setColumnsOnDatagridView();
			var customRep = {
				"DisplayCombobox": {
					stdTemplate: "enumCombo",
				},
			};
			that.multiDataGrid = that.gridView.render({
				withDefaultColumns: false,
				enableCustomView: false,
				"colHeaderHTMLObjId": "mutiGridAttribute",
				"rowHeaderIndex": -1,
				"colHeaderIndex": 2,
				"contextGridManager": that,
				"customRepresentation": customRep,
			});
			that.addGridEvents();
			that.gridView.gridManager.setExportableColumns(that.exportableColumns);
			
			//IR-1115042
			setTimeout(function () {
				that.renderGridTreeModel();
			}, 100);
			
		},
		addGridEvents: function () {
			let that = this;

			var updateCellEvents = function (e, cellInfos) {
				if (cellInfos.columnIndex) {
					var columnIndex = cellInfos.columnIndex;
				} else {
					var columnIndex = that.multiDataGrid.layout.getDataIndexFromColumnIndex(cellInfos.columnID);
				}
				let attrType = cellInfos.nodeModel.getType();
				var newValue = e.target.dsModel.value;
				if (attrType == "timestamp" && newValue!==undefined) {//IR-1239986 - and condition added for date reset operation in multiedit
					newValue = Utils.convertDateToStandard(newValue);
				}
				var oldValue = cellInfos.nodeModel ? cellInfos.nodeModel.getReferenceValue(columnIndex) : undefined;
				oldValue = oldValue && Array.isArray(oldValue) ? oldValue[0] : oldValue;
				var newVal = typeof newValue === "string" ? newValue.trim() : newValue;
				if (typeof newValue == "boolean") {
					newVal = newValue.toString().toUpperCase();
				}
				if (newVal !== oldValue) {
					if (that.modelEvents) {
						that.modelEvents.publish({ event: "xsr-hide-toolbar-reset-command" + "-" + that.currentTabKey });
						that.modelEvents.publish({
							event: "grid-cell-value-update-" + that.currentTabKey,
							data: { cellInfos: cellInfos, newValue: newVal, oldValue: oldValue, dataIndex: columnIndex },
						});
					}
				} else if (that.modelEvents) {
					that.modelEvents.publish({ event: "xsr-hide-toolbar-reset-command" + "-" + that.currentTabKey });
				}
			};
			//Instead of postEdit, listen to change, which supports keyboard enter
			that.multiDataGrid.addEventListener("change", function (e, cellInfos) {
				if (cellInfos.nodeModel) {
					updateCellEvents(e, cellInfos);
					that.modelEvents.publish({ event: Constants.EVENT_INFORMATION_PANEL_REFRESH });
				}
			});
			/*that.multiDataGrid.addEventListener("postEdit", function(e, cellInfos) {
				   let nodeModel=cellInfos.nodeModel;
				   let attrType=nodeModel.getType();				   
				  if(attrType!="integer"&&attrType!="real"&&attrType!="boolean"&&attrType!="timestamp"){
					  updateCellEvents(cellInfos);
				  }
				  that.modelEvents.publish({ event:Constants.EVENT_INFORMATION_PANEL_REFRESH}); 
			});
			//IR-766899-3DEXPERIENCER2021x-BOM quantity update using tab key
			that.multiDataGrid.getTreeDocument().onNodeModelUpdate(function(event){
				   let nodeModel=event.target;
				   event.stopPropagation();
				   let attrType=nodeModel.getType();
				   let attributeMap=event.data.attributes;				   
				  if(attributeMap&&Object.keys(attributeMap).length>0&&(attrType=="integer"||attrType=="timestamp"||attrType=="real"||attrType=="boolean")){
					  var cellInfos={};
					  for(let key in attributeMap){
						  cellInfos.columnIndex=key; 
						  if(attrType=="timestamp"){
						   cellInfos.cellModel=Utils.convertDateToStandard(attributeMap[key]); 
						  }else{
					        cellInfos.cellModel=attributeMap[key];
						  }
					  }
					  cellInfos.nodeModel=event.target;						  		
					  updateCellEvents(cellInfos);
				  }
				  that.modelEvents.publish({ event:Constants.EVENT_INFORMATION_PANEL_REFRESH}); 
				});*/
		},
		checkAccessFromList: function (accessList, requiredAccess) {
			if (accessList.indexOf("all") >= 0) return true;
			var a = requiredAccess;
			if (Array.isArray(a)) {
				var hasRequiredAccess = true;
				for (var i = 0; i < a.length; i++) {
					var k = a[i];
					if (accessList.indexOf(k) === -1) {
						hasRequiredAccess = false;
						break;
					}
				}
				return hasRequiredAccess;
			} else if (accessList.indexOf(a) >= 0) {
				return true;
			}
		},
		buildCellContent: function (columnHeaderTemplateObj, cellInfos) {
			var context = this;
			var columnConfig = context.multiDataGrid.getColumnOrGroup(cellInfos.columnID);
			let actionContainer = columnHeaderTemplateObj.getElementsByClassName("multigrid-attr-info-container");
			var line1Container = columnHeaderTemplateObj.getElementsByClassName("text-line1");
			var textPart1 = columnHeaderTemplateObj.getElementsByClassName("text-part-1");
			var textPart2 = columnHeaderTemplateObj.getElementsByClassName("text-part-2");

			let line2Container = columnHeaderTemplateObj.getElementsByClassName("text-line2");
			var expandEventAttached = false;
			var cellInfos = cellInfos;
			let objDetails = columnConfig.objectDetails;

			if (objDetails && typeof objDetails == "object") {
				let part1Text = objDetails.partNumber ? objDetails.partNumber + " " : "";
				let part2Text = objDetails.title ? objDetails.title : "";
				textPart1[0].setText(SpecMultiGridUtil.decode_entities(part1Text));
				textPart2[0].setText(SpecMultiGridUtil.decode_entities(part2Text));
				let line3Text = objDetails.revision + " (" + objDetails.state + ")";
				line2Container[0].setText(SpecMultiGridUtil.decode_entities(line3Text));
			}

			actionContainer[0].columnDetails = columnConfig;
			if (actionContainer && !actionContainer[0]._listenerSet) {
				actionContainer[0]._listenerSet = true;
				actionContainer[0].addEventListener("click", function (event) {
					if (this.columnDetails) {
						let columnModel = this.columnDetails;
						let colIndex = context.gridView.getColumnIndex(columnModel);
						context.multiDataGrid.selectColumn(parseInt(colIndex));
						context.gridAttributeView.renderInformationPanel(
							columnModel.itemModel,
							event.currentTarget,
							context.multiDataGrid
						);
					}
				});
			}
		},
		_exportGrid: function () {
			var csvFileName = NLS.Command_MultiEdit + "_" + NLS.label_Attribute;
			this.gridView.exportGrid(csvFileName);
		},

		_addItemsFromSearch: function () {
			let that = this;
			var in_apps_callback = function (searchResult) {
				console.log(searchResult);
				var failureIds = {};
				if (searchResult && searchResult.length > 0) {
					var loader = Mask.maskLoader(that.container, NLS.InsertingLoader);

					var perContri = searchResult.length > 0 ? 100 / searchResult.length : 0;
					var searchModels = [];
					for (var i = 0; i < searchResult.length; i++) {
						loader.update(perContri.toString());
						var lastItem = i === searchResult.length - 1;
						var res = searchResult[i];
						//parse Search Result
						searchModels.push(that.createGridSearchModel(searchResult[i]));
					}
					that.addItemsToView(searchModels, false, true);
				}
				Mask.unmaskLoader(that.container);
				if (searchModels.length == 1) {
					that.displayMsg("success", NLS.Message_AddItemsSingle);
				} else if (searchModels.length > 1) {
					that.displayMsg("success", NLS.Message_AddItemsMulti);
				}
			};

			var itemIDs = that.getItemIds();
			var selectPredicates = [
				"ds6w:label",
				"ds6w:identifier",
				"ds6w:status",
				"ds6wg:revision",
				"ds6w:description",
				"ds6w:modified",
				"ds6w:policy",
				"ds6w:created",
				"ds6w:type",
				"ds6w:responsible",
				"ds6w:realizedChangeAction",
				"ds6w:proposedChangeAction",
				"ds6w:changeRequired",
				"ds6w:changeContext",
				"ds6wg:EnterpriseExtension.V_PartNumber",
			];
			var options = {
				allowedTypes: ["VPMReference"],
				role: "",
				columns: selectPredicates,
				criteria: "VPMReference",
				precondition: "",
				in_apps_callback: in_apps_callback,
				excludeList: that.itemIDs,
			};
			new SearchManager(options).launchSearch(options);
		},
		_printGrid: function () {
			let context = this;
			if (context.multiDataGrid) {
				context.multiDataGrid.openPrintableViewWindow(true);
			}
		},
		syncAttrModels: function (respBody, itemId, nodeModel) {
			let context = this;
			for (var key in respBody) {
				let value = respBody[key];
				if (typeof value == "object" && key !== "errors") {
					var newVal = Array.isArray(respBody[key].value) ? respBody[key].value[0] : respBody[key].value;
					if (key === nodeModel.getSelectable()) {
						let isGMTDate = nodeModel.getDynamicColumnValue("isGMTDate");
						let attrtype = nodeModel.getType();
						if (isGMTDate || attrtype == "timestamp") {
							//IR-1239986 - if condition is added for date reset operation in multiedit
							if(newVal!==undefined){
								newVal = context.getFormattedDate(newVal);
							}
						}
						nodeModel.options.grid[itemId] = newVal;
						nodeModel.updateOptions(nodeModel.options);
					} else {
						let attributeNodeModels = context.gridView.getGridNodes();
						for (let i = 0; i < attributeNodeModels.length; i++) {
							if (key === attributeNodeModels[i].getSelectable()) {
								let isGMTDate = attributeNodeModels[i].getDynamicColumnValue("isGMTDate");
								let attrtype = attributeNodeModels[i].getType();
								if (isGMTDate || attrtype == "timestamp") {
									//IR-1239986 - if condition is added for date reset operation in multiedit
									if(newVal!==undefined){
										newVal = context.getFormattedDate(newVal);
									}
								}
								attributeNodeModels[i].options.grid[itemId] = newVal;
								attributeNodeModels[i].updateOptions(attributeNodeModels[i].options);
								break;
							}
						}
					}
				}
			}
		},
		_addItemsInEmptyGrid: function (idsArray) {
			let that = this;
			that.showLoader(true);
			let requestPayload = that._buildRequestPayload(undefined, idsArray);
			let columnsConfig = that.gridColumn.getDefaultColumnsConfig();
			return that.service
				.getAttributes(requestPayload)
				.then(function (response) {
					that.extractAttributes(response);
					that.selectedNodes = that.selectedItemModels;
					let allColumnsConfig = that.getDynamicColumns(columnsConfig);
					that.loadGrid(allColumnsConfig, requestPayload.busIDs);
					that.stopLoader(true);
				})
				.catch(function (error) {
					that.onError(error);
				});
		},
		_addItemsInExistingGrid: function (selectedNodes) {
			let context = this;
			if (context.rowDetails && context.gridView.getGridNodeCount() > 0) {
				selectedNodes.forEach(function (selNodeModel) {
					let columnCount = context.gridView.gridManager.columns.length;
					let columnConfig = context.gridColumn.getDynamicColumnConfig(selNodeModel);
					context.gridColumn.process.call(context, [columnConfig]);
					context.addColumnItemModel(columnConfig);
					context.gridView.addColumn(columnConfig, columnCount);
					let contextObjId = selNodeModel.getID ? selNodeModel.getID() : selNodeModel.getDynamicColumnValue("itemId");
					context._updateGrid(contextObjId);
				});
				context.gridView.gridManager.setExportableColumns(context.exportableColumns);
			}
		},
		_processAndDropItems: function (data, showLoader) {
			let context = this;
			let dropItems = [];
			var dragDropMsg = function () {
				if (dropItems.length == 1) {
					context.displayMsg("success", NLS.Message_singleDrop);
				} else if (dropItems.length > 1) {
					context.displayMsg("success", NLS.Message_multiDrop);
				}
			};

			let existingItemsCnt = 0;
			if (data.items.length > 0) {
				for (let i = 0; i < data.items.length; i++) {
					let physicalId = data.items[i].id;
					context.getItemIds();
					if (context.itemIDs && context.itemIDs.indexOf(physicalId) == -1) {
						dropItems.push(physicalId);
					} else if (context.itemIDs.length == 0) {
						dropItems.push(physicalId);
					}
					if (context.itemIDs && context.itemIDs.indexOf(physicalId) > -1) {
						existingItemsCnt = existingItemsCnt + 1;
					}
				}
				if (existingItemsCnt > 0) {
					context.displayMsg("info", NLS.Message_ExistingItemsInGrid);
				}
				if (widget.id == data.fromWidget) {
					dragDropMsg();
					return;
				}
				if (dropItems.length > 0 && widget.id != data.fromWidget) {
					//Prevent drag and drop from same widget MySpecs
					if (
						(!context.gridView.gridManager || context.gridView.gridManager.columns.length == 2) &&
						context.isGridEmpty
					) {
						context.isGridEmpty = false;
						context._addItemsInEmptyGrid(dropItems);
						context._selOrDeselectNodes(dropItems, "add");
						dragDropMsg();
					} else if (context.gridView.gridManager.columns && !context.isGridEmpty) {
						let requestPayload = context._buildRequestPayload(undefined, dropItems);
						if (showLoader == undefined || showLoader) context.showLoader(true);
						context.service
							.getAttributes(requestPayload)
							.then(function (response) {
								context.extractAttributes(response);
								context.selectedNodes = context.selectedItemModels;
								context._addItemsInExistingGrid(context.selectedNodes);
								if (showLoader == undefined || showLoader) context.stopLoader(true);
								context._selOrDeselectNodes(dropItems, "add");
							})
							.catch(function (error) {
								context.onError(error);
								context.stopLoader(true);
							});

						dragDropMsg();
					}
				}
			}
		},
		_subscribeEvents: function () {
			var that = this;
			that._multiGridAttrSubscriptionList.push(
				that.modelEvents.subscribe(
					{
						event: "attr-multigrid-item-on-drop",
					},
					function (data) {
						if (data.items.length > 0) {
							that._processAndDropItems(data, true);
						}
					}
				)
			);
			that._multiGridAttrSubscriptionList.push(
				that.coreModelEvents.subscribe(
					{
						event: Constants.RELOAD_MULTIGRID_VIEW,
					},
					function (data) {
						//Render Empty grid
						that.getItemIds();
						let itemIds = that.itemIDs;
						that._renderEmptyGrid();

						//reload grid with effective CA
						if (itemIds && itemIds.length > 0) {
							that.isGridEmpty = false;
							that._addItemsInEmptyGrid(itemIds);
						}
					}
				)
			);
			that._multiGridAttrSubscriptionList.push(
				that.coreModelEvents.subscribe(
					{
						event: Constants.EVENT_GRID_VALUES_UPDATE,
					},
					function (data) {
						if (data.attrName == "PLMEntity.V_Name") {
							let cellInfos = data.cellInfos;
							let columnID = data.cellInfos.columnID;
							//get the column header cell id
							let cellId = that.multiDataGrid.layout.getCellIDFromCoordinates({ rowID: -1, columnID: columnID });
							let cellView = that.multiDataGrid._getViewAt(cellId);
							let colHeaderCellContent = cellView._getReusableContent();
							let textPart1 = colHeaderCellContent.getElementsByClassName("text-part-1");
							let textPart2 = colHeaderCellContent.getElementsByClassName("text-part-2");
							let colConfig = that.multiDataGrid.getColumnOrGroup(columnID);
							if (
								textPart2[0] &&
								data.itemId &&
								data.oldVal &&
								data.newVal &&
								data.itemId == colConfig.objectDetails.id &&
								textPart2[0] &&
								textPart2[0].getText().indexOf(data.oldVal) > -1
							) {
								textPart2[0].setText(textPart2[0].getText().replace(data.oldVal, data.newVal));
								colConfig.objectDetails.title = data.newVal;
								cellView._updateTooltip(that.getColumnHeaderCellTooltip(cellInfos.columnID));
								colConfig.text = that.gridColumn.setColumnText(colConfig.objectDetails);
							}
						}
					}
				)
			);
			//let cellValue=cellInfos.nodeModel.getDynamicColumnValue(c.dataIndex);
			that._multiGridAttrSubscriptionList.push(
				that.coreModelEvents.subscribe(
					{
						event: Constants.EVENT_GRID_ADD_REMOVE_EXT,
					},
					function (data) {
						//get the column header cell id
						let cellId = that.multiDataGrid.layout.getCellIDFromCoordinates({ rowID: -1, columnID: data.columnID });
						let cellView = that.multiDataGrid._getViewAt(cellId);
						let colHeaderCellContent = cellView._getReusableContent();
						let textPart1 = colHeaderCellContent.getElementsByClassName("text-part-1");
						let colConfig = that.multiDataGrid.getColumnOrGroup(data.columnID);
						if (
							data.interfaceName == Constants.INTERFACE_ENTERPRISE_EXT &&
							textPart1[0] &&
							data.itemId &&
							data.itemId == colConfig.objectDetails.id &&
							data.operation == "remove"
						) {
							textPart1[0].setText("");
							colConfig.objectDetails.partNumber = "";
							cellView._updateTooltip(that.getColumnHeaderCellTooltip(data.columnID));
							colConfig.text = that.gridColumn.setColumnText(colConfig.objectDetails);
						}
					}
				)
			);
			that._multiGridAttrSubscriptionList.push(
				that.modelEvents.subscribe(
					{
						event: "grid-cell-value-update-" + that.currentTabKey,
					},
					function (input) {
						var newVal = input.newValue;
						var oldVal = input.oldValue;
						var nodeModel = input.cellInfos.nodeModel;
						var itemId = input.dataIndex;
						let columnConfig = that.gridView.findColumn(itemId);
						Mask.maskLoader(that.container, NLS.UpdatingLoader);
						var notify = function (event, msg) {
							if ("success" === event) {
								that.gridView.getTreeDocument().acceptChanges();
								that.modelEvents.publish({ event: "xsr-hide-toolbar-reset-command" + "-" + that.currentTabKey });
							} else {
								that.modelEvents.publish({ event: "xsr-show-toolbar-reset-command" + "-" + that.currentTabKey });
							}
							Notification.displayNotification({ eventID: event, msg: msg });
							Mask.unmaskLoader(that.container);
						};
						var updateAttr = function (
							cellInfos,
							attrName,
							attrValue,
							oldVal,
							attrSelectable,
							extensionName,
							updateTo
						) {
							that.gridView.unselectAll();
							nodeModel.select();
							that.service
								.updateAndSyncAttributes(
									itemId,
									[{ attribute: attrName, value: attrValue, attrSelectable: attrSelectable, extension: extensionName }],
									nodeModel,
									updateTo
								)
								.then(function (respBody) {
									that.coreModelEvents.publish({
										event: Constants.EVENT_GRID_VALUES_UPDATE,
										data: {
											cellInfos: cellInfos,
											attrName: attrName,
											newVal: attrValue,
											oldVal: oldVal,
											itemId: itemId,
											modifiedTime: respBody.modified ? respBody.modified.value[0] : undefined,
										},
									});

									that.syncAttrModels(respBody, itemId, nodeModel);
									that.gridView.getTreeDocument().acceptChanges();
									notify("success", NLS.Notify_Updated);
								})
								.catch(function (err) {
									Mask.unmaskLoader(that.container);
									let errCode;
									if (err && typeof err == "object" && err.length == 2 && err[1].message) {
										errCode = err[1].code;
										err = err[1].message;
									}
									if (errCode && errCode == "1500249") {
										var nlsmessage = NLS.replace(NLS.get("Failure_Update_AccessRight"), {
											objTitle: columnConfig.objectDetails ? columnConfig.objectDetails.title : "",
											objRev: columnConfig.objectDetails ? columnConfig.objectDetails.revision : "",
										});
									} else {
										var nlsmessage = NLS.replace(NLS.get("Failure_Update"), {
											objTitle: columnConfig.objectDetails ? columnConfig.objectDetails.title : "",
											objRev: columnConfig.objectDetails ? columnConfig.objectDetails.revision : "",
											error: err,
										});
									}
									console.log(err);
									notify("error", nlsmessage);
								});
						};
						var validateValue = function (newValue, attrType, nodeModel) {
							let columnName = nodeModel.getDisplayName();
							if (!newValue && nodeModel.isMandatory()) {
								notify("error", NLS.replace(NLS.get(NLS.Message_FieldMandatory), { field: columnName }));
								return false;
							}
							if (attrType == "string" && newValue.length > parseInt(nodeModel.getMaxLength())) {
								notify(
									"error",
									NLS.replace(NLS.get(NLS.Message_MaxLengthLimit), {
										field: columnName,
										count: nodeModel.getMaxLength(),
									})
								);
								return false;
							}
							return true;
						};
						let updateTo = "bus";
						let attrValue = newVal;
						let attrName = nodeModel.getPath();
						let attrSelectable = nodeModel.getSelectable();
						let extensionName = nodeModel.getExtensionName();
						let attrType = nodeModel.getType();
						let res = validateValue(attrValue, attrType, nodeModel);
						if (res){
							if(attrValue===undefined){//IR-1239986 - added for date reset operation in multiedit
							attrValue="";
						    }
							updateAttr(
								input.cellInfos,
								attrName,
								attrValue.toString(),
								oldVal,
								attrSelectable,
								extensionName,
								updateTo
							);
						}
					}
				)
			);
			that._multiGridAttrSubscriptionList.push(
				that.modelEvents.subscribe({ event: "multigrid-toolbar-action-click-Attributes" }, function (data) {
					if (data.cmdName) {
						let res = that._emptyGridCheck();
						let errMsg = NLS.replace(NLS.get(NLS.Message_CmdEmptyGridCheck), { operation: data.cmdNlsName });
						switch (data.cmdName) {
							case "AddItems":
								that._addItemsFromSearch();
								break;
							case "RemoveItems":
								if (!res) {
									that._removeItems(data.cmdNlsName);
								} else {
									that.displayMsg("error", errMsg);
								}

								break;
							case "AddExtension":
								if (!res) {
									that._addExtensions(data.cmdNlsName);
								} else {
									that.displayMsg("error", errMsg);
								}
								break;
							case "RemoveExtension":
								if (!res) {
									that._removeExtensions(data.cmdNlsName);
								} else {
									that.displayMsg("error", errMsg);
								}
								break;
							case "Print":
								if (!res) {
									that._printGrid();
								} else {
									that.displayMsg("error", errMsg);
								}
								break;
							case "Export":
								if (!res) {
									that._exportGrid();
								} else {
									that.displayMsg("error", errMsg);
								}
								break;
						}
					}
				})
			);

			that._multiGridAttrSubscriptionList.push(
				that.coreModelEvents.subscribe(
					{
						event: Constants.EVENT_GRID_NODES_SELECTION,
					},
					function (data) {
						let contextNodeModels = data.contextNodeModels;
						if (data.commandId == Constants.TOOLBAR_CMD_MULTIGRID) {
							//triptychManager.setCurrentTabKey(that.currentTabKey);
							if (data.operation == "add") {
								setTimeout(function () {
									that.addItemsToView(contextNodeModels);
								}, 2000);
							} else if (data.operation == "remove") {
								that.removeItemFromView(contextNodeModels);
							}
						}
					}
				)
			);
		},
		_updateGrid: function (itemId) {
			let context = this;
			let attributeNodeModels = context.gridView.getGridNodes();
			let updatedAttrsCount = 0;
			for (var key in context.rowDetails) {
				let existingAttrModel = "";
				if (context.rowDetails.hasOwnProperty(key)) {
					for (let i = 0; i < attributeNodeModels.length; i++) {
						let attrModel = attributeNodeModels[i];
						if (attrModel.getName() == key) {
							existingAttrModel = attrModel;
							break;
						}
					}
					let value = context.rowDetails[key];
					let physicalIds = context.rowDetails[key].itemIds;
					if (existingAttrModel) {
						let objectIds = existingAttrModel.options.grid["itemIds"];
						let objModifiable = value[itemId + "_modifyAccess"];
						let attrReadonly = value[itemId + "_readOnly"];
						updatedAttrsCount = updatedAttrsCount + 1;
						if (objModifiable && !attrReadonly) {
							for (let prop in value) {
								existingAttrModel.options.grid[prop] = value[prop];
							}
						} else {
							existingAttrModel.options.grid[itemId] = value[itemId];
							existingAttrModel.options.grid[itemId + "_modifyAccess"] = value[itemId + "_modifyAccess"];
							existingAttrModel.options.grid[itemId + "_readOnly"] = value[itemId + "_readOnly"];
						}
						if (objectIds && objectIds.length > 0) {
							objectIds.forEach(function (objId) {
								if (existingAttrModel.options.grid["itemIds"].indexOf(objId) == -1)
									existingAttrModel.options.grid["itemIds"].push(objId);
							});
						} else {
							existingAttrModel.options.grid["itemIds"] = context.rowDetails[key]["itemIds"];
						}
						existingAttrModel.updateOptions(existingAttrModel.options);
						context.addColumnExtensionConfig(existingAttrModel, physicalIds);
					} else {
						let rowAttr = context._buildAttrObject(key);
						var nodeModel = context.attrGridModel.createListNode(rowAttr);
						context.gridView.addRootNodes(nodeModel, false);
						updatedAttrsCount = updatedAttrsCount + 1;
						context.addColumnExtensionConfig(nodeModel, nodeModel.getItemIDs());
					}
				}
			}
			return updatedAttrsCount;
		},
		_addExtensions: function (cmdNlsName) {
			var onSuccess = function (itemId) {
				console.log(itemId);
				context.showLoader(false);
				if (itemId) {
					let requestPayload = context._buildRequestPayload(undefined, [itemId]);
					return context.service
						.getAttributes(requestPayload)
						.then(function (response) {
							context.extractAttributes(response);
							if (context.rowDetails && context.gridView.getGridNodeCount() > 0) {
								let updatedAttrsCount = context._updateGrid(itemId);
								if (updatedAttrsCount) {
									let nlsMessage =
										updatedAttrsCount == 1 ? NLS.Message_AddExtSuccessSingle : NLS.Message_AddExtRemovalSuccessMulti;
									context.displayMsg("success", nlsMessage);
								}
							}
							context.stopLoader(false);
						})
						.catch(function (error) {
							context.displayMsg("error", NLS.Error_Mesage_ExtAddFailure);
							context.stopLoader(false);
						});
				}
			};
			let context = this;
			let selColsConfig = context.gridView.getSelectedColumnIdentifiers();
			let colItemConfig = [];
			let errFlag = false;
			if (selColsConfig.length == 0) {
				let nlsmessage = NLS.replace(NLS.get("Error_Message_NoSelAddExt"), {
					cmdName: cmdNlsName,
				});
				context.displayMsg("error", nlsmessage);
				errFlag = true;
				return;
			} else if (selColsConfig.length > 0) {
				let isTreeColumn = false;
				for (let key in selColsConfig) {
					let colDetails = selColsConfig[key];
					if (colDetails.dataIndex == "tree" || colDetails.dataIndex == "extensionDispName") {
						isTreeColumn = true;
						errFlag = true;
						break;
					}
					colItemConfig.push(colDetails);
				}

				if (isTreeColumn) {
					errFlag = true;
					let nlsmessage = NLS.replace(NLS.get("Error_Message_NoAttributeColumnExt"), {
						cmdName: cmdNlsName,
					});
					context.displayMsg("error", nlsmessage);
					return;
				} else if (selColsConfig.length > 1) {
					let nlsmessage = NLS.replace(NLS.get("Error_Message_SingleSelExt"), {
						cmdName: cmdNlsName,
					});
					context.displayMsg("error", nlsmessage);
					errFlag = true;
					return;
				}
			}
			if (!errFlag) {
				let objectId = colItemConfig[0].dataIndex;
				//fetch the type of selected model
				let objectType = context.itemColumnModels.find((model) => model.getID() === objectId).options.grid.itemType;
				let options = { itemId: objectId, itemType: objectType };
				context.service
					.getItemInfo(colItemConfig[0].dataIndex, "VPMReference")
					.then(function (responseData) {
						let itemDetails = responseData.member[0];
						let currentAccess = itemDetails.access || "";
						if (!currentAccess) {
							context.displayMsg("error", NLS.Error_Mesage_ExtAddAccessFailure);
							return;
						} else {
							let hasAccess = context.checkAccessFromList(currentAccess, ["modify"]);
							if (hasAccess) {
								context.addExt = new GridAddExtensions(
									options,
									onSuccess,
									function onCloseDlg() {
										//Mask.unmask(context.gridEditContainer);
										//that.onRefresh();
									},
									function onFailure(error) {
										context.displayMsg("error", NLS.Error_Mesage_ExtAddFailure);
									}
								);
							} else {
								context.displayMsg("error", NLS.Error_Mesage_ExtAddAccessFailure);
								return;
							}
						}
					})
					.catch(function (err) {
						console.log(err);
						context.displayMsg("error", NLS.Error_Mesage_ExtAddFailure);
					});
			} //closure of if
		},
		_removeExtensions: function (cmdNlsName) {
			let that = this;
			var okCallback = function () {
				let reqPayload = {};
				reqPayload.interfaces = interfacesToBeRemoved;
				reqPayload.phyIDS = [itemModels[0].dataIndex];
				that.showLoader(false);
				that.service
					.removeExtensions(reqPayload)
					.then(function (respBody) {
						let attrCount = 0;
						interfacesToBeRemoved.forEach(function (interfaceName) {
							let attributeModels = objectExtensionModels[interfaceName];
							attrCount = attrCount + (attributeModels ? attributeModels.length : 0);
						});
						interfacesToBeRemoved.forEach(function (extension) {
							let isItfRowsRemoved = that.checkAndRemoveAttrExtModelInGrid(
								extension,
								columnConfig,
								objectExtensionModels
							);
							if (isItfRowsRemoved) {
								delete objectExtensionModels[extension];
							} else {
								that.updateAttrModels(objectExtensionModels, extension, itemModels[0].dataIndex);
								delete objectExtensionModels[extension];
							}
						});
						if (interfacesToBeRemoved.indexOf(Constants.INTERFACE_ENTERPRISE_EXT) > -1) {
							that.coreModelEvents.publish({
								event: Constants.EVENT_GRID_ADD_REMOVE_EXT,
								data: {
									columnID: columnID,
									itemId: itemModels[0].dataIndex,
									interfaceName: Constants.INTERFACE_ENTERPRISE_EXT,
									operation: "remove",
								},
							});
						}
						if (attrCount == 1) {
							that.displayMsg("success", NLS.Message_ExtRemovalSuccessSingle);
						} else if (attrCount > 1) {
							that.displayMsg("success", NLS.Message_ExtRemovalSuccessMulti);
						}
						that.stopLoader(false);
					})
					.catch(function (err) {
						if (err && err.error && err.error.MessageException) {
							err = err.error.MessageException;
						}
						var nlsmessage = NLS.replace(NLS.get("Error_Mesage_ExtRemFailure"), {
							error: err,
						});
						console.log(err);
						that.stopLoader(false);
						that.displayMsg("error", nlsmessage);
					});
			};

			var selNodes = that.gridView.getTreeDocument().getSelectedNodes();
			var selColsConfig = that.gridView.getSelectedColumnIdentifiers();
			let itemModels = [];
			let objectExtensionModels;
			let columnID;
			let interfacesToBeRemoved = [];
			let columnConfig;
			let objDetails;
			let errFlag = false;
			if (selColsConfig.length == 0) {
				let nlsmessage = NLS.replace(NLS.get("Error_Message_NoSelExt"), {
					cmdName: cmdNlsName,
				});
				that.displayMsg("error", nlsmessage);
				errFlag = true;
				return;
			} else if (selColsConfig.length > 0) {
				let isTreeColumn = false;
				for (let key in selColsConfig) {
					let colDetails = selColsConfig[key];
					if (colDetails.dataIndex == "tree" || colDetails.dataIndex == "extensionDispName") {
						isTreeColumn = true;
						errFlag = true;
						break;
					}
					itemModels.push(colDetails);
				}
				if (isTreeColumn) {
					errFlag = true;
					let nlsmessage = NLS.replace(NLS.get("Error_Message_NoAttributeColumnExt"), {
						cmdName: cmdNlsName,
					});
					that.displayMsg("error", nlsmessage);
					return;
				} else if (selNodes.length == 0) {
					let nlsmessage = NLS.replace(NLS.get("Error_Message_NoSelExt"), {
						cmdName: cmdNlsName,
					});
					that.displayMsg("error", nlsmessage);
					errFlag = true;
					return;
				} else if (selColsConfig.length > 1) {
					let nlsmessage = NLS.replace(NLS.get("Error_Message_MultiSelRemExt"), {
						cmdName: cmdNlsName,
					});
					that.displayMsg("error", nlsmessage);
					errFlag = true;
					return;
				}
			}
			if (selColsConfig.length == 1) {
				let objModifiableKey = itemModels[0].dataIndex + "_modifyAccess";
				let attrReadOnlyKey = itemModels[0].dataIndex + "_readOnly";
				columnID = itemModels[0].columnIndex;
				columnConfig = that.multiDataGrid.getColumnOrGroup(columnID);
				objDetails = columnConfig.objectDetails;
				objectExtensionModels = columnConfig.extensionAttrModels;

				for (let i = 0; i < selNodes.length; i++) {
					let isObjModifiable = selNodes[i].getDynamicColumnValue(objModifiableKey);
					let isattrReadOnly = selNodes[i].getDynamicColumnValue(attrReadOnlyKey);
					if (!isObjModifiable && isattrReadOnly) {
						that.displayMsg(
							"error",
							NLS.replace(NLS.get(NLS.Error_Message_NoModifyAddRemExt), {
								objtitle: objDetails.title,
								objrevision: objDetails.revision,
								operation: cmdNlsName,
							})
						);
						errFlag = true;
						break;
					} else if (isObjModifiable == undefined && isattrReadOnly == undefined) {
						that.displayMsg(
							"error",
							NLS.replace(NLS.get(NLS.Error_Message_NAAttribute), { attributeName: selNodes[0].getDisplayName() })
						);
						errFlag = true;
						break;
					} else {
						if (selNodes[i].getExtensionName() && !selNodes[i].isDeploymentExtension()) {
							if (interfacesToBeRemoved.indexOf(selNodes[i].getExtensionName()) == -1) {
								interfacesToBeRemoved.push(selNodes[i].getExtensionName());
							}
						} else if (!selNodes[i].getExtensionName()) {
							that.displayMsg(
								"error",
								NLS.replace(NLS.get(NLS.Error_Message_AttrNoExt), { attributeName: selNodes[i].getDisplayName() })
							);
							errFlag = true;
							break;
						} else if (selNodes[i].getExtensionName() && selNodes[i].isDeploymentExtension()) {
							that.displayMsg(
								"error",
								NLS.replace(NLS.get(NLS.Error_Message_AttrDeploymentExt), {
									attributeName: selNodes[i].getDisplayName(),
								})
							);
							errFlag = true;
							break;
						}
					}
				}
			}
			if (!errFlag) {
				that.service
					.getItemInfo(itemModels[0].dataIndex, "VPMReference")
					.then(function (responseData) {
						let itemDetails = responseData.member[0];
						let currentAccess = itemDetails.access || "";
						if (!currentAccess) {
							that.displayMsg("error", NLS.Error_Mesage_ExtRemoveAccessFailure);
							return;
						} else {
							let hasAccess = that.checkAccessFromList(currentAccess, ["modify"]);
							if (hasAccess) {
								that.gridAttributeView.confirmationBox(
									objDetails,
									objectExtensionModels,
									interfacesToBeRemoved,
									okCallback,
									that.gridEditContainer
								);
							} else {
								that.displayMsg("error", NLS.Error_Mesage_ExtRemoveAccessFailure);
								return;
							}
						}
					})
					.catch(function (err) {
						console.log(err);
						var nlsmessage = NLS.replace(NLS.get("Error_Mesage_ExtRemFailure"), {
							error: err,
						});
						console.log(err);
						that.displayMsg("error", nlsmessage);
					});
			}
		},
		updateAttrModels: function (objectExtensionModels, extension, itemId) {
			let attrModels = objectExtensionModels[extension];
			if (attrModels && attrModels.length > 0) {
				attrModels.forEach(function (attrModel) {
					delete attrModel.options.grid[itemId];
					delete attrModel.options.grid[itemId + "_readOnly"];
					delete attrModel.options.grid[itemId + "_modifyAccess"];
					attrModel.updateOptions(attrModel.options);
				});
			}
		},
		_removeItems: function (cmdNlsName) {
			let context = this;
			if (context.gridView) {
				let selColsConfig = context.gridView.getSelectedColumnIdentifiers();
				if (selColsConfig && selColsConfig.length > 0) {
					let removedItemModels = [];
					let isTreeColumn = false;
					for (let key in selColsConfig) {
						let colDetails = selColsConfig[key];
						if (colDetails.dataIndex == "tree" || colDetails.dataIndex == "extensionDispName") {
							isTreeColumn = true;
							break;
						}
						removedItemModels.push(colDetails.dataIndex);
					}

					if (isTreeColumn) {
						let nlsmessage = NLS.replace(NLS.get("Error_Message_NoAttributeColumnExt"), {
							cmdName: cmdNlsName,
						});
						context.displayMsg("error", nlsmessage);
						return;
					} else {
						if (removedItemModels.length > 0) {
							let triptychRightItemId = context.triptychManager.getItemId();
							if (triptychRightItemId && removedItemModels.indexOf(triptychRightItemId) > -1) {
								context.triptychManager.hideRightPanel();
							}
							removedItemModels.forEach(function (dataIndex) {
								context._removeColumn(dataIndex);
							});
							context._selOrDeselectNodes(removedItemModels, "remove");
							if (removedItemModels.length == 1) {
								context.displayMsg("success", NLS.Message_SuccesfulItemRemovalSingle);
							} else if (removedItemModels.length > 1) {
								context.displayMsg("success", NLS.Message_SuccesfulItemRemovalMulti);
							}
						}
					}
					/*if(removedItemModels.length>0)
					    context._removeItemSuccesfulNotification(removedItemModels);*/
				} else {
					Notification.displayNotification({
						eventID: "error",
						msg: NLS.Message_NoColumnSelection,
					});
				}
				context.gridView.unSelectAll();
				context._EmptyGrid();
			}
		},

		_emptyGridCheck: function (cmdName) {
			if (!this.gridView.gridManager || this.gridView.gridManager.columns.length == 2) {
				return true;
			} else {
				return false;
			}
		},
		validateItem: function (contextNodeModels) {
			let isPhysicalPrd = true;
			contextNodeModels.some(function (node) {
				if (!TypeUtils.isPhysicalProduct(node.getTypeActualName())) {
					isPhysicalPrd = false;
					return isPhysicalPrd;
				}
			});
			return isPhysicalPrd;
		},
		displayMsg: function (type, msg) {
			Notification.displayNotification({
				eventID: type,
				msg: msg,
			});
		},

		addItemsToView: function (nodeModels, showLoader, addFromSearch) {
			let context = this;
			let isPhysicalProduct = context.validateItem(nodeModels);
			if (!isPhysicalProduct) {
				context.displayMsg("error", NLS.Error_Message_IncompatibleObjects);
				return;
			}
			let contextNodeModels = [];
			let nodeModelsIds = [];
			for (let i = 0; i < nodeModels.length; i++) {
				let physicalId = nodeModels[i].getID();
				context.getItemIds();
				if (context.itemIDs && context.itemIDs.indexOf(physicalId) == -1) {
					contextNodeModels.push(nodeModels[i]);
					nodeModelsIds.push(physicalId);
				} else if (context.itemIDs.length == 0) {
					contextNodeModels.push(nodeModels[i]);
					nodeModelsIds.push(physicalId);
				}
			}
			if (contextNodeModels.length > 0) {
				if (
					(!context.gridView.gridManager || context.gridView.gridManager.columns.length == 2) &&
					context.isGridEmpty
				) {
					context.isGridEmpty = false;
					context.selectedNodes = contextNodeModels;
					context.getItemIds(contextNodeModels);
					context.drawGrid(contextNodeModels, addFromSearch);
				} else if (context.gridView.gridManager.columns && !context.isGridEmpty) {
					let requestPayload = context._buildRequestPayload(contextNodeModels);
					if (showLoader == undefined || showLoader) context.showLoader(true);
					return context.service
						.getAttributes(requestPayload)
						.then(function (response) {
							if (context.rowDetails && context.gridView.getGridNodeCount() > 0) {
								context.extractAttributes(response);
								context._addItemsInExistingGrid(contextNodeModels);
							}
							if (addFromSearch) {
								context._selOrDeselectNodes(nodeModelsIds, "add");
							}
							if (showLoader == undefined || showLoader) context.stopLoader(true);
						})
						.catch(function (error) {
							context.onError(error);
							context.stopLoader(true);
						});
				}
			}
		},

		removeAttrExtensionModel: function (column) {
			let context = this;
			if (column && typeof column == "object" && column.extensionAttrModels) {
				let extensionAttrModels = column.extensionAttrModels;
				for (var extension in extensionAttrModels) {
					context.checkAndRemoveAttrExtModelInGrid(extension, column, extensionAttrModels);
				}
			}
		},
		checkAndRemoveAttrExtModelInGrid: function (extension, column, extensionAttrModels) {
			let context = this;

			let gridColumns = context.gridView.gridManager.columns;
			let extensionAvailableCounter = 0;
			gridColumns.forEach(function (gridColumn) {
				if (
					gridColumn.dataIndex !== column.dataIndex &&
					gridColumn.extensionAttrModels &&
					gridColumn.extensionAttrModels[extension]
				) {
					extensionAvailableCounter += 1;
				}
			});
			if (extensionAvailableCounter == 0) {
				let extAttrModels = extensionAttrModels[extension];
				this.gridView.removeRootNodes(extAttrModels);
				return true;
			} else {
				return false;
			}
		},
		addColumnExtensionConfig: function (attrModel, physicalIds) {
			let objectIds = attrModel.getItemIDs();
			let context = this;
			var addExtensionAttrModels = function (itemId) {
				let column = context.gridView.findColumn(itemId);
				let extensionName = attrModel.getExtensionName();
				if (column && typeof column == "object" && extensionName) {
					if (column.extensionAttrModels) {
						let extensionObject = column.extensionAttrModels;
						if (extensionObject[extensionName]) {
							extensionObject[extensionName].push(attrModel);
						} else {
							extensionObject[extensionName] = [attrModel];
						}
					} else {
						column.extensionAttrModels = {};
						column.extensionAttrModels[extensionName] = [attrModel];
					}
				}
			};
			if (physicalIds) {
				physicalIds.forEach(function (physicalId) {
					addExtensionAttrModels(physicalId);
				});
			}
		},
		removeItemFromView: function (contextNodeModels) {
			let context = this;
			context.showLoader(true);
			let gridColumns = context.gridView.gridManager ? context.gridView.gridManager.columns : 0;
			if (
				contextNodeModels &&
				Array.isArray(contextNodeModels) &&
				contextNodeModels.length &&
				gridColumns.length >= 2
			) {
				context.updateItemIdsonAttrModel(contextNodeModels);
				let removedItemModels = [];
				contextNodeModels.forEach(function (contextNodeModel) {
					let contextObjectId = contextNodeModel.getID();
					let removedItemModel = context._removeColumn(contextObjectId);
					removedItemModels.push(contextObjectId);
				});
				if (removedItemModels.length > 0) {
					let triptychRightItemId = context.triptychManager.getItemId();
					if (triptychRightItemId && removedItemModels.indexOf(triptychRightItemId) > -1) {
						context.triptychManager.hideRightPanel();
					}
					//context._removeItemSuccesfulNotification(removedItemModels);
					//context._selOrDeselectNodes(removedItemModels,'remove');
				}
				context.gridView.unSelectAll();
				context._EmptyGrid();
			}
			context.stopLoader(true);
		},
		_selOrDeselectNodes: function (affectedNodes, op) {
			let context = this;
			context.coreModelEvents.publish({
				event: Constants.EVENT_GRID_NODE_SELORDESELECT,
				data: { nodes: affectedNodes, operation: op },
			});
		},
		_EmptyGrid: function () {
			let context = this;

			if (context.gridView.gridManager == undefined) {
				context.gridAttributeView._showEmptyView();
				context.isGridEmpty = true;
			} else if (context.gridView.gridManager.columns && context.gridView.gridManager.columns.length == 2) {
				context._renderEmptyGrid();
				context.gridAttributeView._showEmptyView();
			}
		},
		_renderEmptyGrid: function () {
			let context = this;
			let attrColumnExist = context.gridView.findColumn("tree");
			//that.gridView.removeColumns(["tree"]);
			if (attrColumnExist && context.gridView.multigrid) {
				context.isGridEmpty = true;
				context.itemColumnModels = [];
				context.multiDataGrid.destroy();
				context.gridView.gridManager.destroy();
				context.gridView.multigrid.destroy();
				let attrNodeModels = context.gridView.getGridNodes();
				if (attrNodeModels.length > 0) {
					context.gridView.removeRootNodes(attrNodeModels);
				}
			}
		},
		_removeColumn: function (contextObjectId) {
			let context = this;
			let column = context.gridView.findColumn(contextObjectId);
			let removedItemModel;
			for (let i = 0; i < context.itemColumnModels.length; i++) {
				if (contextObjectId == context.itemColumnModels[i].getItemId()) {
					removedItemModel = context.itemColumnModels[i];
					context.itemColumnModels.splice(i, 1);
					break;
				}
			}
			context.removeAttrExtensionModel(column);
			context.gridView.removeColumns([contextObjectId]);
			return removedItemModel;
		},
		updateItemIdsonAttrModel: function (contextNodeModels) {
			let context = this;
			if (context.gridView.getGridNodeCount() > 0) {
				let attrNodeModel = context.gridView.getGridNodes();
				contextNodeModels.forEach(function (nodeModel) {
					let objectId = nodeModel.getID();
					for (let i = 0; i < attrNodeModel; i++) {
						if (objectId && attrNodeModel.getItemIDs().length > 0) {
							let itemIdsArr = attrNodeModel.getItemIDs();
							itemIdsArr.splice(itemIdsArr.indexOf(objectId), 1);
							attrNodeModel.setItemIDs(itemIdsArr);
						}
					}
				});
			}
		},
		processColumns: function (cols) {
			this.columnCharValidationList = {};
			this.exportableColumns = [];
			this.columns = this.gridColumn.process.call(this, cols);
		},
		showLoader: function (maskLandingPage) {
			let loaderMessage = NLS.Message_Loading;
			Mask.maskLoader(this.gridEditContainer, loaderMessage);
			if (maskLandingPage) Mask.mask(this.landingPageGridDiv[0]);
		},
		columnHeaderHTMLObject: function () {
			var multiGridAttrContainer = UWA.Element("div", {
				"class": "multigrid-attr-header-content-container",
			});

			var textContainer = UWA.Element("div", {
				"class": "multigrid-attr-header-text-container",
			});
			textContainer.inject(multiGridAttrContainer);
			var textContentLine1 = UWA.Element("div", {
				"class": "text-line1",
			});
			var textPart1 = UWA.Element("span", {
				"class": "text-part-1",
			});
			var textPart2 = UWA.Element("span", {
				"class": "text-part-2",
			});
			textPart1.inject(textContentLine1);
			textPart2.inject(textContentLine1);
			textContentLine1.inject(textContainer);

			var textContentLine2 = UWA.Element("span", {
				"class": "text-line2",
			});
			textContentLine2.inject(textContainer);

			var rightActionsContainer = UWA.Element("div", {
				"class": "multigrid-attr-header-right-actions-container",
			});
			rightActionsContainer.inject(multiGridAttrContainer);
			/*var infoContainer = UWA.Element('span',{
			            'class' : 'multigrid-attr-info-container fonticon fonticon-info'
			          });*/
			let desktopInfoIconClass = "multigrid-attr-info-container " + Constants.ICON_INFORMATION_DESKTOP;
			// let mobileInfoIconClass='multigrid-attr-info-container '+Constants.ICON_INFORMATION_MOBILE;
			let isMobile = RequestUtil.getTouchMode();
			var infoContainer = UWA.Element("span", {
				"class": desktopInfoIconClass,
			});
			if (isMobile) {
				infoContainer.style.fontSize = "22px";
				infoContainer.style.paddingTop = "50%";
			}
			infoContainer.tooltipInfos = new WUXTooltipModel({ shortHelp: NLS.label_Information });
			infoContainer._listenerSet = false;
			infoContainer.inject(rightActionsContainer);

			return multiGridAttrContainer;
		},
		stopLoader: function (unMaskLandingPage) {
			Mask.unmaskLoader(this.gridEditContainer);
			if (unMaskLandingPage) Mask.unmask(this.landingPageGridDiv[0]);
		},

		getDynamicColumns: function (attrDefColumnConfig) {
			let that = this;
			if (that.selectedNodes && that.selectedNodes.length > 0 && attrDefColumnConfig) {
				that.selectedNodes.forEach(function (item) {
					attrDefColumnConfig.push(that.gridColumn.getDynamicColumnConfig(item));
				});
			}
			return attrDefColumnConfig;
		},
		getColumnHeaderCellTooltip: function (columnID) {
			let context = this;
			let columnConfig = context.multiDataGrid.getColumnOrGroup(columnID);
			let objDetails = columnConfig.objectDetails ? columnConfig.objectDetails : undefined;
			if (objDetails) {
				let tooltip = objDetails.partNumber ? objDetails.partNumber : "";
				tooltip = tooltip ? tooltip + " " + objDetails.title : objDetails.title;
				tooltip = tooltip + "\n" + objDetails.revision + " (" + objDetails.state + " )";
				return { shortHelp: tooltip };
			}
		},

		setCommonProperties: function (objectDetails) {
			var attrDetails = {};
			attrDetails.type = objectDetails.type ? objectDetails.type : undefined;
			attrDetails.multivalue = objectDetails.multivalue ? objectDetails.multivalue : undefined;
			attrDetails.name = objectDetails.name ? objectDetails.name : undefined;
			attrDetails.displayName = objectDetails.nls ? objectDetails.nls : undefined;
			attrDetails.selectable = objectDetails.selectable ? objectDetails.selectable : undefined;
			attrDetails.UIPosition = objectDetails.UIPosition ? objectDetails.UIPosition : undefined;
			if (objectDetails.mandatory) {
				attrDetails.mandatory = objectDetails.mandatory;
			} else {
				attrDetails.mandatory = false;
			}
			attrDetails.path = objectDetails.path ? objectDetails.path : undefined;
			attrDetails.multiline = objectDetails.multiline ? objectDetails.multiline : false;
			attrDetails.maxlength = objectDetails.maxlength ? objectDetails.maxlength : undefined;
			attrDetails.range = objectDetails.range ? objectDetails.range : undefined;
			attrDetails.rangeNLS = objectDetails.rangeNLS ? objectDetails.rangeNLS : undefined;
			return attrDetails;
		},
		setDimensionProperties: function (objectDetails, attrDetails) {
			attrDetails.dimension = objectDetails.dimension ? objectDetails.dimension : undefined;
			attrDetails.dimensionType = objectDetails.dimensionType ? objectDetails.dimensionType : undefined;
			attrDetails.unitName = objectDetails.unitName ? objectDetails.unitName : undefined;
		},

		computeAttrValue: function (attrDetails) {
			let ctx = this;
			let computedValue = "";
			let isGMTDate =
				typeof attrDetails.value == "object" &&
				attrDetails.value[0].endsWith(":GMT") &&
				attrDetails.value[0].indexOf("@") > -1;

			if (isGMTDate) {
				computedValue = ctx.getFormattedDate(attrDetails.value[0]);
			} else if (attrDetails.value && Array.isArray(attrDetails.value)) {
				if (attrDetails.value.length == 0) {
					computedValue = "";
				} else if (attrDetails.value.length == 1) {
					if (attrDetails.type == "boolean" && attrDetails.readOnly == true && attrDetails.value) {
						if (attrDetails.value[0].toUpperCase() == "TRUE") {
							return NLS.label_TRUE;
						} else if (attrDetails.value[0].toUpperCase() == "FALSE") {
							return NLS.label_FALSE;
						}
					}
					attrDetails.value.forEach(function (arrayValue) {
						let newVal = arrayValue;
						if(attrDetails.hasOwnProperty("dimension")){
							newVal = newVal + " " + attrDetails.dimension;
						}
						computedValue = computedValue ? computedValue + " , " + newVal : newVal;
					});
				} else if(attrDetails.value.length > 1) {
					// Added to address: IR-1108946-3DEXPERIENCER2024x
					attrDetails.value.forEach(function (arrayValue) {
						computedValue = computedValue ? computedValue + " , " + arrayValue : arrayValue;
					});
				}
			} else {
				computedValue = computedValue ? computedValue : "";
			}
			return computedValue;
		},
		createItemModel: function (objectDetails) {
			let colModel = {};
			colModel.itemId = objectDetails.physicalID ? objectDetails.physicalID : undefined;
			colModel.itemType = objectDetails.type ? objectDetails.type : undefined;
			colModel.modifyAccess = objectDetails.modifyAccess ? objectDetails.modifyAccess : undefined;
			colModel.type_icon_large_url = objectDetails.type_icon_large_url ? objectDetails.type_icon_large_url : undefined;
			colModel.type_icon_url = objectDetails.type_icon_url ? objectDetails.type_icon_url : undefined;
			if (objectDetails.basicData && Array.isArray(objectDetails.basicData)) {
				objectDetails.basicData.forEach(function (basicAttrDetails) {
					let attrName = basicAttrDetails.name;
					colModel[attrName] = basicAttrDetails.value;
				});
			}

			if (objectDetails.data && Array.isArray(objectDetails.data)) {
				objectDetails.data.forEach(function (attrInfo) {
					let attrName = attrInfo.name;
					colModel[attrName] = attrInfo.value;
				});
			}
			var gridItemModel = new MultiGridItemModel();
			gridItemModel.set(colModel);
			return gridItemModel;
		},
		checkIsGMTDate: function (value) {
			let isGMTDate = typeof value == "object" && value[0].endsWith(":GMT") && value[0].indexOf("@") > -1;
			if (isGMTDate) {
				return true;
			}
			return false;
		},
		getFormattedDate: function (value) {
			let formattedDateValue = Utils.convertToISOString(value);
			let isNotaNumber = isNaN(value);
			if (isNotaNumber && !isNaN(Date.parse(formattedDateValue))) {
				return formattedDateValue;
			} else {
				return value;
			}
		},

		extractAttributes: function (attrResponse) {
			var that = this;
			that.selectedItemModels = [];
			if (attrResponse && attrResponse.results && attrResponse.results.length > 0) {
				var attrRows = [];
				that.rowDetails = {};
				attrResponse.results.forEach(function (objectAttr) {
					let physicalID = objectAttr.physicalID;
					let itemModel = that.createItemModel(objectAttr);
					that.itemColumnModels.push(itemModel);
					that.selectedItemModels.push(itemModel);
					if (objectAttr.basicData && Array.isArray(objectAttr.basicData)) {
						objectAttr.basicData.forEach(function (basicAttrDetails) {
							var attrDetails = {};
							let physicalID_readOnly = physicalID + "_readOnly";
							let physicalID_editable = physicalID + "_modifyAccess";
							attrDetails.objectType = objectAttr.type;
							let attrName = basicAttrDetails.name;
							if (!(attrName in that.rowDetails)) {
								attrDetails = that.setCommonProperties(basicAttrDetails);
								attrDetails["isGMTDate"] = that.checkIsGMTDate(basicAttrDetails.value);
								attrDetails[physicalID] = that.computeAttrValue(basicAttrDetails);
								attrDetails[physicalID_readOnly] = basicAttrDetails.readOnly;
								attrDetails[physicalID_editable] = objectAttr.modifyAccess;
								attrDetails["itemIds"] = [physicalID];
								that.rowDetails[attrName] = attrDetails;
							} else {
								if (that.rowDetails[attrName]["itemIds"]) {
									that.rowDetails[attrName]["itemIds"].push(physicalID);
								} else {
									that.rowDetails[attrName]["itemIds"] = [physicalID];
								}
								that.rowDetails[attrName]["isGMTDate"] = that.checkIsGMTDate(basicAttrDetails.value);
								that.rowDetails[attrName][physicalID] = that.computeAttrValue(basicAttrDetails);
								that.rowDetails[attrName][physicalID_readOnly] = basicAttrDetails.readOnly;
								that.rowDetails[attrName][physicalID_editable] = objectAttr.modifyAccess;
							}
						});
					}
					let objectAttrExtensions = objectAttr.extensions;
					if (objectAttr.data && Array.isArray(objectAttr.data)) {
						objectAttr.data.forEach(function (attrInfo) {
							let attrDetails = {};
							let physicalID_readOnly = physicalID + "_readOnly";
							let physicalID_editable = physicalID + "_modifyAccess";

							let attrName = attrInfo.name;
							if (attrInfo.extension) {
								attrName = attrInfo.path;
							}
							if (!(attrName in that.rowDetails)) {
								attrDetails = that.setCommonProperties(attrInfo);
								attrDetails.name = attrName;
								attrDetails["isGMTDate"] = that.checkIsGMTDate(attrInfo.value);
								attrDetails[physicalID] = that.computeAttrValue(attrInfo);
								attrDetails[physicalID_readOnly] = attrInfo.readOnly;
								attrDetails[physicalID_editable] = objectAttr.modifyAccess;
								attrDetails["itemIds"] = [physicalID];
								that.setDimensionProperties(attrInfo, attrDetails);
								// IR-1097940 and IR-1246898 start
								//One condition is added to check whether attribute has dimensions
								//If yes, then make it non-editable
								if (objectAttrExtensions && attrInfo.dimensionType) {
									attrDetails[physicalID_readOnly] = true;
									attrDetails[physicalID_editable] = false;
								}
								// IR-1097940 and IR-1246898 end
								if (attrInfo.extension && objectAttrExtensions) {
									let extensionInfo = objectAttrExtensions[attrInfo.extension];
									attrDetails.extensionDispName = extensionInfo.nameNLS ? extensionInfo.nameNLS : undefined;
									attrDetails.extensionName = attrInfo.extension;
									attrDetails.deploymentExtension = attrInfo.deploymentExtension;
								}
								that.rowDetails[attrName] = attrDetails;
							} else {
								that.rowDetails[attrName].name = attrName;
								if (that.rowDetails[attrName]["itemIds"]) {
									that.rowDetails[attrName]["itemIds"].push(physicalID);
								} else {
									that.rowDetails[attrName]["itemIds"] = [physicalID];
								}
								that.rowDetails[attrName]["isGMTDate"] = that.checkIsGMTDate(attrInfo.value);
								that.rowDetails[attrName][physicalID] = that.computeAttrValue(attrInfo);
								that.rowDetails[attrName][physicalID_readOnly] = attrInfo.readOnly;
								that.rowDetails[attrName][physicalID_editable] = objectAttr.modifyAccess;
								if (!attrInfo.readOnly && objectAttr.modifyAccess) {
									that.rowDetails[attrName].range = attrInfo.range ? attrInfo.range : undefined;
									that.rowDetails[attrName].rangeNLS = attrInfo.rangeNLS ? attrInfo.rangeNLS : undefined;
									that.setDimensionProperties(attrInfo, that.rowDetails[attrName]);
								}
								// IR-1097940 and IR-1246898 start
								//One condition is added to check whether attribute has dimensions
								//If yes, then make it non-editable
								if (objectAttrExtensions && attrInfo.dimensionType) {
									that.rowDetails[attrName][physicalID_readOnly] = true;
									that.rowDetails[attrName][physicalID_editable] = false;
								}
								// IR-1097940 and IR-1246898 end
							}
						});
					}
				});
			}
		},
		onError: function (errorResp) {
			Notification.displayNotification({
				eventID: "error",
				msg: (errorResp && errorResp.message) || NLS.Error_LoadingMultiEditGrid,
			});
		},
		_buildAttrObject: function (key) {
			let context = this;
			let rowAttr = { "name": key };
			let value = context.rowDetails[key];
			for (let prop in value) {
				rowAttr[prop] = value[prop];
			}
			return rowAttr;
		},
		addColumnItemModel: function (columnConfig) {
			let context = this;
			let gridColumns = context.gridView.gridManager.columns;
			if (gridColumns && gridColumns.length > 0) {
				if (columnConfig && columnConfig.dataIndex) {
					for (let i = 0; i < context.itemColumnModels.length; i++) {
						if (columnConfig.dataIndex == context.itemColumnModels[i].getItemId()) {
							columnConfig.itemModel = context.itemColumnModels[i];
							break;
						}
					}
				} else {
					gridColumns.forEach(function (column) {
						for (let i = 0; i < context.itemColumnModels.length; i++) {
							if (column.dataIndex == context.itemColumnModels[i].getItemId()) {
								column.itemModel = context.itemColumnModels[i];
								break;
							}
						}
					});
				}
			}
		},
		renderGridTreeModel: function () {
			var context = this;
			var bomOptions = {
				"itemIDs": context.itemIDs,
				rows: context.attrNames,
				"container": context.gridEditContainer,
				"modelEvents": context.modelEvents,
			};
			context.attrGridModel = new AttributeGridModel(bomOptions);
			var nodeModels = [];
			if (context.rowDetails) {
				for (var key in context.rowDetails) {
					if (context.rowDetails.hasOwnProperty(key)) {
						let rowAttr = context._buildAttrObject(key);
						var nodeModel = context.attrGridModel.createListNode(rowAttr);
						if (nodeModel.getExtensionName()) {
							context.addColumnExtensionConfig(nodeModel, nodeModel.getItemIDs());
						}
						nodeModels.push(nodeModel);
					}
				}
				nodeModels.sort((a, b) => {
					return a.getDynamicColumnValue("UIPosition") - b.getDynamicColumnValue("UIPosition");
				});
				nodeModels.sort((a, b) => {
					return a.getDynamicColumnValue("extensionDispName") > b.getDynamicColumnValue("extensionDispName");
				});
				nodeModels.forEach(function (nodeModel) {
					context.gridView.addRootNodes(nodeModel, false);
				});
			}
			context.addColumnItemModel();
		},
		destroy: function () {
			if (this._multiGridAttrSubscriptionList) {
				this.coreModelEvents.unsubscribeList(this._multiGridAttrSubscriptionList);
				this.modelEvents.unsubscribeList(this._multiGridAttrSubscriptionList);
			}
			if (this.dnd) this.dnd.cleanDroppable(this.gridEditContainer);
		},
	});
	return MultiGridAttributeManager;
});
