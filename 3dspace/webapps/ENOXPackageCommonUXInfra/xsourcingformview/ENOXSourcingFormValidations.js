//XSS_CHECKED
define('DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingFormValidations',
    [
     	'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingFormHelpers',
     	'DS/UIKIT/Mask',
     	 'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra'
    ],
    function(Helper, UIMask, NLSInfra) {
    'use strict';
    
    var ENOXSourcingFormValidations = function ENOXSourcingFormValidations(){};
    
    ENOXSourcingFormValidations.prototype.charLimitValidate = function(fields) {
    	var that=this;
    	var isOk = true;
    	isOk=that.validateNumberField(fields);
    	fields.forEach(function(field){
    		if(typeof field.options.isLengthy !== 'undefined'){
	    		var lengthLimit = field.options.isLengthy?256:100;
	        	if(field.getValue().length>lengthLimit){
	        		field.elements.input?field.elements.input.focus():field.elements.inputField.focus();
	        		if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
	        		isOk = false;
	    		}else{
	    			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
	    		}
    		}
    	});
    	return isOk;
    };
    ENOXSourcingFormValidations.prototype.validateNumberField = function(fields) {
    	var isOk=true;
    	var numberTypesArray=['real','Real','Integer','integer','number','Number','customNumberField'];
    	fields.forEach(function(field){
    		if(field.options && numberTypesArray.includes(field.options.type)){
				let val=field.elements.inputField.value;
    			let actualValue=parseFloat(field.elements.inputField.value);

    			var errorDiv=field.elements.container.getElementsByClassName('form-control-error-text')[0];
    			
    			if(!errorDiv){
    				if(field.elements.container.getParent('.form-group'))
    					errorDiv = field.elements.container.getParent('.form-group').getElementsByClassName('form-control-error-text')[0];
    			}
    			if(errorDiv){
					if(field && field.options && field.options.required && (val==="" || val===undefined)){
						isOk=false;
						if(field.options && field.options.errorText){
							errorDiv.innerText=field.options.errorText;
							errorDiv.style.display='block';
						}
					}
    				else if(actualValue>field.options.maxValue || actualValue<field.options.minValue){
    					isOk=false;
    					errorDiv.innerText =  NLSInfra.VALUE_OUTOF_RANGE+" ("+field.options.minValue.toString()+" "+NLSInfra.to+" "+field.options.maxValue.toString()+")";
    					errorDiv.style.display='block'; 
    				} else{
    					errorDiv.style.display='none';
    				}
					return isOk;
    			}
    		}
    	});
    	return isOk;
    };
//commenting as not required by TDP
    /*ENOXSourcingFormValidations.prototype.mandatoryFieldValidation = function(fields) {
    	var isOk = true;
    	for(let i = 0; i < fields.length; i++) {
    		let field = fields[i];
    		if(field.options && typeof field.options.required !== 'undefined'){
    			if(field.options.required && field.options.zeroNotAllowed && (field.getValue() === "0" || field.getValue() === 0 )){
    				field.elements.input?field.elements.input.focus():field.elements.inputField.focus();
        			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
        			isOk = false;
        			break;
    			}
	        	if(field.options.required && field.getValue() === ""){
	        		field.elements.input?field.elements.input.focus():field.elements.inputField.focus();
	        		if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
	        		isOk = false;
	        		break;
	    		}else{
	    			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
	    		}
    		}
    	}
    	return isOk;
    };*/
    
    ENOXSourcingFormValidations.prototype.autoCompleteValidation = function(fields) {
    	var isOk = true;
    	fields.forEach(function(field){
    		if(typeof field.autocomplete !== 'undefined' && typeof field.options.required !== 'undefined'){
        	if(field.selectedItems.length === 0){
        		field.elements.input.focus();
        		if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
        		isOk = false;
    		}else{
    			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
    		}
	    }
    	});
    	return isOk;
    };
    
    ENOXSourcingFormValidations.prototype.wuxAutoCompleteValidation = function(fields) {
    	var isOk = true;
    	var once = false;
    	fields.forEach(function(field){
        	if(!field.selectedItems){
        		if(field.options.required){
        			if(!once) {
        				  field._editor.elements.inputField.focus();
        		          once = true;
        		      }
	        		if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
	        		isOk = false;
        		}else{
        			field._editor.elements.inputField.value = "";//To clear random text entered which is not an actual value
        		}
    		}else{
    			if(field.elements.container.getParent('.form-group'))
        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
    		}
    	});
    	return isOk;
    };
    
    
    ENOXSourcingFormValidations.prototype.wuxAutoCompleteMaskingValidation = function(fields) {
    	var isOk = true;
    	fields.forEach(function(field){
        	if(field.options.required && UIMask.isMasked(field.fieldController.getWrapperDiv())){ 
        		//masking condition in if is required because WUX validation is not handled by OOTB Form.js for submit case, hence we have to manage at application level
        		isOk = false;
    		}
    	});
    	return isOk;
    };
    
    ENOXSourcingFormValidations.prototype.regexValidation = function(fields, regex) {
    	var isOk = true;
    	fields.forEach(function(field){
    		if(typeof field.options.noSpecialCharorHyphen !== 'undefined' || 
    				typeof field.options.noSpecialChar!== 'undefined'){
	        	if(field.getValue().search(regex) === -1){
	        		field.focus();
	        		if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
	        		isOk = false;
	    		}else{
	    			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
	    		}
    		}
    	});
    	return isOk;
    };
    //commenting as not required by TDP
    /*ENOXSourcingFormValidations.prototype.regexValidationName = function(fields, regex) {
    	var isOk = true;
    	fields.forEach(function(field){
	        	if(field.getValue('name').search(regex) !== -1){
	        		field.focus();
	        		if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').addClassName("has-error");
	        		isOk = false;	
	    		}else{
	    			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
	    		}
    	});
    	return isOk;
    };*/
    
    ENOXSourcingFormValidations.prototype.propertiesRegexValidation = function(field, regex) {
    	let isOk = true;
    	if(field.getValue().search(regex) === -1){
				field.focus();
				if(field.elements.container.getParent('.form-group'))
        		    field.elements.container.getParent('.form-group').addClassName("has-error");
				isOk = false;
		}else{
			if(field.elements.container.getParent('.form-group'))
    		    field.elements.container.getParent('.form-group').removeClassName("has-error");
		}
		return isOk;
    };
   
    /*ENOXSourcingFormValidations.prototype.validateTypeOfData = function(fields, type) {
    	var isOk = true;
    	fields.forEach(function(field){
    		if(typeof field.options.validDataType !== 'undefined'){
    			var regexp = Helper.getRegexForDataType(type, field.options.allowedSpecialChars);
	        	if(regexp && field.getValue()){
	        		var regExp = new RegExp(regexp);
	        		if(!regExp.test(field.getValue())){
		        		field.focus();
		        		if(field.elements.container.getParent('.form-group'))
		        		    field.elements.container.getParent('.form-group').addClassName("has-error");
		        		isOk = false;
	        		}else{
	        			if(field.elements.container.getParent('.form-group'))
		        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
		    		}
	    		}else{
	    			if(field.elements.container.getParent('.form-group'))
	        		    field.elements.container.getParent('.form-group').removeClassName("has-error");
	    		}
    		}
    	});
    	return isOk;
    };*/
	return ENOXSourcingFormValidations;
});
