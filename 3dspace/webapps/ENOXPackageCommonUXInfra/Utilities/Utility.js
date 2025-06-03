//XSS_CHECKED
/*eslint no-shadow: "off"*/
/*eslint complexity: off */
define('DS/ENOXPackageCommonUXInfra/Utilities/Utility',
    [
		'DS/Utilities/Dom',
    	'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
    	'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
    	'DS/ENOXPackageCommonUXInfra/Search/SearchUtility'
	],
	function (DomUtils, ENOXSourcingConstants, ENOXSourcingService, SearchUtility) {
        'use strict';

        var Utility = function Utility() {
        	this.searchUtil =  new SearchUtility();
        };
		
        Utility.prototype.gettypeshierarchy = function(droppedType) {
        	var options={};
        	options.source = ENOXSourcingConstants.SERVICE_3DSPACE;
        	options.endpoint ="/resources/enong/dico/gettypeshierarchy";
        	options.postData = {"types":[droppedType]};
        	return ENOXSourcingService.performPostPromise(options);
        };
        
       	/*Utility.prototype.propertyWidget = function(id){
			var context = {
				model: {
					objectId: id
				}
			};
			var propertiesDialog = new EditPropDialog({
				ID: 'propFor' + id
			});
			propertiesDialog.launchProperties(context);
		};
        
		//commenting as not required by TDP
        Utility.prototype.sortArrayAlphabeticallyBasedOnProperty = function(array = [], property = undefined) {
        	if(array.length === 0 || property === "" || property === undefined)return;
        	array.sort(function(a, b){//to sort objects based on name of attribute
				 var nameA=a[property].toLowerCase(), nameB=b[property].toLowerCase();
				 if (nameA < nameB) //sort string ascending
				  return -1;
				 if (nameA > nameB)
				  return 1;
				 return 0; //default return value (no sorting)
			});
        };
        
		Utility.prototype.getDynamicPropertyField = function(element){
			var field = {
				type: element.type,
				label: 	element.nlsName?element.nlsName:element.name,
				value: element.value,
				name: element.name,
				disable: true,
				'default': element.default
			};
			if(field.type === "boolean" && field.default)field.default = field.default.toUpperCase();
			if(element.hasOwnProperty('range')){
				field.type = 'select';
				var rangeOptions = [];
				var range = element.range;
				range = range.substring(1, range.length-1);
        		range = range.split(',');
        		var displayRange = element.displayRanges;
        		if(displayRange){
        			displayRange = displayRange.substring(1, displayRange.length-1);
        			displayRange = displayRange.split(',');
        			displayRange = displayRange.map(s => s.trim());
        		}
				range.forEach(function(rangeItem, idx){
					rangeItem = rangeItem.trim();
					var rangeAttribute = {
						label: (displayRange && displayRange[idx])?
								displayRange[idx]:rangeItem,
						value: rangeItem
					};
					if(field.value === undefined && element.default === rangeItem)
						rangeAttribute.selected = true;
					rangeOptions.push(rangeAttribute);
				});
				field.options = rangeOptions;
			}
    		return field; 
    	};
		
		//commenting as not required by TDP
		Utility.prototype.getActualDataFromSearch=function(searchData,objId){
			if(!searchData.results){
				return {};
			}
			var filteredObj =  searchData.results.filter((obj)=>{
				var objFound = obj.attributes.filter(attribute =>{
					return ( attribute.name === "resourceid" && attribute.value === objId);
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
		};
		
		Utility.prototype.getDocumentOwnerName = function(documentOriginalObject,item){
			var ownerObject = {};
			if(item.relateddata&&item.relateddata.ownerInfo&&item.relateddata.ownerInfo[0])
			ownerObject=item.relateddata.ownerInfo[0];
			return (documentOriginalObject["ds6w:who/ds6w:responsible"])?documentOriginalObject["ds6w:who/ds6w:responsible"]:(ownerObject?
			ownerObject.firstname+" "+ownerObject.lastname:
			(item.Owner || item.owner));
		};*/
		
		Utility.prototype.setCustomView = function(dgvReference){
			let errArr=[];
			try{
				let dgvCustomViewManager=dgvReference.getCustomViewsManager();
				let currentCustomView=dgvCustomViewManager.getCurrentCustomView();
				if(currentCustomView!==undefined)dgvCustomViewManager.setCurrentCustomView(currentCustomView.identifier);
			}catch(err){
				errArr.push(err);
			}
		};
		
		//commenting as not required by TDP
		/*Utility.prototype.getTypeRepresentationKey = function(params){
			let ret = "";
			switch(params.type.toLowerCase()) {
	      	  case "integer":
	      		ret =  "integer";
	      	    break;
	      	  case "real":
	      		ret = "float";
	      		break;
	      	  case "timestamp":
	      		ret = "date";
	      		break;  
	      	  case "boolean":
	      		ret = "boolean";
	  		  		break;
	  		  /*case "select":
	      		ret = params.id + "_select"; //Use getCellSemantics instead
	  		  		break; */
	      	 /* default:
	      		  ret = "string";
			}
			
			return ret;
		};*/
		
		//commenting as not required by TDP
		/*Utility.prototype.registerCustomTypeRepresentations = function(params){
			let that = this;
			let defaultTypeRepresentations = ["string", "integer", "float", "date", "boolean", "url", "datetime"];
			let collectionView = params.collectionView, columns = params.columns;
			let myCustomRep = {};
			
			//Right now only handles range, in future can be re-factored to support more type representations
			columns.forEach((col)=>{
				if(col.typeRepresentation && !defaultTypeRepresentations.includes(col.typeRepresentation)){
					myCustomRep = {
						[col.typeRepresentation]: {
							stdTemplate: 'enumCombo',
							semantics: {
								valueType: "enumString",
								possibleValues: that.processLabelValue(col.range, col.displayRanges)
							}
						}
					};
				}
			});
			
			collectionView._xsourcingCollectionViewUI._dataGridView
			.getTypeRepresentationFactory().
			registerTypeRepresentations(JSON.stringify(myCustomRep));
		};*/
		
		//commenting as not required by TDP
		/*Utility.prototype.processLabelValue = function(ranges, displayRanges){
			let ret = [];
			ranges.forEach(function(range,idx) {
				ret.push({
					label: ((displayRanges && displayRanges[idx]) ? displayRanges[idx] : range) === "" ? " " : (displayRanges && displayRanges[idx]) ? displayRanges[idx] : range,
					value: range
				});
    		});
			return ret;
		};*/
		
		//commenting as not required by TDP
        /*Utility.prototype.processRoute = function (routeData) {
    		//var that=this;
    		let lastvisitedRouteData= JSON.parse(widget.getRefreshViewParams('xpflLastVisitedRoute'));
    		let routePosition='';
    		if(!lastvisitedRouteData.previousRoutes)lastvisitedRouteData.previousRoutes=[];
    		if(routeData.params && !routeData.params.fromBackButton){
    			//uncomment below lines if we dont want to persist the whole navigation
				/*lastvisitedRouteData.previousRoutes.forEach(function(item,index){
					if(item.name===routeData.name){
						if(item.id && routeData.params.id){
							//if(item.id===routeData.params.id)
								routePosition=index;
						}else{
							routePosition=index;
						}
					}
				});*/

				//if(routePosition!=='') lastvisitedRouteData.previousRoutes.splice(routePosition);

				//if(lastvisitedRouteData.name!==rootRouteName){
					/*if(routePosition===''  && !routeData.params.isRefresh){
					let previousData={
							name:lastvisitedRouteData.name,
							id:lastvisitedRouteData.id,
							params:lastvisitedRouteData.params
					};
					lastvisitedRouteData.previousRoutes.push(previousData);
					}
				//}
    		} else {
    			lastvisitedRouteData.previousRoutes.pop();
    		}
    		
    		lastvisitedRouteData.name=routeData.name;
    		lastvisitedRouteData.id=routeData.params.id?routeData.params.id:routeData.params.pid?routeData.params.pid:"";
    		//QFM-respParams is in circle or recursive
    		if(routeData.params.respParams && routeData.params.respParams.respParams){
    			routeData.params.respParams.respParams = {};	
    		}
    		if(routeData.params && routeData.params.params){
    			routeData.params.params = {};	
    		}
    		lastvisitedRouteData.params=routeData.params;
    		
    		widget.setRefreshViewParams('xpflLastVisitedRoute',JSON.stringify(lastvisitedRouteData));
    	};*/
    	
		//commenting as not required by TDP
        /*Utility.prototype.initializeGlobalMethods = function (){
    		widget.setRefreshViewParams=function(key,value){
    			key=key+widget.id;
    			window.localStorage.removeItem(key);
    			window.localStorage.setItem(key,value);
    		};
    		widget.getRefreshViewParams=function(key){
    			key=key+widget.id;
    			return window.localStorage.getItem(key);
    		};
    	};*/
    	
		//commenting as not required by TDP
		/*Utility.prototype.invokeContextualMenuOnClick = function (element) {
			DomUtils.addEventOnElement(this, element, 'click', function (e) {
				let ev = document.createEvent('HTMLEvents');
				ev.initEvent('contextmenu', true, false);
				ev.pageX = e.pageX;
				ev.pageY = e.pageY;
				this.dispatchEvent(ev);
			});
		};*/

    	return Utility;
    });
