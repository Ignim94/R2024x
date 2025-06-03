//XSS_CHECKED
/**
 * This file builds UI for ENOXSourcingForm
 *
 */
/* global UWA */
define('DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingForm',
    [
        'DS/UIKIT/Form',
        'UWA/Utils',
        'DS/UIKIT/Input/Text',
        'DS/UIKIT/Input/Button',
        'DS/UIKIT/Input/ButtonGroup',
        'DS/UIKIT/Input/Number',
		'DS/UIKIT/Input/Select',
        'DS/UIKIT/Input/Toggle',
        'DS/Controls/Toggle',
        'DS/Controls/SpinBox',
        'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingFormHelpers',
        'DS/Controls/DatePicker',
        'DS/UIKIT/Input/File',
        'DS/SNInfraUX/SearchCom',
        'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingFormValidations',
        'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
        'DS/ENOXPackageCommonUXInfra/TypeAHead/ENOXTypeaheadWithSearch',
		/*'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
		'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		'DS/Controls/ComboBox',
		'DS/Controls/TooltipModel',
        'DS/Controls/LineEditor',*/
		'css!DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingForm.css'
    ],
    function(Form, Utils, Text, Button, ButtonGroup, NumberInput, Select, UKToggle, WUXToggle, WUXSpinBox, FormHelpers, WUXDatePicker, 
    		File, SearchCom, FormValidations, NLSInfra, ENOXTypeaheadWithSearch/*,
    		ENOXSourcingService, ENOXSourcingConstants, WUXComboBox, WUXTooltipModel, WUXLineEditor*/) {
        'use strict';
        var _applicationChannel;
        var ENOXSourcingForm = Form.extend({
            buttonGroups: null,
            defaultOptions: {
                className: "xSourcingForm form-vertical"
            },
            init: function(u) {
            	if(u){
            	_applicationChannel=u.applicationChannel;
            	}
                this.FormValidations = new FormValidations();
                this.buttonGroups = [];
                this.wuxAutocompletes = [];
				this.wuxComboBox = [];
				this.toggleSwitches = [];
				this.customFields = [];
                this.getModelDiv = function(){
	                	let ret;
	                    if(this.elements.container.getParent() && this.elements.container.getParent().getParent() &&
	                       this.elements.container.getParent().getParent().getParent())
	                    	ret = this.elements.container.getParent().getParent().getParent().getParent();
	                    else 
	                    	ret = this.elements.container;
	                    return ret;
                	};//call only when modal is there for form when it is injected, Use carefully  
                this._parent(u);
            },
            fields: {
				//not required for TDP
                justLabel: function(options, form) {
                        //options2 = UWA.clone(options),
                        //hide = false,
/*                        defaultOptions1 = {
                            id: 'input-' + Utils.getUUID().substring(0, 6),
                            placeholder: false,
                            hidden: true
                        };

                   var textField = new NumberInput(UWA.merge(options, defaultOptions1));

                    var txtWrapper = UWA.createElement('div', {
                        html: [textField],
                        'class': 'si_create_form_txt_wrapper_hide'
                    });

                    var fieldWrapper = UWA.createElement('div', {
                        html: [txtWrapper],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        'class': ''
                        //  					styles:{
                        //  					"position": "relative",
                        //  					"width": "100%"
                        //  					}
                    });

                    // When the input text changes, fire a onChange for the form.
                   textField.addEvent('onChange', function() {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });*/
					
					var label,
                    that = form;
                    if (UWA.is(options.label)) {
                        label = UWA.createElement('label', {
                            "class": "label-only",
                            //'for': fieldWrapper.id,
                            text: UWA.i18n(options.label + that.options.labelSuffix)
                        });
                    }

                    var rtr = that.createField.call(form, label);

                    return rtr;
                },
				//not required for TDP
				// Created for showing tooltip on text field, tooltip value needs to be passed in options
				/*textWithTooltip: function (options, form) {

                    var input,label,that = form;

	                input = new WUXLineEditor({disabled:options.disabled, name:options.name, value:options.value, 
                            required:options.required});
					input.elements.container.getElementsByTagName('input')[0].getParent().style.width='100%';
                       
                    if(options.tooltip){
                        input.elements.inputField.tooltipInfos = new WUXTooltipModel({
                            shortHelp:options.tooltip
                        });
                    }

					var fieldWrapper = UWA.createElement('div', {
                        html: [input],
                        id: 'input-' + Utils.getUUID().substring(0, 6)
                    });

					if (UWA.is(options.label)) {
                        label = UWA.createElement('label', {
                            'for': fieldWrapper.id,
                            text: UWA.i18n(options.label + that.options.labelSuffix)
                        });
                    }
                    
                    form.texts.push(input);

                    input.addEvent('onChange', function () {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });

                    return that.createField.call(form, fieldWrapper, label);
                },*/
				//not required for TDP
                /*searchWithChooser: function(options, form) {
                    var enableFreeText = options.enableFreeText;
                    var label,
                        that = form,
                        //options2 = UWA.clone(options),
                        hide = options.hide || false,
                        defaultOptions1 = {
                            id: 'input-' + Utils.getUUID().substring(0, 6),
                            placeholder: false,
                            events: {
                            	onKeyDown: function(e1){
                            		e1.target.parentElement.nextElementSibling.firstElementChild.focus();	
                                }
                            }
                        };
                      if(enableFreeText) 
                          defaultOptions1.events={}; 
                    var textField = new Text(UWA.merge(options, defaultOptions1));
                    var txtWrapper = UWA.createElement('div', {
                        html: [textField],
                        styles: {
                            "position": "relative",
                            "width": "100%",
                            "pointer-events": "none"
                        }
                    });
                    
                    if(enableFreeText) {
                      txtWrapper.style["pointer-events"]="";      
                    }
                    var defaultOptions2 = {
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        placeholder: false,
                        multiple: false,
                        nativeSelect: false
                    };

                    var button = new Button(UWA.merge({
                        icon: 'search',
                        name: 'search'
                    }, defaultOptions2));
					button.elements.container.title=options.buttonTooltip?options.buttonTooltip:"";
					

                    var buttonWrapper = UWA.createElement('div', {
                        html: [button],
                        styles: {
                            "position": "relative",
                            "float": "right",
                            /*"width": "61%",*/
                            /*"bottom": "-3px"
                        }
                    });

                    button.addEvent('onClick', function() {
                    	if(options.chooserCallback && options.allowChooserCallback && options.allowChooserCallback()){//NOTE: TEMPORARY
                    		options.chooserCallback(that,textField);
                    		return;
                    	}
                        //console.log('input clicked');
                        var searchcom_socket;
                        var socket_id = UWA.Utils.getUUID();
                        //var that = this;
                        //var textfield = arguments[0];
                        that.is3DSearchActive = true;
                        if (!UWA.is(searchcom_socket)) {
                                searchcom_socket = SearchCom.createSocket({
                                    socket_id: socket_id
                                });

                                var precond = "";
                                if (options.typeSearch) {
                                    precond = "flattenedtaxonomies:\"types/" + options.typeSearch + "\"";
                                }
                                if (options.typeSearch && options.state) {
                                    precond = "flattenedtaxonomies:\"types/" + options.typeSearch + "\" AND current:\"" + options.state + "\" AND latestrevision:\"TRUE\"";
                                }
                                let sources = [ENOXSourcingConstants.SOURCE_3DSPACE];
                        		let securityContexts = {};
                            	
                            	sources.map(function(src){
                            		securityContexts[src] = {
                        				"SecurityContext": ENOXSourcingService.getSecurityContext(src)
                        			};
                            	});
                                var refinementToSnNJSON = {
                                    "title": options.label,
                                    "role": "",
                                    "mode": "furtive",
                                    "default_with_precond": true,
                                    "precond": precond,
                                    "login": securityContexts,
                                    "show_precond": false,
                                    "multiSel": options.multiSel?options.multiSel:false,
                                    "idcard_activated": false,
                                    "select_result_max_idcard": false,
                                    "itemViewClickHandler": "",
                                    "app_socket_id": socket_id,
                                    "widget_id": socket_id,
                                    "search_delegation": "3dsearch",
                                    "columns":options.predicates?options.predicates:[],
    								"default_search_criteria": "",
								    "tenant": (widget.getValue("x3dPlatformId"))? widget.getValue("x3dPlatformId"):"OnPremise"   								
                                };
                                if (options.objList) {
                                    refinementToSnNJSON.precond = "physicalid=("+options.objList+")";
                                }
                                if (options.subType) {
                                    refinementToSnNJSON.precond = "([ds6w:kind]:\"" + options.subType + "\")"; // it is missing Active/In Active Condition
                                }
                                if (options.subType && options.state) {
                                    refinementToSnNJSON.precond = "([ds6w:kind]:\"" + options.subType + "\") AND current:\"" + options.state + "\""; // it is missing Active/In Active Condition
                                }
                                if(options.excludeCondition)
                        			refinementToSnNJSON.precond += " AND "+options.excludeCondition;
                                
                                if(options.completePreCond)
                        			refinementToSnNJSON.precond  = options.completePreCond;
                                
                                if (widget.getPreference("collab-storage") !== undefined) {
                                    refinementToSnNJSON.tenant = widget.getPreference("collab-storage").value;
                                }
                                var selected_types = [options.typeSearch];
                                refinementToSnNJSON.recent_search = { //to show only selected type in recent search
                                    'types': selected_types
                                };
                                refinementToSnNJSON.app_socket_id = socket_id;
                                refinementToSnNJSON.widget_id = socket_id;
                                if (UWA.is(searchcom_socket)) {
                                    searchcom_socket.dispatchEvent('RegisterContext', refinementToSnNJSON);
                                    searchcom_socket.addListener('Selected_Objects_search', function(data) {

                                        if (options.state && (((data[0]['ds6w:status_value'])).split("."))[1].toLowerCase() !== options.state) { //Active/InActive
                                            return;
                                        }

                                        var textfield = widget.getElement('[name="' + options.name + '"]');
                                        textfield.value = data[0]['ds6w:label_value'];
                                        textfield.id = data[0]['id'];
                                        textfield.setAttribute('identifier', data[0]['ds6w:identifier']);
                                        var onkeydown = document.createEvent("Event");
                                        onkeydown.page = "searchRouteTemplate";
                                        onkeydown.initEvent("keydown", true, false);
    								if(options.callback){
    									options.callback(data,textfield);
    								}
                                        textfield.dispatchEvent(onkeydown);
                                    });
                                    searchcom_socket.dispatchEvent('InContextSearch', refinementToSnNJSON);
                                } else {
                                    throw new Error('Socket not initialized');
                                }
                                if(window.odtSearch){
                                	if(options.callback){
                                		var textfield = widget.getElement('[name="' + options.name + '"]');
    									options.callback([{}],textfield);
    								}
                                }
                        }
                    });
                    var fieldWrapper = UWA.createElement('div', {
                        html: [txtWrapper, buttonWrapper],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        styles: {
                            "position": "relative",
                            "width": "auto",
                            //"padding-bottom": "10px",
                            "display": "flex",
                            "direction": "row"
                        }
                    });

                    form.numbers.push(textField);
                    form.lists.push(button);

                    // When the input text changes, fire a onChange for the form.
                    textField.addEvent('onChange', function() {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });

                    var rtr;
                        if (UWA.is(options.label)) {
                            label = UWA.createElement('label', {
                                'for': fieldWrapper.id,
                                text: UWA.i18n(options.label + that.options.labelSuffix)
                            });
                        }
                    rtr = that.createField.call(form, fieldWrapper, label, hide);
                    return rtr;
                },*/
                buttonGroup: function(options, form) {
                    var input, label,
                        that = form,

                        defaultOptions = {
                            id: 'input-' + Utils.getUUID().substring(0, 6)
                        };
                    if(_applicationChannel){
                    options.applicationChannel=_applicationChannel;
                    }
                    options.events = {
                        onClick: function(e, button) {
                            if (!button.isActive()) {
                                this.getActive()[0].toggleActive();
                                button.toggleActive();
                            }
                        }
                    };
                    input = new ButtonGroup(UWA.merge(options, defaultOptions));

                    input.buttons.forEach((btn, idx) => {
                        form.buttons.push(btn);
                        let click = function() { //e
                            if (!this.isActive())
                                form.dispatchEvent('onClick', [this.getName(), this.getValue(), FormHelpers[options.buttons[idx].action](options, form)]);
                        };
                        let callback = click.bind(btn);
                        btn.events.container.click = callback;
                        btn.handleEvents();
                    });

                    form.buttonGroups.push(input);

                    if (UWA.is(options.label)) {
                        label = UWA.createElement('label', {
                            'for': input.options.id,
                            text: UWA.i18n(options.label + form.options.labelSuffix),
							 styles:{
                            	paddingRight:'25px'
                            }
                        });
                    }

                    return that.createField.call(form, input, label, false);
                },
				//not required for TDP
               /* toggleSwitch: function(options, form) {
                    
                    var that = form;
                    var defaultOptions = {
                        type: "switch",
                        label: options.label?options.label:'',
                        id: 'input-' + Utils.getUUID().substring(0, 6),
						name: options.name,
						disabled: !!options.disable
                    };

                    /*var switchField = new WUXToggle({
                        type: 'switch'
                    });*/

                   /* var switchField = new UKToggle(defaultOptions);

                    // When the switch changes, fire a onChange for the form.
                    switchField.addEvent('onChange', function() {
						if(options.checkFlag) {
                            options.checkFlag = false;
						}
						else {
                            options.checkFlag = true;
						}
						if(options.onChange){
                    		options.onChange(that);
                    		return;
                    	}

                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });

                    if (options.checkFlag) {
                        switchField.check();
                    }

                    var switchWrapper = UWA.createElement('div', {
                        html: [switchField]
                    });

                    var fieldWrapper = UWA.createElement('div', {
                        html: [switchWrapper],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        'class': ''
                    });

                    var rtr = that.createField.call(form, fieldWrapper);
					that.toggleSwitches.push(switchField);
                   return options.isInPropertiesView?switchField:rtr;
                },*/
                wuxDatePickerField: function(options, form) {

                    var label,
                    that = form,
                	hide = options.hide || false;

                    var wuxDatePicker = {};
                    
                    //check if minValue is today
                    let minValue=options.minValue;
                    if(options.minValue && (typeof options.minValue==='string') && options.minValue==='today'){
                    	//To set the minValue for date component
                    	let today = new Date();
                    	let yesterday = new Date();
                    	yesterday. setDate(today. getDate());
                    	minValue=yesterday;
                    }

                    wuxDatePicker = new WUXDatePicker({
                        timePickerFlag: options.timePickerFlag,
                        value: options.value? options.value: undefined,
                        minValue:minValue,
						maxValue: options.maxValue,
						disabled:options.disable?options.disable:false,
						allowUndefinedFlag: options.allowUndefinedFlag
                    });

                    form.dates.push(wuxDatePicker);
                    var fieldWrapper = UWA.createElement('div', {
                        'class': 'xcity-label-input',
                        'id':'xSourcingTimeField-'+options.id,
                        styles: {
                            "position": "relative",
                            "width": "auto",
                            "padding-bottom": "10px"
                        },
                        html: [wuxDatePicker]
                    });

                	var dateFieldInput = UWA.createElement('input', {
                		type: 'hidden',
                		name: options.name
                	}).inject(fieldWrapper);
                    
                	//use ISO date format
                	if(wuxDatePicker.value)
                	    dateFieldInput.setAttribute('value', (wuxDatePicker.value).toISOString());
                	
                	wuxDatePicker.addEventListener('change',function(){
                		dateFieldInput.setAttribute('value', wuxDatePicker.value? (wuxDatePicker.value).toISOString(): wuxDatePicker.value);
                		if(options.events && options.events.onChange){
                			options.events.onChange(wuxDatePicker.value? (wuxDatePicker.value).toISOString(): "");
                		}
            		});
                	
                    if (UWA.is(options.label)) {
                        label = UWA.createElement('label', {
                            "class": "label-only",
                            'for': fieldWrapper.id,
                            text: UWA.i18n(options.label + that.options.labelSuffix)
                        });
                    }


                    var rtr = that.createField.call(form, fieldWrapper, label, hide);

                    return rtr;
                },
				//not required for TDP
                /*buildFileField: function(options, form) {

                    var input, label,
                        that = form,
                        fieldWrapper,
                        defaultOptions = {
                            id: 'input-' + Utils.getUUID().substring(0, 6)
                        };

                    input = new File(UWA.extend(options, defaultOptions, true));

                    form.files.push(input);

                    // When the file changes, fire a onChange for the form.
                    input.addEvent('onChange', function() {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });

                    if (UWA.is(options.label) || UWA.is(options.name)) {
                        label = UWA.createElement('label', {
                            'for': input.getId(),
                            text: UWA.i18n((options.label || options.name) + that.options.labelSuffix)
                        });
                    }

                    //clear Button
                    var button = new Button(UWA.merge({
                        value: 'Clear',
                        name: 'Clear'
                    }, defaultOptions));

                    var buttonWrapper = UWA.createElement('div', {
                        html: [button],
                        styles: {
                            "position": "relative",
                            "float": "right",
                            /*"width": "61%",*/
                           /* "bottom": "0px"
                        }
                    });

                    button.addEvent('onClick', function() {
                        var fileField = arguments[0];
                        fileField.target.getParent().previousSibling.firstChild.lastChild.value = '';
                        fileField.target.getParent().previousSibling.firstChild.id = '';
                    });

                    fieldWrapper = that.createField.call(form, input, label);

                    input.elements.textfield.onfocus = function() {
                        fieldWrapper.toggleClassName('focused', true);
                    };

                    input.elements.textfield.onblur = function() {
                        fieldWrapper.toggleClassName('focused', false);
                    };

                    var fileWrapper = UWA.createElement('div', {
                        html: [input],
                        styles: {
                            "position": "relative",
                            "width": "90%"
                        }
                    });

                    var fieldWrapper1 = UWA.createElement('div', {
                        html: [fileWrapper, buttonWrapper],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        styles: {
                            "position": "relative",
                            "width": "auto",
                            "padding-bottom": "10px",
                            "display": "flex",
                            "direction": "row"
                        }
                    });

                    var rtr = that.createField.call(form, fieldWrapper1, label);

                    return rtr;
                },*/
				//not required for TDP
                //Creating this because UIKIT code has a bug that does not take the hide parameter into account
                /*concealableList: function(options, form) {
                    var input, label,
                        that = form,
                        hide = options.hide || false,
                        defaultOptions = {
                            id: 'input-' + Utils.getUUID().substring(0, 6),
                            placeholder: false,
                            multiple: false,
                            nativeSelect: false
                        };

                    input = new Select(UWA.merge(options, defaultOptions));

                    form.lists.push(input);

                    // When the list changes, fire a onChange for the form.
                    input.addEvent('onChange', function() {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue()[0], options.onchange]);
                    });

                    if (UWA.is(options.label) || UWA.is(options.name)) {
                        label = UWA.createElement('label', {
                            'for': input.getId(),
                            text: UWA.i18n((options.label || options.name) + that.options.labelSuffix)
                        });
                    }
                    
                    if(options.infoText){
                    	input = UWA.createElement('div', {
	                		html: [input]
	                	});
                    	input.appendChild(UWA.createElement('span', {
                             text: options.infoText,
                             'class': 'form-control-helper-text',
                             styles:{
                             	display:"block"
                             }
                         }));
                    }

                    return that.createField.call(form, input, label, hide);
                },*/
				//not required for TDP
                /*textFieldButton : function(options, form) {
                    var label,
                        that = form,
                        //options2 = UWA.clone(options),
                        hide = options.hide || false,
                        defaultOptions1 = {
                            id: 'input-' + Utils.getUUID().substring(0, 6),
                            placeholder: false
                        };
                    var textField = new Text(UWA.merge(options, defaultOptions1));


                    var txtWrapper = UWA.createElement('div', {
                        html: [textField],
                        styles: {
                            "position": "relative",
                            "width": "100%",
                            "pointer-events": "none"
                        }
                    });

                    var defaultOptions2 = {
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        placeholder: false,
                        multiple: false,
                        nativeSelect: false
                    };

                    var button = new Button(UWA.merge({
                        //value: options.buttonLabel?options.buttonLabel:'...',
                    	icon:'cog',
                        name: 'search_attr',
                        disabled: options.enableButton?false:(options.disable?options.disable:false),
                        keepEnabled:options.enableButton
                    }, defaultOptions2));
                        button.elements.container.style.minWidth='38px';
                        button.elements.icon.style.marginLeft='12%';
                        button.elements.icon.style.color='grey';
                        button.elements.container.title=options.buttonTooltip?options.buttonTooltip:"";
                    var buttonWrapper = UWA.createElement('div', {
                        html: [button],
                        styles: {
                            "position": "relative",
                            "float": "right",
                            /*"width": "61%",*/
                            /*"bottom": "-3px"
                        }
                    });

                    //starts :: show grid
                    if(options.onClick)
                    	button.addEvent('onClick', options.onClick);
                    //ends :: show grid
                    
                    var fieldWrapper = UWA.createElement('div', {
                        html: [txtWrapper, buttonWrapper],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        styles: {
                            "position": "relative",
                            "width": "auto",
                            "padding-bottom": "10px",
                            "display": "flex",
                            "direction": "row"
                        }
                    });

                    form.numbers.push(textField);
                    form.lists.push(button);

                    // When the input text changes, fire a onChange for the form.
                    if(!options.disableOnchange){
                    textField.addEvent('onChange', function() {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });
                    }

                    var rtr;
                    if(!options.isInPropertiesView){
                        if (UWA.is(options.label)) {
                            label = UWA.createElement('label', {
                                'for': fieldWrapper.id,
                                text: UWA.i18n(options.label + that.options.labelSuffix)
                            });
                        }
                    }
                    rtr = that.createField.call(form, fieldWrapper, label, hide);
                    return rtr;
                },*/
				//not required for TDP
                /*textFieldExpandDiv : function(options, form) {
                    var label,
                        that = form,
                        //options2 = UWA.clone(options),
                        hide = options.hide || false,
                        defaultOptions1 = {
                            id: 'input-' + Utils.getUUID().substring(0, 6),
                            placeholder: false,
                            disabled:true
                        };
                    var textField = new Text(UWA.merge(options, defaultOptions1));


                    var txtWrapper = UWA.createElement('div', {
                        html: [textField],
                        styles: {
                            "position": "relative",
                            "width": "calc(100% - 20px)",
                            "pointer-events": "none",
                            "display":"inline-block"
                        }
                    });

                    //Button
                    var expanderButton = UWA.createElement('span', {
                    	"class":"expanderButton fonticon fonticon-expand-left"
                    });

                    var expanderButtonWrapper = UWA.createElement('div', {
                        html: [expanderButton],
                        styles: {
                            "position": "relative",
                            "float": "right",
                            "bottom": "-3px",
                            "width":"20px",
                			"height":"24px"
                        },
                        events:{
                        	click:function(){
                            	if(expanderDiv.style.display==="none"){
                            		expanderDiv.style.display="block";
                            		expanderButton.className = expanderButton.className.replace(/\bfonticon-expand-left\b/g, "fonticon-expand-down");
                            		fieldWrapper.getElementsByClassName("form-control-helper-text")[0].style.display="none";
                            	}
                            	else{
                            		expanderDiv.style.display="none";
                            		expanderButton.className = expanderButton.className.replace(/\bfonticon-expand-down\b/g, "fonticon-expand-left");
                            		fieldWrapper.getElementsByClassName("form-control-helper-text")[0].style.display="block";
                            	}
                            }
                        }
                    });

                    //Div
                    var expanderDiv = UWA.createElement('div', {
                    	"class":"expanderDiv",
                    	html:[options.expanderContent],
                        "styles": {
                           "display":"none"
                        }
                    });
                    
                    var fieldWrapper = UWA.createElement('div', {
                        html: [txtWrapper, expanderButtonWrapper,expanderDiv],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        styles: {
                            "position": "relative",
                            "width": "auto"
                          //  "padding-bottom": "10px"
                        }
                    });

                    form.numbers.push(textField);
                    form.lists.push(expanderButton);

                    // When the input text changes, fire a onChange for the form.
                    if(!options.disableOnchange){
                    textField.addEvent('onChange', function() {
                        that.dispatchEvent('onChange', [this.getName(), this.getValue(), options.onchange]);
                    });
                    }

                    var rtr;
                    if(!options.isInPropertiesView){
                        if (UWA.is(options.label)) {
                            label = UWA.createElement('label', {
                                'for': fieldWrapper.id,
                                text: UWA.i18n(options.label + that.options.labelSuffix)
                            });
                        }
                    }
                    rtr = that.createField.call(form, fieldWrapper, label, hide);
                    return options.isInPropertiesView?{component:rtr,textField:textField,buttonField:expanderButton}:rtr;
                },*/
                autocompleteWithSearch : function(options, form) {
                	var label,
                	that = form;
                	var hideOption = options.hide?options.hide:false;
                	var enoxTypeaheadWithSearch = new ENOXTypeaheadWithSearch();
                	var wrappedField = enoxTypeaheadWithSearch.createField(options);
                	var inputField = enoxTypeaheadWithSearch.getInputField();
                	inputField.addClassName("form-control form-control-root"); //For helper/error texts
                	enoxTypeaheadWithSearch.autocompleteField.addEventListener('change', function() {
                		that.dispatchEvent('onChange');
                		if(options.events && options.events.onChange)options.events.onChange();
                     });
                     if(options.id || options.identifier || (options.values && options.values.length > 0)){
                    	var model;
                    	var processedObj = [];
                    	if(options.values && options.values.length > 0){ //Multi-select case
                    		options.values.forEach(function(obj){
                                processedObj.push({ "ds6w:label": obj.value, "resourceid": obj.id, "id": obj.id, "type": obj.type, "sourceid": obj.sourceid });
                    		});
                    	}
                    	else{
                    		processedObj = [{"ds6w:label": options.value, "resourceid":options.identifier?options.identifier:options.id}]; //Just for model creation method  
                    	}
                    	model = enoxTypeaheadWithSearch.createModel(processedObj); //Just for model creation method
                    	if(model.getRoots())enoxTypeaheadWithSearch.autocompleteField.selectedItems = options.multiSelect?model.getRoots():model.getRoots()[0];
                     }
                	form.numbers.push(inputField);
                    form.lists.push(enoxTypeaheadWithSearch.searchButton);
                    if(enoxTypeaheadWithSearch.uploadButton)
                        form.lists.push(enoxTypeaheadWithSearch.uploadButton);
                    if(enoxTypeaheadWithSearch.downloadButton)
                        form.lists.push(enoxTypeaheadWithSearch.downloadButton);
                    enoxTypeaheadWithSearch.autocompleteField.setOptions(options);
                    enoxTypeaheadWithSearch.autocompleteField.fieldController = enoxTypeaheadWithSearch;
                    form.wuxAutocompletes.push(enoxTypeaheadWithSearch.autocompleteField);
                    
            		if (UWA.is(options.label)) {
            			label = UWA.createElement('label', {
            				'for': wrappedField.id,
            				text: UWA.i18n(options.label + that.options.labelSuffix)
            			});
            		}
            		
            		if (options.multiSelect) {
	            		UWA.createElement('span', {
	            			text: options.errorText,
	            			'class': 'form-control-error-text multiselect'
	            		}).inject(wrappedField.firstElementChild);
            		}
                	
            		let field = that.createField.call(form, wrappedField, label, hideOption);
            		field.setAttribute('propertyid', "toggleVisibility");
            		if(options.allowDrop)FormHelpers.makeFieldDroppable({...options, dropArea:field, fieldController:enoxTypeaheadWithSearch, form:form});
            		return field;
                },
				//not required for TDP
                /*customNumberField : function(options, form) {
                	var label,
                	that = form,
                	hide = options.hide || false;

                	var istouchMode=!!('ontouchstart' in window 
              			  || navigator.maxTouchPoints);       	
                	var decimals;
                	if(options.subtype && options.subtype.toLowerCase()==='real')
            			decimals=options.decimals?options.decimals:9;
                	var textField = new WUXSpinBox({
            			placeholder:options.placeholder,name:options.name,
            			required:options.required,value:parseFloat(options.value),
            			disabled:options.disable?options.disable:false,
            			//minValue:options.minValue?parseFloat(options.minValue):0, 
            			//maxValue:options.maxValue?parseFloat(options.minValue):(Number.MAX_SAFE_INTEGER-1), 
            			decimals:decimals, stepValue:options.stepValue?options.stepValue:1,
            			useScientificNotationFlag : false,
						requiredFlag:options.required?options.required:false,
            			highExponentProperty :20,
            			lowExponentProperty : 20,
            			touchMode:options.disableTouchMode?false:istouchMode,
            			displayStyle:"lite" 
            		});
                	options.minValue=options.minValue || parseFloat(options.minValue)===0?parseFloat(options.minValue):-999999999998;
                	options.maxValue=options.maxValue || parseFloat(options.maxValue)===0?parseFloat(options.maxValue):999999999998;
                	textField.elements.container.style.width="100%";
                	if(!options.enableRightSideButtons){
                		textField.getContent().addClassName("xsrc-hide-spinbox-buttons");
                	}
                	textField.elements.inputField.name=options.name;
                	textField.setOptions(options);
                	
                	var fieldWrapper = UWA.createElement('div', {
                		html: [textField],
                		id: 'input-' + Utils.getUUID().substring(0, 6),
                		styles: {
                			"position": "relative",
                			"width": "auto",
                			"padding-bottom": "10px"
                		}
                	});
                	

                	fieldWrapper.appendChild(UWA.createElement('span', {
                        'class': 'form-control-error-text'
                    }));

                    fieldWrapper.appendChild(UWA.createElement('span', {
                        text: options.helperText?options.helperText:"",
                        'class': 'form-control-helper-text',
                        styles:{
                        	display:options.helperText?"block":"none"
                        }
                    }));
                	
                	textField.elements.inputField.addEventListener('input',function(){
            			that.FormValidations.validateNumberField([textField]);
            		});
                	textField.addEventListener('change',function(){
            			that.FormValidations.validateNumberField([textField]);
                    });
                    textField.addEventListener('wheel',function(event){
						event.stopPropagation();
					});
            		
            		//Events are applied directly on input field of the component
                	if(options.events){
                		for(let key in options.events){
                			if(key)
                				textField.elements.inputField.addEventListener(key,options.events[key]);
                		}
                	}

                	//Events are applied on webux spinbox component
                	if(options.componentEvents){
                		for(let key in options.componentEvents){
                			if(key)
                				textField.addEventListener(key,options.componentEvents[key]);
                		}
                	}
                	if(istouchMode){
                		textField.elements.inputField.style.paddingLeft='10px';
                		textField.elements.inputField.style.paddingRight='10px';
                	}
                		
                	form.numbers.push(textField);
                	var rtr;
                		if (UWA.is(options.label)) {
                			label = UWA.createElement('label', {
                				'for': fieldWrapper.id,
                				text: UWA.i18n(options.label + that.options.labelSuffix)
                			});
                		}
                	rtr = that.createField.call(form, fieldWrapper, label, hide);
                	return options.returnNumberField?{component:rtr,textField:textField}:rtr;
                },*/
				//not required for TDP
                /*hyperlinkWithText : function(options, form) {
                                var label,
                        that = form;
                    var option=this;
                    var tempField = this.createHyperlinkField(options,"toggleVisibility");

                    var textField = this.createTextField(options,"toggleVisibility");
                    textField.elements.container.setStyle("display", "none");
                    
                    var tempWrapper = UWA.createElement('div', {
                        html: [tempField],
                        styles: {
                            "position": "absolute",
                            "width": "100%",
                            "pointer-events": ""
                        }
                    });
                    var textWrapper = UWA.createElement('div', {
                        html: [textField],
                        styles: {
                            "position": "absolute",
                            "width": "100%",
                            "pointer-events": ""
                        }
                    });

                    var fieldWrapper = UWA.createElement('div', {
                        html: [tempWrapper, textWrapper],
                        id: 'input-' + Utils.getUUID().substring(0, 6),
                        styles: {
                            "position": "relative",
                            "width": "auto",
                            "display": "flex",
                            "direction": "row"
                        }
                    });

                    //form.lists.push(tempField);
                    form.hyperlink=[];
                    form.hyperlink.push(tempField);
                    form.texts.push(textField);
                    
                    textField.onChange =  function(){
                        option.updateHybridFieldTitleAndTooltip.call(this,tempField);
                    }; 

                        if (UWA.is(options.label)) {
                        label = UWA.createElement('label', {
                            "class": "text",
                            'for': tempField.id,
                            text: UWA.i18n(options.label + that.options.labelSuffix)
                        });
                    }
                   var rtr = that.createField.call(form, fieldWrapper, label);
                    //var rtr = that.createField.call(form, tempField, label);
                    return rtr;
                },*/
				//not required for TDP
                /*createHyperlinkField:function(field,id){
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
                            if(id)
                                tempField2.setAttribute('propertyid', id);
                            tempField2.title = tempField2.getText();
                            return tempField2;
		              },*/
				//not required for TDP
	            /*createTextField:function(field, id){
                        var tempField =  new Text({nonEditable:field.nonEditable, placeholder: field.placeholder ,name:field.name,value:field.value,
                            isLengthy:field.isLengthy,noSpecialCharorHyphen:field.noSpecialCharorHyphen,noSpecialChar:field.noSpecialChar
                            ,required:field.required});
                        if(id)
                            tempField.elements.container.setAttribute('propertyid', id);
                        tempField.elements.input.title = tempField.elements.input.value;
                        tempField.setOptions(field);
                        return tempField;
                },*/
				//not required for TDP
                /*updateHybridFieldTitleAndTooltip:function(componentField){
                        this.getContent().setAttribute("title",this.getValue());  //For tooltip of text field
                        componentField.title = this.getValue(); //For tooltip of hyperlink field
                        componentField.setText(this.getValue()); //To update value of hyperlink if text field updated
                },*/
				//not required for TDP
                /*checkbox:function(options, form){
                	var label,
                	that = form;

                	var textField = new WUXToggle({ type: "checkbox", label: options.label, value: options.value, checkFlag: options.checked, disabled: options.disable });
                	textField.setOptions(options);
                	var fieldWrapper = UWA.createElement('div', {
                		html: [textField],
                		id: 'checkbox-' + Utils.getUUID().substring(0, 6),
                		styles: {
                			"position": "relative",
                			"width": "auto"
                		}
                	});
                	
                	var checkboxInput = UWA.createElement('input', {
                		type: 'hidden',
                		name: options.name
                	}).inject(fieldWrapper);
                	checkboxInput.setAttribute('value', textField.checkFlag);
                	textField.addEventListener('change',function(){
                		textField.value = textField.checkFlag;
                		textField.elements.checkSign.value = textField.checkFlag;
                		checkboxInput.setAttribute('value', textField.checkFlag);
                		if(options.events && options.events.onChange){
                			options.events.onChange(textField.checkFlag);
                		}
            		});
                	let errorObjects=[];
                	try{
                		textField.getContent().getElementsByTagName("label")[0].style.height="auto";
                	}catch(error){
                		errorObjects.push(error);
                	}
                	var rtr;
                	rtr = that.createField.call(form, fieldWrapper, label);
                	return rtr;
                },*/
				//not required for TDP
				/*comboboxDropdown:function(options, form) {
					let that = form;
					let label;
					let myMultiSelCombo = new WUXComboBox({
      					elementsList: options.elementsList,
      					multiSelFlag: options.multiSelFlag,
      					enableSearchFlag: options.enableSearchFlag,
						name: options.name,
						placeholder: options.placeholder,
						value: options.value,
						disabled: !!options.disable
    				});
					let comboboxWrapper = UWA.createElement('div', {
                		html: [myMultiSelCombo],
                		id: options.id,
                		'class': options.className
                	});
					if (UWA.is(options.label)) {
                        label = UWA.createElement('label', {
                           	"class": "comboboxLabel",
							styles: {
								"font-weight": "bold",
								"margin-bottom": "5px"
							},
                            'for': comboboxWrapper.id,
                            text: UWA.i18n(options.label)
                    	});
					}
					let rtr;
                	rtr = that.createField.call(form, comboboxWrapper, label);
					that.wuxComboBox.push(myMultiSelCombo);
                	return rtr;
				},*/
				customField: function(options, form) {
				    let that = form;
			        let label;

				    let customFieldWrapper = UWA.createElement('div', {
                		html: [options.content],
                		id: options.id,
                		'class': options.className
                	});
	                if (UWA.is(options.label)) {
	                        label = UWA.createElement('label', {
	                           	"class": "customFieldLabel",
								styles: {
									"font-weight": "bold",
									"margin-bottom": "7px"
								},
	                            'for': customFieldWrapper.id,
	                            text: UWA.i18n(options.label)
	                    	});
						}
					let rtr;
	                rtr = that.createField.call(form, customFieldWrapper, label);
	                that.customFields.push(options.content);
	                return rtr;
				},
				
				propertiesCustomField: function(options, form) {
				    let that = form;
			        let label;

				    let customFieldWrapper = UWA.createElement('div', {
                		html: [options.content],
                		id: options.id,
                		'class': options.className
                	});
					let rtr;
	                rtr = that.createField.call(form, customFieldWrapper, label);
	                that.customFields.push(options.content);
	                return rtr;
				}
            }
        });

        return ENOXSourcingForm;

    });

