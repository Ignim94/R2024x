//XSS_CHECKED
/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/helpers/PackageHelper',
    ['i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
		'DS/ENOXPackageUXInfra/Constants/ENOXPackageConstants',
		'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
		'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
		'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
		'DS/ENOXPackageCommonUXInfra/Search/SearchUtility'
	],
    function(NLS,ENOXSourcingPlatformServices,ENOXSourcingService,ENOXPackageConstants,TDPCommonHelper,NLSInfra,ENOXTDPConstants,SearchUtility) {

        'use strict';

        var packageHelper = function packageHelper() {};
		var searchUtil = new SearchUtility();
		
		packageHelper.prototype.processData = function(item){
    		var data = {
    				"type":NLS[item.type],
                    "displayType": NLS[item.type],
                    "actualType": item.type,
    				"title":item.Title,
    				"revision":item.revision,
    				"name":item.name,
    				"description":item.description, 
    				"id":item.id,
    				"image":"ENOXPackageManagement/assets/icons/I_DataPackage_Tile.png",
    				"state":item["state"],
    				"stateDisplay":item["stateDisplay"],	
    				"created":item["originated"],
    				"modified":item["modified"],
    				"owner":item["owner"],
    				"ownerIdentifier":item["ownerIdentifier"],
    				"modifyAccess":item["modifyAccess"],
    				"deleteAccess":item["deleteAccess"],
    				"changeAccess":item["changesov"],
    				"fromdisconnectAccess":(item["fromdisconnectAccess"])?(item["fromdisconnectAccess"]).toLowerCase():"true",
					"Package_Level":TDPCommonHelper.prototype.getDisplayDataForTDPLevel(item),	
    				"ExportFormats":item["Export Formats"],
    				"ElementsRequired":item["Elements Required"],
					"ElementsRequiredRange":item["Elements Required Range"],
    				"IsContentReleased":item["Is Content Released"],
					"MaturedContent":(item["Is Content Released"])==="TRUE"?NLS.yes:NLS.no,
    				"allowToPublish":item["AllowToPublish"],
					"TDP_Disclaimer":item["Disclaimer"],
					"hasIPRole":item["hasIPRole"],
					contextProductId: item.contextProductId,
					contextProductTitle: (item.contextProductTitle === ENOXTDPConstants.EMPTY_STRING)?item.proxyContextProductTitle:item.contextProductTitle
    		};

    	    
    	    var tooltipData = [{
    			label: NLS["title"],
    			data: data.title
    		},{
    			label: NLS["maturity_state"],
    			data: data.stateDisplay
    		},{
    			label: NLS["revision"],
    			data: data.revision
    		},{
    			label: NLS["owner"],
    			data: data.owner
    		},{
    			label: NLS["Package_Level"],
    			data: data.Package_Level
    		}];

    		var dd = {
    				grid:data,
    				label:data.title,
    				subLabel:data.stateDisplay+" | "+data.revision+" | "+data.owner ,
    				thumbnail:require.toUrl(data.image),
    				"description" : NLS.Package_Level+":"+data.Package_Level,
    				tooltip:tooltipData,
    				"id": data.id
    		};
    		return dd;
    	};

    	packageHelper.prototype.processForList = function(respData) {
    		var that=this;
        	if (respData.data)
        		return respData.data.map(item => that.processData(item));
			return [];
    	};
    	packageHelper.prototype.getSearchPayload = function(engDataJsonObj){
    		var searchPayLoad = 	
    		{
    				"nresults": engDataJsonObj.length,
    				"label": "test",
    				"locale": widget.lang,
    				"select_predicate": [
    					"ds6w:label",
    					"physicalid",
    					"name",
    					"ds6w:created",
    					"ds6w:modified",
    					"ds6w:responsible",
    					"ds6wg:revision",
    					"partnumber",
    					"ds6w:type"
    					],
    					"select_file": [
    						"icon",
    						"thumbnail_2d"
    						],
    						"query": "flattenedtaxonomies:\"types/General Class\"",
    						"source": [
    							"3dspace"
    							],
    							"tenant": ENOXSourcingPlatformServices.getPlatformId(),
    							"resourceid_in":engDataJsonObj
    		};

    		return searchPayLoad;
    	};
    	
/*    	packageHelper.prototype.getActualDataFromSearch=function(searchData,objId){
        	if(!searchData.results){
        		return {};
        	}
        	var filteredObj =  searchData.results.filter((obj)=>{
        		var objFound = obj.attributes.filter(attribute =>{
        			return ( attribute.name === "physicalid" && attribute.value === objId);
        		});
        		return objFound.length > 0;
        	});
        	var finalreturnObj = {};
        	if(filteredObj.length > 0 )
        		filteredObj[0].attributes.forEach(attributeObj=>{
        			if(attributeObj.dispValue)
        				finalreturnObj[attributeObj.name] = attributeObj.dispValue;
        			else
        				finalreturnObj[attributeObj.name] = attributeObj.value;
        		});

        	return finalreturnObj;
        };*/
		
		packageHelper.prototype.resizeAutocomplete = function(autocomplete, autocompleteController, toolbarSearchRef){
			autocomplete.style.width = toolbarSearchRef._searchComponent._autocomplteWrapper.style.width;
			let field = autocompleteController.getInputField();
			field.setStyle("min-height", toolbarSearchRef._searchComponent._autocomplteWrapper.clientHeight);
			autocomplete.style.position = toolbarSearchRef._searchComponent._autocomplteWrapper.style.position;
			autocomplete.style.top = toolbarSearchRef._searchComponent._autocomplteWrapper.style.top;
			autocomplete.style.left = toolbarSearchRef._searchComponent._autocomplteWrapper.style.left;
		};
		
		packageHelper.prototype.visibilityToggler = function(toShow, toHide){
			toShow.style.display = 'inline-block';
			toHide.style.display =  'none';
		};
        
        packageHelper.prototype.processCreateValues = function(formValues) {
    		return {
    				"data": [{
    						"type": "type_TDP_CollaborationPackage",
							"description":formValues.description,
							"Title":formValues.title,
							"TDP_PackageLevel":formValues.PackageLevel,
							"TDP_ExportFormats": formValues.formats,
							"TDP_IsContentReleased": formValues.isReleased,
							"TDP_Elements_Required": formValues.TDPElements ? formValues.TDPElements.toString() : '',
							"TDP_Disclaimer": formValues.disclaimer,
							"TDP_ContextProductId": formValues.contextProductId
    					}]
    			};
        };
         
        packageHelper.prototype.buildGetLifecyclePayload=function(options){
    		var currentObjectData ={"data": [{
					"id":options.data.respParams.id,
					"physicalid":options.data.respParams.id, 
					"type":options.data.respParams.type,
					"identifier":options.data.respParams.id,
					"source":"PackageManagement",
					"relativePath":'/resources/v1/modeler/dstdp/packages'
			}]};
    		return currentObjectData;
    	} ;
    	
    	packageHelper.prototype.processUpdateValues = function(formValues) {
     		return {
     				"data": [{
     							"description":formValues.description,
     							"Title":formValues.title,
     							"TDP_PackageLevel":formValues["Package_Level"],
								"TDP_ExportFormats": formValues.formats,
    							"TDP_IsContentReleased": formValues.isReleased ? ENOXTDPConstants.key_yes : ENOXTDPConstants.key_no,
    							"TDP_Elements_Required": formValues.TDPElements ? formValues.TDPElements.toString() : '',
								"TDP_Disclaimer": formValues.disclaimer,
								"TDP_ContextProductId": formValues.contextProductId
     						}]
     			};
         };
               
/*         packageHelper.prototype.createModel=function (templates) {
         	let that=this;
         	var processedData = that.preprocessForModelCreation(templates);
         	
         	// Create model
     		var model = new TreeDocument();
     		// Start transaction
     		model.prepareUpdate();
     		// Adding data in model
     		processedData.map(function(obj){
     			let root = that.createNode(obj);
     			model.addRoot(root);
     		});
     		// Complete transaction
     		model.pushUpdate();
     		return model;
         };*/
         
/*         packageHelper.prototype.preprocessForModelCreation=function (templates) {
         	var items = [];

         	templates.forEach(function(res){
     			let obj = {
     					resourceid : res.id,
     					name : res.name,
     					value :(res.title)?res.title:res.name,
     					label : (res.title)?res.title:res.name +" ("+ res.revision+")"
     			};
     			items.push(obj);
     		});
     		
     		return items;
         };*/
         
        /* packageHelper.prototype.createNode=function (obj) {
         	var node = new TreeNodeModel(obj);
    		  	return node;
         };*/
         
    /*   	packageHelper.prototype.preProcessForSearch =  function(data){
          	var that = this;
          	let returnObj = {};
          	returnObj.sources = [...new Set(data.map(
                      ob => ob.Proxy_Service?ob.Proxy_Service:ENOXSourcingConstants.SOURCE_SOURCING
          		))];
          	if(ENOXSourcingConstants.ONPREMISE === ENOXSourcingPlatformServices.getPlatformId())
          	    returnObj.sources = [ENOXSourcingConstants.SOURCE_3DSPACE];
  			let types = [...new Set(data.map(ob => ob.type))];
  			returnObj.types = [...new Set(types.map(
  					ob => that.contentItemsActualTypes(ob)
  				))];
  			returnObj.objIds = [...new Set(data.map(
  					ob => ob.Proxy_Id?ob.Proxy_Id:ob.id
  				))];
  			
  			returnObj.relIds = [...new Set(data.map(
  					ob => ob.relId?ob.relId:""
  				))];
  			
  			let allowToPublish = data.map(ob => ob.AllowToPublish?ob.AllowToPublish:" ");
  			returnObj.allowToPublish = allowToPublish;

  			let exportClasses = data.map(ob => ob.exportClasses?ob.exportClasses:" ");
  			returnObj.exportClasses = exportClasses;

  			let ipClasses = data.map(ob => ob.ipClasses?ob.ipClasses:" ");
  			returnObj.ipClasses = ipClasses;
  			return returnObj;
          };*/
         
/*         packageHelper.prototype.contentItemsActualTypes = function(item) {
          	var actualType = "";
          	var type= item.type || item;
          	if(type === ENOXSourcingConstants.DOCUMENT_PROXY)
          		actualType =  ENOXSourcingConstants.DOCUMENT;
          	else if(type === ENOXSourcingConstants.MEI_PROXY || type === ENOXSourcingConstants.ENG_ITEM_PROXY)
          		actualType = ENOXSourcingConstants.VPMREFERENCE;
          	else {
          		actualType = type;
          	}
          	return actualType;
          };*/
          
          packageHelper.prototype.processForContentItems =  function(respData, packageOptions){
			return new Promise((resolve) =>{
          	var returnData = [];
  			respData.map(function(item){
  				if(item){
					let confirmedIPDetails = [];
					let confirmedECDetails = [];
					if(item.ConfirmedOnIPClasses !== undefined && item.ConfirmedOnIPClasses !== ENOXTDPConstants.EMPTY_STRING) {
						let confirmedOnIPClasses = JSON.parse(item.ConfirmedOnIPClasses);
						if(confirmedOnIPClasses.IPProtection.length > 0){
							confirmedIPDetails  = confirmedOnIPClasses.IPProtection.split(",")
												.map((id) => {return {classId: id};});
						}
						if(confirmedOnIPClasses.IPExportControl.length > 0){
							confirmedECDetails  = confirmedOnIPClasses.IPExportControl.split(",")
												.map((id) => {return {classId: id};});
						}
					}
					
					let fileDataValue;
					if(item.isContentRowAccessible==="false"){
						fileDataValue = item.fileData;
					} else {
						fileDataValue = (cellInfos) => {
							packageOptions.applicationChannel.publish({ event: 'information-panel-open', data: {
										packageOptions: packageOptions,
										selectedNode: cellInfos.context.nodeModel
									}
								});
							};
					}				
  					var data = {
  							"title":item.label_displayValue,
  							"tree":item.label_displayValue,
  							"id":item.id,
  							"relId":item.relId,
  							"actualId":item.resourceid,
  							"owner":item.owner,
  							"type":item.type_actualValue,
							"typeDisplay":item.type_displayValue,
  							"name":item.identifier_displayValue,
  							"actualType":item.type_actualValue,
  							"modificationDate": item.modified,
  							"creationDate": item.created,
  							"last_revision": item.isLastRevision,
  							//"isIP": item["EXC_PROTECTION_EXISTS_displayValue"],
  							//"IPClassNames": item["ds6w:what/ds6w:ipSecurityClass_displayValue"],
  							"exportClasses": item["exportClasses"],
                            "ipclasses": item["ipclasses"],
							"ipClassesConfirmedDetails": confirmedIPDetails,
							"exportClassesConfirmedDetails": confirmedECDetails,
  							"revision": item["revision"],
  							"image":item["preview_url"],
  							"allowToPublish":item["AllowToPublish"],
  							"maturityState":item["status_actualValue"],
							"maturityStateDisplay":item["status_displayValue"]?item["status_displayValue"]:item["status_actualValue"],
  							"icon":item["type_icon_url"],
  							"docId":item["docId"],
							"fileSource":item["fileSource"],
							"fileData": fileDataValue,
							"actionLabel": "attach",
					        "actionIcon": {iconName: 'attach wux-ui-3ds', fontIconFamily: 1},
							"IPExportControlNameId": item["IPExportControlNameId"],
							"IPProtectionNameId": item["IPProtectionNameId"],
							"classesTooltip": item["classesTooltip"],
							"canEditAllowToPublish":item["canEditAllowToPublish"],
							"isContentRowAccessible":item["isContentRowAccessible"]
					};
  
  					var nodeData = {
  							grid:data,
  							label:data.title,
  							subLabel:data.maturityStateDisplay,
  							thumbnail:data.image && require.toUrl(data.image),
  							"description" : data.description
  					};
  					returnData.push(nodeData);	   
  				}
  			});
			packageHelper.prototype.handleTranslations(returnData, resolve);
			});
          };
          
	    packageHelper.prototype.handleTranslations = function(data, resolve){
	    	let toTranslate = {
				'ds6w:status' : [],
				'ds6w:type'	: []			
			};
	    	data.forEach((ob)=> {
				toTranslate['ds6w:status'].push(ob.grid.maturityState);
				toTranslate['ds6w:type'].push(ob.grid.type);
	    	});
			toTranslate['ds6w:status'] = [...new Set(toTranslate['ds6w:status'])];
			toTranslate['ds6w:type'] = [...new Set(toTranslate['ds6w:type'])];
	    	searchUtil.getNlsOfPropertiesValues(toTranslate).then(function (translatedValues) {
				data.forEach((item)=>{
					item.grid.maturityStateDisplay = translatedValues["ds6w:status"][item.grid.maturityState]?translatedValues["ds6w:status"][item.grid.maturityState]:item.grid.maturityState;
					item.grid.typeDisplay = translatedValues["ds6w:type"][item.grid.type]?translatedValues["ds6w:type"][item.grid.type]:item.grid.type;
		    	});
	    	}).finally(function(){
	    		resolve(data);
	        });
			resolve(data);
	    };
		
/*	      packageHelper.prototype.processResults = function(searchData){
	    	var retData = [];
	    	if(searchData.results){
	        	searchData.results.map(function(item){
	         		let objData = {};
	         		let multiValueData = [];
	         		let multiValue_Disp = [];
	            	item.attributes.map(attributeObj=>{
	    				if(attributeObj.dispValue){
	
	    					if(objData[attributeObj.name]){
	
	    						if(!multiValueData.includes(attributeObj.name)){
	    							if(multiValueData.length===0){
						                multiValueData.push(objData[attributeObj.name]);
	    						        multiValue_Disp.push(objData[attributeObj.name + "_displayValue"]);
	    							}
	    						    multiValueData.push(attributeObj.value);
	    						    multiValue_Disp.push(objData[attributeObj.name + "_displayValue"]);
	    						    multiValue_Disp.push(attributeObj.dispValue);
	    						}
	    						objData[attributeObj.name + "_displayValue"] = multiValue_Disp;
	    					    objData[attributeObj.name] = multiValueData;
	    						
	
	    					}else{
								objData[attributeObj.name + "_displayValue"] = attributeObj.dispValue;
								objData[attributeObj.name] = attributeObj.value;
	    					}
	    				}
	    				else
	    					objData[attributeObj.name] = attributeObj.value;
	    			});
	            	retData.push(objData);
	        	});
	    	}
	    	return retData;
	    };*/

	     packageHelper.prototype.processClassificationData = function(items){
	     		
	     		items.forEach(function(contentItem){
	    			let exportClasses = [];
	                let ipclasses = [];
	                var classificationData = contentItem.classes;
					let IPExportControlNameId = [];
					let IPProtectionNameId = [];
					
					if(Array.isArray(classificationData) && classificationData.length>0){
						classificationData.forEach(function(eachclass){
								if (eachclass.type === ENOXPackageConstants.TYPE_EXPORT_CONTROL_CLASS){
									exportClasses.push(eachclass.className);
									let exportclsnameid = {};
									exportclsnameid[eachclass.id] = eachclass.className;
									IPExportControlNameId.push(exportclsnameid);
								}else{
									ipclasses.push(eachclass.className);
									let ipprotectclsnameid = {};
									ipprotectclsnameid[eachclass.id] = eachclass.className;
									IPProtectionNameId.push(ipprotectclsnameid);
									}
							
							contentItem["exportClasses"]=exportClasses;
						    contentItem["ipclasses"]=ipclasses;
							contentItem["IPExportControlNameId"]=IPExportControlNameId;
							contentItem["IPProtectionNameId"]=IPProtectionNameId;
					    });
	     		    }
					else {
							contentItem["exportClasses"]=classificationData;
						    contentItem["ipclasses"]=classificationData;
					}
	
	        	});
	    	
			
	     };
		
		 packageHelper.prototype.getRevisePayload = function(id) {
    		return {
    			"data": [
    				{
    					"id": id,
    					"dataelements": {
    						"securityContext": ENOXSourcingService.getSecurityContext()
    					}
    				}
    			]
    		};
    	};

		packageHelper.prototype.getProxyPayload = function(selectedObject) {
			let sourceAndTenant = selectedObject.options.sourceid.split(":");
			let proxyRequestData = {
				"data": [{
					"id": selectedObject.options.resourceid,
					"type": selectedObject.options["ds6w:type"],
					"ProxyItem.Proxy_Title": selectedObject.options["ds6w:label"],
					"ProxyItem.Proxy_State": selectedObject.options["ds6w:status_value"],
					"ProxyItem.Proxy_Service": sourceAndTenant[0],
					"ProxyItem.Proxy_Tenant": sourceAndTenant[1]
				}]
			};
			return proxyRequestData;
		};

   	return packageHelper;
    });
