define('DS/SpecRawMaterial/control/NewRawMaterial', [
	'UWA/Controls/Abstract',
    'DS/XSRCommonComponents/components/XPLMNew/XSRNewPLMCmd',
	"DS/XSRCommonComponents/components/XPLMNew/XSRNewContentOptions",
	'DS/XSRCommonComponents/utils/Notification',
	'DS/XSRCommonComponents/utils/XSRMask',
	'i18n!DS/SpecRawMaterial/assets/nls/SpecRawMaterial'
], function ( Abstract, XSRNewPLMCmd,XSRNewContentOptions,Notification,Mask, NLS) {
	'use strict';

	var CreateRawMaterial = Abstract.extend({

		init: function (iOptions) {
			this._parent(iOptions);
			this.basicModelEvents = iOptions.appCore.basicModelEvents;
			this.target = iOptions.appCore.specMainContainer;
			this.onCreateSuccess = iOptions.onCreateSuccess;
			this.parentId = iOptions.parentId;
			this.dAttr = [];
			if(this.parentId && this.parentId.length>0){
				this.dAttr.push({
					name : "UsageDimension" // to handle the insert usecase by including usage field in modeler
				});
			}
			 var that = this;

            let plmCmdOpts = {
				typeDB : "Raw_Material",
                newType : "xsrRawMaterial",
				dialogHeader : NLS.NewRawMaterial,
				parentId : this.parentId,
				domainAttributes : this.dAttr,
				facetsKey : [XSRNewContentOptions.XSR_FACET_MAP.RELEASE_SNAP_TEMP_FACET,
                XSRNewContentOptions.XSR_FACET_MAP.MATERIAL_FACET,
				XSRNewContentOptions.XSR_FACET_MAP.CALSSIFICATION_FACET ],
				callbacks : {onSuccess : function (response) {
					
					if(response.status === "success"){
						let rData = response.result[0];
						let msg =  NLS.RMCreateSuccess
						Notification.displayNotification({
							msg: msg,
							eventID: 'success'
						});

						if (that.onCreateSuccess){
							let relId;
							let rels = rData.relations;
							let id = rData.identifier; // for create the physical id is passed
							if(rels){
								relId = rels[0].relationshipID; // for insert connection id is passed
								id = rels[0].toID;
							}
							that.onCreateSuccess(id,rData.type,relId);
						}
							
					}
					

				},onFailure: function (info) {
					console.log(info);
					
					Notification.displayNotification({
						msg: NLS.RMCreateFailure,
						eventID: 'error'
					});
					Mask.unmaskLoader(widget.body);
					
				},onCancel: function (info) {
					console.log(info);
					console.log("object creation cancelled");
				}
			}
			};
			this.newContent = new XSRNewPLMCmd(plmCmdOpts);

		},

        execute: function(){
            this.newContent.execute();
        }

	});
	return CreateRawMaterial;
});
