//XSS_CHECKED
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageManagement/models/Publication',
		[
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService',
			'DS/WidgetServices/WidgetServices',
			'DS/WAFData/WAFData',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
			'DS/ENOXPackageUXInfra/models/CommonPublication'
			],
			function (ENOXSourcingService,WidgetServices,WAFData,ENOXSourcingPlatformServices,NLS,CommonPublicationModel) {
	'use strict';


	var Publication = function (){
		this.source = "3DSpace";
	};


	Publication.prototype.init = function(){
		//console.log("Publication init called");
	};
	
	Publication.prototype.list = function (options) {
		options.endpoint = "/resources/v1/modeler/dstdp/publications";
		options.source = this.source;
		ENOXSourcingService.getService(options);

	};	

	Publication.prototype.ListPublications = function (options) {
		options.endpoint = "/resources/v1/modeler/dstdp/publications?$top="+options.top+"&$skip="+options.skip+"";
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);

	};
	
	Publication.prototype.getContents = function(options){
		var contentOptions = {};
		let includeFiles = "?include=files";
		contentOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/content"+includeFiles;
		contentOptions.source =this.source; 
		return ENOXSourcingService.getDataPromise(contentOptions);
	};
	
	Publication.prototype.createPublication =function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/publications";
		options.source = this.source;
		return ENOXSourcingService.createServicePromise(options);

	};
	
	Publication.prototype.getLifeCycleDataProviderPromise =function(options){
		options.endpoint = "/resources/lifecycle/maturity/getStateGraph";
		options.lifeCycleData = options.getLifecyclePayload;
		options.source = this.source;
		return ENOXSourcingService.performLifeCycleAction(options);

	};
	
	Publication.prototype.deletePublication = function(options){
		options.endpoint = "/resources/v1/modeler/dstdp/publications/";
		options.source = this.source;
		return ENOXSourcingService.deleteServicePromise(options);
		
	};

	Publication.prototype.downloadZipFile = function(options){
		let commonPublicationModel = new CommonPublicationModel();
			commonPublicationModel.downloadZipFile(options);	
				
	};
	
	Publication.prototype.updatePublication = function(options){
		options.endpoint = "/resources/v1/modeler/dstdp/publications/"+options.id;
		options.source = this.source;
		return ENOXSourcingService.updateServicePromise(options);
	};
	
	Publication.prototype.getSharedReport = function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/publications/"+options.data.params.id+"/share";
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);
	};	
	Publication.prototype.getPassword = function(options){
		options.endpoint ="/resources/v1/modeler/dstdp/publications/"+options.id+"/password";
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);
	};
return Publication;
});

