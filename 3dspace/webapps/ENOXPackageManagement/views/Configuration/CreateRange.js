/* global widget */
define('DS/ENOXPackageManagement/views/Configuration/CreateRange',
		[
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingForm',
			'UWA/Core',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageManagement/helpers/CommonHelper'
		 ],
		 function(UIMask,ENOXSourcingForm,UWA,NLS,CommonHelper) {
	'use strict';

	var createRange = function CreateRange(controller) {
		 this.controller = controller;
		 this.commonHelper = new CommonHelper();
	};
	
	createRange.prototype.render=function(options){
		
		this._myModelEvents = options.modelEvents;
		this._mediator = options._mediator;
		this._myContentEvents = this._mediator.createNewChannel();
		this._container = options._triptychWrapper.getMainPanelContainer();
		this._triptychWrapper=options._triptychWrapper;
		this.controller=options.controller;
		this._container = options._container;
		this.platformServices = options.platformServices;
		this.router=options.router;
		this._applicationChannel = options.applicationChannel;
		this.listRangeView=options.tableView;
		var that=this;

		var newAttributeRangeDiv = UWA.createElement('div', {
			id : 'newAttributeRangeDiv',
			'class': 'newAttributeRangeDiv modalBodyDiv'
		});
		
		var createForm = new ENOXSourcingForm({
			fields: [{
			        	 "type": "text",
			        	 "label":NLS.Range_Name,
			        	 "placeholder":NLS.Enter_Range_Name,
			        	 "name":'name',
			        	 "required": true,
			        	 "errorText":NLS.Range_Error_Text,
						 "isLengthy": false,
						 "helperText": NLS.Range_Helper_Text,
						 "maxlength":50
			         },
					 {
				type: 'customField',
				name: 'note',
				content: UWA.createElement('div', {
						id:"rangeModificationNote",
                		text: NLS.Range_Modification_Add
                })
			}
	
					 ],
	                   events:{
	                	   onSubmit:function(){
							    if(modal && modal.destroy){
									options.formValues = createForm.getValues();
									that.processAndUpdateAttributeRange(options);
									modal.destroy();
								}
							
	                	   },
	                	   onInvalid:function(){
	                		  
	                	   },
	                       onChange: function() {
	                       }
	                   }            
		}).inject(newAttributeRangeDiv);
		
		let modal = that.commonHelper.prepareModal(newAttributeRangeDiv,NLS.Add_New_Range);
	};

	createRange.prototype.processAndUpdateAttributeRange=function(options)
	{
		var that = this;
		let allRanges = [];
		options.tableView._gridModel.getRoots().forEach((root) => {
												allRanges.push(root.options.grid.name);
									});
		if(allRanges.indexOf(options.formValues.name) === -1)
		{
			allRanges.push(options.formValues.name);
			
			options.contextObject.updateElementsRequired({addData:{"data":that.controller.ConfigurationHelper.processForAddNew(allRanges)}}).then(function(respData){
								options.tableView.collectionViewEvents.publish({ event: 'update-model',data: respData});
							    widget.notificationUtil.showSuccess(NLS.Range_Added);
							    UIMask.unmask(widget.body);
			},function(){ 
				widget.notificationUtil.showError(NLS.Error_Range_Add);
				UIMask.unmask(widget.body);
			});
		}else{
		widget.notificationUtil.showError(NLS.Range_Not_Unique);
		}

	};

	return createRange;
});
