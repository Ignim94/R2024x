define ('DS/ENOSpecMultiGrid/view/ENOSpecMultiGridPaneView', [
		'UWA/Core',
		'UWA/Class/View',
		'DS/ENOSpecMultiGridCommon/utils/SpecMultiGridEvents',
		'DS/ENOSpecMultiGrid/view/ENOSpecMultiGridTopBar',
		 'DS/Controls/TooltipModel',
		 'DS/ENOSpecMultiGrid/utils/Utils',
		 'DS/XSRCommonComponents/utils/Constants',
		 'DS/ENOSpecMultiGrid/control/ENOSpecMultiGridTabManager',
		'DS/ENOSpecMultiGrid/components/Triptych/MultiGridTriptych',
		'DS/ResizeSensor/js/ResizeSensor',
		'i18n!DS/ENOSpecMultiGrid/assets/nls/ENOSpecMultiGrid',
		'css!DS/ENOSpecMultiGrid/ENOSpecMultiGrid.css',
		'css!DS/UIKIT/UIKIT.css',          
		

], function(UWA,
		View,
		MultiGridModelEvents, 
		ENOSpecMultiGridTopBar,
		WUXTooltipModel,
		Utils,
		Constants,
		MultiGridTabManager,
		MultiGridTriptych,
		ResizeSensor,
		NLS) {
	'use strict';
	
	var ENOSpecMultiGridPaneView = View.extend({
		/** @options
		 * itemNodes (optional) -  list of itemNodes to launch view
		 */
		setup : function(options){
			this._parentView = options;
			this.selectedItems = (options && options.selectedItems) ? options.selectedItems : undefined ;
			this.container=(options &&options.target)?options.target:undefined;
			this.appCore=(options&&options.appCore)?options.appCore:undefined;
			this.xsrBasicModelEvents=this.appCore.basicModelEvents;
			this.mainContainer=options.mainContainer;
		},
		
		render : function(options){
			
			this.mContainer = this.container;
			this.baseModelEvents = new MultiGridModelEvents();
			var context = this;
			context.appCore.currentView = Constants.VIEW_MULTI_EDIT;
			context.eventsSusb=[];
			var	mainContainer = new UWA.createElement('div', {'class' : 'multigrid-container'}).inject(context.mContainer);
			var	leftPanel = new UWA.createElement('div', {'class' : 'multigrid-left-panel'}).inject(mainContainer);
			var	middlePanel = new UWA.createElement('div', {'class' : 'multigrid-middle-panel'}).inject(mainContainer);		
			var	rightPanel = new UWA.createElement('div', {'class' : 'multigrid-right-panel'}).inject(mainContainer);
			context.itemNodes=[];
			if(context.selectedItems){
				context.selectedItems.forEach(function(selectedItem){
					context.itemNodes.push(selectedItem.getID());
				});
			}
			// triptych initialization - start 
			var tOptions = {};
			tOptions.modelEvents = context.baseModelEvents;
			tOptions.container = mainContainer;
			tOptions.leftPanel = leftPanel;
			tOptions.middlePanel = middlePanel;
			tOptions.rightPanel = rightPanel;
			tOptions.appCore=context.appCore;
			var triptych = new MultiGridTriptych(tOptions)
			// triptych initialization - end 
			triptych.initialize();
			context.appCore.multigridTriptych=triptych;
			context.appCore.multigridModelEvents=context.baseModelEvents;
			triptych.triptychManager.hideLeftPanel();
			context.baseTriptychManager=context.appCore.triptychManager;
			context.baseTriptychManager.setResetSearch(false);
			context.baseTriptychManager.setCommandId(Constants.TOOLBAR_CMD_MULTIGRID);
			context.landingPageToolbarEvents=context.appCore.toolBarModelEvents;
			if(context.landingPageToolbarEvents){
				context.landingPageToolbarEvents.publish({
					event : Constants.COLLECTION_TOOLBAR_COMMAND_TOGGLE,
					data : {hide:true}
				});
			}
			
			if(context.baseTriptychManager){
                context.baseTriptychManager.hideLeftPanel();
			}
			context.managePanes();
			
			var renderMiddlePanel = function() {
				
				context.contentView = UWA.createElement("div", { "class": "multigrid-middle-panel-container"}).inject(middlePanel);				
				context.multiGridTopBar=new ENOSpecMultiGridTopBar();
				let topBarOptions={appCore:context.appCore,container:context.contentView};
				context.multiGridTopBar.initialize(topBarOptions);	
				let tabOptions={selectedItems:context.selectedItems,container:context.contentView,gridModelEvents:context.baseModelEvents,appCore:context.appCore};
				context.multiGridTabView = new MultiGridTabManager(tabOptions);
				context.multiGridTabView.render();
			}
			
			renderMiddlePanel();
			triptych.triptychManager.setMultiGridFullScreen(false);
			context.resizor=new ResizeSensor(context.mainContainer, function(){
				setTimeout(function(){context._resizerCallBack(context.mainContainer,false)},500);
			});
			context.eventsSusb.push(context.xsrBasicModelEvents.subscribe({event: 'xsr-right-panel-closed'}, 
					function(){
				context.destroy();
			}));
		},
	   
		removeSubscriptions:function(){
			if(this.eventsSusb) this.xsrBasicModelEvents.unsubscribeList(this.eventsSusb);
			
		},
		_resizerCallBack:function(resizorContainer,allowDecrease){
			let context=this;
			let isFullScreenMode=context.appCore.multigridTriptych.triptychManager.isMultiGridFullScreen();
			if(isFullScreenMode){
				context.appCore.multigridModelEvents.publish({event :Constants.EVENT_TRIPTYCH_RESIZE,
					data : 0});
			}else{
			Utils.resizeMultigrid(context.appCore,1,allowDecrease);
			}
		},
		managePanes:function(){
		    let context=this;
		    //if the widget width is less than 550 or in case of Mobile,all other panes will be hidden
		    /*let isMobile=RequestUtil.getTouchMode();
			if(isMobile){
				let rightSide = widget.body.clientWidth;
				context.baseTriptychManager.resizePanel(rightSide);						
				context.appCore.enoxTriptych._rightPanel.style.width = rightSide + "px";
				context.appCore.enoxTriptych._rightResizer.style.right = (rightSide - 4) + "px";
                
			}else{*/
				let expanderIcon=document.querySelector('.welcome-panel .fonticon-expand-right');
				if(expanderIcon){
					let arrClassNames=expanderIcon.className.split(" ");
    				if(arrClassNames.indexOf("fonticon-expand-right")>-1){
    					expanderIcon.className=expanderIcon.className.replace(/\bfonticon-expand-right\b/g,'');
    					expanderIcon.className+=" "+'fonticon-home';
    					expanderIcon.setAttribute('title',NLS.label_Home);
    				}
				}
				
			//}	
		},
	    destroy:function(){
	    	this.appCore.currentView = null;
	    	if(this.landingPageToolbarEvents){
	    		this.landingPageToolbarEvents.publish({
					event : Constants.COLLECTION_TOOLBAR_COMMAND_TOGGLE,
					data : {hide:false}
				});
			}
	    	if(this.resizor)this.resizor.detach();
	    	if(this.multiGridTabView)this.multiGridTabView.destroy();
	    	this.baseTriptychManager.setResetSearch(true);
	    	this.baseTriptychManager.setCommandId("");
	    	this.appCore.multigridTriptych.triptychManager.setMultiGridFullScreen(false);
	    	this.removeSubscriptions();
	    	if(this.mainContainer)this.mainContainer.empty();
	    }
		
	});
	return ENOSpecMultiGridPaneView;
});
