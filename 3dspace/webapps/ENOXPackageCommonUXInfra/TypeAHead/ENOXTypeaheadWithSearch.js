//XSS_CHECKED
/* eslint no-useless-call: "off" */
/* global widget */
/* global UWA */
/*eslint no-else-return: "off"*/
define('DS/ENOXPackageCommonUXInfra/TypeAHead/ENOXTypeaheadWithSearch',
		[
		 	'UWA/Utils',
		 	'DS/WUXAutoComplete/AutoComplete',
		 	'DS/UIKIT/Input/Button',
		 	'DS/ENOXPackageCommonUXInfra/Search/ENOXPackageSearch',
		 	'DS/TreeModel/TreeDocument', 'DS/TreeModel/TreeNodeModel',
		 	'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
		 	'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		 	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
		 	'DS/UIKIT/Mask',
		 	'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingFormValidations', 
		 	'DS/TreeModel/BaseFilter'
		],function(Utils, Autocomplete, Button, ENOXSourcingSearch,  TreeDocument, TreeNodeModel, SearchUtility, Constants,
				NLS, UIMask, FormValidation, BaseFilter){
	'use strict';

    var ENOXTypeaheadWithSearch = function() {};
    
    //UI Methods
    
    /*
     * Purpose: Initialize prerequisites and call init of this component
     * returns field
     * 
     */
    ENOXTypeaheadWithSearch.prototype.createField = function(options) {
    	var that=this;
		that.searchUtil =  new SearchUtility();
		//that.memberInfoProvider = new MemberInfoProvider();
		that.options = options;
		that.FormValidation = new FormValidation();
		return that.initComponents(options);
    };
    
    /*
     * Purpose: Initialize Field, Buttons, event handlers and call setup of data setter
     * returns field
     */
    ENOXTypeaheadWithSearch.prototype.initComponents = function(options) {
		var that = this;
		that.autocompleteField = new Autocomplete(that.setAutocompleteOptions(options)); //Autocomplete field
		//Below condition: SelectedItems can be a treenodemodel or array of treenodemodels. Due to OOTB issue empty array can't be passed
		if((Array.isArray(options.selectedItems) && options.selectedItems.length > 0) || (!Array.isArray(options.selectedItems) && options.selectedItems)){
			that.autocompleteField.selectedItems = options.selectedItems?options.selectedItems:[];//Due to OOTB bug, done this workaround
			that.valueSelectionCallback(that);
		}
		that.searchButton = new Button({icon: 'search', name: 'search_'+options.name}); //Search Button
		if(options.multiSelect){
			let className = "multiSelectAutocomplete";
			className += that.isTouchView()?"_Touch":"_NonTouch";
			that.searchButton.elements.container.addClassName(className);
			that.autocompleteField.elements.container.querySelector("input").addClassName("input-sm");
		}
		//if(options.enableUpload)that.uploadButton = new Button({icon: 'upload', name: 'upload_'+options.name,attributes: { title: 'Upload'}}); //Upload Button
		//if(options.enableDownload)that.downloadButton = new Button({icon: 'download', name: 'download_'+options.name,attributes: { title: 'Download'}}); //download button
		that.handleEvents();
		that.validateValue();
		let wrappedField = that.wrapComponents();
		return wrappedField;
	};
	
    
	/*
	 * Purpose: Setup event handlers
	 */
	ENOXTypeaheadWithSearch.prototype.handleEvents = function(){
		var that = this;
		//that.setEditorClickSuggestionsOnFocus();
		that.handleChangeEvent();
		that.handleKeyEvents();
		that.handleLostFocusForEditor();
		that.handleButtonClickEvent();
		//if(that.uploadButton)that.handleUploadButtonClickEvent();
		//if(that.downloadButton)that.handleDownloadButtonClickEvent();
	};
	
	/*
	 * Purpose: Value changed then do validation and callback for change event, like getting proxy id etc.
	 */
	ENOXTypeaheadWithSearch.prototype.handleChangeEvent = function(){
		var that = this;
		that.autocompleteField.addEventListener('change', async () => {
			that.valueSelectionCallback(that);
			that.FormValidation.wuxAutoCompleteValidation([that.autocompleteField]);
		});
	};
	
	/*
	 * Purpose: To track entered text so that eventually can be used to re-apply in blur event as OOTB by default cleans up text when clicked outside field
	 * That text will be used in button search event as a query for federated search call
	 */
	ENOXTypeaheadWithSearch.prototype.handleKeyEvents = function(){
		var that = this;
		that.getInputField().onkeyup = function() {
			that._enteredText = that.autocompleteField._editor.valueToCommit;
		};
	};
	
	/*
	 * Purpose: When clicked outside by default OOTB clears field if it just a text and not actual value. We need to persist the text so that user can use it to search objects using button.
	 */
	ENOXTypeaheadWithSearch.prototype.handleLostFocusForEditor = function(){
		var that = this;
		that.autocompleteField._editor.addEventListener('blur', function() {
			if(that.autocompleteField.selectedItems === undefined && that._enteredText !==  undefined)
				that.getInputField().value = that._enteredText;
			else if(that.autocompleteField.selectedItems !== undefined && !Array.isArray(that.autocompleteField.selectedItems))
				that.getInputField().value = that.autocompleteField.selectedItems.getLabel();
		});
	};
	
	ENOXTypeaheadWithSearch.prototype.handleButtonClickEvent = function(){
		var that = this;
		that.searchButton.addEvent('onClick', that.invokeSearch.bind(that));
		that.searchButton.addEvent('touchstart', that.invokeSearch.bind(that));
	};
	
	/*ENOXTypeaheadWithSearch.prototype.handleUploadButtonClickEvent = function(){
		var that = this;
		that.uploadButton.addEvent('onClick', that.launchFileChooser.bind(that));
		that.uploadButton.addEvent('touchstart', that.launchFileChooser.bind(that));
	};*/

	/*ENOXTypeaheadWithSearch.prototype.handleDownloadButtonClickEvent = function(){
		var that = this;
		that.downloadButton.addEvent('onClick',that.downloadDocument.bind(that));
		that.downloadButton.addEvent('touchstart',that.downloadDocument.bind(that));
	};*/


	
	/*
	 * Purpose: For Button click search
	 */
	ENOXTypeaheadWithSearch.prototype.invokeSearch = function(){
		var that = this;
		var searchPayload = that.getSuggestedObjectsPayloadForSearch();
		let resourceid_not_in = (that.options.multiSelect && that.autocompleteField.selectedItems)?that.autocompleteField.selectedItems.map((ob)=>ob._options.resourceid):[];
		resourceid_not_in = resourceid_not_in.length === 0  ? (that.options.resourceid_not_in ? that.options.resourceid_not_in : resourceid_not_in ): resourceid_not_in;
		if(that.getInputField().value !== "" && that.getInputField().value !== "***" && !that.autocompleteField.selectedItems){
			if(that.options.isPersonOrGroup){
				searchPayload.specific_source_parameter[Constants.SOURCE_3DSPACE] = {"additional_query":""+Constants.AND+"([ds6w:label]:(*"+that.getInputField().value+"*)"+ Constants.OR +"[ds6w:identifier]:(*"+that.getInputField().value+"*))"};
				if(searchPayload.tenant !== Constants.ONPREMISE){
					searchPayload.specific_source_parameter[Constants.SOURCE_USERGROUPS] = {"additional_query":""+Constants.AND+"[ds6w:label]:(*"+that.getInputField().value+"*)"};
				}
			}else{
				if (searchPayload.tenant === Constants.ONPREMISE) {
					searchPayload.specific_source_parameter[Constants.SOURCE_3DSPACE] = that.options.excludeSpecificSourceParameter ? {} : { "additional_query": "" + Constants.AND + "([ds6w:label]:(" + that.getInputField().value + "*)" + Constants.OR + "[ds6w:identifier]:(" + that.getInputField().value + "*))" };
				} else {
					!that.options.excludeSpecificSourceParameter &&
						that.options.sources.map(src => {
							searchPayload.specific_source_parameter[src] =
								{ "additional_query": "" + Constants.AND + "([ds6w:label]:(" + that.getInputField().value + "*)" + Constants.OR + "[ds6w:identifier]:(" + that.getInputField().value + "*))" };
						});
				}
			}
		}
		var searchOptions = {
				completePreCond: searchPayload.query,
				resourceid_in:searchPayload.resourceid_in,
				specific_source_parameter: searchPayload.specific_source_parameter,
				multiSel:that.options.multiSelect?that.options.multiSelect:false,
				predicates:that.options.predicates?that.options.predicates:[],
				resourceid_not_in: resourceid_not_in,
				callbackMethod:function(searchData){
					that.setSelectedValue(searchData);
				}
		};
		let searchComm = new ENOXSourcingSearch();
		searchComm.init(searchOptions);
	};
	
	/*ENOXTypeaheadWithSearch.prototype.launchFileChooser = function(){
		var that=this;
		var documentView=this.getDocumentViewInstance();
		documentView.launchFileChooser(function(files){
			if(!files)  return ;
			that.uploadDocument(files,documentView);
	    },'single');
    };*/

  /*ENOXTypeaheadWithSearch.prototype.downloadDocument = function(){
		var that = this;
		if(that.options.downloadDocument)that.options.downloadDocument(that);
	 };*/
    
    /*ENOXTypeaheadWithSearch.prototype.getDocumentViewInstance = function(){
		var documentModel = new UWA.Class.Model({
			isSpecification:false,
			isReferencial:true,
			relationship:Constants.REFERENCE_DOCUMENT,
			source:Constants.SERVICE_3DSPACE
		});
		var documentView = new DocumentView({model: documentModel});
		return documentView;
    };*/
    
   /* ENOXTypeaheadWithSearch.prototype.uploadDocument = function(files){
    	var that=this;
    	var documentView=this.getDocumentViewInstance();
			for (var index = 0; index < files.length; index++) {
				const file = files[index];
				if(documentView.validateUploadFile(file.name)){
					var documentInfo = {
							title: file.name || 'unNamed',
							fileInfo: {
								comments: '',
								file: file
				}
			};
			UIMask.mask(that.getWrapperDiv(), NLS.uploading_document);
			that.autocompleteField.setOption("files",documentInfo);
			if(that.options.DoNotCreateDocumentObject===true){
				let data=[{dataelements:{title:documentInfo.title}}];
				that.setUploadedValue(data);
				that.valueSelectionCallback(that);
				UIMask.unmask(that.getWrapperDiv());
				UIMask.unmask(widget.body);
			}
			else{
				documentView.createDocument(documentInfo).then(function(data){
				that.setUploadedValue(data);
				that.valueSelectionCallback(that);
				UIMask.unmask(that.getWrapperDiv());
				UIMask.unmask(widget.body);
			}).catch(function(){
				UIMask.unmask(widget.body);
				UIMask.unmask(that.getWrapperDiv());
				});	
			}
		}
	  }
    };*/
    /*
     * Purpose: To allow suggestions to be filtered based on both label as well as identifier.  This sets a custom firlter on our model.
     * By default OOTB filters based on label but we have to handle case of if user tries to search a person using trigram.  
     */
    ENOXTypeaheadWithSearch.prototype.setModelFilterCB = function(elementsTree){
    	var that = this;
    	that.autocompleteField.filterCB = function(text){
    		elementsTree.setFilterModel({
                value: {
                  filterId: "customFilterID",
                  filterModel: {
                    condition1: {
                      type: "contains",
                      filter: text
                    }
                  }
                }

              });
           };
    };
    
    /*
     * Purpose: Defines a custom filter to allow suggestions to be filtered based on both label as well as value. 
     * By default OOTB filters based on label but we have to handle case of if user tries to search a person using trigram.  
     */
    ENOXTypeaheadWithSearch.prototype.registerCustomModelFilter = function(elementsTree){
    	var that = this;
    	var stringRoleFilter = BaseFilter.inherit({
    	      publishedProperties: {},

    	      // Method called for every data when the model is changed to know if this data has to be filtered
    	      isDataFiltered: function(data) {
    	        // Get attribute value
    	        var dataValue = data.getAttributeValue("name")?data.getAttributeValue("name"):data.getAttributeValue("ds6w:identifier");
    	        var dataLabel = data.getAttributeValue("label");

    	        // Check conditions for filter to apply
    	        if (dataValue && dataLabel && this.filterModel && this.filterModel.condition1 && this.filterModel.condition1.filter) {
    	        	var doesDataFitTheFilter;
    	        	var filter = this.filterModel.condition1.filter.toLowerCase();
    	        	if(filter === "***"){
    	        		doesDataFitTheFilter = true;	
    	        	}else{
    	        		if(that.options.isPersonOrGroup)
    	        			doesDataFitTheFilter = dataValue.toLowerCase().indexOf(filter) > -1 || dataLabel.toLowerCase().indexOf(filter) > -1; //For person/UG we search contains
    	        		else
    	        			doesDataFitTheFilter = dataValue.toLowerCase().startsWith(filter) || dataLabel.toLowerCase().startsWith(filter); //For other cases starts with
    	        	}
					return !doesDataFitTheFilter;
    	        }
    			// if the filter is empty, nothing should be filtered out
    	        return false;
    	      },
    	      // A filter is considered as empty if there is no possibility that its current model will filter some data.
    	      isEmpty: function() {
    	        return this.filterModel.condition1 === undefined;
    	      }

    	});

	    // Retrieve the filter model
	    var filterManager = elementsTree.getFilterManager();

	    filterManager.registerFilter("customFilterID", stringRoleFilter);
    };

    /*
     * Purpose: When this field will be used in properties page, to validate value if required
     */
    ENOXTypeaheadWithSearch.prototype.validateValue = function(){ //For properties page
		var that = this;
		var uniqueIdentifier = that.options.uniqueIdentifier?that.options.uniqueIdentifier:that.options.identifier;//identifier is ID of object it could be actual or proxy, uniqueIdentifier is trigram, this is for person/group use case
		if(uniqueIdentifier && that.options.valueValidator)that.options.valueValidator(that, that.options); //Added for UG private case but can be used for future in a generic way for any case
	};
	
	/*
	 * Purpose: When data is set using fed search call which is invoked from button. This method would set it on the model.
	 * It handles the case if data was not part of initial TreeNodeModel. In that case it adds a new node to TreeNodeModel. It would happen mostly when from fed search UI recent objects are added.
	 */
	ENOXTypeaheadWithSearch.prototype.setSelectedValue = function(searchData){
		var that = this;
		var firstObject = searchData[0];
		if(firstObject){
			if(searchData.length > 1){ //Multi-selected case
				var selectedNodes = [];
				searchData.forEach(function(ob){
					let label = ob["ds6w:label"] + (that.options.showRevisionWithLabel ? (ob["ds6wg:revision"] ? " (" + ob["ds6wg:revision"] + ")" : "") : "");
					let node = that.createNode({"ds6w:label": label, "label": label, "value":ob["resourceid_value"]?ob["resourceid_value"]:ob["resourceid"],
							"resourceid": ob["resourceid_value"]?ob["resourceid_value"]:ob["resourceid"], ...ob});
					selectedNodes.push(node);
				});
				if(that.autocompleteField.selectedItems && that.options.multiSelect)that.autocompleteField.selectedItems = [...that.autocompleteField.selectedItems,...selectedNodes]; //Append case
				else that.autocompleteField.selectedItems = selectedNodes; //Replace case
			}else{ //Single-selected case
				let id = firstObject["resourceid_value"]?firstObject["resourceid_value"]:firstObject["resourceid"];
				let label = firstObject["ds6w:label"] + (that.options.showRevisionWithLabel ? (firstObject["ds6wg:revision"] ? " (" + firstObject["ds6wg:revision"] + ")" : "") : "");
				let node = that.createNode({"ds6w:label": label, "label": label,"value":id, "resourceid":id, ...firstObject});
				if(that.autocompleteField.selectedItems && that.options.multiSelect)that.autocompleteField.selectedItems = [...that.autocompleteField.selectedItems,node];//Append case
				else that.autocompleteField.selectedItems = node; //Replace case
			}
			//that.valueSelectionCallback(that);
		}
	};

	ENOXTypeaheadWithSearch.prototype.setUploadedValue = function(searchData){
		var that = this;
		let model = that.createModel(searchData);
		that.autocompleteField.selectedItems = model.getRoots();
	};
	
	ENOXTypeaheadWithSearch.prototype.setDroppedValue = function(searchData){
		var that = this;
		let model = that.createModel(searchData);
		if(that.autocompleteField.selectedItems && that.options.multiSelect){
			if(!that.autocompleteField.selectedItems.some((ob)=> ob._options.resourceid === model.getRoots()[0]._options.resourceid))
				that.autocompleteField.selectedItems = [...that.autocompleteField.selectedItems,...model.getRoots()]; //Append case
		}
		else that.autocompleteField.selectedItems = model.getRoots(); //Replace case
	};
	
	ENOXTypeaheadWithSearch.prototype.wrapComponents = function(){
		var that = this;
		
		let txtWrapper = UWA.createElement('div', {
             html: [that.autocompleteField],
             styles: {
                 "position": "relative",
                 "width": "100%"
             }
         });
		
		let buttonWrapper = UWA.createElement('div', {
            html: [that.searchButton],
            styles: {
                "position": "relative",
                "float": "right"
            }
        });
        
        /*let uploadbuttonWrapper = UWA.createElement('div', {
            html: [that.uploadButton],
            styles: {
                "position": "relative",
                "float": "right"
            }
        });

        let downloadbuttonWrapper = UWA.createElement('div', {
            html: [that.downloadButton],
            styles: {
                "position": "relative",
                "float": "right"
            }
        });
		downloadbuttonWrapper.setAttribute("id", "downloadbuttonWrapperID");*/
       
        if(!that.options.multiSelect){
        	buttonWrapper.setStyle("top", "2.5px");
        	//uploadbuttonWrapper.setStyle("top", "2.5px");
        	//downloadbuttonWrapper.setStyle("top", "2.5px");
        }
		
		that.setNameOnInputField(that.options.name);
		
		var htmlHolder = [txtWrapper];
		
		if(!that.options.searchButtonNotRequired)
			htmlHolder.push(buttonWrapper);
		/*if(that.uploadButton)
        	htmlHolder.push(uploadbuttonWrapper);
        if(that.downloadButton)
        	htmlHolder.push(downloadbuttonWrapper);*/
        
		return UWA.createElement('div', {
            html: htmlHolder,
            id: 'input-' + Utils.getUUID().substring(0, 6),
            styles: {
                "position": "relative",
                "width": "auto",
                "display": "flex",
                "direction": "row"
            }
        });
	};
	
	ENOXTypeaheadWithSearch.prototype.setNameOnInputField = function(name){
		this.autocompleteField.getContent().getElementsByTagName('input')[0].setAttribute("name",name);
	};
	
	ENOXTypeaheadWithSearch.prototype.getInputField = function() {
		return this.autocompleteField.getContent().getElementsByTagName('input')[0];
	};
	
	ENOXTypeaheadWithSearch.prototype.getWrapperDiv = function() {
		return this.autocompleteField.getContent().getParent()?this.autocompleteField.getContent().getParent().getParent():this.autocompleteField.getContent();
	};
	
	//UI Methods
	
	//Helper Methods
	
	/*
	 * Purpose: Gets objects to set in suggestions. Values are set based on below priority in the same order.
	 * 1) Values are pre-supplied
	 * 2) Values to be fetched from dataFetcherMethod(App provides this method)
	 * 3) Our good'ol friend, Federated Search call
	 * 
	 */
	ENOXTypeaheadWithSearch.prototype.getSuggestedObjects = function(queryStr){
		var that = this;
		var returnPromise;
		if(that.options.elementsTree && that.options.elementsTree.getRoots().length > 0){//If values are pre-supplied
			var elementsTree = that.options.elementsTree;
			if("***" !== queryStr && queryStr !== ""){
				elementsTree.getRoots().map(function (item) {
						if((item._options["label"] && item._options["label"].toLowerCase().contains(queryStr.toLowerCase())) ||
						   (item._options["name"] && item._options["name"].toLowerCase().contains(queryStr.toLowerCase()))) //Title or Autoname
							item.show();
						else
							item.hide();
				  });
			}
			returnPromise =  new UWA.Promise(function (resolve) {
				resolve({
					elementsTree : elementsTree
				});
			});
		}else if(that.options.dataFetcherMethod){ //To get values from application level method
			returnPromise = that.options.dataFetcherMethod(queryStr, that);//Should return a promise
		}else{//To get values from search index
			var searchPayload =  that.getSuggestedObjectsPayloadForSearch();
			if("***" !== queryStr && queryStr !== ""){
				if(that.options.isPersonOrGroup){
					searchPayload.specific_source_parameter[Constants.SOURCE_3DSPACE] = {"additional_query":""+Constants.AND+"([ds6w:label]:(*"+queryStr+"*)"+ Constants.OR +"[ds6w:identifier]:(*"+queryStr+"*))"};
					if(searchPayload.tenant !== Constants.ONPREMISE){
						searchPayload.specific_source_parameter[Constants.SOURCE_USERGROUPS] = {"additional_query":""+Constants.AND+"([ds6w:label]:(*"+queryStr+"*)"+ Constants.OR +"[ds6w:identifier]:(*"+queryStr+"*))"};
					}
				}else{
					that.options.sources.map(src =>{
						searchPayload.specific_source_parameter[src] = 
							{"additional_query":""+Constants.AND+"([ds6w:label]:(*"+queryStr+"*)"+ Constants.OR +"[ds6w:identifier]:(*"+queryStr+"*))"};
					});
				}
			}
			returnPromise = that.searchUtil.callFederatedSearch(searchPayload);
		}
		return returnPromise;
	};
	
	ENOXTypeaheadWithSearch.prototype.getSuggestedObjectsPayloadForSearch = function(){
		var that = this;
		var additionalParams = {
				nresults : 500,
				start : 0,
				with_nls:false,
				isPersonOrGroup:that.options.isPersonOrGroup?that.options.isPersonOrGroup:false
		};
		if(that.options.excludeCondition){
			additionalParams.excludeCondition = that.options.excludeCondition;
		}
		if(that.options.completePreCond){
			additionalParams.completePreCond = that.options.completePreCond;
		}
		let typeSearch = that.options.typeSearch?that.options.typeSearch:[];
		let sources =  that.options.sources? that.options.sources:[];
		
		let resourceid_id = that.options.resourceid_in?that.options.resourceid_in:[];
		
		var searchPayload = that.searchUtil.getSearchPayload(resourceid_id, typeSearch, sources, additionalParams);
		searchPayload.specific_source_parameter = {};
		return searchPayload;
	};
	
	ENOXTypeaheadWithSearch.prototype.setAutocompleteOptions = function(options){
		var that = this;
		let retOpts =  {
			placeholder:options.placeholder,
			name:options.name,
			minLengthBeforeSearch: 3, // Do not retrieve the possible values until 3 characters have been typed
			multiSearchMode: options.multiSelect?options.multiSelect:false,
			allowFreeInputFlag: options.freeTextAllowed?options.freeTextAllowed:false,
			disabled:options.disable?options.disable:false,
			touchMode:options.disableTouchMode?false:that.isTouchView(),
			typeDelayBeforeSearch: 500, // Debounce delay in ms
	        keepSearchResultsFlag: false, // Force the possibleValues callback function to be called at each character typed
			elementsTree: function (text) {
				return new Promise(function (resolve) {
					// An asynchronous server call to retrieve the AutoComplete possible values
					that.getSuggestedObjects(text).then(function(searchResults){
						let elementsTree = searchResults.elementsTree?searchResults.elementsTree:that.createModel(that.searchUtil.processResults(searchResults));//Process Search results
						that.registerCustomModelFilter(elementsTree);
						that.setModelFilterCB(elementsTree);
						resolve(elementsTree);
					}).catch(function(){
						widget.notificationUtil.showError(NLS.error_getting_suggestions);
					});
				}).catch(function(){
					widget.notificationUtil.showError(NLS.error_getting_suggestions);
				});
			}	
			/*,selectedItems: options.selectedItems?options.selectedItems:[] This is not working, dropped mail to component Owner, workaround is to do it post initialization*/
		};
		if(options.minLengthBeforeSearch && options.minLengthBeforeSearch === 'disable')delete retOpts.minLengthBeforeSearch; //To fire data fetch on click
		if(options.typeDelayBeforeSearch && options.typeDelayBeforeSearch === 'disable')delete retOpts.typeDelayBeforeSearch; //To fire data fetch on click
		if(options.keepSearchResultsFlag && options.keepSearchResultsFlag === 'disable')delete retOpts.keepSearchResultsFlag; //To fire data fetch on click
		return retOpts;
	};
	
	ENOXTypeaheadWithSearch.prototype.isTouchView = function(){
		return (('ontouchstart' in window) ||
			     (navigator.maxTouchPoints > 0) ||
			     (navigator.msMaxTouchPoints > 0));
	};
	
	ENOXTypeaheadWithSearch.prototype.createModel = function(results) {
		var that = this;

		var processedData = that.preprocessForModelCreation(results);
		
		// Create model
		var model = new TreeDocument();
	  
		// Start transaction
		model.prepareUpdate();

		// Adding data in model
		processedData.map(function(obj){
			let root = that.createNode(obj);
			model.addRoot(root);
		});
		
		// Complete transaction
		model.pushUpdate();
		return model;
	};
	
	ENOXTypeaheadWithSearch.prototype.createNode = function(obj) {
		  var that = this;
		  obj.grid = obj; // Grid property is required for custom filter to work, while it is not required by Autocomplete component as there is always one column, hence need to have duplicated object in tree node model
		  //TODO: re-factor above line to identify relevant filter properties only, otherwise leads to problem of self referencing
		  var node = new TreeNodeModel(obj);
		  //For User Image
		  if(that.options.isPersonOrGroup){
			  node.setIcons([that.memberInfoProvider.getProfilePicUrl(obj["ds6w:what/ds6w:type"])]);  
		  }
		  //For User Image
		  return node;
	};
	
	ENOXTypeaheadWithSearch.prototype.preprocessForModelCreation = function(respData) {
		var that = this;
		var items = [];

		respData.forEach(function(res){
			let obj = {};
			if(res.dataelements)
			    obj = that.extractDataFromUploadResponse(res);
			else
			    obj = that.extractDataFromSearchResponse(res);
			items.push(obj);
		});
		
		return items;
	};
	
	//Single Select case
	//Because OOTB stores object in single select case and array in multi select case
	ENOXTypeaheadWithSearch.prototype.getSelectedObjectAttrValue = function(attr) {
		var that = this;
		let value = undefined;
		if(that.autocompleteField.selectedItems && !that.options.multiSelect)
			value = that.autocompleteField.selectedItems.options[attr];
		return value;
	};
	
	//Multi-select case
	//This will return array
/*	ENOXTypeaheadWithSearch.prototype.getSelectedObjects = function() {
		var that = this;
		let selectedObjects = [];
		if(that.autocompleteField.selectedItems)
			selectedObjects = that.autocompleteField.selectedItems.getRoots();
		return selectedObjects;
	};*/
	
	ENOXTypeaheadWithSearch.prototype.extractDataFromSearchResponse = function(res) {
		var type = res["ds6w:what/ds6w:type"]?res["ds6w:what/ds6w:type"]:res["ds6w:type"];
		if(type && type === Constants.TYPE_FOAF_GROUP)
			type = (type).split(":")[1];
		var obj = { //Basic properties
				identifier: res["ds6w:identifier"],
				label:res["ds6w:label"] + (this.options.showRevisionWithLabel ? (res["ds6wg:revision"] ? " (" + res["ds6wg:revision"] + ")" : "") : ""),
				value:res["resourceid_value"]?res["resourceid_value"]:res["resourceid"],
				type:type
		};
		UWA.merge(obj, res); //Merge rest of the properties
		return obj;
	};
	ENOXTypeaheadWithSearch.prototype.extractDataFromUploadResponse = function(res) {
		var type = res["type"];
		var obj = { //Basic properties
				identifier: res["id"],
				label:res.dataelements?res.dataelements.title:"",
				value:res["id"],
				resourceid:res["id"],
				type:type
		};
		UWA.merge(obj, res.dataelements); //Merge rest of the properties
		return obj;
	};
	ENOXTypeaheadWithSearch.prototype.valueSelectionCallback = function(that) {
		/*Set identifier for all cases- To make this piece of code common
		 *But may or may not be required for every case
		 *In cases where we need to override the value:
		 *Application level callback which is called below will overwrite the value with empty first and then with required value
		 */
		if(that.getSelectedObjectAttrValue("resourceid")){ //If keys change in future we might need to re-factor this logic of fetch, but for now this makes sense
			that.clearIdentifier(that);
			let textfield = that.getInputField();
			textfield.setAttribute('identifier', that.getSelectedObjectAttrValue("resourceid"));
			textfield.value = that.getSelectedObjectAttrValue("label");
		}
		
		if(that.options.callback) //Application level callback, to handle post selection
		    that.options.callback(that);
		if(that.options.propertiesViewCB)that.options.propertiesViewCB(that); //For properties view post change actions in UI
	};
	
	ENOXTypeaheadWithSearch.prototype.clearIdentifier = function(that) {
		let textfield = that.getInputField();
		textfield.value = ""; //To remove previous value
		textfield.setAttribute('identifier', ""); //To remove previous value
	};
	
	ENOXTypeaheadWithSearch.prototype.getIdentifier = function() {
		let that = this;
		let identifier = that.autocompleteField._editor._myInput.getAttribute("identifier");
		return identifier?identifier:"";
	};

	ENOXTypeaheadWithSearch.prototype.onDropCallback = function(srcObj) {
		var that = this;
		var droppedObjects = Array.isArray(srcObj)?srcObj:[srcObj];

		UIMask.mask(that.getWrapperDiv(), NLS.fetching_details);
		
		let sources = [...new Set(droppedObjects.map(ob => ob.serviceId))];
		let types = [...new Set(droppedObjects.map(ob => ob.objectType))];
		var nlsMap = droppedObjects.reduce(function(map, ob) {
			map[ob.objectType] = ob.displayType;
		    return map;
		}, {});
		
		let objIds = droppedObjects.map(ob => ob.objectId);
		
		var searchPayload = that.searchUtil.getSearchPayload(objIds, types, sources);
		
		that.searchUtil.callFederatedSearch(searchPayload).then(function(searchResp){
			let processedData = that.searchUtil.processResults(searchResp);
			if(processedData.length !== searchPayload.resourceid_in.length){
			    widget.notificationUtil.showError(NLS.not_found_not_indexed);
			}
			processedData.map(function(obj){
				var validatedData = [];
				let nlsType=nlsMap[obj["ds6w:what/ds6w:type"]];
				if(obj && that.options.typeSearch.includes(obj["ds6w:what/ds6w:type"])){
					if(( obj["ds6w:what/ds6w:status"]  && 
						obj["ds6w:what/ds6w:status"].toLowerCase().indexOf(Constants.OBSOLETE.toLowerCase()) === -1 ) || (that.options.allowObsolete)){
						validatedData.push(obj);
						that.setDroppedValue(validatedData);
					}else{
						widget.notificationUtil.showError(NLS.obsolete_not_supported_drop);
					}
				}else if(obj && that.options.dropValidator){
					that.options.dropValidator(obj["ds6w:what/ds6w:type"]).then(function(isValid){
						if(isValid){
							validatedData.push(obj);
							that.setDroppedValue(validatedData);
						}else
							widget.notificationUtil.showError("\"" + nlsType +"\" "+ NLS.unsupported_type);
					});
				}
				else{
					widget.notificationUtil.showError("\"" + nlsType +"\" "+ NLS.unsupported_type);
				}
			});
		}).finally(function(){
			UIMask.unmask(that.getWrapperDiv());
		});
	};
	//Helper Methods
	return ENOXTypeaheadWithSearch;
});
