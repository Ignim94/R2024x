/* global UWA */
/* global widget */
/*eslint no-loop-func: "off"*/ 
define('DS/ENOXPackageManagement/views/Package/AttachmentsTabView',
		[
			'DS/UIKIT/Mask',
			'DS/ENOXPackageManagement/models/Package',
			"DS/Controls/Expander",
			'DS/ENOXPackageCommonUXInfra/Mediator',
			'DS/ENOXPackageManagement/views/Package/AttachmentsTabToolbar',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
			'DS/ENOXPackageCommonUXInfra/ErrorMessageHandlerUtil/ErrorMessageHandlerUtil',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageManagement/views/Package/ListAttachments',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageCommonUXInfra/Search/ENOXPackageSearch',
			'DS/DocumentManagement/DocumentManagement',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants'
			],
			function (UIMask,PackageModel,WUXExpander,Mediator,AttachmentsTabToolbar,ENOXSourcingPlatformServices,CommonUtils,ErrorHandlerUtil,
			NLS,ListAttachments,ENOXSourcingConstants,ENOXSourcingSearch,DocumentManagement,ENOXSourcingService,TDPCommonHelper,ENOXTDPConstants) {
	'use strict';

	let AttachmentsTabView = function AttachmentsTabView() {
		this.model = new PackageModel();
		this.view = undefined;
		this.commonhelper= new TDPCommonHelper();
	};
	AttachmentsTabView.prototype.list = function(options) {
		let that = this;
		this.options = options;
		let view = that.attachmentsView = new ListAttachments(that);
		let packageOptions = {...options};
		that.packageId=options.id;
		packageOptions.columnsConfigurations =	that.getColumnConfiguration();
		that.packageOptions = packageOptions;
		
		//Get all worksheets
		UIMask.mask(options.container,NLS.loading_attachments);
		let worksheetsPromise = that.model.getWorksheets(options).then((worksheetData) => {
			that.worksheetData = [];
			worksheetData.data.forEach((worksheet) => {
				that.processDocument(worksheet, true,false);
			});
		})
		.catch(() => {
			widget.notificationUtil.showError(NLS.worksheets_get_error);
		});
		
		//Get all disclaimers
		let disclaimersPromise = that.model.getDisclaimers(options).then((disclaimerData) => {
			that.disclaimerData = [];
			disclaimerData.data.forEach((disclaimer) => {
				that.processDocument(disclaimer, false,false);
			});
		})
		.catch(() => {
			widget.notificationUtil.showError(NLS.disclaimers_get_error);
		});
		
		Promise.all([worksheetsPromise,disclaimersPromise]).then(() => {
			that.connectedFilesDisplay(options,packageOptions,view);
		})
		.finally(() => {
			UIMask.unmask(options.container);
		});
	};

	AttachmentsTabView.prototype.connectedFilesDisplay = function(options, packageOptions, view) {
		this.getSeparateLayout(options, options.container);
		this.addFilesSection(options, packageOptions, view);
		this.addToolbar(options);
	};
	
	AttachmentsTabView.prototype.addToolbar = function(options) {
		let that = this;
			let toolBarOptions = {
				container:that.toolBarDiv,
				modifyAccess:options.modifyAccess,
				state:options.state,
				showItemCount:false
			};
			toolBarOptions.sort=[{
				id: "tree",
				text: NLS.title,
				type: "string"
			}];
			let attachmentsToolbar = new AttachmentsTabToolbar(that);
			attachmentsToolbar.render(toolBarOptions);
	};
	
	AttachmentsTabView.prototype.addFilesSection = function(options, packageOptions, view) {
		this.addWorksheetFiles(options, packageOptions, view);
		this.addDisclaimerFiles(options,packageOptions,view);
	};

/*	AttachmentsTabView.prototype.updateHeaderCount = function(isWorksheet) {
		let that = this;
		let noFiles = 0;
		// this function is to be used when attachment is to be added without page refresh
		if(isWorksheet) {
			noFiles = that.worksheetTableView._xsourcingCollectionViewUI._tilecollectionView.TreedocModel.getAllDescendants().length;
			that.worksheetsExpander.header = that.options.worksheetHeader+" ("+noFiles+")";
		} else {
			noFiles = that.connectedTableView._xsourcingCollectionViewUI._tilecollectionView.TreedocModel.getAllDescendants().length;
			that.disclaimersExpander.header = that.options.disclaimerHeader+" ("+noFiles+")";
		}	
	};*/
				
	AttachmentsTabView.prototype.addWorksheetFiles = function(options, worksheetOptions, view) {
		let that=this;
		worksheetOptions.showToolbar = false;
		let worksheetExpanderDiv = new UWA.Element('div', {
			'id': 'worksheetSection',
			styles: {'height': '100%'}
		});
		worksheetOptions.container = worksheetExpanderDiv;
		worksheetOptions.data = that.worksheetData;
		worksheetOptions.isConnectedTable = false;
		worksheetOptions.emptyContentOptions = {
			name: 'uploadWorksheet',
			id: 'uploadWorksheet',
			text: NLS.upload_worksheet_files,
			value: NLS.upload_worksheet_files,
			onClickMenuItems: that.getWorksheetMenuItems()
		};
		view.render(worksheetOptions);
		this.worksheetTableView = worksheetOptions.xsourcingCollectionView;
		this.worksheetWrapperContainer=worksheetOptions.container.querySelector('.xsourcingcollectionview-wrapper-container');
		
		let noFiles = this.worksheetData.length;	
		this.worksheetsExpander = new WUXExpander({
			style: 'simple',
			header: options.worksheetHeader+" ("+noFiles+")",
			body: worksheetExpanderDiv,
			allowUnsafeHTMLHeader : false,
			expandedFlag:  true
		}).inject(this.mainContentDiv);
	};
		
	AttachmentsTabView.prototype.addDisclaimerFiles = function(options,disclaimerOptions,view) {
		let that = this;
		//let disclaimerOptions={};
		disclaimerOptions.platformServices=options.platformServices;
		disclaimerOptions.applicationChannel=this.tbl2applicationChannel=new Mediator().createNewChannel();
		disclaimerOptions._triptychWrapper=options._triptychWrapper;
		disclaimerOptions._mediator=options._mediator;
		disclaimerOptions.hasConnectedObjectFiles = true;

		disclaimerOptions.columnsConfigurations =	this.getColumnConfiguration();
		disclaimerOptions.showToolbar = false;
		
		let disclaimerExpanderDiv = new UWA.Element('div', {
			'id': 'disclaimerSection',
			styles: {'height': '100%'}
		});
		disclaimerOptions.container = disclaimerExpanderDiv;
		disclaimerOptions.isConnectedTable = true;
		disclaimerOptions.data = that.disclaimerData;
		
		disclaimerOptions.emptyContentOptions = {
			name: 'uploadDisclaimer',
			id: 'uploadDisclaimer',
			text: NLS.upload_disclaimer_files,
			value: NLS.upload_disclaimer_files,
			onClickMenuItems: that.getDisclaimerMenuItems()
		};
		view.render(disclaimerOptions);
		this.connectedTableView = disclaimerOptions.xsourcingCollectionViewDisclaimer;
		that.disclaimerWrapperContainer=disclaimerOptions.container.querySelector('.xsourcingcollectionview-wrapper-container');
		let noFiles = this.disclaimerData.length;
		this.disclaimersExpander = new WUXExpander({
				style: 'simple',
				header: options.disclaimerHeader+" ("+noFiles+")",
				body: disclaimerExpanderDiv,
				allowUnsafeHTMLHeader : false,
				expandedFlag: true
		}).inject(this.mainContentDiv);
		
		options.applicationChannel.subscribe({ event: 'unselectAllConnectedTableFiles' }, function(){
			that.connectedTableView._gridModel.unselectAll();
        });
		
		options.applicationChannel.subscribe({ event: 'unselectAllContextTableFiles' }, function(){
			that.worksheetTableView._gridModel.unselectAll();
        });
	};
	
	AttachmentsTabView.prototype.getSeparateLayout = function(options, container) {
		container.empty();
		container.style.height = "100%";
//		container.style.border = "1px solid red";
		this.toolBarDiv = UWA.createElement('div', {
			'id':'content_toolbar',
			'class': 'content_toolbar'
		}).inject(container);
		this.mobileSearchDiv = UWA.createElement('div', {
			'id':'mobile_filter_container',
			'class': 'mobile_filter_container'
		}).inject(container);
		this.mainContentDiv = UWA.createElement('div', {
			'id':'mainContentContentTab',
			'styles':{
				"height":"95%"
			}
		}).inject(container);
		
		options.applicationChannel.subscribe({event : 'content_idcard-expand'},()=>{
			this.toolBarDiv.removeClassName('content_toolbar_minify');
			this.toolBarDiv.addClassName('content_toolbar');
		});
		
		options.applicationChannel.subscribe({event : 'content_idcard-minify'},()=>{
			this.toolBarDiv.removeClassName('content_toolbar');
			this.toolBarDiv.addClassName('content_toolbar_minify');
		});
	};

	AttachmentsTabView.prototype.getColumnConfiguration = function() {
		return [{
			"text": NLS.name,
			"dataIndex": "tree",
			"resizableFlag": true,
			"sortableFlag": true,
			"pinned": "left",
			"width" : "130px"
		},
		{
			"text": NLS.owner,
			"dataIndex": "owner",
			"resizableFlag": true,
			"sortableFlag": true
		},		
		{
			"text": NLS.modified,
			"dataIndex": "modified",
			"resizableFlag": true,
			"sortableFlag": true
		}
		];
	};

	AttachmentsTabView.prototype.processDocument = function(item, isWorksheet,isForm) {
		let that = this;
		//var fileExtnlist = ["png","jpg","jpeg"];
		//var fileExtn = this.getFileExtention(item.label_displayValue);
		let preview_url = "";
		if(item.preview_url){
			preview_url = item.preview_url;
		}else {
			preview_url = this.getFileIcon(item.label_displayValue);
		}
		let data = {
				"tree":item.label_displayValue, 
				"objectId":item.id,
				"objectType":item.type_actualValue,
				"orignalId":item.resourceid,
				filesData: item.filesData
		};
		let nodeModel = {
				grid:data,
				label:item.label_displayValue,
			    subLabel: this.getSubLabel(item,isForm),
				thumbnail: preview_url
		};
		let classesInfo = item.classes;
		if(classesInfo && classesInfo.length>0) {
			let ipClasses = [];
			let exportClasses = [];
			let icons = [];
			let iconToolTips = [];
			if (classesInfo === ENOXTDPConstants.Not_Accessible) {
				icons.push({icon: "vault"});
				icons.push({icon: "export-control-library"});
				iconToolTips.push(ENOXTDPConstants.Not_Accessible);
				iconToolTips.push(ENOXTDPConstants.Not_Accessible);
			}
			else {
				classesInfo.forEach((eachItem) => {
					if(eachItem.type === ENOXTDPConstants.IP_CLASS || eachItem.type === ENOXTDPConstants.SECURITY_CLASS) {
						ipClasses.push(eachItem.className);
					}
					else if(eachItem.type === ENOXTDPConstants.EXPORT_CLASS) {
						exportClasses.push(eachItem.className);
					}
				});
				if(ipClasses.length>0) {
					icons.push({icon: "vault"});
					iconToolTips.push(ipClasses);
				}
				if(exportClasses.length>0) {
					icons.push({icon: "export-control-library"});
					iconToolTips.push(exportClasses);
				}
			}

			nodeModel = {
				...nodeModel,
				statusbarIcons: icons,
				statusbarIconsTooltips: iconToolTips
			};
		}
		let returnModel={};
		if(isForm){
			that.worksheetData = that.worksheetData ? that.worksheetData : [];
			that.disclaimerData = that.disclaimerData ? that.disclaimerData : [];
		}
		
		let section = isWorksheet ? that.worksheetData : that.disclaimerData;
		section.push(nodeModel);
		returnModel = nodeModel;
		return returnModel;
	};
	AttachmentsTabView.prototype.getFileExtention = function(filename) {
		return /[^.]+$/.exec(filename)[0];
	};
	AttachmentsTabView.prototype.getFileIcon = function(filename) {
		var fileExtn = this.getFileExtention(filename).toLocaleLowerCase();
		var file = require.toUrl("ENOXPackageManagement/assets/icons/file/txt.png");
		var existingFileList = ["docx.png","jpeg.png","jpg.png","pdf.png","png.png","ppt.png","pptx.png","txt.png","xls.png","xlsx.png","zip.png","doc.png"];
		if(existingFileList.includes(fileExtn+'.png'))
			file = require.toUrl("ENOXPackageManagement/assets/icons/file/"+fileExtn+".png");
		
		return file;
	};
	AttachmentsTabView.prototype.getSubLabel = function(item, isForm) {

			let div_mainSubLabel, div_subLabelLine1, div_subLabelLine2;
			div_mainSubLabel = UWA.createElement('div', {'class': 'attachmentItemLabelContainer'});
			
			
			let profileId = item.ownerIdentifier;
			let swymUrl = ENOXSourcingPlatformServices.getServiceURL("3DSwym")+"/api/user/getpicture/login/"+profileId+"/format/normal";
			
			div_subLabelLine1 = UWA.createElement('div', {'class': 'div_subLabelLine1',
				styles: {
					'padding-top':'7px',
					'padding-left':'25px',
					'font-size': '10px',
					'color':'#368ec4',
					'vertical-align':'middle'
				}
			});

			let ownerContainer = UWA.createElement('span', {});
			
			let userImage;
			if(ENOXSourcingPlatformServices.getServiceURL("3DSwym") !== null){
				userImage = UWA.createElement('img', {
					'class': 'ownerTileViewIcon',
					src: swymUrl,
					events: {
					}
				});
			}
			else {
			    let userDetails = CommonUtils.getAvatarDetails(item.owner);
				userImage = UWA.createElement('span', {
					'class': 'ownerTileViewIcon',
					'styles': { 
						"background": userDetails.avatarColor,
						"color": "lightgrey",
					    "font-size": "9px",
					    "padding": "3px"
					},
					html: userDetails.avatarStr
				});
			}
						
			div_subLabelLine1.innerText = item.owner;

			div_subLabelLine2 = UWA.createElement('div',{
				styles: {
					'padding-top':'10px','font-size': '10px','vertical-align':'middle'
				}
			});

			let modContainer = UWA.createElement('span',{
				styles:{'font-weight':'bold' }
			});
			modContainer.innerHTML= NLS.created+": ";
			modContainer.inject(div_subLabelLine2);
			
			let modContainer1 = UWA.createElement('span');
			modContainer1.innerHTML = CommonUtils.getDateStringForDisplay(item.created);
			modContainer1.inject(div_subLabelLine2);
			userImage.inject(ownerContainer);
			ownerContainer.inject(div_mainSubLabel);
			div_subLabelLine1.inject(div_mainSubLabel);
			div_subLabelLine2.inject(div_mainSubLabel);
			
         	return div_mainSubLabel;
	};			

	
	AttachmentsTabView.prototype.getFileExtension = function(filename) {
		return /[^.]+$/.exec(filename)[0];
	};

	AttachmentsTabView.prototype.removeDocument= function(options,isWorksheet) {
		let that = this;
		
		let removeOptions = {
			...options
		};
		let process = function() {
			that.list(that.options);
			if(!isWorksheet) {
				widget.notificationUtil.showSuccess(NLS.disclaimer_removed_success);
			} else {
				widget.notificationUtil.showSuccess(NLS.worksheet_removed_success);
			}
		};
		let errorRemoveFile = function() {
			if(!isWorksheet) {
				widget.notificationUtil.showError(NLS.disclaimer_removed_failure);
			} else {
				widget.notificationUtil.showError(NLS.worksheet_removed_failure);
			}			
		};	
		removeOptions.onComplete = process.bind(this);
		removeOptions.onFailure = errorRemoveFile.bind(this);
    	let contextObjId = that.packageId;
		if(!isWorksheet) {
			that.model.removeDisclaimer({id:contextObjId,data: removeOptions.data}).then(function(){
				process();
			},function(){
				errorRemoveFile();
			});
		} else {
			that.model.removeWorksheet({id:contextObjId,data: removeOptions.data}).then(function(){
				process();
			},function(){
				errorRemoveFile();
			});	
		}		
	};
	
	AttachmentsTabView.prototype.addOtherServiceDocuments= function(contextObjId,documentInfoObj,isWorksheet) {
		let that=this;
		return new Promise(function(resolve){
			for(let serviceName in documentInfoObj){
				if(documentInfoObj.hasOwnProperty(serviceName)){
					let documentObjArray=documentInfoObj[serviceName];
					documentObjArray.forEach(function(documentObj){
					let connectAttachmentPayload={
						data:[]
				};
				if(!isWorksheet) {
							connectAttachmentPayload.data.push({
								"disclaimerId": documentObj.id
							});
					that.model.addDisclaimer({id:contextObjId,data:connectAttachmentPayload}).then(function(connectResp){
						widget.notificationUtil.showSuccess(NLS.disclaimer_uploaded_successfully);
						resolve(connectResp);
					},function(e){
						widget.notificationUtil.showError(ErrorHandlerUtil.getErrorMessage(e));
					});
				} else {
					connectAttachmentPayload.data.push({
								"worksheetId": documentObj.id
					});
					that.model.addWorksheet({id:contextObjId,data:connectAttachmentPayload}).then(function(connectResp){
						widget.notificationUtil.showSuccess(NLS.worksheet_uploaded_successfully);
						resolve(connectResp);
					},function(e){
						widget.notificationUtil.showError(ErrorHandlerUtil.getErrorMessage(e));
					});					
				}
				});
			  }
			}
		});

	};	
	//Removed for ODT :: Used in handleUploadAttachments:: Commented as part of TDP2142 :: PTE9
	/*AttachmentsTabView.prototype.validateUploadedFile = function(fileName){
		let that = this;
		let message;
		let blackListExtensions=['php5', 'pht', 'phtml', 'shtml', 'asa', 'cer', 'asax', 'swf', 'xap'];
		let fileExtension = that.getFileExtension(fileName);
		if(blackListExtensions.includes(fileExtension.toLowerCase())) {
			message = fileExtension+" "+that.NLS.file_extension_invalid;
		}
		else {
			return true;
		}
		widget.notificationUtil.showError(message);
		UIMask.unmask(widget.body);
		return false;
	};*/
	
	AttachmentsTabView.prototype.createDocumentObject = function(worksheetFileOption){ //parentID
		let tenantUrl = "";
		let securityContext = ENOXSourcingService.getSecurityContext();
		
		return new Promise(function(resolve,reject){
			
			var lOptions = {
					tenant: ENOXSourcingPlatformServices.getPlatformId(),
					securityContext: securityContext,
					additionalHeaders:  {},
					tenantUrl: tenantUrl,
					onFailure: function(response) { //response
						reject(response);
						widget.notificationUtil.showError(response.internalError?response.internalError:(response.error?response.error:response));
					},
					onComplete: function(response) {
						response = response.data;
						resolve(response);
					}
			};
			DocumentManagement.createDocument(worksheetFileOption.documentInfo, lOptions);
		});
	};
	//Removed for ODT :: Used in handleUploadAttachments:: Commented as part of TDP2142 :: PTE9
	/*AttachmentsTabView.prototype.updateAttachmentsView = function(isWorksheet) {
		let that=this;
		let tileView;
		let tileData;
		if (isWorksheet) {
			tileView = that.worksheetTableView;
			tileData = that.worksheetData;
		}
		else {
			tileView = that.connectedTableView;
			tileData = that.disclaimerData;	
		}
		if(tileView) {
			tileView._setData(tileData);
			tileView._data = tileData;
			tileView._xsourcingCollectionViewUI._allData = tileData;
		}
		else {
			that.connectedFilesDisplay(that.options,that.packageOptions,that.attachmentsView);
		}
		that.updateHeaderCount(isWorksheet);
	};*/
	//TDP 2142 Do not remove
	/*AttachmentsTabView.prototype.handleUploadAttachments = function(isWorksheet) {
		let that = this;
		let input = document.createElement('input');
		input.type = 'file';
		input.multiple = 'multiple';
		input.style.display="none";
		document.body.appendChild(input);
		input.onchange = function() {
			let files =   Array.from(input.files);
			let documentPromises = [];
			let attachmentsPayload = {
				data: []
			};
			UIMask.mask(that.options.container,NLS.attachments_uploading_message);
			files.forEach((file)=>{
				if (that.validateUploadedFile()) {
					var documentInfo = {
						title: file.name || 'unNamed',
						fileInfo: {
							comments: '',
							file: file
						}
					};
					let attachmentFileOptions = {
						id: that.options.id, 
						documentInfo: documentInfo,
						invokedFrom: isWorksheet? "Worksheet" :"Disclaimer"
					};
					documentPromises.push(
						that.createDocumentObject(attachmentFileOptions).then(function(docData){
							attachmentsPayload.data.push({
									[isWorksheet? "worksheetId": "disclaimerId"]: docData[0].id
								});
								let data = docData[0].dataelements;
								
								let relatedData = docData[0].relateddata;
								let fileData = relatedData.files[0];
								let ownerData = relatedData.ownerInfo[0].dataelements;
								
								let attachment = {
									label_displayValue: data.title,
									filename: data.filename,
									type_actualValue: docData[0].type,
									id: docData[0].id,
									format: fileData.dataelements.format,
									resourceid: fileData.id,
									preview_url: data.image,
									ownerIdentifier: ownerData.name,
									owner: ownerData.firstname  + " " + ownerData.lastname,
									created: data.originated
								};				
								that.processDocument(attachment, isWorksheet);
					}));
				}
	
			});
			UIMask.mask(that.options.container,NLS.attachments_uploading_message);
			Promise.all(documentPromises).then(() => {
				let attachmentsOptions = {
					id: that.options.id, 
					data: attachmentsPayload
				};
				if (isWorksheet) {
						that.model.addWorksheet(attachmentsOptions).then(function(){
							that.updateAttachmentsView(true);	
							widget.notificationUtil.showSuccess(NLS.worksheet_uploaded_successfully);
						},function(e){
							widget.notificationUtil.showError(ErrorHandlerUtil.getErrorMessage(e));
						});
					}
					else {
						that.model.addDisclaimer(attachmentsOptions).then(function(){
							that.updateAttachmentsView(false);
							widget.notificationUtil.showSuccess(NLS.disclaimer_uploaded_successfully);
						},function(e){
							widget.notificationUtil.showError(ErrorHandlerUtil.getErrorMessage(e));
						});
					}
			});
			Promise.all(documentPromises).then(() => {
			
			}).catch((error) => {
				widget.notificationUtil.showError(error.internalError);
			})
			.finally(() => {
				UIMask.unmask(that.options.container);
			});
		};
		input.click();
	};
	*/
	AttachmentsTabView.prototype.handleExistingAttachments = function(isWorksheet) {
		let that = this;
		let searchOptions = {
			typeSearch: "Document",
			excludeCondition: ENOXSourcingConstants.EXCLUDE_OBSOLETE,
			multiSel:true,
			callbackMethod:function(searchData){
				let extractedData={
					"3dspace":[]
				};
				searchData.forEach(function(obj){
					extractedData["3dspace"].push({
						id:obj["resourceid"],
						title:obj["ds6w:label_value"]+"."+obj["ds6w:docExtension"]
					});
				});
				that.addOtherServiceDocuments(that.packageId,extractedData,isWorksheet).then(function(){
				
					let opts = {
						...that.options,
						id: that.packageId
					};
					that.list(opts);
				});
			}
		};
		let searchUtility = new ENOXSourcingSearch();
		searchUtility.init(searchOptions);
	};
	
	AttachmentsTabView.prototype.getWorksheetMenuItems = function() {
		let that = this;
		let worksheetMenu = [
					{
						type: "TitleItem",
						title: NLS.menu_label_worksheet_title
					},
					{
						 type: "SeparatorItem"
					},
					/*{ TDP2142: Do Not Remove
						type: 'PushItem',
						title: NLS.menu_label_new_worksheet,
						name: "newWorksheet",
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-doc-add'
						},
						action: {
							callback: () => that.handleUploadAttachments(true)
						}
					},*/
					{
						type: 'PushItem',
						title: NLS.menu_label_existing_worksheet,
						name: "existingWorksheet",
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-doc-insert'
						},
						action: {
							callback: () => that.handleExistingAttachments(true)
						}
					}
				];
		return worksheetMenu;
	};
	
	AttachmentsTabView.prototype.getDisclaimerMenuItems = function() {
		let that = this;
		let disclaimerMenu = [
					{
						type: "TitleItem",
						title: NLS.menu_label_disclaimer_title
					},
					{
						 type: "SeparatorItem"
					}
			];
			//TDP2142 Do not remove
			/*disclaimerMenu.push(
				{
					type: 'PushItem',
					title: NLS.menu_label_new_disclaimer,
					name: "newDisclaimer",
					fonticon: {
						content: 'wux-ui-3ds wux-ui-3ds-doc-add'
					},
					action: {
						callback: () => that.handleUploadAttachments(false)
					}
				}
			);*/
			
			disclaimerMenu.push(
					{
						type: 'PushItem',
						title: NLS.menu_label_existing_disclaimer,
						name: "existingDisclaimer",
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-doc-insert'
						},
						action: {
							callback: () => that.handleExistingAttachments(false)
						}
					}
			);
		return disclaimerMenu;
	};

	return AttachmentsTabView;
});
