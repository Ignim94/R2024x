define('DS/ENOSpecMultiGrid/attributes/view/MultiGridAttributeView',[
	'UWA/Core',
	'UWA/Class',
	'DS/ENOSpecMultiGrid/view/Properties',
	'DS/XSRCommonComponents/createform/view/NewDialog',
	'i18n!DS/ENOSpecMultiGrid/assets/nls/MultiGridAttribute', 
	'css!DS/ENOSpecMultiGrid/attributes/MultiGridAttributes.css'
], function(UWA,
		Class,	
		Properties,
		Dialog,
		NLS){
	
	'use strict';
	
	var MultiGridAttributeView = Class.extend({
		
		init : function(options){
			 this._parentView = options;
			 this.gridEditContainer=options.gridEditContainer;
			 this.appCore=options.appCore;
			 this.gridModelEvents=options.modelEvents;
		},	
		
		_showEmptyView : function(){
			this._emptyContentMsg.setStyle('display' , 'flex');
				
		},		
		_hideEmptyView : function(){	
		   this._emptyContentMsg.setStyle('display' , 'none');
		},
		
		emptyMsg : function() { 
			this._emptyContentMsg = UWA.createElement("div", { "class": "multi-edit-grid wux-datagridview-emptycontentmessage"});
			var noObjMsg = UWA.createElement("div");
			noObjMsg.innerHTML= NLS.Message_EmptyGrid;
			noObjMsg.inject(this._emptyContentMsg);
			this._emptyContentMsg.setStyle('left' ,'10%');
			this._emptyContentMsg.setStyle('height' ,'calc(100% - 50px)');
			this._emptyContentMsg.setStyle('width' ,'100%');
			this._emptyContentMsg.setStyle('display' ,'none');
			this._emptyContentMsg.inject(this.gridEditContainer);
			return this._emptyContentMsg;
		},
		
	    renderInformationPanel:function(itemModel,iconDiv,grid){
			let options={appCore:this.appCore,itemModel:itemModel,iconDiv:iconDiv,grid:grid,gridModelEvents:this.gridModelEvents}
	    	let infoPanel=new Properties(options);
	    	infoPanel.render(options);
		},
		
		confirmationBox : function(objDetails,objectExtensionModels,interfacesToBeRemoved,okCallback){
			let iOptions = {};
			let that=this;			
			let msgContainer = new UWA.Element('div',{'class':'RemoveExt-Dialog-Option-Container'});
			let removeMessageIcon = new UWA.Element('div',{'class':'remove-ext-message-icon'}).inject(msgContainer);
			let icon = new UWA.Element('span',{'class':'remove-ext-message-icon fonticon fonticon-attention fonticon-1x'}).inject(removeMessageIcon);
			let messageContainer = new UWA.Element('p',{'class':'message-container'}).inject(removeMessageIcon);
            let attributesDisplayName=[];
            interfacesToBeRemoved.forEach(function(interfaceName){
            	let attributeModels=objectExtensionModels[interfaceName];
            	attributeModels.forEach(function(attributeModel){
            		attributeModel.select();
            		attributesDisplayName.push(attributeModel.getDisplayName());
            	});            	
            });
			
			iOptions.position ={ at : 'center', my : 'center'};
			iOptions.Title = NLS.label_RemoveExtension;
			iOptions.Content = msgContainer;
			if(attributesDisplayName.length==1){				
				messageContainer.innerHTML = NLS.replace(NLS.get('Message_Confirmation_SingleAttrRemove'), {
					attribute: attributesDisplayName[0],
					objTitle : objDetails.title,
					objRevision: objDetails.revision
				}); 
			}else if(attributesDisplayName.length>1){
				messageContainer.innerHTML = NLS.replace(NLS.get('Message_Confirmation_ManyAttrRemove'), {
					attribute: attributesDisplayName[0],
					objTitle : objDetails.title,
					objRevision: objDetails.revision
				}); 
			}	
				iOptions.Content = msgContainer;
			
			iOptions.width = 450;
			iOptions.height = 150;
			iOptions.renderTo =this.gridEditContainer;
			iOptions.RemoveApplyButton = true;
			iOptions.OKLabel = NLS.label_Button_Ok;
			var dialog= new Dialog(iOptions);
			dialog.render();
			dialog._dialog.buttons.Ok.disabled = false;
			dialog.listenTo(dialog, 'EVENT_CLICK_SPEC_OK', function(){				
				dialog.closeDialog();
				okCallback();
				
			});
		},
	}); 		
	return MultiGridAttributeView;
});

