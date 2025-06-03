define('DS/ENOSpecMultiGrid/attributes/model/MultiGridItemSearchModel', [
	 'UWA/Core',
	 'DS/ENOSpecMultiGridCommon/model/SpecMultiGridItemModel'
  
], function(
  Core,
  GridItemModel
  ) {
  'use strict';
	  
  function MultiGridItemSearchModel(options){
	  GridItemModel.call(this);

	  Object.defineProperties(this.options.grid, {
		  'partNumber' : {value :"", writable: true },
		  'ds6wg:EnterpriseExtension.V_PartNumber': {value :"", writable: true },
    	  });

  }
  
  MultiGridItemSearchModel.prototype = Object.create(GridItemModel.prototype);
 
  MultiGridItemSearchModel.prototype.getItemId=function(){
	  return this.getPhysicalId();
  };
  MultiGridItemSearchModel.prototype.getCurrent=function(){
	  return this.getMaturity();
  };
  MultiGridItemSearchModel.prototype.getPartNumber=function(){
	  return this.options.grid.partNumber;
  };
  MultiGridItemSearchModel.prototype.set = function(attr){
	  var that = this;
	
	  for (var key in attr) {
		  if(attr.hasOwnProperty(key)){
		    	switch(key){
		  		case 'id' :
		  		case 'physicalid' : 
		  			this.options.grid.physicalId = attr[key];
		  			break;
		  		case "ds6w:label" : 
		  			let labelValue= attr["ds6w:label_value"]? attr["ds6w:label_value"]: attr["ds6w:label"];
		  			this.options.grid['ds6w:label'] = this.options.grid.tree = labelValue;
		  			break;
		  		case "type_icon_url" :
		  		case "icons" :
		  			this.setTypeIcon(attr[key]);
		  			break;
		  		case "preview_url" : 
		  			this.options.grid.preview_url = attr[key];
		  			break;
		  		case "ds6w:description" : 
		  			this.options.grid['ds6w:description'] = attr[key];
		  			break;
		  		case "partNumber":
		  			this.options.grid['partNumber']=attr[key];
		  			break;
		  		case "ds6w:type" :
		  			this.options.grid['ds6w:type'] = attr[key];
		  			break;
		  		case "ds6w:type_value" :
		  			this.options.grid['ds6w:type_value'] = attr[key];
		  			break;
		  		case "ds6w:policy" : 
		  			this.options.grid['ds6w:policy'] = attr[key];
		  			break;
		  		case "ds6w:policy_value" : 
		  			this.options.grid['ds6w:policy_value'] = attr[key];
		  			break;
		  		case "ds6w:responsible" :
		  			this.options.grid['ds6w:responsible'] = this.options.grid.owner= attr[key];
		  			break;
		  		case "ds6w:globalType" : 
		  			this.options.grid['ds6w:globalType'] = "ds6w:Document";
		  			break;
		  		case "ds6w:identifier" :
		  			this.options.grid['ds6w:identifier'] = this.options.grid.name  = attr[key];
		  			break;
		  		case "ds6wg:revision" :
		  			this.options.grid['ds6wg:revision'] = attr[key];
		  			break;
		  		case "thumbnail_2d" :
		  			this.setThumbnail2d( attr[key]);
		  			break;
		  		case "thumbnail" :
		  			this.setThumbnail(attr[key]);
		  			break;
		  		case "ds6w:status" :
		  			this.options.grid['ds6w:status'] = attr[key];
		  			break;
		  		case "ds6w:status_value" :
		  			this.options.grid['ds6w:status_value'] = attr[key];
		  			break;
		  		case "ds6w:modified" :
		  			this.options.grid['ds6w:modified'] = attr[key];
		  			break;
		  		case "ds6w:created" :
		  			this.options.grid['ds6w:created'] = attr[key];
		  			break;
		  		case "isLastVersion" :
		  			this.options.grid['isLastVersion'] = attr[key];
		  			break;
		  		case "ds6wg:EnterpriseExtension.V_PartNumber":
		  			let value= attr["ds6wg:EnterpriseExtension.V_PartNumber_value"]? attr["ds6wg:EnterpriseExtension.V_PartNumber_value"]: attr["ds6wg:EnterpriseExtension.V_PartNumber"];
		  			this.options.grid.partNumber=this.options.grid['ds6wg:EnterpriseExtension.V_PartNumber']=value;
		  			break;
		  		default :
		  			this.options.grid[key]=attr[key];
		  		    break;

		    	}
		  }
		  }
	
	  return this;
  };
  
 
return MultiGridItemSearchModel;


});
