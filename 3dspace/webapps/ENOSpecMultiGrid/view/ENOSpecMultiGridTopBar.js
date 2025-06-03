define('DS/ENOSpecMultiGrid/view/ENOSpecMultiGridTopBar',
		[	'UWA/Core',
			'DS/Controls/TooltipModel',	
			'DS/ResizeSensor/js/ResizeSensor',
			'DS/ENOSpecMultiGrid/utils/Utils',
			'DS/XSRCommonComponents/utils/Constants',
			'i18n!DS/ENOSpecMultiGrid/assets/nls/ENOSpecMultiGrid',
			'css!DS/ENOSpecMultiGrid/ENOSpecMultiGrid.css'
		],
		
  function(UWA, WUXTooltip,ResizeSensor,Utils,Constants,NLS){
	'use strict'; 
	var MultiGridPageTopBar = function () { };

	MultiGridPageTopBar.prototype.initialize = function (options) {
		this.appCore = options.appCore;	
		this.baseTriptychManager=this.appCore?this.appCore.triptychManager:undefined;
		this.enoxTriptych=this.appCore.enoxTriptych;		
		this.container = options.container;
		this.initializeContainer();
		// init expand collapse iconbar			
		this.displayExpandCollapseIcon();
		this._resizerCallBack(this.topBarContainer);	
				
	};
	MultiGridPageTopBar.prototype._resizerCallBack=function(_container){
		  if(this.baseTriptychManager.isRightPanelVisible){
			var width =widget.body.getSize().width;
			/*if(isMobile){				
				this.handleExpandCollapseIcon(true);
			} else {	*/			
				this.handleExpandCollapseIcon(false);
			//}
		  }
	};
	MultiGridPageTopBar.prototype.handleExpandCollapseIcon=function(isSmallDevice){
		var context=this;
		var rightSide="";
	/*	if(false){
	    	context.topBarLeft.setStyle('display','none');
	    	
	    }else{*/
	    	context.topBarLeft.setStyle('display','inline-block'); 
	    	context.baseTriptychManager.hideLeftPanel();	        
	    //}

    };
	MultiGridPageTopBar.prototype.initializeContainer=function(){
	    var context=this;
	    context.topBarContainer=UWA.createElement("div", { "class":"multigrid-topbar-container"}).inject(context.container);
	    context.topBarLeft=UWA.createElement("div", { "class":"multigrid-topbar-left"}).inject(context.topBarContainer);
	    context.topBarMiddle=UWA.createElement("div", { "class":"multigrid-topbar-middle"}).inject(context.topBarContainer);
	    context.topBarRight=UWA.createElement("div", { "class":"multigrid-topbar-right"}).inject(context.topBarContainer);
	    context.appCore.multiGridMiddleTopBarDiv=context.topBarMiddle;
	};
	MultiGridPageTopBar.prototype.displayExpandCollapseIcon=function(isSmallDevice){	
		var context=this;
		
	   //if(!isMobile){
	    let collapseIconClassName="fonticon fonticon-2x fonticon-expand-left";
	    context.toggleIconSpan=UWA.createElement("span", { "class":collapseIconClassName}).inject(context.topBarLeft);
	    context.toggleIconSpan.addEventListener('click', context.toggleCollapseIcon.bind(context));	
	    context.toggleIconSpan.tooltipInfos = new WUXTooltip({shortHelp:NLS.label_Collapse});
	   // }
	    
	};
	MultiGridPageTopBar.prototype.toggleCollapseIcon=function(){
		var that=this;
		let multiGridTriptych=that.appCore.multigridTriptych;
		if(that.baseTriptychManager) {			      
			        let arrClassNames=that.toggleIconSpan.className.split(" ");
    				if(arrClassNames.indexOf("fonticon-expand-left")>-1){
    					multiGridTriptych.triptychManager.setMultiGridFullScreen(true);
    					let rightSide = widget.body.clientWidth;
                        that.baseTriptychManager.resizePanel(rightSide);		                   
                        that.enoxTriptych._rightPanel.style.width = rightSide + "px";
                        that.enoxTriptych._rightResizer.style.right = (rightSide - 4) + "px";
                        that.toggleIconSpan.className=that.toggleIconSpan.className.replace(/\bfonticon-expand-left\b/g,'');
    					that.toggleIconSpan.className+=" "+'fonticon-expand-right';
    					that.toggleIconSpan.tooltipInfos = new WUXTooltip({shortHelp:NLS.label_Expand});     
    				}else if(arrClassNames.indexOf("fonticon-expand-right")>-1){
    					multiGridTriptych.triptychManager.setMultiGridFullScreen(false);
    					Utils.resizeMultigrid(that.appCore,1,false,true);
	                    that.toggleIconSpan.className=that.toggleIconSpan.className.replace(/\bfonticon-expand-right\b/g,'');
    					that.toggleIconSpan.className+=" "+'fonticon-expand-left';
    					that.toggleIconSpan.tooltipInfos = new WUXTooltip({shortHelp:NLS.label_Collapse});
    				}
    				               
		}
	};
	
	
	MultiGridPageTopBar.prototype.destroy = function() {
		if(this.topBarContainer)this.topBarContainer.destroy();
	};

	return MultiGridPageTopBar;
}
);

