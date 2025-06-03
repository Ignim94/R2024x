//XSS_CHECKED
/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/helpers/PublicationHelper',
    ['i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
		'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
		'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
		'DS/ENOXPackageManagement/Constants/ENOXTDPConstants'
	],
    function(NLS,TDPCommonHelper,ENOXSourcingPlatformServices,CommonUtils,ENOXTDPConstants) {
        'use strict';

        var PublicationHelper = function PublicationHelper() {};
	
		PublicationHelper.prototype.processData = function(item){
    		var data = {
    				"type":NLS[item.type],
                    "displayType": NLS[item.type],
                    "actualType": item.type,
    				"title":item.Title,
    				"revision":item.revision,
    				"name":item.name,
    				"description":item.description, 
    				"id":item.id,
    				"image":"ENOXPackageManagement/assets/icons/I_DataPublication_Tile.png",
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
    				"ExportFormats":item[ENOXTDPConstants.ATTRIBUTE_EXPORT_FORMATS],
					"FileRemovalDate":item[ENOXTDPConstants.ATTRIBUTE_FILE_REMOVAL_DATE],
    				"TDP_Package":item[ENOXTDPConstants.ATTRIBUTE_TDP_PACKAGE],
    				"Package_revision":item["Package revision"],
    				"Package_current":item["Package current"],
					"publication_file_name":item["publication_file_name"],
					"packageId": item.packageId,
					"isPasswordProtected":item[ENOXTDPConstants.ATTRIBUTE_IS_PASSWORD_PROTECTED],
					"isPasswordAccessible":item["isPasswordAccessible"],
					"packageOwner": item["owner"]===item["Package owner"]?"":item["Package owner"],
					"hasIPData": item[ENOXTDPConstants.ATTRIBUTE_CONTAINS_IP_DATA] === ENOXTDPConstants.key_true,
					"packageName": item.packageName,
					"hasIPRole":item["hasIPRole"],
					"effectivityEndDate": item["End Effectivity Date"]
    		};

    	    var d = CommonUtils.getDateStringForDisplay(new Date (data.created));
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
				label: NLS["creation_date"],
    			data: d.toLocaleString(widget.lang)
			}];
			let hasIPData = data.hasIPData? " | "+NLS.contains_sensitive_data: ENOXTDPConstants.EMPTY_STRING;
			let pkglevel = data.TDP_Level !==undefined? " | "+data.TDP_Level: ENOXTDPConstants.EMPTY_STRING;
			let statusBarIcon=[];
			let statusbarIconsTooltips=[];
			statusBarIcon.push({ icon: "export-multiple"});
			statusbarIconsTooltips.push(data.ExportFormats);
			if(data.isPasswordProtected==="TRUE"){
				statusBarIcon.push({ icon: "key"});
				statusbarIconsTooltips.push("");
			}
			statusBarIcon.push({icon: "box"});
			statusbarIconsTooltips.push(data.TDP_Package);
			
    	    var dd = {
    				grid:data,
    				label:data.title,
    				subLabel:data.name+pkglevel+hasIPData,
    				thumbnail:require.toUrl(data.image),
    				"description" : data.stateDisplay+" | "+data.owner+" | "+d.toLocaleString(widget.lang),
    				tooltip:tooltipData,
    				"id": data.id,
    				statusbarIcons: statusBarIcon,
          			statusbarIconsTooltips: statusbarIconsTooltips
         
    		};
    		return dd;
    	};

    	PublicationHelper.prototype.processForList = function(respData) {
    		var that=this;
    		return new Promise((resolve)=>{ //reject
        		if (respData.data) {
        				resolve(respData.data.map(item => that.processData(item)));
        		}
        		//resolve([]);
    		});
    	};
    	PublicationHelper.prototype.getSearchPayload = function(engDataJsonObj){
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
    	
/*    	PublicationHelper.prototype.getActualDataFromSearch=function(searchData,objId){
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
        
        PublicationHelper.prototype.processCreateValues = function(options) {
    		return {
    				"data": [{
							"description":options.formValues.description,
							"Title":options.formValues.title,
			                "selectedContent" : options.formValues.selectedContent,
			                "copyFromPackage": options.formValues.copyFromPackage,
							"TDP_ExportFormats":options.grid.ExportFormats,
							"Package_Level":options.grid.Package_Level,
							"isPasswordProtected":options.formValues.isPasswordProtected,
							"requireBOM": options.formValues.requireBOM,
							"reportTitle": options.formValues.reportTitle,
							"reportLanguage": options.formValues.reportLanguage
    					}]
    			};
        };
        PublicationHelper.prototype.buildGetLifecyclePayload=function(options){
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
    	
    	 PublicationHelper.prototype.processUpdateValues = function(formValues) {
     		return {
     				"data": [{
     							"description":formValues.description,
     							"Title":formValues.title,
     							"Package_Level":formValues["Package_Level"],
								"TDP_ExportFormats": formValues.formats,
								"TDP_PackagePublication.FileRemovalDate": formValues["File Removal Date"],
								"Creation_Date" :formValues["creation_date"],
								"End Effectivity Date": formValues["effectivityEndDate"]
     						}]
     			};
         };
               
/*         PublicationHelper.prototype.createModel=function (templates) {
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
/*         PublicationHelper.prototype.preprocessForModelCreation=function (templates) {
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
         
        /* PublicationHelper.prototype.createNode=function (obj) {
         	var node = new TreeNodeModel(obj);
    		  	return node;
         };*/
         

    /* 	PublicationHelper.prototype.preProcessForSearch =  function(data){
          	var that = this;
          	let returnObj = {};
          	returnObj.sources = [...new Set(data.map(
                      ob => ob.dataelements.Proxy_Service?ob.dataelements.Proxy_Service:ENOXSourcingConstants.SOURCE_SOURCING
          		))];
          	if(ENOXSourcingConstants.ONPREMISE === ENOXSourcingPlatformServices.getPlatformId())
          	    returnObj.sources = [ENOXSourcingConstants.SOURCE_3DSPACE];
  			let types = [...new Set(data.map(ob => ob.type))];
  			returnObj.types = [...new Set(types.map(
  					ob => that.contentItemsActualTypes(ob)
  				))];
  			returnObj.objIds = [...new Set(data.map(
  					ob => ob.dataelements.Proxy_Id?ob.dataelements.Proxy_Id:ob.id
  				))];
  			return returnObj;
          };*/


    	return PublicationHelper;
    });
