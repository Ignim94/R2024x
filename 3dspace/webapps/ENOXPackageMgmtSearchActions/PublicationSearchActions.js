/*let modules = ['ENOXSourcingSearchActions'];

let regexpResult = /(^.*\/webapps\/)ENOXPackageMgmtSearchActions/.exec(require.toUrl('DS/ENOXPackageMgmtSearchActions'));
let baseUrlForScript;
if (regexpResult && regexpResult.length === 2) {
    baseUrlForScript = regexpResult[1];
    let configPath = {};
	
    modules.forEach(function(module) {
        'use strict';
       	let lURL = require.toUrl('DS/' + module); 
        if (lURL.indexOf('sourcing/webapps') === -1) {
            configPath['DS/' + module] = baseUrlForScript + module;
        }
    });
	require.config({
        paths: configPath
    });
}*/
/* global UWA */

define('DS/ENOXPackageMgmtSearchActions/PublicationSearchActions',[
	 'DS/Notifications/NotificationsManagerUXMessages',
	'DS/Notifications/NotificationsManagerViewOnScreen',
	'DS/i3DXCompassPlatformServices/i3DXCompassPlatformServices',
	'DS/WAFData/WAFData',
	'UWA/Utils',
	'DS/ENOXPackageMgmtSearchActions/constants/SearchActionsConstants',
	'i18n!DS/ENOXPackageMgmtSearchActions/assets/nls/ENOXPackageMgmtSearchActions'
], function(NotificationsManagerUXMessages,NotificationsManagerViewOnScreen,i3DXCompassPlatformServices,WAFData,Utils,SearchActionsConstants,NLS) {
	'use strict';
	let ActionsHandler =  {
		
		executeAction: function(actions_data) {
			let notificationsMgr =NotificationsManagerUXMessages;
			NotificationsManagerViewOnScreen.setNotificationManager(notificationsMgr);
			if(actions_data.action_id === SearchActionsConstants.DOWNLOAD){
				let model = actions_data.model;
				i3DXCompassPlatformServices.getServiceUrl({
					serviceName: model.getServiceID(),
					platformId: model.getPlatformID(),
					onComplete: function (url) {
							let urlTocheckPublicationFileExist = url+"/resources/v1/modeler/dstdp/publications/"+actions_data.object_id+"/checkPublicationFileExist"+"?tenant="+ model.getPlatformID();
							let headers = {
								"Content-Type": 'application/json',
								'Accept': 'application/json'
							};
							actions_data.headers= headers;
							WAFData.authenticatedRequest(urlTocheckPublicationFileExist, {
								'method': 'GET',
								'type': 'json',
								 headers: headers,
								'onComplete': function(wsResponse) {
									if(wsResponse.data[0].BackgroundJob===SearchActionsConstants.BACKGROUND_JOB_COMPLETED && wsResponse.data[0].isFileExpired==="false"){
									
									downloadPublicationZipFile(url,actions_data,notificationsMgr);
									
							       
									}
									else if(wsResponse.data[0].BackgroundJob===SearchActionsConstants.BACKGROUND_JOB_STARTED){
										notificationsMgr.addNotif({
										level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_INFO,
										subtitle : NLS.Publication_zip_creation_is_in_progress
										});	
									}
									else if(wsResponse.data[0].isFileExpired==="true"){
										notificationsMgr.addNotif({
										level : actions_data.level ? actions_data.level : "error",
										subtitle : NLS.Publication_File_Expired
										});	
									}
									else{
										notificationsMgr.addNotif({
										level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_ERROR,
										subtitle : NLS.Publication_zip_creation_Failed
										});	
									}
								},
								onFailure: function (error) { 
								
											WAFData.authenticatedRequest(error['message'].split("\"")[1], {
												'method': 'GET',
												'type': 'json',
												 headers: headers,
												'onComplete': function(wsResponse) {
													if(wsResponse.data[0].BackgroundJob===SearchActionsConstants.BACKGROUND_JOB_COMPLETED && wsResponse.data[0].isFileExpired==="false"){
													downloadPublicationZipFile(url,actions_data,notificationsMgr);
											       
													}
													else if(wsResponse.data[0].BackgroundJob===SearchActionsConstants.BACKGROUND_JOB_STARTED){
														notificationsMgr.addNotif({
														level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_INFO,
														subtitle : NLS.Publication_zip_creation_is_in_progress
														});	
													}
													else if(wsResponse.data[0].isFileExpired==="true"){
														notificationsMgr.addNotif({
														level : actions_data.level ? actions_data.level : "error",
														subtitle : NLS.Publication_File_Expired
														});	
													}
													else{
														notificationsMgr.addNotif({
														level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_ERROR,
														subtitle : NLS.Publication_zip_creation_Failed
														});	
													}
												},
												onFailure: function (errorData) {
													notificationsMgr.addNotif({
									                    level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_ERROR,
									                    subtitle : errorData
													}); 
												}
											});
								
								
								}
							});
					},
					onFailure: function (error) { notificationsMgr.addNotif({
	                    level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_ERROR,
	                    subtitle : error
						});
					}
            });
      }
	  if(actions_data.action_id === "content_report"){
		 actions_data.model["action_id"]=actions_data.action_id;
		 actions_data.actionsHelper.preview(actions_data);
				
	  }
    }
	};
	
	function downloadPublicationZipFile(url,actions_data,notificationsMgr){
		
									let csrfTokenURL = url + "/resources/v1/application/CSRF";
						let fetchOpts = {};
						fetchOpts.method = 'GET';
						fetchOpts.onComplete = function(respData) {
							 let data= [{"id":actions_data.object_id}];
									let pubData= {"csrf":{"name":"ENO_CSRF_TOKEN","value":respData.csrf.value},"data":data};
									let downloadPublicationZipUrl=url+"/resources/v1/modeler/dstdp/publications/"+actions_data.object_id+"/downloadTicket";
									
									WAFData.authenticatedRequest(downloadPublicationZipUrl, {
										'method': 'PUT',
										'type': 'json',
										 data:UWA.Json.encode(pubData),
										 headers: actions_data.headers,
											'onComplete': function(wsResponse) {
												
													let ticketURL=wsResponse.data[0].dataelements.ticketURL;
												    var doc = document;
													if (Utils.Client.Platform.ipad) {
														var haspopupBlocker = window.open(require.toUrl('DS/ENOXPackageMgmtSearchActions/assets/blankForm.html'), '_blank');
														var returnValue={};
														doc = haspopupBlocker.document;
														
														return returnValue;
													}

													if (UWA.is(ticketURL, 'string')) {
														// 1. Decompose the URL
														var parsedUrl = Utils.parseUrl(ticketURL);
														// 2. Parse query part of the url
														var params = Utils.parseQuery(parsedUrl.query);
														params['__fcs__attachment'] = true;
														delete parsedUrl.query;
														var postUrl = Utils.composeUrl(parsedUrl);
														// 5. Create a temporary form and prepare inputs
														var tempForm = doc.createElement('form');
														tempForm.style.display = 'none';
														tempForm.method = 'POST';
														tempForm.action = postUrl;

														Object.keys(params).map(function(key) {
															var newInput = doc.createElement('input');
															newInput.setAttribute('name', key);
															newInput.setAttribute('value', params[key]);
															tempForm.appendChild(newInput);
														});

														doc.body.appendChild(tempForm);
														tempForm.submit();
														doc.body.removeChild(tempForm);
													}
											},
											onFailure: function (error) { notificationsMgr.addNotif({
											level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_ERROR,
											subtitle : error
											});
										 }
									  });
									};
									fetchOpts.onFailure = function(error) {
										notificationsMgr.addNotif({
										level : actions_data.level ? actions_data.level : SearchActionsConstants.MESSAGE_LEVEL_ERROR,
										subtitle : error
										});
									};

									fetchOpts.type = "json";
									WAFData.authenticatedRequest(csrfTokenURL, fetchOpts);
		
	}
	
	return ActionsHandler;

});
