//XSS_CHECKED
/* global UWA */
/* global widget */
define('DS/ENOXPackageManagement/views/Package/ListAttachments',
		[
		 'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
		 'DS/UIKIT/SuperModal',
		 'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
		 'DS/Menu/Menu',
		 'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
		 'DS/ENOXPackageCommonUXInfra/Constants/ENOXPackageCommonConstants',
		 'DS/ENOXPackageCommonUXInfra/components/ModalWindowWrapper/ModalWindowWrapper',
		 'DS/ENOXPackageCommonUXInfra/service/ENOXTDPPlatformServices',
		 'WebappsUtils/WebappsUtils'
		 ],
		 function(XsourcingCollectionView, SuperModal, NLS, Menu, ENOXTDPConstants,ENOXCommonConstants,ModalWindowWrapper,ENOXTDPPlatformServices,WebappsUtils) {
	'use strict';

	var ListAttachments = function ListAttachments(controller) {
		this.controller = controller;
	};
	ListAttachments.prototype.render = function(options) {
		var that = this;
		
		if (options.data.length === 0) {
			let packageState = options.state;
			let validStates = [ENOXTDPConstants.state_inDraft,ENOXTDPConstants.state_inWork];
			if (validStates.some((state) => state === packageState)) {
				// create a button and inject into option.container
				if (options.isConnectedTable) {
					delete options.xsourcingCollectionViewDisclaimer;
				}
				else {
					delete options.xsourcingCollectionView;
				}
				let emptyContentOptions = options.emptyContentOptions;
				UWA.createElement('button', { 
					type: 'submit', 
					name: emptyContentOptions.name,
					id : emptyContentOptions.id,
					'class': 'btn btn-primary',
					text: emptyContentOptions.text,
					value: emptyContentOptions.value,
					events: {
						click: (e) => {
							let rect = e.target.getBoundingClientRect();
							let menuItems =  emptyContentOptions.onClickMenuItems;
							Menu.show(menuItems, {
								position : {
									x : rect.right,
									y : rect.bottom
								},
								submenu : 'outside'
							});
						}
					}
				}).inject(options.container);
			}
			else {
				options.container.empty();
			}
		}
		else {
			var xsourcingCollectionView = new XsourcingCollectionView();
			if (options.isConnectedTable) {
				options.xsourcingCollectionViewDisclaimer=xsourcingCollectionView;
			}
			else {
				options.xsourcingCollectionView=xsourcingCollectionView;
			}
			//options.container.style.height = 'auto';
	//		options._container = options._triptychWrapper.getMainPanelContainer();
			options.views = ["Tile"];
			options.showToolbar = options.hasOwnProperty('showToolbar')?options.showToolbar:true;
			options.sort=[{
				id: "tree",
				text: NLS.title,
				type: "string"
			}];
			options.rowSelection='single';
			options.toolbarActions = [];
			
			if(options.isExpanderRequired){
				options.expander = {
					expanderHeader:options.expanderHeader,
					expandedFlag:true
				};
			}
	
			options.onContextualEventCallback = function onContextualEvent(params) {
				var selectedNode;
				if(params){
					var node = ( params.cellInfos && params.cellInfos.nodeModel) ? params.cellInfos.nodeModel : null;
					var rowID = ( params.cellInfos)  ? params.cellInfos.rowID : null;
					if(rowID ===-1 || !node){
						return this._contextualMenuBuilder ? this._contextualMenuBuilder.buildMenu(params, options) : [];
					}
					var model = params.cellInfos.nodeModel?params.cellInfos.nodeModel: params.cellInfos.cellModel;
					if(model)
						selectedNode = model;
				}
						
				var menu = [{
									id: "preview",
									type: 'PushItem',
									title: NLS.preview,
									icon: "eye",
									action: {
										callback: function () {
											that.launchPreview(selectedNode);
										}
									}
								},{
					id: 'downloadDocument',
					type: 'PushItem',
					title: NLS.download,
					fonticon: {
						content: 'wux-ui-3ds wux-ui-3ds-download'
					},
					action : {
						callback: function(){
							if(selectedNode){
		
								var downloadOptions = {};
							
									downloadOptions.docName=selectedNode.options.label;
									downloadOptions.docId= selectedNode.options.grid.orignalId;
										that.controller.model.downloadDocument(downloadOptions).then(function(){
											widget.notificationUtil.showInfo(downloadOptions.docName+" "+NLS.download_message);
										},function(){
											widget.notificationUtil.showError(NLS.document_download_failed_message);
										});
								
							}
						}
					}
				}];
				if(options.modifyAccess && (options.state && (options.state===ENOXTDPConstants.state_inWork || options.state===ENOXTDPConstants.state_inDraft))){
					menu.push({
						id: 'removeDocument',
						type: 'PushItem',
						title:NLS.delete,
						fonticon: {
							content: 'wux-ui-3ds wux-ui-3ds-trash'
						},
						action : {
							callback: function(){
								let calledFromDisclaimer = false;
								if(that.controller.disclaimerData.length>0) {
									calledFromDisclaimer = that.controller.connectedTableView._gridModel.getSelectedNodes().length>0;
								}
								var superModal = new SuperModal({renderTo : widget.body, okButtonText: NLS.delete, cancelButtonText: NLS.cancel});
								var deleteMsg = '';
								if(selectedNode) {
									deleteMsg = selectedNode.options.label;
								} else if(calledFromDisclaimer) {
									deleteMsg = 1+" "+NLS.disclaimers;
								} else {
									deleteMsg = 1+" "+NLS.worksheets;
								}
								
								superModal.confirm(NLS.delete_confirmation,NLS.delete+" - "+deleteMsg, function (result) {
									if(result) {
										let deleteData = [];
										if(calledFromDisclaimer) {
											deleteData.push({disclaimerId: selectedNode.getAttributeValue("objectId")});
											let deleteOptions = {
												id: that.controller.options.id,
												//documentName: node.options.label,
												data: {data: deleteData},
												collectionViewEvents:that.controller.connectedTableView.collectionViewEvents
											};
											that.controller.removeDocument(deleteOptions,!calledFromDisclaimer);
											selectedNode.remove();
										} else {
											deleteData.push({worksheetId: selectedNode.getAttributeValue("objectId")});
											let deleteOptions = {
												id: that.controller.options.id,
												//documentName: node.options.label,
												data: {data: deleteData},
												collectionViewEvents:that.controller.worksheetTableView.collectionViewEvents
											};
											that.controller.removeDocument(deleteOptions,!calledFromDisclaimer);
											selectedNode.remove();											
										}
									}
								});
							}
						}
					});
				}
				return menu;
			};
			
			options.applicationChannelEvents=[];
			options.applicationChannelEvents.push({
				eventName:"add-document"
			});
	
			if(options.hasConnectedObjectFiles)
				options.disableNoDataMessage=true;
	
			xsourcingCollectionView.init(options);
			
			xsourcingCollectionView.collectionViewEvents.subscribe({event:'xsourcing-collectionview-selection-updated'},function(data){
				if(data.selectedNodes.length>0){
					if(options.hasConnectedObjectFiles){
						if(options.isConnectedTable)
							options.applicationChannel.publish({event:'unselectAllContextTableFiles',data:null});
						else
						options.applicationChannel.publish({event:'unselectAllConnectedTableFiles',data:null});
					}
					xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'remove'});
					xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-enable-toolbar-button',data:'downloadDocument'});
				}else{
					xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'downloadDocument'});
					xsourcingCollectionView.collectionViewEvents.publish({event:'xsourcing-collectionview-disable-toolbar-button',data:'remove'});
				}
			});
		}
	};
	
	ListAttachments.prototype.launchPreview = function(selectedNode) {
			let modalWrapper = new ModalWindowWrapper({
				app: {
					widget: widget
				},
				width: '98%',
				draggable: true,
				resizable: true,
				escapeToClose: true,
				onHideCB: () => modal.destroy(),
				classNames: 'document-preview-modal'
			});
			let modal = modalWrapper.getModal();
			modal.show();
			let header = selectedNode.options.label  ? selectedNode.options.label : "Preview";
			modal.setHeader(header); 
			this.canvas = UWA.createElement('div', {
				"class": "viewer-canvas"
			});
			this.canvas.inject(modal.getBody());
			let _3DPlayData = {
				"asset": {
					"provider": "EV6",
					"dtype": ENOXCommonConstants.DOCUMENT,
					"serverurl": ENOXTDPPlatformServices.getServiceURL(ENOXCommonConstants.SERVICE_3DSPACE),
					"tenant": ENOXTDPPlatformServices.getPlatformId(),
					"contextId": widget.getValue('SC')
				},
				"physicalId": selectedNode.options.grid.orignalId,
				"renderTo": this.canvas
			};
			_3DPlayData.asset.physicalid = _3DPlayData.physicalId;
			_3DPlayData.renderTo.empty();
			_3DPlayData.renderTo.setAttribute('fileName', _3DPlayData.fileName);
			let viewData = {
				input: {
					asset: _3DPlayData.asset
				},
				options: {
					loading: 'autoplay'
				}
			};
			let player = UWA.createElement('iframe').inject(_3DPlayData.renderTo);
			player.style.position = 'absolute';
			player.style.width = '100%';
			player.style.height = '100%';
			player.style.border = '0px';
			player.style.top = '30px';
			player.style.left = '0px';
			player.allowFullScreen = true;
			player.addEventListener("load", function (e) {
				try {
					let canvasdiv = e.target.contentDocument.getElementById('canvas-div');
					canvasdiv.style.backgroundColor = 'white';
				} catch (error) {
					let infoOptions = {
						sticky: false,
						allowUnsafeHTML: false,
						level: "error",
						title: error,
						subtitle: ""
					};
					window.notiflddNotif(infoOptions);
				}
			});
			let domainURL = WebappsUtils.getProxifiedWebappsBaseUrl();
			if (!domainURL)
				domainURL = WebappsUtils.getWebappsBaseUrl();

			player.src = domainURL + "/3DPlayHelper/3DPlaySyndication.html?params=" + encodeURI(JSON.stringify(viewData));
		};

	return ListAttachments;
});
