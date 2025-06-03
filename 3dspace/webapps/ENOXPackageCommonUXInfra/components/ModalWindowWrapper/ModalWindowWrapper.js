define('DS/ENOXPackageCommonUXInfra/components/ModalWindowWrapper/ModalWindowWrapper', [
    'DS/UIKIT/Modal',
    'DS/UIKIT/SuperModal',
    'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
    'css!DS/ENOXPackageCommonUXInfra/components/ModalWindowWrapper/ModalWindowWrapper.css'
], function(UIModal, 
		SuperModal,NLS) {
    'use strict';

    var elmnt, dragContainer, pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    function dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		if (e.type === "touchstart") {
			pos3 = e.touches[0].clientX;
			pos4 = e.touches[0].clientY;
		} else {
			pos3 = e.clientX;
			pos4 = e.clientY;
		}
		dragContainer.addEventListener("mouseup",
				closeDragElement, false);
		dragContainer.addEventListener("touchend",
				closeDragElement, false);
		dragContainer.addEventListener("mousemove",
				elementDrag, false);
		dragContainer.addEventListener("touchmove",
				elementDrag, false);
	}

	function elementDrag(e) {
		e = e || window.event;
		e.preventDefault();
		if (e.type === "touchmove") {
			pos1 = pos3 - e.touches[0].clientX;
			pos2 = pos4 - e.touches[0].clientY;
			pos3 = e.touches[0].clientX;
			pos4 = e.touches[0].clientY;
		} else {
			pos1 = pos3 - e.clientX;
			pos2 = pos4 - e.clientY;
			pos3 = e.clientX;
			pos4 = e.clientY;
		}
		elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		dragContainer.removeEventListener("mouseup",
				closeDragElement);
		dragContainer.removeEventListener("touchend",
				closeDragElement);
		dragContainer.removeEventListener("mousemove",
				elementDrag);
		dragContainer.removeEventListener("touchmove",
				elementDrag);
	}
    
    var ModalWindowWrapper = function(options) {
        var that = this;
    	this.options = options;
        this.app = options.app;
        this.controller = options.controller;
        let classNames = 'x-sourcing-modal wizard';
        if(options.classNames)classNames += ' ' + options.classNames;
        this.modalComponent = new UIModal({
            className: options.popupClassName?options.popupClassName:classNames,
            escapeToClose: options.escapeToClose,
            header: options.header,
			footer:options.footer,
            body: '',
            animate: true,
            events: { // use handle events method
                onHide: function () {
                	if(options.draggable) {
                    	that.makeModalUndraggable();        	
                    }
                	
                	//Please note onHideCB should be the last thing to execute as it can contain code to destroy() modal
                	if(options.onHideCB){
                		options.onHideCB();
                	}
                },
                onShow: function(){
                	if(options.draggable) {
                    	that.makeModalDraggable(options.contentWidth);        	
                    }
                	if(options.resizable) {
                    	that.makeModalResizable();        	
                    }
                }
            }
        }).inject(options.popupContainer?options.popupContainer:that.app.widget.body);
    };

    ModalWindowWrapper.prototype.getModal = function() {
		return this.modalComponent;
    };
    
    ModalWindowWrapper.prototype.makeModalDraggable = function(width) {
    	pos1 = 0;
    	pos2 = 0;
    	pos3 = 0;
    	pos4 = 0;
    	elmnt = this.modalComponent.elements.content;
    	dragContainer = this.modalComponent.elements.header;
    	dragContainer.style.cursor="move";
    	elmnt.style.position = "absolute";
    	elmnt.style.width = width?width:"90%";
    	
		dragContainer.addEventListener("mousedown", dragMouseDown,
				false);
		dragContainer.addEventListener("touchstart", dragMouseDown,
				false);
	};
	
	ModalWindowWrapper.prototype.makeModalUndraggable = function() {
		pos1 = 0;
    	pos2 = 0;
    	pos3 = 0;
    	pos4 = 0;
    	
		dragContainer.removeEventListener("mousedown", dragMouseDown);
		dragContainer.removeEventListener("touchstart", dragMouseDown);
	};
	
	ModalWindowWrapper.prototype.makeModalResizable = function () {
		let modalContentElem = this.modalComponent.elements.content;
        
        modalContentElem.style.resize = "both";
		modalContentElem.style.width = this.options.width?this.options.width:"90%";
		modalContentElem.style['min-height'] = this.options.minimumHeight?this.options.minimumHeight:"425px";
		modalContentElem.style['max-height'] = "800px";
		modalContentElem.style['min-width'] = "320px";
		if(window.matchMedia("(max-height: 400px)").matches) {
			modalContentElem.style.height = this.options.height?this.options.height:"100vh";
			this.modalComponent.elements.body.style['min-height'] = "150px";
		}
		else {
			modalContentElem.style.overflow = "hidden";
			modalContentElem.style.height = this.options.height?this.options.height:"calc(100vh - 10px)";	//changed from 75vh to 380px for RFXMAN-2821 (issue for CR also)			
		}
		modalContentElem.style.display = "flex";
		modalContentElem.style["flex-direction"] = "column";
		this.modalComponent.elements.body.style.height = "100%";
	};
	
	ModalWindowWrapper.prototype.showPreventCloseDialog = function (options) {
		var that = this;
		var superModal = new SuperModal({
			renderTo : options.renderTo || that.app.widget.body,
			className : 'wizard-dialog'
		});
		superModal.dialog({
			body: options.body,
			title: options.title,
			buttons: [
				{
					className: 'default',
					value: options.actionBtnLabel,
					action: function (supermodal) {
						supermodal.hide();
						options.action();
						that.app._applicationChannel.publish({event:"preventCloseDialog-wizard", data:{button:"actionButton"}});
					}
				},
				{
					className: 'primary',
					value: NLS.CLOSE_BUTTON,
					action: function (supermodal) {
						supermodal.hide();
						that.modalComponent.hide();
						that.app._applicationChannel.publish({event:"preventCloseDialog-wizard", data:{button:"closeButton"}});
					}
				},
				{
					className: 'default',
					value: NLS.CANCEL_BUTTON,
					action: function (supermodal) {
						supermodal.hide();
						that.app._applicationChannel.publish({event:"preventCloseDialog-wizard", data:{button:"cancelButton"}});
					}
				}
			]
		});
	};
	
    return ModalWindowWrapper;
});
