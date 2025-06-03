define('DS/ENOSpecMultiGrid/attributes/model/MultiGridItemModel', [
  'UWA/Core'
], function(  
  Core
) {

  'use strict';

  function MultiGridItemModel(){
     
      this.options = {
              grid : {
            	  'itemId':undefined,
        		  'itemType':undefined,
        		  'type_icon_large_url':undefined,
        		  'type_icon_url':false
        		  
              }           
              
             };     
   
  }
  
  MultiGridItemModel.prototype.getID=MultiGridItemModel.prototype.getItemId= function(){
	    return this.options.grid.itemId;
  };
  MultiGridItemModel.prototype.getPartNumber = function(){
	    return this.options.grid.V_PartNumber?this.options.grid.V_PartNumber[0]:"";
	  };
MultiGridItemModel.prototype.getTitle = function(){
		    return this.options.grid.V_Name?this.options.grid.V_Name[0]:"";
 };
 MultiGridItemModel.prototype.getRevision = function(){
	    return this.options.grid.revision?this.options.grid.revision[0]:"";
};
MultiGridItemModel.prototype.getCurrent = function(){
    return this.options.grid.revision?this.options.grid.current[0]:"";
};

  MultiGridItemModel.prototype.getType = function(){
    return this.options.grid.type;
  };
  MultiGridItemModel.prototype.getDynamicColumnValue = function(key){
	    if(this.options.grid[key]){
	    	let value=this.options.grid[key];
	    	if(Array.isArray(value)){
	    		return value[0];
	    	}else
	    		return value;
	    }else{
	    	return "";
	    }
  };
  MultiGridItemModel.prototype.set = function(attr){
	  for (var key in attr) {
		    if( attr.hasOwnProperty(key) ) {
		    	switch(key){
		  		case 'name' :		  		
		  			this.options.grid.name= attr[key];
		  			break;		  		
		  		default : 
		  			this.options.grid[key] = attr[key];
		  			break;
		    	}
		    } 
		  }  

	  return this;
  };
  

return MultiGridItemModel;


});
