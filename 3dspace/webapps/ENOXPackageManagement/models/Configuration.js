define('DS/ENOXPackageManagement/models/Configuration',
	   [
		   'DS/ENOXPackageCommonUXInfra/service/ENOXTDPService'
],
       function (ENOXSourcingService) {
	'use strict';


	var configuration = function (){
	this.source = "3DSpace";

	};

	configuration.prototype.init = function(){
		
	};
	configuration.prototype.getElementsRequired = function (options) {
        options.endpoint ="/resources/v1/modeler/dstdp/configuration/elementsRequired";
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);
	};
	configuration.prototype.updateElementsRequired = function (options) {
        options.endpoint ="/resources/v1/modeler/dstdp/configuration/elementsRequired";
		options.source = this.source;
		return ENOXSourcingService.updateServicePromise(options);
	};
	configuration.prototype.getSettings = function (options) {
        options.endpoint ="/resources/v1/modeler/dstdp/configuration/settings?include="+options.setting;
		options.source = this.source;
		return ENOXSourcingService.getDataPromise(options);
	};
	configuration.prototype.updateSettings = function (options) {
        options.endpoint ="/resources/v1/modeler/dstdp/configuration/settings";
		options.source = this.source;
		return ENOXSourcingService.updateServicePromise(options);
	};
	return configuration;
});
