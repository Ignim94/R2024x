/**
 * @license Copyright 2017 Dassault Systemes. All rights reserved.
 *
 * @overview : UX RFQ List View
 *
 * @author TDP

 */

define('DS/ENOXPackageManagementUX/views/TDPDashboard', [
	'DS/CoreEvents/ModelEvents',
	'UWA/Core',
	'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement'
	], function(ModelEvents,UWA,NLS) {

	'use strict';
	var TDPDashboard = function(){};

	TDPDashboard.prototype.init = function (options) {
		this._applicationChannel = options._applicationChannel;
		this._myContentEvents = new ModelEvents();
		this.platformServices = options.platformServices;
		this.router = options.router;
		this._options = {};
		this._options._triptychWrapper = options._triptychWrapper;
		
		this.loadDashboard(options);
		//this._subscribeToEvents();	
	};

	TDPDashboard.prototype._subscribeToEvents = function(){
		
	};

	TDPDashboard.prototype.loadDashboard = function (options) {
		this._noObjectSelectedDiv = UWA.createElement('div', {
			id : 'no-object-found',
			'class': 'emptyContainerStyle',
			html : NLS.Information_Empty_Message
		});


		var emptySection = UWA.createElement('p', {});

		emptySection.inject(this._noObjectSelectedDiv);
		//this._applicationChannel.publish({ event: 'triptych-set-content', data: { side: 'middle', content: this._noObjectSelectedDiv } });
		options._triptychWrapper.getMainPanelContainer().appendChild(this._noObjectSelectedDiv);
	};

	return TDPDashboard;
});
