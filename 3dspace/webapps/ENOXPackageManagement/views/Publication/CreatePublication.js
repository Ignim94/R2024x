//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/Publication/CreatePublication',
		[ 
			'DS/UIKIT/Scroller',
			'DS/Controls/Toggle',
			'DS/ENOXPackageCommonUXInfra/xsourcingformview/ENOXSourcingForm',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
    	    'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
			'DS/ENOXPackageCommonUXInfra/components/ModalWindowWrapper/ModalWindowWrapper',
			'DS/UIKIT/Mask',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'DS/ENOXPackageManagement/helpers/PackageHelper',
			'DS/Controls/TooltipModel',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
			'DS/ENOXPackageUXInfra/models/CommonPackage',
			'DS/ENOXPackageManagement/controllers/CommonController',
			'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
            'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',			
    	    'css!DS/ENOXPackageManagement/ENOXPackageManagement.css'
			],function(Scroller,WUXToggle,ENOXSourcingForm, 
			NLS, NLSInfra, CommonUtils, ENOXTDPConstants, ModalWindowWrapper,UIMask, XSourcingCollectionViewObj,
			PackageHelper,WUXTooltipModel,Constants,TDPCommonHelper,CommonPackageModel,CommonController,SearchUtility,ENOXTDPPlatformServices){
	'use strict';
	var CreatePublication = function(controller){
		this.publicationController = controller;
		this.commonhelper= new TDPCommonHelper();
		this.commonPackageModel = new CommonPackageModel();	
		this.commonController = new CommonController();							   
	};
	CreatePublication.prototype.getTable = function(options) {
		let that = this;
		            /*//let that = this;
				    let data = options.data;
				    //Create the node object used as model
				    var dataModelSet = new DataModelSet();
				
				    // Create the model for the DataGridView
				    var model = new TreeDocument({
				      dataModelSet: dataModelSet
				    });
				
				    model.prepareUpdate();
				
				
				    //Create the nodes of the model
				    for (var i = 0, len = data.length; i < len; i++) {
				      var nodeData = data[i];
				      var aNode = TreeNodeModel.createTreeNodeDataModel(dataModelSet, {
				        label: nodeData.text,
				        grid: nodeData
				      });
				      model.addChild(aNode);
				    }
				
				    model.expandAll();
				
				    model.pushUpdate();
				
				    // Create the DataGridView
				    var dataGridView = new DataGridView({
				      treeDocument: model,
				      columns: options.columns,
				      rowSelection: 'none',
				      defaultColumnDef: { //Set default settings for columns
				        "width": "auto",
				        "typeRepresentation": "string"
				      },
				      id: options.id,
				    });	*/	    	
	    let tableOptions = {
			columnsConfigurations: options.columns,
			rowSelection: 'none',
			views: ["Grid"],
			enableDrag: false,
			_mediator: options.mediator,
			data: options.data,
			container: document.getElementById('filesToPublishTable'),
			uniqueIdentifier: "CreatePublication"
		};
		let dataGridView = {
			tableView: new XSourcingCollectionViewObj()
		};
		dataGridView.tableView.init(tableOptions);
		dataGridView.tableView._xsourcingCollectionViewUI._dataGridView.showOutlineFlag = true;
		dataGridView.tableView._xsourcingCollectionViewUI._dataGridView.maxVisibleRowCount = 10;
		dataGridView.tableView._gridModel.expandAll();
		dataGridView.tableView._xsourcingCollectionViewUI._dataGridView.addEventListener('columnWidthChange', function() {
					dataGridView.tableView._xsourcingCollectionViewUI._dataGridView.updateColumnView("IPProtectionClass",{
						 updateCellContent: true
					});
					dataGridView.tableView._xsourcingCollectionViewUI._dataGridView.updateColumnView("exportControlClass",{
						 updateCellContent: true
					});
		});
		return dataGridView;
	};
	CreatePublication.prototype.getAttachmentTileView = function(options) {
		let that = this;
		let columns = 
					[
					{
						"text": NLS.name,
						"dataIndex": "label_displayValue"
					},
					{
						"text": NLS.owner,
						"dataIndex": "owner"
					},
					{
						"text": NLS.created,
						"dataIndex": "created"
					}
					]
		;
	    let viewOptions = {
			columnsConfigurations: columns,
			rowSelection: 'none',
			views: ["Tile"],
			enableDrag: false,
			_mediator: options.mediator,
			data: options.data,
			container: options.container,
			uniqueIdentifier:options.uniqueIdentifier,
			displayedOptionalCellProperties: ["description"]
		};
		let tileView = {
			tileViewObj: new XSourcingCollectionViewObj()
		};
		tileView.tileViewObj.init(viewOptions);
		
		return tileView;
	};
	
	let getCommaSeparatedContentNames = (contentNames) => {
		let commaSeparatedContentNames = ENOXTDPConstants.EMPTY_STRING;
		contentNames.forEach((contentName, index) => {
			let separator = NLS.comma;
			if (index+1 === contentNames.length)
				separator = NLS.and;
			if (index === 0)
				commaSeparatedContentNames = contentName;
			else
				commaSeparatedContentNames += (separator + contentName);
		});
		commaSeparatedContentNames += NLS.generate_publication_tableErrorMessage_content;
		return commaSeparatedContentNames;
	};
	CreatePublication.prototype.getErrorIcon = function(node, isIP, packageState) {

			if(node.__children !==undefined){
				return this.commonhelper.getErrorIcon(node, isIP, packageState);
			}
		};																 
			
	CreatePublication.prototype.render= function(renderOptions){
		this._container = renderOptions._container;
		this.router=renderOptions.router;
		this._applicationChannel = renderOptions._applicationChannel;
		let that=this;
		that.options = renderOptions;
		let options = that.options;
		let containsIPData=false;
        
		var publicationDiv = UWA.createElement('div', {
			id : 'CreatePublication',
			'class': 'CreatePublication modalBodyDiv'
		});
		options.totalPublicationSize = "0 B";
		let contentRows = [];
		let contentWithNoFile = [];
		options.packageContent
			.filter((pkgContent) => pkgContent.AllowToPublish === ENOXTDPConstants.key_yes||pkgContent.AllowToPublish === ENOXTDPConstants.NOT_APPLICABLE)
			.forEach((content) => {
				let filesToPublish = content.FileToPublish;
				if (filesToPublish.length === 0)
						contentWithNoFile.push(content["label_displayValue"]);
				let childContent = filesToPublish.map((file) => {
					let contentType = content["type_actualValue"];
					let classificationFields = {};
					if(!(contentType === Constants.DOCUMENT)) {
						classificationFields = {
							IPProtectionClass: file.ipclasses!== undefined ? file.ipclasses.toString() : ENOXTDPConstants.EMPTY_STRING,
							exportControlClass: file.exportClasses!== undefined ? file.exportClasses.toString() : ENOXTDPConstants.EMPTY_STRING
						};
					}
					return {
						label: file.fileName,
						grid: {
							...classificationFields,
							filename: file.fileName,
							fileFormat: file.fileFormat,
							fileSource: file.fileSource,
							fileSize: file.fileSize,
							readOnly: Boolean(filesToPublish.length === 1),
							repId: file.repId,
							fileId: file.id,
							autoName: file.autoName,
							docRevision: file.docRevision,
							docType: file.docType,
							docMaturity: file.docMaturity,
							modifiedTime:file.fileModified,
							toBePublished: (content.AllowToPublish === ENOXTDPConstants.key_yes||content.AllowToPublish === ENOXTDPConstants.NOT_APPLICABLE)
						}
					};
				});
				contentRows.push({
					label: content["label_displayValue"],
					grid: {
						tree: content["label_displayValue"],
						revision: content.revision,
						autoName: content.identifier_displayValue,
						displayType: content["type_displayValue"],
						type: content["type_actualValue"],
						IPProtectionClass: content.ipclasses!== undefined ? content.ipclasses.toString() : ENOXTDPConstants.EMPTY_STRING,
						exportControlClass: content.exportClasses!== undefined ? content.exportClasses.toString() : ENOXTDPConstants.EMPTY_STRING,
						displayStatus: content["status_displayValue"],
						status: content["status_actualValue"],
						actualID: content.resourceid,
						expandedState: 'expanded',
						ipClassesInformation:content.classes,
						ipClassesConfirmedDetails: content.ipClassesConfirmedDetails,
						exportClassesConfirmedDetails: content.exportClassesConfirmedDetails,
						IPProtectionNameId: content.IPProtectionNameId!== undefined ? content.IPProtectionNameId : ENOXTDPConstants.EMPTY_STRING,
						IPExportControlNameId: content.IPExportControlNameId!== undefined ? content.IPExportControlNameId : ENOXTDPConstants.EMPTY_STRING,
						classesTooltip: content.classesTooltip,
						isContentRowAccessible: content.isContentRowAccessible
					},
					children: childContent
				});
				if((content.ipclasses!== undefined||content.exportClasses!== undefined)&&options.data.params.hasIPRole==="true"){
					containsIPData=true;
				}
			});
       let isAllMandatoryContentSelected = true;
	   let contentNamesWithError = [];
	   let contentIdsWithError = [];
	   
	   
		let requireBOM = true;
		let requireBOMLabel = UWA.createElement('div', {
                "class": "checkboxLabel",
                text: NLS.generate_publication_bom_config_label
        });		let requireBOMCheckbox = new WUXToggle({ type: "checkbox", name: 'configureBomVisibility', label: "", checkFlag: true});
		requireBOMCheckbox.addEventListener('change', (e) =>  {
     		requireBOM = e.dsModel.checkFlag;
			/*//Uncomment for BOM Display
			if(requireBOM){
				document.getElementById('bomDetailsDisplay').parentElement.appendChild(bomDisplay);
			}else{
				bomDisplay.inject(emptyWrapper);
			}*/
		});
		let bomWrapper = UWA.createElement('div', {
                html: [requireBOMCheckbox, requireBOMLabel],
                id: 'bomWrapper'    
       	});

		let filesToPublishTable = UWA.createElement('div', {
					id: 'filesToPublishTable'
		});
		let filesToPublishSubHeader = UWA.createElement('div', {
					id: 'filesToPublishSubHeader',
					text: NLS.admin_settings_message
		});
		let packageContentWrapper = UWA.createElement('div', {
					id: 'packageContentWrapper',
					html: [filesToPublishSubHeader,filesToPublishTable]
			});
		
		/*//Uncomment for BOM Display
		let displayBOMDetails= UWA.createElement('div', {
                "class": "displayBOMDetails",
				content: that.commonhelper.getAssemblyDetails(options)
        });
		let bomDisplay = UWA.createElement('div', {
                html: [displayBOMDetails],
                id: 'bomDisplay'    
       	});
		let emptyWrapper = UWA.createElement('div', {
                id: 'emptyWrapper',
				styles:{
					display:"none"
				}
       	});*/
	let reportLanguageList = [
		{"label" : NLS.english, "value": "en"},
		{"label" : NLS.french, "value": "fr"},
		{"label" : NLS.german, "value": "de"},
		{"label" : NLS.spanish, "value": "es"},
		{"label" : NLS.czech, "value": "cs"},
		{"label" : NLS.italian, "value": "it"},
		{"label" : NLS.japanese, "value": "ja"},
		{"label" : NLS.korean, "value": "ko"},
		{"label" : NLS.polish, "value": "pl"},
		{"label" : NLS.brazillian_portuguese, "value": "pt-BR"},
		{"label" : NLS.russian, "value": "ru"}, 
		{"label" : NLS.chinese_simplified, "value": "zh"},
		{"label" : NLS.chinese_traditional, "value": "zh-TW"}
		];	
	
	
	let publicationSizeLabel = UWA.createElement('span', {
        text: NLS.publication_size_label,
        id: 'publicationSizeLabel'    
   	});
	let publicationSizeValue = UWA.createElement('span', {
        text: options.totalPublicationSize,
        id: 'publicationSizeValue'    
   	});

	let publicationSizeDiv = UWA.createElement('div', {
        html: [publicationSizeLabel, publicationSizeValue],
        id: 'publicationSize'    
   	});

	let passwordProtected = false;
	var isPasswordProtectionEnabled = widget.getValue("isPasswordProtectionEnabled");
	if(Constants.ONPREMISE === ENOXTDPPlatformServices.getPlatformId()&&isPasswordProtectionEnabled==="True"){
				 passwordProtected = true;
			let passwordCheckboxLabel = UWA.createElement('div', {
					"class": "checkboxLabel",
					text:NLS.password_protected_file
			});
			let passwordCheckbox = new WUXToggle({ type: "checkbox", name: 'passwordProtectedPublicationFile', label: "", checkFlag: true,disabled:containsIPData });
			passwordCheckbox.addEventListener('change', (e) =>  {
				passwordProtected = e.dsModel.checkFlag;
			});
			let passwordWrapper = UWA.createElement('div', {
					html: [passwordCheckbox, passwordCheckboxLabel],
					id: 'passwordWrapper'    
			});
		   that.fields=[
				{section: 'information'},
				{
					type: 'justLabel',
					label: NLS.generate_publication_information_details         	
				},			
				{
					type: 'text',
					label: NLS.title,
					placeholder: NLS.enter_title,
					name:'title',
					required:true,
					errorText: NLSInfra.please_enter_title,
					"isLengthy": false,
					"helperText": NLSInfra.length_100_limit,
					value: options.label
				},
	// 			{
	// 				type: 'justLabel',
	// 				label: NLS.option_selection_worksheet_label,
	// 				name:'worksheetLabel',
	// 				required:true
	// 			},
	// 			{
	//                 type: 'toggleSwitch',
	//                 name: 'copyFromPackage',
	//                 label: NLS.copy_from_package_label,
	//                 id:'packageReleaseMaturity',
	//                 checkFlag: true
	//             },
	//             {
	// 				type: "autocompleteWithSearch",
	// 				name:'worksheet',
	// 				value:'Upload',
	// 				label: NLS.upload_new_label,
	// 				searchButtonNotRequired : true,
	// 				errorText: NLS.generate_publication_uploadWorksheet,
	// 				enableUpload:true,
	// 				enableDownload:false,
	// 				DoNotCreateDocumentObject:true
	// 			},
				{
					type: 'textarea',
					label: NLS.description,
					name:'description',
					placeholder: NLS.enter_description,
					errorText: NLSInfra.max_char_limit_err_msg,
					"isLengthy": true,
					"helperText": NLSInfra.length_256_limit,
					value: options.grid.description
				},
				{
					type: 'customField',
					id: 'passwordProtectedPublicationFile',
					name: 'passwordProtectedPublicationFileWrapper',
					content: passwordWrapper
				},
				{section: 'worksheet'},
				{
					type: 'justLabel',
					label: NLS.worksheets       	
				},
				{
					type: 'customField',
					id: 'worksheetWrapper',
					name: 'worksheetForPublication',
					content: UWA.createElement('div', {
							id: 'worksheetForPublicationView',
							styles: {'height': '115px'}
					})
				},
			   {section: 'disclaimer'},
				{
					type: 'justLabel',
					label: NLS.disclaimers      	
				},
				{
					type: 'customField',
					id: 'disclaimerWrapper',
					name: 'disclaimerForPublication',
					content: UWA.createElement('div', {
							id: 'disclaimerForPublicationView',
							styles: {'height': '115px'}
					})
				},
				{section: 'content'},
				{
					type: 'justLabel',
					label: NLS.generate_publication_content_details        	
				},
				{
					type: 'customField',
					id: 'filesToPublishTableWrapper',
					errorText: NLS.generate_publication_tableErrorMessage,
					name: 'filesToPublish',
					content: packageContentWrapper
				},
				{section: 'report'},
				{
					type: 'justLabel',
					label: NLS.generate_publication_report_details         	
				},
				{
		            type: 'select', 
		            label: NLS.language,
					name:'reportLanguage',
					options: reportLanguageList,
					width: "100%",
					value: widget.lang
				},
				{
					type: 'text',
					label: NLS.publication_report_filename,
					placeholder: NLS.enter_report_filename,
					name:'reportTitle',
					required:true,
					errorText: NLSInfra.please_enter_report_filename,
					"isLengthy": false,
					"helperText": NLSInfra.length_100_limit,
					value: options.label+" "+NLS.report
				},
				{
					type: 'customField',
					id: 'bomDetailsCheckbox',
					name: 'bomDetailsCheckboxWrapper',
					content: bomWrapper
				},
				/*//Uncomment for BOM Display,
				{
					type: 'customField',
					id: 'bomDetailsDisplay',
					name: 'bomDetailsDisplayWrapper',
					content: bomDisplay 
				}*/
				{
					type: 'customField',
					id: 'publicationFileSize',
					name: 'publicationFileSizeWrapper',
					content: publicationSizeDiv
				}
		
			];	
	}else{
			that.fields=[
				{section: 'information'},
				{
					type: 'justLabel',
					label: NLS.generate_publication_information_details         	
				},			
				{
					type: 'text',
					label: NLS.title,
					placeholder: NLS.enter_title,
					name:'title',
					required:true,
					errorText: NLSInfra.please_enter_title,
					"isLengthy": false,
					"helperText": NLSInfra.length_100_limit,
					value: options.label
				},
				{
					type: 'textarea',
					label: NLS.description,
					name:'description',
					placeholder: NLS.enter_description,
					errorText: NLSInfra.max_char_limit_err_msg,
					"isLengthy": true,
					"helperText": NLSInfra.length_256_limit,
					value: options.grid.description
				},
				{section: 'worksheet'},
				{
					type: 'justLabel',
					label: NLS.worksheets       	
				},
				{
					type: 'customField',
					id: 'worksheetWrapper',
					name: 'worksheetForPublication',
					content: UWA.createElement('div', {
							id: 'worksheetForPublicationView',
							styles: {'height': '115px'}
					})
				},
			   {section: 'disclaimer'},
				{
					type: 'justLabel',
					label: NLS.disclaimers      	
				},
				{
					type: 'customField',
					id: 'disclaimerWrapper',
					name: 'disclaimerForPublication',
					content: UWA.createElement('div', {
							id: 'disclaimerForPublicationView',
							styles: {'height': '115px'}
					})
				},
				{section: 'content'},
				{
					type: 'justLabel',
					label: NLS.generate_publication_content_details        	
				},
				{
					type: 'customField',
					id: 'filesToPublishTableWrapper',
					label: NLS.files_to_publish_label,
					errorText: NLS.generate_publication_tableErrorMessage,
					name: 'filesToPublish',
					content: packageContentWrapper
				},
				{section: 'report'},
				{
					type: 'justLabel',
					label: NLS.generate_publication_report_details         	
				},
				{
		            type: 'select', 
		            label: NLS.language,
					name:'reportLanguage',
					options: reportLanguageList,
					width: "100%",
					value: widget.lang
				},
				{
					type: 'text',
					label: NLS.publication_report_filename,
					placeholder: NLS.enter_report_filename,
					name:'reportTitle',
					required:true,
					errorText: NLSInfra.please_enter_report_filename,
					"isLengthy": false,
					"helperText": NLSInfra.length_100_limit,
					value: options.label+" "+NLS.report
				},
				{
					type: 'customField',
					id: 'bomDetailsCheckbox',
					name: 'bomDetailsCheckboxWrapper',
					content: bomWrapper
				},
				/*//Uncomment for BOM Display,
				{
					type: 'customField',
					id: 'bomDetailsDisplay',
					name: 'bomDetailsDisplayWrapper',
					content: bomDisplay 
				}*/
				{
					type: 'customField',
					id: 'publicationFileSize',
					name: 'publicationFileSizeWrapper',
					content: publicationSizeDiv
				}
			];	
	}
		var createForm = new ENOXSourcingForm({
				grid:"4,8",
				fields:that.fields,
							events:{
								onSubmit:function(){
									var isOk = true;
									var postData={};
									postData.data=[];
									if(this.texts.length>0)
										isOk = this.FormValidations.charLimitValidate(this.texts);
//									if(this.wuxAutocompletes.length>0){
//										isOk = createForm.FormValidations.wuxAutoCompleteValidation(this.wuxAutocompletes);
//										isOk = isOk && createForm.FormValidations.wuxAutoCompleteMaskingValidation(this.wuxAutocompletes);
//									}
// 									if(this.wuxAutocompletes.length>0 && this.toggleSwitches.length>0) {
// 										isOk = this.toggleSwitches[0].getValue() === 'on' || this.wuxAutocompletes[0].options.files !== undefined;
// 										if (!isOk && this.wuxAutocompletes[0].options.files === undefined)
// 										    this.wuxAutocompletes[0].elements.container.getParent('.form-group').addClassName("has-error");
// 										else 
// 										    this.wuxAutocompletes[0].elements.container.getParent('.form-group').removeClassName("has-error");
// 									}
									if(this.customFields.length > 0) {
										if (!isAllMandatoryContentSelected) {
											let tableErrorText = createForm.options.fields.find((field) => field.id === "filesToPublishTableWrapper");
											errorTextWrapper.textContent = tableErrorText.errorText + getCommaSeparatedContentNames(contentNamesWithError);
											errorTextWrapper.style.display = contentNamesWithError.length > 0 ? "block" : "none";
										}
										
										if (contentWithNoFile.length > 0) {
											noFileErrorWrapper.style.display = "block";
										}
									}
									if (modal && modal.destroy && isOk && isAllMandatoryContentSelected && contentWithNoFile.length === 0) {
										options.formValues = createForm.getValues();
										options.formValues.selectedContent = createForm.filesToPublishDGV.tableView._model.getRoots().map((root) => {
											return {
												...root.options.grid,
												title: root.getAttributeValue("tree"), 
												filesToPublish: root.options.children.filter((child) => child.grid.toBePublished).map((child) => child.grid)
											};
										});
										options.formValues.isPasswordProtected=passwordProtected;
										options.formValues.requireBOM=requireBOM;
										let contentWithClassifiedFiles = [];
										options.formValues.selectedContent.forEach((content) => {
											content.filesToPublish.forEach((file) => {
												if((file.IPProtectionClass+file.exportControlClass).length>0) {
													contentWithClassifiedFiles.push(content.title);
												}
											});
										});
										if(contentWithClassifiedFiles.length > 0) {
											classifiedFileErrorWrapper.textContent = NLS.generate_publication_blocked_classified_files + getCommaSeparatedContentNames(contentWithClassifiedFiles);
											classifiedFileErrorWrapper.style.display = "block";
										}
										else {
											that.publicationController.create(options);
											modal.destroy();
										}
// 										if (this.wuxAutocompletes[0].options.files)
// 										    options.formValues.worksheet = this.wuxAutocompletes[0].options.files.fileInfo.file;
									}
								},
//								onInvalid:function(){
// 									console.log("Required Fields are not set");
//								},
								onChange: function() {
// 									let newUploadedWorksheetContainerParent = this.wuxAutocompletes[0].elements.container.getParent('.form-group');
// 									if (this.toggleSwitches[0].isChecked())
// 									    newUploadedWorksheetContainerParent.setStyle("display", "none");
// 									else 
// 										newUploadedWorksheetContainerParent.setStyle("display", "block");
									if(this.texts.length>0)
										this.FormValidations.charLimitValidate(this.texts);
								}
							}            
			}).inject(publicationDiv);
// 			createForm.wuxAutocompletes[0].elements.container.getParent('.form-group').setStyle("display", "none");
	    	//For ODT
//	    	if(window.odtForm){
//				window.odtForm = createForm;
//			}
	    	
			var modalButtons = UWA.createElement('span', {
				id : 'modalButtons',
				'class': 'modal-buttons'
			});
			
			UWA.createElement('button', { type: 'submit', 
				name:'create',
				id : 'createBtn',
				form: 'generatePublicationForm',
				'class': 'btn btn-primary',
				text: NLS.generate_publication_submit_button_text,
				value: NLS.generate_publication_submit_button_text
			}).inject(modalButtons);
			UWA.createElement('button', { type: 'reset', 
				id : 'closeModalBtn',
				'class': 'btn btn-default',
				text: NLS.cancel,
				value: NLS.cancel,
				events: {
					click: function(){
						modal.destroy();
					}
				}
			}).inject(modalButtons);

	       	let modalWrapper = new ModalWindowWrapper(
				{
					app: {widget:widget},
					draggable: true,
					resizable: true,
					escapeToClose: false,
					height: widget.getViewportDimensions().height-5+'px',
					width: '700px',
				 	onHideCB: () => modal.destroy()
				}
			);
	        let modal = modalWrapper.getModal();
	
	 		modal.show();
	 		modal.setHeader(NLS.generate_publication_label);
	 		publicationDiv.inject(modal.getBody());
	 		modalButtons.inject(modal.getFooter());		
			new Scroller({
				element: publicationDiv
			}).inject(modal.getBody());
			widget.getElement(".xSourcingForm").setAttribute("id", "generatePublicationForm");
			createForm.filesToPublishDGV = that.getTable({
				id: 'filesToPublishDGV',
				data: contentRows,
				formDetails: createForm,
				publicationOptions: options,
				mediator: options.mediator,
				columns: [
					{
						"text": `${NLS.content_name_column}/${NLS.file_to_publish_column}`,
						"dataIndex": "tree", // tree is required for rowGrouping to work
						"pinned": "left",
						"minWidth" : 150,
						"getCellValue": (cellInfos) => {
							let nodeModel = cellInfos.nodeModel;
							if (nodeModel && nodeModel.isRoot())
								return `${nodeModel.getLabel()} - ${nodeModel.getAttributeValue("revision")}`;
							return nodeModel.getLabel();
						}
					},
					{
						"text": NLS.name,
						"dataIndex": "autoName",
						"visibleFlag": false
					},
					{
						"text": NLS.file_format_column,
						"dataIndex": "fileFormat",
						"width" : 75
					},
					{
						"text": NLS.to_be_published_column,
						"dataIndex": "toBePublished",
						"width" : 105,
						"typeRepresentation": "boolean",
						"editionPolicy": "EditionInPlace",
						"editableFlag":true,
						"getCellEditableState": (cellInfos) => cellInfos.nodeModel ? !cellInfos.nodeModel.getAttributeValue('readOnly') : false,
						getCellClassName: (cellInfos) => {
							if (cellInfos.nodeModel && contentIdsWithError.includes(cellInfos.nodeModel.getAttributeValue('proxyID')))
								return cellInfos.cellView.getInitialClassName() + " has-error";
						},
						setCellValue: (cellInfos, value) => {
							let publicationOptions = that.options;
							let childFileSize = cellInfos.nodeModel.getAttributeValue("fileSize");
							let fileSize = parseInt(childFileSize? childFileSize: 0);
							if (cellInfos.nodeModel) {
								cellInfos.nodeModel.setAttribute("toBePublished", value);
								if(value) {
									publicationOptions.totalPublicationSize+=fileSize;
								}
								else {
									publicationOptions.totalPublicationSize-=fileSize;
								}
								let publicationSizeContainer = document.getElementById("publicationSizeValue");
								publicationSizeContainer.innerHTML = that.getReadableFileSize(publicationOptions.totalPublicationSize);
								if(publicationOptions.totalPublicationSize>ENOXTDPConstants.PUBLICATION_SIZE_LIMIT) {
									publicationSizeContainer.classList.remove("sizeWithinLimits");
									publicationSizeContainer.classList.add("sizelimitExceeded");
								}
								else {
									publicationSizeContainer.classList.remove("sizelimitExceeded");
									publicationSizeContainer.classList.add("sizeWithinLimits");
								}
							}
							let contentName = cellInfos.nodeModel.getParent().getAttributeValue("tree");
							let allDescendants = cellInfos.nodeModel.getParent().getAllDescendants();
							let areSelectedFilesNonClassified = allDescendants.filter((child) => child.getAttributeValue('toBePublished'))
								.every((filteredChild) => !(filteredChild.getAttributeValue('IPProtectionClass')+filteredChild.getAttributeValue('exportControlClass')));
							if(areSelectedFilesNonClassified && classifiedFileErrorWrapper) {
								classifiedFileErrorWrapper.style.display = "none";
							}
							let isAtleastOneFileSelectedFromContent = allDescendants.some((child) => child.getAttributeValue("toBePublished"));
							isAllMandatoryContentSelected = createForm.filesToPublishDGV.tableView._model.getRoots().every((root) => root.options.children.some((child) => child.grid.toBePublished));
                
							//let isNoChildSelected = allDescendants.every((child) => !child.getAttributeValue("toBePublished"));
							if (!isAtleastOneFileSelectedFromContent && !contentNamesWithError.includes(contentName))
								contentNamesWithError.push(contentName);
                
							if(isAtleastOneFileSelectedFromContent)
							 contentNamesWithError = contentNamesWithError.filter((name) => name !== contentName);
							if (isAllMandatoryContentSelected) {
								contentNamesWithError = [];
								errorTextWrapper.style.display = "none";
							}							    
						}
					},
					{
						"text": NLS.type,
						"dataIndex": "displayType",
						"visibleFlag": false
					},
					{
						"text": NLS.connected_as_column,
						"dataIndex": "fileSource"
					},
					{
						"text": NLS.ip_protection_column,
						"dataIndex": "IPProtectionClass",
						"width" : 85,
						getCellSemantics: function(cellInfos){
							if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible==="false") {
									return "";
							}					
							return that.getErrorIcon(cellInfos.nodeModel, true, ENOXTDPConstants.state_released);
							
						},				   
						getCellClassName: function(cellInfos) {
							if (!cellInfos.nodeModel) {
								return "IP-Class";
							}
						},
						getCellValue : function (cellInfos) {
							if(cellInfos.nodeModel.options.grid.IPProtectionClass && cellInfos.nodeModel.options.grid.IPProtectionClass!==undefined && cellInfos.nodeModel.options.grid.IPProtectionClass!==""){
									let ipclassesValue = cellInfos.nodeModel.options.grid.IPProtectionClass.split(",");
									if(Array.isArray(ipclassesValue)){
										if(ipclassesValue.length>0){
									let obj={
										"classesArray" :cellInfos.nodeModel.options.grid.IPProtectionClass.split(","),
										"width" : createForm.filesToPublishDGV.tableView._xsourcingCollectionViewUI._dataGridView.elements.header.getElementsByClassName("IP-Class")[0].clientWidth
									}; 
									let responseData=options.controller.commonhelper.getDisplayDataForIPandECClasses(obj);	
									that.TooltipString=responseData.Classes;
									return responseData.dataToBeDisplayed;
								}
									return " ";
								}
								return ipclassesValue;
							}
							return " ";
						},
						getCellTooltip: function(cellInfos) {
							if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.IPProtectionClass) {
								if(!Array.isArray(cellInfos.nodeModel.options.grid.IPProtectionClass)) {
									that.TooltipString = cellInfos.nodeModel.options.grid.classesTooltip;
								}																	 
								return {
								shortHelp: that.TooltipString
								};
							}	
							return createForm.filesToPublishDGV.tableView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
						}
                	},
					{
						"text": NLS.export_protection_column,
						"dataIndex": "exportControlClass",
						getCellSemantics: function(cellInfos){
							if(cellInfos.nodeModel && cellInfos.nodeModel.options.grid.isContentRowAccessible==="false") {
									return "";
							}					
							return that.getErrorIcon(cellInfos.nodeModel, false,  ENOXTDPConstants.state_released);
							
						},				   
						getCellClassName: function(cellInfos) {
							if (!cellInfos.nodeModel) {
								return "EC-Class";
							}
						},
						getCellValue : function (cellInfos) {
							if(cellInfos.nodeModel.options.grid.exportControlClass && cellInfos.nodeModel.options.grid.exportControlClass!==undefined && cellInfos.nodeModel.options.grid.exportControlClass!==""){
							let exportClassesValue = cellInfos.nodeModel.options.grid.exportControlClass.split(",");
								if(Array.isArray(exportClassesValue)) {
									if( exportClassesValue.length>0){
									let obj={
										"classesArray" :cellInfos.nodeModel.options.grid.exportControlClass.split(","),
										"width" :createForm.filesToPublishDGV.tableView._xsourcingCollectionViewUI._dataGridView.elements.header.getElementsByClassName("EC-Class")[0].clientWidth
									}; 
									let responseData=options.controller.commonhelper.getDisplayDataForIPandECClasses(obj);	
									that.TooltipString=responseData.Classes;
									return responseData.dataToBeDisplayed;
								}
									return " ";
								}
								return exportClassesValue;
							}
							return " ";
						},
						getCellTooltip: function(cellInfos) {
							if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.exportControlClass) {
								if(!Array.isArray(cellInfos.nodeModel.options.grid.exportControlClass)) {
									that.TooltipString = cellInfos.nodeModel.options.grid.classesTooltip;
								}					 
								return {
								shortHelp: that.TooltipString
								};
							}	
							return createForm.filesToPublishDGV.tableView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
						}
					},
					{
						"text": NLS.file_size_column,
						"width" : 75,
						dataIndex: "fileSize",
						getCellValue: (cellInfos) => {
							let nodeModel = cellInfos.nodeModel;
							if (nodeModel && nodeModel.isRoot())
								return "";
							return that.getReadableFileSize(nodeModel.getAttributeValue("fileSize"));
						}
					}]
				}
			);
			let fileToPublishFormElement = document.getElementById('filesToPublishTableWrapper').parentElement;
	        fileToPublishFormElement.style.cssText = 'display: flex;flex-flow: column;flex: 1 1 auto';
			let errorTextWrapper = UWA.createElement('span', {
				'class': 'form-control-error-text',
				styles:{
					display:"none"
				}
			});
		    document.getElementById('filesToPublishTableWrapper').parentElement.appendChild(errorTextWrapper);	
			let noFileErrorWrapper = UWA.createElement('span', {
				'class': 'form-control-error-text',
				text: NLS.generate_publication_no_file_error + getCommaSeparatedContentNames(contentWithNoFile),
				styles:{
					display:"none"
				}
			});
		    document.getElementById('filesToPublishTableWrapper').parentElement.appendChild(noFileErrorWrapper);
			let classifiedFileErrorWrapper = UWA.createElement('span', {
				'class': 'form-control-error-text',
				styles:{
					display:"none"
				}
			});
		    document.getElementById('filesToPublishTableWrapper').parentElement.appendChild(classifiedFileErrorWrapper);
			
			if(options.attachmentOption.worksheetTileData.length > 0){
					let worksheetsData = options.attachmentOption.worksheetTileData.map((worksheet) => {
					let sizeContainer = UWA.createElement('span');
					let totalSize = worksheet.grid.filesData.map((file) => file.fileSize).reduce(((totalSize,fileSize) => totalSize+parseInt(fileSize)),0);
					sizeContainer.innerHTML = " | "+that.getReadableFileSize(totalSize);
					sizeContainer.inject(worksheet.subLabel.getElementsByClassName("div_subLabelLine1")[0]);
					worksheet.grid.downloadFile = true;
					return worksheet;
				})
				createForm.worksheetTileView = that.getAttachmentTileView({
					formDetails: createForm,
					publicationOptions: options,
					id: 'worksheetTileView',
					data: worksheetsData,
					mediator: options.mediator,
					container : document.getElementById('worksheetForPublicationView'),
					uniqueIdentifier: "worksheetsection"
				});
			}
			else {
				let worksheetSec = document.getElementById('worksheetForPublicationView');
				worksheetSec.style.height = '0px';
				let noWorksheetFileWrapper = UWA.createElement('span', {
					'id': 'worksheetemptysection',
					'text' :  NLS.no_worksheets_message	
				});
			    worksheetSec.appendChild(noWorksheetFileWrapper);
			}
			if(options.attachmentOption.disclaimerTileData.length > 0){
				let disclaimersData = options.attachmentOption.disclaimerTileData.map((disclaimer) => {
					let sizeContainer = UWA.createElement('span');
					let totalSize = disclaimer.grid.filesData.map((file) => file.fileSize).reduce(((totalSize,fileSize) => totalSize+parseInt(fileSize)),0);
					sizeContainer.innerHTML = " | "+that.getReadableFileSize(totalSize);
					sizeContainer.inject(disclaimer.subLabel.getElementsByClassName("div_subLabelLine1")[0]);
					disclaimer.grid.downloadFile = true;
					return disclaimer;
				})
				createForm.disclaimerTileView = that.getAttachmentTileView({
					formDetails: createForm,
					publicationOptions: options,
					id: 'disclaimerTileView',
					data: disclaimersData,
					mediator: options.mediator,
					container: document.getElementById('disclaimerForPublicationView'),
					uniqueIdentifier: "disclaimersection"
				});
			}
			else {
				let disclaimersec = document.getElementById('disclaimerForPublicationView');
				disclaimersec.style.height = '0px';
				let noDisclaimerFileWrapper = UWA.createElement('span', {
					'id': 'disclaimeremptysection',
					'text' :  NLS.no_disclaimers_message	
				});
			    disclaimersec.appendChild(noDisclaimerFileWrapper);
			}
			
			let contentSize = createForm.filesToPublishDGV.tableView._gridModel.getRoots()
							.map((root)=>root.getChildren().map((child) => child.getAttributeValue("fileSize"))
							.reduce((totalSize, fileSize) => totalSize + parseInt(fileSize? fileSize: 0), 0))
							.reduce((totalSize, fileSize) => totalSize + parseInt(fileSize? fileSize: 0), 0);
			let worksheetsSize = createForm.worksheetTileView? createForm.worksheetTileView.tileViewObj._gridModel.getRoots()
								.map((child) => child.getAttributeValue("filesData")[0])
								.reduce((totalSize, fileData) => totalSize + parseInt(fileData.fileSize? fileData.fileSize: 0), 0): 0;
			let disclaimersSize = createForm.disclaimerTileView? createForm.disclaimerTileView.tileViewObj._gridModel.getRoots()
									.map((child) => child.getAttributeValue("filesData")[0])
									.reduce((totalSize, fileData) => totalSize + parseInt(fileData.fileSize? fileData.fileSize: 0), 0): 0;
									
			options.totalPublicationSize = contentSize+worksheetsSize+disclaimersSize;
			let publicationSizeContainer = document.getElementById("publicationSizeValue");
			publicationSizeContainer.innerHTML = that.getReadableFileSize(options.totalPublicationSize);
			if(options.totalPublicationSize>ENOXTDPConstants.PUBLICATION_SIZE_LIMIT) {
				publicationSizeContainer.classList.add("sizelimitExceeded");
			}
			else {
				publicationSizeContainer.classList.add("sizeWithinLimits");
			}
			let publicationForm = document.getElementById("generatePublicationForm");
			let formElements = publicationForm.getChildren();
			let section={};
			let title;
			formElements.forEach((element,index) => {
				if(that.fields[index].section) {
					title = that.fields[index].section;
					section[title] = [];
				}
				else {
					section[title].push(element);
				}
			});
			formElements.forEach((element) => {
				element.remove();
			});
			UWA.createElement('fieldset', {
                html: [...section['information']],
                id: 'infoGroup'    
	       	}).inject(publicationForm);
			UWA.createElement('fieldset', {
                html: [...section['worksheet']],
                id: 'worksheetGroup'    
	       	}).inject(publicationForm);
			UWA.createElement('fieldset', {
                html: [...section['disclaimer']],
                id: 'disclaimerGroup'    
	       	}).inject(publicationForm);
			UWA.createElement('fieldset', {
                html: [...section['content']],
                id: 'contentGroup'    
	       	}).inject(publicationForm);
			
			UWA.createElement('fieldset', {
                html: [...section['report']],
                id: 'reportGroup'    
	       	}).inject(publicationForm);
	};    
	
	CreatePublication.prototype.handleNLSTranslations = function(items) {
	    let searchUtil = new SearchUtility();
	    let toTranslate = {
	        'ds6w:status': [],
	        'ds6w:type': []
	    };
	    items.forEach((ob) => {
	        toTranslate['ds6w:status'].push(ob.status_actualValue);
	        toTranslate['ds6w:type'].push(ob.type_actualValue);
	    });
	    toTranslate['ds6w:status'] = [...new Set(toTranslate['ds6w:status'])];
	    toTranslate['ds6w:type'] = [...new Set(toTranslate['ds6w:type'])];
	    searchUtil.getNlsOfPropertiesValues(toTranslate).then(function(translatedValues) {
	        items.forEach((item) => {
	            item.status_displayValue = translatedValues["ds6w:status"][item.status_actualValue] ? translatedValues["ds6w:status"][item.status_actualValue] : item.status_actualValue;
	            item.type_displayValue = translatedValues["ds6w:type"][item.type_actualValue] ? translatedValues["ds6w:type"][item.type_actualValue] : item.type_actualValue;
	        });
	    });
	};

	CreatePublication.prototype.processForContentData = function(options,items){
		var returnData = [];
		var that=this;
		
		var helper=new PackageHelper();
		let updatedOptions = {...options, items:items, helper:helper, returnData:returnData};
		return that.commonController.getClassificationNames(updatedOptions);
	};
	
	CreatePublication.prototype.getReadableFileSize = function (size) {
	    let i = size == 0 || undefined ? 0 : Math.floor(Math.log(size) / Math.log(1024));
	    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
	};
																							  
	CreatePublication.prototype.verifyAndCreatePublication = async function(packageOptions) {		
		var packageHelper=new PackageHelper();
		let that=this;
        if (packageOptions.state === ENOXTDPConstants.state_released) {
            UIMask.mask(widget.body, NLS.loading_content);
			// make worksheets/disclaimers api calls and check if any is IP,
			//show widget error and make premature return from the function
			//check if attachments added to the Package are IP classified
			let attachmentData = await that.publicationController.verifyAttachmentsClassification({id: packageOptions.data.params.id});
			if(attachmentData.classifiedAttachments && attachmentData.classifiedAttachments.length>0) {
				widget.notificationUtil.showError(NLS.generate_publication_blocked_attachment_classification+attachmentData.classifiedAttachments.toString()
					+NLS.publication_blocked_attachments_resolution);
				UIMask.unmask(widget.body);
				return;
			}
			packageOptions.attachmentOption = attachmentData;
                        let result = await that.commonPackageModel.getContents(packageOptions)
			//packageOptions.bomdata = result.data[result.data.length-1].partDetailsMap; //Uncomment for BOM Display
			//result.data.pop(); //Uncomment for BOM Display
			packageOptions.packageContent = result.data;
			let noPackageContent = (packageOptions.packageContent).length;
            packageHelper.processClassificationData(packageOptions.packageContent);
			packageOptions.packageContent.forEach((content) => {
				packageHelper.processClassificationData(content.FileToPublish);
			});
			this.handleNLSTranslations(packageOptions.packageContent);
			let resdata = await this.processForContentData(packageOptions,packageOptions.packageContent)
			for(let i = 0 ; i<noPackageContent ; i++){
				if(resdata[i].grid.id ===  (packageOptions.packageContent)[i].id){
					(packageOptions.packageContent)[i].ipClassesConfirmedDetails =  resdata[i].grid.ipClassesConfirmedDetails;
					(packageOptions.packageContent)[i].exportClassesConfirmedDetails = resdata[i].grid.exportClassesConfirmedDetails;
					(packageOptions.packageContent)[i].classesTooltip= resdata[i].grid.classesTooltip;
					(packageOptions.packageContent)[i].isContentRowAccessible = resdata[i].grid.isContentRowAccessible;
				}
			}
			// check if confimed ip/export classes have changed
			let contentClassUpdated = [];
			let contentClassificationUnchanged = resdata.every((content) => {
				let contentData = content.grid;
				let confirmedIPClasses = contentData.ipClassesConfirmedDetails.map((ipClass) => ipClass.classId);
				let confirmedExportClasses = contentData.exportClassesConfirmedDetails.map((exportClass) => exportClass.classId);
				let ipClassesUnchanged = Object.keys(Object.assign({}, ...contentData.IPProtectionNameId || [])).every((classId) => confirmedIPClasses.includes(classId));
				let exportClassesUnchanged = Object.keys(Object.assign({}, ...contentData.IPExportControlNameId || [])).every((classId) => confirmedExportClasses.includes(classId));
				(!ipClassesUnchanged || !exportClassesUnchanged) && contentClassUpdated.push(contentData.title);
				return ipClassesUnchanged && exportClassesUnchanged;
			});
			let anyContentUnaccessible = resdata.some((content) => content.grid.isContentRowAccessible);
			if(contentClassificationUnchanged && !anyContentUnaccessible) {
					//Get Translated label for BOM Display
					/* //Uncomment for BOM Display
					let assemblyDetails = JSON.parse(packageOptions.bomdata).assemblyDetails;
					if (! (typeof assemblyDetails === 'string' || assemblyDetails instanceof String)){
						let searchUtil = new SearchUtility();
						let toTranslate = {
							'ds6w:status' : [],
							'ds6w:type'	: []			
						};
						assemblyDetails.forEach((ob)=> {
							toTranslate['ds6w:status'].push(ob.St);
							toTranslate['ds6w:type'].push(ob.Ty);
						});
						toTranslate['ds6w:status'] = [...new Set(toTranslate['ds6w:status'])];
						toTranslate['ds6w:type'] = [...new Set(toTranslate['ds6w:type'])];
						searchUtil.getNlsOfPropertiesValues(toTranslate).then(function (translatedValues) {
							packageOptions.translatedValues = translatedValues;
							packageOptions.createPub.render(packageOptions);
						});	
					}else{*/
						packageOptions.createPub.render(packageOptions);
					//}
				}
			else {
				if(!contentClassificationUnchanged) {
					widget.notificationUtil.showError(NLS.generate_publication_blocked_content_classification_change+contentClassUpdated.toString()+NLS.publication_block_resolution);
				}
				else {
					widget.notificationUtil.showError(NLS.generate_publication_blocked_notaccessible_content+NLS.publication_block_resolution);
				}
			}
			UIMask.unmask(widget.body);
        } else {
            widget.notificationUtil.showError(NLS.generate_publication_wrong_state_error);
        }
    };

	return CreatePublication;
});
