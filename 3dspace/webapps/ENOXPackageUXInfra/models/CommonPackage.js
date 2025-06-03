//XSS_CHECKED
/*eslint no-shadow: "off"*/
define('DS/ENOXPackageUXInfra/models/CommonPackage',
	[
		'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService'
	],
	function (ENOXSourcingService) {
	'use strict';


	var CommonPackage = function (){
		this.source = "3DSpace";
	};
	
	CommonPackage.prototype.getContents = function(options){
		var contentOptions = {};
		let includeParams = [];
		let includeClause = "";
		
		options.getFiles && includeParams.push(options.getFiles);
		options.getClasses && includeParams.push(options.getClasses);
		//options.getBOM && includeParams.push(options.getBOM);// Uncomment for bomdisplay
		if(includeParams.length > 0) {
			includeClause = "?include="+includeParams.toString();
		}
		contentOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/content"+includeClause;
		contentOptions.source =this.source; 
		return ENOXSourcingService.getDataPromise(contentOptions);
	};

	CommonPackage.prototype.addContent = function(options,patchData){
		var attachContentOptions = {};
		attachContentOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/content/attach";
		attachContentOptions.source =this.source; 
		attachContentOptions.addData = patchData;
		return ENOXSourcingService.createServicePromise(attachContentOptions);
	};
	
	CommonPackage.prototype.detachContent = function(options,deleteData){
		var detachContentOptions = {};
		detachContentOptions.endpoint = "/resources/v1/modeler/dstdp/packages/"+options.data.params.id+"/content/detach";
		detachContentOptions.source =this.source; 
		detachContentOptions.addData = { data : [{ "contentId": deleteData.id, connectLatestRevision: deleteData.connectLatestRevision }]};
		return ENOXSourcingService.createServicePromise(detachContentOptions);
	};
	
	return CommonPackage;
});

