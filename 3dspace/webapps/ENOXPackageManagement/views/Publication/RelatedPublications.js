//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageManagement/views/Publication/RelatedPublications',
		[ 
			'UWA/Core', 
			'UWA/Class/View',
			'DS/Utilities/Dom',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'css!DS/UIKIT/UIKIT.css'
			],function(UWA,View,DomUtils,UIMask,XSourcingCollectionViewObj,NLS){

	'use strict';

	var _name = 'related-publications-view';
	var RelatedPublications = View.extend({
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
			that.parentOptions=that.model.get("parentOptions");
			this.container.empty();
			this.outerDiv = UWA.createElement('div', {
				'class': 'outerDiv',
				'styles':{
					"height":'100%'
				}
			}).inject(this.container);
			UIMask.mask(this.container,NLS.loading_publications);
			var options = {};
			options.data=[{"dummyData":"dummyData"}];
			if(that.model.get("contextObject")){
			that.loadData();
			}
			options._mediator=that.model.get("mediator");
			options.applicationChannel = that.model.get('applicationChannel');
			options.router=that.model.get("router");
			options.uniqueIdentifier='RelatedPublication';
			options.toolbarActions = [];
			options.toolbarActions.push(
				{
					id : "delete",
					text : NLS["delete"],
					fonticon : "trash",
					disabled : true,
					handler : function() {
						if(that.xsourcingCollectionView._xsourcingCollectionViewUI.checkIfExceedsDeleteLimit(that.xsourcingCollectionView._gridModel.getSelectedNodes()))
			    return;
			require(['DS/UIKIT/SuperModal'],function(SuperModal){
				options.selectedNodes = that.xsourcingCollectionView._gridModel.getSelectedNodes();
				if(options.selectedNodes.length > 0){
					var superModal = new SuperModal({ renderTo: widget.body,okButtonText: NLS.delete});
					var titleLabel = (options.selectedNodes.length === 1)?options.selectedNodes[0].options.label:options.selectedNodes.length+" " + NLS.publications;
					superModal.confirm(NLS.delete_confirmation,NLS["delete"]+" - "+titleLabel, function (result) {
						if(result){
							options.thatObj=that;
							that.model._attributes.publicationController.delete(options);
						}
							
					});
				}
			});
					}
				});
		options.toolbarActions.push(
				{
					id : "downloadDocument",
					text : NLS.downLoad,
					fonticon : "download",
					disabled : true,
					handler : function() {
						options.selectedNodes = that.xsourcingCollectionView._gridModel.getSelectedNodes();
						if(options.selectedNodes.length === 1){
							var downloadOptions = {
								id:options.selectedNodes[0].options.grid.id,
								helper:that.controller.commonhelper,
								applicationChannel:options.applicationChannel
								};
							that.model._attributes.publicationController.model.downloadZipFile(downloadOptions);
						}else{
							widget.notificationUtil.showError(NLS.FILE_DOWNLOAD_ONE_SELECT);
						}
					}
				});
			options.showToolbar = true;
			options.onContextualEventCallback = function onContextualEvent(){
			};
			options.rowUnSelectCallback = function(){
				widget.setValue("selectedNodeIds", undefined);
				widget.setValue("LastSelectedTabInfoPanel", undefined);
				let hyperLinkOption = {
		    				contextObjId: that.parentOptions.id,
		    				callControllerMethod: that.model._attributes.controller,
							  infoPanelForPackageDetails:true,
							  forInfo:true
		    	};
		    	widget.app._applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',
		    		data:{
		    			selectedObject: true, //to mimic a selected object to cater to current info panel mechanism
		    			openDetails: that.model._attributes.controller.commonhelper.getObjectDetailsInInfoPanel(hyperLinkOption)
		    		}
		    	});
		};
		
			options.columnsConfigurations = [];
			options.views=["Tile"];
			options.enableDrag = true;
			that.xsourcingCollectionView = new XSourcingCollectionViewObj();
			options.container = that.outerDiv;
			options.sort=[{
				id: "title",
				text: NLS.title,
				type: "string"
			}];
			that.xsourcingCollectionView.init(options);
      
			that.modelEvent.subscribe({'event':'update-model'}, function(){
						that.loadData();
			}); 
			that.xsourcingCollectionView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-selection-updated'},function(data){
			if(data.selectedItems.length>0){
					let selectedNodeIds = that.xsourcingCollectionView._xsourcingCollectionViewUI._gridModel.getSelectedNodes().map((selectedNode) => {
						return selectedNode._options.grid['id'];
					});
					widget.setValue("selectedNodeIds", selectedNodeIds);
					var nodeSelected = (event && event.dsModel && event.dsModel.activeNode)?event.dsModel.activeNode:{options:data.selectedItems[data.selectedItems.length-1]};
					
					if(data.selectedItems.length===1){
						that.xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'downloadDocument'});
						that.xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'delete'});
						
						let hyperLinkOption = {
							contextObjId:nodeSelected.options.grid.id,
							callControllerMethod: that.model._attributes.publicationController
						};
						widget.app._applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',
							data: {
								selectedObject: true, //to mimic a selected object to cater to current info panel mechanism
								openDetails: that.model._attributes.publicationController.commonhelper.getObjectDetailsInInfoPanel(hyperLinkOption)
							
							}
						});			
					}
				else{
				that.xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'delete'});
				that.xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'downloadDocument'});
				}
			}else{
				that.xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'delete'});	
				that.xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'downloadDocument'});
			}
		});
      
			DomUtils.addResizeListener(this.outerDiv, function() { that.update(); }, 0);	
			return this.container;
			
		},
		onDestroy : function() {
			return this._parent.apply(this, arguments);
		},
		
		loadData:function(){
			var that=this;
			var contextObject = that.model.get("contextObject");	
			 var helper = that.model.get("helper");	
			if(that.container && that.container.parentElement)
				UIMask.mask(that.container.parentElement,NLS.loading);			
			    contextObject.getPublications(that.model.get("parentOptions")).then(function(respData){
				helper.processForList(respData).then(function(data){
					that.xsourcingCollectionView._setData(data);
					that.xsourcingCollectionView._xsourcingCollectionViewUI.collectionViewEvents.publish({event: 'xsourcing-collectionview-update-count'});
					that.xsourcingCollectionView._xsourcingCollectionViewUI._allData = data;
					let selectedNodeIds = widget.getValue("selectedNodeIds");
					if (selectedNodeIds !== undefined && selectedNodeIds.length > 0) {
						let collectionView = that.xsourcingCollectionView._xsourcingCollectionViewUI;
						collectionView._selectedItems = [];
						if(collectionView._allData.length > 0) {
							collectionView._selectedItems = collectionView._allData.filter(function(itemData){return selectedNodeIds.indexOf(itemData.grid.id)!==-1;});
							collectionView._gridModel.getRoots().forEach((root) => {
								if(root.getAttributeValue("id") === selectedNodeIds[0])
									root.select();
							});
						}
					}
					if(that.container && that.container.parentElement){
						UIMask.unmask(that.container.parentElement);	
                        UIMask.unmask(that.container);
					}
				});

			});				
		} 
	});

	return RelatedPublications;
});	


