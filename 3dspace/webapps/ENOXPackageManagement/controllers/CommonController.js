/* global widget */
define('DS/ENOXPackageManagement/controllers/CommonController',
    [
		'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
		'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement'
    ],
    function(Constants,SearchUtility,NLS) {
        'use strict';

        let commonController = function commonController() {
			this.searchUtil =  new SearchUtility();
  		};

		commonController.prototype.getClassificationNames = function(options) {
			let that = this;
			let { items, helper, returnData } = options;
			return new Promise(async resolve=>{
				helper.processClassificationData(items);
                returnData = await helper.processForContentItems(items, options);
				await Promise.all(returnData.map(async data => {
					let node = data.grid;
					let classIds = [
						...node.ipClassesConfirmedDetails.map((detail) => detail.classId), 
						...node.exportClassesConfirmedDetails.map((detail) => detail.classId)
					];
			        let searchPayload = that.searchUtil.getSearchPayload(classIds, 
							["Classification"],
	    					[Constants.SOURCE_3DSPACE]);
	    			let searchResp = await that.searchUtil.callFederatedSearch(searchPayload);
					if(searchResp.results) {
						searchResp.results.map((classDetails) => {
							let processedResult = {};
							classDetails.attributes.forEach((detail) => {
								processedResult[detail.name] = detail.hasOwnProperty("dispValue")? detail.dispValue: detail.value; 
							});
							let dispName = "ds6w:label";
							let id = "resourceid";
							let matchedClass;
							matchedClass = node.ipClassesConfirmedDetails.find((detail) => detail.classId === processedResult[id]);
							if(!matchedClass) {
								matchedClass = node.exportClassesConfirmedDetails.find((detail) => detail.classId === processedResult[id]);
							}
							matchedClass.classDisplayName = processedResult[dispName];
						});
					}
				}));
				resolve(returnData);
			});
		};
		
		commonController.prototype.updateInfoPanelDetails = function(that, objectDetails) {
			let options = that.options;
			let nodeSelected = that.nodeData;
			objectDetails({data:{params:{id:nodeSelected.options.grid.id}}}).then(function(respData){
				respData.data[0].RequestCategory = that.nodeData.options.grid.requestCategory;
				var rtcreatedData = that.controller.helper.processData(respData.data[0]);
				var infoOption = that.commonHelper.getInfoData({options:{grid:rtcreatedData.grid}});
				infoOption.triptychWrapper = options._triptychWrapper;
				infoOption.mediator=options._mediator;
			});		
			let hyperLinkOption = {
				contextObjId:nodeSelected.options.grid.id,
				callControllerMethod: that.controller,
				updateCRList : function(gridRow){
					var allrows = that.collectionView._gridModel.getAllDescendants().filter(row =>{ return row._options.grid.id === gridRow.grid.id;});
					if(allrows && allrows.length === 1){
						allrows[0].updateOptions(gridRow);
					}
				}
			};
			widget.app._applicationChannel.publish({event:'xsourcing-collectionview-selected-object-id',
    			data:{
    				selectedObject: true, //to mimic a selected object to cater to current info panel mechanism
    				openDetails: that.controller.commonhelper.getObjectDetailsInInfoPanel(hyperLinkOption)
    			}
    		});	
		};
		
		commonController.prototype.deleteObject = function(thatRef,opts,obj) {
			if(thatRef.xsourcingCollectionView._xsourcingCollectionViewUI.checkIfExceedsDeleteLimit(thatRef.xsourcingCollectionView._gridModel.getSelectedNodes()))
			    return;
			require(['DS/UIKIT/SuperModal'],function(SuperModal){
				opts.selectedNodes = thatRef.xsourcingCollectionView._gridModel.getSelectedNodes();
				if(opts.contextualNode){
					opts.selectedNodes=opts.contextualNode.slice();
				}
				opts.contextualNode=undefined;
				if(opts.selectedNodes.length > 0){
					var superModal = new SuperModal({ renderTo: widget.body,okButtonText: NLS.delete});
					var titleLabel = (opts.selectedNodes.length === 1)?opts.selectedNodes[0].options.label:opts.selectedNodes.length+" " + obj;
					superModal.confirm(NLS.delete_confirmation,NLS["delete"]+" - "+titleLabel, function (result) {
						if(result)
						{
							opts.thatObj = thatRef;
							thatRef.controller.delete(opts).then(function(resp){
									if(resp.success){
										if(thatRef.xsourcingCollectionView._gridModel.getRoots().length===0){
						                     thatRef.setEmptyView(opts);
						                }
								    }
					    	});
						}

					});
				}
			});	
		};
        return commonController;
    });
