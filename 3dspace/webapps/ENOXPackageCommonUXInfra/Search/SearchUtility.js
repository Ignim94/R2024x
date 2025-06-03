//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
		[ 
		 	'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/PlatformAPI/PlatformAPI',
			'DS/FedDictionaryAccess/FedDictionaryAccessAPI'
		],function(ENOXSourcingService, ENOXSourcingPlatformServices, ENOXSourcingConstants,PlatformAPI, FedDictionaryAccessAPI){
	'use strict';

	var SearchUtility = function(){};

	SearchUtility.prototype.getSearchPayload = function(objIds, types, sources, additionalOptions){
		var that = this;
		let queryString = "";
		types.map(function(type){
			queryString += " flattenedtaxonomies:\"types/"+type+"\"" + ENOXSourcingConstants.OR;
		});
		queryString = queryString.substring(0, queryString.length - 3);
		if(additionalOptions && additionalOptions.completePreCond){
			queryString = additionalOptions.completePreCond;
		}
		if(additionalOptions && additionalOptions.isPersonOrGroup){
			queryString = (ENOXSourcingConstants.ONPREMISE === ENOXSourcingPlatformServices.getPlatformId())?
			                        ENOXSourcingConstants.QUERY_PERSON_OR_GROUP:ENOXSourcingConstants.QUERY_PERSON_OR_GROUP_CLOUD;
		}
        if(additionalOptions && additionalOptions.excludeCondition){
        	queryString += ENOXSourcingConstants.AND + additionalOptions.excludeCondition;
        }
		sources = sources.map(sc => sc.toLowerCase());
		if(ENOXSourcingConstants.ONPREMISE === ENOXSourcingPlatformServices.getPlatformId())
			sources = [ENOXSourcingConstants.SOURCE_3DSPACE];
		let nresults = additionalOptions?additionalOptions.nresults:(objIds.length > 1000)?999:objIds.length;
		
		
		
		let securityContexts = that.prepareSecurityContexts(sources);
		return {
    				"nresults": nresults,
    				"order_field": "ds6w:label",
					"with_indexing_date": true,
					"with_synthesis": true,
					"order_by": "asc",
    				"start": additionalOptions?additionalOptions.start:0,
    				"label": "test",
    				"login": securityContexts,
    				"locale": widget.lang,
    				"select_predicate": ENOXSourcingConstants.UTILITY_PREDICATE_SELECTORS,
					"select_file": ENOXSourcingConstants.UTILITY_FILE_SELECTORS,
					"query": queryString,
					"source": sources,
					"tenant": ENOXSourcingPlatformServices.getPlatformId(),
					"resourceid_in":objIds,
					"with_nls":additionalOptions?additionalOptions.with_nls:true,
					"specific_source_parameter" : {}
    		};
	};
	
	SearchUtility.prototype.callFederatedSearch = function(payload){		
		return new Promise((resolve)=>{
			if(payload.nresults > 0){
				ENOXSourcingService.getFederatedSearchDataPromise({"searchPayLoad":payload}).then(function(searchData){
					resolve(searchData);
				});
			}else{
				resolve([]);
			}
		});
	};
	
	//commenting as not required for TDP
	/*SearchUtility.prototype.callRecentFederatedSearch = function(payload){		
		return new Promise((resolve)=>{
			if(payload.nresults > 0){
				ENOXSourcingService.getFederatedSearchDataPromise({"searchPayLoad":payload, recent:true}).then(function(searchData){
					resolve(searchData);
				});
			}else{
				resolve([]);
			}
		});
	};*/
	
	SearchUtility.prototype.processResults = function(searchData){
    	var retData = [];
    	if(searchData.results){
        	searchData.results.map(function(item){
         		let objData = {};
            	item.attributes.map(attributeObj=>{
    				if(attributeObj.dispValue){
    					objData[attributeObj.name + "_displayValue"] = attributeObj.dispValue;
    					objData[attributeObj.name] = attributeObj.value;
    				}
    				else
    					objData[attributeObj.name] = attributeObj.value;
    			});
            	retData.push(objData);
        	});
    	}
    	return retData;
    };
    
    SearchUtility.prototype.prepareSecurityContexts = function(sources){
    	var scData = {};
    	
    	sources.map(function(){//Infuture based on source ctx will be there, right now only 3DSpace
    		scData[ENOXSourcingConstants.SOURCE_3DSPACE] = {
				"SecurityContext": ENOXSourcingService.getSecurityContext(ENOXSourcingConstants.SOURCE_3DSPACE)
			};
    	});
    	
    	return scData;
    };
    
    SearchUtility.prototype.getPlatfromAPIObj = function(){
    	return PlatformAPI;
    };
    
    SearchUtility.prototype.getNlsOfPropertiesValues = function(propsValsKeys){		

         return new Promise(function(resolve){

           FedDictionaryAccessAPI.getNlsOfPropertiesValues(JSON.stringify(propsValsKeys),{
            apiVersion: "R2019x",
             tenantId: ENOXSourcingPlatformServices.getPlatformId(),
            lang: widget.lang,
             onComplete: function(result){
            	 resolve(result);
             },
             onFailure:function(){
                resolve();
             }
           });

         });

	};
	

	return SearchUtility;
});

