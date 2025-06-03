define('DS/ENOSpecMultiGrid/components/Triptych/MultiGridTriptychUtil',
		[	'DS/Controls/Abstract',
			'DS/ENOXTriptych/js/ENOXTriptych',
			'DS/XSRCommonComponents/utils/Constants',
		],
		
  function( Class,
		  	ENOXTriptych,
		  	Constants){
	
		"use strict";
		var MultiGridTriptych = Class.extend({
    	
			/** @options
			 * modelEvents
			 */
			init : function(options){
				this.triptychEvent = options.modelEvents;
				this.container = options.container ||  widget.body;
				this.triptychEvents = [];
				this.commandId="";
				this.itemId="";
				this.iconDiv="";
				this.launchFromIDCard=false;
				this.isRightPanelVisible = false;
				this.isLeftPanelVisible = false;
				this.isMiddlePanelVisible=false;
				this.currentTabKey="";
				this.appCore=options.appCore;
				this.isFullScreenMode=false;
				this.appCore=options.appCore;
				var that = this;
				if(this.triptychEvent){
					that.triptychEvents.push(that.triptychEvent.subscribe({event: Constants.EVENT_TRIPTYCH_PANEL_VISIBLE}, 
							function(side){
							 if (side === Constants.TRIPTYCH_SIDE_Right) {
								 that.isRightPanelVisible = true;
								 that.triptychEvent.publish({event : 'multigrid-right-panel-opened'});
							 } else if(side === Constants.TRIPTYCH_SIDE_Left){
								 that.isLeftPanelVisible = true;
							 }
						}));
					that.triptychEvents.push(that.triptychEvent.subscribe({event: Constants.EVENT_TRIPTYCH_RESIZE}, 
							function(data){
							 if(that.isMultiGridFullScreen()){
								 let rightSide = widget.body.clientWidth;
								 that.appCore.triptychManager.resizePanel(rightSide);		                   
			                     that.appCore.enoxTriptych._rightPanel.style.width = rightSide + "px";
			                     that.appCore.enoxTriptych._rightResizer.style.right = (rightSide - 4) + "px";
							 }
						}));
					that.triptychEvents.push(that.triptychEvent.subscribe({event: Constants.EVENT_TRIPTYCH_PANEL_HIDDEN}, 
						function(side){
							 if (side === Constants.TRIPTYCH_SIDE_Right) {
								 that.isRightPanelVisible = false;
								 that.triptychEvent.publish({event : 'multigrid-right-panel-closed'});
							 } else if(side === Constants.TRIPTYCH_SIDE_Left){
								 that.isLeftPanelVisible = false;
							 }
							 
					}));
					
					/*that.triptychEvents.push(that.triptychEvent.subscribe({
						event : Constants.EVENT_TRIPTYCH_RESIZE 
						}, function (data) {
			                  if (data < 550) {
			                	  that.triptychEvent.publish({
										event : Constants.TRIPTYCH_EVENT_HidePanel,
										data : Constants.TRIPTYCH_SIDE_Left
									});
			                  }
			                  else {
			                	  that.triptychEvent.publish({
										event : Constants.TRIPTYCH_EVENT_ShowPanel,
										data : Constants.TRIPTYCH_SIDE_Left
									});
			                  }

			          }));*/
				}
			},
			getCommandId:function(){
				return this.commandId;
			},			
			setCommandId:function(commandName){
				this.commandId=commandName;
			},
			setLaunchFromIcon:function(launchFromIDCard){
				this.launchFromIDCard=launchFromIDCard;
			},
			isLaunchFromIcon:function(){
				return this.launchFromIDCard;
			},
			isRightPanelOpen : function(){
				return this.isRightPanelVisible;
			},
			
			isLeftPanelOpen : function(){
				return this.isLeftPanelVisible ;
			},
			
			hideLeftPanel : function(){
				var that = this;
				this.isLeftPanelVisible = false;
				//if(this.container.getSize().width < 550){
					that.triptychEvent.publish({
						event : Constants.TRIPTYCH_EVENT_HidePanel,
						data : Constants.TRIPTYCH_SIDE_Left
						});
				//}
			},
			setItemId:function(itemId){
				this.itemId=itemId;
			},
			getItemId:function(){
				return this.itemId;
			},
			setIconDiv:function(iconDiv){
				this.iconDiv=iconDiv;
			},
			getIconDiv:function(){
				return this.iconDiv;
			},
			setCurrentTabKey:function(tabKey){
				this.currentTabKey=tabKey;
			},
			getCurrentTabKey:function(){
				return this.currentTabKey;
			},
			isMultiGridFullScreen:function(){
				return this.isFullScreenMode;
			},
			setMultiGridFullScreen:function(isFullScreen){
				 this.isFullScreenMode=isFullScreen;
			},
			_collapseLeftPanel : function(){
				var that = this;
				if(widget.body.getSize().width > 550){
					that.triptychEvent.publish({event : Constants.TRIPTYCH_EVENT_SetSize,
											data : { side : Constants.TRIPTYCH_SIDE_Left, size : 40 }
						});
				} else {
					that.triptychEvent.publish({event : Constants.TRIPTYCH_EVENT_HidePanel, data : Constants.TRIPTYCH_SIDE_Left });
				}
			},
			
			hideRightPanel : function(){
				this.isRightPanelVisible = false;
				this.triptychEvent.publish({event: Constants.TRIPTYCH_EVENT_HidePanel, 
					data: Constants.TRIPTYCH_SIDE_Right});

			},
			hidePanel : function(side){
				let sideToHide="";
				if(side=="middle"){
					this.isMiddlePanelVisible=false;
					sideToHide=Constants.TRIPTYCH_SIDE_Middle;
				}else if(side=="right"){
					this.isRightPanelVisible=false;
					sideToHide=Constants.TRIPTYCH_SIDE_Right;
				}else if(side=="left"){
					this.isLeftPanelVisible=false;
					sideToHide=Constants.TRIPTYCH_SIDE_Left;
				}			
				this.triptychEvent.publish({event: Constants.TRIPTYCH_EVENT_HidePanel, 
					data:sideToHide});
			},
			togglePanel : function(side){
				this.triptychEvent.publish({
					event: Constants.EVENT_TRIPTYCH_TOGGLE_PANEL,
					data: {
						side: side
					}
				});
			},
			resizePanel:function(size){
				this.triptychEvent.publish({
					event : Constants.TRIPTYCH_EVENT_SetSize,
					data : {
						side : Constants.TRIPTYCH_SIDE_Right,
						size : size || 400
					}
				});
			},
			showRightPanel : function(size) {
				this.triptychEvent.publish({
					event: Constants.EVENT_TRIPTYCH_TOGGLE_PANEL,
					data: {
						side: Constants.TRIPTYCH_SIDE_Right
					}
				});
				this.isRightPanelVisible=true;
				this.triptychEvent.publish({
					event : Constants.TRIPTYCH_EVENT_SetSize,
					data : {
						side : Constants.TRIPTYCH_SIDE_Right,
						size : size || 400
					}
				});
			},
			hideLeftPanel : function(){
				var that = this;
				this.isLeftPanelVisible = false;
				//if(this.container.getSize().width < 550){
					that.triptychEvent.publish({
						event : Constants.TRIPTYCH_EVENT_HidePanel,
						data : Constants.TRIPTYCH_SIDE_Left
						});
				//}
			},
			_expandLeftPanel : function(){
				this.triptychEvent.publish({
					event: Constants.TRIPTYCH_EVENT_ShowPanel,
					data : Constants.TRIPTYCH_SIDE_Left
				});
				
				this.triptychEvent.publish({
					event : Constants.TRIPTYCH_EVENT_SetSize,
					data : {
						side : Constants.TRIPTYCH_SIDE_Left,
						size : 250
					}
				});

			},
			
			addCheckBeforeClose : function(side, callback){
				this.triptychEvent.publish({
				event: Constants.TRIPTYCH_ADD_CHECK_BEFORE_CLOSE,
				data: {
						side: side,
						callback: callback
					}
				});
			},
			
			removeCheckBeforeClose : function(side){
			
				this.triptychEvent.publish({event: Constants.TRIPTYCH_REMOVE_CHECK_BEFORE_CLOSE , data: {side:side}});
			},
		
			
			destroy : function(){
				if(this.triptychEvents){
					this.triptychEvent.unsubscribeList(this.triptychEvents);
				}
			}
			
			
			
		});
    return MultiGridTriptych;
    }
);

