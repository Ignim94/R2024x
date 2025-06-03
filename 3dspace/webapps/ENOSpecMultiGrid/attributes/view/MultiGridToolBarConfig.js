define('DS/ENOSpecMultiGrid/attributes/view/MultiGridToolBarConfig',[
	'UWA/Core',
	'UWA/Class',
	'DS/XSRCommonComponents/utils/Constants',
	'i18n!DS/ENOSpecMultiGrid/assets/nls/MultiGridAttribute', 
], function(UWA,
		Class,
		Constants,
		NLS
		){
	'use strict';
	var multiGridToolbarActions = Class.extend({
		
		init : function(options){
			
		},

		getCommands : function(){	
			var context=this;			
			var actionList =
			[ {
					key:Constants.TOOLBAR_CMD_ADDITEMS,
					text:NLS.label_AddItem,					
					fonticon:"plus",
					},
				   {
					key:Constants.TOOLBAR_CMD_REMOVEITEMS,
					text: NLS.label_RemoveItem,
					fonticon:"tree-delete"
					}/*,
					{
					key:Constants.TOOLBAR_CMD_ADDEXTENSION,
					text:NLS.label_AddExtension,
					fonticon : "attributes-add",
					},
					{
					key:Constants.TOOLBAR_CMD_REMOVEEXTENSION,
					text:NLS.label_RemoveExtension,
					fonticon : "attributes-delete",
					}*/
					
			];
			return actionList;
		}
	});
	return multiGridToolbarActions;
	
});
