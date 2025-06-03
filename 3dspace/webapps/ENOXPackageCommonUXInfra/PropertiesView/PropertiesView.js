//XSS_CHECKED
/* global widget */
/*eslint complexity: off */
/*eslint no-shadow: "off"*/
/* eslint block-scoped-var: "off" ,no-redeclare :"off" */
define('DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesView',
	  [ 
	      'UWA/Core', 
	      'UWA/Class/View',
		  'DS/UIKIT/Scroller',
		  'UWA/Utils',
		  'DS/UIKIT/Input/Text',
		  'DS/UIKIT/Input/Button',
		  'DS/UIKIT/Input/Number',
		  'DS/UIKIT/Input/Date',
		  'DS/UIKIT/Input/Select',
		  'DS/UIKIT/Autocomplete',
		  'DS/Controls/Toggle', 
		  'DS/Controls/SpinBox',
		  'DS/Utilities/Dom',
		  'DS/ENOXCollectionToolBar/js/ENOXCollectionToolBarV2',
		  'DS/ENOXPackageCommonUXInfra/Mediator',
		  'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingForm',
		  'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
		  'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		  'DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesAccordeonView/PropertiesAccordeonView',
		  'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
		  'css!DS/UIKIT/UIKIT.css',
		  'css!DS/ENOXPackageCommonUXInfra/PropertiesView/PropertiesView.css'
		  
	  ],function(UWA,View,Scroller,Utils,Text,Button,NumberInput,DateInput,Select, Autocomplete,WUXToggle, SpinBox,
	  DomUtils, ENOXCollectionToolBar, Mediator, ENOXSourcingForm, NLS,Constants, PropertiesAccordeonView,
				CommonUtils){
    'use strict';
    var _name = 'properties-view';
	
    var PropertiesView = View.extend({
        name : _name,
        tagName : "div",
        pageOptions:{},
        template : function() {
            return "<div class=\"" + this.getClassNames('-subcontainer') + "\"></div>";
        },
        domEvents : {},
        
        init : function(options) {
            var that = this;
            this.model=options.model;
            this.modelEvent = new Mediator().createNewChannel();
            this.pageOptions = options;
            that.fieldElements = {};
            that.fieldElementsInternal = [];
            that.fieldLables = [];
            that.formObj = new ENOXSourcingForm();
            that.propertiesAccordeonView=new PropertiesAccordeonView({});
            [ 'container', 'template', 'tagName', 'domEvents' ].forEach(function(propToDelete) {
                delete options[propToDelete];
            });
            
            this._parent(this, options);
        },
        
		setup : function() { //options
			if(this.model.has('classes')) {
				this.container.addClassName(this.model.get('classes'));
			}
			this.model.get('singleColumn')?this.colLgClass = 'col-lg-12' : this.colLgClass = 'col-lg-6';
			this.model.get('singleColumn')?this.colMdClass = 'col-md-6' : this.colMdClass = 'col-md-6';

            this.container.addClassName(this.getClassNames('-container container-fluid'));
            this.listenTo(this.model, "onChange", this.render);
        },
        getFormGroup:function(field){
        	var that=this;
        	var formGroup = UWA.createElement('div', {
        		'class': 'form-group'
        	});
			var labelEle = undefined;
        	if(field.type === 'justLabel'){
        		labelEle = UWA.createElement('label', {
            		'class': 'just-label',
            		"html":field.label            		
            	});
        	}else if(field.type === 'labelValue'){
        		labelEle = UWA.createElement('div', {
					'class': 'label-value-1',
					'styles':{
						'padding-left': '7%'
					}
				});
        		var labelDiv = UWA.createElement('div', {
					'class': 'label-value-2',
					"html":field.label,
					'styles':{
						'color': '#77797c',
						'font-size': '14px',
						'width': field.value?'50%':'100%',
						'font-weight': '700',
						'background': 'transparent',
						'white-space': 'initial',
						'float':'left'
					}
				});
        		labelDiv.inject(labelEle);
        		
        		var valueDiv = UWA.createElement('div', {
					'class': 'label-value-3',
					"html":field.value,
					'styles':{
						'width': field.icon?'45%':'50%',
//						"word-wrap": "break-word",
						'white-space': 'initial',
						'float':'left',
						'color': '#3d3d3d'
					}
				});
        		valueDiv.inject(labelEle);
        		
        	}else{
				labelEle = UWA.createElement('label', {
					'class': this.colMdClass+' control-label',
					"html":field.label,
					'styles':{
						"margin": "15px 0",
						"word-wrap": "break-word",
						"color": "#3D3D3D",
						"font-size": "14px"
					}
        	});
        	}
        	if (field.label && field.required) {
               var required =  UWA.createElement('span', {
                    'class': 'label-field-required',
                    text: ' *',
                    'styles':{
						"display": "none"
						
					}
                });
               required.inject(labelEle);
            }
        	
			labelEle.inject(formGroup);   
        	
        	var fieldHolder = UWA.createElement('div', {
        		'class': this.colMdClass
        	}).inject(formGroup);  
        	
        	var  tempField = "";
        	var  tempField1 = ""; //button
        	var  tempField2 = ""; //second button
        	var  editableField = "";
        	if(field.nonEditable && field.type !== "justLabel" && field.type !== "hyperlink" && field.type !== "autocompleteWithSearch")field.type = "simpleText";
        	switch(field.type) {
        	case "text": case "string":
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		
        		editableField = that.createTextField(field);
        		editableField.inject(fieldHolder);
    			that.injectHelpers(field, editableField.elements.content);
        		editableField.elements.container.setStyle("display", "none");

        		editableField.onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
        		break;
        	case "simpleText":
				//if its a number convert it to locale string
				if(!isNaN(parseFloat(field.displayValue)))
					field.displayValue=CommonUtils.numberToLocaleString(field.displayValue);
        		tempField = that.createViewModeText(field, false);
				tempField.inject(fieldHolder);
        		break;
        	case "textarea":
        		if(!field.displayValue && field.value){
        			field.displayValue = (field.value.indexOf("\n") !== field.value.lastIndexOf("\n"))?
            				field.value.replaceAll("\n", " | "):field.value;
            		if(field.value.indexOf("\n") === 0)field.displayValue = field.displayValue.replace(" | ", "");
        		}
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		
        		editableField = that.createTextAreaField(field);
        		editableField.inject(fieldHolder);
        		that.injectHelpers(field, editableField.elements.content);
        		editableField.elements.container.setStyle("display", "none");

        		editableField.onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
        		break;
        	case "date": case "timestamp":
        		editableField = that.createDateField(field);
        		editableField.inject(fieldHolder);
        		that.injectHelpers(field, editableField.elements.content);
        		editableField.elements.container.setStyle("display", "none");
        		
        		field.value = editableField.elements.input.value;
        		
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);

        		editableField.onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
        		break;  
        	case "select":{
        		let selectedVal = field.options.find((x)=>x.value === field.value || x.selected === true);
        		
        		editableField = that.createSelectField(field);
        		editableField.inject(fieldHolder);
        		that.injectHelpers(field, editableField.elements.content);
        		editableField.elements.container.setStyle("display", "none");
        		
        		field.displayValue = field.displayValue?field.displayValue:(selectedVal?selectedVal.label:"");      		
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);

        		editableField.onChange =  function(evt){
        			let displayValue = field.options.find((x)=>x.value === this.getValue()[0]).label;
        			this.getContent().setAttribute("title", displayValue);  //For tooltip of text field
        			evt.target.title = displayValue; //For tooltip of hyperlink field
        			tempField.setText(displayValue); //To update value of hyperlink if text field updated
	        	};
        		break;
        	}
        	case "boolean":{
        		field.options = [{label: NLS.TRUE,value: "TRUE"},{label: NLS.FALSE,value: "FALSE"}];
        		
        		editableField = that.createSelectField(field);
        		editableField.inject(fieldHolder);
        		that.injectHelpers(field, editableField.elements.content);
        		editableField.elements.container.setStyle("display", "none");
        		
        		let selectedVal = field.options.find((x)=>x.value === field.value);
        		field.displayValue = selectedVal?selectedVal.label:"";
        		
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);

        		editableField.onChange =  function(){
        			let displayValue = field.options.find((x)=>x.value === this.getValue()[0]).label;
        			this.getContent().setAttribute("title", displayValue);  //For tooltip of text field
        			tempField.title = displayValue; //For tooltip of hyperlink field
        			tempField.setText(displayValue); //To update value of hyperlink if text field updated
	        	};
        		break;
        	}
			case "wuxDate":{
				field.value = CommonUtils.getDateStringForDisplay(field.value);
				tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);

				let wuxDateField = that.createWUXDateField(field);
        		wuxDateField.inject(fieldHolder);
        		wuxDateField.elements.container.setStyle("display", "none");

        		wuxDateField.onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
        		break;
			}
			//commenting as not required for TDP
			/*case "textFieldButton":{
				tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);

				let textFieldButtonField = that.createTextFieldButtonField(field);
        		editableField = textFieldButtonField[0];
        		editableField.inject(fieldHolder);
        		textFieldButtonField[1].elements.container.setStyle("display", "none");
				textFieldButtonField[2].elements.container.setStyle("display", "none");

        		textFieldButtonField[1].onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};

        		break;
			}*/
			case "checkbox":{

				tempField = that.createViewModeCheckBox(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
				
				let editableField = that.createCheckboxField(field);
        		editableField.inject(fieldHolder);
        		editableField.elements.container.setStyle("display", "none");

        		editableField.onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
				
        		break;
			}
			//commenting as not required for TDP
        	/*case "search":{
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		
        		let searchField = that.createSearchField(field);
        		editableField = searchField[0];
        		editableField.inject(fieldHolder);
        		searchField[1].elements.container.setStyle("display", "none");
        		searchField[2].elements.container.setStyle("display", "none");
        		
        		searchField[1].onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
        		break;
        	}*/
        	case "autocomplete":
        		if(field.dataSet)field.displayValue = field.dataSet.items.filter(ob=>ob.selected === true).map(val=>val.label || val.value).toString().replaceAll(",", ", ");
        		if(!field.displayValue)field.displayValue = " ";
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		
        		editableField = that.createAutoCompleteField(field, tempField);
        		editableField.inject(fieldHolder);
        		editableField.elements.container.setStyle("display", "none");
        		break;
			//commenting as not required for TDP
        	/*case "hyperlinkWithAutoComplete":
        		tempField = that.createHyperlinkField(field);
        		tempField.inject(fieldHolder);
        		
                editableField =that.createAutoCompleteField(field, tempField);
                editableField.elements.container.setStyle("display", "none");
                editableField.inject(fieldHolder);
        		that.fieldElementsInternal.push(tempField);
        		break;
        	case "hyperlinkWithTextField":
        		tempField = that.createHyperlinkField(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		
        		editableField = that.createTextField(field);
        		editableField.inject(fieldHolder);
        		that.injectHelpers(field, editableField.elements.content);
        		editableField.elements.container.setStyle("display", "none");

        		editableField.onChange =  function(){
	        		that.updateHybridFieldTitleAndTooltip.call(this,tempField);
	        	};
        		break;*/
        	case "hyperlink":
        		tempField = that.createHyperlinkField(field, false);
        		tempField.inject(fieldHolder);
        		break;
        	case "autocompleteWithSearch":{
        		if(field.values)field.displayValue = field.values.map(val=>val.value).toString().replaceAll(",", ", ");
        		if(!field.displayValue)field.displayValue = " ";
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		let autocompleteField = that.createAutoCompleteWithSearchField(field, tempField);
        		editableField = autocompleteField[0];
        		editableField.inject(fieldHolder);
        		autocompleteField[1].elements.container.setStyle("display", "none");
        		autocompleteField[2].elements.container.setStyle("display", "none");
        		if(autocompleteField[3])autocompleteField[3].elements.container.setStyle("display", "none");
        		break; 
        	}
        	case "hyperlinkWithAutoCompleteWithSearchField":{
				if(field.dataSet)field.displayValue = field.dataSet.items.filter(ob=>ob.selected === true).map(val=>val.label || val.value).toString().replaceAll(",", ", ");
        		if(!field.displayValue)field.displayValue = " ";				
        		tempField = that.createHyperlinkField(field);
        		tempField.inject(fieldHolder);
        		that.fieldElementsInternal.push(tempField);
        		
        		let autocompleteField = that.createAutoCompleteWithSearchField(field, tempField);
        		editableField = autocompleteField[0];
        		editableField.inject(fieldHolder);
        		
        		autocompleteField[1].elements.container.setStyle("display", "none");
        		autocompleteField[2].elements.container.setStyle("display", "none");
        		if(autocompleteField[3])autocompleteField[3].elements.container.setStyle("display", "none");
        		break; 
        	}
			case "customField":{
        		tempField = that.createCustomeField(field);
				tempField.inject(fieldHolder);
        		break; 
        	}
			case "number":case "integer": case "real":{
				field.displayValue=CommonUtils.numberToLocaleString(field.displayValue?field.displayValue:field.value);
        		tempField = that.createViewModeText(field);
        		that.fieldElementsInternal.push(tempField);
        		tempField.inject(fieldHolder);
        		
        		editableField = that.createNumberField(field, fieldHolder);
        		let updateTitleAndTooltip = function(editableField){
        			tempField.title = editableField.getInputText();
        			tempField.setText(editableField.getInputText());
        		};
        		editableField.elements.inputField.addEventListener('change',function(){
        			updateTitleAndTooltip(editableField);
        		});
        		editableField.elements.down.addEventListener('click',function(){
        			updateTitleAndTooltip(editableField);
        		});
        		editableField.elements.up.addEventListener('click',function(){
        			updateTitleAndTooltip(editableField);
        		});
        		editableField.inject(fieldHolder);
        		that.injectHelpers(field, editableField.elements.container);
        		editableField.elements.container.setStyle("display", "none");
        		break; 
        	}
        	default:
        		// code block
        	}     	
    		if(tempField.getContent)
    			if(tempField.getValue)
    				tempField.getContent().setAttribute("title",tempField.getValue()); //For tooltip
    			else if(tempField.getInputText)
    				tempField.getContent().setAttribute("title",tempField.getInputText()); //For tooltip
    			if(tempField.options && tempField.options.type==="autocomplete") {
    				let autocompleteValue = "";
    				tempField.selectedItems.map(function(selected){
    				autocompleteValue += 	selected.value+" ,";
    				});
    				autocompleteValue = autocompleteValue.slice(0, -1);
    			    tempField.getContent().setAttribute("title",autocompleteValue); //For tooltip
    			}
        	if(field.disable && field.disable===true){
        		if(tempField.disable){
        			tempField.disable();
        		}
        		if(tempField1 && tempField1.disable){
        			tempField1.disable();
        		}
        		if(tempField2 && tempField2.disable){
        			tempField2.disable();
        		}
        	}
        	if(tempField){
	        	tempField.addEvent('onChange', function() {
	        		    this.getContent().setAttribute("title",this.getValue());  //For tooltip
	                that.dispatchEvent('onChange', [this.getName(), this.getValue(),that]);
	            });
	        	tempField.onChange =  function(){
	        		var isOk = true;
	        		that.trackAttributeUpdations(this.getName(),this.getValue(),that);
	        		if(field.helperText || field.errorText){
	        			isOk = that.charLimitValidate(tempField, that);
	        			if(!isOk) return;
	        			isOk = that.alphanumericOrUnderscoreValidate(tempField, that);
	        			if(!isOk) return;
	        			that.alphanumericUnderscoreSpaceHyphenValidation(tempField, that);
						if(!isOk) return;
	        			that.autoCompleteValidation(tempField, that);
	        		}
	        		if(field.type === "date" || field.type === "timestamp")
	        			that.formatDate(this);
	        	};
        	}
        	return formGroup;
        },
        trackAttributeUpdations : function(attrName, attrValue){//that
        	var inputs = widget.body.getElementsByTagName("input");
        	var selects = widget.body.getElementsByTagName("select");
        	for (var indexInpt = 0; indexInpt < inputs.length; ++indexInpt) {
        	    if(inputs[indexInpt].name ===attrName){
        	    	inputs[indexInpt].value = attrValue;
        	    }
        	}
        	for (var indexSelc = 0; indexSelc < selects.length; ++indexSelc) {
        	    if(selects[indexSelc].name ===attrName){
        	    	selects[indexSelc].value = attrValue;
        	    }
        	}
        },
        formatDate : function(that){//that
        	var dateValue = that.elements.picker.getDate()?
        			(new Date(that.elements.picker.getDate().getTime())).toDateString():"";
        	that.elements.input.setAttribute('actualvalue',dateValue);
        },
        charLimitValidate : function(field){
        	var that = this;
        	var fields = [field];
        	return that.formObj.FormValidations.charLimitValidate(fields);
        },
        validateNumberField:function(field){
        	var that = this;
        	var fields = [field];
        	return that.formObj.FormValidations.validateNumberField(fields);
        },
        alphanumericOrUnderscoreValidate : function(fields){
        	var that = this;
        	if(!Array.isArray(fields))
        		fields = [fields];
        	var regex = Constants.ALPHA_NUM_UNDSCR_SPACE;
        	var isOk = true;
    	    fields.forEach(function(field){
    		    if(field.options && typeof field.options.noSpecialCharorHyphen!== 'undefined'){//added field.options for toggle fields
					isOk = that.formObj.FormValidations.propertiesRegexValidation(field, regex);
    		    }
    	    });
    	    return isOk;
        },
        alphanumericUnderscoreSpaceHyphenValidation : function(fields){
        	var that = this;
        	if(!Array.isArray(fields))
        		fields = [fields];
        	var regex = Constants.ALPHA_NUM_UNDSCR_SPACE_HYPHEN;
        	var isOk = true;
    	    fields.forEach(function(field){
    		    if(field.options && typeof field.options.noSpecialChar!== 'undefined'){//added field.options for toggle fields
					isOk = that.formObj.FormValidations.propertiesRegexValidation(field, regex);
    		    }
    	    });
    	    return isOk;
        },
		autoCompleteValidation : function(field){
        	var that = this;
        	var fields = [field];
        	return that.formObj.FormValidations.autoCompleteValidation(fields);
        },
        injectHelpers : function (field, helpersBase, where) {
            var helper;
            var helperText = field.helperText?field.helperText:(
            		(field.isLengthy === undefined)?undefined:(
            			(field.isLengthy?NLS.length_256_limit:NLS.length_100_limit))
            );
            var errorText = field.errorText?field.errorText:(
            		(field.isLengthy !== undefined)?NLS.max_char_limit_err_msg:field.isLengthy
            );
            if (helperText && helpersBase) {
            	field.helperText = helperText;
                helper = UWA.createElement('span', {
                    text: helperText,
                    'class': 'form-control-helper-text'
                }).inject(helpersBase, where || 'after');
            }
            if (errorText && helpersBase) {
            	field.errorText = errorText;
                UWA.createElement('span', {
                    text: errorText,
                    'class': 'form-control-error-text'
                }).inject(where === 'bottom' ? helper : helpersBase, where === 'bottom' ? 'before' : 'after');
            }
        },
        render : function() {
        	this.container.empty();
        	this.propertiesAccordeonView._reset();
        	var that=this;
        	that.fieldElements = {};
            that.fieldElementsInternal = [];
        	this.outerDiv = UWA.createElement('div', {
        		'class': 'outerDiv'
        	});

        	if(this.pageOptions.hideToolbar === undefined || this.pageOptions.hideToolbar === false) {
        		this.outerDiv.set({
        			'styles': {
        				'height': '100%'
        			}
        		});
        		var toolbarContainer = UWA.createElement('div', {
            		'class': ''
            	}).inject(this.container);		
             	
             		var actionsARray = [];
             		if(that.model._attributes.modifyAccess !== "TRUE" || !that.model._attributes.stateAccess){
             			actionsARray = [];
             		}
             		else{
             			var additionalActions=that.model.get('actionsARray');
             			if(additionalActions && additionalActions.length>0 ){
             				actionsARray=UWA.clone(additionalActions);
             			}
             			actionsARray.push(
            					{
            						id : "editMode",
            						text : NLS.edit,		
            						fonticon : "pencil",
            						handler : function(e) { //,i
            							 if(e && e.target){
           								 	that.toggleEditIconTooltip(e);
           							 	 }
            							that.fieldElementsInternal.forEach(function(ele){
            								 let container =  ele.elements?ele.elements.container:ele;
            								 if(container.getAttribute && container.getAttribute("propertyid") === "toggleVisibility"){
                                                    that.toggleVisibilityField(ele);
            								 }
            							 });
            						}
            					},        					
            					{
            						id : "createNPRTemplate",
            						text : NLS.save,  
            						fonticon : "floppy",
            						handler : function() { //e,i
            							var isOk = true;
            		                	if(that.fieldElements){
            		                		isOk = that.formObj.FormValidations.charLimitValidate(Object.values(that.fieldElements));
            		                		isOk = isOk && that.alphanumericOrUnderscoreValidate(Object.values(that.fieldElements));
        		                			isOk = isOk && that.alphanumericUnderscoreSpaceHyphenValidation(Object.values(that.fieldElements));
											isOk = isOk && that.formObj.FormValidations.autoCompleteValidation(Object.values(that.fieldElements));
            		                	}
            							if(that.model._attributes.save && isOk){
            								that.model._attributes.save(that.fieldElements, that);
            							}
            						}
            					});
             			additionalActions = that.model._attributes.additionalActions?that.model._attributes.additionalActions:undefined;
             			if (typeof additionalActions !== 'undefined' && additionalActions.length > 0) {
             				additionalActions.forEach(function(action){
             					actionsARray.push(action);
                    		});
             			}
             		}
             		var toolbarActions= { 
             				actions:actionsARray
            	};
            	if(this.pageOptions.itemName){
            		toolbarActions.itemName = this.pageOptions.itemName;
                	toolbarActions.itemsName= this.pageOptions.itemName;	
                	toolbarActions.showItemCount = true;
//              	toolbarActions.showNodeCount = false;
                	toolbarActions.modelEvents = that.modelEvent;
            	}
            	that.collectionToolbar = new ENOXCollectionToolBar(toolbarActions);
        		that.collectionToolbar.inject(toolbarContainer);
        	        
            	if(this.pageOptions.itemName){
    	        	that.modelEvent.publish({
    	        		event : 'enox-collection-toolbar-items-count-update',
    	        		data : ''
    	        	});
            	}
        	} else {
        		this.outerDiv.set({
        			'styles': {
        				'height': '100%'
        			}
        		});
        	}
        	var row = UWA.createElement('div', {
        		'class': 'row'
        	}).inject(this.outerDiv);
        	
        	let accordeonRequired=false;
        	if(this.model && this.model._attributes.fields){
        		
        		this.model._attributes.fields.forEach(function(fieldData){ //,idx
        			
        			let formGroupElement=that.getFormGroup(fieldData);
        			var c1 = undefined;
					if(fieldData.type==="justLabel"){
	        			c1 = UWA.createElement('div', {
							styles:{
								"margin-top": "4px",
							    "padding-top": "10px",
							    "float": "left"
							}
	        			});
					}else if(fieldData.type==="labelValue"){
	        			c1 = UWA.createElement('div', {
	        				value:fieldData.value
	        			});
					}else{
						if (fieldData.id !== undefined) {
							c1 = UWA.createElement('div', {
								'class': 'col-md-12',
								id: fieldData.id
							});
						}
						else {
							c1 = UWA.createElement('div', {
								'class': 'col-md-12'
							});
						}
						c1.addClassName(that.colLgClass);
					}
					formGroupElement.inject(c1); 
					
        			if(fieldData.accordeonHeader && typeof fieldData.accordeonHeader === 'object'){
        				accordeonRequired=true;
        				that.propertiesAccordeonView.addField(fieldData,c1);
        				return;
        			}
					
					c1.inject(row);
					

        		});

        	}
        if(accordeonRequired)that.propertiesAccordeonView.render().inject(this.outerDiv);
        this.outerDiv.inject(this.container);
  		var sc = new Scroller({
 			   element: this.outerDiv 
 			});
			sc.inject(this.container);          	
			DomUtils.addResizeListener(this.outerDiv, function() { that.update(); }, 0);
			that.update();
        	return this.container;
        },
        onDestroy : function() {
        	
        	return this._parent.apply(this, arguments);
		},
		update:function(){
			let width = this.outerDiv.parentElement.parentElement?this.outerDiv.parentElement.parentElement.getBoundingClientRect().width:
				this.outerDiv.parentElement.getBoundingClientRect().width;
			if(width < 600){
				this.outerDiv.querySelectorAll(".col-lg-6").forEach(ele=>{
					ele.classList.add('very-less-space');
					ele.classList.remove('less-space');
				});
			} else if(width < 785){
				this.outerDiv.querySelectorAll(".col-lg-6").forEach(ele=>{
					ele.classList.add('less-space');
					ele.classList.remove('very-less-space');
				});
			} else{
				this.outerDiv.querySelectorAll(".col-lg-6").forEach(ele=>{
					ele.classList.remove('less-space');
					ele.classList.remove('very-less-space');
				});
			}
		},
		toggleEditIconTooltip:function(e){
			var that = this;
			var tooltip,icon,currentEdit;
			/*This way has a limitation from OOTB
		 	* var currentEdit = (that.collectionToolbar._actionsIconBar.menu.getItem("editMode").fonticon === "pencil");
		 	*/
			that.pageOptions.editState = currentEdit = (e.target.hasClassName("fonticon-pencil") || (e.target.firstChild &&
					e.target.firstChild.hasClassName("fonticon-pencil")));
			if(currentEdit){
				 icon = "pencil-block";
				 tooltip = NLS.disable_edit;
			 }else{
				 icon = "pencil";
				 tooltip = NLS.edit;
			 }
			that.collectionToolbar._modelEvents.publish({
					event : 'enox-collection-toolbar-change-icon-action',
					data : {
						id : "editMode",
						text : tooltip,
						fonticon : icon
					}
			 });
		},
		toggleVisibilityField:function(ele){
			let toggleDiv = ele.elements?ele.elements.container:ele;
			if(toggleDiv){
				let requiredDiv,formGrouDiv;
				formGrouDiv = toggleDiv.getParents(".form-group");
				if (formGrouDiv.length > 0) {
					formGrouDiv.forEach(obj => {
						requiredDiv = obj.getElementsByClassName("label-field-required");
					});
				}
				if("none"===toggleDiv.getStyle("display")){
					toggleDiv.setStyle('display', '');
					if(requiredDiv && requiredDiv.length>0 && !toggleDiv.classList.contains("simpleText"))requiredDiv[0].setStyle('display', '');
				}
			   else{
				   toggleDiv.setStyle('display', 'none');
				   if(requiredDiv && requiredDiv.length>0 && !toggleDiv.classList.contains("simpleText"))requiredDiv[0].setStyle('display', 'none');
			   }
			}
		},
		createAutoCompleteField:function(field, viewModeField){
				let that = this;
				var tempField2 = new Autocomplete({multiSelect: field.multiSelect, placeholder: field.placeholder, name:field.name, showSuggestsOnFocus: field.showSuggestsOnFocus,
	        			floatingSuggestions: field.floatingSuggestions, allowFreeInput: field.allowFreeInput, className: field.className, tokenSeparator: field.tokenSeparator
	                     ,noResultsMessage: false,
	        			events: {
	                        onSelect: function() {
	                        	let autocompleteValue = this.selectedItems.map(val=>val.label || val.value).toString().replaceAll(",", ", ");
	                        	this.getContent().setAttribute("title",autocompleteValue); //For Tooltip
	                        	if(viewModeField){
	                        		viewModeField.title = autocompleteValue;
		                        	viewModeField.setText(autocompleteValue);	
	                        	}
	                        },
	                        onUnselect: function() {
	                        	let autocompleteValue = this.selectedItems.map(val=>val.value).toString().replaceAll(",", ", ");
	                        	this.getContent().setAttribute("title",autocompleteValue); //For Tooltip
	                        	if(viewModeField){
	                        		viewModeField.title = autocompleteValue;
		                        	viewModeField.setText(autocompleteValue);	
	                        	}
	                        },
	                        onFocus: function () {
	                        	if(field.events&&field.events.onFocus)
	                        	    field.events.onFocus(this);
	                        }
	                    }});
                tempField2.elements.container.setAttribute('propertyid', "toggleVisibility");
                if(field.dataSet)tempField2.addDataset(field.dataSet);
        		if(field.datasets)
        		{
        			var i = field.datasets;
						i.map(function(i){
							tempField2.addDataset(i);
						});
        		}
			    tempField2.setOptions(field);
			    that.fieldElements[field.name] = tempField2;
				that.fieldElementsInternal.push(tempField2);
        		return tempField2;
		},
		createHyperlinkField:function(field, toggleIt){
			var tempField2 = UWA.createElement('div', {
				'class': 'hyperlink',
				'name':field.name+"hyperlink",
				"text":field.value,
				'styles':{
					"margin": "5px 0px",
					"width" : "100%",
					"color": "#005685",
					"cursor":"pointer",
					"overflow": "hidden",
		            "text-overflow": "ellipsis",
					"display":"block",
					"white-space": "nowrap"
				},
				"events":{
					click:function(){
						if(field.callBack)
							field.callBack();
					}
				}
			});
			if(!toggleIt)tempField2.setAttribute('propertyid', "toggleVisibility");
			tempField2.title = tempField2.getText();
			return tempField2;
		},
		createTextField:function(field){
			var that = this;
			var tempField =  new Text({nonEditable:field.nonEditable, placeholder: field.placeholder ,name:field.name,value:field.value,
				isLengthy:field.isLengthy,noSpecialCharorHyphen:field.noSpecialCharorHyphen,noSpecialChar:field.noSpecialChar
				,required:field.required});
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempField.elements.input.title = tempField.elements.input.value;
		    tempField.setOptions(field);
			that.fieldElements[field.name] = tempField;
			that.fieldElementsInternal.push(tempField);
			
			return tempField;
		},
		createAutoCompleteWithSearchField:function(field, viewModeField){
			let that = this;
			let formObj = new ENOXSourcingForm();
    		var opts = JSON.parse(JSON.stringify(field));//Deep Copy
    		if(field.callback)opts.callback=field.callback;
			if(field.downloadDocument)opts.downloadDocument=field.downloadDocument;
    		opts.propertiesViewCB = function(field){
    			if(viewModeField){
    				if(!field.options.multiSelect){
    					let selectedObjectsLabel = field.getSelectedObjectAttrValue("label")?field.getSelectedObjectAttrValue("label"):"";
    					viewModeField.title = selectedObjectsLabel;
                    	viewModeField.setText(selectedObjectsLabel);	
    				}else{
    					let selectedObjectsLabels = field.autocompleteField.selectedItems.map(val=>val._options.label).toString().replaceAll(",", ", ");
    					viewModeField.title = selectedObjectsLabels?selectedObjectsLabels:"";
                    	viewModeField.setText(selectedObjectsLabels?selectedObjectsLabels:"");	
    				}
            	}
    		};
    		if(field.dataFetcherMethod)opts.dataFetcherMethod=field.dataFetcherMethod;
    		if(field.valueValidator)opts.valueValidator=field.valueValidator;
    		opts.label = undefined;
			opts.id=this.model.id;
    		let tempField = formObj.fields.autocompleteWithSearch(opts, formObj);
    		let tempFieldAutocomplete = formObj.wuxAutocompletes.filter((item) => (item._editor._myInput.name === field.name))[0];
    		tempFieldAutocomplete.setOptions(field);
    		that.fieldElements[field.name] = tempFieldAutocomplete;
    		that.fieldElementsInternal.push(tempFieldAutocomplete);
    		let tempFieldSearchButton = formObj.lists[0]; //Search Button
    		that.fieldElementsInternal.push(tempFieldSearchButton);
    		tempFieldAutocomplete.elements.container.setAttribute('propertyid', "toggleVisibility");
    		tempFieldSearchButton.elements.container.setAttribute('propertyid', "toggleVisibility");
    		let returnObj = [tempField, tempFieldAutocomplete, tempFieldSearchButton];
    		if(formObj.lists[1]){
    			let tempFieldUploadButton = formObj.lists[1]; //upload button	
        		that.fieldElementsInternal.push(tempFieldUploadButton);
        		tempFieldUploadButton.elements.container.setAttribute('propertyid', "toggleVisibility");
        		returnObj.push(tempFieldUploadButton);
    		}
    		if(field.nonEditable === true)tempFieldSearchButton.options.nonEditable = true;
			return returnObj;
		},
		createCustomeField:function(field){
			let form = new ENOXSourcingForm();
    		let tempField = form.fields.propertiesCustomField(field, form);
			return tempField;
			
		},
		createWUXDateField:function(field){
			let that = this;
			let form = new ENOXSourcingForm();
			delete field.label;
			form.fields.wuxDatePickerField(field, form);
        	var tempField = form.dates[0];
        	tempField.setOptions(field);
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempField.elements.inputField.title = field.value;
			tempField.elements.inputField.value = field.value;
        	that.fieldElements[field.name] = tempField;
        	that.fieldElementsInternal.push(tempField);
			return tempField;
		},
		//commenting as not required for TDP
		/*createSearchField:function(field){
			let that = this;
			let form = new ENOXSourcingForm();
    		let options = JSON.parse(JSON.stringify(field));//Deep Copy
    		if(field.callback)options.callback=field.callback;
    		if(field.chooserCallback)options.chooserCallback=field.chooserCallback;
            if(field.allowChooserCallback)options.allowChooserCallback=field.allowChooserCallback;
    		options.label = undefined;
    		let tempField = form.fields.searchWithChooser(options, form);
    		if(field.id)form.numbers[0].elements.input.id = field.id;
    		if(field.identifier)form.numbers[0].elements.input.setAttribute('identifier', field.identifier);
    		if(field.value)form.numbers[0].elements.input.value = field.value;
    		let tempFieldText = form.numbers[0]; //Text Field
    		let tempFieldButton = form.lists[0]; //Search Button
    		if(field.nonEditable === true)tempFieldButton.options.nonEditable = true;
    		that.fieldElements[field.name] = tempFieldText;
    		that.fieldElementsInternal.push(tempFieldText);
    		that.fieldElementsInternal.push(tempFieldButton);
    		
    		tempFieldText.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempFieldButton.elements.container.setAttribute('propertyid', "toggleVisibility");
			
			return [tempField, tempFieldText, tempFieldButton];
		},
		
		createWUXDateField:function(field){
			let that = this;
			let form = new ENOXSourcingForm();
			delete field.label;
			form.fields.wuxDatePickerField(field, form);
        	var tempField = form.dates[0];
        	tempField.setOptions(field);
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempField.elements.inputField.title = tempField.elements.inputField.value;
        	that.fieldElements[field.name] = tempField;
        	that.fieldElementsInternal.push(tempField);
			return tempField;
		},
		createTextFieldButtonField:function(field){

			let that = this;
			let form = new ENOXSourcingForm();
    		delete field.label;
    		let tempField = form.fields.textFieldButton(field, form);
    		if(field.id)form.numbers[0].elements.input.id = field.id;
    		if(field.identifier)form.numbers[0].elements.input.setAttribute('identifier', field.identifier);
    		if(field.value)form.numbers[0].elements.input.value = field.value;
    		let tempFieldText = form.numbers[0]; //Text Field
			tempFieldText.setOptions(field);
    		let tempFieldButton = form.lists[0]; //Search Button
    		if(field.nonEditable === true)tempFieldButton.options.nonEditable = true;
    		that.fieldElements[field.name] = tempFieldText;
    		that.fieldElementsInternal.push(tempFieldText);
    		that.fieldElementsInternal.push(tempFieldButton);
    		
    		tempFieldText.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempFieldButton.elements.container.setAttribute('propertyid', "toggleVisibility");
			
			return [tempField, tempFieldText, tempFieldButton];

		},*/
		createCheckboxField:function(field){
			let that = this;
        	var tempField = new WUXToggle({ type: "checkbox", label: "", checkFlag: field.checked, disabled: field.disable }); 
        	tempField.elements.container.style["margin"] = "5px 0px";
        	tempField.elements.container.style["padding"] = "2px 0px";
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
        	that.fieldElements[field.name] = tempField;
        	that.fieldElementsInternal.push(tempField);

			return tempField;
		},
		createTextAreaField:function(field){
			var that = this;
			var tempField =  new Text({nonEditable:field.nonEditable,  multiline: true,placeholder: field.placeholder ,name:field.name,value:field.value,
				isLengthy:field.isLengthy,required:field.required,maxlength:field.maxlength});
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempField.elements.input.title = tempField.elements.input.value;
		    tempField.setOptions(field);
			that.fieldElements[field.name] = tempField;
			that.fieldElementsInternal.push(tempField);
			
			return tempField;
		},
		createNumberField:function(field){
			let that = this;
    		var decimals;
    		if(field.type==='real')
    			decimals=field.decimals?field.decimals:null;
    		var tempField = new SpinBox({
    			nonEditable:field.nonEditable,
    			placeholder:field.placeholder,
    			name:field.name,
    			required:field.required,
    			value:field.value?parseFloat(field.value):0,
    			decimals:decimals, 
    			stepValue:field.stepValue?field.stepValue:1,
    		    useScientificNotationFlag : false,
    		    highExponentProperty :20,
    		    lowExponentProperty : 20,
				minValue:field.minValue,
				maxValue:field.maxValue,
				displayStyle:field.displayStyle
    		});
    		field.minValue=field.minValue || parseFloat(field.minValue)===0?parseFloat(field.minValue):-999999999998;
    		field.maxValue=field.maxValue || parseFloat(field.maxValue)===0?parseFloat(field.maxValue):999999999998;
    		field.errorText=NLS.VALUE_OUTOF_RANGE+" ("+field.minValue.toString()+" "+NLS.to+" "+field.maxValue.toString()+")";
    		tempField.elements.input=tempField.elements.inputField;
    		tempField.setOptions(field);
    		tempField.touchMode=!!('ontouchstart' in window        // works on most browsers 
    			  || navigator.maxTouchPoints);       // works on IE10/11 and Surface
    		that.fieldElements[field.name] = tempField;
    		tempField.elements.inputField.addEventListener('input',function(){
    			that.validateNumberField(tempField);
			});
			tempField.elements.inputField.addEventListener('wheel',function(event){
    			event.stopPropagation();
    		});
    		that.fieldElementsInternal.push(tempField);
    		tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
    		
    		return tempField;
		},
		createDateField:function(field){
			var that = this;
			var tempField =  new DateInput({nonEditable:field.nonEditable,placeholder: field.placeholder ,name:field.name,value:field.value,required:field.required});
			if(field.value)that.formatDate(tempField);
			tempField.addEvent('onChange', function() {
    		    this.getContent().setAttribute("title",this.getValue());  //For tooltip
    		    that.formatDate(this);
    		});
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempField.elements.input.title = tempField.elements.input.value;
		    tempField.setOptions(field);
			that.fieldElements[field.name] = tempField;
			that.fieldElementsInternal.push(tempField);
			
			return tempField;
		},
		createViewModeText:function(field, toggleIt){
			let tempField = UWA.createElement('div', {
				'class': 'simpleText',
				'name':field.name,
    			"text":field.displayValue?field.displayValue:field.value,
    			"forDisplay":field.forDisplay,
    			'styles':{
    				"margin": "5px 0px",
    				"width" : "100%",
    				"overflow-wrap": "break-word"
    			}
    		});
			if(!toggleIt)tempField.setAttribute('propertyid', "toggleVisibility");
			if(field.customTooltip)tempField.setAttribute('title', field.customTooltip);
			return tempField;
		},
		createViewModeCheckBox:function(field, toggleIt){
			let tempField = UWA.createElement('div', {
				'class': 'simpleText',
    			'styles':{
    				"margin": "5px 0px",
    				"padding" : "2px 0px"
    			}
    		});
			if(field.checked===true)
				tempField.innerHTML = "<input type='checkbox' disabled='true' checked/>";
			else
				tempField.innerHTML = "<input type='checkbox' disabled='true'/>";
			
			if(!toggleIt)tempField.setAttribute('propertyid', "toggleVisibility");
			return tempField;
		},
		createSelectField:function(field){
			var that = this;
			var tempField =  new Select({nonEditable:field.nonEditable,custom: false,placeholder: field.placeholder?field.placeholder:false, 
    				name:field.name,options:field.options,value:field.value});
			tempField.elements.container.setAttribute('propertyid', "toggleVisibility");
			tempField.elements.input.title = tempField.elements.input.value;
			if(field.options && field.options.length > 0 && field.value){
				let obj = field.options.filter((ob)=>{return field.value === ob.value;})[0];
				if(obj)tempField.elements.input.title = obj.label;
			}
		    tempField.setOptions(field);
			that.fieldElements[field.name] = tempField;
			that.fieldElementsInternal.push(tempField);
			
			return tempField;
		},
		updateHybridFieldTitleAndTooltip:function(componentField){
			this.getContent().setAttribute("title",this.getValue());  //For tooltip of text field
			componentField.title = this.getValue(); //For tooltip of hyperlink field
			componentField.setText(this.getValue()); //To update value of hyperlink if text field updated
		}
    });	
	
	return PropertiesView;
});
