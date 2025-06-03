/**
 * 
 */
define("DS/ENOSpecMultiGrid/attributes/services/MultiGridAttrServiceProvider", 
    [
  		'UWA/Class',
  		'UWA/Promise',
  		'DS/XSRCommonComponents/utils/ItemServiceProvider',
  		'DS/XSRCommonComponents/utils/RequestUtil',
  		'DS/XSRCommonComponents/utils/XInfraRequestUtil',
  		'DS/XSRCommonComponents/utils/Constants'
  	],
    function (Class,Promise,ItemServiceProvider,RequestUtil,XInfraRequest, Constants)
    {
        "use strict";
        var platFormId;
        
        var AttributeServiceProvider = Class.extend({
        	
        	init : function(options){
				platFormId = RequestUtil.getPlatformId();
				this.isChangeControlled = options &&  options.isChangeControlled?  true : false;
        	},
           getItemInfo : function(itemId,typeName){        	 
        		var req =  new XInfraRequest({'id': itemId});
 				var input = {'mask' :  "SpecAndRelatedInfoObjectMask",
 						'typeName' : typeName };
                 return req.get(input);
        	},
			
           getAttributes : function(requestPayload){        	 
        	  var that = this;
        	  let currentdateTime=(new Date()).getTime();
        	  let securityToken=encodeURIComponent(RequestUtil.getSecurityToken());
              return new Promise(function(resolve,reject){
                	
					RequestUtil.send3DSpaceRequest(
						'resources/v1/collabServices/attributes/op/read?tenant='+ platFormId+"&_="+currentdateTime,
						"POST", {
						"type": "json",
						"headers": that.getHeaders({"SecurityToken":securityToken}),
						"data": JSON.stringify(requestPayload)
						}, resolve ,reject);
            });
      	  
              
          },
          updateAndSyncAttributes : function(itemID,inputjsonArr,nodeModel,isRelorBus) {
  			var inputBuilder = {itemid : itemID, request : inputjsonArr,isRelorBus:isRelorBus,nodeModel:nodeModel};
  		
  			return new Promise(function(resolve, reject){
  				new ItemServiceProvider({isChangeControlled : true}).updateAttributes(inputBuilder).then(function(resp){
  					
  					if(resp.results && resp.results.length>0){
  						var resultArr = resp.results; 
  						for(var i=0; i<resultArr.length; i++){
  							var status = resultArr[i].status;
  							if(200 === status){
  								var respBody = resultArr[i].body;
  								if(respBody.errors && respBody.errors.length>0){
  									reject(respBody.errors);
  								}else {  									
  									resolve(respBody);
  								}
  								
  							} else {
  								//notify failure
  								reject();
  							}
  						}
  					}
  				}).catch(function(err){console.log(err); });
  			});

  			
  		},
	    getApplicableExtensions:function(type){
	     let requestPayload={"classes":[type[0]]};
	      var that = this;
       	  let currentdateTime=(new Date()).getTime();
       	  let securityToken=encodeURIComponent(RequestUtil.getSecurityToken());
             return new Promise(function(resolve,reject){               	
					RequestUtil.send3DSpaceRequest(
						'resources/dictionary/interfaces?customerOnly=true&displayAttributes=true&tenant='+ platFormId+"&_="+currentdateTime,
						"POST", {
						"type": "json",
						"headers": that.getHeaders({"SecurityToken":securityToken}),
						"data": JSON.stringify(requestPayload)
						}, resolve ,reject);
           });
	    	
	    },
	    getObjectInterfaces:function(listOfObjects){
		     let requestPayload={"objects":listOfObjects};
		      var that = this;
	       	  let currentdateTime=(new Date()).getTime();
	       	  let securityToken=encodeURIComponent(RequestUtil.getSecurityToken());
	             return new Promise(function(resolve,reject){               	
						RequestUtil.send3DSpaceRequest(
							'resources/dictionary/object/interfaces?customerOnly=true&isRoleChecked=true&tenant='+ platFormId+"&_="+currentdateTime,
							"POST", {
							"type": "json",
							"headers": that.getHeaders({"SecurityToken":securityToken}),
							"data": JSON.stringify(requestPayload)
							}, resolve ,reject);
	           });
		    	
		    },
	      addExtensions:function(requestPayload){
		      var that = this;
	       	  let currentdateTime=(new Date()).getTime();
	       	  let securityToken=encodeURIComponent(RequestUtil.getSecurityToken());
	             return new Promise(function(resolve,reject){	               	
						RequestUtil.send3DSpaceRequest(
							'resources/dictionary/object/addInterfaces?tenant='+ platFormId+"&_="+currentdateTime,
							"POST", {
							"type": "json",
							"headers": that.getHeaders({"SecurityToken":securityToken}),
							"data": JSON.stringify(requestPayload)
							}, resolve ,reject);
	           });
		    	
		    },
		    removeExtensions:function(requestPayload){
			      var that = this;
		       	  let currentdateTime=(new Date()).getTime();
		       	  let securityToken=encodeURIComponent(RequestUtil.getSecurityToken());
		             return new Promise(function(resolve,reject){	               	
							RequestUtil.send3DSpaceRequest(
								'resources/dictionary/object/removeInterfaces?tenant='+ platFormId+"&_="+currentdateTime,
								"POST", {
								"type": "json",
								"headers": that.getHeaders({"SecurityToken":securityToken}),
								"data": JSON.stringify(requestPayload)
								}, resolve ,reject);
		           });
			    	
			    },            
          
          getHeaders : function(requestHeaders){
        	  var headers = {};
        	  headers["Content-type"] = "application/json" ;
        	  
        	  if(this.isChangeControlled){
        		  Object.assign(headers , RequestUtil.getWorkUnderHeaders());
        	  }
        	  
        	  if(requestHeaders){
        		    Object.keys(requestHeaders).forEach(function(reqHeader){
        		    	headers[reqHeader]=requestHeaders[reqHeader];
        		    });
        	  }
        	  return headers;
          }
        });
        return AttributeServiceProvider;
    });
