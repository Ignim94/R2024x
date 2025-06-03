/* global widget */
/* global UWA */
define('DS/ENOXPackageManagement/helpers/CommonHelper',
    [
	'i18n!DS/ENOXPackageManagement/assets/nls/ENOXPackageManagement',
	'i18n!DS/ENOXPackageCommonUXInfra/assets/nls/ENOXPackageCommonUXInfra',
	'DS/ENOXPackageCommonUXInfra/components/ModalWindowWrapper/ModalWindowWrapper',
	'DS/ENOXPackageCommonUXInfra/PropertiesView/EditPropertiesWidgetWrapper',
	'DS/ENOXPackageManagement/Constants/ENOXTDPConstants',
	'DS/ENOXPackageCommonUXInfra/xsourcingCollectionView/xsourcingCollectionView',
	'DS/UIKIT/Mask',
	'DS/ENOXPackageCommonUXInfra/CommonUtils/CommonUtils',
	'DS/ENOSubscriptionMgmt/Commands/Subscribe',
	'DS/ENOSubscriptionMgmt/Commands/UnSubscribe',
	'DS/ENOSubscriptionMgmt/Commands/EditSubscribe',
	'DS/ENOSubscriptionMgmt/Commands/MySubscriptions'
	],
    function(NLS,NLSInfra,ModalWindowWrapper,EditPropertiesWidgetWrapper,ENOXTDPConstants,XsourcingCollectionView,UIMask,CommonUtils,Subscribe, UnSubscribe, EditSubscribe,MySubscriptions) {
        'use strict';

        let commonHelper = function commonHelper() {};

		commonHelper.prototype.getInfoData = function(nodeModel){
			let fields = [{
				disable: true,
				label: NLS.type,
				placeholder: NLS.type,
				type: "labelValue",
				value: NLSInfra[nodeModel.options.grid.type]?NLSInfra[nodeModel.options.grid.type]:
					nodeModel.options.grid.type
			},{
				disable: true,
				label: NLS.name,
				placeholder: NLS.name,
				type: "labelValue",
				value: nodeModel.options.grid.name
			},{
				disable: true,
				label: NLS.description,
				placeholder: NLS.description,
				type: "labelValue",
				value: nodeModel.options.grid.description
			},{
				disable: true,
				label: NLS.maturity_state,
				placeholder: NLS.maturity_state,
				type: "labelValue",
				value: nodeModel.options.grid.stateDisplay
			},{
				disable: true,
				label: NLS.owner,
				placeholder: NLS.owner,
				type: "labelValue",
				value: nodeModel.options.grid.owner
			},{
				disable: true,
				label: NLS.creation_date,
				placeholder: NLS.creation_date,
				type: "labelValue",
				value: nodeModel.options.grid.created
			},{
				disable: true,
				label: NLS.modified_date,
				placeholder: NLS.modified_date,
				type: "labelValue",
				value: nodeModel.options.grid.modified
			}];
			let objectData = {
				attributes: [
					{name: NLS.name, value: nodeModel.options.grid.name},
					{name: NLS.creation_date, value: nodeModel.options.grid.created},
					{name: NLS.owner, value: nodeModel.options.grid.owner}
				],
				image: nodeModel.options.grid.image,
				name: nodeModel.options.grid.title
			};
			return {
				fields: fields,
				objectData: objectData
			};
		};
		commonHelper.prototype.updateInfoPanel = function(listObject) {
			let that = listObject;
			let selectedNodeIds = widget.getValue("selectedNodeIds");
			if (selectedNodeIds !== undefined && selectedNodeIds.length > 0) {
				let collectionView = that.xsourcingCollectionView._xsourcingCollectionViewUI;
				collectionView._selectedItems = [];
				if(collectionView._allData.length > 0) {
					collectionView._selectedItems = collectionView._allData.filter(function(itemData){return selectedNodeIds.indexOf(itemData.grid.id)!==-1;});
					collectionView._gridModel.getRoots().forEach((root) => {
						if(root.getAttributeValue("id") === selectedNodeIds[0]) {
							root.select();
						}
						var painterIcon = document.querySelector('#sourcinginfoicon');
						var iconContainer = painterIcon.getChildren()[0];	
						iconContainer.addClassName('enox-collection-toolbar-filter-activated');
					});
				}
			}
		};
		
		commonHelper.prototype.getFacetTabs = function(detailsViewOptions, options,tabNo) {
			let that = this;
			//Do Not Remove Commented Code 
			/*let memberView = detailsViewOptions.membersView;
			if(ENOXSourcingPlatformServices.getPlatformId() !== ENOXSourcingConstants.ONPREMISE) {
				detailsViewOptions.tabConfiguration.push({ 	label: NLSInfra.members, 
					content: memberView.render(),
					index: tabNo ,
					value:"access",
					icon : {iconName: 'users', fontIconFamily: 1}
				});
			}
			if(ENOXSourcingPlatformServices.getPlatformId() === ENOXSourcingConstants.ONPREMISE) {*/
				if(options.data.respParams.hasIPRole==="true"){
							detailsViewOptions.tabConfiguration.push({ label: NLS.IPProtection, 
							content: that.getIPProtectionTabContainer(options),
							index: tabNo,
							value:"ipProtection",
							icon : {iconName: 'vault', fontIconFamily: 1}
						});	
				}
				detailsViewOptions.tabConfiguration.push({
					label: NLS.tab_sharing,
					content: that.getShareTabContainer(options),
					index: tabNo+1,
					value: "ShareToCollabSpace",
					icon: { iconName: 'forward', fontIconFamily: 1 }
				});
				detailsViewOptions.tabConfiguration.push({
					label: NLS.tab_relations,
					content: that.getRelationsTabContainer(options),
					index: tabNo+2,
					value: "relationsDiv",
					icon: { iconName: 'object-related', fontIconFamily: 1 }
				});
			//}
		};
		
		commonHelper.prototype.getRelationsTabContainer = function (options) {
			let relationsContainer = UWA.createElement('div', {
				id: 'relationsDiv',
				styles: {
					'position': 'relative'
				}
			});
			relationsContainer.style.height = '100%';
			let viewOptions = {
				container: relationsContainer,
				facets: ["FACET_RELATIONS"],
				showIdCard: false
			};
			let dataOptions = {objectId: options.id};
			let editPropertiesWidgetWrapper = new EditPropertiesWidgetWrapper({ viewOptions: viewOptions, dataOptions: dataOptions });
			editPropertiesWidgetWrapper.render();
			UIMask.unmask(relationsContainer);
			return relationsContainer;
		};
		
		commonHelper.prototype.getShareTabContainer = function (options) {
				let shareContainer = UWA.createElement('div', {
					id: 'shareDiv',
					styles:{
						'position': 'relative'
					}
				});
				shareContainer.style.height = '100%';
				let viewOptions = {
						container: shareContainer,
						facets: ["FACET_SHARING"],
						showIdCard: false
				};
				let dataOptions = {objectId: options.id};
				let editPropertiesWidgetWrapper = new EditPropertiesWidgetWrapper({ viewOptions: viewOptions, dataOptions: dataOptions });
				editPropertiesWidgetWrapper.render();
				return shareContainer;
		  };
		commonHelper.prototype.getIPProtectionTabContainer = function (options) {
				let ipProtectionContainer = commonHelper.prototype.createExpanderUWADiv('ipProtection');
				ipProtectionContainer.style.height = '100%';
					let viewOptions = {
						container: ipProtectionContainer,
						facets: ["FACET_IPPROTECTION"],
						showIdCard: false
					};
					let dataOptions = { objectId: options.data.params.id };
					let editPropertiesWidgetWrapper = new EditPropertiesWidgetWrapper({ viewOptions: viewOptions, dataOptions: dataOptions });
					editPropertiesWidgetWrapper.render();
				return ipProtectionContainer;
			};
		commonHelper.prototype.createExpanderUWADiv = function(id){
			var uwaDiv = UWA.createElement('div', {
				id:id,
				styles:{
					'position': 'relative'
				}
			});
			return uwaDiv;
		};
		commonHelper.prototype.prepareModal = function(container, headerText, modalHeight = '100px') {
			let modalButtons = UWA.createElement('span', {
				id : 'modalButtons',
				'class': 'modal-buttons'
			});
	
			UWA.createElement('button', { type: 'submit', 
				name:'create',
				id : 'createBtn',
				form: 'myForm',
				'class': 'btn btn-primary',
				text: NLS.create,
				value: NLS.create
			}).inject(modalButtons);
			UWA.createElement('button', { type: 'reset', 
				id : 'closeModalBtn',
				'class': 'btn btn-default',
				text: NLS.cancel,
				value: NLS.cancel,
				events: {
					click: function(){
						modal.destroy();
					}
				}
			}).inject(modalButtons);
			let modalWrapper = new ModalWindowWrapper({app: {widget:widget}, draggable: true, resizable: true, escapeToClose: false, height: modalHeight, width:'100%',onHideCB: () => modal.destroy()});
			let modal = modalWrapper.getModal();
			modal.show();
			modal.setHeader(headerText);
			container.inject(modal.getBody());
	 		modalButtons.inject(modal.getFooter());
			widget.getElement(".xSourcingForm").setAttribute("id", "myForm");
			return modal;
		};
		
		commonHelper.prototype.getInfoIcon = function(options) {
			return (
				[
					{
						"id" : "sourcinginfoicon",
						"text" : 'Information',
						fonticon : 'info',
						disabled : true,
						handler : function()
						{
							var painterIcon = document.querySelector('#sourcinginfoicon');
							var iconContainer = painterIcon.getChildren()[0];
							//var currentIconClassName=iconContainer.className;
							if(!iconContainer.className.contains('enox-collection-toolbar-filter-activated'))
							{
								// Add the blue color on the icon when it selected
								//iconContainer.removeAttribute('class');
								iconContainer.addClassName('enox-collection-toolbar-filter-activated');
								options.applicationChannel.publish({ event: 'information-panel-open', data: 'right' });
							}else{
								iconContainer.removeClassName('enox-collection-toolbar-filter-activated');
								options.applicationChannel.publish({ event: 'information-panel-close', data: '' });
							}
	
						}
					}
	        	]
			);
		};
		
		commonHelper.prototype.initCollectionsAndDropOptions = function(thatRef) {
			let that = thatRef;
			let options = that.options;
			
			options.commonDropOptions = {
				applicationChannel: options.applicationChannel,
				dropStrategy: "OPEN",
				onDropCallback: (droppedObj) => {
					if(droppedObj.objectType === ENOXTDPConstants.Type_Package) {
						options.router.navigate("home.PackageDetails",{id:droppedObj.objectId,title:droppedObj.displayName});
					}
					else if(droppedObj.objectType === ENOXTDPConstants.Type_Publication) {
						options.router.navigate("home.PublicationDetails",{id:droppedObj.objectId,title:droppedObj.displayName});
					}	
					else {
						widget.notificationUtil.showError(`"${droppedObj.displayType || droppedObj.objectType}" ${NLSInfra.unsupported_type}.
							${NLS.drag_drop_error_message} "${NLS.TDP_CollaborationPackage}" ${NLS.or} "${NLS.TDP_PackagePublication}"`);
					}	
				}
			};
			return options;
		};
		
	commonHelper.prototype.getTrackDistributionTab = async function(options){
		
		let that = this;
		let shareContainer = options.shareContainer;
		UIMask.mask(shareContainer, NLS.loading_track_distribution);
		options.publicationShareContentData = await options.model.getSharedReport(options).catch(() => {
			widget.notificationUtil.showError(NLS.loading_track_distribution_failed);
			UIMask.unmask(shareContainer);
		});
		shareContainer.style.height='98%';
		that.sharePublicationCollectionView = new XsourcingCollectionView();
		let sharePublicationOptions = {
			_mediator: options._mediator,
			rowSelection: 'none',
			container: shareContainer,
			views: ["Grid"],
			showToolbar: true,
			sort:[{
				id: "shared_to",
				text: NLS.shared_to,
				type: "string"
			}],			
			showNodeCount: true,
			uniqueIdentifier: "sharePublication"
		};
		sharePublicationOptions.columnsConfigurations = [
			{
				"text": NLS.shared_at,
				"dataIndex": "tree",
				"minWidth": 50,
				getCellSemantics: function(cellInfos){
	        		var iconPath = cellInfos.nodeModel.options.grid.grouped ? cellInfos.nodeModel.options.grid.tree : cellInfos.nodeModel.options.grid.icon;
	        		return {
	        			icon:{ 
	        				"iconPath" : require.toUrl(iconPath),
	        				"iconSize":{
	        					height: "25px",
	        					width: "25px"
	        				}
	        			}
	        		};
	        	},
				getCellValue: function(cellInfos){
	        		return cellInfos.nodeModel.options.grid.grouped ? cellInfos.nodeModel.options.grid.tree : cellInfos.nodeModel.options.grid.shared_at;	
	        	}
			},
			{
				"text": NLS.shared_to,
				"dataIndex": "shared_to"
			},
			{
				"text": NLS.shared_as_name,
				"dataIndex": "shared_as_name"
			},
			{
				"text": NLS.shared_as_type,
				"dataIndex": "shared_as_type"
			},
      		{
				"text": NLS.shared_on_date,
				"dataIndex": "shared_on_date"
			},
			{
				"text": NLS.owner,
				"dataIndex": "owner"
			},
			{
				"text": NLS.shared_by,
				"dataIndex": "shared_by"
			},
			{
				"text": NLS.revoked_on,
				"dataIndex": "revoked_on"
			}
		];	
		sharePublicationOptions.data = options.publicationShareContentData.data.map((node)=>{
			return {
				grid: {
					shared_at: node.sharedAt,
					shared_to: node.sharedTo,
					shared_as_name: node.sharedAsName,
					shared_as_type: node.sharedAsType,
					shared_on_date: CommonUtils.getDateStringForDisplay(new Date(node.sharedOnDate)),
					owner: node.owner,
					shared_by: node.sharedBy,
					icon: node.sharedIcon,
					revoked_on: node.revokedOn ? CommonUtils.getDateStringForDisplay(new Date(node.revokedOn)) : ""
				}
			};
        });		
		that.sharePublicationCollectionView.init(sharePublicationOptions);
		that.sharePublicationCollectionView._gridModel.expandAll();
		
		UIMask.unmask(shareContainer);
		return shareContainer;		
	};
		commonHelper.prototype.processSubscriptions = function(actionName,options) {
			
			var targetNodes = options.xsourcingCollectionView._gridModel.getSelectedNodes().map(function (nodeModel) {
			let sType = nodeModel.options.grid.actualType;
			let selectedType = sType;//ENOXTDPConstants.EMPTY_STRING;
				return {   			
					physicalid: nodeModel.options.grid.id, 
					type: selectedType,
					getID : function () {
						return nodeModel.options.grid.id;
					},
					getType: function(){
						return selectedType;
					}
				};
			});
		
			var context = {
				getSelectedNodes: () => targetNodes                     
			};
			
			var subscriptionCmd;
			if(actionName ===ENOXTDPConstants.SUBSCRIBE) {
				subscriptionCmd = new Subscribe({
				'ID': 'SubscribeCmdHdr',
				'context': context
				});
			} else if(actionName ===ENOXTDPConstants.UNSUBSCRIBE) {
				subscriptionCmd = new UnSubscribe({
				'ID': 'UnSubscribeCmdHdr',
				'context': context
				});
			} else if(actionName ===ENOXTDPConstants.EDIT_SUBSCRIPTION) {
				subscriptionCmd = new EditSubscribe({
				'ID': 'EditSubscriptionCmdHdr',
				'context': context
				});
			}
			subscriptionCmd.execute(options);
		};
	commonHelper.prototype.populateSubscriptionToolbarMenus = function(fromMenu,options){
			var that=this;
			var toolbarSubscriptionMenus = [];
			toolbarSubscriptionMenus.push({
				id : "subscribe",
				text : NLS.Subscribe,
				title: NLS.Subscribe,
				type: 'PushItem',
				fonticon: fromMenu === "contextualMenu"? {content: 'wux-ui-3ds-bell-add wux-ui-3ds'} : "bell-add",
				//disabled : true,
				handler:function() {
					that.processSubscriptions(ENOXTDPConstants.SUBSCRIBE,options);
					},
				action: {
							callback: function() {
								that.processSubscriptions(ENOXTDPConstants.SUBSCRIBE,options);
								
							}
						}
				});
			

			toolbarSubscriptionMenus.push({
				id : "Unsubscribe",
				text : NLS.Unsubscribe,
				title:  NLS.Unsubscribe,
				type: 'PushItem',
				fonticon: fromMenu === "contextualMenu"? {content: 'wux-ui-3ds-bell-delete wux-ui-3ds'} : "bell-delete",
				//disabled : true,
				handler:function() {
					that.processSubscriptions(ENOXTDPConstants.UNSUBSCRIBE,options);
				},
				action: {
							callback: function() {
								that.processSubscriptions(ENOXTDPConstants.UNSUBSCRIBE,options);
								
							}
						}					
			});
			
			toolbarSubscriptionMenus.push({
				id : "EditSubscription",
				text : NLS.Edit_Subscriptions,
				title: NLS.Edit_Subscriptions,
				type: 'PushItem',
				fonticon: fromMenu === "contextualMenu"? {content: 'wux-ui-3ds-bell-pencil wux-ui-3ds'} :"bell-pencil",
				//disabled : true,
				handler:function() {
					that.processSubscriptions(ENOXTDPConstants.EDIT_SUBSCRIPTION,options);
				},
				action: {
							callback: function() {
								that.processSubscriptions(ENOXTDPConstants.EDIT_SUBSCRIPTION,options);
								
							}
						}					
			});

			toolbarSubscriptionMenus.push({
				id : "MySubscription",
				text : NLS.My_Subscriptions,
				title: NLS.My_Subscriptions,
				type: 'PushItem',
				fonticon: fromMenu === "contextualMenu"? {content: 'wux-ui-3ds wux-ui-3ds-bell'} : "bell",
				handler:function() {
					var mySubscriptionsCmd = new MySubscriptions({
					'ID': 'MySubscriptionsCmdHdr'
					});
					mySubscriptionsCmd.execute(options);
				},
				action: {
							callback: function() {
								var mySubscriptionsCmd = new MySubscriptions({
									'ID': 'MySubscriptionsCmdHdr'
								});
								mySubscriptionsCmd.execute(options);
							}
						}				
			});			
			return toolbarSubscriptionMenus;
		};
   		return commonHelper;
    });
