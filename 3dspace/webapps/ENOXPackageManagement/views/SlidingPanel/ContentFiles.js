//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/views/SlidingPanel/ContentFiles',
		[ 
			'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageManagement/models/Package',
			'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/ENOXPackageManagement/Constants/ENOXTDPConstants'
			],function(XsourcingCollectionView, NLS, Package, CommonUtils, ENOXSourcingConstants, ENOXTDPConstants){

	'use strict';

	var ContentFiles = function(){
		/*this.controller = controller;
		this.helper = new PackageHelper();*/
		this.model = new Package();
	};
	
	/*ContentFiles.prototype.uploadExportedOutput = function(fileOptions) {
		let options = this.options.packageOptions;
		var uploadOptions = {
			data:{file:fileOptions.data.file},
			id: options.data.params.id,
			contentId:fileOptions.id,
			contentRelId:fileOptions.relId,
			applicationChannel: options.applicationChannel,
			platformServices: options.platformServices,
			_container:options._container,
			_mediator:options._mediator,
			_triptychWrapper:options._triptychWrapper,
			xsourcingCollectionView:options.contextTableView?options.contextTableView:options.xsourcingCollectionView
		};
		this.model.uploadExportedOutput(uploadOptions).then(function(respData){
			let that = this;
			let fileName = respData.info.replace('[','').replace(']','');
			let fileFormat = fileName.substr(fileName.lastIndexOf('.')+1);
			let node = {
				grid: {
					fileName: fileName,
					fileFormat: fileFormat.toUpperCase(),
					modificationDate: CommonUtils.getDateStringForDisplay(new Date()),
					download: (cellInfos) => {
							let contentData = that.collectionView.options.contentData;
							let fileName = cellInfos.context.nodeModel.getAttributeValue("fileName");
							let source = cellInfos.context.nodeModel.getAttributeValue("fileSource");
							let packageID = that.options.packageOptions.id;
							let relId = contentData.relId;
							let docId = cellInfos.context.nodeModel.getAttributeValue("docId");
							let repId = cellInfos.context.nodeModel.getAttributeValue("repId");
							let fileFormat = cellInfos.context.nodeModel.getAttributeValue("fileFormat");
							var downloadOptions= {
								downloadfileName:fileName,
								fileSource:source,
								id:packageID,
								contentRelId:relId,
								docId:docId,
								repId:repId,
								fileFormat:fileFormat					
							};
							that.downloadFile(downloadOptions);
					},
					downloadIcon: {iconName: 'download wux-ui-3ds', fontIconFamily: 1},
					"delete": (cellInfos) => {
							let fileName = cellInfos.context.nodeModel.getAttributeValue("fileName");
							new SuperModal({ renderTo: widget.body, okButtonText: NLS.remove}).confirm(NLS.remove_confirmation,NLS["remove"]+" - "+fileName , function (result) {
								if(result){
									let packageID = that.options.packageOptions.id;
									let relId = that.collectionView.options.contentData.relId;
									that.deleteFile(fileName,packageID,relId).then(function(){//respData
										that.collectionView._gridModel.removeRoot(cellInfos.context.rowID);
										that.collectionView.collectionViewEvents.publish({event: 'xsourcing-collectionview-update-count'});
										widget.notificationUtil.showSuccess(NLS.delete_file_success_message);
									}).catch((error) => {
										widget.notificationUtil.showError(error.message?error.message:NLS.error_while_deleting_file);
									});	
								}
							});
					},
					deleteIcon: {iconName: 'trash wux-ui-3ds', fontIconFamily: 1},
					fileSource: NLS.TDP_Package,
					owner: that.options.packageOptions.data.respParams.owner
				}
			}; 
			let root = new TreeNodeModel(node);
			let position = this.collectionView._gridModel.getRoots().length;
			this.collectionView._gridModel.addRoot(root, position);
			this.collectionView.collectionViewEvents.publish({event: 'xsourcing-collectionview-update-count'});
			widget.notificationUtil.showSuccess(fileName+NLS.export_output_uploaded);
		}.bind(this)).catch((objectData) => {
			widget.notificationUtil.showError(objectData.internalError?objectData.internalError:(objectData.error?objectData.error:objectData));
			UIMask.unmask(widget.body);
		});
	};*/
			
	ContentFiles.prototype.downloadFile = function(downloadOptions){
		/*var downloadOptions={
			downloadfileName:fileName,
			id:packageID,
			contentRelId:relId,
			docId:docId,
			repId:repId,
			fileFormat:fileFormat
		};*/
		let actualType = this.options.selectedNode.getAttributeValue("actualType");
		if (actualType===ENOXSourcingConstants.DOCUMENT)
			this.downloadDocument(downloadOptions);
		if(actualType===ENOXSourcingConstants.VPMREFERENCE || actualType === ENOXSourcingConstants.DRAWING || actualType===ENOXSourcingConstants.REQUIREMENT_SPECIFICATION){
			if(downloadOptions.fileSource===ENOXTDPConstants.DerivedOutput)
				this.model.downloadDerivedOutput(downloadOptions);
			if(downloadOptions.fileSource===ENOXTDPConstants.Attachment || downloadOptions.fileSource===ENOXTDPConstants.Specification)
				this.downloadDocument(downloadOptions);
				
		} 
	};
	ContentFiles.prototype.downloadDocument = function(downloadOptions) {
		this.model.downloadDocument(downloadOptions).then(function(){
			widget.notificationUtil.showInfo(downloadOptions.downloadfileName+" "+NLS.download_message);
		},function(){
			widget.notificationUtil.showError(NLS.document_download_failed_message);
		});
	};
	
	/*ContentFiles.prototype.deleteFile = function(fileName,packageID,relId) {
		var deleteOptions= {
			removeFileName: fileName,
			id: packageID,
			contentRelId: relId
		};
		return this.model.removeExportedOutput(deleteOptions);
	};*/
	
	ContentFiles.prototype.render=function(options){
		var that = this;
		let rightPanelContainer = options.container;
		let attachIcon = UWA.createElement('div', {
            "class": "wux-ui-3ds-attach wux-ui-3ds"
        });
		let headerText = UWA.createElement('h4', {
            'id': "contentFilesTitle",
			'text': NLS.content_files_container_header+options.selectedNode.getAttributeValue("title")
        });
		UWA.createElement('div', {
            'id': "contentFilesHeader",
			html: [attachIcon, headerText]
        }).inject(rightPanelContainer);
		UWA.createElement('div', {
            'id': "contentFilesSubHeader",
			text: NLS.admin_settings_message
        }).inject(rightPanelContainer);
		let filesContainer = UWA.createElement('div', {
            'id': "filesContainer"
        }).inject(rightPanelContainer);
		that.options = options;
		var xsourcingCollectionView = new XsourcingCollectionView();
		that.collectionView=options.xsourcingCollectionView=xsourcingCollectionView;
		options._mediator = options.packageOptions._mediator;
		options.rowSelection='none';
		options.container = filesContainer;
		options.views = ["Grid"];
		options.showToolbar = true;
		options.showNodeCount=true;
		options.uniqueIdentifier = "FilesToPublishPanel";
		options.columnsConfigurations = [
			{
				"text": NLS.doc_title,
				"dataIndex": "docTitle",
				"visibleFlag": false
			},
			{
				"text": NLS.doc_autoName,
				"dataIndex": "docAutoname",
				"visibleFlag": false
			},
			{
				"text": NLS.file_to_publish_column,
				"dataIndex": "fileName"
			},
			{
				"text": NLS.file_format_column,
				"dataIndex": "fileFormat"
			},
			{
				"text": NLS.file_mod_time_column,
				"dataIndex": "modificationDate"
			},
			{
				"text": NLS.connected_as_column,
				"dataIndex": "fileSourceDisplay"
			},
			{
				"text": NLS.downLoad,
				"dataIndex": "download",
				"typeRepresentation": "functionIcon",
		        "getCellSemantics": (cellInfos) => {
		          return {
			        icon: cellInfos.nodeModel.options.grid.downloadIcon
		          };
		        }
			},
			{
				"text": NLS.owner,
				"dataIndex": "owner"
			},
			{
				"text": NLS.IP_Protection,
				"dataIndex": "ipClasses"
			},
			{
				"text": NLS.Export_Control,
				"dataIndex": "exportClasses"
			}
		];
		
		/*if (this.options.selectedNode.getAttributeValue("actualType") !== ENOXTDPConstants.document) {
			options.columnsConfigurations.push(
				{
					"text": NLS.delete,
					"dataIndex": "delete",
					"alignment": "center",
					"typeRepresentation": "functionIcon",
			        "getCellSemantics": (cellInfos) => {
			          return {
				        icon: cellInfos.nodeModel.options.grid.deleteIcon
			          };
			        }
				});
		}*/
		
		let actualType = this.options.selectedNode.getAttributeValue("actualType");
		options.data = options.contentData.FileToPublish.map((file) => {
			let classesInfo = file.classes;
			let ipClasses = [];
			let exportClasses = [];
			if(classesInfo && classesInfo.length>0) {
				classesInfo.forEach((item) => {
					if(item.type === ENOXTDPConstants.IP_CLASS || item.type === ENOXTDPConstants.SECURITY_CLASS) {
						ipClasses.push(item.className);
					}
					else if(item.type === ENOXTDPConstants.EXPORT_CLASS) {
						exportClasses.push(item.className);
					}
				});
			}
			return {
				grid: {
					docTitle:file.documentTitle,
					docAutoname:file.autoName,
					fileName: file.fileName,
					fileFormat: file.fileFormat,
					modificationDate: CommonUtils.getDateStringForDisplay(file.fileModified),
					download: (cellInfos) => {
						if (file.downloadable.toUpperCase() === ENOXTDPConstants.key_true) {
							let contentData = that.collectionView.options.contentData;
							let fileName = cellInfos.context.nodeModel.getAttributeValue("fileName");
							let source = cellInfos.context.nodeModel.getAttributeValue("fileSource");
							let packageID = that.options.packageOptions.id;
							let relId = contentData.relId;
							let docId = cellInfos.context.nodeModel.getAttributeValue("docId");
							let repId = cellInfos.context.nodeModel.getAttributeValue("repId");
							let fileFormat = cellInfos.context.nodeModel.getAttributeValue("fileFormat");
							var downloadOptions={
								downloadfileName:fileName,
								fileSource:source,
								id:packageID,
								contentRelId:relId,
								docId:docId,
								repId:repId,
								fileFormat:fileFormat					
							};
							that.downloadFile(downloadOptions);
						}
					},
					downloadIcon: file.downloadable.toUpperCase() === ENOXTDPConstants.key_true && {iconName: 'download wux-ui-3ds', fontIconFamily: 1},
					/*"delete": (cellInfos) => {
						if (file.deletable.toUpperCase() === ENOXTDPConstants.key_true) {
							let fileName = cellInfos.context.nodeModel.getAttributeValue("fileName");
							new SuperModal({ renderTo: widget.body, okButtonText: NLS.remove}).confirm(NLS.remove_confirmation,NLS["remove"]+" - "+fileName , function (result) {
								if(result){
									let packageID = that.options.packageOptions.id;
									let relId = that.collectionView.options.contentData.relId;
									that.deleteFile(fileName,packageID,relId).then(function(){//respData
										that.collectionView._gridModel.removeRoot(cellInfos.context.rowID);
										that.collectionView.collectionViewEvents.publish({event: 'xsourcing-collectionview-update-count'});
										widget.notificationUtil.showSuccess(NLS.delete_file_success_message);
									}).catch((error) => {
										widget.notificationUtil.showError(error.message?error.message:NLS.error_while_deleting_file);
									});	
								}
							});
						}
					},
					deleteIcon: file.deletable.toUpperCase() === ENOXTDPConstants.key_true && {iconName: 'trash wux-ui-3ds', fontIconFamily: 1},*/
					fileSourceDisplay: NLS[file.fileSource],
					fileSource:file.fileSource,
					docId: file.id,
					repId: file.repId,
					owner: actualType === ENOXSourcingConstants.DOCUMENT ? 
						this.options.selectedNode.getAttributeValue("owner") : file.owner,
					ipClasses:ipClasses,
					exportClasses:exportClasses
				}
			};
		});
		
		/*if (this.options.selectedNode.getAttributeValue("actualType") !== ENOXTDPConstants.document) {
				options.toolbarActions=[{
				id : "UploadExportOutput",
				text : NLS.UploadExportedOutput,
				fonticon : "upload",
				handler : () => {//e1,e2 params
						let input = document.createElement('input');
						input.type = 'file';
						input.multiple = 'single';
						input.onchange = function() {
							// you can use this method to get file and perform respective operations
							let files =   Array.from(input.files);
							files.forEach((file)=>{
								var uploadOptions = {
									data:{file:file},
									id: options.selectedNode.options.grid.id,
									relId: options.selectedNode.options.grid.relId
								};
								that.uploadExportedOutput(uploadOptions);
							});
						};
						input.click();
				}
			}];
		}*/
		
		xsourcingCollectionView.init(options);
		return xsourcingCollectionView;
	};
	
	return ContentFiles;
});
