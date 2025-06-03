//XSS_CHECKED
/* global widget */
/**
 * @license Copyright 2017 Dassault Systemes. All rights reserved.
 *
 * @overview Empty Content View
 *
 * @author SPO1

 */
define('DS/ENOXPackageCommonUXInfra/EmptyContent/ENOXPackageEmptyContent',
		[
			'DS/ENOXEmptyContent/js/ENOXEmptyContent',
			'DS/Controls/Button',
			'DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
			'css!DS/ENOXPackageCommonUXInfra/EmptyContent/ENOXPackageEmptyContent.css'
			],
			function(ENOXEmptyContent, WUXButton, ENOXSourcingDataDragAndDrop){
	'use strict';

	var ENOXSourcingEmptyContent = function(){};

	ENOXSourcingEmptyContent.prototype.init = function(options){
		var that = this;
		that.options = options;
		that._tokens = [];
		that._applicationChannel = widget.app._applicationChannel;
		that._router = options.router;
		that._emptyContentArea = options.emptyContentArea;
		that.initEmptyContent(that);
		options.fromEmptyView = true;
		if(options.disableDroppableArea===undefined || options.disableDroppableArea===false){
			var dataDragAndDrop = new ENOXSourcingDataDragAndDrop();
			dataDragAndDrop.makeAreaDroppable(options);
		}
	};

	ENOXSourcingEmptyContent.prototype.initEmptyContent = function(){
		var that = this;
		var searchForContentBtn = new WUXButton({
			label: that.options.emptyDataButtonLabel,
			emphasize:'primary',
			icon: { iconName: that.options.emptyDataButtonIcon}
		});
		var params = {
                sentences: [{
                    type: 'dom',
                    DOMelement: searchForContentBtn.getContent(),
                    events: { 
                        onclick: function () {
                        	that.options.emptyDataButtonCallback();
                        }
                     }
                    }],
                fontSize: '16px',
                orderedListType: 'none',
                modelEvents: that._applicationChannel
        };

		if(that.options.disableDroppableArea===undefined || that.options.disableDroppableArea===false)
		{
			var droppableField={
                        type: 'drop',
                        text: that.options.dropIconLabel
                	 };
			params.sentences.push(droppableField);
			
		
	}

		var emptyView = new ENOXEmptyContent(params);
		emptyView.inject(that._emptyContentArea);
	};

	return ENOXSourcingEmptyContent;
});
