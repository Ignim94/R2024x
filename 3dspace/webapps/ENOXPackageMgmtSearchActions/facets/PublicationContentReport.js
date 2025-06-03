//XSS_CHECKED
/* global UWA */
/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageMgmtSearchActions/facets/PublicationContentReport',
		['DS/WAFData/WAFData',
		'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
		'DS/UIKIT/Accordion',
		'i18n!DS/ENOXPackageMgmtSearchActions/assets/nls/ENOXPackageMgmtSearchActions',
		'DS/UIKIT/Mask',
		'DS/Controls/Expander',
		'DS/Notifications/NotificationsManagerUXMessages',
		'DS/Notifications/NotificationsManagerViewOnScreen',
		'DS/TreeModel/TreeNodeModel',
		'DS/TreeModel/DataModelSet',
		'DS/TreeModel/TreeDocument',
		'DS/DataGridView/DataGridView',
		'DS/ENOXPackageMgmtSearchActions/constants/SearchActionsConstants',
		'DS/FedDictionaryAccess/FedDictionaryAccessAPI',
		'css!DS/ENOXPackageMgmtSearchActions/ENOXPackageMgmtSearchActions.css' 
		],function(WAFData,i3DXCompassPlatformServices,Accordion,NLS,UIMask,
		Expander,NotificationsManagerUXMessages,NotificationsManagerViewOnScreen,TreeNodeModel,
		 DataModelSet,TreeDocument,DataGridView,SearchActionsConstants,FedDictionaryAccessAPI){

	'use strict';
	 let PublicationContentReport = function(model){
		if(!model.searchmodel.action_id){
			model.onFailure.call();
			return;
		}
		
		delete model.searchmodel.action_id;
		
		let notificationsMgr =NotificationsManagerUXMessages;
		NotificationsManagerViewOnScreen.setNotificationManager(notificationsMgr);
		i3DXCompassPlatformServices.getServiceUrl({
					serviceName: model.searchmodel.getServiceID(),
					platformId: model.searchmodel.getPlatformID(),
					onComplete: function (url) {
							let urlTogetContentReport = url+"/resources/v1/modeler/dstdp/publications/"+model.searchmodel.id+"/contentReport"+"?tenant="+ model.searchmodel.getPlatformID();
							let headers = {
								"Content-Type": 'application/json'
							};
							WAFData.authenticatedRequest(urlTogetContentReport, {
								'method': 'GET',
								'type': 'json',
								 headers: headers,
								'onComplete': function(wsResponse) {
									let options={};
									options.contentReportData = wsResponse.data[0];
									if(wsResponse.data[0].contentReport) {
										let mergedObjects = Object.assign({}, ...wsResponse.data);
										options.contentReportData = Object.assign({}, ...mergedObjects.contentReport);
									}
									options.baseUrl= url;
									getTranslatedContentReport(options,model);
								},
								onFailure: function (error) {
										WAFData.authenticatedRequest(error['message'].split("\"")[1], {
												'method': 'GET',
												'type': 'json',
												 headers: headers,
												'onComplete': function(wsResponse) {
													let options={};
													options.contentReportData = wsResponse.data[0];
													if(wsResponse.data[0].contentReport) {
														let mergedObjects = Object.assign({}, ...wsResponse.data);
														options.contentReportData = Object.assign({}, ...mergedObjects.contentReport);
													}
													options.baseUrl= url;
													getTranslatedContentReport(options,model);
												},
												onFailure: function (error) {
														notificationsMgr.addNotif({
										                    level :"error",
										                    subtitle : error
														});		
												}
											});
								}
							});
					},
					onFailure: function (error) { 
						notificationsMgr.addNotif({
		                    level :"error",
		                    subtitle : error
						});
					}
            });
	};
	
	 function createExpanderUWADiv(id){
		let uwaDiv = UWA.createElement('div', {
			id:id,
			styles:{
				'position': 'relative'
			}
		});
		return uwaDiv;
	}
	
	//required
	function getIPAndEcClassDetails(data,libraryType,baseUrl){
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
					iconName="I_IPControlClass.png";
				else if(ipOrEcclass.cl==="Security Control Class")
					iconName="I_SecurityControlClass.png";
				else if(ipOrEcclass.cl==="Export Control Class")
					iconName="I_ExportControlClass.png";
				
				//refactor css file before promotion
				let iconAndHeadingDiv = new UWA.Element("div", {
						'id':'iconAndHeadingDivId'
					});
				let classIconTag = new UWA.Element("img", {
					'class':'iconAndHeadingDiv',
					'src':baseUrl+"/webapps/ENOXPackageManagement/assets/icons/22/"+iconName,
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
				
	}
	
	//required
	function createIPandECDetailsDiv(data,baseUrl){
			let classDetails = new UWA.Element("div", {
					'id':'classDetails'
				});
				new Expander({
					header: NLS.IPPC_Details,
					body: getIPAndEcClassDetails(data,"IP Protection Library",baseUrl),
					icon: baseUrl+"/webapps/ENOXPackageManagement/assets/icons/22/I_IPProtectionLibrary.png",
					expandedFlag: true
				 }).inject(classDetails);
				 new Expander({
					header: NLS.IPECC_Details,
					body:  getIPAndEcClassDetails(data,"IP Export Control Library",baseUrl),
					icon:baseUrl+"/webapps/ENOXPackageManagement/assets/icons/22/I_ExportControlLibrary.png",
					expandedFlag: true
				 }).inject(classDetails);
			return classDetails;
	}
	
	function getContentReportTab(options) {
		
		let contentReportTabDiv = createExpanderUWADiv('contentReportTabDiv');
		
		let bgStatus=options.contentReportData.BackgroundJob;
		if(bgStatus)
		{
			let message="";
			if(bgStatus==="Started")
				message=NLS.Publication_report_creation_is_in_progress;
			if(bgStatus==="Failed")
				message=NLS.Publication_zip_creation_Failed;
			let headerText = UWA.createElement('h2', {
			'class':"emptyContainerStyle",
			'text':message
        }); 
		if(bgStatus==="Failed")
				headerText.style.color='red';
			
		headerText.inject(contentReportTabDiv);
		}
		else{
					
			new Accordion({
				items: [{
							title:NLS.disclaimer,
							content:getDisclaimerAndDisclaimerFiles(options),
							name: "Disclaimer",
							id:"disclaimerDiv",
							selected:true
						}, 
						{
							title:NLS.IP_IPECDetails,
							//icon: WebappsUtils.getWebappsAssetUrl('ENOXPackageManagement', 'icons/22/I_ExportControlClass.png'),
							icon : {iconName: 'users', fontIconFamily: 1},
							name: "IPDetails",
							content:createIPandECDetailsDiv(options.contentReportData.ip,options.baseUrl),
							selected:true
						},
						{
							title:NLS.FilesFromContent,
							content: getFilesForContent(options),
							name: "contentReport",
							selected:true
						},
						{
							title: NLS.content_report_part_details,
							content: getAssemblyDetails(options),
							name: "assemblyDetails",
							selected:true
						}],
				style: "simple",
				exclusive: false,
				className: 'filled filled-separate'
				}).inject(contentReportTabDiv);
			}
		return contentReportTabDiv;
	}
	
	//required
	function getDisclaimerAndDisclaimerFiles(options) {
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
		let disclaimerFilesDiv = createExpanderUWADiv('getDisclaimerFilesDiv');
		
		disclaimerTextHeaderDiv.inject(disclaimerContainer);
		disclaimerTextDiv.inject(disclaimerContainer);
		disclaimerFilesHeaderDiv.inject(disclaimerContainer);
		disclaimerFilesDiv.inject(disclaimerContainer);
		
		let disclaimerFilesOptions = {
			rowSelection: 'none',
			container: disclaimerFilesDiv,
			views: ["Grid"],
			showToolbar: false,
			showNodeCount: false,
			uniqueIdentifier: "Disclaimer"
		};
		disclaimerFilesOptions.columns = [
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
                            shortHelp: NLS.Disclaimer_file_is_missing
                        };
                    }
                    return disclaimerDGV.getCellDefaultTooltip(cellInfos);
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
		let disclaimerRows = [];
		options.contentReportData.DisclaimerFile.map((node)=>{
			disclaimerRows.push({
					autoName: node.Na,
					revision: node.Rev,
					maturity: options.translatedValues["ds6w:status"][node.St],
					owner: node.Own,
					fileName: node.Fi,
					modified: node.MDt,
					missing: node.missing
			});
		
        });
		disclaimerFilesOptions.data=disclaimerRows;
		
		let data = disclaimerFilesOptions.data;
		//Create the node object used as model
		let dataModelSet = new DataModelSet();
				
		// Create the model for the DataGridView
		let model = new TreeDocument({
				dataModelSet: dataModelSet
		 });
				
		model.prepareUpdate();
				
		//Create the nodes of the model
		    for (let i = 0, len = data.length; i < len; i++) {
		      let nodeData = data[i];
		      let aNode = TreeNodeModel.createTreeNodeDataModel(dataModelSet, {
		        label: nodeData.label,
		        grid: nodeData
		      });
		      model.addChild(aNode);
		    }
		
		    model.expandAll();
		
		    model.pushUpdate();
		
		    // Create the DataGridView
		    let disclaimerDGV = new DataGridView({
		      treeDocument: model,
		      columns: disclaimerFilesOptions.columns,
		      rowSelection: 'none',
		      defaultColumnDef: { //Set default settings for columns
		        "width": "auto",
		        "typeRepresentation": "string"
		      },
		      id: options.uniqueIdentifier
		    }).inject(disclaimerFilesOptions.container);
		
		
		UIMask.unmask(disclaimerContainer);
		return disclaimerContainer;
	}
	
	//required
	function getFilesForContent(options) {
		let TooltipString;
		let contentReportContainer = createExpanderUWADiv('getFilesForContentDiv');
		let contentFilesView = {};

    let createNode = function(eachRow) {
      return new TreeNodeModel({
        label: eachRow.label,
        grid: {
          fileFormat: eachRow.fileFormat,
          modifiedTime: eachRow.fileFormat,
		  autoName : eachRow.autoName,
		  revision : eachRow.revision,
		  type : eachRow.type,
		  maturity : eachRow.maturity,
		  ipProtection : eachRow.ipProtection,
		  exportControl : eachRow.exportControl
        }
      });
    };

    let createTreeDocument = function(options) {
      // Document
      let model = new TreeDocument();

      model.prepareUpdate();

      for (let i = 0; i < options.contentReportData.contentFiles.length; i++) {
        
		let packageContent = options.contentReportData.contentFiles[i];
		let eachRow ={
		  //fileFormat: packageContent.Na,
          //modifiedTime: packageContent.Na,
		  autoName : packageContent.Na,
		  revision : packageContent.Rev,
		  type : options.translatedValues["ds6w:type"][packageContent.Ty],
		  maturity : options.translatedValues["ds6w:status"][packageContent.St],
		  ipProtection : packageContent.ipP,
		  exportControl : packageContent.ipE,
		  label : packageContent.Ti
		};
        let root = createNode(eachRow);
        model.addChild(root);
        for (let j = 0; j < packageContent.Files.length; j++) {
			let packageContentFiles = packageContent.Files[j];
			let eachFile ={
			  fileFormat: packageContentFiles.fF,
			  autoName : packageContentFiles.aN,
			  revision : packageContentFiles.fR,
			  modifiedTime: packageContentFiles.mT,
			  label : packageContentFiles.fN
			};
          let firstDepthNode = createNode(eachFile);
          root.addChild(firstDepthNode);
        }
      }

      model.expandAll();

      model.pushUpdate();

      return model;
    };

    let createDataGridView = function(model) {
      let columns = [
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
                     return contentFilesDGV.getCellDefaultTooltip(cellInfos);
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
				"text": NLS.type,
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
						    "width" :contentFilesDGV.elements.header.getElementsByClassName("IP-Class")[0].clientWidth
						}; 
						
						let responseData=getDisplayDataForIPandECClasses(obj);	
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
					  return contentFilesDGV.getCellDefaultTooltip(cellInfos);
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
						    "width" :contentFilesDGV.elements.header.getElementsByClassName("EC-Class")[0].clientWidth
						};
						let responseData=getDisplayDataForIPandECClasses(obj);	
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
					  return contentFilesDGV.getCellDefaultTooltip(cellInfos);
				}
			}
		];

      let contentFilesDGV = new DataGridView({
        identifier: "DataGridViewTest",
        treeDocument: model,
        columns: columns
      });

      return contentFilesDGV;
    };

    
    contentFilesView.model = createTreeDocument(options);
    contentFilesView.view = createDataGridView(contentFilesView.model);
	contentFilesView.view.inject(contentReportContainer);
	contentFilesView.view.addEventListener('columnWidthChange', function() {
					contentFilesView.view.updateColumnView("ipProtection",{
						 updateCellContent: true
					});
					contentFilesView.view.updateColumnView("exportControl",{
						 updateCellContent: true
					});
		});
		UIMask.unmask(contentReportContainer);
		return contentReportContainer;
	}
	
	function getDisplayDataForIPandECClasses(options){
						let classes = "";
						for(let i=0;i<options.classesArray.length-1;i++){
							classes=classes+options.classesArray[i]+SearchActionsConstants.COMMA+SearchActionsConstants.SPACE;
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
		}
					
		function getAssemblyDetails(options) {
			let assemblyContainer=new UWA.Element("div", {
				id:"assemblyDiv"
			});
			let assemblyDetailsContainer = createExpanderUWADiv('assemblyDetails');
			assemblyDetailsContainer.inject(assemblyContainer);
			
			let assemblyDetails = options.contentReportData.assemblyDetails;
			if(Array.isArray(assemblyDetails)) {
				let partListColumns = [
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
						"text": NLS.type,
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
					        modifiedTime: node.mT
						}
				    };
				    if(node.parts) {
				        rowData = {...rowData, children: node.parts.map((childNode) => processNodeData(childNode))};
				    }
				    return rowData;
				};
				let data = options.contentReportData.assemblyDetails.map(processNodeData);
				//Create the node object used as model
				let dataModelSet = new DataModelSet();
						
				// Create the model for the DataGridView
				let model = new TreeDocument({
						dataModelSet: dataModelSet
				 });
						
				model.prepareUpdate();
						
				//Create the nodes of the model recursively
				(function addNodes(nodeModel,nodes) {
					for (let i = 0, len = nodes.length; i < len; i++) {
				      let nodeData = nodes[i];
				      let root = nodeModel.addChild(nodeData);
					  let rootChildren = nodeData.grid.children;
					  rootChildren && addNodes(root,rootChildren);
				    }
				})(model,data);		
			    model.expandAll();
			    model.pushUpdate();
			    // Create the DataGridView
			    new DataGridView({
			      treeDocument: model,
			      columns: partListColumns,
			      rowSelection: 'none',
			      defaultColumnDef: {
			        "width": "auto",
			        "typeRepresentation": "string"
			      },
			      id: "partDetailsAssembly"
			    }).inject(assemblyDetailsContainer);
			}
			else {
				UWA.createElement('h3', {
		                "id": "partDetailsHiddenMessage",
		                text: assemblyDetails
		        }).inject(assemblyDetailsContainer);
			}
			UIMask.unmask(assemblyContainer);
			return assemblyContainer;
		}

		function getTranslatedContentReport(options,model) {
			let translationOptions = {
				propsValsKeys: getTranslationsPayload(options),
				model: model
			};
			getNlsOfPropertiesValues(translationOptions).then(function (translatedValues) {
				options.translatedValues = translatedValues;
			}).catch(() => {
				options.translatedValues = translationOptions.propsValsKeys;
			}).finally(() => {
				let returnData =getContentReportTab(options);
				model.onComplete(returnData);
			});
		}
			
		function getTranslationsPayload(options) {
			let stateKeys = [];
			let typeKeys = [];
			for(let section in options.contentReportData) {
				if(typeof section === 'string' || section instanceof String) {
					[...options.contentReportData[section]].forEach(function recurse(item) {
					
						let itemState = item.St;
						let itemType = item.Ty;
						if(itemState) {
							if(itemState.includes(SearchActionsConstants.DOCUMENT_POLICY)||itemState.includes(SearchActionsConstants.ENGINEERING_ITEM_POLICY)) {
								stateKeys.push(item.St);
								typeKeys.push(item.Ty);
							}
							else {
								//handle old data
								let itemPolicy = SearchActionsConstants.DOCUMENT_POLICY;
								if(itemType===SearchActionsConstants.PHYSICAL_PRODUCT) {
									typeKeys.push(SearchActionsConstants.VPMREFERENCE);
									item.Ty = SearchActionsConstants.VPMREFERENCE;
									itemPolicy = SearchActionsConstants.ENGINEERING_ITEM_POLICY;
									if(itemState===SearchActionsConstants.ENGINEERING_ITEM_DRAFT) {
										itemState = SearchActionsConstants.ENGINEERING_ITEM_PRIVATE;
									}
								}
								else {
									typeKeys.push(itemType);
								}
								let updatedItemState = itemPolicy+SearchActionsConstants.DOT+itemState.toUpperCase().replace(SearchActionsConstants.SPACE,SearchActionsConstants.UNDERSCORE);
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
			return toTranslate;
		}

		function getNlsOfPropertiesValues(translationOptions){	

			 const {propsValsKeys,model} = translationOptions;
	         return new Promise(function(resolve){
	
	           FedDictionaryAccessAPI.getNlsOfPropertiesValues(JSON.stringify(propsValsKeys),{
	            apiVersion: "R2019x",
	            tenantId: model.searchmodel.getPlatformID(),
	            lang: widget.lang,
	             onComplete: function(result){
	            	 resolve(result);
	             },
	             onFailure:function(){
	                resolve();
	             }
	           });
	
	         });
	
		}
	
	return PublicationContentReport;
});

