define('DS/ENOSpecMultiGrid/attributes/model/MultiGridAttributeModel',[
	'UWA/Core',
	'UWA/Class/Model',
	'DS/ENOSpecMultiGrid/attributes/model/MultiGridItemAttributeModel'
	
], function(UWA,
		Model,
		ItemAttributeModel){
	'use strict';
	var MultiGridAttributeModel = Model.extend({
		
		setup : function(options){
			this.items = options.itemIDs;
			
		},
	
         createListNode : function(rowAttr){
         var currentNode = new ItemAttributeModel().set(rowAttr);
         return   currentNode;
        }
              
      	
	});
	return MultiGridAttributeModel;
	
});

