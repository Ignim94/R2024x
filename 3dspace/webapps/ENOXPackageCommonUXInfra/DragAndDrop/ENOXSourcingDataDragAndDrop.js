//XSS_CHECKED
 /* eslint-disable no-new */
/* global widget */
/* eslint no-console: "off" */
/*eslint no-else-return: "off"*/
/*eslint no-useless-return: "off"*/
/**
 * @license Copyright 2017 Dassault Systemes. All rights reserved.
 *
 * @overview Drag Drop Functionality

 */
define('DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop',
		[
			'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
			'DS/DataDragAndDrop/DataDragAndDrop',
			'DS/ENOXPackageCommonUXInfra/DragAndDrop/DnDInvite/DnDInvite',
			'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
			'DS/ENOXPackageCommonUXInfra/NotificationsUtil/NotificationsUtil',
			'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
			'css!DS/ENOXPackageCommonUXInfra/DragAndDrop/ENOXSourcingDataDragAndDrop.css'
		],
			function(NLS, DataDragAndDrop, DnDInvite, ENOXSourcingPlatformServices, NotificationsUtil, ENOXSourcingConstants){
	'use strict';

	var ENOXSourcingDataDragAndDrop = function(){};

	ENOXSourcingDataDragAndDrop.prototype.makeAreaDroppable = function(options){
		var that = this;
		that.options = options;
		that._applicationChannel = widget.app._applicationChannel;
		that._dropArea = that.options.dropArea;
		that._inviteHandler = options.inviteHandler?options.inviteHandler:that.initDnDView(that._dropArea);// Pass as disable if not required, otherwise don't pass
		that.isEmptyView =  !!that.options.fromEmptyView;
		var dragEvent = {
				enter: function (el, event) {
					that.dragEnteredCallback(el, event);
				},
				leave: function (el, event) {
					that.dragLeaveCallback(el, event);
				},
				over: function (el, event) {
					that.dragOverCallback(el, event);
				},
				drop: function (data, el, event) {
					that.itemDroppedCallback(data, el, event);
				}
			};

		DataDragAndDrop.droppable(that._dropArea, dragEvent);

		that._destroyToken = that._applicationChannel.subscribe({event:"xsrc-destroy-drop-token"},that.cleanDroppable.bind(that));		
	};

	ENOXSourcingDataDragAndDrop.prototype.itemDroppedCallback = function(dropData){
		var that = this;
		if (!that.isEmptyView && that._inviteHandler !== 'disable')
			that._inviteHandler.hide();
		that._dropArea.classList.remove("dragging");
		//mge29:not able to reproduce usecase, so kept the check as it is
		if(event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length>0){//To support drag from desktop onPremise
			(ENOXSourcingConstants.ONPREMISE === ENOXSourcingPlatformServices.getPlatformId())?
					(event.dataTransfer.files.length>1?//Blocks dropping of multiple objects
							widget.notificationUtil.showError(NLS.drop_single_object):
								that.options.onDropCallback(event.dataTransfer.files)):
						widget.notificationUtil.showError(NLS.invalid_object_dropped);
		}else{//To support drag from search
		var parsedData = null;
		var srcObj = undefined;
		try {
            parsedData = JSON.parse(dropData);
          } catch (e) {
				widget.notificationUtil.showError(NLS.parse_drop_data_failed);
	            return;
          }
		
		var items = parsedData.data.items;
		
		if(that.options.dropStrategy === "OPEN" || that.options.dropStrategy === "CREATE"){
			if(that.options.multiObjs) {
				srcObj = items;
			}
			else {
				if(!items){
					widget.notificationUtil.showError(NLS.invalid_object_dropped);
				}
				if(items.length > 1){
					widget.notificationUtil.showWarning(NLS.drop_one_object);
				}
				srcObj = items[0];
			}
		}
		that.validatePlatformAndDropObject(parsedData,srcObj);
		}
	};
	
	ENOXSourcingDataDragAndDrop.prototype.dragEnteredCallback = function(){
		var that = this;

		if (!that.isEmptyView  && that._inviteHandler !== 'disable') {
			that._inviteHandler.addBorder();
			that._inviteHandler.show(that.getOnDropLabel());
          }
	    if (!that._dropArea.classList.contains("dragging")) {
	    	that._dropArea.classList.add("dragging");
	      }
	};
	
	ENOXSourcingDataDragAndDrop.prototype.dragLeaveCallback = function(){
		var that = this;
		setTimeout(function () {
            if (!that.isEmptyView && that._inviteHandler !== 'disable')
            	that._inviteHandler.hide();
            
            if (that._dropArea.classList.contains("dragging")) {
            	that._dropArea.classList.remove("dragging");
            }
         }, 200);
	};
	
	ENOXSourcingDataDragAndDrop.prototype.dragOverCallback = function(){
		var that = this;
		if (!that.isEmptyView && that._inviteHandler !== 'disable')
			that._inviteHandler.show(that.getOnDropLabel());
		if (!that._dropArea.classList.contains("dragging")) {
        	that._dropArea.classList.add("dragging");
        }
	};
	
	ENOXSourcingDataDragAndDrop.prototype.cleanDroppable = function () {
		DataDragAndDrop.clean(this._dropArea);
		this._applicationChannel.unsubscribe(this._destroyToken);
	};

	ENOXSourcingDataDragAndDrop.prototype.makeDraggable = function (element, dragEvent) {
		DataDragAndDrop.draggable(element, dragEvent);
	};

	ENOXSourcingDataDragAndDrop.prototype.initDnDView = function(container){
        var invite = new DnDInvite({
          renderTo: container
        });
        invite.hide();
        return invite;
      };

	ENOXSourcingDataDragAndDrop.prototype.getOnDropLabel = function(){
		var that = this;
	    switch (that.options.dropStrategy) {
	        case "OPEN":
	          return 'drop';
	        case "CREATE":
	          return 'insert';
	        default:
	          return 'insert';
	      }
	    };
	ENOXSourcingDataDragAndDrop.prototype.validatePlatformAndDropObject = function(parsedData,srcObj){
		var that = this;
		widget.notificationUtil = NotificationsUtil;
		var droppedPlatformId = ENOXSourcingPlatformServices.getPlatformId();
		var draggedPlatformId = parsedData.data.items[0].envId;
        if(ENOXSourcingConstants.DND_PLATFORM_VALIDATION_EXCLUSIONS.includes(parsedData.source) || droppedPlatformId === draggedPlatformId)
        {
        	that.options.onDropCallback(srcObj);
        }
        else{
	        widget.notificationUtil.showError(NLS.invalidPlatform+droppedPlatformId);
	        return;
        }
        
	};

	return ENOXSourcingDataDragAndDrop;
});
