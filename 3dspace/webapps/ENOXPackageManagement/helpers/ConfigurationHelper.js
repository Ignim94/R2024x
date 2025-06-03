define('DS/ENOXPackageManagement/helpers/ConfigurationHelper',
    ['i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement'
	],
    function(NLS) {
        'use strict';

        var ConfigurationHelper = function ConfigurationHelper() {};
	   
		ConfigurationHelper.prototype.processForRanges = function(respData){
    			var that=this;
    		return new Promise((resolve)=>{ 
        		if (respData) {
        				resolve(respData.map(item => that.processData(item)));
        		}
    		});
    	};
		ConfigurationHelper.prototype.processData=function(item){
    		var data = {
    				"name":item.name
    		};
    		var returnData = {
    				grid:data,
					label:NLS[item]?NLS[item]:item
    		};
    		return returnData;
    	};
		ConfigurationHelper.prototype.processForAddNew=function(range){
			var elementsRequired = [];

         	range.forEach(function(res){
     			let obj = {
     					name : res,
     					en :res
     			};
     			elementsRequired.push(obj);
     		});
			/*var rangeData = {
			"data":elementsRequired
			}*/
			return elementsRequired;
		};
       
    	return ConfigurationHelper;
    });
