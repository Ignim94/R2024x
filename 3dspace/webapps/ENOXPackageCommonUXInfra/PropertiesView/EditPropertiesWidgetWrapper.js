//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageCommonUXInfra/PropertiesView/EditPropertiesWidgetWrapper',
	  [
	   	'DS/UIKIT/Mask',
		'DS/EditPropWidget/EditPropWidget',
		'DS/EditPropWidget/constants/EditPropConstants',
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
		'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants'
	  ],function(UIMask, EditPropWidget, EditPropConstants, ENOXSourcingService, ENOXSourcingPlatformServices, 
			  ENOXPackageCommonConstants){
	
    'use strict';

    /*
     * Parameters:
     * 
     * 	viewOptions:
     * 		container: *REQUIRED* To render properties view into this container
     * 		typeOfDisplay: default ALL
     * 		selectionType: default No Selection
     *  	facets: [] default all, just send the constant names as array of strings
     *  	readOnly: default true
     *  	extraNotif: default true
     *  	editMode: default false
     *		showIdCard: by default will show it
     *  
     *  dataOptions:
     *  	metatype: default businessobject
     *  	objectId: *REQUIRED* bus ID
     *  	source: default 3DSpace
     * 		
     */
    //Facets can be invoked directly from this wrapper.
    var classRef;
    
    var EditPropertiesWidgetWrapper = function(params) {
    	this.params = params;
    	this.editPropConstants = EditPropConstants;
    	classRef = this;
    };
    
    EditPropertiesWidgetWrapper.prototype.render = function() {
    	let viewOpts = classRef.prepareViewOptions(), dataOpts = classRef.prepareDataOptions(), container = classRef.params.viewOptions.container;
    	if(!container)throw new Error("Container must be passed!!!");
    	if(container.empty)container.empty();
		UIMask.mask(container);
		let editPropWidget = new EditPropWidget(viewOpts);
		editPropWidget.initData(dataOpts);
		if(classRef.params.viewOptions && classRef.params.viewOptions.typeOfDisplay === EditPropConstants.ONLY_EDIT_PROPERTIES)
			this.tabContainer = editPropWidget.elements.container;
		 else
			editPropWidget.elements.container.inject(container);
		UIMask.unmask(container);
    };
    
    EditPropertiesWidgetWrapper.prototype.prepareViewOptions = function() {
    	let opts = classRef.params.viewOptions;
    	let readOnly = true, editMode = false;
    	if(opts.readOnly !== undefined)
    		readOnly = opts.readOnly;
    	if(opts.editMode !== undefined)
    		editMode = opts.editMode;
    	let propOptions = {
				'typeOfDisplay': opts.typeOfDisplay?opts.typeOfDisplay:EditPropConstants.ALL,
				'selectionType': opts.selectionType?opts.selectionType:EditPropConstants.NO_SELECTION,
				'readOnly': readOnly,
				'extraNotif': opts.extraNotif?opts.extraNotif:true,
				'editMode': editMode,
				'showIdCard': opts.showIdCard,
				'context': {
						getSecurityContext : function (){
							return {SecurityContext: ENOXSourcingService.getSecurityContext()};
						}
					},
			         'events': {
                         'onNotification': function (infoObj) {
			               if(infoObj.eventID === 'info'){
								widget.notificationUtil.showInfo(infoObj.msg);
							} else if(infoObj.eventID === 'error'){
								widget.notificationUtil.showError(infoObj.msg);
							} else if(infoObj.eventID === 'warning'){
								widget.notificationUtil.showWarning(infoObj.msg);
							} else if(infoObj.eventID === 'success'){
								widget.notificationUtil.showSuccess(infoObj.msg);
							} else {
								widget.notificationUtil.showMessage(infoObj.msg);
							}
                         }
                	}
			};
    	if(opts.facets && opts.facets.length > 0){
    		propOptions.facets = [];
    		opts.facets.forEach((facet)=>{
    			propOptions.facets.push(EditPropConstants[facet]);
    		});
    	}
    	return propOptions;
    };
    
    EditPropertiesWidgetWrapper.prototype.prepareDataOptions = function() {
    	let opts = classRef.params.dataOptions;
    	if(!opts.objectId)throw new Error("Object ID must be passed!!!");
    	return [{
    		"metatype": opts.metatype?opts.metatype:"businessobject",
    		"objectId": opts.objectId,
    		"tenant": ENOXSourcingPlatformServices.getPlatformId(),
    		"source": opts.source?opts.source:ENOXPackageCommonConstants.SERVICE_3DSPACE
    	}];
    };
    
	return EditPropertiesWidgetWrapper;
});
