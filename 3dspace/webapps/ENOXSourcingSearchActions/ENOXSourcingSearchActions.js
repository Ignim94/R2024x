define('DS/ENOXSourcingSearchActions/ENOXSourcingSearchActions',[
	'DS/ENOXSourcingSearchActions/constants/ENOXSourcingSearchActionsConstants',
	'i18n!DS/ENOXSourcingSearchActions/assets/nls/ENOXSourcingSearchActions'
], function(SourcingSearchActionsConstants,NLS) {
	'use strict';
	let ActionsHandler =  {
		
			getActions: function(params) {
				 let actionsResponse = {
                    status: 'success',
                    actions: []
                };

                // if multiple models are selected, don't add any actions
                if (params.models.length > 1) {
                    params.onComplete(actionsResponse);
                    return;
                }

                // build the action object for this model
                    let actionObjectForCurrentModel = {
                        id: params.models[0].id,
                        actions: getActionArray(params)
                    };
					actionsResponse.actions.push(actionObjectForCurrentModel);
				
				params.onComplete(actionsResponse);
            }
	};
	
	function getActionArray(options) {
		
		let returnArray = [];
		
		returnArray.push({
			"id": "3DCompass_#OpenWith",
			"title": NLS.open_with,
			"icon": "open-with-icon",
			"cmdInfo":{
			"type": options["data"].objects[0].type
			}
		});
		
		if(options["data"].objects[0].type===SourcingSearchActionsConstants.TYPE_TDP_PUBLICATION)
			returnArray.push({
                title: NLS.download,
                icon: 'download',
                id: 'download',
                sourcejs: SourcingSearchActionsConstants.TDP_PUBLICATION_SOURCEJS
            });
		  return returnArray;
     }
	
	return ActionsHandler;
});
