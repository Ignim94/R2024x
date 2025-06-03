// XSS_CHECKED
define('DS/ENOSpecMultiGrid/view/Properties',
	[
		'UWA/Core',
		'UWA/Class',
		'DS/XSRCommonComponents/utils/Constants',
		'DS/ENOSpecMultiGrid/utils/Utils',
		'DS/XSRCommonComponents/utils/TypeUtils',
		'DS/XSRCommonComponents/components/EditProp/XSpecProperties'
	], function (UWA, Class, Constants,GridUtils,TypeUtils, XSpecProperties) {

	'use strict';

	var editProp = Class.extend({

			init: function (options) {				
				this._parent(options);   
				this.cmdId = options.ID;
				
			},
		     toggleMultiGridRightCloseIcon:function(hide){
				let rightCloseIcon=document.querySelector('.triptych-right .triptych-close-right');
				if(rightCloseIcon&&hide)
                {
					rightCloseIcon.setAttribute('style','display:none');
				}else if(rightCloseIcon&&!hide){
					rightCloseIcon.setAttribute('style','display:block');
				}			
			},
			render : function(options){
			    var model =options.itemModel;
			    this.grid=options.grid;
			    this.toggleMultiGridRightCloseIcon(true);
			    this.iconDiv=options.iconDiv;
			   // this.selectFacet=arguments[0].selectFacet;
				 var dataContainer; 
	               if( model){
	            	   
	                   this.itemId =model.getDynamicColumnValue('itemId');
                       this.itemType=model.getDynamicColumnValue('itemType');
	                   this.appCore = options.appCore;
	                   this.container = this.appCore.multigridTriptych.iRight;
 					   this.specModel=model;
					   dataContainer=this.container;
					   dataContainer.empty();	                  
	                   this.basicModelEvents = this.appCore.multigridModelEvents;
	                   this.gridEvent=options.gridModelEvents;                  
	                   this.triptychManager = this.appCore.multigridTriptych.triptychManager;	                  
	                   this.triptychManager.setCommandId(Constants.INFORMATION_CMD);
	                   if(!this.triptychManager.isRightPanelOpen()){	
	                	   this.triptychManager.setIconDiv(options.iconDiv);
		            	   //GridUtils.activateInfoIcon(options.iconDiv);
		            	   this.triptychManager.showRightPanel(400);	
		            	   this.triptychManager.setItemId(this.itemId);
						}else{
							if(this.triptychManager.getItemId()==this.itemId){
								this.destroy();			
								this.triptychManager.hideRightPanel();
							}else{
							//GridUtils.deactivateInfoIcon(this.triptychManager.getIconDiv());							
							this.triptychManager.setIconDiv(options.iconDiv);
			            	//GridUtils.activateInfoIcon(options.iconDiv);
			            	this.triptychManager.setItemId(this.itemId);
			            	this.triptychManager.resizePanel(400);							
							}
						}
	                  
	                  
	                  
	                   this.eventsSusb = [];
	                   this.modelEventsSubs=[];
	                   var that = this;
	                   
	                   this.modelEventsSubs.push(that.gridEvent.subscribe({
		 					event : Constants.EVENT_INFORMATION_PANEL_REFRESH
		 				}, function(data) {
		 				       if(that.editPropView)
		 				    	   that.editPropView.onRefresh();
		 				}));
	                 
	                 
						this.eventsSusb.push(that.basicModelEvents.subscribe({event: 'multigrid-right-panel-closed'}, 
								function(){
							that.toggleMultiGridRightCloseIcon(false);
							that.grid.unselectAll();
							that.destroy();
						}));
	               };
	                       
	               
	   			this.facetsArr = ["Properties", "Change","Comments"];
	   			
				this.initEditPropWidget(dataContainer);
				//let selectedFacetName=widget.getValue("lastSelectedFacet");
				//Priority to be given to specific facet load over persistedFacet
				//let loadfacet=that.selectFacet?that.selectFacet:selectedFacetName;
				//change the facet only if it is other than default facet i.e. properties
				/*if(loadfacet&&loadfacet!="properties"){
					setTimeout(function () {
						if(that.editPropView)
						that.editPropView.selectFacet(loadfacet);
					},600);
				}*/

			},
			
			
			initEditPropWidget: function (conatiner) {
				var isObjectTechSpecType=TypeUtils.isTechnicalSpecification(this.itemType);
				var enableChangeReq=true;
				if(isObjectTechSpecType){
					enableChangeReq=false;
				}
				this.specProp = new XSpecProperties();
				this.editPropView=this.specProp.init({id: this.itemId, container : conatiner,
					readOnly : true, 
					facets : this.facetsArr,
					enableChangeRequired:enableChangeReq,
					/*replaceDefaultPropertiesWithCustom : true,*/
					specModel : this.specModel
					});

				//if(Utils.isPhysicalProduct(this.itemType))
				//this.specProp._addCustomFacet(this.appCore,NLS);
				
				
			},
			removeSubscriptions:function(){
				if(this.eventsSusb) this.basicModelEvents.unsubscribeList(this.eventsSusb);
				if(this.modelEventsSubs) this.gridEvent.unsubscribeList(this.modelEventsSubs);
			},
			persistInformationFacet:function(){
				if(this.editPropView){
					let currentFacetName=this.editPropView.getContent?this.editPropView.getContent().currentFacetName:undefined;
					if(currentFacetName){
						widget.setValue("lastSelectedFacet",currentFacetName);
					}
				}
			},
			destroy : function(){
				this.persistInformationFacet();
				this.removeSubscriptions();
				GridUtils.deactivateInfoIcon(this.triptychManager.getIconDiv());
				this.triptychManager.setItemId("");
				this.triptychManager.setIconDiv("");
				if(this.specProp) this.specProp.destroy();			
				this.container.empty();
				
			}

			
			
		});
	return editProp;
});
