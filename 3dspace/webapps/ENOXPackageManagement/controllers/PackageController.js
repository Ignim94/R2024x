//XSS_CHECKED
/* global widget */
/*eslint no-shadow: "off"*/
/*eslint guard-for-in: "off"*/
define('DS/ENOXPackageManagement/controllers/PackageController',
    [
    	'DS/UIKIT/Mask',
    	'DS/ENOXPackageManagement/models/Package',
		'DS/ENOXPackageManagement/models/Configuration',
		'DS/ENOXPackageManagement/helpers/ConfigurationHelper',
    	'DS/ENOXPackageManagement/views/Package/openPackage',
    	'DS/ENOXPackageManagement/helpers/PackageHelper',
    	'DS/ENOXPackageManagement/views/Package/ListPackage',
    	'DS/ENOXPackageManagement/views/Package/CreatePackage',
    	'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
		'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
    	'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
		'DS/ENOXPackageManagement/views/SlidingPanel/ContentFiles',
		'DS/UIKIT/SuperModal',
		'DS/ENOXPackageCommonUXInfra/InfiniteScrolling/InfiniteScrollingImpl'
    ],
    function(UIMask, PackageModel,Configuration,ConfigurationHelper,OpenPackage,PackageHelper, ListPackages,
 CreatePackage,ENOXTDPConstants,TDPCommonHelper,NLS,ContentFiles,SuperModal,InfiniteScrollingImpl) {
        'use strict';

        var packageController = function packageController() {
            this.model = new PackageModel(this);
            this.helper = new PackageHelper();
			this.commonhelper= new TDPCommonHelper();
			this.view = new ListPackages(this);
        };

		packageController.prototype.list = function(options) {
        	var that = this;
			let pData;
			let isFirstLoad = false;
			that.options=options;

			if((!that.allPkgData || that.allPkgData.length === 0 || !options.isLazyLoading) && (options.packageContentFilter !== true)){	//checks if its loading for first time
        		UIMask.mask(widget.body,NLS.loading_packages);
				isFirstLoad = true;
        		if(that.allPkgData){
					 that.allPkgData.length = 0; 
				}

                options.data=[]; 
    			that.view.render(options);
    			let optionsToPass={};
    			optionsToPass.controller=that;
    			optionsToPass.view=that.view;
    			that.infiniteScrollingImpl = new InfiniteScrollingImpl(optionsToPass);
    		}
			if (options.packageContentFilter) {
				options.skip = 0;
			}
            that.model.ListPackages(options).then(function(respData){
				pData = that.helper.processForList(respData);
    			options.data = pData;
				that.allPkgData = that.allPkgData?[...that.allPkgData, ...options.data]:options.data;
				that.view.collectionView._xsourcingCollectionViewUI._allData = that.allPkgData;
				that.infiniteScrollingImpl.processReloadData(options.data);
				if(isFirstLoad && that.allPkgData.length===0) {
					that.view.setEmptyView(options);
				}
			}).catch(function(error){
				widget.notificationUtil.showError(error.message?error.message:NLS.error_while_listing_packages);
			}).finally(function(){
				UIMask.unmask(widget.body);
			});
        };

        packageController.prototype.createView = function(options) {
            var that = this;
            var view = new CreatePackage(that);
			let configuration=new Configuration();
			let configurationHelper=new ConfigurationHelper();
			 configuration.getElementsRequired(options).then(function(respData){
				configurationHelper.processForRanges(respData.data).then(function(data){
				options.elementsRequiredRange=data;
                view.render(options);
				});

			});
        };

        packageController.prototype.create = function(options) {
        	var that = this;
    		UIMask.mask(widget.body,NLS.creating_package);
				options.addData = that.helper.processCreateValues(options.formValues);
				that.model.createPackage(options).then(function(respData){
					var item = respData.data[0];
					if(respData.success===true){
						var rtcreatedData =that.helper.processData(item);
						options.router.navigate("home.PackageDetails",{id:item.id,title:rtcreatedData.grid.title});
						options.applicationChannel.publish({ event: 'add-model', data: rtcreatedData });	
						widget.notificationUtil.showSuccess("\"" + item.Title + "\" "+NLS.package_created_successfully);
					}
				}, function(respData){
					
					widget.notificationUtil.showError(respData.internalError?respData.internalError:NLS.error_while_creating_package);
				}).catch(function(){//error - need logger integration to show error in logs
				    widget.notificationUtil.showError(NLS.error_while_creating_package);
			    }).finally(function(){
				    UIMask.unmask(widget.body);
			    });
        };

        packageController.prototype.open = function(options) {
    		var that = this;
			if(options.forInfo)
					UIMask.mask(options.detailsContainer, NLS.opening_package);
			else
    		        UIMask.mask(widget.body, NLS.opening_package);
    		options.id = options.data.params.id;
    		that.model.getPackage(options).then((respData) => {
    				var rtcreatedData = that.helper.processData(respData.data[0]);
    				options.data.respParams = rtcreatedData.grid;
    				options.getLifecyclePayload=that.helper.buildGetLifecyclePayload(options);
    				options.openPackageEvent = options._mediator.createNewChannel();
					that.model.getSharedReport(options).then((shareData) => {
						options.publicationShareContentData = shareData;
    					var view = new OpenPackage(that);
    					view.render(options);
					});
    		}, function(){//respData - need logger integration to show error in logs
    			widget.notificationUtil.showError(NLS.error_getting_package_details);
    		}).catch(function(){//error - need logger integration to show error in logs
    			widget.notificationUtil.showError(NLS.error_getting_package_details);
    		}).finally(function(){
    			if(options.forInfo)
					UIMask.unmask(options.detailsContainer, NLS.opening_package);
    			else
					 UIMask.unmask(widget.body);
    		});
    	};

        packageController.prototype.update = function(options){
    		var that = this;
    		UIMask.mask(widget.body,NLS.updating_package);
    		options.addData = that.helper.processUpdateValues(options.formValues);
    		//var obj = options.addData.data[0].dataelements;
    		that.model.updatePackage(options).then(function(respData){
    			let packageCreatedData = that.helper.processData(respData.data[0]);
				packageCreatedData.options=options;
				options.openPackageEvent.publish({
					event : "update-id-card-package",
					data  : packageCreatedData
				});
				widget.notificationUtil.showSuccess(NLS.datapackage + " \"" + packageCreatedData.grid.title + "\" " + NLS.updated_successfully);
    		}, function(respData){
    			widget.notificationUtil.showError(respData.internalError?respData.internalError:(respData.error?respData.error:respData.message));
    		}).finally(() => {
				UIMask.unmask(widget.body);
			});
    	};

        
        packageController.prototype.delete = function(options) {
        	var that=this;
        	var deleteObjIDsArray=[];

			return new Promise(function(resolve){
	        	options.selectedNodes.forEach(node=>{deleteObjIDsArray.push({"id": node.getAttributeValue("id"),"state":node._options.grid.state});});
				options.deleteData={data:deleteObjIDsArray};
	            	
	            	UIMask.mask(widget.body,NLS.deleting_package);
	            	that.model.deletePackage(options).then(function(respData){
	            		options.selectedNodes.forEach(node => node.getTreeDocument().removeRoot(node)); //SI-969
	    				options.thatObj.xsourcingCollectionView._xsourcingCollectionViewUI._updateCount();
						resolve(respData);	
	    				widget.notificationUtil.showSuccess(NLS.package_deleted_successfully,"success");
	            	}, function(respData){
	                        widget.notificationUtil.showError(respData.internalError?respData.internalError:(respData.error?respData.error:NLS.error_while_deleting_package));
	                }).catch(function(error){
	    				widget.notificationUtil.showError(error.error?error.error:NLS.error_while_deleting_package);
	    			}).finally(function(){
	    				options.applicationChannel.publish({event:'information-panel-close',data:{'selectedObject':null}});
	    				UIMask.unmask(widget.body);
	    			});
			});

        };
		packageController.prototype.updateContentFiles = function(data, container) {
        	let that=this;
			let fileOptions = {
                packageId: data.packageOptions.id,
                contentId: data.selectedNode.getAttributeValue("id"),
				resourceId: data.selectedNode.getAttributeValue("actualId")
            };
			let rightPanelContainer = container.getParent();
			UIMask.mask(rightPanelContainer,NLS.loading_files);
        	that.model.updateContentFiles(fileOptions).then((response) => {
            	let contentFilesOptions = data;
				container.empty();
                contentFilesOptions.container = container;
               	contentFilesOptions.contentData = response.data[0];
                var contentFiles = new ContentFiles();
                contentFiles.render(contentFilesOptions);
            }).finally(() => {
				UIMask.unmask(rightPanelContainer);
			});

        };
		
		packageController.prototype.revisePackageItem = function(that, options){
    		var controller=this;
    		options.selectedNodes = that.xsourcingCollectionView?that.xsourcingCollectionView._gridModel.getSelectedNodes():that.tableView._gridModel.getSelectedNodes();
    		if(options.contextualNode){
    			options.selectedNodes=options.contextualNode.slice();
    		}
    		options.contextualNode=undefined;
    		if(options.selectedNodes.length > 0){
    			let maturityState = options.selectedNodes[0].options.grid.state;
    			if(!(maturityState === ENOXTDPConstants.state_released || maturityState === ENOXTDPConstants.state_obsolete)){
                    widget.notificationUtil.showError(NLS.package_released_obsolete_msg);
    			}
    			else{
    				let reviseObjID = options.selectedNodes[0].getAttributeValue("id");
    				let label =  options.selectedNodes[0].options.label;
    				controller.confirmRevisionAction(options, reviseObjID, label);
    			}		
    		}		
    	};

		packageController.prototype.confirmRevisionAction = function(options, id, label) {
    		var that = this;
    		options.addData = that.helper.getRevisePayload(id);
			var superModal = new SuperModal({
				renderTo : widget.body,
				className : 'revise-dialog'
			});
			superModal.dialog({
				body: NLS.package_revise_confirmation,
				title: NLS.revise+" - "+label,
				buttons: [
					{
						className: 'primary',
						value: NLS.yes,
						action: function (supermodal) {
							supermodal.hide();
							that.revisePackage(options);
						}
					},
					{
						className: 'default',
						value: NLS.no,
						action: function (supermodal) {
							supermodal.hide();
						}
					}
				]
			});
    	};

    	packageController.prototype.revisePackage = function(options) {
        	var that = this;
        	UIMask.mask(widget.body, NLS.creating_package_revision);
        	this.model.revisePackage(options).then(function(respData){
        		if(respData.success){
					var packageCreatedData = that.helper.processData(respData.data[0]);
	                widget.notificationUtil.showSuccess(NLS.datapackage + " \"" + packageCreatedData.grid.title + "\" " + NLS.revised_successfully);
	                options.applicationChannel.publish({event: 'add-model',data: packageCreatedData});
                    options.router.navigate("home.PackageDetails", {id:packageCreatedData.grid.id,name:packageCreatedData.grid.name}, {reload: true});	
				}
        	},function(respData){
				widget.notificationUtil.showError((respData.internalError)?respData.internalError:(respData.error?respData.error:NLS.error_while_revising_package));
    		}).catch(function(error){
    			widget.notificationUtil.showError(error.message?error.message:error.toString());
			}).finally(function(){
				UIMask.unmask(widget.body);
			});
        };
        return packageController;
    });
