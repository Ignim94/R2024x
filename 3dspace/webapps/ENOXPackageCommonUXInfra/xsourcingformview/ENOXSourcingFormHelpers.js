define('DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingFormHelpers',
  [
	'DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
	'DS/ENOXPackageCommonUXInfra/Mediator'
  ],
  function(DnD, ENOXMediator){
    'use strict';

    var Module = {
      switchToGeneral: function(options, form) {
    	  options.applicationChannel.publish({event:'qualification-type-switched',data:'general'});
        Module.hideElements.call(form.getFields(), ['manufacturingContext', 'context', 'usage','preferred'], '.form-group');
        Module.showElements.call(form.getFields(), ['orderable', 'marketStatus','usageAuthorization'], '.form-group');
        /*form.getField("context").required = false;
        form.getField("usage").required = false;*/
        form.options.submitFunction = Module.createGeneralQualification;
      },
      switchToUsage: function(options, form) {
        Module.showElements.call(form.getFields(), ['context', 'usage'], '.form-group');
        Module.hideElements.call(form.getFields(), ['manufacturingContext', 'orderable', 'marketStatus', 'usageAuthorization', 'contextRestrictions'], '.form-group');
        /*form.getField("context").required = true;
        form.getField("usage").required = true;*/
        form.options.submitFunction = Module.createUsageQualification;
      },
      switchToEquivalent: function(options, form) {
    	  options.applicationChannel.publish({event:'qualification-type-switched',data:'equivalent'});
        Module.showElements.call(form.getFields(), ['context', 'preferred', 'contextRestrictions'], '.form-group');
        Module.hideElements.call(form.getFields(), ['manufacturingContext', 'usage','orderable', 'marketStatus', 'usageAuthorization'], '.form-group');
        form.options.submitFunction = Module.createEquivalentQualification;
      },
      /*switchToManufacturingEquivalent: function(options, form) {
    	options.applicationChannel.publish({event:'qualification-type-switched',data:'manufacturingEquivalent'});
        Module.showElements.call(form.getFields(), ['manufacturingContext','preferred'], '.form-group');
        Module.hideElements.call(form.getFields(), ['context', 'usage', 'orderable', 'marketStatus', 'usageAuthorization', 'contextRestrictions'], '.form-group');
      },*/
      showElements: function(toShow, container) {
          this.forEach(element => {
              if (toShow.includes(element.name)) {
                  if (container) element = element.closest(container);
                  element.show();
              }
          });
      },
      hideElements: function(toHide, container) {
          this.forEach(element => {
              if (toHide.includes(element.name)) {
                  if (container) element = element.closest(container);
                  element.hide();
              }
          });
      },
		//commenting as not required by TDP
      /*getRegexForDataType: function(type, allowedChar) {
    	  var regex = "";
    	  if(type === "Real"){
    		  if(allowedChar){
    			  regex = "^([-+]?[0-9]+(.[0-9]+)?["+allowedChar+"])*[+-]?[0-9]+(.[0-9]+)?$";
    		  }else{
    			  regex = "^(\\d+)?([.]?\\d{0,2})?$";
    		  }
    	  }else if(type === "Integer"){
    		  if(allowedChar){
    			  regex = "^([-+]?[0-9]+["+allowedChar+"])*[+-]?[0-9]+$";
    		  }else{
    			  regex = "^([-+]?[0-9])*$";
    		  }
    	  }else if(type === "String"){
    		  if(allowedChar){
    			  regex = "^([a-zA-Z0-9"+allowedChar+"])*[a-zA-Z0-9"+allowedChar+"]+$";
    		  }else {
    			  regex = "^([a-zA-Z0-9])*$";
    		  }
    	  }else if(type === "Date"){
    	     regex = /^[0-9]{1,4}((?=\/)\/|-)[0-9]{1,4}((?=\/)\/|-)[0-9]{1,4}$/;
    	  }
    	  return regex;
      },*/
      makeFieldDroppable: function(fieldOptions) {
    	  var dndChannel = new ENOXMediator().createNewChannel();
    	  let options = {
    			  dropArea: fieldOptions.dropArea,
    			  multiObjs: !!fieldOptions.multiSelect,
    			  onDropCallback: fieldOptions.fieldController.onDropCallback.bind(fieldOptions.fieldController),
    			  inviteHandler: 'disable',
    			  applicationChannel: dndChannel,
    			  dropStrategy: "CREATE"
    	  };
    	  new DnD().makeAreaDroppable(options);
      }
    };

    return Module;
});
