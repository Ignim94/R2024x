//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/Configuration/ElementsRequiredView',
		[
			'UWA/Class/View',
			'DS/Utilities/Dom',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'DS/ENOXPackageManagement/views/Configuration/CreateRange',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
            'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
            'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra'
           ],function(View, DomUtils, UIMask, XSourcingCollectionViewObj,CreateRange, NLS,ENOXSourcingDataDragAndDrop,ENOXTDPConstants,NLSInfra){


	'use strict';

	var _name = 'Elements_Required';
	var ElementsRequiredView = View.extend({
		name : _name,
		tagName : "div",
		domEvents : {},
		init : function(options) {
			this.model=options.model;
			this.modelEvent = this.model.get("modelEvent");
			[ 'container', 'template', 'tagName', 'domEvents' ].forEach(function(propToDelete) {
				delete options[propToDelete];
			});
			this._parent(this, options);
		},
		setup : function() { 
			this.container.addClassName(this.getClassNames('-container'));    
			this.listenTo(this.model, "onChange", this.render);
		},
		update:function(){
			var boundingClientRect = this.outerDiv.parentElement.parentElement.getBoundingClientRect();
			this.outerDiv.style.height = boundingClientRect.height+"px";
		},		
		render : function() {
			var that=this;
			that.controller=that.model.get("controller");
			that.container.empty();
			that.outerDiv = UWA.createElement('div', {
				'class': 'outerDiv',
				'styles':{
					"height":'100%'
				}
			}).inject(that.container);
			UIMask.mask(that.container,NLS.Loading_Attribute_Range);
			var options = {};
			options._mediator=that.model.get("mediator");
			options.applicationChannel = that.model.get('applicationChannel');
			options._triptychWrapper = that.model.get('triptychWrapper');
			options.platformServices = that.model.get('platformServices');
			options.router=that.model.get("router");
			options.uniqueIdentifier='elementsRequiredRange';
			options.controller=that.controller;
			options.contextObject=that.model.get("contextObject");
			
			options.applicationChannel.publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObjectId':null}});

			options.data=[];
			if(that.model.get("data")){
				//var data=that.model.get("data");
				//that.loadData();
				that.loadData(that.model.get("data"));
			}
			options.showToolbar = true;
			options.toolbarActions = [];
			options.toolbarActions.push({
		                        	  "id" : "AddNew",
		                        	  "text" : NLS.Add_New_Range,
		                        	  fonticon : 'fonticon fonticon-plus',
		                        	  handler : function()
		                        	  {
										 var createRange=new CreateRange(that.controller);
										 createRange.render(options);
		                        	  }
		                          },{
		                        	  "id" : "delete",
		                        	  "text" : NLS.Remove_Range,
		                        	  fonticon : 'trash',
		                        	  disabled : true,
		                        	  handler : function()
		                        	  {
										  require(['DS/UIKIT/SuperModal'],function(SuperModal){
										  var seletectedRanges=[];
										  let allRanges = [];
										  var selectedRange=that.tableView._gridModel.getSelectedNodes();
										  var titleLabel = (selectedRange.length === 1)?selectedRange[0].options.grid.name:selectedRange.length+" " + NLS.Range;
										  var superModal = new SuperModal({ renderTo: widget.body,okButtonText: NLS.delete});
										  superModal.confirm(NLS.remove_range_confirmation,NLS["remove"]+" - "+titleLabel, function (result) {
											if(result)
											{
											  
											   selectedRange.forEach(function(obj){
												  seletectedRanges.push(obj.options.grid.name);
												   });
											  
											   that.tableView._gridModel.getRoots().forEach((root) => {
														allRanges.push(root.options.grid.name);
												});
												if(seletectedRanges.length===allRanges.length){
													return widget.notificationUtil.showError(NLS.Non_Empty);
												}
												allRanges = allRanges.filter((value) => seletectedRanges.indexOf(value) === -1);
											  that.removeRange(allRanges);
											}
										});
										 });
									  }
		                          });
			options.columnsConfigurations = that.getColumnConfigurations(options);
			options.views=["Grid"];
			options.enableDrag = true;
			that.tableView = new XSourcingCollectionViewObj();
			options.container = that.outerDiv;
			
			that.tableView.init(options);
			options.tableView=that.tableView;
			that.setListenersAndSubscribers(options);
			that.tableView.collectionViewEvents.subscribe({'event':'update-model'}, function(respData){
						that.loadData(respData);
			}); 
			DomUtils.addResizeListener(that.outerDiv, function() { that.update(); }, 0);
			let dropOptions = {
				dropArea: that.tableView._xsourcingCollectionViewUI.viewContainer,
				applicationChannel: options.applicationChannel,
				dropStrategy: "OPEN",
				onDropCallback: (droppedObj) => {
					if(droppedObj.objectType === ENOXTDPConstants.Type_Package) {
						options.router.navigate("home.PackageDetails",{id:droppedObj.objectId,title:droppedObj.displayName});
					}
					else if(droppedObj.objectType === ENOXTDPConstants.Type_Publication) {
						options.router.navigate("home.PublicationDetails",{id:droppedObj.objectId,title:droppedObj.displayName});
					}	
					else {

                        widget.notificationUtil.showError(`"${droppedObj.displayType || droppedObj.objectType}" ${NLSInfra.unsupported_type}.
                         ${NLS.drag_drop_error_message} "${NLS.TDP_CollaborationPackage}" ${NLS.or} "${NLS.TDP_PackagePublication}"`);

					}	
				}
			};
			let configurationDragAndDrop = new ENOXSourcingDataDragAndDrop();
			configurationDragAndDrop.makeAreaDroppable(dropOptions);	
			return that.container;
		},
		onDestroy : function() {
			return this._parent.apply(this, arguments);
		},
		loadData:function(respData){
			var that=this;			
			if(that.container && that.container.parentElement)
				UIMask.mask(that.container.parentElement,NLS.loading);			

				that.controller.ConfigurationHelper.processForRanges(respData.data).then(function(data){
					that.tableView._setData(data);
					that.tableView._xsourcingCollectionViewUI.collectionViewEvents.publish({event: 'xsourcing-collectionview-update-count'});
					that.tableView._xsourcingCollectionViewUI._allData = data;
					if(that.tableView._gridModel.getRoots().length>=10) {
						that.tableView._xsourcingCollectionViewUI.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'AddNew'});
						that.tableView._xsourcingCollectionViewUI.collectionToolbar._modelEvents.publish({event:'enox-collection-toolbar-change-text-tooltip-action',data:{id: 'AddNew', text: NLS.Add_New_Range_Limit}});
					}
					else {
						that.tableView._xsourcingCollectionViewUI.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'AddNew'});
						that.tableView._xsourcingCollectionViewUI.collectionToolbar._modelEvents.publish({event:'enox-collection-toolbar-change-text-tooltip-action',data:{id: 'AddNew', text: NLS.Add_New_Range}});
					}
					
				}).finally(() => {
				if(that.container && that.container.parentElement){
					UIMask.unmask(that.container.parentElement);	
                    UIMask.unmask(that.container);
				}
			});				
		},
		removeRange:function(ranges){
			
			var that=this;
			var contextObject = that.model.get("contextObject");
			if(contextObject.updateElementsRequired){
			contextObject.updateElementsRequired({addData:{"data":that.controller.ConfigurationHelper.processForAddNew(ranges)}}).then(function(respData){
							that.loadData(respData);
						    widget.notificationUtil.showSuccess(NLS.Range_Removed);
						    UIMask.unmask(widget.body);
					},function(){ 
						widget.notificationUtil.showError(NLS.Error_Range_Remove);
						UIMask.unmask(widget.body);
					});
			}
		},
		getColumnConfigurations:function(){
		return [{
		       	 "text": NLS.Range_Name,
		    	 "dataIndex": "name",
		    	// "resizableFlag": true,
		    	 "sortableFlag": true
		    	 //"pinned": "left",
		    	 //"width": "100%"
		     }];
		},
		setListenersAndSubscribers:function(options){
			var that=this;
			that.tableView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-selection-updated'},function(data){
			widget.setValue("LastSelectedTabInfoPanel", undefined);
			if(data.selectedItems.length>0){
				that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'delete'});
			
			}else{
				that.tableView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'delete'});	
				options.applicationChannel.publish({event:'xsourcing-collectionview-unselected-object-id',data:{'selectedObject':null}});
			}
		});
		}
		
	});

	return ElementsRequiredView;
});	


