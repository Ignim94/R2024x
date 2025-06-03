define('DS/ENOSpecMultiGrid/utils/Utils', [
	'UWA/Core',
	'UWA/Class',
	'DS/XSRCommonComponents/utils/RequestUtil',
	'css!DS/ENOSpecMultiGrid/ENOSpecMultiGrid.css'
], function (Core, Class,RequestUtil) {

	  var Utils = Class.singleton({
		
		
		activateInfoIcon:function(container){			
			
				let arrClassNames=container.className.split(" ");
				if(arrClassNames.indexOf("infoIconActive")==-1)
					container.className+=" "+'infoIconActive';
			 
		},
		
		deactivateInfoIcon:function(container){		
			if(container!=null&& typeof container=='object'){
				container.className=container.className.replace(/\binfoIconActive\b/g,'');
			 }
			
	   },
		
		resizeMultigrid:function(appCore,widthDivider,allowDecrease,force){
			let that=this;
			let mainAndRightwidth = widget.body.getSize().width -appCore.triptychManager.getLeftPanelMinWidth()- 5;
            let isTouchMode=RequestUtil.getTouchMode();
            let isMobileMode=RequestUtil.isMobile();
            var rightWidth;
            if(isTouchMode||isMobileMode){
             rightWidth = Math.floor((mainAndRightwidth * 67) / 100);   	
            }else{
             rightWidth = Math.floor((mainAndRightwidth * 78) / 100);               
            }
            let size=Math.floor(rightWidth / widthDivider);
            if ((Math.floor(rightWidth / widthDivider) < appCore.splitView._container.clientWidth)&&!force) {
                if (allowDecrease)
                	appCore.triptychManager.resizePanel(size);
            } else
            	appCore.triptychManager.resizePanel(size);
		}
		
	});

	return Utils;
});
