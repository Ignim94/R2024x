//XSS_CHECKED
/* global UWA */
/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/Package/CreatePackage',
		[ 
			'DS/UIKIT/Scroller',
			'DS/Controls/Toggle',
			'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingForm',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/TreeModel/TreeDocument',
			'DS/TreeModel/TreeNodeModel',
			'DS/ENOXPackageManagement/helpers/CommonHelper',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants'
			],function(Scroller,WUXToggle,ENOXSourcingForm, 
			NLS, NLSInfra,TreeDocument, TreeNodeModel,CommonHelper,ENOXPackageCommonConstants){
	'use strict';
	var CreatePackage = function(controller){
		this.packageController = controller;
		this.commonHelper = new CommonHelper();
	};
	CreatePackage.prototype.render= function(options){
		
		this._container = options._container;
		this.router=options.router;
		this._applicationChannel = options._applicationChannel;
		var that=this;
        
		var packageDiv = UWA.createElement('div', {
			id : 'CreatePackage',
			styles:{
	   			 height:'100%'
	   		 },
			'class': 'CreatePackage modalBodyDiv'
		});
		var requiredElements = new TreeDocument();
		options.elementsRequiredRange.forEach((element) => {
			requiredElements.addRoot(new TreeNodeModel({
			  label: element.grid.name,
			  value: element.grid.name
			}));
		});
		let isMaturedCheckboxValue = true;
		let checkboxLabel = UWA.createElement('div', {
                "id": "checkboxLabel",
                text: NLS.release_package_based_on_maturity
        });
		let checkbox = new WUXToggle({ type: "checkbox", name: 'isReleased', label: "", checkFlag: true });
		checkbox.addEventListener('change', (e) =>  {
     		isMaturedCheckboxValue = e.dsModel.checkFlag;
		});
		let checkboxWrapper = UWA.createElement('div', {
                html: [checkboxLabel, checkbox],
                id: 'checkboxWrapper'    
       });
       that.fields=[{
				type: 'text',
				label: NLS.title,
				placeholder: NLS.enter_title,
				name:'title',
				required:true,
				errorText: NLSInfra.please_enter_title,
				"isLengthy": false,
				"helperText": NLSInfra.length_100_limit
			},
			 {
                type: 'select',
                label: NLS.Package_Level,
                name: 'PackageLevel',
                width: '100px',
                options: [{
       	            	 "label": "",
       	            	 "selected": "true",
    	            	 "value": ""
    	             },{
       	            	 "label": NLS.CONCEPTUAL,
    	            	 "value": "Conceptual Level"
    	             },
    	             {
    	            	 "label": NLS.DEVELOPMENTAL,
    	            	 "value": "Developmental Level"
    	             },
    	             {
    	            	 "label": NLS.PRODUCT,
    	            	 "value": "Product Level"
    	             }]
            },
			{
				type: 'autocompleteWithSearch',
				placeholder: NLS.ElementsRequired_Placeholder,
				multiSelect:true,
				className: "src-multi-select-autocomplete",
                label: NLS.tdp_elements_required,
                name: 'TDPElements',
				minLengthBeforeSearch:'disable', //To load data on focus directly
				typeDelayBeforeSearch:'disable', //To not wait for user to stop typing as data loaded on focus
				keepSearchResultsFlag:'disable', //As data loaded once only, hence disabling
				searchButtonNotRequired: true,
				elementsTree : requiredElements
			},
			{
				type: 'customField',
				id: 'isReleased',
				name: 'isMaturedWrapper',
				content: checkboxWrapper
			},
			{
				type: 'text', 
				label: NLS.target_format_recommendations_title,
				placeholder: NLS.export_format_recommendations_placeholder,
				name:'formats',
				errorText: NLSInfra.please_enter_title,
				"isLengthy": false,
				"helperText": NLSInfra.length_100_limit
			},
			{
				type: 'autocompleteWithSearch',
				placeholder: NLS.package_product_context_placeholder,
				className: "product-context",
                label: NLS.package_product_context_label,
                name: 'TDP_PackageContext',
				errorText: NLSInfra.max_char_limit_err_msg,
        		isLengthy: false,
				multiSelect : false,
				showSuggestsOnFocus : true,
				floatingSuggestions : false,
				allowFreeInput : true,
				allowDrop : false,
				searchButtonNotRequired: false,
				sources: [ENOXPackageCommonConstants.SERVICE_3DSPACE],
				completePreCond: ENOXPackageCommonConstants.QUERY_ENG_ITEM_SEARCH
			},
			{
				type: 'textarea',
				label: NLS.disclaimer,
				name:'disclaimer',
				placeholder: NLS.enter_disclaimer,
				"maxlength":1000,
				"helperText": NLS.Disclaimer_Helper_Text

			},
			{
				type: 'textarea',
				label: NLS.description,
				name:'description',
				placeholder: NLS.enter_description,
				errorText: NLSInfra.max_char_limit_err_msg,
				"isLengthy": true,
				"helperText": NLSInfra.length_256_limit
			}
	
		];
			
			var createForm = new ENOXSourcingForm({
				grid:"4,8",
				fields:that.fields,
							events:{
								onSubmit: async function() {
									var isOk = true;
									var postData = {};
									postData.data = [];
									if (this.texts.length > 0)
										isOk = this.FormValidations.charLimitValidate(this.texts);
									if (this.wuxAutocompletes.length > 0) {
										//isOk = createForm.FormValidations.wuxAutoCompleteValidation(this.wuxAutocompletes);
										isOk = isOk && createForm.FormValidations.wuxAutoCompleteMaskingValidation(this.wuxAutocompletes);
									}
									if (modal && modal.destroy && isOk) {
										options.formValues = createForm.getValues();
										options.formValues.TDPElements = createForm.wuxAutocompletes[0].value;
										options.formValues.contextProductId = "";
										if (createForm.wuxAutocompletes[1].selectedItems) {
											options.proxyRequestData = that.packageController.helper.getProxyPayload(createForm.wuxAutocompletes[1].selectedItems);
											let proxyResponseData = await that.packageController.model.getProxyObject(options).catch(() => {
												widget.notificationUtil.showError(NLS.error_getting_proxy_object);
											});
											options.formValues.contextProductId = proxyResponseData.data[0].proxyId;
										}
										options.formValues.isReleased = String(isMaturedCheckboxValue);
										that.packageController.create(options);
										modal.destroy();
									}

								},
								onInvalid:function(){
									//console.log("Required Fields are not set");
								},
								onChange: function() {
									if(this.texts.length>0)
										this.FormValidations.charLimitValidate(this.texts);
								}
							}            
			}).inject(packageDiv);
			
	    	//For ODT
	    	if(window.odtForm){
				window.odtForm = createForm;
			}
	    	
			let modal = that.commonHelper.prepareModal(packageDiv,NLS.new_package,'540px');
			new Scroller({
				element: packageDiv
			}).inject(modal.getBody());		
	};    
	return CreatePackage;
});
