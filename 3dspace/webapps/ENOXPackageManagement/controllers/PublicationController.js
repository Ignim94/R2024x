//XSS_CHECKED
/* global widget */
/*eslint no-shadow: "off"*/
/*eslint guard-for-in: "off"*/
define('DS/ENOXPackageManagement/controllers/PublicationController',
    [
    	'DS/UIKIT/Mask',
    	'DS/ENOXPackageManagement/models/Publication',
		'DS/ENOXPackageCommonUXInfra/InfiniteScrolling/InfiniteScrollingImpl',
		'DS/ENOXPackageManagement/views/Publication/openPublication',
    	'DS/ENOXPackageManagement/helpers/PublicationHelper',
    	'DS/ENOXPackageManagement/views/Publication/ListPublication',
    	'DS/ENOXPackageManagement/views/Publication/CreatePublication',
    	'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
		'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
		'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
		'DS/ENOXPackageUXInfra/models/CommonPublication',
		'DS/ENOXPackageManagement/models/Package',
		'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
		'DS/ENOXPackageManagement/views/Package/AttachmentsTabView'
    ],
    function(UIMask, PublicationModel,InfiniteScrollingImpl,OpenPublication,PublicationHelper,ListPublication,
CreatePublication,NLS,SearchUtility, TDPCommonHelper,CommonPublication,Package,ENOXTDPConstants,AttachmentsTabView) {
        'use strict';

        var PublicationController = function PublicationController() {
            this.model = new PublicationModel(this);
			this.commonModel = new CommonPublication(this);
            this.helper = new PublicationHelper();
            this.searchUtil = new SearchUtility();
			this.commonhelper = new TDPCommonHelper();
			this.view = new ListPublication(this);
			this.packageModel = new Package();
			this.attachmentsTabView = new AttachmentsTabView();
        };


        PublicationController.prototype.list = function(options) {
			
        	var that = this;
        	that.options=options;

			if((!that.allPubData || that.allPubData.length === 0 || !options.isLazyLoading) ){	//checks if its loading for first time
        		UIMask.mask(widget.body,NLS.loading_publications);
        		if(that.allPubData){
					 that.allPubData.length = 0; 
				}

                options.data=[]; 
    			that.view.render(options);
    			var optionsToPass={};
    			optionsToPass.controller=that;
    			optionsToPass.view=that.view;
    			that.infiniteScrollingImpl = new InfiniteScrollingImpl(optionsToPass);
    		}
			
           that.model.ListPublications(options).then(function(respData){
            			that.helper.processForList(respData).then(function(pData){
	            		options.data = pData;	
						that.allPubData = that.allPubData?[...that.allPubData, ...options.data]:options.data;
						that.view.collectionView._xsourcingCollectionViewUI._allData = options.data;      		
						UIMask.unmask(widget.body);
						if(that.allPubData.length===0){
									that.view.setEmptyView(options);
						}
						that.infiniteScrollingImpl.processReloadData(options.data);
					});
            	
	    		}, function(respData){
	                widget.notificationUtil.showError(respData.internalError?respData.internalError:NLS.error_while_listing_packages);
				}).catch(function(error){
					widget.notificationUtil.showError(error.message?error.message:NLS.error_while_listing_packages);
				}).finally(function(){
					UIMask.unmask(widget.body);
				});
        };
        
        PublicationController.prototype.createView = function(options) {
            var that = this;
            var view = new CreatePublication(that);
            view.render(options);
        };

		PublicationController.prototype.create = function(options) {
        	var that = this;
    		UIMask.mask(widget.body, NLS.publication_create_message);
				options.addData = that.helper.processCreateValues(options);
				that.model.createPublication(options).then(function(respData){
				var item = respData.data[0];
				if(respData.success===true){
					if(options.route === 'home.MyPublications')
					{
						options.selectedID=item.id;
						 that.list(options);
					
					}
					else if(options.route ==='packageDetails'&&options.relatedPublicationsView)
					{
						options.relatedPublicationsView.loadData();
					}
					widget.notificationUtil.showSuccess("\"" + item.type + " "+ item.Title + " "+ item.revision + "\" "+NLS.publication_success_message);
				}
			}, function(respData){
				widget.notificationUtil.showError(respData.internalError?respData.internalError:NLS.publication_error_message);
			}).catch(function(){
				widget.notificationUtil.showError(NLS.publication_error_message);
			}).finally(function(){
			   UIMask.unmask(widget.body);
			});
        };

		PublicationController.prototype.delete = function(options) {
        	var that=this;
        	var deleteObjIDsArray=[];
			
				return new Promise(function(resolve){
        	options.selectedNodes.forEach(node=>{deleteObjIDsArray.push({"id": node.getAttributeValue("id"),"state":node._options.grid.state});});
			options.deleteData={data:deleteObjIDsArray};
            	
            	UIMask.mask(widget.body,NLS.deleting_publication);
            	that.model.deletePublication(options).then(function(respData){
					if(respData.data[0])
					{
						widget.notificationUtil.showInfo(NLS.Publication_zip_creation_is_in_progress);
					}else{
            		options.selectedNodes.forEach(node => node.getTreeDocument().removeRoot(node)); //SI-969
    				options.thatObj.xsourcingCollectionView._xsourcingCollectionViewUI._updateCount();
    				widget.notificationUtil.showSuccess(NLS.publication_deleted_successfully,"success");
					}
					resolve(respData);
            	}, function(respData){
                        widget.notificationUtil.showError(respData.internalError?respData.internalError:(respData.error?respData.error:NLS.error_while_deleting_publication));
                }).catch(function(error){
    				widget.notificationUtil.showError(error.error?error.error:NLS.error_while_deleting_publication);
    			}).finally(function(){
    				options.applicationChannel.publish({event:'information-panel-close',data:{'selectedObject':null}});
    				UIMask.unmask(widget.body);
    			});
				});

        };

         PublicationController.prototype.open = function(options) {
    		var that = this;
			if(options.forInfo)
				UIMask.mask(options.detailsContainer, NLS.opening_publication);
    		else 
				UIMask.mask(widget.body, NLS.opening_publication);
    		options.id = options.data.params.id;
    		that.commonModel.getPublication(options).then(function(respData){
    			
    				var pubRespData = that.helper.processData(respData.data[0]);
    				options.data.respParams = pubRespData.grid;
    				
    				options.getLifecyclePayload=that.helper.buildGetLifecyclePayload(options);
    				options.openPublicationEvent = options._mediator.createNewChannel();
					that.commonModel.getContentReport(options).then((data) => {
						var view = new OpenPublication(that);
						options.contentReportData = data.data[0];
						if(data.data[0].contentReport) {
							let mergedObjects = Object.assign({}, ...data.data);
							options.contentReportData = Object.assign({}, ...mergedObjects.contentReport);
						}
						that.handleTranslationsAndOpenPublication(options,view);
					});
					
    				//if(!options.forInfo)
					//	options.applicationChannel.publish({event: 'welcome-panel-hide'});
					
    			}, function(){//respData - need logger integration to show error in logs
    			widget.notificationUtil.showError(NLS.error_getting_publication_details);
    		}).catch(function(){//error - need logger integration to show error in logs
    			widget.notificationUtil.showError(NLS.error_getting_publication_details);
    		}).finally(function(){
				if(options.forInfo)
					UIMask.unmask(options.detailsContainer, NLS.opening_publication);
    			else
					 UIMask.unmask(widget.body);
    		});
    	};
		
		PublicationController.prototype.handleTranslationsAndOpenPublication = function(options,publicationView) {
			let that=this;
			let stateKeys = [];
			let typeKeys = [];
			for(let section in options.contentReportData) {
				if(typeof section === 'string' || section instanceof String) {
					[...options.contentReportData[section]].forEach(function recurse(item) {
					
						let itemState = item.St;
						let itemType = item.Ty;
						if(itemState) {
							if(itemState.includes(ENOXTDPConstants.DOCUMENT_POLICY) 
							||itemState.includes(ENOXTDPConstants.ENGINEERING_ITEM_POLICY) 
							|| itemState.includes(ENOXTDPConstants.DRAWING) 
							|| itemState.includes(ENOXTDPConstants.REQUIREMENT_SPECIFICATION) ){
								stateKeys.push(item.St);
								typeKeys.push(item.Ty);
							}
							else {
								//handle old data
								let itemPolicy = ENOXTDPConstants.DOCUMENT_POLICY;
								if(itemType===ENOXTDPConstants.PHYSICAL_PRODUCT) {
									typeKeys.push(ENOXTDPConstants.VPMREFERENCE);
									item.Ty = ENOXTDPConstants.VPMREFERENCE;
									itemPolicy = ENOXTDPConstants.ENGINEERING_ITEM_POLICY;
									if(itemState===ENOXTDPConstants.ENGINEERING_ITEM_DRAFT) {
										itemState = ENOXTDPConstants.ENGINEERING_ITEM_PRIVATE;
									}
								}
								else {
									typeKeys.push(itemType);
								}
								let updatedItemState = itemPolicy+ENOXTDPConstants.DOT+itemState.toUpperCase().replace(ENOXTDPConstants.SPACE,ENOXTDPConstants.UNDERSCORE);
								stateKeys.push(updatedItemState);
								item.St = updatedItemState;
							}	
						}		
				        if(item.parts) {
				            item.parts.forEach(recurse);
				        }
				    });
				}
			}
			stateKeys = [...new Set(stateKeys)].filter(Boolean);
			typeKeys = [...new Set(typeKeys)].filter(Boolean);
			let toTranslate = {
				"ds6w:status": stateKeys,
				"ds6w:type": typeKeys
			};
			that.searchUtil.getNlsOfPropertiesValues(toTranslate).then(function (translatedValues) {
				options.translatedValues = translatedValues;
	    	}).catch(() => {
				widget.notificationUtil.showInfo(NLS.content_report_translations_failure_message);
				options.translatedValues = toTranslate;
			}).finally(() => {
				publicationView.render(options);
			});
		};

		PublicationController.prototype.update = function(options){
    		var that = this;
    		UIMask.mask(widget.body,NLS.updating_publication);
    		options.addData = that.helper.processUpdateValues(options.formValues);
    		that.model.updatePublication(options).then(function(respData){
    			let publicationCreatedData = that.helper.processData(respData.data[0]);
				publicationCreatedData.options=options;
				options.openPublicationEvent.publish({
					event : "update-id-card-publication",
					data  : publicationCreatedData
				});
				widget.notificationUtil.showSuccess(NLS.datapackage + " \"" + publicationCreatedData.grid.title + "\" " + NLS.updated_successfully);
    		}, function(respData){
    			widget.notificationUtil.showError(respData.internalError?respData.internalError:(respData.error?respData.error:respData.message));
    		}).finally(() => {
				UIMask.unmask(widget.body);
			});
    	};
		PublicationController.prototype.verifyAttachmentsClassification = async function(options) {
			let that = this;
			let classifiedAttachments = [];
			let worksheets = await that.packageModel.getWorksheets(options);
			let disclaimers = await that.packageModel.getDisclaimers(options);
			let worksheetTileData = [];
			let disclaimerTileData = [];
			worksheets.data.forEach((worksheet) => {
				if(worksheet.classes){
					classifiedAttachments.push(worksheet["label_displayValue"]);
				}else if(classifiedAttachments.length === 0){
					worksheetTileData.push(that.attachmentsTabView.processDocument(worksheet, true,true));	
				}
				
			});
			disclaimers.data.forEach((disclaimer) => {
				if(disclaimer.classes){
					classifiedAttachments.push(disclaimer["label_displayValue"]);	
				} else if(classifiedAttachments.length === 0){
					disclaimerTileData.push(that.attachmentsTabView.processDocument(disclaimer, false,true));	
				}
			});
			
			let attachmentOptions ={};
			attachmentOptions.classifiedAttachments = classifiedAttachments;
			attachmentOptions.worksheetTileData = worksheetTileData;
			attachmentOptions.disclaimerTileData = disclaimerTileData;
			return attachmentOptions;
		};
        return PublicationController;
    });
