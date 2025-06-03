/* global widget */
/**
 * In Case of onPremise enviornment tenant name should not be set to widget title and onCloud the tenant name should be visible.
 * On Object details page - Object Title should be visible.
 */
define('DS/ENOXPackageCommonUXInfra/UpdateWidgetTitle/UpdateWidgetTitle',
		[
		],
			function(){
	'use strict';

	var updateWidgetTitle = function(){};
	updateWidgetTitle.prototype.init = function(){
		widget.setTitle(" ");
	};

	updateWidgetTitle.prototype.updateTitle = function(objTitle){
		const widgetTitle = `${objTitle?objTitle:" "}`;
		widget.setTitle(widgetTitle);
	};
	
	return updateWidgetTitle;
});

