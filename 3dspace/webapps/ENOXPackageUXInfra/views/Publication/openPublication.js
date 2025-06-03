//XSS_CHECKED
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageUXInfra/views/Publication/openPublication',
		[ 
			'DS/UIKIT/Mask',
			'DS/UIKIT/Accordion',
			'WebappsUtils/WebappsUtils',
			'DS/ENOXPackageCommonUXInfra/DetailsView/DetailsView',
			'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'DS/Controls/Expander',
			'i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra',
			'DS/ENOXPackageCommonUXInfra/components/IDCardInfo/IDCardInfo',
			'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
			'DS/ENOXPackageUXInfra/Constants/ENOXPackageConstants',
			'css!DS/ENOXPackageUXInfra/ENOXPackageUXInfra.css'
			],function(UIMask,Accordion,WebappsUtils,DetailsView,
			CommonUtils,XsourcingCollectionView,Expander,NLS,IDCardInfo,TDPCommonHelper,ENOXPackageConstants){

	'use strict';
	let openPublication = function(controller){
		this.controller = controller;
		this.commonHelper= new TDPCommonHelper();
	};
	
	openPublication.prototype.render=function(publicationOptions){

		let that = this;
		let options = publicationOptions;
		if(!options.detailsContainer){
			//options.applicationChannel.publish({ event: 'make-information-panel-disappear', data: {forInfo:options.forInfo} });
			options.applicationChannel.publish({ event: 'welcome-panel-hide' });
		}
		
		that.options= options;    	
	   
				//Details view options can be provided as follows
				let detailsViewOptions = {
						
				};
				
				that.getIDCardDetails(options,detailsViewOptions);
		
				// To show the Tab View, this setting has dependency with tabConfiguration
				detailsViewOptions.showTabView = true;
				
				detailsViewOptions.tabConfiguration = [] ;
				
				detailsViewOptions.tabConfiguration.push({ label:NLS.contentReport,
								  content:that.getContentReportTab(options) ,	
								  index: "1" ,
								  value:"ContentReportDiv",
								  isSelected:true,
								  icon : {iconName: 'collection wux-ui-3ds', fontIconFamily: 1},
								  events:{
									  
								  }
								});
					
				options.detailsViewOptions = detailsViewOptions;
				let detailsView =  new DetailsView();
				detailsView.init(options);
				// Add custom events to id card
				
	};
	

	openPublication.prototype.getIDCardDetails=function(options,detailsViewOptions){
		let that = this;
		that.attributeMap = [
					{ name: NLS.name, value: options.data.respParams.name, displayWhenMinified: true },
					{ name: NLS.revision, value: options.data.respParams.revision},				
					//{ name: NLS.maturity_state, value: options.data.respParams.stateDisplay,type:(options.navigationFrom===ENOXPackageConstants.Package_Request_Management)?'type-text':'type-hyperlink',editable:!(options.navigationFrom===ENOXPackageConstants.Package_Request_Management),view: options.lifeCycleView, displayWhenMinified: true},	
					{ name: NLS.maturity_state, value: "",type: 'type-text', id : 'maturityState', editable:true, displayWhenMinified: true},
					{ name: NLS.Publication_IDCard_Package, value: options.data.respParams.TDP_Package+" - "+options.data.respParams.Package_revision,type:(options.navigationFrom===ENOXPackageConstants.Package_Request_Management)?'type-text':'type-hyperlink',editable:!(options.navigationFrom===ENOXPackageConstants.Package_Request_Management),displayWhenMinified: true},	
					{ name: NLS.owner, value:options.data.respParams.owner},
					{ name: NLS.Package_Level, value: options.data.respParams.Package_Level}
				];
				let idCardInfo = new IDCardInfo({
					infoAttributes: [
						{ name: NLS.creation_date, value:CommonUtils.getDateStringForDisplay(options.data.respParams.created),type: 'type-text'}
					]
				});
		
				detailsViewOptions.idCardDetails={
					name:options.data.respParams.title,
					thumbnail: require.toUrl('ENOXPackageManagement/assets/icons/I_DataPublication_Thumbnail.png'),
					attributes:that.attributeMap,
					additionalInfomation: [idCardInfo],
					withActionsButton: !(options.navigationFrom===ENOXPackageConstants.Package_Request_Management),
					withHomeButton: !options.forInfo,
					withExpandCollapseButton: true,
					withInformationButton: !options.forInfo,
					minified: true
				};
	};

	//required
	openPublication.prototype.createExpanderUWADiv = function(id){
		let uwaDiv = UWA.createElement('div', {
			id:id,
			styles:{
				'position': 'relative'
			}
		});
		return uwaDiv;
	};
	
	//required
	openPublication.prototype.getIPAndEcClassDetails = function(data,libraryType){
		let ipProtectionDiv = new UWA.Element("div", {
				});
				
			let ipExportControlDiv = new UWA.Element("div", {
				});
			
			data.forEach((ipOrEcData)=>{
			
			let classesData;
			if(ipOrEcData.ipp)
				classesData=ipOrEcData.ipp;
			else if(ipOrEcData.ipEC)
				classesData=ipOrEcData.ipEC;
			
			classesData.forEach((ipOrEcclass)=>{
				let iconName;
				if(ipOrEcclass.cl==="IP Control Class")
					iconName="icons/22/I_IPControlClass.png";
				else if(ipOrEcclass.cl==="Security Control Class")
					iconName="icons/22/I_SecurityControlClass.png";
				else if(ipOrEcclass.cl==="Export Control Class")
					iconName="icons/22/I_ExportControlClass.png";
				
				//refactor css file before promotion
				let classIcon=WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', iconName);
				let iconAndHeadingDiv = new UWA.Element("div", {
						'id':'iconAndHeadingDivId'
					});
				let classIconTag = new UWA.Element("img", {
					'class':'iconAndHeadingDiv',
					'src':classIcon,
					'id':'classIconTag'
				});
				
				let classHeading = new UWA.Element("div", {
					'text':ipOrEcclass.Ti,
					'class':'iconAndHeadingDiv',
					'id':'classHeading'
					
				});
				let classDesc;
				classIconTag.inject(iconAndHeadingDiv);
				classHeading.inject(iconAndHeadingDiv);
				if(ipOrEcclass.ds!==""){
				   classDesc = new UWA.Element("div", {
						'text':ipOrEcclass.ds,
						'id':'classDesc'
					});
				}
				if(ipOrEcData.ipp){
					iconAndHeadingDiv.inject(ipProtectionDiv);
					if(ipOrEcclass.ds!==""){
					classDesc.inject(ipProtectionDiv);}
					}
				else{
					iconAndHeadingDiv.inject(ipExportControlDiv);
					if(ipOrEcclass.ds!=="")
					classDesc.inject(ipExportControlDiv);
					}
				
				});
			});	
			if(libraryType==="IP Protection Library")
				return ipProtectionDiv;
			return ipExportControlDiv;
				
	};
	
	//required
	openPublication.prototype.createIPandECDetailsDiv = function(data){
			
				let that = this;
				let classDetails = new UWA.Element("div", {
					'id':'classDetails'
				});
				let ipProctIcon=WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/22/I_IPProtectionLibrary.png');
				let ipExpIcon=WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/22/I_ExportControlLibrary.png');
				new Expander({
					header: NLS.IPPC_Details,
					body: that.getIPAndEcClassDetails(data,"IP Protection Library"),
					icon: ipProctIcon,
					expandedFlag: true
				 }).inject(classDetails);
				 new Expander({
					header: NLS.IPECC_Details,
					body:  that.getIPAndEcClassDetails(data,"IP Export Control Library"),
					icon:ipExpIcon,
					expandedFlag: true
				 }).inject(classDetails);
			return classDetails;
	};
	
	openPublication.prototype.getContentReportTab = function(options) {
		
		let that = this;
				
		let contentReportTabDiv = openPublication.prototype.createExpanderUWADiv('contentReportTabDiv');
		
		let bgStatus=options.contentReportData.BackgroundJob;
		if(bgStatus)
		{
			let message="";
			if(bgStatus==="Started")
				message=NLS.Publication_report_creation_is_in_progress;
			if(bgStatus==="Failed")
				message=NLS.Publication_zip_creation_Failed;
			if(bgStatus==="SessionExpired")
				message=NLS.Publication_zip_creation_Failed_Inactive_Session;
			let headerText = UWA.createElement('h2', {
			'class':"emptyContainerStyle",
			'text':message
        }); 
		if(bgStatus==="Failed"||bgStatus==="SessionExpired")
				headerText.style.color='red';
			
		headerText.inject(contentReportTabDiv);
		}
		else{
					
			new Accordion({
				items: [{
							title:NLS.disclaimer,
							content:that.getDisclaimerAndDisclaimerFiles(options),
							name: "Disclaimer",
							id:"disclaimerDiv",
							selected:true
						}, 
						{
							title:NLS.IP_IPECDetails,
							//icon: WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/22/I_ExportControlClass.png'),
							icon : {iconName: 'users', fontIconFamily: 1},
							name: "IPDetails",
							content:that.createIPandECDetailsDiv(options.contentReportData.ip),
							selected:true
						},
						{
							title:NLS.FilesFromContent,
							content: that.getFilesForContent(options),
							name: "contentReport",
							selected:true
						},
						{
							title: NLS.content_report_part_details,
							content: that.commonHelper.getAssemblyDetails(options),
							name: "assemblyDetails",
							selected:true
						}],
				style: "simple",
				exclusive: false,
				className: 'filled filled-separate'
				}).inject(contentReportTabDiv);
			}
		return contentReportTabDiv;
	};
	
	//required
	openPublication.prototype.getDisclaimerAndDisclaimerFiles = function(options) {
		let that = this;

		let disclaimerContainer=new UWA.Element("div", {
			id:"diclamerDiv"
			});

		let disclaimerTextHeaderDiv=new UWA.Element("div", {
			text: NLS.disclaimer_text,
			id:"disclaimerTextHeader"
		});
		let disclaimerTextDiv=new UWA.Element("div", {
			text: options.contentReportData.disclaimer,
			id:"disclaimerText"
		});
		let disclaimerFilesHeaderDiv=new UWA.Element("div", {
			text: NLS.disclaimer_files,
			id:"disclaimerFilesHeader"
		});
		let disclaimerFilesDiv = openPublication.prototype.createExpanderUWADiv('getDisclaimerFilesDiv');
		
		disclaimerTextHeaderDiv.inject(disclaimerContainer);
		disclaimerTextDiv.inject(disclaimerContainer);
		disclaimerFilesHeaderDiv.inject(disclaimerContainer);
		disclaimerFilesDiv.inject(disclaimerContainer);
		that.disclaimerFilesCollectionView = new XsourcingCollectionView();
		let disclaimerFilesOptions = {
			_mediator: options._mediator,
			rowSelection: 'none',
			container: disclaimerFilesDiv,
			views: ["Grid"],
			showToolbar: false,
			showNodeCount: false,
			uniqueIdentifier: "Disclaimer"
		};
		disclaimerFilesOptions.columnsConfigurations = [
			{
				"text": NLS.file_name,
				"dataIndex": "fileName",
				getCellClassName: function(cellInfos) {
                    if (cellInfos.nodeModel) {
                        if (cellInfos.nodeModel.getAttributeValue("missing")) {
                            return cellInfos.cellView.getInitialClassName() + " missing";
                        }
                        return cellInfos.cellView.getInitialClassName();

                    }
                },
                getCellTooltip: function(cellInfos) {
                    if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("missing")) {
                        return {
                            shortHelp: NLS.missing_disclaimer
                        };
                    }
                    return that.disclaimerFilesCollectionView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
                }
			},
			{
				"text": NLS.file_mod_time_column,
				"dataIndex": "modified"
			},			
			{
				"text": NLS.name,
				"dataIndex": "autoName"
			},
      		{
				"text": NLS.revision,
				"dataIndex": "revision"
			},
			{
				"text": NLS.content_report_maturity,
				"dataIndex": "maturity"
			}
		];
		disclaimerFilesOptions.data = options.contentReportData.DisclaimerFile.map((node)=>{
			return {
				grid: {
					autoName: node.Na,
					revision: node.Rev,
					maturity: options.translatedValues["ds6w:status"][node.St],
					owner: node.Own,
					fileName: node.Fi,
					modified: CommonUtils.getDateStringForDisplay(node.MDt),
					missing: node.missing
				}
			};
        });
		that.disclaimerFilesCollectionView.init(disclaimerFilesOptions);
		that.disclaimerFilesCollectionView._gridModel.expandAll();
		that.disclaimerFilesCollectionView._xsourcingCollectionViewUI.viewContainer.parentElement.addClassName("disclaimerDivSize");
		if(options.contentReportData.DisclaimerFile.length> 0){
			that.disclaimerFilesCollectionView._xsourcingCollectionViewUI.viewContainer.parentElement.style.height=25*options.contentReportData.DisclaimerFile.length+50+"px";
		}
		UIMask.unmask(disclaimerContainer);
		return disclaimerContainer;
	};

	//required
	openPublication.prototype.getFilesForContent = function(options) {
		let that = this;
        let TooltipString;
		let contentReportContainer = openPublication.prototype.createExpanderUWADiv('getFilesForContentDiv');
		
		that.contentReportCollectionView = new XsourcingCollectionView();
		let contentReportOptions = {
			_mediator: options._mediator,
			rowSelection: 'none',
			container: contentReportContainer,
			views: ["Grid"],
			showToolbar: false,
			showNodeCount: false,
			uniqueIdentifier: "ContentReport"
		};
		contentReportOptions.columnsConfigurations = [
			{
                "text": `${NLS.content_name_column}/${NLS.exported_files}`,
                "dataIndex": "tree",
                
                getCellValue: (cellInfos) => cellInfos.nodeModel.getAttributeValue("label"),
                
                getCellClassName: function(cellInfos) {
                    if (cellInfos.nodeModel) {
                        if (cellInfos.nodeModel.getAttributeValue("missing")) {
                            return cellInfos.cellView.getInitialClassName() + " missing";
                        }
                        return cellInfos.cellView.getInitialClassName();

                    }
                },
                getCellTooltip: function(cellInfos) {
                    if (cellInfos.nodeModel && cellInfos.nodeModel.getAttributeValue("missing")) {
                        return {
                            shortHelp: NLS.Publication_file_is_missing
                        };
                    }
                    return that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
                }
            },
			{
				"text": NLS.file_format_column,
				"dataIndex": "fileFormat"
			},
			{
				"text": NLS.file_mod_time_column,
				"dataIndex": "modifiedTime"
			},
			{
				"text": NLS.name,
				"dataIndex": "autoName"
			},
      		{
				"text": NLS.revision,
				"dataIndex": "revision"
			},
			{
				"text": NLS.TYPE,
				"dataIndex": "type"
			},
			{
				"text": NLS.content_report_maturity,
				"dataIndex": "maturity"
			},
			{
				"text": NLS.IP_Protection,
				"dataIndex": "ipProtection",
				getCellClassName: function(cellInfos) {
							if (!cellInfos.nodeModel) {
								return "IP-Class";
							}
				},
				getCellValue : function (cellInfos) {
					if(cellInfos.nodeModel.options.grid.ipProtection && cellInfos.nodeModel.options.grid.ipProtection!==undefined && cellInfos.nodeModel.options.grid.ipProtection!==""){
						let obj={
							"classesArray" :cellInfos.nodeModel.options.grid.ipProtection.split(","),
						    "width" :that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.elements.header.getElementsByClassName("IP-Class")[0].clientWidth
						}; 
						
						let responseData=that.commonHelper.getDisplayDataForIPandECClasses(obj);	
						TooltipString=responseData.Classes;
						return responseData.dataToBeDisplayed;
					}
                },
				getCellTooltip: function(cellInfos) {
					  if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.ipProtection) {
						return {
						  shortHelp: TooltipString
						};
					  }	
					  return that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
				}
			},
			{
				"text": NLS.Export_Control,
				"dataIndex": "exportControl",
				getCellClassName: function(cellInfos) {
							if (!cellInfos.nodeModel) {
								return "EC-Class";
							}
				},
				getCellValue : function (cellInfos) {
					if(cellInfos.nodeModel.options.grid.exportControl && cellInfos.nodeModel.options.grid.exportControl!==undefined && cellInfos.nodeModel.options.grid.exportControl!==""){
						let obj={
							"classesArray" :cellInfos.nodeModel.options.grid.exportControl.split(","),
						    "width" :that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.elements.header.getElementsByClassName("EC-Class")[0].clientWidth
						};
						let responseData=that.commonHelper.getDisplayDataForIPandECClasses(obj);	
						TooltipString=responseData.Classes;
						return responseData.dataToBeDisplayed;
	               }
                },
				 getCellTooltip: function(cellInfos) {
					  if (cellInfos.nodeModel && cellInfos.nodeModel.options.grid.exportControl) {
						return {
						  shortHelp: TooltipString
						};
					  }	
					  return that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.getCellDefaultTooltip(cellInfos);
				}
			}
		];
        
		contentReportOptions.data = options.contentReportData.contentFiles.map((node)=>{
                return {
                    label: node.Ti,
                    grid: {
                        tree: node.Ti,
                        autoName: node.Na,
                        type: options.translatedValues["ds6w:type"][node.Ty],
                        revision: node.Rev,
                        maturity: options.translatedValues["ds6w:status"][node.St],
                        ipProtection: node.ipP,
                        exportControl: node.ipE
                    },
                    children: node.Files.map((file)=>{
                        return {
                            label: file.fN,
                            grid: {
                                fileFormat: file.fF,
                                modifiedTime:  CommonUtils.getDateStringForDisplay(file.mT),
								autoName: file.aN,
                				revision: file.fR,
                                missing: file.missing
                            }
                        };
                    }
                    )
                };
        });
		
		that.contentReportCollectionView.init(contentReportOptions);
		that.contentReportCollectionView._gridModel.expandAll();
		that.contentReportCollectionView._xsourcingCollectionViewUI.viewContainer.parentElement.addClassName("contentDivSize");
		that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.addEventListener('columnWidthChange', function() {
					that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.updateColumnView("ipProtection",{
						 updateCellContent: true
					});
					that.contentReportCollectionView._xsourcingCollectionViewUI._dataGridView.updateColumnView("exportControl",{
						 updateCellContent: true
					});
		});
		UIMask.unmask(contentReportContainer);
		return contentReportContainer;
	};
	
		
	return openPublication;
});
