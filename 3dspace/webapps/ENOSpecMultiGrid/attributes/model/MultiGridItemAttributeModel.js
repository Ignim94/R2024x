define('DS/ENOSpecMultiGrid/attributes/model/MultiGridItemAttributeModel', [
  'DS/TreeModel/TreeNodeModel',
  'DS/XSRCommonComponents/utils/Utils',
  'UWA/Core'
], function(
  TreeNodeModel,
  Utils,
  Core
) {

  'use strict';

  function MultiGridItemAttributeModel(options){
      this._parentNode = {
        _nodeDepth : 1
      };
      this.pathElement = {
        externalPath : []
      };
      this.options = {
    		  // This is required for tree structure for DataGridView
              //children: [],
              //useAsyncPreExpand : false,
              filteringContext : {
            	  isFilterOutBySearch : true, // This is key to filter using collection toolbar
            	  isFilterOutByTagger : true, // This is key to filter using 6WTags
            	  isFilterOutByNG : true // This is key to filter using advance filter
              },
              label:undefined,
              grid : {
            	  'itemIds':[],
        		  'displayName': undefined ,
        		  'type':undefined,
        		  'name':undefined,
        		  'mandatory':false,
        		  'typeRepresentation':undefined,
        		  'selectable':undefined,
        		  'extensionName':undefined,
        		  'computedDispName':undefined,
        		  'objectType':undefined,
        		  'extensionDispName':undefined,
        		  'UIPosition':undefined,
        		  'path':undefined,
        		  'range':undefined,
        		  'rangeNLS':undefined,
        		  'maxlength':undefined,
        		  'deploymentExtension':false
              }
             
              
             };
      
    //  this.options = Core.extend(this.options, options);
      TreeNodeModel.call(this, this.options);
  }
  
  
  MultiGridItemAttributeModel.prototype = Object.create(TreeNodeModel.prototype);

  MultiGridItemAttributeModel.prototype.shouldBeEditable = function(){
	    return false;
  };
  MultiGridItemAttributeModel.prototype.isDeploymentExtension = function(){
	    return this.options.grid.deploymentExtension;
};
  MultiGridItemAttributeModel.prototype.getMaxLength = function(){
	    return this.options.grid.maxlength;
  };
  MultiGridItemAttributeModel.prototype.getItemIDs= function(){
	    return this.options.grid.itemIds;
  };
  MultiGridItemAttributeModel.prototype.setItemIDs= function(itemIds){
		    this.options.grid.itemIds=itemIds;
   };
  MultiGridItemAttributeModel.prototype.getName = function(){
    return this.options.grid.name;
  };
  MultiGridItemAttributeModel.prototype.getExtensionName = function(){
	    return this.options.grid.extensionName;
	  };
  
  MultiGridItemAttributeModel.prototype.isMandatory= function(){
	    return this.options.grid.mandatory;
  };
  MultiGridItemAttributeModel.prototype.getType= function(){
	    return this.options.grid.type;
  };
  MultiGridItemAttributeModel.prototype.getDimension= function(){
	    return this.options.grid.dimension;
};
MultiGridItemAttributeModel.prototype.getDimensionType= function(){
    return this.options.grid.dimensionType;
};
MultiGridItemAttributeModel.prototype.getUnitName= function(){
    return this.options.grid.unitName;
};
  MultiGridItemAttributeModel.prototype.setTypeRepresentation= function(typeRep){
	   this.options.grid.typeRepresentation;
};

MultiGridItemAttributeModel.prototype.getTypeRepresentation = function(objID){
	  let typeOfAttr=this.getType();
	  let cellValue=this.getDynamicColumnValue(objID);
	  let rangeValues=this.getDynamicColumnValue("range");
	  let attrName=this.getDynamicColumnValue("name");
	  let isNotaNumber=isNaN(cellValue);
	  let isGMTDate=this.getDynamicColumnValue("isGMTDate");
      let isMultiLine=this.getDynamicColumnValue("multiline"); 
      let isMultiValue=this.getDynamicColumnValue("multivalue"); 
      let attrReadOnlyKey=this.getDynamicColumnValue(objID+"_readOnly");
	  if(typeOfAttr){
		  switch(typeOfAttr){
		    case 'string':if(cellValue){		    	              
		    	              let cellValueType= typeof cellValue;  
		    	              if(isGMTDate&&isNotaNumber && !isNaN(Date.parse(cellValue))){		    	            	 
		    	            	  return "datetime";
		    	              }
		    	              else if(rangeValues&&Array.isArray(rangeValues)&&isMultiValue==undefined){
		    	            	  return "DisplayCombobox";
		    	              	    	              
		                      }
		    	              else{
			                	   return "textBlock";
			                   }
		                     }  
		    	           else{
		                	   return "textBlock";
		                   }
		                  break;
		    case 'integer': if(rangeValues&&Array.isArray(rangeValues)&&isMultiValue==undefined){
                                   	  return "DisplayCombobox";	              
                             }else if(!isNotaNumber){
		    	              return "integer";
                             }
		                    return "textBlock";
		                    break; 
		    case 'real': if(rangeValues&&Array.isArray(rangeValues)&&isMultiValue==undefined){
             	              return "DisplayCombobox";	              
                         }else if(!isNotaNumber){
	                         return "float";
                         }
		    	          return "textBlock";
		                   break;
		    case 'boolean':if(attrReadOnlyKey){
		    	               return "textBlock";
		                   }else if(rangeValues&&Array.isArray(rangeValues)&&isMultiValue==undefined){    return "DisplayCombobox";	              
                           }else{
		    	             return "boolean";
		                   }
		    	 break;
		    case 'timestamp':
		    	return "datetime";
		    	break;
		    default :return "textBlock"; 
		          break;
		    
		  }
	  }else{
		  return "string";
	  }
  }; 
  MultiGridItemAttributeModel.prototype.getSelectable = function(){
			    return this.options.grid.selectable;
   }; 
   MultiGridItemAttributeModel.prototype.getPath = function(){
	    return this.options.grid.path;
}; 
   MultiGridItemAttributeModel.prototype.getDynamicColumnValue = function(key){
	    return this.options.grid[key];
 };
 MultiGridItemAttributeModel.prototype.getDisplayName= function(){
	    return this.options.grid.displayName;
}; 
MultiGridItemAttributeModel.prototype.setComputedName = function(value){
	/*  if(this.options.grid.extensionDispName){
		  this.options.grid.computedDispName=this.options.grid.displayName+" ("+this.options.grid.extensionDispName+")";
	  }else{*/
		  this.options.grid.computedDispName=this.options.grid.displayName; 
	 // }
	  return this.options.grid.computedDispName;
 };
MultiGridItemAttributeModel.prototype.setSearchFilterState = function(state){
	 this.options.filteringContext.isFilterOutBySearch = state;
};
MultiGridItemAttributeModel.prototype.setTaggerFilterState = function(state){
	  this.options.filteringContext.isFilterOutByTagger = state;
	};	
MultiGridItemAttributeModel.prototype.setNGFilterState = function(state){
		 this.options.filteringContext.isFilterOutByNG = state;
	};
MultiGridItemAttributeModel.prototype.applyFilters = function(){
	var that = this;
	var shouldBeHidden = function(){
		return !( that.options.filteringContext.isFilterOutByTagger &&  that.options.filteringContext.isFilterOutBySearch &&
				  that.options.filteringContext.isFilterOutByNG);
	};
	if(shouldBeHidden()){
		this.hide();
	}else {
		this.show();
	}
};
 MultiGridItemAttributeModel.prototype.getTreeModel = function(){
	   this.options.grid.tree=this.options.label=this.setComputedName();
	   this.updateOptions(this.options);
	  return this;
  };

  MultiGridItemAttributeModel.prototype.set = function(attr){
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
  

return MultiGridItemAttributeModel;


});
