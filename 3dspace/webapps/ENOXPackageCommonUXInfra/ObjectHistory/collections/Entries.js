/**
 @extends UWA/Class/Collection

 @requires UWA/Class/Collection

 @requires DS/ENOXPackageCommonUXInfra/ObjectHistory/models/Entry
 @requires DS/ENOXPackageCommonUXInfra/ObjectHistory/services/Services
 @requires DS/ENOXPackageCommonUXInfra/ObjectHistory/utils/Parser
 **/
define('DS/ENOXPackageCommonUXInfra/ObjectHistory/collections/Entries', [
	'UWA/Class/Collection',
	'DS/ENOXPackageCommonUXInfra/ObjectHistory/models/Entry',
	'DS/ENOXPackageCommonUXInfra/ObjectHistory/services/Services',
	'DS/ENOXPackageCommonUXInfra/ObjectHistory/utils/Parser',
	'DS/ENOXPackageCommonUXInfra/Search/SearchUtility',
	'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants'
	], function (Collection, Entry,  Services, Parser,SearchUtility,ENOXSourcingConstants) {

	'use strict';

	var Entries = Collection.extend({
		name: 'DS/ENOXPackageCommonUXInfra/ObjectHistory/collections/Entries',

		model: Entry,

		/**
		 * See UWA documentation.
		 * @inheritDoc
		 */
		setup: function (models, options) {
			var that = this;

			that.physicalId = options.physicalId;
			that.objectTitle=options.objectTitle;

			// If we give existing data as options, we can populate right now
			if (Array.isArray(models) && models.length > 0) {
				that.add(models);
			}

			return that;
		},

		/**
		 * See UWA documentation.
		 * @inheritDoc
		 */
		fetch: function (options) {
			var that = this;

			// Fetch the history
			return Services.getHistory({
				physicalId: that.physicalId
			}).then(function (response) {

				// Extract the body


				// Set the physical id if the parser needs it
				options.physicalId = that.physicalId;
				options.objectTitle = that.objectTitle;
				if(response.contextobjectinfo && response.contextobjectinfo.title){
					options.objectTitle=response.contextobjectinfo.title;
				}
				
            
				// Populates the collection using the default parser
				that.parse(response, options).then(function (data) {
					that.reset(data);
				});

				// Callback
				if (options && typeof options.onComplete === 'function') {
					options.onComplete(history);
				}

			}, function (error) {

				// Set an empty collection
				that.reset([]);

				// Callback
				if (options && typeof options.onFailure === 'function') {
					options.onFailure(error);
				}

			});
		},

		/**
		 * See UWA documentation.
		 * @inheritDoc
		 */
		parse: function (response, options) {
			var that=this;
			var history = response.body;
			var parser=Parser;

			return new Promise(function(resolve){
				var proxyIDsObj=that.getAllProxyIDs(history);
				that.fedSearchCallForProxyObjects(proxyIDsObj).then(function(processedSearchData){
                    processedSearchData.forEach(function(searchitem){
                    	let targetObjectArray=proxyIDsObj.proxyIndexesMapping[searchitem.resourceid];
                    	if(targetObjectArray){
                    	    targetObjectArray.forEach(function(targetObject){
                    	        if(targetObject && targetObject.description && targetObject.additionalParameters && targetObject.additionalParameters["title"]){
                    		        targetObject.description=targetObject.description.replace(targetObject.additionalParameters["title"],searchitem["ds6w:label"]);
                    		        targetObject.additionalParameters["title"]=searchitem["ds6w:label"];
                    	        }	
                    	    });
                    	}
                    });
					let historyParser=response.contextobjectinfo?((response.contextobjectinfo.type===ENOXSourcingConstants.TYPE_TDP_PUBLICATION||response.contextobjectinfo.type===ENOXSourcingConstants.TYPE_TDP_PACKAGE)?"TDPParser":null):null;
					 require([
                    		'DS/ENOXPackageCommonUXInfra/ObjectHistory/utils/'+historyParser
                    		], function(eventParser) {
                    		parser=eventParser;
                    		var data = parser.parse(history, options);
                    		data.then(function(parsedData){
                    			resolve(parsedData);
                    		});
                    	});	
				});
			});
		},

		fedSearchCallForProxyObjects: function (proxyIDsObj) {
			return new Promise(function(resolve){
				var query="";
				var charSeq="\"";
				proxyIDsObj.proxyRDFIDs.forEach(function(uuid){
					query += "[ds6w:resourceUid]:"+charSeq+uuid+charSeq+ " OR ";
				});
				proxyIDsObj.proxyERIDs.forEach(function(id){
					query += "physicalid:"+charSeq+id+charSeq + " OR ";
				});
				if(query==="")resolve([]);
				query = query.substring(0, query.length - 3);
				var nresults=proxyIDsObj.proxyRDFIDs.length+proxyIDsObj.proxyERIDs.length;
				var additionalOpts = {
						completePreCond : query,
						nresults:nresults,
						start:"0",
						with_nls:false
				};
				var searchUtil =  new SearchUtility();
				searchUtil.callFederatedSearch(searchUtil.getSearchPayload([], [], 
						[ENOXSourcingConstants.SOURCE_USERGROUPS,ENOXSourcingConstants.SOURCE_3DSPACE], 
						additionalOpts)).then(function(searchResp){
					let processedData = searchUtil.processResults(searchResp);
					resolve(processedData);
				});
			});
		},

		getAllProxyIDs: function (historyData) {
			var proxyERIDs=[],proxyRDFIDs=[],proxyIndexesMapping={};
			historyData.forEach(function(item){
				if(item.additionalParameters["ProxyItem.Proxy_Id"]){
					proxyERIDs.push(item.additionalParameters["ProxyItem.Proxy_Id"]);

					let tempArr=proxyIndexesMapping[item.additionalParameters["ProxyItem.Proxy_Id"]];
					if(!tempArr)tempArr=[];
					tempArr.push(item);

					proxyIndexesMapping[item.additionalParameters["ProxyItem.Proxy_Id"]]=tempArr;
				}
				if(item.additionalParameters["ProxyItem.Proxy_uri"]){
					proxyRDFIDs.push(item.additionalParameters["ProxyItem.Proxy_uri"]);
                    
                    proxyERIDs.push(item.additionalParameters["ProxyItem.Proxy_uri"]);
					let tempArr=proxyIndexesMapping[item.additionalParameters["ProxyItem.Proxy_uri"]];
					if(!tempArr)tempArr=[];
					tempArr.push(item);

					proxyIndexesMapping[item.additionalParameters["ProxyItem.Proxy_uri"]]=tempArr;
				}
			});
			return {
				proxyERIDs:proxyERIDs,
				proxyRDFIDs:proxyRDFIDs,
				proxyIndexesMapping:proxyIndexesMapping
			};
		}
	});

	return Entries;
});
