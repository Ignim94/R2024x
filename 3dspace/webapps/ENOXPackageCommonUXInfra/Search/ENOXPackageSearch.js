//XSS_CHECKED
/* global UWA */
define('DS/ENOXPackageCommonUXInfra/Search/ENOXPackageSearch',
		[ 
			'DS/SNInfraUX/SearchCom',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants'
		],function(SearchCom,ENOXSourcingPlatformServices, ENOXSourcingService, ENOXSourcingConstants){
	'use strict';

	var SearchComponetnSourcing = function(){};

	SearchComponetnSourcing.prototype.init = function(options){
		var that = this;
		this.options = options;
		
		var socket_id = UWA.Utils.getUUID();
		var searchcom_socket = SearchCom.createSocket({
			socket_id: socket_id
		});
        var precond = "";
        if (options.precond) {
            precond = options.precond;
        }
        if (options.typeSearch) {
            precond = "flattenedtaxonomies:\"types/" + options.typeSearch + "\"";
        } else if (options.types) {
        	options.types.map(function(type){
        		precond += " flattenedtaxonomies:\"types/"+type+"\"" + ENOXSourcingConstants.OR;
    		});
        	precond = precond.substring(0, precond.length - 3).trim();
        }
        if (options.typeSearch && options.state) {
            precond = "flattenedtaxonomies:\"types/" + options.typeSearch + "\" AND current:\"" + options.state + "\" AND latestrevision:\"TRUE\"";
        }
		let sources = [ENOXSourcingConstants.SOURCE_3DSPACE];
		let securityContexts = that.prepareSecurityContexts(sources);
		var refinementToSnNJSON = {
				"title": options.title,
				"role": "",
				"mode": "furtive",
				"default_with_precond": true,
				"precond": precond,
				"login": securityContexts,
				"show_precond": false,
				"multiSel": (this.options.multiSel)?this.options.multiSel:false,
				"idcard_activated": false,
				"select_result_max_idcard": false,
				"itemViewClickHandler": "",
				"app_socket_id": socket_id,
				"widget_id": socket_id,
				"search_delegation": "3dsearch",
				"default_search_criteria": "",
				"columns":options.predicates?options.predicates:[],
					"tenant": ENOXSourcingPlatformServices.getPlatformId(),
				"resourceid_not_in":(options.resourceid_not_in)?options.resourceid_not_in:[],
				"resourceid_in":(options.resourceid_in)?options.resourceid_in:[]
		};
/*		if(options.subType)
			refinementToSnNJSON.precond = "([ds6w:kind]:\""+options.subType+"\")";
		if(options.subType && options.state)
			refinementToSnNJSON.precond = "([ds6w:kind]:\""+options.subType+"\") AND current:\""+options.state+"\"";
		if(options.excludeCondition)
			refinementToSnNJSON.precond += " AND "+options.excludeCondition;*/
		
        if (options.objList) {
            refinementToSnNJSON.precond = "(physicalid="+options.objList+")";
        }
        if (options.subType) {
            refinementToSnNJSON.precond = "([ds6w:kind]:\"" + options.subType + "\")"; // it is missing Active/In Active Condition
        }
        if (options.subType && options.state) {
            refinementToSnNJSON.precond = "([ds6w:kind]:\"" + options.subType + "\") AND current:\"" + options.state + "\""; // it is missing Active/In Active Condition
        }
        if(options.excludeCondition)
			refinementToSnNJSON.precond += " AND "+options.excludeCondition;

        if(options.completePreCond)
			refinementToSnNJSON.precond  = options.completePreCond;
        
        if(options.specific_source_parameter)
			refinementToSnNJSON.specific_source_parameter  = options.specific_source_parameter;

		if (UWA.is(searchcom_socket)) {
			searchcom_socket.dispatchEvent('RegisterContext', refinementToSnNJSON);
			searchcom_socket.addListener('Selected_Objects_search', function(data){
				that.options.callbackMethod(data);
			});
			searchcom_socket.addListener('closeTransient',function(event){
				if(event.command_id==='in_app_cancel' && that.options.cancelCallback)
					that.options.cancelCallback();
				if(that.options.cancelCallback)
					that.options.cancelCallback = undefined;
			});
			searchcom_socket.dispatchEvent('InContextSearch', refinementToSnNJSON);
		} else {
			throw new Error('Socket not initialized');
		}
		
	};
	
	SearchComponetnSourcing.prototype.prepareSecurityContexts = function(sources){
    	var scData = {};
    	
    	sources.map(function(src){
    		scData[src] = {
				"SecurityContext": ENOXSourcingService.getSecurityContext(src)
			};
    	});
    	
    	return scData;
    };
    
	return SearchComponetnSourcing;
});

