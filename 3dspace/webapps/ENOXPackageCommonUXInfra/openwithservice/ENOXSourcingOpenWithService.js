/* global widget */

define('DS/ENOXPackageCommonUXInfra/openwithservice/ENOXSourcingOpenWithService',
		[
		'UWA/Core',
		'UWA/Class',
		'DS/i3DXCompassPlatformServices/OpenWith',
		'UWA/Class/Promise',
		'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		'DS/ENOXPackageCommonUXInfra/Utilities/Utility'
		], function(UWA, Class, OpenWith, Promise, ENOXPackageCommonConstants, Utility) {
			'use strict';

			var OpenWithService = Class.singleton({

				init: function(option) {
					//var that = this;
					this.option = option;
					this.utility = new Utility();
				},
				initialize: function(app) {
					//var that = this;
					this.app = app;
				},

				getOpenWithMenu: function(model) {
					var that = this;
					return that.utility.gettypeshierarchy(that.getObjectActualType(model)).then(function(typesHierarchyResp){
						var content = that.getContentForCompassInteraction(model, typesHierarchyResp);
						var openWith = new OpenWith();
						openWith.set3DXContent(content); 
						var apps = [];
						if (UWA.is(openWith.retrieveCompatibleApps, 'function')) {
							return new Promise(function(resolve, reject) {
								openWith.retrieveCompatibleApps(function(appsList) {
									appsList.forEach(function(app) {
										apps.push(that.getSubmenuOptions(app, null));
									});
									resolve(apps);
								},function(){
									reject(new Error("Error while getting Open with menus"));
								});
							});
						}
					}).catch(function(error) {
						widget.notificationUtil.showError(error);
		        	});
				},

				getSubmenuOptions: function(app, model) {
					return {
						id: app.text,
						title: app.text,
						icon: app.icon?app.icon:app.fonticon,
						type: 'PushItem',
						multisel: false,
						action: {
							context: model,
							callback: app.handler
						}
					};
				},
				getContentForCompassInteraction:function(model, typesHierarchyResp){

					var that = this;
					let selectedNode = model;

					var itemsData = [];
						var item = {
								'envId': widget.getValue('x3dPlatformId'),
								'serviceId': that.getServiceId(selectedNode),
								'contextId': "",
								'objectId':that.getObjectId(selectedNode),
								'objectType': that.getObjectActualType(selectedNode),
								'displayName': that.getDisplayName(selectedNode),
								'displayType': that.getObjectActualType(selectedNode),
								 'facetName' : 'realized',
										"path": [{
											"resourceid": that.getObjectId(selectedNode),
											"type": that.getObjectActualType(selectedNode)
										}],
										"objectTaxonomies":that.getObjectTaxonomies(selectedNode, typesHierarchyResp)
						};
						itemsData.push(item);
					var compassData = {
							protocol: "3DXContent",
							version: "1.1",
							source: widget.data.appId,
							widgetId: widget.id,
							data: {
								items: itemsData
							}
					};
					return compassData;
				},
				getServiceId:function(){
					return ENOXPackageCommonConstants.SOURCE_3DSPACE;
				},
				getObjectId:function(selectedNode){
					return selectedNode.options.grid.actualId?selectedNode.options.grid.actualId:selectedNode.options.grid.id;
				},
				getObjectActualType:function(selectedNode){
					let objectType = "";

					if(selectedNode && selectedNode.options.grid.id){
						objectType=(selectedNode.options.grid.actualType)?selectedNode.options.grid.actualType:selectedNode.options.grid.type;
					}
					return objectType;
				},
				getDisplayName:function(selectedNode){
					let objectDisplayName = "";

					if(selectedNode && selectedNode.options.grid.id){
						objectDisplayName=selectedNode.options.grid.title;
					}
					return objectDisplayName;
				},
				getObjectTaxonomies:function(selectedNode, typesHierarchyResp){
					var returnObjecttaxonomy = [];
					if(selectedNode.options.grid.actualType === ENOXPackageCommonConstants.VPMREFERENCE){
						if(selectedNode.options.grid.additionalDragData && 
						selectedNode.options.grid.additionalDragData.objectTaxonomies.includes(ENOXPackageCommonConstants.MEI_EXTENSION)){
							returnObjecttaxonomy.push(ENOXPackageCommonConstants.VPMREFERENCE);
							returnObjecttaxonomy.push(ENOXPackageCommonConstants.MEI_EXTENSION);	
						}else
							returnObjecttaxonomy.push(ENOXPackageCommonConstants.VPMREFERENCE);
					}
					else if(selectedNode.options.grid.actualType === ENOXPackageCommonConstants.DOCUMENT){
						returnObjecttaxonomy.push(ENOXPackageCommonConstants.DOCUMENT);
					}
					else if(selectedNode.options.grid.actualType){
						returnObjecttaxonomy.push(selectedNode.options.grid.actualType);
					}
					
					//types hierarchy
					returnObjecttaxonomy = [...returnObjecttaxonomy, ...typesHierarchyResp.types_hierarchies[0].hierarchy];
					//types hierarchy
					return returnObjecttaxonomy;
				}

			});

			return OpenWithService;
});

