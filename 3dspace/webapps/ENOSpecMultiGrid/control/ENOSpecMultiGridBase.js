define('DS/ENOSpecMultiGrid/control/ENOSpecMultiGridBase', [
		'UWA/Core',
		'UWA/Promise',
		'DS/Controls/Abstract',
		'DS/CoreEvents/ModelEvents',
		'DS/ENOSpecMultiGrid/view/ENOSpecMultiGridPaneView',
		'DS/XSRCommonComponents/utils/RequestUtil',
		'i18n!DS/ENOSpecMultiGrid/assets/nls/ENOSpecMultiGrid',
		'css!DS/ENOSpecMultiGrid/ENOSpecMultiGrid.css'
	], function (
		 UWA, Promise, Abstract, XspecEvents,MultiGridPaneView,RequestUtil,NLS) {

	'use strict';

	var ENOSpecMultiGridBase = Abstract.extend({	
		init : function (options) {
			
				this._parent(options);
				this.selectedItems=options.itemNodes;
				this.appCore=(options&&options.appCore)?options.appCore:undefined;
				this.splitViewPrevPane=options.container;
			    this.rightPaneContainer=options.rightPaneMainContainer;
				this.multiEditMainContainer= UWA.createElement('div', {'id': 'multiEdit-main-div'});
				this.multiEditMainContainer.inject(this.splitViewPrevPane);
				let tOptions = {};
				tOptions.target =this.multiEditMainContainer;
				tOptions.selectedItems= this.selectedItems;
				tOptions.appCore=this.appCore;
				tOptions.mainContainer=this.rightPaneContainer;
			
				this.mutiGridPane=new MultiGridPaneView(tOptions).render();
			
				 	
			}
	});
	return ENOSpecMultiGridBase;

});
