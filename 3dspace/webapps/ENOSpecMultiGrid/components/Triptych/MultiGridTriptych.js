define('DS/ENOSpecMultiGrid/components/Triptych/MultiGridTriptych',
		[	'DS/Controls/Abstract',
			'DS/ENOXTriptych/js/ENOXTriptych',
			'DS/ENOSpecMultiGrid/components/Triptych/MultiGridTriptychUtil'
		],
		
  function( Abstract,
		  	ENOXTriptych,
		  	MultiGridTriptychUtil){
	
		"use strict";
		var MultiGridTriptych = Abstract.extend({
    	
			/** @options
			 * modelEvents
			 * container
			 * leftPanel (DOM element)
			 * middlePanel (DOM element)
			 * rightPanel (DOM element)
			 */
			init : function(options){
				var iModelEvents = options.modelEvents;
				var iContainer = options.container;
				this.iLeft = options.leftPanel;
				this.iMiddle = options.middlePanel;
				this.iRight = options.rightPanel;
				
				var appCore = options.appCore;
				
				
				
				this.triptychManager =  new MultiGridTriptychUtil({modelEvents : iModelEvents,appCore:options.appCore}); 
				
    		
				this.triptychOptions = {};
				this.triptychOptions.withtransition = true;
			
				/*this.triptychOptions.left = {
						resizable : false,
						minwidth:0,
						width:0,
						withClose : false,
						overMobile : false
				};*/
				this.triptychOptions.right = {
						resizable : true,
						minWidth : 200,
						originalState : 'close',
					withClose : true,
					overMobile : true
				};
 
				this.triptychOptions.modelEvents = iModelEvents;
				this.triptychOptions.container = iContainer;
				
			},
    
			initialize : function(){
			
				var mTriptych = new ENOXTriptych().init(
						this.triptychOptions, 
						null, 
						this.iMiddle,
						this.iRight);
				return mTriptych;
			}
		});
    return MultiGridTriptych;
    }
);

