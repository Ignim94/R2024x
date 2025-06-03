//XSS_CHECKED
/* global widget */
/* global UWA */
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/models/Package',
		[
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/WAFData/WAFData',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'DS/DocumentManagement/DocumentManagement',
			'DS/UIKIT/Mask'
		],
		function (ENOXSourcingService,WAFData,ENOXSourcingPlatformServices,NLS,Constants,DocumentManagement, UIMask) {
	'use strict';


	var Package = function (){
		this.source = "3DSpace";
	};

	Package.prototype.init = function(){
		
	};
	
	Package.prototype.list = function (options) {
		options.endpoint = "/resources/v1/modeler/dstdp/packages";
		options.source = this.source;
		ENOXSourcingService.getService(options);

	};	

	Package.prototype.ListPackages = function (options) {
		options.endpoint = "/resources/v1/modeler/dstdp/packages?$top="+options.top+"&$skip="+options.skip+"";
		options.source = this.source;
		if(options.packageContentFilter){
			let key = "contentId";
			if(options[key]){
				options.endpoint += "&$"+key+"="+options[key];
			}
		}
		return ENOXSourcingService.getDataPromise(options);
	};
	
	Package.prototype.getPackage = (options) => {
		options.endpoint ="/resources/v1/modeler/dstdp/packages/"+options.data.params.id;
		options.source = "3DSpace";
		return ENOXSourcingService.getDataPromise(options);

	};
	
	Package.prototype.createPackage =function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/packages";
		options.source = this.source;
		return ENOXSourcingService.createServicePromise(options);

	};
	
	Package.prototype.revisePackage = function(options) {
       let packageId = options.addData.data[0].id;
        options.endpoint = "/resources/v1/modeler/dstdp/packages/"+packageId+"/revise";
        options.source = this.source ;
        return ENOXSourcingService.createServicePromise(options);
    };
	
	Package.prototype.update = function(options){
		options.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id;
		options.source = this.source;
		ENOXSourcingService.updateService(options);
	};
	
	Package.prototype.updatePackage = function(options){
		options.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id;
		options.source = this.source;
		return ENOXSourcingService.updateServicePromise(options);
	};
	
	Package.prototype.updateContentFiles = function(options){
		let contentOptions = {};
		let postdata =  {
				data: [
					{
						id: options.contentId,
						resourceId: options.resourceId
					}
				]
		};
		contentOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.packageId+"/content/files";
		contentOptions.source = this.source; 
		contentOptions.postData = postdata;
		return ENOXSourcingService.performPostPromise(contentOptions);
	};
	
	Package.prototype.getPublications = function(options){
		var publicationOptions = {};
		publicationOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/publications";
		publicationOptions.source = "3DSpace"; 
		return ENOXSourcingService.getDataPromise(publicationOptions);
	};


	Package.prototype.updateAllowToPublish = function(options){
		options.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.contextObjectId+"/content/"+options.addData.data[0].id;
		options.source = this.source;
		return ENOXSourcingService.updateServicePromise(options);
	};
	
	Package.prototype.detachContent = function(options,deleteData){
		var detachContentOptions = {};
		detachContentOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/content/"+deleteData.id;
		detachContentOptions.source =this.source; 
		return ENOXSourcingService.performDeletePromise(detachContentOptions);
	};
	
	Package.prototype.downloadDerivedOutput=function(options){
			var serverURL=ENOXSourcingPlatformServices.getServiceURL("3DSpace");
			serverURL =serverURL+"/resources/v1/modeler/dsdo/dsdo:DerivedOutputs/"+options.docId+"/dsdo:DerivedOutputFiles/"+options.repId+"/DownloadTicket";
			var securityContext = ENOXSourcingService.getSecurityContext();
			var filename = options.downloadfileName;
			var payload = {
						referencedObject: [{
							source :"3DSpace",
							type :"VPMReference",
							id:options.docId,
							relativePath:""
						}]
					};
			var requestOptions = {};
				requestOptions.method = "POST";
				requestOptions.headers = {
						'Accept': 'application/json',
						'Content-Type': 'application/json',
						SecurityContext: securityContext
				};
			requestOptions.onComplete = function(response) {
					
							response = UWA.is(response, 'string') ? JSON.parse(response) : response;
							var downloadURL;
							if (typeof response.data.dataelements.ticketURL !== 'undefined' && typeof response.data.dataelements.ticket !== 'undefined'){
								downloadURL = response.data.dataelements.ticketURL + "?__fcs__jobTicket=" + encodeURIComponent(response.data.dataelements.ticket);
							}
							var xhr = new XMLHttpRequest();
							xhr.open('POST', downloadURL);
							xhr.responseType = 'blob';
							xhr.onload = function() {
							if (!window.navigator.msSaveBlob) {
									var a = document.createElement('a');
									a.href = window.URL.createObjectURL(xhr.response); // xhr.response is a blob
									if (filename) {
											a.download = filename;
										} // Set the file name.
									a.style.display = 'none';
									document.body.appendChild(a);
									a.click();
									a = undefined;
									} else {
										window.navigator.msSaveBlob(xhr.response, filename);
										}
								};
							xhr.send();
							widget.notificationUtil.showInfo(options.downloadfileName+" "+NLS.download_message);
							
			};
			requestOptions.onFailure = function() {
				widget.notificationUtil.showError(NLS.error_while_downloading_derived_output);
			};
					
			requestOptions.data = JSON.stringify(payload);
			WAFData.authenticatedRequest(serverURL, requestOptions);
		};
	Package.prototype.downloadDocument = function(options){
			options.source = this.source;
			return new Promise((resolve,reject) => {
				var tenantUrl =ENOXSourcingPlatformServices.getServiceURL("3DSpace");
				var securityContext = ENOXSourcingService.getSecurityContext();
				var lOptions = {
						tenant: ENOXSourcingPlatformServices.getPlatformId(),//required
						securityContext:securityContext,
						additionalHeaders:  {},
						tenantUrl: tenantUrl, //documentObj.source
						autoDownload: true,
						onFailure: function(response) { //response
							widget.notificationUtil.showError(response.data.updateMessage);
							reject(response);
						},
						onProgress: function(){
							UIMask.mask(widget.body,NLS.downloading_document);
						},
						onComplete: function(response) {
							response = response.data;
							resolve(response);
						}
				};
				var checkout = false;
				DocumentManagement.downloadDocument(options.docId,undefined, checkout, lOptions);

			});
		};

	Package.prototype.getClasses =function(options,objectid){
		options.endpoint ="/resources/v1/modeler/ipec/assets/classes?$fields=none,classes.name,classes.description,classes.title";
		options.source = "3DSpace";

		return new Promise(function(resolve, reject) {
			var url =  ENOXSourcingService.getServiceURL(options)+"&xrequestedwith=xmlhttpreques";
			WAFData.authenticatedRequest(url, {
				'method': 'POST',
				'type': 'json',
				'timeout':99999999999999999,
				data: "%24ids="+objectid,
				'onComplete': function(wsResponse) {
					resolve(wsResponse);
				},
				'onFailure': function(error,wsResponse) { //wsResponse
					reject(wsResponse);
				},
				'onTimeout':function(){

				}
			});
		});

	};
	
	Package.prototype.getLifeCycleDataProviderPromise =function(options){
		options.endpoint = "/resources/lifecycle/maturity/getStateGraph";
		options.lifeCycleData = options.getLifecyclePayload;
		options.source = this.source;
		return ENOXSourcingService.performLifeCycleAction(options);

	};
	
	Package.prototype.getAttributesRange = function (options) {
        options.endpoint ="/resources/v1/modeler/dstdp/configuration/getAttributeRange";
		options.source = this.source;
		options.postData = options.data;
		return ENOXSourcingService.performPostPromise(options);
	};
	
	Package.prototype.deletePackage = function(options){
		options.endpoint = "/resources/v1/modeler/dstdp/packages/";
		options.source = this.source;
		return ENOXSourcingService.deleteServicePromise(options);
		
	};
	
	//worksheets endpoint
	Package.prototype.addWorksheet = function(options){
		var worksheetOptions = {};
		worksheetOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id+"/worksheets/attach";
		worksheetOptions.source =this.source; 
		worksheetOptions.addData = options.data;
		return ENOXSourcingService.createServicePromise(worksheetOptions);
	};
	
	Package.prototype.removeWorksheet = function(options){
		var worksheetOptions = {};
		worksheetOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id+"/worksheets/detach";
		worksheetOptions.source =this.source;
		worksheetOptions.addData = options.data;
		return ENOXSourcingService.createServicePromise(worksheetOptions);
	};
	
	Package.prototype.getWorksheets = function(options){
		var worksheetOptions = {};
		worksheetOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id+"/worksheets?include=classes";
		worksheetOptions.source =this.source; 
		return ENOXSourcingService.getDataPromise(worksheetOptions);
	};
	
	
	//disclaimer endpoints
	Package.prototype.addDisclaimer = function(options){
		var disclaimerOptions = {};
		disclaimerOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id+"/disclaimers/attach";
		disclaimerOptions.source =this.source; 
		disclaimerOptions.addData = options.data;
		return ENOXSourcingService.createServicePromise(disclaimerOptions);
	};
	
	Package.prototype.removeDisclaimer = function(options){
		var disclaimerOptions = {};
		disclaimerOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id+"/disclaimers/detach";
		disclaimerOptions.source =this.source;
		disclaimerOptions.addData = options.data;
		return ENOXSourcingService.createServicePromise(disclaimerOptions);
	};
	
	Package.prototype.getDisclaimers = function(options){
		var disclaimerOptions = {};
		disclaimerOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.id+"/disclaimers?include=classes";
		disclaimerOptions.source =this.source; 
		return ENOXSourcingService.getDataPromise(disclaimerOptions);
	};
	
	Package.prototype.attachmentCheckin = function(checinTicketResp, file){
		let checkinTicket=checinTicketResp.data[0].dataelements.ticket;
		let url = checinTicketResp.data[0].dataelements.ticketURL;
		let options={};
		options.source = this.source;
		return new Promise(function(resolve,reject){

			ENOXSourcingPlatformServices.getCSRFToken(ENOXSourcingPlatformServices.getServiceURL((options.source)?options.source:'3DSpace'),options.source).then(function(){
				let formData = new FormData();
				formData.append('__fcs__jobTicket', checkinTicket);
				formData.append('file_0', file);

				WAFData.authenticatedRequest(url, {
					'method': 'POST',
					headers: {
					},
					data:formData,
					'onComplete': function(wsResponse) {
						resolve(wsResponse);
					},
					'onFailure': function(error, wsResponse) {
						if(wsResponse)
							if(ENOXSourcingService.isSessionExpired(wsResponse))return;
							reject(wsResponse);
					}
				});
			});
		},function(){ //error
			widget.notificationUtil.showError("Check later"+options.source);
		});
	};
	
	Package.prototype.getSharedReport = function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/share";
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);
	};
	
	Package.prototype.getProxyObject = function (options) {
			options.endpoint = "/resources/v1/modeler/dstdp/proxyObject";
			options.source = this.source;
			options.postData = options.proxyRequestData;
			return ENOXSourcingService.performPostPromise(options);
	};
	
	return Package;
});

