/* global widget */
/* global UWA */
define('DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
    [
	'DS/ENOXPackageUXInfra/Constants/ENOXPackageConstants',
	'i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra',
	'UWA/Utils',
	'DS/Controls/TooltipModel',
	'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
	'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
	'DS/UIKIT/Mask'
    ],
    function(ENOXTDPConstants,NLS,Utils,WUXTooltipModel,XsourcingCollectionView,CommonUtils,UIMask) {
		'use strict';
        let TDPCommonHelper = function TDPCommonHelper() {
		};

		TDPCommonHelper.prototype.getObjectDetailsInInfoPanel = function(hyperLinkOption) {
			
			let openDetailsPanel  = function(){
				let rightSidePanelOptions = {};
				rightSidePanelOptions.data={
						params:{
							id:hyperLinkOption.contextObjId
						}
				};
				rightSidePanelOptions.detailsContainer = widget.app._triptychWrapper.getRightPanelContainer();
				if( rightSidePanelOptions.detailsContainer.empty)  rightSidePanelOptions.detailsContainer.empty();
				rightSidePanelOptions._mediator =  widget.app._mediator;
				rightSidePanelOptions._triptychWrapper = 	widget.app._triptychWrapper;
				rightSidePanelOptions.router = widget.app.router;
				rightSidePanelOptions.applicationChannel = widget.app._applicationChannel;
				rightSidePanelOptions.platformServices = 	widget.app.platformServices;
				rightSidePanelOptions.forInfo = true;
				if(hyperLinkOption.infoPanelForPublicationDetails) rightSidePanelOptions.infoPanelForPublicationDetails=true;
				if(hyperLinkOption.infoPanelForPackageDetails)rightSidePanelOptions.infoPanelForPackageDetails=true;
				if(hyperLinkOption.updateCRList)rightSidePanelOptions.updateCRList=hyperLinkOption.updateCRList;
				hyperLinkOption.callControllerMethod.open(rightSidePanelOptions);

			};
			return openDetailsPanel;
			
		};
		
		TDPCommonHelper.prototype.getDisplayDataForIPandECClasses = function(options){
						let classes = "";
						for(let i=0;i<options.classesArray.length-1;i++){
							classes=classes+options.classesArray[i]+ENOXTDPConstants.COMMA+ENOXTDPConstants.SPACE;
					    }
						classes=classes+options.classesArray[options.classesArray.length-1];
						let dataToBeDisplayed = classes;
						if(options.classesArray && options.classesArray.length>1){
						let noOfFittingCharacters=Math.floor(options.width/5)-15;
						let charactersToBeDisplayed=classes.substring(0, noOfFittingCharacters);
						let noOfClassesNotDisplayed=(classes.substring(noOfFittingCharacters)).split(",").filter(function (str) { return (str !== "");} );
						noOfClassesNotDisplayed=noOfClassesNotDisplayed.length;
						if(noOfClassesNotDisplayed!==0){
							dataToBeDisplayed=charactersToBeDisplayed+"..."+"+"+noOfClassesNotDisplayed.toString();
						}
					 	}
					let returnData={
						"dataToBeDisplayed" : dataToBeDisplayed,
						"Classes" : classes
					};
					return returnData;
		};

		TDPCommonHelper.prototype.getDisplayDataForTDPLevel = function(item){
			let tdpValue = item["Package Level"];
			let tdpDisplayValue = ENOXTDPConstants.EMPTY_STRING;
			if(ENOXTDPConstants.CONCEPTUAL_LEVEL === tdpValue) {
				tdpDisplayValue = NLS.CONCEPTUAL;
			} else if(ENOXTDPConstants.DEVELOPMENTAL_LEVEL === tdpValue) {
				tdpDisplayValue = NLS.DEVELOPMENTAL;
			} else if(ENOXTDPConstants.PRODUCT_LEVEL === tdpValue) {
				tdpDisplayValue = NLS.PRODUCT;
			} else if(ENOXTDPConstants.COMMERCIAL_LEVEL === tdpValue) {
				tdpDisplayValue = NLS.COMMERCIAL;
			}
			return tdpDisplayValue;
		};
		
		TDPCommonHelper.prototype.getErrorIcon = function(node, isIP, packageState){
			let validStates = [ENOXTDPConstants.state_released,ENOXTDPConstants.state_obsolete];
				if (validStates.some((state) => state === packageState)) {
					let	confirmedClasses = node.getAttributeValue(isIP? "ipClassesConfirmedDetails": "exportClassesConfirmedDetails");
					let currentClassIds = [];
					if(node.getAttributeValue("IPProtectionNameId") || node.getAttributeValue("IPExportControlNameId")) {
						currentClassIds = Object.keys(Object.assign({}, ...node.getAttributeValue(isIP? "IPProtectionNameId": "IPExportControlNameId")));
					}
					let iconClass;
					let tooltipTitle;
					let tooltipBody = [];
					if(confirmedClasses === undefined) confirmedClasses = [];
					let classesMatched = confirmedClasses.length === currentClassIds.length && confirmedClasses.every((detail) => currentClassIds.includes(detail.classId));
					if(!classesMatched) {
						iconClass = "attention wux-ui-3ds";
						tooltipTitle = NLS.content_classify_tooltip_header;
						tooltipBody = confirmedClasses.map((detail) => detail.classDisplayName);
					}
					else
						return;
					let tooltipDetails;
					if(confirmedClasses.length === 0) {
						tooltipDetails = {
							shortHelp: NLS.no_classification_warning_message
						};
					}
					else {
						tooltipDetails = {
						  title: tooltipTitle,
						  shortHelp: tooltipBody.toString()
						};
						
					}
					return {
						icon: {
							iconName: iconClass,
							tooltipInfos: new WUXTooltipModel(tooltipDetails)
						}
					};
				}
		};
		TDPCommonHelper.prototype.downloadWithTicketURL = function(downloadOptions) {
				let that = this;
                let doc = document;
                if (Utils.Client.Platform.ipad) {
                    let haspopupBlocker = window.open(require.toUrl('DS/ENOXPackageManagement/assets/blankForm.html'), '_blank');
                    let returnValue={};
                    
                        doc = haspopupBlocker.document;
                    
                    return returnValue;
                }

                // For the moment, resp is basically the url return by DocumentManagement.downloadDocument
                if (UWA.is(downloadOptions.ticketURL, 'string')) {
                    // 1. Decompose the URL
                    let parsedUrl = Utils.parseUrl(downloadOptions.ticketURL);
                    // 2. Parse query part of the url
                    let params = Utils.parseQuery(parsedUrl.query);
                    // 3. Force fcs attachement mode
                   
                        params['__fcs__attachment'] = true;
                  
                    // 4. Reconstruct post URL by removing the query part
                    delete parsedUrl.query;
                    let postUrl = Utils.composeUrl(parsedUrl);
                    // 5. Create a temporary form and prepare inputs
                    let tempForm = doc.createElement('form');
                    tempForm.style.display = 'none';
                    tempForm.method = 'POST';
                    tempForm.action = postUrl;

                    Object.keys(params).map(function(key) {
                        let newInput = doc.createElement('input');
                        newInput.setAttribute('name', key);
                        newInput.setAttribute('value', params[key]);
                        tempForm.appendChild(newInput);
                    });

                    // 6. Attach temporary form to current document
                    doc.body.appendChild(tempForm);
                    // 7. Submit it
					that.submit(tempForm);
                downloadOptions.applicationChannel.publish({ event:'update-history-tab-publication', data: {}});
                    // 8. We're done, remove the temporary form
                    doc.body.removeChild(tempForm);
                }
              
            };

		TDPCommonHelper.prototype.submit = function(tempForm) {
			tempForm.submit();
		};
		
		
		TDPCommonHelper.prototype.getAssemblyDetails =function(options) {
			let that = this;
			let assemblyDetailsContainer =UWA.createElement('div', {
				id : 'assemblyDetails',
				styles:{
					'position': 'relative',
					'height': '100%'
				}
			}); 
			let assemblyDetails ="";
			if(options.bomdata){
				assemblyDetails = JSON.parse(options.bomdata).assemblyDetails;
				//assemblyDetails = options.bomdata.assemblyDetails;	
				
			}else{
				assemblyDetails = options.contentReportData.assemblyDetails; 
			}
			if(Array.isArray(assemblyDetails)) {
				that.assemblyDetailsCollectionView = new XsourcingCollectionView();
				let assemblyDetailsOptions = {
					_mediator: options.mediator ? options.mediator : options._mediator,
					rowSelection: 'none',
					container: assemblyDetailsContainer,
					views: ["Grid"],
					showToolbar: false,
					showNodeCount: false,
					uniqueIdentifier: "AssemblyDetails"
				};
				assemblyDetailsOptions.columnsConfigurations = [
					{
						"text": NLS.content_name_column,
						"dataIndex": "tree",
						getCellValue: (cellInfos) => cellInfos.nodeModel.getAttributeValue("label")
					},
					{
						"text": NLS.name,
						"dataIndex": "autoName"
					},
					{
						"text": NLS.part_details_ei_number,
						"dataIndex": "eiNumber"
					},
					{
						"text": NLS.part_details_ip_classes,
						"dataIndex": "classes"
					},
					{
						"text": NLS.TYPE,
						"dataIndex": "type"
					},
					{
						"text": NLS.revision,
						"dataIndex": "revision"
					},
					{
						"text": NLS.part_details_is_last_revision,
						"dataIndex": "isLastRevision"
					},
					{
						"text": NLS.content_report_maturity,
						"dataIndex": "maturity"
					},
					{
						"text": NLS.part_details_owner,
						"dataIndex": "owner"
					},
					{
						"text": NLS.part_details_instance_title,
						"dataIndex": "instanceTitle"
					},
					{
						"text": NLS.file_mod_time_column,
						"dataIndex": "modifiedTime"
					}
				];
				let processNodeData = (node) => {
					let rowData = {
						label: node.Ti,
						grid: {
							tree: node.Ti,
							autoName: node.Na,
							eiNumber: node.In,
							classes: node.Ipc,
							type: options.translatedValues["ds6w:type"][node.Ty],
							revision: node.Rev,
							isLastRevision: node.Lr,
							maturity: options.translatedValues["ds6w:status"][node.St],
							owner: node.Ow,
							instanceTitle: node.It,
							modifiedTime: CommonUtils.getDateStringForDisplay(node.mT)
						}
					};
					if(node.parts) {
						rowData = {...rowData, children: node.parts.map((childNode) => processNodeData(childNode))};
					}
					return rowData;
				};
				//Publication Content Report
				if(options.contentReportData){
					assemblyDetailsOptions.data = options.contentReportData.assemblyDetails.map(processNodeData);
		
				}else{
					//Package Generate Publication form
					assemblyDetailsOptions.data = assemblyDetails.map(processNodeData);
				}
				that.assemblyDetailsCollectionView.init(assemblyDetailsOptions);
				that.assemblyDetailsCollectionView._gridModel.expandAll();
			}
			else {
				UWA.createElement('h3', {
						"id": "partDetailsHiddenMessage",
						text: assemblyDetails
				}).inject(assemblyDetailsContainer);
			}
			UIMask.unmask(assemblyDetailsContainer);
			
			return assemblyDetailsContainer;
			
		};
		
		
        return TDPCommonHelper;
    });
