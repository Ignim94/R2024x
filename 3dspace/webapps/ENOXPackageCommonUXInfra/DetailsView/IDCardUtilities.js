//XSS_CHECKED
/* global widget */
define('DS/ENOXPackageCommonUXInfra/DetailsView/IDCardUtilities', [
],
  function() {
	'use strict';
	var IDCardUtilities = function () { };
	
	IDCardUtilities.prototype.idcardHomeButtonHandler = function(){
		this.options.applicationChannel ? this.options.applicationChannel.publish({ event: 'welcome-panel-expand' }) : widget.app._applicationChannel.publish({ event: 'welcome-panel-expand' }); 
		this.options.applicationChannel ? this.options.applicationChannel.publish({ event: 'information-panel-close', data: '' }) : widget.app._applicationChannel.publish({ event: 'information-panel-close', data: '' });
		let defaultRoute = widget.getValue("defaultRoute");
		widget.setRefreshViewParams('xpflLastVisitedRoute',JSON.stringify({name:defaultRoute}));
		widget.app.router.navigate(defaultRoute,{}, {reload: true});
	};
	
	IDCardUtilities.prototype.idcardBackButtonHandler = function(options){
		options.applicationChannel ? options.applicationChannel.publish({ event: 'welcome-panel-expand' }) : widget.app._applicationChannel.publish({ event: 'welcome-panel-expand' });  
		this.options.applicationChannel ? this.options.applicationChannel.publish({ event: 'information-panel-close', data: '' }) : widget.app._applicationChannel.publish({ event: 'information-panel-close', data: '' });
		var lastVisitedRouteName=widget.getValue("lastVisitedRouteName");
		var previousRoutesLenght=JSON.parse(widget.getRefreshViewParams(lastVisitedRouteName)).previousRoutes.length;
		if(previousRoutesLenght>=0){
			var previousRouteDetails=JSON.parse(widget.getRefreshViewParams(lastVisitedRouteName)).previousRoutes[previousRoutesLenght-1];
			//options.router.navigate(previousRouteDetails.route,previousRouteDetails.params, {reload: true});
			if(previousRouteDetails.params!==undefined)
				previousRouteDetails.params.fromBackButton = true;
			widget.app.router.navigate(previousRouteDetails.name,previousRouteDetails.params?previousRouteDetails.params:previousRouteDetails, {reload: true});
		}else{
			widget.app.router.navigate(options.defaultRoute,{}, {reload: true});
		}
		
	};
	
	IDCardUtilities.prototype.idcardInfoButtonHandler = function(){
		var informationIcon = this.mIDCardContainer._idCardContainer.querySelector('.information-icon');
		if (informationIcon !== null) {
			if(!informationIcon.className.contains('active')){
				informationIcon.classList.add('active');
				this.options.applicationChannel ? this.options.applicationChannel.publish({ event: 'information-panel-open', data: 'right' }) : widget.app._applicationChannel.publish({ event: 'information-panel-open', data: 'right' });
			}else{
				informationIcon.classList.remove('active');
				this.options.applicationChannel ? this.options.applicationChannel.publish({ event: 'information-panel-close', data: '' }) : widget.app._applicationChannel.publish({ event: 'information-panel-close', data: '' });
			}
		}
	};
	return IDCardUtilities;
});
