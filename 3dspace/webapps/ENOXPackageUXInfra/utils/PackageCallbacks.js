// global widget
define('DS/ENOXPackageUXInfra/utils/PackageCallbacks', 
[/*'DS/ENOXPackageUXInfra/models/CommonPackage',
'DS/ENOXPackageUXInfra/controllers/CommonPublicationController',
'DS/ENOXPackageUXInfra/models/CommonPublication',
'DS/ENOXPackageUXInfra/helpers/CommonPackageHelper',
'DS/ENOXPackageUXInfra/Constants/ENOXPackageConstants'*/
], 
function (/*CommonPackageModel,CommonPublicationController,CommonPublicationModel,CommonPackageHelper,ENOXPackageConstants*/) {

    'use strict';
	/*
	let PackageCallbacks = function PackageCallbacks() {
		this.commonPackageModel = new CommonPackageModel();
		this.commonPackageHelper = new CommonPackageHelper();
	};
	
	PackageCallbacks.prototype.customInfoPanel= function(options) {
		if(options.data.params.actualType===ENOXPackageConstants.TDP_Publication){
				let publicationController = new CommonPublicationController();
				options.navigationFrom=ENOXPackageConstants.Package_Request_Management;
				publicationController.open(options);
			}
			else{
				let controller = options.controller;
				controller.showMEI(options);
			}
	};
	
	PackageCallbacks.prototype.getChildren = function(options) {
		let that = this;
		let packageOptions = {
			data: {
				params: {
					id: options.id
				}
			}
		};
		return that.commonPackageModel.getContents(packageOptions);
	};

	PackageCallbacks.prototype.attachChildren = function(options,childData) {
		let that = this;
		let event = options.event;
		if(event === "attach") {
			let packageOptions = {
				data: {
					params: {
						id: options.id
					}
				}
			};
			let contentData = {
				data: [{
					content_ID: childData.id,
					"status": childData.status,
					content_Title: childData.title
				}]
			};
			return that.commonPackageModel.addContent(packageOptions,contentData);
		}
		else if(event === "handleSuccess") {
			that.commonPackageHelper.handleAttachContentSuccess(childData);
		}
		else if(event === "handleFailure") {
			that.commonPackageHelper.handleUpdateContentFailure(childData);
		}
		else {
			widget.app.logger.error("Incorrect event passed in the options during attachChildren call");
		}
	};

	PackageCallbacks.prototype.detachChildren = function(options,data) {
		let that = this;
		let event =options.event;
		
		if (event === "detach") {
			let packageOptions = {
				data: {
					params: {
						id: options.id
					}
				}
			};
			return that.commonPackageModel.detachContent(packageOptions,data);
		}
		else if(event === "handleSuccess") {
			that.commonPackageHelper.handleDetachContentSuccess(data);
		}
		else if (event === "handleFailure") {
			that.commonPackageHelper.handleUpdateContentFailure(data);
		}
		else {
			widget.app.logger.error("Incorrect event passed in the options during detachChildren call");
		}
	};
	PackageCallbacks.prototype.downloadPublication= function(options) {
		let publicationModel = new CommonPublicationModel();
				var menu = [];
				menu.push(
					{
						id:"Download",
						'type': 'PushItem',
						'title': "Download",
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-download'
						},
						action : {
									callback: function(){	
									publicationModel.downloadZipFile(options);		
								}
							}
					}
				);
				return(menu);
	};

	return PackageCallbacks;*/
	
});
