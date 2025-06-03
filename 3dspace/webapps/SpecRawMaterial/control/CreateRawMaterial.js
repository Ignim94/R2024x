define('DS/SpecRawMaterial/control/CreateRawMaterial', [
	'UWA/Core',
	'UWA/Controls/Abstract',
	'DS/Controls/TooltipModel',
	'DS/XSRCommonComponents/utils/Utils',
	'DS/XSRCommonComponents/utils/RequestUtil',
	'DS/XSRCommonComponents/createform/view/NewDialog',
	'DS/XSRCommonComponents/createform/view/NewForm',
	'DS/XSRCommonComponents/utils/ItemServiceProvider',
	"DS/SpecRawMaterial/utils/RawMaterialServiceProvider",
	'DS/XSRCommonComponents/utils/XInfraRequestUtil',
	'DS/XSRCommonComponents/utils/Notification',
	'DS/XSRCommonComponents/utils/XSRMask',
	'DS/XSRCommonComponents/utils/XSRSearch',
	'DS/XSRCommonComponents/utils/DocumentServiceProvider',
	'DS/XSRCommonComponents/utils/Constants',
	"DS/XSRCommonComponents/utils/IndexServiceProvider",
	"DS/XSRCommonComponents/createform/util/FormJson",
	"DS/XSRCommonComponents/utils/TypeUtils",
	'DS/WebappsUtils/WebappsUtils',
	'i18n!DS/SpecRawMaterial/assets/nls/SpecRawMaterial',
	'i18n!DS/XSRCommonComponents/assets/nls/XSRCommonComponents',
], function (UWA, Abstract, WUXTooltipModel, Utils,
	RequestUtil, Dialog, Form, ItemServiceProvider, RMService, XCreateSpecModel, Notification, Mask, SearchManager, FileModel,
	Constants, IndexServiceProvider, FormJson, TypeUtils, WebappsUtils, NLS, NLS_CC) {
	'use strict';

	var CreateRawMaterial = Abstract.extend({
		newForm: null,
		templateList: null,
		formFields: null,
		target: null,
		options: null,
		dialog: null,
		CADInsertables: null,
		CAD_ORIGIN_TYPE_V6: "V6",
		CAD_ORIGIN_TYPE_V5: "V5",

		searchKeyMappings: {
			coreMaterials: {
				"resourceid": "physicalid",
				"ds6w:what/ds6w:status": "CURRENT",
				"ds6w:label": "LABEL",
				"ds6w:identifier": "name",
				"ds6w:what/ds6w:type": "type",
				"ds6w:who/ds6w:responsible": "owner"
			}
		},


		init: function (iOptions) {
			var that = this;
			this._parent(iOptions);
			this.basicModelEvents = iOptions.appCore.basicModelEvents;
			this.target = iOptions.appCore.specMainContainer;
			this.createCloseAction = iOptions.onCreateSuccess;
			this.createAction = iOptions.createAction;
			this.parentId = iOptions.parentId;
			this.parentTitle = iOptions.parentTitle;
			this.advanceUi = iOptions.advanceUi || false;

		},

		execute: function () {
			var that = this;
			this.container = widget.body;
			Mask.maskLoader(this.container);
			let data = new FormJson().getRawMaterialJson(that.advanceUi);
			that.initDetailedView(data);
		},

		initDetailedView: function (InputData) {
			var data = InputData;
			this.rmAttributes = [];
			var chg = RequestUtil.workUnderContext ? RequestUtil.workUnderContext.getChange() : undefined;
			if (chg && chg.change && chg.change.id) {
				data.showWorkUnderIndicator = true;
				data.workUnderTitle = chg.change.title;
			}

			this.newForm = new Form(data).render();
			this.formFields = this.newForm.formfieldControls;
			var that = this;
			var iOptions = this.options;
			iOptions.Title = NLS.NewRawMaterial;
			if(that.parentTitle)
				iOptions.Title += " | "+ that.parentTitle;
			iOptions.Content = this.newForm.container;
			iOptions.width = 500;
			if (that.advanceUi && widget.getViewportDimensions()['height']>500) {
				iOptions.height = 500;
			}
			iOptions.renderTo = this.target;
			Mask.unmaskLoader(this.container);

			this.dialog = new Dialog(iOptions);
			this.dialog.destroyPrevDialog();

			this.dialog.render();

			if (that.advanceUi) {
				this.newForm.scrollFormTab();
				this.newForm.listenToScroll();
			}

			this.newForm.listenTo(this.newForm, 'EVENT_SEARCH_GLOBAL', (fieldName) => that.evt_SearchGlobal(fieldName));
			// Loading the template on selecting the Raw Material subtype
			this.newForm.listenTo(this.newForm, 'SELECT_CHANGE_EVENT', (fieldName) => that.evt_SelectChange(fieldName));
			this.newForm.listenTo(this.newForm, 'SELECT_CHANGE_EMPTY_EVENT', (fieldName) => that.evt_SelectChangeEmpty(fieldName));
			this.newForm.listenTo(this.newForm, 'TYPE_TOGGLE_CHANGE', (fieldName) => that.evt_TypeToggleChange(fieldName));
			this.newForm.listenTo(this.newForm, 'EVENT_SPINBOX_CHANGE', (options) => that.evt_SpinBoxChange(options));

			this.newForm.listenTo(this.newForm, 'CONTAINS_DIRTY_FIELD', function (options) {
				that.dialog.dispatchEvent('CONTAINS_DIRTY_FIELD', options);
			});


			// to inject Raw Materials subtypes to diplay in the create form.
			this.injectRawMaterailSubTypes();
			// if(this.formFields.CADAuthoring &&
			// widget.getValue("CADAuthoring") === true ){
			// this.fetchCADInsertables();
			// }

			if (this.newForm._fields.material) {
				this.loadMaterials();
			}
			if (this.newForm._fields.dimensions) {
				this.loadDimensions();
			}

			this.dialog.listenTo(this.dialog, 'EVENT_CLICK_SPEC_OK', function () {
				if (that.validateFields()) {
					that.enableOrDisableDialogButtons(false);
					that.dialog.closeDialog();
					that.showCreateLoader();
					var createSpecPromise = that.createRM();

					createSpecPromise.then(that.createSpecCallBack.bind(that), that.onError.bind(that));
				}
			});

			this.dialog.listenTo(this.dialog, 'EVENT_CLICK_SPEC_APPLY', function () {

				var isfieldDirty = that.validateFields();
				if (isfieldDirty) {
					that.enableOrDisableDialogButtons(isfieldDirty);

					var nlsmessage = NLS.replace(NLS.get('CreatingTechSpecLoader'), {
						title: that.getInput('Title')
					});
					that.dialog.maskOrUnMaskDialog(nlsmessage);
					var createSpecPromise = that.createRM();
					createSpecPromise.then(that.createSpecApplyCallBack.bind(that)).catch(that.onError.bind(that));

				}
			});


		},

		createRM: function () {
			var that = this;
			var requestInput = {};
			requestInput.title = that.getInput('Title');
			var type = that.getInput('Type');
			requestInput.rmType = type;
			if (that.parentId) requestInput.parentId = that.parentId;


			requestInput.description = that.getInput('Description') || '';
			requestInput.materialPID = that.getInput('Material') || '';
			requestInput.rmClassification = that.getInput('RawMaterialClassification') || [];
			requestInput.rmAdditionalExtensions = [];

			let dimensionSelected = that.getInput('Dimensions') || '';
			requestInput.rmDimensions = [dimensionSelected];

			requestInput.rmAttributes = that.fetchRMAttributes();

			// if(widget.getValue("CADAuthoring") === true ){
			// requestInput.CheckfilenameDisplay = that.cadTemplates.CheckfilenameDisplay;
			// requestInput.filenameStatus = that.cadTemplates.filenameStatus;
			// requestInput.Templates = that.cadTemplates.results;
			// requestInput.Specializedtypes = that.cadTemplates.types;
			// requestInput.cadOriginType = that.getInput('CADAuthoring') ?
			// that.getInput('CADAuthoring') : 'V6';
			// }

			console.log(requestInput);

			return new RMService({
				isChangeControlled: true
			}).createRawM({
				'data': requestInput
			});

		},

		evt_SearchGlobal: function (fieldName) {
			var that = this;
			var launchSearch = function () {
				var callbackFunction = function (searchResult) {
					that.newForm.setValueInAutocomplete(searchResult[0]["ds6w:label"], searchResult[0]["id"], fieldName);
					that.newForm.checkDirtyFields.call(that);
				}

				var options = {
					allowedTypes: searchAllowedTypes,
					role: '',
					subType: '',
					multiSel: false,
					criteria: textToSearch,
					precondition: '',
					in_apps_callback: callbackFunction,
					excludeList: []
				}
				new SearchManager(options).launchSearch(options);
			};

			let field = that.formFields[fieldName].inputfield[0];
			let textToSearch;
			if (field.selectedItems) {
				textToSearch = field.selectedItems._options.label;
			} else {
				textToSearch = field.value;
			}
			let searchAllowedTypes = that.getAllowedTypesToSearch(fieldName);

			launchSearch();
		},

		evt_SelectChange: function (fieldName) {
			var that = this;
			if (fieldName.toLowerCase() === "type") {
				let selectedType = that.getInput('Type');
				if (that.formFields.Template) {
					that.formFields.Template.inputfield.value = "";
					that.loadTemplate(selectedType);
				}
			} else if (fieldName.toLowerCase() === "template") {
				that.templateChangeEvent();
			} else if (fieldName.toLowerCase() === "dimensions") {
				let selectedType = that.getInput('Dimensions');
				if (that.advanceUi) {
					that.formFields.uomunit.inputfield.value = "";
					that.dimensionChangeEvent(selectedType);
				}
			} else if (fieldName.toLowerCase() === "uomunit") {
				that.quantityUOMCheck();
			}

		},

		evt_SelectChangeEmpty: function (fieldName) {
			var that = this;
			if (fieldName.toLowerCase() === "type") {
				if (that.formFields.Template) {
					that.newForm.updateField(null, "Template", false);
				}
			} else if (fieldName.toLowerCase() === "dimensions") {
				if (that.advanceUi && that.formFields.uomunit) {
					that.newForm.updateField(null, "uomunit", false);
					that.quantityUOMCheck();
				}
			} else if (fieldName.toLowerCase() === "uomunit") {
				that.quantityUOMCheck();
			}

		},

		evt_TypeToggleChange: function (options) {
			var that = this;
			if (that.formFields.asneeded.inputfield.checkFlag) {

				that.formFields.uomunit.inputfield.fieldoptions.mandatory = false;
				that.formFields.quantity.inputfield.fieldoptions.mandatory = false;

				that.formFields.uomunit.inputfield.hasDirtyField = false;
				that.formFields.quantity.inputfield.hasDirtyField = false;

				//that.formFields.uomunit.fieldLabel.mandFlagSpan.hide();
				//that.formFields.quantity.fieldLabel.mandFlagSpan.hide();
				that.quantityUOMCheck();

			} else {

				that.formFields.uomunit.inputfield.fieldoptions.mandatory = true;
				that.formFields.quantity.inputfield.fieldoptions.mandatory = true;

				//that.formFields.uomunit.fieldLabel.mandFlagSpan.show();
				//that.formFields.quantity.fieldLabel.mandFlagSpan.show();

				if (!that.formFields.uomunit.inputfield.value || !that.formFields.quantity.inputfield.value) {
					that.formFields.uomunit.inputfield.hasDirtyField = true;
					that.formFields.quantity.inputfield.hasDirtyField = true;
					// that.dialog._dialog.buttons.Ok.disabled = true;
				}

			}

		},

		evt_SpinBoxChange: function(options){
			var that = this;
			if (options.field.toLowerCase() === "quantity") {
				that.quantityUOMCheck();
			}
		},

		quantityUOMCheck: function () {
			let asRequired = this.formFields.asneeded.inputfield.checkFlag;
			if (!asRequired) return;

			let uomUnit = this.getInput('uomunit');
			let quantity = this.getInput('quantity');
			let uomDirty = this.formFields.uomunit.inputfield.hasDirtyField;
			let quantityDirty = this.formFields.quantity.inputfield.hasDirtyField;
			let showUOMError = false;
			let showQuantityError = false;
			
			if (asRequired && uomUnit && !quantity) {
				showQuantityError = true;
				this.formFields.quantity.inputfield.fieldoptions.mandatory = true;
				if (!quantityDirty) this.formFields.quantity.inputfield.hasDirtyField = true;
			}
			if (asRequired && !uomUnit && quantity && quantity>0) {
				showUOMError = true;
				this.formFields.uomunit.inputfield.fieldoptions.mandatory = true;
				this.formFields.uomunit.inputfield.hasDirtyField = true;
			}
			if (asRequired && !uomUnit && !quantity) {
				this.formFields.uomunit.inputfield.hasDirtyField = this.formFields.quantity.inputfield.hasDirtyField = false;
				uomDirty = quantityDirty = false;
				this.formFields.uomunit.inputfield.fieldoptions.mandatory = this.formFields.quantity.inputfield.fieldoptions.mandatory = false;
			}

			
			if (showUOMError) this.newForm.toggleErrorMessage("uomunit", NLS.UOMError, true);
			if (!showUOMError) this.newForm.toggleErrorMessage("uomunit", "", false);
			if (showQuantityError) this.newForm.toggleErrorMessage("quantity", NLS.QuantityError, true);
			if (!showQuantityError) this.newForm.toggleErrorMessage("quantity", "", false);
			this.newForm.checkDirtyFields(this);
		},

		/**
		 * function is used to inject Raw materaila subtypes list in thecreate
		 * form Raw material type will appear at the top of the list
		 */
		injectRawMaterailSubTypes: function () {
			var that = this;
		//	var types = Utils.getRawMaterialSubtypes();
			var types = Utils.getNewRawMatIncludedtypes();
			let rawMatSubTypesArr = [];
			
			let moveRawMateralSubTypesToTop = (typesArr) => {
				let arrIndex = 0;
				let temp = [...typesArr];
				temp.forEach((e, i) => {
					if (e.valueItem == "Raw_Material") {
						arrIndex = i;
					} else {
						e.labelItem = e.labelItem
					}
				});
				rawMatSubTypesArr.push(temp[arrIndex]);
				temp.splice(arrIndex, 1);
				temp.sort(function sorting(a,b){
	              let labelA = a.labelItem.toLowerCase();
                  let labelB = b.labelItem.toLowerCase();

                 return labelA > labelB ? 1: labelA < labelB ? -1 : 0;
                 
             });
				rawMatSubTypesArr = rawMatSubTypesArr.concat(temp);
			}
			if (types) {
				moveRawMateralSubTypesToTop(types);
			} else {
				/*var specmodel = new XCreateSpecModel({
					'id': "getRawMaterialSubTypes"
				});
				specmodel.invoke().then((resp) => {
					var typesArr = resp.response;
					moveRawMateralSubTypesToTop(typesArr);

				}).catch(that.onError.bind(that));*/
				that.dialog.maskOrUnMaskDialog();
				 setTimeout(function () {
					 let typeArr = Utils.getNewRawMatIncludedtypes();
						if(typeArr){ 
							moveRawMateralSubTypesToTop(typeArr);
							that.newForm.updateField(rawMatSubTypesArr, "Type", false);
							console.log("Preparing Raw Material Included types")
							that.dialog.maskOrUnMaskDialog();
						}else
							Notification.displayNotification({
								eventID: 'info',
								msg: NLS.get('ReloadCreateRawMaterial')
							});
				}, 5000);
			}
			this.newForm.updateField(rawMatSubTypesArr, "Type", false);
		},

		createSpecApplyCallBack: function (response) {
			var that = this;

			if (response && response.success) {
				Notification.displayNotification({
					eventID: 'success',
					msg: response.result.message
				});
				var rawAttributesValues = response.result;
				var templateId = that.getInput("Template");
				that.createSpecReport(rawAttributesValues.physicalId, templateId);
				if (that.createAction) {
					if (that.parentId && that.advanceUi) {
						var contQuantData = that.fetchInstanceAttributes(rawAttributesValues.physicalId);
						that.createAction(contQuantData);
					} else {
						that.createAction(rawAttributesValues.physicalId);
					}
				}

				that.resetFields();
				// that.formFields.AsNeeded.inputfield.checkFlag
				that.dialog.maskOrUnMaskDialog();
				that.enableOrDisableDialogButtons(false);

			} else {
				that.onError();
			}
		},

		showCreateLoader: function () {
			var titleValue = this.getInput("Title");
			var nlsmessage = NLS.replace(NLS.get('CreatingTechSpecLoader'), {
				title: titleValue
			});
			Mask.maskLoader(this.container, nlsmessage);
		},

		stopLoader: function () {
			Mask.unmaskLoader(this.container);
		},

		createSpecCallBack: function (response) {
			var that = this;

			if (response && !response.success) {
				Mask.unmaskLoader(that.container);
				var failureMsg = response && response.message ? response.message : "";
				Notification.displayNotification({
					eventID: 'error',
					msg: failureMsg || NLS.PhysicalPrdCreateFailure
				});
				return;
			} else {
				if (undefined !== response && null !== response) {
					var updatedAttr = response.result;

					if (that.createCloseAction) {
						if (that.parentId && that.advanceUi) {
							var contQuantData = that.fetchInstanceAttributes(updatedAttr.physicalId);
							that.createCloseAction(contQuantData);
						} else {
							that.createCloseAction(updatedAttr.physicalId, updatedAttr.itemType);
						}
					}

					/*
					 * function to open the spec viewer after creating Report
					 * object
					 */
					var openSpecViewer = function () {
						that.stopLoader();
						Notification.displayNotification({
							eventID: 'success',
							msg: response.result.message
						});
						if (!that.parentId) {
							var t = {};
							t.itemPid = response.result.physicalId;
							t.typeActual = "VPMReference";


							/*that.basicModelEvents.publish({
								event: Constants.OPEN_SPECIFICATION_VIEW,
								data: t
							});*/
						}

					};

					var templateId = that.getInput("Template");
					that.createSpecReport(updatedAttr.physicalId, templateId, openSpecViewer);

				}
			}

		},

		enableOrDisableDialogButtons: function (enable) {

			if (enable) {
				this.dialog.dispatchEvent('CONTAINS_DIRTY_FIELD', {
					hasDirtyField: false
				});
			} else {
				this.dialog.dispatchEvent('CONTAINS_DIRTY_FIELD', {
					hasDirtyField: true
				});

			}

		},

		onError: function (errorResp) {
			this.enableOrDisableDialogButtons(this.validateFields());
			this.stopLoader();
			this.dialog.maskOrUnMaskDialog();
			Mask.unmaskLoader(this.container);

			Notification.displayNotification({
				eventID: 'error',
				msg: (errorResp && errorResp.message) || NLS.PhysicalPrdCreateFailure
			});
		},

		/**
		 * fetchCADInsertables : function() { var that = this; var specmodel =
		 * new ItemServiceProvider(); this.templateList =
		 * specmodel.getCADData({'calledFrom':'fetchCADInsertables'}).then(that.fetchCADTemplates.bind(that))
		 * .catch(that.onError.bind(that)); },
		 *
		 *
		 * fetchCADTemplates : function(response){ var that = this;
		 * this.CADInsertables = response; var specModel = new
		 * ItemServiceProvider(); var inputData = {}; // todo check if value of
		 * template Type can be something else // like part or drawing, and also
		 * fix and remove calledFrom // param // inputData.templateType =
		 * 'assembly';
		 * specModel.getCADData({'data':'templateType=assembly'+'&tenant='+widget.getValue('x3dPlatformId'),'calledFrom':'fetchCADTemplates'}).then(that.filterAndInjectCADInsertables.bind(that)).catch(that.onError.bind(that)); },
		 *
		 * filterAndInjectCADInsertables : function(cadTemplatesResponse){ var
		 * that = this; this.cadTemplates = cadTemplatesResponse; this.cadList =
		 * this.CADInsertables; var applicableCADChoices = []; // V6 case var
		 * UPSdata = this.cadList.results; // todo check where to get the
		 * datas.type from ( following is // just a temp code) var datas={};
		 * datas.type="assembly";
		 *
		 * var ConnectorName = "3DExperience"; for (var i = 0; i <
		 * UPSdata.length; i++) { var localUPSdata = UPSdata[i]; if
		 * (localUPSdata.CAD==ConnectorName) { var BlanckPrefix = " "; var
		 * DEXPrefix = "3DExperience"; var iconpath =
		 * WebappsUtils.getWebappsAssetUrl('ENOCollabSharingCmds',
		 * 'icons/3DEXPERIENCE.png'); if (datas.type == "assembly" || datas.type ==
		 * "component"){ ConnectorName = UWA.i18n(DEXPrefix); var fileName =
		 * 'ProductTemplate'; if (datas.type == "component") { fileName =
		 * 'PartTemplate'; } // var fileNameNls = UWA.i18n(fileName); var
		 * fileNameNls = BlanckPrefix + ConnectorName + " - " +
		 * UWA.i18n(fileName); var item = {Connector: ConnectorName, icon:
		 * iconpath,labelItem: fileNameNls.trim(), valueItem:
		 * that.CAD_ORIGIN_TYPE_V6}; var preferredCAD = that.getpreferredCAD();
		 * if (preferredCAD == DEXPrefix){ applicableCADChoices.push(item); }
		 * else { applicableCADChoices.push(item); } } } }
		 *
		 * for(var i=0;i<UPSdata.length;i++){ var localUPSData = UPSdata[i];
		 * var tempChoice =
		 * that.getavailableUPSChoice(localUPSData,this.cadTemplates.results);
		 * for (var j = 0; j < tempChoice.length; j++) {
		 * applicableCADChoices.push(tempChoice[j]); } }
		 *
		 *
		 *
		 * if(UWA.is(applicableCADChoices) && applicableCADChoices.length>0){ //
		 * a function which decides the applicable templates // var
		 * applicableTemplates = //
		 * this.filterApplicableTemplates(this.cadList.results);
		 * this.formFields.CADAuthoring.inputfield.elementsList =
		 * applicableCADChoices; if(applicableCADChoices.length === 1) {
		 * this.formFields.CADAuthoring.inputfield.value
		 * =applicableCADChoices[0].valueItem;
		 * this.setToolTip(applicableCADChoices[0]); } } },
		 *
		 * getavailableUPSChoice : function(UPSData,templateNames){ var that =
		 * this; var Choice = []; var BlanckPrefix = " "; var upsCAD =
		 * UPSData.CAD; var upsprefix = UPSData.prefix; var upsiconpath=
		 * 'icons/'+UPSData.icon+'.png'; var ConnectorName =
		 * UWA.i18n(upsprefix); var iconpath =
		 * WebappsUtils.getWebappsAssetUrl('ENOCollabSharingCmds', upsiconpath) ;
		 * var preferredCAD = that.getpreferredCAD(); // todo check where to get
		 * the preferred template from var preferredTemplate = null; //
		 * that._getpreferredTemplate(upsprefix);
		 *
		 * templateNames.forEach(function(templateName){ var fileName =
		 * templateName.fileName; var fullfileName = fileName; if
		 * (fileName.startsWith(upsprefix) == 1){ fileName =
		 * fileName.substring(upsprefix.length, fileName.length); var
		 * fileNameNls = BlanckPrefix + ConnectorName + " - " +
		 * UWA.i18n(fileName); var item = { Connector: ConnectorName, icon:
		 * iconpath, labelItem: fileNameNls.trim(), valueItem: fullfileName}; if
		 * (preferredTemplate !== null) { if (preferredTemplate == fileName){
		 * Choice.push(item); } } else { if (preferredCAD !== null) { if
		 * (preferredCAD == upsCAD){ Choice.push(item); } } else {
		 * Choice.push(item); } } } }); return Choice; },
		 *
		 * getpreferredCAD: function() { return (widget.getValue('CADAuthoring')
		 * === 'false') ? "3DExperience" : null; },
		 */

		loadTemplate: function (type) {

			var that = this;
			if (that.formFields.Template) {
				var specmodel = new XCreateSpecModel({
					'id': "getSpecTemplates"
				});
				this.templateList = specmodel.invoke({
						'data': {
							"specType": type
						}
					})
					.then((response) => {
						this.templateList = response;

						if (this.templateList && this.templateList.response.length > 0) {
							this.newForm.updateField(this.templateList.response, "Template", false);
							this.formFields.Template.inputfield.placeholder = NLS.SelectTemplate;
						} else {
							this.newForm.updateField(this.templateList.response, "Template", false);
							this.formFields.Template.inputfield.elementsList = "";
							this.formFields.Template.inputfield.placeholder = NLS.NoResults;
						}
					})
					.catch((error) => {
						console.log(error);
						this.formFields.Template.inputfield.elementsList = "";
						this.formFields.Template.inputfield.placeholder = NLS.NoResults;
					});
			}

		},

		templateChangeEvent: function () {
			// this.resetFields();
			var selectedValue = this.formFields.Template.inputfield.value;
			if (undefined === selectedValue) {
				this.resetToolTip();
			}
			for (var i in this.templateList.response) {
				if (this.templateList.response.hasOwnProperty(i) && selectedValue == this.templateList.response[i].valueItem) {
					this.setToolTip(this.templateList.response[i]);
				}
			}
		},

		resetToolTip: function () {

			this.formFields.Template.inputfield.tooltipInfos = new WUXTooltipModel({
				shortHelp: ""
			});

		},

		setToolTip: function (template) {

			this.formFields.Template.inputfield.tooltipInfos = new WUXTooltipModel({
				shortHelp: template.description
			});

		},

		validateFields: function () {
			var key, res = true,
				fields, hasMand = false,
				dirtyField = false;

			for (key in this.formFields) {
				if (this.formFields.hasOwnProperty(key)) {
					var x = this.formFields[key];
					var ishidden = UWA.is(x.parentfield) ? x.parentfield.isHidden() : false;
					var ismandatory = UWA.is(x.inputfield.fieldoptions) ? x.inputfield.fieldoptions.mandatory : false;
					var label = UWA.is(x.inputfield.fieldoptions) ? x.inputfield.fieldoptions.label : "";
					if (!ishidden && ismandatory) {

						if (!this.hasValue(x.inputfield.value)) {
							var foc = x.inputfield;
							foc._giveFocus();
							hasMand = true;
							fields = undefined !== fields ? fields + "," + label : label;
							res = false;
						}

					}
				}

			}

			if (dirtyField) {
				Notification.displayNotification({
					eventID: 'error',
					msg: NLS.CorrectFields
				});
			} else if (hasMand) {
				Notification.displayNotification({
					eventID: 'error',
					msg: NLS.RequiredFields + fields
				});
			}

			return res;
		},

		resetFields: function () {
			this.newForm.resetFields(this.advanceUi);
		},

		createSpecReport: function (itemID, templateId, callback) {
			var context = this;
			if (context.hasValue(templateId)) {
				var successFunction = function (response) {
					var specPid = response.specPid;
					if (callback) {
						callback(specPid);
					}

				};

				var requestInput = {
					'itemPid': itemID,
					'template': templateId
				};
				var input = {
					'data': requestInput
				};
				var specmodel = new XCreateSpecModel({
					'id': "SpecificationReport"
				});
				var createReportPromise = specmodel.create(input);
				createReportPromise.then(successFunction.bind(this)).catch(context.onError.bind(this));
			} else if (callback && typeof callback === "function") {
				callback();
			}
		},

		hasValue: function (value) {
			if (null !== value && undefined !== value && "" !== value) {
				return true;
			} else {
				return false;
			}

		},

		fetchRMAttributes: function () {
			var that = this;
			var attrJson = {};
			let attributes = that.rmAttributes;

			Object.keys(attributes).forEach(function (key) {
				let attrKey = attributes[key];
				let attrValue = that.getInput(attrKey);

				attrJson[attrKey] = attrValue;
			});

			attrJson[Constants.ITEM_REVISIONCOMMENT] = that.getInput("RevisionComment");


			return attrJson;
		},

		fetchInstanceAttributes: function (id) {
			var that = this;
			var contQuantData = {
				asRequired: that.getInput("asneeded"),
				quantityUOM: that.getInput("uomunit"),
				quantity: that.getInput("quantity"),
				dimension: that.getInput("Dimensions"),
				childId: id
			}

			return contQuantData;
		},

		getAllowedTypesToSearch: function (fieldName) {
			let searchAllowedTypes;
			switch (fieldName.toLowerCase()) {
			case "template":
				searchAllowedTypes = ['Specification Report Template'];
				break;
			case "material":
				searchAllowedTypes = ['dsc_matref_ref_Core'];
				break;
			default:
				searchAllowedTypes = [];
				break;
			}

			return searchAllowedTypes;
		},

		setKeyMappings: function (keyMappings) {
			this._keyMappings = keyMappings;
		},

		getKeyMappings: function () {
			return this._keyMappings;
		},

		loadMaterials: function () {
			let arrCoreMaterials = [];
			var that = this;
			let selectPredicates = [
				"id",
				"ds6w:originator",
				"ds6w:identifier",
				"ds6w:label",
				"ds6w:created",
				"ds6w:policy",
				"ds6w:type"
			];
			let query = {
				key: 'query',
				value: "(flattenedtaxonomies:\"types/dsc_matref_ref_Core\")"
			};
			that.setKeyMappings(that.searchKeyMappings);
			new IndexServiceProvider().searchGlobal(selectPredicates, query, null).then(function (response) {
				var indexedResponse;

				if (typeof response === "string")
					indexedResponse = JSON.parse(response);
				else
					indexedResponse = response;

				if (indexedResponse && indexedResponse.infos.nresults > 0) {

					var coreMaterials = indexedResponse.results;

					var response = [];
					Object.keys(coreMaterials).forEach(function (coreKey) {
						let attributes = coreMaterials[coreKey].attributes;
						var temp = {};
						Object.keys(attributes).forEach(function (attrkey) {
							if (attributes[attrkey].name === "resourceid") {
								temp.valueItem = attributes[attrkey].value;
							}
							if (attributes[attrkey].name === "ds6w:label") {
								temp.labelItem = attributes[attrkey].value;
							}
						});
						response[coreKey] = temp;
					});
					that.newForm.updateField(response, "Material", false);

				} else {
					that.newForm.updateField(null, "Material", false);
				}

			}).catch(function (response) {
				that.newForm.updateField(null, "Material", false);
				Mask.unmaskLoader(that.container);
				Notification.clearNotifications();
				// Notification.displayNotification({
				// eventID: 'warning',
				// msg: response
				// });
			});
		},

		/**
		 * loadClassifications : function(){ var that = this; new
		 * RMService({isChangeControlled :
		 * true}).fetchRMClassification().then(function(response){ if(response &&
		 * response.result && response.success){ let responseJson =
		 * response.result.rmExtensionSchema;
		 *
		 * let attributeList = responseJson.attributeList; let identifier =
		 * responseJson.indentifier; let subInterfaceList =
		 * responseJson.subInterfaceList;
		 *
		 * let rmJsonUtil = new RMJsonUtils();
		 * rmJsonUtil.setClassificationTreeModel(subInterfaceList);
		 *
		 * let data = rmJsonUtil.getClassificationTreeModel(); let fieldJson =
		 * rmJsonUtil.getClassificationFieldArray(); that.rmAttributes =
		 * rmJsonUtil.getRmAttributes();
		 *
		 * that.newForm.updateField(data, "RawMaterialClassification", true);
		 * that.newForm.appendFieldsToForm(fieldJson); } }, function(error){
		 * Mask.unmaskLoader(that.container); var failureMsg = error &&
		 * error.message ? error.message : "";
		 * Notification.displayNotification({ eventID: 'error', msg: failureMsg ||
		 * NLS.PhysicalPrdCreateFailure }); return; }); },
		 */

		loadDimensions: function () {
			var that = this;
			var dimensions = TypeUtils.getDimensions();
			var data = [];
			Object.keys(dimensions).forEach(function (dbName) {
				data.push({
					labelItem: (!that.newForm.isNonNlsLabel(dimensions[dbName])) ? dimensions[dbName] : dbName,
					valueItem: dbName,
				});
			});

			that.newForm.updateField(data, "Dimensions", false);

		},

		dimensionChangeEvent: function (dimension) {
			var that = this;
			var uomUnits = TypeUtils.getUOMUnits(dimension);
			var data = [];
			Object.keys(uomUnits).forEach(function (dbName) {
				data.push({
					labelItem: (!that.newForm.isNonNlsLabel(uomUnits[dbName])) ? uomUnits[dbName] : dbName,
					valueItem: dbName,
				});
			});
            data.sort(function sorting(a,b){
	              let labelA = a.labelItem.toLowerCase();
                  let labelB = b.labelItem.toLowerCase();

                 return labelA > labelB ? 1: labelA < labelB ? -1 : 0;
                 
             });
			that.newForm.updateField(data, "uomunit", false);
			this.formFields.uomunit.inputfield.placeholder = NLS_CC.placeholder_UOMUnit;

		},

		getInput: function (field) {
			if (this.formFields[field]) {
				if (field.toLowerCase() === "material") {
					return this.formFields[field].inputfield[0].value;
				}
				if (field.toLowerCase() === "asneeded") {
					return this.formFields[field].inputfield.checkFlag
				}
				return this.formFields[field].inputfield.value;
			}
			return;
		}
	});
	return CreateRawMaterial;
});
