//XSS_CHECKED
/* global widget */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageUXInfra/models/CommonPublication',
		[
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageUXInfra/helpers/TDPCommonHelper',
			'i18n!DS/ENOXPackageUXInfra/assets/nls/ENOXPackageUXInfra',
			'DS/UIKIT/Mask'
			],
			function (ENOXSourcingService,ENOXSourcingPlatformServices,TDPCommonHelper,NLS,UIMask) {
	'use strict';


	let CommonPublication = function (){
		this.source = "3DSpace";
		this.tdpCommonHelper =new TDPCommonHelper();
	};


	CommonPublication.prototype.init = function(){
		//console.log("Publication init called");
	};
	
	CommonPublication.prototype.getPublication =function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/publications/"+options.data.params.id;
		options.source = "3DSpace";
		return ENOXSourcingService.getDataPromise(options);

	};
	
	CommonPublication.prototype.getContentReport = function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/publications/"+options.data.params.id+"/contentReport";
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);
	};
	CommonPublication.prototype.downloadZipFile = function(options){
		let that =this;
		options.endpoint ="/resources/v1/modeler/dstdp/publications/"+options.id+"/checkPublicationFileExist";
				options.source = this.source;
				ENOXSourcingService.getDataPromise(options).then((data) => {
						if(data.data[0].BackgroundJob==="Completed"&&data.data[0].isFileExpired==="false"){
							
								options.endpoint = "/resources/v1/modeler/dstdp/publications/"+options.id+"/downloadTicket";
								options.source="3DSpace";
								ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(csrfToken){
									let data= [{"id":options.id}];
									options.putData = {"csrf":{"name":"ENO_CSRF_TOKEN","value":csrfToken},"data":data};
									ENOXSourcingService.performPutPromise(options).then(function(responseData){
									if(!options.helper){
										options.helper = that.tdpCommonHelper;
									}
									let downloadOptions ={
										ticketURL:responseData.data[0].dataelements.ticketURL,
										applicationChannel:options.applicationChannel
									};
									options.helper.downloadWithTicketURL(downloadOptions);
								});
								}).catch(function(e) {
									widget.notificationUtil.showError(e.error?e.error:(e.internalError?e.internalError:NLS.error_while_downloading_publication_zip));
									UIMask.unmask(widget.body);
								});
						}else if(data.data[0].BackgroundJob==="Started"){
							widget.notificationUtil.showInfo(NLS.Publication_zip_creation_is_in_progress);	
						}else if(data.data[0].isFileExpired==="true"){
							widget.notificationUtil.showError(NLS.Publication_File_Expired);	
						}
						else{
							widget.notificationUtil.showError(NLS.Publication_zip_creation_Failed);
						}
					});
	};
	
	
return CommonPublication;
});

